# Errori di misura e cifre significative

Tre gruppi di studenti titolano la stessa soluzione e trovano $18{,}6\,\text{mL}$, $18{,}9\,\text{mL}$ e $18{,}7\,\text{mL}$: chi ha sbagliato? Probabilmente nessuno. Ogni misura ha un'incertezza, che dipende dallo strumento, da chi misura e dalle condizioni del laboratorio, e un risultato serio dice sempre quanto è incerto. Il modo più breve di dirlo sono le cifre con cui si scrive: $18{,}7\,\text{mL}$ e $18{,}70\,\text{mL}$ non sono la stessa misura.

## Da dove vengono le incertezze

Una misura non dà mai il valore vero di una grandezza, ma un valore vicino. Le cause sono tre:

- lo strumento: una bilancia tecnica non vede i milligrammi, un cilindro da $100\,\text{mL}$ non distingue $36{,}2$ da $36{,}4\,\text{mL}$;
- chi misura: legge il menisco da un'altezza un po' diversa ogni volta, chiude il rubinetto della buretta una goccia prima o una goccia dopo;
- l'ambiente: una corrente d'aria sposta la lettura della bilancia analitica, la temperatura cambia il volume dei liquidi.

Le differenze tra il valore misurato e quello vero si chiamano **errori di misura**. La parola non vuol dire che qualcuno ha sbagliato: vuol dire che nessuna misura è esatta.

### Errori sistematici

Gli **errori sistematici** spostano tutte le misure dalla stessa parte, sempre in eccesso o sempre in difetto, e di solito della stessa quantità. Vengono da uno strumento starato o da un metodo sbagliato:

- una bilancia che segna $0{,}12\,\text{g}$ a piatto vuoto, perché non è stata azzerata, dà tutte le masse più grandi di $0{,}12\,\text{g}$;
- chi legge il menisco di un cilindro sempre guardando dall'alto trova volumi sempre più grandi (la lettura del menisco è nella lezione [Massa, volume e densità](/materiale/scuola-superiore/chimica/misure-e-grandezze/massa-volume-e-densita));
- una pipetta bagnata d'acqua all'interno diluisce la soluzione che preleva.

Ripetere la misura non li fa vedere, perché le misure ripetute si somigliano. Si scoprono confrontando con un campione noto, per esempio pesando una massa campione o misurando la densità dell'acqua distillata, e si eliminano correggendo lo strumento o il metodo.

### Errori casuali

Gli **errori casuali** spostano le misure a volte in eccesso e a volte in difetto, di quantità diverse ogni volta: la goccia in più o in meno al viraggio di una titolazione, la stima dell'ultima cifra tra due tacche, le piccole variazioni di temperatura. Non si possono eliminare, ma si riducono ripetendo la misura più volte e facendo la media: gli errori in eccesso e quelli in difetto tendono a compensarsi.

Diverso è lo **sbaglio**: leggere $16{,}8$ al posto di $18{,}6$, pesare il becher sbagliato, dimenticare di azzerare la bilancia una volta. Uno sbaglio dà una misura molto lontana dalle altre, e quella misura si scarta, dopo averne capito il motivo.

### Precisione e accuratezza

Una serie di misure è **precisa** quando le misure sono vicine tra loro, cioè quando gli errori casuali sono piccoli; è **accurata** quando il loro valore medio è vicino al valore vero, cioè quando gli errori sistematici sono piccoli. Nella figura tre gruppi misurano cinque volte la densità dell'etanolo, che vale $0{,}789\,\text{g/mL}$.

```tikz
% nome: precisione-accuratezza-densita
% alt: Tre righe di cinque punti su una scala delle densità da 0,770 a 0,810 grammi al millilitro, con una linea arancione verticale sul valore vero 0,789. Gruppo A: cinque punti stretti attorno al valore vero, precisi e accurati. Gruppo B: cinque punti stretti attorno a 0,802, precisi ma non accurati. Gruppo C: cinque punti sparsi da 0,775 a 0,801, con la media vicina al valore vero, accurati ma poco precisi
% svg: precisione-accuratezza-densita-02269a8f.svg 348x159
\begin{tikzpicture}[x=0.16cm]
\draw[->] (770,0) -- (812,0) node[right] {\small $d$ (g/mL)};
\foreach \x in {770,775,...,810} \draw (\x,-0.06) -- (\x,0.06);
\foreach \x/\l in {770/0{,}770,780/0{,}780,790/0{,}790,800/0{,}800,810/0{,}810} {\draw (\x,-0.1) -- (\x,0.1); \node[below] at (\x,-0.1) {\scriptsize $\l$};}
\draw[thick, orange!90!black] (789,-0.05) -- (789,3.1);
\node[above] at (789,3.1) {\small valore vero};
\foreach \x in {788,790,789,787,791} \fill[blue] (\x,2.4) circle (1.6pt);
\foreach \x in {801,803,802,800,804} \fill[blue] (\x,1.5) circle (1.6pt);
\foreach \x in {775,801,790,780,797} \fill[blue] (\x,0.6) circle (1.6pt);
\node[left] at (768,2.4) {\small A};
\node[left] at (768,1.5) {\small B};
\node[left] at (768,0.6) {\small C};
\end{tikzpicture}
```

