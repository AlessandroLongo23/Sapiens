# Il momento d'inerzia

Prendi una scopa per il manico, a metà, e falla ruotare avanti e indietro con il polso: è facile. Impugnala ora all'estremità del manico e prova a farla oscillare allo stesso ritmo: la scopa è la stessa, la massa è la stessa, eppure la fatica è molto maggiore. Nelle rotazioni non conta solo quanta massa ha un corpo, ma anche dove si trova questa massa rispetto all'asse attorno a cui gira. La grandezza che tiene insieme le due cose è il momento d'inerzia: fa per le rotazioni quello che la massa fa nel [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica).

La lezione usa l'accelerazione angolare $\alpha$ e l'accelerazione tangenziale $a_t = \alpha\,r$ della lezione [Velocità angolare e accelerazione angolare](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/velocita-angolare-e-accelerazione-angolare), e il [momento di una forza](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-momento-di-una-forza-e-di-una-coppia-di-forze) del primo anno.

## Una massa che gira attorno a un asse

Il caso più semplice è una pallina di massa $m$ fissata all'estremità di un'asticella rigida, così leggera che la sua massa si può trascurare. L'altra estremità dell'asticella è imperniata in $O$: la pallina può solo girare attorno a $O$, su una circonferenza di raggio $r$. Sulla pallina agisce una forza $\vec F$ tangente alla circonferenza, cioè perpendicolare all'asticella.

```tikz
% nome: massa-puntiforme-forza-tangente
% alt: Una pallina di massa m all'estremità di un'asticella leggera lunga r, imperniata nel punto O all'altra estremità. Sulla pallina agisce una forza F, in rosso, perpendicolare all'asticella e tangente alla circonferenza tratteggiata su cui la pallina può muoversi; una freccia curva vicino a O indica la rotazione in senso antiorario
\begin{tikzpicture}
\draw[dashed, thin, gray] (-20:3) arc[start angle=-20, end angle=55, radius=3];
\draw[thick] (0,0) -- (3,0);
\draw[thick, fill=blue!10] (3,0) circle (0.2);
\draw[-{Stealth}, thick, red] (3,0) -- (3,1.4) node[right] {$\vec{F}$};
\node[below right] at (3.1,-0.1) {$m$};
\draw[|-|, thin] (0,-0.5) -- (3,-0.5);
\node[below] at (1.5,-0.5) {\small $r$};
\draw[-{Stealth}, thin] (0.7,0.2) arc[start angle=16, end angle=90, radius=0.73];
\draw[thick, fill=white] (0,0) circle (2pt);
\node[left] at (-0.1,0) {$O$};
\end{tikzpicture}
```

Lungo la tangente vale il secondo principio della dinamica: la forza dà alla pallina un'accelerazione tangenziale $a_t$, con $F = m\,a_t$. L'accelerazione tangenziale è legata all'accelerazione angolare da $a_t = \alpha\,r$, quindi

$$F = m\,\alpha\,r$$

La forza è perpendicolare all'asticella, e il suo momento rispetto a $O$ è $M = F\,r$. Moltiplicando per $r$ i due membri dell'uguaglianza si trova

$$M = F\,r = (m\,r^2)\,\alpha$$

A parità di momento, l'accelerazione angolare è tanto più piccola quanto più grande è il prodotto $m\,r^2$. Questo prodotto è il **momento d'inerzia** della pallina rispetto all'asse che passa per $O$:

$$I = m\,r^2$$

Il momento d'inerzia misura quanto un corpo resiste a cambiare la sua velocità angolare, come la massa misura quanto resiste a cambiare la sua velocità. La sua unità di misura è il chilogrammo per metro quadrato, $\text{kg} \cdot \text{m}^2$.

La distanza dall'asse conta più della massa, perché compare al quadrato: raddoppiando la massa della pallina il momento d'inerzia raddoppia, raddoppiando la lunghezza dell'asticella diventa quattro volte più grande. Una pallina di $0{,}050\,\text{kg}$ a $0{,}20\,\text{m}$ dall'asse ha $I = 0{,}050\,\text{kg} \cdot (0{,}20\,\text{m})^2 = 2{,}0 \cdot 10^{-3}\,\text{kg} \cdot \text{m}^2$; la stessa pallina a $0{,}40\,\text{m}$ ha $I = 8{,}0 \cdot 10^{-3}\,\text{kg} \cdot \text{m}^2$.

