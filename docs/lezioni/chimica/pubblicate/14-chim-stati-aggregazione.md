# Gli stati di aggregazione

Un cubetto di ghiaccio, l'acqua di un bicchiere e il vapore che esce da una pentola sono la stessa sostanza, ma si comportano in modi molto diversi: il ghiaccio tiene la sua forma, l'acqua prende quella del bicchiere, il vapore si allarga nella cucina finché non si vede più. Sono i tre **stati di aggregazione** della materia: solido, liquido e aeriforme. In quale stato si trova una sostanza dipende dalla sostanza e dalla temperatura, e si può prevedere con due numeri, la temperatura di fusione e quella di ebollizione.

## La materia e i suoi stati

In chimica si chiama **materia** tutto ciò che ha una massa e occupa un volume: l'aria che respiri, il vetro di una finestra, il tuo corpo. Qualunque campione di materia, a una certa temperatura e a una certa pressione, si trova in uno dei tre stati, e ogni stato si riconosce da due domande: il campione ha una forma sua? Ha un volume suo?

```tikz
% nome: stati-tre-recipienti
% alt: Tre recipienti uguali. Nel primo c'è un cubo solido appoggiato sul fondo, che non tocca le pareti: il solido ha forma propria. Nel secondo un liquido azzurro riempie la parte bassa del recipiente, con la superficie orizzontale: il liquido prende la forma del recipiente ma ha un volume suo. Il terzo è chiuso da un coperchio e pieno di puntini sparsi ovunque: l'aeriforme occupa tutto il recipiente
% svg: stati-tre-recipienti-f279e9c8.svg 250x118
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0.35,0) rectangle (1.25,0.9);
\draw[thick] (0,2.2) -- (0,0) -- (1.6,0) -- (1.6,2.2);
\node at (0.8,-0.35) {solido};
\fill[cyan!20] (2.4,0) rectangle (4.0,0.9);
\draw[thin] (2.4,0.9) -- (4.0,0.9);
\draw[thick] (2.4,2.2) -- (2.4,0) -- (4.0,0) -- (4.0,2.2);
\node at (3.2,-0.35) {liquido};
\fill[orange!10] (4.8,0) rectangle (6.4,2.2);
\draw[thick] (4.8,0) rectangle (6.4,2.2);
\draw[thick, fill=gray!20] (4.7,2.2) rectangle (6.5,2.4);
\foreach \x/\y in {5.0/0.2,5.5/0.5,6.1/0.3,5.2/0.9,5.9/1.0,5.0/1.5,5.6/1.4,6.2/1.7,5.3/2.0,5.9/1.95,5.7/0.15,6.2/0.7}
  \fill (\x,\y) circle (1pt);
\node at (5.6,-0.35) {aeriforme};
\end{tikzpicture}
```

Un **solido** ha forma propria e volume proprio: un sasso resta un sasso in qualunque scatola lo metti, e non si riesce a comprimerlo. È rigido: per cambiargli forma bisogna romperlo, piegarlo o limarlo.

Un **liquido** ha volume proprio ma non forma propria: $200\,\text{mL}$ d'acqua restano $200\,\text{mL}$ in un bicchiere, in una bottiglia o in una bacinella, ma ogni volta prendono la forma della parte del recipiente che occupano. La sua superficie libera, quella che non tocca le pareti, è orizzontale. Un liquido scorre, cioè è un **fluido**, e come il solido è quasi incomprimibile.

Un **aeriforme** non ha né forma né volume propri: occupa tutto il volume del recipiente che lo contiene, qualunque sia. Se il recipiente è aperto si disperde nell'ambiente. Anche l'aeriforme è un fluido, ma a differenza del liquido si comprime con facilità: l'aria di una pompa da bicicletta chiusa con un dito si riduce a metà del volume con una spinta decisa.

| | Forma propria | Volume proprio | Comprimibile | Fluido |
|---|---|---|---|---|
| Solido | sì | sì | no | no |
| Liquido | no | sì | quasi per niente | sì |
| Aeriforme | no | no | sì | sì |

