# La legge di Proust

Se scaldi del rame con dello zolfo, ogni $3{,}96\,\text{g}$ di rame si combinano con $1{,}00\,\text{g}$ di zolfo, né di più né di meno: se metti più zolfo, quello in più avanza. Lo stesso vale per ogni composto: gli elementi che lo formano stanno sempre nello stesso rapporto in massa, qualunque sia il modo in cui il composto è stato preparato. È la legge di Proust, la seconda legge della chimica dopo quella di Lavoisier, e permette di prevedere quanto di un elemento serve per reagire con una certa quantità di un altro.

## Proust e la composizione costante

Joseph-Louis Proust (1754-1826), un chimico francese che lavorava in Spagna, analizzò per anni campioni dello stesso composto preparati in modi diversi o trovati in luoghi diversi: il carbonato di rame fatto in laboratorio e quello della malachite, un minerale, gli ossidi di ferro, i solfuri. Trovò sempre la stessa composizione. Il chimico Claude-Louis Berthollet sosteneva invece che la composizione di un composto potesse variare con continuità, a seconda delle quantità di partenza, e tra il 1801 e il 1807 i due si confrontarono a colpi di esperimenti. Vinse Proust, e la sua legge si chiama **legge delle proporzioni definite e costanti**:

> Quando due o più elementi si combinano per formare un composto, le loro masse stanno sempre in un rapporto definito e costante.

## Il rapporto di combinazione

Per vedere la legge al lavoro si fanno reagire masse diverse di rame con lo zolfo che serve, e si pesa il composto che si forma, il solfuro di rame. La massa di zolfo che si combina si ricava con la [legge di Lavoisier](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-lavoisier), come differenza tra la massa del composto e quella del rame.

| Rame | Zolfo combinato | Solfuro di rame | $m_{\mathrm{Cu}} / m_{\mathrm{S}}$ |
|---|---|---|---|
| $1{,}98\,\text{g}$ | $0{,}500\,\text{g}$ | $2{,}48\,\text{g}$ | $3{,}96$ |
| $3{,}96\,\text{g}$ | $1{,}00\,\text{g}$ | $4{,}96\,\text{g}$ | $3{,}96$ |
| $6{,}34\,\text{g}$ | $1{,}60\,\text{g}$ | $7{,}94\,\text{g}$ | $3{,}96$ |
| $9{,}51\,\text{g}$ | $2{,}40\,\text{g}$ | $11{,}91\,\text{g}$ | $3{,}96$ |

Le masse cambiano, il loro rapporto no. Questo numero è il **rapporto di combinazione** del rame e dello zolfo nel solfuro di rame:

$$\frac{m_{\mathrm{Cu}}}{m_{\mathrm{S}}} = 3{,}96$$

Si legge così: in questo composto la massa del rame è sempre $3{,}96$ volte quella dello zolfo, cioè $3{,}96\,\text{g}$ di rame per ogni grammo di zolfo. La massa di zolfo è [direttamente proporzionale](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare) alla massa di rame: se il rame raddoppia, raddoppia anche lo zolfo che si combina, e i punti del grafico stanno su una retta che passa per l'origine.

```tikz
% nome: proust-rame-zolfo-grafico
% alt: Grafico con la massa di rame in grammi sull'asse orizzontale, da 0 a 10, e la massa di zolfo combinato sull'asse verticale, da 0 a 2,5. I quattro punti degli esperimenti stanno su una retta che parte dall'origine: la massa di zolfo è proporzionale a quella di rame
% svg: proust-rame-zolfo-grafico-43b22099.svg 305x212
% poi-interattivo: trascinare un punto lungo la retta e leggere le due masse e il loro rapporto
\begin{tikzpicture}[x=0.55cm, y=1.6cm]
\draw[gray!25, very thin] (0,0) grid[xstep=1, ystep=0.5] (10,2.5);
\draw[->] (0,0) -- (10.6,0) node[right] {$m_{\mathrm{Cu}}$ (g)};
\draw[->] (0,0) -- (0,2.8) node[above] {$m_{\mathrm{S}}$ (g)};
\foreach \x in {2,4,6,8,10} \node[below] at (\x,0) {\small $\x$};
\node[left] at (0,0.5) {\small $0{,}5$};
\node[left] at (0,1) {\small $1$};
\node[left] at (0,1.5) {\small $1{,}5$};
\node[left] at (0,2) {\small $2$};
\node[left] at (0,2.5) {\small $2{,}5$};
\draw[thick, blue] (0,0) -- (10,2.525);
\foreach \x/\y in {1.98/0.5,3.96/1.0,6.34/1.6,9.51/2.4} \fill (\x,\y) circle (2pt);
\end{tikzpicture}
```

