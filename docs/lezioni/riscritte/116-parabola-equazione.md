# La parabola nel piano cartesiano

Un'antenna parabolica raccoglie i segnali che arrivano paralleli al suo asse e li rimanda tutti nello stesso punto, dove sta il ricevitore: quel punto è il fuoco. Nella lezione [La parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) la parabola era il grafico di $y = ax^2 + bx + c$, con il suo vertice e il suo asse di simmetria. Qui la stessa curva viene definita come luogo di punti, con un fuoco e una direttrice, come la [circonferenza](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/equazione-della-circonferenza) è definita con un centro e un raggio. Da questa definizione vengono anche le parabole con l'asse orizzontale, che non sono grafici di funzioni, e i modi per scrivere l'equazione di una parabola quando se ne conoscono alcuni elementi.

## La parabola come luogo geometrico

Fissa nel piano un punto $F$ e una retta $d$ che non passa per $F$. La **parabola** di **fuoco** $F$ e **direttrice** $d$ è il luogo dei punti del piano che hanno la stessa distanza da $F$ e da $d$. Un punto $P$ sta sulla parabola se e solo se

$$\overline{PF} = \overline{PH}$$

dove $H$ è il piede della perpendicolare condotta da $P$ alla direttrice, e $\overline{PH}$ è quindi la distanza di $P$ da $d$.

La retta che passa per il fuoco ed è perpendicolare alla direttrice è l'**asse** della parabola: è il suo asse di simmetria. Il punto dell'asse che sta a metà strada tra il fuoco e la direttrice ha la stessa distanza dai due, quindi appartiene alla parabola: è il **vertice** $V$.

```tikz
% nome: parabola-fuoco-direttrice-luogo
% alt: La parabola di fuoco F(0, 1) e direttrice d, la retta y = -1: un punto P della parabola ha la stessa distanza dal fuoco e dalla direttrice, cioè i segmenti PF e PH sono uguali; il vertice V è l'origine, a metà tra fuoco e direttrice
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-5,-2) grid (5,5);
\draw[->] (-5.3,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,5.6) node[above] {$y$};
\draw[thick, blue!60, domain=-4.3:4.3, samples=60, smooth] plot (\x, {0.25*\x*\x});
\draw[thick, orange!80] (-5,-1) -- (5,-1);
\draw[thick, red!50] (0,1) -- (3,2.25) -- (3,-1);
\draw[thin] (3,-0.7) -- (3.3,-0.7) -- (3.3,-1);
\fill (0,1) circle (0.11);
\fill (3,2.25) circle (0.11);
\fill (3,-1) circle (0.11);
\fill (0,0) circle (0.11);
\node[above left] at (0,1) {$F$};
\node[right] at (3.1,2.2) {$P$};
\node[below] at (3,-1) {$H$};
\node[below left] at (0,0) {$V$};
\node[orange!80!black, below] at (-4,-1) {$d$};
\end{tikzpicture}
```
```grafico
% nome: parabola-luogo-punto-cursore
% alt: La parabola di fuoco F(0, 1) e direttrice y = -1 con un punto P che si muove sulla curva con il cursore u e il piede H della perpendicolare da P alla direttrice: sotto il piano sono scritte le distanze PF e PH, che restano uguali per ogni posizione di P e valgono 1 nel vertice
curva: y=\frac{1}{4}x^2
curva: y=-1 | arancione
curva: x=u | tratteggiata | grigio
curva: F=\left(0;1\right) | rosso
curva: P=\left(u;\frac{u^2}{4}\right) | nero
curva: H=\left(u;-1\right) | nero
cursore: u = 3 da -5 a 5 passo 0,5
finestra: x da -8 a 8, y da -4 a 8
valore: \overline{PF} = \sqrt{u^2+\left(\frac{u^2}{4}-1\right)^2}
valore: \overline{PH} = \frac{u^2}{4}+1
domanda: Sposta $P$ lungo la parabola con il cursore $u$: le due distanze restano uguali? In quale punto sono più piccole, e quanto valgono lì?
```

