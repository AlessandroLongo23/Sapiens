# I calori molari dei gas

Per scaldare di un grado un chilogrammo d'acqua servono $4186\,\text{J}$, e non importa come lo si scalda: un solido o un liquido hanno un solo [calore specifico](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico). Per un gas la domanda "quanto calore serve per scaldarlo di un grado?" non ha una sola risposta. Chiuso in una bombola rigida, il gas usa tutto il calore per scaldarsi; in un cilindro con un pistone libero di salire si espande mentre si scalda, e una parte del calore se ne va come lavoro sul pistone. Nel secondo caso, per lo stesso aumento di temperatura, serve più calore.

## Il calore molare

Con i gas conviene contare la quantità di sostanza in [moli](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare) invece che in chilogrammi: l'[equazione di stato](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto) $pV = nRT$ è scritta con le moli, e una mole contiene sempre lo stesso numero di molecole, qualunque sia il gas. Il **calore molare** $C$ di una sostanza è il calore che serve per aumentare di un kelvin la temperatura di una mole:

$$C = \frac{Q}{n\,\Delta T} \qquad\qquad Q = n\,C\,\Delta T$$

Si misura in $\text{J/(mol}\cdot\text{K)}$. La formula ha la stessa forma di $Q = c\,m\,\Delta t$, con le moli $n$ al posto della massa $m$. Poiché la massa di $n$ moli è $m = n\,M$, dove $M$ è la massa molare, il calore molare e il calore specifico sono legati da

$$C = c\,M$$

Un gas ha due calori molari diversi, secondo la trasformazione con cui lo si scalda: quello **a volume costante**, $C_V$, e quello **a pressione costante**, $C_p$.

```tikz
% nome: gas-volume-costante-pressione-costante
% alt: Due cilindri uguali con lo stesso gas, scaldati dal basso con lo stesso calore Q. Nel cilindro di sinistra il pistone è bloccato da due fermi e il volume resta costante: tutto il calore diventa energia interna. Nel cilindro di destra il pistone è libero e sale dalla posizione tratteggiata a una più alta: la pressione resta costante e una parte del calore diventa il lavoro W fatto sul pistone
% svg: gas-volume-costante-pressione-costante-e406fe6b.svg 287x199
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (2,1.6);
\draw[thick, fill=gray!20] (0.02,1.6) rectangle (1.98,1.85);
\draw[thick] (0.9,1.85) -- (0.9,2.5) (1.1,1.85) -- (1.1,2.5);
\draw[thick] (0,3.1) -- (0,0) -- (2,0) -- (2,3.1);
\fill (0,1.85) rectangle (0.3,1.97);
\fill (1.7,1.85) rectangle (2,1.97);
\draw[-{Stealth}, thick, orange!90!black] (1,-0.9) -- (1,-0.1) node[midway, right] {$Q$};
\node at (1,0.8) {$\Delta U$};
\node[below] at (1,-1.0) {\small volume costante};
\node[below] at (1,-1.45) {\small $Q = \Delta U$};
\begin{scope}[xshift=4.2cm]
\fill[blue!10] (0,0) rectangle (2,2.3);
\draw[thick, fill=gray!20] (0.02,2.3) rectangle (1.98,2.55);
\draw[thick] (0.9,2.55) -- (0.9,3.2) (1.1,2.55) -- (1.1,3.2);
\draw[thick] (0,3.1) -- (0,0) -- (2,0) -- (2,3.1);
\draw[dashed, thin] (0,1.6) -- (2,1.6);
\draw[-{Stealth}, thick, red] (2.4,1.6) -- (2.4,2.3) node[midway, right] {$W$};
\draw[-{Stealth}, thick, orange!90!black] (1,-0.9) -- (1,-0.1) node[midway, right] {$Q$};
\node at (1,0.8) {$\Delta U$};
\node[below] at (1,-1.0) {\small pressione costante};
\node[below] at (1,-1.45) {\small $Q = \Delta U + W$};
\end{scope}
\end{tikzpicture}
```

## Il calore molare a volume costante

In una bombola rigida il volume non cambia: la trasformazione è un'isocora, e il gas non compie lavoro. Per il [primo principio della termodinamica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica), $\Delta U = Q - W$ con $W = 0$: tutto il calore assorbito diventa energia interna.

