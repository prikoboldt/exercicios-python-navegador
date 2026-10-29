def eh_anagrama(a, b):
    letras_a = sorted(a.replace(" ", "").lower())
    letras_b = sorted(b.replace(" ", "").lower())
    return letras_a == letras_b
