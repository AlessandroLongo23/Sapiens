# Area e perimetro del rettangolo

## Che cos'è

Il rettangolo è il quadrilatero con i quattro angoli retti.

I lati opposti sono uguali: due si chiamano base $b$, gli altri due altezza $h$. Il perimetro $2p$ è la somma dei quattro lati; l'area $A$ è la superficie dentro il bordo, in unità quadrate come i cm².

## Un esempio svolto

```ad-example
Base e altezza
Un rettangolo ha la base di 8 cm e l'altezza di 6 cm. L'area è base per altezza:

$$A = 8 \cdot 6 = 48 \text{ cm}^2$$

Il perimetro è il doppio di base più altezza:

$$2p = 2(8 + 6) = 2 \cdot 14 = 28 \text{ cm}$$

La diagonale è l'ipotenusa del triangolo rettangolo che ha per cateti base e altezza:

$$\begin{aligned}
d &= \sqrt{8^2 + 6^2} \\[6pt]
&= \sqrt{64 + 36} \\[6pt]
&= \sqrt{100} = 10 \text{ cm}
\end{aligned}$$
```

## Le formule

$$A = b \cdot h$$

$$2p = 2(b + h)$$

$$d = \sqrt{b^2 + h^2}$$

La diagonale viene dal teorema di Pitagora. Dal rettangolo partono quasi tutte le altre aree: parallelogramma, triangolo e trapezio si riportano a un rettangolo tagliando e spostando dei pezzi.

## Tornare indietro all'altezza

Quando il problema dà l'area, dividi l'area per la base: $h = \dfrac{A}{b}$.

Quando dà il perimetro, prima dividilo per 2. Il risultato si chiama semiperimetro $p$ e contiene una base e un'altezza sola.

```ad-example
Dal perimetro e dalla base
Il perimetro è 30 cm e la base 10 cm. Il semiperimetro è:

$$p = \frac{30}{2} = 15 \text{ cm}$$

Togli la base e resta l'altezza:

$$h = 15 - 10 = 5 \text{ cm}$$
```

```ad-example
Dalla base e dalla diagonale
La base è 12 cm e la diagonale 13 cm. La diagonale è l'ipotenusa, quindi l'altezza è un cateto:

$$\begin{aligned}
h &= \sqrt{13^2 - 12^2} \\[6pt]
&= \sqrt{169 - 144} \\[6pt]
&= \sqrt{25} = 5 \text{ cm}
\end{aligned}$$
```

```ad-error
Errori frequenti
- Togliere la base dal perimetro intero invece che dal semiperimetro: nel perimetro la base compare due volte.
- Sommare base e altezza per la diagonale: la diagonale si trova con il teorema di Pitagora.
- Confondere area e perimetro nei problemi con la recinzione (perimetro) e con la piastrellatura (area).
```

## Domande frequenti

### Due rettangoli con lo stesso perimetro hanno la stessa area?

No. Con un perimetro di 20 cm un rettangolo di 9 cm per 1 cm ha area 9 cm², uno di 5 cm per 5 cm ne ha 25. A parità di perimetro l'area più grande è quella del quadrato.

### Il quadrato è un rettangolo?

Sì: ha quattro angoli retti. È il rettangolo con la base uguale all'altezza, e le sue formule sono quelle del rettangolo con $b = h$.
