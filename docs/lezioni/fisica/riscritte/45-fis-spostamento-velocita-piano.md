# Spostamento e velocità nel piano

Una palla da biliardo che rimbalza sulle sponde, un drone che attraversa un cortile, un'auto in una rotonda: sono moti che non stanno su una retta. Per descriverli non basta più un numero con il segno, come nel [moto rettilineo](/materiale/scuola-superiore/fisica/il-moto-rettilineo/punto-materiale-traiettoria-e-sistema-di-riferimento): la posizione, lo spostamento e la velocità diventano vettori, con due componenti, una lungo l'asse $x$ e una lungo l'asse $y$. Tutto quello che serve sui vettori è nelle lezioni [Grandezze scalari e grandezze vettoriali](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/grandezze-scalari-e-grandezze-vettoriali), [Somma e differenza di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori) e [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore).

## Il vettore posizione

Si fissa nel piano del moto un sistema di riferimento cartesiano, con l'origine $O$ e gli assi $x$ e $y$. La posizione di un punto materiale $P$ è data dalle sue due coordinate $x$ e $y$, oppure, che è lo stesso, dal **vettore posizione** $\vec{s}$, che va dall'origine a $P$. Le componenti del vettore posizione sono proprio le coordinate del punto.

```tikz
% nome: vettore-posizione-piano
% alt: Un piano cartesiano con l'origine O e un punto P nel primo quadrante; il vettore posizione s, in blu, va da O a P, e le proiezioni tratteggiate di P sugli assi segnano le sue coordinate x e y
% svg: vettore-posizione-piano-648e0f80.svg 191x137
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (4,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,2.6) node[above] {$y$};
\draw[dashed, thin] (3,2) -- (3,0);
\draw[dashed, thin] (3,2) -- (0,2);
\draw[-{Stealth}, thick, blue] (0,0) -- (3,2);
\node[above left] at (1.5,1) {$\vec{s}$};
\fill (3,2) circle (1.5pt) node[above right] {$P$};
\node[below left] at (0,0) {$O$};
\node[below] at (3,0) {$x$};
\node[left] at (0,2) {$y$};
\end{tikzpicture}
```

Mentre il punto si muove, la punta del vettore posizione lo segue e disegna la **traiettoria**, la linea formata da tutte le posizioni occupate dal punto. Il modulo di $\vec{s}$ è la distanza del punto dall'origine, $s = \sqrt{x^2 + y^2}$, e cambia se si sposta l'origine: il vettore posizione dipende dal sistema di riferimento scelto.

## Lo spostamento

Se all'istante $t_1$ il punto si trova in $P_1$, con vettore posizione $\vec{s}_1$, e all'istante $t_2$ si trova in $P_2$, con vettore posizione $\vec{s}_2$, il suo **spostamento** è il vettore che va da $P_1$ a $P_2$:

$$\Delta\vec{s} = \vec{s}_2 - \vec{s}_1$$

È la differenza di due vettori, e infatti va dalla punta di $\vec{s}_1$ alla punta di $\vec{s}_2$; letta al contrario, $\vec{s}_1 + \Delta\vec{s} = \vec{s}_2$: partendo da $O$, prima $\vec{s}_1$ e poi lo spostamento portano in $P_2$.

