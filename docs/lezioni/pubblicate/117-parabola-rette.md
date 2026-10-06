# Parabola e rette

Il getto di una fontana sale lungo una parabola, e in ogni istante l'acqua si muove nella direzione della retta che in quel punto sfiora la curva senza attraversarla: la tangente. Nella lezione [Sistemi di secondo grado](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/sistemi-di-secondo-grado) hai già messo a sistema una retta e una parabola. Qui quel sistema serve a trovare le rette tangenti, in un punto della parabola o condotte da un punto esterno, a costruire parabole che toccano una retta data e a misurare la parte di piano che una retta stacca da una parabola. Servono anche i [fasci di rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/fasci-di-rette) e la lezione [La parabola nel piano cartesiano](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/la-parabola-nel-piano-cartesiano).

## Posizione di una retta rispetto a una parabola

I punti comuni alla parabola $y = ax^2 + bx + c$ e alla retta $y = mx + q$ sono le soluzioni del sistema delle due equazioni. Uguagliando i secondi membri si ottiene l'equazione risolvente

$$ax^2 + (b - m)x + c - q = 0$$

che è di secondo grado, e il suo discriminante dice la posizione della retta.

| Risolvente | Punti comuni | La retta è |
|---|---|---|
| $\Delta > 0$ | due | secante |
| $\Delta = 0$ | uno, contato due volte | tangente |
| $\Delta < 0$ | nessuno | esterna |

Per la circonferenza la stessa domanda ha una risposta più veloce, il confronto tra la distanza del centro e il raggio. La parabola non ha un centro e un raggio: qui la posizione si decide con il discriminante.

```ad-example
Esempio 1: secante, tangente, esterna
Stabilisci la posizione delle rette $y = x - 1$, $y = x - 2$ e $y = x - 4$ rispetto alla parabola $y = \dfrac{1}{4}x^2 - x + 2$, e trova i punti comuni.

Per la prima retta, uguaglia i secondi membri e moltiplica per $4$:

$$
\begin{gathered}
\frac{1}{4}x^2 - x + 2 = x - 1 \\
\Rightarrow x^2 - 8x + 12 = 0
\end{gathered}
$$

Il discriminante è $\Delta = 64 - 48 = 16 > 0$: la retta è secante. Le soluzioni sono $x_1 = 2$ e $x_2 = 6$, e da $y = x - 1$ si hanno i punti $A(2, 1)$ e $B(6, 5)$. La corda $AB$ è lunga $\sqrt{16 + 16} = 4\sqrt{2}$.

Per la seconda retta la risolvente è $x^2 - 8x + 16 = 0$, cioè $(x - 4)^2 = 0$: $\Delta = 0$, la retta è tangente e tocca la parabola in $T(4, 2)$.

Per la terza la risolvente è $x^2 - 8x + 24 = 0$, con $\Delta = 64 - 96 = -32 < 0$: la retta è esterna.

```tikz
% nome: retta-parabola-tre-posizioni
% alt: La parabola y = un quarto di x² meno x più 2 con tre rette parallele: y = x - 1, secante nei punti A(2, 1) e B(6, 5); y = x - 2, tangente nel punto T(4, 2); y = x - 4, esterna
% svg: retta-parabola-tre-posizioni-7d1f092e.svg 226x208
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-2,-2) grid (8,7);
\draw[->] (-2.3,0) -- (8.6,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,7.6) node[above] {$y$};
\draw[thick, blue!60, domain=-2:6.9, samples=60, smooth] plot (\x, {0.25*\x*\x - \x + 2});
\draw[thick, teal!70] (-1,-2) -- (8,7);
\draw[thick, red!50] (0,-2) -- (8,6);
\draw[thick, orange!80] (2,-2) -- (8,4);
\fill (2,1) circle (0.13);
\fill (6,5) circle (0.13);
\fill (4,2) circle (0.13);
\node[above left] at (2,1) {$A$};
\node[above left] at (6,5) {$B$};
\node[below right] at (4,2) {$T$};
\end{tikzpicture}
```
```grafico
% nome: retta-parabola-cursore-q
% alt: La parabola y = un quarto di x² meno x più 2 e la retta y = x + q con il cursore q: sotto il piano è scritto il discriminante della risolvente; la retta è secante quando è positivo, tangente quando è zero, esterna quando è negativo
curva: y=\frac{1}{4}x^2-x+2
curva: y=x+q | rosso
cursore: q = -1 da -6 a 4 passo 0,1
finestra: x da -5 a 11, y da -5 a 9
valore: \Delta = 32+16q
domanda: Abbassa $q$ finché $\Delta = 0$: in quale punto la retta tocca la parabola? E per $q$ più piccoli?
```

Il discriminante si annulla per $q = -2$: la retta tocca la parabola in $T(4, 2)$. Per $q$ più piccoli $\Delta$ è negativo e la retta è esterna.
```

