# Sostanze pure, miscugli omogenei ed eterogenei

L'acqua del rubinetto e l'acqua distillata del ferro da stiro sembrano uguali, ma non lo sono: la prima contiene sali disciolti, che col tempo lasciano il calcare, la seconda è soltanto acqua. Nel linguaggio della chimica la seconda è una sostanza pura, la prima un miscuglio. Distinguere le sostanze pure dai miscugli, e tra i miscugli quelli omogenei da quelli eterogenei, è il primo modo di mettere ordine nei materiali che ci circondano.

## Sostanze pure

Una **sostanza pura** è un materiale fatto di un solo tipo di particelle, tutte uguali. L'acqua distillata è fatta solo di molecole d'acqua, il rame di una pentola solo di atomi di rame, lo zucchero da cucina quasi solo di molecole di saccarosio.

Una sostanza pura ha una composizione fissa e delle **proprietà caratteristiche** che non cambiano da un campione all'altro, e che servono a riconoscerla: la temperatura di fusione, la temperatura di ebollizione, la densità. Alla pressione atmosferica l'acqua pura fonde sempre a $0\,^\circ\text{C}$, bolle sempre a $100\,^\circ\text{C}$ e ha densità $1{,}00\,\text{g/mL}$, che venga da un ghiacciaio o da un laboratorio.

Le sostanze pure si dividono in **elementi**, come l'ossigeno, il ferro e il rame, che non si possono scomporre in sostanze più semplici, e **composti**, come l'acqua e il cloruro di sodio, che con una trasformazione chimica si scompongono negli elementi di cui sono fatti. La differenza è l'argomento della lezione [Elementi, composti e simboli chimici](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/elementi-composti-e-simboli-chimici).

```ad-warning
"Puro" nel linguaggio di tutti i giorni
Sull'etichetta, "succo di frutta puro" o "lana pura" vuol dire senza aggiunte, non sostanza pura: il succo è un miscuglio di acqua, zuccheri, acidi e molte altre sostanze. In chimica "puro" ha un solo significato: un solo tipo di particelle.
```

## Miscugli

Un **miscuglio** è un materiale formato da due o più sostanze pure mescolate, che si chiamano i suoi **componenti**. A differenza di una sostanza pura, un miscuglio non ha una composizione fissa: nell'acqua salata ci può essere un cucchiaino di sale o un cucchiaio, e il materiale è sempre acqua salata. Ogni componente conserva le sue proprietà: l'acqua salata è salata come il sale, e se la lasci evaporare il sale ricompare sul fondo del piatto. Per questo i componenti di un miscuglio si possono separare con metodi fisici, come spiega la lezione sui [metodi di separazione](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/metodi-di-separazione-dei-miscugli).

I miscugli si dividono in due famiglie, secondo quello che si vede quando li si guarda da vicino.

Un **miscuglio omogeneo** ha la stessa composizione e lo stesso aspetto in ogni suo punto, e i componenti non si distinguono né a occhio nudo né al microscopio: sono mescolati fino alle singole particelle. Sono miscugli omogenei l'acqua salata, l'aria pulita, l'aceto, l'ottone (una lega di rame e zinco). I miscugli omogenei si chiamano anche [soluzioni](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/le-soluzioni-e-la-concentrazione-percentuale).

Un **miscuglio eterogeneo** ha parti con composizione e aspetto diversi, che si distinguono a occhio nudo o al microscopio: acqua e olio, acqua e sabbia, il granito con i suoi granelli bianchi, rosa e neri, il latte, che a occhio sembra uniforme ma al microscopio mostra goccioline di grasso sospese nell'acqua.

