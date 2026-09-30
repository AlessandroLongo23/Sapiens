# Il moto armonico

Un peso appeso a una molla che va su e giù, l'altalena che oscilla, l'ago di una macchina da cucire, i rebbi di un diapason che vibrano: sono moti di andata e ritorno, che si ripetono uguali. Il più regolare di questi moti è il **moto armonico**, e il modo più semplice per descriverlo è guardarlo come l'ombra di un [moto circolare uniforme](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme).

## L'ombra di un moto circolare uniforme

Un punto $P$ gira su una circonferenza di centro $O$ e raggio $r$ con velocità angolare $\omega$ costante. Da $P$ si abbassa la perpendicolare su un diametro, e si chiama $Q$ il piede della perpendicolare: la **proiezione** di $P$ sul diametro. Se una lampada lontana illuminasse il moto dall'alto, $Q$ sarebbe l'ombra di $P$ sul diametro.

Mentre $P$ fa il giro, $Q$ va avanti e indietro lungo il diametro, tra le due estremità: è il moto armonico. Un punto si muove di **moto armonico** quando si muove come la proiezione su un diametro di un punto in moto circolare uniforme.

```tikz
% nome: moto-armonico-proiezione-diametro
% alt: Una circonferenza di centro O e raggio r con il punto P che gira; dal punto P scende una perpendicolare tratteggiata sul diametro orizzontale, fino al punto Q, la proiezione di P. L'angolo tra il diametro e il raggio OP è omega per t; la distanza di Q dal centro è x, e le estremità del diametro sono segnate A e meno A
% svg: moto-armonico-proiezione-diametro-1e8afc2c.svg 197x129
\begin{tikzpicture}
\draw[thick, gray!60] (0,0) circle (1.6);
\draw[->] (-2.1,0) -- (2.3,0) node[right] {$x$};
\draw (0,0) -- (1.0285,1.2257);
\node[above left] at (0.5,0.62) {$r$};
\draw[dashed, thin] (1.0285,1.2257) -- (1.0285,0);
\draw (0.4,0) arc[start angle=0, end angle=50, radius=0.4];
\node at (0.62,0.3) {\scriptsize $\omega t$};
\fill (0,0) circle (1.5pt);
\node[below left] at (0,0) {$O$};
\fill (1.0285,1.2257) circle (1.5pt) node[above right] {$P$};
\fill (1.0285,0) circle (2pt);
\node[above right] at (1.0285,0) {$Q$};
\draw[{Stealth}-{Stealth}, thin] (0,-0.35) -- (1.0285,-0.35);
\node[below] at (0.51,-0.35) {\small $x$};
\draw (1.6,0.08) -- (1.6,-0.08);
\draw (-1.6,0.08) -- (-1.6,-0.08);
\node[below right] at (1.6,0) {$A$};
\node[below left] at (-1.6,0) {$-A$};
\end{tikzpicture}
```

## Ampiezza, periodo e frequenza

La distanza massima di $Q$ dal centro è il raggio della circonferenza: si chiama **ampiezza** $A$ del moto armonico, e $A = r$. Il punto $Q$ oscilla tra $x = A$ e $x = -A$, quindi il tratto percorso da un'estremità all'altra è lungo $2A$.

Quando $P$ fa un giro, $Q$ fa un'oscillazione completa, andata e ritorno: il **periodo** $T$ del moto armonico è il periodo del moto circolare, e la **frequenza** è $f = 1/T$, come nella lezione [Il moto circolare uniforme](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme). La velocità angolare di $P$, $\omega = 2\pi/T$, nel moto armonico si chiama anche **pulsazione**, e si misura sempre in $\text{rad/s}$.

```ad-warning
L'ampiezza è metà dell'escursione
Un peso che oscilla tra due punti distanti $10\,\text{cm}$ ha ampiezza $5{,}0\,\text{cm}$, non $10\,\text{cm}$: l'ampiezza si misura dal centro di oscillazione, come il raggio si misura dal centro della circonferenza.
```

## La legge oraria

Si mette l'origine dell'asse $x$ nel centro $O$ e si fa partire il tempo quando $P$ è sull'asse, a destra, cioè quando $Q$ è nell'estremità $x = A$. Dopo un tempo $t$ il raggio $OP$ ha spazzato l'angolo $\omega t$, e la coordinata di $Q$ è il cateto adiacente a quell'angolo, nel triangolo rettangolo che ha per ipotenusa il raggio:

$$x = A \cos(\omega t)$$

È la **legge oraria** del moto armonico. L'angolo $\omega t$ è in radianti: sulla calcolatrice va impostata la modalità in radianti (RAD).

