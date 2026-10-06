# Le forze apparenti: forza centrifuga e forza di Coriolis

L'autobus frena e ti senti spinto in avanti; l'auto curva e ti senti schiacciato contro la portiera; la giostra gira e i seggiolini si allargano verso l'esterno. In tutti e tre i casi cerchi chi ti sta spingendo e non lo trovi, perché non c'è. Nella lezione [Sistemi di riferimento inerziali e non inerziali](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/sistemi-di-riferimento-inerziali-e-non-inerziali) hai visto che in un sistema che accelera i principi della dinamica non valgono, se si contano solo le forze vere. Qui si impara a farli valere lo stesso, aggiungendo le forze apparenti: uno strumento di calcolo che permette di ragionare stando a bordo.

## La forza apparente in un sistema che accelera

Un sistema $S'$, per esempio un autobus, si muove in linea retta rispetto al suolo $S$ con una velocità $\vec V$ che cambia: ha un'accelerazione $\vec A$. La [composizione delle velocità](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/le-trasformazioni-di-galileo-e-la-composizione-delle-velocita) vale istante per istante, $\vec v = \vec v\,' + \vec V$, ma ora tra due istanti cambia anche $\vec V$:

$$\Delta\vec v = \Delta\vec v\,' + \Delta\vec V$$

Dividendo per l'intervallo di tempo $\Delta t$ si trova il legame tra le accelerazioni di un corpo nei due sistemi:

$$\vec a = \vec a\,' + \vec A$$

Nel sistema inerziale $S$ vale il [secondo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica), $\vec F_{tot} = m\,\vec a$, dove $\vec F_{tot}$ è la somma delle forze vere: peso, reazioni, attriti, tensioni. Sostituendo $\vec a = \vec a\,' + \vec A$ e portando a sinistra il termine con $\vec A$:

$$\vec F_{tot} - m\,\vec A = m\,\vec a\,'$$

