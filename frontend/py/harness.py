"""
Avaliador dos exercícios. Roda no navegador (Pyodide, dentro de um Web Worker) e nos
testes do projeto (Python comum): o mesmo arquivo nos dois lugares.

Entrada (JSON): { fonteTeste, funcoes, codigo }. Saída (JSON):
  { "ok": true, "resultado": { resultados, passou, falhou, completo } }
  { "ok": true, "resultado": { "erro": { tipo, mensagem } } }   (sintaxe/execução ao carregar)
  { "ok": false, "tipo": "recursos" | "execucao", "mensagem"? }

O tempo limite NÃO é controlado aqui: quem chama (js/validador.js) encerra o worker.

Cuidados com o código do aluno:
  - roda num espaço de nomes separado, com `builtins` reduzidos (sem open, exec, eval,
    compile, input...) e `import` restrito a módulos seguros;
  - as comparações dos testes só aceitam tipos nativos EXATOS: um objeto com `__eq__`
    "sempre verdadeiro" (ou uma subclasse de list/int/str) nunca passa por `igual`;
  - tudo o que o aluno imprime é descartado.
"""

import builtins
import json
import sys

LIMITE_DETALHE = 200
LIMITE_RECURSAO = 500

MODULOS_PERMITIDOS = frozenset(
    {
        "math", "collections", "itertools", "functools", "heapq", "bisect", "string",
        "operator", "typing", "copy", "fractions", "statistics", "random", "dataclasses",
        "enum", "re",
    }
)
BUILTINS_PROIBIDOS = frozenset(
    {
        "open", "exec", "eval", "compile", "input", "breakpoint", "help", "exit", "quit",
        "copyright", "credits", "license", "globals", "__loader__", "__spec__",
    }
)

IMPORTAR_DE_VERDADE = builtins.__import__


class No:
    """Nó de árvore binária usado nos testes (atributos: valor, esquerda, direita)."""

    def __init__(self, valor, esquerda=None, direita=None):
        self.valor = valor
        self.esquerda = esquerda
        self.direita = direita


# ---------------------------------------------------------------------------
# Comparação e formatação (só confiam em tipos nativos EXATOS)
# ---------------------------------------------------------------------------

def _numero(x):
    return type(x) is int or type(x) is float


def _chave_simples(k):
    return k is None or type(k) in (str, int, float, bool)


def iguais(a, b):
    """Igualdade profunda estrita. 4 e 4.0 são iguais; True e 1, list e tuple, não."""
    if _numero(a) and _numero(b):
        if a != a and b != b:  # NaN
            return True
        return a == b
    ta = type(a)
    if ta is not type(b):
        return False
    if a is None:
        return True
    if ta is str or ta is bool:
        return a == b
    if ta is list or ta is tuple:
        return len(a) == len(b) and all(iguais(x, y) for x, y in zip(a, b))
    if ta is dict:
        if len(a) != len(b):
            return False
        for k in a:
            if not _chave_simples(k) or k not in b or not iguais(a[k], b[k]):
                return False
        return True
    return False


def _limitar(texto):
    return texto if len(texto) <= LIMITE_DETALHE else texto[:LIMITE_DETALHE] + "…"


def _formatar(valor, resto, vistos):
    t = type(valor)
    if valor is None or t is bool:
        return repr(valor)
    if t is int:
        try:
            return str(valor)
        except ValueError:
            return "<número enorme>"
    if t is float:
        return repr(valor)
    if t is str:
        return repr(valor[: LIMITE_DETALHE + 1])
    if t is list or t is tuple or t is dict:
        if id(valor) in vistos:
            return "[...]" if t is list else "(...)"
        vistos = vistos | {id(valor)}
        partes = []
        for item in valor:
            if resto[0] <= 0:
                partes.append("…")
                break
            if t is dict:
                texto = _formatar(item, resto, vistos) + ": " + _formatar(valor[item], resto, vistos)
            else:
                texto = _formatar(item, resto, vistos)
            resto[0] -= len(texto) + 2
            partes.append(texto)
        miolo = ", ".join(partes)
        if t is list:
            return "[" + miolo + "]"
        if t is dict:
            return "{" + miolo + "}"
        return "(" + miolo + ("," if len(partes) == 1 else "") + ")"
    return "<objeto " + t.__name__[:40] + ">"


def formatar(valor):
    try:
        return _limitar(_formatar(valor, [LIMITE_DETALHE], frozenset()))
    except MemoryError:
        raise
    except BaseException:
        return "[valor que não pode ser exibido]"


