# Le proprietà fisiche dell'acqua

Un cubetto di ghiaccio galleggia nel bicchiere, un insetto cammina sulla superficie di uno stagno, il mare d'estate resta più fresco della spiaggia, un tovagliolo di carta con un angolo nell'acqua si bagna tutto fino in cima. Sono quattro comportamenti dell'acqua che quasi nessun altro liquido ha, e vengono tutti dalla stessa causa: i [legami a idrogeno](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/la-molecola-d-acqua-e-il-legame-a-idrogeno) che tengono unite le sue molecole.

## Le temperature dei passaggi di stato

Alla pressione atmosferica normale l'acqua pura fonde a $0\,^\circ\text{C}$ e bolle a $100\,^\circ\text{C}$: sono i due punti fissi della scala Celsius, come spiega la lezione [Temperatura e calore](/materiale/scuola-superiore/chimica/misure-e-grandezze/temperatura-e-calore). Per una molecola così piccola sono temperature altissime: il metano, che ha quasi la stessa massa, bolle a $-162\,^\circ\text{C}$. È per questo che sulla Terra l'acqua è soprattutto liquida, e i passaggi tra ghiaccio, acqua e vapore, trattati nella lezione [I passaggi di stato](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/i-passaggi-di-stato), avvengono tutti alle temperature che si incontrano nella vita di ogni giorno.

## La densità e il ghiaccio che galleggia

Quasi tutte le sostanze sono più dense da solide che da liquide: le particelle del solido, ordinate, stanno più strette. Un pezzo di cera solida affonda nella cera fusa. L'acqua fa il contrario: il ghiaccio ha una densità di $0{,}917\,\text{g/mL}$, l'acqua liquida vicino a $0\,^\circ\text{C}$ quasi $1{,}000\,\text{g/mL}$, e il ghiaccio galleggia.

Il motivo sta nella struttura del ghiaccio. Nel solido ogni molecola forma quattro legami a idrogeno con quattro vicine, e le molecole si dispongono in una rete ordinata fatta di anelli di sei molecole, con molti spazi vuoti in mezzo: una struttura aperta, che occupa più volume. Quando il ghiaccio fonde, una parte dei legami a idrogeno si rompe, la rete crolla e le molecole si avvicinano, riempiendo i vuoti. Lo stesso numero di molecole occupa meno spazio, e la densità cresce.

```ad-example
Esempio 1: una bottiglia nel congelatore
Una bottiglia di vetro contiene $750\,\text{mL}$ d'acqua, con densità $1{,}00\,\text{g/mL}$. Che volume occupa l'acqua dopo che è diventata ghiaccio?

La massa non cambia nel passaggio di stato: $m = d\,V = 1{,}00\,\text{g/mL} \cdot 750\,\text{mL} = 750\,\text{g}$. Il volume del ghiaccio è

$$V = \frac{m}{d} = \frac{750\,\text{g}}{0{,}917\,\text{g/mL}} = 818\,\text{mL}$$

Il volume aumenta di $68\,\text{mL}$, circa il $9\%$: se la bottiglia era piena, il vetro si rompe. Per la stessa ragione l'acqua che gela nelle crepe delle rocce le allarga fino a spaccarle.
```

```ad-warning
La massa non cambia, il volume sì
Quando l'acqua ghiaccia le molecole sono le stesse, e la massa resta la stessa. Cambia il volume, e quindi la densità. Un errore frequente è moltiplicare il volume per $0{,}917$ e trovare un ghiaccio più piccolo dell'acqua: se la densità diminuisce, a parità di massa il volume deve crescere.
```

Un corpo galleggia in un liquido più denso di lui, e la parte immersa è tanto più grande quanto più le due densità sono vicine: la frazione immersa è il rapporto tra la densità del corpo e quella del liquido, come spiega la lezione di fisica [La spinta di Archimede e il galleggiamento](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-spinta-di-archimede-e-il-galleggiamento). Per un blocco di ghiaccio nell'acqua dolce è $0{,}917/1{,}000$, cioè il $91{,}7\%$; in mare, dove l'acqua salata ha una densità di circa $1{,}03\,\text{g/mL}$, è $0{,}917/1{,}03 = 0{,}89$. Di un iceberg si vede più o meno un decimo.

## Il massimo di densità a 4 °C