$$Q = n\,C_V\,\Delta T = \Delta U$$

Per un gas perfetto monoatomico l'[energia interna](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/l-energia-interna) è $U = \tfrac{3}{2}\,nRT$, quindi una variazione di temperatura $\Delta T$ la cambia di $\Delta U = \tfrac{3}{2}\,nR\,\Delta T$. Confrontando con $\Delta U = n\,C_V\,\Delta T$:

$$C_V = \frac{3}{2}\,R = \frac{3}{2} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} = 12{,}5\,\text{J/(mol}\cdot\text{K)}$$

Il calore molare a volume costante è lo stesso per tutti i gas monoatomici (elio, neon, argon): non dipende dalla massa degli atomi, perché una mole ne contiene sempre lo stesso numero e ognuno, in media, ha la stessa energia cinetica alla stessa temperatura.

```ad-example
Esempio 1: l'elio in una bombola
Una bombola rigida contiene $2{,}00\,\text{mol}$ di elio a $20{,}0\,^\circ\text{C}$. Quanto calore serve per portarlo a $80{,}0\,^\circ\text{C}$?

La variazione di temperatura è $\Delta T = 60{,}0\,^\circ\text{C} = 60{,}0\,\text{K}$: una differenza di temperatura ha lo stesso valore nelle due scale. Il volume è costante e l'elio è monoatomico:

$$Q = n\,C_V\,\Delta T = 2{,}00\,\text{mol} \cdot \frac{3}{2} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 60{,}0\,\text{K} = 1495{,}8\,\text{J} \approx 1{,}50 \cdot 10^3\,\text{J}$$

Il gas non compie lavoro, quindi anche la sua energia interna aumenta di $1{,}50 \cdot 10^3\,\text{J}$.
```

```ad-warning
Non si aggiunge 273 a una differenza
In $Q = n\,C\,\Delta T$ compare una differenza di temperatura, che in kelvin e in gradi Celsius ha lo stesso valore: da $20\,^\circ\text{C}$ a $80\,^\circ\text{C}$ ci sono $60\,\text{K}$, non $333\,\text{K}$. I $273$ si aggiungono alle temperature, non alle loro differenze.
```

### L'energia interna cambia sempre di $n\,C_V\,\Delta T$

L'energia interna di un gas perfetto è una funzione di stato e dipende solo dalla temperatura. Se due trasformazioni diverse portano il gas dalla stessa temperatura iniziale alla stessa temperatura finale, la variazione di energia interna è la stessa, ed è quella che abbiamo calcolato lungo l'isocora. Per qualunque trasformazione di un gas perfetto, anche se il volume cambia:

$$\Delta U = n\,C_V\,\Delta T$$

```ad-warning
$C_V$ non serve solo a volume costante
Il nome inganna. $Q = n\,C_V\,\Delta T$ vale solo se il volume è costante, ma $\Delta U = n\,C_V\,\Delta T$ vale sempre: in un'isobara, in un'[adiabatica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/la-trasformazione-adiabatica), in una trasformazione qualsiasi. In un'isobara il calore si calcola con $C_p$ e la variazione di energia interna con $C_V$.
```

## Il calore molare a pressione costante

In un cilindro chiuso da un pistone libero di muoversi la pressione del gas resta uguale a quella esterna: la trasformazione è un'[isobara](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma). Scaldandosi il gas si espande e compie il [lavoro](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-lavoro-in-una-trasformazione-termodinamica) $W = p\,\Delta V$. Il calore assorbito deve coprire due voci, l'aumento di energia interna e il lavoro:

$$Q = \Delta U + W = n\,C_V\,\Delta T + p\,\Delta V$$

A pressione costante l'equazione di stato scritta prima e dopo, $pV_A = nRT_A$ e $pV_B = nRT_B$, dà per differenza $p\,\Delta V = nR\,\Delta T$. Sostituendo:

$$Q = n\,C_V\,\Delta T + nR\,\Delta T = n\,(C_V + R)\,\Delta T$$

Il calore è ancora proporzionale a $n\,\Delta T$, e il fattore tra parentesi è il calore molare a pressione costante:

$$C_p = C_V + R$$

È la **relazione di Mayer**. Vale per tutti i gas perfetti, non solo per quelli monoatomici, perché nel ricavarla abbiamo usato soltanto il primo principio e l'equazione di stato. La differenza $C_p - C_V = R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$ è il lavoro che una mole di gas compie quando si scalda di un kelvin a pressione costante. Per un gas monoatomico

$$C_p = \frac{3}{2}\,R + R = \frac{5}{2}\,R = 20{,}8\,\text{J/(mol}\cdot\text{K)}$$

Nel piano pressione-volume le due trasformazioni partono dallo stesso stato $A$ e arrivano sulla stessa isoterma, quella della temperatura $T + \Delta T$: l'isocora salendo in verticale fino a $B$, l'isobara andando in orizzontale fino a $C$. La variazione di energia interna è la stessa, perché la temperatura finale è la stessa. Sotto il segmento $AB$ non c'è area e il lavoro è zero; sotto $AC$ c'è il rettangolo del lavoro $p\,\Delta V$, ed è quello il calore in più che l'isobara richiede.

```tikz
% nome: isocora-isobara-stesse-isoterme
% alt: Piano pressione-volume con due isoterme, quella a temperatura T più vicina agli assi e quella a temperatura T più delta T più lontana. Dallo stato A sulla prima isoterma partono due trasformazioni che arrivano sulla seconda: un segmento verticale fino a B, l'isocora, e un segmento orizzontale fino a C, l'isobara. Sotto il segmento AC è colorato il rettangolo del lavoro W
% svg: isocora-isobara-stesse-isoterme-182b1590.svg 248x206
% poi-interattivo: spostare lo stato A lungo l'isoterma e vedere che il rettangolo del lavoro tiene la stessa area, n R per delta T
\begin{tikzpicture}
\fill[orange!25] (1.5,0) rectangle (2.25,2);
\draw[->] (0,0) -- (5.2,0) node[right] {$V$};
\draw[->] (0,0) -- (0,4.4) node[above] {$p$};
\draw[thick, blue!60, domain=0.75:4.8, samples=60, smooth] plot (\x, {3/\x});
\draw[thick, red!80!black, domain=1.125:4.8, samples=60, smooth] plot (\x, {4.5/\x});
\node[right, blue!60] at (4.8,0.5) {$T$};
\node[right, red!80!black] at (4.8,1.05) {$T + \Delta T$};
\draw[dashed, thin] (1.5,0) -- (1.5,2);
\draw[dashed, thin] (2.25,0) -- (2.25,2);
\draw[-{Stealth}, very thick] (1.5,2) -- (1.5,2.95);
\draw[-{Stealth}, very thick] (1.5,2) -- (2.2,2);
\fill (1.5,2) circle (0.06) node[left] {$A$};
\fill (1.5,3) circle (0.06) node[left] {$B$};
\fill (2.25,2) circle (0.06) node[above right] {$C$};
\node at (1.875,0.9) {$W$};
\node[below] at (1.5,0) {\small $V_A$};
\node[below] at (2.3,0) {\small $V_C$};
\end{tikzpicture}
```

```ad-example
Esempio 2: lo stesso elio con il pistone libero
Le $2{,}00\,\text{mol}$ di elio dell'esempio 1 si trovano ora in un cilindro con un pistone libero, e vengono scaldate ancora da $20{,}0\,^\circ\text{C}$ a $80{,}0\,^\circ\text{C}$. Quanto calore serve? Quanto lavoro compie il gas?

La pressione è costante, quindi si usa $C_p = \tfrac{5}{2} R$:

$$Q = n\,C_p\,\Delta T = 2{,}00\,\text{mol} \cdot \frac{5}{2} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 60{,}0\,\text{K} = 2493\,\text{J} \approx 2{,}49 \cdot 10^3\,\text{J}$$

Il lavoro è

$$W = p\,\Delta V = nR\,\Delta T = 2{,}00\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 60{,}0\,\text{K} = 997{,}2\,\text{J} \approx 997\,\text{J}$$

La variazione di energia interna è la stessa dell'esempio 1, $\Delta U = n\,C_V\,\Delta T \approx 1{,}50 \cdot 10^3\,\text{J}$, perché le temperature sono le stesse. Il conto torna: $1496\,\text{J} + 997\,\text{J} = 2493\,\text{J}$.
```