Chi sta sull'autobus misura $\vec a\,'$. Se vuole scrivere "forza totale uguale massa per accelerazione" con la sua accelerazione, deve aggiungere alle forze vere il termine $-m\,\vec A$. Questo termine si chiama **forza apparente** (o forza fittizia, o forza d'inerzia):

$$\vec F_{app} = -m\,\vec A$$

Con questa aggiunta il secondo principio torna a valere anche nel sistema che accelera:

$$\vec F_{tot} + \vec F_{app} = m\,\vec a\,'$$

La forza apparente ha tre caratteristiche che la distinguono da tutte le forze incontrate finora.

- Ha verso opposto all'accelerazione del sistema: in avanti se l'autobus frena, all'indietro se parte.
- È proporzionale alla massa del corpo, come il peso: per questo, in assenza di altre forze, tutti i corpi a bordo prendono la stessa accelerazione $-\vec A$.
- Non è esercitata da nessun corpo. Non c'è niente che spinge, e quindi non ha una reazione: il [terzo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica) non la riguarda. Esiste solo per l'osservatore non inerziale, e sparisce se lo stesso moto si descrive dal suolo.

```tikz
% nome: forza-apparente-autobus-frena
% alt: Un autobus che frena, visto da chi è a bordo. Sopra l'autobus una freccia verde A, diretta all'indietro, indica l'accelerazione dell'autobus rispetto al suolo. Sul pavimento c'è un pallone, e dal pallone parte una freccia rossa tratteggiata diretta in avanti, la forza apparente, di verso opposto ad A
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (6.3,0);
\foreach \x in {-0.15,0,...,6.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=orange!25] (0.5,0.3) rectangle (5.3,2.1);
\foreach \x in {0.8,1.8,2.8,3.8} \draw[thick, fill=white] (\x,1.3) rectangle ++(0.75,0.55);
\draw[thick, fill=gray!20] (1.4,0.3) circle (0.3);
\draw[thick, fill=gray!20] (4.4,0.3) circle (0.3);
\draw[thin] (0.5,0.62) -- (5.3,0.62);
\draw[thick, fill=blue!10] (2.4,0.82) circle (0.2);
\draw[-{Stealth}, thick, red, dashed] (2.4,0.82) -- (3.9,0.82);
\node[above] at (3.5,0.82) {$\vec{F}_{app}$};
\draw[-{Stealth}, thick, green!50!black] (3.6,2.4) -- (2.2,2.4) node[left] {$\vec{A}$};
\end{tikzpicture}
```

In questa lezione le forze apparenti sono disegnate con una freccia rossa tratteggiata, per non confonderle con le forze vere.

```ad-example
Esempio 1: il passeggero in piedi
Un autobus frena con un'accelerazione di modulo $4{,}2\,\text{m/s}^2$. Quanto vale la forza apparente su un passeggero di $60\,\text{kg}$, nel sistema dell'autobus? Quale forza deve esercitare su di lui il sostegno a cui si tiene, perché resti fermo rispetto all'autobus?

$$F_{app} = m\,A = 60\,\text{kg} \cdot 4{,}2\,\text{m/s}^2 = 252\,\text{N} \approx 2{,}5 \cdot 10^2\,\text{N}$$

diretta in avanti, perché l'accelerazione dell'autobus è diretta all'indietro. Il passeggero resta fermo rispetto all'autobus se $\vec a\,' = \vec 0$, cioè se le forze vere bilanciano quella apparente: il sostegno (con l'aiuto dell'attrito delle scarpe) deve tirarlo all'indietro con $2{,}5 \cdot 10^2\,\text{N}$, quasi metà del suo peso, che è $588\,\text{N}$.

Dal suolo si trova lo stesso numero con un altro ragionamento: il passeggero rallenta insieme all'autobus con $4{,}2\,\text{m/s}^2$, e la forza totale che lo fa rallentare è $m\,A = 252\,\text{N}$, diretta all'indietro. La forza vera è la stessa; cambia solo il modo di raccontarla.
```

```ad-warning
Le forze apparenti non hanno una reazione
Nel diagramma delle forze fatto dal sistema non inerziale la forza apparente si disegna come le altre, applicata al corpo. Ma non va cercata la sua coppia azione-reazione, perché nessun corpo la esercita. Chi scrive "la forza apparente è la reazione alla forza del sostegno" confonde due forze che agiscono sullo stesso corpo e si bilanciano con due forze del terzo principio, che agiscono su corpi diversi.
```

### Risolvere un problema da dentro

Un problema in un sistema che accelera si può risolvere in due modi, e il risultato è lo stesso.

1. Dal sistema inerziale: si disegnano solo le forze vere e si scrive $\vec F_{tot} = m\,\vec a$, dove $\vec a$ comprende l'accelerazione del veicolo.
2. Dal sistema non inerziale: si disegnano le forze vere e la forza apparente $-m\,\vec A$, e si scrive $\vec F_{tot} + \vec F_{app} = m\,\vec a\,'$. Se il corpo è fermo rispetto al veicolo, $\vec a\,' = \vec 0$ e il problema diventa un problema di equilibrio.

Il secondo modo conviene proprio quando il corpo è fermo rispetto al veicolo: l'[equilibrio di un punto materiale](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari) è più comodo da trattare di un moto accelerato.

```ad-example
Esempio 2: il pendolo visto dall'auto
Un profumatore di $0{,}10\,\text{kg}$ è appeso con un filo allo specchietto di un'auto che accelera con $3{,}0\,\text{m/s}^2$. Di quale angolo è inclinato il filo? Risolvi il problema nel sistema dell'auto.

Nel sistema dell'auto il profumatore è fermo, e su di lui agiscono tre forze: il peso $\vec P$ verso il basso, la tensione $\vec T$ lungo il filo e la forza apparente, orizzontale e diretta all'indietro:

$$P = m\,g = 0{,}10\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 0{,}98\,\text{N} \qquad F_{app} = m\,A = 0{,}10\,\text{kg} \cdot 3{,}0\,\text{m/s}^2 = 0{,}30\,\text{N}$$

Le tre forze si bilanciano. Se $\theta$ è l'angolo del filo con la verticale, la componente verticale della tensione bilancia il peso e quella orizzontale la forza apparente:

$$T\cos\theta = m\,g \qquad T\sin\theta = m\,A \qquad\Rightarrow\qquad \tan\theta = \frac{A}{g} = \frac{3{,}0}{9{,}8} = 0{,}306\ldots \quad\Rightarrow\quad \theta \approx 17^\circ$$

```tikz
% nome: pendolo-tre-forze-sistema-auto
% alt: Il diagramma delle forze sull'oggetto appeso, nel sistema dell'auto che accelera verso destra, in scala di 2 centimetri per newton. Dal punto partono il peso P verso il basso, lungo 1,96 centimetri, la tensione T verso l'alto e un po' a destra, lungo il filo, e la forza apparente, rossa tratteggiata, orizzontale verso sinistra, lunga 0,6 centimetri. Il filo, disegnato sottile, è inclinato di 17 gradi rispetto alla verticale tratteggiata. Le tre forze si bilanciano
\begin{tikzpicture}
\draw (0,0) -- (0.9,2.94);
\draw[dashed, thin] (0,0) -- (0,2.9);
\draw (0,1.2) arc[start angle=90, end angle=73, radius=1.2];
\node at (0.2,1.45) {\scriptsize $\theta$};
\draw[-{Stealth}, thick, red] (0,0) -- (0.6,1.96) node[right] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,-1.96) node[right] {$\vec{P}$};
\draw[-{Stealth}, thick, red, dashed] (0,0) -- (-0.6,0);
\node[left] at (-0.6,0) {$\vec{F}_{app}$};
\draw[thick, fill=blue!10] (0,0) circle (0.12);
\draw[-{Stealth}, thick, green!50!black] (1.6,2.6) -- (2.8,2.6) node[right] {$\vec{A}$};
\end{tikzpicture}
```

Sono le stesse due equazioni, e lo stesso angolo, che nella lezione sui sistemi non inerziali si trovavano dal suolo. Là il termine $m\,A$ stava a destra, come massa per accelerazione; qui sta tra le forze, con il nome di forza apparente.
```

