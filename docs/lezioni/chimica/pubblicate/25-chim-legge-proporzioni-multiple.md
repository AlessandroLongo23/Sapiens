# La legge di Dalton delle proporzioni multiple

Il carbonio che brucia con molto ossigeno dà anidride carbonica, $\mathrm{CO_2}$, il gas che espiriamo; se l'ossigeno scarseggia, come in una stufa che tira male, dà monossido di carbonio, $\mathrm{CO}$, un gas velenoso. Sono due composti diversi fatti degli stessi due elementi, in proporzioni diverse. La legge delle proporzioni multiple dice che tra queste proporzioni c'è una regola semplice, e quella regola è stata uno degli indizi più forti che la materia è fatta di atomi.

## Due composti degli stessi elementi

La [legge di Proust](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-proust) dice che in un composto il rapporto tra le masse degli elementi è sempre lo stesso, qualunque sia il campione: nel monossido di carbonio $1{,}00\ \mathrm{g}$ di carbonio è sempre unito a $1{,}33\ \mathrm{g}$ di ossigeno. Ma la legge di Proust parla di un composto alla volta, e due elementi possono formarne più d'uno. Nell'anidride carbonica lo stesso grammo di carbonio è unito a $2{,}66\ \mathrm{g}$ di ossigeno.

| Composto | Carbonio | Ossigeno unito al carbonio |
|---|---|---|
| Monossido di carbonio, $\mathrm{CO}$ | $1{,}00\ \mathrm{g}$ | $1{,}33\ \mathrm{g}$ |
| Anidride carbonica, $\mathrm{CO_2}$ | $1{,}00\ \mathrm{g}$ | $2{,}66\ \mathrm{g}$ |

Le due masse di ossigeno non sono due numeri qualsiasi: la seconda è esattamente il doppio della prima. Non esiste un ossido del carbonio con $1{,}8\ \mathrm{g}$ o $2{,}1\ \mathrm{g}$ di ossigeno per grammo di carbonio.

```tikz
% nome: proporzioni-co-co2-sfere
% alt: A sinistra una molecola di monossido di carbonio, una sfera grigia C legata a una sfera rossa O, con la scritta 1,00 g di C e 1,33 g di O; a destra una molecola di anidride carbonica, una sfera C tra due sfere O, con 1,00 g di C e 2,66 g di O, cioè il doppio dell'ossigeno
% svg: proporzioni-co-co2-sfere-a18766f4.svg 233x90
\begin{tikzpicture}
\draw[thick, fill=gray!45] (0,0) circle (0.35); \node at (0,0) {C};
\draw[thick, fill=red!30] (0.62,0) circle (0.35); \node at (0.62,0) {O};
\node at (0.31,-0.75) {CO};
\node[align=center] at (0.31,-1.45) {$1{,}00$ g di C\\$1{,}33$ g di O};
\draw[thick, fill=red!30] (3.8,0) circle (0.35); \node at (3.8,0) {O};
\draw[thick, fill=gray!45] (4.42,0) circle (0.35); \node at (4.42,0) {C};
\draw[thick, fill=red!30] (5.04,0) circle (0.35); \node at (5.04,0) {O};
\node at (4.42,-0.75) {CO$_2$};
\node[align=center] at (4.42,-1.45) {$1{,}00$ g di C\\$2{,}66$ g di O};
\draw[-{Stealth}, thick, orange!90!black] (1.6,-1.45) -- (3.2,-1.45) node[midway, above] {$\times 2$};
\end{tikzpicture}
```

## La legge delle proporzioni multiple

All'inizio dell'Ottocento il chimico inglese John Dalton, studiando i composti dell'azoto con l'ossigeno, notò questa regolarità e la enunciò in generale. È la **legge delle proporzioni multiple**:

> Quando due elementi formano più di un composto, le masse di uno dei due elementi che si combinano con una stessa massa dell'altro stanno tra loro in rapporti di numeri interi piccoli.

"La stessa massa dell'altro" è la parte della legge che si dimentica più spesso: il confronto ha senso solo se l'elemento che si tiene fisso, qui il carbonio, ha la stessa massa nei due composti. Di solito si prende $1\ \mathrm{g}$, ma va bene qualunque massa, purché sia la stessa.

"Numeri interi piccoli" vuol dire rapporti come $2 : 1$, $3 : 2$, $5 : 2$. Un rapporto $3 : 2$ non è intero, $1{,}5$, ma è il rapporto di due numeri interi piccoli, e va bene lo stesso.

```ad-note
Proust e Dalton
La legge di Proust confronta campioni diversi dello stesso composto, e trova sempre lo stesso rapporto tra le masse. La legge di Dalton confronta composti diversi degli stessi elementi, e trova rapporti diversi, ma legati da numeri interi. Le due leggi non si contraddicono: la seconda comincia dove finisce la prima.
```

## Come si verifica la legge

