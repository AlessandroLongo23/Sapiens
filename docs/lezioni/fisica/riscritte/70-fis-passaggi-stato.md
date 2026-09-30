# I passaggi di stato e il calore latente

Un cubetto di ghiaccio in un bicchiere si scioglie, l'acqua della pasta bolle e diventa vapore, il vapore della doccia si ferma in goccioline sullo specchio. In tutti questi casi una sostanza cambia stato, da solido a liquido, da liquido ad aeriforme o al contrario, e per farlo assorbe o cede calore. Il fatto sorprendente è che mentre cambia stato la sua temperatura resta ferma: il ghiaccio che fonde resta a $0\,^\circ\text{C}$ finché non si è sciolto tutto. Questa lezione spiega quanto calore serve, e come si legge il grafico della temperatura di una sostanza che si scalda.

## Gli stati della materia

La materia che ci circonda si presenta in tre **stati di aggregazione**:

- nello stato solido un corpo ha una forma e un volume propri: le sue particelle sono legate da forze intense, e oscillano intorno a posizioni fisse;
- nello stato liquido ha un volume proprio ma prende la forma del recipiente: le particelle restano vicine, ma scorrono le une sulle altre;
- nello stato aeriforme, o gassoso, non ha né forma né volume propri e occupa tutto lo spazio che ha a disposizione: le particelle sono lontane e quasi libere.

Il passaggio da uno stato all'altro è un **passaggio di stato**, e ognuno ha il suo nome.

```tikz
% nome: passaggi-di-stato-schema
% alt: I tre stati, solido in basso a sinistra, liquido in basso a destra e aeriforme in alto, collegati da frecce. Le frecce arancioni, dei passaggi che assorbono calore, sono la fusione da solido a liquido, la vaporizzazione da liquido ad aeriforme e la sublimazione da solido ad aeriforme; le frecce blu, dei passaggi che cedono calore, sono la solidificazione da liquido a solido, la condensazione da aeriforme a liquido e il brinamento da aeriforme a solido
% svg: passaggi-di-stato-schema-11b8f468.svg 313x169
\begin{tikzpicture}
\node[draw, thick, fill=blue!10, minimum width=1.9cm, minimum height=0.7cm] (S) at (0,0) {solido};
\node[draw, thick, fill=cyan!20, minimum width=1.9cm, minimum height=0.7cm] (L) at (5.4,0) {liquido};
\node[draw, thick, fill=gray!20, minimum width=1.9cm, minimum height=0.7cm] (A) at (2.7,3.4) {aeriforme};
\draw[-{Stealth}, thick, orange!90!black] (1.0,0.15) -- (4.4,0.15) node[midway, above] {\small fusione};
\draw[-{Stealth}, thick, blue!70!black] (4.4,-0.15) -- (1.0,-0.15) node[midway, below] {\small solidificazione};
\draw[-{Stealth}, thick, orange!90!black] (5.25,0.4) -- (3.5,3.05) node[midway, right=2pt] {\small vaporizzazione};
\draw[-{Stealth}, thick, blue!70!black] (3.2,3.05) -- (4.95,0.4) node[pos=0.75, left=1pt] {\small condensazione};
\draw[-{Stealth}, thick, orange!90!black] (-0.15,0.4) -- (1.6,3.05) node[midway, left=2pt] {\small sublimazione};
\draw[-{Stealth}, thick, blue!70!black] (1.9,3.05) -- (0.45,0.4) node[pos=0.3, right=1pt] {\small brinamento};
\end{tikzpicture}
```

I passaggi disegnati in arancione, dallo stato più ordinato a quello meno ordinato, avvengono solo se la sostanza assorbe calore: serve energia per allontanare le particelle contro le forze che le tengono unite. I passaggi opposti, in blu, avvengono quando la sostanza cede calore all'ambiente. Il passaggio da aeriforme a solido si chiama anche condensazione: qui lo chiamiamo brinamento, come la brina che si forma sui prati nelle notti fredde.

## La temperatura resta costante

Se si scalda un pezzo di ghiaccio preso dal congelatore, a $-20\,^\circ\text{C}$, la sua temperatura sale fino a $0\,^\circ\text{C}$; lì il ghiaccio comincia a fondere, e da quel momento la temperatura si ferma a $0\,^\circ\text{C}$, anche se si continua a fornire calore, finché tutto il ghiaccio non è diventato acqua. Solo allora la temperatura riprende a salire. Lo stesso succede a $100\,^\circ\text{C}$, quando l'acqua bolle. In generale, a una data pressione:

- ogni sostanza pura fonde a una temperatura fissa, la **temperatura di fusione**, e solidifica alla stessa temperatura;
- ogni liquido bolle a una temperatura fissa, la **temperatura di ebollizione**, e il suo vapore condensa alla stessa temperatura;
- durante il passaggio di stato la temperatura resta costante.

Il calore fornito durante il passaggio non fa aumentare l'agitazione delle particelle, cioè la temperatura: serve a vincere le forze che le tengono unite, a spezzare la struttura ordinata del solido o ad allontanare le particelle del liquido.

```ad-warning
Alzare il fuoco non fa bollire l'acqua più calda
Quando l'acqua della pasta bolle, a livello del mare, è a $100\,^\circ\text{C}$, e ci resta anche con il fuoco al massimo: il calore in più fa solo evaporare l'acqua più in fretta. La pasta non cuoce prima; si risparmia gas tenendo il fuoco basso, purché l'acqua continui a bollire.
```

## Il calore latente

Il calore necessario per far cambiare stato a una sostanza, che si trova già alla temperatura del passaggio, è direttamente proporzionale alla sua massa:

$$Q = L\,m$$

La costante $L$ si chiama **calore latente** e dipende dalla sostanza e dal passaggio: il calore latente di fusione $L_f$ è il calore che serve per fondere $1\,\text{kg}$ della sostanza, il calore latente di vaporizzazione $L_v$ è quello che serve per vaporizzarne $1\,\text{kg}$. Si misura in $\text{J/kg}$. "Latente" vuol dire nascosto: questo calore entra nella sostanza senza farne salire la temperatura.

Nei passaggi inversi la sostanza restituisce all'ambiente lo stesso calore: $1\,\text{kg}$ di acqua che solidifica cede $L_f$, $1\,\text{kg}$ di vapore che condensa cede $L_v$.

| Sostanza | $t$ di fusione | $L_f$ in $\text{J/kg}$ | $t$ di ebollizione | $L_v$ in $\text{J/kg}$ |
|---|---|---|---|---|
| acqua | $0\,^\circ\text{C}$ | $3{,}34 \cdot 10^5$ | $100\,^\circ\text{C}$ | $2{,}26 \cdot 10^6$ |
| alcol etilico | $-114\,^\circ\text{C}$ | $1{,}08 \cdot 10^5$ | $78\,^\circ\text{C}$ | $8{,}55 \cdot 10^5$ |
| piombo | $327\,^\circ\text{C}$ | $2{,}30 \cdot 10^4$ | $1750\,^\circ\text{C}$ | $8{,}71 \cdot 10^5$ |

Le temperature di ebollizione della tabella sono quelle alla pressione atmosferica normale. Per l'acqua $L_v$ è quasi sette volte $L_f$: far bollire via l'acqua di una pentola costa molta più energia che sciogliere la stessa massa di ghiaccio.

```ad-example
Esempio 1: sciogliere il ghiaccio
Quanto calore serve per fondere $0{,}50\,\text{kg}$ di ghiaccio che si trova già a $0\,^\circ\text{C}$?

$$Q = L_f\,m = 3{,}34 \cdot 10^5\,\text{J/kg} \cdot 0{,}50\,\text{kg} = 1{,}67 \cdot 10^5\,\text{J} \approx 1{,}7 \cdot 10^5\,\text{J}$$

Durante tutto il passaggio il ghiaccio e l'acqua che si forma restano a $0\,^\circ\text{C}$.
```

```ad-example
Esempio 2: far bollire via l'acqua
Una pentola contiene $0{,}20\,\text{kg}$ d'acqua a $100\,^\circ\text{C}$. Quanto calore serve per trasformarla tutta in vapore? E quanto ne era servito per portarla da $0$ a $100\,^\circ\text{C}$?

$$Q_v = L_v\,m = 2{,}26 \cdot 10^6\,\text{J/kg} \cdot 0{,}20\,\text{kg} = 4{,}52 \cdot 10^5\,\text{J} \approx 4{,}5 \cdot 10^5\,\text{J}$$

Per scaldarla, con il calore specifico dell'acqua $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$:

$$Q = c\,m\,\Delta t = 4186 \cdot 0{,}20 \cdot 100\,\text{J} = 8{,}372 \cdot 10^4\,\text{J} \approx 8{,}4 \cdot 10^4\,\text{J}$$

Vaporizzare l'acqua costa più di cinque volte che scaldarla da $0$ a $100\,^\circ\text{C}$.
```

