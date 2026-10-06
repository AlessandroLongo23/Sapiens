# Dal sistema tolemaico al sistema copernicano

Se guardi il cielo per qualche ora, le stelle girano tutte insieme attorno alla Stella Polare, come dipinte su una sfera che ruota. Se lo guardi per qualche mese, ti accorgi che cinque punti luminosi non stanno al loro posto: Mercurio, Venere, Marte, Giove e Saturno si spostano da una costellazione all'altra. I Greci li chiamarono pianeti, cioè "erranti". Spiegare come si muovono è stato per duemila anni il problema dell'astronomia, e le due risposte principali, quella di Tolomeo e quella di Copernico, mettono al centro due corpi diversi: la Terra oppure il Sole.

## Che cosa si vede dalla Terra

Un modello del cielo deve rendere conto di tre fatti, che chiunque può osservare a occhio nudo.

- Le stelle compiono un giro in un giorno e non cambiano posizione l'una rispetto all'altra: per questo si chiamano stelle fisse.
- Il Sole e la Luna, oltre a seguire il giro quotidiano, scivolano piano tra le stelle sempre nello stesso verso: il Sole completa il giro in un anno, la Luna in circa un mese.
- I pianeti si spostano tra le stelle nello stesso verso del Sole (**moto diretto**), ma ogni tanto rallentano, si fermano, tornano indietro per qualche settimana (**moto retrogrado**) e poi riprendono il moto diretto. Marte, Giove e Saturno, durante il moto retrogrado, sono più luminosi del solito.

Marte, per esempio, torna indietro per circa due mesi e mezzo ogni due anni circa. Segnando la sua posizione tra le stelle a intervalli di tempo uguali si ottiene un disegno come questo.

```tikz
% nome: moto-retrogrado-marte-tra-le-stelle
% alt: La traiettoria di un pianeta tra le stelle fisse, vista dalla Terra, segnata con undici pallini a intervalli di tempo uguali: il pianeta avanza da destra verso sinistra (moto diretto), rallenta, torna indietro verso destra per un tratto (moto retrogrado) e poi riprende ad avanzare verso sinistra, disegnando una Z schiacciata
\begin{tikzpicture}
\foreach \p in {(-2.6,-0.2),(-1.7,-1.2),(-0.9,0.35),(0.5,-1.3),(1.6,1.25),(2.6,-0.5),(-2.3,-0.75),(2.2,0.45),(0.2,1.3),(-0.35,-0.95)} \fill[gray] \p circle (0.7pt);
\draw[thick, blue!60!black] plot[domain=-200:200, samples=81, variable=\t] ({-0.008*\t + 1.3*sin(\t)}, {sin(\t/2)});
\foreach \t in {-200,-160,-120,-80,-40,0,40,80,120,160,200} \fill[blue!60!black] ({-0.008*\t + 1.3*sin(\t)}, {sin(\t/2)}) circle (1.6pt);
\draw[-{Stealth}, thin] (2.2,-1.35) -- (1.1,-1.35);
\node[below] at (1.65,-1.35) {moto diretto};
\draw[-{Stealth}, thin] (1.15,0.05) -- (2.15,0.05);
\node[below] at (1.75,0.0) {moto retrogrado};
\draw[-{Stealth}, thin] (-1.1,1.35) -- (-2.2,1.35);
\node[above] at (-1.65,1.35) {moto diretto};
\end{tikzpicture}
```

I pallini sono fitti dove il pianeta rallenta e inverte la marcia, radi dove avanza svelto. Il moto retrogrado è la difficoltà su cui si misura ogni modello.

## Il sistema geocentrico di Tolomeo

Per Aristotele (IV secolo a.C.) la Terra sta ferma al centro dell'universo e tutto il resto le gira attorno su sfere, con moti circolari e uniformi, i soli ritenuti adatti ai corpi celesti. È l'idea più naturale: la Terra sotto i piedi non si sente muovere, e il cielo si vede girare. Un modello in cui la Terra è al centro si chiama **geocentrico**.

Un pianeta che gira attorno alla Terra su un cerchio, a velocità costante, non torna mai indietro. Per ottenere il moto retrogrado restando fedele ai cerchi, Claudio Tolomeo, astronomo di Alessandria d'Egitto, nel II secolo d.C. raccolse nell'*Almagesto* un modello con due cerchi per ogni pianeta:

