# Il moto lungo un piano inclinato

Nella lezione [L'equilibrio sul piano inclinato](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-sul-piano-inclinato) il corpo restava fermo, perché qualcosa (un filo, l'attrito statico) bilanciava la componente del peso lungo il piano. Qui nessuno lo trattiene: la forza totale non è zero, e per il [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica) il corpo accelera lungo il piano. Il moto che ne viene è un [moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato), come la caduta libera, ma più lento, e con l'accelerazione che si controlla con l'inclinazione.

## Il piano liscio: $a = g\sin\alpha$

Su un piano liscio, inclinato di un angolo $\alpha$, agiscono sul corpo due forze: il peso $\vec{P}$ e la [reazione vincolare](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari) $\vec{F}_v$ del piano. Come nella lezione sull'equilibrio si scompone il peso in una componente parallela al piano, $P\sin\alpha$, e una perpendicolare, $P\cos\alpha$. La reazione bilancia la componente perpendicolare, e il corpo non si stacca dal piano né ci sprofonda; la componente parallela non la bilancia nessuno, ed è la forza totale:

$$F_{tot} = P\sin\alpha = m\,g\sin\alpha$$

```tikz
% nome: forze-blocco-piano-liscio-moto
% alt: Un blocco su un piano inclinato liscio di un angolo alfa. Dal centro del blocco partono il peso P, verticale verso il basso, e la reazione vincolare Fv, perpendicolare al piano; la forza totale Ftot, arancione, è diretta lungo il piano verso il basso ed è lunga metà del peso, come P sin 30 gradi. Sopra il blocco l'accelerazione a, verde, lungo il piano verso il basso
% svg: forze-blocco-piano-liscio-moto-15c9c3d7.svg 216x172
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- (5,0) -- (5,2.8868) -- cycle;
\draw (0.6,0) arc[start angle=0, end angle=30, radius=0.6];
\node at (0.821,0.22) {\small $\alpha$};
\draw[thick, fill=blue!10, rotate around={30:(3.1177,1.8)}] (3.1177,1.8) rectangle ++(1,0.6);
\draw[-{Stealth}, thick, red] (3.4007,2.3098) -- (3.4007,0.5098) node[left] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (3.4007,2.3098) -- (2.6213,3.6598) node[above] {$\vec{F}_v$};
\draw[-{Stealth}, thick, orange!90!black] (3.4007,2.3098) -- (2.6213,1.8598) node[below left] {$\vec{F}_{tot}$};
\draw[-{Stealth}, thick, green!50!black] (4.0966,3.4044) -- (3.4038,3.0044) node[above left] {$\vec{a}$};
\fill (3.4007,2.3098) circle (1.5pt);
\end{tikzpicture}
```

Il secondo principio, $F_{tot} = m\,a$, dà $m\,a = m\,g\sin\alpha$. La massa compare da tutte e due le parti e si semplifica:

$$a = g\sin\alpha$$

L'accelerazione è diretta lungo il piano, verso il basso, e non dipende dalla massa: su uno scivolo liscio un bambino e un adulto scendono insieme, come due sassi in caduta libera. I casi limite tornano: con il piano orizzontale, $\alpha = 0^\circ$, l'accelerazione è zero; con il piano verticale, $\alpha = 90^\circ$, è $g$, e il corpo cade liberamente. Con $30^\circ$, per esempio, $a = 9{,}8\,\text{m/s}^2 \cdot 0{,}5 = 4{,}9\,\text{m/s}^2$, metà di $g$. È quello che faceva Galileo: sul piano inclinato la caduta rallenta abbastanza da poterla misurare.

```ad-warning
Il coseno al posto del seno
L'accelerazione va con il seno, come la componente del peso lungo il piano: $a = g\sin\alpha$, non $g\cos\alpha$. Il controllo con il piano orizzontale scopre subito lo scambio, perché $g\cos 0^\circ = g$ direbbe che un corpo su un tavolo accelera come in caduta libera.
```

