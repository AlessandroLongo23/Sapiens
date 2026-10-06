# L'equazione di stato del gas perfetto

Un pallone sonda parte da terra floscio, gonfiato solo in parte, e sale per chilometri: intorno a lui la pressione dell'aria cala, e cala anche la temperatura. La pressione più bassa lo farebbe gonfiare, il freddo lo farebbe restringere. Per sapere quanto diventa grande non basta la [legge di Boyle](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-legge-di-boyle), che vuole la temperatura costante, e non bastano le [leggi di Gay-Lussac](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/le-leggi-di-gay-lussac), che vogliono costante la pressione o il volume. Serve una legge che leghi pressione, volume e temperatura quando cambiano tutti insieme: l'equazione di stato.

## Dalle tre leggi a una sola

Una certa quantità di gas passa da uno stato $A$, con pressione $p_1$, volume $V_1$ e temperatura assoluta $T_1$, a uno stato $B$ con $p_2$, $V_2$ e $T_2$. Comunque sia andata davvero la trasformazione, si può immaginare di arrivare da $A$ a $B$ in due tappe, ognuna con una legge che conosci.

```tikz
% nome: gas-perfetto-due-tappe-isoterma-isobara
% alt: Il piano pressione-volume con due isoterme, alle temperature T1 e T2. Dallo stato A sull'isoterma T1 il gas scende lungo l'isoterma fino allo stato intermedio C, alla pressione p2; da C un segmento orizzontale, a pressione costante, lo porta allo stato B sull'isoterma T2
\begin{tikzpicture}
\draw[->] (0,0) -- (6,0) node[right] {$V$};
\draw[->] (0,0) -- (0,5) node[above] {$p$};
\draw[thin, blue!60, domain=1.0:5.5, samples=60, smooth] plot (\x, {4.8/\x});
\draw[thin, red!80!black, domain=1.5:5.5, samples=60, smooth] plot (\x, {7.2/\x});
\draw[very thick, blue!60, domain=1.2:3, samples=40, smooth] plot (\x, {4.8/\x});
\draw[-{Stealth}, very thick, orange!90!black] (3,1.6) -- (4.44,1.6);
\fill (1.2,4) circle (0.06) node[above right] {$A$};
\fill (3,1.6) circle (0.06) node[below left] {$C$};
\fill (4.5,1.6) circle (0.06) node[above right] {$B$};
\node[right, blue!60] at (5.5,0.8) {$T_1$};
\node[right, red!80!black] at (5.5,1.35) {$T_2$};
\draw[dashed, thin] (0,4) -- (1.2,4) -- (1.2,0);
\draw[dashed, thin] (0,1.6) -- (3,1.6) -- (3,0);
\draw[dashed, thin] (4.5,1.6) -- (4.5,0);
\node[left] at (0,4) {$p_1$};
\node[left] at (0,1.6) {$p_2$};
\node[below] at (1.2,0) {$V_1$};
\node[below] at (3,0) {$V_C$};
\node[below] at (4.5,0) {$V_2$};
\end{tikzpicture}
```

Nella prima tappa il gas va da $A$ a uno stato intermedio $C$ a temperatura costante $T_1$, finché la pressione diventa $p_2$. È un'isoterma, e per la legge di Boyle

$$p_1\,V_1 = p_2\,V_C$$

Nella seconda tappa il gas va da $C$ a $B$ a pressione costante $p_2$, mentre la temperatura passa da $T_1$ a $T_2$. È un'isobara, e per la prima legge di Gay-Lussac

$$\frac{V_C}{T_1} = \frac{V_2}{T_2}$$

Dalla prima uguaglianza $V_C = \dfrac{p_1\,V_1}{p_2}$. Sostituendo nella seconda si ottiene $\dfrac{p_1\,V_1}{p_2\,T_1} = \dfrac{V_2}{T_2}$, e moltiplicando i due membri per $p_2$:

$$\frac{p_1\,V_1}{T_1} = \frac{p_2\,V_2}{T_2}$$

Lo stato intermedio è sparito: restano solo lo stato iniziale e quello finale. Per una data quantità di gas il rapporto $\dfrac{p\,V}{T}$ ha lo stesso valore in tutti gli stati, qualunque strada si faccia per passare dall'uno all'altro.

```ad-example
Esempio 1: il pallone sonda
Un pallone sonda viene riempito a terra con $2{,}0\,\text{m}^3$ di elio, a $20\,^\circ\text{C}$ e alla pressione di $1{,}01 \cdot 10^5\,\text{Pa}$. Sale fino a una quota dove la pressione è $2{,}5 \cdot 10^4\,\text{Pa}$ e la temperatura $-50\,^\circ\text{C}$. Che volume ha lassù, se l'elio prende la pressione e la temperatura dell'aria intorno?

Le temperature vanno in kelvin: $T_1 = 20 + 273 = 293\,\text{K}$ e $T_2 = -50 + 273 = 223\,\text{K}$. Da $\dfrac{p_1 V_1}{T_1} = \dfrac{p_2 V_2}{T_2}$:

$$V_2 = V_1 \cdot \frac{p_1}{p_2} \cdot \frac{T_2}{T_1} = 2{,}0\,\text{m}^3 \cdot \frac{1{,}01 \cdot 10^5\,\text{Pa}}{2{,}5 \cdot 10^4\,\text{Pa}} \cdot \frac{223\,\text{K}}{293\,\text{K}} = 2{,}0\,\text{m}^3 \cdot 4{,}04 \cdot 0{,}761 = 6{,}1\,\text{m}^3$$

I due effetti sono separati nei due rapporti: la pressione, quattro volte più bassa, da sola porterebbe il volume a $8{,}1\,\text{m}^3$; il freddo lo riduce di un quarto. Per questo il pallone parte floscio: deve avere lo spazio per triplicare.
```

## Quanto gas: moli e molecole

Il valore di $\dfrac{p\,V}{T}$ dipende da quanto gas c'è. Per contare il gas la massa non è la grandezza giusta: un grammo di elio e un grammo di azoto, nello stesso recipiente alla stessa temperatura, hanno pressioni diverse. Quello che conta è il numero di molecole.

Le molecole sono troppe per contarle una a una, e si contano a pacchetti. Una **mole** è la quantità di sostanza che contiene un numero fissato di particelle, il **numero di Avogadro**:

$$N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$$

Il numero di moli si indica con $n$ e il numero di molecole con $N$:

$$N = n\,N_A$$

Per passare dalla massa alle moli serve la **massa molare** $M$, la massa di una mole di quella sostanza: $n = \dfrac{m}{M}$. In grammi per mole vale quanto la massa di una molecola in unità di massa atomica: $4{,}0\,\text{g/mol}$ per l'elio, $28{,}0\,\text{g/mol}$ per l'azoto $\text{N}_2$, $32{,}0\,\text{g/mol}$ per l'ossigeno $\text{O}_2$. La mole è una grandezza che la fisica prende dalla chimica: come nasce e come si usa è nella lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare).

```tikz
% nome: gas-perfetto-massa-moli-molecole
% alt: Tre riquadri in fila collegati da frecce nei due versi: la massa m in grammi, il numero di moli n e il numero di molecole N. Dalla massa alle moli si divide per la massa molare M, dalle moli alle molecole si moltiplica per il numero di Avogadro; nel verso opposto si moltiplica per M e si divide per il numero di Avogadro
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) rectangle (1.8,1);
\draw[thick, fill=blue!10] (3.6,0) rectangle (5.4,1);
\draw[thick, fill=blue!10] (7.2,0) rectangle (9.6,1);
\node at (0.9,0.5) {massa $m$};
\node at (4.5,0.5) {moli $n$};
\node at (8.4,0.5) {molecole $N$};
\draw[-{Stealth}, thick] (1.9,0.7) -- (3.5,0.7);
\draw[-{Stealth}, thick] (3.5,0.3) -- (1.9,0.3);
\draw[-{Stealth}, thick] (5.5,0.7) -- (7.1,0.7);
\draw[-{Stealth}, thick] (7.1,0.3) -- (5.5,0.3);
\node[above] at (2.7,0.7) {$: M$};
\node[below] at (2.7,0.3) {$\cdot\, M$};
\node[above] at (6.3,0.7) {$\cdot\, N_A$};
\node[below] at (6.3,0.3) {$: N_A$};
\end{tikzpicture}
```

