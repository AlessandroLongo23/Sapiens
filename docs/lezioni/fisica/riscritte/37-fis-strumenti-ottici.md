# L'occhio e gli strumenti ottici

L'occhio è uno strumento ottico: un sistema di lenti che forma sulla retina l'immagine di quello che guardiamo. Gli occhiali correggono i suoi difetti, e la lente d'ingrandimento, la macchina fotografica, il microscopio e il cannocchiale lo aiutano a vedere cose troppo piccole o troppo lontane. Tutti si studiano con quello che la lezione [Le lenti sottili](/materiale/scuola-superiore/fisica/l-ottica-geometrica/le-lenti-sottili) dice sulle lenti: l'equazione $\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$, l'ingrandimento $G = -\frac{q}{p}$ e il potere diottrico $P = \frac{1}{f}$, con le stesse convenzioni dei segni.

## L'occhio

La luce entra nell'occhio attraverso la cornea, la superficie trasparente sul davanti, passa per la pupilla, il foro al centro dell'iride che si allarga al buio e si stringe con tanta luce, e attraversa il **cristallino**, una lente convergente elastica. Arriva così sulla **retina**, lo strato sul fondo dell'occhio con le cellule sensibili alla luce, che mandano il segnale al cervello lungo il nervo ottico.

Cornea e cristallino insieme si comportano come un'unica lente convergente, che forma sulla retina un'immagine reale, capovolta e rimpicciolita; è il cervello a vederla diritta. In un modello semplificato di occhio, che qui useremo per i conti, la lente sta a $1{,}7\,\text{cm}$ dalla retina, e l'immagine deve formarsi proprio lì: $q = 1{,}7\,\text{cm}$ qualunque cosa si guardi.

```tikz
% nome: occhio-schema-raggi
% alt: Lo schema di un occhio visto di lato: tre raggi paralleli arrivano da sinistra su una lente convergente che rappresenta cornea e cristallino, e convergono in un punto della retina, sul fondo dell'occhio
% svg: occhio-schema-raggi-c20da644.svg 188x114
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thick] (0,0) circle (1.1);
\draw[very thick] (0.72,-0.83) arc[start angle=-49, end angle=49, radius=1.1];
\draw[thin, dash dot] (-2.4,0) -- (1.4,0);
\draw[raggio] (-2.4,0.35) -- (-0.75,0.35);
\draw[raggio] (-0.75,0.35) -- (1.1,0);
\draw[raggio] (-2.4,0) -- (-0.75,0);
\draw[raggio] (-0.75,0) -- (1.1,0);
\draw[raggio] (-2.4,-0.35) -- (-0.75,-0.35);
\draw[raggio] (-0.75,-0.35) -- (1.1,0);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (-0.75,-0.55) -- (-0.75,0.55);
\draw[thin] (-0.7,0.5) -- (-0.4,1.35) node[above] {\small cristallino};
\draw[thin] (0.95,0.55) -- (1.4,1.1) node[above right] {\small retina};
\end{tikzpicture}
```

Un occhio sano vede nitide sia le stelle sia le parole di un libro: la distanza dell'oggetto $p$ cambia, $q$ resta la stessa, quindi per l'equazione delle lenti deve cambiare la distanza focale. Lo fa il cristallino, che grazie ai muscoli che lo circondano si fa più curvo, e quindi più convergente, quando si guarda da vicino. Questa capacità si chiama **accomodamento**. Il punto più lontano che l'occhio vede nitido senza accomodare è il **punto remoto**, che per un occhio sano è all'infinito; il punto più vicino che vede nitido accomodando al massimo è il **punto prossimo**, che per convenzione si prende a $25\,\text{cm}$ (la distanza della visione distinta).

