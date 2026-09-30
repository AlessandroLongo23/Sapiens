# Il baricentro e la stabilità dell'equilibrio

Una matita tenuta in equilibrio sulla punta di un dito cade subito, la stessa matita appesa per un'estremità a un filo resta ferma; un bicchiere pieno si rovescia meno facilmente di uno vuoto e alto; chi sta in piedi su un autobus allarga le gambe per non cadere. Per capire quando un corpo resta in equilibrio e quando cade serve un punto, il baricentro, in cui si può pensare applicato tutto il suo peso.

## Il baricentro

Ogni pezzetto di un corpo è attirato dalla Terra, e il peso del corpo è la somma di tutte queste forze piccole, parallele e rivolte verso il basso. La [forza-peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa) si disegna però come una forza sola: il **baricentro** $G$ di un corpo è il punto di applicazione della forza-peso, cioè il punto in cui un'unica forza, uguale al peso, ha sul corpo lo stesso effetto di tutte le forze sui singoli pezzetti, anche per il momento.

Per questo un corpo appoggiato o appeso nel suo baricentro resta in equilibrio in qualunque posizione: rispetto a $G$ il peso ha braccio nullo, e non fa ruotare il corpo. Un righello si tiene in equilibrio sul dito proprio sotto il suo centro.

## Il baricentro dei corpi simmetrici

In un corpo omogeneo, fatto dello stesso materiale in ogni sua parte, il baricentro sta su ogni asse di simmetria e nel centro di simmetria, se c'è:

- in un'asta, un rettangolo o un parallelepipedo, nel centro, dove si incontrano le diagonali;
- in un cerchio, un anello o una sfera, nel centro;
- in un triangolo, nel punto in cui si incontrano le tre mediane, che la geometria chiama anch'esso baricentro (vedi [Punti notevoli del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/punti-notevoli-del-triangolo)).

```tikz
% nome: baricentro-figure-simmetriche
% alt: Tre lamine omogenee con il loro baricentro G: un rettangolo, con G nel punto in cui si incontrano le diagonali tratteggiate; un anello, con G nel centro, dove non c'è materiale; un triangolo, con G nel punto in cui si incontrano le tre mediane tratteggiate
% svg: baricentro-figure-simmetriche-6a7d9eba.svg 322x85
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) rectangle (2.4,1.6);
\draw[dashed, thin] (0,0) -- (2.4,1.6);
\draw[dashed, thin] (0,1.6) -- (2.4,0);
\fill (1.2,0.8) circle (1.5pt);
\node[below] at (1.2,0.72) {$G$};
\draw[thick, fill=blue!10, even odd rule] (4,0.8) circle (0.85) (4,0.8) circle (0.5);
\fill (4,0.8) circle (1.5pt);
\node[below] at (4,0.72) {$G$};
\draw[thick, fill=blue!10] (5.6,0) -- (8.4,0) -- (6.4,2.1) -- cycle;
\draw[dashed, thin] (5.6,0) -- (7.4,1.05);
\draw[dashed, thin] (8.4,0) -- (6,1.05);
\draw[dashed, thin] (6.4,2.1) -- (7,0);
\fill (6.8,0.7) circle (1.5pt);
\node at (6.55,0.3) {$G$};
\end{tikzpicture}
```

Il baricentro di un anello è nel centro, dove non c'è materiale: il baricentro non sta sempre dentro il corpo. Succede anche per un boomerang, un ferro di cavallo, una sedia, una persona piegata in avanti.

## Il baricentro per sospensione

Il baricentro di una lamina di forma qualunque si trova appendendola. Una lamina appesa a un chiodo, ferma, è in equilibrio sotto due forze, il peso applicato in $G$ e la forza del chiodo: perché non formino una coppia devono stare sulla stessa retta, quindi il baricentro è sulla verticale che passa per il chiodo.

1. Appendi la lamina a un chiodo per un punto $A$ vicino al bordo, lasciala libera di ruotare e aspetta che sia ferma.
2. Appendi allo stesso chiodo un filo a piombo e segna sulla lamina la retta del filo, la verticale per $A$.
3. Appendi la lamina per un altro punto $B$ e segna la nuova verticale.
4. Il baricentro $G$ è il punto in cui le due rette si incontrano. Appendendola per un terzo punto, la terza verticale passa anch'essa per $G$.