## Tempo di discesa e velocità in fondo

Un corpo lasciato da fermo in cima a un piano lungo $l$ percorre $l$ con accelerazione costante. Messo l'asse lungo il piano, con l'origine in cima e il verso positivo in discesa, le leggi del moto uniformemente accelerato con $s_0 = 0$ e $v_0 = 0$ sono

$$s = \tfrac{1}{2}a\,t^2 \qquad v = a\,t$$

Il corpo arriva in fondo quando $s = l$, cioè dopo il tempo

$$t = \sqrt{\frac{2\,l}{a}}$$

e con la velocità $v = a\,t$. Sostituendo il tempo si ha una formula che non ha bisogno di calcolarlo:

$$v = a\sqrt{\frac{2\,l}{a}} = \sqrt{2\,a\,l}$$

È la relazione senza il tempo della lezione sul moto uniformemente accelerato, $v^2 = v_0^2 + 2a\,\Delta s$, con $v_0 = 0$ e $\Delta s = l$.

```ad-example
Esempio 1: una cassa su uno scivolo liscio
Una cassa parte da ferma in cima a uno scivolo liscio, lungo $2{,}5\,\text{m}$ e inclinato di $30^\circ$. Quanto tempo impiega ad arrivare in fondo? Con quale velocità ci arriva?

L'accelerazione è $a = g\sin 30^\circ = 9{,}8\,\text{m/s}^2 \cdot 0{,}5 = 4{,}9\,\text{m/s}^2$. Il tempo di discesa:

$$t = \sqrt{\frac{2\,l}{a}} = \sqrt{\frac{2 \cdot 2{,}5\,\text{m}}{4{,}9\,\text{m/s}^2}} = 1{,}010\ldots\,\text{s} \approx 1{,}0\,\text{s}$$

La velocità in fondo:

$$v = \sqrt{2\,a\,l} = \sqrt{2 \cdot 4{,}9\,\text{m/s}^2 \cdot 2{,}5\,\text{m}} = 4{,}949\ldots\,\text{m/s} \approx 4{,}9\,\text{m/s}$$

cioè circa $18\,\text{km/h}$. La massa della cassa non serve.
```

Sul piano liscio la velocità in fondo dipende solo dall'altezza da cui si parte. Infatti $l\sin\alpha$ è l'altezza $h$ del piano, e

$$v = \sqrt{2\,g\sin\alpha \cdot l} = \sqrt{2\,g\,h}$$

la stessa velocità di un corpo che cade liberamente da $h$. Lo scivolo dell'esempio è alto $2{,}5 \cdot 0{,}5 = 1{,}25\,\text{m}$, e $\sqrt{2 \cdot 9{,}8 \cdot 1{,}25} = 4{,}9\,\text{m/s}$. Un piano più ripido fa arrivare prima, non più veloci. La ragione profonda arriverà con la [conservazione dell'energia meccanica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica).

```ad-warning
La lunghezza e l'altezza
Nella formula del tempo va la strada percorsa lungo il piano, la lunghezza $l$, non l'altezza $h$: il corpo si muove lungo il piano, e $a$ è l'accelerazione lungo il piano. L'altezza compare solo in $v = \sqrt{2\,g\,h}$, dove c'è $g$ e non $a$.
```

## Il piano con l'attrito

Su un piano con attrito, a un corpo che scivola verso il basso si aggiunge l'[attrito dinamico](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito), diretto lungo il piano verso l'alto, contro il moto. La forza premente è la componente perpendicolare del peso, $F_\perp = m\,g\cos\alpha$, quindi

$$F_d = \mu_d\, m\,g\cos\alpha$$

