# Funzioni reali e dominio

Il costo di una corsa in taxi dipende dai chilometri percorsi, l'area di un cerchio dal raggio, la temperatura di una stanza dall'ora del giorno. In tutti e tre i casi un numero reale ne determina un altro: sono funzioni reali di variabile reale, quelle che il terzo anno studia attraverso il loro grafico. Di ogni funzione ti chiederai per prima cosa tre cose: per quali $x$ esiste (il dominio), dove vale zero (gli zeri) e dove è positiva o negativa (il segno).

Che cos'è una funzione lo trovi nella lezione [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione), e il dominio naturale delle funzioni con un denominatore in [Dominio, codominio e immagine](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/dominio-codominio-e-immagine). Qui il dominio si estende alle funzioni con le radici e con il valore assoluto, e per trovarlo servono le disequazioni del biennio.

## Funzioni reali di variabile reale

Una **funzione reale di variabile reale** è una funzione $f: D \to \mathbb{R}$ il cui dominio $D$ è un sottoinsieme di $\mathbb{R}$: prende un numero reale $x$ e gli associa un solo numero reale $y = f(x)$. La $x$ si chiama variabile indipendente, la $y$ variabile dipendente, e la formula $y = f(x)$ è l'espressione analitica della funzione.

Le funzioni che hai incontrato finora si costruiscono con le quattro operazioni, le potenze e le radici, e si chiamano funzioni algebriche. Prendono il nome dalla forma della loro espressione:

| Funzione | Com'è fatta | Esempio |
|---|---|---|
| razionale intera | un polinomio | $y = x^3 - 2x + 5$ |
| razionale fratta | un quoziente di polinomi, con la $x$ al denominatore | $y = \dfrac{x + 1}{x^2 - 4}$ |
| irrazionale | la $x$ compare sotto una radice | $y = \sqrt{x - 3}$ |

Le funzioni che non sono algebriche si dicono trascendenti: quest'anno incontrerai la [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale) e la [funzione logaritmica](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-logaritmica), ciascuna con il suo dominio.

## Il dominio naturale

Quando una funzione è data solo con la formula, il suo dominio è il **dominio naturale**, o **campo di esistenza**: l'insieme di tutti i numeri reali $x$ per cui la formula si può calcolare e dà un numero reale. Le operazioni che non si possono sempre fare sono due, la divisione (non si divide per zero) e la radice di indice pari (il radicando non può essere negativo). Ogni volta che una di queste compare nella formula, nasce una condizione.

| Nella formula c'è | Condizione |
|---|---|
| un polinomio | nessuna |
| un denominatore $B(x)$ | $B(x) \neq 0$ |
| una radice di indice pari, $\sqrt{A(x)}$ | $A(x) \geq 0$ |
| una radice di indice dispari, $\sqrt[3]{A(x)}$ | nessuna |
| un valore assoluto, $\lvert A(x) \rvert$ | nessuna |

"Nessuna" vuol dire che la radice cubica e il valore assoluto non aggiungono condizioni proprie: restano quelle dell'espressione $A(x)$ che sta dentro, se ne ha. La radice cubica di un numero negativo esiste, $\sqrt[3]{-8} = -2$, come spiega la lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta).

Per trovare il dominio:

1. Cerca nella formula i denominatori e le radici di indice pari.
2. Scrivi una condizione per ognuno: denominatore diverso da zero, radicando maggiore o uguale a zero.
3. Se le condizioni sono più di una, devono valere tutte insieme: mettile a sistema.
4. Risolvi e scrivi il dominio come intervallo o unione di intervalli.

Gli intervalli si scrivono come nella lezione [Disequazioni di primo grado e intervalli](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli): la parentesi quadra rivolta verso il numero lo include, quella rivolta verso l'esterno lo esclude.

```ad-warning
Maggiore o uguale, non maggiore
La condizione di una radice quadrata è $A(x) \geq 0$, con l'uguale: $\sqrt{0} = 0$ esiste. Per $y = \sqrt{x - 3}$ il dominio è $[3, +\infty\mathclose{[}$, con il $3$ incluso, e $f(3) = 0$. L'uguale si toglie solo quando la radice sta al denominatore, perché lì non può valere zero.
```

## Esempi sul dominio

### Funzioni razionali fratte