```ad-warning
Un solo punto comune non basta per dire tangente
Una retta parallela all'asse della parabola, come $x = 4$ per la parabola dell'esempio 1, la incontra in un solo punto, $(4, 2)$, ma la attraversa: non è tangente. In quel caso sostituendo $x = 4$ non si ottiene un'equazione di secondo grado, e non c'è nessun discriminante da annullare. La tangente è la retta per cui la risolvente è di secondo grado e ha $\Delta = 0$.
```

Per una parabola con asse parallelo all'asse $x$, $x = ay^2 + by + c$, si procede allo stesso modo ricavando $x$ dall'equazione della retta: la risolvente è di secondo grado in $y$.

## Tangente in un punto della parabola

Sia $P(x_0, y_0)$ un punto della parabola $y = ax^2 + bx + c$. Una retta non verticale che passa per $P$ ha equazione $y - y_0 = m(x - x_0)$, e va cercato il valore di $m$ per cui è tangente. Dato che $y_0 = ax_0^2 + bx_0 + c$, la risolvente del sistema è

$$
\begin{gathered}
ax^2 + bx + c = m(x - x_0) + ax_0^2 + bx_0 + c \\
\Rightarrow a(x^2 - x_0^2) + b(x - x_0) - m(x - x_0) = 0 \\
\Rightarrow (x - x_0)\big[a(x + x_0) + b - m\big] = 0
\end{gathered}
$$

Una soluzione è $x = x_0$, come ci si aspetta: la retta passa per $P$. L'altra annulla la parentesi quadra, ed è l'ascissa del secondo punto comune. La retta è tangente quando il secondo punto coincide con il primo, cioè quando anche la parentesi quadra si annulla per $x = x_0$:

$$
\begin{gathered}
a \cdot 2x_0 + b - m = 0 \\
\Rightarrow m = 2ax_0 + b
\end{gathered}
$$

Il coefficiente angolare della tangente alla parabola $y = ax^2 + bx + c$ nel suo punto di ascissa $x_0$ è

$$m = 2ax_0 + b$$

Nel vertice, dove $x_0 = -\dfrac{b}{2a}$, la formula dà $m = 0$: la tangente nel vertice è orizzontale.