```tikz
% nome: miscugli-particelle
% alt: Tre riquadri pieni di particelle disegnate come cerchi. Nel primo tutte le particelle sono azzurre: una sostanza pura. Nel secondo alcune particelle sono arancioni, sparse a caso tra le azzurre: un miscuglio omogeneo. Nel terzo le particelle arancioni sono tutte nella parte alta e le azzurre nella parte bassa, separate: un miscuglio eterogeneo con due fasi
% svg: miscugli-particelle-08f95882.svg 322x133
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (2.4,2.4);
\foreach \x/\y in {0.27/0.23,0.75/0.23,1.2/0.25,1.62/0.26,2.08/0.25,0.25/0.69,0.73/0.75,1.17/0.7,1.67/0.76,2.13/0.71,0.32/1.14,0.77/1.16,1.17/1.15,1.64/1.21,2.09/1.19,0.29/1.63,0.74/1.61,1.16/1.62,1.67/1.63,2.11/1.65,0.28/2.08,0.76/2.12,1.18/2.11,1.66/2.13,2.14/2.08}
  \draw[fill=cyan!25] (\x,\y) circle (0.17);
\node[align=center] at (1.2,-0.55) {sostanza\\pura};
\draw[thick] (3.0,0) rectangle (5.4,2.4);
\foreach \x/\y in {3.32/0.23,4.17/0.26,5.14/0.27,3.76/0.73,4.21/0.72,5.12/0.73,3.24/1.2,3.75/1.22,4.65/1.19,3.25/1.61,4.17/1.62,4.65/1.67,5.09/1.64,3.77/2.13,4.18/2.09,5.16/2.07}
  \draw[fill=cyan!25] (\x,\y) circle (0.17);
\foreach \x/\y in {3.73/0.28,4.62/0.27,3.31/0.71,4.69/0.76,4.23/1.16,5.08/1.18,3.7/1.66,3.28/2.13,4.65/2.13}
  \draw[fill=orange!50] (\x,\y) circle (0.17);
\node[align=center] at (4.2,-0.55) {miscuglio\\omogeneo};
\draw[thick] (6.0,0) rectangle (8.4,2.4);
\foreach \x/\y in {6.25/0.24,6.72/0.26,7.21/0.24,7.62/0.25,8.11/0.27,6.32/0.74,6.74/0.73,7.21/0.68,7.69/0.74,8.15/0.74,6.27/1.17,6.71/1.19,7.16/1.15,7.64/1.15,8.11/1.14}
  \draw[fill=cyan!25] (\x,\y) circle (0.17);
\foreach \x/\y in {6.24/1.61,6.71/1.63,7.16/1.67,7.67/1.61,8.1/1.63,6.27/2.07,6.77/2.14,7.2/2.1,7.63/2.07,8.11/2.08}
  \draw[fill=orange!50] (\x,\y) circle (0.17);
\node[align=center] at (7.2,-0.55) {miscuglio\\eterogeneo};
\end{tikzpicture}
```

## Fasi e componenti

Per descrivere un miscuglio eterogeneo si contano le sue fasi. Una **fase** è una parte del sistema che ha le stesse proprietà in ogni suo punto ed è separata dalle altre parti da una superficie netta. Acqua e olio in un bicchiere formano due fasi, lo strato d'acqua e lo strato d'olio; un miscuglio omogeneo ha una fase sola.

Fasi e componenti non sono la stessa cosa. Quando si contano conviene ricordare due regole:

1. Tutto quello che è sciolto in un liquido fa parte della fase del liquido: l'acqua con il sale sciolto è una fase sola, anche se i componenti sono due.
2. Più pezzi dello stesso solido formano una fase sola: tre cubetti di ghiaccio sono una fase, non tre.

```ad-example
Esempio 1: acqua, olio e ghiaccio
In un bicchiere ci sono acqua con dello zucchero sciolto, uno strato d'olio e due cubetti di ghiaccio. Quante fasi ha il sistema? E quanti componenti?

Le fasi sono tre: l'acqua con lo zucchero sciolto (una fase, per la prima regola), l'olio, il ghiaccio (una fase sola per i due cubetti, per la seconda regola). Le sostanze sono acqua, zucchero e olio: il ghiaccio è acqua anche lui, e non aggiunge un componente. Il sistema ha tre fasi e tre componenti.
```

