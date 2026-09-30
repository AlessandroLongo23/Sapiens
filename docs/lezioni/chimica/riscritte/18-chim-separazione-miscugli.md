# Metodi di separazione dei miscugli

L'acqua del rubinetto passa da un filtro prima di arrivare nella brocca, il sale marino si ottiene lasciando evaporare l'acqua di mare nelle saline, il sangue di un'analisi viene fatto girare in una centrifuga prima di essere esaminato. Sono tutti modi di separare i componenti di un [miscuglio](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/sostanze-pure-miscugli-omogenei-ed-eterogenei): ognuno sfrutta una proprietà in cui i componenti sono diversi, e nessuno cambia la natura dei componenti. Alla fine si ritrovano le stesse sostanze che c'erano all'inizio, soltanto separate.

## Una proprietà diversa per ogni metodo

I componenti di un miscuglio non sono legati chimicamente: ognuno conserva le sue proprietà, e per separarli basta una trasformazione fisica, che non produce sostanze nuove. Il metodo si sceglie guardando due cose: che tipo di miscuglio è (eterogeneo o omogeneo, e in quali stati sono i componenti) e in quale proprietà i componenti sono diversi.

| Metodo | Miscuglio | Proprietà sfruttata |
|---|---|---|
| filtrazione | solido non disciolto in un liquido | dimensioni delle particelle |
| decantazione | solido pesante in un liquido, due liquidi che non si mescolano | densità |
| centrifugazione | solido finissimo o sospeso in un liquido | densità |
| evaporazione e cristallizzazione | solido disciolto in un liquido | il liquido evapora, il solido no |
| distillazione | liquidi mescolati, o un solido disciolto in un liquido da recuperare | temperatura di ebollizione |
| estrazione con solvente | una sostanza sciolta in un miscuglio | solubilità in un altro solvente |
| cromatografia | sostanze disciolte, anche in piccolissima quantità | quanto ciascuna è trattenuta da un materiale fisso |
| separazione magnetica | un solido attirato dalla calamita e uno no | proprietà magnetiche |

I primi tre metodi separano i miscugli eterogenei, in cui i componenti si distinguono a occhio o al microscopio. Gli altri servono per i miscugli omogenei, come le [soluzioni](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/le-soluzioni-e-la-concentrazione-percentuale), dove i componenti sono mescolati fino alle singole particelle e nessun filtro li può fermare.

## Filtrazione

La **filtrazione** separa un solido non disciolto da un liquido facendo passare il miscuglio attraverso un filtro, un materiale pieno di pori minuscoli: in laboratorio un foglio di carta da filtro piegato a cono dentro un imbuto. Le particelle d'acqua e quelle delle sostanze disciolte passano attraverso i pori, i granelli di solido, più grandi, restano sulla carta. Il solido fermato dal filtro si chiama **residuo**, il liquido che passa si chiama **filtrato**.

```tikz
% nome: separazione-filtrazione
% alt: Un imbuto di vetro con dentro un cono di carta da filtro, sostenuto sopra un becker. Nel cono c'è acqua torbida con granelli di sabbia, sul fondo del cono la sabbia che resta; dal gambo dell'imbuto cadono gocce di liquido limpido, che si raccoglie nel becker. Le etichette indicano la carta da filtro, il residuo e il filtrato
% svg: separazione-filtrazione-f601fd2d.svg 201x164
\begin{tikzpicture}
\fill[brown!25] (1.25,2.35) -- (2.15,2.35) -- (2.02,2.12) -- (1.38,2.12) -- cycle;
\fill[cyan!20] (0.78,3.15) -- (2.62,3.15) -- (2.02,2.12) -- (1.38,2.12) -- cycle;
\fill[brown!40] (1.38,2.12) -- (2.02,2.12) -- (1.7,1.6) -- cycle;
\draw[thin] (0.78,3.15) -- (2.62,3.15);
\foreach \p in {(1.1,2.9),(1.5,2.75),(2.1,2.95),(1.8,2.55),(2.3,2.8),(1.3,2.5)} \fill[brown!60!black] \p circle (0.03);
\draw[thick, gray!70!black] (0.45,3.55) -- (1.7,1.55) -- (2.95,3.55);
\draw[thick] (0.3,3.6) -- (1.62,1.45) -- (1.62,0.6);
\draw[thick] (3.1,3.6) -- (1.78,1.45) -- (1.78,0.6);
\fill[cyan!20] (1.7,0.45) circle (0.04);
\fill[cyan!20] (0.62,-0.6) rectangle (2.78,-0.05);
\draw[thin] (0.62,-0.05) -- (2.78,-0.05);
\draw[thick] (0.5,0.75) -- (0.6,0.65) -- (0.6,-0.62) -- (2.8,-0.62) -- (2.8,0.65) -- (2.9,0.75);
\draw[thin] (3.25,3.3) -- (2.8,3.3);
\node[right] at (3.3,3.3) {\small carta da filtro};
\draw[thin] (3.25,2.0) -- (1.95,2.0);
\node[right] at (3.3,2.0) {\small residuo};
\draw[thin] (3.25,-0.35) -- (2.6,-0.35);
\node[right] at (3.3,-0.35) {\small filtrato};
\end{tikzpicture}
```

