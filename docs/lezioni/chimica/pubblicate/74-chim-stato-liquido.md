# Lo stato liquido e la tensione di vapore

Il miele scende dal cucchiaio lentamente e l'acqua scorre via; una goccia d'alcol sulla pelle sparisce in pochi secondi e una d'acqua resta lì per minuti; in alta montagna l'acqua bolle prima di arrivare a $100\,^\circ\text{C}$. Hanno tutti la stessa origine: le [forze intermolecolari](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/forze-dipolo-dipolo-e-forze-di-london), cioè quanto forte si attraggono le particelle del liquido.

## Le particelle di un liquido

In un liquido le particelle sono vicine quasi quanto in un solido, e per questo un liquido ha un volume proprio e si comprime pochissimo. A differenza di un solido, però, le particelle non hanno posti fissi: scorrono le une sulle altre, e il liquido prende la forma del recipiente. È il quadro del [modello particellare](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/il-modello-particellare-della-materia), che ora si può leggere in termini di forze.

Lo stato liquido è un equilibrio tra due tendenze. Le forze intermolecolari tengono le particelle vicine; l'agitazione termica, cioè il loro movimento disordinato, che cresce con la temperatura, tende a separarle. Nel liquido le forze sono abbastanza intense da impedire alle particelle di allontanarsi, ma non abbastanza da bloccarle. Ogni proprietà di questa lezione misura, in un modo diverso, quanto sono intense quelle forze.

## La viscosità

La **viscosità** è la resistenza che un liquido oppone allo scorrimento. Il miele e l'olio sono molto viscosi, l'acqua e l'alcol poco. Si indica con $\eta$ e nel Sistema Internazionale si misura in pascal per secondo, $\text{Pa} \cdot \text{s}$; per i liquidi comuni si usa il millesimo, $\text{mPa} \cdot \text{s}$.

Perché un liquido scorra, i suoi strati devono scivolare l'uno sull'altro, e le particelle di uno strato devono staccarsi da quelle dello strato vicino. La viscosità dipende quindi da tre cose.

- Le forze intermolecolari: più sono intense, più il liquido è viscoso. Il glicerolo (la glicerina), $\mathrm{C_3H_8O_3}$, ha tre gruppi $\mathrm{OH}$ per molecola e forma molti [legami a idrogeno](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/il-legame-a-idrogeno): è più di mille volte più viscoso dell'acqua.
- La forma delle molecole: le molecole lunghe, come quelle degli oli, si intrecciano tra loro e scorrono con più difficoltà di quelle piccole e compatte.
- La temperatura: scaldando un liquido le particelle si muovono di più e vincono più facilmente le attrazioni, e la viscosità diminuisce. Il miele tiepido cola più in fretta di quello freddo.

| Liquido | Viscosità a $20\,^\circ\text{C}$ ($\text{mPa} \cdot \text{s}$) |
|---|---|
| etere dietilico | $0{,}23$ |
| acetone | $0{,}32$ |
| acqua | $1{,}00$ |
| etanolo | $1{,}20$ |
| mercurio | $1{,}55$ |
| glicerolo | circa $1400$ |

```tikz
% nome: liquido-viscosita-sfere-cilindri
% alt: Due cilindri di vetro pieni di liquido, in ciascuno dei quali è stata lasciata cadere una sferetta nello stesso istante. Nel cilindro di sinistra, con acqua, la sferetta è quasi arrivata sul fondo. In quello di destra, con glicerolo, la sferetta ha percorso solo un breve tratto. Una linea tratteggiata segna in tutti e due il punto di partenza
% svg: liquido-viscosita-sfere-cilindri-749dff38.svg 298x159
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (1.2,3.2);
\draw[thick] (0,3.5) -- (0,0) -- (1.2,0) -- (1.2,3.5);
\draw[thin] (0,3.2) -- (1.2,3.2);
\draw[thin, dashed] (-0.15,3.0) -- (1.35,3.0);
\draw[thick, fill=gray!60] (0.6,0.45) circle (0.15);
\draw[-{Stealth}, thick] (0.6,2.85) -- (0.6,0.72);
\node at (0.6,-0.35) {\small acqua};
\begin{scope}[shift={(2.8,0)}]
\fill[yellow!20] (0,0) rectangle (1.2,3.2);
\draw[thick] (0,3.5) -- (0,0) -- (1.2,0) -- (1.2,3.5);
\draw[thin] (0,3.2) -- (1.2,3.2);
\draw[thin, dashed] (-0.15,3.0) -- (1.35,3.0);
\draw[thick, fill=gray!60] (0.6,2.45) circle (0.15);
\draw[-{Stealth}, thick] (0.6,2.92) -- (0.6,2.68);
\node at (0.6,-0.35) {\small glicerolo};
\end{scope}
\node[right] at (4.4,3.0) {\small partenza};
\node[right] at (4.4,1.6) {\small dopo lo stesso tempo};
\end{tikzpicture}
```

