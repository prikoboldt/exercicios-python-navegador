def testar(eh_palindromo, t):
    t.verdadeiro(eh_palindromo("ovo"), 'eh_palindromo("ovo") — palíndromo simples, sem espaços nem maiúsculas')
    t.falso(eh_palindromo("casa"), 'eh_palindromo("casa") — palavra diferente do seu inverso')
    t.verdadeiro(eh_palindromo("Ame a ema"), 'eh_palindromo("Ame a ema") — ignore espaços e maiúsculas ao comparar')
    t.verdadeiro(eh_palindromo("Radar"), 'eh_palindromo("Radar") — a maiúscula inicial não pode atrapalhar: normalize antes')
    t.falso(eh_palindromo("python"), 'eh_palindromo("python") — texto longo que não é palíndromo')
