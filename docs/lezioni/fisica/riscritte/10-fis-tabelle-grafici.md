# Tabelle e grafici cartesiani

In laboratorio appendi a una molla dei pesetti uguali, uno alla volta, e ogni volta misuri di quanto si è allungata. Alla fine hai una colonna di masse e una colonna di allungamenti. La tabella conserva le misure; il grafico mostra a colpo d'occhio come una grandezza dipende dall'altra: se i punti si mettono in fila su una retta, se si piegano su una curva, se una misura è venuta male. Tabella e grafico sono il modo in cui i fisici scrivono le relazioni tra grandezze, e servono in ogni capitolo che viene dopo, dalle forze al moto.

I numeri delle tabelle sono misure, con la loro incertezza e le loro cifre significative: come si scrivono è spiegato in [Valore medio e incertezza di una serie di misure](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/valore-medio-e-incertezza-di-una-serie-di-misure) e in [Le cifre significative](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/le-cifre-significative). Il piano cartesiano è quello della matematica, con gli assi e le coordinate di [Il piano cartesiano: distanza e punto medio](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio).

## Dall'esperimento alla tabella

In un esperimento di solito cambi una grandezza e guardi che cosa succede a un'altra. La grandezza che scegli tu, come la massa dei pesetti appesi alla molla, si chiama **variabile indipendente**. Quella che misuri per vedere come risponde, come l'allungamento della molla, si chiama **variabile dipendente**, perché il suo valore dipende da quello che hai scelto per la prima.

```tikz
% nome: molla-pesetti-righello
% alt: Una molla appesa a un supporto con un pesetto di massa m agganciato in fondo; accanto un righello verticale: la linea tratteggiata segna dove arriva l'indice della molla senza pesetti, e la freccia Delta l tra quella linea e l'indice è l'allungamento
% svg: molla-pesetti-righello-fcd9f00a.svg 126x142
\begin{tikzpicture}
\draw[thick] (0,4) -- (3,4);
\foreach \x in {0.15,0.3,...,3} \draw[thin] (\x,4) -- ++(-0.15,0.15);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0.9,4) -- (0.9,2.2);
\draw (0.9,2.2) -- (0.9,2.0);
\draw[thick, fill=blue!10] (0.55,1.3) rectangle (1.25,2.0);
\node at (0.9,1.65) {$m$};
\draw[thick, red] (0.9,2.2) -- (1.9,2.2);
\draw[thick, fill=gray!15] (1.9,0.5) rectangle (2.4,3.8);
\foreach \y in {0.6,0.7,...,3.75} \draw[thin] (1.9,\y) -- (2.0,\y);
\foreach \y in {1.0,1.5,...,3.5} \draw (1.9,\y) -- (2.1,\y);
\draw[dashed, gray] (0.9,2.9) -- (1.9,2.9);
\draw[<->] (2.6,2.9) -- (2.6,2.2);
\node[right] at (2.6,2.55) {$\Delta l$};
\end{tikzpicture}
```

Le misure si scrivono in una **tabella**: una colonna per ogni grandezza, e in cima a ogni colonna il simbolo della grandezza e la sua unità di misura tra parentesi. Così nelle caselle restano solo i numeri. Se l'incertezza è la stessa per tutte le misure di una colonna, si scrive una volta sola, in cima; se cambia da una misura all'altra, si scrive accanto a ogni valore.

```ad-example
Esempio 1: la tabella della molla
Appendi alla molla da uno a cinque pesetti da $50$ g e leggi sul righello di quanto si abbassa l'indice. La molla oscilla un po' prima di fermarsi, e la lettura è incerta di $0{,}2$ cm.

| $m$ (g) | $\Delta l$ (cm) $\pm 0{,}2$ |
|---|---|
| $0$ | $0{,}0$ |
| $50$ | $2{,}1$ |
| $100$ | $3{,}9$ |
| $150$ | $6{,}0$ |
| $200$ | $8{,}1$ |
| $250$ | $9{,}9$ |

La massa è la variabile indipendente (la scegli tu, aggiungendo pesetti) e sta nella prima colonna; l'allungamento $\Delta l$ è la variabile dipendente. L'incertezza delle masse è molto più piccola ed è trascurata.
```

Prova tu: aggiungi i pesetti uno alla volta e guarda come si riempie la tabella.

