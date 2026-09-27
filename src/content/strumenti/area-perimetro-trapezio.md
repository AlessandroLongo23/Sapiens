# Area e perimetro del trapezio

## Che cos'è

Il trapezio è il quadrilatero con due lati paralleli, le basi.

La base maggiore si chiama $B$, la minore $b$. Gli altri due lati sono i lati obliqui, e l'altezza $h$ è la distanza tra le basi. Se i lati obliqui sono uguali il trapezio è isoscele; se uno è perpendicolare alle basi è rettangolo, e quel lato è anche l'altezza.

## Un esempio svolto

```ad-example
Basi, altezza e lati obliqui
Un trapezio ha le basi di 24 e 10 cm e l'altezza di 12 cm. Somma le basi, moltiplica per l'altezza e dividi per 2:

$$\begin{aligned}
A &= \frac{(24 + 10) \cdot 12}{2} \\[6pt]
&= \frac{34 \cdot 12}{2} \\[6pt]
&= \frac{408}{2} = 204 \text{ cm}^2
\end{aligned}$$

I lati obliqui misurano 13 e 15 cm. Il perimetro è la somma dei quattro lati:

$$2p = 24 + 10 + 13 + 15 = 62 \text{ cm}$$
```

## Le formule

$$A = \frac{(B + b) \cdot h}{2}$$

$$2p = B + b + l_1 + l_2$$

Due trapezi uguali, uno capovolto accanto all'altro, formano un parallelogramma con base $B + b$ e altezza $h$. Il trapezio ne è la metà.

## Quando mancano i lati obliqui

Spesso il problema non dà i lati obliqui, e bisogna ricavarli con il teorema di Pitagora. L'altezza tracciata da un estremo della base minore stacca sulla base maggiore un segmento, la proiezione del lato obliquo: qui la chiamiamo $x$.

```ad-example
Trapezio isoscele
Basi di 12 e 6 cm, altezza di 4 cm. Le due proiezioni sono uguali, quindi ognuna è metà della differenza delle basi:

$$x = \frac{12 - 6}{2} = 3 \text{ cm}$$

Il lato obliquo è l'ipotenusa di un triangolo rettangolo con cateti 4 e 3 cm:

$$l = \sqrt{4^2 + 3^2} = \sqrt{25} = 5 \text{ cm}$$

Il perimetro ha due lati obliqui:

$$2p = 12 + 6 + 2 \cdot 5 = 28 \text{ cm}$$
```

```ad-example
Trapezio rettangolo
Basi di 15 e 9 cm, altezza di 8 cm. C'è una proiezione sola:

$$x = 15 - 9 = 6 \text{ cm}$$

$$l = \sqrt{8^2 + 6^2} = \sqrt{100} = 10 \text{ cm}$$

Il perimetro somma le basi, l'altezza e il lato obliquo:

$$2p = 15 + 9 + 8 + 10 = 42 \text{ cm}$$
```

```ad-error
Errori frequenti
- Moltiplicare le basi invece di sommarle.
- Nel trapezio isoscele usare come proiezione tutta la differenza $B - b$: va divisa tra i due lati.
- Scambiare l'altezza con un lato obliquo: il lato obliquo è sempre più lungo, e con l'altezza coincide solo il lato perpendicolare del trapezio rettangolo.
```

## Domande frequenti

### Come trovo l'altezza se conosco l'area?

Moltiplica l'area per 2 e dividi per la somma delle basi. Con area 36 cm² e basi di 12 e 6 cm:

$$h = \frac{2 \cdot 36}{12 + 6} = \frac{72}{18} = 4 \text{ cm}$$

### Si può calcolare il perimetro con basi e altezza soltanto?

Solo nel trapezio isoscele o rettangolo. In un trapezio qualsiasi le stesse basi e la stessa altezza vanno bene per lati obliqui diversi.
