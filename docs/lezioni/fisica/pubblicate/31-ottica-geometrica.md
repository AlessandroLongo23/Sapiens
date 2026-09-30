# I raggi di luce e la propagazione rettilinea

Un raggio di sole che entra da una fessura nella stanza buia disegna nella polvere una linea dritta, e l'ombra di un palo ha il contorno netto del palo. Sono due segni dello stesso fatto: la luce va in linea retta. L'ottica geometrica parte da qui, e descrive la luce con linee rette, i raggi, per spiegare ombre, eclissi, specchi e lenti.

## Sorgenti di luce e corpi illuminati

Una **sorgente di luce** è un corpo che emette luce propria: il Sole e le altre stelle, la fiamma di una candela, una lampadina accesa, lo schermo di un telefono. Tutti gli altri corpi si vedono solo perché sono illuminati: ricevono la luce da una sorgente e ne rimandano una parte verso i nostri occhi. La Luna è un corpo illuminato, non una sorgente: la sua luce è luce del Sole rimandata verso la Terra. Lo stesso vale per questa pagina stampata, per un muro, per il tuo viso allo specchio.

Una sorgente si dice **puntiforme** quando è così piccola, rispetto alle distanze in gioco, da poterla pensare come un punto: una lampadina piccola vista da qualche metro, una stella vista dalla Terra. Una sorgente che non si può pensare come un punto è estesa: un tubo al neon a un metro di distanza, il Sole visto dalla Luna.

## Corpi trasparenti, traslucidi e opachi

Quando la luce incontra un corpo, può attraversarlo o no:

- un corpo **trasparente** si lascia attraversare dalla luce, e attraverso di esso si vedono bene gli oggetti: l'aria, l'acqua limpida, il vetro di una finestra;
- un corpo **traslucido** si lascia attraversare dalla luce, ma la sparpaglia in tutte le direzioni, e attraverso di esso gli oggetti non si distinguono: il vetro smerigliato della porta del bagno, la carta da forno, la nebbia;
- un corpo **opaco** non si lascia attraversare dalla luce: il legno, i metalli, il tuo corpo. La luce che lo colpisce in parte viene assorbita e in parte viene rimandata indietro.

Gli stessi materiali cambiano con lo spessore: un foglio d'oro sottilissimo lascia passare un po' di luce, e l'acqua del mare, trasparente vicino alla riva, a mille metri di profondità non lascia passare più luce.

## Il raggio di luce

La luce che esce da una sorgente si allontana da essa in tutte le direzioni. Per descriverla si usa un modello: il **raggio di luce**, una semiretta che parte dalla sorgente e indica la direzione in cui la luce si propaga, con una freccia che ne dà il verso. Un raggio da solo non si può isolare, nemmeno con un foro piccolissimo: è un disegno che rappresenta un fascio di luce molto sottile. Un insieme di raggi si chiama **fascio di luce**, e può essere:

- parallelo, se i raggi sono paralleli tra loro, come quelli che arrivano dal Sole o da una sorgente molto lontana;
- divergente, se i raggi si allontanano l'uno dall'altro, come quelli che escono da una sorgente puntiforme;
- convergente, se i raggi si avvicinano fino a incontrarsi in un punto, come quelli che escono da una lente d'ingrandimento puntata verso il Sole.

```tikz
% nome: fasci-di-luce
% alt: Tre fasci di luce disegnati con raggi arancioni con la freccia: a sinistra tre raggi paralleli, al centro cinque raggi che escono da un punto e si allargano, fascio divergente, a destra cinque raggi che si stringono fino a incontrarsi in un punto, fascio convergente
% svg: fasci-di-luce-ac9c8b6b.svg 309x88
\begin{tikzpicture}
\tikzset{raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position #1 with {\arrow{Stealth}}}}, raggio/.default=0.5}
\foreach \y in {0.2,0.8,1.4} \draw[raggio] (0,\y) -- (2,\y);
\fill (3,0.8) circle (1.5pt);
\foreach \y in {0,0.4,0.8,1.2,1.6} \draw[raggio=0.8] (3,0.8) -- (5,\y);
\foreach \y in {0,0.4,0.8,1.2,1.6} \draw[raggio=0.3] (6,\y) -- (8,0.8);
\fill (8,0.8) circle (1.5pt);
\node[below] at (1,-0.1) {\small parallelo};
\node[below] at (4,-0.1) {\small divergente};
\node[below] at (7,-0.1) {\small convergente};
\end{tikzpicture}
```