```tikz
% nome: spostamento-piano-due-posizioni
% alt: Un piano cartesiano con una traiettoria curva, grigia, che passa per i punti P1 e P2; i vettori posizione s1 e s2, in blu, vanno dall'origine O ai due punti, e lo spostamento delta s, in arancione, va da P1 a P2, con le sue componenti delta x e delta y tratteggiate
% svg: spostamento-piano-due-posizioni-fd1578e7.svg 229x167
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (5,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,3.4) node[above] {$y$};
\draw[thick, gray!60] plot[smooth] coordinates {(0.5,1.3) (1,0.75) (1.6,0.5) (2.5,0.6) (3.4,1.2) (4,2.2) (4.3,2.9)};
\draw[-{Stealth}, thick, blue] (0,0) -- (1.6,0.5);
\node[above] at (0.7,0.24) {$\vec{s}_1$};
\draw[-{Stealth}, thick, blue] (0,0) -- (4,2.2);
\node[above left] at (1.8,0.99) {$\vec{s}_2$};
\draw[-{Stealth}, thick, orange!90!black, dashed] (1.6,0.5) -- (4,0.5);
\draw[-{Stealth}, thick, orange!90!black, dashed] (4,0.5) -- (4,2.2);
\draw[-{Stealth}, thick, orange!90!black] (1.6,0.5) -- (4,2.2);
\node[below right] at (2.9,1.35) {$\Delta\vec{s}$};
\node[below] at (2.8,0.5) {\small $\Delta x$};
\node[right] at (4,1.35) {\small $\Delta y$};
\fill (1.6,0.5) circle (1.5pt) node[below left] {$P_1$};
\fill (4,2.2) circle (1.5pt) node[right] {$P_2$};
\node[below left] at (0,0) {$O$};
\end{tikzpicture}
```

Le componenti dello spostamento sono le differenze delle coordinate:

$$\Delta x = x_2 - x_1 \qquad \Delta y = y_2 - y_1$$

e il modulo dello spostamento, la distanza in linea d'aria tra $P_1$ e $P_2$, si trova con il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide):

$$\Delta s = \sqrt{(\Delta x)^2 + (\Delta y)^2}$$

A differenza del vettore posizione, lo spostamento non dipende dall'origine: spostando $O$ cambiano $\vec{s}_1$ e $\vec{s}_2$, ma non la freccia che va da $P_1$ a $P_2$.

```ad-example
Esempio 1: un pallone sul campo
Su un campo da calcio si fissano gli assi con l'origine in un angolo, l'asse $x$ lungo la linea laterale e l'asse $y$ lungo la linea di fondo. Un pallone passa dal punto $A = (12\,\text{m};\ 5{,}0\,\text{m})$ al punto $B = (42\,\text{m};\ 45\,\text{m})$. Trova lo spostamento.

Le componenti:

$$\Delta x = 42\,\text{m} - 12\,\text{m} = 30\,\text{m} \qquad \Delta y = 45\,\text{m} - 5{,}0\,\text{m} = 40\,\text{m}$$

Il modulo:

$$\Delta s = \sqrt{30^2 + 40^2}\,\text{m} = \sqrt{2500}\,\text{m} = 50\,\text{m}$$

La direzione si dà con l'angolo $\alpha$ che lo spostamento forma con l'asse $x$, dalla tangente come nella lezione sui vettori: $\tan\alpha = \Delta y / \Delta x = 40/30$, quindi $\alpha = \tan^{-1}(1{,}33\ldots) = 53{,}1\ldots^\circ \approx 53^\circ$.
```

```ad-warning
Lo spostamento non è la posizione, e non è la strada fatta
Il vettore posizione va dall'origine al punto; lo spostamento va dal punto di partenza al punto di arrivo. E il modulo dello spostamento non è la distanza percorsa: la strada può curvare o tornare indietro, lo spostamento è sempre il segmento dritto tra partenza e arrivo, ed è al massimo lungo quanto la strada, come nella lezione [Grandezze scalari e grandezze vettoriali](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/grandezze-scalari-e-grandezze-vettoriali).
```

## La velocità media

La **velocità media** tra gli istanti $t_1$ e $t_2$ è lo spostamento diviso per l'intervallo di tempo $\Delta t = t_2 - t_1$:

$$\vec{v}_m = \frac{\Delta\vec{s}}{\Delta t}$$

È un vettore, perché è un vettore diviso per un numero positivo: ha la direzione e il verso dello spostamento, e modulo $v_m = \Delta s / \Delta t$. Le sue componenti sono le velocità medie lungo i due assi, come nella lezione [La velocità media e istantanea](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-velocita-media-e-istantanea) del moto rettilineo:

$$v_{m,x} = \frac{\Delta x}{\Delta t} \qquad v_{m,y} = \frac{\Delta y}{\Delta t}$$

