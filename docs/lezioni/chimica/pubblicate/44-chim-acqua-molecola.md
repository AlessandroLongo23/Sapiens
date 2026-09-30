# La molecola d'acqua e il legame a idrogeno

L'acqua è la sostanza più comune sulla superficie della Terra e anche la più strana: è liquida a temperatura ambiente mentre molecole più pesanti della sua sono gas, il suo ghiaccio galleggia, e scioglie più sostanze di quasi ogni altro liquido. Tutte queste stranezze vengono da una molecola piccola, fatta di tre atomi, e da come le sue molecole si attraggono tra loro con il legame a idrogeno.

## La formula e la composizione

La formula dell'acqua è $\mathrm{H_2O}$: ogni molecola è fatta di due atomi di idrogeno e uno di ossigeno, legati all'ossigeno che sta in mezzo. Ogni atomo di idrogeno mette in comune un elettrone con l'ossigeno, e i due elettroni condivisi formano un **legame covalente**: una coppia di elettroni che appartiene a tutti e due gli atomi e li tiene uniti. Il legame covalente si studia per intero al terzo anno, nella lezione [Il legame covalente](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-covalente); qui basta sapere che è un legame forte, che per rompersi ha bisogno di molta energia.

Con le masse atomiche della lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare), $\mathrm{H} = 1{,}01$ e $\mathrm{O} = 16{,}00$, la massa molare dell'acqua è

$$M(\mathrm{H_2O}) = 2 \cdot 1{,}01 + 16{,}00 = 18{,}02\,\text{g/mol}$$

L'ossigeno pesa quasi otto volte i due idrogeni insieme: in $18{,}02\,\text{g}$ d'acqua ci sono $16{,}00\,\text{g}$ di ossigeno, cioè l'$88{,}8\%$ della massa, e $2{,}02\,\text{g}$ di idrogeno, l'$11{,}2\%$. Il rapporto è sempre lo stesso, da qualunque parte venga l'acqua, come dice la [legge di Proust](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-proust).

```ad-example
Esempio 1: quanto idrogeno c'è in un litro d'acqua
Un litro d'acqua ha la massa di circa $1000\,\text{g}$. Quanti grammi di idrogeno e quanti di ossigeno contiene?

L'idrogeno è l'$11{,}2\%$ della massa, più precisamente $2{,}02/18{,}02$:

$$m(\mathrm{H}) = 1000\,\text{g} \cdot \frac{2{,}02}{18{,}02} = 112\,\text{g} \qquad m(\mathrm{O}) = 1000\,\text{g} - 112\,\text{g} = 888\,\text{g}$$

Un litro d'acqua contiene circa $112\,\text{g}$ di idrogeno e $888\,\text{g}$ di ossigeno.
```

## Una molecola piegata

I tre atomi non stanno in fila: la molecola d'acqua è **piegata**, a forma di V, con l'ossigeno al vertice. L'angolo tra i due legami, misurato sulle molecole d'acqua allo stato di vapore, è di circa $104{,}5^\circ$, e ogni idrogeno dista dall'ossigeno $0{,}096\,\text{nm}$, cioè $0{,}096$ miliardesimi di metro.

```molecola3d
% nome: acqua-molecola-3d
% alt: Modello tridimensionale della molecola d'acqua: l'ossigeno al vertice di una V e i due idrogeni alle estremità, con l'angolo H-O-H misurato sul modello
% svg: acqua-molecola-3d-394f2897.svg 67x27
% xyz: O -0.001 0.398 0.000; H -0.763 -0.200 0.000; H 0.764 -0.198 0.000
% legami: 1-2:1; 1-3:1
smiles: O
angoli: 1-0-2
```

Il modello qui sopra si può ruotare: da qualunque parte lo guardi, i due idrogeni stanno dalla stessa parte dell'ossigeno. Il computer che l'ha costruito, con un modello che tratta i legami come molle, trova un angolo di $104{,}0^\circ$, vicino al valore misurato.

Perché piegata? L'ossigeno ha sei elettroni nel livello più esterno: due li mette nei legami con gli idrogeni, gli altri quattro restano suoi, in due **coppie solitarie**, coppie di elettroni che non fanno legami. Le due coppie solitarie e i due legami si respingono e si allontanano il più possibile, e le coppie solitarie spingono i due legami l'uno verso l'altro. È la teoria VSEPR, del terzo anno: la lezione [La geometria delle molecole](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/la-geometria-delle-molecole) spiega da dove viene proprio questo angolo.

