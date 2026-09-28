# Poligoni inscritti e circoscritti

Un tavolo quadrato apparecchiato con una tovaglia rotonda, un bullone esagonale dentro la sua chiave, una ruota che tocca i quattro lati di una cassetta: sono poligoni e circonferenze che si toccano nel modo più stretto possibile. Non tutti i poligoni ci riescono. Un triangolo ha sempre una circonferenza che passa per i suoi vertici e una che tocca i suoi lati, un quadrilatero non sempre, e per riconoscerlo bastano gli angoli o i lati.

Qui si usano gli angoli alla circonferenza e i segmenti di tangente della lezione [Circonferenza e cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/circonferenza-e-cerchio), il circocentro e l'incentro della lezione [Punti notevoli del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/punti-notevoli-del-triangolo) e le famiglie di quadrilateri della lezione [Parallelogrammi e trapezi](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi).

## Poligoni inscritti e circoscritti

Un poligono è **inscritto** in una circonferenza se tutti i suoi vertici stanno sulla circonferenza; la circonferenza si dice circoscritta al poligono. Un poligono è **circoscritto** a una circonferenza se tutti i suoi lati sono tangenti alla circonferenza; la circonferenza si dice inscritta nel poligono. Un poligono che ha una circonferenza circoscritta si dice inscrivibile, uno che ha una circonferenza inscritta si dice circoscrivibile.

```tikz
% nome: poligono-inscritto-e-circoscritto
% alt: A sinistra un pentagono inscritto in una circonferenza, con i cinque vertici sulla circonferenza; a destra un quadrilatero circoscritto a una circonferenza, con i quattro lati tangenti alla circonferenza
% svg: poligono-inscritto-e-circoscritto-225804f4.svg 214x105
\begin{tikzpicture}
\fill[blue!8] (0.00,1.10) -- (-1.03,0.38) -- (-0.71,-0.84) -- (0.38,-1.03) -- (1.03,0.38) -- cycle;
\draw[thick] (0.00,1.10) -- (-1.03,0.38) -- (-0.71,-0.84) -- (0.38,-1.03) -- (1.03,0.38) -- cycle;
\draw[orange!80!black] (0.00,0.00) circle (1.10);
\fill[blue!8] (3.98,-1.31) -- (4.46,0.48) -- (2.93,1.37) -- (1.84,-0.53) -- cycle;
\draw[thick] (3.98,-1.31) -- (4.46,0.48) -- (2.93,1.37) -- (1.84,-0.53) -- cycle;
\draw[orange!80!black] (3.30,0.00) circle (1.00);
\fill (0.00,0.00) circle (0.06);
\fill (3.30,0.00) circle (0.06);
\node at (-0.09,-0.23) {$O$};
\node at (3.21,-0.23) {$O$};
\end{tikzpicture}
```

Il centro della circonferenza circoscritta ha la stessa distanza da tutti i vertici, quindi sta sull'asse di ogni lato. Il centro della circonferenza inscritta ha la stessa distanza da tutti i lati, quindi sta sulla bisettrice di ogni angolo. Ne vengono due regole:

- un poligono è inscrivibile se e solo se gli assi dei suoi lati passano tutti per uno stesso punto, che è il centro della circonferenza circoscritta;
- un poligono è circoscrivibile se e solo se le bisettrici dei suoi angoli passano tutte per uno stesso punto, che è il centro della circonferenza inscritta.

```ad-warning
Inscritto e circoscritto
Le due parole si riferiscono a chi sta dentro. Il poligono inscritto sta dentro la circonferenza, con i vertici sul bordo; il poligono circoscritto sta fuori, con i lati che toccano il bordo. Nella stessa frase la circonferenza ha il ruolo opposto: il quadrato inscritto nella circonferenza e la circonferenza circoscritta al quadrato sono la stessa figura.
```

## Il triangolo

Ogni triangolo è inscrivibile e circoscrivibile. I tre assi dei lati si incontrano sempre nel circocentro $O$, che è il centro della circonferenza circoscritta; le tre bisettrici si incontrano sempre nell'incentro $I$, che è il centro della circonferenza inscritta. Le dimostrazioni sono nella lezione [Punti notevoli del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/punti-notevoli-del-triangolo).

```tikz
% nome: triangolo-circonferenza-circoscritta-inscritta
% alt: Triangolo ABC con la circonferenza circoscritta, di centro il circocentro O, che passa per i tre vertici, e la circonferenza inscritta, di centro l'incentro I, che tocca i tre lati
% svg: triangolo-circonferenza-circoscritta-inscritta-4e299a97.svg 192x177
\begin{tikzpicture}
\draw[orange!80!black] (2.00,0.63) circle (2.10);
\fill[blue!8] (0.00,0.00) -- (4.00,0.00) -- (1.30,2.60) -- cycle;
\draw[thick] (0.00,0.00) -- (4.00,0.00) -- (1.30,2.60) -- cycle;
\draw[blue!70!black] (1.58,0.98) circle (0.98);
\fill (2.00,0.63) circle (0.06);
\node at (2.13,0.40) {$O$};
\fill (1.58,0.98) circle (0.06);
\node at (1.35,1.11) {$I$};
\node at (-0.24,-0.14) {$A$};
\node at (4.24,-0.14) {$B$};
\node at (1.25,2.88) {$C$};
\end{tikzpicture}
```

