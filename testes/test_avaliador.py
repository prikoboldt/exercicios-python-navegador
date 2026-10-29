"""Comparações e asserções do avaliador, e proteções contra código malicioso do aluno."""

import sys
import unittest

from ajudas import rodar

CODIGO = "def f():\n    pass\n"


def avaliar_testes(fonte_teste, codigo=CODIGO):
    bruto = rodar(fonte_teste, codigo)
    assert bruto["ok"], bruto
    return bruto["resultado"]


def oks(resultado):
    return [r["ok"] for r in resultado["resultados"]]


class TestAsserc(unittest.TestCase):
    def test_igual_numeros_textos_e_none(self):
        r = avaliar_testes('''
def testar(f, t):
    t.igual(1, 1, "a")
    t.igual(1, 2, "b")
    t.igual("a", "a", "c")
    t.igual(1, "1", "d")
    t.igual(None, 0, "e")
    t.igual(None, None, "f")
    t.igual(float("nan"), float("nan"), "g")
    t.igual(0, -0.0, "h")
''')
        self.assertEqual(oks(r), [True, False, True, False, False, True, True, True])

    def test_4_e_4_0_sao_iguais_mas_true_nao_e_1(self):
        r = avaliar_testes('''
def testar(f, t):
    t.igual(4.0, 4, "a")
    t.igual(2.5, 2.5, "b")
    t.igual(True, 1, "c")
    t.igual(0, False, "d")
    t.igual(True, True, "e")
''')
        self.assertEqual(oks(r), [True, True, False, False, True])

    def test_listas_tuplas_e_dicionarios_aninhados(self):
        r = avaliar_testes('''
def testar(f, t):
    t.igual([1, [2, 3]], [1, [2, 3]], "a")
    t.igual([1, 2], [1, 2, 3], "b")
    t.igual({"a": [1], "b": {"c": 2}}, {"a": [1], "b": {"c": 2}}, "c")
    t.igual({"a": 1}, {"a": 1, "b": 2}, "d")
    t.igual([], {}, "e")
    t.igual([1, 2], (1, 2), "f")
    t.igual((1, 2), (1, 2), "g")
    t.igual([[]], [[]], "h")
''')
        self.assertEqual(oks(r), [True, False, True, False, False, False, True, True])

    def test_so_aceita_tipos_nativos_exatos(self):
        r = avaliar_testes('''
class Mentiroso:
    def __eq__(self, outro):
        return True

class Num(int):
    pass

def testar(f, t):
    t.igual(Mentiroso(), 1, "a")
    t.igual(1, Mentiroso(), "b")
    t.igual(Num(1), 1, "c")
    t.igual([Mentiroso()], [1], "d")
''')
        self.assertEqual(oks(r), [False, False, False, False])

    def test_verdadeiro_e_falso_exigem_exatamente_true_e_false(self):
        r = avaliar_testes('''
def testar(f, t):
    t.verdadeiro(True, "a")
    t.verdadeiro(1, "b")
    t.verdadeiro(None, "c")
    t.falso(False, "d")
    t.falso(0, "e")
    t.falso("", "f")
''')
        self.assertEqual(oks(r), [True, False, False, True, False, False])

    def test_detalhe_so_aparece_nas_falhas(self):
        r = avaliar_testes('''
def testar(f, t):
    t.igual(2, 2, "dois")
    t.igual(1, 2, "soma")
    t.verdadeiro(None, "eh_par")
    t.falso("x", "eh_impar")
    t.igual([1, "a"], (1, "a"), "tipos")
    t.igual({"a": 1}, None, "dict")
''')
        self.assertEqual(
            [x["detalhe"] for x in r["resultados"]],
            [None, "esperado 2, recebido 1", "esperado True, recebido None", "esperado False, recebido 'x'",
             "esperado (1, 'a'), recebido [1, 'a']", "esperado None, recebido {'a': 1}"],
        )
        self.assertEqual([x["mensagem"] for x in r["resultados"]], ["dois", "soma", "eh_par", "eh_impar", "tipos", "dict"])

    def test_formatar_corta_valores_enormes_e_nao_quebra_com_objetos_estranhos(self):
        r = avaliar_testes('''
class Estranho:
    def __repr__(self):
        raise RuntimeError("não me chame")

circular = []
circular.append(circular)

def testar(f, t):
    t.igual("x" * 100000, 1, "texto")
    t.igual(list(range(50000)), 1, "lista")
    t.igual(Estranho(), 1, "objeto")
    t.igual(circular, 1, "circular")
''')
        self.assertEqual(len(r["resultados"]), 4)
        for x in r["resultados"]:
            self.assertLess(len(x["detalhe"]), 400, x["mensagem"])
        self.assertIn("<objeto Estranho>", r["resultados"][2]["detalhe"])

    def test_completo_exige_todas_as_assercoes(self):
        r = avaliar_testes('def testar(f, t):\n    t.igual(1 + 2, 3, "soma")\n')
        self.assertEqual((r["passou"], r["falhou"], r["completo"]), (1, 0, True))
        r = avaliar_testes('def testar(f, t):\n    t.igual(1, 1, "um")\n    t.igual(1, 2, "dois")\n')
        self.assertEqual((r["passou"], r["falhou"], r["completo"]), (1, 1, False))

    def test_teste_sem_assercoes_nao_conta_como_completo(self):
        self.assertFalse(avaliar_testes("def testar(f, t):\n    pass\n")["completo"])

    def test_excecao_no_teste_vira_falha_e_mantem_o_que_ja_passou(self):
        r = avaliar_testes('def testar(f, t):\n    t.igual(1, 1, "ok")\n    f(1, 2, 3)\n')
        self.assertFalse(r["completo"])
        self.assertEqual(r["passou"], 1)
        self.assertEqual(r["resultados"][-1]["mensagem"], "Erro ao executar os testes")
        self.assertIn("TypeError", r["resultados"][-1]["detalhe"])

    def test_classe_no_esta_disponivel_para_testes_de_arvore(self):
        r = avaliar_testes('def testar(f, t):\n    n = No(1, No(2))\n    t.igual([n.valor, n.esquerda.valor, n.direita], [1, 2, None], "no")\n')
        self.assertTrue(r["completo"])