```tikz
% nome: baricentro-per-sospensione
% alt: Una lamina di forma irregolare appesa a un chiodo nel punto A, con un filo a piombo appeso allo stesso chiodo: la verticale per A è tratteggiata sulla lamina; un'altra retta tratteggiata, segnata quando la lamina era appesa per il punto B, incontra la prima nel baricentro G, che si trova sotto il chiodo
% svg: baricentro-per-sospensione-81d5654d.svg 137x139
\begin{tikzpicture}
\draw[thick, fill=blue!10] (-1.318,-1.247) -- (1.050,-0.755) -- (1.543,0.589) -- (0.084,1.274) -- (-1.164,0.571) -- cycle;
\draw[dashed, thin] (0,1.067) -- (0,-1.25);
\draw[dashed, thin] (-1.189,-0.160) -- (1.474,0.198);
\draw (0,1.067) -- (0,-1.75);
\fill (0,-1.85) circle (2.5pt);
\fill (0,0) circle (1.5pt);
\node[below left] at (-0.03,-0.03) {$G$};
\draw[thick, fill=white] (1.177,0.158) circle (2pt);
\node[above] at (1.2,0.22) {$B$};
\draw[thick, fill=white] (0,1.067) circle (2pt);
\node[above right] at (0.05,1.1) {$A$};
\node[right] at (0.1,-1.75) {\small filo a piombo};
\end{tikzpicture}
```

## Il baricentro di due corpi

Il baricentro di due corpi uniti, come i due pesi di un manubrio o i due bambini su un'altalena, sta sul segmento che unisce i loro baricentri, più vicino al corpo più pesante. È il punto in cui un fulcro terrebbe il sistema in equilibrio, e l'equilibrio dei momenti della lezione [L'equilibrio di un corpo rigido](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-corpo-rigido) dice dove: se $d_1$ e $d_2$ sono le distanze di $G$ dai baricentri dei due corpi, di peso $P_1$ e $P_2$,

$$P_1 \cdot d_1 = P_2 \cdot d_2$$

Con un'ascissa lungo il segmento, se i due baricentri sono in $x_1$ e $x_2$, il baricentro dei due corpi è in

$$x_G = \frac{P_1 x_1 + P_2 x_2}{P_1 + P_2}$$

Il peso è proporzionale alla massa, quindi nelle due formule si possono mettere le masse al posto dei pesi.

```ad-example
Esempio 1: il manubrio
Un manubrio ha un disco di $2{,}0\,\text{kg}$ a un'estremità e uno di $3{,}0\,\text{kg}$ all'altra; i centri dei dischi sono a $1{,}0\,\text{m}$ l'uno dall'altro, e la sbarra ha massa trascurabile. Dove si trova il baricentro?

```tikz
% nome: baricentro-manubrio
% alt: Una sbarra orizzontale con un disco di 2,0 chilogrammi a sinistra e uno di 3,0 chilogrammi a destra, a 1,0 metri di distanza; il baricentro G è sulla sbarra a 0,60 metri dal disco di sinistra e a 0,40 metri da quello di destra; distanze in scala, 5 centimetri per metro
% svg: baricentro-manubrio-381e610f.svg 234x91
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,-0.05) rectangle (5,0.05);
\draw[thick, fill=blue!10] (-0.15,-0.5) rectangle (0.15,0.5);
\draw[thick, fill=blue!10] (4.8,-0.6) rectangle (5.2,0.6);
\fill (3,0) circle (1.5pt);
\node[above] at (3,0.08) {$G$};
\node[below] at (0,-0.55) {\small $2{,}0$ kg};
\node[below] at (5,-0.65) {\small $3{,}0$ kg};
\draw[|-|, thin] (0,-1.2) -- (3,-1.2);
\node[below] at (1.5,-1.2) {\small $0{,}60$ m};
\draw[|-|, thin] (3,-1.2) -- (5,-1.2);
\node[below] at (4,-1.2) {\small $0{,}40$ m};
\end{tikzpicture}
```

Con l'ascissa che parte dal disco di $2{,}0\,\text{kg}$, i due baricentri sono in $x_1 = 0$ e $x_2 = 1{,}0\,\text{m}$, e con le masse al posto dei pesi

$$x_G = \frac{2{,}0\,\text{kg} \cdot 0 + 3{,}0\,\text{kg} \cdot 1{,}0\,\text{m}}{2{,}0\,\text{kg} + 3{,}0\,\text{kg}} = \frac{3{,}0\,\text{kg} \cdot \text{m}}{5{,}0\,\text{kg}} = 0{,}60\,\text{m}$$

Il baricentro è a $0{,}60\,\text{m}$ dal disco leggero e a $0{,}40\,\text{m}$ da quello pesante. Il controllo con i momenti: $2{,}0 \cdot 0{,}60 = 1{,}2$ e $3{,}0 \cdot 0{,}40 = 1{,}2$.
```

