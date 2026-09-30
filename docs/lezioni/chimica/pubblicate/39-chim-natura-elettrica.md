# La natura elettrica della materia

Un palloncino strofinato sui capelli resta attaccato al muro, un pettine di plastica passato tra i capelli asciutti attira pezzetti di carta, e d'inverno togliendo un maglione di lana si sentono piccole scosse. Sono tutti effetti della carica elettrica, e dicono una cosa sulla materia che la teoria atomica di Dalton non prevedeva: dentro gli atomi ci sono cariche elettriche. Questa lezione racconta come ci si è arrivati, e prepara la lezione [Elettroni, protoni e neutroni](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/elettroni-protoni-e-neutroni), dove quelle cariche prendono un nome.

## L'elettrizzazione per strofinio

Già i Greci sapevano che l'ambra strofinata con un panno attira pagliuzze e piume; la parola "elettricità" viene proprio dal greco *èlektron*, che vuol dire ambra. Un corpo che, strofinato, acquista questa proprietà si dice **elettrizzato**, o carico: si è elettrizzato per strofinio.

Nel 1733 il francese Charles du Fay osservò che i corpi elettrizzati non si comportano tutti allo stesso modo. Due bacchette di vetro strofinate con la seta si respingono, due bacchette di plastica (ai suoi tempi ambra o resina) strofinate con la lana si respingono, ma una bacchetta di vetro e una di plastica si attraggono. Esistono quindi due tipi di carica elettrica. A metà del Settecento Benjamin Franklin diede loro i nomi che usiamo ancora: **positiva** quella del vetro strofinato con la seta, **negativa** quella della plastica strofinata con la lana.

La regola che collega le due cariche si vede bene con due palline leggere appese a un filo, che si caricano toccandole con una bacchetta elettrizzata:

- due corpi con cariche dello stesso segno si respingono;
- due corpi con cariche di segno opposto si attraggono.

```tikz
% nome: natura-elettrica-pendolini
% alt: Due coppie di palline appese a fili. A sinistra due palline con il segno più si allontanano, i fili divaricati e due frecce rosse che puntano verso l'esterno: cariche dello stesso segno si respingono. A destra una pallina con il più e una con il meno si avvicinano, con due frecce rosse che puntano una verso l'altra: cariche di segno opposto si attraggono
% svg: natura-elettrica-pendolini-39424f62.svg 254x139
\begin{tikzpicture}
\draw[thick] (0,3) -- (2.6,3);
\draw (1.0,3) -- (0.55,1.1);
\draw (1.6,3) -- (2.05,1.1);
\draw[thick, fill=red!15] (0.55,1.1) circle (0.25);
\draw[thick, fill=red!15] (2.05,1.1) circle (0.25);
\node at (0.55,1.1) {$+$};
\node at (2.05,1.1) {$+$};
\draw[-{Stealth}, thick, red] (0.55,0.6) -- (0.05,0.6);
\draw[-{Stealth}, thick, red] (2.05,0.6) -- (2.55,0.6);
\node[align=center] at (1.3,-0.1) {stesso segno:\\si respingono};
\draw[thick] (4.0,3) -- (6.6,3);
\draw (4.6,3) -- (4.95,1.1);
\draw (6.0,3) -- (5.65,1.1);
\draw[thick, fill=red!15] (4.95,1.1) circle (0.25);
\draw[thick, fill=blue!10] (5.65,1.1) circle (0.25);
\node at (4.95,1.1) {$+$};
\node at (5.65,1.1) {$-$};
\draw[-{Stealth}, thick, red] (4.7,0.6) -- (5.2,0.6);
\draw[-{Stealth}, thick, red] (5.9,0.6) -- (5.4,0.6);
\node[align=center] at (5.3,-0.1) {segno opposto:\\si attraggono};
\end{tikzpicture}
```

La forza tra due cariche diventa più intensa quando i corpi si avvicinano e più debole quando si allontanano. Come dipende dalla distanza lo dice la legge di Coulomb, che si studia in fisica nella lezione [La legge di Coulomb](/materiale/scuola-superiore/fisica/la-carica-elettrica-e-la-legge-di-coulomb/la-legge-di-coulomb); per la chimica basta sapere che cariche opposte si attraggono tanto più forte quanto più sono vicine.

