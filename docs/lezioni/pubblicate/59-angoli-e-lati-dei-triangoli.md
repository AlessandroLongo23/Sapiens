# Triangoli e criteri di congruenza

Il triangolo è il poligono con meno lati, e quasi tutto quello che si dimostra sulle altre figure del piano passa dai triangoli: per sapere se due lati di un parallelogramma sono congruenti, o se un punto è equidistante da due rette, si cercano due triangoli congruenti. Per riconoscerli non serve confrontare tutti i lati e tutti gli angoli: bastano tre elementi scelti bene, e sono i tre criteri di congruenza.

Segmenti, angoli, punto medio, bisettrice e angoli opposti al vertice sono nella lezione [Enti geometrici, segmenti e angoli](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/enti-geometrici-segmenti-e-angoli).

## Il triangolo e i suoi elementi

Presi tre punti $A$, $B$, $C$ non allineati, il **triangolo** $ABC$ è la parte di piano delimitata dai tre segmenti $AB$, $BC$ e $CA$. I tre punti sono i **vertici**, i tre segmenti sono i **lati**, e gli angoli $\widehat{CAB}$, $\widehat{ABC}$ e $\widehat{BCA}$ sono gli **angoli interni**, che si indicano anche con la lettera del vertice: $\hat{A}$, $\hat{B}$, $\hat{C}$. Il triangolo si indica con $ABC$ o con $\triangle ABC$.

Ogni lato ha un vertice che non gli appartiene: il lato $BC$ si dice **opposto** al vertice $A$ e all'angolo $\hat{A}$. Gli altri due angoli, $\hat{B}$ e $\hat{C}$, hanno il vertice sul lato $BC$ e si dicono **adiacenti** a $BC$. L'angolo $\hat{A}$, infine, è **compreso** tra i lati $AB$ e $AC$, che sono i suoi lati.

```tikz
% nome: triangolo-lato-opposto-angolo
% alt: Triangolo ABC con il lato BC e l'angolo in A evidenziati: il lato BC è opposto al vertice A e all'angolo in A
% svg: triangolo-lato-opposto-angolo-a77ca43a.svg 194x134
\begin{tikzpicture}
\fill[blue!15] (0,0) -- ++(0:0.5) arc (0:62.53:0.5) -- cycle;
\draw (0.5,0) arc (0:62.53:0.5);
\draw (0,0) -- (4,0) -- (1.3,2.5) -- cycle;
\draw[blue!45, line width=1.6pt] (4,0) -- (1.3,2.5);
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[above] at (1.3,2.5) {$C$};
\node[right] at (0.62,0.42) {$\hat{A}$};
\end{tikzpicture}
```

## Classificazione dei triangoli

Rispetto ai lati, un triangolo è:

- **scaleno** se ha i tre lati di lunghezze diverse;
- **isoscele** se ha almeno due lati congruenti;
- **equilatero** se ha i tre lati congruenti.

```tikz
% nome: triangoli-scaleno-isoscele-equilatero
% alt: Tre triangoli: uno scaleno con i lati tutti diversi, uno isoscele con due lati segnati come congruenti e uno equilatero con tre lati segnati come congruenti
% svg: triangoli-scaleno-isoscele-equilatero-1c5d0fe0.svg 292x106
\begin{tikzpicture}
\draw (0,0) -- (2.3,0) -- (1.7,1.5) -- cycle;
\draw (3,0) -- (4.8,0) -- (3.9,2.1) -- cycle;
\draw (5.5,0) -- (7.6,0) -- (6.55,1.82) -- cycle;
\draw (3.33,1.1) -- (3.57,1);
\draw (4.23,1) -- (4.47,1.1);
\draw (6.55,0.13) -- (6.55,-0.13);
\draw (6.96,0.84) -- (7.19,0.97);
\draw (6.14,0.84) -- (5.91,0.97);
\node at (1.15,-0.35) {scaleno};
\node at (3.9,-0.35) {isoscele};
\node at (6.55,-0.35) {equilatero};
\end{tikzpicture}
```

Nella figura i trattini sui lati dicono quali sono congruenti: lati con lo stesso numero di trattini sono congruenti. Con la definizione "almeno due lati" un triangolo equilatero è anche isoscele. Nel triangolo isoscele il terzo lato si chiama **base**, i due lati congruenti **lati obliqui**, l'angolo opposto alla base **angolo al vertice** e i due angoli adiacenti alla base **angoli alla base**.

Rispetto agli angoli, un triangolo è:

- **acutangolo** se ha i tre angoli acuti;
- **rettangolo** se ha un angolo retto; i lati dell'angolo retto si chiamano **cateti**, il lato opposto **ipotenusa**;
- **ottusangolo** se ha un angolo ottuso.

```tikz
% nome: triangoli-acutangolo-rettangolo-ottusangolo
% alt: Tre triangoli: uno acutangolo con tre angoli acuti, uno rettangolo con il segno dell'angolo retto e uno ottusangolo con l'angolo ottuso evidenziato
% svg: triangoli-acutangolo-rettangolo-ottusangolo-eec061dc.svg 299x95
\begin{tikzpicture}
\fill[orange!30] (5.9,0) -- ++(0:0.35) arc (0:114.44:0.35) -- cycle;
\draw (6.25,0) arc (0:114.44:0.35);
\draw (0,0) -- (2.2,0) -- (0.9,1.8) -- cycle;
\draw (2.8,0) -- (4.9,0) -- (2.8,1.6) -- cycle;
\draw (5.9,0) -- (7.8,0) -- (5.4,1.1) -- cycle;
\draw (3.02,0) -- (3.02,0.22) -- (2.8,0.22);
\node at (1.1,-0.35) {acutangolo};
\node at (3.85,-0.35) {rettangolo};
\node at (6.7,-0.35) {ottusangolo};
\end{tikzpicture}
```