```ad-warning
Il baricentro sta vicino al corpo più pesante
Le distanze sono in proporzione inversa ai pesi: il corpo più pesante ha la distanza più piccola. Nell'esempio 1 mettere $G$ a $0{,}60\,\text{m}$ dal disco di $3{,}0\,\text{kg}$ è l'errore più comune, e lo si scopre con il controllo dei momenti.
```

Lo stesso metodo vale per una lamina fatta di pezzi semplici: ogni pezzo ha il suo baricentro nel centro e un peso proporzionale alla sua area, se la lamina è omogenea, e si combinano i pezzi con la formula di $x_G$, una volta per l'ascissa e una per l'ordinata.

```ad-example
Esempio 2: una lamina a forma di L
Una lamina omogenea a forma di L è fatta di un rettangolo orizzontale di $40\,\text{cm} \times 10\,\text{cm}$ e di un rettangolo verticale di $10\,\text{cm} \times 30\,\text{cm}$, sopra l'estremità sinistra del primo. Dove si trova il baricentro?

```tikz
% nome: baricentro-lamina-a-elle
% alt: Una lamina a forma di L negli assi cartesiani: un rettangolo orizzontale lungo 40 e alto 10 centimetri, con il baricentro G1 in (20, 5), e sopra la sua parte sinistra un rettangolo verticale largo 10 e alto 30 centimetri, con il baricentro G2 in (5, 25); il baricentro G della lamina è sul segmento tratteggiato G1 G2, in circa (14, 14), fuori dalla lamina; scala di 1 centimetro per 10 centimetri
% svg: baricentro-lamina-a-elle-8d81011f.svg 215x195
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (4.6,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,4.4) node[left] {$y$};
\draw[thick, fill=blue!10] (0,0) -- (4,0) -- (4,1) -- (1,1) -- (1,4) -- (0,4) -- cycle;
\draw[thin] (0,1) -- (1,1);
\draw[dashed, thin] (2,0.5) -- (0.5,2.5);
\fill (2,0.5) circle (1.5pt);
\node[right] at (2.05,0.5) {$G_1$};
\fill (0.5,2.5) circle (1.5pt);
\node[right] at (0.55,2.5) {$G_2$};
\fill (1.357,1.357) circle (1.5pt);
\node[above right] at (1.37,1.37) {$G$};
\node[below] at (4,0) {\small $40$};
\node[left] at (0,4) {\small $30$};
\node[left] at (0,1) {\small $10$};
\node[below] at (1,0) {\small $10$};
\end{tikzpicture}
```

Con gli assi della figura, in centimetri, il rettangolo orizzontale ha area $400\,\text{cm}^2$ e il baricentro $G_1$ in $(20, 5)$; quello verticale, alto $30\,\text{cm}$ da $y = 10$ a $y = 40$, ha area $300\,\text{cm}^2$ e il baricentro $G_2$ in $(5, 25)$. I pesi sono proporzionali alle aree, quindi

$$x_G = \frac{400 \cdot 20 + 300 \cdot 5}{400 + 300}\,\text{cm} = \frac{9500}{700}\,\text{cm} \approx 14\,\text{cm}$$

$$y_G = \frac{400 \cdot 5 + 300 \cdot 25}{400 + 300}\,\text{cm} = \frac{9500}{700}\,\text{cm} \approx 14\,\text{cm}$$

Il baricentro è in circa $(14, 14)$, sul segmento $G_1 G_2$ e fuori dalla lamina, nell'angolo della L. La lamina appoggiata su una punta in quel punto non starebbe in equilibrio, perché lì non c'è materiale; appesa per un punto qualunque, invece, si ferma con $G$ sulla verticale del chiodo.
```

