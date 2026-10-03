# Formulario: Il sistema esadecimale

## Le sedici cifre

| Esadecimale | Decimale | Binario | | Esadecimale | Decimale | Binario |
|---|---|---|---|---|---|---|
| $0$ | $0$ | $0000$ | | $8$ | $8$ | $1000$ |
| $1$ | $1$ | $0001$ | | $9$ | $9$ | $1001$ |
| $2$ | $2$ | $0010$ | | $\text{A}$ | $10$ | $1010$ |
| $3$ | $3$ | $0011$ | | $\text{B}$ | $11$ | $1011$ |
| $4$ | $4$ | $0100$ | | $\text{C}$ | $12$ | $1100$ |
| $5$ | $5$ | $0101$ | | $\text{D}$ | $13$ | $1101$ |
| $6$ | $6$ | $0110$ | | $\text{E}$ | $14$ | $1110$ |
| $7$ | $7$ | $0111$ | | $\text{F}$ | $15$ | $1111$ |

- Pesi delle posizioni, da destra: $1$, $16$, $256$, $4096$.

## Da esadecimale a decimale

1. Sostituisci le lettere con il loro valore, da $10$ a $15$.
2. Moltiplica ogni cifra per il suo peso.
3. Somma.

$$
\text{1C8}_{16} = 1 \cdot 256 + 12 \cdot 16 + 8 = 456
$$

- $\text{FF}_{16} = 255$: due cifre esadecimali sono un byte.

## Da decimale a esadecimale

1. Dividi per $16$ e scrivi quoziente e resto.
2. Ripeti sul quoziente finché diventa $0$.
3. I resti da $10$ a $15$ diventano le cifre da A a F.
4. Leggi i resti dal basso verso l'alto.

$456 : 16 = 28$ resto $8$; $28 : 16 = 1$ resto $12$, cioè C; $1 : 16 = 0$ resto $1$. Quindi $456 = \text{1C8}_{16}$.

## Binario ed esadecimale

Una cifra esadecimale corrisponde a quattro bit, perché $16 = 2^4$.

1. Da binario: gruppi di quattro bit da destra, con zeri a sinistra per completare l'ultimo.
2. Ogni gruppo diventa la sua cifra.
3. Da esadecimale: ogni cifra diventa il suo gruppo di quattro bit.

$$
10\,1101\,0110_2 = \text{2D6}_{16} \qquad \text{C05}_{16} = 1100\,0000\,0101_2
$$

## Ottale

- Base otto, cifre da $0$ a $7$, pesi $1$, $8$, $64$, $512$.
- Una cifra ottale corrisponde a tre bit, perché $8 = 2^3$: $11\,0101_2 = 65_8 = 53$.

## Colori e indirizzi

- Colore: `#` e sei cifre, due per il rosso, due per il verde, due per il blu, ognuna da $00$ a $\text{FF}$ (da $0$ a $255$).
- `#FF8000`: rosso $255$, verde $128$, blu $0$.
- Indirizzo fisico di una scheda di rete: sei byte, sei coppie di cifre esadecimali.

```ad-warning
Un resto è una cifra sola
Il resto $12$ si scrive C: $\text{1C8}_{16}$, non $1128_{16}$.
```

```ad-warning
Gruppi da destra
I gruppi di quattro bit si formano da destra, e gli zeri si aggiungono a sinistra.
```

```ad-warning
Quattro bit per ogni cifra
In mezzo a un numero $5$ è $0101$ e $0$ è $0000$, non $101$ e $0$.
```
