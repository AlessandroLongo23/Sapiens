# La parabola

Se lanci una palla in avanti e trascuri la resistenza dell'aria, la palla sale, rallenta, arriva al punto più alto e ridiscende lungo una curva simmetrica: la stessa curva che disegna il getto d'acqua di una fontana. Quella curva è una parabola, il grafico delle funzioni di secondo grado $y = ax^2 + bx + c$. Saperla disegnare ti serve subito dopo, per le [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado), che si risolvono guardando dove la parabola sta sopra o sotto l'asse $x$.

Per seguire la lezione ti servono le coordinate del [piano cartesiano](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio) e la formula risolutiva delle [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado).

## La parabola y = x²

Per disegnare il grafico di $y = x^2$ calcola qualche valore, come nella lezione [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione):

| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|
| $y$ | $4$ | $1$ | $0$ | $1$ | $4$ |

Due numeri opposti hanno lo stesso quadrato, quindi i punti sono a due a due alla stessa altezza, uno a destra e uno a sinistra dell'asse $y$: $(-2, 4)$ e $(2, 4)$, $(-1, 1)$ e $(1, 1)$. Un quadrato non è mai negativo, quindi nessun punto sta sotto l'asse $x$, e il punto più basso è l'origine.

```tikz
% nome: parabola-y-uguale-x-quadro
% alt: La parabola y = x al quadrato con i punti (-3, 9), (-2, 4), (-1, 1), (0, 0), (1, 1), (2, 4) e (3, 9): è simmetrica rispetto all'asse y e ha il vertice V nell'origine
% svg: parabola-y-uguale-x-quadro-1f5612ee.svg 256x214
\begin{tikzpicture}[xscale=0.8, yscale=0.45]
\draw[gray!25, very thin] (-3.5,-0.5) grid (3.5,9.5);
\draw[->] (-3.8,0) -- (4,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,10.2) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {1,4,9} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60, domain=-3.15:3.15, samples=60, smooth] plot (\x, {\x*\x});
\foreach \x/\y in {-3/9, -2/4, -1/1, 1/1, 2/4, 3/9} \fill (\x,\y) ellipse (0.1 and 0.18);
\fill (0,0) ellipse (0.1 and 0.18);
\node at (0.35,-0.6) {$V$};
\end{tikzpicture}
```

Il grafico di una funzione $y = ax^2 + bx + c$, con $a \neq 0$, si chiama **parabola**. Ogni parabola ha un punto in cui smette di scendere e comincia a salire (o il contrario): è il **vertice**, indicato con $V$. La retta verticale che passa per il vertice divide la parabola in due metà che si sovrappongono piegando il foglio lungo la retta: è l'**asse di simmetria** della parabola. Per $y = x^2$ il vertice è l'origine, $V(0, 0)$, e l'asse di simmetria è l'asse $y$.

## La parabola y = ax²

Nella parabola $y = ax^2$ ogni ordinata è quella di $y = x^2$ moltiplicata per $a$. Con $a = 2$ il punto di ascissa $1$ sale da $1$ a $2$ e quello di ascissa $2$ da $4$ a $8$: la parabola sale più in fretta e risulta più stretta. Con $a = \dfrac{1}{2}$ le ordinate si dimezzano e la parabola è più larga. Con $a = -1$ ogni ordinata cambia segno, e la parabola si ribalta sotto l'asse $x$. È la proporzionalità quadratica della lezione [Proporzionalità diretta e inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa), disegnata anche per $x$ negativo.

Il segno di $a$ decide la **concavità** della parabola:

- se $a > 0$, la parabola ha la concavità verso l'alto: i due rami salgono e il vertice è il punto più basso;
- se $a < 0$, la parabola ha la concavità verso il basso: i due rami scendono e il vertice è il punto più alto.