```ad-warning
Disegnare l'acqua in fila
Scrivere $\mathrm{H{-}O{-}H}$ su una riga è comodo, ma la molecola non è lineare. Se lo fosse, come l'anidride carbonica, non sarebbe polare, e quasi tutto il resto della lezione non varrebbe: niente legami a idrogeno, niente ghiaccio che galleggia.
```

## Una molecola polare

L'ossigeno attira verso di sé gli elettroni dei legami più di quanto faccia l'idrogeno: i due elettroni condivisi di ogni legame passano più tempo vicino all'ossigeno. La capacità di un atomo di attirare gli elettroni di un legame si chiama **elettronegatività**, e per l'ossigeno è molto più alta che per l'idrogeno; al terzo anno la si misura con dei numeri, nella lezione [Affinità elettronica ed elettronegatività](/materiale/scuola-superiore/chimica/il-sistema-periodico/affinita-elettronica-ed-elettronegativita).

Il risultato è che la molecola, nel complesso neutra, ha le cariche distribuite in modo diseguale: l'ossigeno è un po' negativo e i due idrogeni un po' positivi. Queste cariche si chiamano **cariche parziali** e si scrivono con la lettera greca delta: $\delta^-$ sull'ossigeno, $\delta^+$ su ogni idrogeno. Sono parziali perché sono più piccole della carica di un elettrone: nessun elettrone passa del tutto all'ossigeno, come succederebbe in un legame ionico.

```tikz
% nome: acqua-molecola-cariche-parziali
% alt: La molecola d'acqua disegnata piegata: un grande cerchio rosato per l'ossigeno in alto, con due coppie di puntini sopra, le coppie solitarie, e due cerchi più piccoli azzurri per gli idrogeni in basso a sinistra e a destra. Sull'ossigeno è scritto delta meno, su ogni idrogeno delta più; l'angolo tra i due legami è segnato con un arco e vale 104,5 gradi. Sotto, la molecola di anidride carbonica, lineare, con delta meno sui due ossigeni alle estremità e delta più sul carbonio al centro
% svg: acqua-molecola-cariche-parziali-81877111.svg 144x177
\begin{tikzpicture}
% acqua
\draw[thick] (0,0) -- (-0.95,-0.73);
\draw[thick] (0,0) -- (0.95,-0.73);
\draw[thick, fill=red!20] (0,0) circle (0.45);
\draw[thick, fill=blue!10] (-0.95,-0.73) circle (0.3);
\draw[thick, fill=blue!10] (0.95,-0.73) circle (0.3);
\node at (0,0) {O};
\node at (-0.95,-0.73) {H};
\node at (0.95,-0.73) {H};
\fill (-0.33,0.56) circle (1.2pt); \fill (-0.2,0.62) circle (1.2pt);
\fill (0.33,0.56) circle (1.2pt); \fill (0.2,0.62) circle (1.2pt);
\node at (0.95,0.35) {$\delta^-$};
\node at (-1.55,-1.05) {$\delta^+$};
\node at (1.55,-1.05) {$\delta^+$};
\draw[thin] (-0.47,-0.36) arc (217.5:322.5:0.6);
\node at (0,-0.95) {\small $104{,}5^\circ$};
\node at (0,1.1) {\small coppie solitarie};
% anidride carbonica
\begin{scope}[shift={(0,-2.8)}]
\draw[thick] (-1.2,0.05) -- (1.2,0.05);
\draw[thick] (-1.2,-0.05) -- (1.2,-0.05);
\draw[thick, fill=red!20] (-1.2,0) circle (0.42);
\draw[thick, fill=gray!20] (0,0) circle (0.4);
\draw[thick, fill=red!20] (1.2,0) circle (0.42);
\node at (-1.2,0) {O};
\node at (0,0) {C};
\node at (1.2,0) {O};
\node at (-1.2,0.72) {$\delta^-$};
\node at (0,0.72) {$\delta^+$};
\node at (1.2,0.72) {$\delta^-$};
\end{scope}
\end{tikzpicture}
```

