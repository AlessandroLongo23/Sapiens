# Superficie e volume del cono

## Che cos'è

Il cono è il solido che si ottiene facendo ruotare un triangolo rettangolo attorno a un cateto: ha una base circolare e una superficie laterale curva che finisce in un punto, il vertice.

Il raggio $r$ è quello della base, l'altezza $h$ va dal vertice al centro della base. L'apotema $a$ va dal vertice al bordo della base: è l'ipotenusa del triangolo che ha per cateti il raggio e l'altezza.

## Un esempio svolto

```ad-example
Raggio di 6 cm, altezza di 8 cm
Trova l'apotema con il teorema di Pitagora:

$$\begin{aligned}
a &= \sqrt{8^2 + 6^2} \\[6pt]
&= \sqrt{64 + 36} = \sqrt{100} = 10 \text{ cm}
\end{aligned}$$

L'area di base è $\pi \cdot 6^2 = 36\pi$ cm². L'area laterale è $\pi$ per il raggio per l'apotema:

$$\begin{aligned}
A_l &= \pi \cdot 6 \cdot 10 = 60\pi \text{ cm}^2 \\[6pt]
A_t &= 60\pi + 36\pi = 96\pi \text{ cm}^2
\end{aligned}$$

Il volume è un terzo di quello del cilindro con la stessa base e la stessa altezza:

$$V = \frac{36\pi \cdot 8}{3} = 96\pi \approx 301{,}59 \text{ cm}^3$$
```

## Le formule

$$a = \sqrt{h^2 + r^2} \qquad A_l = \pi r a \qquad A_t = \pi r (a + r) \qquad V = \frac{\pi r^2 h}{3}$$

Se l'apotema non è un numero intero, il risultato esatto contiene una radice: con raggio 5 e altezza 10 viene $a = 5\sqrt{5}$ e $A_l = 25\sqrt{5}\pi$ cm².

## Altri dati di partenza

```ad-example
Raggio di 5 cm, apotema di 13 cm
L'apotema è l'ipotenusa, quindi per l'altezza si sottrae:

$$h = \sqrt{13^2 - 5^2} = \sqrt{144} = 12 \text{ cm}$$
```

```ad-example
Volume di 12π cm³, raggio di 3 cm
Moltiplica il volume per 3 e dividi per l'area di base, $9\pi$:

$$h = \frac{3 \cdot 12\pi}{9\pi} = 4 \text{ cm}$$
```

```ad-error
Errori frequenti
- Usare l'altezza al posto dell'apotema nell'area laterale.
- Dimenticare di dividere per 3 nel volume.
- Sommare raggio e altezza al posto dei loro quadrati sotto la radice.
```

## Domande frequenti

### Che forma ha la superficie laterale srotolata?

È un settore circolare, una fetta di cerchio che ha per raggio l'apotema. Da lì viene la formula $\pi r a$.

### L'apotema può essere più corto del raggio?

No: è l'ipotenusa, quindi è sempre più lungo sia del raggio sia dell'altezza.
