def testar(fizz_buzz, t):
    def elemento(lista, i):
        return lista[i] if type(lista) is list and len(lista) > i else lista

    t.igual(fizz_buzz(1), [1], "fizz_buzz(1) — menor entrada: números comuns ficam como número, não como texto")
    t.igual(
        fizz_buzz(5),
        [1, 2, "Fizz", 4, "Buzz"],
        "fizz_buzz(5) — múltiplo de 3 vira 'Fizz' e múltiplo de 5 vira 'Buzz'",
    )
    t.igual(
        elemento(fizz_buzz(15), 14),
        "FizzBuzz",
        "15º item (valor 15) — múltiplo de 3 e de 5: teste essa condição ANTES das individuais",
    )
    t.igual(elemento(fizz_buzz(15), 2), "Fizz", "3º item (valor 3) — primeiro múltiplo de 3")
    t.igual(elemento(fizz_buzz(15), 9), "Buzz", "10º item (valor 10) — múltiplo de 5 que não é de 3")
