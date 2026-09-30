# La conservazione dell'energia meccanica

Un pendolo lasciato andare da una certa altezza scende, risale dall'altra parte e arriva quasi alla stessa altezza da cui era partito. Un carrello delle montagne russe, spinto una volta sola in cima alla prima salita, percorre tutto il giro senza motore. In questi moti la velocità e l'altezza cambiano di continuo, ma una grandezza resta la stessa: la somma dell'energia cinetica e dell'energia potenziale. Con questa legge si trovano velocità e altezze senza sapere niente della forma del percorso né dei tempi.

## L'energia meccanica

L'**energia meccanica** $E$ di un corpo è la somma della sua [energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) e della sua [energia potenziale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/energia-potenziale-gravitazionale-ed-elastica):

$$E = K + U$$

con $K = \tfrac{1}{2} m v^2$ e $U$ l'energia potenziale gravitazionale $m g h$, quella elastica $\tfrac{1}{2} k x^2$ se c'è una molla, o la somma delle due.

## La legge di conservazione

Il teorema dell'energia cinetica dice che il lavoro di tutte le forze che agiscono su un corpo è uguale alla variazione della sua energia cinetica: $W = \Delta K$. Supponiamo che a compiere lavoro siano solo il peso e la forza elastica. Il lavoro di ciascuna è meno la variazione della sua energia potenziale, quindi $W = -\Delta U$, e

$$\Delta K = -\Delta U \quad\Rightarrow\quad \Delta K + \Delta U = 0$$

La somma $K + U$ non cambia. È la **legge di conservazione dell'energia meccanica**: se sul corpo lavorano solo il peso e le forze elastiche, l'energia meccanica resta costante, e tra una posizione iniziale e una finale

$$K_i + U_i = K_f + U_f$$

Quello che l'energia cinetica guadagna, l'energia potenziale lo perde, e viceversa.

Possono esserci anche altre forze, purché non compiano lavoro. La reazione di un piano o di una pista liscia è perpendicolare al moto, e così la tensione del filo di un pendolo: il loro lavoro è zero, e l'energia meccanica si conserva lo stesso. Non si conserva invece se ci sono attriti, o la resistenza dell'aria: è l'argomento della lezione [Forze dissipative e conservazione dell'energia totale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/forze-dissipative-e-conservazione-dell-energia-totale). Negli esempi di questa lezione gli attriti si trascurano.

## La caduta libera

Un sasso di $2{,}0\,\text{kg}$ viene lasciato cadere da $5{,}0\,\text{m}$ di altezza. Con il livello di riferimento al suolo, in partenza ha $U = m g h = 98\,\text{J}$ e $K = 0$: l'energia meccanica è $98\,\text{J}$. A metà altezza l'energia potenziale si è dimezzata, $49\,\text{J}$, e gli altri $49\,\text{J}$ sono diventati energia cinetica; al suolo tutti i $98\,\text{J}$ sono energia cinetica.

```tikz
% nome: caduta-libera-energia-barre
% alt: Un sasso che cade, disegnato in tre posizioni: a 5,0 metri, a 2,5 metri e al suolo. Accanto a ogni posizione una barra orizzontale della stessa lunghezza, 98 joule, divisa tra energia potenziale U e cinetica K: in alto è tutta U, a metà altezza metà U e metà K, al suolo è tutta K
% svg: caduta-libera-energia-barre-6321d1f7.svg 242x168
\begin{tikzpicture}
\draw[thick] (-0.8,0) -- (0.8,0);
\foreach \x in {-0.65,-0.5,...,0.8} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[dashed, thin] (0,3.2) -- (0,0.4);
\draw[thick, fill=gray!20] (0,3.2) circle (0.2);
\draw[thick, fill=gray!20] (0,1.7) circle (0.2);
\draw[thick, fill=gray!20] (0,0.2) circle (0.2);
\node[left] at (-0.3,3.2) {\small $5{,}0$ m};
\node[left] at (-0.3,1.7) {\small $2{,}5$ m};
\node[left] at (-0.3,0.2) {\small $0$ m};
\draw[thick, fill=orange!25] (1.2,3.0) rectangle (4.2,3.4);
\node at (2.7,3.2) {\small $U = 98$ J};
\draw[thick, fill=orange!25] (1.2,1.5) rectangle (2.7,1.9);
\draw[thick, fill=blue!10] (2.7,1.5) rectangle (4.2,1.9);
\node at (1.95,1.7) {\small $U = 49$ J};
\node at (3.45,1.7) {\small $K = 49$ J};
\draw[thick, fill=blue!10] (1.2,0.0) rectangle (4.2,0.4);
\node at (2.7,0.2) {\small $K = 98$ J};
\draw[dashed, thin] (4.2,-0.2) -- (4.2,3.7) node[above] {\small $E = 98$ J};
\end{tikzpicture}
```