```ad-warning
"Il liquido non ha volume proprio perché cambia recipiente"
Quando versi l'acqua da una bottiglia in un bicchiere cambia la forma, non il volume. Il volume proprio è proprio quello che distingue il liquido dall'aeriforme: il liquido si raccoglie sul fondo con la sua superficie libera, l'aeriforme riempie tutto il recipiente.
```

```ad-note
Solidi cristallini e solidi amorfi
Nella maggior parte dei solidi, come il sale, il ghiaccio e i metalli, le particelle sono disposte in modo ordinato e si ripetono sempre uguali: sono i **solidi cristallini**, che fondono a una temperatura precisa. Il vetro, la cera e molte plastiche sono invece **solidi amorfi**: hanno forma propria, ma le loro particelle sono disordinate come in un liquido, e scaldandoli si ammorbidiscono poco a poco senza una temperatura di fusione precisa.
```

```ad-note
Gas e vapore
Nel linguaggio comune "gas" e "vapore" sono sinonimi. Molti libri li distinguono: il **vapore** è l'aeriforme di una sostanza che si può riportare allo stato liquido comprimendola, senza raffreddarla (come il vapore acqueo), il **gas** è un aeriforme che a quella temperatura non si liquefa per quanto lo si comprima (come l'ossigeno o l'azoto dell'aria a temperatura ambiente). Il confine è una temperatura diversa per ogni sostanza, la temperatura critica. Quando la distinzione non serve si dice "aeriforme", o soltanto "gas".
```

## Lo stesso campione occupa volumi diversi

Una stessa massa di sostanza occupa un volume diverso in ogni stato, e il modo più comodo per confrontarli è la [densità](/materiale/scuola-superiore/chimica/misure-e-grandezze/massa-volume-e-densita), il rapporto tra massa e volume:

$$d = \frac{m}{V} \qquad\qquad V = \frac{m}{d}$$

Solidi e liquidi hanno densità dello stesso ordine di grandezza, da qualche decimo a una ventina di grammi al millilitro. Gli aeriformi, alla pressione atmosferica, hanno densità circa mille volte più piccole, e per questo si misurano in grammi al litro.

```ad-example
Esempio 1: un grammo d'acqua che diventa vapore
Un grammo d'acqua liquida occupa circa $1\,\text{mL}$. Che volume occupa lo stesso grammo trasformato in vapore a $100\,^\circ\text{C}$ e alla pressione atmosferica, dove la densità del vapore acqueo è circa $0{,}60\,\text{g/L}$?

$$V = \frac{m}{d} = \frac{1{,}0\,\text{g}}{0{,}60\,\text{g/L}} = 1{,}66\ldots\,\text{L} \approx 1{,}7\,\text{L}$$

Il volume passa da un millilitro a circa $1700\,\text{mL}$: diventa quasi duemila volte più grande. È il motivo per cui il coperchio di una pentola che bolle si solleva.
```

Di solito il solido è un po' più denso del liquido della stessa sostanza, e affonda nel suo liquido: un pezzo di cera solida va a fondo nella cera fusa. L'acqua è un'eccezione importante: il ghiaccio, con $d = 0{,}917\,\text{g/mL}$, è meno denso dell'acqua liquida, che ha $d = 1{,}00\,\text{g/mL}$. Per questo il ghiaccio galleggia, e i laghi d'inverno gelano dalla superficie e non dal fondo.

```ad-example
Esempio 2: una bottiglia nel congelatore
Una bottiglia contiene $500\,\text{g}$ d'acqua, cioè $500\,\text{mL}$. Che volume occupa l'acqua quando è tutta ghiacciata?

La massa non cambia con lo stato, quindi

$$V = \frac{m}{d} = \frac{500\,\text{g}}{0{,}917\,\text{g/mL}} = 545{,}2\ldots\,\text{mL} \approx 545\,\text{mL}$$

Il volume cresce di $45\,\text{mL}$, cioè del $9\%$ circa: una bottiglia di vetro piena fino all'orlo si rompe.
```

```ad-warning
Moltiplicare per la densità
Per trovare un volume si divide la massa per la densità. Chi moltiplica, nell'esempio 2, trova $500 \cdot 0{,}917 = 458{,}5\,\text{mL}$, un volume più piccolo: ma il ghiaccio è meno denso dell'acqua, quindi la stessa massa deve occupare un volume più grande. Controllare il verso del risultato evita l'errore.
```