```ad-example
Esempio 1: un denominatore di secondo grado
Trova il dominio di $f(x) = \dfrac{x + 1}{x^2 - 5x + 6}$.

L'unica condizione è il denominatore diverso da zero. Risolvi l'equazione $x^2 - 5x + 6 = 0$:

$$
\begin{gathered}
\Delta = 25 - 24 = 1 \\
x_{1,2} = \frac{5 \pm 1}{2}
\end{gathered}
$$

Le soluzioni sono $x_1 = 2$ e $x_2 = 3$, e sono i due valori da escludere:

$$D = \mathbb{R} \setminus \{2,\ 3\}$$

Con gli intervalli lo stesso insieme si scrive

$$
\begin{gathered}
D = \,\mathopen{]}-\infty, 2\mathclose{[}\, \cup \,\mathopen{]}2, 3\mathclose{[} \\
\cup \,\mathopen{]}3, +\infty\mathclose{[}
\end{gathered}
$$
```

### Funzioni irrazionali

```ad-example
Esempio 2: un radicando di secondo grado
Trova il dominio di $f(x) = \sqrt{x^2 - 4}$.

La radice ha indice $2$, quindi il radicando deve essere positivo o nullo:

$$x^2 - 4 \geq 0$$

È una [disequazione di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado). L'equazione associata $x^2 - 4 = 0$ ha le soluzioni $-2$ e $2$, il coefficiente di $x^2$ è positivo e il verso è $\geq$: vanno bene i valori esterni, estremi compresi.

$$x \leq -2 \ \text{ oppure } \ x \geq 2$$

$$D = \,\mathopen{]}-\infty, -2] \cup [2, +\infty\mathclose{[}$$

Nel grafico il dominio è la parte dell'asse $x$ sopra la quale c'è un punto della curva: tra $-2$ e $2$ non c'è niente, perché lì il radicando è negativo.

```tikz
% nome: dominio-radice-x-quadro-meno-4
% alt: Il grafico di y uguale alla radice quadrata di x al quadrato meno 4: due rami che partono dai punti (-2, 0) e (2, 0) e salgono verso l'esterno; il dominio, segnato sull'asse x, è formato dalle due semirette prima di -2 e dopo 2, estremi compresi, e tra -2 e 2 non c'è grafico
% svg: dominio-radice-x-quadro-meno-4-a939312b.svg 228x149
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-5,-1) grid (5,5);
\draw[->] (-5.4,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,5.5) node[above] {$y$};
\foreach \x in {-4,-2,2,4} \node[below] at (\x,0) {\small $\x$};
\node[left] at (0,4) {\small $4$};
\draw[orange!80, line width=2pt] (-5,0) -- (-2,0);
\draw[orange!80, line width=2pt] (2,0) -- (5,0);
\draw[thick, blue!60, domain=0:4.58, samples=50, smooth] plot ({sqrt(\x*\x+4)}, \x);
\draw[thick, blue!60, domain=0:4.58, samples=50, smooth] plot ({-sqrt(\x*\x+4)}, \x);
\fill (-2,0) circle (0.13);
\fill (2,0) circle (0.13);
\end{tikzpicture}
```
```grafico
% nome: dominio-radice-x-quadro-meno-c-cursore
% alt: Il grafico di y uguale alla radice quadrata di x al quadrato meno c, con il cursore di c: per c positivo il grafico ha due rami separati e manca tra meno radice di c e radice di c, per c uguale a zero i due rami si toccano nell'origine, per c negativo il grafico è un ramo solo e il dominio è tutto R
curva: y=\sqrt{x^2-c}
cursore: c = 4 da -4 a 9 passo 0,5
finestra: x da -6 a 6, y da -2 a 6
valore: x_2 = \sqrt{c}
domanda: Abbassa $c$ fino a $0$ e poi sotto: da quale valore il dominio è tutto $\mathbb{R}$? Che curva vedi per $c = 0$?
```

Per $c > 0$ il dominio è $x \leq -\sqrt{c}$ oppure $x \geq \sqrt{c}$, e il vuoto tra i due rami si stringe quando $c$ diminuisce. Per $c = 0$ il radicando è $x^2$, che non è mai negativo: il dominio è tutto $\mathbb{R}$ e la funzione è $\sqrt{x^2} = |x|$, la V con il vertice nell'origine. Per $c < 0$ il radicando $x^2 - c$ è sempre positivo e il dominio resta $\mathbb{R}$.
```

