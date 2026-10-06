# I solidi: ionici, molecolari, covalenti e metallici

Un granello di sale, un cubetto di ghiaccio, un diamante e un filo di rame sono tutti solidi, ma non potrebbero essere più diversi. Il sale si frantuma sotto un colpo e fonde a $801\,^\circ\text{C}$; il ghiaccio fonde a $0\,^\circ\text{C}$; il diamante riga qualunque altro materiale; il rame si piega senza rompersi e conduce la corrente. Queste differenze si spiegano con due domande: quali particelle formano il solido, e che cosa le tiene unite.

## Solidi cristallini e solidi amorfi

In un solido le particelle occupano posizioni fisse, attorno alle quali possono solo vibrare. La prima distinzione riguarda come sono disposte.

- In un **solido cristallino** le particelle sono disposte in modo ordinato, secondo uno schema che si ripete uguale in tutte le direzioni per milioni di particelle. Sono cristallini il sale, il ghiaccio, il quarzo, i metalli.
- In un **solido amorfo** le particelle sono disposte in disordine, come in un liquido che sia stato bloccato. Sono amorfi il vetro, la cera, la gomma e molte plastiche.

```tikz
% nome: solidi-cristallino-amorfo
% alt: Due riquadri con venti particelle ciascuno, disegnate come cerchi. A sinistra, nel solido cristallino, le particelle sono allineate in quattro file e cinque colonne regolari. A destra, nel solido amorfo, le stesse particelle sono vicine tra loro ma disposte senza ordine
\begin{tikzpicture}
\draw[thin] (-0.35,-0.35) rectangle (2.75,2.15);
\foreach \x in {0,0.6,1.2,1.8,2.4} \foreach \y in {0,0.6,1.2,1.8} \draw[thick, fill=blue!10] (\x,\y) circle (0.22);
\node at (1.2,-0.7) {\small cristallino};
\begin{scope}[shift={(4.2,0)}]
\draw[thin] (-0.35,-0.35) rectangle (2.75,2.15);
\foreach \p in {(0.0,0.05),(0.55,-0.08),(1.15,0.1),(1.72,-0.05),(2.32,0.08),(0.22,0.58),(0.85,0.5),(1.42,0.66),(2.02,0.52),(2.48,0.82),(-0.05,1.12),(0.55,1.1),(1.1,1.2),(1.72,1.14),(2.25,1.36),(0.2,1.7),(0.8,1.78),(1.38,1.74),(1.95,1.86),(2.5,1.9)} \draw[thick, fill=blue!10] \p circle (0.22);
\node at (1.2,-0.7) {\small amorfo};
\end{scope}
\end{tikzpicture}
```

La differenza si vede quando si scalda il solido. In un cristallo ogni particella è trattenuta allo stesso modo delle altre, e tutte si liberano alla stessa temperatura: un solido cristallino fonde a una temperatura precisa, e durante la fusione la temperatura resta costante. In un solido amorfo alcune particelle sono trattenute più debolmente di altre, e il solido rammollisce un po' alla volta, in un intervallo di temperature: il vetro scaldato diventa prima molle, poi pastoso, poi fluido, senza un punto di fusione. Anche l'aspetto è diverso: i cristalli hanno facce piane che si incontrano ad angoli caratteristici, e si rompono lungo piani precisi; un pezzo di vetro si rompe in schegge dalle superfici curve.

La stessa sostanza può esistere nelle due forme. Il diossido di silicio, $\mathrm{SiO_2}$, è cristallino nel quarzo ed è amorfo nel vetro di silice, che si ottiene raffreddando in fretta il quarzo fuso, senza dare agli atomi il tempo di ordinarsi.

```ad-warning
Il cristallo dei bicchieri non è un cristallo
In chimica "cristallino" indica l'ordine delle particelle, non la trasparenza o la lucentezza. Il vetro "cristallo" dei bicchieri è un solido amorfo; un pezzo di ferro, opaco e grigio, è cristallino.
```

Il resto della lezione riguarda i solidi cristallini.

## Il reticolo e la cella elementare