## Equilibrio stabile, instabile e indifferente

Un corpo in equilibrio può reagire in tre modi a una piccola spinta che lo sposta:

- l'equilibrio è **stabile** se il corpo, spostato di poco, torna da solo nella posizione di prima;
- è **instabile** se il corpo, spostato di poco, se ne allontana sempre di più;
- è **indifferente** se il corpo resta in equilibrio anche nella nuova posizione.

Per un corpo appeso a un perno decide la posizione del baricentro rispetto al perno.

```tikz
% nome: equilibrio-stabile-instabile-indifferente
% alt: Tre aste uguali appese a un perno. Nella prima il perno è sopra il baricentro G: equilibrio stabile. Nella seconda il perno è sotto il baricentro: equilibrio instabile. Nella terza il perno è nel baricentro: equilibrio indifferente
% svg: equilibrio-stabile-instabile-indifferente-d9b735f8.svg 249x116
\begin{tikzpicture}
\draw[thick, fill=blue!10] (-0.15,-1.2) rectangle (0.15,1.2);
\draw[thick, fill=white] (0,0.9) circle (2pt);
\fill (0,0) circle (1.5pt);
\node[right] at (0.2,0) {$G$};
\node[below] at (0,-1.3) {\small stabile};
\draw[thick, fill=blue!10] (2.35,-1.2) rectangle (2.65,1.2);
\draw[thick, fill=white] (2.5,-0.9) circle (2pt);
\fill (2.5,0) circle (1.5pt);
\node[right] at (2.7,0) {$G$};
\node[below] at (2.5,-1.3) {\small instabile};
\draw[thick, fill=blue!10] (4.85,-1.2) rectangle (5.15,1.2);
\draw[thick, fill=white] (5,0) circle (2pt);
\node[right] at (5.2,0) {$G$};
\node[below] at (5,-1.3) {\small indifferente};
\end{tikzpicture}
```

- Se il perno è sopra il baricentro, spostando il corpo di lato il peso, applicato in $G$, acquista un braccio rispetto al perno e un momento che riporta $G$ sotto il perno: l'equilibrio è stabile. È il caso del pendolo, di una lampada appesa, di un quadro.
- Se il perno è sotto il baricentro, lo spostamento dà al peso un momento che allontana ancora di più $G$ dalla verticale del perno, e il corpo si capovolge: l'equilibrio è instabile.
- Se il perno è nel baricentro, il peso ha sempre braccio nullo e il corpo sta fermo in qualunque posizione: l'equilibrio è indifferente, come per una ruota di bicicletta sul suo asse.

Lo stesso vale per una pallina appoggiata: in fondo a una scodella è in equilibrio stabile, in cima a una cupola in equilibrio instabile, su un tavolo orizzontale in equilibrio indifferente. Nell'equilibrio stabile il baricentro, dopo lo spostamento, si trova più in alto di prima; in quello instabile più in basso; in quello indifferente alla stessa altezza.

## I corpi appoggiati e il ribaltamento

Un corpo appoggiato su un piano lo tocca in uno o più punti: i quattro piedi di una sedia, i due piedi di una persona, tutta la faccia inferiore di una scatola. La **base d'appoggio** è il poligono che ha per vertici i punti di appoggio più esterni: per il tavolo è il rettangolo che ha per vertici le gambe, per una persona in piedi la zona che comprende i due piedi e lo spazio tra loro.

Un corpo appoggiato su un piano orizzontale è in equilibrio se la verticale che passa per il suo baricentro cade dentro la base d'appoggio. Se cade fuori, il peso ha un momento rispetto al bordo della base, e il corpo si ribalta.

Quando un corpo viene inclinato e resta appoggiato su uno spigolo, succede lo stesso. Finché la verticale del baricentro cade dalla parte della base, il peso ha un momento che lo riporta giù sulla base; quando la verticale supera lo spigolo, il momento cambia verso e il corpo cade dall'altra parte.