La velocità al suolo viene dall'uguaglianza tra l'energia potenziale di partenza e l'energia cinetica di arrivo:

$$m g h = \frac{1}{2} m v^2 \quad\Rightarrow\quad v = \sqrt{2 g h}$$

La massa si semplifica: un sasso leggero e uno pesante arrivano al suolo con la stessa velocità, come dice la lezione sulla [caduta libera](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale). Per il sasso, $v = \sqrt{2 \cdot 9{,}8\,\text{m/s}^2 \cdot 5{,}0\,\text{m}} = \sqrt{98}\,\text{m/s} = 9{,}89\ldots\,\text{m/s} \approx 9{,}9\,\text{m/s}$.

```ad-warning
La velocità non è proporzionale all'altezza
Da un'altezza doppia la velocità di arrivo non raddoppia: cresce con la radice quadrata dell'altezza. È l'energia cinetica a raddoppiare. A metà della caduta il sasso ha metà dell'energia cinetica finale, ma una velocità di $7{,}0\,\text{m/s}$, non di $4{,}9\,\text{m/s}$.
```

## Come si risolve un problema

1. Controlla che gli attriti si possano trascurare, e che le forze che lavorano siano solo il peso e le forze elastiche.
2. Scegli il livello di riferimento per le altezze (di solito il punto più basso del moto).
3. Scrivi l'energia meccanica nella posizione iniziale, $K_i + U_i$.
4. Scrivi quella nella posizione finale, $K_f + U_f$, con l'incognita.
5. Uguaglia le due espressioni e ricava l'incognita; se la massa compare in tutti i termini, semplificala.

## La velocità non dipende dal percorso

Un bambino scende da uno scivolo curvo, alto $h$; un sasso cade in verticale dalla stessa altezza. Senza attriti tutti e due perdono la stessa energia potenziale per unità di massa, $g h$, e arrivano in fondo con la stessa velocità, $\sqrt{2 g h}$. Cambiano la direzione della velocità e il tempo impiegato, non il suo modulo: l'energia è uno scalare, e non sa niente della direzione.

```tikz
% nome: stessa-altezza-stessa-velocita
% alt: A sinistra un corpo cade in verticale da un'altezza h e arriva in basso con una velocità verticale v; a destra un corpo scende lungo uno scivolo curvo dalla stessa altezza h e arriva in basso con una velocità orizzontale v, lunga quanto l'altra
% svg: stessa-altezza-stessa-velocita-df88334d.svg 285x177
\begin{tikzpicture}
\draw[dashed, thin] (-0.8,3) -- (5.8,3);
\draw[dashed, thin] (-0.8,0) -- (6.4,0);
\draw[{Stealth}-{Stealth}, thin] (-0.6,0) -- (-0.6,3) node[midway, left] {$h$};
\draw[dotted, thick] (0.4,3) -- (0.4,0);
\fill (0.4,3) circle (1.5pt);
\fill (0.4,0) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black] (0.4,0) -- (0.4,-1.3) node[right] {$\vec{v}$};
\draw[thick] (2.2,3) .. controls (2.7,0.3) and (3.3,0) .. (4.5,0);
\fill (2.2,3) circle (1.5pt);
\fill (4.5,0) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black] (4.5,0) -- (5.8,0) node[above] {$\vec{v}$};
\end{tikzpicture}
```

