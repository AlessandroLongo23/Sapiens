# L'equilibrio termico e il calorimetro

Un caffè bollente lasciato sul tavolo si raffredda, una bibita presa dal frigorifero si scalda, e dopo un po' tutti e due hanno la temperatura della stanza. Quando due corpi a temperature diverse si toccano, il calore passa dal più caldo al più freddo finché le temperature diventano uguali. Questa lezione spiega come si calcola la temperatura finale, e come la stessa idea, dentro un recipiente isolato che si chiama calorimetro, permette di misurare il calore specifico di un materiale.

## L'equilibrio termico

Due corpi a temperature diverse, messi a contatto, si scambiano calore: il corpo più caldo cede energia e si raffredda, quello più freddo la assorbe e si scalda. Lo scambio continua finché i due corpi raggiungono la stessa temperatura, e da quel momento si ferma. Due corpi alla stessa temperatura, che a contatto non si scambiano calore, sono in **equilibrio termico**, e la temperatura comune è la **temperatura di equilibrio** $t_e$.

```tikz
% nome: due-corpi-contatto-calore
% alt: Due blocchi a contatto: quello a sinistra, rosato, è a 80 gradi Celsius, quello a destra, azzurro, è a 20 gradi Celsius. Una freccia arancione sopra il punto di contatto, con la lettera Q, va dal blocco caldo a quello freddo: il calore passa dal corpo più caldo al più freddo
% svg: due-corpi-contatto-calore-d1a985dd.svg 216x96
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=red!15] (0.5,0) rectangle (2.5,1.3);
\draw[thick, fill=blue!10] (2.5,0) rectangle (4.5,1.3);
\node at (1.5,0.65) {$t_1 = 80\,^\circ$C};
\node at (3.5,0.65) {$t_2 = 20\,^\circ$C};
\draw[-{Stealth}, thick, orange!90!black] (1.9,1.75) -- (3.1,1.75) node[midway, above] {$Q$};
\end{tikzpicture}
```

Il passaggio va sempre dal corpo a temperatura più alta a quello a temperatura più bassa, mai al contrario, e non conta quale dei due ha più energia: un secchio d'acqua tiepida contiene molta più energia di un chiodo rovente, ma se ci si butta il chiodo è il chiodo a cedere calore all'acqua. È anche il motivo per cui un [termometro](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche) misura la temperatura di un corpo: lasciato a contatto abbastanza a lungo, raggiunge l'equilibrio termico con il corpo, e la temperatura che segna è la sua.

```ad-note
Il principio zero
Se due corpi sono tutti e due in equilibrio termico con un terzo, sono in equilibrio termico anche tra loro. Sembra ovvio, ma è una legge dell'esperienza, e ha un nome: principio zero della termodinamica. È quello che rende affidabile il termometro, che fa da terzo corpo.
```

## Il calore ceduto è uguale al calore assorbito

Il calore che un corpo scambia mentre la sua temperatura cambia si calcola come nella lezione [Calore, capacità termica e calore specifico](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico):

$$Q = c\,m\,\Delta t$$

con $c$ il calore specifico della sostanza, $m$ la massa e $\Delta t$ la variazione di temperatura. Se i due corpi sono isolati dall'ambiente, cioè non scambiano calore con l'aria, con il tavolo o con il recipiente, l'energia non si perde e non si crea: tutto il calore ceduto dal corpo caldo è assorbito dal corpo freddo. Con il corpo $1$ caldo, alla temperatura iniziale $t_1$, e il corpo $2$ freddo, a $t_2$:

$$c_1\,m_1\,(t_1 - t_e) = c_2\,m_2\,(t_e - t_2)$$

A sinistra c'è il calore ceduto dal corpo caldo, che passa da $t_1$ a $t_e$; a destra il calore assorbito dal corpo freddo, che passa da $t_2$ a $t_e$. Scritte così, le due differenze di temperatura sono positive, e lo sono anche i due calori.

