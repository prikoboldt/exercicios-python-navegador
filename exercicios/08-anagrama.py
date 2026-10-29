def testar(eh_anagrama, t):
    t.verdadeiro(eh_anagrama("roma", "amor"), 'eh_anagrama("roma", "amor") — mesmas letras em ordem diferente')
    t.falso(eh_anagrama("casa", "caso"), 'eh_anagrama("casa", "caso") — uma letra diferente desfaz o anagrama')
    t.verdadeiro(eh_anagrama("Listen", "Silent"), 'eh_anagrama("Listen", "Silent") — ignore diferença entre maiúsculas e minúsculas')
    t.verdadeiro(eh_anagrama("a gentleman", "elegant man"), 'eh_anagrama("a gentleman", "elegant man") — ignore os espaços entre as palavras')
    t.falso(eh_anagrama("abc", "ab"), 'eh_anagrama("abc", "ab") — quantidades de letras diferentes nunca formam anagrama')