Nel piano conviene distinguere la velocità media da un'altra grandezza, la **velocità scalare media**, che è la distanza percorsa divisa per il tempo. È lei che si calcola quando si dice "ho fatto $12\,\text{km}$ in un'ora": non ha direzione, ed è uno scalare. Le due coincidono solo se il moto è rettilineo e sempre nello stesso verso; negli altri casi la velocità scalare media è più grande del modulo della velocità media, perché la strada è più lunga dello spostamento.

```ad-example
Esempio 2: velocità media e velocità scalare media
Un ciclista pedala a $5{,}0\,\text{m/s}$ per $240\,\text{m}$ verso est, poi svolta e fa altri $180\,\text{m}$ verso nord, sempre a $5{,}0\,\text{m/s}$. Trova la velocità scalare media e la velocità media.

```tikz
% nome: ciclista-est-nord-velocita-media
% alt: Il percorso del ciclista: da A 240 metri verso est, poi 180 metri verso nord fino a B; lo spostamento, in arancione, va in diagonale da A a B e misura 300 metri
% svg: ciclista-est-nord-velocita-media-b50417d4.svg 198x130
\begin{tikzpicture}
\draw[-{Stealth}, thin] (0,0) -- (3.2,0);
\draw[-{Stealth}, thin] (3.2,0) -- (3.2,2.4);
\draw (3,0) -- (3,0.2) -- (3.2,0.2);
\node[below] at (1.6,0) {\small $240$ m};
\node[right] at (3.2,1.2) {\small $180$ m};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (3.2,2.4);
\node[above left] at (1.6,1.2) {$\Delta\vec{s}$};
\fill (0,0) circle (1.5pt) node[below left] {$A$};
\fill (3.2,2.4) circle (1.5pt) node[above right] {$B$};
\draw[-{Stealth}, thin] (4.4,1) -- (4.4,1.8);
\node[above] at (4.4,1.8) {\small N};
\end{tikzpicture}
```

I due tratti durano $240\,\text{m} / (5{,}0\,\text{m/s}) = 48\,\text{s}$ e $180\,\text{m} / (5{,}0\,\text{m/s}) = 36\,\text{s}$, in tutto $\Delta t = 84\,\text{s}$. La distanza percorsa è $420\,\text{m}$, quindi la velocità scalare media è

$$\frac{420\,\text{m}}{84\,\text{s}} = 5{,}0\,\text{m/s}$$

Lo spostamento ha le componenti $\Delta x = 240\,\text{m}$ e $\Delta y = 180\,\text{m}$, e modulo $\sqrt{240^2 + 180^2}\,\text{m} = 300\,\text{m}$. La velocità media ha modulo

$$v_m = \frac{300\,\text{m}}{84\,\text{s}} = 3{,}57\ldots\,\text{m/s} \approx 3{,}6\,\text{m/s}$$

ed è diretta da $A$ verso $B$, a $\tan^{-1}(180/240) \approx 37^\circ$ dalla direzione est verso nord. Il ciclista è sempre andato a $5{,}0\,\text{m/s}$, ma in media si è allontanato dalla partenza solo di $3{,}6\,\text{m}$ al secondo.
```

## La velocità istantanea

La velocità media dice come è andato il moto in tutto un intervallo, non com'era in un istante. Per la **velocità istantanea** in un punto $P$ della traiettoria si prende la velocità media tra $P$ e un punto $Q$ sempre più vicino, cioè in un intervallo $\Delta t$ sempre più breve. Lo spostamento da $P$ a $Q$ è una corda della traiettoria; quando $Q$ si avvicina a $P$ la corda si accorcia e la sua direzione si avvicina a quella della **tangente** alla traiettoria in $P$.

