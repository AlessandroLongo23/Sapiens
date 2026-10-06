# Funzioni crescenti e decrescenti

Il grafico della temperatura di una giornata sale dal mattino fino al primo pomeriggio e poi scende fino a notte. Dire che una funzione cresce o decresce è dire questo: che cosa fa $y$ quando $x$ aumenta. La definizione precisa serve a dimostrarlo con un conto quando il grafico non c'è, e a sapere quando in una disequazione puoi applicare una funzione ai due membri senza cambiare il verso.

Ti servono il grafico di una funzione e il suo dominio, dalla lezione [Funzioni reali e dominio](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-reali-e-dominio), e gli intervalli della lezione [Disequazioni di primo grado e intervalli](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli).

## Funzione crescente e funzione decrescente

Sia $I$ un intervallo contenuto nel dominio di $f$. La funzione $f$ è **crescente** in $I$ se, presi comunque due numeri $x_1$ e $x_2$ di $I$,

$$x_1 < x_2 \quad \Rightarrow \quad f(x_1) < f(x_2)$$

cioè se a un valore più grande di $x$ corrisponde sempre un valore più grande di $y$. È **decrescente** in $I$ se

$$x_1 < x_2 \quad \Rightarrow \quad f(x_1) > f(x_2)$$

cioè se a un valore più grande di $x$ corrisponde sempre un valore più piccolo di $y$. Nel grafico, percorso da sinistra a destra, una funzione crescente sale e una decrescente scende.

```tikz
% nome: funzione-crescente-e-decrescente-definizione
% alt: Due grafici: a sinistra una funzione crescente, in cui a x1 minore di x2 corrispondono f(x1) minore di f(x2), con il grafico che sale da sinistra a destra; a destra una funzione decrescente, in cui a x1 minore di x2 corrispondono f(x1) maggiore di f(x2), con il grafico che scende
% svg: funzione-crescente-e-decrescente-definizione-ef429b92.svg 385x171
\begin{tikzpicture}[scale=0.8]
\begin{scope}
\draw[->] (-0.4,0) -- (4.2,0) node[right] {\small $x$};
\draw[->] (0,-0.4) -- (0,3.7) node[above] {\small $y$};
\draw[thick, blue!60, domain=0.3:3.5, samples=40, smooth] plot (\x, {0.25*\x*\x + 0.5});
\draw[dashed, gray] (1,0) -- (1,0.75) -- (0,0.75);
\draw[dashed, gray] (3,0) -- (3,2.75) -- (0,2.75);
\fill (1,0.75) circle (0.07);
\fill (3,2.75) circle (0.07);
\node[below] at (1,0) {\small $x_1$};
\node[below] at (3,0) {\small $x_2$};
\node[left] at (0,0.75) {\small $f(x_1)$};
\node[left] at (0,2.75) {\small $f(x_2)$};
\node at (2,-1) {\small crescente};
\end{scope}
\begin{scope}[shift={(6.6,0)}]
\draw[->] (-0.4,0) -- (4.2,0) node[right] {\small $x$};
\draw[->] (0,-0.4) -- (0,3.7) node[above] {\small $y$};
\draw[thick, orange!80, domain=0.3:3.4, samples=40, smooth] plot (\x, {3 - 0.25*\x*\x});
\draw[dashed, gray] (1,0) -- (1,2.75) -- (0,2.75);
\draw[dashed, gray] (3,0) -- (3,0.75) -- (0,0.75);
\fill (1,2.75) circle (0.07);
\fill (3,0.75) circle (0.07);
\node[below] at (1,0) {\small $x_1$};
\node[below] at (3,0) {\small $x_2$};
\node[left] at (0,2.75) {\small $f(x_1)$};
\node[left] at (0,0.75) {\small $f(x_2)$};
\node at (2,-1) {\small decrescente};
\end{scope}
\end{tikzpicture}
```

La definizione parla sempre di un intervallo, e la stessa funzione può essere crescente in un intervallo e decrescente in un altro: $y = x^2$ è decrescente per $x \leq 0$ e crescente per $x \geq 0$. Quando non si nomina l'intervallo, "crescente" vuol dire crescente in tutto il dominio.

