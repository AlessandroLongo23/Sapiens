# Formulario: Equazione della retta e casi particolari

## Equazione di una retta

- Un punto sta sulla retta se e solo se le sue coordinate rendono vera l'equazione.
- Ogni retta ha un'equazione di primo grado in $x$ e $y$, e ogni equazione di primo grado in $x$ e $y$ è una retta.

## Assi e rette parallele agli assi

$$
\begin{gathered}
\text{asse } x\text{: } y = 0 \\
\text{asse } y\text{: } x = 0
\end{gathered}
$$

- Retta orizzontale (parallela all'asse $x$) per $(0, k)$: $y = k$.
- Retta verticale (parallela all'asse $y$) per $(h, 0)$: $x = h$.
- Per $A(-2, 5)$: orizzontale $y = 5$, verticale $x = -2$.

## Bisettrici dei quadranti

$$
\begin{gathered}
\text{I e III quadrante: } y = x \\
\text{II e IV quadrante: } y = -x
\end{gathered}
$$

## Forma esplicita

- Retta per l'origine (non verticale), $m$ coefficiente angolare:

$$y = mx$$

- Retta non verticale, $q$ ordinata all'origine, taglia l'asse $y$ in $(0, q)$:

$$y = mx + q$$

- $q = 0$: per l'origine. $m = 0$: orizzontale. La retta verticale $x = h$ non ha forma esplicita.

## Forma implicita

$$ax + by + c = 0$$

con $a$ e $b$ non tutti e due zero. Vale per tutte le rette.

| Se | la retta è | esempio |
|---|---|---|
| $a = 0$ | orizzontale | $2y - 6 = 0$ |
| $b = 0$ | verticale | $3x + 6 = 0$ |
| $c = 0$ | per l'origine | $x - 2y = 0$ |

- Moltiplicando tutti i termini per lo stesso numero diverso da zero si ottiene la stessa retta: $2x - y + 1 = 0$ e $4x - 2y + 2 = 0$.

## Da una forma all'altra

Dall'implicita all'esplicita (con $b \neq 0$):
1. Lascia $by$ a primo membro, porta gli altri termini a secondo membro cambiando segno.
2. Dividi per $b$ ogni termine.

$$
\begin{aligned}
3x - 2y + 4 &= 0 \\
-2y &= -3x - 4 \\
y &= \dfrac{3}{2}x + 2
\end{aligned}
$$

Dall'esplicita all'implicita: moltiplica per il minimo comune multiplo dei denominatori, poi porta tutto a primo membro.

$$
\begin{aligned}
y &= \dfrac{2}{3}x - \dfrac{1}{2} \\
6y &= 4x - 3 \\
4x - 6y - 3 &= 0
\end{aligned}
$$

## Punti e intersezioni con gli assi

- Punto $P(x_P, y_P)$ sulla retta: sostituisci $x_P$ al posto di $x$ e $y_P$ al posto di $y$; l'uguaglianza deve essere vera.

$$
\begin{gathered}
\text{asse } y\text{: metti } x = 0 \\
\text{asse } x\text{: metti } y = 0
\end{gathered}
$$

- $2x - 3y + 6 = 0$ taglia gli assi in $(0, 2)$ e $(-3, 0)$.
- $y = k$ con $k \neq 0$ non taglia l'asse $x$; $x = h$ con $h \neq 0$ non taglia l'asse $y$; una retta per l'origine taglia gli assi solo in $O$.

## Disegnare una retta

- Con due punti: due valori di $x$ lontani tra loro, con $y$ intero; spesso le intersezioni con gli assi.
- Con $q$ e $m$: parti da $(0, q)$; se $x$ aumenta di $n$, $y$ aumenta di $n \cdot m$. Per $y = -\dfrac{3}{4}x + 1$: da $(0, 1)$, $4$ a destra e $3$ in giù, fino a $(4, -2)$.

```ad-warning
$x = 3$ è verticale
I suoi punti hanno tutti ascissa $3$: $(3, 0)$, $(3, 1)$, $(3, -2)$. La retta orizzontale è $y = 3$.
```

```ad-warning
Dividere tutto il secondo membro
Da $-2y = -3x - 4$ si ottiene $y = \dfrac{3}{2}x + 2$: si divide per $-2$ ogni termine, con il segno.
```

```ad-warning
Il punto sull'asse $x$
Si trova mettendo $y = 0$, non $x = 0$: sull'asse $x$ è l'ordinata a essere zero.
```
