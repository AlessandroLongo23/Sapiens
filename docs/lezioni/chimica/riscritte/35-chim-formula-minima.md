# Composizione percentuale, formula minima e formula molecolare

Quando un chimico ha in mano una sostanza nuova, la prima cosa che vuole sapere è di quali atomi è fatta e in che proporzione. L'analisi di laboratorio non conta gli atomi: pesa quanto di ogni elemento c'è in un campione, e dà la composizione percentuale in massa. Da quei numeri, con le masse atomiche e un po' di aritmetica, si risale alla formula: prima alla formula minima, che dice il rapporto tra gli atomi, poi, se si conosce la massa molare, alla formula molecolare. È il cammino inverso di quello della lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare), che dalla formula calcola la massa molare e le percentuali.

## La composizione percentuale

La **composizione percentuale** di un composto dice quanti grammi di ogni elemento ci sono in $100\ \mathrm{g}$ di composto. Si può ottenere in due modi.

Se conosci la formula, la calcoli come nella lezione sulla mole: per un elemento $X$ che compare $k$ volte nella formula di un composto di massa molare $M$,

$$\%X = \frac{k \cdot A_X}{M} \cdot 100$$

dove $A_X$ è la massa atomica dell'elemento, dalla tavola della lezione 01 (che usiamo sempre: $\mathrm{H}$ $1{,}01$, $\mathrm{C}$ $12{,}01$, $\mathrm{N}$ $14{,}01$, $\mathrm{O}$ $16{,}00$, $\mathrm{Fe}$ $55{,}85$...). Per il glucosio, $\mathrm{C_6H_{12}O_6}$, si trova $40{,}0\%$ di carbonio, $6{,}7\%$ di idrogeno e $53{,}3\%$ di ossigeno.

Se invece la formula non la conosci, la composizione viene dall'analisi: si pesa un campione, si misura la massa di ogni elemento che contiene, e si divide:

$$\%X = \frac{m_X}{m_{\text{campione}}} \cdot 100$$

La legge di Proust garantisce che il risultato non dipende dal campione: un composto puro ha sempre la stessa composizione, qualunque sia la sua origine (vedi [La legge di Proust](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-proust)).

```ad-example
Esempio 1: un ossido di azoto
Un campione di $2{,}50\ \mathrm{g}$ di un composto di azoto e ossigeno contiene $0{,}761\ \mathrm{g}$ di azoto. Qual è la sua composizione percentuale?

L'ossigeno è il resto: $2{,}50 - 0{,}761 = 1{,}739\ \mathrm{g}$. Quindi
$$\%\mathrm{N} = \frac{0{,}761\ \mathrm{g}}{2{,}50\ \mathrm{g}} \cdot 100 = 30{,}4\% \qquad \%\mathrm{O} = \frac{1{,}739\ \mathrm{g}}{2{,}50\ \mathrm{g}} \cdot 100 = 69{,}6\%$$
Controllo: $30{,}4 + 69{,}6 = 100{,}0$. Questo composto tornerà negli esempi 2 e 6.
```

Le percentuali sono in massa, non in numero di atomi, e le due cose possono essere molto diverse. Nel glucosio metà degli atomi sono di idrogeno, ma l'idrogeno è meno del $7\%$ della massa, perché ogni atomo di idrogeno pesa un dodicesimo di un atomo di carbonio e un sedicesimo di uno di ossigeno.

```tikz
% nome: formula-minima-glucosio-barre
% alt: Due barre lunghe uguali per il glucosio. Quella in alto, la massa, è divisa in carbonio 40,0 per cento, idrogeno 6,7 per cento, una striscia sottile, e ossigeno 53,3 per cento. Quella in basso, gli atomi, è divisa in carbonio 25 per cento, idrogeno 50 per cento e ossigeno 25 per cento
% svg: formula-minima-glucosio-barre-6fdbef2b.svg 351x116
\begin{tikzpicture}
\node[left] at (0,1.9) {massa};
\node[left] at (0,0.4) {atomi};
\draw[thick, fill=gray!25] (0,1.6) rectangle (3.2,2.2);
\draw[thick, fill=blue!10] (3.2,1.6) rectangle (3.736,2.2);
\draw[thick, fill=red!20] (3.736,1.6) rectangle (8,2.2);
\node at (1.6,1.9) {C $40{,}0\%$};
\node at (5.868,1.9) {O $53{,}3\%$};
\draw[thin] (3.468,2.2) -- (3.468,2.55);
\node[above] at (3.468,2.5) {H $6{,}7\%$};
\draw[thick, fill=gray!25] (0,0.1) rectangle (2,0.7);
\draw[thick, fill=blue!10] (2,0.1) rectangle (6,0.7);
\draw[thick, fill=red!20] (6,0.1) rectangle (8,0.7);
\node at (1,0.4) {C $25\%$};
\node at (4,0.4) {H $50\%$};
\node at (7,0.4) {O $25\%$};
\end{tikzpicture}
```