Per tre punti che non stanno sulla stessa retta passa quindi una circonferenza, e una sola: il suo centro deve stare sugli assi di $AB$ e di $BC$, che si incontrano in un solo punto.

```ad-example
Esempio 1: le due circonferenze di un triangolo rettangolo
Il triangolo $ABC$ è rettangolo in $C$, con i cateti $\overline{AC} = 6$ cm e $\overline{BC} = 8$ cm. Quanto misurano i raggi della circonferenza circoscritta e di quella inscritta?

```tikz
% nome: esempio-triangolo-rettangolo-due-circonferenze
% alt: Triangolo ABC rettangolo in C con i cateti lunghi 6 e 8: la circonferenza circoscritta ha il centro O nel punto medio dell'ipotenusa, la circonferenza inscritta ha centro I e i raggi tratteggiati verso i cateti formano con C un quadrato
% svg: esempio-triangolo-rettangolo-due-circonferenze-f4e596c1.svg 176x155
\begin{tikzpicture}
\draw[orange!80!black] (1.60,1.20) circle (2.00);
\fill[blue!8] (0.00,0.00) -- (3.20,0.00) -- (0.00,2.40) -- cycle;
\draw[thick] (0.00,0.00) -- (3.20,0.00) -- (0.00,2.40) -- cycle;
\draw[blue!70!black] (0.80,0.80) circle (0.80);
\draw[dashed] (0.00,0.80) -- (0.80,0.80) -- (0.80,0.00);
\draw[thin] (0.18,0.00) -- (0.18,0.18) -- (0.00,0.18);
\fill (1.60,1.20) circle (0.06);
\node at (1.73,1.43) {$O$};
\fill (0.80,0.80) circle (0.06);
\node at (0.96,0.96) {$I$};
\fill (1.28,1.44) circle (0.06);
\fill (0.80,0.00) circle (0.06);
\fill (0.00,0.80) circle (0.06);
\node at (-0.28,2.40) {$A$};
\node at (3.50,0.00) {$B$};
\node at (-0.20,-0.20) {$C$};
\node[font=\small] at (-0.62,1.20) {$6$};
\node[font=\small] at (1.60,-0.25) {$8$};
\end{tikzpicture}
```

L'ipotenusa, per il teorema di Pitagora, è $\overline{AB} = \sqrt{6^2 + 8^2} = \sqrt{100} = 10$ cm. L'angolo in $C$ è retto, quindi insiste su una semicirconferenza: l'ipotenusa è un diametro della circonferenza circoscritta, e il raggio è

$$R = 10 : 2 = 5 \text{ cm}$$

Per la circonferenza inscritta, di raggio $r$, servono i segmenti di tangente. I raggi che vanno ai punti di contatto sui cateti sono perpendicolari ai cateti, e con l'angolo retto in $C$ formano un quadrato di lato $r$: da $C$ i due segmenti di tangente sono lunghi $r$. Da $A$ e da $B$ i segmenti di tangente sono congruenti a due a due, quindi sull'ipotenusa restano $6 - r$ e $8 - r$:

$$
\begin{gathered}
(6 - r) + (8 - r) = 10 \\
14 - 2r = 10 \\
r = 2 \text{ cm}
\end{gathered}
$$
```

## Quadrilateri inscrivibili

Teorema: un quadrilatero convesso è inscrivibile in una circonferenza se e solo se i suoi angoli opposti sono supplementari.

```tikz
% nome: quadrilatero-inscritto-angoli-opposti
% alt: Quadrilatero ABCD inscritto in una circonferenza di centro O: gli angoli opposti in A e in C insistono sui due archi BD, e i due angoli al centro corrispondenti, segnati in O, formano insieme un angolo giro
% svg: quadrilatero-inscritto-angoli-opposti-842b1a2d.svg 156x150
\begin{tikzpicture}
\fill[blue!8] (-1.50,-0.55) -- (0.55,-1.50) -- (1.50,0.55) -- (-0.80,1.39) -- cycle;
\draw[thick] (-1.50,-0.55) -- (0.55,-1.50) -- (1.50,0.55) -- (-0.80,1.39) -- cycle;
\draw[orange!80!black] (0.00,0.00) circle (1.60);
\draw[dashed] (0.55,-1.50) -- (0.00,0.00) -- (-0.80,1.39);
\draw[thin] (-1.19,-0.70) arc[start angle=-25.00, delta angle=95.00, radius=0.35];
\draw[thin] (1.17,0.67) arc[start angle=160.00, delta angle=85.00, radius=0.35];
\draw[thin] (1.10,0.69) arc[start angle=160.00, delta angle=85.00, radius=0.43];
\draw[thin] (0.10,-0.28) arc[start angle=-70, end angle=120, radius=0.30];
\draw[thin] (-0.15,0.26) arc[start angle=120, end angle=290, radius=0.30];
\draw[thin] (-0.19,0.33) arc[start angle=120, end angle=290, radius=0.38];
\fill (0.00,0.00) circle (0.06);
\node at (0.56,0.26) {$O$};
\node at (-1.77,-0.64) {$A$};
\node at (0.64,-1.77) {$B$};
\node at (1.77,0.64) {$C$};
\node at (-0.94,1.63) {$D$};
\end{tikzpicture}
```

