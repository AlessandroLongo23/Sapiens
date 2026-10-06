# Frigoriferi e pompe di calore

Metti una mano dietro il frigorifero di casa: la griglia sul retro è calda. Il calore che senti è quello che il frigorifero ha tolto ai cibi, più qualcosa. Un frigorifero non "produce freddo": sposta calore da dentro, dove fa freddo, a fuori, dove fa caldo, cioè nel verso opposto a quello in cui il calore passa da solo. Per farlo consuma energia elettrica, e questa lezione dice quanta ne serve.

## Una macchina termica al contrario

Una [macchina termica](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/le-macchine-termiche-e-il-rendimento) assorbe il calore $Q_c$ da una sorgente calda, ne trasforma una parte nel lavoro $W$ e cede il resto, $Q_f$, a una sorgente fredda. Una **macchina frigorifera** percorre lo stesso ciclo al contrario: assorbe il calore $Q_f$ dalla sorgente fredda, riceve dall'esterno il lavoro $W$ e cede il calore $Q_c$ alla sorgente calda.

```tikz
% nome: macchina-termica-e-frigorifero
% alt: Due schemi affiancati. A sinistra la macchina termica: dalla sorgente calda a temperatura Tc, in alto, il calore Qc scende alla macchina, disegnata come un cerchio; dalla macchina esce verso destra il lavoro W e scende il calore Qf verso la sorgente fredda a temperatura Tf, in basso. A destra il frigorifero, con tutte le frecce rovesciate: il calore Qf sale dalla sorgente fredda alla macchina, il lavoro W entra da destra e il calore Qc sale alla sorgente calda
\begin{tikzpicture}
\draw[thick, fill=red!15] (-1.2,3.2) rectangle (1.2,3.9);
\node at (0,3.55) {\small calda, $T_c$};
\draw[thick, fill=blue!10] (-1.2,-0.7) rectangle (1.2,0);
\node at (0,-0.35) {\small fredda, $T_f$};
\draw[thick, fill=gray!20] (0,1.6) circle (0.55);
\draw[-{Stealth}, thick, orange!90!black] (0,3.2) -- (0,2.15) node[midway, left] {$Q_c$};
\draw[-{Stealth}, thick, orange!90!black] (0,1.05) -- (0,0) node[midway, left] {$Q_f$};
\draw[-{Stealth}, thick] (0.55,1.6) -- (1.7,1.6) node[above, pos=0.6] {$W$};
\node at (0,-1.1) {\small macchina termica};
\draw[thick, fill=red!15] (3.2,3.2) rectangle (5.6,3.9);
\node at (4.4,3.55) {\small calda, $T_c$};
\draw[thick, fill=blue!10] (3.2,-0.7) rectangle (5.6,0);
\node at (4.4,-0.35) {\small fredda, $T_f$};
\draw[thick, fill=gray!20] (4.4,1.6) circle (0.55);
\draw[-{Stealth}, thick, orange!90!black] (4.4,0) -- (4.4,1.05) node[midway, left] {$Q_f$};
\draw[-{Stealth}, thick, orange!90!black] (4.4,2.15) -- (4.4,3.2) node[midway, left] {$Q_c$};
\draw[-{Stealth}, thick] (6.1,1.6) -- (4.95,1.6) node[above, pos=0.4] {$W$};
\node at (4.4,-1.1) {\small frigorifero};
\end{tikzpicture}
```

Nel frigorifero di cucina la sorgente fredda è l'interno, con i cibi, e la sorgente calda è l'aria della cucina. Come nelle macchine termiche, $Q_c$, $Q_f$ e $W$ si prendono in valore assoluto, e il verso lo dicono le parole "assorbe", "cede" e "riceve".

Alla fine di ogni ciclo il fluido che lavora nella macchina torna allo stato di partenza, quindi la sua energia interna non è cambiata. Per il [primo principio](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica) l'energia che entra è uguale a quella che esce:

$$Q_c = Q_f + W$$

Il calore ceduto alla cucina è più grande di quello tolto ai cibi: la differenza è il lavoro del motore, che finisce anch'esso in calore.

Il lavoro non si può eliminare. L'[enunciato di Clausius](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/gli-enunciati-di-kelvin-e-di-clausius) del secondo principio dice proprio questo: nessuna trasformazione può avere come unico risultato il passaggio di calore da un corpo freddo a uno caldo. Un frigorifero con $W = 0$ non esiste.

