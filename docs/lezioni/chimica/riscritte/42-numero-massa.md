# Numero atomico, numero di massa e isotopi

Un atomo è fatto di protoni e neutroni, nel nucleo, e di elettroni intorno (lezione [Elettroni, protoni e neutroni](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/elettroni-protoni-e-neutroni)). Per descriverlo bastano due numeri interi: quanti protoni ha, e quante particelle ci sono nel nucleo. Il primo dice di che elemento si tratta, il secondo quanto pesa l'atomo. Con loro si scrivono il simbolo completo di un atomo, i suoi isotopi e i suoi ioni.

## Il numero atomico

Il **numero atomico** $Z$ è il numero di protoni nel nucleo di un atomo. È lui a stabilire di quale elemento si tratta: tutti gli atomi con $6$ protoni sono atomi di carbonio, tutti quelli con $8$ protoni sono atomi di ossigeno, e un atomo con un protone in più sarebbe un altro elemento. Gli elementi della tavola periodica moderna sono ordinati proprio per numero atomico crescente, dall'idrogeno, con $Z = 1$, in avanti (lezione [La tavola periodica di Mendeleev](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/la-tavola-periodica-di-mendeleev)).

Un atomo è neutro: la carica positiva dei protoni è compensata da quella negativa degli elettroni, e quindi in un atomo neutro

$$\text{numero di elettroni} = \text{numero di protoni} = Z$$

## Il numero di massa

Protoni e neutroni si chiamano insieme **nucleoni**, perché stanno nel nucleo. Il **numero di massa** $A$ è il numero di nucleoni:

$$A = \text{protoni} + \text{neutroni} = Z + N$$

dove $N$ è il numero di neutroni. Quindi il numero di neutroni è

$$N = A - Z$$

Il nome viene dal fatto che protoni e neutroni hanno una massa di circa $1\,\text{u}$ ciascuno, e gli elettroni pesano quasi niente: la massa di un atomo, in unità di massa atomica, è vicina al suo numero di massa. Un atomo di sodio con $A = 23$ ha una massa di $22{,}99\,\text{u}$.

## Il simbolo di un atomo

Numero atomico e numero di massa si scrivono a sinistra del simbolo dell'elemento: il numero di massa in alto, il numero atomico in basso.

```tikz
% nome: numero-massa-simbolo
% alt: Il simbolo del sodio con il numero di massa 23 in alto a sinistra e il numero atomico 11 in basso a sinistra. Una freccia indica il 23: numero di massa A, protoni più neutroni. Un'altra indica l'11: numero atomico Z, protoni
% svg: numero-massa-simbolo-153564a0.svg 236x110
\begin{tikzpicture}
\node[scale=2.4] at (0,0) {${}^{23}_{11}\mathrm{Na}$};
\draw[-{Stealth}, thin] (-2.0,0.95) -- (-0.75,0.5);
\node[left, align=right] at (-2.0,0.95) {\small numero di massa $A$\\ \small protoni + neutroni};
\draw[-{Stealth}, thin] (-2.0,-0.95) -- (-0.75,-0.45);
\node[left, align=right] at (-2.0,-0.95) {\small numero atomico $Z$\\ \small protoni};
\end{tikzpicture}
```

Dal simbolo ${}^{23}_{11}\mathrm{Na}$ si legge tutto: $11$ protoni, $23 - 11 = 12$ neutroni e, se l'atomo è neutro, $11$ elettroni. Siccome il simbolo $\mathrm{Na}$ dice già che $Z = 11$, spesso il numero atomico non si scrive: ${}^{23}\mathrm{Na}$, oppure, a parole, sodio-23.

```ad-example
Esempio 1: le particelle di un atomo
Quanti protoni, neutroni ed elettroni ha l'atomo neutro ${}^{56}_{26}\mathrm{Fe}$? E l'atomo ${}^{127}\mathrm{I}$, sapendo che lo iodio ha $Z = 53$?

Per il ferro: $Z = 26$ protoni, $N = 56 - 26 = 30$ neutroni, $26$ elettroni.

Per lo iodio: $53$ protoni, $N = 127 - 53 = 74$ neutroni, $53$ elettroni.
```

```ad-warning
Il numero di massa non è il numero di neutroni
$A$ conta protoni e neutroni insieme. Nell'atomo ${}^{56}_{26}\mathrm{Fe}$ i neutroni sono $56 - 26 = 30$, non $56$; e le particelle in tutto sono $56 + 26 = 82$, perché agli $56$ nucleoni si aggiungono i $26$ elettroni.
```

## Gli isotopi