```tikz
% nome: velocita-media-verso-tangente
% alt: Una traiettoria curva grigia con il punto P e tre punti Q1, Q2 e Q3 sempre più vicini a P; gli spostamenti da P a ciascun punto Q, in blu, sono corde che si inclinano sempre meno, e si avvicinano alla retta tangente in P, tratteggiata, lungo la quale è disegnata la velocità istantanea v in blu scuro
% svg: velocita-media-verso-tangente-4205db2a.svg 172x149
\begin{tikzpicture}
\draw[thick, gray!60] plot[domain=0:4.2, smooth, samples=40] (\x, {0.2*\x*\x});
\draw[dashed, thin] (-0.25,-0.3) -- (3.5,1.2);
\draw[-{Stealth}, thin, blue] (1,0.2) -- (3.8,2.888);
\draw[-{Stealth}, thin, blue] (1,0.2) -- (2.8,1.568);
\draw[-{Stealth}, thin, blue] (1,0.2) -- (1.9,0.722);
\draw[-{Stealth}, thick, blue!60!black] (1,0.2) -- (2.393,0.757);
\node[below right] at (2.393,0.757) {$\vec{v}$};
\fill (1,0.2) circle (1.5pt) node[above left] {$P$};
\fill (3.8,2.888) circle (1.5pt) node[left] {$Q_1$};
\fill (2.8,1.568) circle (1.5pt) node[left] {$Q_2$};
\fill (1.9,0.722) circle (1.5pt);
\node at (1.45,0.98) {$Q_3$};
\end{tikzpicture}
```

La velocità istantanea $\vec{v}$ in un punto è quindi un vettore:

- tangente alla traiettoria in quel punto;
- con il verso del moto;
- con il modulo che è il valore letto sul tachimetro, quanto il punto va veloce in quell'istante.

Lo mostrano le scintille di una mola: ogni scheggia di metallo si stacca dal disco e parte dritta lungo la tangente, nella direzione che aveva la sua velocità in quell'istante. Così anche il fango che schizza dalla ruota di una bicicletta.

Nella figura qui sotto trascini il punto $Q$ lungo la traiettoria verso $P$: lo spostamento si accorcia, e la velocità media, spostamento diviso intervallo, si allinea con la tangente fino a coincidere quasi con la velocità istantanea.

```interattivo
% nome: velocita-media-tangente
% alt: Una traiettoria curva con il punto P e il punto Q, che si trascina lungo la curva; lo spostamento da P a Q, in blu, e la velocità media, in blu scuro, hanno la stessa direzione, e la velocità istantanea in P, in arancione, sta sulla retta tangente tratteggiata. Due cursori cambiano l'istante di P e l'intervallo di tempo tra P e Q; sotto sono scritti l'intervallo, lo spostamento, la velocità media e l'angolo tra la velocità media e la tangente, che diventa quasi zero quando Q è vicino a P
```

Due conseguenze. La prima: la velocità è costante solo se sono costanti il modulo e la direzione, cioè solo nel moto rettilineo uniforme. Un'auto che fa una curva a $50\,\text{km/h}$ con il tachimetro fermo ha una velocità che cambia, perché cambia la direzione; se ne occupa la lezione [L'accelerazione centripeta](/materiale/scuola-superiore/fisica/i-moti-nel-piano/l-accelerazione-centripeta). La seconda: la velocità media, che va lungo una corda, in generale non è tangente alla traiettoria.

```ad-warning
La velocità non va verso il punto di arrivo
La velocità istantanea è tangente alla traiettoria, non diretta verso la meta: un'auto in una rotonda ha la velocità lungo la strada, non verso l'uscita che prenderà. È la velocità media che va da un punto all'altro, lungo la corda.
```

## Le componenti della velocità

Come ogni vettore, la velocità si scompone lungo gli assi. Se $\vec{v}$ ha modulo $v$ e forma l'angolo $\alpha$ con il semiasse positivo delle $x$:

$$v_x = v\cos\alpha \qquad v_y = v\sin\alpha$$

e al contrario, dalle componenti:

$$v = \sqrt{v_x^2 + v_y^2} \qquad \tan\alpha = \frac{v_y}{v_x}$$