```interattivo
% nome: molla-pesetti
% alt: Una molla appesa accanto a un righello; due bottoni aggiungono o tolgono un pesetto da 50 grammi. A ogni pesetto la molla si allunga, l'indice scende lungo il righello e nella tabella accanto compare la riga con la massa appesa e l'allungamento letto: 2,1 centimetri con 50 grammi, 3,9 con 100, 6,0 con 150, 8,1 con 200, 9,9 con 250.
```

```ad-warning
I numeri senza unità
Una colonna intitolata solo "allungamento", con dentro $2{,}1$, $3{,}9$ e $6{,}0$, non dice se sono centimetri o millimetri: chi legge la tabella non può usarla. L'unità va in cima alla colonna, una volta, e non va ripetuta in ogni casella.
```

## Il grafico cartesiano

Il **grafico cartesiano** di una tabella è l'insieme dei punti che hanno per coordinate le coppie di valori misurati. Per disegnarlo:

1. Metti la variabile indipendente sull'asse orizzontale e la variabile dipendente sull'asse verticale. Si dice che il grafico mostra la seconda "in funzione" della prima: qui $\Delta l$ in funzione di $m$.
2. Scegli la scala di ogni asse, cioè quanti grammi o centimetri vale ogni quadretto (il modo di sceglierla è nella sezione che segue).
3. Scrivi su ogni asse il simbolo della grandezza e l'unità di misura, e i valori di alcune tacche a intervalli regolari.
4. Segna i punti, e intorno a ogni punto la sua incertezza.
5. Traccia la retta o la curva che passa tra i punti.

```tikz
% nome: grafico-molla-allungamento-massa
% alt: Grafico dell'allungamento della molla in funzione della massa appesa: sull'asse orizzontale m in grammi da 0 a 250, sull'asse verticale Delta l in centimetri da 0 a 10; i cinque punti misurati, ciascuno con una piccola barra verticale di incertezza, stanno vicini a una retta che parte dall'origine, due un po' sopra e due un po' sotto
% svg: grafico-molla-allungamento-massa-e6f1df20.svg 234x231
% poi-interattivo: aggiungere i punti della tabella uno alla volta e spostare una retta per l'origine finché passa tra i punti
\begin{tikzpicture}[scale=0.8]
\draw[gray!25, very thin] (0,0) grid (5.5,5.5);
\draw[->] (0,0) -- (6,0);
\node[below] at (6,-0.05) {$m$ (g)};
\draw[->] (0,0) -- (0,6) node[above] {$\Delta l$ (cm)};
\foreach \x/\t in {1/50,2/100,3/150,4/200,5/250} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/2,2/4,3/6,4/8,5/10} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (5.5,5.49);
\foreach \x/\y in {1/1.05,2/1.95,3/3.0,4/4.05,5/4.95} {
\draw (\x,\y-0.1) -- (\x,\y+0.1);
\draw (\x-0.07,\y-0.1) -- (\x+0.07,\y-0.1);
\draw (\x-0.07,\y+0.1) -- (\x+0.07,\y+0.1);
\fill (\x,\y) circle (0.06);
}
\end{tikzpicture}
```

### La scala degli assi

La scala dice quanto vale un quadretto (o un centimetro) su un asse. Le due scale sono indipendenti: sull'asse orizzontale un quadretto può valere $50$ g e su quello verticale $2$ cm. Per sceglierla:

- guarda il valore più grande da mettere sull'asse e lo spazio che hai;
- dividi il valore per il numero di quadretti, e arrotonda per eccesso a un passo comodo: $1$, $2$ o $5$, moltiplicato per una potenza di $10$ ($0{,}1$, $0{,}2$, $0{,}5$, $1$, $2$, $5$, $10$, $20$, $50$...);
- con questo passo, le tacche con il numero scritto cadono su valori rotondi e leggere un punto richiede solo di contare i quadretti.

Un passo come $3$ g o $7$ g a quadretto è sconsigliato: per sapere dove sta $40$ g dovresti fare una divisione per ogni punto.