## La luce si propaga in linea retta

In un mezzo omogeneo, cioè uguale in ogni suo punto come l'aria di una stanza o l'acqua di una vasca, la luce si propaga in linea retta: è il **principio di propagazione rettilinea della luce**. Si verifica con tre cartoncini, ognuno con un piccolo foro, messi in fila davanti a una candela: la fiamma si vede attraverso i tre fori solo se i fori sono allineati, e basta spostare di poco un cartoncino per non vederla più.

Il principio vale finché la luce resta nello stesso mezzo. Quando passa dall'aria all'acqua o al vetro cambia direzione, come spiega la lezione [La rifrazione e la riflessione totale](/materiale/scuola-superiore/fisica/l-ottica-geometrica/la-rifrazione-e-la-riflessione-totale); quando incontra una superficie lucida torna indietro, come nella lezione [La riflessione e gli specchi piani](/materiale/scuola-superiore/fisica/l-ottica-geometrica/la-riflessione-e-gli-specchi-piani).

## Ombra e penombra

Dietro un corpo opaco illuminato c'è una zona in cui la luce della sorgente non arriva: è l'ombra. La sua forma e la sua grandezza si spiegano con i raggi, che passano accanto ai bordi del corpo senza piegarsi.

### Con una sorgente puntiforme

Da una sorgente puntiforme $S$ partono raggi in tutte le direzioni. Quelli che sfiorano i bordi dell'ostacolo delimitano, dietro di esso, una zona in cui non arriva nessun raggio: l'**ombra**. Su uno schermo messo dietro l'ostacolo l'ombra ha la forma dell'ostacolo e un contorno netto.

```tikz
% nome: ombra-sorgente-puntiforme
% alt: Una sorgente puntiforme S a sinistra, un cartoncino alto h alla distanza d e uno schermo alla distanza D; i due raggi che sfiorano i bordi del cartoncino arrivano allo schermo e delimitano la zona d'ombra, grigia, che sullo schermo è alta H
% svg: ombra-sorgente-puntiforme-a9339413.svg 288x161
\begin{tikzpicture}
\tikzset{raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\fill[gray!40] (2,0.35) -- (6,1.05) -- (6,-1.05) -- (2,-0.35) -- cycle;
\draw[raggio] (0,0) -- (6,1.05);
\draw[raggio] (0,0) -- (6,-1.05);
\fill[gray!20] (6,-1.4) rectangle (6.12,1.4);
\draw[thick] (6,-1.4) -- (6,1.4);
\draw[line width=2pt] (2,-0.35) -- (2,0.35);
\fill[orange!90!black] (0,0) circle (2pt);
\node[left] at (-0.05,0) {$S$};
\node[left] at (1.95,0) {\small $h$};
\draw[|-|, thin] (6.45,-1.05) -- (6.45,1.05) node[midway, right] {\small $H$};
\draw[|-|, thin] (0,-1.7) -- (2,-1.7) node[midway, below] {\small $d$};
\draw[|-|, thin] (0,-2.3) -- (6,-2.3) node[midway, below] {\small $D$};
\end{tikzpicture}
```

Nella figura il raggio che sfiora il bordo alto del cartoncino, il raggio che sfiora il bordo basso e la retta che va da $S$ allo schermo formano due triangoli simili: il più piccolo ha per base il cartoncino, il più grande l'ombra. I lati corrispondenti sono in proporzione, come spiega la lezione di matematica [Similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine), e quindi

$$\frac{H}{h} = \frac{D}{d}$$

dove $h$ è l'altezza dell'ostacolo, $H$ quella della sua ombra sullo schermo, $d$ la distanza della sorgente dall'ostacolo e $D$ la distanza della sorgente dallo schermo. L'ostacolo e lo schermo devono essere paralleli tra loro.

