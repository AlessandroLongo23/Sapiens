# Rapporti, proporzioni e percentuali

Una ricetta per $4$ persone da adattare a $6$, la distanza vera tra due paesi misurata su una cartina, il prezzo di una maglietta scontata del $20\%$: sono tutti conti con rapporti, proporzioni e percentuali. Sono divisioni e moltiplicazioni tra frazioni, quelle di [Operazioni in ℚ](/materiale/scuola-superiore/matematica/numeri-razionali/operazioni-in-q), organizzate in modo da non sbagliare l'ordine dei numeri.

## Il rapporto tra due numeri

Il **rapporto** tra due numeri $a$ e $b$, con $b \neq 0$, è il quoziente della divisione di $a$ per $b$:

$$a : b = \dfrac{a}{b}$$

Il primo numero, $a$, si chiama **antecedente**; il secondo, $b$, si chiama **conseguente**. Il rapporto si scrive di solito come frazione ridotta ai minimi termini.

```ad-example
Esempio 1: rapporto tra 12 e 18
$$12 : 18 = \dfrac{12}{18} = \dfrac{2}{3}$$

L'antecedente è $12$, il conseguente è $18$. Il rapporto $\dfrac{2}{3}$ dice che $12$ è i due terzi di $18$.
```

L'ordine conta: il rapporto tra $18$ e $12$ è $\dfrac{18}{12} = \dfrac{3}{2}$, il reciproco di quello di prima.

```ad-warning
Scambiare antecedente e conseguente
"Il rapporto tra $a$ e $b$" è $\dfrac{a}{b}$, con il primo numero nominato al numeratore. Il rapporto tra $12$ e $18$ è $\dfrac{2}{3}$, non $\dfrac{3}{2}$.
```

I termini di un rapporto possono essere anche frazioni o numeri decimali: il conto è sempre una divisione, e il risultato si scrive come frazione ridotta.

```ad-example
Esempio 2: rapporti tra frazioni e tra decimali
Tra $\dfrac{3}{4}$ e $\dfrac{9}{8}$ si moltiplica il primo per il reciproco del secondo:

$$\dfrac{3}{4} : \dfrac{9}{8} = \dfrac{3}{4} \cdot \dfrac{8}{9} = \dfrac{2}{3}$$

Con i decimali conviene passare alle frazioni, come in [Numeri decimali e frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/numeri-decimali-e-frazioni), oppure moltiplicare entrambi i termini per la stessa potenza di $10$, che non cambia il quoziente:

$$0{,}6 : 1{,}5 = 6 : 15 = \dfrac{6}{15} = \dfrac{2}{5}$$
```

### Il rapporto tra due grandezze

Due grandezze della stessa specie (due lunghezze, due masse, due prezzi) si dicono **omogenee**. Il rapporto tra due grandezze omogenee si calcola dopo averle espresse nella stessa unità di misura, ed è un numero senza unità.

```ad-example
Esempio 3: 45 cm e 3 m
Prima si porta tutto in centimetri: $3$ m $= 300$ cm. Poi

$$45 : 300 = \dfrac{45}{300} = \dfrac{3}{20}$$

La prima lunghezza è i tre ventesimi della seconda.
```

```ad-warning
Dimenticare di cambiare unità
Il rapporto tra $45$ cm e $3$ m non è $\dfrac{45}{3} = 15$: la prima lunghezza è molto più corta della seconda, quindi il rapporto deve essere minore di $1$. Prima si esprimono le due grandezze nella stessa unità.
```

Anche due grandezze non omogenee hanno un rapporto, ma il risultato ha un'unità di misura che nasce dalle due. Un'auto che percorre $150$ km in $2$ ore ha una velocità media di $150 : 2 = 75$ km/h; se $3$ kg di mele costano $7{,}20$ €, il prezzo al chilo è $7{,}20 : 3 = 2{,}40$ €/kg.

## Le proporzioni

