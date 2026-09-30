# Il lavoro di una forza

Nel linguaggio di tutti i giorni "lavoro" è qualunque fatica: studiare, reggere una borsa pesante, stare in piedi per ore. In fisica la parola ha un significato più stretto e misurabile: una forza compie lavoro quando il corpo su cui agisce si sposta, e il lavoro è tanto più grande quanto più grande è la forza e quanto più lungo è lo spostamento nella direzione della forza. Chi spinge un carrello lungo un corridoio compie lavoro; chi regge una valigia fermo in stazione, per quanto si stanchi, no.

## Forza e spostamento nella stessa direzione

Quando una forza costante $\vec{F}$ agisce su un corpo che si sposta di $\vec{s}$ nella stessa direzione e nello stesso verso della forza, il **lavoro** della forza è il prodotto del modulo della forza per il modulo dello spostamento:

$$W = F \cdot s$$

Il lavoro è una [grandezza scalare](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/grandezze-scalari-e-grandezze-vettoriali): un numero con la sua unità, senza direzione. Nel Sistema Internazionale si misura in newton per metro, un'unità che ha un nome proprio, il **joule** (J), da James Prescott Joule:

$$1\,\text{J} = 1\,\text{N} \cdot 1\,\text{m}$$

Un joule è il lavoro di una forza di $1\,\text{N}$ che sposta il suo punto di applicazione di $1\,\text{m}$ nella sua direzione: più o meno il lavoro che fai sollevando una mela di $100\,\text{g}$ di un metro.

```ad-example
Esempio 1: un carrello spinto
Spingi un carrello della spesa con una forza orizzontale di $40\,\text{N}$ lungo un corridoio dritto di $5{,}0\,\text{m}$. Quanto lavoro compie la tua forza?

Forza e spostamento hanno la stessa direzione e lo stesso verso:

$$W = F \cdot s = 40\,\text{N} \cdot 5{,}0\,\text{m} = 2{,}0 \cdot 10^2\,\text{J}$$

Il risultato si scrive in notazione scientifica per non dare a $200$ tre cifre significative: i dati ne hanno due.
```

## Forza inclinata rispetto allo spostamento