```ad-example
Esempio 2: moli e molecole in un palloncino
Un palloncino contiene $6{,}0\,\text{g}$ di elio. Quante moli sono, e quanti atomi? (L'elio è fatto di atomi singoli, con $M = 4{,}0\,\text{g/mol}$.)

$$n = \frac{m}{M} = \frac{6{,}0\,\text{g}}{4{,}0\,\text{g/mol}} = 1{,}5\,\text{mol} \qquad N = n\,N_A = 1{,}5\,\text{mol} \cdot 6{,}02 \cdot 10^{23}\,\text{mol}^{-1} = 9{,}0 \cdot 10^{23}$$
```

## L'equazione di stato

Nel 1811 Amedeo Avogadro propose che volumi uguali di gas diversi, alla stessa pressione e alla stessa temperatura, contengano lo stesso numero di molecole (è il [principio di Avogadro](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/il-principio-di-avogadro)). Ne segue che, a pressione e temperatura fissate, raddoppiando le moli raddoppia il volume: il rapporto $\dfrac{p\,V}{T}$ è proporzionale a $n$, e la costante di proporzionalità è la stessa per l'elio, per l'azoto e per ogni altro gas. Si chiama **costante universale dei gas** e si indica con $R$:

$$p\,V = n\,R\,T \qquad\qquad R = 8{,}31\,\frac{\text{J}}{\text{mol} \cdot \text{K}}$$

È l'**equazione di stato del gas perfetto**. Lega le quattro grandezze che descrivono un gas: note tre, dà la quarta, senza bisogno di uno stato iniziale e di uno finale.

L'unità di $R$ contiene il joule perché il prodotto di una pressione per un volume è un'energia, $1\,\text{Pa} \cdot 1\,\text{m}^3 = 1\,\text{J}$. Di conseguenza con $R = 8{,}31$ le grandezze vanno tutte nelle unità del Sistema Internazionale: la pressione in pascal, il volume in metri cubi, la temperatura in kelvin.

Il valore di $R$ si misura. Una mole di qualunque gas, a $0\,^\circ\text{C}$ e alla pressione di un'atmosfera ($1{,}013 \cdot 10^5\,\text{Pa}$, con una cifra in più del solito), occupa $22{,}4\,\text{L}$. Quindi

$$R = \frac{p\,V}{n\,T} = \frac{1{,}013 \cdot 10^5\,\text{Pa} \cdot 22{,}4 \cdot 10^{-3}\,\text{m}^3}{1\,\text{mol} \cdot 273\,\text{K}} = 8{,}31\,\frac{\text{J}}{\text{mol} \cdot \text{K}}$$

Per usare l'equazione:

1. Scrivi i dati e porta la temperatura in kelvin, il volume in metri cubi ($1\,\text{L} = 10^{-3}\,\text{m}^3$), la pressione in pascal ($1\,\text{atm} = 1{,}01 \cdot 10^5\,\text{Pa}$).
2. Se è data la massa del gas, trova le moli con $n = m/M$.
3. Ricava l'incognita: $p = \dfrac{n R T}{V}$, $V = \dfrac{n R T}{p}$, $n = \dfrac{p V}{R T}$, $T = \dfrac{p V}{n R}$.
4. Sostituisci con le unità e riporta il risultato nell'unità richiesta.

