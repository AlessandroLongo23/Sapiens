# Incertezza relativa e propagazione delle incertezze

Un millimetro di incertezza sulla lunghezza di una matita è molto; sulla lunghezza di un campo da calcio non è niente. L'incertezza assoluta, da sola, non dice quanto è buona una misura: serve confrontarla con la grandezza misurata, e questo confronto è l'incertezza relativa. Poi c'è un secondo problema. Quasi mai la grandezza che interessa si misura direttamente: l'area di un foglio si calcola da due lati, la velocità da uno spazio e da un tempo, la densità da una massa e da un volume. Le incertezze dei dati passano al risultato, e il modo in cui passano si chiama propagazione delle incertezze.

In questa lezione ogni misura è già scritta nella forma $(\bar{x} \pm \Delta x)$ della lezione [Valore medio e incertezza di una serie di misure](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/valore-medio-e-incertezza-di-una-serie-di-misure), e i risultati si arrotondano con le stesse regole: l'incertezza con una cifra significativa, il valore fino alla stessa posizione decimale.

## L'incertezza relativa

L'**incertezza relativa** (o errore relativo) di una misura $(\bar{x} \pm \Delta x)$ è il rapporto tra l'incertezza assoluta e il valore:

$$\varepsilon = \frac{\Delta x}{\bar{x}}$$

Si legge "epsilon". È il rapporto tra due grandezze con la stessa unità, quindi è un numero puro, senza unità di misura. Moltiplicata per $100$ diventa l'**incertezza percentuale**, $\varepsilon_\% = \varepsilon \cdot 100\%$, come nella lezione di matematica [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali). Di solito basta scriverla con una o due cifre significative.

Più l'incertezza relativa è piccola, più la misura è precisa. Per confrontare la precisione di due misure si confrontano le incertezze relative, non quelle assolute:

- $(10{,}0 \pm 0{,}1)\,\text{cm}$ ha $\varepsilon = \dfrac{0{,}1}{10{,}0} = 0{,}01 = 1\%$;
- $(100{,}00 \pm 0{,}01)\,\text{m}$ ha $\varepsilon = \dfrac{0{,}01}{100{,}00} = 0{,}0001 = 0{,}01\%$.

La seconda ha un'incertezza assoluta di un centimetro, dieci volte quella della prima, ma è cento volte più precisa.

Dall'incertezza relativa si torna a quella assoluta moltiplicando per il valore: $\Delta x = \varepsilon \cdot \bar{x}$. Una massa di $250$ g misurata con l'incertezza del $2\%$ ha $\Delta m = 0{,}02 \cdot 250\,\text{g} = 5$ g, e si scrive $(250 \pm 5)\,\text{g}$.

```ad-example
Esempio 1: quale misura è più precisa?
Il tempo di $10$ oscillazioni di un pendolo è $(12{,}50 \pm 0{,}06)\,\text{s}$; la larghezza di un foglio è $(21{,}0 \pm 0{,}1)\,\text{cm}$. Quale delle due misure è più precisa?

Le incertezze assolute hanno unità diverse e non si confrontano. Le relative sì:

$$\varepsilon_t = \frac{0{,}06\,\text{s}}{12{,}50\,\text{s}} = 0{,}0048 = 0{,}48\% \qquad \varepsilon_l = \frac{0{,}1\,\text{cm}}{21{,}0\,\text{cm}} \approx 0{,}0048 = 0{,}48\%$$

Le due misure sono precise allo stesso modo, circa lo $0{,}5\%$.
```

```ad-warning
Il rapporto rovesciato
L'incertezza relativa è l'incertezza divisa per il valore, $\dfrac{\Delta x}{\bar{x}}$, e per una misura fatta bene è un numero piccolo. Se ti viene più grande di $1$, cioè più del $100\%$, hai diviso il valore per l'incertezza.
```

## Somme e differenze

