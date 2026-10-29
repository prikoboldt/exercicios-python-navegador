def testar(fatorial, t):
    t.igual(fatorial(0), 1, "fatorial(0) — caso especial: por definição 0! = 1 (produto vazio)")
    t.igual(fatorial(1), 1, "fatorial(1) — 1! = 1: o laço não precisa multiplicar nada")
    t.igual(fatorial(5), 120, "fatorial(5) — 5 · 4 · 3 · 2 · 1: multiplicação acumulada")
    t.igual(fatorial(7), 5040, "fatorial(7) — valor maior: confirma que o laço percorre todos os fatores")
    t.igual(fatorial(-2), None, "fatorial(-2) — negativos não têm fatorial: entrada inválida, retorne None")
