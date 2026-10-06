# La portata e l'equazione di continuità

Chi annaffia il giardino lo sa: se con il pollice chiudi a metà la bocca del tubo, l'acqua esce più veloce e arriva più lontano. Il rubinetto è aperto come prima, e nel tubo entra la stessa acqua di prima; cambia solo lo spazio che ha per uscire. Lo stesso succede a un fiume, lento dove il letto è largo e rapido dove le sponde si stringono. La grandezza che resta uguale in tutti questi casi è la portata, e la regola che lega la velocità alla sezione è l'equazione di continuità. Il capitolo sull'[equilibrio dei fluidi](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi) parlava di liquidi fermi; da qui in poi il fluido si muove.

## Il fluido ideale e la corrente stazionaria

Il moto di un fluido vero è complicato: l'acqua che esce da un rubinetto aperto al massimo fa vortici e schizzi che nessuna formula semplice descrive. Per cominciare si usa un modello, come si è fatto con il punto materiale in meccanica. Un **fluido ideale** è un fluido con due proprietà:

- è **incomprimibile**: il suo volume non cambia quando cambia la pressione, quindi la sua densità $d$ è la stessa in ogni punto;
- è **non viscoso**: gli strati di fluido scorrono l'uno sull'altro, e sulle pareti del tubo, senza attrito.

L'acqua e gli altri liquidi sono incomprimibili con ottima approssimazione. Anche l'aria si può trattare così finché si muove a velocità molto più piccole di quella del suono e non viene chiusa e compressa, come in una pompa da bicicletta. L'attrito interno invece c'è sempre, poco nell'acqua e molto nel miele: a metterlo nel conto pensa la lezione [L'attrito viscoso e la velocità limite](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/l-attrito-viscoso-e-la-velocita-limite).

Serve poi un'ipotesi sul moto. Una corrente è **stazionaria** quando in ogni punto la velocità del fluido resta la stessa al passare del tempo. Non vuol dire che il fluido abbia dappertutto la stessa velocità: in un punto può andare forte e in un altro piano, ma tutte le particelle che passano per lo stesso punto ci passano con la stessa velocità. L'acqua che scorre in un tubo con il rubinetto aperto sempre allo stesso modo è una corrente stazionaria; quella di un rubinetto che si sta aprendo no.

In una corrente stazionaria ogni particella di fluido segue la strada di quella che l'ha preceduta. Queste strade si chiamano **linee di flusso**: in ogni punto la velocità del fluido è tangente alla linea che passa di lì, e due linee di flusso non si incrociano mai, perché nel punto d'incrocio il fluido avrebbe due velocità diverse. Un fascio di linee di flusso forma un **tubo di flusso**: il fluido che è dentro non ne esce, come se il tubo avesse pareti vere.

```tikz
% nome: linee-di-flusso-tubo-che-si-stringe
% alt: Un tubo orizzontale pieno d'acqua, largo a sinistra e stretto a destra, con cinque linee di flusso che lo percorrono da sinistra a destra: sono distanti tra loro nel tratto largo e si avvicinano nel tratto stretto
\begin{tikzpicture}
\fill[cyan!20] (0,-0.9) -- (2,-0.9) -- (3.2,-0.4) -- (5.6,-0.4) -- (5.6,0.4) -- (3.2,0.4) -- (2,0.9) -- (0,0.9) -- cycle;
\draw[thick] (0,0.9) -- (2,0.9) -- (3.2,0.4) -- (5.6,0.4);
\draw[thick] (0,-0.9) -- (2,-0.9) -- (3.2,-0.4) -- (5.6,-0.4);
\foreach \a/\b in {0.6/0.267, 0.3/0.133, 0/0, -0.3/-0.133, -0.6/-0.267}
  \draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.2 with {\arrow{Stealth}}, mark=at position 0.85 with {\arrow{Stealth}}}] (0,\a) -- (2,\a) -- (3.2,\b) -- (5.6,\b);
\node[above] at (1,0.95) {\small lento};
\node[above] at (4.4,0.45) {\small veloce};
\end{tikzpicture}
```

Le linee di flusso dicono anche dove il fluido è veloce: dove si avvicinano il fluido corre, dove si allargano rallenta. Il perché è l'equazione di continuità, che arriva tra poco.

## La portata