Un modo per confrontare due viscosità è lasciar cadere due sferette uguali nei due liquidi: nel liquido più viscoso la sferetta scende più lentamente.

```ad-warning
Viscoso non vuol dire denso
La viscosità misura quanto un liquido fatica a scorrere, la densità quanta massa c'è in un certo volume. L'olio è più viscoso dell'acqua ma è meno denso, tanto che ci galleggia sopra. Il mercurio è tredici volte più denso dell'acqua e ha una viscosità di poco superiore.
```

## La tensione superficiale

Una particella all'interno del liquido è attirata dalle vicine in tutte le direzioni; una particella della superficie ha vicine solo di lato e sotto, ed è tirata verso l'interno. La superficie si comporta come una pellicola tesa, che tende a diventare più piccola possibile. Questa proprietà è la **tensione superficiale**, che la lezione [Le proprietà fisiche dell'acqua](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/le-proprieta-fisiche-dell-acqua) descrive per l'acqua, con la figura delle forze sulle due molecole.

La tensione superficiale si indica con $\gamma$ e misura l'energia che serve per allargare la superficie del liquido di un metro quadrato; la sua unità è il newton al metro, e per i liquidi comuni si usa il millesimo, $\text{mN/m}$. Per portare una particella dall'interno alla superficie bisogna staccarla da una parte delle sue vicine: più le forze intermolecolari sono intense, più energia serve, e più alta è la tensione superficiale.

| Liquido | Tensione superficiale a $20\,^\circ\text{C}$ ($\text{mN/m}$) | Forze tra le particelle |
|---|---|---|
| etere dietilico | $17$ | London e dipolo-dipolo |
| etanolo | $22$ | anche legami a idrogeno, uno per molecola |
| acqua | $73$ | legami a idrogeno, fino a quattro per molecola |
| mercurio | $485$ | legame metallico |

Il mercurio, che è un metallo liquido, ha atomi uniti dal [legame metallico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-metallico), molto più forte di qualunque forza intermolecolare: le sue gocce restano quasi sferiche anche su un tavolo. La sfera è la forma che, a parità di volume, ha la superficie più piccola, ed è la forma che ogni goccia prenderebbe se non ci fosse il peso a schiacciarla.

Come la viscosità, la tensione superficiale diminuisce quando la temperatura sale.

## Coesione, adesione e capillarità

Quando un liquido tocca un solido entrano in gioco due attrazioni: la **coesione**, tra le particelle del liquido, e l'**adesione**, tra le particelle del liquido e quelle del solido. Dal loro confronto dipende se il liquido bagna il solido.

```tikz
% nome: liquido-goccia-bagna-non-bagna
% alt: Due gocce d'acqua appoggiate su due superfici orizzontali. A sinistra, su vetro pulito, la goccia è larga e schiacciata: l'adesione prevale e l'acqua bagna il vetro. A destra, su una superficie coperta di cera, la goccia è quasi sferica e tocca la superficie in una zona piccola: prevale la coesione e l'acqua non bagna la cera
% svg: liquido-goccia-bagna-non-bagna-f6f558cc.svg 296x72
\begin{tikzpicture}
\draw[thick] (-1.6,0) -- (1.6,0);
\foreach \x in {-1.45,-1.3,...,1.6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=cyan!20] (-1.1,0) arc (180:0:1.1 and 0.32) -- cycle;
\node at (0,-0.5) {\small vetro: l'acqua bagna};
\begin{scope}[shift={(4.3,0)}]
\draw[thick] (-1.6,0) -- (1.6,0);
\foreach \x in {-1.45,-1.3,...,1.6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=cyan!20] (0.26,0) arc (-60:240:0.52) -- cycle;
\node at (0,-0.5) {\small cera: l'acqua non bagna};
\end{scope}
\end{tikzpicture}
```

Sul vetro pulito l'adesione supera la coesione, e l'acqua si allarga: il vetro ha in superficie atomi di ossigeno con cui l'acqua forma legami a idrogeno. Sulla cera, fatta di molecole apolari, l'adesione è debole, vince la coesione e l'acqua resta raccolta in gocce.

Lo stesso confronto spiega la **capillarità**. In un tubo di vetro sottile l'acqua sale lungo le pareti, che la attirano, e forma un menisco concavo; il mercurio scende e forma un menisco convesso. Il fenomeno è tanto più marcato quanto più il tubo è sottile, ed è trattato con le figure nella lezione [Le proprietà fisiche dell'acqua](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/le-proprieta-fisiche-dell-acqua).

