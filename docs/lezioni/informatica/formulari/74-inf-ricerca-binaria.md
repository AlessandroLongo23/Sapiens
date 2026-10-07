# Formulario: La ricerca binaria

## L'idea

La ricerca binaria cerca un valore in un vettore ordinato: confronta il valore con l'elemento centrale della parte ancora da esaminare e, se non è lui, continua solo nella metà in cui può trovarsi.

| Nome | Che cos'è |
|---|---|
| `sinistra` | l'indice del primo elemento ancora da esaminare |
| `destra` | l'indice dell'ultimo elemento ancora da esaminare |
| `centro` | l'indice dell'elemento che si confronta: la media di `sinistra` e `destra`, senza la parte dopo la virgola |

1. `sinistra` parte da $0$, `destra` dall'ultimo indice.
2. Finché `sinistra <= destra`, calcola `centro`.
3. Se `v[centro]` è il valore cercato, la ricerca è finita: restituisci `centro`.
4. Se `v[centro]` è più piccolo, `sinistra` diventa `centro + 1`.
5. Altrimenti `destra` diventa `centro - 1`.
6. Se il ciclo finisce, il valore non c'è: restituisci $-1$.

## La funzione

```python
def cerca(v, x):
    sinistra = 0
    destra = len(v) - 1
    while sinistra <= destra:
        centro = (sinistra + destra) // 2
        if v[centro] == x:
            return centro
        elif v[centro] < x:
            sinistra = centro + 1
        else:
            destra = centro - 1
    return -1
```

```cpp
int cerca(int v[], int n, int x) {
    int sinistra = 0;
    int destra = n - 1;
    int centro;
    while (sinistra <= destra) {
        centro = (sinistra + destra) / 2;
        if (v[centro] == x) {
            return centro;
        } else if (v[centro] < x) {
            sinistra = centro + 1;
        } else {
            destra = centro - 1;
        }
    }
    return -1;
}
```

| | Python | C++ |
|---|---|---|
| Divisione intera | `//` | `/` tra due `int` |
| Dimensione del vettore | `len(v)` | il parametro `n` |
| Chiamata | `cerca(armadietti, 21)` | `cerca(armadietti, N, 21)` |

In un vettore in ordine decrescente il secondo confronto diventa `v[centro] > x`.

## Un esempio: cercare 21

Il vettore è $3$, $8$, $12$, $17$, $21$, $26$, $34$, $40$.

| Giro | `sinistra` | `destra` | `centro` | `v[centro]` | Che cosa succede |
|---|---|---|---|---|---|
| 1 | $0$ | $7$ | $3$ | $17$ | `sinistra` diventa $4$ |
| 2 | $4$ | $7$ | $5$ | $26$ | `destra` diventa $4$ |
| 3 | $4$ | $4$ | $4$ | $21$ | trovato all'indice $4$ |

## Quanti confronti

Ogni confronto che non trova il valore lascia al massimo la metà degli elementi. Se il vettore raddoppia, serve un solo confronto in più.

| Elementi | Ricerca sequenziale, al massimo | Ricerca binaria, al massimo |
|---|---|---|
| $8$ | $8$ | $4$ |
| $100$ | $100$ | $7$ |
| $1000$ | $1000$ | $10$ |
| $1\,000\,000$ | $1\,000\,000$ | $20$ |

I confronti della ricerca binaria crescono come il logaritmo in base $2$ del numero degli elementi; quelli della ricerca sequenziale come il numero degli elementi.

```ad-warning
Il vettore deve essere ordinato
Su un vettore in disordine la funzione non dà errori: restituisce una risposta sbagliata.
```

```ad-warning
Il centro non si riguarda
`sinistra = centro + 1` e `destra = centro - 1`: senza il `+ 1` il ciclo può non finire.
```

```ad-warning
La condizione del ciclo ha l'uguale
Con `sinistra < destra` l'ultimo elemento rimasto non viene guardato.
```
