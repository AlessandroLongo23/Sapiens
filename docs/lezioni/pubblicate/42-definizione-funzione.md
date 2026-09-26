# Definizione di funzione

A ogni studente della tua classe corrisponde il giorno in cui è nato, e uno solo: nessuno è nato in due giorni diversi. A ogni numero corrisponde il suo doppio, e anche qui il risultato è uno solo. Quando una relazione ha questa caratteristica, cioè quando a ogni elemento di partenza corrisponde uno e un solo elemento di arrivo, si chiama funzione. Le funzioni sono il modo in cui la matematica descrive una grandezza che dipende da un'altra: il prezzo dal peso, lo spazio percorso dal tempo, l'area di un quadrato dal lato.

## Funzione: una relazione con una sola immagine

Una relazione tra due insiemi $A$ e $B$ è un sottoinsieme del prodotto cartesiano $A \times B$, cioè un insieme di coppie ordinate $(x, y)$ con $x \in A$ e $y \in B$ (le trovi nelle lezioni [Relazioni binarie](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/relazioni-binarie) e [Prodotto cartesiano](/materiale/scuola-superiore/matematica/insiemi-e-logica/prodotto-cartesiano)).

Una **funzione** da $A$ a $B$ è una relazione tra $A$ e $B$ che associa a ogni elemento di $A$ uno e un solo elemento di $B$. L'elemento di $B$ associato a $x$ si chiama **immagine** di $x$. Nella definizione ci sono due richieste, e servono tutte e due:

- ogni elemento di $A$ ha almeno un'immagine: nessuno resta senza;
- ogni elemento di $A$ ha al massimo un'immagine: nessuno ne ha due.

Sugli elementi di $B$ la definizione non chiede niente. Un elemento di $B$ può essere l'immagine di più elementi di $A$, di uno solo o di nessuno. Alcuni libri chiamano la funzione anche applicazione: le due parole vogliono dire la stessa cosa.

Prendi $A = \{1,\ 2,\ 3,\ 4\}$, $B = \{0,\ 1,\ 2\}$ e associa a ogni numero di $A$ il resto della sua divisione per $3$:

$$
\begin{gathered}
1 \mapsto 1, \qquad 2 \mapsto 2, \\
3 \mapsto 0, \qquad 4 \mapsto 1
\end{gathered}
$$

Ogni numero di $A$ ha un resto, e uno solo: è una funzione. Il numero $1$ di $B$ è l'immagine sia di $1$ sia di $4$, e questo è permesso.

```tikz
% nome: diagramma-frecce-funzione-resto
% alt: Diagramma a frecce della funzione che associa a 1, 2, 3, 4 il resto della divisione per 3: 1 va in 1, 2 in 2, 3 in 0, 4 in 1, e da ogni elemento di A parte una sola freccia
% svg: diagramma-frecce-funzione-resto-a6da6afc.svg 170x207
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 2.4);
\draw (3,0) ellipse (0.7 and 2.4);
\node at (0,2.75) {$A$};
\node at (3,2.75) {$B$};
\node (l0) at (0,1.35) {$1$};
\node (l1) at (0,0.45) {$2$};
\node (l2) at (0,-0.45) {$3$};
\node (l3) at (0,-1.35) {$4$};
\node (r0) at (3,0.90) {$0$};
\node (r1) at (3,0.00) {$1$};
\node (r2) at (3,-0.90) {$2$};
\draw[->, shorten >=2pt, shorten <=2pt] (l0) -- (r1);
\draw[->, shorten >=2pt, shorten <=2pt] (l1) -- (r2);
\draw[->, shorten >=2pt, shorten <=2pt] (l2) -- (r0);
\draw[->, shorten >=2pt, shorten <=2pt] (l3) -- (r1);
\end{tikzpicture}
```

