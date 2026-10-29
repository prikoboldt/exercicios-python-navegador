def testar(busca_linear, t):
    t.igual(busca_linear([4, 8, 15, 16], 15), 2, "busca_linear([4, 8, 15, 16], 15) — caso básico: devolve o índice onde o valor está")
    t.igual(busca_linear([4, 8, 15, 16], 4), 0, "primeira posição — o índice 0 é válido, não confunda com 'não achou'")
    t.igual(busca_linear([1, 2, 2, 3], 2), 1, "valor repetido — pare na primeira ocorrência")
    t.igual(busca_linear([1, 2, 3], 9), -1, "valor ausente — -1 sinaliza 'não encontrado'")
    t.igual(busca_linear([], 1), -1, "lista vazia — o laço nem executa e o retorno deve ser -1")