La filtrazione separa l'acqua dalla sabbia, il caffè macinato dalla bevanda nella moka o in un filtro americano, la polvere dall'aria nel filtro di un aspirapolvere. Più piccoli sono i pori, più piccole sono le particelle che il filtro ferma, e più lentamente passa il liquido.

```ad-warning
Il filtro non ferma quello che è disciolto
Se si filtra acqua salata, dal filtro esce acqua salata: il sale disciolto è diviso in particelle piccole come quelle dell'acqua, e passa attraverso qualsiasi carta da filtro. La filtrazione separa solo i solidi che non si sono sciolti, cioè i miscugli eterogenei.
```

## Decantazione e imbuto separatore

La **decantazione** sfrutta la densità. Se un solido più denso del liquido non si scioglie, come la sabbia o il fango nell'acqua, lasciando fermo il miscuglio il solido si deposita sul fondo, e il liquido limpido sopra si può versare piano in un altro recipiente, senza smuovere il deposito. È lenta, e non separa del tutto: un po' di liquido resta con il solido.

Con la stessa idea si separano due liquidi che non si mescolano, come l'olio e l'acqua: lasciati fermi, formano due strati, e il liquido più denso sta sotto. Per separarli si usa l'**imbuto separatore**, un'ampolla di vetro con un rubinetto sul fondo: si apre il rubinetto, si fa uscire lo strato inferiore e lo si chiude quando la superficie di separazione arriva al rubinetto. Lo strato superiore si fa uscire poi dall'alto.

```tikz
% nome: separazione-imbuto-separatore
% alt: Un imbuto separatore, un'ampolla a forma di pera con un tappo in alto e un rubinetto in fondo, contiene due strati di liquido: sopra l'olio, giallo chiaro, sotto l'acqua, azzurra. Il rubinetto è aperto e l'acqua scende in un becker sotto
% svg: separazione-imbuto-separatore-6772d77b.svg 155x202
\begin{tikzpicture}
\fill[yellow!20] (0.705,2.250) -- (0.665,2.179) -- (0.632,2.110) -- (0.605,2.037) -- (0.582,1.963) -- (0.565,1.887) -- (0.554,1.810) -- (0.547,1.730) -- (0.546,1.650) -- (0.550,1.568) -- (0.560,1.486) -- (0.575,1.403) -- (0.595,1.319) -- (0.621,1.236) -- (0.633,1.200) -- (2.167,1.200) -- (2.179,1.236) -- (2.205,1.319) -- (2.225,1.403) -- (2.240,1.486) -- (2.250,1.568) -- (2.254,1.650) -- (2.253,1.730) -- (2.246,1.810) -- (2.235,1.887) -- (2.218,1.963) -- (2.195,2.037) -- (2.168,2.110) -- (2.135,2.179) -- (2.095,2.250) -- cycle;
\fill[cyan!20] (0.633,1.200) -- (0.669,1.110) -- (0.708,1.026) -- (0.753,0.942) -- (0.803,0.860) -- (0.858,0.777) -- (0.919,0.696) -- (0.985,0.616) -- (1.057,0.538) -- (1.134,0.461) -- (1.217,0.385) -- (1.320,0.300) -- (1.320,-0.55) -- (1.480,-0.55) -- (1.480,0.300) -- (1.583,0.385) -- (1.666,0.461) -- (1.743,0.538) -- (1.815,0.616) -- (1.881,0.696) -- (1.942,0.777) -- (1.997,0.860) -- (2.047,0.942) -- (2.092,1.026) -- (2.131,1.110) -- (2.167,1.200) -- cycle;
\draw[thin] (0.633,1.2) -- (2.167,1.2);
\draw[thin] (0.705,2.25) -- (2.095,2.25);
\draw[thick] (1.25,3.0) -- (1.25,2.7) .. controls (0.3,2.3) and (0.3,1.1) .. (1.32,0.3) -- (1.32,-0.55);
\draw[thick] (1.55,3.0) -- (1.55,2.7) .. controls (2.5,2.3) and (2.5,1.1) .. (1.48,0.3) -- (1.48,-0.55);
\draw[thick, fill=gray!40] (1.18,3.0) rectangle (1.62,3.3);
\draw[thick, fill=gray!20] (1.1,-0.05) rectangle (1.7,0.1);
\draw[thick] (1.7,0.025) -- (1.95,0.025);
\fill[cyan!20] (1.4,-0.72) circle (0.04);
\fill[cyan!20] (0.52,-1.9) rectangle (2.28,-1.35);
\draw[thin] (0.52,-1.35) -- (2.28,-1.35);
\draw[thick] (0.4,-0.85) -- (0.5,-0.95) -- (0.5,-1.92) -- (2.3,-1.92) -- (2.3,-0.95) -- (2.4,-0.85);
\draw[thin] (2.7,1.75) -- (2.05,1.75);
\node[right] at (2.75,1.75) {\small olio};
\draw[thin] (2.7,0.95) -- (1.85,0.95);
\node[right] at (2.75,0.95) {\small acqua};
\draw[thin] (2.7,0.03) -- (2.0,0.03);
\node[right] at (2.75,0.03) {\small rubinetto};
\end{tikzpicture}
```