Il confronto tra i due esempi si vede meglio con le barre, disegnate in scala: a volume costante tutto il calore è energia interna; a pressione costante lo stesso aumento di energia interna costa $997\,\text{J}$ in più, che escono dal gas come lavoro.

```tikz
% nome: barre-calore-elio-due-trasformazioni
% alt: Due barre orizzontali in scala. La prima, a volume costante, è lunga 1496 joule ed è tutta variazione di energia interna. La seconda, a pressione costante, è lunga 2493 joule ed è divisa in due parti: 1496 joule di variazione di energia interna, lunga quanto la prima barra, e 997 joule di lavoro
% svg: barre-calore-elio-due-trasformazioni-c2ff0ba0.svg 264x117
\begin{tikzpicture}
\node[left] at (-0.1,1.5) {\small $V$ costante};
\draw[thick, fill=blue!10] (0,1.2) rectangle (3,1.8);
\node at (1.5,1.5) {\small $\Delta U = 1496$ J};
\node[left] at (-0.1,0.3) {\small $p$ costante};
\draw[thick, fill=blue!10] (0,0) rectangle (3,0.6);
\draw[thick, fill=orange!25] (3,0) rectangle (5,0.6);
\node at (1.5,0.3) {\small $\Delta U = 1496$ J};
\node at (4,0.3) {\small $W = 997$ J};
\draw[dashed, thin] (3,-0.2) -- (3,2.1);
\draw[{Stealth}-{Stealth}, thin] (0,-0.4) -- (5,-0.4) node[midway, below] {\small $Q = 2493$ J};
\end{tikzpicture}
```

Di tutto il calore che un gas monoatomico assorbe a pressione costante, i tre quinti diventano energia interna e i due quinti lavoro: sono i rapporti $C_V / C_p = 3/5$ e $R / C_p = 2/5$.

Nella figura qui sotto due cilindri uguali contengono una mole dello stesso gas a $300\,\text{K}$: a sinistra il pistone è bloccato, a destra è libero. Con il cursore dai a tutti e due lo stesso calore e leggi di quanto si scaldano.

```interattivo
% nome: calori-molari-due-cilindri
% alt: Due cilindri uguali con una mole dello stesso gas a 300 kelvin: in quello di sinistra il pistone è bloccato, in quello di destra è libero di salire. Un cursore sceglie il calore dato a ciascuno, da 0 a 3000 joule, e un selettore sceglie se il gas è monoatomico o biatomico. Sopra ogni cilindro è scritta la temperatura raggiunta; a destra il pistone sale. Accanto a ogni cilindro una barra divide il calore in variazione di energia interna e lavoro: a sinistra è tutta energia interna, a destra una parte è lavoro. Sotto sono scritti gli aumenti di temperatura, il lavoro e il loro rapporto
```

Con $1500\,\text{J}$ il gas monoatomico si scalda di $120\,\text{K}$ nel cilindro bloccato e solo di $72\,\text{K}$ in quello con il pistone libero, i tre quinti: gli altri $600\,\text{J}$ sono il lavoro fatto sul pistone. Con un gas biatomico gli aumenti scendono a $72\,\text{K}$ e $52\,\text{K}$, perché le sue molecole hanno più modi di immagazzinare energia.

## I gradi di libertà

Il valore $\tfrac{3}{2} R$ viene dalla teoria cinetica: l'[energia cinetica media](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/temperatura-ed-energia-cinetica-delle-molecole) di una molecola è $\tfrac{3}{2} k_B T$. Quel 3 ha un significato preciso: un atomo può muoversi lungo tre direzioni indipendenti, $x$, $y$ e $z$, e a ciascuna corrisponde in media un'energia $\tfrac{1}{2} k_B T$.

Ogni modo indipendente in cui una molecola può muoversi e avere energia si chiama **grado di libertà**. Il **principio di equipartizione dell'energia**, che qui enunciamo senza dimostrarlo, dice che a ogni grado di libertà spetta in media la stessa energia, $\tfrac{1}{2} k_B T$ per molecola, cioè $\tfrac{1}{2} RT$ per mole. Un gas perfetto le cui molecole hanno $\ell$ gradi di libertà ha quindi

