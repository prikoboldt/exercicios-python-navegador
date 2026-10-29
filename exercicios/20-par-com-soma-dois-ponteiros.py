def testar(par_com_soma, t):
    def par(valor):
        # Aceita lista ou tupla: [2, 7] e (2, 7) são respostas válidas.
        return list(valor) if type(valor) is tuple else valor

    t.igual(par(par_com_soma([1, 2, 4, 7, 11], 9)), [2, 7], "par_com_soma([1, 2, 4, 7, 11], 9) — caso básico: 2 + 7 = 9 numa lista crescente")
    t.igual(par_com_soma([1, 2, 3], 10), None, "sem par possível — os ponteiros se encontram sem achar a soma: retorne None")
    t.igual(par(par_com_soma([0, 1, 5], 5)), [0, 5], "incluindo zero — 0 é um valor válido: 0 + 5 = 5")
    t.igual(par(par_com_soma([-3, 1, 4, 9], 5)), [1, 4], "com negativo — o -3 não forma par com ninguém, e o único par possível é 1 + 4")
    t.igual(par(par_com_soma([4, 4], 8)), [4, 4], "valores iguais — dois itens iguais em índices diferentes formam par (4 + 4)")
    t.igual(par_com_soma([8], 8), None, "um único item — não forma par: não use o mesmo índice duas vezes")
