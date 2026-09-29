# Proporzionalità diretta e dipendenza lineare

Un cilindro di alluminio con il volume doppio di un altro ha anche la massa doppia; una molla con il doppio dei pesetti appesi si allunga il doppio. In fisica questo legame si incontra ovunque, e ha una cosa in più rispetto alla matematica: la costante che lega le due grandezze è una grandezza anch'essa, con la sua unità di misura e un significato. Per i cilindri è la densità dell'alluminio, per la molla dice quanto è morbida.

La definizione e le proprietà della proporzionalità diretta, con la formula $y = kx$, sono nella lezione di matematica [Proporzionalità diretta e inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa); qui si usano su dati misurati, con le tabelle e i grafici di [Tabelle e grafici cartesiani](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/tabelle-e-grafici-cartesiani).

## La costante di proporzionalità ha un'unità

Due grandezze $x$ e $y$ sono **direttamente proporzionali** se il loro rapporto è costante:

$$\frac{y}{x} = k \qquad y = kx$$

La **costante di proporzionalità** $k$ si ottiene dividendo una misura di $y$ per una misura di $x$, quindi la sua unità è l'unità di $y$ divisa per l'unità di $x$. Se $y$ è una massa in grammi e $x$ un volume in centimetri cubi, $k$ si misura in $\text{g/cm}^3$; se $y$ è un allungamento in centimetri e $x$ una massa in grammi, $k$ si misura in $\text{cm/g}$. Un valore di $k$ senza unità non dice niente: $2{,}7$ può essere una densità in $\text{g/cm}^3$ o in $\text{kg/dm}^3$, ma non in $\text{kg/m}^3$, dove la stessa densità vale $2700$.

```ad-example
Esempio 1: la densità dell'alluminio
Sono i cilindri di alluminio della lezione sui grafici. Per ogni cilindro calcoli il rapporto tra massa e volume:

| $V$ ($\text{cm}^3$) | $m$ (g) | $m/V$ ($\text{g/cm}^3$) |
|---|---|---|
| $5{,}0$ | $13{,}4$ | $2{,}68$ |
| $10{,}0$ | $27{,}1$ | $2{,}71$ |
| $15{,}0$ | $40{,}4$ | $2{,}69$ |
| $20{,}0$ | $54{,}2$ | $2{,}71$ |
| $25{,}0$ | $67{,}3$ | $2{,}69$ |

I rapporti sono quasi uguali: massa e volume sono direttamente proporzionali, e la costante è la loro media,

$$k = \frac{2{,}68 + 2{,}71 + 2{,}69 + 2{,}71 + 2{,}69}{5} \approx 2{,}70\ \text{g/cm}^3$$

Questa costante è la densità dell'alluminio: ogni centimetro cubo di alluminio ha una massa di $2{,}70$ g. La densità è in [Grandezze derivate: area, volume e densità](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-derivate-area-volume-e-densita).
```

### Dati misurati: uguali entro l'incertezza

Con i numeri della matematica il rapporto è costante o non lo è. Con le misure non viene mai esattamente lo stesso numero, perché ogni misura ha la sua incertezza: la massa del cilindro più piccolo, $13{,}4$ g con l'incertezza di $0{,}1$ g, e il suo volume, $5{,}0\ \text{cm}^3$ con l'incertezza di $0{,}1\ \text{cm}^3$, danno un rapporto incerto di circa il $3\%$ (come si calcola è in [Incertezza relativa e propagazione delle incertezze](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/incertezza-relativa-e-propagazione-delle-incertezze)), cioè di circa $0{,}07\ \text{g/cm}^3$. Le differenze tra i rapporti della tabella, al massimo $0{,}03\ \text{g/cm}^3$, sono più piccole: i rapporti sono **uguali entro l'incertezza**, e la proporzionalità è confermata.

Se invece i rapporti cambiano sempre nello stesso verso (sempre più grandi, o sempre più piccoli) e di più di quanto permette l'incertezza, le grandezze non sono proporzionali, anche se crescono insieme.

```ad-warning
Pretendere rapporti identici
Concludere che massa e volume non sono proporzionali perché $2{,}68$ è diverso da $2{,}71$ vuol dire dimenticare che sono misure. La domanda giusta è se le differenze sono più piccole dell'incertezza, e se oscillano in su e in giù senza una tendenza.
```

## Il grafico è una retta per l'origine

