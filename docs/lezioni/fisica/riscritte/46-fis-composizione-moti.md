# La composizione dei moti

Una gru sposta un carico in orizzontale e intanto lo solleva; una barca punta verso la riva opposta di un fiume, ma la corrente la trascina a valle; un passeggero cammina sul tapis roulant di un aeroporto. In tutti e tre i casi il moto che si vede è fatto di due moti che avvengono insieme, e si trova sommandoli come vettori. È la **composizione dei moti**, che usa le componenti della velocità della lezione [Spostamento e velocità nel piano](/materiale/scuola-superiore/fisica/i-moti-nel-piano/spostamento-e-velocita-nel-piano).

## Due moti indipendenti lungo gli assi

Un moto nel piano si può sempre guardare come due moti rettilinei, uno lungo l'asse $x$ e uno lungo l'asse $y$, che avvengono nello stesso tempo: la coordinata $x$ del punto cambia con la sua legge, la coordinata $y$ con la sua. I due moti sono **indipendenti**: quello che succede lungo un asse non cambia quello che succede lungo l'altro. L'unica cosa che hanno in comune è il tempo $t$.

Il gancio di una gru, per esempio, scorre in orizzontale a $0{,}40\,\text{m/s}$ mentre il carico sale a $0{,}30\,\text{m/s}$. Ognuno dei due è un [moto rettilineo uniforme](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-rettilineo-uniforme-e-il-grafico-spazio-tempo), e con l'origine nel punto di partenza le leggi orarie sono

$$x = 0{,}40\,\text{m/s} \cdot t \qquad y = 0{,}30\,\text{m/s} \cdot t$$

Dopo $1\,\text{s}$ il carico è in $(0{,}40\,\text{m};\ 0{,}30\,\text{m})$, dopo $2\,\text{s}$ in $(0{,}80\,\text{m};\ 0{,}60\,\text{m})$, e così via: le posizioni stanno su una retta, e ogni secondo il carico fa lo stesso tratto lungo quella retta.

```tikz
% nome: gru-moti-indipendenti
% alt: Le posizioni di un carico sollevato da una gru a intervalli di un secondo, partendo dall'origine, segnate da 1 a 5 secondi: stanno su una retta obliqua; le loro proiezioni tratteggiate sugli assi avanzano di passi uguali in orizzontale e di passi uguali, più corti, in verticale. All'ultima posizione sono disegnate le velocità vx orizzontale e vy verticale, tratteggiate, e la velocità v obliqua, in blu scuro
% svg: gru-moti-indipendenti-6af9f008.svg 236x184
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (5.4,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,4) node[above] {$y$};
\foreach \t in {1,2,3,4,5} {
  \draw[dashed, thin, gray] (0.8*\t,0.6*\t) -- (0.8*\t,0);
  \draw[dashed, thin, gray] (0.8*\t,0.6*\t) -- (0,0.6*\t);
  \fill (0.8*\t,0.6*\t) circle (1.5pt);
  \node[below left] at (0.8*\t,0.6*\t) {\scriptsize $\t$ s};
}
\fill (0,0) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black, dashed] (4,3) -- (4.8,3);
\draw[-{Stealth}, thick, blue!60!black, dashed] (4,3) -- (4,3.6);
\draw[-{Stealth}, thick, blue!60!black] (4,3) -- (4.8,3.6);
\node[below] at (4.45,3) {\small $\vec{v}_x$};
\node[left] at (4,3.45) {\small $\vec{v}_y$};
\node[right] at (4.8,3.6) {$\vec{v}$};
\end{tikzpicture}
```

La velocità del carico ha le due velocità come componenti, e il suo modulo è

$$v = \sqrt{v_x^2 + v_y^2} = \sqrt{0{,}40^2 + 0{,}30^2}\,\text{m/s} = 0{,}50\,\text{m/s}$$

Quando i due moti sono uniformi, come qui, il moto composto è rettilineo uniforme. Se invece uno dei due è accelerato, la traiettoria si piega: un sasso lanciato in orizzontale avanza a velocità costante e intanto cade sempre più veloce, e disegna una parabola. È la lezione [Il moto di un proiettile lanciato in orizzontale](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/il-moto-di-un-proiettile-lanciato-in-orizzontale).

## La velocità dipende dal riferimento

Un passeggero cammina a $1{,}2\,\text{m/s}$ sul tapis roulant di un aeroporto, che scorre a $0{,}80\,\text{m/s}$. Per chi lo guarda da fermo, a lato del tapis roulant, il passeggero va a $1{,}2 + 0{,}80 = 2{,}0\,\text{m/s}$; per chi sta fermo sul tapis roulant, va a $1{,}2\,\text{m/s}$. Tutte e due le misure sono giuste: la velocità è sempre misurata **rispetto a un sistema di riferimento**, come si è visto per la posizione nella lezione [Punto materiale, traiettoria e sistema di riferimento](/materiale/scuola-superiore/fisica/il-moto-rettilineo/punto-materiale-traiettoria-e-sistema-di-riferimento).

