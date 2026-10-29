def testar(eh_primo, t):
    t.falso(eh_primo(1), "eh_primo(1) — 1 não é primo: primos têm exatamente dois divisores")
    t.falso(eh_primo(0), "eh_primo(0) — zero não é primo (e é uma entrada válida: não pode quebrar o código)")
    t.falso(eh_primo(-3), "eh_primo(-3) — negativos não são primos")
    t.verdadeiro(eh_primo(2), "eh_primo(2) — menor primo e único par: cuidado com laços que o excluem")
    t.verdadeiro(eh_primo(13), "eh_primo(13) — primo ímpar: nenhum divisor entre 2 e a raiz quadrada")
    t.falso(eh_primo(9), "eh_primo(9) — quadrado de primo (3 × 3): o divisor é a própria raiz, use i * i <= numero")
    t.falso(eh_primo(15), "eh_primo(15) — composto com divisor pequeno (3): é encontrado cedo")
    t.verdadeiro(eh_primo(17), "eh_primo(17) — outro primo: confirma a verificação de divisores")
