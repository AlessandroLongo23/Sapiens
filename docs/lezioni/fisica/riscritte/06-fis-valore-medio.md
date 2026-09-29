# Valore medio e incertezza di una serie di misure

Una misura ripetuta non dà mai lo stesso numero, per via degli [errori casuali](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/errori-casuali-ed-errori-sistematici). Da una serie di misure si ricavano allora due numeri: il valore medio, che è la stima migliore della grandezza, e l'incertezza, che dice di quanto quella stima può essere sbagliata. Il risultato si scrive con tutti e due, per esempio $(12{,}50 \pm 0{,}06)\,\text{s}$: vuol dire che il valore della grandezza sta, con buona fiducia, tra $12{,}44$ s e $12{,}56$ s.

## Il valore medio

Il **valore medio** di $n$ misure $x_1, x_2, \dots, x_n$ della stessa grandezza è la loro media aritmetica:

$$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$

È la stessa media della lezione di matematica [Media, mediana e moda](/materiale/scuola-superiore/matematica/statistica/media-mediana-e-moda). In fisica la si usa perché gli errori casuali spostano le misure a volte in più e a volte in meno, e nella media si compensano in parte: il valore medio è più affidabile di ciascuna misura presa da sola. Non corregge invece gli errori sistematici, che spostano tutte le misure nello stesso verso.

Un gruppo misura con il cronometro, che ha la sensibilità di $0{,}01$ s, il tempo di $10$ oscillazioni di un pendolo, sei volte:

$$12{,}46 \quad 12{,}56 \quad 12{,}51 \quad 12{,}44 \quad 12{,}53 \quad 12{,}50 \ \text{s}$$

Il valore medio è

$$\bar{t} = \frac{12{,}46 + 12{,}56 + 12{,}51 + 12{,}44 + 12{,}53 + 12{,}50}{6} = \frac{75{,}00}{6} = 12{,}50\,\text{s}$$

## L'incertezza assoluta

Quanto è affidabile il valore medio? Dipende da quanto sono sparse le misure. Il modo più semplice di dirlo, quello che si usa nel biennio, è la semidispersione. La **semidispersione** è metà della differenza tra la misura più grande e la più piccola:

$$\Delta x = \frac{x_{\max} - x_{\min}}{2}$$

La differenza $x_{\max} - x_{\min}$ è il [campo di variazione](/materiale/scuola-superiore/matematica/statistica/indici-di-variabilita) della statistica, e la semidispersione ne è la metà. La semidispersione si prende come **incertezza assoluta** (o errore assoluto) della misura: si scrive $\Delta x$, si legge "delta $x$", ed è una grandezza con la stessa unità di misura di $x$.

Per il pendolo $t_{\max} = 12{,}56$ s e $t_{\min} = 12{,}44$ s, quindi

$$\Delta t = \frac{12{,}56 - 12{,}44}{2} = \frac{0{,}12}{2} = 0{,}06\,\text{s}$$

e il risultato è $t = (12{,}50 \pm 0{,}06)\,\text{s}$. Sulla retta dei tempi si vede che cosa vuol dire: l'intervallo che va da $\bar{t} - \Delta t$ a $\bar{t} + \Delta t$ contiene tutte le misure.

```tikz
% nome: misure-pendolo-semidispersione
% alt: Le sei misure del tempo di 10 oscillazioni, da 12,44 a 12,56 secondi, come punti su una retta; una linea arancione segna il valore medio 12,50 secondi e una parentesi segna l'intervallo da 12,44 a 12,56, largo due volte l'incertezza di 0,06 secondi
% svg: misure-pendolo-semidispersione-5de90085.svg 211x81
\begin{tikzpicture}[x=20cm]
\draw[->] (12.39,0) -- (12.61,0) node[right] {\small $t$ (s)};
\foreach \x in {12.40,12.42,...,12.60} \draw (\x,-0.06) -- (\x,0.06);
\foreach \x/\l in {12.40/12{,}40,12.45/12{,}45,12.50/12{,}50,12.55/12{,}55,12.60/12{,}60} {\draw (\x,-0.1) -- (\x,0.1); \node[below] at (\x,-0.1) {\scriptsize $\l$};}
\draw[thick, orange!90!black] (12.50,-0.05) -- (12.50,1.05);
\foreach \x in {12.46,12.56,12.51,12.44,12.53,12.50} \fill[blue] (\x,0.3) circle (1.8pt);
\node[above] at (12.50,1.05) {\small $\bar{t}$};
\draw[thick] (12.44,0.75) -- (12.44,0.85) -- (12.56,0.85) -- (12.56,0.75);
\node[above] at (12.47,0.85) {\small $\Delta t$};
\node[above] at (12.53,0.85) {\small $\Delta t$};
\end{tikzpicture}
```