```ad-example
Esempio 3: una radice al numeratore e un denominatore
Trova il dominio di $f(x) = \dfrac{\sqrt{x + 3}}{x - 1}$.

Le condizioni sono due, una per la radice e una per il denominatore, e devono valere insieme:

$$
\begin{cases}
x + 3 \geq 0 \\
x - 1 \neq 0
\end{cases}
\quad \Rightarrow \quad
\begin{cases}
x \geq -3 \\
x \neq 1
\end{cases}
$$

Il dominio è la semiretta da $-3$ in poi, senza il numero $1$:

$$D = [-3, 1\mathclose{[}\, \cup \,\mathopen{]}1, +\infty\mathclose{[}$$
```

```ad-example
Esempio 4: una radice al denominatore
Trova il dominio di $f(x) = \dfrac{x}{\sqrt{6 - x - x^2}}$.

Il radicando deve essere positivo o nullo perché la radice esista, e la radice deve essere diversa da zero perché sta al denominatore. Le due condizioni insieme danno il radicando strettamente positivo:

$$6 - x - x^2 > 0$$

Moltiplica per $-1$ e cambia il verso: $x^2 + x - 6 < 0$. L'equazione associata ha $\Delta = 1 + 24 = 25$ e soluzioni

$$x_{1,2} = \frac{-1 \pm 5}{2}$$

cioè $x_1 = -3$ e $x_2 = 2$. Il verso è $<$ con il coefficiente di $x^2$ positivo: vanno bene i valori interni, estremi esclusi.

$$D = \,\mathopen{]}-3, 2\mathclose{[}$$
```

```ad-example
Esempio 5: una frazione sotto radice
Trova il dominio di $f(x) = \sqrt{\dfrac{x - 1}{x + 2}}$.

Il radicando è una frazione: deve esistere, quindi $x \neq -2$, e deve essere positivo o nullo. La condizione è la disequazione fratta

$$\frac{x - 1}{x + 2} \geq 0$$

che si risolve con lo studio del segno della lezione [Studio del segno e disequazioni fratte](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte). Il numeratore è positivo per $x > 1$ e si annulla in $1$; il denominatore è positivo per $x > -2$. La frazione è positiva dove i due segni sono concordi, cioè prima di $-2$ e dopo $1$; in $x = 1$ vale zero e va bene, in $x = -2$ non esiste.

$$D = \,\mathopen{]}-\infty, -2\mathclose{[}\, \cup [1, +\infty\mathclose{[}$$
```

```ad-warning
La frazione sotto radice è un radicando solo
Per $\sqrt{\dfrac{x - 1}{x + 2}}$ la condizione è una sola, sul segno della frazione, e non le due condizioni $x - 1 \geq 0$ e $x + 2 > 0$. Queste sono le condizioni di un'altra funzione, $\dfrac{\sqrt{x - 1}}{\sqrt{x + 2}}$, che ha dominio $[1, +\infty\mathclose{[}$. In $x = -5$ la prima funzione esiste e vale $\sqrt{\dfrac{-6}{-3}} = \sqrt{2}$, la seconda no.
```

### Radice cubica e valore assoluto

```ad-example
Esempio 6: una radice cubica e un valore assoluto
Trova il dominio di $f(x) = \dfrac{\sqrt[3]{x - 5}}{|x| - 2}$.

La radice ha indice $3$, dispari, e non dà condizioni. Il valore assoluto esiste per ogni $x$. Resta il denominatore:

$$|x| - 2 \neq 0 \quad \Rightarrow \quad |x| \neq 2$$

I numeri con valore assoluto $2$ sono $-2$ e $2$, quindi

$$D = \mathbb{R} \setminus \{-2,\ 2\}$$
```

## Zeri di una funzione

Uno **zero** di una funzione $f$ è un numero $x$ del dominio in cui la funzione vale zero, cioè una soluzione dell'equazione

$$f(x) = 0$$

Nel grafico gli zeri sono le ascisse dei punti in cui la curva incontra l'asse $x$, perché lì l'ordinata $f(x)$ è nulla. Una funzione può avere più zeri, uno solo o nessuno: $y = x^2 - 4$ ne ha due, $-2$ e $2$; $y = 2x - 6$ ne ha uno, $3$; $y = x^2 + 1$ non ne ha.

