# Formulario: L'ordinamento per inserimento

## L'idea

Gli elementi si prendono uno alla volta, dal secondo, e ciascuno si inserisce al posto giusto tra quelli alla sua sinistra, che sono già in ordine tra loro.

1. Copia l'elemento di indice `i` nella variabile `x`.
2. Confronta `x` con gli elementi alla sua sinistra, da destra verso sinistra.
3. Ogni elemento più grande di `x` si sposta di un posto a destra.
4. Al primo elemento che non è più grande, o all'inizio del vettore, fermati.
5. Metti `x` nel posto rimasto libero.

## La funzione

```python
def ordina(v):
    n = len(v)
    for i in range(1, n):
        x = v[i]
        j = i - 1
        while j >= 0 and v[j] > x:
            v[j + 1] = v[j]
            j = j - 1
        v[j + 1] = x
```

```cpp
void ordina(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int x = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > x) {
            v[j + 1] = v[j];
            j = j - 1;
        }
        v[j + 1] = x;
    }
}
```

| | Che cosa fa |
|---|---|
| `i` | l'indice dell'elemento da inserire, da $1$ a $n - 1$ |
| `x` | la copia dell'elemento da inserire |
| `j` | l'indice dell'elemento confrontato con `x`; torna indietro da `i - 1` |
| `j + 1` | l'indice del posto libero |
| `v[j] > x` | ordine crescente; con `<` l'ordine è decrescente |

## Confronti e spostamenti

Uno spostamento è un assegnamento solo, `v[j + 1] = v[j]`; uno scambio con `temp` ne chiede tre.

| Vettore di $6$ elementi | Confronti | Spostamenti |
|---|---|---|
| già in ordine | $5$, cioè $n - 1$ | $0$ |
| $8,\ 5,\ 9,\ 3,\ 7,\ 4$ | $13$ | $10$ |
| rovesciato | $15$, cioè $\frac{n(n - 1)}{2}$ | $15$ |

Per ogni elemento inserito i confronti sono quanti gli spostamenti, più uno se ci si ferma prima dell'inizio del vettore.

```ad-warning
L'elemento non copiato va perso
Senza `x = v[i]` il primo spostamento scrive sopra l'elemento da inserire, e nel vettore compaiono dei doppioni.
```

```ad-warning
Prima l'indice, poi l'elemento
Nel `while` la condizione `j >= 0` va scritta prima di `v[j] > x`, altrimenti il programma guarda `v[-1]`.
```
