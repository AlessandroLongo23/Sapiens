# Il centro di massa

Un martello lanciato in aria ruota su se stesso, e la testa e il manico descrivono curve complicate. Eppure c'è un punto del martello, vicino alla testa, che segue una parabola pulita, la stessa di un sasso lanciato allo stesso modo. Quel punto è il centro di massa. Per qualunque sistema, per quanto i suoi pezzi ruotino, si urtino o si separino, il centro di massa si muove come un solo punto materiale in cui sta tutta la massa: è quello che permette di trattare un'auto, un pianeta o un tuffatore come un punto.

## Il centro di massa di due corpi

Prendiamo due punti materiali di massa $m_1$ e $m_2$ su una retta, nelle posizioni $x_1$ e $x_2$. Il loro **centro di massa** è il punto di ascissa

$$x_{cm} = \frac{m_1 x_1 + m_2 x_2}{m_1 + m_2}$$

È una media delle due posizioni in cui ciascuna pesa in proporzione alla sua massa. Se le masse sono uguali il centro di massa è il punto medio; se sono diverse sta sul segmento che unisce i due corpi, più vicino a quello di massa maggiore. Le sue distanze dai due corpi sono inversamente proporzionali alle masse: da un corpo che ha il triplo della massa dell'altro, il centro di massa dista un terzo.

```ad-example
Esempio 1: due sfere su un'asta
Due sfere di $1{,}5\,\text{kg}$ e $4{,}5\,\text{kg}$ sono fissate a un'asta di massa trascurabile, nelle posizioni $x_1 = 0{,}20\,\text{m}$ e $x_2 = 1{,}0\,\text{m}$. Dove si trova il centro di massa?

$$x_{cm} = \frac{m_1 x_1 + m_2 x_2}{m_1 + m_2} = \frac{1{,}5\,\text{kg} \cdot 0{,}20\,\text{m} + 4{,}5\,\text{kg} \cdot 1{,}0\,\text{m}}{1{,}5\,\text{kg} + 4{,}5\,\text{kg}} = \frac{4{,}8\,\text{kg}\cdot\text{m}}{6{,}0\,\text{kg}} = 0{,}80\,\text{m}$$

```tikz
% nome: centro-massa-due-sfere
% alt: Un asse x con le tacche a 0, 0,20, 0,80 e 1,0 metri. Sopra l'asse un'asta sottile con una sfera piccola di 1,5 chilogrammi a 0,20 metri e una sfera grande di 4,5 chilogrammi a 1,0 metri; il centro di massa, un punto nero, è a 0,80 metri, a 0,60 metri dalla sfera piccola e a 0,20 metri dalla grande. Le distanze sono in scala, 5 centimetri per metro
% svg: centro-massa-due-sfere-c093db36.svg 285x102
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (6.0,0) node[right] {$x$ (m)};
\foreach \x/\l in {0/0, 1/{0{,}20}, 4/{0{,}80}, 5/{1{,}0}} {
\draw (\x,0.08) -- (\x,-0.08);
\node[below] at (\x,-0.08) {\small $\l$};
}
\draw[thick] (1,1.1) -- (5,1.1);
\draw[thick, fill=blue!10] (1,1.1) circle (0.22);
\draw[thick, fill=blue!10] (5,1.1) circle (0.38);
\fill (4,1.1) circle (2pt);
\node[above] at (4,1.2) {\small cm};
\node[above] at (1,1.35) {\small $1{,}5$ kg};
\node[above] at (5,1.5) {\small $4{,}5$ kg};
\draw[dashed, thin] (1,0.1) -- (1,0.85);
\draw[dashed, thin] (4,0.1) -- (4,1.0);
\draw[dashed, thin] (5,0.1) -- (5,0.7);
\end{tikzpicture}
```

Il centro di massa è a $0{,}60\,\text{m}$ dalla sfera piccola e a $0{,}20\,\text{m}$ dalla grande: la sfera grande ha il triplo della massa, e il centro di massa le sta tre volte più vicino.
```

Lo zero dell'asse si può mettere dove si vuole: cambiano i numeri $x_1$, $x_2$ e $x_{cm}$, ma il punto trovato è lo stesso. Di solito conviene metterlo su uno dei due corpi, così un termine della somma sparisce.

