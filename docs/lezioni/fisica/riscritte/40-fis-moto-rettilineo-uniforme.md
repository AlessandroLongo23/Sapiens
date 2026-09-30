# Il moto rettilineo uniforme e il grafico spazio-tempo

Un'auto con il regolatore di velocità inserito, su un tratto d'autostrada dritto, percorre $30$ metri in ogni secondo: nel primo secondo, nel secondo, nel centesimo. Il suo è il moto più semplice che ci sia, e il punto di partenza per tutti gli altri. Si descrive con una formula di una riga e con un grafico che è una retta.

## Il moto rettilineo uniforme

Un corpo si muove di **moto rettilineo uniforme** quando la sua traiettoria è una retta e la sua velocità è costante, in valore e in verso. Allora il corpo percorre spostamenti uguali in intervalli di tempo uguali, comunque si scelgano gli intervalli, e la [velocità media](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-velocita-media-e-istantanea) su qualunque intervallo è uguale alla velocità istantanea: nel moto uniforme si scrive $v$ senza altre specificazioni.

## La legge oraria

Si fa partire l'orologio a $t = 0$, quando il corpo si trova nella posizione $s_0$, detta posizione iniziale. In un istante $t$ successivo il corpo è nella posizione $s$. La velocità, uguale su ogni intervallo, è anche la velocità media tra $0$ e $t$:

$$v = \frac{s - s_0}{t - 0}$$

Moltiplicando per $t$ e portando $s_0$ dall'altra parte si trova la **legge oraria del moto rettilineo uniforme**:

$$s = s_0 + v\,t$$

La legge oraria dà la posizione in ogni istante: al posto di una tabella di misure, come quella della lezione [Punto materiale, traiettoria e sistema di riferimento](/materiale/scuola-superiore/fisica/il-moto-rettilineo/punto-materiale-traiettoria-e-sistema-di-riferimento), c'è una formula che vale per tutti gli istanti. Il termine $v\,t$ è lo spostamento nell'intervallo da $0$ a $t$, cioè $\Delta s = v\,\Delta t$. Se il corpo parte dall'origine, $s_0 = 0$ e la legge oraria diventa $s = v\,t$: la posizione è direttamente proporzionale al tempo.

```ad-example
Esempio 1: dove si trova, e quando arriva
Un ciclista va a velocità costante $v = 6{,}0\,\text{m/s}$ lungo una pista dritta; all'istante $t = 0$ si trova in $s_0 = 150\,\text{m}$. Dove si trova a $t = 25\,\text{s}$? In quale istante passa per $s = 450\,\text{m}$?

La legge oraria è $s = 150\,\text{m} + 6{,}0\,\text{m/s} \cdot t$. A $t = 25\,\text{s}$:

$$s = 150\,\text{m} + 6{,}0\,\text{m/s} \cdot 25\,\text{s} = 150\,\text{m} + 150\,\text{m} = 300\,\text{m}$$

Per la seconda domanda si ricava $t$ dalla legge oraria, $t = \dfrac{s - s_0}{v}$:

$$t = \frac{450\,\text{m} - 150\,\text{m}}{6{,}0\,\text{m/s}} = \frac{300\,\text{m}}{6{,}0\,\text{m/s}} = 50\,\text{s}$$
```

```ad-warning
La posizione iniziale non si dimentica
Nell'esempio 1 il conto $s = v\,t = 6{,}0 \cdot 25 = 150\,\text{m}$ dà lo spostamento, non la posizione: il ciclista partiva già da $150\,\text{m}$. Allo stesso modo $t = 450 / 6{,}0 = 75\,\text{s}$ è il tempo per arrivare a $450\,\text{m}$ partendo dall'origine. La formula $s = v\,t$ vale solo quando $s_0 = 0$.
```

