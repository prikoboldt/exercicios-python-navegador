def testar(fibonacci, t):
    t.igual(fibonacci(0), 0, "fibonacci(0) — caso base: o primeiro termo da sequência é 0")
    t.igual(fibonacci(1), 1, "fibonacci(1) — caso base: o segundo termo é 1")
    t.igual(fibonacci(2), 1, "fibonacci(2) — primeiro termo calculado: 0 + 1")
    t.igual(fibonacci(7), 13, "fibonacci(7) — cada termo é a soma dos dois anteriores")
    t.igual(fibonacci(10), 55, "fibonacci(10) — valor maior: confirma que o laço (ou recursão) avança certo")
    t.igual(fibonacci(-1), None, "fibonacci(-1) — posição negativa não existe: retorne None")
