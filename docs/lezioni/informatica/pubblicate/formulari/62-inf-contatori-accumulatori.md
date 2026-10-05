# Formulario: Contatori e accumulatori

## Il contatore

Una variabile che parte da $0$ e aumenta di $1$ ogni volta che succede una certa cosa. Per contare solo i dati che soddisfano una condizione, l'aumento sta dentro una selezione.

```python
sufficienti = 0
for i in range(1, n + 1):
    voto = int(input())
    if voto >= 6:
        sufficienti = sufficienti + 1
```

```cpp
int sufficienti = 0;
for (int i = 1; i <= n; i++) {
    int voto;
    cin >> voto;
    if (voto >= 6) {
        sufficienti = sufficienti + 1;
    }
}
```

Con i voti $7$, $5$, $8$, $4$: `sufficienti` vale $1$, $1$, $2$, $2$.

## L'accumulatore

Una variabile a cui ogni giro aggiunge un valore nuovo, e che alla fine contiene il totale. Il contatore aumenta sempre di $1$, l'accumulatore aumenta del dato di quel giro.

| | Python | C++ |
|---|---|---|
| Somma | `totale = totale + punti` | `totale = totale + punti;` |
| Somma, forma breve | `totale += punti` | `totale += punti;` |
| Prodotto | `fattoriale = fattoriale * i` | `fattoriale = fattoriale * i;` |

Fattoriale: $n! = 1 \cdot 2 \cdot \ldots \cdot n$, con $5! = 120$ e $0! = 1$.

## Il valore di partenza

Inizializzare una variabile vuol dire darle il primo valore. Il valore giusto è quello che non cambia il risultato.

| Variabile | Parte da | A ogni giro | Alla fine contiene |
|---|---|---|---|
| contatore | $0$ | aumenta di $1$, se la condizione è vera | quante volte è successa la cosa |
| accumulatore di una somma | $0$ | aumenta del dato | la somma dei dati |
| accumulatore di un prodotto | $1$ | viene moltiplicato per il dato | il prodotto dei dati |

Dove si scrive ogni cosa:

1. Il valore di partenza, prima del ciclo, una volta sola.
2. L'aggiornamento, dentro il corpo.
3. La stampa del risultato, dopo il ciclo.

## Numeri grandi

| | Python | C++ con `int` | C++ con `long long` |
|---|---|---|---|
| Spazio | quante cifre servono | $32$ bit | $64$ bit |
| Fattoriale giusto fino a | nessun limite | $12!$ | $20!$ |

In C++ un `int` non contiene numeri più grandi di $2\,147\,483\,647$: oltre, il programma scrive un numero sbagliato senza avvisare ($13!$ diventa $1932053504$).

```ad-warning
Il valore di partenza dentro il ciclo
`sufficienti = 0` nel corpo fa ricominciare il conto a ogni giro: alla fine vale $0$ oppure $1$.
```

```ad-warning
Nessun valore di partenza
Senza `sufficienti = 0` Python si ferma con un errore; in C++ il conto parte da un numero qualunque.
```

```ad-warning
Il prodotto che parte da 0
$0$ moltiplicato per qualunque numero fa $0$: il prodotto parte da $1$.
```