```ad-warning
L'incertezza non è il campo di variazione
La semidispersione è metà della differenza tra la misura più grande e la più piccola: per il pendolo $0{,}06$ s, non $0{,}12$ s. Dimenticare il diviso due raddoppia l'incertezza.
```

### Quando le misure sono tutte uguali

Se si misura tre volte la larghezza di un foglio con un righello millimetrato e si trova sempre $21{,}0$ cm, la semidispersione è zero. Non vuol dire che la misura sia esatta: vuol dire che lo strumento non è abbastanza sensibile per vedere le differenze. In questo caso, e ogni volta che si fa una sola misura, l'incertezza è la [sensibilità dello strumento](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/gli-strumenti-di-misura), cioè la più piccola variazione che lo strumento riesce a mostrare:

$$l = (21{,}0 \pm 0{,}1)\,\text{cm}$$

Lo stesso vale quando la semidispersione viene più piccola della sensibilità. Tre pesate con una bilancia che ha la sensibilità di $0{,}1$ g danno $42{,}3$ g, $42{,}4$ g e $42{,}3$ g: la semidispersione è $0{,}05$ g, ma lo strumento non distingue meno di $0{,}1$ g, e l'incertezza è $0{,}1$ g. In breve, l'incertezza è la semidispersione o la sensibilità, la più grande delle due.

## Come si scrive il risultato

Il risultato di una misura si scrive con il valore medio, l'incertezza e l'unità di misura, con le parentesi perché l'unità vale per tutti e due i numeri:

$$x = (\bar{x} \pm \Delta x)\,\text{unità}$$

Prima di scriverlo si arrotondano i due numeri, con queste regole.

1. L'incertezza si arrotonda a **una sola cifra significativa**, cioè alla prima cifra diversa da zero partendo da sinistra: $0{,}0234$ diventa $0{,}02$, $0{,}19$ diventa $0{,}2$, $3{,}6$ diventa $4$.
2. Il valore medio si arrotonda alla stessa posizione decimale dell'incertezza: se l'incertezza è in centesimi, il valore medio si scrive fino ai centesimi.
3. Per arrotondare si guarda la prima cifra che si toglie: se è $5$ o più si aumenta di uno l'ultima cifra che resta, se è meno di $5$ la si lascia com'è. Così $2{,}508$ ai decimi fa $2{,}5$, e $0{,}6633$ ai decimi fa $0{,}7$.

L'incertezza dice già quale cifra del risultato è incerta: scrivere più cifre dopo quella vorrebbe dire dichiarare una precisione che la misura non ha. Le cifre significative e l'arrotondamento sono nella lezione [Le cifre significative](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/le-cifre-significative).

```ad-warning
Le cifre che la calcolatrice aggiunge
Con i tempi della guida dell'esempio 2 la calcolatrice dà $\bar{t} = 2{,}508$ s e $\Delta t = 0{,}19$ s. Scrivere $(2{,}508 \pm 0{,}19)\,\text{s}$ è sbagliato due volte: l'incertezza ha due cifre significative, e il valore medio ha cifre (lo $0$ e l'$8$) più piccole dell'incertezza, che non hanno significato. Il risultato giusto è $(2{,}5 \pm 0{,}2)\,\text{s}$.
```

```ad-warning
Lo zero finale non si butta
Nell'esempio del pendolo il valore medio è $12{,}50$ s, non $12{,}5$ s: l'incertezza è in centesimi, e anche il valore medio va scritto fino ai centesimi. Lo zero finale dice che la cifra dei centesimi è stata misurata.
```

La figura qui sotto ripete la misura del pendolo al posto tuo. Ogni misura è un quadretto sopra il suo valore, e le misure uguali si impilano; parte dalle sei misure del gruppo. Aggiungi misure: il valore medio si muove sempre meno, mentre la semidispersione non diminuisce, e anzi con tante misure tende a crescere, perché prima o poi arriva una misura un po' più lontana delle altre.