```ad-example
Esempio 2: la scala per i cilindri di alluminio
Misuri volume e massa di cinque cilindri di alluminio di altezze diverse:

| $V$ ($\text{cm}^3$) | $m$ (g) |
|---|---|
| $5{,}0$ | $13{,}4$ |
| $10{,}0$ | $27{,}1$ |
| $15{,}0$ | $40{,}4$ |
| $20{,}0$ | $54{,}2$ |
| $25{,}0$ | $67{,}3$ |

Sul quaderno hai $15$ quadretti in orizzontale e $15$ in verticale. Sull'asse del volume: $25 : 15 \approx 1{,}7$, e il passo comodo subito sopra è $2\ \text{cm}^3$ a quadretto; il volume più grande occupa $12{,}5$ quadretti. Sull'asse della massa: $67{,}3 : 15 \approx 4{,}5$, e il passo comodo è $5$ g a quadretto; la massa più grande occupa circa $13{,}5$ quadretti. Con un passo di $10$ g a quadretto i punti starebbero tutti nella metà bassa del foglio, e le differenze tra loro si vedrebbero la metà.

```tikz
% nome: grafico-cilindri-alluminio-scala
% alt: Grafico su un foglio a quadretti della massa dei cilindri di alluminio in funzione del volume: in orizzontale un quadretto vale 2 centimetri cubi, con i numeri 10, 20 e 30 ogni 5 quadretti; in verticale un quadretto vale 5 grammi, con i numeri 20, 40 e 60 ogni 4 quadretti; i cinque punti occupano quasi tutto il foglio
% svg: grafico-cilindri-alluminio-scala-833d36f4.svg 230x244
% poi-interattivo: cambiare il valore di un quadretto su ciascun asse e vedere i punti schiacciarsi in un angolo o uscire dal foglio
\begin{tikzpicture}[scale=0.85]
\draw[step=0.4, gray!40, very thin] (0,0) grid (5.6,5.6);
\draw[->] (0,0) -- (6,0);
\node[below] at (5.5,-0.05) {$V$ (cm$^3$)};
\draw[->] (0,0) -- (0,6) node[above] {$m$ (g)};
\foreach \x/\t in {2/10,4/20} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1.6/20,3.2/40,4.8/60} \node[left] at (0,\y) {\small $\t$};
\node[below] at (0,0) {\small $0$};
\foreach \x/\y in {1/1.072,2/2.168,3/3.232,4/4.336,5/5.384} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```
```

L'asse non deve per forza partire da zero. Se misuri temperature tra $62$ °C e $68$ °C, un asse da $0$ a $70$ °C schiaccia tutti i punti in una striscia; si fa partire l'asse da $60$ °C e lo si dice in modo chiaro, scrivendo il primo numero accanto alla prima tacca.

```ad-warning
Tacche a passi diversi
Le tacche di un asse sono a distanze uguali e devono valere intervalli uguali. Un asse con i numeri $0$, $50$, $100$, $200$, $500$ messi a distanze uguali, per far stare tutto, deforma il grafico: una retta diventa una curva e i punti si leggono sbagliati.
```

### L'incertezza sul grafico

Un punto misurato non è un punto preciso: l'allungamento di $6{,}0$ cm con l'incertezza di $0{,}2$ cm vuol dire un valore tra $5{,}8$ cm e $6{,}2$ cm. Sul grafico lo si mostra con una **barra di incertezza**, un segmento verticale che va da $5{,}8$ a $6{,}2$ centrato sul punto. Se anche la grandezza sull'asse orizzontale ha un'incertezza, si aggiunge un segmento orizzontale, e il punto diventa una croce. Quando la barra è più corta del punto disegnato, come per le masse della molla, non si disegna.

Le barre servono a giudicare la linea che si traccia: una buona retta passa attraverso le barre di tutti i punti, o quasi. Se una retta non riesce a passare per le barre, o i dati non seguono una retta, o l'incertezza è stata stimata troppo piccola.

### La linea tra i punti

I punti misurati non si uniscono con dei segmenti uno dopo l'altro. Ogni misura ha un piccolo errore casuale, un po' in su o un po' in giù (vedi [Errori casuali ed errori sistematici](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/errori-casuali-ed-errori-sistematici)); la spezzata che li unisce riproduce anche questi errori, e fa vedere una legge a zigzag che non c'è. Si traccia invece una sola linea regolare, retta o curva, che passa **tra** i punti: lascia più o meno tanti punti sopra quanti sotto, e ne sta il più vicino possibile.