Gli atomi di uno stesso elemento hanno tutti lo stesso numero di protoni, ma non sempre lo stesso numero di neutroni. Atomi con lo stesso numero atomico e diverso numero di massa si chiamano **isotopi** dell'elemento. Il nome lo propose nel 1913 il chimico inglese Frederick Soddy, dal greco "stesso posto": gli isotopi occupano la stessa casella della tavola periodica.

Il carbonio ha tre isotopi presenti in natura: il carbonio-12, ${}^{12}_{6}\mathrm{C}$, con $6$ neutroni, che è il $98{,}9\%$ del carbonio; il carbonio-13, ${}^{13}_{6}\mathrm{C}$, con $7$ neutroni, l'$1{,}1\%$; e tracce di carbonio-14, ${}^{14}_{6}\mathrm{C}$, con $8$ neutroni, che è radioattivo e serve a datare i resti di esseri viventi. L'idrogeno è l'unico elemento i cui isotopi hanno un nome proprio: prozio, deuterio e trizio.

```tikz
% nome: numero-massa-isotopi-idrogeno
% alt: I tre isotopi dell'idrogeno. Il prozio ha un nucleo di un solo protone; il deuterio un protone e un neutrone; il trizio un protone e due neutroni. Tutti e tre hanno un elettrone intorno al nucleo, su un cerchio tratteggiato. Sotto ciascuno il simbolo: idrogeno-1, idrogeno-2, idrogeno-3
% svg: numero-massa-isotopi-idrogeno-db620596.svg 322x107
\begin{tikzpicture}
\foreach \c in {0,3.2,6.4} {
\draw[thin, dashed] (\c,0) circle (1.0);
\draw[thin, fill=blue!10] (\c+0.707,0.707) circle (0.1);
}
\draw[thick, fill=red!15] (0,0) circle (0.2);
\node at (0,0) {\small $+$};
\draw[thick, fill=red!15] (3.05,0) circle (0.2);
\node at (3.05,0) {\small $+$};
\draw[thick, fill=gray!20] (3.4,0) circle (0.2);
\draw[thick, fill=gray!20] (6.22,-0.14) circle (0.2);
\draw[thick, fill=gray!20] (6.58,-0.14) circle (0.2);
\draw[thick, fill=red!15] (6.4,0.18) circle (0.2);
\node at (6.4,0.18) {\small $+$};
\node at (0,-1.45) {prozio, ${}^{1}_{1}\mathrm{H}$};
\node at (3.2,-1.45) {deuterio, ${}^{2}_{1}\mathrm{H}$};
\node at (6.4,-1.45) {trizio, ${}^{3}_{1}\mathrm{H}$};
\end{tikzpicture}
```

Gli isotopi di un elemento hanno lo stesso numero di elettroni, e le proprietà chimiche dipendono dagli elettroni: si comportano quasi nello stesso modo in tutte le reazioni. Cambiano la massa e la stabilità del nucleo.

```ad-warning
Isotopi, non elementi diversi
${}^{12}_{6}\mathrm{C}$ e ${}^{14}_{6}\mathrm{C}$ sono lo stesso elemento, il carbonio: hanno lo stesso $Z$. Invece ${}^{14}_{6}\mathrm{C}$ e ${}^{14}_{7}\mathrm{N}$ hanno lo stesso numero di massa ma sono elementi diversi, perché hanno un numero diverso di protoni. Per riconoscere gli isotopi si guarda $Z$, non $A$.
```

## Gli ioni

Un atomo può perdere o acquistare elettroni, per esempio in una reazione chimica. Il numero di protoni non cambia, quindi l'elemento resta lo stesso, ma la carica non è più zero: l'atomo diventa uno **ione** (lezione [Atomi, molecole e ioni](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/atomi-molecole-e-ioni)). La carica dello ione, in unità $e$, è

$$\text{carica} = \text{protoni} - \text{elettroni}$$

e si scrive in alto a destra del simbolo. Un atomo che perde elettroni diventa uno ione positivo, un **catione**: il magnesio che perde due elettroni è $\mathrm{Mg^{2+}}$. Un atomo che acquista elettroni diventa uno ione negativo, un **anione**: il cloro che acquista un elettrone è $\mathrm{Cl^-}$.

```ad-example
Esempio 2: le particelle di uno ione
Quanti protoni, neutroni ed elettroni hanno gli ioni ${}^{24}_{12}\mathrm{Mg^{2+}}$ e ${}^{35}_{17}\mathrm{Cl^-}$?

Il magnesio ha $12$ protoni e $24 - 12 = 12$ neutroni. La carica $2+$ dice che ha due elettroni in meno dei protoni: $12 - 2 = 10$ elettroni.

Il cloro ha $17$ protoni e $35 - 17 = 18$ neutroni. La carica $-$ dice che ha un elettrone in più dei protoni: $17 + 1 = 18$ elettroni.
```

