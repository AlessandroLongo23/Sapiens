# Trasformazioni geometriche

Far scorrere una piastrella sul pavimento, girare una ruota attorno al suo perno, guardarsi allo specchio, ingrandire una foto: ogni volta una figura va in un'altra posizione, o cambia dimensione, secondo una regola precisa. In geometria queste regole si chiamano trasformazioni. Le più semplici, le isometrie, spostano le figure senza deformarle, e sono i movimenti rigidi con cui la lezione [Enti geometrici, segmenti e angoli](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/enti-geometrici-segmenti-e-angoli) definisce le figure congruenti.

## Trasformazioni del piano

Una **trasformazione geometrica** del piano è una corrispondenza biunivoca tra i punti del piano: a ogni punto $P$ associa un punto $P'$, la sua immagine, e ogni punto del piano è l'immagine di uno e un solo punto. È una [funzione biettiva](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive) che ha il piano come dominio e come codominio, e si scrive $t(P) = P'$. L'immagine di una figura $F$ è la figura $F'$ formata dalle immagini dei suoi punti.

Un punto che ha come immagine se stesso, $t(P) = P$, si chiama **punto unito** della trasformazione. La trasformazione che lascia fermi tutti i punti si chiama identità.

Non tutte le corrispondenze tra punti sono trasformazioni. Quella che manda ogni punto nel piede della sua perpendicolare a una retta fissata non lo è: punti diversi della stessa perpendicolare hanno la stessa immagine, e i punti fuori dalla retta non sono immagine di nessun punto.

## Le isometrie

Una trasformazione è un'**isometria** se conserva le distanze: per ogni coppia di punti $A$ e $B$, le immagini hanno $\overline{A'B'} = \overline{AB}$. Un'isometria manda ogni figura in una figura congruente, e quindi conserva tutto quello che si misura:

- la lunghezza dei segmenti e l'ampiezza degli angoli;
- il parallelismo e la perpendicolarità: rette parallele vanno in rette parallele, rette perpendicolari in rette perpendicolari;
- l'allineamento: una retta va in una retta, e il punto medio di un segmento nel punto medio dell'immagine;
- il perimetro e l'area.

Le isometrie principali sono quattro: traslazioni, rotazioni, simmetrie centrali e simmetrie assiali. Ogni altra isometria del piano si ottiene componendole.

### La traslazione

Un **vettore** $\vec{v}$ è individuato da una direzione, un verso e una lunghezza, che si chiama modulo; si disegna come una freccia. La **traslazione** di vettore $\vec{v}$ sposta ogni punto $P$ nel punto $P'$ tale che il segmento orientato da $P$ a $P'$ abbia la direzione, il verso e il modulo di $\vec{v}$: tutti i punti si muovono della stessa quantità, nella stessa direzione e nello stesso verso.

```tikz
% nome: traslazione-triangolo
% alt: Il triangolo ABC e la sua immagine A'B'C' nella traslazione di vettore v: i segmenti tratteggiati AA', BB' e CC' sono paralleli al vettore, hanno il suo stesso verso e la sua stessa lunghezza
% svg: traslazione-triangolo-b13e4e62.svg 197x123
\begin{tikzpicture}
\fill[blue!12] (0,0) -- (1.6,0.2) -- (0.5,1.2) -- cycle;
\draw[thick] (0,0) -- (1.6,0.2) -- (0.5,1.2) -- cycle;
\fill[orange!25] (2.4,0.9) -- (4,1.1) -- (2.9,2.1) -- cycle;
\draw[thick] (2.4,0.9) -- (4,1.1) -- (2.9,2.1) -- cycle;
\draw[->, gray, dashed] (0,0) -- (2.4,0.9);
\draw[->, gray, dashed] (1.6,0.2) -- (4,1.1);
\draw[->, gray, dashed] (0.5,1.2) -- (2.9,2.1);
\draw[->, thick, blue!60!black] (2.2,-0.55) -- (4.6,0.35);
\node[above left] at (3.4,-0.1) {\small $\vec{v}$};
\node[below left] at (0,0) {$A$};
\node[below] at (1.6,0.2) {$B$};
\node[above] at (0.5,1.2) {$C$};
\node[below] at (2.4,0.9) {$A'$};
\node[right] at (4,1.1) {$B'$};
\node[above] at (2.9,2.1) {$C'$};
\end{tikzpicture}
```

I segmenti $AA'$, $BB'$ e $CC'$ sono paralleli e congruenti, quindi $ABB'A'$ è un parallelogramma (per la condizione dei lati opposti paralleli e congruenti della lezione [Parallelogrammi e trapezi](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi)), e $A'B'$ è parallelo e congruente ad $AB$. Una traslazione manda ogni retta in una retta parallela. Se $\vec{v}$ non è il vettore nullo, la traslazione non ha punti uniti: ogni punto si sposta.

### La rotazione

