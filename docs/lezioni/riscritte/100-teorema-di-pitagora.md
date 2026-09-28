# Teoremi di Pitagora e di Euclide

Una corda chiusa, divisa da nodi in dodici tratti uguali e tesa a formare un triangolo con i lati di $3$, $4$ e $5$ tratti, dà un angolo retto preciso: è un modo per squadrare un'aiuola o le fondamenta di un muro senza la squadra. Il perché è il teorema di Pitagora, che lega i tre lati di ogni triangolo rettangolo e permette di calcolarne uno quando si conoscono gli altri due. Qui lo ricaviamo dal primo teorema di Euclide, insieme al secondo, che riguarda l'altezza relativa all'ipotenusa.

I teoremi parlano di quadrati e rettangoli equivalenti, come nella lezione [Equivalenza e aree](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/equivalenza-e-aree); nelle misure compaiono radici quadrate, che si semplificano come nella lezione [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali).

## Il triangolo rettangolo

In un triangolo rettangolo i due lati che formano l'angolo retto si chiamano **cateti**, il lato opposto all'angolo retto si chiama **ipotenusa**. In questa lezione il triangolo è $ABC$, rettangolo in $C$: i cateti sono $AC$ e $BC$, l'ipotenusa è $AB$. Le misure si indicano con la lettera minuscola del vertice opposto: $a = \overline{BC}$, $b = \overline{AC}$, $c = \overline{AB}$.

```tikz
% nome: triangolo-rettangolo-proiezioni
% alt: Il triangolo ABC rettangolo in C con i cateti AC e BC, l'ipotenusa AB e l'altezza CH relativa all'ipotenusa; AH e HB sono le proiezioni dei cateti sull'ipotenusa
% svg: triangolo-rettangolo-proiezioni-12bceee0.svg 222x126
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4.75,0) -- (1.71,2.28) -- cycle;
\draw[thick] (0,0) -- (4.75,0) -- (1.71,2.28) -- cycle;
\draw[dashed] (1.71,2.28) -- (1.71,0);
\draw[thin] (1.59,2.12) -- (1.75,2) -- (1.87,2.16);
\draw[thin] (1.87,0) -- (1.87,0.16) -- (1.71,0.16);
\node[below left] at (0,0) {$A$};
\node[below right] at (4.75,0) {$B$};
\node[above] at (1.71,2.28) {$C$};
\node[below] at (1.71,0) {$H$};
\node[above left] at (0.85,1.14) {\small $b$};
\node[above right] at (3.23,1.14) {\small $a$};
\node[below] at (3.27,0) {\small $c$};
\node[right] at (1.71,1.14) {\small $h$};
\end{tikzpicture}
```

L'altezza $CH$ relativa all'ipotenusa divide l'ipotenusa in due parti. Il segmento $AH$ è la **proiezione** del cateto $AC$ sull'ipotenusa, e $HB$ è la proiezione del cateto $BC$: sono le "ombre" dei due cateti sull'ipotenusa. Le due proiezioni insieme formano l'ipotenusa, $\overline{AH} + \overline{HB} = \overline{AB}$.

## Primo teorema di Euclide

In un triangolo rettangolo il quadrato costruito su un cateto è equivalente al rettangolo che ha per lati l'ipotenusa e la proiezione di quel cateto sull'ipotenusa.

Ipotesi: $ABC$ è rettangolo in $C$, $CH$ è l'altezza relativa all'ipotenusa, $ACDE$ è il quadrato costruito sul cateto $AC$, $AHKF$ è il rettangolo con $AF \perp AB$ e $AF \cong AB$.

Tesi: $ACDE \doteq AHKF$.

```tikz
% nome: euclide-quadrato-parallelogramma
% alt: Il triangolo ABC rettangolo in C, il quadrato ACDE costruito sul cateto AC e il parallelogramma ACGL, in arancione, che ha la stessa base AC e il lato opposto LG sulla retta DE: il quadrato e il parallelogramma sono equivalenti; sotto l'ipotenusa c'è il rettangolo AHKF
% svg: euclide-quadrato-parallelogramma-c99e28ea.svg 217x331
\begin{tikzpicture}
\fill[blue!15] (0,0) -- (1.12,1.49) -- (-0.37,2.6) -- (-1.49,1.12) -- cycle;
\fill[orange!25] (0,0) -- (1.12,1.49) -- (1.12,4.59) -- (0,3.1) -- cycle;
\draw[thick] (0,0) -- (1.12,1.49) -- (-0.37,2.6) -- (-1.49,1.12) -- cycle;
\draw[thick, orange!70!black] (0,0) -- (1.12,1.49) -- (1.12,4.59) -- (0,3.1) -- cycle;
\draw[gray, dashed] (-1.49,1.12) -- (1.12,4.59);
\fill[blue!4] (0,0) -- (3.1,0) -- (1.12,1.49) -- cycle;
\draw[thick] (0,0) -- (3.1,0) -- (1.12,1.49) -- cycle;
\draw[thin] (0,0) -- (1.12,0) -- (1.12,-3.1) -- (0,-3.1) -- cycle;
\draw[gray, dashed] (0,-3.1) -- (0,3.1);
\draw[gray, dashed] (1.12,-3.1) -- (1.12,4.59);
\draw[thin] (1.01,1.34) -- (1.15,1.24) -- (1.26,1.38);
\draw[thin] (-1.36,1.02) -- (-1.26,1.15) -- (-1.39,1.24);
\draw (-0.81,0.47) -- (-0.68,0.65);
\draw (0.47,0.81) -- (0.65,0.68);
\node[below left] at (0,0) {$A$};
\node[below right] at (3.1,0) {$B$};
\node[right] at (1.12,1.49) {$C$};
\node[above left] at (-0.37,2.6) {$D$};
\node[left] at (-1.49,1.12) {$E$};
\node[below left] at (0,-3.1) {$F$};
\node[below right] at (1.12,0) {$H$};
\node[below right] at (1.12,-3.1) {$K$};
\node[above left] at (0,3.1) {$L$};
\node[above right] at (1.12,4.59) {$G$};
\end{tikzpicture}
```

Dimostrazione.

