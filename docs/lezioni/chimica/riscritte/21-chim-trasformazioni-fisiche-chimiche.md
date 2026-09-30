# Trasformazioni fisiche e trasformazioni chimiche

Un cubetto di ghiaccio che fonde e un chiodo che arrugginisce cambiano tutti e due sotto i tuoi occhi, ma in modo molto diverso. L'acqua del ghiaccio fuso è ancora acqua, e in freezer torna ghiaccio; la ruggine invece non è più ferro: è una sostanza nuova, rossiccia e friabile, che non si attacca alla calamita. La chimica comincia da questa distinzione, tra le trasformazioni che cambiano l'aspetto di una sostanza e quelle che producono sostanze nuove.

## Le trasformazioni fisiche

Una **trasformazione fisica** cambia la forma, le dimensioni o lo stato di aggregazione di un materiale, ma non le sostanze di cui è fatto: alla fine ci sono le stesse sostanze dell'inizio. Sono trasformazioni fisiche:

- i [passaggi di stato](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/i-passaggi-di-stato): il ghiaccio che fonde, l'acqua che bolle, la naftalina che sublima;
- la preparazione di una [soluzione](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/le-soluzioni-e-la-concentrazione-percentuale): lo zucchero sciolto nel tè è ancora zucchero, e lasciando evaporare l'acqua lo si ritrova;
- i cambiamenti di forma: macinare il caffè, piegare un filo di rame, rompere un bicchiere;
- la [separazione di un miscuglio](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/metodi-di-separazione-dei-miscugli): filtrare, distillare, separare la limatura di ferro con una calamita.

In tutti questi casi le proprietà che identificano una sostanza, come la temperatura di fusione, la temperatura di ebollizione e la densità, restano quelle di prima. Il vapore che esce da una pentola, ricondensato su un coperchio freddo, è acqua con le stesse proprietà dell'acqua del rubinetto.

## Le trasformazioni chimiche

Una **trasformazione chimica**, o **reazione chimica**, è una trasformazione in cui alcune sostanze scompaiono e al loro posto se ne formano altre, con proprietà diverse. Le sostanze di partenza si chiamano **reagenti**, quelle che si formano **prodotti**. Una reazione si scrive a parole con una freccia, che si legge "danno" o "si trasformano in":

$$\text{reagenti} \longrightarrow \text{prodotti}$$

Per esempio il legno che brucia reagisce con l'ossigeno dell'aria, e si formano diossido di carbonio, vapore acqueo e cenere; il ferro di un chiodo, all'aria umida, reagisce con l'ossigeno e l'acqua e diventa ruggine:

$$\text{ferro} + \text{ossigeno} + \text{acqua} \longrightarrow \text{ruggine}$$

Il segno $+$ a sinistra separa i reagenti, a destra separa i prodotti. Sono trasformazioni chimiche le combustioni, la ruggine sul ferro, la cottura di un uovo o del pane, il latte che inacidisce, il vino che diventa aceto, la fotosintesi delle piante, la digestione.

```ad-example
Esempio 1: ferro e zolfo
Si mescolano limatura di ferro, grigia, e polvere di zolfo, gialla. Nel miscuglio si riconoscono ancora i granelli dei due colori, e una calamita avvicinata al miscuglio tira via il ferro e lascia lo zolfo: è un miscuglio, e mescolare è una trasformazione fisica.

Se invece il miscuglio si scalda in una provetta, a un certo punto diventa incandescente, e anche togliendolo dalla fiamma continua a brillare da solo. Alla fine resta un solido nero, compatto, in cui non si distinguono più né il grigio né il giallo, e che la calamita non attira. Si è formata una sostanza nuova, il solfuro di ferro:

$$\text{ferro} + \text{zolfo} \longrightarrow \text{solfuro di ferro}$$

Anche un'altra prova lo conferma: con l'acido cloridrico il ferro del miscuglio sviluppa un gas senza odore, l'idrogeno, mentre il solfuro di ferro sviluppa un gas che puzza di uova marce, l'acido solfidrico. Sostanze diverse reagiscono in modo diverso.
```