```ad-note
Con i segni
Con la convenzione della lezione sul calore, $\Delta t$ uguale alla temperatura finale meno quella iniziale per tutti e due i corpi, il calore assorbito viene positivo, quello ceduto negativo, e la somma dei due è zero, $Q_1 + Q_2 = 0$, cioè $c_1\,m_1\,(t_e - t_1) + c_2\,m_2\,(t_e - t_2) = 0$. È la stessa equazione, con il primo termine cambiato di segno.
```

## La temperatura di equilibrio

L'uguaglianza dei calori è un'[equazione di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere) nell'incognita $t_e$. Si moltiplica, si portano i termini con $t_e$ da una parte e gli altri dall'altra:

$$c_1\,m_1\,t_1 + c_2\,m_2\,t_2 = (c_1\,m_1 + c_2\,m_2)\,t_e$$

e quindi

$$t_e = \frac{c_1\,m_1\,t_1 + c_2\,m_2\,t_2}{c_1\,m_1 + c_2\,m_2}$$

I prodotti $c_1 m_1$ e $c_2 m_2$ sono le capacità termiche dei due corpi: la temperatura di equilibrio è una media delle due temperature iniziali, in cui ogni temperatura pesa quanto la capacità termica del suo corpo. Per questo $t_e$ sta sempre tra $t_1$ e $t_2$, ed è più vicina alla temperatura del corpo con la capacità termica più grande.

Quando i due corpi sono della stessa sostanza, per esempio due quantità d'acqua, il calore specifico è lo stesso e si semplifica:

$$t_e = \frac{m_1\,t_1 + m_2\,t_2}{m_1 + m_2}$$

Con due masse uguali la temperatura di equilibrio è la media delle due temperature.

```ad-example
Esempio 1: acqua calda e acqua fredda
In una vasca si versano $2{,}0\,\text{kg}$ d'acqua a $80\,^\circ\text{C}$ e $3{,}0\,\text{kg}$ d'acqua a $20\,^\circ\text{C}$. Trascurando il calore scambiato con la vasca e con l'aria, a quale temperatura arriva l'acqua?

La sostanza è la stessa, quindi il calore specifico si semplifica:

$$t_e = \frac{m_1\,t_1 + m_2\,t_2}{m_1 + m_2} = \frac{2{,}0\,\text{kg} \cdot 80\,^\circ\text{C} + 3{,}0\,\text{kg} \cdot 20\,^\circ\text{C}}{2{,}0\,\text{kg} + 3{,}0\,\text{kg}} = \frac{220}{5{,}0}\,^\circ\text{C} = 44\,^\circ\text{C}$$

Controllo: $44\,^\circ\text{C}$ sta tra $20$ e $80\,^\circ\text{C}$, più vicino a $20\,^\circ\text{C}$, perché l'acqua fredda è di più.
```

```ad-example
Esempio 2: un pezzo di ferro nell'acqua
Un pezzo di ferro di $0{,}200\,\text{kg}$, a $150\,^\circ\text{C}$, viene immerso in $0{,}500\,\text{kg}$ d'acqua a $20{,}0\,^\circ\text{C}$. Il calore specifico del ferro è $449\,\text{J/(kg}\cdot{}^\circ\text{C)}$, quello dell'acqua $4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$. Quale temperatura raggiungono?

Le capacità termiche sono $c_1 m_1 = 449 \cdot 0{,}200\,\text{J/}^\circ\text{C} = 89{,}8\,\text{J/}^\circ\text{C}$ per il ferro e $c_2 m_2 = 4186 \cdot 0{,}500\,\text{J/}^\circ\text{C} = 2093\,\text{J/}^\circ\text{C}$ per l'acqua. Allora

$$t_e = \frac{89{,}8 \cdot 150 + 2093 \cdot 20{,}0}{89{,}8 + 2093}\,^\circ\text{C} = \frac{55\,330}{2182{,}8}\,^\circ\text{C} = 25{,}34\ldots\,^\circ\text{C} \approx 25{,}3\,^\circ\text{C}$$

Il ferro si raffredda di quasi $125\,^\circ\text{C}$, l'acqua si scalda di poco più di $5\,^\circ\text{C}$: il calore scambiato è lo stesso, circa $1{,}12 \cdot 10^4\,\text{J}$, ma la capacità termica dell'acqua è più di venti volte quella del ferro.
```

