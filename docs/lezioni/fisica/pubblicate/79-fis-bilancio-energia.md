# Il bilancio dell'energia con le forze non conservative

Una slitta scende da una collina ghiacciata, prende velocità, poi arriva sulla neve fresca del prato e si ferma dopo qualche decina di metri. Un'auto in salita accelera perché il motore la spinge. Nel primo caso l'energia meccanica diminuisce, nel secondo aumenta: in tutti e due a cambiarla è una forza non conservativa. Di quanto cambia lo dice una sola equazione, il bilancio dell'energia, che permette di risolvere problemi con più tratti, attriti e molle senza calcolare accelerazioni e tempi.

## Il lavoro delle forze non conservative

Nella lezione [Forze conservative ed energia potenziale](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/forze-conservative-ed-energia-potenziale) le forze sono state divise in due famiglie. Quelle conservative, come il peso e la forza elastica, hanno un'energia potenziale, e il loro lavoro è $-\Delta U$. Quelle non conservative, come l'attrito, la resistenza dell'aria, la trazione di una fune o la spinta di un motore, non ce l'hanno.

Il [teorema dell'energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) vale per tutte le forze insieme: il lavoro totale è uguale alla variazione dell'energia cinetica. Separiamo il lavoro delle forze conservative, $W_c$, da quello delle forze non conservative, $W_{nc}$:

$$W_c + W_{nc} = \Delta K$$

Al posto di $W_c$ scriviamo $-\Delta U$, dove $U$ è la somma delle energie potenziali di tutte le forze conservative presenti, e portiamo $\Delta U$ a destra:

$$W_{nc} = \Delta K + \Delta U = \Delta E$$

Il lavoro delle forze non conservative è uguale alla variazione dell'energia meccanica $E = K + U$. È il **bilancio dell'energia meccanica**. Tra uno stato iniziale e uno finale si scrive

$$K_i + U_i + W_{nc} = K_f + U_f$$

Nel biennio hai già usato questa equazione con il solo attrito, $\Delta E = W_{attrito}$ ([Forze dissipative e conservazione dell'energia totale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/forze-dissipative-e-conservazione-dell-energia-totale)). Ora dentro $W_{nc}$ entrano tutte le forze che non hanno un'energia potenziale. Se $W_{nc} = 0$ si ritrova la [conservazione dell'energia meccanica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica).

### Forze che tolgono energia e forze che ne danno

Il segno di $W_{nc}$ dice in che verso cambia l'energia meccanica.

| forza non conservativa | lavoro | energia meccanica |
|---|---|---|
| attrito dinamico, resistenza dell'aria o dell'acqua | negativo, perché la forza è opposta al moto | diminuisce |
| trazione di una fune, spinta di un motore o di una persona, nel verso del moto | positivo | aumenta |
| reazione di un piano, tensione del filo di un pendolo | zero, perché la forza è perpendicolare al moto | non cambia |

Quando agiscono più forze non conservative, $W_{nc}$ è la somma dei loro lavori, ognuno con il suo segno. L'energia meccanica tolta dagli attriti non scompare: diventa energia interna dei corpi che strisciano, che si scaldano. Quella data da un motore o da un muscolo viene da un'altra forma di energia, chimica o elettrica. L'energia totale si conserva sempre.

```ad-warning
Il peso e la molla non vanno contati due volte
Il lavoro del peso e quello della forza elastica sono già dentro $\Delta U$. In $W_{nc}$ vanno solo le forze senza energia potenziale: chi ci mette anche il lavoro del peso lo conta due volte.
```

## Come si imposta il bilancio

1. Scegli lo stato iniziale e lo stato finale: due istanti in cui conosci, o vuoi trovare, velocità e posizione. Quello che succede in mezzo conta solo per il lavoro delle forze non conservative.
2. Scegli il livello di riferimento per le altezze, di solito il punto più basso.
3. Scrivi $K_i + U_i$ e $K_f + U_f$, con $U$ somma di $m g h$ e di $\tfrac{1}{2} k x^2$ se c'è una molla.
4. Elenca le forze non conservative e calcola il lavoro di ciascuna su ogni tratto in cui agisce: $-F_d \cdot l$ per un attrito, $F \cdot s$ per una forza parallela allo spostamento e nel suo verso.
5. Scrivi $K_i + U_i + W_{nc} = K_f + U_f$ e ricava l'incognita.

Se il percorso è fatto di più tratti non serve spezzare il conto: il bilancio si scrive una volta sola, tra la partenza e l'arrivo, sommando in $W_{nc}$ i lavori di tutti i tratti.

## Una discesa liscia e un tratto con attrito

```ad-example
Esempio 1: dove si ferma la slitta
Una slitta parte da ferma dalla cima di una collina alta $9{,}0\,\text{m}$. La discesa è ghiacciata e l'attrito si può trascurare; in fondo comincia un prato orizzontale coperto di neve fresca, con $\mu_d = 0{,}12$. Quanta strada fa la slitta sul prato prima di fermarsi?

```tikz
% nome: slitta-collina-prato-attrito
% alt: Una collina alta 9,0 metri con una discesa curva, in cima alla quale c'è una slitta ferma nel punto A; in fondo alla discesa, nel punto B, comincia un prato orizzontale, lungo il quale la slitta percorre la distanza d fino al punto C, dove è disegnata tratteggiata, ferma. Sulla slitta in moto sul prato agisce la forza di attrito Fd, verso sinistra
% svg: slitta-collina-prato-attrito-101d1ee7.svg 394x136
\begin{tikzpicture}
\draw[thick] (-0.4,0) -- (8.6,0);
\foreach \x in {-0.25,-0.1,...,8.6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\fill[gray!20] (-0.2,0) -- (-0.2,1.8) -- (0.3,1.8) .. controls (1.3,1.8) and (1.5,0) .. (2.6,0) -- cycle;
\draw[thick] (-0.2,1.8) -- (0.3,1.8) .. controls (1.3,1.8) and (1.5,0) .. (2.6,0);
\draw[thick, fill=blue!10] (-0.1,1.8) rectangle ++(0.5,0.25);
\draw[thick, fill=blue!10] (4.4,0) rectangle ++(0.5,0.25);
\draw[thick, dashed, fill=blue!10] (7.6,0) rectangle ++(0.5,0.25);
\draw[-{Stealth}, thick, red] (4.4,0.12) -- (3.5,0.12) node[above] {$\vec{F}_d$};
\draw[-{Stealth}, thick, blue!60!black] (4.9,0.12) -- (5.9,0.12) node[above] {$\vec{v}$};
\draw[{Stealth}-{Stealth}, thin] (-0.6,0) -- (-0.6,1.8) node[midway, left] {$9{,}0$ m};
\draw[{Stealth}-{Stealth}, thin] (2.6,-0.5) -- (7.85,-0.5) node[midway, below] {$d$};
\draw[dashed, thin] (2.6,0) -- (2.6,-0.6);
\draw[dashed, thin] (7.85,0) -- (7.85,-0.6);
\node[above] at (0.15,2.05) {$A$};
\node[above] at (2.6,0.05) {$B$};
\node[above] at (7.85,0.3) {$C$};
\end{tikzpicture}
```

Stato iniziale: la slitta ferma in cima, $A$. Stato finale: la slitta ferma sul prato, $C$. Con il riferimento sul prato, $K_i = 0$, $U_i = m g h$, $K_f = 0$, $U_f = 0$. L'unica forza non conservativa che lavora è l'attrito sul prato, $F_d = \mu_d\, m g$, lungo la distanza $d$:

$$m g h - \mu_d\, m g\, d = 0 \quad\Rightarrow\quad d = \frac{h}{\mu_d} = \frac{9{,}0\,\text{m}}{0{,}12} = 75\,\text{m}$$

La massa si semplifica, e la velocità in fondo alla discesa non è servita. Volendola, si trova con il bilancio tra $A$ e $B$, dove $W_{nc} = 0$: $v_B = \sqrt{2 g h} = \sqrt{2 \cdot 9{,}8\,\text{m/s}^2 \cdot 9{,}0\,\text{m}} = 13{,}28\ldots\,\text{m/s} \approx 13\,\text{m/s}$.
```

Nella figura qui sotto un blocco scende da una rampa liscia e prosegue su un pavimento con attrito: scegli l'altezza di partenza, il coefficiente di attrito e la massa, e guardi dove si ferma. Raddoppiando l'altezza la distanza di arresto raddoppia, perché c'è il doppio dell'energia da dissipare; raddoppiando il coefficiente si dimezza; cambiando la massa non succede niente, perché un blocco più pesante ha più energia ma subisce anche più attrito. È quello che dice $d = h / \mu_d$.

```interattivo
% nome: rampa-liscia-pavimento-attrito
% alt: Un blocco parte da fermo dalla cima di una rampa curva liscia e prosegue su un pavimento orizzontale con attrito, dove rallenta e si ferma. Tre cursori scelgono l'altezza di partenza da 0,5 a 2,0 metri, il coefficiente di attrito dinamico da 0,20 a 0,60 e la massa da 1 a 5 chilogrammi; un bottone lascia andare il blocco. Accanto, le barre dell'energia potenziale, dell'energia cinetica e dell'energia dissipata, la cui somma resta costante. Sotto sono scritti la velocità in fondo alla rampa, la distanza di arresto e le energie
```

## Una molla e un pavimento con attrito

Quando c'è una molla, la sua energia potenziale entra in $U$ accanto a quella del peso, e l'attrito resta l'unico termine di $W_{nc}$.

```ad-example
Esempio 2: il blocco lanciato dalla molla
Una molla con $k = 400\,\text{N/m}$, compressa di $10\,\text{cm}$, lancia un blocco di $0{,}50\,\text{kg}$ su un pavimento orizzontale con $\mu_d = 0{,}25$. Quanta strada fa il blocco, dal punto in cui viene lasciato a quello in cui si ferma?

Stato iniziale: blocco fermo, molla compressa di $x = 0{,}10\,\text{m}$. Stato finale: blocco fermo, molla a riposo. L'energia cinetica è zero in tutti e due, l'altezza non cambia, e l'energia elastica passa da $\tfrac{1}{2} k x^2$ a zero:

$$\frac{1}{2} k x^2 - \mu_d\, m g\, d = 0$$

$$\begin{aligned}d &= \frac{k x^2}{2 \mu_d\, m g} = \frac{400\,\text{N/m} \cdot (0{,}10\,\text{m})^2}{2 \cdot 0{,}25 \cdot 0{,}50\,\text{kg} \cdot 9{,}8\,\text{m/s}^2} \\ &= \frac{4{,}0\,\text{J}}{2{,}45\,\text{N}} = 1{,}63\ldots\,\text{m} \approx 1{,}6\,\text{m}\end{aligned}$$

L'energia elastica, $2{,}0\,\text{J}$, è stata tutta dissipata da un attrito di $1{,}225\,\text{N}$. Sullo stesso pavimento senza attrito il blocco partirebbe a $2{,}8\,\text{m/s}$ e non si fermerebbe più.
```

```ad-example
Esempio 3: una rampa con attrito e una molla in fondo
Un blocco di $2{,}0\,\text{kg}$ parte da fermo e scivola per $3{,}0\,\text{m}$ lungo un piano inclinato di $30^\circ$, con $\mu_d = 0{,}20$. In fondo prosegue su un piano orizzontale liscio e va a comprimere una molla con $k = 800\,\text{N/m}$. Di quanto si comprime la molla?

```tikz
% nome: rampa-attrito-molla-in-fondo
% alt: Un piano inclinato di 30 gradi lungo 3,0 metri, con un blocco fermo in cima; in fondo il piano prosegue in un tratto orizzontale liscio, che termina contro una parete a cui è fissata una molla. Il dislivello h tra la cima e il piano orizzontale è segnato a sinistra
% svg: rampa-attrito-molla-in-fondo-f21f3d94.svg 318x98
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) -- (3.464,0) -- (0,2) -- cycle;
\draw[thick] (-0.3,0) -- (7.2,0);
\foreach \x in {-0.15,0,...,7.2} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick] (7.2,0) -- (7.2,1.1);
\foreach \y in {0.15,0.3,...,1.1} \draw[thin] (7.2,\y) -- ++(0.15,-0.15);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (5.8,0.3) -- (7.2,0.3);
\draw[thick] (5.8,0.05) -- (5.8,0.55);
\draw[thick, fill=blue!10, rotate around={-30:(0.35,1.798)}] (0.05,1.798) rectangle ++(0.6,0.45);
\draw (2.864,0) arc[start angle=180, end angle=150, radius=0.6];
\node at (2.45,0.17) {\small $30^\circ$};
\draw[{Stealth}-{Stealth}, thin] (-0.5,0) -- (-0.5,2) node[midway, left] {$h$};
\draw[dashed, thin] (-0.6,2) -- (0,2);
\node[above right] at (1.7,1.05) {\small $3{,}0$ m};
\node[above] at (4.6,0) {\small liscio};
\end{tikzpicture}
```

Stato iniziale: blocco fermo in cima. Stato finale: blocco fermo contro la molla compressa di $x$. Il blocco scende di $h = l \sin 30^\circ = 3{,}0\,\text{m} \cdot 0{,}50 = 1{,}5\,\text{m}$, e con il riferimento sul piano orizzontale

$$U_i = m g h = 2{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 1{,}5\,\text{m} = 29{,}4\,\text{J}$$

$$U_f = \frac{1}{2} k x^2$$

L'attrito lavora solo sulla rampa, dove la forza premente è $m g \cos 30^\circ$:

$$\begin{aligned}W_{nc} &= -\mu_d\, m g \cos 30^\circ \cdot l \\ &= -0{,}20 \cdot 2{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 0{,}866 \cdot 3{,}0\,\text{m} \\ &= -10{,}18\ldots\,\text{J}\end{aligned}$$

Il bilancio $U_i + W_{nc} = U_f$ dà

$$\frac{1}{2} k x^2 = 29{,}4\,\text{J} - 10{,}18\,\text{J} = 19{,}22\,\text{J}$$

$$x = \sqrt{\frac{2 \cdot 19{,}22\,\text{J}}{800\,\text{N/m}}} = 0{,}219\ldots\,\text{m} \approx 0{,}22\,\text{m}$$

I tratti sono tre (rampa, piano, molla), ma il bilancio è uno solo. Senza attrito la molla si comprimerebbe di $0{,}27\,\text{m}$.
```

```ad-warning
L'attrito agisce solo dove c'è
Il lavoro dell'attrito si calcola sul tratto in cui il corpo striscia su una superficie ruvida, con la lunghezza di quel tratto e la forza premente di quel tratto: $m g$ in piano, $m g \cos\alpha$ su un piano inclinato. Nell'esempio 3, moltiplicare l'attrito per tutta la strada, o usare $\mu_d\, m g$ sulla rampa, cambia il risultato.
```

## Una forza che aggiunge energia

```ad-example
Esempio 4: la cassa tirata in salita
Una cassa di $15\,\text{kg}$, ferma ai piedi di un piano inclinato di $25^\circ$, viene tirata verso l'alto da una fune parallela al piano con una forza di $120\,\text{N}$. Tra la cassa e il piano $\mu_d = 0{,}30$. Con che velocità si muove la cassa dopo $4{,}0\,\text{m}$ di salita?

```tikz
% nome: cassa-fune-salita-attrito
% alt: Una cassa su un piano inclinato di 25 gradi, con tre forze applicate: la forza F della fune, parallela al piano e verso l'alto, lunga 120 newton in scala; la forza di attrito Fd, parallela al piano e verso il basso; il peso mg, verticale verso il basso
% svg: cassa-fune-salita-attrito-cdc83825.svg 231x148
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) -- (6,0) -- (6,2.798) -- cycle;
\draw (0.6,0) arc[start angle=0, end angle=25, radius=0.6];
\node at (1.05,0.2) {\small $25^\circ$};
\draw[thick, fill=blue!10, rotate around={25:(2.6,1.212)}] (2.2,1.212) rectangle ++(0.8,0.6);
\draw[-{Stealth}, thick, red] (2.473,1.484) -- ++(25:1.8) node[above] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (2.473,1.484) -- ++(205:0.6) node[above left] {$\vec{F}_d$};
\draw[-{Stealth}, thick, red] (2.473,1.484) -- ++(0,-2.205) node[right] {$m\vec{g}$};
\fill (2.473,1.484) circle (1.5pt);
\end{tikzpicture}
```

Stato iniziale: cassa ferma in basso, dove mettiamo il riferimento. Stato finale: cassa a $l = 4{,}0\,\text{m}$ lungo il piano, cioè all'altezza $h = l \sin 25^\circ = 4{,}0\,\text{m} \cdot 0{,}423 = 1{,}69\,\text{m}$, con velocità $v$. Le forze non conservative sono due. La fune tira nel verso del moto:

$$W_F = F \cdot l = 120\,\text{N} \cdot 4{,}0\,\text{m} = 480\,\text{J}$$

L'attrito, con la forza premente $m g \cos 25^\circ$, è opposto al moto:

$$\begin{aligned}W_{attrito} &= -\mu_d\, m g \cos 25^\circ \cdot l \\ &= -0{,}30 \cdot 15\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 0{,}906 \cdot 4{,}0\,\text{m} \\ &= -159{,}8\ldots\,\text{J}\end{aligned}$$

L'energia potenziale finale è $U_f = m g h = 15\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 1{,}69\,\text{m} = 248{,}4\ldots\,\text{J}$. Il bilancio $0 + W_F + W_{attrito} = K_f + U_f$ dà

$$K_f = 480\,\text{J} - 159{,}8\,\text{J} - 248{,}4\,\text{J} = 71{,}8\,\text{J}$$

$$v = \sqrt{\frac{2 K_f}{m}} = \sqrt{\frac{2 \cdot 71{,}8\,\text{J}}{15\,\text{kg}}} = 3{,}09\ldots\,\text{m/s} \approx 3{,}1\,\text{m/s}$$

```tikz
% nome: bilancio-fune-barre-energia
% alt: Due barre della stessa lunghezza. Quella in alto è il lavoro della fune, 480 joule. Quella in basso è divisa in tre parti: l'energia potenziale guadagnata, 248 joule, l'energia cinetica, 72 joule, e l'energia dissipata dall'attrito, 160 joule
% svg: bilancio-fune-barre-energia-482d19b4.svg 287x75
\begin{tikzpicture}
\draw[thick, fill=green!15] (0,1.0) rectangle (6,1.4);
\node at (3,1.2) {\small $W_F = 480$ J};
\draw[thick, fill=orange!25] (0,0) rectangle (3.1,0.4);
\node at (1.55,0.2) {\small $U = 248$ J};
\draw[thick, fill=blue!10] (3.1,0) rectangle (4.0,0.4);
\node[below] at (3.55,0) {\small $K = 72$ J};
\draw[thick, fill=red!15] (4.0,0) rectangle (6,0.4);
\node at (5,0.2) {\small $160$ J};
\node[right] at (6,0.2) {\small dissipata};
\end{tikzpicture}
```

Dei $480\,\text{J}$ dati dalla fune, poco più di metà sono diventati energia potenziale, un terzo è stato dissipato dall'attrito e solo $72\,\text{J}$ sono energia cinetica.
```

```ad-warning
Il segno di ogni lavoro
In $W_{nc}$ il lavoro dell'attrito entra con il segno meno, quello di una forza che tira nel verso del moto con il segno più. Il controllo è sul risultato: con l'attrito la cassa dell'esempio 4 deve arrivare più lenta che senza ($5{,}6\,\text{m/s}$), e un'energia cinetica finale negativa vuol dire che la cassa non arriva fin lì.
```

## La forza media di una resistenza

Il bilancio serve anche al contrario: se si conoscono lo stato iniziale e quello finale, dà il lavoro delle forze non conservative, e da quello la forza media che hanno esercitato.

```ad-example
Esempio 5: il tuffo dalla piattaforma
Un tuffatore di $60\,\text{kg}$ si lascia cadere dalla piattaforma dei $10\,\text{m}$ e si ferma sott'acqua a $3{,}0\,\text{m}$ di profondità. Con quale forza media l'acqua lo ha frenato? La resistenza dell'aria si trascura.

```tikz
% nome: tuffatore-piattaforma-profondita
% alt: Una piattaforma a 10 metri sopra la superficie dell'acqua di una piscina, con il tuffatore fermo nel punto A; sotto la superficie, a 3,0 metri di profondità, il punto C in cui il tuffatore si ferma. Sul tuffatore in acqua agisce la forza media F dell'acqua, verso l'alto
% svg: tuffatore-piattaforma-profondita-3a15ee97.svg 257x202
\begin{tikzpicture}
\fill[cyan!20] (0.6,-1.5) rectangle (4.6,0);
\draw[thin] (0.6,0) -- (4.6,0);
\draw[thick] (0.6,0.3) -- (0.6,-1.5) -- (4.6,-1.5) -- (4.6,0.3);
\draw[thick] (0.6,0) -- (0.6,3.0) -- (1.7,3.0);
\draw[thick, fill=blue!10] (1.5,3.12) circle (0.12);
\draw[thick, fill=blue!10] (2.4,-0.9) circle (0.12);
\draw[dashed, thin] (1.62,3.05) .. controls (2.3,2.8) and (2.4,1.5) .. (2.4,-0.75);
\draw[-{Stealth}, thick, red] (2.4,-0.9) -- (2.4,0.6) node[right] {$\vec{F}$};
\draw[{Stealth}-{Stealth}, thin] (0.3,0) -- (0.3,3.0) node[midway, left] {$10$ m};
\draw[{Stealth}-{Stealth}, thin] (4.9,-0.9) -- (4.9,0) node[midway, right] {$3{,}0$ m};
\draw[dashed, thin] (2.55,-0.9) -- (5.0,-0.9);
\node[above] at (1.5,3.25) {$A$};
\node[left] at (2.3,-0.9) {$C$};
\end{tikzpicture}
```

Stato iniziale: fermo sulla piattaforma. Stato finale: fermo a $3{,}0\,\text{m}$ di profondità, dove mettiamo il riferimento. Allora $K_i = K_f = 0$, $U_f = 0$ e $U_i = m g\,(10\,\text{m} + 3{,}0\,\text{m})$. La forza dell'acqua, di modulo medio $F$, è opposta al moto lungo $d = 3{,}0\,\text{m}$:

$$m g\,(h + d) - F \cdot d = 0$$

$$F = \frac{m g\,(h + d)}{d} = \frac{60\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 13\,\text{m}}{3{,}0\,\text{m}} = 2548\,\text{N} \approx 2{,}5 \cdot 10^3\,\text{N}$$

più di quattro volte il peso del tuffatore, $588\,\text{N}$. Il dislivello che conta è tutto quello percorso, $13\,\text{m}$: anche sott'acqua il tuffatore continua a scendere, e il peso continua a lavorare.
```

```ad-warning
Lo stato finale decide l'altezza
Nell'esempio 5 il tuffatore perde energia potenziale fino al punto in cui si ferma, non fino alla superficie. Con $10\,\text{m}$ al posto di $13\,\text{m}$ la forza verrebbe $1{,}96 \cdot 10^3\,\text{N}$: mancherebbe il lavoro del peso sotto la superficie.
```

## Quando conviene il bilancio dell'energia

Gli stessi problemi si possono risolvere con il [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica), trovando l'accelerazione su ogni tratto e poi usando le leggi del moto. Il bilancio dell'energia è più rapido quando le domande riguardano velocità, distanze, altezze e deformazioni, perché lega direttamente lo stato iniziale a quello finale. Non dice niente dei tempi: per sapere quanto dura la frenata della slitta servono l'accelerazione e la legge della velocità. Su una discesa curva, dove l'accelerazione cambia in ogni punto, è l'unica strada che hai a disposizione.
