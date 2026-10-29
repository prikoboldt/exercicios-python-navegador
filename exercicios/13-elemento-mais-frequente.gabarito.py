def mais_frequente(lista):
    if not lista:
        return None

    contagem = {}
    for valor in lista:
        contagem[valor] = contagem.get(valor, 0) + 1

    mais = lista[0]
    for valor in lista:
        if contagem[valor] > contagem[mais]:
            mais = valor
    return mais