Per riempire un secchio da $12$ litri un rubinetto ci mette $40$ secondi, un altro due minuti. Dal primo esce più acqua nello stesso tempo: ha una portata maggiore.

La **portata** $q$ di una corrente attraverso una sezione del condotto è il rapporto tra il volume $\Delta V$ di fluido che attraversa la sezione e l'intervallo di tempo $\Delta t$ in cui lo fa:

$$q = \frac{\Delta V}{\Delta t}$$

Nel Sistema Internazionale la portata si misura in metri cubi al secondo:

$$[q] = \frac{\text{m}^3}{\text{s}}$$

Un metro cubo al secondo è la portata di un piccolo fiume. Per rubinetti, tubi e pompe si usano più spesso i litri al secondo e i litri al minuto. Poiché $1\,\text{L} = 1\,\text{dm}^3 = 10^{-3}\,\text{m}^3$:

$$1\,\frac{\text{L}}{\text{s}} = 10^{-3}\,\frac{\text{m}^3}{\text{s}} \qquad\qquad 1\,\frac{\text{L}}{\text{min}} = \frac{10^{-3}\,\text{m}^3}{60\,\text{s}} \approx 1{,}67 \cdot 10^{-5}\,\frac{\text{m}^3}{\text{s}}$$

In una corrente stazionaria la portata attraverso una sezione non cambia nel tempo, e conoscendola si calcola quanto fluido passa in un tempo qualsiasi, $\Delta V = q \cdot \Delta t$, o quanto tempo serve per un certo volume, $\Delta t = \Delta V / q$.

```ad-example
Esempio 1: la portata di un rubinetto
Un rubinetto riempie un secchio da $12\,\text{L}$ in $40\,\text{s}$. Qual è la sua portata, in litri al secondo e in metri cubi al secondo? Quanto tempo impiega a riempire una vasca da $150\,\text{L}$?

$$q = \frac{\Delta V}{\Delta t} = \frac{12\,\text{L}}{40\,\text{s}} = 0{,}30\,\frac{\text{L}}{\text{s}}$$

$$0{,}30\,\frac{\text{L}}{\text{s}} = 0{,}30 \cdot 10^{-3}\,\frac{\text{m}^3}{\text{s}} = 3{,}0 \cdot 10^{-4}\,\frac{\text{m}^3}{\text{s}}$$

Per la vasca:

$$\Delta t = \frac{\Delta V}{q} = \frac{150\,\text{L}}{0{,}30\,\text{L/s}} = 500\,\text{s}$$

cioè poco più di $8$ minuti. Nel secondo conto volume e portata sono tutti e due in litri, e non serve convertire.
```

```ad-warning
Litri al minuto e litri al secondo
Una portata di $18\,\text{L/min}$ non è $18 \cdot 10^{-3}\,\text{m}^3/\text{s}$: prima di tutto il minuto va portato in secondi. $18\,\text{L/min} = 18\,\text{L} / 60\,\text{s} = 0{,}30\,\text{L/s} = 3{,}0 \cdot 10^{-4}\,\text{m}^3/\text{s}$. Chi dimentica di dividere per $60$ ottiene una portata sessanta volte più grande.
```

## La portata dipende dalla sezione e dalla velocità

Da un tubo esce più acqua al secondo se il tubo è più grosso, oppure se l'acqua corre di più. Per trovare la formula si guarda una sezione del tubo, di area $S$, attraversata dal fluido con velocità $v$.

```tikz
% nome: portata-cilindro-di-fluido
% alt: Un tratto di tubo orizzontale pieno d'acqua. Una sezione verticale di area S è evidenziata; a destra di essa un cilindro di fluido più scuro, lungo v per delta t, è il volume che ha attraversato la sezione nell'intervallo delta t. Una freccia blu orizzontale indica la velocità v del fluido
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (6,1.6);
\fill[cyan!45] (1.6,0) rectangle (4.4,1.6);
\draw[thick] (0,0) -- (6,0);
\draw[thick] (0,1.6) -- (6,1.6);
\draw[thick, dashed] (1.6,0) -- (1.6,1.6);
\draw[dashed] (4.4,0) -- (4.4,1.6);
\node[left] at (1.6,0.8) {$S$};
\draw[-{Stealth}, thick, blue!60!black] (2.4,0.8) -- (3.8,0.8) node[above, pos=0.5] {$\vec{v}$};
\draw[{Stealth}-{Stealth}, thin] (1.6,-0.3) -- (4.4,-0.3);
\node[below] at (3,-0.3) {$v \cdot \Delta t$};
\end{tikzpicture}
```