Il rapporto di combinazione si può scrivere anche al contrario, con lo zolfo sopra: $m_{\mathrm{S}}/m_{\mathrm{Cu}} = 1/3{,}96 = 0{,}253$, cioè $0{,}253\,\text{g}$ di zolfo per ogni grammo di rame. Le due forme dicono la stessa cosa; conta sapere quale massa sta sopra.

```ad-warning
Il rapporto rovesciato
Con $m_{\mathrm{Cu}}/m_{\mathrm{S}} = 3{,}96$, la massa di zolfo per $12{,}0\,\text{g}$ di rame si trova dividendo, $12{,}0 / 3{,}96 = 3{,}03\,\text{g}$, non moltiplicando: $12{,}0 \cdot 3{,}96 = 47{,}5\,\text{g}$ vorrebbe dire quasi quattro volte più zolfo che rame, mentre il rapporto dice il contrario. Prima di fare il conto, chiediti quale dei due elementi pesa di più nel composto.
```

Ogni composto ha il suo rapporto di combinazione. Eccone alcuni, con l'elemento più pesante sopra:

| Composto | Elementi | Rapporto di combinazione |
|---|---|---|
| Solfuro di rame | rame e zolfo | $m_{\mathrm{Cu}} / m_{\mathrm{S}} = 3{,}96$ |
| Solfuro di ferro | ferro e zolfo | $m_{\mathrm{Fe}} / m_{\mathrm{S}} = 1{,}74$ |
| Ossido di magnesio | magnesio e ossigeno | $m_{\mathrm{Mg}} / m_{\mathrm{O}} = 1{,}52$ |
| Acqua | ossigeno e idrogeno | $m_{\mathrm{O}} / m_{\mathrm{H}} = 7{,}92$ |
| Cloruro di sodio | cloro e sodio | $m_{\mathrm{Cl}} / m_{\mathrm{Na}} = 1{,}54$ |
| Diossido di carbonio | ossigeno e carbonio | $m_{\mathrm{O}} / m_{\mathrm{C}} = 2{,}66$ |

Due elementi possono formare più di un composto, e allora ogni composto ha il suo rapporto: il carbonio e l'ossigeno formano anche il monossido di carbonio, con $m_{\mathrm{O}}/m_{\mathrm{C}} = 1{,}33$, la metà di quello del diossido. Che cosa lega i due rapporti lo spiega la [legge di Dalton delle proporzioni multiple](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-dalton-delle-proporzioni-multiple).

```ad-example
Esempio 1: il rapporto dai dati
Un nastro di magnesio di $3{,}04\,\text{g}$ brucia all'aria e forma $5{,}04\,\text{g}$ di ossido di magnesio. Qual è il rapporto di combinazione tra magnesio e ossigeno?

Per la legge di Lavoisier l'ossigeno che si è combinato è la differenza tra la massa dell'ossido e quella del magnesio:

$$m_{\mathrm{O}} = 5{,}04\,\text{g} - 3{,}04\,\text{g} = 2{,}00\,\text{g}$$

e il rapporto è

$$\frac{m_{\mathrm{Mg}}}{m_{\mathrm{O}}} = \frac{3{,}04\,\text{g}}{2{,}00\,\text{g}} = 1{,}52$$

Il rapporto è un numero puro: i grammi si semplificano.
```

