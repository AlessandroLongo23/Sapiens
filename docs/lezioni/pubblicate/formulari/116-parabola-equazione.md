# Formulario: La parabola nel piano cartesiano

## La parabola come luogo

Parabola di fuoco $F$ e direttrice $d$: il luogo dei punti $P$ con la stessa distanza da $F$ e da $d$.

$$\overline{PF} = \overline{PH}$$

- Asse: la retta per $F$ perpendicolare a $d$.
- Vertice: il punto dell'asse a metà tra fuoco e direttrice.
- Il fuoco sta dalla parte della concavità, la direttrice dall'altra.

## Vertice nell'origine

Per $y = ax^2$:

$$
\begin{gathered}
\text{fuoco } F\Big(0, \frac{1}{4a}\Big) \\
\text{direttrice } y = -\frac{1}{4a}
\end{gathered}
$$

Esempio: $y = \dfrac{1}{4}x^2$ ha fuoco $(0, 1)$ e direttrice $y = -1$. La distanza tra fuoco e vertice è $\dfrac{1}{4|a|}$.

## Asse parallelo all'asse y o all'asse x

Con $\Delta = b^2 - 4ac$:

| Elemento | $y = ax^2 + bx + c$ | $x = ay^2 + by + c$ |
|---|---|---|
| asse | $x = -\dfrac{b}{2a}$ | $y = -\dfrac{b}{2a}$ |
| vertice | $\Big(-\dfrac{b}{2a}, -\dfrac{\Delta}{4a}\Big)$ | $\Big(-\dfrac{\Delta}{4a}, -\dfrac{b}{2a}\Big)$ |
| fuoco | $\Big(-\dfrac{b}{2a}, \dfrac{1 - \Delta}{4a}\Big)$ | $\Big(\dfrac{1 - \Delta}{4a}, -\dfrac{b}{2a}\Big)$ |
| direttrice | $y = -\dfrac{1 + \Delta}{4a}$ | $x = -\dfrac{1 + \Delta}{4a}$ |
| $a > 0$ | concavità verso l'alto | concavità verso destra |
| $a < 0$ | concavità verso il basso | concavità verso sinistra |

Dal vertice $V(x_V, y_V)$ di $y = ax^2 + bx + c$: fuoco $F\Big(x_V, y_V + \dfrac{1}{4a}\Big)$, direttrice $y = y_V - \dfrac{1}{4a}$.

Forma con il vertice:

$$y - y_V = a(x - x_V)^2$$

Per l'asse orizzontale: $x - x_V = a(y - y_V)^2$. La parabola $x = ay^2 + by + c$ incontra l'asse $x$ nel solo punto $(c, 0)$.

## Trovare l'equazione

Servono tre condizioni: un punto vale per una, il vertice o il fuoco per due, la direttrice o l'asse per una.

- Fuoco e direttrice: si uguagliano i quadrati delle distanze di $P(x, y)$ dal fuoco e dalla direttrice.
- Vertice e un punto: si parte da $y - y_V = a(x - x_V)^2$ e si trova $a$ con il punto.
- Vertice e fuoco: la differenza $y_F - y_V$ è $\dfrac{1}{4a}$.
- Tre punti: si sostituiscono le coordinate e si risolve il sistema in $a$, $b$, $c$.

```ad-warning
Uno su quattro a
Per $y = 2x^2$ il fuoco è $\Big(0, \dfrac{1}{8}\Big)$, non $\Big(0, \dfrac{1}{2}\Big)$.
```

```ad-warning
Le formule scambiate
Per $x = -y^2 + 2y + 3$ il vertice è $(4, 1)$, non $(1, 4)$: $-\dfrac{b}{2a}$ è l'ordinata.
```

```ad-warning
Com'è l'asse
Tre punti non dicono se l'asse è parallelo all'asse $y$ o all'asse $x$: lo deve dire il testo.
```
