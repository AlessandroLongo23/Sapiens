# Formulario: Iperbole

## Definizione ed equazione

Iperbole: il luogo dei punti $P$ per cui è costante il valore assoluto della differenza delle distanze dai fuochi $F_1$ e $F_2$.

$$\big|\overline{PF_1} - \overline{PF_2}\big| = 2a \qquad \overline{F_1F_2} = 2c$$

Equazione canonica, con il centro nell'origine e i fuochi su un asse cartesiano:

$$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1 \qquad \frac{x^2}{a^2} - \frac{y^2}{b^2} = -1$$

| | secondo membro $1$ | secondo membro $-1$ |
|---|---|---|
| Fuochi | sull'asse $x$: $(\pm c, 0)$ | sull'asse $y$: $(0, \pm c)$ |
| Vertici reali | $(\pm a, 0)$ | $(0, \pm b)$ |
| Asse trasverso | lungo $2a$ | lungo $2b$ |
| Valore di $c$ | $c = \sqrt{a^2 + b^2}$ | $c = \sqrt{a^2 + b^2}$ |
| Asintoti | $y = \pm\dfrac{b}{a}x$ | $y = \pm\dfrac{b}{a}x$ |
| Eccentricità | $e = \dfrac{c}{a}$ | $e = \dfrac{c}{b}$ |

Per ogni iperbole $e > 1$. Per $\dfrac{x^2}{9} - \dfrac{y^2}{16} = 1$: $a = 3$, $b = 4$, $c = 5$, asintoti $y = \pm\dfrac{4}{3}x$, $e = \dfrac{5}{3}$.

## Come si disegna

1. Segna i punti $(\pm a, 0)$ e $(0, \pm b)$.
2. Disegna il rettangolo con i lati sulle rette $x = \pm a$ e $y = \pm b$.
3. Traccia le rette delle diagonali: sono gli asintoti.
4. Disegna i due rami, dai vertici reali verso gli asintoti.

```tikz
% nome: iperbole-vertici-fuochi-asintoti
% alt: L'iperbole x al quadrato fratto 9 meno y al quadrato fratto 16 uguale a 1 con i vertici reali A1 (-3, 0) e A2 (3, 0), i punti B1 (0, -4) e B2 (0, 4), i fuochi F1 (-5, 0) e F2 (5, 0), il rettangolo tratteggiato con i lati per i vertici e gli asintoti lungo le sue diagonali
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-7,-6) grid (7,6);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,6.7) node[above] {$y$};
\draw[dashed, gray] (-3,-4) rectangle (3,4);
\draw[dashed, thick, orange!70] (-4.5,-6) -- (4.5,6);
\draw[dashed, thick, orange!70] (-4.5,6) -- (4.5,-6);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({3*sqrt(1+\x*\x/16)}, \x);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({-3*sqrt(1+\x*\x/16)}, \x);
\foreach \x/\y in {-3/0, 3/0, 0/-4, 0/4, -5/0, 5/0} \fill (\x,\y) circle (0.15);
\node[below left] at (-3,0) {$A_1$};
\node[below right] at (3,0) {$A_2$};
\node[below right] at (0,-4) {$B_1$};
\node[above right] at (0,4) {$B_2$};
\node[below] at (-5.4,0) {$F_1$};
\node[below] at (5.5,0) {$F_2$};
\end{tikzpicture}
```

## Iperbole e retta

Si sostituisce la $y$ della retta nell'equazione dell'iperbole. Se la risolvente è di secondo grado:

| Risolvente | Punti comuni | La retta è |
|---|---|---|
| $\Delta > 0$ | due | secante |
| $\Delta = 0$ | uno | tangente |
| $\Delta < 0$ | nessuno | esterna |

Se la retta è parallela a un asintoto la risolvente è di primo grado: un solo punto comune, e la retta non è tangente. L'asintoto non ha punti comuni con l'iperbole.

## Tangenti

Tangente nel punto $P(x_0, y_0)$ dell'iperbole (formula di sdoppiamento), con secondo membro $-1$ se i fuochi sono sull'asse $y$:

$$\frac{x_0 x}{a^2} - \frac{y_0 y}{b^2} = 1$$

Tangenti da un punto $P(x_0, y_0)$ che non sta sull'iperbole: fascio $y - y_0 = m(x - x_0)$, sistema con l'iperbole, condizione $\Delta = 0$ sulla risolvente, con $m \neq \pm\dfrac{b}{a}$.

## Trovare l'equazione

Servono due condizioni per trovare $a^2$ e $b^2$, oltre all'asse dei fuochi.

| Informazione | Equazione |
|---|---|
| un vertice reale | dà $a$ oppure $b$ |
| un fuoco | $a^2 + b^2 = c^2$ |
| un asintoto | dà il rapporto $\dfrac{b}{a}$ |
| l'eccentricità | il rapporto tra $c$ e il semiasse trasverso |
| un punto | le sue coordinate verificano l'equazione |

```ad-warning
Somma, non differenza
Per l'iperbole $c^2 = a^2 + b^2$; la differenza $a^2 - b^2$ è dell'ellisse.
```

```ad-warning
L'asse dei fuochi
Lo decide il segno, non il denominatore più grande: in $\dfrac{x^2}{4} - \dfrac{y^2}{16} = 1$ i fuochi sono sull'asse $x$.
```

```ad-warning
Un punto solo non vuol dire tangente
Una retta parallela a un asintoto incontra l'iperbole in un solo punto e la attraversa.
```
