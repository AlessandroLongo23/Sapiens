# L'energia interna

Un'auto che frena fino a fermarsi perde tutta la sua energia cinetica, e i dischi dei freni diventano roventi. La lezione [Forze dissipative e conservazione dell'energia totale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/forze-dissipative-e-conservazione-dell-energia-totale) ha già dato un nome al posto in cui quell'energia è finita: l'energia interna dei corpi. Con la [teoria cinetica](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/temperatura-ed-energia-cinetica-delle-molecole) ora si può dire con precisione che cos'è, e per un gas perfetto la si può calcolare.

## Che cos'è l'energia interna

Le molecole di un corpo non stanno mai ferme, e tra loro agiscono forze. L'**energia interna** $U$ di un sistema è la somma di due contributi:

- le energie cinetiche di tutte le sue molecole, dovute al moto disordinato di agitazione termica (lo spostamento delle molecole e, se sono fatte di più atomi, anche la loro rotazione e la vibrazione degli atomi);
- le energie potenziali dovute alle forze con cui le molecole si attraggono e si respingono.

È un'energia, e si misura in joule. Nella meccanica la lettera $U$ indicava l'energia potenziale di un corpo; in termodinamica indica sempre l'energia interna.

Nell'energia interna non entrano l'energia cinetica che il sistema ha quando si muove tutto insieme, né la sua energia potenziale gravitazionale. Una bombola di gas caricata su un treno in corsa ha più energia cinetica della stessa bombola ferma in stazione, ma la stessa energia interna: rispetto alla bombola le molecole si muovono allo stesso modo, e il gas ha la stessa temperatura.

```tikz
% nome: energia-cinetica-ordinata-ed-energia-interna
% alt: Due recipienti con le stesse molecole. Nel primo le frecce delle velocità sono tutte uguali e parallele, verso destra: è il moto ordinato del recipiente che si sposta tutto insieme, e l'energia è l'energia cinetica del corpo. Nel secondo le frecce puntano in tutte le direzioni con lunghezze diverse: è il moto disordinato delle molecole, e la loro energia è l'energia interna
% svg: energia-cinetica-ordinata-ed-energia-interna-09fbbec5.svg 254x120
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (2.8,2);
\foreach \x/\y in {0.4/0.4, 1.3/0.5, 2.0/0.35, 0.7/1.1, 1.6/1.2, 0.35/1.65, 1.2/1.7, 2.0/1.6} {
  \draw[-{Stealth}, thick, blue!60!black] (\x,\y) -- ++(0.5,0);
  \fill[blue!30] (\x,\y) circle (0.09);
  \draw (\x,\y) circle (0.09);
}
\node[below] at (1.4,-0.1) {\small moto ordinato};
\node[below] at (1.4,-0.55) {\small energia cinetica $K$};
\draw[thick] (3.8,0) rectangle (6.6,2);
\foreach \x/\y/\a/\l in {4.3/0.45/40/0.5, 5.2/0.5/160/0.4, 6.0/0.5/100/0.55, 4.4/1.2/300/0.45, 5.3/1.15/15/0.6, 4.3/1.65/200/0.3, 5.1/1.7/250/0.4, 6.1/1.5/130/0.5} {
  \draw[-{Stealth}, thick, blue!60!black] (\x,\y) -- ++(\a:\l);
  \fill[blue!30] (\x,\y) circle (0.09);
  \draw (\x,\y) circle (0.09);
}
\node[below] at (5.2,-0.1) {\small moto disordinato};
\node[below] at (5.2,-0.55) {\small energia interna $U$};
\end{tikzpicture}
```

## L'energia interna del gas perfetto

Nel modello del [gas perfetto](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-teoria-cinetica-dei-gas) le molecole non si attraggono e non si respingono: l'energia potenziale delle forze tra molecole non c'è, e l'energia interna è fatta solo di energia cinetica.

Se il gas è **monoatomico**, cioè fatto di atomi singoli come l'elio, il neon e l'argon, l'unico moto possibile è la traslazione. L'energia cinetica media di un atomo è $K_m = \frac{3}{2}\,k_B\,T$, e l'energia interna è la somma su tutti gli $N$ atomi:

