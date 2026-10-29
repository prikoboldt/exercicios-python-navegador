/**
 * Valida o código do aluno no próprio navegador: Python (Pyodide) num Web Worker.
 * Exposto em `window.Exercicios.validador`.
 *
 *   preparar()                 começa a carregar o Python em segundo plano
 *   estaPronto()               true quando o Python já carregou
 *   validar(exercicio, codigo) → { exercicioId, completo, passou, falhou, total, resultados, erro?, dica? }
 *
 * `validar` lança ErroDeValidacao quando não consegue nem rodar (ex.: sem internet na primeira vez).
 */
(function (raiz) {
  "use strict";

  const CONFIG = raiz.CONFIG;
  const TEMPO_DE_CARGA_MS = 120_000;
  const LIMITE_TEXTO = 300;

  class ErroDeValidacao extends Error {
    constructor(mensagem) {
      super(mensagem);
      this.name = "ErroDeValidacao";
    }
  }

  let worker = null;
  let carregando = null;
  let pronto = false;
  let execucaoAtual = null;
  let contador = 0;

  function descartar(w) {
    w.terminate();
    if (worker === w) {
      worker = null;
      carregando = null;
      pronto = false;
    }
  }

  function preparar() {
    if (carregando) return carregando;

    const w = new Worker("js/worker.js");
    worker = w;
    carregando = new Promise((resolve, reject) => {
      const desistir = setTimeout(() => {
        descartar(w);
        reject(new ErroDeValidacao("O Python demorou demais para carregar. Confira a internet e tente de novo."));
      }, TEMPO_DE_CARGA_MS);

      w.onmessage = ({ data }) => {
        if (data.tipo === "pronto") {
          clearTimeout(desistir);
          pronto = true;
          resolve();
        } else if (data.tipo === "falha" && !pronto) {
          clearTimeout(desistir);
          descartar(w);
          reject(
            new ErroDeValidacao(
              "Não foi possível carregar o Python no navegador. Na primeira vez é preciso estar com internet. " +
                `(${data.mensagem})`
            )
          );
        } else if (execucaoAtual) {
          execucaoAtual.tratar(data);
        }
      };
      w.onerror = () => {
        clearTimeout(desistir);
        if (!pronto) {
          descartar(w);
          reject(new ErroDeValidacao("Não foi possível iniciar o Python neste navegador."));
        } else if (execucaoAtual) {
          execucaoAtual.tratar({ tipo: "queda" });
        }
      };
    });
    carregando.catch(() => {}); // a falha é tratada por quem chamar validar()

    w.postMessage({
      tipo: "iniciar",
      pyodideUrl: CONFIG.PYODIDE_URL,
      harnessUrl: new URL("py/harness.py", raiz.location.href).href,
    });
    return carregando;
  }

  /** Roda uma execução; resolve com o JSON bruto do harness ({ ok, resultado } ou { ok: false, tipo }). */
  async function executar(entrada) {
    await preparar();
    const w = worker;

    return new Promise((resolve) => {
      const id = ++contador;

      function finalizar(bruto, reiniciar) {
        clearTimeout(limite);
        execucaoAtual = null;
        if (reiniciar) {
          descartar(w);
          preparar().catch(() => {}); // deixa um Python novo carregando para a próxima
        }
        resolve(bruto);
      }

      const limite = setTimeout(() => finalizar({ ok: false, tipo: "tempo_esgotado" }, true), CONFIG.TEMPO_LIMITE_MS);
      execucaoAtual = {
        tratar(data) {
          if (data.tipo === "resultado") finalizar(JSON.parse(data.saida), false);
          else if (data.tipo === "falha") finalizar({ ok: false, tipo: "execucao", mensagem: data.mensagem }, false);
          else if (data.tipo === "queda") finalizar({ ok: false, tipo: "recursos" }, true);
        },
      };
      w.postMessage({ tipo: "executar", id, entrada });
    });
  }

  // --- Montagem da resposta (mesmo formato que a tela já conhecia) ----------

  const texto = (valor) => String(valor == null ? "" : valor).slice(0, LIMITE_TEXTO);

  function descreverFalha(tipo, mensagem) {
    if (tipo === "tempo_esgotado") {
      return { tipo, mensagem: "O código demorou demais para terminar (laço infinito ou algoritmo muito lento?)." };
    }
    if (tipo === "recursos") {
      return { tipo, mensagem: "O código usou memória ou produziu resultado demais e foi interrompido." };
    }
    if (tipo === "sintaxe") return { tipo, mensagem: mensagem || "Erro de sintaxe no código." };
    return { tipo: "execucao", mensagem: mensagem || "Erro ao executar o código." };
  }

  function montarResposta(exercicio, bruto) {
    const erro = !bruto.ok ? bruto : bruto.resultado && bruto.resultado.erro;
    if (erro) {
      const falha = descreverFalha(erro.tipo, erro.mensagem);
      return {
        exercicioId: exercicio.id,
        completo: false,
        passou: 0,
        falhou: 0,
        total: 0,
        resultados: [],
        erro: { tipo: falha.tipo, mensagem: texto(falha.mensagem) },
        dica: exercicio.dica,
      };
    }

    const resultados = bruto.resultado.resultados.map((r) => ({
      ok: r.ok === true,
      mensagem: texto(r.mensagem),
      detalhe: r.detalhe == null ? null : texto(r.detalhe),
    }));
    const passou = resultados.filter((r) => r.ok).length;
    const falhou = resultados.length - passou;
    const completo = resultados.length > 0 && falhou === 0;

    const resposta = { exercicioId: exercicio.id, completo, passou, falhou, total: resultados.length, resultados };
    if (!completo) resposta.dica = exercicio.dica;
    return resposta;
  }

  async function validar(exercicio, codigo) {
    if (codigo.length > CONFIG.TAMANHO_MAX_CODIGO) {
      throw new ErroDeValidacao(`O código excede o limite de ${CONFIG.TAMANHO_MAX_CODIGO} caracteres.`);
    }
    const bruto = await executar({ fonteTeste: exercicio.fonteTeste, funcoes: exercicio.funcoes, codigo });
    return montarResposta(exercicio, bruto);
  }

  raiz.Exercicios = raiz.Exercicios || {};
  raiz.Exercicios.validador = { preparar, estaPronto: () => pronto, validar, montarResposta, ErroDeValidacao };
})(typeof window !== "undefined" ? window : globalThis);
