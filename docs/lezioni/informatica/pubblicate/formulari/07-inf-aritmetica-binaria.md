# Formulario: Addizione e moltiplicazione in binario

## Somma di due bit

| $0 + 0$ | $0 + 1$ | $1 + 0$ | $1 + 1$ | $1 + 1 + 1$ |
|---|---|---|---|---|
| $0$ | $1$ | $1$ | $0$, riporto $1$ | $1$, riporto $1$ |

- Riporto: l'$1$ che passa alla colonna di sinistra quando la somma di una colonna è $2$ o $3$.

## Addizione in colonna

1. Allinea i numeri a destra.
2. Somma da destra i bit di ogni colonna, compreso il riporto arrivato.
3. Somma $0$ o $1$: scrivila. Somma $2$: scrivi $0$, riporta $1$. Somma $3$: scrivi $1$, riporta $1$.
4. Il riporto dell'ultima colonna va davanti al risultato.

$$
1011_2 + 110_2 = 1\,0001_2 \qquad (11 + 6 = 17)
$$

## Traboccamento

- Con $n$ bit senza segno il valore più grande è $2^n - 1$: $15$ con $4$ bit, $255$ con $8$ bit.
- Traboccamento (overflow): il risultato non sta nei bit disponibili; il riporto dell'ultima colonna si perde.
- Su $8$ bit: $200 + 100 = 300$, resta $300 - 256 = 44 = 0010\,1100_2$.
- Come riconoscerlo: esce un riporto dall'ultima colonna a sinistra.

## Moltiplicazione

- Per un bit: $1$ copia il numero, $0$ dà zero.
- Per $2^k$: scorrimento a sinistra di $k$ posti, cioè $k$ zeri a destra.

$$
1011_2 \cdot 100_2 = 10\,1100_2 \qquad (11 \cdot 4 = 44)
$$

1. Guarda i bit del moltiplicatore da destra.
2. Per ogni bit $1$ scrivi una copia del moltiplicando, spostata a sinistra di tanti posti quanto la posizione del bit.
3. Somma le copie in colonna.

$$
1011_2 \cdot 101_2 = 1011_2 + 10\,1100_2 = 11\,0111_2 \qquad (11 \cdot 5 = 55)
$$

- Un numero di $n$ bit per uno di $m$ bit dà un prodotto di al massimo $n + m$ bit.

## Sottrazione

- $0 - 0 = 0$, $1 - 0 = 1$, $1 - 1 = 0$; per $0 - 1$ si prende in prestito dalla colonna di sinistra e si calcola $10_2 - 1 = 1$.
- $1101_2 - 110_2 = 111_2$, cioè $13 - 6 = 7$.

```ad-warning
1 + 1 non fa 2
In base due la cifra $2$ non esiste: $1 + 1 = 10_2$, cioè $0$ con riporto di $1$.
```

```ad-warning
Riporto e traboccamento
Un riporto tra due colonne è normale; c'è traboccamento solo se il riporto esce dall'ultima colonna.
```

```ad-warning
Copie non spostate
Nella moltiplicazione ogni copia va spostata a sinistra quanto dice la posizione del suo bit.
```
