/**
 * Web Worker que carrega o Python (Pyodide) e executa py/harness.py.
 * Roda fora da página: um laço infinito do aluno não trava a tela, e o validador
 * encerra este worker se o tempo estourar.
 */
"use strict";

let avaliarJson = null;

async function iniciar({ pyodideUrl, harnessUrl }) {
  importScripts(pyodideUrl + "pyodide.js");
  const py = await loadPyodide({ indexURL: pyodideUrl });
  py.setStdout({ batched() {} });
  py.setStderr({ batched() {} });

  const resposta = await fetch(harnessUrl);
  if (!resposta.ok) throw new Error("Não foi possível carregar py/harness.py");
  py.runPython(await resposta.text());
  avaliarJson = py.globals.get("avaliar_json");
}

self.onmessage = async ({ data }) => {
  try {
    if (data.tipo === "iniciar") {
      await iniciar(data);
      self.postMessage({ tipo: "pronto" });
    } else if (data.tipo === "executar") {
      self.postMessage({ tipo: "resultado", id: data.id, saida: avaliarJson(JSON.stringify(data.entrada)) });
    }
  } catch (erro) {
    self.postMessage({ tipo: "falha", id: data.id, mensagem: String((erro && erro.message) || erro) });
  }
};
