# Il pendolo e la molla

Una massa appesa a una molla, tirata e lasciata andare, va su e giù sempre con lo stesso ritmo; un pendolo spostato dalla verticale oscilla avanti e indietro, e i suoi colpi sono stati per tre secoli il cuore degli orologi. Tutti e due fanno, almeno per oscillazioni piccole, un [moto armonico](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-armonico): questa lezione trova il loro periodo dalle forze, e dice da che cosa dipende e da che cosa no.

## Il moto armonico e la forza che richiama

Nel moto armonico l'accelerazione è proporzionale allo spostamento $x$ dal centro dell'oscillazione, e ha il verso opposto:

$$a = -\omega^2\,x$$

dove $\omega$ è la pulsazione, legata al periodo da $T = 2\pi/\omega$. Per il [secondo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica), un corpo fa un moto armonico quando la forza totale su di lui è anch'essa proporzionale allo spostamento e opposta, cioè lo richiama sempre verso il centro, tanto più forte quanto più se ne è allontanato. Una forza così si chiama **forza di richiamo**. Se la forza è $F = -K\,x$, con $K$ una costante positiva, allora $m\,a = -K\,x$, cioè $a = -(K/m)\,x$, e il confronto con il moto armonico dà

$$\omega^2 = \frac{K}{m}$$

## La massa attaccata alla molla

Un blocco di massa $m$, su un piano orizzontale liscio, è attaccato a una molla di costante elastica $k$, fissata dall'altra parte a una parete. Si mette l'origine dell'asse $x$ dove il blocco sta in equilibrio, con la molla a riposo. Spostato di $x$, il blocco subisce la [forza elastica](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-elastica-e-la-legge-di-hooke) della molla, che lo riporta verso l'origine:

$$F = -k\,x$$

Il meno dice che la forza è opposta allo spostamento: se il blocco è a destra la molla, allungata, lo tira a sinistra; se è a sinistra la molla, compressa, lo spinge a destra.

```tikz
% nome: blocco-molla-forza-richiamo
% alt: Un blocco su un piano orizzontale liscio, attaccato a una molla fissata a una parete a sinistra. Una linea tratteggiata segna la posizione di equilibrio; il blocco è spostato a destra di x, segnato da una freccia blu, e la forza elastica F, rossa, lo tira verso sinistra, verso la posizione di equilibrio
% svg: blocco-molla-forza-richiamo-c0512f02.svg 222x88
\begin{tikzpicture}
\draw[thick] (0,1.3) -- (0,0) -- (5.6,0);
\foreach \y in {0.15,0.3,...,1.3} \draw[thin] (0,\y) -- ++(-0.15,-0.15);
\foreach \x in {0.15,0.3,...,5.6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0,0.2) -- (3.8,0.2);
\draw[thick, fill=blue!10] (3.8,0) rectangle (4.6,0.8);
\draw[dashed, thin] (3,-0.2) -- (3,1.5);
\node[below] at (3,-0.2) {\small $0$};
\draw[-{Stealth}, thick, blue] (3,1.2) -- (3.8,1.2) node[above] {$x$};
\draw[-{Stealth}, thick, red] (4.2,0.4) -- (3.4,0.4) node[above left] {$\vec{F}$};
\fill (4.2,0.4) circle (1.5pt);
\end{tikzpicture}
```

È una forza di richiamo con $K = k$, quindi $\omega^2 = k/m$, e il periodo $T = 2\pi/\omega$ è

$$T = 2\pi\sqrt{\frac{m}{k}}$$

Il periodo cresce con la massa, perché un corpo più pesante è più difficile da accelerare, e diminuisce con la costante elastica, perché una molla più dura richiama con più forza. Non dipende dall'ampiezza: tirando il blocco di $2\,\text{cm}$ o di $10\,\text{cm}$ il periodo è lo stesso, perché a uno spostamento più grande corrisponde una forza più grande nella stessa proporzione, e il blocco percorre la strada più lunga più in fretta.