1. Prolunga il lato $FA$ oltre $A$ fino alla retta $DE$, e chiama $L$ il punto in cui la incontra. Nei triangoli $ALE$ e $ABC$ si ha $AE \cong AC$, perché sono lati del quadrato, e gli angoli in $E$ e in $C$ sono retti.
2. $\widehat{LAE} \cong \widehat{BAC}$, perché sono complementari dello stesso angolo $\widehat{CAL}$: $\widehat{CAE}$ è retto (angolo del quadrato), e anche $\widehat{BAL}$ è retto, perché $FL \perp AB$.
3. Per il secondo criterio, con i lati $AE \cong AC$ e i due angoli adiacenti, $ALE \cong ABC$. In particolare $AL \cong AB$, perché sono opposti agli angoli retti, e quindi $AL \cong AF$.
4. La retta $CH$ incontra la retta $DE$ nel punto $G$. Il quadrilatero $ACGL$ ha $AL \parallel CG$ (sono perpendicolari ad $AB$) e $AC \parallel LG$ ($LG$ sta sulla retta $DE$, parallela ad $AC$ perché sono lati opposti del quadrato): è un parallelogramma. Il quadrato $ACDE$ e il parallelogramma $ACGL$ hanno la base $AC$ in comune e la stessa altezza, perché i lati opposti $DE$ e $LG$ stanno sulla stessa retta: sono equivalenti.

```tikz
% nome: euclide-parallelogramma-rettangolo
% alt: Lo stesso disegno: il parallelogramma ACGL, in arancione, e il rettangolo AHKF, in azzurro, hanno le basi AL e AF congruenti sulla stessa retta e i lati opposti sulla retta CK: sono equivalenti
% svg: euclide-parallelogramma-rettangolo-4730141a.svg 217x331
\begin{tikzpicture}
\fill[blue!15] (0,0) -- (1.12,0) -- (1.12,-3.1) -- (0,-3.1) -- cycle;
\fill[orange!25] (0,0) -- (1.12,1.49) -- (1.12,4.59) -- (0,3.1) -- cycle;
\draw[thick] (0,0) -- (1.12,0) -- (1.12,-3.1) -- (0,-3.1) -- cycle;
\draw[thick, orange!70!black] (0,0) -- (1.12,1.49) -- (1.12,4.59) -- (0,3.1) -- cycle;
\fill[blue!4] (0,0) -- (3.1,0) -- (1.12,1.49) -- cycle;
\draw[thick] (0,0) -- (3.1,0) -- (1.12,1.49) -- cycle;
\draw[thin] (0,0) -- (1.12,1.49) -- (-0.37,2.6) -- (-1.49,1.12) -- cycle;
\draw[gray, dashed] (0,-3.1) -- (0,3.1);
\draw[gray, dashed] (1.12,-3.1) -- (1.12,4.59);
\draw[thin] (1.01,1.34) -- (1.15,1.24) -- (1.26,1.38);
\draw[thin] (0.16,0) -- (0.16,-0.16) -- (0,-0.16);
\draw (0.11,-1.52) -- (-0.11,-1.52);
\draw (0.11,-1.58) -- (-0.11,-1.58);
\draw (-0.11,1.51) -- (0.11,1.51);
\draw (-0.11,1.58) -- (0.11,1.58);
\node[below left] at (0,0) {$A$};
\node[below right] at (3.1,0) {$B$};
\node[right] at (1.12,1.49) {$C$};
\node[above left] at (-0.37,2.6) {$D$};
\node[left] at (-1.49,1.12) {$E$};
\node[below left] at (0,-3.1) {$F$};
\node[below right] at (1.12,0) {$H$};
\node[below right] at (1.12,-3.1) {$K$};
\node[above left] at (0,3.1) {$L$};
\node[above right] at (1.12,4.59) {$G$};
\end{tikzpicture}
```

5. Ora prendi come base del parallelogramma $ACGL$ il lato $AL$. Il parallelogramma e il rettangolo $AHKF$ hanno le basi $AL$ e $AF$ congruenti (passo 3) sulla stessa retta, e i lati opposti $CG$ e $HK$ sulla retta $CK$, parallela a quella: hanno la stessa altezza $AH$, quindi sono equivalenti.
6. Per la proprietà transitiva, $ACDE \doteq ACGL \doteq AHKF$.

I passi 4 e 5 sono due movimenti che non cambiano l'area: il quadrato scorre fino al parallelogramma, e il parallelogramma scorre fino al rettangolo. Guardali uno alla volta, e sposta $C$ sulla semicirconferenza per cambiare il triangolo.

```interattivo
% nome: euclide-primo-teorema
% alt: Il triangolo ABC rettangolo in C con il quadrato ACDE e il rettangolo AHKF. Un bottone fa i due passi della dimostrazione: il quadrato, in arancione, scorre con il lato ED sulla retta DE fino al parallelogramma ACGL, poi il parallelogramma scorre con la base sulla retta FL e il lato opposto sulla retta CK fino al rettangolo AHKF. Il punto C si trascina sulla semicirconferenza di diametro AB, e sotto la figura si leggono il quadrato di AC e il prodotto di AB per AH, sempre uguali
```

Allo stesso modo il quadrato costruito sul cateto $BC$ è equivalente al rettangolo che ha per lati l'ipotenusa e la proiezione $HB$.

Con le misure il teorema dice che il quadrato di un cateto è uguale al prodotto dell'ipotenusa per la proiezione di quel cateto:

$$
\begin{gathered}
\overline{AC}^{\,2} = \overline{AB} \cdot \overline{AH} \\
\overline{BC}^{\,2} = \overline{AB} \cdot \overline{HB}
\end{gathered}
$$