Il gruppo A è preciso e accurato. Il gruppo B è preciso ma non accurato: le sue misure sono vicine tra loro ma tutte troppo grandi, come succede con un errore sistematico, per esempio la bilancia non azzerata. Il gruppo C non è preciso, ma la media delle sue misure, $0{,}7886\,\text{g/mL}$, è vicina al valore vero: con abbastanza misure gli errori casuali si compensano. Un errore sistematico, invece, non sparisce facendo la media.

## Sensibilità e incertezza di una misura

La **sensibilità** di uno strumento è la più piccola variazione che riesce a mostrare: in uno strumento a scala è il valore di una divisione, in uno digitale il valore di un'unità dell'ultima cifra. La **portata** è il valore più grande che può misurare.

| Strumento | Portata tipica | Sensibilità tipica |
|---|---|---|
| bilancia tecnica | $200$-$2000\,\text{g}$ | $0{,}01\,\text{g}$ |
| bilancia analitica | $200\,\text{g}$ | $0{,}0001\,\text{g}$ |
| cilindro graduato da $100\,\text{mL}$ | $100\,\text{mL}$ | $1\,\text{mL}$ |
| cilindro graduato da $10\,\text{mL}$ | $10\,\text{mL}$ | $0{,}2\,\text{mL}$ |
| buretta | $50\,\text{mL}$ | $0{,}1\,\text{mL}$ |
| termometro a liquido | $-10$-$110\,^\circ\text{C}$ | $1\,^\circ\text{C}$ |

Una misura fatta una volta sola si scrive con la sua **incertezza assoluta**, che si prende uguale alla sensibilità dello strumento, con il segno $\pm$ e l'unità dopo una parentesi:

$$m = (5{,}30 \pm 0{,}01)\,\text{g} \qquad V = (36 \pm 1)\,\text{mL}$$

La vetreria tarata non ha una scala, ma porta scritta la sua **tolleranza**, cioè l'incertezza garantita dal costruttore: una pipetta tarata da $10\,\text{mL}$ di buona qualità ha di solito una tolleranza di $0{,}02\,\text{mL}$, e il volume che eroga si scrive $(10{,}00 \pm 0{,}02)\,\text{mL}$.

```ad-note
Mezza divisione o una divisione intera
Molti chimici leggono la buretta stimando anche la cifra tra due tacche, e scrivono le letture con due decimali, come $18{,}65\,\text{mL}$. Qui, come nelle lezioni di fisica, l'incertezza di una lettura è la sensibilità intera, $0{,}1\,\text{mL}$, che è la scelta più prudente: la lettura si scrive con un decimale. Segui le indicazioni del tuo insegnante.
```

## Valore medio e incertezza di una serie di misure

Quando una misura si ripete più volte, si prende come risultato il **valore medio**, la somma delle misure divisa per il loro numero:

$$\bar x = \frac{x_1 + x_2 + \ldots + x_n}{n}$$

e come incertezza la **semidispersione**, metà della differenza tra la misura più grande e la più piccola:

$$\Delta x = \frac{x_{\max} - x_{\min}}{2}$$

Se le misure sono tutte uguali, o se la semidispersione viene più piccola della sensibilità, l'incertezza è la sensibilità: lo strumento non vede differenze più piccole. Il risultato si scrive $x = (\bar x \pm \Delta x)\,\text{unità}$, arrotondato con due regole:

1. l'incertezza si arrotonda a una sola cifra significativa, la prima diversa da zero: $0{,}0234$ diventa $0{,}02$, $0{,}19$ diventa $0{,}2$;
2. il valore medio si arrotonda alla stessa posizione decimale dell'incertezza, compresi gli zeri finali.