L'acqua liquida ha un'altra stranezza. Scaldata da $0$ a $4\,^\circ\text{C}$ non si dilata come gli altri liquidi, ma si contrae, e la sua densità cresce; solo sopra i $4\,^\circ\text{C}$ si comporta in modo normale, e scaldandosi diventa meno densa. La densità massima, $0{,}99997\,\text{g/mL}$, si ha a circa $4\,^\circ\text{C}$.

```tikz
% nome: acqua-densita-temperatura
% alt: Grafico della densità dell'acqua liquida in funzione della temperatura, da 0 a 20 gradi Celsius. L'asse verticale va da 0,9980 a 1,0000 grammi al millilitro, e non parte da zero. La curva sale da 0,99984 a 0 gradi fino al massimo di 0,99997 a 4 gradi, segnato con una linea tratteggiata, poi scende sempre più ripida fino a 0,99821 a 20 gradi
% svg: acqua-densita-temperatura-580bb1a1.svg 336x186
% poi-interattivo: scorrere la temperatura e leggere la densità, con il volume di un chilogrammo d'acqua accanto
\begin{tikzpicture}[x=0.3cm, y=1.6cm]
\draw[gray!25, very thin] (0,0) grid[xstep=2, ystep=0.5] (20,2);
\draw[->] (0,0) -- (21.5,0) node[right] {\small $t$ ($^\circ$C)};
\draw[->] (0,0) -- (0,2.35) node[above] {\small $d$ (g/mL)};
\foreach \x in {0,4,8,12,16,20} \draw (\x,0) -- (\x,-0.05) node[below] {\small $\x$};
\foreach \y/\l in {0/0{,}9980, 0.5/0{,}9985, 1/0{,}9990, 1.5/0{,}9995, 2/1{,}0000} \draw (0,\y) -- (-0.3,\y) node[left] {\small $\l$};
\draw[thick, blue] plot[smooth] coordinates {(0,1.84) (2,1.94) (4,1.97) (6,1.94) (8,1.85) (10,1.7) (12,1.5) (14,1.24) (16,0.94) (18,0.6) (20,0.21)};
\foreach \x/\y in {0/1.84, 4/1.97, 10/1.7, 20/0.21} \fill[blue] (\x,\y) circle (1.5pt);
\draw[thin, dashed] (4,0) -- (4,1.97);
\node[above right] at (4,1.97) {\small massimo a $4\,^\circ$C};
\end{tikzpicture}
```

Le differenze sono piccole, pochi decimillesimi, ma bastano a decidere dove va l'acqua in un lago. La fisica le misura nella lezione [La dilatazione termica](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-dilatazione-termica), che parla del comportamento anomalo dell'acqua; qui interessa la spiegazione. Appena fuso, il liquido contiene ancora molti gruppi di molecole legate come nel ghiaccio, con i loro spazi vuoti. Scaldando da $0$ a $4\,^\circ\text{C}$ questi gruppi si rompono e le molecole si avvicinano, e l'effetto vince sulla normale dilatazione dovuta al movimento più rapido delle molecole. Sopra i $4\,^\circ\text{C}$ i gruppi rimasti sono pochi, e vince la dilatazione.

D'inverno l'acqua della superficie di un lago si raffredda, diventa più densa e scende, finché tutto il lago arriva a $4\,^\circ\text{C}$. Da lì in poi l'acqua che si raffredda ancora è meno densa e resta in superficie, dove ghiaccia. Lo strato di ghiaccio galleggia e isola l'acqua sotto: il lago gela dall'alto, e sul fondo l'acqua resta intorno ai $4\,^\circ\text{C}$, abbastanza calda per i pesci.

```tikz
% nome: acqua-lago-inverno
% alt: Sezione di un lago d'inverno. In alto l'aria a meno 10 gradi, poi uno strato di ghiaccio a 0 gradi che galleggia; sotto il ghiaccio l'acqua va da 1 grado appena sotto la superficie a 4 gradi sul fondo, in strati sempre più scuri. Un pesce nuota vicino al fondo
% svg: acqua-lago-inverno-2fecfed1.svg 267x156
\begin{tikzpicture}
\fill[cyan!8] (0,3) rectangle (6,2.4);
\fill[cyan!15] (0,2.4) rectangle (6,1.8);
\fill[cyan!22] (0,1.8) rectangle (6,1.2);
\fill[cyan!30] (0,1.2) rectangle (6,0);
\draw[thick, fill=blue!5] (0,3) rectangle (6,3.4);
\draw[thick] (0,3.9) -- (0,0) -- (6,0) -- (6,3.9);
\node at (3,3.2) {\small ghiaccio, $0\,^\circ$C};
\node at (3,3.75) {\small aria, $-10\,^\circ$C};
\node[right] at (6.1,2.7) {\small $1\,^\circ$C};
\node[right] at (6.1,2.1) {\small $2\,^\circ$C};
\node[right] at (6.1,1.5) {\small $3\,^\circ$C};
\node[right] at (6.1,0.6) {\small $4\,^\circ$C};
\draw[thick] (2.2,0.5) .. controls (2.6,0.8) and (3.1,0.8) .. (3.4,0.5) .. controls (3.1,0.2) and (2.6,0.2) .. (2.2,0.5) -- (1.95,0.72) -- (1.95,0.28) -- cycle;
\fill (3.15,0.55) circle (0.8pt);
\end{tikzpicture}
```

