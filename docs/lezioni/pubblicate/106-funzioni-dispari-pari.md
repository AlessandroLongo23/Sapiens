# Funzioni pari e dispari

La parabola $y = x^2$ è fatta di due metà uguali, una a destra e una a sinistra dell'asse $y$: se conosci il grafico per $x \geq 0$, l'altra metà la ottieni ribaltandolo. Molte funzioni hanno una simmetria di questo tipo, e riconoscerla dalla formula dimezza il lavoro: studi la funzione per $x \geq 0$ e il resto viene da sé. Le simmetrie che si leggono sulla formula sono due, e danno il nome alle funzioni pari e alle funzioni dispari.

Ti servono il dominio di una funzione, dalla lezione [Funzioni reali e dominio](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-reali-e-dominio), e i punti simmetrici rispetto agli assi e all'origine, dalla lezione [Il piano cartesiano: distanza e punto medio](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio).

## Funzioni pari

Una funzione $f$ di dominio $D$ è **pari** se, per ogni $x$ del dominio, anche $-x$ appartiene al dominio e

$$f(-x) = f(x)$$

In parole: due numeri opposti hanno la stessa immagine. Per $f(x) = x^4 - 3x^2 + 1$ il dominio è $\mathbb{R}$ e

$$
\begin{aligned}
f(-x) &= (-x)^4 - 3(-x)^2 + 1 \\
&= x^4 - 3x^2 + 1 = f(x)
\end{aligned}
$$

perché una potenza con esponente pari non cambia quando la base cambia segno. La funzione è pari: $f(1) = f(-1) = -1$ e $f(2) = f(-2) = 5$.

Nel grafico, i punti $(x,\ f(x))$ e $(-x,\ f(x))$ hanno ascisse opposte e la stessa ordinata, quindi sono simmetrici rispetto all'asse $y$. Vale per ogni punto, e allora il grafico di una funzione pari è simmetrico rispetto all'asse $y$: piegando il foglio lungo l'asse $y$ le due metà si sovrappongono.

```tikz
% nome: funzione-pari-simmetria-asse-y
% alt: Il grafico di y = x alla quarta meno 3 x al quadrato più 1, simmetrico rispetto all'asse y: i punti A(1, -1) e A'(-1, -1) sono alla stessa altezza da parti opposte dell'asse y, e così i punti B(2, 5) e B'(-2, 5)
% svg: funzione-pari-simmetria-asse-y-67eaa85a.svg 252x195
\begin{tikzpicture}[xscale=0.9, yscale=0.5]
\draw[gray!25, very thin] (-3,-2) grid (3,6);
\draw[->] (-3.3,0) -- (3.5,0) node[right] {$x$};
\draw[->] (0,-2.4) -- (0,6.8) node[above] {$y$};
\foreach \x in {-2,2} \node[below] at (\x,0) {\small $\x$};
\foreach \x in {-1,1} \node[above] at (\x,0) {\small $\x$};
\node[above left] at (0,5) {\small $5$};
\draw[dashed, gray] (-1,-1) -- (1,-1);
\draw[dashed, gray] (-2,5) -- (2,5);
\draw[thick, blue!60, domain=-2.08:2.08, samples=80, smooth] plot (\x, {\x*\x*\x*\x - 3*\x*\x + 1});
\foreach \x/\y in {1/-1, -1/-1, 2/5, -2/5} \fill (\x,\y) ellipse (0.08 and 0.144);
\node[below right] at (1,-1) {$A$};
\node[below left] at (-1,-1) {$A'$};
\node[right] at (2,5) {$B$};
\node[left] at (-2,5) {$B'$};
\end{tikzpicture}
```
```grafico
% nome: funzione-pari-termine-dispari-cursore
% alt: Il grafico di y = x alla quarta meno 3 x al quadrato più bx più 1, con il cursore di b, e tratteggiato il suo simmetrico rispetto all'asse y: le due curve coincidono solo quando b vale zero, cioè quando la funzione è pari
curva: y=x^4-3x^2+bx+1
curva: y=x^4-3x^2-bx+1 | tratteggiata | grigio
cursore: b = 0 da -3 a 3 passo 0,1
finestra: x da -4 a 4, y da -3 a 6
valore: f(1) = b-1
valore: f(-1) = -b-1
domanda: La curva tratteggiata è la simmetrica rispetto all'asse $y$ di quella continua, e con $b = 0$ la copre. Aggiungi il termine $bx$ muovendo $b$: le due curve coincidono ancora?
```