Una cassa trascinata sul pavimento con una fune inclinata si sposta in orizzontale, ma la fune tira verso l'alto e in avanti. Solo una parte della forza serve a spostare la cassa: la sua componente lungo lo spostamento. La si trova scomponendo la forza, come nella lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore), lungo la direzione dello spostamento (l'asse $x$) e perpendicolarmente a essa (l'asse $y$). Se $\alpha$ è l'angolo tra la forza e lo spostamento:

$$F_x = F\cos\alpha \qquad F_y = F\sin\alpha$$

```tikz
% nome: cassa-fune-componenti-lavoro
% alt: Una cassa sul pavimento tirata da una fune inclinata di un angolo alfa rispetto all'orizzontale. La forza F della fune parte dal lato destro della cassa lungo la fune; le sue componenti tratteggiate sono F x, orizzontale e in avanti, evidenziata in arancione, e F y, verticale verso l'alto. Sotto il pavimento una freccia blu indica lo spostamento s della cassa, orizzontale verso destra
% svg: cassa-fune-componenti-lavoro-59c2df0b.svg 216x104
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0.6,0) rectangle ++(1.2,0.7);
\draw (1.8,0.35) -- (4.6,1.9666);
\draw[dashed, thin] (3.5321,1.35) -- (3.5321,0.35);
\draw[dashed, thin] (3.5321,1.35) -- (1.8,1.35);
\draw[-{Stealth}, thick, orange!90!black, dashed] (1.8,0.35) -- (3.5321,0.35) node[right] {$\vec{F}_x$};
\draw[-{Stealth}, thick, red, dashed] (1.8,0.35) -- (1.8,1.35) node[left] {$\vec{F}_y$};
\draw[-{Stealth}, thick, red] (1.8,0.35) -- (3.5321,1.35) node[above left] {$\vec{F}$};
\draw (2.4,0.35) arc[start angle=0, end angle=30, radius=0.6];
\node at (2.62,0.57) {\small $\alpha$};
\draw[-{Stealth}, thick, blue] (0.6,-0.45) -- (3.6,-0.45) node[right] {$\vec{s}$};
\end{tikzpicture}
```

La componente $F_y$ è perpendicolare allo spostamento e non sposta la cassa né in avanti né indietro; il lavoro lo fa tutto $F_x$. Il lavoro di una forza costante è quindi

$$W = F_x \cdot s = F \, s \cos\alpha$$

dove $\alpha$ è l'angolo tra la forza e lo spostamento. Con $\alpha = 0^\circ$ si ha $\cos 0^\circ = 1$, e si ritrova $W = F \cdot s$.

```ad-warning
L'angolo va misurato dallo spostamento
Nella formula $W = F\,s\cos\alpha$ l'angolo è quello tra la forza e lo spostamento. Se il testo dà l'angolo tra la fune e la verticale, l'angolo giusto è il complementare, $90^\circ$ meno quello dato; usare l'angolo sbagliato scambia il coseno con il seno.
```

```ad-example
Esempio 2: la cassa tirata con la fune
Una cassa viene trascinata per $8{,}0\,\text{m}$ sul pavimento con una fune inclinata di $30^\circ$ rispetto all'orizzontale, che tira con una forza di $50\,\text{N}$. Quanto lavoro compie la forza della fune?

$$W = F\,s\cos\alpha = 50\,\text{N} \cdot 8{,}0\,\text{m} \cdot \cos 30^\circ = 346{,}4\ldots\,\text{J} \approx 3{,}5 \cdot 10^2\,\text{J}$$

Se la fune fosse orizzontale la stessa forza compirebbe $50 \cdot 8{,}0 = 400\,\text{J}$: la parte verticale della forza non fa lavoro.
```

## Lavoro positivo, negativo e nullo

Il coseno di un angolo tra $0^\circ$ e $180^\circ$ può essere positivo, nullo o negativo, e con lui il lavoro. Il segno dice se la forza aiuta il moto o lo ostacola.

```tikz
% nome: segno-lavoro-tre-casi
% alt: Tre coppie di frecce affiancate, ognuna con lo spostamento s orizzontale verso destra, in blu, e una forza F, in rosso, che parte dallo stesso punto. Nella prima la forza forma con lo spostamento un angolo acuto alfa e sotto è scritto W maggiore di zero; nella seconda la forza è perpendicolare allo spostamento, con il segno dell'angolo retto, e sotto è scritto W uguale a zero; nella terza la forza forma un angolo ottuso e punta all'indietro, e sotto è scritto W minore di zero
% svg: segno-lavoro-tre-casi-3d172d6c.svg 316x101
\begin{tikzpicture}
\draw[-{Stealth}, thick, blue] (0,0) -- (1.6,0) node[right] {$\vec{s}$};
\draw[-{Stealth}, thick, red] (0,0) -- (0.919,0.771) node[above right] {$\vec{F}$};
\draw (0.45,0) arc[start angle=0, end angle=40, radius=0.45];
\node at (0.66,0.24) {\small $\alpha$};
\fill (0,0) circle (1.5pt);
\node at (0.8,-0.55) {$W > 0$};
\draw[-{Stealth}, thick, blue] (2.8,0) -- (4.4,0) node[right] {$\vec{s}$};
\draw[-{Stealth}, thick, red] (2.8,0) -- (2.8,1.2) node[above] {$\vec{F}$};
\draw (3.0,0) -- (3.0,0.2) -- (2.8,0.2);
\fill (2.8,0) circle (1.5pt);
\node at (3.6,-0.55) {$W = 0$};
\draw[-{Stealth}, thick, blue] (6.2,0) -- (7.8,0) node[right] {$\vec{s}$};
\draw[-{Stealth}, thick, red] (6.2,0) -- (5.281,0.771) node[above left] {$\vec{F}$};
\draw (6.55,0) arc[start angle=0, end angle=140, radius=0.35];
\node at (6.4,0.58) {\small $\alpha$};
\fill (6.2,0) circle (1.5pt);
\node at (6.6,-0.55) {$W < 0$};
\end{tikzpicture}
```

| Angolo tra forza e spostamento | $\cos\alpha$ | Lavoro | Esempio |
|---|---|---|---|
| $0^\circ \le \alpha < 90^\circ$ | positivo | positivo, **lavoro motore** | la spinta sul carrello |
| $\alpha = 90^\circ$ | zero | nullo | il peso di un corpo che si sposta in orizzontale |
| $90^\circ < \alpha \le 180^\circ$ | negativo | negativo, **lavoro resistente** | l'attrito su un corpo che scivola |

Una forza perpendicolare allo spostamento non compie lavoro, per quanto grande sia. Non lo compiono il peso e la reazione del pavimento su una cassa trascinata in orizzontale, e non lo compie la [forza centripeta](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/la-forza-centripeta) su un corpo in moto circolare uniforme, che è sempre perpendicolare alla velocità.

```ad-warning
Fatica non vuol dire lavoro
Reggere una valigia fermo, o portarla a mano camminando in piano, stanca, ma la forza della mano sulla valigia non compie lavoro: nel primo caso lo spostamento è zero, nel secondo la forza è verticale e lo spostamento orizzontale. I muscoli consumano energia per restare contratti, ma questo non è il lavoro della forza sulla valigia.
```

Nella figura qui sotto cambi l'angolo della fune e la forza, e guardi quanto della forza va lungo lo spostamento: la componente utile, in arancione, si accorcia al crescere dell'angolo, sparisce a $90^\circ$ e oltre punta all'indietro. Con il bottone la cassa percorre i suoi $4{,}0\,\text{m}$ e il lavoro si accumula metro dopo metro.

```interattivo
% nome: cassa-fune-lavoro
% alt: Una cassa sul pavimento tirata da una fune; due cursori cambiano l'angolo tra la fune e l'orizzontale, da 0 a 180 gradi, e il modulo della forza, fino a 100 newton. Dalla cassa parte la forza con le sue componenti tratteggiate, quella lungo lo spostamento evidenziata in arancione; sotto il pavimento la freccia dello spostamento di 4 metri. Sotto la figura sono scritti la componente utile e il lavoro, positivo sotto i 90 gradi, nullo a 90 gradi e negativo oltre; un bottone fa scorrere la cassa di 4 metri e il lavoro cresce con lo spostamento
```

## Il lavoro del peso

Il [peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa) $P = m g$ è verticale e verso il basso. Quando un corpo scende di un'altezza $h$ in verticale, peso e spostamento hanno la stessa direzione e lo stesso verso, e il lavoro del peso è positivo; quando sale, hanno versi opposti ($\alpha = 180^\circ$, $\cos\alpha = -1$) e il lavoro è negativo:

$$W_P = m g h \ \text{(in discesa)} \qquad W_P = -m g h \ \text{(in salita)}$$

Lo stesso vale lungo un piano inclinato. Se un corpo scende lungo il piano di un tratto $s$, l'angolo tra il peso e lo spostamento è $90^\circ - \alpha$, e $\cos(90^\circ - \alpha) = \sin\alpha$; ma $s\sin\alpha$ è proprio l'altezza $h$ di cui il corpo si abbassa:

$$W_P = m g \, s\cos(90^\circ - \alpha) = m g \, s\sin\alpha = m g h$$

```tikz
% nome: lavoro-peso-piano-inclinato
% alt: Un blocco su un piano inclinato di un angolo alfa. Dal centro del blocco partono il peso P, verticale verso il basso, in rosso, e lo spostamento s, lungo il piano verso il basso, in blu. Una linea tratteggiata orizzontale dalla punta dello spostamento al peso chiude un triangolo rettangolo, il cui cateto verticale, lungo il peso, è l'altezza h di cui il blocco scende
% svg: lavoro-peso-piano-inclinato-2a36d33f.svg 178x100
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (4.3,0);
\foreach \x in {-0.15,0,...,4.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- (4,0) -- (4,2.309) -- cycle;
\draw (0.6,0) arc[start angle=0, end angle=30, radius=0.6];
\node at (0.85,0.22) {\small $\alpha$};
\draw[thick, fill=blue!10, rotate around={30:(3.0311,1.75)}] (2.6311,1.75) rectangle ++(0.8,0.5);
\draw[dashed, thin] (1.1741,0.9665) -- (2.9061,0.9665);
\draw[-{Stealth}, thick, red] (2.9061,1.9665) -- (2.9061,0.6665) node[below] {$\vec{P}$};
\draw[-{Stealth}, thick, blue] (2.9061,1.9665) -- (1.1741,0.9665) node[above left] {$\vec{s}$};
\node[right] at (2.9061,1.4665) {$h$};
\fill (2.9061,1.9665) circle (1.5pt);
\end{tikzpicture}
```

Il lavoro del peso dipende solo da quanto il corpo scende o sale, non dalla strada che fa: scendere di $2\,\text{m}$ lungo una scala, uno scivolo o in caduta libera dà sempre $m g \cdot 2\,\text{m}$. Da qui nasce l'energia potenziale gravitazionale, nella lezione [Energia potenziale gravitazionale ed elastica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/energia-potenziale-gravitazionale-ed-elastica).

```ad-warning
La massa non è il peso
Nel lavoro del peso la forza è $m g$, in newton: moltiplicare la massa in chilogrammi per l'altezza dà un numero $9{,}8$ volte troppo piccolo, e in un'unità che non è il joule. E lungo il piano inclinato l'altezza è $h$, non la lunghezza $s$ del tratto percorso.
```

```ad-example
Esempio 3: il lavoro del peso in discesa e in salita
Un libro di $2{,}0\,\text{kg}$ cade da un tavolo alto $1{,}5\,\text{m}$. Poi uno scatolone di $12\,\text{kg}$ viene portato su per le scale, al piano di sopra, $3{,}0\,\text{m}$ più in alto. Quanto lavoro compie il peso in ciascun caso?

Il libro scende: il lavoro del peso è positivo.

$$W_P = m g h = 2{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 1{,}5\,\text{m} = 29{,}4\,\text{J} \approx 29\,\text{J}$$

Lo scatolone sale: il lavoro del peso è negativo, qualunque sia il percorso lungo le scale.

$$W_P = -m g h = -12\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 3{,}0\,\text{m} = -352{,}8\,\text{J} \approx -3{,}5 \cdot 10^2\,\text{J}$$
```

## Il lavoro dell'attrito

L'[attrito dinamico](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito) su un corpo che scivola è sempre opposto allo spostamento: $\alpha = 180^\circ$, e il suo lavoro è sempre negativo. Con la forza premente $F_\perp$:

$$W_{att} = -F_d \cdot s = -\mu_d \, F_\perp \, s$$

L'attrito toglie sempre qualcosa al moto: per questo, se nessuno spinge, un corpo che scivola rallenta fino a fermarsi. Che fine faccia quel lavoro lo racconta la lezione [Forze dissipative e conservazione dell'energia totale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/forze-dissipative-e-conservazione-dell-energia-totale).