```ad-warning
La distanza va al quadrato, e in metri
In $I = m\,r^2$ si eleva al quadrato solo la distanza, e la distanza va scritta in metri prima del quadrato. Con $r = 20\,\text{cm}$ lasciato come $20$ il risultato è diecimila volte troppo grande, non cento: l'errore sull'unità si eleva al quadrato anche lui.
```

## Il momento d'inerzia di più masse

Un corpo fatto di più masse puntiformi, tenute insieme da asticelle leggere, ruota tutto con la stessa accelerazione angolare. Ogni massa dà il suo contributo $m\,r^2$, con la propria distanza dall'asse, e il momento d'inerzia del corpo è la somma:

$$I = m_1 r_1^2 + m_2 r_2^2 + m_3 r_3^2 + \ldots$$

Le distanze $r_1$, $r_2$, $\ldots$ sono le distanze delle masse dall'asse di rotazione, non le distanze tra una massa e l'altra, e nemmeno le distanze da un punto qualsiasi del corpo. Per questo il momento d'inerzia non è una proprietà del solo corpo, come la massa: lo stesso corpo ha momenti d'inerzia diversi rispetto ad assi diversi, e ogni volta va detto qual è l'asse.

```ad-example
Esempio 1: un manubrio che gira attorno al centro
Un manubrio è fatto di due sfere di $2{,}0\,\text{kg}$ ciascuna, fissate alle estremità di un'asta leggera lunga $1{,}2\,\text{m}$. Quanto vale il suo momento d'inerzia rispetto a un asse perpendicolare all'asta che passa per il suo centro? Le sfere sono piccole rispetto all'asta e si trattano come masse puntiformi.

Ogni sfera dista dall'asse metà della lunghezza dell'asta: $r_1 = r_2 = 0{,}60\,\text{m}$.

$$
\begin{gathered}
I = m_1 r_1^2 + m_2 r_2^2 \\
= 2{,}0\,\text{kg} \cdot (0{,}60\,\text{m})^2 + 2{,}0\,\text{kg} \cdot (0{,}60\,\text{m})^2 \\
= 1{,}44\,\text{kg} \cdot \text{m}^2 \approx 1{,}4\,\text{kg} \cdot \text{m}^2
\end{gathered}
$$
```

```ad-example
Esempio 2: lo stesso manubrio, un altro asse
Il manubrio dell'esempio 1 ruota ora attorno a un asse perpendicolare all'asta che passa per una delle due sfere. Quanto vale il momento d'inerzia?

```tikz
% nome: manubrio-due-assi
% alt: Lo stesso manubrio, due sfere uguali alle estremità di un'asta leggera lunga 1,2 metri, disegnato due volte. A sinistra l'asse di rotazione, una linea verticale a tratto e punto, passa per il centro dell'asta, e ogni sfera dista 0,60 metri dall'asse. A destra l'asse passa per la sfera di sinistra: quella sfera ha distanza zero, l'altra dista 1,2 metri
\begin{tikzpicture}
\draw[thick] (-1.5,0) -- (1.5,0);
\draw[thick, fill=blue!10] (-1.5,0) circle (0.22);
\draw[thick, fill=blue!10] (1.5,0) circle (0.22);
\draw[thin, dash dot] (0,-0.9) -- (0,1.2);
\node[above] at (0,1.2) {\small asse};
\draw[|-|, thin] (-1.5,-0.6) -- (0,-0.6);
\draw[|-|, thin] (0,-0.6) -- (1.5,-0.6);
\node[below] at (-0.75,-0.6) {\small $0{,}60$ m};
\node[below] at (0.75,-0.6) {\small $0{,}60$ m};
\draw[thick] (4,0) -- (7,0);
\draw[thick, fill=blue!10] (4,0) circle (0.22);
\draw[thick, fill=blue!10] (7,0) circle (0.22);
\draw[thin, dash dot] (4,-0.9) -- (4,1.2);
\node[above] at (4,1.2) {\small asse};
\draw[|-|, thin] (4,-0.6) -- (7,-0.6);
\node[below] at (5.5,-0.6) {\small $1{,}2$ m};
\end{tikzpicture}
```

La sfera che sta sull'asse ha distanza $r_1 = 0$ e non contribuisce; l'altra dista dall'asse tutta la lunghezza dell'asta, $r_2 = 1{,}2\,\text{m}$.

$$
\begin{gathered}
I = m_1 r_1^2 + m_2 r_2^2 = 2{,}0\,\text{kg} \cdot 0^2 + 2{,}0\,\text{kg} \cdot (1{,}2\,\text{m})^2 \\
= 2{,}88\,\text{kg} \cdot \text{m}^2 \approx 2{,}9\,\text{kg} \cdot \text{m}^2
\end{gathered}
$$

Il doppio di prima, con lo stesso manubrio. Una sfera si è avvicinata all'asse di $0{,}60\,\text{m}$ e l'altra si è allontanata di altrettanto, ma i due spostamenti non si compensano: con il quadrato, quello che si guadagna allontanando una massa è più di quello che si perde avvicinando l'altra.
```