```ad-note
Non serve una formula
Una funzione è una regola che associa, non per forza un conto. La relazione che associa a ogni studente il suo giorno di nascita è una funzione anche se nessuna formula la calcola; lo stesso vale per una tabella o un diagramma a frecce, purché ogni elemento di partenza abbia una e una sola immagine.
```

### Riconoscere una funzione dal diagramma a frecce

Nel diagramma a frecce gli elementi di $A$ stanno a sinistra, quelli di $B$ a destra, e una freccia va da ogni $x$ alla sua immagine. La relazione è una funzione se da ogni elemento di $A$ parte una e una sola freccia. Nel diagramma del resto è così: quattro elementi a sinistra, quattro frecce, una per ciascuno.

Le due relazioni della figura, da $A = \{1,\ 2,\ 3\}$ a $B = \{a,\ b\}$, non sono funzioni. Nella prima da $1$ partono due frecce, quindi $1$ avrebbe due immagini. Nella seconda da $2$ non parte nessuna freccia, quindi $2$ non avrebbe immagine.

```tikz
% nome: relazioni-che-non-sono-funzioni
% alt: Due diagrammi a frecce da A = {1, 2, 3} a B = {a, b} che non sono funzioni: nel primo da 1 partono due frecce, verso a e verso b; nel secondo da 2 non parte nessuna freccia
% svg: relazioni-che-non-sono-funzioni-d8e8c33e.svg 345x213
\begin{tikzpicture}
\draw (0,0) ellipse (0.6 and 1.9);
\draw (2.6,0) ellipse (0.6 and 1.9);
\node at (0,2.25) {$A$};
\node at (2.6,2.25) {$B$};
\node (a1) at (0,0.90) {$1$};
\node (a2) at (0,0.00) {$2$};
\node (a3) at (0,-0.90) {$3$};
\node (b1) at (2.6,0.45) {$a$};
\node (b2) at (2.6,-0.45) {$b$};
\draw[->, shorten >=2pt, shorten <=2pt] (a1) -- (b1);
\draw[->, shorten >=2pt, shorten <=2pt] (a1) -- (b2);
\draw[->, shorten >=2pt, shorten <=2pt] (a2) -- (b2);
\draw[->, shorten >=2pt, shorten <=2pt] (a3) -- (b1);
\node[align=center] at (1.3,-2.6) {da $1$ partono\\due frecce};
\begin{scope}[xshift=5.2cm]
\draw (0,0) ellipse (0.6 and 1.9);
\draw (2.6,0) ellipse (0.6 and 1.9);
\node at (0,2.25) {$A$};
\node at (2.6,2.25) {$B$};
\node (c1) at (0,0.90) {$1$};
\node (c2) at (0,0.00) {$2$};
\node (c3) at (0,-0.90) {$3$};
\node (d1) at (2.6,0.45) {$a$};
\node (d2) at (2.6,-0.45) {$b$};
\draw[->, shorten >=2pt, shorten <=2pt] (c1) -- (d1);
\draw[->, shorten >=2pt, shorten <=2pt] (c3) -- (d2);
\node[align=center] at (1.3,-2.6) {da $2$ non parte\\nessuna freccia};
\end{scope}
\end{tikzpicture}
```

```ad-warning
Contare le frecce che arrivano
Per decidere se una relazione è una funzione si guardano solo le frecce che partono da $A$. Se a un elemento di $B$ arrivano due frecce, o nessuna, la relazione può essere lo stesso una funzione, come quella del resto. Le frecce che arrivano in $B$ contano per altre proprietà, spiegate nella lezione [Funzioni iniettive, suriettive e biettive](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive).
```

### Riconoscere una funzione da un elenco di coppie

Se la relazione è data come elenco di coppie $(x, y)$, con $x \in A$ e $y \in B$, è una funzione quando ogni elemento di $A$ compare come primo elemento in una e una sola coppia. Un elemento di $A$ che non compare mai come primo elemento non ha immagine; uno che compare in due coppie con secondi elementi diversi ne ha due.