Il quadratino nel triangolo rettangolo è il segno dell'angolo retto. Un triangolo non può avere due angoli retti, né un angolo retto e uno ottuso: lo vedrai con la somma degli angoli interni, alla fine della lezione.

## Figure congruenti

Due figure sono **congruenti** se si possono sovrapporre punto per punto con un movimento rigido, cioè uno spostamento che non cambia né la forma né le dimensioni: traslare, ruotare, ribaltare. Si scrive $F \cong G$ e si legge "$F$ è congruente a $G$". Per due segmenti essere congruenti vuol dire avere la stessa lunghezza, per due angoli avere la stessa ampiezza.

La parola "uguale" in geometria si riserva a figure che sono proprio la stessa figura; due triangoli disegnati in posti diversi, anche identici, sono congruenti. Per le misure invece si usa l'uguale: $AB \cong CD$ equivale a $\overline{AB} = \overline{CD}$, dove $\overline{AB}$ è la lunghezza di $AB$.

La congruenza è una [relazione di equivalenza](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/relazioni-di-equivalenza-e-d-ordine): ogni figura è congruente a se stessa (proprietà riflessiva), se $F \cong G$ allora $G \cong F$ (simmetrica), e se $F \cong G$ e $G \cong H$ allora $F \cong H$ (transitiva). Nelle dimostrazioni la proprietà transitiva si usa spesso, per passare da un segmento a un altro attraverso un terzo.

Due triangoli $ABC$ e $A'B'C'$ sono congruenti quando si sovrappongono con $A$ su $A'$, $B$ su $B'$ e $C$ su $C'$. Allora hanno ordinatamente congruenti i tre lati e i tre angoli:

$$
\begin{gathered}
AB \cong A'B', \quad BC \cong B'C', \\
CA \cong C'A', \quad \hat{A} \cong \hat{A}', \\
\hat{B} \cong \hat{B}', \quad \hat{C} \cong \hat{C}'
\end{gathered}
$$

I lati e gli angoli che si sovrappongono si dicono **corrispondenti** (o omologhi). In due triangoli congruenti a lati congruenti si oppongono angoli congruenti, e ad angoli congruenti si oppongono lati congruenti.

```ad-warning
L'ordine dei vertici
Scrivendo $\triangle ABC \cong \triangle DEF$ si dice che $A$ corrisponde a $D$, $B$ a $E$ e $C$ a $F$: quindi $AB \cong DE$ e $\hat{C} \cong \hat{F}$. Se la corrispondenza giusta è un'altra, per esempio $A$ con $E$, bisogna scrivere i vertici in un altro ordine, $\triangle ABC \cong \triangle EDF$. I lati corrispondenti si trovano sempre così: sono quelli opposti ad angoli congruenti.
```

## I tre criteri di congruenza

Un triangolo ha sei elementi, tre lati e tre angoli. I **criteri di congruenza** dicono che per concludere che due triangoli sono congruenti ne bastano tre, se sono quelli giusti; da lì seguono le congruenze degli altri tre.

### Primo criterio: due lati e l'angolo compreso

Se due triangoli hanno ordinatamente congruenti due lati e l'angolo compreso tra essi, allora sono congruenti.

```tikz
% nome: primo-criterio-congruenza-triangoli
% alt: Due triangoli ABC e A'B'C' con AB congruente ad A'B', AC congruente ad A'C' e congruenti gli angoli in A e in A', compresi tra quei lati
% svg: primo-criterio-congruenza-triangoli-7f2081b9.svg 285x109
\begin{tikzpicture}
\fill[orange!30] (0,0) -- ++(0:0.4) arc (0:63.43:0.4) -- cycle;
\draw (0.4,0) arc (0:63.43:0.4);
\draw (0,0) -- (2.6,0) -- (0.9,1.8) -- cycle;
\draw (1.3,0.13) -- (1.3,-0.13);
\draw (0.32,0.93) -- (0.55,0.81);
\draw (0.35,0.99) -- (0.58,0.87);
\node[below left] at (0,0) {$A$};
\node[below right] at (2.6,0) {$B$};
\node[above] at (0.9,1.8) {$C$};
\fill[orange!30] (3.7,0) -- ++(0:0.4) arc (0:63.43:0.4) -- cycle;
\draw (4.1,0) arc (0:63.43:0.4);
\draw (3.7,0) -- (6.3,0) -- (4.6,1.8) -- cycle;
\draw (5,0.13) -- (5,-0.13);
\draw (4.02,0.93) -- (4.25,0.81);
\draw (4.05,0.99) -- (4.28,0.87);
\node[below left] at (3.7,0) {$A'$};
\node[below right] at (6.3,0) {$B'$};
\node[above] at (4.6,1.8) {$C'$};
\end{tikzpicture}
```

Nella figura $AB \cong A'B'$, $AC \cong A'C'$ e $\hat{A} \cong \hat{A}'$; quindi $\triangle ABC \cong \triangle A'B'C'$, e in particolare $BC \cong B'C'$, $\hat{B} \cong \hat{B}'$ e $\hat{C} \cong \hat{C}'$.

### Secondo criterio: un lato e i due angoli adiacenti

Se due triangoli hanno ordinatamente congruenti un lato e i due angoli adiacenti a esso, allora sono congruenti.

