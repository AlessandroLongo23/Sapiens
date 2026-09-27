# Area e perimetro dei poligoni regolari

## Che cos'è

Un poligono regolare ha tutti i lati uguali e tutti gli angoli uguali: il triangolo equilatero, il quadrato, il pentagono regolare, l'esagono regolare e così via.

Ogni poligono regolare ha un centro, alla stessa distanza da tutti i lati. Quella distanza si chiama apotema, $a$: è il segmento che va dal centro al punto medio di un lato, perpendicolare al lato.

## Un esempio svolto

```ad-example
Pentagono regolare con lato di 10 cm
Il perimetro è la somma dei 5 lati uguali:

$$2p = 5 \cdot 10 = 50 \text{ cm}$$

L'apotema si trova moltiplicando il lato per il numero fisso del pentagono, 0,688:

$$a \approx 10 \cdot 0{,}688 = 6{,}88 \text{ cm}$$

Il poligono si divide in 5 triangoli con base il lato e altezza l'apotema. Sommandoli:

$$\begin{aligned}
A &= \frac{2p \cdot a}{2} \\[6pt]
&\approx \frac{50 \cdot 6{,}88}{2} = 172 \text{ cm}^2
\end{aligned}$$
```

## Il numero fisso

In tutti i poligoni regolari con lo stesso numero di lati, il rapporto tra apotema e lato è sempre lo stesso. Questo rapporto si chiama numero fisso, $f$:

$$a = l \cdot f \qquad l = \frac{a}{f}$$

| Poligono | Numero fisso |
|---|---|
| triangolo equilatero | 0,289 |
| quadrato | 0,5 |
| pentagono | 0,688 |
| esagono | 0,866 |
| ettagono | 1,038 |
| ottagono | 1,207 |
| ennagono | 1,374 |
| decagono | 1,539 |
| dodecagono | 1,866 |

I numeri fissi sono arrotondati a tre decimali, come nelle tabelle dei libri: per questo i risultati sono approssimati. Per il triangolo, il quadrato e l'esagono l'apotema si calcola anche esatto. Nell'esagono, per esempio, è l'altezza di un triangolo equilatero:

$$a = \frac{l\sqrt{3}}{2}$$

## Dall'apotema al lato

```ad-example
Ottagono regolare con apotema di 12 cm
Dividi l'apotema per il numero fisso dell'ottagono:

$$l \approx \frac{12}{1{,}207} \approx 9{,}94 \text{ cm}$$
```

```ad-error
Errori frequenti
- Dimenticare di dividere per 2 nell'area: $2p \cdot a$ è il doppio dell'area.
- Usare il numero fisso di un altro poligono: controlla quanti lati ha la figura.
- Confondere l'apotema con il raggio, che va dal centro a un vertice ed è più lungo.
```

## Domande frequenti

### Da dove viene il numero fisso?

È $\frac{1}{2\,\text{tg}\left(\frac{180°}{n}\right)}$, con $n$ il numero dei lati. Alle medie si usa la tabella; la formula si vede con la trigonometria.

### Il cerchio è un poligono regolare?

No, ma più lati ha un poligono regolare, più assomiglia a un cerchio. Da questa idea Archimede calcolò le prime cifre di $\pi$.