Con $b = 0$ le due curve sono una sola: la funzione è pari. Appena $b$ è diverso da zero si separano, e sotto il piano $f(1)$ e $f(-1)$ non sono più uguali: un solo termine di grado dispari toglie la simmetria.

## Funzioni dispari

Una funzione $f$ di dominio $D$ è **dispari** se, per ogni $x$ del dominio, anche $-x$ appartiene al dominio e

$$f(-x) = -f(x)$$

In parole: due numeri opposti hanno immagini opposte. Per $f(x) = x^3 - 3x$ il dominio è $\mathbb{R}$ e

$$
\begin{aligned}
f(-x) &= (-x)^3 - 3(-x) \\
&= -x^3 + 3x \\
&= -(x^3 - 3x) = -f(x)
\end{aligned}
$$

perché una potenza con esponente dispari cambia segno quando la base cambia segno. La funzione è dispari: $f(1) = -2$ e $f(-1) = 2$, $f(2) = 2$ e $f(-2) = -2$.

Nel grafico, i punti $(x,\ f(x))$ e $(-x,\ -f(x))$ hanno tutte e due le coordinate opposte, quindi sono simmetrici rispetto all'origine: l'origine è il punto medio del segmento che li unisce. Il grafico di una funzione dispari è simmetrico rispetto all'origine, cioè torna su sé stesso dopo mezzo giro attorno a $O$ (la simmetria centrale della lezione [Trasformazioni geometriche](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/trasformazioni-geometriche)).

```tikz
% nome: funzione-dispari-simmetria-origine
% alt: Il grafico di y = x al cubo meno 3x, simmetrico rispetto all'origine: i punti A(1, -2) e A'(-1, 2) sono uniti da un segmento tratteggiato che ha l'origine come punto medio, e così i punti B(2, 2) e B'(-2, -2)
% svg: funzione-dispari-simmetria-origine-e8f8ade0.svg 182x230
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-3,-4) grid (3,4);
\draw[->] (-3.3,0) -- (3.6,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,4.6) node[above] {$y$};
\draw[dashed, gray] (-1,2) -- (1,-2);
\draw[dashed, gray] (-2,-2) -- (2,2);
\draw[thick, blue!60, domain=-2.17:2.17, samples=80, smooth] plot (\x, {\x*\x*\x - 3*\x});
\foreach \x/\y in {1/-2, -1/2, 2/2, -2/-2, 0/0} \fill (\x,\y) circle (0.11);
\node[below] at (1,-2) {$A$};
\node[above] at (-1,2) {$A'$};
\node[right] at (2,2) {$B$};
\node[left] at (-2,-2) {$B'$};
\node[below right] at (0,0) {\small $O$};
\end{tikzpicture}
```
```grafico
% nome: funzione-dispari-termine-noto-cursore
% alt: Il grafico di y = x al cubo meno 3x più c, con il cursore di c, e tratteggiato il suo simmetrico rispetto all'origine, y = x al cubo meno 3x meno c: i due grafici coincidono solo quando c vale zero, cioè quando la funzione è dispari
curva: y=x^3-3x+c
curva: y=x^3-3x-c | tratteggiata | grigio
cursore: c = 1 da -3 a 3 passo 0,1
finestra: x da -4 a 4, y da -5 a 5
valore: f(1) = c-2
valore: f(-1) = c+2
domanda: La curva tratteggiata è la simmetrica rispetto all'origine di quella continua. Muovi $c$: per quale valore coincidono? In quel caso dove passa il grafico?
```