L'asse $y$, invece, il grafico lo incontra al massimo una volta. Se $0$ appartiene al dominio, il punto è $(0,\ f(0))$ e si trova sostituendo $x = 0$; se $0$ non appartiene al dominio, il grafico non incontra l'asse $y$.

```ad-warning
Uno zero deve stare nel dominio
Per $f(x) = (x + 2)\sqrt{x - 1}$ il prodotto si annulla quando si annulla uno dei due fattori: $x = -2$ oppure $x = 1$. Ma il dominio è $[1, +\infty\mathclose{[}$, e in $x = -2$ la funzione non esiste: lo zero è uno solo, $x = 1$. Trova sempre il dominio prima di cercare gli zeri.
```

## Segno di una funzione

Studiare il **segno** di una funzione vuol dire trovare per quali $x$ del dominio è positiva e per quali è negativa. Si risolve la disequazione

$$f(x) > 0$$

Le sue soluzioni sono gli $x$ in cui la funzione è positiva; negli zeri vale zero; in tutti gli altri punti del dominio è negativa. Nel grafico, dove $f(x) > 0$ la curva sta sopra l'asse $x$, dove $f(x) < 0$ sta sotto.

Dominio, zeri e segno si leggono anche da un grafico già disegnato. Nella figura la funzione $f$ ha il grafico che va dal punto $(-4,\ -5)$ al punto $(5,\ 4)$, estremi compresi.

```tikz
% nome: dominio-zeri-segno-dal-grafico
% alt: Il grafico di una funzione che parte dal punto (-4, -5), sale, taglia l'asse x in -3, scende, lo taglia in 1, risale, lo taglia in 4 e arriva al punto (5, 4): il dominio, segnato sull'asse x, è l'intervallo da -4 a 5 e l'insieme immagine, segnato sull'asse y, è l'intervallo da -5 a 4
% svg: dominio-zeri-segno-dal-grafico-2c3d11bc.svg 247x246
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-5,-6) grid (6,5);
\draw[->] (-5.4,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,5.6) node[above] {$y$};
\draw[dashed, gray] (-4,0) -- (-4,-5) -- (0,-5);
\draw[dashed, gray] (5,0) -- (5,4) -- (0,4);
\draw[orange!80, line width=2pt] (-4,0) -- (5,0);
\draw[teal!70, line width=2pt] (0,-5) -- (0,4);
\draw[thick, blue!60, domain=-4:5, samples=70, smooth] plot (\x, {(\x+3)*(\x-1)*(\x-4)/8});
\fill (-4,-5) circle (0.13);
\fill (5,4) circle (0.13);
\fill (-3,0) circle (0.13);
\fill (1,0) circle (0.13);
\fill (4,0) circle (0.13);
\node[above left] at (-4,0) {\small $-4$};
\node[below right] at (-3,0) {\small $-3$};
\node[below left] at (1,0) {\small $1$};
\node[above left] at (4,0) {\small $4$};
\node[below] at (5,0) {\small $5$};
\node[right] at (0,-5) {\small $-5$};
\node[left] at (0,4) {\small $4$};
\end{tikzpicture}
```

- Il dominio è l'insieme delle ascisse dei punti del grafico: $D = [-4, 5]$, segnato in arancione sull'asse $x$.
- Gli zeri sono le ascisse dei punti sull'asse $x$: $-3$, $1$ e $4$.
- La funzione è positiva dove il grafico sta sopra l'asse $x$, cioè per $-3 < x < 1$ e per $4 < x \leq 5$; è negativa per $-4 \leq x < -3$ e per $1 < x < 4$.
- L'insieme immagine è l'insieme delle ordinate dei punti del grafico: $[-5, 4]$, segnato in verde sull'asse $y$.

```ad-warning
Positiva non vuol dire che sale
Il segno dice se il grafico sta sopra o sotto l'asse $x$, non se sale o scende. Nella figura, tra $-1$ e $1$ la funzione è positiva e il grafico scende; tra $3$ e $4$ è negativa e il grafico sale. Salire e scendere sono l'argomento della lezione [Funzioni crescenti e decrescenti](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-crescenti-e-decrescenti).
```

## Esempi su zeri e segno

