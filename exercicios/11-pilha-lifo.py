def testar(Pilha, t):
    pilha = Pilha()
    t.verdadeiro(pilha.vazia(), "vazia() — estado inicial: uma pilha recém-criada não tem itens")
    t.igual(pilha.tamanho(), 0, "tamanho() — zero é um tamanho válido: pilha vazia tem 0 itens")
    t.igual(pilha.desempilhar(), None, "desempilhar() numa pilha vazia não quebra: devolve None")

    pilha.empilhar(10)
    pilha.empilhar(20)
    t.igual(pilha.topo(), 20, "topo() — mostra o último item empilhado (20) sem removê-lo")
    t.igual(pilha.tamanho(), 2, "tamanho() — cada empilhar aumenta o tamanho em 1")
    t.falso(pilha.vazia(), "vazia() — com itens guardados deve ser False")
    t.igual(pilha.desempilhar(), 20, "LIFO — o último a entrar (20) é o primeiro a sair")
    t.igual(pilha.desempilhar(), 10, "desempilhar() — em seguida sai o item anterior (10)")
    t.verdadeiro(pilha.vazia(), "vazia() — ao retirar tudo, a pilha volta ao estado vazio")
