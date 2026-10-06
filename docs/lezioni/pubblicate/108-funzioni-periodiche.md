# Funzioni periodiche

Oggi è lunedì: che giorno sarà tra cento giorni? Non serve contare fino a cento. I giorni della settimana si ripetono ogni $7$, e $100 = 14 \cdot 7 + 2$: dopo quattordici settimane esatte è di nuovo lunedì, e due giorni dopo è mercoledì. Le lancette dell'orologio, le maree, il battito del cuore in un tracciato, la corrente di una presa funzionano allo stesso modo: dopo un certo intervallo tutto ricomincia uguale. Le funzioni che descrivono questi fenomeni si chiamano periodiche, e per conoscerle tutte è sufficiente conoscerle su un intervallo.

Ti servono il grafico e il dominio di una funzione, dalla lezione [Funzioni reali e dominio](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-reali-e-dominio). Le funzioni periodiche più usate, il seno e il coseno, le incontrerai al quarto anno: questa lezione prepara l'idea con funzioni più semplici.

## Che cos'è una funzione periodica

Una funzione $f$ di dominio $D$ è **periodica** se esiste un numero $T > 0$ tale che, per ogni $x$ del dominio, anche $x + T$ e $x - T$ appartengono al dominio e

$$f(x + T) = f(x)$$

In parole: spostandoti di $T$ lungo l'asse $x$, in avanti o indietro, ritrovi lo stesso valore. Il più piccolo numero positivo $T$ per cui questo succede si chiama **periodo** della funzione.

Nella figura, il grafico è un'onda fatta di segmenti, che sale da $0$ a $2$ e ridiscende, sempre uguale. Due punti con ascisse che differiscono di $4$, come $x = 1$ e $x = 5$, sono alla stessa altezza, e lo stesso vale partendo da qualsiasi $x$: il periodo è $T = 4$.

```tikz
% nome: funzione-periodica-onda-triangolare
% alt: Il grafico di una funzione periodica a forma di onda triangolare, che vale 0 in -4, 0, 4, 8 e 2 in -2, 2, 6: i punti di ascissa 1 e 5 sono alla stessa altezza 1, e una doppia freccia tra le due cime in x = 2 e x = 6 indica il periodo T = 4
% svg: funzione-periodica-onda-triangolare-16262daa.svg 306x132
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-5,-1) grid (9,4);
\draw[->] (-5.4,0) -- (9.7,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,4.6) node[above] {$y$};
\foreach \x in {-4,-2,2,4,6,8} \node[below] at (\x,0) {\small $\x$};
\node[above left] at (0,2) {\small $2$};
\draw[thick, blue!60] (-5,1) -- (-4,0) -- (-2,2) -- (0,0) -- (2,2) -- (4,0) -- (6,2) -- (8,0) -- (9,1);
\draw[dashed, gray] (1,1) -- (5,1);
\fill (1,1) circle (0.13);
\fill (5,1) circle (0.13);
\draw[<->, orange!80, thick] (2,3) -- (6,3);
\draw[dashed, gray] (2,2) -- (2,3);
\draw[dashed, gray] (6,2) -- (6,3);
\node[orange!80!black, above] at (4,3) {\small $T = 4$};
\end{tikzpicture}
```
```grafico
% nome: onda-triangolare-traslata-cursore
% alt: L'onda triangolare di periodo 4 e, tratteggiata, la stessa onda spostata di a verso destra, con il cursore di a: le due curve coincidono quando a vale 4, 8, -4, cioè un multiplo del periodo
curva: f(x)=\left|x-4\lfloor\frac{x+2}{4}\rfloor\right|
curva: y=f(x-a) | tratteggiata | rosso
cursore: a = 1 da -8 a 8 passo 0,5
finestra: x da -7 a 7, y da -2 a 4
domanda: La curva tratteggiata è il grafico spostato di $a$. Per quali valori di $a$ torna esattamente su quello di partenza? Qual è il più piccolo valore positivo?
```

