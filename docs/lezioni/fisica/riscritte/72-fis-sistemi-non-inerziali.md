# Sistemi di riferimento inerziali e non inerziali

Sei in piedi su un autobus che viaggia tranquillo, e non ti tieni a niente. Finché la velocità resta la stessa stai in equilibrio come sul marciapiede; appena l'autista frena, ti ritrovi a cadere in avanti senza che nessuno ti abbia spinto. Per chi guarda dalla strada non c'è niente di strano, per te che sei a bordo sì: il [primo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali) vale in certi sistemi di riferimento e in altri no. Questa lezione li distingue e insegna a riconoscerli.

## Due osservatori per lo stesso moto

Un moto si descrive sempre rispetto a un [sistema di riferimento](/materiale/scuola-superiore/fisica/il-moto-rettilineo/punto-materiale-traiettoria-e-sistema-di-riferimento): un corpo scelto come riferimento, degli assi per le posizioni e un orologio per i tempi. Chi fa le misure in un sistema di riferimento si chiama **osservatore**. Qui gli osservatori sono sempre due: uno fermo rispetto al suolo, sulla strada o sulla banchina, e uno fermo rispetto a un veicolo, cioè seduto a bordo.

I due osservatori guardano lo stesso corpo e misurano posizioni e velocità diverse: per il passeggero seduto la valigia sulla cappelliera è ferma, per chi sta sulla strada corre a $50\,\text{km/h}$. Fin qui niente di male, perché la velocità dipende dal riferimento. La domanda di questa lezione è un'altra: i due osservatori possono usare le stesse leggi per spiegare quello che vedono?

## I sistemi inerziali

Il primo principio dice che un corpo su cui la forza totale è nulla resta fermo o si muove di moto rettilineo uniforme. Un **sistema di riferimento inerziale** è un sistema in cui questo accade davvero: ogni corpo libero, cioè con forza totale nulla, ha velocità costante.

Per sapere se un sistema è inerziale si fa quindi una prova: si prende un corpo su cui le forze si bilanciano, per esempio un disco su un piano orizzontale liscio, e lo si guarda. Se resta fermo dove lo si appoggia, o se una volta lanciato va dritto con velocità costante, il sistema è inerziale. Se parte da solo, o se curva senza che niente lo spinga di lato, non lo è.

Il suolo supera la prova con ottima approssimazione (quanto buona lo vedrai in fondo alla lezione), e per questo nel biennio tutti i moti si descrivevano rispetto al suolo. Non è però l'unico sistema inerziale:

> Ogni sistema di riferimento che si muove di moto rettilineo uniforme rispetto a un sistema inerziale è anch'esso inerziale.

Su un treno che viaggia a velocità costante su un rettilineo un bicchiere appoggiato sul tavolino resta dov'è, una moneta lasciata cadere arriva ai tuoi piedi, e una pallina fatta rotolare sul pavimento va dritta. Il motivo è che un corpo con velocità costante rispetto al suolo ha velocità costante anche rispetto al treno: le due velocità differiscono solo per quella del treno, che non cambia. Il conto è nella lezione [Le trasformazioni di Galileo e la composizione delle velocità](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/le-trasformazioni-di-galileo-e-la-composizione-delle-velocita), e le sue conseguenze nella lezione [Il principio di relatività galileiana](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/il-principio-di-relativita-galileiana).

```ad-warning
Inerziale non vuol dire fermo
Un sistema di riferimento può muoversi, anche molto in fretta, ed essere inerziale: conta che la sua velocità rispetto a un sistema inerziale non cambi, né in modulo né in direzione. Un aereo in crociera a $900\,\text{km/h}$ in linea retta è un sistema inerziale quanto la pista; lo stesso aereo che decolla, a velocità molto più bassa, non lo è.
```

## I sistemi non inerziali

Un **sistema di riferimento non inerziale** è un sistema in cui il primo principio non vale: un corpo libero, visto da lì, non ha velocità costante. Sono non inerziali tutti i sistemi che hanno un'accelerazione rispetto a un sistema inerziale, cioè quelli che:

- cambiano il modulo della velocità, come un autobus che parte o che frena;
- cambiano la direzione della velocità, come un'auto in curva;
- ruotano, come una giostra.