## Centrifugazione

Quando le particelle solide sono piccolissime, o hanno una densità vicina a quella del liquido, la decantazione richiederebbe ore o giorni. La **centrifugazione** la accelera: le provette con il miscuglio vengono fatte ruotare velocissime dentro una centrifuga, e le particelle più dense vengono spinte verso il fondo delle provette molto più in fretta di quanto farebbe il loro peso. Alla fine il solido è compattato sul fondo e il liquido limpido sopra si separa per decantazione.

```tikz
% nome: separazione-centrifugazione
% alt: A sinistra una provetta con un liquido torbido, pieno di puntini sparsi; una freccia con la scritta centrifugazione porta alla stessa provetta a destra, dove il liquido sopra è limpido e i puntini sono tutti ammassati sul fondo
% svg: separazione-centrifugazione-892bc2ba.svg 253x112
\begin{tikzpicture}
\fill[orange!15] (0,0.25) -- (0,2.3) -- (0.6,2.3) -- (0.6,0.25) arc[start angle=0, end angle=-180, radius=0.3] -- cycle;
\foreach \p in {(0.15,2.0),(0.42,1.8),(0.25,1.5),(0.48,1.25),(0.12,1.05),(0.35,0.85),(0.2,0.55),(0.45,0.45),(0.3,0.2),(0.2,1.75),(0.4,0.65),(0.15,1.3)} \fill[brown!70!black] \p circle (0.035);
\draw[thin] (0,2.3) -- (0.6,2.3);
\draw[thick] (0,2.8) -- (0,0.25) arc[start angle=180, end angle=360, radius=0.3] -- (0.6,2.8);
\draw[-{Stealth}, thick] (1.0,1.4) -- (2.6,1.4) node[midway, above] {\small centrifugazione};
\fill[cyan!15] (3,0.4) -- (3,2.3) -- (3.6,2.3) -- (3.6,0.4) -- cycle;
\fill[brown!45] (3,0.4) -- (3,0.25) arc[start angle=180, end angle=360, radius=0.3] -- (3.6,0.4) -- cycle;
\draw[thin] (3,2.3) -- (3.6,2.3);
\draw[thin] (3,0.4) -- (3.6,0.4);
\draw[thick] (3,2.8) -- (3,0.25) arc[start angle=180, end angle=360, radius=0.3] -- (3.6,2.8);
\draw[thin] (3.75,1.4) -- (3.65,1.4);
\node[right] at (3.8,1.4) {\small liquido limpido};
\draw[thin] (3.75,0.2) -- (3.5,0.2);
\node[right] at (3.8,0.2) {\small solido compattato};
\end{tikzpicture}
```

La centrifugazione separa le cellule del sangue dal plasma, la parte liquida, e la panna dal latte. La centrifuga di una lavatrice lavora allo stesso modo: il cestello che gira spinge l'acqua fuori dai fori, mentre i panni restano dentro.

## Evaporazione e cristallizzazione

Un solido disciolto in un liquido forma un miscuglio omogeneo, e i metodi precedenti non lo separano. Se interessa recuperare il solido, si fa evaporare il liquido: l'**evaporazione** si fa scaldando la soluzione in una capsula di porcellana, larga e bassa, finché resta solo il solido. Nelle saline succede lo stesso con il calore del sole: l'acqua di mare evapora e sul fondo delle vasche resta il sale.