Le due curve coincidono per $a = 4$, $8$, $-4$, $-8$: i multipli di $4$. Il più piccolo valore positivo è $4$, il periodo. Coincidono anche per $a = 0$, ma lì il grafico non si è mosso: per questo la definizione chiede $T > 0$.

Il grafico di una funzione periodica si ottiene quindi disegnando un tratto largo $T$ e ricopiandolo uguale, uno di seguito all'altro, verso destra e verso sinistra. Con le parole della lezione [Trasformazioni geometriche](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/trasformazioni-geometriche): una traslazione orizzontale di lunghezza $T$ porta il grafico su sé stesso.

### I multipli del periodo

Se spostarsi di $T$ non cambia il valore, non lo cambia nemmeno spostarsi due volte:

$$
\begin{aligned}
f(x + 2T) &= f\big((x + T) + T\big) \\
&= f(x + T) = f(x)
\end{aligned}
$$

Lo stesso vale all'indietro: applicando la definizione al numero $x - T$ si ha $f\big((x - T) + T\big) = f(x - T)$, cioè $f(x) = f(x - T)$. Ripetendo il ragionamento, per ogni numero intero $k$

$$f(x + kT) = f(x)$$

Per l'onda della figura anche $8$, $12$ e $16$ sono numeri che riportano il grafico su sé stesso. Il periodo, però, è uno solo: il più piccolo, $4$.

```ad-warning
Il periodo è il più piccolo
Se ti chiedono il periodo dell'onda della figura la risposta è $4$, non $8$: con $8$ la proprietà $f(x + 8) = f(x)$ è vera, ma il tratto che si ripete è lungo $4$. Sul grafico il periodo si misura tra due cime consecutive, non tra due cime qualsiasi.
```

```ad-warning
Due punti alla stessa altezza non sono un periodo
Nell'onda della figura $f(1) = f(3) = 1$, ma $2$ non è un periodo: $f(0) = 0$ e $f(0 + 2) = 2$. L'uguaglianza $f(x + T) = f(x)$ deve valere per tutti gli $x$, non per uno solo.
```

## Calcolare i valori con il periodo

