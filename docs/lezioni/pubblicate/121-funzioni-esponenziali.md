# Funzione esponenziale

Una coltura di batteri che raddoppia ogni ora parte da $1$ milione di cellule: dopo un'ora sono $2$ milioni, dopo due ore $4$, dopo tre ore $8$, dopo $x$ ore $2^x$ milioni. Nella formula $2^x$ la variabile sta all'esponente, e la funzione che ne viene, la funzione esponenziale, descrive tutto quello che cresce o cala di una percentuale fissa a ogni passo: un capitale in banca, una popolazione, una sostanza radioattiva.

Per seguire la lezione ti servono le proprietà delle potenze, fino alle [potenze con esponente razionale](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/potenze-con-esponente-razionale), e la definizione di [funzione crescente e decrescente](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-crescenti-e-decrescenti).

## Potenze con esponente reale

Con una base $a$ positiva sai già calcolare $a^x$ quando $x$ è un numero razionale: $2^3 = 8$, $2^{-1} = \dfrac{1}{2}$, $2^{\frac{1}{2}} = \sqrt{2}$, $2^{1{,}4} = 2^{\frac{7}{5}} = \sqrt[5]{2^7}$. Resta da dare un significato a una potenza con l'esponente irrazionale, come $2^{\sqrt{2}}$.

Il numero $\sqrt{2} = 1{,}41421\ldots$ si può stringere tra due numeri decimali vicini quanto vuoi, uno per difetto e uno per eccesso. Calcolando le potenze di $2$ con questi esponenti, che sono razionali, si ottiene:

| Esponente per difetto | Potenza | Esponente per eccesso | Potenza |
|---|---|---|---|
| $1{,}4$ | $2{,}6390$ | $1{,}5$ | $2{,}8284$ |
| $1{,}41$ | $2{,}6574$ | $1{,}42$ | $2{,}6759$ |
| $1{,}414$ | $2{,}6647$ | $1{,}415$ | $2{,}6666$ |
| $1{,}4142$ | $2{,}6651$ | $1{,}4143$ | $2{,}6653$ |

Le potenze della seconda colonna crescono, quelle della quarta calano, e si avvicinano tra loro: c'è un solo numero reale che sta sopra tutte le prime e sotto tutte le seconde, e quel numero è per definizione $2^{\sqrt{2}}$. Vale circa $2{,}6651$.

Lo stesso procedimento definisce la **potenza con esponente reale** $a^x$ per ogni base $a > 0$ e per ogni esponente $x$ reale. Che il numero stretto tra le due colonne esista e sia uno solo si dimostra con le proprietà dei numeri reali, e qui lo prendiamo per buono. Le cose da ricordare sono tre.

- La base deve essere positiva. Con una base negativa la potenza non ha significato già per gli esponenti razionali, come hai visto con $(-8)^{\frac{1}{3}}$ nella lezione sulle potenze con esponente razionale.
- Il risultato è sempre positivo: $a^x > 0$ per ogni $x$.
- Valgono le cinque proprietà delle potenze, con $a$ e $b$ positivi e $x$ e $y$ reali qualunque:

$$
\begin{gathered}
a^x \cdot a^y = a^{x+y} \qquad a^x : a^y = a^{x-y} \\
\left(a^x\right)^y = a^{x \cdot y} \\
a^x \cdot b^x = (a \cdot b)^x \qquad a^x : b^x = (a : b)^x
\end{gathered}
$$

Restano vere anche $a^0 = 1$ e $a^{-x} = \dfrac{1}{a^x}$. Per esempio $2^{\sqrt{2}} \cdot 2^{-\sqrt{2}} = 2^0 = 1$ e $\left(3^{\sqrt{2}}\right)^{\sqrt{2}} = 3^{\sqrt{2} \cdot \sqrt{2}} = 3^2 = 9$.

## La funzione esponenziale

Dato che $a^x$ ha significato per ogni $x$ reale, a ogni numero $x$ si può associare il numero $a^x$. Si chiama **funzione esponenziale** di base $a$ la funzione

$$y = a^x \qquad \text{con } a > 0 \text{ e } a \neq 1$$

La base $a$ è un numero fissato, la variabile $x$ è l'esponente. La base $1$ è esclusa perché $1^x = 1$ per ogni $x$: si ottiene la funzione costante $y = 1$, che ha per grafico una retta orizzontale e non è né crescente né decrescente.

```ad-warning
Esponenziale e potenza non sono la stessa funzione
In $y = 2^x$ la variabile è l'esponente, in $y = x^2$ è la base. Sono due funzioni diverse: per $x = 10$ la prima vale $2^{10} = 1024$, la seconda $10^2 = 100$. La prima è una funzione esponenziale, la seconda ha per grafico una [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola).
```

## Il grafico quando la base è maggiore di 1

Per disegnare $y = 2^x$ calcola qualche valore:

| $x$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |
|---|---|---|---|---|---|---|---|
| $y$ | $\dfrac{1}{8}$ | $\dfrac{1}{4}$ | $\dfrac{1}{2}$ | $1$ | $2$ | $4$ | $8$ |