```ad-example
Esempio 3: la valigia che scivola
Una valigia è appoggiata sul pavimento di un autobus, e il coefficiente di attrito statico tra valigia e pavimento è $\mu_s = 0{,}35$. Qual è la frenata più forte che l'autobus può fare senza che la valigia scivoli?

Nel sistema dell'autobus, in orizzontale, sulla valigia agiscono la forza apparente $m\,A$, in avanti, e l'[attrito statico](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito), all'indietro, che può arrivare al massimo a $\mu_s\,m\,g$ (la forza premente è il peso). La valigia resta ferma finché

$$m\,A \le \mu_s\,m\,g \quad\Rightarrow\quad A \le \mu_s\,g = 0{,}35 \cdot 9{,}8\,\text{m/s}^2 = 3{,}43\,\text{m/s}^2 \approx 3{,}4\,\text{m/s}^2$$

La massa si semplifica: una valigia piena e una vuota cominciano a scivolare con la stessa frenata.
```

### L'ascensore

In un ascensore che accelera in verticale la forza apparente è verticale: verso il basso se l'ascensore accelera verso l'alto, verso l'alto se accelera verso il basso. Nel sistema dell'ascensore si somma al peso, e i corpi si comportano come se pesassero $m\,(g + A)$ nel primo caso e $m\,(g - A)$ nel secondo. È il "peso apparente" che la bilancia segnava nella lezione [Il diagramma delle forze](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-diagramma-delle-forze), dove il conto era fatto dal palazzo.

```ad-example
Esempio 4: il pacco in ascensore
Un pacco di $12\,\text{kg}$ è sul pavimento di un ascensore che parte verso il basso con un'accelerazione di $2{,}0\,\text{m/s}^2$. Con quale forza il pavimento sostiene il pacco?

Nel sistema dell'ascensore il pacco è fermo. Su di lui agiscono il peso verso il basso, la reazione $F_v$ del pavimento verso l'alto e la forza apparente, verso l'alto perché $\vec A$ è verso il basso:

$$F_v + m\,A = m\,g \quad\Rightarrow\quad F_v = m\,(g - A) = 12\,\text{kg} \cdot (9{,}8 - 2{,}0)\,\text{m/s}^2 = 93{,}6\,\text{N} \approx 94\,\text{N}$$

meno del peso, che è $118\,\text{N}$. Se l'ascensore cadesse liberamente, con $A = g$, la forza apparente bilancerebbe esattamente il peso e il pavimento non dovrebbe sostenere niente: nel sistema dell'ascensore i corpi galleggerebbero.
```

