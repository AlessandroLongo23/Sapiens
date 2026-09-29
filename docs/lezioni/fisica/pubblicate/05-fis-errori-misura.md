# Errori casuali ed errori sistematici

Se cinque compagni misurano con il cronometro quanto impiega la stessa pallina a cadere dalla stessa altezza, trovano cinque tempi diversi: $1{,}32$ s, $1{,}41$ s, $1{,}28$ s, $1{,}37$ s, $1{,}35$ s. Nessuno ha sbagliato: nessuna misura è esatta, e ogni misura porta con sé un'incertezza. In fisica la differenza tra il valore misurato e il valore vero si chiama **errore di misura**, e non vuol dire sbaglio: è una parte inevitabile di ogni misura, che si può ridurre e stimare ma non eliminare. Capire da dove viene è il primo passo per scrivere una misura in modo onesto, con il suo valore e la sua incertezza, come si fa nella lezione [Valore medio e incertezza di una serie di misure](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/valore-medio-e-incertezza-di-una-serie-di-misure).

## Da dove vengono le incertezze

Una misura mette insieme uno strumento, una persona che lo usa, un oggetto e un ambiente, e ognuno dei quattro aggiunge la sua parte di incertezza:

- lo strumento non distingue valori più vicini della sua sensibilità (un righello con le tacche dei millimetri non vede i decimi di millimetro), e può essere tarato male, come si vede nella lezione [Gli strumenti di misura](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/gli-strumenti-di-misura);
- chi misura ha un tempo di reazione quando preme il cronometro, e può leggere la scala da una posizione storta;
- l'oggetto può non essere definito con precisione: il bordo di un tavolo è smussato, il diametro di un sasso cambia a seconda di dove lo misuri;
- l'ambiente cambia: la temperatura allunga il metro a nastro, una corrente d'aria sposta il piatto della bilancia.

Gli errori che nascono da queste cause si dividono in due famiglie, che si comportano in modo opposto: gli errori sistematici e gli errori casuali.

## Gli errori sistematici

Un **errore sistematico** sposta tutte le misure nello stesso verso, sempre in più o sempre in meno, e più o meno della stessa quantità. Le cause tipiche sono tre:

- uno strumento starato: una bilancia che a piatto vuoto segna $0{,}4$ g aggiunge $0{,}4$ g a ogni pesata; un righello con il bordo consumato fa partire la misura da un punto sbagliato;
- un metodo sbagliato: leggere la scala sempre dallo stesso lato, cronometrare un'oscillazione partendo sempre in ritardo;
- una condizione non controllata: un metro a nastro d'acciaio usato al sole, più lungo che alla temperatura a cui è stato tarato, dà misure sempre un po' più corte del vero.

L'errore di lettura più comune è l'**errore di parallasse**: la lancetta di uno strumento sta un po' sopra la scala, e se la guardi di sbieco la vedi proiettata su una tacca che non è la sua. Il modo giusto è guardare con l'occhio sulla perpendicolare alla scala, proprio sopra la punta della lancetta.

```tikz
% nome: errore-di-parallasse
% alt: Una scala graduata da 10 a 14 vista di lato, con la punta di una lancetta sopra la tacca 12: l'occhio messo sulla verticale della punta legge 12, l'occhio spostato a destra vede la punta proiettata circa su 11,7
% svg: errore-di-parallasse-a75cbfda.svg 203x132
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (4.3,0);
\foreach \x in {0,0.2,...,4} \draw[thin] (\x,0) -- (\x,0.1);
\foreach \x/\n in {0/10,1/11,2/12,3/13,4/14} {\draw (\x,0) -- (\x,0.2); \node[below] at (\x,0) {\small $\n$};}
\draw[very thick] (0.6,0.5) -- (2,0.5);
\fill (0.6,0.5) circle (1.5pt);
\draw (2,2.7) ellipse (0.2 and 0.1);
\fill (2,2.7) circle (0.05);
\draw (3.3,2.5) ellipse (0.2 and 0.1);
\fill (3.3,2.5) circle (0.05);
\draw[dashed, semithick, green!50!black] (2,2.6) -- (2,0);
\draw[dashed, semithick, red] (3.3,2.4) -- (1.675,0);
\fill[red] (1.675,0) circle (1.5pt);
\fill[green!50!black] (2,0) circle (1.5pt);
\node[left] at (1.75,2.7) {\small giusto};
\node[above] at (1.1,0.5) {\small lancetta};
\node[right] at (3.5,2.5) {\small di sbieco};
\end{tikzpicture}
```

