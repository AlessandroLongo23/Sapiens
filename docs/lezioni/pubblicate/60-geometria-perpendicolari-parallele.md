# Rette perpendicolari e parallele

Due rette dello stesso piano o si incontrano o non si incontrano mai. Se si incontrano ad angolo retto sono perpendicolari, come i bordi di un foglio; se non si incontrano sono parallele, come le righe di un quaderno. Da queste due idee escono gli strumenti che userai in tutta la geometria del piano: la distanza di un punto da una retta, l'asse di un segmento, gli angoli formati da una trasversale e la somma degli angoli di un triangolo, che vale sempre $180^\circ$.

## Rette perpendicolari

Due rette che hanno un punto in comune si dicono incidenti, e formano quattro angoli, a due a due [opposti al vertice](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/enti-geometrici-segmenti-e-angoli). Due rette sono **perpendicolari** se sono incidenti e i quattro angoli che formano sono retti. Si scrive $r \perp s$.

```tikz
% nome: rette-perpendicolari
% alt: Due rette r e s inclinate che si incontrano nel punto O formando quattro angoli retti; il quadratino in O segna l'angolo retto
% svg: rette-perpendicolari-f6396b44.svg 168x115
\begin{tikzpicture}
\draw[thick] (-1.97,-0.72) -- (1.97,0.72) node[right] {$r$};
\draw[thick, blue!70!black] (0.44,-1.22) -- (-0.48,1.32) node[above] {$s$};
\draw (0.21,0.08) -- (0.13,0.28) -- (-0.08,0.21);
\fill (0,0) circle (0.05);
\node[below] at (0,-0.08) {$O$};
\end{tikzpicture}
```

Se uno dei quattro angoli è retto, lo sono tutti: l'angolo adiacente è il supplementare di un angolo retto, quindi è retto anche lui, e gli altri due sono opposti al vertice di questi. Il quadratino nel punto $O$ è il segno dell'angolo retto.

```ad-warning
Perpendicolare non vuol dire verticale
Nella figura $r$ è inclinata, e $s$ è perpendicolare a $r$ senza essere verticale. Conta l'angolo tra le due rette, non come è girato il foglio: una retta verticale e una orizzontale sono perpendicolari, ma non sono le sole.
```

## Primo teorema dell'angolo esterno

Per dimostrare le proprietà delle perpendicolari e delle parallele serve un teorema sui triangoli. In un triangolo $ABC$, un **angolo esterno** è l'angolo formato da un lato e dal prolungamento di un altro lato: nella figura sotto, prolungando $BC$ oltre $C$ fino a $D$, l'angolo $\widehat{ACD}$ è un angolo esterno. È adiacente all'angolo interno $\hat{C}$, quindi i due insieme formano un angolo piatto; gli altri due angoli interni, $\hat{A}$ e $\hat{B}$, si dicono non adiacenti.

Primo teorema dell'angolo esterno: in un triangolo ogni angolo esterno è maggiore di ciascuno dei due angoli interni non adiacenti.

```ad-note
Dimostrazione del primo teorema
Ipotesi: $\widehat{ACD}$ è un angolo esterno del triangolo $ABC$. Tesi: $\widehat{ACD} > \hat{A}$.

Sia $M$ il punto medio di $AC$. Prolunga $BM$ oltre $M$ fino al punto $E$ con $ME \cong BM$, e congiungi $E$ con $C$.

1. $AM \cong MC$, perché $M$ è il punto medio di $AC$.
2. $BM \cong ME$, per costruzione.
3. $\widehat{AMB} \cong \widehat{CME}$, perché sono opposti al vertice.
4. I triangoli $ABM$ e $CEM$ sono congruenti per il primo criterio di congruenza, quindi $\widehat{BAM} \cong \widehat{ECM}$.
5. La semiretta $CE$ sta dentro l'angolo $\widehat{ACD}$, quindi $\widehat{ECM}$ è una parte di $\widehat{ACD}$ e $\widehat{ACD} > \widehat{ECM} \cong \hat{A}$.

Per $\hat{B}$ si ragiona allo stesso modo con il punto medio di $BC$, usando l'angolo esterno opposto al vertice di $\widehat{ACD}$.

```tikz
% nome: angolo-esterno-primo-teorema
% alt: Triangolo ABC con il lato BC prolungato fino a D; M è il punto medio di AC, il punto E sta sul prolungamento di BM con ME congruente a BM, e l'angolo ECM, congruente all'angolo in A, è una parte dell'angolo esterno ACD
% svg: angolo-esterno-primo-teorema-72da7897.svg 190x115
\begin{tikzpicture}
\fill[blue!25] (1,2) -- ++(-116.57:0.4) arc (-116.57:-45:0.4) -- cycle;
\draw (1,2) ++(-116.57:0.4) arc (-116.57:-45:0.4);
\fill[blue!25] (3,0) -- ++(63.43:0.4) arc (63.43:135:0.4) -- cycle;
\draw (3,0) ++(63.43:0.4) arc (63.43:135:0.4);
\draw[red!60!black] (3,0) ++(0:0.65) arc (0:135:0.65);
\draw[thick] (1,2) -- (0,0) -- (4.4,0);
\draw[thick] (1,2) -- (3,0);
\draw[dashed] (0,0) -- (4,2) -- (3,0);
\draw (1.42,1.42) -- (1.58,1.58);
\draw (2.42,0.42) -- (2.58,0.58);
\draw (1.02,0.38) -- (0.92,0.59);
\draw (1.08,0.41) -- (0.98,0.62);
\draw (3.02,1.38) -- (2.92,1.59);
\draw (3.08,1.41) -- (2.98,1.62);
\fill (2,1) circle (0.05);
\node[above] at (1,2) {$A$};
\node[below] at (0,0) {$B$};
\node[below] at (3,0) {$C$};
\node[below] at (4.4,0) {$D$};
\node[right] at (4,2) {$E$};
\node[below] at (2,0.92) {$M$};
\end{tikzpicture}
```
```

