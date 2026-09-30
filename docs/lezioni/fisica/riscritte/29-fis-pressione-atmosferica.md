# La pressione atmosferica e la sua misura

Viviamo sul fondo di un oceano d'aria alto centinaia di chilometri, e quell'aria ha un peso: preme su di noi, sui muri, sulla superficie dei laghi, con una pressione che al livello del mare vale circa $10^5\,\text{Pa}$. Non la sentiamo perché spinge in tutte le direzioni e perché i fluidi del nostro corpo spingono verso l'esterno con la stessa pressione. Si vede però quando la si toglie da una parte sola: una bottiglia di plastica da cui si aspira l'aria si accartoccia, una ventosa resta attaccata al vetro, una bibita sale nella cannuccia.

## L'aria ha un peso

L'aria è fatta di materia, e come ogni materia ha massa e quindi peso. La sua [densità](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-derivate-area-volume-e-densita) al livello del mare e a temperatura ambiente è circa $1{,}2\,\text{kg/m}^3$: quasi mille volte meno dell'acqua, ma non zero.

```ad-example
Esempio 1: l'aria di una stanza
Una stanza misura $5{,}0\,\text{m} \times 4{,}0\,\text{m} \times 3{,}0\,\text{m}$. Quanto pesa l'aria che contiene?

Il volume è $V = 5{,}0 \cdot 4{,}0 \cdot 3{,}0 = 60\,\text{m}^3$, la massa

$$m = d \cdot V = 1{,}2\,\text{kg/m}^3 \cdot 60\,\text{m}^3 = 72\,\text{kg}$$

e il [peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa)

$$P = m \cdot g = 72\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 705{,}6\,\text{N} \approx 7{,}1 \cdot 10^2\,\text{N}$$

L'aria di una stanza ha la massa di una persona adulta.
```

```ad-warning
L'aria non pesa
"L'aria non pesa niente" è falso: pesa poco rispetto ai solidi e ai liquidi, perché la sua densità è piccola, ma i volumi d'aria sono enormi. Sopra ogni metro quadrato del suolo c'è una colonna d'aria con la massa di circa dieci tonnellate.
```

## La pressione atmosferica

La **pressione atmosferica** è la [pressione](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione) che l'aria esercita su ogni superficie a contatto con essa. Nasce dal peso dell'aria che sta sopra: in un punto qualunque, l'aria sotto deve reggere tutta la colonna d'aria che ha sopra, fino alla fine dell'atmosfera. Si indica con $p_0$, e al livello del mare vale in media

$$p_0 \approx 1{,}013 \cdot 10^5\,\text{Pa}$$

Come in ogni fluido in equilibrio, la pressione in un punto è la stessa in tutte le direzioni: l'aria spinge dall'alto sul tavolo, ma anche da sotto, di lato, dall'interno di una bottiglia aperta. Per questo un foglio di carta non viene schiacciato, anche se su ogni sua faccia agiscono migliaia di newton.

```ad-example
Esempio 2: la forza dell'aria su un tavolo
Il piano di un tavolo misura $1{,}2\,\text{m} \times 0{,}80\,\text{m}$. Con quale forza l'aria preme sulla sua faccia superiore, se la pressione è $1013\,\text{hPa}$?

La superficie è $S = 1{,}2 \cdot 0{,}80 = 0{,}96\,\text{m}^2$ e la pressione in pascal è $1013\,\text{hPa} = 101\,300\,\text{Pa}$. Da $p = \dfrac{F}{S}$:

$$F = p \cdot S = 101\,300\,\text{Pa} \cdot 0{,}96\,\text{m}^2 = 97\,248\,\text{N} \approx 9{,}7 \cdot 10^4\,\text{N}$$

È quasi il peso di un camion di dieci tonnellate. Il tavolo non si rompe perché l'aria spinge con una forza uguale anche sulla faccia di sotto.
```

## L'esperienza di Torricelli

Nel 1644 Evangelista Torricelli misurò per primo la pressione dell'atmosfera. Prese un tubo di vetro lungo circa un metro, chiuso da una parte, lo riempì di mercurio, ne tappò l'estremità aperta con un dito e lo capovolse in una bacinella piena anch'essa di mercurio. Tolto il dito, il mercurio del tubo scese, ma non del tutto: si fermò quando la colonna era alta $76\,\text{cm}$ sopra la superficie del mercurio della bacinella. Nella parte alta del tubo restò uno spazio vuoto, il **vuoto torricelliano**.