## La forza centrifuga

Un sistema di riferimento che ruota è non inerziale anche se ruota a velocità angolare costante. Prendiamo una piattaforma che gira con velocità angolare $\omega$, e su di essa un corpo di massa $m$ fermo rispetto alla piattaforma, a distanza $r$ dall'asse: una persona seduta sulla giostra.

Visto dal suolo quel corpo percorre una circonferenza di raggio $r$, e ha l'[accelerazione centripeta](/materiale/scuola-superiore/fisica/i-moti-nel-piano/l-accelerazione-centripeta) $a_c = \omega^2 r$, diretta verso il centro. Il punto della piattaforma su cui il corpo si trova ha la stessa accelerazione: è questa l'accelerazione $\vec A$ del sistema, in quel punto. La forza apparente $-m\,\vec A$ è allora diretta lungo il raggio, verso l'esterno, e si chiama **forza centrifuga** (dal latino, "che fugge dal centro"):

$$F_{cf} = m\,\omega^2\,r$$

Con la velocità $v = \omega\,r$ del punto della piattaforma si può scrivere anche $F_{cf} = m\,v^2/r$. La forza centrifuga cresce con la distanza dall'asse e con il quadrato della velocità angolare: a velocità angolare doppia è quattro volte più grande.

```tikz
% nome: forza-centrifuga-velocita-angolare
% alt: Grafico della forza centrifuga in funzione della velocità angolare per una persona di 50 chilogrammi a 4 metri dall'asse. In ascissa la velocità angolare da 0 a 2 radianti al secondo, in ordinata la forza da 0 a 800 newton. La curva è un ramo di parabola che parte dall'origine e passa per 200 newton a 1 radiante al secondo e per 800 newton a 2 radianti al secondo; è segnato il punto a 1,26 radianti al secondo e 316 newton
% poi-interattivo: cambiare la massa e il raggio e vedere la parabola che si apre o si chiude
\begin{tikzpicture}[x=2.5cm, y=0.005cm]
\draw[gray!25, very thin, xstep=0.5, ystep=200] (0,0) grid (2.1,850);
\draw[->] (-0.1,0) -- (2.3,0) node[right] {$\omega$ (rad/s)};
\draw[->] (0,-40) -- (0,900) node[above] {$F_{cf}$ (N)};
\foreach \x/\l in {0.5/{0{,}5}, 1/1, 1.5/{1{,}5}, 2/2} \node[below] at (\x,0) {\small $\l$};
\foreach \y in {200,400,600,800} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue] plot[domain=0:2.05, samples=40] (\x, {200*\x*\x});
\draw[dashed, thin] (1.257,0) -- (1.257,316) -- (0,316);
\fill (1.257,316) circle (1.5pt);
\end{tikzpicture}
```

Lo stesso corpo fermo sulla giostra si descrive quindi in due modi.

| | Dal suolo (sistema inerziale) | Dalla giostra (sistema che ruota) |
|---|---|---|
| Che cosa fa il corpo | gira: moto circolare uniforme | è fermo |
| Forze | solo quelle vere; la loro risultante è la [forza centripeta](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/la-forza-centripeta), verso il centro | quelle vere e la forza centrifuga, verso l'esterno |
| Equazione | $F_{tot} = m\,\omega^2 r$ | $F_{tot} - m\,\omega^2 r = 0$ |

