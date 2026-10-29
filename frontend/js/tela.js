/**
 * Camada de apresentação: tudo o que lê ou escreve no DOM.
 * Não conhece a API nem a persistência. Usa `textContent` (e não `innerHTML`),
 * então nenhum texto vindo do servidor ou do código do aluno vira HTML.
 * Exposto em `window.Exercicios.tela`.
 */
(function (raiz) {
  "use strict";

  const MENSAGEM_INICIAL = "Escreva a função e clique em Rodar testes para ver o feedback.";
  const MENSAGEM_RESTAURADO = "Código restaurado. Rode os testes quando quiser.";
  const MENSAGEM_VALIDANDO = "Validando no servidor…";
  const TEXTO_BOTAO = "Rodar testes";
  const TEXTO_BOTAO_VALIDANDO = "Validando…";
  const TAMANHO_TAB = "    "; // 4 espaços: o recuo padrão do Python (PEP 8)

  const TITULOS_DE_ERRO = {
    sintaxe: "Erro de sintaxe no seu código",
    execucao: "Erro ao executar o código",
    tempo_esgotado: "Tempo esgotado",
    recursos: "Recursos esgotados",
    interno: "Falha no servidor",
  };

  const el = {
    lista: document.getElementById("lista-exercicios"),
    editor: document.getElementById("editor"),
    resultados: document.getElementById("resultados"),
    progresso: document.getElementById("progresso"),
    titulo: document.getElementById("titulo"),
    categoria: document.getElementById("categoria"),
    enunciado: document.getElementById("enunciado"),
    btnTestar: document.getElementById("btn-testar"),
    btnRestaurar: document.getElementById("btn-resetar"),
    anuncio: document.getElementById("anuncio"),
    btnGabarito: document.getElementById("btn-gabarito"),
    btnOcultarGabarito: document.getElementById("btn-ocultar-gabarito"),
    btnConfirmarGabarito: document.getElementById("btn-confirmar-gabarito"),
    btnCancelarGabarito: document.getElementById("btn-cancelar-gabarito"),
    dialogo: document.getElementById("dialogo-gabarito"),
    gabaritoArea: document.getElementById("gabarito-area"),
    gabaritoCodigo: document.getElementById("gabarito-codigo"),
    tituloGabarito: document.getElementById("titulo-gabarito"),
    salvamento: document.getElementById("salvamento"),
  };

  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }

  /** Avisa leitores de tela sem mexer no foco. */
  function anunciar(texto) {
    el.anuncio.textContent = "";
    setTimeout(() => {
      el.anuncio.textContent = texto;
    }, 50);
  }

  /** Aviso quando o navegador não deixa gravar o progresso (modo privado, armazenamento cheio). */
  function mostrarFalhaDeGravacao(falhou) {
    el.salvamento.textContent = falhou
      ? "Não foi possível salvar neste navegador (modo privado ou armazenamento cheio). Seu progresso vale só até fechar a página."
      : "";
    if (falhou) anunciar(el.salvamento.textContent);
  }

  function mostrarCarregandoPython() {
    renderizarMensagem("Carregando o Python no navegador… Na primeira vez pode levar alguns segundos; depois fica guardado.");
    anunciar("Carregando o Python no navegador.");
  }

  // --- Cabeçalho, progresso e lista ----------------------------------------

  function renderizarCabecalho(exercicio) {
    el.categoria.textContent = exercicio.categoria;
    el.titulo.textContent = `${exercicio.id}. ${exercicio.titulo}`;
    el.enunciado.textContent = exercicio.enunciado;
    document.title = `${exercicio.id}. ${exercicio.titulo} — Exercícios de lógica e estruturas`;
  }

  function renderizarProgresso(concluidos, total) {
    el.progresso.textContent = `${concluidos} de ${total} completos`;
  }

  function criarItemDaLista(exercicio, { ativo, concluido, aoSelecionar }) {
    const botao = criarElemento("button", "item");
    botao.type = "button";
    if (ativo) {
      botao.classList.add("ativo");
      botao.setAttribute("aria-current", "true");
    }
    if (concluido) botao.classList.add("completo");

    botao.append(
      criarElemento("span", "marca", "✓"),
      criarElemento("span", "", `${exercicio.id}. ${exercicio.titulo}`),
      criarElemento("span", "sr-only", concluido ? " (concluído)" : "")
    );
    botao.firstChild.setAttribute("aria-hidden", "true");
    botao.addEventListener("click", () => aoSelecionar(exercicio.id));
    return botao;
  }

  /**
   * @param exercicios  lista de exercícios, na ordem em que aparecem
   * @param ativoId     id do exercício selecionado
   * @param concluidos  Set com os ids concluídos
   */
  function renderizarLista({ exercicios, ativoId, concluidos, aoSelecionar }) {
    const rolagem = el.lista.scrollTop;
    el.lista.replaceChildren();

    const itens = criarElemento("ul", "itens");
    for (const exercicio of exercicios) {
      const item = criarElemento("li");
      item.appendChild(
        criarItemDaLista(exercicio, {
          ativo: ativoId === exercicio.id,
          concluido: concluidos.has(exercicio.id),
          aoSelecionar,
        })
      );
      itens.appendChild(item);
    }
    el.lista.appendChild(itens);
    el.lista.scrollTop = rolagem;
    const ativo = el.lista.querySelector(".ativo");
    if (ativo) ativo.scrollIntoView({ block: "nearest" });
  }

  // --- Gabarito ------------------------------------------------------------

  const TEXTO_CONFIRMACAO =
    "Tem certeza que quer ver a resposta? Tentar resolver por conta própria é o que mais ajuda a aprender.";

  /** Pergunta se a pessoa quer mesmo ver a resposta. Resolve true só se ela confirmar. */
  function confirmarGabarito() {
    const dialogo = el.dialogo;
    if (typeof dialogo.showModal !== "function") return Promise.resolve(raiz.confirm(TEXTO_CONFIRMACAO));

    return new Promise((resolve) => {
      dialogo.returnValue = "";
      dialogo.addEventListener("close", () => resolve(dialogo.returnValue === "sim"), { once: true });
      dialogo.showModal();
    });
  }

  function mostrarGabarito(codigo) {
    el.gabaritoCodigo.textContent = codigo.replace(/\s+$/, "");
    el.gabaritoArea.hidden = false;
    el.tituloGabarito.focus();
    el.gabaritoArea.scrollIntoView({ block: "start" });
    anunciar("Gabarito exibido abaixo do resultado dos testes.");
  }

  function ocultarGabarito({ devolverFoco = false } = {}) {
    el.gabaritoArea.hidden = true;
    el.gabaritoCodigo.textContent = "";
    if (devolverFoco) el.btnGabarito.focus();
  }

  // --- Carregamento da lista -----------------------------------------------

  function mostrarCarregandoLista() {
    el.progresso.textContent = "…";
    el.titulo.textContent = "Carregando…";
    el.lista.replaceChildren(criarElemento("p", "carregando", "Carregando exercícios…"));
    mostrar(criarElemento("p", "vazio", "Carregando exercícios do servidor…"));
  }

  function mostrarErroDeCarregamento(mensagem, aoTentarNovamente) {
    el.titulo.textContent = "Servidor indisponível";
    el.lista.replaceChildren();

    const botao = criarElemento("button", "botao secundario acao-erro", "Tentar novamente");
    botao.type = "button";
    botao.addEventListener("click", aoTentarNovamente);

    anunciar("Não foi possível carregar os exercícios.");
    mostrar(
      criarElemento("p", "resumo falha", "Não foi possível carregar os exercícios"),
      criarElemento("p", "detalhe", mensagem),
      botao
    );
  }

  // --- Resultados ----------------------------------------------------------

  function mostrar(...elementos) {
    el.resultados.replaceChildren(...elementos);
  }

  function criarDica(dica) {
    const p = criarElemento("p", "dica");
    p.append(criarElemento("strong", "", "Dica: "), dica);
    return p;
  }

  function renderizarMensagem(texto) {
    mostrar(criarElemento("p", "vazio", texto));
  }

  function renderizarMensagemInicial() {
    renderizarMensagem(MENSAGEM_INICIAL);
  }

  function renderizarMensagemRestaurado() {
    renderizarMensagem(MENSAGEM_RESTAURADO);
    anunciar(MENSAGEM_RESTAURADO);
  }

  /** Liga/desliga o estado "validando" (botão bloqueado e aviso na área de resultados). */
  function definirValidando(validando) {
    // aria-disabled (e não disabled) mantém o foco no botão enquanto valida.
    el.btnTestar.setAttribute("aria-disabled", String(validando));
    el.btnTestar.textContent = validando ? TEXTO_BOTAO_VALIDANDO : TEXTO_BOTAO;
    el.resultados.setAttribute("aria-busy", String(validando));
    if (validando) {
      renderizarMensagem(MENSAGEM_VALIDANDO);
      anunciar(MENSAGEM_VALIDANDO);
    }
  }

  /** Falha de comunicação com o servidor (sem conexão, tempo esgotado, erro HTTP). */
  function renderizarErroDeComunicacao(mensagem) {
    mostrar(
      criarElemento("p", "resumo falha", "Não foi possível validar o código"),
      criarElemento("p", "detalhe", mensagem)
    );
  }

  /** O código do aluno não chegou a ser avaliado (sintaxe, exceção, tempo, memória). */
  function renderizarErroDoCodigo(erro, dica) {
    const titulo = TITULOS_DE_ERRO[erro.tipo] || TITULOS_DE_ERRO.execucao;
    const partes = [criarElemento("p", "resumo falha", titulo), criarElemento("p", "detalhe", erro.mensagem)];
    anunciar(`${titulo}. ${erro.mensagem}`);
    if (dica) partes.push(criarDica(dica));
    mostrar(...partes);
  }

  /** Cada teste vira um item de lista: ícone + texto "Passou/Falhou" (nunca só cor). */
  function criarCaso(resultado) {
    const item = criarElemento("li", resultado.ok ? "caso ok" : "caso fail");
    const corpo = criarElemento("div");
    const msg = criarElemento("p", "caso-msg");
    msg.append(criarElemento("span", "sr-only", resultado.ok ? "Passou: " : "Falhou: "), resultado.mensagem);
    corpo.appendChild(msg);
    if (!resultado.ok && resultado.detalhe) corpo.appendChild(criarElemento("p", "detalhe", resultado.detalhe));

    const selo = criarElemento("span", "selo", resultado.ok ? "✓" : "✕");
    selo.setAttribute("aria-hidden", "true");
    item.append(selo, corpo);
    return item;
  }

  /** Mostra a resposta da API de validação. */
  function renderizarResposta(resposta) {
    if (resposta.erro) {
      renderizarErroDoCodigo(resposta.erro, resposta.dica);
      return;
    }

    const { resultados, passou, total, completo, dica } = resposta;
    const texto = completo
      ? `Tudo certo! ${passou} de ${total} testes passaram.`
      : `${passou} de ${total} testes passaram. Ajuste a função e rode de novo.`;
    const lista = criarElemento("ul", "casos");
    lista.append(...resultados.map(criarCaso));

    const partes = [criarElemento("p", completo ? "resumo sucesso" : "resumo falha", texto), lista];
    if (!completo && dica) partes.push(criarDica(dica));
    anunciar(texto);
    mostrar(...partes);
  }

  // --- Editor --------------------------------------------------------------

  function lerEditor() {
    return el.editor.value;
  }

  function escreverEditor(codigo) {
    el.editor.value = codigo;
  }

  /** Depois de escolher um exercício, o foco vai para o título (leitores de tela leem o enunciado). */
  function focarTitulo() {
    el.titulo.focus();
  }

  function inserirTabulacao() {
    const { selectionStart: inicio, selectionEnd: fim, value } = el.editor;
    el.editor.value = value.slice(0, inicio) + TAMANHO_TAB + value.slice(fim);
    el.editor.selectionStart = el.editor.selectionEnd = inicio + TAMANHO_TAB.length;
  }

  // --- Eventos -------------------------------------------------------------

  /** Liga os controles da página aos callbacks da aplicação. */
  function ligarEventos({ aoTestar, aoRestaurar, aoEditar, aoVerGabarito, aoOcultarGabarito }) {
    el.btnGabarito.addEventListener("click", aoVerGabarito);
    el.btnOcultarGabarito.addEventListener("click", () => {
      ocultarGabarito({ devolverFoco: true });
      aoOcultarGabarito();
    });
    el.btnConfirmarGabarito.addEventListener("click", () => el.dialogo.close("sim"));
    el.btnCancelarGabarito.addEventListener("click", () => el.dialogo.close("nao"));
    // Clicar fora da caixa (no fundo escurecido) também cancela.
    el.dialogo.addEventListener("click", (evento) => {
      if (evento.target === el.dialogo) el.dialogo.close("nao");
    });
    el.btnTestar.addEventListener("click", aoTestar);
    el.btnRestaurar.addEventListener("click", aoRestaurar);
    el.editor.addEventListener("input", aoEditar);

    // Tab insere recuo, mas não pode prender o teclado: Esc libera o próximo Tab
    // e Shift+Tab sempre move o foco (WCAG 2.1.2).
    let tabLivre = false;
    el.editor.addEventListener("blur", () => (tabLivre = false));
    el.editor.addEventListener("keydown", (evento) => {
      if ((evento.ctrlKey || evento.metaKey) && evento.key === "Enter") {
        evento.preventDefault();
        aoTestar();
      } else if (evento.key === "Escape") {
        tabLivre = true;
        anunciar("Tab agora move o foco para fora do editor.");
      } else if (evento.key === "Tab" && !evento.shiftKey && !tabLivre) {
        evento.preventDefault();
        inserirTabulacao();
        aoEditar();
      } else if (evento.key !== "Shift") {
        tabLivre = false;
      }
    });
  }

  raiz.Exercicios = raiz.Exercicios || {};
  raiz.Exercicios.tela = {
    renderizarCabecalho,
    renderizarProgresso,
    renderizarLista,
    mostrarCarregandoLista,
    mostrarErroDeCarregamento,
    renderizarMensagemInicial,
    renderizarMensagemRestaurado,
    definirValidando,
    renderizarErroDeComunicacao,
    renderizarResposta,
    lerEditor,
    escreverEditor,
    focarTitulo,
    confirmarGabarito,
    mostrarGabarito,
    ocultarGabarito,
    anunciar,
    mostrarFalhaDeGravacao,
    mostrarCarregandoPython,
    ligarEventos,
  };
})(window);