Nella figura il fuoco è $F(0, 1)$ e la direttrice è la retta $y = -1$. Il punto $P\Big(3, \dfrac{9}{4}\Big)$ sta sulla parabola: la sua distanza dalla direttrice è $\dfrac{9}{4} + 1 = \dfrac{13}{4}$, e la sua distanza dal fuoco è

$$\overline{PF} = \sqrt{3^2 + \Big(\frac{9}{4} - 1\Big)^2} = \sqrt{\frac{169}{16}} = \frac{13}{4}$$

Lo stesso succede per ogni altro punto della curva: le due distanze sono sempre uguali. Sono più piccole nel vertice, dove valgono tutte e due $1$, la metà della distanza tra il fuoco e la direttrice.

## La parabola con il vertice nell'origine

Metti il vertice nell'origine e l'asse della parabola sull'asse $y$. Il fuoco è allora un punto $F(0, f)$ dell'asse $y$, con $f \neq 0$, e la direttrice, che sta dall'altra parte del vertice alla stessa distanza, è la retta $y = -f$.

Per un punto $P(x, y)$ la distanza dal fuoco è $\sqrt{x^2 + (y - f)^2}$ e la distanza dalla direttrice è $|y + f|$. I due numeri non sono negativi, quindi sono uguali esattamente quando sono uguali i loro quadrati:

$$
\begin{gathered}
x^2 + (y - f)^2 = (y + f)^2 \\
\Rightarrow x^2 + y^2 - 2fy + f^2 = y^2 + 2fy + f^2 \\
\Rightarrow x^2 = 4fy \\
\Rightarrow y = \frac{1}{4f}\,x^2
\end{gathered}
$$

Ponendo $a = \dfrac{1}{4f}$ si ottiene $y = ax^2$, l'equazione che conosci. Ogni passaggio vale anche al contrario, quindi i punti che rendono vera $y = ax^2$ sono tutti e soli i punti equidistanti da $F$ e da $d$. Da $a = \dfrac{1}{4f}$ si ricava $f = \dfrac{1}{4a}$: la parabola $y = ax^2$ ha

$$
\begin{gathered}
\text{fuoco } F\Big(0, \frac{1}{4a}\Big) \\
\text{direttrice } y = -\frac{1}{4a}
\end{gathered}
$$

Se $a > 0$ il fuoco sta sopra il vertice e la concavità è verso l'alto; se $a < 0$ il fuoco sta sotto e la concavità è verso il basso. Il fuoco sta sempre dalla parte della concavità, la direttrice dall'altra, e la parabola non incontra mai la direttrice.

```ad-example
Esempio 1: fuoco e direttrice di y = ax²
Trova fuoco e direttrice delle parabole $y = \dfrac{1}{4}x^2$, $y = x^2$ e $y = -2x^2$.

Per la prima, $\dfrac{1}{4a} = \dfrac{1}{4 \cdot \frac{1}{4}} = 1$: il fuoco è $F(0, 1)$ e la direttrice è $y = -1$. È la parabola della figura.

Per la seconda, $\dfrac{1}{4a} = \dfrac{1}{4}$: il fuoco è $F\Big(0, \dfrac{1}{4}\Big)$ e la direttrice è $y = -\dfrac{1}{4}$.

Per la terza, $\dfrac{1}{4a} = \dfrac{1}{4 \cdot (-2)} = -\dfrac{1}{8}$: il fuoco è $F\Big(0, -\dfrac{1}{8}\Big)$, sotto il vertice, e la direttrice è $y = \dfrac{1}{8}$, sopra.
```

La distanza tra il fuoco e il vertice è $\dfrac{1}{4|a|}$: più $|a|$ è grande, più il fuoco è vicino al vertice e più la parabola è stretta. Nella figura, $y = x^2$ ha il fuoco a distanza $\dfrac{1}{4}$ dal vertice, e $y = \dfrac{1}{4}x^2$ a distanza $1$.

