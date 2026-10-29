def ordenar_selecao(lista):
    resultado = list(lista)
    for i in range(len(resultado)):
        menor = i
        for j in range(i + 1, len(resultado)):
            if resultado[j] < resultado[menor]:
                menor = j
        resultado[i], resultado[menor] = resultado[menor], resultado[i]
    return resultado
