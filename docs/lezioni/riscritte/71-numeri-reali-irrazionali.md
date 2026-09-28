# Numeri irrazionali e numeri reali

Con le frazioni si misura quasi tutto: un terzo di torta, $2{,}35$ metri di stoffa, $\dfrac{3}{4}$ di un'ora. Eppure in un quadrato di lato $1$ c'è un segmento, la diagonale, la cui lunghezza non è una frazione. I numeri come questo si chiamano irrazionali e, insieme ai razionali, formano l'insieme dei numeri reali, che riempie tutta la retta dei numeri.

## Un segmento che nessuna frazione misura

Prendi un quadrato di lato $1$ e chiama $d$ la sua diagonale. La diagonale divide il quadrato in due triangoli rettangoli con i cateti lunghi $1$, e per il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide)

$$d^2 = 1^2 + 1^2 = 2$$

```tikz
% nome: diagonale-quadrato-lato-1
% alt: Quadrato con i lati lunghi 1 e la diagonale d, che lo divide in due triangoli rettangoli con i cateti lunghi 1
% svg: diagonale-quadrato-lato-1-2843d844.svg 110x114
\begin{tikzpicture}[scale=2]
\fill[blue!10] (0,0) -- (1,0) -- (1,1) -- cycle;
\draw[thick] (0,0) rectangle (1,1);
\draw[thick, blue!60] (0,0) -- (1,1);
\draw (0.88,0) -- (0.88,0.12) -- (1,0.12);
\node[below] at (0.5,0) {$1$};
\node[right] at (1,0.5) {$1$};
\node[left] at (0,0.5) {$1$};
\node[above] at (0.5,1) {$1$};
\node[above left] at (0.52,0.48) {$d$};
\end{tikzpicture}
```

Il numero positivo che elevato al quadrato dà $2$ si chiama **radice quadrata** di $2$ e si scrive $\sqrt{2}$. Allo stesso modo, per un numero $a \ge 0$, $\sqrt{a}$ è il numero non negativo che elevato al quadrato dà $a$: $\sqrt{9} = 3$ perché $3^2 = 9$, e $\sqrt{0} = 0$. Le radici e le loro proprietà sono nella lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta); qui serve solo questa definizione.

La diagonale misura quindi $d = \sqrt{2}$. Per capire quanto vale si può provare a elevare al quadrato qualche numero decimale:

$$1{,}4^2 = 1{,}96 \qquad 1{,}5^2 = 2{,}25$$

Il quadrato di $1{,}4$ è un po' meno di $2$, quello di $1{,}5$ è già troppo, quindi $\sqrt{2}$ sta tra $1{,}4$ e $1{,}5$. Con i centesimi, $1{,}41^2 = 1{,}9881$ e $1{,}42^2 = 2{,}0164$: $\sqrt{2}$ sta tra $1{,}41$ e $1{,}42$. Si può andare avanti così quanto si vuole, ma non si arriva mai a un decimale il cui quadrato sia esattamente $2$. E non lo si trova nemmeno tra le frazioni.

## √2 non è un numero razionale

La dimostrazione è per assurdo, come nella lezione [Implicazione, condizioni necessarie e sufficienti](/materiale/scuola-superiore/matematica/insiemi-e-logica/implicazione-condizioni-necessarie-e-sufficienti): si suppone il contrario di quello che si vuole dimostrare e si arriva a una contraddizione. Serve un fatto sui numeri pari.

Se il quadrato di un numero naturale $a$ è pari, allora anche $a$ è pari. Lo dimostriamo per contronominale: se $a$ è dispari, si scrive $a = 2k + 1$ con $k$ naturale, e

$$
\begin{aligned}
a^2 &= 4k^2 + 4k + 1 \\
&= 2(2k^2 + 2k) + 1
\end{aligned}
$$

è dispari. Quindi un numero dispari ha il quadrato dispari, e un quadrato pari viene da un numero pari.

