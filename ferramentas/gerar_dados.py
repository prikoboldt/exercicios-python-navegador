#!/usr/bin/env python3
"""
Gera frontend/js/exercicios-dados.js a partir de exercicios/ (para cada exercício: NN-nome.json,
NN-nome.py com os testes e NN-nome.gabarito.py com a solução).

  python3 ferramentas/gerar_dados.py             gera o arquivo
  python3 ferramentas/gerar_dados.py --verificar só confere se ele está em dia (código de saída 1 se não)

Rode depois de adicionar ou editar qualquer exercício.
"""

import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PASTA_EXERCICIOS = RAIZ / "exercicios"
DESTINO = RAIZ / "frontend" / "js" / "exercicios-dados.js"
CAMPOS_TEXTO = ("id", "categoria", "titulo", "enunciado", "dica", "codigoInicial")


class ErroDefinicao(Exception):
    pass


def carregar_exercicios(pasta=PASTA_EXERCICIOS):
    """Lê e valida todos os exercícios, em ordem de id."""
    exercicios, ids = [], set()
    for caminho in sorted(Path(pasta).glob("*.json")):
        def erro(motivo):
            return ErroDefinicao(f"Definição inválida em {caminho.name}: {motivo}")

        definicao = json.loads(caminho.read_text(encoding="utf-8"))
        for campo in CAMPOS_TEXTO:
            if not isinstance(definicao.get(campo), str) or not definicao[campo].strip():
                raise erro(f'o campo "{campo}" deve ser um texto não vazio')
        if not re.fullmatch(r"\d{2}", definicao["id"]):
            raise erro('"id" deve ter dois dígitos (ex.: "07")')
        if definicao["id"] in ids:
            raise erro(f"id repetido: {definicao['id']}")
        ids.add(definicao["id"])

        funcoes = definicao.get("funcoes")
        if not isinstance(funcoes, list) or not funcoes:
            raise erro('"funcoes" deve listar o nome das funções ou classes esperadas')
        for nome in funcoes:
            if not re.search(rf"^(def|class)\s+{re.escape(nome)}\b", definicao["codigoInicial"], re.MULTILINE):
                raise erro(f'o esqueleto (codigoInicial) deve definir "{nome}" com def ou class')

        arquivo_testes = caminho.with_suffix(".py")
        if not arquivo_testes.exists():
            raise erro(f"falta o arquivo de testes {arquivo_testes.name}")
        fonte = arquivo_testes.read_text(encoding="utf-8")
        if not re.search(r"^def testar\(", fonte, re.MULTILINE):
            raise erro(f'{arquivo_testes.name} deve definir "def testar(...)"')

        arquivo_gabarito = caminho.with_name(caminho.stem + ".gabarito.py")
        if not arquivo_gabarito.exists() or not arquivo_gabarito.read_text(encoding="utf-8").strip():
            raise erro(f"falta o gabarito {arquivo_gabarito.name}")

        exercicios.append({**definicao, "fonteTeste": fonte, "gabarito": arquivo_gabarito.read_text(encoding="utf-8")})
    return exercicios


def gerar_texto(exercicios):
    corpo = json.dumps(exercicios, ensure_ascii=False, indent=1)
    return (
        "// ARQUIVO GERADO por ferramentas/gerar_dados.py a partir de exercicios/. Não edite à mão.\n"
        f"window.EXERCICIOS_DADOS = {corpo};\n"
    )


def principal(argumentos):
    texto = gerar_texto(carregar_exercicios())
    if "--verificar" in argumentos:
        if not DESTINO.exists() or DESTINO.read_text(encoding="utf-8") != texto:
            print("frontend/js/exercicios-dados.js está desatualizado: rode python3 ferramentas/gerar_dados.py")
            return 1
        return 0
    DESTINO.write_text(texto, encoding="utf-8")
    print(f"{DESTINO.relative_to(RAIZ)}: {texto.count(chr(10))} linhas, {len(carregar_exercicios())} exercícios")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(principal(sys.argv[1:]))
    except ErroDefinicao as e:
        sys.exit(str(e))
