# La potenza

Due persone portano la stessa cassa sullo stesso scaffale: la prima ci mette due secondi, la seconda dieci. Il lavoro contro il peso è lo stesso, perché cassa e altezza sono le stesse, ma la prima lo fa più in fretta. La grandezza che misura questa rapidità è la potenza: quanto lavoro si compie in ogni secondo. È il numero scritto sui motori, sulle lampadine e sugli elettrodomestici.

## Lavoro diviso tempo

La **potenza** media è il rapporto tra il [lavoro](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza) $W$ compiuto e l'intervallo di tempo $\Delta t$ in cui lo si compie:

$$P = \frac{W}{\Delta t}$$

Nel Sistema Internazionale si misura in joule al secondo, un'unità che si chiama **watt** (W), da James Watt, l'inventore scozzese che perfezionò la macchina a vapore:

$$1\,\text{W} = \frac{1\,\text{J}}{1\,\text{s}}$$

Si usano spesso i multipli: il kilowatt, $1\,\text{kW} = 10^3\,\text{W}$, e il megawatt, $1\,\text{MW} = 10^6\,\text{W}$. Dalla stessa formula si ricavano il lavoro, $W = P \cdot \Delta t$, e il tempo, $\Delta t = W / P$.

```ad-warning
Due grandezze con la lettera P
Nel primo anno $P$ era il peso; qui $P$ è la potenza. Quando compaiono tutte e due, il peso si scrive $m g$, come negli esempi di questa lezione. E il watt, W in tondo, non va confuso con il lavoro, $W$ in corsivo.
```

```ad-example
Esempio 1: la stessa cassa, due potenze
Una cassa di $15\,\text{kg}$ viene sollevata a velocità costante su uno scaffale alto $1{,}2\,\text{m}$. Anna ci mette $2{,}0\,\text{s}$, Bruno $10\,\text{s}$. Con quale potenza media lavorano?

Per sollevare la cassa a velocità costante serve una forza uguale al peso $m g$, verso l'alto, e il lavoro è lo stesso per tutti e due:

$$W = m g h = 15\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 1{,}2\,\text{m} = 176{,}4\,\text{J}$$

$$P_{Anna} = \frac{176{,}4\,\text{J}}{2{,}0\,\text{s}} = 88{,}2\,\text{W} \approx 88\,\text{W} \qquad P_{Bruno} = \frac{176{,}4\,\text{J}}{10\,\text{s}} = 17{,}64\,\text{W} \approx 18\,\text{W}$$

Stesso lavoro, tempo cinque volte più lungo: potenza cinque volte più piccola.
```

```ad-example
Esempio 2: di corsa su per le scale
Uno studente di $60\,\text{kg}$ sale di corsa una rampa di scale alta $3{,}0\,\text{m}$ in $4{,}0\,\text{s}$. Quanto vale la potenza media che sviluppa contro il peso?

$$P = \frac{m g h}{\Delta t} = \frac{60\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 3{,}0\,\text{m}}{4{,}0\,\text{s}} = \frac{1764\,\text{J}}{4{,}0\,\text{s}} = 441\,\text{W} \approx 4{,}4 \cdot 10^2\,\text{W}$$

Conta solo il dislivello, perché il lavoro del peso non dipende dal percorso: la lunghezza della rampa non serve.
```

## Potenza e velocità

Quando una forza costante $F$ spinge un corpo che si muove a velocità costante $v$ nella direzione della forza, in un tempo $\Delta t$ il corpo percorre $s = v\,\Delta t$, e il lavoro è $W = F\,v\,\Delta t$. Dividendo per $\Delta t$:

$$P = F \cdot v$$

La formula spiega perché un'auto, a parità di potenza del motore, sale una salita ripida più piano che in pianura: se la forza che serve è più grande, la velocità deve essere più piccola.

```tikz
% nome: auto-forza-velocita-potenza
% alt: Un'automobile, disegnata come un blocco su una strada orizzontale, che viaggia verso destra a velocità costante: sopra il blocco la velocità v, in blu; dal centro del blocco partono la forza motrice F, verso destra, e la forza resistente F r, verso sinistra, lunga uguale, in rosso
% svg: auto-forza-velocita-potenza-9cf2fc43.svg 216x56
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (1.9,0) rectangle ++(1.4,0.7);
\draw[-{Stealth}, thick, red] (2.6,0.35) -- (4.4,0.35) node[right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (2.6,0.35) -- (0.8,0.35) node[left] {$\vec{F}_r$};
\draw[-{Stealth}, thick, blue!60!black] (2.1,1.0) -- (3.6,1.0) node[right] {$\vec{v}$};
\fill (2.6,0.35) circle (1.5pt);
\end{tikzpicture}
```

