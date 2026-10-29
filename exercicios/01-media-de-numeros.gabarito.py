def media(numeros):
    if len(numeros) == 0:
        return 0

    soma = 0
    for numero in numeros:
        soma += numero
    return soma / len(numeros)
