# Retta di regressione e correlazione

## Che cos'è

La retta di regressione è la retta $y = mx + q$ che passa più vicina ai punti $(x, y)$ di una serie di dati: rende minima la somma dei quadrati delle distanze verticali tra i punti e la retta (metodo dei minimi quadrati).

Il coefficiente di correlazione di Pearson, $r$, dice quanto i punti stanno vicini a quella retta. È un numero tra $-1$ e $1$: vicino a $1$ i punti salgono quasi allineati, vicino a $-1$ scendono quasi allineati, vicino a $0$ non c'è un legame lineare.

## Come si calcola a mano

```ad-example
Ore di studio e voti
Cinque verifiche: $1$, $2$, $3$, $4$, $5$ ore di studio e i voti $5$; $5{,}5$; $6{,}5$; $7$; $8{,}5$. Dalla tabella dei prodotti: $\Sigma x = 15$, $\Sigma y = 32{,}5$, $\Sigma x^2 = 55$, $\Sigma xy = 106$.

$$\begin{aligned}
m &= \frac{n\,\Sigma xy - \Sigma x\,\Sigma y}{n\,\Sigma x^2 - (\Sigma x)^2} \\[6pt]
&= \frac{5 \cdot 106 - 15 \cdot 32{,}5}{5 \cdot 55 - 15^2} \\[6pt]
&= \frac{42{,}5}{50} = 0{,}85 \\[6pt]
q &= \bar{y} - m\,\bar{x} \\[6pt]
&= 6{,}5 - 0{,}85 \cdot 3 = 3{,}95
\end{aligned}$$

La retta è $y = 0{,}85x + 3{,}95$: ogni ora in più vale in media $0{,}85$ punti.
```

Per $r$ serve anche $\Sigma y^2$. Il numeratore è lo stesso di $m$:

$$r = \frac{n\,\Sigma xy - \Sigma x\,\Sigma y}{\sqrt{\left(n\,\Sigma x^2 - (\Sigma x)^2\right)\left(n\,\Sigma y^2 - (\Sigma y)^2\right)}}$$

Nell'esempio $\Sigma y^2 = 218{,}75$ e $r \approx 0{,}98$.

```ad-error
Errori frequenti
- Confondere $\Sigma x^2$, la somma dei quadrati, con $(\Sigma x)^2$, il quadrato della somma.
- Scambiare $x$ e $y$: la retta di $y$ su $x$ è diversa da quella di $x$ su $y$.
- Leggere una correlazione forte come prova di causa ed effetto.
```

## Domande frequenti

### Quando la correlazione è forte?

Una regola diffusa nei libri: sotto $0{,}3$ in valore assoluto è debole, da $0{,}3$ a $0{,}7$ moderata, sopra $0{,}7$ forte. Il segno dice solo la direzione: positivo se i punti salgono, negativo se scendono.

### Posso usarla per prevedere un valore?

Sì, dentro l'intervallo dei dati: basta mettere il valore di $x$ nella retta. Con $6$ ore la retta prevede un voto di circa $9$. Lontano dai dati la previsione diventa poco affidabile.