Il valore assoluto $|a|$ decide l'**apertura**: più $|a|$ è grande, più la parabola è stretta; più $|a|$ è vicino a zero, più è larga.

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
% nome: parabola-coefficiente-a-cursore
% alt: La parabola y = ax² con il cursore del coefficiente a, da -3 a 3, e la parabola y = x² tratteggiata per confronto: con a positivo la concavità è verso l'alto, con a negativo verso il basso, e più a è lontano da zero più la parabola è stretta
curva: y=ax^2
curva: y=x^2 | tratteggiata | grigio
cursore: a = 2 da -3 a 3 passo 0,1
finestra: x da -4 a 4, y da -5 a 5
domanda: Porta $a$ sotto zero: cosa fa la parabola? E che cosa diventa quando $a$ arriva a $0$?
```

```ad-warning
L'apertura dipende dal valore assoluto
La parabola $y = -3x^2$ è più stretta di $y = x^2$, anche se $-3 < 1$: l'apertura si confronta con $|-3| = 3$ e $|1| = 1$. Il segno di $a$ dice soltanto se la concavità è verso l'alto o verso il basso.
```

## La parabola y = ax² + c

Nella parabola $y = ax^2 + c$ a ogni ordinata di $y = ax^2$ si aggiunge lo stesso numero $c$: tutta la parabola si sposta in su di $c$ se $c$ è positivo, in giù se $c$ è negativo. La forma resta la stessa, l'asse di simmetria resta l'asse $y$ e il vertice diventa $V(0, c)$.

```tikz
% nome: parabola-y-uguale-x-quadro-meno-3
% alt: La parabola y = x al quadrato, tratteggiata, e la parabola y = x al quadrato meno 3, la stessa curva spostata in giù di 3, con il vertice V in (0, -3)
% svg: parabola-y-uguale-x-quadro-meno-3-e7a4f439.svg 199x226
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-3,-3.5) grid (3,5.5);
\draw[->] (-3.3,0) -- (3.5,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,6) node[above] {$y$};
\foreach \x in {-2,-1,1,2} \node[below] at (\x,0) {\small $\x$};
\node[left] at (0,-3) {\small $-3$};
\draw[thick, dashed, gray, domain=-2.3:2.3, samples=50, smooth] plot (\x, {\x*\x});
\draw[thick, blue!60, domain=-2.8:2.8, samples=60, smooth] plot (\x, {\x*\x - 3});
\draw[->, gray] (2,4) -- (2,1.15);
\draw[->, gray] (-2,4) -- (-2,1.15);
\fill (0,-3) circle (0.12);
\node[below right] at (0,-3) {$V$};
\node[gray, above] at (-2.3,5.3) {$y = x^2$};
\node[blue!60!black, right] at (2.6,4.2) {$y = x^2 - 3$};
\end{tikzpicture}
```
```grafico
% nome: parabola-a-c-cursori
% alt: La parabola y = ax² + c con i cursori di a e di c, e la parabola y = x² tratteggiata per confronto: cambiando c la parabola sale o scende e il vertice V resta sull'asse y, nel punto (0, c)
curva: y=ax^2+c
curva: y=x^2 | tratteggiata | grigio
curva: V=\left(0;c\right) | nero
cursore: a = 1 da -3 a 3 passo 0,1
cursore: c = -3 da -5 a 5 passo 0,1
finestra: x da -4 a 4, y da -5 a 5
valore: V = \left(0;c\right)
domanda: Muovi $c$: il vertice lascia mai l'asse $y$?
```

```ad-warning
In su o in giù, non a destra o a sinistra
$y = x^2 - 3$ è la parabola $y = x^2$ spostata in giù di $3$, con il vertice in $(0, -3)$. Non è spostata a destra di $3$: il termine $c$ cambia le ordinate, e l'asse di simmetria resta l'asse $y$.
```

```ad-example
Esempio 1: una parabola larga, spostata in giù
Disegna la parabola $y = \dfrac{1}{2}x^2 - 2$.

Il coefficiente $a = \dfrac{1}{2}$ è positivo, quindi la concavità è verso l'alto, e la parabola è più larga di $y = x^2$. Il vertice è $V(0, -2)$ e l'asse di simmetria è l'asse $y$. Calcola le ordinate per due coppie di ascisse opposte:

$$
\begin{gathered}
x = \pm 2: \ y = \frac{1}{2} \cdot 4 - 2 = 0 \\
x = \pm 4: \ y = \frac{1}{2} \cdot 16 - 2 = 6
\end{gathered}
$$

La parabola passa per $A(-2, 0)$ e $B(2, 0)$, sull'asse $x$, e per $(-4, 6)$ e $(4, 6)$.

