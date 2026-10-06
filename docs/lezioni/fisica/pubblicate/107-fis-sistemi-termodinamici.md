# Sistemi termodinamici e principio zero

Il tè in un thermos resta caldo per ore, quello in una tazza si raffredda in pochi minuti, e l'acqua di una pentola senza coperchio, lasciata sul fuoco, poco alla volta se ne va. La differenza sta in quello che ciascuno dei tre può scambiare con ciò che lo circonda. La termodinamica studia proprio gli scambi di energia tra un corpo e il resto del mondo, e lo fa senza seguire le molecole una per una: le bastano poche grandezze misurabili, come la pressione, il volume e la temperatura. Prima di scrivere le sue leggi serve il suo vocabolario.

## Sistema, ambiente, universo

Un **sistema termodinamico** è la porzione di materia che si decide di studiare: il gas chiuso in un cilindro, l'acqua di una pentola, l'aria di una stanza. Tutto quello che non fa parte del sistema e che può interagire con esso è l'**ambiente**. Sistema e ambiente, insieme, formano l'**universo** termodinamico.

Il sistema è separato dall'ambiente da un confine. Può essere una parete vera, come quelle del cilindro, o una superficie immaginaria, come quella che racchiude l'aria di una stanza con la finestra aperta. La scelta del sistema spetta a chi studia il problema: nel cilindro con il pistone si può prendere come sistema il solo gas, e allora cilindro e pistone fanno parte dell'ambiente.

```tikz
% nome: sistema-ambiente-universo
% alt: Un cilindro con un pistone che racchiude un gas. Il gas, circondato da una linea tratteggiata, è il sistema; tutto quello che sta fuori, compresi il cilindro e il pistone, è l'ambiente; una cornice esterna che contiene tutto è l'universo
% svg: sistema-ambiente-universo-8f18f1af.svg 247x163
\begin{tikzpicture}
\draw[thin] (-1.9,-0.7) rectangle (4.5,3.5);
\node[below right] at (-1.9,3.5) {\small universo};
\fill[blue!10] (0,0) rectangle (2.6,1.6);
\draw[thick] (0,2.6) -- (0,0) -- (2.6,0) -- (2.6,2.6);
\draw[thick, fill=gray!20] (0,1.6) rectangle (2.6,1.85);
\draw[thick] (1.3,1.85) -- (1.3,2.9);
\draw[dashed, thick, orange!90!black] (0.12,0.12) rectangle (2.48,1.48);
\node at (1.3,0.8) {gas};
\draw[thin] (2.48,0.8) -- (3.0,0.8) node[right] {\small sistema};
\node[right] at (3.0,2.3) {\small ambiente};
\node[right] at (-1.8,1.1) {\small ambiente};
\end{tikzpicture}
```

### Sistemi aperti, chiusi e isolati

Attraverso il confine possono passare due cose: materia ed energia. L'energia passa come calore, se sistema e ambiente hanno temperature diverse, oppure come lavoro, se il confine si sposta. Secondo quello che lasciano passare, i sistemi sono di tre tipi.

| Sistema | Scambia materia | Scambia energia | Esempio |
|---|---|---|---|
| aperto | sì | sì | l'acqua che bolle in una pentola senza coperchio |
| chiuso | no | sì | il gas in un cilindro chiuso da un pistone |
| isolato | no | no | il tè in un thermos perfetto |

