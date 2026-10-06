# Il teorema di Carnot e il ciclo di Carnot

Il [secondo principio](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/gli-enunciati-di-kelvin-e-di-clausius) dice che nessuna macchina termica ha rendimento 1, ma non dice quanto ci si può avvicinare. Se lo chiese nel 1824 Sadi Carnot, un ingegnere francese di ventotto anni, guardando le macchine a vapore del suo tempo: si possono migliorare senza limite, cambiando il fluido o il meccanismo? La sua risposta è che un limite c'è, e dipende soltanto dalle temperature delle due sorgenti tra cui la macchina lavora.

## Trasformazioni reversibili e irreversibili

Per enunciare il risultato di Carnot serve distinguere due tipi di trasformazione.

Una trasformazione è **reversibile** se si può percorrere al contrario riportando allo stato iniziale sia il sistema sia l'ambiente, senza che resti alcuna traccia. Perché questo sia possibile devono valere tre condizioni:

- la trasformazione è quasistatica, cioè passa per una successione di [stati di equilibrio](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/sistemi-termodinamici-e-principio-zero);
- non ci sono attriti;
- il sistema scambia calore solo con corpi che hanno la sua stessa temperatura (in pratica, una temperatura diversa di pochissimo).

Una trasformazione che non rispetta anche una sola di queste condizioni è **irreversibile**. Tutte le trasformazioni reali lo sono, e i motivi tipici sono tre:

| Che cosa succede | Perché non si torna indietro |
|---|---|
| un attrito trasforma lavoro in calore | quel calore non ridiventa tutto lavoro (enunciato di Kelvin) |
| passa calore tra due corpi a temperature diverse | il calore non torna da solo al corpo più caldo (enunciato di Clausius) |
| un gas si espande di colpo in un recipiente vuoto | non torna da solo nel volume di prima: per ricomprimerlo serve lavoro |

La trasformazione reversibile è un caso limite, come il moto senza attrito in meccanica: nessuna trasformazione reale lo è del tutto, ma ci si può avvicinare quanto si vuole, procedendo lentamente e riducendo gli attriti e le differenze di temperatura.

Una **macchina reversibile** è una macchina termica il cui ciclo è fatto solo di trasformazioni reversibili. Si può far funzionare al contrario, come [frigorifero](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/frigoriferi-e-pompe-di-calore), con gli stessi valori di $Q_c$, $Q_f$ e $W$ e tutti i versi scambiati.

## Il teorema di Carnot

Il **teorema di Carnot** confronta le macchine che lavorano tra le stesse due sorgenti, una a temperatura $T_c$ e una a temperatura $T_f$:

> Tutte le macchine reversibili che lavorano tra le stesse due temperature hanno lo stesso rendimento, e nessun'altra macchina che lavori tra quelle temperature può avere un rendimento maggiore.

Detto $\eta_{rev}$ il rendimento delle macchine reversibili, per ogni macchina termica tra le stesse sorgenti vale

$$\eta \le \eta_{rev}$$

con l'uguale solo se la macchina è reversibile. Il fluido usato, il tipo di ciclo e la forma della macchina non contano: contano le due temperature.

Il teorema si dimostra per assurdo, con la stessa tecnica usata per l'equivalenza degli enunciati di Kelvin e di Clausius: una macchina migliore di quella reversibile, collegata alla reversibile fatta girare al contrario, porterebbe calore dal freddo al caldo senza lavoro.