```tikz
% nome: parabola-un-mezzo-x-quadro-meno-2
% alt: La parabola y = un mezzo x al quadrato meno 2, con la concavità verso l'alto, il vertice V in (0, -2), i punti A (-2, 0) e B (2, 0) sull'asse x e i punti (-4, 6) e (4, 6)
% svg: parabola-un-mezzo-x-quadro-meno-2-ceb1373a.svg 189x209
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-4.5,-2.5) grid (4.5,7.5);
\draw[->] (-4.8,0) -- (5.1,0) node[right] {$x$};
\draw[->] (0,-2.8) -- (0,8) node[above] {$y$};
\foreach \x in {-4,4} \node[below] at (\x,0) {\small $\x$};
\node[left] at (0,6) {\small $6$};
\draw[thick, blue!60, domain=-4.3:4.3, samples=60, smooth] plot (\x, {0.5*\x*\x - 2});
\foreach \x/\y in {-4/6, 4/6, -2/0, 2/0, 0/-2} \fill (\x,\y) circle (0.15);
\node[above left] at (-2,0) {$A$};
\node[above right] at (2,0) {$B$};
\node[below right] at (0,-2) {$V$};
\end{tikzpicture}
```
```

## La parabola y = ax² + bx + c

### Vertice e asse di simmetria

Quando $b \neq 0$ il vertice non sta più sull'asse $y$. La sua ascissa si trova con la formula

$$x_V = -\frac{b}{2a}$$

e la sua ordinata $y_V$ si trova sostituendo $x_V$ al posto di $x$ nell'equazione della parabola. L'asse di simmetria è la retta verticale che passa per il vertice, formata da tutti i punti che hanno ascissa $x_V$: la sua equazione è $x = x_V$, come nella lezione [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari). Con $b = 0$ la formula dà $x_V = 0$, e ritrovi il vertice $V(0, c)$ della sezione precedente.

```ad-note
Da dove viene la formula del vertice
Cerca i punti della parabola che hanno la stessa ordinata del punto sull'asse $y$, cioè $y = c$:

$$
\begin{gathered}
ax^2 + bx + c = c \\
\Rightarrow ax^2 + bx = 0 \\
\Rightarrow x(ax + b) = 0
\end{gathered}
$$

È un'equazione spuria, come nella lezione [Equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado): le soluzioni sono $x = 0$ e $x = -\dfrac{b}{a}$. Due punti della parabola alla stessa altezza sono simmetrici rispetto all'asse, quindi l'asse passa a metà strada tra le loro ascisse: $x_V = \dfrac{1}{2}\Big(0 - \dfrac{b}{a}\Big) = -\dfrac{b}{2a}$.
```

```ad-example
Esempio 2: il vertice e l'asse
Trova il vertice e l'asse di simmetria della parabola $y = x^2 - 4x + 3$.

I coefficienti sono $a = 1$, $b = -4$, $c = 3$. L'ascissa del vertice è

$$x_V = -\frac{-4}{2 \cdot 1} = \frac{4}{2} = 2$$

Sostituisci $x = 2$ nell'equazione:

$$
\begin{aligned}
y_V &= 2^2 - 4 \cdot 2 + 3 \\
&= 4 - 8 + 3 = -1
\end{aligned}
$$

Il vertice è $V(2, -1)$ e l'asse di simmetria è la retta $x = 2$. La concavità è verso l'alto, perché $a = 1 > 0$, quindi $V$ è il punto più basso. Il punto $C(0, 3)$ della parabola e il punto $D(4, 3)$ sono simmetrici rispetto all'asse: infatti $4^2 - 4 \cdot 4 + 3 = 3$.

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
% nome: parabola-vertice-asse-cursori
% alt: La parabola y = ax² + bx + c con i cursori dei tre coefficienti, il vertice V e l'asse di simmetria tratteggiato: sotto il piano sono scritte l'ascissa del vertice, -b/2a, e le sue coordinate, che cambiano con i cursori
curva: y=ax^2+bx+c
curva: x=-\frac{b}{2a} | tratteggiata | grigio
curva: V=\left(-\frac{b}{2a};c-\frac{b^2}{4a}\right) | nero
cursore: a = 1 da -3 a 3 passo 0,1
cursore: b = -4 da -6 a 6 passo 0,1
cursore: c = 3 da -6 a 6 passo 0,1
finestra: x da -4 a 8, y da -5 a 7
valore: x_V = -\frac{b}{2a}
valore: V = \left(-\frac{b}{2a};c-\frac{b^2}{4a}\right)
domanda: Cambia solo $c$: l'asse di simmetria si sposta? E cambiando solo $b$?
```
```

```ad-warning
Il segno nella formula del vertice
Nella formula $x_V = -\dfrac{b}{2a}$ il segno meno si applica a $b$ con il suo segno. Con $b = -4$ e $a = 1$ ottieni $x_V = \dfrac{4}{2} = 2$, non $-2$. Con $a$ negativo è negativo anche il denominatore: per $y = -x^2 + 6x$ hai $x_V = -\dfrac{6}{-2} = 3$.
```