```ad-example
Esempio 1: i cateti dalle proiezioni
Nel triangolo $ABC$, rettangolo in $C$, l'ipotenusa $AB$ misura $25$ cm e la proiezione $AH$ del cateto $AC$ misura $9$ cm. Trova i due cateti.

```tikz
% nome: euclide-esempio-numeri
% alt: Il triangolo ABC rettangolo in C con l'ipotenusa AB di 25, la proiezione AH di 9, i cateti AC di 15 e BC di 20 e l'altezza CH di 12
% svg: euclide-esempio-numeri-b0157075.svg 222x139
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4.75,0) -- (1.71,2.28) -- cycle;
\draw[thick] (0,0) -- (4.75,0) -- (1.71,2.28) -- cycle;
\draw[dashed] (1.71,2.28) -- (1.71,0);
\draw[thin] (1.59,2.12) -- (1.75,2) -- (1.87,2.16);
\draw[thin] (1.87,0) -- (1.87,0.16) -- (1.71,0.16);
\node[below left] at (0,0) {$A$};
\node[below right] at (4.75,0) {$B$};
\node[above] at (1.71,2.28) {$C$};
\node[below] at (1.71,0) {$H$};
\node[below] at (0.85,0) {\small $9$};
\node[below] at (3.23,-0.4) {\small $25$};
\draw[<->, thin] (0,-0.5) -- (4.75,-0.5);
\node[above left] at (0.85,1.14) {\small $15$};
\node[above right] at (3.23,1.14) {\small $20$};
\node[right] at (1.71,1.14) {\small $12$};
\end{tikzpicture}
```

Per il primo teorema di Euclide

$$\overline{AC}^{\,2} = 25 \cdot 9 = 225$$

quindi $\overline{AC} = \sqrt{225} = 15$ cm. L'altra proiezione è $\overline{HB} = 25 - 9 = 16$ cm, e

$$\overline{BC}^{\,2} = 25 \cdot 16 = 400$$

quindi $\overline{BC} = 20$ cm.
```

```ad-warning
La proiezione giusta
Nel primo teorema ogni cateto va con la sua proiezione, quella che sta dalla sua parte: $AC$ con $AH$, $BC$ con $HB$. Con $\overline{AC}^{\,2} = 25 \cdot 16$ nell'esempio 1 si troverebbe $20$, che è l'altro cateto.
```

Il primo teorema serve anche all'indietro: dati un cateto e l'ipotenusa si trova la proiezione. Con $\overline{AC} = 15$ e $\overline{AB} = 25$ si ha $\overline{AH} = \dfrac{225}{25} = 9$.

## Teorema di Pitagora

In un triangolo rettangolo il quadrato costruito sull'ipotenusa è equivalente alla somma dei quadrati costruiti sui cateti.

```tikz
% nome: pitagora-quadrati
% alt: Il triangolo ABC rettangolo in C con i quadrati costruiti sui tre lati: il quadrato sull'ipotenusa AB è diviso dal prolungamento dell'altezza CH in due rettangoli, uno equivalente al quadrato su AC e l'altro al quadrato su BC, con gli stessi colori
% svg: pitagora-quadrati-e766240b.svg 190x205
\begin{tikzpicture}
\fill[blue!20] (0,0) -- (0.9,1.2) -- (-0.3,2.1) -- (-1.2,0.9) -- cycle;
\draw[thick] (0,0) -- (0.9,1.2) -- (-0.3,2.1) -- (-1.2,0.9) -- cycle;
\fill[orange!25] (0.9,1.2) -- (2.5,0) -- (3.7,1.6) -- (2.1,2.8) -- cycle;
\draw[thick] (0.9,1.2) -- (2.5,0) -- (3.7,1.6) -- (2.1,2.8) -- cycle;
\fill[blue!20] (0,0) -- (0.9,0) -- (0.9,-2.5) -- (0,-2.5) -- cycle;
\fill[orange!25] (0.9,0) -- (2.5,0) -- (2.5,-2.5) -- (0.9,-2.5) -- cycle;
\draw[thick] (0,0) -- (2.5,0) -- (2.5,-2.5) -- (0,-2.5) -- cycle;
\draw[dashed] (0.9,1.2) -- (0.9,-2.5);
\draw[thick] (0,0) -- (2.5,0) -- (0.9,1.2) -- cycle;
\draw[thin] (0.8,1.07) -- (0.93,0.98) -- (1.03,1.1);
\node[left] at (0,0) {$A$};
\node[right] at (2.5,0) {$B$};
\node[above] at (0.9,1.2) {$C$};
\node[above right] at (0.9,0) {\small $H$};
\node at (-0.15,1.05) {\small $b^2$};
\node at (2.3,1.4) {\small $a^2$};
\node[below] at (1.25,-1.25) {\small $c^2$};
\end{tikzpicture}
```

Il teorema viene subito dal primo teorema di Euclide. Il prolungamento dell'altezza $CH$ divide il quadrato costruito sull'ipotenusa in due rettangoli: uno ha per lati l'ipotenusa e la proiezione $AH$, l'altro l'ipotenusa e la proiezione $HB$. Per il primo teorema di Euclide il primo è equivalente al quadrato costruito su $AC$ e il secondo al quadrato costruito su $BC$. Il quadrato sull'ipotenusa è la somma dei due rettangoli, quindi è equivalente alla somma dei due quadrati.

I triangoli rettangoli con l'ipotenusa $AB$ hanno il vertice $C$ sulla semicirconferenza di diametro $AB$. Trascina $C$: i quadrati sui cateti cambiano, ma la loro somma resta il quadrato sull'ipotenusa.

```interattivo
% nome: pitagora-quadrati-mobili
% alt: Il triangolo ABC rettangolo in C con i quadrati sui tre lati; il quadrato sull'ipotenusa è diviso dal prolungamento dell'altezza CH in due rettangoli con i colori dei quadrati sui cateti. Il punto C si trascina sulla semicirconferenza di diametro AB, e sotto la figura si leggono le aree dei quadrati sui cateti, la loro somma e l'area del quadrato sull'ipotenusa, sempre 100 con l'ipotenusa lunga 10
```

Con le misure, sommando le due uguaglianze del primo teorema di Euclide:

$$
\begin{aligned}
&\overline{AC}^{\,2} + \overline{BC}^{\,2} \\
&= \overline{AB} \cdot \overline{AH} + \overline{AB} \cdot \overline{HB} \\
&= \overline{AB} \cdot (\overline{AH} + \overline{HB}) \\
&= \overline{AB}^{\,2}
\end{aligned}
$$

Con le lettere dei lati il **teorema di Pitagora** si scrive

$$c^2 = a^2 + b^2$$

Il quadrato dell'ipotenusa è la somma dei quadrati dei cateti. Estraendo la radice, e prendendo solo il risultato positivo perché è una lunghezza, si ottengono l'ipotenusa dai cateti e un cateto dall'ipotenusa e dall'altro cateto:

$$
\begin{gathered}
c = \sqrt{a^2 + b^2} \\
a = \sqrt{c^2 - b^2} \qquad b = \sqrt{c^2 - a^2}
\end{gathered}
$$

```ad-example
Esempio 2: l'ipotenusa e un cateto
Un triangolo rettangolo ha i cateti di $8$ cm e $6$ cm: quanto misura l'ipotenusa? Un altro ha l'ipotenusa di $13$ cm e un cateto di $5$ cm: quanto misura l'altro cateto?

```tikz
% nome: pitagora-esempi-ipotenusa-cateto
% alt: Due triangoli rettangoli: a sinistra i cateti misurano 8 e 6 e l'ipotenusa x è da trovare; a destra l'ipotenusa misura 13, un cateto 5 e l'altro cateto x è da trovare
% svg: pitagora-esempi-ipotenusa-cateto-5e83c9e2.svg 205x157
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.4,0) -- (2.4,1.8) -- cycle;
\draw[thick] (0,0) -- (2.4,0) -- (2.4,1.8) -- cycle;
\draw[thin] (2.25,0) -- (2.25,0.15) -- (2.4,0.15);
\node[below] at (1.2,0) {\small $8$};
\node[right] at (2.4,0.9) {\small $6$};
\node[above left] at (1.2,0.9) {\small $x$};
\fill[orange!20] (3.4,0) -- (4.9,0) -- (4.9,3.6) -- cycle;
\draw[thick] (3.4,0) -- (4.9,0) -- (4.9,3.6) -- cycle;
\draw[thin] (4.75,0) -- (4.75,0.15) -- (4.9,0.15);
\node[below] at (4.15,0) {\small $5$};
\node[right] at (4.9,1.8) {\small $x$};
\node[above left] at (4.15,1.8) {\small $13$};
\end{tikzpicture}
```

Nel primo triangolo si sommano i quadrati dei cateti:

$$
\begin{aligned}
x &= \sqrt{8^2 + 6^2} = \sqrt{64 + 36} \\
&= \sqrt{100} = 10\ \text{cm}
\end{aligned}
$$

Nel secondo si sottrae il quadrato del cateto noto dal quadrato dell'ipotenusa:

$$
\begin{aligned}
x &= \sqrt{13^2 - 5^2} = \sqrt{169 - 25} \\
&= \sqrt{144} = 12\ \text{cm}
\end{aligned}
$$

I risultati non sono sempre interi. Con i cateti di $2$ cm e $3$ cm l'ipotenusa è $\sqrt{4 + 9} = \sqrt{13} \approx 3{,}61$ cm; con i cateti di $4$ cm e $4$ cm è $\sqrt{32} = 4\sqrt{2}$ cm.
```

```ad-warning
La radice di una somma non è la somma delle radici
$\sqrt{8^2 + 6^2}$ fa $\sqrt{100} = 10$, non $8 + 6 = 14$: prima si sommano i quadrati, poi si estrae la radice. Nel disegno l'ipotenusa è sempre più corta della somma dei cateti.
```

```ad-warning
Per il cateto si sottrae
Il quadrato dell'ipotenusa è il più grande dei tre. Per un cateto si calcola $c^2 - b^2$, non $c^2 + b^2$: nell'esempio 2 $\sqrt{169 + 25} \approx 13{,}9$ sarebbe più lungo dell'ipotenusa, e un cateto è sempre più corto dell'ipotenusa.
```

Il teorema vale solo per i triangoli rettangoli, e l'ipotenusa è sempre il lato opposto all'angolo retto, il più lungo dei tre. Nel piano cartesiano è lui che dà la formula della distanza tra due punti, nella lezione [Il piano cartesiano: distanza e punto medio](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio).

## L'inverso del teorema di Pitagora

Vale anche il contrario: se in un triangolo il quadrato di un lato è uguale alla somma dei quadrati degli altri due, il triangolo è rettangolo, e l'angolo retto è opposto a quel lato.

```tikz
% nome: pitagora-inverso
% alt: A sinistra il triangolo ABC con i lati a, b, c; a destra il triangolo A'B'C' rettangolo in C' con i cateti congruenti ad a e b: la sua ipotenusa è lunga c, quindi i due triangoli sono congruenti
% svg: pitagora-inverso-2e40e426.svg 254x124
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.75,0) -- (0.99,1.32) -- cycle;
\draw[thick] (0,0) -- (2.75,0) -- (0.99,1.32) -- cycle;
\fill[blue!8] (3.85,0) -- (5.5,0) -- (5.5,2.2) -- cycle;
\draw[thick] (3.85,0) -- (5.5,0) -- (5.5,2.2) -- cycle;
\draw[thin] (5.34,0) -- (5.34,0.16) -- (5.5,0.16);
\draw (0.41,0.73) -- (0.58,0.59);
\draw (4.68,0.11) -- (4.68,-0.11);
\draw (1.83,0.55) -- (1.96,0.73);
\draw (1.78,0.59) -- (1.91,0.77);
\draw (5.39,1.07) -- (5.61,1.07);
\draw (5.39,1.14) -- (5.61,1.14);
\node[below left] at (0,0) {$A$};
\node[below right] at (2.75,0) {$B$};
\node[above] at (0.99,1.32) {$C$};
\node[below left] at (3.85,0) {$A'$};
\node[below right] at (5.5,0) {$C'$};
\node[above] at (5.5,2.2) {$B'$};
\node[above left] at (0.3,0.4) {\small $b$};
\node[above right] at (2.22,0.4) {\small $a$};
\node[below] at (1.38,0) {\small $c$};
\node[below] at (4.35,0) {\small $b$};
\node[right] at (5.5,0.66) {\small $a$};
\end{tikzpicture}
```

Per dimostrarlo, dato il triangolo $ABC$ con $c^2 = a^2 + b^2$, si costruisce un triangolo $A'B'C'$ rettangolo in $C'$ con i cateti $\overline{A'C'} = b$ e $\overline{C'B'} = a$. Per il teorema di Pitagora la sua ipotenusa misura $\sqrt{a^2 + b^2} = c$. I due triangoli hanno i tre lati congruenti, quindi per il terzo criterio sono congruenti, e l'angolo $\hat{C}$ è retto come $\hat{C}'$.