```ad-example
Esempio 1: perché nessuna macchina batte quella reversibile
Tra due sorgenti lavora una macchina reversibile $R$ con rendimento $0{,}40$: assorbe $1000\,\text{J}$, compie $400\,\text{J}$ di lavoro e cede $600\,\text{J}$. Supponi che tra le stesse sorgenti esista una macchina $X$ con rendimento $0{,}50$. Che cosa succede se il lavoro di $X$ fa girare $R$ al contrario?

Per produrre i $400\,\text{J}$ di lavoro che servono a $R$, la macchina $X$ assorbe

$$Q_c = \frac{W}{\eta} = \frac{400\,\text{J}}{0{,}50} = 800\,\text{J}$$

e cede $800\,\text{J} - 400\,\text{J} = 400\,\text{J}$ alla sorgente fredda. La macchina $R$, al contrario, riceve i $400\,\text{J}$ di lavoro, assorbe $600\,\text{J}$ dalla sorgente fredda e ne cede $1000\,\text{J}$ alla sorgente calda.

- Sorgente calda: cede $800\,\text{J}$ e ne riceve $1000\,\text{J}$. In tutto riceve $200\,\text{J}$.
- Sorgente fredda: riceve $400\,\text{J}$ e ne cede $600\,\text{J}$. In tutto cede $200\,\text{J}$.
- Lavoro scambiato con l'esterno: zero.

L'unico risultato è il passaggio di $200\,\text{J}$ dalla sorgente fredda a quella calda: è vietato dall'enunciato di Clausius. La macchina $X$ non può esistere.

```tikz
% nome: teorema-carnot-macchina-x-reversibile-inversa
% alt: Tra una sorgente calda in alto e una sorgente fredda in basso lavorano due macchine. A sinistra, tratteggiata, la macchina X: assorbe 800 joule dalla sorgente calda, cede 400 joule alla sorgente fredda e manda 400 joule di lavoro alla macchina di destra. A destra la macchina reversibile R che gira al contrario: riceve i 400 joule di lavoro, assorbe 600 joule dalla sorgente fredda e cede 1000 joule alla sorgente calda
% svg: teorema-carnot-macchina-x-reversibile-inversa-ee117966.svg 256x182
\begin{tikzpicture}
\draw[thick, fill=red!15] (-3.2,4) rectangle (3.2,4.7);
\node at (0,4.35) {\small sorgente calda};
\draw[thick, fill=blue!10] (-3.2,0) rectangle (3.2,0.7);
\node at (0,0.35) {\small sorgente fredda};
\draw[thin, fill=orange!25] (-2,4) -- (-2,3.3) -- (-2.15,3.3) -- (-1.6,3) -- (-1.05,3.3) -- (-1.2,3.3) -- (-1.2,4) -- cycle;
\draw[thin, fill=orange!25] (-1.8,1.7) -- (-1.8,1) -- (-1.95,1) -- (-1.6,0.7) -- (-1.25,1) -- (-1.4,1) -- (-1.4,1.7) -- cycle;
\draw[thin, fill=green!15] (-0.95,2.55) -- (0.65,2.55) -- (0.65,2.7) -- (0.95,2.35) -- (0.65,2) -- (0.65,2.15) -- (-0.95,2.15) -- cycle;
\draw[thick, dashed, fill=gray!20] (-1.6,2.35) circle (0.65);
\node at (-1.6,2.35) {$X$};
\draw[thin, fill=orange!25] (1.3,0.7) -- (1.3,1.4) -- (1.15,1.4) -- (1.6,1.7) -- (2.05,1.4) -- (1.9,1.4) -- (1.9,0.7) -- cycle;
\draw[thin, fill=orange!25] (1.1,3) -- (1.1,3.7) -- (0.95,3.7) -- (1.6,4) -- (2.25,3.7) -- (2.1,3.7) -- (2.1,3) -- cycle;
\draw[thick, fill=gray!20] (1.6,2.35) circle (0.65);
\node at (1.6,2.35) {$R$};
\node[left] at (-2.2,3.6) {\small $800$ J};
\node[left] at (-2.0,1.3) {\small $400$ J};
\node[below] at (0,1.95) {\small $W = 400$ J};
\node[right] at (2.3,3.5) {\small $1000$ J};
\node[right] at (2.1,1.2) {\small $600$ J};
\end{tikzpicture}
```
```

