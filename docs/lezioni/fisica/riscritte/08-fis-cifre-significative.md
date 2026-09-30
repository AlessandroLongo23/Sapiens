# Le cifre significative

In matematica $12{,}3$ e $12{,}30$ sono lo stesso numero. In fisica no: la misura $12{,}3$ cm dice che la lunghezza è nota fino al millimetro, $12{,}30$ cm che è nota fino al decimo di millimetro, e servono strumenti diversi per ottenerle. Le cifre con cui si scrive una misura dicono quanto la misura è precisa, anche quando l'incertezza non è scritta. Per questo non si scrivono tutte le cifre che dà la calcolatrice, e non si toglie uno zero finale solo perché "non conta".

## Che cosa sono

Le **cifre significative** di una misura sono tutte le cifre certe più la prima cifra incerta, cioè le cifre fino a quella su cui cade l'incertezza. Una misura scritta senza incertezza si intende incerta sull'ultima cifra.

Nella figura lo stesso bastoncino è misurato con due righelli. Il primo ha solo le tacche dei centimetri, e con la sua sensibilità si può dire soltanto che il bastoncino è lungo $4$ cm: una cifra significativa. Il secondo ha anche le tacche dei millimetri, e la misura diventa $4{,}3$ cm: due cifre significative. Con un calibro, che apprezza i decimi di millimetro, si scriverebbe $4{,}30$ cm, con tre. Più lo strumento è sensibile, più cifre significative ha la misura (gli strumenti sono nella lezione [Gli strumenti di misura](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/gli-strumenti-di-misura)).

```tikz
% nome: righelli-cifre-significative
% alt: Lo stesso bastoncino misurato con due righelli: sopra un righello con le sole tacche dei centimetri, su cui si legge 4 centimetri; sotto un righello con le tacche dei millimetri, su cui si legge 4,3 centimetri
% svg: righelli-cifre-significative-5d3b3bef.svg 222x113
\begin{tikzpicture}[x=0.7cm]
\fill[blue!20] (0,0.5) rectangle (4.3,0.8);
\draw[thick] (0,0.5) rectangle (4.3,0.8);
\draw[thick] (-0.2,0) -- (6.2,0);
\foreach \x in {0,...,6} {\draw (\x,0) -- (\x,0.3); \node[below] at (\x,0) {\scriptsize $\x$};}
\node[right] at (6.3,0.4) {\small $4$ cm};
\fill[blue!20] (0,-1.2) rectangle (4.3,-0.9);
\draw[thick] (0,-1.2) rectangle (4.3,-0.9);
\draw[thick] (-0.2,-1.7) -- (6.2,-1.7);
\foreach \x in {0,...,6} {\draw (\x,-1.7) -- (\x,-1.4); \node[below] at (\x,-1.7) {\scriptsize $\x$};}
\foreach \x in {0.1,0.2,...,5.95} \draw (\x,-1.7) -- (\x,-1.58);
\foreach \x in {0.5,1.5,...,5.5} \draw (\x,-1.7) -- (\x,-1.5);
\node[right] at (6.3,-1.3) {\small $4{,}3$ cm};
\end{tikzpicture}
```

## Come si contano

Si leggono le cifre da sinistra a destra, con cinque regole.

1. Le cifre diverse da zero sono sempre significative: $4{,}37$ ne ha tre.
2. Gli zeri tra due cifre diverse da zero sono significativi: $305$ ne ha tre, $1{,}02$ ne ha tre.
3. Gli zeri all'inizio non sono significativi, perché servono solo a mettere la virgola al suo posto: $0{,}0045$ ne ha due, come $4{,}5$ mm scritti in metri, $0{,}0045$ m.
4. Gli zeri alla fine, dopo la virgola, sono significativi: $2{,}50$ ne ha tre, $12{,}0$ ne ha tre. Sono stati misurati.
5. Gli zeri alla fine di un numero intero sono ambigui: $1200$ m può avere due, tre o quattro cifre significative. Per dirlo senza ambiguità si usa la notazione scientifica.

In [notazione scientifica](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale) un numero si scrive come un numero tra $1$ e $10$ per una potenza di $10$, e si contano le cifre del primo fattore: $1{,}2 \cdot 10^3$ m ha due cifre significative, $1{,}20 \cdot 10^3$ m tre, $1{,}200 \cdot 10^3$ m quattro. Allo stesso modo $0{,}0045 = 4{,}5 \cdot 10^{-3}$, e si vede subito che le cifre significative sono due.

