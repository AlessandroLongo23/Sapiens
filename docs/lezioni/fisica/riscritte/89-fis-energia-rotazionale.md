# L'energia cinetica di rotazione e il rotolamento

Capovolgi una bicicletta e fai girare forte la ruota davanti: la bicicletta è ferma, il centro della ruota non si sposta di un millimetro, eppure per fermare la ruota con la mano devi fare fatica. La ruota ha energia cinetica anche se non va da nessuna parte, perché ogni suo punto si muove. In questa lezione calcoliamo l'energia di un corpo che ruota, poi quella di un corpo che rotola, e con la conservazione dell'energia troviamo chi arriva prima in fondo a una discesa tra un anello, un cilindro e una sfera.

## L'energia cinetica di un corpo che ruota

Un corpo rigido che ruota intorno a un asse fisso con [velocità angolare](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/velocita-angolare-e-accelerazione-angolare) $\omega$ è fatto di tanti pezzetti, ognuno con la sua massa $m_i$ e la sua distanza $r_i$ dall'asse. Tutti i pezzetti hanno la stessa velocità angolare, ma non la stessa velocità: quello a distanza $r_i$ percorre una circonferenza di raggio $r_i$ con velocità $v_i = \omega\,r_i$, quindi i punti lontani dall'asse sono più veloci di quelli vicini.

```tikz
% nome: disco-rotazione-velocita-punti
% alt: Un disco che ruota in senso antiorario intorno al centro O con velocità angolare omega. Due punti del disco, uno a distanza r1 dal centro e uno a distanza r2 doppia, hanno velocità tangenti alla loro circonferenza: la freccia del punto più lontano è lunga il doppio
% svg: disco-rotazione-velocita-punti-b6ff398b.svg 184x176
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (2);
\draw[dashed, thin] (0,0) circle (0.9);
\draw[dashed, thin] (0,0) circle (1.8);
\draw[thin] (0,0) -- (30:1.8);
\draw[thin] (0,0) -- (150:0.9);
\fill (0,0) circle (1.5pt) node[below] {$O$};
\fill (30:1.8) circle (1.5pt);
\fill (150:0.9) circle (1.5pt);
\node at (1.36,0.47) {$r_2$};
\node at (-0.25,0.48) {$r_1$};
\draw[-{Stealth}, thick, blue!60!black] (30:1.8) -- ++(120:1.26) node[above] {$\vec{v}_2$};
\draw[-{Stealth}, thick, blue!60!black] (150:0.9) -- ++(240:0.63) node[below] {$\vec{v}_1$};
\draw[-{Stealth}, thick] (-40:2.3) arc[start angle=-40, end angle=5, radius=2.3] node[right] {$\omega$};
\end{tikzpicture}
```

L'[energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) del corpo è la somma di quelle dei pezzetti:

$$K = \frac{1}{2} m_1 v_1^2 + \frac{1}{2} m_2 v_2^2 + \ldots$$

e, sostituendo $v_i = \omega\,r_i$,

$$K = \frac{1}{2} m_1 r_1^2\,\omega^2 + \frac{1}{2} m_2 r_2^2\,\omega^2 + \ldots$$

In tutti i termini compare $\tfrac{1}{2}\omega^2$, che si raccoglie:

$$K = \frac{1}{2}\left(m_1 r_1^2 + m_2 r_2^2 + \ldots\right)\omega^2$$

