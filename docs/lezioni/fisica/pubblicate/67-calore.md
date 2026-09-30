# Calore, capacità termica e calore specifico

Una pentola d'acqua sul fornello si scalda; una tazza di tè lasciata sul tavolo si raffredda. In tutti e due i casi passa energia da un corpo più caldo a uno più freddo: dalla fiamma all'acqua, dal tè all'aria della stanza. Questa energia in transito si chiama calore, e la lezione spiega quanto ne serve per scaldare un corpo di un certo numero di gradi.

## Il calore è energia in transito

Il **calore** $Q$ è l'energia che passa da un corpo a un altro perché i due hanno temperature diverse. Passa sempre dal corpo più caldo a quello più freddo, finché le due temperature non diventano uguali, come spiega la lezione [L'equilibrio termico e il calorimetro](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/l-equilibrio-termico-e-il-calorimetro). Essendo un'energia, nel Sistema Internazionale si misura in **joule**, come il [lavoro](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza).

Calore e temperatura sono due grandezze diverse. La temperatura dice quanto un corpo è caldo, il calore quanta energia è passata. Un fiammifero acceso ha una temperatura molto più alta dell'acqua di una vasca da bagno calda, ma, spento nella vasca, non la scalda in modo misurabile: può cedere poca energia. Allo stesso modo non si dice che un corpo "contiene calore": un corpo ha una temperatura, e riceve o cede calore.

```ad-warning
Calore e temperatura non sono la stessa cosa
"Oggi c'è molto calore" nella fisica non si dice: c'è una temperatura alta. Il calore è energia che passa, si misura in joule, e c'è solo quando due corpi a temperature diverse sono a contatto (o si scambiano radiazione).
```

### L'esperimento di Joule

Che il calore sia energia non era ovvio: fino all'Ottocento molti pensavano che fosse una specie di fluido invisibile, il "calorico", che passa da un corpo all'altro. Lo dimostrò James Prescott Joule, con esperimenti fatti negli anni Quaranta dell'Ottocento (il suo primo articolo sull'argomento è del 1845): si può scaldare l'acqua anche senza fiamma, facendo del lavoro.

Nel suo apparecchio due pesi, scendendo, facevano girare un mulinello a pale dentro un recipiente pieno d'acqua e isolato. Le pale rimescolavano l'acqua, che per l'attrito si scaldava di qualche frazione di grado. Joule misurava il lavoro fatto dai pesi, dal loro peso e dall'altezza di cui scendevano, e l'aumento di temperatura dell'acqua, e trovava sempre lo stesso rapporto tra le due cose: un certo lavoro produce sempre lo stesso riscaldamento, come una certa quantità di calore data con una fiamma.

```tikz
% nome: esperimento-joule-mulinello
% alt: Lo schema dell'esperimento di Joule. Un recipiente pieno d'acqua con dentro un mulinello a pale montato su un asse verticale; in cima all'asse un rocchetto su cui si avvolgono due fili, che passano su due carrucole ai lati e reggono due pesi. I pesi scendono, i fili fanno girare l'asse e le pale rimescolano l'acqua; un termometro immerso nell'acqua ne misura la temperatura
% svg: esperimento-joule-mulinello-aa9266c7.svg 292x134
\begin{tikzpicture}
\draw[thick] (-2,0) -- (5.6,0);
\foreach \x in {-1.85,-1.7,...,5.5} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\fill[cyan!20] (0,0) rectangle (3,1.7);
\draw[thin] (0,1.7) -- (3,1.7);
\draw[thick] (0,2.1) -- (0,0) -- (3,0) -- (3,2.1);
\draw[thick] (1.5,0.25) -- (1.5,2.9);
\draw[thick, fill=gray!20] (0.55,0.5) rectangle (2.45,0.62);
\draw[thick, fill=gray!20] (0.55,1.1) rectangle (2.45,1.22);
\draw[thick, fill=gray!20] (1.3,2.9) rectangle (1.7,3.3);
\draw (1.3,3.1) -- (-0.8,3.1);
\draw (1.7,3.1) -- (4.3,3.1);
\draw[thick, fill=gray!20] (-0.8,2.8) circle (0.3); \fill (-0.8,2.8) circle (1pt);
\draw[thick, fill=gray!20] (4.3,2.8) circle (0.3); \fill (4.3,2.8) circle (1pt);
\draw (-1.1,2.8) -- (-1.1,1.1);
\draw (4.6,2.8) -- (4.6,1.1);
\draw[thick, fill=blue!10] (-1.35,0.5) rectangle (-0.85,1.1);
\draw[thick, fill=blue!10] (4.35,0.5) rectangle (4.85,1.1);
\draw[-{Stealth}, thick, blue!60!black] (-1.6,1.1) -- (-1.6,0.4);
\draw[-{Stealth}, thick, blue!60!black] (5.1,1.1) -- (5.1,0.4);
\fill[red!50] (2.72,0.35) circle (0.09);
\draw[thin] (2.67,0.42) -- (2.67,2.45) -- (2.77,2.45) -- (2.77,0.42);
\node[right, inner sep=1pt] at (2.8,2.45) {\scriptsize termometro};
\node at (0.8,1.45) {\small acqua};
\node[below] at (-1.1,0.45) {\small peso};
\node[below] at (4.6,0.45) {\small peso};
\end{tikzpicture}
```

