# Dati, frequenze e grafici

Quanti fratelli hanno gli studenti di una classe, quale sport preferiscono, quanto sono alti: per rispondere si raccolgono dati, si contano in una tabella e si disegnano in un grafico che si legge a colpo d'occhio. La statistica studia questo lavoro, dalla scelta delle persone a cui chiedere fino al grafico finale.

## Popolazione, unità statistica e campione

La **popolazione** è l'insieme di tutti gli elementi su cui si vuole sapere qualcosa; ogni elemento della popolazione si chiama **unità statistica**. Le unità statistiche non sono per forza persone: possono essere le famiglie di una città, le automobili vendute in un anno, le giornate di un mese.

Quando si osservano tutte le unità della popolazione l'indagine si chiama **censimento**. Spesso però la popolazione è troppo grande, e si osserva solo una sua parte, il **campione**. Il campione deve assomigliare alla popolazione: per questo le sue unità si scelgono a caso, senza preferire un gruppo agli altri.

```ad-example
Esempio: popolazione, unità e campione
Una scuola ha $1000$ studenti e vuole sapere quanti arrivano in autobus. Invece di chiederlo a tutti, estrae a sorte $200$ studenti e chiede a loro.

La popolazione è formata dai $1000$ studenti della scuola, ogni studente è un'unità statistica, e i $200$ studenti estratti sono il campione.
```

```ad-warning
Un campione scelto male
Se la scuola facesse la domanda solo agli studenti di una classe, o solo a quelli che entrano dal cancello vicino alla fermata, il campione non assomiglierebbe alla popolazione: la percentuale trovata direbbe qualcosa di quel gruppo, non di tutta la scuola.
```

## Caratteri e modalità

Il **carattere** è la caratteristica che si osserva su ogni unità statistica: lo sport preferito, il numero di fratelli, l'altezza. I valori che il carattere può assumere si chiamano **modalità**: le modalità del carattere "sport preferito" sono calcio, pallavolo, nuoto e così via.

Un carattere è **qualitativo** quando le sue modalità sono parole, come il colore degli occhi o il mezzo di trasporto. Alcuni caratteri qualitativi hanno un ordine naturale (il titolo di studio, un giudizio come insufficiente, sufficiente, buono, ottimo), altri no (il colore degli occhi).

Un carattere è **quantitativo** quando le sue modalità sono numeri che misurano o contano qualcosa. Ce ne sono di due tipi:
- **discreto**, se assume solo valori isolati, di solito perché si conta: il numero di fratelli, i libri letti in un anno, i gol in una partita;
- **continuo**, se può assumere qualunque valore in un intervallo, perché si misura: l'altezza, il peso, il tempo sui $100$ metri.

```ad-example
Esempio: che tipo di carattere
Su ogni studente di una classe si osservano cinque caratteri.
- Mezzo con cui arriva a scuola: qualitativo.
- Giudizio nell'ultima verifica (insufficiente, sufficiente, buono, ottimo): qualitativo, con un ordine.
- Numero di fratelli: quantitativo discreto, si conta ($0$, $1$, $2$, …).
- Altezza: quantitativo continuo, si misura (per esempio $167{,}5$ cm).
- Tempo per arrivare a scuola: quantitativo continuo.
```

```ad-warning
Un numero non è sempre una quantità
Il numero di maglia di un calciatore o il CAP di una città sono scritti con cifre, ma non misurano e non contano niente: la media di due CAP non ha senso. Sono caratteri qualitativi. Per decidere, chiediti se i conti con quei numeri significano qualcosa.
```

## La tabella di frequenza

I dati raccolti, uno per ogni unità, formano un elenco lungo e difficile da leggere. Si ordinano in una **tabella di frequenza**, che per ogni modalità dice quante volte compare. Da qui in poi $N$ è il numero totale dei dati.

La **frequenza assoluta** $f_a$ di una modalità è il numero di volte in cui la modalità compare. La somma delle frequenze assolute di tutte le modalità è $N$.

La **frequenza relativa** $f_r$ è la frequenza assoluta divisa per il numero totale dei dati:

$$f_r = \dfrac{f_a}{N}$$

È un numero tra $0$ e $1$, che si scrive come frazione o con la virgola, e la somma delle frequenze relative di tutte le modalità è $1$. Serve a confrontare gruppi di grandezza diversa: $6$ studenti su $20$ sono più di $8$ studenti su $40$, perché $\dfrac{6}{20} = 0{,}3$ e $\dfrac{8}{40} = 0{,}2$.