$$U = N\,K_m = \frac{3}{2}\,N\,k_B\,T$$

Con $N = n\,N_A$ e $k_B\,N_A = R$ si ottiene la forma che si usa nei conti:

$$U = \frac{3}{2}\,n\,R\,T$$

con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$ e la temperatura in kelvin. Questa formula dice che l'energia interna di una data quantità di gas perfetto dipende solo dalla temperatura: non dal volume che il gas occupa, e non dalla pressione. Raddoppiando la temperatura assoluta, l'energia interna raddoppia.

```tikz
% nome: grafico-energia-interna-temperatura
% alt: Grafico dell'energia interna di un gas perfetto monoatomico in funzione della temperatura assoluta: due rette che passano per l'origine, una per 1 mole e una, con pendenza doppia, per 2 moli. Sulla retta delle 2 moli è segnato il punto a 300 kelvin, dove l'energia interna vale 7,48 kilojoule
% svg: grafico-energia-interna-temperatura-a8b5d842.svg 237x209
% poi-interattivo: scegliere il numero di moli e trascinare un punto lungo la retta per leggere temperatura ed energia interna
\begin{tikzpicture}[scale=0.72]
\draw[gray!25, very thin] (0,0) grid (7,5);
\draw[->] (0,0) -- (7.4,0);
\node[below] at (6.9,-0.5) {$T$ (K)};
\draw[->] (0,0) -- (0,5.4) node[above] {$U$ (kJ)};
\foreach \x/\t in {1/100,2/200,3/300,4/400,5/500,6/600} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/3,2/6,3/9,4/12,5/15} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (6.01,5);
\draw[thick, orange!90!black] (0,0) -- (7,2.909);
\node[above left, blue!60!black] at (5.2,4.4) {$2$ mol};
\node[below right, orange!90!black] at (5.3,2.2) {$1$ mol};
\draw[dashed, thin] (3,0) -- (3,2.493) -- (0,2.493);
\fill (3,2.493) circle (0.07);
\end{tikzpicture}
```

```ad-example
Esempio 1: l'energia interna dell'elio in una bombola
Una bombola contiene $2{,}00\,\text{mol}$ di elio a $27\,^\circ\text{C}$. Quanto vale l'energia interna del gas?

L'elio è monoatomico. La temperatura in kelvin è $T = 27 + 273 = 300\,\text{K}$.

$$U = \frac{3}{2}\,n\,R\,T = \frac{3}{2} \cdot 2{,}00\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 300\,\text{K} = 7479\,\text{J} \approx 7{,}48 \cdot 10^{3}\,\text{J}$$

È il punto segnato nel grafico. Le due moli di elio hanno una massa di $8{,}00\,\text{g}$: se la bombola viaggiasse a $30\,\text{m/s}$, l'energia cinetica del gas nel suo insieme sarebbe $\frac{1}{2} \cdot 8{,}00 \cdot 10^{-3}\,\text{kg} \cdot (30\,\text{m/s})^2 = 3{,}6\,\text{J}$, duemila volte più piccola della sua energia interna.
```

```ad-warning
Nella formula di $U$ la temperatura è in kelvin
Con $27$ al posto di $300$ l'energia interna dell'esempio 1 verrebbe $673\,\text{J}$, undici volte più piccola, e a $0\,^\circ\text{C}$ verrebbe zero.
```

### L'energia interna dalla pressione e dal volume

Per l'[equazione di stato](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto), $n\,R\,T = p\,V$. Sostituendo:

$$U = \frac{3}{2}\,p\,V$$

Serve quando del gas si conoscono la pressione e il volume, ma non il numero di moli o la temperatura.