```tikz
% nome: sistemi-aperto-chiuso-isolato
% alt: Tre recipienti affiancati. Il primo, una pentola senza coperchio, è un sistema aperto: una freccia verso l'alto indica la materia che esce e una freccia dal basso l'energia che entra. Il secondo, una pentola con il coperchio, è un sistema chiuso: resta solo la freccia dell'energia. Il terzo, un recipiente con doppia parete, è un sistema isolato: nessuna freccia lo attraversa
% svg: sistemi-aperto-chiuso-isolato-74f66c5f.svg 269x180
\begin{tikzpicture}
\fill[cyan!20] (0.1,0) rectangle (1.7,0.9);
\draw[thin] (0.1,0.9) -- (1.7,0.9);
\draw[thick] (0.1,1.4) -- (0.1,0) -- (1.7,0) -- (1.7,1.4);
\draw[-{Stealth}, thick, blue] (0.9,1.0) -- (0.9,2.0) node[above] {\small materia};
\draw[-{Stealth}, thick, red] (0.9,-0.9) -- (0.9,-0.1);
\node[below] at (0.9,-0.9) {\small energia};
\node at (0.9,3.0) {aperto};
\fill[cyan!20] (2.7,0) rectangle (4.3,0.9);
\draw[thin] (2.7,0.9) -- (4.3,0.9);
\draw[thick] (2.7,1.4) -- (2.7,0) -- (4.3,0) -- (4.3,1.4);
\draw[thick, fill=gray!20] (2.6,1.4) rectangle (4.4,1.55);
\draw[-{Stealth}, thick, red] (3.5,-0.9) -- (3.5,-0.1);
\node[below] at (3.5,-0.9) {\small energia};
\node at (3.5,3.0) {chiuso};
\fill[gray!20, even odd rule] (5.1,-0.2) rectangle (7.1,1.75) (5.3,0) rectangle (6.9,1.55);
\fill[cyan!20] (5.3,0) rectangle (6.9,0.9);
\draw[thin] (5.3,0.9) -- (6.9,0.9);
\draw[thick] (5.1,-0.2) rectangle (7.1,1.75);
\draw[thick] (5.3,0) rectangle (6.9,1.55);
\node at (6.1,3.0) {isolato};
\end{tikzpicture}
```

Un sistema isolato è un caso ideale: nessun thermos è perfetto, e dopo un giorno il tè è freddo. Su tempi brevi però un buon thermos o un [calorimetro](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/l-equilibrio-termico-e-il-calorimetro) si comportano quasi come sistemi isolati. L'universo termodinamico, che non ha un ambiente con cui scambiare, è isolato per definizione.

Anche le pareti hanno un nome secondo quello che lasciano passare. Una parete che non lascia passare il calore è **adiabatica** (il doppio vetro con il vuoto in mezzo del thermos); una che lo lascia passare è **diatermica**, o conduttrice (il metallo di una pentola). Una parete può poi essere rigida oppure mobile, come un pistone, e in questo secondo caso il sistema può scambiare lavoro con l'ambiente.

```ad-example
Esempio 1: che tipo di sistema è
Classifica questi sistemi: una tazza di tè fumante; una bottiglia d'acqua chiusa messa in frigorifero; un palloncino gonfio e annodato lasciato al sole; una persona.

- Il tè nella tazza è un sistema aperto: cede calore all'aria e perde materia, il vapore che sale.
- L'acqua nella bottiglia chiusa è un sistema chiuso: il tappo trattiene la materia, ma l'acqua cede calore attraverso la plastica e si raffredda.
- Il gas nel palloncino è un sistema chiuso: non esce né entra gas, ma il gas riceve calore dal sole e, gonfiandosi, sposta la gomma e compie lavoro.
- Una persona è un sistema aperto: respira, mangia, suda, e scambia calore con l'aria.
```

```ad-warning
Chiuso non vuol dire isolato
Un sistema chiuso non scambia materia, ma l'energia sì: una lattina sigillata lasciata al sole si scalda. Solo il sistema isolato non scambia né materia né energia.
```

## Lo stato di un sistema

Per descrivere il gas in un cilindro non servono le posizioni e le velocità delle sue molecole, che sono dell'ordine di $10^{23}$. Bastano poche grandezze che riguardano il gas nel suo insieme e che si misurano dall'esterno: la pressione $p$, il volume $V$, la temperatura $T$ e la quantità di gas, cioè il numero di moli $n$. Si chiamano **variabili di stato**, o coordinate termodinamiche, e l'insieme dei loro valori in un certo istante è lo **stato** del sistema.