Lo stesso ragionamento, fatto con due macchine reversibili, mostra che nessuna delle due può rendere più dell'altra: hanno quindi lo stesso rendimento.

## Il rendimento di una macchina reversibile

Poiché tutte le macchine reversibili tra due temperature hanno lo stesso rendimento, questo si può calcolare una volta per tutte, su una macchina qualsiasi. Il risultato è

$$\eta_{rev} = 1 - \frac{T_f}{T_c}$$

con le temperature in kelvin. Qui la formula è enunciata; il riquadro alla fine della sezione sul ciclo di Carnot mostra da dove viene. Confrontandola con la definizione $\eta = 1 - Q_f / Q_c$ si vede che in una macchina reversibile i calori scambiati stanno tra loro come le temperature delle sorgenti:

$$\frac{Q_f}{Q_c} = \frac{T_f}{T_c}$$

Dalla formula si leggono tre fatti.

- Il rendimento massimo dipende solo dal rapporto $T_f / T_c$: per alzarlo si può scaldare di più la sorgente calda o raffreddare di più quella fredda.
- Con $T_f = T_c$ il rendimento è zero: senza una differenza di temperatura non si ottiene lavoro.
- Il rendimento sarebbe 1 solo con $T_f = 0\,\text{K}$, lo [zero assoluto](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche), che non si può raggiungere.

```ad-example
Esempio 2: una macchina reversibile tra 500 K e 300 K
Una macchina reversibile lavora tra una sorgente a $500\,\text{K}$ e una a $300\,\text{K}$, e in ogni ciclo assorbe $1500\,\text{J}$. Qual è il suo rendimento? Quanto lavoro compie e quanto calore cede in un ciclo?

$$\eta_{rev} = 1 - \frac{T_f}{T_c} = 1 - \frac{300\,\text{K}}{500\,\text{K}} = 1 - 0{,}600 = 0{,}400$$

Il lavoro è $W = \eta_{rev}\,Q_c = 0{,}400 \cdot 1500\,\text{J} = 600\,\text{J}$, e il calore ceduto $Q_f = Q_c - W = 1500\,\text{J} - 600\,\text{J} = 900\,\text{J}$. Controllo: $Q_f / Q_c = 900 / 1500 = 0{,}600$, uguale a $T_f / T_c$.
```

```ad-warning
Le temperature vanno in kelvin
Nella formula del rendimento compare un rapporto di temperature, e un rapporto cambia se si cambia scala. Con i gradi Celsius si ottengono numeri sbagliati, anche negativi o senza senso: prima si aggiunge $273$ a tutte e due le temperature, poi si fa il rapporto.
```

```ad-example
Esempio 3: il limite di una centrale
In una centrale termoelettrica il vapore entra in turbina a $550\,^\circ\text{C}$ e viene raffreddato con acqua a $30\,^\circ\text{C}$. Qual è il rendimento massimo che la centrale potrebbe avere?

Le temperature assolute sono $T_c = 550 + 273 = 823\,\text{K}$ e $T_f = 30 + 273 = 303\,\text{K}$:

$$\eta_{rev} = 1 - \frac{T_f}{T_c} = 1 - \frac{303\,\text{K}}{823\,\text{K}} = 1 - 0{,}368\ldots \approx 0{,}632$$

Nessuna centrale tra queste temperature può superare il $63\%$; quelle vere si fermano intorno al $40\%$. Con i gradi Celsius il conto darebbe $1 - 30/550 = 0{,}95$, un valore che non ha alcun significato.
```

Il teorema di Carnot serve anche da controllo: una macchina di cui si dichiarano prestazioni migliori di quelle di una macchina reversibile non può esistere, anche se il bilancio dell'energia torna.

