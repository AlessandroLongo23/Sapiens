# La forza elastica e la legge di Hooke

Tiri un elastico e si allunga; lo lasci e torna com'era. Una molla fa lo stesso, e in più si allunga in modo regolare: con una forza doppia, un allungamento doppio. È la legge di Hooke, dal nome di Robert Hooke, che la pubblicò nel 1678. Su questa legge funziona il [dinamometro](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro), che misura le forze con l'allungamento di una molla.

## Corpi elastici e corpi plastici

Una forza può deformare un corpo. Se il corpo, quando la forza smette di agire, riprende la forma e le dimensioni che aveva, si dice **elastico**: una molla, un elastico, una palla da tennis. Se resta deformato, si dice **plastico**: la plastilina, un foglio di alluminio accartocciato.

Lo stesso corpo può comportarsi nei due modi: una molla tirata poco torna com'era, una molla tirata troppo resta allungata per sempre. Il confine tra i due comportamenti è il limite di elasticità, alla fine della lezione.

## Allungamento e lunghezza

Una molla che nessuno tira ha la sua **lunghezza a riposo** $l_0$. Quando viene tirata diventa lunga $l$, e la differenza è l'**allungamento**:

$$\Delta l = l - l_0$$

```tikz
% nome: molla-lunghezza-allungamento
% alt: Due molle uguali appese a un soffitto: a sinistra a riposo, lunga l con zero; a destra con un blocco appeso, lunga l; la differenza tra le due lunghezze, segnata in basso tra la linea tratteggiata della fine della molla a riposo e la fine della molla tirata, è l'allungamento delta l
% svg: molla-lunghezza-allungamento-a8331dd1.svg 160x146
\begin{tikzpicture}
\draw[thick] (2.6,0) -- (-0.6,0);
\foreach \x in {2.45,2.3,...,-0.6} \draw[thin] (\x,0) -- ++(0.15,0.15);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0,0) -- (0,-2);
\fill (0,-2) circle (1.5pt);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (1.8,0) -- (1.8,-3);
\draw[thick, fill=blue!10] (1.45,-3.6) rectangle (2.15,-3);
\draw[dashed, thin] (0.15,-2) -- (2.7,-2);
\draw[<->, thin] (-0.45,0) -- (-0.45,-2);
\node[left] at (-0.45,-1) {$l_0$};
\draw[<->, thin] (1.15,0) -- (1.15,-3);
\node[left] at (1.15,-1.5) {$l$};
\draw[<->, thin] (2.55,-2) -- (2.55,-3);
\node[right] at (2.55,-2.5) {$\Delta l$};
\draw[thin] (2.15,-3) -- (2.7,-3);
\end{tikzpicture}
```

L'allungamento è la parte in più, non la lunghezza della molla: una molla lunga $12\,\text{cm}$ a riposo che arriva a $16\,\text{cm}$ si è allungata di $4\,\text{cm}$. Se la molla viene compressa, $l$ è minore di $l_0$ e la differenza $l_0 - l$ si chiama accorciamento o compressione.

## La legge di Hooke

Appendendo a una molla corpi sempre più pesanti e misurando ogni volta l'allungamento, si trova che l'allungamento è direttamente proporzionale alla forza: se la forza raddoppia, raddoppia anche l'allungamento. È la **legge di Hooke**:

$$F = k \cdot \Delta l$$

dove $F$ è il modulo della forza che allunga la molla e $\Delta l$ l'allungamento. La costante $k$ è la **costante elastica** della molla. La legge vale allo stesso modo per le compressioni, con $\Delta l$ uguale all'accorciamento.

### La forza elastica

La molla allungata tira a sua volta chi la allunga: una molla tirata verso destra tira la mano verso sinistra, una molla compressa spinge la mano indietro. La forza che la molla esercita si chiama **forza elastica** $\vec{F}_e$ (o forza di richiamo, perché riporta la molla verso la lunghezza a riposo):

- il modulo è $F_e = k \cdot \Delta l$, lo stesso della forza che la deforma;
- la direzione è quella della molla;
- il verso è opposto alla deformazione: verso la molla, se è allungata; verso l'esterno, se è compressa.

