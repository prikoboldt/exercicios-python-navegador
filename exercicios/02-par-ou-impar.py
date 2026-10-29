def testar(eh_par, t):
    t.verdadeiro(eh_par(2), "eh_par(2) — caso básico: o resto da divisão por 2 é 0")
    t.falso(eh_par(3), "eh_par(3) — caso básico: o resto da divisão por 2 é 1, então é ímpar")
    t.verdadeiro(eh_par(0), "eh_par(0) — zero é par (0 % 2 == 0); não trate 0 como 'falso'")
    t.verdadeiro(eh_par(-8), "eh_par(-8) — negativo par: -8 % 2 dá 0")
    t.falso(eh_par(-7), "eh_par(-7) — negativo ímpar: -7 % 2 dá 1 em Python, então não é par")
