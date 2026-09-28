# Teorema di Talete

Quando alcune rette parallele tagliano due rette qualsiasi, le parti che staccano su una sono proporzionali alle parti che staccano sull'altra. È il teorema di Talete: con lui si divide un segmento in parti congruenti usando solo riga e squadra, si trova una lunghezza senza misurarla, si dividono i lati di un triangolo in parti note, e con lui si dimostrano i criteri di [similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine). Le proporzioni si scrivono e si risolvono come nella lezione su [rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali); le rette parallele e gli angoli che formano con una trasversale sono nella lezione [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele).

## Il fascio di rette parallele

Un **fascio di rette parallele** è un insieme di rette del piano tutte parallele tra loro (alcuni libri lo chiamano fascio improprio). Una retta che non è parallela alle rette del fascio le incontra tutte, e si chiama **trasversale**.

Nella figura le parallele $a$, $b$, $c$ sono tagliate da due trasversali, $r$ e $s$. Due punti delle trasversali sono **corrispondenti** se stanno sulla stessa retta del fascio: $A$ e $A'$ stanno su $a$, $B$ e $B'$ su $b$, $C$ e $C'$ su $c$. Due segmenti sono corrispondenti se lo sono i loro estremi: $AB$ corrisponde ad $A'B'$, $BC$ a $B'C'$, $AC$ ad $A'C'$.

```tikz
% nome: fascio-rette-parallele-trasversali
% alt: Tre rette parallele a, b, c tagliate da due trasversali r e s: r le incontra nei punti A, B, C, s nei punti A', B', C'
% svg: fascio-rette-parallele-trasversali-72cba817.svg 217x136
\begin{tikzpicture}
\draw[thick] (-0.20,0.00) -- (5.00,0.00);
\node[right] at (5.00,0.00) {$a$};
\draw[thick] (-0.20,1.10) -- (5.00,1.10);
\node[right] at (5.00,1.10) {$b$};
\draw[thick] (-0.20,2.40) -- (5.00,2.40);
\node[right] at (5.00,2.40) {$c$};
\draw[thick, blue!70!black] (0.40,-0.35) -- (1.32,2.75);
\node[above] at (1.32,2.75) {$r$};
\draw[thick, blue!70!black] (2.19,-0.35) -- (4.97,2.75);
\node[above] at (4.97,2.75) {$s$};
\fill (0.50,0.00) circle (0.05);
\node[above left] at (0.50,0.00) {$A$};
\fill (0.83,1.10) circle (0.05);
\node[above left] at (0.83,1.10) {$B$};
\fill (1.22,2.40) circle (0.05);
\node[above left] at (1.22,2.40) {$C$};
\fill (2.50,0.00) circle (0.05);
\node[above left] at (2.50,0.00) {$A'$};
\fill (3.49,1.10) circle (0.05);
\node[above left] at (3.49,1.10) {$B'$};
\fill (4.66,2.40) circle (0.05);
\node[above left] at (4.66,2.40) {$C'$};
\end{tikzpicture}
```

## Segmenti congruenti su una trasversale

Teorema del fascio di rette parallele: se un fascio di rette parallele è tagliato da due trasversali, a segmenti congruenti su una trasversale corrispondono segmenti congruenti sull'altra.

Alcuni libri lo chiamano piccolo teorema di Talete. È il primo passo verso il teorema di Talete vero e proprio, e ha già un'applicazione pratica: dividere un segmento in parti congruenti.

Ipotesi: le rette parallele $a$, $b$, $c$, $d$ sono tagliate dalla trasversale $r$ nei punti $A$, $B$, $C$, $D$ e dalla trasversale $s$ nei punti $A'$, $B'$, $C'$, $D'$; $AB \cong CD$.

Tesi: $A'B' \cong C'D'$.

```tikz
% nome: teorema-fascio-parallele-dimostrazione
% alt: Quattro rette parallele a, b, c, d tagliate dalle trasversali r e s; AB e CD sono congruenti; da A' e da C' partono i segmenti A'E e C'F paralleli a r, e i triangoli A'EB' e C'FD' hanno gli angoli corrispondenti congruenti
% svg: teorema-fascio-parallele-dimostrazione-2de76413.svg 215x138
\begin{tikzpicture}[scale=0.85]
\draw[thick] (-0.20,0.00) -- (5.80,0.00);
\node[right] at (5.80,0.00) {$a$};
\draw[thick] (-0.20,1.00) -- (5.80,1.00);
\node[right] at (5.80,1.00) {$b$};
\draw[thick] (-0.20,1.80) -- (5.80,1.80);
\node[right] at (5.80,1.80) {$c$};
\draw[thick] (-0.20,2.80) -- (5.80,2.80);
\node[right] at (5.80,2.80) {$d$};
\draw[thick, blue!70!black] (0.18,-0.35) -- (1.40,3.15);
\node[above] at (1.40,3.15) {$r$};
\draw[thick, blue!70!black] (1.61,-0.35) -- (5.46,3.15);
\node[above] at (5.46,3.15) {$s$};
\draw[densely dashed] (2.00,0.00) -- (2.35,1.00);
\draw[densely dashed] (3.98,1.80) -- (4.33,2.80);
\draw[black] (0.38,0.53) -- (0.57,0.47);
\draw[black] (1.01,2.33) -- (1.20,2.27);
\draw[black] (2.08,0.53) -- (2.27,0.47);
\draw[black] (4.06,2.33) -- (4.25,2.27);
\draw[black] (2.31,0.28) arc[start angle=42.27, delta angle=28.44, radius=0.42];
\draw[black] (4.29,2.08) arc[start angle=42.27, delta angle=28.44, radius=0.42];
\draw[black] (2.88,0.80) arc[start angle=-137.73, delta angle=-42.27, radius=0.30];
\draw[black] (2.83,0.75) arc[start angle=-137.73, delta angle=-42.27, radius=0.37];
\draw[black] (4.86,2.60) arc[start angle=-137.73, delta angle=-42.27, radius=0.30];
\draw[black] (4.81,2.55) arc[start angle=-137.73, delta angle=-42.27, radius=0.37];
\fill (0.30,0.00) circle (0.05);
\node[above left] at (0.30,0.00) {$A$};
\fill (0.65,1.00) circle (0.05);
\node[above left] at (0.65,1.00) {$B$};
\fill (0.93,1.80) circle (0.05);
\node[above left] at (0.93,1.80) {$C$};
\fill (1.28,2.80) circle (0.05);
\node[above left] at (1.28,2.80) {$D$};
\fill (2.00,0.00) circle (0.05);
\node[below right] at (2.00,0.00) {$A'$};
\fill (3.10,1.00) circle (0.05);
\node[below right] at (3.10,1.00) {$B'$};
\fill (3.98,1.80) circle (0.05);
\node[below right] at (3.98,1.80) {$C'$};
\fill (5.08,2.80) circle (0.05);
\node[below right] at (5.08,2.80) {$D'$};
\fill (2.35,1.00) circle (0.05);
\node[above left] at (2.35,1.00) {$E$};
\fill (4.33,2.80) circle (0.05);
\node[above left] at (4.33,2.80) {$F$};
\end{tikzpicture}
```

