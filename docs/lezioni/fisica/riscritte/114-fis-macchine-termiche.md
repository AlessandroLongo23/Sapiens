# Le macchine termiche e il rendimento

Il motore di un'auto brucia benzina e fa girare le ruote; una centrale termoelettrica brucia gas e fa girare le turbine che producono corrente. In tutti e due i casi una parte del calore della combustione diventa lavoro. Il passaggio opposto lo conosci già: nell'[esperimento di Joule](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico) il lavoro di un peso che scende diventa tutto calore, senza residui. Trasformare il calore in lavoro è più difficile: serve una macchina che ripeta sempre lo stesso ciclo, e una parte del calore va comunque persa.

## Dal calore al lavoro, un ciclo dopo l'altro

Un gas chiuso in un cilindro, scaldato, si espande e spinge il pistone: [compie lavoro](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-lavoro-in-una-trasformazione-termodinamica). Ma l'espansione finisce quando il pistone arriva in fondo al cilindro. Per continuare a produrre lavoro il gas deve tornare allo stato di partenza e ricominciare: deve compiere una [trasformazione ciclica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma).

Alla fine di un ciclo il gas è di nuovo nello stato iniziale, e la sua energia interna ha lo stesso valore di prima: $\Delta U = 0$. Il [primo principio](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica), $\Delta U = Q - W$, diventa allora

$$W = Q$$

In un ciclo il lavoro totale compiuto dal gas è uguale al calore totale che ha scambiato, cioè al calore assorbito meno quello ceduto. Il gas non consuma la propria energia: fa da tramite tra il calore che entra e il lavoro che esce.

Nel piano pressione-volume un ciclo è una curva chiusa. Se è percorsa in senso orario, l'espansione avviene a pressione più alta della compressione: il lavoro che il gas compie espandendosi è maggiore di quello che bisogna spendere per ricomprimerlo, e la differenza è il lavoro utile, uguale all'area racchiusa dal ciclo.

```tikz
% nome: ciclo-piano-pv-area-lavoro
% alt: Nel piano con il volume V in ascissa e la pressione p in ordinata, una curva chiusa percorsa in senso orario: il tratto superiore è l'espansione, quello inferiore la compressione, e l'area racchiusa, colorata, è il lavoro W compiuto in un ciclo
% svg: ciclo-piano-pv-area-lavoro-610d00b5.svg 235x176
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (5,3.5);
\draw[->] (-0.3,0) -- (5.3,0) node[right] {$V$};
\draw[->] (0,-0.3) -- (0,3.8) node[above] {$p$};
\fill[blue!10] (1,2.2) .. controls (2,3.5) and (3.6,3.0) .. (4.2,1.6) .. controls (3.2,0.5) and (1.5,0.8) .. (1,2.2);
\draw[thick, postaction={decorate}, decoration={markings, mark=at position 0.55 with {\arrow{Stealth}}}] (1,2.2) .. controls (2,3.5) and (3.6,3.0) .. (4.2,1.6);
\draw[thick, postaction={decorate}, decoration={markings, mark=at position 0.55 with {\arrow{Stealth}}}] (4.2,1.6) .. controls (3.2,0.5) and (1.5,0.8) .. (1,2.2);
\node at (2.6,1.9) {$W$};
\node[above] at (3.0,3.0) {\small espansione};
\node[below] at (2.4,0.8) {\small compressione};
\end{tikzpicture}
```

Perché la compressione avvenga a pressione più bassa, il gas va raffreddato prima di ricomprimerlo: deve cedere calore a qualcosa di più freddo. Per questo ogni macchina che produce lavoro dal calore ha bisogno di due temperature, una alta e una bassa.

## Com'è fatta una macchina termica

Una **macchina termica** è un dispositivo che lavora per cicli e trasforma in lavoro una parte del calore che assorbe. In ogni macchina termica si riconoscono le stesse parti:

- una **sorgente calda**, a temperatura $T_c$, da cui la macchina assorbe in ogni ciclo il calore $Q_c$;
- una **sorgente fredda**, a temperatura $T_f$ più bassa, a cui la macchina cede il calore $Q_f$;
- un fluido (un gas, il vapore d'acqua) che compie il ciclo e produce il lavoro $W$.

Una **sorgente di calore** è un corpo che può cedere o assorbire calore senza che la sua temperatura cambi in modo apprezzabile: l'atmosfera, un fiume, una caldaia tenuta sempre alla stessa temperatura dal combustibile che brucia.

| Macchina | Sorgente calda | Sorgente fredda |
|---|---|---|
| motore di un'auto | i gas della combustione nei cilindri | l'aria esterna, che riceve i gas di scarico |
| centrale termoelettrica | la caldaia | l'acqua di un fiume o del mare, o l'aria |
| locomotiva a vapore | la caldaia a carbone | l'aria esterna, che riceve il vapore |

In questo capitolo $Q_c$ e $Q_f$ sono presi **in valore assoluto**: sono due numeri positivi, e il verso dello scambio lo dice il nome. Il calore totale scambiato in un ciclo è quindi $Q_c - Q_f$, e da $W = Q$ si ottiene il bilancio della macchina:

$$W = Q_c - Q_f$$

Lo schema qui sotto è il modo abituale di disegnare una macchina termica. Le frecce sono larghe in proporzione all'energia che portano: quella che entra dall'alto si divide in due, una parte esce come lavoro e il resto scende alla sorgente fredda.

```tikz
% nome: macchina-termica-schema-flussi
% alt: Lo schema di una macchina termica: in alto la sorgente calda a temperatura Tc, al centro la macchina, in basso la sorgente fredda a temperatura Tf. Una freccia larga scende dalla sorgente calda alla macchina con il calore assorbito, 1200 joule; una freccia più stretta scende dalla macchina alla sorgente fredda con il calore ceduto, 780 joule; una terza freccia esce di lato con il lavoro, 420 joule. Le larghezze delle frecce sono in proporzione
% svg: macchina-termica-schema-flussi-dfb45fcf.svg 215x182
\begin{tikzpicture}
\draw[thick, fill=red!15] (-1.7,4.0) rectangle (1.7,4.7);
\node at (0,4.35) {\small sorgente calda, $T_c$};
\draw[thick, fill=blue!10] (-1.7,0) rectangle (1.7,0.7);
\node at (0,0.35) {\small sorgente fredda, $T_f$};
\draw[thin, fill=orange!25] (-0.6,4.0) -- (-0.6,3.3) -- (-0.75,3.3) -- (0,3.0) -- (0.75,3.3) -- (0.6,3.3) -- (0.6,4.0) -- cycle;
\draw[thin, fill=orange!25] (-0.39,1.7) -- (-0.39,1.0) -- (-0.54,1.0) -- (0,0.7) -- (0.54,1.0) -- (0.39,1.0) -- (0.39,1.7) -- cycle;
\draw[thin, fill=green!15] (0.65,2.56) -- (2.3,2.56) -- (2.3,2.71) -- (2.6,2.35) -- (2.3,1.99) -- (2.3,2.14) -- (0.65,2.14) -- cycle;
\draw[thick, fill=gray!20] (0,2.35) circle (0.65);
\node at (0,2.35) {\scriptsize macchina};
\node[left] at (-0.8,3.6) {$Q_c = 1200$ J};
\node[left] at (-0.6,1.3) {$Q_f = 780$ J};
\node[above] at (1.7,2.75) {$W = 420$ J};
\end{tikzpicture}
```

```ad-example
Esempio 1: il lavoro in un ciclo
In ogni ciclo una macchina termica assorbe $1200\,\text{J}$ dalla sorgente calda e ne cede $780\,\text{J}$ alla sorgente fredda. Quanto lavoro compie in un ciclo?

Dal bilancio della macchina:

$$W = Q_c - Q_f = 1200\,\text{J} - 780\,\text{J} = 420\,\text{J}$$

Sono i numeri dello schema qui sopra.
```

```ad-warning
Il lavoro non è il calore assorbito
Dei $1200\,\text{J}$ che entrano, solo $420\,\text{J}$ diventano lavoro. Scrivere $W = Q_c$ vuol dire dimenticare il calore ceduto, che in una macchina termica non è mai zero.
```

```ad-note
I segni del primo principio
Con la convenzione del primo principio, in cui il calore ceduto è negativo, il calore totale di un ciclo sarebbe la somma $Q_c + Q_f$ con $Q_f < 0$. Qui il meno sta nella formula e i due calori restano positivi: è la scrittura più comoda per le macchine, e la usano quasi tutti i libri.
```

## Il rendimento

Di una macchina termica interessa quanto lavoro produce per ogni joule di calore che prende dalla sorgente calda, perché è quel calore che si paga con il combustibile. Il **rendimento** $\eta$ di una macchina termica è il rapporto tra il lavoro compiuto in un ciclo e il calore assorbito:

$$\eta = \frac{W}{Q_c}$$

È lo stesso [rendimento](/materiale/scuola-superiore/fisica/lavoro-ed-energia/forze-dissipative-e-conservazione-dell-energia-totale) delle macchine che conosci, energia utile diviso energia spesa: qui l'energia utile è $W$ e quella spesa è $Q_c$. Sostituendo $W = Q_c - Q_f$ si ottiene una seconda forma, che usa solo i due calori:

$$\eta = \frac{Q_c - Q_f}{Q_c} = 1 - \frac{Q_f}{Q_c}$$

Il rendimento è un numero puro, compreso tra 0 e 1, e si scrive spesso in percentuale: $\eta = 0{,}35$ è un rendimento del $35\%$. Più calore la macchina cede alla sorgente fredda, più il rendimento è basso.

```ad-example
Esempio 2: il rendimento dai due calori
Qual è il rendimento della macchina dell'esempio 1, che assorbe $1200\,\text{J}$ e cede $780\,\text{J}$?

$$\eta = 1 - \frac{Q_f}{Q_c} = 1 - \frac{780\,\text{J}}{1200\,\text{J}} = 1 - 0{,}65 = 0{,}35$$

Si arriva allo stesso numero con il lavoro: $\eta = W / Q_c = 420\,\text{J} / 1200\,\text{J} = 0{,}35$. La macchina trasforma in lavoro il $35\%$ del calore che assorbe; il restante $65\%$ finisce alla sorgente fredda.
```

```ad-warning
Al denominatore c'è il calore assorbito
Il rendimento si calcola rispetto a $Q_c$, non rispetto a $Q_f$: $W / Q_f = 420 / 780 = 0{,}54$ non è il rendimento della macchina. E il rapporto $Q_f / Q_c = 0{,}65$ da solo è la frazione di calore persa: il rendimento è quello che manca per arrivare a 1.
```

Dalla definizione si ricavano le formule inverse. Se si conoscono il rendimento e il lavoro, il calore assorbito è $Q_c = W / \eta$; se si conoscono il rendimento e il calore assorbito, il lavoro è $W = \eta\,Q_c$ e il calore ceduto è $Q_f = Q_c - W = (1 - \eta)\,Q_c$.

```ad-example
Esempio 3: dal rendimento ai calori
Una macchina termica con rendimento $0{,}30$ compie in ogni ciclo un lavoro di $3{,}6\,\text{kJ}$. Quanto calore assorbe e quanto ne cede in un ciclo?

Il calore assorbito viene dalla definizione del rendimento:

$$Q_c = \frac{W}{\eta} = \frac{3{,}6\,\text{kJ}}{0{,}30} = 12\,\text{kJ}$$

Il calore ceduto è la differenza:

$$Q_f = Q_c - W = 12\,\text{kJ} - 3{,}6\,\text{kJ} = 8{,}4\,\text{kJ}$$

Controllo: $(1 - \eta)\,Q_c = 0{,}70 \cdot 12\,\text{kJ} = 8{,}4\,\text{kJ}$.
```

```ad-warning
Per trovare il calore assorbito si divide
$Q_c$ è più grande di $W$, perché solo una parte del calore diventa lavoro: si divide il lavoro per il rendimento. Moltiplicando, $3{,}6\,\text{kJ} \cdot 0{,}30 = 1{,}08\,\text{kJ}$, il calore assorbito verrebbe più piccolo del lavoro prodotto, e la macchina creerebbe energia dal nulla.
```

Nella figura qui sotto scegli il calore che la macchina assorbe e quello che cede in un ciclo, e guardi come cambiano la freccia del lavoro e il rendimento. Che cosa succede se, a parità di calore assorbito, la macchina cede meno calore? E se i due calori raddoppiano insieme?

```interattivo
% nome: macchina-termica-flussi
% alt: Lo schema di una macchina termica con la sorgente calda in alto, la macchina al centro e la sorgente fredda in basso. Due cursori scelgono il calore assorbito in un ciclo, da 200 a 1000 joule, e il calore ceduto; le tre frecce del calore assorbito, del calore ceduto e del lavoro cambiano larghezza in proporzione. Sotto sono scritti il lavoro, differenza dei due calori, e il rendimento
```

Con $Q_c = 1000\,\text{J}$, se il calore ceduto scende da $700\,\text{J}$ a $500\,\text{J}$ il lavoro sale da $300\,\text{J}$ a $500\,\text{J}$ e il rendimento da $0{,}30$ a $0{,}50$: ogni joule in meno ceduto alla sorgente fredda è un joule in più di lavoro. Se invece i due calori raddoppiano insieme raddoppia anche il lavoro, e il rendimento non cambia, perché dipende solo dal rapporto $Q_f / Q_c$.

## La potenza di una macchina termica

Una macchina termica ripete il ciclo molte volte al secondo, e di solito se ne dà la [potenza](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-potenza), cioè il lavoro compiuto in un secondo. Le formule del rendimento valgono per un ciclo come per un intervallo di tempo qualsiasi, purché $W$, $Q_c$ e $Q_f$ si riferiscano allo stesso intervallo. Se la macchina ha potenza $P$, in un tempo $\Delta t$ compie il lavoro $W = P\,\Delta t$ e assorbe il calore

$$Q_c = \frac{P\,\Delta t}{\eta}$$

```ad-example
Esempio 4: il motore di un'auto
Il motore di un'auto fornisce una potenza di $33\,\text{kW}$ con un rendimento di $0{,}30$. Quanto calore assorbe e quanto ne cede ogni secondo? Quanti litri di benzina consuma in un'ora, se un litro di benzina bruciando fornisce $3{,}2 \cdot 10^7\,\text{J}$?

In un secondo il motore compie il lavoro $W = P\,\Delta t = 33\,\text{kW} \cdot 1\,\text{s} = 3{,}3 \cdot 10^4\,\text{J}$. Il calore assorbito in un secondo è

$$Q_c = \frac{W}{\eta} = \frac{3{,}3 \cdot 10^4\,\text{J}}{0{,}30} = 1{,}1 \cdot 10^5\,\text{J}$$

e quello ceduto $Q_f = Q_c - W = 1{,}1 \cdot 10^5\,\text{J} - 3{,}3 \cdot 10^4\,\text{J} = 7{,}7 \cdot 10^4\,\text{J}$: più di due terzi del calore della benzina escono dal tubo di scarico e dal radiatore.

In un'ora, cioè in $3600\,\text{s}$, il calore assorbito è $1{,}1 \cdot 10^5\,\text{J/s} \cdot 3600\,\text{s} = 3{,}96 \cdot 10^8\,\text{J}$, e la benzina che serve è

$$\frac{3{,}96 \cdot 10^8\,\text{J}}{3{,}2 \cdot 10^7\,\text{J/L}} = 12{,}3\ldots\,\text{L} \approx 12\,\text{L}$$
```

```ad-warning
Lavoro e calore nello stesso intervallo di tempo
Se il lavoro è quello di un'ora, anche il calore deve essere quello di un'ora. L'errore tipico è dividere la potenza in kilowatt per il rendimento e leggere il risultato in joule: $33 / 0{,}30 = 110$ sono kilojoule al secondo, non joule in un'ora.
```

## Il lavoro dal ciclo nel piano pressione-volume

Quando del ciclo si conosce il disegno nel piano pressione-volume, il lavoro si legge dall'area racchiusa e il rendimento viene dal rapporto con il calore assorbito. Il caso più semplice è un ciclo a forma di rettangolo, fatto di due trasformazioni a pressione costante e due a volume costante: l'area è base per altezza.

```ad-example
Esempio 5: un ciclo rettangolare
Un gas perfetto monoatomico compie il ciclo $ABCD$ della figura: si espande a pressione costante da $A$ a $B$, si raffredda a volume costante da $B$ a $C$, viene compresso a pressione costante da $C$ a $D$ e scaldato a volume costante da $D$ ad $A$. Nei tratti $DA$ e $AB$ assorbe in tutto $2850\,\text{J}$. Quanto lavoro compie in un ciclo, e con quale rendimento?

Il lavoro è l'area del rettangolo. La base è $V_B - V_A = 5{,}0\,\text{L} - 2{,}0\,\text{L} = 3{,}0\,\text{L} = 3{,}0 \cdot 10^{-3}\,\text{m}^3$, l'altezza $p_A - p_D = 3{,}0 \cdot 10^5\,\text{Pa} - 1{,}0 \cdot 10^5\,\text{Pa} = 2{,}0 \cdot 10^5\,\text{Pa}$:

$$W = (p_A - p_D)(V_B - V_A) = 2{,}0 \cdot 10^5\,\text{Pa} \cdot 3{,}0 \cdot 10^{-3}\,\text{m}^3 = 6{,}0 \cdot 10^2\,\text{J}$$

Il rendimento è

$$\eta = \frac{W}{Q_c} = \frac{600\,\text{J}}{2850\,\text{J}} = 0{,}210\ldots \approx 0{,}21$$

Il calore ceduto nei tratti $BC$ e $CD$ è $Q_f = Q_c - W = 2850\,\text{J} - 600\,\text{J} = 2250\,\text{J}$.

```tikz
% nome: ciclo-rettangolare-pv-esempio
% alt: Nel piano con il volume in litri in ascissa e la pressione in centinaia di migliaia di pascal in ordinata, un ciclo rettangolare percorso in senso orario: A a 2 litri e 3 per dieci alla quinta pascal, B a 5 litri alla stessa pressione, C a 5 litri e 1 per dieci alla quinta pascal, D a 2 litri alla stessa pressione di C. L'area del rettangolo, colorata, è il lavoro di 600 joule
% svg: ciclo-rettangolare-pv-esempio-3b0a57ac.svg 274x187
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.8, ystep=1] (0,0) grid (4.8,3.5);
\draw[->] (-0.3,0) -- (5.1,0) node[right] {$V$ (L)};
\draw[->] (0,-0.3) -- (0,3.8) node[above] {$p$ ($10^5$ Pa)};
\foreach \x/\l in {0.8/1, 1.6/2, 2.4/3, 3.2/4, 4.0/5} \node[below] at (\x,0) {\small $\l$};
\foreach \y in {1, 2, 3} \node[left] at (0,\y) {\small $\y$};
\fill[blue!10] (1.6,1) rectangle (4.0,3);
\draw[thick, postaction={decorate}, decoration={markings, mark=at position 0.55 with {\arrow{Stealth}}}] (1.6,3) -- (4.0,3);
\draw[thick, postaction={decorate}, decoration={markings, mark=at position 0.55 with {\arrow{Stealth}}}] (4.0,3) -- (4.0,1);
\draw[thick, postaction={decorate}, decoration={markings, mark=at position 0.55 with {\arrow{Stealth}}}] (4.0,1) -- (1.6,1);
\draw[thick, postaction={decorate}, decoration={markings, mark=at position 0.55 with {\arrow{Stealth}}}] (1.6,1) -- (1.6,3);
\fill (1.6,3) circle (1.5pt) node[above left] {$A$};
\fill (4.0,3) circle (1.5pt) node[above right] {$B$};
\fill (4.0,1) circle (1.5pt) node[below right] {$C$};
\fill (1.6,1) circle (1.5pt) node[below left] {$D$};
\node at (2.8,2) {$W = 600$ J};
\end{tikzpicture}
```
```

