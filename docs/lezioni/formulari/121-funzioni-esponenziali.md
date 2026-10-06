# Formulario: Funzione esponenziale

## Potenze con esponente reale

Con $a > 0$ la potenza $a^x$ ha significato per ogni $x$ reale, ed è sempre positiva: $a^x > 0$.

Con $a$ e $b$ positivi, $x$ e $y$ reali:

$$
\begin{gathered}
a^x \cdot a^y = a^{x+y} \qquad a^x : a^y = a^{x-y} \\
\left(a^x\right)^y = a^{x \cdot y} \\
a^x \cdot b^x = (a \cdot b)^x \qquad a^x : b^x = (a : b)^x \\
a^0 = 1 \qquad a^{-x} = \frac{1}{a^x}
\end{gathered}
$$

## La funzione esponenziale

$$y = a^x \qquad \text{con } a > 0 \text{ e } a \neq 1$$

| | $a > 1$ | $0 < a < 1$ |
|---|---|---|
| Dominio | $\mathbb{R}$ | $\mathbb{R}$ |
| Immagine | $\mathopen{]}0, +\infty\mathclose{[}$ | $\mathopen{]}0, +\infty\mathclose{[}$ |
| Passa per | $(0, 1)$ e $(1, a)$ | $(0, 1)$ e $(1, a)$ |
| Andamento | crescente | decrescente |
| Si avvicina all'asse $x$ | verso sinistra | verso destra |

L'asse $x$ è un asintoto orizzontale. I grafici di $y = a^x$ e di $y = \left(\dfrac{1}{a}\right)^x = a^{-x}$ sono simmetrici rispetto all'asse $y$.

```tikz
% nome: grafici-esponenziali-base-2-e-un-mezzo
% alt: I grafici di y = 2 alla x, che sale, e di y = un mezzo alla x, che scende: sono simmetrici rispetto all'asse y e si incontrano nel punto (0, 1)
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-1) grid (4,9);
\draw[->] (-4.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,9.6) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {2,4,8} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60, domain=-4:3.1, samples=60, smooth] plot (\x, {exp(0.693147*\x)});
\draw[thick, orange!70, domain=-3.1:4, samples=60, smooth] plot (\x, {exp(-0.693147*\x)});
\foreach \x/\y in {-3/8, -2/4, -1/2, 0/1, 1/2, 2/4, 3/8} \fill (\x,\y) circle (0.13);
\node[blue!60!black, above] at (2.6,8.9) {$y = 2^x$};
\node[orange!70!black, above] at (-2.5,8.9) {$y = \left(\frac{1}{2}\right)^x$};
\end{tikzpicture}
```

## Uguaglianza e confronto di potenze

Con $a > 0$ e $a \neq 1$:

$$a^{x_1} = a^{x_2} \iff x_1 = x_2$$

$$
\begin{gathered}
a > 1: \quad a^{x_1} < a^{x_2} \iff x_1 < x_2 \\
0 < a < 1: \quad a^{x_1} < a^{x_2} \iff x_1 > x_2
\end{gathered}
$$

Per esempio $2^{\sqrt{3}} > 2^{1{,}7}$ e $0{,}3^{2} > 0{,}3^{\pi}$.

## Grafici ottenuti da y = aˣ

| Funzione | Come si ottiene | Asintoto | Immagine |
|---|---|---|---|
| $y = a^x + k$ | in su di $k$ (in giù se $k < 0$) | $y = k$ | $\mathopen{]}k, +\infty\mathclose{[}$ |
| $y = a^{x - h}$ | a destra di $h$ (a sinistra se $h < 0$) | $y = 0$ | $\mathopen{]}0, +\infty\mathclose{[}$ |
| $y = -a^x$ | ribaltata rispetto all'asse $x$ | $y = 0$ | $\mathopen{]}-\infty, 0\mathclose{[}$ |
| $y = a^{-x}$ | ribaltata rispetto all'asse $y$ | $y = 0$ | $\mathopen{]}0, +\infty\mathclose{[}$ |

## Dominio

- $y = a^{f(x)}$: il dominio è quello di $f(x)$.
- $y = f(x)^{g(x)}$: serve anche $f(x) > 0$.
- Esponenziale a denominatore: $2^x - 8 \neq 0$ dà $x \neq 3$.

## Crescita e decadimento

$$y = C \cdot a^x$$

$C$ è il valore iniziale; crescita se $a > 1$, decadimento se $0 < a < 1$.

- Aumento del $p\%$ a ogni passo: $a = 1 + \dfrac{p}{100}$. Diminuzione del $p\%$: $a = 1 - \dfrac{p}{100}$.
- Capitale al $2\%$ annuo: $C(t) = 1000 \cdot 1{,}02^t$.
- Dimezzamento ogni $4$ ore: $m(t) = 200 \cdot \left(\dfrac{1}{2}\right)^{\frac{t}{4}}$.

## Il numero e

$$e = 2{,}71828\ldots$$

È irrazionale, ed è il numero a cui si avvicina $\left(1 + \dfrac{1}{n}\right)^n$ al crescere di $n$. Dato che $e > 1$, la funzione $y = e^x$ è crescente.

```ad-warning
Esponenziale e potenza
$y = 2^x$ ha la variabile all'esponente, $y = x^2$ nella base: per $x = 10$ valgono $1024$ e $100$.
```

```ad-warning
Mai negativa, mai nulla
$2^{-3} = \dfrac{1}{8}$, non $-8$: l'esponente negativo dà il reciproco. $2^x = 0$ e $2^x = -4$ sono impossibili.
```

```ad-warning
Il 2% per 10 anni non è il 20%
Il fattore è $1{,}02^{10} \approx 1{,}219$: a ogni passo si moltiplica, non si somma.
```
