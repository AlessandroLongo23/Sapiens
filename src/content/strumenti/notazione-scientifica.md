# Notazione scientifica

## Che cos'è la notazione scientifica

La notazione scientifica scrive un numero come prodotto di un numero tra 1 e 10 per una potenza di 10.

Per esempio la distanza media tra la Terra e la Luna è circa 384 400 km, e si scrive $3{,}844 \cdot 10^5$ km. La carica di un elettrone, circa 0,00000000000000000016 coulomb, diventa $1{,}6 \cdot 10^{-19}$ C.

Il primo fattore deve essere almeno 1 e minore di 10: $38{,}44 \cdot 10^4$ vale lo stesso numero, ma non è in notazione scientifica.

## Come si calcola a mano

Si cerca la prima cifra diversa da zero, si sposta la virgola subito dopo di lei e si compensa lo spostamento con una potenza di 10.

```ad-example
Esempio: 0,000345 in notazione scientifica
La prima cifra diversa da zero è il 3. Per mettere la virgola dopo il 3 la si sposta di 4 posti verso destra, cioè si moltiplica per $10^4$. Per non cambiare il numero si moltiplica per $10^{-4}$:

$$0{,}000345 = 3{,}45 \cdot 10^{-4}$$
```

La regola in breve: se sposti la virgola verso sinistra l'esponente è positivo, se la sposti verso destra è negativo. Il numero di posti è l'esponente.

Per tornare al numero decimale si fa il contrario, aggiungendo zeri dove mancano cifre.

```ad-example
Esempio: 4,56 · 10^4 in numero decimale
L'esponente è 4: la virgola si sposta di 4 posti verso destra.

$$\begin{aligned} 4{,}56 \cdot 10^4 &= 4{,}56 \cdot 10\,000 \\ &= 45\,600 \end{aligned}$$
```

## L'ordine di grandezza

L'ordine di grandezza è la potenza di 10 più vicina al numero. Si guarda il primo fattore: se è minore di 5 l'ordine di grandezza è la potenza che c'è già, se è 5 o più si passa alla potenza successiva. Così $3{,}45 \cdot 10^{-4}$ ha ordine di grandezza $10^{-4}$, mentre $6{,}02 \cdot 10^{23}$ ha ordine di grandezza $10^{24}$. Alcuni libri usano come soglia 3,16, cioè $\sqrt{10}$, invece di 5: controlla quella del tuo.

```ad-error
Errori frequenti
- Sbagliare il segno dell'esponente: un numero minore di 1 ha sempre esponente negativo.
- Lasciare davanti un numero maggiore di 10, come $45{,}6 \cdot 10^3$.
- Contare gli zeri invece dei posti: in 0,000345 la virgola si sposta di 4 posti, non di 3.
```

## Domande frequenti

### Gli zeri alla fine si scrivono?

In 45 600 gli zeri finali servono solo a indicare le centinaia, quindi si scrive $4{,}56 \cdot 10^4$. In fisica, però, gli zeri dopo la virgola di una misura sono cifre significative: 0,0020 m diventa $2{,}0 \cdot 10^{-3}$ m, con lo zero.

### Quanto vale 10 alla zero?

Vale 1: per questo 7 in notazione scientifica è $7 \cdot 10^0$.