```ad-example
Esempio 4: una cassa che scivola
Una cassa di $12\,\text{kg}$ scivola per $3{,}0\,\text{m}$ su un pavimento orizzontale; il coefficiente di attrito dinamico è $\mu_d = 0{,}30$. Quanto vale il lavoro dell'attrito?

Sul pavimento orizzontale la forza premente è il peso, $F_\perp = m g = 12 \cdot 9{,}8\,\text{N} = 117{,}6\,\text{N}$, e l'attrito vale

$$F_d = \mu_d \, F_\perp = 0{,}30 \cdot 117{,}6\,\text{N} = 35{,}28\,\text{N}$$

L'attrito è opposto allo spostamento:

$$W_{att} = -F_d \cdot s = -35{,}28\,\text{N} \cdot 3{,}0\,\text{m} = -105{,}8\ldots\,\text{J} \approx -1{,}1 \cdot 10^2\,\text{J}$$
```

## Il lavoro di più forze

Su un corpo agiscono di solito più forze insieme, e ognuna compie il suo lavoro. Il **lavoro totale** è la somma dei lavori delle singole forze, ciascuno con il suo segno:

$$W_{tot} = W_1 + W_2 + W_3 + \ldots$$

Si ottiene lo stesso numero calcolando il lavoro della forza totale $\vec F_{tot}$, la somma vettoriale delle forze, perché le componenti lungo lo spostamento si sommano. Il lavoro totale è quello che conta per la velocità del corpo, come mostra la lezione [L'energia cinetica e il teorema dell'energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica).

