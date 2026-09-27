# Formulario: Disequazioni di secondo grado

## Forma normale

$$
\begin{gathered}
ax^2 + bx + c > 0 \\
\text{(oppure } \geq,\ <,\ \leq \text{)}, \quad a \neq 0
\end{gathered}
$$

- Equazione associata: $ax^2 + bx + c = 0$, con $\Delta = b^2 - 4ac$ e soluzioni $x_1 \leq x_2$.
- Se $a < 0$, moltiplica per $-1$ e cambia il verso:

$$
\begin{gathered}
-x^2 + 4x - 3 \geq 0 \\
\Rightarrow x^2 - 4x + 3 \leq 0
\end{gathered}
$$

## Segno del trinomio con a positivo

Il trinomio è positivo dove la parabola $y = ax^2 + bx + c$ sta sopra l'asse $x$, negativo dove sta sotto.

- $\Delta > 0$: positivo per i valori esterni, $x < x_1$ oppure $x > x_2$; negativo per i valori interni, $x_1 < x < x_2$.
- $\Delta = 0$: positivo per ogni $x \neq x_1$, zero in $x_1 = -\dfrac{b}{2a}$.
- $\Delta < 0$: positivo per ogni $x$.

```tikz
% nome: segno-trinomio-delta-positivo
% alt: Parabola y uguale a x al quadrato meno 2x meno 3, rivolta verso l'alto, che taglia l'asse x in meno 1 e in 3: il trinomio è positivo prima di meno 1 e dopo 3, dove la parabola sta sopra l'asse, e negativo in mezzo
% svg: segno-trinomio-delta-positivo-38df4bb1.svg 192x139
\begin{tikzpicture}
\fill[blue!15] (-1.42,0) -- plot[smooth] coordinates {(-1.42,1.56) (-1.40,1.50) (-1.37,1.44) (-1.35,1.37) (-1.33,1.31) (-1.30,1.25) (-1.28,1.20) (-1.25,1.14) (-1.23,1.08) (-1.21,1.02) (-1.18,0.97) (-1.16,0.91) (-1.13,0.86) (-1.11,0.80) (-1.09,0.75) (-1.06,0.70) (-1.04,0.65) (-1.01,0.60) (-0.99,0.55) (-0.97,0.50) (-0.94,0.45) (-0.92,0.40) (-0.89,0.35) (-0.87,0.31) (-0.84,0.26) (-0.82,0.22) (-0.80,0.17) (-0.77,0.13) (-0.75,0.08) (-0.72,0.04) (-0.70,0.00)} -- (-0.70,0) -- cycle;
\fill[red!15] (-0.70,0) -- plot[smooth] coordinates {(-0.70,0.00) (-0.61,-0.15) (-0.51,-0.30) (-0.42,-0.43) (-0.33,-0.55) (-0.23,-0.67) (-0.14,-0.77) (-0.05,-0.86) (0.05,-0.94) (0.14,-1.01) (0.23,-1.07) (0.33,-1.11) (0.42,-1.15) (0.51,-1.18) (0.61,-1.19) (0.70,-1.20) (0.79,-1.19) (0.89,-1.18) (0.98,-1.15) (1.07,-1.11) (1.17,-1.07) (1.26,-1.01) (1.35,-0.94) (1.45,-0.86) (1.54,-0.77) (1.63,-0.67) (1.73,-0.55) (1.82,-0.43) (1.91,-0.30) (2.01,-0.15) (2.10,0.00)} -- (2.10,0) -- cycle;
\fill[blue!15] (2.10,0) -- plot[smooth] coordinates {(2.10,0.00) (2.12,0.04) (2.15,0.08) (2.17,0.13) (2.20,0.17) (2.22,0.22) (2.24,0.26) (2.27,0.31) (2.29,0.35) (2.32,0.40) (2.34,0.45) (2.36,0.50) (2.39,0.55) (2.41,0.60) (2.44,0.65) (2.46,0.70) (2.49,0.75) (2.51,0.80) (2.53,0.86) (2.56,0.91) (2.58,0.97) (2.61,1.02) (2.63,1.08) (2.65,1.14) (2.68,1.20) (2.70,1.25) (2.73,1.31) (2.75,1.37) (2.77,1.43) (2.80,1.50) (2.82,1.56)} -- (2.82,0) -- cycle;
\draw[black!70, ->] (-1.54,0) -- (3.01,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.32) -- (0,1.81) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-1.42,1.56) (-1.32,1.29) (-1.21,1.03) (-1.10,0.79) (-1.00,0.57) (-0.89,0.35) (-0.79,0.15) (-0.68,-0.03) (-0.57,-0.21) (-0.47,-0.37) (-0.36,-0.51) (-0.26,-0.64) (-0.15,-0.76) (-0.04,-0.86) (0.06,-0.95) (0.17,-1.03) (0.28,-1.09) (0.38,-1.14) (0.49,-1.17) (0.59,-1.19) (0.70,-1.20) (0.81,-1.19) (0.91,-1.17) (1.02,-1.14) (1.12,-1.09) (1.23,-1.03) (1.34,-0.95) (1.44,-0.86) (1.55,-0.76) (1.65,-0.64) (1.76,-0.51) (1.87,-0.37) (1.97,-0.21) (2.08,-0.04) (2.19,0.15) (2.29,0.35) (2.40,0.56) (2.50,0.79) (2.61,1.03) (2.72,1.29) (2.82,1.56)};
\fill (-0.70,0) circle (1.6pt);
\node[below left] at (-0.70,-0.05) {\small $-1$};
\fill (2.10,0) circle (1.6pt);
\node[below right] at (2.10,-0.05) {\small $3$};
\node at (-1.19,0.28) {\small $+$};
\node at (0.70,-0.30) {\small $-$};
\node at (2.59,0.28) {\small $+$};
\end{tikzpicture}
```