```ad-example
Esempio 2: una velocità negativa
Un pedone cammina su un marciapiede dritto verso l'origine del sistema di riferimento, a $1{,}6\,\text{m/s}$; all'istante $t = 0$ è in $s_0 = 80\,\text{m}$. Scrivi la legge oraria. Dove si trova dopo $20\,\text{s}$? Quando passa per l'origine?

Il pedone va nel verso negativo della retta, quindi $v = -1{,}6\,\text{m/s}$ e la legge oraria è

$$s = 80\,\text{m} - 1{,}6\,\text{m/s} \cdot t$$

Dopo $20\,\text{s}$ è in $s = 80\,\text{m} - 1{,}6\,\text{m/s} \cdot 20\,\text{s} = 80\,\text{m} - 32\,\text{m} = 48\,\text{m}$. Passa per l'origine quando $s = 0$:

$$t = \frac{0\,\text{m} - 80\,\text{m}}{-1{,}6\,\text{m/s}} = 50\,\text{s}$$
```

```ad-warning
Il segno della velocità
La velocità nella legge oraria è quella con il segno. Chi scrive $s = 80 + 1{,}6\,t$ per il pedone dell'esempio 2 lo fa allontanare dall'origine, e trova per l'arrivo in $s = 0$ un tempo negativo, $t = -50\,\text{s}$: un tempo negativo per un istante che deve venire dopo la partenza è il segnale che un segno è sbagliato.
```

## Il grafico spazio-tempo è una retta

Il grafico spazio-tempo mette il tempo $t$ sull'asse orizzontale e la posizione $s$ su quello verticale. La legge oraria $s = s_0 + v\,t$ ha la forma dell'equazione di una retta $y = m\,x + q$, come nella lezione di matematica [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari), con $t$ al posto di $x$ e $s$ al posto di $y$. Il grafico del moto rettilineo uniforme è quindi una retta, e i due numeri della legge oraria si leggono sul grafico:

- la posizione iniziale $s_0$ è il punto in cui la retta taglia l'asse $s$, a $t = 0$;
- la velocità $v$ è la [pendenza](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare) della retta, $\Delta s / \Delta t$, con la sua unità.

Più la retta è ripida, più il corpo è veloce. Una retta che sale è un moto nel verso positivo, una che scende è un moto nel verso negativo, una retta orizzontale è un corpo fermo.

```tikz
% nome: rette-spazio-tempo-tre-moti
% alt: Grafico spazio-tempo con tre rette tra 0 e 10 secondi. La retta A parte da 20 metri e sale fino a 120 metri, velocità 10 metri al secondo; la retta B parte da 100 metri e scende fino a 20 metri, velocità meno 8 metri al secondo; la retta C è orizzontale a 60 metri, un corpo fermo
% svg: rette-spazio-tempo-tre-moti-56cdce43.svg 315x220
% poi-interattivo: cambiare con due cursori la posizione iniziale e la velocità e vedere la retta spostarsi e ruotare
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.6, ystep=0.7] (0,0) grid (6.2,4.3);
\draw[->] (0,0) -- (6.6,0) node[right] {$t$ (s)};
\draw[->] (0,0) -- (0,4.7) node[above] {$s$ (m)};
\foreach \x/\t in {1.2/2,2.4/4,3.6/6,4.8/8,6/10} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {0.7/20,1.4/40,2.1/60,2.8/80,3.5/100,4.2/120} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0.7) -- (6,4.2) node[right] {$A$};
\draw[thick, orange!90!black] (0,3.5) -- (6,0.7) node[right] {$B$};
\draw[thick, green!50!black] (0,2.1) -- (6,2.1) node[right] {$C$};
\end{tikzpicture}
```

La retta $A$ è $s = 20\,\text{m} + 10\,\text{m/s} \cdot t$, la retta $B$ è $s = 100\,\text{m} - 8\,\text{m/s} \cdot t$, la retta $C$ è $s = 60\,\text{m}$. Nella figura interattiva scegli la posizione iniziale e la velocità di un'auto, poi falla partire: il grafico si disegna mentre l'auto avanza lungo la strada, e l'auto e il suo punto sul grafico stanno sempre alla stessa altezza.

```interattivo
% nome: moto-uniforme-grafico-spazio-tempo
% alt: A sinistra una strada verticale con un'auto vista dall'alto, a destra il grafico spazio-tempo con la stessa scala verticale, da 0 a 120 metri e da 0 a 12 secondi. Due cursori scelgono la posizione iniziale e la velocità, da meno 10 a 10 metri al secondo; un terzo cursore e un bottone fanno scorrere il tempo. L'auto si muove lungo la strada e il suo grafico si disegna, una retta che parte dalla posizione iniziale sull'asse s e ha per pendenza la velocità; una linea tratteggiata unisce l'auto al suo punto sul grafico, e sotto è scritta la legge oraria con i numeri
```