```ad-warning
Contare gli atomi al posto della massa
La composizione percentuale non si legge dagli indici della formula: nel glucosio l'idrogeno è $12$ atomi su $24$, cioè la metà degli atomi, ma solo il $6{,}7\%$ della massa. Ogni indice va moltiplicato per la massa atomica del suo elemento.
```

## La formula minima

La **formula minima** (o formula empirica) di un composto indica gli elementi che lo formano e il rapporto più semplice, con numeri interi, tra i loro atomi. La **formula molecolare**, la formula bruta della lezione sulla mole, dice invece quanti atomi di ogni elemento ci sono in una molecola.

Dalla formula molecolare si passa alla formula minima dividendo tutti gli indici per il loro massimo comune divisore:

| Sostanza | Formula molecolare | Formula minima |
|---|---|---|
| Glucosio | $\mathrm{C_6H_{12}O_6}$ | $\mathrm{CH_2O}$ |
| Acqua ossigenata | $\mathrm{H_2O_2}$ | $\mathrm{HO}$ |
| Etano | $\mathrm{C_2H_6}$ | $\mathrm{CH_3}$ |
| Benzene | $\mathrm{C_6H_6}$ | $\mathrm{CH}$ |
| Acqua | $\mathrm{H_2O}$ | $\mathrm{H_2O}$ |
| Anidride carbonica | $\mathrm{CO_2}$ | $\mathrm{CO_2}$ |

Per molte sostanze le due formule coincidono, come per l'acqua e l'anidride carbonica. I composti ionici, come il cloruro di sodio $\mathrm{NaCl}$, non sono fatti di molecole: la loro formula dice solo il rapporto tra gli ioni, ed è sempre una formula minima.

Sostanze diverse possono avere la stessa formula minima, e quindi la stessa composizione percentuale. Il metanale (formaldeide), l'acido etanoico (acido acetico) e il glucosio hanno tutti formula minima $\mathrm{CH_2O}$ e tutti $40{,}0\%$ di carbonio, $6{,}7\%$ di idrogeno e $53{,}3\%$ di ossigeno; le loro molecole però contengono una, due e sei unità $\mathrm{CH_2O}$.

```molecole
% nome: formula-minima-ch2o-tre-molecole
% alt: Tre molecole con la stessa formula minima CH2O: il metanale, con un carbonio, e l'acido acetico, con due carboni, in formula di struttura con tutti gli atomi, e il glucosio, un anello con sei carboni, in formula scheletrica
% svg: formula-minima-ch2o-tre-molecole-5d6663c7.svg 651x173
colonne: 3
C=O | metanale, CH2O | idrogeni: tutti | carboni: si
CC(=O)O | acido acetico, C2H4O2 | idrogeni: tutti | carboni: si
OCC1OC(O)C(O)C(O)C1O | glucosio, C6H12O6
```

Per questo la composizione percentuale da sola porta alla formula minima, e per arrivare alla formula molecolare serve un dato in più: la massa molare.

## Dalla composizione alla formula minima

L'idea è contare gli atomi con le moli: il rapporto tra le moli di atomi dei diversi elementi è lo stesso rapporto che c'è tra gli atomi. Il procedimento:

1. Prendi $100\ \mathrm{g}$ di composto: le percentuali diventano grammi ($40{,}0\%$ di carbonio vuol dire $40{,}0\ \mathrm{g}$ di carbonio). Se i dati sono già masse, usa quelle.
2. Dividi i grammi di ogni elemento per la sua massa atomica: trovi le moli di atomi di quell'elemento.
3. Dividi tutti i numeri di moli per il più piccolo.
4. Se i quozienti sono interi, a meno di qualche centesimo, sono gli indici. Se no, moltiplicali tutti per il numero più piccolo che li rende interi: per $2$ se un quoziente finisce in $0{,}5$, per $3$ se finisce in $0{,}33$ o $0{,}67$, per $4$ se finisce in $0{,}25$ o $0{,}75$.
5. Scrivi la formula con quei numeri come indici.

Le differenze di qualche centesimo dall'intero ($1{,}99$ invece di $2$) vengono dagli arrotondamenti delle percentuali e delle masse atomiche. Una differenza di qualche decimo ($1{,}5$, $1{,}33$) no: vuol dire che gli indici non sono ancora interi.