L'accelerazione del sistema di riferimento, misurata da un sistema inerziale, si indica con $\vec A$, con la maiuscola, per non confonderla con l'accelerazione $\vec a$ dei corpi che si studiano.

### L'autobus che frena

Sul pavimento di un autobus c'è un pallone, e il pavimento è così liscio che l'attrito si può trascurare. Sul pallone agiscono il peso e la reazione del pavimento, che si bilanciano: la forza totale è nulla. Finché l'autobus va a velocità costante il pallone resta dov'è. Poi l'autobus frena.

Dalla strada si vede questo: il pallone continua ad andare avanti con la velocità che aveva, perché nessuna forza orizzontale agisce su di lui, mentre l'autobus rallenta. La parete davanti, che rallenta con l'autobus, viene raggiunta dal pallone. Il primo principio è rispettato. Nella figura le frecce sono le velocità rispetto alla strada: quella dentro l'autobus è del pallone, quella sopra il tetto è dell'autobus.

```tikz
% nome: autobus-frena-visto-dalla-strada
% alt: Un autobus che frena, visto dalla strada, disegnato in tre istanti uno sotto l'altro: a zero, uno e due secondi. Il pallone sul pavimento avanza ogni secondo dello stesso tratto, 12 metri, e la sua velocità è una freccia sempre della stessa lunghezza. L'autobus avanza ogni secondo di un tratto più corto, 10,5 metri e poi 7,5 metri, e la freccia della sua velocità si accorcia. Al terzo istante il pallone tocca la parete davanti dell'autobus
\begin{tikzpicture}
\foreach \y/\xr/\xb/\vl/\lab in {3.4/-1.2/-0.12/1/0, 1.7/1.95/3.48/0.75/1, 0/4.2/7.08/0.5/2} {
  \draw[thick] (-1.5,\y) -- (8.3,\y);
  \draw[thick, fill=orange!25] (\xr,\y+0.18) rectangle (\xr+3,\y+1.1);
  \draw[thin] (\xr,\y+0.38) -- (\xr+3,\y+0.38);
  \draw[thick, fill=gray!20] (\xr+0.6,\y+0.18) circle (0.18);
  \draw[thick, fill=gray!20] (\xr+2.4,\y+0.18) circle (0.18);
  \draw[thick, fill=blue!10] (\xb,\y+0.5) circle (0.12);
  \draw[-{Stealth}, thick, blue!60!black] (\xb,\y+0.82) -- (\xb+1,\y+0.82);
  \draw[-{Stealth}, thick, blue!60!black] (\xr+0.2,\y+1.3) -- (\xr+0.2+\vl,\y+1.3);
  \node[left] at (-1.5,\y+0.6) {\small $t = \lab$ s};
}
\foreach \x in {-0.12,3.48,7.08} \draw[dashed, thin, gray] (\x,-0.25) -- (\x,4.5);
\draw[{Stealth}-{Stealth}, thin] (-0.12,-0.25) -- (3.48,-0.25);
\node[below] at (1.68,-0.25) {\small $12$ m};
\draw[{Stealth}-{Stealth}, thin] (3.48,-0.25) -- (7.08,-0.25);
\node[below] at (5.28,-0.25) {\small $12$ m};
\end{tikzpicture}
```

Dall'autobus si vede un'altra cosa: il pallone, che era fermo, parte da solo verso la parete davanti e va sempre più veloce. Su di lui la forza totale è nulla, eppure accelera. Nel sistema di riferimento dell'autobus che frena il primo principio non vale: quel sistema non è inerziale.