Nella figura la punta della lancetta è sopra il $12$. Chi guarda dall'alto legge $12$; chi guarda da destra vede la punta proiettata circa su $11{,}7$. Se legge sempre da destra, sbaglia sempre in meno: è un errore sistematico.

Ripetere la misura non serve a niente contro un errore sistematico, perché ogni nuova misura è spostata come le altre. Un errore sistematico si scopre cambiando qualcosa: si misura un oggetto di cui si conosce il valore (un campione, come un pesetto da $50{,}00$ g), si usa un altro strumento o un altro metodo, e si confrontano i risultati. Quando se ne conosce la causa, si elimina alla radice (si azzera la bilancia prima di pesare, si legge dalla perpendicolare) oppure si corregge il risultato.

```ad-example
Esempio 1: una bilancia che non segna zero
Una bilancia da cucina, a piatto vuoto, segna $0{,}4$ g invece di $0$. Con quella bilancia una mela pesa $182{,}6$ g. Quanto pesa davvero? E se la bilancia a vuoto segnasse $-0{,}3$ g?

La bilancia aggiunge $0{,}4$ g a ogni pesata, quindi si toglie la lettura a vuoto:

$$m = 182{,}6\,\text{g} - 0{,}4\,\text{g} = 182{,}2\,\text{g}$$

Se a vuoto segna $-0{,}3$ g, ogni lettura è più bassa del vero di $0{,}3$ g, e la correzione va nell'altro verso:

$$m = 182{,}6\,\text{g} - (-0{,}3\,\text{g}) = 182{,}9\,\text{g}$$

In tutti e due i casi la regola è la stessa: valore corretto uguale alla lettura meno la lettura a vuoto, con il suo segno.
```

```ad-warning
La correzione nel verso sbagliato
Se la bilancia segna $0{,}4$ g a vuoto, il valore vero è più piccolo della lettura: si toglie $0{,}4$ g, non si aggiunge. Controlla sempre il verso con il caso più semplice, il piatto vuoto: la correzione deve riportare a zero proprio quella lettura.
```

## Gli errori casuali

Un **errore casuale** sposta le misure a volte in più e a volte in meno, di quantità diverse, senza una regola. Nasce da tante piccole cause che non si controllano: il tempo di reazione di chi preme il cronometro, che cambia da una volta all'altra; la posizione dell'occhio, che si sposta di poco; le vibrazioni del tavolo; le piccole differenze nel modo di appoggiare il righello. Sono errori casuali quelli dei cinque tempi della pallina che cade: la stessa pallina, la stessa altezza, cinque risultati tra $1{,}28$ s e $1{,}41$ s.

Poiché vanno in tutti e due i versi, gli errori casuali in parte si compensano. Per questo contro di essi funziona proprio quello che contro gli errori sistematici non serve: ripetere la misura molte volte e fare la media. Quanto sono sparse le misure dice anche quanto sono grandi gli errori casuali, ed è da questa dispersione che si ricava l'incertezza, come si vede nella lezione [Valore medio e incertezza di una serie di misure](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/valore-medio-e-incertezza-di-una-serie-di-misure).

```ad-warning
Il tempo di reazione è tutti e due gli errori
Chi preme il cronometro reagisce sempre con un piccolo ritardo, e il ritardo cambia da una volta all'altra. La parte che cambia è un errore casuale; la parte media, se il ritardo alla partenza e all'arrivo non è lo stesso, è un errore sistematico, e la media delle misure non la toglie. Per questo i tempi brevi si misurano male con il cronometro a mano: si cronometrano dieci oscillazioni di un pendolo invece di una.
```

## Gli sbagli

Leggere $3{,}8$ invece di $8{,}3$, scrivere i centimetri al posto dei millimetri, dimenticare di azzerare lo strumento una sola volta: questi non sono errori di misura ma **sbagli** (qualche libro li chiama errori grossolani). Non si trattano con la media, perché non hanno niente a che fare con l'incertezza della misura: una misura sbagliata si riconosce, di solito perché è molto lontana dalle altre, si scarta dicendo perché, e se si può si rifà.