```tikz
% nome: molla-forza-elastica-verso
% alt: Una molla fissata a una parete e attaccata a un blocco, in due casi: sopra è allungata oltre la posizione a riposo, segnata con una linea tratteggiata, e la mano tira il blocco verso destra con la forza F mentre la forza elastica Fe punta verso sinistra; sotto è compressa, la mano spinge il blocco verso sinistra e la forza elastica punta verso destra
% svg: molla-forza-elastica-verso-9df3524a.svg 197x142
\begin{tikzpicture}
\draw[thick] (0,2.6) -- (0,-0.4);
\foreach \y in {2.45,2.3,...,-0.4} \draw[thin] (0,\y) -- ++(-0.15,-0.15);
\draw[dashed, thin] (2,2.6) -- (2,-0.4);
\node[above] at (2,2.6) {\small a riposo};
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0,1.6) -- (2.8,1.6);
\draw[thick, fill=blue!10] (2.8,1.45) rectangle (3.7,2.35);
\draw[-{Stealth}, thick, red] (3.25,1.9) -- (4.45,1.9) node[right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (3.25,1.9) -- (2.05,1.9);
\node[red, above] at (2.3,1.9) {$\vec{F}_e$};
\fill (3.25,1.9) circle (1.5pt);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0,0.1) -- (1.2,0.1);
\draw[thick, fill=blue!10] (1.2,-0.05) rectangle (2.1,0.85);
\draw[-{Stealth}, thick, red] (1.65,0.4) -- (2.85,0.4) node[right] {$\vec{F}_e$};
\draw[-{Stealth}, thick, red] (1.65,0.4) -- (0.45,0.4);
\node[red, above] at (0.7,0.4) {$\vec{F}$};
\fill (1.65,0.4) circle (1.5pt);
\end{tikzpicture}
```

```ad-note
La forza elastica con il segno
Se si mette un asse $x$ lungo la molla, con l'origine nella posizione a riposo dell'estremità, la forza elastica si scrive $F_x = -k\,x$: il segno meno dice che la forza ha sempre il verso opposto allo spostamento $x$. È la forma che si userà nella lezione [Il moto armonico](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-armonico).
```

## La costante elastica

Dalla legge di Hooke, $k = \dfrac{F}{\Delta l}$: la costante elastica è la forza che serve per allungare la molla di un metro. La sua unità di misura è quindi il newton al metro:

$$[k] = \text{N/m}$$

Una molla con $k$ grande è rigida, e per allungarla serve molta forza: quella degli ammortizzatori di un'auto ha una costante di decine di migliaia di newton al metro. Una molla con $k$ piccolo è morbida: le molle dei giocattoli hanno costanti di pochi newton al metro. A volte $k$ si dà in newton al centimetro: $1\,\text{N/cm} = 100\,\text{N/m}$, perché in un metro ci sono $100$ centimetri.

```ad-example
Esempio 1: la forza dall'allungamento
Una molla ha la costante elastica di $200\,\text{N/m}$. Quale forza serve per allungarla di $5{,}0\,\text{cm}$?

La costante è in newton al metro, quindi l'allungamento va in metri: $5{,}0\,\text{cm} = 0{,}050\,\text{m}$.

$$F = k \cdot \Delta l = 200\,\text{N/m} \cdot 0{,}050\,\text{m} = 10\,\text{N}$$
```

```ad-warning
Centimetri e metri
Con l'allungamento in centimetri e $k$ in newton al metro, $200 \cdot 5{,}0 = 1000$ non è la forza in newton: è cento volte troppo. Prima di usare la legge di Hooke l'allungamento va nell'unità di $k$, di solito in metri.
```

```ad-example
Esempio 2: l'allungamento dalla forza
Una molla con la costante elastica di $40\,\text{N/m}$ viene tirata con una forza di $6{,}0\,\text{N}$. Di quanto si allunga?

Dalla legge di Hooke si ricava l'allungamento dividendo per $k$:

$$\Delta l = \frac{F}{k} = \frac{6{,}0\,\text{N}}{40\,\text{N/m}} = 0{,}15\,\text{m} = 15\,\text{cm}$$
```