Per sapere se un triangolo di cui conosci i lati è rettangolo, confronta il quadrato del lato più lungo con la somma dei quadrati degli altri due. Il triangolo con i lati $7$, $24$ e $25$ è rettangolo, perché $7^2 + 24^2 = 49 + 576 = 625 = 25^2$. Quello con i lati $6$, $7$ e $9$ non lo è: $6^2 + 7^2 = 85$, mentre $9^2 = 81$.

## Le terne pitagoriche

Una **terna pitagorica** è una terna di numeri naturali, diversi da zero, che possono essere le misure dei lati di un triangolo rettangolo: $a^2 + b^2 = c^2$. La più famosa è $3$, $4$, $5$, perché $9 + 16 = 25$. Moltiplicando i tre numeri di una terna per uno stesso numero si ottiene un'altra terna: da $3$, $4$, $5$ vengono $6$, $8$, $10$ e $9$, $12$, $15$, e il triangolo dell'esempio 1, con i lati $15$, $20$, $25$, è il triangolo $3$, $4$, $5$ con tutti i lati moltiplicati per $5$.

| Terna | Controllo | Multipli |
|---|---|---|
| $3$, $4$, $5$ | $9 + 16 = 25$ | $6$, $8$, $10$; $9$, $12$, $15$ |
| $5$, $12$, $13$ | $25 + 144 = 169$ | $10$, $24$, $26$ |
| $8$, $15$, $17$ | $64 + 225 = 289$ | $16$, $30$, $34$ |
| $7$, $24$, $25$ | $49 + 576 = 625$ | $14$, $48$, $50$ |

```ad-tip
Riconoscere una terna
Se i cateti sono $12$ e $16$, cioè $4 \cdot 3$ e $4 \cdot 4$, l'ipotenusa è $4 \cdot 5 = 20$ senza fare conti. Il conto con il teorema lo conferma: $\sqrt{144 + 256} = \sqrt{400} = 20$.
```

## Secondo teorema di Euclide

In un triangolo rettangolo il quadrato costruito sull'altezza relativa all'ipotenusa è equivalente al rettangolo che ha per lati le due proiezioni dei cateti sull'ipotenusa.

```tikz
% nome: euclide-secondo-teorema
% alt: Il triangolo ABC rettangolo in C con l'altezza CH; sotto l'ipotenusa, a sinistra di H, il quadrato con il lato congruente a CH, in arancione, e a destra il rettangolo con i lati congruenti a HB e ad AH, in azzurro: sono equivalenti
% svg: euclide-secondo-teorema-3d8d00b5.svg 159x135
\begin{tikzpicture}
\fill[orange!25] (1.12,0) -- (-0.37,0) -- (-0.37,-1.49) -- (1.12,-1.49) -- cycle;
\fill[blue!20] (1.12,0) -- (3.1,0) -- (3.1,-1.12) -- (1.12,-1.12) -- cycle;
\draw[thick, orange!70!black] (1.12,0) -- (-0.37,0) -- (-0.37,-1.49) -- (1.12,-1.49) -- cycle;
\draw[thick] (1.12,0) -- (3.1,0) -- (3.1,-1.12) -- (1.12,-1.12) -- cycle;
\fill[blue!6] (0,0) -- (3.1,0) -- (1.12,1.49) -- cycle;
\draw[thick] (0,0) -- (3.1,0) -- (1.12,1.49) -- cycle;
\draw[thick] (1.12,1.49) -- (1.12,0);
\draw[thin] (1.02,1.36) -- (1.15,1.26) -- (1.24,1.39);
\draw[thin] (1.26,0) -- (1.26,0.14) -- (1.12,0.14);
\draw (1.23,0.78) -- (1.01,0.78);
\draw (1.23,0.71) -- (1.01,0.71);
\draw (-0.26,-0.71) -- (-0.48,-0.71);
\draw (-0.26,-0.78) -- (-0.48,-0.78);
\draw (0.56,0.11) -- (0.56,-0.11);
\draw (3.21,-0.56) -- (2.99,-0.56);
\node[above left] at (0,0) {$A$};
\node[right] at (3.1,0) {$B$};
\node[above] at (1.12,1.49) {$C$};
\node[above right] at (1.12,0) {$H$};
\end{tikzpicture}
```

Con le misure:

$$\overline{CH}^{\,2} = \overline{AH} \cdot \overline{HB}$$

Lo dimostriamo con le misure. Il triangolo $AHC$ è rettangolo in $H$, con l'ipotenusa $AC$; per il teorema di Pitagora e poi per il primo teorema di Euclide

$$
\begin{aligned}
\overline{CH}^{\,2} &= \overline{AC}^{\,2} - \overline{AH}^{\,2} \\
&= \overline{AB} \cdot \overline{AH} - \overline{AH}^{\,2} \\
&= \overline{AH} \cdot (\overline{AB} - \overline{AH}) \\
&= \overline{AH} \cdot \overline{HB}
\end{aligned}
$$

perché $\overline{AB} - \overline{AH} = \overline{HB}$.

```ad-example
Esempio 3: l'altezza relativa all'ipotenusa
Nel triangolo dell'esempio 1, con $\overline{AH} = 9$ cm e $\overline{HB} = 16$ cm, trova l'altezza $CH$.

Per il secondo teorema di Euclide

$$\overline{CH}^{\,2} = 9 \cdot 16 = 144$$

quindi $\overline{CH} = 12$ cm. Lo stesso risultato viene dall'area: il prodotto dei cateti diviso l'ipotenusa, $\dfrac{15 \cdot 20}{25} = 12$, come nella lezione [Equivalenza e aree](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/equivalenza-e-aree).
```

## Diagonali, altezze e triangoli particolari

### La diagonale del quadrato

La diagonale divide il quadrato di lato $\ell$ in due triangoli rettangoli isosceli, con i cateti $\ell$ e l'ipotenusa uguale alla diagonale $d$. Per il teorema di Pitagora $d^2 = \ell^2 + \ell^2 = 2\ell^2$, quindi

$$d = \ell\sqrt{2}$$