## Da dove vengono le cariche

Un corpo non elettrizzato, per esempio una bacchetta di plastica appena presa dal cassetto, non è privo di cariche: ne contiene tantissime, positive e negative, in quantità uguali, e i loro effetti si annullano. Un corpo così si dice **neutro**.

Lo strofinio non crea cariche: le sposta da un corpo all'altro. Oggi sappiamo che a spostarsi sono gli elettroni, le particelle con carica negativa che stanno in tutti gli atomi. Strofinando la plastica con la lana, alcuni elettroni passano dalla lana alla plastica: la plastica ha elettroni in più e diventa negativa, la lana ne ha in meno e resta con una carica positiva uguale e opposta. Con il vetro e la seta succede il contrario: gli elettroni passano dal vetro alla seta, e il vetro diventa positivo.

```tikz
% nome: natura-elettrica-strofinio
% alt: Una bacchetta di plastica e un panno di lana, prima e dopo lo strofinio. Prima, tutti e due hanno tre segni più e tre segni meno: sono neutri. Dopo, la bacchetta ha tre segni più e cinque segni meno, il panno tre segni più e un solo segno meno; una freccia arancione dice che due elettroni sono passati dalla lana alla plastica
% svg: natura-elettrica-strofinio-acb68d40.svg 226x162
\begin{tikzpicture}
\node[anchor=west] at (0,3.3) {prima};
\draw[thick, fill=gray!20] (0,2.0) rectangle (3.2,3.0);
\foreach \x in {0.6,1.6,2.6} \node at (\x,2.72) {$+$};
\foreach \x in {0.6,1.6,2.6} \node at (\x,2.28) {$-$};
\draw[thick, fill=yellow!20] (3.8,2.0) rectangle (5.8,3.0);
\foreach \x in {4.1,4.8,5.5} \node at (\x,2.72) {$+$};
\foreach \x in {4.1,4.8,5.5} \node at (\x,2.28) {$-$};
\node[anchor=west] at (0,1.3) {dopo};
\draw[thick, fill=gray!20] (0,0) rectangle (3.2,1.0);
\foreach \x in {0.6,1.6,2.6} \node at (\x,0.72) {$+$};
\foreach \x in {0.4,1.0,1.6,2.2,2.8} \node at (\x,0.28) {$-$};
\draw[thick, fill=yellow!20] (3.8,0) rectangle (5.8,1.0);
\foreach \x in {4.1,4.8,5.5} \node at (\x,0.72) {$+$};
\node at (4.8,0.28) {$-$};
\draw[-{Stealth}, thick, orange!90!black] (4.3,1.25) to[bend right=30] (2.4,1.15);
\node[above] at (3.4,1.4) {\small 2 elettroni};
\node[below] at (1.6,-0.1) {\small plastica: negativa};
\node[below] at (4.8,-0.1) {\small lana: positiva};
\end{tikzpicture}
```

Quale dei due corpi prende gli elettroni dipende dalle due sostanze: il vetro li perde con la seta, la plastica li acquista con la lana. Sempre, però, la carica che un corpo acquista è uguale e opposta a quella che perde l'altro.

```ad-warning
Nei solidi si spostano gli elettroni
Dire che il vetro strofinato "ha acquistato cariche positive" è sbagliato: le cariche positive degli atomi del vetro restano dove sono. Il vetro diventa positivo perché ha perso elettroni, e le sue cariche positive non sono più compensate.
```

## La carica elettrica e la sua conservazione

La **carica elettrica** $Q$ è la grandezza che misura quanto un corpo è elettrizzato. Nel Sistema Internazionale si misura in coulomb, simbolo $\text{C}$, dal nome del fisico francese Charles-Augustin de Coulomb. Il coulomb è una carica enorme: gli oggetti elettrizzati per strofinio hanno cariche di pochi nanocoulomb ($1\,\text{nC} = 10^{-9}\,\text{C}$).