```ad-example
Esempio 2: il centro di massa del sistema Terra-Luna
La Terra ha massa $5{,}97 \cdot 10^{24}\,\text{kg}$ e la Luna $7{,}35 \cdot 10^{22}\,\text{kg}$; la distanza media tra i loro centri è $3{,}84 \cdot 10^8\,\text{m}$. A che distanza dal centro della Terra si trova il centro di massa del sistema?

Con l'origine nel centro della Terra, $x_1 = 0$ e $x_2 = 3{,}84 \cdot 10^8\,\text{m}$:

$$x_{cm} = \frac{m_L\,x_2}{m_T + m_L} = \frac{7{,}35 \cdot 10^{22}\,\text{kg} \cdot 3{,}84 \cdot 10^8\,\text{m}}{5{,}97 \cdot 10^{24}\,\text{kg} + 7{,}35 \cdot 10^{22}\,\text{kg}} = \frac{2{,}82 \cdot 10^{31}\,\text{kg}\cdot\text{m}}{6{,}04 \cdot 10^{24}\,\text{kg}} = 4{,}67 \cdot 10^6\,\text{m}$$

Il raggio della Terra è $6{,}37 \cdot 10^6\,\text{m}$: il centro di massa del sistema Terra-Luna si trova dentro la Terra, circa $1700\,\text{km}$ sotto la superficie. Nella somma delle masse i due termini vanno portati alla stessa potenza di dieci: $5{,}97 \cdot 10^{24} + 0{,}0735 \cdot 10^{24} \approx 6{,}04 \cdot 10^{24}$.
```

```ad-warning
Il centro di massa non è il punto medio
Il punto medio tra le due sfere dell'esempio 1 è a $0{,}60\,\text{m}$, il centro di massa a $0{,}80\,\text{m}$. I due punti coincidono solo se le masse sono uguali.
```

## Più corpi, nel piano e nello spazio

Con più di due corpi la formula si allunga, un termine per corpo. Per $n$ punti materiali su una retta, con $M = m_1 + m_2 + \ldots + m_n$ la massa totale,

$$x_{cm} = \frac{m_1 x_1 + m_2 x_2 + \ldots + m_n x_n}{M}$$

Se i corpi sono in un piano, il centro di massa ha due coordinate e la stessa formula vale per ciascuna, con le $x$ per l'una e le $y$ per l'altra:

$$x_{cm} = \frac{m_1 x_1 + m_2 x_2 + \ldots + m_n x_n}{M} \qquad y_{cm} = \frac{m_1 y_1 + m_2 y_2 + \ldots + m_n y_n}{M}$$

Nello spazio si aggiunge allo stesso modo la coordinata $z$.

```ad-example
Esempio 3: tre masse nel piano
Tre palline di $1{,}0\,\text{kg}$, $2{,}0\,\text{kg}$ e $3{,}0\,\text{kg}$ si trovano nei punti $(0;\,0)$, $(3{,}0\,\text{m};\,0)$ e $(1{,}0\,\text{m};\,2{,}0\,\text{m})$. Dove si trova il centro di massa?

La massa totale è $M = 6{,}0\,\text{kg}$.

$$x_{cm} = \frac{1{,}0\,\text{kg} \cdot 0 + 2{,}0\,\text{kg} \cdot 3{,}0\,\text{m} + 3{,}0\,\text{kg} \cdot 1{,}0\,\text{m}}{6{,}0\,\text{kg}} = \frac{9{,}0\,\text{kg}\cdot\text{m}}{6{,}0\,\text{kg}} = 1{,}5\,\text{m}$$

$$y_{cm} = \frac{1{,}0\,\text{kg} \cdot 0 + 2{,}0\,\text{kg} \cdot 0 + 3{,}0\,\text{kg} \cdot 2{,}0\,\text{m}}{6{,}0\,\text{kg}} = \frac{6{,}0\,\text{kg}\cdot\text{m}}{6{,}0\,\text{kg}} = 1{,}0\,\text{m}$$

```tikz
% nome: centro-massa-tre-masse-piano
% alt: Un piano cartesiano con la griglia, un centimetro per metro. Tre palline di grandezza crescente: quella di 1,0 chilogrammi nell'origine, quella di 2,0 chilogrammi nel punto di ascissa 3 sull'asse x, quella di 3,0 chilogrammi nel punto di coordinate 1 e 2. Il centro di massa è il punto nero di coordinate 1,5 e 1,0, dentro il triangolo formato dalle tre palline, con le proiezioni tratteggiate sui due assi
% svg: centro-massa-tre-masse-piano-441b0db8.svg 250x172
\begin{tikzpicture}
\draw[gray!25, very thin] (-0.5,-0.5) grid (4,3);
\draw[->] (-0.5,0) -- (4.2,0) node[right] {$x$ (m)};
\draw[->] (0,-0.5) -- (0,3.2) node[above] {$y$ (m)};
\foreach \x in {1,2,3} \node[below] at (\x,-0.22) {\small $\x$};
\foreach \y in {1,2} \node[left] at (-0.05,\y) {\small $\y$};
\draw[thin] (0,0) -- (3,0) -- (1,2) -- cycle;
\draw[thick, fill=blue!10] (0,0) circle (0.16);
\draw[thick, fill=blue!10] (3,0) circle (0.22);
\draw[thick, fill=blue!10] (1,2) circle (0.28);
\node[above right] at (3.1,0.1) {\small $2{,}0$ kg};
\node[above right] at (1.15,2.15) {\small $3{,}0$ kg};
\node[below left] at (-0.1,-0.1) {\small $1{,}0$ kg};
\draw[dashed, thin] (1.5,0) -- (1.5,1) -- (0,1);
\fill (1.5,1) circle (2pt);
\node[below right] at (1.5,0.98) {\small cm};
\end{tikzpicture}
```

Il centro di massa, nel punto $(1{,}5\,\text{m};\,1{,}0\,\text{m})$, è dentro il triangolo formato dalle tre palline, spostato verso la più pesante.
```