```ad-example
Esempio 2: l'ossido di azoto
Il composto dell'esempio 1 ha $30{,}4\%$ di azoto e $69{,}6\%$ di ossigeno. Qual è la sua formula minima?

In $100\ \mathrm{g}$ ci sono $30{,}4\ \mathrm{g}$ di azoto e $69{,}6\ \mathrm{g}$ di ossigeno. Le moli di atomi:
$$\mathrm{N}: \frac{30{,}4}{14{,}01} = 2{,}170\ \mathrm{mol} \qquad \mathrm{O}: \frac{69{,}6}{16{,}00} = 4{,}350\ \mathrm{mol}$$
Il più piccolo è $2{,}170$. Dividendo:
$$\mathrm{N}: \frac{2{,}170}{2{,}170} = 1 \qquad \mathrm{O}: \frac{4{,}350}{2{,}170} = 2{,}005 \approx 2$$
Per ogni atomo di azoto ci sono due atomi di ossigeno: la formula minima è $\mathrm{NO_2}$.
```

```ad-example
Esempio 3: tre elementi
Un composto contiene $40{,}0\%$ di carbonio, $6{,}7\%$ di idrogeno e $53{,}3\%$ di ossigeno. Qual è la sua formula minima?

Le moli di atomi in $100\ \mathrm{g}$:
$$\mathrm{C}: \frac{40{,}0}{12{,}01} = 3{,}331 \qquad \mathrm{H}: \frac{6{,}7}{1{,}01} = 6{,}634 \qquad \mathrm{O}: \frac{53{,}3}{16{,}00} = 3{,}331$$
Dividendo per $3{,}331$:
$$\mathrm{C}: 1 \qquad \mathrm{H}: \frac{6{,}634}{3{,}331} = 1{,}99 \approx 2 \qquad \mathrm{O}: 1$$
La formula minima è $\mathrm{CH_2O}$: è la composizione del glucosio, ma anche dell'acido acetico e del metanale.
```

```ad-example
Esempio 4: quando serve moltiplicare
Un ossido di ferro contiene $69{,}9\%$ di ferro e $30{,}1\%$ di ossigeno. Qual è la sua formula minima?

Le moli di atomi in $100\ \mathrm{g}$:
$$\mathrm{Fe}: \frac{69{,}9}{55{,}85} = 1{,}252 \qquad \mathrm{O}: \frac{30{,}1}{16{,}00} = 1{,}881$$
Dividendo per $1{,}252$ si trova $\mathrm{Fe}: 1$ e $\mathrm{O}: 1{,}503$. Il rapporto $1 : 1{,}5$ non è fatto di interi, e non si arrotonda: si moltiplica per $2$, e diventa $2 : 3$. La formula minima è $\mathrm{Fe_2O_3}$, l'ossido di ferro della ruggine.

Con la magnetite, un altro ossido di ferro, con $72{,}4\%$ di ferro, gli stessi passi danno $\mathrm{Fe}: 1$ e $\mathrm{O}: 1{,}331$: il quoziente finisce in $0{,}33$, si moltiplica per $3$, e la formula minima è $\mathrm{Fe_3O_4}$.
```

```ad-warning
Arrotondare 1,5 o 1,33 all'intero più vicino
Dall'esempio 4, arrotondare $1{,}503$ a $2$ dà $\mathrm{FeO_2}$, arrotondarlo a $1$ dà $\mathrm{FeO}$: tutte e due le formule sono sbagliate. Si arrotonda solo quando lo scarto dall'intero è di qualche centesimo; con $1{,}5$, $1{,}33$, $1{,}25$ si moltiplica.
```

```ad-warning
Usare le percentuali come se fossero atomi
Il rapporto tra le percentuali non è il rapporto tra gli atomi. Nell'esempio 2, $69{,}6 : 30{,}4$ fa circa $2{,}3$, e porterebbe a una formula sbagliata: prima di confrontare, ogni massa va divisa per la massa atomica del suo elemento.
```

```ad-warning
Arrotondare troppo presto
Le moli dei passaggi vanno tenute con tre o quattro cifre. Se nell'esempio 4 si arrotondano le moli di ferro e di ossigeno a $1{,}3$ e $1{,}9$, il quoziente diventa $1{,}46$, e non si capisce più se sia $1{,}5$.
```

I dati possono anche essere le masse di un campione, senza passare dalle percentuali: il procedimento è lo stesso, dal passo 2.

```ad-example
Esempio 5: dalle masse di un campione
Un campione di $5{,}00\ \mathrm{g}$ di un composto di fosforo e ossigeno contiene $2{,}18\ \mathrm{g}$ di fosforo e $2{,}82\ \mathrm{g}$ di ossigeno. Qual è la sua formula minima?

$$\mathrm{P}: \frac{2{,}18}{30{,}97} = 0{,}07039\ \mathrm{mol} \qquad \mathrm{O}: \frac{2{,}82}{16{,}00} = 0{,}1763\ \mathrm{mol}$$
Dividendo per $0{,}07039$: $\mathrm{P}: 1$, $\mathrm{O}: 2{,}504$. Il quoziente finisce in $0{,}5$: moltiplicando per $2$ si ha $2 : 5$, e la formula minima è $\mathrm{P_2O_5}$.
```