```ad-warning
Lasciare aperto il frigorifero non rinfresca la cucina
Con lo sportello aperto il frigorifero toglie $Q_f$ all'aria della cucina e alla stessa aria restituisce $Q_c = Q_f + W$, che è di più. Il bilancio per la stanza è $+W$: la cucina si scalda, come se al posto del frigorifero ci fosse una stufa elettrica della stessa potenza.
```

## Il coefficiente di prestazione

Di un frigorifero interessa il calore $Q_f$ che toglie alla sorgente fredda; quello che si paga è il lavoro $W$. Il loro rapporto è il **coefficiente di prestazione**, che si indica con la sigla $\text{COP}$ (dall'inglese *coefficient of performance*):

$$\text{COP}_f = \frac{Q_f}{W} = \frac{Q_f}{Q_c - Q_f}$$

Il pedice $f$ ricorda che è il coefficiente di un frigorifero. È un numero puro, perché è il rapporto tra due energie, e dice quanti joule di calore la macchina toglie per ogni joule di lavoro che riceve.

```ad-example
Esempio 1: il coefficiente di un frigorifero
In un ciclo un frigorifero toglie $450\,\text{J}$ di calore al suo interno e il motore compie un lavoro di $150\,\text{J}$. Quanto vale il coefficiente di prestazione? Quanto calore riceve la cucina in un ciclo?

I dati sono $Q_f = 450\,\text{J}$ e $W = 150\,\text{J}$.

$$\text{COP}_f = \frac{Q_f}{W} = \frac{450\,\text{J}}{150\,\text{J}} = 3{,}00$$

Per ogni joule di lavoro il frigorifero sposta tre joule di calore. Alla cucina arriva la somma:

$$Q_c = Q_f + W = 450\,\text{J} + 150\,\text{J} = 600\,\text{J}$$
```

```ad-warning
Un COP maggiore di 1 non crea energia
Il rendimento di una macchina termica è sempre minore di 1; il coefficiente di prestazione di un frigorifero è quasi sempre maggiore di 1, e non c'è contraddizione. Il frigorifero non trasforma il lavoro in calore: usa il lavoro per spostare del calore che c'era già. Il conto dell'energia torna sempre, $Q_c = Q_f + W$.
```

## Come funziona un frigorifero vero

In un frigorifero domestico il ciclo è percorso da un fluido, il refrigerante, che gira in un circuito chiuso e passa di continuo da liquido a vapore e viceversa. Il circuito ha quattro parti.

1. Nell'**evaporatore**, una serpentina dentro il frigorifero, il refrigerante liquido evapora a bassa pressione e a bassa temperatura. Per evaporare ha bisogno del [calore latente di vaporizzazione](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/i-passaggi-di-stato-e-il-calore-latente), e lo prende dai cibi: è il calore $Q_f$.
2. Il **compressore**, mosso dal motore elettrico, comprime il vapore, che si scalda fino a una temperatura più alta di quella della cucina: è qui che entra il lavoro $W$.
3. Nel **condensatore**, la serpentina sul retro, il vapore caldo cede calore all'aria della cucina e torna liquido: è il calore $Q_c$.
4. La **valvola di espansione** fa scendere di colpo la pressione del liquido, che si raffredda e rientra nell'evaporatore.

```tikz
% nome: circuito-frigorifero
% alt: Il circuito di un frigorifero. A sinistra, dentro il frigorifero, la serpentina dell'evaporatore, che riceve il calore Qf dall'interno; in basso il compressore, che riceve il lavoro W; a destra, fuori dal frigorifero, la serpentina del condensatore, che cede il calore Qc alla cucina; in alto la valvola di espansione. Le frecce lungo i tubi mostrano il verso del refrigerante: evaporatore, compressore, condensatore, valvola
\begin{tikzpicture}
\draw[dashed, thin, fill=blue!10] (-0.2,-0.2) rectangle (2.6,3.2);
\node at (0.6,2.9) {\small interno};
\node at (5.7,2.9) {\small cucina};
\draw[thick, decorate, decoration={zigzag, segment length=7pt, amplitude=5pt}] (1.9,2.3) -- (1.9,0.7);
\draw[thick, decorate, decoration={zigzag, segment length=7pt, amplitude=5pt}] (4.6,0.7) -- (4.6,2.3);
\draw[thick] (1.9,2.3) -- (1.9,2.6) -- (3.0,2.6);
\draw[thick] (3.5,2.6) -- (4.6,2.6) -- (4.6,2.3);
\draw[thick] (1.9,0.7) -- (1.9,0.4) -- (2.95,0.4);
\draw[thick] (3.55,0.4) -- (4.6,0.4) -- (4.6,0.7);
\draw[thick, fill=gray!20] (3.25,0.4) circle (0.3);
\draw[thick, fill=gray!20] (3.0,2.45) -- (3.5,2.75) -- (3.5,2.45) -- (3.0,2.75) -- cycle;
\draw[-{Stealth}, thick] (2.2,0.4) -- (2.6,0.4);
\draw[-{Stealth}, thick] (3.8,0.4) -- (4.2,0.4);
\draw[-{Stealth}, thick] (4.3,2.6) -- (3.9,2.6);
\draw[-{Stealth}, thick] (2.7,2.6) -- (2.3,2.6);
\draw[-{Stealth}, thick, orange!90!black] (0.3,1.7) -- (1.5,1.7) node[midway, above] {$Q_f$};
\draw[-{Stealth}, thick, orange!90!black] (5.0,1.7) -- (6.2,1.7) node[midway, above] {$Q_c$};
\draw[-{Stealth}, thick] (3.25,-1.0) -- (3.25,0.1) node[pos=0.3, left] {$W$};
\node at (0.7,0.75) {\small evaporatore};
\node at (5.9,0.9) {\small condensatore};
\node at (3.25,3.05) {\small valvola};
\node[right] at (3.4,-0.5) {\small compressore};
\end{tikzpicture}
```

Un condizionatore d'aria funziona allo stesso modo: l'evaporatore è nella stanza da rinfrescare, il condensatore è nell'unità esterna, che d'estate soffia aria calda sul balcone.

## La pompa di calore

La stessa macchina si può usare per scaldare. Una **pompa di calore** è una macchina frigorifera in cui interessa il calore $Q_c$ ceduto alla sorgente calda: la sorgente fredda è l'aria esterna (o il terreno, o l'acqua di una falda), la sorgente calda è la casa. La macchina toglie calore all'aria fredda di fuori e lo porta dentro, insieme al lavoro del compressore.