### I corpi estesi

Un corpo esteso, come una sbarra o un disco, è fatto di moltissime parti piccole, e il suo centro di massa è la media delle loro posizioni pesata con le masse. Per i corpi omogenei che hanno un centro di simmetria il conto non serve: il centro di massa è il centro di simmetria. Sta nel punto medio di una sbarra, nel centro di un disco, di un anello o di una sfera, nel punto d'incontro delle diagonali di una lastra rettangolare. Come per l'anello, può cadere in un punto in cui non c'è materia.

Sono gli stessi punti in cui la lezione sul [baricentro](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-baricentro-e-la-stabilita-dell-equilibrio) metteva il punto di applicazione del peso, e la formula del baricentro di due corpi, scritta con le masse, è quella di $x_{cm}$. Per gli oggetti che ci circondano, piccoli rispetto alla Terra, i due punti coincidono. Il centro di massa però è definito dalle sole masse e dalle posizioni: esiste anche per un'astronave lontana da ogni pianeta, dove di peso non si può parlare.

Per trovare il centro di massa di un sistema fatto di corpi estesi, ogni corpo si sostituisce con un punto materiale posto nel suo centro di massa: nell'esempio 2 la Terra e la Luna sono diventate due punti nei loro centri.

## La velocità del centro di massa

Se i corpi si muovono, si muove anche il centro di massa. In un intervallo di tempo $\Delta t$ i due corpi si spostano di $\Delta x_1$ e $\Delta x_2$, e il centro di massa di

$$\Delta x_{cm} = \frac{m_1\,\Delta x_1 + m_2\,\Delta x_2}{m_1 + m_2}$$

Dividendo per $\Delta t$ si ottiene la **velocità del centro di massa**. Vale per ogni componente, quindi è una relazione tra vettori:

$$\vec{v}_{cm} = \frac{m_1\vec{v}_1 + m_2\vec{v}_2}{m_1 + m_2}$$

Al numeratore c'è la quantità di moto totale del sistema. Con $M$ la massa totale,

$$\vec{p}_{tot} = M\,\vec{v}_{cm}$$

La quantità di moto totale di un sistema è quella di un solo punto materiale, con tutta la massa del sistema, che si muove come il centro di massa.