```ad-example
Esempio 3: il volume di una mole in una stanza
Che volume occupa una mole di gas a $20\,^\circ\text{C}$ e alla pressione di $1{,}01 \cdot 10^5\,\text{Pa}$?

Con $T = 20 + 273 = 293\,\text{K}$:

$$V = \frac{n\,R\,T}{p} = \frac{1{,}00\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 293\,\text{K}}{1{,}01 \cdot 10^5\,\text{Pa}} = 0{,}0241\,\text{m}^3 = 24{,}1\,\text{L}$$

Un po' più dei $22{,}4\,\text{L}$ che occupa a $0\,^\circ\text{C}$: a temperatura più alta, alla stessa pressione, il gas è più dilatato.
```

```ad-example
Esempio 4: quanto azoto c'è in una bombola
Una bombola da $10{,}0\,\text{L}$ contiene azoto ($M = 28{,}0\,\text{g/mol}$) alla pressione di $2{,}00 \cdot 10^6\,\text{Pa}$ e alla temperatura di $20\,^\circ\text{C}$. Quante moli di azoto contiene, e qual è la loro massa?

Il volume in metri cubi è $V = 10{,}0\,\text{L} = 1{,}00 \cdot 10^{-2}\,\text{m}^3$ e la temperatura è $T = 293\,\text{K}$:

$$n = \frac{p\,V}{R\,T} = \frac{2{,}00 \cdot 10^6\,\text{Pa} \cdot 1{,}00 \cdot 10^{-2}\,\text{m}^3}{8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 293\,\text{K}} = 8{,}21\,\text{mol}$$

$$m = n\,M = 8{,}21\,\text{mol} \cdot 28{,}0\,\text{g/mol} = 230\,\text{g}$$

La massa ha tre cifre significative, $2{,}30 \cdot 10^2\,\text{g}$.
```

```ad-warning
Litri e gradi Celsius nell'equazione
Nell'esempio 4, con $V = 10{,}0$ (litri) al posto di $1{,}00 \cdot 10^{-2}$ (metri cubi) vengono $8210\,\text{mol}$, mille volte troppo: più di duecento chili di azoto in una bombola da dieci litri. Con $t = 20$ (gradi Celsius) al posto di $T = 293$ vengono $120\,\text{mol}$, quasi quindici volte troppo. Converti prima di sostituire, e chiediti se il risultato è ragionevole.
```

## Con il numero di molecole: la costante di Boltzmann

L'equazione si può scrivere contando le molecole una a una invece che a moli. Poiché $n = \dfrac{N}{N_A}$, il secondo membro diventa $\dfrac{N}{N_A}\,R\,T$. Il rapporto $\dfrac{R}{N_A}$ è una nuova costante, la **costante di Boltzmann**:

$$k_B = \frac{R}{N_A} = \frac{8{,}31\,\text{J/(mol}\cdot\text{K)}}{6{,}02 \cdot 10^{23}\,\text{mol}^{-1}} = 1{,}38 \cdot 10^{-23}\,\frac{\text{J}}{\text{K}}$$

e l'equazione di stato prende la forma

$$p\,V = N\,k_B\,T$$

Le due scritture dicono la stessa cosa. $R$ è la costante per una mole, $k_B$ è la costante per una molecola: per questo è così piccola. La forma con $k_B$ è quella che serve quando si ragiona sulle singole molecole, come nella lezione [La teoria cinetica dei gas](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-teoria-cinetica-dei-gas).

