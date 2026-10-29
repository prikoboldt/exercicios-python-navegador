class Pilha:
    def __init__(self):
        self._itens = []

    def empilhar(self, valor):
        self._itens.append(valor)

    def desempilhar(self):
        if not self._itens:
            return None
        return self._itens.pop()

    def topo(self):
        if not self._itens:
            return None
        return self._itens[-1]

    def vazia(self):
        return len(self._itens) == 0

    def tamanho(self):
        return len(self._itens)