```tikz
% nome: separazione-evaporazione-capsula
% alt: Una capsula di porcellana bassa e larga, appoggiata su una reticella sopra un treppiede, scaldata da una fiamma. Nella capsula c'è poca soluzione, con dei cristalli bianchi sul fondo e sui bordi; sopra, delle linee ondulate indicano il vapore che sale
% svg: separazione-evaporazione-capsula-6af0beba.svg 216x125
\begin{tikzpicture}
\fill[cyan!20] (0.748,1.847) -- (0.822,1.820) -- (0.899,1.795) -- (0.978,1.774) -- (1.059,1.756) -- (1.142,1.741) -- (1.226,1.729) -- (1.311,1.720) -- (1.397,1.715) -- (1.483,1.713) -- (1.569,1.714) -- (1.655,1.718) -- (1.740,1.725) -- (1.825,1.736) -- (1.908,1.749) -- (1.990,1.766) -- (2.070,1.786) -- (2.148,1.809) -- (2.223,1.836) -- (2.252,1.847) -- cycle;
\draw[thin] (0.748,1.847) -- (2.252,1.847);
\foreach \x in {1.05,1.3,1.6,1.85} \draw[thin, fill=gray!15] (\x,1.745) rectangle ++(0.09,0.09);
\foreach \p in {(0.62,1.93),(2.29,1.93),(0.5,2.05),(2.41,2.05)} \draw[thin, fill=gray!15] \p rectangle ++(0.09,0.09);
\draw[thick] (0.2,2.35) .. controls (0.5,1.5) and (2.5,1.5) .. (2.8,2.35);
\draw[thick] (-0.3,1.7) -- (3.3,1.7);
\draw[thick] (0,1.7) -- (-0.3,-0.3);
\draw[thick] (3,1.7) -- (3.3,-0.3);
\draw[thick, fill=gray!20] (1.35,-0.3) rectangle (1.65,0.3);
\draw[thick, orange!90!black, fill=orange!25] (1.5,0.3) .. controls (1.28,0.65) and (1.42,1.05) .. (1.5,1.35) .. controls (1.58,1.05) and (1.72,0.65) .. (1.5,0.3);
\draw[thin, gray] (1.1,2.4) .. controls (1.0,2.6) and (1.2,2.7) .. (1.1,2.9);
\draw[thin, gray] (1.5,2.4) .. controls (1.4,2.6) and (1.6,2.7) .. (1.5,2.9);
\draw[thin, gray] (1.9,2.4) .. controls (1.8,2.6) and (2.0,2.7) .. (1.9,2.9);
\draw[thick] (-0.6,-0.3) -- (3.6,-0.3);
\draw[thin] (3.4,2.1) -- (2.55,2.0);
\node[right] at (3.45,2.1) {\small capsula};
\draw[thin] (3.4,1.2) -- (3.08,1.2);
\node[right] at (3.45,1.2) {\small treppiede};
\end{tikzpicture}
```

La **cristallizzazione** usa la stessa idea con più pazienza. Si scioglie il solido in un liquido caldo fino a ottenere una soluzione satura, che non ne scioglie altro, e la si lascia raffreddare lentamente, o evaporare piano, in un recipiente basso chiamato cristallizzatore. Il solido si separa formando cristalli regolari, e le impurezze, che sono poche, restano sciolte nel liquido. Per questo la cristallizzazione non serve solo a recuperare un solido, ma anche a purificarlo: è il metodo con cui si raffina lo zucchero.

```ad-note
L'acqua non si recupera
Con l'evaporazione e la cristallizzazione il liquido va perduto nell'aria. Se serve anche il liquido, per esempio per ottenere acqua dolce dall'acqua di mare, bisogna raccogliere il vapore e farlo tornare liquido: è la distillazione.
```

## Distillazione

La **distillazione** separa i componenti di un miscuglio omogeneo di liquidi sfruttando la loro temperatura di ebollizione, la temperatura a cui ogni liquido bolle, diversa da una sostanza all'altra (se ne parla nella lezione sui [passaggi di stato](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/i-passaggi-di-stato)). Il miscuglio si scalda in un pallone; il liquido con la temperatura di ebollizione più bassa, il più volatile, bolle per primo, e il suo vapore sale, passa in un tubo raffreddato dall'acqua che si chiama **refrigerante**, condensa e cade goccia a goccia in un recipiente di raccolta. Il liquido raccolto si chiama **distillato**.