```ad-example
Esempio 1: lo scivolo
Un bambino parte da fermo dalla cima di uno scivolo alto $3{,}2\,\text{m}$. Con che velocità arriva in fondo, se gli attriti sono trascurabili?

Con il riferimento in fondo allo scivolo: in cima $K_i = 0$ e $U_i = m g h$; in fondo $U_f = 0$ e $K_f = \tfrac{1}{2} m v^2$. Dall'uguaglianza

$$v = \sqrt{2 g h} = \sqrt{2 \cdot 9{,}8\,\text{m/s}^2 \cdot 3{,}2\,\text{m}} = 7{,}91\ldots\,\text{m/s} \approx 7{,}9\,\text{m/s}$$

La forma dello scivolo e la massa del bambino non servono.
```

## Il pendolo

Nel pendolo lavora solo il peso: la tensione del filo è sempre perpendicolare alla velocità della pallina. L'energia meccanica si conserva, e con il riferimento nel punto più basso la pallina lasciata andare da ferma a un'altezza $h$ passa nel punto più basso con la velocità

$$v = \sqrt{2 g h}$$

poi risale dall'altra parte fino alla stessa altezza $h$, dove si ferma e torna indietro.

```tikz
% nome: pendolo-altezza-h
% alt: Un pendolo appeso al soffitto: la pallina è lasciata andare a destra, a un'altezza h sopra il punto più basso, segnata da due linee tratteggiate orizzontali; nel punto più basso la pallina ha una velocità orizzontale v; a sinistra, alla stessa altezza h, la posizione a cui la pallina risale
% svg: pendolo-altezza-h-5ce92193.svg 213x141
\begin{tikzpicture}
\draw[thick] (-2.5,3) -- (2.5,3);
\foreach \x in {-2.35,-2.2,...,2.5} \draw[thin] (\x,3) -- ++(0.15,0.15);
\draw[dashed, thin] (1.928,0.702) arc[start angle=-50, end angle=-130, radius=3];
\draw (0,3) -- (1.928,0.702);
\draw[dashed] (0,3) -- (0,0.15);
\draw[dashed] (0,3) -- (-1.928,0.702);
\draw[thick, fill=blue!10] (1.928,0.702) circle (0.15);
\draw[thick, dashed, fill=blue!10] (-1.928,0.702) circle (0.15);
\draw[thick, fill=blue!10] (0,0) circle (0.15);
\draw[-{Stealth}, thick, blue!60!black] (0.15,0) -- (1.3,0) node[below] {$\vec{v}$};
\draw[dashed, thin] (-2.6,0.702) -- (2.6,0.702);
\draw[dashed, thin] (-0.4,0) -- (2.6,0);
\draw[{Stealth}-{Stealth}, thin] (2.5,0) -- (2.5,0.702) node[midway, right] {$h$};
\fill (0,3) circle (1.5pt);
\end{tikzpicture}
```

```ad-example
Esempio 2: la velocità di un pendolo
La pallina di un pendolo viene lasciata andare da ferma quando è $20\,\text{cm}$ più in alto del punto più basso. Con che velocità passa nel punto più basso? E quanto è veloce quando si trova $10\,\text{cm}$ sopra il punto più basso?

Nel punto più basso tutta l'energia potenziale è diventata cinetica, con $h = 0{,}20\,\text{m}$:

$$v = \sqrt{2 g h} = \sqrt{2 \cdot 9{,}8\,\text{m/s}^2 \cdot 0{,}20\,\text{m}} = 1{,}97\ldots\,\text{m/s} \approx 2{,}0\,\text{m/s}$$

A $10\,\text{cm}$ di altezza la pallina è scesa di $0{,}10\,\text{m}$ dalla partenza, e solo quel dislivello è diventato energia cinetica: $v = \sqrt{2 \cdot 9{,}8 \cdot 0{,}10}\,\text{m/s} = 1{,}4\,\text{m/s}$.
```

```ad-note
L'altezza dalla lunghezza del filo
Se del pendolo si conoscono la lunghezza $L$ del filo e l'angolo $\theta$ di cui è spostato dalla verticale, l'altezza sopra il punto più basso è $h = L - L\cos\theta$: il filo inclinato ha la componente verticale $L\cos\theta$ ([Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore)).
```