## L'evaporazione

Un liquido lasciato in un recipiente aperto prima o poi sparisce: evapora. L'**evaporazione** è il passaggio da liquido a vapore che avviene a qualunque temperatura e solo dalla superficie, come hai visto nella lezione [I passaggi di stato](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/i-passaggi-di-stato). Resta da capire come faccia una molecola a lasciare il liquido a una temperatura lontana da quella di ebollizione.

Le molecole di un liquido non hanno tutte la stessa energia cinetica. A una certa temperatura la maggior parte ha un'energia vicina alla media, alcune ne hanno molta meno, alcune molta di più, e gli urti la ridistribuiscono di continuo. Per sfuggire dalla superficie una molecola deve avere abbastanza energia da vincere le attrazioni delle vicine: ci riescono solo quelle più veloci.

```tikz
% nome: liquido-evaporazione-energie
% alt: Grafico del numero di molecole in funzione dell'energia cinetica, con due curve a campana asimmetrica: quella del liquido freddo ha il massimo più alto e più a sinistra, quella del liquido caldo è più bassa, più larga e spostata a destra. Una linea tratteggiata verticale segna l'energia minima per sfuggire dal liquido: alla sua destra l'area sotto la curva del liquido caldo è molto più grande
% svg: liquido-evaporazione-energie-5afd11bb.svg 287x159
\begin{tikzpicture}[x=0.8cm, y=7cm]
\fill[red!20] (4,0) -- (4.00,0.128) -- (4.30,0.114) -- (4.60,0.101) -- (4.90,0.090) -- (5.20,0.079) -- (5.50,0.069) -- (5.80,0.060) -- (6.10,0.053) -- (6.40,0.046) -- (6.70,0.040) -- (7.00,0.034) -- (7,0) -- cycle;
\fill[blue!30] (4,0) -- (4.00,0.073) -- (4.30,0.058) -- (4.60,0.046) -- (4.90,0.036) -- (5.20,0.029) -- (5.50,0.022) -- (5.80,0.018) -- (6.10,0.014) -- (6.40,0.011) -- (6.70,0.008) -- (7.00,0.006) -- (7,0) -- cycle;
\draw[->] (0,0) -- (7.5,0) node[below left] {\small energia cinetica};
\draw[->] (0,0) -- (0,0.45) node[above] {\small numero di molecole};
\draw[thick, blue] plot[smooth] coordinates {(0.00,0.000) (0.70,0.348) (1.40,0.345) (2.10,0.257) (2.80,0.170) (3.50,0.106) (4.20,0.063) (4.90,0.036) (5.60,0.021) (6.30,0.012) (7.00,0.006)};
\draw[thick, red] plot[smooth] coordinates {(0.00,0.000) (0.70,0.177) (1.40,0.228) (2.10,0.221) (2.80,0.190) (3.50,0.153) (4.20,0.119) (4.90,0.090) (5.60,0.066) (6.30,0.048) (7.00,0.034)};
\draw[thin, dashed] (4,0) -- (4,0.4);
\node[above] at (4.6,0.4) {\small energia per sfuggire};
\node[right] at (1.35,0.375) {\small liquido freddo};
\node[right] at (4.1,0.2) {\small liquido caldo};
\end{tikzpicture}
```