Con i dati di due composti degli stessi elementi, $X$ e $Y$:

1. Per ogni composto trova la massa di $X$ e quella di $Y$. Se hai la massa del composto e quella di un solo elemento, l'altra è la differenza (la [legge di Lavoisier](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-lavoisier) garantisce che le masse si sommano).
2. Per ogni composto calcola la massa di $Y$ unita a $1\ \mathrm{g}$ di $X$: $\dfrac{m_Y}{m_X}$.
3. Dividi il valore più grande per il più piccolo.
4. Il risultato è vicino a un rapporto di numeri interi piccoli ($2$, $3$, $\tfrac{3}{2}$, $\tfrac{5}{2}$...): la differenza viene dagli errori di misura e dagli arrotondamenti.

Il passo 2 è una [proporzione](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali): se $3{,}00\ \mathrm{g}$ di carbonio si uniscono a $4{,}00\ \mathrm{g}$ di ossigeno, $1\ \mathrm{g}$ si unisce a un terzo di quella massa.

```ad-example
Esempio 1: gli ossidi del carbonio
In laboratorio si analizzano due gas fatti solo di carbonio e ossigeno. Nel primo campione $3{,}00\ \mathrm{g}$ di carbonio sono uniti a $4{,}00\ \mathrm{g}$ di ossigeno; nel secondo gli stessi $3{,}00\ \mathrm{g}$ di carbonio sono uniti a $7{,}99\ \mathrm{g}$ di ossigeno. I dati rispettano la legge delle proporzioni multiple?

La massa di carbonio è già la stessa, quindi si possono confrontare direttamente le masse di ossigeno:
$$\frac{7{,}99\ \mathrm{g}}{4{,}00\ \mathrm{g}} = 1{,}9975 \approx 2$$
Con la stessa massa di carbonio, il secondo gas contiene il doppio dell'ossigeno: il rapporto è $2 : 1$, come per $\mathrm{CO_2}$ e $\mathrm{CO}$.
```

```ad-example
Esempio 2: masse diverse dell'elemento fisso
Due ossidi dello zolfo. Nel primo $2{,}50\ \mathrm{g}$ di zolfo sono uniti a $2{,}49\ \mathrm{g}$ di ossigeno; nel secondo $1{,}60\ \mathrm{g}$ di zolfo sono uniti a $2{,}39\ \mathrm{g}$ di ossigeno. In che rapporto stanno le masse di ossigeno?

Le masse di zolfo sono diverse, quindi prima si porta tutto a $1\ \mathrm{g}$ di zolfo:
$$\text{primo: } \frac{2{,}49\ \mathrm{g}}{2{,}50\ \mathrm{g}} = 0{,}996 \qquad \text{secondo: } \frac{2{,}39\ \mathrm{g}}{1{,}60\ \mathrm{g}} = 1{,}494$$
Poi si confrontano:
$$\frac{1{,}494}{0{,}996} = 1{,}4997\ldots \approx 1{,}5 = \frac{3}{2}$$
Il rapporto è $3 : 2$: per ogni grammo di zolfo, il secondo ossido ha una volta e mezza l'ossigeno del primo. Sono l'anidride solforosa, $\mathrm{SO_2}$, e l'anidride solforica, $\mathrm{SO_3}$: tre atomi di ossigeno contro due.
```

```ad-warning
Confrontare le masse senza fissare l'altro elemento
Nell'esempio 2 le masse di ossigeno date, $2{,}49\ \mathrm{g}$ e $2{,}39\ \mathrm{g}$, sono quasi uguali, e chi le confronta così trova un rapporto vicino a $1$ e conclude che i due composti hanno la stessa composizione. Ma le masse di zolfo sono diverse: prima di confrontare l'ossigeno bisogna riferirlo alla stessa massa di zolfo.
```

## Dalle percentuali

Spesso l'analisi di un composto dà la sua composizione in percentuale: quanti grammi di ogni elemento ci sono in $100\ \mathrm{g}$ di composto. Anche così la legge si verifica con gli stessi passi, prendendo $100\ \mathrm{g}$ di ogni composto.

```ad-example
Esempio 3: due ossidi dell'azoto
Un ossido dell'azoto contiene il $46{,}7\%$ di azoto, un altro il $30{,}4\%$. Che rapporto c'è tra le masse di ossigeno unite a $1\ \mathrm{g}$ di azoto?

In $100\ \mathrm{g}$ del primo ci sono $46{,}7\ \mathrm{g}$ di azoto e $100 - 46{,}7 = 53{,}3\ \mathrm{g}$ di ossigeno; in $100\ \mathrm{g}$ del secondo $30{,}4\ \mathrm{g}$ di azoto e $69{,}6\ \mathrm{g}$ di ossigeno. Per grammo di azoto:
$$\text{primo: } \frac{53{,}3}{46{,}7} = 1{,}141 \qquad \text{secondo: } \frac{69{,}6}{30{,}4} = 2{,}289$$
$$\frac{2{,}289}{1{,}141} = 2{,}006 \approx 2$$
Il rapporto è $2 : 1$. Il primo è il monossido di azoto, $\mathrm{NO}$, il secondo il biossido di azoto, $\mathrm{NO_2}$.
```

