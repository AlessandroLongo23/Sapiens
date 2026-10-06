# Elementi, composti e simboli chimici

Per duemila anni si è pensato, con Aristotele, che tutto fosse fatto di quattro elementi: terra, acqua, aria e fuoco. Poi, alla fine del Settecento, i chimici riuscirono a scomporre l'acqua in due gas, l'idrogeno e l'ossigeno, e a rifarla bruciando i due gas insieme: l'acqua non era un elemento. Da quegli esperimenti viene la distinzione di questa lezione, tra le sostanze che si possono scomporre in sostanze più semplici, i composti, e quelle che non si possono scomporre, gli elementi.

## Sostanze pure: elementi e composti

Una sostanza pura, come spiega la lezione [Sostanze pure, miscugli omogenei ed eterogenei](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/sostanze-pure-miscugli-omogenei-ed-eterogenei), ha una composizione fissa e proprietà caratteristiche, come la temperatura di fusione, che non cambiano da un campione all'altro. Le sostanze pure sono di due tipi.

Un **elemento** è una sostanza pura che non si può scomporre in sostanze più semplici con nessuna trasformazione chimica: il ferro, l'oro, l'ossigeno, il carbonio, lo zolfo. Si chiama anche **sostanza semplice**.

Un **composto** è una sostanza pura formata da due o più elementi uniti chimicamente, che con una trasformazione chimica si può scomporre negli elementi che la formano: l'acqua (idrogeno e ossigeno), il sale da cucina (sodio e cloro), il diossido di carbonio (carbonio e ossigeno), lo zucchero (carbonio, idrogeno e ossigeno). Si chiama anche **sostanza composta**.

```tikz
% nome: elementi-composti-classificazione
% alt: Schema ad albero della materia. La materia si divide in miscugli e sostanze pure; i miscugli in omogenei ed eterogenei, le sostanze pure in elementi e composti. Tra miscugli e sostanze pure una freccia dice che i miscugli si separano con metodi fisici; tra composti ed elementi una freccia dice che i composti si decompongono con trasformazioni chimiche
% svg: elementi-composti-classificazione-feaa5e97.svg 379x181
\begin{tikzpicture}
\tikzset{box/.style={draw, thick, rounded corners=2pt, fill=blue!10, minimum width=2.2cm, minimum height=0.6cm}}
\node[box] (m) at (3.85,3) {materia};
\node[box] (mi) at (1.25,1.6) {miscugli};
\node[box] (sp) at (6.45,1.6) {sostanze pure};
\node[box, fill=gray!15] (om) at (0,0) {omogenei};
\node[box, fill=gray!15] (et) at (2.5,0) {eterogenei};
\node[box, fill=orange!25] (el) at (5.2,0) {elementi};
\node[box, fill=orange!25] (co) at (7.7,0) {composti};
\draw[thick] (m.south) -- (mi.north);
\draw[thick] (m.south) -- (sp.north);
\draw[thick] (mi.south) -- (om.north);
\draw[thick] (mi.south) -- (et.north);
\draw[thick] (sp.south) -- (el.north);
\draw[thick] (sp.south) -- (co.north);
\draw[-{Stealth}, thick, blue!60!black] (mi.east) -- (sp.west) node[midway, above] {\small metodi fisici};
\draw[-{Stealth}, thick, orange!90!black] (co.south) .. controls (7.2,-1.0) and (5.7,-1.0) .. (el.south);
\node[orange!90!black] at (6.45,-1.15) {\small trasformazioni chimiche};
\end{tikzpicture}
```

La differenza tra un miscuglio e un composto sta nelle due frecce dello schema. I componenti di un miscuglio si separano con metodi fisici, come la filtrazione, la distillazione o la calamita, e ognuno ha ancora le sue proprietà. Gli elementi di un composto si separano solo con una trasformazione chimica, e il composto ha proprietà sue, diverse da quelle degli elementi.

## La decomposizione

Una reazione in cui un composto si scompone in sostanze più semplici si chiama **decomposizione**. Serve energia, che si può dare in tre modi.