## Tabella riassuntiva (a > 0)

| Verso | $\Delta > 0$ | $\Delta = 0$ | $\Delta < 0$ |
|---|---|---|---|
| $> 0$ | $x < x_1$ oppure $x > x_2$ | $x \neq x_1$ | ogni $x$ |
| $\geq 0$ | $x \leq x_1$ oppure $x \geq x_2$ | ogni $x$ | ogni $x$ |
| $< 0$ | $x_1 < x < x_2$ | nessun $x$ | nessun $x$ |
| $\leq 0$ | $x_1 \leq x \leq x_2$ | $x = x_1$ | nessun $x$ |

"Ogni $x$": $S = \mathbb{R}$. "Nessun $x$": $S = \emptyset$.

## Come si risolve

1. Porta tutto a primo membro: forma normale confrontata con $0$.
2. Se $a < 0$, moltiplica per $-1$ e cambia il verso.
3. Calcola $\Delta$ e, se non è negativo, $x_1$ e $x_2$.
4. Disegna la parabola: concavità verso l'alto, punti sull'asse $x$.
5. Verso $>$: sopra l'asse; verso $<$: sotto. Con $\geq$ e $\leq$ aggiungi i punti sull'asse.

$$
\begin{gathered}
x^2 - x - 6 \leq 0 \\
x_1 = -2, \quad x_2 = 3 \\
S = [-2, 3]
\end{gathered}
$$

## Metodo della scomposizione

$$
\begin{aligned}
&ax^2 + bx + c \\
&= a(x - x_1)(x - x_2)
\end{aligned}
$$

Poi la tabella dei segni: $x^2 - x - 6 \leq 0$ diventa $(x + 2)(x - 3) \leq 0$.

## Casi particolari

- $\Delta = 0$, con $(x - 3)^2$: $> 0$ per $x \neq 3$; $\geq 0$ per ogni $x$; $< 0$ mai; $\leq 0$ solo per $x = 3$.
- $\Delta < 0$ e $a > 0$: versi $>$ e $\geq$ sempre verificati, versi $<$ e $\leq$ impossibili.
- Pura: $x^2 < 9$ dà $-3 < x < 3$; $x^2 > 9$ dà $x < -3$ oppure $x > 3$.
- Spuria: $x^2 > 3x$ diventa $x(x - 3) > 0$, e dà $x < 0$ oppure $x > 3$.

```ad-warning
Cambiare i segni senza cambiare il verso
Moltiplicando per $-1$ si cambia anche il verso: $-x^2 + 4x - 3 \geq 0$ diventa $x^2 - 4x + 3 \leq 0$.
```

```ad-warning
Delta negativo non vuol dire impossibile
$x^2 - 2x + 3 > 0$ ha $\Delta < 0$ ed è vera per ogni $x$.
```

```ad-warning
Dividere per x
Da $x^2 > 3x$ non si passa a $x > 3$: si porta tutto a primo membro e si raccoglie, $x(x - 3) > 0$.
```
