# Il momento di una forza e di una coppia di forze

Per aprire una porta si spinge la maniglia, lontano dai cardini: spingendo vicino ai cardini, con la stessa forza, la porta si muove appena. Per svitare un bullone duro si prende la chiave inglese dal fondo del manico, non vicino al dado. In tutti e due i casi la forza fa ruotare un corpo intorno a un punto fisso, e il suo effetto dipende da quanto è intensa ma anche da dove e come è applicata. La grandezza che misura questo effetto è il momento della forza.

La lezione usa i vettori e le forze del capitolo precedente, in particolare [Le forze e il dinamometro](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro), e il seno della lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore).

## Il braccio di una forza

Pensa a un'asta rigida che può ruotare intorno a un punto fisso $O$, come una porta intorno ai cardini o una chiave intorno al dado. Il punto $O$ si chiama **polo** (o centro di rotazione); se l'asta ci è fissata con un perno, si parla anche di **perno**, e se ci è appoggiata sopra, di **fulcro**.

Una forza $\vec{F}$ applicata all'asta in un punto $P$ sta su una retta, la sua retta d'azione. Il **braccio** della forza rispetto a $O$ è la distanza di $O$ dalla retta d'azione, cioè la lunghezza del segmento perpendicolare che va da $O$ alla retta. Si indica con $b$ e si misura in metri.

```tikz
% nome: braccio-di-una-forza
% alt: Un'asta orizzontale che ruota intorno al perno O, all'estremità sinistra; la forza F è applicata nel punto P, alla distanza d da O, e forma un angolo alfa con l'asta; la retta d'azione della forza è tratteggiata e prolungata sotto l'asta, e il braccio b è il segmento arancione perpendicolare che va da O alla retta d'azione
% svg: braccio-di-una-forza-0041f246.svg 188x155
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,-0.07) rectangle (4,0.07);
\draw[dashed, thin] (1.9,-1.905) -- (3.95,1.645);
\node[below] at (1.9,-1.905) {\small retta d'azione};
\draw[thick, orange!90!black] (0,0) -- (2.25,-1.299);
\node[orange!90!black, below left] at (1.1,-0.64) {$b$};
\draw[thin] (2.077,-1.199) -- (2.177,-1.026) -- (2.35,-1.126);
\draw[thin] (3.5,0) arc[start angle=0, end angle=60, radius=0.5];
\node at (3.72,0.36) {\small $\alpha$};
\draw[-{Stealth}, thick, red] (3,0) -- (3.75,1.299) node[right] {$\vec{F}$};
\fill (3,0) circle (1.5pt);
\node[below right] at (3,-0.05) {$P$};
\draw[|-|, thin] (0,0.4) -- (3,0.4);
\node[above] at (1.5,0.4) {\small $d$};
\draw[thick, fill=white] (0,0) circle (2pt);
\node[left] at (-0.1,0) {$O$};
\end{tikzpicture}
```

Il braccio non è la distanza $d$ tra il polo e il punto di applicazione, misurata lungo l'asta: lo è solo quando la forza è perpendicolare all'asta. Nella figura la forza è inclinata, e il braccio $b$ è più corto di $d$.

```ad-warning
Una forza che passa per il polo non fa ruotare
Se la retta d'azione passa per $O$, la distanza di $O$ dalla retta è zero: il braccio è nullo e la forza non fa ruotare l'asta, per quanto sia intensa. Tirare una porta aperta verso i cardini, lungo il suo piano, non la chiude.
```

## Il momento di una forza

Il **momento** di una forza rispetto al polo $O$ è il prodotto dell'intensità della forza per il suo braccio:

$$M = F \cdot b$$

Più grande è il momento, più efficace è la forza nel far ruotare il corpo: a parità di forza conta il braccio, e per questo la maniglia sta lontano dai cardini. L'unità di misura del momento è il newton per metro, $\text{N} \cdot \text{m}$: un momento di $1\,\text{N} \cdot \text{m}$ è quello di una forza di $1\,\text{N}$ con il braccio di $1\,\text{m}$.

