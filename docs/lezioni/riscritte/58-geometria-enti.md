# Enti geometrici, segmenti e angoli

La geometria che si studia alle superiori è quella di Euclide, un matematico greco vissuto intorno al 300 a.C.: si parte da pochi oggetti che non si definiscono e da poche proprietà che si accettano senza dimostrarle, e da lì si ricava tutto il resto con il ragionamento. Gli oggetti di partenza sono i più semplici (punti, rette, segmenti, angoli) e le loro proprietà si vedono sul disegno, ma le parole e i simboli sono gli stessi con cui poi si dimostrano i teoremi sui triangoli e sui quadrilateri.

## Enti primitivi: punto, retta, piano

Il punto, la retta e il piano sono gli **enti primitivi** della geometria: non si definiscono, perché ogni definizione dovrebbe usare altre parole da definire a loro volta. Se ne ha un'idea intuitiva (un punto è il segno lasciato dalla punta della matita, senza dimensioni; una retta è un filo teso, sottilissimo e senza fine; un piano è una superficie liscia e illimitata come un foglio senza bordi) e quello che conta sono le proprietà che li legano.

I punti si indicano con le lettere maiuscole ($A$, $B$, $P$), le rette con le minuscole ($r$, $s$), i piani con le lettere greche ($\alpha$, $\beta$). Qui tutte le figure stanno in un piano: è la geometria piana.

```tikz
% nome: enti-primitivi-punto-retta-piano
% alt: Un piano alfa disegnato come un parallelogramma; dentro, la retta r passa per i punti A e B, e il punto P sta fuori dalla retta
% svg: enti-primitivi-punto-retta-piano-ed37e5a7.svg 254x94
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (5.4,0) -- (6.6,2.4) -- (1.2,2.4) -- cycle;
\draw[blue!50!black] (0,0) -- (5.4,0) -- (6.6,2.4) -- (1.2,2.4) -- cycle;
\node at (5.7,0.35) {$\alpha$};
\draw (0.9,0.6) -- (5.6,1.9) node[above left] {$r$};
\fill (2,0.904) circle (0.055) node[above left] {$A$};
\fill (3.9,1.430) circle (0.055) node[above left] {$B$};
\fill (4,0.55) circle (0.055) node[right] {$P$};
\end{tikzpicture}
```

Un punto può appartenere a una retta (la retta passa per il punto) oppure no: nella figura $A \in r$ e $B \in r$, mentre $P \notin r$. Tre o più punti che stanno su una stessa retta si dicono **allineati**.

## I postulati

Le proprietà che si accettano senza dimostrarle si chiamano **postulati** (o assiomi); quelle che si ricavano con un ragionamento si chiamano **teoremi**, e il ragionamento è la loro dimostrazione. Per cominciare servono due gruppi di postulati.

I postulati di appartenenza dicono come stanno insieme punti, rette e piano:

1. una retta contiene infiniti punti, e il piano contiene infiniti punti e infinite rette;
2. per due punti distinti passa una e una sola retta;
3. data una retta, c'è almeno un punto del piano che non le appartiene.

Per il secondo postulato la retta per $A$ e $B$ è una sola, e si può chiamare anche retta $AB$. Ne segue che due rette distinte hanno al massimo un punto in comune: se ne avessero due, per quei due punti passerebbero due rette diverse. Due rette con un solo punto in comune si dicono **incidenti**; quelle che non ne hanno nessuno sono le rette parallele, che hanno la loro lezione, [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele).

I postulati d'ordine descrivono come sono disposti i punti su una retta:

1. la retta è ordinata: scelto un verso di percorrenza, di due suoi punti distinti uno precede l'altro;
2. la retta non ha né un primo né un ultimo punto: è illimitata nei due versi;
3. tra due punti distinti di una retta c'è sempre almeno un altro punto, e quindi ce ne sono infiniti: la retta è densa.

## Semirette e segmenti

Un punto $O$ di una retta la divide in due parti. Ciascuna parte, insieme al punto $O$, è una **semiretta** di origine $O$. Le due semirette che si ottengono così stanno sulla stessa retta, hanno la stessa origine e sono **opposte**: una è il prolungamento dell'altra oltre $O$.

```tikz
% nome: semirette-opposte
% alt: Una retta divisa dal punto O in due semirette opposte: la semiretta a verso sinistra e la semiretta b verso destra
% svg: semirette-opposte-218cca16.svg 231x40
\begin{tikzpicture}
\draw[thick, blue!60!black] (0,0) -- (-3,0) node[above right] {$a$};
\draw[thick, orange!80!black] (0,0) -- (3,0) node[above left] {$b$};
\fill (0,0) circle (0.06) node[below] {$O$};
\end{tikzpicture}
```

Dati due punti distinti $A$ e $B$, il **segmento** $AB$ è formato da $A$, da $B$ e da tutti i punti della retta $AB$ compresi tra loro. $A$ e $B$ sono gli estremi del segmento. A differenza della retta e della semiretta, il segmento ha una lunghezza finita.