Il coefficiente di prestazione di una pompa di calore è il rapporto tra il calore ceduto alla casa e il lavoro:

$$\text{COP}_p = \frac{Q_c}{W} = \frac{Q_c}{Q_c - Q_f}$$

Siccome $Q_c = Q_f + W$, dividendo per $W$ si trova che i due coefficienti della stessa macchina differiscono di 1:

$$\text{COP}_p = \text{COP}_f + 1$$

Il coefficiente di una pompa di calore è quindi sempre maggiore di 1. Una stufa elettrica trasforma in calore il lavoro elettrico che riceve, joule per joule; una pompa di calore, con lo stesso lavoro, porta in casa $\text{COP}_p$ volte tanto, perché al lavoro aggiunge il calore preso da fuori.

```ad-example
Esempio 2: una pompa di calore e una stufa elettrica
Per mantenere la temperatura di una casa in una giornata d'inverno servono $2{,}8 \cdot 10^7\,\text{J}$ di calore ogni ora. La casa è scaldata da una pompa di calore con $\text{COP}_p = 3{,}5$. Quanto lavoro compie il compressore in un'ora, e con quale potenza? Quanto calore viene preso dall'aria esterna? Che potenza avrebbe una stufa elettrica che facesse lo stesso servizio?

I dati sono $Q_c = 2{,}8 \cdot 10^7\,\text{J}$, $\text{COP}_p = 3{,}5$ e $\Delta t = 1\,\text{h} = 3600\,\text{s}$. Dalla definizione del coefficiente:

$$W = \frac{Q_c}{\text{COP}_p} = \frac{2{,}8 \cdot 10^7\,\text{J}}{3{,}5} = 8{,}0 \cdot 10^6\,\text{J}$$

La [potenza](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-potenza) è il lavoro diviso per il tempo:

$$P = \frac{W}{\Delta t} = \frac{8{,}0 \cdot 10^6\,\text{J}}{3600\,\text{s}} = 2{,}22\ldots \cdot 10^3\,\text{W} \approx 2{,}2\,\text{kW}$$

Il calore preso dall'aria esterna è la differenza:

$$Q_f = Q_c - W = 2{,}8 \cdot 10^7\,\text{J} - 0{,}80 \cdot 10^7\,\text{J} = 2{,}0 \cdot 10^7\,\text{J}$$

Una stufa elettrica dovrebbe fornire tutti i $2{,}8 \cdot 10^7\,\text{J}$ come lavoro elettrico, con una potenza $P = 2{,}8 \cdot 10^7\,\text{J} / 3600\,\text{s} \approx 7{,}8\,\text{kW}$: tre volte e mezza quella della pompa di calore.
```