Le posizioni nei momenti più comodi:

| $t$ | $0$ | $T/4$ | $T/2$ | $3T/4$ | $T$ |
|---|---|---|---|---|---|
| $\omega t$ | $0$ | $\pi/2$ | $\pi$ | $3\pi/2$ | $2\pi$ |
| $x$ | $A$ | $0$ | $-A$ | $0$ | $A$ |

Il grafico di $x$ in funzione di $t$ è una cosinusoide, che si ripete uguale ogni periodo.

```tikz
% nome: legge-oraria-moto-armonico
% alt: Il grafico della posizione x in funzione del tempo t nel moto armonico, per due periodi: una curva a onde che parte da A al tempo zero, passa per zero a un quarto di periodo, arriva a meno A a metà periodo, torna a zero a tre quarti di periodo e di nuovo ad A dopo un periodo, e poi si ripete
% svg: legge-oraria-moto-armonico-5aa41d1e.svg 215x128
% poi-interattivo: si potranno cambiare l'ampiezza e il periodo e guardare il punto che oscilla mentre traccia il grafico
\begin{tikzpicture}
\draw[gray!25, very thin] (0,-1.2) grid[xstep=0.5, ystep=0.5] (4.2,1.2);
\draw[->] (-0.2,0) -- (4.5,0) node[right] {$t$};
\draw[->] (0,-1.4) -- (0,1.5) node[above] {$x$};
\draw[thick, blue] plot[domain=0:4.2, samples=120, smooth] (\x, {cos(\x*180)});
\draw[dashed, thin] (0,1) -- (4.2,1);
\draw[dashed, thin] (0,-1) -- (4.2,-1);
\node[left] at (0,1) {\small $A$};
\node[left] at (0,-1) {\small $-A$};
\foreach \x/\l in {1/{T/2}, 2/{T}, 3/{3T/2}, 4/{2T}} \draw (\x,0.07) -- (\x,-0.07) node[below] {\scriptsize $\l$};
\end{tikzpicture}
```

```ad-example
Esempio 1: dove si trova il punto
Un corpo si muove di moto armonico con ampiezza $5{,}0\,\text{cm}$ e periodo $2{,}0\,\text{s}$, e all'istante $t = 0$ si trova nell'estremità $x = A$. Dove si trova agli istanti $0{,}25\,\text{s}$, $0{,}40\,\text{s}$ e $1{,}5\,\text{s}$?

La pulsazione è $\omega = 2\pi / T = 2\pi / 2{,}0\,\text{s} = \pi\,\text{rad/s}$. Con la calcolatrice in radianti:

$$
\begin{gathered}
x(0{,}25\,\text{s}) = 5{,}0\,\text{cm} \cdot \cos(0{,}25\pi) = 5{,}0\,\text{cm} \cdot 0{,}707 = 3{,}53\ldots\,\text{cm} \approx 3{,}5\,\text{cm} \\
x(0{,}40\,\text{s}) = 5{,}0\,\text{cm} \cdot \cos(0{,}40\pi) = 5{,}0\,\text{cm} \cdot 0{,}309 = 1{,}54\ldots\,\text{cm} \approx 1{,}5\,\text{cm} \\
x(1{,}5\,\text{s}) = 5{,}0\,\text{cm} \cdot \cos(1{,}5\pi) = 0
\end{gathered}
$$

A $1{,}5\,\text{s}$, cioè a tre quarti di periodo, il corpo passa per il centro, come dice la tabella.
```

```ad-warning
La calcolatrice in gradi
Nella legge oraria l'angolo $\omega t$ è in radianti. Con la calcolatrice in gradi, $\cos(0{,}25\pi)$ diventa il coseno di $0{,}785^\circ$, quasi $1$, e il corpo dell'esempio 1 risulterebbe ancora in $x = 5{,}0\,\text{cm}$ dopo un ottavo di periodo. Se il risultato è sempre vicino ad $A$, controlla la modalità.
```

## La velocità

La velocità di $Q$ è l'ombra della velocità di $P$: la sua componente lungo il diametro. La velocità di $P$ è tangente alla circonferenza e ha modulo $\omega r = \omega A$; quando il raggio $OP$ forma l'angolo $\omega t$ con il diametro, la velocità forma l'angolo $\omega t + 90^\circ$, e la sua componente $x$ è, con il seno e il coseno della lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore),

$$v = -\omega A \sin(\omega t)$$

Il segno meno dice che, mentre $P$ sta nella metà di sopra, $Q$ va verso sinistra.

