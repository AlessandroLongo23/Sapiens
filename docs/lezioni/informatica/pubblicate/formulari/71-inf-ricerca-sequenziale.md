# Formulario: La ricerca sequenziale

## L'idea

La ricerca sequenziale (o lineare) confronta gli elementi del vettore con il valore cercato, uno dopo l'altro a partire dal primo, finché lo trova o finché il vettore finisce. Non chiede che gli elementi siano in ordine.

## Dire se c'è

`trovato` parte da falso e diventa vero quando un elemento è uguale al valore; non torna mai a falso.

```python
trovato = False
for i in range(len(arrivi)):
    if arrivi[i] == x:
        trovato = True
```

```cpp
bool trovato = false;
for (int i = 0; i < N; i++) {
    if (arrivi[i] == x) {
        trovato = true;
    }
}
```

## Dire dove, fermandosi al primo

`posizione` parte da $-1$, che non è un indice e vuol dire "non trovato". Il ciclo va avanti finché ci sono elementi e il valore non è stato trovato.

```python
posizione = -1
i = 0
while i < len(arrivi) and posizione == -1:
    if arrivi[i] == x:
        posizione = i
    i = i + 1
```

```cpp
int posizione = -1;
int i = 0;
while (i < N && posizione == -1) {
    if (arrivi[i] == x) {
        posizione = i;
    }
    i = i + 1;
}
```

## Come funzione

```python
def cerca(v, x):
    for i in range(len(v)):
        if v[i] == x:
            return i
    return -1
```

```cpp
int cerca(int v[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (v[i] == x) {
            return i;
        }
    }
    return -1;
}
```

| Domanda | Variabile | Ci si ferma al primo? |
|---|---|---|
| C'è? | `trovato`, da falso | si può |
| Dove? | `posizione`, da $-1$ | sì, per avere il primo |
| Quante volte? | un contatore, da $0$ | no: si guardano tutti gli elementi |

## Quanti confronti

Il valore all'indice $k$ si trova con $k + 1$ confronti. Con $n$ elementi:

| Caso | Quando | Confronti |
|---|---|---|
| Migliore | il valore è il primo elemento | $1$ |
| Medio | il valore c'è, in un posto qualunque | $\dfrac{n + 1}{2}$ |
| Peggiore | il valore è l'ultimo, o non c'è | $n$ |

```ad-warning
L'else dentro il ciclo
Un elemento diverso non dice niente: niente `else` che rimette `trovato` a falso, e niente `return -1` dentro il ciclo. "Non c'è" si dice dopo il ciclo.
```

```ad-warning
La fine del vettore
Il ciclo che si ferma controlla sempre anche `i < N`: senza, quando il valore non c'è l'indice esce dal vettore.
```