```ad-example
Esempio 2: quanto zolfo serve
Quanto zolfo serve per trasformare in solfuro tutto il rame di un filo di $12{,}0\,\text{g}$?

Dal rapporto di combinazione, $m_{\mathrm{Cu}}/m_{\mathrm{S}} = 3{,}96$, si ricava la massa dello zolfo dividendo quella del rame:

$$m_{\mathrm{S}} = \frac{m_{\mathrm{Cu}}}{3{,}96} = \frac{12{,}0\,\text{g}}{3{,}96} = 3{,}030\ldots\,\text{g} \approx 3{,}03\,\text{g}$$

Lo stesso conto si può fare con una proporzione, $3{,}96 : 1{,}00 = 12{,}0 : m_{\mathrm{S}}$, come nella lezione [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).
```

## La composizione percentuale

La legge di Proust si può dire anche con le percentuali: in un composto ogni elemento è sempre la stessa percentuale della massa totale. La **composizione percentuale** in massa di un elemento è

$$\%\,\text{elemento} = \frac{m_{\text{elemento}}}{m_{\text{composto}}} \cdot 100$$

Nel solfuro di rame, dalla terza riga della tabella, il rame è $6{,}34\,\text{g}$ su $7{,}94\,\text{g}$, cioè il $79{,}8\%$, e lo zolfo il $20{,}2\%$: le due percentuali sommano sempre $100\%$. Qualunque campione di solfuro di rame, grande o piccolo, contiene il $79{,}8\%$ di rame. Nell'acqua l'idrogeno è l'$11{,}2\%$ e l'ossigeno l'$88{,}8\%$. Come si calcola la composizione percentuale dalla formula lo spiega la lezione [Composizione percentuale, formula minima e formula molecolare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/composizione-percentuale-formula-minima-e-formula-molecolare).

```ad-example
Esempio 3: l'idrogeno in una bottiglia d'acqua
Quanti grammi di idrogeno ci sono in $250\,\text{g}$ di acqua pura?

L'idrogeno è l'$11{,}2\%$ della massa dell'acqua:

$$m_{\mathrm{H}} = 250\,\text{g} \cdot \frac{11{,}2}{100} = 28{,}0\,\text{g}$$

Il resto, $222\,\text{g}$, è ossigeno.
```

```ad-warning
La composizione di un miscuglio cambia
La legge di Proust vale per i composti, non per i miscugli. Un miscuglio di limatura di ferro e zolfo si può preparare con qualunque proporzione, e ogni campione ha la sua; il solfuro di ferro ha sempre il ferro e lo zolfo nel rapporto $1{,}74$. Una composizione fissa è uno dei segni che distinguono un composto da un miscuglio, come nella lezione [Elementi, composti e simboli chimici](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/elementi-composti-e-simboli-chimici).
```

## Il reagente in eccesso

Se i due elementi non si mettono esattamente nel rapporto di combinazione, uno dei due finisce prima. Quello che si consuma tutto si chiama **reagente limitante**, perché limita la quantità di prodotto; dell'altro, il **reagente in eccesso**, una parte non reagisce e avanza. Per capire quale dei due avanza, e quanto:

1. si scrive il rapporto di combinazione;
2. si calcola quanto del secondo elemento servirebbe per far reagire tutto il primo;
3. se il secondo elemento disponibile è di più, è lui in eccesso; se è di meno, in eccesso è il primo, e si rifà il conto partendo dal secondo;
4. la massa che avanza è la massa disponibile del reagente in eccesso meno quella che reagisce;
5. la massa del prodotto è la somma delle masse che reagiscono, per la legge di Lavoisier.

Nella figura qui sotto scegli i due elementi e le loro masse, poi falli reagire: le parti che si combinano formano il composto, sempre nello stesso rapporto, e il reagente in eccesso avanza.

