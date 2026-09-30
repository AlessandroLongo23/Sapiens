# La legge di Pascal e il torchio idraulico

Nell'officina di un gommista un'auto di più di una tonnellata sale sul sollevatore mentre l'operaio preme un pedale; in un'auto in corsa basta spingere il freno con un piede per fermare quattro ruote. In tutti e due i casi la forza passa attraverso un liquido chiuso in un circuito di tubi, e arriva dall'altra parte molto più grande. Il motivo è una proprietà dei fluidi scoperta da Blaise Pascal nel Seicento: la pressione che si esercita su un punto di un liquido arriva, uguale, dappertutto.

## La legge di Pascal

Una siringa piena d'acqua, con la punta chiusa da una sfera cava bucata in molti punti, è il modo più semplice per vederlo. Quando si spinge lo stantuffo, l'acqua esce da tutti i fori, anche da quelli rivolti all'indietro, e gli zampilli sono tutti uguali: la spinta dello stantuffo, che è diretta in avanti, arriva con la stessa intensità in ogni punto della sfera.

```tikz
% nome: siringa-di-pascal
% alt: Una siringa orizzontale con lo stantuffo a destra, spinto verso sinistra da una forza F; al posto della punta c'è una sfera cava piena d'acqua con sei fori, e da ogni foro esce uno zampillo perpendicolare alla sfera, tutti della stessa lunghezza, anche quelli rivolti verso lo stantuffo
% svg: siringa-di-pascal-d3fc09f1.svg 267x121
\begin{tikzpicture}
\fill[cyan!20] (0,0) circle (0.9);
\fill[cyan!20] (0.75,-0.3) rectangle (3,0.3);
\draw[thick] (0.75,0.5) arc (34:326:0.9);
\draw[thick] (0.75,0.5) -- (3.6,0.5);
\draw[thick] (0.75,-0.5) -- (3.6,-0.5);
\draw[thick, fill=gray!20] (3,-0.47) rectangle (3.2,0.47);
\draw[thick, fill=gray!20] (3.2,-0.08) rectangle (4.4,0.08);
\draw[thick, fill=gray!20] (4.4,-0.4) rectangle (4.52,0.4);
\draw[-{Stealth}, thick, red] (5.4,0) -- (4.55,0) node[pos=0.4, above] {$\vec{F}$};
\foreach \a in {60,105,150,195,240,285} {
  \draw[thick, cyan!60!blue] (\a:0.95) -- (\a:1.6);
}
\end{tikzpicture}
```

L'esperienza vale per tutti i liquidi e, con i gas, finché si trascurano le loro variazioni di volume. Si riassume nella **legge di Pascal**:

> la pressione esercitata su una superficie di un fluido in equilibrio si trasmette con lo stesso valore a ogni punto del fluido e a ogni superficie a contatto con esso, qualunque sia la sua orientazione.

Il fluido trasmette la pressione, non la forza. Su una parete di area $S$ il fluido esercita la forza $F = p \cdot S$, perpendicolare alla parete: a parità di pressione, una parete più grande riceve una forza più grande.

```ad-example
Esempio 1: la pressione che arriva al tappo
Una siringa piena d'acqua ha lo stantuffo di area $2{,}0\,\text{cm}^2$ e la punta chiusa da un tappo di area $0{,}50\,\text{cm}^2$. Si spinge lo stantuffo con una forza di $10\,\text{N}$. Di quanto aumenta la pressione nell'acqua? Con che forza l'acqua spinge sul tappo?

L'aumento di pressione è la forza divisa per l'area dello stantuffo, in metri quadrati:

$$p = \frac{F}{S} = \frac{10\,\text{N}}{2{,}0 \cdot 10^{-4}\,\text{m}^2} = 5{,}0 \cdot 10^4\,\text{Pa}$$

Per la legge di Pascal lo stesso aumento arriva al tappo, che riceve la forza

$$F_{\text{tappo}} = p \cdot S_{\text{tappo}} = 5{,}0 \cdot 10^4\,\text{Pa} \cdot 0{,}50 \cdot 10^{-4}\,\text{m}^2 = 2{,}5\,\text{N}$$

La pressione sul tappo è la stessa che c'è sotto lo stantuffo; la forza no, perché il tappo è quattro volte più piccolo.
```

```ad-note
La legge di Pascal e il peso del liquido
In un liquido fermo la pressione non è la stessa dappertutto: per il peso del liquido cresce con la profondità, come dice la [legge di Stevino](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-legge-di-stevino-e-i-vasi-comunicanti). La legge di Pascal dice che l'aumento di pressione dato dallo stantuffo si aggiunge uguale in tutti i punti. Nei dispositivi di questa lezione le pressioni in gioco sono molto più grandi di quella dovuta al peso del liquido, che si trascura.
```