```tikz
% nome: secondo-criterio-congruenza-triangoli
% alt: Due triangoli ABC e A'B'C' con AB congruente ad A'B' e congruenti gli angoli adiacenti a quei lati: l'angolo in A con quello in A', l'angolo in B con quello in B'
% svg: secondo-criterio-congruenza-triangoli-8f60185e.svg 285x109
\begin{tikzpicture}
\fill[orange!30] (0,0) -- ++(0:0.4) arc (0:63.43:0.4) -- cycle;
\draw (0.4,0) arc (0:63.43:0.4);
\fill[orange!30] (2.6,0) -- ++(133.36:0.4) arc (133.36:180:0.4) -- cycle;
\draw (2.33,0.29) arc (133.36:180:0.4);
\draw (2.37,0.25) arc (133.36:180:0.34);
\draw (0,0) -- (2.6,0) -- (0.9,1.8) -- cycle;
\draw (1.3,0.13) -- (1.3,-0.13);
\node[below left] at (0,0) {$A$};
\node[below right] at (2.6,0) {$B$};
\node[above] at (0.9,1.8) {$C$};
\fill[orange!30] (3.7,0) -- ++(0:0.4) arc (0:63.43:0.4) -- cycle;
\draw (4.1,0) arc (0:63.43:0.4);
\fill[orange!30] (6.3,0) -- ++(133.36:0.4) arc (133.36:180:0.4) -- cycle;
\draw (6.03,0.29) arc (133.36:180:0.4);
\draw (6.07,0.25) arc (133.36:180:0.34);
\draw (3.7,0) -- (6.3,0) -- (4.6,1.8) -- cycle;
\draw (5,0.13) -- (5,-0.13);
\node[below left] at (3.7,0) {$A'$};
\node[below right] at (6.3,0) {$B'$};
\node[above] at (4.6,1.8) {$C'$};
\end{tikzpicture}
```

Qui $AB \cong A'B'$, $\hat{A} \cong \hat{A}'$ e $\hat{B} \cong \hat{B}'$: gli angoli segnati sono quelli con il vertice sul lato $AB$.

### Terzo criterio: i tre lati

Se due triangoli hanno ordinatamente congruenti i tre lati, allora sono congruenti.

```tikz
% nome: terzo-criterio-congruenza-triangoli
% alt: Due triangoli ABC e A'B'C' con i tre lati ordinatamente congruenti, segnati con uno, due e tre trattini
% svg: terzo-criterio-congruenza-triangoli-4b316568.svg 285x109
\begin{tikzpicture}
\draw (0,0) -- (2.6,0) -- (0.9,1.8) -- cycle;
\draw (1.3,0.13) -- (1.3,-0.13);
\draw (0.32,0.93) -- (0.55,0.81);
\draw (0.35,0.99) -- (0.58,0.87);
\draw (1.7,0.76) -- (1.89,0.94);
\draw (1.66,0.81) -- (1.84,0.99);
\draw (1.61,0.86) -- (1.8,1.04);
\node[below left] at (0,0) {$A$};
\node[below right] at (2.6,0) {$B$};
\node[above] at (0.9,1.8) {$C$};
\draw (3.7,0) -- (6.3,0) -- (4.6,1.8) -- cycle;
\draw (5,0.13) -- (5,-0.13);
\draw (4.02,0.93) -- (4.25,0.81);
\draw (4.05,0.99) -- (4.28,0.87);
\draw (5.4,0.76) -- (5.59,0.94);
\draw (5.36,0.81) -- (5.54,0.99);
\draw (5.31,0.86) -- (5.5,1.04);
\node[below left] at (3.7,0) {$A'$};
\node[below right] at (6.3,0) {$B'$};
\node[above] at (4.6,1.8) {$C'$};
\end{tikzpicture}
```

Con il terzo criterio si ricavano gli angoli dai lati: se $AB \cong A'B'$, $BC \cong B'C'$ e $CA \cong C'A'$, anche gli angoli sono congruenti, $\hat{A} \cong \hat{A}'$ perché sono opposti ai lati congruenti $BC$ e $B'C'$, e così gli altri due.

```ad-note
Postulato o teorema
Molti libri prendono il primo criterio come postulato, cioè lo accettano senza dimostrarlo, e da lui dimostrano il secondo e il terzo. Altri lo giustificano con il movimento rigido che porta un triangolo sull'altro. Per risolvere gli esercizi non cambia niente: i tre criteri si usano tutti allo stesso modo.
```

```ad-warning
Due lati e un angolo non compreso non bastano
Nel primo criterio l'angolo deve essere quello tra i due lati. I triangoli $ABC$ e $ABD$ della figura hanno in comune il lato $AB$ e l'angolo $\hat{A}$, e hanno $BC \cong BD$, eppure non sono congruenti: $AD$ è più lungo di $AC$. L'angolo $\hat{A}$ non è compreso tra $AB$ e $BC$.

```tikz
% nome: due-lati-e-angolo-non-compreso
% alt: Due triangoli ABC e ABD con il lato AB e l'angolo in A in comune e i lati BC e BD congruenti: i due triangoli sono diversi, perché AD è più lungo di AC
% svg: due-lati-e-angolo-non-compreso-f84ab081.svg 163x115
\begin{tikzpicture}
\fill[orange!30] (0,0) -- ++(0:0.55) arc (0:30:0.55) -- cycle;
\draw (0.55,0) arc (0:30:0.55);
\draw (0,0) -- (3.2,0);
\draw (0,0) -- (3.44,1.99);
\draw (3.2,0) -- (1.36,0.79);
\draw (3.2,0) -- (3.44,1.99);
\draw (2.23,0.27) -- (2.33,0.51);
\draw (3.19,1.01) -- (3.45,0.98);
\node[below left] at (0,0) {$A$};
\node[below right] at (3.2,0) {$B$};
\node[above left] at (1.36,0.79) {$C$};
\node[above] at (3.44,1.99) {$D$};
\end{tikzpicture}
```
```

