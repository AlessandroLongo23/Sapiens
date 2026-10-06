# Funzione logaritmica

Una coltura di batteri raddoppia ogni ora: dopo $x$ ore i batteri sono $2^x$ volte quelli di partenza. La domanda rovesciata è altrettanto naturale: dopo quante ore saranno $y$ volte tanti? La risposta è l'esponente che porta $2$ a $y$, cioè $\log_2 y$. La funzione che a ogni numero positivo associa il suo logaritmo è la funzione logaritmica: è l'inversa della [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale), e dal suo grafico vengono le regole con cui si risolvono le [equazioni](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-logaritmiche) e le [disequazioni logaritmiche](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/disequazioni-logaritmiche).

Ti servono la definizione di logaritmo e le sue proprietà, dalla lezione [Logaritmi e loro proprietà](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta), e la [funzione inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/composizione-e-funzione-inversa).

## La funzione y = logₐ x

Fissata una base $a$ positiva e diversa da $1$, la **funzione logaritmica** di base $a$ è la funzione

$$f(x) = \log_a x$$

Il logaritmo esiste solo se l'argomento è positivo, quindi il dominio è l'insieme dei numeri reali positivi, $\mathopen{]}0, +\infty\mathclose{[}$. Nessun punto del grafico ha ascissa negativa o nulla: la curva sta tutta a destra dell'asse $y$.

Per disegnare $y = \log_2 x$ conviene scegliere per $x$ le potenze di $2$, che hanno il logaritmo intero:

| $x$ | $\dfrac{1}{4}$ | $\dfrac{1}{2}$ | $1$ | $2$ | $4$ | $8$ |
|---|---|---|---|---|---|---|
| $y = \log_2 x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |

```tikz
% nome: funzione-logaritmica-base-2
% alt: Il grafico di y = logaritmo in base 2 di x con i punti (1/4, -2), (1/2, -1), (1, 0), (2, 1), (4, 2) e (8, 3): la curva sta a destra dell'asse y, scende lungo l'asse per x vicino a zero, taglia l'asse x in 1 e poi sale sempre più lentamente
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-0.5,-3.5) grid (8.5,3.5);
\draw[->] (-0.8,0) -- (9.1,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,4.1) node[above] {$y$};
\foreach \x in {2,4,8} \node[below] at (\x,0) {\small $\x$};
\node[below right] at (1,0) {\small $1$};
\foreach \y in {-2,-1,1,2,3} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60, domain=0.09:8.5, samples=120, smooth] plot (\x, {ln(\x)/ln(2)});
\foreach \x/\y in {0.25/-2, 0.5/-1, 1/0, 2/1, 4/2, 8/3} \fill (\x,\y) circle (0.1);
\node[blue!60!black, above left] at (8.4,3.1) {$y = \log_2 x$};
\end{tikzpicture}
```

Nel grafico si leggono quattro cose, che valgono per ogni base $a > 1$.

- La curva passa per $(1, 0)$, perché $\log_a 1 = 0$, e per $(a, 1)$, perché $\log_a a = 1$. Il punto $(1, 0)$ è l'unica intersezione con l'asse $x$, e l'asse $y$ non viene mai incontrato.
- La funzione è [crescente](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-crescenti-e-decrescenti): andando verso destra la curva sale sempre.
- Il logaritmo è negativo per $0 < x < 1$ e positivo per $x > 1$.
- La funzione assume tutti i valori reali: il suo insieme immagine è $\mathbb{R}$. Per quanto in alto o in basso tu fissi un numero $c$, il valore $c$ viene raggiunto in $x = a^c$.

Quando $x$ si avvicina a $0$ la curva scende senza fermarsi e si accosta all'asse $y$ senza toccarlo: $\log_2 \dfrac{1}{1024} = -10$, e con argomenti ancora più piccoli il logaritmo scende ancora. L'asse $y$, cioè la retta $x = 0$, è un asintoto del grafico, come l'asse $x$ lo è per la funzione esponenziale: qui è un **asintoto verticale**.

Verso destra, invece, la curva sale, ma sempre più lentamente: con la base $2$, per salire di una unità l'ascissa deve raddoppiare. Si ha $\log_2 1024 = 10$, e per arrivare a $20$ serve $x = 2^{20}$, che supera il milione.

```ad-warning
La curva non si ferma e non diventa orizzontale
Il grafico di $y = \log_2 x$ sale lentamente, ma non ha un tetto: supera qualunque altezza, se $x$ è abbastanza grande. Disegnarlo come una curva che si appiattisce contro una retta orizzontale è un errore. L'unico asintoto è quello verticale.
```

## Base maggiore di 1 e base minore di 1

Con la base $\dfrac{1}{2}$ la tabella ha gli stessi valori con il segno cambiato, perché $\left(\dfrac{1}{2}\right)^{-1} = 2$, $\left(\dfrac{1}{2}\right)^{-2} = 4$ e così via:

| $x$ | $\dfrac{1}{4}$ | $\dfrac{1}{2}$ | $1$ | $2$ | $4$ | $8$ |
|---|---|---|---|---|---|---|
| $y = \log_{\frac{1}{2}} x$ | $2$ | $1$ | $0$ | $-1$ | $-2$ | $-3$ |

Non è un caso. Per il cambiamento di base, $\log_{\frac{1}{a}} x = -\log_a x$ per ogni $x$ positivo: i grafici di $y = \log_a x$ e di $y = \log_{\frac{1}{a}} x$ sono simmetrici rispetto all'asse $x$, come succede ogni volta che si passa da $f(x)$ a $-f(x)$ (lezione [Trasformazioni dei grafici](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/trasformazioni-dei-grafici)).

```tikz
% nome: funzione-logaritmica-basi-2-e-un-mezzo
% alt: I grafici di y = logaritmo in base 2 di x, crescente, e di y = logaritmo in base un mezzo di x, decrescente: passano tutti e due per (1, 0) e sono simmetrici rispetto all'asse x; sono segnati i punti (2, 1) e (2, -1), (4, 2) e (4, -2)
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-0.5,-3.5) grid (8.5,3.5);
\draw[->] (-0.8,0) -- (9.1,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,4.1) node[above] {$y$};
\foreach \x in {2,4,8} \node[below] at (\x,-0.05) {\small $\x$};
\foreach \y in {-2,-1,1,2} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60, domain=0.09:8.5, samples=120, smooth] plot (\x, {ln(\x)/ln(2)});
\draw[thick, orange!70, domain=0.09:8.5, samples=120, smooth] plot (\x, {-ln(\x)/ln(2)});
\foreach \x/\y in {1/0, 2/1, 4/2, 2/-1, 4/-2} \fill (\x,\y) circle (0.1);
\node[blue!60!black, above left] at (8.4,3.1) {$y = \log_2 x$};
\node[orange!70!black, below left] at (8.4,-3.1) {$y = \log_{\frac{1}{2}} x$};
\end{tikzpicture}
```
```grafico
% nome: funzione-logaritmica-cursore-base
% alt: Il grafico di y = logaritmo in base a di x con il cursore della base a, da 0,1 a 5, e il grafico di y = logaritmo in base 2 di x tratteggiato per confronto: con a maggiore di 1 la curva sale, con a tra 0 e 1 scende, e passa sempre per (1, 0)
curva: y=\log_a\left(x\right)
curva: y=\log_2\left(x\right) | tratteggiata | grigio
curva: A=\left(a;\log_a\left(a\right)\right) | nero | nome
cursore: a = 3 da 0,1 a 5 passo 0,1
finestra: x da -2 a 10, y da -6 a 6
valore: A = \left(a;\log_a\left(a\right)\right)
domanda: Porta $a$ sotto $1$: che cosa fa la curva? C'è un punto per cui passa sempre? E per quale valore di $a$ la curva sparisce?
```

Con $a$ sotto $1$ la curva scende invece di salire, e passa sempre per $(1, 0)$ e per il punto $A(a, 1)$. Per $a = 1$ sparisce: il logaritmo in base $1$ non esiste, e tra le curve crescenti e quelle decrescenti non ce n'è una di mezzo. Più $a$ è vicino a $1$, da una parte o dall'altra, più la curva è ripida.

| | $a > 1$ | $0 < a < 1$ |
|---|---|---|
| Dominio | $\mathopen{]}0, +\infty\mathclose{[}$ | $\mathopen{]}0, +\infty\mathclose{[}$ |
| Insieme immagine | $\mathbb{R}$ | $\mathbb{R}$ |
| Andamento | crescente | decrescente |
| Punti del grafico | $(1, 0)$ e $(a, 1)$ | $(1, 0)$ e $(a, 1)$ |
| $\log_a x > 0$ | per $x > 1$ | per $0 < x < 1$ |
| $\log_a x < 0$ | per $0 < x < 1$ | per $x > 1$ |
| Vicino a $x = 0$ | la curva scende lungo l'asse $y$ | la curva sale lungo l'asse $y$ |

Le due righe sul segno si ricordano con una sola frase: il logaritmo è positivo quando base e argomento stanno dalla stessa parte rispetto a $1$, tutti e due maggiori o tutti e due minori; è negativo quando stanno da parti opposte. Così $\log_3 5 > 0$ e $\log_{\frac{1}{3}} \dfrac{1}{5} > 0$, mentre $\log_3 \dfrac{1}{5} < 0$ e $\log_{\frac{1}{3}} 5 < 0$.

## L'inversa della funzione esponenziale

Per la definizione di logaritmo, le uguaglianze $y = a^x$ e $x = \log_a y$ dicono la stessa cosa. La funzione esponenziale $x \mapsto a^x$ porta ogni numero reale in un numero positivo ed è biettiva da $\mathbb{R}$ a $\mathopen{]}0, +\infty\mathclose{[}$; la funzione logaritmica fa il percorso al contrario, da $\mathopen{]}0, +\infty\mathclose{[}$ a $\mathbb{R}$: è la sua [funzione inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/composizione-e-funzione-inversa). Dominio e insieme immagine si scambiano.

| | $y = a^x$ | $y = \log_a x$ |
|---|---|---|
| Dominio | $\mathbb{R}$ | $\mathopen{]}0, +\infty\mathclose{[}$ |
| Insieme immagine | $\mathopen{]}0, +\infty\mathclose{[}$ | $\mathbb{R}$ |
| Passa per | $(0, 1)$ e $(1, a)$ | $(1, 0)$ e $(a, 1)$ |
| Asintoto | l'asse $x$ | l'asse $y$ |

Comporre una funzione con la sua inversa dà l'identità, e si ritrovano due uguaglianze della lezione sui logaritmi:

$$\log_a a^x = x \ \text{ per ogni } x \in \mathbb{R} \qquad a^{\log_a x} = x \ \text{ per ogni } x > 0$$

Il grafico di una funzione inversa si ottiene scambiando le coordinate di ogni punto, cioè con la simmetria rispetto alla bisettrice $y = x$. Il punto $(3, 8)$ del grafico di $y = 2^x$ diventa il punto $(8, 3)$ del grafico di $y = \log_2 x$; $(0, 1)$ diventa $(1, 0)$; $\Big(-1, \dfrac{1}{2}\Big)$ diventa $\Big(\dfrac{1}{2}, -1\Big)$.

```tikz
% nome: esponenziale-logaritmo-simmetria-bisettrice
% alt: I grafici di y = 2 alla x e di y = logaritmo in base 2 di x, simmetrici rispetto alla bisettrice y = x tratteggiata: i punti (0, 1) e (1, 0), (1, 2) e (2, 1), (2, 4) e (4, 2) sono uno lo specchio dell'altro
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-3.5,-3.5) grid (5.5,5.5);
\draw[->] (-3.8,0) -- (6.1,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,6.1) node[above] {$y$};
\foreach \x in {-2,2,4} \node[below] at (\x,-0.05) {\small $\x$};
\foreach \y in {-2,2,4} \node[left] at (-0.05,\y) {\small $\y$};
\draw[dashed, gray] (-3.5,-3.5) -- (5.5,5.5) node[above, gray] {\small $y = x$};
\draw[thick, orange!70, domain=-3.5:2.45, samples=80, smooth] plot (\x, {pow(2,\x)});
\draw[thick, blue!60, domain=0.09:5.5, samples=120, smooth] plot (\x, {ln(\x)/ln(2)});
\draw[gray, densely dotted] (0,1) -- (1,0);
\draw[gray, densely dotted] (1,2) -- (2,1);
\draw[gray, densely dotted] (2,4) -- (4,2);
\foreach \x/\y in {0/1, 1/0, 1/2, 2/1, 2/4, 4/2} \fill (\x,\y) circle (0.1);
\node[orange!70!black, left] at (2.3,5.2) {$y = 2^x$};
\node[blue!60!black, below] at (4.9,1.95) {$y = \log_2 x$};
\end{tikzpicture}
```
```grafico
% nome: esponenziale-logaritmo-cursore-base
% alt: I grafici di y = a alla x e di y = logaritmo in base a di x con il cursore della base a e la bisettrice y = x tratteggiata: per ogni valore di a le due curve sono simmetriche rispetto alla bisettrice
curva: y=a^x | arancione
curva: y=\log_a\left(x\right) | blu
curva: y=x | tratteggiata | grigio
cursore: a = 2 da 0,1 a 5 passo 0,1
finestra: x da -6 a 6, y da -6 a 6
domanda: Con $a = 2$ le due curve non si toccano. Porta $a$ sotto $1$: su quale retta sta il punto in cui si incontrano? E che cosa resta per $a = 1$?
```

Per ogni $a$ diverso da $1$ le due curve sono una lo specchio dell'altra rispetto alla bisettrice. Con $a$ tra $0$ e $1$ sono tutte e due decrescenti e si incontrano in un punto della bisettrice $y = x$. Per $a = 1$ l'esponenziale diventa la retta $y = 1$, che non è iniettiva e quindi non ha inversa: la curva del logaritmo sparisce.

## Confrontare due logaritmi

Che la funzione sia crescente o decrescente si traduce in una regola per confrontare due logaritmi con la stessa base. Siano $x_1$ e $x_2$ due numeri positivi.

- Se $a > 1$, la funzione è crescente e conserva l'ordine: $x_1 < x_2$ se e solo se $\log_a x_1 < \log_a x_2$.
- Se $0 < a < 1$, la funzione è decrescente e rovescia l'ordine: $x_1 < x_2$ se e solo se $\log_a x_1 > \log_a x_2$.

In tutti e due i casi la funzione è iniettiva, cioè argomenti diversi hanno logaritmi diversi:

$$\log_a x_1 = \log_a x_2 \iff x_1 = x_2$$

Queste proprietà vengono da quelle della funzione esponenziale, che è crescente per $a > 1$ e decrescente per $0 < a < 1$: una funzione e la sua inversa hanno lo stesso andamento. Su di esse si reggono le due lezioni che seguono: l'uguaglianza serve per le equazioni logaritmiche, le due disuguaglianze per le disequazioni.

Nella figura, con la base $2$, il punto $Q$ di ascissa $5$ sta più in alto del punto $P$ di ascissa $3$: $\log_2 3 < \log_2 5$.

```tikz
% nome: confronto-logaritmi-due-punti
% alt: Il grafico di y = logaritmo in base 2 di x con i punti P di ascissa 3 e Q di ascissa 5: Q sta più in alto di P, perché la funzione è crescente; due tratteggi portano le ordinate sull'asse y, circa 1,58 e 2,32
\begin{tikzpicture}[scale=0.68]
\draw[gray!25, very thin] (-0.5,-2.5) grid (6.5,3.5);
\draw[->] (-0.8,0) -- (7.1,0) node[right] {$x$};
\draw[->] (0,-2.8) -- (0,4.1) node[above] {$y$};
\foreach \x in {1,3,5} \node[below] at (\x,-0.05) {\small $\x$};
\draw[thick, blue!60, domain=0.18:6.5, samples=120, smooth] plot (\x, {ln(\x)/ln(2)});
\draw[dashed, gray] (3,0) -- (3,1.585) -- (0,1.585);
\draw[dashed, gray] (5,0) -- (5,2.322) -- (0,2.322);
\fill (3,1.585) circle (0.09);
\fill (5,2.322) circle (0.09);
\node[below right] at (3,1.585) {$P$};
\node[below right] at (5,2.322) {$Q$};
\node[left] at (0,1.5) {\small $\log_2 3$};
\node[left] at (0,2.4) {\small $\log_2 5$};
\end{tikzpicture}
```
```grafico
% nome: confronto-logaritmi-cursore-base
% alt: Il grafico di y = logaritmo in base a di x con il cursore della base a e i punti P di ascissa 3 e Q di ascissa 5: sotto il piano sono scritti i due logaritmi; con a maggiore di 1 Q sta più in alto di P, con a tra 0 e 1 più in basso
curva: y=\log_a\left(x\right)
curva: P=\left(3;\log_a\left(3\right)\right) | nero | nome
curva: Q=\left(5;\log_a\left(5\right)\right) | nero | nome
cursore: a = 2 da 0,2 a 4 passo 0,1
finestra: x da -2 a 10, y da -6 a 6
valore: \log_a 3 = \log_a\left(3\right)
valore: \log_a 5 = \log_a\left(5\right)
domanda: Per quali valori di $a$ il punto $P$ sta più in alto di $Q$?
```

Per tutti i valori di $a$ tra $0$ e $1$: la curva scende, e il punto con l'ascissa minore è quello più in alto. In quei casi i due logaritmi sono negativi, e $\log_a 3 > \log_a 5$.

```ad-example
Esempio 1: stessa base, argomenti diversi
Metti il segno $<$ o $>$ tra $\log_3 7$ e $\log_3 10$, e tra $\log_{0{,}5} 3$ e $\log_{0{,}5} 5$.

La base $3$ è maggiore di $1$ e l'ordine si conserva: da $7 < 10$ segue $\log_3 7 < \log_3 10$.

La base $0{,}5$ è minore di $1$ e l'ordine si rovescia: da $3 < 5$ segue $\log_{0{,}5} 3 > \log_{0{,}5} 5$. Infatti sono due numeri negativi, circa $-1{,}58$ e $-2{,}32$, e il primo è il maggiore.
```

```ad-example
Esempio 2: tra quali interi sta un logaritmo
Senza calcolatrice, trova tra quali numeri interi consecutivi stanno $\log_2 20$ e $\log_3 \dfrac{1}{5}$.

Cerca le due potenze della base tra cui cade l'argomento. Per il primo, $16 < 20 < 32$, cioè $2^4 < 20 < 2^5$; la funzione $\log_2 x$ è crescente, quindi

$$4 < \log_2 20 < 5$$

Per il secondo, $\dfrac{1}{9} < \dfrac{1}{5} < \dfrac{1}{3}$, cioè $3^{-2} < \dfrac{1}{5} < 3^{-1}$, quindi

$$-2 < \log_3 \frac{1}{5} < -1$$

La calcolatrice conferma: $\log_2 20 \approx 4{,}32$ e $\log_3 \dfrac{1}{5} \approx -1{,}46$.
```

```ad-example
Esempio 3: basi diverse, confronto con 1
Quale dei due numeri è maggiore, $\log_2 3$ o $\log_3 2$?

Le basi sono diverse, e la regola del confronto vale solo a parità di base; ognuno dei due numeri, però, si confronta con $1$. Da $3 > 2$ segue $\log_2 3 > \log_2 2 = 1$; da $2 < 3$ segue $\log_3 2 < \log_3 3 = 1$. Quindi

$$\log_3 2 < 1 < \log_2 3$$
```

```ad-warning
Con la base minore di 1 l'ordine si rovescia
Scrivere $\log_{\frac{1}{2}} 8 > \log_{\frac{1}{2}} 4$ "perché $8 > 4$" è sbagliato: $\log_{\frac{1}{2}} 8 = -3$ e $\log_{\frac{1}{2}} 4 = -2$, e $-3 < -2$. Prima di confrontare due logaritmi guarda la base.
```

## Il dominio di una funzione con un logaritmo

Per le funzioni di questa lezione il [dominio naturale](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-reali-e-dominio) ha una condizione in più rispetto a quelle che conosci per i denominatori e per le radici di indice pari: l'argomento di ogni logaritmo deve essere positivo. La condizione è una disequazione con il verso $>$, mai $\geq$.

```ad-example
Esempio 4: argomento di primo e di secondo grado
Trova il dominio di $f(x) = \log_2 (x - 3)$ e di $g(x) = \ln \left(4 - x^2\right)$.

Per $f$ serve $x - 3 > 0$, cioè $x > 3$: il dominio è $\mathopen{]}3, +\infty\mathclose{[}$.

Per $g$ serve $4 - x^2 > 0$, cioè $x^2 < 4$: è una [disequazione di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado), vera per i valori interni $-2 < x < 2$. Il dominio è $\mathopen{]}-2, 2\mathclose{[}$.
```

Il dominio si legge sul grafico: la curva di $g(x) = \ln \left(4 - x^2\right)$ sta tutta nella striscia tra le rette $x = -2$ e $x = 2$, e scende lungo le due rette senza toccarle.

```tikz
% nome: dominio-logaritmo-striscia
% alt: Il grafico di y = logaritmo naturale di 4 meno x al quadrato: sta tutto tra le rette verticali x = -2 e x = 2, tratteggiate, ha il punto più alto sull'asse y e scende lungo le due rette senza toccarle
\begin{tikzpicture}[scale=0.68]
\draw[gray!25, very thin] (-3.5,-4.5) grid (3.5,2.5);
\draw[->] (-3.8,0) -- (4.1,0) node[right] {$x$};
\draw[->] (0,-4.8) -- (0,3.1) node[above] {$y$};
\foreach \x in {-3,-1,1,3} \node[below] at (\x,-0.05) {\small $\x$};
\draw[dashed, gray] (-2,-4.6) -- (-2,2.6) node[above] {\small $x = -2$};
\draw[dashed, gray] (2,-4.6) -- (2,2.6) node[above] {\small $x = 2$};
\draw[thick, blue!60, domain=-1.9972:1.9972, samples=220, smooth] plot (\x, {ln(4 - \x*\x)});
\node[blue!60!black, right] at (2.1,-1.6) {\small $y = \ln (4 - x^2)$};
\end{tikzpicture}
```
```grafico
% nome: dominio-logaritmo-cursore
% alt: Il grafico di y = logaritmo naturale di c meno x al quadrato con il cursore di c e le rette verticali x = radice di c e x = meno radice di c tratteggiate: la curva sta nella striscia tra le due rette, che si stringe quando c diminuisce e sparisce quando c non è positivo
curva: y=\ln\left(c-x^2\right)
curva: x=\sqrt{c} | tratteggiata | grigio
curva: x=-\sqrt{c} | tratteggiata | grigio
cursore: c = 4 da -2 a 9 passo 0,5
finestra: x da -5 a 5, y da -7 a 3
valore: \sqrt{c} = \sqrt{c}
domanda: Riduci $c$: che cosa succede al dominio? Per quali valori di $c$ la funzione non esiste per nessun $x$?
```

Il dominio è $-\sqrt{c} < x < \sqrt{c}$, e si stringe quando $c$ diminuisce. Per $c \leq 0$ l'argomento $c - x^2$ non è positivo per nessun $x$: il dominio è vuoto, e non c'è nessuna curva.

```ad-example
Esempio 5: argomento fratto
Trova il dominio di $f(x) = \log \dfrac{x + 1}{x - 2}$.

Serve $\dfrac{x + 1}{x - 2} > 0$, una [disequazione fratta](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte). Il numeratore è positivo per $x > -1$, il denominatore per $x > 2$: la frazione è positiva dove hanno lo stesso segno, cioè per $x < -1$ oppure $x > 2$. Il dominio è

$$\mathopen{]}-\infty, -1\mathclose{[} \,\cup\, \mathopen{]}2, +\infty\mathclose{[}$$

La condizione $x \neq 2$ del denominatore è già compresa.
```

```ad-example
Esempio 6: il logaritmo al denominatore o sotto radice
Trova il dominio di $f(x) = \dfrac{1}{\ln x}$ e di $g(x) = \sqrt{\log_2 x}$.

Per $f$ le condizioni sono due: $x > 0$ per il logaritmo e $\ln x \neq 0$ per il denominatore. Il logaritmo vale zero solo per $x = 1$, quindi il dominio è $\mathopen{]}0, 1\mathclose{[} \,\cup\, \mathopen{]}1, +\infty\mathclose{[}$.

Per $g$ serve $x > 0$ e in più $\log_2 x \geq 0$ per la radice. Con la base $2$ il logaritmo è positivo per $x > 1$ e nullo per $x = 1$, quindi il dominio è $[1, +\infty\mathclose{[}$.
```

```ad-warning
Due scritture che non hanno lo stesso dominio
$f(x) = \log_2 x^2$ e $g(x) = 2\log_2 x$ non sono la stessa funzione. Per $f$ serve $x^2 > 0$, cioè $x \neq 0$: il dominio è $\mathbb{R} \setminus \{0\}$. Per $g$ serve $x > 0$. Le due funzioni coincidono solo per $x > 0$; per $x = -4$ la prima vale $\log_2 16 = 4$ e la seconda non esiste. Il dominio si trova sulla scrittura di partenza, prima di applicare le proprietà.
```

## Grafici che si ottengono da y = logₐ x

Con le [trasformazioni dei grafici](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/trasformazioni-dei-grafici) da una sola curva se ne ricavano molte. Per $y = \log_a (x - h) + k$ il grafico di $y = \log_a x$ si sposta di $h$ in orizzontale e di $k$ in verticale: l'asintoto verticale passa da $x = 0$ a $x = h$, il dominio diventa $x > h$, e il punto $(1, 0)$ va in $(1 + h, k)$.

```ad-example
Esempio 7: una traslazione
Disegna il grafico di $y = \log_2 (x + 4) - 1$.

Qui $h = -4$ e $k = -1$: il grafico di $y = \log_2 x$ si sposta di $4$ a sinistra e di $1$ in basso. Il dominio è $x > -4$ e l'asintoto è la retta $x = -4$. Il punto $(1, 0)$ va in $(-3, -1)$ e il punto $(2, 1)$ in $(-2, 0)$.

Le intersezioni con gli assi si trovano anche con il calcolo. Con l'asse $x$:

$$
\begin{gathered}
\log_2 (x + 4) = 1 \\
\Rightarrow x + 4 = 2 \\
\Rightarrow x = -2
\end{gathered}
$$

Con l'asse $y$: per $x = 0$ si ha $y = \log_2 4 - 1 = 1$. Il grafico passa per $A(-2, 0)$ e per $B(0, 1)$.

```tikz
% nome: logaritmo-traslato-asintoto
% alt: Il grafico di y = logaritmo in base 2 di (x + 4), meno 1, con l'asintoto verticale x = -4 tratteggiato: la curva passa per (-3, -1), per A (-2, 0) sull'asse x e per B (0, 1) sull'asse y; tratteggiato in grigio il grafico di y = logaritmo in base 2 di x
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-4.5,-3.5) grid (5.5,3.5);
\draw[->] (-4.8,0) -- (6.1,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,4.1) node[above] {$y$};
\foreach \x in {-3,-1,2,4} \node[below] at (\x,-0.05) {\small $\x$};
\foreach \y in {-2,2} \node[right] at (0,\y) {\small $\y$};
\draw[dashed, gray] (-4,-3.6) -- (-4,3.6) node[above] {\small $x = -4$};
\draw[dashed, gray, domain=0.09:5.5, samples=100, smooth] plot (\x, {ln(\x)/ln(2)});
\draw[thick, blue!60, domain=-3.82:5.5, samples=140, smooth] plot (\x, {ln(\x+4)/ln(2) - 1});
\foreach \x/\y in {-3/-1, -2/0, 0/1} \fill (\x,\y) circle (0.1);
\node[above left] at (-2,0) {$A$};
\node[above left] at (0,1) {$B$};
\end{tikzpicture}
```
```grafico
% nome: logaritmo-traslato-cursori
% alt: Il grafico di y = logaritmo in base 2 di (x - h), più k, con i cursori di h e di k, l'asintoto verticale x = h tratteggiato e il grafico di y = logaritmo in base 2 di x in grigio: h sposta la curva e l'asintoto in orizzontale, k sposta la curva in verticale e con lei lo zero Z, scritto sotto il piano insieme all'asintoto
curva: y=\log_2\left(x-h\right)+k
curva: x=h | tratteggiata | grigio
curva: y=\log_2\left(x\right) | sottile | grigio
cursore: h = -4 da -5 a 3 passo 0,5
cursore: k = -1 da -2 a 4 passo 0,5
finestra: x da -7 a 7, y da -7 a 7
curva: Z=\left(h+2^{-k};0\right) | nero | nome
valore: \text{asintoto: } x = h
valore: Z = \left(h+2^{-k};0\right)
domanda: Muovi solo $k$: l'asintoto si sposta? E lo zero $Z$? Per quale $k$ lo zero sta a distanza $1$ dall'asintoto?
```
```