class Assercoes:
    """Objeto `t` recebido por `testar(..., t)`."""

    def __init__(self):
        self.resultados = []

    def _registrar(self, ok, mensagem, descrever):
        self.resultados.append(
            {"ok": ok is True, "mensagem": mensagem, "detalhe": None if ok is True else descrever()}
        )

    @staticmethod
    def _diferenca(esperado, recebido):
        return "esperado " + formatar(esperado) + ", recebido " + formatar(recebido)

    def igual(self, recebido, esperado, mensagem):
        self._registrar(iguais(recebido, esperado), mensagem, lambda: self._diferenca(esperado, recebido))

    def verdadeiro(self, valor, mensagem):
        self._registrar(valor is True, mensagem, lambda: self._diferenca(True, valor))

    def falso(self, valor, mensagem):
        self._registrar(valor is False, mensagem, lambda: self._diferenca(False, valor))


# ---------------------------------------------------------------------------
# Código do aluno
# ---------------------------------------------------------------------------

def _linha_do_aluno(erro):
    linha = None
    tb = getattr(erro, "__traceback__", None)
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == "<codigo>":
            linha = tb.tb_lineno
        tb = tb.tb_next
    return linha


def descrever_erro(erro):
    try:
        texto = type(erro).__name__ + ": " + str(erro)
    except BaseException:
        texto = type(erro).__name__
    linha = _linha_do_aluno(erro)
    if linha:
        texto += " (linha " + str(linha) + " do seu código)"
    return texto[:300]


def importar_permitido(nome, globais=None, locais=None, fromlist=(), level=0):
    raiz = nome.split(".")[0]
    if level != 0 or raiz not in MODULOS_PERMITIDOS:
        raise ImportError("O módulo '" + raiz + "' não pode ser usado nestes exercícios.")
    return IMPORTAR_DE_VERDADE(nome, None, None, fromlist, 0)


def construir_builtins():
    permitidos = {n: v for n, v in vars(builtins).items() if n not in BUILTINS_PROIBIDOS}
    permitidos["__import__"] = importar_permitido
    return permitidos


def carregar_aluno(codigo, funcoes):
    """Devolve (valores, erro). `erro` é {tipo, mensagem} se o código não pôde ser carregado."""
    try:
        compilado = compile(codigo, "<codigo>", "exec", dont_inherit=True)
    except (SyntaxError, ValueError) as erro:
        linha = getattr(erro, "lineno", None)
        mensagem = (getattr(erro, "msg", None) or str(erro))[:200]
        if linha:
            mensagem += " (linha " + str(linha) + ")"
        return None, {"tipo": "sintaxe", "mensagem": mensagem}

    espaco = {"__name__": "aluno", "__builtins__": construir_builtins()}
    try:
        exec(compilado, espaco)
    except MemoryError:
        raise
    except BaseException as erro:
        return None, {"tipo": "execucao", "mensagem": descrever_erro(erro)}

    valores = []
    for nome in funcoes:
        valor = espaco.get(nome)
        if not callable(valor):
            return None, {
                "tipo": "execucao",
                "mensagem": 'Não encontrei "' + nome + '" no seu código. Mantenha o nome exatamente como no esqueleto.',
            }
        valores.append(valor)
    return valores, None


def avaliar(testar, valores):
    t = Assercoes()
    try:
        testar(*valores, t)
    except MemoryError:
        raise
    except BaseException as erro:
        t.resultados.append({"ok": False, "mensagem": "Erro ao executar os testes", "detalhe": descrever_erro(erro)})

    passou = sum(1 for r in t.resultados if r["ok"])
    falhou = len(t.resultados) - passou
    return {
        "resultados": t.resultados,
        "passou": passou,
        "falhou": falhou,
        "completo": falhou == 0 and len(t.resultados) > 0,
    }


# ---------------------------------------------------------------------------
# Ponto de entrada
# ---------------------------------------------------------------------------

class _Sumidouro:
    """Descarta o que o aluno imprime."""

    def write(self, texto):
        return len(texto)

    def flush(self):
        pass


def executar(entrada):
    espaco_teste = {"__name__": "teste", "No": No}
    exec(compile(entrada["fonteTeste"], "<teste>", "exec"), espaco_teste)
    testar = espaco_teste["testar"]

    saidas = sys.stdout, sys.stderr
    limite = sys.getrecursionlimit()
    sys.stdout = sys.stderr = _Sumidouro()
    sys.setrecursionlimit(LIMITE_RECURSAO)
    try:
        valores, erro = carregar_aluno(entrada["codigo"], entrada["funcoes"])
        resultado = {"erro": erro} if erro else avaliar(testar, valores)
        return {"ok": True, "resultado": resultado}
    except MemoryError:
        return {"ok": False, "tipo": "recursos"}
    finally:
        sys.setrecursionlimit(limite)
        sys.stdout, sys.stderr = saidas


def avaliar_json(texto):
    """Recebe e devolve JSON em texto (é o que o Web Worker chama)."""
    try:
        saida = executar(json.loads(texto))
    except BaseException as erro:
        saida = {"ok": False, "tipo": "execucao", "mensagem": descrever_erro(erro)}
    return json.dumps(saida)
