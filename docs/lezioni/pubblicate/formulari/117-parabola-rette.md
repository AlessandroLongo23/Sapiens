# Formulario: Parabola e rette

## Posizione di una retta rispetto a una parabola

Risolvente del sistema tra $y = ax^2 + bx + c$ e $y = mx + q$:

$$ax^2 + (b - m)x + c - q = 0$$

| Risolvente | Punti comuni | La retta è |
|---|---|---|
| $\Delta > 0$ | due | secante |
| $\Delta = 0$ | uno, contato due volte | tangente |
| $\Delta < 0$ | nessuno | esterna |

Una retta parallela all'asse della parabola la incontra in un solo punto, ma non è tangente.

## Tangente in un punto della parabola

Coefficiente angolare della tangente a $y = ax^2 + bx + c$ nel punto di ascissa $x_0$:

$$m = 2ax_0 + b$$

La tangente è $y - y_0 = m(x - x_0)$, con $y_0 = ax_0^2 + bx_0 + c$. Nel vertice $m = 0$.

Per $x = ay^2 + by + c$, nel punto $P(x_0, y_0)$: $x - x_0 = n(y - y_0)$ con $n = 2ay_0 + b$.

## Tangenti condotte da un punto

| Il punto $P$ è | Tangenti per $P$ |
|---|---|
| esterno | due |
| sulla parabola | una |
| interno (dalla parte del fuoco) | nessuna |

1. Scrivi il fascio per $P(x_0, y_0)$: $y - y_0 = m(x - x_0)$.
2. Metti a sistema con la parabola e scrivi la risolvente.
3. Imponi $\Delta = 0$: è un'equazione in $m$.
4. Ogni soluzione $m$ dà una tangente.

## Parabola tangente a una retta

La condizione è $\Delta = 0$ per la risolvente del sistema tra la parabola e la retta. Vale per una delle tre condizioni che servono.

## Segmento parabolico

Corda perpendicolare all'asse, con $h$ distanza del vertice dalla corda:

$$\text{Area} = \frac{2}{3} \cdot \overline{AB} \cdot h$$

Corda qualsiasi di $y = ax^2 + bx + c$, con estremi di ascisse $x_1$ e $x_2$:

$$\text{Area} = \frac{|a| \cdot |x_2 - x_1|^3}{6}$$

```ad-warning
Un solo punto comune
La retta $x = 4$ incontra $y = \dfrac{1}{4}x^2 - x + 2$ in un punto solo, ma la attraversa: non è tangente.
```

```ad-warning
Due discriminanti
Si annulla il discriminante della risolvente in $x$; l'equazione in $m$ che ne esce si risolve normalmente.
```

```ad-warning
La formula del coefficiente angolare
$m = 2ax_0 + b$ vale solo se $x_0$ è l'ascissa di un punto della parabola.
```