```ad-example
Esempio 2: un palloncino di elio
Un palloncino contiene $6{,}00\,\text{L}$ di elio alla pressione di $1{,}01 \cdot 10^{5}\,\text{Pa}$. Quanto vale l'energia interna dell'elio?

Con il volume in metri cubi, $V = 6{,}00 \cdot 10^{-3}\,\text{m}^3$:

$$U = \frac{3}{2}\,p\,V = \frac{3}{2} \cdot 1{,}01 \cdot 10^{5}\,\text{Pa} \cdot 6{,}00 \cdot 10^{-3}\,\text{m}^3 = 909\,\text{J}$$

Il prodotto di una pressione per un volume è un'energia: $\text{Pa} \cdot \text{m}^3 = \text{N/m}^2 \cdot \text{m}^3 = \text{N} \cdot \text{m} = \text{J}$.
```

### La variazione di energia interna

Se la temperatura di $n$ moli di gas monoatomico passa da $T_i$ a $T_f$, l'energia interna cambia di

$$\Delta U = U_f - U_i = \frac{3}{2}\,n\,R\,\Delta T \qquad\text{con}\qquad \Delta T = T_f - T_i$$

La variazione è positiva se il gas si scalda e negativa se si raffredda. Una differenza di temperatura ha lo stesso valore in kelvin e in gradi Celsius, come ricorda la lezione sulle [scale termometriche](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche): per $\Delta T$ non serve convertire.

```ad-example
Esempio 3: l'argon che si scalda e che si raffredda
Un recipiente contiene $0{,}500\,\text{mol}$ di argon, che è monoatomico. Di quanto cambia la sua energia interna se la temperatura passa da $20\,^\circ\text{C}$ a $80\,^\circ\text{C}$? E se poi scende da $80\,^\circ\text{C}$ a $-10\,^\circ\text{C}$?

Nel primo caso $\Delta T = 80 - 20 = 60\,^\circ\text{C} = 60\,\text{K}$:

$$\Delta U = \frac{3}{2}\,n\,R\,\Delta T = \frac{3}{2} \cdot 0{,}500\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 60\,\text{K} = 373{,}9\ldots\,\text{J} \approx 374\,\text{J}$$

Nel secondo $\Delta T = -10 - 80 = -90\,\text{K}$:

$$\Delta U = \frac{3}{2} \cdot 0{,}500\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot (-90\,\text{K}) = -560{,}9\ldots\,\text{J} \approx -561\,\text{J}$$

Il segno meno dice che l'energia interna è diminuita.
```

```ad-warning
Il $273$ non si aggiunge alle differenze
Per $U$ serve la temperatura in kelvin; per $\Delta U$ serve una differenza di temperature, che è la stessa nelle due scale. Da $20\,^\circ\text{C}$ a $80\,^\circ\text{C}$ la variazione è di $60\,\text{K}$, non di $333\,\text{K}$.
```

```ad-note
I gas con molecole di più atomi
Le molecole di azoto e di ossigeno, fatte di due atomi, oltre a spostarsi ruotano, e l'energia interna contiene anche l'energia cinetica di rotazione: a parità di temperatura è più grande di $\frac{3}{2}\,n\,R\,T$. Il fattore giusto è nella lezione [I calori molari dei gas](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/i-calori-molari-dei-gas). Resta vero che l'energia interna di un gas perfetto dipende solo dalla temperatura. In questa lezione i gas sono monoatomici.
```

## L'energia interna è una funzione di stato

L'energia interna dipende solo dallo stato in cui il sistema si trova, come la pressione, il volume e la temperatura: è una **funzione di stato**. Non conserva memoria di come il sistema è arrivato in quello stato. Ne seguono due fatti che si usano di continuo.

- Quando un sistema passa da uno stato $A$ a uno stato $B$, la variazione $\Delta U = U_B - U_A$ è la stessa per qualunque [trasformazione](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/sistemi-termodinamici-e-principio-zero) che porti da $A$ a $B$, lenta o brusca, in una tappa o in dieci.
- Se dopo una serie di trasformazioni il sistema torna nello stato di partenza, cioè compie una **trasformazione ciclica**, la sua energia interna torna al valore iniziale: $\Delta U = 0$.

Succede come con la quota in montagna. Il dislivello tra il parcheggio e il rifugio è lo stesso per chi sale dal sentiero ripido e per chi prende quello lungo, e chi torna al parcheggio ha un dislivello totale nullo; la strada percorsa, invece, dipende dal sentiero.