```ad-warning
Le distanze si misurano dall'asse
Nell'esempio 2 le due sfere distano tra loro $1{,}2\,\text{m}$ in tutti e due i casi, ma il momento d'inerzia cambia, perché cambiano le distanze dall'asse. Una massa che sta sull'asse non contribuisce, qualunque sia il suo valore.
```

Nella figura qui sotto un'asta leggera imperniata al centro porta due masse uguali, alla stessa distanza $r$ dall'asse. Un motorino applica all'asta un momento costante di $0{,}40\,\text{N} \cdot \text{m}$ per quattro secondi. Scegli la massa e la distanza, avvia, e guarda quanto in fretta l'asta prende velocità quando le masse stanno vicine all'asse e quando stanno lontane.

```interattivo
% nome: asta-masse-momento-inerzia
% alt: Un'asta leggera vista dall'alto, imperniata al centro, con due masse uguali alla stessa distanza dal perno. Due cursori cambiano la distanza di ciascuna massa dall'asse, da 0,4 a 1 metro, e il valore di ciascuna massa, da 0,5 a 2 chilogrammi. Un bottone applica all'asta un momento costante di 0,40 newton per metro per quattro secondi: l'asta comincia a ruotare in senso antiorario, tanto più lentamente quanto più le masse sono lontane dal perno. Sotto si leggono il momento d'inerzia, l'accelerazione angolare, la velocità angolare e i giri fatti
```

Con due masse di $1{,}0\,\text{kg}$ a $0{,}50\,\text{m}$ dall'asse il momento d'inerzia è $0{,}50\,\text{kg} \cdot \text{m}^2$, e dopo quattro secondi l'asta ha fatto circa un giro. Portando le masse a $1{,}0\,\text{m}$, il doppio, il momento d'inerzia diventa $2{,}0\,\text{kg} \cdot \text{m}^2$, quattro volte più grande: con lo stesso momento l'accelerazione angolare è un quarto, e nello stesso tempo l'asta fa appena un quarto di giro. Raddoppiare le masse lasciandole dove sono, invece, dimezza soltanto l'accelerazione angolare.

## I corpi estesi

Una ruota, una porta, una sfera non sono fatte di due o tre masse puntiformi. Si possono però pensare divise in tantissimi pezzetti, ognuno così piccolo da stare tutto alla stessa distanza dall'asse: il momento d'inerzia del corpo è la somma dei contributi $m\,r^2$ di tutti i pezzetti.

In un caso la somma si fa a mente. In un **anello sottile** di massa $M$ e raggio $R$, che gira attorno all'asse perpendicolare al suo piano passante per il centro, tutti i pezzetti stanno alla stessa distanza $R$ dall'asse. Raccogliendo $R^2$ resta la somma delle masse dei pezzetti, che è la massa dell'anello:

$$I = M\,R^2$$