Il grafico spiega tre fatti che conosci dall'esperienza.

- L'evaporazione è più rapida a temperatura più alta: la curva si sposta verso destra, e le molecole con energia sufficiente, quelle a destra della linea tratteggiata, sono molte di più.
- L'evaporazione raffredda il liquido: se ne vanno le molecole più veloci, e l'energia media di quelle che restano diminuisce. Per questo il sudore rinfresca.
- Liquidi diversi evaporano con velocità diverse: dove le forze intermolecolari sono deboli, l'energia per sfuggire è piccola, la linea tratteggiata sta più a sinistra e la superano molte molecole. Un liquido che evapora facilmente si dice **volatile**.

## La tensione di vapore

In un recipiente aperto il vapore si disperde nell'aria e l'evaporazione continua finché c'è liquido. In un recipiente chiuso le cose vanno diversamente. All'inizio le molecole lasciano la superficie e il vapore si accumula sopra il liquido. Le molecole del vapore però si muovono in tutte le direzioni, e quelle che urtano la superficie possono essere catturate di nuovo: è la condensazione. Più il vapore diventa fitto, più molecole tornano nel liquido ogni secondo, finché il numero di quelle che rientrano uguaglia il numero di quelle che escono.

```tikz
% nome: liquido-equilibrio-vapore-recipiente
% alt: Due recipienti chiusi con del liquido sul fondo. Nel primo, appena chiuso, sopra il liquido ci sono poche molecole di vapore; una freccia lunga verso l'alto indica l'evaporazione e una freccia corta verso il basso la condensazione. Nel secondo, all'equilibrio, le molecole di vapore sono molte di più e le due frecce, verso l'alto e verso il basso, sono lunghe uguali
% svg: liquido-equilibrio-vapore-recipiente-ad6fa407.svg 357x140
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (2.4,0.9);
\draw[thin] (0,0.9) -- (2.4,0.9);
\draw[thick] (0,0) rectangle (2.4,3);
\foreach \p in {(0.5,1.6),(1.9,2.3),(1.2,2.7)} \draw[thin, fill=cyan!20] \p circle (0.08);
\draw[-{Stealth}, thick] (0.9,0.95) -- (0.9,2.1);
\draw[-{Stealth}, thick] (1.5,1.35) -- (1.5,0.95);
\node at (1.2,-0.35) {\small appena chiuso};
\begin{scope}[shift={(3.8,0)}]
\fill[cyan!20] (0,0) rectangle (2.4,0.8);
\draw[thin] (0,0.8) -- (2.4,0.8);
\draw[thick] (0,0) rectangle (2.4,3);
\foreach \p in {(0.3,1.2),(0.5,2.0),(0.35,2.7),(0.7,1.55),(1.2,2.75),(1.2,2.2),(1.9,2.5),(2.1,1.9),(1.95,1.3),(2.15,2.8),(0.6,2.45),(1.2,1.2)} \draw[thin, fill=cyan!20] \p circle (0.08);
\draw[-{Stealth}, thick] (0.95,0.85) -- (0.95,1.95);
\draw[-{Stealth}, thick] (1.5,1.95) -- (1.5,0.85);
\node at (1.2,-0.35) {\small all'equilibrio};
\end{scope}
\node[right] at (6.4,1.9) {\small su: evaporazione};
\node[right] at (6.4,1.4) {\small giù: condensazione};
\end{tikzpicture}
```

Da quel momento la quantità di vapore non cambia più, anche se evaporazione e condensazione continuano tutte e due: è un **equilibrio dinamico**. La pressione che il vapore esercita quando è in equilibrio con il suo liquido si chiama **tensione di vapore** (o pressione di vapore) del liquido a quella temperatura. Come ogni pressione di un gas, si misura in pascal, in atmosfere o in millimetri di mercurio, con $1\,\text{atm} = 760\,\text{mmHg}$ (lezione [La pressione dei gas](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-pressione-dei-gas)).

La tensione di vapore dipende da due sole cose: quale liquido è e a che temperatura si trova. Non dipende dalla quantità di liquido, né dalla forma o dal volume del recipiente, purché all'equilibrio resti ancora del liquido.