| Misura | Cifre significative | Perché |
|---|---|---|
| $7{,}25$ g | $3$ | nessuno zero |
| $0{,}082$ s | $2$ | gli zeri iniziali non contano |
| $40{,}07$ cm | $4$ | lo zero in mezzo conta |
| $3{,}00$ m | $3$ | gli zeri finali dopo la virgola contano |
| $5{,}0 \cdot 10^{4}$ kg | $2$ | si contano le cifre di $5{,}0$ |

Cambiare unità di misura non cambia le cifre significative, perché la misura è la stessa: $12{,}3$ cm $= 0{,}123$ m $= 123$ mm, sempre tre. Quando la nuova unità fa comparire zeri finali si passa alla notazione scientifica: $12{,}3$ cm $= 1{,}23 \cdot 10^5\ \mu\text{m}$, non $123\,000\ \mu\text{m}$.

```ad-warning
Lo zero finale non è decorativo
$2{,}5$ kg e $2{,}50$ kg non sono la stessa misura: la prima è incerta sui decimi, la seconda sui centesimi. Togliere lo zero finale butta via un'informazione; aggiungerlo senza averlo misurato ne inventa una.
```

## Arrotondare

Per arrotondare una misura a un certo numero di cifre significative si tengono le cifre che servono e si guarda la prima cifra che si toglie:

- se è $5$ o più, l'ultima cifra che resta aumenta di uno;
- se è meno di $5$, l'ultima cifra che resta non cambia.

| Numero | Cifre richieste | Risultato |
|---|---|---|
| $3{,}14159$ | $3$ | $3{,}14$ |
| $0{,}004567$ | $2$ | $0{,}0046$ |
| $26{,}48$ | $3$ | $26{,}5$ |
| $9{,}97$ | $2$ | $10$ |
| $46\,280$ | $2$ | $4{,}6 \cdot 10^4$ |

Negli ultimi due casi bisogna stare attenti alla scrittura. $9{,}97$ con due cifre significative diventa $10$, e qui lo zero finale è significativo: senza ambiguità si scrive $1{,}0 \cdot 10^1$. $46\,280$ con due cifre si scrive $4{,}6 \cdot 10^4$, perché $46\,000$ non direbbe quante cifre sono significative.

```ad-warning
Arrotondare a passi
$2{,}4499$ a due cifre significative è $2{,}4$: la prima cifra che si toglie è un $4$. Chi arrotonda un passo alla volta, $2{,}4499 \to 2{,}450 \to 2{,}45 \to 2{,}5$, sbaglia. Si arrotonda una volta sola, guardando solo la prima cifra tolta.
```

```ad-warning
Troncare non è arrotondare
$26{,}48$ con tre cifre significative è $26{,}5$, non $26{,}4$: togliere le cifre in più senza guardarle è troncare, e dà un risultato sempre per difetto.
```

## Le cifre significative nei calcoli

Un risultato calcolato non può essere più preciso dei dati da cui viene. Quando i dati sono scritti senza incertezza, due regole dicono quante cifre tenere; sono la versione rapida delle regole di propagazione della lezione [Incertezza relativa e propagazione delle incertezze](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/incertezza-relativa-e-propagazione-delle-incertezze).

### Somme e differenze

Il risultato di una somma o di una differenza si arrotonda alla posizione decimale del dato meno preciso, cioè quello con meno cifre dopo la virgola. Nelle somme si sommano le incertezze assolute, e l'incertezza più grande è quella del dato con meno decimali.

$$12{,}3\,\text{cm} + 0{,}456\,\text{cm} + 7{,}25\,\text{cm} = 20{,}006\,\text{cm} \approx 20{,}0\,\text{cm}$$

Il dato meno preciso, $12{,}3$ cm, è incerto sui decimi, e anche la somma lo è.

```ad-warning
La differenza di due misure vicine
$45{,}82\,\text{g} - 45{,}7\,\text{g} = 0{,}12$ g, che si arrotonda ai decimi: $0{,}1$ g. I due dati hanno quattro e tre cifre significative, il risultato una sola. Nelle differenze si contano i decimali, non le cifre significative.
```

### Prodotti e quozienti

Il risultato di un prodotto o di un quoziente ha tante cifre significative quante ne ha il dato che ne ha meno. Nei prodotti si sommano le incertezze relative, e un dato con poche cifre significative ha un'incertezza relativa grande.

$$29{,}7\,\text{cm} \cdot 21{,}0\,\text{cm} = 623{,}7\ \text{cm}^2 \approx 624\ \text{cm}^2$$

Tutti e due i dati hanno tre cifre significative, e il risultato ne ha tre. Con $2{,}5\,\text{m} \cdot 3{,}17\,\text{m} = 7{,}925\ \text{m}^2$ il dato con meno cifre è $2{,}5$, con due, e l'area è $7{,}9\ \text{m}^2$.