```tikz
% nome: segmento-ab-su-retta
% alt: Il segmento AB, con gli estremi A e B, disegnato più spesso sulla retta tratteggiata che passa per A e B
% svg: segmento-ab-su-retta-87ab8388.svg 254x23
\begin{tikzpicture}
\draw[dashed, gray] (-1.3,0) -- (5.3,0);
\draw[very thick] (0,0) -- (4,0);
\fill (0,0) circle (0.06) node[below] {$A$};
\fill (4,0) circle (0.06) node[below] {$B$};
\end{tikzpicture}
```

Due segmenti sono **consecutivi** se hanno in comune solo un estremo. Sono **adiacenti** se sono consecutivi e stanno sulla stessa retta. Nella figura, a sinistra $AB$ e $BC$ sono consecutivi ma non adiacenti; a destra $DE$ ed $EF$ sono adiacenti.

```tikz
% nome: segmenti-consecutivi-adiacenti
% alt: A sinistra i segmenti AB e BC, consecutivi e non sulla stessa retta; a destra i segmenti DE ed EF, adiacenti, sulla stessa retta
% svg: segmenti-consecutivi-adiacenti-683a8966.svg 280x77
\begin{tikzpicture}
\draw[thick] (0,0) -- (1.5,1) -- (2.9,0.2);
\fill (0,0) circle (0.06) node[below] {$A$};
\fill (1.5,1) circle (0.06) node[above] {$B$};
\fill (2.9,0.2) circle (0.06) node[below] {$C$};
\draw[thick] (3.8,0.4) -- (6.8,0.4);
\fill (3.8,0.4) circle (0.06) node[below] {$D$};
\fill (5.4,0.4) circle (0.06) node[below] {$E$};
\fill (6.8,0.4) circle (0.06) node[below] {$F$};
\end{tikzpicture}
```

```ad-warning
Consecutivi non vuol dire adiacenti
Due segmenti adiacenti sono sempre consecutivi, ma non il contrario: $AB$ e $BC$ della figura hanno in comune l'estremo $B$ e nient'altro, quindi sono consecutivi, ma non stanno sulla stessa retta. Anche due segmenti sulla stessa retta non sono adiacenti se si sovrappongono per un tratto: hanno in comune più di un punto, e allora non sono nemmeno consecutivi.
```

## Figure, figure convesse e congruenza

In geometria una **figura** è un qualunque insieme di punti: una retta, un segmento, un triangolo sono figure. Una figura è **convessa** se, presi due suoi punti qualsiasi, il segmento che li unisce sta tutto dentro la figura; altrimenti è **concava**.

```tikz
% nome: figura-convessa-concava
% alt: A sinistra una figura convessa, un pentagono, con un segmento PQ tutto al suo interno; a destra una figura concava, a forma di punta di freccia, con un segmento PQ che esce dalla figura
% svg: figura-convessa-concava-398e1ba9.svg 265x89
\begin{tikzpicture}
\fill[blue!15] (0,0) -- (2.2,0) -- (2.7,1.3) -- (1.2,2.2) -- (-0.3,1.3) -- cycle;
\draw[blue!50!black] (0,0) -- (2.2,0) -- (2.7,1.3) -- (1.2,2.2) -- (-0.3,1.3) -- cycle;
\draw[thick] (0.3,0.4) -- (2.2,1.5);
\fill (0.3,0.4) circle (0.055) node[below right] {$P$};
\fill (2.2,1.5) circle (0.055) node[above] {$Q$};
\fill[orange!25] (3.8,0) -- (5.2,1) -- (6.6,0) -- (5.2,2.2) -- cycle;
\draw[orange!70!black] (3.8,0) -- (5.2,1) -- (6.6,0) -- (5.2,2.2) -- cycle;
\draw[thick] (4.4,0.6) -- (6.1,0.6);
\fill (4.4,0.6) circle (0.055) node[left] {$P$};
\fill (6.1,0.6) circle (0.055) node[right] {$Q$};
\end{tikzpicture}
```

Due figure sono **congruenti** se si possono sovrapporre punto per punto con un movimento rigido, cioè spostandone una ([traslandola, ruotandola, ribaltandola](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/trasformazioni-geometriche)) senza deformarla. La congruenza si scrive con il simbolo $\cong$: $AB \cong CD$ si legge "$AB$ è congruente a $CD$". La congruenza dei triangoli, con i criteri per riconoscerla, è nella lezione [Triangoli e criteri di congruenza](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/triangoli-e-criteri-di-congruenza). Nei disegni i segmenti congruenti si segnano con lo stesso numero di trattini.

## Confronto e somma di segmenti

Per confrontare due segmenti $AB$ e $CD$ si trasporta $AB$ con un movimento rigido in modo che $A$ cada su $C$ e $B$ cada sulla semiretta di origine $C$ che contiene $D$. Se $B$ cade su $D$, i due segmenti sono congruenti; se cade tra $C$ e $D$, $AB$ è minore di $CD$ e si scrive $AB < CD$; se cade oltre $D$, $AB$ è maggiore di $CD$.

