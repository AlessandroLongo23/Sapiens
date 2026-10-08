# Formulario: L'ordinamento per selezione

## L'idea

Ordinare un vettore vuol dire spostare i suoi elementi finché sono in ordine crescente. L'ordinamento per selezione, a ogni giro, sceglie il più piccolo tra gli elementi non ancora sistemati e lo scambia con il primo di loro.

| Nome | Che cos'è |
|---|---|
| `i` | il posto da riempire in questo giro: a sinistra di `i` è tutto sistemato |
| `j` | l'indice che scorre gli elementi a destra di `i` |
| `imin` | l'indice del più piccolo trovato finora: una posizione, non un valore |

1. Per ogni `i` da $0$ a $n - 2$: `imin` parte da `i`.
2. Per ogni `j` da `i + 1` a $n - 1$: se `v[j] < v[imin]`, `imin` diventa `j`.
3. Finito il giro, se `imin` è diverso da `i`, scambia `v[i]` e `v[imin]`.

## Lo scambio

Serve una terza variabile, che tiene da parte il primo valore.

| | Python | C++ |
|---|---|---|
| Scambio con `temp` | `temp = v[i]`, poi `v[i] = v[imin]`, poi `v[imin] = temp` | `int temp = v[i];` poi `v[i] = v[imin];` poi `v[imin] = temp;` |
| In una riga | `v[i], v[imin] = v[imin], v[i]` | non c'è |

## La funzione

```python
def ordina(v):
    n = len(v)
    for i in range(n - 1):
        imin = i
        for j in range(i + 1, n):
            if v[j] < v[imin]:
                imin = j
        if imin != i:
            temp = v[i]
            v[i] = v[imin]
            v[imin] = temp
```

```cpp
void ordina(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int imin = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[imin]) {
                imin = j;
            }
        }
        if (imin != i) {
            int temp = v[i];
            v[i] = v[imin];
            v[imin] = temp;
        }
    }
}
```

Per l'ordine decrescente il confronto diventa `v[j] > v[imin]`: l'indice è quello del più grande.

## Un esempio: sei tempi

| Giro | `i` | `imin` alla fine | Scambio | Vettore dopo il giro |
|---|---|---|---|---|
| | | | | $15,\ 12,\ 19,\ 13,\ 17,\ 14$ |
| 1 | $0$ | $1$ | $15$ e $12$ | $12,\ 15,\ 19,\ 13,\ 17,\ 14$ |
| 2 | $1$ | $3$ | $15$ e $13$ | $12,\ 13,\ 19,\ 15,\ 17,\ 14$ |
| 3 | $2$ | $5$ | $19$ e $14$ | $12,\ 13,\ 14,\ 15,\ 17,\ 19$ |
| 4 | $3$ | $3$ | nessuno | $12,\ 13,\ 14,\ 15,\ 17,\ 19$ |
| 5 | $4$ | $4$ | nessuno | $12,\ 13,\ 14,\ 15,\ 17,\ 19$ |

## Confronti e scambi

| | Quanti | Con $6$ elementi |
|---|---|---|
| Giri | $n - 1$ | $5$ |
| Confronti nel giro con indice `i` | $n - 1 - i$ | $5$, $4$, $3$, $2$, $1$ |
| Confronti in tutto, qualunque sia l'ordine | $\dfrac{n(n - 1)}{2}$ | $15$ |
| Scambi | al massimo $n - 1$ | al massimo $5$ |

Un vettore già in ordine chiede $0$ scambi, ma gli stessi confronti.

```ad-warning
Lo scambio senza temp
`v[i] = v[imin]` seguito da `v[imin] = v[i]` cancella un valore e ne scrive un altro due volte.
```

```ad-warning
Il confronto è con il minimo trovato finora
`v[j] < v[imin]`, non `v[j] < v[i]`: altrimenti `imin` indica l'ultimo elemento più piccolo di `v[i]`, non il più piccolo.
```