A velocità costante la forza del motore bilancia le forze resistenti (l'attrito dell'aria e delle ruote), come dice il [primo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali), e la potenza del motore è $F \cdot v$ con $F$ uguale alla forza resistente.

```ad-example
Esempio 3: un'auto in autostrada
Un'auto viaggia a $72\,\text{km/h}$ costanti; le forze resistenti valgono in tutto $600\,\text{N}$. Quale potenza sviluppa il motore?

La velocità va in metri al secondo: $72\,\text{km/h} = 72 / 3{,}6\,\text{m/s} = 20\,\text{m/s}$. A velocità costante la forza del motore è uguale alla forza resistente:

$$P = F \cdot v = 600\,\text{N} \cdot 20\,\text{m/s} = 12\,000\,\text{W} = 12\,\text{kW}$$
```

```ad-warning
La velocità in m/s
Con $F$ in newton, la potenza esce in watt solo se la velocità è in metri al secondo. Nell'esempio 3, con $72\,\text{km/h}$ lasciati così, si otterrebbe $43\,200$, un numero $3{,}6$ volte troppo grande.
```

```ad-example
Esempio 4: una gru
Una gru solleva un carico di $500\,\text{kg}$ a velocità costante, $0{,}40\,\text{m/s}$. Quale potenza serve?

A velocità costante la gru tira con una forza uguale al peso, $m g = 500\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 4900\,\text{N}$:

$$P = m g \cdot v = 4900\,\text{N} \cdot 0{,}40\,\text{m/s} = 1960\,\text{W} \approx 2{,}0\,\text{kW}$$
```

```ad-note
Forza inclinata
Se la forza forma un angolo $\alpha$ con la velocità, lavora solo la sua componente lungo la velocità, come per il lavoro, e $P = F\,v\cos\alpha$.
```

## Il kilowattora

Dalla definizione di potenza, il lavoro è potenza per tempo: $W = P \cdot \Delta t$. Per questo un prodotto di un'unità di potenza per un'unità di tempo è un'unità di lavoro. Il **kilowattora** (kWh) è il lavoro compiuto in un'ora da una potenza di un kilowatt:

$$1\,\text{kWh} = 1000\,\text{W} \cdot 3600\,\text{s} = 3{,}6 \cdot 10^6\,\text{J}$$

Si usa per l'energia elettrica, quella che si paga in bolletta. L'energia, di cui parlano le prossime lezioni a partire da [L'energia cinetica e il teorema dell'energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica), si misura in joule come il lavoro, e quindi anche in kilowattora.

```ad-warning
Il kilowattora non è una potenza
Il kilowatt (kW) misura una potenza, quanto in fretta si consuma energia; il kilowattora (kWh) misura un'energia, quanta se ne consuma in tutto. Un forno da $2\,\text{kW}$ acceso per mezz'ora consuma $1\,\text{kWh}$, non "$2\,\text{kW}$ all'ora".
```

```ad-example
Esempio 5: il forno acceso
Un forno elettrico da $2{,}0\,\text{kW}$ resta acceso per $45$ minuti. Quanta energia consuma, in kilowattora e in joule? Quanto costa, se il prezzo è di $0{,}25$ euro al kilowattora?

Il tempo in ore: $45\,\text{min} = 0{,}75\,\text{h}$.

$$W = P \cdot \Delta t = 2{,}0\,\text{kW} \cdot 0{,}75\,\text{h} = 1{,}5\,\text{kWh} = 1{,}5 \cdot 3{,}6 \cdot 10^6\,\text{J} = 5{,}4 \cdot 10^6\,\text{J}$$

La spesa è $1{,}5 \cdot 0{,}25 = 0{,}375$ euro, circa $38$ centesimi. Il prezzo è un esempio: quello vero cambia con il contratto e con il mese.
```

```ad-note
Il cavallo vapore
Per i motori delle auto si sente ancora dire la potenza in **cavalli vapore** (CV), un'unità nata quando le macchine a vapore sostituivano i cavalli. Non fa parte del Sistema Internazionale: il cavallo vapore metrico vale $75$ chilogrammi-peso sollevati di un metro al secondo, cioè $75 \cdot 9{,}80665\,\text{W} = 735{,}49875\,\text{W}$, circa $735\,\text{W}$. Un'auto da $100\,\text{CV}$ ha un motore di circa $74\,\text{kW}$. Il cavallo inglese, horsepower (hp), è un po' più grande, circa $746\,\text{W}$.
```
