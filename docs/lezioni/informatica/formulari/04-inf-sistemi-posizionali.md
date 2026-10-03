# Formulario: I sistemi di numerazione posizionali

## Sistemi additivi e posizionali

- Sistema additivo: ogni simbolo ha un valore fisso e i valori si sommano (numeri romani).
- Sistema posizionale: il valore di una cifra dipende dal posto che occupa.

| Simbolo | I | V | X | L | C | D | M |
|---|---|---|---|---|---|---|---|
| Valore | $1$ | $5$ | $10$ | $50$ | $100$ | $500$ | $1000$ |

- Un simbolo prima di uno più grande si sottrae: $\text{IV} = 4$, $\text{XC} = 90$, $\text{CM} = 900$.

## Base, cifre, peso

- Base $b$: il numero delle cifre. Le cifre vanno da $0$ a $b - 1$.
- Le posizioni si contano da destra, partendo da $0$.
- Peso della posizione $k$:

$$
b^k
$$

- Valore di una cifra: la cifra per il peso della sua posizione. In $4728$ il $7$ vale $7 \cdot 10^2 = 700$.
- La base si scrive a pedice: $1101_2$, $324_5$, $207_8$; senza pedice il numero è in base dieci.

| Base | Cifre | Pesi, da destra |
|---|---|---|
| $2$ | $0, 1$ | $1, 2, 4, 8, 16$ |
| $5$ | da $0$ a $4$ | $1, 5, 25, 125$ |
| $8$ | da $0$ a $7$ | $1, 8, 64, 512$ |
| $10$ | da $0$ a $9$ | $1, 10, 100, 1000$ |

## Forma polinomiale

$$
4728 = 4 \cdot 10^3 + 7 \cdot 10^2 + 2 \cdot 10^1 + 8 \cdot 10^0
$$

Un numero di $n$ cifre ha gli esponenti da $n - 1$ a $0$.

## Da una base alla base dieci

1. Numera le posizioni da destra, partendo da $0$.
2. Scrivi sopra ogni cifra il peso $b^k$ della sua posizione.
3. Moltiplica ogni cifra per il suo peso.
4. Somma i prodotti.

- $1101_2 = 8 + 4 + 0 + 1 = 13$
- $324_5 = 3 \cdot 25 + 2 \cdot 5 + 4 = 89$
- $207_8 = 2 \cdot 64 + 0 \cdot 8 + 7 = 135$

## Contare e quanti numeri

- In ogni base $10$ è la base stessa: $10_2 = 2$, $10_5 = 5$, $10_8 = 8$.
- Con $n$ cifre in base $b$ si scrivono $b^n$ numeri, da $0$ a $b^n - 1$.

```ad-warning
Cifra uguale alla base
In base $b$ la cifra più grande è $b - 1$: $128_8$ non è un numero in base otto.
```

```ad-warning
Posizioni da 1
Le posizioni partono da $0$: l'ultima cifra a destra ha peso $b^0 = 1$.
```

```ad-warning
Leggere in base dieci
$101_2$ vale $5$, non centouno: senza la base una scrittura non dice quale numero è.
```