```ad-example
Esempio 2: la tangente in un punto
Scrivi la tangente alla parabola $y = \dfrac{1}{4}x^2 - x + 2$ nel suo punto di ascissa $-2$.

L'ordinata del punto è $y_0 = \dfrac{1}{4} \cdot 4 + 2 + 2 = 5$: il punto è $P(-2, 5)$. Il coefficiente angolare della tangente:

$$m = 2 \cdot \frac{1}{4} \cdot (-2) - 1 = -2$$

La tangente è $y - 5 = -2(x + 2)$, cioè $y = -2x + 1$.

Controllo con il discriminante. La risolvente del sistema tra la parabola e la retta trovata è

$$
\begin{gathered}
\frac{1}{4}x^2 - x + 2 = -2x + 1 \\
\Rightarrow x^2 + 4x + 4 = 0
\end{gathered}
$$

con $\Delta = 16 - 16 = 0$ e la soluzione doppia $x = -2$.

```tikz
% nome: tangente-in-un-punto-parabola
% alt: La parabola y = un quarto di x² meno x più 2 e la retta y = -2x + 1, tangente alla parabola nel punto P(-2, 5)
% svg: tangente-in-un-punto-parabola-1f371d73.svg 226x208
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-1) grid (6,8);
\draw[->] (-4.3,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,8.6) node[above] {$y$};
\foreach \x in {-2,2} \node[below] at (\x,0) {\small $\x$};
\node[right] at (0,5) {\small $5$};
\draw[thick, blue!60, domain=-3.2:6, samples=60, smooth] plot (\x, {0.25*\x*\x - \x + 2});
\draw[thick, red!50] (-3.5,8) -- (1,-1);
\draw[dashed, gray] (-2,0) -- (-2,5) -- (0,5);
\fill (-2,5) circle (0.13);
\node[above right] at (-2,5) {$P$};
\end{tikzpicture}
```
```grafico
% nome: secante-per-p-diventa-tangente
% alt: La parabola y = un quarto di x² meno x più 2, il punto P(-2, 5) e la retta per P di coefficiente angolare m, con il cursore m, che taglia la parabola in un secondo punto Q: quando m arriva a -2 il punto Q raggiunge P e la retta diventa tangente
curva: y=\frac{1}{4}x^2-x+2
curva: y=m\left(x+2\right)+5 | rosso
curva: P=\left(-2;5\right) | nero
curva: Q=\left(4m+6;4m^2+8m+5\right) | rosso
cursore: m = 0 da -4 a 1 passo 0,1
finestra: x da -13 a 13, y da -5 a 17
valore: x_Q = 4m+6
domanda: La retta passa per $P$ e taglia la parabola anche in $Q$. Muovi $m$ finché $Q$ arriva su $P$: quanto vale $m$?
```

$Q$ raggiunge $P$ per $m = -2$, il valore della formula: i due punti comuni coincidono e la retta è tangente. Per $m$ minore di $-2$ il punto $Q$ passa dall'altra parte di $P$ e la retta torna secante.
```

```ad-warning
La formula vale per i punti della parabola
$m = 2ax_0 + b$ dà la tangente solo se $x_0$ è l'ascissa di un punto della parabola, e l'ordinata $y_0$ si calcola dall'equazione della parabola. Per un punto che non sta sulla parabola la formula non dice niente: si usa il metodo delle tangenti condotte da un punto.
```

La stessa formula trova la tangente con una direzione assegnata: si impone il valore di $m$ e si ricava $x_0$.

```ad-example
Esempio 3: la tangente parallela a una retta data
Trova la tangente alla parabola $y = \dfrac{1}{4}x^2 - x + 2$ parallela alla retta $y = -\dfrac{1}{2}x$.

Due rette parallele hanno lo stesso coefficiente angolare, quindi $m = -\dfrac{1}{2}$:

$$
\begin{gathered}
2 \cdot \frac{1}{4} \cdot x_0 - 1 = -\frac{1}{2} \\
\Rightarrow \frac{1}{2}x_0 = \frac{1}{2} \\
\Rightarrow x_0 = 1
\end{gathered}
$$

Il punto di contatto ha ordinata $y_0 = \dfrac{1}{4} - 1 + 2 = \dfrac{5}{4}$. La tangente è

$$y - \frac{5}{4} = -\frac{1}{2}(x - 1)$$

cioè $y = -\dfrac{1}{2}x + \dfrac{7}{4}$.
```

## Tangenti condotte da un punto

Per un punto $P(x_0, y_0)$ che non sta sulla parabola le tangenti si cercano nel fascio di rette di centro $P$:

1. Scrivi il fascio: $y - y_0 = m(x - x_0)$.
2. Metti a sistema con la parabola e scrivi la risolvente, ordinata secondo le potenze di $x$: i suoi coefficienti contengono $m$.
3. Imponi la condizione di tangenza $\Delta = 0$: è un'equazione di secondo grado in $m$.
4. Ogni soluzione $m$ dà una tangente; sostituita nella risolvente, dà l'ascissa del punto di contatto.