1. Da $A'$ traccia la parallela a $r$, che incontra $b$ in $E$; da $C'$ traccia la parallela a $r$, che incontra $d$ in $F$.
2. Il quadrilatero $ABEA'$ ha $AB \parallel A'E$ per costruzione e $AA' \parallel BE$, perché stanno sulle parallele $a$ e $b$: è un [parallelogramma](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi), quindi $A'E \cong AB$. Allo stesso modo $CDFC'$ è un parallelogramma e $C'F \cong CD$.
3. Per ipotesi $AB \cong CD$, quindi $A'E \cong C'F$.
4. $A'E$ e $C'F$ sono parallele a $r$, quindi parallele tra loro: $\widehat{B'A'E} \cong \widehat{D'C'F}$, perché sono angoli corrispondenti formati da queste due parallele con la trasversale $s$.
5. $\widehat{A'B'E} \cong \widehat{C'D'F}$, perché sono angoli corrispondenti formati dalle parallele $b$ e $d$ con la trasversale $s$.
6. I triangoli $\triangle A'EB'$ e $\triangle C'FD'$ hanno due angoli congruenti, quindi anche il terzo, perché la somma degli angoli è $180^\circ$ in entrambi: $\widehat{A'EB'} \cong \widehat{C'FD'}$.
7. Per il secondo criterio di congruenza (il lato $A'E \cong C'F$ e i due angoli adiacenti), $\triangle A'EB' \cong \triangle C'FD'$, e in particolare $A'B' \cong C'D'$.

### Dividere un segmento in parti congruenti

Con il teorema del fascio si divide un segmento $AB$ in un numero qualsiasi di parti congruenti, per esempio cinque, senza misurarlo.

1. Da $A$ traccia una semiretta qualsiasi, diversa dalla retta $AB$.
2. Sulla semiretta riporta cinque segmenti congruenti uno dopo l'altro, con il compasso o con il righello: i punti $P_1$, $P_2$, $P_3$, $P_4$, $P_5$.
3. Congiungi $P_5$ con $B$.
4. Da $P_1$, $P_2$, $P_3$, $P_4$ traccia le parallele a $P_5B$ con la squadra: incontrano $AB$ in quattro punti, che lo dividono in cinque parti congruenti.

```tikz
% nome: dividere-segmento-cinque-parti-congruenti
% alt: Il segmento AB diviso in cinque parti congruenti: sulla semiretta da A si riportano cinque segmenti congruenti fino a P5, si congiunge P5 con B e dagli altri punti si tracciano le parallele a P5B
% svg: dividere-segmento-cinque-parti-congruenti-1da6ab68.svg 231x121
\begin{tikzpicture}
\draw[thick] (0.00,0.00) -- (5.00,0.00);
\draw[thin] (0.00,0.00) -- (4.29,2.68);
\draw[thick, blue!70!black] (3.90,2.44) -- (5.00,0.00);
\draw[densely dashed, blue!70!black] (0.78,0.49) -- (1.00,0.00);
\draw[densely dashed, blue!70!black] (1.56,0.98) -- (2.00,0.00);
\draw[densely dashed, blue!70!black] (2.34,1.46) -- (3.00,0.00);
\draw[densely dashed, blue!70!black] (3.12,1.95) -- (4.00,0.00);
\draw[black] (0.34,0.33) -- (0.44,0.16);
\draw[black] (1.12,0.82) -- (1.22,0.65);
\draw[black] (1.90,1.30) -- (2.00,1.13);
\draw[black] (2.68,1.79) -- (2.78,1.62);
\draw[black] (3.46,2.28) -- (3.56,2.11);
\draw[black] (0.46,0.10) -- (0.46,-0.10);
\draw[black] (0.53,0.10) -- (0.53,-0.10);
\draw[black] (1.46,0.10) -- (1.46,-0.10);
\draw[black] (1.53,0.10) -- (1.53,-0.10);
\draw[black] (2.46,0.10) -- (2.46,-0.10);
\draw[black] (2.54,0.10) -- (2.54,-0.10);
\draw[black] (3.46,0.10) -- (3.46,-0.10);
\draw[black] (3.54,0.10) -- (3.54,-0.10);
\draw[black] (4.46,0.10) -- (4.46,-0.10);
\draw[black] (4.54,0.10) -- (4.54,-0.10);
\fill (0.78,0.49) circle (0.04);
\node[above left] at (0.78,0.49) {\scriptsize $P_1$};
\fill (1.56,0.98) circle (0.04);
\node[above left] at (1.56,0.98) {\scriptsize $P_2$};
\fill (2.34,1.46) circle (0.04);
\node[above left] at (2.34,1.46) {\scriptsize $P_3$};
\fill (3.12,1.95) circle (0.04);
\node[above left] at (3.12,1.95) {\scriptsize $P_4$};
\fill (3.90,2.44) circle (0.04);
\node[above left] at (3.90,2.44) {\scriptsize $P_5$};
\fill (1.00,0.00) circle (0.04);
\fill (2.00,0.00) circle (0.04);
\fill (3.00,0.00) circle (0.04);
\fill (4.00,0.00) circle (0.04);
\fill (0.00,0.00) circle (0.05);
\node[left] at (0.00,0.00) {$A$};
\fill (5.00,0.00) circle (0.05);
\node[right] at (5.00,0.00) {$B$};
\end{tikzpicture}
```

Il motivo: le parallele a $P_5B$, insieme alla parallela per $A$, formano un fascio tagliato dalle trasversali $AP_5$ e $AB$. Sulla prima i cinque segmenti sono congruenti per costruzione, quindi per il teorema del fascio lo sono anche i cinque segmenti corrispondenti su $AB$.

## Il teorema di Talete

Il teorema del fascio dice cosa succede ai segmenti congruenti. Il teorema di Talete dice cosa succede a due segmenti qualsiasi: il loro rapporto non cambia passando da una trasversale all'altra.

Teorema di Talete: se un fascio di rette parallele è tagliato da due trasversali, il rapporto tra due segmenti di una trasversale è uguale al rapporto tra i segmenti corrispondenti dell'altra.

$$AB : BC = A'B' : B'C'$$

```tikz
% nome: teorema-di-talete-segmenti-proporzionali
% alt: Tre rette parallele a, b, c tagliate dalle trasversali r e s: i segmenti AB e BC su r e i segmenti corrispondenti A'B' e B'C' su s
% svg: teorema-di-talete-segmenti-proporzionali-75a455a9.svg 217x143
\begin{tikzpicture}
\draw[thick] (-0.20,0.00) -- (5.00,0.00);
\node[right] at (5.00,0.00) {$a$};
\draw[thick] (-0.20,1.00) -- (5.00,1.00);
\node[right] at (5.00,1.00) {$b$};
\draw[thick] (-0.20,2.60) -- (5.00,2.60);
\node[right] at (5.00,2.60) {$c$};
\draw[thick, blue!70!black] (0.31,-0.35) -- (1.14,2.95);
\node[above] at (1.14,2.95) {$r$};
\draw[thick, blue!70!black] (1.97,-0.35) -- (5.10,2.95);
\node[above] at (5.10,2.95) {$s$};
\fill (0.40,0.00) circle (0.05);
\node[above left] at (0.40,0.00) {$A$};
\fill (0.65,1.00) circle (0.05);
\node[above left] at (0.65,1.00) {$B$};
\fill (1.05,2.60) circle (0.05);
\node[above left] at (1.05,2.60) {$C$};
\fill (2.30,0.00) circle (0.05);
\node[above left] at (2.30,0.00) {$A'$};
\fill (3.25,1.00) circle (0.05);
\node[above left] at (3.25,1.00) {$B'$};
\fill (4.77,2.60) circle (0.05);
\node[above left] at (4.77,2.60) {$C'$};
\end{tikzpicture}
```