La **frequenza percentuale** è la frequenza relativa scritta come percentuale, cioè moltiplicata per $100$: una frequenza relativa di $0{,}3$ è il $30\%$. La somma delle frequenze percentuali è $100\%$. I conti con le percentuali sono quelli di [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).

```ad-example
Esempio 1: il numero di fratelli
A $20$ studenti si chiede quanti fratelli o sorelle hanno. Le risposte sono

$1$, $0$, $2$, $1$, $1$, $3$, $0$, $1$, $2$, $1$, $0$, $1$, $2$, $1$, $3$, $2$, $1$, $0$, $1$, $2$.

Si contano le volte in cui compare ogni modalità, poi si divide per $N = 20$ e si moltiplica per $100$:

| Fratelli | $f_a$ | $f_r$ | Percentuale |
|---|---|---|---|
| $0$ | $4$ | $0{,}2$ | $20\%$ |
| $1$ | $9$ | $0{,}45$ | $45\%$ |
| $2$ | $5$ | $0{,}25$ | $25\%$ |
| $3$ | $2$ | $0{,}1$ | $10\%$ |
| Totale | $20$ | $1$ | $100\%$ |

Per esempio $f_r = \dfrac{9}{20} = 0{,}45$: quasi metà degli studenti ha un solo fratello o una sola sorella.
```

```ad-tip
Il controllo dei totali
Le frequenze assolute devono dare $N$, le relative $1$, le percentuali $100\%$. Se non tornano, hai perso o contato due volte un dato.
```

Quando le frequenze relative non sono decimali finiti si arrotondano, e la somma può venire poco diversa da $1$. Con tre modalità che compaiono $10$ volte ciascuna su $30$ dati, ogni frequenza è $\dfrac{1}{3} \approx 33{,}3\%$, e la somma arrotondata è $99{,}9\%$: la differenza viene dall'arrotondamento, non da un errore nei conteggi.

### Le frequenze cumulate

Quando le modalità hanno un ordine (un carattere quantitativo, o qualitativo con un ordine), si può chiedere quante unità stanno fino a una certa modalità. La **frequenza cumulata** di una modalità è la somma della sua frequenza assoluta e di quelle di tutte le modalità che la precedono. Allo stesso modo si ottengono la frequenza relativa cumulata e la percentuale cumulata.

L'ultima frequenza cumulata è sempre $N$, e l'ultima percentuale cumulata è $100\%$.

```ad-example
Esempio 2: le cumulate del numero di fratelli
Dalla tabella dell'esempio 1 si sommano le frequenze dall'alto verso il basso:

| Fratelli | $f_a$ | Cumulata | Percentuale cumulata |
|---|---|---|---|
| $0$ | $4$ | $4$ | $20\%$ |
| $1$ | $9$ | $4 + 9 = 13$ | $65\%$ |
| $2$ | $5$ | $13 + 5 = 18$ | $90\%$ |
| $3$ | $2$ | $18 + 2 = 20$ | $100\%$ |

La cumulata di $1$ dice che $13$ studenti, cioè il $65\%$, hanno al massimo un fratello o una sorella.
```

```ad-warning
Cumulare modalità senza ordine
Con lo sport preferito o il colore degli occhi la frequenza cumulata non ha significato: "quanti studenti preferiscono al massimo la pallavolo" non vuol dire niente, perché gli sport non stanno in fila. Le cumulate si calcolano solo quando le modalità hanno un ordine.
```

## Dati raggruppati in classi

Con un carattere continuo, come l'altezza, quasi ogni dato è diverso dagli altri, e una tabella con una riga per valore sarebbe lunga quanto l'elenco. Si dividono allora i valori in **classi**, intervalli consecutivi che non si sovrappongono e non lasciano buchi, e si conta quanti dati cadono in ogni classe. Lo stesso si fa con un carattere discreto che ha molti valori diversi.

La classe $150 \vdash 160$ contiene i valori da $150$ compreso a $160$ escluso: il trattino verticale sta dalla parte dell'estremo compreso. L'**ampiezza** della classe è la differenza tra i due estremi, qui $160 - 150 = 10$. Di solito le classi hanno tutte la stessa ampiezza.

```ad-note
Classi e intervalli
La classe $150 \vdash 160$ è l'intervallo $[150, 160[$ di [Disequazioni di primo grado](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli). Alcuni libri scrivono le classi proprio con gli intervalli.
```