```ad-warning
Tre angoli non bastano
Due triangoli equilateri, uno con il lato di $2$ cm e uno con il lato di $5$ cm, hanno i tre angoli congruenti ma non sono congruenti: hanno la stessa forma e dimensioni diverse. Nei criteri c'è sempre almeno un lato.
```

## Come si scrive una dimostrazione

Un **teorema** è un'affermazione che si dimostra, nella forma "se succede questo, allora succede quest'altro". Quello che si sa, la parte dopo "se", è l'**ipotesi**; quello che si deve dimostrare, la parte dopo "allora", è la **tesi**. La **dimostrazione** è la catena di passaggi che porta dall'ipotesi alla tesi, e ogni passaggio ha una giustificazione: l'ipotesi, una definizione, un teorema già dimostrato, un criterio.

1. Disegna la figura e segna con trattini e archetti i segmenti e gli angoli che l'ipotesi dice congruenti.
2. Scrivi l'ipotesi e la tesi con i simboli.
3. Cerca due triangoli che contengono gli elementi della tesi, uno per triangolo.
4. Elenca, numerandoli, tre elementi congruenti dei due triangoli, ognuno con il suo perché.
5. Applica il criterio adatto e ricava dalla congruenza dei triangoli quella che chiede la tesi.

Dalla figura si ricavano i nomi, non le proprietà: un segmento che nel disegno sembra lungo quanto un altro non è congruente finché non lo dice l'ipotesi o un passaggio della dimostrazione.

```ad-example
Esempio 1: segmenti che si tagliano a metà (primo criterio)
I segmenti $AB$ e $CD$ si incontrano nel punto $O$, che è il punto medio di tutti e due. Dimostra che $AC \cong BD$.

```tikz
% nome: esempio-segmenti-stesso-punto-medio
% alt: Due segmenti AB e CD che si tagliano nel loro punto medio comune O, con i segmenti AC e BD che chiudono i triangoli AOC e BOD; gli angoli opposti al vertice in O sono segnati
% svg: esempio-segmenti-stesso-punto-medio-3a5990f0.svg 194x138
\begin{tikzpicture}
\fill[orange!30] (2,1) -- ++(139.09:0.4) arc (139.09:206.57:0.4) -- cycle;
\draw (1.7,1.26) arc (139.09:206.57:0.4);
\fill[orange!30] (2,1) -- ++(-40.91:0.4) arc (-40.91:26.57:0.4) -- cycle;
\draw (2.3,0.74) arc (-40.91:26.57:0.4);
\draw (0,0) -- (4,2);
\draw (0.5,2.3) -- (3.5,-0.3);
\draw (0,0) -- (0.5,2.3);
\draw (4,2) -- (3.5,-0.3);
\draw (0.94,0.62) -- (1.06,0.38);
\draw (2.94,1.62) -- (3.06,1.38);
\draw (1.31,1.77) -- (1.14,1.57);
\draw (1.36,1.73) -- (1.19,1.53);
\draw (2.81,0.47) -- (2.64,0.27);
\draw (2.86,0.43) -- (2.69,0.23);
\node[left] at (0,0) {$A$};
\node[right] at (4,2) {$B$};
\node[above] at (0.5,2.3) {$C$};
\node[below] at (3.5,-0.3) {$D$};
\node[below=3pt] at (2,1) {$O$};
\end{tikzpicture}
```

Ipotesi: $AO \cong OB$, $CO \cong OD$.

Tesi: $AC \cong BD$.

Dimostrazione. $AC$ è un lato del triangolo $AOC$, $BD$ del triangolo $BOD$. I due triangoli hanno:

1. $AO \cong OB$, per ipotesi;
2. $CO \cong OD$, per ipotesi;
3. $\widehat{AOC} \cong \widehat{BOD}$, perché sono angoli opposti al vertice.

L'angolo in $O$ è compreso tra i due lati, quindi per il primo criterio $\triangle AOC \cong \triangle BOD$. In particolare $AC \cong BD$, perché sono opposti agli angoli congruenti in $O$.
```