```ad-warning
L'acqua è più densa a 0 °C
Il massimo di densità dell'acqua liquida è a $4\,^\circ\text{C}$, non a $0\,^\circ\text{C}$. E il ghiaccio, sempre a $0\,^\circ\text{C}$, è meno denso dell'acqua liquida alla stessa temperatura: sono due anomalie diverse, e tutte e due vengono dai legami a idrogeno.
```

## Il calore specifico alto

Per scaldare l'acqua serve molta energia. Il calore che serve per scaldare di un grado un grammo di una sostanza è il suo **calore specifico** $c$, e per l'acqua vale $4{,}186\,\text{J/(g}\cdot{}^\circ\text{C)}$, il più alto tra le sostanze comuni: quasi il doppio dell'etanolo ($2{,}44$), quasi dieci volte il ferro ($0{,}449$). Il calore scambiato da una massa $m$ la cui temperatura cambia di $\Delta t$ è, come nella lezione [Temperatura e calore](/materiale/scuola-superiore/chimica/misure-e-grandezze/temperatura-e-calore),

$$Q = c\,m\,\Delta t$$

Il chimico spiega questo valore con i legami a idrogeno. In quasi tutte le sostanze il calore ricevuto fa muovere più in fretta le particelle, e la temperatura sale. Nell'acqua una parte del calore se ne va per rompere o allentare i legami a idrogeno tra le molecole, e non fa salire la temperatura: per lo stesso aumento di temperatura serve più calore.

```ad-example
Esempio 2: acqua e ferro
Si danno $20{,}9\,\text{kJ}$ di calore a $500\,\text{g}$ d'acqua e a $500\,\text{g}$ di ferro, tutti e due a $20\,^\circ\text{C}$. Di quanto si scalda ciascuno?

Da $Q = c\,m\,\Delta t$ si ricava $\Delta t = Q/(c\,m)$, con il calore in joule, $20{,}9\,\text{kJ} = 20\,900\,\text{J}$:

$$\Delta t_{acqua} = \frac{20\,900\,\text{J}}{4{,}186\,\text{J/(g}\cdot{}^\circ\text{C)} \cdot 500\,\text{g}} = 9{,}99\,^\circ\text{C} \approx 10{,}0\,^\circ\text{C}$$

$$\Delta t_{ferro} = \frac{20\,900\,\text{J}}{0{,}449\,\text{J/(g}\cdot{}^\circ\text{C)} \cdot 500\,\text{g}} = 93{,}1\,^\circ\text{C}$$

L'acqua arriva a $30\,^\circ\text{C}$, il ferro a $113\,^\circ\text{C}$. Con lo stesso calore e la stessa massa, gli aumenti di temperatura stanno nel rapporto inverso dei calori specifici: il ferro si scalda $4{,}186/0{,}449 = 9{,}3$ volte più dell'acqua.
```

Le conseguenze si vedono ovunque. D'estate il sole scalda la sabbia e il mare con la stessa energia, ma la sabbia scotta e il mare resta fresco; di notte la sabbia si raffredda in fretta, il mare restituisce lentamente il calore accumulato. Per questo le città sul mare hanno estati meno calde e inverni meno freddi di quelle nell'entroterra. Il corpo umano, fatto in buona parte d'acqua, cambia temperatura lentamente, e nei termosifoni scorre acqua perché trasporta molto calore. La lezione di fisica [Calore, capacità termica e calore specifico](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico) tratta il calore specifico per tutte le sostanze.

```ad-note
Anche l'evaporazione costa molto
Per far evaporare un grammo d'acqua a $100\,^\circ\text{C}$ servono $2260\,\text{J}$, più di cinque volte il calore che serve per scaldarlo da $0$ a $100\,^\circ\text{C}$ ($418{,}6\,\text{J}$): per passare allo stato di vapore ogni molecola deve rompere tutti i suoi legami a idrogeno. Il sudore rinfresca per questo: evaporando sulla pelle si porta via molto calore.
```

