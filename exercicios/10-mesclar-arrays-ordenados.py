def testar(mesclar_ordenados, t):
    t.igual(mesclar_ordenados([1, 3, 5], [2, 4, 6]), [1, 2, 3, 4, 5, 6], "mesclar [1, 3, 5] e [2, 4, 6] — dois ponteiros: copie sempre o menor dos dois da frente")
    t.igual(mesclar_ordenados([], [1, 2]), [1, 2], "primeira lista vazia — devolve o restante da segunda")
    t.igual(mesclar_ordenados([1, 2], []), [1, 2], "segunda lista vazia — devolve o restante da primeira")
    t.igual(mesclar_ordenados([1, 1], [1, 2]), [1, 1, 1, 2], "valores repetidos — os repetidos das duas listas são mantidos")
    t.igual(mesclar_ordenados([-5, 0], [-2, 4]), [-5, -2, 0, 4], "negativos e zero — seguem a mesma comparação")