Quante soluzioni ha l'equazione in $m$ dipende da dove sta $P$. Il punto è **interno** alla parabola se sta dalla parte del fuoco, **esterno** se sta dall'altra parte: per $y = ax^2 + bx + c$ con $a > 0$ è esterno quando sta sotto la parabola, cioè quando $y_0 < ax_0^2 + bx_0 + c$, e con $a < 0$ quando sta sopra.

| Il punto $P$ è | Tangenti per $P$ |
|---|---|
| esterno | due |
| sulla parabola | una |
| interno | nessuna |

Per una parabola con asse parallelo all'asse $y$ nessuna tangente è verticale: il fascio $y - y_0 = m(x - x_0)$ le contiene tutte.

```ad-example
Esempio 4: due tangenti da un punto esterno
Trova le tangenti alla parabola $y = \dfrac{1}{4}x^2 - x + 2$ condotte dal punto $P(3, -1)$.

Il punto è esterno: per $x = 3$ la parabola ha ordinata $\dfrac{9}{4} - 3 + 2 = \dfrac{5}{4}$, e $-1 < \dfrac{5}{4}$. Il fascio è $y + 1 = m(x - 3)$, cioè $y = mx - 3m - 1$. Uguaglia e moltiplica per $4$:

$$
\begin{gathered}
\frac{1}{4}x^2 - x + 2 = mx - 3m - 1 \\
\Rightarrow x^2 - 4x + 8 = 4mx - 12m - 4 \\
\Rightarrow x^2 - (4m + 4)x + 12m + 12 = 0
\end{gathered}
$$

Imponi che il discriminante sia zero:

$$
\begin{gathered}
(4m + 4)^2 - 4(12m + 12) = 0 \\
\Rightarrow 16m^2 - 16m - 32 = 0 \\
\Rightarrow m^2 - m - 2 = 0
\end{gathered}
$$

Le soluzioni sono $m_1 = -1$ e $m_2 = 2$. Le tangenti sono $y = -x + 2$ e $y = 2x - 7$.

Con $\Delta = 0$ la risolvente ha la soluzione doppia $x = \dfrac{4m + 4}{2} = 2m + 2$: per $m = -1$ si ha $x = 0$, per $m = 2$ si ha $x = 6$. I punti di contatto sono $A(0, 2)$ e $B(6, 5)$.

```tikz
% nome: tangenti-da-punto-esterno-parabola
% alt: La parabola y = un quarto di x² meno x più 2 con le due tangenti condotte dal punto esterno P(3, -1): la retta y = -x + 2, che la tocca in A(0, 2), e la retta y = 2x - 7, che la tocca in B(6, 5)
% svg: tangenti-da-punto-esterno-parabola-f9c0799e.svg 245x208
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-3,-2) grid (8,7);
\draw[->] (-3.3,0) -- (8.6,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,7.6) node[above] {$y$};
\draw[thick, blue!60, domain=-2.7:6.9, samples=60, smooth] plot (\x, {0.25*\x*\x - \x + 2});
\draw[thick, red!50] (-3,5) -- (4,-2);
\draw[thick, red!50] (2.5,-2) -- (7,7);
\fill (3,-1) circle (0.13);
\fill (0,2) circle (0.13);
\fill (6,5) circle (0.13);
\node[right] at (3.2,-1.1) {$P$};
\node[above right] at (0,2) {$A$};
\node[left] at (5.8,5.2) {$B$};
\end{tikzpicture}
```
```grafico
% nome: fascio-per-p-tangente-parabola
% alt: La parabola y = un quarto di x² meno x più 2 e la retta del fascio di centro P(3, -1) con il cursore del coefficiente angolare m: sotto il piano è scritto il discriminante della risolvente, che si annulla per i due valori di m delle tangenti
curva: y=\frac{1}{4}x^2-x+2
curva: y=m\left(x-3\right)-1 | rosso
curva: P=\left(3;-1\right) | nero
cursore: m = 0,5 da -4 a 4 passo 0,1
finestra: x da -6 a 12, y da -5 a 10
valore: \Delta = 16m^2-16m-32
domanda: Muovi $m$ finché $\Delta = 0$: per quali valori succede? Che cosa fa la retta quando $\Delta$ è negativo?
```

Succede per $m = -1$ e per $m = 2$. Tra i due valori $\Delta$ è negativo: la retta passa per $P$ senza incontrare la parabola.
```