Ogni volta che $x$ aumenta di $1$ il valore di $y$ raddoppia, e ogni volta che $x$ cala di $1$ si dimezza. Andando verso destra la curva sale sempre più in fretta. Andando verso sinistra i valori diventano piccoli quanto vuoi, $2^{-10} = \dfrac{1}{1024}$, ma restano positivi: la curva si avvicina all'asse $x$ senza toccarlo.

```tikz
% nome: grafico-esponenziale-base-2
% alt: Il grafico di y = 2 alla x: passa per i punti (-2, 1/4), (-1, 1/2), (0, 1), (1, 2), (2, 4) e (3, 8), sale da sinistra verso destra e a sinistra si avvicina all'asse x senza toccarlo
% svg: grafico-esponenziale-base-2-d8783ec9.svg 191x227
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-1) grid (4,9);
\draw[->] (-4.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,9.6) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {1,2,4,8} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60, domain=-4:3.1, samples=60, smooth] plot (\x, {exp(0.693147*\x)});
\foreach \x/\y in {-2/0.25, -1/0.5, 0/1, 1/2, 2/4, 3/8} \fill (\x,\y) circle (0.13);
\node[blue!60!black, right] at (3.1,8.6) {$y = 2^x$};
\end{tikzpicture}
```

Dal grafico si leggono le proprietà di $y = a^x$ quando $a > 1$.

- Il dominio è $\mathbb{R}$: la potenza si calcola per ogni $x$.
- L'immagine è $\mathopen{]}0, +\infty\mathclose{[}$: la funzione assume tutti i valori positivi e solo quelli. Il grafico sta tutto sopra l'asse $x$ e non lo incontra mai.
- Il grafico passa per $(0, 1)$, perché $a^0 = 1$, e per $(1, a)$, perché $a^1 = a$.
- La funzione è crescente: se $x_1 < x_2$ allora $a^{x_1} < a^{x_2}$.
- Andando verso sinistra il grafico si avvicina sempre di più all'asse $x$. Una retta a cui una curva si avvicina in questo modo si chiama **asintoto**: l'asse $x$ è un asintoto orizzontale del grafico.

Che i valori positivi siano presi tutti, senza buchi, è una proprietà che si dimostra con gli strumenti del quinto anno. È quella che permette di definire i [logaritmi](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta).

## Il grafico quando la base è tra 0 e 1

Prendi ora $y = \left(\dfrac{1}{2}\right)^x$. Per la proprietà dell'esponente negativo

$$\left(\frac{1}{2}\right)^x = \left(2^{-1}\right)^x = 2^{-x}$$

quindi il valore che $y = 2^x$ assume in $x$ è lo stesso che $y = \left(\dfrac{1}{2}\right)^x$ assume in $-x$:

| $x$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |
|---|---|---|---|---|---|---|---|
| $y$ | $8$ | $4$ | $2$ | $1$ | $\dfrac{1}{2}$ | $\dfrac{1}{4}$ | $\dfrac{1}{8}$ |

I due grafici sono simmetrici rispetto all'asse $y$, come succede sempre tra $y = f(x)$ e $y = f(-x)$ (lo trovi nella lezione [Trasformazioni dei grafici](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/trasformazioni-dei-grafici)). Questa volta a ogni passo verso destra il valore si dimezza: la curva scende, e si avvicina all'asse $x$ andando verso destra.

```tikz
% nome: grafici-esponenziali-base-2-e-un-mezzo
% alt: I grafici di y = 2 alla x, che sale, e di y = un mezzo alla x, che scende: sono simmetrici rispetto all'asse y e si incontrano nel punto (0, 1)
% svg: grafici-esponenziali-base-2-e-un-mezzo-a48e8022.svg 187x227
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-1) grid (4,9);
\draw[->] (-4.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,9.6) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {2,4,8} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60, domain=-4:3.1, samples=60, smooth] plot (\x, {exp(0.693147*\x)});
\draw[thick, orange!70, domain=-3.1:4, samples=60, smooth] plot (\x, {exp(-0.693147*\x)});
\foreach \x/\y in {-3/8, -2/4, -1/2, 0/1, 1/2, 2/4, 3/8} \fill (\x,\y) circle (0.13);
\node[blue!60!black, above] at (2.6,8.9) {$y = 2^x$};
\node[orange!70!black, above] at (-2.5,8.9) {$y = \left(\frac{1}{2}\right)^x$};
\end{tikzpicture}
```
```grafico
% nome: esponenziali-basi-reciproche-cursore
% alt: I grafici di y = a alla x e di y = (1/a) alla x con il cursore di a: sono sempre simmetrici rispetto all'asse y, si incontrano in (0, 1) e coincidono nella retta y = 1 quando a vale 1
curva: y=a^x | blu
curva: y=\left(\frac{1}{a}\right)^x | arancione
cursore: a = 2 da 0,2 a 4 passo 0,1
finestra: x da -5 a 5, y da -2 a 8
valore: \frac{1}{a} = \frac{1}{a}
domanda: Muovi $a$: le due curve restano simmetriche rispetto all'asse $y$? Per quale valore di $a$ diventano una curva sola?
```

Qualunque sia $a$, le due curve sono una lo specchio dell'altra rispetto all'asse $y$, perché $\left(\dfrac{1}{a}\right)^x = a^{-x}$. Coincidono solo per $a = 1$, quando anche $\dfrac{1}{a}$ vale $1$ e tutte e due diventano la retta $y = 1$. Portando $a$ sotto $1$ le due curve si scambiano i ruoli: quella di base $a$ scende e quella di base $\dfrac{1}{a}$ sale.