Per una molla appesa in verticale, con la massa sotto, il periodo è lo stesso. Il peso sposta solo il centro dell'oscillazione, più in basso, nel punto in cui la forza della molla bilancia il peso; attorno a quel punto la forza totale è ancora $-k\,x$.

```ad-example
Esempio 1: il periodo della molla
Un blocco di $0{,}50\,\text{kg}$ è attaccato a una molla di costante elastica $20\,\text{N/m}$. Quanto vale il periodo delle oscillazioni? E con un blocco di $2{,}0\,\text{kg}$?

$$T = 2\pi\sqrt{\frac{m}{k}} = 2\pi\sqrt{\frac{0{,}50\,\text{kg}}{20\,\text{N/m}}} = 2\pi \cdot 0{,}158\,\text{s} = 0{,}993\ldots\,\text{s} \approx 0{,}99\,\text{s}$$

Le unità tornano: $\text{kg} / (\text{N/m}) = \text{kg} \cdot \text{m} / \text{N} = \text{s}^2$. Con una massa quattro volte più grande il periodo raddoppia, perché la massa sta sotto la radice: $T = 2\pi\sqrt{2{,}0 / 20}\,\text{s} = 1{,}99\,\text{s} \approx 2{,}0\,\text{s}$.
```

```ad-example
Esempio 2: la costante elastica dal periodo
Una massa di $0{,}20\,\text{kg}$ appesa a una molla fa $10$ oscillazioni complete in $6{,}3\,\text{s}$. Quanto vale la costante elastica della molla?

Il periodo è $T = 6{,}3\,\text{s} / 10 = 0{,}63\,\text{s}$. Dalla formula del periodo, elevando al quadrato, $T^2 = 4\pi^2 m / k$, cioè

$$k = \frac{4\pi^2 m}{T^2} = \frac{4\pi^2 \cdot 0{,}20\,\text{kg}}{(0{,}63\,\text{s})^2} = 19{,}89\ldots\,\text{N/m} \approx 20\,\text{N/m}$$

Si misura il tempo di molte oscillazioni, e non di una sola, perché l'incertezza del cronometro si divide per il numero delle oscillazioni.
```

```ad-warning
La massa e la costante scambiate
Nella formula della molla la massa sta sopra: $2\pi\sqrt{m/k}$, non $2\pi\sqrt{k/m}$. Il controllo è l'esperienza: una massa più pesante oscilla più lentamente, quindi il periodo deve crescere con $m$. Nell'esempio 1 lo scambio darebbe $2\pi\sqrt{40} \approx 40\,\text{s}$, un blocco che torna indietro dopo quaranta secondi.
```

## Il pendolo semplice

Un **pendolo semplice** è un corpo piccolo, di massa $m$, appeso a un filo inestensibile di massa trascurabile e di lunghezza $l$, fissato in un punto. In equilibrio il filo è verticale; spostato di un angolo $\theta$ e lasciato andare, il pendolo oscilla su un arco di circonferenza di raggio $l$.

Sul corpo agiscono il peso e la tensione $\vec{T}$ del filo. Il peso si scompone lungo il filo e lungo la tangente all'arco, come sul [piano inclinato](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/il-moto-lungo-un-piano-inclinato), con l'angolo $\theta$ al posto dell'inclinazione:

- la componente lungo il filo, $m\,g\cos\theta$, è diretta in verso opposto alla tensione, e insieme a lei decide la forza centripeta che tiene il corpo sull'arco;
- la componente tangente, $m\,g\sin\theta$, è diretta verso la posizione di equilibrio: è lei la forza di richiamo.