```ad-warning
Scartare una misura solo perché è scomoda
Una misura lontana dalle altre si scarta quando c'è un motivo per pensare che sia uno sbaglio (hai visto il cronometro partire in ritardo, hai letto male la scala). Una misura scartata senza motivo, solo perché rovina la media, falsa il risultato: nella relazione di laboratorio va sempre scritto quali misure hai tolto e perché.
```

## Casuali e sistematici a confronto

| | Errori casuali | Errori sistematici |
|---|---|---|
| verso | a volte in più, a volte in meno | sempre lo stesso |
| cause tipiche | tempo di reazione, piccole variazioni, vibrazioni | strumento starato, metodo sbagliato, parallasse sempre dallo stesso lato |
| ripetere la misura | li riduce, con la media | non serve |
| come si scoprono | le misure ripetute sono diverse tra loro | confronto con un campione, un altro strumento o un altro metodo |
| come si riducono | più misure, strumento più sensibile, più cura | tarare lo strumento, cambiare metodo, correggere il risultato |

```ad-example
Esempio 2: che errore è?
Per ognuna delle situazioni, di' se l'errore è casuale o sistematico.

1. Un cronometro digitale va avanti di $1$ s ogni $100$ s.
2. Misurando più volte la larghezza di un banco con il metro da sarta, appoggiato ogni volta in modo leggermente diverso, si trovano valori che differiscono di qualche millimetro.
3. Un termometro viene letto sempre dal basso, con l'occhio sotto il livello del liquido.
4. Premendo il cronometro all'arrivo di un compagno che corre, a volte si è in anticipo e a volte in ritardo.

Il cronometro che va avanti allunga tutti i tempi dell'$1\%$: errore sistematico. Il metro appoggiato ogni volta in modo diverso dà misure a volte più lunghe e a volte più corte: errore casuale. Il termometro letto sempre dal basso è un errore di parallasse sempre nello stesso verso: sistematico. L'anticipo e il ritardo nel premere il cronometro cambiano da una volta all'altra: casuale.
```

## Precisione e accuratezza

Casuali e sistematici si vedono bene con quattro tiratori che mirano al centro di un bersaglio. Ogni colpo è una misura, il centro è il valore vero.

- Le misure sono **precise** quando sono vicine tra loro: gli errori casuali sono piccoli.
- Le misure sono **accurate** quando il loro valore medio è vicino al valore vero: gli errori sistematici sono piccoli.

```tikz
% nome: bersagli-precisione-accuratezza
% alt: Quattro bersagli con sei colpi ciascuno: in alto a sinistra i colpi sono stretti al centro, misure precise e accurate; in alto a destra sono stretti ma lontani dal centro, precise e non accurate; in basso a sinistra sono sparsi attorno al centro, accurate e non precise; in basso a destra sono sparsi e spostati, né precise né accurate
% svg: bersagli-precisione-accuratezza-733cce8e.svg 183x233
\begin{tikzpicture}
\foreach \cx/\cy in {0/0, 2.7/0, 0/-3.1, 2.7/-3.1} {
\draw[thick] (\cx,\cy) circle (1);
\draw (\cx,\cy) circle (0.65);
\draw (\cx,\cy) circle (0.3);
\draw[gray] (\cx-0.08,\cy) -- (\cx+0.08,\cy);
\draw[gray] (\cx,\cy-0.08) -- (\cx,\cy+0.08);
}
\fill[blue] (0.11,0.02) circle (1.5pt);
\fill[blue] (-0.06,0.1) circle (1.5pt);
\fill[blue] (-0.08,-0.06) circle (1.5pt);
\fill[blue] (0.04,-0.11) circle (1.5pt);
\fill[blue] (0.05,0.06) circle (1.5pt);
\fill[blue] (-0.05,-0.01) circle (1.5pt);
\fill[blue] (3.23,0.38) circle (1.5pt);
\fill[blue] (3.06,0.46) circle (1.5pt);
\fill[blue] (3.04,0.3) circle (1.5pt);
\fill[blue] (3.16,0.25) circle (1.5pt);
\fill[blue] (3.17,0.42) circle (1.5pt);
\fill[blue] (3.07,0.35) circle (1.5pt);
\fill[blue] (0.5,-2.99) circle (1.5pt);
\fill[blue] (-0.28,-2.66) circle (1.5pt);
\fill[blue] (-0.39,-3.38) circle (1.5pt);
\fill[blue] (0.17,-3.6) circle (1.5pt);
\fill[blue] (0.22,-2.83) circle (1.5pt);
\fill[blue] (-0.22,-3.16) circle (1.5pt);
\fill[blue] (2.72,-2.68) circle (1.5pt);
\fill[blue] (2.13,-2.42) circle (1.5pt);
\fill[blue] (2.05,-2.97) circle (1.5pt);
\fill[blue] (2.47,-3.14) circle (1.5pt);
\fill[blue] (2.51,-2.55) circle (1.5pt);
\fill[blue] (2.17,-2.8) circle (1.5pt);
\node[align=center, below] at (0,-1.05) {\small precise\\ \small e accurate};
\node[align=center, below] at (2.7,-1.05) {\small precise,\\ \small non accurate};
\node[align=center, below] at (0,-4.15) {\small accurate,\\ \small non precise};
\node[align=center, below] at (2.7,-4.15) {\small né precise\\ \small né accurate};
\end{tikzpicture}
```