```tikz
% nome: parabole-fuoco-vicino-lontano
% alt: Due parabole con il vertice nell'origine: y = x², più stretta, con il fuoco in (0, 1/4) e la direttrice y = -1/4, e y = un quarto di x², più larga, con il fuoco in (0, 1) e la direttrice y = -1
\begin{tikzpicture}[scale=0.7]
\draw[gray!25, very thin] (-4,-2) grid (4,4);
\draw[->] (-4.3,0) -- (4.6,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,4.6) node[above] {$y$};
\draw[thick, blue!60, domain=-4:4, samples=60, smooth] plot (\x, {0.25*\x*\x});
\draw[thick, teal!70, domain=-2:2, samples=60, smooth] plot (\x, {\x*\x});
\draw[thick, dashed, blue!60] (-4,-1) -- (4,-1);
\draw[thick, dashed, teal!70] (-4,-0.25) -- (4,-0.25);
\fill[blue!60] (0,1) circle (0.1);
\fill[teal!70] (0,0.25) circle (0.1);
\node[blue!60!black, left] at (0,1.3) {\scriptsize $(0, 1)$};
\draw[thin, teal!70] (0,0.25) -- (0.7,-1.35);
\node[teal!70!black, right] at (0.6,-1.6) {\small $\big(0, \frac{1}{4}\big)$};
\node[teal!70!black, above] at (2,4) {\small $y = x^2$};
\node[blue!60!black, right] at (4.05,3.7) {\small $y = \frac{1}{4}x^2$};
\end{tikzpicture}
```
```grafico
% nome: parabola-fuoco-direttrice-cursore-a
% alt: La parabola y = ax² con il cursore del coefficiente a, il fuoco F e la direttrice tratteggiata: quando a cresce il fuoco e la direttrice si avvicinano al vertice e la parabola si stringe, con a negativo il fuoco passa sotto il vertice e la direttrice sopra, e per a = 0 la curva è l'asse x e il fuoco non esiste
curva: y=ax^2
curva: F=\left(0;\frac{1}{4a}\right) | rosso
curva: y=-\frac{1}{4a} | tratteggiata | arancione
cursore: a = 0,25 da -2 a 2 passo 0,05
finestra: x da -6 a 6, y da -4 a 5
valore: F = \left(0;\frac{1}{4a}\right)
domanda: Aumenta $a$: il fuoco si avvicina al vertice o se ne allontana? Poi porta $a$ a $0$: la curva è ancora una parabola, e il fuoco esiste?
```

Quando $a$ aumenta il fuoco e la direttrice si avvicinano al vertice. Per $a = 0$ l'equazione diventa $y = 0$, che è l'asse $x$: non è una parabola, e $\dfrac{1}{4a}$ non si può calcolare. Per questo si chiede $a \neq 0$.

```ad-warning
Uno su quattro a, non a quarti
L'ordinata del fuoco di $y = ax^2$ è $\dfrac{1}{4a}$, con $a$ al denominatore. Per $y = 2x^2$ il fuoco è $\Big(0, \dfrac{1}{8}\Big)$, non $\Big(0, \dfrac{1}{2}\Big)$ e nemmeno $(0, 8)$.
```

## La parabola con asse parallelo all'asse y

Ogni equazione $y = ax^2 + bx + c$, con $a \neq 0$, si può riscrivere mettendo in evidenza il vertice $V(x_V, y_V)$:

$$y - y_V = a(x - x_V)^2$$

dove $x_V = -\dfrac{b}{2a}$ e $y_V = -\dfrac{\Delta}{4a}$, con $\Delta = b^2 - 4ac$, come nella lezione [La parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola). Sviluppando il quadrato si ritrova $y = ax^2 + bx + c$.

Questa è l'equazione di $y = ax^2$ dopo una traslazione che porta l'origine in $V$, come nella lezione [Trasformazioni geometriche](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/trasformazioni-geometriche). Una traslazione non cambia le distanze: la curva traslata è ancora una parabola, e il suo fuoco e la sua direttrice sono quelli di $y = ax^2$ spostati allo stesso modo. Il fuoco sta quindi sull'asse e la sua ordinata si ottiene aggiungendo $\dfrac{1}{4a}$ a quella del vertice; per la direttrice lo stesso numero si toglie:

| Elemento | Dal vertice | Dai coefficienti |
|---|---|---|
| vertice | $V(x_V, y_V)$ | $V\Big(-\dfrac{b}{2a}, -\dfrac{\Delta}{4a}\Big)$ |
| asse | $x = x_V$ | $x = -\dfrac{b}{2a}$ |
| fuoco | $F\Big(x_V, y_V + \dfrac{1}{4a}\Big)$ | $F\Big(-\dfrac{b}{2a}, \dfrac{1 - \Delta}{4a}\Big)$ |
| direttrice | $y = y_V - \dfrac{1}{4a}$ | $y = -\dfrac{1 + \Delta}{4a}$ |

Le due colonne dicono la stessa cosa. Quella di sinistra si ricorda meglio: trovato il vertice, il fuoco e la direttrice si ottengono aggiungendo e togliendo $\dfrac{1}{4a}$ alla sua ordinata.

```ad-example
Esempio 2: vertice, fuoco, asse e direttrice
Trova gli elementi della parabola $y = \dfrac{1}{4}x^2 - x - 1$.

Qui $a = \dfrac{1}{4}$, $b = -1$, $c = -1$. Il vertice:

$$
\begin{gathered}
x_V = -\frac{-1}{2 \cdot \frac{1}{4}} = 2 \\
y_V = \frac{1}{4} \cdot 4 - 2 - 1 = -2
\end{gathered}
$$

Quindi $V(2, -2)$ e l'asse è $x = 2$. Poi $\dfrac{1}{4a} = 1$: il fuoco è un'unità sopra il vertice, $F(2, -1)$, e la direttrice un'unità sotto, $y = -3$.

Controllo con le formule dei coefficienti: $\Delta = 1 + 1 = 2$, quindi l'ordinata del fuoco è $\dfrac{1 - 2}{1} = -1$ e la direttrice è $y = -\dfrac{1 + 2}{1} = -3$.

```tikz
% nome: parabola-vertice-fuoco-direttrice-esempio
% alt: La parabola y = un quarto di x² meno x meno 1, con il vertice V(2, -2), il fuoco F(2, -1), l'asse x = 2 tratteggiato e la direttrice y = -3
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-3,-4) grid (7,4);
\draw[->] (-3.3,0) -- (7.6,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,4.6) node[above] {$y$};
\node[above] at (2,0) {\small $2$};
\node[above left] at (0,-3) {\small $-3$};
\draw[dashed, gray] (2,-4) -- (2,4);
\draw[thick, orange!80] (-3,-3) -- (7,-3);
\draw[thick, blue!60, domain=-2.8:6.8, samples=60, smooth] plot (\x, {0.25*\x*\x - \x - 1});
\fill (2,-2) circle (0.13);
\fill (2,-1) circle (0.13);
\node[below right] at (2,-2) {$V$};
\node[above right] at (2,-1) {$F$};
\node[orange!80!black, below] at (6,-3) {$d$};
\end{tikzpicture}
```
```

```ad-example
Esempio 3: concavità verso il basso
Trova fuoco e direttrice della parabola $y = -2x^2 - 4x + 1$.

Qui $a = -2$, $b = -4$, $c = 1$.

$$
\begin{gathered}
x_V = -\frac{-4}{2 \cdot (-2)} = -1 \\
y_V = -2 \cdot 1 + 4 + 1 = 3
\end{gathered}
$$

Il vertice è $V(-1, 3)$. Ora $\dfrac{1}{4a} = -\dfrac{1}{8}$ è negativo: aggiungendolo all'ordinata del vertice si scende, togliendolo si sale.

$$
\begin{gathered}
y_F = 3 - \frac{1}{8} = \frac{23}{8} \\
\text{direttrice: } y = 3 + \frac{1}{8} = \frac{25}{8}
\end{gathered}
$$

Il fuoco $F\Big(-1, \dfrac{23}{8}\Big)$ sta sotto il vertice, dalla parte della concavità, e la direttrice sta sopra.
```

## La parabola con asse parallelo all'asse x

Se la direttrice è verticale, l'asse della parabola è orizzontale. Tutto quello che è stato detto si ripete scambiando i ruoli di $x$ e $y$: la parabola con il vertice nell'origine e il fuoco $F(f, 0)$ sull'asse $x$ ha equazione $x = ay^2$, con $a = \dfrac{1}{4f}$, e in generale una parabola con asse parallelo all'asse $x$ ha equazione

$$x = ay^2 + by + c$$