La **rotazione** di centro $O$ e angolo $\alpha$ manda ogni punto $P$ diverso da $O$ nel punto $P'$ tale che $OP' \cong OP$ e l'angolo $\widehat{POP'}$ misuri $\alpha$, girando in senso antiorario; il centro $O$ va in se stesso. Un angolo negativo indica una rotazione in senso orario.

```tikz
% nome: rotazione-triangolo
% alt: Il triangolo ABC e la sua immagine A'B'C' nella rotazione di centro O e angolo alfa in senso antiorario: OA e OA' sono congruenti e formano l'angolo alfa
% svg: rotazione-triangolo-b7527b24.svg 177x141
\begin{tikzpicture}
\fill[blue!12] (1.6,0.2) -- (2.6,0.5) -- (1.9,1.2) -- cycle;
\draw[thick] (1.6,0.2) -- (2.6,0.5) -- (1.9,1.2) -- cycle;
\fill[orange!25] (0.08,1.61) -- (-0.04,2.65) -- (-0.85,2.08) -- cycle;
\draw[thick] (0.08,1.61) -- (-0.04,2.65) -- (-0.85,2.08) -- cycle;
\draw[dashed] (0,0) -- (1.6,0.2);
\draw[dashed] (0,0) -- (0.08,1.61);
\draw (0.79,0.21) -- (0.81,-0.01);
\draw (-0.07,0.81) -- (0.15,0.8);
\draw[->, thin] (0.45,0.06) arc[start angle=7.13, delta angle=80, radius=0.45];
\node at (0.42,0.45) {\small $\alpha$};
\fill (0,0) circle (0.05);
\node[below left] at (0,0) {$O$};
\node[below] at (1.6,0.2) {$A$};
\node[right] at (2.6,0.5) {$B$};
\node[above] at (1.9,1.2) {$C$};
\node[right] at (0.08,1.61) {$A'$};
\node[above left] at (-0.04,2.65) {$B'$};
\node[left] at (-0.85,2.08) {$C'$};
\end{tikzpicture}
```

Ogni punto si muove su una circonferenza di centro $O$. Il centro è l'unico punto unito, a meno che l'angolo sia $0^\circ$ o $360^\circ$: allora la rotazione è l'identità.

### La simmetria centrale

La **simmetria centrale** di centro $O$ manda ogni punto $P$ nel punto $P'$ tale che $O$ sia il punto medio del segmento $PP'$. Il punto $P'$ si chiama simmetrico di $P$ rispetto a $O$.

```tikz
% nome: simmetria-centrale-triangolo
% alt: Il triangolo ABC e il suo simmetrico A'B'C' rispetto al centro O: O è il punto medio dei segmenti AA', BB' e CC', e il triangolo immagine è capovolto
% svg: simmetria-centrale-triangolo-54c7ca3a.svg 213x146
\begin{tikzpicture}
\fill[blue!12] (0.8,0.3) -- (2.2,0.5) -- (1.2,1.4) -- cycle;
\draw[thick] (0.8,0.3) -- (2.2,0.5) -- (1.2,1.4) -- cycle;
\fill[orange!25] (-0.8,-0.3) -- (-2.2,-0.5) -- (-1.2,-1.4) -- cycle;
\draw[thick] (-0.8,-0.3) -- (-2.2,-0.5) -- (-1.2,-1.4) -- cycle;
\draw[gray, dashed] (0.8,0.3) -- (-0.8,-0.3);
\draw[gray, dashed] (2.2,0.5) -- (-2.2,-0.5);
\draw[gray, dashed] (1.2,1.4) -- (-1.2,-1.4);
\draw (0.36,0.25) -- (0.44,0.05);
\draw (-0.36,-0.25) -- (-0.44,-0.05);
\draw (0.49,0.75) -- (0.66,0.6);
\draw (0.54,0.8) -- (0.71,0.65);
\draw (-0.49,-0.75) -- (-0.66,-0.6);
\draw (-0.54,-0.8) -- (-0.71,-0.65);
\fill (0,0) circle (0.05);
\node[above left] at (0,0) {$O$};
\node[below right] at (0.8,0.3) {$A$};
\node[right] at (2.2,0.5) {$B$};
\node[above] at (1.2,1.4) {$C$};
\node[above left] at (-0.8,-0.3) {$A'$};
\node[left] at (-2.2,-0.5) {$B'$};
\node[below] at (-1.2,-1.4) {$C'$};
\end{tikzpicture}
```

La simmetria centrale è la rotazione di centro $O$ e angolo $180^\circ$: $P$, $O$ e $P'$ stanno sulla stessa retta e $OP' \cong OP$. Il suo unico punto unito è $O$. Manda ogni retta in una retta parallela, e il triangolo immagine è capovolto. Una figura è simmetrica rispetto a un centro se la simmetria centrale la manda in se stessa: è il caso del parallelogramma, che ha per centro il punto in cui si incontrano le diagonali, perché le diagonali si tagliano a metà.

### La simmetria assiale

La **simmetria assiale** di asse $r$ manda ogni punto $P$ che non sta su $r$ nel punto $P'$ tale che $r$ sia l'[asse del segmento](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele) $PP'$: il segmento $PP'$ è perpendicolare a $r$, e $r$ lo taglia nel punto medio. Ogni punto di $r$ va in se stesso.