Le due qualità sono indipendenti. Nel bersaglio in alto a destra i colpi sono stretti ma tutti spostati: una bilancia molto sensibile ma non azzerata dà proprio misure così. Nel bersaglio in basso a sinistra i colpi sono sparsi, ma il loro centro coincide con il centro del bersaglio: facendo la media di tante misure si arriva vicino al valore vero.

Nella figura qui sotto decidi tu quanto sono grandi i due errori. Spara una serie di colpi, poi aumenta l'errore sistematico: la nuvola dei colpi si sposta, e la media si sposta con lei. Aumenta invece l'errore casuale: la nuvola si allarga, ma con molti colpi la media resta vicina al centro.

```interattivo
% nome: bersaglio-errori
% alt: Un bersaglio su cui si sparano colpi con un bottone, uno alla volta o dieci alla volta; due cursori regolano l'errore sistematico, che sposta la nuvola dei colpi sempre nello stesso verso, e l'errore casuale, che la allarga; una croce arancione segna la media dei colpi, e sotto la figura si leggono il numero dei colpi, la distanza della media dal centro e quanto sono sparsi i colpi
```

```ad-example
Esempio 3: tre bilance e un pesetto campione
Tre gruppi pesano quattro volte, ognuno con la sua bilancia, un pesetto campione da $50{,}00$ g. Quale serie di misure è precisa? Quale è accurata?

$$
\begin{gathered}
\text{A: } 50{,}02 \quad 49{,}98 \quad 50{,}01 \quad 49{,}99 \ \text{g} \\
\text{B: } 50{,}31 \quad 50{,}29 \quad 50{,}30 \quad 50{,}30 \ \text{g} \\
\text{C: } 49{,}7 \quad 50{,}4 \quad 50{,}1 \quad 49{,}8 \ \text{g}
\end{gathered}
$$

Per la precisione si guarda quanto sono lontane tra loro le misure di ogni serie, cioè la differenza tra la più grande e la più piccola: $0{,}04$ g per A, $0{,}02$ g per B, $0{,}7$ g per C. A e B sono precise, C no.

Per l'accuratezza si confronta il valore medio con i $50{,}00$ g del campione. Per A la media è $\dfrac{200{,}00}{4} = 50{,}00$ g, per B è $\dfrac{201{,}20}{4} = 50{,}30$ g, per C è $\dfrac{200{,}0}{4} = 50{,}0$ g. A e C sono accurate, B no: la sua bilancia aggiunge circa $0{,}30$ g a ogni pesata, un errore sistematico che si toglie azzerandola.

La serie A è precisa e accurata; B è precisa ma non accurata; C è accurata ma non precisa.
```

```ad-warning
Precisa non vuol dire giusta
Una serie di misure tutte uguali fino all'ultima cifra dà un'impressione di sicurezza, ma dice solo che gli errori casuali sono piccoli. La serie B dell'esempio 3 è la più precisa delle tre ed è anche l'unica sbagliata. Per sapere se una misura è accurata serve un confronto con qualcosa di esterno: un campione, un valore di riferimento, un altro strumento.
```

```ad-note
Parole che cambiano da un libro all'altro
Qualche libro chiama "precisione" quella che qui è la sensibilità dello strumento, e "esattezza" quella che qui è l'accuratezza. Nel linguaggio dei metrologi l'accuratezza tiene conto di tutti e due gli errori, e l'assenza di errori sistematici si chiama giustezza. Le idee non cambiano: le misure possono essere vicine tra loro, vicine al valore vero, tutte e due le cose o nessuna.
```
