# Forze conservative ed energia potenziale

Per portare una valigia dal piano terra al terzo piano puoi prendere le scale, una rampa o l'ascensore: il lavoro che il peso compie sulla valigia è lo stesso, perché dipende solo dal dislivello. Se invece trascini una cassa sul pavimento da un angolo all'altro di una stanza, il lavoro dell'attrito cambia con la strada: più giri fai, più energia l'attrito ti porta via. Questa differenza divide le forze in due famiglie. Per le forze della prima, come il peso e la forza elastica, si può definire un'energia potenziale; per le altre, come l'attrito, no.

## Lo stesso spostamento lungo due cammini

Nel biennio hai visto che il lavoro del peso su un corpo che passa dall'altezza $h_i$ all'altezza $h_f$ è $W_P = m g (h_i - h_f)$, qualunque strada il corpo abbia fatto: in verticale, lungo un piano inclinato, su una scala ([Energia potenziale gravitazionale ed elastica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/energia-potenziale-gravitazionale-ed-elastica)). Il motivo è che il peso è verticale, e lungo ogni tratto del cammino lavora solo quanto il corpo sale o scende: gli spostamenti orizzontali non contano.

Con l'attrito dinamico le cose vanno in un altro modo. L'[attrito](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito) è sempre opposto al moto, quindi su ogni tratto compie un lavoro negativo, e questi lavori si sommano: su un pavimento orizzontale, dove l'attrito ha modulo costante $F_d = \mu_d\, m g$, il lavoro lungo un cammino di lunghezza $l$ è

$$W_{attrito} = -F_d \cdot l$$

Conta tutta la strada percorsa, non la distanza tra la partenza e l'arrivo.

```ad-example
Esempio 1: una cassa trascinata lungo due cammini
Una cassa di $20\,\text{kg}$ va trascinata dall'angolo $A$ all'angolo opposto $B$ di una stanza di $4{,}0\,\text{m}$ per $3{,}0\,\text{m}$, con $\mu_d = 0{,}30$. Quanto lavoro compie l'attrito se la cassa va dritta lungo la diagonale? E se segue le due pareti?

L'attrito vale

$$F_d = \mu_d\, m g = 0{,}30 \cdot 20\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 58{,}8\,\text{N}$$

La diagonale è lunga $\sqrt{(4{,}0\,\text{m})^2 + (3{,}0\,\text{m})^2} = 5{,}0\,\text{m}$, le due pareti insieme $7{,}0\,\text{m}$:

$$W_1 = -58{,}8\,\text{N} \cdot 5{,}0\,\text{m} = -294\,\text{J} \approx -2{,}9 \cdot 10^2\,\text{J}$$

$$W_2 = -58{,}8\,\text{N} \cdot 7{,}0\,\text{m} = -411{,}6\,\text{J} \approx -4{,}1 \cdot 10^2\,\text{J}$$

Partenza e arrivo sono gli stessi, ma il lavoro no. Il peso, su questo pavimento orizzontale, compie lavoro zero lungo tutti e due i cammini.

```tikz
% nome: cassa-due-cammini-attrito
% alt: Una stanza rettangolare vista dall'alto, larga 4,0 metri e profonda 3,0 metri, con il punto A nell'angolo in basso a sinistra e il punto B nell'angolo opposto. Due cammini portano da A a B: il cammino 1, arancione, lungo la diagonale di 5,0 metri, e il cammino 2, blu, lungo le due pareti, 4,0 metri più 3,0 metri
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (4,3);
\draw[thick, orange!90!black, -{Stealth}] (0.08,0.06) -- (3.92,2.94);
\draw[thick, blue, -{Stealth}] (0.1,-0.12) -- (4.12,-0.12) -- (4.12,2.9);
\fill (0,0) circle (1.5pt) node[below left] {$A$};
\fill (4,3) circle (1.5pt) node[above right] {$B$};
\node[above left] at (2,1.5) {\small $1$: $5{,}0$ m};
\node[below] at (2,-0.12) {\small $2$: $4{,}0$ m};
\node[right] at (4.12,1.4) {\small $3{,}0$ m};
\end{tikzpicture}
```
```

