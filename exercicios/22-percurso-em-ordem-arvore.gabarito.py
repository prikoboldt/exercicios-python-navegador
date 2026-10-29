def em_ordem(raiz):
    if raiz is None:
        return []
    return em_ordem(raiz.esquerda) + [raiz.valor] + em_ordem(raiz.direita)