```ad-example
Esempio 1: il potere dell'occhio
Nel modello semplificato, quanto vale il potere dell'occhio quando guarda un oggetto lontanissimo? E quando guarda un oggetto a $25\,\text{cm}$?

Per un oggetto lontanissimo $\frac{1}{p}$ è praticamente zero, e l'equazione delle lenti dà $f = q = 1{,}7\,\text{cm} = 0{,}017\,\text{m}$:

$$P = \frac{1}{0{,}017\,\text{m}} = 58{,}8\ldots\,\text{D} \approx 59\,\text{D}$$

Per l'oggetto a $0{,}25\,\text{m}$, con le distanze in metri:

$$P = \frac{1}{f} = \frac{1}{p} + \frac{1}{q} = \frac{1}{0{,}25} + \frac{1}{0{,}017} = 4{,}0 + 58{,}8 = 62{,}8\ldots\,\text{D} \approx 63\,\text{D}$$

Accomodando, l'occhio aumenta il suo potere di circa $4\,\text{D}$. Un occhio vero ha un potere di circa $60\,\text{D}$, come trovato qui.
```

## I difetti della vista e le lenti che li correggono

Nell'occhio **miope** l'immagine di un oggetto lontano si forma davanti alla retina, perché l'occhio è troppo lungo o troppo convergente: gli oggetti lontani si vedono sfocati, quelli vicini bene. Il punto remoto non è all'infinito, ma a una distanza finita. Si corregge con una lente divergente, che allarga un po' i raggi prima che entrino nell'occhio: di un oggetto lontanissimo la lente forma un'immagine virtuale proprio nel punto remoto, che l'occhio vede nitida. Da $\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$ con $\frac{1}{p} = 0$ e $q = -d_R$, dove $d_R$ è la distanza del punto remoto, la lente deve avere $f = -d_R$, cioè

$$P = -\frac{1}{d_R}$$

trascurando la distanza tra l'occhiale e l'occhio.

```tikz
% nome: miopia-correzione
% alt: Sopra, un occhio miope: i raggi paralleli convergono prima della retina e sulla retina arrivano allargati. Sotto, lo stesso occhio con una lente divergente davanti: la lente allarga un po' i raggi, e l'occhio li fa convergere proprio sulla retina
% svg: miopia-correzione-8eefde21.svg 232x190
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thick] (0,0) circle (1.1);
\draw[very thick] (0.72,-0.83) arc[start angle=-49, end angle=49, radius=1.1];
\draw[thin, dash dot] (-2.4,0) -- (1.4,0);
\draw[raggio] (-2.4,0.36) -- (-0.75,0.36);
\draw[raggio] (-0.75,0.36) -- (1.0,-0.107);
\draw[raggio] (-2.4,-0.36) -- (-0.75,-0.36);
\draw[raggio] (-0.75,-0.36) -- (1.0,0.107);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (-0.75,-0.55) -- (-0.75,0.55);
\node[left] at (-1.2,0.85) {\small senza occhiali};
\begin{scope}[yshift=-2.7cm]
\draw[thick] (0,0) circle (1.1);
\draw[very thick] (0.72,-0.83) arc[start angle=-49, end angle=49, radius=1.1];
\draw[thin, dash dot] (-2.4,0) -- (1.4,0);
\draw[raggio] (-2.4,0.3) -- (-1.6,0.3);
\draw[thick, orange!90!black] (-1.6,0.3) -- (-0.75,0.361);
\draw[raggio] (-0.75,0.361) -- (1.1,0);
\draw[raggio] (-2.4,-0.3) -- (-1.6,-0.3);
\draw[thick, orange!90!black] (-1.6,-0.3) -- (-0.75,-0.361);
\draw[raggio] (-0.75,-0.361) -- (1.1,0);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (-0.75,-0.55) -- (-0.75,0.55);
\draw[{Stealth[reversed]}-{Stealth[reversed]}, thick, blue!60!black] (-1.6,-0.6) -- (-1.6,0.6);
\node[left] at (-1.2,0.85) {\small con la lente divergente};
\end{scope}
\end{tikzpicture}
```

```ad-example
Esempio 2: gli occhiali del miope
Una ragazza miope vede nitido senza occhiali solo fino a $2{,}0\,\text{m}$. Di che lenti ha bisogno?

Il punto remoto è a $d_R = 2{,}0\,\text{m}$, quindi serve una lente divergente con $f = -2{,}0\,\text{m}$:

$$P = -\frac{1}{2{,}0\,\text{m}} = -0{,}50\,\text{D}$$

Sulla ricetta dell'oculista si legge $-0{,}50$: il segno meno dice che le lenti sono divergenti. Una miopia più forte, con il punto remoto a $50\,\text{cm}$, chiede $-2{,}0\,\text{D}$.
```