Nella figura qui sotto un corpo di $2{,}0\,\text{kg}$ scende da $A$ a $B$ passando per il punto $C$, che puoi spostare; lungo il cammino è frenato da un attrito di modulo costante, $5{,}0\,\text{N}$. Comunque sposti $C$, il lavoro del peso resta $58{,}8\,\text{J}$: se il cammino sale più in alto di $A$, il lavoro negativo della salita è compensato da quello della discesa più lunga. Il lavoro dell'attrito è $-25\,\text{J}$ sul cammino diritto, lungo $5{,}0\,\text{m}$, e diventa più negativo a ogni allungamento della strada.

```interattivo
% nome: lavoro-due-cammini-peso-attrito
% alt: Un corpo di 2,0 chilogrammi va dal punto A, in alto a sinistra, al punto B, 3,0 metri più in basso e 4,0 metri più a destra, lungo due segmenti che si incontrano nel punto C, che si trascina. Sotto la figura sono scritti la lunghezza del cammino, il lavoro del peso sui due tratti e in totale, che resta 58,8 joule comunque si sposti C, e il lavoro di un attrito di 5,0 newton, che cresce in valore assoluto con la lunghezza del cammino
```

## Forze conservative e forze non conservative

Una forza è **conservativa** se il lavoro che compie su un corpo che si sposta da un punto $A$ a un punto $B$ dipende solo da $A$ e da $B$, e non dal cammino seguito. Una forza per cui il lavoro cambia con il cammino è **non conservativa**.

Il peso è conservativo. Lo è anche la forza elastica di una molla: nella lezione sul [lavoro di una forza variabile](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/il-lavoro-di-una-forza-variabile) il suo lavoro, quando la deformazione passa da $x_i$ a $x_f$, risulta

$$W_{el} = \frac{1}{2} k x_i^2 - \frac{1}{2} k x_f^2$$

e dentro ci sono solo la deformazione iniziale e quella finale. La molla può essere stata allungata e accorciata più volte nel frattempo: il lavoro totale è lo stesso.

Sono non conservativi l'attrito dinamico e la resistenza dell'aria o dell'acqua, cioè le forze dissipative del biennio, ma anche la spinta di una mano, la trazione di una fune o di un motore: forze che non sono fissate dalla posizione del corpo, e il cui lavoro dipende da come si svolge il moto.

### Il lavoro su un cammino chiuso

Un **cammino chiuso** è un cammino che torna al punto di partenza. Per una forza conservativa il lavoro su un cammino chiuso è sempre zero:

$$W_{A \to A} = 0$$

Infatti il lavoro dipende solo dagli estremi, e un cammino chiuso ha gli stessi estremi del "cammino" di un corpo che resta fermo in $A$, su cui il lavoro è zero.

Vale anche il contrario: se il lavoro di una forza è zero su ogni cammino chiuso, la forza è conservativa. Presi due cammini da $A$ a $B$, percorri il primo all'andata e il secondo al ritorno. Una forza che dipende solo dalla posizione, sul cammino percorso al contrario, compie il lavoro opposto: il giro completo dà $W_1 - W_2 = 0$, cioè $W_1 = W_2$. Le due proprietà sono quindi due modi di dire la stessa cosa.

```tikz
% nome: cammino-chiuso-due-percorsi
% alt: Due punti A e B uniti da due cammini curvi: il cammino 1, in alto, con una freccia da A verso B, e il cammino 2, in basso, con una freccia da B verso A. Insieme formano un cammino chiuso che parte da A e torna in A
\begin{tikzpicture}
\draw[thick, blue, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}] (0,0) .. controls (1.2,1.8) and (3.4,1.9) .. (5,0.6);
\draw[thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}] (5,0.6) .. controls (4.0,-1.2) and (1.6,-1.3) .. (0,0);
\fill (0,0) circle (1.5pt) node[left] {$A$};
\fill (5,0.6) circle (1.5pt) node[right] {$B$};
\node[above] at (2.5,1.45) {\small cammino $1$};
\node[below] at (2.5,-0.95) {\small cammino $2$};
\end{tikzpicture}
```

