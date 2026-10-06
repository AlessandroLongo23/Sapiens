# Il primo principio della termodinamica

Per scaldare di un grado un chilogrammo d'acqua ci sono due strade. La prima è metterlo su una fiamma finché ha ricevuto $4186\,\text{J}$ di calore. La seconda è quella dell'[esperimento di Joule](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico): chiuderlo in un recipiente isolato e rimescolarlo con un mulinello, finché le pale hanno compiuto $4186\,\text{J}$ di lavoro. Alla fine l'acqua è nello stesso identico stato, e nessuna misura può dire quale delle due strade è stata seguita. Il primo principio della termodinamica mette in un'unica equazione queste due maniere di dare energia a un sistema, il calore e il lavoro, ed è la legge di conservazione dell'energia scritta per i sistemi che si scaldano e si raffreddano.

```tikz
% nome: acqua-scaldata-calore-o-lavoro
% alt: Due recipienti uguali con un chilogrammo d'acqua che passa da 20 a 21 gradi Celsius. Sotto il primo c'è una fiamma, con una freccia che entra nel recipiente e la scritta Q uguale a 4186 joule. Nel secondo, chiuso e isolato, gira un mulinello a pale, con la scritta lavoro di 4186 joule. Lo stato finale dell'acqua è lo stesso
% svg: acqua-scaldata-calore-o-lavoro-c89b9c2c.svg 282x137
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (2.2,1.5);
\draw[thin] (0,1.5) -- (2.2,1.5);
\draw[thick] (0,1.9) -- (0,0) -- (2.2,0) -- (2.2,1.9);
\node at (1.1,0.75) {\small $20 \to 21$ $^\circ$C};
\draw[thick, fill=orange!25] (1.1,-0.95) .. controls (0.75,-0.8) and (0.95,-0.5) .. (1.1,-0.3) .. controls (1.25,-0.5) and (1.45,-0.8) .. (1.1,-0.95);
\draw[-{Stealth}, thick, orange!90!black] (1.75,-0.9) -- (1.75,-0.1);
\node[right] at (1.8,-0.6) {\small $Q = 4186$ J};
\fill[cyan!20] (5.0,0) rectangle (7.2,1.5);
\draw[thin] (5.0,1.5) -- (7.2,1.5);
\draw[thick] (5.0,1.9) -- (5.0,0) -- (7.2,0) -- (7.2,1.9) -- cycle;
\draw[thick] (6.1,2.5) -- (6.1,0.75);
\draw[thick, fill=gray!20] (5.55,0.45) rectangle (6.65,0.75);
\draw[-{Stealth}, thick, blue] (5.75,2.25) arc[start angle=160, end angle=380, x radius=0.38, y radius=0.14];
\node at (6.1,-0.35) {\small $20 \to 21$ $^\circ$C};
\node at (6.1,-0.8) {\small lavoro di $4186$ J};
\end{tikzpicture}
```

## Due modi di scambiare energia

Un sistema termodinamico ha un'[energia interna](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/l-energia-interna) $U$, la somma delle energie cinetiche e potenziali delle sue molecole, che dipende solo dallo stato in cui il sistema si trova. Per cambiarla bisogna far passare energia attraverso il confine tra il sistema e l'ambiente, e i modi sono due.

- Il **calore** $Q$ è l'energia che passa per una differenza di temperatura: dalla fiamma all'acqua, dal tè caldo alla tazza.
- Il **lavoro** $W$ è l'energia che passa perché una forza sposta qualcosa: un gas che spinge un pistone, le pale che rimescolano l'acqua. Per un gas si calcola come spiega la lezione [Il lavoro in una trasformazione termodinamica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-lavoro-in-una-trasformazione-termodinamica).

Calore e lavoro si misurano entrambi in joule, come l'energia interna. Non sono però energie che il sistema possiede: sono quantità di energia in transito, che esistono solo mentre la trasformazione avviene.