Per arrotondare si guarda la prima cifra che si toglie: se è $5$ o più, l'ultima cifra che resta aumenta di uno; se è meno di $5$, resta com'è.

```ad-example
Esempio 1: cinque titolazioni
Cinque titolazioni della stessa soluzione, con una buretta che ha la sensibilità di $0{,}1\,\text{mL}$, richiedono $18{,}6$, $18{,}9$, $18{,}7$, $18{,}5$ e $18{,}8\,\text{mL}$ di titolante. Come si scrive il risultato?

Il valore medio è

$$\bar V = \frac{18{,}6 + 18{,}9 + 18{,}7 + 18{,}5 + 18{,}8}{5}\,\text{mL} = \frac{93{,}5}{5}\,\text{mL} = 18{,}70\,\text{mL}$$

La semidispersione è $\Delta V = \dfrac{18{,}9 - 18{,}5}{2}\,\text{mL} = 0{,}2\,\text{mL}$, più grande della sensibilità. L'incertezza è in decimi, e il valore medio si scrive fino ai decimi:

$$V = (18{,}7 \pm 0{,}2)\,\text{mL}$$
```

```ad-warning
L'incertezza non è la differenza tra gli estremi
La semidispersione è metà di $x_{\max} - x_{\min}$: nell'esempio 1 vale $0{,}2\,\text{mL}$, non $0{,}4\,\text{mL}$. E il valore medio non si scrive con più cifre dell'incertezza: $(18{,}70 \pm 0{,}2)\,\text{mL}$ dichiara i centesimi, che nessuno ha misurato.
```

Media, semidispersione e il confronto tra due misure sono spiegati più a lungo nella lezione di fisica [Valore medio e incertezza di una serie di misure](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/valore-medio-e-incertezza-di-una-serie-di-misure).

## L'incertezza relativa

L'**incertezza relativa** è il rapporto tra l'incertezza assoluta e il valore:

$$\varepsilon = \frac{\Delta x}{\bar x}$$

È un numero puro, senza unità, e moltiplicato per $100$ diventa l'**incertezza percentuale**. Dice quanto è precisa una misura meglio dell'incertezza assoluta, perché la confronta con la grandezza misurata.

```ad-example
Esempio 2: pipetta o cilindro?
Per prelevare $10\,\text{mL}$ di una soluzione si può usare una pipetta tarata, $(10{,}00 \pm 0{,}02)\,\text{mL}$, o un cilindro da $100\,\text{mL}$, $(10 \pm 1)\,\text{mL}$. Quanto valgono le incertezze percentuali?

$$\varepsilon_{pipetta} = \frac{0{,}02}{10{,}00} = 0{,}002 = 0{,}2\% \qquad \varepsilon_{cilindro} = \frac{1}{10} = 0{,}1 = 10\%$$

La pipetta è cinquanta volte più precisa. Per misure precise di volumi piccoli il cilindro grande è lo strumento sbagliato.
```

## Le incertezze nei calcoli

Quando un risultato si calcola da più misure, anche l'incertezza si calcola, con due regole che considerano il caso peggiore:

- in una **somma** o in una **differenza** si sommano le incertezze assolute;
- in un **prodotto** o in un **quoziente** si sommano le incertezze relative.

Il volume erogato da una buretta è una differenza di due letture, e la massa di un campione pesato per differenza pure: ognuna delle due letture porta la sua incertezza, e le incertezze si sommano.

```ad-example
Esempio 3: il volume erogato dalla buretta
In una titolazione la buretta segna $0{,}3\,\text{mL}$ all'inizio e $18{,}9\,\text{mL}$ alla fine, con la sensibilità di $0{,}1\,\text{mL}$. Quanto titolante è uscito?

$$V = 18{,}9\,\text{mL} - 0{,}3\,\text{mL} = 18{,}6\,\text{mL} \qquad \Delta V = 0{,}1\,\text{mL} + 0{,}1\,\text{mL} = 0{,}2\,\text{mL}$$

Il volume erogato è $(18{,}6 \pm 0{,}2)\,\text{mL}$: le incertezze si sommano anche se le letture si sottraggono.
```

