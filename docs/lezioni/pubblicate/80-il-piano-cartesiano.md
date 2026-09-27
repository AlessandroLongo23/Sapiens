# Il piano cartesiano: distanza e punto medio

Nella battaglia navale una casella si trova con una lettera e un numero; nel piano cartesiano un punto si trova con due numeri, le sue coordinate. Con le coordinate la geometria diventa un calcolo: la lunghezza di un segmento, il suo punto medio, il perimetro di un triangolo o il tipo di quadrilatero si trovano con formule, senza misurare sul disegno. Il piano cartesiano l'hai già incontrato in breve nella lezione [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione); qui si riprende da capo. Per le distanze servono le radici quadrate e il trasporto fuori dal segno di radice, che trovi in [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali).

## Assi, origine e coordinate

Il **piano cartesiano** si costruisce con due rette orientate perpendicolari, che si incontrano nel punto che su tutte e due corrisponde allo zero. La retta orizzontale, orientata verso destra, è l'**asse $x$**, o asse delle ascisse; quella verticale, orientata verso l'alto, è l'**asse $y$**, o asse delle ordinate. Il punto in cui si incontrano è l'**origine**, e si indica con $O$. Ogni asse è una copia della [retta reale](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/numeri-irrazionali-e-numeri-reali), e su tutti e due si usa la stessa unità di misura.

Per trovare le coordinate di un punto $P$ si tracciano da $P$ la perpendicolare all'asse $x$ e quella all'asse $y$. Il numero in cui la prima incontra l'asse $x$ è l'**ascissa** di $P$, che si scrive $x_P$; il numero in cui la seconda incontra l'asse $y$ è l'**ordinata** di $P$, che si scrive $y_P$. Ascissa e ordinata sono le **coordinate** di $P$ e si scrivono tra parentesi, prima l'ascissa e poi l'ordinata: $P(x_P, y_P)$. Nella figura il punto $A$ ha coordinate $(3, 2)$: per arrivarci partendo da $O$ ti sposti di $3$ unità a destra e di $2$ in alto. Per $B(-2, 3)$ ti sposti di $2$ a sinistra e di $3$ in alto.

```tikz
% nome: piano-cartesiano-coordinate-punti
% alt: Piano cartesiano con la griglia, l'asse x, l'asse y e l'origine O; il punto A(3, 2) con le linee tratteggiate verso i due assi, e i punti B(-2, 3), C(-4, -1) e D(2, -3)
% svg: piano-cartesiano-coordinate-punti-bc598fdf.svg 243x198
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-4.5,-3.5) grid (4.5,3.5);
\draw[->] (-4.8,0) -- (5,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,4) node[above] {$y$};
\foreach \i in {-4,-3,-2,-1,1,2,3,4} \node[below] at (\i,0) {\scriptsize $\i$};
\foreach \j in {-3,-2,-1,1,2,3} \node[left] at (0,\j) {\scriptsize $\j$};
\node[below left] at (0,0) {\scriptsize $O$};
\draw[dashed, blue!60] (3,0) -- (3,2) -- (0,2);
\fill (3,2) circle (0.1) node[above right] {$A(3, 2)$};
\fill (-2,3) circle (0.1) node[above left] {$B(-2, 3)$};
\fill (-4,-1) circle (0.1) node[below right] {$C(-4, -1)$};
\fill (2,-3) circle (0.1) node[right] {$D(2, -3)$};
\end{tikzpicture}
```

Il procedimento funziona anche al contrario: data una coppia ordinata di numeri reali, c'è uno e un solo punto del piano che ha quei numeri come coordinate. Punti e coppie si corrispondono uno a uno, e il piano cartesiano è il [prodotto cartesiano](/materiale/scuola-superiore/matematica/insiemi-e-logica/prodotto-cartesiano) $\mathbb{R} \times \mathbb{R}$ disegnato.

```ad-warning
Scambiare ascissa e ordinata
Il punto $B(-2, 3)$ ha ascissa $-2$ e ordinata $3$. Il punto $(3, -2)$ è un altro punto: sta $3$ unità a destra dell'origine e $2$ in basso, dalla parte opposta del piano. La prima coordinata è sempre lo spostamento in orizzontale.
```

### I quadranti

Gli assi dividono il piano in quattro parti, i **quadranti**, numerati in senso antiorario a partire da quello in alto a destra. In ogni quadrante i segni delle coordinate sono sempre gli stessi:

| Quadrante | $x$ | $y$ | Esempio |
|---|---|---|---|
| primo (I) | $+$ | $+$ | $A(3, 2)$ |
| secondo (II) | $-$ | $+$ | $B(-2, 3)$ |
| terzo (III) | $-$ | $-$ | $C(-4, -1)$ |
| quarto (IV) | $+$ | $-$ | $D(2, -3)$ |

```tikz
% nome: quadranti-segni-coordinate
% alt: I quattro quadranti del piano cartesiano, numerati in senso antiorario: nel primo le coordinate sono (+, +), nel secondo (-, +), nel terzo (-, -), nel quarto (+, -)
% svg: quadranti-segni-coordinate-841fe7b3.svg 208x181
\begin{tikzpicture}[scale=0.8]
\draw[->] (-3,0) -- (3.2,0) node[right] {$x$};
\draw[->] (0,-2.5) -- (0,2.8) node[above] {$y$};
\node[below left] at (0,0) {\small $O$};
\node[align=center] at (1.5,1.25) {I\\ $(+, +)$};
\node[align=center] at (-1.5,1.25) {II\\ $(-, +)$};
\node[align=center] at (-1.5,-1.25) {III\\ $(-, -)$};
\node[align=center] at (1.5,-1.25) {IV\\ $(+, -)$};
\end{tikzpicture}
```

### Punti sugli assi

I punti degli assi non appartengono a nessun quadrante. Un punto dell'asse $x$ sta alla stessa altezza dell'origine, quindi ha ordinata $0$ e si scrive $(a, 0)$; un punto dell'asse $y$ ha ascissa $0$ e si scrive $(0, b)$. L'origine sta su tutti e due gli assi: $O(0, 0)$.

Allo stesso modo, i punti che hanno la stessa ordinata stanno sulla stessa retta orizzontale, e quelli che hanno la stessa ascissa sulla stessa retta verticale. Le equazioni di queste rette sono nella lezione [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari).

```ad-warning
Il punto $(0, 3)$ non sta sull'asse $x$
Nel punto $(0, 3)$ lo zero è l'ascissa: dall'origine non ti sposti in orizzontale e sali di $3$, quindi il punto sta sull'asse $y$. Sull'asse $x$ c'è $(3, 0)$. Il controllo: sta sull'asse $x$ il punto con la $y$ uguale a zero, e sull'asse $y$ quello con la $x$ uguale a zero.
```

```ad-example
Esempio 1: dove sta il punto
In quale quadrante, o su quale asse, stanno i punti $A(-4, 1)$, $B(0, -3)$, $C\left(\dfrac{5}{2}, 0\right)$, $D\left(3, -\dfrac{1}{2}\right)$ ed $E\left(-\sqrt{2}, -1\right)$?

$A$ ha ascissa negativa e ordinata positiva: sta nel secondo quadrante.

$B$ ha ascissa $0$: sta sull'asse $y$, sotto l'origine.

$C$ ha ordinata $0$: sta sull'asse $x$, a destra dell'origine.

$D$ ha ascissa positiva e ordinata negativa: sta nel quarto quadrante. Che l'ordinata sia una frazione non cambia niente, conta il segno.

$E$ ha tutte e due le coordinate negative, perché $-\sqrt{2}$ è circa $-1{,}41$: sta nel terzo quadrante.
```

## Distanza tra due punti

La **distanza** tra due punti $A$ e $B$ è la lunghezza del segmento $AB$, e si scrive $\overline{AB}$. Con le coordinate si calcola senza righello: prima nel caso in cui il segmento è orizzontale o verticale, poi in generale.

### Punti sulla stessa retta orizzontale o verticale

Se $A$ e $B$ hanno la stessa ordinata, il segmento $AB$ è orizzontale e la sua lunghezza è la distanza tra le due ascisse sulla retta dei numeri. Si fa la differenza tra le ascisse e se ne prende il [valore assoluto](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto), perché una lunghezza non è mai negativa:

$$\overline{AB} = |x_B - x_A| \quad \text{se } y_A = y_B$$

Se invece $A$ e $B$ hanno la stessa ascissa, il segmento è verticale e conta la differenza tra le ordinate:

$$\overline{AB} = |y_B - y_A| \quad \text{se } x_A = x_B$$

Con il valore assoluto l'ordine dei due punti non conta: $|x_B - x_A|$ e $|x_A - x_B|$ sono numeri opposti dentro il valore assoluto, e danno lo stesso risultato. Nella figura $\overline{AB} = |4 - (-3)| = 7$ e $\overline{CD} = |1 - (-3)| = 4$: puoi contare le unità anche sui quadretti.