```ad-warning
Due coefficienti diversi per la stessa macchina
Al numeratore va il calore che interessa: $Q_f$ per un frigorifero o un condizionatore che rinfresca, $Q_c$ per una pompa di calore. Al denominatore va sempre il lavoro. Se un problema dà $Q_c$ e $Q_f$ e chiede il coefficiente, il lavoro si trova prima, con $W = Q_c - Q_f$.
```

## Il coefficiente massimo

Il [teorema di Carnot](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/il-teorema-di-carnot-e-il-ciclo-di-carnot) dice che tra due sorgenti a temperature $T_c$ e $T_f$ la macchina termica con il rendimento più alto è quella reversibile, e che per una macchina reversibile i calori scambiati stanno tra loro come le temperature assolute delle sorgenti:

$$\frac{Q_f}{Q_c} = \frac{T_f}{T_c}$$

Una macchina reversibile si può far girare al contrario, e diventa un frigorifero che scambia gli stessi calori nei versi opposti. Con lo stesso ragionamento del teorema di Carnot si dimostra (qui lo enunciamo soltanto) che è il migliore frigorifero possibile: tra due sorgenti date, nessuna macchina frigorifera ha un coefficiente di prestazione più alto di quello di una macchina reversibile.

Il valore massimo si ricava dalla proporzione. Dividendo numeratore e denominatore di $\text{COP}_f$ per $Q_f$:

$$\text{COP}_f = \frac{Q_f}{Q_c - Q_f} = \frac{1}{\dfrac{Q_c}{Q_f} - 1} = \frac{1}{\dfrac{T_c}{T_f} - 1}$$

e quindi, per un frigorifero e per una pompa di calore reversibili,

$$\text{COP}_{f,max} = \frac{T_f}{T_c - T_f} \qquad\qquad \text{COP}_{p,max} = \frac{T_c}{T_c - T_f}$$

Al denominatore c'è la differenza tra le temperature delle due sorgenti. Più le sorgenti sono vicine in temperatura, più alto è il coefficiente: portare calore "in salita" costa poco lavoro se il dislivello di temperatura è piccolo, molto se è grande. I frigoriferi e le pompe di calore reali hanno coefficienti più bassi di questi massimi, perché i loro cicli non sono reversibili.

```tikz
% nome: cop-massimo-differenza-temperatura
% alt: Grafico del coefficiente di prestazione massimo di un frigorifero con l'interno a 275 kelvin, in funzione della differenza di temperatura tra la cucina e l'interno, da 7 a 50 kelvin. La curva è un ramo di iperbole che scende: vale circa 14 con una differenza di 20 kelvin e circa 7 con una differenza di 40 kelvin, i due punti segnati
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (5,4);
\draw[->] (-0.2,0) -- (5.5,0);
\node at (2.75,-0.8) {\small $T_c - T_f$ (K)};
\draw[->] (0,-0.2) -- (0,4.5) node[right] {\small $\mathrm{COP}_{f,max}$};
\foreach \x/\l in {1/10,2/20,3/30,4/40,5/50} \node[below] at (\x,0) {\small $\l$};
\foreach \y/\l in {1/10,2/20,3/30,4/40} \node[left] at (0,\y) {\small $\l$};
\draw[thick, blue, domain=0.7:5, samples=60] plot (\x,{2.75/\x});
\draw[dashed, thin] (2,0) -- (2,1.375) -- (0,1.375);
\draw[dashed, thin] (4,0) -- (4,0.6875) -- (0,0.6875);
\fill (2,1.375) circle (1.5pt);
\fill (4,0.6875) circle (1.5pt);
\end{tikzpicture}
```