La somma tra parentesi è il [momento d'inerzia](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/il-momento-d-inerzia) $I$ del corpo rispetto all'asse. L'**energia cinetica di rotazione** è quindi

$$K_{rot} = \frac{1}{2} I\,\omega^2$$

con $I$ in $\text{kg}\cdot\text{m}^2$, $\omega$ in $\text{rad/s}$ e il risultato in joule. La formula ha la stessa forma di $K = \tfrac{1}{2} m v^2$: al posto della massa c'è il momento d'inerzia, al posto della velocità la velocità angolare. Non è una forma nuova di energia, è la solita energia cinetica contata per un corpo che gira.

I momenti d'inerzia che servono in questa lezione sono quelli dei corpi rotondi di massa $m$ e raggio $r$ che ruotano intorno al proprio asse:

| Corpo | Momento d'inerzia |
|---|---|
| anello sottile, cilindro cavo sottile | $I = m r^2$ |
| disco, cilindro pieno | $I = \tfrac{1}{2} m r^2$ |
| sfera piena | $I = \tfrac{2}{5} m r^2$ |
| sfera cava sottile | $I = \tfrac{2}{3} m r^2$ |

```ad-example
Esempio 1: una mola che gira
Una mola da banco è un disco pieno di $2{,}0\,\text{kg}$ con il raggio di $10\,\text{cm}$, e fa $15$ giri al secondo. Quanta energia cinetica ha?

Il momento d'inerzia del disco, con $r = 0{,}10\,\text{m}$:

$$I = \frac{1}{2} m r^2 = \frac{1}{2} \cdot 2{,}0\,\text{kg} \cdot (0{,}10\,\text{m})^2 = 0{,}010\,\text{kg}\cdot\text{m}^2$$

La velocità angolare: ogni giro è un angolo di $2\pi$ radianti, quindi

$$\omega = 2\pi f = 2\pi \cdot 15\,\text{s}^{-1} = 94{,}2\ldots\,\text{rad/s}$$

L'energia cinetica di rotazione:

$$K_{rot} = \frac{1}{2} I\,\omega^2 = \frac{1}{2} \cdot 0{,}010\,\text{kg}\cdot\text{m}^2 \cdot (94{,}2\,\text{rad/s})^2 = 44{,}4\ldots\,\text{J} \approx 44\,\text{J}$$

È l'energia di un sasso di $1\,\text{kg}$ che cade da quattro metri e mezzo.
```

```ad-warning
I giri non sono radianti
Nella formula $\omega$ va in radianti al secondo. Se il testo dà i giri al secondo si moltiplica per $2\pi$; se dà i giri al minuto prima si divide per $60$. Con $\omega = 15$ al posto di $94{,}2$ l'energia della mola verrebbe $1{,}1\,\text{J}$, quaranta volte più piccola.
```

### Il lavoro di un momento

Per far girare la mola, o per fermarla, serve un [momento](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/momento-torcente-e-dinamica-delle-rotazioni). Una forza $F$ applicata sul bordo, tangente alla circonferenza, sposta il suo punto di applicazione lungo un arco $s = r\,\theta$ quando il corpo ruota di un angolo $\theta$ (in radianti), e compie il [lavoro](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza) $W = F s = F r\,\theta$. Il prodotto $F r$ è il momento $M$ della forza, quindi

$$W = M\,\theta$$

Come per il moto di un punto, il lavoro totale è uguale alla variazione dell'energia cinetica: $W = \Delta K_{rot}$. La mola dell'esempio 1, spento il motore, si ferma per un momento frenante di $0{,}50\,\text{N}\cdot\text{m}$: il lavoro del momento deve togliere tutti i $44{,}4\,\text{J}$, quindi $\theta = 44{,}4\,\text{J} / 0{,}50\,\text{N}\cdot\text{m} \approx 89\,\text{rad}$, cioè circa $14$ giri.

## Il rotolamento senza strisciamento

Una ruota di bicicletta che corre sull'asfalto fa due cose insieme: il suo centro avanza e la ruota gira intorno al centro. Finché la gomma fa presa, i due moti sono legati. In un giro completo ogni punto del battistrada tocca terra una volta sola, e la ruota avanza di una lunghezza uguale alla sua circonferenza, $2\pi r$: si dice che la ruota **rotola senza strisciare**. In generale, se la ruota gira di un angolo $\theta$, il centro avanza di un tratto uguale all'arco che si è appoggiato sul terreno:

$$s = r\,\theta$$

```tikz
% nome: rotolamento-arco-uguale-spostamento
% alt: Una ruota di raggio r disegnata in due posizioni su un piano orizzontale. Nella prima un punto colorato del bordo tocca terra; nella seconda, dopo mezzo giro, lo stesso punto è in cima. Il centro si è spostato di un tratto s uguale a metà circonferenza, cioè all'arco che si è appoggiato sul terreno
% svg: rotolamento-arco-uguale-spostamento-7cec9039.svg 201x74
\begin{tikzpicture}
\draw[thick] (-1,0) -- (4.2,0);
\foreach \x in {-0.85,-0.7,...,4.2} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0,0.6) circle (0.6);
\draw[thick, dashed, fill=blue!10] (1.885,0.6) circle (0.6);
\fill (0,0.6) circle (1.5pt);
\fill (1.885,0.6) circle (1.5pt);
\draw[thin] (0,0.6) -- (0,0);
\draw[thin] (1.885,0.6) -- (1.885,1.2);
\fill[orange!90!black] (0,0) circle (2.2pt);
\fill[orange!90!black] (1.885,1.2) circle (2.2pt);
\node[left] at (0,0.32) {$r$};
\draw[-{Stealth}, thick, blue] (0,0.6) -- (1.885,0.6);
\node[above] at (0.95,1.25) {$s = r\,\theta$};
\draw[-{Stealth}, thick] (2.75,0.95) arc[start angle=22, end angle=-50, radius=0.93];
\node[right] at (2.8,0.5) {$\theta$};
\end{tikzpicture}
```

Dividendo per il tempo impiegato, lo spostamento del centro diventa la sua velocità e l'angolo diventa la velocità angolare. La **condizione di rotolamento senza strisciamento** è

$$v_{cm} = \omega\,r$$

dove $v_{cm}$ è la velocità del centro della ruota, che è anche il suo [centro di massa](/materiale/scuola-superiore/fisica/la-quantita-di-moto/il-centro-di-massa). La formula somiglia a $v = \omega r$ del [moto circolare](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme), ma dice una cosa diversa: lì $v$ era la velocità di un punto che gira intorno a un centro fermo, qui è la velocità con cui avanza il centro.

La velocità di ogni punto della ruota è la somma di due velocità: quella del centro, $\vec{v}_{cm}$, uguale per tutti, e quella del giro intorno al centro, che sul bordo vale $\omega r = v_{cm}$ ed è tangente alla ruota. In cima le due hanno lo stesso verso, e il punto va a $2 v_{cm}$. Nel punto di contatto hanno versi opposti e si cancellano: il punto che tocca terra, in quell'istante, è fermo. È per questo che l'impronta di uno pneumatico sulla neve è nitida e non strisciata.

```tikz
% nome: rotolamento-velocita-punti-ruota
% alt: Una ruota che rotola verso destra su un piano orizzontale, con il verso di rotazione orario. Il centro ha velocità v con cm, il punto più alto ha una velocità doppia nello stesso verso, il punto di contatto con il terreno ha velocità zero
% svg: rotolamento-velocita-punti-ruota-c298073c.svg 231x127
\begin{tikzpicture}
\draw[thick] (-2,0) -- (4,0);
\foreach \x in {-1.85,-1.7,...,4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0,1.2) circle (1.2);
\draw[dashed, thin] (0,0) -- (0,2.4);
\fill (0,1.2) circle (1.5pt);
\fill (0,2.4) circle (1.5pt);
\fill (0,0) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black] (0,1.2) -- (1.3,1.2) node[right] {$\vec{v}_{cm}$};
\draw[-{Stealth}, thick, blue!60!black] (0,2.4) -- (2.6,2.4) node[right] {$2\,\vec{v}_{cm}$};
\node[below] at (0,-0.15) {$v = 0$};
\draw[-{Stealth}, thick] (-0.82,0.63) arc[start angle=215, end angle=140, radius=1];
\node[left] at (-1.25,1.2) {$\omega$};
\end{tikzpicture}
```

```ad-warning
Se la ruota slitta la condizione non vale
$v_{cm} = \omega r$ vale solo finché il punto di contatto non scivola. Un'auto che sgomma sul ghiaccio ha le ruote che girano forte e il centro quasi fermo, $\omega r > v_{cm}$; una che frena con le ruote bloccate ha $\omega = 0$ e scivola in avanti. In tutti e due i casi c'è strisciamento, e l'attrito dinamico dissipa energia.
```

## L'energia cinetica di un corpo che rotola

Un corpo che rotola ha due energie cinetiche: quella del moto del centro di massa, come se tutta la massa fosse concentrata lì, e quella della rotazione intorno al centro di massa. La somma è l'energia cinetica totale (il risultato si enuncia: la dimostrazione generale non è nei programmi del terzo anno):

$$K = \frac{1}{2} m\,v_{cm}^2 + \frac{1}{2} I\,\omega^2$$

Se il corpo rotola senza strisciare, $\omega = v_{cm}/r$ e le due parti non sono indipendenti. Per i corpi rotondi il momento d'inerzia ha sempre la forma $I = c\,m r^2$, con un numero $c$ che dipende solo da come la massa è distribuita ($1$ per l'anello, $\tfrac{1}{2}$ per il cilindro pieno, $\tfrac{2}{5}$ per la sfera piena, $\tfrac{2}{3}$ per la sfera cava). Sostituendo,