```tikz
% nome: separazione-distillazione-apparato
% alt: L'apparato della distillazione. A sinistra un pallone di vetro con il miscuglio, scaldato da una fiamma; sopra il pallone un termometro con il bulbo all'altezza del tubo laterale. Dal tubo laterale parte in discesa il refrigerante, un tubo circondato da una camicia piena d'acqua fredda, che entra dal basso ed esce dall'alto. In fondo al refrigerante il distillato cade in una beuta di raccolta
% svg: separazione-distillazione-apparato-229a9c5e.svg 317x195
\begin{tikzpicture}
\fill[cyan!20] (1.743,1.0) arc[start angle=7.66, end angle=-187.66, radius=0.75] -- cycle;
\draw[thin] (0.257,1.0) -- (1.743,1.0);
\foreach \p in {(0.8,0.45),(1.2,0.6),(1.0,0.3)} \draw[thin] \p circle (0.05);
\draw[thick] (0.85,3.3) -- (0.85,1.635) arc[start angle=101.5, end angle=438.5, radius=0.75] -- (1.15,2.66);
\draw[thick] (1.15,2.84) -- (1.15,3.3);
\draw[thick, fill=gray!40] (0.78,3.3) rectangle (1.22,3.5);
\draw[thick] (0.95,2.85) rectangle (1.05,4.3);
\fill[red!40] (0.97,2.85) rectangle (1.03,3.3);
\draw[thick, fill=red!40] (1.0,2.78) circle (0.08);
\begin{scope}[shift={(1.15,2.75)}, rotate=-20]
\fill[cyan!10] (0.6,0.09) rectangle (3.5,0.3);
\fill[cyan!10] (0.6,-0.09) rectangle (3.5,-0.3);
\draw[thick] (0,0.09) -- (4.35,0.09);
\draw[thick] (0,-0.09) -- (4.1,-0.09);
\draw[thick] (0.6,0.09) -- (0.6,0.3) -- (3.5,0.3) -- (3.5,0.09);
\draw[thick] (0.6,-0.09) -- (0.6,-0.3) -- (3.5,-0.3) -- (3.5,-0.09);
\draw[thick] (0.85,0.3) -- (0.85,0.65);
\draw[thick] (1.05,0.3) -- (1.05,0.65);
\draw[thick] (3.05,-0.3) -- (3.05,-0.65);
\draw[thick] (3.25,-0.3) -- (3.25,-0.65);
\draw[-{Stealth}, thin] (3.15,-1.05) -- (3.15,-0.7);
\draw[-{Stealth}, thin] (0.95,0.7) -- (0.95,1.05);
\end{scope}
\draw[thick] (5.269,1.347) -- (5.269,0.85);
\draw[thick] (4.972,1.263) -- (4.972,0.85);
\fill[cyan!20] (5.12,0.7) circle (0.04);
\fill[cyan!20] (4.46,-0.63) -- (5.74,-0.63) -- (5.6,-0.3) -- (4.6,-0.3) -- cycle;
\draw[thin] (4.6,-0.3) -- (5.6,-0.3);
\draw[thick] (4.88,1.0) -- (4.88,0.5) -- (4.45,-0.65) -- (5.75,-0.65) -- (5.32,0.5) -- (5.32,1.0);
\draw[thick, fill=gray!20] (0.9,-0.65) rectangle (1.1,-0.25);
\draw[thick, orange!90!black, fill=orange!25] (1.0,-0.25) .. controls (0.85,-0.02) and (0.93,0.05) .. (1.0,0.12) .. controls (1.07,0.05) and (1.15,-0.02) .. (1.0,-0.25);
\draw[thick] (-0.3,-0.65) -- (6.2,-0.65);
\node[left] at (0.25,1.3) {\small pallone};
\node[right] at (1.1,4.2) {\small termometro};
\node[above] at (3.3,2.65) {\small refrigerante};
\node[below] at (4.35,0.95) {\small acqua};
\node[left] at (2.45,3.55) {\small acqua};
\node[right] at (5.8,0.2) {\small distillato};
\end{tikzpicture}
```

Il refrigerante funziona perché l'acqua fredda che scorre nella camicia intorno al tubo interno raffredda il vapore, che condensa. L'acqua entra dal basso ed esce dall'alto, in modo che la camicia resti sempre piena.

### La temperatura in testa alla colonna