Il caso dell'acqua con il ghiaccio merita attenzione. Un bicchiere d'acqua pura con dei cubetti di ghiaccio ha due fasi, quindi è un **sistema eterogeneo**, ma contiene una sola sostanza: non è un miscuglio, è una sostanza pura in due stati diversi. "Eterogeneo" dice quante fasi ci sono, "miscuglio" dice quante sostanze ci sono, e le due cose vanno controllate separatamente.

```ad-warning
Acqua e ghiaccio non sono un miscuglio
Un miscuglio ha almeno due sostanze diverse. Acqua e ghiaccio sono due fasi della stessa sostanza: il sistema è eterogeneo, ma è fatto di una sostanza pura.
```

## Tipi di miscugli eterogenei

I miscugli eterogenei hanno nomi diversi secondo gli stati dei componenti:

| Nome | Che cosa è disperso, in che cosa | Esempi |
|---|---|---|
| sospensione | un solido in un liquido | acqua e sabbia, acqua fangosa |
| emulsione | un liquido in un altro liquido che non si mescola | maionese, acqua e olio sbattuti |
| schiuma | un gas in un liquido | panna montata, schiuma da barba |
| nebbia | un liquido in un gas | nebbia, spray |
| fumo | un solido in un gas | fumo di un camino |

Le sospensioni e le emulsioni, lasciate ferme, di solito si separano: la sabbia va a fondo, l'olio torna a galla. Quando le parti disperse sono piccolissime, tra un milionesimo e un millesimo di millimetro, non si separano e a occhio nudo il miscuglio sembra omogeneo: è un **colloide**. Il latte, la maionese, la nebbia e la gelatina sono colloidi, e si considerano miscugli eterogenei perché al microscopio le parti si distinguono.

```ad-note
L'effetto Tyndall
Un fascio di luce che attraversa una soluzione vera, come l'acqua salata, non si vede di lato. Se attraversa un colloide, come acqua con qualche goccia di latte, il fascio si vede come una striscia luminosa, perché le parti disperse diffondono la luce. È lo stesso effetto dei raggi del sole in un bosco con la nebbia, e serve a riconoscere un colloide da una soluzione.
```

## Classificare un materiale

Lo schema riassume le classi viste finora.

```tikz
% nome: miscugli-schema-classificazione
% alt: Schema ad albero. In cima la materia, che si divide in sostanze pure e miscugli. Le sostanze pure si dividono in elementi e composti; i miscugli in miscugli omogenei, o soluzioni, e miscugli eterogenei
% svg: miscugli-schema-classificazione-f126623f.svg 337x145
\begin{tikzpicture}
\node[draw, thick, rounded corners, fill=gray!15, minimum width=2.2cm, minimum height=0.7cm] (m) at (0,3) {materia};
\node[draw, thick, rounded corners, fill=cyan!20, minimum width=2.6cm, minimum height=0.7cm] (s) at (-2.4,1.6) {sostanze pure};
\node[draw, thick, rounded corners, fill=orange!25, minimum width=2.6cm, minimum height=0.7cm] (x) at (2.4,1.6) {miscugli};
\node[draw, thin, rounded corners, minimum width=1.8cm, minimum height=0.6cm] (e) at (-3.5,0.2) {elementi};
\node[draw, thin, rounded corners, minimum width=1.8cm, minimum height=0.6cm] (c) at (-1.3,0.2) {composti};
\node[draw, thin, rounded corners, minimum width=1.8cm, minimum height=0.6cm, align=center] (o) at (1.3,0.1) {omogenei\\(soluzioni)};
\node[draw, thin, rounded corners, minimum width=1.8cm, minimum height=0.6cm] (h) at (3.5,0.2) {eterogenei};
\draw[thick] (m.south) -- (s.north);
\draw[thick] (m.south) -- (x.north);
\draw (s.south) -- (e.north);
\draw (s.south) -- (c.north);
\draw (x.south) -- (o.north);
\draw (x.south) -- (h.north);
\end{tikzpicture}
```