```ad-example
Esempio 1: la chiave inglese
Per stringere un bullone applichi una forza di $40\,\text{N}$ all'estremità del manico di una chiave inglese, perpendicolare al manico, a $30\,\text{cm}$ dal centro del dado. Quanto vale il momento della forza rispetto al centro del dado?

```tikz
% nome: momento-chiave-inglese
% alt: Una chiave inglese vista dall'alto, con il dado nel punto O e il manico orizzontale lungo 30 centimetri; all'estremità del manico una forza di 40 newton perpendicolare al manico, verso il basso, fa ruotare la chiave in senso orario
% svg: momento-chiave-inglese-5b9615be.svg 169x96
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0.3,-0.1) rectangle (3.2,0.1);
\draw[thick, fill=gray!20] (0.35,0) -- (0.175,0.303) -- (-0.175,0.303) -- (-0.35,0) -- (-0.175,-0.303) -- (0.175,-0.303) -- cycle;
\fill (0,0) circle (1.5pt);
\node[left] at (-0.35,0) {$O$};
\draw[-{Stealth}, thick, red] (3,0) -- (3,-1.2) node[right] {$\vec{F}$};
\fill (3,0) circle (1.5pt);
\draw[|-|, thin] (0,0.5) -- (3,0.5);
\node[above] at (1.5,0.5) {\small $b = 30$ cm};
\draw[-{Stealth}, thin] (0.705,-0.257) arc[start angle=-20, end angle=-110, radius=0.75];
\end{tikzpicture}
```

La forza è perpendicolare al manico, quindi il braccio è la distanza dal centro del dado al punto in cui la forza è applicata: $b = 30\,\text{cm} = 0{,}30\,\text{m}$. Il momento è

$$M = F \cdot b = 40\,\text{N} \cdot 0{,}30\,\text{m} = 12\,\text{N} \cdot \text{m}$$

Con un manico lungo il doppio basterebbe metà della forza per avere lo stesso momento.
```

```ad-warning
Il braccio va in metri
Il momento si misura in $\text{N} \cdot \text{m}$, quindi il braccio si scrive in metri prima di moltiplicare. Con $b = 30\,\text{cm}$ scritto come $30$ si ottiene $1200$, un momento cento volte troppo grande.
```

## Il verso di rotazione e il segno del momento

Una forza può far ruotare l'asta in due versi: **antiorario**, contrario a quello delle lancette dell'orologio, oppure **orario**. Per distinguerli si dà un segno al momento: si sceglie positivo il momento che fa ruotare in senso antiorario e negativo quello che fa ruotare in senso orario. È la stessa scelta degli angoli nel piano cartesiano, che si misurano in senso antiorario.

```tikz
% nome: momento-verso-segno
% alt: Due aste uguali con il perno al centro O. Nella prima una forza verso l'alto applicata a destra del perno fa ruotare l'asta in senso antiorario, e il momento è positivo; nella seconda una forza verso il basso applicata a destra del perno la fa ruotare in senso orario, e il momento è negativo
% svg: momento-verso-segno-bfc1653f.svg 315x108
\begin{tikzpicture}
\draw[thick, fill=blue!10] (-1.5,-0.07) rectangle (1.5,0.07);
\draw[-{Stealth}, thick, red] (1.2,0) -- (1.2,1.1) node[right] {$\vec{F}$};
\fill (1.2,0) circle (1.5pt);
\draw[-{Stealth}, thin] (0.54,0.25) arc[start angle=25, end angle=155, radius=0.6];
\draw[thick, fill=white] (0,0) circle (2pt);
\node[below] at (0,-0.1) {$O$};
\node[below] at (0,-0.7) {\small antiorario, $M > 0$};
\draw[thick, fill=blue!10] (3.5,-0.07) rectangle (6.5,0.07);
\draw[-{Stealth}, thick, red] (6.2,0) -- (6.2,-1.1) node[right] {$\vec{F}$};
\fill (6.2,0) circle (1.5pt);
\draw[-{Stealth}, thin] (4.46,0.25) arc[start angle=155, end angle=25, radius=0.6];
\draw[thick, fill=white] (5,0) circle (2pt);
\node[below] at (5,-0.1) {$O$};
\node[below] at (5,-0.7) {\small orario, $M < 0$};
\end{tikzpicture}
```

Il verso di rotazione dipende da due cose insieme, il verso della forza e il lato del polo su cui è applicata: una forza verso l'alto a destra del polo fa ruotare in senso antiorario, la stessa forza a sinistra del polo in senso orario. Per trovarlo, immagina di spingere l'asta con quella forza tenendo fermo il polo.