con $a \neq 0$. Le formule sono quelle di prima con le coordinate scambiate, e $\Delta = b^2 - 4ac$:

| Elemento | $y = ax^2 + bx + c$ | $x = ay^2 + by + c$ |
|---|---|---|
| asse | $x = -\dfrac{b}{2a}$ | $y = -\dfrac{b}{2a}$ |
| vertice | $\Big(-\dfrac{b}{2a}, -\dfrac{\Delta}{4a}\Big)$ | $\Big(-\dfrac{\Delta}{4a}, -\dfrac{b}{2a}\Big)$ |
| fuoco | $\Big(-\dfrac{b}{2a}, \dfrac{1 - \Delta}{4a}\Big)$ | $\Big(\dfrac{1 - \Delta}{4a}, -\dfrac{b}{2a}\Big)$ |
| direttrice | $y = -\dfrac{1 + \Delta}{4a}$ | $x = -\dfrac{1 + \Delta}{4a}$ |
| concavità | verso l'alto se $a > 0$, verso il basso se $a < 0$ | verso destra se $a > 0$, verso sinistra se $a < 0$ |

Una parabola con asse orizzontale non è il grafico di una funzione di $x$: una retta verticale può incontrarla in due punti, e nella lezione [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione) questo non è ammesso. Anche le intersezioni con gli assi si scambiano: con $y = 0$ si trova il solo punto $(c, 0)$ sull'asse $x$, mentre con $x = 0$ si risolve $ay^2 + by + c = 0$ e sull'asse $y$ i punti possono essere due, uno o nessuno.

```ad-example
Esempio 4: una parabola con asse orizzontale
Trova gli elementi della parabola $x = -y^2 + 2y + 3$ e le sue intersezioni con gli assi.

Qui $a = -1$, $b = 2$, $c = 3$: la concavità è verso sinistra. Nella formula $-\dfrac{b}{2a}$ adesso c'è l'ordinata del vertice, e l'ascissa si trova sostituendo:

$$
\begin{gathered}
y_V = -\frac{2}{2 \cdot (-1)} = 1 \\
x_V = -1 + 2 + 3 = 4
\end{gathered}
$$

Il vertice è $V(4, 1)$ e l'asse è la retta $y = 1$. Poi $\dfrac{1}{4a} = -\dfrac{1}{4}$: il fuoco è $F\Big(4 - \dfrac{1}{4}, 1\Big) = F\Big(\dfrac{15}{4}, 1\Big)$ e la direttrice è $x = 4 + \dfrac{1}{4} = \dfrac{17}{4}$.

Con $y = 0$ si ha $x = 3$: la parabola incontra l'asse $x$ in $(3, 0)$. Con $x = 0$:

$$
\begin{gathered}
-y^2 + 2y + 3 = 0 \\
\Rightarrow y^2 - 2y - 3 = 0 \\
\Rightarrow y_1 = -1, \quad y_2 = 3
\end{gathered}
$$

La parabola incontra l'asse $y$ in $(0, -1)$ e $(0, 3)$.

```tikz
% nome: parabola-asse-orizzontale-esempio
% alt: La parabola x = -y² + 2y + 3, con la concavità verso sinistra, il vertice V(4, 1), l'asse y = 1 tratteggiato, la direttrice verticale x = 17/4 e le intersezioni (3, 0) con l'asse x e (0, -1) e (0, 3) con l'asse y
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-4,-2) grid (5,4);
\draw[->] (-4.3,0) -- (5.7,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,4.6) node[above] {$y$};
\draw[dashed, gray] (-4,1) -- (5,1);
\draw[thick, orange!80] (4.25,-2) -- (4.25,4);
\draw[thick, blue!60, domain=-1.6:3.6, samples=60, smooth] plot ({-\x*\x + 2*\x + 3}, \x);
\fill (4,1) circle (0.11);
\fill (3.75,1) circle (0.11);
\fill (3,0) circle (0.11);
\fill (0,-1) circle (0.11);
\fill (0,3) circle (0.11);
\node[below right] at (4.2,1) {$V$};
\node[above left] at (3.75,1) {$F$};
\node[below left] at (3,0) {\small $3$};
\node[left] at (0,-1) {\small $-1$};
\node[left] at (0,3.2) {\small $3$};
\node[orange!80!black, right] at (4.25,3.5) {$d$};
\end{tikzpicture}
```
```grafico
% nome: parabola-asse-orizzontale-cursori
% alt: La parabola x = ay² + by + c con i cursori dei tre coefficienti, il vertice, il fuoco e la direttrice verticale tratteggiata: con a positivo la concavità è verso destra, con a negativo verso sinistra, e per a = 0 la curva diventa una retta, senza vertice né fuoco
curva: x=ay^2+by+c
curva: x=-\frac{1+b^2-4ac}{4a} | tratteggiata | arancione
curva: F=\left(\frac{1-b^2+4ac}{4a};-\frac{b}{2a}\right) | rosso
curva: V=\left(c-\frac{b^2}{4a};-\frac{b}{2a}\right) | nero
cursore: a = -1 da -2 a 2 passo 0,1
cursore: b = 2 da -4 a 4 passo 0,1
cursore: c = 3 da -4 a 4 passo 0,1
finestra: x da -7 a 7, y da -4 a 6
valore: V = \left(c-\frac{b^2}{4a};-\frac{b}{2a}\right)
domanda: Porta $a$ da $-1$ a $1$ passando per $0$: che cosa diventa la curva quando $a = 0$, e da che parte si apre dopo?
```

Per $a = 0$ resta $x = by + c$, una retta, senza vertice né fuoco. Con $a$ positivo la concavità è verso destra, e la direttrice passa a sinistra del vertice.
```