```tikz
% nome: simmetria-assiale-triangolo
% alt: Il triangolo ABC e il suo simmetrico A'B'C' rispetto alla retta r: r è l'asse dei segmenti AA' e CC', tratteggiati; le frecce circolari mostrano che ABC si percorre in senso antiorario e A'B'C' in senso orario
% svg: simmetria-assiale-triangolo-2ad69cd0.svg 198x112
\begin{tikzpicture}
\draw[thick, blue!60!black] (0,-0.3) -- (0,2.2);
\node[above] at (0,2.2) {\small $r$};
\fill[blue!12] (0.6,0.3) -- (2,0.6) -- (1,1.8) -- cycle;
\draw[thick] (0.6,0.3) -- (2,0.6) -- (1,1.8) -- cycle;
\fill[orange!25] (-0.6,0.3) -- (-2,0.6) -- (-1,1.8) -- cycle;
\draw[thick] (-0.6,0.3) -- (-2,0.6) -- (-1,1.8) -- cycle;
\draw[gray, dashed] (0.6,0.3) -- (-0.6,0.3);
\draw[gray, dashed] (1,1.8) -- (-1,1.8);
\draw[thin] (0.14,1.8) -- (0.14,1.94) -- (0,1.94);
\draw (0.5,1.91) -- (0.5,1.69);
\draw (-0.5,1.69) -- (-0.5,1.91);
\draw[->, thin] (1.2,1.12) arc[start angle=90, delta angle=270, radius=0.22];
\draw[->, thin] (-1.2,1.12) arc[start angle=90, delta angle=-270, radius=0.22];
\node[below] at (0.6,0.3) {$A$};
\node[right] at (2,0.6) {$B$};
\node[above] at (1,1.8) {$C$};
\node[below] at (-0.6,0.3) {$A'$};
\node[left] at (-2,0.6) {$B'$};
\node[above] at (-1,1.8) {$C'$};
\end{tikzpicture}
```

I punti uniti sono tutti e soli i punti dell'asse. È la simmetria dello specchio: le due metà di una farfalla, o di un triangolo isoscele diviso dall'altezza relativa alla base, sono simmetriche rispetto a un asse. Una figura è simmetrica rispetto a un asse se la simmetria assiale la manda in se stessa: il rettangolo che non è un quadrato ha due assi di simmetria, il quadrato quattro, il triangolo equilatero tre.

### Isometrie dirette e inverse

Nella figura della simmetria assiale i vertici $A$, $B$, $C$ si incontrano girando in senso antiorario, le loro immagini $A'$, $B'$, $C'$ in senso orario: la simmetria assiale inverte il verso di percorrenza delle figure. Traslazioni, rotazioni e simmetrie centrali invece lo conservano. Un'isometria che conserva il verso si chiama **diretta**, una che lo inverte si chiama **inversa**. Una figura e la sua immagine in un'isometria diretta si sovrappongono facendole scorrere nel piano; per una simmetria assiale bisogna ribaltarne una, come si gira un foglio.

| Isometria | Si assegnano | Punti uniti | Verso |
|---|---|---|---|
| traslazione | un vettore $\vec{v}$ | nessuno, se $\vec{v}$ non è nullo | diretta |
| rotazione | centro $O$ e angolo $\alpha$ | solo $O$, se non è l'identità | diretta |
| simmetria centrale | centro $O$ | solo $O$ | diretta |
| simmetria assiale | asse $r$ | i punti di $r$ | inversa |

```ad-warning
La simmetria centrale non è una simmetria assiale
Nella simmetria centrale il punto $O$ è il punto medio di $PP'$, e la figura si capovolge ruotando di $180^\circ$; nella simmetria assiale è una retta a essere l'asse di $PP'$, e la figura si ribalta come allo specchio. Il triangolo della simmetria centrale conserva il verso di percorrenza, quello della simmetria assiale lo inverte.
```

## Composizione di isometrie

Applicare una trasformazione e poi un'altra all'immagine è ancora una trasformazione, la composizione delle due, come per la [composizione di funzioni](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/composizione-e-funzione-inversa). Se prima si applica $t_1$ e poi $t_2$, si scrive $t_2 \circ t_1$: il punto $P$ va in $t_2(t_1(P))$. La composizione di due isometrie è un'isometria, perché le distanze restano uguali a ogni passo.

Il caso più importante è quello di due simmetrie assiali con gli assi paralleli. Siano $a$ e $b$ due rette parallele a distanza $d$, $s_a$ e $s_b$ le simmetrie che hanno quegli assi. La composizione $s_b \circ s_a$ è la traslazione di un vettore perpendicolare agli assi, di modulo $2d$, con il verso che va da $a$ verso $b$.