Quando su un corpo agiscono più forze, il **momento totale** rispetto a un polo è la somma dei momenti delle singole forze, ciascuno con il suo segno. Il segno del momento totale dice da che parte il corpo comincia a ruotare.

```ad-example
Esempio 2: due forze sulla stessa asta
Un'asta può ruotare intorno a un perno $O$. A destra del perno, a $0{,}50\,\text{m}$ da $O$, agisce una forza $F_1 = 42\,\text{N}$ verso l'alto; a sinistra, a $0{,}40\,\text{m}$ da $O$, una forza $F_2 = 30\,\text{N}$ anch'essa verso l'alto. Le forze sono perpendicolari all'asta. Quanto vale il momento totale, e da che parte ruota l'asta?

```tikz
% nome: momento-totale-due-forze
% alt: Un'asta orizzontale con il perno O; a destra, a 0,50 metri da O, la forza F1 di 42 newton verso l'alto; a sinistra, a 0,40 metri da O, la forza F2 di 30 newton verso l'alto; le frecce sono in scala, 1 centimetro per 20 newton, e le distanze 1 centimetro per 0,2 metri
% svg: momento-totale-due-forze-d43c828f.svg 197x141
\begin{tikzpicture}
\draw[thick, fill=blue!10] (-2.3,-0.07) rectangle (2.8,0.07);
\draw[-{Stealth}, thick, red] (2.5,0) -- (2.5,2.1) node[above] {$\vec{F}_1$};
\fill (2.5,0) circle (1.5pt);
\draw[-{Stealth}, thick, red] (-2,0) -- (-2,1.5) node[above] {$\vec{F}_2$};
\fill (-2,0) circle (1.5pt);
\draw[thick, fill=white] (0,0) circle (2pt);
\node[above] at (0,0.1) {$O$};
\draw[|-|, thin] (0,-0.4) -- (2.5,-0.4);
\node[below] at (1.25,-0.4) {\small $0{,}50$ m};
\draw[|-|, thin] (-2,-0.4) -- (0,-0.4);
\node[below] at (-1,-0.4) {\small $0{,}40$ m};
\end{tikzpicture}
```

Le forze sono perpendicolari all'asta, quindi i bracci sono le distanze da $O$. La forza $F_1$, verso l'alto a destra del perno, fa ruotare in senso antiorario: il suo momento è positivo. La forza $F_2$, verso l'alto a sinistra del perno, fa ruotare in senso orario: il suo momento è negativo.

$$M_1 = +42\,\text{N} \cdot 0{,}50\,\text{m} = +21\,\text{N} \cdot \text{m}$$

$$M_2 = -30\,\text{N} \cdot 0{,}40\,\text{m} = -12\,\text{N} \cdot \text{m}$$

$$M = M_1 + M_2 = +21\,\text{N} \cdot \text{m} - 12\,\text{N} \cdot \text{m} = +9\,\text{N} \cdot \text{m}$$

Il momento totale è positivo: l'asta comincia a ruotare in senso antiorario, dalla parte di $F_1$. Non vince la forza più grande, ma quella con il momento più grande: con $F_2$ applicata a $0{,}80\,\text{m}$ da $O$ il suo momento sarebbe $-30 \cdot 0{,}80 = -24\,\text{N} \cdot \text{m}$, più grande in valore di quello di $F_1$, e l'asta ruoterebbe in senso orario.
```

```ad-warning
Il segno viene dalla rotazione, non dalla forza
Due forze entrambe verso l'alto possono avere momenti di segno opposto, come nell'esempio 2: il segno si decide dal verso in cui la forza fa girare l'asta intorno al polo, non dal verso della freccia.
```

## Il momento di una forza obliqua

Quando la forza forma con l'asta un angolo $\alpha$, il braccio si trova con la trigonometria. Nella figura del braccio il polo $O$, il punto di applicazione $P$ e il piede della perpendicolare sulla retta d'azione formano un triangolo rettangolo, con l'ipotenusa $OP = d$ e il cateto $b$ opposto all'angolo $\alpha$. Allora $b = d \sin\alpha$, e il momento è

$$M = F \cdot d \sin\alpha$$

dove $d$ è la distanza tra il polo e il punto di applicazione e $\alpha$ l'angolo tra la forza e l'asta. Lo stesso risultato si ottiene scomponendo la forza lungo l'asta e perpendicolarmente all'asta: la componente lungo l'asta passa per il polo e non fa ruotare, la componente perpendicolare vale $F \sin\alpha$ e ha il braccio $d$.