```ad-warning
In x = ay² + by + c le formule si scambiano
Per $x = -y^2 + 2y + 3$ il numero $-\dfrac{b}{2a} = 1$ è l'ordinata del vertice, non l'ascissa: il vertice è $(4, 1)$, non $(1, 4)$. E il termine noto $c = 3$ dà il punto $(3, 0)$ sull'asse $x$, non $(0, 3)$.
```

## Trovare l'equazione di una parabola

Nell'equazione $y = ax^2 + bx + c$ (o $x = ay^2 + by + c$) ci sono tre coefficienti: servono tre condizioni, e va detto se l'asse è parallelo all'asse $y$ o all'asse $x$. Il passaggio per un punto vale una condizione; conoscere il vertice o il fuoco ne vale due, perché ognuno dà due coordinate; conoscere la direttrice o l'asse ne vale una.

### Fuoco e direttrice

Si scrive la definizione: la distanza di $P(x, y)$ dal fuoco è uguale alla sua distanza dalla direttrice. La forma della direttrice dice anche com'è l'asse: direttrice orizzontale, asse parallelo all'asse $y$; direttrice verticale, asse parallelo all'asse $x$.

```ad-example
Esempio 5: fuoco e direttrice orizzontale
Scrivi l'equazione della parabola di fuoco $F(2, 1)$ e direttrice $y = -1$.

La distanza di $P(x, y)$ dalla direttrice è $|y + 1|$. Uguaglia i quadrati delle due distanze:

$$
\begin{gathered}
(x - 2)^2 + (y - 1)^2 = (y + 1)^2 \\
\Rightarrow (x - 2)^2 + y^2 - 2y + 1 = y^2 + 2y + 1 \\
\Rightarrow (x - 2)^2 = 4y \\
\Rightarrow y = \frac{1}{4}x^2 - x + 1
\end{gathered}
$$

Controllo: il vertice sta a metà tra fuoco e direttrice, in $V(2, 0)$, e il fuoco è un'unità sopra, quindi $\dfrac{1}{4a} = 1$ e $a = \dfrac{1}{4}$. Infatti $y = \dfrac{1}{4}(x - 2)^2$.

```tikz
% nome: parabola-da-fuoco-e-direttrice-orizzontale
% alt: La parabola di fuoco F(2, 1) e direttrice y = -1: ha il vertice V(2, 0), a metà tra il fuoco e la direttrice, e la concavità verso l'alto
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-3,-2) grid (7,5);
\draw[->] (-3.3,0) -- (7.6,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,5.6) node[above] {$y$};
\draw[thick, orange!80] (-3,-1) -- (7,-1);
\draw[thick, blue!60, domain=-2.4:6.4, samples=60, smooth] plot (\x, {0.25*(\x-2)*(\x-2)});
\fill (2,1) circle (0.12);
\fill (2,0) circle (0.12);
\node[above] at (2,1.1) {$F$};
\node[below right] at (2,0) {$V$};
\node[orange!80!black, below] at (6,-1) {$d$};
\end{tikzpicture}
```
```grafico
% nome: parabola-fuoco-fisso-direttrice-cursore
% alt: Il luogo dei punti equidistanti dal fuoco F(2, 1) e dalla direttrice y = k, con il cursore k: il vertice sta sempre a metà tra fuoco e direttrice, e quando la direttrice si avvicina al fuoco la parabola si stringe
curva: \left(x-2\right)^2+\left(y-1\right)^2=\left(y-k\right)^2
curva: y=k | arancione
curva: F=\left(2;1\right) | rosso
curva: V=\left(2;\frac{1+k}{2}\right) | nero
cursore: k = -1 da -5 a 0,5 passo 0,5
finestra: x da -7 a 11, y da -7 a 9
valore: V = \left(2;\frac{1+k}{2}\right)
valore: a = \frac{1}{2\left(1-k\right)}
domanda: Il fuoco resta fermo. Avvicina la direttrice al fuoco, portando $k$ verso $1$: la parabola si stringe o si allarga? Dove sta il vertice?
```

La parabola si stringe: $a$ passa da $\dfrac{1}{4}$, per $k = -1$, a $1$, per $k = \dfrac{1}{2}$. Il vertice resta sempre a metà tra il fuoco e la direttrice.
```