```ad-example
Esempio 4: il centro di massa in un urto
Un carrello di $3{,}0\,\text{kg}$ si muove verso destra a $2{,}0\,\text{m/s}$ e uno di $1{,}0\,\text{kg}$ gli viene incontro a $4{,}0\,\text{m/s}$. Dopo l'urto, elastico, il primo torna indietro a $1{,}0\,\text{m/s}$ e il secondo riparte verso destra a $5{,}0\,\text{m/s}$ (è l'esempio 1 della lezione sugli [urti elastici](/materiale/scuola-superiore/fisica/la-quantita-di-moto/gli-urti-elastici-in-una-e-in-due-dimensioni)). Qual è la velocità del centro di massa prima e dopo l'urto?

Con l'asse verso destra, prima dell'urto $v_1 = 2{,}0\,\text{m/s}$ e $v_2 = -4{,}0\,\text{m/s}$:

$$v_{cm} = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2} = \frac{3{,}0\,\text{kg} \cdot 2{,}0\,\text{m/s} + 1{,}0\,\text{kg} \cdot (-4{,}0\,\text{m/s})}{4{,}0\,\text{kg}} = \frac{2{,}0\,\text{kg}\cdot\text{m/s}}{4{,}0\,\text{kg}} = 0{,}50\,\text{m/s}$$

Dopo l'urto $V_1 = -1{,}0\,\text{m/s}$ e $V_2 = 5{,}0\,\text{m/s}$:

$$v_{cm} = \frac{3{,}0\,\text{kg} \cdot (-1{,}0\,\text{m/s}) + 1{,}0\,\text{kg} \cdot 5{,}0\,\text{m/s}}{4{,}0\,\text{kg}} = 0{,}50\,\text{m/s}$$

Le velocità dei due carrelli sono cambiate tutte e due, e una ha cambiato verso; quella del centro di massa è rimasta $0{,}50\,\text{m/s}$ verso destra.
```

## Il moto del centro di massa

Il risultato dell'esempio 4 non è un caso. La lezione sulla [conservazione della quantità di moto](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-conservazione-della-quantita-di-moto) ha mostrato che la quantità di moto totale di un sistema cambia solo per effetto delle forze esterne: $\Delta\vec{p}_{tot} = \vec{F}_{est}\,\Delta t$. Poiché $\vec{p}_{tot} = M\,\vec{v}_{cm}$ e la massa totale non cambia, $\Delta\vec{p}_{tot} = M\,\Delta\vec{v}_{cm}$, e quindi

$$\vec{F}_{est} = M\,\frac{\Delta\vec{v}_{cm}}{\Delta t} = M\,\vec{a}_{cm}$$

È il **teorema del centro di massa**: il centro di massa di un sistema si muove come un punto materiale che ha la massa totale del sistema e su cui agisce la risultante delle sole forze esterne. Le forze interne, per quanto intense, non compaiono.

Ne seguono due fatti.

- Se il sistema è isolato, $\vec{F}_{est} = \vec{0}$ e $\vec{a}_{cm} = \vec{0}$: il centro di massa resta fermo, se era fermo, oppure continua a muoversi di moto rettilineo uniforme. Dire che la quantità di moto totale si conserva e dire che la velocità del centro di massa è costante sono la stessa cosa. Per questo nell'esempio 4 l'urto non l'ha cambiata.
- Se la sola forza esterna è il peso, $\vec{a}_{cm} = \vec{g}$: il centro di massa si muove come un [proiettile](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/il-lancio-obliquo-e-la-gittata), lungo una parabola, qualunque cosa facciano le parti del sistema. È il caso del martello che ruota in volo, e di un tuffatore che si raggomitola e si distende: il corpo cambia forma, ma il suo centro di massa segue la stessa parabola dallo stacco fino all'acqua.

Nella figura qui sotto due carrelli si urtano, in modo elastico o restando attaccati. Il punto nero è il loro centro di massa, e lascia un segno ogni mezzo secondo.

```interattivo
% nome: centro-massa-urto-carrelli
% alt: Due carrelli su una rotaia: il primo si muove a 2 metri al secondo verso il secondo, che è fermo. Due cursori scelgono le masse, da 0,5 a 4 chilogrammi, una scelta decide se l'urto è elastico o completamente anelastico, e un bottone avvia il moto. Un punto nero sopra la rotaia segna il centro di massa dei due carrelli e lascia una tacca ogni mezzo secondo: le tacche sono tutte alla stessa distanza, prima e dopo l'urto. Sotto sono scritte le velocità dei carrelli e quella del centro di massa
```

