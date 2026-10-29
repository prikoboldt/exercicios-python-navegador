/**
 * Progresso da pessoa (código digitado e exercícios concluídos), guardado no
 * `localStorage` DESTE navegador, neste endereço. Nada é enviado a servidor algum.
 * Exposto em `window.Exercicios.armazenamento`.
 *
 * Se o navegador não permitir gravar (modo privado, armazenamento cheio), o progresso
 * continua valendo em memória até fechar a página, e `aoFalhar` avisa a pessoa.
 */
(function (raiz) {
  "use strict";

  const PREFIXO_CODIGO = "exercicios-py:codigo:";
  const CHAVE_CONCLUIDOS = "exercicios-py:completos";

  const memoria = new Map();
  let aoFalhar = () => {};

  function ler(chave) {
    try {
      const valor = localStorage.getItem(chave);
      return valor === null ? memoria.get(chave) ?? null : valor;
    } catch {
      return memoria.get(chave) ?? null;
    }
  }

  function gravar(chave, valor) {
    memoria.set(chave, valor);
    try {
      localStorage.setItem(chave, valor);
      aoFalhar(false);
    } catch {
      aoFalhar(true);
    }
  }

  function apagar(chave) {
    memoria.delete(chave);
    try {
      localStorage.removeItem(chave);
    } catch {
      aoFalhar(true);
    }
  }

  /** `callback(true)` quando não foi possível gravar; `callback(false)` quando voltou a funcionar. */
  function aoFalharGravacao(callback) {
    aoFalhar = callback;
  }

  function lerConcluidos() {
    try {
      const lista = JSON.parse(ler(CHAVE_CONCLUIDOS) || "[]");
      return Array.isArray(lista) ? lista.filter((id) => typeof id === "string") : [];
    } catch {
      return [];
    }
  }

  function marcarConcluido(id, concluido) {
    const ids = new Set(lerConcluidos());
    if (concluido) ids.add(id);
    else ids.delete(id);
    gravar(CHAVE_CONCLUIDOS, JSON.stringify([...ids]));
  }

  /** Código que a pessoa digitou, ou null se não houver (ou estiver em branco). */
  function lerCodigo(id) {
    const valor = ler(PREFIXO_CODIGO + id);
    return valor && valor.trim() ? valor : null;
  }

  function salvarCodigo(id, codigo) {
    gravar(PREFIXO_CODIGO + id, codigo);
  }

  function removerCodigo(id) {
    apagar(PREFIXO_CODIGO + id);
  }

  raiz.Exercicios = raiz.Exercicios || {};
  raiz.Exercicios.armazenamento = {
    lerConcluidos,
    marcarConcluido,
    lerCodigo,
    salvarCodigo,
    removerCodigo,
    aoFalharGravacao,
  };
})(window);