Il termometro della distillazione non sta nel liquido: il suo bulbo è in alto, all'altezza del tubo laterale, e misura la temperatura del vapore che sta per entrare nel refrigerante. Finché distilla il componente più volatile, il vapore che arriva al termometro è quasi tutto di quel componente, e il termometro segna la sua temperatura di ebollizione. Quando quel componente è finito, la temperatura sale fino alla temperatura di ebollizione del componente successivo. Guardando il termometro si sa quindi che cosa sta distillando, e si cambia il recipiente di raccolta quando la temperatura comincia a salire.

```ad-example
Esempio 1: acetone e acqua
Si distilla un miscuglio di acetone, che bolle a $56\,^\circ\text{C}$, e acqua, che bolle a $100\,^\circ\text{C}$. Che cosa segna il termometro durante la distillazione, e che cosa si raccoglie?

All'inizio il miscuglio si scalda e il termometro, circondato solo dall'aria, segna la temperatura dell'ambiente. Quando il vapore arriva al bulbo, la temperatura sale in fretta fino a circa $56\,^\circ\text{C}$, e resta vicina a quel valore mentre distilla l'acetone: il distillato è acetone. Quando l'acetone è quasi finito, la temperatura sale fino a $100\,^\circ\text{C}$ e comincia a distillare l'acqua. Per avere l'acetone separato si cambia la beuta di raccolta appena la temperatura supera i $56\,^\circ\text{C}$.
```

Nella figura qui sotto scegli il miscuglio e scaldi il pallone: il termometro in testa alla colonna segna la temperatura del vapore, e il grafico accanto mostra come cambia nel tempo mentre i due liquidi distillano uno dopo l'altro.

```interattivo
% nome: distillazione-temperatura-colonna
% alt: L'apparato della distillazione con un grafico accanto. Si sceglie il miscuglio da distillare, acetone e acqua oppure etanolo e acqua, e un bottone accende la fiamma: il liquido nel pallone cala, il distillato si raccoglie in due beute, una per ciascun componente, e il termometro in testa alla colonna segna la temperatura del vapore. Il grafico della temperatura nel tempo mostra un primo tratto quasi orizzontale alla temperatura di ebollizione del liquido più volatile, una salita e un secondo tratto a 100 gradi. Sotto si leggono la temperatura e i volumi raccolti
```

Quando le temperature di ebollizione dei due liquidi sono vicine, meno di qualche decina di gradi, il vapore che sale contiene molto di tutti e due, e una distillazione sola non basta a separarli. Si usa allora la **distillazione frazionata**: tra il pallone e il termometro si mette una colonna alta, riempita di palline o di anelli di vetro, su cui il vapore condensa ed evapora molte volte, arricchendosi a ogni passo del componente più volatile. In grande, le raffinerie separano così il petrolio nelle sue frazioni: gas, benzine, cherosene, gasolio.

```ad-warning
Il termometro va in alto, non nel liquido
Un termometro immerso nel pallone misura la temperatura del miscuglio che bolle, che sale a mano a mano che il componente più volatile se ne va, e non dice quale sostanza sta arrivando nel refrigerante. Il bulbo va all'altezza del tubo laterale, dove passa il vapore che diventerà distillato.
```

## Estrazione con solvente

L'**estrazione** porta una sostanza da un miscuglio a un solvente in cui si scioglie meglio. Quando si prepara il tè o il caffè, l'acqua calda estrae dalle foglie o dalla polvere le sostanze che danno il colore, il sapore e la caffeina, e il resto rimane nel filtro. In laboratorio si fa spesso con due liquidi che non si mescolano: per esempio lo iodio, poco solubile in acqua, si scioglie molto meglio nel cicloesano, un liquido che con l'acqua forma due strati. Si versa la soluzione acquosa di iodio in un imbuto separatore, si aggiunge il cicloesano, si agita e si lascia riposare: lo iodio passa quasi tutto nello strato di cicloesano, che si colora di viola, e i due strati si separano con il rubinetto come si è visto per l'olio e l'acqua.

## Cromatografia

La **cromatografia** separa sostanze disciolte, anche in quantità piccolissime, come i coloranti di un inchiostro. Nella cromatografia su carta si mette una goccia del miscuglio su una striscia di carta, poco sopra il bordo, e si immerge il bordo in un solvente, per esempio acqua o alcol, che non deve toccare la macchia. Il solvente sale lungo la carta, come l'acqua sale in un tovagliolo, e trascina con sé le sostanze della macchia. Ogni sostanza è trattenuta dalla carta in modo diverso: quella trattenuta di meno corre quasi insieme al solvente, quella trattenuta di più resta indietro. Dopo qualche minuto le sostanze si trovano in macchie separate, a altezze diverse.