Se conosci una funzione periodica su un intervallo lungo $T$, per esempio $[0, T\mathclose{[}$, la conosci dappertutto. Per calcolare $f(x)$ con $x$ fuori dall'intervallo:

1. Togli da $x$, o aggiungi a $x$, il periodo $T$ tante volte quante servono per arrivare a un numero $x_0$ dell'intervallo.
2. Allora $x = x_0 + kT$ con $k$ intero, e $f(x) = f(x_0)$.

Quando $x$ è grande conviene una divisione con resto, come per i giorni della settimana: con $T = 4$ e $x = 2025$ si ha $2025 = 506 \cdot 4 + 1$, quindi $f(2025) = f(1)$.

```ad-example
Esempio 1: il periodo e i valori dal grafico
La funzione $f$ ha il grafico della figura, che prosegue allo stesso modo nei due versi. Trova il periodo e calcola $f(10)$, $f(-4)$ e $f(300)$.

```tikz
% nome: funzione-periodica-dente-asimmetrico
% alt: Il grafico di una funzione periodica fatto di segmenti: parte da 0 in x = 0, sale fino a 2 in x = 1, scende fino a 0 in x = 3, e si ripete uguale ogni 3 unità, con le cime in -5, -2, 1, 4, 7
% svg: funzione-periodica-dente-asimmetrico-9bb6e4cd.svg 338x123
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-6,-1) grid (8,3);
\draw[->] (-6.4,0) -- (8.7,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,3.6) node[above] {$y$};
\foreach \x in {-6,-5,-3,-2,1,3,4,6,7} \node[below] at (\x,0) {\small $\x$};
\node[above left] at (0,2) {\small $2$};
\draw[thick, blue!60] (-6,0) -- (-5,2) -- (-3,0) -- (-2,2) -- (0,0) -- (1,2) -- (3,0) -- (4,2) -- (6,0) -- (7,2) -- (8,1);
\foreach \x in {-5,-2,1,4,7} \fill (\x,2) circle (0.1);
\end{tikzpicture}
```

Le cime consecutive stanno in $x = 1$ e in $x = 4$, e tra una e l'altra il grafico fa un giro completo: il periodo è $T = 3$. Nell'intervallo $[0, 3\mathclose{[}$ il grafico sale da $(0,\ 0)$ a $(1,\ 2)$ e scende verso $(3,\ 0)$ passando per $(2,\ 1)$.

Per $f(10)$ togli $3$ per tre volte: $10 - 9 = 1$, quindi $f(10) = f(1) = 2$.

Per $f(-4)$ aggiungi $3$ per due volte: $-4 + 6 = 2$, quindi $f(-4) = f(2) = 1$.

Per $f(300)$ dividi: $300 = 100 \cdot 3 + 0$, quindi $f(300) = f(0) = 0$.
```

```ad-example
Esempio 2: una formula su un periodo
La funzione $f$ ha periodo $2$ e nell'intervallo $[-1, 1\mathclose{[}$ vale $f(x) = x^2$. Calcola $f(3)$, $f(2{,}5)$, $f(-4{,}5)$ e disegna il grafico.

L'intervallo dove la formula vale è $[-1, 1\mathclose{[}$: ogni $x$ va riportato lì con multipli di $2$.

$$
\begin{gathered}
f(3) = f(3 - 4) = f(-1) = 1 \\
f(2{,}5) = f(2{,}5 - 2) = f(0{,}5) = 0{,}25 \\
f(-4{,}5) = f(-4{,}5 + 4) = f(-0{,}5) = 0{,}25
\end{gathered}
$$

Per $f(3)$ togliere $2$ una volta sola porta a $1$, che non sta nell'intervallo perché l'estremo destro è escluso: serve un altro passo, fino a $-1$.

Il grafico è l'arco della parabola $y = x^2$ tra $-1$ e $1$, ricopiato ogni $2$ unità.

```tikz
% nome: funzione-periodica-archi-di-parabola
% alt: Il grafico di una funzione periodica di periodo 2 formato da archi di parabola uguali: l'arco di y = x al quadrato tra -1 e 1, più marcato, e le sue copie spostate di 2, 4 e -2, che toccano l'asse x in -2, 0, 2, 4 e arrivano a 1 in -3, -1, 1, 3, 5
% svg: funzione-periodica-archi-di-parabola-223334c4.svg 344x107
\begin{tikzpicture}[scale=0.95]
\draw[gray!25, very thin] (-3,0) grid (5,1);
\draw[->] (-3.4,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-0.5) -- (0,1.9) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3,4,5} \node[below] at (\x,0) {\small $\x$};
\node[above left] at (0,1) {\small $1$};
\draw[thick, blue!35, domain=-3:-1, samples=30, smooth] plot (\x, {(\x+2)*(\x+2)});
\draw[very thick, blue!70, domain=-1:1, samples=30, smooth] plot (\x, {\x*\x});
\draw[thick, blue!35, domain=1:3, samples=30, smooth] plot (\x, {(\x-2)*(\x-2)});
\draw[thick, blue!35, domain=3:5, samples=30, smooth] plot (\x, {(\x-4)*(\x-4)});
\end{tikzpicture}
```
```

## La parte frazionaria

Ogni numero reale $x$ sta tra due interi consecutivi. La **parte intera** di $x$, che si scrive $\lfloor x \rfloor$, è il più grande numero intero che non supera $x$: $\lfloor 2{,}7 \rfloor = 2$, $\lfloor 5 \rfloor = 5$. Quello che avanza è la **parte frazionaria**, detta anche mantissa:

$$\operatorname{mant}(x) = x - \lfloor x \rfloor$$

Per esempio $\operatorname{mant}(2{,}7) = 0{,}7$ e $\operatorname{mant}(5) = 0$. La parte frazionaria è sempre compresa tra $0$, incluso, e $1$, escluso.

```ad-warning
La parte intera di un numero negativo
$\lfloor -1{,}3 \rfloor$ è $-2$, non $-1$: il più grande intero che non supera $-1{,}3$ sta alla sua sinistra sulla retta dei numeri. Di conseguenza $\operatorname{mant}(-1{,}3) = -1{,}3 - (-2) = 0{,}7$, non $0{,}3$ e non $-0{,}3$.
```