```tikz
% nome: confronto-segmenti
% alt: Il segmento AB trasportato sul segmento CD con A sopra C: il punto B cade tra C e D, quindi AB è minore di CD
% svg: confronto-segmenti-af4c53ba.svg 193x77
\begin{tikzpicture}
\draw[thick] (0,1) -- (4.5,1);
\fill (0,1) circle (0.06) node[above] {$C$};
\fill (4.5,1) circle (0.06) node[above] {$D$};
\draw[thick, blue!60!black] (0,0) -- (3,0);
\fill (0,0) circle (0.06) node[below] {$A$};
\fill (3,0) circle (0.06) node[below] {$B$};
\draw[dashed, gray] (0,0) -- (0,1);
\draw[dashed, gray] (3,0) -- (3,1);
\end{tikzpicture}
```

Per sommare due segmenti $AB$ e $CD$ li si rende adiacenti: si trasporta $CD$ in un segmento $BE$ che ha un estremo in $B$ e sta sul prolungamento di $AB$. Il segmento $AE$ è la **somma** $AB + CD$. Allo stesso modo la differenza $AE - CD$ è il segmento $AB$, che resta togliendo $BE \cong CD$ da $AE$. Sommando un segmento a se stesso si ottengono i suoi multipli: $AB + AB = 2AB$, e così via.

```tikz
% nome: somma-segmenti
% alt: In alto i segmenti AB, segnato con un trattino, e CD, segnato con due trattini; in basso il segmento AE, somma dei due, formato da AB e dal segmento BE congruente a CD
% svg: somma-segmenti-545c25b9.svg 235x77
\begin{tikzpicture}
\draw[thick] (0,1) -- (2.8,1);
\fill (0,1) circle (0.06) node[above] {$A$};
\fill (2.8,1) circle (0.06) node[above] {$B$};
\draw (1.4,0.88) -- (1.4,1.12);
\draw[thick] (3.6,1) -- (5.6,1);
\fill (3.6,1) circle (0.06) node[above] {$C$};
\fill (5.6,1) circle (0.06) node[above] {$D$};
\draw (4.54,0.88) -- (4.54,1.12);
\draw (4.66,0.88) -- (4.66,1.12);
\draw[thick] (0,0) -- (4.8,0);
\fill (0,0) circle (0.06) node[below] {$A$};
\fill (2.8,0) circle (0.06) node[below] {$B$};
\fill (4.8,0) circle (0.06) node[below] {$E$};
\draw (1.4,-0.12) -- (1.4,0.12);
\draw (3.74,-0.12) -- (3.74,0.12);
\draw (3.86,-0.12) -- (3.86,0.12);
\end{tikzpicture}
```

Il **punto medio** di un segmento $AB$ è il punto $M$ del segmento tale che $AM \cong MB$: divide il segmento in due parti congruenti, ciascuna la metà di $AB$. Ogni segmento ha uno e un solo punto medio.

```tikz
% nome: punto-medio-segmento
% alt: Il segmento AB con il punto medio M: le due metà AM e MB sono segnate con un trattino ciascuna, perché congruenti
% svg: punto-medio-segmento-c335fd09.svg 212x26
\begin{tikzpicture}
\draw[thick] (0,0) -- (5,0);
\fill (0,0) circle (0.06) node[below] {$A$};
\fill (2.5,0) circle (0.06) node[below] {$M$};
\fill (5,0) circle (0.06) node[below] {$B$};
\draw (1.25,-0.12) -- (1.25,0.12);
\draw (3.75,-0.12) -- (3.75,0.12);
\end{tikzpicture}
```

## Lunghezza di un segmento

Scelta un'unità di misura, per esempio il centimetro, ogni segmento ha una lunghezza, che è un numero positivo. Segmenti congruenti hanno la stessa lunghezza, e la lunghezza della somma è la somma delle lunghezze. Per la lunghezza si usa lo stesso nome del segmento: $AB = 8$ cm vuol dire che il segmento $AB$ è lungo $8$ cm (alcuni libri scrivono $\overline{AB} = 8$ cm). Così, se $M$ è il punto medio di $AB$ e $AB = 8$ cm, allora $AM = MB = 4$ cm.