Nella proporzione compaiono i segmenti. Quando si passa ai numeri si scrive la loro misura: $\overline{AB} = 4$ cm vuol dire che il segmento $AB$ è lungo $4$ cm, e la proporzione vale anche tra le misure, $\overline{AB} : \overline{BC} = \overline{A'B'} : \overline{B'C'}$. Vale per due segmenti qualsiasi di $r$, anche non consecutivi o uno dentro l'altro: per esempio $AB : AC = A'B' : A'C'$.

Sposta la trasversale $s$ trascinando $A'$ e $C'$, e la parallela $b$ trascinando $B$: le quattro misure cambiano, i due rapporti restano uguali tra loro.

```interattivo
% nome: talete-segmenti-proporzionali
% alt: Tre rette parallele a, b, c tagliate dalle trasversali r e s, come nella figura del teorema. Si trascinano A' e C' lungo le parallele a e c, e così cambia la trasversale s, e B lungo r, e così si sposta la parallela b. Sotto sono scritte le misure di AB, BC, A'B' e B'C' e i due rapporti AB su BC e A'B' su B'C', che restano uguali in ogni posizione
```

### Perché vale

Supponi che $AB$ e $BC$ abbiano una misura comune, un segmento $u$ che sta un numero intero di volte in tutti e due: nella figura $AB$ contiene $u$ tre volte e $BC$ due volte, quindi $AB : BC = 3 : 2$. Dai punti di divisione traccia le parallele al fascio. Su $r$ ci sono cinque segmenti congruenti, e per il teorema del fascio anche i cinque segmenti corrispondenti su $s$ sono congruenti tra loro: $A'B'$ ne contiene tre e $B'C'$ due. Quindi anche $A'B' : B'C' = 3 : 2$.

```tikz
% nome: talete-misura-comune
% alt: Sulla trasversale r il segmento AB contiene tre volte il segmento u e BC due volte; le parallele tratteggiate per i punti di divisione dividono A'B' in tre parti e B'C' in due parti congruenti tra loro
% svg: talete-misura-comune-bfb841ff.svg 247x154
\begin{tikzpicture}
\draw[thick] (-0.20,0.00) -- (5.80,0.00);
\node[right] at (5.80,0.00) {$a$};
\draw[densely dashed] (-0.20,0.55) -- (5.80,0.55);
\draw[densely dashed] (-0.20,1.10) -- (5.80,1.10);
\draw[thick] (-0.20,1.65) -- (5.80,1.65);
\node[right] at (5.80,1.65) {$b$};
\draw[densely dashed] (-0.20,2.20) -- (5.80,2.20);
\draw[thick] (-0.20,2.75) -- (5.80,2.75);
\node[right] at (5.80,2.75) {$c$};
\draw[thick, blue!70!black] (0.30,-0.35) -- (1.33,3.10);
\node[above] at (1.33,3.10) {$r$};
\draw[thick, blue!70!black] (1.95,-0.35) -- (5.40,3.10);
\node[above] at (5.40,3.10) {$s$};
\draw[black] (0.39,0.30) -- (0.58,0.25);
\draw[black] (2.48,0.32) -- (2.62,0.18);
\draw[black] (2.53,0.37) -- (2.67,0.23);
\draw[black] (0.55,0.85) -- (0.74,0.80);
\draw[black] (3.03,0.87) -- (3.17,0.73);
\draw[black] (3.08,0.92) -- (3.22,0.78);
\draw[black] (0.72,1.40) -- (0.91,1.35);
\draw[black] (3.58,1.42) -- (3.72,1.28);
\draw[black] (3.63,1.47) -- (3.77,1.33);
\draw[black] (0.88,1.95) -- (1.07,1.90);
\draw[black] (4.13,1.97) -- (4.27,1.83);
\draw[black] (4.18,2.02) -- (4.32,1.88);
\draw[black] (1.05,2.50) -- (1.24,2.45);
\draw[black] (4.68,2.52) -- (4.82,2.38);
\draw[black] (4.73,2.57) -- (4.87,2.43);
\fill (0.40,0.00) circle (0.05);
\node[above left] at (0.40,0.00) {$A$};
\fill (0.90,1.65) circle (0.05);
\node[above left] at (0.90,1.65) {$B$};
\fill (1.23,2.75) circle (0.05);
\node[above left] at (1.23,2.75) {$C$};
\fill (2.30,0.00) circle (0.05);
\node[below right] at (2.30,0.00) {$A'$};
\fill (3.95,1.65) circle (0.05);
\node[below right] at (3.95,1.65) {$B'$};
\fill (5.05,2.75) circle (0.05);
\node[below right] at (5.05,2.75) {$C'$};
\end{tikzpicture}
```

Due segmenti non hanno sempre una misura comune: il lato e la diagonale di un quadrato non ce l'hanno, perché il loro rapporto è $\sqrt{2}$, che è un [numero irrazionale](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/numeri-irrazionali-e-numeri-reali). La dimostrazione completa tratta anche questo caso, con un ragionamento che qui non facciamo; il teorema vale comunque.

### Altre forme della proporzione

Nella proporzione $AB : BC = A'B' : B'C'$ puoi scambiare i medi e ottieni ancora una proporzione, perché il prodotto dei medi e il prodotto degli estremi restano gli stessi:

$$AB : A'B' = BC : B'C'$$

Letta così, dice che il rapporto tra un segmento di $r$ e il suo corrispondente su $s$ è lo stesso per tutti i segmenti. Scegli la forma che mette l'incognita dove fa più comodo.

```ad-warning
Segmenti corrispondenti nello stesso ordine
In $AB : BC = A'B' : B'C'$ il primo rapporto va da $AB$ a $BC$ e il secondo dai loro corrispondenti, nello stesso ordine. Scrivere $AB : BC = B'C' : A'B'$ è un errore: con $\overline{AB} = 4$, $\overline{BC} = 10$ e $\overline{A'B'} = 6$ daresti $\overline{B'C'} = 2{,}4$ invece di $15$.
```

```ad-warning
I segmenti sulle parallele non entrano nella proporzione
Il teorema di Talete parla dei segmenti che le parallele staccano sulle trasversali. I segmenti che stanno sulle parallele, come $AA'$ e $BB'$ nella figura del teorema, non entrano in queste proporzioni: $AA' : BB'$ in generale non è uguale ad $AB : A'B'$. Per loro, quando formano un triangolo, serve la [similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine).
```