- Con il calore. L'ossido di mercurio, una polvere rossa, scaldato si decompone in mercurio, un metallo liquido, e ossigeno; è l'esperimento con cui Joseph Priestley ottenne l'ossigeno nel 1774. Il calcare (carbonato di calcio) scaldato in una fornace dà ossido di calcio, la calce viva, e diossido di carbonio.
- Con la corrente elettrica: è l'**elettrolisi**. L'acqua si decompone in idrogeno e ossigeno.
- Con la luce: il bromuro d'argento delle vecchie pellicole fotografiche, alla luce, annerisce perché si forma argento.

```ad-example
Esempio 1: l'elettrolisi dell'acqua
Nell'acqua di un recipiente si immergono due elettrodi, collegati ai poli di una pila, e sopra ognuno si capovolge una provetta piena d'acqua. Nell'acqua si scioglie un po' di solfato di sodio, perché l'acqua pura conduce pochissimo la corrente. Su tutti e due gli elettrodi si formano bollicine, e i gas si raccolgono in cima alle provette, scacciando l'acqua.

```tikz
% nome: elementi-elettrolisi-acqua
% alt: Un recipiente d'acqua con due provette capovolte, ognuna sopra un elettrodo collegato a una pila. Nella provetta a sinistra, sopra l'elettrodo negativo, si è raccolto un volume di gas doppio di quello della provetta a destra, sopra l'elettrodo positivo: a sinistra c'è l'idrogeno, a destra l'ossigeno
% svg: elementi-elettrolisi-acqua-6e7d589e.svg 193x215
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (5,1.8);
\draw[thin] (0,1.8) -- (5,1.8);
\draw[thick] (0,2.4) -- (0,0) -- (5,0) -- (5,2.4);
% left tube: hydrogen, twice the gas
\fill[cyan!20] (1.0,0.6) rectangle (1.8,1.7);
\draw[thin] (1.0,1.7) -- (1.8,1.7);
\draw[thick] (1.0,0.6) -- (1.0,3.4) arc (180:0:0.4) -- (1.8,0.6);
% right tube: oxygen
\fill[cyan!20] (3.2,0.6) rectangle (4.0,2.8);
\draw[thin] (3.2,2.8) -- (4.0,2.8);
\draw[thick] (3.2,0.6) -- (3.2,3.4) arc (180:0:0.4) -- (4.0,0.6);
% electrodes
\draw[line width=2pt] (1.4,0.15) -- (1.4,0.9);
\draw[line width=2pt] (3.6,0.15) -- (3.6,0.9);
\foreach \y in {1.05,1.3,1.55} \draw[thin] (1.4,\y) circle (0.05);
\foreach \y in {1.2,1.9,2.5} \draw[thin] (3.6,\y) circle (0.05);
% wires and battery
\draw (1.4,0.15) -- (1.4,-0.4) -- (2.2,-0.4);
\draw (3.6,0.15) -- (3.6,-0.4) -- (2.8,-0.4);
\draw[line width=2.4pt] (2.2,-0.58) -- (2.2,-0.22);
\draw (2.8,-0.8) -- (2.8,0.0);
\node at (2.05,-0.95) {$-$};
\node at (2.95,-0.95) {$+$};
\node at (1.4,4.15) {\small idrogeno};
\node at (3.6,4.15) {\small ossigeno};
\end{tikzpicture}
```

Il gas raccolto sopra l'elettrodo negativo brucia con un piccolo scoppio se ci si avvicina un fiammifero: è idrogeno. Quello raccolto sopra l'elettrodo positivo fa riaccendere un fiammifero appena spento: è ossigeno. Il volume dell'idrogeno è sempre il doppio di quello dell'ossigeno. L'acqua si è decomposta in due elementi:

$$\text{acqua} \longrightarrow \text{idrogeno} + \text{ossigeno}$$
```