Lo stesso vale per ogni base tra $0$ e $1$: dominio, immagine, punto $(0, 1)$ e asintoto restano quelli di prima, e cambia solo il verso, perché la funzione è decrescente.

| | $a > 1$ | $0 < a < 1$ |
|---|---|---|
| Dominio | $\mathbb{R}$ | $\mathbb{R}$ |
| Immagine | $\mathopen{]}0, +\infty\mathclose{[}$ | $\mathopen{]}0, +\infty\mathclose{[}$ |
| Passa per | $(0, 1)$ e $(1, a)$ | $(0, 1)$ e $(1, a)$ |
| Andamento | crescente | decrescente |
| Si avvicina all'asse $x$ | verso sinistra | verso destra |

La base decide anche quanto in fretta la curva sale o scende. Tra due basi maggiori di $1$, quella più grande dà la curva più ripida: a destra dell'asse $y$ il grafico di $y = 3^x$ sta sopra quello di $y = 2^x$, a sinistra sta sotto. Tutte le curve passano per $(0, 1)$.

```tikz
% nome: grafici-esponenziali-quattro-basi
% alt: I grafici di y = 3 alla x e y = 2 alla x, crescenti, e di y = un mezzo alla x e y = un terzo alla x, decrescenti: passano tutti per il punto (0, 1) e quelli con base 3 e un terzo sono i più ripidi
% svg: grafici-esponenziali-quattro-basi-2866067b.svg 200x227
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-1) grid (4,9);
\draw[->] (-4.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,9.6) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3} \node[below] at (\x,0) {\small $\x$};
\draw[thick, red!50, domain=-4:2, samples=60, smooth] plot (\x, {exp(1.098612*\x)});
\draw[thick, blue!60, domain=-4:3.1, samples=60, smooth] plot (\x, {exp(0.693147*\x)});
\draw[thick, orange!70, domain=-3.1:4, samples=60, smooth] plot (\x, {exp(-0.693147*\x)});
\draw[thick, teal!60, domain=-2:4, samples=60, smooth] plot (\x, {exp(-1.098612*\x)});
\fill (0,1) circle (0.13);
\node[red!50!black, above] at (1.3,9) {$3^x$};
\node[blue!60!black, right] at (3.1,8.4) {$2^x$};
\node[orange!70!black, left] at (-3.1,8.4) {$\left(\frac{1}{2}\right)^x$};
\node[teal!60!black, above] at (-1.2,9) {$\left(\frac{1}{3}\right)^x$};
\end{tikzpicture}
```
```grafico
% nome: esponenziale-base-cursore
% alt: Il grafico di y = a alla x con il cursore della base a, da 0,1 a 4, il punto (1, a) e la curva y = 2 alla x tratteggiata per confronto: con a maggiore di 1 la curva sale, con a tra 0 e 1 scende, e passa sempre per (0, 1)
curva: y=a^x
curva: y=2^x | tratteggiata | grigio
curva: A=\left(1;a\right) | nero
cursore: a = 3 da 0,1 a 4 passo 0,1
finestra: x da -5 a 5, y da -2 a 8
domanda: Porta $a$ da $3$ fino a $0{,}2$: per quale valore smette di salire, e che curva è in quel momento?
```

Finché $a$ è maggiore di $1$ la curva sale, sempre meno ripida man mano che $a$ si avvicina a $1$. Per $a = 1$ è la retta orizzontale $y = 1$: la funzione è costante, ed è il caso che la definizione esclude. Appena $a$ scende sotto $1$ la curva scende. I casi sono tre, crescente, costante e decrescente, e il punto $(0, 1)$ non si muove mai.

```ad-example
Esempio 1: crescente o decrescente
Stabilisci se sono crescenti o decrescenti le funzioni $y = \left(\dfrac{3}{2}\right)^x$, $y = 0{,}7^x$, $y = \left(\sqrt{2} - 1\right)^x$ e $y = 3^{-x}$.

Conta solo il confronto tra la base e $1$.

- $\dfrac{3}{2} > 1$: la funzione è crescente.
- $0 < 0{,}7 < 1$: la funzione è decrescente.
- $\sqrt{2} - 1 \approx 0{,}41$ sta tra $0$ e $1$: la funzione è decrescente.
- $3^{-x} = \left(\dfrac{1}{3}\right)^x$: la base è $\dfrac{1}{3}$, e la funzione è decrescente.

Nell'ultima il segno meno all'esponente nasconde la base vera: prima di rispondere scrivi sempre la funzione nella forma $a^x$.
```

```ad-warning
L'esponenziale non è mai negativa né nulla
$2^x$ è positivo per ogni $x$, anche quando $x$ è negativo: $2^{-3} = \dfrac{1}{8}$, non $-8$ e non $-6$. Un esponente negativo dà il reciproco, non cambia il segno. Per questo equazioni come $2^x = 0$ e $2^x = -4$ non hanno soluzioni.
```

```ad-warning
Il meno davanti non fa parte della base
$-2^x$ vuol dire $-(2^x)$: è l'opposto di $2^x$, ed è negativo per ogni $x$. La scrittura $(-2)^x$, con la base negativa, non definisce una funzione esponenziale.
```

## Che cosa dice l'andamento sulle potenze

Una funzione crescente o decrescente su tutto il dominio non assume mai due volte lo stesso valore: è [iniettiva](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive). Da qui vengono le regole per le potenze con la stessa base, valide per $a > 0$ e $a \neq 1$.

Due potenze con la stessa base sono uguali solo se hanno lo stesso esponente:

$$a^{x_1} = a^{x_2} \iff x_1 = x_2$$

Per confrontarle, invece, serve sapere se la base è maggiore o minore di $1$:

$$
\begin{gathered}
a > 1: \quad a^{x_1} < a^{x_2} \iff x_1 < x_2 \\
0 < a < 1: \quad a^{x_1} < a^{x_2} \iff x_1 > x_2
\end{gathered}
$$

Con la base maggiore di $1$ la potenza più grande è quella con l'esponente più grande; con la base tra $0$ e $1$ è quella con l'esponente più piccolo. La prima regola è il punto di partenza delle [equazioni esponenziali](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-esponenziali), le altre due delle [disequazioni esponenziali](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/disequazioni-esponenziali).

```ad-example
Esempio 2: confrontare potenze senza calcolarle
Metti il segno $<$ o $>$ tra $2^{\sqrt{3}}$ e $2^{1{,}7}$, tra $0{,}3^{2}$ e $0{,}3^{\pi}$, tra $\left(\dfrac{2}{3}\right)^{-2}$ e $\left(\dfrac{2}{3}\right)^{-1}$.

Nella prima coppia la base $2$ è maggiore di $1$, quindi l'ordine delle potenze è quello degli esponenti. Dato che $\sqrt{3} \approx 1{,}73 > 1{,}7$:

$$2^{\sqrt{3}} > 2^{1{,}7}$$

Nella seconda la base $0{,}3$ è minore di $1$, e l'ordine si rovescia. Dato che $2 < \pi$:

$$0{,}3^{2} > 0{,}3^{\pi}$$

Nella terza la base $\dfrac{2}{3}$ è minore di $1$ e gli esponenti sono negativi: $-2 < -1$, quindi l'ordine si rovescia.

$$\left(\frac{2}{3}\right)^{-2} > \left(\frac{2}{3}\right)^{-1}$$

Qui puoi controllare con il conto: $\left(\dfrac{2}{3}\right)^{-2} = \dfrac{9}{4}$ e $\left(\dfrac{2}{3}\right)^{-1} = \dfrac{3}{2}$, e in effetti $\dfrac{9}{4} > \dfrac{3}{2}$.
```

```ad-example
Esempio 3: trovare la base da un punto
Trova la funzione esponenziale $y = a^x$ il cui grafico passa per $P(2, 9)$, e quella il cui grafico passa per $Q(-1, 4)$.

Un punto sta sul grafico se le sue coordinate rendono vera l'equazione. Per $P$:

$$a^2 = 9$$

I numeri che al quadrato danno $9$ sono $3$ e $-3$, ma la base di un'esponenziale è positiva: $a = 3$, e la funzione è $y = 3^x$.

Per $Q$:

$$
\begin{gathered}
a^{-1} = 4 \\
\Rightarrow \frac{1}{a} = 4 \\
\Rightarrow a = \frac{1}{4}
\end{gathered}
$$

La funzione è $y = \left(\dfrac{1}{4}\right)^x$, decrescente. Verifica: $\left(\dfrac{1}{4}\right)^{-1} = 4$.
```

## Grafici che si ottengono da quello di aˣ

Molte funzioni che incontrerai hanno il grafico di un'esponenziale spostato o ribaltato. Le regole sono quelle della lezione [Trasformazioni dei grafici](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/trasformazioni-dei-grafici), applicate a $y = a^x$:

| Funzione | Come si ottiene da $y = a^x$ | Asintoto | Immagine |
|---|---|---|---|
| $y = a^x + k$ | si sposta in su di $k$ (in giù se $k < 0$) | $y = k$ | $\mathopen{]}k, +\infty\mathclose{[}$ |
| $y = a^{x - h}$ | si sposta a destra di $h$ (a sinistra se $h < 0$) | $y = 0$ | $\mathopen{]}0, +\infty\mathclose{[}$ |
| $y = -a^x$ | si ribalta rispetto all'asse $x$ | $y = 0$ | $\mathopen{]}-\infty, 0\mathclose{[}$ |
| $y = a^{-x}$ | si ribalta rispetto all'asse $y$ | $y = 0$ | $\mathopen{]}0, +\infty\mathclose{[}$ |

Lo spostamento verticale porta con sé l'asintoto: il grafico di $y = a^x + k$ si avvicina alla retta $y = k$, e non più all'asse $x$.

```ad-example
Esempio 4: un'esponenziale spostata in giù
Disegna il grafico di $y = 2^x - 4$ e trova i punti in cui incontra gli assi.

È il grafico di $y = 2^x$ spostato in giù di $4$. L'asintoto diventa la retta $y = -4$, l'immagine è $\mathopen{]}-4, +\infty\mathclose{[}$ e la funzione resta crescente.

Con l'asse $y$: per $x = 0$ si ha $y = 2^0 - 4 = 1 - 4 = -3$. Il punto è $A(0, -3)$.

Con l'asse $x$: per $y = 0$ si ha

$$
\begin{gathered}
2^x - 4 = 0 \\
\Rightarrow 2^x = 4 \\
\Rightarrow 2^x = 2^2 \\
\Rightarrow x = 2
\end{gathered}
$$

Il punto è $B(2, 0)$. Un altro punto comodo è $C(3, 4)$, perché $2^3 - 4 = 4$.

```tikz
% nome: grafico-esponenziale-traslata-in-giu
% alt: Il grafico di y = 2 alla x meno 4, cioè quello di y = 2 alla x, tratteggiato, spostato in giù di 4: ha per asintoto la retta y = -4 e passa per A (0, -3), B (2, 0) e C (3, 4)
% svg: grafico-esponenziale-traslata-in-giu-ff2ac8c8.svg 187x227
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-5) grid (4,5);
\draw[->] (-4.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-5.3) -- (0,5.6) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,3} \node[below] at (\x,0) {\small $\x$};
\draw[dashed, gray] (-4,-4) -- (4,-4);
\node[gray, below] at (2.8,-4) {$y = -4$};
\draw[thick, dashed, gray, domain=-4:2.3, samples=50, smooth] plot (\x, {exp(0.693147*\x)});
\draw[thick, blue!60, domain=-4:3.15, samples=60, smooth] plot (\x, {exp(0.693147*\x) - 4});
\foreach \x/\y in {0/-3, 2/0, 3/4} \fill (\x,\y) circle (0.13);
\node[right] at (0,-3) {$A$};
\node[above left] at (2,0) {$B$};
\node[right] at (3,4) {$C$};
\node[gray, above] at (-2.6,0.4) {$y = 2^x$};
\end{tikzpicture}
```
```grafico
% nome: esponenziale-traslata-cursori
% alt: Il grafico di y = 2 alla (x - h) più k con i cursori di h e di k, la retta y = k tratteggiata, che è il suo asintoto, e la curva y = 2 alla x tratteggiata per confronto
curva: y=2^{x-h}+k
curva: y=k | tratteggiata | grigio
curva: y=2^x | tratteggiata | grigio
curva: P=\left(h;1+k\right) | nero
cursore: h = 0 da -4 a 4 passo 0,1
cursore: k = -4 da -6 a 6 passo 0,1
finestra: x da -6 a 6, y da -6 a 6
valore: \text{asintoto: } y = k
valore: P = \left(h;1+k\right)
domanda: Alza $k$ da $-4$ fino a $0$ e oltre: per quali valori la curva incontra l'asse $x$? Muovendo solo $h$, l'asintoto si sposta?
```

La curva incontra l'asse $x$ solo quando $k$ è negativo, cioè quando l'asintoto $y = k$ sta sotto l'asse. Per $k = 0$ l'asintoto è l'asse $x$ stesso e la curva gli si avvicina senza toccarlo; per $k > 0$ sta tutta sopra. L'immagine è sempre $\mathopen{]}k, +\infty\mathclose{[}$. Il cursore $h$ sposta la curva a destra o a sinistra insieme al punto $P$, che è il punto $(0, 1)$ di $y = 2^x$ dopo lo spostamento, e non cambia né l'asintoto né l'immagine.
```