Nella figura qui sotto scegli l'angolo da cui parte il pendolo e guardi le barre dell'energia mentre oscilla: l'energia potenziale e quella cinetica si scambiano, e la loro somma resta ferma.

```interattivo
% nome: pendolo-energia-barre
% alt: Un pendolo lungo 1 metro con una pallina di 0,50 chilogrammi, con un cursore per l'angolo di partenza da 10 a 60 gradi e un bottone che lo fa oscillare. Accanto, tre barre: l'energia potenziale U, l'energia cinetica K e l'energia meccanica E; mentre la pallina oscilla, U e K si scambiano e E resta costante. Sotto sono scritti l'altezza, la velocità e le tre energie
```

## Le montagne russe

Su una pista liscia, di qualunque forma, l'energia meccanica si conserva: in ogni punto la velocità dipende solo da quanto il carrello è sceso rispetto alla partenza. Se parte da fermo da un'altezza $h_A$, nel punto $B$ all'altezza $h_B$ ha

$$\frac{1}{2} m v_B^2 = m g (h_A - h_B) \quad\Rightarrow\quad v_B = \sqrt{2 g (h_A - h_B)}$$

e non può mai superare l'altezza di partenza, dove la sua energia cinetica tornerebbe zero.

```tikz
% nome: montagne-russe-profilo
% alt: Il profilo di una pista delle montagne russe: il carrello parte da fermo dal punto A, a 30 metri di altezza, scende fino al suolo, risale fino al punto B, a 12 metri, e poi verso una salita più alta di 30 metri, che senza altra energia il carrello non può superare. Una linea tratteggiata segna i 30 metri
% svg: montagne-russe-profilo-fff6376c.svg 337x153
\begin{tikzpicture}
\draw[thick] (-0.7,0) -- (7.3,0);
\foreach \x in {-0.55,-0.4,...,7.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick] (-0.3,3) -- (0,3) .. controls (1.0,3) and (1.2,0) .. (2.2,0) .. controls (3.0,0) and (3.2,1.2) .. (3.8,1.2) .. controls (4.4,1.2) and (4.6,0.4) .. (5.2,0.4) .. controls (6.0,0.4) and (6.6,3.2) .. (7.0,3.8);
\draw[dashed, thin] (0,3) -- (7.2,3);
\fill (0,3) circle (1.5pt) node[above] {$A$};
\fill (3.8,1.2) circle (1.5pt) node[above] {$B$};
\draw[{Stealth}-{Stealth}, thin] (-0.5,0) -- (-0.5,3) node[midway, left] {$30$ m};
\draw[dashed, thin] (3.8,0) -- (3.8,1.2);
\node[right] at (3.8,0.35) {\small $12$ m};
\end{tikzpicture}
```

```ad-example
Esempio 3: un carrello parte da fermo
Il carrello della figura parte da fermo da $A$, a $30\,\text{m}$ di altezza. Con che velocità passa per $B$, a $12\,\text{m}$?

Il carrello è sceso di $h_A - h_B = 18\,\text{m}$:

$$v_B = \sqrt{2 g (h_A - h_B)} = \sqrt{2 \cdot 9{,}8\,\text{m/s}^2 \cdot 18\,\text{m}} = 18{,}7\ldots\,\text{m/s} \approx 19\,\text{m/s}$$

Nel punto più basso, al suolo, andrebbe a $\sqrt{2 \cdot 9{,}8 \cdot 30}\,\text{m/s} \approx 24\,\text{m/s}$.
```

Se il carrello in $A$ non è fermo ma ha già una velocità $v_A$, la sua energia cinetica si aggiunge a quella che guadagna scendendo:

$$\frac{1}{2} m v_A^2 + m g h_A = \frac{1}{2} m v_B^2 + m g h_B$$

