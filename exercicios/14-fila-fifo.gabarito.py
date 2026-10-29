from collections import deque


class Fila:
    def __init__(self):
        self._itens = deque()

    def enfileirar(self, valor):
        self._itens.append(valor)

    def desenfileirar(self):
        if not self._itens:
            return None
        return self._itens.popleft()

    def frente(self):
        if not self._itens:
            return None
        return self._itens[0]

    def vazia(self):
        return len(self._itens) == 0

    def tamanho(self):
        return len(self._itens)