Nell'acqua le cariche parziali non si compensano, perché la molecola è piegata: da una parte c'è l'ossigeno negativo, dall'altra i due idrogeni positivi. Una molecola così, con un lato negativo e un lato positivo, si chiama **molecola polare**, o **dipolo**. Anche nell'anidride carbonica, $\mathrm{CO_2}$, gli ossigeni attirano gli elettroni e hanno cariche parziali negative, ma la molecola è lineare: i due ossigeni tirano in direzioni opposte, gli effetti si annullano, e la molecola è **apolare**. La forma conta quanto gli atomi; la lezione [Molecole polari e apolari](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/molecole-polari-e-apolari) del terzo anno lo tratta per molte altre molecole.

```ad-tip
Una prova che si fa in cucina
Strofina un palloncino sui capelli o su un maglione di lana e avvicinalo a un filo d'acqua sottile che scende dal rubinetto: il filo si piega verso il palloncino. Le molecole d'acqua si girano con il lato di carica opposta verso il palloncino carico, e ne vengono attirate. Con un filo d'olio, fatto di molecole apolari, non succede quasi niente. Le cariche elettriche e lo strofinio sono spiegati nella lezione [La natura elettrica della materia](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/la-natura-elettrica-della-materia).
```

```ad-warning
Polare non vuol dire carica
Una molecola polare è neutra: le cariche parziali positive e negative sono uguali e si sommano a zero. È diversa da uno ione, come $\mathrm{Na^+}$ o $\mathrm{Cl^-}$, che ha una carica intera e in più o in meno.
```

## Il legame a idrogeno

Due molecole d'acqua vicine si attraggono: l'idrogeno $\delta^+$ di una è attirato dall'ossigeno $\delta^-$ dell'altra, e in particolare da una delle sue coppie solitarie. Questa attrazione tra molecole si chiama **legame a idrogeno**, e nei disegni si segna con una linea tratteggiata, per distinguerla dai legami covalenti dentro la molecola.

```tikz
% nome: acqua-legami-idrogeno-cinque-molecole
% alt: Cinque molecole d'acqua: una al centro e quattro intorno. I due idrogeni della molecola centrale puntano verso l'ossigeno di due molecole in basso, e il suo ossigeno riceve gli idrogeni di due molecole in alto. I quattro legami a idrogeno sono linee tratteggiate arancioni, più lunghe dei legami covalenti O-H disegnati con una linea piena
% svg: acqua-legami-idrogeno-cinque-molecole-3c30e9dc.svg 256x114
\begin{tikzpicture}
\newcommand{\acqua}[3]{%
\begin{scope}[shift={(#1,#2)}, rotate=#3]
\draw[thick] (0,0) -- (-0.43,-0.33);
\draw[thick] (0,0) -- (0.43,-0.33);
\draw[thick, fill=red!20] (0,0) circle (0.26);
\draw[thick, fill=blue!10] (-0.43,-0.33) circle (0.16);
\draw[thick, fill=blue!10] (0.43,-0.33) circle (0.16);
\node at (0,0) {\scriptsize O};
\end{scope}}
\acqua{0}{0}{0}
\acqua{-1.24}{-0.96}{-52.25}
\acqua{1.24}{-0.96}{52.25}
\acqua{-1.24}{0.96}{0}
\acqua{1.24}{0.96}{0}
\draw[thick, dashed, orange!90!black] (-0.56,-0.43) -- (-1.04,-0.8);
\draw[thick, dashed, orange!90!black] (0.56,-0.43) -- (1.04,-0.8);
\draw[thick, dashed, orange!90!black] (-0.69,0.53) -- (-0.21,0.16);
\draw[thick, dashed, orange!90!black] (0.69,0.53) -- (0.21,0.16);
\draw[thin] (0.8,-0.62) -- (1.9,-0.2) node[right] {\small legame a idrogeno};
\end{tikzpicture}
```

Il legame a idrogeno non è un vero legame chimico come quello covalente: è un'attrazione tra molecole diverse, e le molecole restano intere. È anche molto più debole: per separare due molecole unite da un legame a idrogeno serve un'energia circa venti volte più piccola di quella che serve per rompere un legame $\mathrm{O{-}H}$ dentro una molecola. E la distanza tra l'idrogeno e l'ossigeno dell'altra molecola è quasi il doppio della lunghezza del legame covalente, circa $0{,}18\,\text{nm}$ contro $0{,}096\,\text{nm}$. Tra le attrazioni tra molecole, però, è una delle più forti.