```ad-example
Esempio 6: fuoco e direttrice verticale
Scrivi l'equazione della parabola di fuoco $F(1, 2)$ e direttrice $x = -1$.

La direttrice è verticale, quindi l'asse è orizzontale e la distanza di $P(x, y)$ dalla direttrice è $|x + 1|$:

$$
\begin{gathered}
(x - 1)^2 + (y - 2)^2 = (x + 1)^2 \\
\Rightarrow x^2 - 2x + 1 + (y - 2)^2 = x^2 + 2x + 1 \\
\Rightarrow (y - 2)^2 = 4x \\
\Rightarrow x = \frac{1}{4}y^2 - y + 1
\end{gathered}
$$

Il vertice è $V(0, 2)$, a metà tra il fuoco e la direttrice sulla retta $y = 2$, e la concavità è verso destra, dove sta il fuoco.

```tikz
% nome: parabola-fuoco-direttrice-verticale
% alt: La parabola x = un quarto di y² meno y più 1, con il fuoco F(1, 2), la direttrice verticale x = -1, il vertice V(0, 2) e l'asse y = 2 tratteggiato: la concavità è verso destra
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-2,-2) grid (5,6);
\draw[->] (-2.3,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,6.6) node[above] {$y$};
\draw[dashed, gray] (-2,2) -- (5,2);
\draw[thick, orange!80] (-1,-2) -- (-1,6);
\draw[thick, blue!60, domain=-1.9:5.9, samples=60, smooth] plot ({0.25*(\x-2)*(\x-2)}, \x);
\fill (1,2) circle (0.12);
\fill (0,2) circle (0.12);
\node[above right] at (1,2) {$F$};
\node[above left] at (0,2) {$V$};
\node[orange!80!black, left] at (-1,5.5) {$d$};
\node[below left] at (-1,0) {\small $-1$};
\end{tikzpicture}
```
```

### Vertice e un punto

Con il vertice $V(x_V, y_V)$ si parte dalla forma $y - y_V = a(x - x_V)^2$, in cui resta da trovare solo $a$: lo dà il passaggio per il punto. Per una parabola con asse parallelo all'asse $x$ la forma è $x - x_V = a(y - y_V)^2$.