La componente $v_x$ dice quanto in fretta cambia la coordinata $x$ del punto, e $v_y$ quanto in fretta cambia la $y$: il moto nel piano si legge come due moti rettilinei lungo gli assi, che avvengono insieme. È l'idea della lezione [La composizione dei moti](/materiale/scuola-superiore/fisica/i-moti-nel-piano/la-composizione-dei-moti).

```tikz
% nome: componenti-velocita-aereo
% alt: La velocità v di un aereo che sale, in blu scuro, inclinata di 12 gradi sull'orizzontale; le componenti tratteggiate sono vx, orizzontale e lunga, e vy, verticale e corta
% svg: componenti-velocita-aereo-866ca86e.svg 180x69
\begin{tikzpicture}
\draw[dashed, thin] (3.913,0.832) -- (3.913,0.3);
\draw[dashed, thin] (3.913,0.832) -- (0,0.832);
\draw[-{Stealth}, thick, blue!60!black, dashed] (0,0.3) -- (3.913,0.3);
\draw[-{Stealth}, thick, blue!60!black, dashed] (0,0.3) -- (0,0.832);
\draw[-{Stealth}, thick, blue!60!black] (0,0.3) -- (3.913,1.132);
\node[above] at (3.913,1.132) {$\vec{v}$};
\draw (1.2,0.3) arc[start angle=0, end angle=12, radius=1.2];
\node at (1.72,0.45) {\scriptsize $12^\circ$};
\node[below] at (2.4,0.3) {\small $v_x$};
\node[left] at (0,0.6) {\small $v_y$};
\fill (0,0.3) circle (1.5pt);
\end{tikzpicture}
```

```ad-example
Esempio 3: un aereo che sale
Un aereo sale con una velocità di $75\,\text{m/s}$ inclinata di $12^\circ$ sull'orizzontale. Trova le componenti orizzontale e verticale della velocità, e di quanto sale in $10\,\text{s}$ se la velocità non cambia.

$$
\begin{gathered}
v_x = 75\,\text{m/s} \cdot \cos 12^\circ = 73{,}36\ldots\,\text{m/s} \approx 73\,\text{m/s} \\
v_y = 75\,\text{m/s} \cdot \sin 12^\circ = 15{,}59\ldots\,\text{m/s} \approx 16\,\text{m/s}
\end{gathered}
$$

In verticale la quota cresce di $15{,}59\,\text{m}$ ogni secondo, come in un moto rettilineo uniforme: in $10\,\text{s}$ l'aereo sale di $\Delta y = v_y\,\Delta t = 155{,}9\ldots\,\text{m} \approx 1{,}6 \cdot 10^2\,\text{m}$, mentre in orizzontale avanza di $v_x\,\Delta t \approx 7{,}3 \cdot 10^2\,\text{m}$.
```

```ad-example
Esempio 4: dalle componenti al vettore
Una palla rotola sul pavimento con le componenti della velocità $v_x = 1{,}2\,\text{m/s}$ e $v_y = -0{,}50\,\text{m/s}$. Trova il modulo e la direzione della velocità.

$$v = \sqrt{1{,}2^2 + (-0{,}50)^2}\,\text{m/s} = \sqrt{1{,}69}\,\text{m/s} = 1{,}3\,\text{m/s}$$

La calcolatrice dà $\tan^{-1}(-0{,}50/1{,}2) = -22{,}6\ldots^\circ$: la palla va verso destra e verso il basso del piano cartesiano, nel quarto quadrante, e l'angolo misurato in senso antiorario dal semiasse positivo delle $x$ è $360^\circ - 22{,}6^\circ \approx 337^\circ$. Si può dire anche "$23^\circ$ sotto l'asse $x$".
```

```ad-warning
Il modulo non è la somma delle componenti
Con $v_x = 1{,}2\,\text{m/s}$ e $v_y = 0{,}50\,\text{m/s}$ il modulo della velocità è $1{,}3\,\text{m/s}$, non $1{,}7\,\text{m/s}$: le componenti sono i cateti di un triangolo rettangolo, e il modulo è l'ipotenusa.
```