```tikz
% nome: piano-pv-due-cammini-stessa-variazione
% alt: Il piano pressione-volume con lo stato A, a 2 litri e 3 per 10 alla quinta pascal, e lo stato B, a 6 litri e 2 per 10 alla quinta pascal. Due cammini diversi portano da A a B: il primo, in blu, va prima a destra a pressione costante fino al punto C e poi scende a volume costante; il secondo, in arancione, scende prima a volume costante fino al punto D e poi va a destra a pressione costante. La variazione di energia interna è la stessa
% svg: piano-pv-due-cammini-stessa-variazione-d6cf78d6.svg 250x241
\begin{tikzpicture}[scale=0.72]
\draw[gray!25, very thin, ystep=1.5] (0,0) grid (7,6);
\draw[->] (0,0) -- (7.5,0);
\node[below] at (7.0,-0.55) {$V$ (L)};
\draw[->] (0,0) -- (0,6.5) node[above] {$p$ ($10^5$ Pa)};
\foreach \x in {1,2,3,4,5,6,7} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {1.5/1,3/2,4.5/3,6/4} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (2,4.5) -- (6,4.5) -- (6,3);
\draw[-{Stealth}, thick, blue!60] (3.9,4.5) -- (4.2,4.5);
\draw[-{Stealth}, thick, blue!60] (6,3.9) -- (6,3.6);
\draw[thick, orange!90!black] (2,4.5) -- (2,3) -- (6,3);
\draw[-{Stealth}, thick, orange!90!black] (2,3.9) -- (2,3.6);
\draw[-{Stealth}, thick, orange!90!black] (3.9,3) -- (4.2,3);
\fill (2,4.5) circle (0.08) node[above left] {$A$};
\fill (6,3) circle (0.08) node[below right] {$B$};
\fill (6,4.5) circle (0.06) node[above right] {$C$};
\fill (2,3) circle (0.06) node[below left] {$D$};
\end{tikzpicture}
```

```ad-example
Esempio 4: da A a B per due strade
Un gas perfetto monoatomico passa dallo stato $A$ ($V_A = 2{,}00\,\text{L}$, $p_A = 3{,}00 \cdot 10^{5}\,\text{Pa}$) allo stato $B$ ($V_B = 6{,}00\,\text{L}$, $p_B = 2{,}00 \cdot 10^{5}\,\text{Pa}$). Una volta lo fa passando per $C$, un'altra passando per $D$, come nella figura. Di quanto cambia l'energia interna nei due casi?

L'energia interna è una funzione di stato: basta calcolarla in $A$ e in $B$, senza guardare il cammino. Con $U = \frac{3}{2}\,p\,V$ e i volumi in metri cubi:

$$U_A = \frac{3}{2} \cdot 3{,}00 \cdot 10^{5}\,\text{Pa} \cdot 2{,}00 \cdot 10^{-3}\,\text{m}^3 = 900\,\text{J} \qquad U_B = \frac{3}{2} \cdot 2{,}00 \cdot 10^{5}\,\text{Pa} \cdot 6{,}00 \cdot 10^{-3}\,\text{m}^3 = 1800\,\text{J}$$

$$\Delta U = U_B - U_A = 1800\,\text{J} - 900\,\text{J} = 900\,\text{J}$$

La variazione è $900\,\text{J}$ lungo il cammino che passa per $C$ e lungo quello che passa per $D$. Se poi il gas torna da $B$ ad $A$, per qualunque strada, la variazione è $-900\,\text{J}$, e sull'intero ciclo $\Delta U = 0$.
```

```ad-warning
Il calore e il lavoro non sono funzioni di stato
Un gas ha un'energia interna, ma non "contiene" calore e non "contiene" lavoro. Calore e lavoro sono energia che passa durante una trasformazione, e il loro valore dipende dal cammino: tra gli stessi stati $A$ e $B$ possono essere diversi, mentre $\Delta U$ è sempre la stessa. Se ne occupano le lezioni sul [lavoro](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-lavoro-in-una-trasformazione-termodinamica) e sul [primo principio](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica).
```