```ad-example
Esempio 1: i punti medi di due segmenti adiacenti
I segmenti $AB$ e $BC$ sono adiacenti, con $AB = 8$ cm e $BC = 5$ cm. $M$ è il punto medio di $AB$ e $N$ è il punto medio di $BC$. Quanto è lungo $MN$?

Tra $M$ e $N$ c'è il punto $B$, quindi $MN = MB + BN$. $MB$ è la metà di $AB$ e $BN$ è la metà di $BC$:

$$
\begin{aligned}
MN &= 4 + 2{,}5 \\
&= 6{,}5 \text{ cm}
\end{aligned}
$$

```tikz
% nome: punti-medi-segmenti-adiacenti
% alt: I segmenti adiacenti AB di 8 centimetri e BC di 5 centimetri, con M punto medio di AB e N punto medio di BC; AM e MB hanno un trattino, BN e NC due trattini
% svg: punti-medi-segmenti-adiacenti-1d362d1e.svg 268x48
\begin{tikzpicture}
\draw[thick] (0,0) -- (6.5,0);
\fill (0,0) circle (0.06) node[below] {$A$};
\fill (2,0) circle (0.06) node[below] {$M$};
\fill (4,0) circle (0.06) node[below] {$B$};
\fill (5.25,0) circle (0.06) node[below] {$N$};
\fill (6.5,0) circle (0.06) node[below] {$C$};
\draw (1,-0.12) -- (1,0.12);
\draw (3,-0.12) -- (3,0.12);
\draw (4.57,-0.12) -- (4.57,0.12);
\draw (4.68,-0.12) -- (4.68,0.12);
\draw (5.82,-0.12) -- (5.82,0.12);
\draw (5.93,-0.12) -- (5.93,0.12);
\node[above] at (2,0.25) {$8$ cm};
\node[above] at (5.25,0.25) {$5$ cm};
\end{tikzpicture}
```

$AC = 13$ cm, quindi $MN$ è la metà di $AC$. Non è un caso: $MN$ è la metà di $AB$ più la metà di $BC$, cioè la metà della loro somma, qualunque siano le lunghezze.
```

```ad-example
Esempio 2: un segmento diviso in due parti
Il segmento $AC$ è lungo $20$ cm e il punto $B$ lo divide in due parti, con $AB$ triplo di $BC$. Quanto sono lunghe $AB$ e $BC$? E quanto dista $B$ dal punto medio $M$ di $AC$?

Chiama $x$ la lunghezza di $BC$ in centimetri; allora $AB = 3x$. I segmenti $AB$ e $BC$ sono adiacenti e la loro somma è $AC$, quindi si risolve un'[equazione di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere):

$$
\begin{gathered}
3x + x = 20 \\
4x = 20 \\
x = 5
\end{gathered}
$$

Quindi $BC = 5$ cm e $AB = 15$ cm. Il punto medio di $AC$ dista $10$ cm da $A$, mentre $B$ ne dista $15$: $M$ sta tra $A$ e $B$, e $MB = 15 - 10 = 5$ cm.

```tikz
% nome: segmento-diviso-parte-tripla
% alt: Il segmento AC di 20 centimetri diviso in quattro parti uguali: AB ne occupa tre ed è lungo 3x, BC ne occupa una ed è lungo x; il punto medio M di AC sta tra A e B
% svg: segmento-diviso-parte-tripla-428d9638.svg 249x42
\begin{tikzpicture}
\draw[thick] (0,0) -- (6,0);
\foreach \x in {1.5,3,4.5} \draw[gray] (\x,-0.08) -- (\x,0.08);
\fill (0,0) circle (0.06) node[below] {$A$};
\fill (3,0) circle (0.06) node[below] {$M$};
\fill (4.5,0) circle (0.06) node[below] {$B$};
\fill (6,0) circle (0.06) node[below] {$C$};
\node[above] at (2.25,0.1) {$3x$};
\node[above] at (5.25,0.1) {$x$};
\end{tikzpicture}
```

Controllo: $15 = 3 \cdot 5$ e $15 + 5 = 20$.
```

## Angoli

Due semirette con la stessa origine $O$ dividono il piano in due parti. Ciascuna delle due parti, insieme alle semirette, è un **angolo**: le semirette sono i lati dell'angolo e $O$ è il suo vertice. Se le due semirette non stanno sulla stessa retta, una delle due parti è convessa e l'altra è concava: si parla di angolo convesso e di angolo concavo.

```tikz
% nome: angolo-convesso-concavo
% alt: Due semirette a e b con origine O: l'angolo convesso AOB, colorato, è la parte di piano più piccola tra le due semirette; il resto del piano, indicato con un arco tratteggiato, è l'angolo concavo
% svg: angolo-convesso-concavo-b918b770.svg 181x155
\begin{tikzpicture}
\fill[blue!15] (0,0) -- (5:2) arc (5:85:2) -- cycle;
\draw[thick] (0,0) -- (5:2.7) node[right] {$a$};
\draw[thick] (0,0) -- (85:2.5) node[above] {$b$};
\fill (0,0) circle (0.06);
\node at (-0.22,0.2) {$O$};
\fill (5:2.2) circle (0.055) node[below] {$A$};
\fill (85:2) circle (0.055) node[left] {$B$};
\node at (45:1.25) {convesso};
\draw[dashed, orange!70!black] (85:0.6) arc (85:365:0.6);
\node at (225:1.2) {concavo};
\end{tikzpicture}
```