La funzione $y = \operatorname{mant}(x)$ è periodica di periodo $1$. Aggiungendo $1$ a $x$ la parte intera aumenta di $1$, cioè $\lfloor x + 1 \rfloor = \lfloor x \rfloor + 1$, e allora

$$
\begin{aligned}
\operatorname{mant}(x + 1) &= x + 1 - \lfloor x + 1 \rfloor \\
&= x + 1 - \lfloor x \rfloor - 1 \\
&= \operatorname{mant}(x)
\end{aligned}
$$

Nessun numero $T$ tra $0$ e $1$ funziona: $\operatorname{mant}(0) = 0$, mentre $\operatorname{mant}(0 + T) = T$, che non è zero. Quindi $1$ è proprio il più piccolo, ed è il periodo.

Il grafico è un "dente di sega". Tra $0$ e $1$ la funzione vale $x$; arrivata a $1$ ricade a $0$ e ricomincia. In ogni tratto il punto a sinistra appartiene al grafico (pallino pieno), quello a destra no (pallino vuoto): in $x = 1$ la funzione vale $0$, non $1$.

```tikz
% nome: parte-frazionaria-dente-di-sega
% alt: Il grafico della parte frazionaria di x, a dente di sega: in ogni intervallo tra due interi consecutivi un segmento sale da 0, con il pallino pieno, fino a 1, con il pallino vuoto, e poi ricomincia da 0
% svg: parte-frazionaria-dente-di-sega-96fa2e0e.svg 290x121
\begin{tikzpicture}[scale=1.15]
\draw[->] (-2.5,0) -- (3.7,0) node[right] {$x$};
\draw[->] (0,-0.5) -- (0,1.8) node[above] {$y$};
\foreach \x in {-2,-1,1,2,3} \node[below] at (\x,0) {\small $\x$};
\node[above left] at (-0.05,1.05) {\small $1$};
\draw[dashed, gray] (-2.4,1) -- (3.4,1);
\foreach \k in {-2,-1,0,1,2} {
\draw[thick, blue!60] (\k,0) -- (\k+0.945,0.945);
\draw[thick, blue!60] (\k+1,1) circle (0.07);
\fill[blue!60] (\k,0) circle (0.07);
}
\end{tikzpicture}
```

## Cambiare il periodo

Se $f$ ha periodo $T$ e $k$ è un numero positivo, la funzione $g(x) = f(kx)$ è periodica di periodo

$$\frac{T}{k}$$

Infatti

$$
\begin{aligned}
g\Big(x + \frac{T}{k}\Big) &= f\Big(k\Big(x + \frac{T}{k}\Big)\Big) \\
&= f(kx + T) \\
&= f(kx) = g(x)
\end{aligned}
$$

e un numero più piccolo di $\dfrac{T}{k}$ non può funzionare: se $g(x + S) = g(x)$ per ogni $x$, allora $f(kx + kS) = f(kx)$, cioè $kS$ riporta $f$ su sé stessa, e deve essere almeno $T$. Con $k > 1$ il periodo si accorcia e l'onda si ripete più fitta; con $0 < k < 1$ si allunga. Nella figura l'onda di periodo $4$ vista sopra e, in arancione, $y = f(2x)$, che ha periodo $2$.

