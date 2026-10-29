class No:
    def __init__(self, valor, proximo=None):
        self.valor = valor
        self.proximo = proximo


class ListaLigada:
    def __init__(self):
        self.inicio = None

    def inserir_inicio(self, valor):
        self.inicio = No(valor, self.inicio)

    def inserir_fim(self, valor):
        novo = No(valor)
        if self.inicio is None:
            self.inicio = novo
            return
        atual = self.inicio
        while atual.proximo is not None:
            atual = atual.proximo
        atual.proximo = novo

    def para_lista(self):
        valores = []
        atual = self.inicio
        while atual is not None:
            valores.append(atual.valor)
            atual = atual.proximo
        return valores