### In senso lato

Se nella definizione metti $\leq$ al posto di $<$, ottieni una condizione più debole. La funzione è **crescente in senso lato**, o non decrescente, in $I$ se

$$x_1 < x_2 \quad \Rightarrow \quad f(x_1) \leq f(x_2)$$

e **decrescente in senso lato**, o non crescente, se $f(x_1) \geq f(x_2)$. Il grafico di una funzione crescente in senso lato non scende mai, ma può avere tratti orizzontali. Ogni funzione crescente è anche crescente in senso lato, non il contrario.

Una funzione che in $I$ ha una di queste quattro proprietà si dice **monotona** in $I$: in quell'intervallo va in un verso solo, senza tornare indietro. Se è crescente o decrescente secondo la prima definizione, quella con $<$ e $>$, si dice **strettamente monotona**.

Le parole si usano così, in questa lezione e in tutte quelle che seguono: "crescente" e "decrescente" senza aggiunte vogliono dire in senso stretto; per il senso lato si dice "in senso lato", oppure "non decrescente" e "non crescente"; "monotona" senza aggiunte comprende tutti e due i casi.

```tikz
% nome: funzione-crescente-in-senso-lato
% alt: Il grafico di una funzione crescente in senso lato: sale fino al punto (1, 1), resta orizzontale all'altezza 1 tra x = 1 e x = 3, poi riprende a salire
% svg: funzione-crescente-in-senso-lato-3d4a16cd.svg 227x177
\begin{tikzpicture}[scale=0.7]
\draw[gray!25, very thin] (-2,-2) grid (5,3);
\draw[->] (-2.3,0) -- (5.5,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,3.6) node[above] {$y$};
\foreach \x in {1,3} \node[below] at (\x,0) {\small $\x$};
\node[left] at (0,1) {\small $1$};
\draw[thick, blue!60] (-1.8,-1.8) -- (1,1) -- (3,1) -- (5,3);
\fill (1,1) circle (0.08);
\fill (3,1) circle (0.08);
\end{tikzpicture}
```

Una funzione costante, come $y = 3$, è insieme crescente e decrescente in senso lato: è monotona, ma non strettamente, e non è né crescente né decrescente.

## Leggere gli intervalli dal grafico

Per trovare dove una funzione cresce e dove decresce, percorri il grafico da sinistra a destra e segna i punti in cui smette di salire e comincia a scendere, o il contrario. Gli intervalli si leggono sull'asse $x$: sono intervalli di ascisse, non pezzi di curva.

```ad-example
Esempio 1: tre intervalli
La funzione $f$ ha dominio $[-3, 5]$ e il grafico della figura. Trova gli intervalli in cui è crescente e quelli in cui è decrescente.

```tikz
% nome: intervalli-crescente-decrescente-dal-grafico
% alt: Il grafico di una funzione definita tra -3 e 5: sale dal punto (-3, -2) al punto (-1, 2), scende fino al punto (3, -2), risale fino al punto (5, 2); i tratti in salita sono blu, quello in discesa arancione
% svg: intervalli-crescente-decrescente-dal-grafico-7551b793.svg 266x177
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-4,-3) grid (6,3);
\draw[->] (-4.3,0) -- (6.5,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,3.6) node[above] {$y$};
\draw[dashed, gray] (-3,0) -- (-3,-2);
\draw[dashed, gray] (-1,0) -- (-1,2);
\draw[dashed, gray] (3,0) -- (3,-2);
\draw[dashed, gray] (5,0) -- (5,2);
\draw[thick, blue!60, domain=-3:-1, samples=30, smooth] plot (\x, {(\x*\x*\x - 3*\x*\x - 9*\x + 11)/8});
\draw[thick, orange!80, domain=-1:3, samples=40, smooth] plot (\x, {(\x*\x*\x - 3*\x*\x - 9*\x + 11)/8});
\draw[thick, blue!60, domain=3:5, samples=30, smooth] plot (\x, {(\x*\x*\x - 3*\x*\x - 9*\x + 11)/8});
\foreach \x/\y in {-3/-2, -1/2, 3/-2, 5/2} \fill (\x,\y) circle (0.11);
\node[above] at (-3,0) {\small $-3$};
\node[below] at (-1,0) {\small $-1$};
\node[above] at (3,0) {\small $3$};
\node[below] at (5,0) {\small $5$};
\node[left] at (0,2) {\small $2$};
\node[right] at (0,-2) {\small $-2$};
\end{tikzpicture}
```

Il grafico sale da $(-3,\ -2)$ a $(-1,\ 2)$, scende fino a $(3,\ -2)$ e risale fino a $(5,\ 2)$. Quindi $f$ è

- crescente in $[-3, -1]$ e in $[3, 5]$;
- decrescente in $[-1, 3]$.

Su tutto il dominio $f$ non è monotona: $-1 < 3$ e $f(-1) > f(3)$, ma anche $3 < 5$ e $f(3) < f(5)$.
```

