# Area e perimetro del triangolo

## Che cos'è

Il triangolo è il poligono con tre lati. Il perimetro è la loro somma. Per l'area serve un'altezza: il segmento che parte da un vertice e cade perpendicolare sul lato opposto, che in quel momento fa da base. Ogni triangolo ha tre basi e tre altezze, e il prodotto di una base per la sua altezza è sempre lo stesso.

## Le formule

$$A = \frac{b \cdot h}{2} \qquad 2p = a + b + c$$

Il triangolo è metà di un parallelogramma con la stessa base e la stessa altezza: da qui il diviso 2. Quando si conoscono solo i tre lati si usa la formula di Erone, con $p$ il semiperimetro:

$$A = \sqrt{p(p - a)(p - b)(p - c)}$$

Nel triangolo equilatero di lato $l$ l'altezza è $\dfrac{l\sqrt{3}}{2}$ e l'area $\dfrac{l^2\sqrt{3}}{4}$.

## Come si calcola a mano

```ad-example
Con la formula di Erone
Lati di 5, 6 e 7 cm. Il perimetro è 18 cm e il semiperimetro 9 cm. Allora $A = \sqrt{9 \cdot 4 \cdot 3 \cdot 2} = \sqrt{216} = 6\sqrt{6} \approx 14{,}70$ cm².
```

Prima di tutto controlla che i tre numeri formino davvero un triangolo: ogni lato deve essere minore della somma degli altri due. Con 2, 3 e 7 cm il lato di 7 cm è più lungo di $2 + 3$, e i due lati corti non riescono a chiudersi.

```ad-error
Errori frequenti
- Dimenticare di dividere per 2.
- Usare come altezza un lato obliquo: l'altezza è perpendicolare alla base, e coincide con un lato solo nel triangolo rettangolo.
- Nella formula di Erone usare il perimetro al posto del semiperimetro.
```

## Domande frequenti

### Dove cade l'altezza in un triangolo ottusangolo?

L'altezza relativa a uno dei due lati che formano l'angolo ottuso cade fuori dal triangolo, sul prolungamento di quel lato. La formula dell'area non cambia.

### Come calcolo l'area di un triangolo rettangolo?

Prendi un cateto come base e l'altro come altezza: con cateti di 5 e 12 cm l'area è $\dfrac{5 \cdot 12}{2} = 30$ cm².
