def testar(contar_vogais, t):
    t.igual(contar_vogais("aeiou"), 5, 'contar_vogais("aeiou") — só vogais: cada uma conta uma vez')
    t.igual(contar_vogais("xyz"), 0, 'contar_vogais("xyz") — sem vogais: zero é um resultado válido, não um erro')
    t.igual(contar_vogais("Programacao"), 5, 'contar_vogais("Programacao") — mistura de vogais e consoantes: ignore as consoantes')
    t.igual(contar_vogais(""), 0, 'contar_vogais("") — texto vazio: não há o que contar')
    t.igual(contar_vogais("AEIOU"), 5, 'contar_vogais("AEIOU") — maiúsculas também são vogais: normalize com .lower()')