La disposizione ordinata delle particelle di un cristallo si chiama **reticolo cristallino**, e i punti in cui stanno le particelle sono i **nodi** del reticolo. Per descrivere un reticolo non serve dire dove sta ogni particella: basta descriverne un pezzetto, il più piccolo che, ripetuto tante volte nelle tre direzioni come i mattoni di un muro, ricostruisce tutto il cristallo. Questo pezzetto è la **cella elementare**.

Le celle più semplici hanno la forma di un cubo, e sono di tre tipi.

```tikz
% nome: solidi-celle-cubiche
% alt: Tre cubi disegnati in prospettiva, con gli spigoli nascosti tratteggiati. Nel primo, la cella cubica semplice, c'è una particella su ognuno degli otto vertici. Nel secondo, la cella cubica a corpo centrato, c'è in più una particella al centro del cubo, colorata diversamente. Nel terzo, la cella cubica a facce centrate, oltre agli otto vertici c'è una particella al centro di ognuna delle sei facce
\begin{tikzpicture}
\newcommand{\cubo}{%
\draw[thin, dashed] (0,0) -- (0.6,0.45) -- (2.2,0.45);
\draw[thin, dashed] (0.6,0.45) -- (0.6,2.05);
\draw[thick] (0,0) rectangle (1.6,1.6);
\draw[thick] (0,1.6) -- (0.6,2.05) -- (2.2,2.05) -- (1.6,1.6);
\draw[thick] (2.2,2.05) -- (2.2,0.45) -- (1.6,0);
\foreach \p in {(0,0),(1.6,0),(0,1.6),(1.6,1.6),(0.6,0.45),(2.2,0.45),(0.6,2.05),(2.2,2.05)} \draw[thick, fill=gray!40] \p circle (0.13);}
\cubo
\node at (1.1,-0.5) {\small semplice};
\begin{scope}[shift={(3.1,0)}]
\cubo
\draw[thick, fill=red!30] (1.1,1.025) circle (0.13);
\node at (1.1,-0.5) {\small a corpo centrato};
\end{scope}
\begin{scope}[shift={(6.2,0)}]
\cubo
\foreach \p in {(0.8,0.8),(1.4,1.25),(0.3,1.025),(1.9,1.025),(1.1,0.225),(1.1,1.825)} \draw[thick, fill=blue!30] \p circle (0.13);
\node at (1.1,-0.5) {\small a facce centrate};
\end{scope}
\end{tikzpicture}
```

- Nella cella **cubica semplice** c'è una particella su ogni vertice del cubo.
- Nella cella **cubica a corpo centrato** c'è in più una particella al centro del cubo. È la struttura del ferro a temperatura ambiente e del sodio.
- Nella cella **cubica a facce centrate** c'è una particella su ogni vertice e una al centro di ogni faccia. È la struttura del rame, dell'alluminio, dell'argento e dell'oro.

Una particella che sta su un vertice non appartiene a una cella sola: in un cristallo un vertice è in comune a otto cubi, e a ciascuno spetta un ottavo della particella. Per contare quante particelle contiene davvero una cella si usa questa regola.

| Posizione della particella | Celle che la condividono | Quanto vale per una cella |
|---|---|---|
| vertice | $8$ | $\dfrac{1}{8}$ |
| spigolo | $4$ | $\dfrac{1}{4}$ |
| faccia | $2$ | $\dfrac{1}{2}$ |
| interno | $1$ | $1$ |

```ad-example
Esempio 1: quante particelle in una cella
Quanti atomi contiene la cella cubica a facce centrate del rame?

Gli atomi sui vertici sono $8$ e valgono un ottavo ciascuno; quelli al centro delle facce sono $6$ e valgono un mezzo ciascuno:

$$8 \cdot \frac{1}{8} + 6 \cdot \frac{1}{2} = 1 + 3 = 4$$

La cella contiene $4$ atomi di rame. Con lo stesso conto la cella cubica semplice ne contiene $8 \cdot \frac{1}{8} = 1$, e quella a corpo centrato $8 \cdot \frac{1}{8} + 1 = 2$.
```

```ad-warning
Contare i pallini del disegno
Nel disegno della cella a facce centrate si vedono $14$ particelle, ma la cella ne contiene $4$: quelle sui vertici e sulle facce sono in comune con le celle vicine. Contarle tutte per intero è l'errore tipico.
```

## I quattro tipi di solidi cristallini