$$U = \frac{\ell}{2}\,nRT \qquad\qquad C_V = \frac{\ell}{2}\,R \qquad\qquad C_p = \frac{\ell + 2}{2}\,R$$

Un gas monoatomico ha solo le tre traslazioni, $\ell = 3$, e ritroviamo $C_V = \tfrac{3}{2} R$. Una molecola biatomica, come quelle di idrogeno, azoto e ossigeno, è fatta di due atomi legati, simile a un manubrio da palestra: oltre a traslare nelle tre direzioni può ruotare attorno a due assi perpendicolari alla retta che unisce gli atomi. I gradi di libertà sono $3 + 2 = 5$.

```tikz
% nome: gradi-liberta-monoatomico-biatomico
% alt: A sinistra un atomo isolato con tre frecce lungo le direzioni x, y e z: i tre gradi di libertà di traslazione di un gas monoatomico. A destra una molecola biatomica, due atomi uniti da un legame, con le stesse tre frecce di traslazione e due assi di rotazione tratteggiati, perpendicolari al legame, ciascuno con una freccia curva: cinque gradi di libertà in tutto
% svg: gradi-liberta-monoatomico-biatomico-1f01a507.svg 336x140
\begin{tikzpicture}
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (1.2,0) node[right] {$x$};
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (0,1.2) node[above] {$y$};
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (-0.75,-0.75) node[below left] {$z$};
\draw[thick, fill=blue!20] (0,0) circle (0.3);
\node[below] at (0.2,-1.5) {\small monoatomico: $\ell = 3$};
\begin{scope}[xshift=5cm]
\draw[thin, dash dot] (0,-1.3) -- (0,1.5);
\draw[thin, dash dot] (-0.9,-0.9) -- (0.95,0.95);
\draw[-{Stealth}, thick, blue!60!black] (0.9,0) -- (2.0,0) node[right] {$x$};
\draw[-{Stealth}, thick, blue!60!black] (-0.6,0.3) -- (-0.6,1.3) node[left] {$y$};
\draw[-{Stealth}, thick, blue!60!black] (-0.8,-0.2) -- (-1.4,-0.8) node[below left] {$z$};
\draw[very thick] (-0.6,0) -- (0.6,0);
\draw[thick, fill=blue!20] (-0.6,0) circle (0.3);
\draw[thick, fill=blue!20] (0.6,0) circle (0.3);
\draw[-{Stealth}, thick, orange!90!black] (0.29,1.15) arc[start angle=-20, end angle=-340, x radius=0.3, y radius=0.11];
\begin{scope}[shift={(0.75,0.75)}, rotate=45]
\draw[-{Stealth}, thick, orange!90!black] (0.1,-0.28) arc[start angle=-70, end angle=-290, x radius=0.11, y radius=0.3];
\end{scope}
\node[below] at (0.2,-1.5) {\small biatomico: $\ell = 5$};
\end{scope}
\end{tikzpicture}
```

Per un gas biatomico, allora,

$$C_V = \frac{5}{2}\,R = 20{,}8\,\text{J/(mol}\cdot\text{K)} \qquad\qquad C_p = \frac{7}{2}\,R = 29{,}1\,\text{J/(mol}\cdot\text{K)}$$

L'aria è fatta quasi tutta di azoto e ossigeno, e si comporta come un gas biatomico. Per scaldare un gas biatomico serve più calore che per un gas monoatomico, a parità di moli e di aumento di temperatura: una parte dell'energia finisce nella rotazione delle molecole, che non fa salire la temperatura. La temperatura misura soltanto l'energia cinetica di traslazione.

```ad-note
La rotazione che non conta e le vibrazioni
La rotazione attorno alla retta che unisce i due atomi non entra nel conto, e i due atomi potrebbero anche vibrare avvicinandosi e allontanandosi come se fossero uniti da una molla. A temperatura ambiente nelle molecole di idrogeno, azoto e ossigeno questi moti non si attivano: il motivo lo spiega la fisica quantistica. A temperature di migliaia di kelvin le vibrazioni cominciano a contare e il calore molare cresce.
```