```tikz
% nome: autobus-frena-visto-da-dentro
% alt: Lo stesso autobus visto da chi è a bordo: l'autobus è fermo nel disegno e il pallone è disegnato in tre posizioni, a zero, uno e due secondi. Parte fermo, dopo un secondo ha percorso 1,5 metri e dopo due secondi 6 metri, fino alla parete davanti. La freccia della sua velocità rispetto all'autobus è assente all'inizio, poi cresce; una freccia verde indica la sua accelerazione rispetto all'autobus, diretta in avanti
\begin{tikzpicture}
\draw[thick] (-3,0) -- (4.4,0);
\draw[thick, fill=orange!25] (-2.4,0.25) rectangle (3.6,2.3);
\draw[thin] (-2.4,0.55) -- (3.6,0.55);
\draw[thick, fill=gray!20] (-1.4,0.25) circle (0.25);
\draw[thick, fill=gray!20] (2.6,0.25) circle (0.25);
\foreach \x in {-0.15,0.75,3.45} \draw[thick, fill=blue!10] (\x,0.7) circle (0.15);
\node[above] at (-0.15,0.85) {\scriptsize $0$ s};
\node[above] at (0.75,0.85) {\scriptsize $1$ s};
\node[above] at (3.3,0.85) {\scriptsize $2$ s};
\draw[-{Stealth}, thick, blue!60!black] (0.95,0.7) -- (1.4,0.7);
\draw[-{Stealth}, thick, blue!60!black] (2.4,0.7) -- (3.3,0.7);
\draw[-{Stealth}, thick, green!50!black] (0.2,1.75) -- (1.4,1.75) node[right] {$\vec{a}\,'$};
\draw[{Stealth}-{Stealth}, thin] (0,-0.3) -- (3.6,-0.3);
\node[below] at (1.8,-0.3) {\small $6{,}0$ m};
\end{tikzpicture}
```

Quanto vale l'accelerazione del pallone vista dall'autobus si trova con le leggi orarie del [moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato), scritte rispetto alla strada. Se nell'istante in cui comincia la frenata l'autobus e il pallone hanno velocità $v_0$, e l'autobus rallenta con un'accelerazione di modulo $A$, dopo un tempo $t$ gli spostamenti rispetto alla strada sono

$$\Delta s_{\text{pallone}} = v_0\,t \qquad \Delta s_{\text{autobus}} = v_0\,t - \tfrac{1}{2}A\,t^2$$

Il pallone ha guadagnato sull'autobus la differenza:

$$\Delta s\,' = \Delta s_{\text{pallone}} - \Delta s_{\text{autobus}} = \tfrac{1}{2}A\,t^2$$

È la legge di un moto uniformemente accelerato che parte da fermo con accelerazione $A$. La velocità $v_0$ è sparita dal risultato: per chi è a bordo conta solo la frenata. Rispetto all'autobus il pallone accelera in avanti con la stessa accelerazione, in modulo, con cui l'autobus rallenta.

```ad-example
Esempio 1: il pallone sull'autobus
Un autobus viaggia a $12\,\text{m/s}$ e frena con un'accelerazione di modulo $3{,}0\,\text{m/s}^2$. Un pallone è fermo sul pavimento liscio, a $6{,}0\,\text{m}$ dalla parete davanti. Dopo quanto tempo il pallone tocca la parete? Con quale velocità rispetto all'autobus?

Rispetto all'autobus il pallone parte da fermo e accelera in avanti con $a' = A = 3{,}0\,\text{m/s}^2$. Deve percorrere $\Delta s\,' = 6{,}0\,\text{m}$:

$$\Delta s\,' = \tfrac{1}{2}A\,t^2 \quad\Rightarrow\quad t = \sqrt{\frac{2\,\Delta s\,'}{A}} = \sqrt{\frac{2 \cdot 6{,}0\,\text{m}}{3{,}0\,\text{m/s}^2}} = 2{,}0\,\text{s}$$

$$v' = A\,t = 3{,}0\,\text{m/s}^2 \cdot 2{,}0\,\text{s} = 6{,}0\,\text{m/s}$$

Controllo dalla strada: in $2{,}0\,\text{s}$ il pallone percorre $12 \cdot 2{,}0 = 24\,\text{m}$, l'autobus $12 \cdot 2{,}0 - \tfrac{1}{2} \cdot 3{,}0 \cdot 2{,}0^2 = 18\,\text{m}$. La differenza è proprio $6{,}0\,\text{m}$. In quell'istante l'autobus va a $12 - 3{,}0 \cdot 2{,}0 = 6{,}0\,\text{m/s}$ e il pallone ancora a $12\,\text{m/s}$: la differenza è la velocità $v'$ trovata sopra. Sono i numeri delle due figure.
```