```ad-example
Esempio 2: andata e ritorno
Un sasso di $0{,}50\,\text{kg}$ viene lanciato verso l'alto, sale di $4{,}0\,\text{m}$ e torna nella mano che lo ha lanciato. Quanto lavoro ha compiuto il peso? La cassa dell'esempio 1 viene trascinata da $A$ a $B$ lungo la diagonale e poi riportata in $A$ per la stessa strada. Quanto lavoro ha compiuto l'attrito?

Nella salita il peso è opposto allo spostamento, nella discesa ha lo stesso verso:

$$W_P = -m g h + m g h = -19{,}6\,\text{J} + 19{,}6\,\text{J} = 0$$

con $m g h = 0{,}50\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 4{,}0\,\text{m} = 19{,}6\,\text{J}$. L'attrito invece è opposto al moto sia all'andata sia al ritorno:

$$W_{attrito} = -294\,\text{J} - 294\,\text{J} = -588\,\text{J} \approx -5{,}9 \cdot 10^2\,\text{J}$$

Il cammino è chiuso in tutti e due i casi, ma solo per il peso il lavoro totale è zero.
```

```ad-warning
Al ritorno l'attrito non restituisce niente
Per una forza conservativa il lavoro del ritorno è l'opposto di quello dell'andata. Per l'attrito no: cambia verso insieme al moto, e il suo lavoro è negativo in tutti e due i sensi. Chi scrive zero per il lavoro dell'attrito su un'andata e ritorno ha trattato l'attrito come il peso.
```

## L'energia potenziale di una forza conservativa

Poiché il lavoro di una forza conservativa dipende solo dal punto di partenza e da quello di arrivo, lo si può scrivere come differenza tra i valori che una grandezza assume in quei due punti. Questa grandezza è l'**energia potenziale** $U$ associata alla forza, definita in modo che

$$W_{A \to B} = U_A - U_B = -\Delta U$$

Il lavoro di una forza conservativa è l'opposto della variazione dell'energia potenziale. Quando la forza compie un lavoro positivo l'energia potenziale diminuisce (il sasso che cade, la molla che torna a riposo); quando il lavoro è negativo l'energia potenziale aumenta (il sasso che sale, la molla che viene tesa).

La definizione fissa solo le differenze di energia potenziale. Per dare un valore a $U$ in ogni punto si sceglie un punto in cui $U = 0$, il livello di riferimento, e la scelta è libera: cambiandola tutti i valori di $U$ si spostano della stessa quantità, e le differenze restano quelle.

Ogni forza conservativa ha la sua energia potenziale. Le due che conosci si ottengono confrontando la definizione con il lavoro della forza:

| forza conservativa | lavoro da $A$ a $B$ | energia potenziale |
|---|---|---|
| peso | $m g h_A - m g h_B$ | $U = m g h$ |
| forza elastica | $\tfrac{1}{2} k x_A^2 - \tfrac{1}{2} k x_B^2$ | $U = \tfrac{1}{2} k x^2$ |