```ad-warning
$Q = L\,m$ vale solo alla temperatura del passaggio
Il calore latente dice quanto calore serve per cambiare stato, non per arrivare alla temperatura del passaggio. Per fondere ghiaccio che si trova a $-15\,^\circ\text{C}$ bisogna prima scaldarlo fino a $0\,^\circ\text{C}$, con $Q = c\,m\,\Delta t$ e il calore specifico del ghiaccio, e solo dopo aggiungere $L_f\,m$.
```

## Il grafico temperatura-calore

Se si fornisce calore a mezzo chilogrammo di ghiaccio a $-40\,^\circ\text{C}$ e si segna la temperatura in funzione del calore fornito, si ottiene il grafico qui sotto. Nei tratti in salita la sostanza è in un solo stato e si scalda con $Q = c\,m\,\Delta t$: prima il ghiaccio, con $c = 2{,}1 \cdot 10^3\,\text{J/(kg}\cdot{}^\circ\text{C)}$ (il valore $2050$ della tabella della lezione sul calore, arrotondato), poi l'acqua, con $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, infine il vapore, con $c = 2{,}0 \cdot 10^3\,\text{J/(kg}\cdot{}^\circ\text{C)}$. I tratti orizzontali, i pianerottoli, sono i passaggi di stato: la fusione a $0\,^\circ\text{C}$, lunga $L_f\,m = 167\,\text{kJ}$, e l'ebollizione a $100\,^\circ\text{C}$, lunga $L_v\,m = 1130\,\text{kJ}$.

```tikz
% nome: grafico-temperatura-calore-acqua
% alt: Grafico della temperatura in funzione del calore fornito a mezzo chilogrammo di ghiaccio, da meno 40 a 140 gradi Celsius, con il calore in kilojoule da 0 a 1600. Un breve tratto in salita porta il ghiaccio da meno 40 a 0 gradi con 42 kilojoule; un pianerottolo a 0 gradi, lungo 167 kilojoule, è la fusione; un tratto in salita porta l'acqua a 100 gradi a 418 kilojoule; un lungo pianerottolo a 100 gradi, fino a 1548 kilojoule, è l'ebollizione; un ultimo breve tratto scalda il vapore fino a 140 gradi a 1588 kilojoule
% svg: grafico-temperatura-calore-acqua-3e59933c.svg 403x156
% poi-interattivo: spostare un punto lungo la curva e leggere il calore fornito e la temperatura
\begin{tikzpicture}
\draw[gray!25, very thin] (0,-0.72) grid[xstep=1, ystep=0.36] (8.2,2.52);
\draw[->] (-0.2,0) -- (8.5,0) node[right] {$Q$ (kJ)};
\draw[->] (0,-0.9) -- (0,2.8) node[right] {$t$ ($^\circ$C)};
\foreach \x/\l in {1/200,2/400,3/600,4/800,5/1000,6/1200,7/1400,8/1600} \draw (\x,0.06) -- (\x,-0.06) node[below] {\small \l};
\foreach \y/\l in {-0.72/-40,1.8/100,2.52/140} \draw (0.06,\y) -- (-0.06,\y) node[left] {\small \l};
\node[left] at (-0.06,0.14) {\small 0};
\draw[very thick, blue!70!black] (0,-0.72) -- (0.21,0) -- (1.045,0) -- (2.0915,1.8) -- (7.7415,1.8) -- (7.9415,2.52);
\draw[dashed, thin] (2.0915,1.8) -- (2.0915,0);
\draw[dashed, thin] (7.7415,1.8) -- (7.7415,0);
\node[above] at (0.63,0) {\small fusione};
\node[above] at (4.9,1.8) {\small ebollizione};
\node[right] at (0.3,-0.62) {\small ghiaccio};
\node[right] at (1.5,0.75) {\small acqua};
\node[left] at (7.85,2.3) {\small vapore};
\end{tikzpicture}
```

Il pianerottolo dell'ebollizione è quasi sette volte più lungo di quello della fusione, perché $L_v$ è quasi sette volte $L_f$. Anche le pendenze dei tratti in salita dicono qualcosa: a parità di calore, l'acqua liquida si scalda circa la metà del ghiaccio e del vapore, perché il suo calore specifico è circa il doppio.