Il grafico mostra il coefficiente massimo di un frigorifero che tiene l'interno a $275\,\text{K}$ ($2\,^\circ\text{C}$), al variare della differenza di temperatura con la cucina: la curva è $275\,\text{K} / (T_c - T_f)$, un ramo di iperbole. Quando la differenza raddoppia da $20\,\text{K}$ a $40\,\text{K}$ il coefficiente si dimezza, da $13{,}75$ a circa $6{,}9$.

```ad-warning
Le temperature vanno in kelvin
Nelle formule del coefficiente massimo $T_c$ e $T_f$ sono [temperature assolute](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche). Con i gradi Celsius il risultato è sbagliato, e può venire perfino negativo: per un congelatore a $-18\,^\circ\text{C}$ in una cucina a $25\,^\circ\text{C}$ si troverebbe $-18/43 \approx -0{,}42$. La differenza $T_c - T_f$ invece è la stessa in kelvin e in gradi Celsius: $43\,\text{K}$.
```

```ad-example
Esempio 3: il coefficiente massimo
Un congelatore tiene l'interno a $-18\,^\circ\text{C}$ in una cucina a $25\,^\circ\text{C}$. Qual è il massimo coefficiente di prestazione che può avere? Una pompa di calore tiene una casa a $20\,^\circ\text{C}$: qual è il suo coefficiente massimo quando fuori ci sono $2\,^\circ\text{C}$, e quando ce ne sono $-10$?

Per il congelatore le temperature assolute sono $T_f = (-18 + 273)\,\text{K} = 255\,\text{K}$ e $T_c = (25 + 273)\,\text{K} = 298\,\text{K}$:

$$\text{COP}_{f,max} = \frac{T_f}{T_c - T_f} = \frac{255\,\text{K}}{298\,\text{K} - 255\,\text{K}} = \frac{255}{43} = 5{,}93\ldots \approx 5{,}9$$

Per la pompa di calore la sorgente calda è la casa, $T_c = 293\,\text{K}$, e la sorgente fredda è l'aria esterna. Con $T_f = 275\,\text{K}$:

$$\text{COP}_{p,max} = \frac{T_c}{T_c - T_f} = \frac{293\,\text{K}}{293\,\text{K} - 275\,\text{K}} = \frac{293}{18} = 16{,}2\ldots \approx 16$$

Con $T_f = 263\,\text{K}$ la differenza sale a $30\,\text{K}$ e il coefficiente scende a $293/30 \approx 9{,}8$. Una pompa di calore rende meno proprio nei giorni più freddi, quando serve di più.
```

Nella figura qui sotto scegli le temperature delle due sorgenti di una macchina reversibile, usata come frigorifero o come pompa di calore, e guardi come cambiano le tre frecce: la larghezza di ognuna è proporzionale all'energia. La domanda è: se la sorgente calda diventa più calda, o quella fredda più fredda, che cosa succede al lavoro che serve per spostare lo stesso calore?

```interattivo
% nome: frigorifero-cop-temperature
% alt: Lo schema di una macchina frigorifera reversibile tra una sorgente fredda in basso e una sorgente calda in alto, con tre frecce larghe quanto le energie: il calore Qf che sale dalla sorgente fredda, il lavoro W che entra di lato e il calore Qc che sale alla sorgente calda. Due cursori scelgono le temperature delle sorgenti in gradi Celsius e un selettore sceglie tra frigorifero, che toglie 1000 joule alla sorgente fredda, e pompa di calore, che ne cede 1000 alla sorgente calda. Sotto sono scritti le temperature in kelvin, il coefficiente di prestazione massimo e le tre energie
```

Il lavoro cresce quando le temperature si allontanano. Per togliere $1000\,\text{J}$ a un interno a $-18\,^\circ\text{C}$ con la cucina a $25\,^\circ\text{C}$ servono almeno $1000\,\text{J} / 5{,}93 \approx 169\,\text{J}$ di lavoro; se la cucina sale a $32\,^\circ\text{C}$ il coefficiente massimo scende a $255/50 = 5{,}1$ e il lavoro sale a $196\,\text{J}$. Per questo un frigorifero consuma di più d'estate, e conviene non metterlo accanto al forno.