```interattivo
% nome: misure-ripetute-istogramma
% alt: Le misure del tempo di 10 oscillazioni di un pendolo impilate come quadretti sopra una retta dei tempi da 12,30 a 12,70 secondi, a partire dalle sei misure della lezione; un bottone aggiunge una misura o dieci alla volta; una linea arancione segna il valore medio e una parentesi l'intervallo di semidispersione, e sotto si leggono il numero delle misure, il valore medio, la semidispersione e il risultato arrotondato
```

```ad-note
Altri modi di calcolare l'incertezza
La semidispersione è il modo più semplice, e quello che usano i libri del biennio. Con molte misure, come mostra la figura, esagera l'incertezza, perché dipende solo dalle due misure più lontane. Per questo più avanti si usa lo [scarto quadratico medio](/materiale/scuola-superiore/matematica/statistica/indici-di-variabilita), o deviazione standard, e con molte misure anche lo scarto quadratico medio diviso per $\sqrt{n}$, che diminuisce quando le misure aumentano. Alcuni libri scrivono inoltre l'incertezza con due cifre significative quando la prima è $1$ (per esempio $0{,}14$), o la arrotondano sempre per eccesso. In queste lezioni si usa la semidispersione, con una cifra significativa arrotondata nel modo solito.
```

## Esempi svolti

```ad-example
Esempio 1: il pendolo, con i conti
Scrivi il risultato delle sei misure del pendolo: $12{,}46$, $12{,}56$, $12{,}51$, $12{,}44$, $12{,}53$, $12{,}50$ s, con un cronometro che ha la sensibilità di $0{,}01$ s.

Il valore medio è $\bar{t} = \dfrac{75{,}00}{6} = 12{,}50$ s. La semidispersione è $\Delta t = \dfrac{12{,}56 - 12{,}44}{2} = 0{,}06$ s, più grande della sensibilità, quindi l'incertezza è $0{,}06$ s.

L'incertezza ha già una sola cifra significativa, ed è in centesimi; anche il valore medio è in centesimi:

$$t = (12{,}50 \pm 0{,}06)\,\text{s}$$
```

```ad-example
Esempio 2: arrotondare incertezza e valore medio
Una biglia scende lungo una guida; con il cronometro (sensibilità $0{,}01$ s) si misura cinque volte il tempo della discesa: $2{,}31$, $2{,}58$, $2{,}44$, $2{,}69$, $2{,}52$ s. Scrivi il risultato.

Il valore medio è

$$\bar{t} = \frac{2{,}31 + 2{,}58 + 2{,}44 + 2{,}69 + 2{,}52}{5} = \frac{12{,}54}{5} = 2{,}508\,\text{s}$$

La semidispersione è $\Delta t = \dfrac{2{,}69 - 2{,}31}{2} = \dfrac{0{,}38}{2} = 0{,}19$ s. Con una cifra significativa diventa $0{,}2$ s, perché la cifra che si toglie, il $9$, è $5$ o più. L'incertezza è ora in decimi, e il valore medio si arrotonda ai decimi: $2{,}508$ diventa $2{,}5$, perché la prima cifra che si toglie è lo $0$.

$$t = (2{,}5 \pm 0{,}2)\,\text{s}$$
```

```ad-example
Esempio 3: una misura sbagliata
Sei misure del tempo di caduta di una pallina (sensibilità $0{,}01$ s): $0{,}62$, $0{,}57$, $0{,}65$, $0{,}60$, $0{,}91$, $0{,}63$ s. Chi misurava si è accorto di aver fermato il cronometro in ritardo nella quinta misura. Scrivi il risultato.

La quinta misura è uno sbaglio, con una causa nota, e si scarta. Con le altre cinque:

$$\bar{t} = \frac{0{,}62 + 0{,}57 + 0{,}65 + 0{,}60 + 0{,}63}{5} = \frac{3{,}07}{5} = 0{,}614\,\text{s} \qquad \Delta t = \frac{0{,}65 - 0{,}57}{2} = 0{,}04\,\text{s}$$

L'incertezza è in centesimi, quindi $\bar{t}$ si arrotonda ai centesimi: $t = (0{,}61 \pm 0{,}04)\,\text{s}$.

Tenendo anche lo $0{,}91$ si avrebbe $\bar{t} = \dfrac{3{,}98}{6} = 0{,}6633$ s e $\Delta t = \dfrac{0{,}91 - 0{,}57}{2} = 0{,}17$ s, cioè $(0{,}7 \pm 0{,}2)\,\text{s}$: una sola misura sbagliata rende l'incertezza più di quattro volte più grande e sposta il valore medio.
```

