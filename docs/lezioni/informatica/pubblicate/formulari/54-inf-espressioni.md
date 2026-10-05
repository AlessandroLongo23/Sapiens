# Formulario: Operatori ed espressioni

## Operatori aritmetici

- Espressione: un conto scritto con valori, variabili e operatori, che il computer calcola fino a un solo valore.

| Operazione | Python | C++ | Esempio |
|---|---|---|---|
| addizione | `+` | `+` | `7 + 2` fa 9 |
| sottrazione | `-` | `-` | `7 - 2` fa 5 |
| moltiplicazione | `*` | `*` | `7 * 2` fa 14 |
| divisione | `/` | `/` con almeno un numero con la virgola | `7 / 2` oppure `7.0 / 2` fa 3.5 |
| quoziente intero | `//` | `/` tra due interi | `7 // 2` oppure `7 / 2` fa 3 |
| resto | `%` | `%` | `7 % 2` fa 1 |
| potenza | `**` | `pow(a, b)` con `#include <cmath>` | `2 ** 3` oppure `pow(2, 3)` fa 8 |

## Ordine dei calcoli

1. Parentesi, solo tonde, dalla più interna.
2. Potenze.
3. Moltiplicazioni, divisioni e resti, da sinistra a destra.
4. Addizioni e sottrazioni, da sinistra a destra.

- $\dfrac{a + b}{2}$ si scrive `(a + b) / 2`; $\dfrac{a}{b + c}$ si scrive `a / (b + c)`.
- $2(a + b)$ si scrive `2 * (a + b)`.

## Quoziente e resto

| Che cosa vuoi sapere | Python | C++ |
|---|---|---|
| se `n` è pari | `n % 2` è 0 | uguale |
| l'ultima cifra di `n` | `n % 10` | uguale |
| `n` senza l'ultima cifra | `n // 10` | `n / 10` |
| ore intere in `minuti` | `minuti // 60` | `minuti / 60` |
| minuti che avanzano | `minuti % 60` | uguale |

- In C++, per la divisione con la virgola tra due variabili intere: `(double) a / b`.

## Dove i due linguaggi danno risultati diversi

| Espressione | Python | C++ |
|---|---|---|
| `7 / 2` | 3.5 | 3 |
| `-7 // 2` in Python, `-7 / 2` in C++ | $-4$ | $-3$ |
| `-7 % 2` | $1$ | $-1$ |
| $2^{30}$, con `2 ** 30` e `pow(2, 30)` | `1073741824` | `1.07374e+09` |
| stampa di $20 : 5$ con la virgola | `4.0` | `4` |
| stampa di $10 : 3$ | `3.3333333333333335` | `3.33333` |

- Con i negativi Python arrotonda il quoziente all'intero più piccolo, il C++ toglie le cifre dopo la virgola; in tutti e due quoziente per divisore più resto dà il dividendo.
- In C++ una variabile `int` arriva al massimo a $2^{31} - 1 = 2\,147\,483\,647$.

## Forme brevi

- `x += 5` vuol dire `x = x + 5`; allo stesso modo `x -= 1` e `x *= 2`. Valgono in Python e in C++.
- Solo in C++: `i++` è `i = i + 1`, `i--` è `i = i - 1`. In Python si scrive `i += 1`.

```ad-warning
La linea di frazione nasconde due parentesi
`a + b / 2` divide per 2 solo `b`.
```

```ad-warning
L'accento circonflesso non è la potenza
`5 ^ 2` dà 7, non 25, senza nessun errore.
```

```ad-warning
In C++ la divisione tra interi non avvisa
`7 / 2` fa 3 e il programma va avanti.
```
