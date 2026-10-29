def fatorial(n):
    if n < 0:
        return None

    resultado = 1
    for fator in range(2, n + 1):
        resultado *= fator
    return resultado