```ad-example
Esempio 3: lunghezza e allungamento
Una molla è lunga $12{,}0\,\text{cm}$ a riposo; con una forza di $2{,}0\,\text{N}$ diventa lunga $16{,}0\,\text{cm}$. Quanto vale la costante elastica? Quanto diventa lunga con una forza di $3{,}0\,\text{N}$?

L'allungamento è $\Delta l = 16{,}0\,\text{cm} - 12{,}0\,\text{cm} = 4{,}0\,\text{cm} = 0{,}040\,\text{m}$, quindi

$$k = \frac{F}{\Delta l} = \frac{2{,}0\,\text{N}}{0{,}040\,\text{m}} = 50\,\text{N/m}$$

Con $3{,}0\,\text{N}$ l'allungamento è $\Delta l = \dfrac{3{,}0\,\text{N}}{50\,\text{N/m}} = 0{,}060\,\text{m} = 6{,}0\,\text{cm}$, e la lunghezza della molla è $l = l_0 + \Delta l = 12{,}0\,\text{cm} + 6{,}0\,\text{cm} = 18{,}0\,\text{cm}$.
```

```ad-warning
L'allungamento non è la lunghezza
Nella legge di Hooke va l'allungamento $\Delta l = l - l_0$, non la lunghezza $l$. Nell'esempio 3, con la lunghezza $16{,}0\,\text{cm}$ al posto dell'allungamento si troverebbe $k = 12{,}5\,\text{N/m}$, quattro volte meno del valore giusto; e con $3{,}0\,\text{N}$ la molla non diventa lunga $6{,}0\,\text{cm}$, ma si allunga di $6{,}0\,\text{cm}$.
```

## Il grafico forza-allungamento

La legge di Hooke dice che la forza è direttamente proporzionale all'allungamento. Il grafico della forza in funzione dell'allungamento è quindi una retta che passa per l'origine, e la sua pendenza è la costante elastica: più la retta è ripida, più la molla è rigida (vedi [Proporzionalità diretta e dipendenza lineare](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare)).

```ad-example
Esempio 4: la costante elastica da una tabella
Appendendo a una molla forze diverse si sono misurati questi allungamenti. Qual è la costante elastica?

| $F$ (N) | $1{,}0$ | $2{,}0$ | $3{,}0$ | $4{,}0$ |
|---|---|---|---|---|
| $\Delta l$ (cm) | $2{,}5$ | $5{,}0$ | $7{,}5$ | $10{,}0$ |

```tikz
% nome: grafico-forza-allungamento
% alt: Il grafico della forza F in newton in funzione dell'allungamento delta l in centimetri: i quattro punti della tabella, da 2,5 centimetri e 1 newton a 10 centimetri e 4 newton, stanno su una retta che passa per l'origine
% svg: grafico-forza-allungamento-ca770c0a.svg 255x191
% poi-interattivo: trascinare un punto sulla retta, cambiare la costante elastica e vedere la pendenza cambiare
\begin{tikzpicture}[x=0.4cm, y=0.8cm]
\draw[gray!25, very thin] (0,0) grid[xstep=1, ystep=0.5] (11,4.5);
\draw[->] (0,0) -- (11.8,0) node[right] {\small $\Delta l$ (cm)};
\draw[->] (0,0) -- (0,5) node[above] {\small $F$ (N)};
\foreach \x in {2,4,6,8,10} \node[below] at (\x,0) {\scriptsize $\x$};
\foreach \y in {1,2,3,4} \node[left] at (0,\y) {\scriptsize $\y$};
\node[below left] at (0,0) {\scriptsize $0$};
\draw[thick, blue] (0,0) -- (11,4.4);
\foreach \p in {(2.5,1),(5,2),(7.5,3),(10,4)} \fill[blue] \p circle (2pt);
\end{tikzpicture}
```

I punti stanno su una retta per l'origine: la molla segue la legge di Hooke. La costante è il rapporto $F / \Delta l$, uguale per tutte le coppie; con la prima, e l'allungamento in metri,

$$k = \frac{1{,}0\,\text{N}}{0{,}025\,\text{m}} = 40\,\text{N/m}$$

La pendenza della retta si legge anche su due punti lontani: da $(0;\ 0)$ a $(10\,\text{cm};\ 4{,}0\,\text{N})$ la forza cresce di $4{,}0\,\text{N}$ su $0{,}10\,\text{m}$, e $4{,}0 : 0{,}10 = 40\,\text{N/m}$.
```