```ad-example
Esempio 1: tre relazioni da {1, 2, 3} a {a, b}
Con $A = \{1,\ 2,\ 3\}$ e $B = \{a,\ b\}$, quali di queste relazioni sono funzioni?

$$
\begin{gathered}
R_1 = \{(1, a),\ (2, a),\ (3, b)\} \\
R_2 = \{(1, a),\ (1, b), \\
(2, b),\ (3, a)\} \\
R_3 = \{(1, a),\ (3, b)\}
\end{gathered}
$$

$R_1$ è una funzione: $1$, $2$ e $3$ compaiono ciascuno come primo elemento di una sola coppia. Il fatto che $a$ sia l'immagine sia di $1$ sia di $2$ non conta.

$R_2$ non è una funzione: $1$ compare in due coppie, $(1, a)$ e $(1, b)$, quindi ha due immagini.

$R_3$ non è una funzione: $2$ non compare in nessuna coppia, quindi non ha immagine.

$R_2$ e $R_3$ sono le due relazioni disegnate nella figura precedente.
```

```ad-example
Esempio 2: la stessa regola, letta nei due versi
Prendi $A = \{0,\ 1,\ 4\}$ e $B = \{-2,\ -1,\ 0,\ 1,\ 2\}$. La relazione da $A$ a $B$ che associa a $x$ i numeri $y$ tali che $y^2 = x$ è una funzione?

Le coppie sono

$$
\begin{gathered}
(0, 0),\ (1, -1),\ (1, 1), \\
(4, -2),\ (4, 2)
\end{gathered}
$$

perché $(-1)^2 = 1^2 = 1$ e $(-2)^2 = 2^2 = 4$. Il numero $1$ compare in due coppie, e anche il $4$: non è una funzione.

Nel verso opposto, da $B$ ad $A$, la regola $y \mapsto y^2$ dà le coppie

$$
\begin{gathered}
(-2, 4),\ (-1, 1),\ (0, 0), \\
(1, 1),\ (2, 4)
\end{gathered}
$$

Ogni elemento di $B$ compare come primo elemento una volta sola: questa è una funzione. Che $1$ e $4$ siano immagini di due numeri diversi non conta.
```

## Notazione

Una funzione si indica di solito con una lettera minuscola, $f$, $g$, $h$. Per dire che $f$ è una funzione da $A$ a $B$ si scrive

$$f: A \to B$$

e si legge "$f$ da $A$ a $B$". L'insieme di partenza $A$ si chiama **dominio**, quello di arrivo $B$ **codominio**: li trovi spiegati, insieme all'insieme delle immagini, nella lezione [Dominio, codominio e immagine](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/dominio-codominio-e-immagine).

L'immagine di $x$ si scrive $f(x)$ e si legge "$f$ di $x$". Per dire che $f$ manda $x$ nella sua immagine si usa la freccia con il trattino, $x \mapsto f(x)$, che si legge "$x$ va in $f$ di $x$". Per la funzione del resto dell'esempio iniziale si scrive $f(4) = 1$, oppure $4 \mapsto 1$.

Quando $A$ e $B$ sono insiemi di numeri si scrive anche

$$y = f(x)$$

dove $x$ è l'elemento di partenza e $y$ la sua immagine. La $x$ si chiama **variabile indipendente**, perché la scegli tu tra gli elementi del dominio; la $y$ si chiama **variabile dipendente**, perché il suo valore dipende dalla $x$ scelta.

```ad-warning
Confondere $f$ con $f(x)$
$f$ è la funzione, cioè tutta la regola; $f(x)$ è un solo elemento di $B$, l'immagine di un certo $x$. E $f(x)$ non vuol dire "$f$ per $x$": le parentesi indicano a quale elemento si applica la funzione, non una moltiplicazione.
```

## Funzioni date con una formula

Una funzione è numerica quando il dominio e il codominio sono insiemi di numeri. Spesso una funzione numerica si dà con una formula che dice come calcolare $f(x)$ a partire da $x$, per esempio