$$K_{rot} = \frac{1}{2}\,c\,m r^2 \cdot \frac{v_{cm}^2}{r^2} = c \cdot \frac{1}{2} m\,v_{cm}^2$$

il raggio si semplifica: l'energia di rotazione è $c$ volte quella di traslazione, e l'energia totale è

$$K = (1 + c)\,\frac{1}{2} m\,v_{cm}^2$$

| Corpo che rotola | $c$ | Energia totale | Parte di rotazione |
|---|---|---|---|
| anello | $1$ | $m\,v_{cm}^2$ | $\tfrac{1}{2}$ |
| sfera cava | $\tfrac{2}{3}$ | $\tfrac{5}{6}\,m\,v_{cm}^2$ | $\tfrac{2}{5}$ |
| cilindro pieno | $\tfrac{1}{2}$ | $\tfrac{3}{4}\,m\,v_{cm}^2$ | $\tfrac{1}{3}$ |
| sfera piena | $\tfrac{2}{5}$ | $\tfrac{7}{10}\,m\,v_{cm}^2$ | $\tfrac{2}{7}$ |

A parità di massa e di velocità, un anello che rotola ha il doppio dell'energia di un blocco che scivola, perché tutta la sua massa sta sul bordo e gira alla velocità massima.

```ad-example
Esempio 2: una palla da bowling
Una palla da bowling di $7{,}2\,\text{kg}$ rotola senza strisciare sulla pista a $4{,}0\,\text{m/s}$. Quanto valgono l'energia cinetica di traslazione, quella di rotazione e quella totale?

La palla è una sfera piena, $I = \tfrac{2}{5} m r^2$. L'energia di traslazione:

$$\frac{1}{2} m\,v_{cm}^2 = \frac{1}{2} \cdot 7{,}2\,\text{kg} \cdot (4{,}0\,\text{m/s})^2 = 57{,}6\,\text{J} \approx 58\,\text{J}$$

Quella di rotazione è i due quinti:

$$K_{rot} = \frac{2}{5} \cdot 57{,}6\,\text{J} = 23{,}04\,\text{J} \approx 23\,\text{J}$$

In totale $K = 57{,}6\,\text{J} + 23{,}04\,\text{J} = 80{,}64\,\text{J} \approx 81\,\text{J}$. Il raggio della palla non è servito.
```

