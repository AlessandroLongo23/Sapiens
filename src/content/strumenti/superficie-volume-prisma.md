# Superficie e volume del prisma

## Che cos'è

Un prisma retto è un solido con due basi uguali e parallele, unite da facce laterali rettangolari perpendicolari alle basi.

Quando la base è un poligono regolare, cioè con tutti i lati e gli angoli uguali, il prisma si dice regolare. Lo strumento calcola i prismi regolari più comuni: a base triangolare (triangolo equilatero), quadrata ed esagonale.

## Un esempio svolto

```ad-example
Base triangolare con lato di 6 cm, altezza di 10 cm
L'area di un triangolo equilatero di lato $l$ è $\frac{l^2\sqrt{3}}{4}$:

$$\begin{aligned}
A_b &= \frac{6^2\sqrt{3}}{4} = \frac{36\sqrt{3}}{4} \\[6pt]
&= 9\sqrt{3} \approx 15{,}59 \text{ cm}^2
\end{aligned}$$

Il perimetro di base è $3 \cdot 6 = 18$ cm. Le facce laterali, messe una accanto all'altra, formano un rettangolo con base il perimetro e altezza quella del prisma:

$$\begin{aligned}
A_l &= 18 \cdot 10 = 180 \text{ cm}^2 \\[6pt]
A_t &= 180 + 2 \cdot 9\sqrt{3} = (180 + 18\sqrt{3}) \text{ cm}^2
\end{aligned}$$

L'area totale vale circa 211,18 cm². Il volume è l'area di base per l'altezza:

$$V = 9\sqrt{3} \cdot 10 = 90\sqrt{3} \approx 155{,}88 \text{ cm}^3$$
```

## Le formule

Per ogni prisma retto, con $2p$ il perimetro di base e $h$ l'altezza:

$$A_l = 2p \cdot h \qquad A_t = A_l + 2A_b \qquad V = A_b \cdot h$$

Cambia solo l'area di base: $l^2$ per il quadrato, $\frac{l^2\sqrt{3}}{4}$ per il triangolo equilatero, e per l'esagono sei volte il triangolo, $\frac{3l^2\sqrt{3}}{2}$.

## Trovare l'altezza

```ad-example
Base quadrata di lato 5 cm, volume di 200 cm³
L'area di base è 25 cm². Dividi il volume per l'area di base:

$$h = \frac{200}{25} = 8 \text{ cm}$$
```

```ad-error
Errori frequenti
- Usare l'altezza del triangolo di base al posto dell'altezza del prisma: sono due segmenti diversi.
- Sommare $180 + 18\sqrt{3}$ come se fosse $198\sqrt{3}$: un numero e una radice non si sommano, si lascia la somma o si passa al decimale.
- Contare una base sola nell'area totale.
```

## Domande frequenti

### Il cubo è un prisma?

Sì: è un prisma a base quadrata con l'altezza uguale al lato di base.

### Perché nel risultato resta $\sqrt{3}$?

L'area del triangolo equilatero contiene $\sqrt{3}$, che ha infinite cifre decimali. Il risultato esatto la tiene; accanto c'è il valore approssimato.