Un disco pieno con la stessa massa e lo stesso raggio ha una parte della massa vicino all'asse, dove contribuisce poco: il suo momento d'inerzia è più piccolo di $M R^2$. Di quanto, lo dice una somma che richiede gli strumenti di matematica del quinto anno; qui prendiamo i risultati già pronti. Per i corpi omogenei di forma semplice il momento d'inerzia è sempre la massa per il quadrato di una lunghezza del corpo, moltiplicata per un numero che dipende dalla forma e dall'asse.

```tikz
% nome: momenti-inerzia-corpi-estesi
% alt: Sei corpi omogenei, ognuno con il suo asse di rotazione disegnato a tratto e punto e la formula del momento d'inerzia. In alto: un anello sottile con l'asse per il centro perpendicolare al suo piano, M R al quadrato; un disco pieno con lo stesso asse, un mezzo di M R al quadrato; una sfera piena con l'asse per il centro, due quinti di M R al quadrato. In basso: un'asta sottile con l'asse perpendicolare per il centro, un dodicesimo di M L al quadrato; un'asta sottile con l'asse perpendicolare per un estremo, un terzo di M L al quadrato; una lamina rettangolare, come una porta, con l'asse lungo un lato, un terzo di M a al quadrato, dove a è il lato perpendicolare all'asse
\begin{tikzpicture}
\draw[very thick] (0,0) ellipse (0.9 and 0.3);
\draw[thin, dash dot] (0,-0.8) -- (0,1.0);
\node at (0,-1.2) {$M R^2$};
\node at (0,-1.75) {\small anello};
\draw[thick, fill=gray!20] (3,0) ellipse (0.9 and 0.3);
\draw[thin, dash dot] (3,-0.8) -- (3,1.0);
\node at (3,-1.2) {$\frac{1}{2} M R^2$};
\node at (3,-1.75) {\small disco};
\draw[thick, fill=gray!20] (6,0.1) circle (0.75);
\draw[thin, dashed] (6,0.1) ellipse (0.75 and 0.2);
\draw[thin, dash dot] (6,-0.8) -- (6,1.1);
\node at (6,-1.2) {$\frac{2}{5} M R^2$};
\node at (6,-1.75) {\small sfera};
\draw[thick, fill=blue!10] (-1,-3.76) rectangle (1,-3.64);
\draw[thin, dash dot] (0,-4.5) -- (0,-2.8);
\node at (0,-4.9) {$\frac{1}{12} M L^2$};
\node at (0,-5.45) {\small asta, per il centro};
\draw[thick, fill=blue!10] (2.4,-3.76) rectangle (4.4,-3.64);
\draw[thin, dash dot] (2.4,-4.5) -- (2.4,-2.8);
\node at (3.4,-4.9) {$\frac{1}{3} M L^2$};
\node at (3.4,-5.45) {\small asta, per un estremo};
\draw[thick, fill=blue!10] (5.8,-4.2) rectangle (6.9,-3.1);
\draw[thin, dash dot] (5.8,-4.55) -- (5.8,-2.4);
\draw[|-|, thin] (5.8,-2.85) -- (6.9,-2.85);
\node[above] at (6.35,-2.85) {\small $a$};
\node at (6.35,-4.9) {$\frac{1}{3} M a^2$};
\node at (6.35,-5.45) {\small lamina};
\end{tikzpicture}
```

| Corpo omogeneo | Asse di rotazione | Momento d'inerzia |
|---|---|---|
| Anello sottile, cilindro cavo a parete sottile | per il centro, perpendicolare al piano dell'anello | $M R^2$ |
| Disco, cilindro pieno | per il centro, perpendicolare al disco | $\frac{1}{2} M R^2$ |
| Sfera piena | per il centro | $\frac{2}{5} M R^2$ |
| Sfera cava a parete sottile | per il centro | $\frac{2}{3} M R^2$ |
| Asta sottile di lunghezza $L$ | perpendicolare all'asta, per il centro | $\frac{1}{12} M L^2$ |
| Asta sottile di lunghezza $L$ | perpendicolare all'asta, per un estremo | $\frac{1}{3} M L^2$ |
| Lamina rettangolare (una porta) | lungo un lato; $a$ è l'altro lato | $\frac{1}{3} M a^2$ |