Nella figura qui sotto fornisci calore al ghiaccio e guardi il punto che si muove sul grafico, mentre il becker accanto mostra che cosa c'è dentro: ghiaccio, ghiaccio e acqua, acqua, acqua che bolle, vapore.

```interattivo
% nome: curva-riscaldamento-acqua
% alt: A sinistra un becker, a destra il grafico della temperatura in funzione del calore fornito a mezzo chilogrammo di ghiaccio, da meno 40 a 140 gradi, con i pianerottoli della fusione a 0 gradi e dell'ebollizione a 100 gradi. Un cursore e un bottone forniscono il calore; un punto si muove lungo la curva e il becker mostra i cubetti di ghiaccio, poi il ghiaccio che si scioglie nell'acqua, l'acqua, l'acqua che bolle e cala mentre diventa vapore, e infine solo vapore. Sotto si leggono il calore fornito, la temperatura e quanta massa è ghiaccio, acqua o vapore
```

```ad-example
Esempio 3: dal congelatore al bicchiere
Quanto calore serve per trasformare $0{,}30\,\text{kg}$ di ghiaccio a $-15\,^\circ\text{C}$ in acqua a $25\,^\circ\text{C}$? Il calore specifico del ghiaccio è $2{,}1 \cdot 10^3\,\text{J/(kg}\cdot{}^\circ\text{C)}$, quello dell'acqua $4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$.

Le tappe sono tre, come i primi tre tratti del grafico:

$$
\begin{aligned}
Q_1 &= c_{ghiaccio}\,m\,\Delta t_1 = 2{,}1 \cdot 10^3 \cdot 0{,}30 \cdot 15\,\text{J} = 9450\,\text{J} \\
Q_2 &= L_f\,m = 3{,}34 \cdot 10^5 \cdot 0{,}30\,\text{J} = 100\,200\,\text{J} \\
Q_3 &= c_{acqua}\,m\,\Delta t_3 = 4186 \cdot 0{,}30 \cdot 25\,\text{J} = 31\,395\,\text{J}
\end{aligned}
$$

In tutto $Q = Q_1 + Q_2 + Q_3 = 141\,045\,\text{J} \approx 1{,}4 \cdot 10^5\,\text{J}$. Più di due terzi del calore servono solo a sciogliere il ghiaccio.
```

```ad-example
Esempio 4: perché il vapore scotta più dell'acqua bollente
Dieci grammi di vapore a $100\,^\circ\text{C}$ condensano sulla pelle, e l'acqua che si forma si raffredda fino a $37\,^\circ\text{C}$. Quanto calore cedono alla pelle? E dieci grammi di acqua bollente?

Il vapore prima condensa, cedendo $L_v\,m$, poi l'acqua si raffredda di $63\,^\circ\text{C}$:

$$Q = L_v\,m + c\,m\,\Delta t = 2{,}26 \cdot 10^6 \cdot 0{,}010\,\text{J} + 4186 \cdot 0{,}010 \cdot 63\,\text{J} = 22\,600\,\text{J} + 2637\,\text{J} \approx 2{,}5 \cdot 10^4\,\text{J}$$

L'acqua bollente cede solo la seconda parte, circa $2{,}6 \cdot 10^3\,\text{J}$: il vapore cede quasi dieci volte più calore, e per questo una scottatura da vapore è più grave.
```

## Ghiaccio nell'acqua

Un cubetto di ghiaccio messo in una bibita la raffredda anche per un altro motivo oltre alla sua temperatura: per sciogliersi assorbe il calore latente di fusione, che la bibita gli cede. Il bilancio si scrive come nella lezione sull'[equilibrio termico](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/l-equilibrio-termico-e-il-calorimetro), con il calore latente in più tra i calori assorbiti: il calore ceduto dall'acqua calda è uguale al calore che il ghiaccio assorbe per fondere più quello che assorbe l'acqua di fusione per scaldarsi fino alla temperatura finale.

