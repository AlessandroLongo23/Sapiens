# La spinta di Archimede e il galleggiamento

Un sasso sott'acqua sembra più leggero che fuori, un pallone da spiaggia spinto sott'acqua risale da solo, una nave d'acciaio da centomila tonnellate galleggia mentre un chiodo d'acciaio va a fondo. Dietro tutti questi fatti c'è la stessa forza: la spinta verso l'alto che ogni fluido, liquido o gas, esercita sui corpi immersi. Il primo a descriverla fu Archimede di Siracusa, nel III secolo a.C.

## Da dove viene la spinta

Si immagini un cubetto immerso in un liquido, con le facce orizzontali e verticali. Il liquido preme su ogni faccia, perpendicolarmente, e per la [legge di Stevino](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-legge-di-stevino-e-i-vasi-comunicanti) la pressione cresce con la profondità.

- Sulle facce laterali le forze sono a due a due uguali e opposte, perché due facce opposte stanno alla stessa profondità: si annullano.
- La faccia di sopra è a una profondità $h_1$ e il liquido la spinge verso il basso; la faccia di sotto è più in basso, a $h_2$, e il liquido la spinge verso l'alto con una pressione maggiore.

```tikz
% nome: spinta-differenza-pressione
% alt: Un cubetto immerso in un liquido: sulle facce laterali le forze del liquido sono uguali e opposte, sulla faccia di sopra, alla profondità h1, una freccia rossa verso il basso, e sulla faccia di sotto, alla profondità h2, una freccia rossa verso l'alto più lunga
% svg: spinta-differenza-pressione-9c6d8b9d.svg 155x133
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (4,3);
\draw[thin] (0,3) -- (4,3);
\draw[thick] (0,3.4) -- (0,0) -- (4,0) -- (4,3.4);
\draw[thick, fill=blue!10] (1.5,0.9) rectangle (2.5,1.9);
\draw[-{Stealth}, thick, red] (2,2.5) -- (2,1.95) node[pos=0, above right] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (2,0.05) -- (2,0.85) node[pos=0.3, right] {$\vec{F}_2$};
\draw[-{Stealth}, thick, red] (0.8,1.4) -- (1.45,1.4);
\draw[-{Stealth}, thick, red] (3.2,1.4) -- (2.55,1.4);
\draw[{Stealth}-{Stealth}, thin] (0.6,3) -- (0.6,1.9) node[midway, left] {$h_1$};
\draw[{Stealth}-{Stealth}, thin] (3.4,3) -- (3.4,0.9) node[midway, right] {$h_2$};
\draw[dashed, thin] (0.5,1.9) -- (1.5,1.9);
\draw[dashed, thin] (2.5,0.9) -- (3.5,0.9);
\end{tikzpicture}
```

Se il cubetto ha lo spigolo $l$ e le facce hanno l'area $S = l^2$, la forza verso l'alto supera quella verso il basso di

$$F_2 - F_1 = (p_2 - p_1) \cdot S = d \cdot g \cdot (h_2 - h_1) \cdot S = d \cdot g \cdot l \cdot l^2 = d \cdot g \cdot V$$

dove $d$ è la densità del liquido e $V = l^3$ il volume del cubetto. La pressione dell'aria sulla superficie del liquido spinge allo stesso modo su tutte e due le facce, e si toglie nella differenza. Questa differenza tra la spinta dal basso e quella dall'alto è la spinta di Archimede. Il conto con un cubetto è il più facile, ma il risultato vale per un corpo di qualunque forma.

## Il principio di Archimede

Un corpo immerso in un fluido riceve una spinta verticale, verso l'alto, uguale al peso del fluido spostato, cioè del fluido che occuperebbe il posto della parte immersa del corpo. È la **spinta di Archimede** $\vec{S}_A$, e il suo modulo è

$$S_A = d_{fl} \cdot V_{imm} \cdot g$$

- $d_{fl}$ è la densità del fluido, non quella del corpo;
- $V_{imm}$ è il volume della parte immersa del corpo, che per un corpo tutto sott'acqua è il suo volume intero;
- $g = 9{,}8\,\text{N/kg}$.

Infatti $d_{fl} \cdot V_{imm}$ è la massa del fluido spostato, e moltiplicata per $g$ ne dà il [peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa). La spinta si applica nel centro della parte immersa, che si chiama centro di spinta.