```ad-example
Esempio 1: il quarto segmento
Un fascio di parallele $a$, $b$, $c$ taglia la trasversale $r$ nei punti $A$, $B$, $C$ e la trasversale $s$ nei punti $A'$, $B'$, $C'$. Sai che $\overline{AB} = 4$ cm, $\overline{BC} = 10$ cm e $\overline{A'B'} = 6$ cm. Trova $B'C'$.

```tikz
% nome: talete-esempio-quarto-segmento
% alt: Tre parallele tagliate da due trasversali: su r AB misura 4 e BC misura 10, su s A'B' misura 6 e B'C' è incognito
% svg: talete-esempio-quarto-segmento-56f4495e.svg 255x177
\begin{tikzpicture}
\draw[thick] (-0.20,0.00) -- (6.02,0.00);
\node[right] at (6.02,0.00) {$a$};
\draw[thick] (-0.20,1.00) -- (6.02,1.00);
\node[right] at (6.02,1.00) {$b$};
\draw[thick] (-0.20,3.50) -- (6.02,3.50);
\node[right] at (6.02,3.50) {$c$};
\draw[thick, blue!70!black] (0.43,-0.35) -- (1.27,3.85);
\node[above] at (1.27,3.85) {$r$};
\draw[thick, blue!70!black] (2.34,-0.35) -- (5.49,3.85);
\node[above] at (5.49,3.85) {$s$};
\fill (0.50,0.00) circle (0.05);
\node[above right] at (0.50,0.00) {$A$};
\fill (0.70,1.00) circle (0.05);
\node[above right] at (0.70,1.00) {$B$};
\fill (1.20,3.50) circle (0.05);
\node[above right] at (1.20,3.50) {$C$};
\fill (2.60,0.00) circle (0.05);
\node[above left] at (2.60,0.00) {$A'$};
\fill (3.35,1.00) circle (0.05);
\node[above left] at (3.35,1.00) {$B'$};
\fill (5.22,3.50) circle (0.05);
\node[above left] at (5.22,3.50) {$C'$};
\node[left=3pt] at (0.60,0.50) {\small $4$};
\node[left=3pt] at (0.95,2.25) {\small $10$};
\node[right=3pt] at (2.98,0.50) {\small $6$};
\node[right=3pt] at (4.29,2.25) {\small $x$};
\end{tikzpicture}
```

Per il teorema di Talete $AB : BC = A'B' : B'C'$. Chiama $x$ la misura di $B'C'$ e usa la proprietà delle proporzioni: il prodotto dei medi è uguale al prodotto degli estremi:

$$
\begin{gathered}
4 : 10 = 6 : x \\
4x = 10 \cdot 6 \\
x = 15
\end{gathered}
$$

Quindi $\overline{B'C'} = 15$ cm. Controllo: $4 : 10$ e $6 : 15$ valgono entrambi $0{,}4$.
```

```ad-example
Esempio 2: un risultato decimale
Nella figura $\overline{AB} = 4$ cm, $\overline{A'B'} = 5$ cm e $\overline{B'C'} = 3{,}5$ cm. Trova $BC$.

```tikz
% nome: talete-esempio-segmento-decimale
% alt: Tre parallele tagliate da due trasversali: su r AB misura 4 e BC è incognito, su s A'B' misura 5 e B'C' misura 3,5
% svg: talete-esempio-segmento-decimale-31c91a3f.svg 253x174
\begin{tikzpicture}
\draw[thick] (-0.20,0.00) -- (5.95,0.00);
\node[right] at (5.95,0.00) {$a$};
\draw[thick] (-0.20,2.00) -- (5.95,2.00);
\node[right] at (5.95,2.00) {$b$};
\draw[thick] (-0.20,3.40) -- (5.95,3.40);
\node[right] at (5.95,3.40) {$c$};
\draw[thick, blue!70!black] (0.43,-0.35) -- (1.25,3.75);
\node[above] at (1.25,3.75) {$r$};
\draw[thick, blue!70!black] (2.34,-0.35) -- (5.41,3.75);
\node[above] at (5.41,3.75) {$s$};
\fill (0.50,0.00) circle (0.05);
\node[above right] at (0.50,0.00) {$A$};
\fill (0.90,2.00) circle (0.05);
\node[above right] at (0.90,2.00) {$B$};
\fill (1.18,3.40) circle (0.05);
\node[above right] at (1.18,3.40) {$C$};
\fill (2.60,0.00) circle (0.05);
\node[above left] at (2.60,0.00) {$A'$};
\fill (4.10,2.00) circle (0.05);
\node[above left] at (4.10,2.00) {$B'$};
\fill (5.15,3.40) circle (0.05);
\node[above left] at (5.15,3.40) {$C'$};
\node[left=3pt] at (0.70,1.00) {\small $4$};
\node[left=3pt] at (1.04,2.70) {\small $x$};
\node[right=3pt] at (3.35,1.00) {\small $5$};
\node[right=3pt] at (4.62,2.70) {\small $3{,}5$};
\end{tikzpicture}
```

$$
\begin{gathered}
AB : BC = A'B' : B'C' \\
4 : x = 5 : 3{,}5 \\
5x = 4 \cdot 3{,}5 = 14 \\
x = 2{,}8
\end{gathered}
$$

Quindi $\overline{BC} = 2{,}8$ cm. Il risultato torna: $B'C'$ è più corto di $A'B'$, e anche $BC$ è più corto di $AB$.
```

```ad-example
Esempio 3: un'incognita in due segmenti
Su $r$ il segmento $AB$ misura $x$ e $BC$ misura $x + 3$; su $s$, $\overline{A'B'} = 4$ e $\overline{B'C'} = 6$. Trova $AB$ e $BC$.

```tikz
% nome: talete-esempio-equazione
% alt: Tre parallele tagliate da due trasversali: su r AB misura x e BC misura x più 3, su s A'B' misura 4 e B'C' misura 6
% svg: talete-esempio-equazione-c89e56cd.svg 255x177
\begin{tikzpicture}
\draw[thick] (-0.20,0.00) -- (6.02,0.00);
\node[right] at (6.02,0.00) {$a$};
\draw[thick] (-0.20,1.40) -- (6.02,1.40);
\node[right] at (6.02,1.40) {$b$};
\draw[thick] (-0.20,3.50) -- (6.02,3.50);
\node[right] at (6.02,3.50) {$c$};
\draw[thick, blue!70!black] (0.43,-0.35) -- (1.27,3.85);
\node[above] at (1.27,3.85) {$r$};
\draw[thick, blue!70!black] (2.34,-0.35) -- (5.49,3.85);
\node[above] at (5.49,3.85) {$s$};
\fill (0.50,0.00) circle (0.05);
\node[above right] at (0.50,0.00) {$A$};
\fill (0.78,1.40) circle (0.05);
\node[above right] at (0.78,1.40) {$B$};
\fill (1.20,3.50) circle (0.05);
\node[above right] at (1.20,3.50) {$C$};
\fill (2.60,0.00) circle (0.05);
\node[above left] at (2.60,0.00) {$A'$};
\fill (3.65,1.40) circle (0.05);
\node[above left] at (3.65,1.40) {$B'$};
\fill (5.22,3.50) circle (0.05);
\node[above left] at (5.22,3.50) {$C'$};
\node[left=3pt] at (0.64,0.70) {\small $x$};
\node[left=3pt] at (0.99,2.45) {\small $x+3$};
\node[right=3pt] at (3.12,0.70) {\small $4$};
\node[right=3pt] at (4.44,2.45) {\small $6$};
\end{tikzpicture}
```

La proporzione dà un'[equazione di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere):

$$
\begin{gathered}
x : (x + 3) = 4 : 6 \\
6x = 4(x + 3) \\
6x = 4x + 12 \\
x = 6
\end{gathered}
$$

Quindi $\overline{AB} = 6$ e $\overline{BC} = 6 + 3 = 9$. Controllo: $6 : 9 = 4 : 6$, perché $9 \cdot 4 = 36 = 6 \cdot 6$.
```

## Il teorema di Talete nel triangolo

Teorema: una retta parallela a un lato di un triangolo divide gli altri due lati in parti proporzionali.

Nel triangolo $ABC$ la retta parallela a $BC$ incontra $AB$ in $D$ e $AC$ in $E$. Il teorema dice che

$$AD : DB = AE : EC$$

```tikz
% nome: triangolo-parallela-a-un-lato
% alt: Triangolo ABC con il segmento DE parallelo al lato BC, D su AB ed E su AC; per A passa la retta tratteggiata parallela a BC
% svg: triangolo-parallela-a-un-lato-17d89795.svg 209x142
\begin{tikzpicture}
\fill[blue!8] (1.50,2.70) -- (0.00,0.00) -- (4.40,0.00) -- cycle;
\draw[thick] (1.50,2.70) -- (0.00,0.00) -- (4.40,0.00) -- cycle;
\draw[thick, blue!70!black] (0.90,1.62) -- (2.66,1.62);
\draw[densely dashed] (0.20,2.70) -- (3.50,2.70);
\node[above] at (1.50,2.70) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (4.40,0.00) {$C$};
\node[left] at (0.90,1.62) {$D$};
\node[right] at (2.66,1.62) {$E$};
\fill (0.90,1.62) circle (0.05);
\fill (2.66,1.62) circle (0.05);
\end{tikzpicture}
```

Il motivo: traccia per $A$ la parallela a $BC$, tratteggiata nella figura. Le tre rette parallele (quella per $A$, la retta $DE$ e la retta $BC$) formano un fascio, e le rette $AB$ e $AC$ sono due trasversali. I segmenti $AD$ e $DB$ corrispondono ad $AE$ ed $EC$, quindi per il teorema di Talete $AD : DB = AE : EC$. Per lo stesso motivo valgono anche $AD : AB = AE : AC$ e $DB : AB = EC : AC$.

```ad-example
Esempio 4: una parallela a un lato
Nel triangolo $ABC$ il segmento $DE$ è parallelo a $BC$, con $D$ su $AB$ ed $E$ su $AC$. Sai che $\overline{AD} = 4$ cm, $\overline{DB} = 6$ cm e $\overline{AE} = 5$ cm. Trova $EC$ e il lato $AC$.

```tikz
% nome: triangolo-parallela-esempio
% alt: Triangolo ABC con DE parallelo a BC: AD misura 4, DB misura 6, AE misura 5, EC è incognito
% svg: triangolo-parallela-esempio-724d6c44.svg 177x130
\begin{tikzpicture}
\fill[blue!8] (1.20,2.40) -- (0.00,0.00) -- (3.54,0.00) -- cycle;
\draw[thick] (1.20,2.40) -- (0.00,0.00) -- (3.54,0.00) -- cycle;
\draw[thick, blue!70!black] (0.72,1.44) -- (2.14,1.44);
\node[above] at (1.20,2.40) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (3.54,0.00) {$C$};
\node[left] at (0.72,1.44) {$D$};
\node[right] at (2.14,1.44) {$E$};
\fill (0.72,1.44) circle (0.05);
\fill (2.14,1.44) circle (0.05);
\node at (0.58,2.11) {\small $4$};
\node at (-0.02,0.91) {\small $6$};
\node at (1.93,2.17) {\small $5$};
\node at (3.10,0.97) {\small $x$};
\end{tikzpicture}
```

$$
\begin{gathered}
AD : DB = AE : EC \\
4 : 6 = 5 : x \\
4x = 30 \\
x = 7{,}5
\end{gathered}
$$

Quindi $\overline{EC} = 7{,}5$ cm e $\overline{AC} = 5 + 7{,}5 = 12{,}5$ cm.
```

```ad-warning
Il segmento parallelo non sta in questa proporzione
Il teorema parla delle parti dei lati $AB$ e $AC$, non del segmento $DE$. Scrivere $DE : BC = AD : DB$ è un errore. La proporzione giusta è $DE : BC = AD : AB$, con il lato intero: nell'esempio 4, $DE$ è $\frac{4}{10}$ di $BC$, non $\frac{4}{6}$. Questa proporzione la dimostra la lezione sulla [similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine).
```

### Il teorema inverso

Vale anche il contrario, e serve per dimostrare che due rette sono parallele.

Teorema: se una retta divide due lati di un triangolo in parti proporzionali, allora è parallela al terzo lato.

Ipotesi: nel triangolo $ABC$, $D$ sta su $AB$, $E$ sta su $AC$ e $AD : DB = AE : EC$.

Tesi: $DE \parallel BC$.

```tikz
% nome: triangolo-parallela-teorema-inverso
% alt: Triangolo ABC con D su AB: la parallela tratteggiata a BC per D incontra AC in E', e il segmento DE arriva in un altro punto E del lato AC
% svg: triangolo-parallela-teorema-inverso-d7cba99b.svg 209x142
\begin{tikzpicture}
\fill[blue!8] (1.50,2.70) -- (0.00,0.00) -- (4.40,0.00) -- cycle;
\draw[thick] (1.50,2.70) -- (0.00,0.00) -- (4.40,0.00) -- cycle;
\draw[densely dashed, blue!70!black] (0.82,1.49) -- (2.81,1.49);
\draw[thick] (0.82,1.49) -- (3.30,1.03);
\node[above] at (1.50,2.70) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (4.40,0.00) {$C$};
\node[left] at (0.82,1.49) {$D$};
\node[right] at (3.30,1.03) {$E$};
\node[right] at (2.81,1.49) {$E'$};
\fill (0.82,1.49) circle (0.05);
\fill (3.30,1.03) circle (0.05);
\fill (2.81,1.49) circle (0.05);
\end{tikzpicture}
```

1. Per $D$ traccia la parallela a $BC$, che incontra $AC$ in un punto $E'$.
2. Per il teorema di Talete nel triangolo, $AD : DB = AE' : E'C$.
3. Dall'ipotesi e dal passo 2, i due rapporti $AE : EC$ e $AE' : E'C$ sono uguali allo stesso rapporto $AD : DB$, quindi $AE : EC = AE' : E'C$.
4. Per la proprietà del comporre (se $a : b = c : d$, allora $(a + b) : a = (c + d) : c$), $(AE + EC) : AE = (AE' + E'C) : AE'$, cioè $AC : AE = AC : AE'$.
5. Nella proporzione $AC : AE = AC : AE'$ il prodotto dei medi è uguale a quello degli estremi, $AE \cdot AC = AC \cdot AE'$: dividendo per $AC$, $AE = AE'$. I punti $E$ ed $E'$ stanno sullo stesso lato $AC$ alla stessa distanza da $A$, quindi coincidono.
6. Allora la retta $DE$ è proprio la parallela a $BC$ tracciata da $D$.

```ad-example
Esempio 5: DE è parallelo a BC?
Nel triangolo $ABC$ il punto $D$ sta su $AB$ con $\overline{AD} = 3$ e $\overline{DB} = 6$, il punto $E$ sta su $AC$ con $\overline{AE} = 4$ ed $\overline{EC} = 8$. Il segmento $DE$ è parallelo a $BC$?

```tikz
% nome: triangolo-parallela-inverso-esempio
% alt: Triangolo ABC con D su AB ed E su AC: AD misura 3, DB misura 6, AE misura 4, EC misura 8, e DE risulta parallelo a BC
% svg: triangolo-parallela-inverso-esempio-7f2ae24c.svg 172x126
\begin{tikzpicture}
\fill[blue!8] (1.00,2.30) -- (0.00,0.00) -- (3.43,0.00) -- cycle;
\draw[thick] (1.00,2.30) -- (0.00,0.00) -- (3.43,0.00) -- cycle;
\draw[thick, blue!70!black] (0.67,1.53) -- (1.81,1.53);
\node[above] at (1.00,2.30) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (3.43,0.00) {$C$};
\node[left] at (0.67,1.53) {$D$};
\node[above right] at (1.81,1.53) {$E$};
\fill (0.67,1.53) circle (0.05);
\fill (1.81,1.53) circle (0.05);
\node at (0.50,2.06) {\small $3$};
\node at (0.00,0.91) {\small $6$};
\node at (1.61,2.13) {\small $4$};
\node at (2.82,0.98) {\small $8$};
\end{tikzpicture}
```

Controlla se $3 : 6 = 4 : 8$ è una proporzione: il prodotto dei medi è $6 \cdot 4 = 24$, il prodotto degli estremi è $3 \cdot 8 = 24$. Sono uguali, quindi $AD : DB = AE : EC$ e, per il teorema inverso, $DE \parallel BC$.

Se invece $EC$ misurasse $7$, gli estremi darebbero $3 \cdot 7 = 21$, diverso da $24$: la proporzione non vale e $DE$ non è parallelo a $BC$.
```

## Il teorema della bisettrice

Teorema della bisettrice dell'angolo interno: in un triangolo la bisettrice di un angolo divide il lato opposto in due parti proporzionali agli altri due lati.

Nel triangolo $ABC$ la bisettrice dell'angolo $\hat{A}$ incontra $BC$ in $D$, e il teorema dice che $BD : DC = AB : AC$. La parte più lunga di $BC$ è quella vicina al lato più lungo.

Ipotesi: $AD$ è la bisettrice dell'angolo $\hat{A}$ del triangolo $ABC$, con $D$ su $BC$.

Tesi: $BD : DC = AB : AC$.

```tikz
% nome: teorema-bisettrice-dimostrazione
% alt: Triangolo ABC con la bisettrice AD dell'angolo in A; il lato BA è prolungato fino a E con AE congruente ad AC, e il segmento CE è parallelo ad AD; gli angoli in E e in C del triangolo ACE sono congruenti
% svg: teorema-bisettrice-dimostrazione-bf94784e.svg 194x162
\begin{tikzpicture}
\fill[blue!8] (1.60,1.40) -- (0.00,0.00) -- (4.00,0.00) -- cycle;
\draw[thick] (1.60,1.40) -- (0.00,0.00) -- (4.00,0.00) -- cycle;
\draw[thick, blue!70!black] (1.60,1.40) -- (1.73,0.00);
\draw[densely dashed] (1.60,1.40) -- (3.69,3.23);
\draw[densely dashed] (4.00,0.00) -- (3.69,3.23);
\draw[black] (1.28,1.12) arc[start angle=-138.81, delta angle=54.28, radius=0.42];
\draw[black] (1.47,1.07) -- (1.42,0.94);
\draw[black] (1.64,0.98) arc[start angle=-84.54, delta angle=54.28, radius=0.42];
\draw[black] (1.79,1.11) -- (1.86,0.99);
\draw[black] (3.35,2.93) arc[start angle=-138.81, delta angle=54.28, radius=0.45];
\draw[black] (3.30,2.89) arc[start angle=-138.81, delta angle=54.28, radius=0.52];
\draw[black] (3.64,0.21) arc[start angle=149.74, delta angle=-54.28, radius=0.42];
\draw[black] (3.58,0.25) arc[start angle=149.74, delta angle=-54.28, radius=0.49];
\draw[black] (2.58,2.39) -- (2.71,2.24);
\draw[black] (2.85,0.79) -- (2.75,0.61);
\node[left] at (1.60,1.40) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (4.00,0.00) {$C$};
\node[below] at (1.73,0.00) {$D$};
\node[above] at (3.69,3.23) {$E$};
\fill (1.73,0.00) circle (0.05);
\fill (3.69,3.23) circle (0.05);
\end{tikzpicture}
```

1. Per $C$ traccia la parallela ad $AD$, che incontra il prolungamento di $BA$ oltre $A$ in un punto $E$.
2. $\widehat{ACE} \cong \widehat{CAD}$, perché sono angoli alterni interni formati dalle parallele $AD$ ed $EC$ con la trasversale $AC$.
3. $\widehat{AEC} \cong \widehat{BAD}$, perché sono angoli corrispondenti formati dalle stesse parallele con la trasversale $BE$.
4. $\widehat{BAD} \cong \widehat{CAD}$, perché $AD$ è la bisettrice. Dai passi 2 e 3, allora, $\widehat{AEC} \cong \widehat{ACE}$: il triangolo $ACE$ ha due angoli congruenti, quindi è isoscele, con $AE \cong AC$ (i lati opposti ai due angoli congruenti).
5. Nel triangolo $BEC$ il segmento $AD$ è parallelo al lato $EC$: per il teorema di Talete nel triangolo, $BD : DC = BA : AE$.
6. Al posto di $AE$ metti il segmento congruente $AC$: $BD : DC = AB : AC$.

```ad-example
Esempio 6: le parti del lato opposto
Nel triangolo $ABC$ i lati misurano $\overline{AB} = 6$ cm, $\overline{AC} = 9$ cm e $\overline{BC} = 10$ cm. La bisettrice dell'angolo $\hat{A}$ incontra $BC$ in $D$. Trova $BD$ e $DC$.

```tikz
% nome: teorema-bisettrice-esempio
% alt: Triangolo ABC con AB di 6, AC di 9 e BC di 10; la bisettrice dell'angolo in A incontra BC in D, e BD misura x
% svg: teorema-bisettrice-esempio-9b4fd0ad.svg 194x122
\begin{tikzpicture}
\fill[blue!8] (1.10,2.13) -- (0.00,0.00) -- (4.00,0.00) -- cycle;
\draw[thick] (1.10,2.13) -- (0.00,0.00) -- (4.00,0.00) -- cycle;
\draw[thick, blue!70!black] (1.10,2.13) -- (1.60,0.00);
\draw[black] (0.89,1.73) arc[start angle=-117.28, delta angle=40.47, radius=0.45];
\draw[black] (1.05,1.76) -- (1.04,1.62);
\draw[black] (1.20,1.69) arc[start angle=-76.81, delta angle=40.47, radius=0.45];
\draw[black] (1.31,1.82) -- (1.39,1.70);
\node[above] at (1.10,2.13) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (4.00,0.00) {$C$};
\node[below] at (1.60,0.00) {$D$};
\fill (1.60,0.00) circle (0.05);
\node at (0.30,1.19) {\small $6$};
\node at (2.72,1.29) {\small $9$};
\node at (0.80,-0.28) {\small $x$};
\node at (2.80,-0.30) {\small $10 - x$};
\end{tikzpicture}
```

Chiama $x$ la misura di $BD$: allora $\overline{DC} = 10 - x$. Per il teorema della bisettrice

$$
\begin{gathered}
x : (10 - x) = 6 : 9 \\
9x = 6(10 - x) \\
9x = 60 - 6x \\
15x = 60 \\
x = 4
\end{gathered}
$$

Quindi $\overline{BD} = 4$ cm e $\overline{DC} = 6$ cm. Controllo: $4 : 6 = 6 : 9$, perché $6 \cdot 6 = 36 = 4 \cdot 9$. La parte più lunga, $DC$, è quella vicina al lato più lungo, $AC$.
```

```ad-warning
La bisettrice non passa per il punto medio
La bisettrice divide a metà l'angolo, non il lato opposto: nell'esempio 6, $\overline{BD} = 4$ cm e $\overline{DC} = 6$ cm. Arriva nel punto medio di $BC$ solo se $AB \cong AC$, cioè se il triangolo è isoscele sulla base $BC$.
```

## Il segmento che unisce i punti medi

Teorema del segmento dei punti medi: in un triangolo il segmento che unisce i punti medi di due lati è parallelo al terzo lato ed è congruente alla sua metà.

Ipotesi: nel triangolo $ABC$, $M$ è il punto medio di $AB$ e $N$ è il punto medio di $AC$.

Tesi: $MN \parallel BC$ e $MN$ è congruente alla metà di $BC$.

```tikz
% nome: segmento-punti-medi-triangolo
% alt: Triangolo ABC con M punto medio di AB, N punto medio di AC e P punto medio di BC; il segmento MN è parallelo a BC e congruente a BP e a PC; NP è tratteggiato
% svg: segmento-punti-medi-triangolo-43133372.svg 209x138
\begin{tikzpicture}
\fill[blue!8] (1.40,2.60) -- (0.00,0.00) -- (4.40,0.00) -- cycle;
\draw[thick] (1.40,2.60) -- (0.00,0.00) -- (4.40,0.00) -- cycle;
\draw[thick, blue!70!black] (0.70,1.30) -- (2.90,1.30);
\draw[densely dashed] (2.90,1.30) -- (2.20,0.00);
\draw[black] (1.14,1.90) -- (0.96,2.00);
\draw[black] (0.44,0.60) -- (0.26,0.70);
\draw[black] (2.19,2.05) -- (2.06,1.90);
\draw[black] (2.24,2.00) -- (2.11,1.85);
\draw[black] (3.69,0.75) -- (3.56,0.60);
\draw[black] (3.74,0.70) -- (3.61,0.55);
\draw[black] (1.03,0.10) -- (1.03,-0.10);
\draw[black] (1.10,0.10) -- (1.10,-0.10);
\draw[black] (1.17,0.10) -- (1.17,-0.10);
\draw[black] (3.23,0.10) -- (3.23,-0.10);
\draw[black] (3.30,0.10) -- (3.30,-0.10);
\draw[black] (3.37,0.10) -- (3.37,-0.10);
\draw[black] (1.73,1.40) -- (1.73,1.20);
\draw[black] (1.80,1.40) -- (1.80,1.20);
\draw[black] (1.87,1.40) -- (1.87,1.20);
\node[above] at (1.40,2.60) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (4.40,0.00) {$C$};
\node[left] at (0.70,1.30) {$M$};
\node[right] at (2.90,1.30) {$N$};
\node[below] at (2.20,0.00) {$P$};
\fill (0.70,1.30) circle (0.05);
\fill (2.90,1.30) circle (0.05);
\fill (2.20,0.00) circle (0.05);
\end{tikzpicture}
```

1. $AM \cong MB$ e $AN \cong NC$, quindi $AM : MB = 1 = AN : NC$: la retta $MN$ divide i lati $AB$ e $AC$ in parti proporzionali. Per il teorema inverso, $MN \parallel BC$.
2. Per $N$ traccia la parallela ad $AB$, che incontra $BC$ in $P$. Nel triangolo $ABC$ la retta $NP$ è parallela al lato $AB$, quindi $CN : NA = CP : PB$. Il primo rapporto vale $1$, quindi anche il secondo: $CP \cong PB$, e $P$ è il punto medio di $BC$.
3. Il quadrilatero $MNPB$ ha $MN \parallel BP$ (passo 1) e $NP \parallel MB$ (per costruzione): è un parallelogramma, quindi i lati opposti $MN$ e $BP$ sono congruenti.
4. $BP$ è metà di $BC$, quindi anche $MN$ è congruente alla metà di $BC$.

Il passo 2 dice anche un'altra cosa: la parallela a un lato condotta dal punto medio di un altro lato passa per il punto medio del terzo.

```ad-example
Esempio 7: il triangolo dei punti medi
Il triangolo $ABC$ ha $\overline{AB} = 8$ cm, $\overline{AC} = 10$ cm e $\overline{BC} = 12$ cm; $M$, $N$ e $P$ sono i punti medi di $AB$, $AC$ e $BC$. Trova il perimetro del triangolo $MNP$.

```tikz
% nome: triangolo-dei-punti-medi-esempio
% alt: Triangolo ABC con AB di 8, AC di 10 e BC di 12, e il triangolo MNP colorato che ha per vertici i punti medi dei tre lati
% svg: triangolo-dei-punti-medi-esempio-1ca7e04d.svg 202x134
\begin{tikzpicture}
\fill[blue!8] (1.57,2.32) -- (0.00,0.00) -- (4.20,0.00) -- cycle;
\draw[thick] (1.57,2.32) -- (0.00,0.00) -- (4.20,0.00) -- cycle;
\fill[blue!20] (0.79,1.16) -- (2.89,1.16) -- (2.10,0.00) -- cycle;
\draw[thick, blue!70!black] (0.79,1.16) -- (2.89,1.16) -- (2.10,0.00) -- cycle;
\node[above] at (1.57,2.32) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (4.20,0.00) {$C$};
\node[left] at (0.79,1.16) {$M$};
\node[right] at (2.89,1.16) {$N$};
\node[below] at (2.10,0.00) {$P$};
\node at (0.93,1.91) {\small $4$};
\node at (0.15,0.75) {\small $4$};
\node at (2.43,1.96) {\small $5$};
\node at (3.74,0.80) {\small $5$};
\node at (1.05,-0.45) {\small $6$};
\node at (3.15,-0.45) {\small $6$};
\end{tikzpicture}
```

Ogni lato di $MNP$ unisce i punti medi di due lati di $ABC$, quindi è metà del terzo lato: $\overline{MN} = 12 : 2 = 6$ cm, $\overline{NP} = 8 : 2 = 4$ cm, $\overline{MP} = 10 : 2 = 5$ cm. Il perimetro è $6 + 4 + 5 = 15$ cm, metà del perimetro di $ABC$, che è $30$ cm.

I quattro triangoli $AMN$, $MBP$, $NPC$ e $MNP$ hanno tutti i lati di $4$, $5$ e $6$ cm: per il terzo criterio sono congruenti.
```

```ad-example
Esempio 8: il quadrilatero dei punti medi
$ABCD$ è un quadrilatero qualsiasi e $M$, $N$, $P$, $Q$ sono i punti medi dei lati $AB$, $BC$, $CD$, $DA$. Dimostra che $MNPQ$ è un parallelogramma.

Ipotesi: $M$, $N$, $P$, $Q$ sono i punti medi di $AB$, $BC$, $CD$, $DA$.

Tesi: $MNPQ$ è un parallelogramma.

```tikz
% nome: quadrilatero-dei-punti-medi
% alt: Quadrilatero ABCD con i punti medi M, N, P, Q dei lati; il quadrilatero MNPQ colorato è un parallelogramma, con MN e QP paralleli alla diagonale AC tratteggiata
% svg: quadrilatero-dei-punti-medi-bd8da9b2.svg 205x138
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (4.30,0.30) -- (3.60,2.60) -- (0.70,2.20) -- cycle;
\draw[thick] (0.00,0.00) -- (4.30,0.30) -- (3.60,2.60) -- (0.70,2.20) -- cycle;
\fill[blue!20] (2.15,0.15) -- (3.95,1.45) -- (2.15,2.40) -- (0.35,1.10) -- cycle;
\draw[thick, blue!70!black] (2.15,0.15) -- (3.95,1.45) -- (2.15,2.40) -- (0.35,1.10) -- cycle;
\draw[densely dashed] (0.00,0.00) -- (3.60,2.60);
\draw[black] (1.07,0.17) -- (1.08,-0.02);
\draw[black] (3.22,0.32) -- (3.23,0.13);
\draw[black] (4.04,0.81) -- (4.23,0.87);
\draw[black] (4.02,0.88) -- (4.21,0.94);
\draw[black] (3.69,1.96) -- (3.88,2.02);
\draw[black] (3.67,2.03) -- (3.86,2.09);
\draw[black] (2.96,2.41) -- (2.93,2.61);
\draw[black] (2.89,2.40) -- (2.86,2.60);
\draw[black] (2.82,2.39) -- (2.79,2.59);
\draw[black] (1.51,2.21) -- (1.48,2.41);
\draw[black] (1.44,2.20) -- (1.41,2.40);
\draw[black] (1.37,2.19) -- (1.34,2.39);
\draw[black] (0.65,1.71) -- (0.46,1.77);
\draw[black] (0.63,1.65) -- (0.44,1.71);
\draw[black] (0.61,1.59) -- (0.42,1.65);
\draw[black] (0.59,1.53) -- (0.40,1.59);
\draw[black] (0.30,0.61) -- (0.11,0.67);
\draw[black] (0.28,0.55) -- (0.09,0.61);
\draw[black] (0.26,0.49) -- (0.07,0.55);
\draw[black] (0.24,0.43) -- (0.05,0.49);
\node[below left] at (0.00,0.00) {$A$};
\node[below right] at (4.30,0.30) {$B$};
\node[above right] at (3.60,2.60) {$C$};
\node[above left] at (0.70,2.20) {$D$};
\node[below] at (2.15,0.15) {$M$};
\node[right] at (3.95,1.45) {$N$};
\node[above] at (2.15,2.40) {$P$};
\node[left] at (0.35,1.10) {$Q$};
\end{tikzpicture}
```

1. Traccia la diagonale $AC$. Nel triangolo $ABC$, $MN$ unisce i punti medi di $AB$ e $BC$: per il teorema dei punti medi $MN \parallel AC$ e $MN$ è metà di $AC$.
2. Nel triangolo $ACD$, $QP$ unisce i punti medi di $AD$ e $CD$: allo stesso modo $QP \parallel AC$ e $QP$ è metà di $AC$.
3. Quindi $MN \parallel QP$, perché sono parallele alla stessa retta, e $MN \cong QP$, perché sono metà dello stesso segmento.
4. Il quadrilatero $MNPQ$ ha due lati opposti paralleli e congruenti: per la condizione 4 della lezione [Parallelogrammi e trapezi](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi), è un parallelogramma.
```

## Problemi con le proporzioni

Nei problemi il teorema di Talete compare con una grandezza nota in tutto e le parti da trovare, e si risolve dividendo in parti proporzionali, come nella lezione sulle [proporzioni](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).

```ad-example
Esempio 9: tre lotti tra due strade
Tre lotti di terreno stanno tra due strade rettilinee $r$ e $s$, e i confini tra un lotto e l'altro sono paralleli. Sulla strada $r$ i lotti hanno i fronti di $20$ m, $30$ m e $50$ m; sulla strada $s$ i tre fronti insieme misurano $120$ m. Trova i fronti sulla strada $s$.

```tikz
% nome: talete-lotti-tra-due-strade
% alt: Tre lotti di terreno tra la strada r e la strada s, separati da confini paralleli: su r i fronti misurano 20, 30 e 50 metri, su s sono incogniti
% svg: talete-lotti-tra-due-strade-92d4f0ae.svg 180x139
\begin{tikzpicture}
\fill[green!15] (0.30,0.00) -- (2.40,0.00) -- (2.71,0.52) -- (0.36,0.52) -- cycle;
\fill[orange!18] (0.36,0.52) -- (2.71,0.52) -- (3.18,1.30) -- (0.46,1.30) -- cycle;
\fill[green!15] (0.46,1.30) -- (3.18,1.30) -- (3.96,2.60) -- (0.61,2.60) -- cycle;
\draw[thick] (0.05,0.00) -- (2.65,0.00);
\draw[thick] (0.11,0.52) -- (2.96,0.52);
\draw[thick] (0.21,1.30) -- (3.43,1.30);
\draw[thick] (0.36,2.60) -- (4.21,2.60);
\draw[thick, blue!70!black] (0.26,-0.30) -- (0.65,2.90);
\node[above] at (0.65,2.90) {$r$};
\draw[thick, blue!70!black] (2.22,-0.30) -- (4.14,2.90);
\node[above] at (4.14,2.90) {$s$};
\node[left=3pt] at (0.33,0.26) {\small $20$};
\node[left=3pt] at (0.41,0.91) {\small $30$};
\node[left=3pt] at (0.53,1.95) {\small $50$};
\node[right=3pt] at (2.56,0.26) {\small $x$};
\node[right=3pt] at (2.95,0.91) {\small $y$};
\node[right=3pt] at (3.57,1.95) {\small $z$};
\node at (1.44,0.26) {\scriptsize primo};
\node at (1.68,0.91) {\scriptsize secondo};
\node at (2.05,1.95) {\scriptsize terzo};
\end{tikzpicture}
```

I confini sono un fascio di parallele e le due strade sono trasversali. Il rapporto tra un fronte su $s$ e il fronte corrispondente su $r$ è lo stesso per tutti, ed è uguale al rapporto tra i fronti totali, $120 : 100$:

$$
\begin{gathered}
x : 20 = 120 : 100 \\
x = \frac{20 \cdot 120}{100} = 24
\end{gathered}
$$

Allo stesso modo $y = \dfrac{30 \cdot 120}{100} = 36$ e $z = \dfrac{50 \cdot 120}{100} = 60$: i fronti su $s$ misurano $24$ m, $36$ m e $60$ m. Controllo: $24 + 36 + 60 = 120$.
```

```ad-example
Esempio 10: la bisettrice e il perimetro
Il triangolo $ABC$ ha perimetro $30$ cm. La bisettrice dell'angolo $\hat{A}$ divide il lato $BC$ in $\overline{BD} = 5$ cm e $\overline{DC} = 7$ cm. Trova $AB$ e $AC$.

```tikz
% nome: teorema-bisettrice-perimetro
% alt: Triangolo ABC con la bisettrice dell'angolo in A che divide BC in BD di 5 e DC di 7; i lati AB e AC sono incogniti
% svg: teorema-bisettrice-perimetro-3bb74ec0.svg 197x124
\begin{tikzpicture}
\fill[blue!8] (1.27,2.21) -- (0.00,0.00) -- (4.08,0.00) -- cycle;
\draw[thick] (1.27,2.21) -- (0.00,0.00) -- (4.08,0.00) -- cycle;
\draw[thick, blue!70!black] (1.27,2.21) -- (1.70,0.00);
\draw[black] (1.05,1.82) arc[start angle=-120.00, delta angle=40.89, radius=0.45];
\draw[black] (1.21,1.83) -- (1.19,1.70);
\draw[black] (1.36,1.77) arc[start angle=-79.11, delta angle=40.89, radius=0.45];
\draw[black] (1.47,1.88) -- (1.55,1.76);
\node[above] at (1.27,2.21) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (4.08,0.00) {$C$};
\node[below] at (1.70,0.00) {$D$};
\fill (1.70,0.00) circle (0.05);
\node at (0.85,-0.28) {\small $5$};
\node at (2.89,-0.28) {\small $7$};
\end{tikzpicture}
```

$\overline{BC} = 5 + 7 = 12$ cm, quindi $\overline{AB} + \overline{AC} = 30 - 12 = 18$ cm. Per il teorema della bisettrice $AB : AC = BD : DC = 5 : 7$: i due lati si dividono i $18$ cm in parti proporzionali a $5$ e $7$. Per la proprietà del comporre, $(AB + AC) : \overline{AB} = (5 + 7) : 5$, cioè

$$
\begin{gathered}
18 : \overline{AB} = 12 : 5 \\
\overline{AB} = \frac{18 \cdot 5}{12} = 7{,}5
\end{gathered}
$$

Quindi $\overline{AB} = 7{,}5$ cm e $\overline{AC} = 18 - 7{,}5 = 10{,}5$ cm. Controllo: $7{,}5 : 10{,}5 = 5 : 7$, perché $10{,}5 \cdot 5 = 52{,}5 = 7{,}5 \cdot 7$.
```