```ad-example
Esempio 5: un cubetto in un bicchiere d'acqua
Un cubetto di ghiaccio di $40\,\text{g}$, a $0\,^\circ\text{C}$, viene messo in un bicchiere con $250\,\text{g}$ d'acqua a $20\,^\circ\text{C}$. Trascurando il bicchiere e l'aria, a quale temperatura arriva l'acqua?

Prima si controlla che il ghiaccio fonda tutto. Per fonderlo servono $L_f\,m = 3{,}34 \cdot 10^5 \cdot 0{,}040\,\text{J} = 13\,360\,\text{J}$; l'acqua, raffreddandosi fino a $0\,^\circ\text{C}$, può cedere al massimo $4186 \cdot 0{,}250 \cdot 20\,\text{J} = 20\,930\,\text{J}$, che è di più: il ghiaccio fonde tutto, e la temperatura finale $t_e$ è sopra $0\,^\circ\text{C}$.

Il calore ceduto dall'acqua, che passa da $20\,^\circ\text{C}$ a $t_e$, fonde il ghiaccio e scalda l'acqua di fusione da $0\,^\circ\text{C}$ a $t_e$:

$$4186 \cdot 0{,}250 \cdot (20 - t_e) = 13\,360 + 4186 \cdot 0{,}040 \cdot (t_e - 0)$$

$$20\,930 - 1046{,}5\,t_e = 13\,360 + 167{,}44\,t_e \qquad t_e = \frac{7570}{1213{,}94}\,^\circ\text{C} = 6{,}23\ldots\,^\circ\text{C} \approx 6{,}2\,^\circ\text{C}$$

Se il conto avesse dato una temperatura sotto zero, il ghiaccio non si sarebbe sciolto tutto, e la temperatura finale sarebbe stata $0\,^\circ\text{C}$, con un po' di ghiaccio ancora a galla.
```

## Evaporazione ed ebollizione

La vaporizzazione avviene in due modi.

- L'**evaporazione** avviene a qualunque temperatura, e solo sulla superficie del liquido: le particelle più veloci, vicino alla superficie, riescono a sfuggire. È il modo in cui si asciugano i panni stesi e le pozzanghere. Va più in fretta se la temperatura è più alta, se la superficie è più grande e se c'è vento, che porta via il vapore.
- L'**ebollizione** avviene solo alla temperatura di ebollizione, e in tutto il volume del liquido: si formano bolle di vapore anche sul fondo, che salgono e scoppiano in superficie.

Anche l'evaporazione assorbe il calore latente di vaporizzazione, e lo prende dal liquido che resta e dal corpo su cui si trova: per questo si ha freddo uscendo bagnati dall'acqua, e il sudore che evapora raffredda la pelle.

La temperatura di ebollizione dipende dalla pressione che agisce sulla superficie del liquido. Una bolla di vapore può formarsi solo se la pressione del vapore al suo interno vince la pressione esterna, e con una pressione esterna più bassa questo succede a una temperatura più bassa. In montagna la [pressione atmosferica](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione-atmosferica-e-la-sua-misura) è minore e l'acqua bolle sotto i $100\,^\circ\text{C}$: in cima al Monte Bianco, a circa $4800\,\text{m}$, bolle intorno a $85\,^\circ\text{C}$, e la pasta cuoce male. Nella pentola a pressione succede il contrario: il coperchio chiuso tiene il vapore dentro, la pressione sale fino a circa il doppio di quella atmosferica e l'acqua bolle intorno a $120\,^\circ\text{C}$, e il cibo cuoce più in fretta.

```ad-warning
Evaporazione ed ebollizione non sono sinonimi
Tutte e due sono vaporizzazione, ma l'evaporazione avviene a ogni temperatura e solo in superficie, l'ebollizione solo alla temperatura di ebollizione e in tutto il liquido. Una pozzanghera che si asciuga d'estate evapora: non bolle, perché è ben lontana da $100\,^\circ\text{C}$.
```

## Condensazione e sublimazione

La **condensazione** è il passaggio da aeriforme a liquido. Il vapore acqueo che c'è sempre nell'aria condensa quando incontra una superficie fredda: si appannano lo specchio del bagno dopo la doccia e gli occhiali entrando d'inverno in una stanza calda, e si formano le goccioline su una bottiglia presa dal frigorifero. Condensando, il vapore cede all'ambiente il suo calore latente di vaporizzazione.

La **sublimazione** è il passaggio diretto da solido ad aeriforme, senza passare dal liquido. Sublimano la naftalina e il ghiaccio secco, cioè l'anidride carbonica solida, che a pressione atmosferica non diventa mai liquida; anche il ghiaccio sublima lentamente, ed è per questo che i cubetti dimenticati nel congelatore si rimpiccioliscono. Il passaggio inverso, da aeriforme a solido, è il **brinamento**: nelle notti fredde il vapore dell'aria si deposita direttamente in cristalli di ghiaccio sull'erba e sui vetri delle auto, la brina.