```tikz
% nome: periodo-di-f-di-2x
% alt: Due onde triangolari della stessa altezza 2: quella blu, y = f(x), ha periodo 4 e le cime in -2, 2 e 6; quella arancione, y = f(2x), ha periodo 2 e le cime in -3, -1, 1, 3, 5, 7, cioè si ripete il doppio delle volte
% svg: periodo-di-f-di-2x-81c286ad.svg 273x117
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-1) grid (8,3);
\draw[->] (-4.4,0) -- (8.7,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,3.8) node[above] {$y$};
\foreach \x in {-4,-2,2,4,6,8} \node[below] at (\x,0) {\small $\x$};
\node[above left] at (0,2) {\small $2$};
\draw[thick, blue!60] (-4,0) -- (-2,2) -- (0,0) -- (2,2) -- (4,0) -- (6,2) -- (8,0);
\draw[thick, orange!80] (-4,0) -- (-3,2) -- (-2,0) -- (-1,2) -- (0,0) -- (1,2) -- (2,0) -- (3,2) -- (4,0) -- (5,2) -- (6,0) -- (7,2) -- (8,0);
\node[blue!60!black, above] at (6,2) {\small $f(x)$};
\node[orange!80!black, above] at (3,2) {\small $f(2x)$};
\end{tikzpicture}
```
```grafico
% nome: onda-triangolare-periodo-cursore
% alt: L'onda triangolare y = f(kx) con il cursore di k, da 0,5 a 4, e l'onda di partenza y = f(x) tratteggiata: sotto il piano è scritto il periodo, 4 diviso k, che diminuisce quando k aumenta
curva: f(x)=\left|x-4\lfloor\frac{x+2}{4}\rfloor\right| | tratteggiata | grigio
curva: y=f(kx)
cursore: k = 2 da 0,5 a 4 passo 0,5
finestra: x da -7 a 7, y da -2 a 4
valore: T = \frac{4}{k}
domanda: Con $k = 2$ il periodo è $2$. Quale $k$ serve per avere periodo $1$? E per avere periodo $8$?
```

Il periodo è $\dfrac{4}{k}$: per avere periodo $1$ serve $k = 4$, per avere periodo $8$ serve $k = \dfrac{1}{2}$, che allarga l'onda.

```ad-warning
Moltiplicare la x per k divide il periodo
Se $f$ ha periodo $6$, la funzione $f(3x)$ ha periodo $\dfrac{6}{3} = 2$, non $18$. La $x$ corre tre volte più in fretta, e il giro si chiude in un terzo dello spazio.
```

Altre operazioni non toccano il periodo. Se $f$ ha periodo $T$, hanno periodo $T$ anche $f(x) + c$, che sposta il grafico in verticale, $c \cdot f(x)$ con $c \neq 0$, che ne cambia l'altezza, e $f(x - a)$, che lo sposta in orizzontale: sono le operazioni della lezione [Trasformazioni dei grafici](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/trasformazioni-dei-grafici). Nella figura l'onda di periodo $4$ e, in arancione, $y = 2f(x) - 1$: le cime sono più alte, ma stanno nelle stesse ascisse.

```tikz
% nome: periodo-di-2f-meno-1
% alt: Due onde triangolari con le cime nelle stesse ascisse, -2, 2 e 6: quella blu, y = f(x), va da 0 a 2; quella arancione, y = 2 f(x) meno 1, va da -1 a 3; tutte e due si ripetono ogni 4 unità
% svg: periodo-di-2f-meno-1-97cb697d.svg 293x155
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-2) grid (8,4);
\draw[->] (-4.4,0) -- (8.7,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,4.8) node[above] {$y$};
\foreach \x in {-4,-2,2,4,6,8} \node[below] at (\x,-1) {\small $\x$};
\draw[thick, blue!60] (-4,0) -- (-2,2) -- (0,0) -- (2,2) -- (4,0) -- (6,2) -- (8,0);
\draw[thick, orange!80] (-4,-1) -- (-2,3) -- (0,-1) -- (2,3) -- (4,-1) -- (6,3) -- (8,-1);
\draw[dashed, gray] (2,-1) -- (2,3);
\draw[dashed, gray] (6,-1) -- (6,3);
\node[blue!60!black, left] at (-4,0.4) {\small $f(x)$};
\node[orange!80!black, above] at (4,3) {\small $2f(x) - 1$};
\end{tikzpicture}
```
```grafico
% nome: onda-triangolare-altezza-cursori
% alt: L'onda triangolare y = c per f(x) più d con i cursori di c e di d, e l'onda di partenza tratteggiata: le cime si alzano, si abbassano o si rovesciano, ma restano a distanza 4 l'una dall'altra; con c uguale a zero resta una retta orizzontale
curva: f(x)=\left|x-4\lfloor\frac{x+2}{4}\rfloor\right| | tratteggiata | grigio
curva: y=c\cdot f(x)+d
cursore: c = 2 da -2 a 2 passo 0,5
cursore: d = -1 da -2 a 2 passo 0,5
finestra: x da -7 a 7, y da -7 a 7
domanda: Muovi $c$ e $d$: la distanza tra due cime consecutive cambia? Che cosa resta dell'onda per $c = 0$?
```