## Giù per un piano inclinato

Un cilindro parte da fermo in cima a un piano inclinato e rotola senza strisciare fino in fondo, scendendo di un dislivello $h$. Le forze sul cilindro sono il peso, la reazione normale del piano e l'[attrito statico](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito), che è la forza che lo fa girare: su un piano perfettamente liscio il cilindro scivolerebbe senza ruotare. La normale è perpendicolare al moto e non lavora. Nemmeno l'attrito statico lavora, perché è applicato nel punto di contatto, che in ogni istante è fermo. Lavora solo il peso, quindi l'[energia meccanica si conserva](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica).

```tikz
% nome: cilindro-rotola-piano-inclinato
% alt: Un piano inclinato di un angolo beta. In cima un cilindro fermo, visto di lato come un cerchio; in fondo lo stesso cilindro, tratteggiato, con la velocità del centro v con cm parallela al piano. Due linee orizzontali tratteggiate segnano il dislivello h tra le due posizioni del centro
% svg: cilindro-rotola-piano-inclinato-39119d32.svg 224x108
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) -- (4.33,0) -- (4.33,2.5) -- cycle;
\draw (0.9,0) arc[start angle=0, end angle=30, radius=0.9];
\node at (1.2,0.28) {$\beta$};
\draw[thick, fill=blue!10] (3.661,2.460) circle (0.3);
\fill (3.661,2.460) circle (1.2pt);
\draw[thick, dashed, fill=blue!10] (1.409,1.160) circle (0.3);
\fill (1.409,1.160) circle (1.2pt);
\draw[-{Stealth}, thick, blue!60!black] (1.409,1.160) -- ++(210:0.9) node[above left] {$\vec{v}_{cm}$};
\draw[dashed, thin] (3.661,2.460) -- (5.4,2.460);
\draw[dashed, thin] (1.409,1.160) -- (5.4,1.160);
\draw[{Stealth}-{Stealth}, thin] (5.2,1.160) -- (5.2,2.460) node[midway, right] {$h$};
\draw[-{Stealth}, thick] (3.05,2.75) arc[start angle=150, end angle=215, radius=0.55];
\end{tikzpicture}
```

