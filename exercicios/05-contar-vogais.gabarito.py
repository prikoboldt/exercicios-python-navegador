def contar_vogais(texto):
    total = 0
    for letra in texto.lower():
        if letra in "aeiou":
            total += 1
    return total