La carta, che resta ferma, si chiama **fase stazionaria**; il solvente, che si muove, si chiama **fase mobile** o eluente. La striscia con le macchie separate è il **cromatogramma**.

```tikz
% nome: separazione-cromatografia-carta
% alt: A sinistra una striscia di carta appesa in un becker, con il bordo inferiore immerso nel solvente e una macchia scura sulla linea di partenza, appena sopra il solvente. A destra la stessa striscia dopo qualche minuto: il solvente è salito fino a una linea in alto, il fronte del solvente, e la macchia si è divisa in tre macchie a altezze diverse. Due quote misurano la distanza percorsa dal solvente, 8,0 centimetri, e quella percorsa dalla macchia più bassa, 2,4 centimetri, entrambe dalla linea di partenza
% svg: separazione-cromatografia-carta-b3fe134a.svg 327x190
\begin{tikzpicture}
\fill[cyan!20] (0.07,0.07) rectangle (1.93,0.45);
\draw[thin] (0.07,0.45) -- (1.93,0.45);
\draw[thick] (0,4.3) -- (0,0) -- (2,0) -- (2,4.3);
\draw[thick] (-0.2,4.3) -- (2.2,4.3);
\draw[thick] (0.7,0.2) rectangle (1.3,4.3);
\fill[cyan!20] (0.7,0.2) rectangle (1.3,0.45);
\draw[thin, dashed] (0.7,0.8) -- (1.3,0.8);
\fill[black!70] (1,0.8) circle (0.09);
\node[below] at (1,-0.1) {\small prima};
\fill[cyan!20] (3.07,0.07) rectangle (4.93,0.45);
\draw[thin] (3.07,0.45) -- (4.93,0.45);
\draw[thick] (3,4.3) -- (3,0) -- (5,0) -- (5,4.3);
\draw[thick] (2.8,4.3) -- (5.2,4.3);
\fill[cyan!10] (3.7,0.2) rectangle (4.3,3.6);
\draw[thick] (3.7,0.2) rectangle (4.3,4.3);
\fill[cyan!20] (3.7,0.2) rectangle (4.3,0.45);
\draw[thin] (3.7,3.6) -- (4.3,3.6);
\draw[thin, dashed] (3.7,0.8) -- (4.3,0.8);
\fill[yellow!70!black] (4,2.9) ellipse (0.12 and 0.09);
\fill[red!60] (4,2.06) ellipse (0.12 and 0.09);
\fill[blue!60] (4,1.64) ellipse (0.12 and 0.09);
\node[below] at (4,-0.1) {\small dopo};
\draw[{Stealth}-{Stealth}, thin] (5.4,0.8) -- (5.4,3.6) node[midway, right] {\small $8{,}0$ cm};
\draw[thin] (4.35,3.6) -- (5.5,3.6);
\draw[thin] (4.35,0.8) -- (5.5,0.8);
\draw[{Stealth}-{Stealth}, thin] (3.45,0.8) -- (3.45,1.64);
\node[left] at (3.4,1.22) {\small $2{,}4$ cm};
\draw[thin] (3.35,1.64) -- (3.85,1.64);
\node[right] at (5.5,4.0) {\small fronte del solvente};
\draw[thin] (5.45,3.95) -- (4.35,3.62);
\node[right] at (5.5,0.35) {\small linea di partenza};
\draw[thin] (5.45,0.4) -- (4.35,0.78);
\end{tikzpicture}
```

Per riconoscere le sostanze si misura quanto è salita ciascuna rispetto al solvente, con il **fattore di ritenzione** $R_f$:

$$R_f = \frac{\text{distanza percorsa dalla sostanza}}{\text{distanza percorsa dal solvente}}$$

Tutte e due le distanze si misurano dalla linea di partenza: quella della sostanza fino al centro della sua macchia, quella del solvente fino al **fronte del solvente**, la linea più alta che ha raggiunto, che si segna a matita appena si toglie la striscia. $R_f$ è un numero puro compreso tra $0$ e $1$: una sostanza che non si muove ha $R_f = 0$, una che corre con il solvente ha $R_f$ vicino a $1$. Con la stessa carta e lo stesso solvente, una sostanza ha sempre lo stesso $R_f$, e si riconosce confrontandolo con quello di un campione noto.