Ora supponiamo per assurdo che $\sqrt{2}$ sia razionale. Allora si scrive come frazione $\dfrac{a}{b}$ di due numeri naturali positivi, e possiamo prendere la frazione ridotta ai minimi termini, cioè con $a$ e $b$ senza divisori comuni diversi da $1$. Elevando al quadrato:

$$2 = \dfrac{a^2}{b^2} \quad\Rightarrow\quad a^2 = 2b^2$$

Quindi $a^2$ è pari, e per il fatto di prima anche $a$ è pari: $a = 2k$. Sostituendo,

$$
\begin{gathered}
4k^2 = 2b^2 \\
b^2 = 2k^2
\end{gathered}
$$

Allora anche $b^2$ è pari, e quindi $b$ è pari. Ma se $a$ e $b$ sono tutti e due pari, la frazione $\dfrac{a}{b}$ si semplifica per $2$, e questo contraddice il fatto che era ridotta ai minimi termini. La supposizione è falsa: $\sqrt{2}$ non è un numero razionale.

Con un ragionamento simile si dimostra un fatto più generale: la radice quadrata di un numero naturale è razionale solo se il numero è un **quadrato perfetto**, cioè il quadrato di un naturale ($0$, $1$, $4$, $9$, $16$, $25$, ...). Negli altri casi è irrazionale: $\sqrt{3}$, $\sqrt{5}$, $\sqrt{8}$ e $\sqrt{50}$ non sono frazioni. Per una frazione ridotta ai minimi termini vale la stessa regola sui due termini: la radice è razionale solo se numeratore e denominatore sono tutti e due quadrati perfetti.

```ad-example
Esempio 1: razionale o no
Stabilisci quali di questi numeri sono razionali.

$$
\begin{gathered}
\sqrt{49} \qquad \sqrt{50} \qquad \sqrt{\tfrac{4}{9}} \\
\sqrt{\tfrac{8}{18}} \qquad \sqrt{\tfrac{2}{9}} \qquad \sqrt{0{,}49}
\end{gathered}
$$

- $\sqrt{49} = 7$, razionale (anzi naturale), perché $7^2 = 49$.
- $50$ sta tra i quadrati perfetti $49$ e $64$ senza esserlo: $\sqrt{50}$ è irrazionale.
- $\sqrt{\dfrac{4}{9}} = \dfrac{2}{3}$, razionale, perché $\left(\dfrac{2}{3}\right)^2 = \dfrac{4}{9}$.
- $8$ e $18$ non sono quadrati perfetti, ma la frazione non è ridotta: $\dfrac{8}{18} = \dfrac{4}{9}$, quindi $\sqrt{\dfrac{8}{18}} = \dfrac{2}{3}$ è razionale.
- In $\dfrac{2}{9}$, ridotta, il denominatore è un quadrato perfetto ma il numeratore no: $\sqrt{\dfrac{2}{9}}$ è irrazionale.
- $0{,}49 = \dfrac{49}{100}$, e $49$ e $100$ sono quadrati perfetti: $\sqrt{0{,}49} = 0{,}7$, razionale.
```

```ad-warning
Guardare i termini di una frazione non ridotta
Da $\sqrt{\dfrac{8}{18}}$ non si può concludere "irrazionale" perché $8$ e $18$ non sono quadrati perfetti: prima si riduce la frazione, $\dfrac{8}{18} = \dfrac{4}{9}$, e solo dopo si guardano numeratore e denominatore. È lo stesso errore che si fa con il denominatore delle frazioni che danno un decimale limitato.
```

## Numeri irrazionali

Nella lezione [Numeri decimali e frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/numeri-decimali-e-frazioni) hai visto che ogni frazione dà un numero intero, un decimale limitato o un decimale periodico, e che ognuno di questi si scrive come frazione. Un numero che non è razionale, quindi, non può avere né un numero finito di cifre dopo la virgola né un periodo.

Un **numero irrazionale** è un numero che si scrive come decimale illimitato non periodico: ha infinite cifre dopo la virgola, e nessun gruppo di cifre si ripete sempre uguale da un certo punto in poi.

$$
\begin{gathered}
\sqrt{2} = 1{,}41421356\ldots \\
\sqrt{3} = 1{,}73205080\ldots
\end{gathered}
$$