```tikz
% nome: esperienza-torricelli
% alt: Il tubo di Torricelli capovolto in una bacinella di mercurio: il mercurio nel tubo arriva a 76 centimetri sopra la superficie del mercurio della bacinella, sopra la colonna c'è il vuoto, e sulla superficie libera della bacinella l'aria preme con la pressione atmosferica, indicata da frecce rosse verso il basso
% svg: esperienza-torricelli-60a66d2c.svg 173x163
\begin{tikzpicture}
\fill[gray!60] (-1.2,0) rectangle (1.2,0.5);
\draw[thin] (-1.2,0.5) -- (1.2,0.5);
\draw[thick] (-1.2,0.8) -- (-1.2,0) -- (1.2,0) -- (1.2,0.8);
\fill[gray!60] (-0.15,0.2) rectangle (0.15,3.54);
\draw[thick] (-0.15,0.2) -- (-0.15,4.2) -- (0.15,4.2) -- (0.15,0.2);
\draw[dashed, thin] (0.15,3.54) -- (1.9,3.54);
\draw[dashed, thin] (1.2,0.5) -- (1.9,0.5);
\draw[{Stealth}-{Stealth}, thin] (1.7,0.5) -- (1.7,3.54) node[midway, right] {\small $76$ cm};
\node[left] at (-0.2,3.9) {\small vuoto};
\node[left] at (-0.2,2.2) {\small mercurio};
\foreach \x in {-0.95,-0.6,0.6,0.95} \draw[-{Stealth}, thick, red] (\x,1.25) -- (\x,0.55);
\node[red, above] at (-0.775,1.25) {$p_0$};
\end{tikzpicture}
```

Il motivo è la [legge di Stevino](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-legge-di-stevino-e-i-vasi-comunicanti). Si guardino due punti alla stessa quota, quella della superficie libera della bacinella: uno fuori dal tubo, sulla superficie, dove l'aria preme con la pressione $p_0$; l'altro dentro il tubo, in fondo alla colonna. In un liquido in equilibrio due punti alla stessa quota hanno la stessa pressione. Dentro il tubo, sopra la colonna, c'è il vuoto, che non preme: la pressione in fondo alla colonna è solo quella del mercurio, $d \cdot g \cdot h$. Quindi

$$p_0 = d_{Hg} \cdot g \cdot h$$

La colonna di mercurio si ferma all'altezza in cui il suo peso fa la stessa pressione dell'aria. L'aria che preme sulla bacinella regge il mercurio nel tubo, come un piatto di una bilancia regge l'altro.

```ad-example
Esempio 3: la pressione dalla colonna di mercurio
La densità del mercurio è $d_{Hg} = 13\,600\,\text{kg/m}^3$. Quale pressione corrisponde a una colonna di $760\,\text{mm}$?

L'altezza va in metri, $760\,\text{mm} = 0{,}760\,\text{m}$:

$$p_0 = 13\,600\,\text{kg/m}^3 \cdot 9{,}8\,\text{N/kg} \cdot 0{,}760\,\text{m} = 101\,292{,}8\,\text{Pa} \approx 1{,}0 \cdot 10^5\,\text{Pa}$$

Con $g = 9{,}8\,\text{N/kg}$, che ha due cifre significative, il risultato ne ha due. Con i valori più precisi ($d_{Hg} = 13\,595\,\text{kg/m}^3$ a $0\,^\circ\text{C}$ e $g = 9{,}80665\,\text{N/kg}$) si trova circa $101\,325\,\text{Pa}$, il valore della pressione atmosferica normale.
```

L'altezza della colonna non dipende dalla forma del tubo. Un tubo più largo contiene più mercurio, ma la pressione in fondo dipende solo dall'altezza, come dice la legge di Stevino. E se il tubo si inclina, il mercurio ne occupa un tratto più lungo, ma la sua superficie resta alla stessa quota: $76\,\text{cm}$ misurati in verticale.

