def testar(Fila, t):
    fila = Fila()
    t.verdadeiro(fila.vazia(), "vazia() — estado inicial: uma fila recém-criada não tem itens")
    t.igual(fila.desenfileirar(), None, "desenfileirar() numa fila vazia não quebra: devolve None")
    t.igual(fila.frente(), None, "frente() numa fila vazia também devolve None")

    fila.enfileirar("a")
    fila.enfileirar("b")
    fila.enfileirar("c")
    t.igual(fila.frente(), "a", "frente() — mostra o primeiro que entrou, sem removê-lo")
    t.igual(fila.tamanho(), 3, "tamanho() — três itens enfileirados")
    t.igual(fila.desenfileirar(), "a", "FIFO — o primeiro a entrar ('a') é o primeiro a sair")
    t.igual(fila.desenfileirar(), "b", "desenfileirar() — depois sai o segundo ('b')")
    t.igual(fila.frente(), "c", "frente() — resta apenas 'c' no início da fila")