```ad-warning
Più liquido non dà più tensione di vapore
Un cucchiaio d'acqua e un litro d'acqua, chiusi in due recipienti a $20\,^\circ\text{C}$, hanno sopra di sé vapore alla stessa pressione, $17{,}5\,\text{mmHg}$. Conta quante molecole lasciano ogni centimetro quadrato di superficie, e questo dipende dalla temperatura e dalle forze tra le molecole, non da quanto liquido c'è sotto.
```

### La tensione di vapore e le forze intermolecolari

A parità di temperatura, un liquido con forze intermolecolari deboli manda nel vapore molte molecole e ha una tensione di vapore alta: è volatile. Un liquido con forze intense ha una tensione di vapore bassa.

| Liquido | Tensione di vapore a $20\,^\circ\text{C}$ ($\text{mmHg}$) | Temperatura di ebollizione a $1\,\text{atm}$ ($^\circ\text{C}$) |
|---|---|---|
| etere dietilico | $440$ | $35$ |
| acetone | $185$ | $56$ |
| etanolo | $44$ | $78$ |
| acqua | $17{,}5$ | $100$ |

L'etere dietilico e l'acetone sono polari ma non formano legami a idrogeno tra le loro molecole, e sono i più volatili. L'etanolo ne forma uno per molecola, l'acqua fino a quattro: per questo l'acqua, che ha la molecola più piccola delle quattro, è la meno volatile. Le due colonne della tabella vanno in versi opposti, e il motivo è nel prossimo paragrafo.

### La tensione di vapore e la temperatura

Scaldando il liquido, le molecole con energia sufficiente per sfuggire aumentano, e la tensione di vapore sale. Non sale in modo proporzionale: cresce sempre più in fretta.

| Temperatura ($^\circ\text{C}$) | Tensione di vapore dell'acqua ($\text{mmHg}$) |
|---|---|
| $0$ | $4{,}6$ |
| $20$ | $17{,}5$ |
| $25$ | $23{,}8$ |
| $40$ | $55{,}3$ |
| $60$ | $149$ |
| $80$ | $355$ |
| $90$ | $526$ |
| $100$ | $760$ |
| $120$ | $1489$ |

Da $20$ a $40\,^\circ\text{C}$ la tensione di vapore dell'acqua triplica; da $80$ a $100\,^\circ\text{C}$ aumenta di $405\,\text{mmHg}$, più di quanto era cresciuta in tutti gli $80$ gradi precedenti.

```tikz
% nome: liquido-tensione-vapore-curve
% alt: Grafico della tensione di vapore, da 0 a 1000 millimetri di mercurio, in funzione della temperatura, da 0 a 110 gradi Celsius, per quattro liquidi. Le curve salgono sempre più ripide; da sinistra a destra: etere dietilico, acetone, etanolo, acqua. La linea tratteggiata a 760 millimetri di mercurio, cioè 1 atmosfera, le incontra a 35, 56, 78 e 100 gradi, le temperature di ebollizione normali
% svg: liquido-tensione-vapore-curve-7142f5ee.svg 314x217
\begin{tikzpicture}[x=0.052cm, y=0.0042cm]
\foreach \x in {20,40,60,80,100} \draw[gray!25, very thin] (\x,0) -- (\x,1000);
\foreach \y in {200,400,600,800,1000} \draw[gray!25, very thin] (0,\y) -- (110,\y);
\draw[->] (0,0) -- (118,0) node[right] {\small $t$ ($^\circ$C)};
\draw[->] (0,0) -- (0,1090) node[above] {\small $p$ (mmHg)};
\foreach \x in {0,20,40,60,80,100} \draw (\x,0) -- (\x,-18) node[below] {\small $\x$};
\foreach \y in {200,400,600,800,1000} \draw (0,\y) -- (-1.5,\y) node[left] {\small $\y$};
\draw[thin, dashed] (0,760) -- (110,760);
\node[right] at (110,760) {\small $1$ atm};
\draw[thick, blue] plot[smooth] coordinates {(0.0,5) (10.0,9) (20.0,17) (30.0,32) (40.0,55) (50.0,92) (60.0,149) (70.0,233) (80.0,355) (90.0,525) (100.0,760) (107.8,1000)};
\draw[thick, green!50!black] plot[smooth] coordinates {(0.0,12) (10.0,23) (20.0,44) (30.0,78) (40.0,134) (50.0,220) (60.0,351) (70.0,541) (80.0,812) (85.4,1000)};
\draw[thick, orange!90!black] plot[smooth] coordinates {(0.0,70) (8.0,106) (16.0,155) (24.0,221) (32.0,309) (40.0,424) (48.0,572) (56.0,757) (64.0,988) (64.4,1000)};
\draw[thick, red] plot[smooth] coordinates {(0.0,186) (8.0,267) (16.0,375) (24.0,514) (32.0,692) (40.0,916) (42.6,1000)};
\foreach \x in {34.6,56.1,78.3,100} { \draw[thin, dashed] (\x,0) -- (\x,760); \fill (\x,760) circle (1.5pt); }
\node[above] at (40,1000) {\scriptsize etere};
\node[above] at (63,1000) {\scriptsize acetone};
\node[above] at (85,1000) {\scriptsize etanolo};
\node[above] at (107,1000) {\scriptsize acqua};
\end{tikzpicture}
```