Due tavoli lunghi $(120{,}4 \pm 0{,}2)\,\text{cm}$ e $(80{,}6 \pm 0{,}2)\,\text{cm}$, messi uno accanto all'altro, sono lunghi $201{,}0$ cm. Quanto è incerta la somma? Nel caso peggiore tutti e due i tavoli sono più lunghi del valore scritto, e la somma arriva a $120{,}6 + 80{,}8 = 201{,}4$ cm; oppure sono tutti e due più corti, e la somma scende a $120{,}2 + 80{,}4 = 200{,}6$ cm. L'incertezza della somma è $0{,}4$ cm, la somma delle due incertezze.

Con una differenza succede lo stesso: il caso peggiore è il primo valore più grande e il secondo più piccolo, o il contrario, e le incertezze si sommano ancora. La regola è quindi:

$$\Delta(a + b) = \Delta a + \Delta b \qquad \Delta(a - b) = \Delta a + \Delta b$$

Nelle somme e nelle differenze si sommano le incertezze assolute. Le grandezze che si sommano hanno la stessa unità, e anche le loro incertezze.

```ad-warning
Nella differenza le incertezze non si sottraggono
$(47 \pm 1)\,\text{mL} - (35 \pm 1)\,\text{mL}$ fa $(12 \pm 2)\,\text{mL}$, non $(12 \pm 0)\,\text{mL}$. Ogni misura aggiunge la sua incertezza, anche quando si sottrae: un risultato non può essere più certo dei dati da cui viene.
```

Quando si moltiplica una misura per un numero esatto, come il $2$ del perimetro o il $10$ delle oscillazioni, anche l'incertezza si moltiplica per quel numero, e l'incertezza relativa non cambia:

$$\Delta(k \cdot a) = k \cdot \Delta a$$

Il tempo di una sola oscillazione del pendolo è un decimo del tempo di dieci: $T = \dfrac{(12{,}50 \pm 0{,}06)\,\text{s}}{10} = (1{,}250 \pm 0{,}006)\,\text{s}$. È per questo che si cronometrano dieci oscillazioni: l'incertezza del cronometro a mano, divisa per dieci, diventa piccola.

```ad-example
Esempio 2: il perimetro di un foglio
I lati di un foglio misurano $a = (29{,}7 \pm 0{,}1)\,\text{cm}$ e $b = (21{,}0 \pm 0{,}1)\,\text{cm}$. Calcola il perimetro con la sua incertezza.

Il perimetro è $P = 2a + 2b = 59{,}4 + 42{,}0 = 101{,}4$ cm. Per l'incertezza, $2a$ ha incertezza $2 \cdot 0{,}1 = 0{,}2$ cm e lo stesso vale per $2b$; nella somma le incertezze si sommano:

$$\Delta P = 0{,}2 + 0{,}2 = 0{,}4\,\text{cm} \qquad P = (101{,}4 \pm 0{,}4)\,\text{cm}$$
```

```ad-example
Esempio 3: il volume per differenza
Per misurare il volume di un sasso lo si immerge in un cilindro graduato con la sensibilità di $1$ mL: l'acqua sale da $V_1 = (35 \pm 1)\,\text{mL}$ a $V_2 = (47 \pm 1)\,\text{mL}$. Quanto vale il volume del sasso? Confronta le incertezze relative.

Il volume del sasso è la differenza $V = V_2 - V_1 = 12$ mL, con $\Delta V = 1 + 1 = 2$ mL: $V = (12 \pm 2)\,\text{mL}$.

Le due letture hanno incertezze relative piccole, $\dfrac{1}{35} \approx 2{,}9\%$ e $\dfrac{1}{47} \approx 2{,}1\%$; il volume del sasso ha $\dfrac{2}{12} \approx 17\%$. La differenza di due valori vicini è un numero piccolo con un'incertezza grande, e l'incertezza relativa esplode. Per misurare meglio serve un sasso più grande o un cilindro più sottile, con una scala più fitta.
```

