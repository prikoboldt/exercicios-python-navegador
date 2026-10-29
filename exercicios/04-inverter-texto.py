def testar(inverter_texto, t):
    t.igual(inverter_texto("ola"), "alo", 'inverter_texto("ola") — caso básico: o último caractere vira o primeiro')
    t.igual(inverter_texto(""), "", 'inverter_texto("") — texto vazio: sem caracteres, o resultado também é vazio')
    t.igual(inverter_texto("a"), "a", 'inverter_texto("a") — um único caractere: inverter não muda nada')
    t.igual(inverter_texto("Python"), "nohtyP", 'inverter_texto("Python") — maiúsculas e minúsculas são preservadas, só a ordem muda')