Nella figura qui sotto fai frenare l'autobus e scegli da dove guardare. La domanda è: che cosa fa il pallone per chi sta sulla strada, e che cosa fa per chi sta a bordo?

```interattivo
% nome: autobus-frena-due-osservatori
% alt: Un autobus con un pallone sul pavimento liscio viaggia a 12 metri al secondo e poi frena; un cursore sceglie la frenata, da 1,5 a 4 metri al secondo quadrato, e un selettore il punto di vista. Dalla strada il pallone avanza a velocità costante e l'autobus rallenta sotto di lui; dall'autobus la strada scorre all'indietro e il pallone, partendo da fermo, accelera verso la parete davanti. Sotto la figura sono scritti il tempo, la velocità e l'accelerazione del pallone nel sistema scelto, e la forza orizzontale sul pallone, che è zero in tutti e due i casi
```

Visto dalla strada il pallone tiene la sua velocità di $12\,\text{m/s}$ dall'inizio alla fine, e ha accelerazione zero. Visto dall'autobus parte da fermo e accelera in avanti, tanto più in fretta quanto più forte è la frenata. La forza orizzontale sul pallone è zero in tutti e due i casi: solo il primo osservatore può spiegare quello che vede con il primo principio.

### La regola generale

Il conto fatto per l'autobus vale per qualunque sistema che accelera in linea retta, anche quando parte invece di frenare:

> In un sistema di riferimento che ha accelerazione $\vec A$ rispetto a un sistema inerziale, un corpo libero ha accelerazione $\vec a\,' = -\vec A$.

Il segno meno dice che il corpo libero accelera nel verso opposto a quello dell'accelerazione del sistema. Se l'autobus frena, $\vec A$ è diretta all'indietro e i corpi liberi partono in avanti; se l'autobus parte, $\vec A$ è diretta in avanti e i corpi liberi restano indietro, verso il fondo. In tutti e due i casi è l'autobus che cambia velocità: il corpo libero, visto dalla strada, non fa niente.

In un sistema non inerziale non vale nemmeno il [secondo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica) così com'è: la forza totale sul pallone è zero, la sua accelerazione rispetto all'autobus non lo è, e quindi $\vec F_{tot} = m\,\vec a\,'$ è falsa. Chi vuole usare lo stesso i principi della dinamica stando a bordo deve aggiungere alle forze vere una forza in più, che si chiama forza apparente: è l'argomento della lezione [Le forze apparenti: forza centrifuga e forza di Coriolis](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/le-forze-apparenti-forza-centrifuga-e-forza-di-coriolis). In questa lezione tutti i conti si fanno dal sistema inerziale, dove i principi valgono senza aggiunte.

```ad-warning
In frenata nessuna forza ti spinge in avanti
"La frenata mi ha spinto contro il sedile davanti" descrive quello che si sente, ma nessun corpo ti ha spinto: il tuo corpo ha continuato ad andare avanti con la velocità che aveva, e l'autobus ha rallentato. Le forze vere sono quelle che ti fermano insieme all'autobus: l'attrito delle scarpe, il sostegno a cui ti tieni, la cintura.
```

## Riconoscere un sistema non inerziale da dentro

Chi è chiuso in un vagone senza finestrini può capire lo stesso se il vagone accelera: gli serve solo un corpo che possa muoversi liberamente. Un pallone sul pavimento che parte da solo, l'acqua in un bicchiere che si inclina, una valigia che scivola dicono tutti la stessa cosa. Lo strumento più semplice è un pendolo, cioè un oggetto appeso a un filo.

In un sistema inerziale un pendolo fermo sta in verticale: la tensione del filo bilancia il peso. In un veicolo che accelera in orizzontale il pendolo, una volta fermo rispetto al veicolo, resta inclinato all'indietro. Visto dalla strada il motivo è chiaro: l'oggetto appeso accelera insieme al veicolo, quindi su di lui la forza totale deve valere $m\,\vec A$ ed essere orizzontale. Il peso è verticale, e l'unica forza che può avere una componente orizzontale è la tensione: per questo il filo si inclina.

Se il filo forma l'angolo $\theta$ con la verticale, la tensione $\vec T$ ha una componente verticale $T\cos\theta$ e una orizzontale $T\sin\theta$ (le trovi con il [seno e il coseno](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore)). In verticale non c'è accelerazione, in orizzontale c'è $A$:

$$T\cos\theta = m\,g \qquad T\sin\theta = m\,A$$

Dividendo la seconda equazione per la prima la tensione e la massa si semplificano:

$$\tan\theta = \frac{A}{g}$$

L'angolo non dipende dalla massa dell'oggetto né dalla lunghezza del filo, ma solo dall'accelerazione del veicolo: un pendolo con un goniometro è un accelerometro. Se $A = 0$ l'angolo è zero, qualunque sia la velocità.

```ad-example
Esempio 2: il profumatore appeso allo specchietto
Un profumatore di $0{,}10\,\text{kg}$ è appeso con un filo allo specchietto di un'auto. Mentre l'auto accelera su un rettilineo con $3{,}0\,\text{m/s}^2$ il filo resta inclinato all'indietro di un angolo costante. Quanto vale l'angolo con la verticale? Quanto vale la tensione del filo?

$$\tan\theta = \frac{A}{g} = \frac{3{,}0\,\text{m/s}^2}{9{,}8\,\text{m/s}^2} = 0{,}306\ldots \quad\Rightarrow\quad \theta = 17{,}0\ldots^\circ \approx 17^\circ$$

La tensione ha componenti $m\,g$ in verticale e $m\,A$ in orizzontale, perpendicolari tra loro:

$$T = m\sqrt{g^2 + A^2} = 0{,}10\,\text{kg} \cdot \sqrt{9{,}8^2 + 3{,}0^2}\,\text{m/s}^2 = 1{,}02\ldots\,\text{N} \approx 1{,}0\,\text{N}$$

poco più del peso, che vale $0{,}98\,\text{N}$. Nella figura, a destra, le due forze sul profumatore in scala ($2\,\text{cm}$ per newton) e la loro somma, che è orizzontale e vale $m\,A = 0{,}30\,\text{N}$.

```tikz
% nome: pendolo-auto-accelera
% alt: A sinistra l'abitacolo di un'auto che accelera verso destra, con una freccia verde A; dal soffitto pende un oggetto appeso a un filo, inclinato all'indietro di un angolo theta di 17 gradi rispetto alla verticale tratteggiata. A destra il diagramma delle forze sull'oggetto: il peso P verso il basso, la tensione T lungo il filo, verso l'alto e un po' in avanti, e la loro somma, una freccia arancione corta e orizzontale diretta in avanti, uguale alla massa per l'accelerazione
\begin{tikzpicture}
\draw[thick] (-0.4,0) -- (4.4,0);
\foreach \x in {-0.25,-0.1,...,4.4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=orange!25] (0,0.3) rectangle (4,3.2);
\draw[thick, fill=gray!20] (0.8,0.3) circle (0.3);
\draw[thick, fill=gray!20] (3.2,0.3) circle (0.3);
\draw[dashed, thin] (2.4,3.2) -- (2.4,1.0);
\draw (2.4,3.2) -- (1.873,1.479);
\draw[thick, fill=blue!10] (1.873,1.479) circle (0.14);
\draw (2.4,2.5) arc[start angle=270, end angle=253, radius=0.7];
\node at (2.26,2.25) {\scriptsize $\theta$};
\draw[-{Stealth}, thick, green!50!black] (1.4,3.5) -- (2.6,3.5) node[right] {$\vec{A}$};
\draw[-{Stealth}, thick, red] (6,2.2) -- (6.6,4.16) node[right] {$\vec{T}$};
\draw[-{Stealth}, thick, red] (6,2.2) -- (6,0.24) node[right] {$\vec{P}$};
\draw[dashed, thin] (6.6,4.16) -- (6.6,2.2);
\draw[-{Stealth}, thick, orange!90!black] (6,2.2) -- (6.6,2.2);
\node[right] at (6.6,2.2) {$m\vec{A}$};
\fill (6,2.2) circle (1.5pt);
\end{tikzpicture}
```
```