Il passeggero fa due moti insieme: cammina rispetto al tapis roulant, e il tapis roulant lo porta rispetto al pavimento. La sua velocità rispetto al pavimento è la somma vettoriale delle due:

$$\vec{v}_{\text{rispetto al pavimento}} = \vec{v}_{\text{rispetto al tapis roulant}} + \vec{v}_{\text{del tapis roulant}}$$

Quando le due velocità hanno la stessa direzione la somma vettoriale diventa una somma o una differenza di numeri, come nella lezione [Somma e differenza di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori): nello stesso verso i moduli si sommano, in versi opposti si sottraggono.

```ad-example
Esempio 1: contro il tapis roulant
Lo stesso passeggero, che cammina a $1{,}2\,\text{m/s}$, torna indietro sul tapis roulant che scorre a $0{,}80\,\text{m/s}$ nel verso opposto. Quanto è veloce rispetto al pavimento, e quanto tempo gli serve per percorrere un tapis roulant lungo $30\,\text{m}$?

Le due velocità hanno versi opposti: rispetto al pavimento il passeggero va a

$$v = 1{,}2\,\text{m/s} - 0{,}80\,\text{m/s} = 0{,}40\,\text{m/s}$$

nel verso in cui cammina. Rispetto al pavimento deve fare $30\,\text{m}$, e ci mette

$$t = \frac{30\,\text{m}}{0{,}40\,\text{m/s}} = 75\,\text{s}$$

Nel verso del tapis roulant, a $2{,}0\,\text{m/s}$, gli bastano $15\,\text{s}$.
```

```ad-warning
Le velocità si sommano come vettori
La regola "si sommano o si sottraggono" vale solo per velocità con la stessa direzione. Se le direzioni sono diverse si fa la somma vettoriale, e il modulo della somma è più piccolo della somma dei moduli: $1{,}2\,\text{m/s}$ verso nord e $0{,}80\,\text{m/s}$ verso est danno $\sqrt{1{,}2^2 + 0{,}80^2} \approx 1{,}4\,\text{m/s}$, non $2{,}0\,\text{m/s}$.
```

## La barca che attraversa il fiume

Il caso classico di composizione con due direzioni diverse è la barca sul fiume. Le velocità in gioco sono tre:

- $\vec{v}_b$, la velocità della barca rispetto all'acqua, quella che le danno il motore o i remi, diretta dove punta la prua;
- $\vec{v}_c$, la velocità della corrente rispetto alla riva, parallela alla riva;
- $\vec{v}$, la velocità della barca rispetto alla riva, che è quella che si vede da terra:

$$\vec{v} = \vec{v}_b + \vec{v}_c$$

### La prua perpendicolare alla riva

Se la prua punta dritta verso la riva opposta, $\vec{v}_b$ è perpendicolare alla corrente. I due moti sono indipendenti: la barca attraversa il fiume con la velocità $v_b$, come se la corrente non ci fosse, e intanto la corrente la porta a valle con la velocità $v_c$. Per un fiume largo $d$:

- il tempo per attraversarlo dipende solo dalla barca, $t = d / v_b$;
- in quel tempo la corrente sposta la barca a valle di $x = v_c \cdot t$;
- la velocità rispetto alla riva ha modulo $v = \sqrt{v_b^2 + v_c^2}$, e la barca va dritta lungo la diagonale, con un angolo $\beta$ rispetto alla perpendicolare alla riva dato da $\tan\beta = v_c / v_b$.

```tikz
% nome: barca-fiume-prua-perpendicolare
% alt: Un fiume visto dall'alto, largo d, con la corrente verso destra. La barca parte da A sulla riva in basso con la prua verso la riva opposta: la velocità della barca vb è verticale, la velocità della corrente vc è orizzontale, attaccata alla punta di vb, e la velocità risultante v, in arancione, va da A in diagonale. La traiettoria tratteggiata arriva sulla riva opposta nel punto C, a valle del punto B che sta di fronte ad A
% svg: barca-fiume-prua-perpendicolare-8548d182.svg 175x153
\begin{tikzpicture}
\fill[cyan!20] (-0.8,0) rectangle (3.6,3);
\draw[thick] (-0.8,0) -- (3.6,0);
\draw[thick] (-0.8,3) -- (3.6,3);
\draw[-{Stealth}, thin, gray] (2.5,0.5) -- (3.3,0.5);
\draw[-{Stealth}, thin, gray] (-0.7,2.4) -- (0.1,2.4);
\draw[dashed, thin] (0,0) -- (2.25,3);
\draw[dashed, thin, gray] (0,0) -- (0,3);
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (0,1.6);
\node[left] at (0,0.8) {$\vec{v}_b$};
\draw[-{Stealth}, thick, blue!60!black] (0,1.6) -- (1.2,1.6);
\node[above] at (0.6,1.6) {$\vec{v}_c$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (1.2,1.6);
\node[right] at (0.75,0.7) {$\vec{v}$};
\draw (0,0.5) arc[start angle=90, end angle=53.13, radius=0.5];
\node at (0.22,0.66) {\scriptsize $\beta$};
\fill (0,0) circle (1.5pt) node[below] {$A$};
\fill (0,3) circle (1.5pt) node[above] {$B$};
\fill (2.25,3) circle (1.5pt) node[above] {$C$};
\draw[{Stealth}-{Stealth}, thin] (3.3,0) -- (3.3,3);
\node[right] at (3.3,1.5) {$d$};
\end{tikzpicture}
```

