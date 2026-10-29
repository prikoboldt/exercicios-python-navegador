def testar(busca_binaria, t):
    t.igual(busca_binaria([1, 3, 5, 7, 9], 7), 3, "busca_binaria([1, 3, 5, 7, 9], 7) — caso básico: compara com o meio e descarta metade")
    t.igual(busca_binaria([1, 3, 5, 7, 9], 1), 0, "primeiro item — a busca chega à extremidade esquerda")
    t.igual(busca_binaria([1, 3, 5, 7, 9], 9), 4, "último item — a busca chega à extremidade direita")
    t.igual(busca_binaria([1, 3, 5, 7, 9], 4), -1, "valor entre dois itens — termina quando inicio passa de fim")
    t.igual(busca_binaria([], 1), -1, "lista vazia — fim começa em -1 e o laço não chega a rodar")
    t.igual(busca_binaria([10], 10), 0, "lista com um item — inicio e fim coincidem e ainda precisam ser verificados (<=)")