```tikz
% nome: forze-blocco-attrito-discesa
% alt: Un blocco che scende lungo un piano inclinato di 30 gradi con attrito. Dal centro del blocco partono il peso P, la reazione vincolare Fv e l'attrito dinamico Fd, lungo il piano verso l'alto; la forza totale Ftot, arancione, è lungo il piano verso il basso ed è più corta della componente parallela del peso. Sopra il blocco l'accelerazione a, verde, verso il basso lungo il piano
% svg: forze-blocco-attrito-discesa-9166e4d8.svg 216x172
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- (5,0) -- (5,2.8868) -- cycle;
\draw (0.6,0) arc[start angle=0, end angle=30, radius=0.6];
\node at (0.821,0.22) {\small $\alpha$};
\draw[thick, fill=blue!10, rotate around={30:(3.1177,1.8)}] (3.1177,1.8) rectangle ++(1,0.6);
\draw[-{Stealth}, thick, red] (3.4007,2.3098) -- (3.4007,0.5098) node[left] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (3.4007,2.3098) -- (2.6213,3.6598) node[above] {$\vec{F}_v$};
\draw[-{Stealth}, thick, red] (3.4007,2.3098) -- (3.6707,2.4657) node[above right] {$\vec{F}_d$};
\draw[-{Stealth}, thick, orange!90!black] (3.4007,2.3098) -- (2.8913,2.0157) node[below left] {$\vec{F}_{tot}$};
\draw[-{Stealth}, thick, green!50!black] (3.9754,3.3344) -- (3.5251,3.0744) node[above left] {$\vec{a}$};
\fill (3.4007,2.3098) circle (1.5pt);
\end{tikzpicture}
```

Lungo il piano, verso il basso, la forza totale è $m\,g\sin\alpha - \mu_d\, m\,g\cos\alpha$. Divisa per la massa, che ancora una volta si semplifica:

$$a = g\,(\sin\alpha - \mu_d\cos\alpha)$$

La formula vale solo mentre il corpo scende. Se è fermo, prima di tutto bisogna chiedersi se parte: parte se $\tan\alpha > \mu_s$, come nella lezione sull'equilibrio, e allora scende con questa accelerazione.

```ad-example
Esempio 2: lo scivolo con l'attrito
La cassa dell'esempio 1 scende ora su uno scivolo di legno, lungo $2{,}5\,\text{m}$ e inclinato di $30^\circ$, con $\mu_d = 0{,}20$. Parte da ferma e scivola. Quanto valgono l'accelerazione e la velocità in fondo?

$$a = g\,(\sin 30^\circ - \mu_d\cos 30^\circ) = 9{,}8\,\text{m/s}^2 \cdot (0{,}5 - 0{,}20 \cdot 0{,}866) = 3{,}202\ldots\,\text{m/s}^2 \approx 3{,}2\,\text{m/s}^2$$

$$v = \sqrt{2\,a\,l} = \sqrt{2 \cdot 3{,}202\,\text{m/s}^2 \cdot 2{,}5\,\text{m}} = 4{,}001\ldots\,\text{m/s} \approx 4{,}0\,\text{m/s}$$

L'attrito ha tolto un terzo dell'accelerazione, e la cassa arriva in fondo più lenta: $4{,}0\,\text{m/s}$ contro $4{,}9\,\text{m/s}$. Qui $v = \sqrt{2\,g\,h}$ non vale più, perché l'accelerazione non è $g\sin\alpha$.
```

```ad-warning
L'attrito calcolato con il peso intero
La forza premente sul piano inclinato è $m\,g\cos\alpha$, non $m\,g$: la formula giusta è $g\,(\sin\alpha - \mu_d\cos\alpha)$, non $g\sin\alpha - \mu_d\,g$. Nell'esempio 2 lo sbaglio darebbe $9{,}8 \cdot (0{,}5 - 0{,}20) = 2{,}9\,\text{m/s}^2$ al posto di $3{,}2\,\text{m/s}^2$.
```

### Accelera, va a velocità costante, rallenta