- il **deferente**, un grande cerchio attorno alla Terra;
- l'**epiciclo**, un cerchio più piccolo il cui centro percorre il deferente; il pianeta percorre l'epiciclo.

```tikz
% nome: deferente-epiciclo-tolomeo
% alt: Il modello di Tolomeo per un pianeta. La Terra T è al centro di un grande cerchio tratteggiato, il deferente. Un punto C del deferente è il centro di un cerchio più piccolo, l'epiciclo, su cui si trova il pianeta P. Due frecce curve indicano che C percorre il deferente e P percorre l'epiciclo nello stesso verso, antiorario
\begin{tikzpicture}
\draw[thin, dashed] (0,0) circle (2.2);
\draw[thick, fill=blue!10] (0,0) circle (0.14) node[below=3pt] {$T$};
\draw[thin] (0,0) -- (40:2.2);
\fill (40:2.2) circle (1.5pt) node[above right] {$C$};
\draw[thin] (40:2.2) circle (0.8);
\draw[thin] (40:2.2) -- ++(200:0.8);
\draw[thick, fill=orange!25] (40:2.2) ++(200:0.8) circle (0.1) node[below left] {$P$};
\draw[-{Stealth}, thin] (62:2.45) arc (62:82:2.45);
\draw[-{Stealth}, thin] (40:2.2) ++(-30:1.0) arc (-30:10:1.0);
\node at (0,-1.75) {deferente};
\node at (2.55,2.55) {epiciclo};
\end{tikzpicture}
```

Visto dalla Terra, il pianeta fa due moti insieme: è trascinato in avanti dal centro $C$ dell'epiciclo e intanto gira attorno a $C$. Quando si trova nella parte esterna dell'epiciclo i due moti vanno nello stesso verso, e il pianeta avanza svelto. Quando passa nella parte interna, quella più vicina alla Terra, il moto sull'epiciclo va all'indietro: se è più veloce di quello di $C$, il pianeta torna indietro. Il modello spiega anche la luminosità: il pianeta è retrogrado proprio quando è più vicino alla Terra.

La figura qui sotto fa girare i due cerchi e disegna la strada del pianeta vista dalla Terra. Che cosa succede ai cappi se l'epiciclo gira più lentamente?

```interattivo
% nome: epiciclo-deferente-cappi
% alt: Il modello di Tolomeo in movimento: la Terra al centro, il deferente, l'epiciclo con il pianeta, e la traccia della strada percorsa dal pianeta, che forma dei cappi. Due cursori cambiano il raggio dell'epiciclo, da 0,2 a 0,8 volte quello del deferente, e il numero di giri che il pianeta fa sull'epiciclo mentre il centro fa un giro sul deferente, da 2 a 8. Sotto la figura sono scritti il rapporto tra le due velocità e se il pianeta, nel punto più vicino alla Terra, avanza o torna indietro
```

Con l'epiciclo lento, o piccolo, i cappi si aprono e diventano semplici ondulazioni: il pianeta rallenta ma non torna più indietro. Il cappio c'è solo quando la velocità del pianeta sull'epiciclo supera quella con cui il centro dell'epiciclo avanza sul deferente.

```ad-example
Esempio 1: l'epiciclo di Marte fa tornare indietro il pianeta?
Nel modello di Tolomeo per Marte il raggio $r$ dell'epiciclo è $0{,}658$ volte il raggio $R$ del deferente. Il centro dell'epiciclo fa un giro del deferente in $T_d = 1{,}88$ anni, e Marte fa un giro dell'epiciclo, rispetto alle stelle, in $T_e = 1{,}00$ anni. Nel punto dell'epiciclo più vicino alla Terra, Marte avanza o torna indietro?

Sono due [moti circolari uniformi](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme), e la velocità su un cerchio è la circonferenza divisa per il periodo:

$$v_d = \frac{2\pi R}{T_d} \qquad v_e = \frac{2\pi r}{T_e}$$

Nel punto più vicino alla Terra le due velocità hanno versi opposti, quindi conta quale delle due è più grande. Il loro rapporto è

$$\frac{v_e}{v_d} = \frac{r}{R} \cdot \frac{T_d}{T_e} = 0{,}658 \cdot \frac{1{,}88}{1{,}00} = 1{,}237\ldots \approx 1{,}24$$

La velocità sull'epiciclo è più grande di quella del deferente: in quel punto Marte torna indietro, con una velocità che è $v_e - v_d = 0{,}24\,v_d$.
```