Dati quattro numeri $a$, $b$, $c$, $d$, tutti diversi da zero, si dice che formano una **proporzione** quando il rapporto tra i primi due è uguale al rapporto tra gli altri due:

$$a : b = c : d$$

Si legge "$a$ sta a $b$ come $c$ sta a $d$". Il primo e l'ultimo termine, $a$ e $d$, sono gli **estremi**; i due in mezzo, $b$ e $c$, sono i **medi**.

```ad-example
Esempio: 6 : 8 = 9 : 12
È una proporzione perché i due rapporti sono uguali: $\dfrac{6}{8} = \dfrac{3}{4}$ e $\dfrac{9}{12} = \dfrac{3}{4}$. Gli estremi sono $6$ e $12$, i medi sono $8$ e $9$.
```

### La proprietà fondamentale

In ogni proporzione il prodotto dei medi è uguale al prodotto degli estremi:

$$a : b = c : d \quad \Longrightarrow \quad b \cdot c = a \cdot d$$

Il motivo: la proporzione dice che $\dfrac{a}{b} = \dfrac{c}{d}$, e moltiplicando i due membri per $b \cdot d$ si ottiene $a \cdot d = c \cdot b$. Nella proporzione $6 : 8 = 9 : 12$, infatti, $8 \cdot 9 = 72$ e $6 \cdot 12 = 72$.

Vale anche il contrario: se quattro numeri diversi da zero hanno $b \cdot c = a \cdot d$, allora $a : b = c : d$ è una proporzione. Per controllare se quattro numeri formano una proporzione basta quindi confrontare i due prodotti, senza ridurre le frazioni.

```ad-example
Esempio: proporzione o no
- $4 : 6 = 10 : 15$ è una proporzione: i medi danno $6 \cdot 10 = 60$, gli estremi $4 \cdot 15 = 60$.
- $3 : 5 = 5 : 8$ non è una proporzione: i medi danno $5 \cdot 5 = 25$, gli estremi $3 \cdot 8 = 24$.
```

## Calcolare il termine incognito

Quando di una proporzione conosci tre termini, il quarto, che si indica con $x$, si trova con la proprietà fondamentale.

1. Scrivi l'uguaglianza tra il prodotto dei medi e il prodotto degli estremi.
2. Dividi i due membri per il numero che moltiplica $x$.
3. Semplifica e controlla il risultato rifacendo i due prodotti.

In pratica, un estremo incognito è uguale al prodotto dei medi diviso l'altro estremo, e un medio incognito è uguale al prodotto degli estremi diviso l'altro medio.

```ad-example
Esempio 1: un estremo incognito
Risolvi $x : 12 = 5 : 4$.

$x$ è un estremo, quindi va con $4$; i medi sono $12$ e $5$:

$$4 \cdot x = 12 \cdot 5 \qquad 4x = 60 \qquad x = \dfrac{60}{4} = 15$$

Controllo: $15 : 12 = \dfrac{5}{4}$ e $5 : 4 = \dfrac{5}{4}$.
```

```ad-warning
Accoppiare i termini sbagliati
I medi sono il secondo e il terzo termine, gli estremi il primo e il quarto. In $x : 12 = 5 : 4$ scrivere $5 \cdot x = 12 \cdot 4$ dà $x = \dfrac{48}{5}$, che è sbagliato: il prodotto giusto è $4 \cdot x = 12 \cdot 5$.
```

```ad-example
Esempio 2: un medio incognito
Risolvi $7 : x = 21 : 9$.

$x$ è un medio, quindi va con $21$; gli estremi sono $7$ e $9$:

$$21 \cdot x = 7 \cdot 9 \qquad 21x = 63 \qquad x = 3$$

Controllo: $7 : 3 = \dfrac{7}{3}$ e $21 : 9 = \dfrac{7}{3}$.
```