Un angolo si indica con tre lettere, un punto su un lato, il vertice e un punto sull'altro lato, con il vertice sempre in mezzo: $\widehat{AOB}$. Quando non c'è ambiguità si scrive solo il vertice, $\hat{O}$, oppure si usano i nomi dei lati, $\widehat{aOb}$, o una lettera greca, $\alpha$. Se non si dice altro, $\widehat{AOB}$ è l'angolo convesso.

```ad-warning
Il vertice va in mezzo
$\widehat{OAB}$ non è l'angolo della figura: è l'angolo con il vertice in $A$. Nella scrittura con tre lettere il vertice è sempre la lettera centrale.
```

Ci sono tre casi particolari, quando le due semirette stanno sulla stessa retta:

- se i lati sono semirette opposte, le due parti di piano sono congruenti e ciascuna è un **angolo piatto**;
- se i lati coincidono, una delle due parti è tutto il piano, l'**angolo giro**;
- l'altra parte, sempre con i lati coincidenti, è formata dalla sola semiretta: è l'**angolo nullo**.

```tikz
% nome: angolo-piatto-giro-nullo
% alt: Tre angoli con vertice O: l'angolo piatto, con i lati opposti e un arco a semicerchio; l'angolo giro, con i lati coincidenti e un arco che fa tutto il giro; l'angolo nullo, con i lati coincidenti e nessuna apertura
% svg: angolo-piatto-giro-nullo-f89fd0f3.svg 273x64
\begin{tikzpicture}
\draw[thick] (0,0) -- (2.4,0);
\fill (1.2,0) circle (0.06) node[below] {$O$};
\draw[blue!60!black] (1.65,0) arc (0:180:0.45);
\node at (1.2,-0.8) {piatto};
\draw[thick] (3.4,0) -- (4.9,0);
\fill (3.4,0) circle (0.06) node[above left] {$O$};
\draw[blue!60!black] (3.95,0) arc (0:360:0.55);
\node at (3.9,-0.8) {giro};
\draw[thick] (5.6,0) -- (7.1,0);
\fill (5.6,0) circle (0.06) node[below] {$O$};
\node at (6.35,-0.8) {nullo};
\end{tikzpicture}
```

## Confronto e somma di angoli

Gli angoli si confrontano come i segmenti: si sovrappongono i vertici e un lato, e si guarda dove cade l'altro lato. Due angoli sono **consecutivi** se hanno lo stesso vertice e un lato in comune, e non hanno altri punti in comune. Sono **adiacenti** se sono consecutivi e i lati non comuni sono semirette opposte: insieme formano un angolo piatto.

```tikz
% nome: angoli-consecutivi-adiacenti
% alt: A sinistra due angoli consecutivi aOb e bOc, con il lato b in comune; a destra due angoli adiacenti, con un lato in comune e gli altri due lati su una stessa retta
% svg: angoli-consecutivi-adiacenti-189f4081.svg 290x119
\begin{tikzpicture}
\draw[thick] (0,0) -- (0:1.9) node[right] {$a$};
\draw[thick] (0,0) -- (50:1.8) node[above] {$b$};
\draw[thick] (0,0) -- (115:1.8) node[above] {$c$};
\fill (0,0) circle (0.06) node[below] {$O$};
\draw[blue!60!black] (0:0.5) arc (0:50:0.5);
\draw[orange!80!black] (50:0.7) arc (50:115:0.7);
\node at (0.3,-0.8) {consecutivi};
\begin{scope}[shift={(4.9,0)}]
\draw[thick] (-1.7,0) -- (1.7,0);
\draw[thick] (0,0) -- (60:1.8);
\fill (0,0) circle (0.06) node[below] {$O'$};
\draw[blue!60!black] (0:0.5) arc (0:60:0.5);
\draw[orange!80!black] (60:0.7) arc (60:180:0.7);
\node at (0,-0.8) {adiacenti};
\end{scope}
\end{tikzpicture}
```

La somma di due angoli consecutivi $\widehat{aOb}$ e $\widehat{bOc}$ è l'angolo $\widehat{aOc}$, formato dai due lati non comuni; per sommare due angoli qualsiasi li si trasporta prima in modo che diventino consecutivi. La somma di due angoli adiacenti è quindi un angolo piatto. Tutti gli angoli piatti sono congruenti tra loro, e così tutti gli angoli giro.