Il segno di $\sin\alpha - \mu_d\cos\alpha$ dice che cosa fa un corpo che sta già scendendo, per esempio perché gli si è data una spinta. Dividendo per $\cos\alpha$, che è positivo, il confronto diventa quello tra $\tan\alpha$ e $\mu_d$:

| Inclinazione | Accelerazione | Il corpo che scende |
|---|---|---|
| $\tan\alpha > \mu_d$ | positiva, verso il basso | accelera |
| $\tan\alpha = \mu_d$ | zero | scende a velocità costante |
| $\tan\alpha < \mu_d$ | negativa, verso l'alto | rallenta e si ferma |

Nel caso di mezzo la componente del peso e l'attrito dinamico si bilanciano: il corpo non è fermo, ma è in equilibrio, e per il [primo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali) continua a muoversi con la velocità che ha. Un blocco di legno con $\mu_d = 0{,}36$ scende a velocità costante su un piano inclinato di $\tan^{-1} 0{,}36 \approx 20^\circ$. Nel terzo caso il corpo si ferma e poi resta fermo, perché $\tan\alpha < \mu_d$ e di solito $\mu_d < \mu_s$.

```ad-example
Esempio 3: il blocco che rallenta
Un blocco scende lungo un piano inclinato di $15^\circ$, con $\mu_d = 0{,}40$; quando passa per un punto $A$ ha una velocità di $2{,}0\,\text{m/s}$. Quanto spazio percorre dopo $A$ prima di fermarsi?

$\tan 15^\circ = 0{,}268$, minore di $\mu_d$: il blocco rallenta. L'accelerazione, con il verso positivo in discesa:

$$a = g\,(\sin 15^\circ - \mu_d\cos 15^\circ) = 9{,}8\,\text{m/s}^2 \cdot (0{,}259 - 0{,}40 \cdot 0{,}966) = -1{,}250\ldots\,\text{m/s}^2$$

Il blocco si ferma quando $v = v_0 + a\,t$ si annulla, dopo $t = v_0/|a| = 2{,}0 / 1{,}25\,\text{s} = 1{,}6\,\text{s}$, e intanto percorre

$$s = v_0\,t + \tfrac{1}{2}a\,t^2 = 2{,}0 \cdot 1{,}6\,\text{m} - \tfrac{1}{2} \cdot 1{,}25 \cdot 1{,}6^2\,\text{m} = 3{,}2\,\text{m} - 1{,}6\,\text{m} = 1{,}6\,\text{m}$$
```

Nella figura qui sotto cambi l'inclinazione e il coefficiente di attrito dinamico, poi dai una spinta al blocco verso il basso. A seconda di come stanno $\tan\alpha$ e $\mu_d$ il blocco accelera, scende a velocità costante o rallenta fino a fermarsi; il grafico a destra traccia la sua velocità nel tempo, una retta con la pendenza uguale all'accelerazione.

```interattivo
% nome: piano-inclinato-moto-attrito
% alt: Un blocco su un piano inclinato lungo 2 metri, con due cursori per l'inclinazione, da 0 a 45 gradi, e per il coefficiente di attrito dinamico, da 0 a 0,8. Un bottone dà al blocco una spinta di 1 metro al secondo verso il basso: se la tangente dell'inclinazione supera il coefficiente il blocco accelera, se è uguale scende a velocità costante, se è minore rallenta e si ferma. Accanto un grafico velocità-tempo traccia la velocità del blocco, e sotto sono scritti l'accelerazione, il tempo e la velocità
```

## Il corpo lanciato in salita

Un corpo lanciato verso l'alto lungo il piano con la velocità $v_0$ rallenta, come un sasso lanciato in verticale nella lezione sul [lancio verticale](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale). Conviene mettere il verso positivo in salita: la componente del peso lungo il piano punta in discesa, e l'accelerazione è negativa.