Il numero irrazionale più famoso è $\pi = 3{,}14159265\ldots$, il rapporto tra la lunghezza di una circonferenza e il suo diametro, che incontri nella lezione [Lunghezza della circonferenza e area del cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/lunghezza-della-circonferenza-e-area-del-cerchio). Che sia irrazionale lo dimostrò Johann Heinrich Lambert nel 1761, con una dimostrazione molto più difficile di quella per $\sqrt{2}$.

Un irrazionale si può anche costruire scegliendo le cifre in modo che non si ripetano mai. Nel numero

$$0{,}1010010001\ldots$$

dopo ogni $1$ c'è uno zero in più che dopo il precedente: nessun gruppo di cifre si ripete sempre uguale, quindi il numero non è periodico ed è irrazionale.

```ad-warning
Scambiare π con 3,14
$3{,}14$ e $\dfrac{22}{7}$ sono numeri razionali vicini a $\pi$, non $\pi$: $3{,}14 = \dfrac{157}{50}$ e $\dfrac{22}{7} = 3{,}\overline{142857}$. Allo stesso modo la calcolatrice che mostra $1{,}414213562$ per $\sqrt{2}$ dà un numero razionale che la approssima, perché dopo l'ultima cifra mostrata le cifre continuano.
```

```ad-warning
Pensare che tante cifre vogliano dire irrazionale
Un decimale con tante cifre diverse può essere periodico con un periodo lungo: $\dfrac{1}{17} = 0{,}\overline{0588235294117647}$ ha un periodo di sedici cifre ed è razionale. Conta solo se le cifre, da un certo punto in poi, si ripetono sempre uguali.
```

```ad-example
Esempio 2: razionale o irrazionale dal decimale
Stabilisci quali di questi numeri sono razionali.

$$
\begin{gathered}
0{,}\overline{27} \qquad 3{,}14 \qquad \pi \\
0{,}272272227\ldots
\end{gathered}
$$

Nell'ultimo numero dopo ogni $7$ c'è un $2$ in più.

- $0{,}\overline{27}$ è periodico, quindi razionale: $0{,}\overline{27} = \dfrac{27}{99} = \dfrac{3}{11}$.
- $3{,}14$ è limitato, quindi razionale: $3{,}14 = \dfrac{314}{100} = \dfrac{157}{50}$.
- $\pi$ è irrazionale.
- In $0{,}272272227\ldots$ i gruppi di $2$ tra un $7$ e l'altro si allungano sempre: nessun blocco si ripete uguale, il decimale è illimitato e non periodico, quindi il numero è irrazionale.
```

## L'insieme dei numeri reali

I numeri razionali e i numeri irrazionali, messi insieme, formano l'insieme dei **numeri reali**, che si indica con $\mathbb{R}$. Ogni numero reale è razionale oppure irrazionale, mai tutte e due le cose: sono i numeri che si scrivono come decimali, limitati, periodici o illimitati non periodici.

Gli irrazionali sono i reali che non sono razionali, cioè l'insieme $\mathbb{R} \setminus \mathbb{Q}$ (la differenza tra insiemi è nella lezione [Differenza e complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare)). Con $\mathbb{R}$ la catena degli insiemi numerici si allunga di un anello:

$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$$

Anche l'ultima inclusione è stretta: $\sqrt{2}$ è reale ma non razionale.

