# Formulario: Conversioni tra binario e decimale

## Le potenze di due

| $2^{10}$ | $2^9$ | $2^8$ | $2^7$ | $2^6$ | $2^5$ | $2^4$ | $2^3$ | $2^2$ | $2^1$ | $2^0$ |
|---|---|---|---|---|---|---|---|---|---|---|
| $1024$ | $512$ | $256$ | $128$ | $64$ | $32$ | $16$ | $8$ | $4$ | $2$ | $1$ |

- MSB: il bit più a sinistra, di peso maggiore. LSB: il bit più a destra, di peso $1$.
- I bit si scrivono a gruppi di quattro da destra: $1100\,1010_2$.

## Da binario a decimale

1. Scrivi sopra ogni bit il suo peso, da destra: $1$, $2$, $4$, $8$ e così via.
2. Cancella i pesi sopra gli $0$.
3. Somma i pesi rimasti.

$$
1100\,1010_2 = 128 + 64 + 8 + 2 = 202
$$

- LSB $1$: numero dispari. LSB $0$: numero pari.
- $n$ bit tutti a $1$ valgono $2^n - 1$: $1111\,1111_2 = 255$.

## Da decimale a binario: divisioni successive

1. Dividi per $2$ e scrivi quoziente e resto.
2. Ripeti sul quoziente finché diventa $0$.
3. Leggi i resti dal basso verso l'alto.

| Divisione | Quoziente | Resto |
|---|---|---|
| $46 : 2$ | $23$ | $0$ |
| $23 : 2$ | $11$ | $1$ |
| $11 : 2$ | $5$ | $1$ |
| $5 : 2$ | $2$ | $1$ |
| $2 : 2$ | $1$ | $0$ |
| $1 : 2$ | $0$ | $1$ |

$$
46 = 10\,1110_2
$$

## Da decimale a binario: sottrarre le potenze di due

1. Cerca la più grande potenza di due che non supera il numero: è l'MSB.
2. Sottraila.
3. Scendi alle potenze più piccole: se ci sta scrivi $1$ e sottrai, altrimenti scrivi $0$.
4. Arriva fino a $2^0$: il resto finale è $0$.

$$
200 = 128 + 64 + 8 = 1100\,1000_2
$$

## Quanti bit servono

- Con $n$ bit: $2^n$ numeri, da $0$ a $2^n - 1$.

| Bit | $4$ | $8$ | $10$ |
|---|---|---|---|
| Numero più grande | $15$ | $255$ | $1023$ |

- Bit necessari per un numero: l'esponente della prima potenza di due che lo supera. $200 < 2^8$: servono $8$ bit.
- Gli zeri a sinistra non cambiano il valore: $13 = 0000\,1101_2$.

```ad-warning
Resti letti dall'alto
I resti si leggono dal basso: l'ultimo resto è l'MSB. E l'ultima divisione è $1 : 2$, con resto $1$.
```

```ad-warning
Zeri saltati
Ogni potenza che non ci sta è un bit $0$: $200$ è $1100\,1000_2$, non $111_2$.
```

```ad-warning
Potenze di due
$2^n$ ha bisogno di $n + 1$ bit: $255$ sta in $8$ bit, $256$ no.
```