```ad-example
Esempio 3: la legge oraria dal grafico
Il grafico spazio-tempo di un carrello è la retta della figura. Scrivi la legge oraria del carrello.

```tikz
% nome: legge-oraria-dal-grafico
% alt: Grafico spazio-tempo di un carrello tra 0 e 10 secondi: una retta che taglia l'asse s a 30 metri e passa per il punto a 8 secondi e 90 metri. Un triangolo tratteggiato arancione tra il punto a 0 secondi e 30 metri e quello a 8 secondi e 90 metri mostra Delta t uguale a 8 secondi e Delta s uguale a 60 metri
% svg: legge-oraria-dal-grafico-55337c60.svg 315x220
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.6, ystep=0.7] (0,0) grid (6.2,4.3);
\draw[->] (0,0) -- (6.6,0) node[right] {$t$ (s)};
\draw[->] (0,0) -- (0,4.7) node[above] {$s$ (m)};
\foreach \x/\t in {1.2/2,2.4/4,3.6/6,4.8/8,6/10} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {0.7/20,1.4/40,2.1/60,2.8/80,3.5/100,4.2/120} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,1.05) -- (6,3.675);
\draw[dashed, orange!90!black, thick] (0,1.05) -- (4.8,1.05) -- (4.8,3.15);
\fill[orange!90!black] (0,1.05) circle (2pt);
\fill[orange!90!black] (4.8,3.15) circle (2pt);
\node[below, orange!90!black] at (2.4,1.05) {\small $\Delta t = 8$ s};
\node[right, orange!90!black] at (4.8,2.1) {\small $\Delta s = 60$ m};
\end{tikzpicture}
```

La retta taglia l'asse $s$ a $30\,\text{m}$, quindi $s_0 = 30\,\text{m}$. Per la pendenza si scelgono due punti della retta che cadono sugli incroci della griglia, per esempio $(0\,\text{s};\ 30\,\text{m})$ e $(8\,\text{s};\ 90\,\text{m})$:

$$v = \frac{\Delta s}{\Delta t} = \frac{90\,\text{m} - 30\,\text{m}}{8\,\text{s} - 0\,\text{s}} = \frac{60\,\text{m}}{8\,\text{s}} = 7{,}5\,\text{m/s}$$

La legge oraria è $s = 30\,\text{m} + 7{,}5\,\text{m/s} \cdot t$.
```

```ad-warning
Il grafico non è la strada
Una retta che sale nel grafico spazio-tempo non vuol dire che il corpo va in salita, e una retta che scende non vuol dire che va in discesa: il carrello dell'esempio 3 si muove su un pavimento orizzontale. Il grafico dice come cambia la posizione nel tempo; la traiettoria è sempre la retta del sistema di riferimento.
```

```ad-warning
La pendenza si calcola con le unità degli assi
La pendenza di un grafico di fisica non si misura contando i quadretti o con il righello: i quadretti dell'asse $t$ e quelli dell'asse $s$ valgono cose diverse ($2\,\text{s}$ e $20\,\text{m}$ nella figura). Si leggono sugli assi le coordinate di due punti e si divide $\Delta s$ per $\Delta t$.
```

## Il grafico velocità-tempo e lo spostamento come area

Un altro modo di disegnare lo stesso moto è il **grafico velocità-tempo**, con il tempo in orizzontale e la velocità in verticale. Nel moto rettilineo uniforme la velocità non cambia, e il grafico è una retta orizzontale all'altezza $v$.

Tra due istanti $t_1$ e $t_2$ la retta e l'asse $t$ racchiudono un rettangolo di base $\Delta t$ e altezza $v$. La sua area, calcolata con le unità degli assi, è $v \cdot \Delta t$, cioè proprio lo spostamento:

$$\Delta s = v\,\Delta t = \text{area sotto il grafico velocità-tempo}$$