| Fluido | $d$ in $\text{kg/m}^3$ |
|---|---|
| aria (livello del mare, $20\,^\circ\text{C}$) | $1{,}2$ |
| alcol etilico | $790$ |
| olio d'oliva | $920$ |
| acqua dolce | $1000$ |
| acqua di mare | circa $1030$ |
| glicerina | $1260$ |
| mercurio | $13\,600$ |

```ad-example
Esempio 1: un sasso in acqua e nell'olio
Un sasso ha il volume di $2{,}0\,\text{dm}^3$. Quanto vale la spinta di Archimede quando è tutto immerso in acqua? E nell'olio d'oliva?

Il volume va in metri cubi: $2{,}0\,\text{dm}^3 = 2{,}0 \cdot 10^{-3}\,\text{m}^3$. In acqua

$$S_A = 1000\,\text{kg/m}^3 \cdot 2{,}0 \cdot 10^{-3}\,\text{m}^3 \cdot 9{,}8\,\text{N/kg} = 19{,}6\,\text{N} \approx 20\,\text{N}$$

nell'olio

$$S_A = 920\,\text{kg/m}^3 \cdot 2{,}0 \cdot 10^{-3}\,\text{m}^3 \cdot 9{,}8\,\text{N/kg} = 18{,}0\ldots\,\text{N} \approx 18\,\text{N}$$

L'olio è meno denso dell'acqua, e lo stesso volume d'olio pesa meno: la spinta è più piccola.
```

```ad-warning
La densità del fluido, non quella del corpo
Nella formula della spinta c'è la densità del fluido in cui il corpo è immerso. Per un blocco di ferro di $0{,}50\,\text{dm}^3$ in acqua la spinta è $1000 \cdot 0{,}50 \cdot 10^{-3} \cdot 9{,}8 = 4{,}9\,\text{N}$; con la densità del ferro, $7870\,\text{kg/m}^3$, si troverebbe $39\,\text{N}$, che è il peso del blocco.
```

```ad-warning
La spinta non dipende dal peso del corpo
Due corpi con lo stesso volume, tutti e due sott'acqua, ricevono la stessa spinta, anche se uno è di legno e l'altro di piombo: spostano la stessa quantità d'acqua. Cambia il peso, e quindi cambia che cosa succede (uno risale, l'altro affonda), ma la spinta è la stessa.
```

```ad-warning
Il volume immerso, non il volume totale
Per un corpo che sta in parte fuori dal liquido, nella formula va solo il volume della parte immersa. E una volta che il corpo è tutto sott'acqua, andare più a fondo non cambia la spinta: la differenza di pressione tra la faccia di sotto e quella di sopra resta la stessa.
```

## Il peso apparente

Un corpo appeso a un [dinamometro](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro) e immerso in un liquido fa segnare meno che in aria: sul corpo agiscono il peso $\vec{P}$ verso il basso, la spinta $\vec{S}_A$ e la forza del dinamometro verso l'alto, e in equilibrio il dinamometro deve reggere solo la parte del peso che la spinta non regge. Quello che il dinamometro segna si chiama **peso apparente**:

$$P_{app} = P - S_A$$

```tikz
% nome: peso-apparente-forze
% alt: Un blocco appeso con un filo, tutto immerso in un liquido: dal centro del blocco partono il peso P verso il basso e, verso l'alto, la spinta di Archimede e la forza del filo, che insieme sono lunghe quanto il peso
% svg: peso-apparente-forze-7f6a49a2.svg 156x144
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (3,2.6);
\draw[thin] (0,2.6) -- (3,2.6);
\draw[thick] (0,3) -- (0,0) -- (3,0) -- (3,3);
\draw (1.5,3.5) -- (1.5,1.8);
\draw[thick, fill=blue!10] (1.1,1) rectangle (1.9,1.8);
\fill (1.5,1.4) circle (1.5pt);
\draw[-{Stealth}, thick, red] (1.5,1.4) -- (1.5,0.2) node[right] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (1.6,1.4) -- (1.6,1.85) node[right] {$\vec{S}_A$};
\draw[-{Stealth}, thick, red] (1.4,1.4) -- (1.4,2.15) node[left] {$\vec{T}$};
\node[right] at (1.55,3.4) {\small al dinamometro};
\end{tikzpicture}
```

