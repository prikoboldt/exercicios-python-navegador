window.CONFIG = {
  // Python no navegador (Pyodide), baixado na primeira abertura e guardado em cache pelo navegador.
  // Deve terminar com "/". Para não depender de internet, baixe o pacote do Pyodide
  // (veja o README) e aponte para a sua cópia, por exemplo "vendor/pyodide/".
  PYODIDE_URL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",

  // Tempo máximo para os testes rodarem (milissegundos). O Pyodide é mais lento que o Python comum.
  TEMPO_LIMITE_MS: 4000,

  // Tamanho máximo do código aceito, em caracteres.
  TAMANHO_MAX_CODIGO: 20000,
};