```tikz
% nome: torricelli-tubi-diversi
% alt: Tre tubi di Torricelli nella stessa bacinella di mercurio, uno stretto, uno largo e uno inclinato: in tutti e tre il mercurio arriva alla stessa quota, segnata da una linea tratteggiata orizzontale 76 centimetri sopra la superficie della bacinella
% svg: torricelli-tubi-diversi-073d06b0.svg 268x171
\begin{tikzpicture}
\fill[gray!60] (-0.5,0) rectangle (4.3,0.5);
\draw[thin] (-0.5,0.5) -- (4.3,0.5);
\draw[thick] (-0.5,0.8) -- (-0.5,0) -- (4.3,0) -- (4.3,0.8);
\fill[gray!60] (0.2,0.2) rectangle (0.4,3.54);
\draw[thick] (0.2,0.2) -- (0.2,4.4) -- (0.4,4.4) -- (0.4,0.2);
\fill[gray!60] (1.1,0.2) rectangle (1.7,3.54);
\draw[thick] (1.1,0.2) -- (1.1,4.4) -- (1.7,4.4) -- (1.7,0.2);
\fill[gray!60] (2.513,0.25) -- (4.413,3.54) -- (4.644,3.54) -- (2.687,0.15) -- cycle;
\draw[thick] (2.513,0.25) -- (4.813,4.234) -- (4.987,4.134) -- (2.687,0.15);
\draw[dashed, thin] (-0.5,3.54) -- (5.6,3.54);
\draw[dashed, thin] (4.3,0.5) -- (5.6,0.5);
\draw[{Stealth}-{Stealth}, thin] (5.4,0.5) -- (5.4,3.54) node[midway, right] {\small $76$ cm};
\end{tikzpicture}
```

Nella figura qui sotto puoi inclinare il tubo e salire di quota: la colonna si allunga dentro il tubo inclinato ma la sua cima resta alla stessa altezza; in montagna, dove l'aria preme di meno, la colonna è più bassa.

```interattivo
% nome: torricelli-tubo-inclinato
% alt: Un tubo di Torricelli pieno di mercurio capovolto in una bacinella; con un cursore si inclina il tubo da 0 a 60 gradi e con quattro bottoni si sceglie la quota, dal livello del mare a 4800 metri: la cima della colonna resta sempre alla stessa altezza verticale, 760 millimetri al livello del mare e meno in quota, mentre la lunghezza del mercurio nel tubo cresce con l'inclinazione, finché il mercurio riempie tutto il tubo
```

```ad-warning
L'altezza misurata lungo il tubo
In un tubo inclinato la colonna di mercurio è più lunga di $76\,\text{cm}$, ma conta solo il dislivello verticale tra la cima della colonna e la superficie della bacinella. Anche la larghezza del tubo non conta: un tubo più largo non ha una colonna più bassa.
```

### Perché il mercurio

Con l'acqua l'esperienza si può fare, ma serve un tubo altissimo. La colonna d'acqua che fa la stessa pressione della colonna di mercurio è $13{,}6$ volte più alta, perché l'acqua ha una densità $13{,}6$ volte più piccola.

```ad-example
Esempio 4: un barometro ad acqua
Quanto sarebbe alta la colonna di un barometro ad acqua al livello del mare, con $p_0 = 1{,}013 \cdot 10^5\,\text{Pa}$?

Da $p_0 = d \cdot g \cdot h$ si ricava l'altezza:

$$h = \frac{p_0}{d \cdot g} = \frac{1{,}013 \cdot 10^5\,\text{Pa}}{1000\,\text{kg/m}^3 \cdot 9{,}8\,\text{N/kg}} = 10{,}33\ldots\,\text{m} \approx 10\,\text{m}$$

Un tubo di dieci metri, alto come una casa di tre piani. Il mercurio è il più denso dei liquidi che si trovano a temperatura ambiente, e per questo dà la colonna più corta.
```

## Le unità di misura della pressione

L'unità del Sistema Internazionale è il pascal, $1\,\text{Pa} = 1\,\text{N/m}^2$, ma è piccolo: la pressione atmosferica vale circa centomila pascal. Per questo si usano anche altre unità.