```tikz
% nome: distanza-segmento-orizzontale-verticale
% alt: Il segmento orizzontale da A(-3, 2) a B(4, 2), lungo 7, e il segmento verticale da C(2, -3) a D(2, 1), lungo 4, nel piano cartesiano con la griglia
% svg: distanza-segmento-orizzontale-verticale-13855984.svg 223x175
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4.5,-3.5) grid (5.5,3.5);
\draw[->] (-4.8,0) -- (5.9,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,4) node[above] {$y$};
\node[below left] at (0,0) {\scriptsize $O$};
\draw[very thick, blue!60] (-3,2) -- (4,2);
\draw[very thick, blue!60] (2,-3) -- (2,1);
\fill (-3,2) circle (0.12) node[above] {$A(-3, 2)$};
\fill (4,2) circle (0.12) node[above] {$B(4, 2)$};
\fill (2,-3) circle (0.12) node[below] {$C(2, -3)$};
\fill (2,1) circle (0.12) node[right] {$D(2, 1)$};
\node[below] at (0.5,2) {$7$};
\node[right] at (2,-1.5) {$4$};
\end{tikzpicture}
```

```ad-warning
Perdere il segno meno
Per $A(-3, 2)$ e $B(4, 2)$ si scrive $4 - (-3) = 7$, con le parentesi. Il conto $4 - 3 = 1$ è sbagliato: $A$ e $B$ stanno da parti opposte dell'asse $y$, e la distanza è la somma dei due tratti, $3 + 4$.
```

### Segmenti obliqui

Se $A$ e $B$ non stanno sulla stessa retta orizzontale né sulla stessa verticale, il segmento $AB$ è obliquo. Prendi il punto $H(x_B, y_A)$, che ha l'ascissa di $B$ e l'ordinata di $A$: il triangolo $AHB$ è rettangolo in $H$, perché $AH$ è orizzontale e $HB$ è verticale. I cateti si misurano come nella sezione precedente, $\overline{AH} = |x_B - x_A|$ e $\overline{HB} = |y_B - y_A|$, e $AB$ è l'ipotenusa. Per il teorema di Pitagora

$$\overline{AB}^{\,2} = \overline{AH}^{\,2} + \overline{HB}^{\,2}$$

Il quadrato di un numero e quello del suo opposto sono uguali, quindi $|x_B - x_A|^2 = (x_B - x_A)^2$ e il valore assoluto non serve più. Estraendo la radice si ottiene la **formula della distanza tra due punti**:

$$
\begin{gathered}
\overline{AB} = \\
\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}
\end{gathered}
$$

Nella figura $\overline{AH} = |3 - (-1)| = 4$ e $\overline{HB} = |1 - (-2)| = 3$, quindi $\overline{AB} = \sqrt{16 + 9} = \sqrt{25} = 5$.

```tikz
% nome: distanza-due-punti-teorema-pitagora
% alt: I punti A(-1, -2) e B(3, 1) con il punto H(3, -2): il triangolo AHB è rettangolo in H, con il cateto orizzontale AH lungo 4, il cateto verticale HB lungo 3 e l'ipotenusa AB lunga 5
% svg: distanza-due-punti-teorema-pitagora-db2e64bd.svg 234x186
\begin{tikzpicture}[scale=0.65]
\draw[gray!25, very thin] (-2.5,-3.5) grid (4.5,2.5);
\draw[->] (-2.8,0) -- (4.9,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,2.9) node[above] {$y$};
\node[above left] at (0,0) {\scriptsize $O$};
\fill[blue!8] (-1,-2) -- (3,-2) -- (3,1) -- cycle;
\draw (-1,-2) -- (3,-2) -- (3,1);
\draw[very thick, blue!60] (-1,-2) -- (3,1);
\draw (2.7,-2) -- (2.7,-1.7) -- (3,-1.7);
\fill (-1,-2) circle (0.1) node[below left] {$A(-1, -2)$};
\fill (3,1) circle (0.1) node[above right] {$B(3, 1)$};
\fill (3,-2) circle (0.1) node[below right] {$H(3, -2)$};
\node[below] at (1,-2) {$4$};
\node[right] at (3,-0.5) {$3$};
\node[above left] at (0.5,-0.9) {$5$};
\end{tikzpicture}
```

