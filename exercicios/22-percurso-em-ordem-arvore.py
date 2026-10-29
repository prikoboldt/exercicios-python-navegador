def testar(em_ordem, t):
    # No(valor, esquerda=None, direita=None) é fornecido pelos testes.
    t.igual(em_ordem(None), [], "árvore vazia (None) — caso base da recursão: devolve []")
    t.igual(em_ordem(No(5)), [5], "só a raiz — sem filhos, o resultado é apenas o valor da raiz")

    arvore = No(4, No(2, No(1), No(3)), No(6, No(5), No(7)))
    t.igual(em_ordem(arvore), [1, 2, 3, 4, 5, 6, 7], "BST de 1 a 7 — esquerda → nó → direita devolve os valores em ordem crescente")

    inclinada = No(3, No(2, No(1), None), None)
    t.igual(em_ordem(inclinada), [1, 2, 3], "árvore só para a esquerda — a recursão desce até o menor valor antes de subir")