$$f: \mathbb{R} \to \mathbb{R}, \quad f(x) = 3x - 5$$

La formula si chiama **legge** della funzione. Nella scrittura $x \mapsto 3x - 5$ la legge compare dopo la freccia.

La legge da sola non descrive tutta la funzione: servono anche il dominio e il codominio. La stessa legge $x \mapsto 2x$ dà funzioni con proprietà diverse da $\mathbb{Z}$ a $\mathbb{Z}$ e da $\mathbb{Q}$ a $\mathbb{Q}$ (lo mostra un esempio della lezione su [funzioni iniettive, suriettive e biettive](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive)). Quando un esercizio dà solo la legge, di solito si intende che il dominio è il più grande insieme di numeri reali per cui la formula ha senso, come spiega la lezione [Dominio, codominio e immagine](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/dominio-codominio-e-immagine).

### Valore di una funzione in un punto

Calcolare il valore di $f$ in un numero $a$ del dominio vuol dire calcolare $f(a)$, cioè l'immagine di $a$: si sostituisce $a$ al posto di $x$ nella legge e si fanno i conti. Il numero $a$ va sostituito dappertutto, e sempre tra parentesi se è negativo o è una frazione, come nelle [espressioni con le frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/espressioni-con-frazioni).

```ad-example
Esempio 3: una funzione di primo grado
Data $f(x) = 3x - 5$, calcola $f(2)$, $f(-1)$, $f(0)$ e $f\left(\dfrac{1}{3}\right)$.

$$
\begin{aligned}
f(2) &= 3 \cdot 2 - 5 = 1 \\
f(-1) &= 3 \cdot (-1) - 5 = -8 \\
f(0) &= 3 \cdot 0 - 5 = -5
\end{aligned}
$$

$$f\left(\frac{1}{3}\right) = 3 \cdot \frac{1}{3} - 5 = -4$$

Quattro numeri diversi, quattro immagini: $2 \mapsto 1$, $-1 \mapsto -8$, $0 \mapsto -5$, $\dfrac{1}{3} \mapsto -4$.
```

```ad-example
Esempio 4: numeri negativi e frazioni in una funzione di secondo grado
Data $f(x) = 2x^2 - 3x + 1$, calcola $f(-2)$, $f\left(\dfrac{1}{2}\right)$ e $f\left(-\dfrac{1}{3}\right)$.

Con $x = -2$ il quadrato è positivo e il prodotto $-3 \cdot (-2)$ cambia segno:

$$
\begin{aligned}
f(-2) &= 2 \cdot (-2)^2 - 3 \cdot (-2) + 1 \\
&= 8 + 6 + 1 = 15
\end{aligned}
$$

Con $x = \dfrac{1}{2}$:

$$
\begin{aligned}
f\Big(\frac{1}{2}\Big) &= 2 \cdot \Big(\frac{1}{2}\Big)^2 - 3 \cdot \frac{1}{2} + 1 \\
&= \frac{1}{2} - \frac{3}{2} + 1 = 0
\end{aligned}
$$

Con $x = -\dfrac{1}{3}$ servono le parentesi due volte, perché $\left(-\dfrac{1}{3}\right)^2 = \dfrac{1}{9}$ e $-3 \cdot \left(-\dfrac{1}{3}\right) = 1$:

$$
\begin{aligned}
f\Big({-\frac{1}{3}}\Big) &= 2 \cdot \Big({-\frac{1}{3}}\Big)^2 \\
&\quad - 3 \cdot \Big({-\frac{1}{3}}\Big) + 1 \\
&= \frac{2}{9} + 1 + 1 = \frac{20}{9}
\end{aligned}
$$
```