Il valore di una variabile di stato dipende solo dallo stato in cui il sistema si trova, e non da come ci è arrivato: un gas a $300\,\text{K}$ è lo stesso gas sia che sia stato scaldato da $280\,\text{K}$, sia che sia stato raffreddato da $350\,\text{K}$.

Le variabili di stato si dividono in due famiglie. Quelle **estensive** dipendono dalla quantità di materia: se unisci due sistemi uguali raddoppiano, come il volume e il numero di moli. Quelle **intensive** non ne dipendono: unendo due litri d'aria alla stessa pressione e alla stessa temperatura ottieni quattro litri d'aria con la pressione e la temperatura di prima.

### L'equazione di stato e il piano pressione-volume

Le variabili di stato non sono tutte indipendenti: le lega l'equazione di stato del sistema. Per il gas perfetto è l'[equazione di stato](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto)

$$p\,V = n\,R\,T$$

con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$. Per una quantità fissata di gas, note due variabili la terza è determinata. Lo stato si può allora rappresentare con un punto in un piano cartesiano che ha il volume in ascissa e la pressione in ordinata, il **piano pressione-volume**: a ogni punto corrispondono una pressione, un volume e, per l'equazione di stato, una temperatura.

```ad-example
Esempio 2: due stati dello stesso gas
In un cilindro ci sono $0{,}500\,\text{mol}$ di gas perfetto. Nello stato $A$ il gas occupa $12{,}0\,\text{L}$ alla pressione di $1{,}01 \cdot 10^{5}\,\text{Pa}$; nello stato $B$ occupa $6{,}00\,\text{L}$ a $2{,}50 \cdot 10^{5}\,\text{Pa}$. Qual è la temperatura nei due stati?

I volumi vanno in metri cubi: $V_A = 12{,}0 \cdot 10^{-3}\,\text{m}^3$ e $V_B = 6{,}00 \cdot 10^{-3}\,\text{m}^3$.

$$T_A = \frac{p_A\,V_A}{n\,R} = \frac{1{,}01 \cdot 10^{5}\,\text{Pa} \cdot 12{,}0 \cdot 10^{-3}\,\text{m}^3}{0{,}500\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)}} = \frac{1212\,\text{J}}{4{,}155\,\text{J/K}} = 291{,}6\ldots\,\text{K} \approx 292\,\text{K}$$

$$T_B = \frac{p_B\,V_B}{n\,R} = \frac{2{,}50 \cdot 10^{5}\,\text{Pa} \cdot 6{,}00 \cdot 10^{-3}\,\text{m}^3}{4{,}155\,\text{J/K}} = \frac{1500\,\text{J}}{4{,}155\,\text{J/K}} = 361{,}0\ldots\,\text{K} \approx 361\,\text{K}$$

Nel piano pressione-volume i due stati sono i punti $A$ e $B$ della figura. Le due curve tratteggiate uniscono tutti gli stati che hanno la stessa temperatura di $A$ e di $B$.
```

```tikz
% nome: piano-pressione-volume-due-stati
% alt: Il piano pressione-volume con il volume in litri in ascissa, da 0 a 16, e la pressione in ordinata, da 0 a 3 per 10 alla quinta pascal. Il punto A ha volume 12 litri e pressione 1,01 per 10 alla quinta pascal; il punto B ha volume 6 litri e pressione 2,50 per 10 alla quinta pascal. Per ciascun punto passa una curva tratteggiata che scende verso destra: quella per A è segnata 292 kelvin, quella per B, più in alto, 361 kelvin
% svg: piano-pressione-volume-due-stati-f4d51b3f.svg 277x241
% poi-interattivo: trascinare il punto dello stato nel piano e leggere pressione, volume e temperatura
\begin{tikzpicture}[scale=0.72]
\draw[gray!25, very thin] (0,0) grid (8,6);
\draw[->] (0,0) -- (8.5,0);
\node[below] at (8.0,-0.55) {$V$ (L)};
\draw[->] (0,0) -- (0,6.5) node[above] {$p$ ($10^5$ Pa)};
\foreach \x/\t in {2/4,4/8,6/12,8/16} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {2/1,4/2,6/3} \node[left] at (0,\y) {\small $\t$};
\draw[thin, dashed, domain=2.02:8, samples=50, smooth] plot (\x, {12.12/\x});
\draw[thin, dashed, domain=2.5:8, samples=50, smooth] plot (\x, {15/\x});
\node[below] at (7.1,1.6) {\small $292$ K};
\node[above] at (7.1,2.2) {\small $361$ K};
\fill (6,2.02) circle (0.08);
\fill (3,5) circle (0.08);
\node[below left, inner sep=2pt] at (6,2.02) {$A$};
\node[above right, inner sep=2pt] at (3,5) {$B$};
\end{tikzpicture}
```

