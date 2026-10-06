# Prodotto scalare e prodotto vettoriale

Due vettori si possono [sommare e sottrarre](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori), e un vettore si può moltiplicare per un numero. Per moltiplicare due vettori tra loro i modi sono due, e danno risultati di natura diversa: il prodotto scalare dà un numero, il prodotto vettoriale dà un altro vettore. Il primo lo hai già usato senza chiamarlo così, quando hai calcolato il [lavoro di una forza](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza); il secondo serve ogni volta che qualcosa ruota, e più avanti per le forze magnetiche.

## Il prodotto scalare

Il lavoro di una forza costante $\vec{F}$ su un corpo che si sposta di $\vec{s}$ è $W = F\,s\cos\alpha$, dove $\alpha$ è l'angolo tra la forza e lo spostamento. Da due vettori, la forza e lo spostamento, si ottiene uno scalare, il lavoro. La stessa operazione si può fare con due vettori qualunque.

Il **prodotto scalare** di due vettori $\vec{a}$ e $\vec{b}$ è il numero che si ottiene moltiplicando i due moduli per il coseno dell'angolo $\alpha$ tra i vettori:

$$\vec{a} \cdot \vec{b} = a\,b\cos\alpha$$

Si legge "a scalare b". L'angolo $\alpha$ si misura dopo aver disegnato i due vettori con l'origine nello stesso punto, ed è sempre compreso tra $0^\circ$ e $180^\circ$. Con questo nome il lavoro si scrive in modo compatto:

$$W = \vec{F} \cdot \vec{s}$$

Il prodotto scalare ha un significato geometrico. Il numero $b\cos\alpha$ è la componente di $\vec{b}$ lungo la direzione di $\vec{a}$, cioè la lunghezza della sua proiezione (la stessa scomposizione della lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore)). Il prodotto scalare è il modulo di $\vec{a}$ per la proiezione di $\vec{b}$ su $\vec{a}$: conta solo la parte di $\vec{b}$ che va nella direzione di $\vec{a}$.

```tikz
% nome: prodotto-scalare-proiezione
% alt: Due vettori a e b che partono dallo stesso punto e formano un angolo alfa; a è orizzontale. Dalla punta di b scende una linea tratteggiata perpendicolare ad a, e sotto il vettore a un segmento arancione segna la proiezione di b su a, lunga b per coseno di alfa
% svg: prodotto-scalare-proiezione-58b9719d.svg 158x122
\begin{tikzpicture}
\draw[dashed, thin] (1.992,1.671) -- (1.992,0);
\draw (1.992,0.2) -- (1.792,0.2) -- (1.792,0);
\draw[-{Stealth}, thick, blue] (0,0) -- (3.6,0) node[right] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (0,0) -- (1.992,1.671) node[above right] {$\vec{b}$};
\draw (0.6,0) arc[start angle=0, end angle=40, radius=0.6];
\node at (0.83,0.28) {\small $\alpha$};
\draw[thick, orange!90!black] (0,-0.4) -- (1.992,-0.4);
\draw[thick, orange!90!black] (0,-0.3) -- (0,-0.5);
\draw[thick, orange!90!black] (1.992,-0.3) -- (1.992,-0.5);
\node[below] at (0.996,-0.4) {$b\cos\alpha$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

```ad-example
Esempio 1: il lavoro come prodotto scalare
Una slitta viene tirata per $12\,\text{m}$ su un campo innevato con una fune che esercita una forza di $80\,\text{N}$, inclinata di $35^\circ$ rispetto al terreno. Quanto vale il lavoro della forza?

Forza e spostamento formano un angolo $\alpha = 35^\circ$:

$$W = \vec{F} \cdot \vec{s} = F\,s\cos\alpha = 80\,\text{N} \cdot 12\,\text{m} \cdot \cos 35^\circ = 786{,}3\ldots\,\text{J} \approx 7{,}9 \cdot 10^2\,\text{J}$$
```

```ad-warning
Il risultato è un numero, non un vettore
$\vec{a} \cdot \vec{b}$ non ha direzione né verso: non si disegna con una freccia e non ha componenti. Ha però un segno e un'unità di misura, il prodotto delle unità dei due vettori: newton per metro, cioè joule, nel caso del lavoro.
```

### Il segno e il coseno di un angolo ottuso

I moduli $a$ e $b$ sono positivi, quindi il segno del prodotto scalare è quello di $\cos\alpha$. Per un angolo acuto il coseno è positivo, per $\alpha = 90^\circ$ è zero. Se l'angolo è ottuso la proiezione di $\vec{b}$ cade dalla parte opposta rispetto ad $\vec{a}$, e il coseno è negativo: vale l'opposto del coseno dell'angolo supplementare,

$$\cos(180^\circ - \alpha) = -\cos\alpha$$

Per esempio $\cos 145^\circ = -\cos 35^\circ = -0{,}819\ldots$ La calcolatrice dà direttamente il valore con il segno giusto, se è impostata in gradi.

```tikz
% nome: prodotto-scalare-segno-tre-casi
% alt: Tre coppie di vettori a e b con l'origine in comune, a sempre orizzontale verso destra. Nella prima l'angolo è acuto, la proiezione di b su a, in arancione, va nello stesso verso di a e il prodotto scalare è positivo. Nella seconda i vettori sono perpendicolari, la proiezione non c'è e il prodotto scalare è zero. Nella terza l'angolo è ottuso, la proiezione cade sul prolungamento di a dalla parte opposta e il prodotto scalare è negativo
% svg: prodotto-scalare-segno-tre-casi-3e4b0ef5.svg 340x126
\begin{tikzpicture}
\draw[dashed, thin] (1.028,1.226) -- (1.028,0);
\draw[-{Stealth}, thick, blue] (0,0) -- (1.7,0) node[right] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (0,0) -- (1.028,1.226) node[above] {$\vec{b}$};
\draw[very thick, orange!90!black] (0,-0.12) -- (1.028,-0.12);
\fill (0,0) circle (1.5pt);
\node at (0.9,-0.75) {$\vec{a} \cdot \vec{b} > 0$};
\draw[-{Stealth}, thick, blue] (3.0,0) -- (4.7,0) node[right] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (3.0,0) -- (3.0,1.6) node[above] {$\vec{b}$};
\draw (3.2,0) -- (3.2,0.2) -- (3.0,0.2);
\fill (3.0,0) circle (1.5pt);
\node at (3.9,-0.75) {$\vec{a} \cdot \vec{b} = 0$};
\draw[dashed, thin] (5.672,1.226) -- (5.672,0);
\draw[dashed, thin] (6.7,0) -- (5.5,0);
\draw[-{Stealth}, thick, blue] (6.7,0) -- (8.4,0) node[right] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (6.7,0) -- (5.672,1.226) node[above] {$\vec{b}$};
\draw[very thick, orange!90!black] (6.7,-0.12) -- (5.672,-0.12);
\fill (6.7,0) circle (1.5pt);
\node at (7.1,-0.75) {$\vec{a} \cdot \vec{b} < 0$};
\end{tikzpicture}
```

| Angolo tra i vettori | $\cos\alpha$ | $\vec{a} \cdot \vec{b}$ |
|---|---|---|
| $\alpha = 0^\circ$ (paralleli e concordi) | $1$ | $a\,b$, il valore massimo |
| $0^\circ < \alpha < 90^\circ$ | positivo | positivo |
| $\alpha = 90^\circ$ (perpendicolari) | $0$ | $0$ |
| $90^\circ < \alpha < 180^\circ$ | negativo | negativo |
| $\alpha = 180^\circ$ (paralleli e discordi) | $-1$ | $-a\,b$, il valore minimo |

Il caso dei $90^\circ$ si usa spesso al contrario: se il prodotto scalare di due vettori non nulli è zero, i due vettori sono perpendicolari.

Nella figura qui sotto trascini la punta di $\vec{b}$ e guardi la sua proiezione su $\vec{a}$. Finché l'angolo è acuto la proiezione va nel verso di $\vec{a}$ e il prodotto scalare è positivo; a $90^\circ$ la proiezione sparisce e il prodotto è zero; oltre i $90^\circ$ la proiezione passa dall'altra parte e il prodotto diventa negativo, anche se i due moduli non sono cambiati.

```interattivo
% nome: prodotto-scalare-proiezione-segno
% alt: Due vettori a e b con l'origine in comune su una griglia: a è fisso e orizzontale, lungo 4 quadretti, la punta di b si trascina sui punti della griglia. Una linea tratteggiata scende dalla punta di b sulla retta di a e un segmento arancione segna la proiezione di b su a, a destra dell'origine se l'angolo è acuto e a sinistra se è ottuso. Sotto la figura sono scritti i moduli, l'angolo, la proiezione b per coseno di alfa e il prodotto scalare, calcolato anche con le componenti
```

```ad-example
Esempio 2: il lavoro del peso in salita
Una cassa di $4{,}0\,\text{kg}$ viene trascinata per $2{,}5\,\text{m}$ in salita lungo una rampa inclinata di $25^\circ$. Quanto vale il lavoro del peso?