```ad-warning
Dimenticare le parentesi
Con $f(x) = x^2 - 3x$, il valore $f(-2)$ è $(-2)^2 - 3 \cdot (-2) = 4 + 6 = 10$. Scrivendo $-2^2$ senza parentesi si calcola $-4$ al posto di $4$, e si ottiene $2$, che è sbagliato.
```

Al posto di $x$ si può sostituire anche un'espressione con le lettere. Il procedimento è lo stesso: tutta l'espressione, tra parentesi, dove c'era la $x$.

```ad-example
Esempio 5: il valore in un'espressione letterale
Data $f(x) = 2x + 3$, calcola $f(a + 1)$ e $f(-a)$.

Al posto di $x$ scrivi $(a + 1)$, poi usa la proprietà distributiva:

$$
\begin{aligned}
f(a + 1) &= 2(a + 1) + 3 \\
&= 2a + 2 + 3 \\
&= 2a + 5
\end{aligned}
$$

Al posto di $x$ scrivi $(-a)$:

$$f(-a) = 2 \cdot (-a) + 3 = -2a + 3$$

Controllo con $a = 1$: $f(2) = 7$ e $2 + 5 = 7$; $f(-1) = 1$ e $-2 + 3 = 1$.
```

```ad-warning
Confondere $f(a + 1)$ con $f(a) + 1$
$f(a + 1)$ è il valore della funzione in $a + 1$; $f(a) + 1$ è il valore in $a$ con $1$ aggiunto dopo. Con $f(x) = 2x + 3$ il primo è $2a + 5$, il secondo $2a + 4$: sono diversi.
```

```ad-note
Formule che non si possono calcolare
Con $g(x) = \dfrac{1}{x - 2}$, il valore $g(2)$ non esiste, perché si dovrebbe dividere per zero. Allora $2$ non può stare nel dominio, e la legge definisce una funzione solo se dal dominio si toglie il $2$. Come si trovano i numeri da togliere lo spiega la lezione [Dominio, codominio e immagine](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/dominio-codominio-e-immagine).
```

## Tabella di valori e grafico

### Il piano cartesiano in breve

Per disegnare una funzione numerica si usa il piano cartesiano, che ha una lezione sua al secondo anno ([Il piano cartesiano: distanza e punto medio](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio)). Qui ne serve poco. Si disegnano due rette dei numeri perpendicolari che si incontrano nello zero di entrambe: quella orizzontale è l'asse $x$, quella verticale l'asse $y$, e il punto in cui si incontrano è l'origine $O$.

Ogni coppia ordinata di numeri $(x, y)$ corrisponde a un punto del piano: parti dall'origine, ti sposti di $x$ in orizzontale (a destra se $x$ è positivo, a sinistra se è negativo) e poi di $y$ in verticale (in alto se $y$ è positivo, in basso se è negativo). Il primo numero della coppia si chiama **ascissa** del punto, il secondo **ordinata**. È il [prodotto cartesiano](/materiale/scuola-superiore/matematica/insiemi-e-logica/prodotto-cartesiano) $\mathbb{R} \times \mathbb{R}$ disegnato.

```tikz
% nome: piano-cartesiano-due-punti
% alt: Piano cartesiano con l'asse x orizzontale, l'asse y verticale e l'origine O; il punto P di coordinate 3 e 2 e il punto Q di coordinate -2 e 1, con le linee tratteggiate verso gli assi
% svg: piano-cartesiano-due-punti-a017b1e9.svg 263x203
\begin{tikzpicture}[scale=0.8]
\draw[->] (-3.5,0) -- (4,0) node[right] {$x$};
\draw[->] (0,-2.5) -- (0,3.5) node[above] {$y$};
\foreach \i in {-3,-2,-1,1,2,3} \draw (\i,0.08) -- (\i,-0.08) node[below] {\small $\i$};
\foreach \j in {-2,-1,2,3} \draw (0.08,\j) -- (-0.08,\j) node[left] {\small $\j$};
\draw (-0.08,1) -- (0.08,1) node[right] {\small $1$};
\node[below left] at (0,0) {\small $O$};
\draw[dashed] (3,0) -- (3,2) -- (0,2);
\draw[dashed] (-2,0) -- (-2,1) -- (0,1);
\fill (3,2) circle (0.08) node[above right] {$P(3, 2)$};
\fill (-2,1) circle (0.08) node[above left] {$Q(-2, 1)$};
\end{tikzpicture}
```