Un elemento, invece, non si decompone. Il ferro si può fondere, sciogliere in un acido, far arrugginire, ma da nessuna reazione si ottiene una sostanza più semplice del ferro: le reazioni del ferro danno sempre composti che contengono ferro.

```ad-note
La definizione di Lavoisier
La definizione di elemento come sostanza che non si riesce a decomporre è di Antoine-Laurent Lavoisier, che nel suo Trattato elementare di chimica del 1789 elencò 33 sostanze semplici. Era una definizione onesta: un elemento è ciò che nessuno è riuscito a scomporre. Infatti nella lista c'erano anche la calce e la magnesia, che anni dopo si scoprì essere composti, e perfino la luce e il calorico, il fluido del calore che oggi sappiamo non esistere.
```

## Il composto ha proprietà nuove

Un composto non somiglia agli elementi che lo formano. Il sodio è un metallo tenero e lucido che reagisce con violenza con l'acqua; il cloro è un gas giallo-verde e velenoso; il loro composto, il cloruro di sodio, è il sale bianco che si mette nella pasta. L'idrogeno brucia e l'ossigeno fa bruciare, ma il loro composto, l'acqua, spegne il fuoco.

In un composto, poi, gli elementi stanno sempre nella stessa proporzione in massa: l'acqua pura contiene sempre l'$11{,}2\%$ di idrogeno e l'$88{,}8\%$ di ossigeno, che venga da un fiume o da un laboratorio. È la [legge di Proust](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-proust). In un miscuglio invece i componenti possono stare in qualunque proporzione.

| | Miscuglio | Composto |
|---|---|---|
| Composizione | variabile | fissa |
| Proprietà | quelle dei componenti | nuove, diverse da quelle degli elementi |
| Come si separa | con metodi fisici | con una trasformazione chimica |
| Come si forma | mescolando, senza reazione | con una reazione, che di solito scambia calore |

```ad-warning
Un composto non è un miscuglio di elementi
L'acqua non è "idrogeno mescolato con ossigeno": un miscuglio di idrogeno e ossigeno è un gas incolore che esplode con una scintilla, l'acqua è un liquido che spegne il fuoco. Nel composto gli elementi ci sono, perché con la decomposizione si ritrovano, ma sono uniti in un modo che cambia tutte le proprietà.
```

```ad-example
Esempio 2: elemento, composto o miscuglio?
- L'ossigeno: è un elemento, perché nessuna reazione lo scompone.
- L'aria: è un miscuglio omogeneo di azoto, ossigeno e altri gas, in proporzioni che cambiano un po' da un luogo all'altro; distillando l'aria liquida i gas si separano.
- Il diossido di carbonio: è un composto, perché con una reazione si può scomporre in carbonio e ossigeno, e ha proprietà diverse da tutti e due (non brucia e non fa bruciare).
- L'acqua di mare: è un miscuglio omogeneo, perché facendola evaporare resta il sale, e la quantità di sale cambia da un mare all'altro.
- Lo zolfo: è un elemento.
```

## I simboli chimici

Gli elementi oggi conosciuti sono 118, e gli ultimi quattro hanno avuto il loro nome nel 2016; poco più di novanta si trovano in natura, gli altri sono stati prodotti in laboratorio. Ogni elemento ha un **simbolo chimico**, uguale in tutte le lingue, proposto nel 1813 dal chimico svedese Jöns Jacob Berzelius. Il simbolo si scrive così:

1. è la prima lettera del nome latino dell'elemento, maiuscola;
2. se quella lettera è già presa, si aggiunge una seconda lettera del nome, sempre minuscola.

Per esempio il carbonio (carbonium) è $\mathrm{C}$, il calcio (calcium) è $\mathrm{Ca}$, il cloro (chlorum) è $\mathrm{Cl}$, il cobalto è $\mathrm{Co}$. Molti simboli vengono dal nome latino e non somigliano al nome italiano: il sodio è $\mathrm{Na}$ da natrium, il potassio è $\mathrm{K}$ da kalium, il ferro è $\mathrm{Fe}$ da ferrum.