```guidato
% nome: esponenziale-decrescente-spostata-in-giu
% titolo: Un'esponenziale decrescente spostata in giù

Disegna il grafico di $y = \left(\dfrac{1}{3}\right)^x - 3$ e trova i punti in cui incontra gli assi.

Parti dal grafico di $y = \left(\dfrac{1}{3}\right)^x$. La base sta tra $0$ e $1$, quindi la curva scende, passa per $(0, 1)$ e andando verso destra si avvicina all'asse $x$. Nella funzione dell'esercizio il $-3$ sta fuori dalla potenza: si somma a ogni valore di $y$, e sposta in verticale tutto il grafico, asintoto compreso.

?? cursore: Nel piano c'è la curva $y = \left(\dfrac{1}{3}\right)^x + k$ con il suo asintoto tratteggiato. Porta il cursore $k$ al valore che dà la funzione dell'esercizio.
```grafico
% nome: esponenziale-decrescente-traslata-cursore
% alt: Il grafico di y = (1/3) alla x più k con il cursore di k, la retta y = k tratteggiata, che è il suo asintoto, e la curva y = (1/3) alla x tratteggiata per confronto
curva: y=\left(\frac{1}{3}\right)^x+k
curva: y=k | tratteggiata | grigio
curva: y=\left(\frac{1}{3}\right)^x | tratteggiata | grigio
cursore: k = 0 da -6 a 6 passo 1
finestra: x da -6 a 6, y da -5 a 7
valore: \text{asintoto: } y = k
```
atteso: k = -3
errore: k = 3 :: Con $k = 3$ la curva sale di $3$ e l'asintoto è la retta $y = 3$. Nella funzione c'è $-3$: a ogni valore si toglie $3$, e il grafico scende.
errore: k = 0 :: Il cursore è ancora a $0$, e la curva è quella di partenza. Spostalo finché la curva è quella dell'esercizio.
aiuto: Guarda la retta tratteggiata, che è l'asintoto $y = k$: nella funzione dell'esercizio sta $3$ unità sotto l'asse $x$.

Con $k = -3$ la curva è quella di $y = \left(\dfrac{1}{3}\right)^x$ spostata in giù di $3$, e l'asintoto è sceso con lei: è la retta $y = -3$. Uno spostamento non cambia l'andamento, quindi la funzione resta decrescente. Cambia invece l'insieme dei valori che assume.

?? scegli: Qual è l'immagine della funzione?
giusta: $\mathopen{]}-3, +\infty\mathclose{[}$
sbagliata: $\mathopen{]}0, +\infty\mathclose{[}$ :: È l'immagine di $y = \left(\dfrac{1}{3}\right)^x$ prima dello spostamento. Togliendo $3$ a ogni valore, anche l'immagine scende di $3$.
sbagliata: $\mathopen{]}-\infty, -3\mathclose{[}$ :: La curva sta sopra l'asintoto, non sotto: $\left(\dfrac{1}{3}\right)^x$ è sempre positivo, quindi $y$ è sempre maggiore di $-3$.
sbagliata: $\mathbb{R}$ :: I valori minori o uguali a $-3$ non vengono mai assunti: la curva si avvicina alla retta $y = -3$ senza toccarla.

Dato che $\left(\dfrac{1}{3}\right)^x > 0$ per ogni $x$, togliendo $3$ si ha $y > -3$: i valori assunti sono tutti e soli quelli maggiori di $-3$.

Restano i punti sugli assi. Un punto sta sull'asse $y$ quando la sua ascissa è $0$.

?? scrivi: Scrivi l'ordinata del punto in cui il grafico incontra l'asse $y$.
numero: -2
errore: -3 :: Hai preso $\left(\dfrac{1}{3}\right)^0 = 0$. Una potenza con esponente $0$ vale $1$, qualunque sia la base.
errore: 1 :: Il valore $\left(\dfrac{1}{3}\right)^0 = 1$ è giusto, ma manca ancora il $-3$ della funzione.
errore: -8/3 :: Hai sostituito $x = 1$. Sull'asse $y$ l'ascissa è $0$.
aiuto: Sostituisci $x = 0$ nella funzione.

Per $x = 0$ si ha $y = \left(\dfrac{1}{3}\right)^0 - 3 = 1 - 3 = -2$. Il punto è $A(0, -2)$.

Un punto sta sull'asse $x$ quando la sua ordinata è $0$:

$$
\begin{gathered}
\left(\frac{1}{3}\right)^x - 3 = 0 \\
\Rightarrow \left(\frac{1}{3}\right)^x = 3
\end{gathered}
$$

Due potenze con la stessa base sono uguali solo se hanno lo stesso esponente: per usare questa regola devi scrivere anche $3$ come potenza di $\dfrac{1}{3}$.

?? scrivi: Scrivi l'ascissa del punto in cui il grafico incontra l'asse $x$.
numero: -1
errore: 1 :: Con $x = 1$ si ottiene $\left(\dfrac{1}{3}\right)^1 = \dfrac{1}{3}$, non $3$. Per passare da $\dfrac{1}{3}$ a $3$ serve il reciproco, cioè un esponente negativo.
errore: 0 :: Con $x = 0$ la potenza vale $1$, non $3$: è il conto del punto sull'asse $y$.
errore: 3 :: Con $x = 3$ si ottiene $\left(\dfrac{1}{3}\right)^3 = \dfrac{1}{27}$. Il $3$ è il valore che la potenza deve raggiungere, non l'esponente.
aiuto: Il reciproco di un numero è la sua potenza con esponente $-1$.

Il reciproco di $\dfrac{1}{3}$ è $3$, cioè $3 = \left(\dfrac{1}{3}\right)^{-1}$:

$$
\begin{gathered}
\left(\frac{1}{3}\right)^x = \left(\frac{1}{3}\right)^{-1} \\
\Rightarrow x = -1
\end{gathered}
$$

Il punto è $B(-1, 0)$. Con una base tra $0$ e $1$ la potenza supera $1$ solo per gli esponenti negativi, e infatti la curva attraversa l'asse $x$ a sinistra dell'origine. Per disegnarla aggiungi un punto ancora più a sinistra, $C(-2, 6)$, perché $\left(\dfrac{1}{3}\right)^{-2} - 3 = 9 - 3 = 6$.

```tikz
% nome: grafico-esponenziale-decrescente-traslata-in-giu
% alt: Il grafico di y = (1/3) alla x meno 3, cioè quello di y = (1/3) alla x, tratteggiato, spostato in giù di 3: scende da sinistra verso destra, ha per asintoto la retta y = -3 e passa per C (-2, 6), B (-1, 0) e A (0, -2)
% svg: grafico-esponenziale-decrescente-traslata-in-giu-25457992.svg 187x246
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-4) grid (4,7);
\draw[->] (-4.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,7.6) node[above] {$y$};
\foreach \x in {-3,-2,1,2,3} \node[below] at (\x,0) {\small $\x$};
\draw[dashed, gray] (-4,-3) -- (4,-3);
\node[gray, below] at (2.8,-3) {$y = -3$};
\draw[thick, dashed, gray, domain=-1.75:4, samples=50, smooth] plot (\x, {exp(-1.098612*\x)});
\draw[thick, blue!60, domain=-2.08:4, samples=60, smooth] plot (\x, {exp(-1.098612*\x) - 3});
\foreach \x/\y in {0/-2, -1/0, -2/6} \fill (\x,\y) circle (0.13);
\node[right] at (0,-2) {$A$};
\node[above right] at (-1,0) {$B$};
\node[left] at (-2,6) {$C$};
\node[gray, above] at (2.6,0.3) {$y = \left(\frac{1}{3}\right)^x$};
\end{tikzpicture}
```
```