```ad-warning
Litri e pascal
L'area dà joule solo se la pressione è in pascal e il volume in metri cubi: $1\,\text{L} = 10^{-3}\,\text{m}^3$. Con i litri lasciati come sono il lavoro dell'esempio 5 verrebbe $6{,}0 \cdot 10^5\,\text{J}$, mille volte troppo grande.
```

```ad-note
Da dove vengono i 2850 J
Il calore assorbito nei due tratti si calcola con i [calori molari](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/i-calori-molari-dei-gas) del gas monoatomico: $\tfrac{3}{2}\,V_A\,(p_A - p_D) = 600\,\text{J}$ nel riscaldamento a volume costante e $\tfrac{5}{2}\,p_A\,(V_B - V_A) = 2250\,\text{J}$ nell'espansione a pressione costante.
```

## Quanto rendono le macchine vere

I rendimenti delle macchine reali sono lontani da 1. I valori qui sotto sono indicativi, e cambiano molto da un modello all'altro.

| Macchina | Rendimento |
|---|---|
| locomotiva a vapore | meno del $10\%$ |
| motore a benzina di un'auto | dal $25\%$ al $35\%$ |
| motore diesel | dal $35\%$ al $45\%$ |
| centrale termoelettrica a vapore | circa il $40\%$ |
| centrale a ciclo combinato | fino al $60\%$ |

Nessuna macchina termica arriva al $100\%$, e non per un difetto di costruzione: un rendimento uguale a 1 vorrebbe dire $Q_f = 0$, cioè una macchina che lavora senza sorgente fredda, e questo è vietato da una legge della natura, il secondo principio della termodinamica, di cui parla la lezione sugli [enunciati di Kelvin e di Clausius](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/gli-enunciati-di-kelvin-e-di-clausius). Quale sia il rendimento più alto possibile tra due temperature date lo dice il [teorema di Carnot](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/il-teorema-di-carnot-e-il-ciclo-di-carnot).