```ad-example
Esempio 4: la densità di un liquido
Nella lezione sulla densità un liquido è stato pesato per differenza con una bilancia tecnica, $68{,}35\,\text{g} - 48{,}62\,\text{g} = 19{,}73\,\text{g}$, e il suo volume misurato con un cilindro da $25\,\text{mL}$, $(25{,}0 \pm 0{,}5)\,\text{mL}$. Quanto vale la densità, con la sua incertezza?

La massa è una differenza di due pesate, ognuna con l'incertezza di $0{,}01\,\text{g}$: $m = (19{,}73 \pm 0{,}02)\,\text{g}$. La densità è un quoziente, e le incertezze relative si sommano:

$$\varepsilon_m = \frac{0{,}02}{19{,}73} = 0{,}10\% \qquad \varepsilon_V = \frac{0{,}5}{25{,}0} = 2{,}0\% \qquad \varepsilon_d = 0{,}10\% + 2{,}0\% = 2{,}1\%$$

Il valore è $d = \dfrac{19{,}73}{25{,}0} = 0{,}7892\,\text{g/mL}$, e l'incertezza $\Delta d = 0{,}021 \cdot 0{,}7892 = 0{,}017 \approx 0{,}02\,\text{g/mL}$:

$$d = (0{,}79 \pm 0{,}02)\,\text{g/mL}$$

Le cifre significative, nella lezione sulla densità, davano $0{,}789\,\text{g/mL}$; l'incertezza calcolata dice che la cifra incerta è già quella dei centesimi. Quasi tutta l'incertezza viene dal cilindro. Con una pipetta tarata da $25\,\text{mL}$, $(25{,}00 \pm 0{,}03)\,\text{mL}$, l'incertezza della densità scenderebbe sotto lo $0{,}3\%$.
```

Un valore di tabella è **compatibile** con una misura se cade dentro il suo intervallo, da $\bar x - \Delta x$ a $\bar x + \Delta x$. La densità dell'esempio 4 va da $0{,}77$ a $0{,}81\,\text{g/mL}$: è compatibile con l'etanolo, $0{,}789\,\text{g/mL}$, ma anche con l'acetone, $0{,}79\,\text{g/mL}$, e la misura non basta a distinguerli. Le regole per le potenze e altri esempi sono nella lezione di fisica [Incertezza relativa e propagazione delle incertezze](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/incertezza-relativa-e-propagazione-delle-incertezze).

## Le cifre significative

Quando l'incertezza non è scritta, la dicono le cifre. Le **cifre significative** di una misura sono tutte le cifre certe più la prima incerta, e una misura scritta senza incertezza si intende incerta sull'ultima cifra. Una bilancia tecnica che mostra $5{,}30\,\text{g}$ dà tre cifre significative: lo zero finale dice che i centesimi sono stati misurati, e vanno scritti.

Si leggono le cifre da sinistra a destra, con cinque regole:

1. le cifre diverse da zero sono sempre significative: $18{,}7$ ne ha tre;
2. gli zeri tra due cifre diverse da zero sono significativi: $1{,}020$ ne ha quattro, $305$ ne ha tre;
3. gli zeri all'inizio non sono significativi, perché servono solo a mettere la virgola al suo posto: $0{,}0250$ ne ha tre, come $25{,}0\,\text{mg}$ scritti in grammi;
4. gli zeri alla fine, dopo la virgola, sono significativi: $25{,}00\,\text{mL}$ ne ha quattro;
5. gli zeri alla fine di un numero intero sono ambigui: $1500\,\text{mL}$ può averne due, tre o quattro. Per dirlo senza ambiguità si usa la notazione scientifica.

| Misura | Cifre significative | Perché |
|---|---|---|
| $5{,}30\,\text{g}$ | $3$ | lo zero finale dopo la virgola conta |
| $0{,}0250\,\text{mol}$ | $3$ | gli zeri iniziali non contano |
| $1{,}020\,\text{g/mL}$ | $4$ | lo zero in mezzo e quello finale contano |
| $10{,}00\,\text{mL}$ | $4$ | una pipetta tarata |
| $6{,}02 \cdot 10^{23}$ | $3$ | si contano le cifre di $6{,}02$ |
| $1{,}50 \cdot 10^{3}\,\text{mL}$ | $3$ | la notazione scientifica toglie l'ambiguità di $1500$ |

Cambiare unità di misura non cambia le cifre significative, perché la misura è la stessa: $25{,}0\,\text{mL} = 0{,}0250\,\text{L}$, sempre tre.

```ad-warning
Lo zero finale non è decorativo
$5{,}3\,\text{g}$ e $5{,}30\,\text{g}$ non sono la stessa misura: la prima viene da una bilancia che vede i decimi di grammo, la seconda da una che vede i centesimi. Togliere lo zero butta via un'informazione, aggiungerlo senza averlo misurato ne inventa una.
```