Nel primo modo la forza verso il centro (la tensione di una catena, l'attrito del sedile, la spinta di una parete) serve a far curvare il corpo. Nel secondo la stessa forza serve a bilanciare la forza centrifuga, che altrimenti lo porterebbe verso l'esterno. I numeri che si trovano sono gli stessi.

```tikz
% nome: centrifuga-due-descrizioni
% alt: Due piattaforme viste dall'alto, con una pallina legata al centro da un filo. A sinistra, dal suolo: la piattaforma ruota in senso antiorario, sulla pallina agisce solo la tensione T verso il centro, e sono disegnate la velocità v tangente alla circonferenza e l'accelerazione centripeta verde verso il centro. A destra, dalla piattaforma: la pallina è ferma, e su di lei agiscono la tensione T verso il centro e la forza centrifuga Fcf, rossa tratteggiata, verso l'esterno, della stessa lunghezza
\begin{tikzpicture}
\draw[thick, fill=gray!10] (0,0) circle (1.8);
\draw[-{Stealth}, thin] (115:2.05) arc[start angle=115, end angle=155, radius=2.05];
\draw (0,0) -- (1.3,0);
\fill (0,0) circle (1.5pt);
\draw[-{Stealth}, thick, red] (1.3,0) -- (0.4,0);
\node[below] at (0.75,0) {$\vec{T}$};
\draw[-{Stealth}, thick, green!50!black] (1.3,0.18) -- (0.6,0.18);
\node[above] at (0.75,0.18) {$\vec{a}_c$};
\draw[-{Stealth}, thick, blue!60!black] (1.3,0) -- (1.3,1.0) node[right] {$\vec{v}$};
\draw[thick, fill=blue!10] (1.3,0) circle (0.12);
\node[below] at (0,-1.95) {\small dal suolo};
\draw[thick, fill=gray!10] (5,0) circle (1.8);
\draw (5,0) -- (6.3,0);
\fill (5,0) circle (1.5pt);
\draw[-{Stealth}, thick, red] (6.3,0) -- (5.4,0);
\node[below] at (5.75,0) {$\vec{T}$};
\draw[-{Stealth}, thick, red, dashed] (6.3,0) -- (7.2,0);
\node[above] at (7.0,0.05) {$\vec{F}_{cf}$};
\draw[thick, fill=blue!10] (6.3,0) circle (0.12);
\node[below] at (5,-1.95) {\small dalla piattaforma};
\end{tikzpicture}
```

```ad-example
Esempio 5: la giostra a catene
Su una giostra a catene un ragazzo di $50\,\text{kg}$ gira a $4{,}0\,\text{m}$ dall'asse e fa un giro ogni $5{,}0\,\text{s}$. Quanto vale la forza centrifuga su di lui, nel sistema della giostra?

$$\omega = \frac{2\pi}{T} = \frac{2\pi}{5{,}0\,\text{s}} = 1{,}256\ldots\,\text{rad/s}$$

$$F_{cf} = m\,\omega^2\,r = 50\,\text{kg} \cdot (1{,}256\ldots\,\text{rad/s})^2 \cdot 4{,}0\,\text{m} = 315{,}8\ldots\,\text{N} \approx 3{,}2 \cdot 10^2\,\text{N}$$

diretta verso l'esterno. È il punto segnato sul grafico. Nel sistema della giostra il ragazzo è fermo: la forza centrifuga, in orizzontale, e il peso di $490\,\text{N}$, in verticale, sono bilanciati dalla tensione delle catene, che per questo si dispongono inclinate verso l'esterno.
```

```ad-example
Esempio 6: la moneta sul giradischi
Una moneta è appoggiata sul piatto di un giradischi, a $12\,\text{cm}$ dall'asse; il coefficiente di attrito statico è $\mu_s = 0{,}40$. Fino a quale velocità angolare la moneta resta ferma sul piatto?

Nel sistema del piatto la moneta è ferma finché l'attrito statico riesce a bilanciare la forza centrifuga:

$$m\,\omega^2\,r \le \mu_s\,m\,g \quad\Rightarrow\quad \omega \le \sqrt{\frac{\mu_s\,g}{r}} = \sqrt{\frac{0{,}40 \cdot 9{,}8\,\text{m/s}^2}{0{,}12\,\text{m}}} = 5{,}71\ldots\,\text{rad/s} \approx 5{,}7\,\text{rad/s}$$

Sono $5{,}7/(2\pi) \approx 0{,}91$ giri al secondo, circa $55$ giri al minuto. A $33$ giri al minuto la moneta resta al suo posto; più lontano dall'asse la forza centrifuga è più grande e la velocità angolare limite più bassa. Il conto è quello dell'auto in curva della lezione sulla forza centripeta, raccontato da chi sta sul piatto.
```

```ad-warning
Centripeta e centrifuga non stanno nello stesso disegno
La forza centrifuga non è la reazione alla forza centripeta, e le due non si bilanciano "a vicenda" in un unico diagramma. Prima si sceglie il sistema di riferimento. Dal suolo ci sono solo le forze vere, la loro risultante punta verso il centro e il corpo accelera: niente centrifuga. Dalla giostra c'è anche la centrifuga, e il corpo è in equilibrio. Mescolare i due punti di vista porta a concludere che su un corpo che gira la forza totale è zero, e allora dovrebbe andare dritto.
```

```ad-warning
La centrifuga non lancia i corpi lungo il raggio
Quando il filo si spezza, la pallina vista dal suolo parte lungo la tangente, non lungo il raggio: non c'è più nessuna forza, e prosegue dritta. Solo chi ruota con la piattaforma la vede allontanarsi verso l'esterno, e nemmeno per lui la traiettoria è un raggio: appena la pallina si muove rispetto alla piattaforma entra in gioco la forza di Coriolis.
```

### La centrifuga della Terra

Anche il suolo ruota. Nel sistema della Terra ogni corpo sente, oltre alla forza di gravità, una forza centrifuga diretta via dall'asse di rotazione, massima all'equatore e nulla ai poli.

```ad-example
Esempio 7: quanto pesa in meno all'equatore
Quanto vale la forza centrifuga dovuta alla rotazione terrestre su una persona di $70\,\text{kg}$ all'equatore? Il raggio della Terra è $R_T = 6{,}37 \cdot 10^6\,\text{m}$ e la velocità angolare $\omega = 7{,}27 \cdot 10^{-5}\,\text{rad/s}$.

$$F_{cf} = m\,\omega^2 R_T = 70\,\text{kg} \cdot (7{,}27 \cdot 10^{-5}\,\text{rad/s})^2 \cdot 6{,}37 \cdot 10^6\,\text{m} = 2{,}35\ldots\,\text{N} \approx 2{,}4\,\text{N}$$

All'equatore è diretta verso l'alto, opposta alla forza di gravità, che vale circa $686\,\text{N}$: una bilancia segna circa lo $0{,}3\%$ in meno di quello che segnerebbe se la Terra non ruotasse.
```

È poco, ma si misura: è uno dei motivi per cui l'accelerazione di gravità è un po' più piccola all'equatore che ai poli, e per cui la Terra, che non è perfettamente rigida, è leggermente schiacciata ai poli.

## La forza di Coriolis

La forza centrifuga agisce su tutti i corpi in un sistema che ruota, fermi o in moto. Sui corpi che si muovono rispetto al sistema che ruota agisce una seconda forza apparente, la **forza di Coriolis**, dal nome dell'ingegnere francese Gaspard-Gustave de Coriolis, che la descrisse nel 1835. La sua formula richiede il prodotto vettoriale e non serve in questo corso; contano le sue proprietà, che si capiscono con un esperimento.

Una piattaforma ruota in senso antiorario, vista dall'alto. Dal centro si lancia una palla, che scivola senza attrito, verso un bambino seduto sul bordo. Vista dal suolo la palla va dritta, perché su di lei non agiscono forze orizzontali; ma mentre la palla viaggia la piattaforma gira, e il bambino si sposta verso sinistra rispetto alla direzione del lancio. La palla arriva al bordo in un punto dove il bambino non c'è più.

Il bambino, che si considera fermo, racconta un'altra storia: la palla è partita verso di lui e poi ha curvato, verso destra rispetto al verso in cui si muoveva. Per spiegare una traiettoria curva gli serve una forza perpendicolare alla velocità: è la forza di Coriolis.

```tikz
% nome: coriolis-palla-piattaforma
% alt: Due piattaforme viste dall'alto, che ruotano in senso antiorario. A sinistra, dal suolo: la palla va dal centro al bordo lungo una linea retta orizzontale; il bambino, che alla partenza era sul bordo in quella direzione, è disegnato vuoto nella posizione di partenza e pieno nella posizione di arrivo, spostato lungo il bordo di 34 gradi in senso antiorario. A destra, dalla piattaforma: il bambino resta fermo sul bordo, e la traiettoria della palla curva verso destra rispetto alla direzione del moto, arrivando sul bordo 34 gradi più in basso
\begin{tikzpicture}
\draw[thick, fill=gray!10] (0,0) circle (1.8);
\draw[-{Stealth}, thin] (95:2.05) arc[start angle=95, end angle=135, radius=2.05];
\draw[thick, blue!60!black, -{Stealth}] (0,0) -- (1.8,0);
\draw[thin, dashed] (1.8,0) arc[start angle=0, end angle=34.4, radius=1.8];
\draw[thick] (1.8,0) circle (0.1);
\fill[orange!90!black] (34.4:1.8) circle (0.1);
\fill (0,0) circle (1.5pt);
\node[below] at (0,-1.95) {\small dal suolo};
\draw[thick, fill=gray!10] (5,0) circle (1.8);
\draw[thick, blue!60!black, -{Stealth}] plot[domain=0:1.5, samples=25, variable=\t] ({5 + 1.2*\t*cos(-22.92*\t)}, {1.2*\t*sin(-22.92*\t)});
\fill[orange!90!black] (6.8,0) circle (0.1);
\fill (5,0) circle (1.5pt);
\node[below] at (5,-1.95) {\small dalla piattaforma};
\end{tikzpicture}
```

```ad-example
Esempio 8: di quanto la palla manca il bambino
La piattaforma ha raggio $3{,}0\,\text{m}$ e ruota in senso antiorario con $\omega = 0{,}40\,\text{rad/s}$. La palla parte dal centro a $2{,}0\,\text{m/s}$, puntata verso il bambino. Di quanto si è spostato il bambino lungo il bordo quando la palla arriva al bordo?

Il conto si fa dal suolo, dove la palla si muove di moto rettilineo uniforme:

$$t = \frac{r}{v} = \frac{3{,}0\,\text{m}}{2{,}0\,\text{m/s}} = 1{,}5\,\text{s}$$

In questo tempo la piattaforma ruota di un angolo $\Delta\theta = \omega\,t = 0{,}40\,\text{rad/s} \cdot 1{,}5\,\text{s} = 0{,}60\,\text{rad}$, circa $34^\circ$, e il bambino percorre sul bordo un arco

$$\Delta s = r\,\Delta\theta = 3{,}0\,\text{m} \cdot 0{,}60\,\text{rad} = 1{,}8\,\text{m}$$

La palla manca il bambino di $1{,}8\,\text{m}$, misurati lungo il bordo. Con una palla più lenta il tempo di volo cresce e lo scarto aumenta; con una piattaforma che gira più in fretta, anche.
```

Nella figura qui sotto lanci la palla e scegli il verso e la velocità di rotazione della piattaforma, e da dove guardare. La domanda è: vista dalla piattaforma, da che parte curva la palla, e che cosa cambia se la piattaforma gira nell'altro verso?

```interattivo
% nome: giostra-coriolis-palla
% alt: Una piattaforma rotante vista dall'alto, di raggio 3 metri, con un bambino seduto sul bordo e una palla che parte dal centro verso di lui a 2 metri al secondo. Un cursore sceglie la velocità angolare, da meno 0,8 a 0,8 radianti al secondo (positiva in senso antiorario), e un selettore il punto di vista. Dal suolo la piattaforma e il bambino ruotano e la palla va dritta; dalla piattaforma il bambino è fermo, un albero fuori dalla piattaforma gira in senso opposto e la palla curva. Sotto la figura sono scritti il tempo, l'arco percorso dal bambino e da che parte passa la palla
```

Vista dalla piattaforma la palla curva verso destra quando la rotazione è antioraria e verso sinistra quando è oraria; più la rotazione è veloce, più la curva è stretta. Con la piattaforma ferma la palla arriva al bambino. Vista dal suolo, in tutti i casi, la palla va dritta.

Le proprietà della forza di Coriolis, in un sistema che ruota:

- agisce solo sui corpi che si muovono rispetto al sistema; su un corpo fermo è nulla;
- è perpendicolare alla velocità del corpo: cambia la direzione del moto, non il modulo della velocità;
- devia verso destra rispetto al verso del moto se il sistema ruota in senso antiorario, verso sinistra se ruota in senso orario;
- cresce con la velocità angolare del sistema, con la velocità del corpo e con la sua massa.

### La forza di Coriolis sulla Terra

Vista da sopra il polo nord la Terra ruota in senso antiorario; vista da sopra il polo sud, in senso orario. Per i moti orizzontali, cioè paralleli al suolo, ne segue una regola:

> Nell'emisfero nord i corpi in moto sono deviati verso destra rispetto al verso del moto, nell'emisfero sud verso sinistra.

La deviazione è più forte alle alte latitudini e si annulla all'equatore. La Terra ruota lentamente, un giro al giorno, e l'effetto è trascurabile per una palla lanciata o per un'auto. Diventa importante quando il moto dura ore o giorni e copre centinaia di chilometri.

- I cicloni. L'aria si muove verso il centro di una zona di bassa pressione. Nell'emisfero nord ogni massa d'aria, mentre si avvicina al centro, viene deviata verso destra: invece di arrivare dritta al centro gli gira intorno, e il vortice ruota in senso antiorario. Nell'emisfero sud i cicloni ruotano in senso orario.
- Gli alisei. Vicino al suolo l'aria va dalle fasce intorno ai $30^\circ$ di latitudine verso l'equatore. Nell'emisfero nord, andando verso sud, è deviata verso destra, cioè verso ovest: gli alisei soffiano da nord-est. Nell'emisfero sud soffiano da sud-est.
- Le correnti oceaniche. Le grandi correnti formano circuiti che ruotano in senso orario negli oceani dell'emisfero nord e antiorario in quelli dell'emisfero sud.
- Il pendolo di Foucault. Nel 1851 Léon Foucault appese nel Panthéon di Parigi un pendolo lungo $67\,\text{m}$ e mostrò che il piano in cui oscillava ruotava lentamente in senso orario, di circa $11^\circ$ ogni ora. Vista dal suolo che ruota, è la forza di Coriolis che devia la massa verso destra a ogni oscillazione; vista dalle stelle, il pendolo continua a oscillare nello stesso piano ed è il pavimento che gli gira sotto. È una prova della rotazione terrestre fatta dentro una stanza.

```tikz
% nome: ciclone-emisfero-nord
% alt: Lo schema di un ciclone dell'emisfero nord visto dall'alto. Al centro la lettera B indica la bassa pressione. Quattro frecce tratteggiate sottili, da nord, sud, est e ovest, puntano dritte verso il centro: è il percorso che l'aria farebbe senza rotazione terrestre. Quattro frecce blu partono dagli stessi punti e curvano ciascuna verso la propria destra, finendo per girare intorno al centro: insieme disegnano un vortice che ruota in senso antiorario
\begin{tikzpicture}
\node at (0,0) {B};
\draw[thin] (0,0) circle (0.35);
\foreach \a in {0,90,180,270} {
  \draw[-{Stealth}, thin, dashed, gray, rotate=\a] (2.3,0) -- (0.5,0);
  \draw[-{Stealth}, thick, blue!60!black, rotate=\a] (2.3,0) .. controls (1.4,0) and (0.9,0.3) .. (0.55,0.8);
}
\end{tikzpicture}
```

```ad-warning
Il lavandino non è un ciclone
Si sente dire che l'acqua del lavandino gira in un verso nell'emisfero nord e nell'altro nell'emisfero sud. Non è vero: su mezzo metro e in pochi secondi la forza di Coriolis è migliaia di volte più piccola delle altre cause, cioè la forma del lavandino e il moto che l'acqua aveva già. Il verso cambia da un lavandino all'altro, e nello stesso lavandino da una volta all'altra.
```

## Forze vere e forze apparenti a confronto

| | Forze vere | Forze apparenti |
|---|---|---|
| Chi le esercita | un altro corpo | nessuno |
| Reazione (terzo principio) | c'è sempre | non c'è |
| In quali sistemi compaiono | in tutti | solo in quelli non inerziali |
| Da che cosa dipendono | dal tipo di interazione | dalla massa del corpo e dall'accelerazione del sistema |
| Esempi | peso, tensione, attrito, forza elastica | $-m\,\vec A$, forza centrifuga, forza di Coriolis |

"Apparente" non vuol dire immaginaria negli effetti: in una curva presa troppo veloce il passeggero finisce davvero contro la portiera. Vuol dire che la causa non è una spinta, ma l'accelerazione del sistema da cui si guarda.