```ad-example
Esempio 1: l'ombra di un cartoncino
Una lampadina piccola, da considerare puntiforme, illumina un cartoncino quadrato di lato $5{,}0\,\text{cm}$ che si trova a $40\,\text{cm}$ da essa. Dietro il cartoncino, parallelo a esso, c'è un muro a $1{,}2\,\text{m}$ dalla lampadina. Quanto è largo il quadrato d'ombra sul muro?

Le distanze vanno nella stessa unità: $D = 1{,}2\,\text{m} = 120\,\text{cm}$. Dalla proporzione

$$H = h \cdot \frac{D}{d} = 5{,}0 \cdot \frac{120}{40} = 15\,\text{cm}$$

Il muro è tre volte più lontano del cartoncino, e l'ombra è tre volte più grande.
```

```ad-warning
L'ombra non è grande quanto l'oggetto
Con una sorgente puntiforme l'ombra su uno schermo è sempre più grande dell'ostacolo, e diventa ancora più grande se l'ostacolo si avvicina alla sorgente. È grande quanto l'ostacolo solo con i raggi paralleli, per esempio quelli del Sole, che è lontanissimo.
```

```ad-example
Esempio 2: dove mettere il cartoncino
Con la stessa lampadina e lo stesso muro dell'esempio 1, a quale distanza dalla lampadina va messo il cartoncino perché la sua ombra sia larga $20\,\text{cm}$?

Nella proporzione l'incognita è $d$:

$$d = h \cdot \frac{D}{H} = 5{,}0 \cdot \frac{120}{20} = 30\,\text{cm}$$

L'ombra è più grande di quella dell'esempio 1, e infatti il cartoncino va messo più vicino alla lampadina.
```

### Con una sorgente estesa

Con una sorgente estesa ogni punto della sorgente manda i suoi raggi, e ogni punto crea la sua ombra. Dietro l'ostacolo si formano così due zone:

- l'ombra, dove non arriva la luce di nessun punto della sorgente: è buia;
- la **penombra**, intorno all'ombra, dove arriva la luce solo da una parte della sorgente: è meno illuminata del resto dello schermo, e sempre più chiara man mano che ci si allontana dall'ombra.

```tikz
% nome: ombra-e-penombra
% alt: Una sorgente estesa, una lampada lunga disegnata in giallo, illumina un cartoncino; i raggi arancioni partono dal bordo alto della lampada, quelli blu dal bordo basso, e sfiorano i bordi del cartoncino. Sullo schermo si formano l'ombra al centro, grigio scuro, e due fasce di penombra sopra e sotto, grigio chiaro
% svg: ombra-e-penombra-61b89eb6.svg 338x155
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\fill[gray!30] (2,0.45) -- (5.5,1.7625) -- (5.5,0.7125) -- cycle;
\fill[gray!30] (2,-0.45) -- (5.5,-1.7625) -- (5.5,-0.7125) -- cycle;
\fill[gray!55] (2,0.45) -- (5.5,0.7125) -- (5.5,-0.7125) -- (2,-0.45) -- cycle;
\draw[raggio, orange!90!black] (0,0.3) -- (5.5,0.7125);
\draw[raggio, orange!90!black] (0,0.3) -- (5.5,-1.7625);
\draw[raggio, blue!70!black] (0,-0.3) -- (5.5,1.7625);
\draw[raggio, blue!70!black] (0,-0.3) -- (5.5,-0.7125);
\draw[thick, fill=yellow!40] (-0.08,-0.3) rectangle (0.08,0.3);
\draw[line width=2pt] (2,-0.45) -- (2,0.45);
\fill[gray!20] (5.5,-2) rectangle (5.62,2);
\draw[thick] (5.5,-2) -- (5.5,2);
\node[right] at (5.65,0) {\small ombra};
\node[right] at (5.65,1.24) {\small penombra};
\node[right] at (5.65,-1.24) {\small penombra};
\node[left] at (-0.12,0) {\small sorgente};
\end{tikzpicture}
```