Il peso è verticale e verso il basso, lo spostamento è lungo la rampa verso l'alto. Lo spostamento sta $25^\circ$ sopra l'orizzontale e il peso $90^\circ$ sotto: l'angolo tra i due vettori è $\alpha = 90^\circ + 25^\circ = 115^\circ$, un angolo ottuso.

```tikz
% nome: lavoro-peso-salita-angolo-ottuso
% alt: Una cassa su una rampa inclinata di 25 gradi. Dal centro della cassa partono lo spostamento s, in blu, lungo la rampa verso l'alto, e il peso P, in rosso, verticale verso il basso. Un arco segna l'angolo tra i due vettori, di 115 gradi
% svg: lavoro-peso-salita-angolo-ottuso-572ebc4b.svg 197x97
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (4.8,0);
\foreach \x in {-0.15,0,...,4.8} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- (4.5,0) -- (4.5,2.098) -- cycle;
\draw (0.8,0) arc[start angle=0, end angle=25, radius=0.8];
\node at (1.15,0.22) {\small $25^\circ$};
\draw[thick, fill=blue!10, rotate around={25:(1.994,0.930)}] (1.594,0.930) rectangle ++(0.8,0.5);
\draw[-{Stealth}, thick, red] (1.888,1.157) -- (1.888,0.157);
\node[right] at (1.9,0.3) {$\vec{P}$};
\draw[-{Stealth}, thick, blue] (1.888,1.157) -- (3.338,1.833) node[above] {$\vec{s}$};
\draw (1.888,0.707) arc[start angle=-90, end angle=25, radius=0.45];
\node at (2.72,0.72) {\small $115^\circ$};
\fill (1.888,1.157) circle (1.5pt);
\end{tikzpicture}
```