Nei nodi del reticolo possono esserci ioni, molecole o atomi, e a tenerli uniti possono essere legami ionici, forze intermolecolari, legami covalenti o il legame metallico. Ne risultano quattro tipi di solidi, con proprietà molto diverse.

```tikz
% nome: solidi-quattro-tipi-reticoli
% alt: Quattro riquadri. Solido ionico: cerchi grandi con il segno meno e cerchi piccoli con il segno più, alternati come su una scacchiera. Solido molecolare: molecole fatte di due atomi uniti da un trattino, ordinate in file, con linee tratteggiate tra una molecola e l'altra. Solido covalente: atomi tutti uguali, ognuno unito ai vicini da trattini pieni, in una rete continua. Solido metallico: cerchi con il segno più in file ordinate e, tra loro, tanti puntini sparsi, gli elettroni liberi
\begin{tikzpicture}
% ionico
\foreach \x/\y in {0/0,1.2/0,0.6/0.6,1.8/0.6,0/1.2,1.2/1.2} { \draw[thick, fill=green!15] (\x,\y) circle (0.27); \node at (\x,\y) {\small $-$}; }
\foreach \x/\y in {0.6/0,1.8/0,0/0.6,1.2/0.6,0.6/1.2,1.8/1.2} { \draw[thick, fill=violet!15] (\x,\y) circle (0.17); \node at (\x,\y) {\scriptsize $+$}; }
\node at (0.9,-0.65) {\small ionico};
% molecolare
\begin{scope}[shift={(3.4,0)}]
\foreach \x/\y in {0/0,1.3/0,0.65/0.6,1.95/0.6,0/1.2,1.3/1.2} {
\draw[thick] (\x,\y) -- (\x+0.4,\y);
\draw[thick, fill=orange!25] (\x,\y) circle (0.17);
\draw[thick, fill=orange!25] (\x+0.4,\y) circle (0.17); }
\draw[thick, dashed, gray] (0.6,0) -- (1.1,0);
\draw[thick, dashed, gray] (0.6,1.2) -- (1.1,1.2);
\draw[thick, dashed, gray] (1.25,0.6) -- (1.75,0.6);
\draw[thick, dashed, gray] (0.3,0.18) -- (0.62,0.44);
\draw[thick, dashed, gray] (0.3,1.02) -- (0.62,0.76);
\draw[thick, dashed, gray] (1.6,0.18) -- (1.92,0.44);
\draw[thick, dashed, gray] (1.6,1.02) -- (1.92,0.76);
\node at (1.15,-0.65) {\small molecolare};
\end{scope}
% covalente
\begin{scope}[shift={(0,-2.9)}]
\foreach \y in {0,0.6,1.2} \draw[thick] (0,\y) -- (1.8,\y);
\foreach \x in {0,0.6,1.2,1.8} \draw[thick] (\x,0) -- (\x,1.2);
\foreach \x in {0,0.6,1.2,1.8} \foreach \y in {0,0.6,1.2} \draw[thick, fill=gray!40] (\x,\y) circle (0.15);
\node at (0.9,-0.65) {\small covalente};
\end{scope}
% metallico
\begin{scope}[shift={(3.4,-2.9)}]
\foreach \x in {0,0.75,1.5,2.25} \foreach \y in {0,0.6,1.2} { \draw[thick, fill=blue!10] (\x,\y) circle (0.2); \node at (\x,\y) {\scriptsize $+$}; }
\foreach \p in {(0.38,0.1),(1.1,-0.08),(1.9,0.15),(0.3,0.42),(1.15,0.3),(1.85,0.45),(0.42,0.85),(1.1,0.95),(1.9,0.8),(0.36,1.3),(1.2,1.38),(1.85,1.25),(2.6,0.3),(-0.35,0.9),(2.62,1.0),(-0.33,0.25)} \fill \p circle (1.3pt);
\node at (1.15,-0.65) {\small metallico};
\end{scope}
\end{tikzpicture}
```

### Solidi ionici

Nei nodi ci sono ioni positivi e negativi alternati, tenuti insieme dal [legame ionico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-ionico), cioè dall'attrazione elettrica tra cariche opposte, che agisce in tutte le direzioni. Non ci sono molecole: la formula, come $\mathrm{NaCl}$, dice solo in che rapporto stanno gli ioni. Sono ionici i composti tra un metallo e un non metallo, come il cloruro di sodio, l'ossido di magnesio $\mathrm{MgO}$ e il fluoruro di calcio $\mathrm{CaF_2}$.