```ad-example
Esempio 2: un lato e due angoli (secondo criterio)
$M$ è il punto medio del segmento $AB$. Da $A$ e da $B$, da parti opposte rispetto ad $AB$, partono due semirette che formano con $AB$ angoli congruenti; una retta per $M$ le taglia in $C$ e in $D$. Dimostra che $M$ è il punto medio di $CD$.

```tikz
% nome: esempio-secondo-criterio-punto-medio
% alt: Segmento AB con punto medio M; da A parte una semiretta verso l'alto fino a C e da B una verso il basso fino a D, che formano con AB angoli congruenti; il segmento CD passa per M
% svg: esempio-secondo-criterio-punto-medio-be9632d2.svg 194x161
\begin{tikzpicture}
\fill[orange!30] (0,0) -- ++(0:0.45) arc (0:53.13:0.45) -- cycle;
\draw (0.45,0) arc (0:53.13:0.45);
\fill[orange!30] (4,0) -- ++(180:0.45) arc (180:233.13:0.45) -- cycle;
\draw (3.55,0) arc (180:233.13:0.45);
\fill[blue!15] (2,0) -- ++(116.57:0.35) arc (116.57:180:0.35) -- cycle;
\draw (1.84,0.31) arc (116.57:180:0.35);
\draw (1.87,0.26) arc (116.57:180:0.29);
\fill[blue!15] (2,0) -- ++(-63.43:0.35) arc (-63.43:0:0.35) -- cycle;
\draw (2.16,-0.31) arc (-63.43:0:0.35);
\draw (2.13,-0.26) arc (-63.43:0:0.29);
\draw (0,0) -- (4,0);
\draw (0,0) -- (1.2,1.6);
\draw (4,0) -- (2.8,-1.6);
\draw (1.2,1.6) -- (2.8,-1.6);
\draw (1,0.13) -- (1,-0.13);
\draw (3,0.13) -- (3,-0.13);
\node[left] at (0,0) {$A$};
\node[right] at (4,0) {$B$};
\node[above] at (1.2,1.6) {$C$};
\node[below] at (2.8,-1.6) {$D$};
\node[below left] at (2,0) {$M$};
\end{tikzpicture}
```

Ipotesi: $AM \cong MB$, $\widehat{MAC} \cong \widehat{MBD}$.

Tesi: $CM \cong MD$.

Dimostrazione. Confronta i triangoli $AMC$ e $BMD$. Hanno:

1. $AM \cong MB$, per ipotesi;
2. $\widehat{MAC} \cong \widehat{MBD}$, per ipotesi;
3. $\widehat{AMC} \cong \widehat{BMD}$, perché sono angoli opposti al vertice.

I due angoli di ciascun triangolo sono adiacenti al lato $AM$ e al lato $MB$, quindi per il secondo criterio $\triangle AMC \cong \triangle BMD$. In particolare $CM \cong MD$, perché sono opposti agli angoli congruenti in $A$ e in $B$: $M$ è il punto medio di $CD$.
```

```ad-example
Esempio 3: tre lati (terzo criterio)
I triangoli $ABC$ e $ABD$ hanno il lato $AB$ in comune e stanno da parti opposte rispetto ad $AB$; inoltre $AC \cong AD$ e $BC \cong BD$. Dimostra che $AB$ è la bisettrice dell'angolo $\widehat{CAD}$.

```tikz
% nome: esempio-terzo-criterio-aquilone
% alt: Due triangoli ABC e ABD con il lato AB in comune, da parti opposte di AB, con AC congruente ad AD e BC congruente a BD
% svg: esempio-terzo-criterio-aquilone-998a20b2.svg 194x153
\begin{tikzpicture}
\draw (0,0) -- (1.2,1.5) -- (4,0) -- (1.2,-1.5) -- cycle;
\draw (0,0) -- (4,0);
\draw (0.5,0.83) -- (0.7,0.67);
\draw (0.7,-0.67) -- (0.5,-0.83);
\draw (2.57,0.62) -- (2.69,0.85);
\draw (2.51,0.65) -- (2.63,0.88);
\draw (2.69,-0.85) -- (2.57,-0.62);
\draw (2.63,-0.88) -- (2.51,-0.65);
\node[left] at (0,0) {$A$};
\node[right] at (4,0) {$B$};
\node[above] at (1.2,1.5) {$C$};
\node[below] at (1.2,-1.5) {$D$};
\end{tikzpicture}
```

Ipotesi: $AC \cong AD$, $BC \cong BD$.

Tesi: $\widehat{CAB} \cong \widehat{DAB}$.

Dimostrazione. I triangoli $ABC$ e $ABD$ hanno:

1. $AC \cong AD$, per ipotesi;
2. $BC \cong BD$, per ipotesi;
3. $AB$ in comune.

Per il terzo criterio $\triangle ABC \cong \triangle ABD$. In particolare $\widehat{CAB} \cong \widehat{DAB}$, perché sono opposti ai lati congruenti $BC$ e $BD$. I due angoli dividono $\widehat{CAD}$ in due parti congruenti, quindi $AB$ ne è la bisettrice.
```

```ad-warning
Usare la tesi come se fosse vera
Nell'esempio 3 non si può scrivere al passo 3 "$\widehat{CAB} \cong \widehat{DAB}$" perché "si vede" o perché è quello che si vuole trovare: sarebbe usare la tesi per dimostrare la tesi. Ogni passaggio numerato deve venire dall'ipotesi, da una definizione o da un teorema già dimostrato.
```

## Il triangolo isoscele

Il primo teorema che si dimostra con i criteri riguarda gli angoli alla base del triangolo isoscele.

Teorema: in un triangolo isoscele gli angoli alla base sono congruenti.

