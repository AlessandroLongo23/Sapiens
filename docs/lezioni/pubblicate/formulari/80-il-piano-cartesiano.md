# Formulario: Il piano cartesiano: distanza e punto medio

## Coordinate e quadranti

- Punto $P(x_P, y_P)$: prima l'ascissa $x_P$ (spostamento orizzontale), poi l'ordinata $y_P$ (spostamento verticale).
- Origine $O(0, 0)$. Asse $x$: punti $(a, 0)$. Asse $y$: punti $(0, b)$. I punti degli assi non stanno in nessun quadrante.

| Quadrante | $x$ | $y$ |
|---|---|---|
| I | $+$ | $+$ |
| II | $-$ | $+$ |
| III | $-$ | $-$ |
| IV | $+$ | $-$ |

## Distanza tra due punti

- Segmento orizzontale ($y_A = y_B$): $\overline{AB} = |x_B - x_A|$.
- Segmento verticale ($x_A = x_B$): $\overline{AB} = |y_B - y_A|$.
- Caso generale, dal teorema di Pitagora:

$$
\begin{gathered}
\overline{AB} = \\
\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}
\end{gathered}
$$

- Distanza dall'origine: $\overline{OP} = \sqrt{x_P^2 + y_P^2}$. Esempio: $P(3, -4)$, $\overline{OP} = 5$.
- Il risultato si scrive con il radicale ridotto: $\sqrt{72} = 6\sqrt{2}$.

## Punto medio e simmetrici

- Punto medio di $AB$:

$$
\begin{gathered}
x_M = \frac{x_A + x_B}{2} \\
y_M = \frac{y_A + y_B}{2}
\end{gathered}
$$

- Estremo $B$ dato $A$ e $M$: $x_B = 2x_M - x_A$, $y_B = 2y_M - y_A$.
- Simmetrico di $A$ rispetto a $C$: $x_{A'} = 2x_C - x_A$, $y_{A'} = 2y_C - y_A$.
- Simmetrico di $(x, y)$ rispetto all'asse $x$: $(x, -y)$; all'asse $y$: $(-x, y)$; all'origine: $(-x, -y)$.
- Baricentro del triangolo $ABC$: $x_G = \dfrac{x_A + x_B + x_C}{3}$, $y_G = \dfrac{y_A + y_B + y_C}{3}$.

## Riconoscere le figure

1. Triangolo: calcola i quadrati dei tre lati.
2. Due lati uguali: isoscele; tre: equilatero.
3. Quadrato del lato più lungo uguale alla somma degli altri due: rettangolo, con l'angolo retto opposto al lato più lungo.
4. Quadrilatero $ABCD$: se $AC$ e $BD$ hanno lo stesso punto medio è un parallelogramma.
5. Parallelogramma con $\overline{AC} = \overline{BD}$: rettangolo.

```ad-warning
Il segno meno
$4 - (-3) = 7$, non $1$; $(-6)^2 = 36$, non $-36$.
```

```ad-warning
La radice di una somma
$\sqrt{16 + 9} = 5$, non $4 + 3$.
```

```ad-warning
Quale coordinata cambia
Simmetrico di $(3, 2)$ rispetto all'asse $x$: $(3, -2)$. Cambia l'ordinata.
```