```ad-warning
Due discriminanti diversi
Nel passo 3 si annulla il discriminante della risolvente, che è un'equazione in $x$ con i coefficienti che dipendono da $m$. Il risultato è una nuova equazione, in cui l'incognita è $m$: nell'esempio 4 è $m^2 - m - 2 = 0$, che ha a sua volta un discriminante, $1 + 8 = 9$. Si annulla solo il primo.
```

### Con l'asse parallelo all'asse x

Per la parabola $x = ay^2 + by + c$ conviene scrivere le rette per $P(x_0, y_0)$ nella forma $x - x_0 = n(y - y_0)$, che scambia i ruoli di $x$ e $y$. Tutto si ripete: la risolvente è in $y$, e la tangente in un punto della parabola ha

$$n = 2ay_0 + b$$

In questa forma manca la retta orizzontale $y = y_0$, che è parallela all'asse della parabola e quindi non è mai tangente.

```ad-example
Esempio 5: la tangente a una parabola con asse orizzontale
Scrivi la tangente alla parabola $x = y^2 - 4$ nel suo punto $P(0, 2)$.

Il punto sta sulla parabola: $2^2 - 4 = 0$. Qui $a = 1$ e $b = 0$:

$$n = 2 \cdot 1 \cdot 2 + 0 = 4$$

La tangente è $x - 0 = 4(y - 2)$, cioè $x - 4y + 8 = 0$. Controllo: sostituendo $x = 4y - 8$ nella parabola si ha $y^2 - 4y + 4 = 0$, con $\Delta = 0$.

```tikz
% nome: tangente-parabola-asse-orizzontale
% alt: La parabola x = y² - 4, con asse sull'asse x e concavità verso destra, e la retta x - 4y + 8 = 0, tangente alla parabola nel punto P(0, 2)
% svg: tangente-parabola-asse-orizzontale-d27213c3.svg 247x185
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-5,-3) grid (5,4);
\draw[->] (-5.3,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,4.6) node[above] {$y$};
\node[below left] at (-4,0) {\small $-4$};
\draw[thick, blue!60, domain=-3:3, samples=60, smooth] plot ({\x*\x - 4}, \x);
\draw[thick, red!50] (-5,0.75) -- (5,3.25);
\fill (0,2) circle (0.12);
\fill (-4,0) circle (0.12);
\node[above left] at (0,2) {$P$};
\end{tikzpicture}
```
```

## Parabola tangente a una retta

Che una parabola sia tangente a una retta data è una condizione sui suoi coefficienti: la risolvente del sistema deve soddisfare la condizione di tangenza $\Delta = 0$. Si usa insieme alle condizioni della lezione [La parabola nel piano cartesiano](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/la-parabola-nel-piano-cartesiano), e vale per una delle tre che servono.