| Elemento | Simbolo | | Elemento | Simbolo |
|---|---|---|---|---|
| Idrogeno | $\mathrm{H}$ | | Zolfo | $\mathrm{S}$ (sulfur) |
| Elio | $\mathrm{He}$ | | Cloro | $\mathrm{Cl}$ |
| Carbonio | $\mathrm{C}$ | | Potassio | $\mathrm{K}$ (kalium) |
| Azoto | $\mathrm{N}$ (nitrogenium) | | Calcio | $\mathrm{Ca}$ |
| Ossigeno | $\mathrm{O}$ | | Ferro | $\mathrm{Fe}$ (ferrum) |
| Sodio | $\mathrm{Na}$ (natrium) | | Rame | $\mathrm{Cu}$ (cuprum) |
| Magnesio | $\mathrm{Mg}$ | | Zinco | $\mathrm{Zn}$ |
| Alluminio | $\mathrm{Al}$ | | Argento | $\mathrm{Ag}$ (argentum) |
| Silicio | $\mathrm{Si}$ | | Oro | $\mathrm{Au}$ (aurum) |
| Fosforo | $\mathrm{P}$ | | Mercurio | $\mathrm{Hg}$ (hydrargyrum) |
| Iodio | $\mathrm{I}$ | | Piombo | $\mathrm{Pb}$ (plumbum) |

Tutti gli elementi, con il loro simbolo, sono ordinati nella tavola periodica, che nacque proprio per metterli in ordine: ne parla la lezione [La tavola periodica di Mendeleev](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/la-tavola-periodica-di-mendeleev). Per trovare il simbolo di un elemento, o il nome che sta dietro un simbolo, c'è la [tavola periodica interattiva](/strumenti/tavola-periodica), con la scheda di ognuno dei 118.

```ad-warning
Maiuscole e minuscole
In un simbolo di due lettere la seconda è sempre minuscola, e la differenza conta: $\mathrm{Co}$ è il cobalto, un elemento, mentre $\mathrm{CO}$ sono due simboli, $\mathrm{C}$ e $\mathrm{O}$, cioè il monossido di carbonio, un composto. Allo stesso modo $\mathrm{Mg}$ (magnesio) non è $\mathrm{Mn}$ (manganese), e $\mathrm{S}$ è lo zolfo, non il sodio.
```

## Dai simboli alle formule

Con i simboli si scrivono anche i composti: il cloruro di sodio è $\mathrm{NaCl}$, il carbonato di calcio è $\mathrm{CaCO_3}$, l'acqua è $\mathrm{H_2O}$. Ogni lettera maiuscola comincia un simbolo nuovo, e contando le maiuscole si sa quanti elementi ci sono in un composto. Che cosa dicono i numeri in basso lo spiega la lezione [La formula chimica e il suo significato](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-formula-chimica-e-il-suo-significato).

```ad-example
Esempio 3: quali elementi ci sono?
- $\mathrm{NaCl}$: le maiuscole sono due, $\mathrm{Na}$ e $\mathrm{Cl}$, quindi due elementi, sodio e cloro.
- $\mathrm{CaCO_3}$: le maiuscole sono tre, $\mathrm{Ca}$, $\mathrm{C}$ e $\mathrm{O}$, quindi tre elementi, calcio, carbonio e ossigeno. Il numero $3$ non è un elemento.
- $\mathrm{NaHCO_3}$, il bicarbonato di sodio: $\mathrm{Na}$, $\mathrm{H}$, $\mathrm{C}$, $\mathrm{O}$, quattro elementi.
- $\mathrm{Co}$: una sola maiuscola, quindi un solo simbolo: è l'elemento cobalto.
```

```ad-warning
Contare le lettere
In $\mathrm{NaCl}$ le lettere sono quattro, ma gli elementi due: si contano le maiuscole, perché ogni simbolo ne ha una sola. E la $\mathrm{N}$ di $\mathrm{Na}$ non è l'azoto: la minuscola che la segue dice che il simbolo è $\mathrm{Na}$, il sodio.
```