```ad-note
Gli estremi degli intervalli
Il numero $-1$ compare sia in $[-3, -1]$ sia in $[-1, 3]$, e non è una contraddizione: la definizione confronta coppie di punti dello stesso intervallo, e vale in tutti e due anche con l'estremo incluso. Molti libri scrivono gli stessi intervalli aperti, "crescente per $-3 < x < -1$": va bene lo stesso. Non ha senso, invece, chiedersi se la funzione sia crescente nel solo punto $-1$.
```

## Dimostrarlo con la definizione

Per dimostrare che $f$ è crescente o decrescente in un intervallo $I$ senza il grafico:

1. Prendi due numeri qualsiasi $x_1 < x_2$ di $I$, con le lettere.
2. Scrivi la differenza $f(x_2) - f(x_1)$ e scomponila in fattori, in modo che compaia $x_2 - x_1$, che è positivo.
3. Studia il segno degli altri fattori usando il fatto che $x_1$ e $x_2$ stanno in $I$.
4. Se la differenza è sempre positiva, $f$ è crescente in $I$; se è sempre negativa, è decrescente.

Due numeri di prova non sono una dimostrazione: la disuguaglianza deve valere per tutte le coppie.

### La retta

Per $f(x) = mx + q$ la differenza è

$$
\begin{aligned}
f(x_2) - f(x_1) &= mx_2 + q - mx_1 - q \\
&= m(x_2 - x_1)
\end{aligned}
$$

Il fattore $x_2 - x_1$ è positivo, quindi il segno è quello di $m$: la funzione è crescente su tutto $\mathbb{R}$ se $m > 0$, decrescente se $m < 0$, costante se $m = 0$. È quello che dice il segno del [coefficiente angolare](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti).

### La parabola

Per $f(x) = ax^2 + bx + c$ la differenza si scompone raccogliendo $x_2 - x_1$:

$$
\begin{aligned}
f(x_2) - f(x_1) &= a(x_2^2 - x_1^2) + b(x_2 - x_1) \\
&= (x_2 - x_1)\big[a(x_1 + x_2) + b\big]
\end{aligned}
$$

Prendi $a > 0$ e due numeri $x_1 < x_2$ a destra del vertice, cioè maggiori o uguali a $x_V = -\dfrac{b}{2a}$. La loro somma supera $2x_V = -\dfrac{b}{a}$, quindi $a(x_1 + x_2) > -b$ e la parentesi quadra è positiva: la funzione è crescente. A sinistra del vertice la somma è minore di $-\dfrac{b}{a}$, la parentesi è negativa e la funzione è decrescente. Con $a < 0$ i due versi si scambiano.

| | per $x \leq x_V$ | per $x \geq x_V$ |
|---|---|---|
| $a > 0$ | decrescente | crescente |
| $a < 0$ | crescente | decrescente |

