# Calcolo della radice quadrata

## Che cos'è la radice quadrata

La radice quadrata di un numero è il numero positivo che, elevato al quadrato, dà il numero di partenza: $\sqrt{144} = 12$ perché $12^2 = 144$. Allo stesso modo la radice cubica è il numero che elevato al cubo dà il numero di partenza: $\sqrt[3]{27} = 3$ perché $3^3 = 27$.

Solo i quadrati perfetti (1, 4, 9, 16, 25…) hanno una radice quadrata intera. Per gli altri numeri la radice è un numero irrazionale, con infinite cifre decimali non periodiche: si scrive in forma semplificata, come $6\sqrt{2}$, e se serve se ne dà un valore approssimato.

## Come si calcola a mano

Si parte dalla scomposizione in fattori primi:

1. scomponi il numero in fattori primi;
2. se tutti gli esponenti sono pari, dividili per 2: il risultato è la radice;
3. altrimenti separa ogni potenza in una parte con esponente pari e in quello che resta;
4. porta fuori dalla radice le parti con esponente pari, dimezzando l'esponente; il resto rimane sotto la radice.

Per la radice cubica il ragionamento è lo stesso, con esponenti multipli di 3 al posto degli esponenti pari.

```ad-example
Esempio: radice quadrata di 144
$144 = 2^4 \cdot 3^2$. Gli esponenti sono pari, quindi $\sqrt{144} = 2^2 \cdot 3 = 12$.
```

```ad-example
Esempio: radice quadrata di 72
$72 = 2^3 \cdot 3^2 = 2^2 \cdot 3^2 \cdot 2$.
Porta fuori $2^2$ e $3^2$: $\sqrt{72} = 2 \cdot 3 \sqrt{2} = 6\sqrt{2} \approx 8{,}4853$.
Controllo: $(6\sqrt{2})^2 = 36 \cdot 2 = 72$.
```

```ad-error
Errori frequenti
- Dimezzare il numero: $\sqrt{16}$ fa 4, non 8.
- Portare fuori un fattore con esponente 1: in $\sqrt{2 \cdot 3^2}$ esce solo il 3, e il 2 resta sotto la radice.
- Scrivere $\sqrt{a + b} = \sqrt{a} + \sqrt{b}$: $\sqrt{9 + 16} = 5$, mentre $\sqrt{9} + \sqrt{16} = 7$.
```

## Domande frequenti

### Esiste la radice quadrata di un numero negativo?

Non tra i numeri reali: ogni numero elevato al quadrato dà un risultato positivo o zero. La radice cubica invece esiste anche per i numeri negativi: $\sqrt[3]{-8} = -2$.

### Perché si scrive $6\sqrt{2}$ e non $8{,}4853$?

Perché $6\sqrt{2}$ è il valore esatto, mentre $8{,}4853$ è arrotondato. Nei calcoli successivi la forma esatta non accumula errori.