```tikz
% nome: teorema-triangolo-isoscele
% alt: Triangolo isoscele ABC con AB congruente ad AC; la bisettrice dell'angolo in A arriva in D sulla base BC e divide il triangolo in due triangoli congruenti; gli angoli alla base in B e in C sono segnati come congruenti
% svg: teorema-triangolo-isoscele-96a9ace3.svg 164x145
\begin{tikzpicture}
\fill[orange!30] (1.6,2.8) -- ++(-119.74:0.8) arc (-119.74:-90:0.8) -- cycle;
\draw (1.2,2.11) arc (-119.74:-90:0.8);
\draw (1.42,2.12) -- (1.37,1.93);
\fill[orange!30] (1.6,2.8) -- ++(-90:0.8) arc (-90:-60.26:0.8) -- cycle;
\draw (1.6,2) arc (-90:-60.26:0.8);
\draw (1.78,2.12) -- (1.83,1.93);
\fill[blue!15] (0,0) -- ++(0:0.4) arc (0:60.26:0.4) -- cycle;
\draw (0.4,0) arc (0:60.26:0.4);
\draw (0.34,0) arc (0:60.26:0.34);
\fill[blue!15] (3.2,0) -- ++(119.74:0.4) arc (119.74:180:0.4) -- cycle;
\draw (3,0.35) arc (119.74:180:0.4);
\draw (3.03,0.3) arc (119.74:180:0.34);
\draw (1.6,2.8) -- (0,0) -- (3.2,0) -- cycle;
\draw[dashed] (1.6,2.8) -- (1.6,0);
\draw (0.91,1.34) -- (0.69,1.46);
\draw (2.51,1.46) -- (2.29,1.34);
\node[above] at (1.6,2.8) {$A$};
\node[below left] at (0,0) {$B$};
\node[below right] at (3.2,0) {$C$};
\node[below] at (1.6,0) {$D$};
\end{tikzpicture}
```

Ipotesi: $AB \cong AC$.

Tesi: $\hat{B} \cong \hat{C}$.

Dimostrazione. Traccia la bisettrice dell'angolo $\hat{A}$, che incontra la base $BC$ in un punto $D$. I triangoli $ABD$ e $ACD$ hanno:

1. $AB \cong AC$, per ipotesi;
2. $\widehat{BAD} \cong \widehat{CAD}$, perché $AD$ è la bisettrice di $\hat{A}$;
3. $AD$ in comune.

L'angolo in $A$ è compreso tra i lati $AB$ e $AD$ nel primo triangolo e tra $AC$ e $AD$ nel secondo, quindi per il primo criterio $\triangle ABD \cong \triangle ACD$. In particolare $\hat{B} \cong \hat{C}$, perché sono opposti al lato comune $AD$.

Vale anche il teorema inverso: se un triangolo ha due angoli congruenti, allora è isoscele, e i lati congruenti sono quelli opposti ai due angoli. Qui la bisettrice non aiuta: darebbe due angoli e un lato che non è compreso tra loro, e questo non è uno dei tre criteri. I libri lo dimostrano in un altro modo.

Dai due teoremi segue che un triangolo è equilatero se e solo se ha i tre angoli congruenti: applicando il teorema a ogni coppia di lati si trova che tutti gli angoli sono congruenti, e viceversa.

```ad-example
Esempio 4: due triangoli sovrapposti
Nel triangolo isoscele $ABC$ di base $BC$ prendi un punto $D$ sul lato $AB$ e un punto $E$ sul lato $AC$, con $AD \cong AE$. Dimostra che $BE \cong CD$.

```tikz
% nome: esempio-triangoli-sovrapposti
% alt: Triangolo isoscele ABC con base BC; D su AB ed E su AC con AD congruente ad AE; i segmenti BE e CD si incrociano dentro il triangolo
% svg: esempio-triangoli-sovrapposti-a7990433.svg 164x153
\begin{tikzpicture}
\fill[orange!30] (1.6,3) -- ++(-118.07:0.45) arc (-118.07:-61.93:0.45) -- cycle;
\draw (1.39,2.6) arc (-118.07:-61.93:0.45);
\draw (1.6,3) -- (0,0) -- (3.2,0) -- cycle;
\draw[blue!60!black, thick] (0,0) -- (2.32,1.65);
\draw[blue!60!black, thick] (3.2,0) -- (0.88,1.65);
\draw (1.37,2.29) -- (1.14,2.42);
\draw (1.34,2.23) -- (1.11,2.36);
\draw (2.06,2.42) -- (1.83,2.29);
\draw (2.09,2.36) -- (1.86,2.23);
\draw (0.55,0.76) -- (0.33,0.89);
\draw (2.87,0.89) -- (2.65,0.76);
\node[above] at (1.6,3) {$A$};
\node[below left] at (0,0) {$B$};
\node[below right] at (3.2,0) {$C$};
\node[left] at (0.88,1.65) {$D$};
\node[right] at (2.32,1.65) {$E$};
\end{tikzpicture}
```

Ipotesi: $AB \cong AC$, $AD \cong AE$.

Tesi: $BE \cong CD$.

Dimostrazione. $BE$ è un lato del triangolo $ABE$, $CD$ del triangolo $ACD$. I due triangoli si sovrappongono in parte e hanno:

1. $AB \cong AC$, per ipotesi;
2. $AE \cong AD$, per ipotesi;
3. $\hat{A}$ in comune.

L'angolo $\hat{A}$ è compreso tra $AB$ e $AE$ in un triangolo e tra $AC$ e $AD$ nell'altro, quindi per il primo criterio $\triangle ABE \cong \triangle ACD$. In particolare $BE \cong CD$, perché sono opposti all'angolo comune $\hat{A}$.
```

```ad-tip
Triangoli che si sovrappongono
Quando i triangoli da confrontare hanno una parte in comune, ripassa i loro lati con due colori diversi o ridisegnali separati a fianco della figura. Gli elementi in comune, come l'angolo $\hat{A}$ dell'esempio 4, contano come elementi congruenti.
```