```ad-example
Esempio 4: la macchina può esistere?
Un costruttore dichiara che la sua macchina, lavorando tra $400\,\text{K}$ e $300\,\text{K}$, assorbe $1000\,\text{J}$ per ciclo e compie $400\,\text{J}$ di lavoro. È possibile? E se il lavoro fosse di $200\,\text{J}$?

Il rendimento massimo tra queste temperature è

$$\eta_{rev} = 1 - \frac{300\,\text{K}}{400\,\text{K}} = 0{,}250$$

La macchina dichiarata ha $\eta = W / Q_c = 400 / 1000 = 0{,}400$, maggiore di $0{,}250$: viola il teorema di Carnot, e quindi il secondo principio. Non può esistere, anche se cedendo $600\,\text{J}$ rispetterebbe il primo principio.

Con $200\,\text{J}$ di lavoro il rendimento è $0{,}200$, minore di $0{,}250$: la macchina può esistere, ed è irreversibile.
```

```ad-warning
Il rendimento di Carnot è un massimo, non il rendimento della macchina
$1 - T_f / T_c$ è il rendimento di una macchina reversibile. Per una macchina reale, di cui si conoscono lavoro e calore, il rendimento si calcola sempre con $W / Q_c$, e il valore di Carnot è il tetto con cui confrontarlo.
```

La formula si usa anche al contrario, per trovare la temperatura che una sorgente deve avere. Da $\eta_{rev} = 1 - T_f / T_c$ si ricava $T_f / T_c = 1 - \eta_{rev}$, e quindi

$$T_c = \frac{T_f}{1 - \eta_{rev}} \qquad T_f = (1 - \eta_{rev})\,T_c$$

```ad-example
Esempio 5: la temperatura della sorgente calda
Una macchina reversibile cede calore all'ambiente, a $300\,\text{K}$. A quale temperatura deve trovarsi la sorgente calda perché il rendimento sia $0{,}600$?

$$T_c = \frac{T_f}{1 - \eta_{rev}} = \frac{300\,\text{K}}{1 - 0{,}600} = \frac{300\,\text{K}}{0{,}400} = 750\,\text{K}$$

cioè $477\,^\circ\text{C}$. Per arrivare a $0{,}900$ servirebbero $3000\,\text{K}$: i rendimenti alti chiedono sorgenti molto calde, ed è per questo che i motori lavorano alle temperature più alte che i materiali sopportano.
```

## Il ciclo di Carnot

La più semplice macchina reversibile è quella ideata da Carnot stesso. Usa un gas perfetto chiuso in un cilindro e due sole sorgenti. Per essere reversibile deve scambiare calore con una sorgente solo quando il gas ha la temperatura di quella sorgente, quindi lungo un'[isoterma](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma); e deve passare da una temperatura all'altra senza scambiare calore con niente, quindi lungo un'[adiabatica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/la-trasformazione-adiabatica). Il **ciclo di Carnot** è fatto di due isoterme e due adiabatiche:

1. da $A$ a $B$, **espansione isoterma** a temperatura $T_c$: il gas è a contatto con la sorgente calda, assorbe il calore $Q_c$ e compie lavoro;
2. da $B$ a $C$, **espansione adiabatica**: il gas è isolato, continua a espandersi e a compiere lavoro a spese della sua energia interna, e si raffredda da $T_c$ a $T_f$;
3. da $C$ a $D$, **compressione isoterma** a temperatura $T_f$: il gas è a contatto con la sorgente fredda, viene compresso e cede il calore $Q_f$;
4. da $D$ ad $A$, **compressione adiabatica**: il gas è di nuovo isolato, viene compresso e si riscalda da $T_f$ a $T_c$, tornando allo stato iniziale.