Il grafico di due grandezze direttamente proporzionali è una retta che passa per l'origine: quando $x$ vale zero anche $y$ vale zero (un cilindro di volume zero non ha massa). Con dati misurati, i punti non stanno esattamente su una retta; la proporzionalità si riconosce perché una retta per l'origine riesce a passare tra tutti i punti, dentro le loro barre di incertezza.

### La pendenza e la sua unità

La **pendenza** di una retta è il rapporto tra quanto cresce $y$ e quanto cresce $x$ passando da un punto della retta a un altro:

$$\text{pendenza} = \frac{\Delta y}{\Delta x} = \frac{y_2 - y_1}{x_2 - x_1}$$

In matematica è il coefficiente angolare, spiegato in [Coefficiente angolare e retta per due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti). In fisica la pendenza ha la stessa unità di misura della costante: l'unità di $y$ divisa per l'unità di $x$. Per una retta che passa per l'origine la pendenza è proprio la costante di proporzionalità $k$.

Per calcolarla da un grafico si scelgono due punti **della retta**, non due punti misurati: la retta tiene conto di tutte le misure, un punto misurato ha il suo errore. I due punti si prendono lontani tra loro, perché le letture sul grafico sono incerte e su un $\Delta x$ grande l'incertezza pesa meno, e su una linea della griglia, così almeno una delle due coordinate si legge senza incertezza.

```tikz
% nome: pendenza-retta-cilindri-alluminio
% alt: Grafico della massa dei cilindri di alluminio in funzione del volume: la retta per l'origine passa tra i cinque punti misurati; un triangolo tratteggiato tra i punti della retta (5,0; 13,5) e (25,0; 67,5) mostra Delta V uguale a 20,0 centimetri cubi e Delta m uguale a 54,0 grammi
% svg: pendenza-retta-cilindri-alluminio-37616cfb.svg 256x221
% poi-interattivo: trascinare i due punti del triangolo lungo la retta e vedere che Delta m su Delta V resta 2,70 grammi al centimetro cubo
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin, xstep=1, ystep=0.7] (0,0) grid (5.6,4.9);
\draw[->] (0,0) -- (6,0);
\node[below] at (6.3,-0.05) {$V$ (cm$^3$)};
\draw[->] (0,0) -- (0,5.3) node[above] {$m$ (g)};
\foreach \x/\t in {1/5,2/10,3/15,4/20,5/25} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1.4/20,2.8/40,4.2/60} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (5.4,5.103);
\foreach \x/\y in {1/0.938,2/1.897,3/2.828,4/3.794,5/4.711} \fill (\x,\y) circle (0.06);
\draw[dashed, orange!90!black, thick] (1,0.945) -- (5,0.945) -- (5,4.725);
\fill[orange!90!black] (1,0.945) circle (0.07);
\fill[orange!90!black] (5,4.725) circle (0.07);
\node[below, orange!90!black] at (3,0.945) {\small $\Delta V = 20{,}0$};
\node[right, orange!90!black] at (5,2.6) {\small $\Delta m = 54{,}0$};
\end{tikzpicture}
```

Nel grafico dei cilindri, i punti della retta a $5{,}0\ \text{cm}^3$ e a $25{,}0\ \text{cm}^3$ hanno le masse $13{,}5$ g e $67{,}5$ g:

$$\text{pendenza} = \frac{67{,}5\ \text{g} - 13{,}5\ \text{g}}{25{,}0\ \text{cm}^3 - 5{,}0\ \text{cm}^3} = \frac{54{,}0\ \text{g}}{20{,}0\ \text{cm}^3} = 2{,}70\ \text{g/cm}^3$$

È la densità trovata con i rapporti, come deve essere.

