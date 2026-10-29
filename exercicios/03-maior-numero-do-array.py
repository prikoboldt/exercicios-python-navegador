def testar(maior_numero, t):
    t.igual(maior_numero([1, 4, 2]), 4, "maior_numero([1, 4, 2]) — caso básico: guarda o maior valor visto até agora")
    t.igual(maior_numero([-10, -3, -20]), -3, "maior_numero([-10, -3, -20]) — só negativos: não comece o maior em 0, senão 0 vence indevidamente")
    t.igual(maior_numero([7]), 7, "maior_numero([7]) — um único item: ele mesmo é o maior")
    t.igual(maior_numero([]), None, "maior_numero([]) — lista vazia: não existe maior valor, retorne None")