```ad-warning
Le cifre della calcolatrice
$100{,}0\,\text{m} : 12{,}5\,\text{s}$ sulla calcolatrice dà $8$, e $10{,}0\,\text{m} : 3{,}0\,\text{s}$ dà $3{,}333333333$. Nel primo caso il risultato ha tre cifre significative, come $12{,}5$, e si scrive $8{,}00$ m/s aggiungendo gli zeri; nel secondo ne ha due, come $3{,}0$, e si scrive $3{,}3$ m/s.
```

### Numeri esatti e passaggi intermedi

Alcuni numeri dei calcoli non sono misure e non hanno incertezza: si chiamano **numeri esatti**. Sono esatti i numeri che contano (le $10$ oscillazioni, i $3$ lati di un triangolo), i fattori delle formule (il $2$ del perimetro $2a + 2b$, l'esponente di $l^3$) e i fattori di conversione definiti ($1$ m $= 100$ cm). Un numero esatto ha infinite cifre significative e non limita il risultato: il perimetro di un quadrato con il lato di $2{,}35$ cm è $4 \cdot 2{,}35 = 9{,}40$ cm, con tre cifre come il lato.

Nei calcoli con più passaggi si arrotonda solo alla fine. Nei risultati intermedi si tengono una o due cifre in più, altrimenti gli arrotondamenti si accumulano.

```ad-example
Esempio 1: il volume e la densità di un cilindro
Un cilindro di ottone ha l'area di base $A = 3{,}14\ \text{cm}^2$, l'altezza $h = 5{,}0$ cm e la massa $m = 133{,}6$ g. Calcola il volume e la densità.

Il volume è un prodotto, $V = A \cdot h = 3{,}14 \cdot 5{,}0 = 15{,}7\ \text{cm}^3$. Il dato con meno cifre significative è $h$, con due, quindi $V$ si scrive con due: $V = 16\ \text{cm}^3$. Nel passaggio successivo però si usa $15{,}7$, con una cifra in più.

La densità è un quoziente:

$$d = \frac{m}{V} = \frac{133{,}6\,\text{g}}{15{,}7\ \text{cm}^3} = 8{,}509\ldots\ \text{g/cm}^3 \approx 8{,}5\ \text{g/cm}^3$$

con due cifre significative, quelle di $h$. Se si fosse usato il volume già arrotondato, $\dfrac{133{,}6}{16} = 8{,}35$, si sarebbe scritto $8{,}4\ \text{g/cm}^3$: un arrotondamento fatto troppo presto sposta l'ultima cifra.
```

```ad-example
Esempio 2: somme e prodotti insieme
Una lastra rettangolare è formata da due pezzi accostati, lunghi $1{,}25$ m e $0{,}6$ m, larghi entrambi $0{,}482$ m. Calcola la lunghezza totale e l'area.

La lunghezza è una somma: $1{,}25 + 0{,}6 = 1{,}85$ m, da arrotondare ai decimi come $0{,}6$: $1{,}9$ m. Il risultato intermedio da usare nel prodotto è $1{,}85$.

L'area è un prodotto: $1{,}85 \cdot 0{,}482 = 0{,}8917\ \text{m}^2$. La lunghezza totale ha due cifre significative ($1{,}9$), la larghezza tre, quindi l'area ne ha due: $0{,}89\ \text{m}^2$.
```

## Cifre significative e incertezza

Quando una misura ha l'incertezza scritta, è l'incertezza a decidere le cifre: l'ultima cifra significativa del valore è quella nella posizione dell'incertezza, come nelle regole della lezione [Valore medio e incertezza di una serie di misure](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/valore-medio-e-incertezza-di-una-serie-di-misure). $(12{,}50 \pm 0{,}06)\,\text{s}$ ha quattro cifre significative, $(2{,}5 \pm 0{,}2)\,\text{s}$ ne ha due.

Le regole delle cifre significative sono una stima rapida, e con i dati senza incertezza sono l'unica guida. Quando le incertezze ci sono, conviene propagarle: la velocità di $100{,}0$ m in $12{,}5$ s, con le cifre significative, si scrive $8{,}00$ m/s, ma se il tempo è $(12{,}5 \pm 0{,}2)\,\text{s}$ la propagazione dà $(8{,}0 \pm 0{,}2)\,\text{m/s}$, e l'incertezza vera è sui decimi.

```ad-warning
Più cifre non vuol dire più precisione
Scrivere $v = 8{,}0000$ m/s perché la calcolatrice lo permette non rende la misura più precisa: dichiara una precisione che la misura non ha. Il numero di cifre di un risultato è un'affermazione su quanto lo conosci.
```
