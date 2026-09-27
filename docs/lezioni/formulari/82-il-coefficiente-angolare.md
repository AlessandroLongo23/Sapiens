# Formulario: Coefficiente angolare e retta per due punti

## Il coefficiente angolare

- Nella retta $y = mx + q$ il coefficiente angolare è $m$: se $x$ aumenta di $1$, $y$ aumenta di $m$.
- Tra due punti $A$ e $B$ della retta:

$$
\begin{gathered}
\Delta x = x_B - x_A \\
\Delta y = y_B - y_A \\
m = \dfrac{\Delta y}{\Delta x}
\end{gathered}
$$

| $m$ | La retta, da sinistra a destra |
|---|---|
| $m > 0$ | sale |
| $m < 0$ | scende |
| $m = 0$ | è orizzontale, $y = q$ |

- Più $m$ è grande in valore assoluto, più la retta è ripida. $m = 1$: bisettrice del primo e del terzo quadrante, $45^\circ$.
- Retta verticale $x = h$: $\Delta x = 0$, il coefficiente angolare non esiste.

## Coefficiente angolare da due punti

Con $x_A \neq x_B$:

$$m = \dfrac{y_B - y_A}{x_B - x_A}$$

Esempio: $A(-1, 3)$, $B(2, -3)$ danno $m = \dfrac{-6}{3} = -2$.

## Coefficiente angolare dalla forma implicita

Retta $ax + by + c = 0$ con $b \neq 0$:

$$m = -\dfrac{a}{b} \qquad q = -\dfrac{c}{b}$$

Con $b = 0$ la retta è verticale. Esempio: $3x - 2y + 6 = 0$ ha $m = \dfrac{3}{2}$.

## Retta per un punto con coefficiente angolare dato

Per $P(x_0, y_0)$ con coefficiente angolare $m$:

$$y - y_0 = m(x - x_0)$$

Esempio: $P(2, -1)$ e $m = 3$ danno $y + 1 = 3(x - 2)$, cioè $y = 3x - 7$. La verticale per $P$, $x = x_0$, la formula non la dà.

## Retta per due punti

1. Se $x_A = x_B$ la retta è $x = x_A$.
2. Calcola $m = \dfrac{y_B - y_A}{x_B - x_A}$.
3. Scrivi $y - y_A = m(x - x_A)$ e porta in forma esplicita.
4. Controlla con le coordinate di $B$.

Con $x_A \neq x_B$ e $y_A \neq y_B$, la stessa retta in una formula sola:

$$\dfrac{y - y_A}{y_B - y_A} = \dfrac{x - x_A}{x_B - x_A}$$

Con il sistema: sostituisci i due punti in $y = mx + q$ e trova $m$ e $q$. Per $A(1, 3)$ e $B(3, -1)$:

$$
\begin{cases}
3 = m + q \\
-1 = 3m + q
\end{cases}
$$

$m = -2$, $q = 5$: $y = -2x + 5$.

## Tre punti allineati

Con ascisse diverse, $A$, $B$ e $C$ sono allineati quando

$$m_{AB} = m_{AC}$$

Se due punti hanno la stessa ascissa, il terzo è allineato solo se ha anche lui quella ascissa.

```ad-warning
Ordini diversi sopra e sotto
$\dfrac{y_B - y_A}{x_A - x_B}$ ha il segno sbagliato, e $\dfrac{\Delta x}{\Delta y}$ non è $m$: sopra va la differenza delle $y$.
```

```ad-warning
La retta verticale non ha $m = 0$
$m = 0$ è la retta orizzontale; la retta verticale non ha coefficiente angolare.
```

```ad-warning
Il segno di $x_0$
Con $P(-3, 4)$ si scrive $y - 4 = m(x + 3)$, non $m(x - 3)$.
```