Nell'intervallo $\Delta t$ ogni particella di fluido avanza di $v \cdot \Delta t$. Il fluido che in quel tempo ha attraversato la sezione riempie quindi un cilindro che ha per base la sezione e per altezza $v \cdot \Delta t$, e il suo volume è $\Delta V = S \cdot v \cdot \Delta t$. Dividendo per $\Delta t$:

$$q = \frac{\Delta V}{\Delta t} = \frac{S \cdot v \cdot \Delta t}{\Delta t}$$

$$q = S \cdot v$$

La portata è il prodotto dell'area della sezione per la velocità del fluido. Le unità tornano: $\text{m}^2 \cdot \text{m/s} = \text{m}^3/\text{s}$. In un tubo vero la velocità non è la stessa in tutti i punti della sezione (vicino alle pareti il fluido è più lento); per il fluido ideale lo è, e per quelli veri $v$ è la velocità media sulla sezione.

Per un tubo a sezione circolare di raggio $r$ e diametro $D = 2r$ l'area è quella del [cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/lunghezza-della-circonferenza-e-area-del-cerchio):

$$S = \pi\,r^2 = \frac{\pi\,D^2}{4}$$

```ad-example
Esempio 2: dal diametro alla portata
In un tubo dell'acqua di diametro interno $2{,}0\,\text{cm}$ l'acqua scorre a $1{,}5\,\text{m/s}$. Qual è la portata? Quanti litri passano in un minuto?

Il raggio è la metà del diametro, e va portato in metri: $r = 1{,}0\,\text{cm} = 1{,}0 \cdot 10^{-2}\,\text{m}$.

$$S = \pi\,r^2 = \pi \cdot (1{,}0 \cdot 10^{-2}\,\text{m})^2 = 3{,}14 \cdot 10^{-4}\,\text{m}^2$$

$$q = S \cdot v = 3{,}14 \cdot 10^{-4}\,\text{m}^2 \cdot 1{,}5\,\text{m/s} = 4{,}7 \cdot 10^{-4}\,\frac{\text{m}^3}{\text{s}}$$

In litri al secondo sono $0{,}47\,\text{L/s}$, e in un minuto passano $0{,}47\,\text{L/s} \cdot 60\,\text{s} \approx 28\,\text{L}$.
```

```ad-warning
Raggio, diametro e centimetri quadrati
Dei tubi si dà quasi sempre il diametro, mentre nella formula $S = \pi r^2$ entra il raggio: con il diametro al posto del raggio l'area viene quattro volte più grande. E l'area va in metri quadrati: $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$, non $10^{-2}\,\text{m}^2$, perché a essere elevato al quadrato è anche il fattore $10^{-2}$.
```

## L'equazione di continuità

Un tubo ha un tratto largo, di sezione $S_1$, seguito da un tratto stretto, di sezione $S_2$. Il fluido è incomprimibile e il tubo non ha buchi: tutto il fluido che in un secondo entra nel tratto largo deve, nello stesso secondo, attraversare il tratto stretto. Se ne passasse di meno, il fluido si accumulerebbe da qualche parte tra le due sezioni, e un fluido incomprimibile non si può accumulare. La portata è quindi la stessa in tutte le sezioni del tubo:

$$q_1 = q_2$$

Con $q = S \cdot v$ diventa l'**equazione di continuità**:

$$S_1 \cdot v_1 = S_2 \cdot v_2$$

dove $v_1$ e $v_2$ sono le velocità del fluido nelle due sezioni.