La tabella conferma quello che dice la definizione. A parità di massa e di raggio, l'anello ha il momento d'inerzia più grande, perché tutta la sua massa sta alla distanza massima dall'asse; il disco ne ha la metà; la sfera cava ne ha più della sfera piena. Nel cilindro la lunghezza non compare: un cilindro pieno è una pila di dischi uguali, tutti con lo stesso asse. La lamina che gira attorno a un lato è, allo stesso modo, una pila di aste che girano attorno a un estremo.

```ad-example
Esempio 3: un disco e un anello con la stessa massa
Il volano di una macchina è un disco pieno di acciaio di massa $3{,}0\,\text{kg}$ e raggio $0{,}20\,\text{m}$, che gira attorno al suo asse. Quanto vale il suo momento d'inerzia? Quanto varrebbe se la stessa massa fosse tutta sul bordo, in un anello dello stesso raggio?

Per il disco

$$I = \frac{1}{2}\,M R^2 = \frac{1}{2} \cdot 3{,}0\,\text{kg} \cdot (0{,}20\,\text{m})^2 = 0{,}060\,\text{kg} \cdot \text{m}^2$$

e per l'anello

$$I = M R^2 = 3{,}0\,\text{kg} \cdot (0{,}20\,\text{m})^2 = 0{,}12\,\text{kg} \cdot \text{m}^2$$

Il doppio. Per questo i volani, che devono opporsi il più possibile alle variazioni di velocità angolare di un motore, hanno la massa concentrata nella corona esterna, e le ruote delle biciclette da corsa, che devono prendere velocità in fretta, hanno cerchi e copertoni più leggeri possibile.
```

```ad-example
Esempio 4: una porta
Una porta di massa $18\,\text{kg}$ è larga $0{,}80\,\text{m}$ e alta $2{,}1\,\text{m}$. Quanto vale il suo momento d'inerzia rispetto all'asse dei cardini?

L'asse dei cardini corre lungo un lato verticale della porta. Nella formula della lamina entra il lato perpendicolare all'asse, cioè la larghezza $a = 0{,}80\,\text{m}$; l'altezza è un dato in più.

$$I = \frac{1}{3}\,M a^2 = \frac{1}{3} \cdot 18\,\text{kg} \cdot (0{,}80\,\text{m})^2 = 3{,}84\,\text{kg} \cdot \text{m}^2 \approx 3{,}8\,\text{kg} \cdot \text{m}^2$$

Una porta alta il doppio, con la stessa massa e la stessa larghezza, avrebbe lo stesso momento d'inerzia: conta solo la distanza della massa dai cardini.
```

```ad-example
Esempio 5: la Terra
La Terra ha massa $M_T = 5{,}97 \cdot 10^{24}\,\text{kg}$ e raggio $R_T = 6{,}37 \cdot 10^6\,\text{m}$. Quanto vale il suo momento d'inerzia rispetto all'asse di rotazione, se la si tratta come una sfera omogenea?

$$
\begin{gathered}
I = \frac{2}{5}\,M_T R_T^2 = \frac{2}{5} \cdot 5{,}97 \cdot 10^{24}\,\text{kg} \cdot (6{,}37 \cdot 10^6\,\text{m})^2 \\
= 9{,}689\ldots \cdot 10^{37}\,\text{kg} \cdot \text{m}^2 \approx 9{,}69 \cdot 10^{37}\,\text{kg} \cdot \text{m}^2
\end{gathered}
$$

Il valore misurato è più piccolo, circa $8{,}0 \cdot 10^{37}\,\text{kg} \cdot \text{m}^2$. La Terra non è omogenea: il nucleo di ferro è molto più denso delle rocce della crosta, e una parte maggiore della massa sta vicino all'asse. Le formule della tabella valgono solo per corpi di densità uniforme.
```

```ad-warning
Ogni formula ha il suo asse
$\frac{1}{2} M R^2$ è il momento d'inerzia di un disco rispetto all'asse che passa per il centro ed è perpendicolare al disco, e a nessun altro. Per la stessa asta la tabella dà due valori, $\frac{1}{12} M L^2$ e $\frac{1}{3} M L^2$, uno il quadruplo dell'altro: prima di scegliere la formula si guarda dove passa l'asse.
```

