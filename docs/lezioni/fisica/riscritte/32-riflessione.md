# La riflessione e gli specchi piani

Quando la luce incontra la superficie di un corpo, una parte torna indietro: è la riflessione. È grazie alla riflessione che vediamo quasi tutto quello che ci circonda, dal muro di fronte alla Luna, e che uno specchio ci mostra la nostra immagine. La luce si propaga in linea retta, come spiega la lezione [I raggi di luce e la propagazione rettilinea](/materiale/scuola-superiore/fisica/l-ottica-geometrica/i-raggi-di-luce-e-la-propagazione-rettilinea), e la riflessione cambia la direzione dei raggi secondo due leggi semplici.

## Le leggi della riflessione

Un raggio di luce che arriva su uno specchio si chiama **raggio incidente**, e il punto in cui lo colpisce è il **punto di incidenza**. Il raggio che torna indietro è il **raggio riflesso**. Per misurare la direzione dei raggi si usa la **normale**, la retta perpendicolare allo specchio nel punto di incidenza, e si chiamano

- **angolo di incidenza** $i$ l'angolo tra il raggio incidente e la normale;
- **angolo di riflessione** $r$ l'angolo tra il raggio riflesso e la normale.

```tikz
% nome: leggi-della-riflessione
% alt: Uno specchio piano orizzontale con i trattini sul retro, sotto; nel punto di incidenza parte verso l'alto la normale tratteggiata. Il raggio incidente arriva da sinistra formando con la normale l'angolo i, il raggio riflesso riparte verso destra formando con la normale l'angolo r, uguale a i
% svg: leggi-della-riflessione-7b5212a4.svg 290x105
\begin{tikzpicture}
\tikzset{raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\foreach \x in {-1.88,-1.76,...,2.05} \draw[thin] (\x,0) -- ++(-0.12,-0.12);
\draw[thick] (-2,0) -- (2,0);
\draw[thin, dashed] (0,0) -- (0,2.1) node[above] {\small normale};
\draw[raggio] (-1.414,1.685) -- (0,0);
\draw[raggio] (0,0) -- (1.414,1.685);
\draw (0,0.7) arc[start angle=90, end angle=130, radius=0.7];
\draw (0.45,0.536) arc[start angle=50, end angle=90, radius=0.7];
\node at (-0.342,0.94) {$i$};
\node at (0.342,0.94) {$r$};
\node[left] at (-1.45,1.7) {\small raggio incidente};
\node[right] at (1.45,1.7) {\small raggio riflesso};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

La riflessione segue due leggi:

1. il raggio incidente, la normale e il raggio riflesso stanno nello stesso piano;
2. l'angolo di riflessione è uguale all'angolo di incidenza:

$$r = i$$

Il raggio riflesso è quindi il simmetrico del raggio incidente rispetto alla normale. Un raggio che arriva perpendicolare allo specchio ($i = 0^\circ$) torna indietro sulla stessa retta.

```ad-warning
Gli angoli si misurano dalla normale
L'angolo di incidenza non è l'angolo tra il raggio e lo specchio, ma quello tra il raggio e la normale. Se un raggio forma $25^\circ$ con la superficie dello specchio, l'angolo di incidenza è $90^\circ - 25^\circ = 65^\circ$. Chi usa l'angolo con la superficie sbaglia ogni volta che l'angolo non è $45^\circ$.
```

```ad-example
Esempio 1: dall'angolo con lo specchio
Un raggio di luce forma un angolo di $25^\circ$ con la superficie di uno specchio piano. Quanto valgono l'angolo di incidenza e l'angolo di riflessione? Quanto è ampio l'angolo tra il raggio incidente e quello riflesso?

La normale è perpendicolare allo specchio, quindi l'angolo tra il raggio e la normale è il complementare di $25^\circ$:

$$i = 90^\circ - 25^\circ = 65^\circ \qquad r = i = 65^\circ$$