Le due curve coincidono solo per $c = 0$, quando il grafico passa per l'origine. Per ogni altro $c$ lo dicono i valori sotto il piano: $f(1) = c - 2$ e $f(-1) = c + 2$ sono opposti solo se $c = 0$.

```ad-warning
Il segno meno dentro e fuori
$f(-x)$ si calcola mettendo $-x$ al posto di $x$, tra parentesi: in $f(x) = x^2 + 1$ viene $(-x)^2 + 1 = x^2 + 1$. Invece $-f(x)$ è l'opposto di tutta la funzione: $-(x^2 + 1) = -x^2 - 1$. Sono due conti diversi, e la funzione è dispari solo se danno lo stesso risultato.
```

## Come si riconosce

1. Trova il dominio e controlla che sia simmetrico rispetto allo zero: insieme a ogni $x$ deve contenere $-x$. Se non lo è, la funzione non è né pari né dispari, e hai finito.
2. Calcola $f(-x)$, sostituendo $-x$ al posto di $x$ con le parentesi, e semplifica.
3. Confronta: se hai ritrovato $f(x)$, la funzione è pari; se hai trovato $-f(x)$, cioè $f(x)$ con tutti i segni cambiati, è dispari; altrimenti non è né pari né dispari.

Sono simmetrici rispetto allo zero, per esempio, $\mathbb{R}$, $\mathbb{R} \setminus \{0\}$, $[-2, 2]$, $\mathbb{R} \setminus \{-3,\ 3\}$. Non lo sono $[0, +\infty\mathclose{[}$ e $\mathbb{R} \setminus \{1\}$.

Per dimostrare che una funzione è pari o dispari serve il conto con la lettera, che vale per ogni $x$. Per dimostrare che non lo è, invece, è sufficiente un numero: un solo $x$ per cui $f(-x) \neq f(x)$ esclude che sia pari, un solo $x$ per cui $f(-x) \neq -f(x)$ esclude che sia dispari.

```ad-warning
Né pari né dispari
"Non pari" non vuol dire "dispari". Per i numeri interi le possibilità sono due, per le funzioni sono tre, e la terza è la più comune: la maggior parte delle funzioni non è né pari né dispari. Per $f(x) = x^2 + x$ si ha $f(1) = 2$ e $f(-1) = 0$, che non sono né uguali né opposti.
```

```ad-warning
Due valori uguali non dimostrano niente
Per $f(x) = x^3 - x$ si ha $f(1) = 0$ e $f(-1) = 0$: uguali, ma la funzione non è pari, perché $f(2) = 6$ e $f(-2) = -6$. Un controllo con i numeri può smentire una simmetria, non dimostrarla.
```

## Le potenze di x e i polinomi

I nomi vengono dalle potenze. La potenza $x^n$ con $n$ pari è una funzione pari, perché $(-x)^n = x^n$; con $n$ dispari è una funzione dispari, perché $(-x)^n = -x^n$. A sinistra $y = x^2$ e $y = x^4$, simmetriche rispetto all'asse $y$; a destra $y = x$ e $y = x^3$, simmetriche rispetto all'origine.

```tikz
% nome: potenze-pari-e-potenze-dispari
% alt: A sinistra i grafici di y = x al quadrato e y = x alla quarta, due curve a forma di coppa simmetriche rispetto all'asse y; a destra i grafici di y = x e y = x al cubo, simmetrici rispetto all'origine
% svg: potenze-pari-e-potenze-dispari-ab15775c.svg 304x175
\begin{tikzpicture}[scale=0.8]
\begin{scope}
\draw[->] (-1.9,0) -- (2.1,0) node[right] {\small $x$};
\draw[->] (0,-0.6) -- (0,3.4) node[above] {\small $y$};
\node[below] at (1,0) {\small $1$};
\node[below] at (-1,0) {\small $-1$};
\draw[thick, blue!60, domain=-1.7:1.7, samples=50, smooth] plot (\x, {\x*\x});
\draw[thick, teal!70, domain=-1.3:1.3, samples=50, smooth] plot (\x, {\x*\x*\x*\x});
\node[blue!60!black, right] at (1.7,2.7) {\small $x^2$};
\node[teal!70!black, above] at (1.05,2.95) {\small $x^4$};
\node at (0,-1.1) {\small esponente pari};
\end{scope}
\begin{scope}[shift={(5.4,1.4)}]
\draw[->] (-1.9,0) -- (2.1,0) node[right] {\small $x$};
\draw[->] (0,-2.2) -- (0,2.3) node[above] {\small $y$};
\node[below] at (1,0) {\small $1$};
\node[below] at (-1,0) {\small $-1$};
\draw[thick, orange!80, domain=-1.8:1.8, samples=2] plot (\x, {\x});
\draw[thick, red!60, domain=-1.26:1.26, samples=50, smooth] plot (\x, {\x*\x*\x});
\node[orange!80!black, right] at (1.8,1.7) {\small $x$};
\node[red!60!black, above] at (1.05,2.05) {\small $x^3$};
\node at (0,-2.5) {\small esponente dispari};
\end{scope}
\end{tikzpicture}
```
```grafico
% nome: potenza-x-alla-n-cursore
% alt: Il grafico di y = x alla n con il cursore dell'esponente n, intero da 1 a 8: con n pari il grafico è simmetrico rispetto all'asse y e non scende sotto l'asse x, con n dispari è simmetrico rispetto all'origine
curva: y=x^n
cursore: n = 2 da 1 a 8 passo 1
finestra: x da -3 a 3, y da -3 a 3
domanda: Fai crescere $n$ di uno alla volta: per quali esponenti il grafico è simmetrico rispetto all'asse $y$? E rispetto all'origine?
```

Con $n = 2$, $4$, $6$, $8$ il grafico è simmetrico rispetto all'asse $y$; con $n = 3$, $5$, $7$ rispetto all'origine. Il primo caso, $n = 1$, è la retta $y = x$: anche lei è simmetrica rispetto all'origine.

Per i polinomi ne viene una regola che evita il conto:

- un polinomio con soli termini di grado pari è una funzione pari. Il termine noto conta come grado pari, perché $c = c \cdot x^0$: $y = x^4 - 3x^2 + 1$ è pari;
- un polinomio con soli termini di grado dispari è una funzione dispari: $y = x^3 - 3x$;
- un polinomio con termini di grado pari e termini di grado dispari non è né pari né dispari: $y = x^2 + x$.

La regola vale per i polinomi scritti in forma normale, non per le altre funzioni: per una frazione o una radice si calcola $f(-x)$.

## Due proprietà utili

Se una funzione dispari è definita in $x = 0$, allora $f(0) = 0$: il suo grafico passa per l'origine. Infatti la definizione con $x = 0$ dà $f(-0) = -f(0)$, cioè $f(0) = -f(0)$, e l'unico numero uguale al proprio opposto è zero. Per questo $y = x^3 + 1$, che in zero vale $1$, non può essere dispari. Una funzione dispari non definita in zero, come $y = \dfrac{1}{x}$, non passa per l'origine, e resta dispari.

La seconda proprietà riguarda le operazioni. Il prodotto e il quoziente di funzioni pari e dispari seguono la regola dei segni, con "pari" al posto del più e "dispari" al posto del meno:

| $f$ | $g$ | $f \cdot g$ e $\dfrac{f}{g}$ |
|---|---|---|
| pari | pari | pari |
| dispari | dispari | pari |
| pari | dispari | dispari |

Per esempio, se $f$ e $g$ sono dispari e $h(x) = f(x) \cdot g(x)$, allora

$$
\begin{aligned}
h(-x) &= f(-x) \cdot g(-x) \\
&= \big(-f(x)\big) \cdot \big(-g(x)\big) \\
&= f(x) \cdot g(x) = h(x)
\end{aligned}
$$

e $h$ è pari. Gli altri casi si dimostrano allo stesso modo. Per la somma: la somma di due funzioni pari è pari, la somma di due funzioni dispari è dispari, mentre la somma di una pari e di una dispari, se nessuna delle due è la funzione nulla, non è né pari né dispari, come $x^2 + x$.

```ad-note
Pari e dispari insieme
C'è una sola funzione che è sia pari sia dispari su un dominio simmetrico: quella che vale sempre zero. Se $f(-x) = f(x)$ e $f(-x) = -f(x)$, allora $f(x) = -f(x)$ per ogni $x$, quindi $f(x) = 0$.
```

## Esempi svolti

```ad-example
Esempio 1: un polinomio dispari
Stabilisci se $f(x) = 2x^5 - x^3 + 4x$ è pari, dispari o nessuna delle due.

Il dominio è $\mathbb{R}$, simmetrico rispetto allo zero. Calcola $f(-x)$:

$$
\begin{aligned}
f(-x) &= 2(-x)^5 - (-x)^3 + 4(-x) \\
&= -2x^5 + x^3 - 4x \\
&= -(2x^5 - x^3 + 4x)
\end{aligned}
$$

Hai trovato $-f(x)$: la funzione è dispari. Lo dicevano già gli esponenti $5$, $3$ e $1$, tutti dispari.
```

```ad-example
Esempio 2: né pari né dispari
Stabilisci se $f(x) = x^2 - 2x$ è pari, dispari o nessuna delle due.

Il dominio è $\mathbb{R}$. Calcola $f(-x)$:

$$f(-x) = (-x)^2 - 2(-x) = x^2 + 2x$$

Non è $f(x) = x^2 - 2x$, e non è $-f(x) = -x^2 + 2x$. Per esserne certi serve un numero: $f(1) = -1$ e $f(-1) = 3$, che non sono né uguali né opposti. La funzione non è né pari né dispari.
```

```ad-example
Esempio 3: una funzione fratta
Stabilisci se $f(x) = \dfrac{x}{x^2 - 4}$ è pari, dispari o nessuna delle due.

Il denominatore si annulla per $x = \pm 2$, quindi $D = \mathbb{R} \setminus \{-2,\ 2\}$: è simmetrico rispetto allo zero, perché i due valori esclusi sono opposti.

$$
\begin{aligned}
f(-x) &= \frac{-x}{(-x)^2 - 4} \\
&= \frac{-x}{x^2 - 4} \\
&= -\frac{x}{x^2 - 4} = -f(x)
\end{aligned}
$$

La funzione è dispari. Torna con la tabella: il numeratore $x$ è dispari, il denominatore $x^2 - 4$ è pari, e il quoziente di una dispari e di una pari è dispari.
```

```ad-example
Esempio 4: una radice
Stabilisci se $f(x) = \sqrt{4 - x^2}$ è pari, dispari o nessuna delle due.

Il dominio viene da $4 - x^2 \geq 0$, cioè $-2 \leq x \leq 2$: $D = [-2, 2]$, simmetrico rispetto allo zero.

$$f(-x) = \sqrt{4 - (-x)^2} = \sqrt{4 - x^2} = f(x)$$

La funzione è pari.
```

```ad-example
Esempio 5: il dominio decide da solo
Stabilisci se $f(x) = \dfrac{x^2}{x - 1}$ è pari, dispari o nessuna delle due.

Il dominio è $D = \mathbb{R} \setminus \{1\}$. Contiene $-1$ ma non il suo opposto $1$: non è simmetrico rispetto allo zero. La funzione non è né pari né dispari, e non serve calcolare $f(-x)$: l'uguaglianza della definizione dovrebbe valere anche per $x = -1$, ma $f(1)$ non esiste.

Per lo stesso motivo $y = \sqrt{x}$, che ha dominio $[0, +\infty\mathclose{[}$, non è né pari né dispari.
```

```ad-example
Esempio 6: un prodotto con il valore assoluto
Stabilisci se $f(x) = x \cdot |x|$ è pari, dispari o nessuna delle due.

Il dominio è $\mathbb{R}$. Ricorda che $|-x| = |x|$:

$$f(-x) = (-x) \cdot |-x| = -x \cdot |x| = -f(x)$$

La funzione è dispari: è il prodotto di $x$, dispari, e di $|x|$, pari. Togliendo il valore assoluto si vede com'è fatta: vale $x^2$ per $x \geq 0$ e $-x^2$ per $x < 0$, mezza parabola verso l'alto a destra e mezza verso il basso a sinistra.
```

## Usare la simmetria

Se sai che una funzione è pari o dispari, ti serve solo la metà dei valori: quelli per $x \geq 0$. Gli altri si ricavano dalla definizione.

```ad-example
Esempio 7: valori di una funzione dispari
Di una funzione dispari $f$, definita su tutto $\mathbb{R}$, sai che $f(2) = 5$ e $f(-3) = 1$. Trova $f(-2)$, $f(3)$ e $f(0)$.

Numeri opposti hanno immagini opposte: $f(-2) = -f(2) = -5$ e $f(3) = -f(-3) = -1$. La funzione è definita in zero, quindi $f(0) = 0$.

Se la funzione fosse pari, avresti $f(-2) = 5$ e $f(3) = 1$, e di $f(0)$ non potresti dire niente.
```

Lo stesso vale per il grafico. Disegnata la parte con $x \geq 0$, per una funzione pari la completi con la sua simmetrica rispetto all'asse $y$; per una funzione dispari con la sua simmetrica rispetto all'origine, che ottieni ribaltando prima rispetto all'asse $y$ e poi rispetto all'asse $x$. Nella figura lo stesso arco, disegnato per $0 \leq x \leq 3$, è completato nei due modi.

```tikz
% nome: completare-grafico-pari-e-dispari
% alt: Lo stesso arco di curva, disegnato per x tra 0 e 3, completato in due modi con una parte tratteggiata: a sinistra con il simmetrico rispetto all'asse y, e la funzione è pari; a destra con il simmetrico rispetto all'origine, sotto l'asse x, e la funzione è dispari
% svg: completare-grafico-pari-e-dispari-d51120b4.svg 403x158
\begin{tikzpicture}[scale=0.62]
\begin{scope}
\draw[->] (-3.5,0) -- (3.8,0) node[right] {\small $x$};
\draw[->] (0,-2.3) -- (0,2.6) node[above] {\small $y$};
\node[below] at (3,0) {\small $3$};
\node[below] at (-3,0) {\small $-3$};
\draw[thick, blue!60, domain=0:3, samples=40, smooth] plot (\x, {\x*(3-\x)/1.5});
\draw[thick, dashed, orange!80, domain=-3:0, samples=40, smooth] plot (\x, {-\x*(3+\x)/1.5});
\node at (0,-2.9) {\small pari};
\end{scope}
\begin{scope}[shift={(9,0)}]
\draw[->] (-3.5,0) -- (3.8,0) node[right] {\small $x$};
\draw[->] (0,-2.3) -- (0,2.6) node[above] {\small $y$};
\node[below] at (3,0) {\small $3$};
\node[above] at (-3,0) {\small $-3$};
\draw[thick, blue!60, domain=0:3, samples=40, smooth] plot (\x, {\x*(3-\x)/1.5});
\draw[thick, dashed, orange!80, domain=-3:0, samples=40, smooth] plot (\x, {\x*(3+\x)/1.5});
\node at (0,-2.9) {\small dispari};
\end{scope}
\end{tikzpicture}
```

Le stesse simmetrie, viste come operazioni sul grafico di una funzione qualsiasi, tornano nella lezione [Trasformazioni dei grafici](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/trasformazioni-dei-grafici).