```ad-tip
Un controllo per l'ordinata del vertice
L'ordinata del vertice si può calcolare anche con il discriminante $\Delta = b^2 - 4ac$:

$$y_V = -\frac{\Delta}{4a}$$

Per $y = x^2 - 4x + 3$ hai $\Delta = 16 - 12 = 4$ e $y_V = -\dfrac{4}{4} = -1$, lo stesso valore trovato sostituendo.
```

### Un punto sulla parabola

Un punto appartiene alla parabola se le sue coordinate rendono vera l'equazione. Il punto $(3, 0)$ appartiene a $y = x^2 - 4x + 3$, perché $3^2 - 4 \cdot 3 + 3 = 0$; il punto $(1, 2)$ no, perché $1 - 4 + 3 = 0$ e non $2$.

## Intersezioni con gli assi

### Con l'asse y

I punti dell'asse $y$ hanno ascissa $0$. Sostituendo $x = 0$ in $y = ax^2 + bx + c$ restano solo $c$: ogni parabola incontra l'asse $y$ in un solo punto, $(0, c)$. Se $c = 0$ la parabola passa per l'origine, come $y = 3x^2 - 2x$.

```ad-warning
Il punto sull'asse y
La parabola $y = x^2 - 4x + 3$ incontra l'asse $y$ in $(0, 3)$, non in $(3, 0)$: sull'asse $y$ è l'ascissa a valere zero, e $c$ è l'ordinata.
```

### Con l'asse x

I punti dell'asse $x$ hanno ordinata $0$. Per trovare dove la parabola incontra l'asse $x$ metti $y = 0$ e risolvi l'**equazione associata**

$$ax^2 + bx + c = 0$$

Le sue soluzioni sono le ascisse dei punti di intersezione, e il discriminante $\Delta$ dice quanti sono, come nella lezione [Equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado).

| Discriminante | Punti sull'asse $x$ | La parabola |
|---|---|---|
| $\Delta > 0$ | due, $(x_1, 0)$ e $(x_2, 0)$ | taglia l'asse $x$ |
| $\Delta = 0$ | uno, il vertice | è tangente all'asse $x$ |
| $\Delta < 0$ | nessuno | sta tutta sopra o tutta sotto l'asse $x$ |

Con $\Delta = 0$ la parabola tocca l'asse $x$ in un solo punto, il vertice, senza attraversarlo: si dice che è **tangente** all'asse $x$. Con $\Delta < 0$ la posizione dipende dalla concavità: una parabola con $a > 0$ ha il vertice sopra l'asse $x$ e sta tutta sopra, una con $a < 0$ ha il vertice sotto l'asse e sta tutta sotto.

```tikz
% nome: parabola-casi-discriminante
% alt: Sei parabole: nella prima riga con la concavità verso l'alto, nella seconda verso il basso; nella colonna di sinistra con discriminante positivo tagliano l'asse x in due punti, in quella centrale con discriminante nullo sono tangenti all'asse x nel vertice, in quella di destra con discriminante negativo non lo incontrano
% svg: parabola-casi-discriminante-ff447c2c.svg 323x257
\begin{tikzpicture}[scale=0.62]
\begin{scope}[shift={(0.0,0)}]
\draw[->] (-1.1,0) -- (2.1,0) node[right] {\small $x$};
\draw[->] (0,-1.3) -- (0,2.6);
\draw[thick, blue!60, domain=-0.95:1.75, samples=40, smooth] plot (\x, {(\x-0.4)*(\x-0.4) + -1});
\fill (-0.6,0) circle (0.09);
\fill (1.4,0) circle (0.09);
\end{scope}
\begin{scope}[shift={(0.0,-4.6)}]
\draw[->] (-1.1,0) -- (2.1,0) node[right] {\small $x$};
\draw[->] (0,-2.6) -- (0,1.3);
\draw[thick, orange!70, domain=-0.95:1.75, samples=40, smooth] plot (\x, {-(\x-0.4)*(\x-0.4) - -1});
\fill (-0.6,0) circle (0.09);
\fill (1.4,0) circle (0.09);
\node at (0.5,-3.2) {$\Delta > 0$};
\end{scope}
\begin{scope}[shift={(3.9,0)}]
\draw[->] (-1.1,0) -- (2.1,0) node[right] {\small $x$};
\draw[->] (0,-1.3) -- (0,2.6);
\draw[thick, blue!60, domain=-0.95:1.75, samples=40, smooth] plot (\x, {(\x-0.4)*(\x-0.4) + 0});
\fill (0.4,0) circle (0.09);
\end{scope}
\begin{scope}[shift={(3.9,-4.6)}]
\draw[->] (-1.1,0) -- (2.1,0) node[right] {\small $x$};
\draw[->] (0,-2.6) -- (0,1.3);
\draw[thick, orange!70, domain=-0.95:1.75, samples=40, smooth] plot (\x, {-(\x-0.4)*(\x-0.4) - 0});
\fill (0.4,0) circle (0.09);
\node at (0.5,-3.2) {$\Delta = 0$};
\end{scope}
\begin{scope}[shift={(7.8,0)}]
\draw[->] (-1.1,0) -- (2.1,0) node[right] {\small $x$};
\draw[->] (0,-1.3) -- (0,2.6);
\draw[thick, blue!60, domain=-0.95:1.75, samples=40, smooth] plot (\x, {(\x-0.4)*(\x-0.4) + 0.7});
\end{scope}
\begin{scope}[shift={(7.8,-4.6)}]
\draw[->] (-1.1,0) -- (2.1,0) node[right] {\small $x$};
\draw[->] (0,-2.6) -- (0,1.3);
\draw[thick, orange!70, domain=-0.95:1.75, samples=40, smooth] plot (\x, {-(\x-0.4)*(\x-0.4) - 0.7});
\node at (0.5,-3.2) {$\Delta < 0$};
\end{scope}
\node[left] at (-1.3,0.7) {$a > 0$};
\node[left] at (-1.3,-5.3) {$a < 0$};
\end{tikzpicture}
```