## Il lavoro per raffreddare

Nei problemi il calore da togliere spesso non è dato: si calcola con le formule della termologia, $Q = c\,m\,\Delta t$ per [raffreddare un corpo](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico) e $Q = L_f\,m$ per farlo solidificare. Trovato $Q_f$, il coefficiente di prestazione dà il lavoro, e la potenza del motore dà il tempo.

```ad-example
Esempio 4: fare il ghiaccio
Nel congelatore metti una vaschetta con $0{,}50\,\text{kg}$ di acqua a $20\,^\circ\text{C}$. Il congelatore ha un coefficiente di prestazione di $2{,}5$ e il suo motore ha una potenza di $120\,\text{W}$. Quanto lavoro serve per trasformare l'acqua in ghiaccio a $0\,^\circ\text{C}$, e quanto tempo ci mette il motore? Quanto calore riceve la cucina?

Il calore da togliere è la somma di due parti: quello per raffreddare l'acqua da $20\,^\circ\text{C}$ a $0\,^\circ\text{C}$, con $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, e quello per farla solidificare, con $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$.

$$Q_1 = c\,m\,\Delta t = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)} \cdot 0{,}50\,\text{kg} \cdot 20\,^\circ\text{C} = 4{,}186 \cdot 10^4\,\text{J}$$

$$Q_2 = L_f\,m = 3{,}34 \cdot 10^5\,\text{J/kg} \cdot 0{,}50\,\text{kg} = 1{,}67 \cdot 10^5\,\text{J}$$

$$Q_f = Q_1 + Q_2 = 2{,}0886 \cdot 10^5\,\text{J} \approx 2{,}1 \cdot 10^5\,\text{J}$$

Il lavoro si ricava dal coefficiente di prestazione:

$$W = \frac{Q_f}{\text{COP}_f} = \frac{2{,}0886 \cdot 10^5\,\text{J}}{2{,}5} = 8{,}35\ldots \cdot 10^4\,\text{J} \approx 8{,}4 \cdot 10^4\,\text{J}$$

e il tempo dalla potenza, che è il lavoro diviso per il tempo:

$$\text{tempo} = \frac{W}{P} = \frac{8{,}354 \cdot 10^4\,\text{J}}{120\,\text{W}} = 696\ldots\,\text{s} \approx 7{,}0 \cdot 10^2\,\text{s}$$

cioè poco meno di 12 minuti di funzionamento del motore. Alla cucina arriva $Q_c = Q_f + W \approx 2{,}9 \cdot 10^5\,\text{J}$. Nella realtà ci vuole più tempo, perché il congelatore deve anche smaltire il calore che entra dalle pareti e dallo sportello.
```

## Frigorifero, pompa di calore e macchina termica a confronto

| | Macchina termica | Frigorifero | Pompa di calore |
|---|---|---|---|
| Che cosa fa | trasforma calore in lavoro | toglie calore alla sorgente fredda | cede calore alla sorgente calda |
| Che cosa interessa | $W$ | $Q_f$ | $Q_c$ |
| Che cosa si spende | $Q_c$ | $W$ | $W$ |
| Indice | $\eta = \dfrac{W}{Q_c}$ | $\text{COP}_f = \dfrac{Q_f}{W}$ | $\text{COP}_p = \dfrac{Q_c}{W}$ |
| Valore massimo | $1 - \dfrac{T_f}{T_c}$ | $\dfrac{T_f}{T_c - T_f}$ | $\dfrac{T_c}{T_c - T_f}$ |
| Valori possibili | minore di 1 | anche maggiore di 1 | sempre maggiore di 1 |

In tutti e tre i casi l'indice è "quello che interessa diviso quello che si spende", e in tutti e tre il bilancio dell'energia è lo stesso, $Q_c = Q_f + W$.

```ad-note
Il legame con il rendimento
Il coefficiente di una pompa di calore e il rendimento della stessa macchina usata come motore sono uno l'inverso dell'altro: $\text{COP}_p = Q_c / W = 1/\eta$. Una macchina di Carnot tra $275\,\text{K}$ e $293\,\text{K}$ ha un rendimento di appena $1 - 275/293 \approx 0{,}061$, e proprio per questo, girata al contrario, è un'ottima pompa di calore, con $\text{COP}_p \approx 16$.
```