```ad-example
Esempio 2: una parabola
Trova gli intervalli in cui $f(x) = x^2 - 4x + 3$ è crescente e decrescente.

Il vertice ha ascissa $x_V = -\dfrac{-4}{2} = 2$ e ordinata $f(2) = 4 - 8 + 3 = -1$, come nella lezione [La parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola). Il coefficiente $a = 1$ è positivo, quindi la funzione è decrescente in $\mathopen{]}-\infty, 2]$ e crescente in $[2, +\infty\mathclose{[}$.

Controllo con la scomposizione: $f(x_2) - f(x_1) = (x_2 - x_1)(x_1 + x_2 - 4)$. Se $2 \leq x_1 < x_2$ la somma $x_1 + x_2$ supera $4$ e il prodotto è positivo.

```tikz
% nome: parabola-decrescente-e-crescente
% alt: La parabola y = x al quadrato meno 4x più 3 con il vertice V(2, -1): il ramo a sinistra del vertice, in arancione, scende, e la funzione è decrescente per x minore o uguale a 2; il ramo a destra, in blu, sale, e la funzione è crescente per x maggiore o uguale a 2
% svg: parabola-decrescente-e-crescente-daabcfff.svg 164x206
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-1,-2) grid (5,6);
\draw[->] (-1.3,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,6.6) node[above] {$y$};
\node[below left] at (1,0) {\small $1$};
\node[below right] at (3,0) {\small $3$};
\draw[dashed, gray] (2,-2) -- (2,6);
\node[above right] at (2,0) {\small $2$};
\draw[thick, orange!80, domain=-0.6:2, samples=40, smooth] plot (\x, {\x*\x - 4*\x + 3});
\draw[thick, blue!60, domain=2:4.6, samples=40, smooth] plot (\x, {\x*\x - 4*\x + 3});
\fill (2,-1) circle (0.12);
\node[below right] at (2,-1) {$V$};
\end{tikzpicture}
```
```grafico
% nome: parabola-crescente-decrescente-cursori
% alt: La parabola y = ax² + bx + 1 con i cursori di a e di b e la retta verticale per il vertice, tratteggiata: sotto il piano è scritta l'ascissa del vertice, il punto in cui la funzione passa da decrescente a crescente se a è positivo, da crescente a decrescente se a è negativo
curva: y=ax^2+bx+1
curva: x=-\frac{b}{2a} | tratteggiata | grigio
cursore: a = 1 da -3 a 3 passo 0,1
cursore: b = -4 da -6 a 6 passo 0,1
finestra: x da -6 a 6, y da -6 a 6
valore: x_V = -\frac{b}{2a}
domanda: Con $a$ positivo, da quale parte della retta tratteggiata la funzione è crescente? Porta $a$ sotto zero, passando per $a = 0$: che cosa succede?
```

Con $a > 0$ la funzione è crescente a destra della retta tratteggiata $x = x_V$, con $a < 0$ a sinistra. Nel passaggio per $a = 0$ la parabola diventa la retta $y = bx + 1$: il vertice non c'è più e la funzione è monotona su tutto $\mathbb{R}$, crescente se $b > 0$ e decrescente se $b < 0$.
```

### Potenze, radici e somme

```ad-example
Esempio 3: il cubo è crescente su tutto R
Dimostra che $f(x) = x^3$ è crescente su $\mathbb{R}$.

Presi $x_1 < x_2$, la differenza di due cubi si scompone:

$$x_2^3 - x_1^3 = (x_2 - x_1)(x_2^2 + x_1 x_2 + x_1^2)$$

Il primo fattore è positivo. Il secondo si riscrive come somma di due quadrati:

$$x_2^2 + x_1 x_2 + x_1^2 = \Big(x_2 + \frac{x_1}{2}\Big)^2 + \frac{3}{4}x_1^2$$

Una somma di quadrati non è mai negativa, e vale zero solo se $x_1 = 0$ e $x_2 = 0$, che è escluso perché $x_1 < x_2$. Il prodotto è positivo, quindi $f(x_1) < f(x_2)$: la funzione è crescente.
```