```ad-warning
Le unità nell'equazione di stato
Con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$ la pressione va in pascal, il volume in metri cubi e la temperatura in kelvin. Sugli assi di un grafico il volume è spesso in litri e la pressione in $10^5\,\text{Pa}$ o in atmosfere: prima di fare il conto si converte, $1\,\text{L} = 10^{-3}\,\text{m}^3$ e $1\,\text{atm} = 1{,}01 \cdot 10^{5}\,\text{Pa}$.
```

## L'equilibrio termodinamico

Dire "la pressione del gas" o "la temperatura del gas" ha senso solo se in tutto il gas la pressione e la temperatura hanno lo stesso valore, e se questo valore non cambia nel tempo. Un sistema in queste condizioni è in **equilibrio termodinamico**, che richiede tre equilibri insieme.

- Equilibrio meccanico: non ci sono forze non equilibrate, né dentro il sistema né tra il sistema e l'ambiente. In un gas vuol dire che la pressione è la stessa in tutti i punti e che un pistone mobile sta fermo.
- Equilibrio termico: la temperatura è la stessa in tutti i punti del sistema, e uguale a quella dell'ambiente se le pareti lasciano passare il calore.
- Equilibrio chimico: la composizione non cambia, cioè non sono in corso reazioni chimiche o passaggi di stato.

Uno stato di equilibrio è l'unico che si possa descrivere con un valore per ciascuna variabile, e quindi l'unico che si possa disegnare come un punto nel piano pressione-volume. Un gas appena compresso da un colpo secco sul pistone non è in equilibrio: vicino al pistone è più denso che sul fondo, e per qualche istante "la pressione del gas" non esiste, perché ce ne sono tante. Lasciato a sé stesso, il gas torna da solo all'equilibrio: gli [urti tra le molecole](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-teoria-cinetica-dei-gas) ridistribuiscono in fretta la materia e l'energia.

```ad-example
Esempio 3: dove si ferma il pistone
Un cilindro orizzontale lungo $60{,}0\,\text{cm}$, con le basi chiuse, è diviso in due parti da un pistone che scorre senza attrito e conduce il calore. A sinistra ci sono $0{,}20\,\text{mol}$ di gas perfetto, a destra $0{,}30\,\text{mol}$. Dove si ferma il pistone?

All'equilibrio il pistone è fermo, quindi le due pressioni sono uguali (equilibrio meccanico); il pistone conduce il calore, quindi anche le due temperature sono uguali (equilibrio termico). Dall'equazione di stato, scritta per le due parti e divisa membro a membro:

$$\frac{p\,V_1}{p\,V_2} = \frac{n_1\,R\,T}{n_2\,R\,T} \qquad\Rightarrow\qquad \frac{V_1}{V_2} = \frac{n_1}{n_2} = \frac{0{,}20}{0{,}30} = \frac{2}{3}$$

I volumi stanno come i numeri di moli, e poiché la sezione è la stessa stanno così anche le lunghezze. Su $60{,}0\,\text{cm}$ in tutto:

$$l_1 = \frac{2}{5} \cdot 60{,}0\,\text{cm} = 24{,}0\,\text{cm} \qquad\qquad l_2 = \frac{3}{5} \cdot 60{,}0\,\text{cm} = 36{,}0\,\text{cm}$$

Il pistone si ferma a $24{,}0\,\text{cm}$ dalla base di sinistra. Non è servito conoscere né la temperatura né la sezione del cilindro.
```