## Il torchio idraulico

Il **torchio idraulico** è fatto di due cilindri di sezioni diverse, collegati da un tubo e pieni di un liquido, di solito olio; ogni cilindro è chiuso da un pistone che scorre a tenuta. Sul pistone piccolo, di area $S_1$, si spinge con una forza $F_1$: sotto il pistone la pressione aumenta di

$$p = \frac{F_1}{S_1}$$

e per la legge di Pascal lo stesso aumento arriva sotto il pistone grande, di area $S_2$, che riceve dal liquido una forza verso l'alto

$$F_2 = p \cdot S_2$$

```tikz
% nome: torchio-idraulico-schema
% alt: Un torchio idraulico: due cilindri collegati in basso da un tubo e pieni d'olio, a sinistra uno stretto con il pistone di area S1, a destra uno largo con il pistone di area S2. Sul pistone piccolo agisce la forza F1 verso il basso, più corta; sul pistone grande il liquido spinge verso l'alto con la forza F2, molto più lunga; nel liquido c'è la stessa pressione p
% svg: torchio-idraulico-schema-f1a30f13.svg 193x140
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (0.6,1.8);
\fill[cyan!20] (0,0) rectangle (4.6,0.5);
\fill[cyan!20] (2.6,0) rectangle (4.6,1.8);
\draw[thick] (0,2.6) -- (0,0) -- (4.6,0) -- (4.6,2.6);
\draw[thick] (0.6,2.6) -- (0.6,0.5) -- (2.6,0.5) -- (2.6,2.6);
\draw[thick, fill=gray!20] (0.02,1.8) rectangle (0.58,1.98);
\draw[thick, fill=gray!20] (2.62,1.8) rectangle (4.58,1.98);
\draw[-{Stealth}, thick, red] (0.3,2.9) -- (0.3,2.0) node[pos=0.3, left=2pt] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (3.6,2.0) -- (3.6,3.6) node[pos=0.6, right] {$\vec{F}_2$};
\node[right] at (0.62,1.6) {\small $S_1$};
\node[below] at (3.6,1.75) {\small $S_2$};
\node at (1.6,0.25) {$p$};
\end{tikzpicture}
```

Dalle due formule, la pressione è la stessa sotto i due pistoni:

$$\frac{F_1}{S_1} = \frac{F_2}{S_2} \qquad \text{cioè} \qquad F_2 = F_1 \cdot \frac{S_2}{S_1}$$

La forza sul pistone grande è quella sul pistone piccolo moltiplicata per il rapporto tra le aree: se il pistone grande ha un'area $50$ volte quella del piccolo, la forza è $50$ volte più grande. È una [proporzione](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali), e nel rapporto $\dfrac{S_2}{S_1}$ le aree si possono lasciare in centimetri quadrati, purché siano tutte e due nella stessa unità. Il torchio idraulico è una macchina semplice, come le [leve](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/le-leve-e-le-macchine-semplici): permette di equilibrare una forza grande con una forza piccola.

```ad-example
Esempio 2: quanto solleva un torchio
In un torchio idraulico il pistone piccolo ha l'area di $10\,\text{cm}^2$ e quello grande di $500\,\text{cm}^2$. Sul pistone piccolo si spinge con una forza di $200\,\text{N}$. Quanto vale la forza sul pistone grande? Quale massa può tenere sollevata?

Il rapporto tra le aree è $\dfrac{500\,\text{cm}^2}{10\,\text{cm}^2} = 50$, quindi

$$F_2 = F_1 \cdot \frac{S_2}{S_1} = 200\,\text{N} \cdot 50 = 1{,}0 \cdot 10^4\,\text{N}$$

La stessa forza si trova passando per la pressione: $p = \dfrac{200\,\text{N}}{10 \cdot 10^{-4}\,\text{m}^2} = 2{,}0 \cdot 10^5\,\text{Pa}$ e $F_2 = 2{,}0 \cdot 10^5\,\text{Pa} \cdot 500 \cdot 10^{-4}\,\text{m}^2 = 1{,}0 \cdot 10^4\,\text{N}$. La massa che ha questo peso è

$$m = \frac{F_2}{g} = \frac{1{,}0 \cdot 10^4\,\text{N}}{9{,}8\,\text{N/kg}} \approx 1{,}0 \cdot 10^3\,\text{kg}$$

cioè circa una tonnellata, tenuta sollevata con la forza che serve per tenere in mano $20\,\text{kg}$.
```

```ad-warning
Il rapporto al contrario
La forza grande sta sul pistone grande: $F_2 = F_1 \cdot \dfrac{S_2}{S_1}$, non $F_1 \cdot \dfrac{S_1}{S_2}$. Un controllo veloce: la forza sul pistone grande deve venire più grande di quella sul piccolo.
```

