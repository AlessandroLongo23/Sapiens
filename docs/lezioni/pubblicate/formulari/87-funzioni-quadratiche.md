# Formulario: La parabola

## Parabola, concavità e apertura

Parabola: il grafico di $y = ax^2 + bx + c$ con $a \neq 0$. Ha un vertice $V$ e un asse di simmetria verticale che passa per $V$.

| Coefficiente | Parabola |
|---|---|
| $a > 0$ | concavità verso l'alto, $V$ è il punto più basso |
| $a < 0$ | concavità verso il basso, $V$ è il punto più alto |
| $\lvert a \rvert$ grande | più stretta |
| $\lvert a \rvert$ vicino a $0$ | più larga |

- $y = ax^2$: vertice nell'origine, asse di simmetria l'asse $y$.
- $y = ax^2 + c$: la parabola $y = ax^2$ spostata in su di $c$ (in giù se $c < 0$), con vertice $V(0, c)$.

## Vertice e asse di simmetria

$$x_V = -\frac{b}{2a}$$

$y_V$ si trova sostituendo $x_V$ nell'equazione, oppure

$$y_V = -\frac{\Delta}{4a}$$

Asse di simmetria: la retta $x = x_V$. Per $y = x^2 - 4x + 3$: $V(2, -1)$, asse $x = 2$.

## Intersezioni con gli assi

- Con l'asse $y$: il punto $(0, c)$. Se $c = 0$ la parabola passa per l'origine.
- Con l'asse $x$: le soluzioni dell'equazione associata $ax^2 + bx + c = 0$.

| Discriminante | Punti sull'asse $x$ | La parabola |
|---|---|---|
| $\Delta > 0$ | $(x_1, 0)$ e $(x_2, 0)$ | taglia l'asse $x$ |
| $\Delta = 0$ | uno, il vertice | è tangente all'asse $x$ |
| $\Delta < 0$ | nessuno | tutta sopra ($a > 0$) o tutta sotto ($a < 0$) |

Con $\Delta > 0$ il vertice sta a metà: $x_V = \dfrac{x_1 + x_2}{2}$.

Un punto sta sulla parabola se le sue coordinate rendono vera l'equazione.

## Come si disegna

1. Concavità dal segno di $a$.
2. Vertice $V$ e asse $x = x_V$, tratteggiato.
3. Il punto $(0, c)$ e il suo simmetrico rispetto all'asse.
4. $\Delta$ e, se non è negativo, le intersezioni con l'asse $x$.
5. Se servono, altre coppie di punti simmetrici.
6. Una curva morbida, simmetrica, arrotondata nel vertice.

## Parabola per tre punti

Per tre punti con ascisse diverse e non allineati passa una sola parabola: si sostituiscono le coordinate in $y = ax^2 + bx + c$ e si risolve il sistema in $a$, $b$, $c$.

```ad-warning
Il segno nella formula del vertice
Per $y = x^2 - 4x + 3$ è $x_V = 2$, non $-2$; per $y = -x^2 + 6x$ è $x_V = -\dfrac{6}{-2} = 3$.
```

```ad-warning
Il meno davanti a x²
Per $y = -x^2 - 2x + 3$ e $x = -1$ il primo termine vale $-(-1)^2 = -1$, non $1$.
```

```ad-warning
L'apertura
$y = -3x^2$ è più stretta di $y = x^2$: conta $|a|$, non $a$.
```