```ad-example
Esempio 3: le altezze di 30 studenti
Le altezze, in centimetri, di $30$ studenti sono

$172$, $158$, $165$, $181$, $169$, $174$, $160$, $155$, $177$, $163$, $188$, $170$, $166$, $172$, $152$, $183$, $161$, $176$, $168$, $179$, $165$, $159$, $185$, $171$, $164$, $178$, $167$, $180$, $175$, $162$.

Il più basso è alto $152$ cm, il più alto $188$ cm: bastano quattro classi di ampiezza $10$, da $150$ a $190$. I valori $160$, $170$ e $180$ vanno nella classe che comincia con loro.

| Altezza (cm) | $f_a$ | Percentuale | Cumulata |
|---|---|---|---|
| $150 \vdash 160$ | $4$ | $13{,}3\%$ | $4$ |
| $160 \vdash 170$ | $11$ | $36{,}7\%$ | $15$ |
| $170 \vdash 180$ | $10$ | $33{,}3\%$ | $25$ |
| $180 \vdash 190$ | $5$ | $16{,}7\%$ | $30$ |
| Totale | $30$ | $100\%$ | |

Le percentuali sono arrotondate a un decimale: per esempio $\dfrac{4}{30} \cdot 100 = 13{,}33\ldots \approx 13{,}3$. La cumulata della terza classe dice che $25$ studenti su $30$ sono più bassi di $180$ cm.
```

```ad-warning
Il dato sul confine
Un'altezza di $170$ cm va in $170 \vdash 180$, non in $160 \vdash 170$ e non in tutte e due. Se le classi si scrivono $160$–$170$ e $170$–$180$ senza dire quale estremo è compreso, il dato sul confine si conta due volte o nessuna. Il controllo è il totale: deve essere $N$.
```

## I grafici

Un grafico mostra le frequenze in modo che si confrontino a occhio. Ogni tipo di grafico va bene per un tipo di dato. Ortogramma e aerogramma si disegnano qui per lo sport preferito di $40$ studenti:

| Sport | $f_a$ | $f_r$ | Percentuale |
|---|---|---|---|
| calcio | $14$ | $0{,}35$ | $35\%$ |
| pallavolo | $10$ | $0{,}25$ | $25\%$ |
| basket | $8$ | $0{,}2$ | $20\%$ |
| nuoto | $6$ | $0{,}15$ | $15\%$ |
| altro | $2$ | $0{,}05$ | $5\%$ |
| Totale | $40$ | $1$ | $100\%$ |

### Ortogramma

L'**ortogramma**, o diagramma a barre, ha un rettangolo per ogni modalità: i rettangoli hanno tutti la stessa base, stanno separati l'uno dall'altro, e l'altezza di ognuno è la frequenza della modalità (assoluta, relativa o percentuale: la forma del grafico non cambia). Si usa per i caratteri qualitativi e per quelli quantitativi discreti con poche modalità, come il numero di fratelli.

```tikz
% nome: ortogramma-sport-preferito
% alt: Ortogramma dello sport preferito di 40 studenti: barre separate alte 14 per il calcio, 10 per la pallavolo, 8 per il basket, 6 per il nuoto e 2 per altro
% svg: ortogramma-sport-preferito-c00151a8.svg 289x162
\begin{tikzpicture}[yscale=0.2]
\draw[->] (0,0) -- (6.8,0);
\draw[->] (0,0) -- (0,16) node[above] {studenti};
\foreach \y in {2,4,...,14} \draw (0.08,\y) -- (-0.08,\y) node[left] {\footnotesize $\y$};
\foreach \x/\h/\n in {0.75/14/calcio, 2.05/10/pallavolo, 3.35/8/basket, 4.65/6/nuoto, 5.95/2/altro} {
  \filldraw[fill=blue!20, draw=blue!60!black] (\x-0.32,0) rectangle (\x+0.32,\h);
  \node[below, text height=1.5ex, text depth=0.25ex] at (\x,0) {\footnotesize \n};
}
\end{tikzpicture}
```

### Istogramma

L'**istogramma** rappresenta i dati raggruppati in classi. Sull'asse orizzontale ci sono i valori del carattere, e ogni classe diventa un rettangolo che ha per base la classe stessa e per altezza la sua frequenza. I rettangoli sono attaccati, perché le classi sono consecutive: dove finisce una comincia la successiva.

Ecco l'istogramma delle altezze dell'esempio 3.