```tikz
% nome: diagonale-quadrato
% alt: Un quadrato di lato l con la diagonale d, che lo divide in due triangoli rettangoli isosceli; uno dei due è colorato, con gli angoli acuti di 45 gradi
% svg: diagonale-quadrato-7ea562ad.svg 101x104
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.2,0) -- (2.2,2.2) -- (0,2.2) -- cycle;
\draw[thick] (0,0) -- (2.2,0) -- (2.2,2.2) -- (0,2.2) -- cycle;
\fill[blue!20] (0,0) -- (2.2,0) -- (2.2,2.2) -- cycle;
\draw[thick] (0,0) -- (2.2,0) -- (2.2,2.2) -- (0,2.2) -- cycle;
\draw[thick, blue!60!black] (0,0) -- (2.2,2.2);
\draw[thin] (2.02,0) -- (2.02,0.18) -- (2.2,0.18);
\draw[thin] (0.45,0) arc[start angle=0, delta angle=45, radius=0.45];
\node at (0.62,0.2) {\scriptsize $45^\circ$};
\node[below] at (1.1,0) {\small $\ell$};
\node[right] at (2.2,1.1) {\small $\ell$};
\node[above left] at (1,1.2) {\small $d$};
\end{tikzpicture}
```

Un quadrato con il lato di $5$ cm ha la diagonale di $5\sqrt{2} \approx 7{,}07$ cm. All'indietro, il lato è la diagonale divisa per $\sqrt{2}$: con la diagonale di $8$ cm il lato è $\dfrac{8}{\sqrt{2}} = \dfrac{8\sqrt{2}}{2} = 4\sqrt{2}$ cm, con il denominatore razionalizzato come nella lezione [Razionalizzazione](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/razionalizzazione).

### L'altezza del triangolo equilatero

In un triangolo equilatero di lato $\ell$ l'altezza $CH$ cade nel punto medio $H$ della base, e divide il triangolo in due triangoli rettangoli con l'ipotenusa $\ell$ e un cateto $\dfrac{\ell}{2}$.

```tikz
% nome: altezza-triangolo-equilatero
% alt: Il triangolo equilatero ABC di lato l con l'altezza CH, che cade nel punto medio H di AB e divide il triangolo in due triangoli rettangoli; in quello colorato i cateti sono l mezzi e h e l'ipotenusa è l
% svg: altezza-triangolo-equilatero-3dd5b9ad.svg 148x136
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.8,0) -- (1.4,2.42) -- cycle;
\fill[blue!20] (0,0) -- (1.4,0) -- (1.4,2.42) -- cycle;
\draw[thick] (0,0) -- (2.8,0) -- (1.4,2.42) -- cycle;
\draw[thick, blue!60!black] (1.4,2.42) -- (1.4,0);
\draw[thin] (1.56,0) -- (1.56,0.16) -- (1.4,0.16);
\draw (0.7,0.11) -- (0.7,-0.11);
\draw (2.1,0.11) -- (2.1,-0.11);
\node[below left] at (0,0) {$A$};
\node[below right] at (2.8,0) {$B$};
\node[above] at (1.4,2.42) {$C$};
\node[below] at (1.4,0) {$H$};
\node[above left] at (0.7,1.21) {\small $\ell$};
\node[above right] at (2.1,1.21) {\small $\ell$};
\node[below] at (0.7,0) {\small $\frac{\ell}{2}$};
\node[right] at (1.4,1.21) {\small $h$};
\end{tikzpicture}
```

Per il teorema di Pitagora

$$h^2 = \ell^2 - \frac{\ell^2}{4} = \frac{3\ell^2}{4}$$

quindi

$$h = \frac{\ell\sqrt{3}}{2}$$

Un triangolo equilatero con il lato di $6$ cm ha l'altezza di $3\sqrt{3} \approx 5{,}20$ cm e l'area di $\dfrac{6 \cdot 3\sqrt{3}}{2} = 9\sqrt{3} \approx 15{,}59\ \text{cm}^2$. In generale l'area del triangolo equilatero è $\dfrac{\ell^2\sqrt{3}}{4}$.

### Metà quadrato e metà triangolo equilatero

Metà di un quadrato, tagliato lungo la diagonale, è un triangolo rettangolo isoscele: ha gli angoli di $45^\circ$, $45^\circ$ e $90^\circ$, i cateti $\ell$ e l'ipotenusa $\ell\sqrt{2}$.

Metà di un triangolo equilatero, tagliato lungo un'altezza, è un triangolo rettangolo con gli angoli di $30^\circ$, $60^\circ$ e $90^\circ$. Se l'ipotenusa, cioè il lato del triangolo equilatero, misura $\ell$, il cateto opposto all'angolo di $30^\circ$ misura $\dfrac{\ell}{2}$ e quello opposto all'angolo di $60^\circ$ misura $\dfrac{\ell\sqrt{3}}{2}$.

```tikz
% nome: triangoli-45-e-30-60
% alt: A sinistra il triangolo rettangolo isoscele con i cateti l, gli angoli acuti di 45 gradi e l'ipotenusa l per radice di 2; a destra il triangolo con gli angoli di 30, 60 e 90 gradi, con l'ipotenusa l, il cateto opposto all'angolo di 30 gradi lungo l mezzi e l'altro l per radice di 3 mezzi
% svg: triangoli-45-e-30-60-fd1d2045.svg 206x105
\begin{tikzpicture}
\fill[blue!10] (0,0) -- (2,0) -- (0,2) -- cycle;
\draw[thick] (0,0) -- (2,0) -- (0,2) -- cycle;
\draw[thin] (0.16,0) -- (0.16,0.16) -- (0,0.16);
\draw[thin] (1.72,0.28) arc[start angle=135, delta angle=45, radius=0.4];
\draw[thin] (0,1.6) arc[start angle=-90, delta angle=45, radius=0.4];
\node at (1.38,0.14) {\scriptsize $45^\circ$};
\node at (0.16,1.4) {\scriptsize $45^\circ$};
\node[below] at (1,0) {\small $\ell$};
\node[left] at (0,1) {\small $\ell$};
\node[above right] at (1,1) {\small $\ell\sqrt{2}$};
\fill[orange!20] (2.9,0) -- (4.98,0) -- (2.9,1.2) -- cycle;
\draw[thick] (2.9,0) -- (4.98,0) -- (2.9,1.2) -- cycle;
\draw[thin] (3.06,0) -- (3.06,0.16) -- (2.9,0.16);
\draw[thin] (4.5,0.27) arc[start angle=150, delta angle=30, radius=0.55];
\draw[thin] (2.9,0.9) arc[start angle=-90, delta angle=60, radius=0.3];
\node at (4.18,0.14) {\scriptsize $30^\circ$};
\node at (3.1,0.82) {\scriptsize $60^\circ$};
\node[left] at (2.9,0.6) {\small $\frac{\ell}{2}$};
\node[below] at (3.94,0) {\small $\frac{\ell\sqrt{3}}{2}$};
\node[above right] at (3.94,0.6) {\small $\ell$};
\end{tikzpicture}
```