```ad-example
Esempio 3: quanto accelera il treno
Su un treno che parte dalla stazione un ciondolo appeso al finestrino resta inclinato di $5^\circ$ rispetto alla verticale. Quanto vale l'accelerazione del treno? Da quale parte pende il ciondolo?

$$A = g\tan\theta = 9{,}8\,\text{m/s}^2 \cdot \tan 5^\circ = 9{,}8\,\text{m/s}^2 \cdot 0{,}0875 = 0{,}857\ldots\,\text{m/s}^2 \approx 0{,}86\,\text{m/s}^2$$

Il treno parte, quindi $\vec A$ è diretta in avanti, e il ciondolo pende all'indietro, verso la coda. Quando il treno raggiunge la velocità di crociera il ciondolo torna in verticale; quando frena per la stazione successiva pende in avanti.
```

```ad-warning
Il pendolo misura l'accelerazione, non la velocità
Il filo inclinato dice che il veicolo accelera, e in che verso; non dice se va piano o forte. A $300\,\text{km/h}$ costanti il pendolo sta in verticale come in una stanza, e nessun esperimento fatto a bordo permette di accorgersi del moto: è il principio di relatività galileiana.
```

## L'ascensore

Un ascensore che parte o che si ferma accelera in verticale, e per qualche secondo è un sistema non inerziale. Lo si sente nelle gambe: più pesanti quando parte in salita, più leggeri quando parte in discesa. Che cosa segna una bilancia in quei momenti è scritto nella lezione [Il diagramma delle forze](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-diagramma-delle-forze); qui interessa un'altra prova, quella del corpo libero.

Lascia cadere una pallina dentro l'ascensore. Vista dal palazzo, che è un sistema inerziale, la pallina è in [caduta libera](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale) con accelerazione $g$ verso il basso, qualunque cosa faccia l'ascensore. Ma il pavimento non la aspetta fermo: se l'ascensore accelera verso l'alto con $A$ il pavimento le va incontro, e rispetto all'ascensore la pallina cade con un'accelerazione più grande; se l'ascensore accelera verso il basso il pavimento le scappa, e la pallina cade con un'accelerazione più piccola.

| Accelerazione dell'ascensore | Accelerazione della pallina rispetto all'ascensore |
|---|---|
| nulla (fermo o a velocità costante) | $g$ |
| $A$ verso l'alto | $g + A$ |
| $A$ verso il basso | $g - A$ |
| $g$ verso il basso (caduta libera) | $0$ |

Chi sta nell'ascensore misura il tempo di caduta e trova un valore di "$g$" che non è $9{,}8\,\text{m/s}^2$: così sa che il suo sistema non è inerziale.

```ad-example
Esempio 4: la pallina lasciata cadere in ascensore
In un ascensore una pallina viene lasciata cadere da $1{,}5\,\text{m}$ dal pavimento. Quanto tempo impiega a toccare il pavimento se l'ascensore è fermo? E se sta partendo verso l'alto con un'accelerazione di $1{,}2\,\text{m/s}^2$?

```tikz
% nome: ascensore-pallina-cade
% alt: La cabina di un ascensore con una pallina a 1,5 metri dal pavimento, altezza segnata da una quota h. Sulla pallina una freccia verde verso il basso indica l'accelerazione g; accanto alla cabina una freccia verde verso l'alto indica l'accelerazione A dell'ascensore
\begin{tikzpicture}
\draw[thick, fill=gray!10] (0,0) rectangle (2.2,3);
\draw (1.1,3) -- (1.1,3.6);
\draw[thick, fill=blue!10] (1.3,1.5) circle (0.12);
\draw[-{Stealth}, thick, green!50!black] (1.3,1.38) -- (1.3,0.4);
\node[right] at (1.3,0.85) {$\vec{g}$};
\draw[{Stealth}-{Stealth}, thin] (0.5,0) -- (0.5,1.5);
\node[left] at (0.5,0.75) {$h$};
\draw[dashed, thin] (0.5,1.5) -- (1.18,1.5);
\draw[-{Stealth}, thick, green!50!black] (2.7,1.2) -- (2.7,1.8) node[above] {$\vec{A}$};
\end{tikzpicture}
```

Con l'ascensore fermo la pallina cade con accelerazione $g$, partendo da ferma:

$$h = \tfrac{1}{2}g\,t^2 \quad\Rightarrow\quad t = \sqrt{\frac{2h}{g}} = \sqrt{\frac{2 \cdot 1{,}5\,\text{m}}{9{,}8\,\text{m/s}^2}} = 0{,}553\ldots\,\text{s} \approx 0{,}55\,\text{s}$$

Con l'ascensore che accelera verso l'alto, vista dal palazzo la pallina scende di $\tfrac{1}{2}g\,t^2$ e intanto il pavimento sale di $\tfrac{1}{2}A\,t^2$ in più rispetto alla pallina (la velocità che l'ascensore aveva già, se ne aveva una, è comune ai due e non conta). I due tratti insieme coprono $h$:

$$h = \tfrac{1}{2}(g + A)\,t^2 \quad\Rightarrow\quad t = \sqrt{\frac{2h}{g + A}} = \sqrt{\frac{2 \cdot 1{,}5\,\text{m}}{11{,}0\,\text{m/s}^2}} = 0{,}522\ldots\,\text{s} \approx 0{,}52\,\text{s}$$

La pallina arriva prima. Se l'ascensore accelerasse verso il basso con $1{,}2\,\text{m/s}^2$ il tempo sarebbe $\sqrt{2 \cdot 1{,}5 / 8{,}6} \approx 0{,}59\,\text{s}$.
```