### Arrotondare

Per arrotondare a un certo numero di cifre significative si tengono le cifre che servono e si guarda la prima cifra tolta: da $5$ in su l'ultima cifra che resta aumenta di uno, sotto il $5$ resta com'è. Si arrotonda una volta sola, guardando solo la prima cifra tolta.

| Numero | Cifre richieste | Risultato |
|---|---|---|
| $0{,}78924$ | $3$ | $0{,}789$ |
| $18{,}025$ | $3$ | $18{,}0$ |
| $46\,046$ | $3$ | $4{,}60 \cdot 10^{4}$ |
| $0{,}24972$ | $3$ | $0{,}250$ |
| $9{,}97$ | $2$ | $10$, cioè $1{,}0 \cdot 10^{1}$ |

In quattro casi su cinque il risultato finisce con uno zero significativo, che va scritto: $0{,}250$ e non $0{,}25$. Quando l'arrotondamento lascia zeri finali in un intero, si passa alla notazione scientifica, perché $46\,000$ non direbbe quante cifre sono significative.

```ad-warning
Troncare non è arrotondare
$0{,}7892$ con due cifre significative è $0{,}79$, non $0{,}78$: togliere le cifre in più senza guardarle è troncare, e dà un risultato sempre per difetto.
```

### Le cifre significative nei calcoli

Un risultato calcolato non può essere più preciso dei dati da cui viene. Quando i dati sono scritti senza incertezza, due regole dicono quante cifre tenere; sono la versione rapida delle regole sulle incertezze viste sopra.

- Nelle **somme e nelle differenze** il risultato si arrotonda alla posizione decimale del dato che ha meno decimali: $48{,}62\,\text{g} + 5{,}3\,\text{g} = 53{,}92\,\text{g} \approx 53{,}9\,\text{g}$, perché $5{,}3$ è incerto sui decimi.
- Nei **prodotti e nei quozienti** il risultato ha tante cifre significative quante il dato che ne ha meno: $\dfrac{19{,}73\,\text{g}}{25{,}0\,\text{mL}} = 0{,}7892\ldots\,\text{g/mL} \approx 0{,}789\,\text{g/mL}$, con tre cifre come $25{,}0$.

Alcuni numeri dei calcoli non sono misure e non limitano il risultato: sono i **numeri esatti**. Sono esatti i numeri che contano (i $2$ atomi di idrogeno in $\mathrm{H_2O}$, le $5$ titolazioni della media), i fattori di conversione definiti ($1\,\text{L} = 1000\,\text{mL}$) e i numeri delle formule. Hanno infinite cifre significative. Le masse atomiche della tavola periodica sono misure, ma con molte cifre: di solito non sono loro a decidere.

```ad-example
Esempio 5: le moli in un campione d'acqua
Un campione d'acqua ha la massa di $4{,}50\,\text{g}$. Qual è la massa molare dell'acqua, e quante moli contiene il campione?

La massa molare è una somma, con le masse atomiche della lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare): $M = 2 \cdot 1{,}01 + 16{,}00 = 18{,}02\,\text{g/mol}$. Il $2$ è esatto, e il risultato ha i centesimi come i dati.

Le moli sono un quoziente:

$$n = \frac{m}{M} = \frac{4{,}50\,\text{g}}{18{,}02\,\text{g/mol}} = 0{,}24972\ldots\,\text{mol} \approx 0{,}250\,\text{mol}$$

con tre cifre significative, quelle di $4{,}50\,\text{g}$. Lo zero finale di $0{,}250$ è significativo, e senza di lui il risultato ne avrebbe solo due.
```

```ad-warning
Le cifre della calcolatrice
La calcolatrice dà $19{,}73 : 25{,}0 = 0{,}7892$ e $4{,}50 : 18{,}02 = 0{,}249722531$. Scrivere tutte quelle cifre dichiara una precisione che la misura non ha; toglierne troppe butta via quella che ha. Il numero di cifre di un risultato è un'affermazione su quanto lo conosci.
```

Nei calcoli con più passaggi si arrotonda solo alla fine: nei risultati intermedi si tengono una o due cifre in più, altrimenti gli arrotondamenti si accumulano. Le regole delle cifre significative, con altri esempi, sono anche nella lezione di fisica [Le cifre significative](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/le-cifre-significative).