```ad-warning
Il segno della carica e gli elettroni
Uno ione positivo ha elettroni in meno, non protoni in più: ${}^{27}_{13}\mathrm{Al^{3+}}$ ha $13$ protoni, come ogni atomo di alluminio, e $13 - 3 = 10$ elettroni. L'errore frequente è sommare la carica agli elettroni ($13 + 3 = 16$): per un catione gli elettroni si tolgono, per un anione si aggiungono.
```

Nella figura qui sotto costruisci un atomo aggiungendo protoni, neutroni ed elettroni: il nome dell'elemento dipende solo dai protoni, i neutroni cambiano l'isotopo, gli elettroni la carica.

```interattivo
% nome: costruisci-atomo
% alt: Un atomo da costruire: al centro il nucleo, fatto di protoni rossi e neutroni grigi, e intorno gli elettroni azzurri. Con i bottoni più e meno si aggiungono o si tolgono protoni, neutroni ed elettroni, fino a dodici protoni. Accanto si leggono il nome e il simbolo dell'elemento, il simbolo completo con A e Z, la carica, il nome dell'isotopo e se è stabile, e se la particella è un atomo neutro, un catione o un anione
```

## La massa atomica media

La massa atomica che si legge sulla tavola periodica, per esempio $35{,}45$ per il cloro, non è la massa di un atomo di cloro: nessun atomo di cloro ha quella massa. In natura il cloro è una miscela di due isotopi, il cloro-35, con massa $34{,}97\,\text{u}$, e il cloro-37, con massa $36{,}97\,\text{u}$, sempre nelle stesse proporzioni. La **massa atomica** dell'elemento è la media delle masse dei suoi isotopi, ognuna pesata con la sua **abbondanza** percentuale, cioè la percentuale di atomi di quell'isotopo:

$$\text{massa atomica} = \frac{m_1 \cdot \%_1 + m_2 \cdot \%_2 + \ldots}{100}$$

Con le abbondanze scritte come frazioni ($75{,}76\% = 0{,}7576$) la divisione per $100$ sparisce. Le abbondanze sommano sempre a $100\%$.

```ad-example
Esempio 3: la massa atomica del cloro
Il cloro-35 ($34{,}97\,\text{u}$) è il $75{,}76\%$ del cloro, il cloro-37 ($36{,}97\,\text{u}$) il $24{,}24\%$. Quanto vale la massa atomica del cloro?

$$\frac{34{,}97 \cdot 75{,}76 + 36{,}97 \cdot 24{,}24}{100}\,\text{u} = (26{,}49 + 8{,}96)\,\text{u} = 35{,}45\,\text{u}$$

Il risultato è più vicino a $35$ che a $37$, perché il cloro-35 è l'isotopo più abbondante.
```

```ad-example
Esempio 4: tre isotopi
Il magnesio ha tre isotopi: magnesio-24 ($23{,}99\,\text{u}$, $78{,}99\%$), magnesio-25 ($24{,}99\,\text{u}$, $10{,}00\%$) e magnesio-26 ($25{,}98\,\text{u}$, $11{,}01\%$). Quanto vale la sua massa atomica?

$$23{,}99 \cdot 0{,}7899 + 24{,}99 \cdot 0{,}1000 + 25{,}98 \cdot 0{,}1101 = 18{,}95 + 2{,}50 + 2{,}86 = 24{,}31$$

La massa atomica del magnesio è $24{,}31$, come nella tavola della lezione sulla mole.
```

```ad-warning
La media semplice
La media semplice delle masse degli isotopi del cloro sarebbe $(34{,}97 + 36{,}97)/2 = 35{,}97$, lontana dal valore vero, $35{,}45$. La media va pesata con le abbondanze: un controllo veloce è che il risultato sia più vicino alla massa dell'isotopo più abbondante.
```

Dalla massa atomica si può anche risalire alle abbondanze, quando gli isotopi sono due: se il primo ha abbondanza $x$, come frazione, il secondo ha abbondanza $1 - x$.

```ad-example
Esempio 5: le abbondanze del boro
Il boro ha due isotopi, il boro-10 ($10{,}01\,\text{u}$) e il boro-11 ($11{,}01\,\text{u}$), e la sua massa atomica è $10{,}81$. Quanto sono abbondanti i due isotopi?

Con $x$ la frazione di boro-10:

$$10{,}01\,x + 11{,}01\,(1 - x) = 10{,}81$$

$$11{,}01 - 1{,}00\,x = 10{,}81 \qquad x = \frac{11{,}01 - 10{,}81}{1{,}00} = 0{,}20$$

Il boro-10 è il $20\%$ del boro, il boro-11 l'$80\%$.
```