La prima metà si dimostra con gli angoli alla circonferenza.

Ipotesi: il quadrilatero $ABCD$ è inscritto in una circonferenza di centro $O$.

Tesi: $\hat{A} + \hat{C} = 180^\circ$.

Dimostrazione.

1. I punti $B$ e $D$ dividono la circonferenza in due archi: $\hat{A}$ insiste sull'arco $BD$ che contiene $C$, $\hat{C}$ sull'arco $BD$ che contiene $A$.
2. Un angolo alla circonferenza è la metà dell'angolo al centro che insiste sullo stesso arco: $\hat{A}$ è la metà di uno dei due angoli al centro di lati $OB$ e $OD$, $\hat{C}$ è la metà dell'altro.
3. I due angoli al centro insieme formano un angolo giro, quindi la loro somma è $360^\circ$.
4. Allora $\hat{A} + \hat{C} = 360^\circ : 2 = 180^\circ$.

La somma degli angoli di un quadrilatero è $360^\circ$, quindi anche $\hat{B} + \hat{D} = 360^\circ - 180^\circ = 180^\circ$. L'altra metà del teorema, cioè che un quadrilatero con gli angoli opposti supplementari è inscrivibile, non la dimostriamo.

Sposta i vertici lungo la circonferenza: gli angoli cambiano, le due somme no. Poi stacca $D$ dalla circonferenza e portalo dentro o fuori: il quadrilatero non è più inscritto, e le somme smettono di essere $180^\circ$.

```interattivo
% nome: quadrilatero-inscritto
% alt: Quadrilatero ABCD inscritto in una circonferenza di centro O, con i quattro vertici trascinabili lungo la circonferenza; sotto sono scritte le somme degli angoli opposti, A più C e B più D, che restano 180 gradi. Un bottone stacca D dalla circonferenza: trascinandolo dentro o fuori, le due somme diventano diverse da 180 gradi, e tornano 180 quando D torna sulla circonferenza
```

```ad-example
Esempio 2: gli angoli di un quadrilatero inscritto
(a) Il quadrilatero $ABCD$ è inscritto in una circonferenza, con $\hat{A} = 75^\circ$ e $\hat{B} = 100^\circ$. Quanto misurano $\hat{C}$ e $\hat{D}$?

Gli angoli opposti sono supplementari:

$$
\begin{gathered}
\hat{C} = 180^\circ - 75^\circ = 105^\circ \\
\hat{D} = 180^\circ - 100^\circ = 80^\circ
\end{gathered}
$$

Controllo: $75^\circ + 100^\circ + 105^\circ + 80^\circ = 360^\circ$.

(b) Il quadrilatero $ABCD$ ha $\hat{A} = 80^\circ$, $\hat{B} = 95^\circ$, $\hat{C} = 100^\circ$, $\hat{D} = 85^\circ$. È inscrivibile?

$\hat{A} + \hat{C} = 180^\circ$, quindi sì. Basta controllare una coppia: se una coppia di angoli opposti ha somma $180^\circ$, anche l'altra ce l'ha.
```

```ad-warning
Angoli opposti, non consecutivi
Sono supplementari gli angoli opposti, $\hat{A}$ e $\hat{C}$, $\hat{B}$ e $\hat{D}$. Nell'esempio (a) la risposta $\hat{C} = 180^\circ - 100^\circ = 80^\circ$ usa l'angolo consecutivo $\hat{B}$, ed è sbagliata. Gli angoli consecutivi supplementari sono una proprietà dei parallelogrammi.
```

## Quadrilateri circoscrivibili

Teorema: un quadrilatero convesso è circoscrivibile a una circonferenza se e solo se la somma di due lati opposti è congruente alla somma degli altri due.

```tikz
% nome: quadrilatero-circoscritto-segmenti-tangenti
% alt: Quadrilatero ABCD circoscritto a una circonferenza, che tocca i lati nei punti P, Q, R, S: i due segmenti di tangente che partono da ogni vertice sono segnati come congruenti
% svg: quadrilatero-circoscritto-segmenti-tangenti-3b0a6533.svg 142x145
\begin{tikzpicture}
\fill[blue!8] (-1.44,-0.75) -- (0.87,-1.37) -- (1.24,0.72) -- (-0.66,1.41) -- cycle;
\draw[thick] (-1.44,-0.75) -- (0.87,-1.37) -- (1.24,0.72) -- (-0.66,1.41) -- cycle;
\draw[orange!80!black] (0.00,0.00) circle (1.10);
\draw[thin] (-0.83,-0.78) -- (-0.90,-1.03);
\draw[thin] (-1.36,-0.14) -- (-1.12,-0.23);
\draw[thin] (0.30,-1.35) -- (0.36,-1.10);
\draw[thin] (0.23,-1.33) -- (0.29,-1.08);
\draw[thin] (0.84,-0.79) -- (1.10,-0.84);
\draw[thin] (0.86,-0.73) -- (1.11,-0.77);
\draw[thin] (1.30,0.31) -- (1.05,0.35);
\draw[thin] (1.29,0.24) -- (1.04,0.29);
\draw[thin] (1.28,0.17) -- (1.02,0.22);
\draw[thin] (0.83,0.73) -- (0.92,0.97);
\draw[thin] (0.77,0.75) -- (0.85,1.00);
\draw[thin] (0.70,0.78) -- (0.79,1.02);
\draw[thin] (-0.14,1.22) circle (0.07);
\draw[thin] (-0.85,0.89) circle (0.07);
\fill (0.00,0.00) circle (0.06);
\node at (-0.24,-0.09) {$O$};
\fill (-0.28,-1.06) circle (0.06);
\node at (-0.22,-0.81) {$P$};
\fill (1.08,-0.19) circle (0.06);
\node at (0.83,-0.15) {$Q$};
\fill (0.38,1.03) circle (0.06);
\node at (0.29,0.79) {$R$};
\fill (-1.03,0.38) circle (0.06);
\node at (-0.79,0.29) {$S$};
\node at (-1.69,-0.88) {$A$};
\node at (1.03,-1.61) {$B$};
\node at (1.49,0.86) {$C$};
\node at (-0.78,1.66) {$D$};
\end{tikzpicture}
```