Anche nella formula l'ordine non conta: scambiando $A$ e $B$ le differenze cambiano segno, ma i loro quadrati restano uguali. E la formula vale anche per i segmenti orizzontali e verticali: se $y_A = y_B$ il secondo quadrato è zero e resta $\sqrt{(x_B - x_A)^2} = |x_B - x_A|$.

```ad-tip
Distanza dall'origine
Se uno dei due punti è l'origine le differenze sono le coordinate dell'altro punto: $\overline{OP} = \sqrt{x_P^2 + y_P^2}$. Per $P(3, -4)$ si ha $\overline{OP} = \sqrt{9 + 16} = 5$.
```

```ad-warning
La radice di una somma
$\sqrt{16 + 9}$ fa $\sqrt{25} = 5$, non $4 + 3 = 7$: la radice di una somma non è la somma delle radici. Prima si sommano i quadrati, poi si estrae la radice, come spiega la lezione [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali). Nel disegno si vede: l'ipotenusa è più corta della somma dei due cateti.
```

```ad-example
Esempio 2: coordinate negative e un radicale
Calcola la distanza tra $A(-2, 5)$ e $B(4, -1)$.

Le differenze delle coordinate, con le parentesi sui numeri negativi, sono

$$
\begin{gathered}
x_B - x_A = 4 - (-2) = 6 \\
y_B - y_A = -1 - 5 = -6
\end{gathered}
$$

Il quadrato di $-6$ è positivo:

$$
\begin{aligned}
\overline{AB} &= \sqrt{6^2 + (-6)^2} \\
&= \sqrt{36 + 36} \\
&= \sqrt{72} = 6\sqrt{2}
\end{aligned}
$$

Il risultato si scrive con il radicale ridotto, $6\sqrt{2}$ e non $\sqrt{72}$, portando fuori dalla radice il fattore $36 = 6^2$. In decimali è circa $8{,}49$.
```

```ad-warning
Il quadrato di una differenza negativa
Nell'esempio 2 il quadrato di $y_B - y_A = -6$ è $(-6)^2 = 36$. Scrivendo $-6^2$ senza parentesi si ottiene $-36$, e sotto la radice resta $36 - 36 = 0$: una distanza nulla tra due punti diversi, che è impossibile. Sotto la radice della formula ci sono sempre due numeri positivi o nulli.
```

```ad-example
Esempio 3: coordinate frazionarie
Calcola la distanza tra $A\left(\dfrac{1}{2}, \dfrac{1}{3}\right)$ e $B(-1, 1)$.

$$
\begin{gathered}
x_B - x_A = -1 - \frac{1}{2} = -\frac{3}{2} \\
y_B - y_A = 1 - \frac{1}{3} = \frac{2}{3}
\end{gathered}
$$

I quadrati sono $\dfrac{9}{4}$ e $\dfrac{4}{9}$, e il denominatore comune è $36$:

$$
\begin{aligned}
\overline{AB} &= \sqrt{\frac{9}{4} + \frac{4}{9}} \\
&= \sqrt{\frac{81 + 16}{36}} \\
&= \sqrt{\frac{97}{36}} = \frac{\sqrt{97}}{6}
\end{aligned}
$$

La radice del denominatore è $6$; $97$ è un numero primo, quindi $\sqrt{97}$ non si riduce.
```

```ad-example
Esempio 4: un punto dell'asse x a distanza data
Trova i punti dell'asse $x$ che distano $5$ da $A(1, 4)$.

Un punto dell'asse $x$ ha ordinata $0$: chiamalo $P(x, 0)$. La distanza $\overline{AP}$ deve valere $5$, quindi il suo quadrato deve valere $25$; con i quadrati si lavora senza radice:

$$
\begin{gathered}
(x - 1)^2 + (0 - 4)^2 = 25 \\
(x - 1)^2 + 16 = 25 \\
(x - 1)^2 = 9
\end{gathered}
$$

I numeri che al quadrato danno $9$ sono $3$ e $-3$, quindi $x - 1 = 3$ oppure $x - 1 = -3$, cioè $x = 4$ oppure $x = -2$. I punti sono due, $P_1(-2, 0)$ e $P_2(4, 0)$, uno per parte rispetto alla verticale di $A$.

Verifica per $P_2$: $\sqrt{(4 - 1)^2 + (0 - 4)^2} = \sqrt{9 + 16} = 5$.

```tikz
% nome: punti-asse-x-a-distanza-data
% alt: Il punto A(1, 4) e i due punti dell'asse x che distano 5 da A, P1(-2, 0) e P2(4, 0), uniti ad A da due segmenti lunghi 5
% svg: punti-asse-x-a-distanza-data-5fa9c254.svg 233x166
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-3.5,-1.5) grid (5.5,5.5);
\draw[->] (-3.8,0) -- (5.9,0) node[right] {$x$};
\draw[->] (0,-1.8) -- (0,5.9) node[above] {$y$};
\node[below left] at (0,0) {\scriptsize $O$};
\draw[very thick, blue!60] (-2,0) -- (1,4) -- (4,0);
\fill (1,4) circle (0.12) node[above right] {$A(1, 4)$};
\fill (-2,0) circle (0.12) node[below left] {$P_1(-2, 0)$};
\fill (4,0) circle (0.12) node[below] {$P_2(4, 0)$};
\node[left] at (-0.5,2) {$5$};
\node[right] at (2.5,2) {$5$};
\end{tikzpicture}
```
```