```tikz
% nome: composizione-simmetrie-assi-paralleli
% alt: Il triangolo F, il suo simmetrico F' rispetto alla retta a e il simmetrico F'' di F' rispetto alla retta b, parallela ad a a distanza d: F'' è il traslato di F di un vettore perpendicolare agli assi, lungo 2d, nel verso che va da a verso b
% svg: composizione-simmetrie-assi-paralleli-85ec1f4a.svg 170x148
\begin{tikzpicture}
\draw[thick, blue!60!black] (1,-0.35) -- (1,1.75);
\draw[thick, blue!60!black] (2.6,-0.35) -- (2.6,1.75);
\node[above] at (1,1.75) {\small $a$};
\node[above] at (2.6,1.75) {\small $b$};
\fill[blue!12] (0,0.2) -- (0.7,0.35) -- (0.2,1.1) -- cycle;
\draw[thick] (0,0.2) -- (0.7,0.35) -- (0.2,1.1) -- cycle;
\fill[gray!15] (2,0.2) -- (1.3,0.35) -- (1.8,1.1) -- cycle;
\draw[thin] (2,0.2) -- (1.3,0.35) -- (1.8,1.1) -- cycle;
\fill[blue!12] (3.2,0.2) -- (3.9,0.35) -- (3.4,1.1) -- cycle;
\draw[thick] (3.2,0.2) -- (3.9,0.35) -- (3.4,1.1) -- cycle;
\draw[gray, dashed] (0,0.2) -- (2,0.2);
\draw[gray, dashed] (2,0.2) -- (3.2,0.2);
\draw[<->, thin] (1,-0.6) -- (2.6,-0.6);
\node[below] at (1.8,-0.6) {\small $d$};
\draw[->, thin, orange!70!black] (0,-1.15) -- (3.2,-1.15);
\node[below] at (1.6,-1.15) {\small $2d$};
\draw[gray!60, densely dotted] (0,0.2) -- (0,-1.15);
\draw[gray!60, densely dotted] (3.2,0.2) -- (3.2,-1.15);
\draw[gray!60, densely dotted] (1,-0.35) -- (1,-0.6);
\draw[gray!60, densely dotted] (2.6,-0.35) -- (2.6,-0.6);
\node[left] at (0,0.2) {$A$};
\node[below left] at (2,0.2) {$A'$};
\node[below right] at (3.2,0.2) {$A''$};
\node at (0.3,0.55) {\scriptsize $F$};
\node at (1.7,0.55) {\scriptsize $F'$};
\node at (3.5,0.55) {\scriptsize $F''$};
\end{tikzpicture}
```

Per vederlo si guarda una retta perpendicolare ai due assi come a una retta dei numeri, con lo $0$ sull'asse $a$ e il numero $d$ sull'asse $b$. Un punto $P$ che su quella retta sta nel numero $x$ va, con la simmetria di asse $a$, nel numero $-x$; con la simmetria di asse $b$, che ha il centro in $d$, il numero $-x$ va in $d + (d - (-x)) = x + 2d$. Ogni punto si sposta quindi di $2d$, nella stessa direzione e nello stesso verso: è una traslazione. I punti fuori da quella retta si muovono lungo la loro perpendicolare agli assi, allo stesso modo.

```ad-warning
L'ordine conta
Scambiando l'ordine, $s_a \circ s_b$ è la traslazione di modulo $2d$ nel verso opposto, da $b$ verso $a$. La composizione di trasformazioni, come quella di funzioni, di solito non è commutativa.
```

```ad-note
Assi che si incontrano
Se gli assi $a$ e $b$ si incontrano in un punto $O$ e formano un angolo $\beta$, la composizione delle due simmetrie è la rotazione di centro $O$ e angolo $2\beta$. Con gli assi perpendicolari l'angolo è $180^\circ$, e la composizione è la simmetria centrale di centro $O$.
```

## L'omotetia