```ad-example
Esempio 7: dominio, zeri e segno di una funzione fratta
Studia dominio, intersezioni con gli assi e segno di $f(x) = \dfrac{x^2 - 4}{x - 1}$.

Dominio. Il denominatore si annulla per $x = 1$: $D = \mathbb{R} \setminus \{1\}$.

Zeri. Una frazione vale zero quando vale zero il numeratore, se il denominatore non si annulla nello stesso punto: $x^2 - 4 = 0$ dà $x = -2$ e $x = 2$, tutti e due nel dominio. Il grafico incontra l'asse $x$ in $(-2,\ 0)$ e in $(2,\ 0)$.

Asse $y$. Il numero $0$ appartiene al dominio e $f(0) = \dfrac{-4}{-1} = 4$: il grafico incontra l'asse $y$ in $(0,\ 4)$.

Segno. Studia separatamente il numeratore e il denominatore: $x^2 - 4 > 0$ per $x < -2$ oppure $x > 2$; $x - 1 > 0$ per $x > 1$. Poi la tabella dei segni:

```tikz
% nome: tabella-segni-x-quadro-meno-4-fratto-x-meno-1
% alt: Tabella dei segni di x al quadrato meno 4 fratto x meno 1: il numeratore è positivo prima di -2 e dopo 2, il denominatore è positivo dopo 1; la frazione è negativa prima di -2, positiva tra -2 e 1, negativa tra 1 e 2, positiva dopo 2, vale zero in -2 e in 2 e non esiste in 1, segnato con un pallino vuoto
% svg: tabella-segni-x-quadro-meno-4-fratto-x-meno-1-433004ff.svg 282x94
\begin{tikzpicture}
\node at (1.40,0) {$-2$};
\node at (2.80,0) {$1$};
\node at (4.20,0) {$2$};
\node at (5.85,0) {$x$};
\foreach \x in {1.40,2.80,4.20} {
\draw[gray!60, densely dotted] (\x,-0.20) -- (\x,-0.45);
\draw[gray!60, densely dotted] (\x,-0.82) -- (\x,-1.07);
\draw[gray!60, densely dotted] (\x,-1.44) -- (\x,-1.69);
}
\node[left] at (-0.1,-0.62) {$x^2-4$};
\draw[thick] (0.00,-0.62) -- (1.23,-0.62);
\node[above] at (0.70,-0.67) {\small $+$};
\draw[thick, dashed] (1.57,-0.62) -- (2.80,-0.62);
\node[above] at (2.10,-0.67) {\small $-$};
\draw[thick, dashed] (2.80,-0.62) -- (4.03,-0.62);
\node[above] at (3.50,-0.67) {\small $-$};
\draw[thick] (4.37,-0.62) -- (5.60,-0.62);
\node[above] at (4.90,-0.67) {\small $+$};
\node at (1.40,-0.62) {\small $0$};
\node at (4.20,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x-1$};
\draw[thick, dashed] (0.00,-1.24) -- (1.40,-1.24);
\node[above] at (0.70,-1.29) {\small $-$};
\draw[thick, dashed] (1.40,-1.24) -- (2.63,-1.24);
\node[above] at (2.10,-1.29) {\small $-$};
\draw[thick] (2.97,-1.24) -- (4.20,-1.24);
\node[above] at (3.50,-1.29) {\small $+$};
\draw[thick] (4.20,-1.24) -- (5.60,-1.24);
\node[above] at (4.90,-1.29) {\small $+$};
\node at (2.80,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (5.60,-1.55);
\node[left] at (-0.1,-1.86) {$f(x)$};
\node at (0.70,-1.86) {$-$};
\node at (2.10,-1.86) {$+$};
\node at (3.50,-1.86) {$-$};
\node at (4.90,-1.86) {$+$};
\node at (1.40,-1.86) {\small $0$};
\draw[thick] (2.80,-1.86) circle (2.5pt);
\node at (4.20,-1.86) {\small $0$};
\end{tikzpicture}
```

La funzione è positiva per $-2 < x < 1$ e per $x > 2$, negativa per $x < -2$ e per $1 < x < 2$.

Con queste informazioni puoi già dire in quali zone del piano passa il grafico. Dove la funzione è negativa la curva non può stare sopra l'asse $x$, dove è positiva non può stare sotto: nella figura le zone escluse sono in grigio, e il grafico (qui disegnato per controllo) passa solo nelle altre, per i due zeri e per $(0,\ 4)$. La retta tratteggiata $x = 1$ non viene mai toccata, perché $1$ non è nel dominio: il grafico le si avvicina da una parte e dall'altra senza raggiungerla. Una retta così si chiama asintoto verticale, e la ritrovi nella lezione [Iperbole equilatera e funzione omografica](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole-equilatera-e-funzione-omografica).

```tikz
% nome: segno-funzione-fratta-zone-escluse
% alt: Il piano cartesiano con in grigio le zone dove il grafico di x al quadrato meno 4 fratto x meno 1 non può passare: sopra l'asse x prima di -2 e tra 1 e 2, sotto l'asse x tra -2 e 1 e dopo 2; la retta x = 1 è tratteggiata; il grafico ha due rami, uno a sinistra di 1 che passa per (-2, 0) e (0, 4), uno a destra che passa per (2, 0)
% svg: segno-funzione-fratta-zone-escluse-2818eda1.svg 188x248
\begin{tikzpicture}[scale=0.4]
\fill[gray!40] (-5,0) rectangle (-2,7);
\fill[gray!40] (-2,-7) rectangle (1,0);
\fill[gray!40] (1,0) rectangle (2,7);
\fill[gray!40] (2,-7) rectangle (5,0);
\draw[->] (-5.4,0) -- (5.7,0) node[right] {$x$};
\draw[->] (0,-7.3) -- (0,7.7) node[above] {$y$};
\draw[dashed, gray] (1,-7) -- (1,7);
\draw[thick, blue!60, domain=-5:0.44, samples=70, smooth] plot (\x, {(\x*\x-4)/(\x-1)});
\draw[thick, blue!60, domain=1.34:5, samples=70, smooth] plot (\x, {(\x*\x-4)/(\x-1)});
\fill (-2,0) circle (0.16);
\fill (2,0) circle (0.16);
\fill (0,4) circle (0.16);
\node[above left] at (-2,0) {\small $-2$};
\node[below right] at (2,0) {\small $2$};
\node[below left] at (1,0) {\small $1$};
\node[left] at (0,4) {\small $4$};
\end{tikzpicture}
```
```grafico
% nome: funzione-fratta-zero-e-valore-escluso-cursore
% alt: Il grafico di y = x al quadrato meno 4 fratto x meno b, con il cursore di b e la retta x = b tratteggiata: gli zeri restano in -2 e in 2 finché b è diverso da quei valori; quando b vale 2 il grafico diventa la retta y = x + 2 e lo zero in 2 sparisce
curva: y=\frac{x^2-4}{x-b}
curva: x=b | tratteggiata | grigio
cursore: b = 1 da -4 a 4 passo 0,5
finestra: x da -6 a 6, y da -8 a 8
valore: f(0) = \frac{4}{b}
domanda: Gli zeri sono $-2$ e $2$ finché stanno nel dominio. Porta $b$ a $2$: quanti zeri restano, e che curva vedi?
```

Il valore escluso è $x = b$: spostandolo cambia l'ordine dei numeri nella tabella dei segni, ma gli zeri restano $-2$ e $2$. Il caso particolare è $b = 2$ (e allo stesso modo $b = -2$): lo zero $2$ coincide con il valore escluso ed esce dal dominio. Per $x \neq 2$ la frazione vale $\dfrac{(x - 2)(x + 2)}{x - 2} = x + 2$, quindi il grafico è la retta $y = x + 2$ senza il punto di ascissa $2$, che il piano non segna, e lo zero è uno solo, $-2$. Con $b = 0$, invece, è lo zero a non appartenere al dominio: $f(0)$ non esiste e il grafico non incontra l'asse $y$.
```

```ad-example
Esempio 8: una funzione con il valore assoluto
Trova dominio, zeri e segno di $f(x) = |x - 1| - 2$.

Dominio. Il valore assoluto non dà condizioni: $D = \mathbb{R}$.

Zeri. L'equazione $|x - 1| - 2 = 0$ diventa $|x - 1| = 2$, che si spezza in $x - 1 = 2$ e $x - 1 = -2$, come nella lezione [Equazioni e disequazioni con il valore assoluto](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/equazioni-e-disequazioni-con-il-valore-assoluto). Gli zeri sono $x = 3$ e $x = -1$.

Segno. La disequazione $|x - 1| - 2 > 0$ diventa $|x - 1| > 2$, vera quando $x - 1 < -2$ oppure $x - 1 > 2$:

$$x < -1 \ \text{ oppure } \ x > 3$$

La funzione è positiva per $x < -1$ e per $x > 3$, negativa per $-1 < x < 3$. Controllo con un numero: $f(0) = |-1| - 2 = -1$, negativo, e $0$ sta tra $-1$ e $3$.

```tikz
% nome: valore-assoluto-meno-2-zeri-e-segno
% alt: Il grafico di y = valore assoluto di x meno 1, meno 2: una V con il vertice nel punto (1, -2) che taglia l'asse x in -1 e in 3; sta sotto l'asse x tra -1 e 3 e sopra prima di -1 e dopo 3
% svg: valore-assoluto-meno-2-zeri-e-segno-6f5e3105.svg 247x185
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-4,-3) grid (6,4);
\draw[->] (-4.3,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,4.6) node[above] {$y$};
\draw[thick, blue!60] (-4,3) -- (1,-2) -- (6,3);
\draw[dashed, gray] (1,0) -- (1,-2) -- (0,-2);
\foreach \x/\y in {-1/0, 3/0, 1/-2} \fill (\x,\y) circle (0.11);
\node[below left] at (-1,0) {\small $-1$};
\node[below right] at (3,0) {\small $3$};
\node[above] at (1,0) {\small $1$};
\node[left] at (0,-2) {\small $-2$};
\end{tikzpicture}
```
```grafico
% nome: valore-assoluto-meno-k-zeri-cursore
% alt: Il grafico di y = valore assoluto di x meno 1, meno k, con il cursore di k: per k positivo la V taglia l'asse x in due punti, per k uguale a zero lo tocca nel vertice (1, 0), per k negativo sta tutta sopra l'asse x e non ha zeri
curva: y=\left|x-1\right|-k
cursore: k = 2 da -3 a 5 passo 0,5
finestra: x da -6 a 8, y da -6 a 6
domanda: Abbassa $k$: per quale valore gli zeri diventano uno solo? E da quando non ce ne sono più?
```

Gli zeri sono $1 - k$ e $1 + k$ finché $k > 0$. Per $k = 0$ coincidono in $x = 1$: la V tocca l'asse $x$ nel vertice e la funzione, che è $|x - 1|$, non è mai negativa. Per $k < 0$ l'equazione $|x - 1| = k$ non ha soluzioni, perché un valore assoluto non è mai negativo: la funzione non ha zeri ed è positiva su tutto $\mathbb{R}$.
```