In ogni trasformazione la carica totale resta la stessa: è il **principio di conservazione della carica**. Nello strofinio i due corpi partono neutri e alla fine hanno cariche opposte, con somma zero.

La carica non si divide all'infinito. La più piccola carica che si trova libera in natura è quella dell'elettrone, la **carica elementare**:

$$e = 1{,}60 \cdot 10^{-19}\,\text{C}$$

e ogni carica è un multiplo intero di $e$. Un corpo con $N$ elettroni in più ha carica $Q = -N e$, un corpo con $N$ elettroni in meno ha carica $Q = +N e$. Quindi il numero di elettroni spostati è

$$N = \frac{|Q|}{e}$$

```ad-example
Esempio 1: gli elettroni su un pettine
Un pettine di plastica passato tra i capelli ha una carica di $-8{,}0\,\text{nC}$. Quanti elettroni in più ha?

La carica è negativa, quindi il pettine ha acquistato elettroni. Il loro numero è

$$N = \frac{|Q|}{e} = \frac{8{,}0 \cdot 10^{-9}\,\text{C}}{1{,}60 \cdot 10^{-19}\,\text{C}} = 5{,}0 \cdot 10^{10}$$

Cinquanta miliardi di elettroni sembrano tanti, ma il pettine di elettroni ne contiene più di $10^{24}$: quelli in più sono una parte piccolissima.
```

```ad-example
Esempio 2: vetro e seta
Una bacchetta di vetro strofinata con un panno di seta acquista una carica di $+3{,}2\,\text{nC}$. Quale carica ha il panno? Quanti elettroni sono passati, e in che verso?

Prima dello strofinio la carica totale era zero, e si conserva: il panno ha $-3{,}2\,\text{nC}$. Il vetro è positivo, quindi ha perso elettroni, che sono passati alla seta:

$$N = \frac{3{,}2 \cdot 10^{-9}\,\text{C}}{1{,}60 \cdot 10^{-19}\,\text{C}} = 2{,}0 \cdot 10^{10}$$
```

```ad-warning
Dividere, non moltiplicare
Per contare gli elettroni si divide la carica per $e$. Chi moltiplica, $8{,}0 \cdot 10^{-9} \cdot 1{,}60 \cdot 10^{-19}$, trova $1{,}3 \cdot 10^{-27}$: un numero di elettroni più piccolo di uno, che non ha senso. Un numero di elettroni è sempre un numero intero, e per le cariche degli oggetti di tutti i giorni è enorme.
```

## Conduttori e isolanti

Se si strofina una bacchetta di metallo tenendola in mano, non si elettrizza, o così sembra: le cariche che acquista si spostano subito lungo il metallo e attraverso il corpo di chi la tiene. Nei **conduttori** le cariche elettriche si muovono liberamente: sono conduttori i metalli, la grafite, il corpo umano, l'acqua con i sali disciolti. Negli **isolanti** le cariche restano dove sono state messe: sono isolanti il vetro, la plastica, la gomma, il legno secco, l'aria secca. Per questo si elettrizzano per strofinio proprio gli isolanti, e un metallo si carica solo se lo si tiene con un manico isolante.

Un conduttore si può elettrizzare anche per contatto: toccandolo con un corpo carico, una parte della carica passa sul conduttore e si distribuisce. Se due sfere di metallo uguali, isolate, si toccano, alla fine hanno la stessa carica: la carica totale si conserva e si divide a metà.

```ad-example
Esempio 3: due sfere che si toccano
Due sfere di metallo uguali, su supporti isolanti, hanno cariche $Q_A = +6{,}0\,\text{nC}$ e $Q_B = -2{,}0\,\text{nC}$. Si fanno toccare e poi si separano. Quale carica ha ciascuna?

La carica totale è $+6{,}0\,\text{nC} - 2{,}0\,\text{nC} = +4{,}0\,\text{nC}$, e si divide a metà tra le due sfere uguali: ognuna ha $+2{,}0\,\text{nC}$.

La sfera $A$ è passata da $+6{,}0$ a $+2{,}0\,\text{nC}$: ha ricevuto $4{,}0\,\text{nC}$ di carica negativa, cioè $4{,}0 \cdot 10^{-9}/1{,}60 \cdot 10^{-19} = 2{,}5 \cdot 10^{10}$ elettroni, arrivati dalla sfera $B$.
```