```ad-example
Esempio 5: la cassa con l'attrito
La cassa dell'esempio 2 ha una massa di $20\,\text{kg}$, e tra la cassa e il pavimento $\mu_d = 0{,}20$. Quanto vale il lavoro totale delle forze sulla cassa lungo gli $8{,}0\,\text{m}$?

Sulla cassa agiscono quattro forze: la forza della fune, il peso, la reazione del pavimento e l'attrito. Peso e reazione sono verticali, perpendicolari allo spostamento, e non compiono lavoro. La fune compie $W_F = 346{,}4\,\text{J}$, come nell'esempio 2.

Per l'attrito serve la forza premente. La fune tira anche verso l'alto, con $F_y = 50\,\text{N} \cdot \sin 30^\circ = 25\,\text{N}$, e alleggerisce la cassa sul pavimento, come nella lezione sull'attrito:

$$F_\perp = m g - F_y = 20 \cdot 9{,}8\,\text{N} - 25\,\text{N} = 171\,\text{N}$$

$$W_{att} = -\mu_d \, F_\perp \, s = -0{,}20 \cdot 171\,\text{N} \cdot 8{,}0\,\text{m} = -273{,}6\,\text{J}$$

Il lavoro totale:

$$W_{tot} = W_F + W_{att} = 346{,}4\,\text{J} - 273{,}6\,\text{J} = 72{,}8\,\text{J} \approx 73\,\text{J}$$

Controllo con la forza totale: lungo lo spostamento agiscono $F_x = 50 \cos 30^\circ = 43{,}30\,\text{N}$ in avanti e $34{,}2\,\text{N}$ di attrito all'indietro, e $(43{,}30 - 34{,}2)\,\text{N} \cdot 8{,}0\,\text{m} = 72{,}8\,\text{J}$.
```

