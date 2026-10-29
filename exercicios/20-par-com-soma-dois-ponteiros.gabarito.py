def par_com_soma(numeros, alvo):
    esquerda, direita = 0, len(numeros) - 1
    while esquerda < direita:
        soma = numeros[esquerda] + numeros[direita]
        if soma == alvo:
            return [numeros[esquerda], numeros[direita]]
        if soma < alvo:
            esquerda += 1
        else:
            direita -= 1
    return None