```ad-example
Esempio 2: il fattore di ritenzione
Nel cromatogramma della figura il solvente ha percorso $8{,}0\,\text{cm}$ dalla linea di partenza. La macchia blu si trova a $2{,}4\,\text{cm}$ dalla linea di partenza, quella rossa a $3{,}6\,\text{cm}$, quella gialla a $6{,}0\,\text{cm}$. Quanto vale $R_f$ per ciascuna?

$$R_f(\text{blu}) = \frac{2{,}4\,\text{cm}}{8{,}0\,\text{cm}} = 0{,}30 \qquad R_f(\text{rosso}) = \frac{3{,}6\,\text{cm}}{8{,}0\,\text{cm}} = 0{,}45 \qquad R_f(\text{giallo}) = \frac{6{,}0\,\text{cm}}{8{,}0\,\text{cm}} = 0{,}75$$

Il colorante giallo è il meno trattenuto dalla carta, quello blu il più trattenuto. I centimetri si semplificano: $R_f$ non ha unità.
```

```ad-warning
Le distanze si misurano dalla linea di partenza
Un errore frequente è misurare dal bordo della carta, o dal livello del solvente nel becker. Tutte e due le distanze partono dalla linea su cui si è messa la goccia: la macchia è partita da lì, e il solvente conta da lì in poi. Un $R_f$ più grande di $1$ è sempre un errore: nessuna sostanza supera il solvente che la trascina.
```

Nella figura qui sotto metti una goccia di inchiostro sulla carta e immergi la striscia nel solvente: il fronte del solvente sale, sempre più piano, e i coloranti salgono con lui, ciascuno con il suo passo. Quando fermi la corsa puoi leggere le distanze e il fattore di ritenzione di ogni macchia.

```interattivo
% nome: cromatografia-carta-macchie
% alt: Una striscia di carta immersa in un becker con il solvente, e una goccia di inchiostro sulla linea di partenza. Si sceglie l'inchiostro, nero, verde o marrone, e un bottone fa partire la corsa: il solvente bagna la carta salendo sempre più piano, e l'inchiostro si divide in macchie colorate che salgono a velocità diverse, ciascuna a una frazione fissa della distanza percorsa dal solvente. Un secondo bottone ferma la corsa; sotto si leggono la distanza del fronte del solvente, quella di ogni macchia e il suo fattore di ritenzione
```

## Separazione magnetica

Se uno dei componenti è attirato da una calamita e gli altri no, basta passare una calamita sul miscuglio. Il ferro, il nichel e il cobalto sono attirati; lo zolfo, la sabbia, il sale, l'alluminio no. Così si separa la limatura di ferro dallo zolfo in polvere, e negli impianti di riciclo si separano le lattine d'acciaio da quelle d'alluminio.

## Separare un miscuglio in più passi

Un miscuglio con più di due componenti si separa con più metodi, uno dopo l'altro, e l'ordine conta: ogni passo deve lasciare un miscuglio che il passo successivo sa separare.

```ad-example
Esempio 3: sabbia, sale e acqua
Un miscuglio contiene sabbia, sale e acqua. Come si ottengono la sabbia e il sale separati?

1. Si filtra il miscuglio: la sabbia, che non si scioglie, resta sulla carta da filtro come residuo; il sale, disciolto, passa con l'acqua nel filtrato.
2. Si fa evaporare il filtrato in una capsula: l'acqua se ne va, e sul fondo resta il sale.

Se serve anche l'acqua, al passo 2 al posto dell'evaporazione si fa una distillazione: il distillato è acqua, e il sale resta nel pallone. Invertire i passi non funziona: facendo evaporare l'acqua per prima, si otterrebbe un miscuglio di sabbia e sale, che nessuno dei due metodi sa più separare senza aggiungere di nuovo acqua.
```

```ad-example
Esempio 4: ferro, sabbia e sale
Un miscuglio secco contiene limatura di ferro, sabbia e sale. In che ordine si separa?

1. Con una calamita si toglie il ferro.
2. Si aggiunge acqua e si mescola: il sale si scioglie, la sabbia no.
3. Si filtra: la sabbia resta sulla carta.
4. Si fa evaporare il filtrato: resta il sale.

Il ferro va tolto prima di aggiungere l'acqua, finché è asciutto e non si arrugginisce, ma la calamita funzionerebbe anche dopo: l'unico ordine obbligato è sciogliere prima di filtrare e filtrare prima di far evaporare.
```

```ad-warning
Separare non è trasformare
Tutti questi metodi sono trasformazioni fisiche: il sale che resta nella capsula è lo stesso sale che si era sciolto, l'acetone raccolto è lo stesso che c'era nel miscuglio. Per dividere un composto nei suoi elementi, come l'acqua in idrogeno e ossigeno, i metodi fisici non bastano: serve una trasformazione chimica.
```