```ad-warning
La media semplice delle temperature
La temperatura di equilibrio è la media delle due temperature solo se le capacità termiche $c\,m$ sono uguali. Nell'esempio 2 la media di $150$ e $20{,}0\,^\circ\text{C}$ sarebbe $85\,^\circ\text{C}$, lontanissima dai $25{,}3\,^\circ\text{C}$ veri. Un controllo che non costa niente: $t_e$ deve stare tra le due temperature iniziali, e più vicina a quella del corpo con $c\,m$ più grande.
```

```ad-warning
Le unità dei dati
Nella formula di $t_e$ le masse compaiono sopra e sotto, e si possono lasciare in grammi purché siano tutte in grammi. Quando invece si calcola un calore, $Q = c\,m\,\Delta t$, con $c$ in $\text{J/(kg}\cdot{}^\circ\text{C)}$, la massa va in chilogrammi: $500\,\text{g}$ d'acqua sono $0{,}500\,\text{kg}$, e scrivere $500$ dà un calore mille volte troppo grande.
```

Nella figura qui sotto scegli il materiale, la massa e la temperatura iniziale di due corpi, poi li metti a contatto: le due temperature si avvicinano fino alla temperatura di equilibrio, e il grafico accanto mostra come cambiano nel tempo.

```interattivo
% nome: equilibrio-termico-due-corpi
% alt: Due blocchi appoggiati uno accanto all'altro, colorati dal rosso al blu secondo la temperatura, con un grafico della temperatura nel tempo accanto. Per ciascun blocco si scelgono il materiale (acqua, alluminio, ferro, rame, piombo), la massa e la temperatura iniziale; un bottone li mette a contatto e le due temperature si avvicinano fino alla temperatura di equilibrio, segnata sul grafico con una linea tratteggiata. Sotto si leggono le capacità termiche, la temperatura di equilibrio calcolata con la formula e il calore scambiato
```

## Il calorimetro delle mescolanze

Le formule precedenti valgono solo se i due corpi non scambiano calore con nient'altro. Per avvicinarsi a questa condizione si usa il **calorimetro delle mescolanze**: un recipiente che isola il suo contenuto dall'ambiente, come un thermos, con un coperchio isolante, un termometro e un agitatore, un'asticella che si muove su e giù per mescolare l'acqua, in modo che la temperatura sia la stessa in ogni punto.

```tikz
% nome: calorimetro-delle-mescolanze
% alt: Un calorimetro in sezione: un recipiente interno con l'acqua, dentro un recipiente esterno, con uno spazio vuoto tra le due pareti; sopra, un coperchio isolante attraversato da un termometro e dall'agitatore, un'asta che termina con un anello nell'acqua. Nell'acqua è immerso un campione appeso a un filo
% svg: calorimetro-delle-mescolanze-4b2f01ad.svg 251x195
\begin{tikzpicture}
\fill[cyan!20] (0.35,0.35) rectangle (3.65,2.4);
\draw[thin] (0.35,2.4) -- (3.65,2.4);
\draw[thick] (0,3.2) -- (0,0) -- (4,0) -- (4,3.2);
\draw[thick] (0.35,3.2) -- (0.35,0.35) -- (3.65,0.35) -- (3.65,3.2);
\draw[thick, fill=gray!20] (-0.15,3.2) rectangle (4.15,3.6);
\draw (0.75,4.2) -- (0.75,0.8);
\draw (0.5,0.8) -- (1.0,0.8);
\draw (0.55,4.2) -- (0.95,4.2);
\draw[thick, fill=white] (1.3,1.0) rectangle (1.5,4.6);
\fill[red!40] (1.35,1.0) rectangle (1.45,2.2);
\draw[thick, fill=red!40] (1.4,0.95) circle (0.16);
\draw (2.45,3.2) -- (2.45,1.9);
\draw[thick, fill=gray!40] (2.2,1.1) rectangle (2.7,1.9);
\draw[thin] (4.25,2.1) -- (3.4,2.1);
\node[right] at (4.3,2.1) {\small acqua};
\draw[thin] (4.25,1.3) -- (2.75,1.3);
\node[right] at (4.3,1.3) {\small campione};
\draw[thin] (4.25,0.17) -- (3.8,0.17);
\node[right] at (4.3,0.17) {\small vuoto};
\node[right] at (4.3,3.4) {\small coperchio};
\node[above] at (1.4,4.6) {\small termometro};
\node[above left] at (0.85,4.2) {\small agitatore};
\end{tikzpicture}
```