```tikz
% nome: velocita-accelerazione-moto-armonico
% alt: Due circonferenze uguali con il punto P nella stessa posizione e la sua proiezione Q sul diametro orizzontale. Nella prima la velocità di P, in blu scuro, è tangente alla circonferenza, e la sua proiezione sul diametro, tratteggiata, dà la velocità di Q, orizzontale verso il centro. Nella seconda l'accelerazione centripeta di P, in verde, punta verso il centro, e la sua proiezione sul diametro dà l'accelerazione di Q, anche lei orizzontale verso il centro
% svg: velocita-accelerazione-moto-armonico-e9b09710.svg 257x137
\begin{tikzpicture}
\draw[thick, gray!60] (0,0) circle (1.3);
\draw[thin] (-1.5,0) -- (1.6,0);
\fill (0,0) circle (1.5pt) node[below left] {$O$};
\draw[dashed, thin] (0.9959,0.8356) -- (0.9959,0);
\draw[-{Stealth}, thick, blue!60!black] (0.9959,0.8356) -- (0.2888,1.6783);
\draw[dashed, thin] (0.2888,1.6783) -- (0.2888,0);
\draw[-{Stealth}, thick, blue!60!black] (0.9959,0) -- (0.2888,0);
\node[above] at (0.2888,1.6783) {$\vec{v}_P$};
\node[below] at (0.64,0) {\small $v$};
\fill (0.9959,0.8356) circle (1.5pt) node[right] {$P$};
\fill (0.9959,0) circle (2pt);
\node[below right] at (0.9959,0) {$Q$};
\draw[thick, gray!60] (3.6,0) circle (1.3);
\draw[thin] (2.1,0) -- (5.2,0);
\fill (3.6,0) circle (1.5pt) node[below left] {$O$};
\draw[dashed, thin] (4.5959,0.8356) -- (4.5959,0);
\draw[-{Stealth}, thick, green!50!black] (4.5959,0.8356) -- (3.983,0.3214);
\draw[dashed, thin] (3.983,0.3214) -- (3.983,0);
\draw[-{Stealth}, thick, green!50!black] (4.5959,0) -- (3.983,0);
\node[above left] at (4.25,0.6) {$\vec{a}_c$};
\node[below] at (4.29,0) {\small $a$};
\fill (4.5959,0.8356) circle (1.5pt) node[right] {$P$};
\fill (4.5959,0) circle (2pt);
\node[below right] at (4.5959,0) {$Q$};
\end{tikzpicture}
```

La velocità di $Q$ è massima in modulo quando $P$ è in cima o in fondo alla circonferenza, e la sua velocità è tutta parallela al diametro: in quell'istante $Q$ passa per il centro $O$. È zero quando $P$ è su una estremità del diametro, e la sua velocità è perpendicolare al diametro: lì $Q$ si ferma un istante e torna indietro. Il valore massimo è la velocità di $P$:

$$v_{max} = \omega A = \frac{2\pi A}{T}$$

## L'accelerazione

Allo stesso modo, l'accelerazione di $Q$ è la componente lungo il diametro dell'[accelerazione centripeta](/materiale/scuola-superiore/fisica/i-moti-nel-piano/l-accelerazione-centripeta) di $P$, che ha modulo $\omega^2 A$ e punta verso il centro, nel verso opposto al raggio $OP$:

$$a = -\omega^2 A \cos(\omega t)$$

Siccome $A\cos(\omega t)$ è proprio la posizione $x$:

$$a = -\omega^2 x$$

Questa è la proprietà che distingue il moto armonico: l'accelerazione è proporzionale alla distanza dal centro e sempre diretta verso il centro, come dice il segno meno. È massima alle estremità, dove $|x| = A$:

$$a_{max} = \omega^2 A = \frac{4\pi^2 A}{T^2}$$

ed è zero nel centro, dove la velocità è massima. Un corpo attaccato a una molla ha proprio un'accelerazione proporzionale alla distanza dalla posizione di riposo e rivolta verso di essa, perché la forza della molla segue la [legge di Hooke](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-elastica-e-la-legge-di-hooke): per questo oscilla di moto armonico, come si vede nella lezione [Il pendolo e la molla](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/il-pendolo-e-la-molla).

| Dove si trova $Q$ | Posizione | Velocità | Accelerazione |
|---|---|---|---|
| Nel centro | $x = 0$ | massima, $\omega A$ | zero |
| In un'estremità | $x = \pm A$ | zero | massima, $\omega^2 A$, verso il centro |