Prova a passare da un caso all'altro: i punti segnati sull'asse $x$ sono le soluzioni dell'equazione associata.

```grafico
% nome: parabola-discriminante-cursori
% alt: La parabola y = ax² + bx + c con i cursori dei tre coefficienti e il valore del discriminante: con il discriminante positivo taglia l'asse x in due punti, con il discriminante nullo lo tocca nel vertice, con il discriminante negativo non lo incontra
curva: y=ax^2+bx+c
cursore: a = 1 da -3 a 3 passo 0,1
cursore: b = -2 da -6 a 6 passo 0,1
cursore: c = -3 da -6 a 6 passo 0,1
finestra: x da -5 a 7, y da -6 a 6
valore: \Delta = b^2-4ac
domanda: Alza $c$ finché $\Delta = 0$: dove tocca l'asse $x$ la parabola? Poi rendi $\Delta$ negativo.
```

```ad-warning
Discriminante negativo non vuol dire "niente parabola"
Con $\Delta < 0$ l'equazione associata non ha soluzioni, ma la parabola c'è, ha il suo vertice e si disegna come le altre, solo che non incontra l'asse $x$. Anche il vertice si calcola sempre, qualunque sia il segno di $\Delta$.
```

```ad-tip
Il vertice sta a metà
Quando $\Delta > 0$, l'asse di simmetria passa a metà tra le due intersezioni con l'asse $x$: $x_V = \dfrac{x_1 + x_2}{2}$. Per $y = x^2 - 4x + 3$ le soluzioni di $x^2 - 4x + 3 = 0$ sono $1$ e $3$, e $x_V = 2$. È un modo veloce per controllare i conti, e viene dalla somma delle soluzioni $x_1 + x_2 = -\dfrac{b}{a}$ della lezione [Relazioni tra soluzioni e coefficienti](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/relazioni-tra-soluzioni-e-coefficienti).
```

## Come si disegna una parabola

1. Guarda il segno di $a$: concavità verso l'alto se $a > 0$, verso il basso se $a < 0$.
2. Calcola il vertice, $x_V = -\dfrac{b}{2a}$ e $y_V$ sostituendo, e disegna l'asse di simmetria $x = x_V$ tratteggiato.
3. Segna l'intersezione con l'asse $y$, $(0, c)$, e il suo simmetrico rispetto all'asse, alla stessa altezza dall'altra parte.
4. Calcola $\Delta$: se non è negativo, risolvi l'equazione associata e segna le intersezioni con l'asse $x$.
5. Se i punti sono pochi o troppo vicini al vertice, calcola le ordinate di un'altra coppia di punti simmetrici.
6. Unisci i punti con una curva morbida, simmetrica rispetto all'asse, arrotondata nel vertice.

```ad-warning
La punta nel vertice
Il vertice non è uno spigolo: la parabola ci passa con una curva arrotondata, e non a forma di V. E i rami, allontanandosi dal vertice, continuano ad allargarsi: non si richiudono verso l'asse e non diventano segmenti dritti.
```

## Esempi svolti

### Concavità verso l'alto o verso il basso