```ad-example
Esempio 2: un blocco di alluminio nell'acqua
Un blocco di alluminio ha la massa di $270\,\text{g}$ e il volume di $100\,\text{cm}^3$. Quanto segna il dinamometro a cui è appeso, in aria e con il blocco tutto immerso in acqua?

In aria segna il peso: $P = 0{,}270\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 2{,}646\,\text{N} \approx 2{,}6\,\text{N}$.

In acqua, con $V = 100\,\text{cm}^3 = 1{,}00 \cdot 10^{-4}\,\text{m}^3$, la spinta è

$$S_A = 1000\,\text{kg/m}^3 \cdot 1{,}00 \cdot 10^{-4}\,\text{m}^3 \cdot 9{,}8\,\text{N/kg} = 0{,}98\,\text{N}$$

e il dinamometro segna

$$P_{app} = P - S_A = 2{,}646\,\text{N} - 0{,}98\,\text{N} = 1{,}666\,\text{N} \approx 1{,}7\,\text{N}$$
```

Nella figura qui sotto puoi abbassare il blocco nel liquido e cambiare liquido. Finché il blocco entra nel liquido la lettura cala, perché cresce il volume immerso; quando è tutto sotto, la lettura resta ferma, a qualunque profondità. Il livello del liquido nel recipiente sale del volume spostato.

```interattivo
% nome: dinamometro-corpo-immerso
% alt: Un blocco di 100 centimetri cubi appeso a un dinamometro sopra un recipiente di liquido; con un cursore si abbassa il blocco nel liquido e con dei bottoni si sceglie il liquido, acqua, olio o acqua di mare, e il blocco, di alluminio o di ferro: la lettura del dinamometro cala mentre il blocco entra nel liquido e resta costante quando è tutto immerso, la spinta è la stessa per i due blocchi e cambia con il liquido, e il livello del liquido nel recipiente sale
```

### La densità di un corpo con il dinamometro

Le due letture del dinamometro, in aria e in acqua, bastano a trovare il volume di un corpo di forma qualunque, e quindi la sua densità. La differenza tra le due letture è la spinta, $S_A = P - P_{app}$; dalla spinta si ricava il volume, $V = \dfrac{S_A}{d_{acqua} \cdot g}$, e dal peso e dal volume la [densità](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-derivate-area-volume-e-densita). In un solo passaggio:

$$d_{corpo} = \frac{m}{V} = \frac{P / g}{S_A / (d_{acqua} \cdot g)} = d_{acqua} \cdot \frac{P}{P - P_{app}}$$

```ad-example
Esempio 3: la corona è d'oro?
Si racconta che il re Gerone di Siracusa chiese ad Archimede di scoprire, senza rovinarla, se la sua corona fosse d'oro puro. Una corona pesa $24{,}5\,\text{N}$ in aria e $22{,}9\,\text{N}$ tutta immersa in acqua. È d'oro puro, che ha la densità di $19\,300\,\text{kg/m}^3$?

La spinta è $S_A = 24{,}5 - 22{,}9 = 1{,}6\,\text{N}$, e la densità della corona

$$d = 1000\,\text{kg/m}^3 \cdot \frac{24{,}5\,\text{N}}{1{,}6\,\text{N}} = 15\,312{,}5\,\text{kg/m}^3 \approx 1{,}5 \cdot 10^4\,\text{kg/m}^3$$

È molto meno di quella dell'oro: nella corona c'è un metallo meno denso, per esempio argento. Una corona d'oro puro dello stesso peso avrebbe un volume più piccolo, riceverebbe una spinta di circa $1{,}3\,\text{N}$ e in acqua peserebbe circa $23{,}2\,\text{N}$.
```

## Galleggiare o affondare

Un corpo tutto immerso in un liquido e lasciato libero riceve due forze: il peso verso il basso e la spinta verso l'alto. Il peso è $P = d_{corpo} \cdot V \cdot g$, la spinta $S_A = d_{liquido} \cdot V \cdot g$, con lo stesso volume $V$: le due forze stanno tra loro come le due densità.