```tikz
% nome: cilindro-due-gas-pistone-equilibrio
% alt: Un cilindro orizzontale lungo 60 centimetri, chiuso alle due estremità e diviso da un pistone. La parte di sinistra, lunga 24 centimetri, contiene 0,20 moli di gas; la parte di destra, lunga 36 centimetri, ne contiene 0,30. Sul pistone due frecce uguali e opposte indicano le forze dei due gas
% svg: cilindro-due-gas-pistone-equilibrio-1a55df2e.svg 239x87
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (2.4,1.4);
\fill[orange!25] (2.6,0) rectangle (6.2,1.4);
\draw[thick] (0,0) rectangle (6.2,1.4);
\draw[thick, fill=gray!20] (2.4,0) rectangle (2.6,1.4);
\node at (1.2,1.0) {\small $0{,}20$ mol};
\node at (4.4,1.0) {\small $0{,}30$ mol};
\draw[-{Stealth}, thick, red] (1.6,0.45) -- (2.4,0.45);
\draw[-{Stealth}, thick, red] (3.4,0.45) -- (2.6,0.45);
\draw[{Stealth}-{Stealth}, thin] (0,-0.3) -- (2.5,-0.3) node[midway, below] {\small $24{,}0$ cm};
\draw[{Stealth}-{Stealth}, thin] (2.5,-0.3) -- (6.2,-0.3) node[midway, below] {\small $36{,}0$ cm};
\end{tikzpicture}
```

## Le trasformazioni

Una **trasformazione termodinamica** è il passaggio di un sistema da uno stato di equilibrio a un altro: un gas che viene compresso, scaldato, lasciato espandere. Tra lo stato iniziale e quello finale il sistema può passare per stati di equilibrio oppure no, e la differenza conta.

Una trasformazione è **quasistatica** se avviene così lentamente che in ogni istante il sistema è, con ottima approssimazione, in equilibrio. Il gas ha allora in ogni istante una pressione, un volume e una temperatura ben definiti, e la trasformazione è una successione di stati di equilibrio: nel piano pressione-volume è una linea continua che unisce il punto iniziale a quello finale. Si ottiene, per esempio, comprimendo il gas con granelli di sabbia aggiunti uno alla volta sul pistone.

Una trasformazione brusca non è quasistatica. Se sul pistone si lascia cadere un peso, tra lo stato iniziale e quello finale il gas passa per stati che non sono di equilibrio, senza una pressione e una temperatura definite. Nel piano pressione-volume si possono segnare solo i due punti estremi; quello che sta in mezzo non si può disegnare.

```tikz
% nome: trasformazione-quasistatica-e-brusca
% alt: Due piani pressione-volume affiancati con gli stessi stati A, a volume grande e pressione bassa, e B, a volume piccolo e pressione alta. A sinistra, trasformazione quasistatica: una linea continua con una freccia porta da A a B. A destra, trasformazione brusca: ci sono solo i due punti, senza nessuna linea che li unisca
% svg: trasformazione-quasistatica-e-brusca-05de3d25.svg 277x163
\begin{tikzpicture}[scale=0.85]
\draw[->] (0,0) -- (3.6,0) node[below left] {$V$};
\draw[->] (0,0) -- (0,3.6) node[left] {$p$};
\draw[thick, blue!60, domain=1:3, samples=40, smooth] plot (\x, {3/\x});
\draw[-{Stealth}, thick, blue!60] (1.8,1.667) -- (1.65,1.818);
\fill (3,1) circle (0.07) node[above right] {$A$};
\fill (1,3) circle (0.07) node[above right] {$B$};
\node[below] at (1.8,-0.5) {\small quasistatica};
\draw[->] (4.4,0) -- (8.0,0) node[below left] {$V$};
\draw[->] (4.4,0) -- (4.4,3.6) node[left] {$p$};
\fill (7.4,1) circle (0.07) node[above right] {$A$};
\fill (5.4,3) circle (0.07) node[above right] {$B$};
\node[below] at (6.2,-0.5) {\small brusca};
\end{tikzpicture}
```