Il legame ionico è forte, e le proprietà ne sono la conseguenza.

- Temperature di fusione alte: $801\,^\circ\text{C}$ per $\mathrm{NaCl}$, $2852\,^\circ\text{C}$ per $\mathrm{MgO}$, che ha ioni con carica doppia.
- Duri ma fragili. Un colpo fa scorrere uno strato di ioni rispetto a quello sotto: ioni dello stesso segno si trovano affacciati, si respingono, e il cristallo si spacca lungo un piano.
- Allo stato solido non conducono la corrente, perché gli ioni sono fermi nei nodi. Conducono quando sono fusi o sciolti in acqua, perché gli ioni sono liberi di muoversi.
- Molti si sciolgono in acqua, le cui molecole polari circondano gli ioni e li staccano dal cristallo ([L'acqua come solvente](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/l-acqua-come-solvente)).

### Solidi molecolari

Nei nodi ci sono molecole (o atomi singoli, nei gas nobili solidificati), tenute insieme dalle [forze intermolecolari](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/forze-dipolo-dipolo-e-forze-di-london): forze di London, forze dipolo-dipolo, [legami a idrogeno](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/il-legame-a-idrogeno). Sono solidi molecolari il ghiaccio, lo iodio $\mathrm{I_2}$, lo zucchero, la naftalina, il ghiaccio secco (diossido di carbonio solido).

Le forze intermolecolari sono deboli, e i solidi molecolari sono i meno resistenti.

- Temperature di fusione basse: $0\,^\circ\text{C}$ il ghiaccio, $114\,^\circ\text{C}$ lo iodio, $186\,^\circ\text{C}$ lo zucchero. Alcuni sublimano già a temperatura ambiente o sotto: il ghiaccio secco passa direttamente a gas a $-78\,^\circ\text{C}$.
- Teneri: si scalfiscono e si sbriciolano con facilità.
- Non conducono la corrente né da solidi né da fusi, perché le molecole sono neutre e non ci sono cariche libere.

```ad-warning
Quando un solido molecolare fonde le molecole restano intere
Nel ghiaccio che fonde si allentano i legami a idrogeno tra le molecole, non i legami covalenti $\mathrm{O{-}H}$ dentro le molecole. I solidi molecolari fondono a temperature basse proprio perché si vincono solo le forze deboli tra una molecola e l'altra.
```

### Solidi covalenti

Nei nodi ci sono atomi, e ogni atomo è unito ai vicini da [legami covalenti](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-covalente). I legami proseguono da un atomo all'altro per tutto il cristallo, che è in pratica un'unica molecola gigantesca: per questo si chiamano anche solidi reticolari. Sono covalenti il diamante, il quarzo $\mathrm{SiO_2}$, il silicio, il carburo di silicio $\mathrm{SiC}$.

Per fondere o scalfire un solido covalente bisogna rompere legami covalenti, i più forti di tutti.

- Temperature di fusione altissime: circa $1700\,^\circ\text{C}$ il quarzo, oltre $3500\,^\circ\text{C}$ il diamante.
- Durissimi: il diamante è il materiale naturale più duro che si conosca.
- Di regola non conducono la corrente, perché gli elettroni sono bloccati nei legami tra due atomi. La grafite, che vedrai più avanti, fa eccezione.
- Non si sciolgono in acqua né negli altri solventi comuni.

```ad-warning
Solido covalente non vuol dire solido con legami covalenti
Anche nel ghiaccio e nello iodio ci sono legami covalenti, ma stanno dentro le molecole, e a tenere insieme il solido sono le forze deboli tra le molecole: sono solidi molecolari. In un solido covalente i legami covalenti uniscono tutti gli atomi del cristallo. Il confronto più chiaro è tra due ossidi dalla formula simile: il diossido di carbonio $\mathrm{CO_2}$ è fatto di molecole e sublima a $-78\,^\circ\text{C}$; il diossido di silicio $\mathrm{SiO_2}$ è una rete continua di atomi e fonde a circa $1700\,^\circ\text{C}$.
```

### Solidi metallici

Nei nodi ci sono gli ioni positivi del metallo, immersi in un "mare" di elettroni di valenza liberi di muoversi in tutto il cristallo: è il [legame metallico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-metallico). Sono solidi metallici tutti i metalli e le loro leghe: ferro, rame, alluminio, oro, ottone.

- Conducono bene la corrente e il calore, sia da solidi sia da fusi, perché gli elettroni liberi trasportano la carica e l'energia.
- Malleabili e duttili: si lasciano ridurre in lamine e in fili. Quando uno strato di ioni scorre sull'altro, il mare di elettroni li tiene uniti come prima, e il metallo si deforma senza rompersi.
- Lucenti.
- Temperature di fusione molto varie: $-39\,^\circ\text{C}$ il mercurio, $98\,^\circ\text{C}$ il sodio, $1085\,^\circ\text{C}$ il rame, $1538\,^\circ\text{C}$ il ferro, $3422\,^\circ\text{C}$ il tungsteno.

### I quattro tipi a confronto

| | Ionico | Molecolare | Covalente | Metallico |
|---|---|---|---|---|
| Particelle nei nodi | ioni positivi e negativi | molecole | atomi | ioni positivi tra elettroni liberi |
| Che cosa le tiene unite | legame ionico | forze intermolecolari | legami covalenti | legame metallico |
| Temperatura di fusione | alta | bassa | altissima | varia, spesso alta |
| Durezza | duro e fragile | tenero | durissimo | varia; malleabile |
| Conduce da solido | no | no | no (la grafite sì) | sì |
| Conduce da fuso | sì | no | no | sì |
| Esempi | $\mathrm{NaCl}$, $\mathrm{MgO}$ | ghiaccio, $\mathrm{I_2}$, zucchero | diamante, quarzo | $\mathrm{Fe}$, $\mathrm{Cu}$ |

Le righe della tabella descrivono tendenze, e gli intervalli si sovrappongono: l'ossido di magnesio, ionico, fonde a una temperatura più alta del quarzo, covalente. Per riconoscere il tipo di un solido conta l'insieme delle proprietà, non un numero solo.

Nella figura qui sotto scegli un solido e poi lo stato, solido o fuso. La figura mostra le particelle e che cosa le unisce, e una lampadina collegata al campione dice se conduce la corrente.

```interattivo
% nome: solidi-tipo-particelle-conduce
% alt: Un riquadro mostra le particelle del solido scelto: ioni con il segno più e meno per il cloruro di sodio, molecole d'acqua per il ghiaccio, molecole di due atomi per lo iodio, una rete di atomi uniti da trattini per il quarzo, ioni positivi tra puntini che sono elettroni liberi per il rame. Si sceglie il solido e lo stato, solido o fuso: da solido le particelle sono in ordine, da fuso in disordine. Accanto, un circuito con una pila e una lampadina collegato al campione: la lampadina è accesa se il campione conduce e spenta se non conduce. Sotto la figura si leggono il tipo di solido, le particelle, che cosa le tiene unite e la temperatura di fusione
```

Il cloruro di sodio è il caso da guardare con attenzione: da solido la lampadina è spenta, da fuso si accende, perché gli ioni sono gli stessi ma ora possono muoversi. Il rame conduce in tutti e due gli stati, il ghiaccio, lo iodio e il quarzo in nessuno dei due.

## Riconoscere il tipo di solido

In un esercizio il tipo di solido si ricava in due modi: dalla formula, oppure dalle proprietà.

Dalla formula:

1. un metallo, o una lega di metalli: solido metallico;
2. un composto tra un metallo e un non metallo: solido ionico;
3. una sostanza fatta di molecole, cioè quasi tutti gli elementi non metallici e i composti tra non metalli ($\mathrm{H_2O}$, $\mathrm{CO_2}$, $\mathrm{I_2}$, $\mathrm{S_8}$): solido molecolare;
4. i pochi casi di rete covalente, da ricordare: diamante, grafite, silicio, quarzo $\mathrm{SiO_2}$, carburo di silicio $\mathrm{SiC}$.

Dalle proprietà:

1. se conduce la corrente allo stato solido, è metallico (o è grafite);
2. se non conduce da solido ma conduce da fuso o sciolto in acqua, è ionico;
3. se non conduce in nessun caso e fonde a temperatura bassa, è molecolare;
4. se non conduce in nessun caso, è durissimo e fonde a temperatura altissima, è covalente.

```ad-example
Esempio 2: dalla formula al tipo di solido
Che tipo di solido formano bromuro di potassio $\mathrm{KBr}$, argento $\mathrm{Ag}$, ammoniaca $\mathrm{NH_3}$ e silicio $\mathrm{Si}$?

- $\mathrm{KBr}$: potassio è un metallo, bromo un non metallo. Solido ionico, fatto di ioni $\mathrm{K^+}$ e $\mathrm{Br^-}$.
- $\mathrm{Ag}$: un metallo. Solido metallico.
- $\mathrm{NH_3}$: un composto tra non metalli fatto di molecole. Solido molecolare, con le molecole unite da legami a idrogeno.
- $\mathrm{Si}$: è uno dei casi da ricordare. Solido covalente, con la stessa struttura del diamante.
```

```ad-example
Esempio 3: dalle proprietà al tipo di solido
Un solido bianco fonde a $770\,^\circ\text{C}$. Allo stato solido non conduce la corrente; fuso la conduce bene. Che tipo di solido è?

Non conduce da solido, quindi non è metallico. Conduce da fuso: ci sono cariche che da solide erano ferme e da fuse si muovono, cioè ioni. È un solido ionico, e la temperatura di fusione alta lo conferma. I dati sono quelli del cloruro di potassio, $\mathrm{KCl}$.
```

```ad-example
Esempio 4: due solidi che non conducono
Due solidi non conducono la corrente né da solidi né da fusi. Il primo fonde a $80\,^\circ\text{C}$ e si scalfisce con un'unghia; il secondo fonde sopra i $2500\,^\circ\text{C}$ e riga il vetro. Che tipo di solido sono?

Nessuno dei due ha cariche libere, quindi né metallico né ionico. Il primo è tenero e fonde a temperatura bassa: è tenuto insieme da forze deboli, è un solido molecolare (i dati sono quelli della naftalina). Il secondo è durissimo e fonde a temperatura altissima: per fonderlo bisogna rompere legami covalenti, è un solido covalente (i dati sono quelli del carburo di silicio).
```

```ad-example
Esempio 5: ordinare le temperature di fusione
Metti in ordine di temperatura di fusione crescente: cloruro di sodio $\mathrm{NaCl}$, diamante, iodio $\mathrm{I_2}$.

Lo iodio è un solido molecolare, il cloruro di sodio è ionico, il diamante è covalente. Per fondere il primo si vincono forze di London, per il secondo l'attrazione tra ioni, per il terzo si rompono legami covalenti. L'ordine è iodio ($114\,^\circ\text{C}$), cloruro di sodio ($801\,^\circ\text{C}$), diamante (oltre $3500\,^\circ\text{C}$).
```

## Le forme allotropiche del carbonio

Uno stesso elemento può esistere in forme diverse, con gli atomi legati tra loro in modi diversi: si chiamano **forme allotropiche**, e il fenomeno **allotropia**. Il carbonio ne ha alcune delle più note, e così diverse tra loro che è difficile credere siano fatte degli stessi atomi.

```tikz
% nome: solidi-carbonio-diamante-grafite
% alt: A sinistra un frammento della struttura del diamante: un atomo di carbonio al centro unito a quattro atomi vicini disposti ai vertici di un tetraedro, ognuno dei quali prosegue con altri legami verso l'esterno. A destra la grafite: tre strati piani sovrapposti, ognuno fatto di esagoni di atomi di carbonio come un nido d'ape, separati da uno spazio più grande della distanza tra gli atomi di uno strato e uniti da linee tratteggiate
\begin{tikzpicture}
% diamante
\coordinate (c) at (0,0);
\coordinate (a) at (0,1.05);
\coordinate (b) at (-1.0,-0.45);
\coordinate (d) at (1.0,-0.45);
\coordinate (e) at (0.2,-0.95);
\foreach \p in {a,b,d,e} \draw[thick] (c) -- (\p);
\draw[thick] (a) -- ++(-0.45,0.35); \draw[thick] (a) -- ++(0.45,0.35); \draw[thick] (a) -- ++(0.1,0.5);
\draw[thick] (b) -- ++(-0.5,0.25); \draw[thick] (b) -- ++(-0.35,-0.45); \draw[thick] (b) -- ++(0.1,-0.55);
\draw[thick] (d) -- ++(0.5,0.25); \draw[thick] (d) -- ++(0.35,-0.45); \draw[thick] (d) -- ++(0.55,-0.1);
\draw[thick] (e) -- ++(-0.4,-0.4); \draw[thick] (e) -- ++(0.4,-0.4); \draw[thick] (e) -- ++(0,-0.55);
\foreach \p in {c,a,b,d,e} \draw[thick, fill=gray!40] (\p) circle (0.16);
\node at (0,-2.0) {\small diamante};
% grafite
\begin{scope}[shift={(3.4,-1.2)}]
\foreach \h in {0,1.05,2.1} {
\begin{scope}[shift={(0,\h)}, xslant=0.8, yscale=0.42]
\foreach \cx/\cy in {0/0, 0.866/0, 1.732/0, 0.433/0.75, 1.299/0.75} {
\begin{scope}[shift={(\cx,\cy)}]
\draw[thick] (30:0.5) -- (90:0.5) -- (150:0.5) -- (210:0.5) -- (270:0.5) -- (330:0.5) -- cycle;
\end{scope} }
\end{scope} }
\draw[thin, dashed] (-0.83,-0.1) -- (-0.83,2.0);
\draw[thin, dashed] (2.55,0.1) -- (2.55,2.2);
\node at (1.1,-0.8) {\small grafite};
\end{scope}
\end{tikzpicture}
```

Nel **diamante** ogni atomo di carbonio è legato con quattro legami covalenti ad altri quattro atomi, disposti ai vertici di un tetraedro, e la rete prosegue uguale in tutte le direzioni. È il solido covalente per eccellenza: durissimo, trasparente, isolante, perché tutti e quattro gli elettroni di valenza di ogni atomo sono impegnati nei legami.

Nella **grafite** ogni atomo è legato a tre soli atomi, e forma strati piani di esagoni. Il quarto elettrone di valenza non è bloccato in un legame tra due atomi: è libero di muoversi lungo tutto lo strato, e per questo la grafite conduce la corrente. Dentro uno strato gli atomi sono uniti da legami covalenti, a $142\,\text{pm}$ l'uno dall'altro; tra uno strato e l'altro, distanti $335\,\text{pm}$, ci sono solo forze di London. Gli strati scorrono con facilità l'uno sull'altro: la grafite è tenera, lascia il segno sulla carta (è la mina delle matite) e si usa come lubrificante.

| | Diamante | Grafite |
|---|---|---|
| Legami di ogni atomo | $4$, verso i vertici di un tetraedro | $3$, in un piano |
| Struttura | rete in tre dimensioni | strati di esagoni |
| Durezza | durissimo | tenera, si sfalda |
| Conduce la corrente | no | sì |
| Aspetto | trasparente, incolore | nera, opaca |
| Densità | $3{,}51\,\text{g/cm}^3$ | $2{,}26\,\text{g/cm}^3$ |

La grafite mostra anche il limite della classificazione in quattro tipi: dentro gli strati è un solido covalente, tra gli strati si comporta come un solido molecolare, e conduce come un metallo. I quattro tipi sono modelli, e alcuni solidi reali stanno a metà tra due di essi.

Le altre forme allotropiche del carbonio sono state scoperte più di recente. Nei **fullereni** gli atomi formano molecole chiuse a gabbia: la più nota, $\mathrm{C_{60}}$, scoperta nel 1985, ha $60$ atomi disposti in $12$ pentagoni e $20$ esagoni, come le cuciture di un pallone da calcio. Essendo fatto di molecole, il fullerene solido è un solido molecolare. Il **grafene**, isolato nel 2004, è un singolo strato di grafite, spesso un solo atomo; un **nanotubo** è uno strato arrotolato a formare un cilindro.

```ad-note
Altri elementi con forme allotropiche
L'allotropia non è una particolarità del carbonio. L'ossigeno esiste come $\mathrm{O_2}$ e come ozono, $\mathrm{O_3}$; il fosforo come fosforo bianco e fosforo rosso; lo zolfo in più forme cristalline.
```
