def eh_palindromo(texto):
    limpo = texto.replace(" ", "").lower()
    return limpo == limpo[::-1]