## Prodotti e quozienti

Per un rettangolo di lati $a$ e $b$ le incertezze dei lati si vedono nella figura. Se i lati sono più lunghi del valore scritto, di $\Delta a$ e di $\Delta b$, l'area cresce di due strisce, una di area $b \cdot \Delta a$ e una di area $a \cdot \Delta b$, più un quadratino d'angolo di area $\Delta a \cdot \Delta b$.

```tikz
% nome: rettangolo-incertezza-area
% alt: Un rettangolo di lati a e b, azzurro; lungo il lato destro una striscia arancione larga Delta a e lungo il lato superiore una striscia arancione alta Delta b, di aree b per Delta a e a per Delta b; nell'angolo in alto a destra un quadratino grigio di area Delta a per Delta b, molto più piccolo delle strisce
% svg: rettangolo-incertezza-area-53ae8ae6.svg 194x118
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (3.6,2.2);
\fill[orange!25] (3.6,0) rectangle (4.0,2.2);
\fill[orange!25] (0,2.2) rectangle (3.6,2.5);
\fill[gray!35] (3.6,2.2) rectangle (4.0,2.5);
\draw[thick] (0,0) rectangle (3.6,2.2);
\draw[dashed] (3.6,2.5) -- (0,2.5) -- (0,2.2);
\draw[dashed] (4.0,0) -- (4.0,2.5) -- (3.6,2.5);
\draw[dashed] (3.6,0) -- (4.0,0);
\node[below] at (1.8,0) {\small $a$};
\node[left] at (0,1.1) {\small $b$};
\node[below] at (3.8,0) {\small $\Delta a$};
\node[right] at (4.0,2.35) {\small $\Delta b$};
\node at (1.8,1.1) {\small $a \cdot b$};
\node[rotate=90] at (3.8,1.1) {\scriptsize $b \cdot \Delta a$};
\node at (1.8,2.35) {\scriptsize $a \cdot \Delta b$};
\end{tikzpicture}
```

Il quadratino d'angolo è il prodotto di due incertezze, due numeri piccoli, e si trascura. L'incertezza dell'area è allora la somma delle due strisce, $\Delta A = b \cdot \Delta a + a \cdot \Delta b$, e dividendo per l'area $A = a \cdot b$ si trova

$$\frac{\Delta A}{A} = \frac{b \cdot \Delta a}{a \cdot b} + \frac{a \cdot \Delta b}{a \cdot b} = \frac{\Delta a}{a} + \frac{\Delta b}{b}$$

L'incertezza relativa del prodotto è la somma delle incertezze relative dei fattori. Per il quoziente vale la stessa regola (qui non la dimostriamo):

$$\varepsilon(a \cdot b) = \varepsilon_a + \varepsilon_b \qquad \varepsilon\!\left(\frac{a}{b}\right) = \varepsilon_a + \varepsilon_b$$

Nei prodotti e nei quozienti si sommano le incertezze relative. Il procedimento ha tre passi:

1. calcola il risultato con i valori medi;
2. calcola le incertezze relative dei dati e sommale: è l'incertezza relativa del risultato;
3. moltiplica l'incertezza relativa per il risultato per avere l'incertezza assoluta, e arrotonda.

Nella figura interattiva cambia i lati e le loro incertezze. Il rettangolo più grande possibile supera l'area $a \cdot b$ delle due strisce più il quadratino; il più piccolo le resta sotto delle due strisce meno il quadratino. L'incertezza della regola, $b \cdot \Delta a + a \cdot \Delta b$, sta nel mezzo, ed è esattamente metà della differenza tra il rettangolo più grande e il più piccolo.