```tikz
% nome: insiemi-numerici-n-z-q-r
% alt: Quattro insiemi uno dentro l'altro: N con 0 e 7 dentro Z, che aggiunge meno 5, dentro Q, che aggiunge un mezzo e meno tre quarti, dentro R, che aggiunge radice di 2, pi greco e meno radice di 3
% svg: insiemi-numerici-n-z-q-r-ee5b947a.svg 301x158
\begin{tikzpicture}[scale=0.7]
\draw[thick] (0,0) ellipse (5.6 and 2.9);
\draw[thick] (-1.2,0) ellipse (4.1 and 2.2);
\draw[thick] (-2.2,0) ellipse (2.8 and 1.55);
\draw[thick] (-3,0) ellipse (1.6 and 0.95);
\node at (4.3,1.6) {$\mathbf{R}$};
\node at (1.7,1.3) {$\mathbf{Q}$};
\node at (-0.2,0.9) {$\mathbf{Z}$};
\node at (-3.3,0.45) {$\mathbf{N}$};
\node at (-3.5,-0.3) {$0$};
\node at (-2.5,-0.3) {$7$};
\node at (-0.6,-0.3) {$-5$};
\node at (1.6,0.3) {$\frac{1}{2}$};
\node at (1.5,-0.9) {$-\frac{3}{4}$};
\node at (4.3,0.4) {$\sqrt{2}$};
\node at (3.9,-0.8) {$\pi$};
\node at (3.3,-1.5) {$-\sqrt{3}$};
\end{tikzpicture}
```

In $\mathbb{R}$ le quattro operazioni si fanno sempre, tranne la divisione per zero, e valgono le stesse proprietà che conosci per i razionali. In più, ogni numero reale positivo o nullo ha la radice quadrata. I numeri negativi invece non ce l'hanno: il quadrato di un numero reale non è mai negativo, quindi nessun numero reale elevato al quadrato dà $-4$.

## La retta reale