```ad-example
Esempio 2: la pendenza della retta della molla
Nel grafico dell'allungamento della molla in funzione della massa appesa, la retta per l'origine passa per il punto con $m = 250$ g e $\Delta l = 10{,}0$ cm. Con l'origine come primo punto:

$$k = \frac{10{,}0\ \text{cm} - 0\ \text{cm}}{250\ \text{g} - 0\ \text{g}} = 0{,}040\ \text{cm/g}$$

La molla si allunga di $0{,}040$ cm per ogni grammo appeso, cioè di $4{,}0$ cm ogni $100$ g. Una molla più morbida avrebbe una retta più ripida, con una pendenza più grande. Nella lezione [La forza elastica e la legge di Hooke](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-elastica-e-la-legge-di-hooke) la stessa legge si scrive con la forza al posto della massa, e la costante diventa la costante elastica della molla.

```tikz
% nome: pendenza-retta-molla
% alt: La retta dell'allungamento della molla in funzione della massa, con il triangolo tratteggiato dall'origine al punto della retta (250; 10,0): Delta m uguale a 250 grammi e Delta l uguale a 10,0 centimetri
% svg: pendenza-retta-molla-4b86dd2d.svg 244x231
% poi-interattivo: spostare il secondo punto lungo la retta e leggere Delta l su Delta m, che resta 0,040 centimetri al grammo
\begin{tikzpicture}[scale=0.8]
\draw[gray!25, very thin] (0,0) grid (5.5,5.5);
\draw[->] (0,0) -- (6,0);
\node[below] at (6,-0.05) {$m$ (g)};
\draw[->] (0,0) -- (0,6) node[above] {$\Delta l$ (cm)};
\foreach \x/\t in {1/50,2/100,3/150,4/200,5/250} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/2,2/4,3/6,4/8,5/10} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (5.5,5.5);
\foreach \x/\y in {1/1.05,2/1.95,3/3.0,4/4.05,5/4.95} \fill (\x,\y) circle (0.06);
\draw[dashed, orange!90!black, thick] (5,0) -- (5,5);
\node[right, orange!90!black] at (5,2.5) {\small $\Delta l = 10{,}0$};
\fill[orange!90!black] (5,5) circle (0.07);
\end{tikzpicture}
```
```

### La pendenza non è l'angolo

La stessa retta, disegnata con scale diverse, sembra più o meno ripida: se il quadretto verticale vale meno grammi, la retta si impenna; se ne vale di più, si appiattisce. L'angolo che la retta forma con l'asse orizzontale dipende quindi dalla scala scelta, mentre la pendenza no, perché si calcola con i valori letti sugli assi.

```tikz
% nome: pendenza-non-dipende-dalla-scala
% alt: Gli stessi cinque punti dei cilindri di alluminio in due grafici con scale verticali diverse: a sinistra la retta è ripida, a destra è quasi piatta, ma in tutti e due la pendenza calcolata con i valori degli assi è 2,70 grammi al centimetro cubo
% svg: pendenza-non-dipende-dalla-scala-82f61374.svg 263x134
% poi-interattivo: allungare o schiacciare l'asse verticale e vedere cambiare l'angolo della retta mentre la pendenza scritta resta la stessa
\begin{tikzpicture}[scale=0.85]
\draw[->] (0,0) -- (2.9,0) node[right] {$V$};
\draw[->] (0,0) -- (0,3.1) node[above] {$m$};
\foreach \x/\t in {1/10,2/20} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {0.8/20,1.6/40,2.4/60} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (2.7,2.916);
\foreach \x/\y in {0.5/0.536,1/1.084,1.5/1.616,2/2.168,2.5/2.692} \fill (\x,\y) circle (0.05);
\begin{scope}[xshift=3.9cm]
\draw[->] (0,0) -- (2.9,0) node[right] {$V$};
\draw[->] (0,0) -- (0,3.1) node[above] {$m$};
\foreach \x/\t in {1/10,2/20} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {0.9/60,1.8/120,2.7/180} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (2.7,1.094);
\foreach \x/\y in {0.5/0.201,1/0.407,1.5/0.606,2/0.813,2.5/1.01} \fill (\x,\y) circle (0.05);
\end{scope}
\end{tikzpicture}
```

```ad-warning
Misurare la pendenza con il goniometro
La pendenza non si trova misurando l'angolo della retta, né contando i quadretti senza guardare quanto valgono. Si leggono le coordinate di due punti della retta, con le loro unità, e si fa il rapporto delle differenze.
```

### Una retta per ogni materiale

Cilindri di materiali diversi danno rette diverse, tutte per l'origine. Più il materiale è denso, più la sua retta è ripida: a parità di volume, un cilindro di ferro ha una massa quasi tre volte quella di uno di alluminio.