In cima l'energia è tutta potenziale, $m g h$ rispetto al punto di arrivo. In fondo è tutta cinetica, di traslazione e di rotazione insieme:

$$m g h = (1 + c)\,\frac{1}{2} m\,v_{cm}^2 \quad\Rightarrow\quad v_{cm} = \sqrt{\frac{2 g h}{1 + c}}$$

La massa si semplifica, e il raggio era già sparito: la velocità di arrivo dipende solo dal dislivello e dalla forma del corpo, attraverso $c$. Un corpo che scivola senza attrito ha $c = 0$ e arriva a $\sqrt{2 g h}$; uno che rotola arriva sempre più lento, perché una parte dell'energia potenziale è andata a farlo girare.

```ad-example
Esempio 3: un cilindro in discesa
Un cilindro pieno parte da fermo e rotola senza strisciare lungo una discesa, scendendo di $0{,}80\,\text{m}$. Con che velocità arriva in fondo?

Per il cilindro pieno $c = \tfrac{1}{2}$, quindi $1 + c = 1{,}5$:

$$v_{cm} = \sqrt{\frac{2 g h}{1 + c}} = \sqrt{\frac{2 \cdot 9{,}8\,\text{m/s}^2 \cdot 0{,}80\,\text{m}}{1{,}5}} = \sqrt{10{,}45\ldots}\,\text{m/s} = 3{,}23\ldots\,\text{m/s} \approx 3{,}2\,\text{m/s}$$

Un blocco che scivolasse senza attrito dalla stessa altezza arriverebbe a $\sqrt{2 \cdot 9{,}8 \cdot 0{,}80}\,\text{m/s} \approx 4{,}0\,\text{m/s}$.
```

```ad-warning
L'energia di rotazione non si dimentica
Scrivere $m g h = \tfrac{1}{2} m v^2$ per un corpo che rotola è l'errore più comune: dà la velocità di un corpo che scivola, $\sqrt{2gh}$, troppo grande. In fondo alla discesa l'energia potenziale si è divisa in due parti, e nell'equazione ci vanno tutte e due.
```