```tikz
% nome: istogramma-altezze-studenti
% alt: Istogramma delle altezze di 30 studenti: rettangoli attaccati sulle classi da 150 a 190 centimetri, alti 4, 11, 10 e 5
% svg: istogramma-altezze-studenti-e9f6919a.svg 287x154
\begin{tikzpicture}[xscale=0.13, yscale=0.22]
\draw[->] (145,0) -- (197,0) node[above left] {cm};
\draw[->] (145,0) -- (145,14) node[above] {studenti};
\foreach \y in {2,4,...,12} \draw (145.6,\y) -- (144.4,\y) node[left] {\footnotesize $\y$};
\foreach \a/\h in {150/4, 160/11, 170/10, 180/5}
  \filldraw[fill=orange!30, draw=orange!60!black] (\a,0) rectangle (\a+10,\h);
\foreach \x in {150,160,...,190} \node[below] at (\x,0) {\footnotesize $\x$};
\end{tikzpicture}
```

```ad-warning
Istogramma e ortogramma
Nell'istogramma i rettangoli si toccano, perché sull'asse orizzontale c'è una scala di numeri e le classi sono una dopo l'altra. Nell'ortogramma i rettangoli sono separati, perché le modalità sono distinte. Disegnare un istogramma con gli spazi, o un ortogramma dello sport preferito con le barre attaccate, confonde i due tipi di dato.
```

```ad-note
Classi di ampiezza diversa
Tutto questo vale quando le classi hanno la stessa ampiezza. Se le ampiezze sono diverse, a essere proporzionale alla frequenza è l'area del rettangolo, non l'altezza: l'altezza si calcola dividendo la frequenza per l'ampiezza della classe.
```

### Aerogramma

L'**aerogramma**, o grafico a torta, è un cerchio diviso in settori, uno per modalità. Il cerchio intero sono tutti i dati, e ogni settore ha un angolo proporzionale alla frequenza: siccome l'angolo giro misura $360^\circ$, l'angolo di una modalità è

$$\alpha = f_r \cdot 360^\circ$$

È la proporzione $\alpha : 360^\circ = f_a : N$. Si usa quando interessa quanta parte del totale occupa ogni modalità, di solito con un carattere qualitativo e poche modalità.

```ad-example
Esempio 4: gli angoli dello sport preferito
Con le frequenze relative della tabella dello sport:

$$
\begin{gathered}
\text{calcio: } 0{,}35 \cdot 360^\circ = 126^\circ \\
\text{pallavolo: } 0{,}25 \cdot 360^\circ = 90^\circ \\
\text{basket: } 0{,}2 \cdot 360^\circ = 72^\circ \\
\text{nuoto: } 0{,}15 \cdot 360^\circ = 54^\circ \\
\text{altro: } 0{,}05 \cdot 360^\circ = 18^\circ
\end{gathered}
$$

Controllo: $126 + 90 + 72 + 54 + 18 = 360$. Con le frequenze assolute il conto è lo stesso: ogni studente vale $\dfrac{360^\circ}{40} = 9^\circ$, e i $14$ del calcio danno $14 \cdot 9^\circ = 126^\circ$.
```

```tikz
% nome: aerogramma-sport-preferito
% alt: Aerogramma dello sport preferito di 40 studenti: calcio 35 per cento, pallavolo 25, basket 20, nuoto 15 e altro 5, con settori di 126, 90, 72, 54 e 18 gradi
% svg: aerogramma-sport-preferito-0c2d1ba2.svg 247x157
\begin{tikzpicture}
\foreach \a/\b/\c in {90/216/blue!20, 216/306/orange!30, 306/378/green!25, 378/432/red!20, 432/450/violet!20}
  \filldraw[fill=\c, draw=black!70] (0,0) -- (\a:1.5) arc (\a:\b:1.5) -- cycle;
\node[anchor=east] at (153:1.6) {\footnotesize calcio, $35\%$};
\node[anchor=north] at (261:1.55) {\footnotesize pallavolo, $25\%$};
\node[anchor=west] at (342:1.6) {\footnotesize basket, $20\%$};
\node[anchor=south west] at (45:1.5) {\footnotesize nuoto, $15\%$};
\node[anchor=south] at (81:1.55) {\footnotesize altro, $5\%$};
\end{tikzpicture}
```

```ad-warning
L'angolo non è la percentuale
Una modalità con il $35\%$ non ha un settore di $35^\circ$: $35^\circ$ è meno di un decimo del cerchio. L'angolo è il $35\%$ di $360^\circ$, cioè $0{,}35 \cdot 360^\circ = 126^\circ$.
```

Si può fare anche il cammino inverso: dall'angolo di un settore si ricava la frequenza relativa dividendo per $360^\circ$.