```tikz
% nome: ribaltamento-verticale-baricentro
% alt: Due blocchi uguali, alti il doppio della loro larghezza, inclinati verso destra e appoggiati sullo spigolo in basso a destra. Il primo, inclinato di 15 gradi, ha la verticale del baricentro, tratteggiata, che cade a sinistra dello spigolo, dalla parte della base: il blocco torna indietro. Il secondo, inclinato di 35 gradi, ha la verticale del baricentro che cade a destra dello spigolo, fuori dalla base: il blocco si ribalta
% svg: ribaltamento-verticale-baricentro-cd661a14.svg 277x124
\begin{tikzpicture}
\draw[thick] (-0.2,0) -- (7,0);
\foreach \x in {-0.05,0.1,...,7} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0.234,0.259) -- (1.2,0) -- (1.718,1.932) -- (0.752,2.191) -- cycle;
\fill (0.976,1.095) circle (1.5pt);
\node[left] at (0.93,1.12) {$G$};
\draw[dashed, thin] (0.976,1.095) -- (0.976,-0.35);
\draw[-{Stealth}, thin] (2.548,1.925) arc[start angle=55, end angle=78, radius=2.35];
\node[below] at (1.1,-0.4) {\small torna indietro};
\draw[thick, fill=blue!10] (3.781,0.574) -- (4.6,0) -- (5.747,1.638) -- (4.928,2.212) -- cycle;
\fill (4.764,1.106) circle (1.5pt);
\node[left] at (4.72,1.13) {$G$};
\draw[dashed, thin] (4.764,1.106) -- (4.764,-0.35);
\draw[-{Stealth}, thin] (6.110,1.800) arc[start angle=50, end angle=22, radius=2.35];
\node[below] at (4.8,-0.4) {\small si ribalta};
\end{tikzpicture}
```

Un corpo è tanto più stabile quanto più larga è la base d'appoggio e quanto più basso è il baricentro: così lo si deve inclinare di più prima che la verticale del baricentro esca dalla base. Per questo le auto da corsa sono basse e larghe, un camion con il carico alto si ribalta in curva più facilmente, e chi sta in piedi su un autobus allarga le gambe.

```ad-warning
Conta la verticale del baricentro
Il baricentro non sta "dentro la base": sta dentro il corpo, sopra la base. Quello che deve cadere dentro la base d'appoggio è la verticale che passa per il baricentro. E la base d'appoggio non è solo la superficie che tocca il piano: un tavolo a quattro gambe ha per base tutto il rettangolo tra le gambe.
```

Nella figura qui sotto puoi inclinare un blocco sul suo spigolo e lasciarlo andare, e cambiare la sua larghezza e la sua altezza.

```interattivo
% nome: blocco-ribaltamento
% alt: Un blocco appoggiato a terra che si inclina intorno al suo spigolo in basso a destra, con un cursore o trascinandone lo spigolo in alto; il baricentro G è segnato con la sua verticale tratteggiata; un bottone lascia andare il blocco, che torna sulla base se la verticale del baricentro cade dentro la base e si ribalta sul fianco se cade fuori; due cursori cambiano la larghezza e l'altezza del blocco, e sotto si leggono l'inclinazione e l'angolo oltre il quale il blocco si ribalta
```

```ad-example
Esempio 3: di quanto si può inclinare un armadio
Un armadio pieno, che si può considerare omogeneo, è largo $0{,}60\,\text{m}$ e alto $1{,}6\,\text{m}$. Due traslocatori lo inclinano appoggiandolo su uno spigolo della base. Oltre quale angolo di inclinazione l'armadio cade dall'altra parte, se lo lasciano andare?

```tikz
% nome: ribaltamento-angolo-limite
% alt: Un armadio visto di fianco, largo 0,60 metri e alto 1,6 metri, inclinato sullo spigolo della base fino all'angolo limite: il baricentro G, nel centro, è esattamente sopra lo spigolo, e la retta che va dallo spigolo al baricentro è verticale; l'angolo tra questa retta e il fianco dell'armadio è uguale all'angolo di inclinazione
% svg: ribaltamento-angolo-limite-c923e6cd.svg 131x139
\begin{tikzpicture}[scale=1.4]
\draw[thick] (-1.2,0) -- (1.2,0);
\foreach \x in {-1.05,-0.9,...,1.2} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (-0.702,0.263) -- (0,0) -- (0.702,1.873) -- (0,2.136) -- cycle;
\draw[dashed, thin] (0,0) -- (0,2.4);
\fill (0,1.068) circle (1.5pt);
\node[left] at (-0.03,1.15) {$G$};
\draw[thin] (0,0.7) arc[start angle=90, end angle=69.44, radius=0.7];
\node at (0.17,0.95) {\small $\theta$};
\end{tikzpicture}
```

Il baricentro è nel centro dell'armadio, nel punto in cui si incontrano le diagonali. L'armadio torna indietro finché la verticale del baricentro cade dalla parte della base, e cade quando la supera: l'angolo limite è quello per cui il baricentro è esattamente sopra lo spigolo. In quella posizione la diagonale che va dallo spigolo al baricentro è verticale, e l'angolo $\theta$ di cui l'armadio è inclinato è l'angolo tra la diagonale e il fianco. Nel triangolo rettangolo che ha per cateti metà della larghezza e metà dell'altezza,

$$\tan\theta = \frac{0{,}30\,\text{m}}{0{,}80\,\text{m}} = 0{,}375 \quad\Rightarrow\quad \theta = \tan^{-1} 0{,}375 \approx 21^\circ$$

con la funzione inversa della calcolatrice, come nella lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore). Oltre circa $21^\circ$ l'armadio cade. Un armadio più basso o più largo si potrebbe inclinare di più.
```