## Il teorema di Huygens-Steiner

Le formule della tabella riguardano quasi tutte assi che passano per il centro del corpo, che per un corpo omogeneo e simmetrico è il suo [centro di massa](/materiale/scuola-superiore/fisica/la-quantita-di-moto/il-centro-di-massa). Per un asse parallelo a uno di questi, ma spostato, non serve una tabella nuova. Il **teorema di Huygens-Steiner**, o teorema degli assi paralleli, dice che il momento d'inerzia $I$ di un corpo di massa $M$ rispetto a un asse qualsiasi è

$$I = I_{cm} + M\,d^2$$

dove $I_{cm}$ è il momento d'inerzia rispetto all'asse parallelo che passa per il centro di massa e $d$ è la distanza tra i due assi. Il teorema si dimostra con un calcolo sui pezzetti del corpo che qui non riportiamo: lo enunciamo e lo usiamo.

Il termine $M\,d^2$ è positivo, quindi tra tutti gli assi paralleli a una direzione data quello che passa per il centro di massa ha il momento d'inerzia più piccolo. È il motivo per cui la scopa dell'inizio gira più facilmente se la impugni vicino al centro di massa.

Il teorema lega tra loro le due righe dell'asta. L'estremo dista $d = L/2$ dal centro, e

$$I = \frac{1}{12}\,M L^2 + M \left(\frac{L}{2}\right)^2 = \frac{1}{12}\,M L^2 + \frac{1}{4}\,M L^2 = \frac{1}{3}\,M L^2$$

che è proprio il valore della tabella per l'asse a un estremo.

```ad-example
Esempio 6: un disco appeso a un chiodo
Un disco di legno di massa $2{,}0\,\text{kg}$ e raggio $0{,}30\,\text{m}$ è appeso al muro con un chiodo che lo attraversa in un punto $A$ del bordo, e può oscillare attorno al chiodo. Quanto vale il suo momento d'inerzia rispetto all'asse del chiodo?

```tikz
% nome: disco-asse-sul-bordo
% alt: Un disco visto di fronte, con il centro di massa segnato al centro e il punto A sul bordo, in alto, dove passa il chiodo. I due assi, quello per il centro di massa e quello per A, sono perpendicolari al foglio; la loro distanza d, segnata da un segmento arancione, è uguale al raggio R del disco
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) circle (1.5);
\draw[thick, orange!90!black] (0,0) -- (0,1.5);
\node[orange!90!black, right] at (0,0.75) {$d = R$};
\fill (0,0) circle (1.5pt) node[below] {$CM$};
\draw[thick, fill=white] (0,1.5) circle (2pt);
\node[above] at (0,1.55) {$A$};
\end{tikzpicture}
```

L'asse del chiodo è perpendicolare al disco, come l'asse per il centro della tabella, e gli è parallelo. Il centro di massa del disco è il suo centro, e il chiodo sta sul bordo: la distanza tra i due assi è il raggio, $d = R = 0{,}30\,\text{m}$.

$$I_{cm} = \frac{1}{2}\,M R^2 = \frac{1}{2} \cdot 2{,}0\,\text{kg} \cdot (0{,}30\,\text{m})^2 = 0{,}090\,\text{kg} \cdot \text{m}^2$$

$$
\begin{gathered}
I = I_{cm} + M\,d^2 = 0{,}090\,\text{kg} \cdot \text{m}^2 + 2{,}0\,\text{kg} \cdot (0{,}30\,\text{m})^2 \\
= 0{,}090\,\text{kg} \cdot \text{m}^2 + 0{,}18\,\text{kg} \cdot \text{m}^2 = 0{,}27\,\text{kg} \cdot \text{m}^2
\end{gathered}
$$

Tre volte il valore rispetto all'asse per il centro: in lettere, $I = \frac{1}{2} M R^2 + M R^2 = \frac{3}{2} M R^2$.
```

```ad-warning
Il teorema parte dal centro di massa
In $I = I_{cm} + M d^2$ il primo termine è il momento d'inerzia rispetto all'asse per il centro di massa. Non si può partire da un asse qualsiasi: per passare dall'estremo di un'asta a un altro punto si torna prima al centro, con $\frac{1}{12} M L^2$, e da lì ci si sposta. I due assi, poi, devono essere paralleli.
```