```ad-example
Esempio 7: vertice e passaggio per un punto
Trova la parabola con asse parallelo all'asse $y$, vertice $V(2, 3)$, che passa per $A(0, 1)$.

L'equazione ha la forma $y - 3 = a(x - 2)^2$. Sostituisci le coordinate di $A$:

$$
\begin{gathered}
1 - 3 = a(0 - 2)^2 \\
\Rightarrow -2 = 4a \\
\Rightarrow a = -\frac{1}{2}
\end{gathered}
$$

$$y = -\frac{1}{2}(x - 2)^2 + 3 = -\frac{1}{2}x^2 + 2x + 1$$

La concavità è verso il basso: il punto $A$ sta più in basso del vertice, e così deve essere.

```tikz
% nome: parabola-da-vertice-e-punto
% alt: La parabola y = -1/2 x² + 2x + 1, con il vertice V(2, 3) e la concavità verso il basso, che passa per il punto A(0, 1)
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-2,-3) grid (6,4);
\draw[->] (-2.3,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,4.6) node[above] {$y$};
\draw[thick, blue!60, domain=-1.4:5.4, samples=60, smooth] plot (\x, {-0.5*(\x-2)*(\x-2) + 3});
\fill (2,3) circle (0.12);
\fill (0,1) circle (0.12);
\node[above] at (2,3.1) {$V$};
\node[left] at (-0.1,1.2) {$A$};
\end{tikzpicture}
```
```grafico
% nome: parabola-vertice-fisso-cursore-a
% alt: Le parabole di vertice V(2, 3), y = a(x - 2)² + 3, con il cursore a e il punto fermo A(0, 1): sotto il piano è scritta l'ordinata della parabola per x = 0, che vale 1 solo per a = -0,5, quando la parabola passa per A
curva: y=a\left(x-2\right)^2+3
curva: V=\left(2;3\right) | nero
curva: A=\left(0;1\right) | rosso
cursore: a = 1 da -2 a 2 passo 0,1
finestra: x da -6 a 10, y da -7 a 9
valore: y(0) = 4a+3
domanda: Tutte queste parabole hanno il vertice in $V$. Muovi $a$ finché la curva passa per $A$: per quale valore succede? Che cosa resta per $a = 0$?
```

Passa per $A$ solo per $a = -0{,}5$, quando l'ordinata per $x = 0$, che è $4a + 3$, vale $1$. Per $a = 0$ resta la retta orizzontale $y = 3$, che non è una parabola.
```

Con il vertice e il fuoco si procede nello stesso modo: la differenza $y_F - y_V$ tra le loro ordinate è $\dfrac{1}{4a}$. Se $V(1, 2)$ e $F(1, 3)$, il fuoco è un'unità sopra il vertice, quindi $\dfrac{1}{4a} = 1$, $a = \dfrac{1}{4}$ e la parabola è $y - 2 = \dfrac{1}{4}(x - 1)^2$.

### Tre punti

Per tre punti non allineati e con ascisse diverse passa una sola parabola con asse parallelo all'asse $y$. Come per la [circonferenza per tre punti](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/equazione-della-circonferenza), ogni punto dà un'equazione di primo grado nei coefficienti.

```ad-example
Esempio 8: la parabola per tre punti
Trova la parabola $y = ax^2 + bx + c$ che passa per $A(-1, 6)$, $B(1, 0)$ e $D(2, 3)$.

Sostituisci le coordinate dei tre punti:

$$
\begin{cases}
a - b + c = 6 \\
a + b + c = 0 \\
4a + 2b + c = 3
\end{cases}
$$

Sottraendo la prima equazione dalla seconda ottieni $2b = -6$, cioè $b = -3$. La seconda diventa $a + c = 3$ e la terza $4a + c = 9$; sottraendole, $3a = 6$:

$$a = 2, \quad c = 1$$

La parabola è $y = 2x^2 - 3x + 1$. Verifica con $D$: $8 - 6 + 1 = 3$.
```

```ad-warning
Tre punti non bastano a dire com'è l'asse
Se i tre punti hanno anche ordinate diverse, per loro passa pure una parabola con asse parallelo all'asse $x$, che ha un'altra equazione. Il testo deve dire com'è l'asse, a parole o con la forma richiesta: $y = ax^2 + bx + c$ oppure $x = ay^2 + by + c$.
```

Le condizioni che riguardano una retta tangente, insieme alle posizioni di una retta rispetto a una parabola, sono nella lezione [Parabola e rette](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/parabola-e-rette).