## Punto medio di un segmento

Il **punto medio** $M$ di un segmento $AB$ è il punto del segmento che lo divide in due parti uguali, $\overline{AM} = \overline{MB}$. Le sue coordinate sono la media delle coordinate degli estremi:

$$
\begin{gathered}
x_M = \frac{x_A + x_B}{2} \\
y_M = \frac{y_A + y_B}{2}
\end{gathered}
$$

Il motivo si vede proiettando i punti sull'asse $x$. Le verticali per $A$, $M$ e $B$ tagliano l'asse in $x_A$, $x_M$ e $x_B$, e siccome $M$ sta a metà di $AB$ anche $x_M$ sta a metà tra $x_A$ e $x_B$ (lo garantisce il teorema di Talete). Sulla retta dei numeri il punto a metà tra due numeri è la loro media: tra $-2$ e $4$ c'è $1$, che dista $3$ da tutti e due. Per le ordinate si ragiona allo stesso modo con l'asse $y$.

```tikz
% nome: punto-medio-segmento-proiezioni
% alt: Il segmento da A(-2, 1) a B(4, 5) con il punto medio M(1, 3); le linee tratteggiate verticali portano A, M e B sull'asse x in -2, 1 e 4, e 1 sta a metà tra -2 e 4
% svg: punto-medio-segmento-proiezioni-5e0b1015.svg 243x161
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-3.5,-0.5) grid (5.5,5.5);
\draw[->] (-3.8,0) -- (5.9,0) node[right] {$x$};
\draw[->] (0,-0.8) -- (0,5.9) node[above] {$y$};
\draw[very thick, blue!60] (-2,1) -- (4,5);
\draw[dashed] (-2,1) -- (-2,0);
\draw[dashed] (1,3) -- (1,0);
\draw[dashed] (4,5) -- (4,0);
\node[below] at (-2,0) {\small $-2$};
\node[below] at (1,0) {\small $1$};
\node[below] at (4,0) {\small $4$};
\fill (-2,1) circle (0.11) node[above left] {$A(-2, 1)$};
\fill (4,5) circle (0.11) node[right] {$B(4, 5)$};
\fill (1,3) circle (0.11) node[below right] {$M(1, 3)$};
\end{tikzpicture}
```

Nella figura $x_M = \dfrac{-2 + 4}{2} = 1$ e $y_M = \dfrac{1 + 5}{2} = 3$.

```ad-example
Esempio 5: il punto medio con i segni e con le frazioni
Trova il punto medio del segmento $AB$ con $A(-3, 4)$ e $B(5, -2)$, poi quello del segmento $CD$ con $C(-1, 3)$ e $D(4, -2)$.

$$
\begin{gathered}
x_M = \frac{-3 + 5}{2} = 1 \\
y_M = \frac{4 + (-2)}{2} = 1
\end{gathered}
$$

Il punto medio di $AB$ è $M(1, 1)$. Per $CD$:

$$
\begin{gathered}
x_N = \frac{-1 + 4}{2} = \frac{3}{2} \\
y_N = \frac{3 + (-2)}{2} = \frac{1}{2}
\end{gathered}
$$

Il punto medio di $CD$ è $N\left(\dfrac{3}{2}, \dfrac{1}{2}\right)$. Le coordinate non intere si scrivono con le frazioni: con i decimali, $(1{,}5, 0{,}5)$, la virgola decimale si confonde con quella che separa le coordinate.
```