Nelle misure vere i punti non stanno mai esattamente su una retta, per le incertezze di misura: la retta si traccia in modo che passi il più vicino possibile a tutti, e la pendenza si calcola sulla retta, non su un punto solo.

## Una massa appesa alla molla

Il caso più comune è una molla verticale con un corpo appeso. Il corpo scende, la molla si allunga, e il corpo si ferma quando la forza elastica verso l'alto ha lo stesso modulo del suo [peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa) verso il basso:

$$k \cdot \Delta l = m \cdot g$$

Perché le due forze si bilancino è l'argomento della lezione [L'equilibrio di un punto materiale e le reazioni vincolari](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari).

```ad-example
Esempio 5: un corpo appeso
A una molla verticale con la costante elastica di $49\,\text{N/m}$ si appende un corpo di $0{,}30\,\text{kg}$. Di quanto si allunga la molla?

La forza che allunga la molla è il peso del corpo:

$$P = m \cdot g = 0{,}30\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 2{,}94\,\text{N}$$

Allora

$$\Delta l = \frac{P}{k} = \frac{2{,}94\,\text{N}}{49\,\text{N/m}} = 0{,}060\,\text{m} = 6{,}0\,\text{cm}$$
```

```ad-warning
La massa non è la forza
Nella legge di Hooke va una forza in newton. Con $0{,}30$ al posto di $2{,}94$ si troverebbe un allungamento circa dieci volte troppo piccolo: la massa appesa si trasforma prima in peso con $P = m \cdot g$.
```

Nella figura qui sotto puoi cambiare la massa appesa e la costante elastica e leggere l'allungamento sul righello.

```interattivo
% nome: molla-hooke-righello
% alt: Una molla appesa accanto a un righello in centimetri, con un corpo appeso; un cursore cambia la massa del corpo, da 0 a 500 grammi, e un altro la costante elastica, da 10 a 100 newton al metro. La molla si allunga di delta l uguale al peso diviso k, e sotto compaiono il peso, l'allungamento e la lunghezza della molla; una linea tratteggiata segna dove finisce la molla a riposo
```

## Il limite di elasticità

La legge di Hooke vale solo finché la forza non è troppo grande. Oltre una certa forza, il **limite di elasticità**, la molla si allunga più di quanto la legge preveda, e quando la forza smette di agire non torna più alla lunghezza a riposo: si è deformata in modo permanente, come un corpo plastico.

```tikz
% nome: grafico-limite-elasticita
% alt: Il grafico della forza in funzione dell'allungamento di una molla: un tratto rettilineo dall'origine fino al punto L, il limite di elasticità, dove vale la legge di Hooke; oltre L la curva si piega e l'allungamento cresce più della forza
% svg: grafico-limite-elasticita-e7ebba01.svg 210x146
\begin{tikzpicture}
\draw[->] (0,0) -- (4.6,0) node[right] {\small $\Delta l$};
\draw[->] (0,0) -- (0,3.1) node[above] {\small $F$};
\draw[thick, blue] (0,0) -- (2,2);
\draw[thick, blue] (2,2) .. controls (2.6,2.5) and (3.4,2.7) .. (4.3,2.8);
\draw[dashed, thin, blue] (2,2) -- (2.9,2.9);
\fill (2,2) circle (1.5pt);
\node[above left] at (2,2) {\small $L$};
\node[right] at (1.25,0.75) {\small legge di Hooke};
\end{tikzpicture}
```

Per questo un dinamometro non va mai usato oltre la sua portata, e le molle si scelgono in modo da lavorare sempre nel tratto rettilineo.