Nell'occhio **ipermetrope** succede il contrario: l'immagine si formerebbe dietro la retina, perché l'occhio è troppo corto o poco convergente. Da lontano l'occhio riesce a compensare accomodando, ma da vicino non ce la fa: il punto prossimo è più lontano di $25\,\text{cm}$, e leggere è faticoso. Si corregge con una lente convergente, scelta in modo che di un oggetto a $25\,\text{cm}$ formi un'immagine virtuale nel punto prossimo dell'occhio, a distanza $d_P$: da $p = 0{,}25\,\text{m}$ e $q = -d_P$,

$$P = \frac{1}{0{,}25\,\text{m}} - \frac{1}{d_P}$$

```tikz
% nome: ipermetropia-correzione
% alt: Sopra, un occhio ipermetrope: i raggi paralleli arrivano sulla retina prima di convergere, e si incontrerebbero dietro l'occhio, dove li prolunga il tratteggio. Sotto, lo stesso occhio con una lente convergente davanti: la lente fa convergere un po' i raggi, e l'occhio li porta a fuoco sulla retina
% svg: ipermetropia-correzione-bf6967ff.svg 259x190
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thick] (0,0) circle (1.1);
\draw[very thick] (0.72,-0.83) arc[start angle=-49, end angle=49, radius=1.1];
\draw[thin, dash dot] (-2.4,0) -- (1.9,0);
\draw[raggio] (-2.4,0.36) -- (-0.75,0.36);
\draw[raggio] (-0.75,0.36) -- (1.0,0.092);
\draw[thin, dashed, orange!90!black] (1.0,0.092) -- (1.6,0);
\draw[raggio] (-2.4,-0.36) -- (-0.75,-0.36);
\draw[raggio] (-0.75,-0.36) -- (1.0,-0.092);
\draw[thin, dashed, orange!90!black] (1.0,-0.092) -- (1.6,0);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (-0.75,-0.55) -- (-0.75,0.55);
\node[left] at (-1.2,0.85) {\small senza occhiali};
\begin{scope}[yshift=-2.7cm]
\draw[thick] (0,0) circle (1.1);
\draw[very thick] (0.72,-0.83) arc[start angle=-49, end angle=49, radius=1.1];
\draw[thin, dash dot] (-2.4,0) -- (1.9,0);
\draw[raggio] (-2.4,0.3) -- (-1.6,0.3);
\draw[thick, orange!90!black] (-1.6,0.3) -- (-0.75,0.273);
\draw[raggio] (-0.75,0.273) -- (1.1,0);
\draw[raggio] (-2.4,-0.3) -- (-1.6,-0.3);
\draw[thick, orange!90!black] (-1.6,-0.3) -- (-0.75,-0.273);
\draw[raggio] (-0.75,-0.273) -- (1.1,0);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (-0.75,-0.55) -- (-0.75,0.55);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (-1.6,-0.6) -- (-1.6,0.6);
\node[left] at (-1.2,0.85) {\small con la lente convergente};
\end{scope}
\end{tikzpicture}
```

```ad-example
Esempio 3: gli occhiali dell'ipermetrope
Un ragazzo ipermetrope ha il punto prossimo a $50\,\text{cm}$. Che lenti deve usare per leggere un libro a $25\,\text{cm}$?

$$P = \frac{1}{0{,}25\,\text{m}} - \frac{1}{0{,}50\,\text{m}} = 4{,}0\,\text{D} - 2{,}0\,\text{D} = 2{,}0\,\text{D}$$

Lenti convergenti da $+2{,}0\,\text{D}$, cioè con $f = 50\,\text{cm}$.
```

```ad-warning
Miope con le lenti convergenti
Il miope vede male da lontano e porta lenti divergenti, con il potere negativo; l'ipermetrope vede male da vicino e porta lenti convergenti, con il potere positivo. Un modo per non confonderli: l'occhio miope fa convergere troppo, e la lente deve togliere convergenza.
```