Nel piano dell'esempio 7 il cursore $k$ sposta la curva in verticale e lascia fermi l'asintoto $x = h$ e il dominio $x > h$, che dipendono solo da $h$. Lo zero invece si sposta, perché ha ascissa $h + 2^{-k}$: sta a distanza $1$ dall'asintoto solo per $k = 0$, e gli si avvicina quando $k$ cresce.

Le altre trasformazioni funzionano come per ogni funzione: $y = -\log_a x$ è il simmetrico rispetto all'asse $x$ (ed è il grafico di $\log_{\frac{1}{a}} x$), $y = \log_a (-x)$ è il simmetrico rispetto all'asse $y$, con dominio $x < 0$.

```ad-warning
Il più dentro l'argomento sposta a sinistra
$y = \log_2 (x + 4)$ è il grafico di $y = \log_2 x$ spostato a sinistra di $4$, non a destra: l'asintoto è dove l'argomento vale zero, cioè in $x = -4$. Il numero dentro l'argomento sposta in orizzontale, quello fuori ($\log_2 x + 4$) in verticale.
```

```ad-note
Dove si incontrano i logaritmi: le scale logaritmiche
Quando una grandezza varia di molti ordini di grandezza, si misura con il suo logaritmo decimale. Il pH di una soluzione è $-\log$ della concentrazione degli ioni idrogeno, misurata in moli per litro: una concentrazione di $10^{-3}$ dà $\text{pH} = 3$, una di $10^{-7}$ dà $\text{pH} = 7$. Ogni volta che la concentrazione si moltiplica per $10$, il pH scende di $1$. Funzionano nello stesso modo i decibel per l'intensità dei suoni e la magnitudo per i terremoti: un passo sulla scala corrisponde a una moltiplicazione della grandezza.
```