```interattivo
% nome: proust-rapporto-combinazione
% alt: Due barre, una per ogni elemento, lunghe quanto la loro massa, per esempio rame e zolfo. Con due cursori si scelgono le masse, e si può cambiare coppia di elementi: ferro e zolfo, magnesio e ossigeno, idrogeno e ossigeno. Premendo il bottone, da ogni barra si stacca la parte che reagisce e le due parti si uniscono nella barra del composto, sempre nello stesso rapporto di combinazione; quello che resta del reagente in eccesso avanza. Sotto si leggono il rapporto, le masse che reagiscono, la massa del composto e quella che avanza
```

```ad-example
Esempio 4: avanza lo zolfo
Si scaldano $8{,}00\,\text{g}$ di rame con $3{,}00\,\text{g}$ di zolfo. Quale elemento avanza, e quanto? Quanto solfuro di rame si forma?

Il rapporto è $m_{\mathrm{Cu}}/m_{\mathrm{S}} = 3{,}96$. Per far reagire tutto il rame servirebbero

$$m_{\mathrm{S}} = \frac{8{,}00\,\text{g}}{3{,}96} = 2{,}020\ldots\,\text{g} \approx 2{,}02\,\text{g}$$

di zolfo, e ce ne sono $3{,}00\,\text{g}$: lo zolfo è in eccesso, il rame reagisce tutto. Avanzano $3{,}00\,\text{g} - 2{,}02\,\text{g} = 0{,}98\,\text{g}$ di zolfo, e il solfuro di rame è

$$8{,}00\,\text{g} + 2{,}02\,\text{g} = 10{,}02\,\text{g}$$

Controllo con Lavoisier: $10{,}02\,\text{g} + 0{,}98\,\text{g} = 11{,}00\,\text{g}$, come la massa dei reagenti all'inizio.
```

```ad-example
Esempio 5: avanza il ferro
Si scaldano $7{,}00\,\text{g}$ di ferro con $3{,}00\,\text{g}$ di zolfo. Il rapporto nel solfuro di ferro è $m_{\mathrm{Fe}}/m_{\mathrm{S}} = 1{,}74$. Che cosa avanza?

Per tutto il ferro servirebbero $7{,}00\,\text{g} / 1{,}74 = 4{,}02\,\text{g}$ di zolfo, ma ce ne sono solo $3{,}00\,\text{g}$: questa volta lo zolfo è il reagente limitante, e in eccesso c'è il ferro. Si rifà il conto partendo dallo zolfo, che reagisce tutto:

$$m_{\mathrm{Fe}} = 1{,}74 \cdot 3{,}00\,\text{g} = 5{,}22\,\text{g}$$

Avanzano $7{,}00\,\text{g} - 5{,}22\,\text{g} = 1{,}78\,\text{g}$ di ferro, e si formano $5{,}22\,\text{g} + 3{,}00\,\text{g} = 8{,}22\,\text{g}$ di solfuro di ferro.
```

```ad-warning
Il reagente in eccesso non è quello con la massa più grande
Nell'esempio 4 il rame, $8{,}00\,\text{g}$, pesa più dello zolfo, $3{,}00\,\text{g}$, eppure avanza lo zolfo. Per decidere non si confrontano le masse tra loro, ma ognuna con la massa che il rapporto di combinazione richiede.
```

```ad-warning
Il prodotto non è la somma dei reagenti messi
Nell'esempio 4 si mettono in tutto $11{,}00\,\text{g}$ di rame e zolfo, ma il solfuro di rame è $10{,}02\,\text{g}$: la parte di zolfo in eccesso resta zolfo e non entra nel composto.
```

```ad-note
I composti che non rispettano la legge
Berthollet non aveva del tutto torto. Esistono solidi, come alcuni ossidi e solfuri di ferro, in cui la composizione cambia un po' da un campione all'altro, perché nel cristallo mancano qua e là degli atomi. Si chiamano, in suo onore, berthollidi, e sono un'eccezione: la grande maggioranza dei composti ha una composizione fissa, e anche per i berthollidi, come il solfuro di ferro, queste lezioni usano la composizione ideale.
```