La penombra è tanto più larga quanto più grande è la sorgente, e l'ombra tanto più stretta. Per questo sotto una lampada da tavolo piccola le ombre hanno il contorno netto, mentre sotto una plafoniera larga sono sfumate. Nella figura qui sotto puoi cambiare la grandezza della sorgente e trascinare l'ostacolo: con la sorgente puntiforme la penombra sparisce.

```interattivo
% nome: ombra-penombra-sorgente
% alt: Una sorgente di luce a sinistra, un ostacolo al centro che si trascina avanti e indietro e uno schermo a destra; i raggi che partono dai bordi della sorgente e sfiorano i bordi dell'ostacolo delimitano l'ombra, grigio scuro, e la penombra, grigio chiaro. Un cursore cambia la grandezza della sorgente, da puntiforme a estesa; sotto sono scritte le larghezze dell'ombra e della penombra sullo schermo
```

### Le eclissi

Le eclissi sono ombre e penombre su scala astronomica, con il Sole come sorgente estesa.

C'è un'eclissi di Sole quando la Luna passa tra il Sole e la Terra, e la sua ombra cade sulla Terra. Chi si trova nella piccola zona d'ombra vede il Sole coperto del tutto (eclissi totale); chi si trova nella penombra, molto più larga, vede il Sole coperto solo in parte (eclissi parziale).

```tikz
% nome: eclissi-di-sole
% alt: Schema non in scala di un'eclissi di Sole: a sinistra il Sole, al centro la Luna, a destra la Terra; dalla Luna parte verso la Terra un cono d'ombra grigio scuro, che tocca la Terra in una zona piccola dove l'eclissi è totale, e intorno una penombra grigio chiaro più larga, dove l'eclissi è parziale
% svg: eclissi-di-sole-60510469.svg 334x167
\begin{tikzpicture}
\fill[gray!30] (3.444,0.369) -- (7.7,2.165) -- (7.7,-2.165) -- (3.444,-0.369) -- cycle;
\fill[gray!60] (3.667,0.394) -- (5.503,0.084) -- (5.501,0.042) -- (5.500,0.000) -- (5.501,-0.042) -- (5.503,-0.084) -- (3.667,-0.394) -- cycle;
\draw[thin, orange!90!black] (0.389,-0.921) -- (7.7,2.165);
\draw[thin, orange!90!black] (0.389,0.921) -- (7.7,-2.165);
\draw[thin, orange!90!black] (0.167,0.986) -- (5.503,0.084);
\draw[thin, orange!90!black] (0.167,-0.986) -- (5.503,-0.084);
\draw[thick, fill=yellow!40] (0,0) circle (1);
\draw[thick, fill=gray!30] (3.6,0) circle (0.4);
\draw[thick, fill=blue!15] (6.6,0) circle (1.1);
\node at (0,0) {\small Sole};
\node[below] at (3.6,-0.45) {\small Luna};
\node at (6.75,0) {\small Terra};
\draw[thin] (5.5,0) -- (4.9,-1.35) node[below] {\small totale};
\draw[thin] (5.75,0.7) -- (5.3,1.55) node[above] {\small parziale};
\end{tikzpicture}
```

C'è un'eclissi di Luna quando è la Terra a passare tra il Sole e la Luna: la Luna entra nell'ombra della Terra e si oscura. Un'eclissi di Luna si vede da tutta la metà della Terra in cui in quel momento è notte, un'eclissi totale di Sole solo da una striscia stretta della superficie terrestre.

```ad-note
Perché le eclissi non ci sono ogni mese
Ogni mese la Luna passa una volta dalla parte del Sole e una volta dalla parte opposta. Le eclissi però sono rare, perché l'orbita della Luna è inclinata di circa $5^\circ$ rispetto a quella della Terra intorno al Sole: quasi sempre la Luna passa un po' sopra o un po' sotto la linea Sole-Terra, e l'ombra manca il bersaglio.
```

## La camera oscura