```ad-example
Esempio 3: termini negativi
Risolvi $(-3) : x = 9 : (-12)$.

$$9 \cdot x = (-3) \cdot (-12) \qquad 9x = 36 \qquad x = 4$$

Il prodotto degli estremi è positivo, perché i due fattori sono entrambi negativi. Controllo: $(-3) : 4 = -\dfrac{3}{4}$ e $9 : (-12) = -\dfrac{3}{4}$.
```

```ad-example
Esempio 4: termini frazionari
Risolvi $\dfrac{2}{3} : x = \dfrac{4}{5} : \dfrac{6}{7}$.

$$\dfrac{4}{5} \cdot x = \dfrac{2}{3} \cdot \dfrac{6}{7} \qquad \dfrac{4}{5}\,x = \dfrac{4}{7}$$

Per dividere per $\dfrac{4}{5}$ si moltiplica per il reciproco:

$$x = \dfrac{4}{7} \cdot \dfrac{5}{4} = \dfrac{5}{7}$$

Controllo: $\dfrac{2}{3} : \dfrac{5}{7} = \dfrac{14}{15}$ e $\dfrac{4}{5} : \dfrac{6}{7} = \dfrac{28}{30} = \dfrac{14}{15}$.
```

```ad-example
Esempio 5: termini decimali
Risolvi $0{,}4 : 1{,}2 = x : 4{,}5$.

$$1{,}2 \cdot x = 0{,}4 \cdot 4{,}5 \qquad 1{,}2\,x = 1{,}8 \qquad x = \dfrac{1{,}8}{1{,}2} = \dfrac{18}{12} = \dfrac{3}{2} = 1{,}5$$
```

## Le percentuali

Una **percentuale** è un rapporto con conseguente $100$: $p\%$, che si legge "$p$ per cento", vuol dire $\dfrac{p}{100}$. Per questo ogni percentuale si scrive anche come frazione o come numero decimale.

$$25\% = \dfrac{25}{100} = \dfrac{1}{4} = 0{,}25 \qquad 8\% = \dfrac{8}{100} = 0{,}08 \qquad 150\% = \dfrac{150}{100} = 1{,}5$$

Alcune percentuali tornano spesso e conviene riconoscerle come frazioni: $50\% = \dfrac{1}{2}$, $25\% = \dfrac{1}{4}$, $75\% = \dfrac{3}{4}$, $20\% = \dfrac{1}{5}$, $10\% = \dfrac{1}{10}$.

```ad-warning
Spostare la virgola di un posto solo
Per passare da percentuale a decimale si divide per $100$, cioè si sposta la virgola di due posti verso sinistra: $8\% = 0{,}08$, non $0{,}8$, e $0{,}5\% = 0{,}005$.
```

Nei problemi con le percentuali ci sono sempre tre numeri: il totale $T$, la parte $P$ e la percentuale $p$. Sono legati dalla proporzione

$$P : T = p : 100$$

e ogni problema chiede uno dei tre, conoscendo gli altri due. Dalla proporzione, con la proprietà fondamentale, vengono tre formule.

| Cosa cerchi | Formula | Esempio |
|---|---|---|
| La parte | $P = \dfrac{p}{100} \cdot T$ | il $15\%$ di $80$ è $12$ |
| La percentuale | $p = \dfrac{P}{T} \cdot 100$ | $18$ su $24$ è il $75\%$ |
| Il totale | $T = \dfrac{P}{p} \cdot 100$ | se il $30\%$ di $T$ è $12$, $T = 40$ |

```ad-example
Esempio 1: la percentuale di un numero
Quanto è il $15\%$ di $80$?

$$P = \dfrac{15}{100} \cdot 80 = 0{,}15 \cdot 80 = 12$$
```

```ad-example
Esempio 2: trovare la percentuale
In una classe di $24$ studenti, $18$ hanno la sufficienza. Che percentuale è?

$$p = \dfrac{18}{24} \cdot 100 = \dfrac{3}{4} \cdot 100 = 75$$

Hanno la sufficienza il $75\%$ degli studenti. Il risultato non è sempre intero: $3$ studenti su $8$ sono $\dfrac{3}{8} \cdot 100 = 37{,}5$, cioè il $37{,}5\%$.
```