## L'enunciato e i segni

Le convenzioni sui segni sono queste:

| Grandezza | Positiva | Negativa |
|---|---|---|
| calore $Q$ | il sistema assorbe calore dall'ambiente | il sistema cede calore all'ambiente |
| lavoro $W$ | il sistema compie lavoro sull'ambiente (un gas si espande) | l'ambiente compie lavoro sul sistema (un gas viene compresso) |

Il calore assorbito fa aumentare l'energia interna; il lavoro compiuto dal sistema la fa diminuire, perché è energia che il sistema spende. Il **primo principio della termodinamica** dice che la variazione dell'energia interna di un sistema, in una trasformazione qualunque, è il calore che il sistema assorbe meno il lavoro che compie:

$$\Delta U = Q - W$$

dove $\Delta U = U_f - U_i$ è l'energia interna finale meno quella iniziale.

```tikz
% nome: primo-principio-schema-segni
% alt: Due schemi di un sistema, disegnato come un rettangolo con scritto delta U. Nel primo una freccia entra da sinistra, con scritto Q maggiore di zero, calore assorbito, e una freccia esce a destra, con scritto W maggiore di zero, lavoro compiuto. Nel secondo le frecce sono rovesciate: una esce a sinistra, Q minore di zero, calore ceduto, e una entra da destra, W minore di zero, lavoro subito
% svg: primo-principio-schema-segni-3f21706f.svg 201x121
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,1.9) rectangle (2.0,3.1);
\node at (1.0,2.5) {$\Delta U$};
\draw[-{Stealth}, thick, orange!90!black] (-1.5,2.5) -- (0,2.5);
\draw[-{Stealth}, thick, blue] (2.0,2.5) -- (3.5,2.5);
\node[above] at (-0.85,2.5) {\small $Q > 0$};
\node[below] at (-0.85,2.5) {\small assorbito};
\node[above] at (2.85,2.5) {\small $W > 0$};
\node[below] at (2.85,2.5) {\small compiuto};
\draw[thick, fill=blue!10] (0,0) rectangle (2.0,1.2);
\node at (1.0,0.6) {$\Delta U$};
\draw[-{Stealth}, thick, orange!90!black] (0,0.6) -- (-1.5,0.6);
\draw[-{Stealth}, thick, blue] (3.5,0.6) -- (2.0,0.6);
\node[above] at (-0.75,0.6) {\small $Q < 0$};
\node[below] at (-0.75,0.6) {\small ceduto};
\node[above] at (2.75,0.6) {\small $W < 0$};
\node[below] at (2.75,0.6) {\small subito};
\end{tikzpicture}
```

Il principio è un bilancio, come quello di un conto in banca: l'energia interna è il saldo, il calore assorbito è un versamento e il lavoro compiuto un prelievo. Il saldo cambia della differenza tra quello che entra e quello che esce, e non conta se i soldi sono arrivati in contanti o con un bonifico.

```ad-example
Esempio 1: calore assorbito e lavoro compiuto
Un gas in un cilindro assorbe $500\,\text{J}$ di calore e, espandendosi, compie $200\,\text{J}$ di lavoro. Di quanto cambia la sua energia interna?

Il calore è assorbito, $Q = +500\,\text{J}$; il lavoro è compiuto dal gas, $W = +200\,\text{J}$.

$$\Delta U = Q - W = 500\,\text{J} - 200\,\text{J} = 300\,\text{J}$$

Dei $500\,\text{J}$ entrati come calore, $200\,\text{J}$ sono usciti come lavoro e $300\,\text{J}$ sono rimasti nel gas, che è più caldo di prima.
```