Spesso il problema chiede la forza da fare sul pistone piccolo per reggere un carico: dalla stessa proporzione, $F_1 = F_2 \cdot \dfrac{S_1}{S_2}$.

```ad-example
Esempio 3: il sollevatore dell'officina
Un sollevatore idraulico deve reggere un'auto di $1200\,\text{kg}$ appoggiata su un pistone di area $0{,}15\,\text{m}^2$. Il pistone piccolo ha l'area di $20\,\text{cm}^2$. Con che forza bisogna spingere sul pistone piccolo?

La forza sul pistone grande è il peso dell'auto, $F_2 = 1200\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 11\,760\,\text{N}$. Le aree vanno nella stessa unità: $20\,\text{cm}^2 = 20 \cdot 10^{-4}\,\text{m}^2 = 0{,}0020\,\text{m}^2$. Quindi

$$F_1 = F_2 \cdot \frac{S_1}{S_2} = 11\,760\,\text{N} \cdot \frac{0{,}0020\,\text{m}^2}{0{,}15\,\text{m}^2} \approx 1{,}6 \cdot 10^2\,\text{N}$$

Il pistone grande ha un'area $75$ volte quella del piccolo, e la forza da fare è $75$ volte più piccola del peso dell'auto.
```

### Quando si conoscono i diametri

I pistoni sono cerchi, e spesso si conosce il loro diametro. L'area di un cerchio è proporzionale al quadrato del diametro, $S = \dfrac{\pi\,D^2}{4}$ (vedi [Lunghezza della circonferenza e area del cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/lunghezza-della-circonferenza-e-area-del-cerchio)), quindi il rapporto tra le aree è il quadrato del rapporto tra i diametri:

$$\frac{S_2}{S_1} = \left(\frac{D_2}{D_1}\right)^2$$

Il diametro si indica con la $D$ maiuscola, perché la $d$ minuscola è la densità.

```ad-example
Esempio 4: pistoni di diametro $2{,}0\,\text{cm}$ e $10\,\text{cm}$
In un torchio i pistoni hanno i diametri di $2{,}0\,\text{cm}$ e di $10\,\text{cm}$. Sul pistone piccolo agisce una forza di $80\,\text{N}$. Quanto vale la forza sul pistone grande?

Il diametro è $5{,}0$ volte più grande, l'area $5{,}0^2 = 25$ volte:

$$F_2 = F_1 \cdot \left(\frac{D_2}{D_1}\right)^2 = 80\,\text{N} \cdot 25 = 2{,}0 \cdot 10^3\,\text{N}$$
```

```ad-warning
Il rapporto dei diametri non è il rapporto delle aree
Con i diametri di $2{,}0\,\text{cm}$ e $10\,\text{cm}$ la forza si moltiplica per $25$, non per $5$: $F_2 = 80\,\text{N} \cdot 5 = 400\,\text{N}$ è sbagliato. Prima di usare la proporzione, il rapporto dei diametri va elevato al quadrato.
```

### Gli spostamenti dei pistoni

Il liquido del torchio è incomprimibile: quando il pistone piccolo scende di un tratto $s_1$, spinge nel cilindro grande il volume di liquido $S_1 \cdot s_1$, e il pistone grande sale di un tratto $s_2$ tale che il volume sia lo stesso:

$$S_1 \cdot s_1 = S_2 \cdot s_2 \qquad \text{cioè} \qquad s_2 = s_1 \cdot \frac{S_1}{S_2}$$

Il pistone grande si sposta di meno nella stessa proporzione in cui riceve una forza più grande. Nel torchio dell'esempio 2, se il pistone piccolo scende di $25\,\text{cm}$ il volume spostato è $10\,\text{cm}^2 \cdot 25\,\text{cm} = 250\,\text{cm}^3$, e il pistone grande sale di $\dfrac{250\,\text{cm}^3}{500\,\text{cm}^2} = 0{,}50\,\text{cm}$. Quello che si guadagna in forza si perde in spostamento, come con le leve: per alzare di $10\,\text{cm}$ l'auto dell'esempio 3 il pistone piccolo dovrebbe scendere di $75 \cdot 10\,\text{cm} = 7{,}5\,\text{m}$. Per questo nei sollevatori il pistone piccolo è quello di una pompa, che si aziona molte volte con una corsa breve e ogni volta spinge nel cilindro grande un po' di liquido, trattenuto da una valvola.

Nella figura qui sotto puoi cambiare la forza sul pistone piccolo e le due aree, e poi spingere: guarda quanto si spostano i due pistoni e quale forza arriva su quello grande.