```tikz
% nome: pendolo-forze-componenti
% alt: Un pendolo semplice spostato di un angolo theta dalla verticale tratteggiata, con il filo lungo l. Sulla pallina agiscono il peso P verso il basso e la tensione T lungo il filo verso il punto di sospensione; il peso è scomposto, con due frecce tratteggiate, in una componente lungo il filo, verso l'esterno, e una componente tangente all'arco, verso la posizione di equilibrio. L'arco percorso dal pendolo è punteggiato, e il tratto di arco dalla verticale alla pallina è s
% svg: pendolo-forze-componenti-010090ee.svg 193x204
\begin{tikzpicture}
\draw[thick] (1.2,0) -- (-1.2,0);
\foreach \x in {-1.05,-0.9,...,1.2} \draw[thin] (\x,0) -- ++(-0.15,0.15);
\draw[dashed, thin] (0,0) -- (0,-3.9);
\draw[dotted, thick] (-1.4792,-3.1721) arc[start angle=-115, end angle=-65, radius=3.5];
\draw (0,0) -- (1.4792,-3.1721);
\draw (0,-0.8) arc[start angle=-90, end angle=-65, radius=0.8];
\node at (0.22,-1.1) {\small $\theta$};
\node[left] at (0.6,-1.9) {$l$};
\node[above] at (0.62,-3.3) {$s$};
\draw[dashed, thin] (1.4792,-4.5721) -- (0.9429,-3.4222);
\draw[dashed, thin] (1.4792,-4.5721) -- (2.0154,-4.322);
\draw[-{Stealth}, thick, red, dashed] (1.4792,-3.1721) -- (0.9429,-3.4222) node[below left] {$m g\sin\theta$};
\draw[-{Stealth}, thick, red, dashed] (1.4792,-3.1721) -- (2.0154,-4.322) node[right] {$m g\cos\theta$};
\draw[-{Stealth}, thick, red] (1.4792,-3.1721) -- (1.4792,-4.5721) node[below] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (1.4792,-3.1721) -- (0.943,-2.0222) node[right] {$\vec{T}$};
\draw[thick, fill=blue!10] (1.4792,-3.1721) circle (4pt);
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

La componente di richiamo $m\,g\sin\theta$ non è proporzionale allo spostamento lungo l'arco, $s = l\,\theta$ (con $\theta$ in radianti, come nella lezione sul [moto circolare uniforme](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme)), perché il seno non è proporzionale all'angolo. Lo è quasi per angoli piccoli: $\sin 10^\circ = 0{,}1736$, e $10^\circ$ in radianti sono $0{,}1745$. Con $\sin\theta \approx \theta = s/l$ la forza di richiamo diventa

$$F \approx -m\,g\,\frac{s}{l} = -\frac{m\,g}{l}\,s$$

una forza di richiamo con $K = m\,g/l$. Allora $\omega^2 = K/m = g/l$: la massa si semplifica, e il periodo è

$$T = 2\pi\sqrt{\frac{l}{g}}$$

```ad-example
Esempio 3: il pendolo lungo un metro
Quanto vale il periodo di un pendolo lungo $1{,}0\,\text{m}$? Quanto deve essere lungo un pendolo con il periodo di $2{,}0\,\text{s}$, che batte un colpo ogni secondo a ogni passaggio?

$$T = 2\pi\sqrt{\frac{l}{g}} = 2\pi\sqrt{\frac{1{,}0\,\text{m}}{9{,}8\,\text{m/s}^2}} = 2{,}007\ldots\,\text{s} \approx 2{,}0\,\text{s}$$

Dalla formula, elevando al quadrato, $T^2 = 4\pi^2 l / g$:

$$l = \frac{g\,T^2}{4\pi^2} = \frac{9{,}8\,\text{m/s}^2 \cdot (2{,}0\,\text{s})^2}{4\pi^2} = 0{,}992\ldots\,\text{m} \approx 0{,}99\,\text{m}$$

