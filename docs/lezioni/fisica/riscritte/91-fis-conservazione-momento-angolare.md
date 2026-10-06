# La conservazione del momento angolare

Una pattinatrice comincia una trottola con le braccia aperte e gira piano. Poi stringe le braccia al petto e, senza che nessuno la spinga, si mette a girare tre o quattro volte più veloce. Lo stesso fa un tuffatore che si raggomitola per completare due capriole prima di toccare l'acqua, e lo stesso fa una sedia girevole da ufficio se chi ci è seduto sopra, dopo una spinta, tira dentro le gambe. In tutti questi casi nessuna forza esterna fa ruotare il corpo più in fretta: c'è una grandezza che non può cambiare, e la velocità angolare si adatta per tenerla costante.

## La legge di conservazione

Il [momento angolare](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/il-momento-angolare) di un sistema cambia solo se sul sistema agisce un momento esterno: $M = \Delta L/\Delta t$. Se il momento totale delle forze esterne è zero, allora $\Delta L = 0$ in ogni intervallo di tempo, e quindi il momento angolare non cambia. È la **legge di conservazione del momento angolare**:

se il momento totale delle forze esterne che agiscono su un sistema è nullo, il momento angolare totale del sistema si conserva.

$$\vec{L}_{iniziale} = \vec{L}_{finale}$$

Tre precisazioni servono per usarla bene.