Con l'età il cristallino diventa meno elastico e accomoda sempre meno: il punto prossimo si allontana anche in un occhio sano. È la **presbiopia**, che dopo i quarant'anni si corregge con lenti convergenti per leggere, come l'ipermetropia.

## La lente d'ingrandimento

Per vedere più grande un oggetto piccolo lo si avvicina all'occhio, ma non oltre il punto prossimo, altrimenti non si mette a fuoco. Una **lente d'ingrandimento** è una lente convergente con la distanza focale corta: messo l'oggetto tra il fuoco e la lente, come nell'ultima figura della lezione sulle lenti, se ne vede un'immagine virtuale, diritta e più grande. Di solito la si tiene vicino all'occhio e si sposta l'oggetto finché l'immagine si forma a $25\,\text{cm}$, dove l'occhio la vede nitida con meno fatica.

```ad-example
Esempio 4: una lente da 5 cm
Una lente d'ingrandimento ha $f = 5{,}0\,\text{cm}$. Dove va messo l'oggetto perché l'immagine si formi a $25\,\text{cm}$ dalla lente, e quanto vale l'ingrandimento?

L'immagine è virtuale, quindi $q = -25\,\text{cm}$:

$$\frac{1}{p} = \frac{1}{f} - \frac{1}{q} = \frac{1}{5{,}0} + \frac{1}{25} = \frac{5 + 1}{25} = \frac{6}{25} \qquad p = 4{,}16\ldots\,\text{cm} \approx 4{,}2\,\text{cm}$$

$$G = -\frac{q}{p} = \frac{25}{4{,}17} = 6{,}0$$

L'oggetto va un po' più vicino del fuoco, e si vede sei volte più grande. Con una lente più convergente, cioè con $f$ più corta, l'ingrandimento cresce.
```

## La macchina fotografica

Una macchina fotografica funziona come l'occhio: l'**obiettivo**, una lente convergente (in realtà un gruppo di lenti), forma sul sensore un'immagine reale, capovolta e rimpicciolita. Il diaframma, un foro di diametro regolabile, fa la parte della pupilla. La differenza è nella messa a fuoco: la distanza focale dell'obiettivo non cambia, e per mettere a fuoco oggetti a distanze diverse si sposta l'obiettivo, avvicinandolo o allontanandolo dal sensore.

```ad-example
Esempio 5: mettere a fuoco una persona
Un obiettivo ha $f = 50\,\text{mm}$. A che distanza dal sensore deve stare per fotografare una persona a $2{,}0\,\text{m}$?

Con le distanze in millimetri, $p = 2000\,\text{mm}$:

$$\frac{1}{q} = \frac{1}{50} - \frac{1}{2000} = \frac{40 - 1}{2000} = \frac{39}{2000} \qquad q = 51{,}28\ldots\,\text{mm} \approx 51\,\text{mm}$$

Per un oggetto lontanissimo l'immagine sarebbe nel fuoco, a $50\,\text{mm}$: per mettere a fuoco la persona l'obiettivo si allontana dal sensore di poco più di un millimetro. L'ingrandimento $G = -\frac{51{,}3}{2000} \approx -0{,}026$ dice che l'immagine è capovolta e circa quaranta volte più piccola della persona.
```

## Il microscopio e il cannocchiale

Il microscopio ottico ha due lenti convergenti. L'obiettivo, vicino all'oggetto, ha una distanza focale di pochi millimetri: l'oggetto si mette appena oltre il suo fuoco, e l'obiettivo ne forma un'immagine reale, capovolta e molto ingrandita dentro il tubo. L'**oculare**, vicino all'occhio, funziona come una lente d'ingrandimento e ingrandisce ancora quell'immagine. L'ingrandimento del microscopio è il prodotto dei due: con un obiettivo che ingrandisce $40$ volte e un oculare che ingrandisce $10$ volte si vede un'immagine $400$ volte più grande dell'oggetto, capovolta.