Ogni molecola d'acqua ne può formare fino a quattro: due con i suoi idrogeni, che si legano all'ossigeno di due molecole vicine, e due con le sue coppie solitarie, che ricevono l'idrogeno di altre due molecole. Nel ghiaccio tutti e quattro i legami sono formati e le molecole restano ferme ai loro posti; nell'acqua liquida i legami si formano e si rompono di continuo, milioni di milioni di volte al secondo, mentre le molecole si muovono, e in ogni istante ne sono formati una buona parte ma non tutti. Nel vapore le molecole sono lontane e quasi mai legate.

Nella figura qui sotto scegli la temperatura: sotto $0\,^\circ\text{C}$ le molecole stanno nella rete ordinata del ghiaccio, tra $0$ e $100\,^\circ\text{C}$ si muovono e i legami a idrogeno, tratteggiati, si rompono e si riformano, e sopra i $100\,^\circ\text{C}$ le molecole volano via quasi sempre separate.

```interattivo
% nome: acqua-legami-idrogeno-temperatura
% alt: Ventiquattro molecole d'acqua in un riquadro, ognuna disegnata con l'ossigeno rosato e i due idrogeni azzurri, e i legami a idrogeno tra le molecole tratteggiati in arancione. Un cursore sceglie la temperatura da meno 20 a 120 gradi Celsius: sotto zero le molecole formano la rete a esagoni del ghiaccio, con tutti i legami, e vibrano appena; tra 0 e 100 gradi si muovono e i legami si rompono e si riformano, meno numerosi quando la temperatura sale; sopra 100 gradi volano separate. Sotto la figura si leggono lo stato e il numero di legami a idrogeno in quell'istante
```

Il legame a idrogeno non è una specialità dell'acqua: si forma quando un idrogeno è legato a un atomo piccolo e molto elettronegativo (ossigeno, azoto o fluoro) e trova vicino un altro di questi atomi con una coppia solitaria. C'è tra le molecole di ammoniaca, $\mathrm{NH_3}$, e di alcol, e tiene insieme i due filamenti del DNA. Al terzo anno la lezione [Il legame a idrogeno](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/il-legame-a-idrogeno) lo confronta con le altre forze tra molecole.

```ad-warning
Il legame a idrogeno non è il legame tra H e O
Il legame tra un idrogeno e l'ossigeno della stessa molecola è covalente. Il legame a idrogeno è quello tra l'idrogeno di una molecola e l'ossigeno di un'altra. Quando l'acqua bolle si rompono i legami a idrogeno, non quelli covalenti: il vapore è ancora fatto di molecole $\mathrm{H_2O}$, non di idrogeno e ossigeno separati.
```

## Perché l'acqua bolle a 100 °C

Per far bollire un liquido bisogna separare le sue molecole l'una dall'altra, e più si attraggono, più alta è la temperatura di ebollizione. Di solito, tra sostanze simili, bolle più in alto quella con le molecole più pesanti. Per l'acqua non va così. Il confronto più chiaro è con i composti dell'idrogeno con gli altri elementi del gruppo dell'ossigeno nella tavola periodica (zolfo, selenio e tellurio), che hanno la stessa formula, $\mathrm{H_2X}$, e molecole piegate come l'acqua.

| Sostanza | Massa molare ($\text{g/mol}$) | Temperatura di ebollizione ($^\circ\text{C}$) |
|---|---|---|
| $\mathrm{H_2O}$, acqua | $18{,}02$ | $100$ |
| $\mathrm{H_2S}$, solfuro di idrogeno | $34{,}09$ | $-60$ |
| $\mathrm{H_2Se}$, seleniuro di idrogeno | $81{,}0$ | $-41$ |
| $\mathrm{H_2Te}$, tellururo di idrogeno | $129{,}6$ | $-2$ |

Dal solfuro al tellururo la temperatura di ebollizione sale con la massa, come ci si aspetta. Se l'acqua seguisse la stessa regola dovrebbe bollire sotto i $-60\,^\circ\text{C}$, e sulla Terra sarebbe un gas. Invece bolle a $100\,^\circ\text{C}$, perché per portarla allo stato di vapore bisogna rompere i suoi legami a idrogeno, che negli altri tre composti non ci sono (lo zolfo, il selenio e il tellurio sono atomi più grandi e meno elettronegativi dell'ossigeno). Con il metano e i suoi simili del gruppo del carbonio, che non formano legami a idrogeno, la regola vale per tutti.