```ad-example
Esempio 5: dal grafico alla tabella
L'aerogramma mostra come arrivano a scuola i $200$ studenti del campione. Quanti studenti ci sono in ogni settore?

```tikz
% nome: aerogramma-mezzi-di-trasporto
% alt: Aerogramma dei mezzi di trasporto di 200 studenti con gli angoli dei settori: autobus 144 gradi, a piedi 90, auto 72, bici 54
% svg: aerogramma-mezzi-di-trasporto-c506e6d1.svg 254x149
\begin{tikzpicture}
\foreach \a/\b/\c in {90/234/blue!20, 234/324/orange!30, 324/396/green!25, 396/450/red!20}
  \filldraw[fill=\c, draw=black!70] (0,0) -- (\a:1.5) arc (\a:\b:1.5) -- cycle;
\node[anchor=east] at (162:1.6) {\footnotesize autobus, $144^\circ$};
\node[anchor=north] at (279:1.55) {\footnotesize a piedi, $90^\circ$};
\node[anchor=west] at (0:1.6) {\footnotesize auto, $72^\circ$};
\node[anchor=south west] at (63:1.5) {\footnotesize bici, $54^\circ$};
\end{tikzpicture}
```

Si divide ogni angolo per $360^\circ$ e si moltiplica per $N = 200$:

$$
\begin{gathered}
\text{autobus: } \dfrac{144}{360} = 0{,}4 \\
0{,}4 \cdot 200 = 80
\end{gathered}
$$

Allo stesso modo: a piedi $\dfrac{90}{360} = 0{,}25$, cioè $50$ studenti; in auto $\dfrac{72}{360} = 0{,}2$, cioè $40$; in bici $\dfrac{54}{360} = 0{,}15$, cioè $30$. Controllo: $80 + 50 + 40 + 30 = 200$.
```

### Diagramma cartesiano

Quando un carattere quantitativo cambia nel tempo, i dati si rappresentano con un **diagramma cartesiano**: sull'asse orizzontale c'è il tempo, su quello verticale il valore, e ogni dato è un punto. I punti si uniscono con segmenti per far vedere l'andamento, se sale, scende o resta uguale.

```ad-example
Esempio 6: le temperature di una settimana
Le temperature massime di una settimana, in gradi, sono state $18$, $21$, $20$, $23$, $25$, $22$, $19$ da lunedì a domenica.

```tikz
% nome: diagramma-cartesiano-temperature
% alt: Diagramma cartesiano delle temperature massime di una settimana: punti uniti da segmenti a 18, 21, 20, 23, 25, 22 e 19 gradi da lunedì a domenica
% svg: diagramma-cartesiano-temperature-a023b21e.svg 254x153
\begin{tikzpicture}[yscale=0.1]
\draw[->] (0,0) -- (6,0);
\draw[->] (0,0) -- (0,29) node[above] {gradi};
\foreach \y in {5,10,...,25} \draw (0.08,\y) -- (-0.08,\y) node[left] {\footnotesize $\y$};
\foreach \x/\g in {0.6/lun, 1.4/mar, 2.2/mer, 3/gio, 3.8/ven, 4.6/sab, 5.4/dom} \node[below, text height=1.5ex, text depth=0.25ex] at (\x,0) {\footnotesize \g};
\draw[thick, blue!60!black] (0.6,18) -- (1.4,21) -- (2.2,20) -- (3,23) -- (3.8,25) -- (4.6,22) -- (5.4,19);
\foreach \x/\t in {0.6/18, 1.4/21, 2.2/20, 3/23, 3.8/25, 4.6/22, 5.4/19} \fill[blue!60!black] (\x,\t) ellipse (0.07 and 0.7);
\end{tikzpicture}
```

Il grafico mostra che la temperatura sale fino a venerdì e poi scende. I segmenti servono solo a seguire l'andamento: un punto a metà tra lunedì e martedì non è un dato raccolto.
```

## Quale grafico per quale dato

| Dati | Grafico |
|---|---|
| carattere qualitativo | ortogramma; aerogramma se conta la parte del totale |
| quantitativo discreto, poche modalità | ortogramma |
| dati raggruppati in classi | istogramma |
| valori che cambiano nel tempo | diagramma cartesiano |

L'aerogramma funziona con poche modalità: con dieci settori sottili gli angoli non si confrontano più a occhio, e un ortogramma si legge meglio. L'aerogramma ha senso solo se le modalità sono le parti di un unico totale, con percentuali che danno $100\%$.

```ad-warning
L'asse verticale che non parte da zero
In un ortogramma o in un istogramma l'altezza dei rettangoli deve partire da zero. Se l'asse verticale comincia da $5$, una barra che vale $7$ si vede alta $2$ e una che vale $6$ si vede alta $1$: la prima sembra il doppio della seconda, mentre le due frequenze differiscono di poco. Prima di confrontare due barre, guarda da dove parte l'asse.
```
