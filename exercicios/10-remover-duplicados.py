def testar(remover_duplicados, t):
    t.igual(remover_duplicados([1, 2, 2, 3]), [1, 2, 3], "remover_duplicados([1, 2, 2, 3]) — repetido em sequência: mantém uma ocorrência")
    t.igual(remover_duplicados(["a", "b", "a"]), ["a", "b"], 'remover_duplicados(["a", "b", "a"]) — repetido separado: mantém a ordem da primeira aparição')
    t.igual(remover_duplicados([]), [], "remover_duplicados([]) — lista vazia: devolve lista vazia")
    t.igual(remover_duplicados([1, 1, 1]), [1], "remover_duplicados([1, 1, 1]) — todos iguais: sobra um único elemento")