Il **cannocchiale** astronomico, o telescopio a lenti, serve per oggetti lontanissimi. Anche lui ha due lenti convergenti, ma l'obiettivo ha una distanza focale lunga: dei raggi che arrivano paralleli da una stella forma un'immagine nel suo fuoco, e l'oculare, che ha lo stesso fuoco, la guarda come una lente d'ingrandimento. Le due lenti stanno quindi a una distanza $f_{ob} + f_{oc}$, e i raggi escono dall'oculare di nuovo paralleli, ma più inclinati di come erano entrati: la stella si vede sotto un angolo più grande. Il rapporto tra i due angoli è l'ingrandimento del cannocchiale, e vale

$$G = \frac{f_{ob}}{f_{oc}}$$

```tikz
% nome: cannocchiale-kepleriano
% alt: Un cannocchiale con due lenti convergenti sullo stesso asse: tre raggi paralleli, leggermente inclinati, arrivano da una stella sull'obiettivo e si incontrano nel suo fuoco, che è anche il fuoco dell'oculare; dopo l'oculare escono di nuovo paralleli, ma più inclinati; le distanze focali dell'obiettivo e dell'oculare sono segnate sotto l'asse
% svg: cannocchiale-kepleriano-283fa0ab.svg 257x119
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thin, dash dot] (-1.3,0) -- (5.4,0);
\draw[raggio] (-1.2,0.669) -- (0,0.5);
\draw[raggio] (0,0.5) -- (3,-0.422);
\draw[thick, orange!90!black] (3,-0.422) -- (4,-0.729);
\draw[raggio] (-1.2,0.169) -- (0,0);
\draw[raggio] (0,0) -- (3,-0.422);
\draw[thick, orange!90!black] (3,-0.422) -- (4,-0.562);
\draw[raggio] (-1.2,-0.331) -- (0,-0.5);
\draw[raggio] (0,-0.5) -- (3,-0.422);
\draw[thick, orange!90!black] (3,-0.422) -- (4,-0.396);
\draw[raggio] (4,-0.729) -- (5.2,-0.223);
\draw[raggio] (4,-0.562) -- (5.2,-0.056);
\draw[raggio] (4,-0.396) -- (5.2,0.110);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (0,-0.9) -- (0,0.9);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (4,-0.9) -- (4,0.9);
\fill (3,0) circle (1.5pt);
\draw[{Stealth}-{Stealth}, thin] (0,-1.15) -- (3,-1.15) node[midway, below] {$f_{ob}$};
\draw[{Stealth}-{Stealth}, thin] (3,-1.15) -- (4,-1.15) node[midway, below] {$f_{oc}$};
\node[above] at (0,0.9) {\small obiettivo};
\node[above] at (4,0.9) {\small oculare};
\end{tikzpicture}
```

```ad-example
Esempio 6: un cannocchiale da 60 ingrandimenti
Un cannocchiale ha l'obiettivo con $f_{ob} = 90\,\text{cm}$ e l'oculare con $f_{oc} = 1{,}5\,\text{cm}$. Quanto ingrandisce, e quanto è lungo?

$$G = \frac{90\,\text{cm}}{1{,}5\,\text{cm}} = 60 \qquad L = f_{ob} + f_{oc} = 90 + 1{,}5 = 91{,}5\,\text{cm}$$

Cambiando l'oculare con uno di focale più corta l'ingrandimento cresce.
```

```ad-warning
Il rapporto rovesciato
Nel cannocchiale l'ingrandimento è la focale dell'obiettivo divisa per quella dell'oculare: $90/1{,}5 = 60$, non $1{,}5/90$. Un ingrandimento minore di $1$ vorrebbe dire che il cannocchiale rimpicciolisce.
```

Il cannocchiale con due lenti convergenti fu proposto da Keplero nel 1611, nel libro *Dioptrice*, e dà un'immagine capovolta, che per le stelle non è un problema. Galileo nel 1609 aveva costruito e puntato verso il cielo un cannocchiale con l'oculare divergente, che dà un'immagine diritta. Nei binocoli l'immagine si raddrizza con due prismi a riflessione totale, come quelli della lezione [La rifrazione e la riflessione totale](/materiale/scuola-superiore/fisica/l-ottica-geometrica/la-rifrazione-e-la-riflessione-totale).
