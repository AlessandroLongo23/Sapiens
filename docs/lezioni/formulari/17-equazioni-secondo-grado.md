# Formulario: Equazioni di secondo grado

## Forma normale

$$ax^2 + bx + c = 0 \qquad \text{con } a \neq 0$$

$a$ coefficiente di $x^2$, $b$ coefficiente di $x$, $c$ termine noto, ognuno con il suo segno: in $3x^2 - x - 2 = 0$ hai $a = 3$, $b = -1$, $c = -2$. Le soluzioni (o radici) si scrivono in ordine crescente, $x_1 < x_2$.

## Equazioni incomplete

| Nome | Coefficienti | Forma | Soluzioni |
|---|---|---|---|
| pura | $b = 0$, $c \neq 0$ | $ax^2 + c = 0$ | $x = \pm\sqrt{-\dfrac{c}{a}}$ se $-\dfrac{c}{a} > 0$; nessuna se $-\dfrac{c}{a} < 0$ |
| spuria | $b \neq 0$, $c = 0$ | $ax^2 + bx = 0$ | $x = 0$ e $x = -\dfrac{b}{a}$ |
| monomia | $b = 0$, $c = 0$ | $ax^2 = 0$ | $x = 0$, soluzione doppia |

La spuria si risolve raccogliendo $x$, $x(ax + b) = 0$, con la legge di annullamento del prodotto: un prodotto vale zero se e solo se almeno uno dei fattori vale zero.

## Formula risolutiva

Discriminante:

$$\Delta = b^2 - 4ac$$

Soluzioni, se $\Delta \geq 0$:

$$x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}$$

| Discriminante | Soluzioni reali | Insieme delle soluzioni |
|---|---|---|
| $\Delta > 0$ | due, distinte | $S = \{x_1,\ x_2\}$ |
| $\Delta = 0$ | due coincidenti (soluzione doppia) | $S = \left\{-\dfrac{b}{2a}\right\}$ |
| $\Delta < 0$ | nessuna | $S = \emptyset$ |

Formula ridotta, quando $b$ è pari:

$$
\begin{gathered}
\frac{\Delta}{4} = \left(\frac{b}{2}\right)^2 - ac \\
x_{1,2} = \frac{-\dfrac{b}{2} \pm \sqrt{\dfrac{\Delta}{4}}}{a}
\end{gathered}
$$

Soluzioni irrazionali: semplifica il radicale; poi, se $-b$, il coefficiente del radicale e $2a$ hanno un divisore comune, dividili tutti e tre. Per esempio $\dfrac{8 \pm 6\sqrt{2}}{2} = 4 \pm 3\sqrt{2}$.

Controllo con somma e prodotto: $x_1 + x_2 = -\dfrac{b}{a}$ e $x_1 \cdot x_2 = \dfrac{c}{a}$.

## Come si risolve

1. Porta in forma normale: tutti i termini a primo membro, ridotti e ordinati per grado.
2. Se $a < 0$, moltiplica per $-1$; se i coefficienti hanno un divisore comune, dividi.
3. Se è pura, spuria o monomia, usa il suo metodo.
4. Calcola $\Delta$: se è negativo, $S = \emptyset$.
5. Applica la formula, poi semplifica il radicale e la frazione.
6. Scrivi $x_1 < x_2$ e l'insieme $S$.

```ad-warning
Il segno di b e di 4ac
Con $b = -5$, $b^2 = (-5)^2 = 25$; con $a$ e $c$ di segno opposto, $-4ac$ è positivo.
```

```ad-warning
Il denominatore della formula
Si divide tutto il numeratore per $2a$: con $a = 2$ il denominatore è $4$.
```

```ad-warning
Dividere per x nella spuria
Da $2x^2 - 6x = 0$ si raccoglie $x$: dividendo per $x$ si perde la soluzione $x = 0$.
```