## L'ebollizione

Nell'ebollizione il vapore si forma anche dentro il liquido, in bolle che salgono e scoppiano in superficie. Una bolla di vapore può esistere solo se la pressione del vapore al suo interno regge la pressione che la schiaccia da fuori, cioè quella che l'ambiente esercita sul liquido. Finché la tensione di vapore è minore della pressione esterna ogni bolla verrebbe subito schiacciata, e il liquido evapora solo dalla superficie.

Un liquido bolle quando la sua tensione di vapore uguaglia la pressione esterna. La **temperatura di ebollizione** è la temperatura a cui questo succede, e dipende quindi dalla pressione esterna. Quella che si trova nelle tabelle, misurata a $1\,\text{atm}$, è la **temperatura di ebollizione normale**: nel grafico qui sopra è il punto in cui la curva di ogni liquido incontra la linea tratteggiata.

Ora si capisce perché le due colonne della tabella dei quattro liquidi vanno in versi opposti. Un liquido volatile ha una tensione di vapore già alta a temperatura ambiente, e gli serve poco riscaldamento per arrivare a $760\,\text{mmHg}$: bolle a una temperatura bassa. Forze intermolecolari deboli, tensione di vapore alta e temperatura di ebollizione bassa sono tre facce dello stesso fatto.

Se la pressione esterna cambia, cambia il punto in cui la curva la incontra. In montagna la pressione atmosferica è più bassa, e l'acqua bolle sotto i $100\,^\circ\text{C}$; nella pentola a pressione il vapore trattenuto dal coperchio fa salire la pressione, e l'acqua bolle sopra i $100\,^\circ\text{C}$.

Nella figura qui sotto scegli un liquido, poi muovi la temperatura e la pressione esterna. Il punto arancione sulla curva è la tensione di vapore del liquido in quel momento; la linea tratteggiata è la pressione esterna.

```interattivo
% nome: liquido-tensione-vapore-ebollizione
% alt: A sinistra un recipiente aperto con un liquido: le molecole di vapore sopra la superficie aumentano quando la tensione di vapore si avvicina alla pressione esterna, e quando la raggiunge compaiono bolle in tutto il liquido. A destra la curva della tensione di vapore in funzione della temperatura, con una linea tratteggiata per la pressione esterna e un punto arancione per la temperatura scelta. Si scelgono il liquido (acqua, etanolo, acetone, etere dietilico), la temperatura e la pressione esterna; sotto si leggono la tensione di vapore e la temperatura di ebollizione a quella pressione
```

Con l'acqua a $760\,\text{mmHg}$ le bolle compaiono quando il punto arancione raggiunge la linea, a $100\,^\circ\text{C}$. Abbassando la pressione esterna a $530\,\text{mmHg}$, circa quella che si trova a $3000\,\text{m}$ di quota, la linea scende e il punto la raggiunge già a $90\,^\circ\text{C}$. L'etere dietilico, a $760\,\text{mmHg}$, bolle già a $35\,^\circ\text{C}$: in una giornata d'estate molto calda bollirebbe da solo.