Più avanti ne incontrerai altre: quella della forza di gravità tra due corpi lontani ([L'energia potenziale gravitazionale e la velocità di fuga](/materiale/scuola-superiore/fisica/la-gravitazione/l-energia-potenziale-gravitazionale-e-la-velocita-di-fuga)) e, al quarto anno, quella della forza elettrica. Per una forza non conservativa un'energia potenziale non esiste: il lavoro da $A$ a $B$ non ha un valore solo, e non può essere la differenza $U_A - U_B$.

```ad-example
Esempio 3: il lavoro di una molla dall'energia potenziale
Una molla con $k = 200\,\text{N/m}$ è allungata di $5{,}0\,\text{cm}$; una mano la tira fino a un allungamento di $15\,\text{cm}$. Quanto lavoro compie la forza elastica? E se poi la molla torna all'allungamento di $5{,}0\,\text{cm}$?

Con $x_A = 0{,}050\,\text{m}$ e $x_B = 0{,}15\,\text{m}$ le energie potenziali sono

$$U_A = \frac{1}{2} \cdot 200\,\text{N/m} \cdot (0{,}050\,\text{m})^2 = 0{,}25\,\text{J}$$

$$U_B = \frac{1}{2} \cdot 200\,\text{N/m} \cdot (0{,}15\,\text{m})^2 = 2{,}25\,\text{J}$$

$$W_{el} = U_A - U_B = 0{,}25\,\text{J} - 2{,}25\,\text{J} = -2{,}0\,\text{J}$$

Il lavoro è negativo, perché la forza elastica tira verso la posizione di riposo mentre la molla si allunga, e l'energia potenziale è aumentata di $2{,}0\,\text{J}$. Al ritorno i ruoli di $A$ e $B$ si scambiano: $W_{el} = 2{,}25\,\text{J} - 0{,}25\,\text{J} = +2{,}0\,\text{J}$. Sul cammino chiuso il lavoro totale è zero.
```

```ad-warning
Il segno: lavoro uguale a meno la variazione
$W = -\Delta U = U_A - U_B$, cioè energia potenziale iniziale meno finale. Scrivendo $W = U_B - U_A$ il segno viene rovesciato. Il controllo è il sasso che cade: l'energia potenziale diminuisce, e il lavoro del peso deve venire positivo.
```

### Perché si chiamano conservative

Se su un corpo compiono lavoro solo forze conservative, il [teorema dell'energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) $W = \Delta K$ e la definizione $W = -\Delta U$ danno $\Delta K + \Delta U = 0$: l'energia meccanica $E = K + U$ si conserva. È la [conservazione dell'energia meccanica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica) del biennio, che ora vale per qualunque forza conservativa, con la sua energia potenziale al posto di $m g h$ o di $\tfrac{1}{2} k x^2$. Quando lavorano anche forze non conservative l'energia meccanica cambia, e di quanto cambia lo dice la lezione [Il bilancio dell'energia con le forze non conservative](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/il-bilancio-dell-energia-con-le-forze-non-conservative).

## Il grafico dell'energia potenziale

Per un corpo che si muove lungo una retta, l'asse $x$, l'energia potenziale è una funzione della posizione, e il suo grafico racconta il moto prima ancora di fare un conto. L'esempio più semplice è un blocco attaccato a una molla, con $x$ misurata dalla posizione di riposo: il grafico di $U = \tfrac{1}{2} k x^2$ è una [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) con il vertice nell'origine.

```tikz
% nome: energia-potenziale-molla-parabola
% alt: Il grafico dell'energia potenziale di una molla con costante elastica 200 newton al metro in funzione della deformazione x, da meno 10 a 10 centimetri: una parabola con il vertice nell'origine, che arriva a 1,0 joule agli estremi. Una retta orizzontale tratteggiata segna l'energia meccanica E uguale a 0,64 joule e incontra la parabola nei due punti di inversione, a meno 8 e a 8 centimetri. Nel punto x uguale a 5 centimetri un segmento verticale arancione sotto la parabola, lungo 0,25 joule, è l'energia potenziale U, e un segmento blu dalla parabola alla retta, lungo 0,39 joule, è l'energia cinetica K
% poi-interattivo: spostare la retta dell'energia meccanica e leggere i punti di inversione
\begin{tikzpicture}
\draw[gray!25, very thin] (-3,0) grid[xstep=0.6, ystep=0.6] (3,3);
\draw[->] (-3.4,0) -- (3.6,0) node[right] {$x$ (cm)};
\draw[->] (0,-0.3) -- (0,3.6) node[above] {$U$ (J)};
\foreach \x/\l in {-3/-10, -1.5/-5, 1.5/5, 3/10} \draw (\x,0.06) -- (\x,-0.06) node[below] {\small $\l$};
\foreach \y/\l in {1.5/0{,}5, 3/1{,}0} \draw (0.06,\y) -- (-0.06,\y) node[left] {\small $\l$};
\draw[thick, blue] plot[domain=-3:3, samples=41] (\x, {\x*\x/3});
\draw[dashed, thick] (-3,1.92) -- (3,1.92) node[right] {\small $E$};
\fill (-2.4,1.92) circle (1.5pt);
\fill (2.4,1.92) circle (1.5pt);
\draw[dashed, thin] (-2.4,1.92) -- (-2.4,0);
\draw[dashed, thin] (2.4,1.92) -- (2.4,0);
\draw[very thick, orange!90!black] (1.5,0) -- (1.5,0.75);
\draw[very thick, blue!60!black] (1.5,0.75) -- (1.5,1.92);
\node[right] at (1.5,0.32) {\small $U$};
\node[right] at (1.5,1.4) {\small $K$};
\end{tikzpicture}
```

Su un grafico così si leggono quattro cose.

### L'energia cinetica

Se l'energia meccanica $E$ si conserva, la si disegna come una retta orizzontale. In ogni posizione l'energia cinetica è quello che manca a $U$ per arrivare a $E$:

$$K = E - U$$

cioè la distanza verticale tra il grafico e la retta. Dove il grafico è più basso il corpo è più veloce.

### I punti di inversione

L'energia cinetica non può essere negativa, quindi il corpo può trovarsi solo dove $U \le E$. Nei punti in cui il grafico incontra la retta, $U = E$ e $K = 0$: il corpo si ferma e torna indietro. Sono i **punti di inversione** del moto. Nella figura la molla ha $k = 200\,\text{N/m}$ e il blocco ha $E = 0{,}64\,\text{J}$: i punti di inversione sono dove $\tfrac{1}{2} k x^2 = E$, cioè $x = \pm\sqrt{2E/k} = \pm 0{,}080\,\text{m}$, e il blocco oscilla tra $-8{,}0\,\text{cm}$ e $8{,}0\,\text{cm}$, come nel [moto armonico](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-armonico). A $x = 5{,}0\,\text{cm}$ ha $U = 0{,}25\,\text{J}$ e $K = 0{,}64\,\text{J} - 0{,}25\,\text{J} = 0{,}39\,\text{J}$.

### La forza dalla pendenza

Su un piccolo spostamento $\Delta x$ la forza è quasi costante e compie il lavoro $F_x\,\Delta x$, che deve essere uguale a $-\Delta U$. Quindi

$$F_x = -\frac{\Delta U}{\Delta x}$$

La forza è l'opposto della pendenza del grafico ([Coefficiente angolare e retta per due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti)). Dove il grafico sale verso destra la forza è negativa, cioè diretta verso sinistra; dove scende è diretta verso destra: la forza spinge sempre verso i valori più bassi dell'energia potenziale, e spinge di più dove il grafico è più ripido. Su un tratto rettilineo del grafico la pendenza è la stessa in tutti i punti e la formula è esatta; su una curva vale per spostamenti piccoli. Per il peso, con l'asse verso l'alto, $U = m g h$ è una retta di pendenza $m g$, e la forza è $-m g$: costante e verso il basso.

### L'equilibrio

Dove il grafico è orizzontale la forza è zero: un corpo fermo lì resta fermo. In fondo a una buca l'equilibrio è **stabile**: spostato di poco, il corpo trova da tutte e due le parti un grafico in salita, e la forza lo riporta indietro. In cima a una collina l'equilibrio è **instabile**: spostato di poco, il corpo trova il grafico in discesa, e la forza lo allontana.

```tikz
% nome: equilibrio-stabile-instabile-grafico
% alt: Il grafico di un'energia potenziale con una buca a sinistra e una collina a destra. In fondo alla buca, segnato equilibrio stabile, due frecce rosse orizzontali sotto il grafico, ai lati del punto, puntano verso il punto; in cima alla collina, segnato equilibrio instabile, due frecce rosse orizzontali puntano lontano dal punto
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (7.4,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,3.3) node[above] {$U$};
\draw[thick, blue] (0.3,2.9) .. controls (0.8,1.0) and (1.3,0.6) .. (2,0.6) .. controls (2.9,0.6) and (3.6,2.4) .. (4.6,2.4) .. controls (5.6,2.4) and (6.2,1.6) .. (6.9,0.4);
\fill (2,0.6) circle (1.5pt);
\fill (4.6,2.4) circle (1.5pt);
\draw[-{Stealth}, thick, red] (1.1,0.28) -- (1.75,0.28);
\draw[-{Stealth}, thick, red] (2.9,0.28) -- (2.25,0.28);
\draw[-{Stealth}, thick, red] (4.3,2.75) -- (3.65,2.75);
\draw[-{Stealth}, thick, red] (4.9,2.75) -- (5.55,2.75);
\node[above] at (2,0.7) {\small stabile};
\node[below] at (4.6,2.3) {\small instabile};
\end{tikzpicture}
```

```ad-warning
Il grafico non è una pista
Il grafico di $U$ assomiglia al profilo di una montagna russa, ma il corpo si muove lungo l'asse $x$, non sulla curva. L'altezza del grafico in un punto non è una quota: è l'energia potenziale che il corpo ha quando si trova in quella posizione.
```

```ad-example
Esempio 4: leggere un grafico a tratti
Un corpo di $0{,}50\,\text{kg}$ si muove lungo l'asse $x$ sotto l'azione di una forza conservativa, con l'energia potenziale del grafico qui sotto. Viene lasciato fermo in $x = 1{,}0\,\text{m}$. Quanto vale la sua energia meccanica? Con che velocità passa per $x = 2{,}0\,\text{m}$? Fin dove arriva? Quale forza agisce su di lui tra $0$ e $2{,}0\,\text{m}$, e quale tra $2{,}0$ e $5{,}0\,\text{m}$?

```tikz
% nome: grafico-energia-potenziale-tratti
% alt: Il grafico di un'energia potenziale U in joule in funzione della posizione x in metri, fatto di quattro tratti rettilinei: scende da 12 joule in x uguale a 0 fino a 2 joule in x uguale a 2 metri, risale fino a 8 joule in x uguale a 5 metri, scende a 4 joule in x uguale a 7 metri e resta a 4 joule fino a 9 metri. Una retta orizzontale tratteggiata a 7 joule, l'energia meccanica E, incontra il grafico in x uguale a 1,0 metri e in x uguale a 4,5 metri, i due punti di inversione
\begin{tikzpicture}[x=0.7cm, y=0.3cm]
\draw[gray!25, very thin] (0,0) grid[xstep=1, ystep=2] (9,12);
\draw[->] (-0.4,0) -- (9.8,0) node[right] {$x$ (m)};
\draw[->] (0,-1) -- (0,13.6) node[above] {$U$ (J)};
\foreach \x in {1,2,...,9} \draw (\x,0.2) -- (\x,-0.2) node[below] {\small $\x$};
\foreach \y in {2,4,...,12} \draw (0.09,\y) -- (-0.09,\y) node[left] {\small $\y$};
\draw[thick, blue] (0,12) -- (2,2) -- (5,8) -- (7,4) -- (9,4);
\draw[dashed, thick] (0,7) -- (9,7) node[right] {\small $E$};
\fill (1,7) circle (1.5pt);
\fill (4.5,7) circle (1.5pt);
\draw[dashed, thin] (1,7) -- (1,0);
\draw[dashed, thin] (4.5,7) -- (4.5,0);
\end{tikzpicture}
```

Tra $0$ e $2{,}0\,\text{m}$ il grafico scende di $10\,\text{J}$ in $2{,}0\,\text{m}$, cioè di $5{,}0\,\text{J}$ ogni metro: in $x = 1{,}0\,\text{m}$ l'energia potenziale è $12\,\text{J} - 5{,}0\,\text{J} = 7{,}0\,\text{J}$. Il corpo è fermo, quindi $E = K + U = 0 + 7{,}0\,\text{J} = 7{,}0\,\text{J}$.

In $x = 2{,}0\,\text{m}$ il grafico dà $U = 2{,}0\,\text{J}$:

$$K = E - U = 7{,}0\,\text{J} - 2{,}0\,\text{J} = 5{,}0\,\text{J}$$

$$v = \sqrt{\frac{2K}{m}} = \sqrt{\frac{2 \cdot 5{,}0\,\text{J}}{0{,}50\,\text{kg}}} = 4{,}47\ldots\,\text{m/s} \approx 4{,}5\,\text{m/s}$$

Oltre $x = 2{,}0\,\text{m}$ il grafico risale di $6{,}0\,\text{J}$ in $3{,}0\,\text{m}$, cioè di $2{,}0\,\text{J}$ ogni metro. Torna a $7{,}0\,\text{J}$, cioè $5{,}0\,\text{J}$ sopra il minimo, dopo $5{,}0\,\text{J} : 2{,}0\,\text{J/m} = 2{,}5\,\text{m}$: il secondo punto di inversione è in $x = 4{,}5\,\text{m}$. Il corpo oscilla tra $1{,}0\,\text{m}$ e $4{,}5\,\text{m}$ e non supera la collina, che è alta $8{,}0\,\text{J}$.

Le forze sono l'opposto delle pendenze dei due tratti:

$$F_x = -\frac{2{,}0\,\text{J} - 12\,\text{J}}{2{,}0\,\text{m} - 0} = +5{,}0\,\text{N}$$

$$F_x = -\frac{8{,}0\,\text{J} - 2{,}0\,\text{J}}{5{,}0\,\text{m} - 2{,}0\,\text{m}} = -2{,}0\,\text{N}$$

Nel primo tratto la forza spinge verso destra, nel secondo verso sinistra, e tutte e due puntano verso il fondo della buca.
```

Nella figura qui sotto scegli il punto da cui lasciare il corpo dell'esempio 4 e lo fai partire. Finché parte da un punto con meno di $8{,}0\,\text{J}$ di energia potenziale, cioè a destra di $x = 0{,}80\,\text{m}$, resta nella buca e oscilla tra due punti di inversione alla stessa altezza sul grafico. Se parte più a sinistra, la retta di $E$ passa sopra la collina: il corpo la supera con l'energia cinetica che gli avanza, $E - 8{,}0\,\text{J}$, e prosegue verso destra senza tornare.

```interattivo
% nome: grafico-energia-potenziale-buca
% alt: Il grafico a tratti dell'energia potenziale dell'esempio 4, con una retta orizzontale per l'energia meccanica E e, sotto, l'asse x su cui si muove un corpo di 0,50 chilogrammi. Un cursore sceglie il punto di partenza tra 0 e 2 metri e un bottone lascia andare il corpo: sul grafico un segmento verticale mostra l'energia cinetica K, la distanza tra il grafico e la retta. Se l'energia meccanica è minore di 8 joule il corpo oscilla nella buca tra due punti di inversione, altrimenti supera la collina. Sotto sono scritti la posizione, l'energia potenziale, l'energia cinetica, la velocità e la forza
```

## Riepilogo

- Una forza è conservativa se il suo lavoro dipende solo dal punto di partenza e da quello di arrivo, cioè se è zero su ogni cammino chiuso. Peso e forza elastica lo sono, attrito e resistenza dell'aria no.
- Ogni forza conservativa ha un'energia potenziale, definita da $W = -\Delta U$ a meno della scelta del livello zero.
- Sul grafico di $U$ in funzione di $x$: $K = E - U$, i punti di inversione sono dove $U = E$, la forza è $F_x = -\Delta U / \Delta x$, e l'equilibrio è stabile in fondo alle buche e instabile in cima alle colline.