## Da che cosa dipende lo stato

La stessa sostanza può trovarsi in tutti e tre gli stati: l'acqua è ghiaccio sotto $0\,^\circ\text{C}$, liquida tra $0$ e $100\,^\circ\text{C}$, vapore sopra $100\,^\circ\text{C}$. I due confini sono la **temperatura di fusione** $t_f$, a cui il solido diventa liquido, e la **temperatura di ebollizione** $t_{eb}$, a cui il liquido bolle e diventa aeriforme. Ogni sostanza pura ha i suoi, e i valori delle tabelle valgono alla pressione atmosferica normale, $1\,\text{atm}$.

| Sostanza | $t_f$ in $^\circ\text{C}$ | $t_{eb}$ in $^\circ\text{C}$ | Stato a $20\,^\circ\text{C}$ |
|---|---|---|---|
| azoto | $-210$ | $-196$ | aeriforme |
| ossigeno | $-218$ | $-183$ | aeriforme |
| etanolo | $-114$ | $78$ | liquido |
| mercurio | $-39$ | $357$ | liquido |
| bromo | $-7$ | $59$ | liquido |
| acqua | $0$ | $100$ | liquido |
| cloruro di sodio | $801$ | $1465$ | solido |
| ferro | $1538$ | $2862$ | solido |

Per sapere in che stato è una sostanza a una temperatura $t$, alla pressione atmosferica:

1. Se $t$ è più bassa della temperatura di fusione, la sostanza è solida.
2. Se $t$ è tra la temperatura di fusione e quella di ebollizione, è liquida.
3. Se $t$ è più alta della temperatura di ebollizione, è aeriforme.

Proprio alla temperatura di fusione, mentre il solido fonde, solido e liquido ci sono insieme; lo stesso vale per liquido e aeriforme alla temperatura di ebollizione. Che cosa succede durante questi cambiamenti lo spiega la lezione sui [passaggi di stato](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/i-passaggi-di-stato).

```tikz
% nome: stati-intervalli-sostanze
% alt: Quattro barre orizzontali, una per sostanza, su una scala di temperatura da meno 250 a 400 gradi Celsius. Ogni barra è divisa in tre tratti colorati: solido in blu chiaro, liquido in azzurro, aeriforme in arancione chiaro. L'azoto è liquido solo in una fascia strettissima intorno a meno 200 gradi, l'etanolo tra meno 114 e 78, l'acqua tra 0 e 100, il mercurio tra meno 39 e 357. Una linea tratteggiata verticale a 20 gradi Celsius taglia l'azoto nel tratto aeriforme e le altre tre sostanze nel tratto liquido
% svg: stati-intervalli-sostanze-c9065d1a.svg 362x171
\begin{tikzpicture}[x=0.01cm]
\foreach \n/\y/\a/\b in {azoto/3/-210/-196, etanolo/2/-114/78, acqua/1/0/100, mercurio/0/-39/357} {
  \fill[blue!15] (-250,\y*0.6) rectangle (\a,\y*0.6+0.35);
  \fill[cyan!40] (\a,\y*0.6) rectangle (\b,\y*0.6+0.35);
  \fill[orange!25] (\b,\y*0.6) rectangle (400,\y*0.6+0.35);
  \draw[thin] (-250,\y*0.6) rectangle (400,\y*0.6+0.35);
  \node[left] at (-250,\y*0.6+0.175) {\small \n};
}
\draw[->] (-250,-0.25) -- (430,-0.25) node[right] {$t$ ($^\circ$C)};
\foreach \t in {-200,-100,0,100,200,300,400} {
  \draw (\t,-0.2) -- (\t,-0.3) node[below] {\small $\t$};
}
\draw[thick, dashed] (20,-0.25) -- (20,2.45) node[above] {\small $20\,^\circ$C};
\fill[blue!15] (-250,-1.35) rectangle (-215,-1.15);
\node[right] at (-210,-1.25) {\small solido};
\fill[cyan!40] (-40,-1.35) rectangle (-5,-1.15);
\node[right] at (0,-1.25) {\small liquido};
\fill[orange!25] (160,-1.35) rectangle (195,-1.15);
\node[right] at (200,-1.25) {\small aeriforme};
\end{tikzpicture}
```