## Dominio delle funzioni con l'esponenziale

In $y = a^{f(x)}$, con la base $a$ fissata, la potenza si calcola ogni volta che si può calcolare l'esponente: il dominio è quello di $f(x)$, che trovi con le regole della lezione [Funzioni reali e dominio](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-reali-e-dominio). L'esponenziale da sola non aggiunge condizioni. Le condizioni arrivano quando un'espressione con l'esponenziale sta a denominatore o sotto radice, e quando anche la base contiene la variabile: in $y = f(x)^{g(x)}$ la base deve essere positiva, $f(x) > 0$.

```ad-example
Esempio 5: tre domini
Trova il dominio di $y = 2^{\frac{1}{x}}$, di $y = 3^{\sqrt{x - 1}}$ e di $y = \dfrac{1}{2^x - 8}$.

Nella prima l'esponente $\dfrac{1}{x}$ esiste per $x \neq 0$: il dominio è $\mathbb{R} \setminus \{0\}$.

Nella seconda l'esponente $\sqrt{x - 1}$ esiste per $x - 1 \geq 0$: il dominio è $[1, +\infty\mathclose{[}$.

Nella terza l'esponente $x$ non dà condizioni, ma il denominatore non può valere zero:

$$
\begin{gathered}
2^x - 8 \neq 0 \\
\Rightarrow 2^x \neq 2^3 \\
\Rightarrow x \neq 3
\end{gathered}
$$

Il dominio è $\mathbb{R} \setminus \{3\}$.
```