Nella figura qui sotto un gas a temperatura costante viene compresso da $4{,}0\,\text{L}$ a $2{,}0\,\text{L}$ in due modi. Prima di provare, chiediti: perché la compressione lenta si può disegnare con una linea nel piano pressione-volume e quella brusca no? Guarda quante molecole ci sono nelle due metà del cilindro mentre il pistone si muove.

```interattivo
% nome: compressione-lenta-e-brusca
% alt: Un cilindro orizzontale con le molecole di un gas e un pistone a destra; sopra le due metà del gas è scritto quante molecole contengono. Due bottoni comprimono il gas da 4 a 2 litri: piano, e allora le molecole restano distribuite in modo uniforme e nel piano pressione-volume disegnato sotto il punto dello stato scorre lungo una curva da A a B; di colpo, e allora le molecole si ammassano contro il pistone, il punto sparisce e ricompare in B solo quando il gas è tornato uniforme. Un terzo bottone riporta il pistone alla partenza
```

Con la compressione lenta le molecole fanno in tempo a ridistribuirsi: le due metà del gas ne contengono sempre circa lo stesso numero, la pressione è la stessa dappertutto e in ogni istante c'è un punto da segnare. Con la compressione brusca il pistone spinge davanti a sé le molecole che incontra: per un momento la metà vicina al pistone ne contiene molte più dell'altra, la pressione non ha un valore unico e sul grafico non c'è niente da segnare, finché gli urti non riportano l'equilibrio nello stato $B$.

Le trasformazioni quasistatiche più semplici di un gas, a pressione, a volume o a temperatura costante, sono l'argomento della lezione [Le trasformazioni isocora, isobara e isoterma](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma).

```ad-example
Esempio 4: due bombole collegate
Due bombole rigide sono collegate da un tubo sottile con un rubinetto chiuso. La prima ha volume $2{,}0\,\text{L}$ e contiene gas a $1{,}5 \cdot 10^{5}\,\text{Pa}$; la seconda ha volume $3{,}0\,\text{L}$ e contiene lo stesso gas a $1{,}0 \cdot 10^{5}\,\text{Pa}$. Tutte e due sono alla temperatura della stanza. Che cosa succede aprendo il rubinetto? Quale pressione si legge alla fine?

Le temperature sono uguali, quindi c'è equilibrio termico; le pressioni no, quindi manca l'equilibrio meccanico. Aperto il rubinetto, il gas passa dalla bombola a pressione più alta all'altra finché le pressioni diventano uguali. La trasformazione non è quasistatica, ma lo stato finale è di equilibrio e l'equazione di stato vale.

Il numero totale di moli non cambia e la temperatura finale è quella della stanza, come all'inizio. Poiché $n = p\,V / (R\,T)$, con $R\,T$ uguale in tutti i termini:

$$p_f\,(V_1 + V_2) = p_1\,V_1 + p_2\,V_2$$

$$p_f = \frac{p_1\,V_1 + p_2\,V_2}{V_1 + V_2} = \frac{1{,}5 \cdot 10^{5}\,\text{Pa} \cdot 2{,}0\,\text{L} + 1{,}0 \cdot 10^{5}\,\text{Pa} \cdot 3{,}0\,\text{L}}{5{,}0\,\text{L}} = 1{,}2 \cdot 10^{5}\,\text{Pa}$$

I volumi possono restare in litri, perché compaiono sopra e sotto la frazione. La pressione finale sta tra le due di partenza, più vicina a quella della bombola più grande.
```

## Il principio zero della termodinamica