```ad-example
Esempio 4: un carrello già in moto
Un carrello passa per un punto alto $15\,\text{m}$ alla velocità di $4{,}0\,\text{m/s}$. Con che velocità arriva al suolo? Fino a che altezza potrebbe salire?

Divisa per $m$ e moltiplicata per 2, l'uguaglianza delle energie dà $v^2 = v_A^2 + 2 g h_A$:

$$v = \sqrt{(4{,}0\,\text{m/s})^2 + 2 \cdot 9{,}8\,\text{m/s}^2 \cdot 15\,\text{m}} = \sqrt{310}\,\text{m/s} = 17{,}6\ldots\,\text{m/s} \approx 18\,\text{m/s}$$

All'altezza massima il carrello è fermo, e tutta l'energia è potenziale: $m g h_{max} = \tfrac{1}{2} m v_A^2 + m g h_A$, cioè

$$h_{max} = h_A + \frac{v_A^2}{2 g} = 15\,\text{m} + \frac{(4{,}0\,\text{m/s})^2}{2 \cdot 9{,}8\,\text{m/s}^2} = 15{,}8\ldots\,\text{m} \approx 16\,\text{m}$$
```

```ad-warning
Le velocità non si sommano
Nell'esempio 4 la velocità al suolo non è $4{,}0\,\text{m/s}$ più quella di una caduta da $15\,\text{m}$, $17{,}1\,\text{m/s}$: la somma, $21\,\text{m/s}$, è sbagliata. Si sommano le energie, cioè i quadrati delle velocità: $v^2 = v_A^2 + 2 g h$.
```

Nella figura qui sotto fai partire il carrello da dove vuoi, trascinandolo lungo la pista. Le barre mostrano l'energia cinetica e quella potenziale, che si scambiano mentre la loro somma resta la stessa; con l'attrito acceso compare una terza barra, l'energia dissipata, e il carrello non torna più alla quota di partenza.

```interattivo
% nome: montagne-russe-energia
% alt: Una pista delle montagne russe con un carrello di 500 chilogrammi che si trascina fino al punto di partenza e un bottone che lo lascia andare. Accanto, le barre dell'energia cinetica K, dell'energia potenziale U e della loro somma, che resta costante; un interruttore accende l'attrito, e allora compare la barra dell'energia dissipata, che cresce mentre il carrello rallenta. Sotto sono scritti l'altezza, la velocità e le energie in kilojoule
```

## Il lancio verticale

Un corpo lanciato verso l'alto con velocità $v_0$ sale finché la sua energia cinetica non è diventata tutta potenziale. Con il riferimento nel punto di lancio, $\tfrac{1}{2} m v_0^2 = m g h_{max}$, e

$$h_{max} = \frac{v_0^2}{2 g}$$

```ad-example
Esempio 5: una palla lanciata in alto
Una palla viene lanciata verso l'alto a $12\,\text{m/s}$. Di quanto sale sopra il punto di lancio?

$$h_{max} = \frac{v_0^2}{2 g} = \frac{(12\,\text{m/s})^2}{2 \cdot 9{,}8\,\text{m/s}^2} = 7{,}34\ldots\,\text{m} \approx 7{,}3\,\text{m}$$

Ricadendo, la palla ripassa per il punto di lancio con la stessa velocità, $12\,\text{m/s}$, verso il basso.
```

## La molla che lancia un blocco

Una molla compressa di $x$ spinge un blocco di massa $m$ su un piano orizzontale liscio. Quando la molla torna a riposo il blocco si stacca, e tutta l'energia elastica è diventata energia cinetica:

$$\frac{1}{2} k x^2 = \frac{1}{2} m v^2 \quad\Rightarrow\quad v = x\sqrt{\frac{k}{m}}$$

Se poi il blocco sale lungo una rampa liscia, si ferma all'altezza in cui tutta l'energia è diventata potenziale gravitazionale, $\tfrac{1}{2} k x^2 = m g h$.

