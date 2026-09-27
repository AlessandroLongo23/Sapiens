# Formulario: Relazioni tra soluzioni e coefficienti

## Somma e prodotto delle soluzioni

Per $ax^2 + bx + c = 0$ con $a \neq 0$ e $\Delta \geq 0$:

$$
\begin{gathered}
s = x_1 + x_2 = -\frac{b}{a} \\
p = x_1 \cdot x_2 = \frac{c}{a}
\end{gathered}
$$

Con $\Delta = 0$ valgono contando la soluzione doppia due volte. Con $\Delta < 0$ non valgono: le soluzioni non ci sono.

Nota una soluzione, l'altra si ricava dal prodotto (o dalla somma): per $3x^2 - 5x - 2 = 0$ con $x = 2$, $2 \cdot x_2 = -\dfrac{2}{3}$, quindi $x_2 = -\dfrac{1}{3}$.

## Equazione con soluzioni date

$$x^2 - sx + p = 0$$

Soluzioni $-3$ e $5$: $s = 2$, $p = -15$, equazione $x^2 - 2x - 15 = 0$. Con soluzioni frazionarie si moltiplica per il denominatore comune: soluzioni $-\dfrac{1}{2}$ e $\dfrac{2}{3}$ danno $6x^2 - x - 2 = 0$.

## Due numeri di somma e prodotto dati

Sono le soluzioni di $x^2 - sx + p = 0$: esistono se e solo se $s^2 - 4p \geq 0$. Somma $10$ e prodotto $21$: $x^2 - 10x + 21 = 0$, i numeri sono $3$ e $7$.

## Scomposizione del trinomio

| Discriminante | Scomposizione |
|---|---|
| $\Delta > 0$ | $a(x - x_1)(x - x_2)$ |
| $\Delta = 0$ | $a(x - x_1)^2$ |
| $\Delta < 0$ | irriducibile |

$$
\begin{aligned}
&6x^2 - x - 2 \\
&= 6\Big(x + \frac{1}{2}\Big)\Big(x - \frac{2}{3}\Big) \\
&= (2x + 1)(3x - 2)
\end{aligned}
$$

$$
\begin{aligned}
&x^2 + 4x + 2 \\
&= (x + 2 - \sqrt{2})(x + 2 + \sqrt{2})
\end{aligned}
$$

## Segni delle soluzioni

Con $\Delta \geq 0$:

| Prodotto $p$ | Somma $s$ | Soluzioni |
|---|---|---|
| positivo | positiva | tutte e due positive |
| positivo | negativa | tutte e due negative |
| negativo | positiva | discordi, maggiore in valore assoluto la positiva |
| negativo | negativa | discordi, maggiore in valore assoluto la negativa |
| zero | qualunque | una è $0$ |

Se $a$ e $c$ sono discordi, $\Delta > 0$ sempre.

Regola di Cartesio, con $a$, $b$, $c$ diversi da zero e $\Delta \geq 0$: nella sequenza dei segni di $a$, $b$, $c$, ogni variazione dà una soluzione positiva e ogni permanenza una negativa. Con una variazione e una permanenza, ha valore assoluto maggiore la positiva se viene prima la variazione, la negativa se viene prima la permanenza.

## Espressioni simmetriche

| Espressione | Con $s$ e $p$ |
|---|---|
| $x_1^2 + x_2^2$ | $s^2 - 2p$ |
| $\dfrac{1}{x_1} + \dfrac{1}{x_2}$ | $\dfrac{s}{p}$ |
| $x_1^2x_2 + x_1x_2^2$ | $ps$ |
| $(x_1 - x_2)^2$ | $s^2 - 4p$ |
| $x_1^3 + x_2^3$ | $s^3 - 3ps$ |
| $\dfrac{1}{x_1^2} + \dfrac{1}{x_2^2}$ | $\dfrac{s^2 - 2p}{p^2}$ |

```ad-warning
Il segno della somma
La somma è $-\dfrac{b}{a}$, e nell'equazione $x^2 - sx + p = 0$ la $s$ entra con il segno meno.
```

```ad-warning
Il discriminante prima di tutto
Somma, prodotto e regola di Cartesio hanno senso solo se $\Delta \geq 0$: $x^2 - 2x + 5 = 0$ ha due variazioni ma nessuna soluzione.
```

```ad-warning
Il coefficiente a nella scomposizione
$6x^2 - x - 2$ non è $\Big(x + \dfrac{1}{2}\Big)\Big(x - \dfrac{2}{3}\Big)$: davanti ai fattori va $a = 6$.
```
