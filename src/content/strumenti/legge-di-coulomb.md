# Legge di Coulomb

## Che cos'è

La legge di Coulomb dà la forza tra due cariche elettriche puntiformi: è proporzionale al prodotto delle cariche e inversamente proporzionale al quadrato della distanza.

$$F = k\, \frac{|q_1 q_2|}{r^2} \qquad k = 8{,}99 \cdot 10^9\ \frac{\text{N} \cdot \text{m}^2}{\text{C}^2}$$

La forza è attrattiva tra cariche di segno opposto e repulsiva tra cariche dello stesso segno. La costante $k$ vale nel vuoto, e quasi uguale nell'aria.

## Come si calcola a mano

Prima porta tutto nel Sistema Internazionale: le cariche in coulomb ($1\ \mu\text{C} = 10^{-6}\ \text{C}$, $1\ \text{nC} = 10^{-9}\ \text{C}$) e la distanza in metri.

```ad-example
2 μC e −3 μC a 10 cm
Le cariche diventano $2 \cdot 10^{-6}\ \text{C}$ e $-3 \cdot 10^{-6}\ \text{C}$, la distanza $0{,}1\ \text{m}$.

$$\begin{aligned}
F &= 8{,}99 \cdot 10^9 \cdot \frac{2 \cdot 10^{-6} \cdot 3 \cdot 10^{-6}}{(0{,}1)^2}\ \text{N} \\[6pt]
&= 8{,}99 \cdot 10^9 \cdot \frac{6 \cdot 10^{-12}}{10^{-2}}\ \text{N} \\[6pt]
&= 5{,}394\ \text{N}
\end{aligned}$$

I segni sono opposti: la forza è attrattiva.
```

Per trovare la distanza si ricava $r = \sqrt{k\, |q_1 q_2| / F}$; per trovare una carica, $|q_2| = F r^2 / (k\, |q_1|)$, e il segno si sceglie da come è la forza.

```ad-error
Errori frequenti
- Lasciare la distanza in centimetri: 10 cm al quadrato fa 100, 0,1 m al quadrato fa 0,01.
- Dimenticare di elevare al quadrato la distanza.
- Sbagliare gli esponenti: $10^{-6} \cdot 10^{-6} = 10^{-12}$, gli esponenti si sommano.
- Mettere il segno meno nella forza: il modulo è sempre positivo, il segno dice solo se attrae o respinge.
```

## Domande frequenti

### Se raddoppio la distanza, quanto diventa la forza?

Diventa un quarto, perché la distanza è al quadrato. Se la dimezzi, la forza quadruplica.

### E in un materiale diverso dal vuoto?

In un isolante come l'acqua o l'olio la forza è più debole: si divide per la costante dielettrica relativa $\varepsilon_r$ del materiale (circa 80 per l'acqua). Questo strumento calcola la forza nel vuoto.