```ad-example
Esempio 3: due intersezioni con l'asse x
Disegna la parabola $y = x^2 - 2x - 3$.

Qui $a = 1$, $b = -2$, $c = -3$. La concavità è verso l'alto. Il vertice:

$$
\begin{gathered}
x_V = -\frac{-2}{2} = 1 \\
y_V = 1 - 2 - 3 = -4
\end{gathered}
$$

Quindi $V(1, -4)$ e l'asse è $x = 1$. L'asse $y$ è incontrato in $C(0, -3)$; il simmetrico di $C$ rispetto alla retta $x = 1$ è $D(2, -3)$. Per l'asse $x$:

$$
\begin{aligned}
\Delta &= (-2)^2 - 4 \cdot (-3) \\
&= 4 + 12 = 16
\end{aligned}
$$

$$x_{1,2} = \frac{2 \pm 4}{2}$$

Le soluzioni sono $x_1 = -1$ e $x_2 = 3$: la parabola taglia l'asse $x$ in $A(-1, 0)$ e $B(3, 0)$. Il vertice ha ascissa $1$, a metà tra $-1$ e $3$.

```tikz
% nome: parabola-x-quadro-meno-2x-meno-3
% alt: La parabola y = x al quadrato meno 2x meno 3, con la concavità verso l'alto, il vertice V in (1, -4), l'asse x = 1 tratteggiato, le intersezioni A (-1, 0) e B (3, 0) con l'asse x, C (0, -3) con l'asse y e il simmetrico D (2, -3)
% svg: parabola-x-quadro-meno-2x-meno-3-a3e2833a.svg 162x195
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-2,-4.5) grid (4,3);
\draw[->] (-2.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-4.8) -- (0,3.5) node[above] {$y$};
\foreach \x in {1,2} \node[below right] at (\x,0) {\small $\x$};
\draw[dashed, gray] (1,-4.5) -- (1,3);
\draw[thick, blue!60, domain=-1.6:3.6, samples=60, smooth] plot (\x, {\x*\x - 2*\x - 3});
\foreach \x/\y in {-1/0, 3/0, 0/-3, 2/-3, 1/-4} \fill (\x,\y) circle (0.12);
\node[above left] at (-1,0) {$A$};
\node[above right] at (3,0) {$B$};
\node[left] at (0,-3) {$C$};
\node[right] at (2,-3) {$D$};
\node[below right] at (1,-4) {$V$};
\end{tikzpicture}
```
```

```ad-example
Esempio 4: concavità verso il basso
Disegna la parabola $y = -x^2 - 2x + 3$.

Qui $a = -1$, $b = -2$, $c = 3$. La concavità è verso il basso, quindi il vertice è il punto più alto. Nella formula il denominatore $2a$ è negativo:

$$x_V = -\frac{-2}{2 \cdot (-1)} = \frac{2}{-2} = -1$$

Per l'ordinata sostituisci $x = -1$, con le parentesi:

$$
\begin{aligned}
y_V &= -(-1)^2 - 2 \cdot (-1) + 3 \\
&= -1 + 2 + 3 = 4
\end{aligned}
$$

Quindi $V(-1, 4)$ e l'asse è $x = -1$. L'asse $y$ è incontrato in $C(0, 3)$, e il simmetrico di $C$ è $D(-2, 3)$. Per l'asse $x$ risolvi $-x^2 - 2x + 3 = 0$, che moltiplicata per $-1$ diventa $x^2 + 2x - 3 = 0$:

$$
\begin{gathered}
\Delta = 4 + 12 = 16 \\
x_{1,2} = \frac{-2 \pm 4}{2}
\end{gathered}
$$

Le soluzioni sono $x_1 = -3$ e $x_2 = 1$: la parabola taglia l'asse $x$ in $A(-3, 0)$ e $B(1, 0)$.

```tikz
% nome: parabola-meno-x-quadro-meno-2x-piu-3
% alt: La parabola y = -x al quadrato meno 2x più 3, con la concavità verso il basso, il vertice V in (-1, 4), l'asse x = -1 tratteggiato, le intersezioni A (-3, 0) e B (1, 0) con l'asse x, C (0, 3) con l'asse y e il simmetrico D (-2, 3)
% svg: parabola-meno-x-quadro-meno-2x-piu-3-abb09944.svg 162x194
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-4,-3) grid (2,4.5);
\draw[->] (-4.3,0) -- (2.5,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,5) node[above] {$y$};
\foreach \x in {-2,-1} \node[below left] at (\x,0) {\small $\x$};
\draw[dashed, gray] (-1,-3) -- (-1,4.5);
\draw[thick, orange!70, domain=-3.6:1.6, samples=60, smooth] plot (\x, {-\x*\x - 2*\x + 3});
\foreach \x/\y in {-3/0, 1/0, 0/3, -2/3, -1/4} \fill (\x,\y) circle (0.12);
\node[above left] at (-3,0) {$A$};
\node[above right] at (1,0) {$B$};
\node[right] at (0,3) {$C$};
\node[left] at (-2,3) {$D$};
\node[above right] at (-1,4) {$V$};
\end{tikzpicture}
```
```