Per classificare un materiale si fanno due domande, nell'ordine:

1. È fatto di una sola sostanza? Se sì, è una sostanza pura.
2. Se è un miscuglio, i componenti si distinguono a occhio nudo o al microscopio? Se sì, è eterogeneo; se no, è omogeneo.

```ad-example
Esempio 2: quattro materiali di casa
Classifica l'acqua minerale naturale, il ferro di un chiodo, il succo d'arancia con la polpa e l'aria filtrata di una stanza.

L'acqua minerale contiene sali disciolti, che si leggono sull'etichetta, ma è limpida e uguale in ogni punto: miscuglio omogeneo. Il ferro di un chiodo è un solo tipo di atomi: sostanza pura (un elemento). Il succo con la polpa ha pezzetti che si vedono a occhio: miscuglio eterogeneo. L'aria filtrata è un miscuglio di azoto, ossigeno e altri gas, mescolati fino alle particelle: miscuglio omogeneo.
```

```ad-warning
"Trasparente vuol dire puro"
Che un liquido sia limpido dice che è omogeneo, non che è puro: l'acqua salata, l'aceto e il tè filtrato sono limpidi e sono miscugli. Al contrario, uniforme a occhio non vuol dire omogeneo: il latte sembra tutto uguale, ma al microscopio è eterogeneo.
```

Nella figura qui sotto scegli un materiale e guardalo sempre più da vicino, a occhio nudo, al microscopio e infine a livello delle particelle, poi decidi se è una sostanza pura, un miscuglio omogeneo o un miscuglio eterogeneo.

```interattivo
% nome: miscuglio-ingrandisci
% alt: Un campione di materiale da classificare, scelto tra otto (acqua distillata, acqua salata, acqua e olio, latte, aria, ottone, granito, rame). Tre livelli di ingrandimento: a occhio nudo si vede il recipiente o il pezzo di materiale, al microscopio un cerchio con quello che si vede ingrandito, a livello delle particelle un cerchio con particelle di uno o più colori. Tre bottoni permettono di rispondere sostanza pura, miscuglio omogeneo o miscuglio eterogeneo, e la figura dice se la risposta è giusta e perché
```

## Come si riconosce una sostanza pura

Guardare non basta sempre: l'acqua distillata e l'acqua con un po' di sale sciolto sono identiche a occhio e al microscopio. Le proprietà caratteristiche aiutano. Una sostanza pura fonde e bolle a una temperatura precisa, che resta costante per tutto il tempo del passaggio di stato: il ghiaccio che fonde resta a $0\,^\circ\text{C}$ finché non è tutto fuso. Un miscuglio no: l'acqua salata comincia a bollire qualche decimo di grado sopra $100\,^\circ\text{C}$, e mentre bolle la sua temperatura continua a salire, perché l'acqua evapora e il sale che resta diventa via via più concentrato. Allo stesso modo una lega metallica o una cera fondono in un intervallo di temperature, non a una temperatura sola.

Questa differenza si vede bene nel grafico della temperatura di un campione che si scalda, argomento della lezione [Curve di riscaldamento e di raffreddamento](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/curve-di-riscaldamento-e-di-raffreddamento).

```ad-example
Esempio 3: due polveri bianche
Due polveri bianche, $A$ e $B$, sembrano uguali. Scaldate lentamente, $A$ comincia a fondere a $52\,^\circ\text{C}$ e finisce a $61\,^\circ\text{C}$; $B$ fonde tutta a $80\,^\circ\text{C}$, e la temperatura resta ferma a $80\,^\circ\text{C}$ finché la fusione non è finita. Quale può essere una sostanza pura?

Solo $B$: una sostanza pura fonde a temperatura costante. $A$ fonde in un intervallo di $9\,^\circ\text{C}$, quindi è un miscuglio. Per dire quale sostanza è $B$ bisognerebbe confrontare la sua temperatura di fusione con quelle di una tabella, e magari misurare anche un'altra proprietà, come la densità.
```