```tikz
% nome: ciclo-carnot-piano-pv
% alt: Il ciclo di Carnot nel piano pressione-volume, percorso in senso orario tra quattro stati. Da A a B un'isoterma alla temperatura Tc, lungo la quale entra il calore Qc; da B a C un'adiabatica più ripida che scende fino all'isoterma inferiore; da C a D l'isoterma alla temperatura Tf, lungo la quale esce il calore Qf; da D ad A un'altra adiabatica che risale. L'area racchiusa, colorata, è il lavoro W
% svg: ciclo-carnot-piano-pv-6baa6312.svg 273x233
% poi-interattivo: cambiare le due temperature e vedere come cambia l'area del ciclo
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (6,5);
\draw[->] (-0.3,0) -- (6.3,0) node[right] {$V$};
\draw[->] (0,-0.3) -- (0,5.3) node[above] {$p$};
\fill[blue!10] plot[domain=1:2.5, samples=25] (\x,{4.5/\x}) -- plot[domain=2.5:5.379, samples=30] (\x,{1.8*pow(2.5/\x,1.6667)}) -- plot[domain=5.379:2.152, samples=30] (\x,{2.7/\x}) -- plot[domain=2.152:1, samples=30] (\x,{4.5*pow(1/\x,1.6667)}) -- cycle;
\draw[thin, dashed, red!70!black] plot[domain=0.9:6, samples=40] (\x,{4.5/\x});
\draw[thin, dashed, blue!70!black] plot[domain=0.55:6, samples=40] (\x,{2.7/\x});
\draw[thick, domain=1:2.5, samples=25] plot (\x,{4.5/\x});
\draw[thick, domain=2.5:5.379, samples=30] plot (\x,{1.8*pow(2.5/\x,1.6667)});
\draw[thick, domain=2.152:5.379, samples=30] plot (\x,{2.7/\x});
\draw[thick, domain=1:2.152, samples=30] plot (\x,{4.5*pow(1/\x,1.6667)});
\draw[-{Stealth}, thick] (1.6,2.813) -- (1.65,2.727);
\draw[-{Stealth}, thick] (3.6,0.980) -- (3.7,0.936);
\draw[-{Stealth}, thick] (3.8,0.711) -- (3.7,0.730);
\draw[-{Stealth}, thick] (1.5,2.290) -- (1.46,2.395);
\fill (1,4.5) circle (1.5pt) node[left] {$A$};
\fill (2.5,1.8) circle (1.5pt) node[above right] {$B$};
\fill (5.379,0.502) circle (1.5pt) node[below] {$C$};
\fill (2.152,1.255) circle (1.5pt) node[below left] {$D$};
\draw[-{Stealth}, thick, orange!90!black] (2.5,3.8) -- (1.8,2.95);
\node[right] at (2.5,3.8) {$Q_c$};
\draw[-{Stealth}, thick, orange!90!black] (3.3,0.7) -- (2.9,0.15);
\node[right] at (3.15,0.35) {$Q_f$};
\node at (2.45,1.5) {$W$};
\node[above, red!70!black] at (5.7,0.8) {\small $T_c$};
\node[right, blue!70!black] at (6,0.45) {\small $T_f$};
\end{tikzpicture}
```

Nel piano pressione-volume le adiabatiche sono più ripide delle isoterme, e per questo le quattro curve si chiudono in un ciclo. L'area racchiusa è il lavoro compiuto in un ciclo, $W = Q_c - Q_f$. Ogni tratto è reversibile, quindi il rendimento del ciclo è quello del teorema di Carnot:

$$\eta = 1 - \frac{T_f}{T_c}$$

Il calore $Q_c$ entra tutto lungo l'isoterma $AB$. In un'isoterma l'energia interna del gas non cambia, e il calore assorbito è uguale al lavoro compiuto, che per $n$ moli di gas vale

$$Q_c = n R\,T_c \ln\frac{V_B}{V_A}$$

dove $\ln$ è il [logaritmo naturale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta), che si calcola con il tasto della calcolatrice.