Da questo teorema segue che in un triangolo la somma di due angoli interni qualsiasi è minore di un angolo piatto: $\hat{A}$ è minore dell'angolo esterno $\widehat{ACD}$, e $\widehat{ACD} + \hat{C}$ è un angolo piatto, quindi $\hat{A} + \hat{C}$ è minore di un angolo piatto. Di conseguenza un triangolo non può avere due angoli retti, e nemmeno due angoli ottusi.

## La perpendicolare da un punto

Teorema: dati una retta $r$ e un punto $P$, per $P$ passa una e una sola retta perpendicolare a $r$.

Se $P$ sta su $r$, la perpendicolare è la retta che forma con $r$ un angolo retto con il vertice in $P$, e da una parte di $r$ c'è una sola semiretta con origine $P$ che lo forma. Se $P$ non sta su $r$, che una perpendicolare esista si dimostra con i criteri di congruenza, e in pratica la disegni con la squadra. Che sia una sola si dimostra per assurdo.

Ipotesi: $P$ non sta su $r$, $PH \perp r$ con $H$ su $r$. Tesi: nessun'altra retta per $P$ è perpendicolare a $r$.

1. Supponiamo che ci sia un'altra retta per $P$ perpendicolare a $r$, che incontra $r$ nel punto $K$, diverso da $H$.
2. Allora il triangolo $PHK$ ha due angoli retti, in $H$ e in $K$.
3. Questo è impossibile, perché in un triangolo la somma di due angoli interni è minore di un angolo piatto (primo teorema dell'angolo esterno).
4. Quindi la perpendicolare da $P$ a $r$ è una sola.

```tikz
% nome: perpendicolare-unica-assurdo
% alt: Un punto P fuori dalla retta r, la perpendicolare PH a r e un secondo segmento PK tratteggiato, con un punto interrogativo sull'angolo in K: il triangolo PHK non può avere due angoli retti
% svg: perpendicolare-unica-assurdo-47edd75f.svg 182x115
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (4,0) node[right] {$r$};
\draw[thick, blue!70!black] (1.2,2) -- (1.2,0);
\draw[dashed] (1.2,2) -- (2.9,0);
\draw (1.42,0) -- (1.42,0.22) -- (1.2,0.22);
\draw[red!60!black] (2.9,0) ++(130.36:0.35) arc (130.36:180:0.35);
\node at (2.36,0.25) {\small ?};
\fill (1.2,2) circle (0.05);
\node[above] at (1.2,2) {$P$};
\node[below] at (1.2,0) {$H$};
\node[below] at (2.9,0) {$K$};
\end{tikzpicture}
```

### Proiezione e distanza

Sia $P$ un punto fuori dalla retta $r$, e sia $H$ il punto in cui la perpendicolare da $P$ incontra $r$. Il punto $H$ si chiama **piede della perpendicolare**, ed è la **proiezione** (ortogonale) di $P$ su $r$. Se $P$ sta su $r$, la sua proiezione è $P$ stesso.

La **distanza** di un punto $P$ da una retta $r$ è la lunghezza del segmento $PH$, che va da $P$ alla sua proiezione. Se $P$ sta su $r$, la distanza è zero.

```tikz
% nome: proiezione-distanza-punto-retta
% alt: Il punto P, la sua proiezione H sulla retta r con l'angolo retto, il segmento PH di lunghezza d e un segmento obliquo tratteggiato PA più lungo di PH
% svg: proiezione-distanza-punto-retta-13a48814.svg 194x111
\begin{tikzpicture}
\draw[thick] (-0.4,0) -- (4.2,0) node[right] {$r$};
\draw[very thick, blue!70!black] (1.3,1.9) -- (1.3,0) node[midway, left] {$d$};
\draw[dashed] (1.3,1.9) -- (3.5,0);
\draw (1.52,0) -- (1.52,0.22) -- (1.3,0.22);
\fill (1.3,1.9) circle (0.05);\fill (1.3,0) circle (0.05);\fill (3.5,0) circle (0.05);
\node[above] at (1.3,1.9) {$P$};
\node[below] at (1.3,0) {$H$};
\node[below] at (3.5,0) {$A$};
\end{tikzpicture}
```

Tra tutti i segmenti che vanno da $P$ a un punto di $r$, $PH$ è il più corto. Se $A$ è un altro punto di $r$, il triangolo $PHA$ ha un angolo retto in $H$, quindi l'angolo in $A$ è acuto (due angoli retti o ottusi non ci stanno); e in un triangolo all'angolo maggiore sta opposto il lato maggiore, quindi $PA > PH$. Il segmento $PA$ si dice obliquo.

```ad-warning
Misurare la distanza su un segmento obliquo
La distanza di $P$ da $r$ si misura sulla perpendicolare. Un segmento che va da $P$ a un punto qualsiasi di $r$, come $PA$ nella figura, è più lungo della distanza, a meno che quel punto sia proprio $H$.
```

## Asse di un segmento

L'**asse** di un segmento $AB$ è la retta perpendicolare ad $AB$ che passa per il suo punto medio $M$. Ogni segmento ha un solo asse, perché ha un solo punto medio e per $M$ passa una sola perpendicolare ad $AB$.

Con riga e compasso l'asse si disegna così: punta il compasso in $A$ con un'apertura maggiore della metà di $AB$ e traccia un arco sopra e uno sotto il segmento; con la stessa apertura ripeti da $B$. I due punti in cui gli archi si incrociano stanno sull'asse, e la retta che li unisce è l'asse. Il perché sta in una proprietà dell'asse (i suoi punti sono equidistanti da $A$ e da $B$), che trovi nella lezione sui [punti notevoli del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/punti-notevoli-del-triangolo).

```tikz
% nome: asse-di-un-segmento
% alt: Il segmento AB con il punto medio M e l'asse a, perpendicolare ad AB in M; i trattini segnano AM congruente a MB e gli archi di compasso da A e da B si incrociano sull'asse
% svg: asse-di-un-segmento-63d93fea.svg 194x171
\begin{tikzpicture}
\draw[gray] (0,0) ++(30.72:2.6) arc (30.72:48.72:2.6);
\draw[gray] (0,0) ++(-48.72:2.6) arc (-48.72:-30.72:2.6);
\draw[gray] (4,0) ++(131.28:2.6) arc (131.28:149.28:2.6);
\draw[gray] (4,0) ++(210.72:2.6) arc (210.72:228.72:2.6);
\draw[thick] (0,0) -- (4,0);
\draw[thick, blue!70!black] (2,-1.96) -- (2,2.06) node[above] {$a$};
\draw (2.22,0) -- (2.22,0.22) -- (2,0.22);
\draw (1,-0.12) -- (1,0.12);
\draw (3,-0.12) -- (3,0.12);
\fill (0,0) circle (0.05);\fill (4,0) circle (0.05);\fill (2,0) circle (0.05);
\node[left] at (0,0) {$A$};
\node[right] at (4,0) {$B$};
\node[below left] at (2,0) {$M$};
\end{tikzpicture}
```

I trattini uguali su $AM$ e su $MB$ dicono che i due segmenti sono congruenti. Nel piano cartesiano l'asse si trova con le coordinate: lo vedi nella lezione [Rette parallele e perpendicolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari).

## Rette parallele

Due rette dello stesso piano sono **parallele** se non hanno punti in comune oppure se coincidono. Si scrive $r \parallel s$.

```ad-note
Le rette coincidenti
Alcuni libri chiamano parallele solo le rette distinte che non si incontrano. Contare tra le parallele anche le rette coincidenti ha un vantaggio: ogni retta è parallela a se stessa, e il parallelismo diventa una [relazione di equivalenza](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/relazioni-di-equivalenza-e-d-ordine) (riflessiva, simmetrica e transitiva). Le classi di equivalenza sono le direzioni: tutte le rette parallele a una data hanno la stessa direzione.
```

Nello spazio due rette possono non incontrarsi senza essere parallele, perché non stanno sullo stesso piano. In questa lezione tutte le rette stanno sullo stesso piano.

### Il quinto postulato

Per un punto $P$ fuori da una retta $r$ passa almeno una parallela a $r$: lo vedrai come conseguenza del criterio di parallelismo, più avanti. Che ne passi una sola non si può dimostrare a partire dagli altri postulati, e va preso come postulato.

Quinto postulato di Euclide: per un punto fuori da una retta passa una e una sola retta parallela alla retta data.

```tikz
% nome: parallela-per-un-punto
% alt: La retta r e il punto P fuori da r; la retta s per P è parallela a r, mentre un'altra retta tratteggiata per P incontra r
% svg: parallela-per-un-punto-2e293469.svg 194x98
\begin{tikzpicture}
\draw[thick] (-0.2,0) -- (4.4,0) node[right] {$r$};
\draw[thick, blue!70!black] (-0.2,1.3) -- (4.4,1.3) node[right] {$s$};
\draw[dashed, gray] (0.4,2.1) -- (4.2,-0.4);
\fill (2,1.3) circle (0.05);
\node[above] at (2,1.35) {$P$};
\end{tikzpicture}
```

Nella figura $s$ è l'unica retta per $P$ parallela a $r$; ogni altra retta per $P$, come quella tratteggiata, prima o poi incontra $r$.

Due conseguenze del postulato:

- se $a \parallel b$ e $b \parallel c$, allora $a \parallel c$: se $a$ e $c$ fossero distinte e avessero un punto in comune, da quel punto passerebbero due parallele diverse a $b$;
- se una retta incontra una di due parallele distinte in un solo punto, incontra anche l'altra: se non la incontrasse, per quel punto passerebbero due parallele alla seconda retta.

## Due rette tagliate da una trasversale

Due rette $a$ e $b$ tagliate da una terza retta $t$, detta **trasversale**, formano otto angoli: quattro nel punto in cui $t$ incontra $a$, quattro nel punto in cui incontra $b$. Gli angoli che stanno nella striscia tra $a$ e $b$ si dicono interni ($\hat{3}$, $\hat{4}$, $\hat{5}$, $\hat{6}$), gli altri esterni ($\hat{1}$, $\hat{2}$, $\hat{7}$, $\hat{8}$).

```tikz
% nome: trasversale-otto-angoli
% alt: Due rette a e b tagliate dalla trasversale t; gli otto angoli sono numerati da 1 a 4 nel punto su a e da 5 a 8 nel punto su b, nello stesso ordine
% svg: trasversale-otto-angoli-83c26bae.svg 179x142
\begin{tikzpicture}
\draw[thick] (-0.6,1.7) -- (3.6,1.7) node[right] {$a$};
\draw[thick] (-0.6,0) -- (3.6,0) node[right] {$b$};
\draw[thick, blue!70!black] (0.5,-0.75) -- (2.2,2.45) node[above] {$t$};
\node at (2.16,1.92) {$\hat{1}$};
\node at (1.59,2.06) {$\hat{2}$};
\node at (1.44,1.48) {$\hat{3}$};
\node at (2.02,1.34) {$\hat{4}$};
\node at (1.26,0.22) {$\hat{5}$};
\node at (0.68,0.36) {$\hat{6}$};
\node at (0.54,-0.22) {$\hat{7}$};
\node at (1.12,-0.36) {$\hat{8}$};
\end{tikzpicture}
```

Le coppie di angoli, uno in ciascuno dei due punti, hanno un nome secondo la loro posizione rispetto alle rette e alla trasversale:

| Coppia | Posizione | Nella figura |
|---|---|---|
| alterni interni | interni, da parti opposte di $t$ | $\hat{3}$ e $\hat{5}$, $\hat{4}$ e $\hat{6}$ |
| alterni esterni | esterni, da parti opposte di $t$ | $\hat{1}$ e $\hat{7}$, $\hat{2}$ e $\hat{8}$ |
| corrispondenti | dalla stessa parte di $t$, uno interno e uno esterno, nella stessa posizione | $\hat{1}$ e $\hat{5}$, $\hat{2}$ e $\hat{6}$, $\hat{3}$ e $\hat{7}$, $\hat{4}$ e $\hat{8}$ |
| coniugati interni | interni, dalla stessa parte di $t$ | $\hat{4}$ e $\hat{5}$, $\hat{3}$ e $\hat{6}$ |
| coniugati esterni | esterni, dalla stessa parte di $t$ | $\hat{1}$ e $\hat{8}$, $\hat{2}$ e $\hat{7}$ |

```ad-warning
I nomi non dicono che gli angoli sono congruenti
Alterni, corrispondenti e coniugati sono nomi di posizioni, e valgono per due rette qualsiasi tagliate da una trasversale. Che gli alterni siano congruenti è vero solo quando $a \parallel b$: se le rette non sono parallele, $\hat{3}$ e $\hat{5}$ sono ancora alterni interni, ma hanno ampiezze diverse.
```

### Criterio di parallelismo

Teorema (criterio di parallelismo): se due rette tagliate da una trasversale formano due angoli alterni interni congruenti, allora sono parallele.

Ipotesi: $t$ incontra $a$ in $A$ e $b$ in $B$, e due angoli alterni interni sono congruenti. Tesi: $a \parallel b$.

1. Supponiamo che $a$ e $b$ non siano parallele. Sono distinte, perché $t$ le incontra in due punti diversi, quindi si incontrano in un punto $C$.
2. I punti $A$, $B$, $C$ formano un triangolo. Dei due angoli alterni interni, uno è un angolo esterno del triangolo (nella figura quello in $A$) e l'altro è un angolo interno non adiacente (quello in $B$).
3. Per il primo teorema dell'angolo esterno, l'angolo in $A$ è maggiore di quello in $B$, quindi i due angoli non sono congruenti. Questo contraddice l'ipotesi.
4. Quindi $a$ e $b$ sono parallele.

```tikz
% nome: criterio-parallelismo-assurdo
% alt: Due rette a e b tagliate dalla trasversale t nei punti A e B che si incontrano in C formando il triangolo ABC; l'angolo alterno interno in A è un angolo esterno del triangolo, quello in B è un angolo interno
% svg: criterio-parallelismo-assurdo-3f306775.svg 203x122
\begin{tikzpicture}[scale=0.8]
\fill[blue!25] (1,2) -- ++(165.96:0.45) arc (165.96:243.43:0.45) -- cycle;
\draw (1,2) ++(165.96:0.45) arc (165.96:243.43:0.45);
\fill[blue!25] (0,0) -- ++(11.31:0.45) arc (11.31:63.43:0.45) -- cycle;
\draw (0,0) ++(11.31:0.45) arc (11.31:63.43:0.45);
\draw[thick] (-0.4,2.35) -- (5,1) node[right] {$C$};
\draw[thick] (-0.7,-0.14) -- (5,1);
\draw[thick, blue!70!black] (-0.3,-0.6) -- (1.3,2.6) node[above] {$t$};
\node[above] at (-0.4,2.35) {$a$};
\node[below] at (-0.7,-0.14) {$b$};
\node[above right] at (1,2) {$A$};
\node[below right] at (0,0) {$B$};
\fill (5,1) circle (0.05);
\end{tikzpicture}
```

Negli otto angoli, gli opposti al vertice sono congruenti e due angoli vicini sulla stessa retta sono supplementari. Per questo il criterio si può usare con una qualsiasi di queste condizioni, che si riportano tutte agli alterni interni: due rette tagliate da una trasversale sono parallele se

- due angoli alterni (interni o esterni) sono congruenti, oppure
- due angoli corrispondenti sono congruenti, oppure
- due angoli coniugati (interni o esterni) sono supplementari.

Per esempio, se $\hat{1} \cong \hat{5}$ (corrispondenti), allora $\hat{3} \cong \hat{1}$ perché opposti al vertice, quindi $\hat{3} \cong \hat{5}$, che sono alterni interni. Se invece $\hat{4} + \hat{5} = 180^\circ$ (coniugati interni), siccome anche $\hat{3} + \hat{4} = 180^\circ$, si ha $\hat{3} \cong \hat{5}$.

Due conseguenze. Due rette perpendicolari alla stessa retta sono parallele tra loro, perché formano con essa angoli corrispondenti retti, quindi congruenti. E per un punto $P$ fuori da una retta $r$ passa almeno una parallela a $r$: si traccia la perpendicolare da $P$ a $r$, poi la perpendicolare a questa in $P$.

### Rette parallele tagliate da una trasversale

Vale anche il contrario del criterio, e per dimostrarlo serve il quinto postulato.

Teorema: se due rette parallele sono tagliate da una trasversale, formano angoli alterni interni congruenti.

Ipotesi: $a \parallel b$, e $t$ le incontra in $A$ e in $B$. Tesi: gli angoli alterni interni sono congruenti.

1. Per $A$ traccia la retta $a'$ che forma con $t$ un angolo alterno interno congruente all'angolo in $B$.
2. Per il criterio di parallelismo, $a' \parallel b$.
3. Per $A$ passano $a$ e $a'$, entrambe parallele a $b$. Per il quinto postulato ne passa una sola, quindi $a'$ coincide con $a$.
4. Allora anche $a$ forma con $t$ un angolo alterno interno congruente all'angolo in $B$.

```tikz
% nome: parallele-teorema-inverso
% alt: Due rette parallele a e b tagliate dalla trasversale t nei punti A e B; per A passa anche una retta tratteggiata a' che forma con t un angolo alterno interno congruente all'angolo in B
% svg: parallele-teorema-inverso-aafb6f43.svg 192x142
\begin{tikzpicture}
\fill[blue!25] (1.8,1.7) -- ++(192:0.4) arc (192:242:0.4) -- cycle;
\draw (1.8,1.7) ++(192:0.4) arc (192:242:0.4);
\fill[blue!25] (0.9,0) -- ++(0:0.4) arc (0:62:0.4) -- cycle;
\draw (0.9,0) ++(0:0.4) arc (0:62:0.4);
\draw[thick] (-0.6,1.7) -- (3.6,1.7) node[right] {$a$};
\draw[dashed] (-0.45,1.22) -- (3.86,2.14) node[right] {$a'$};
\draw[thick] (-0.6,0) -- (3.6,0) node[right] {$b$};
\draw[thick, blue!70!black] (0.5,-0.75) -- (2.2,2.45) node[above] {$t$};
\node[above left] at (1.8,1.7) {$A$};
\node[below right] at (0.9,0) {$B$};
\end{tikzpicture}
```

Mettendo insieme i due teoremi: due rette tagliate da una trasversale sono parallele se e solo se formano angoli alterni congruenti, se e solo se formano angoli corrispondenti congruenti, se e solo se formano angoli coniugati supplementari. In particolare una retta perpendicolare a una di due parallele è perpendicolare anche all'altra.

```ad-tip
Solo due ampiezze
Quando $a \parallel b$ e $t$ non è perpendicolare, gli otto angoli hanno solo due ampiezze: quattro sono acuti e congruenti tra loro, quattro sono ottusi e congruenti tra loro, e un acuto e un ottuso sono sempre supplementari. Se $t$ è perpendicolare, gli otto angoli sono tutti retti.
```

```ad-note
Il postulato come lo scrisse Euclide
Negli Elementi (circa 300 a.C.) Euclide enunciò il quinto postulato con i coniugati interni: se due rette tagliate da una trasversale formano dalla stessa parte due angoli coniugati interni la cui somma è minore di due angoli retti, le due rette, prolungate, si incontrano da quella parte. La forma "una sola parallela per un punto", usata oggi nei libri, è equivalente.
```

```ad-example
Esempio 1: gli otto angoli
Le rette $a$ e $b$ sono parallele e la trasversale $t$ forma l'angolo $\hat{1} = 65^\circ$, con la numerazione della figura precedente. Trova gli altri sette.

$\hat{3} = 65^\circ$, perché è opposto al vertice di $\hat{1}$. $\hat{2}$ e $\hat{4}$ sono adiacenti a $\hat{1}$, quindi $\hat{2} = \hat{4} = 180^\circ - 65^\circ = 115^\circ$.

Sulla retta $b$ gli angoli sono i corrispondenti di quelli sulla retta $a$: $\hat{5} = \hat{1} = 65^\circ$, $\hat{6} = \hat{2} = 115^\circ$, $\hat{7} = \hat{3} = 65^\circ$, $\hat{8} = \hat{4} = 115^\circ$.

Controllo: i coniugati interni $\hat{4}$ e $\hat{5}$ danno $115^\circ + 65^\circ = 180^\circ$.

```tikz
% nome: otto-angoli-esempio-65
% alt: Due rette parallele a e b tagliate dalla trasversale t: in ciascuno dei due punti gli angoli misurano 65, 115, 65 e 115 gradi
% svg: otto-angoli-esempio-65-c70dd2e0.svg 203x169
\begin{tikzpicture}[scale=1.15]
\draw[thick] (-0.6,1.9) -- (3.6,1.9) node[right] {$a$};
\draw[thick] (-0.6,0) -- (3.6,0) node[right] {$b$};
\draw[thick, blue!70!black] (0.55,-0.75) -- (2.14,2.65) node[above] {$t$};
\node[font=\scriptsize] at (2.14,2.13) {$65^\circ$};
\node[font=\scriptsize] at (1.56,2.25) {$115^\circ$};
\node[font=\scriptsize] at (1.43,1.67) {$65^\circ$};
\node[font=\scriptsize] at (2.01,1.55) {$115^\circ$};
\node[font=\scriptsize] at (1.25,0.23) {$65^\circ$};
\node[font=\scriptsize] at (0.67,0.35) {$115^\circ$};
\node[font=\scriptsize] at (0.55,-0.23) {$65^\circ$};
\node[font=\scriptsize] at (1.13,-0.35) {$115^\circ$};
\end{tikzpicture}
```
```

```ad-example
Esempio 2: parallele o no
Due rette $a$ e $b$ sono tagliate da una trasversale, con la numerazione della figura degli otto angoli. Stabilisci se sono parallele nei due casi: (a) $\hat{4} = 108^\circ$ e $\hat{5} = 72^\circ$; (b) $\hat{4} = 108^\circ$ e $\hat{6} = 74^\circ$.

(a) $\hat{4}$ e $\hat{5}$ sono coniugati interni e $108^\circ + 72^\circ = 180^\circ$: sono supplementari, quindi $a \parallel b$.

(b) $\hat{4}$ e $\hat{6}$ sono alterni interni. Se le rette fossero parallele sarebbero congruenti, ma $108^\circ \neq 74^\circ$: le rette non sono parallele.
```

```ad-warning
Coniugati congruenti invece che supplementari
Con due rette parallele gli angoli coniugati sono supplementari, non congruenti: la loro somma è $180^\circ$. Sono congruenti solo nel caso in cui $t$ è perpendicolare alle due rette, e allora sono tutti e due retti.
```

```ad-example
Esempio 3: le ampiezze con un'equazione
Le rette $a$ e $b$ sono parallele. Due angoli alterni interni misurano $(3x + 10)^\circ$ e $(5x - 30)^\circ$. Trova $x$ e l'ampiezza dei due angoli.

Con due parallele gli alterni interni sono congruenti, quindi scrivi l'[equazione](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere):

$$
\begin{aligned}
3x + 10 &= 5x - 30 \\
-2x &= -40 \\
x &= 20
\end{aligned}
$$

I due angoli misurano $3 \cdot 20 + 10 = 70^\circ$ e $5 \cdot 20 - 30 = 70^\circ$.

Se invece i due angoli fossero coniugati interni, l'equazione sarebbe diversa, perché la loro somma è $180^\circ$. Con $(2x + 30)^\circ$ e $4x^\circ$:

$$
\begin{aligned}
2x + 30 + 4x &= 180 \\
6x &= 150 \\
x &= 25
\end{aligned}
$$

e gli angoli misurano $80^\circ$ e $100^\circ$.
```

```ad-example
Esempio 4: un angolo tra due parallele
Le rette $r$ e $s$ sono parallele, e il punto $P$ sta tra le due. L'angolo tra $r$ e $AP$ misura $40^\circ$, quello tra $s$ e $BP$ misura $35^\circ$, come in figura. Trova $\widehat{APB}$.

Traccia per $P$ la retta $p$ parallela a $r$: è parallela anche a $s$, perché due rette parallele a una terza sono parallele tra loro. La retta $p$ divide $\widehat{APB}$ in due parti.

La parte di sopra e l'angolo di $40^\circ$ in $A$ sono alterni interni rispetto alle parallele $r$ e $p$, tagliate da $AP$: la parte di sopra misura $40^\circ$. Allo stesso modo la parte di sotto e l'angolo di $35^\circ$ in $B$ sono alterni interni rispetto a $s$ e $p$, tagliate da $BP$: misura $35^\circ$.

$$\widehat{APB} = 40^\circ + 35^\circ = 75^\circ$$

```tikz
% nome: angolo-tra-due-parallele
% alt: Due rette parallele r e s e un punto P tra le due, collegato ad A su r e a B su s; la retta tratteggiata p per P, parallela a r, divide l'angolo APB in una parte di 40 gradi, alterna all'angolo in A, e una di 35 gradi, alterna all'angolo in B
% svg: angolo-tra-due-parallele-7c671fa7.svg 167x115
\begin{tikzpicture}
\fill[blue!25] (0.3,2) -- ++(-40:0.5) arc (-40:0:0.5) -- cycle;
\draw (0.3,2) ++(-40:0.5) arc (-40:0:0.5);
\fill[orange!30] (0.6,0) -- ++(0:0.5) arc (0:35:0.5) -- cycle;
\draw (0.6,0) ++(0:0.5) arc (0:35:0.5);
\fill[blue!25] (1.74,0.8) -- ++(140:0.45) arc (140:180:0.45) -- cycle;
\draw (1.74,0.8) ++(140:0.45) arc (140:180:0.45);
\fill[orange!30] (1.74,0.8) -- ++(180:0.45) arc (180:215:0.45) -- cycle;
\draw (1.74,0.8) ++(180:0.45) arc (180:215:0.45);
\draw[thick] (-0.5,2) -- (3.4,2) node[right] {$r$};
\draw[thick] (-0.5,0) -- (3.4,0) node[right] {$s$};
\draw[dashed] (-0.5,0.8) -- (3.4,0.8) node[right] {$p$};
\draw[thick, blue!70!black] (0.3,2) -- (1.74,0.8) -- (0.6,0);
\node at (1.1,1.71) {\scriptsize $40^\circ$};
\node at (1.41,0.26) {\scriptsize $35^\circ$};
\node[above] at (0.3,2) {$A$};
\node[below] at (0.6,0) {$B$};
\node[right] at (1.79,1) {$P$};
\end{tikzpicture}
```
```

## Somma degli angoli interni di un triangolo

Teorema: la somma degli angoli interni di un triangolo è un angolo piatto, cioè $180^\circ$.

$$\hat{A} + \hat{B} + \hat{C} = 180^\circ$$

Ipotesi: $ABC$ è un triangolo. Tesi: $\hat{A} + \hat{B} + \hat{C} = 180^\circ$.

1. Per $C$ traccia la retta $r$ parallela ad $AB$ (esiste ed è unica per il quinto postulato).
2. In $C$ si formano tre angoli che insieme fanno un angolo piatto: quello tra $r$ e $CA$, l'angolo $\hat{C}$ del triangolo, quello tra $CB$ e $r$.
3. L'angolo tra $r$ e $CA$ è congruente ad $\hat{A}$: sono alterni interni rispetto alle parallele $r$ e $AB$ tagliate da $AC$.
4. L'angolo tra $CB$ e $r$ è congruente a $\hat{B}$: sono alterni interni rispetto alle stesse parallele tagliate da $BC$.
5. Quindi $\hat{A} + \hat{B} + \hat{C}$ è congruente ai tre angoli in $C$, cioè a un angolo piatto.

```tikz
% nome: somma-angoli-interni-triangolo
% alt: Triangolo ABC e la retta r per C parallela ad AB; in C i tre angoli colorati come gli angoli in A, in C e in B formano insieme un angolo piatto
% svg: somma-angoli-interni-triangolo-75c9f2af.svg 201x125
\begin{tikzpicture}
\fill[blue!25] (0,0) -- ++(0:0.45) arc (0:57.53:0.45) -- cycle;
\draw (0,0) ++(0:0.45) arc (0:57.53:0.45);
\fill[orange!30] (4,0) -- ++(139.76:0.45) arc (139.76:180:0.45) -- cycle;
\draw (4,0) ++(139.76:0.45) arc (139.76:180:0.45);
\fill[green!25] (1.4,2.2) -- ++(-122.47:0.4) arc (-122.47:-40.24:0.4) -- cycle;
\draw (1.4,2.2) ++(-122.47:0.4) arc (-122.47:-40.24:0.4);
\fill[blue!25] (1.4,2.2) -- ++(180:0.4) arc (180:237.53:0.4) -- cycle;
\draw (1.4,2.2) ++(180:0.4) arc (180:237.53:0.4);
\fill[orange!30] (1.4,2.2) -- ++(-40.24:0.4) arc (-40.24:0:0.4) -- cycle;
\draw (1.4,2.2) ++(-40.24:0.4) arc (-40.24:0:0.4);
\draw[thick] (0,0) -- (4,0) -- (1.4,2.2) -- cycle;
\draw[thick, blue!70!black] (-0.7,2.2) -- (3.8,2.2) node[right] {$r$};
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[above] at (1.4,2.25) {$C$};
\end{tikzpicture}
```

Nella figura gli angoli dello stesso colore sono congruenti: i tre colori in $C$ sono gli stessi dei tre angoli del triangolo.

Dal teorema seguono alcune conseguenze che si usano di continuo:

- in un triangolo c'è al massimo un angolo retto o ottuso, e gli altri due sono acuti;
- in un triangolo rettangolo i due angoli acuti sono complementari: la loro somma è $90^\circ$;
- gli angoli di un triangolo equilatero sono congruenti (lo vedi nella lezione sui [triangoli](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/triangoli-e-criteri-di-congruenza)), quindi ognuno misura $180^\circ : 3 = 60^\circ$;
- se due triangoli hanno due angoli congruenti, hanno congruente anche il terzo.

```ad-example
Esempio 5: triangoli isosceli e rettangoli
(a) In un triangolo isoscele l'angolo al vertice misura $40^\circ$. Quanto misurano gli angoli alla base?

Gli angoli alla base sono congruenti e insieme fanno $180^\circ - 40^\circ = 140^\circ$, quindi ognuno misura $140^\circ : 2 = 70^\circ$.

(b) In un triangolo isoscele un angolo alla base misura $50^\circ$. Quanto misura l'angolo al vertice?

Anche l'altro angolo alla base misura $50^\circ$, quindi l'angolo al vertice misura $180^\circ - 2 \cdot 50^\circ = 80^\circ$.

(c) In un triangolo rettangolo un angolo acuto misura $35^\circ$. Quanto misura l'altro?

Gli angoli acuti sono complementari: $90^\circ - 35^\circ = 55^\circ$.
```

```ad-example
Esempio 6: angoli in proporzione
Gli angoli di un triangolo misurano $x$, $2x$ e $3x$. Trova le tre ampiezze e di che triangolo si tratta.

La somma è $180^\circ$:

$$
\begin{aligned}
x + 2x + 3x &= 180^\circ \\
6x &= 180^\circ \\
x &= 30^\circ
\end{aligned}
$$

Gli angoli misurano $30^\circ$, $60^\circ$ e $90^\circ$: il triangolo è rettangolo.
```

```ad-warning
Triangoli che non esistono
Un triangolo con due angoli di $100^\circ$ e $90^\circ$ non esiste, perché i due angoli da soli superano $180^\circ$. Prima di cercare il terzo angolo, controlla che la somma dei due noti sia minore di $180^\circ$.
```

### Secondo teorema dell'angolo esterno

Con la somma degli angoli interni si sa anche quanto misura un angolo esterno.

Teorema: in un triangolo ogni angolo esterno è congruente alla somma dei due angoli interni non adiacenti.

Ipotesi: $\widehat{CBD}$ è l'angolo esterno in $B$ del triangolo $ABC$. Tesi: $\widehat{CBD} = \hat{A} + \hat{C}$.

1. $\widehat{CBD} + \hat{B} = 180^\circ$, perché sono adiacenti.
2. $\hat{A} + \hat{C} + \hat{B} = 180^\circ$, per il teorema sulla somma degli angoli interni.
3. $\widehat{CBD}$ e $\hat{A} + \hat{C}$ sono tutti e due il supplementare di $\hat{B}$, quindi sono congruenti.

```tikz
% nome: angolo-esterno-secondo-teorema
% alt: Triangolo ABC con il lato AB prolungato oltre B fino a D; l'angolo esterno CBD è colorato e uguale alla somma degli angoli colorati in A e in C
% svg: angolo-esterno-secondo-teorema-90e6a038.svg 203x115
\begin{tikzpicture}
\fill[blue!25] (0,0) -- ++(0:0.45) arc (0:59.04:0.45) -- cycle;
\draw (0,0) ++(0:0.45) arc (0:59.04:0.45);
\fill[orange!30] (1.2,2) -- ++(-120.96:0.4) arc (-120.96:-45:0.4) -- cycle;
\draw (1.2,2) ++(-120.96:0.4) arc (-120.96:-45:0.4);
\fill[green!25] (3.2,0) -- ++(0:0.45) arc (0:135:0.45) -- cycle;
\draw (3.2,0) ++(0:0.45) arc (0:135:0.45);
\draw[thick] (0,0) -- (3.2,0) -- (1.2,2) -- cycle;
\draw[thick] (3.2,0) -- (4.5,0);
\node[below left] at (0,0) {$A$};
\node[below] at (3.2,0) {$B$};
\node[above] at (1.2,2) {$C$};
\node[below] at (4.5,0) {$D$};
\end{tikzpicture}
```

Nella figura l'angolo esterno verde è la somma dell'angolo blu in $A$ e dell'angolo arancione in $C$. Questo teorema contiene il primo: se un angolo è la somma di due angoli non nulli, è maggiore di ciascuno dei due.

```ad-example
Esempio 7: dall'angolo esterno agli angoli interni
In un triangolo $ABC$ l'angolo esterno in $B$ misura $130^\circ$ e $\hat{A} = 55^\circ$. Trova $\hat{B}$ e $\hat{C}$.

L'angolo interno $\hat{B}$ è adiacente all'angolo esterno: $\hat{B} = 180^\circ - 130^\circ = 50^\circ$.

L'angolo esterno è la somma degli interni non adiacenti: $\hat{A} + \hat{C} = 130^\circ$, quindi $\hat{C} = 130^\circ - 55^\circ = 75^\circ$.

Controllo: $55^\circ + 50^\circ + 75^\circ = 180^\circ$.
```

```ad-warning
Sommare l'angolo sbagliato
L'angolo esterno in $B$ è la somma degli angoli in $A$ e in $C$, non di quello in $B$. L'angolo interno $\hat{B}$ è il suo supplementare: con un angolo esterno di $130^\circ$, $\hat{B}$ misura $50^\circ$.
```

## Somma degli angoli di un poligono

In un poligono convesso con $n$ lati, le diagonali che partono da un vertice lo dividono in $n - 2$ triangoli, e gli angoli di questi triangoli insieme formano gli angoli del poligono. Quindi la somma degli angoli interni è

$$S = (n - 2) \cdot 180^\circ$$

```tikz
% nome: poligono-diviso-in-triangoli
% alt: Pentagono ABCDE diviso dalle diagonali AC e AD in tre triangoli colorati
% svg: poligono-diviso-in-triangoli-c92d491d.svg 201x153
\begin{tikzpicture}
\fill[blue!20] (0,0) -- (3,0) -- (3.7,1.8) -- cycle;
\fill[orange!25] (0,0) -- (3.7,1.8) -- (1.6,3) -- cycle;
\fill[green!20] (0,0) -- (1.6,3) -- (-0.5,1.7) -- cycle;
\draw[thick] (0,0) -- (3,0) -- (3.7,1.8) -- (1.6,3) -- (-0.5,1.7) -- cycle;
\draw (0,0) -- (3.7,1.8);
\draw (0,0) -- (1.6,3);
\node[below left] at (0,0) {$A$};
\node[below right] at (3,0) {$B$};
\node[right] at (3.7,1.8) {$C$};
\node[above] at (1.6,3) {$D$};
\node[left] at (-0.5,1.7) {$E$};
\end{tikzpicture}
```

Il pentagono della figura ha $5$ lati e si divide in $3$ triangoli: la somma dei suoi angoli è $3 \cdot 180^\circ = 540^\circ$. Per un quadrilatero la somma è $2 \cdot 180^\circ = 360^\circ$, per un esagono $4 \cdot 180^\circ = 720^\circ$.

Un poligono con tutti i lati e tutti gli angoli congruenti si dice [regolare](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/poligoni-inscritti-e-circoscritti), e ciascuno dei suoi $n$ angoli misura $S : n$. Per l'esagono regolare: $720^\circ : 6 = 120^\circ$.

```ad-note
Gli angoli esterni
Se in ogni vertice di un poligono convesso prendi un angolo esterno, la somma degli $n$ angoli esterni è sempre $360^\circ$, qualunque sia $n$: ogni angolo esterno è il supplementare dell'angolo interno, quindi la somma è $n \cdot 180^\circ - (n - 2) \cdot 180^\circ = 360^\circ$.
```

```ad-example
Esempio 8: dal numero dei lati alla somma, e ritorno
(a) La somma degli angoli interni di un poligono convesso è $1440^\circ$. Quanti lati ha?

$$
\begin{aligned}
(n - 2) \cdot 180^\circ &= 1440^\circ \\
n - 2 &= 8 \\
n &= 10
\end{aligned}
$$

È un decagono.

(b) Ogni angolo di un poligono regolare misura $150^\circ$. Quanti lati ha?

Gli $n$ angoli misurano $150^\circ$ ciascuno, quindi la loro somma è $150^\circ \cdot n$:

$$
\begin{aligned}
(n - 2) \cdot 180 &= 150n \\
180n - 360 &= 150n \\
30n &= 360 \\
n &= 12
\end{aligned}
$$

Con gli angoli esterni si fa prima: ognuno misura $180^\circ - 150^\circ = 30^\circ$, e insieme fanno $360^\circ$, quindi sono $360^\circ : 30^\circ = 12$.
```

```ad-warning
Moltiplicare per $n$ invece che per $n - 2$
La somma degli angoli di un poligono non è $n \cdot 180^\circ$: un triangolo ha somma $180^\circ$, non $540^\circ$. I triangoli in cui si divide il poligono sono $n - 2$, non $n$.
```