```tikz
% nome: tubo-due-sezioni-continuita
% alt: Un tubo orizzontale pieno d'acqua con un tratto largo di sezione S1 a sinistra e un tratto stretto di sezione S2 a destra, di diametro pari alla metà. Nel tratto largo la velocità v1 è una freccia blu corta, nel tratto stretto la velocità v2 è una freccia blu lunga quattro volte tanto
\begin{tikzpicture}
\fill[cyan!20] (0,-0.9) -- (2.2,-0.9) -- (3.2,-0.45) -- (6.4,-0.45) -- (6.4,0.45) -- (3.2,0.45) -- (2.2,0.9) -- (0,0.9) -- cycle;
\draw[thick] (0,0.9) -- (2.2,0.9) -- (3.2,0.45) -- (6.4,0.45);
\draw[thick] (0,-0.9) -- (2.2,-0.9) -- (3.2,-0.45) -- (6.4,-0.45);
\draw[dashed] (0.8,-0.9) -- (0.8,0.9);
\draw[dashed] (3.8,-0.45) -- (3.8,0.45);
\node[below] at (0.8,-0.9) {$S_1$};
\node[below] at (3.8,-0.45) {$S_2$};
\draw[-{Stealth}, thick, blue!60!black] (0.8,0) -- (1.3,0) node[above] {$\vec{v}_1$};
\draw[-{Stealth}, thick, blue!60!black] (3.8,0) -- (5.8,0) node[above, pos=0.6] {$\vec{v}_2$};
\end{tikzpicture}
```

Il prodotto $S \cdot v$ resta costante lungo il tubo, quindi sezione e velocità sono [inversamente proporzionali](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica): dove il tubo si stringe il fluido accelera, dove si allarga rallenta. Nella figura il tratto stretto ha il diametro pari alla metà, cioè un quarto della sezione, e la velocità è quattro volte più grande.

La velocità nella seconda sezione si ricava così:

$$v_2 = v_1 \cdot \frac{S_1}{S_2}$$

e per un tubo a sezione circolare, dove $S = \pi D^2 / 4$, il fattore $\pi/4$ si semplifica:

$$v_2 = v_1 \cdot \left(\frac{D_1}{D_2}\right)^2$$

Ecco perché le linee di flusso della prima figura si avvicinano nel tratto stretto: tra due linee vicine passa sempre la stessa portata, e dove hanno meno spazio il fluido deve andare più forte.

```tikz
% nome: grafico-velocita-sezione-iperbole
% alt: Grafico della velocità del fluido in funzione della sezione del tubo a portata fissata: un ramo di iperbole che scende. Sono segnati i punti con sezione 1 centimetro quadrato e velocità 2 metri al secondo, sezione 2 e velocità 1, sezione 4 e velocità 0,5
% poi-interattivo: cambiare la portata e vedere l'iperbole spostarsi
\begin{tikzpicture}[x=1.1cm, y=1.1cm]
\draw[gray!25, very thin] (0,0) grid (5,4);
\draw[->] (-0.2,0) -- (5.4,0) node[right] {$S$ (cm$^2$)};
\draw[->] (0,-0.2) -- (0,4.5) node[above] {$v$ (m/s)};
\foreach \x in {1,2,3,4,5} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {1,2,3,4} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue, domain=0.48:5, samples=60] plot (\x,{2/\x});
\draw[dashed, thin] (1,0) -- (1,2) -- (0,2);
\draw[dashed, thin] (4,0) -- (4,0.5) -- (0,0.5);
\fill (1,2) circle (1.5pt);
\fill (2,1) circle (1.5pt);
\fill (4,0.5) circle (1.5pt);
\node[right] at (2.6,2.6) {$S \cdot v = \mbox{costante}$};
\end{tikzpicture}
```

Il grafico della velocità in funzione della sezione, a portata fissata, è un ramo di iperbole: quello disegnato vale per la portata dell'esempio 3.

```ad-example
Esempio 3: un tubo che si stringe
In un tubo di sezione $4{,}0\,\text{cm}^2$ l'acqua scorre a $0{,}50\,\text{m/s}$. Il tubo poi si stringe fino a una sezione di $1{,}0\,\text{cm}^2$. Con che velocità scorre l'acqua nel tratto stretto?

$$v_2 = v_1 \cdot \frac{S_1}{S_2} = 0{,}50\,\frac{\text{m}}{\text{s}} \cdot \frac{4{,}0\,\text{cm}^2}{1{,}0\,\text{cm}^2} = 2{,}0\,\frac{\text{m}}{\text{s}}$$

Le due sezioni stanno in un rapporto, quindi possono restare in centimetri quadrati. La portata è la stessa nei due tratti: $4{,}0 \cdot 10^{-4}\,\text{m}^2 \cdot 0{,}50\,\text{m/s} = 1{,}0 \cdot 10^{-4}\,\text{m}^2 \cdot 2{,}0\,\text{m/s} = 2{,}0 \cdot 10^{-4}\,\text{m}^3/\text{s}$.
```