```ad-tip
Un controllo con un numero
Dopo lo studio del segno scegli un numero in ogni intervallo e calcola la funzione. Per $f(x) = \dfrac{x^2 - 4}{x - 1}$: $f(-3) = \dfrac{5}{-4}$, negativo; $f(0) = 4$, positivo; $f\Big(\dfrac{3}{2}\Big) = \dfrac{-7/4}{1/2} = -\dfrac{7}{2}$, negativo; $f(3) = \dfrac{5}{2}$, positivo.
```

## Errori frequenti

```ad-warning
Semplificare prima di trovare il dominio
Per $f(x) = \dfrac{x^2 - 4}{x - 2}$ il dominio è $\mathbb{R} \setminus \{2\}$, anche se per $x \neq 2$ la frazione è uguale a $x + 2$. Il dominio si legge sulla formula com'è scritta: se semplifichi prima, il $2$ rientra e la funzione non è più la stessa.
```

```ad-warning
Unire le condizioni invece di intersecarle
Le condizioni di esistenza devono valere tutte insieme: vanno a sistema, e il dominio è l'intersezione delle loro soluzioni. Per $\sqrt{x + 3} + \sqrt{5 - x}$ servono $x \geq -3$ e $x \leq 5$, e il dominio è $[-3, 5]$. L'unione delle due semirette darebbe tutto $\mathbb{R}$, ma in $x = 7$ la seconda radice non esiste.
```

Dominio, zeri e segno sono i primi tre passi dello studio di una funzione. Le lezioni che seguono aggiungono le simmetrie ([Funzioni pari e dispari](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-pari-e-dispari)) e gli intervalli in cui il grafico sale o scende ([Funzioni crescenti e decrescenti](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-crescenti-e-decrescenti)).