```ad-example
Esempio 5: prolungare la base
Nel triangolo isoscele $ABC$ di base $BC$ prolunga la base oltre $B$ fino a un punto $D$ e oltre $C$ fino a un punto $E$, con $BD \cong CE$. Dimostra che il triangolo $ADE$ è isoscele.

```tikz
% nome: esempio-prolungamenti-base-isoscele
% alt: Triangolo isoscele ABC con base BC; la base è prolungata oltre B fino a D e oltre C fino a E, con BD congruente a CE; i segmenti AD e AE formano il triangolo ADE
% svg: esempio-prolungamenti-base-isoscele-fefd7e38.svg 218x130
\begin{tikzpicture}
\fill[orange!30] (1,0) -- ++(67.38:0.35) arc (67.38:180:0.35) -- cycle;
\draw (1.13,0.32) arc (67.38:180:0.35);
\fill[orange!30] (3,0) -- ++(0:0.35) arc (0:112.62:0.35) -- cycle;
\draw (3.35,0) arc (0:112.62:0.35);
\draw (-0.3,0) -- (4.3,0);
\draw (2,2.4) -- (1,0);
\draw (2,2.4) -- (3,0);
\draw (2,2.4) -- (-0.3,0);
\draw (2,2.4) -- (4.3,0);
\draw (1.62,1.15) -- (1.38,1.25);
\draw (2.62,1.25) -- (2.38,1.15);
\draw (0.32,0.13) -- (0.32,-0.13);
\draw (0.39,0.13) -- (0.39,-0.13);
\draw (3.61,0.13) -- (3.61,-0.13);
\draw (3.69,0.13) -- (3.69,-0.13);
\node[above] at (2,2.4) {$A$};
\node[below] at (1,0) {$B$};
\node[below] at (3,0) {$C$};
\node[below left] at (-0.3,0) {$D$};
\node[below right] at (4.3,0) {$E$};
\end{tikzpicture}
```

Ipotesi: $AB \cong AC$, $BD \cong CE$.

Tesi: $AD \cong AE$.

Dimostrazione. $AD$ è un lato del triangolo $ABD$, $AE$ del triangolo $ACE$. L'angolo che serve non è dato dall'ipotesi e va ricavato:

1. $\hat{B} \cong \hat{C}$ nel triangolo $ABC$, perché sono angoli alla base di un triangolo isoscele;
2. $\widehat{ABD}$ è il supplementare di $\hat{B}$, e $\widehat{ACE}$ è il supplementare di $\hat{C}$, perché $D$, $B$, $C$, $E$ stanno sulla stessa retta;
3. $\widehat{ABD} \cong \widehat{ACE}$, perché supplementari di angoli congruenti sono congruenti.

Ora i triangoli $ABD$ e $ACE$ hanno $AB \cong AC$ per ipotesi, $BD \cong CE$ per ipotesi e $\widehat{ABD} \cong \widehat{ACE}$ per il passo 3, che è l'angolo compreso tra quei lati. Per il primo criterio $\triangle ABD \cong \triangle ACE$, e in particolare $AD \cong AE$: il triangolo $ADE$ è isoscele.
```

## Disuguaglianze triangolari

Con tre bastoncini non si costruisce sempre un triangolo: se uno è troppo lungo, gli altri due non riescono a chiuderlo. La regola è la **disuguaglianza triangolare**: in ogni triangolo ciascun lato è minore della somma degli altri due. Se $a$, $b$, $c$ sono le lunghezze dei lati di un triangolo, valgono tutte e tre:

$$
\begin{gathered}
a < b + c \\
b < a + c \\
c < a + b
\end{gathered}
$$

Ne segue che ciascun lato è anche maggiore della differenza degli altri due: da $b < a + c$ si ricava $a > b - c$.

```tikz
% nome: disuguaglianza-triangolare-lati-3-4-8
% alt: Segmento AB lungo 8; da A parte un segmento lungo 3 e da B uno lungo 4; gli archi tratteggiati mostrano tutte le posizioni dei loro estremi e non si incontrano, quindi il triangolo non si chiude
% svg: disuguaglianza-triangolare-lati-3-4-8-bde623b4.svg 178x101
\begin{tikzpicture}
\draw[dashed, gray] (1.5,0) arc (0:100:1.5);
\draw[dashed, gray] (2,0) arc (180:80:2);
\draw[thick] (0,0) -- (4,0);
\draw[thick, blue!60!black] (0,0) -- (0.86,1.23);
\draw[thick, blue!60!black] (4,0) -- (3,1.73);
\node[below] at (0,0) {$A$};
\node[below] at (4,0) {$B$};
\node at (2,-0.3) {$8$};
\node[left] at (0.3,0.85) {$3$};
\node[right] at (3.35,1.1) {$4$};
\end{tikzpicture}
```

Nella figura il lato $AB$ è lungo $8$; il segmento lungo $3$ che parte da $A$ e quello lungo $4$ che parte da $B$ possono girare, ma i loro estremi restano sui due archi tratteggiati, che non si incontrano, perché $3 + 4 = 7$ è minore di $8$.

```ad-tip
Il controllo veloce
Per sapere se tre lunghezze sono i lati di un triangolo non servono tre disuguaglianze: si controlla solo che la più lunga sia minore della somma delle altre due, perché le altre due disuguaglianze sono vere di sicuro.
```

```ad-example
Esempio 6: esiste il triangolo
Stabilisci se esiste un triangolo con i lati lunghi $5$ cm, $7$ cm e $12$ cm, e uno con i lati lunghi $6$ cm, $8$ cm e $10$ cm.

Nel primo caso il lato più lungo è $12$ e $5 + 7 = 12$: il lato non è minore della somma, ma uguale. I tre segmenti si possono solo mettere uno dopo l'altro sulla stessa retta, e il triangolo non esiste.

Nel secondo caso il lato più lungo è $10$ e $6 + 8 = 14$, che è maggiore di $10$: il triangolo esiste.
```