```interattivo
% nome: torchio-idraulico
% alt: Un torchio idraulico con due cilindri pieni d'olio collegati in basso, un pistone piccolo a sinistra e uno grande a destra con sopra una cassa. Tre cursori cambiano la forza sul pistone piccolo, da 50 a 500 newton, e le aree dei due pistoni; sotto la figura si leggono la pressione nel liquido, uguale sotto i due pistoni, e la forza sul pistone grande, uguale alla forza piccola per il rapporto delle aree. Un bottone spinge il pistone piccolo verso il basso di 20 centimetri: il pistone grande sale di un tratto tante volte più piccolo quante volte la sua area è più grande
```

## I freni idraulici

I freni delle auto e delle moto sono un torchio idraulico. Il pedale, attraverso una leva, spinge il pistone di un cilindro piccolo, la pompa; un tubo pieno di un olio speciale, il liquido dei freni, porta l'aumento di pressione alle pinze delle ruote, dove pistoni più grandi premono le pastiglie contro il disco che gira con la ruota. L'attrito tra pastiglie e disco frena la ruota.

```tikz
% nome: freno-idraulico-schema
% alt: Lo schema di un freno idraulico: il pedale spinge verso sinistra il pistone piccolo della pompa; un tubo pieno di liquido dei freni porta la pressione a un cilindro più largo, nella pinza, il cui pistone spinge la pastiglia contro il disco della ruota con una forza più grande
% svg: freno-idraulico-schema-e69ab3a5.svg 318x137
\begin{tikzpicture}
\fill[cyan!20] (0.4,0.2) rectangle (2.2,0.6);
\fill[cyan!20] (0.4,0.2) rectangle (0.8,2.3);
\fill[cyan!20] (0.8,2.0) rectangle (4.9,2.3);
\fill[cyan!20] (4.6,1.1) rectangle (5.4,2.3);
\draw[thick] (2.2,0.6) -- (0.8,0.6) -- (0.8,2.0) -- (4.6,2.0) -- (4.6,1.1);
\draw[thick] (2.2,0.2) -- (0.4,0.2) -- (0.4,2.3) -- (4.6,2.3);
\draw[thick] (5.4,2.3) -- (5.4,1.1);
\draw[thick] (4.6,2.3) -- (5.4,2.3);
\draw[thick, fill=gray!20] (2.2,0.22) rectangle (2.35,0.58);
\draw[thick, fill=gray!20] (2.35,0.34) rectangle (3.2,0.46);
\draw[thick, fill=gray!20] (3.2,0.4) -- (3.6,-0.4) -- (3.75,-0.33) -- (3.35,0.47) -- cycle;
\draw[-{Stealth}, thick, red] (4.4,-0.2) -- (3.75,-0.2) node[pos=0.4, below, black] {\small pedale};
\draw[thick, fill=gray!20] (4.62,0.95) rectangle (5.38,1.1);
\draw[thick, fill=orange!25] (4.6,0.8) rectangle (5.4,0.95);
\draw[thick, fill=gray!20] (4.3,0.45) rectangle (5.7,0.8);
\draw[-{Stealth}, thick, red] (5.65,1.45) -- (5.65,0.95);
\node[right] at (5.7,1.2) {\small forza sulla pastiglia};
\node[below] at (5.0,0.45) {\small disco};
\node[above] at (1.4,0.6) {\small pompa};
\node[above] at (2.7,2.3) {\small liquido dei freni};
\end{tikzpicture}
```

```ad-example
Esempio 5: la forza sulle pastiglie
Nel circuito dei freni di un'auto il pistone della pompa ha l'area di $2{,}0\,\text{cm}^2$ e riceve dal pedale una forza di $300\,\text{N}$. Ogni pinza ha un pistone di area $12\,\text{cm}^2$. Quanto vale l'aumento di pressione nel liquido? Con che forza ogni pistone spinge la sua pastiglia?

$$p = \frac{300\,\text{N}}{2{,}0 \cdot 10^{-4}\,\text{m}^2} = 1{,}5 \cdot 10^6\,\text{Pa}$$

La stessa pressione arriva a tutte le pinze, e su ognuna

$$F = p \cdot S = 1{,}5 \cdot 10^6\,\text{Pa} \cdot 12 \cdot 10^{-4}\,\text{m}^2 = 1{,}8 \cdot 10^3\,\text{N}$$

sei volte la forza sulla pompa, e uguale per tutte le ruote, qualunque sia la lunghezza del tubo che le raggiunge.
```

Nel circuito dei freni non deve entrare aria. L'aria, a differenza del liquido, si comprime: premendo il pedale una parte della corsa serve solo a schiacciare le bolle, il pedale diventa "spugnoso" e la pressione che arriva alle pinze è più bassa. Per questo i meccanici, quando cambiano il liquido dei freni, fanno uscire l'aria dal circuito.

Altri dispositivi con lo stesso principio sono le poltrone regolabili dei dentisti e dei barbieri, i martinetti idraulici, le braccia delle ruspe e le presse dell'industria.