I valori misurati a temperatura ambiente confermano il modello:

| Gas | $C_V$ in $\text{J/(mol}\cdot\text{K)}$ | $C_p$ in $\text{J/(mol}\cdot\text{K)}$ | $C_p - C_V$ | $\gamma = C_p / C_V$ |
|---|---|---|---|---|
| elio (He) | $12{,}5$ | $20{,}8$ | $8{,}3$ | $1{,}67$ |
| argon (Ar) | $12{,}5$ | $20{,}8$ | $8{,}3$ | $1{,}67$ |
| idrogeno ($\text{H}_2$) | $20{,}5$ | $28{,}8$ | $8{,}3$ | $1{,}40$ |
| azoto ($\text{N}_2$) | $20{,}8$ | $29{,}1$ | $8{,}3$ | $1{,}40$ |
| ossigeno ($\text{O}_2$) | $21{,}1$ | $29{,}4$ | $8{,}3$ | $1{,}39$ |
| vapore d'acqua ($\text{H}_2\text{O}$) | $25{,}3$ | $33{,}6$ | $8{,}3$ | $1{,}33$ |

La differenza $C_p - C_V$ è sempre $R$, come dice la relazione di Mayer. Le molecole con più di due atomi che non stanno su una retta, come quella dell'acqua, possono ruotare attorno a tre assi: i gradi di libertà sono $6$, e il modello dà $C_V = 3R = 24{,}9\,\text{J/(mol}\cdot\text{K)}$. Per queste molecole l'accordo è meno buono, perché alcune vibrazioni contano già a temperatura ambiente.

## Il rapporto $\gamma$

L'ultima colonna della tabella è il rapporto tra i due calori molari, che si indica con la lettera greca gamma:

$$\gamma = \frac{C_p}{C_V} = \frac{\ell + 2}{\ell}$$

È un numero puro, sempre maggiore di 1 perché $C_p > C_V$. Vale $\tfrac{5}{3} \approx 1{,}67$ per i gas monoatomici e $\tfrac{7}{5} = 1{,}40$ per quelli biatomici. Compare nella legge della [trasformazione adiabatica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/la-trasformazione-adiabatica), $p\,V^\gamma = \text{costante}$.

| Gas perfetto | $\ell$ | $C_V$ | $C_p$ | $\gamma$ |
|---|---|---|---|---|
| monoatomico | $3$ | $\tfrac{3}{2} R = 12{,}5\,\text{J/(mol}\cdot\text{K)}$ | $\tfrac{5}{2} R = 20{,}8\,\text{J/(mol}\cdot\text{K)}$ | $\tfrac{5}{3} \approx 1{,}67$ |
| biatomico | $5$ | $\tfrac{5}{2} R = 20{,}8\,\text{J/(mol}\cdot\text{K)}$ | $\tfrac{7}{2} R = 29{,}1\,\text{J/(mol}\cdot\text{K)}$ | $\tfrac{7}{5} = 1{,}40$ |

```ad-warning
Lo stesso numero, due significati
$20{,}8\,\text{J/(mol}\cdot\text{K)}$ è il $C_p$ di un gas monoatomico e anche il $C_V$ di un gas biatomico: tutti e due valgono $\tfrac{5}{2} R$. Prima di scrivere il numero controlla due cose, il tipo di gas e la grandezza che resta costante.
```

## Problemi con i calori molari

In ogni problema le domande da farsi sono tre: il gas è monoatomico o biatomico, che cosa resta costante, e se la quantità di gas è data in moli.

