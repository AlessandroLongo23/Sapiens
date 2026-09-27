# Superficie e volume della piramide

## Che cos'è

La piramide retta a base quadrata ha per base un quadrato e quattro facce laterali triangolari uguali, che si incontrano in un punto, il vertice.

L'altezza $h$ va dal vertice al centro della base. L'apotema $a$ è l'altezza di una faccia laterale: va dal vertice al punto medio di un lato di base. Lo spigolo laterale $s$ va dal vertice a un angolo della base.

## Un esempio svolto

```ad-example
Lato di base di 12 cm, altezza di 8 cm
Dentro la piramide c'è un triangolo rettangolo: i cateti sono l'altezza e metà lato (6 cm), l'ipotenusa è l'apotema. Con il teorema di Pitagora:

$$\begin{aligned}
a &= \sqrt{8^2 + 6^2} \\[6pt]
&= \sqrt{64 + 36} = \sqrt{100} = 10 \text{ cm}
\end{aligned}$$

Le quattro facce sono triangoli con altezza 10 cm, e il perimetro di base è 48 cm:

$$\begin{aligned}
A_l &= \frac{48 \cdot 10}{2} = 240 \text{ cm}^2 \\[6pt]
A_t &= 240 + 144 = 384 \text{ cm}^2
\end{aligned}$$

Il volume è un terzo di quello del prisma con la stessa base e la stessa altezza:

$$V = \frac{144 \cdot 8}{3} = 384 \text{ cm}^3$$
```

## Le formule

$$A_l = \frac{2p \cdot a}{2} \qquad A_t = A_l + A_b \qquad V = \frac{A_b \cdot h}{3}$$

I tre triangoli rettangoli da riconoscere sono questi:

$$a^2 = h^2 + \left(\frac{l}{2}\right)^2 \qquad s^2 = a^2 + \left(\frac{l}{2}\right)^2$$

Da due misure qualsiasi tra lato, altezza, apotema e spigolo si trovano tutte le altre.

## Partire dallo spigolo laterale

```ad-example
Lato di base di 6 cm, spigolo laterale di 5 cm
Lo spigolo è l'ipotenusa di una faccia tagliata a metà:

$$\begin{aligned}
a &= \sqrt{5^2 - 3^2} = \sqrt{16} = 4 \text{ cm} \\[6pt]
h &= \sqrt{4^2 - 3^2} = \sqrt{7} \approx 2{,}65 \text{ cm}
\end{aligned}$$
```

```ad-error
Errori frequenti
- Confondere l'altezza con l'apotema: l'altezza cade al centro della base, l'apotema sta su una faccia.
- Dimenticare il 3 al denominatore del volume.
- Usare il lato intero come cateto: nel triangolo rettangolo c'è metà lato.
```

## Domande frequenti

### Perché il volume si divide per 3?

Un prisma si può dividere in tre piramidi con lo stesso volume, e quella con la base e l'altezza del prisma è una delle tre. Lo si vede bene con un cubo, che si taglia in tre piramidi uguali a base quadrata con il vertice in comune.

### L'apotema può essere più corto dell'altezza?

No: l'apotema è l'ipotenusa del triangolo che forma con l'altezza, quindi è sempre più lungo.