Sul piano liscio vale ancora $g\sin\alpha$, diretta in discesa, sia mentre il corpo sale sia mentre scende. Come per lo spazio di frenata di un'auto, il corpo si ferma quando $v = v_0 - g\sin\alpha\,t$ si annulla, dopo il tempo $t = v_0 / (g\sin\alpha)$, dopo aver percorso

$$d = v_0\,t - \tfrac{1}{2}\,g\sin\alpha\,t^2 = \frac{v_0^2}{2\,g\sin\alpha}$$

Poi torna giù, con la stessa accelerazione, e arriva al punto di partenza con la velocità $v_0$, rivolta al contrario.

```ad-example
Esempio 4: il carrello su una rampa liscia
Un carrello viene lanciato a $3{,}0\,\text{m/s}$ su per una rampa inclinata di $20^\circ$, e l'attrito è trascurabile. Dopo quanto tempo si ferma? Quanto spazio percorre in salita?

L'accelerazione vale $g\sin 20^\circ = 9{,}8\,\text{m/s}^2 \cdot 0{,}342 = 3{,}351\ldots\,\text{m/s}^2$, in discesa. Il carrello si ferma dopo

$$t = \frac{v_0}{g\sin\alpha} = \frac{3{,}0\,\text{m/s}}{3{,}352\,\text{m/s}^2} = 0{,}895\ldots\,\text{s} \approx 0{,}90\,\text{s}$$

avendo percorso

$$d = \frac{v_0^2}{2\,g\sin\alpha} = \frac{(3{,}0\,\text{m/s})^2}{2 \cdot 3{,}352\,\text{m/s}^2} = 1{,}342\ldots\,\text{m} \approx 1{,}3\,\text{m}$$

Poi scende: dopo altri $0{,}90\,\text{s}$ è di nuovo in fondo, a $3{,}0\,\text{m/s}$. Il grafico velocità-tempo di tutto il viaggio è una sola retta, perché l'accelerazione non cambia mai.
```

```tikz
% nome: grafico-velocita-rampa-liscia
% alt: Il grafico velocità-tempo del carrello lanciato su una rampa liscia: una retta che parte da 3 metri al secondo all'istante zero, scende, taglia l'asse dei tempi a 0,90 secondi, quando il carrello è fermo in cima, e arriva a meno 3 metri al secondo a 1,8 secondi, quando il carrello è tornato in fondo
% svg: grafico-velocita-rampa-liscia-3515ec1c.svg 227x163
% poi-interattivo: si cambia l'inclinazione e la velocità iniziale, e la retta cambia pendenza e punto di partenza
\begin{tikzpicture}
\draw[gray!25, very thin] (0,-1.5) grid[xstep=1, ystep=0.5] (4,1.5);
\draw[->] (-0.3,0) -- (4.3,0) node[right] {$t$ (s)};
\draw[->] (0,-1.7) -- (0,1.9) node[above] {$v$ (m/s)};
\foreach \x/\l in {1/0{,}5, 2/1, 3/1{,}5, 4/2} \draw (\x,0.05) -- (\x,-0.05) node[below] {\small $\l$};
\foreach \y/\l in {-1.5/-3, -1/-2, -0.5/-1, 0.5/1, 1/2, 1.5/3} \draw (0.05,\y) -- (-0.05,\y) node[left] {\small $\l$};
\draw[thick, blue!60!black] (0,1.5) -- (3.5808,-1.5);
\fill (1.7904,0) circle (1.5pt);
\node[above right] at (1.7904,0) {\small ferma};
\end{tikzpicture}
```

Con l'attrito la salita e la discesa non sono più simmetriche. Mentre il corpo sale, l'attrito è rivolto verso il basso, come la componente del peso: le due forze si sommano, e

$$a = -g\,(\sin\alpha + \mu_d\cos\alpha)$$

