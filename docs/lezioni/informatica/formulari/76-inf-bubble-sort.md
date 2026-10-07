# Formulario: L'ordinamento a bolle

## L'idea

Un giro confronta gli elementi vicini a due a due, da sinistra, e scambia quelli nell'ordine sbagliato. Alla fine di ogni giro il più grande degli elementi rimasti è al suo posto, in fondo.

1. Confronta `v[j]` con `v[j + 1]`, per `j` da $0$ in avanti.
2. Se `v[j]` è più grande, scambiali con `temp`.
3. Finito il giro, il prossimo si ferma un posto prima.
4. Dopo $n - 1$ giri il vettore è in ordine crescente.

## La funzione

```python
def ordina(v):
    n = len(v)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if v[j] > v[j + 1]:
                temp = v[j]
                v[j] = v[j + 1]
                v[j + 1] = temp
```

```cpp
void ordina(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (v[j] > v[j + 1]) {
                int temp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = temp;
            }
        }
    }
}
```

| | Che cosa fa | Valori |
|---|---|---|
| `i` | conta i giri | da $0$ a $n - 2$ |
| `j` | scorre le coppie del giro | da $0$ a $n - 2 - i$ |
| `v[j] > v[j + 1]` | ordine crescente | con `<` l'ordine è decrescente |

## Con la bandierina

`scambiato` ricorda se nel giro c'è stato almeno uno scambio: un giro senza scambi vuol dire che il vettore è in ordine.

```python
i = 0
scambiato = True
while i < n - 1 and scambiato:
    scambiato = False
    for j in range(n - 1 - i):
        if v[j] > v[j + 1]:
            # scambio con temp
            scambiato = True
    i = i + 1
```

In C++ cambia la riga del ciclo: `while (i < n - 1 && scambiato)`, con `bool scambiato = true;`.

## Confronti e scambi

Confronti senza la bandierina, qualunque sia l'ordine di partenza:

$$(n - 1) + \dots + 1 = \frac{n(n - 1)}{2}$$

| Vettore di $6$ elementi | Confronti | Confronti con la bandierina | Scambi |
|---|---|---|---|
| già in ordine | $15$ | $5$ | $0$ |
| $15,\ 12,\ 19,\ 13,\ 17,\ 14$ | $15$ | $14$ | $7$ |
| rovesciato | $15$ | $15$ | $15$ |

```ad-warning
L'ultimo confronto esce dal vettore
Il ciclo interno guarda `v[j + 1]`: `j` si ferma a $n - 2 - i$, mai a $n - 1$.
```

```ad-warning
La bandierina che non torna giù
`scambiato = False` è la prima istruzione di ogni giro, altrimenti il programma fa sempre tutti i giri.
```