```ad-example
Esempio 5: le molecole in un centimetro cubo d'aria
Quante molecole ci sono in $1{,}0\,\text{cm}^3$ d'aria a $20\,^\circ\text{C}$ e alla pressione di $1{,}01 \cdot 10^5\,\text{Pa}$?

Con $V = 1{,}0\,\text{cm}^3 = 1{,}0 \cdot 10^{-6}\,\text{m}^3$ e $T = 293\,\text{K}$:

$$N = \frac{p\,V}{k_B\,T} = \frac{1{,}01 \cdot 10^5\,\text{Pa} \cdot 1{,}0 \cdot 10^{-6}\,\text{m}^3}{1{,}38 \cdot 10^{-23}\,\text{J/K} \cdot 293\,\text{K}} = 2{,}5 \cdot 10^{19}$$

Venticinque miliardi di miliardi di molecole in un volume grande come un dado. Anche nel vuoto migliore dei laboratori, a una pressione di $10^{-8}\,\text{Pa}$, in quel centimetro cubo ne restano più di due milioni: basta dividere per $10^{13}$, perché a temperatura e volume fissati $N$ è proporzionale a $p$.
```

## Il gas perfetto è un modello

Nessun gas vero obbedisce esattamente all'equazione $p\,V = n\,R\,T$. Il **gas perfetto**, che in chimica si chiama [gas ideale](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/l-equazione-di-stato-dei-gas-ideali), è un modello: un gas immaginario che la rispetta in ogni condizione, e quindi rispetta in ogni condizione la legge di Boyle e le due leggi di Gay-Lussac. Dal punto di vista delle molecole è un gas in cui le molecole sono così piccole rispetto alle distanze che le separano da potersi considerare punti, e non esercitano forze l'una sull'altra se non quando si urtano.

Un gas vero assomiglia a questo modello quando è rarefatto, cioè a bassa pressione, e quando la sua temperatura è molto più alta di quella a cui diventa liquido. In queste condizioni le molecole sono lontane e veloci, e il loro volume e le loro attrazioni contano poco. L'aria, l'azoto, l'ossigeno e l'elio a temperatura ambiente e a pressioni di qualche atmosfera sono descritti molto bene dal modello; il vapore d'acqua vicino ai $100\,^\circ\text{C}$ o un gas in una bombola a centinaia di atmosfere molto meno. Un gas perfetto, per quanto lo si comprima o lo si raffreddi, non diventa mai liquido: quando un gas vero lo fa, il modello ha già smesso di valere.

## Le tre leggi dentro l'equazione

L'equazione di stato contiene le leggi da cui è nata. Per una quantità fissa di gas il prodotto $n\,R$ è costante; se in più resta costante la temperatura, tutto il secondo membro è costante e $p\,V = \text{costante}$: è la legge di Boyle. Se resta costante la pressione, $\dfrac{V}{T} = \dfrac{n\,R}{p}$ è costante: è la prima legge di Gay-Lussac. Se resta costante il volume, $\dfrac{p}{T} = \dfrac{n\,R}{V}$ è costante: è la seconda.

Ora si può anche dare un numero alle isoterme del piano pressione-volume. Per $n$ moli alla temperatura $T$ l'isoterma è la curva $p = \dfrac{n\,R\,T}{V}$: il prodotto $p \cdot V$, che nella lezione sulla legge di Boyle era "una costante", vale $n\,R\,T$.

```tikz
% nome: gas-perfetto-isoterme-una-mole
% alt: Il piano pressione-volume per una mole di gas perfetto, con il volume in litri fino a 50 e la pressione in kilopascal fino a 250. Tre isoterme, a 200, 300 e 400 kelvin, sono tre rami di iperbole sempre più lontani dagli assi. Un punto segna lo stato dell'esempio 3, a 24,1 litri e 101 kilopascal, appena sotto l'isoterma dei 300 kelvin
% poi-interattivo: trascinare lo stato nel piano e leggere la temperatura
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (5,5);
\draw[->] (0,0) -- (5.5,0);
\node[below] at (5.3,-0.35) {$V$ (L)};
\draw[->] (0,0) -- (0,5.5) node[above] {$p$ (kPa)};
\foreach \x/\t in {1/10,2/20,3/30,4/40,5/50} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/50,2/100,3/150,4/200,5/250} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60, domain=0.665:5, samples=60, smooth] plot (\x, {3.324/\x});
\draw[thick, orange!90!black, domain=0.997:5, samples=60, smooth] plot (\x, {4.986/\x});
\draw[thick, red!80!black, domain=1.33:5, samples=60, smooth] plot (\x, {6.648/\x});
\node[right, blue!60] at (5,0.6) {$200$ K};
\node[right, orange!90!black] at (5,1.0) {$300$ K};
\node[right, red!80!black] at (5,1.4) {$400$ K};
\fill (2.41,2.02) circle (0.06);
\end{tikzpicture}
```