```ad-example
Esempio 3: trovare il totale
Il $30\%$ dei biglietti di un concerto, cioè $12$ biglietti, è stato venduto online. Quanti sono i biglietti in tutto?

Dalla proporzione $12 : T = 30 : 100$:

$$30 \cdot T = 12 \cdot 100 \qquad T = \dfrac{1200}{30} = 40$$
```

```ad-warning
Calcolare la percentuale sul numero sbagliato
"Il $30\%$ di $T$ è $12$" non vuol dire che $T$ sia il $30\%$ di $12$, cioè $3{,}6$: la percentuale si calcola sempre sul totale, e il totale è il numero più grande quando $p$ è minore di $100$.
```

## Aumenti e sconti

Aumentare un prezzo $T$ del $p\%$ vuol dire aggiungergli il $p\%$ di $T$; scontarlo del $p\%$ vuol dire toglierglielo. Raccogliendo $T$, ogni variazione diventa una sola moltiplicazione:

$$\text{aumento del } p\%: \quad T \cdot \left(1 + \dfrac{p}{100}\right) \qquad\qquad \text{sconto del } p\%: \quad T \cdot \left(1 - \dfrac{p}{100}\right)$$

Il numero per cui si moltiplica si chiama **coefficiente** della variazione: un aumento del $12\%$ è una moltiplicazione per $1{,}12$, uno sconto del $15\%$ è una moltiplicazione per $0{,}85$.

```ad-example
Esempio 1: uno sconto e un aumento
Una giacca da $80$ € scontata del $15\%$ costa $80 \cdot 0{,}85 = 68$ €.

Un affitto di $250$ € al mese aumentato del $12\%$ diventa $250 \cdot 1{,}12 = 280$ €. Lo stesso risultato si ottiene in due passi: il $12\%$ di $250$ è $30$, e $250 + 30 = 280$.
```

```ad-example
Esempio 2: il prezzo prima dello sconto
Dopo uno sconto del $20\%$ paghi $48$ €. Quanto costava prima?

Il prezzo scontato è il prezzo iniziale moltiplicato per $0{,}8$, quindi per tornare indietro si divide per $0{,}8$:

$$T \cdot 0{,}8 = 48 \qquad T = \dfrac{48}{0{,}8} = 60$$

Il prezzo iniziale era $60$ €. Controllo: il $20\%$ di $60$ è $12$, e $60 - 12 = 48$.
```

La figura mostra perché si divide: i $48$ € sono l'$80\%$ del prezzo iniziale, non il $100\%$.

```tikz
% nome: sconto-del-venti-per-cento
% alt: Barra del prezzo iniziale divisa in cinque parti da 12 euro, ognuna il 20 per cento: quattro parti, cioè 48 euro, sono il prezzo scontato e una parte è lo sconto
% svg: sconto-del-venti-per-cento-d7bde5ad.svg 383x139
\begin{tikzpicture}
\draw (0,0) rectangle (10,1);
\foreach \x in {2,4,6,8} \draw (\x,0) -- (\x,1);
\foreach \x in {1,3,5,7,9} \node at (\x,0.5) {$12$};
\foreach \x in {1,3,5,7,9} \node[above] at (\x,1) {$20\%$};
\draw[<->] (0,-0.4) -- (8,-0.4);
\node[below] at (4,-0.4) {prezzo scontato: $80\%$, cioè $48$};
\draw[<->] (8,-0.4) -- (10,-0.4);
\node[below] at (9,-0.4) {sconto};
\draw[<->] (0,-1.5) -- (10,-1.5);
\node[below] at (5,-1.5) {prezzo iniziale: $100\%$, cioè $60$};
\end{tikzpicture}
```