```ad-warning
Confrontare le percentuali
Le percentuali di azoto, $46{,}7\%$ e $30{,}4\%$, stanno in rapporto $1{,}54$, e quelle di ossigeno, $53{,}3\%$ e $69{,}6\%$, in rapporto $1{,}31$: nessuno dei due è il rapporto della legge. Le percentuali sono riferite a $100\ \mathrm{g}$ di composto, non alla stessa massa di azoto. Bisogna sempre passare dalle masse per grammo dell'elemento fisso.
```

## Gli ossidi dell'azoto

L'azoto e l'ossigeno formano cinque ossidi stabili, e sono l'esempio più completo della legge. Per ogni grammo di azoto, le masse di ossigeno sono:

| Ossido | Ossigeno per $1{,}000\ \mathrm{g}$ di azoto | Diviso per $0{,}571$ |
|---|---|---|
| $\mathrm{N_2O}$, ossido di diazoto | $0{,}571\ \mathrm{g}$ | $1$ |
| $\mathrm{NO}$, monossido di azoto | $1{,}142\ \mathrm{g}$ | $2$ |
| $\mathrm{N_2O_3}$, triossido di diazoto | $1{,}713\ \mathrm{g}$ | $3$ |
| $\mathrm{NO_2}$, biossido di azoto | $2{,}284\ \mathrm{g}$ | $4$ |
| $\mathrm{N_2O_5}$, pentossido di diazoto | $2{,}855\ \mathrm{g}$ | $5$ |

Le masse di ossigeno stanno come $1 : 2 : 3 : 4 : 5$: ognuna è un multiplo intero della più piccola, e da qui viene il nome della legge. Nella figura puoi scegliere una coppia di elementi e la massa dell'elemento fisso, e vedere che le barre dell'ossigeno sono sempre fatte dello stesso mattone, preso un numero intero di volte.

```interattivo
% nome: proporzioni-multiple-ossidi
% alt: Per una coppia di elementi scelta (carbonio e ossigeno, azoto e ossigeno, zolfo e ossigeno, idrogeno e ossigeno) ogni composto è disegnato come una molecola a sfere, con accanto una barra lunga quanto la massa di ossigeno unita alla massa scelta dell'altro elemento. Le barre sono divise in tratti tutti uguali, e ognuna ne contiene un numero intero. Un cursore cambia la massa dell'elemento fisso: le masse di ossigeno crescono, i rapporti restano gli stessi
```

## Perché i rapporti sono interi

Dalton trovò la spiegazione nell'idea che la materia sia fatta di atomi, particelle che nelle reazioni non si spezzano. Se in un composto ogni atomo di carbonio è unito a un atomo di ossigeno, e nell'altro a due, per la stessa massa di carbonio (cioè per lo stesso numero di atomi di carbonio) il secondo composto ha il doppio degli atomi di ossigeno, e quindi il doppio della massa di ossigeno. Mezzo atomo non esiste, e per questo i rapporti non possono essere $1{,}8$ o $2{,}1$. È il punto di partenza della [teoria atomica di Dalton](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-teoria-atomica-di-dalton).

```ad-example
Esempio 4: acqua e acqua ossigenata
L'acqua e l'acqua ossigenata (il disinfettante) sono fatte di idrogeno e ossigeno. Nell'acqua $1{,}00\ \mathrm{g}$ di idrogeno è unito a $7{,}92\ \mathrm{g}$ di ossigeno, nell'acqua ossigenata a $15{,}8\ \mathrm{g}$. Il rapporto è
$$\frac{15{,}8}{7{,}92} = 1{,}99\ldots \approx 2$$
Con gli atomi: l'acqua è $\mathrm{H_2O}$, un atomo di ossigeno ogni due di idrogeno; l'acqua ossigenata è $\mathrm{H_2O_2}$, due atomi di ossigeno ogni due di idrogeno. Per lo stesso numero di atomi di idrogeno, l'ossigeno raddoppia.
```

```ad-tip
Un controllo con le formule
Se conosci le formule dei due composti, il rapporto si legge dagli indici, dopo aver fatto uguale il numero di atomi dell'elemento fisso. $\mathrm{N_2O}$ e $\mathrm{NO_2}$: con due atomi di azoto sono $\mathrm{N_2O}$ e $\mathrm{N_2O_4}$, quindi l'ossigeno sta come $1 : 4$. $\mathrm{FeO}$ e $\mathrm{Fe_2O_3}$: con due atomi di ferro sono $\mathrm{Fe_2O_2}$ e $\mathrm{Fe_2O_3}$, quindi $2 : 3$.
```