Nella figura qui sotto puoi stringere e allargare il secondo tratto del tubo e cambiare la velocità con cui l'acqua entra. La domanda a cui rispondere: se il diametro del tratto stretto si dimezza, di quanto cresce la velocità?

```interattivo
% nome: tubo-continuita-diametro
% alt: Un tubo orizzontale con un tratto largo di diametro 4 centimetri e un secondo tratto il cui diametro si regola con un cursore da 1 a 4 centimetri; un altro cursore regola la velocità dell'acqua nel tratto largo. Delle goccioline segnate nell'acqua avanzano lente nel tratto largo e veloci in quello stretto, e due frecce in scala mostrano le due velocità. Sotto la figura si leggono le due sezioni, le due velocità e la portata, che resta la stessa nei due tratti
```

La velocità non raddoppia: diventa quattro volte più grande. Dimezzando il diametro la sezione si riduce a un quarto, perché l'area dipende dal quadrato del diametro, e la velocità cresce di conseguenza. Con il tratto largo di $4\,\text{cm}$ e l'acqua che entra a $0{,}50\,\text{m/s}$, in un tratto di $2\,\text{cm}$ va a $2{,}0\,\text{m/s}$ e in uno di $1\,\text{cm}$ a $8{,}0\,\text{m/s}$, mentre la portata resta sempre $0{,}63\,\text{L/s}$.

```ad-warning
La velocità va con il quadrato del diametro
L'errore più comune con i tubi circolari è usare il rapporto dei diametri al posto di quello delle sezioni. Se il diametro passa da $3{,}0\,\text{cm}$ a $1{,}0\,\text{cm}$, la velocità non diventa $3$ volte più grande ma $3^2 = 9$ volte. Vale lo stesso con i raggi: $v_2 = v_1 \cdot (r_1 / r_2)^2$.
```

```ad-example
Esempio 4: il tubo da giardino con la lancia
In un tubo da giardino di diametro interno $1{,}6\,\text{cm}$ l'acqua scorre a $1{,}2\,\text{m/s}$. All'estremità è montata una lancia con un foro di diametro $0{,}40\,\text{cm}$. Con che velocità esce l'acqua? Quanto tempo serve per riempire un mastello da $60\,\text{L}$?

Per la velocità di uscita serve solo il rapporto dei diametri:

$$v_2 = v_1 \cdot \left(\frac{D_1}{D_2}\right)^2 = 1{,}2\,\frac{\text{m}}{\text{s}} \cdot \left(\frac{1{,}6\,\text{cm}}{0{,}40\,\text{cm}}\right)^2 = 1{,}2\,\frac{\text{m}}{\text{s}} \cdot 16 \approx 19\,\frac{\text{m}}{\text{s}}$$

Per il tempo serve la portata, che si può calcolare in una sezione qualsiasi; conviene quella del tubo, di raggio $r_1 = 0{,}80\,\text{cm} = 8{,}0 \cdot 10^{-3}\,\text{m}$:

$$q = S_1 \cdot v_1 = \pi \cdot (8{,}0 \cdot 10^{-3}\,\text{m})^2 \cdot 1{,}2\,\frac{\text{m}}{\text{s}} = 2{,}4 \cdot 10^{-4}\,\frac{\text{m}^3}{\text{s}} = 0{,}24\,\frac{\text{L}}{\text{s}}$$

$$\Delta t = \frac{\Delta V}{q} = \frac{60\,\text{L}}{0{,}24\,\text{L/s}} \approx 2{,}5 \cdot 10^{2}\,\text{s}$$

poco più di quattro minuti. La lancia rende il getto sedici volte più veloce, ma non fa uscire più acqua: a parità di velocità nel tubo, la portata è la stessa con la lancia e senza.
```

```ad-note
Per i gas l'equazione cambia
$S_1 \cdot v_1 = S_2 \cdot v_2$ vale per un fluido incomprimibile. Un gas che viene compresso lungo il condotto cambia densità, e a conservarsi è la massa che passa ogni secondo, $d \cdot S \cdot v$, non il volume. Per i liquidi, e per l'aria a bassa velocità, le due cose coincidono.
```

## Quando il condotto si divide