L'ultima riga della tabella è il caso limite. Se il cavo si spezzasse, ascensore e pallina cadrebbero insieme con la stessa accelerazione $g$: rispetto all'ascensore la pallina, lasciata andare, resterebbe sospesa a mezz'aria. È quello che succede agli astronauti in orbita, e la lezione [Il moto dei satelliti](/materiale/scuola-superiore/fisica/la-gravitazione/il-moto-dei-satelliti) spiega perché una stazione spaziale è in caduta libera.

```ad-warning
Conta l'accelerazione dell'ascensore, non il verso in cui va
Un ascensore che sale e sta frenando ha l'accelerazione verso il basso, come uno che parte in discesa: in tutti e due la pallina cade più lentamente. A velocità costante, in salita o in discesa, la pallina cade come a terra, perché l'ascensore è un sistema inerziale.
```

## I sistemi che ruotano

Una giostra che gira, anche a velocità angolare costante, non è un sistema inerziale: ogni suo punto percorre una circonferenza e ha un'[accelerazione centripeta](/materiale/scuola-superiore/fisica/i-moti-nel-piano/l-accelerazione-centripeta), diretta verso il centro.

La prova del corpo libero si fa con una palla fatta rotolare dal centro verso il bordo di una piattaforma liscia che ruota. Vista dal suolo la palla va dritta a velocità costante, come vuole il primo principio. Vista da chi sta sulla piattaforma e gira con lei, la palla curva: mentre la palla avanza la piattaforma le ruota sotto, e la traccia che la palla lascerebbe sul pavimento è una linea curva. Un corpo libero che curva: il primo principio non vale.

```tikz
% nome: giostra-palla-due-osservatori
% alt: Due cerchi uguali, che sono una piattaforma rotante vista dall'alto, con una freccia curva che indica la rotazione in senso antiorario. A sinistra, vista dal suolo, la palla va dal centro al bordo lungo una linea retta. A destra, vista dalla piattaforma, la stessa palla va dal centro al bordo lungo una linea che curva verso destra rispetto alla direzione in cui avanza
\begin{tikzpicture}
\draw[thick, fill=gray!10] (0,0) circle (1.5);
\draw[-{Stealth}, thin] (40:1.75) arc[start angle=40, end angle=80, radius=1.75];
\draw[thick, blue!60!black, -{Stealth}] (0,0) -- (1.5,0);
\fill (0,0) circle (1.5pt);
\node[below] at (0,-1.6) {\small vista dal suolo};
\draw[thick, fill=gray!10] (4.4,0) circle (1.5);
\draw[-{Stealth}, thin] (5.741,1.125) arc[start angle=40, end angle=80, radius=1.75];
\draw[thick, blue!60!black, -{Stealth}] plot[domain=0:1.5, samples=25, variable=\t] ({4.4 + \t*cos(-22.92*\t)}, {\t*sin(-22.92*\t)});
\fill (4.4,0) circle (1.5pt);
\node[below] at (4.4,-1.6) {\small vista dalla piattaforma};
\end{tikzpicture}
```