```ad-warning
Il lavoro totale non è il lavoro di una forza sola
"Quanto lavoro compie la fune" e "quanto lavoro compiono in tutto le forze" sono due domande diverse: nell'esempio 5 le risposte sono $3{,}5 \cdot 10^2\,\text{J}$ e $73\,\text{J}$. E nella somma il lavoro dell'attrito entra con il meno: sommare i valori senza segno darebbe $620\,\text{J}$, un numero che non vuol dire niente.
```

## Il lavoro come area sotto il grafico

Su un grafico con lo spostamento $s$ in orizzontale e la forza $F$ (la componente lungo lo spostamento) in verticale, una forza costante è un segmento orizzontale all'altezza $F$. Il prodotto $F \cdot s$ è l'area del rettangolo che sta sotto il segmento, tra $0$ e $s$: il lavoro è l'area sotto il grafico forza-spostamento.

```tikz
% nome: grafico-forza-costante-area
% alt: Un grafico con lo spostamento s in orizzontale e la forza F in verticale. Una forza costante è un segmento orizzontale all'altezza F; il rettangolo sotto il segmento, tra zero e lo spostamento s, è colorato, e dentro è scritto W uguale a F per s
% svg: grafico-forza-costante-area-45f0dd47.svg 189x123
% poi-interattivo: trascinare la fine dello spostamento e l'altezza della forza e leggere l'area del rettangolo
\begin{tikzpicture}
\fill[orange!25] (0,0) rectangle (3,1.5);
\draw[->] (-0.3,0) -- (4,0) node[right] {$s$};
\draw[->] (0,-0.3) -- (0,2.3) node[above] {$F$};
\draw[thick, red] (0,1.5) -- (3.6,1.5);
\draw[dashed, thin] (3,0) -- (3,1.5);
\node[left] at (0,1.5) {$F$};
\node[below] at (3,0) {$s$};
\node at (1.5,0.75) {$W = F\,s$};
\end{tikzpicture}
```

L'area funziona anche quando la forza cambia durante lo spostamento, e allora la formula $F\,s\cos\alpha$ non si può usare. L'esempio più comune è una molla. Per allungare lentamente una molla di costante elastica $k$, la mano deve tirare con una forza uguale alla [forza elastica](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-elastica-e-la-legge-di-hooke), $F = k x$, dove $x$ è l'allungamento (il $\Delta l$ della legge di Hooke). La forza cresce da zero a $k x$, e il grafico è una retta che passa per l'origine: l'area sotto il grafico è un triangolo di base $x$ e altezza $k x$.

```tikz
% nome: grafico-molla-area-triangolo
% alt: Il grafico della forza che allunga una molla in funzione dell'allungamento x: una retta che parte dall'origine. Il triangolo sotto la retta, tra zero e l'allungamento x, dove la forza vale k per x, è colorato, e dentro è scritto un mezzo k x al quadrato
% svg: grafico-molla-area-triangolo-936f1a06.svg 205x161
% poi-interattivo: trascinare l'allungamento e guardare l'area del triangolo che cresce con il quadrato
\begin{tikzpicture}
\fill[orange!25] (0,0) -- (3,0) -- (3,2.25) -- cycle;
\draw[->] (-0.3,0) -- (4.2,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,3.3) node[above] {$F$};
\draw[thick, red] (0,0) -- (3.9,2.925);
\draw[dashed, thin] (3,0) -- (3,2.25) -- (0,2.25);
\node[left] at (0,2.25) {$k\,x$};
\node[below] at (3,0) {$x$};
\node at (2.05,0.6) {$\frac{1}{2}k\,x^2$};
\end{tikzpicture}
```

$$W = \frac{1}{2} \cdot x \cdot k x = \frac{1}{2} k \, x^2$$

