# Formulario: Sistemi di secondo grado

## Grado del sistema

Grado del sistema: il prodotto dei gradi delle equazioni. Il termine $xy$ ha grado $2$.

- Sistema di secondo grado: un'equazione di primo grado e una di secondo, grado $1 \cdot 2 = 2$.
- $x^2 + y^2 = 10$ e $xy = 3$: grado $2 \cdot 2 = 4$, non è di secondo grado.
- Le soluzioni sono coppie $(x, y)$.

## Metodo di sostituzione

1. Dall'equazione di primo grado ricava un'incognita.
2. Sostituiscila nell'equazione di secondo grado: è l'equazione risolvente.
3. Risolvi la risolvente.
4. Per ogni soluzione ricava l'altra incognita dall'espressione di primo grado.
5. Scrivi le coppie.

| $\Delta$ della risolvente | Soluzioni del sistema |
|---|---|
| $\Delta > 0$ | due coppie |
| $\Delta = 0$ | una coppia |
| $\Delta < 0$ | nessuna, sistema impossibile |

$$
\begin{cases}
x - 2y = 1 \\
xy = 3
\end{cases}
$$

$x = 2y + 1$, risolvente $2y^2 + y - 3 = 0$, $S = \left\{\left(-2, -\dfrac{3}{2}\right), (3, 1)\right\}$.

## Retta e parabola

Le soluzioni del sistema tra $y = ax^2 + bx + c$ e $y = mx + q$ sono i punti comuni.

| $\Delta$ della risolvente | Punti comuni | Retta |
|---|---|---|
| $\Delta > 0$ | due | secante |
| $\Delta = 0$ | uno | tangente |
| $\Delta < 0$ | nessuno | esterna |

Con $y = x^2 - 2x - 3$: la retta $y = x - 3$ è secante in $(0, -3)$ e $(3, 0)$; $y = 2x - 7$ è tangente in $(2, -3)$; $y = x - 6$ è esterna.

## Sistemi simmetrici

$$
\begin{cases}
x + y = s \\
xy = p
\end{cases}
$$

$x$ e $y$ sono le soluzioni di

$$t^2 - st + p = 0$$

Se le soluzioni sono $t_1$ e $t_2$: $S = \{(t_1, t_2), (t_2, t_1)\}$. Con $\Delta = 0$ una coppia sola, $(t_1, t_1)$; con $\Delta < 0$ impossibile.

- $x + y = 1$, $xy = -6$: $t^2 - t - 6 = 0$, $S = \{(-2, 3), (3, -2)\}$.
- Somma dei quadrati: $x^2 + y^2 = (x + y)^2 - 2xy$.

## Problemi

Rettangolo di lati $x > 0$ e $y > 0$: la somma $x + y$ è metà del perimetro, il prodotto $xy$ è l'area. Perimetro $14$ cm e area $12\ \text{cm}^2$: lati $3$ cm e $4$ cm.

```ad-warning
L'altra incognita dall'equazione sbagliata
Si ricava dall'espressione di primo grado: dall'equazione di secondo grado vengono coppie che non risolvono il sistema.
```

```ad-warning
La coppia scambiata
$x + y = 1$, $xy = -6$ ha due soluzioni, $(-2, 3)$ e $(3, -2)$, non $S = \{-2, 3\}$.
```

```ad-warning
Il segno della somma
L'equazione è $t^2 - st + p = 0$: con $s = 1$ si scrive $-t$, non $+t$.
```