```ad-warning
Aggiungere la percentuale al prezzo scontato
Per risalire al prezzo iniziale non si calcola $48 + 20\%$ di $48$, che dà $57{,}60$ €: lo sconto era il $20\%$ del prezzo iniziale, non del prezzo scontato. Si divide per il coefficiente: $48 : 0{,}8 = 60$.
```

Per sapere di quale percentuale è cambiato un valore, si divide la variazione per il valore iniziale:

$$\text{variazione percentuale} = \dfrac{\text{valore finale} - \text{valore iniziale}}{\text{valore iniziale}} \cdot 100$$

```ad-example
Esempio 3: la variazione percentuale
Un abbonamento passa da $40$ € a $46$ €:

$$\dfrac{46 - 40}{40} \cdot 100 = \dfrac{6}{40} \cdot 100 = 15$$

È un aumento del $15\%$. Se invece un prezzo scende da $50$ € a $42$ €, il conto dà $\dfrac{42 - 50}{50} \cdot 100 = -16$: il segno meno indica una diminuzione del $16\%$.
```

### Aumenti e sconti successivi

Quando le variazioni sono due o più, una dopo l'altra, ognuna si calcola sul valore che esce da quella prima. Per questo si moltiplicano i coefficienti, e le percentuali non si sommano.

```ad-example
Esempio 4: due sconti uno dopo l'altro
Un paio di scarpe da $100$ € ha uno sconto del $20\%$ e poi, alla cassa, un ulteriore sconto del $10\%$.

$$100 \cdot 0{,}8 \cdot 0{,}9 = 100 \cdot 0{,}72 = 72$$

Alla fine paghi $72$ €. Il coefficiente complessivo è $0{,}72$, cioè uno sconto totale del $28\%$, non del $30\%$: il secondo sconto si applica a $80$ €, non a $100$ €.
```

```ad-warning
Sommare le percentuali
Un aumento del $10\%$ seguito da uno sconto del $10\%$ non riporta al prezzo di partenza: $1{,}1 \cdot 0{,}9 = 0{,}99$, cioè una diminuzione dell'$1\%$. Due variazioni successive si combinano moltiplicando i coefficienti.
```

```ad-example
Esempio 5: annullare un aumento
Un prezzo aumenta del $25\%$. Di quanto deve scendere per tornare al valore iniziale?

L'aumento moltiplica per $1{,}25 = \dfrac{5}{4}$; per tornare indietro si moltiplica per il reciproco, $\dfrac{4}{5} = 0{,}8$. Serve quindi uno sconto del $20\%$, non del $25\%$. Con numeri: $80$ € diventano $80 \cdot 1{,}25 = 100$ €, e $100 \cdot 0{,}8 = 80$ €.
```

Moltiplicare i coefficienti ha anche un vantaggio: l'ordine delle variazioni non conta. Uno sconto del $10\%$ seguito da un aumento del $10\%$ dà lo stesso $0{,}9 \cdot 1{,}1 = 0{,}99$.

## Problemi con le proporzioni

Molti problemi di tutti i giorni si risolvono con una proporzione: due grandezze che crescono insieme nello stesso rapporto, come gli ingredienti e le persone di una ricetta o i chili e il prezzo, sono direttamente proporzionali. Nella proporzione ogni rapporto mette a confronto due grandezze della stessa specie: persone con persone, grammi con grammi.

```ad-example
Esempio 1: una ricetta
Per $4$ persone servono $300$ g di farina. Quanta ne serve per $6$ persone?

Il rapporto tra le persone è uguale al rapporto tra le quantità di farina: $4 : 6 = 300 : x$.

$$4 \cdot x = 6 \cdot 300 \qquad x = \dfrac{1800}{4} = 450 \text{ g}$$
```

```ad-example
Esempio 2: un prezzo
$3$ kg di mele costano $7{,}20$ €. Quanto costano $5$ kg?

Il rapporto tra i pesi è uguale al rapporto tra i prezzi:

$$3 : 5 = 7{,}20 : x \qquad 3 \cdot x = 5 \cdot 7{,}20 = 36 \qquad x = 12$$

$5$ kg costano $12$ €. Si arriva allo stesso risultato passando dal prezzo al chilo: $7{,}20 : 3 = 2{,}40$ €/kg, e $2{,}40 \cdot 5 = 12$ €.
```