- Contano solo le forze esterne. Le forze interne, quelle che le parti del sistema si scambiano tra loro (i muscoli della pattinatrice che tirano le braccia, l'attrito tra due dischi che si toccano), non cambiano il momento angolare totale: per il [terzo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica) vanno a coppie, e i loro momenti si cancellano. Possono solo spostare momento angolare da una parte all'altra del sistema.
- Non serve che le forze esterne siano nulle, basta che sia nullo il loro momento rispetto al polo o all'asse scelto. Sulla pattinatrice agiscono il peso e la reazione del ghiaccio, ma nessuna delle due la fa ruotare intorno all'asse verticale, e l'attrito dei pattini in rotazione sulla punta è piccolo.
- Il momento angolare è un vettore: si conservano il modulo, la direzione e il verso. Nei problemi con un asse fisso basta il modulo con il suo segno.

La legge è la sorella di quella della [quantità di moto](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-conservazione-della-quantita-di-moto): forza esterna nulla, $\vec{p}$ costante; momento esterno nullo, $\vec{L}$ costante. Le due condizioni sono indipendenti, e può valere una senza l'altra.

## Quando cambia il momento d'inerzia

Per un corpo che ruota intorno a un asse fisso $L = I\,\omega$. Un corpo rigido ha un [momento d'inerzia](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/il-momento-d-inerzia) fisso, e allora la conservazione dice soltanto che continua a girare con la stessa $\omega$. Ma un corpo che può cambiare forma, come una persona, cambia $I$ spostando la sua massa più vicino o più lontano dall'asse. Se nel frattempo il momento esterno è nullo,

$$I_1\,\omega_1 = I_2\,\omega_2$$

Momento d'inerzia e velocità angolare sono inversamente proporzionali: se $I$ si dimezza, $\omega$ raddoppia.

```tikz
% nome: pattinatrice-braccia-aperte-chiuse
% alt: Una pattinatrice vista dall'alto, schematizzata come un cerchio con due masse ai lati. A sinistra le masse sono lontane dall'asse, il momento d'inerzia I1 è grande e la freccia curva della velocità angolare omega 1 è corta. A destra le masse sono vicine all'asse, il momento d'inerzia I2 è piccolo e la freccia curva di omega 2 è lunga
\begin{tikzpicture}
\draw[dashed, thin] (0,0) circle (1.5);
\draw[thick] (-1.5,0) -- (1.5,0);
\draw[thick, fill=gray!20] (0,0) circle (0.3);
\draw[thick, fill=blue!10] (-1.5,0) circle (0.18);
\draw[thick, fill=blue!10] (1.5,0) circle (0.18);
\draw[-{Stealth}, thick] (50:1.9) arc[start angle=50, end angle=80, radius=1.9];
\node at (62:2.25) {$\omega_1$};
\node[below] at (0,-1.7) {$I_1$ grande};
\draw[dashed, thin] (5,0) circle (0.6);
\draw[thick] (4.4,0) -- (5.6,0);
\draw[thick, fill=gray!20] (5,0) circle (0.3);
\draw[thick, fill=blue!10] (4.4,0) circle (0.18);
\draw[thick, fill=blue!10] (5.6,0) circle (0.18);
\draw[-{Stealth}, thick] ([shift={(5,0)}]20:1.2) arc[start angle=20, end angle=140, radius=1.2];
\node at (5.95,1.35) {$\omega_2$};
\node[below] at (5,-1.7) {$I_2$ piccolo};
\draw[-{Stealth}, thin] (2.5,0) -- (3.4,0);
\end{tikzpicture}
```

```ad-example
Esempio 1: la trottola della pattinatrice
Una pattinatrice gira con le braccia aperte a $1{,}5$ giri al secondo; in questa posizione il suo momento d'inerzia rispetto all'asse verticale è $3{,}6\,\text{kg}\cdot\text{m}^2$. Stringendo le braccia lo riduce a $1{,}2\,\text{kg}\cdot\text{m}^2$. Con quale frequenza gira adesso?

Il momento esterno è trascurabile, quindi $I_1\,\omega_1 = I_2\,\omega_2$. La velocità angolare è proporzionale alla frequenza, $\omega = 2\pi f$, e il fattore $2\pi$ si semplifica: vale anche $I_1 f_1 = I_2 f_2$.

$$f_2 = \frac{I_1}{I_2}\,f_1 = \frac{3{,}6\,\text{kg}\cdot\text{m}^2}{1{,}2\,\text{kg}\cdot\text{m}^2} \cdot 1{,}5\,\text{s}^{-1} = 4{,}5\,\text{s}^{-1}$$

Il momento d'inerzia è diventato un terzo, la frequenza il triplo: $4{,}5$ giri al secondo.
```

Nella figura qui sotto una piattaforma, con momento d'inerzia $1{,}0\,\text{kg}\cdot\text{m}^2$, gira con sopra due masse da $2{,}0\,\text{kg}$ che puoi avvicinare all'asse o allontanare, come le braccia della pattinatrice. La domanda è che cosa succede alla velocità angolare, al momento angolare e all'energia cinetica quando la distanza dall'asse passa da $1{,}0\,\text{m}$ a $0{,}5\,\text{m}$.

```interattivo
% nome: momento-angolare-masse-piattaforma
% alt: Una piattaforma vista dall'alto, con momento d'inerzia 1,0 chilogrammi per metro quadrato, che ruota intorno al suo centro, con due masse da 2,0 chilogrammi ai lati opposti, alla stessa distanza dall'asse. Un cursore sposta le masse da 0,2 a 1,0 metri dall'asse e un bottone fa girare la piattaforma; una freccia curva è tanto più lunga quanto più grande è la velocità angolare. Sotto sono scritti il momento d'inerzia, la velocità angolare, il momento angolare, che resta 10 chilogrammi per metro quadrato al secondo, e l'energia cinetica di rotazione
```

Con le masse a $1{,}0\,\text{m}$ il momento d'inerzia totale è $1{,}0 + 2 \cdot 2{,}0 \cdot 1{,}0^2 = 5{,}0\,\text{kg}\cdot\text{m}^2$ e la piattaforma gira a $2{,}0\,\text{rad/s}$; a $0{,}5\,\text{m}$ il momento d'inerzia scende a $2{,}0\,\text{kg}\cdot\text{m}^2$ e la velocità angolare sale a $5{,}0\,\text{rad/s}$. Il prodotto resta $10\,\text{kg}\cdot\text{m}^2/\text{s}$. L'energia cinetica invece non resta uguale: passa da $10\,\text{J}$ a $25\,\text{J}$.

### L'energia cinetica non si conserva

La pattinatrice che chiude le braccia conserva il momento angolare, ma la sua [energia cinetica di rotazione](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/l-energia-cinetica-di-rotazione-e-il-rotolamento) aumenta. Non c'è contraddizione: per tirare le braccia verso l'asse mentre gira i suoi muscoli devono compiere un lavoro, e quel lavoro, fatto da forze interne, diventa energia cinetica. Le forze interne non possono cambiare $L$, ma possono cambiare $K$.

```ad-example
Esempio 2: quanta energia in più
Di quanto aumenta l'energia cinetica della pattinatrice dell'esempio 1?

Le velocità angolari sono $\omega_1 = 2\pi \cdot 1{,}5\,\text{s}^{-1} = 9{,}425\ldots\,\text{rad/s}$ e $\omega_2 = 2\pi \cdot 4{,}5\,\text{s}^{-1} = 28{,}274\ldots\,\text{rad/s}$.

$$K_1 = \frac{1}{2} I_1\,\omega_1^2 = \frac{1}{2} \cdot 3{,}6\,\text{kg}\cdot\text{m}^2 \cdot (9{,}425\,\text{rad/s})^2 = 159{,}8\ldots\,\text{J} \approx 1{,}6 \cdot 10^2\,\text{J}$$

$$K_2 = \frac{1}{2} I_2\,\omega_2^2 = \frac{1}{2} \cdot 1{,}2\,\text{kg}\cdot\text{m}^2 \cdot (28{,}274\,\text{rad/s})^2 = 479{,}6\ldots\,\text{J} \approx 4{,}8 \cdot 10^2\,\text{J}$$

L'energia è triplicata, come la frequenza: i circa $3{,}2 \cdot 10^2\,\text{J}$ in più sono il lavoro dei muscoli.
```

```ad-warning
Si conserva $I\,\omega$, non $\tfrac{1}{2} I\,\omega^2$
Scrivere $\tfrac{1}{2} I_1\,\omega_1^2 = \tfrac{1}{2} I_2\,\omega_2^2$ per la pattinatrice è sbagliato: darebbe $f_2 = 2{,}6$ giri al secondo al posto di $4{,}5$. Quando un corpo cambia forma mentre ruota, o quando due corpi si uniscono, l'energia cinetica cambia; quello che resta uguale è il momento angolare.
```

## Quando due corpi si uniscono

La conservazione del momento angolare risolve anche gli "urti" tra corpi che ruotano, dove non si sa niente delle forze che agiscono durante il contatto: basta che siano interne al sistema.

### Un disco cade su un altro

Un disco gira intorno al suo asse con velocità angolare $\omega_1$. Un secondo disco, fermo, viene lasciato cadere sopra il primo, sullo stesso asse. All'inizio i due strisciano uno sull'altro; l'attrito frena quello sotto e mette in rotazione quello sopra, finché girano insieme con la stessa velocità angolare $\omega$. L'attrito tra i dischi è una forza interna, quindi

$$I_1\,\omega_1 = (I_1 + I_2)\,\omega \quad\Rightarrow\quad \omega = \frac{I_1}{I_1 + I_2}\,\omega_1$$

È la versione rotante dell'[urto completamente anelastico](/materiale/scuola-superiore/fisica/la-quantita-di-moto/gli-urti-anelastici), in cui due corpi restano attaccati: $m_1 v_1 = (m_1 + m_2)\,V$. Come in quell'urto, una parte dell'energia cinetica si perde, dissipata dall'attrito.

```tikz
% nome: dischi-coassiali-prima-dopo
% alt: A sinistra, prima: un disco orizzontale che ruota con velocità angolare omega 1 intorno all'asse verticale, e sopra di esso un secondo disco più piccolo, fermo, che sta per cadere sul primo lungo lo stesso asse. A destra, dopo: i due dischi appoggiati uno sull'altro ruotano insieme con velocità angolare omega, più piccola
\begin{tikzpicture}
\draw[dashed, thin] (0,-1.0) -- (0,2.3);
\draw[thick, fill=blue!10] (0,0) ellipse (1.7 and 0.5);
\draw[thick, fill=orange!25] (0,1.5) ellipse (1.1 and 0.33);
\draw[-{Stealth}, thin] (1.5,1.4) -- (1.5,0.75);
\draw[-{Stealth}, thick] (-1.1,-0.65) arc[start angle=225, end angle=315, x radius=1.56, y radius=0.46];
\node[right] at (1.2,-0.7) {$\omega_1$};
\node[left] at (-1.75,0) {$I_1$};
\node[left] at (-1.15,1.5) {$I_2$};
\node[below] at (0,-1.1) {prima};
\draw[dashed, thin] (5.2,-1.0) -- (5.2,2.3);
\draw[thick, fill=blue!10] (5.2,0) ellipse (1.7 and 0.5);
\draw[thick, fill=orange!25] (5.2,0.22) ellipse (1.1 and 0.33);
\draw[-{Stealth}, thick] (4.4,-0.6) arc[start angle=240, end angle=300, x radius=1.6, y radius=0.47];
\node[right] at (6.1,-0.7) {$\omega$};
\node[below] at (5.2,-1.1) {dopo};
\end{tikzpicture}
```

```ad-example
Esempio 3: due dischi
Un disco con momento d'inerzia $0{,}040\,\text{kg}\cdot\text{m}^2$ gira a $3{,}5\,\text{rad/s}$. Un secondo disco, fermo, con momento d'inerzia $0{,}016\,\text{kg}\cdot\text{m}^2$, cade sul primo lungo lo stesso asse. Con che velocità angolare girano insieme? Quanta energia cinetica si è persa?

$$\omega = \frac{I_1}{I_1 + I_2}\,\omega_1 = \frac{0{,}040\,\text{kg}\cdot\text{m}^2}{0{,}056\,\text{kg}\cdot\text{m}^2} \cdot 3{,}5\,\text{rad/s} = 2{,}5\,\text{rad/s}$$

Le energie cinetiche prima e dopo:

$$K_i = \frac{1}{2} \cdot 0{,}040\,\text{kg}\cdot\text{m}^2 \cdot (3{,}5\,\text{rad/s})^2 = 0{,}245\,\text{J} \qquad K_f = \frac{1}{2} \cdot 0{,}056\,\text{kg}\cdot\text{m}^2 \cdot (2{,}5\,\text{rad/s})^2 = 0{,}175\,\text{J}$$

Si sono persi $0{,}070\,\text{J}$, poco meno del $30\%$ dell'energia iniziale, finiti in calore per l'attrito tra i dischi.
```

### Un bambino salta sulla giostra

Anche una particella che arriva in linea retta porta momento angolare, se la sua retta non passa per l'asse: rispetto all'asse vale $m\,v\,b$, con $b$ il braccio. Un bambino che corre e salta sul bordo di una giostra ferma, arrivando lungo la tangente, ha il braccio uguale al raggio $r$ della giostra. Dopo il salto giostra e bambino girano insieme, e il bambino, fermo sul bordo, aggiunge al momento d'inerzia della giostra il suo, $m\,r^2$:

$$m\,v\,r = (I + m\,r^2)\,\omega$$

```tikz
% nome: giostra-bambino-salto-tangente
% alt: Una giostra vista dall'alto, un disco di centro O e raggio r. Un bambino, disegnato come una pallina, corre lungo la retta tangente al bordo con velocità v e sta per saltare sulla giostra nel punto di tangenza; il raggio che arriva a quel punto è perpendicolare alla velocità
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) circle (1.6);
\fill (0,0) circle (1.5pt) node[left] {$O$};
\draw[dashed, thin] (1.6,-2.2) -- (1.6,1.2);
\draw[thin] (0,0) -- (1.6,0);
\node[above] at (0.8,0) {$r$};
\draw[thin] (1.4,0) -- (1.4,-0.2) -- (1.6,-0.2);
\draw[-{Stealth}, thick, blue!60!black] (1.6,-1.8) -- (1.6,-0.5);
\node[right] at (1.65,-1.0) {$\vec{v}$};
\draw[thick, fill=blue!10] (1.6,-1.8) circle (0.15);
\node[right] at (1.8,-1.8) {$m$};
\draw[-{Stealth}, thick] (100:1.2) arc[start angle=100, end angle=160, radius=1.2];
\node at (132:0.85) {$\omega$};
\end{tikzpicture}
```

```ad-example
Esempio 4: la giostra del parco
Una giostra è un disco pieno di $120\,\text{kg}$ e raggio $1{,}5\,\text{m}$, fermo, libero di ruotare senza attrito intorno al centro. Un bambino di $25\,\text{kg}$ corre a $4{,}0\,\text{m/s}$ lungo la tangente al bordo e ci salta sopra. Con che velocità angolare parte la giostra?

Il momento d'inerzia della giostra, un disco pieno:

$$I = \frac{1}{2} M r^2 = \frac{1}{2} \cdot 120\,\text{kg} \cdot (1{,}5\,\text{m})^2 = 135\,\text{kg}\cdot\text{m}^2$$

Prima del salto la giostra è ferma e tutto il momento angolare è del bambino:

$$L = m\,v\,r = 25\,\text{kg} \cdot 4{,}0\,\text{m/s} \cdot 1{,}5\,\text{m} = 150\,\text{kg}\cdot\text{m}^2/\text{s}$$

Dopo il salto il momento d'inerzia totale è $I + m\,r^2 = 135\,\text{kg}\cdot\text{m}^2 + 25\,\text{kg} \cdot (1{,}5\,\text{m})^2 = 191{,}25\,\text{kg}\cdot\text{m}^2$, e

$$\omega = \frac{L}{I + m\,r^2} = \frac{150\,\text{kg}\cdot\text{m}^2/\text{s}}{191{,}25\,\text{kg}\cdot\text{m}^2} = 0{,}784\ldots\,\text{rad/s} \approx 0{,}78\,\text{rad/s}$$

cioè un giro ogni $8$ secondi circa.
```

```ad-warning
Il bambino fa parte di quello che gira
Dopo il salto gira anche il bambino, e il suo $m\,r^2$ va sommato al momento d'inerzia della giostra. Dividendo $L$ solo per $I = 135\,\text{kg}\cdot\text{m}^2$ si troverebbe $1{,}1\,\text{rad/s}$, il $40\%$ in più.
```

## Le forze centrali e le orbite

Una forza è **centrale** se è sempre diretta lungo la retta che congiunge il corpo con un punto fisso, il centro. La tensione del filo che tiene un sasso in rotazione è centrale; lo è la [forza di gravità](/materiale/scuola-superiore/fisica/la-gravitazione/la-legge-di-gravitazione-universale) con cui il Sole attira un pianeta, sempre diretta verso il Sole. Rispetto al centro una forza centrale ha braccio zero, perché la sua retta d'azione passa per il polo: il suo momento è nullo, qualunque sia la sua intensità. Quindi

il momento angolare di un corpo soggetto a una forza centrale, calcolato rispetto al centro, si conserva.

Per un pianeta di massa $m$ questo vuol dire che $L = r\,m\,v\sin\varphi$ ha lo stesso valore in tutti i punti dell'orbita. In due punti il conto è semplice: nel **perielio**, il punto dell'orbita più vicino al Sole, e nell'**afelio**, il più lontano, la velocità è perpendicolare alla retta che congiunge il pianeta al Sole, $\sin\varphi = 1$, e

$$m\,v_p\,r_p = m\,v_a\,r_a \quad\Rightarrow\quad v_p\,r_p = v_a\,r_a$$

Dove il pianeta è più vicino al Sole è più veloce, dove è più lontano è più lento.

```tikz
% nome: orbita-perielio-afelio-velocita
% alt: Un'orbita ellittica molto schiacciata, più di quelle vere dei pianeti, con il Sole in un fuoco. Nel perielio, a distanza r con p dal Sole, il pianeta ha una velocità v con p grande e perpendicolare alla congiungente con il Sole; nell'afelio, a distanza r con a più grande, ha una velocità v con a più piccola, anch'essa perpendicolare
\begin{tikzpicture}
\draw[thick] (0,0) ellipse (2.5 and 2.291);
\draw[dashed, thin] (-2.5,0) -- (2.5,0);
\draw[thick, fill=orange!25] (1,0) circle (0.22);
\node[below] at (1,-0.22) {Sole};
\draw[-{Stealth}, thick, blue!60!black] (2.5,0) -- (2.5,1.75) node[right] {$\vec{v}_p$};
\draw[-{Stealth}, thick, blue!60!black] (-2.5,0) -- (-2.5,-0.75) node[left] {$\vec{v}_a$};
\draw[thick, fill=blue!10] (2.5,0) circle (0.1);
\draw[thick, fill=blue!10] (-2.5,0) circle (0.1);
\node[above] at (1.85,0) {$r_p$};
\node[above] at (-0.9,0) {$r_a$};
\node[below right] at (2.5,0) {perielio};
\node[above left] at (-2.5,0) {afelio};
\end{tikzpicture}
```

```ad-example
Esempio 5: la Terra al perielio e all'afelio
All'inizio di gennaio la Terra passa al perielio, a $1{,}47 \cdot 10^{11}\,\text{m}$ dal Sole, con una velocità di $30{,}3\,\text{km/s}$. Con che velocità passa all'afelio, a $1{,}52 \cdot 10^{11}\,\text{m}$, all'inizio di luglio?

$$v_a = \frac{r_p}{r_a}\,v_p = \frac{1{,}47 \cdot 10^{11}\,\text{m}}{1{,}52 \cdot 10^{11}\,\text{m}} \cdot 30{,}3\,\text{km/s} = 29{,}30\ldots\,\text{km/s} \approx 29{,}3\,\text{km/s}$$

Le due distanze compaiono in un rapporto, quindi la velocità si può lasciare in chilometri al secondo. La differenza è di $1\,\text{km/s}$: l'orbita della Terra è quasi una circonferenza.
```

```ad-warning
$v\,r$ costante vale solo dove $\vec{v}$ è perpendicolare a $\vec{r}$
In un punto qualunque dell'orbita la velocità non è perpendicolare alla congiungente con il Sole, e quello che si conserva è $r\,v\sin\varphi$. L'uguaglianza $v_p\,r_p = v_a\,r_a$ lega solo il perielio e l'afelio.
```

Che un pianeta vada più veloce quando è vicino al Sole lo aveva scoperto Keplero dalle osservazioni, molto prima che se ne conoscesse il motivo: è il contenuto della seconda delle [leggi di Keplero](/materiale/scuola-superiore/fisica/la-gravitazione/le-leggi-di-keplero), che nella lezione dedicata troverai enunciata con le aree spazzate dal raggio che unisce il pianeta al Sole. La conservazione del momento angolare ne è la spiegazione.

## Anche la direzione si conserva

Il momento angolare è un vettore diretto lungo l'asse di rotazione, e senza momenti esterni non cambia nemmeno direzione: un corpo che gira tiene fermo il suo asse nello spazio. È il principio del giroscopio, una ruota che gira veloce montata su snodi che la lasciano libera di orientarsi: comunque si muova il supporto, l'asse della ruota continua a puntare nella stessa direzione, e per questo i giroscopi servono a navi, aerei e satelliti per sapere come sono orientati. Per lo stesso motivo un pallone da rugby o un frisbee lanciati con una rotazione volano senza capovolgersi, e l'asse della Terra, mentre il pianeta gira intorno al Sole, resta puntato verso la stessa regione del cielo, vicino alla Stella Polare.

```ad-note
Perché gli elicotteri hanno un'elica sulla coda
Quando il motore mette in rotazione l'elica principale, per la conservazione del momento angolare la cabina tenderebbe a ruotare nel verso opposto: elicottero ed elica, insieme, partono con momento angolare nullo. L'elica di coda spinge l'aria di lato e fornisce il momento esterno che tiene ferma la cabina.
```