```ad-note
La variabile anche nella base
La funzione $y = (x - 1)^x$ ha la variabile nella base e nell'esponente. Perché la potenza abbia significato per ogni esponente reale la base deve essere positiva: $x - 1 > 0$, cioè $x > 1$. Il dominio è $\mathopen{]}1, +\infty\mathclose{[}$, anche se per qualche valore isolato fuori dal dominio, come $x = -2$, il conto $(-3)^{-2}$ si saprebbe fare.
```

## Crescita e decadimento esponenziale

Una grandezza che a ogni passo viene moltiplicata per lo stesso numero $a$ segue la legge

$$y = C \cdot a^x$$

dove $C$ è il valore iniziale, quello per $x = 0$. Se $a > 1$ la grandezza cresce, e si parla di **crescita esponenziale**; se $0 < a < 1$ cala, e si parla di **decadimento esponenziale**. Per $x$ intero i valori $C$, $C \cdot a$, $C \cdot a^2$, … sono i termini di una [progressione geometrica](/materiale/scuola-superiore/matematica/successioni-e-progressioni/progressioni-geometriche) di ragione $a$; la funzione esponenziale dà un valore anche tra un passo e l'altro.

Un aumento del $p\%$ a ogni passo vuol dire moltiplicare per $1 + \dfrac{p}{100}$, una diminuzione del $p\%$ vuol dire moltiplicare per $1 - \dfrac{p}{100}$, come nella lezione [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).