Con un deferente e un epiciclo per pianeta il modello descrive i moti retrogradi, ma non ancora bene le posizioni misurate. Tolomeo aggiunse altri accorgimenti (la Terra un po' spostata dal centro del deferente, un punto rispetto al quale il moto appare uniforme) e arrivò a prevedere le posizioni dei pianeti con errori di pochi gradi al massimo. Per questo il suo sistema, detto tolemaico, restò in uso per quasi quattordici secoli.

```ad-warning
Il sistema tolemaico non era un modello che "non funzionava"
Prevedeva le posizioni dei pianeti, le eclissi e i moti retrogradi abbastanza bene per i calendari e per la navigazione. Fu abbandonato perché un altro modello spiegava gli stessi fatti con meno ipotesi, e perché nuove osservazioni, fatte con il cannocchiale, lo contraddicevano.
```

## Il sistema eliocentrico di Copernico

Già Aristarco di Samo, nel III secolo a.C., aveva proposto che fosse la Terra a girare attorno al Sole, ma l'idea non ebbe seguito. La riprese l'astronomo polacco Niccolò Copernico, nel libro *De revolutionibus orbium coelestium*, uscito nel 1543, l'anno della sua morte. Nel **sistema copernicano**:

- il Sole è fermo al centro (modello **eliocentrico**);
- la Terra è un pianeta come gli altri e gira attorno al Sole in un anno, su un'orbita circolare;
- la Terra ruota su se stessa in un giorno: è questa rotazione a far girare il cielo, e le stelle sono ferme;
- la Luna è l'unico corpo che gira attorno alla Terra;
- i pianeti, in ordine di distanza dal Sole, sono Mercurio, Venere, Terra, Marte, Giove, Saturno, e più un pianeta è lontano dal Sole più tempo impiega a compiere un giro.

### Il moto retrogrado diventa un sorpasso

Nel sistema copernicano nessun pianeta torna mai indietro. La Terra, più vicina al Sole, gira più in fretta di Marte e ogni due anni circa lo raggiunge e lo supera. Durante il sorpasso, chi guarda Marte dalla Terra lo vede spostarsi all'indietro rispetto alle stelle lontane, come dal finestrino di un'auto in autostrada si vede scivolare all'indietro, rispetto alle colline sullo sfondo, il camion che si sta superando.

```tikz
% nome: moto-retrogrado-sorpasso-copernico
% alt: Il Sole al centro di due orbite circolari: quella della Terra, più piccola, e quella di Marte. Cinque posizioni successive della Terra, numerate da 1 a 5, e le cinque posizioni di Marte negli stessi istanti: la Terra percorre un arco più lungo. Da ogni posizione della Terra parte una linea di vista che passa per Marte e arriva su una retta verticale lontana, che rappresenta le stelle fisse. I punti di arrivo, dal basso verso l'alto, sono nell'ordine 1, 4, 3, 2, 5: tra 1 e 2 Marte sale, tra 2 e 4 scende, cioè torna indietro, tra 4 e 5 sale di nuovo
\begin{tikzpicture}
\draw[thin, dashed] (0,0) circle (1.1);
\draw[thin, dashed] (0,0) circle (1.672);
\draw[thick, fill=yellow!40] (0,0) circle (0.13);
\node[left] at (-0.13,0) {$S$};
\draw[thick] (9,-2.1) -- (9,2.1);
\node[above] at (9,2.1) {stelle fisse};
\draw[thin, blue] (-80:1.1) -- (9,-1.485);
\draw[thin, blue] (-40:1.1) -- (9,0.437);
\draw[thin, blue] (0:1.1) -- (9,0.0);
\draw[thin, blue] (40:1.1) -- (9,-0.437);
\draw[thin, blue] (80:1.1) -- (9,1.485);
\foreach \a in {-80,-40,0,40,80} \fill[blue!60!black] (\a:1.1) circle (1.6pt);
\foreach \b in {-42.55,-21.28,0,21.28,42.55} \fill[red!70!black] (\b:1.672) circle (1.6pt);
\node at (-80:0.82) {$1$};
\node at (-40:0.82) {$2$};
\node at (0:0.82) {$3$};
\node at (40:0.82) {$4$};
\node at (80:0.82) {$5$};
\fill (9,-1.485) circle (1.4pt) node[right] {$1$};
\fill (9,0.437) circle (1.4pt) node[right] {$2$};
\fill (9,0.0) circle (1.4pt) node[right] {$3$};
\fill (9,-0.437) circle (1.4pt) node[right] {$4$};
\fill (9,1.485) circle (1.4pt) node[right] {$5$};
\end{tikzpicture}
```

Nella figura la Terra, sull'orbita interna, e Marte, su quella esterna, sono segnati in cinque istanti successivi, a intervalli uguali; i numeri accanto alla Terra e sulla retta delle stelle fisse indicano l'istante. Tutti e due girano in senso antiorario, ma sulla retta delle stelle fisse il punto in cui si vede Marte prima sale (da 1 a 2), poi scende (da 2 a 4), poi risale (da 4 a 5). Il tratto in discesa è il moto retrogrado, ed è centrato sull'istante 3, quando Sole, Terra e Marte sono allineati e Marte è alla minima distanza dalla Terra: per questo in quei giorni è più luminoso.

La figura qui sotto fa partire i due pianeti e segna, su una striscia in alto, la direzione in cui Marte si vede dalla Terra. Quando si inverte il verso sulla striscia?

```interattivo
% nome: moto-retrogrado-sorpasso
% alt: Il Sole al centro, la Terra e Marte sulle loro orbite circolari, con la linea di vista che parte dalla Terra e passa per Marte. Una striscia in alto, che rappresenta le stelle fisse, mostra con un pallino la direzione in cui Marte si vede dalla Terra, e lascia una traccia rossa nei tratti in cui il pallino torna indietro. Un bottone avvia e ferma il moto, un cursore sceglie il giorno, da 0 a 300: al giorno 150 Sole, Terra e Marte sono allineati. Sotto la figura sono scritti il giorno, la distanza tra la Terra e Marte e se il moto apparente di Marte è diretto o retrogrado
```

Il verso si inverte circa 36 giorni prima che la Terra raggiunga Marte, e torna quello di prima circa 36 giorni dopo il sorpasso: in tutto il moto retrogrado dura circa 73 giorni, sui 780 che passano tra un sorpasso e il successivo. Per il resto del tempo Marte si vede avanzare, perché la Terra è lontana da lui e il suo moto proprio prevale.

```ad-warning
Il moto retrogrado è apparente
Marte non inverte mai la marcia: percorre la sua orbita sempre nello stesso verso. Torna indietro solo la direzione in cui lo si vede dalla Terra, che a sua volta si muove. Scrivere che "nel moto retrogrado il pianeta gira al contrario attorno al Sole" è un errore.
```

### Le distanze dei pianeti dal Sole

Nel sistema tolemaico la grandezza dei deferenti si poteva scegliere a piacere: contava solo il rapporto tra epiciclo e deferente. Nel sistema copernicano, invece, le osservazioni fissano le distanze di tutti i pianeti dal Sole, prendendo come unità la distanza della Terra. Questa unità si usa ancora: è l'**unità astronomica** (simbolo UA), la distanza media tra la Terra e il Sole, che oggi sappiamo valere $1{,}50 \cdot 10^{11}\,\text{m}$.

```ad-example
Esempio 2: la distanza di Venere dal Sole
Venere non si vede mai lontana dal Sole: l'angolo tra le direzioni in cui si vedono Venere e il Sole, chiamato elongazione, arriva al massimo a $46^\circ$. Quanto dista Venere dal Sole, in unità astronomiche?

Venere gira attorno al Sole su un'orbita più piccola di quella della Terra. L'elongazione è massima quando la linea di vista dalla Terra sfiora l'orbita di Venere, cioè è tangente al cerchio. La tangente è perpendicolare al raggio: il triangolo Sole-Venere-Terra ha l'angolo retto in Venere.

In questo triangolo rettangolo l'ipotenusa è la distanza Terra-Sole, $1\,\text{UA}$, e il cateto opposto all'angolo di $46^\circ$ è la distanza $r_V$ di Venere dal Sole. Per la definizione di [seno](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore):

$$r_V = 1\,\text{UA} \cdot \sin 46^\circ = 0{,}7193\ldots\,\text{UA} \approx 0{,}72\,\text{UA}$$

Venere dista dal Sole circa i tre quarti della distanza della Terra.
```

```tikz
% nome: venere-massima-elongazione
% alt: Il Sole S al centro di due orbite circolari tratteggiate: quella di Venere, di raggio 0,72 unità astronomiche, e quella della Terra, di raggio 1. La Terra T è in basso. La linea di vista dalla Terra a Venere V è tangente all'orbita di Venere, quindi il triangolo S V T ha l'angolo retto in V; l'angolo in T, tra le direzioni del Sole e di Venere, è di 46 gradi
\begin{tikzpicture}
\draw[thin, dashed] (0,0) circle (3);
\draw[thin, dashed] (0,0) circle (2.158);
\draw[thick] (0,0) -- (0,-3) -- (1.499,-1.552) -- cycle;
\draw[thin] (1.499,-1.552) ++(134:0.25) -- ++(224:0.25) -- ++(314:0.25);
\draw[thin] (0,-2.3) arc (90:44:0.7);
\node at (0.45,-1.95) {$46^\circ$};
\draw[thick, fill=yellow!40] (0,0) circle (0.15) node[above=3pt] {$S$};
\draw[thick, fill=blue!10] (0,-3) circle (0.11) node[below=3pt] {$T$};
\draw[thick, fill=orange!25] (1.499,-1.552) circle (0.09) node[right=3pt] {$V$};
\node[left] at (0,-1.4) {$1$ UA};
\node[above right] at (0.7,-0.75) {$r_V$};
\end{tikzpicture}
```

Con lo stesso metodo Mercurio, che non si allontana mai dal Sole più di $23^\circ$ in media, risulta a $\sin 23^\circ \approx 0{,}39\,\text{UA}$. Per i pianeti esterni serve una costruzione un po' più lunga, ma il risultato è lo stesso: una sola scala per tutto il sistema.

### Quanto dura il giro di un pianeta

Dalla Terra non si misura direttamente il tempo che un pianeta impiega a fare un giro attorno al Sole, cioè il suo periodo di rivoluzione $T$, perché anche la Terra gira. Si misura ogni quanto tempo il pianeta torna nella stessa posizione rispetto al Sole e alla Terra, per esempio ogni quanto tempo Marte è in opposizione, cioè dalla parte opposta al Sole nel cielo, allineato con Sole e Terra. Questo tempo si chiama **periodo sinodico** e lo indichiamo con $S$.

Tra un sorpasso e il successivo la Terra, più veloce, compie esattamente un giro in più di Marte. In un tempo $S$ la Terra fa $S/T_T$ giri e Marte $S/T$ giri, quindi

$$\frac{S}{T_T} - \frac{S}{T} = 1 \quad\Rightarrow\quad \frac{1}{T} = \frac{1}{T_T} - \frac{1}{S}$$

dove $T_T = 365{,}25$ giorni è il periodo della Terra. Per un pianeta interno, come Venere, è il pianeta a fare un giro in più della Terra, e i segni si scambiano: $\frac{1}{T} = \frac{1}{T_T} + \frac{1}{S}$.

```ad-example
Esempio 3: il periodo di Marte dalle opposizioni
Marte torna in opposizione ogni $780$ giorni. Quanto dura il suo giro attorno al Sole?

Marte è un pianeta esterno, quindi

$$\frac{1}{T} = \frac{1}{T_T} - \frac{1}{S} = \frac{1}{365{,}25\,\text{d}} - \frac{1}{780\,\text{d}} = 1{,}4558\ldots \cdot 10^{-3}\,\text{d}^{-1}$$

$$T = \frac{1}{1{,}4558 \cdot 10^{-3}\,\text{d}^{-1}} = 686{,}9\ldots\,\text{d} \approx 687\,\text{d}$$

cioè $1{,}88$ anni. Il simbolo $\text{d}$ indica il giorno. Con lo stesso conto Venere, che torna nella stessa posizione rispetto al Sole ogni $584$ giorni, ha un periodo di $1/(1/365{,}25 + 1/584) \approx 225$ giorni.
```

```ad-warning
Periodo sinodico e periodo di rivoluzione non sono la stessa cosa
I $780$ giorni tra due opposizioni di Marte non sono la durata del suo giro attorno al Sole, che è di $687$ giorni. Il periodo sinodico dipende anche dal moto della Terra: un pianeta molto lontano e molto lento, come Saturno, ha un periodo sinodico di poco più di un anno ($378$ giorni), perché la Terra lo ritrova quasi dove l'aveva lasciato.
```

### Che cosa il modello di Copernico non aveva ancora

Il sistema copernicano spiega con una sola idea, il moto della Terra, tutti i moti retrogradi, dà l'ordine e le distanze dei pianeti e lega la distanza al periodo. Ma Copernico tenne i moti circolari e uniformi, e per accordarsi con le posizioni misurate dovette conservare alcuni piccoli epicicli: le sue previsioni non erano più precise di quelle di Tolomeo. Inoltre mancava una prova diretta del moto della Terra, e contro quel moto c'erano obiezioni serie: la più forte la formulò Tycho Brahe.

```ad-warning
Copernico non ha eliminato gli epicicli
Ha eliminato quelli grandi, che servivano a produrre i moti retrogradi. Le orbite del suo modello restano cerchi percorsi a velocità costante, con piccoli epicicli di correzione. I cerchi spariscono solo con le [leggi di Keplero](/materiale/scuola-superiore/fisica/la-gravitazione/le-leggi-di-keplero).
```

## Tycho Brahe: misure precise e un sistema misto

Il danese Tycho Brahe (1546-1601) fu il più grande osservatore prima del cannocchiale. Nel suo osservatorio sull'isola di Hven, con strumenti grandi e curati e ripetendo le misure, portò l'incertezza sulle posizioni dei pianeti a circa un sessantesimo di grado, cioè un primo d'arco, quando prima di lui gli errori erano dieci volte più grandi. Per vent'anni registrò le posizioni di Marte e degli altri pianeti: sono i dati da cui il suo assistente Keplero ricaverà le leggi delle orbite.

Tycho fece anche due osservazioni che contraddicevano il cielo di Aristotele, fatto di sfere perfette e immutabili: nel 1572 una stella nuova, comparsa dove prima non c'era nulla, e nel 1577 una cometa che, misurata da luoghi diversi, risultava più lontana della Luna e attraversava le presunte sfere dei pianeti.

Tycho però non accettò il moto della Terra. Il suo argomento era fisico: se la Terra girasse attorno al Sole, nel corso dell'anno le stelle vicine dovrebbero spostarsi rispetto a quelle lontane, come un dito tenuto davanti al naso si sposta rispetto allo sfondo quando chiudi prima un occhio e poi l'altro. Questo spostamento, la **parallasse**, Tycho lo cercò e non lo trovò. Propose allora un sistema misto, il **sistema ticonico**: la Terra è ferma al centro, il Sole le gira attorno, e tutti gli altri pianeti girano attorno al Sole.

```ad-note
La parallasse c'è, ma è piccolissima
Le stelle sono molto più lontane di quanto Tycho potesse immaginare. La parallasse della stella più vicina è meno di un secondo d'arco, cioè meno di un sessantesimo della precisione di Tycho: fu misurata per la prima volta solo nel 1838, con i telescopi.
```

## Galileo e il cannocchiale

Nel 1609 Galileo Galilei puntò verso il cielo un cannocchiale costruito da lui, e l'anno dopo pubblicò le prime scoperte nel *Sidereus Nuncius*; altre seguirono nei tre anni successivi. Nessuna dimostra da sola che la Terra si muove, ma tutte tolgono argomenti al sistema tolemaico.

- La Luna ha monti e crateri, e il Sole ha macchie che cambiano: i corpi celesti non sono sfere perfette, diverse dalla Terra.
- Attorno a Giove girano quattro satelliti. Esiste quindi un centro di moti che non è la Terra, e un pianeta in movimento può portarsi dietro le sue lune: cade l'obiezione che la Terra, muovendosi, perderebbe la Luna.
- Venere ha le fasi come la Luna, e le ha tutte, dalla falce sottile al disco quasi pieno. Inoltre appare grande quando è una falce e piccola quando è quasi piena.

Le fasi di Venere sono la prova più forte. Nel sistema tolemaico Venere sta sempre tra la Terra e il Sole, e dalla Terra se ne vedrebbe illuminata solo una falce, mai il disco pieno. Nel sistema copernicano Venere gira attorno al Sole: quando è dall'altra parte del Sole mostra alla Terra tutta la faccia illuminata, ed è lontana e piccola; quando è dalla nostra parte mostra quasi solo la faccia in ombra, ed è vicina e grande.

```tikz
% nome: fasi-venere-sistema-copernicano
% alt: Il Sole al centro dell'orbita di Venere, con la Terra in basso, più lontana. Venere è disegnata in quattro posizioni della sua orbita, ogni volta con la metà rivolta verso il Sole vuota e l'altra metà, in ombra, riempita di righe sottili. In alto, dalla parte opposta alla Terra, dalla Terra si vede la faccia illuminata: fase quasi piena, disco piccolo. Ai lati si vede metà faccia. In basso, vicino alla Terra, si vede quasi solo la faccia in ombra: falce sottile, disco grande
\begin{tikzpicture}
\draw[thin, dashed] (0,0) circle (1.5);
\draw[thick, fill=yellow!40] (0,0) circle (0.16) node[right=3pt] {$S$};
\draw[thick, fill=blue!10] (0,-2.9) circle (0.12) node[below=3pt] {$T$};
\foreach \a in {70,180,0,250} {
  \draw[thick] (\a:1.5) circle (0.17);
  \draw[thin] (\a:1.5) ++(\a+90:0.17) -- ++(\a-90:0.34);
  \draw[thin] (\a:1.5) ++(\a:0.05) ++(\a+90:0.162) -- ++(\a-90:0.324);
  \draw[thin] (\a:1.5) ++(\a:0.1) ++(\a+90:0.137) -- ++(\a-90:0.274);
  \draw[thin] (\a:1.5) ++(\a:0.14) ++(\a+90:0.096) -- ++(\a-90:0.192);
}
\node[above] at (70:1.72) {quasi piena, piccola};
\node[left] at (180:1.72) {metà};
\node[right] at (0:1.72) {metà};
\node[left] at (-0.75,-1.75) {falce, grande};
\draw[thin, dotted] (0,-2.9) -- (70:1.5);
\draw[thin, dotted] (0,-2.9) -- (250:1.5);
\end{tikzpicture}
```

Le fasi complete escludono il sistema tolemaico, ma non quello ticonico, in cui Venere gira comunque attorno al Sole. Galileo sostenne il sistema copernicano nel *Dialogo sopra i due massimi sistemi del mondo* (1632), dove risponde anche all'obiezione più comune contro il moto della Terra: se la Terra corresse, un sasso lasciato cadere da una torre dovrebbe restare indietro. Galileo osserva che il sasso, prima di cadere, si muove già insieme alla torre e alla Terra, e conserva quel moto mentre cade: è l'idea che diventerà il [primo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali) e il [principio di relatività galileiana](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/il-principio-di-relativita-galileiana). Per quel libro, nel 1633, Galileo fu processato dal Sant'Uffizio e costretto ad abiurare.

## I tre sistemi a confronto

| | Tolemaico | Ticonico | Copernicano |
|---|---|---|---|
| Al centro, ferma o fermo | la Terra | la Terra | il Sole |
| Il Sole | gira attorno alla Terra | gira attorno alla Terra | è fermo |
| I pianeti girano attorno | alla Terra, su epicicli | al Sole | al Sole |
| Moto retrogrado | prodotto dall'epiciclo | effetto del moto del Sole | effetto del moto della Terra |
| Fasi di Venere | solo falci | tutte | tutte |
| Parallasse delle stelle | assente | assente | prevista (molto piccola) |

Con le osservazioni disponibili all'inizio del Seicento il sistema ticonico e quello copernicano non si potevano distinguere: descrivono gli stessi moti relativi, visti da due corpi diversi. A far preferire il sistema copernicano furono le leggi di Keplero, che descrivono le orbite attorno al Sole con una precisione mai raggiunta, e soprattutto la [legge di gravitazione universale](/materiale/scuola-superiore/fisica/la-gravitazione/la-legge-di-gravitazione-universale) di Newton, che spiega perché i corpi di massa piccola girano attorno a quello di massa più grande. La parallasse delle stelle, misurata nel 1838, ne fu la conferma diretta.