```ad-example
Esempio 4: i mattoni sul bordo del tavolo
Un mattone lungo $24\,\text{cm}$ è appoggiato sul tavolo, e sporge oltre il bordo. Quanto può sporgere al massimo senza cadere? Sopra c'è un secondo mattone uguale, che sporge oltre il primo: quanto può sporgere in tutto la pila di due mattoni?

```tikz
% nome: baricentro-mattoni-sporgenti
% alt: Il bordo di un tavolo con due mattoni uguali lunghi 24 centimetri, uno sopra l'altro, che sporgono verso destra: il mattone in basso sporge di 6 centimetri oltre il bordo del tavolo, quello in alto di 12 centimetri oltre il mattone in basso; il baricentro del mattone in alto è sulla verticale del bordo del mattone sotto, e il baricentro dei due mattoni insieme sulla verticale del bordo del tavolo; scala di 1 centimetro per 10 centimetri
% svg: baricentro-mattoni-sporgenti-af53cab1.svg 186x110
\begin{tikzpicture}
\draw[thick] (-3,0) -- (0,0) -- (0,-0.8);
\foreach \x in {-2.85,-2.7,...,0} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=orange!25] (-1.8,0) rectangle (0.6,0.4);
\draw[thick, fill=orange!25] (-0.6,0.4) rectangle (1.8,0.8);
\draw[dashed, thin] (0.6,0.6) -- (0.6,1.3);
\fill (0.6,0.6) circle (1.5pt);
\node[right] at (0.62,1.2) {\small $G_2$};
\draw[dashed, thin] (0,0.4) -- (0,1.3);
\fill (0,0.4) circle (1.5pt);
\node[left] at (-0.02,1.2) {\small $G$};
\draw[|-|, thin] (0,-0.4) -- (0.6,-0.4);
\node[below] at (0.45,-0.45) {\small $6$ cm};
\draw[|-|, thin] (0.6,1.5) -- (1.8,1.5);
\node[above] at (1.2,1.5) {\small $12$ cm};
\end{tikzpicture}
```

Un mattone solo ha il baricentro nel centro, a $12\,\text{cm}$ dalle estremità. Resta sul tavolo finché la verticale del baricentro cade sul tavolo, quindi può sporgere al massimo di $12\,\text{cm}$, metà della sua lunghezza.

Con due mattoni, quello in alto può sporgere di $12\,\text{cm}$ oltre quello in basso, per la stessa ragione. I due mattoni insieme hanno il baricentro a metà tra i due baricentri, perché pesano uguale, e sono in equilibrio sul tavolo se questo baricentro è sopra il tavolo. Con il bordo del mattone basso come origine delle ascisse, il baricentro del mattone basso è in $-12\,\text{cm}$ e quello del mattone alto in $0$, quindi il baricentro dei due è in $-6\,\text{cm}$: il bordo del tavolo può stare lì, e il mattone basso sporge di $6\,\text{cm}$. In tutto la pila sporge di $12 + 6 = 18\,\text{cm}$, tre quarti di un mattone.
```