```ad-warning
Si divide la somma con il segno
Nell'esempio 3 chi somma le cariche senza segno trova $8{,}0\,\text{nC}$ e dà $4{,}0\,\text{nC}$ a ciascuna sfera. Le cariche di segno opposto si compensano: prima si fa la somma algebrica, poi si divide.
```

Infine un corpo carico attira anche un corpo neutro, senza toccarlo: è l'**elettrizzazione per induzione**. Avvicinando un pettine negativo a un pezzetto di carta, gli elettroni della carta vengono respinti, di poco, verso il lato lontano; il lato vicino resta un po' positivo ed è attratto dal pettine più di quanto il lato lontano sia respinto, perché è più vicino. Il palloncino che resta attaccato al muro funziona allo stesso modo.

## L'elettroscopio

L'**elettroscopio a foglie** è lo strumento che rivela se un corpo è carico. È un'asta di metallo con una pallina in alto e due foglioline sottili (d'oro o d'alluminio) in basso, chiuse in un recipiente di vetro perché l'aria non le muova. Toccando la pallina con un corpo carico, la carica si distribuisce su tutto il metallo: le due foglioline hanno cariche dello stesso segno, si respingono e si aprono. Più la carica è grande, più si aprono.

```tikz
% nome: natura-elettrica-elettroscopio
% alt: Un elettroscopio a foglie: un recipiente di vetro chiuso da un tappo, attraversato da un'asta di metallo con una pallina in alto e due foglioline in basso, aperte a V. Una bacchetta con segni meno tocca la pallina, e segni meno sono disegnati sulla pallina e sulle due foglioline, che si respingono
% svg: natura-elettrica-elettroscopio-136007aa.svg 240x150
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (2.4,2.2);
\draw[thick, fill=gray!20] (0.9,2.2) rectangle (1.5,2.45);
\draw[thick] (1.2,2.85) -- (1.2,1.0);
\draw[thick, fill=gray!20] (1.2,3.05) circle (0.2);
\draw[thick] (1.2,1.0) -- (0.8,0.3);
\draw[thick] (1.2,1.0) -- (1.6,0.3);
\node at (0.7,0.75) {$-$};
\node at (1.7,0.75) {$-$};
\node at (0.85,3.15) {$-$};
\draw[thick, fill=blue!10] (1.38,3.15) -- (3.6,3.75) -- (3.66,3.53) -- (1.44,2.93) -- cycle;
\node at (2.0,3.2) {$-$};
\node at (2.6,3.36) {$-$};
\node at (3.2,3.52) {$-$};
\draw[thin] (2.55,0.65) -- (1.55,0.65);
\node[right] at (2.6,0.65) {\small foglioline};
\node[right] at (3.7,3.65) {\small bacchetta carica};
\end{tikzpicture}
```

## La carica nella materia: l'elettrolisi

Il legame tra elettricità e atomi divenne chiaro con l'elettrolisi. Facendo passare corrente elettrica in una soluzione di un sale, o in un sale fuso, le sostanze si decompongono: dall'acqua si ottengono idrogeno e ossigeno, dal cloruro di sodio fuso sodio e cloro. Tra il 1833 e il 1834 Michael Faraday misurò che la massa di sostanza che si deposita è proporzionale alla carica che passa, e che per depositare una quantità di atomi sempre uguale serve sempre la stessa carica.

Il modo più naturale di leggere queste misure è che la carica elettrica sia fatta di porzioni tutte uguali, legate agli atomi. Nel 1891 il fisico irlandese George Johnstone Stoney chiamò "elettrone" quella porzione di carica. Pochi anni dopo, nel 1897, J. J. Thomson trovò la particella che la porta: è la storia della prossima lezione. La conclusione, per la chimica, è che l'atomo di Dalton non è indivisibile, ma contiene cariche positive e negative in quantità uguali.