## Confrontare due misure

Due gruppi misurano la stessa grandezza e trovano due valori diversi. Non per questo uno dei due ha sbagliato: ogni misura è un intervallo, da $\bar{x} - \Delta x$ a $\bar{x} + \Delta x$, e ciò che conta è se i due intervalli hanno punti in comune. Due misure sono **compatibili** se i loro intervalli si sovrappongono almeno in parte; sono **incompatibili** se gli intervalli sono separati. Allo stesso modo una misura è compatibile con un valore di riferimento (quello di una tabella, o quello dato da un campione) se il valore di riferimento sta dentro il suo intervallo.

```ad-example
Esempio 4: tre gruppi e lo stesso pendolo
Tre gruppi misurano il tempo di $10$ oscillazioni dello stesso pendolo e trovano $t_A = (12{,}50 \pm 0{,}06)\,\text{s}$, $t_B = (12{,}62 \pm 0{,}04)\,\text{s}$, $t_C = (12{,}6 \pm 0{,}1)\,\text{s}$. Quali misure sono compatibili?

Gli intervalli sono: per A da $12{,}44$ a $12{,}56$ s, per B da $12{,}58$ a $12{,}66$ s, per C da $12{,}5$ a $12{,}7$ s.

```tikz
% nome: misure-compatibili-intervalli
% alt: Tre intervalli su una retta dei tempi da 12,40 a 12,70 secondi: A va da 12,44 a 12,56, B da 12,58 a 12,66, C da 12,5 a 12,7; A e B sono separati, C si sovrappone a tutti e due
% svg: misure-compatibili-intervalli-b0045293.svg 221x81
\begin{tikzpicture}[x=14cm]
\draw[->] (12.39,0) -- (12.72,0) node[right] {\small $t$ (s)};
\foreach \x/\l in {12.40/12{,}40,12.50/12{,}50,12.60/12{,}60,12.70/12{,}70} {\draw (\x,-0.08) -- (\x,0.08); \node[below] at (\x,-0.08) {\scriptsize $\l$};}
\foreach \x in {12.45,12.55,12.65} \draw (\x,-0.05) -- (\x,0.05);
\draw[thick, blue] (12.44,0.5) -- (12.56,0.5);
\draw[thick, blue] (12.44,0.42) -- (12.44,0.58);
\draw[thick, blue] (12.56,0.42) -- (12.56,0.58);
\fill[blue] (12.50,0.5) circle (1.8pt);
\node[left] at (12.43,0.5) {\small A};
\draw[thick, red] (12.58,0.9) -- (12.66,0.9);
\draw[thick, red] (12.58,0.82) -- (12.58,0.98);
\draw[thick, red] (12.66,0.82) -- (12.66,0.98);
\fill[red] (12.62,0.9) circle (1.8pt);
\node[left] at (12.57,0.9) {\small B};
\draw[thick, green!50!black] (12.5,1.3) -- (12.7,1.3);
\draw[thick, green!50!black] (12.5,1.22) -- (12.5,1.38);
\draw[thick, green!50!black] (12.7,1.22) -- (12.7,1.38);
\fill[green!50!black] (12.6,1.3) circle (1.8pt);
\node[left] at (12.49,1.3) {\small C};
\end{tikzpicture}
```

A e B sono incompatibili: A arriva fino a $12{,}56$ s e B comincia da $12{,}58$ s. C è compatibile con A (hanno in comune i tempi da $12{,}50$ a $12{,}56$ s) e con B (da $12{,}58$ a $12{,}66$ s).

Due misure incompatibili della stessa grandezza fanno pensare a un errore sistematico in almeno una delle due, o a un'incertezza stimata troppo piccola: il passo successivo è cercarne la causa, per esempio confrontando i cronometri o il modo di contare le oscillazioni.
```

```ad-warning
Compatibili non vuol dire uguali
$12{,}50$ s e $12{,}6$ s sono numeri diversi, ma le misure $(12{,}50 \pm 0{,}06)\,\text{s}$ e $(12{,}6 \pm 0{,}1)\,\text{s}$ sono compatibili, perché i loro intervalli si toccano. Al contrario, due valori vicini con incertezze molto piccole possono essere incompatibili. Si confrontano gli intervalli, non i valori medi.
```