FONTE_MEDIA = '''
def testar(media, t):
    t.igual(media([2, 4, 6]), 4, "basico")
    t.igual(media([]), 0, "vazia")
'''
MEDIA_CERTA = "def media(numeros):\n    return sum(numeros) / len(numeros) if numeros else 0\n"


def rodar_media(codigo):
    return rodar(FONTE_MEDIA, codigo, ("media",))


class TestCodigoDoAluno(unittest.TestCase):
    def test_solucao_correta_passa(self):
        r = rodar_media(MEDIA_CERTA)["resultado"]
        self.assertTrue(r["completo"])

    def test_pode_importar_modulos_seguros(self):
        r = rodar_media("from math import fsum\n\ndef media(n):\n    return fsum(n) / len(n) if n else 0\n")["resultado"]
        self.assertTrue(r["completo"])

    def test_esqueleto_vazio_e_reprovado_sem_erro(self):
        r = rodar_media("def media(numeros):\n    pass\n")["resultado"]
        self.assertNotIn("erro", r)
        self.assertEqual((r["completo"], r["passou"]), (False, 0))

    def test_funcao_ausente_informa_o_nome_esperado(self):
        erro = rodar_media("def outra(numeros):\n    return 0\n")["resultado"]["erro"]
        self.assertEqual(erro["tipo"], "execucao")
        self.assertIn('Não encontrei "media"', erro["mensagem"])

    def test_erro_de_sintaxe_traz_a_linha(self):
        erro = rodar_media("x = 1\ndef media(:\n    pass\n")["resultado"]["erro"]
        self.assertEqual(erro["tipo"], "sintaxe")
        self.assertIn("linha 2", erro["mensagem"])

    def test_excecao_ao_carregar_traz_a_linha(self):
        erro = rodar_media("x = 1\nraise ValueError('boom')\n")["resultado"]["erro"]
        self.assertEqual(erro, {"tipo": "execucao", "mensagem": "ValueError: boom (linha 2 do seu código)"})

    def test_excecao_dentro_da_funcao_vira_falha_com_a_linha(self):
        r = rodar_media("def media(numeros):\n    return sum(numeros) / len(numeros)\n")["resultado"]
        self.assertFalse(r["completo"])
        self.assertEqual(r["resultados"][-1]["mensagem"], "Erro ao executar os testes")
        self.assertIn("ZeroDivisionError: division by zero (linha 2 do seu código)", r["resultados"][-1]["detalhe"])

    def test_recursao_infinita_vira_falha_de_teste(self):
        r = rodar_media("def media(numeros):\n    return media(numeros)\n")["resultado"]
        self.assertFalse(r["completo"])
        self.assertIn("RecursionError", r["resultados"][-1]["detalhe"])

    def test_limite_de_recursao_e_restaurado(self):
        antes = sys.getrecursionlimit()
        rodar_media(MEDIA_CERTA)
        self.assertEqual(sys.getrecursionlimit(), antes)

    def test_resultado_gigante_e_cortado(self):
        for valor in ('"x" * 5 * 10**7', "[1] * 10**6", "list(range(10**5))"):
            r = rodar_media(f"def media(numeros):\n    return {valor}\n")["resultado"]
            self.assertFalse(r["completo"])
            for x in r["resultados"]:
                self.assertLess(len(x["detalhe"] or ""), 400, valor)

    def test_print_e_descartado_e_a_saida_padrao_volta_ao_normal(self):
        saida = sys.stdout
        r = rodar_media('print("oi")\n' + MEDIA_CERTA)["resultado"]
        self.assertTrue(r["completo"])
        self.assertIs(sys.stdout, saida)

    def test_systemexit_no_codigo_nao_encerra_a_avaliacao(self):
        erro = rodar_media("raise SystemExit(0)\n")["resultado"]["erro"]
        self.assertEqual(erro["tipo"], "execucao")
        self.assertIn("SystemExit", erro["mensagem"])