La **scala** di una carta geografica è il rapporto tra una distanza misurata sulla carta e la distanza vera, espresse nella stessa unità. Scala $1 : 25\,000$ vuol dire che $1$ cm sulla carta corrisponde a $25\,000$ cm nella realtà, cioè a $250$ m.

```ad-example
Esempio 3: una cartina in scala 1 : 25 000
Sulla carta due rifugi distano $6$ cm. Quanto distano davvero?

$$1 : 25\,000 = 6 : x \qquad x = 6 \cdot 25\,000 = 150\,000 \text{ cm} = 1{,}5 \text{ km}$$

Al contrario, un sentiero lungo $2$ km, cioè $200\,000$ cm, sulla carta misura $200\,000 : 25\,000 = 8$ cm.
```

```ad-warning
Grandezze che non sono direttamente proporzionali
Se $4$ operai finiscono un lavoro in $6$ giorni, $8$ operai non ci mettono $12$ giorni: raddoppiando gli operai i giorni si dimezzano, e diventano $3$. Operai e giorni sono inversamente proporzionali, e la proporzione $4 : 8 = 6 : x$ qui non vale. Prima di scrivere la proporzione chiediti se, raddoppiando una grandezza, anche l'altra raddoppia. I due tipi di proporzionalità sono nella lezione [Proporzionalità diretta e inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa).
```

### Dividere in parti proporzionali

Un problema classico chiede di dividere un numero in due parti che stiano in un rapporto dato. Il rapporto $3 : 5$ vuol dire che il totale si divide in $3 + 5 = 8$ parti uguali, e la prima quantità ne prende $3$, la seconda $5$.

```ad-example
Esempio 4: 120 euro in rapporto 3 : 5
Due fratelli si dividono $120$ € in modo che le loro quote stiano nel rapporto $3 : 5$.

Le parti uguali sono $3 + 5 = 8$, e ognuna vale $120 : 8 = 15$ €. Il primo fratello riceve $3 \cdot 15 = 45$ €, il secondo $5 \cdot 15 = 75$ €.

Controllo: $45 + 75 = 120$ e $45 : 75 = \dfrac{3}{5}$.

```tikz
% nome: divisione-in-parti-proporzionali
% alt: Barra di 120 euro divisa in otto parti uguali da 15 euro: le prime tre parti, 45 euro, vanno al primo fratello, le altre cinque, 75 euro, al secondo
% svg: divisione-in-parti-proporzionali-8b761803.svg 307x110
\begin{tikzpicture}
\draw (0,0) rectangle (8,1);
\foreach \x in {1,2,4,5,6,7} \draw (\x,0) -- (\x,1);
\draw[very thick] (3,-0.1) -- (3,1.1);
\foreach \x in {0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5} \node at (\x,0.5) {$15$};
\draw[<->] (0,-0.4) -- (3,-0.4);
\node[below] at (1.5,-0.4) {$3$ parti: $45$};
\draw[<->] (3,-0.4) -- (8,-0.4);
\node[below] at (5.5,-0.4) {$5$ parti: $75$};
\draw[<->] (0,1.4) -- (8,1.4);
\node[above] at (4,1.4) {totale: $120$};
\end{tikzpicture}
```
```

```ad-note
La proprietà del comporre
Sui libri lo stesso conto si trova spesso con la proprietà del comporre: se $a : b = c : d$, allora $(a + b) : a = (c + d) : c$. Chiamate $x$ e $y$ le due quote, da $x : y = 3 : 5$ si ottiene $(x + y) : x = (3 + 5) : 3$, cioè $120 : x = 8 : 3$, e quindi $x = \dfrac{120 \cdot 3}{8} = 45$. È il metodo delle parti scritto come proporzione.
```