## L'esperienza di Joule: l'espansione libera

Che l'energia interna di un gas non dipenda dal volume è una conseguenza del modello, e va controllata con un esperimento. Lo fece James Prescott Joule nel 1845. Due recipienti di metallo, collegati da un tubo con un rubinetto, sono immersi nell'acqua di un calorimetro. Nel primo c'è aria compressa, nel secondo è stato fatto il vuoto. Aprendo il rubinetto l'aria si espande e riempie tutti e due i recipienti: è un'**espansione libera**, perché il gas non deve spingere niente.

```tikz
% nome: joule-espansione-libera-schema
% alt: Lo schema dell'esperienza di Joule, prima e dopo. Prima: due recipienti sferici collegati da un tubo con un rubinetto chiuso, immersi in una vasca d'acqua con un termometro; il recipiente di sinistra è pieno di molecole, quello di destra è vuoto. Dopo: il rubinetto è aperto e le molecole sono divise tra i due recipienti; il termometro segna la stessa temperatura
% svg: joule-espansione-libera-schema-c6d585f9.svg 296x123
\begin{tikzpicture}
\foreach \o/\t in {0/prima, 4.2/dopo} {
  \draw[thick] (\o,2.1) -- (\o,0) -- (\o+3.5,0) -- (\o+3.5,2.1);
  \draw[thin, blue] (\o,1.8) -- (\o+3.5,1.8);
  \draw[thick] (\o+0.9,0.85) circle (0.6);
  \draw[thick] (\o+2.3,0.85) circle (0.6);
  \draw[thick] (\o+1.5,0.85) -- (\o+1.7,0.85);
  \draw[thick] (\o+3.15,0.5) -- (\o+3.15,2.6);
  \fill[red!50] (\o+3.15,0.5) circle (0.09);
  \node[above] at (\o+1.6,2.2) {\small \t};
  \node[below] at (\o+1.75,0) {\small acqua};
}
\draw[thick] (1.5,0.72) -- (1.7,0.98);
\draw[thick] (1.5,0.98) -- (1.7,0.72);
\foreach \x/\y in {0.6/0.6, 0.9/0.5, 1.2/0.65, 0.55/0.9, 0.85/0.85, 1.15/0.95, 0.7/1.15, 1.0/1.2, 1.25/1.15, 0.5/1.1, 1.05/0.7, 0.75/0.7} \fill[blue!60!black] (\x,\y) circle (0.045);
\foreach \x/\y in {0.6/0.6, 1.2/0.65, 0.85/0.85, 0.7/1.15, 1.25/1.15, 1.05/0.6} \fill[blue!60!black] (\x+4.2,\y) circle (0.045);
\foreach \x/\y in {2.0/0.6, 2.6/0.7, 2.25/0.9, 2.05/1.15, 2.6/1.1, 2.35/0.5} \fill[blue!60!black] (\x+4.2,\y) circle (0.045);
\end{tikzpicture}
```

Joule misurò la temperatura dell'acqua prima e dopo, e non trovò nessuna variazione. L'acqua non ha ceduto né ricevuto calore dal gas; il gas, espandendosi nel vuoto, non ha compiuto lavoro su niente. Nessuna energia è entrata nel gas e nessuna ne è uscita: la sua energia interna è rimasta la stessa. Eppure il volume è aumentato e la pressione è diminuita. L'unica grandezza che non è cambiata, insieme all'energia interna, è la temperatura. La conclusione è che l'energia interna di un gas perfetto non dipende dal volume e dalla pressione, ma solo dalla temperatura.

Nella figura qui sotto puoi ripetere l'esperienza con le molecole del modello. Prima di togliere la parete, prova a prevedere: quando il gas occupa tutto il recipiente, le molecole sono più lente, più veloci o veloci come prima? Poi confronta con il secondo modo di espandersi, in cui il gas spinge un pistone.