Il lavoro per allungare la molla cresce con il quadrato dell'allungamento: per un allungamento doppio serve un lavoro quattro volte più grande, perché la forza, oltre a spostarsi il doppio, è in media il doppio. La forza elastica della molla, opposta allo spostamento della mano, compie intanto il lavoro opposto, $-\tfrac{1}{2}k\,x^2$.

```ad-warning
Allungamento in metri
Con $k$ in N/m l'allungamento va in metri: $5\,\text{cm}$ sono $0{,}05\,\text{m}$, e il quadrato è $0{,}0025\,\text{m}^2$. Lasciare i centimetri dà un lavoro $10\,000$ volte troppo grande.
```

```ad-example
Esempio 6: allungare una molla in due tempi
Una molla ha costante elastica $k = 200\,\text{N/m}$. Quanto lavoro serve per allungarla di $10\,\text{cm}$ partendo dalla lunghezza a riposo? E quanto per allungarla di altri $10\,\text{cm}$?

Da $0$ a $0{,}10\,\text{m}$ l'area è il triangolo:

$$W_1 = \frac{1}{2} k \, x^2 = \frac{1}{2} \cdot 200\,\text{N/m} \cdot (0{,}10\,\text{m})^2 = 1{,}0\,\text{J}$$

Da $0{,}10$ a $0{,}20\,\text{m}$ l'area è il trapezio tra i due allungamenti, cioè il triangolo grande meno quello piccolo:

$$W_2 = \frac{1}{2} \cdot 200 \cdot 0{,}20^2\,\text{J} - 1{,}0\,\text{J} = 4{,}0\,\text{J} - 1{,}0\,\text{J} = 3{,}0\,\text{J}$$

```tikz
% nome: grafico-molla-due-tratti
% alt: Il grafico della forza che allunga una molla di costante 200 newton al metro: una retta dall'origine fino a 40 newton a 0,20 metri. Il triangolo sotto la retta tra 0 e 0,10 metri, fino a 20 newton, è colorato in arancione, con scritto 1,0 joule; il trapezio tra 0,10 e 0,20 metri è colorato in blu, con scritto 3,0 joule
% svg: grafico-molla-due-tratti-cee3e6bc.svg 244x180
% poi-interattivo: scegliere i due allungamenti e leggere l'area del trapezio tra loro
\begin{tikzpicture}
\fill[orange!25] (0,0) -- (2,0) -- (2,1.5) -- cycle;
\fill[blue!15] (2,0) -- (4,0) -- (4,3) -- (2,1.5) -- cycle;
\draw[->] (-0.3,0) -- (4.6,0) node[right] {$x$ (m)};
\draw[->] (0,-0.3) -- (0,3.5) node[above] {$F$ (N)};
\draw[thick, red] (0,0) -- (4.3,3.225);
\draw[dashed, thin] (2,0) -- (2,1.5) -- (0,1.5);
\draw[dashed, thin] (4,0) -- (4,3) -- (0,3);
\foreach \x/\t in {1/0{,}05, 2/0{,}10, 3/0{,}15, 4/0{,}20} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\t$};
\foreach \y/\t in {0.75/10, 1.5/20, 2.25/30, 3/40} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\t$};
\node at (1.35,0.45) {\small $1{,}0$ J};
\node at (3.2,1.05) {\small $3{,}0$ J};
\end{tikzpicture}
```

Il secondo tratto, lungo quanto il primo, costa tre volte tanto: la molla è già tesa, e la forza parte da $20\,\text{N}$ invece che da zero.
```

Nella figura qui sotto allunghi la molla e guardi il grafico sotto di lei: la forza cresce in linea retta, e l'area colorata, il lavoro, cresce con il quadrato dell'allungamento.

```interattivo
% nome: molla-area-lavoro
% alt: Una molla orizzontale fissata a una parete, con una mano che tira la sua estremità verso destra; sotto la molla, allineato con lei, il grafico della forza in funzione dell'allungamento, una retta dall'origine. Un cursore cambia l'allungamento da 0 a 20 centimetri e un altro la costante elastica; l'area sotto la retta fino all'allungamento scelto si colora, e sotto sono scritti la forza k x e il lavoro un mezzo k x al quadrato. Un bottone allunga la molla piano piano, e l'area cresce mentre la molla si allunga
```

## Errori frequenti

```ad-warning
Il lavoro non è un vettore
Il lavoro ha un segno, ma non una direzione: un lavoro negativo non "punta all'indietro", dice che la forza ostacola il moto. Due lavori si sommano come numeri, con il loro segno.
```