Nella misura, il corpo caldo è di solito un campione di metallo scaldato in acqua bollente, e il corpo freddo è l'acqua del calorimetro. Si mette il campione nell'acqua, si chiude, si agita, e si legge il termometro finché la temperatura smette di salire: quella è la temperatura di equilibrio.

## L'equivalente in acqua

Anche il recipiente interno del calorimetro, l'agitatore e il termometro si scaldano insieme all'acqua, e assorbono una parte del calore ceduto dal campione. Il loro effetto si mette nei conti con l'**equivalente in acqua** $m_{eq}$ del calorimetro: la massa d'acqua che, scaldandosi, assorbirebbe lo stesso calore delle parti del calorimetro. In altre parole, la capacità termica del calorimetro è quella di $m_{eq}$ chilogrammi d'acqua:

$$C_{cal} = c_{acqua}\,m_{eq}$$

Nei conti si somma allora $m_{eq}$ alla massa d'acqua contenuta: è come se nel calorimetro ci fosse l'acqua $m_{acqua} + m_{eq}$, senza recipiente. L'equivalente in acqua si misura una volta per tutte con un'altra mescolanza, di acqua calda e fredda, di cui si conoscono tutte le temperature.

```ad-example
Esempio 3: misurare l'equivalente in acqua
Un calorimetro contiene $200\,\text{g}$ d'acqua a $20{,}0\,^\circ\text{C}$. Si versano $100\,\text{g}$ d'acqua a $60{,}0\,^\circ\text{C}$, e la temperatura di equilibrio è $32{,}5\,^\circ\text{C}$. Quanto vale l'equivalente in acqua del calorimetro?

Senza il calorimetro l'acqua arriverebbe a $(200 \cdot 20{,}0 + 100 \cdot 60{,}0)/300\,^\circ\text{C} = 33{,}3\,^\circ\text{C}$: la temperatura misurata è più bassa, perché una parte del calore è andata al recipiente. Il calore ceduto dall'acqua calda è assorbito dall'acqua fredda e dal calorimetro, cioè da $200\,\text{g} + m_{eq}$ d'acqua; il calore specifico è sempre quello dell'acqua e si semplifica:

$$100\,\text{g} \cdot (60{,}0 - 32{,}5)\,^\circ\text{C} = (200\,\text{g} + m_{eq}) \cdot (32{,}5 - 20{,}0)\,^\circ\text{C}$$

$$200\,\text{g} + m_{eq} = \frac{100 \cdot 27{,}5}{12{,}5}\,\text{g} = 220\,\text{g} \qquad m_{eq} = 20\,\text{g}$$

Il calorimetro si comporta come $20\,\text{g}$ d'acqua in più.
```

```ad-warning
L'equivalente in acqua va con l'acqua fredda
Il calorimetro è alla temperatura dell'acqua che contiene all'inizio, e si scalda con lei: $m_{eq}$ si somma alla massa d'acqua del calorimetro, non a quella del campione o dell'acqua calda che si aggiunge.
```

