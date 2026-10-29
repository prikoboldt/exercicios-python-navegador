"""Utilitários dos testes: carrega o avaliador (o mesmo arquivo que roda no navegador)."""

import importlib.util
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "ferramentas"))

_spec = importlib.util.spec_from_file_location("harness", RAIZ / "frontend" / "py" / "harness.py")
harness = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(harness)

import gerar_dados  # noqa: E402


def rodar(fonte_teste, codigo, funcoes=("f",)):
    """Executa o avaliador como o Web Worker faz (entrada e saída em JSON)."""
    entrada = {"fonteTeste": fonte_teste, "funcoes": list(funcoes), "codigo": codigo}
    return json.loads(harness.avaliar_json(json.dumps(entrada)))


def avaliar_exercicio(exercicio, codigo):
    return rodar(exercicio["fonteTeste"], codigo, exercicio["funcoes"])


def exercicios():
    return {e["id"]: e for e in gerar_dados.carregar_exercicios()}