```ad-example
Esempio 6: un capitale con l'interesse composto
Depositi $1000$ euro su un conto che rende il $2\%$ all'anno, e ogni anno gli interessi si aggiungono al capitale. Quanto hai dopo $3$ anni? E dopo $10$?

Ogni anno il capitale viene moltiplicato per $1 + \dfrac{2}{100} = 1{,}02$. Dopo $t$ anni vale

$$C(t) = 1000 \cdot 1{,}02^t$$

Dopo $3$ anni:

$$
\begin{aligned}
C(3) &= 1000 \cdot 1{,}02^3 \\
&= 1000 \cdot 1{,}061208 \\
&\approx 1061{,}21
\end{aligned}
$$

Dopo $10$ anni, con la calcolatrice, $C(10) = 1000 \cdot 1{,}02^{10} \approx 1218{,}99$ euro. Gli interessi dei $10$ anni sono circa $219$ euro, più dei $200$ che avresti aggiungendo ogni anno il $2\%$ dei $1000$ euro iniziali: la differenza viene dagli interessi sugli interessi.
```

```ad-example
Esempio 7: un farmaco che si dimezza
La quantità di un farmaco nel sangue si dimezza ogni $4$ ore. Se la dose iniziale è di $200$ mg, quanto farmaco resta dopo $12$ ore? E dopo $2$ ore?

In $t$ ore i dimezzamenti sono $\dfrac{t}{4}$, e ognuno moltiplica la quantità per $\dfrac{1}{2}$:

$$m(t) = 200 \cdot \left(\frac{1}{2}\right)^{\frac{t}{4}}$$

Dopo $12$ ore l'esponente è $3$:

$$m(12) = 200 \cdot \left(\frac{1}{2}\right)^3 = \frac{200}{8} = 25$$

Restano $25$ mg. Dopo $2$ ore l'esponente è $\dfrac{1}{2}$, e la potenza è una radice:

$$
\begin{aligned}
m(2) &= 200 \cdot \left(\frac{1}{2}\right)^{\frac{1}{2}} \\
&= \frac{200}{\sqrt{2}} = 100\sqrt{2} \approx 141{,}4
\end{aligned}
$$

Dopo metà del tempo di dimezzamento non resta il $75\%$ della dose, cioè $150$ mg, ma circa $141$ mg: il calo non è proporzionale al tempo.

```tikz
% nome: decadimento-farmaco-dimezzamento
% alt: Il grafico della quantità di farmaco m in funzione del tempo t, m = 200 per un mezzo alla t quarti: parte da 200 mg e passa per i punti (4, 100), (8, 50) e (12, 25), dimezzandosi ogni 4 ore e avvicinandosi all'asse t
% svg: decadimento-farmaco-dimezzamento-67ae9db3.svg 230x186
\begin{tikzpicture}[xscale=0.28, yscale=0.017]
\draw[->] (0,0) -- (17.5,0) node[right] {$t$};
\draw[->] (0,0) -- (0,235) node[above] {$m$};
\foreach \x in {4,8,12,16} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {25,50,100,200} \node[left] at (0,\y) {\small $\y$};
\foreach \x/\y in {4/100, 8/50, 12/25} \draw[dashed, gray] (\x,0) -- (\x,\y) -- (0,\y);
\draw[thick, blue!60, domain=0:16.5, samples=60, smooth] plot (\x, {200*exp(-0.1732868*\x)});
\foreach \x/\y in {0/200, 4/100, 8/50, 12/25} \fill (\x,\y) ellipse (0.36 and 5.9);
\end{tikzpicture}
```
```grafico
% nome: decadimento-tempo-dimezzamento-cursore
% alt: Il grafico di m = 200 per un mezzo alla t diviso T, con il cursore del tempo di dimezzamento T e la quantità che resta dopo T, dopo 2T e dopo 12 ore
curva: y=200\cdot\left(\frac{1}{2}\right)^{\frac{x}{T}}
curva: A=\left(T;100\right) | nero
curva: B=\left(2T;50\right) | nero
cursore: T = 4 da 1 a 8 passo 0,5
finestra: x da -1 a 17, y da -20 a 220
forma: 3:2
assi: t (h), m (mg)
valore: m(12) = 200\cdot\left(\frac{1}{2}\right)^{\frac{12}{T}}
domanda: Raddoppia $T$ da $4$ a $8$ ore: dopo $12$ ore resta il doppio del farmaco?
```

Con $T = 8$ in $12$ ore c'è un dimezzamento e mezzo, e restano $200 \cdot \left(\dfrac{1}{2}\right)^{\frac{3}{2}} = 50\sqrt{2} \approx 70{,}7$ mg: quasi il triplo dei $25$ mg di prima, non il doppio. Qualunque sia $T$, dopo un tempo $T$ restano $100$ mg e dopo $2T$ ne restano $50$: il punto $A$ e il punto $B$ si spostano in orizzontale e restano alla stessa altezza.
```

