# Formulario: Ellisse

## Definizione ed equazione

Ellisse: il luogo dei punti $P$ per cui è costante la somma delle distanze dai fuochi $F_1$ e $F_2$.

$$\overline{PF_1} + \overline{PF_2} = 2a \qquad \overline{F_1F_2} = 2c$$

Equazione canonica, con il centro nell'origine e i fuochi su un asse cartesiano:

$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$$

Vertici: $A_1(-a, 0)$, $A_2(a, 0)$, $B_1(0, -b)$, $B_2(0, b)$. L'ellisse è simmetrica rispetto ai due assi e all'origine, e sta nel rettangolo $-a \leq x \leq a$, $-b \leq y \leq b$.

```tikz
% nome: ellisse-vertici-fuochi-semiassi
% alt: Un'ellisse con il centro O nell'origine, i vertici A1 e A2 sull'asse x, B1 e B2 sull'asse y, i fuochi F1 e F2 sull'asse x e il triangolo rettangolo O F2 B2, con i cateti c e b e l'ipotenusa a
% svg: ellisse-vertici-fuochi-semiassi-e1e39348.svg 287x196
\begin{tikzpicture}[scale=0.55]
\draw[->] (-6.2,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-4) -- (0,4.4) node[above] {$y$};
\draw[thick, blue!60] (0,0) ellipse (5 and 3);
\draw[thick, red!50] (0,3) -- (4,0);
\draw[very thick, orange!70] (0,0) -- (4,0);
\draw[very thick, teal!60] (0,0) -- (0,3);
\foreach \x/\y in {-5/0, 5/0, 0/-3, 0/3, -4/0, 4/0} \fill (\x,\y) circle (0.12);
\node[below left] at (-5,0) {$A_1$};
\node[below right] at (5,0) {$A_2$};
\node[below right] at (0,-3) {$B_1$};
\node[above right] at (0,3) {$B_2$};
\node[below] at (-4,0) {$F_1$};
\node[below] at (4.1,0) {$F_2$};
\node[below left] at (0,0) {$O$};
\node[below] at (2,0) {$c$};
\node[left] at (0,1.5) {$b$};
\node[above right] at (1.9,1.5) {$a$};
\end{tikzpicture}
```

## Fuochi ed eccentricità

| | $a > b$ | $a < b$ |
|---|---|---|
| Fuochi | sull'asse $x$: $(\pm c, 0)$ | sull'asse $y$: $(0, \pm c)$ |
| Valore di $c$ | $c = \sqrt{a^2 - b^2}$ | $c = \sqrt{b^2 - a^2}$ |
| Asse maggiore | lungo $2a$ | lungo $2b$ |
| Somma delle distanze | $2a$ | $2b$ |
| Eccentricità | $e = \dfrac{c}{a}$ | $e = \dfrac{c}{b}$ |

Per ogni ellisse $0 \leq e < 1$; con $e = 0$ è una circonferenza ($a = b$). Per $\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$: $a = 5$, $b = 3$, $c = 4$, $e = \dfrac{4}{5}$.

## Ellisse e retta

Si sostituisce la $y$ della retta nell'equazione dell'ellisse: la risolvente è di secondo grado.

| Risolvente | Punti comuni | La retta è |
|---|---|---|
| $\Delta > 0$ | due | secante |
| $\Delta = 0$ | uno | tangente |
| $\Delta < 0$ | nessuno | esterna |

## Tangenti

Tangente nel punto $P(x_0, y_0)$ dell'ellisse (formula di sdoppiamento):

$$\frac{x_0 x}{a^2} + \frac{y_0 y}{b^2} = 1$$

Tangenti da un punto esterno $P(x_0, y_0)$:

1. scrivi il fascio $y - y_0 = m(x - x_0)$;
2. sostituisci nell'equazione dell'ellisse e scrivi la risolvente;
3. imponi $\Delta = 0$ e risolvi in $m$;
4. sostituisci nel fascio i valori di $m$.

Se trovi un solo valore di $m$, l'altra tangente è la retta verticale $x = x_0$.

## Trovare l'equazione

Servono due condizioni per trovare $a^2$ e $b^2$.

| Informazione | Equazione |
|---|---|
| un vertice | dà $a$ oppure $b$ |
| un fuoco | $a^2 - b^2 = c^2$ oppure $b^2 - a^2 = c^2$ |
| l'eccentricità | il rapporto tra $c$ e il semiasse maggiore |
| un punto | le sue coordinate verificano l'equazione |

Con due punti conviene porre $p = \dfrac{1}{a^2}$ e $q = \dfrac{1}{b^2}$: il sistema diventa lineare.

```ad-warning
Quadrati e semiassi
In $\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$ i semiassi sono $5$ e $3$, non $25$ e $9$.
```

```ad-warning
Il semiasse maggiore
In $\dfrac{x^2}{9} + \dfrac{y^2}{25} = 1$ i fuochi sono sull'asse $y$ e $c^2 = 25 - 9$: si sottrae il denominatore più piccolo dal più grande.
```

```ad-warning
Lo sdoppiamento
Vale solo se $P$ sta sull'ellisse: prima controlla che le sue coordinate verifichino l'equazione.
```