Il seno di $90^\circ$ vale $1$: una forza perpendicolare all'asta ha il braccio più lungo possibile, $b = d$, e il momento più grande. Con $\alpha = 0^\circ$ o $180^\circ$ il seno vale $0$: la forza è lungo l'asta, la sua retta d'azione passa per il polo e il momento è nullo.

```ad-example
Esempio 3: una forza inclinata
Una forza di $45\,\text{N}$ è applicata all'estremità di un'asta lunga $0{,}40\,\text{m}$, che ruota intorno all'altra estremità $O$. La forza forma con l'asta un angolo di $30^\circ$, come nella figura. Quanto valgono il braccio e il momento?

```tikz
% nome: momento-forza-obliqua
% alt: Un'asta lunga 0,40 metri con il perno O all'estremità sinistra; all'estremità destra una forza di 45 newton forma un angolo di 30 gradi con l'asta, verso l'alto e verso destra; la retta d'azione è tratteggiata e il braccio, il segmento arancione perpendicolare da O alla retta d'azione, è lungo la metà dell'asta; scala di 1 centimetro per 0,1 metri
% svg: momento-forza-obliqua-ee072e93.svg 237x124
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,-0.07) rectangle (4,0.07);
\draw[dashed, thin] (0.623,-1.95) -- (5.559,0.9);
\draw[thick, orange!90!black] (0,0) -- (1,-1.732);
\node[orange!90!black, left] at (0.45,-0.95) {$b$};
\draw[thin] (0.9,-1.559) -- (1.073,-1.459) -- (1.173,-1.632);
\draw[thin] (4.6,0) arc[start angle=0, end angle=30, radius=0.6];
\node at (4.95,0.17) {\small $30^\circ$};
\draw[-{Stealth}, thick, red] (4,0) -- (5.126,0.65) node[above] {$\vec{F}$};
\fill (4,0) circle (1.5pt);
\draw[|-|, thin] (0,0.4) -- (4,0.4);
\node[above] at (2,0.4) {\small $d = 0{,}40$ m};
\draw[thick, fill=white] (0,0) circle (2pt);
\node[left] at (-0.1,0) {$O$};
\end{tikzpicture}
```

Il braccio è

$$b = d \sin\alpha = 0{,}40\,\text{m} \cdot \sin 30^\circ = 0{,}40\,\text{m} \cdot 0{,}50 = 0{,}20\,\text{m}$$

e il momento

$$M = F \cdot b = 45\,\text{N} \cdot 0{,}20\,\text{m} = 9{,}0\,\text{N} \cdot \text{m}$$

La forza fa ruotare l'asta in senso antiorario, quindi il momento è positivo. Perpendicolare all'asta, la stessa forza avrebbe avuto un momento doppio, $45 \cdot 0{,}40 = 18\,\text{N} \cdot \text{m}$.
```

```ad-warning
Il braccio non si misura lungo l'asta
Con una forza obliqua il braccio non è $d$: moltiplicare $45\,\text{N}$ per $0{,}40\,\text{m}$ dà $18\,\text{N} \cdot \text{m}$, il momento della forza perpendicolare. Il braccio è la distanza del polo dalla retta d'azione, $d \sin\alpha$, e l'angolo $\alpha$ va misurato tra la forza e l'asta: con l'angolo tra la forza e la perpendicolare all'asta si usa il coseno.
```

Nella figura qui sotto puoi spostare il punto in cui spingi il manico e ruotare la forza, e vedere come cambiano il braccio e il momento.

```interattivo
% nome: chiave-inglese-momento
% alt: Una chiave inglese che ruota intorno al dado O, con una forza applicata sul manico: si sposta il punto di applicazione lungo il manico, si ruota la forza trascinandone la punta e si cambia la sua intensità con un cursore; la retta d'azione è tratteggiata, il braccio è il segmento arancione perpendicolare da O alla retta, e sotto si leggono la distanza d, l'angolo alfa, il braccio, il momento con il segno e il verso di rotazione
```

## La coppia di forze

Due forze con la stessa intensità, rette d'azione parallele e distinte e versi opposti formano una **coppia di forze**. Le mani sul volante di un'auto, le dita che girano la chiave nella serratura o il tappo di una bottiglia applicano una coppia.