Le tacche sono equidistanti prima e dopo l'urto, con qualunque coppia di masse e in tutti e due i tipi di urto: il centro di massa attraversa l'urto a velocità costante, senza accorgersene. Nell'urto completamente anelastico, dopo lo scontro i carrelli viaggiano insieme al centro di massa: la velocità comune $V$ della lezione sugli [urti anelastici](/materiale/scuola-superiore/fisica/la-quantita-di-moto/gli-urti-anelastici) è proprio $v_{cm}$.

```ad-warning
Le forze interne non spostano il centro di massa
Camminare su una barca, spingersi tra pattinatori, esplodere: nessuna di queste azioni cambia il moto del centro di massa del sistema, perché le forze sono interne. Se un pezzo va da una parte, un altro deve andare dall'altra.
```

### Un sistema fermo che cambia forma

Se un sistema isolato è fermo, il suo centro di massa non si sposta, anche quando le parti si muovono una rispetto all'altra. Questo permette di trovare di quanto si sposta una parte senza conoscere le forze.

```ad-example
Esempio 5: camminare su una barca
Una barca di $120\,\text{kg}$ è ferma sull'acqua di un lago, con a bordo una ragazza di $60\,\text{kg}$. La ragazza cammina lungo la barca per $3{,}0\,\text{m}$, verso la riva. Di quanto si sposta la barca, se l'attrito con l'acqua è trascurabile?

```tikz
% nome: barca-prima-dopo
% alt: Due righe. In alto, prima, la barca, un rettangolo lungo sull'acqua, con la ragazza, un blocco, all'estremità sinistra. In basso, dopo, la ragazza è avanzata verso destra lungo la barca e la barca è arretrata verso sinistra di un tratto d. Una linea verticale tratteggiata, nella stessa posizione nelle due righe, segna il centro di massa del sistema, che non si è spostato; in scala, un centimetro per metro, la barca è arretrata di 1 centimetro e la ragazza è avanzata di 2 centimetri rispetto all'acqua
% svg: barca-prima-dopo-4cbb048e.svg 332x177
\begin{tikzpicture}
\node[left] at (-0.4,2.55) {\small prima};
\fill[cyan!20] (0,1.6) rectangle (7.2,2.2);
\draw[thin] (0,2.2) -- (7.2,2.2);
\draw[thick, fill=gray!20] (2.0,2.1) rectangle (6.0,2.5);
\draw[thick, fill=blue!10] (2.3,2.5) rectangle ++(0.4,0.8);
\node[left] at (-0.4,0.55) {\small dopo};
\fill[cyan!20] (0,-0.4) rectangle (7.2,0.2);
\draw[thin] (0,0.2) -- (7.2,0.2);
\draw[thick, fill=gray!20] (1.0,0.1) rectangle (5.0,0.5);
\draw[thick, fill=blue!10] (4.3,0.5) rectangle ++(0.4,0.8);
\draw[dashed, thin] (3.5,-0.6) -- (3.5,3.6) node[above] {\small cm};
\draw[dashed, thin] (2.0,0.5) -- (2.0,2.1);
\draw[dashed, thin] (1.0,0.5) -- (1.0,1.3);
\draw[{Stealth}-{Stealth}, thin] (1.0,1.1) -- (2.0,1.1) node[midway, above] {$d$};
\end{tikzpicture}
```

Il sistema è formato dalla barca e dalla ragazza. Le forze esterne, peso e spinta dell'acqua, sono verticali e si bilanciano; quella tra i piedi e la barca è interna. Il sistema era fermo, quindi il centro di massa resta dov'è, e la barca deve arretrare mentre la ragazza avanza.

Chiamiamo $d$ lo spostamento della barca all'indietro. La ragazza avanza di $3{,}0\,\text{m}$ rispetto alla barca, quindi di $3{,}0\,\text{m} - d$ rispetto all'acqua. Perché il centro di massa non si sposti, la somma delle masse per gli spostamenti deve essere zero:

$$m\,(3{,}0\,\text{m} - d) - M\,d = 0$$

$$d = \frac{m}{m + M} \cdot 3{,}0\,\text{m} = \frac{60\,\text{kg}}{60\,\text{kg} + 120\,\text{kg}} \cdot 3{,}0\,\text{m} = 1{,}0\,\text{m}$$

La barca arretra di $1{,}0\,\text{m}$ e la ragazza, rispetto all'acqua, avanza solo di $2{,}0\,\text{m}$: si è avvicinata alla riva meno di quanto ha camminato.
```

### Un sistema che esplode in volo