```ad-warning
Il meno davanti a x²
In $y = -x^2 - 2x + 3$ il meno si applica al quadrato: per $x = -1$ il primo termine vale $-(-1)^2 = -1$, non $+1$. Se calcoli $(-1)^2 = 1$ e dimentichi il meno davanti, l'ordinata del vertice viene $6$ invece di $4$.
```

### Discriminante nullo o negativo

```ad-example
Esempio 5: parabola tangente all'asse x
Disegna la parabola $y = x^2 + 4x + 4$.

Qui $a = 1$, $b = 4$, $c = 4$, e la concavità è verso l'alto.

$$
\begin{gathered}
x_V = -\frac{4}{2} = -2 \\
y_V = 4 - 8 + 4 = 0
\end{gathered}
$$

Il vertice è $V(-2, 0)$ e sta sull'asse $x$. Il discriminante lo conferma: $\Delta = 16 - 16 = 0$, e l'equazione $x^2 + 4x + 4 = 0$ ha la sola soluzione doppia $x = -2$. La parabola è tangente all'asse $x$ nel vertice; infatti $x^2 + 4x + 4 = (x + 2)^2$. L'asse $y$ è incontrato in $C(0, 4)$, e il simmetrico di $C$ rispetto alla retta $x = -2$ è $D(-4, 4)$.

```tikz
% nome: parabola-tangente-asse-x
% alt: La parabola y = x al quadrato più 4x più 4, con la concavità verso l'alto e il vertice V in (-2, 0) sull'asse x, a cui è tangente; l'asse x = -2 tratteggiato, il punto C (0, 4) sull'asse y e il simmetrico D (-4, 4)
% svg: parabola-tangente-asse-x-cda1bf0e.svg 162x183
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-5,-1) grid (1,6);
\draw[->] (-5.3,0) -- (1.5,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,6.5) node[above] {$y$};
\foreach \x in {-4,-3} \node[below] at (\x,0) {\small $\x$};
\node[right] at (0,4) {\small $4$};
\draw[dashed, gray] (-2,-1) -- (-2,6);
\draw[thick, blue!60, domain=-4.4:0.4, samples=60, smooth] plot (\x, {\x*\x + 4*\x + 4});
\foreach \x/\y in {0/4, -4/4, -2/0} \fill (\x,\y) circle (0.12);
\node[above left] at (0,4) {$C$};
\node[above right] at (-4,4) {$D$};
\node[below right] at (-2,0) {$V$};
\end{tikzpicture}
```
```

```ad-example
Esempio 6: nessuna intersezione con l'asse x
Disegna la parabola $y = 2x^2 - 4x + 3$.

Qui $a = 2$, $b = -4$, $c = 3$: concavità verso l'alto, e la parabola è più stretta di $y = x^2$.

$$
\begin{gathered}
x_V = -\frac{-4}{2 \cdot 2} = 1 \\
y_V = 2 - 4 + 3 = 1
\end{gathered}
$$

Il vertice è $V(1, 1)$, sopra l'asse $x$. Il discriminante è negativo:

$$\Delta = 16 - 24 = -8$$

quindi la parabola non incontra l'asse $x$: ha la concavità verso l'alto e il vertice sopra l'asse, e sta tutta sopra. Per disegnarla usa l'intersezione con l'asse $y$, $C(0, 3)$, e il suo simmetrico rispetto alla retta $x = 1$, $D(2, 3)$.

```tikz
% nome: parabola-senza-intersezioni-asse-x
% alt: La parabola y = 2x al quadrato meno 4x più 3, con la concavità verso l'alto e il vertice V in (1, 1): sta tutta sopra l'asse x e passa per C (0, 3) e per il simmetrico D (2, 3)
% svg: parabola-senza-intersezioni-asse-x-b4c540e7.svg 120x162
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-1,-1) grid (3,5);
\draw[->] (-1.3,0) -- (3.5,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,5.5) node[above] {$y$};
\foreach \x in {1,2} \node[below] at (\x,0) {\small $\x$};
\node[left] at (0,1) {\small $1$};
\draw[dashed, gray] (1,-1) -- (1,5);
\draw[thick, blue!60, domain=-0.4:2.4, samples=60, smooth] plot (\x, {2*\x*\x - 4*\x + 3});
\foreach \x/\y in {0/3, 2/3, 1/1} \fill (\x,\y) circle (0.12);
\node[left] at (0,3) {$C$};
\node[right] at (2,3) {$D$};
\node[below right] at (1,1) {$V$};
\end{tikzpicture}
```
```