```tikz
% nome: area-grafico-velocita-tempo
% alt: Grafico velocità-tempo di un moto uniforme a 6 metri al secondo, una retta orizzontale tra 0 e 10 secondi. Il rettangolo colorato tra 2 e 7 secondi, sotto la retta, ha base Delta t uguale a 5 secondi e altezza 6 metri al secondo, e la sua area è lo spostamento, 30 metri
% svg: area-grafico-velocita-tempo-f9bd5ae0.svg 314x217
% poi-interattivo: spostare i due estremi dell'intervallo e leggere l'area del rettangolo, uguale allo spostamento
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.6, ystep=0.5] (0,0) grid (6.2,4.2);
\fill[orange!25] (1.2,0) rectangle (4.2,3);
\draw[->] (0,0) -- (6.6,0) node[right] {$t$ (s)};
\draw[->] (0,0) -- (0,4.6) node[above] {$v$ (m/s)};
\foreach \x/\t in {1.2/2,2.4/4,3.6/6,4.8/8,6/10} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/2,2/4,3/6,4/8} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,3) -- (6,3);
\draw[thin] (1.2,0) -- (1.2,3);
\draw[thin] (4.2,0) -- (4.2,3);
\node at (2.7,1.5) {\small $\Delta s = 30$ m};
\end{tikzpicture}
```

Per un'auto a $6{,}0\,\text{m/s}$, tra $2{,}0\,\text{s}$ e $7{,}0\,\text{s}$ il rettangolo ha area $6{,}0\,\text{m/s} \cdot 5{,}0\,\text{s} = 30\,\text{m}$: in quei cinque secondi l'auto si sposta di $30\,\text{m}$. Se la velocità è negativa la retta sta sotto l'asse $t$, e l'area si conta con il segno meno: un carrello a $-4{,}0\,\text{m/s}$ per $5{,}0\,\text{s}$ ha $\Delta s = -4{,}0\,\text{m/s} \cdot 5{,}0\,\text{s} = -20\,\text{m}$.

L'area sotto il grafico velocità-tempo dà lo spostamento anche quando la velocità cambia, e il grafico non è più una retta orizzontale: lo si vede nella lezione [Il grafico velocità-tempo](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-grafico-velocita-tempo).

```ad-warning
Due grafici diversi
Nel grafico spazio-tempo del moto uniforme conta la pendenza, che è la velocità; nel grafico velocità-tempo conta l'area, che è lo spostamento, e la pendenza è zero. Prima di leggere un grafico si guarda che cosa c'è sull'asse verticale.
```

## Due corpi che si incontrano

Quando due corpi si muovono sulla stessa retta, ognuno ha la sua legge oraria, scritta nello **stesso sistema di riferimento**: stessa origine, stesso verso positivo, stesso orologio. I due corpi si incontrano quando sono nella stessa posizione nello stesso istante, cioè quando

$$s_A = s_B$$

Questa è un'equazione di primo grado nell'incognita $t$, come nei [problemi con le equazioni](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/problemi-con-le-equazioni) di matematica, dove l'esempio 6 è proprio un'auto e un camion che si vengono incontro. Nel grafico spazio-tempo le due leggi orarie sono due rette, e l'incontro è il punto in cui si tagliano, come nella lezione [Intersezione tra due rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/intersezione-tra-due-rette).