## I corpi composti

Il momento d'inerzia è una somma di contributi, uno per ogni pezzo di massa. Se un corpo è fatto di più parti che girano attorno allo stesso asse, il suo momento d'inerzia è quindi la somma dei momenti d'inerzia delle parti, calcolati tutti rispetto a quell'asse.

```ad-example
Esempio 7: la giostra con un bambino
La piattaforma di una giostra è un disco di massa $135\,\text{kg}$ e raggio $1{,}6\,\text{m}$, che gira attorno all'asse verticale per il centro. Un bambino di $25\,\text{kg}$ è seduto a $1{,}2\,\text{m}$ dal centro. Quanto vale il momento d'inerzia della giostra con il bambino?

```tikz
% nome: giostra-disco-bambino
% alt: La piattaforma di una giostra vista dall'alto, un disco di raggio 1,6 metri con il centro O; un bambino, disegnato come un punto, è seduto a 1,2 metri dal centro. Scala di 1 centimetro per 0,8 metri
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) circle (2);
\fill (0,0) circle (1.5pt) node[below left] {$O$};
\draw[thin] (0,0) -- (30:1.5);
\draw[thick, fill=blue!10] (30:1.5) circle (0.15);
\node[below right] at (30:0.6) {\small $1{,}2$ m};
\draw[|-|, thin] (0,-2.3) -- (2,-2.3);
\node[below] at (1,-2.3) {\small $1{,}6$ m};
\draw[-{Stealth}, thin] (150:1.2) arc[start angle=150, end angle=200, radius=1.2];
\end{tikzpicture}
```

La piattaforma è un disco che gira attorno al suo asse:

$$I_{disco} = \frac{1}{2}\,M R^2 = \frac{1}{2} \cdot 135\,\text{kg} \cdot (1{,}6\,\text{m})^2 = 172{,}8\,\text{kg} \cdot \text{m}^2$$

Il bambino si tratta come una massa puntiforme a distanza $r = 1{,}2\,\text{m}$ dallo stesso asse:

$$I_{bambino} = m\,r^2 = 25\,\text{kg} \cdot (1{,}2\,\text{m})^2 = 36\,\text{kg} \cdot \text{m}^2$$

$$
\begin{gathered}
I = I_{disco} + I_{bambino} = 172{,}8\,\text{kg} \cdot \text{m}^2 + 36\,\text{kg} \cdot \text{m}^2 \\
= 208{,}8\,\text{kg} \cdot \text{m}^2 \approx 2{,}1 \cdot 10^2\,\text{kg} \cdot \text{m}^2
\end{gathered}
$$

Il raggio ha due cifre significative, e il risultato si arrotonda a due. Se il bambino si sposta verso il centro il suo contributo diminuisce, e il momento d'inerzia dell'insieme con lui: è quello che fa una pattinatrice quando chiude le braccia, come racconta la lezione [La conservazione del momento angolare](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/la-conservazione-del-momento-angolare).
```

## Massa e momento d'inerzia a confronto

| | Moto su una retta | Rotazione attorno a un asse |
|---|---|---|
| Che cosa misura l'inerzia | la massa $m$ | il momento d'inerzia $I$ |
| Unità di misura | $\text{kg}$ | $\text{kg} \cdot \text{m}^2$ |
| Da che cosa dipende | solo dal corpo | dal corpo e dall'asse |
| Per un corpo fatto di parti | somma delle masse | somma dei momenti d'inerzia rispetto allo stesso asse |

Per una pallina sola abbiamo trovato $M = (m\,r^2)\,\alpha$. Che la stessa legge valga per qualsiasi corpo rigido, con il momento d'inerzia al posto di $m\,r^2$, lo mostra la lezione [Momento torcente e dinamica delle rotazioni](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/momento-torcente-e-dinamica-delle-rotazioni); il momento d'inerzia torna poi nell'[energia cinetica di rotazione](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/l-energia-cinetica-di-rotazione-e-il-rotolamento).