La prima metà si dimostra con i segmenti di tangente.

Ipotesi: il quadrilatero $ABCD$ è circoscritto a una circonferenza, che tocca i lati $AB$, $BC$, $CD$, $DA$ nei punti $P$, $Q$, $R$, $S$.

Tesi: $AB + CD \cong BC + DA$.

Dimostrazione.

1. I segmenti di tangente condotti da un punto esterno sono congruenti, quindi $AP \cong AS$, $BP \cong BQ$, $CQ \cong CR$ e $DR \cong DS$.
2. Ogni lato è la somma di due segmenti di tangente: $AB = AP + PB$, $CD = CR + RD$, $BC = BQ + QC$, $DA = DS + SA$.
3. $AB + CD$ è quindi la somma di $AP$, $PB$, $CR$, $RD$, e $BC + DA$ è la somma di $BQ$, $QC$, $DS$, $SA$.
4. Per il passo 1 le due somme sono fatte di segmenti congruenti a due a due, quindi $AB + CD \cong BC + DA$.

Anche qui l'inverso vale, e non lo dimostriamo. Il perimetro di un quadrilatero circoscritto è il doppio della somma di due lati opposti.

```ad-example
Esempio 3: il lato che manca
Il quadrilatero $ABCD$ è circoscritto a una circonferenza, con $\overline{AB} = 9$ cm, $\overline{BC} = 7$ cm, $\overline{CD} = 6$ cm. Quanto misurano il lato $DA$ e il perimetro?

```tikz
% nome: esempio-quadrilatero-circoscritto-lato
% alt: Quadrilatero ABCD circoscritto a una circonferenza, con i lati AB lungo 9, BC lungo 7, CD lungo 6 e il lato DA incognito
% svg: esempio-quadrilatero-circoscritto-lato-2f7caa3f.svg 141x128
\begin{tikzpicture}
\fill[blue!8] (-1.07,-1.20) -- (1.61,-0.90) -- (0.72,1.00) -- (-1.07,1.20) -- cycle;
\draw[thick] (-1.07,-1.20) -- (1.61,-0.90) -- (0.72,1.00) -- (-1.07,1.20) -- cycle;
\draw[orange!80!black] (0.00,0.00) circle (1.07);
\fill (0.00,0.00) circle (0.06);
\node[font=\small] at (0.33,-1.29) {$9$};
\node[font=\small] at (1.41,0.06) {$7$};
\node[font=\small] at (-0.22,1.35) {$6$};
\node[font=\small] at (-1.32,0.00) {$x$};
\node at (-1.26,-1.41) {$A$};
\node at (1.85,-1.04) {$B$};
\node at (0.88,1.23) {$C$};
\node at (-1.26,1.41) {$D$};
\end{tikzpicture}
```

Le somme dei lati opposti sono uguali:

$$
\begin{gathered}
\overline{AB} + \overline{CD} = \overline{BC} + \overline{DA} \\
9 + 6 = 7 + x \\
x = 8 \text{ cm}
\end{gathered}
$$

Il perimetro è $2 \cdot (9 + 6) = 30$ cm.
```

```ad-warning
Lati opposti, non consecutivi
La condizione confronta $AB + CD$ con $BC + DA$. Scrivere $9 + 7 = 6 + x$, con i lati consecutivi, dà $x = 10$ cm, e il quadrilatero con i lati $9$, $7$, $6$, $10$ non è circoscrivibile.
```

## Parallelogrammi e trapezi

I due teoremi dicono subito quali quadrilateri della lezione [Parallelogrammi e trapezi](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi) sono inscrivibili e quali circoscrivibili.

In un parallelogramma gli angoli opposti sono congruenti: sono anche supplementari solo se misurano $90^\circ$ ciascuno. Quindi un parallelogramma è inscrivibile solo se è un rettangolo. I lati opposti sono congruenti, quindi $AB + CD$ è il doppio di $AB$ e $BC + DA$ è il doppio di $BC$: le due somme sono uguali solo se $AB \cong BC$, cioè se tutti i lati sono congruenti. Un parallelogramma è circoscrivibile solo se è un rombo.