```tikz
% nome: rette-densita-tre-materiali
% alt: Tre rette per l'origine nel grafico della massa in funzione del volume: la più ripida è quella del ferro, con pendenza 7,9 grammi al centimetro cubo, poi quella dell'alluminio, 2,7, e la meno ripida quella del legno di faggio, circa 0,7
% svg: rette-densita-tre-materiali-06b25d0e.svg 251x224
% poi-interattivo: scegliere un materiale e vedere la sua retta, con la pendenza uguale alla densità
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (5,5);
\draw[->] (0,0) -- (5.4,0);
\node[below] at (5.2,-0.05) {$V$ (cm$^3$)};
\draw[->] (0,0) -- (0,5.4) node[above] {$m$ (g)};
\foreach \x/\t in {1/5,2/10,3/15,4/20} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/40,2/80,3/120,4/160} \node[left] at (0,\y) {\small $\t$};
\draw[thick, red!60!black] (0,0) -- (4.8,4.74) node[right] {\small ferro};
\draw[thick, blue!60] (0,0) -- (5,1.688) node[right] {\small alluminio};
\draw[thick, teal!70!black] (0,0) -- (5,0.438) node[right] {\small legno};
\end{tikzpicture}
```

## Prevedere un valore

Con la costante si prevede $y$ per ogni valore di $x$: $y = kx$. Senza calcolare la costante, si può usare la proprietà della proporzionalità diretta: se $x$ viene moltiplicato per un numero, anche $y$ viene moltiplicato per lo stesso numero.

```ad-example
Esempio 3: la molla con 90 g e con 360 g
Con la molla dell'esempio 2 ($k = 0{,}040\ \text{cm/g}$), quanto si allunga la molla con $90$ g? E con $360$ g?

$$
\begin{gathered}
\Delta l = 0{,}040\ \text{cm/g} \cdot 90\ \text{g} = 3{,}6\ \text{cm} \\
\Delta l = 0{,}040\ \text{cm/g} \cdot 360\ \text{g} \approx 14\ \text{cm}
\end{gathered}
$$

Il secondo valore è un'estrapolazione: $360$ g sono più di quelli appesi nell'esperimento, e la previsione vale solo se la molla continua a seguire la stessa legge (vedi [Tabelle e grafici cartesiani](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/tabelle-e-grafici-cartesiani)). Nel prodotto, i grammi si semplificano e resta l'unità della grandezza cercata: così l'unità fa anche da controllo.
```

```ad-warning
Aggiungere al posto di moltiplicare
Se con $150$ g la molla si allunga di $6{,}0$ cm, con $300$ g si allunga di $12$ cm, non di $6{,}0 + 150$ o di "$6{,}0$ cm più qualcosa". Nella proporzionalità diretta il doppio della causa dà il doppio dell'effetto: i numeri si moltiplicano, non si sommano.
```

## La dipendenza lineare

Se invece dell'allungamento misuri la lunghezza totale $L$ della molla, i numeri cambiano: la molla scarica non è lunga zero. Le due grandezze crescono insieme, ma il loro rapporto non è costante, e la retta del grafico non passa per l'origine. Due grandezze sono in **dipendenza lineare** se

$$y = mx + q$$

con $m$ e $q$ costanti. Il grafico è una retta, con pendenza $m$, che incontra l'asse verticale nel punto $(0; q)$. Il numero $q$, il **termine noto**, è il valore di $y$ quando $x$ vale zero: ha la stessa unità di $y$, e di solito un significato preciso, come la lunghezza della molla scarica o la temperatura all'inizio di un esperimento. La proporzionalità diretta è il caso particolare con $q = 0$. In matematica è la funzione lineare, nella lezione [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari).

In una dipendenza lineare non sono proporzionali le grandezze, ma le loro variazioni: $\Delta y = m \cdot \Delta x$. Per questo la pendenza si calcola sempre con le differenze, e mai con il rapporto $y/x$ di un punto solo.