Il risultato si scrive con la vecchia unità del calore, la **caloria**: la quantità di calore che scalda di un grado, da $14{,}5$ a $15{,}5\,^\circ\text{C}$, un grammo d'acqua. Joule trovò che una caloria di calore equivale a circa $4{,}16\,\text{J}$ di lavoro; il valore di oggi è

$$1\,\text{cal} = 4{,}186\,\text{J}$$

Da allora il calore si misura in joule, come tutte le energie, e la caloria resta un'unità storica. Sopravvive nelle etichette degli alimenti, dove si usa la chilocaloria, $1\,\text{kcal} = 1000\,\text{cal} = 4186\,\text{J}$, accanto ai kilojoule. Il lavoro che si trasforma in riscaldamento per l'attrito è lo stesso della lezione [Forze dissipative e conservazione dell'energia totale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/forze-dissipative-e-conservazione-dell-energia-totale): quando strofini le mani, il lavoro delle forze di attrito le scalda.

## La capacità termica

Per scaldare di $10\,^\circ\text{C}$ una pentola piena d'acqua serve molto più calore che per scaldare di $10\,^\circ\text{C}$ un cucchiaino. Il calore necessario è proporzionale all'aumento di temperatura $\Delta t$, e il rapporto tra i due è la **capacità termica** $C$ del corpo:

$$C = \frac{Q}{\Delta t} \qquad\qquad Q = C\,\Delta t$$

La capacità termica è il calore che serve per scaldare quel corpo di un grado; si misura in $\text{J}/^\circ\text{C}$, o in $\text{J/K}$, che è lo stesso. È una proprietà dell'oggetto intero: una pentola grande ha una capacità termica più grande di una piccola dello stesso materiale.

## Il calore specifico

A parità di materiale, un corpo di massa doppia ha capacità termica doppia: ci sono il doppio delle particelle da scaldare. Dividendo la capacità termica per la massa si ottiene una grandezza che dipende solo dal materiale, il **calore specifico** $c$:

$$c = \frac{C}{m} = \frac{Q}{m\,\Delta t}$$

Il calore specifico è il calore che serve per scaldare di un grado un chilogrammo di quel materiale, e si misura in $\text{J/(kg}\cdot{}^\circ\text{C)}$. Rigirando la formula si ha la formula più usata della termologia:

$$Q = c\,m\,\Delta t \qquad\qquad C = c\,m$$

| Sostanza | $c$ in $\text{J/(kg}\cdot{}^\circ\text{C)}$ |
|---|---|
| acqua | $4186$ |
| alcol etilico | $2440$ |
| ghiaccio (a $-10\,^\circ\text{C}$) | $2050$ |
| olio d'oliva | $1970$ |
| alluminio | $897$ |
| vetro | $840$ |
| granito | $790$ |
| ferro | $449$ |
| rame | $385$ |
| piombo | $129$ |
| oro | $129$ |

Valori a temperatura ambiente e pressione normale: Wikipedia, "Table of specific heat capacities", letta il 30 settembre 2026, e per l'olio d'oliva The Engineering ToolBox, "Specific Heat of Common Liquids and Fluids", letta lo stesso giorno. Per l'acqua la tabella dà $4181$ a $25\,^\circ\text{C}$; $4186$ è il valore a $15\,^\circ\text{C}$ della definizione della caloria, e si usa negli esercizi.

L'acqua ha il calore specifico più alto di tutte le sostanze comuni: per scaldarla serve molta energia, e raffreddandosi ne cede molta. Per questo d'estate il mare resta più fresco della sabbia e d'inverno il clima vicino al mare è più mite, e per questo nei termosifoni scorre acqua. Un grammo d'acqua, per un grado, vuole una caloria: il calore specifico dell'acqua è $1\,\text{cal/(g}\cdot{}^\circ\text{C)}$, ed è proprio la definizione della caloria.

```ad-example
Esempio 1: scaldare l'acqua della pasta
Quanto calore serve per portare $2{,}0\,\text{kg}$ d'acqua da $20\,^\circ\text{C}$ a $100\,^\circ\text{C}$?

$\Delta t = 100 - 20 = 80\,^\circ\text{C}$, e

$$Q = c\,m\,\Delta t = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)} \cdot 2{,}0\,\text{kg} \cdot 80\,^\circ\text{C} = 669\,760\,\text{J} \approx 6{,}7 \cdot 10^5\,\text{J}$$

Circa $670\,\text{kJ}$, che su un fornello da $2\,\text{kW}$ sarebbero poco meno di sei minuti se tutto il calore della fiamma andasse nell'acqua.
```

```ad-warning
La massa in chilogrammi
Il calore specifico è per chilogrammo: una massa in grammi va convertita. Con $150\,\text{g}$ si scrive $0{,}150\,\text{kg}$; lasciando $150$ il calore viene mille volte più grande.
```

```ad-example
Esempio 2: la pentola e l'acqua
Una pentola d'alluminio ha la massa di $0{,}50\,\text{kg}$. Quanto vale la sua capacità termica? Quanto calore serve per scaldare di $80\,^\circ\text{C}$ la pentola con dentro $1{,}0\,\text{kg}$ d'acqua?

La capacità termica della pentola è $C = c\,m = 897 \cdot 0{,}50 = 448{,}5\,\text{J}/^\circ\text{C}$, quella dell'acqua $4186 \cdot 1{,}0 = 4186\,\text{J}/^\circ\text{C}$. Pentola e acqua si scaldano insieme, e le capacità termiche si sommano:

$$Q = (448{,}5 + 4186)\,\text{J}/^\circ\text{C} \cdot 80\,^\circ\text{C} = 370\,760\,\text{J} \approx 3{,}7 \cdot 10^5\,\text{J}$$

Quasi tutto il calore va nell'acqua: la pentola, che pesa la metà, ne prende meno di un decimo.
```

Con la stessa formula si trova di quanto si scalda un corpo che riceve un certo calore, oppure il calore specifico di un materiale da una misura.

```ad-example
Esempio 3: la temperatura finale
Una tazza con $150\,\text{g}$ d'acqua a $18\,^\circ\text{C}$ riceve $12\,\text{kJ}$ di calore. A che temperatura arriva l'acqua?

$$\Delta t = \frac{Q}{c\,m} = \frac{12\,000\,\text{J}}{4186\,\text{J/(kg}\cdot{}^\circ\text{C)} \cdot 0{,}150\,\text{kg}} = 19{,}11\ldots\,^\circ\text{C} \approx 19\,^\circ\text{C}$$

La temperatura finale è $t_f = 18 + 19 = 37\,^\circ\text{C}$: il calore dice di quanto sale la temperatura, non a quanto arriva.
```

```ad-example
Esempio 4: riconoscere il metallo
Un blocco di metallo di $0{,}40\,\text{kg}$ riceve $7{,}2\,\text{kJ}$ e passa da $20\,^\circ\text{C}$ a $60\,^\circ\text{C}$. Di che metallo può essere?

$$c = \frac{Q}{m\,\Delta t} = \frac{7200\,\text{J}}{0{,}40\,\text{kg} \cdot 40\,^\circ\text{C}} = 450\,\text{J/(kg}\cdot{}^\circ\text{C)}$$

Nella tabella il valore più vicino è quello del ferro, $449$.
```

### Il segno del calore

Nella formula $\Delta t$ è la temperatura finale meno quella iniziale, $\Delta t = t_f - t_i$. Quando un corpo si scalda, $\Delta t$ è positivo e anche $Q$: il corpo **assorbe** calore. Quando si raffredda, $\Delta t$ è negativo e $Q$ viene negativo: il corpo **cede** calore.

```ad-example
Esempio 5: il tè che si raffredda
Una tazza con $0{,}25\,\text{kg}$ di tè, che ha il calore specifico dell'acqua, passa da $80\,^\circ\text{C}$ a $30\,^\circ\text{C}$. Quanto calore scambia con l'ambiente?

$$Q = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)} \cdot 0{,}25\,\text{kg} \cdot (30 - 80)\,^\circ\text{C} = -52\,325\,\text{J} \approx -5{,}2 \cdot 10^4\,\text{J}$$

Il segno meno dice che il tè cede circa $52\,\text{kJ}$ all'aria e alla tazza.
```

```ad-warning
$\Delta t$ al contrario
$\Delta t$ è sempre finale meno iniziale. Chi fa iniziale meno finale trova un tè che assorbe calore mentre si raffredda. Quando il problema chiede "quanto calore cede", la risposta si dà senza segno, $52\,\text{kJ}$, perché è già la parola "cede" a dire il verso.
```

## Scaldare l'acqua e l'olio

Due pentolini uguali, sullo stesso fornello, uno con mezzo chilo d'acqua e uno con mezzo chilo d'olio d'oliva, ricevono lo stesso calore ogni secondo. L'olio si scalda più in fretta: per ogni grado vuole $1970\,\text{J}$ per chilogrammo, l'acqua $4186$. Con lo stesso $Q$ e la stessa $m$, gli aumenti di temperatura stanno nel rapporto inverso dei calori specifici:

$$\frac{\Delta t_{olio}}{\Delta t_{acqua}} = \frac{c_{acqua}}{c_{olio}} = \frac{4186}{1970} \approx 2{,}1$$

Nello stesso tempo l'olio si scalda circa il doppio dell'acqua. È un modo di misurare i calori specifici senza misurare il calore: basta confrontare due sostanze scaldate allo stesso modo.

```ad-tip
Il controllo del calore specifico
Una sostanza con un calore specifico alto si scalda poco e piano; una con un calore specifico basso si scalda molto e in fretta. Se in un esercizio il piombo si scalda meno dell'acqua ricevendo lo stesso calore, c'è un errore.
```

Nella figura qui sotto avvii il fornello e guardi salire le due temperature, insieme al grafico che le traccia.

```interattivo
% nome: riscaldamento-acqua-olio
% alt: Due pentolini uguali su due fornelli uguali, uno con mezzo chilogrammo d'acqua e uno con mezzo chilogrammo d'olio d'oliva, che occupa un po' più di volume. Un bottone accende i fornelli e un cursore sposta il tempo da 0 a 6 minuti; i fornelli danno a ciascun pentolino 200 joule al secondo. I termometri nei pentolini e un grafico temperatura-tempo mostrano l'olio che si scalda circa il doppio più in fretta: dopo 6 minuti l'acqua è a 54 gradi e l'olio a 93, con lo stesso calore ricevuto, 72 chilojoule
```

## Le calorie

Negli esercizi che usano le calorie tutto si fa come con i joule, con il calore specifico dell'acqua di $1\,\text{cal/(g}\cdot{}^\circ\text{C)}$, e alla fine si converte con $1\,\text{cal} = 4{,}186\,\text{J}$.

```ad-example
Esempio 6: l'energia di uno yogurt
Sull'etichetta di uno yogurt c'è scritto $100\,\text{kcal}$. Quanti joule sono? Quanti chilogrammi d'acqua potrebbero scaldare di $50\,^\circ\text{C}$?

$$100\,\text{kcal} = 100\,000\,\text{cal} = 100\,000 \cdot 4{,}186\,\text{J} = 418\,600\,\text{J} \approx 4{,}2 \cdot 10^5\,\text{J}$$

$$m = \frac{Q}{c\,\Delta t} = \frac{418\,600\,\text{J}}{4186\,\text{J/(kg}\cdot{}^\circ\text{C)} \cdot 50\,^\circ\text{C}} = 2{,}0\,\text{kg}$$

Con le calorie il conto è più corto: $100\,000\,\text{cal}$ divise per $1\,\text{cal/(g}\cdot{}^\circ\text{C)}$ e per $50\,^\circ\text{C}$ fanno $2000\,\text{g}$.
```

```ad-warning
Caloria e chilocaloria
La "caloria" delle etichette è una chilocaloria, mille calorie. Nei conti di fisica $1\,\text{cal} = 4{,}186\,\text{J}$ e $1\,\text{kcal} = 4186\,\text{J}$: scambiarle sbaglia il risultato di mille volte.
```

Quando due corpi a temperature diverse si scambiano calore fino a raggiungere la stessa temperatura, il calore ceduto dall'uno è uguale a quello assorbito dall'altro: è il principio del calorimetro, nella lezione [L'equilibrio termico e il calorimetro](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/l-equilibrio-termico-e-il-calorimetro). Il calore che serve per fondere il ghiaccio o far bollire l'acqua, senza cambiare la temperatura, è nella lezione [I passaggi di stato e il calore latente](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/i-passaggi-di-stato-e-il-calore-latente).