```interattivo
% nome: espansione-libera-gas
% alt: Un recipiente diviso a metà da una parete: a sinistra le molecole di un gas in moto, a destra il vuoto. Un bottone toglie la parete e il gas si espande in tutto il recipiente: il volume raddoppia, la pressione si dimezza, la velocità delle molecole, la temperatura e la barra dell'energia interna restano uguali. Un selettore sceglie invece l'espansione contro un pistone che arretra: le molecole che lo urtano rimbalzano più lente, e temperatura ed energia interna diminuiscono. Un cursore fissa la temperatura iniziale da 200 a 500 kelvin
```

Nell'espansione libera le molecole urtano solo pareti ferme, e a ogni urto ripartono con la stessa velocità: la velocità quadratica media, e con lei la temperatura e l'energia interna, non cambiano. La pressione si dimezza solo perché le stesse molecole hanno il doppio dello spazio. Contro il pistone che arretra, invece, ogni molecola rimbalza un po' più lenta di come è arrivata, come una palla contro una racchetta che si tira indietro: il gas cede energia al pistone e si raffredda. Questa energia ceduta è il lavoro, l'argomento della [prossima lezione](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-lavoro-in-una-trasformazione-termodinamica).

```ad-example
Esempio 5: prima e dopo l'espansione libera
In un recipiente isolato $0{,}100\,\text{mol}$ di elio occupano $2{,}00\,\text{L}$ a $300\,\text{K}$; una parete li separa da un vano vuoto, anch'esso di $2{,}00\,\text{L}$. Si toglie la parete. Quanto valgono la pressione e l'energia interna prima e dopo?

Prima, con $V_i = 2{,}00 \cdot 10^{-3}\,\text{m}^3$:

$$p_i = \frac{n\,R\,T}{V_i} = \frac{0{,}100\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 300\,\text{K}}{2{,}00 \cdot 10^{-3}\,\text{m}^3} = 1{,}2465 \cdot 10^{5}\,\text{Pa} \approx 1{,}25 \cdot 10^{5}\,\text{Pa}$$

$$U_i = \frac{3}{2}\,n\,R\,T = \frac{3}{2} \cdot 0{,}100\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 300\,\text{K} = 373{,}9\ldots\,\text{J} \approx 374\,\text{J}$$

L'espansione è libera e il recipiente è isolato: l'energia interna non cambia, quindi nemmeno la temperatura. Dopo, $U_f = 374\,\text{J}$ e $T = 300\,\text{K}$, mentre il volume è raddoppiato e la pressione si è dimezzata:

$$p_f = \frac{n\,R\,T}{V_f} = \frac{249{,}3\,\text{J}}{4{,}00 \cdot 10^{-3}\,\text{m}^3} = 6{,}2325 \cdot 10^{4}\,\text{Pa} \approx 6{,}23 \cdot 10^{4}\,\text{Pa}$$
```

```ad-note
Nei gas reali la temperatura cambia un po'
L'esperimento di Joule non era abbastanza sensibile per accorgersene, ma un gas reale che si espande liberamente di solito si raffredda leggermente. Le sue molecole un po' si attraggono: allontanandosi, la loro energia potenziale aumenta a spese dell'energia cinetica, come un sasso che sale rallenta. Lo misurarono pochi anni dopo lo stesso Joule e William Thomson, il futuro Lord Kelvin. Più il gas è rarefatto, più l'effetto è piccolo: nel gas perfetto non c'è.
```

## Come cambia l'energia interna

L'energia interna di un sistema si può cambiare in due modi.

- Con il [calore](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico): mettendo il sistema a contatto con un corpo più caldo, che gli cede energia, o più freddo, che gliene toglie.
- Con il lavoro: comprimendo un gas con un pistone, strofinando, rimescolando. Nel mulinello di Joule, dove i pesi che scendono fanno girare delle pale nell'acqua, l'acqua si scalda senza nessuna fiamma.

Guardando lo stato finale non si può dire quale dei due modi è stato usato: l'acqua a $30\,^\circ\text{C}$ scaldata sul fornello e quella scaldata dalle pale hanno la stessa energia interna. Il bilancio preciso tra calore, lavoro e variazione di energia interna è il [primo principio della termodinamica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica).

Se il sistema è isolato, niente entra e niente esce, e la sua energia interna totale resta costante qualunque cosa succeda al suo interno. È quello che serve nell'ultimo esempio.

