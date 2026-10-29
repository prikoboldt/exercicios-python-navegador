def testar(mais_frequente, t):
    t.igual(mais_frequente([1, 3, 1, 3, 1]), 1, "mais_frequente([1, 3, 1, 3, 1]) — contagem: o 1 aparece 3 vezes, mais que o 3 (2 vezes)")
    t.igual(mais_frequente(["a", "b", "b", "a"]), "a", "empate — vence quem aparece primeiro na lista")
    t.igual(mais_frequente([7]), 7, "um item — ele mesmo é o mais frequente")
    t.igual(mais_frequente([]), None, "lista vazia — não há elemento mais frequente: retorne None")
    t.igual(mais_frequente(["x", "y", "y", "z"]), "y", "textos — funciona com qualquer tipo: 'y' aparece duas vezes")