| Unità | Simbolo | Quanto vale |
|---|---|---|
| ettopascal | hPa | $1\,\text{hPa} = 100\,\text{Pa}$ |
| bar | bar | $1\,\text{bar} = 10^5\,\text{Pa} = 1000\,\text{hPa}$ |
| millibar | mbar | $1\,\text{mbar} = 1\,\text{hPa}$ |
| atmosfera | atm | $1\,\text{atm} = 101\,325\,\text{Pa}$ |
| millimetro di mercurio | mmHg | $760\,\text{mmHg} = 1\,\text{atm}$, quindi $1\,\text{mmHg} \approx 133\,\text{Pa} = 1{,}33\,\text{hPa}$ |

Le previsioni del tempo danno la pressione in ettopascal ($1013\,\text{hPa}$ è la pressione normale al livello del mare); le gomme della bicicletta e le bombole si misurano in bar; i medici misurano la pressione del sangue in millimetri di mercurio. Il millimetro di mercurio viene proprio dall'esperienza di Torricelli: è la pressione di una colonna di mercurio alta un millimetro.

```ad-example
Esempio 5: da un'unità all'altra
Un barometro segna $1020\,\text{hPa}$. Quanto vale la pressione in pascal e in bar? E una colonna di mercurio di $745\,\text{mm}$ a quanti ettopascal corrisponde?

$$1020\,\text{hPa} = 1020 \cdot 100\,\text{Pa} = 102\,000\,\text{Pa} \qquad 1020\,\text{hPa} = \frac{1020}{1000}\,\text{bar} = 1{,}020\,\text{bar}$$

Per la colonna di mercurio si moltiplica per $1{,}33\,\text{hPa}$, il valore di un millimetro di mercurio:

$$745\,\text{mmHg} = 745 \cdot 1{,}33\,\text{hPa} = 990{,}85\,\text{hPa} \approx 991\,\text{hPa}$$
```

```ad-warning
Ettopascal e pascal
"Etto" vuol dire cento, non mille: $1\,\text{hPa} = 100\,\text{Pa}$, e $1013\,\text{hPa}$ sono $101\,300\,\text{Pa}$, non $1\,013\,000\,\text{Pa}$. Prima di usare $p = \dfrac{F}{S}$ la pressione va portata in pascal.
```

```ad-warning
Il millimetro di mercurio non è una lunghezza
"$760\,\text{mmHg}$" è una pressione, non un'altezza: è la pressione che fa una colonna di mercurio alta $760\,\text{mm}$. Una colonna d'acqua alta $760\,\text{mm}$ fa una pressione $13{,}6$ volte più piccola.
```

## I barometri

Il **barometro** è lo strumento che misura la pressione atmosferica. Il barometro a mercurio è il tubo di Torricelli con una scala graduata accanto: si legge l'altezza della colonna in millimetri. È preciso, ma è fragile e il mercurio è tossico, e oggi si trova quasi solo nei musei.

Il barometro più diffuso è il **barometro aneroide** (cioè "senza liquido"): una scatoletta di metallo sottile e ondulato da cui è stata tolta quasi tutta l'aria. Quando la pressione esterna aumenta, le facce della scatola si schiacciano un poco; quando diminuisce, si allargano. Una leva amplifica questi piccoli movimenti e muove un indice su un quadrante. Gli altimetri degli aerei e degli escursionisti sono barometri aneroidi con la scala in metri, perché la pressione cambia con la quota.

## La pressione cambia con l'altitudine

Salendo di quota, sopra di noi resta meno aria, e la pressione diminuisce. Nel 1648 Florin Périer, cognato di Blaise Pascal, portò un barometro a mercurio in cima al Puy de Dôme, un monte della Francia alto circa $1500\,\text{m}$, e trovò la colonna più bassa di circa $8\,\text{cm}$ rispetto alla città ai suoi piedi: fu la prova che la colonna è retta dal peso dell'aria.

La pressione non cala in modo uniforme. L'aria si comprime sotto il proprio peso, e gli strati bassi sono più densi di quelli alti: nei primi chilometri la pressione cala in fretta, poi sempre più piano. Vicino al livello del mare cala di circa $1\,\text{hPa}$ ogni $8$ metri di salita. La tabella dà i valori medi dell'atmosfera standard, quella usata come riferimento in aviazione.