```ad-example
Esempio 6: due punti e una retta tangente
Trova le parabole $y = ax^2 + bx + c$ che passano per $A(0, 3)$ e $B(4, 3)$ e sono tangenti alla retta $y = 2x - 6$.

Il passaggio per $A$ dà $c = 3$. Il passaggio per $B$ dà $16a + 4b + 3 = 3$, cioè $b = -4a$. Le parabole che passano per i due punti sono quindi $y = ax^2 - 4ax + 3$. Metti a sistema con la retta:

$$
\begin{gathered}
ax^2 - 4ax + 3 = 2x - 6 \\
\Rightarrow ax^2 - (4a + 2)x + 9 = 0
\end{gathered}
$$

Imponi $\Delta = 0$:

$$
\begin{gathered}
(4a + 2)^2 - 36a = 0 \\
\Rightarrow 16a^2 - 20a + 4 = 0 \\
\Rightarrow 4a^2 - 5a + 1 = 0
\end{gathered}
$$

Le soluzioni sono $a = 1$ e $a = \dfrac{1}{4}$, tutte e due diverse da zero. Le parabole sono due:

$$
\begin{gathered}
y = x^2 - 4x + 3 \\
y = \frac{1}{4}x^2 - x + 3
\end{gathered}
$$

La prima tocca la retta in $(3, 0)$, la seconda in $(6, 6)$.

```tikz
% nome: due-parabole-tangenti-a-una-retta
% alt: Le due parabole che passano per A(0, 3) e B(4, 3) e sono tangenti alla retta y = 2x - 6: y = x² - 4x + 3, che la tocca in (3, 0), e y = un quarto di x² meno x più 3, che la tocca in (6, 6)
% svg: due-parabole-tangenti-a-una-retta-ddccbe4e.svg 226x227
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-2,-2) grid (8,8);
\draw[->] (-2.3,0) -- (8.6,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,8.6) node[above] {$y$};
\draw[thick, blue!60, domain=-0.9:4.9, samples=60, smooth] plot (\x, {\x*\x - 4*\x + 3});
\draw[thick, teal!70, domain=-2:7, samples=60, smooth] plot (\x, {0.25*\x*\x - \x + 3});
\draw[thick, red!50] (2,-2) -- (7,8);
\fill (0,3) circle (0.13);
\fill (4,3) circle (0.13);
\fill (3,0) circle (0.13);
\fill (6,6) circle (0.13);
\node[below left] at (-0.1,2.9) {$A$};
\node[above left] at (4,3) {$B$};
\end{tikzpicture}
```
```grafico
% nome: parabole-per-due-punti-tangenti-cursore-a
% alt: Le parabole y = ax² - 4ax + 3, che passano tutte per A(0, 3) e B(4, 3), con il cursore a, e la retta y = 2x - 6: sotto il piano è scritto il discriminante della risolvente, che si annulla per a = 0,25 e per a = 1, i due valori per cui la parabola è tangente alla retta
curva: y=ax^2-4ax+3
curva: y=2x-6 | rosso
curva: A=\left(0;3\right) | nero
curva: B=\left(4;3\right) | nero
cursore: a = 0,5 da -1 a 2 passo 0,05
finestra: x da -8 a 12, y da -6 a 12
valore: \Delta = 16a^2-20a+4
domanda: Tutte queste parabole passano per $A$ e $B$. Per quali valori di $a$ toccano la retta? Che cosa resta per $a = 0$?
```

Toccano la retta per $a = 0{,}25$ e per $a = 1$. Tra i due valori $\Delta$ è negativo e la parabola non incontra la retta; fuori la taglia in due punti. Per $a = 0$ resta la retta $y = 3$, che non è una parabola: per questo la soluzione va controllata con $a \neq 0$.
```

## Il segmento parabolico

Una retta secante stacca dalla parabola una regione chiusa, delimitata dalla corda $AB$ e dall'arco di parabola che ha gli stessi estremi: è il **segmento parabolico**. La sua area si calcola con un teorema di Archimede, che al terzo anno si enuncia senza dimostrazione, perché la dimostrazione richiede gli integrali del quinto anno.

Se la corda è perpendicolare all'asse della parabola, l'area del segmento parabolico è i due terzi dell'area del rettangolo che ha un lato sulla corda e il lato opposto sulla tangente nel vertice:

$$\text{Area} = \frac{2}{3} \cdot \overline{AB} \cdot h$$

dove $h$ è la distanza del vertice dalla corda. Per una corda qualsiasi di una parabola $y = ax^2 + bx + c$, se $x_1$ e $x_2$ sono le ascisse dei suoi estremi, vale la formula

$$\text{Area} = \frac{|a| \cdot |x_2 - x_1|^3}{6}$$

