# Area e perimetro del trapezio

## Che cos'è

Il trapezio è un quadrilatero con due lati paralleli, le basi: la maggiore $B$ e la minore $b$. Gli altri due sono i lati obliqui, e l'altezza $h$ è la distanza tra le basi. Se i lati obliqui sono uguali il trapezio è isoscele; se uno dei due è perpendicolare alle basi è rettangolo, e quel lato è anche l'altezza.

## Le formule

$$A = \frac{(B + b) \cdot h}{2} \qquad 2p = B + b + l_1 + l_2$$

L'area si ricorda così: due trapezi uguali, uno capovolto accanto all'altro, formano un parallelogramma con base $B + b$ e altezza $h$. Il trapezio ne è la metà.

## Come si calcola a mano

Spesso il problema non dà i lati obliqui, e bisogna ricavarli con il teorema di Pitagora. Le altezze tracciate dagli estremi della base minore staccano sulla base maggiore dei segmenti, le proiezioni dei lati obliqui.

```ad-example
Trapezio isoscele
Basi di 12 e 6 cm, altezza di 4 cm. Le due proiezioni sono uguali: $\dfrac{12 - 6}{2} = 3$ cm. Ogni lato obliquo è l'ipotenusa di un triangolo rettangolo con cateti 4 e 3 cm, quindi misura 5 cm. Il perimetro è $12 + 6 + 2 \cdot 5 = 28$ cm e l'area $\dfrac{(12 + 6) \cdot 4}{2} = 36$ cm².
```

```ad-example
Trapezio rettangolo
Basi di 15 e 9 cm, altezza di 8 cm. C'è una proiezione sola, $15 - 9 = 6$ cm, e il lato obliquo è $\sqrt{8^2 + 6^2} = 10$ cm. Il perimetro somma le basi, l'altezza e il lato obliquo: $15 + 9 + 8 + 10 = 42$ cm.
```

```ad-error
Errori frequenti
- Moltiplicare le basi invece di sommarle.
- Nel trapezio isoscele usare come proiezione tutta la differenza $B - b$: va divisa tra i due lati.
- Scambiare l'altezza con un lato obliquo: il lato obliquo è sempre più lungo, e con l'altezza coincide solo il lato perpendicolare del trapezio rettangolo.
```

## Domande frequenti

### Come trovo l'altezza se conosco l'area?

Rigira la formula: $h = \dfrac{2A}{B + b}$. Con area 36 cm² e basi di 12 e 6 cm l'altezza è $\dfrac{72}{18} = 4$ cm.

### Si può calcolare il perimetro con basi e altezza soltanto?

Solo nel trapezio isoscele o rettangolo. In un trapezio qualsiasi le stesse basi e la stessa altezza vanno bene per lati obliqui diversi.