```ad-warning
Crescita esponenziale e crescita lineare
Crescere del $2\%$ all'anno per $10$ anni non vuol dire crescere del $20\%$: il fattore è $1{,}02^{10} \approx 1{,}219$, cioè circa il $21{,}9\%$. In una crescita lineare a ogni passo si somma la stessa quantità, in una crescita esponenziale a ogni passo si moltiplica per lo stesso numero.
```

## Il numero e

Torna al capitale, e immagina un conto che rende il $100\%$ all'anno: $1$ euro diventa $2$ euro dopo un anno. Se la banca paga invece il $50\%$ ogni sei mesi, dopo un anno hai $\left(1 + \dfrac{1}{2}\right)^2 = 2{,}25$ euro. Dividendo l'anno in $n$ periodi, con l'interesse $\dfrac{1}{n}$ a ogni periodo, dopo un anno hai

$$\left(1 + \frac{1}{n}\right)^n$$

| Periodi $n$ | $1$ | $2$ | $12$ | $365$ | $1\,000\,000$ |
|---|---|---|---|---|---|
| Capitale dopo un anno | $2$ | $2{,}25$ | $2{,}6130$ | $2{,}7146$ | $2{,}71828$ |

Il capitale cresce con $n$, ma sempre meno, e non supera mai un certo numero, a cui si avvicina quanto vuoi. Quel numero si indica con la lettera $e$ ed è chiamato **numero di Nepero**:

$$e = 2{,}71828\ldots$$

È un numero irrazionale, come $\sqrt{2}$ e $\pi$: le sue cifre decimali non finiscono e non si ripetono. Il fatto che i valori della tabella si avvicinino a un numero preciso si dimostra con i limiti, al quinto anno.

Il numero $e$ compare quando si descrive una grandezza che cresce in modo continuo, istante per istante, e non a scatti: per questo la funzione esponenziale più usata nelle scienze è $y = e^x$. Dato che $2 < e < 3$, la base è maggiore di $1$: la funzione è crescente, e il suo grafico per $x > 0$ sta tra quello di $y = 2^x$ e quello di $y = 3^x$. Sulla calcolatrice trovi il tasto $e^x$.
