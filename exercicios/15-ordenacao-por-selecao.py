def testar(ordenar_selecao, t):
    original = [3, 1, 2]
    t.igual(ordenar_selecao(original), [1, 2, 3], "ordenar_selecao([3, 1, 2]) — caso básico: ordem crescente")
    t.igual(original, [3, 1, 2], "lista original — não deve ser alterada: trabalhe em uma cópia")
    t.igual(ordenar_selecao([]), [], "lista vazia — nada para ordenar")
    t.igual(ordenar_selecao([7]), [7], "um item — já está ordenado")
    t.igual(ordenar_selecao([-2, 10, -2, 0, 2]), [-2, -2, 0, 2, 10], "negativos, zero, repetidos e 2 dígitos — o menor de cada trecho precisa ser escolhido corretamente")