```ad-example
Esempio 6: un estremo dal punto medio
Il segmento $AB$ ha l'estremo $A(2, -1)$ e il punto medio $M(-1, 3)$. Trova $B$.

Nella formula del punto medio l'incognita è $x_B$. Moltiplicando per $2$ i due membri di $x_M = \dfrac{x_A + x_B}{2}$ si ha $2x_M = x_A + x_B$, e quindi

$$
\begin{gathered}
x_B = 2x_M - x_A \\
y_B = 2y_M - y_A
\end{gathered}
$$

Con i numeri:

$$
\begin{gathered}
x_B = 2 \cdot (-1) - 2 = -4 \\
y_B = 2 \cdot 3 - (-1) = 7
\end{gathered}
$$

Quindi $B(-4, 7)$. Verifica: $\dfrac{2 + (-4)}{2} = -1$ e $\dfrac{-1 + 7}{2} = 3$, che sono le coordinate di $M$.
```

```ad-warning
La media tra un estremo e il punto medio
Nell'esempio 6 la media tra le coordinate di $A$ e di $M$ dà $\left(\dfrac{1}{2}, 1\right)$, che è il punto medio di $AM$, non l'altro estremo. Per trovare $B$ si parte da $2x_M = x_A + x_B$. Il controllo è veloce: $M$ deve venire a metà tra $A$ e il punto trovato.
```

## Punti simmetrici

### Rispetto a un punto

Il **simmetrico** di un punto $A$ rispetto a un punto $C$ è il punto $A'$ tale che $C$ sia il punto medio del segmento $AA'$. Si trova come l'estremo $B$ dell'esempio 6, con $C$ al posto di $M$:

$$
\begin{gathered}
x_{A'} = 2x_C - x_A \\
y_{A'} = 2y_C - y_A
\end{gathered}
$$

Per esempio il simmetrico di $A(1, 2)$ rispetto a $C(3, 0)$ è $A'(2 \cdot 3 - 1,\ 2 \cdot 0 - 2)$, cioè $A'(5, -2)$.

Se il centro di simmetria è l'origine, $x_C$ e $y_C$ sono zero e le due coordinate cambiano segno: il simmetrico di $(x, y)$ rispetto a $O$ è $(-x, -y)$.

### Rispetto agli assi

Il simmetrico di $P$ rispetto all'asse $x$ sta dall'altra parte dell'asse, sulla stessa verticale di $P$ e alla stessa distanza dall'asse: ha la stessa ascissa e l'ordinata opposta. Rispetto all'asse $y$ succede il contrario. Riassumendo, il punto $(x, y)$ ha come simmetrico

- rispetto all'asse $x$ il punto $(x, -y)$;
- rispetto all'asse $y$ il punto $(-x, y)$;
- rispetto all'origine il punto $(-x, -y)$.

Nella figura $P(3, 2)$ e i suoi tre simmetrici: $P_1$ rispetto all'asse $x$, $P_2$ rispetto all'asse $y$, $P_3$ rispetto all'origine.

```tikz
% nome: simmetrici-rispetto-assi-e-origine
% alt: Il punto P(3, 2) e i suoi simmetrici: P1(3, -2) rispetto all'asse x, P2(-3, 2) rispetto all'asse y e P3(-3, -2) rispetto all'origine, uniti a P da linee tratteggiate
% svg: simmetrici-rispetto-assi-e-origine-9046eaed.svg 266x183
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-4.5,-3.5) grid (4.5,3.5);
\draw[->] (-4.8,0) -- (5,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,4) node[above] {$y$};
\node[above left] at (0,0) {\scriptsize $O$};
\draw[dashed, blue!60] (3,2) -- (3,-2);
\draw[dashed, blue!60] (3,2) -- (-3,2);
\draw[dashed, blue!60] (3,2) -- (-3,-2);
\fill (3,2) circle (0.11) node[above right] {$P(3, 2)$};
\fill (3,-2) circle (0.11) node[below right] {$P_1(3, -2)$};
\fill (-3,2) circle (0.11) node[above left] {$P_2(-3, 2)$};
\fill (-3,-2) circle (0.11) node[below left] {$P_3(-3, -2)$};
\end{tikzpicture}
```

```ad-warning
Quale coordinata cambia
Nella simmetria rispetto all'asse $x$ il punto si sposta in verticale, quindi cambia l'ordinata: il simmetrico di $(3, 2)$ è $(3, -2)$, non $(-3, 2)$. Il nome dell'asse dice quale coordinata resta uguale.
```

```ad-note
Il baricentro di un triangolo
Il [baricentro](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/punti-notevoli-del-triangolo) $G$ di un triangolo $ABC$, il punto in cui si incontrano le tre mediane, ha come coordinate la media delle coordinate dei tre vertici:

$$
\begin{gathered}
x_G = \frac{x_A + x_B + x_C}{3} \\
y_G = \frac{y_A + y_B + y_C}{3}
\end{gathered}
$$

Con $A(-1, -2)$, $B(5, 0)$ e $C(2, 5)$ si ha $x_G = \dfrac{6}{3} = 2$ e $y_G = \dfrac{3}{3} = 1$, cioè $G(2, 1)$. Si arriva allo stesso punto con la proprietà delle mediane: il punto medio di $BC$ è $\left(\dfrac{7}{2}, \dfrac{5}{2}\right)$, e $G$ sta sulla mediana da $A$ a due terzi della sua lunghezza a partire da $A$.
```

## Triangoli e quadrilateri con le coordinate

Con la distanza e il punto medio si riconosce una figura dalle coordinate dei suoi vertici. Per un triangolo si calcolano i tre lati: se due sono uguali il triangolo è isoscele, se lo sono tutti e tre è equilatero. Se il quadrato del lato più lungo è uguale alla somma dei quadrati degli altri due, il triangolo è rettangolo (vale l'inverso del teorema di Pitagora), e l'angolo retto è opposto al lato più lungo. Per confrontare i lati conviene usare i quadrati delle distanze: niente radici e niente approssimazioni.

```ad-example
Esempio 7: perimetro e area di un triangolo isoscele
Il triangolo ha i vertici $A(1, 1)$, $B(5, 1)$ e $C(3, 5)$. Che triangolo è? Calcola perimetro e area.

$A$ e $B$ hanno la stessa ordinata, quindi $\overline{AB} = |5 - 1| = 4$. Per gli altri due lati serve la formula:

$$
\begin{aligned}
\overline{AC} &= \sqrt{(3 - 1)^2 + (5 - 1)^2} \\
&= \sqrt{4 + 16} = \sqrt{20} = 2\sqrt{5} \\
\overline{BC} &= \sqrt{(3 - 5)^2 + (5 - 1)^2} \\
&= \sqrt{4 + 16} = \sqrt{20} = 2\sqrt{5}
\end{aligned}
$$

$\overline{AC} = \overline{BC}$: il triangolo è isoscele sulla base $AB$. Il perimetro è

$$4 + 2\sqrt{5} + 2\sqrt{5} = 4 + 4\sqrt{5}$$

In un triangolo isoscele l'altezza relativa alla base cade nel punto medio della base, che qui è $\left(\dfrac{1 + 5}{2}, 1\right) = (3, 1)$. Da $(3, 1)$ a $C(3, 5)$ il segmento è verticale e lungo $4$: è l'altezza. L'area è $\dfrac{4 \cdot 4}{2} = 8$.
```

```ad-example
Esempio 8: riconoscere un triangolo rettangolo
Il triangolo ha i vertici $A(-3, -1)$, $B(1, 1)$ e $C(0, 3)$. È rettangolo? Calcola l'area.

I quadrati dei lati:

$$
\begin{gathered}
\overline{AB}^{\,2} = 4^2 + 2^2 = 20 \\
\overline{BC}^{\,2} = (-1)^2 + 2^2 = 5 \\
\overline{AC}^{\,2} = 3^2 + 4^2 = 25
\end{gathered}
$$

Il lato più lungo è $AC$, e $20 + 5 = 25$: il triangolo è rettangolo, con l'angolo retto in $B$, il vertice opposto ad $AC$. I cateti sono $\overline{AB} = \sqrt{20}$ e $\overline{BC} = \sqrt{5}$, e l'area è metà del loro prodotto:

$$\frac{\sqrt{20} \cdot \sqrt{5}}{2} = \frac{\sqrt{100}}{2} = 5$$

```tikz
% nome: triangolo-rettangolo-dalle-coordinate
% alt: Il triangolo con i vertici A(-3, -1), B(1, 1) e C(0, 3), rettangolo in B, nel piano cartesiano con la griglia
% svg: triangolo-rettangolo-dalle-coordinate-d894bcf4.svg 177x145
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-3.5,-1.5) grid (2.5,3.5);
\draw[->] (-3.8,0) -- (2.9,0) node[right] {$x$};
\draw[->] (0,-1.8) -- (0,3.9) node[above] {$y$};
\fill[blue!8] (-3,-1) -- (1,1) -- (0,3) -- cycle;
\draw[thick, blue!60] (-3,-1) -- (1,1) -- (0,3) -- cycle;
\draw (0.732,0.866) -- (0.598,1.134) -- (0.866,1.268);
\fill (-3,-1) circle (0.11) node[below] {$A(-3, -1)$};
\fill (1,1) circle (0.11) node[right] {$B(1, 1)$};
\fill (0,3) circle (0.11) node[above right] {$C(0, 3)$};
\end{tikzpicture}
```
```

```ad-warning
Confrontare i lati sbagliati
Il controllo con il teorema di Pitagora si fa con il lato più lungo da una parte: nell'esempio 8 è $25 = 20 + 5$. Il conto $\overline{AB}^{\,2} + \overline{AC}^{\,2} = 45$ non dice niente, perché $AC$ non è un cateto. E se nessuna delle tre combinazioni torna, il triangolo non è rettangolo.
```

Per i quadrilateri si usano i criteri della lezione [Parallelogrammi e trapezi](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi): un quadrilatero è un parallelogramma se le diagonali si tagliano a metà, cioè se hanno lo stesso punto medio; un parallelogramma con le diagonali congruenti è un rettangolo.

```ad-example
Esempio 9: il quarto vertice di un parallelogramma
I punti $A(-2, -1)$, $B(3, 0)$ e $C(4, 3)$ sono tre vertici del parallelogramma $ABCD$. Trova $D$ e di' se $ABCD$ è un rettangolo.

Nel parallelogramma $ABCD$ le diagonali sono $AC$ e $BD$, e si tagliano a metà nello stesso punto $M$. Il punto medio di $AC$ è

$$M\left(\frac{-2 + 4}{2}, \frac{-1 + 3}{2}\right) = M(1, 1)$$

$D$ è il simmetrico di $B$ rispetto a $M$:

$$
\begin{gathered}
x_D = 2 \cdot 1 - 3 = -1 \\
y_D = 2 \cdot 1 - 0 = 2
\end{gathered}
$$

Quindi $D(-1, 2)$. Per il rettangolo si confrontano le diagonali, con i quadrati:

$$
\begin{gathered}
\overline{AC}^{\,2} = 6^2 + 4^2 = 52 \\
\overline{BD}^{\,2} = (-4)^2 + 2^2 = 20
\end{gathered}
$$

Le diagonali non sono congruenti, quindi $ABCD$ è un parallelogramma ma non un rettangolo.

```tikz
% nome: parallelogramma-quarto-vertice
% alt: Il parallelogramma con i vertici A(-2, -1), B(3, 0), C(4, 3) e D(-1, 2); le diagonali AC e BD, tratteggiate, si incontrano nel loro punto medio comune M(1, 1)
% svg: parallelogramma-quarto-vertice-d2371d63.svg 171x133
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-2.5,-1.5) grid (4.5,3.5);
\draw[->] (-2.8,0) -- (5,0) node[right] {$x$};
\draw[->] (0,-1.8) -- (0,4) node[above] {$y$};
\fill[blue!8] (-2,-1) -- (3,0) -- (4,3) -- (-1,2) -- cycle;
\draw[thick, blue!60] (-2,-1) -- (3,0) -- (4,3) -- (-1,2) -- cycle;
\draw[dashed] (-2,-1) -- (4,3);
\draw[dashed] (3,0) -- (-1,2);
\fill (-2,-1) circle (0.12) node[below left] {$A$};
\fill (3,0) circle (0.12) node[below right] {$B$};
\fill (4,3) circle (0.12) node[above right] {$C$};
\fill (-1,2) circle (0.12) node[above left] {$D$};
\fill (1,1) circle (0.12) node[below] {$M$};
\end{tikzpicture}
```
```

```ad-warning
L'ordine dei vertici
Nel nome $ABCD$ i vertici si leggono in ordine lungo il contorno, quindi $A$ è opposto a $C$ e $B$ è opposto a $D$: le diagonali sono $AC$ e $BD$. Se nell'esempio 9 prendi il punto medio di $AB$ e il simmetrico di $C$ rispetto a quello, trovi $(-3, -4)$: è il quarto vertice del parallelogramma $ACBD$, che ha $AB$ come diagonale, non di $ABCD$.
```