L'**omotetia** di centro $O$ e rapporto $k$, con $k$ un numero diverso da zero, manda ogni punto $P$ nel punto $P'$ della retta $OP$ tale che $\overline{OP'} = |k| \cdot \overline{OP}$: dalla stessa parte di $P$ rispetto a $O$ se $k > 0$, dalla parte opposta se $k < 0$. Il centro va in se stesso.

```tikz
% nome: omotetia-rapporto-2
% alt: Il triangolo ABC e la sua immagine A'B'C' nell'omotetia di centro O e rapporto 2: ogni punto immagine sta sulla semiretta che parte da O e passa per il punto, a distanza doppia da O; i lati di A'B'C' sono paralleli a quelli di ABC e lunghi il doppio
% svg: omotetia-rapporto-2-405d6d64.svg 152x101
\begin{tikzpicture}
\draw[gray, dashed] (0,0) -- (2,0.4);
\draw[gray, dashed] (0,0) -- (2.8,1);
\draw[gray, dashed] (0,0) -- (1.8,1.8);
\fill[orange!25] (2,0.4) -- (2.8,1) -- (1.8,1.8) -- cycle;
\draw[thick] (2,0.4) -- (2.8,1) -- (1.8,1.8) -- cycle;
\fill[blue!15] (1,0.2) -- (1.4,0.5) -- (0.9,0.9) -- cycle;
\draw[thick] (1,0.2) -- (1.4,0.5) -- (0.9,0.9) -- cycle;
\fill (0,0) circle (0.05);
\node[left] at (0,0) {$O$};
\node[below] at (1,0.2) {$A$};
\node[right] at (1.4,0.5) {$B$};
\node[above left] at (0.9,0.9) {$C$};
\node[below] at (2,0.4) {$A'$};
\node[right] at (2.8,1) {$B'$};
\node[above] at (1.8,1.8) {$C'$};
\end{tikzpicture}
```

Nell'omotetia di rapporto $2$ ogni punto si allontana da $O$ fino al doppio della distanza, e il triangolo $A'B'C'$ ha i lati paralleli a quelli di $ABC$ e lunghi il doppio. In generale l'omotetia di rapporto $k$:

- manda ogni segmento $AB$ in un segmento $A'B'$ parallelo ad $AB$ (o sulla stessa retta) con $\overline{A'B'} = |k| \cdot \overline{AB}$;
- conserva l'ampiezza degli angoli;
- moltiplica i perimetri per $|k|$ e le aree per $k^2$.

Con $|k| > 1$ la figura si ingrandisce, con $|k| < 1$ si rimpicciolisce. Con $k$ negativo la figura, oltre a cambiare dimensione, si capovolge dall'altra parte del centro.

```tikz
% nome: omotetia-rapporto-negativo
% alt: Il triangolo ABC e la sua immagine A'B'C' nell'omotetia di centro O e rapporto meno un mezzo: i punti immagine stanno dalla parte opposta di O, a metà distanza, e il triangolo immagine è capovolto e grande la metà
% svg: omotetia-rapporto-negativo-25d71901.svg 194x120
\begin{tikzpicture}
\draw[gray, dashed] (-0.7,-0.15) -- (1.4,0.3);
\draw[gray, dashed] (-1.3,-0.25) -- (2.6,0.5);
\draw[gray, dashed] (-0.85,-0.7) -- (1.7,1.4);
\fill[blue!12] (1.4,0.3) -- (2.6,0.5) -- (1.7,1.4) -- cycle;
\draw[thick] (1.4,0.3) -- (2.6,0.5) -- (1.7,1.4) -- cycle;
\fill[orange!25] (-0.7,-0.15) -- (-1.3,-0.25) -- (-0.85,-0.7) -- cycle;
\draw[thick] (-0.7,-0.15) -- (-1.3,-0.25) -- (-0.85,-0.7) -- cycle;
\fill (0,0) circle (0.05);
\node[above left] at (0,0) {$O$};
\node[below] at (1.4,0.3) {$A$};
\node[right] at (2.6,0.5) {$B$};
\node[above] at (1.7,1.4) {$C$};
\node[above] at (-0.7,-0.15) {$A'$};
\node[left] at (-1.3,-0.25) {$B'$};
\node[below] at (-0.85,-0.7) {$C'$};
\end{tikzpicture}
```

L'omotetia non è un'isometria, a meno che $|k| = 1$: con $k = 1$ è l'identità, con $k = -1$ è la simmetria centrale di centro $O$. Manda però ogni figura in una figura simile, con gli angoli congruenti e i lati in proporzione, e il rapporto di similitudine è $|k|$. Per questo è l'esempio più semplice di **similitudine**, una trasformazione che moltiplica tutte le distanze per uno stesso numero positivo: le figure simili sono nella lezione [Similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine).

```ad-warning
L'area non raddoppia
In un'omotetia di rapporto $2$ i lati raddoppiano, ma l'area diventa $2^2 = 4$ volte più grande: un triangolo di area $1$ va in un triangolo di area $4$.
```

## Le trasformazioni nel piano cartesiano

Nel [piano cartesiano](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio) una trasformazione si descrive con le equazioni che danno le coordinate $(x', y')$ dell'immagine a partire dalle coordinate $(x, y)$ del punto.

### Traslazione

Il vettore $\vec{v}(a, b)$ sposta ogni punto di $a$ in orizzontale e di $b$ in verticale. Le equazioni della traslazione sono

$$
\begin{cases}
x' = x + a \\
y' = y + b
\end{cases}
$$

```ad-example
Esempio 1: un triangolo traslato
Trova l'immagine del triangolo di vertici $A(-3, 1)$, $B(-1, 1)$ e $C(-2, 3)$ nella traslazione di vettore $\vec{v}(4, -2)$.

Si aggiunge $4$ all'ascissa e $-2$ all'ordinata di ogni vertice:

$$
\begin{gathered}
A'(-3 + 4,\ 1 - 2) = A'(1, -1) \\
B'(-1 + 4,\ 1 - 2) = B'(3, -1) \\
C'(-2 + 4,\ 3 - 2) = C'(2, 1)
\end{gathered}
$$

```tikz
% nome: traslazione-piano-cartesiano
% alt: Nel piano cartesiano il triangolo di vertici A(-3, 1), B(-1, 1), C(-2, 3) e la sua immagine A'(1, -1), B'(3, -1), C'(2, 1) nella traslazione di vettore v(4, -2), disegnato come freccia da A ad A'
% svg: traslazione-piano-cartesiano-fa52c44a.svg 189x151
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-4,-2) grid (4,4);
\draw[->] (-4.4,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-2.4) -- (0,4.5) node[above] {$y$};
\node[below left] at (0,0) {\scriptsize $O$};
\fill[blue!15] (-3,1) -- (-1,1) -- (-2,3) -- cycle;
\draw[thick] (-3,1) -- (-1,1) -- (-2,3) -- cycle;
\fill[orange!25] (1,-1) -- (3,-1) -- (2,1) -- cycle;
\draw[thick] (1,-1) -- (3,-1) -- (2,1) -- cycle;
\draw[->, thick, blue!60!black] (-3,1) -- (1,-1);
\node[below left] at (-1.8,0.4) {\small $\vec{v}$};
\fill (-3,1) circle (1.8pt) node[above left] {\small $A$};
\fill (-1,1) circle (1.8pt) node[above right] {\small $B$};
\fill (-2,3) circle (1.8pt) node[above] {\small $C$};
\fill (1,-1) circle (1.8pt) node[below] {\small $A'$};
\fill (3,-1) circle (1.8pt) node[below right] {\small $B'$};
\fill (2,1) circle (1.8pt) node[above] {\small $C'$};
\end{tikzpicture}
```
```

### Simmetrie

Le simmetrie rispetto agli assi e all'origine sono già nella lezione sul piano cartesiano; in più c'è la simmetria rispetto alla bisettrice del primo e del terzo quadrante, la retta $y = x$, che scambia le due coordinate.

| Simmetria rispetto a | Equazioni | Immagine di $(3, 1)$ |
|---|---|---|
| asse $x$ | $x' = x$, $y' = -y$ | $(3, -1)$ |
| asse $y$ | $x' = -x$, $y' = y$ | $(-3, 1)$ |
| origine $O$ | $x' = -x$, $y' = -y$ | $(-3, -1)$ |
| bisettrice $y = x$ | $x' = y$, $y' = x$ | $(1, 3)$ |

```tikz
% nome: simmetrie-piano-cartesiano
% alt: Il punto P(3, 1) e i suoi simmetrici: P1(3, -1) rispetto all'asse x, P2(-3, 1) rispetto all'asse y, P3(-3, -1) rispetto all'origine e P4(1, 3) rispetto alla bisettrice y uguale a x, disegnata; ogni simmetrico è unito a P da un segmento tratteggiato
% svg: simmetrie-piano-cartesiano-a2ed03eb.svg 191x157
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-4,-3) grid (4,4);
\draw[->] (-4.4,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-3.4) -- (0,4.5) node[above] {$y$};
\node[below left] at (0,0) {\scriptsize $O$};
\draw[thick, blue!60!black] (-3.5,-3.5) -- (4.3,4.3) node[above right] {\small $y = x$};
\draw[gray, dashed] (3,1) -- (3,-1);
\draw[gray, dashed] (3,1) -- (-3,1);
\draw[gray, dashed] (3,1) -- (-3,-1);
\draw[gray, dashed] (3,1) -- (1,3);
\fill (3,1) circle (1.8pt) node[right] {\small $P$};
\fill (3,-1) circle (1.8pt) node[right] {\small $P_1$};
\fill (-3,1) circle (1.8pt) node[left] {\small $P_2$};
\fill (-3,-1) circle (1.8pt) node[left] {\small $P_3$};
\fill (1,3) circle (1.8pt) node[above left] {\small $P_4$};
\end{tikzpicture}
```

Il punto $P_4(1, 3)$ è il simmetrico di $P(3, 1)$ rispetto alla bisettrice: il segmento $PP_4$ ha il punto medio $(2, 2)$, che sta sulla bisettrice, ed è perpendicolare alla bisettrice.

```ad-warning
Quale coordinata cambia segno
Nella simmetria rispetto all'asse $x$ cambia segno l'ordinata, non l'ascissa: il punto si sposta in verticale, e l'asse $x$ è l'asse del segmento $PP'$. Il nome dell'asse dice quale coordinata resta uguale.
```

### Omotetia di centro l'origine

L'omotetia di centro $O(0, 0)$ e rapporto $k$ moltiplica per $k$ tutte e due le coordinate:

$$
\begin{cases}
x' = kx \\
y' = ky
\end{cases}
$$

```ad-example
Esempio 2: un triangolo ingrandito
Trova l'immagine del triangolo di vertici $A(1, 1)$, $B(3, 1)$ e $C(1, 2)$ nell'omotetia di centro $O$ e rapporto $2$, e confronta le aree.

Le coordinate raddoppiano: $A'(2, 2)$, $B'(6, 2)$, $C'(2, 4)$.

```tikz
% nome: omotetia-piano-cartesiano
% alt: Nel piano cartesiano il triangolo A(1, 1), B(3, 1), C(1, 2) e la sua immagine A'(2, 2), B'(6, 2), C'(2, 4) nell'omotetia di centro l'origine e rapporto 2, con le semirette tratteggiate che partono dall'origine
% svg: omotetia-piano-cartesiano-283628d2.svg 179x140
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (0,0) grid (7,5);
\draw[->] (-0.4,0) -- (7.5,0) node[right] {$x$};
\draw[->] (0,-0.4) -- (0,5.5) node[above] {$y$};
\node[below left] at (0,0) {\scriptsize $O$};
\draw[gray, dashed] (0,0) -- (2,2);
\draw[gray, dashed] (0,0) -- (6,2);
\draw[gray, dashed] (0,0) -- (2,4);
\fill[orange!25] (2,2) -- (6,2) -- (2,4) -- cycle;
\draw[thick] (2,2) -- (6,2) -- (2,4) -- cycle;
\fill[blue!15] (1,1) -- (3,1) -- (1,2) -- cycle;
\draw[thick] (1,1) -- (3,1) -- (1,2) -- cycle;
\fill (1,1) circle (1.8pt) node[below] {\small $A$};
\fill (3,1) circle (1.8pt) node[below] {\small $B$};
\fill (1,2) circle (1.8pt) node[left] {\small $C$};
\fill (2,2) circle (1.8pt) node[below right] {\small $A'$};
\fill (6,2) circle (1.8pt) node[below] {\small $B'$};
\fill (2,4) circle (1.8pt) node[left] {\small $C'$};
\end{tikzpicture}
```

Il triangolo $ABC$ è rettangolo in $A$, con i cateti $\overline{AB} = 2$ e $\overline{AC} = 1$: l'area è $\dfrac{2 \cdot 1}{2} = 1$. Il triangolo $A'B'C'$ ha i cateti $\overline{A'B'} = 4$ e $\overline{A'C'} = 2$, e l'area $\dfrac{4 \cdot 2}{2} = 4 = 2^2 \cdot 1$.
```

### Immagine di una retta

Per trovare l'immagine di una retta si ricavano dalle equazioni della trasformazione le coordinate $x$ e $y$ del punto in funzione di quelle dell'immagine, e si sostituiscono nell'[equazione della retta](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari). Si ottiene un'equazione in $x'$ e $y'$, che vale per tutte le immagini; alla fine si tolgono gli apici.

1. Scrivi le equazioni della trasformazione.
2. Ricava $x$ e $y$ in funzione di $x'$ e $y'$.
3. Sostituiscile nell'equazione della retta.
4. Semplifica e togli gli apici.
5. Controlla con un punto: prendi un punto della retta, trasformalo e verifica che stia sulla retta trovata.

```ad-example
Esempio 3: una retta traslata
Trova l'immagine della retta $r$: $y = 2x + 1$ nella traslazione di vettore $\vec{v}(3, -1)$.

Le equazioni sono $x' = x + 3$ e $y' = y - 1$, quindi $x = x' - 3$ e $y = y' + 1$. Sostituendo nell'equazione di $r$:

$$
\begin{gathered}
y' + 1 = 2(x' - 3) + 1 \\
y' = 2x' - 6
\end{gathered}
$$

Togliendo gli apici, la retta immagine è $r'$: $y = 2x - 6$, parallela a $r$ perché ha lo stesso coefficiente angolare. Controllo: il punto $P(0, 1)$ di $r$ va in $P'(3, 0)$, e infatti $0 = 2 \cdot 3 - 6$.

```tikz
% nome: traslazione-retta
% alt: La retta r di equazione y uguale a 2x più 1 e la sua immagine r', y uguale a 2x meno 6, nella traslazione di vettore (3, -1): i punti P(0, 1) e Q(-1, -1) di r vanno in P'(3, 0) e Q'(2, -2), che stanno su r'; le due rette sono parallele
% svg: traslazione-retta-3504d66f.svg 155x171
\begin{tikzpicture}[scale=0.4]
\draw[gray!25, very thin] (-3,-4) grid (5,5);
\draw[->] (-3.4,0) -- (5.5,0) node[right] {$x$};
\draw[->] (0,-4.4) -- (0,5.5) node[above] {$y$};
\node[below left] at (0,0) {\scriptsize $O$};
\draw[thick, blue!60!black] (-2.35,-3.7) -- (1.85,4.7) node[above] {\small $r$};
\draw[thick, orange!70!black] (1.15,-3.7) -- (4.8,3.6) node[above] {\small $r'$};
\draw[->, gray] (0,1) -- (3,0);
\draw[->, gray] (-1,-1) -- (2,-2);
\fill (0,1) circle (1.8pt) node[above left] {\small $P$};
\fill (-1,-1) circle (1.8pt) node[left] {\small $Q$};
\fill (3,0) circle (1.8pt) node[below right] {\small $P'$};
\fill (2,-2) circle (1.8pt) node[right] {\small $Q'$};
\end{tikzpicture}
```
```

```ad-warning
Sostituire con il segno sbagliato
Nella traslazione di vettore $(3, -1)$ si sostituisce $x = x' - 3$, non $x = x' + 3$: il punto di partenza sta $3$ unità a sinistra della sua immagine. Con i segni sbagliati, $x = x' + 3$ e $y = y' - 1$, si ottiene la retta traslata nel verso opposto, $y = 2x + 8$, e il controllo con un punto lo rivela.
```

```ad-example
Esempio 4: una retta nella simmetria rispetto alla bisettrice
Trova la simmetrica della retta $r$: $y = 2x + 1$ rispetto alla bisettrice $y = x$.

La simmetria scambia le coordinate: $x' = y$ e $y' = x$, quindi $x = y'$ e $y = x'$. Sostituendo:

$$
\begin{gathered}
x' = 2y' + 1 \\
y' = \frac{x' - 1}{2}
\end{gathered}
$$

La retta simmetrica è $r'$: $y = \dfrac{x - 1}{2}$. Controllo: $Q(1, 3)$ sta su $r$ e va in $Q'(3, 1)$, e $\dfrac{3 - 1}{2} = 1$. La retta $r'$ è il grafico della funzione inversa di $y = 2x + 1$: il grafico dell'inversa è sempre il simmetrico rispetto alla bisettrice, come nella lezione [Composizione e funzione inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/composizione-e-funzione-inversa).

```tikz
% nome: simmetria-bisettrice-retta
% alt: La retta r di equazione y uguale a 2x più 1 e la sua simmetrica r' rispetto alla bisettrice y uguale a x, tratteggiata: r' ha equazione y uguale a x meno 1 fratto 2; i punti P(0, 1) e Q(1, 3) di r vanno in P'(1, 0) e Q'(3, 1)
% svg: simmetria-bisettrice-retta-35800c3c.svg 165x155
\begin{tikzpicture}[scale=0.4]
\draw[gray!25, very thin] (-3,-3) grid (5,5);
\draw[->] (-3.4,0) -- (5.5,0) node[right] {$x$};
\draw[->] (0,-3.4) -- (0,5.5) node[above] {$y$};
\node[below left] at (0,0) {\scriptsize $O$};
\draw[gray, dashed] (-2.7,-2.7) -- (4.7,4.7) node[right] {\small $y = x$};
\draw[thick, blue!60!black] (-1.85,-2.7) -- (1.85,4.7) node[above] {\small $r$};
\draw[thick, orange!70!black] (-2.7,-1.85) -- (4.8,1.9) node[right] {\small $r'$};
\draw[gray, densely dotted] (0,1) -- (1,0);
\draw[gray, densely dotted] (1,3) -- (3,1);
\fill (0,1) circle (1.8pt) node[above left] {\small $P$};
\fill (1,3) circle (1.8pt) node[left] {\small $Q$};
\fill (1,0) circle (1.8pt) node[below right] {\small $P'$};
\fill (3,1) circle (1.8pt) node[below right] {\small $Q'$};
\end{tikzpicture}
```
```

```ad-example
Esempio 5: una retta nell'omotetia
Trova l'immagine della retta $r$: $y = x + 1$ nell'omotetia di centro $O$ e rapporto $2$.

Da $x' = 2x$ e $y' = 2y$ si ricava $x = \dfrac{x'}{2}$ e $y = \dfrac{y'}{2}$. Sostituendo e moltiplicando per $2$:

$$
\begin{gathered}
\frac{y'}{2} = \frac{x'}{2} + 1 \\
y' = x' + 2
\end{gathered}
$$

L'immagine è $r'$: $y = x + 2$, parallela a $r$. Controllo: $Q(1, 2)$ va in $Q'(2, 4)$, e $4 = 2 + 2$.

```tikz
% nome: omotetia-retta
% alt: La retta r di equazione y uguale a x più 1 e la sua immagine r', y uguale a x più 2, nell'omotetia di centro l'origine e rapporto 2: P(0, 1) va in P'(0, 2) e Q(1, 2) in Q'(2, 4); le due rette sono parallele
% svg: omotetia-retta-aabbf27d.svg 140x140
\begin{tikzpicture}[scale=0.4]
\draw[gray!25, very thin] (-3,-2) grid (4,5);
\draw[->] (-3.4,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-2.4) -- (0,5.5) node[above] {$y$};
\node[below left] at (0,0) {\scriptsize $O$};
\draw[thick, blue!60!black] (-2.7,-1.7) -- (3.7,4.7) node[right] {\small $r$};
\draw[thick, orange!70!black] (-2.7,-0.7) -- (2.7,4.7) node[above] {\small $r'$};
\draw[gray, dashed] (0,0) -- (2,4);
\fill (0,1) circle (1.8pt) node[right] {\small $P$};
\fill (1,2) circle (1.8pt) node[right] {\small $Q$};
\fill (0,2) circle (1.8pt) node[left] {\small $P'$};
\fill (2,4) circle (1.8pt) node[left] {\small $Q'$};
\end{tikzpicture}
```
```