### Grafico per punti

Il **grafico** di una funzione numerica $f$ è l'insieme dei punti del piano che hanno come coordinate le coppie $(x, f(x))$, con $x$ nel dominio. Sono le stesse coppie che formano la funzione come relazione, disegnate nel piano.

Per disegnarlo a mano:

1. scegli alcuni valori di $x$ nel dominio, positivi e negativi, e sempre anche lo $0$ se c'è;
2. calcola $f(x)$ per ciascuno e scrivi i risultati in una **tabella di valori**;
3. disegna nel piano i punti $(x, f(x))$;
4. se il dominio è $\mathbb{R}$, unisci i punti con una linea continua, seguendo l'andamento che suggeriscono; se il dominio è un insieme finito, il grafico è fatto solo dei punti e non si uniscono.

Unire i punti è un passaggio intuitivo: quanti più punti calcoli, tanto più il disegno si avvicina al grafico vero. Come si disegnano con precisione rette e parabole lo vedrai al secondo anno.

```ad-example
Esempio 6: grafico di una funzione di primo grado
Disegna il grafico di $f(x) = 2x - 1$ prima con dominio $A = \{-1,\ 0,\ 1,\ 2,\ 3\}$, poi con dominio $\mathbb{R}$.

| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ |
|---|---|---|---|---|---|
| $f(x)$ | $-3$ | $-1$ | $1$ | $3$ | $5$ |

Con dominio $A$ il grafico è fatto dei cinque punti $(-1, -3)$, $(0, -1)$, $(1, 1)$, $(2, 3)$, $(3, 5)$. Con dominio $\mathbb{R}$ ci sono anche tutti i punti intermedi, come $\left(\dfrac{1}{2},\ 0\right)$, e il grafico è la retta che passa per i cinque punti. La figura li mostra tutti e due: i punti sono il grafico con dominio $A$, la retta quello con dominio $\mathbb{R}$.

```tikz
% nome: grafico-per-punti-2x-meno-1
% alt: Grafico della funzione y = 2x - 1: i cinque punti della tabella di valori, da (-1, -3) a (3, 5), allineati sulla retta che li unisce
% svg: grafico-per-punti-2x-meno-1-daeb9906.svg 190x240
\begin{tikzpicture}[scale=0.55]
\draw[->] (-3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-4) -- (0,6.5) node[above] {$y$};
\foreach \i in {-2,-1,1,2,3} \draw (\i,0.12) -- (\i,-0.12);
\draw[thick, blue] (-1.4,-3.8) -- (3.6,6.2);
\foreach \x/\y in {-1/-3, 0/-1} \fill (\x,\y) circle (0.14) node[left] {\small $(\x, \y)$};
\foreach \x/\y in {1/1, 2/3, 3/5} \fill (\x,\y) circle (0.14) node[right] {\small $(\x, \y)$};
\end{tikzpicture}
```
```