Anche il passeggero di un'auto in curva è in un sistema non inerziale: si sente spinto verso l'esterno della curva, mentre visto dalla strada è il suo corpo che tende ad andare dritto e l'auto che gli gira sotto, come spiega la lezione [La forza centripeta](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/la-forza-centripeta). Le forze apparenti dei sistemi che ruotano, la forza centrifuga e la forza di Coriolis, sono nella lezione sulle forze apparenti.

## Il suolo è quasi un sistema inerziale

A rigore il suolo non è un sistema inerziale. La Terra ruota su sé stessa in un giorno e gira intorno al Sole in un anno: un laboratorio fermo sul suolo percorre due circonferenze, e ha due accelerazioni centripete. Per sapere se si possono trascurare bisogna calcolarle e confrontarle con le accelerazioni dei moti che si studiano.

```ad-example
Esempio 5: l'accelerazione di un laboratorio all'equatore
Quanto vale l'accelerazione centripeta di un punto dell'equatore dovuta alla rotazione della Terra? E quella dovuta al moto della Terra intorno al Sole? Il raggio della Terra è $R_T = 6{,}37 \cdot 10^6\,\text{m}$ e la distanza media dal Sole $1{,}50 \cdot 10^{11}\,\text{m}$.

Per la rotazione il periodo è un giorno, $T = 24 \cdot 3600\,\text{s} = 8{,}64 \cdot 10^4\,\text{s}$:

$$\omega = \frac{2\pi}{T} = \frac{2\pi}{8{,}64 \cdot 10^4\,\text{s}} = 7{,}27 \cdot 10^{-5}\,\text{rad/s}$$

$$a_c = \omega^2 R_T = (7{,}27 \cdot 10^{-5}\,\text{rad/s})^2 \cdot 6{,}37 \cdot 10^6\,\text{m} \approx 0{,}034\,\text{m/s}^2$$

Per il moto intorno al Sole il periodo è un anno, $T = 365 \cdot 8{,}64 \cdot 10^4\,\text{s} = 3{,}15 \cdot 10^7\,\text{s}$:

$$\omega = \frac{2\pi}{3{,}15 \cdot 10^7\,\text{s}} = 1{,}99 \cdot 10^{-7}\,\text{rad/s} \qquad a_c = \omega^2 r = (1{,}99 \cdot 10^{-7}\,\text{rad/s})^2 \cdot 1{,}50 \cdot 10^{11}\,\text{m} \approx 5{,}9 \cdot 10^{-3}\,\text{m/s}^2$$

La prima è circa lo $0{,}3\%$ di $g$, la seconda lo $0{,}06\%$.
```

Sono accelerazioni piccole rispetto a quelle di un carrello su una rotaia, di un sasso che cade o di un'auto che frena, che vanno da qualche decimo a una decina di metri al secondo quadrato. Per questo il suolo si può trattare come un sistema inerziale in quasi tutti i problemi, e lo si è fatto per tutto il biennio. Gli effetti della rotazione terrestre diventano visibili quando i moti durano ore o coprono centinaia di chilometri, come quelli dei venti e delle correnti oceaniche: li trovi nella lezione sulle forze apparenti.

Un sistema di riferimento migliore del suolo è quello con l'origine nel centro del Sole e gli assi puntati verso stelle lontane, che si usa per studiare il moto dei pianeti. Un sistema inerziale perfetto è un modello, come il punto materiale: nessun sistema reale lo è del tutto, e si sceglie quello in cui l'errore non conta per il problema che si ha davanti.

## I due tipi di sistema a confronto

| | Sistema inerziale | Sistema non inerziale |
|---|---|---|
| Moto rispetto a un sistema inerziale | fermo o rettilineo uniforme | accelerato: parte, frena, curva o ruota |
| Un corpo libero | ha velocità costante | accelera con $\vec a\,' = -\vec A$ |
| Primo e secondo principio | valgono | non valgono, se si contano solo le forze vere |
| Un pendolo fermo | è verticale | è inclinato, con $\tan\theta = A/g$ se $\vec A$ è orizzontale |
| Esempi | il suolo, un treno a velocità costante su un rettilineo | un autobus che frena, un ascensore che parte, una giostra |