Chi riconosce uno di questi triangoli ricava tutti i lati da uno solo, senza il teorema di Pitagora; gli stessi triangoli danno il seno, il coseno e la tangente di $30^\circ$, $45^\circ$ e $60^\circ$, nella lezione [Seno, coseno e tangente nel triangolo rettangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/seno-coseno-e-tangente-nel-triangolo-rettangolo).

```ad-example
Esempio 4: un triangolo con gli angoli di 30° e 60°
Un triangolo rettangolo ha un angolo di $30^\circ$ e l'ipotenusa di $10$ cm. Trova i cateti.

Gli angoli sono $30^\circ$, $60^\circ$ e $90^\circ$: è metà di un triangolo equilatero di lato $10$ cm. Il cateto opposto all'angolo di $30^\circ$ è metà dell'ipotenusa, $5$ cm; l'altro è

$$\frac{10\sqrt{3}}{2} = 5\sqrt{3} \approx 8{,}66\ \text{cm}$$

Controllo con Pitagora: $5^2 + (5\sqrt{3})^2 = 25 + 75 = 100 = 10^2$.
```

```ad-warning
Il cateto opposto all'angolo di 30°
Il cateto lungo metà dell'ipotenusa è quello opposto all'angolo di $30^\circ$, cioè il più corto. Il cateto opposto all'angolo di $60^\circ$ è $\sqrt{3}$ volte più lungo.
```

## Problemi con i quadrilateri

Nei problemi il teorema si applica a un triangolo rettangolo che sta dentro la figura: metà di un rettangolo tagliato dalla diagonale, un quarto di un rombo tagliato dalle diagonali, il triangolo che l'altezza stacca da un trapezio. La prima cosa da fare è trovarlo e segnare quali lati sono i cateti e quale l'ipotenusa.

```ad-example
Esempio 5: il rettangolo
Un rettangolo ha la base di $24$ cm e la diagonale di $25$ cm. Calcola l'altezza, il perimetro e l'area.

```tikz
% nome: rettangolo-diagonale-esempio
% alt: Il rettangolo ABCD con la base AB di 24 e la diagonale AC di 25; il triangolo ABC, colorato, è rettangolo in B e ha per cateto l'altezza BC da trovare
% svg: rettangolo-diagonale-esempio-11dc7955.svg 225x92
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4.8,0) -- (4.8,1.4) -- (0,1.4) -- cycle;
\draw[thick] (0,0) -- (4.8,0) -- (4.8,1.4) -- (0,1.4) -- cycle;
\fill[blue!20] (0,0) -- (4.8,0) -- (4.8,1.4) -- cycle;
\draw[thick] (0,0) -- (4.8,0) -- (4.8,1.4) -- (0,1.4) -- cycle;
\draw (0,0) -- (4.8,1.4);
\draw[thin] (4.64,0) -- (4.64,0.16) -- (4.8,0.16);
\node[below left] at (0,0) {$A$};
\node[below right] at (4.8,0) {$B$};
\node[above right] at (4.8,1.4) {$C$};
\node[above left] at (0,1.4) {$D$};
\node[below] at (2.4,0) {\small $24$};
\node[above] at (2.4,0.7) {\small $25$};
\node[right] at (4.8,0.7) {\small $h$};
\end{tikzpicture}
```

La diagonale divide il rettangolo in due triangoli rettangoli: nel triangolo $ABC$ la diagonale $AC$ è l'ipotenusa, la base e l'altezza sono i cateti.

$$
\begin{aligned}
h &= \sqrt{25^2 - 24^2} = \sqrt{625 - 576} \\
&= \sqrt{49} = 7\ \text{cm}
\end{aligned}
$$

Il perimetro è $2 \cdot (24 + 7) = 62$ cm, l'area è $24 \cdot 7 = 168\ \text{cm}^2$.
```

```ad-example
Esempio 6: il rombo
Un rombo ha le diagonali di $16$ cm e $12$ cm. Calcola il lato, il perimetro, l'area e l'altezza.

```tikz
% nome: rombo-diagonali-lato
% alt: Il rombo ABCD con le diagonali AC di 16 e BD di 12 perpendicolari in O; il triangolo OCD, colorato, è rettangolo in O con i cateti di 8 e 6 e ha per ipotenusa il lato CD
% svg: rombo-diagonali-lato-d3640fed.svg 199x158
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.08,-1.56) -- (4.16,0) -- (2.08,1.56) -- cycle;
\fill[blue!20] (2.08,0) -- (4.16,0) -- (2.08,1.56) -- cycle;
\draw[thick] (0,0) -- (2.08,-1.56) -- (4.16,0) -- (2.08,1.56) -- cycle;
\draw (0,0) -- (4.16,0);
\draw (2.08,-1.56) -- (2.08,1.56);
\draw[thin] (2.23,0) -- (2.23,0.15) -- (2.08,0.15);
\draw (1.11,-0.69) -- (0.97,-0.87);
\draw (3.05,-0.69) -- (3.19,-0.87);
\draw (3.05,0.69) -- (3.19,0.87);
\draw (1.11,0.69) -- (0.97,0.87);
\node[left] at (0,0) {$A$};
\node[below] at (2.08,-1.56) {$B$};
\node[right] at (4.16,0) {$C$};
\node[above] at (2.08,1.56) {$D$};
\node[below left] at (2.08,0) {\small $O$};
\node[below] at (3.12,0) {\scriptsize $8$};
\node[left] at (2.08,0.78) {\scriptsize $6$};
\end{tikzpicture}
```

Le diagonali del rombo sono perpendicolari e si tagliano a metà: il triangolo $OCD$ è rettangolo in $O$, con i cateti $\overline{OC} = 8$ cm e $\overline{OD} = 6$ cm, e il lato $CD$ è la sua ipotenusa.

$$\overline{CD} = \sqrt{8^2 + 6^2} = \sqrt{100} = 10\ \text{cm}$$

Il perimetro è $4 \cdot 10 = 40$ cm e l'area $\dfrac{16 \cdot 12}{2} = 96\ \text{cm}^2$. Il rombo è un parallelogramma, quindi l'area è anche lato per altezza: $10 \cdot h = 96$, e $h = 9{,}6$ cm.
```