```ad-example
Esempio 4: la radice quadrata
Dimostra che $f(x) = \sqrt{x}$ è crescente nel suo dominio $[0, +\infty\mathclose{[}$.

Presi $0 \leq x_1 < x_2$, moltiplica e dividi la differenza per la somma delle radici, come in una [razionalizzazione](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/razionalizzazione):

$$\sqrt{x_2} - \sqrt{x_1} = \frac{x_2 - x_1}{\sqrt{x_2} + \sqrt{x_1}}$$

Il numeratore è positivo, e il denominatore anche, perché $x_2 > 0$. La differenza è positiva: la funzione è crescente.
```

La somma di due funzioni crescenti nello stesso intervallo è crescente: da $f(x_1) < f(x_2)$ e $g(x_1) < g(x_2)$, sommando membro a membro, viene $f(x_1) + g(x_1) < f(x_2) + g(x_2)$. Allo stesso modo la somma di due decrescenti è decrescente. Così $y = x^3 + 2x - 1$ è crescente su $\mathbb{R}$ senza altri conti, perché somma di $x^3$ e di $2x - 1$.

```ad-warning
Il prodotto non segue la stessa regola
Il prodotto di due funzioni crescenti può non essere crescente: $y = x$ è crescente su $\mathbb{R}$, ma $x \cdot x = x^2$ non lo è. E la somma di una crescente e di una decrescente può essere qualsiasi cosa: $x^3 + (-x)$ sale, scende e risale.
```

Nel grafico di $y = x^3 + ax$ si vede dove finisce la regola della somma. Con $a = 1$ è la somma di due funzioni crescenti:

```tikz
% nome: cubica-x-cubo-piu-x-crescente
% alt: Il grafico di y = x al cubo più x, che sale sempre da sinistra a destra passando per i punti (-1, -2), (0, 0) e (1, 2), e tratteggiato il grafico di y = x al cubo
% svg: cubica-x-cubo-piu-x-crescente-ce6568a0.svg 166x248
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-3,-5) grid (3,5);
\draw[->] (-3.3,0) -- (3.7,0) node[right] {$x$};
\draw[->] (0,-5.3) -- (0,5.6) node[above] {$y$};
\draw[thick, dashed, gray, domain=-1.7:1.7, samples=50, smooth] plot (\x, {\x*\x*\x});
\draw[thick, blue!60, domain=-1.5:1.5, samples=50, smooth] plot (\x, {\x*\x*\x + \x});
\foreach \x/\y in {-1/-2, 0/0, 1/2} \fill (\x,\y) circle (0.11);
\draw[dashed, gray] (1,0) -- (1,2) -- (0,2);
\draw[dashed, gray] (-1,0) -- (-1,-2) -- (0,-2);
\node[below] at (1,0) {\small $1$};
\node[above] at (-1,0) {\small $-1$};
\node[left] at (0,2) {\small $2$};
\node[right] at (0,-2) {\small $-2$};
\end{tikzpicture}
```
```grafico
% nome: cubica-x-cubo-piu-ax-cursore
% alt: Il grafico di y = x al cubo più ax con il cursore di a, e tratteggiato il grafico di y = x al cubo: per a positivo o nullo la curva sale sempre, per a negativo sale, scende in un tratto attorno allo zero e risale
curva: y=x^3+ax
curva: y=x^3 | tratteggiata | grigio
cursore: a = 1 da -4 a 4 passo 0,5
finestra: x da -4 a 4, y da -5 a 5
valore: f(-1) = -1-a
valore: f(1) = 1+a
domanda: Abbassa $a$: fino a quale valore la funzione resta crescente su tutto $\mathbb{R}$? Porta $a$ a $-3$ e confronta $f(-1)$ con $f(1)$.
```

Per $a > 0$ la funzione è la somma di due funzioni crescenti, $x^3$ e $ax$, ed è crescente. Per $a = 0$ resta $x^3$, crescente per l'esempio 3. Per $a < 0$ il termine $ax$ è decrescente e la regola della somma non dice più niente: con $a = -3$ si ha $f(-1) = 2$ e $f(1) = -2$, cioè al numero più grande corrisponde il valore più piccolo, e il grafico sale, scende e risale. Succede per ogni $a$ negativo, in un tratto attorno allo zero tanto più corto quanto più $a$ è vicino a zero.