```tikz
% nome: molla-lancio-salita
% alt: Una molla compressa di x contro una parete, con un blocco appoggiato; il blocco, lanciato dalla molla, scorre su un piano orizzontale e sale lungo una rampa, fino a fermarsi all'altezza h sopra il piano, dove è disegnato tratteggiato
% svg: molla-lancio-salita-0cdddf63.svg 272x78
\begin{tikzpicture}
\draw[thick] (0,0) -- (0,1.2);
\foreach \y in {0,0.15,...,1.2} \draw[thin] (0,\y) -- ++(-0.15,-0.15);
\draw[thick] (0,0) -- (3.2,0) -- (6.2,1.732);
\draw[thick] (3.2,0) -- (6.4,0);
\foreach \x in {0.15,0.3,...,6.4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0,0.3) -- (0.8,0.3);
\draw[thick, fill=blue!10] (0.8,0) rectangle ++(0.6,0.6);
\draw[dashed, thin] (0.8,0.7) -- (0.8,1.05);
\draw[dashed, thin] (1.3,0.7) -- (1.3,1.05);
\draw[{Stealth}-{Stealth}, thin] (0.8,0.9) -- (1.3,0.9) node[midway, above] {$x$};
\draw[-{Stealth}, thick, blue!60!black] (1.6,0.3) -- (2.6,0.3) node[above] {$\vec{v}$};
\draw[thick, dashed, fill=blue!10, rotate around={30:(5.2,1.155)}] (4.9,1.155) rectangle ++(0.6,0.6);
\draw[dashed, thin] (5.2,1.155) -- (6.6,1.155);
\draw[{Stealth}-{Stealth}, thin] (6.5,0) -- (6.5,1.155) node[midway, right] {$h$};
\end{tikzpicture}
```

```ad-example
Esempio 6: il lancio e la salita
Una molla con $k = 400\,\text{N/m}$, compressa di $10\,\text{cm}$, lancia un blocco di $0{,}50\,\text{kg}$ su un piano orizzontale liscio, che poi prosegue in una rampa liscia. Con che velocità parte il blocco? Fino a che altezza sale sulla rampa?

L'energia elastica, con $x = 0{,}10\,\text{m}$, è

$$U = \frac{1}{2} k x^2 = \frac{1}{2} \cdot 400\,\text{N/m} \cdot (0{,}10\,\text{m})^2 = 2{,}0\,\text{J}$$

Diventa tutta energia cinetica: $v = \sqrt{2U / m} = \sqrt{2 \cdot 2{,}0\,\text{J} / 0{,}50\,\text{kg}} = \sqrt{8{,}0}\,\text{m/s} = 2{,}82\ldots\,\text{m/s} \approx 2{,}8\,\text{m/s}$. Poi diventa tutta energia potenziale gravitazionale:

$$h = \frac{U}{m g} = \frac{2{,}0\,\text{J}}{0{,}50\,\text{kg} \cdot 9{,}8\,\text{m/s}^2} = 0{,}408\ldots\,\text{m} \approx 0{,}41\,\text{m}$$

Arrivato in cima, il blocco torna indietro, ricomprime la molla di $10\,\text{cm}$ e riparte: senza attriti il moto si ripete per sempre.
```

```ad-warning
Con la molla la massa non si semplifica
Nella caduta la massa compare in tutti i termini e sparisce; nel lancio con la molla l'energia elastica non contiene la massa, e un blocco più pesante parte più lento: con $1{,}0\,\text{kg}$ al posto di $0{,}50\,\text{kg}$ il blocco dell'esempio 6 partirebbe a $2{,}0\,\text{m/s}$ e salirebbe solo fino a $0{,}20\,\text{m}$.
```

Nella figura qui sotto scegli di quanto comprimere la molla e lanci il blocco: le barre mostrano l'energia elastica che diventa cinetica sul piano e poi potenziale gravitazionale sulla rampa.

```interattivo
% nome: molla-lancio-rampa-energia
% alt: Una molla con costante elastica 400 newton al metro, compressa contro una parete, con un blocco di 0,50 chilogrammi; un cursore sceglie la compressione da 2 a 12 centimetri e un bottone lancia il blocco, che scorre su un piano liscio e sale lungo una rampa inclinata di 30 gradi, poi torna indietro. Accanto, le barre dell'energia elastica, dell'energia cinetica, dell'energia potenziale gravitazionale e della loro somma, che resta costante. Sotto sono scritte la velocità, l'altezza e le energie
```