La risultante di una coppia è nulla, perché le due forze sono opposte: una coppia non sposta il corpo, ma lo fa ruotare. Il **braccio della coppia** è la distanza $b$ tra le due rette d'azione, e il **momento della coppia** è

$$M = F \cdot b$$

dove $F$ è l'intensità di una delle due forze. Il segno si sceglie come per una forza sola: positivo se la coppia fa ruotare in senso antiorario.

```ad-example
Esempio 4: il volante
Un'automobilista gira il volante, che ha il diametro di $0{,}38\,\text{m}$, con le due mani ai lati opposti: spinge verso l'alto con la destra e verso il basso con la sinistra, con due forze di $15\,\text{N}$ tangenti al volante. Quanto vale il momento della coppia?

```tikz
% nome: momento-coppia-volante
% alt: Un volante visto di fronte, di diametro 0,38 metri; sul bordo destro una forza di 15 newton verso l'alto e sul bordo sinistro una forza di 15 newton verso il basso; le rette d'azione sono verticali e tratteggiate, e la loro distanza, il braccio della coppia, è il diametro; una freccia curva indica la rotazione in senso antiorario
% svg: momento-coppia-volante-68f52031.svg 164x169
\begin{tikzpicture}
\draw[thick, fill=gray!20, even odd rule] (0,0) circle (1.5) (0,0) circle (1.25);
\draw[thick] (-1.25,0) -- (1.25,0);
\draw[thick, fill=gray!20] (0,0) circle (0.25);
\draw[dashed, thin] (1.5,-1.8) -- (1.5,1.8);
\draw[dashed, thin] (-1.5,-1.8) -- (-1.5,1.8);
\draw[-{Stealth}, thick, red] (1.5,0) -- (1.5,1.0) node[right] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (-1.5,0) -- (-1.5,-1.0) node[left] {$\vec{F}_2$};
\fill (1.5,0) circle (1.5pt);
\fill (-1.5,0) circle (1.5pt);
\draw[-{Stealth}, thin] (0.62,0.62) arc[start angle=45, end angle=135, radius=0.88];
\draw[|-|, thin] (-1.5,-2.05) -- (1.5,-2.05);
\node[below] at (0,-2.05) {\small $b = 0{,}38$ m};
\end{tikzpicture}
```

Le due forze hanno la stessa intensità, rette d'azione parallele e versi opposti: sono una coppia. Le rette d'azione sono le due tangenti verticali al volante, quindi la loro distanza è il diametro, $b = 0{,}38\,\text{m}$, e il momento della coppia è

$$M = F \cdot b = 15\,\text{N} \cdot 0{,}38\,\text{m} = 5{,}7\,\text{N} \cdot \text{m}$$

in senso antiorario, quindi positivo. Rispetto al centro del volante lo stesso risultato viene dalla somma dei momenti delle due forze, ciascuna con il braccio di $0{,}19\,\text{m}$: $15 \cdot 0{,}19 + 15 \cdot 0{,}19 = 5{,}7\,\text{N} \cdot \text{m}$.
```

```ad-warning
Il braccio della coppia è la distanza tra le due forze
Nella coppia il braccio è la distanza tra le due rette d'azione, non la distanza di una forza dal centro: per il volante è il diametro, non il raggio. Con il raggio si trova metà del momento.
```

```ad-note
Il momento di una coppia non dipende dal polo
Il momento di una coppia è lo stesso rispetto a qualunque punto. Se il polo è tra le due rette d'azione, a distanza $x$ da una e $b - x$ dall'altra, le due forze fanno ruotare nello stesso verso e i loro momenti si sommano: $F x + F (b - x) = F b$. Se il polo è fuori, a distanza $x$ dalla retta più vicina, le forze fanno ruotare in versi opposti e i momenti si sottraggono: $F (x + b) - F x = F b$. Per questo di una coppia si dice solo il momento, senza dire rispetto a quale punto.
```

Un corpo su cui agiscono forze con risultante nulla può quindi ancora ruotare, se il momento totale non è nullo. Quali condizioni servono perché resti fermo lo spiega la lezione [L'equilibrio di un corpo rigido](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-corpo-rigido). Al terzo anno il momento diventerà un vettore, con il prodotto vettoriale della lezione [Prodotto scalare e prodotto vettoriale](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/prodotto-scalare-e-prodotto-vettoriale).
