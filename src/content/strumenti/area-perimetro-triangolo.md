# Area e perimetro del triangolo

## Che cos'è

Il triangolo è il poligono con tre lati.

Il perimetro $2p$ è la somma dei tre lati. Per l'area serve un'altezza $h$: il segmento che parte da un vertice e scende perpendicolare sul lato opposto, che allora si chiama base $b$.

## Un esempio svolto

```ad-example
Base e altezza
Un triangolo ha la base di 14 cm e l'altezza di 12 cm. Moltiplica la base per l'altezza e dividi per 2:

$$\begin{aligned}
A &= \frac{14 \cdot 12}{2} \\[6pt]
&= \frac{168}{2} = 84 \text{ cm}^2
\end{aligned}$$

Gli altri due lati misurano 13 e 15 cm. Il perimetro è la somma dei tre lati:

$$2p = 14 + 13 + 15 = 42 \text{ cm}$$
```

## Le formule

$$A = \frac{b \cdot h}{2}$$

$$2p = a + b + c$$

Il triangolo è metà di un parallelogramma con la stessa base e la stessa altezza: da qui il diviso 2. Ogni triangolo ha tre basi e tre altezze, e con ogni coppia l'area viene uguale.

## Quando conosci solo i tre lati

Prima controlla che i tre numeri formino un triangolo: ogni lato deve essere minore della somma degli altri due. Con 2, 3 e 7 cm il lato di 7 è più lungo di $2 + 3$, e i lati corti non riescono a chiudersi.

Poi usa la formula di Erone. Serve il semiperimetro $p$, cioè metà del perimetro.

```ad-example
Con la formula di Erone
Lati di 5, 6 e 7 cm. Il perimetro è 18 cm, quindi il semiperimetro è 9 cm. Togli ogni lato dal semiperimetro:

$$\begin{aligned}
9 - 5 &= 4 \\[6pt]
9 - 6 &= 3 \\[6pt]
9 - 7 &= 2
\end{aligned}$$

Moltiplica il semiperimetro per le tre differenze e fai la radice:

$$\begin{aligned}
A &= \sqrt{9 \cdot 4 \cdot 3 \cdot 2} \\[6pt]
&= \sqrt{216} = 6\sqrt{6} \approx 14{,}70 \text{ cm}^2
\end{aligned}$$
```

La formula generale, con $a$, $b$ e $c$ i lati:

$$A = \sqrt{p(p - a)(p - b)(p - c)}$$

## Il triangolo equilatero

Nel triangolo equilatero i tre lati sono uguali. L'altezza lo divide in due triangoli rettangoli, e con il teorema di Pitagora si trova:

$$h = \frac{l\sqrt{3}}{2}$$

$$A = \frac{l^2\sqrt{3}}{4}$$

```ad-error
Errori frequenti
- Dimenticare di dividere per 2.
- Usare come altezza un lato obliquo: l'altezza è perpendicolare alla base, e coincide con un lato solo nel triangolo rettangolo.
- Nella formula di Erone usare il perimetro al posto del semiperimetro.
```

## Domande frequenti

### Dove cade l'altezza in un triangolo ottusangolo?

Un triangolo ottusangolo ha un angolo più grande di un angolo retto. L'altezza relativa a uno dei due lati di quell'angolo cade fuori dal triangolo, sul prolungamento del lato. La formula dell'area non cambia.

### Come calcolo l'area di un triangolo rettangolo?

Prendi un cateto come base e l'altro come altezza. Con cateti di 5 e 12 cm:

$$A = \frac{5 \cdot 12}{2} = 30 \text{ cm}^2$$
