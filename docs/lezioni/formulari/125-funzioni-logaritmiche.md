# Formulario: Funzione logaritmica

## La funzione y = logₐ x

Con $a > 0$ e $a \neq 1$, la funzione logaritmica è $f(x) = \log_a x$. È l'inversa della funzione esponenziale $y = a^x$: i due grafici sono simmetrici rispetto alla bisettrice $y = x$.

| | $a > 1$ | $0 < a < 1$ |
|---|---|---|
| Dominio | $\mathopen{]}0, +\infty\mathclose{[}$ | $\mathopen{]}0, +\infty\mathclose{[}$ |
| Insieme immagine | $\mathbb{R}$ | $\mathbb{R}$ |
| Andamento | crescente | decrescente |
| Punti del grafico | $(1, 0)$ e $(a, 1)$ | $(1, 0)$ e $(a, 1)$ |
| $\log_a x > 0$ | per $x > 1$ | per $0 < x < 1$ |
| $\log_a x < 0$ | per $0 < x < 1$ | per $x > 1$ |
| Asintoto verticale | l'asse $y$ | l'asse $y$ |

```tikz
% nome: funzione-logaritmica-basi-2-e-un-mezzo
% alt: I grafici di y = logaritmo in base 2 di x, crescente, e di y = logaritmo in base un mezzo di x, decrescente: passano tutti e due per (1, 0) e sono simmetrici rispetto all'asse x; sono segnati i punti (2, 1) e (2, -1), (4, 2) e (4, -2)
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-0.5,-3.5) grid (8.5,3.5);
\draw[->] (-0.8,0) -- (9.1,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,4.1) node[above] {$y$};
\foreach \x in {2,4,8} \node[below] at (\x,-0.05) {\small $\x$};
\foreach \y in {-2,-1,1,2} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60, domain=0.09:8.5, samples=120, smooth] plot (\x, {ln(\x)/ln(2)});
\draw[thick, orange!70, domain=0.09:8.5, samples=120, smooth] plot (\x, {-ln(\x)/ln(2)});
\foreach \x/\y in {1/0, 2/1, 4/2, 2/-1, 4/-2} \fill (\x,\y) circle (0.1);
\node[blue!60!black, above left] at (8.4,3.1) {$y = \log_2 x$};
\node[orange!70!black, below left] at (8.4,-3.1) {$y = \log_{\frac{1}{2}} x$};
\end{tikzpicture}
```

- $\log_{\frac{1}{a}} x = -\log_a x$: i grafici con basi reciproche sono simmetrici rispetto all'asse $x$.
- Segno: $\log_a x$ è positivo quando $a$ e $x$ stanno dalla stessa parte rispetto a $1$.
- $\log_a a^x = x$ per ogni $x$ reale; $a^{\log_a x} = x$ per ogni $x > 0$.

## Confrontare due logaritmi con la stessa base

Con $x_1 > 0$ e $x_2 > 0$:

| Base | Regola | Esempio |
|---|---|---|
| $a > 1$ | $x_1 < x_2 \iff \log_a x_1 < \log_a x_2$ | $\log_3 7 < \log_3 10$ |
| $0 < a < 1$ | $x_1 < x_2 \iff \log_a x_1 > \log_a x_2$ | $\log_{0{,}5} 3 > \log_{0{,}5} 5$ |

In tutti e due i casi $\log_a x_1 = \log_a x_2 \iff x_1 = x_2$.

Per trovare tra quali interi sta un logaritmo: $2^4 < 20 < 2^5$, quindi $4 < \log_2 20 < 5$.

## Dominio

L'argomento di ogni logaritmo deve essere positivo (verso $>$, mai $\geq$), insieme alle altre condizioni.

| Funzione | Condizioni | Dominio |
|---|---|---|
| $\log_2 (x - 3)$ | $x - 3 > 0$ | $\mathopen{]}3, +\infty\mathclose{[}$ |
| $\ln \left(4 - x^2\right)$ | $4 - x^2 > 0$ | $\mathopen{]}-2, 2\mathclose{[}$ |
| $\dfrac{1}{\ln x}$ | $x > 0$ e $\ln x \neq 0$ | $\mathopen{]}0, 1\mathclose{[} \,\cup\, \mathopen{]}1, +\infty\mathclose{[}$ |
| $\sqrt{\log_2 x}$ | $x > 0$ e $\log_2 x \geq 0$ | $[1, +\infty\mathclose{[}$ |

## Traslazioni

$y = \log_a (x - h) + k$ è il grafico di $y = \log_a x$ spostato di $h$ in orizzontale e di $k$ in verticale: asintoto $x = h$, dominio $x > h$, il punto $(1, 0)$ va in $(1 + h, k)$.

```ad-warning
Base minore di 1
Con $0 < a < 1$ l'ordine si rovescia: $\log_{\frac{1}{2}} 8 = -3$ è minore di $\log_{\frac{1}{2}} 4 = -2$.
```

```ad-warning
Il dominio prima delle proprietà
$\log_2 x^2$ ha dominio $x \neq 0$, mentre $2\log_2 x$ ha dominio $x > 0$: non sono la stessa funzione.
```

```ad-warning
Il più dentro l'argomento
$y = \log_2 (x + 4)$ è spostato a sinistra di $4$, con asintoto $x = -4$.
```
