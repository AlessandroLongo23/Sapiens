# Prova del piano nelle lezioni

Pagina di prova: i quattro pezzi del blocco `grafico`.

## Una famiglia in una figura

Le parabole $y = ax^2$ hanno tutte il vertice nell'origine. Il coefficiente $a$ decide la concavità e l'apertura.

```tikz
% nome: parabole-y-uguale-a-x-quadro
% alt: Quattro parabole con il vertice nell'origine: y = 2x al quadrato, più stretta, y = x al quadrato, y = un mezzo x al quadrato, più larga, tutte con la concavità verso l'alto, e y = -x al quadrato, con la concavità verso il basso
% svg: parabole-y-uguale-a-x-quadro-6a646321.svg 202x256
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-3,-4.5) grid (3,4.5);
\draw[->] (-3.3,0) -- (3.4,0) node[right] {$x$};
\draw[->] (0,-4.8) -- (0,5.2) node[above] {$y$};
\foreach \x in {-2,-1,1,2} \node[below] at (\x,0) {\small $\x$};
\draw[thick, red!50, domain=-1.5:1.5, samples=40, smooth] plot (\x, {2*\x*\x});
\draw[thick, blue!60, domain=-2.1:2.1, samples=50, smooth] plot (\x, {\x*\x});
\draw[thick, teal!60, domain=-2.8:2.8, samples=60, smooth] plot (\x, {0.5*\x*\x});
\draw[thick, orange!70, domain=-2.1:2.1, samples=50, smooth] plot (\x, {-\x*\x});
\node[red!50!black, above] at (1.3,4.5) {$y = 2x^2$};
\node[blue!60!black, right] at (2.1,4.41) {$y = x^2$};
\node[teal!60!black, below right] at (2.8,3.92) {$y = \frac{1}{2}x^2$};
\node[orange!70!black, right] at (2,-4) {$y = -x^2$};
\end{tikzpicture}
```
```grafico
% nome: parabola-coefficiente-a
% alt: La parabola y = ax² con il cursore del coefficiente a, e la parabola y = x² tratteggiata per confronto
curva: y=ax^2
curva: y=x^2 | tratteggiata | grigio
cursore: a = 2 da -3 a 3 passo 0,1
finestra: x da -5 a 5, y da -4 a 6
domanda: Porta $a$ sotto zero: cosa fa la parabola? E quando $a$ si avvicina a $0$?
```

## Un valore che segue i cursori

```tikz
% nome: parabola-vertice-asse-x-quadro-meno-4x-piu-3
% alt: La parabola y = x al quadrato meno 4x più 3 con il vertice V in (2, -1), l'asse di simmetria x = 2 tratteggiato e i punti C (0, 3) e D (4, 3), simmetrici rispetto all'asse
% svg: parabola-vertice-asse-x-quadro-meno-4x-piu-3-f3f43624.svg 162x195
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-1,-1.5) grid (5,6);
\draw[->] (-1.3,0) -- (5.5,0) node[right] {$x$};
\draw[->] (0,-1.8) -- (0,6.5) node[above] {$y$};
\foreach \x in {1,2,3,4} \node[below] at (\x,0) {\small $\x$};
\node[left] at (0,3) {\small $3$};
\draw[dashed, gray] (2,-1.5) -- (2,6) node[above] {$x = 2$};
\draw[thick, blue!60, domain=-0.6:4.6, samples=60, smooth] plot (\x, {\x*\x - 4*\x + 3});
\foreach \x/\y in {0/3, 4/3, 2/-1} \fill (\x,\y) circle (0.12);
\node[above right] at (0,3) {$C$};
\node[above left] at (4,3) {$D$};
\node[below right] at (2,-1) {$V$};
\end{tikzpicture}
```
```grafico
% nome: parabola-vertice-discriminante
% alt: La parabola y = ax² + bx + c con i cursori dei tre coefficienti, il discriminante e le coordinate del vertice
curva: f(x)=ax^2+bx+c | nome
curva: V=\left(-\frac{b}{2a};c-\frac{b^2}{4a}\right)
cursore: a = 1 da -3 a 3 passo 0,1
cursore: b = -4 da -6 a 6 passo 0,1
cursore: c = 3 da -6 a 6 passo 0,1
finestra: x da -6 a 8, y da -5 a 7
valore: \Delta = b^2-4ac
valore: V = \left(-\frac{b}{2a};c-\frac{b^2}{4a}\right)
domanda: Muovi $c$ finché $\Delta = 0$: dove sta il vertice?
```