- Se $d_{corpo} > d_{liquido}$, il peso vince e il corpo **affonda**, fino a posarsi sul fondo, che regge la parte del peso che la spinta non regge.
- Se $d_{corpo} = d_{liquido}$, le due forze si fanno equilibrio e il corpo resta **sospeso** dove si trova, a qualunque profondità.
- Se $d_{corpo} < d_{liquido}$, la spinta vince e il corpo **sale** verso la superficie. Lì esce in parte dal liquido, il volume immerso diminuisce e con lui la spinta, finché la spinta non è uguale al peso: il corpo **galleggia**.

```tikz
% nome: affonda-sospeso-galleggia
% alt: Tre corpi nello stesso liquido con il peso P e la spinta di Archimede disegnati dal centro: a sinistra un corpo più denso del liquido posato sul fondo, con il peso più lungo della spinta; al centro un corpo con la densità del liquido sospeso a metà, con peso e spinta uguali; a destra un corpo meno denso che galleggia con una parte fuori dal liquido, con peso e spinta uguali
% svg: affonda-sospeso-galleggia-22146130.svg 234x174
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (6,2.6);
\draw[thin] (0,2.6) -- (6,2.6);
\draw[thick] (0,3.1) -- (0,0) -- (6,0) -- (6,3.1);
\draw[thick, fill=gray!20] (0.6,0) rectangle (1.4,0.8);
\fill (1,0.4) circle (1.5pt);
\draw[-{Stealth}, thick, red] (1,0.4) -- (1,-0.6) node[right] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (1,0.4) -- (1,1) node[right] {$\vec{S}_A$};
\draw[thick, fill=blue!10] (2.6,0.9) rectangle (3.4,1.7);
\fill (3,1.3) circle (1.5pt);
\draw[-{Stealth}, thick, red] (3,1.3) -- (3,0.7) node[right] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (3,1.3) -- (3,1.9) node[right] {$\vec{S}_A$};
\draw[thick, fill=orange!25] (4.6,2) rectangle (5.4,2.8);
\fill (5,2.4) circle (1.5pt);
\draw[-{Stealth}, thick, red] (5,2.4) -- (5,1.95);
\draw[-{Stealth}, thick, red] (5,2.4) -- (5,2.85);
\node[red, right] at (5.4,2.85) {$\vec{S}_A$};
\node[red, right] at (5.4,1.95) {$\vec{P}$};
\node[above] at (1,3.1) {\small affonda};
\node[above] at (3,3.1) {\small sospeso};
\node[above] at (5,3.1) {\small galleggia};
\end{tikzpicture}
```

Il legno, il ghiaccio, l'olio galleggiano sull'acqua perché sono meno densi dell'acqua; il ferro, il vetro, la pietra affondano. Nel mercurio, con la densità di $13\,600\,\text{kg/m}^3$, galleggia anche il ferro.

```ad-warning
Pesante non vuol dire che affonda
Una trave di legno di cento chili galleggia e un chiodo di pochi grammi affonda: non conta il peso del corpo, conta la sua densità confrontata con quella del liquido. Il peso da solo non dice niente, perché anche la spinta cresce con il volume.
```

## La parte immersa di un corpo che galleggia

Per un corpo che galleggia il peso è uguale alla spinta, con il volume immerso al posto del volume intero:

$$d_{corpo} \cdot V \cdot g = d_{liquido} \cdot V_{imm} \cdot g$$

Dividendo per $g$ e per $V$ si trova la frazione del volume che resta sotto la superficie:

$$\frac{V_{imm}}{V} = \frac{d_{corpo}}{d_{liquido}}$$

Un corpo con la metà della densità del liquido galleggia con metà del volume sotto; uno con densità vicina a quella del liquido galleggia quasi tutto sommerso.

```ad-example
Esempio 4: un blocco di legno
Un blocco di legno alto $10\,\text{cm}$, con la densità di $600\,\text{kg/m}^3$, galleggia in acqua con le facce orizzontali. Quanti centimetri della sua altezza sono sott'acqua? E nell'olio d'oliva?

Per un blocco con le facce orizzontali il rapporto dei volumi è il rapporto delle altezze, perché la base è la stessa:

$$\frac{h_{imm}}{h} = \frac{d_{corpo}}{d_{liquido}} = \frac{600}{1000} = 0{,}60 \qquad h_{imm} = 0{,}60 \cdot 10\,\text{cm} = 6{,}0\,\text{cm}$$

Nell'olio: $h_{imm} = \dfrac{600}{920} \cdot 10\,\text{cm} = 6{,}52\ldots\,\text{cm} \approx 6{,}5\,\text{cm}$. L'olio è meno denso, e il blocco ci affonda di più.
```