```tikz
% nome: acqua-ebollizione-idruri
% alt: Grafico della temperatura di ebollizione, da meno 180 a più 120 gradi Celsius, per i composti dell'idrogeno dei periodi 2, 3, 4 e 5. La serie del gruppo dell'ossigeno, in blu, parte da 100 gradi per l'acqua, scende a meno 60 per il solfuro di idrogeno e risale a meno 41 e a meno 2 per il seleniuro e il tellururo. La serie del gruppo del carbonio, in grigio, sale regolarmente dal metano, a meno 162 gradi, al silano, al germano e allo stannano, a meno 52. L'acqua sta molto più in alto di dove la porterebbe la tendenza degli altri
% svg: acqua-ebollizione-idruri-aa448b10.svg 353x220
% poi-interattivo: scegliere un gruppo della tavola periodica e vedere i punti comparire uno alla volta
\begin{tikzpicture}[x=1.4cm, y=0.0145cm]
\draw[gray!25, very thin] (0.6,-180) grid[xstep=1, ystep=40] (5.4,120);
\foreach \t in {-160,-120,-80,-40,0,40,80,120} \draw (0.6,\t) -- (0.53,\t) node[left] {\small $\t$};
\draw[->] (0.6,-180) -- (0.6,140) node[above] {\small $t_{\mathrm{eb}}$ ($^\circ$C)};
\draw[->] (0.6,-180) -- (5.5,-180) node[right] {\small periodo};
\foreach \p in {2,3,4,5} \draw (\p,-180) -- (\p,-186) node[below] {\small $\p$};
\draw[thick, blue] (2,100) -- (3,-60) -- (4,-41) -- (5,-2);
\foreach \x/\y in {2/100, 3/-60, 4/-41, 5/-2} \fill[blue] (\x,\y) circle (2pt);
\draw[thick, gray] (2,-162) -- (3,-112) -- (4,-88) -- (5,-52);
\foreach \x/\y in {2/-162, 3/-112, 4/-88, 5/-52} \fill[gray] (\x,\y) circle (2pt);
\draw[thin, dashed, blue] (3,-60) -- (2,-79);
\node[right] at (2.05,100) {\small $\mathrm{H_2O}$};
\node[below] at (3,-64) {\small $\mathrm{H_2S}$};
\node[above] at (4,-37) {\small $\mathrm{H_2Se}$};
\node[above] at (5,2) {\small $\mathrm{H_2Te}$};
\node[right] at (2.05,-162) {\small $\mathrm{CH_4}$};
\node[below] at (3,-116) {\small $\mathrm{SiH_4}$};
\node[below] at (4,-92) {\small $\mathrm{GeH_4}$};
\node[below] at (5,-56) {\small $\mathrm{SnH_4}$};
\end{tikzpicture}
```

Nel grafico la linea tratteggiata prolunga la tendenza dei tre composti più pesanti fino al periodo dell'ossigeno: senza legami a idrogeno l'acqua starebbe lì, intorno ai $-80\,^\circ\text{C}$. Il valore esatto non conta, e i libri danno stime diverse; conta la distanza enorme dal punto vero.

```ad-example
Esempio 2: che cosa si rompe quando l'acqua bolle
In una pentola sul fuoco l'acqua bolle e forma bolle di vapore. Le molecole nelle bolle sono ancora molecole d'acqua?

Sì. Durante l'ebollizione le molecole si separano l'una dall'altra, quindi si rompono i legami a idrogeno tra le molecole, mentre i legami covalenti $\mathrm{O{-}H}$ dentro ogni molecola restano intatti. Il vapore è acqua allo stato gassoso, $\mathrm{H_2O}$, e raffreddandosi torna liquido. Per separare l'acqua in idrogeno e ossigeno serve una trasformazione chimica, l'elettrolisi, con una quantità di energia molto più grande: è la differenza tra una [trasformazione fisica e una chimica](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/trasformazioni-fisiche-e-trasformazioni-chimiche).
```

I legami a idrogeno spiegano anche le altre proprietà insolite dell'acqua: il ghiaccio meno denso del liquido, il calore specifico alto, la tensione superficiale. Sono l'argomento della lezione [Le proprietà fisiche dell'acqua](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/le-proprieta-fisiche-dell-acqua).