### Vertice con le frazioni

```ad-example
Esempio 7: vertice frazionario e intersezioni irrazionali
Disegna la parabola $y = x^2 - 3x + 1$.

Qui $a = 1$, $b = -3$, $c = 1$, e la concavità è verso l'alto. L'ascissa del vertice è una frazione, e va tenuta come frazione:

$$x_V = -\frac{-3}{2} = \frac{3}{2}$$

$$
\begin{aligned}
y_V &= \frac{9}{4} - \frac{9}{2} + 1 \\
&= \frac{9 - 18 + 4}{4} = -\frac{5}{4}
\end{aligned}
$$

Il vertice è $V\Big(\dfrac{3}{2}, -\dfrac{5}{4}\Big)$. Controllo con il discriminante: $\Delta = 9 - 4 = 5$ e $-\dfrac{\Delta}{4a} = -\dfrac{5}{4}$. Le intersezioni con l'asse $x$ hanno ascisse irrazionali:

$$x_{1,2} = \frac{3 \pm \sqrt{5}}{2}$$

Nella risposta si lasciano con il radicale. Per disegnarle usa i valori approssimati: con $\sqrt{5} \approx 2{,}24$ ottieni $x_1 \approx 0{,}38$ e $x_2 \approx 2{,}62$. L'asse $y$ è incontrato in $C(0, 1)$, e il simmetrico di $C$ rispetto alla retta $x = \dfrac{3}{2}$ è $D(3, 1)$.

```tikz
% nome: parabola-vertice-frazionario
% alt: La parabola y = x al quadrato meno 3x più 1, con il vertice V in (3/2, -5/4), l'asse x = 3/2 tratteggiato, le intersezioni A e B con l'asse x vicino a 0,38 e 2,62, il punto C (0, 1) sull'asse y e il simmetrico D (3, 1)
% svg: parabola-vertice-frazionario-90217074.svg 152x175
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-1,-2) grid (4,4);
\draw[->] (-1.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,4.5) node[above] {$y$};
\foreach \x in {1,2,3} \node[below] at (\x,0) {\small $\x$};
\draw[dashed, gray] (1.5,-2) -- (1.5,4);
\draw[thick, blue!60, domain=-0.6:3.6, samples=60, smooth] plot (\x, {\x*\x - 3*\x + 1});
\foreach \x/\y in {0/1, 3/1, 1.5/-1.25, 0.382/0, 2.618/0} \fill (\x,\y) circle (0.11);
\node[above right] at (0.382,0) {$A$};
\node[above left] at (2.618,0) {$B$};
\node[left] at (0,1) {$C$};
\node[right] at (3,1) {$D$};
\node[below] at (1.5,-1.25) {$V$};
\end{tikzpicture}
```
```

```ad-note
La parabola per tre punti
Per tre punti con ascisse diverse e non allineati passa una sola parabola $y = ax^2 + bx + c$. Per trovarla si scrive la condizione di appartenenza per ognuno dei tre punti: si ottiene un sistema di tre equazioni nelle incognite $a$, $b$, $c$, come nella lezione [Determinanti e regola di Cramer](/materiale/scuola-superiore/matematica/sistemi-lineari/determinanti-e-regola-di-cramer).

Per esempio, la parabola che passa per $A(1, 0)$, $B(3, 0)$ e $C(2, -1)$:

$$
\begin{cases}
a + b + c = 0 \\
9a + 3b + c = 0 \\
4a + 2b + c = -1
\end{cases}
$$

Sottraendo la prima equazione dalla seconda ottieni $8a + 2b = 0$, cioè $b = -4a$; sottraendo la prima dalla terza ottieni $3a + b = -1$. Sostituendo, $3a - 4a = -1$, quindi $a = 1$, $b = -4$ e, dalla prima equazione, $c = 3$. La parabola è $y = x^2 - 4x + 3$, quella dell'esempio 2. Se uno dei tre punti sta sull'asse $y$, i conti si accorciano: il punto $(0, k)$ dà subito $c = k$.
```

Con la parabola disegnata puoi leggere dove $ax^2 + bx + c$ è positivo e dove è negativo, che è il metodo grafico delle [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado).