```ad-example
Esempio 4: la lunghezza della molla
Con la stessa molla misuri la lunghezza totale $L$, dal gancio in alto all'indice, con la stessa incertezza di $0{,}2$ cm:

| $m$ (g) | $L$ (cm) |
|---|---|
| $0$ | $12{,}0$ |
| $50$ | $14{,}1$ |
| $100$ | $15{,}9$ |
| $150$ | $18{,}0$ |
| $200$ | $20{,}1$ |
| $250$ | $21{,}9$ |

I rapporti $L/m$ non sono costanti ($0{,}282$, $0{,}159$, $0{,}120\ \text{cm/g}$ nelle prime righe), quindi $L$ e $m$ non sono direttamente proporzionali. Le differenze invece sì: ogni $50$ g in più, la lunghezza cresce di circa $2$ cm. La retta che passa tra i punti incontra l'asse verticale a $12{,}0$ cm e passa per il punto $(250; 22{,}0)$:

$$\text{pendenza} = \frac{22{,}0\ \text{cm} - 12{,}0\ \text{cm}}{250\ \text{g} - 0\ \text{g}} = 0{,}040\ \text{cm/g} \qquad q = 12{,}0\ \text{cm}$$

La legge è $L = 0{,}040\ \text{cm/g} \cdot m + 12{,}0\ \text{cm}$. La pendenza è la stessa dell'esempio 2, perché la molla è la stessa; il termine noto è la lunghezza della molla scarica. Togliendolo si torna all'allungamento: $\Delta l = L - 12{,}0\ \text{cm}$, che è proporzionale alla massa.

```tikz
% nome: grafico-lunghezza-molla-massa
% alt: Grafico della lunghezza totale della molla in funzione della massa appesa: i sei punti stanno su una retta che non passa per l'origine ma incontra l'asse verticale a 12,0 centimetri, la lunghezza della molla scarica, segnata con L con zero
% svg: grafico-lunghezza-molla-massa-48b241d1.svg 231x246
% poi-interattivo: spostare in su e in giù la retta cambiando il termine noto, e vedere che la pendenza non cambia
\begin{tikzpicture}[scale=0.8]
\draw[gray!25, very thin] (0,0) grid (5.5,6);
\draw[->] (0,0) -- (6,0);
\node[below] at (6,-0.05) {$m$ (g)};
\draw[->] (0,0) -- (0,6.5) node[above] {$L$ (cm)};
\foreach \x/\t in {1/50,2/100,3/150,4/200,5/250} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/4,2/8,3/12,4/16,5/20} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,3) -- (5.5,5.75);
\foreach \x/\y in {0/3.0,1/3.525,2/3.975,3/4.5,4/5.025,5/5.475} \fill (\x,\y) circle (0.06);
\node at (1.1,2.1) {\small $L_0$};
\draw[->, thin] (0.9,2.25) -- (0.1,2.9);
\end{tikzpicture}
```
```

```ad-warning
La pendenza calcolata con un punto solo
Nella retta della lunghezza della molla il punto $(250; 22{,}0)$ dà $\dfrac{22{,}0}{250} = 0{,}088\ \text{cm/g}$, più del doppio della pendenza vera. Il rapporto $y/x$ di un punto è la pendenza solo se la retta passa per l'origine. Per una retta qualsiasi servono due punti e le differenze.
```

```ad-example
Esempio 5: l'acqua sul fornello
Scaldi dell'acqua su un fornello e ne misuri la temperatura ogni minuto:

| $t$ (min) | $T$ ($^\circ$C) |
|---|---|
| $0$ | $18$ |
| $1$ | $22$ |
| $2$ | $26$ |
| $3$ | $31$ |
| $4$ | $34$ |
| $5$ | $38$ |

Ogni minuto la temperatura sale di circa $4$ °C (gli aumenti sono $4$, $4$, $5$, $3$, $4$), quindi $T$ dipende da $t$ in modo lineare. La retta che passa tra i punti va da $18$ °C a $t = 0$ a $38$ °C a $t = 5$ min:

$$m = \frac{38\ ^\circ\text{C} - 18\ ^\circ\text{C}}{5\ \text{min} - 0\ \text{min}} = 4{,}0\ ^\circ\text{C/min} \qquad q = 18\ ^\circ\text{C}$$

La pendenza è la velocità con cui l'acqua si scalda; il termine noto è la temperatura iniziale dell'acqua. Se il fornello continua a scaldare allo stesso modo, dopo $7$ minuti l'acqua è a $18 + 4{,}0 \cdot 7 = 46$ °C. Non a $26 \cdot 3{,}5 = 91$ °C, come se la temperatura fosse proporzionale al tempo: $7$ minuti sono $3{,}5$ volte $2$ minuti, ma con il termine noto la temperatura non si moltiplica per $3{,}5$.

```tikz
% nome: grafico-riscaldamento-acqua
% alt: Grafico della temperatura dell'acqua in funzione del tempo: sei punti da 18 gradi a 0 minuti a 38 gradi a 5 minuti, con una retta che passa tra i punti e incontra l'asse verticale a 18 gradi
% svg: grafico-riscaldamento-acqua-429b9e5b.svg 245x217
% poi-interattivo: prolungare la retta e leggere la temperatura prevista a ogni minuto
\begin{tikzpicture}[scale=0.9]
\draw[gray!25, very thin, xstep=0.9, ystep=0.5] (0,0) grid (5.2,4.5);
\draw[->] (0,0) -- (5.6,0);
\node[below] at (5.65,-0.05) {$t$ (min)};
\draw[->] (0,0) -- (0,4.9) node[above] {$T$ ($^\circ$C)};
\foreach \x/\t in {0.9/1,1.8/2,2.7/3,3.6/4,4.5/5} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/10,2/20,3/30,4/40} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,1.8) -- (5.2,4.111);
\foreach \x/\y in {0/1.8,0.9/2.2,1.8/2.6,2.7/3.1,3.6/3.4,4.5/3.8} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```
```