L'angolo tra i due raggi è la somma dei due angoli, che stanno uno da una parte e uno dall'altra della normale: $65^\circ + 65^\circ = 130^\circ$.
```

Nella figura qui sotto puoi trascinare il punto da cui parte il raggio incidente: comunque lo sposti, l'angolo di riflessione resta uguale a quello di incidenza.

```interattivo
% nome: riflessione-angolo-specchio
% alt: Uno specchio piano orizzontale con la normale tratteggiata nel punto di incidenza; il punto da cui parte il raggio incidente si trascina sopra lo specchio, e il raggio riflesso si ridisegna. Due archi segnano l'angolo di incidenza e l'angolo di riflessione con la loro misura in gradi, sempre uguali; sotto è scritto anche l'angolo tra il raggio e la superficie dello specchio
```

```ad-note
Il cammino della luce si può percorrere al contrario
Se un raggio arrivasse lungo il raggio riflesso, verrebbe riflesso lungo il raggio incidente, all'indietro. Per questo, se tu vedi gli occhi di un amico in uno specchio, anche lui vede i tuoi.
```

## Riflessione speculare e diffusa

Le leggi della riflessione valgono per ogni raggio in ogni punto di una superficie, ma il risultato dipende da com'è fatta la superficie. Su una superficie liscia e levigata, come uno specchio o l'acqua ferma di un lago, i raggi di un fascio parallelo trovano tutti la stessa normale e vengono riflessi tutti nella stessa direzione: è la **riflessione speculare**. Su una superficie ruvida, come un foglio di carta o un muro, la normale cambia da un punto all'altro, e i raggi di un fascio parallelo vengono riflessi in tutte le direzioni: è la **riflessione diffusa**.

```tikz
% nome: riflessione-speculare-diffusa
% alt: A sinistra tre raggi paralleli colpiscono uno specchio piano e vengono riflessi tutti paralleli tra loro, riflessione speculare; a destra gli stessi tre raggi paralleli colpiscono una superficie ruvida, disegnata ingrandita come una linea spezzata, e vengono riflessi in direzioni diverse, riflessione diffusa, ognuno con l'angolo di riflessione uguale a quello di incidenza rispetto alla normale del suo tratto di superficie
% svg: riflessione-speculare-diffusa-bc22591f.svg 251x81
\begin{tikzpicture}
\tikzset{raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\foreach \x in {0.12,0.24,...,2.45} \draw[thin] (\x,0) -- ++(-0.12,-0.12);
\draw[thick] (0,0) -- (2.4,0);
\draw[raggio] (-0.236,0.996) -- (0.6,0);
\draw[raggio] (0.6,0) -- (1.436,0.996);
\draw[raggio] (0.364,0.996) -- (1.2,0);
\draw[raggio] (1.2,0) -- (2.036,0.996);
\draw[raggio] (0.964,0.996) -- (1.8,0);
\draw[raggio] (1.8,0) -- (2.636,0.996);
\fill[gray!25] (3.4,0) -- (3.8,0.1) -- (4.2,0) -- (4.6,0.12) -- (5,0) -- (5.4,0.1) -- (5.8,0.12) -- (6,0) -- (6,-0.25) -- (3.4,-0.25) -- cycle;
\draw[thick] (3.4,0) -- (3.8,0.1) -- (4.2,0) -- (4.6,0.12) -- (5,0) -- (5.4,0.1) -- (5.8,0.12) -- (6,0);
\draw[raggio] (3.114,1.058) -- (3.95,0.062);
\draw[raggio] (3.95,0.062) -- (5.063,0.511);
\draw[raggio] (3.614,1.071) -- (4.45,0.075);
\draw[raggio] (4.45,0.075) -- (4.588,1.267);
\draw[raggio] (4.764,1.106) -- (5.6,0.11);
\draw[raggio] (5.6,0.11) -- (6.276,1.102);
\node[below] at (1.2,-0.25) {\small speculare};
\node[below] at (4.7,-0.3) {\small diffusa};
\end{tikzpicture}
```

La riflessione diffusa è quella che ci fa vedere gli oggetti: la luce che colpisce questa pagina torna indietro in tutte le direzioni, e una parte arriva ai tuoi occhi da qualunque punto tu la guardi. Uno specchio perfetto, invece, non si vede: si vedono solo le immagini degli oggetti che riflette.

## L'immagine in uno specchio piano

### L'immagine di un punto

Da un punto $P$ davanti a uno specchio piano partono raggi in tutte le direzioni. Ognuno viene riflesso con la legge della riflessione, e i raggi riflessi si allontanano dallo specchio divergendo, come se partissero tutti da un punto $P'$ dietro lo specchio. Un occhio che riceve quei raggi vede la luce arrivare da $P'$: $P'$ è l'**immagine** di $P$. Per trovarla bastano due raggi:

1. si tracciano due raggi qualunque che partono da $P$ e arrivano sullo specchio;
2. in ogni punto di incidenza si disegna il raggio riflesso, con $r = i$;
3. si prolungano all'indietro i raggi riflessi, dietro lo specchio, con due linee tratteggiate: il punto in cui si incontrano è $P'$.

```tikz
% nome: immagine-di-un-punto
% alt: Uno specchio piano verticale con i trattini sul retro, a destra. Dal punto P davanti allo specchio partono due raggi che vengono riflessi indietro divergendo; i loro prolungamenti tratteggiati dietro lo specchio si incontrano nel punto P', simmetrico di P rispetto allo specchio: il segmento PP' è perpendicolare allo specchio e lo specchio lo divide in due parti uguali
% svg: immagine-di-un-punto-17f9d238.svg 178x118
\begin{tikzpicture}
\tikzset{raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\foreach \y in {-0.58,-0.46,...,2.35} \draw[thin] (0,\y) -- ++(0.12,-0.12);
\draw[thick] (0,-0.7) -- (0,2.3);
\draw[thin, dashed, gray] (-1.6,1) -- (1.6,1);
\draw[thin] (-0.8,0.92) -- (-0.8,1.08);
\draw[thin] (0.8,0.92) -- (0.8,1.08);
\draw[thin] (0,1.15) -- (-0.15,1.15) -- (-0.15,1);
\draw[raggio] (-1.6,1) -- (0,1.4);
\draw[raggio] (0,1.4) -- (-2.4,2);
\draw[raggio] (-1.6,1) -- (0,0.4);
\draw[raggio] (0,0.4) -- (-2.4,-0.5);
\draw[thin, dashed, orange!90!black] (0,1.4) -- (1.6,1);
\draw[thin, dashed, orange!90!black] (0,0.4) -- (1.6,1);
\fill (-1.6,1) circle (1.5pt) node[below left] {$P$};
\fill[blue!70!black] (1.6,1) circle (1.5pt) node[right] {$P'$};
\end{tikzpicture}
```

I due triangoli che il raggio, la normale e il segmento $PP'$ formano da una parte e dall'altra dello specchio sono uguali, e ne segue che $P'$ è il **simmetrico** di $P$ rispetto allo specchio: sta sulla perpendicolare allo specchio che passa per $P$, alla stessa distanza, dall'altra parte.

### Com'è l'immagine di un oggetto

Ogni punto di un oggetto ha la sua immagine, e l'insieme di queste immagini è l'immagine dell'oggetto. In uno specchio piano l'immagine è:

- **virtuale**: i raggi riflessi non passano davvero dall'immagine, ma sembrano venire da lì. Dietro lo specchio la luce non arriva, e l'immagine non si può raccogliere su uno schermo;
- diritta: non è capovolta;
- grande quanto l'oggetto;
- **simmetrica** dell'oggetto rispetto allo specchio, alla stessa distanza dallo specchio dall'altra parte. Per questo la mano destra, allo specchio, sembra una mano sinistra, e sul cofano delle ambulanze la scritta è al contrario, per leggersi dritta nello specchietto di chi sta davanti.

Per disegnare l'immagine di un oggetto si disegnano le immagini dei suoi punti principali, per esempio la base e la cima di una freccia. I raggi che arrivano all'occhio si trovano all'indietro: si congiunge l'occhio con l'immagine del punto, e dove la linea taglia lo specchio c'è il punto di incidenza del raggio che parte dal punto vero.

```tikz
% nome: immagine-oggetto-specchio-piano
% alt: A sinistra un occhio, al centro un oggetto disegnato come una freccia nera verso l'alto, a destra uno specchio verticale e dietro di esso l'immagine della freccia, blu e tratteggiata, alla stessa distanza d dallo specchio e alta uguale. Dalla cima e dalla base dell'oggetto partono due raggi che lo specchio riflette verso l'occhio; i loro prolungamenti tratteggiati dietro lo specchio arrivano alla cima e alla base dell'immagine
% svg: immagine-oggetto-specchio-piano-1bf3b11d.svg 182x119
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\foreach \y in {-0.18,-0.06,...,2.05} \draw[thin] (0,\y) -- ++(0.12,-0.12);
\draw[thick] (0,-0.3) -- (0,2);
\draw[raggio, orange!90!black] (-1.5,1.2) -- (0,1.431);
\draw[raggio, orange!90!black] (0,1.431) -- (-2.4,1.8);
\draw[raggio, blue!70!black] (-1.5,0) -- (0,0.692);
\draw[raggio, blue!70!black] (0,0.692) -- (-2.4,1.8);
\draw[thin, dashed, orange!90!black] (0,1.431) -- (1.5,1.2);
\draw[thin, dashed, blue!70!black] (0,0.692) -- (1.5,0);
\draw[-{Stealth}, very thick] (-1.5,0) -- (-1.5,1.2);
\draw[-{Stealth}, very thick, dashed, blue!70!black] (1.5,0) -- (1.5,1.2);
\draw[thick] (-2.75,1.8) .. controls (-2.6,2) and (-2.45,1.95) .. (-2.35,1.8) .. controls (-2.45,1.65) and (-2.6,1.6) .. (-2.75,1.8);
\fill (-2.45,1.8) circle (1.2pt);
\node[below] at (-2.55,1.6) {\small occhio};
\draw[|-|, thin] (-1.5,-0.6) -- (0,-0.6) node[midway, below] {\small $d$};
\draw[|-|, thin] (0,-0.6) -- (1.5,-0.6) node[midway, below] {\small $d$};
\end{tikzpicture}
```

Qui puoi trascinare l'oggetto e l'occhio: l'immagine resta sempre simmetrica dell'oggetto, e l'occhio la vede solo se i raggi cadono dentro lo specchio.

```interattivo
% nome: immagine-specchio-piano
% alt: Uno specchio piano verticale, un oggetto a forma di freccia davanti a esso e un occhio, che si trascinano tutti e due; dietro lo specchio l'immagine tratteggiata della freccia, simmetrica dell'oggetto. I raggi che partono dalla cima e dalla base dell'oggetto vengono riflessi verso l'occhio, e i loro prolungamenti tratteggiati arrivano all'immagine; sotto sono scritte la distanza dell'oggetto e quella dell'immagine dallo specchio, sempre uguali
```

```ad-warning
L'immagine non è dentro lo specchio
L'immagine sembra stare dietro lo specchio, ma lì non c'è niente: la luce non attraversa lo specchio, e un foglio messo dietro di esso resta al buio. È un'immagine virtuale, fatta dai prolungamenti dei raggi, non dai raggi. E non sta sulla superficie dello specchio: è distante dallo specchio quanto l'oggetto.
```

```ad-example
Esempio 2: davanti allo specchio dell'armadio
Sei a $1{,}5\,\text{m}$ dallo specchio dell'armadio. Quanto dista da te la tua immagine? E se fai un passo di $0{,}50\,\text{m}$ verso lo specchio?

L'immagine è dietro lo specchio, alla stessa distanza: $1{,}5\,\text{m}$. Da te dista

$$1{,}5 + 1{,}5 = 3{,}0\,\text{m}$$

Dopo il passo sei a $1{,}5 - 0{,}50 = 1{,}0\,\text{m}$ dallo specchio, e anche l'immagine si è avvicinata allo specchio: ora dista da te $1{,}0 + 1{,}0 = 2{,}0\,\text{m}$. Con un passo di $0{,}50\,\text{m}$ la distanza da te alla tua immagine è diminuita di $1{,}0\,\text{m}$, il doppio.
```

```ad-warning
Lo spostamento dell'immagine
Quando ti avvicini allo specchio di un tratto $x$, anche la tua immagine si avvicina allo specchio di $x$, e la distanza tra te e l'immagine diminuisce di $2x$, non di $x$.
```

### Quanto deve essere lungo uno specchio

Per vedersi per intero in uno specchio verticale non serve uno specchio alto quanto noi: basta la metà. Il raggio che parte dai piedi e arriva agli occhi viene riflesso a metà altezza tra i piedi e gli occhi, perché gli angoli di incidenza e di riflessione sono uguali; quello che parte dalla cima della testa viene riflesso a metà tra la testa e gli occhi. Lo specchio deve andare da un punto all'altro, e la sua lunghezza è la metà dell'altezza della persona, a qualunque distanza dallo specchio si trovi.

```tikz
% nome: specchio-meta-altezza
% alt: Una persona alta 1,70 metri davanti a uno specchio verticale appeso al muro. Il raggio che parte dai piedi viene riflesso dal bordo inferiore dello specchio, a 0,80 metri da terra, e arriva agli occhi; il raggio che parte dalla cima della testa viene riflesso dal bordo superiore e arriva agli occhi. Lo specchio è lungo 0,85 metri, la metà dell'altezza della persona
% svg: specchio-meta-altezza-1b11c802.svg 198x138
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\foreach \x in {-2.28,-2.16,...,0.65} \draw[thin] (\x,0) -- ++(-0.12,-0.12);
\draw[thick] (-2.4,0) -- (0.6,0);
\foreach \y in {1.72,1.84,...,3.35} \draw[thin] (0,\y) -- ++(0.12,-0.12);
\draw[thick] (0,1.6) -- (0,3.3);
\draw[thick] (-1.6,3.2) circle (0.2);
\draw[thick] (-1.6,3.0) -- (-1.6,1.5) -- (-1.75,0);
\draw[thick] (-1.6,1.5) -- (-1.45,0);
\draw[thick] (-1.85,1.9) -- (-1.6,2.7) -- (-1.35,1.9);
\fill (-1.6,3.2) circle (1.2pt);
\draw[raggio, blue!70!black] (-1.6,0) -- (0,1.6);
\draw[raggio, blue!70!black] (0,1.6) -- (-1.6,3.2);
\draw[raggio, orange!90!black] (-1.6,3.4) -- (0,3.3);
\draw[raggio, orange!90!black] (0,3.3) -- (-1.6,3.2);
\draw[|-|, thin] (-2.3,0) -- (-2.3,3.4) node[midway, left] {\small $1{,}70$ m};
\draw[|-|, thin] (0.45,1.6) -- (0.45,3.3) node[midway, right] {\small $0{,}85$ m};
\draw[|-|, thin] (0.45,0) -- (0.45,1.6) node[midway, right] {\small $0{,}80$ m};
\end{tikzpicture}
```

```ad-example
Esempio 3: lo specchio per vedersi per intero
Una ragazza alta $1{,}70\,\text{m}$ ha gli occhi a $1{,}60\,\text{m}$ da terra. Quanto deve essere lungo, al minimo, uno specchio verticale per vedersi per intero, e a che altezza va appeso il suo bordo inferiore?

Il bordo inferiore sta a metà tra i piedi e gli occhi, il bordo superiore a metà tra gli occhi e la cima della testa:

$$\frac{1{,}60}{2} = 0{,}80\,\text{m} \qquad \frac{1{,}60 + 1{,}70}{2} = 1{,}65\,\text{m}$$

Lo specchio va da $0{,}80\,\text{m}$ a $1{,}65\,\text{m}$ da terra ed è lungo $1{,}65 - 0{,}80 = 0{,}85\,\text{m}$, la metà di $1{,}70\,\text{m}$. La distanza dallo specchio non conta: allontanandosi non ci si vede più interi, anche se sembra.
```

## Due specchi

Quando un raggio viene riflesso da uno specchio e poi da un secondo, si applica la legge della riflessione due volte, una per specchio, ognuna con la sua normale. Per passare da uno specchio all'altro serve il triangolo che il raggio forma con i due specchi: la somma dei suoi angoli è $180^\circ$.

```ad-example
Esempio 4: due specchi perpendicolari
Due specchi piani formano un angolo retto. Un raggio colpisce il primo specchio con un angolo di incidenza di $60^\circ$, e dopo la riflessione arriva sul secondo. Con quale angolo di incidenza?

```tikz
% nome: due-specchi-perpendicolari
% alt: Due specchi piani perpendicolari, uno orizzontale e uno verticale, che si toccano nell'angolo in basso a sinistra. Un raggio arriva da destra sullo specchio orizzontale con angolo di incidenza di 60 gradi dalla normale, viene riflesso verso lo specchio verticale, lo colpisce con angolo di incidenza di 30 gradi e torna indietro parallelo al raggio di partenza, in verso opposto
% svg: due-specchi-perpendicolari-3a491f8b.svg 150x99
\begin{tikzpicture}
\tikzset{raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\foreach \x in {0.12,0.24,...,3.45} \draw[thin] (\x,0) -- ++(-0.12,-0.12);
\foreach \y in {0.12,0.24,...,2.45} \draw[thin] (0,\y) -- ++(-0.12,-0.12);
\draw[thick] (0,2.4) -- (0,0) -- (3.4,0);
\draw[thin, dashed] (2,0) -- (2,1.3);
\draw[thin, dashed] (0,1.155) -- (1.3,1.155);
\draw[raggio] (3.732,1) -- (2,0);
\draw[raggio] (2,0) -- (0,1.155);
\draw[raggio] (0,1.155) -- (2.078,2.355);
\draw (2.476,0.275) arc[start angle=30, end angle=90, radius=0.55];
\node at (2.5,0.7) {\scriptsize $60^\circ$};
\draw (0.476,0.88) arc[start angle=-30, end angle=0, radius=0.55];
\node at (0.95,0.98) {\scriptsize $30^\circ$};
\end{tikzpicture}
```

Il raggio forma con il primo specchio un angolo di $90^\circ - 60^\circ = 30^\circ$. Il raggio e i due specchi formano un triangolo rettangolo, e l'angolo tra il raggio e il secondo specchio è $180^\circ - 90^\circ - 30^\circ = 60^\circ$. L'angolo di incidenza sul secondo specchio è il complementare:

$$i_2 = 90^\circ - 60^\circ = 30^\circ$$

Il raggio che esce è parallelo a quello che entra, e va in verso opposto: con due specchi perpendicolari (e con tre, nello spazio) la luce torna sempre verso la sorgente. È il principio dei catarifrangenti delle biciclette.
```

```ad-example
Esempio 5: due specchi a 70°
Due specchi piani formano un angolo di $70^\circ$. Un raggio colpisce il primo specchio con un angolo di incidenza di $30^\circ$ e, riflesso, va a colpire il secondo. Con quale angolo di incidenza?

```tikz
% nome: due-specchi-ad-angolo
% alt: Due specchi piani che formano un angolo di 70 gradi, uno orizzontale e uno inclinato, con il vertice in basso a sinistra. Un raggio colpisce lo specchio orizzontale con angolo di incidenza di 30 gradi, viene riflesso formando 60 gradi con lo specchio, arriva sullo specchio inclinato formando con esso un angolo di 50 gradi, cioè con angolo di incidenza di 40 gradi dalla normale, e viene riflesso ancora
% svg: due-specchi-ad-angolo-0ba99ad1.svg 136x131
\begin{tikzpicture}
\tikzset{raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\foreach \x in {0.12,0.24,...,3.45} \draw[thin] (\x,0) -- ++(-0.12,-0.12);
\foreach \s in {0.12,0.24,...,3.05} \draw[thin] (70:\s) -- ++(160:0.15);
\draw[thick] (70:3) -- (0,0) -- (3.4,0);
\draw[thin, dashed] (2.4,0) -- (2.4,1.3);
\draw[thin, dashed] (0.928,2.55) -- (1.774,2.242);
\draw[raggio] (3.25,1.472) -- (2.4,0);
\draw[raggio] (2.4,0) -- (0.928,2.55);
\draw[raggio] (0.928,2.55) -- (2.807,3.234);
\draw (0.45,0) arc[start angle=0, end angle=70, radius=0.45];
\node at (0.62,0.43) {\scriptsize $70^\circ$};
\draw (2.4,0.55) arc[start angle=90, end angle=60, radius=0.55];
\node at (2.62,0.78) {\scriptsize $30^\circ$};
\draw (1.9,0) arc[start angle=180, end angle=120, radius=0.5];
\node at (1.72,0.28) {\scriptsize $60^\circ$};
\draw ($(0.928,2.55)+(250:0.5)$) arc[start angle=250, end angle=300, radius=0.5];
\node at ($(0.928,2.55)+(275:0.78)$) {\scriptsize $50^\circ$};
\draw ($(0.928,2.55)+(-60:0.5)$) arc[start angle=-60, end angle=-20, radius=0.5];
\node at ($(0.928,2.55)+(-40:0.8)$) {\scriptsize $40^\circ$};
\end{tikzpicture}
```

Il raggio riflesso forma con il primo specchio un angolo di $90^\circ - 30^\circ = 60^\circ$. Nel triangolo che il raggio forma con i due specchi l'angolo tra il raggio e il secondo specchio è

$$180^\circ - 70^\circ - 60^\circ = 50^\circ$$

e l'angolo di incidenza, misurato dalla normale, è $i_2 = 90^\circ - 50^\circ = 40^\circ$.
```

```ad-note
Le immagini tra due specchi
Tra due specchi che formano un angolo $\alpha$ si vedono più immagini dello stesso oggetto, perché l'immagine data da uno specchio fa da oggetto per l'altro. Quando $360^\circ/\alpha$ è un numero intero pari, le immagini sono $\dfrac{360^\circ}{\alpha} - 1$: tre con due specchi a $90^\circ$, cinque con due specchi a $60^\circ$, come in un caleidoscopio. Con due specchi paralleli, uno di fronte all'altro, le immagini sono infinite, sempre più lontane e più scure.
```