```ad-warning
L'acqua non bolle sempre a 100 °C
$100\,^\circ\text{C}$ è la temperatura di ebollizione dell'acqua a $1\,\text{atm}$. A una pressione diversa l'acqua bolle a una temperatura diversa, più bassa se la pressione è minore e più alta se è maggiore. Quando un problema chiede una temperatura di ebollizione, il primo dato da cercare è la pressione esterna.
```

```ad-warning
Le bolle dell'ebollizione non sono aria
Le bolle che si formano in un liquido che bolle sono fatte del vapore di quel liquido. Le bollicine che compaiono sulle pareti di una pentola d'acqua molto prima dell'ebollizione sono invece aria che era sciolta nell'acqua e che, scaldando, esce dalla soluzione.
```

## Esempi svolti

```ad-example
Esempio 1: il liquido più volatile
A $20\,^\circ\text{C}$ tre liquidi hanno tensione di vapore $44\,\text{mmHg}$ (etanolo), $185\,\text{mmHg}$ (acetone) e $17{,}5\,\text{mmHg}$ (acqua). Qual è il più volatile? In quale le forze intermolecolari sono più intense? Quale bolle alla temperatura più alta?

Il più volatile è quello con la tensione di vapore più alta: l'acetone. Le forze più intense sono nel liquido che manda meno molecole nel vapore, quello con la tensione di vapore più bassa: l'acqua. Lo stesso liquido, partendo da più in basso, deve essere scaldato di più per arrivare alla pressione esterna: l'acqua è anche quella che bolle alla temperatura più alta.
```

```ad-example
Esempio 2: l'acqua in un rifugio a 3000 metri
In un rifugio a $3000\,\text{m}$ la pressione atmosferica è $0{,}692\,\text{atm}$. A che temperatura bolle l'acqua?

L'acqua bolle quando la sua tensione di vapore uguaglia la pressione esterna. La tabella dà la tensione di vapore in millimetri di mercurio, quindi si converte la pressione:

$$p = 0{,}692\,\text{atm} \cdot 760\,\frac{\text{mmHg}}{\text{atm}} = 526\,\text{mmHg}$$

Nella tabella l'acqua ha una tensione di vapore di $526\,\text{mmHg}$ a $90\,^\circ\text{C}$: nel rifugio l'acqua bolle a $90\,^\circ\text{C}$. La pasta cuoce più lentamente, perché l'acqua non supera quella temperatura.
```

```ad-example
Esempio 3: la pentola a pressione
In una pentola a pressione la valvola tiene la pressione interna a circa $2\,\text{atm}$. A che temperatura bolle l'acqua?

In millimetri di mercurio la pressione è $2 \cdot 760 = 1520\,\text{mmHg}$. Nella tabella la tensione di vapore dell'acqua vale $1489\,\text{mmHg}$ a $120\,^\circ\text{C}$, poco meno di $1520$: l'acqua bolle a una temperatura di poco superiore a $120\,^\circ\text{C}$.
```

```ad-example
Esempio 4: bolle o non bolle
L'etanolo ha una tensione di vapore di $351\,\text{mmHg}$ a $60\,^\circ\text{C}$. Bolle, a quella temperatura, in un recipiente aperto al livello del mare? E a che pressione esterna bollirebbe proprio a $60\,^\circ\text{C}$?

Al livello del mare la pressione esterna è $760\,\text{mmHg}$. La tensione di vapore, $351\,\text{mmHg}$, è minore: l'etanolo evapora dalla superficie ma non bolle.

Bollirebbe a $60\,^\circ\text{C}$ se la pressione esterna fosse uguale alla sua tensione di vapore, $351\,\text{mmHg}$, cioè

$$p = \frac{351\,\text{mmHg}}{760\,\text{mmHg/atm}} = 0{,}462\,\text{atm}$$

meno di metà della pressione atmosferica normale.
```

## Le proprietà e le forze

| Se le forze intermolecolari sono più intense | Perché |
|---|---|
| la viscosità è più alta | gli strati del liquido faticano a scorrere |
| la tensione superficiale è più alta | costa più energia portare una particella in superficie |
| la tensione di vapore è più bassa | meno molecole hanno l'energia per sfuggire |
| la temperatura di ebollizione è più alta | serve più calore per portare la tensione di vapore alla pressione esterna |

Quando la temperatura sale, viscosità e tensione superficiale diminuiscono, e la tensione di vapore aumenta.
