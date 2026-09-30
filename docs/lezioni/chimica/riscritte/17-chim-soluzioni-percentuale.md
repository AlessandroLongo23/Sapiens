# Le soluzioni e la concentrazione percentuale

Sull'etichetta di una bottiglia di vino c'è scritto $12\%$ vol, su una flebo di soluzione fisiologica $0{,}9\%$, su un flacone di acqua ossigenata $3\%$. Sono tre modi di dire quanta sostanza è sciolta in un liquido, cioè la concentrazione di una soluzione. Questa lezione spiega che cos'è una soluzione, fino a che punto una sostanza si scioglie, e come si calcolano le tre concentrazioni percentuali.

## Soluto e solvente

Una **soluzione** è un [miscuglio omogeneo](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/sostanze-pure-miscugli-omogenei-ed-eterogenei): i suoi componenti sono mescolati fino alle singole particelle e non si distinguono nemmeno al microscopio. Il componente presente in quantità maggiore si chiama **solvente**, gli altri **soluti**. Nell'acqua zuccherata il solvente è l'acqua e il soluto è lo zucchero. Quando il solvente è l'acqua la soluzione si dice **acquosa**, ed è il caso più comune: l'acqua scioglie tante sostanze diverse che la lezione [L'acqua come solvente](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/l-acqua-come-solvente) è dedicata a lei.

Le soluzioni non sono solo liquide. L'aria è una soluzione gassosa, con l'azoto come solvente e l'ossigeno, l'argon e gli altri gas come soluti; l'ottone e il bronzo sono soluzioni solide di metalli, le **leghe**.

Quando lo zucchero si scioglie, le sue particelle si staccano dal cristallo una alla volta e si disperdono tra le particelle dell'acqua, finché sono sparse uniformemente in tutto il liquido. Lo zucchero non sparisce: è ancora lì, diviso in particelle troppo piccole per essere viste, e la soluzione è dolce in ogni goccia.

```tikz
% nome: soluzioni-dissoluzione-particelle
% alt: Due riquadri pieni di particelle. Nel primo le particelle azzurre dell'acqua circondano un blocchetto ordinato di particelle arancioni sul fondo: il cristallo di soluto non ancora sciolto. Nel secondo le stesse particelle arancioni sono sparse a caso tra quelle azzurre in tutto il riquadro: la soluzione
% svg: soluzioni-dissoluzione-particelle-b51b90fb.svg 209x132
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (2.4,2.4);
\foreach \x/\y in {0.26/0.26,2.1/0.24,0.32/0.72,2.12/0.74,0.29/1.15,0.76/1.19,1.18/1.14,1.69/1.18,2.14/1.21,0.3/1.67,0.73/1.66,1.2/1.67,1.69/1.61,2.09/1.62,0.32/2.09,0.75/2.08,1.2/2.09,1.65/2.11,2.13/2.13}
  \draw[fill=cyan!25] (\x,\y) circle (0.17);
\foreach \x/\y in {0.74/0.26,1.2/0.26,1.66/0.26,0.74/0.72,1.2/0.72,1.66/0.72}
  \draw[fill=orange!50] (\x,\y) circle (0.17);
\node[align=center] at (1.2,-0.55) {soluto\\e solvente};
\draw[-{Stealth}, thick] (2.5,1.2) -- (2.9,1.2);
\draw[thick] (3.0,0) rectangle (5.4,2.4);
\foreach \x/\y in {3.29/0.29,3.77/0.3,4.69/0.3,5.15/0.27,3.3/0.7,4.18/0.69,4.69/0.76,3.27/1.15,3.72/1.2,4.23/1.14,5.14/1.17,3.31/1.68,3.74/1.68,4.67/1.6,5.1/1.63,3.7/2.13,4.19/2.14,4.69/2.09,5.12/2.1}
  \draw[fill=cyan!25] (\x,\y) circle (0.17);
\foreach \x/\y in {4.21/0.23,3.77/0.73,5.09/0.74,4.67/1.14,4.18/1.61,3.29/2.07}
  \draw[fill=orange!50] (\x,\y) circle (0.17);
\node[align=center] at (4.2,-0.55) {soluzione};
\end{tikzpicture}
```

## La solubilità

Un cucchiaino di sale in un bicchiere d'acqua si scioglie tutto; dieci cucchiai no, e una parte del sale resta sul fondo per quanto si mescoli. Esiste un limite. La **solubilità** di una sostanza è la massima quantità che se ne può sciogliere in una data quantità di solvente, a una data temperatura. Per i solidi in acqua si dà di solito in grammi di soluto per $100\,\text{g}$ d'acqua: a $20\,^\circ\text{C}$ la solubilità del cloruro di sodio (il sale da cucina) è circa $36\,\text{g}$ in $100\,\text{g}$ d'acqua, quella dello zucchero circa $200\,\text{g}$.

Una soluzione che contiene la massima quantità di soluto che quella temperatura consente si dice **satura**; se ne contiene di meno, è **insatura**. Il soluto aggiunto a una soluzione satura non si scioglie e si deposita sul fondo, e si chiama **corpo di fondo**.

La solubilità cambia con la temperatura. Per la maggior parte dei solidi cresce quando l'acqua si scalda, a volte di poco, a volte moltissimo: il nitrato di potassio passa da $32\,\text{g}$ a più di $100\,\text{g}$ per $100\,\text{g}$ d'acqua tra $20$ e $60\,^\circ\text{C}$, mentre il cloruro di sodio resta quasi fermo intorno a $36\,\text{g}$. Per i gas è il contrario: si sciolgono meno nell'acqua calda, ed è per questo che una bibita gassata calda perde le bollicine prima di una fredda.

```tikz
% nome: soluzioni-curve-solubilita
% alt: Grafico della solubilità in grammi per 100 grammi d'acqua in funzione della temperatura, da 0 a 60 gradi Celsius. La curva del nitrato di potassio sale da circa 13 grammi a 0 gradi a 110 grammi a 60 gradi, sempre più ripida. La curva del cloruro di sodio è quasi orizzontale, poco sopra 35 grammi. Le due curve si incrociano poco sopra 20 gradi
% svg: soluzioni-curve-solubilita-f8d17971.svg 367x188
% poi-interattivo: scegliere una temperatura e leggere le due solubilità
\begin{tikzpicture}[x=0.1cm, y=0.03cm]
\draw[gray!25, very thin] (0,0) grid[xstep=10, ystep=20] (60,120);
\draw[->] (0,0) -- (66,0) node[right] {$t$ ($^\circ$C)};
\draw[->] (0,0) -- (0,128) node[above] {$S$ (g in 100 g d'acqua)};
\foreach \t in {0,10,...,60} \node[below] at (\t,0) {\small $\t$};
\foreach \s in {20,40,...,120} \node[left] at (0,\s) {\small $\s$};
\draw[thick, orange!90!black] plot[smooth] coordinates {(0,13.3) (10,20.9) (20,31.6) (30,45.8) (40,63.9) (50,85.5) (60,110)};
\draw[thick, blue!70!black] plot[smooth] coordinates {(0,35.7) (10,35.8) (20,35.9) (30,36.1) (40,36.4) (50,36.7) (60,37.1)};
\node[orange!90!black, left] at (54,105) {\small nitrato di potassio};
\node[blue!70!black, above] at (46,37) {\small cloruro di sodio};
\end{tikzpicture}
```

```ad-note
Liquidi che si mescolano e liquidi che non si mescolano
Tra due liquidi la solubilità può non avere limite: acqua e alcol si mescolano in qualunque proporzione, e si dicono **miscibili**. Acqua e olio, al contrario, non si sciolgono l'uno nell'altro e restano in due strati: sono **immiscibili**.
```

## La concentrazione

La **concentrazione** di una soluzione dice quanto soluto c'è in una data quantità di soluzione. Una soluzione con poco soluto si dice **diluita**, una con tanto soluto **concentrata**; per dire quanto, servono dei numeri. In questa lezione ci sono le tre concentrazioni percentuali; quelle che contano le particelle, come la [molarità](/materiale/scuola-superiore/chimica/le-proprieta-delle-soluzioni/la-molarita), arrivano più avanti.

In tutte le formule che seguono conta la quantità di soluzione, cioè soluto più solvente, non la quantità di solvente. Per le masse:

$$m_{\text{soluzione}} = m_{\text{soluto}} + m_{\text{solvente}}$$

### Percentuale in massa

La **percentuale in massa**, $\%\,(m/m)$, è la massa di soluto contenuta in $100\,\text{g}$ di soluzione:

$$\%\,(m/m) = \frac{m_{\text{soluto}}}{m_{\text{soluzione}}} \cdot 100$$

Le due masse vanno nella stessa unità, e il risultato è un numero puro.

```ad-example
Esempio 1: acqua zuccherata
Si sciolgono $12\,\text{g}$ di zucchero in $188\,\text{g}$ d'acqua. Qual è la percentuale in massa dello zucchero?

La massa della soluzione è $12\,\text{g} + 188\,\text{g} = 200\,\text{g}$, quindi

$$\%\,(m/m) = \frac{12\,\text{g}}{200\,\text{g}} \cdot 100 = 6{,}0\%$$

In $100\,\text{g}$ di questa soluzione ci sono $6{,}0\,\text{g}$ di zucchero.
```

```ad-warning
Dividere per il solvente
Il denominatore è la massa della soluzione, non quella del solvente. Nell'esempio 1, dividendo per $188\,\text{g}$ si trova $6{,}4\%$, un risultato sbagliato. Quando il testo dà la massa del solvente, la prima cosa da fare è sommarci la massa del soluto.
```

### Percentuale massa su volume

La **percentuale massa su volume**, $\%\,(m/V)$, è la massa di soluto in grammi contenuta in $100\,\text{mL}$ di soluzione:

$$\%\,(m/V) = \frac{m_{\text{soluto}}\ (\text{g})}{V_{\text{soluzione}}\ (\text{mL})} \cdot 100$$

È comoda quando la soluzione si misura con un cilindro graduato o una siringa, ed è quella dei farmaci: la soluzione fisiologica allo $0{,}9\%$ contiene $0{,}9\,\text{g}$ di cloruro di sodio ogni $100\,\text{mL}$. Qui le unità contano: massa in grammi, volume in millilitri.

```ad-example
Esempio 2: una flebo di soluzione fisiologica
Quanti grammi di cloruro di sodio ci sono in una flebo da $500\,\text{mL}$ di soluzione fisiologica allo $0{,}9\%\,(m/V)$?

Dalla formula si ricava la massa del soluto:

$$m_{\text{soluto}} = \frac{\%\,(m/V) \cdot V_{\text{soluzione}}}{100} = \frac{0{,}9 \cdot 500}{100}\,\text{g} = 4{,}5\,\text{g}$$

Controllo: $0{,}9\,\text{g}$ per ogni $100\,\text{mL}$, e i millilitri sono cinque volte cento.
```

```ad-warning
Il volume in litri
La percentuale $\%\,(m/V)$ vuole il volume in millilitri. Con $2{,}5\,\text{g}$ di glucosio in $0{,}050\,\text{L}$ di soluzione, il conto giusto è $2{,}5/50 \cdot 100 = 5{,}0\%$; chi usa $0{,}050$ al denominatore trova $5000\%$, un numero impossibile per una percentuale che non supera mai il cento.
```

### Percentuale in volume

La **percentuale in volume**, $\%\,(V/V)$, è il volume di soluto contenuto in $100\,\text{mL}$ di soluzione:

$$\%\,(V/V) = \frac{V_{\text{soluto}}}{V_{\text{soluzione}}} \cdot 100$$

Si usa quando il soluto è un liquido, e la più nota è la gradazione alcolica delle bevande: un vino a $12\%$ vol contiene $12\,\text{mL}$ di etanolo (l'alcol etilico) ogni $100\,\text{mL}$ di vino.

```ad-example
Esempio 3: quanto alcol in una bottiglia
Quanti millilitri di etanolo ci sono in una bottiglia da $750\,\text{mL}$ di vino a $12\%$ vol?

$$V_{\text{soluto}} = \frac{\%\,(V/V) \cdot V_{\text{soluzione}}}{100} = \frac{12 \cdot 750}{100}\,\text{mL} = 90\,\text{mL}$$
```

```ad-note
I volumi non si sommano
Con le masse vale sempre $m_{\text{soluzione}} = m_{\text{soluto}} + m_{\text{solvente}}$; con i volumi no. Mescolando $50\,\text{mL}$ di etanolo e $50\,\text{mL}$ d'acqua si ottengono circa $97\,\text{mL}$ di soluzione, perché le particelle dei due liquidi si sistemano in parte le une negli spazi delle altre, come spiega il [modello particellare](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/il-modello-particellare-della-materia). Per questo nella percentuale in volume si usa il volume della soluzione misurato, e non la somma dei volumi mescolati.
```

## Preparare una soluzione

Le stesse formule, girate, dicono quanto soluto serve per preparare una soluzione alla concentrazione voluta. In laboratorio si pesa il soluto, lo si scioglie in una parte del solvente e si aggiunge solvente fino alla massa o al volume finale.

```ad-example
Esempio 4: una soluzione di sale al 4,0 %
Come si preparano $250\,\text{g}$ di soluzione di cloruro di sodio al $4{,}0\%\,(m/m)$?

La massa del soluto è il $4{,}0\%$ della massa della soluzione:

$$m_{\text{soluto}} = \frac{4{,}0 \cdot 250}{100}\,\text{g} = 10\,\text{g}$$

e l'acqua è il resto: $m_{\text{solvente}} = 250\,\text{g} - 10\,\text{g} = 240\,\text{g}$. Si pesano $10\,\text{g}$ di sale e si sciolgono in $240\,\text{g}$ d'acqua.
```

```ad-warning
La soluzione al 4 % non è "4 g in 100 g d'acqua"
Sciogliendo $4\,\text{g}$ di soluto in $100\,\text{g}$ d'acqua si ottengono $104\,\text{g}$ di soluzione, al $3{,}8\%$. Una soluzione al $4\%\,(m/m)$ ha $4\,\text{g}$ di soluto ogni $100\,\text{g}$ di soluzione, quindi $96\,\text{g}$ d'acqua.
```

## Concentrazione di una soluzione satura

La solubilità e la percentuale in massa si leggono con la stessa regola: la solubilità è riferita a $100\,\text{g}$ di solvente, la percentuale a $100\,\text{g}$ di soluzione. Una soluzione satura di cloruro di sodio a $20\,^\circ\text{C}$ contiene $36\,\text{g}$ di sale ogni $100\,\text{g}$ d'acqua, cioè ogni $136\,\text{g}$ di soluzione, e la sua percentuale in massa è $36/136 \cdot 100 = 26\%$, non $36\%$.

```ad-example
Esempio 5: nitrato di potassio in acqua
A $20\,^\circ\text{C}$ la solubilità del nitrato di potassio è $31{,}6\,\text{g}$ in $100\,\text{g}$ d'acqua. Si mettono $50{,}0\,\text{g}$ di nitrato di potassio in $100\,\text{g}$ d'acqua a $20\,^\circ\text{C}$ e si mescola a lungo. Quanto soluto resta sul fondo, e qual è la percentuale in massa della soluzione?

Se ne sciolgono al massimo $31{,}6\,\text{g}$, e sul fondo restano $50{,}0 - 31{,}6 = 18{,}4\,\text{g}$. La soluzione è satura, con $31{,}6\,\text{g}$ di soluto in $131{,}6\,\text{g}$ di soluzione:

$$\%\,(m/m) = \frac{31{,}6\,\text{g}}{131{,}6\,\text{g}} \cdot 100 = 24{,}01\ldots\% \approx 24{,}0\%$$

Se si scalda l'acqua a $40\,^\circ\text{C}$, dove la solubilità è circa $64\,\text{g}$ in $100\,\text{g}$ d'acqua, il corpo di fondo si scioglie tutto, e la soluzione, ora insatura, è al $50{,}0/150{,}0 \cdot 100 = 33{,}3\%$.
```

Con la figura qui sotto puoi preparare una soluzione aggiungendo soluto a una quantità d'acqua a tua scelta: la concentrazione cresce finché la soluzione non è satura, poi il soluto in più resta sul fondo e la concentrazione non cambia più, a meno di scaldare l'acqua.

```interattivo
% nome: soluzione-aggiungi-soluto
% alt: Un becher con l'acqua e particelle di soluto sciolte, rappresentate da puntini arancioni sempre più fitti. Si sceglie il soluto (cloruro di sodio o nitrato di potassio), la massa d'acqua, la temperatura da 0 a 60 gradi Celsius e la massa di soluto aggiunta. Finché il soluto si scioglie la soluzione è insatura e la percentuale in massa cresce; oltre la solubilità la soluzione è satura, il soluto in più si deposita sul fondo come corpo di fondo e la percentuale resta ferma. Sotto si leggono la massa sciolta, la massa della soluzione, la percentuale in massa e la solubilità a quella temperatura
```