Le cime si alzano, si abbassano o si rovesciano (con $c < 0$), ma restano sempre a distanza $4$: il periodo non cambia. Solo per $c = 0$ l'onda sparisce e resta la retta orizzontale $y = d$: una funzione costante, che è periodica ma non ha un periodo, come dice la nota in fondo alla lezione.

```ad-example
Esempio 3: il periodo dopo un cambio di scala
La funzione $f$ ha periodo $6$. Trova il periodo di $g(x) = f(3x)$, di $h(x) = f\Big(\dfrac{x}{2}\Big)$ e di $p(x) = 5 f(x) - 1$.

Per $g$ è $k = 3$: il periodo è $\dfrac{6}{3} = 2$.

Per $h$ è $k = \dfrac{1}{2}$: il periodo è $6 : \dfrac{1}{2} = 12$.

In $p$ la variabile non è moltiplicata per niente: moltiplicare i valori per $5$ e togliere $1$ non cambia il periodo, che resta $6$.
```

## Zeri e funzioni che non sono periodiche

In una funzione periodica tutto si ripete, compresi gli zeri: se $f(x_0) = 0$, allora $f(x_0 + kT) = 0$ per ogni intero $k$. Una funzione periodica definita su tutto $\mathbb{R}$, se ha uno zero, ne ha infiniti.

```ad-example
Esempio 4: tutti gli zeri
Una funzione $f$ ha periodo $5$ e nell'intervallo $[0, 5\mathclose{[}$ si annulla solo per $x = 2$. Quali sono i suoi zeri compresi tra $10$ e $20$?

Gli zeri sono i numeri $2 + 5k$ con $k$ intero: $\dots,\ -3,\ 2,\ 7,\ 12,\ 17,\ 22,\ \dots$ Tra $10$ e $20$ ci sono $12$ e $17$.
```

Per dimostrare che una funzione non è periodica si mostra che nessun $T > 0$ può andare bene.

```ad-example
Esempio 5: la parabola non è periodica
Dimostra che $f(x) = x^2$ non è periodica.

Se esistesse un periodo $T > 0$, l'uguaglianza $f(x + T) = f(x)$ varrebbe per ogni $x$, in particolare per $x = 0$:

$$f(0 + T) = f(0) \quad \Rightarrow \quad T^2 = 0$$

cioè $T = 0$, che non è un numero positivo. Nessun $T$ va bene: la funzione non è periodica.
```

Lo stesso ragionamento esclude tutte le funzioni crescenti o decrescenti: se $f$ è crescente, da $x < x + T$ segue $f(x) < f(x + T)$, e i due valori non possono essere uguali. Una retta non orizzontale, $y = x^3$, $y = \sqrt{x}$ non sono periodiche (le funzioni monotone sono nella lezione [Funzioni crescenti e decrescenti](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-crescenti-e-decrescenti)).

```ad-note
La funzione costante
Per $y = 3$ l'uguaglianza $f(x + T) = f(x)$ vale con qualsiasi $T$. È una funzione periodica senza periodo: tra i numeri positivi che vanno bene non ce n'è uno più piccolo di tutti gli altri.
```

```ad-note
Seno e coseno
Nei triangoli rettangoli hai definito seno e coseno per gli angoli acuti. Al quarto anno le due funzioni si estendono a tutti gli angoli, anche maggiori di un giro: un angolo e lo stesso angolo aumentato di $360^\circ$ individuano la stessa direzione, e per questo seno e coseno risultano periodiche, con periodo un angolo giro. I loro grafici sono onde arrotondate, e tutto quello che hai visto qui (il periodo, i multipli, $f(kx)$ che lo divide per $k$) vale anche per loro.
```