```tikz
% nome: spezzata-o-retta-tra-i-punti
% alt: Due volte gli stessi cinque punti della molla: a sinistra sono uniti da una spezzata a zigzag, sbarrata perché è il modo sbagliato; a destra una sola retta passa tra i punti, con due punti un po' sopra e due un po' sotto
% svg: spezzata-o-retta-tra-i-punti-c4c22b55.svg 255x138
% poi-interattivo: tracciare a mano una retta tra i punti e contare quanti punti restano sopra e quanti sotto
\begin{tikzpicture}[scale=0.85]
\draw[->] (0,0) -- (2.9,0) node[right] {$m$};
\draw[->] (0,0) -- (0,2.9) node[above] {$\Delta l$};
\draw[thick, red!70] (0,0) -- (0.5,0.525) -- (1,0.975) -- (1.5,1.5) -- (2,2.025) -- (2.5,2.475);
\foreach \x/\y in {0.5/0.525,1/0.975,1.5/1.5,2/2.025,2.5/2.475} \fill (\x,\y) circle (0.05);
\node[red!70!black] at (1.4,-0.45) {\small spezzata: no};
\begin{scope}[xshift=3.9cm]
\draw[->] (0,0) -- (2.9,0) node[right] {$m$};
\draw[->] (0,0) -- (0,2.9) node[above] {$\Delta l$};
\draw[thick, blue!60] (0,0) -- (2.7,2.695);
\foreach \x/\y in {0.5/0.525,1/0.975,1.5/1.5,2/2.025,2.5/2.475} \fill (\x,\y) circle (0.05);
\node[blue!60!black] at (1.4,-0.45) {\small retta: sì};
\end{scope}
\end{tikzpicture}
```

Per i punti della molla la retta passa anche per l'origine: senza pesetti la molla non si allunga. Quando la linea è una curva, la si traccia con un tratto morbido e senza spigoli, sempre in mezzo ai punti.

```ad-warning
La retta obbligata a passare per il primo e l'ultimo punto
Anche il primo e l'ultimo punto sono misure con il loro errore. La retta che li unisce non è la migliore: la linea giusta tiene conto di tutti i punti, e può lasciare fuori anche il primo e l'ultimo.
```

## Leggere un grafico

Una volta tracciata, la linea dà anche i valori che non hai misurato. Per leggere il valore di $\Delta l$ che corrisponde a una massa, parti dalla massa sull'asse orizzontale, sali fino alla linea e da lì vai in orizzontale fino all'asse verticale. Per il contrario, parti dall'asse verticale.

### Interpolare

**Interpolare** vuol dire ricavare dal grafico un valore compreso tra quelli misurati. È una lettura affidabile: tra un punto e l'altro la linea segue la stessa legge dei punti.

```ad-example
Esempio 3: l'allungamento con 120 g
Con la molla dell'esempio 1 non hai mai appeso $120$ g. Parti da $120$ g sull'asse orizzontale (due quadretti e due quinti, perché un quadretto vale $50$ g), sali fino alla retta e vai verso l'asse verticale: arrivi poco sotto i $4{,}8$ cm, cioè a circa $2{,}4$ quadretti da $2$ cm. Con $120$ g la molla si allunga di circa $4{,}8$ cm.

Al contrario, per sapere quale massa allunga la molla di $7{,}0$ cm parti da $7{,}0$ cm sull'asse verticale, vai in orizzontale fino alla retta e scendi: arrivi a circa $175$ g.

```tikz
% nome: grafico-molla-interpolazione
% alt: La retta dell'allungamento della molla con due letture tratteggiate: da 120 grammi si sale alla retta e si va all'asse verticale a circa 4,8 centimetri; da 7,0 centimetri si va alla retta e si scende all'asse orizzontale a circa 175 grammi
% svg: grafico-molla-interpolazione-493bcbaa.svg 234x235
% poi-interattivo: trascinare un punto lungo la retta e leggere massa e allungamento sugli assi
\begin{tikzpicture}[scale=0.8]
\draw[gray!25, very thin] (0,0) grid (5.5,5.5);
\draw[->] (0,0) -- (6,0);
\node[below] at (6,-0.05) {$m$ (g)};
\draw[->] (0,0) -- (0,6) node[above] {$\Delta l$ (cm)};
\foreach \x/\t in {1/50,2/100,3/150,4/200,5/250} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/2,2/4,3/6,4/8,5/10} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (5.5,5.49);
\foreach \x/\y in {1/1.05,2/1.95,3/3.0,4/4.05,5/4.95} \fill (\x,\y) circle (0.06);
\draw[dashed, orange!90!black, thick] (2.4,0) -- (2.4,2.396) -- (0,2.396);
\draw[dashed, teal!70!black, thick] (0,3.5) -- (3.506,3.5) -- (3.506,0);
\node[orange!90!black, left] at (0,2.396) {\small $4{,}8$};
\node[teal!70!black, left] at (0,3.5) {\small $7{,}0$};
\node[orange!90!black, below] at (2.4,-0.35) {\small $120$};
\node[teal!70!black, below] at (3.506,-0.35) {\small $175$};
\end{tikzpicture}
```
```