| Quota | Pressione media | Colonna di mercurio |
|---|---|---|
| livello del mare | $1013\,\text{hPa}$ | $760\,\text{mm}$ |
| $1000\,\text{m}$ | $899\,\text{hPa}$ | $674\,\text{mm}$ |
| $2000\,\text{m}$ | $795\,\text{hPa}$ | $596\,\text{mm}$ |
| $3000\,\text{m}$ | $701\,\text{hPa}$ | $526\,\text{mm}$ |
| $5500\,\text{m}$ | $505\,\text{hPa}$ | $379\,\text{mm}$ |
| $8849\,\text{m}$ (Everest) | $314\,\text{hPa}$ | $236\,\text{mm}$ |

A circa $5500\,\text{m}$ la pressione è la metà che al livello del mare, e sulla cima dell'Everest circa un terzo. Per questo in alta montagna si respira a fatica (in ogni respiro entra meno aria), e le cabine degli aerei, che volano intorno ai $10\,000\,\text{m}$, sono pressurizzate. Anche le orecchie che "si tappano" in funivia o in aereo sono un effetto della pressione che cambia: l'aria dietro il timpano resta per un po' alla pressione di prima.

```ad-note
La pressione cambia anche con il tempo atmosferico
Nello stesso posto la pressione cambia di giorno in giorno di qualche decina di ettopascal: un'area di alta pressione (anticiclone) porta di solito tempo stabile, una di bassa pressione (ciclone) nuvole e pioggia. Per confrontare i barometri di città a quote diverse, le carte del tempo riportano tutte le pressioni al livello del mare.
```

## Gli emisferi di Magdeburgo

A metà del Seicento Otto von Guericke, sindaco di Magdeburgo, fece un esperimento rimasto famoso. Unì due emisferi di rame, larghi circa mezzo metro, con una guarnizione, e con una pompa che aveva inventato tolse quasi tutta l'aria dalla sfera. Due tiri di cavalli, attaccati agli anelli dei due emisferi, non riuscirono a separarli. Quando Guericke fece rientrare l'aria da una valvola, gli emisferi si staccarono da soli.

```tikz
% nome: emisferi-magdeburgo
% alt: Due emisferi uniti a formare una sfera vuota all'interno; l'aria esterna preme su tutta la superficie con frecce rosse rivolte verso l'interno, mentre due forze F tirano gli anelli dei due emisferi in versi opposti senza riuscire a separarli
% svg: emisferi-magdeburgo-c949db52.svg 204x121
\begin{tikzpicture}
\draw[thick, fill=gray!20] (-0.05,1) arc (90:270:1) -- cycle;
\draw[thick, fill=gray!20] (0.05,1) arc (90:-90:1) -- cycle;
\draw[thick, fill=gray!20] (-0.15,-1.15) rectangle (-0.05,1.15);
\draw[thick, fill=gray!20] (0.05,-1.15) rectangle (0.15,1.15);
\node at (-0.52,0.3) {\scriptsize vuoto};
\draw[thick] (-1,0) -- (-1.2,0);
\draw[thick] (-1.32,0) circle (0.12);
\draw[thick] (1,0) -- (1.2,0);
\draw[thick] (1.32,0) circle (0.12);
\draw[-{Stealth}, thick, red] (-1.44,0) -- (-2.4,0) node[above] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (1.44,0) -- (2.4,0) node[above] {$\vec{F}$};
\foreach \a in {30,60,120,150,210,240,300,330} \draw[-{Stealth}, thick, red] (\a:1.6) -- (\a:1.08);
\node[red, right] at (0.85,1.5) {$p_0$};
\end{tikzpicture}
```

Dentro la sfera l'aria non c'è più, e nessuno spinge gli emisferi verso l'esterno; fuori, l'aria preme su ogni punto della superficie. Per staccarli bisogna vincere la forza che l'aria fa su ciascun emisfero, cioè la pressione moltiplicata per l'area del cerchio in cui la sfera è tagliata, $\pi r^2$: le spinte oblique sulla superficie curva si sommano come se l'aria premesse su quel cerchio.

```ad-example
Esempio 6: la forza sugli emisferi
Due emisferi hanno il raggio di $25\,\text{cm}$, e dentro la sfera non c'è più aria. Con quale forza bisogna tirarli per separarli, se fuori la pressione è $1{,}013 \cdot 10^5\,\text{Pa}$?

Il raggio in metri è $0{,}25\,\text{m}$, e l'area del cerchio è $S = \pi r^2 = \pi \cdot (0{,}25\,\text{m})^2 = 0{,}196\ldots\,\text{m}^2$. Quindi

$$F = p_0 \cdot S = 1{,}013 \cdot 10^5\,\text{Pa} \cdot 0{,}196\,\text{m}^2 \approx 2{,}0 \cdot 10^4\,\text{N}$$

La stessa forza che serve per sollevare una massa di due tonnellate.
```