```ad-warning
Nel centro l'accelerazione è zero, non la velocità
Nel centro di oscillazione il corpo va più veloce che mai, ma l'accelerazione è nulla; alle estremità il corpo è fermo per un istante, ma l'accelerazione è massima. Velocità nulla non vuol dire accelerazione nulla, come nel [lancio verticale](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale) nel punto più alto.
```

```ad-example
Esempio 2: velocità e accelerazione massime
Un corpo oscilla di moto armonico con ampiezza $12\,\text{cm}$ e periodo $1{,}5\,\text{s}$. Trova la velocità massima e l'accelerazione massima.

La pulsazione è $\omega = 2\pi / 1{,}5\,\text{s} = 4{,}188\ldots\,\text{rad/s}$, e con l'ampiezza in metri, $A = 0{,}12\,\text{m}$:

$$
\begin{gathered}
v_{max} = \omega A = 4{,}189\,\text{rad/s} \cdot 0{,}12\,\text{m} = 0{,}502\ldots\,\text{m/s} \approx 0{,}50\,\text{m/s} \\
a_{max} = \omega^2 A = (4{,}189\,\text{rad/s})^2 \cdot 0{,}12\,\text{m} = 2{,}10\ldots\,\text{m/s}^2 \approx 2{,}1\,\text{m/s}^2
\end{gathered}
$$

La velocità massima si ha nel centro, l'accelerazione massima alle estremità.
```

```ad-example
Esempio 3: il diapason
La punta di un rebbio di un diapason vibra di moto armonico alla frequenza di $440\,\text{Hz}$, con un'ampiezza di $1{,}0\,\text{mm}$. Trova la velocità massima e l'accelerazione massima della punta.

$\omega = 2\pi f = 2\pi \cdot 440\,\text{Hz} = 2764{,}6\ldots\,\text{rad/s}$, e $A = 1{,}0 \cdot 10^{-3}\,\text{m}$:

$$
\begin{gathered}
v_{max} = \omega A = 2764{,}6\,\text{rad/s} \cdot 1{,}0 \cdot 10^{-3}\,\text{m} = 2{,}76\ldots\,\text{m/s} \approx 2{,}8\,\text{m/s} \\
a_{max} = \omega^2 A = (2764{,}6\,\text{rad/s})^2 \cdot 1{,}0 \cdot 10^{-3}\,\text{m} = 7643\ldots\,\text{m/s}^2 \approx 7{,}6 \cdot 10^3\,\text{m/s}^2
\end{gathered}
$$

Un'ampiezza di un millimetro, ma un'accelerazione quasi $800$ volte $g$: con una frequenza alta la pulsazione è grande, e l'accelerazione cresce con il suo quadrato.
```

```ad-example
Esempio 4: dall'accelerazione e dalla velocità al periodo
Nel moto armonico di un corpo la velocità massima è $0{,}60\,\text{m/s}$ e l'accelerazione massima è $1{,}8\,\text{m/s}^2$. Trova la pulsazione, l'ampiezza e il periodo.

Dividendo $a_{max} = \omega^2 A$ per $v_{max} = \omega A$ resta $\omega$:

$$\omega = \frac{a_{max}}{v_{max}} = \frac{1{,}8\,\text{m/s}^2}{0{,}60\,\text{m/s}} = 3{,}0\,\text{rad/s}$$

Poi l'ampiezza e il periodo:

$$A = \frac{v_{max}}{\omega} = \frac{0{,}60\,\text{m/s}}{3{,}0\,\text{rad/s}} = 0{,}20\,\text{m} \qquad T = \frac{2\pi}{\omega} = \frac{2\pi}{3{,}0\,\text{rad/s}} = 2{,}09\ldots\,\text{s} \approx 2{,}1\,\text{s}$$
```

Nella figura qui sotto il punto $P$ gira sulla circonferenza e la sua ombra $Q$ oscilla sul diametro. Le frecce di $Q$ sono le componenti di quelle di $P$: guarda dove la velocità è massima e dove si annulla, e dove l'accelerazione cambia verso.

```interattivo
% nome: moto-armonico-ombra
% alt: Un punto P che gira in senso antiorario su una circonferenza e la sua proiezione Q sul diametro orizzontale, collegati da un segmento tratteggiato; Q oscilla avanti e indietro tra le estremità del diametro. Sul punto Q sono disegnate la sua velocità, in blu scuro, e la sua accelerazione, in verde, che punta sempre verso il centro. Due cursori cambiano l'ampiezza e il periodo, un bottone avvia o ferma il moto; sotto sono scritti il tempo, la posizione, la velocità e l'accelerazione di Q, e i loro valori massimi
```