```ad-example
Esempio 3: l'azoto che solleva il pistone
Un cilindro con un pistone libero contiene $0{,}500\,\text{mol}$ di azoto, che assorbe $730\,\text{J}$ di calore. Di quanto aumenta la sua temperatura? Quanto lavoro compie, e di quanto cambia la sua energia interna?

L'azoto è biatomico e la pressione è costante: $C_p = \tfrac{7}{2} R$. Dalla formula inversa di $Q = n\,C_p\,\Delta T$:

$$\Delta T = \frac{Q}{n\,C_p} = \frac{730\,\text{J}}{0{,}500\,\text{mol} \cdot \frac{7}{2} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)}} = 50{,}19\ldots\,\text{K} \approx 50{,}2\,\text{K}$$

Il lavoro e la variazione di energia interna:

$$W = nR\,\Delta T = 0{,}500\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 50{,}2\,\text{K} \approx 209\,\text{J}$$

$$\Delta U = Q - W = 730\,\text{J} - 209\,\text{J} = 521\,\text{J}$$

Il lavoro è i due settimi del calore e l'energia interna i cinque settimi: sono i rapporti $R / C_p$ e $C_V / C_p$ di un gas biatomico. Con il pistone bloccato gli stessi $730\,\text{J}$ avrebbero scaldato l'azoto di $730 / (0{,}500 \cdot \tfrac{5}{2} \cdot 8{,}31)\,\text{K} \approx 70{,}3\,\text{K}$.
```

```ad-example
Esempio 4: dai grammi alle moli
Una bombola rigida contiene $56{,}0\,\text{g}$ di azoto, che ha massa molare $M = 28{,}0\,\text{g/mol}$. Quanto calore serve per scaldarlo di $25{,}0\,\text{K}$? Quanto vale il calore specifico a volume costante dell'azoto?

Il calore molare vuole le moli:

$$n = \frac{m}{M} = \frac{56{,}0\,\text{g}}{28{,}0\,\text{g/mol}} = 2{,}00\,\text{mol}$$

Il volume è costante e il gas è biatomico:

$$Q = n\,C_V\,\Delta T = 2{,}00\,\text{mol} \cdot \frac{5}{2} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 25{,}0\,\text{K} = 1038{,}75\,\text{J} \approx 1{,}04 \cdot 10^3\,\text{J}$$

Il calore specifico si ricava da $C = c\,M$, con la massa molare in chilogrammi, $M = 0{,}0280\,\text{kg/mol}$:

$$c_V = \frac{C_V}{M} = \frac{20{,}8\,\text{J/(mol}\cdot\text{K)}}{0{,}0280\,\text{kg/mol}} \approx 742\,\text{J/(kg}\cdot\text{K)}$$

Un chilogrammo di azoto, a volume costante, si scalda con meno di un quinto del calore che serve per un chilogrammo d'acqua.
```

```ad-warning
I grammi non sono moli
In $Q = n\,C\,\Delta T$ la lettera $n$ è il numero di moli. Se il problema dà la massa, prima si divide per la massa molare: $56{,}0\,\text{g}$ di azoto sono $2{,}00\,\text{mol}$, non $56{,}0$.
```

```ad-example
Esempio 5: che gas è?
In un recipiente rigido $3{,}00\,\text{mol}$ di un gas assorbono $1870\,\text{J}$ e passano da $290{,}0\,\text{K}$ a $320{,}0\,\text{K}$. Il gas è monoatomico o biatomico?

Il recipiente è rigido, quindi la misura dà il calore molare a volume costante, con $\Delta T = 30{,}0\,\text{K}$:

$$C_V = \frac{Q}{n\,\Delta T} = \frac{1870\,\text{J}}{3{,}00\,\text{mol} \cdot 30{,}0\,\text{K}} = 20{,}77\ldots\,\text{J/(mol}\cdot\text{K)} \approx 20{,}8\,\text{J/(mol}\cdot\text{K)}$$

Diviso per $R$ dà $20{,}8 / 8{,}31 = 2{,}50$: il calore molare è $\tfrac{5}{2} R$, e il gas è biatomico. Se la stessa misura fosse stata fatta a pressione costante, $20{,}8\,\text{J/(mol}\cdot\text{K)}$ sarebbe stato un $C_p$, e il gas sarebbe stato monoatomico.
```

## Riepilogo

| | A volume costante | A pressione costante |
|---|---|---|
| calore | $Q = n\,C_V\,\Delta T$ | $Q = n\,C_p\,\Delta T$ |
| lavoro | $W = 0$ | $W = p\,\Delta V = nR\,\Delta T$ |
| energia interna | $\Delta U = n\,C_V\,\Delta T$ | $\Delta U = n\,C_V\,\Delta T$ |

Con $C_p = C_V + R$, e $C_V = \tfrac{3}{2} R$ per un gas monoatomico, $\tfrac{5}{2} R$ per un gas biatomico.