```interattivo
% nome: rettangolo-lati-incerti
% alt: Un rettangolo con i lati a e b regolati da cursori, e due cursori per le incertezze Delta a e Delta b; il rettangolo più grande possibile è tratteggiato fuori, il più piccolo tratteggiato dentro, e le strisce arancioni b per Delta a e a per Delta b con il quadratino d'angolo grigio mostrano di quanto può crescere l'area; sotto si confrontano l'incertezza del caso peggiore e quella della regola, e l'incertezza relativa dell'area con la somma di quelle dei lati
```

```ad-example
Esempio 4: l'area di un foglio
Con i lati $a = (29{,}7 \pm 0{,}1)\,\text{cm}$ e $b = (21{,}0 \pm 0{,}1)\,\text{cm}$, calcola l'area del foglio con la sua incertezza.

L'area è $A = 29{,}7 \cdot 21{,}0 = 623{,}7\ \text{cm}^2$. Le incertezze relative dei lati sono

$$\varepsilon_a = \frac{0{,}1}{29{,}7} \approx 0{,}00337 \qquad \varepsilon_b = \frac{0{,}1}{21{,}0} \approx 0{,}00476$$

e quella dell'area è la loro somma, $\varepsilon_A \approx 0{,}00813$, cioè circa lo $0{,}8\%$. Nei passaggi si tiene qualche cifra in più, e si arrotonda solo alla fine. L'incertezza assoluta è

$$\Delta A = 0{,}00813 \cdot 623{,}7\ \text{cm}^2 \approx 5{,}07\ \text{cm}^2$$

che con una cifra significativa è $5\ \text{cm}^2$. L'incertezza è nelle unità, e l'area si arrotonda alle unità: $A = (624 \pm 5)\ \text{cm}^2$.

Controllo con il caso peggiore: $29{,}8 \cdot 21{,}1 = 628{,}78$ e $29{,}6 \cdot 20{,}9 = 618{,}64$; metà della differenza è $5{,}07\ \text{cm}^2$, lo stesso numero.
```

```ad-example
Esempio 5: la velocità media di un corridore
Un corridore percorre $s = (100{,}0 \pm 0{,}5)\,\text{m}$ in $t = (12{,}5 \pm 0{,}2)\,\text{s}$. Calcola la sua velocità media $v = \dfrac{s}{t}$ con l'incertezza.

Il valore è $v = \dfrac{100{,}0}{12{,}5} = 8{,}0$ m/s. Le incertezze relative sono $\varepsilon_s = \dfrac{0{,}5}{100{,}0} = 0{,}005$ e $\varepsilon_t = \dfrac{0{,}2}{12{,}5} = 0{,}016$; nel quoziente si sommano: $\varepsilon_v = 0{,}021$, il $2{,}1\%$. Quindi

$$\Delta v = 0{,}021 \cdot 8{,}0\,\text{m/s} = 0{,}168\,\text{m/s} \approx 0{,}2\,\text{m/s} \qquad v = (8{,}0 \pm 0{,}2)\,\text{m/s}$$

Quasi tutta l'incertezza viene dal tempo: il $2{,}1\%$ è fatto per $1{,}6$ punti dal cronometro e per $0{,}5$ dal metro.
```

```ad-warning
Nei prodotti non si sommano le incertezze assolute
Nell'esempio 5 sommare $0{,}5$ m e $0{,}2$ s non ha senso: sono grandezze diverse. Anche moltiplicare le incertezze ($0{,}1 \cdot 0{,}1 = 0{,}01\ \text{cm}^2$ per l'area del foglio) dà un numero sbagliato, perché è solo il quadratino d'angolo. Nei prodotti e nei quozienti si passa sempre dalle incertezze relative.
```

## Le potenze

Una potenza è un prodotto di fattori uguali: il volume di un cubo di spigolo $l$ è $V = l^3 = l \cdot l \cdot l$. Per la regola del prodotto l'incertezza relativa del volume è $\varepsilon_l + \varepsilon_l + \varepsilon_l = 3\,\varepsilon_l$. In generale, per l'esponente $n$:

$$\varepsilon(a^n) = n \cdot \varepsilon_a$$

L'area di un quadrato ha il doppio dell'incertezza relativa del lato, il volume di un cubo il triplo.

```ad-example
Esempio 6: la densità di un cubetto di metallo
Un cubetto di metallo ha lo spigolo $l = (3{,}0 \pm 0{,}1)\,\text{cm}$ e la massa $m = (72{,}9 \pm 0{,}1)\,\text{g}$. Calcola il volume e la densità $\rho = \dfrac{m}{V}$ (la densità è nella lezione [Grandezze derivate: area, volume e densità](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-derivate-area-volume-e-densita)). Il cubetto può essere di alluminio, che ha la densità di $2{,}70\ \text{g/cm}^3$?

Il volume è $V = 3{,}0^3 = 27{,}0\ \text{cm}^3$. L'incertezza relativa dello spigolo è $\varepsilon_l = \dfrac{0{,}1}{3{,}0} \approx 0{,}033$, e quella del volume è il triplo, $\varepsilon_V = 0{,}10$: il $10\%$. Quindi $\Delta V = 0{,}10 \cdot 27{,}0 = 2{,}7\ \text{cm}^3 \approx 3\ \text{cm}^3$, e $V = (27 \pm 3)\ \text{cm}^3$.

La densità è $\rho = \dfrac{72{,}9}{27{,}0} = 2{,}7\ \text{g/cm}^3$, con incertezza relativa

$$\varepsilon_\rho = \varepsilon_m + \varepsilon_V = \frac{0{,}1}{72{,}9} + 0{,}10 \approx 0{,}0014 + 0{,}10 \approx 0{,}10$$

e $\Delta\rho = 0{,}10 \cdot 2{,}7 \approx 0{,}27\ \text{g/cm}^3$, che con una cifra significativa è $0{,}3\ \text{g/cm}^3$. Il risultato è $\rho = (2{,}7 \pm 0{,}3)\ \text{g/cm}^3$.

L'intervallo va da $2{,}4$ a $3{,}0\ \text{g/cm}^3$ e contiene $2{,}70$: la misura è compatibile con l'alluminio. Con un'incertezza del $10\%$ è però compatibile anche con altri materiali; per distinguerli bisognerebbe misurare lo spigolo con il calibro, perché è lo spigolo, elevato al cubo, a pesare di più.
```

```ad-warning
L'esponente moltiplica l'incertezza relativa
Per $V = l^3$ l'incertezza relativa è $3\,\varepsilon_l$, non $\varepsilon_l$, e nemmeno $\varepsilon_l^3$. Allo stesso modo non si eleva al cubo l'incertezza assoluta: $0{,}1^3 = 0{,}001\ \text{cm}^3$ darebbe al volume del cubetto una precisione che non ha.
```

## Riepilogo delle regole

| Operazione | Incertezza del risultato |
|---|---|
| $a + b$, $a - b$ | $\Delta a + \Delta b$ (si sommano le assolute) |
| $k \cdot a$, con $k$ esatto | $k \cdot \Delta a$ |
| $a \cdot b$, $\dfrac{a}{b}$ | $\varepsilon_a + \varepsilon_b$ (si sommano le relative) |
| $a^n$ | $n \cdot \varepsilon_a$ |

Il dato con l'incertezza relativa più grande è quello che pesa di più sul risultato: per migliorare una misura conviene misurare meglio quello, come lo spigolo del cubetto o il tempo del corridore.

```ad-note
Una regola più fine
Queste regole danno il caso peggiore, con tutti gli errori nello stesso verso. Quando le incertezze vengono da errori casuali indipendenti è raro che vadano tutte nel verso peggiore, e all'università si usa una regola che dà incertezze un po' più piccole (la somma "in quadratura", $\sqrt{\varepsilon_a^2 + \varepsilon_b^2}$). Nel biennio si usano le regole di questa lezione.
```