## Misurare un calore specifico

Con il calorimetro si misura il calore specifico $c_x$ di un materiale. I passi:

1. Si pesano l'acqua del calorimetro, $m_a$, e il campione, $m_x$; si legge la temperatura dell'acqua, $t_a$.
2. Si scalda il campione a una temperatura nota $t_x$, per esempio lasciandolo qualche minuto in acqua che bolle, a circa $100\,^\circ\text{C}$.
3. Si mette il campione nel calorimetro, si chiude, si agita, e si legge la temperatura di equilibrio $t_e$.
4. Il calore ceduto dal campione è uguale a quello assorbito dall'acqua e dal calorimetro:

$$c_x\,m_x\,(t_x - t_e) = c_{acqua}\,(m_a + m_{eq})\,(t_e - t_a)$$

5. Si ricava il calore specifico:

$$c_x = \frac{c_{acqua}\,(m_a + m_{eq})\,(t_e - t_a)}{m_x\,(t_x - t_e)}$$

Il valore trovato si confronta con una tabella dei calori specifici, e può dire di che materiale è fatto il campione.

```ad-example
Esempio 4: di che metallo è il campione?
Nel calorimetro dell'esempio 3, con $m_{eq} = 20\,\text{g}$, ci sono $200\,\text{g}$ d'acqua a $20{,}0\,^\circ\text{C}$. Un campione di metallo di $150\,\text{g}$, tolto dall'acqua bollente a $100{,}0\,^\circ\text{C}$, viene immerso nel calorimetro, e la temperatura di equilibrio è $24{,}7\,^\circ\text{C}$. Quanto vale il calore specifico del metallo?

Le masse vanno in chilogrammi, perché il calore specifico dell'acqua è in $\text{J/(kg}\cdot{}^\circ\text{C)}$. Il calore assorbito dall'acqua e dal calorimetro è

$$Q = 4186 \cdot (0{,}200 + 0{,}020) \cdot (24{,}7 - 20{,}0)\,\text{J} = 4328\,\text{J}$$

e il campione ha ceduto lo stesso calore raffreddandosi di $100{,}0 - 24{,}7 = 75{,}3\,^\circ\text{C}$:

$$c_x = \frac{4328\,\text{J}}{0{,}150\,\text{kg} \cdot 75{,}3\,^\circ\text{C}} = 383{,}1\ldots\,\text{J/(kg}\cdot{}^\circ\text{C)} \approx 3{,}8 \cdot 10^2\,\text{J/(kg}\cdot{}^\circ\text{C)}$$

Il risultato ha due cifre significative, come la differenza $t_e - t_a = 4{,}7\,^\circ\text{C}$, ed è vicino al calore specifico del rame, $385\,\text{J/(kg}\cdot{}^\circ\text{C)}$. Senza l'equivalente in acqua sarebbe venuto $3{,}5 \cdot 10^2\,\text{J/(kg}\cdot{}^\circ\text{C)}$, un errore del $9\%$.
```

```ad-warning
Le due differenze di temperatura
Nella formula di $c_x$ compaiono due differenze diverse: di quanto si è scaldata l'acqua, $t_e - t_a$, e di quanto si è raffreddato il campione, $t_x - t_e$. Un errore frequente è usare per tutti e due la differenza tra le temperature iniziali, $t_x - t_a$, che non è la variazione di temperatura di nessuno dei due corpi.
```

```ad-tip
Perché conviene poca acqua
Nell'esempio 4 l'acqua si scalda di meno di $5\,^\circ\text{C}$, e un errore di $0{,}1\,^\circ\text{C}$ sulla lettura del termometro è già un errore del $2\%$ sul risultato. Con meno acqua, o con un campione più grande, la differenza $t_e - t_a$ cresce e la misura diventa più precisa, purché l'acqua copra il campione.
```