```ad-example
Esempio 6: un ciclo di Carnot con mezza mole di gas
Un ciclo di Carnot è percorso da $0{,}500\,\text{mol}$ di gas perfetto tra le temperature di $500\,\text{K}$ e $300\,\text{K}$. Nell'espansione isoterma il volume del gas raddoppia. Quanto calore assorbe il gas, quanto lavoro compie in un ciclo e quanto calore cede? Usa $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$.

Il calore assorbito lungo l'isoterma a $500\,\text{K}$, con $V_B / V_A = 2$, è

$$Q_c = n R\,T_c \ln\frac{V_B}{V_A} = 0{,}500\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 500\,\text{K} \cdot \ln 2 = 1440{,}0\ldots\,\text{J} \approx 1{,}44 \cdot 10^3\,\text{J}$$

Il rendimento è quello dell'esempio 2, $\eta = 1 - 300/500 = 0{,}400$, quindi

$$W = \eta\,Q_c = 0{,}400 \cdot 1440\,\text{J} = 576\,\text{J} \qquad Q_f = Q_c - W = 1440\,\text{J} - 576\,\text{J} = 864\,\text{J}$$

Su $1440\,\text{J}$ presi dalla sorgente calda, $864\,\text{J}$ finiscono alla sorgente fredda, e non per un difetto della macchina: è il minimo che il secondo principio consente tra queste due temperature.
```

Nella figura qui sotto il ciclo di Carnot è disegnato in scala per un decimo di mole di gas, il cui volume raddoppia nell'espansione isoterma. Cambia le temperature delle due sorgenti e guarda l'area del ciclo e il rendimento. Partendo da $500\,\text{K}$ e $300\,\text{K}$, guadagni di più alzando di $50\,\text{K}$ la sorgente calda o abbassando di $50\,\text{K}$ quella fredda?

```interattivo
% nome: ciclo-carnot-temperature
% alt: Il ciclo di Carnot nel piano pressione-volume, con il volume in litri e la pressione in kilopascal, per un decimo di mole di gas perfetto monoatomico che parte da 1 litro e raddoppia il volume lungo l'isoterma calda. Due cursori cambiano la temperatura della sorgente calda, da 400 a 600 kelvin, e quella della sorgente fredda, da 250 a 350 kelvin; le due isoterme si spostano e il ciclo cambia forma e area. Una barra mostra il calore assorbito diviso tra lavoro e calore ceduto. Sotto sono scritti il rendimento, il calore assorbito, il lavoro e il calore ceduto
```

Abbassando la sorgente fredda a $250\,\text{K}$ il rendimento sale da $0{,}40$ a $1 - 250/500 = 0{,}50$; alzando quella calda a $550\,\text{K}$ arriva solo a $1 - 300/550 = 0{,}45$. A parità di variazione conta di più la sorgente fredda, perché sta al numeratore del rapporto $T_f / T_c$. In pratica però la sorgente fredda è quasi sempre l'ambiente, la cui temperatura non si sceglie, e si lavora su quella calda.

```ad-note
Da dove viene la formula del rendimento
Lungo le due isoterme il calore scambiato è uguale al lavoro: $Q_c = n R\,T_c \ln(V_B / V_A)$ e $Q_f = n R\,T_f \ln(V_C / V_D)$. Lungo le due adiabatiche vale la relazione tra temperatura e volume della trasformazione adiabatica, $T\,V^{\gamma - 1} = \text{costante}$: per $BC$ dà $T_c V_B^{\gamma - 1} = T_f V_C^{\gamma - 1}$, per $DA$ dà $T_c V_A^{\gamma - 1} = T_f V_D^{\gamma - 1}$. Dividendo la prima per la seconda le temperature si semplificano e resta $V_B / V_A = V_C / V_D$: i due logaritmi sono uguali. Quindi $Q_f / Q_c = T_f / T_c$, e $\eta = 1 - Q_f / Q_c = 1 - T_f / T_c$.
```