```ad-example
Esempio 2: la barca finisce a valle
Un fiume è largo $48\,\text{m}$ e la corrente va a $1{,}2\,\text{m/s}$. Una barca che rispetto all'acqua va a $1{,}6\,\text{m/s}$ parte con la prua perpendicolare alla riva. Quanto tempo impiega ad attraversare? Di quanto la corrente la sposta a valle? Quanto vale la sua velocità rispetto alla riva?

Il tempo dipende solo dalla velocità della barca:

$$t = \frac{d}{v_b} = \frac{48\,\text{m}}{1{,}6\,\text{m/s}} = 30\,\text{s}$$

Nello stesso tempo la corrente la porta a valle di

$$x = v_c \cdot t = 1{,}2\,\text{m/s} \cdot 30\,\text{s} = 36\,\text{m}$$

La velocità rispetto alla riva ha modulo

$$v = \sqrt{1{,}6^2 + 1{,}2^2}\,\text{m/s} = \sqrt{4{,}00}\,\text{m/s} = 2{,}0\,\text{m/s}$$

con $\tan\beta = 1{,}2 / 1{,}6 = 0{,}75$, cioè $\beta \approx 37^\circ$ dalla perpendicolare alla riva. Controllo: la barca percorre la diagonale lunga $\sqrt{48^2 + 36^2} = 60\,\text{m}$ a $2{,}0\,\text{m/s}$, e infatti ci mette $30\,\text{s}$.
```

```ad-warning
La corrente non allunga il tempo di attraversamento
Con la prua perpendicolare alla riva, la corrente sposta la barca a valle ma non la rallenta nell'attraversare: $t = d / v_b$, con la velocità della barca, non $d / v$. Chi divide la larghezza per la velocità risultante, $48 / 2{,}0 = 24\,\text{s}$, mescola una distanza lungo una direzione con una velocità lungo un'altra.
```

### La prua controcorrente

Per arrivare nel punto $B$, proprio di fronte alla partenza, la barca deve puntare un po' controcorrente, in modo che la corrente la riporti sulla perpendicolare. Se la prua forma l'angolo $\alpha$ con la perpendicolare alla riva, la velocità della barca ha una componente controcorrente $v_b \sin\alpha$ e una componente verso l'altra riva $v_b \cos\alpha$. La barca va dritta verso $B$ quando la componente controcorrente annulla la corrente:

$$v_b \sin\alpha = v_c \qquad \text{cioè} \qquad \sin\alpha = \frac{v_c}{v_b}$$

La velocità rispetto alla riva è allora perpendicolare alla riva, con modulo $v = v_b\cos\alpha = \sqrt{v_b^2 - v_c^2}$, e il tempo per attraversare diventa $t = d / v$, più lungo che con la prua dritta. Si può fare solo se la barca è più veloce della corrente: con $v_c \ge v_b$ il seno dovrebbe essere $1$ o più, e la barca finisce comunque a valle.

```tikz
% nome: barca-fiume-prua-controcorrente
% alt: Lo stesso fiume, con la corrente verso destra. La barca parte da A con la prua inclinata di un angolo alfa controcorrente rispetto alla perpendicolare alla riva: la velocità della barca vb va in alto a sinistra, la velocità della corrente vc, orizzontale verso destra, è attaccata alla sua punta, e la velocità risultante v, in arancione, è verticale e porta la barca nel punto B, di fronte ad A
% svg: barca-fiume-prua-controcorrente-1ddde71b.svg 171x153
\begin{tikzpicture}
\fill[cyan!20] (-2.2,0) rectangle (2.2,3);
\draw[thick] (-2.2,0) -- (2.2,0);
\draw[thick] (-2.2,3) -- (2.2,3);
\draw[-{Stealth}, thin, gray] (0.9,0.5) -- (1.7,0.5);
\draw[-{Stealth}, thin, gray] (0.9,2.4) -- (1.7,2.4);
\draw[dashed, thin] (0,0) -- (0,3);
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (-1.5,2);
\node[left] at (-0.75,1) {$\vec{v}_b$};
\draw[-{Stealth}, thick, blue!60!black] (-1.5,2) -- (0,2);
\node[above] at (-0.75,2) {$\vec{v}_c$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (0,2);
\node[right] at (0,1) {$\vec{v}$};
\draw (0,0.6) arc[start angle=90, end angle=126.87, radius=0.6];
\node at (-0.2,0.8) {\scriptsize $\alpha$};
\fill (0,0) circle (1.5pt) node[below] {$A$};
\fill (0,3) circle (1.5pt) node[above] {$B$};
\end{tikzpicture}
```