## La tensione superficiale

Una molecola d'acqua in mezzo al liquido è attirata dalle molecole vicine in tutte le direzioni, e le attrazioni si compensano. Una molecola della superficie ha vicine solo di lato e sotto: è attirata verso l'interno, e nessuno la tira verso l'esterno. Tutte le molecole della superficie sono tirate verso il basso, e la superficie si comporta come una pellicola tesa, che resiste a essere allargata o bucata. Questa proprietà si chiama **tensione superficiale**.

```tikz
% nome: acqua-tensione-superficiale
% alt: Un recipiente d'acqua in sezione con due molecole disegnate come cerchi. Quella in mezzo al liquido è circondata da frecce uguali in tutte le direzioni, verso le molecole vicine: le attrazioni si compensano. Quella sulla superficie ha frecce solo di lato e verso il basso, e una freccia arancione più grande, verso il basso, mostra che è tirata verso l'interno del liquido
% svg: acqua-tensione-superficiale-8f391002.svg 290x139
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (6,3);
\draw[thin] (0,3) -- (6,3);
\draw[thick] (0,3.5) -- (0,0) -- (6,0) -- (6,3.5);
\draw[thick, fill=red!20] (1.8,1.3) circle (0.22);
\foreach \a in {0,45,...,315} \draw[-{Stealth}, thick] (1.8,1.3) ++(\a:0.27) -- ++(\a:0.45);
\draw[thick, fill=red!20] (4.3,2.78) circle (0.22);
\foreach \a in {0,180,225,270,315} \draw[-{Stealth}, thick] (4.3,2.78) ++(\a:0.27) -- ++(\a:0.45);
\draw[-{Stealth}, very thick, orange!90!black] (5.25,2.6) -- (5.25,1.6);
\node[right] at (5.3,2.1) {\small verso l'interno};
\node[below] at (1.8,0.55) {\small nel liquido};
\node[above] at (4.3,3.05) {\small in superficie};
\end{tikzpicture}
```

Per la tensione superficiale un insetto leggero come il gerride cammina sull'acqua, una graffetta d'acciaio appoggiata con delicatezza resta a galla anche se l'acciaio è molto più denso dell'acqua, e una goccia che cade prende la forma di una sfera, la forma che a parità di volume ha la superficie più piccola. L'acqua ha una tensione superficiale alta, più di tre volte quella dell'alcol, perché i legami a idrogeno legano forte le molecole della superficie a quelle sotto.

```ad-tip
La graffetta e il sapone
Appoggia una graffetta su un pezzetto di carta assorbente posato sull'acqua: la carta si inzuppa e affonda, la graffetta resta a galla. Poi tocca l'acqua con una goccia di detersivo: la graffetta affonda subito. Il sapone si mette tra le molecole della superficie e abbassa la tensione superficiale, ed è per questo che l'acqua saponata bagna meglio e forma le bolle.
```

## La capillarità

Un tubicino di vetro sottile, un **capillare**, messo in verticale in una bacinella d'acqua, si riempie per un tratto sopra il livello dell'acqua: l'acqua sale da sola, contro il suo peso. La superficie dell'acqua nel tubo, il **menisco**, è concava, curva verso il basso al centro. Il fenomeno si chiama **capillarità**, e dipende da due attrazioni: la **coesione**, tra le molecole d'acqua, e l'**adesione**, tra le molecole d'acqua e il vetro. Il vetro ha sulla superficie atomi di ossigeno a cui l'acqua si lega con legami a idrogeno: l'adesione è più forte della coesione, l'acqua sale lungo le pareti e si tira dietro, per coesione, il resto della colonna. Si ferma quando il peso della colonna equilibra la forza che la tira su.