```tikz
% nome: bilancio-calore-lavoro-energia-interna
% alt: Una barra orizzontale lunga 500 joule, il calore Q assorbito dal gas dell'esempio 1. Sotto, una barra della stessa lunghezza divisa in due parti: 200 joule di lavoro W compiuto e 300 joule di aumento dell'energia interna, delta U
% svg: bilancio-calore-lavoro-energia-interna-2a2b2b70.svg 193x53
\begin{tikzpicture}
\draw[thick, fill=orange!25] (0,1.0) rectangle (5.0,1.5);
\node at (2.5,1.25) {\small $Q = 500$ J};
\draw[thick, fill=blue!10] (0,0.2) rectangle (2.0,0.7);
\draw[thick, fill=green!15] (2.0,0.2) rectangle (5.0,0.7);
\node at (1.0,0.45) {\small $W = 200$ J};
\node at (3.5,0.45) {\small $\Delta U = 300$ J};
\draw[dashed, thin] (2.0,0.7) -- (2.0,1.0);
\end{tikzpicture}
```

```ad-example
Esempio 2: una compressione con calore ceduto
Si comprime un gas compiendo su di esso un lavoro di $350\,\text{J}$. Durante la compressione il gas cede all'ambiente $120\,\text{J}$ di calore. Di quanto cambia la sua energia interna?

Il lavoro è compiuto sul gas, quindi il lavoro del gas è negativo: $W = -350\,\text{J}$. Il calore è ceduto: $Q = -120\,\text{J}$.

$$\Delta U = Q - W = -120\,\text{J} - (-350\,\text{J}) = -120\,\text{J} + 350\,\text{J} = 230\,\text{J}$$

L'energia interna aumenta di $230\,\text{J}$: il gas ha ricevuto $350\,\text{J}$ come lavoro e ne ha restituiti $120$ come calore.
```

```ad-warning
Il lavoro fatto sul gas ha il segno meno
Nella formula $W$ è il lavoro compiuto dal sistema. Se il testo dice "si compie sul gas un lavoro di $350\,\text{J}$", allora $W = -350\,\text{J}$, e $-W$ diventa $+350\,\text{J}$. Chi mette $W = +350\,\text{J}$ nell'esempio 2 trova $\Delta U = -470\,\text{J}$: un gas che si raffredda mentre lo si comprime.
```

```ad-warning
Calore e lavoro nella stessa unità
Nel bilancio $Q$ e $W$ devono essere tutti e due in joule. Un calore dato in calorie va convertito: $1\,\text{cal} = 4{,}186\,\text{J}$ e $1\,\text{kcal} = 4186\,\text{J}$.
```

```ad-note
Un'altra convenzione
Alcuni libri, e quasi sempre quelli di chimica, chiamano $W$ il lavoro compiuto sul sistema, e scrivono il principio come $\Delta U = Q + W$. La legge è la stessa: cambia solo il nome dato al lavoro. In queste lezioni $W$ è sempre il lavoro compiuto dal sistema, e la formula ha il meno.
```

Nella figura qui sotto un gas a $300\,\text{K}$ scambia con l'ambiente il calore e il lavoro che scegli con i due cursori. Che cosa succede all'energia interna se il gas assorbe $300\,\text{J}$ di calore e ne spende $300$ in lavoro? E se viene compresso senza scambiare calore?

```interattivo
% nome: primo-principio-bilancio
% alt: Un gas in un cilindro con un pistone, a 300 kelvin. Due cursori scelgono il calore Q e il lavoro W della trasformazione, ciascuno da meno 600 a 600 joule. Una freccia sotto il cilindro mostra il calore che entra o che esce, una freccia sul pistone il lavoro compiuto dal gas, verso l'esterno, o subito, verso l'interno. Accanto, tre barre che salgono o scendono da una linea dello zero: Q, W e la variazione di energia interna, uguale a Q meno W. Sotto sono scritti i tre valori e la variazione di temperatura del gas, che è una mole di gas perfetto monoatomico. Tre bottoni impostano tre casi: scaldare a pistone bloccato, comprimere senza calore, tutto il calore in lavoro
```