```ad-example
Esempio 6: un fuoco d'artificio
Un fuoco d'artificio viene lanciato da terra, su un prato piano, in modo che, se non esplodesse, ricadrebbe a $48\,\text{m}$ dal punto di lancio. Nel punto più alto della traiettoria esplode in due frammenti di massa uguale. Uno dei due subito dopo l'esplosione è fermo, e cade in verticale. A che distanza dal punto di lancio cade l'altro, se la resistenza dell'aria è trascurabile?

L'esplosione è fatta di forze interne: il centro di massa dei due frammenti continua sulla parabola del fuoco intero e tocca terra a $48\,\text{m}$. Il punto più alto di quella parabola è a metà della gittata, quindi il primo frammento cade a $x_1 = 24\,\text{m}$. Subito dopo l'esplosione nessuno dei due frammenti ha velocità verticale, perché nel punto più alto non ne aveva il fuoco intero: cadono insieme e arrivano al suolo nello stesso istante, quello in cui ci arriva il centro di massa. In quell'istante, con masse uguali, il centro di massa è il punto medio tra i due:

$$x_{cm} = \frac{x_1 + x_2}{2} \quad\Rightarrow\quad x_2 = 2\,x_{cm} - x_1 = 2 \cdot 48\,\text{m} - 24\,\text{m} = 72\,\text{m}$$

```tikz
% nome: fuoco-artificio-centro-massa
% alt: Un grafico con la distanza in orizzontale, da 0 a 72 metri, e l'altezza in verticale. Una parabola parte dall'origine, raggiunge il punto più alto a 24 metri, dove avviene l'esplosione, e prosegue tratteggiata fino a 48 metri: è la traiettoria del centro di massa. Dal punto più alto il primo frammento scende in verticale fino a 24 metri; il secondo segue una parabola più larga e arriva a 72 metri. A una certa altezza i due frammenti e il centro di massa sono disegnati sulla stessa linea orizzontale, con il centro di massa a metà tra i due
% svg: fuoco-artificio-centro-massa-2255a12d.svg 353x143
\begin{tikzpicture}
\draw[->] (-0.3,0) -- (7.8,0) node[right] {$x$ (m)};
\draw[->] (0,-0.3) -- (0,2.7) node[above] {$y$};
\foreach \x/\l in {2.4/24, 4.8/48, 7.2/72} {
\draw (\x,0.08) -- (\x,-0.08);
\node[below] at (\x,-0.08) {\small $\l$};
}
\draw[thick] plot[domain=0:2.4, samples=30] (\x, {2 - 2*((\x-2.4)/2.4)^2});
\draw[thick, dashed] plot[domain=2.4:4.8, samples=30] (\x, {2 - 2*((\x-2.4)/2.4)^2});
\draw[thick, blue] (2.4,2) -- (2.4,0);
\draw[thick, blue] plot[domain=2.4:7.2, samples=40] (\x, {2 - 2*((\x-2.4)/4.8)^2});
\draw[dashed, thin] (2.4,1.5) -- (4.8,1.5);
\draw[thick, fill=blue!10] (2.4,1.5) circle (0.12);
\draw[thick, fill=blue!10] (4.8,1.5) circle (0.12);
\fill (3.6,1.5) circle (2pt);
\node[below] at (3.55,1.45) {\small cm};
\node[above] at (2.4,2.05) {\small esplosione};
\end{tikzpicture}
```

Il secondo frammento cade a $72\,\text{m}$, più lontano di dove sarebbe caduto il fuoco intero. A ogni istante i due frammenti sono alla stessa altezza e il centro di massa è a metà tra loro, sulla parabola di partenza.
```

Quando uno dei frammenti tocca terra il suolo esercita su di lui una forza esterna, e da lì in poi il centro di massa non segue più la parabola: il ragionamento dell'esempio 6 funziona perché i due frammenti arrivano al suolo insieme.

```ad-note
Il sistema di riferimento del centro di massa
Un urto si può osservare da un sistema di riferimento che si muove insieme al centro di massa: si chiama sistema del centro di massa. Visto da lì il centro di massa è fermo, e la quantità di moto totale è zero prima e dopo l'urto: i due corpi arrivano con quantità di moto opposte e ripartono con quantità di moto opposte. In fisica delle particelle gli urti si studiano quasi sempre in questo sistema.
```