```tikz
% nome: rettangolo-inscritto-rombo-circoscritto
% alt: A sinistra un rettangolo inscritto in una circonferenza, che ha il centro nel punto di incontro delle diagonali e le diagonali come diametri; a destra un rombo circoscritto a una circonferenza, che ha il centro nel punto di incontro delle diagonali
% svg: rettangolo-inscritto-rombo-circoscritto-2454d4c8.svg 238x133
\begin{tikzpicture}
\fill[blue!8] (-1.20,-0.75) -- (1.20,-0.75) -- (1.20,0.75) -- (-1.20,0.75) -- cycle;
\draw[thick] (-1.20,-0.75) -- (1.20,-0.75) -- (1.20,0.75) -- (-1.20,0.75) -- cycle;
\draw[orange!80!black] (0.00,0.00) circle (1.42);
\draw[dashed] (-1.20,-0.75) -- (1.20,0.75);
\draw[dashed] (1.20,-0.75) -- (-1.20,0.75);
\fill (0.00,0.00) circle (0.06);
\fill[blue!8] (2.05,0.00) -- (3.40,-0.85) -- (4.75,0.00) -- (3.40,0.85) -- cycle;
\draw[thick] (2.05,0.00) -- (3.40,-0.85) -- (4.75,0.00) -- (3.40,0.85) -- cycle;
\draw[orange!80!black] (3.40,0.00) circle (0.72);
\draw[dashed] (2.05,0.00) -- (4.75,0.00);
\draw[dashed] (3.40,-0.85) -- (3.40,0.85);
\fill (3.40,0.00) circle (0.06);
\node[font=\small] at (0.00,-1.75) {rettangolo};
\node[font=\small] at (3.40,-1.75) {rombo};
\end{tikzpicture}
```

Nel rettangolo il centro della circonferenza circoscritta è il punto di incontro delle diagonali, che sono congruenti e si tagliano a metà: le diagonali sono diametri. Nel rombo il centro della circonferenza inscritta è ancora il punto di incontro delle diagonali, che sono le bisettrici degli angoli. Il quadrato è insieme rettangolo e rombo, quindi è inscrivibile e circoscrivibile, e le due circonferenze hanno lo stesso centro.

Nel trapezio isoscele gli angoli opposti sono supplementari (è una delle proprietà della lezione sui trapezi): ogni trapezio isoscele è inscrivibile. Un trapezio non isoscele non lo è mai, perché nel trapezio gli angoli adiacenti a un lato obliquo sono già supplementari tra loro, e se lo fossero anche gli angoli opposti gli angoli alla base maggiore sarebbero congruenti. Un trapezio, isoscele o no, è circoscrivibile quando la somma delle basi è uguale alla somma dei lati obliqui.

```tikz
% nome: trapezio-isoscele-inscritto
% alt: Trapezio isoscele ABCD, con le basi AB e DC e i lati obliqui AD e BC congruenti, inscritto in una circonferenza di centro O
% svg: trapezio-isoscele-inscritto-07907ed5.svg 149x124
\begin{tikzpicture}
\fill[blue!8] (-1.41,-0.51) -- (1.41,-0.51) -- (0.86,1.23) -- (-0.86,1.23) -- cycle;
\draw[thick] (-1.41,-0.51) -- (1.41,-0.51) -- (0.86,1.23) -- (-0.86,1.23) -- cycle;
\draw[orange!80!black] (0.00,0.00) circle (1.50);
\draw[thin] (-1.26,0.40) -- (-1.01,0.32);
\draw[thin] (1.01,0.32) -- (1.26,0.40);
\fill (0.00,0.00) circle (0.06);
\node at (0.00,-0.26) {$O$};
\node at (-1.67,-0.61) {$A$};
\node at (1.67,-0.61) {$B$};
\node at (1.02,1.46) {$C$};
\node at (-1.02,1.46) {$D$};
\end{tikzpicture}
```

| Quadrilatero | Inscrivibile | Circoscrivibile |
|---|---|---|
| parallelogramma qualsiasi | no | no |
| rettangolo | sempre | solo se è un quadrato |
| rombo | solo se è un quadrato | sempre |
| quadrato | sempre | sempre |
| trapezio isoscele | sempre | se basi e lati obliqui hanno la stessa somma |