Una macchina di Carnot vera non si costruisce: per essere reversibile dovrebbe procedere con lentezza infinita, e la sua potenza sarebbe zero. Serve come termine di paragone, perché dice quanto del calore assorbito si potrebbe al massimo trasformare in lavoro e quanto di quello che una macchina reale perde è dovuto alle sue irreversibilità.

```ad-note
Il ciclo Otto del motore a benzina
Il motore a benzina a quattro tempi si descrive con un ciclo ideale diverso, il ciclo Otto, fatto di due adiabatiche e due trasformazioni a volume costante. Da $A$ a $B$ il pistone comprime la miscela di aria e benzina (adiabatica); da $B$ a $C$ la scintilla della candela la fa bruciare, e la pressione sale di colpo a volume costante: è qui che entra il calore $Q_c$; da $C$ a $D$ i gas caldi spingono il pistone (adiabatica); da $D$ ad $A$ la valvola di scarico si apre e la pressione crolla a volume costante: è qui che esce $Q_f$.

Il rendimento del ciclo ideale dipende dal rapporto di compressione $r = V_A / V_B$, il rapporto tra il volume massimo e il volume minimo del cilindro:

$$\eta = 1 - \frac{1}{r^{\gamma - 1}}$$

Per $r = 10$ e $\gamma = 1{,}40$, il valore dell'aria, viene $\eta = 1 - 10^{-0{,}40} = 0{,}60$. I motori reali rendono circa la metà, perché la combustione non è istantanea, ci sono attriti e una parte del calore passa alle pareti dei cilindri. Il ciclo Otto non scambia calore a due temperature fisse, e il suo rendimento è minore di quello di una macchina di Carnot che lavorasse tra la temperatura più alta e quella più bassa raggiunte dal gas.

```tikz
% nome: ciclo-otto-piano-pv
% alt: Il ciclo Otto nel piano pressione-volume, percorso in senso orario: da A a B una compressione adiabatica, dal volume massimo al volume minimo; da B a C un tratto verticale in cui la pressione sale a volume costante ed entra il calore Qc; da C a D un'espansione adiabatica fino al volume massimo; da D ad A un tratto verticale in cui la pressione scende a volume costante ed esce il calore Qf
% svg: ciclo-otto-piano-pv-ada70ec5.svg 235x195
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (5,4);
\draw[->] (-0.3,0) -- (5.3,0) node[right] {$V$};
\draw[->] (0,-0.3) -- (0,4.3) node[above] {$p$};
\fill[blue!10] plot[domain=1:4, samples=30] (\x,{3.6*pow(1/\x,1.4)}) -- (4,0.2) -- plot[domain=4:1, samples=30] (\x,{0.2*pow(4/\x,1.4)}) -- cycle;
\draw[thick, domain=1:4, samples=30] plot (\x,{3.6*pow(1/\x,1.4)});
\draw[thick, domain=1:4, samples=30] plot (\x,{0.2*pow(4/\x,1.4)});
\draw[thick] (1,1.393) -- (1,3.6);
\draw[thick] (4,0.517) -- (4,0.2);
\draw[-{Stealth}, thick] (2.05,1.318) -- (2.15,1.233);
\draw[-{Stealth}, thick] (2.3,0.434) -- (2.2,0.462);
\draw[-{Stealth}, thick] (1,2.4) -- (1,2.6);
\fill (4,0.2) circle (1.5pt) node[below right] {$A$};
\fill (1,1.393) circle (1.5pt) node[left] {$B$};
\fill (1,3.6) circle (1.5pt) node[left] {$C$};
\fill (4,0.517) circle (1.5pt) node[above] {$D$};
\draw[-{Stealth}, thick, orange!90!black] (0.2,2.5) -- (0.9,2.5);
\node[above] at (0.45,2.5) {$Q_c$};
\draw[-{Stealth}, thick, orange!90!black] (4.1,0.36) -- (4.8,0.36);
\node[right] at (4.8,0.36) {$Q_f$};
\node at (2.0,0.85) {$W$};
\end{tikzpicture}
```
```