Due sistemi messi a contatto attraverso una parete che conduce il calore si scambiano calore finché non raggiungono la stessa temperatura: da quel momento sono in [equilibrio termico](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/l-equilibrio-termico-e-il-calorimetro). Il **principio zero della termodinamica** riguarda tre sistemi:

> Se un sistema $A$ è in equilibrio termico con un sistema $C$, e anche un sistema $B$ è in equilibrio termico con $C$, allora $A$ e $B$ sono in equilibrio termico tra loro.

```tikz
% nome: principio-zero-tre-sistemi
% alt: Tre sistemi disegnati come rettangoli: A a sinistra, B a destra e C in basso al centro. Una linea continua unisce A a C e un'altra B a C, con la scritta in equilibrio; una linea tratteggiata unisce A a B, con la scritta quindi in equilibrio
% svg: principio-zero-tre-sistemi-cc88da9b.svg 280x110
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,1.8) rectangle (1.4,2.8);
\node at (0.7,2.3) {$A$};
\draw[thick, fill=blue!10] (5.2,1.8) rectangle (6.6,2.8);
\node at (5.9,2.3) {$B$};
\draw[thick, fill=orange!25] (2.6,0) rectangle (4.0,1);
\node at (3.3,0.5) {$C$};
\draw[thick] (0.9,1.8) -- (2.6,0.7);
\draw[thick] (5.7,1.8) -- (4.0,0.7);
\draw[thick, dashed] (1.4,2.3) -- (5.2,2.3);
\node[above] at (3.3,2.3) {\small quindi in equilibrio};
\node[below left] at (1.6,1.2) {\small in equilibrio};
\node[below right] at (5.0,1.2) {\small in equilibrio};
\end{tikzpicture}
```

Sembra un'ovvietà, ma è una legge che viene dall'esperienza e non si può dedurre dalle altre. Dice che esiste una grandezza che i sistemi in equilibrio termico hanno in comune, e questa grandezza è la temperatura: due sistemi sono in equilibrio termico se e solo se hanno la stessa temperatura. È il principio zero a dare senso al [termometro](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche), che fa la parte del sistema $C$: se segna lo stesso valore a contatto con $A$ e a contatto con $B$, allora $A$ e $B$ hanno la stessa temperatura, anche se non si sono mai toccati.

```ad-example
Esempio 5: prevedere senza mettere a contatto
Un termometro, lasciato a lungo in un bicchiere d'acqua, segna $24{,}5\,^\circ\text{C}$. Lo stesso termometro, appoggiato a un blocco di ferro, segna $24{,}5\,^\circ\text{C}$; immerso in una tazza di latte, segna $31{,}0\,^\circ\text{C}$. Che cosa succede se il blocco di ferro viene immerso nell'acqua? E se viene immerso nel latte?

L'acqua è in equilibrio termico con il termometro quando segna $24{,}5\,^\circ\text{C}$, e così il ferro. Per il principio zero acqua e ferro sono in equilibrio termico tra loro: messi a contatto non si scambiano calore, e le temperature restano quelle.

Il latte è a una temperatura diversa, quindi con il ferro non è in equilibrio termico: il calore passa dal latte, più caldo, al ferro, finché i due raggiungono una temperatura comune, compresa tra $24{,}5\,^\circ\text{C}$ e $31{,}0\,^\circ\text{C}$.
```

```ad-warning
Equilibrio termico non vuol dire stessa energia
Due sistemi in equilibrio termico hanno la stessa temperatura, non la stessa energia e nemmeno la stessa pressione: una vasca d'acqua e un cucchiaino alla stessa temperatura sono in equilibrio termico, anche se la vasca ha molta più energia.
```

```ad-note
Perché si chiama principio zero
Il primo e il secondo principio della termodinamica sono dell'Ottocento. Solo dopo ci si accorse che entrambi usano la temperatura, e che per definirla serve questa legge: il fisico inglese Ralph Fowler, negli anni Trenta del Novecento, la chiamò principio zero perché viene logicamente prima degli altri, che avevano già il loro numero.
```
