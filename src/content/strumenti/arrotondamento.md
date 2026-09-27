# Arrotondamento di un numero

## Che cos'è l'arrotondamento

Arrotondare un numero vuol dire sostituirlo con un numero vicino, più semplice, che ha meno cifre.

Per esempio 12,3456 arrotondato ai centesimi diventa 12,35: ha solo due cifre dopo la virgola ed è il numero con due decimali più vicino a 12,3456. Si arrotonda per scrivere un risultato con i decimali che servono, per fare una stima o per dare una misura con le cifre giuste.

## Come si calcola a mano

Si cerca l'ultima cifra da tenere e si guarda la cifra subito dopo, quella che decide:

1. se è 0, 1, 2, 3 o 4, l'ultima cifra resta com'è: si arrotonda per difetto;
2. se è 5, 6, 7, 8 o 9, l'ultima cifra aumenta di 1: si arrotonda per eccesso;
3. le cifre dopo si tolgono, oppure, prima della virgola, diventano zeri.

```ad-example
Esempio: 12,3456 ai centesimi
La cifra dei centesimi è il 4. Quella dopo è il 5, quindi il 4 diventa 5:

$$12{,}3456 \approx 12{,}35$$
```

```ad-example
Esempio: 1876 alle centinaia
La cifra delle centinaia è l'8. Quella dopo è il 7, quindi l'8 diventa 9 e le cifre dopo diventano zeri:

$$1876 \approx 1900$$
```

Quando la cifra da aumentare è un 9 c'è il riporto, come nell'addizione: 2,997 ai centesimi diventa 3,00.

## Le cifre significative

In fisica e in chimica si arrotonda a un numero di cifre significative. Le cifre significative si contano dalla prima cifra diversa da zero: gli zeri all'inizio non contano, perché servono solo a mettere la virgola.

```ad-example
Esempio: 0,004567 con 2 cifre significative
La prima cifra significativa è il 4, la seconda il 5. Quella dopo è il 6, quindi il 5 diventa 6:

$$\begin{aligned} 0{,}004567 &\approx 0{,}0046 \\ &= 4{,}6 \cdot 10^{-3} \end{aligned}$$
```

```ad-error
Errori frequenti
- Guardare tutte le cifre dopo invece della prima: 2,346 ai decimi è 2,3, perché conta solo il 4.
- Arrotondare a catena: 2,346 → 2,35 → 2,4 è sbagliato. Si arrotonda una volta sola, dal numero di partenza.
- Contare gli zeri iniziali come cifre significative: 0,0046 ha due cifre significative, non cinque.
```

## Domande frequenti

### Come si arrotonda un numero negativo?

Come il suo valore assoluto, poi si rimette il segno: −2,35 ai decimi diventa −2,4.

### Perché 3,00 e non 3?

Perché arrotondare ai centesimi vuol dire scrivere due decimali. Gli zeri dicono che il numero è preciso fino ai centesimi.