```ad-example
Esempio 4: il trapezio isoscele circoscritto
Un trapezio isoscele è circoscritto a una circonferenza, e le basi misurano $18$ cm e $8$ cm. Quanto misurano i lati obliqui e il raggio della circonferenza?

```tikz
% nome: esempio-trapezio-isoscele-circoscritto
% alt: Trapezio isoscele ABCD circoscritto a una circonferenza di centro O, con la base maggiore AB lunga 18 e la base minore DC lunga 8; l'altezza DH è tratteggiata
% svg: esempio-trapezio-isoscele-circoscritto-02dad471.svg 146x112
\begin{tikzpicture}
\fill[blue!8] (-1.44,-0.96) -- (1.44,-0.96) -- (0.64,0.96) -- (-0.64,0.96) -- cycle;
\draw[thick] (-1.44,-0.96) -- (1.44,-0.96) -- (0.64,0.96) -- (-0.64,0.96) -- cycle;
\draw[orange!80!black] (0.00,0.00) circle (0.96);
\draw[dashed] (-0.64,0.96) -- (-0.64,-0.96);
\draw[thin] (-0.48,-0.96) -- (-0.48,-0.80) -- (-0.64,-0.80);
\draw[thin] (-1.16,0.05) -- (-0.92,-0.05);
\draw[thin] (0.92,-0.05) -- (1.16,0.05);
\fill (0.00,0.00) circle (0.06);
\node at (0.25,0.00) {$O$};
\node at (-1.64,-1.16) {$A$};
\node at (1.64,-1.16) {$B$};
\node at (0.84,1.16) {$C$};
\node at (-0.84,1.16) {$D$};
\node at (-0.64,-1.24) {$H$};
\node[font=\small] at (0.00,1.18) {$8$};
\node[font=\small] at (0.00,-1.21) {$18$};
\end{tikzpicture}
```

La somma dei lati obliqui è uguale alla somma delle basi, $18 + 8 = 26$ cm, e i lati obliqui sono congruenti:

$$\overline{AD} = \overline{BC} = 26 : 2 = 13 \text{ cm}$$

Traccia l'altezza $DH$. Nel trapezio isoscele $\overline{AH}$ è metà della differenza delle basi, $(18 - 8) : 2 = 5$ cm, e nel triangolo rettangolo $AHD$

$$
\begin{aligned}
\overline{DH} &= \sqrt{13^2 - 5^2} \\
&= \sqrt{144} = 12 \text{ cm}
\end{aligned}
$$

La circonferenza è tangente alle due basi, che sono parallele, quindi il suo diametro è la distanza tra le basi, cioè l'altezza: il raggio è $12 : 2 = 6$ cm.
```

## Poligoni regolari

Un poligono è regolare se ha tutti i lati congruenti e tutti gli angoli congruenti. Ogni poligono regolare è inscrivibile e circoscrivibile, e le due circonferenze hanno lo stesso centro, che si chiama centro del poligono.

```tikz
% nome: poligono-regolare-bisettrici-centro
% alt: Pentagono regolare ABCDE: le bisettrici degli angoli in B e in C si incontrano nel punto O, e il segmento OD è tratteggiato; gli angoli divisi a metà hanno un archetto e i lati BC e CD sono segnati come congruenti
% svg: poligono-regolare-bisettrici-centro-4710501d.svg 158x150
\begin{tikzpicture}
\fill[blue!8] (0.00,1.60) -- (-1.52,0.49) -- (-0.94,-1.29) -- (0.94,-1.29) -- (1.52,0.49) -- cycle;
\draw[thick] (0.00,1.60) -- (-1.52,0.49) -- (-0.94,-1.29) -- (0.94,-1.29) -- (1.52,0.49) -- cycle;
\draw[blue!70!black] (-1.52,0.49) -- (0.00,0.00);
\draw[blue!70!black] (-0.94,-1.29) -- (0.00,0.00);
\draw[dashed] (0.00,0.00) -- (0.94,-1.29);
\draw[thin] (-1.40,0.11) arc[start angle=-72.00, delta angle=54.00, radius=0.40];
\draw[thin] (-1.14,0.37) arc[start angle=-18.00, delta angle=54.00, radius=0.40];
\draw[thin] (-0.71,-0.97) arc[start angle=54.00, delta angle=54.00, radius=0.40];
\draw[thin] (-0.54,-1.29) arc[start angle=-0.00, delta angle=54.00, radius=0.40];
\draw[thin] (-1.11,-0.36) -- (-1.35,-0.44);
\draw[thin] (0.00,-1.16) -- (0.00,-1.42);
\fill (0.00,0.00) circle (0.06);
\node at (0.24,0.14) {$O$};
\node at (0.00,1.88) {$A$};
\node at (-1.79,0.58) {$B$};
\node at (-1.11,-1.52) {$C$};
\node at (1.11,-1.52) {$D$};
\node at (1.79,0.58) {$E$};
\end{tikzpicture}
```

Il perché, con il pentagono regolare $ABCDE$ della figura (per gli altri poligoni regolari il ragionamento è lo stesso):

1. Le bisettrici degli angoli $\hat{B}$ e $\hat{C}$ si incontrano in un punto $O$. Gli angoli $\hat{B}$ e $\hat{C}$ sono congruenti, quindi lo sono anche le loro metà, $\widehat{OBC} \cong \widehat{OCB}$, e il triangolo $OBC$ è isoscele: $OB \cong OC$.
2. I triangoli $OBC$ e $OCD$ hanno $OC$ in comune, $BC \cong CD$ perché il pentagono è regolare e $\widehat{OCB} \cong \widehat{OCD}$ perché $OC$ è la bisettrice. Per il primo criterio sono congruenti: $OD \cong OB$, e $\widehat{ODC} \cong \widehat{OBC}$, che è metà di un angolo del pentagono. Quindi anche $OD$ è una bisettrice.
3. Ripetendo il passo 2 con i triangoli $OCD$ e $ODE$, poi $ODE$ e $OEA$, si trova che $O$ ha la stessa distanza da tutti i vertici e sta sulle bisettrici di tutti gli angoli.

$O$ è equidistante dai vertici, quindi è il centro della circonferenza circoscritta; sta su tutte le bisettrici, quindi è anche il centro della circonferenza inscritta.

Il **raggio** di un poligono regolare è il raggio della circonferenza circoscritta, cioè la distanza del centro da un vertice. L'**apotema** è il raggio della circonferenza inscritta, cioè la distanza del centro da un lato: il segmento $OH$ che la misura è perpendicolare al lato e cade nel suo punto medio, perché il triangolo $OCD$ è isoscele.