## Una funzione che non è monotona nel suo dominio

La funzione $f(x) = \dfrac{1}{x}$ ha dominio $\mathbb{R} \setminus \{0\}$, che è fatto di due intervalli. La differenza è

$$\frac{1}{x_2} - \frac{1}{x_1} = \frac{x_1 - x_2}{x_1 x_2}$$

Con $x_1 < x_2$ il numeratore è negativo. Se i due numeri sono tutti e due positivi, o tutti e due negativi, il denominatore è positivo e la differenza è negativa: la funzione è decrescente in $\mathopen{]}-\infty, 0\mathclose{[}$ ed è decrescente in $\mathopen{]}0, +\infty\mathclose{[}$. Se invece $x_1$ è negativo e $x_2$ positivo, il denominatore è negativo e la differenza è positiva: $-1 < 1$, ma $f(-1) = -1 < f(1) = 1$.

```tikz
% nome: iperbole-decrescente-nei-due-rami
% alt: Il grafico di y = 1 fratto x, con i due rami che scendono entrambi da sinistra a destra; i punti (-1, -1) e (1, 1) mostrano che passando dal ramo di sinistra a quello di destra il valore aumenta
% svg: iperbole-decrescente-nei-due-rami-d24107a2.svg 229x230
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-4,-4) grid (4,4);
\draw[->] (-4.3,0) -- (4.6,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,4.6) node[above] {$y$};
\draw[thick, blue!60, domain=0.25:4, samples=60, smooth] plot (\x, {1/\x});
\draw[thick, blue!60, domain=-4:-0.25, samples=60, smooth] plot (\x, {1/\x});
\draw[dashed, gray] (-1,0) -- (-1,-1) -- (0,-1);
\draw[dashed, gray] (1,0) -- (1,1) -- (0,1);
\fill (-1,-1) circle (0.11);
\fill (1,1) circle (0.11);
\node[above] at (-1,0) {\small $-1$};
\node[below] at (1,0) {\small $1$};
\node[right] at (0,-1) {\small $-1$};
\node[left] at (0,1) {\small $1$};
\end{tikzpicture}
```
```grafico
% nome: iperbole-k-fratto-x-crescente-decrescente
% alt: Il grafico di y = k fratto x con il cursore di k: con k positivo i due rami scendono da sinistra a destra, con k negativo salgono
curva: y=\frac{k}{x}
cursore: k = 1 da -4 a 4 passo 0,5
finestra: x da -5 a 5, y da -5 a 5
domanda: Con $k$ positivo ogni ramo scende. Porta $k$ sotto zero: che cosa fanno i due rami? E per $k = 0$?
```

Con $k < 0$ i due rami salgono: la funzione è crescente per $x < 0$ e per $x > 0$, e di nuovo non lo è in tutto il dominio. Per $k = 0$ resta $y = 0$ per ogni $x \neq 0$: una funzione costante.

```ad-warning
Decrescente in due intervalli, non nella loro unione
$y = \dfrac{1}{x}$ è decrescente per $x < 0$ ed è decrescente per $x > 0$, ma non è decrescente in $\mathbb{R} \setminus \{0\}$. Gli intervalli di monotonia si elencano separati, con "e in", senza il simbolo $\cup$.
```

## Monotonia, iniettività e disequazioni

Una funzione crescente, o decrescente, in tutto il suo dominio è iniettiva. Se $x_1 \neq x_2$, uno dei due è il più piccolo, per esempio $x_1 < x_2$: allora $f(x_1) < f(x_2)$ oppure $f(x_1) > f(x_2)$, e in ogni caso $f(x_1) \neq f(x_2)$. Numeri diversi hanno immagini diverse, che è la definizione della lezione [Funzioni iniettive, suriettive e biettive](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive). Il contrario non vale: $y = \dfrac{1}{x}$ è iniettiva e non è monotona nel suo dominio.

Per una funzione crescente in $I$ la freccia della definizione si può percorrere anche al contrario. Presi $a$ e $b$ in $I$:

$$f(a) < f(b) \quad \Leftrightarrow \quad a < b$$

Infatti, se fosse $a \geq b$, si avrebbe $f(a) \geq f(b)$. Per una funzione decrescente il verso si rovescia:

$$f(a) < f(b) \quad \Leftrightarrow \quad a > b$$

È la ragione di molte regole sulle disequazioni. Elevare al cubo i due membri conserva il verso perché $x^3$ è crescente su $\mathbb{R}$; elevare al quadrato lo conserva solo tra numeri non negativi, perché $x^2$ è crescente solo per $x \geq 0$; passare ai reciproci tra due numeri positivi lo rovescia, perché $\dfrac{1}{x}$ è decrescente per $x > 0$. La stessa idea regge le [disequazioni esponenziali](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/disequazioni-esponenziali) e le [disequazioni logaritmiche](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/disequazioni-logaritmiche).

```ad-example
Esempio 5: il segno da uno zero e dalla monotonia
Una funzione $f$ è decrescente su tutto $\mathbb{R}$ e $f(2) = 0$. Per quali $x$ è positiva?

Scrivi lo zero come valore della funzione: $f(x) > 0$ equivale a $f(x) > f(2)$. La funzione è decrescente, quindi il verso si rovescia passando agli argomenti:

$$f(x) > f(2) \quad \Leftrightarrow \quad x < 2$$

La funzione è positiva per $x < 2$ e negativa per $x > 2$. In particolare non ha altri zeri: una funzione strettamente monotona ha al massimo uno zero.
```

```ad-example
Esempio 6: una funzione con il valore assoluto
Trova gli intervalli in cui $f(x) = |x - 1|$ è crescente e decrescente.

Togli il valore assoluto: $f(x) = x - 1$ per $x \geq 1$ e $f(x) = -x + 1$ per $x < 1$. Sono due rette, la prima con coefficiente angolare $1$ e la seconda con coefficiente angolare $-1$. La funzione è decrescente in $\mathopen{]}-\infty, 1]$ e crescente in $[1, +\infty\mathclose{[}$: il grafico è una V con il vertice in $(1,\ 0)$.
```

```ad-note
La funzione inversa e la funzione composta
Una funzione crescente in tutto il dominio è iniettiva, quindi ha un'inversa definita sul suo insieme immagine (lezione [Composizione e funzione inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/composizione-e-funzione-inversa)), e anche l'inversa è crescente: $x^2$ per $x \geq 0$ e la sua inversa $\sqrt{x}$ sono crescenti tutte e due. L'inversa di una decrescente è decrescente.

Per le funzioni composte vale una regola dei segni: componendo due funzioni crescenti, o due decrescenti, si ottiene una funzione crescente; componendo una crescente e una decrescente si ottiene una decrescente. Per esempio $y = \sqrt{5 - x}$ è decrescente nel suo dominio, perché $5 - x$ è decrescente e la radice è crescente.
```

## Errori frequenti

```ad-warning
Confondere crescente e positiva
"Crescente" riguarda il confronto tra due valori della funzione, "positiva" il confronto di un valore con lo zero. $y = x - 5$ è crescente su tutto $\mathbb{R}$ ed è negativa per $x < 5$; $y = \dfrac{1}{x}$ per $x > 0$ è positiva e decrescente.
```

```ad-warning
Guardare l'asse sbagliato
Gli intervalli di monotonia sono intervalli di $x$. Se il grafico sale dal punto $(-3,\ -2)$ al punto $(-1,\ 2)$, la funzione è crescente in $[-3, -1]$, non in $[-2, 2]$: quest'ultimo è l'intervallo delle ordinate.
```

Le funzioni che ripetono lo stesso andamento a intervalli regolari, salendo e scendendo sempre allo stesso modo, sono l'argomento della lezione [Funzioni periodiche](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-periodiche).