### Estrapolare

**Estrapolare** vuol dire prolungare la linea oltre l'ultimo punto misurato, per prevedere che cosa succede fuori dall'intervallo delle misure. Con la molla, prolungando la retta fino a $400$ g, si prevede un allungamento di circa $16$ cm. La previsione vale solo se la legge resta la stessa anche dove non hai guardato, e spesso non è così: con qualche chilo appeso la molla si deforma per sempre e la retta non vale più. Un'estrapolazione è un'ipotesi da controllare con una misura, non un risultato.

```ad-example
Esempio 4: il tè che si raffredda
Una tazza di tè bollente è lasciata sul tavolo, in una stanza a $20$ °C, e ogni $2$ minuti se ne misura la temperatura:

| $t$ (min) | $T$ (°C) |
|---|---|
| $0$ | $80$ |
| $2$ | $68$ |
| $4$ | $58$ |
| $6$ | $51$ |
| $8$ | $45$ |
| $10$ | $40$ |

I punti non stanno su una retta: il tè si raffredda in fretta all'inizio e sempre più piano dopo. La linea che passa tra i punti è una curva. Interpolando, a $5$ minuti la temperatura era di circa $54$ °C.

Estrapolare con una retta sarebbe un errore. Con la retta che passa per i primi due punti, che scende di $6$ °C ogni minuto, dopo $14$ minuti il tè sarebbe a $80 - 6 \cdot 14 = -4$ °C, più freddo della stanza. La curva invece si avvicina sempre di più ai $20$ °C della stanza, senza scendere sotto.

```tikz
% nome: grafico-raffreddamento-te
% alt: Grafico della temperatura del tè in funzione del tempo: sei punti da 80 gradi a 0 minuti a 40 gradi a 10 minuti stanno su una curva che scende sempre più piano e si avvicina alla linea tratteggiata dei 20 gradi della stanza; una retta tratteggiata rossa per i primi due punti scende invece molto sotto i 20 gradi, fin quasi a zero; una lettura tratteggiata a 5 minuti dà circa 54 gradi
% svg: grafico-raffreddamento-te-bdf6c24c.svg 240x240
% poi-interattivo: trascinare un punto lungo la curva per leggere la temperatura a ogni minuto, e prolungare la retta dei primi due punti per vedere dove finisce
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin, xstep=0.8, ystep=0.6] (0,0) grid (5.6,5.4);
\draw[->] (0,0) -- (6.1,0);
\node[below] at (5.8,-0.05) {$t$ (min)};
\draw[->] (0,0) -- (0,5.9) node[above] {$T$ ($^\circ$C)};
\foreach \x/\t in {0.8/2,1.6/4,2.4/6,3.2/8,4.0/10,4.8/12} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1.2/20,2.4/40,3.6/60,4.8/80} \node[left] at (0,\y) {\small $\t$};
\draw[dashed, gray] (0,1.2) -- (5.6,1.2);
\draw[dashed, red!70, thick] (0,4.8) -- (5.2,0.12);
\draw[thick, blue!60, domain=0:5.6, samples=60, smooth] plot (\x, {1.2 + 3.6*exp(-0.27893*\x)});
\foreach \x/\y in {0/4.8,0.8/4.08,1.6/3.48,2.4/3.06,3.2/2.7,4.0/2.4} \fill (\x,\y) circle (0.06);
\draw[dashed, orange!90!black, thick] (2.0,0) -- (2.0,3.26) -- (0,3.26);
\end{tikzpicture}
```
```

