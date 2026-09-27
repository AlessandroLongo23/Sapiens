# Formulario: Intersezione tra due rette

## Punto di intersezione

Il punto comune a due rette ha per coordinate la soluzione del sistema formato dalle due equazioni.

1. Scrivi il sistema con le equazioni delle due rette.
2. Risolvilo: confronto se le rette sono in forma esplicita, sostituzione o riduzione se sono in forma implicita.
3. Scrivi il punto, prima la $x$ e poi la $y$.

$$
\begin{cases}
y = 2x - 1 \\
y = -x + 5
\end{cases}
\ \Rightarrow \ P(2, 3)
$$

- Forma implicita: il termine noto passa a secondo membro con il segno cambiato, $x + 2y - 3 = 0$ diventa $x + 2y = 3$.
- Retta verticale $x = h$: si sostituisce $x = h$ nell'altra equazione.
- Assi: l'asse $x$ è $y = 0$, l'asse $y$ è $x = 0$.

## Incidenti, parallele, coincidenti

Rette $ax + by + c = 0$ e $a'x + b'y + c' = 0$, con $a'$, $b'$, $c'$ diversi da zero:

| Rapporti | Rette | Sistema |
|---|---|---|
| $\dfrac{a}{a'} \neq \dfrac{b}{b'}$ | incidenti | determinato |
| $\dfrac{a}{a'} = \dfrac{b}{b'} \neq \dfrac{c}{c'}$ | parallele distinte | impossibile |
| $\dfrac{a}{a'} = \dfrac{b}{b'} = \dfrac{c}{c'}$ | coincidenti | indeterminato |

Se un coefficiente è zero: incidenti quando $ab' \neq a'b$.

Rette $y = mx + q$ e $y = m'x + q'$:

| $m$ e $q$ | Rette |
|---|---|
| $m \neq m'$ | incidenti |
| $m = m'$, $q \neq q'$ | parallele distinte |
| $m = m'$, $q = q'$ | coincidenti |

- Due rette verticali sono parallele o coincidenti; una verticale e una non verticale sono incidenti.
- Risolvendo: $0 = 7$ vuol dire parallele distinte, $0 = 0$ coincidenti.

## Triangoli

- Vertice $A$ del triangolo $ABC$: intersezione dei lati $AB$ e $CA$.
- Lato sull'asse $x$: base $= |x_B - x_A|$, altezza $= |y_C|$ (ordinata del terzo vertice).
- Triangolo che la retta forma con gli assi: cateti uguali ai valori assoluti delle coordinate dei punti sugli assi.

$$
\begin{gathered}
2x - 5y + 10 = 0 \\
A(-5, 0), \ B(0, 2) \\
\text{Area} = \frac{1}{2} \cdot 5 \cdot 2 = 5
\end{gathered}
$$

## Tre rette per lo stesso punto

1. Trova il punto di intersezione di due rette.
2. Sostituisci le sue coordinate nella terza: se l'uguaglianza è vera, le tre rette sono concorrenti.
3. Con un parametro nella terza retta, la sostituzione dà un'equazione nel parametro.

```ad-warning
Il segno del termine noto
$x + 2y - 3 = 0$ nel sistema in forma normale è $x + 2y = 3$, non $x + 2y = -3$.
```

```ad-warning
Stessa $q$ non vuol dire parallele
$y = -x + 4$ e $y = 2x + 4$ hanno $m$ diverse: sono incidenti in $(0, 4)$.
```

```ad-warning
Altezza negativa
Con $C\left(-1, -\dfrac{3}{2}\right)$ l'altezza è $\dfrac{3}{2}$: le lunghezze si prendono in valore assoluto.
```