```tikz
% nome: acqua-capillarita-tubi
% alt: A sinistra una bacinella d'acqua con tre tubicini di vetro verticali di diametro diverso: nel più largo l'acqua sale di poco sopra il livello della bacinella, nel medio di più, nel più sottile molto di più; in tutti e tre la superficie dell'acqua nel tubo è curva verso il basso, concava. A destra una bacinella di mercurio con un tubicino: il mercurio nel tubo resta più in basso del livello della bacinella, con la superficie curva verso l'alto, convessa
% svg: acqua-capillarita-tubi-c843f175.svg 292x154
\begin{tikzpicture}
% acqua
\fill[cyan!20] (0,0) rectangle (4.4,1.2);
\draw[thin] (0,1.2) -- (0.8,1.2); \draw[thin] (1.4,1.2) -- (2.0,1.2); \draw[thin] (2.4,1.2) -- (3.0,1.2); \draw[thin] (3.2,1.2) -- (4.4,1.2);
\draw[thick] (0,1.7) -- (0,0) -- (4.4,0) -- (4.4,1.7);
\foreach \x/\r/\h in {1.1/0.3/1.6, 2.2/0.2/1.8, 3.1/0.1/2.4} {
\fill[cyan!20] (\x-\r,1.2) -- (\x-\r,\h+0.08) arc (180:360:\r cm and 0.08cm) -- (\x+\r,1.2) -- cycle;
\draw[thin] (\x-\r,\h+0.08) arc (180:360:\r cm and 0.08cm);
\draw[thick] (\x-\r,0.4) -- (\x-\r,3.4); \draw[thick] (\x+\r,0.4) -- (\x+\r,3.4);
}
\node at (2.2,-0.35) {\small acqua};
% mercurio
\begin{scope}[shift={(5.4,0)}]
\fill[gray!60] (0,0) rectangle (0.8,1.2);
\fill[gray!60] (1.4,0) rectangle (2.2,1.2);
\fill[gray!60] (0.8,0) -- (0.8,0.72) arc (180:0:0.3cm and 0.1cm) -- (1.4,0) -- cycle;
\draw[thin] (0,1.2) -- (0.8,1.2); \draw[thin] (1.4,1.2) -- (2.2,1.2);
\draw[thin] (0.8,0.72) arc (180:0:0.3cm and 0.1cm);
\draw[thick] (0,1.7) -- (0,0) -- (2.2,0) -- (2.2,1.7);
\draw[thick] (0.8,0.4) -- (0.8,2.4); \draw[thick] (1.4,0.4) -- (1.4,2.4);
\node at (1.1,-0.35) {\small mercurio};
\end{scope}
\end{tikzpicture}
```

Più il tubo è sottile, più in alto sale l'acqua: l'altezza è inversamente proporzionale al raggio del tubo. In un tubo di vetro con il raggio di mezzo millimetro l'acqua sale di circa $3\,\text{cm}$; in uno con il raggio cinque volte più piccolo sale cinque volte di più, circa $15\,\text{cm}$. Con il mercurio succede il contrario: la coesione tra i suoi atomi è molto più forte dell'adesione al vetro, il menisco è convesso e nel tubo il mercurio scende sotto il livello della bacinella.

La capillarità fa salire l'acqua nei pori di un tovagliolo di carta, di una spugna, di una zolletta di zucchero e del terreno, e aiuta, insieme ad altri meccanismi, l'acqua a salire dalle radici lungo i sottili vasi delle piante. È anche il motivo per cui il livello dell'acqua in un cilindro graduato si legge in basso al menisco.

```ad-warning
Capillarità e tensione superficiale non sono la stessa cosa
La tensione superficiale dipende solo dalla coesione tra le molecole d'acqua. La capillarità dipende dal confronto tra la coesione e l'adesione al materiale del tubo: l'acqua sale nel vetro, che la attira, ma non in un tubicino di plastica cerata, a cui aderisce poco, e il mercurio nel vetro scende.
```

## Le proprietà e la loro causa

| Proprietà | Che cosa si osserva | Da dove viene |
|---|---|---|
| Temperature di fusione e di ebollizione alte | L'acqua è liquida a temperatura ambiente | Per separare le molecole bisogna rompere i legami a idrogeno |
| Ghiaccio meno denso dell'acqua | Il ghiaccio galleggia, l'acqua che gela si espande del $9\%$ | La rete aperta del ghiaccio, con quattro legami a idrogeno per molecola |
| Densità massima a $4\,^\circ\text{C}$ | I laghi gelano dall'alto | I gruppi di molecole legate come nel ghiaccio si rompono tra $0$ e $4\,^\circ\text{C}$ |
| Calore specifico alto | Il mare cambia temperatura lentamente | Parte del calore rompe legami a idrogeno invece di scaldare |
| Tensione superficiale alta | Gli insetti camminano sull'acqua, le gocce sono sferiche | Le molecole della superficie sono tirate verso l'interno |
| Capillarità | L'acqua sale nei tubi sottili e nella carta | L'adesione al vetro è più forte della coesione |