## Riconoscere la legge dai dati

Davanti a una tabella di misure, per decidere se le grandezze sono in proporzionalità diretta o in dipendenza lineare:

1. Calcola il rapporto $y/x$ per ogni riga. Se è costante entro l'incertezza, le grandezze sono direttamente proporzionali, e la costante è la media dei rapporti, con l'unità di $y$ divisa per l'unità di $x$.
2. Se il rapporto non è costante, calcola le variazioni: $\dfrac{\Delta y}{\Delta x}$ tra una riga e la successiva. Se è costante entro l'incertezza, la dipendenza è lineare, con pendenza $m$; il termine noto è il valore di $y$ per $x = 0$, oppure $q = y - mx$ calcolato con una riga.
3. Controlla sul grafico: nel primo caso la retta passa per l'origine, nel secondo incontra l'asse verticale in $q$.
4. Se nemmeno le variazioni sono costanti, il grafico è una curva: la legge è un'altra, per esempio una di quelle di [Proporzionalità inversa e quadratica](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica).

È lo stesso procedimento della lezione di matematica, con due differenze: "costante" vuol dire uguale entro l'incertezza, e ogni numero ha un'unità.

```ad-example
Esempio 6: un carrello sulla rotaia
Un carrello scorre su una rotaia a cuscino d'aria. Da un video si ricava la sua posizione $s$, letta su un metro accanto alla rotaia, a intervalli di un secondo:

| $t$ (s) | $s$ (cm) |
|---|---|
| $0$ | $20$ |
| $1{,}0$ | $35$ |
| $2{,}0$ | $51$ |
| $3{,}0$ | $65$ |
| $4{,}0$ | $80$ |

I rapporti $s/t$ valgono $35$, $25{,}5$, $21{,}7$, $20\ \text{cm/s}$: non sono costanti, e diminuiscono sempre. Le variazioni in un secondo invece sono $15$, $16$, $14$, $15$ cm, uguali entro l'incertezza della lettura: la dipendenza è lineare. Con il primo e l'ultimo punto della retta:

$$m = \frac{80\ \text{cm} - 20\ \text{cm}}{4{,}0\ \text{s} - 0\ \text{s}} = 15\ \text{cm/s} \qquad q = 20\ \text{cm}$$

La pendenza è la velocità del carrello, il termine noto la sua posizione quando è partito il cronometro. È il moto rettilineo uniforme, con il grafico di [Il moto rettilineo uniforme e il grafico spazio-tempo](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-rettilineo-uniforme-e-il-grafico-spazio-tempo).
```

## Errori frequenti

```ad-warning
La costante senza unità
Scrivere "$k = 2{,}70$" per la densità dell'alluminio, o "la pendenza è $4$" per l'acqua sul fornello, lascia a metà il risultato: $2{,}70\ \text{g/cm}^3$ e $4{,}0\ ^\circ\text{C/min}$ dicono che cosa misura la costante. L'unità si ottiene dividendo le unità, come i numeri.
```

```ad-warning
La retta costretta a passare per l'origine
Se i punti stanno su una retta che non passa per l'origine, disegnare comunque una retta per l'origine, perché "le grandezze crescono insieme", dà una pendenza sbagliata e nasconde il termine noto. La retta si traccia tra i punti, e dove incontra l'asse verticale lo decidono i dati.
```