FUGAS = {
    "import os": "import os",
    "import sys": "import sys",
    "import subprocess": "import subprocess",
    "from os import system": "from os import system",
    "import builtins": "import builtins",
    "import relativo": "from . import x",
    "__import__('os')": "__import__('os')",
    "open()": "open('/etc/passwd')",
    "exec()": "exec('x = 1')",
    "eval()": "eval('1 + 1')",
    "compile()": "compile('1', 'x', 'eval')",
    "input()": "input()",
    "globals()": "globals()",
    "exit()": "exit()",
    "enxergar testes (testar)": "testar",
    "enxergar o objeto t": "t",
    "enxergar iguais": "iguais",
    "enxergar Assercoes": "Assercoes",
}

FRAUDES = {
    "objeto com __eq__ sempre verdadeiro":
        "class Mentiroso:\n    def __eq__(self, o):\n        return True\n    def __hash__(self):\n        return 0\n\n"
        "def media(numeros):\n    return Mentiroso()\n",
    "subclasse de int com __eq__":
        "class Num(int):\n    def __eq__(self, o):\n        return True\n    __hash__ = int.__hash__\n\n"
        "def media(numeros):\n    return Num(4)\n",
    "subclasse de list com __eq__":
        "class Lista(list):\n    def __eq__(self, o):\n        return True\n\ndef media(numeros):\n    return Lista()\n",
    "True no lugar de 1": "def media(numeros):\n    return True\n",
    "trocar builtins no próprio código":
        "len = lambda x: 0\nisinstance = lambda *a: True\ntype = lambda x: int\nsum = lambda x: 4\n\ndef media(numeros):\n    pass\n",
}


class TestFugasEFraudes(unittest.TestCase):
    def test_fugas_bloqueadas(self):
        for nome, ataque in FUGAS.items():
            with self.subTest(nome):
                codigo = (
                    f"def _ataque():\n    {ataque}\n\ntry:\n    _ataque()\nexcept (ImportError, NameError):\n    pass\n"
                    f'else:\n    raise Exception("VAZOU")\n\n{MEDIA_CERTA}'
                )
                r = rodar_media(codigo)["resultado"]
                self.assertNotIn("erro", r, r.get("erro"))
                self.assertTrue(r["completo"])

    def test_fraudes_bloqueadas(self):
        for nome, codigo in FRAUDES.items():
            with self.subTest(nome):
                r = rodar_media(codigo)["resultado"]
                self.assertNotIn("erro", r, r.get("erro"))
                self.assertFalse(r["completo"])


if __name__ == "__main__":
    unittest.main()