## La cannuccia e la ventosa

Quando bevi con una cannuccia, non tiri su la bibita. Aspirando togli un po' d'aria dalla cannuccia e dalla bocca, e la pressione lì dentro diventa più piccola di quella atmosferica. Sulla superficie della bibita nel bicchiere l'aria continua a premere con la pressione $p_0$, e spinge il liquido su per la cannuccia, finché la colonna che sale fa la differenza di pressione.

```tikz
% nome: cannuccia-pressione
% alt: Un bicchiere con una bibita e una cannuccia: sulla superficie della bibita l'aria preme con la pressione atmosferica, frecce rosse verso il basso, mentre dentro la cannuccia la pressione è più piccola e la bibita sale nella cannuccia sopra il livello del bicchiere
% svg: cannuccia-pressione-761edcb3.svg 96x114
\begin{tikzpicture}
\fill[cyan!20] (-0.7,0) -- (0.7,0) -- (0.767,1.2) -- (-0.767,1.2) -- cycle;
\draw[thin] (-0.767,1.2) -- (0.767,1.2);
\draw[thick] (-0.82,1.9) -- (-0.7,0) -- (0.7,0) -- (0.82,1.9);
\fill[cyan!20] (0.15,0.15) rectangle (0.35,2.15);
\draw[thin] (0.15,2.15) -- (0.35,2.15);
\draw[thick] (0.15,0.15) -- (0.15,2.9);
\draw[thick] (0.35,0.15) -- (0.35,2.9);
\foreach \x in {-0.5,-0.2} \draw[-{Stealth}, thick, red] (\x,1.85) -- (\x,1.25);
\node[red, above] at (-0.35,1.85) {$p_0$};
\node[right] at (0.4,2.6) {$p < p_0$};
\end{tikzpicture}
```

Anche con il vuoto perfetto nella bocca, la pressione atmosferica spingerebbe l'acqua in una cannuccia al massimo fino a circa $10\,\text{m}$, l'altezza del barometro ad acqua dell'esempio 4. Lo stesso limite vale per le pompe che aspirano l'acqua da un pozzo: da più di dieci metri non la tirano su, e bisogna spingerla dal basso.

La **ventosa** funziona allo stesso modo. Premendola su un vetro si fa uscire l'aria che c'è sotto; quando la gomma torna indietro, lo spazio sotto la ventosa si allarga e la sua pressione diventa più piccola di quella esterna. La forza che la tiene attaccata è la differenza di pressione moltiplicata per l'area del cerchio:

$$F = (p_0 - p_{int}) \cdot S$$

```ad-example
Esempio 7: una ventosa
Una ventosa ha il raggio di $3{,}0\,\text{cm}$. Sotto la ventosa la pressione è $300\,\text{hPa}$, fuori è $1013\,\text{hPa}$. Con quale forza bisogna tirarla per staccarla?

La differenza di pressione è $1013 - 300 = 713\,\text{hPa} = 71\,300\,\text{Pa}$, l'area è $S = \pi \cdot (0{,}030\,\text{m})^2 = 2{,}83 \cdot 10^{-3}\,\text{m}^2$:

$$F = 71\,300\,\text{Pa} \cdot 2{,}83 \cdot 10^{-3}\,\text{m}^2 = 201{,}6\ldots\,\text{N} \approx 2{,}0 \cdot 10^2\,\text{N}$$

La ventosa regge il peso di una massa di una ventina di chilogrammi.
```

```ad-warning
La cannuccia non aspira
Aspirare non crea una forza che tira il liquido verso l'alto: toglie l'aria da una parte, e la pressione atmosferica che resta dall'altra parte spinge. Senza l'aria che preme sul bicchiere, per esempio sulla Luna, la bibita non salirebbe nella cannuccia.
```

```ad-warning
La pressione interna si sottrae
Nella ventosa la forza viene dalla differenza di pressione $p_0 - p_{int}$, non dalla sola pressione esterna: l'aria rimasta sotto la ventosa spinge anche lei, verso l'esterno.
```