Con $Q = 300\,\text{J}$ e $W = 300\,\text{J}$ tutta l'energia entrata come calore esce come lavoro: $\Delta U = 0$ e la temperatura del gas resta $300\,\text{K}$. Assorbire calore non vuol dire scaldarsi. Con $Q = 0$ e $W = -300\,\text{J}$ si ha $\Delta U = +300\,\text{J}$: il gas si scalda senza che nessuno gli abbia dato calore, come l'aria nella pompa della bicicletta, che dopo qualche colpo deciso è calda al tatto.

```ad-warning
La temperatura non segue il calore
"Il gas assorbe calore, quindi la sua temperatura sale" è sbagliato: bisogna prima togliere il lavoro. La temperatura segue l'energia interna, e l'energia interna segue $Q - W$. Un gas può assorbire calore e raffreddarsi, se compie più lavoro del calore che riceve.
```

## Il primo principio è la conservazione dell'energia

Riscritto come $Q = \Delta U + W$, il principio dice dove finisce il calore che un sistema assorbe: una parte resta nel sistema come energia interna, il resto esce come lavoro. Non compare energia dal nulla e non ne sparisce. È la [conservazione dell'energia totale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/forze-dissipative-e-conservazione-dell-energia-totale) che conosci dalla meccanica, estesa ai casi in cui l'energia passa come calore. La formularono, tra il 1842 e il 1850, Julius Robert Mayer, James Prescott Joule e Hermann von Helmholtz.

Una conseguenza riguarda le macchine. Una macchina che lavora a ciclo torna ogni volta nello stato iniziale, e in un ciclo la sua energia interna non cambia: $\Delta U = 0$, quindi $W = Q$. Il lavoro che fornisce in un ciclo è uguale al calore totale che scambia, cioè a quello che assorbe meno quello che cede. Una macchina che fornisse lavoro senza assorbire calore, che si chiama **moto perpetuo di prima specie**, violerebbe il primo principio: per questo non ne è mai stata costruita una, nonostante secoli di tentativi.

## Quello che dipende dal cammino e quello che non ne dipende

L'energia interna è una funzione di stato: $\Delta U$ dipende solo dallo stato iniziale e da quello finale. Il lavoro invece dipende dalla trasformazione seguita, cioè dalla linea percorsa nel piano pressione-volume. Poiché $Q = \Delta U + W$, anche il calore dipende dal cammino: se tra gli stessi due stati il lavoro cambia e $\Delta U$ no, deve cambiare il calore, e della stessa quantità.

```ad-example
Esempio 3: stessi stati, calori diversi
Un gas perfetto va dallo stato $A$ ($2{,}0\,\text{L}$, $3{,}0 \cdot 10^5\,\text{Pa}$) allo stato $B$ ($6{,}0\,\text{L}$, $1{,}0 \cdot 10^5\,\text{Pa}$). Lungo il cammino $A \to C \to B$, che passa in alto, compie $1200\,\text{J}$ di lavoro; lungo il cammino $A \to D \to B$, che passa in basso, ne compie $400$ (sono i conti dell'esempio 4 della lezione sul lavoro). Quanto calore assorbe in ciascun caso?

Negli stati $A$ e $B$ il prodotto $p\,V$ è lo stesso:

$$p_A V_A = 3{,}0 \cdot 10^5\,\text{Pa} \cdot 2{,}0 \cdot 10^{-3}\,\text{m}^3 = 600\,\text{J}$$

$$p_B V_B = 1{,}0 \cdot 10^5\,\text{Pa} \cdot 6{,}0 \cdot 10^{-3}\,\text{m}^3 = 600\,\text{J}$$

Per l'[equazione di stato](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto) $p\,V = n\,R\,T$ i due stati hanno la stessa temperatura, e l'energia interna di un gas perfetto dipende solo dalla temperatura: $\Delta U = 0$ lungo qualunque cammino da $A$ a $B$. Allora $Q = \Delta U + W = W$:

$$Q_{ACB} = 0 + 1200\,\text{J} = 1{,}2 \cdot 10^3\,\text{J}$$

$$Q_{ADB} = 0 + 400\,\text{J} = 4{,}0 \cdot 10^2\,\text{J}$$

Il gas parte e arriva negli stessi stati, ma passando in alto assorbe il triplo del calore.
```

```tikz
% nome: due-cammini-calore-diverso
% alt: Il piano pressione-volume con gli stati A, a 2 litri e 300 kilopascal, e B, a 6 litri e 100 kilopascal, uniti da una curva tratteggiata, l'isoterma su cui la temperatura è la stessa. Il cammino in alto, da A in orizzontale fino a C e poi giù fino a B, ha scritto W uguale a Q uguale a 1200 joule. Il cammino in basso, da A giù fino a D e poi in orizzontale fino a B, ha scritto W uguale a Q uguale a 400 joule
% svg: due-cammini-calore-diverso-4ac06533.svg 307x200
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.8, ystep=0.9] (0,0) grid (5.6,3.6);
\draw[->] (-0.3,0) -- (6.1,0) node[right] {$V$ (L)};
\draw[->] (0,-0.3) -- (0,4.1) node[above] {$p$ (kPa)};
\foreach \x/\l in {0.8/1,1.6/2,2.4/3,3.2/4,4.0/5,4.8/6,5.6/7} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\l$};
\foreach \y/\l in {0.9/100,1.8/200,2.7/300,3.6/400} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\l$};
\draw[dashed, thin] plot[domain=1.25:5.6, samples=40] (\x,{4.32/\x});
\draw[thick, blue] (1.6,2.7) -- (4.8,2.7) -- (4.8,0.9);
\draw[thick, red] (1.6,2.7) -- (1.6,0.9) -- (4.8,0.9);
\draw[-{Stealth}, thick, blue] (3.0,2.7) -- (3.4,2.7);
\draw[-{Stealth}, thick, blue] (4.8,2.0) -- (4.8,1.6);
\draw[-{Stealth}, thick, red] (1.6,2.0) -- (1.6,1.6);
\draw[-{Stealth}, thick, red] (3.0,0.9) -- (3.4,0.9);
\fill (1.6,2.7) circle (1.5pt) node[left] {$A$};
\fill (4.8,2.7) circle (1.5pt) node[above right] {$C$};
\fill (4.8,0.9) circle (1.5pt) node[above right] {$B$};
\fill (1.6,0.9) circle (1.5pt) node[left] {$D$};
\node[above] at (3.2,2.75) {\small $W = Q = 1200$ J};
\node[below] at (3.2,0.85) {\small $W = Q = 400$ J};
\end{tikzpicture}
```

Per questo non si dice mai che un corpo "contiene" calore, come non si dice che contiene lavoro. Un corpo ha un'energia interna; calore e lavoro sono i due nomi dell'energia mentre entra o esce.

## Il primo principio nei problemi

1. Decidi qual è il sistema (di solito il gas) e che cosa è ambiente.
2. Leggi dal testo i segni: calore assorbito $Q > 0$, ceduto $Q < 0$; lavoro compiuto dal sistema $W > 0$, compiuto sul sistema $W < 0$.
3. Porta tutto in joule. Se il lavoro non è dato, per un gas a pressione costante è $W = p\,\Delta V$.
4. Scrivi $\Delta U = Q - W$ e ricava la grandezza che manca: $Q = \Delta U + W$ oppure $W = Q - \Delta U$.
5. Controlla il segno del risultato: $\Delta U > 0$ vuol dire che il sistema ha più energia di prima.

```ad-example
Esempio 4: il lavoro va calcolato
Un gas chiuso in un cilindro con un pistone libero, alla pressione costante di $1{,}5 \cdot 10^5\,\text{Pa}$, assorbe $1{,}5 \cdot 10^3\,\text{J}$ di calore e si espande da $3{,}0\,\text{L}$ a $7{,}0\,\text{L}$. Di quanto cambia la sua energia interna?

Il lavoro a pressione costante, con $\Delta V = 4{,}0\,\text{L} = 4{,}0 \cdot 10^{-3}\,\text{m}^3$:

$$W = p\,\Delta V = 1{,}5 \cdot 10^5\,\text{Pa} \cdot 4{,}0 \cdot 10^{-3}\,\text{m}^3 = 6{,}0 \cdot 10^2\,\text{J}$$

Il calore è assorbito, $Q = +1{,}5 \cdot 10^3\,\text{J}$:

$$\Delta U = Q - W = 1500\,\text{J} - 600\,\text{J} = 9{,}0 \cdot 10^2\,\text{J}$$
```

```ad-example
Esempio 5: dall'energia interna alla temperatura
Il gas dell'esempio 4 è elio, un gas monoatomico, e nel cilindro ce ne sono $0{,}20\,\text{mol}$. Di quanto è salita la sua temperatura?

Per un gas perfetto monoatomico $U = \tfrac{3}{2}\,n\,R\,T$ (lezione [L'energia interna](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/l-energia-interna)), quindi $\Delta U = \tfrac{3}{2}\,n\,R\,\Delta T$ e

$$\Delta T = \frac{2\,\Delta U}{3\,n\,R} = \frac{2 \cdot 9{,}0 \cdot 10^2\,\text{J}}{3 \cdot 0{,}20\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)}} = 361{,}0\ldots\,\text{K} \approx 3{,}6 \cdot 10^2\,\text{K}$$

Dei $1500\,\text{J}$ di calore assorbiti, solo $900$ hanno scaldato il gas.
```

```ad-example
Esempio 6: trovare il calore
Un gas viene compresso con un lavoro di $800\,\text{J}$ compiuto su di esso, e alla fine la sua energia interna è aumentata di $300\,\text{J}$. Quanto calore ha scambiato, e in che verso?

Il lavoro è compiuto sul gas: $W = -800\,\text{J}$. Dal principio,

$$Q = \Delta U + W = 300\,\text{J} + (-800\,\text{J}) = -500\,\text{J}$$

Il segno meno dice che il gas ha ceduto $500\,\text{J}$ di calore all'ambiente: degli $800\,\text{J}$ ricevuti come lavoro, ne ha tenuti $300$.
```

## Quattro casi semplici

In quattro situazioni uno dei tre termini del principio è zero, e l'equazione si accorcia.

| Situazione | Che cosa è zero | Il principio diventa |
|---|---|---|
| sistema isolato (nessuno scambio con l'ambiente) | $Q = 0$ e $W = 0$ | $\Delta U = 0$ |
| volume costante | $W = 0$ | $\Delta U = Q$ |
| nessuno scambio di calore (trasformazione adiabatica) | $Q = 0$ | $\Delta U = -W$ |
| trasformazione ciclica | $\Delta U = 0$ | $Q = W$ |

L'energia interna di un sistema isolato non cambia, qualunque cosa succeda al suo interno. A volume costante tutto il calore diventa energia interna. In una compressione senza scambi di calore tutto il lavoro subito diventa energia interna, ed è il caso della pompa della bicicletta. In un ciclo il lavoro totale è uguale al calore totale: per il ciclo rettangolare della lezione sul lavoro, che fornisce $800\,\text{J}$ a ogni giro, il calore assorbito dal gas a ogni giro deve superare di $800\,\text{J}$ quello ceduto.

Questi casi hanno ciascuno la sua lezione: il volume costante e i cicli in [Le trasformazioni isocora, isobara e isoterma](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma), l'assenza di scambi di calore in [La trasformazione adiabatica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/la-trasformazione-adiabatica), e l'uso dei cicli per ottenere lavoro in [Le macchine termiche e il rendimento](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/le-macchine-termiche-e-il-rendimento).
