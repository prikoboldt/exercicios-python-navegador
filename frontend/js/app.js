/**
 * Orquestra a página: guarda o estado e conecta validador, armazenamento e tela.
 * Não manipula o DOM diretamente. Tudo roda no navegador: não há servidor.
 */
(function (raiz) {
  "use strict";

  const { armazenamento, validador, tela } = raiz.Exercicios;

  const estado = {
    exercicios: [],
    atual: null,
    validando: false,
  };

  function buscarExercicio(id) {
    return estado.exercicios.find((exercicio) => exercicio.id === id) || estado.exercicios[0];
  }

  // --- Persistência do código ---------------------------------------------

  function salvarCodigoAtual() {
    if (!estado.atual) return;
    const codigo = tela.lerEditor();
    // Não grava o esqueleto que a pessoa nem chegou a editar.
    if (codigo === estado.atual.codigoInicial && armazenamento.lerCodigo(estado.atual.id) === null) return;
    armazenamento.salvarCodigo(estado.atual.id, codigo);
  }

  // --- Renderização --------------------------------------------------------

  function atualizarLista() {
    // Ignora ids salvos de exercícios que já não existem.
    const concluidos = new Set(
      armazenamento.lerConcluidos().filter((id) => estado.exercicios.some((exercicio) => exercicio.id === id))
    );
    tela.renderizarLista({
      exercicios: estado.exercicios,
      ativoId: estado.atual && estado.atual.id,
      concluidos,
      aoSelecionar: (id) => selecionar(id, { focar: true }),
    });
    tela.renderizarProgresso(concluidos.size, estado.exercicios.length);
  }

  // --- Ações ---------------------------------------------------------------

  function selecionar(id, { focar = false } = {}) {
    salvarCodigoAtual();
    estado.atual = buscarExercicio(id);
    tela.ocultarGabarito();

    tela.renderizarCabecalho(estado.atual);
    tela.escreverEditor(armazenamento.lerCodigo(estado.atual.id) || estado.atual.codigoInicial);
    if (!estado.validando) tela.renderizarMensagemInicial();
    raiz.location.hash = estado.atual.id;

    atualizarLista();
    // Só move o foco quando a pessoa escolheu o exercício (não ao abrir a página).
    if (focar) tela.focarTitulo();
  }

  async function testar() {
    if (!estado.atual || estado.validando) return;

    salvarCodigoAtual();
    const exercicio = estado.atual;

    estado.validando = true;
    tela.definirValidando(true);
    if (!validador.estaPronto()) tela.mostrarCarregandoPython();

    try {
      const resposta = await validador.validar(exercicio, tela.lerEditor());

      armazenamento.marcarConcluido(exercicio.id, resposta.completo);
      atualizarLista();
      // Se a pessoa trocou de exercício durante a validação, o resultado não é mais dela.
      if (estado.atual.id === exercicio.id) tela.renderizarResposta(resposta);
      else tela.renderizarMensagemInicial();
    } catch (erro) {
      if (estado.atual.id === exercicio.id) tela.renderizarErroDeComunicacao(erro.message);
      else tela.renderizarMensagemInicial();
    } finally {
      // Reabilita o botão sem sobrescrever o resultado que acabou de ser exibido.
      estado.validando = false;
      tela.definirValidando(false);
    }
  }

  /** Só mostra a resposta depois de a pessoa confirmar que quer vê-la. */
  async function verGabarito() {
    if (!estado.atual) return;
    const exercicio = estado.atual;
    if (!(await tela.confirmarGabarito())) return;
    if (estado.atual === exercicio) tela.mostrarGabarito(exercicio.gabarito);
  }

  function restaurar() {
    if (!estado.atual) return;
    // Ação destrutiva: pede confirmação se houver código diferente do inicial.
    const alterado = tela.lerEditor() !== estado.atual.codigoInicial;
    if (alterado && !raiz.confirm("Restaurar o código inicial? O que você escreveu neste exercício será apagado.")) return;
    tela.escreverEditor(estado.atual.codigoInicial);
    armazenamento.removerCodigo(estado.atual.id);
    armazenamento.marcarConcluido(estado.atual.id, false);
    atualizarLista();
    tela.renderizarMensagemRestaurado();
  }

  // --- Inicialização -------------------------------------------------------

  function carregarExercicios() {
    estado.exercicios = raiz.EXERCICIOS_DADOS || [];
    if (!estado.exercicios.length) {
      tela.mostrarErroDeCarregamento("Os exercícios não foram encontrados (js/exercicios-dados.js).", carregarExercicios);
      return;
    }

    selecionar(raiz.location.hash.replace("#", "") || estado.exercicios[0].id);
    // Começa a baixar o Python já na abertura, para o primeiro "Rodar testes" não esperar.
    validador.preparar().catch(() => {});
  }

  armazenamento.aoFalharGravacao(tela.mostrarFalhaDeGravacao);

  tela.ligarEventos({
    aoTestar: testar,
    aoRestaurar: restaurar,
    aoVerGabarito: verGabarito,
    aoOcultarGabarito: () => tela.anunciar("Gabarito ocultado."),
    aoEditar: salvarCodigoAtual,
  });

  carregarExercicios();
})(window);