```tikz
% nome: poligono-regolare-raggio-apotema
% alt: Pentagono regolare ABCDE con la circonferenza circoscritta e quella inscritta, tutte e due di centro O: il raggio r va dal centro al vertice D, l'apotema a va dal centro al punto medio H del lato CD ed è perpendicolare al lato
% svg: poligono-regolare-raggio-apotema-3f4d6381.svg 158x152
\begin{tikzpicture}
\draw[orange!80!black] (0.00,0.00) circle (1.60);
\fill[blue!8] (0.00,1.60) -- (-1.52,0.49) -- (-0.94,-1.29) -- (0.94,-1.29) -- (1.52,0.49) -- cycle;
\draw[thick] (0.00,1.60) -- (-1.52,0.49) -- (-0.94,-1.29) -- (0.94,-1.29) -- (1.52,0.49) -- cycle;
\draw[blue!70!black] (0.00,0.00) circle (1.29);
\draw (0.00,0.00) -- (0.94,-1.29);
\draw[blue!70!black, thick] (0.00,0.00) -- (0.00,-1.29);
\draw[thin] (0.16,-1.29) -- (0.16,-1.13) -- (0.00,-1.13);
\draw[thin] (-0.47,-1.16) -- (-0.47,-1.42);
\draw[thin] (0.47,-1.16) -- (0.47,-1.42);
\fill (0.00,0.00) circle (0.06);
\node at (0.00,0.26) {$O$};
\fill (0.00,-1.29) circle (0.06);
\node at (0.00,-1.57) {$H$};
\node[font=\small] at (0.63,-0.53) {$r$};
\node[font=\small] at (-0.20,-0.65) {$a$};
\node at (0.00,1.88) {$A$};
\node at (-1.79,0.58) {$B$};
\node at (-1.11,-1.52) {$C$};
\node at (1.11,-1.52) {$D$};
\node at (1.79,0.58) {$E$};
\end{tikzpicture}
```

I raggi dividono un poligono regolare di $n$ lati in $n$ triangoli isosceli congruenti, e l'angolo al centro di ognuno misura $360^\circ : n$. In un ottagono regolare è $360^\circ : 8 = 45^\circ$, in un pentagono regolare $360^\circ : 5 = 72^\circ$.

```ad-warning
Lati congruenti non vuol dire regolare
Il rombo ha i quattro lati congruenti ma non è inscrivibile, se non è un quadrato; il rettangolo ha i quattro angoli congruenti ma non è circoscrivibile, se non è un quadrato. Per essere regolare un poligono deve avere congruenti sia i lati sia gli angoli.
```

### L'esagono regolare

Nell'esagono regolare il lato è congruente al raggio. L'angolo al centro di ognuno dei sei triangoli misura $360^\circ : 6 = 60^\circ$. Il triangolo $OAB$ è isoscele, perché $OA$ e $OB$ sono raggi, quindi gli angoli alla base sono congruenti e misurano ciascuno $(180^\circ - 60^\circ) : 2 = 60^\circ$: il triangolo ha tre angoli di $60^\circ$ ed è equilatero, e $AB \cong OA$.

```tikz
% nome: esagono-regolare-triangoli-equilateri
% alt: Esagono regolare inscritto in una circonferenza di centro O, diviso dai raggi in sei triangoli; il triangolo OAB ha l'angolo in O di 60 gradi ed è equilatero, quindi il lato AB è lungo quanto il raggio
% svg: esagono-regolare-triangoli-equilateri-1515a5cd.svg 145x134
\begin{tikzpicture}
\draw[orange!80!black] (0.00,0.00) circle (1.60);
\fill[blue!8] (1.60,0.00) -- (0.80,1.39) -- (-0.80,1.39) -- (-1.60,0.00) -- (-0.80,-1.39) -- (0.80,-1.39) -- cycle;
\fill[blue!20] (0.00,0.00) -- (1.60,0.00) -- (0.80,1.39) -- cycle;
\draw[thick] (1.60,0.00) -- (0.80,1.39) -- (-0.80,1.39) -- (-1.60,0.00) -- (-0.80,-1.39) -- (0.80,-1.39) -- cycle;
\draw (0.00,0.00) -- (1.60,0.00);
\draw (0.00,0.00) -- (0.80,1.39);
\draw (0.00,0.00) -- (-0.80,1.39);
\draw (0.00,0.00) -- (-1.60,0.00);
\draw (0.00,0.00) -- (-0.80,-1.39);
\draw (0.00,0.00) -- (0.80,-1.39);
\draw[thin] (0.35,0.00) arc[start angle=0.00, delta angle=60.00, radius=0.35];
\node[font=\scriptsize] at (0.54,0.31) {$60^\circ$};
\fill (0.00,0.00) circle (0.06);
\node at (-0.24,-0.14) {$O$};
\node at (1.88,0.00) {$A$};
\node at (0.94,1.63) {$B$};
\end{tikzpicture}
```

Per inscrivere un esagono regolare in una circonferenza si riporta sei volte il raggio sulla circonferenza con il compasso, senza cambiarne l'apertura.