```tikz
% nome: forze-blocco-attrito-salita
% alt: Un blocco che sale lungo un piano inclinato di 25 gradi con attrito. La velocità v, blu, è diretta lungo il piano verso l'alto; l'attrito dinamico Fd, dal centro del blocco, è diretto lungo il piano verso il basso, come la componente del peso; ci sono anche il peso P e la reazione vincolare Fv. L'accelerazione a, verde, è diretta lungo il piano verso il basso, opposta alla velocità
% svg: forze-blocco-attrito-salita-460ff9ac.svg 216x170
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- (5,0) -- (5,2.3315) -- cycle;
\draw (0.6,0) arc[start angle=0, end angle=25, radius=0.6];
\node at (0.8299,0.184) {\small $\alpha$};
\draw[thick, fill=blue!10, rotate around={25:(3.5346,1.6482)}] (3.5346,1.6482) rectangle ++(1,0.6);
\draw[-{Stealth}, thick, red] (3.861,2.1314) -- (3.861,0.3314) node[left] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (3.861,2.1314) -- (3.1715,3.6099) node[above] {$\vec{F}_v$};
\draw[-{Stealth}, thick, red] (3.861,2.1314) -- (3.4174,1.9246) node[below left] {$\vec{F}_d$};
\draw[-{Stealth}, thick, blue!60!black] (3.8098,2.7144) -- (4.4442,3.0102) node[right] {$\vec{v}$};
\draw[-{Stealth}, thick, green!50!black] (4.254,3.4181) -- (3.6196,3.1222);
\node[right, green!50!black] at (4.254,3.4181) {$\vec{a}$};
\fill (3.861,2.1314) circle (1.5pt);
\end{tikzpicture}
```

Il corpo si ferma prima che sul piano liscio. Una volta fermo, l'attrito diventa statico e si torna alla domanda dell'equilibrio: se $\tan\alpha \le \mu_s$ il corpo resta lassù; altrimenti riscende, e in discesa l'attrito cambia verso, quindi l'accelerazione torna a essere $g\,(\sin\alpha - \mu_d\cos\alpha)$, più piccola di quella della salita.

```ad-example
Esempio 5: la cassa spinta su per una rampa
Una cassa viene lanciata a $5{,}0\,\text{m/s}$ su per una rampa inclinata di $25^\circ$, con $\mu_s = 0{,}50$ e $\mu_d = 0{,}30$. Quanto spazio percorre prima di fermarsi? Poi riscende?

In salita l'accelerazione ha il modulo

$$|a| = g\,(\sin 25^\circ + \mu_d\cos 25^\circ) = 9{,}8\,\text{m/s}^2 \cdot (0{,}423 + 0{,}30 \cdot 0{,}906) = 6{,}806\ldots\,\text{m/s}^2$$

e lo spazio percorso fino a fermarsi, come per il piano liscio con $|a|$ al posto di $g\sin\alpha$, è

$$d = \frac{v_0^2}{2\,|a|} = \frac{(5{,}0\,\text{m/s})^2}{2 \cdot 6{,}806\,\text{m/s}^2} = 1{,}836\ldots\,\text{m} \approx 1{,}8\,\text{m}$$

Senza attrito sarebbe arrivata a $25 / (2 \cdot 4{,}14) = 3{,}0\,\text{m}$. Da ferma, $\tan 25^\circ = 0{,}466$ è minore di $\mu_s = 0{,}50$: la cassa resta sulla rampa. Con $\mu_s = 0{,}40$ riscenderebbe, con un'accelerazione di $9{,}8 \cdot (0{,}423 - 0{,}30 \cdot 0{,}906) = 1{,}5\,\text{m/s}^2$.
```

```ad-warning
L'attrito sempre verso l'alto
L'attrito dinamico è sempre opposto alla velocità, non sempre rivolto verso la cima del piano. In discesa punta in su e si sottrae alla componente del peso, $\sin\alpha - \mu_d\cos\alpha$; in salita punta in giù e si somma, $\sin\alpha + \mu_d\cos\alpha$. Chi usa il meno anche in salita trova, nell'esempio 5, una cassa che arriva a $8{,}5\,\text{m}$.
```