```ad-example
Esempio 7: grafico di una funzione di secondo grado
Disegna il grafico di $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2 - 2$.

| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|
| $f(x)$ | $2$ | $-1$ | $-2$ | $-1$ | $2$ |

Per esempio $f(-2) = (-2)^2 - 2 = 2$. I punti non sono allineati: numeri opposti hanno la stessa immagine, quindi i punti sono a due a due alla stessa altezza, e il più basso è $(0, -2)$. Unendoli si ottiene una curva a forma di U, che si chiama parabola.

```tikz
% nome: grafico-per-punti-x-quadro-meno-2
% alt: Grafico della funzione y = x al quadrato meno 2: i cinque punti della tabella di valori e la parabola che li unisce, con il punto più basso in (0, -2)
% svg: grafico-per-punti-x-quadro-meno-2-c998bef3.svg 198x188
\begin{tikzpicture}[scale=0.7]
\draw[->] (-3,0) -- (3,0) node[right] {$x$};
\draw[->] (0,-2.8) -- (0,3.5) node[above] {$y$};
\foreach \i in {-2,-1,1,2} \draw (\i,0.1) -- (\i,-0.1);
\draw[thick, blue, domain=-2.3:2.3, samples=60, smooth] plot (\x, {\x*\x - 2});
\foreach \x/\y in {-2/2, -1/-1} \fill (\x,\y) circle (0.1) node[left] {\small $(\x, \y)$};
\foreach \x/\y in {1/-1, 2/2} \fill (\x,\y) circle (0.1) node[right] {\small $(\x, \y)$};
\fill (0,-2) circle (0.1) node[below right] {\small $(0, -2)$};
\end{tikzpicture}
```
```

## Riconoscere una funzione dal grafico

Non tutte le linee del piano sono grafici di funzioni. In un grafico di funzione ogni $x$ del dominio ha una sola immagine, quindi sopra o sotto quel valore di $x$ c'è un solo punto del grafico. Da qui viene il controllo con le rette verticali: una linea del piano è il grafico di una funzione se ogni retta verticale la incontra al più una volta. Le rette verticali che la incontrano, e in quel caso la incontrano esattamente una volta, sono quelle che passano per gli $x$ del dominio.

A sinistra la parabola dell'esempio 7: ogni retta verticale la incontra una volta sola, per esempio $x = 1$ nel punto $(1, -1)$. A destra la curva formata dai punti $(x, y)$ con $y^2 = x$, la stessa relazione dell'esempio 2: la retta $x = 4$ la incontra in $(4, 2)$ e in $(4, -2)$, quindi non è il grafico di una funzione.

```tikz
% nome: test-rette-verticali
% alt: Controllo con le rette verticali: la retta x = 1 incontra una sola volta la parabola y = x al quadrato meno 2, che è il grafico di una funzione; la retta x = 4 incontra due volte, in (4, 2) e (4, -2), la curva y al quadrato = x, che non lo è
% svg: test-rette-verticali-12b8e77c.svg 384x223
\begin{tikzpicture}[scale=0.6]
\draw[->] (-3,0) -- (3,0) node[right] {$x$};
\draw[->] (0,-3) -- (0,3.8) node[above] {$y$};
\draw[thick, blue, domain=-2.3:2.3, samples=60, smooth] plot (\x, {\x*\x - 2});
\draw[dashed] (1,-3) node[below] {$x = 1$} -- (1,3.8);
\fill (1,-1) circle (0.1);
\node at (0,-4.6) {$y = x^2 - 2$};
\begin{scope}[xshift=7.5cm]
\draw[->] (-1,0) -- (5.5,0) node[right] {$x$};
\draw[->] (0,-3) -- (0,3.8) node[above] {$y$};
\draw[thick, blue, domain=-2.3:2.3, samples=60, smooth] plot ({\x*\x}, \x);
\draw[dashed] (4,-3) node[below] {$x = 4$} -- (4,3.8);
\fill (4,2) circle (0.1);
\fill (4,-2) circle (0.1);
\node at (2.2,-4.6) {$y^2 = x$};
\end{scope}
\end{tikzpicture}
```

```ad-warning
Rette verticali e rette orizzontali
Le rette verticali dicono se una linea è il grafico di una funzione. Le rette orizzontali servono a un'altra cosa: dicono se una funzione è iniettiva o suriettiva, come spiega la lezione [Funzioni iniettive, suriettive e biettive](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive). La parabola $y = x^2 - 2$ è incontrata due volte dalla retta orizzontale $y = 2$, ed è comunque il grafico di una funzione.
```