Spesso un tubo si divide in più rami, come il tubo che porta l'acqua in casa e poi si separa verso la cucina e il bagno, o un'arteria che si ramifica. Il ragionamento è lo stesso: il fluido non si accumula e non sparisce, quindi tutto quello che arriva al bivio in un secondo se ne va nello stesso secondo, un po' da una parte e un po' dall'altra. La portata che entra è la somma di quelle che escono:

$$q = q_1 + q_2 \qquad \text{cioè} \qquad S \cdot v = S_1 \cdot v_1 + S_2 \cdot v_2$$

```tikz
% nome: tubo-che-si-divide-portate
% alt: Un tubo orizzontale pieno d'acqua che a destra si divide in due rami più stretti, uno verso l'alto e uno verso il basso. Nel tubo principale una freccia blu indica la portata q; nei due rami due frecce blu indicano le portate q1 e q2
\begin{tikzpicture}
\fill[cyan!20] (0,-0.5) -- (2.4,-0.5) -- (4.2,-1.3) -- (5.6,-1.3) -- (5.6,-0.7) -- (4.35,-0.7) -- (3.3,-0.23) -- (3.3,0.23) -- (4.35,0.7) -- (5.6,0.7) -- (5.6,1.3) -- (4.2,1.3) -- (2.4,0.5) -- (0,0.5) -- cycle;
\draw[thick] (0,0.5) -- (2.4,0.5) -- (4.2,1.3) -- (5.6,1.3);
\draw[thick] (0,-0.5) -- (2.4,-0.5) -- (4.2,-1.3) -- (5.6,-1.3);
\draw[thick] (5.6,0.7) -- (4.35,0.7) -- (3.3,0.23) -- (3.3,-0.23) -- (4.35,-0.7) -- (5.6,-0.7);
\draw[-{Stealth}, thick, blue!60!black] (0.5,0) -- (1.9,0) node[above, pos=0.5] {$q$};
\draw[-{Stealth}, thick, blue!60!black] (4.85,1) -- (5.5,1) node[left, pos=0] {$q_1$};
\draw[-{Stealth}, thick, blue!60!black] (4.85,-1) -- (5.5,-1) node[left, pos=0] {$q_2$};
\end{tikzpicture}
```

Se i rami sono tanti e tutti uguali, quello che conta è la loro sezione totale. Quando la sezione totale dei rami è più grande di quella del condotto di partenza, il fluido nei rami rallenta, anche se ogni ramo è molto più stretto del condotto.

```ad-example
Esempio 5: il sangue dall'aorta ai capillari
Nell'aorta di un adulto a riposo, che ha una sezione di circa $3{,}0\,\text{cm}^2$, il sangue scorre in media a $0{,}30\,\text{m/s}$. L'aorta si ramifica in arterie sempre più piccole, fino a miliardi di capillari, che messi insieme hanno una sezione totale di circa $2{,}0 \cdot 10^{3}\,\text{cm}^2$. Con che velocità scorre il sangue nei capillari?

Tutto il sangue che passa nell'aorta passa poi nei capillari, e la portata è la stessa:

$$v_2 = v_1 \cdot \frac{S_1}{S_2} = 0{,}30\,\frac{\text{m}}{\text{s}} \cdot \frac{3{,}0\,\text{cm}^2}{2{,}0 \cdot 10^{3}\,\text{cm}^2} = 4{,}5 \cdot 10^{-4}\,\frac{\text{m}}{\text{s}}$$

meno di mezzo millimetro al secondo. Ogni capillare è più sottile di un capello, ma tutti insieme offrono al sangue una sezione quasi settecento volte più grande di quella dell'aorta. Questa lentezza serve: dà al sangue il tempo di cedere ossigeno ai tessuti.
```

```ad-warning
Un ramo più stretto non vuol dire fluido più veloce
"Dove il tubo si stringe il fluido accelera" vale per un tubo solo. Quando il condotto si divide bisogna confrontare la sezione di partenza con la somma delle sezioni dei rami: nei capillari, strettissimi, il sangue è molto più lento che nell'aorta.
```

L'equazione di continuità dice come cambia la velocità lungo un condotto, ma non perché: per accelerare il fluido che entra nel tratto stretto serve una forza, e questa forza viene da una differenza di pressione. Il legame tra velocità e pressione è l'argomento della lezione [L'equazione di Bernoulli](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/l-equazione-di-bernoulli).
