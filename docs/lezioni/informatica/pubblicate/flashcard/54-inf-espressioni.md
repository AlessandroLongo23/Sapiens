# Flashcard: Operatori ed espressioni

## espressione
Che cos'è un'espressione in un programma?
---
Un conto scritto con valori, variabili e operatori, che il computer calcola fino a ottenere un solo valore.

## precedenza
Quanto vale `2 + 3 * 4`?
---
14: la moltiplicazione si fa prima dell'addizione.

## parentesi
Quanto vale `(2 + 3) * 4`?
---
20: le parentesi fanno fare prima la somma.

## media-senza-parentesi
Con 6 in `a` e 8 in `b`, quanto vale `a + b / 2`?
---
10, non 7: la divisione riguarda solo `b`. La media è `(a + b) / 2`.

## frazione-su-una-riga
Come si scrive in un programma $\dfrac{a}{b + c}$?
---
`a / (b + c)`: la linea di frazione nasconde una coppia di parentesi.

## moltiplicazione-sottintesa
`2(a + b)` è un'espressione valida in un programma?
---
No. Il segno della moltiplicazione va scritto sempre: `2 * (a + b)`.

## divisione-python
In Python, quanto fanno `7 / 2` e `7 // 2`?
---
3.5 e 3: `/` dà il risultato con la virgola, `//` il quoziente intero.

## divisione-cpp
In C++, quanto fanno `7 / 2` e `7.0 / 2`?
---
3 e 3.5: tra due interi `/` dà il quoziente intero; con un numero con la virgola dà il risultato con la virgola.

## resto
Quanto vale `17 % 5`?
---
2: è il resto della divisione di 17 per 5, perché $3 \cdot 5 + 2 = 17$.

## pari
Quale espressione dice se `n` è pari?
---
`n % 2`: se il resto della divisione per 2 è 0, il numero è pari.

## ultima-cifra
Quanto vale `2026 % 10`?
---
6: il resto della divisione per 10 è l'ultima cifra.

## senza-ultima-cifra
In Python, quanto vale `2026 // 10`?
---
202: il quoziente della divisione per 10 è il numero senza l'ultima cifra. In C++ si scrive `2026 / 10`.

## ore-e-minuti
Un film dura 135 minuti. Quanto valgono, in Python, `135 // 60` e `135 % 60`?
---
2 e 15: due ore e quindici minuti.

## negativi-python
In Python, quanto valgono `-7 // 2` e `-7 % 2`?
---
$-4$ e $1$: Python arrotonda il quoziente all'intero più piccolo.

## negativi-cpp
In C++, quanto valgono `-7 / 2` e `-7 % 2`?
---
$-3$ e $-1$: il C++ toglie le cifre dopo la virgola, e il resto prende il segno del dividendo.

## potenza-python
In Python, quanto vale `2 ** 10`?
---
1024: `**` è l'operatore della potenza.

## potenza-cpp
Come si calcola $2^{10}$ in C++?
---
Con `pow(2, 10)`, dopo aver aggiunto la riga che include `cmath`. Il C++ non ha un operatore per le potenze.

## accento-circonflesso
Quanto vale `5 ^ 2` in Python e in C++?
---
7, non 25: il segno `^` non è la potenza, fa un'altra operazione sui bit.

## forme-brevi
Dopo `punti = 10`, `punti += 5` e `punti *= 2`, quanto vale `punti`?
---
30: `punti += 5` vuol dire `punti = punti + 5`, e `punti *= 2` lo raddoppia.

## stampa-con-la-virgola
Che cosa stampa Python per `20 / 5`? E il C++ per `20.0 / 5`?
---
Python stampa `4.0`, il C++ stampa `4`: `cout` toglie gli zeri finali.