```ad-example
Esempio 7: l'area di due segmenti parabolici
Calcola l'area del segmento parabolico che la retta $y = 5$ stacca dalla parabola $y = \dfrac{1}{4}x^2 - x + 2$. Poi quella staccata dalla retta $y = x - 1$.

La retta $y = 5$ è perpendicolare all'asse della parabola. Gli estremi della corda:

$$
\begin{gathered}
\frac{1}{4}x^2 - x + 2 = 5 \\
\Rightarrow x^2 - 4x - 12 = 0 \\
\Rightarrow x_1 = -2, \quad x_2 = 6
\end{gathered}
$$

La corda è lunga $6 - (-2) = 8$. Il vertice è $V(2, 1)$, quindi $h = 5 - 1 = 4$. Il rettangolo ha area $8 \cdot 4 = 32$, e

$$\text{Area} = \frac{2}{3} \cdot 32 = \frac{64}{3}$$

La seconda formula dà lo stesso valore: $\dfrac{\frac{1}{4} \cdot 8^3}{6} = \dfrac{128}{6} = \dfrac{64}{3}$.

La retta $y = x - 1$ è quella dell'esempio 1, che taglia la parabola nei punti di ascissa $2$ e $6$. La corda non è perpendicolare all'asse, quindi si usa la seconda formula:

$$\text{Area} = \frac{\frac{1}{4} \cdot (6 - 2)^3}{6} = \frac{16}{6} = \frac{8}{3}$$

```tikz
% nome: segmento-parabolico-rettangolo
% alt: Il segmento parabolico che la retta y = 5 stacca dalla parabola y = un quarto di x² meno x più 2, colorato, con la corda da (-2, 5) a (6, 5), il vertice V(2, 1) e il rettangolo tratteggiato di base 8 e altezza 4 che lo contiene: l'area del segmento è due terzi di quella del rettangolo
% svg: segmento-parabolico-rettangolo-5a14d0c6.svg 264x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-1) grid (8,7);
\fill[blue!18] plot[domain=-2:6, samples=50, smooth] (\x, {0.25*\x*\x - \x + 2}) -- cycle;
\draw[->] (-4.3,0) -- (8.6,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,7.6) node[above] {$y$};
\foreach \x in {-2,2,6} \node[below] at (\x,0) {\small $\x$};
\draw[dashed, gray] (-2,5) -- (-2,1) -- (6,1) -- (6,5);
\draw[thick, blue!60, domain=-3:7, samples=60, smooth] plot (\x, {0.25*\x*\x - \x + 2});
\draw[thick, red!50] (-4,5) -- (8,5);
\fill (-2,5) circle (0.13);
\fill (6,5) circle (0.13);
\fill (2,1) circle (0.13);
\node[above left] at (-2,5) {$A$};
\node[above right] at (6,5) {$B$};
\node[below right] at (2,1) {$V$};
\end{tikzpicture}
```
```grafico
% nome: segmento-parabolico-cursore-k
% alt: La parabola y = un quarto di x² meno x più 2 e la retta y = k con il cursore k: sotto il piano sono scritte l'altezza h, la lunghezza della corda e l'area del segmento parabolico, che per k = 5 vale 64/3 e per k = 1, quando la retta è tangente nel vertice, vale zero
curva: y=\frac{1}{4}x^2-x+2
curva: y=k | rosso
curva: V=\left(2;1\right) | nero
cursore: k = 5 da 1 a 9 passo 0,5
finestra: x da -8 a 12, y da -4 a 11
valore: h = k-1
valore: \overline{AB} = 4\sqrt{k-1}
valore: Area = \frac{8}{3}\left(k-1\right)\sqrt{k-1}
domanda: Con $k = 5$ è $h = 4$ e l'area vale $\frac{64}{3}$. Se porti $h$ a $8$ l'area raddoppia? E quanto vale per $k = 1$?
```

Non raddoppia: con $h = 8$ si allunga anche la corda, e l'area diventa circa $60{,}3$, quasi il triplo. Per $k = 1$ la retta è tangente nel vertice, la corda si riduce a un punto e l'area è zero.
```

```ad-warning
Due terzi del rettangolo, non del triangolo
Il rettangolo del teorema ha per lati la corda e la distanza $h$ del vertice dalla corda. Il triangolo $ABV$ ha area metà di quel rettangolo, quindi il segmento parabolico è i quattro terzi del triangolo: nell'esempio 7 il triangolo ha area $16$ e il segmento $\dfrac{64}{3}$.
```