```ad-warning
Estrapolare fino a zero
Prolungare una retta fino a dove una grandezza vale zero, o diventa negativa, porta spesso a risultati senza senso: una temperatura sotto quella della stanza, una lunghezza negativa, un tempo prima dell'inizio dell'esperimento. Prima di fidarti di un valore estrapolato, chiediti se la legge che hai visto nei dati può valere anche lì.
```

## La forma del grafico

Il grafico dice subito che tipo di legame c'è tra le due grandezze. Le forme che incontrerai più spesso sono quattro, e ognuna ha una sua lezione.

```tikz
% nome: forme-dei-grafici
% alt: Quattro piccoli grafici: una retta che parte dall'origine, y = kx; una retta che taglia l'asse verticale sopra l'origine, y = mx + q; una curva che scende e si avvicina agli assi senza toccarli, y = k/x; una curva che parte dall'origine e sale sempre più ripida, y = kx al quadrato
% svg: forme-dei-grafici-820fa0f8.svg 232x235
\begin{tikzpicture}[scale=0.9]
\draw[->] (0,0) -- (2.4,0) node[right] {$x$};
\draw[->] (0,0) -- (0,2.2) node[above] {$y$};
\draw[thick, blue!60] (0,0) -- (2.1,1.8);
\node at (1.2,-0.45) {\small $y = kx$};
\begin{scope}[xshift=3.6cm]
\draw[->] (0,0) -- (2.4,0) node[right] {$x$};
\draw[->] (0,0) -- (0,2.2) node[above] {$y$};
\draw[thick, blue!60] (0,0.7) -- (2.1,1.9);
\node at (1.2,-0.45) {\small $y = mx + q$};
\end{scope}
\begin{scope}[yshift=-3.3cm]
\draw[->] (0,0) -- (2.4,0) node[right] {$x$};
\draw[->] (0,0) -- (0,2.2) node[above] {$y$};
\draw[thick, blue!60, domain=0.2:2.2, samples=40, smooth] plot (\x, {0.4/\x});
\node at (1.2,-0.45) {\small $y = \frac{k}{x}$};
\end{scope}
\begin{scope}[xshift=3.6cm, yshift=-3.3cm]
\draw[->] (0,0) -- (2.4,0) node[right] {$x$};
\draw[->] (0,0) -- (0,2.2) node[above] {$y$};
\draw[thick, blue!60, domain=0:1.95, samples=40, smooth] plot (\x, {0.5*\x*\x});
\node at (1.2,-0.45) {\small $y = kx^2$};
\end{scope}
\end{tikzpicture}
```

- Una retta che passa per l'origine è una proporzionalità diretta: la massa dei cilindri di alluminio e il loro volume, l'allungamento della molla e la massa appesa. Una retta che non passa per l'origine è una dipendenza lineare. Tutte e due sono in [Proporzionalità diretta e dipendenza lineare](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare).
- Una curva che scende e si avvicina agli assi senza toccarli può essere una proporzionalità inversa, come la pressione di un gas quando cresce il volume; una curva che parte dall'origine e diventa sempre più ripida può essere una proporzionalità quadratica. Sono in [Proporzionalità inversa e quadratica](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica).

La forma da sola però non basta. Anche il tè che si raffredda dà una curva che scende, e non è una proporzionalità inversa: la sua curva non si avvicina all'asse orizzontale ma ai $20$ °C della stanza. Per dire quale legge seguono i dati, si fanno i conti sui valori della tabella, come mostrano le due lezioni che seguono.

## Errori frequenti

```ad-warning
Gli assi scambiati
La variabile indipendente va sull'asse orizzontale. Se metti l'allungamento in orizzontale e la massa in verticale il grafico è ancora giusto, ma è il grafico di un'altra domanda ("quale massa serve per un allungamento?"), e la pendenza della retta diventa l'inverso di quella che ti aspetti.
```

```ad-warning
Leggere i quadretti al posto dei valori
Un punto a $3$ quadretti di altezza non vale $3$: vale $3$ volte il valore di un quadretto. Con un quadretto da $2$ cm, sono $6$ cm. Prima di leggere un grafico guarda la scala di tutti e due gli assi.
```