È il pendolo "che batte il secondo" dei vecchi orologi a pendolo, lungo quasi un metro.
```

## Da che cosa dipende il periodo del pendolo

Il periodo del pendolo dipende solo dalla lunghezza del filo e da $g$:

- non dipende dalla massa: un corpo più pesante subisce una forza di richiamo più grande, ma è anche più difficile da accelerare, nella stessa proporzione, come nella [caduta libera](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale);
- per oscillazioni piccole non dipende dall'ampiezza: è l'**isocronismo** delle piccole oscillazioni, che Galileo osservò e che rese il pendolo adatto a misurare il tempo;
- cresce come la radice quadrata della lunghezza: per raddoppiare il periodo serve un filo quattro volte più lungo.

Per ampiezze grandi l'approssimazione $\sin\theta \approx \theta$ non vale più, e il periodo cresce con l'ampiezza. Di quanto lo dice il calcolo esatto, che al biennio non si fa; il risultato, rispetto a $2\pi\sqrt{l/g}$:

| Ampiezza | $10^\circ$ | $20^\circ$ | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ |
|---|---|---|---|---|---|---|
| Periodo in più | $0{,}2\,\%$ | $0{,}8\,\%$ | $1{,}7\,\%$ | $4{,}0\,\%$ | $7{,}3\,\%$ | $18\,\%$ |

Fino a una ventina di gradi la differenza è sotto l'$1\,\%$, meno di quanto si riesca a misurare con un cronometro a mano.

```ad-warning
La massa nel periodo del pendolo
Il periodo del pendolo non contiene la massa: è $2\pi\sqrt{l/g}$, non $2\pi\sqrt{l/(m\,g)}$. Un pendolo con una pallina di piombo e uno con una pallina di legno, lunghi uguali, oscillano con lo stesso periodo. La massa conta invece nella molla, dove la forza di richiamo, $k\,x$, non dipende dalla massa.
```

```ad-example
Esempio 4: misurare g con un pendolo
Un pendolo lungo $0{,}800\,\text{m}$ fa $20$ oscillazioni complete in $35{,}9\,\text{s}$, con ampiezza piccola. Quanto vale $g$?

Il periodo è $T = 35{,}9\,\text{s} / 20 = 1{,}795\,\text{s}$. Dalla formula, $g = 4\pi^2 l / T^2$:

$$g = \frac{4\pi^2 \cdot 0{,}800\,\text{m}}{(1{,}795\,\text{s})^2} = 9{,}802\ldots\,\text{m/s}^2 \approx 9{,}80\,\text{m/s}^2$$

Il risultato ha tre cifre significative, come la lunghezza e il tempo misurato.
```

## Il pendolo e la molla a confronto

| | Molla | Pendolo |
|---|---|---|
| Forza di richiamo | $-k\,x$ | $-\dfrac{m\,g}{l}\,s$, per angoli piccoli |
| Periodo | $2\pi\sqrt{\dfrac{m}{k}}$ | $2\pi\sqrt{\dfrac{l}{g}}$ |
| Dipende dalla massa | sì | no |
| Dipende da $g$ | no | sì |
| Dipende dall'ampiezza | no | solo per ampiezze grandi |

La differenza su $g$ si vede portando i due oscillatori sulla Luna, dove $g = 1{,}62\,\text{m/s}^2$. La molla oscilla come sulla Terra, perché la forza della molla non c'entra con la gravità. Il pendolo lungo un metro rallenta: $T = 2\pi\sqrt{1{,}0 / 1{,}62}\,\text{s} = 4{,}9\,\text{s}$, due volte e mezzo il periodo terrestre. Un orologio a pendolo, sulla Luna, andrebbe indietro.

Nella figura qui sotto cambi la lunghezza, la massa e l'ampiezza di un pendolo e misuri il periodo, contando il tempo tra due passaggi dalla stessa parte. La massa non cambia niente; la lunghezza sì; l'ampiezza conta poco finché è piccola, e sempre di più quando supera qualche decina di gradi.

```interattivo
% nome: pendolo-periodo-ampiezza
% alt: Un pendolo con tre cursori, per la lunghezza del filo da 0,2 a 2 metri, per la massa da 50 a 500 grammi e per l'ampiezza da 5 a 80 gradi. Un bottone lo fa oscillare, con il moto calcolato passo per passo dalla forza di richiamo, senza l'approssimazione degli angoli piccoli. Sotto la figura sono scritti il periodo misurato sull'oscillazione, il periodo della formula 2 pi radice di l su g e la loro differenza in percentuale
```
