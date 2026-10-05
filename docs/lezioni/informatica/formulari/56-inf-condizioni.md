# Formulario: Condizioni e operatori di confronto

## Condizione

- Condizione: un'espressione il cui valore è vero oppure falso, secondo i valori che le variabili hanno in quel momento.
- Con `voto` uguale a $7$: `voto >= 6` è vera, `voto == 10` è falsa.
- Nel diagramma di flusso la condizione sta in un rombo, con una freccia per il sì e una per il no.

## I sei operatori di confronto

Si scrivono allo stesso modo in Python e in C++.

| Operatore | Si legge | Vera | Falsa |
|---|---|---|---|
| `==` | uguale a | `5 == 5` | `5 == 3` |
| `!=` | diverso da | `5 != 3` | `5 != 5` |
| `<` | minore di | `3 < 5` | `5 < 5` |
| `<=` | minore o uguale a | `5 <= 5` | `6 <= 5` |
| `>` | maggiore di | `5 > 3` | `3 > 5` |
| `>=` | maggiore o uguale a | `5 >= 5` | `3 >= 5` |

| A parole | Condizione |
|---|---|
| almeno $18$ anni | `eta >= 18` |
| più di $18$ anni | `eta > 18` |
| al massimo $10$ | `voto <= 10` |

## Il tipo booleano

| | Python | C++ |
|---|---|---|
| Tipo | `bool` | `bool` |
| Valori | `True`, `False` | `true`, `false` |
| Mettere una condizione in una variabile | `maggiorenne = eta >= 18` | `bool maggiorenne = eta >= 18;` |
| Scrivere una condizione | `print(voto >= 6)` | `cout << (voto >= 6) << endl;` |
| Che cosa compare | `True` o `False` | `1` o `0` (`true` o `false` dopo `cout << boolalpha;`) |

## Assegnare e confrontare

| Scrittura | Che cosa fa |
|---|---|
| `a = b` | assegnamento: copia in `a` il valore di `b` |
| `a == b` | confronto: vero se i due valori sono uguali, e non cambia niente |
| `uguali = a == b` | calcola il confronto e mette il risultato in `uguali` |

## Numeri con la virgola

- `0.1 + 0.2 == 0.3` è falsa: i numeri con la virgola sono conservati con piccoli errori.
- Due numeri con la virgola si considerano uguali quando la loro distanza è minore di una soglia.

| Python | C++ |
|---|---|
| `abs(a - b) < 0.000001` | `fabs(a - b) < 0.000001`, con `#include <cmath>` |

## Testi

- `==` è vero solo con gli stessi caratteri nello stesso ordine: `"Anna" == "anna"` è falsa.
- `<` e `>` seguono l'ordine del dizionario, un carattere alla volta, secondo i codici dei caratteri: `"cane" < "casa"` è vera.
- Tutte le maiuscole vengono prima di tutte le minuscole: `"Zebra" < "ape"` è vera.
- Tra testi `"10" < "9"` è vera; tra numeri `10 < 9` è falsa.
- In C++ almeno uno dei due testi deve essere una variabile `string`.

```ad-warning
Un solo = non confronta
Il confronto è `==`. `print(a = b)` in Python è un errore; `cout << (a = b)` in C++ copia `b` in `a` senza confrontare.
```

```ad-warning
L'uguale va per secondo
Si scrive `<=`, `>=`, `!=`. Le scritture `=<`, `=>` e `<>` sono errori.
```

```ad-warning
Un numero e un testo non sono mai uguali
In Python, con `eta = input()` la condizione `eta == 18` è sempre falsa: serve `int(input())`.
```
