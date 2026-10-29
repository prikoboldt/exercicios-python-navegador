def testar(ListaLigada, t):
    lista = ListaLigada()
    t.igual(lista.inicio, None, "inicio — lista vazia não tem nó inicial: começa como None")
    t.igual(lista.para_lista(), [], "para_lista() — lista vazia vira uma lista vazia")

    lista.inserir_fim(2)
    lista.inserir_fim(3)
    lista.inserir_inicio(1)
    t.igual(lista.para_lista(), [1, 2, 3], "inserir_fim(2), inserir_fim(3) e inserir_inicio(1) — a ordem dos nós é 1 → 2 → 3")
    t.igual(lista.inicio.valor, 1, "inicio.valor — inserir_inicio troca a 'cabeça' da lista")
    t.igual(lista.inicio.proximo.valor, 2, "proximo — o primeiro nó aponta para o segundo")
    t.igual(lista.inicio.proximo.proximo.valor, 3, "proximo — o segundo nó aponta para o terceiro")
    t.igual(lista.inicio.proximo.proximo.proximo, None, "último nó — seu proximo é None, marcando o fim da lista")
