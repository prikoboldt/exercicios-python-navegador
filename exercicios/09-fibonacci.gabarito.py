def fibonacci(n):
    if n < 0:
        return None

    anterior, atual = 0, 1
    for _ in range(n):
        anterior, atual = atual, anterior + atual
    return anterior
