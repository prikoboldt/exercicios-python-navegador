def remover_duplicados(lista):
    vistos = set()
    resultado = []
    for valor in lista:
        if valor not in vistos:
            vistos.add(valor)
            resultado.append(valor)
    return resultado
