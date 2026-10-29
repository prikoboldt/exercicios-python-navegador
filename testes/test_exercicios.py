"""Os exercícios: estrutura, esqueletos, dados gerados e o gabarito (que faz parte do site)."""

import unittest

from ajudas import RAIZ, avaliar_exercicio, exercicios, gerar_dados

CAMPOS_PUBLICOS_OBRIGATORIOS = ("id", "categoria", "titulo", "enunciado", "dica", "funcoes", "codigoInicial", "fonteTeste")


class TestExercicios(unittest.TestCase):
    def test_ha_exercicios_com_ids_unicos_e_em_ordem(self):
        ids = list(exercicios())
        self.assertGreater(len(ids), 0)
        self.assertEqual(ids, sorted(ids))

    def test_dados_do_frontend_estao_em_dia(self):
        self.assertEqual(gerar_dados.principal(["--verificar"]), 0)

    def test_cada_exercicio_tem_todos_os_campos(self):
        for id_, e in exercicios().items():
            for campo in CAMPOS_PUBLICOS_OBRIGATORIOS:
                self.assertTrue(e.get(campo), f"{id_}: falta {campo}")

    def test_esqueletos_sao_python_valido_e_definem_as_funcoes_declaradas(self):
        for id_, e in exercicios().items():
            with self.subTest(id_):
                compile(e["codigoInicial"], f"esqueleto-{id_}", "exec")
                compile(e["fonteTeste"], f"testes-{id_}", "exec")
                for nome in e["funcoes"]:
                    self.assertRegex(e["codigoInicial"], rf"(?m)^(def|class) {nome}\b")

    def test_todo_exercicio_comeca_reprovado_com_o_proprio_esqueleto(self):
        for id_, e in exercicios().items():
            with self.subTest(id_):
                bruto = avaliar_exercicio(e, e["codigoInicial"])
                self.assertTrue(bruto["ok"])
                self.assertNotIn("erro", bruto["resultado"], f"exercício {id_}")
                self.assertFalse(bruto["resultado"]["completo"], f"exercício {id_} não pode nascer resolvido")

    def test_cada_caso_de_teste_explica_o_conceito(self):
        for id_, e in exercicios().items():
            with self.subTest(id_):
                bruto = avaliar_exercicio(e, e["codigoInicial"])
                for r in bruto["resultado"]["resultados"]:
                    if r["mensagem"] == "Erro ao executar os testes":  # o esqueleto de uma classe ainda não tem métodos
                        continue
                    self.assertIn(" — ", r["mensagem"], f"exercício {id_}: {r['mensagem']}")


class TestGabarito(unittest.TestCase):
    def test_todo_exercicio_tem_gabarito_e_ele_passa_em_todos_os_testes(self):
        for id_, e in exercicios().items():
            with self.subTest(id_):
                self.assertTrue(e.get("gabarito", "").strip(), f"exercício {id_} sem gabarito")
                bruto = avaliar_exercicio(e, e["gabarito"])
                r = bruto["resultado"]
                reprovados = [x["mensagem"] for x in r.get("resultados", []) if not x["ok"]]
                self.assertTrue(r.get("completo"), f"gabarito do exercício {id_} reprovado: {r.get('erro') or reprovados}")

    def test_gabarito_nao_e_igual_ao_esqueleto(self):
        for id_, e in exercicios().items():
            self.assertNotEqual(e["gabarito"].strip(), e["codigoInicial"].strip(), id_)

    def test_gabarito_vai_nos_dados_do_site(self):
        texto = (RAIZ / "frontend" / "js" / "exercicios-dados.js").read_text(encoding="utf-8")
        self.assertIn('"gabarito"', texto)


if __name__ == "__main__":
    unittest.main()