```ad-example
Esempio 3: arrivare proprio di fronte
Sullo stesso fiume largo $48\,\text{m}$, ora con la corrente a $1{,}5\,\text{m/s}$, una barca va a $2{,}5\,\text{m/s}$ rispetto all'acqua. Di quale angolo deve inclinare la prua controcorrente per arrivare nel punto di fronte alla partenza? Quanto tempo impiega?

$$\sin\alpha = \frac{v_c}{v_b} = \frac{1{,}5}{2{,}5} = 0{,}60 \quad\Rightarrow\quad \alpha = \sin^{-1} 0{,}60 = 36{,}8\ldots^\circ \approx 37^\circ$$

La velocità rispetto alla riva è perpendicolare alla riva, con modulo

$$v = \sqrt{v_b^2 - v_c^2} = \sqrt{2{,}5^2 - 1{,}5^2}\,\text{m/s} = 2{,}0\,\text{m/s}$$

e il tempo è $t = 48\,\text{m} / (2{,}0\,\text{m/s}) = 24\,\text{s}$. Con la prua perpendicolare alla riva la barca avrebbe attraversato in $48 / 2{,}5 = 19{,}2\,\text{s}$, ma sarebbe arrivata $1{,}5 \cdot 19{,}2 \approx 29\,\text{m}$ più a valle.
```

```ad-warning
L'angolo con il seno, non con la tangente
Nel triangolo delle velocità della prua controcorrente l'ipotenusa è $\vec{v}_b$, la velocità della barca, e $\vec{v}_c$ è il cateto opposto ad $\alpha$: quindi $\sin\alpha = v_c/v_b$. La tangente, $\tan\beta = v_c/v_b$, serve nell'altro caso, con la prua perpendicolare, dove l'ipotenusa è la velocità risultante.
```

Nella figura qui sotto cambi la velocità della barca, quella della corrente e l'inclinazione della prua, e fai partire la barca: la traiettoria è sempre una retta, e sotto leggi la velocità rispetto alla riva, il tempo per attraversare e dove la barca tocca l'altra riva.

```interattivo
% nome: barca-fiume-correnti
% alt: Un fiume visto dall'alto, largo 48 metri, con la corrente verso destra. Tre cursori cambiano la velocità della barca rispetto all'acqua, la velocità della corrente e l'angolo della prua controcorrente. Sulla barca sono disegnate la velocità della barca, la velocità della corrente e la velocità risultante in arancione; un bottone fa attraversare la barca, che lascia la sua traiettoria rettilinea. Sotto sono scritti la velocità rispetto alla riva, il tempo di attraversamento e di quanti metri la barca arriva a valle o a monte del punto di fronte alla partenza
```

## Altri moti composti

Lo stesso ragionamento vale per un aereo con il vento: la velocità dell'aereo rispetto a terra è la somma della sua velocità rispetto all'aria e della velocità del vento.

```ad-example
Esempio 4: un aereo con il vento di lato
Un piccolo aereo punta verso nord e vola a $240\,\text{km/h}$ rispetto all'aria; soffia un vento verso est a $70\,\text{km/h}$. Quanto vale la velocità dell'aereo rispetto a terra, e di quanto devia dalla direzione nord?

Le due velocità sono perpendicolari:

$$v = \sqrt{240^2 + 70^2}\,\text{km/h} = \sqrt{62\,500}\,\text{km/h} = 250\,\text{km/h}$$

L'angolo con la direzione nord ha $\tan\beta = 70/240$, quindi $\beta = 16{,}2\ldots^\circ \approx 16^\circ$ verso est. Per andare davvero verso nord il pilota deve puntare il muso un po' verso ovest, come la barca che punta controcorrente.
```

La somma delle velocità tra due sistemi di riferimento che si muovono uno rispetto all'altro torna al terzo anno, in forma generale, nella lezione [Le trasformazioni di Galileo e la composizione delle velocità](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/le-trasformazioni-di-galileo-e-la-composizione-delle-velocita).