```tikz
% nome: due-gas-recipiente-isolato
% alt: Un recipiente con doppia parete, isolato, diviso in due da una parete sottile che conduce il calore. A sinistra 2,00 moli di elio a 300 kelvin, a destra 3,00 moli di argon a 400 kelvin. Una freccia indica il calore che passa dall'argon all'elio
% svg: due-gas-recipiente-isolato-a8d29845.svg 254x83
\begin{tikzpicture}
\fill[gray!20, even odd rule] (-0.2,-0.2) rectangle (6.4,1.9) (0,0) rectangle (6.2,1.7);
\fill[blue!10] (0,0) rectangle (2.5,1.7);
\fill[orange!25] (2.5,0) rectangle (6.2,1.7);
\draw[thick] (-0.2,-0.2) rectangle (6.4,1.9);
\draw[thick] (0,0) rectangle (6.2,1.7);
\draw[thick] (2.5,0) -- (2.5,1.7);
\node at (1.25,1.25) {\small $2{,}00$ mol di elio};
\node at (1.25,0.8) {\small $300$ K};
\node at (4.35,1.25) {\small $3{,}00$ mol di argon};
\node at (4.35,0.8) {\small $400$ K};
\draw[-{Stealth}, thick] (3.1,0.25) -- (1.9,0.25);
\node[right] at (3.1,0.25) {\small calore};
\end{tikzpicture}
```

```ad-example
Esempio 6: due gas in un recipiente isolato
Un recipiente rigido e isolato è diviso in due da una parete che conduce il calore. Da una parte ci sono $2{,}00\,\text{mol}$ di elio a $300\,\text{K}$, dall'altra $3{,}00\,\text{mol}$ di argon a $400\,\text{K}$. Quale temperatura raggiungono i due gas? Di quanto cambia l'energia interna di ciascuno?

Il recipiente è isolato, quindi l'energia interna totale non cambia: quella che l'argon perde, l'elio la guadagna. All'equilibrio i due gas, tutti e due monoatomici, hanno la stessa temperatura $T_f$:

$$\frac{3}{2}\,n_1\,R\,T_1 + \frac{3}{2}\,n_2\,R\,T_2 = \frac{3}{2}\,(n_1 + n_2)\,R\,T_f$$

Il fattore $\frac{3}{2}\,R$ si semplifica:

$$T_f = \frac{n_1\,T_1 + n_2\,T_2}{n_1 + n_2} = \frac{2{,}00\,\text{mol} \cdot 300\,\text{K} + 3{,}00\,\text{mol} \cdot 400\,\text{K}}{5{,}00\,\text{mol}} = 360\,\text{K}$$

Per l'elio $\Delta T = +60\,\text{K}$, per l'argon $\Delta T = -40\,\text{K}$:

$$\Delta U_1 = \frac{3}{2} \cdot 2{,}00 \cdot 8{,}31 \cdot 60\,\text{J} = 1495{,}8\,\text{J} \approx 1{,}50 \cdot 10^{3}\,\text{J} \qquad \Delta U_2 = \frac{3}{2} \cdot 3{,}00 \cdot 8{,}31 \cdot (-40)\,\text{J} \approx -1{,}50 \cdot 10^{3}\,\text{J}$$

Le due variazioni sono uguali e opposte, come deve essere. La temperatura finale è la media delle due temperature pesata con i numeri di moli, e sta più vicina a quella del gas più abbondante.
```

```ad-warning
Solo nel gas perfetto $U$ dipende dalla sola temperatura
Nei solidi, nei liquidi e nei gas reali conta anche l'energia potenziale delle forze tra le molecole. Un chilogrammo di ghiaccio a $0\,^\circ\text{C}$ e un chilogrammo d'acqua a $0\,^\circ\text{C}$ hanno la stessa temperatura ma energie interne diverse: per fondere il ghiaccio bisogna dargli il [calore latente](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/i-passaggi-di-stato-e-il-calore-latente), che aumenta l'energia potenziale delle molecole senza cambiarne l'agitazione.
```