```ad-example
Esempio 5: raggio, lato e apotema dell'esagono
(a) Un esagono regolare è inscritto in una circonferenza di raggio $5$ cm. Quanto misura il perimetro?

Il lato è uguale al raggio, $5$ cm, quindi il perimetro è $6 \cdot 5 = 30$ cm.

(b) Un esagono regolare ha il lato di $6$ cm. Quanto misura l'apotema?

```tikz
% nome: esempio-apotema-esagono-regolare
% alt: Esagono regolare di centro O e lato 6: il triangolo OAB è equilatero, e l'apotema OH va dal centro al punto medio H del lato AB, con AH lungo 3 e OA lungo 6
% svg: esempio-apotema-esagono-regolare-06fe5476.svg 118x121
\begin{tikzpicture}
\fill[blue!8] (1.50,0.00) -- (0.75,1.30) -- (-0.75,1.30) -- (-1.50,0.00) -- (-0.75,-1.30) -- (0.75,-1.30) -- cycle;
\draw[thick] (1.50,0.00) -- (0.75,1.30) -- (-0.75,1.30) -- (-1.50,0.00) -- (-0.75,-1.30) -- (0.75,-1.30) -- cycle;
\draw (0.00,0.00) -- (-0.75,-1.30);
\draw (0.00,0.00) -- (0.75,-1.30);
\draw[blue!70!black, thick] (0.00,0.00) -- (0.00,-1.30);
\draw[thin] (0.15,-1.30) -- (0.15,-1.15) -- (0.00,-1.15);
\fill (0.00,0.00) circle (0.06);
\node at (0.00,0.26) {$O$};
\fill (0.00,-1.30) circle (0.06);
\node at (0.00,-1.58) {$H$};
\node at (-0.89,-1.54) {$A$};
\node at (0.89,-1.54) {$B$};
\node[font=\small] at (-0.38,-1.52) {$3$};
\node[font=\small] at (-0.60,-0.65) {$6$};
\node[font=\small] at (0.18,-0.65) {$a$};
\end{tikzpicture}
```

Il triangolo $OAB$ è equilatero con il lato di $6$ cm, e l'apotema $OH$ è la sua altezza, che cade nel punto medio di $AB$: $\overline{AH} = 3$ cm. Nel triangolo rettangolo $OHA$

$$
\begin{aligned}
a &= \sqrt{6^2 - 3^2} = \sqrt{27} \\
&= 3\sqrt{3} \text{ cm}
\end{aligned}
$$

cioè circa $5{,}20$ cm.
```

```ad-warning
Raggio e apotema scambiati
Il raggio arriva a un vertice, l'apotema al punto medio di un lato, e l'apotema è sempre più corto del raggio. Nell'esagono di lato $6$ cm il raggio è $6$ cm e l'apotema $3\sqrt{3} \approx 5{,}20$ cm, non il contrario.
```

```ad-example
Esempio 6: il quadrato inscritto
Un quadrato è inscritto in una circonferenza di raggio $5$ cm. Quanto misurano il lato e l'apotema?

```tikz
% nome: esempio-quadrato-inscritto
% alt: Quadrato ABCD inscritto in una circonferenza di centro O e raggio 5: la diagonale BD è un diametro, e l'apotema OH va dal centro al punto medio del lato AB
% svg: esempio-quadrato-inscritto-8a14c719.svg 118x120
\begin{tikzpicture}
\draw[orange!80!black] (0.00,0.00) circle (1.50);
\fill[blue!8] (1.06,1.06) -- (-1.06,1.06) -- (-1.06,-1.06) -- (1.06,-1.06) -- cycle;
\draw[thick] (1.06,1.06) -- (-1.06,1.06) -- (-1.06,-1.06) -- (1.06,-1.06) -- cycle;
\draw[dashed] (-1.06,1.06) -- (1.06,-1.06);
\draw[blue!70!black, thick] (0.00,0.00) -- (0.00,-1.06);
\draw[thin] (0.15,-1.06) -- (0.15,-0.91) -- (0.00,-0.91);
\fill (0.00,0.00) circle (0.06);
\node at (-0.26,0.00) {$O$};
\fill (0.00,-1.06) circle (0.06);
\node at (0.00,-1.34) {$H$};
\node at (1.26,1.26) {$C$};
\node at (-1.26,1.26) {$D$};
\node at (-1.26,-1.26) {$A$};
\node at (1.26,-1.26) {$B$};
\node[font=\small] at (-0.39,0.67) {$5$};
\end{tikzpicture}
```

Le diagonali del quadrato sono diametri, quindi sono lunghe $10$ cm. Una diagonale divide il quadrato in due triangoli rettangoli isosceli con l'ipotenusa di $10$ cm, e chiamato $\ell$ il lato, per il teorema di Pitagora

$$
\begin{gathered}
\ell^2 + \ell^2 = 10^2 \\
\ell^2 = 50 \\
\ell = \sqrt{50} = 5\sqrt{2} \text{ cm}
\end{gathered}
$$

cioè circa $7{,}07$ cm. L'apotema va dal centro al punto medio di un lato, ed è metà del lato: $a = \dfrac{5\sqrt{2}}{2}$ cm, circa $3{,}54$ cm.
```

Nel triangolo equilatero, che è il poligono regolare con tre lati, il raggio è il doppio dell'apotema: il centro è anche il baricentro, e divide l'altezza in due parti, una doppia dell'altra (lo trovi nella lezione [Punti notevoli del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/punti-notevoli-del-triangolo)).