## Una scelta tra formule

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
```grafico
% nome: disequazione-secondo-grado-verso
% alt: La parabola y = x² - 2x + c con la parte di piano dove vale la disequazione scelta, tra maggiore, maggiore o uguale, minore e minore o uguale di zero
curva: y=x^2-2x+c
scelta: > 0 :: x^2-2x+c>0
scelta: \ge 0 :: x^2-2x+c\ge0
scelta: < 0 :: x^2-2x+c<0
scelta: \le 0 :: x^2-2x+c\le0
cursore: c = -3 da -5 a 5 passo 0,1
finestra: x da -5 a 7, y da -5 a 7
valore: \Delta = 4-4c
domanda: Con $c = 1$ il discriminante è zero: per quali $x$ vale ciascun verso?
```

## Un cursore che si muove da solo, senza copertina

Nel fascio proprio di centro $C(2; 1)$ ogni retta ha un suo coefficiente angolare $m$.

```grafico
% nome: fascio-proprio-centro
% alt: Il fascio proprio di rette di centro C(2; 1): la retta y - 1 = m(x - 2) ruota intorno a C al variare di m
curva: y-1=m\left(x-2\right)
curva: C=\left(2;1\right) | nero
cursore: m = 1 da -5 a 5 passo 0,1 anima
finestra: x da -4 a 8, y da -4 a 6
domanda: Quale retta del fascio non si ottiene per nessun valore di $m$?
```

## Retta e parabola

```tikz
% nome: sistema-retta-parabola-secante
% alt: La parabola y uguale a x al quadrato meno 2x meno 3 e la retta y uguale a x meno 3, che la taglia in due punti, 0, meno 3 e 3, 0
% svg: sistema-retta-parabola-secante-1c2cd7fe.svg 179x144
\begin{tikzpicture}
\draw[black!70, ->] (-1.14,0) -- (2.46,0) node[right] {$x$};
\draw[black!70, ->] (0,-2.18) -- (0,1.09) node[above] {$y$};
\draw[thick, blue!60] plot[smooth] coordinates {(-0.96,0.91) (-0.90,0.74) (-0.84,0.57) (-0.77,0.41) (-0.71,0.25) (-0.65,0.11) (-0.59,-0.03) (-0.52,-0.16) (-0.46,-0.29) (-0.40,-0.41) (-0.34,-0.52) (-0.27,-0.62) (-0.21,-0.72) (-0.15,-0.81) (-0.09,-0.89) (-0.02,-0.96) (0.04,-1.03) (0.10,-1.09) (0.16,-1.15) (0.23,-1.19) (0.29,-1.23) (0.35,-1.26) (0.41,-1.29) (0.48,-1.31) (0.54,-1.32) (0.60,-1.32) (0.66,-1.32) (0.72,-1.31) (0.79,-1.29) (0.85,-1.26) (0.91,-1.23) (0.97,-1.19) (1.04,-1.15) (1.10,-1.09) (1.16,-1.03) (1.22,-0.96) (1.29,-0.89) (1.35,-0.81) (1.41,-0.72) (1.47,-0.62) (1.54,-0.52) (1.60,-0.41) (1.66,-0.29) (1.72,-0.16) (1.79,-0.03) (1.85,0.11) (1.91,0.25) (1.97,0.41) (2.04,0.57) (2.10,0.74) (2.16,0.91)};
\draw[thick, red!50] (-0.96,-1.52) -- (2.16,0.20);
\fill (0.00,-0.99) circle (1.8pt);
\node[left] at (0.00,-0.99) {\small $(0, -3)$};
\fill (1.80,0.00) circle (1.8pt);
\node[above left] at (1.80,0.00) {\small $(3, 0)$};
\node[red!60!black, below] at (-0.96,-1.52) {\small $y=x-3$};
\end{tikzpicture}
```
```grafico
% nome: retta-parabola-posizioni
% alt: La parabola y = x² - 2x - 3 e la retta y = x + q: al variare di q la retta è secante, tangente o esterna
curva: y=x^2-2x-3
curva: y=x+q
cursore: q = -3 da -9 a 3 passo 0,1
finestra: x da -4 a 6, y da -7 a 5
valore: \Delta = 9+4\left(3+q\right)
```

## Due scale diverse e la finestra che si sposta

```grafico
% nome: moto-uniforme-spazio-tempo
% alt: Il grafico spazio-tempo del moto rettilineo uniforme, s = s0 + vt, con i cursori della posizione iniziale e della velocità
curva: s_0+vx
cursore: s_0 = 10 da 0 a 40 passo 5
cursore: v = 6 da -8 a 12 passo 0,1
finestra: x da -1 a 11, y da -10 a 110
forma: 3:2
assi: t (s), s (m)
sposta: sì
```

Fine della prova.