Nella figura qui sotto scegli un composto: la barra in alto mostra la sua composizione in massa, quella sotto il rapporto tra gli atomi, e i passi del procedimento compaiono uno alla volta, dalle percentuali alla formula minima.

```interattivo
% nome: composizione-formula-minima
% alt: Una barra divisa in segmenti colorati, uno per elemento, con la percentuale in massa di ciascuno, e sotto una seconda barra divisa secondo il numero di atomi. Si sceglie il composto (glucosio, acqua ossigenata, benzene, ossido di ferro, magnetite, anidride fosforica) e con un bottone si avanza nei passi: i grammi in 100 g, le moli di atomi, la divisione per il numero più piccolo, la moltiplicazione per rendere interi gli indici, fino alla formula minima e al confronto con la formula molecolare
```

## Dalla formula minima alla formula molecolare

La formula molecolare contiene un numero intero di volte la formula minima: $\mathrm{C_6H_{12}O_6}$ è $6$ volte $\mathrm{CH_2O}$. Lo stesso vale per la massa molare, che è lo stesso numero di volte la massa della formula minima. Per trovare la formula molecolare serve quindi la massa molare $M$ del composto, che si misura, per esempio, dalla densità del gas (vedi [Il volume molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/il-volume-molare)):

1. Calcola la massa della formula minima, $M_{\text{min}}$, come una massa molare.
2. Dividi: il numero di unità della formula minima in una molecola è
$$n = \frac{M}{M_{\text{min}}}$$
che deve venire intero, a meno degli arrotondamenti.
3. Moltiplica per $n$ tutti gli indici della formula minima.

```ad-example
Esempio 6: l'ossido di azoto, per intero
La massa molare del composto degli esempi 1 e 2 è $92{,}0\ \mathrm{g/mol}$. Qual è la sua formula molecolare?

La formula minima $\mathrm{NO_2}$ ha massa $14{,}01 + 2 \cdot 16{,}00 = 46{,}01\ \mathrm{g/mol}$, quindi
$$n = \frac{92{,}0}{46{,}01} = 2{,}00$$
e la formula molecolare è $\mathrm{N_2O_4}$, il tetrossido di diazoto.
```

```ad-example
Esempio 7: il benzene
Il benzene contiene $92{,}3\%$ di carbonio e $7{,}7\%$ di idrogeno, e la sua massa molare è $78{,}1\ \mathrm{g/mol}$. Qual è la sua formula molecolare?

Le moli di atomi in $100\ \mathrm{g}$ sono $92{,}3 / 12{,}01 = 7{,}685$ di carbonio e $7{,}7 / 1{,}01 = 7{,}624$ di idrogeno: il rapporto è $1 : 1$, e la formula minima è $\mathrm{CH}$, di massa $12{,}01 + 1{,}01 = 13{,}02\ \mathrm{g/mol}$. Quindi
$$n = \frac{78{,}1}{13{,}02} = 6{,}00$$
e la formula molecolare è $\mathrm{C_6H_6}$. L'etino (acetilene), il gas delle fiamme ossiacetileniche, ha la stessa composizione e la stessa formula minima, ma massa molare $26{,}0\ \mathrm{g/mol}$: la sua formula è $\mathrm{C_2H_2}$.

```molecole
% nome: formula-minima-ch-etino-benzene
% alt: Due molecole con la stessa formula minima CH, in formula di struttura: l'etino, due carboni uniti da un triplo legame con un idrogeno ciascuno, e il benzene, un anello di sei carboni con un idrogeno ciascuno
% svg: formula-minima-ch-etino-benzene-2fbd3764.svg 324x168
colonne: 2
C#C | etino, C2H2 | idrogeni: tutti | carboni: si
c1ccccc1 | benzene, C6H6 | idrogeni: tutti | carboni: si
```
```

Con l'esempio 5 la massa molare misurata dell'ossido di fosforo è circa $284\ \mathrm{g/mol}$, e la formula minima $\mathrm{P_2O_5}$ ha massa $141{,}94\ \mathrm{g/mol}$: $n = 2$, e la molecola è $\mathrm{P_4O_{10}}$. Il nome tradizionale, anidride fosforica, e la formula $\mathrm{P_2O_5}$ che si trova spesso sui libri vengono dalla formula minima.

```ad-warning
Dividere la massa molare per un indice
Il numero $n$ si trova dividendo la massa molare del composto per la massa di tutta la formula minima, non per la massa di un solo atomo: nell'esempio 6, $92{,}0 / 14{,}01$ farebbe $6{,}6$, che non ha senso. Se $n$ non viene vicino a un intero, c'è un errore nella formula minima o nei conti.
```
