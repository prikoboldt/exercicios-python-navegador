// ARQUIVO GERADO por ferramentas/gerar_dados.py a partir de exercicios/. Não edite à mão.
window.EXERCICIOS_DADOS = [
 {
  "id": "01",
  "categoria": "Lógica de programação",
  "titulo": "Média de uma lista de números",
  "enunciado": "Implemente media(numeros), que recebe uma lista de números e retorna a média aritmética deles. Se a lista estiver vazia, retorne 0. O 0 é um número válido: ele conta no cálculo, não é um valor 'vazio'.",
  "dica": "Some todos os valores e divida pela quantidade (len(numeros)). Zero conta na divisão, então não o descarte. Em uma lista vazia, retorne 0 antes de dividir: dividir por zero gera ZeroDivisionError. Sem return a função devolve None.",
  "funcoes": [
   "media"
  ],
  "codigoInicial": "\"\"\"\n01 — Média\nRetorne a média aritmética dos números da lista.\nSe a lista estiver vazia, retorne 0.\nO zero é um valor válido e conta no cálculo.\n\"\"\"\n\n\ndef media(numeros):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(media, t):\n    t.igual(media([2, 4, 6]), 4, \"media([2, 4, 6]) — caso básico: (2 + 4 + 6) / 3 = 4\")\n    t.igual(media([1, 2, 3, 4]), 2.5, \"media([1, 2, 3, 4]) — a média pode ser decimal: não arredonde o resultado\")\n    t.igual(media([7]), 7, \"media([7]) — um único elemento: a média é o próprio valor\")\n    t.igual(media([0, 0, 0]), 0, \"media([0, 0, 0]) — só zeros: a média é 0, e 0 é um resultado válido\")\n    t.igual(media([0, 10]), 5, \"media([0, 10]) — o zero conta na divisão: (0 + 10) / 2, e não 10 / 1\")\n    t.igual(media([2, 4, 6, 0]), 3, \"media([2, 4, 6, 0]) — zero no meio da lista também entra na quantidade de itens\")\n    t.igual(media([-4, 10]), 3, \"media([-4, 10]) — número negativo: o sinal faz parte da soma\")\n    t.igual(media([-3, 3]), 0, \"media([-3, 3]) — opostos se anulam: a soma e a média são 0\")\n    t.igual(media([1.5, 2.5]), 2, \"media([1.5, 2.5]) — decimais: a média não se limita a inteiros\")\n    t.igual(media([]), 0, \"media([]) — lista vazia: retorne 0 em vez de dividir por zero (ZeroDivisionError)\")\n",
  "gabarito": "def media(numeros):\n    if len(numeros) == 0:\n        return 0\n\n    soma = 0\n    for numero in numeros:\n        soma += numero\n    return soma / len(numeros)\n"
 },
 {
  "id": "02",
  "categoria": "Lógica de programação",
  "titulo": "Par ou ímpar",
  "enunciado": "eh_par(numero) deve retornar True para pares e False para ímpares.",
  "dica": "O resto da divisão por 2 (numero % 2) é 0 quando o número é par. Retorne um booleano: a comparação numero % 2 == 0 já devolve True ou False.",
  "funcoes": [
   "eh_par"
  ],
  "codigoInicial": "\"\"\"\n02 — Par ou ímpar\nRetorne True se o número for par, e False se for ímpar.\n\"\"\"\n\n\ndef eh_par(numero):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(eh_par, t):\n    t.verdadeiro(eh_par(2), \"eh_par(2) — caso básico: o resto da divisão por 2 é 0\")\n    t.falso(eh_par(3), \"eh_par(3) — caso básico: o resto da divisão por 2 é 1, então é ímpar\")\n    t.verdadeiro(eh_par(0), \"eh_par(0) — zero é par (0 % 2 == 0); não trate 0 como 'falso'\")\n    t.verdadeiro(eh_par(-8), \"eh_par(-8) — negativo par: -8 % 2 dá 0\")\n    t.falso(eh_par(-7), \"eh_par(-7) — negativo ímpar: -7 % 2 dá 1 em Python, então não é par\")\n",
  "gabarito": "def eh_par(numero):\n    return numero % 2 == 0\n"
 },
 {
  "id": "03",
  "categoria": "Lógica de programação",
  "titulo": "Maior número da lista",
  "enunciado": "maior_numero(numeros) retorna o maior valor, ou None se a lista estiver vazia.",
  "dica": "Percorra a lista guardando o maior até agora. Trate [] retornando None. Cuidado: começar o maior em 0 falha quando todos os números são negativos.",
  "funcoes": [
   "maior_numero"
  ],
  "codigoInicial": "\"\"\"\n03 — Maior número\nRetorne o maior valor da lista. Se a lista estiver vazia, retorne None.\n\"\"\"\n\n\ndef maior_numero(numeros):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(maior_numero, t):\n    t.igual(maior_numero([1, 4, 2]), 4, \"maior_numero([1, 4, 2]) — caso básico: guarda o maior valor visto até agora\")\n    t.igual(maior_numero([-10, -3, -20]), -3, \"maior_numero([-10, -3, -20]) — só negativos: não comece o maior em 0, senão 0 vence indevidamente\")\n    t.igual(maior_numero([7]), 7, \"maior_numero([7]) — um único item: ele mesmo é o maior\")\n    t.igual(maior_numero([]), None, \"maior_numero([]) — lista vazia: não existe maior valor, retorne None\")\n",
  "gabarito": "def maior_numero(numeros):\n    if not numeros:\n        return None\n\n    maior = numeros[0]\n    for numero in numeros:\n        if numero > maior:\n            maior = numero\n    return maior\n"
 },
 {
  "id": "04",
  "categoria": "Lógica de programação",
  "titulo": "Inverter texto",
  "enunciado": "inverter_texto(\"ola\") deve retornar \"alo\".",
  "dica": "Você pode percorrer a string de trás para frente ou usar o fatiamento texto[::-1].",
  "funcoes": [
   "inverter_texto"
  ],
  "codigoInicial": "\"\"\"\n04 — Inverter texto\nRetorne a string invertida. Exemplo: \"ola\" → \"alo\"\n\"\"\"\n\n\ndef inverter_texto(texto):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(inverter_texto, t):\n    t.igual(inverter_texto(\"ola\"), \"alo\", 'inverter_texto(\"ola\") — caso básico: o último caractere vira o primeiro')\n    t.igual(inverter_texto(\"\"), \"\", 'inverter_texto(\"\") — texto vazio: sem caracteres, o resultado também é vazio')\n    t.igual(inverter_texto(\"a\"), \"a\", 'inverter_texto(\"a\") — um único caractere: inverter não muda nada')\n    t.igual(inverter_texto(\"Python\"), \"nohtyP\", 'inverter_texto(\"Python\") — maiúsculas e minúsculas são preservadas, só a ordem muda')\n",
  "gabarito": "def inverter_texto(texto):\n    return texto[::-1]\n"
 },
 {
  "id": "05",
  "categoria": "Lógica de programação",
  "titulo": "Contar vogais",
  "enunciado": "Conte a, e, i, o, u ignorando maiúsculas. Não conte acentos neste exercício.",
  "dica": "Normalize com .lower() e some 1 para cada letra que esteja em \"aeiou\".",
  "funcoes": [
   "contar_vogais"
  ],
  "codigoInicial": "\"\"\"\n05 — Contar vogais\nConte quantas vogais (a, e, i, o, u) existem no texto.\nIgnore maiúsculas/minúsculas. Não conte acentos como vogal neste exercício.\n\"\"\"\n\n\ndef contar_vogais(texto):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(contar_vogais, t):\n    t.igual(contar_vogais(\"aeiou\"), 5, 'contar_vogais(\"aeiou\") — só vogais: cada uma conta uma vez')\n    t.igual(contar_vogais(\"xyz\"), 0, 'contar_vogais(\"xyz\") — sem vogais: zero é um resultado válido, não um erro')\n    t.igual(contar_vogais(\"Programacao\"), 5, 'contar_vogais(\"Programacao\") — mistura de vogais e consoantes: ignore as consoantes')\n    t.igual(contar_vogais(\"\"), 0, 'contar_vogais(\"\") — texto vazio: não há o que contar')\n    t.igual(contar_vogais(\"AEIOU\"), 5, 'contar_vogais(\"AEIOU\") — maiúsculas também são vogais: normalize com .lower()')\n",
  "gabarito": "def contar_vogais(texto):\n    total = 0\n    for letra in texto.lower():\n        if letra in \"aeiou\":\n            total += 1\n    return total\n"
 },
 {
  "id": "06",
  "categoria": "Lógica de programação",
  "titulo": "Remover duplicados",
  "enunciado": "Mantenha a ordem da primeira ocorrência de cada valor.",
  "dica": "Percorra a lista e só adicione ao resultado o que ainda não apareceu (um set ajuda a lembrar). list(dict.fromkeys(lista)) também mantém a ordem.",
  "funcoes": [
   "remover_duplicados"
  ],
  "codigoInicial": "\"\"\"\n06 — Remover duplicados\nRetorne uma NOVA lista sem valores repetidos, mantendo a ordem da primeira ocorrência.\n\"\"\"\n\n\ndef remover_duplicados(lista):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(remover_duplicados, t):\n    t.igual(remover_duplicados([1, 2, 2, 3]), [1, 2, 3], \"remover_duplicados([1, 2, 2, 3]) — repetido em sequência: mantém uma ocorrência\")\n    t.igual(remover_duplicados([\"a\", \"b\", \"a\"]), [\"a\", \"b\"], 'remover_duplicados([\"a\", \"b\", \"a\"]) — repetido separado: mantém a ordem da primeira aparição')\n    t.igual(remover_duplicados([]), [], \"remover_duplicados([]) — lista vazia: devolve lista vazia\")\n    t.igual(remover_duplicados([1, 1, 1]), [1], \"remover_duplicados([1, 1, 1]) — todos iguais: sobra um único elemento\")\n",
  "gabarito": "def remover_duplicados(lista):\n    vistos = set()\n    resultado = []\n    for valor in lista:\n        if valor not in vistos:\n            vistos.add(valor)\n            resultado.append(valor)\n    return resultado\n"
 },
 {
  "id": "07",
  "categoria": "Lógica de programação",
  "titulo": "Número primo",
  "enunciado": "Primos são maiores que 1 e só têm dois divisores: 1 e eles mesmos.",
  "dica": "Números <= 1 não são primos. Basta testar divisores até a raiz quadrada (enquanto i * i <= numero).",
  "funcoes": [
   "eh_primo"
  ],
  "codigoInicial": "\"\"\"\n07 — Número primo\nRetorne True se o número for primo (maior que 1 e divisível só por 1 e por ele mesmo).\n\"\"\"\n\n\ndef eh_primo(numero):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(eh_primo, t):\n    t.falso(eh_primo(1), \"eh_primo(1) — 1 não é primo: primos têm exatamente dois divisores\")\n    t.falso(eh_primo(0), \"eh_primo(0) — zero não é primo (e é uma entrada válida: não pode quebrar o código)\")\n    t.falso(eh_primo(-3), \"eh_primo(-3) — negativos não são primos\")\n    t.verdadeiro(eh_primo(2), \"eh_primo(2) — menor primo e único par: cuidado com laços que o excluem\")\n    t.verdadeiro(eh_primo(13), \"eh_primo(13) — primo ímpar: nenhum divisor entre 2 e a raiz quadrada\")\n    t.falso(eh_primo(9), \"eh_primo(9) — quadrado de primo (3 × 3): o divisor é a própria raiz, use i * i <= numero\")\n    t.falso(eh_primo(15), \"eh_primo(15) — composto com divisor pequeno (3): é encontrado cedo\")\n    t.verdadeiro(eh_primo(17), \"eh_primo(17) — outro primo: confirma a verificação de divisores\")\n",
  "gabarito": "def eh_primo(numero):\n    if numero <= 1:\n        return False\n\n    divisor = 2\n    while divisor * divisor <= numero:\n        if numero % divisor == 0:\n            return False\n        divisor += 1\n    return True\n"
 },
 {
  "id": "08",
  "categoria": "Lógica de programação",
  "titulo": "Anagrama",
  "enunciado": "Mesmas letras na mesma quantidade, ignorando maiúsculas e espaços.",
  "dica": "Remova os espaços, normalize o case e compare as letras ordenadas: sorted(a) == sorted(b).",
  "funcoes": [
   "eh_anagrama"
  ],
  "codigoInicial": "\"\"\"\n08 — Anagrama\nRetorne True se as duas palavras forem anagramas\n(mesmas letras, mesma quantidade, ignorando maiúsculas/minúsculas e espaços).\n\"\"\"\n\n\ndef eh_anagrama(a, b):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(eh_anagrama, t):\n    t.verdadeiro(eh_anagrama(\"roma\", \"amor\"), 'eh_anagrama(\"roma\", \"amor\") — mesmas letras em ordem diferente')\n    t.falso(eh_anagrama(\"casa\", \"caso\"), 'eh_anagrama(\"casa\", \"caso\") — uma letra diferente desfaz o anagrama')\n    t.verdadeiro(eh_anagrama(\"Listen\", \"Silent\"), 'eh_anagrama(\"Listen\", \"Silent\") — ignore diferença entre maiúsculas e minúsculas')\n    t.verdadeiro(eh_anagrama(\"a gentleman\", \"elegant man\"), 'eh_anagrama(\"a gentleman\", \"elegant man\") — ignore os espaços entre as palavras')\n    t.falso(eh_anagrama(\"abc\", \"ab\"), 'eh_anagrama(\"abc\", \"ab\") — quantidades de letras diferentes nunca formam anagrama')\n",
  "gabarito": "def eh_anagrama(a, b):\n    letras_a = sorted(a.replace(\" \", \"\").lower())\n    letras_b = sorted(b.replace(\" \", \"\").lower())\n    return letras_a == letras_b\n"
 },
 {
  "id": "09",
  "categoria": "Algoritmos e estruturas de dados",
  "titulo": "Busca linear",
  "enunciado": "Retorne o índice da primeira ocorrência, ou -1 se não existir.",
  "dica": "Percorra com um for (range(len(lista)) ou enumerate) e compare lista[i] == alvo. Se terminar o laço, retorne -1.",
  "funcoes": [
   "busca_linear"
  ],
  "codigoInicial": "\"\"\"\n09 — Busca linear\nPercorra a lista e retorne o índice da primeira ocorrência de alvo.\nSe não existir, retorne -1.\n\"\"\"\n\n\ndef busca_linear(lista, alvo):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(busca_linear, t):\n    t.igual(busca_linear([4, 8, 15, 16], 15), 2, \"busca_linear([4, 8, 15, 16], 15) — caso básico: devolve o índice onde o valor está\")\n    t.igual(busca_linear([4, 8, 15, 16], 4), 0, \"primeira posição — o índice 0 é válido, não confunda com 'não achou'\")\n    t.igual(busca_linear([1, 2, 2, 3], 2), 1, \"valor repetido — pare na primeira ocorrência\")\n    t.igual(busca_linear([1, 2, 3], 9), -1, \"valor ausente — -1 sinaliza 'não encontrado'\")\n    t.igual(busca_linear([], 1), -1, \"lista vazia — o laço nem executa e o retorno deve ser -1\")\n",
  "gabarito": "def busca_linear(lista, alvo):\n    for indice, valor in enumerate(lista):\n        if valor == alvo:\n            return indice\n    return -1\n"
 },
 {
  "id": "10",
  "categoria": "Algoritmos e estruturas de dados",
  "titulo": "Busca binária",
  "enunciado": "A lista está ordenada. Encontre o índice de alvo em tempo logarítmico.",
  "dica": "Mantenha inicio e fim. Compare o meio ((inicio + fim) // 2): se for menor que o alvo, descarte a metade esquerda.",
  "funcoes": [
   "busca_binaria"
  ],
  "codigoInicial": "\"\"\"\n10 — Busca binária\nA lista já está ordenada em ordem crescente.\nRetorne o índice de alvo, ou -1 se não existir.\nUse divisão do intervalo (meio), sem percorrer um a um.\n\"\"\"\n\n\ndef busca_binaria(lista, alvo):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(busca_binaria, t):\n    t.igual(busca_binaria([1, 3, 5, 7, 9], 7), 3, \"busca_binaria([1, 3, 5, 7, 9], 7) — caso básico: compara com o meio e descarta metade\")\n    t.igual(busca_binaria([1, 3, 5, 7, 9], 1), 0, \"primeiro item — a busca chega à extremidade esquerda\")\n    t.igual(busca_binaria([1, 3, 5, 7, 9], 9), 4, \"último item — a busca chega à extremidade direita\")\n    t.igual(busca_binaria([1, 3, 5, 7, 9], 4), -1, \"valor entre dois itens — termina quando inicio passa de fim\")\n    t.igual(busca_binaria([], 1), -1, \"lista vazia — fim começa em -1 e o laço não chega a rodar\")\n    t.igual(busca_binaria([10], 10), 0, \"lista com um item — inicio e fim coincidem e ainda precisam ser verificados (<=)\")\n",
  "gabarito": "def busca_binaria(lista, alvo):\n    inicio, fim = 0, len(lista) - 1\n    while inicio <= fim:\n        meio = (inicio + fim) // 2\n        if lista[meio] == alvo:\n            return meio\n        if lista[meio] < alvo:\n            inicio = meio + 1\n        else:\n            fim = meio - 1\n    return -1\n"
 },
 {
  "id": "11",
  "categoria": "Algoritmos e estruturas de dados",
  "titulo": "Ordenação por seleção",
  "enunciado": "Devolva uma nova lista crescente. Não use sorted() nem list.sort() e não altere a original.",
  "dica": "A cada passo, ache o menor do trecho restante e troque com a posição atual. Copie a lista antes (lista[:] ou list(lista)).",
  "funcoes": [
   "ordenar_selecao"
  ],
  "codigoInicial": "\"\"\"\n11 — Ordenação por seleção\nRetorne uma NOVA lista com os números em ordem crescente.\nNão use sorted() nem list.sort(). Não altere a lista original.\n\"\"\"\n\n\ndef ordenar_selecao(lista):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(ordenar_selecao, t):\n    original = [3, 1, 2]\n    t.igual(ordenar_selecao(original), [1, 2, 3], \"ordenar_selecao([3, 1, 2]) — caso básico: ordem crescente\")\n    t.igual(original, [3, 1, 2], \"lista original — não deve ser alterada: trabalhe em uma cópia\")\n    t.igual(ordenar_selecao([]), [], \"lista vazia — nada para ordenar\")\n    t.igual(ordenar_selecao([7]), [7], \"um item — já está ordenado\")\n    t.igual(ordenar_selecao([-2, 10, -2, 0, 2]), [-2, -2, 0, 2, 10], \"negativos, zero, repetidos e 2 dígitos — o menor de cada trecho precisa ser escolhido corretamente\")\n",
  "gabarito": "def ordenar_selecao(lista):\n    resultado = list(lista)\n    for i in range(len(resultado)):\n        menor = i\n        for j in range(i + 1, len(resultado)):\n            if resultado[j] < resultado[menor]:\n                menor = j\n        resultado[i], resultado[menor] = resultado[menor], resultado[i]\n    return resultado\n"
 },
 {
  "id": "12",
  "categoria": "Algoritmos e estruturas de dados",
  "titulo": "Mesclar listas ordenadas",
  "enunciado": "Una duas listas já ordenadas em uma terceira, também ordenada.",
  "dica": "Dois ponteiros: sempre copie o menor entre a[i] e b[j]. No fim, copie o que sobrou.",
  "funcoes": [
   "mesclar_ordenados"
  ],
  "codigoInicial": "\"\"\"\n12 — Mesclar listas ordenadas\na e b já estão em ordem crescente.\nRetorne uma nova lista com todos os valores, também ordenada.\nUse dois ponteiros; não concatene e depois ordene.\n\"\"\"\n\n\ndef mesclar_ordenados(a, b):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(mesclar_ordenados, t):\n    t.igual(mesclar_ordenados([1, 3, 5], [2, 4, 6]), [1, 2, 3, 4, 5, 6], \"mesclar [1, 3, 5] e [2, 4, 6] — dois ponteiros: copie sempre o menor dos dois da frente\")\n    t.igual(mesclar_ordenados([], [1, 2]), [1, 2], \"primeira lista vazia — devolve o restante da segunda\")\n    t.igual(mesclar_ordenados([1, 2], []), [1, 2], \"segunda lista vazia — devolve o restante da primeira\")\n    t.igual(mesclar_ordenados([1, 1], [1, 2]), [1, 1, 1, 2], \"valores repetidos — os repetidos das duas listas são mantidos\")\n    t.igual(mesclar_ordenados([-5, 0], [-2, 4]), [-5, -2, 0, 4], \"negativos e zero — seguem a mesma comparação\")\n",
  "gabarito": "def mesclar_ordenados(a, b):\n    resultado = []\n    i = j = 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            resultado.append(a[i])\n            i += 1\n        else:\n            resultado.append(b[j])\n            j += 1\n    resultado.extend(a[i:])\n    resultado.extend(b[j:])\n    return resultado\n"
 },
 {
  "id": "13",
  "categoria": "Algoritmos e estruturas de dados",
  "titulo": "Pilha (LIFO)",
  "enunciado": "Último a entrar é o primeiro a sair: empilhar, desempilhar, topo, vazia, tamanho.",
  "dica": "Guarde os itens em uma lista. empilhar = append, desempilhar = pop (cuidado com a pilha vazia), topo = último item.",
  "funcoes": [
   "Pilha"
  ],
  "codigoInicial": "\"\"\"\n13 — Pilha (LIFO)\nImplemente a classe Pilha com os métodos:\n- empilhar(valor)\n- desempilhar() → remove e retorna o topo, ou None se vazia\n- topo() → olha o topo sem remover, ou None se vazia\n- vazia() → True/False\n- tamanho() → quantidade de itens\n\"\"\"\n\n\nclass Pilha:\n    def __init__(self):\n        # implemente aqui\n        pass\n",
  "fonteTeste": "def testar(Pilha, t):\n    pilha = Pilha()\n    t.verdadeiro(pilha.vazia(), \"vazia() — estado inicial: uma pilha recém-criada não tem itens\")\n    t.igual(pilha.tamanho(), 0, \"tamanho() — zero é um tamanho válido: pilha vazia tem 0 itens\")\n    t.igual(pilha.desempilhar(), None, \"desempilhar() numa pilha vazia não quebra: devolve None\")\n\n    pilha.empilhar(10)\n    pilha.empilhar(20)\n    t.igual(pilha.topo(), 20, \"topo() — mostra o último item empilhado (20) sem removê-lo\")\n    t.igual(pilha.tamanho(), 2, \"tamanho() — cada empilhar aumenta o tamanho em 1\")\n    t.falso(pilha.vazia(), \"vazia() — com itens guardados deve ser False\")\n    t.igual(pilha.desempilhar(), 20, \"LIFO — o último a entrar (20) é o primeiro a sair\")\n    t.igual(pilha.desempilhar(), 10, \"desempilhar() — em seguida sai o item anterior (10)\")\n    t.verdadeiro(pilha.vazia(), \"vazia() — ao retirar tudo, a pilha volta ao estado vazio\")\n",
  "gabarito": "class Pilha:\n    def __init__(self):\n        self._itens = []\n\n    def empilhar(self, valor):\n        self._itens.append(valor)\n\n    def desempilhar(self):\n        if not self._itens:\n            return None\n        return self._itens.pop()\n\n    def topo(self):\n        if not self._itens:\n            return None\n        return self._itens[-1]\n\n    def vazia(self):\n        return len(self._itens) == 0\n\n    def tamanho(self):\n        return len(self._itens)\n"
 },
 {
  "id": "14",
  "categoria": "Algoritmos e estruturas de dados",
  "titulo": "Fila (FIFO)",
  "enunciado": "Primeiro a entrar é o primeiro a sair: enfileirar, desenfileirar, frente, vazia, tamanho.",
  "dica": "Guarde os itens em uma lista. enfileirar = append no fim, desenfileirar = pop(0) no início (ou use collections.deque).",
  "funcoes": [
   "Fila"
  ],
  "codigoInicial": "\"\"\"\n14 — Fila (FIFO)\nImplemente a classe Fila com os métodos:\n- enfileirar(valor)\n- desenfileirar() → remove e retorna o primeiro, ou None se vazia\n- frente() → olha o primeiro sem remover, ou None se vazia\n- vazia() → True/False\n- tamanho() → quantidade de itens\n\"\"\"\n\n\nclass Fila:\n    def __init__(self):\n        # implemente aqui\n        pass\n",
  "fonteTeste": "def testar(Fila, t):\n    fila = Fila()\n    t.verdadeiro(fila.vazia(), \"vazia() — estado inicial: uma fila recém-criada não tem itens\")\n    t.igual(fila.desenfileirar(), None, \"desenfileirar() numa fila vazia não quebra: devolve None\")\n    t.igual(fila.frente(), None, \"frente() numa fila vazia também devolve None\")\n\n    fila.enfileirar(\"a\")\n    fila.enfileirar(\"b\")\n    fila.enfileirar(\"c\")\n    t.igual(fila.frente(), \"a\", \"frente() — mostra o primeiro que entrou, sem removê-lo\")\n    t.igual(fila.tamanho(), 3, \"tamanho() — três itens enfileirados\")\n    t.igual(fila.desenfileirar(), \"a\", \"FIFO — o primeiro a entrar ('a') é o primeiro a sair\")\n    t.igual(fila.desenfileirar(), \"b\", \"desenfileirar() — depois sai o segundo ('b')\")\n    t.igual(fila.frente(), \"c\", \"frente() — resta apenas 'c' no início da fila\")\n",
  "gabarito": "from collections import deque\n\n\nclass Fila:\n    def __init__(self):\n        self._itens = deque()\n\n    def enfileirar(self, valor):\n        self._itens.append(valor)\n\n    def desenfileirar(self):\n        if not self._itens:\n            return None\n        return self._itens.popleft()\n\n    def frente(self):\n        if not self._itens:\n            return None\n        return self._itens[0]\n\n    def vazia(self):\n        return len(self._itens) == 0\n\n    def tamanho(self):\n        return len(self._itens)\n"
 },
 {
  "id": "15",
  "categoria": "Algoritmos e estruturas de dados",
  "titulo": "Elemento mais frequente",
  "enunciado": "Use um dicionário de contagem. Em empate, fique com quem apareceu primeiro.",
  "dica": "Um dicionário (ou collections.Counter) conta as ocorrências. Percorra a lista de novo para achar o máximo, ficando com o primeiro em caso de empate.",
  "funcoes": [
   "mais_frequente"
  ],
  "codigoInicial": "\"\"\"\n15 — Elemento mais frequente (dicionário)\nRetorne o valor que mais aparece na lista.\nEm empate, retorne o que apareceu primeiro.\nLista vazia → None.\n\"\"\"\n\n\ndef mais_frequente(lista):\n    # implemente aqui\n    pass\n",
  "fonteTeste": "def testar(mais_frequente, t):\n    t.igual(mais_frequente([1, 3, 1, 3, 1]), 1, \"mais_frequente([1, 3, 1, 3, 1]) — contagem: o 1 aparece 3 vezes, mais que o 3 (2 vezes)\")\n    t.igual(mais_frequente([\"a\", \"b\", \"b\", \"a\"]), \"a\", \"empate — vence quem aparece primeiro na lista\")\n    t.igual(mais_frequente([7]), 7, \"um item — ele mesmo é o mais frequente\")\n    t.igual(mais_frequente([]), None, \"lista vazia — não há elemento mais frequente: retorne None\")\n    t.igual(mais_frequente([\"x\", \"y\", \"y\", \"z\"]), \"y\", \"textos — funciona com qualquer tipo: 'y' aparece duas vezes\")\n",
  "gabarito": "def mais_frequente(lista):\n    if not lista:\n        return None\n\n    contagem = {}\n    for valor in lista:\n        contagem[valor] = contagem.get(valor, 0) + 1\n\n    mais = lista[0]\n    for valor in lista:\n        if contagem[valor] > contagem[mais]:\n            mais = valor\n    return mais\n"
 }
];