```ad-example
Esempio 7: il trapezio isoscele
Un trapezio isoscele ha le basi di $22$ cm e $10$ cm e i lati obliqui di $10$ cm. Calcola l'altezza, l'area e la diagonale.

```tikz
% nome: trapezio-isoscele-pitagora
% alt: Il trapezio isoscele ABCD con la base maggiore AB di 22, la base minore DC di 10 e i lati obliqui di 10; le altezze DH e CK staccano dalla base maggiore due segmenti AH e KB congruenti, e il triangolo AHD è colorato; è tracciata la diagonale AC
% svg: trapezio-isoscele-pitagora-2a4db5a4.svg 225x122
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4.84,0) -- (3.52,1.76) -- (1.32,1.76) -- cycle;
\fill[blue!20] (0,0) -- (1.32,0) -- (1.32,1.76) -- cycle;
\draw[thick] (0,0) -- (4.84,0) -- (3.52,1.76) -- (1.32,1.76) -- cycle;
\draw[dashed] (1.32,1.76) -- (1.32,0);
\draw[dashed] (3.52,1.76) -- (3.52,0);
\draw (0,0) -- (3.52,1.76);
\draw[thin] (1.47,0) -- (1.47,0.15) -- (1.32,0.15);
\draw[thin] (3.67,0) -- (3.67,0.15) -- (3.52,0.15);
\draw (0.57,0.95) -- (0.75,0.81);
\draw (4.09,0.81) -- (4.27,0.95);
\node[below left] at (0,0) {$A$};
\node[below right] at (4.84,0) {$B$};
\node[above right] at (3.52,1.76) {$C$};
\node[above left] at (1.32,1.76) {$D$};
\node[below] at (1.32,0) {$H$};
\node[below] at (3.52,0) {$K$};
\node[above] at (2.42,1.76) {\small $10$};
\node[left] at (0.4,0.53) {\small $10$};
\draw[<->, thin] (0,-0.45) -- (4.84,-0.45);
\node[below] at (2.42,-0.45) {\small $22$};
\end{tikzpicture}
```

Le altezze $DH$ e $CK$ staccano dalla base maggiore due segmenti congruenti, $AH$ e $KB$, e il segmento $HK$ in mezzo è congruente alla base minore. Quindi

$$\overline{AH} = \frac{22 - 10}{2} = 6\ \text{cm}$$

Nel triangolo $AHD$, rettangolo in $H$, il lato obliquo $AD$ è l'ipotenusa:

$$h = \sqrt{10^2 - 6^2} = \sqrt{64} = 8\ \text{cm}$$

L'area è $\dfrac{(22 + 10) \cdot 8}{2} = 128\ \text{cm}^2$. Per la diagonale $AC$ si usa il triangolo $AKC$, rettangolo in $K$, con i cateti $\overline{CK} = 8$ cm e $\overline{AK} = 22 - 6 = 16$ cm:

$$
\begin{aligned}
\overline{AC} &= \sqrt{16^2 + 8^2} = \sqrt{320} \\
&= 8\sqrt{5} \approx 17{,}89\ \text{cm}
\end{aligned}
$$
```

```ad-example
Esempio 8: il trapezio rettangolo
Un trapezio rettangolo ha le basi di $15$ cm e $9$ cm e l'altezza di $8$ cm. Calcola il lato obliquo e il perimetro.

```tikz
% nome: trapezio-rettangolo-pitagora
% alt: Il trapezio rettangolo ABCD con la base maggiore AB di 15, la base minore DC di 9 e l'altezza AD di 8; l'altezza CK stacca il triangolo KBC, colorato, che ha per ipotenusa il lato obliquo BC
% svg: trapezio-rettangolo-pitagora-6359dae4.svg 214x146
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4.5,0) -- (2.7,2.4) -- (0,2.4) -- cycle;
\fill[blue!20] (2.7,0) -- (4.5,0) -- (2.7,2.4) -- cycle;
\draw[thick] (0,0) -- (4.5,0) -- (2.7,2.4) -- (0,2.4) -- cycle;
\draw[dashed] (2.7,2.4) -- (2.7,0);
\draw[thin] (0.16,0) -- (0.16,0.16) -- (0,0.16);
\draw[thin] (0,2.24) -- (0.16,2.24) -- (0.16,2.4);
\draw[thin] (2.85,0) -- (2.85,0.15) -- (2.7,0.15);
\node[below left] at (0,0) {$A$};
\node[below right] at (4.5,0) {$B$};
\node[above right] at (2.7,2.4) {$C$};
\node[above left] at (0,2.4) {$D$};
\node[below] at (2.7,0) {$K$};
\draw[<->, thin] (0,-0.45) -- (4.5,-0.45);
\node[below] at (2.25,-0.45) {\small $15$};
\node[above] at (1.35,2.4) {\small $9$};
\node[left] at (0,1.2) {\small $8$};
\end{tikzpicture}
```

L'altezza $CK$ stacca il triangolo $KBC$, rettangolo in $K$. Il cateto $KB$ è la differenza delle basi, $15 - 9 = 6$ cm, e l'altro cateto è l'altezza:

$$\overline{BC} = \sqrt{6^2 + 8^2} = \sqrt{100} = 10\ \text{cm}$$

Il perimetro è $15 + 10 + 9 + 8 = 42$ cm.
```

```ad-warning
Il lato obliquo non è l'altezza
Nel trapezio isoscele dell'esempio 7 il lato obliquo è l'ipotenusa del triangolo $AHD$, e l'altezza è un cateto: è più corta del lato obliquo ($8$ contro $10$). Usare il lato obliquo al posto dell'altezza nell'area dà $160$ invece di $128$.
```