La **bisettrice** di un angolo è la semiretta che ha origine nel vertice e lo divide in due angoli congruenti. Ogni angolo ha una e una sola bisettrice. Nei disegni gli angoli congruenti si segnano con archetti uguali (lo stesso numero di trattini sull'arco).

```tikz
% nome: bisettrice-angolo
% alt: L'angolo AOB con la bisettrice OC: i due angoli AOC e COB sono congruenti e sono segnati con un archetto con un trattino ciascuno
% svg: bisettrice-angolo-c2758685.svg 156x137
\begin{tikzpicture}
\draw[thick] (0,0) -- (0:3) node[right] {$A$};
\draw[thick] (0,0) -- (80:2.6) node[above] {$B$};
\draw[thick, blue!60!black] (0,0) -- (40:2.9) node[above right] {$C$};
\fill (0,0) circle (0.06) node[below left] {$O$};
\draw (0:0.8) arc (0:40:0.8);
\draw (40:0.8) arc (40:80:0.8);
\draw (20:0.7) -- (20:0.9);
\draw (60:0.7) -- (60:0.9);
\end{tikzpicture}
```

## Angoli retti, acuti e ottusi

Un **angolo retto** è la metà di un angolo piatto: la bisettrice di un angolo piatto lo divide in due angoli retti. Un angolo convesso è **acuto** se è minore di un angolo retto, **ottuso** se è maggiore di un angolo retto e minore di un angolo piatto. Nei disegni l'angolo retto si segna con un quadratino al posto dell'arco.

```tikz
% nome: angolo-acuto-retto-ottuso
% alt: Tre angoli: un angolo acuto, più chiuso di un angolo retto; un angolo retto, segnato con un quadratino; un angolo ottuso, più aperto di un angolo retto
% svg: angolo-acuto-retto-ottuso-cce8c4be.svg 265x84
\begin{tikzpicture}
\draw[thick] (1.6,0) -- (0,0) -- (40:1.6);
\draw[blue!60!black] (0.5,0) arc (0:40:0.5);
\node at (0.8,-0.5) {acuto};
\draw[thick] (3.9,0) -- (2.5,0) -- (2.5,1.4);
\draw[blue!60!black] (2.8,0) -- (2.8,0.3) -- (2.5,0.3);
\node at (3.1,-0.5) {retto};
\draw[thick] (6.9,0) -- (5.5,0) -- ++(130:1.5);
\draw[blue!60!black] (6,0) arc (0:130:0.5);
\node at (5.7,-0.5) {ottuso};
\end{tikzpicture}
```

## Misura degli angoli in gradi

Gli angoli si misurano in gradi. L'angolo giro misura $360^\circ$, quindi un grado è la trecentosessantesima parte dell'angolo giro. Ne seguono le misure degli angoli particolari:

| Angolo | Misura |
|---|---|
| nullo | $0^\circ$ |
| acuto | tra $0^\circ$ e $90^\circ$ |
| retto | $90^\circ$ |
| ottuso | tra $90^\circ$ e $180^\circ$ |
| piatto | $180^\circ$ |
| giro | $360^\circ$ |

Un angolo concavo misura tra $180^\circ$ e $360^\circ$. Come per i segmenti, angoli congruenti hanno la stessa misura, la misura della somma è la somma delle misure, e si scrive $\widehat{AOB} = 50^\circ$ per dire che l'angolo $\widehat{AOB}$ misura $50^\circ$.

Le parti di grado si esprimono in primi e secondi, come le ore in minuti e secondi: un grado è $60$ primi e un primo è $60$ secondi.

$$
\begin{gathered}
1^\circ = 60' \qquad 1' = 60''
\end{gathered}
$$

Così $37^\circ 25'$ si legge "$37$ gradi e $25$ primi". Nei calcoli, quando i primi arrivano a $60$ si trasformano in un grado; quando mancano, si prende in prestito un grado e lo si trasforma in $60$ primi.

```ad-example
Esempio 3: una somma con i primi
Calcola $25^\circ 48' + 30^\circ 27'$.

Si sommano i gradi con i gradi e i primi con i primi, poi $75'$ diventano $60' + 15' = 1^\circ 15'$:

$$
\begin{aligned}
&25^\circ 48' + 30^\circ 27' \\
&= 55^\circ 75' \\
&= 56^\circ 15'
\end{aligned}
$$
```

```ad-warning
I primi non sono decimali
$37^\circ 30'$ è $37$ gradi e mezzo, cioè $37{,}5^\circ$, non $37{,}30^\circ$: un primo è un sessantesimo di grado, non un centesimo. Per lo stesso motivo $55^\circ 75'$ non è un risultato finito, perché i primi vanno da $0$ a $59$.
```

## Angoli complementari e supplementari

Due angoli sono **complementari** se la loro somma è un angolo retto, cioè se le loro misure sommano a $90^\circ$; sono **supplementari** se la loro somma è un angolo piatto, cioè $180^\circ$. Due angoli adiacenti sono sempre supplementari. Alcuni libri chiamano anche esplementari due angoli la cui somma è un angolo giro, $360^\circ$.

Il complementare di un angolo acuto di misura $\alpha$ misura $90^\circ - \alpha$; il supplementare di un angolo convesso di misura $\alpha$ misura $180^\circ - \alpha$. Il complementare di $30^\circ$ è $60^\circ$, il supplementare di $125^\circ$ è $55^\circ$.

```tikz
% nome: angoli-complementari-supplementari
% alt: A sinistra due angoli consecutivi di 30 e 60 gradi che formano un angolo retto, quindi complementari; a destra due angoli adiacenti di 125 e 55 gradi che formano un angolo piatto, quindi supplementari
% svg: angoli-complementari-supplementari-47241e57.svg 262x74
\begin{tikzpicture}
\draw[thick] (1.8,0) -- (0,0) -- (0,1.8);
\draw[thick] (0,0) -- (30:1.9);
\draw[blue!60!black] (0.6,0) arc (0:30:0.6);
\draw[orange!80!black] (30:0.8) arc (30:90:0.8);
\node at (15:1.05) {$30^\circ$};
\node at (62:1.15) {$60^\circ$};
\begin{scope}[shift={(4.8,0)}]
\draw[thick] (-2,0) -- (2,0);
\draw[thick] (0,0) -- (55:1.8);
\fill (0,0) circle (0.06);
\draw[blue!60!black] (0:0.5) arc (0:55:0.5);
\draw[orange!80!black] (55:0.7) arc (55:180:0.7);
\node at (27:0.95) {$55^\circ$};
\node at (125:1.1) {$125^\circ$};
\end{scope}
\end{tikzpicture}
```

```ad-warning
Complementari e supplementari
Complementari fa $90^\circ$, supplementari fa $180^\circ$. Un modo per ricordarlo: la "c" di complementari viene prima della "s" di supplementari nell'alfabeto, come $90$ viene prima di $180$. Un angolo ottuso non ha complementare, perché è già più grande di un angolo retto.
```

```ad-example
Esempio 4: complementare e supplementare con i primi
Trova il complementare e il supplementare di un angolo di $37^\circ 25'$.

Per sottrarre i primi scrivi $90^\circ$ come $89^\circ 60'$:

$$
\begin{aligned}
&90^\circ - 37^\circ 25' \\
&= 89^\circ 60' - 37^\circ 25' \\
&= 52^\circ 35'
\end{aligned}
$$

Allo stesso modo $180^\circ = 179^\circ 60'$:

$$
\begin{aligned}
&180^\circ - 37^\circ 25' \\
&= 179^\circ 60' - 37^\circ 25' \\
&= 142^\circ 35'
\end{aligned}
$$

Controllo: $52^\circ 35' + 37^\circ 25' = 89^\circ 60' = 90^\circ$. Il supplementare supera il complementare di $90^\circ$, come sempre: $142^\circ 35' - 52^\circ 35' = 90^\circ$.
```

```ad-example
Esempio 5: il supplementare è il triplo del complementare
Trova l'angolo acuto il cui supplementare è il triplo del suo complementare.

Chiama $x$ la misura dell'angolo in gradi, con $0 < x < 90$. Il supplementare misura $180 - x$ e il complementare $90 - x$:

$$
\begin{gathered}
180 - x = 3(90 - x) \\
180 - x = 270 - 3x \\
2x = 90 \\
x = 45
\end{gathered}
$$

L'angolo misura $45^\circ$. Controllo: il supplementare è $135^\circ$, il complementare è $45^\circ$, e $135 = 3 \cdot 45$.
```

## Angoli opposti al vertice

Due rette incidenti in un punto $O$ formano quattro angoli convessi. Due di questi angoli sono **opposti al vertice** se i lati dell'uno sono i prolungamenti dei lati dell'altro. Nella figura $\alpha$ e $\beta$ sono opposti al vertice, e lo sono anche i due angoli che restano, sopra e sotto; $\gamma$ è adiacente sia ad $\alpha$ sia a $\beta$.

```tikz
% nome: angoli-opposti-al-vertice
% alt: Due rette che si incontrano nel punto O formano quattro angoli; alfa, a destra, e beta, a sinistra, sono opposti al vertice e segnati con archetti uguali; gamma, in alto, è adiacente a entrambi
% svg: angoli-opposti-al-vertice-3131c302.svg 162x95
\begin{tikzpicture}
\draw[thick] (205:2.3) -- (25:2.3);
\draw[thick] (150:2.3) -- (330:2.3);
\fill (0,0) circle (0.06);
\node[below] at (0,-0.12) {$O$};
\draw[blue!60!black] (330:0.55) arc (-30:25:0.55);
\draw[blue!60!black] (150:0.55) arc (150:205:0.55);
\draw[orange!80!black] (25:0.75) arc (25:150:0.75);
\node at (357.5:0.9) {$\alpha$};
\node at (177.5:0.9) {$\beta$};
\node at (87.5:1.05) {$\gamma$};
\end{tikzpicture}
```

Il teorema degli angoli opposti al vertice dice che due angoli opposti al vertice sono congruenti. Per dimostrarlo si scrivono prima l'ipotesi, cioè quello che si sa, e la tesi, cioè quello che si vuole dimostrare.

Ipotesi: $\alpha$ e $\beta$ sono opposti al vertice.

Tesi: $\alpha \cong \beta$.

Dimostrazione. Chiama $\gamma$ l'angolo che ha un lato in comune con $\alpha$ e l'altro in comune con $\beta$, come nella figura.

1. $\alpha$ e $\gamma$ sono adiacenti, perché hanno un lato in comune e gli altri due lati sono semirette opposte; quindi $\alpha + \gamma$ è un angolo piatto.
2. Per lo stesso motivo anche $\beta$ e $\gamma$ sono adiacenti, e $\beta + \gamma$ è un angolo piatto.
3. Tutti gli angoli piatti sono congruenti, quindi $\alpha + \gamma \cong \beta + \gamma$.
4. Togliendo lo stesso angolo $\gamma$ a due angoli congruenti si ottengono angoli congruenti: $\alpha \cong \beta$.

Con le misure la stessa dimostrazione si scrive in una riga: $\alpha = 180^\circ - \gamma$ e $\beta = 180^\circ - \gamma$, quindi $\alpha = \beta$. Il passo 4 dice una cosa che vale in generale e che servirà spesso: due angoli supplementari di uno stesso angolo sono congruenti, e così due angoli complementari di uno stesso angolo.

```ad-example
Esempio 6: i quattro angoli di due rette incidenti
Due rette incidenti formano un angolo di $65^\circ$. Quanto misurano gli altri tre angoli?

L'angolo opposto al vertice a quello di $65^\circ$ è congruente, quindi misura $65^\circ$. Gli altri due sono adiacenti all'angolo di $65^\circ$, quindi supplementari: misurano $180^\circ - 65^\circ = 115^\circ$ ciascuno, e sono opposti al vertice tra loro.

```tikz
% nome: rette-incidenti-quattro-angoli
% alt: Due rette incidenti formano quattro angoli: due opposti al vertice di 65 gradi e due opposti al vertice di 115 gradi
% svg: rette-incidenti-quattro-angoli-81520baa.svg 171x141
\begin{tikzpicture}
\draw[thick] (-2.2,0) -- (2.2,0);
\draw[thick] (245:2) -- (65:2);
\fill (0,0) circle (0.06);
\draw[blue!60!black] (0.5,0) arc (0:65:0.5);
\draw[blue!60!black] (-0.5,0) arc (180:245:0.5);
\draw[orange!80!black] (65:0.7) arc (65:180:0.7);
\draw[orange!80!black] (245:0.7) arc (245:360:0.7);
\node at (32:0.95) {$65^\circ$};
\node at (212:0.95) {$65^\circ$};
\node at (122:1.15) {$115^\circ$};
\node at (302:1.15) {$115^\circ$};
\end{tikzpicture}
```

La somma dei quattro angoli è $65^\circ + 115^\circ + 65^\circ + 115^\circ = 360^\circ$, un angolo giro.
```

```ad-warning
Opposti al vertice non vuol dire adiacenti
Nella figura dell'esempio l'angolo di $65^\circ$ e quello di $115^\circ$ che gli sta accanto sono adiacenti, quindi supplementari, non congruenti. Congruenti sono solo gli angoli opposti al vertice, quelli che si guardano attraverso il punto $O$.
```

```ad-example
Esempio 7: le bisettrici di due angoli adiacenti
Gli angoli adiacenti $\widehat{AOB}$ e $\widehat{BOC}$ misurano $50^\circ$ e $130^\circ$. Quanto misura l'angolo formato dalle loro bisettrici?

La bisettrice di $\widehat{AOB}$ lo divide in due angoli di $25^\circ$, quella di $\widehat{BOC}$ in due angoli di $65^\circ$. L'angolo tra le bisettrici è formato da una metà del primo e da una metà del secondo:

$$25^\circ + 65^\circ = 90^\circ$$

```tikz
% nome: bisettrici-angoli-adiacenti
% alt: Gli angoli adiacenti AOB di 50 gradi e BOC di 130 gradi con le loro bisettrici tratteggiate, che formano un angolo retto segnato con un quadratino
% svg: bisettrici-angoli-adiacenti-a9500b95.svg 224x106
\begin{tikzpicture}
\draw[thick] (-2.4,0) node[left] {$C$} -- (2.4,0) node[right] {$A$};
\draw[thick] (0,0) -- (50:2.3) node[above right] {$B$};
\draw[dashed, blue!60!black] (0,0) -- (25:2.3);
\draw[dashed, blue!60!black] (0,0) -- (115:2.1);
\fill (0,0) circle (0.06) node[below] {$O$};
\draw (0:1.1) arc (0:50:1.1);
\draw (12.5:1) -- (12.5:1.2);
\draw (37.5:1) -- (37.5:1.2);
\draw (50:1.3) arc (50:180:1.3);
\draw (80.5:1.2) -- (80.5:1.4);
\draw (84.5:1.2) -- (84.5:1.4);
\draw (145.5:1.2) -- (145.5:1.4);
\draw (149.5:1.2) -- (149.5:1.4);
\draw[blue!60!black] (0.317,0.148) -- (0.169,0.465) -- (-0.148,0.317);
\end{tikzpicture}
```

Il risultato non dipende dalle misure: le due metà sommano alla metà di un angolo piatto, cioè a $90^\circ$. Le bisettrici di due angoli adiacenti formano sempre un angolo retto.
```