Nella lezione [Frazioni e numeri razionali](/materiale/scuola-superiore/matematica/numeri-razionali/frazioni-e-numeri-razionali) ogni frazione ha trovato il suo punto sulla retta dei numeri. I razionali sono tanti (tra due di loro ce n'è sempre un altro) ma non occupano tutti i punti: il punto a distanza $\sqrt{2}$ dallo zero non corrisponde a nessuna frazione. Con gli irrazionali i buchi si chiudono. A ogni numero reale corrisponde un punto della retta, e a ogni punto della retta corrisponde un numero reale: per questo la retta orientata con l'origine e l'unità di misura si chiama **retta reale**.

Il punto $\sqrt{2}$ si trova con riga e compasso.

1. Sul segmento che va da $0$ a $1$ costruisci un quadrato.
2. Traccia la diagonale che parte dallo $0$: è lunga $\sqrt{2}$.
3. Punta il compasso nello $0$, aprilo fino all'altro estremo della diagonale e traccia un arco fino alla retta.

L'arco taglia la retta nel punto $\sqrt{2}$, tra $1$ e $2$. Riportando la stessa apertura a sinistra dello zero si trova $-\sqrt{2}$.

```tikz
% nome: costruzione-radice-2-retta
% alt: Retta dei numeri con un quadrato costruito sul segmento da 0 a 1, la sua diagonale lunga radice di 2 e l'arco di circonferenza con centro in 0 che riporta la diagonale sulla retta nel punto radice di 2, tra 1 e 2
% svg: costruzione-radice-2-retta-31302ecc.svg 231x84
\begin{tikzpicture}[scale=1.5]
\draw[->] (-1.4,0) -- (2.6,0);
\fill[blue!10] (0,0) rectangle (1,1);
\draw (0,0) rectangle (1,1);
\draw[thick, blue!60] (0,0) -- (1,1);
\draw[dashed] (1,1) arc[start angle=45, end angle=0, radius=1.4142];
\foreach \x in {-1,0,1,2} \draw (\x,-0.06) -- (\x,0.06);
\node[below] at (-1,-0.08) {$-1$};
\node[below] at (0,-0.08) {$0$};
\node[below] at (1,-0.08) {$1$};
\node[below] at (2,-0.08) {$2$};
\fill (1.4142,0) circle (0.045);
\node[above right] at (1.40,0.02) {$\sqrt{2}$};
\node[above left] at (0.55,0.45) {$\sqrt{2}$};
\end{tikzpicture}
```

```ad-example
Esempio 3: il punto √5 sulla retta
Costruisci con riga e compasso il punto $\sqrt{5}$ sulla retta reale.

Serve un segmento lungo $\sqrt{5}$. Un triangolo rettangolo con i cateti $2$ e $1$ ha l'ipotenusa $d$ con $d^2 = 2^2 + 1^2 = 5$, quindi $d = \sqrt{5}$. Sul segmento da $0$ a $2$ costruisci un rettangolo alto $1$ e traccia la diagonale che parte dallo $0$; con il compasso puntato in $0$ riporta la diagonale sulla retta. Il punto che trovi è $\sqrt{5}$, tra $2$ e $3$, perché $2^2 = 4 < 5 < 9 = 3^2$.

```tikz
% nome: costruzione-radice-5-retta
% alt: Retta dei numeri con un rettangolo di base da 0 a 2 e altezza 1, la sua diagonale lunga radice di 5 e l'arco con centro in 0 che la riporta sulla retta nel punto radice di 5, tra 2 e 3
% svg: costruzione-radice-5-retta-efef8bec.svg 158x66
\begin{tikzpicture}[scale=1.1]
\draw[->] (-0.4,0) -- (3.3,0);
\fill[blue!10] (0,0) rectangle (2,1);
\draw (0,0) rectangle (2,1);
\draw[thick, blue!60] (0,0) -- (2,1);
\draw[dashed] (2,1) arc[start angle=26.565, end angle=0, radius=2.2361];
\foreach \x in {0,1,2,3} \draw (\x,-0.07) -- (\x,0.07);
\node[below] at (0,-0.09) {$0$};
\node[below] at (1,-0.09) {$1$};
\node[below] at (2,-0.09) {$2$};
\node[below] at (3,-0.09) {$3$};
\fill (2.2361,0) circle (0.055);
\node[above right] at (2.22,0.02) {$\sqrt{5}$};
\node[left] at (0,0.5) {$1$};
\end{tikzpicture}
```
```

## Approssimazioni per difetto e per eccesso

Un numero irrazionale non si può scrivere con tutte le sue cifre, e nei conti pratici (una misura, un prezzo, un disegno) lo si sostituisce con un decimale vicino. Un numero minore di $x$ si chiama **approssimazione per difetto** di $x$, uno maggiore **approssimazione per eccesso**. Di solito si prendono due decimali consecutivi con lo stesso numero di cifre dopo la virgola, uno per difetto e uno per eccesso: si parla di approssimazione al decimo, al centesimo, al millesimo, o anche "a meno di $0{,}1$", "a meno di $0{,}01$".

| Approssimazione | Per difetto | Per eccesso |
|---|---|---|
| all'unità | $1$ | $2$ |
| al decimo | $1{,}4$ | $1{,}5$ |
| al centesimo | $1{,}41$ | $1{,}42$ |
| al millesimo | $1{,}414$ | $1{,}415$ |

La tabella è per $\sqrt{2}$: a ogni riga l'intervallo che contiene $\sqrt{2}$ si restringe di dieci volte. Per $\pi$, al centesimo, si ha $3{,}14 < \pi < 3{,}15$.

Per trovare le approssimazioni di una radice quadrata $\sqrt{n}$ senza calcolatrice si confrontano i quadrati con $n$: tra due numeri positivi è maggiore quello che ha il quadrato maggiore.

1. Trova i due naturali consecutivi i cui quadrati stanno uno sotto e uno sopra $n$.
2. Prova i decimi tra i due, elevandoli al quadrato, finché trovi i due consecutivi con i quadrati da parti opposte rispetto a $n$.
3. Ripeti con i centesimi, e così via.

```ad-example
Esempio 4: √7 al centesimo
Trova le approssimazioni per difetto e per eccesso di $\sqrt{7}$ al centesimo, poi quelle di $-\sqrt{7}$.

Poiché $2^2 = 4$ e $3^2 = 9$, $\sqrt{7}$ sta tra $2$ e $3$. Con i decimi:

$$
\begin{gathered}
2{,}6^2 = 6{,}76 \\
2{,}7^2 = 7{,}29
\end{gathered}
$$

quindi $2{,}6 < \sqrt{7} < 2{,}7$. Con i centesimi:

$$
\begin{gathered}
2{,}64^2 = 6{,}9696 \\
2{,}65^2 = 7{,}0225
\end{gathered}
$$

Il primo quadrato è minore di $7$, il secondo maggiore: $2{,}64 < \sqrt{7} < 2{,}65$. L'approssimazione per difetto al centesimo è $2{,}64$, quella per eccesso $2{,}65$.

Per $-\sqrt{7}$ i ruoli si scambiano, perché cambiando segno cambia il verso delle disuguaglianze:

$$-2{,}65 < -\sqrt{7} < -2{,}64$$

L'approssimazione per difetto è $-2{,}65$, quella per eccesso $-2{,}64$.
```

```ad-warning
Troncare un numero negativo e chiamarlo per difetto
Togliere le cifre dopo il secondo decimale a $-\sqrt{7} = -2{,}6457\ldots$ dà $-2{,}64$, che è maggiore di $-\sqrt{7}$: è l'approssimazione per eccesso. Per i numeri negativi l'approssimazione per difetto è quella con il valore assoluto più grande, $-2{,}65$.
```

## Confronto tra numeri reali

Due numeri reali si confrontano come i decimali: si guardano le cifre da sinistra, e alla prima cifra diversa è maggiore il numero che ha la cifra maggiore (per i negativi vale il contrario, come nella lezione [Numeri interi e valore assoluto](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto)). Con gli irrazionali si usano le approssimazioni: se due numeri hanno approssimazioni al centesimo diverse, sono già in ordine; se coincidono, si passa ai millesimi.

Per due radici quadrate c'è una via più corta. Tra due numeri positivi il maggiore è quello che ha il quadrato maggiore, quindi, se $a$ e $b$ sono positivi,

$$\sqrt{a} < \sqrt{b} \quad \text{se e solo se} \quad a < b$$

Per esempio $\sqrt{10} > 3$, perché $3 = \sqrt{9}$ e $10 > 9$.

```ad-warning
Confrontare i quadrati di numeri negativi
Il confronto con i quadrati vale solo tra numeri positivi: $-3 < 2$, ma $(-3)^2 = 9 > 4 = 2^2$. Per confrontare $-\sqrt{5}$ e $-2$ confronta prima i positivi, $\sqrt{5} > 2$ perché $5 > 4$, e poi cambia il verso: $-\sqrt{5} < -2$.
```

```ad-example
Esempio 5: mettere in ordine
Scrivi in ordine crescente questi numeri.

$$
\begin{gathered}
\sqrt{2} \qquad \tfrac{10}{7} \qquad -\sqrt{3} \\
1{,}4\overline{1} \qquad -1{,}7
\end{gathered}
$$

Si scrivono tutti come decimali, con abbastanza cifre:

$$
\begin{gathered}
\sqrt{2} = 1{,}4142\ldots \\
\tfrac{10}{7} = 1{,}4285\ldots \\
-\sqrt{3} = -1{,}7320\ldots \\
1{,}4\overline{1} = 1{,}4111\ldots
\end{gathered}
$$

I negativi vengono prima. Tra $-\sqrt{3}$ e $-1{,}7$ il minore è $-\sqrt{3}$, perché ha il valore assoluto più grande. Tra i positivi le prime due cifre dopo la virgola sono $41$ per $1{,}4\overline{1}$ e $\sqrt{2}$, $42$ per $\frac{10}{7}$: quindi $\frac{10}{7}$ è il maggiore. Per gli altri due serve la terza cifra, $1$ contro $4$. L'ordine è:

$$
\begin{gathered}
-\sqrt{3} < -1{,}7 < 1{,}4\overline{1} \\
< \sqrt{2} < \tfrac{10}{7}
\end{gathered}
$$
```

```ad-example
Esempio 6: √2 + √3 e π
Stabilisci quale dei due numeri è maggiore, $\sqrt{2} + \sqrt{3}$ o $\pi$.

Le approssimazioni si possono sommare: sommando le due per difetto si ottiene un'approssimazione per difetto della somma, sommando le due per eccesso una per eccesso. Al centesimo:

$$
\begin{gathered}
1{,}41 < \sqrt{2} < 1{,}42 \\
1{,}73 < \sqrt{3} < 1{,}74 \\
3{,}14 < \sqrt{2} + \sqrt{3} < 3{,}16
\end{gathered}
$$

Anche $\pi$ sta tra $3{,}14$ e $3{,}15$: al centesimo i due numeri non si distinguono. Si passa ai millesimi:

$$
\begin{gathered}
1{,}414 < \sqrt{2} < 1{,}415 \\
1{,}732 < \sqrt{3} < 1{,}733 \\
3{,}146 < \sqrt{2} + \sqrt{3}
\end{gathered}
$$

mentre $\pi < 3{,}142$. Quindi $\sqrt{2} + \sqrt{3} > \pi$, anche se di poco.
```

## Operazioni tra razionali e irrazionali

La somma di un numero razionale e di un numero irrazionale è sempre irrazionale. Lo si dimostra per assurdo: se $q$ è razionale, $x$ è irrazionale e $q + x = r$ fosse razionale, allora $x = r - q$ sarebbe la differenza di due razionali, quindi razionale, contro l'ipotesi. Per lo stesso motivo il prodotto di un razionale diverso da zero per un irrazionale è irrazionale: da $q \cdot x = r$ si ricaverebbe $x = \dfrac{r}{q}$. Per esempio $1 + \sqrt{2}$, $3 - \sqrt{5}$, $2\sqrt{3}$ e $\dfrac{\pi}{2}$ sono irrazionali; invece $0 \cdot \sqrt{2} = 0$.

Con due irrazionali non c'è una regola: il risultato può essere razionale o irrazionale.

- $\sqrt{2} \cdot \sqrt{2} = 2$, per la definizione di radice quadrata: il prodotto di due irrazionali è razionale.
- $(1 + \sqrt{2}) + (1 - \sqrt{2}) = 2$: anche una somma di due irrazionali può essere razionale.
- $\sqrt{2} + \sqrt{2} = 2\sqrt{2}$ è irrazionale, perché è il prodotto del razionale $2$ per $\sqrt{2}$.

```ad-warning
Pensare che con due irrazionali il risultato sia irrazionale
Non è vero né per la somma né per il prodotto: $\sqrt{3} + (-\sqrt{3}) = 0$ e $\sqrt{3} \cdot \sqrt{3} = 3$. Le regole sicure sono solo quelle con un razionale: razionale più irrazionale, e razionale diverso da zero per irrazionale, danno un irrazionale.
```

```ad-example
Esempio 7: il risultato è razionale?
Calcola e stabilisci se il risultato è razionale.

1. $(3 - \sqrt{5}) + (\sqrt{5} + 1)$
2. $(2 + \sqrt{3})(2 - \sqrt{3})$
3. $\sqrt{2}\,(\sqrt{2} + 1)$
4. $(1 + \sqrt{2})^2$

Nei conti si usa $\sqrt{a} \cdot \sqrt{a} = a$ e la proprietà distributiva.

1. I due $\sqrt{5}$ si cancellano: $3 - \sqrt{5} + \sqrt{5} + 1 = 4$. Razionale, anche se i due addendi sono irrazionali.
2. Moltiplicando ogni termine per ogni termine:
$$
\begin{aligned}
&4 - 2\sqrt{3} + 2\sqrt{3} - 3 \\
&= 1
\end{aligned}
$$
Razionale. È il prodotto di una somma per una differenza, uno dei [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli): $2^2 - (\sqrt{3})^2 = 4 - 3$.
3. $\sqrt{2} \cdot \sqrt{2} + \sqrt{2} = 2 + \sqrt{2}$. Irrazionale, perché è un razionale più un irrazionale.
4. È il quadrato di un binomio:
$$
\begin{aligned}
&1 + 2\sqrt{2} + 2 \\
&= 3 + 2\sqrt{2}
\end{aligned}
$$
Irrazionale: $2\sqrt{2}$ è irrazionale, e aggiungendo $3$ resta irrazionale.
```

Le regole per fare i conti con le radici, come $\sqrt{2} \cdot \sqrt{3} = \sqrt{6}$ o $\sqrt{8} = 2\sqrt{2}$, sono nella lezione [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali).