```ad-warning
Il rapporto va nel verso giusto
La frazione immersa è $\dfrac{d_{corpo}}{d_{liquido}}$, un numero minore di $1$ per un corpo che galleggia. Con $\dfrac{1000}{600}$ si troverebbe una parte immersa più grande del blocco intero, che non ha senso.
```

Nella figura qui sotto puoi cambiare la densità del blocco e il liquido: la parte immersa si aggiusta finché la spinta non è uguale al peso, e quando il blocco è più denso del liquido va a fondo.

```interattivo
% nome: galleggiamento-densita
% alt: Un blocco in un recipiente di liquido con il peso e la spinta di Archimede disegnati come frecce; con un cursore si cambia la densità del blocco, da 100 a 1500 chilogrammi al metro cubo, e con dei bottoni il liquido, olio, acqua o acqua di mare: il blocco si assesta con la frazione immersa uguale al rapporto tra le densità, resta sospeso quando le densità sono uguali e va a fondo quando è più denso del liquido
```

### Gli iceberg

Il ghiaccio ha la densità di $917\,\text{kg/m}^3$ e l'acqua di mare circa $1030\,\text{kg/m}^3$. Un iceberg galleggia con

$$\frac{V_{imm}}{V} = \frac{917}{1030} = 0{,}890\ldots \approx 89\%$$

del suo volume sott'acqua: si vede solo la "punta dell'iceberg", circa un decimo del totale. Per questo gli iceberg sono pericolosi per le navi, che ne vedono solo una piccola parte.

```tikz
% nome: iceberg-parte-immersa
% alt: Un iceberg che galleggia nel mare: sopra la superficie ne sporge solo una piccola punta, circa un decimo del volume, mentre quasi nove decimi stanno sott'acqua
% svg: iceberg-parte-immersa-5cc3450e.svg 214x153
\begin{tikzpicture}
\fill[cyan!20] (0,-3.2) rectangle (5,0);
\draw[thin] (0,0) -- (5,0);
\draw[thick, fill=blue!10] (1.9,0) -- (2.2,0.6) -- (2.6,0.75) -- (2.9,0.35) -- (3.1,0) -- (3.6,-0.5) -- (3.9,-1.4) -- (3.6,-2.4) -- (2.8,-2.9) -- (1.9,-2.7) -- (1.2,-2) -- (1.1,-1) -- (1.4,-0.4) -- cycle;
\draw[thin] (1.4,0) -- (1.9,0);
\draw[thin] (3.1,0) -- (3.5,0);
\node[right] at (3.3,0.4) {\small circa $11\%$};
\node[right] at (3.95,-1.4) {\small circa $89\%$};
\end{tikzpicture}
```

### Le navi

Una nave è fatta d'acciaio, che ha una densità quasi otto volte quella dell'acqua, eppure galleggia: lo scafo è vuoto, pieno d'aria, e la massa della nave è distribuita su un volume grande. Conta la densità media, la massa totale divisa per il volume dello scafo, che è minore di quella dell'acqua. La nave affonda nell'acqua finché il peso dell'acqua spostata non è uguale al suo peso: più la si carica, più affonda. Sulle fiancate delle navi da carico la **linea di galleggiamento** segna il punto fino a cui lo scafo può scendere a pieno carico.

```ad-example
Esempio 5: una chiatta dal fiume al mare
Una chiatta a forma di parallelepipedo ha la base di $20\,\text{m} \times 6{,}0\,\text{m}$ e con il suo carico ha la massa di $3{,}6 \cdot 10^5\,\text{kg}$. Quanto è immersa nell'acqua dolce di un fiume? E in mare?

La chiatta galleggia quando la massa dell'acqua spostata è uguale alla sua: $d_{liquido} \cdot S \cdot h_{imm} = m$, con $S = 20 \cdot 6{,}0 = 120\,\text{m}^2$. Nel fiume

$$h_{imm} = \frac{m}{d \cdot S} = \frac{3{,}6 \cdot 10^5\,\text{kg}}{1000\,\text{kg/m}^3 \cdot 120\,\text{m}^2} = 3{,}0\,\text{m}$$

In mare: $h_{imm} = \dfrac{3{,}6 \cdot 10^5}{1030 \cdot 120}\,\text{m} = 2{,}91\ldots\,\text{m} \approx 2{,}9\,\text{m}$. Passando dal fiume al mare la chiatta sale di una decina di centimetri, perché l'acqua di mare è più densa.
```