```ad-example
Esempio 3: l'etanolo nel freezer da laboratorio
L'etanolo fonde a $-114\,^\circ\text{C}$ e bolle a $78\,^\circ\text{C}$. In che stato è a $-120\,^\circ\text{C}$? E a $-80\,^\circ\text{C}$?

A $-120\,^\circ\text{C}$ la temperatura è più bassa di quella di fusione, perché $-120 < -114$: l'etanolo è solido. A $-80\,^\circ\text{C}$ la temperatura sta tra $-114$ e $78\,^\circ\text{C}$: l'etanolo è liquido, anche se fa molto più freddo che in qualunque congelatore di casa.
```

```ad-warning
Il confronto tra numeri negativi
Tra due temperature sotto zero è più fredda quella con il numero più grande in valore assoluto: $-120\,^\circ\text{C}$ è più freddo di $-114\,^\circ\text{C}$. Chi confronta solo le cifre, $120$ e $114$, conclude che l'etanolo a $-120\,^\circ\text{C}$ è liquido, e sbaglia. Aiuta immaginare le temperature su una retta, come nella figura sopra.
```

Nei laboratori e nei libri le temperature si danno spesso in kelvin, la scala della temperatura assoluta. Il passaggio è $T = t + 273$ (con $t$ in gradi Celsius e $T$ in kelvin), e prima di confrontare una temperatura con quelle di fusione e di ebollizione bisogna scriverle tutte nella stessa scala. La scala Kelvin e il suo zero sono spiegati nella lezione sul [modello particellare](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/il-modello-particellare-della-materia).

```ad-example
Esempio 4: mercurio e ossigeno in kelvin
In che stato è il mercurio a $400\,\text{K}$? E l'ossigeno a $80\,\text{K}$?

Per il mercurio, $t = T - 273 = 400 - 273 = 127\,^\circ\text{C}$, che sta tra $-39$ e $357\,^\circ\text{C}$: il mercurio è liquido. Per l'ossigeno, $t = 80 - 273 = -193\,^\circ\text{C}$, tra $-218$ e $-183\,^\circ\text{C}$: l'ossigeno è liquido anche lui. L'ossigeno liquido è azzurro chiaro, e si usa negli ospedali e nei razzi.
```

```ad-warning
Kelvin e gradi Celsius mescolati
Confrontare $400\,\text{K}$ con i $357\,^\circ\text{C}$ del mercurio porta a dire che il mercurio bolle, perché $400 > 357$: ma $400\,\text{K}$ sono solo $127\,^\circ\text{C}$. Prima si porta tutto nella stessa scala, poi si confronta.
```

La pressione conta anche lei. Alla pressione atmosferica l'acqua bolle a $100\,^\circ\text{C}$, ma in alta montagna, dove la pressione è più bassa, bolle a una temperatura più bassa (sulla cima del Monte Bianco intorno a $85\,^\circ\text{C}$), e la pasta cuoce peggio; in una pentola a pressione, al contrario, l'acqua resta liquida fin verso $120\,^\circ\text{C}$ e i cibi cuociono prima. Quando una tabella non dice la pressione, i valori sono quelli a $1\,\text{atm}$.

```ad-note
Il quarto stato: il plasma
A temperature di migliaia di gradi gli atomi di un gas perdono una parte dei loro elettroni, e il gas diventa un miscuglio di particelle con carica elettrica: il **plasma**. È lo stato della materia del Sole e delle stelle, dei fulmini e delle lampade al neon. Nella chimica di tutti i giorni gli stati sono tre, e il plasma non si considera.
```

Perché un solido ha forma propria e un aeriforme no, e perché scaldando una sostanza si passa da uno stato all'altro, lo spiega il [modello particellare della materia](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/il-modello-particellare-della-materia): guardando le particelle di cui la materia è fatta, le proprietà dei tre stati diventano la conseguenza di come quelle particelle sono disposte e di come si muovono.