La **camera oscura** è una scatola chiusa con un piccolo foro su una parete e uno schermo traslucido, per esempio di carta da forno, sulla parete opposta. Da ogni punto di un oggetto illuminato davanti al foro partono raggi in tutte le direzioni, ma solo quelli che passano per il foro entrano nella scatola, e procedendo in linea retta arrivano sullo schermo in un punto preciso. Sullo schermo si forma così un'immagine dell'oggetto, capovolta: i raggi che vengono dalla cima dell'oggetto, passando per il foro, finiscono in basso, e quelli che vengono dalla base finiscono in alto.

```tikz
% nome: camera-oscura
% alt: Un oggetto alto h, disegnato come una freccia nera verso l'alto, davanti a una scatola con un foro sulla parete sinistra; il raggio che parte dalla cima dell'oggetto passa per il foro e arriva in basso sulla parete di fondo, quello che parte dalla base arriva in alto, e sulla parete di fondo si forma l'immagine capovolta, alta h', disegnata in blu. L'oggetto è alla distanza d dal foro, la parete di fondo alla distanza d'
% svg: camera-oscura-f94c4e79.svg 232x113
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}}
\fill[gray!15] (3,-1) rectangle (5,1);
\draw[raggio, orange!90!black] (0,0.9) -- (5,-0.6);
\draw[raggio, blue!70!black] (0,-0.6) -- (5,0.4);
\draw[thick] (3,0.06) -- (3,1) -- (5,1) -- (5,-1) -- (3,-1) -- (3,-0.06);
\draw[-{Stealth}, very thick] (0,-0.6) -- (0,0.9);
\draw[-{Stealth}, very thick, blue!70!black] (4.94,0.4) -- (4.94,-0.6);
\node[left] at (-0.05,0.15) {\small $h$};
\node[right] at (5.05,-0.1) {\small $h'$};
\draw[|-|, thin] (0,-1.4) -- (3,-1.4) node[midway, below] {\small $d$};
\draw[|-|, thin] (3,-1.4) -- (5,-1.4) node[midway, below] {\small $d'$};
\end{tikzpicture}
```

Come per l'ombra, i raggi formano due triangoli simili, con il vertice comune nel foro: quello con base l'oggetto e quello con base l'immagine. Se $h$ è l'altezza dell'oggetto, $h'$ quella dell'immagine, $d$ la distanza dell'oggetto dal foro e $d'$ la distanza del foro dallo schermo,

$$\frac{h'}{h} = \frac{d'}{d}$$

```ad-example
Esempio 3: un albero nella camera oscura
Un albero alto $6{,}0\,\text{m}$ si trova a $15\,\text{m}$ da una camera oscura profonda $20\,\text{cm}$. Quanto è alta la sua immagine?

Con le lunghezze in metri, $d' = 0{,}20\,\text{m}$:

$$h' = h \cdot \frac{d'}{d} = 6{,}0 \cdot \frac{0{,}20}{15} = 0{,}080\,\text{m} = 8{,}0\,\text{cm}$$

L'immagine è alta $8{,}0\,\text{cm}$ ed è capovolta.
```

```ad-note
La grandezza del foro
Con un foro piccolo l'immagine è nitida ma poco luminosa. Allargando il foro entra più luce, ma da ogni punto dell'oggetto passa un fascio largo, che sullo schermo fa una macchiolina invece di un punto: le macchioline si sovrappongono e l'immagine diventa sfocata. Le macchine fotografiche risolvono il problema con un foro largo e una lente, come spiega la lezione [L'occhio e gli strumenti ottici](/materiale/scuola-superiore/fisica/l-ottica-geometrica/l-occhio-e-gli-strumenti-ottici).
```

## La velocità della luce

La luce non arriva in un istante: viaggia a una velocità finita, altissima. Nel vuoto la sua velocità si indica con $c$ e vale

$$c = 3{,}00 \cdot 10^8\,\text{m/s}$$

cioè trecentomila chilometri al secondo. È la stessa in tutte le direzioni e per luce di qualunque colore. Il valore preciso è $299\,792\,458\,\text{m/s}$, ma negli esercizi basta quello con tre cifre significative. Nell'aria la luce va quasi alla stessa velocità del vuoto; nell'acqua e nel vetro va più piano, e da questo nasce la rifrazione.