Il peso vale $P = m\,g = 4{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 39{,}2\,\text{N}$, e

$$W = \vec{P} \cdot \vec{s} = P\,s\cos\alpha = 39{,}2\,\text{N} \cdot 2{,}5\,\text{m} \cdot \cos 115^\circ = -41{,}4\ldots\,\text{J} \approx -41\,\text{J}$$

Il lavoro è negativo: il peso si oppone alla salita. Il controllo è immediato: la cassa sale di $h = 2{,}5\,\text{m} \cdot \sin 25^\circ = 1{,}06\,\text{m}$, e $-m\,g\,h = -39{,}2\,\text{N} \cdot 1{,}06\,\text{m} = -41\,\text{J}$.
```

```ad-warning
L'angolo si misura con le origini nello stesso punto
L'angolo del prodotto scalare è quello tra i due vettori disegnati a partire dallo stesso punto. Nell'esempio 2 non è l'inclinazione della rampa, $25^\circ$, e nemmeno $65^\circ$: usare uno di questi due valori dà un lavoro positivo, cioè un peso che aiuta a salire.
```

### Proprietà

Dalla definizione seguono quattro proprietà, che si usano nei calcoli.

- È commutativo: $\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$, perché l'angolo tra i due vettori è lo stesso in qualunque ordine li si prenda.
- È distributivo rispetto alla somma: $\vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$. In termini di lavoro: il lavoro della forza totale è la somma dei lavori delle singole forze.
- Un numero si porta fuori: $(k\,\vec{a}) \cdot \vec{b} = k\,(\vec{a} \cdot \vec{b})$.
- Il prodotto scalare di un vettore per se stesso è il quadrato del suo modulo: $\vec{a} \cdot \vec{a} = a \cdot a \cdot \cos 0^\circ = a^2$.

### Il prodotto scalare con le componenti

Quando dei due vettori si conoscono le componenti cartesiane, l'angolo non serve. Ogni vettore è la somma dei suoi vettori componenti, $\vec{a} = \vec{a}_x + \vec{a}_y$ e $\vec{b} = \vec{b}_x + \vec{b}_y$, e per la proprietà distributiva

$$\vec{a} \cdot \vec{b} = \vec{a}_x \cdot \vec{b}_x + \vec{a}_x \cdot \vec{b}_y + \vec{a}_y \cdot \vec{b}_x + \vec{a}_y \cdot \vec{b}_y$$

I due prodotti in mezzo sono nulli, perché un vettore lungo $x$ e uno lungo $y$ sono perpendicolari. Gli altri due sono prodotti di vettori paralleli: valgono il prodotto dei moduli, con il segno più se i versi sono concordi e meno se sono discordi, cioè il prodotto delle componenti con il loro segno. Resta

$$\vec{a} \cdot \vec{b} = a_x\,b_x + a_y\,b_y$$

Nello spazio i vettori hanno una terza componente e il prodotto scalare un terzo addendo: $\vec{a} \cdot \vec{b} = a_x\,b_x + a_y\,b_y + a_z\,b_z$.

```ad-example
Esempio 3: il lavoro dalle componenti
Su un disco da hockey agisce la forza $\vec{F}$ di componenti $F_x = 3{,}0\,\text{N}$ e $F_y = 4{,}0\,\text{N}$, mentre il disco si sposta di $\vec{s}$, con $s_x = 5{,}0\,\text{m}$ e $s_y = -2{,}0\,\text{m}$. Quanto lavoro compie la forza?

$$W = \vec{F} \cdot \vec{s} = F_x\,s_x + F_y\,s_y = 3{,}0\,\text{N} \cdot 5{,}0\,\text{m} + 4{,}0\,\text{N} \cdot (-2{,}0\,\text{m}) = 15\,\text{J} - 8{,}0\,\text{J} = 7{,}0\,\text{J}$$

Lungo $x$ la forza aiuta il moto, lungo $y$ lo ostacola, e il lavoro è la somma dei due contributi con il loro segno.
```

Mettendo insieme le due scritture del prodotto scalare si trova l'angolo tra due vettori di cui si conoscono le componenti:

$$\cos\alpha = \frac{\vec{a} \cdot \vec{b}}{a\,b} = \frac{a_x\,b_x + a_y\,b_y}{a\,b}$$

I moduli si calcolano con il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide), $a = \sqrt{a_x^2 + a_y^2}$, e l'angolo con il tasto $\cos^{-1}$ della calcolatrice, che dà sempre un angolo tra $0^\circ$ e $180^\circ$.

```ad-example
Esempio 4: l'angolo tra due vettori
Quanto vale l'angolo tra $\vec{a}$, di componenti $(4;\ 3)$, e $\vec{b}$, di componenti $(-1;\ 2)$?

$$\vec{a} \cdot \vec{b} = 4 \cdot (-1) + 3 \cdot 2 = 2 \qquad a = \sqrt{4^2 + 3^2} = 5 \qquad b = \sqrt{(-1)^2 + 2^2} = \sqrt{5} = 2{,}236\ldots$$

$$\cos\alpha = \frac{2}{5 \cdot 2{,}236} = 0{,}1788\ldots \qquad \alpha = \cos^{-1}(0{,}1788) = 79{,}6\ldots^\circ \approx 80^\circ$$

Il prodotto scalare è positivo ma piccolo rispetto al prodotto dei moduli: i due vettori sono quasi perpendicolari.
```

## Il prodotto vettoriale

Per svitare un bullone con una chiave inglese conta quanto è intensa la forza, quanto è lontana dal bullone e quanto è inclinata rispetto al manico; e la forza, girando in un verso o nell'altro, avvita o svita. Il [momento di una forza](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-momento-di-una-forza-e-di-una-coppia-di-forze) tiene conto di tutte queste cose, e si costruisce con il secondo modo di moltiplicare due vettori.

Il **prodotto vettoriale** di due vettori $\vec{a}$ e $\vec{b}$ è un vettore $\vec{c}$, che si scrive

$$\vec{c} = \vec{a} \times \vec{b}$$

e si legge "a vettore b". Come ogni vettore, è definito da modulo, direzione e verso:

- il modulo è $c = a\,b\sin\alpha$, dove $\alpha$ è l'angolo tra i due vettori (tra $0^\circ$ e $180^\circ$);
- la direzione è perpendicolare sia ad $\vec{a}$ sia a $\vec{b}$, cioè al piano che contiene i due vettori;
- il verso è dato dalla **regola della mano destra**.

### Il modulo

Nel modulo compare il seno al posto del coseno. Il numero $b\sin\alpha$ è la componente di $\vec{b}$ perpendicolare ad $\vec{a}$: del secondo vettore qui conta la parte che il prodotto scalare ignora. Per un angolo ottuso il seno si calcola con la calcolatrice, oppure con l'angolo supplementare, perché

$$\sin(180^\circ - \alpha) = \sin\alpha$$

Il seno di un angolo tra $0^\circ$ e $180^\circ$ non è mai negativo, come deve essere per un modulo. Il modulo del prodotto vettoriale ha anche lui un significato geometrico: disegnando i due vettori dallo stesso punto e completando il parallelogramma, $a$ è la base e $b\sin\alpha$ l'altezza. Il modulo di $\vec{a} \times \vec{b}$ è l'area del parallelogramma costruito sui due vettori.

```tikz
% nome: prodotto-vettoriale-area-parallelogramma
% alt: Due vettori a e b con l'origine in comune e un angolo alfa tra loro; a è orizzontale. Il parallelogramma costruito sui due vettori è colorato; dalla punta di b scende l'altezza tratteggiata, lunga b per seno di alfa. L'area del parallelogramma è il modulo del prodotto vettoriale
% svg: prodotto-vettoriale-area-parallelogramma-065ddad7.svg 180x108
\begin{tikzpicture}
\fill[orange!25] (0,0) -- (3.2,0) -- (4.614,1.685) -- (1.414,1.685) -- cycle;
\draw[thin] (3.2,0) -- (4.614,1.685) -- (1.414,1.685);
\draw[dashed, thin] (1.414,1.685) -- (1.414,0);
\draw (1.414,0.2) -- (1.614,0.2) -- (1.614,0);
\draw[-{Stealth}, thick, blue] (0,0) -- (3.2,0) node[below] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (0,0) -- (1.414,1.685) node[above left] {$\vec{b}$};
\draw (0.55,0) arc[start angle=0, end angle=50, radius=0.55];
\node at (0.76,0.33) {\small $\alpha$};
\node[right] at (1.414,0.95) {$b\sin\alpha$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

Il modulo è massimo, $a\,b$, quando i due vettori sono perpendicolari, ed è zero quando sono paralleli ($\alpha = 0^\circ$ oppure $180^\circ$): il parallelogramma si schiaccia su un segmento e non ha area. È il contrario di quello che succede al prodotto scalare.

```ad-warning
Seno per il vettoriale, coseno per lo scalare
Scambiare le due funzioni è l'errore più comune. Un controllo veloce: due vettori paralleli hanno prodotto scalare massimo e prodotto vettoriale nullo; due vettori perpendicolari hanno prodotto scalare nullo e prodotto vettoriale di modulo massimo.
```

### Direzione e verso: la regola della mano destra

Due vettori non paralleli che partono dallo stesso punto stanno su un piano, e $\vec{a} \times \vec{b}$ è perpendicolare a quel piano. Restano due versi possibili, da una parte o dall'altra del piano. Per scegliere si usa la mano destra: si punta la mano aperta lungo $\vec{a}$ e si chiudono le dita verso $\vec{b}$, ruotando dalla parte dell'angolo più piccolo; il pollice disteso indica il verso di $\vec{a} \times \vec{b}$.

```tikz
% nome: prodotto-vettoriale-mano-destra
% alt: Un piano orizzontale visto in prospettiva, con due vettori a e b che partono dallo stesso punto e una freccia curva che ruota da a verso b in senso antiorario. Dal punto comune parte verso l'alto, perpendicolare al piano, il vettore c uguale ad a vettore b, in arancione
% svg: prodotto-vettoriale-mano-destra-636d7a88.svg 200x140
\begin{tikzpicture}
\draw[thin, fill=gray!20] (-0.6,-0.5) -- (3.6,-0.5) -- (4.6,1.1) -- (0.4,1.1) -- cycle;
\draw[-{Stealth}, thick, blue] (1.4,0.2) -- (3.3,0) node[right] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (1.4,0.2) -- (2.6,0.95) node[above right] {$\vec{b}$};
\draw[-{Stealth}, thin] (2.3,0.1) arc[start angle=-6, end angle=30, radius=0.95];
\draw[-{Stealth}, thick, orange!90!black] (1.4,0.2) -- (1.4,2.5) node[above] {$\vec{c} = \vec{a} \times \vec{b}$};
\fill (1.4,0.2) circle (1.5pt);
\end{tikzpicture}
```

```ad-note
La stessa regola con il palmo
Alcuni libri danno la regola in un'altra forma: il pollice della mano destra lungo $\vec{a}$, le altre dita distese lungo $\vec{b}$, e il verso di $\vec{a} \times \vec{b}$ è quello che esce dal palmo. Le due forme danno sempre lo stesso risultato: usa quella che ti viene più naturale, ma sempre con la mano destra.
```

Sul foglio i due vettori si disegnano di solito nel piano del foglio, e il prodotto vettoriale è allora perpendicolare al foglio. Un vettore che esce dal foglio verso chi guarda si indica con il simbolo $\odot$ (la punta di una freccia vista di fronte), uno che entra nel foglio con $\otimes$ (la coda della freccia vista da dietro). Con la mano destra si trova che, se per portare $\vec{a}$ su $\vec{b}$ si ruota in senso antiorario, il prodotto $\vec{a} \times \vec{b}$ esce dal foglio; se si ruota in senso orario, entra.

```tikz
% nome: prodotto-vettoriale-uscente-entrante
% alt: Due disegni affiancati. Nel primo, per portare il vettore a sul vettore b si ruota in senso antiorario, come indica una freccia curva, e accanto c'è il simbolo di un cerchio con un punto: il prodotto vettoriale esce dal foglio. Nel secondo i due vettori sono scambiati, la rotazione da a verso b è oraria e accanto c'è il simbolo di un cerchio con una croce: il prodotto vettoriale entra nel foglio
% svg: prodotto-vettoriale-uscente-entrante-863e91eb.svg 335x111
\begin{tikzpicture}
\draw[-{Stealth}, thick, blue] (0,0) -- (2,0) node[right] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (0,0) -- (0.8,1.386) node[above] {$\vec{b}$};
\draw[-{Stealth}, thin] (0.8,0) arc[start angle=0, end angle=55, radius=0.8];
\fill (0,0) circle (1.5pt);
\draw[thick, orange!90!black] (2.3,1.1) circle (0.2);
\fill[orange!90!black] (2.3,1.1) circle (1.5pt);
\node[right] at (2.5,1.1) {$\vec{a} \times \vec{b}$};
\node at (1.4,-0.6) {esce dal foglio};
\draw[-{Stealth}, thick, blue] (5.2,0) -- (7.2,0) node[right] {$\vec{b}$};
\draw[-{Stealth}, thick, blue] (5.2,0) -- (6,1.386) node[above] {$\vec{a}$};
\draw[-{Stealth}, thin] (5.6,0.693) arc[start angle=60, end angle=5, radius=0.8];
\fill (5.2,0) circle (1.5pt);
\draw[thick, orange!90!black] (7.5,1.1) circle (0.2);
\draw[thick, orange!90!black] (7.359,0.959) -- (7.641,1.241);
\draw[thick, orange!90!black] (7.359,1.241) -- (7.641,0.959);
\node[right] at (7.7,1.1) {$\vec{a} \times \vec{b}$};
\node at (6.6,-0.6) {entra nel foglio};
\end{tikzpicture}
```

I due disegni mostrano la proprietà che distingue di più il prodotto vettoriale dalle moltiplicazioni a cui sei abituato: scambiando i due vettori il risultato cambia verso.

$$\vec{b} \times \vec{a} = -\,\vec{a} \times \vec{b}$$

Si dice che il prodotto vettoriale è **anticommutativo**. Restano vere la proprietà distributiva, $\vec{a} \times (\vec{b} + \vec{c}) = \vec{a} \times \vec{b} + \vec{a} \times \vec{c}$, e quella del numero che si porta fuori, $(k\,\vec{a}) \times \vec{b} = k\,(\vec{a} \times \vec{b})$. Il prodotto vettoriale di un vettore per se stesso, o per un vettore parallelo, è il vettore nullo.

```ad-warning
L'ordine conta
In un prodotto vettoriale i due vettori non si possono scambiare: $\vec{a} \times \vec{b}$ e $\vec{b} \times \vec{a}$ hanno lo stesso modulo e la stessa direzione, ma versi opposti. Nelle formule di fisica l'ordine è parte della definizione, e la regola della mano destra va applicata partendo dal primo vettore.
```

```ad-example
Esempio 5: una forza sul manico di una chiave
Il vettore $\vec{r}$ va dal centro $O$ di un bullone al punto $A$ del manico di una chiave dove è applicata una forza, ed è lungo $0{,}25\,\text{m}$. La forza $\vec{F}$ ha modulo $40\,\text{N}$ e forma un angolo di $60^\circ$ con $\vec{r}$, come nella figura. Trova modulo, direzione e verso di $\vec{r} \times \vec{F}$.

```tikz
% nome: prodotto-vettoriale-chiave-bullone
% alt: Il vettore r, orizzontale, va dal punto O al punto A. Dal punto A parte la forza F, inclinata di 60 gradi rispetto al prolungamento tratteggiato di r, verso l'alto a destra. Accanto al punto O il simbolo del cerchio con il punto indica che il prodotto r vettore F esce dal foglio
% svg: prodotto-vettoriale-chiave-bullone-fdcc7897.svg 174x96
\begin{tikzpicture}
\draw[dashed, thin] (2.5,0) -- (4,0);
\draw[-{Stealth}, thick, blue] (0,0) -- (2.5,0);
\node[below] at (1.25,0) {$\vec{r}$};
\draw[-{Stealth}, thick, red] (2.5,0) -- (3.3,1.386) node[above] {$\vec{F}$};
\draw (3.1,0) arc[start angle=0, end angle=60, radius=0.6];
\node at (3.4,0.38) {\small $60^\circ$};
\fill (0,0) circle (1.5pt) node[below left] {$O$};
\fill (2.5,0) circle (1.5pt) node[below] {$A$};
\draw[thick, orange!90!black] (0.5,1.0) circle (0.2);
\fill[orange!90!black] (0.5,1.0) circle (1.5pt);
\node[right] at (0.7,1.0) {$\vec{r} \times \vec{F}$};
\end{tikzpicture}
```

Per vedere l'angolo si prolunga $\vec{r}$ oltre $A$, il che equivale a spostare $\vec{F}$ parallelamente a se stessa fino a $O$: l'angolo tra i due vettori è $\alpha = 60^\circ$. Il modulo:

$$|\vec{r} \times \vec{F}| = r\,F\sin\alpha = 0{,}25\,\text{m} \cdot 40\,\text{N} \cdot \sin 60^\circ = 8{,}66\ldots\,\text{N}\cdot\text{m} \approx 8{,}7\,\text{N}\cdot\text{m}$$

La direzione è perpendicolare al foglio, che contiene $\vec{r}$ e $\vec{F}$. Per portare $\vec{r}$ su $\vec{F}$ si ruota in senso antiorario: il prodotto esce dal foglio, $\odot$.

Il numero trovato è il momento della forza rispetto a $O$ che conosci dal primo anno: il braccio è $b = r\sin\alpha = 0{,}217\,\text{m}$, e $M = F\,b = 8{,}7\,\text{N}\cdot\text{m}$. Il prodotto vettoriale aggiunge al momento una direzione e un verso, che dicono intorno a quale asse e da che parte la forza fa ruotare la chiave: lo userai nella lezione [Momento torcente e dinamica delle rotazioni](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/momento-torcente-e-dinamica-delle-rotazioni) e in quella sul [momento angolare](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/il-momento-angolare).
```

Nella figura qui sotto trascini le punte dei due vettori. L'area colorata del parallelogramma è il modulo del prodotto vettoriale, e il simbolo accanto dice se il prodotto esce dal foglio o ci entra. Quando $\vec{b}$ passa dall'altra parte di $\vec{a}$ la rotazione da $\vec{a}$ a $\vec{b}$ diventa oraria e il simbolo cambia da $\odot$ a $\otimes$; quando i due vettori si allineano il parallelogramma si schiaccia e il prodotto è nullo.

```interattivo
% nome: prodotto-vettoriale-area-verso
% alt: Due vettori a e b con l'origine in comune su una griglia, con le punte da trascinare sui punti della griglia. Il parallelogramma costruito sui due vettori è colorato e una freccia curva indica la rotazione da a verso b. Un simbolo, il cerchio con il punto o il cerchio con la croce, dice se il prodotto vettoriale esce dal foglio o ci entra. Sotto la figura sono scritti le componenti dei due vettori, l'angolo, il modulo del prodotto vettoriale, uguale all'area del parallelogramma, e la componente lungo z con il suo segno
```

### Il prodotto vettoriale con le componenti

Si prendono gli assi $x$ e $y$ nel piano del foglio, $x$ verso destra e $y$ verso l'alto, e l'asse $z$ perpendicolare al foglio, che esce verso chi guarda. Con questa scelta ruotare dall'asse $x$ all'asse $y$ è una rotazione antioraria, e il prodotto vettoriale di un vettore lungo $x$ per uno lungo $y$ va lungo $z$ nel verso positivo.

Se $\vec{a}$ e $\vec{b}$ stanno nel piano $xy$, il loro prodotto vettoriale è diretto lungo $z$ e ha una sola componente. La si trova come per il prodotto scalare, scrivendo ogni vettore come somma dei suoi vettori componenti e usando la proprietà distributiva. Questa volta sono nulli i prodotti tra componenti parallele, $\vec{a}_x \times \vec{b}_x$ e $\vec{a}_y \times \vec{b}_y$. Il prodotto $\vec{a}_x \times \vec{b}_y$ vale $a_x\,b_y$ lungo $z$; il prodotto $\vec{a}_y \times \vec{b}_x$ ha i fattori nell'ordine opposto, da $y$ a $x$, e vale $-a_y\,b_x$. In tutto

$$c_z = a_x\,b_y - a_y\,b_x$$

Il segno dà il verso: se $c_z$ è positivo il prodotto vettoriale esce dal foglio, se è negativo entra. Il modulo è $|c_z|$.

```ad-example
Esempio 6: due vettori nel piano
Trova $\vec{c} = \vec{a} \times \vec{b}$ con $\vec{a}$ di componenti $(3;\ 2)$ e $\vec{b}$ di componenti $(1;\ 4)$. Che cosa cambia scambiando i due vettori?

$$c_z = a_x\,b_y - a_y\,b_x = 3 \cdot 4 - 2 \cdot 1 = 10$$

Il prodotto ha modulo $10$ ed esce dal foglio: per andare da $\vec{a}$ a $\vec{b}$ si ruota in senso antiorario. Il parallelogramma costruito sui due vettori ha area $10$.

Scambiando i fattori, $\vec{b} \times \vec{a}$ ha componente $b_x\,a_y - b_y\,a_x = 1 \cdot 2 - 4 \cdot 3 = -10$: stesso modulo, ma entra nel foglio.
```

Se i due vettori non stanno nel piano $xy$ e hanno anche la componente $z$, il prodotto vettoriale ha tre componenti, che si ottengono con lo stesso ragionamento:

$$c_x = a_y\,b_z - a_z\,b_y \qquad c_y = a_z\,b_x - a_x\,b_z \qquad c_z = a_x\,b_y - a_y\,b_x$$

Le tre formule hanno la stessa struttura, e si ricavano l'una dall'altra facendo girare le lettere nell'ordine $x \to y \to z \to x$. In ogni componente del risultato non compare mai la lettera della componente stessa: in $c_x$ ci sono solo $y$ e $z$.

```ad-example
Esempio 7: due vettori nello spazio
Trova $\vec{c} = \vec{a} \times \vec{b}$ con $\vec{a}$ di componenti $(2;\ -1;\ 3)$ e $\vec{b}$ di componenti $(1;\ 4;\ -2)$, e controlla che sia perpendicolare a tutti e due.

$$c_x = a_y\,b_z - a_z\,b_y = (-1) \cdot (-2) - 3 \cdot 4 = 2 - 12 = -10$$

$$c_y = a_z\,b_x - a_x\,b_z = 3 \cdot 1 - 2 \cdot (-2) = 3 + 4 = 7$$

$$c_z = a_x\,b_y - a_y\,b_x = 2 \cdot 4 - (-1) \cdot 1 = 8 + 1 = 9$$

Il prodotto vettoriale ha componenti $(-10;\ 7;\ 9)$. Per controllare che sia perpendicolare ai due vettori si usa il prodotto scalare, che deve essere nullo:

$$\vec{a} \cdot \vec{c} = 2 \cdot (-10) + (-1) \cdot 7 + 3 \cdot 9 = -20 - 7 + 27 = 0$$

$$\vec{b} \cdot \vec{c} = 1 \cdot (-10) + 4 \cdot 7 + (-2) \cdot 9 = -10 + 28 - 18 = 0$$
```

```ad-warning
Il segno della componente y
Nella seconda formula l'ordine delle lettere è $z$, $x$: $c_y = a_z\,b_x - a_x\,b_z$. Scrivere $a_x\,b_z - a_z\,b_x$, per analogia con le altre due lette in fretta, dà $c_y$ con il segno sbagliato. Il controllo dell'esempio 7, il prodotto scalare nullo con ciascuno dei due vettori, scopre subito l'errore.
```

## I due prodotti a confronto

| | Prodotto scalare $\vec{a} \cdot \vec{b}$ | Prodotto vettoriale $\vec{a} \times \vec{b}$ |
|---|---|---|
| Risultato | un numero, con il segno | un vettore |
| Valore | $a\,b\cos\alpha$ | modulo $a\,b\sin\alpha$, perpendicolare ai due vettori, verso con la mano destra |
| Significato geometrico | modulo di $\vec{a}$ per la proiezione di $\vec{b}$ su $\vec{a}$ | area del parallelogramma |
| Vettori paralleli | massimo in valore assoluto, $\pm a\,b$ | nullo |
| Vettori perpendicolari | zero | modulo massimo, $a\,b$ |
| Scambiando i fattori | non cambia | cambia verso |
| Con le componenti nel piano | $a_x\,b_x + a_y\,b_y$ | $c_z = a_x\,b_y - a_y\,b_x$ |
| In fisica | il lavoro, $W = \vec{F} \cdot \vec{s}$ | il momento di una forza, il momento angolare |