### Le mongolfiere

Anche l'aria è un fluido, e spinge verso l'alto i corpi che ci sono immersi, compresi noi: la spinta dell'aria su una persona è di circa un newton, trascurabile rispetto al peso. Diventa importante per i corpi con un grande volume e poca massa. Una mongolfiera è un pallone pieno d'aria scaldata da un bruciatore: l'aria calda è meno densa di quella fredda che la circonda, e la spinta dell'aria esterna supera il peso dell'aria calda dentro il pallone. La differenza regge l'involucro, la cesta e i passeggeri.

```ad-example
Esempio 6: una mongolfiera
Una mongolfiera ha il volume di $2400\,\text{m}^3$. L'aria fuori ha la densità di $1{,}20\,\text{kg/m}^3$, l'aria calda dentro di $0{,}95\,\text{kg/m}^3$. Quale massa può sollevare, tra involucro, cesta e passeggeri?

La spinta è il peso dell'aria esterna spostata: $S_A = 1{,}20 \cdot 2400 \cdot 9{,}8\,\text{N} = 28\,224\,\text{N}$. L'aria calda pesa $0{,}95 \cdot 2400 \cdot 9{,}8\,\text{N} = 22\,344\,\text{N}$. La differenza,

$$S_A - P_{aria\ calda} = 5880\,\text{N} \approx 5{,}9 \cdot 10^3\,\text{N}$$

è il peso di una massa di $\dfrac{5880}{9{,}8} = 600\,\text{kg}$. Più calda è l'aria dentro, meno è densa e più la mongolfiera può sollevare.
```

## Il densimetro

Il **densimetro** misura la densità di un liquido con il galleggiamento. È un tubo di vetro chiuso con una zavorra in fondo, che lo tiene dritto, e una scala graduata nella parte stretta in alto. Messo in un liquido, galleggia e affonda finché il peso del liquido spostato non è uguale al suo peso. In un liquido poco denso deve spostare più liquido, e affonda di più; in un liquido denso affonda di meno. La densità si legge sulla scala, alla tacca che coincide con la superficie del liquido: i numeri piccoli stanno in alto.

```tikz
% nome: densimetro-due-liquidi
% alt: Lo stesso densimetro in due cilindri: nell'alcol, meno denso, affonda di più e la superficie arriva in alto sulla scala; nell'acqua di mare, più densa, affonda di meno e sporge di più
% svg: densimetro-due-liquidi-bd41dab9.svg 163x192
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (1.4,3);
\draw[thin] (0,3) -- (1.4,3);
\draw[thick] (0,3.9) -- (0,0) -- (1.4,0) -- (1.4,3.9);
\draw[thick, fill=gray!20] (0.7,0.55) ellipse (0.25 and 0.45);
\draw[thick] (0.62,0.98) -- (0.62,3.5) -- (0.78,3.5) -- (0.78,0.98);
\foreach \y in {2.1,2.4,2.7,3.0,3.3} \draw[thin] (0.62,\y) -- (0.72,\y);
\node[below] at (0.7,-0.05) {\small alcol};
\begin{scope}[xshift=2.4cm]
\fill[cyan!20] (0,0) rectangle (1.4,3);
\draw[thin] (0,3) -- (1.4,3);
\draw[thick] (0,3.9) -- (0,0) -- (1.4,0) -- (1.4,3.9);
\draw[thick, fill=gray!20] (0.7,1.45) ellipse (0.25 and 0.45);
\draw[thick] (0.62,1.88) -- (0.62,4.4) -- (0.78,4.4) -- (0.78,1.88);
\foreach \y in {3.0,3.3,3.6,3.9,4.2} \draw[thin] (0.62,\y) -- (0.72,\y);
\node[below] at (0.7,-0.05) {\small acqua di mare};
\end{scope}
\end{tikzpicture}
```

Con i densimetri si controlla la gradazione del vino e dei liquori (l'alcol è meno denso dell'acqua), la concentrazione dello zucchero nel mosto e il liquido delle batterie delle automobili.