### L'accelerazione lungo il piano

Se il piano è inclinato di un angolo $\beta$ (in queste lezioni $\alpha$ è l'accelerazione angolare) ed è lungo $l$, il dislivello è $h = l\sin\beta$. Il centro di massa scende con accelerazione costante, e per un moto uniformemente accelerato che parte da fermo $v^2 = 2 a l$. Confrontando con $v_{cm}^2 = 2 g h/(1 + c) = 2 g\,l\sin\beta/(1 + c)$ si trova

$$a = \frac{g\sin\beta}{1 + c}$$

È l'accelerazione $g\sin\beta$ del [corpo che scivola su un piano liscio](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/il-moto-lungo-un-piano-inclinato), divisa per $1 + c$.

## La gara tra anello, cilindro e sfera

Un anello, un cilindro pieno e una sfera piena partono insieme, da fermi, dalla cima dello stesso piano inclinato. Vince chi ha l'accelerazione più grande, cioè il numero $c$ più piccolo:

| Corpo | $c$ | Accelerazione | Velocità in fondo |
|---|---|---|---|
| blocco che scivola senza attrito | $0$ | $g\sin\beta$ | $\sqrt{2 g h}$ |
| sfera piena | $\tfrac{2}{5}$ | $\tfrac{5}{7}\,g\sin\beta$ | $\sqrt{\tfrac{10}{7}\,g h}$ |
| cilindro pieno | $\tfrac{1}{2}$ | $\tfrac{2}{3}\,g\sin\beta$ | $\sqrt{\tfrac{4}{3}\,g h}$ |
| sfera cava | $\tfrac{2}{3}$ | $\tfrac{3}{5}\,g\sin\beta$ | $\sqrt{\tfrac{6}{5}\,g h}$ |
| anello | $1$ | $\tfrac{1}{2}\,g\sin\beta$ | $\sqrt{g h}$ |

La sfera piena arriva prima, poi il cilindro, ultimo l'anello. Il risultato non dipende né dalla massa né dal raggio: una biglia di vetro e una palla da bowling arrivano insieme, e tutte e due battono qualunque cilindro e qualunque anello. Conta solo quanta parte della massa sta lontano dall'asse, perché quella è la massa che per girare si prende più energia.

```tikz
% nome: gara-rotolamento-sfera-cilindro-anello
% alt: Un piano inclinato lungo con tre corpi partiti insieme dalla cima, disegnati nello stesso istante: la sfera piena è quasi in fondo, il cilindro pieno è poco più indietro, l'anello è molto più indietro. Un cerchio tratteggiato in cima segna la partenza
% svg: gara-rotolamento-sfera-cilindro-anello-c150a69b.svg 276x128
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) -- (6.578,0) -- (6.578,2.394) -- cycle;
\draw (1.0,0) arc[start angle=0, end angle=20, radius=1.0];
\node at (1.3,0.2) {$\beta$};
\draw[thick, fill=orange!25] (0.589,0.427) circle (0.2);
\draw[thick, fill=blue!10] (0.972,0.567) circle (0.2);
\draw[thick] (2.309,1.053) circle (0.2);
\draw[thick] (2.309,1.053) circle (0.14);
\draw[thin] (0.589,0.627) -- (0.3,1.5) node[above] {\small sfera};
\draw[thin] (0.972,0.767) -- (1.3,1.9) node[above] {\small cilindro};
\draw[thin] (2.309,1.253) -- (2.6,2.3) node[above] {\small anello};
\draw[dashed, thin] (6.322,2.514) circle (0.2);
\node[above] at (6.322,2.72) {\small partenza};
\end{tikzpicture}
```

Nella figura qui sotto scegli l'inclinazione del piano e fai partire la gara: accanto alla sfera, al cilindro e all'anello c'è anche un blocco che scivola senza attrito. La domanda è chi arriva prima, e se l'ordine cambia quando il piano diventa più ripido.

```interattivo
% nome: rotolamento-gara-piano-inclinato
% alt: Un piano inclinato lungo 2 metri con quattro corsie viste di lato una sopra l'altra: un blocco che scivola senza attrito, una sfera piena, un cilindro pieno e un anello, che rotolano senza strisciare. Un cursore sceglie l'inclinazione da 10 a 40 gradi e un bottone fa partire tutti insieme. Accanto a ogni corpo sono scritte l'accelerazione e il tempo di arrivo
```

L'ordine di arrivo è sempre lo stesso: blocco, sfera, cilindro, anello. Con il piano più ripido tutti i tempi si accorciano, ma i loro rapporti non cambiano, perché l'angolo entra nello stesso modo in tutte le accelerazioni.

```ad-example
Esempio 4: i tempi della gara
Una sfera piena e un anello partono da fermi dalla cima di un piano lungo $2{,}0\,\text{m}$ e inclinato di $30^\circ$, e rotolano senza strisciare. Quanto impiega ciascuno ad arrivare in fondo?

Con $\sin 30^\circ = 0{,}5$, le accelerazioni sono

$$a_{sfera} = \frac{g\sin\beta}{1 + \tfrac{2}{5}} = \frac{9{,}8\,\text{m/s}^2 \cdot 0{,}5}{1{,}4} = 3{,}5\,\text{m/s}^2 \qquad a_{anello} = \frac{9{,}8\,\text{m/s}^2 \cdot 0{,}5}{2} = 2{,}45\,\text{m/s}^2$$

Dalla legge oraria $l = \tfrac{1}{2} a\,t^2$ del moto che parte da fermo, $t = \sqrt{2 l / a}$:

$$t_{sfera} = \sqrt{\frac{2 \cdot 2{,}0\,\text{m}}{3{,}5\,\text{m/s}^2}} = 1{,}06\ldots\,\text{s} \approx 1{,}1\,\text{s} \qquad t_{anello} = \sqrt{\frac{2 \cdot 2{,}0\,\text{m}}{2{,}45\,\text{m/s}^2}} = 1{,}27\ldots\,\text{s} \approx 1{,}3\,\text{s}$$

L'anello arriva due decimi di secondo dopo la sfera. Un blocco senza attrito, con $a = 4{,}9\,\text{m/s}^2$, impiegherebbe $0{,}90\,\text{s}$.
```

```ad-example
Esempio 5: una sfera che risale
Una sfera piena rotola senza strisciare su un pavimento a $3{,}0\,\text{m/s}$ e imbocca una rampa. Di quanto sale prima di fermarsi?

Nel punto più alto la sfera è ferma e non gira più: tutta l'energia cinetica, di traslazione e di rotazione, è diventata potenziale. Con $c = \tfrac{2}{5}$:

$$(1 + c)\,\frac{1}{2} m\,v_{cm}^2 = m g h \quad\Rightarrow\quad h = \frac{(1 + c)\,v_{cm}^2}{2 g} = \frac{1{,}4 \cdot (3{,}0\,\text{m/s})^2}{2 \cdot 9{,}8\,\text{m/s}^2} = 0{,}642\ldots\,\text{m} \approx 0{,}64\,\text{m}$$

Un blocco che scivola senza attrito alla stessa velocità salirebbe solo di $v^2/(2g) \approx 0{,}46\,\text{m}$: la sfera sale di più perché ha con sé anche l'energia della rotazione.
```

```ad-note
Perché l'attrito non frena
Nel rotolamento senza strisciamento l'attrito statico non dissipa energia: non c'è strisciamento, quindi non c'è lavoro. Il suo compito è trasferire energia dalla traslazione alla rotazione. Se il piano è troppo ripido o troppo scivoloso l'attrito statico non basta più, il corpo comincia a strisciare e le formule di questa lezione non valgono.
```
