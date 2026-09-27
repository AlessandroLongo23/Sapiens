# Area del settore circolare e lunghezza dell'arco

## Che cos'è

Il settore circolare è la parte di cerchio compresa tra due raggi e l'arco che li unisce.

L'angolo tra i due raggi si chiama angolo al centro, e si indica con $\alpha$. Il settore è una fetta del cerchio: se l'angolo è la sesta parte dell'angolo giro, anche l'arco e l'area sono la sesta parte della circonferenza e del cerchio.

## Come si calcola a mano

```ad-example
Raggio 6 cm, angolo 60°
Prima trova che parte del cerchio è il settore: $\frac{60^\circ}{360^\circ} = \frac{1}{6}$. Poi prendi quella parte della circonferenza e del cerchio:

$$\begin{aligned}
\ell &= \frac{1}{6} \cdot 2\pi \cdot 6 = 2\pi \text{ cm} \approx 6{,}28 \text{ cm} \\[6pt]
A &= \frac{1}{6} \cdot \pi \cdot 6^2 = 6\pi \text{ cm}^2 \approx 18{,}85 \text{ cm}^2
\end{aligned}$$
```

In generale, con l'angolo in gradi:

$$\ell = \frac{\alpha}{360^\circ} \cdot 2\pi r \qquad A = \frac{\alpha}{360^\circ} \cdot \pi r^2$$

Con l'angolo in radianti le formule sono più corte, perché il radiante è costruito proprio sul raggio:

$$\ell = \alpha \cdot r \qquad A = \frac{1}{2}\,\alpha\, r^2$$

Con $\alpha = \frac{\pi}{3}$, cioè $60^\circ$, e $r = 6$ si ritrova $\ell = 2\pi$ e $A = 6\pi$.

Il perimetro del settore è la somma dei due raggi e dell'arco: nell'esempio $2p = 12 + 2\pi \approx 18{,}28$ cm.

```ad-error
Errori frequenti
- Mettere l'angolo in gradi nelle formule dei radianti: $\ell = 60 \cdot 6$ è sbagliato, serve $\frac{\pi}{3} \cdot 6$.
- Dimenticare i due raggi nel perimetro: l'arco da solo non basta.
- Usare il diametro al posto del raggio in $\pi r^2$.
```

## Domande frequenti

### Che cosa succede con 180° e 360°?

Con $180^\circ$ il settore è mezzo cerchio. Con $360^\circ$ è il cerchio intero, e il perimetro è la sola circonferenza.

### Come trovo l'angolo se conosco l'arco?

Inverti la formula: in radianti $\alpha = \frac{\ell}{r}$, in gradi $\alpha = \frac{\ell}{2\pi r} \cdot 360^\circ$.

### Settore e segmento circolare sono la stessa cosa?

No. Il segmento circolare è la parte tra l'arco e la corda, senza il triangolo che arriva al centro.