Nella figura qui sotto lo stato del gas è un punto che puoi trascinare nel piano, e la temperatura si legge dall'equazione. Parti da uno stato a $300\,\text{K}$ e prova a portare il gas a $600\,\text{K}$: in quanti modi ci riesci?

```interattivo
% nome: gas-perfetto-piano-pv
% alt: Il piano pressione-volume di un gas perfetto, con tre isoterme di riferimento a 200, 400 e 600 kelvin. Un punto, lo stato del gas, si trascina nel piano: sotto si leggono pressione, volume e la temperatura calcolata con l'equazione di stato, e una curva arancione mostra l'isoterma che passa per il punto. Si può lasciare il punto libero oppure obbligarlo a muoversi a temperatura costante lungo la sua isoterma, a pressione costante in orizzontale o a volume costante in verticale; un cursore cambia il numero di moli da 0,5 a 2
```

In infiniti modi. Raddoppiando il volume a pressione costante, raddoppiando la pressione a volume costante, oppure cambiandoli tutti e due: basta che il prodotto $p \cdot V$ raddoppi. La temperatura di un gas perfetto non dipende dalla pressione e dal volume presi uno per uno, ma dal loro prodotto. Se poi aumenti le moli lasciando fermo il punto, la temperatura scende: la stessa pressione nello stesso volume si ottiene con più molecole meno calde.

## Quando il gas esce

La formula $\dfrac{p_1 V_1}{T_1} = \dfrac{p_2 V_2}{T_2}$ è comoda perché non chiede il numero di moli, ma vale solo se le moli non cambiano. Quando una parte del gas esce dal recipiente, o ne entra dell'altro, bisogna tornare all'equazione di stato e scriverla per ciascuno dei due stati.

```ad-example
Esempio 6: l'ossigeno consumato
Una bombola da $20{,}0\,\text{L}$ contiene ossigeno a $27\,^\circ\text{C}$, alla pressione di $1{,}50 \cdot 10^6\,\text{Pa}$. Dopo un certo uso, alla stessa temperatura, il manometro segna $9{,}00 \cdot 10^5\,\text{Pa}$. Quante moli di ossigeno sono uscite?

Volume e temperatura sono gli stessi prima e dopo: $V = 2{,}00 \cdot 10^{-2}\,\text{m}^3$ e $T = 300\,\text{K}$. Le moli sono $n_1 = \dfrac{p_1 V}{R T}$ all'inizio e $n_2 = \dfrac{p_2 V}{R T}$ alla fine, quindi ne sono uscite

$$n_1 - n_2 = \frac{(p_1 - p_2)\,V}{R\,T} = \frac{6{,}00 \cdot 10^5\,\text{Pa} \cdot 2{,}00 \cdot 10^{-2}\,\text{m}^3}{8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 300\,\text{K}} = 4{,}81\,\text{mol}$$

All'inizio le moli erano $12{,}0$: ne è uscito il $40\%$, e la pressione è scesa del $40\%$. In un recipiente rigido a temperatura costante la pressione è proporzionale al numero di moli, e il manometro di una bombola è di fatto un indicatore di quanto gas resta.
```

```ad-warning
La quantità di gas deve restare la stessa
Nell'esempio 6 la formula $p_1 V_1 / T_1 = p_2 V_2 / T_2$ darebbe un'uguaglianza falsa: volume e temperatura non cambiano, la pressione sì. Non c'è nessun errore nei dati: è cambiato $n$. Prima di usare quella formula controlla che il recipiente sia chiuso.
```