```ad-example
Esempio 7: le lunghezze possibili del terzo lato
Due lati di un triangolo sono lunghi $4$ cm e $7$ cm. Trova le lunghezze possibili del terzo lato $x$.

Il terzo lato è minore della somma degli altri due e maggiore della loro differenza:

$$
\begin{gathered}
7 - 4 < x < 7 + 4 \\
3 < x < 11
\end{gathered}
$$

Il terzo lato è lungo più di $3$ cm e meno di $11$ cm. Con $x = 3$ o $x = 11$ i tre punti sarebbero allineati.
```

```ad-note
Lati e angoli
Nei libri la disuguaglianza triangolare si dimostra con un altro teorema, che lega i lati agli angoli opposti: in un triangolo a lato maggiore si oppone angolo maggiore, e ad angolo maggiore si oppone lato maggiore. Nel triangolo rettangolo, per esempio, l'ipotenusa è il lato più lungo, perché è opposta all'angolo retto, che è il più grande.
```

## Somma degli angoli interni

In ogni triangolo la somma degli angoli interni è un angolo piatto:

$$\hat{A} + \hat{B} + \hat{C} = 180^\circ$$

```tikz
% nome: somma-angoli-interni-triangolo
% alt: Triangolo ABC con i tre angoli interni in A, B e C segnati con archi diversi: la loro somma è 180 gradi
% svg: somma-angoli-interni-triangolo-00087f45.svg 186x123
\begin{tikzpicture}
\fill[orange!30] (0,0) -- ++(0:0.5) arc (0:61.39:0.5) -- cycle;
\draw (0.5,0) arc (0:61.39:0.5);
\fill[blue!15] (3.8,0) -- ++(139.76:0.5) arc (139.76:180:0.5) -- cycle;
\draw (3.42,0.32) arc (139.76:180:0.5);
\draw (3.46,0.28) arc (139.76:180:0.44);
\fill[green!20] (1.2,2.2) -- ++(-118.61:0.45) arc (-118.61:-40.24:0.45) -- cycle;
\draw (0.98,1.8) arc (-118.61:-40.24:0.45);
\draw (1.01,1.86) arc (-118.61:-40.24:0.39);
\draw (1.04,1.91) arc (-118.61:-40.24:0.33);
\draw (0,0) -- (3.8,0) -- (1.2,2.2) -- cycle;
\node[below left] at (0,0) {$A$};
\node[below right] at (3.8,0) {$B$};
\node[above] at (1.2,2.2) {$C$};
\end{tikzpicture}
```

La dimostrazione usa le rette parallele, e la trovi nella lezione [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele). Da questo teorema seguono alcune conseguenze che si usano di continuo:

- un triangolo ha al massimo un angolo retto o ottuso, perché due angoli che insieme fanno almeno $180^\circ$ non lasciano spazio al terzo; quindi ha sempre almeno due angoli acuti;
- nel triangolo rettangolo i due angoli acuti sono complementari, perché insieme fanno $180^\circ - 90^\circ = 90^\circ$;
- nel triangolo equilatero ogni angolo misura $180^\circ : 3 = 60^\circ$.

```ad-example
Esempio 8: il terzo angolo
In un triangolo $\hat{A} = 47^\circ$ e $\hat{B} = 68^\circ$. Trova $\hat{C}$ e classifica il triangolo rispetto agli angoli.

$$
\begin{aligned}
\hat{C} &= 180^\circ - 47^\circ - 68^\circ \\
&= 65^\circ
\end{aligned}
$$

I tre angoli sono acuti: il triangolo è acutangolo. Gli angoli sono tutti diversi, quindi anche i lati: se due lati fossero congruenti, per il teorema del triangolo isoscele lo sarebbero anche i due angoli opposti. Il triangolo è scaleno.
```

```ad-example
Esempio 9: gli angoli di un triangolo isoscele
In un triangolo isoscele l'angolo al vertice misura $40^\circ$. Trova gli angoli alla base. E se invece un angolo alla base misura $35^\circ$, quanto misura l'angolo al vertice?

Gli angoli alla base sono congruenti, quindi si dividono in parti uguali quello che resta di $180^\circ$:

$$
\begin{aligned}
\hat{B} = \hat{C} &= (180^\circ - 40^\circ) : 2 \\
&= 70^\circ
\end{aligned}
$$

Nel secondo caso i due angoli alla base misurano $35^\circ$ ciascuno:

$$
\begin{aligned}
\hat{A} &= 180^\circ - 2 \cdot 35^\circ \\
&= 110^\circ
\end{aligned}
$$

L'angolo al vertice è ottuso, quindi il triangolo è isoscele e ottusangolo.
```

```ad-warning
Confondere l'angolo al vertice con un angolo alla base
Prima di fare il conto guarda quale angolo dà il testo. Se l'angolo di $40^\circ$ è al vertice, gli angoli alla base misurano $70^\circ$ ciascuno; se fosse alla base, anche l'altro angolo alla base misurerebbe $40^\circ$ e il vertice $100^\circ$. Sono due triangoli diversi.
```

```ad-note
Dove si usano
I criteri di congruenza tornano in quasi tutte le dimostrazioni di geometria del piano: per l'asse di un segmento e le rette perpendicolari nella lezione [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele), per bisettrici e assi nei [punti notevoli del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/punti-notevoli-del-triangolo), per le proprietà di [parallelogrammi e trapezi](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi).
```