```tikz
% nome: trasformazioni-ferro-zolfo-calamita
% alt: A sinistra un vetrino con il miscuglio di ferro, granelli grigi, e zolfo, granelli gialli: una calamita a ferro di cavallo sopra il vetrino attira i granelli grigi. A destra un vetrino con il solido scuro ottenuto scaldando il miscuglio: la stessa calamita non attira niente
% svg: trasformazioni-ferro-zolfo-calamita-e5ca03ef.svg 277x132
\begin{tikzpicture}
% left: the mixture
\draw[thick] (0,0) .. controls (0.5,-0.25) and (2.5,-0.25) .. (3,0);
\foreach \x/\y in {0.45/0.05,0.8/0.1,1.2/0.04,1.55/0.12,1.95/0.06,2.35/0.1,2.6/0.04,0.65/0.2,1.4/0.22,2.1/0.2} \fill[yellow!70!orange] (\x,\y) circle (0.06);
\foreach \x/\y in {0.6/0.02,1.0/0.14,1.75/0.02,2.2/0.1} \fill[gray!70] (\x,\y) circle (0.05);
\foreach \x/\y in {1.07/1.04,1.18/1.02,1.12/0.95,1.82/1.04,1.93/1.03,1.87/0.95} \fill[gray!70] (\x,\y) circle (0.05);
\draw[thick, fill=red!15] (1.0,1.1) -- (1.0,2.1) arc (180:0:0.5) -- (2.0,1.1) -- (1.75,1.1) -- (1.75,2.1) arc (0:180:0.25) -- (1.25,1.1) -- cycle;
\draw[thick, fill=gray!20] (1.0,1.1) rectangle (1.25,1.35);
\draw[thick, fill=gray!20] (1.75,1.1) rectangle (2.0,1.35);
\node at (1.5,-0.55) {\small miscuglio};
% right: the compound
\begin{scope}[xshift=4.2cm]
\draw[thick] (0,0) .. controls (0.5,-0.25) and (2.5,-0.25) .. (3,0);
\fill[gray!80] (0.7,-0.05) .. controls (0.9,0.25) and (2.1,0.3) .. (2.3,-0.05) -- cycle;
\draw[thick, fill=red!15] (1.0,1.1) -- (1.0,2.1) arc (180:0:0.5) -- (2.0,1.1) -- (1.75,1.1) -- (1.75,2.1) arc (0:180:0.25) -- (1.25,1.1) -- cycle;
\draw[thick, fill=gray!20] (1.0,1.1) rectangle (1.25,1.35);
\draw[thick, fill=gray!20] (1.75,1.1) rectangle (2.0,1.35);
\node at (1.5,-0.55) {\small solfuro di ferro};
\end{scope}
\end{tikzpicture}
```

## Gli indizi di una reazione

Le sostanze nuove non portano un'etichetta, ma di solito una reazione si fa notare. Gli indizi più comuni sono cinque:

1. si sviluppa un gas, che forma bollicine in un liquido (effervescenza): l'aceto versato sul bicarbonato;
2. si forma un solido in un liquido che prima era limpido, un **precipitato**, che intorbida il liquido e poi si deposita sul fondo: l'acqua di calce che si intorbida quando ci si soffia dentro;
3. cambia il colore: la mela tagliata che diventa scura, il rame dei tetti che diventa verde;
4. si libera energia, come calore e a volte luce (una fiamma, un fuoco d'artificio), oppure se ne assorbe, e il recipiente si raffredda;
5. compare un odore nuovo: il latte andato a male, il burro rancido.

```tikz
% nome: trasformazioni-indizi-reazione
% alt: Quattro provette una accanto all'altra. Nella prima un liquido pieno di bollicine che salgono: si sviluppa un gas. Nella seconda un liquido torbido con un deposito bianco sul fondo: un precipitato. Nella terza un liquido azzurro con una freccia che porta a una provetta con un liquido verde scuro: cambia il colore. Nella quarta un liquido con un termometro dentro e una freccia rossa verso l'alto: la temperatura sale
% svg: trasformazioni-indizi-reazione-9787903c.svg 260x132
\begin{tikzpicture}
% tube 1: gas
\fill[cyan!20] (0,0.2) -- (0,1.6) -- (0.6,1.6) -- (0.6,0.2) arc (0:-180:0.3);
\draw[thin] (0,1.6) -- (0.6,1.6);
\draw[thick] (0,2.3) -- (0,0.2) arc (180:360:0.3) -- (0.6,2.3);
\foreach \x/\y in {0.15/0.3,0.4/0.55,0.22/0.85,0.45/1.1,0.18/1.3,0.38/1.45,0.3/0.15} \draw[thin] (\x,\y) circle (0.05);
\node at (0.3,-0.45) {\small gas};
% tube 2: precipitate
\begin{scope}[xshift=1.5cm]
\fill[gray!15] (0,0.2) -- (0,1.6) -- (0.6,1.6) -- (0.6,0.2) arc (0:-180:0.3);
\fill[gray!55] (0,0.2) -- (0,0.3) -- (0.6,0.3) -- (0.6,0.2) arc (0:-180:0.3);
\draw[thin] (0,1.6) -- (0.6,1.6);
\draw[thick] (0,2.3) -- (0,0.2) arc (180:360:0.3) -- (0.6,2.3);
\node at (0.3,-0.45) {\small precipitato};
\end{scope}
% tubes 3: colour
\begin{scope}[xshift=3.0cm]
\fill[blue!25] (0,0.2) -- (0,1.6) -- (0.6,1.6) -- (0.6,0.2) arc (0:-180:0.3);
\draw[thin] (0,1.6) -- (0.6,1.6);
\draw[thick] (0,2.3) -- (0,0.2) arc (180:360:0.3) -- (0.6,2.3);
\draw[-{Stealth}, thick] (0.75,1.0) -- (1.15,1.0);
\fill[green!45!black] (1.3,0.2) -- (1.3,1.6) -- (1.9,1.6) -- (1.9,0.2) arc (0:-180:0.3);
\draw[thin] (1.3,1.6) -- (1.9,1.6);
\draw[thick] (1.3,2.3) -- (1.3,0.2) arc (180:360:0.3) -- (1.9,2.3);
\node at (0.95,-0.45) {\small colore};
\end{scope}
% tube 4: heat
\begin{scope}[xshift=5.8cm]
\fill[cyan!20] (0,0.2) -- (0,1.6) -- (0.6,1.6) -- (0.6,0.2) arc (0:-180:0.3);
\draw[thin] (0,1.6) -- (0.6,1.6);
\draw[thick] (0,2.3) -- (0,0.2) arc (180:360:0.3) -- (0.6,2.3);
\draw[thick, fill=white] (0.22,0.35) rectangle (0.38,2.7);
\fill[red!60] (0.26,0.35) rectangle (0.34,2.2);
\draw[thick, fill=red!60] (0.3,0.3) circle (0.12);
\draw[-{Stealth}, thick, red] (0.85,1.2) -- (0.85,2.2);
\node at (0.3,-0.45) {\small calore};
\end{scope}
\end{tikzpicture}
```

Un indizio però non è una prova, perché anche molte trasformazioni fisiche producono bollicine, colori o calore. L'acqua che bolle fa bollicine, ma sono di vapore acqueo, cioè ancora acqua; una bibita gassata appena aperta fa schiuma perché esce il gas che era già sciolto; una goccia di inchiostro colora tutta l'acqua del bicchiere senza reagire; il filamento di una lampadina diventa incandescente e fa luce, e spento torna com'era. Quello che decide è la domanda di prima: alla fine ci sono sostanze nuove, con proprietà diverse da quelle dei reagenti?

```ad-warning
Bollicine non vuol dire reazione
Le bollicine dell'acqua che bolle sono di vapore acqueo: la sostanza è sempre acqua, e la trasformazione è fisica. Le bollicine dell'aceto sul bicarbonato sono di diossido di carbonio, una sostanza che prima non c'era: la trasformazione è chimica. Per decidere, conta la sostanza che forma il gas, non il fatto che ci sia un gas.
```

```ad-example
Esempio 2: una candela accesa
In una candela accesa avvengono due trasformazioni insieme. La cera vicino allo stoppino fonde, e una goccia che cola si solidifica di nuovo: è una trasformazione fisica, perché la cera fusa e quella solida sono la stessa sostanza. Nella fiamma, invece, il vapore di cera reagisce con l'ossigeno dell'aria:

$$\text{cera} + \text{ossigeno} \longrightarrow \text{diossido di carbonio} + \text{acqua}$$

e si libera calore e luce. È una trasformazione chimica, e infatti la candela si accorcia: la cera che brucia non si ritrova come cera, ma come due gas che si disperdono nell'aria.
```

## Reversibile o no

Molte trasformazioni fisiche si invertono con facilità: il ghiaccio fuso torna ghiaccio in freezer, il sale sciolto nell'acqua ricompare quando l'acqua evapora. Molte trasformazioni chimiche invece non si invertono con un gesto semplice: un uovo cotto non torna crudo raffreddandolo, e la cenere non torna legno.

È una regola pratica, non un criterio sicuro. Un bicchiere rotto è una trasformazione fisica, ma nessuno lo rimette insieme; e ci sono reazioni che si possono rovesciare con un'altra reazione: l'acqua, attraversata dalla corrente elettrica, si decompone in idrogeno e ossigeno, e i due gas, bruciando insieme, formano di nuovo acqua.

```ad-warning
Irreversibile non vuol dire chimica
Il criterio giusto è la formazione di sostanze nuove, non la possibilità di tornare indietro. Il vetro rotto e la carta strappata non si ricompongono, ma sono ancora vetro e carta: le trasformazioni sono fisiche.
```

```ad-example
Esempio 3: fisica o chimica?
Per ognuna di queste trasformazioni, di che tipo è?

- Lo zucchero si scioglie nel caffè: fisica, perché lo zucchero è ancora zucchero, sciolto nell'acqua, e si ritrova facendo evaporare l'acqua.
- Lo zucchero scaldato a lungo in un pentolino diventa caramello bruno e poi un residuo nero: chimica, perché il residuo nero è carbone, con un sapore e un colore che lo zucchero non ha.
- Una pozzanghera si asciuga al sole: fisica, perché l'acqua passa allo stato di vapore.
- Una bistecca cuoce sulla griglia e cambia colore e odore: chimica, perché si formano sostanze nuove, che danno il colore bruno e il profumo di carne cotta.
- La limatura di ferro si separa dalla sabbia con una calamita: fisica, perché i due materiali restano quelli di prima.
```

## Energia e reazioni

Quasi ogni reazione chimica scambia energia con l'ambiente, di solito come calore. Una reazione che libera calore si dice **esotermica**: le combustioni, la ruggine (lenta, e per questo non te ne accorgi), il cemento che fa presa. Una reazione che assorbe calore, e raffredda il recipiente se non la si scalda, si dice **endotermica**: la cottura dei cibi, che va avanti solo finché il fornello è acceso, e la decomposizione del calcare in una fornace.

Anche le trasformazioni fisiche scambiano calore, come mostra la lezione sui [passaggi di stato](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/i-passaggi-di-stato): il ghiaccio assorbe calore per fondere, il vapore ne cede quando condensa. Per questo il calore, da solo, è un indizio e non una prova.

## Errori frequenti

```ad-warning
Il cambiamento di stato non è una reazione
Quando l'acqua bolle o il ghiaccio fonde cambia lo stato, ma la sostanza resta acqua. Una trasformazione è chimica solo se cambiano le sostanze.
```

```ad-warning
Sciogliere non è reagire
Il sale e lo zucchero sciolti nell'acqua non scompaiono e non diventano un'altra cosa: sono ancora lì, e l'acqua salata ha il sapore del sale. Sciogliere una sostanza è una trasformazione fisica.
```