Per il tempo che la luce impiega a percorrere una distanza $d$ vale la relazione del moto a velocità costante:

$$t = \frac{d}{c}$$

Le distanze grandi si scrivono in [notazione scientifica](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale), e il risultato si arrotonda come insegna la lezione [Le cifre significative](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/le-cifre-significative).

```ad-example
Esempio 4: dalla Luna alla Terra
La Luna dista dalla Terra $3{,}84 \cdot 10^8\,\text{m}$. Quanto tempo impiega la luce riflessa dalla Luna ad arrivare fino a noi?

$$t = \frac{d}{c} = \frac{3{,}84 \cdot 10^8\,\text{m}}{3{,}00 \cdot 10^8\,\text{m/s}} = 1{,}28\,\text{s}$$

Vediamo la Luna com'era poco più di un secondo prima.
```

```ad-example
Esempio 5: dal Sole alla Terra
Il Sole dista dalla Terra $1{,}50 \cdot 10^{11}\,\text{m}$. Quanto tempo impiega la sua luce ad arrivare?

$$t = \frac{1{,}50 \cdot 10^{11}\,\text{m}}{3{,}00 \cdot 10^8\,\text{m/s}} = 0{,}500 \cdot 10^3\,\text{s} = 5{,}00 \cdot 10^2\,\text{s}$$

Sono $500$ secondi, cioè $8$ minuti e $20$ secondi: se il Sole si spegnesse, ce ne accorgeremmo solo dopo più di otto minuti.
```

```ad-warning
Le potenze di 10 nella divisione
Nella divisione gli esponenti si sottraggono: $10^{11} : 10^8 = 10^{3}$, non $10^{19}$. E prima di dividere le distanze vanno in metri: con la distanza in chilometri e $c$ in metri al secondo il risultato viene mille volte più piccolo.
```

### L'anno luce

Per le distanze tra le stelle il metro è un'unità troppo piccola, e gli astronomi usano l'**anno luce**: la distanza che la luce percorre nel vuoto in un anno. Un anno dura $365{,}25 \cdot 24 \cdot 3600\,\text{s} = 3{,}156 \cdot 10^7\,\text{s}$, e quindi

$$1\,\text{anno luce} = c \cdot t = 3{,}00 \cdot 10^8\,\text{m/s} \cdot 3{,}156 \cdot 10^7\,\text{s} = 9{,}47 \cdot 10^{15}\,\text{m}$$

Nelle tabelle si trova $9{,}46 \cdot 10^{15}\,\text{m}$, calcolato con il valore preciso di $c$, un po' più piccolo di $3{,}00 \cdot 10^8\,\text{m/s}$.

```ad-example
Esempio 6: la stella più vicina
Proxima Centauri, la stella più vicina al Sole, dista $4{,}2$ anni luce. Quanti metri sono?

$$d = 4{,}2 \cdot 9{,}47 \cdot 10^{15}\,\text{m} = 39{,}77\ldots \cdot 10^{15}\,\text{m} \approx 4{,}0 \cdot 10^{16}\,\text{m}$$

Il dato ha due cifre significative, e così il risultato. La luce che vediamo stasera da Proxima Centauri è partita più di quattro anni fa.
```

```ad-warning
L'anno luce non è un tempo
Nonostante il nome, l'anno luce è una lunghezza, come il metro e il chilometro. "La stella dista 4,2 anni luce" dice quanto è lontana, non da quanto tempo esiste o quanto ci vuole per andarci.
```

```ad-note
Come si è misurata
Galileo provò a misurare la velocità della luce con due lanterne su due colline, ma era troppo alta per i suoi strumenti. La prima stima la fece l'astronomo danese Ole Rømer nel 1676, dai ritardi con cui si vedevano le eclissi di Io, una luna di Giove; la prima misura sulla Terra la fece Hippolyte Fizeau nel 1849, con una ruota dentata che girava velocissima. Dal 1983 il valore di $c$ è fissato per definizione, e il metro è definito a partire da esso.
```