```ad-example
Esempio 4: due ciclisti che si vengono incontro
Due ciclisti percorrono la stessa strada dritta in versi opposti. All'istante $t = 0$ il ciclista $A$ è in $s = 0$ e va a $8{,}0\,\text{m/s}$ verso $B$; il ciclista $B$ è in $s = 420\,\text{m}$ e va a $6{,}0\,\text{m/s}$ verso $A$. Quando e dove si incontrano?

Il verso positivo va da $A$ verso $B$, quindi la velocità di $B$ è negativa. Le leggi orarie:

$$s_A = 8{,}0\,\text{m/s} \cdot t \qquad s_B = 420\,\text{m} - 6{,}0\,\text{m/s} \cdot t$$

All'incontro $s_A = s_B$:

$$
\begin{gathered}
8{,}0\,t = 420 - 6{,}0\,t \\
\Rightarrow 14\,t = 420 \\
\Rightarrow t = 30\,\text{s}
\end{gathered}
$$

La posizione si trova con una delle due leggi orarie: $s_A = 8{,}0\,\text{m/s} \cdot 30\,\text{s} = 240\,\text{m}$. Controllo con l'altra: $s_B = 420\,\text{m} - 6{,}0\,\text{m/s} \cdot 30\,\text{s} = 240\,\text{m}$.

```tikz
% nome: incontro-due-ciclisti-rette
% alt: Grafico spazio-tempo dei due ciclisti tra 0 e 40 secondi: la retta di A, blu, parte da 0 e sale; la retta di B, arancione, parte da 420 metri e scende. Le due rette si tagliano nel punto P, a 30 secondi e 240 metri, con le linee tratteggiate verso i due assi
% svg: incontro-due-ciclisti-rette-5a182cf4.svg 315x232
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.75, ystep=0.5] (0,0) grid (6.2,4.6);
\draw[->] (0,0) -- (6.6,0) node[right] {$t$ (s)};
\draw[->] (0,0) -- (0,5) node[above] {$s$ (m)};
\foreach \x/\t in {1.5/10,3/20,4.5/30,6/40} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/100,3/300,4/400} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!50] (0,0) -- (6,3.2) node[right] {$A$};
\draw[thick, orange!70] (0,4.2) -- (6,1.8) node[right] {$B$};
\draw[dashed, thin] (0,2.4) -- (4.5,2.4) -- (4.5,0);
\fill (4.5,2.4) circle (2pt) node[above] {$P$};
\node[left] at (0,2.4) {\small $240$};
\end{tikzpicture}
```
```

Quando uno dei due corpi insegue l'altro, le due velocità hanno lo stesso segno, e l'equazione è la stessa.

```ad-example
Esempio 5: un inseguimento
Un'auto passa per $s = 0$ a $30\,\text{m/s}$; nello stesso istante un camion che va nello stesso verso, a $22\,\text{m/s}$, si trova $200\,\text{m}$ più avanti. Dopo quanto tempo l'auto raggiunge il camion, e dove?

$$s_A = 30\,\text{m/s} \cdot t \qquad s_B = 200\,\text{m} + 22\,\text{m/s} \cdot t$$

$$
\begin{gathered}
30\,t = 200 + 22\,t \\
\Rightarrow 8\,t = 200 \\
\Rightarrow t = 25\,\text{s}
\end{gathered}
$$

L'auto raggiunge il camion dopo $25\,\text{s}$, in $s = 30\,\text{m/s} \cdot 25\,\text{s} = 750\,\text{m}$. Ogni secondo l'auto recupera $30 - 22 = 8$ metri, e i $200\,\text{m}$ di vantaggio li recupera in $200 / 8 = 25\,\text{s}$.
```

```ad-warning
Somma o differenza delle velocità
Nell'incontro la distanza tra i due corpi cala di $8{,}0 + 6{,}0 = 14\,\text{m}$ ogni secondo; nell'inseguimento cala di $30 - 22 = 8\,\text{m}$ ogni secondo. Chi usa la somma nell'inseguimento trova $200 / 52 \approx 3{,}8\,\text{s}$, un tempo troppo corto. L'equazione $s_A = s_B$, con le velocità scritte con il loro segno, sceglie da sola il conto giusto.
```

Nella figura qui sotto scegli l'incontro o l'inseguimento e fai scorrere il tempo: le due rette si disegnano insieme ai due veicoli, e il punto $P$ in cui si tagliano è l'istante e la posizione dell'incontro.

```interattivo
% nome: incontro-rette-spazio-tempo
% alt: A sinistra una strada verticale con un'auto e un camion visti dall'alto, a destra il loro grafico spazio-tempo con la stessa scala verticale. Un interruttore sceglie tra l'incontro, l'auto da 0 a 8 metri al secondo e il camion da 420 metri a meno 6 metri al secondo, e l'inseguimento, l'auto da 0 a 30 metri al secondo e il camion da 200 metri a 22 metri al secondo. Un cursore e un bottone fanno scorrere il tempo: le due rette si disegnano, e quando si tagliano compare il punto P dell'incontro, a 30 secondi e 240 metri oppure a 25 secondi e 750 metri; sotto sono scritte le due leggi orarie con i numeri
```
