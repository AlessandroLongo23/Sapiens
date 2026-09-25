# Nomenclatura degli alcani

La benzina si classifica con il numero di ottano, e il riferimento per il valore 100 è una sostanza che in laboratorio si chiama 2,2,4-trimetilpentano. Il nome sembra un codice, e lo è: chi conosce le regole della nomenclatura IUPAC ricava da quelle tre parole un solo disegno possibile della molecola, e dal disegno ricava un solo nome. Qui trovi le regole per gli alcani a catena aperta, con i sostituenti metile, etile e propile.

## Gli alcani

Gli **alcani** sono idrocarburi saturi: le molecole contengono solo carbonio e idrogeno, e tutti i legami tra gli atomi di carbonio sono semplici. Ogni atomo di carbonio forma quattro legami, con altri carboni o con atomi di idrogeno.

Un alcano a catena aperta con $n$ atomi di carbonio ha sempre $2n + 2$ atomi di idrogeno:

$$\mathrm{C}_n\mathrm{H}_{2n+2}$$

Il conto è questo: gli $n$ atomi di carbonio hanno in tutto $4n$ legami da formare; i carboni sono uniti tra loro da $n - 1$ legami, e ognuno di questi usa due dei $4n$ posti, uno per ogni estremità. Restano $4n - 2(n - 1) = 2n + 2$ posti, occupati dagli idrogeni. Il conto non dipende dalla forma della catena, quindi la formula vale anche per gli alcani ramificati: il pentano e il 2-metilbutano sono tutti e due $\mathrm{C_5H_{12}}$, perché $2 \cdot 5 + 2 = 12$.

## Formula di struttura, razionale e scheletrica

La stessa molecola si scrive in tre modi, dal più completo al più veloce.

La **formula di struttura** mostra tutti gli atomi e tutti i legami. È chiara ma lunga da scrivere, e con molecole grandi diventa illeggibile.

La **formula razionale** scrive gli atomi di carbonio uno dopo l'altro, ognuno con i suoi idrogeni; i gruppi attaccati a un carbonio della catena vanno tra parentesi subito dopo quel carbonio. Il 2-metilbutano è

$$\mathrm{CH_3CH(CH_3)CH_2CH_3}$$

dove $\mathrm{CH(CH_3)}$ vuol dire che al secondo carbonio è attaccato un gruppo $\mathrm{CH_3}$. Alcuni libri scrivono anche i legami tra i carboni: $\mathrm{CH_3{-}CH(CH_3){-}CH_2{-}CH_3}$.

La **formula scheletrica** disegna solo i legami tra i carboni, come una linea a zigzag. Ogni vertice e ogni estremità della linea è un atomo di carbonio, e gli idrogeni non si scrivono: ogni carbonio ne ha quanti gliene servono per arrivare a quattro legami. Lo zigzag ricorda che i legami di un carbonio saturo non stanno in linea retta.

```molecole
% nome: alcani-metilbutano-due-formule
% alt: Il 2-metilbutano in due forme: a sinistra la formula di struttura con tutti gli atomi di carbonio e di idrogeno, a destra la formula scheletrica a zigzag con una ramificazione
% svg: alcani-metilbutano-due-formule-05d65e3a.svg 416x187
colonne: 2
CC(C)CC | formula di struttura | idrogeni: tutti | carboni: si
CC(C)CC | formula scheletrica
```

Per leggere una formula scheletrica si contano le linee che arrivano a ogni carbonio: un'estremità (una linea) è un $\mathrm{CH_3}$, un vertice con due linee è un $\mathrm{CH_2}$, con tre linee è un $\mathrm{CH}$, con quattro è un carbonio senza idrogeni.

```ad-warning
Dimenticare le estremità nella formula scheletrica
Le estremità della linea sono atomi di carbonio, come i vertici. Nel disegno a destra ci sono quattro segmenti ma cinque carboni: contando solo i vertici se ne trovano due, e il nome della molecola esce sbagliato.
```

## I primi dieci alcani lineari

Negli alcani lineari i carboni formano una sola catena, senza ramificazioni. Il nome è fatto di una radice, che dice quanti carboni ci sono, e della desinenza -ano. Le radici dei primi quattro sono nomi storici; dal cinque in poi vengono dai numeri greci. In italiano la radice del sei è es- ("esano", non "hexano") e quella del sette è ept-.

| Carboni | Radice | Nome | Formula |
|---|---|---|---|
| 1 | met- | metano | $\mathrm{CH_4}$ |
| 2 | et- | etano | $\mathrm{C_2H_6}$ |
| 3 | prop- | propano | $\mathrm{C_3H_8}$ |
| 4 | but- | butano | $\mathrm{C_4H_{10}}$ |
| 5 | pent- | pentano | $\mathrm{C_5H_{12}}$ |
| 6 | es- | esano | $\mathrm{C_6H_{14}}$ |
| 7 | ept- | eptano | $\mathrm{C_7H_{16}}$ |
| 8 | ott- | ottano | $\mathrm{C_8H_{18}}$ |
| 9 | non- | nonano | $\mathrm{C_9H_{20}}$ |
| 10 | dec- | decano | $\mathrm{C_{10}H_{22}}$ |

Nella formula scheletrica il metano, che ha un solo carbonio, si scrive per esteso; l'etano è un segmento solo, con un carbonio a ogni estremità.

```molecole
% nome: alcani-dieci-lineari
% alt: Le formule scheletriche dei primi dieci alcani lineari, dal metano al decano: linee a zigzag sempre più lunghe, con un segmento in più per ogni carbonio aggiunto
% svg: alcani-dieci-lineari-614447a5.svg 574x420
colonne: 2
C | metano
CC | etano
CCC | propano
CCCC | butano
CCCCC | pentano
CCCCCC | esano
CCCCCCC | eptano
CCCCCCCC | ottano
CCCCCCCCC | nonano
CCCCCCCCCC | decano
```

I primi quattro sono gas a temperatura ambiente: il metano è il gas delle cucine, il propano e il butano sono il GPL delle bombole.

## I gruppi alchilici

Se a un alcano si toglie un atomo di idrogeno, resta un gruppo con un legame libero, che si può attaccare a una catena. Questi gruppi si chiamano **gruppi alchilici** e prendono il nome dall'alcano, con la desinenza -ile al posto di -ano. In questa lezione ne servono tre, attaccati alla catena con un carbonio di estremità:

| Alcano | Gruppo alchilico | Formula | Nel nome |
|---|---|---|---|
| metano | metile | $-\mathrm{CH_3}$ | metil |
| etano | etile | $-\mathrm{CH_2CH_3}$ | etil |
| propano | propile | $-\mathrm{CH_2CH_2CH_3}$ | propil |

Nel disegno qui sotto ogni gruppo è colorato dentro una molecola, attaccato al carbonio centrale di una catena.

```molecole
% nome: alcani-gruppi-alchilici
% alt: I tre gruppi alchilici colorati dentro tre molecole in formula scheletrica: un metile, di un carbonio, nel 3-metilpentano; un etile, di due carboni, nel 3-etilpentano; un propile, di tre carboni, nel 4-propileptano
% svg: alcani-gruppi-alchilici-1b3d0844.svg 600x161
colonne: 3
CCC(C)CC | metile | atomi: 3 blu
CCC(CC)CC | etile | atomi: 3 4 blu
CCCC(CCC)CCC | propile | atomi: 4 5 6 blu
```

Un gruppo attaccato alla catena principale al posto di un idrogeno si chiama **sostituente**, o ramificazione.

```ad-note
Il propile attaccato dal carbonio centrale
Il propano si può attaccare a una catena anche con il carbonio di mezzo: il gruppo che si ottiene è ramificato e ha un nome suo, isopropile. In questa lezione i sostituenti sono sempre lineari.
```

## Le regole IUPAC

Il nome di un alcano ramificato si costruisce così:

1. Trova la catena più lunga di atomi di carbonio: è la **catena principale** e dà la radice del nome. Se ci sono due catene lunghe uguali, scegli quella con più ramificazioni.
2. Numera i carboni della catena principale partendo dall'estremità che dà ai sostituenti i numeri più bassi. Le due numerazioni si confrontano un numero alla volta, in ordine crescente: vince quella che ha il numero più basso al primo punto di differenza.
3. Se le due numerazioni danno gli stessi numeri, il numero più basso va al sostituente che viene prima in ordine alfabetico.
4. Scrivi ogni sostituente con il suo numero, che si chiama **locante**. Se lo stesso sostituente compare più volte, metti davanti di-, tri- o tetra- e scrivi un locante per ognuno.
5. Scrivi i sostituenti in ordine alfabetico, senza contare di-, tri- e tetra-, e alla fine il nome della catena principale.

Negli esempi che seguono la catena principale è colorata e numerata. Quando due disegni della stessa molecola sono affiancati, quello a sinistra mostra l'errore e quello a destra il nome giusto.

### La catena principale

La catena principale è la più lunga, non quella scritta in orizzontale. Nella formula scheletrica e nella formula razionale una catena può piegare in corrispondenza di una ramificazione, e allora la catena più lunga passa dentro quello che sembrava un sostituente.

```ad-example
Esempio 1: la catena più lunga non è quella scritta dritta
Dai il nome all'alcano $\mathrm{CH_3CH(CH_2CH_3)CH_2CH_2CH_3}$.

La formula razionale mostra una catena di cinque carboni con un etile sul secondo: viene da chiamarlo 2-etilpentano. Ma se la catena parte dal carbonio in fondo all'etile, passa per il secondo carbonio e prosegue verso destra, i carboni sono sei. La catena principale è quindi un esano, e il carbonio rimasto fuori, il primo della catena di cinque, diventa un metile.

Numerando la catena di sei dall'estremità vicina alla ramificazione, il metile sta sul carbonio 3; dall'altra parte starebbe sul 4. Il nome è 3-metilesano.

```molecole
% nome: alcani-catena-nascosta
% alt: La stessa molecola disegnata due volte: a sinistra è colorata la catena di cinque carboni scritta dritta, con l'etile come ramificazione, ed è sbagliata; a destra è colorata la catena di sei carboni che piega dentro l'etile, con un metile sul carbonio 3
% svg: alcani-catena-nascosta-813b7190.svg 488x124
colonne: 2
CC(CC)CCC | sbagliato: 2-etilpentano | catena: 0 1 4 5 6
CC(CC)CCC | giusto: 3-metilesano | catena: 3 2 1 4 5 6
```
```

```ad-warning
Prendere per principale la catena scritta dritta
Un etile sul carbonio 2 allunga la catena, e lo stesso fa un metile sul carbonio 1: "1-metilbutano" è il pentano, "2-etilpentano" è il 3-metilesano. Prima di numerare, cerca la catena più lunga partendo da ogni estremità del disegno, anche da quelle dei sostituenti.
```

```ad-tip
Un controllo sul nome finito
Nel nome giusto di un alcano con sostituenti lineari un metile non sta mai sul carbonio 1, un etile mai sull'1 o sul 2, un propile mai prima del 4. Se trovi uno di questi numeri, la catena principale che hai scelto non è la più lunga.
```

Quando due catene sono lunghe uguali, la regola dice di scegliere quella con più ramificazioni. Spesso le due catene danno lo stesso nome, e allora la scelta non conta; a volte no.

```ad-example
Esempio 2: due catene lunghe uguali
Dai il nome all'alcano $\mathrm{CH_3CH(CH_3)CH(CH_2CH_3)CH_2CH_2CH_3}$.

Ci sono due catene di sei carboni. La prima è quella scritta dritta, dal primo carbonio all'ultimo: ha due ramificazioni, un metile e un etile. La seconda parte dal fondo dell'etile e prosegue verso destra: ha una sola ramificazione, un gruppo di tre carboni attaccato con il carbonio centrale, cioè ramificato. Si sceglie la prima, che ha più ramificazioni.

Numerando da sinistra i locanti sono 2 e 3, da destra 4 e 5. Il nome è 3-etil-2-metilesano.

```molecole
% nome: alcani-due-catene
% alt: La stessa molecola disegnata due volte con due catene di sei carboni colorate: a sinistra la catena con una sola ramificazione, sbagliata; a destra la catena con due ramificazioni, un metile sul carbonio 2 e un etile sul carbonio 3
% svg: alcani-due-catene-299cb074.svg 560x140
colonne: 2
CC(C)C(CC)CCC | sbagliato: una ramificazione | catena: 5 4 3 6 7 8
CC(C)C(CC)CCC | giusto: 3-etil-2-metilesano | catena: 0 1 3 6 7 8
```
```

La regola ha un vantaggio pratico: la catena con più ramificazioni lascia fuori sostituenti più piccoli e più semplici, come in questo esempio, dove l'altra catena avrebbe lasciato fuori un gruppo ramificato.

### La numerazione

Trovata la catena principale, si numerano i suoi carboni da un'estremità all'altra. Le estremità sono due, e si sceglie quella che dà ai sostituenti i numeri più bassi.

```ad-example
Esempio 3: un solo sostituente
Dai il nome all'alcano $\mathrm{CH_3CH(CH_3)CH_2CH_2CH_3}$.

La catena principale ha cinque carboni: è un pentano con un metile. Numerando da sinistra il metile sta sul carbonio 2, numerando da destra sul 4. Si sceglie il numero più basso: il nome è 2-metilpentano.

```molecole
% nome: alcani-numerazione-metilpentano
% alt: Il 2-metilpentano numerato in due modi: a sinistra dalla parte sbagliata, con il metile sul carbonio 4; a destra dalla parte giusta, con il metile sul carbonio 2
% svg: alcani-numerazione-metilpentano-33ce6a90.svg 506x102
colonne: 2
CC(C)CCC | sbagliato: 4-metilpentano | catena: 5 4 3 1 0
CC(C)CCC | giusto: 2-metilpentano | catena: 0 1 3 4 5
```
```

```ad-warning
Numerare dalla parte sbagliata
Chi numera sempre da sinistra, o dalla parte dove la formula comincia, scrive 4-metilpentano. Il nome descrive la molecola giusta, ma non è quello IUPAC: la numerazione va scelta ogni volta, guardando tutte e due le estremità.
```

Con più sostituenti si scrivono i locanti di ciascuna numerazione in ordine crescente e si confrontano un numero alla volta. Vince la numerazione che ha il numero più basso al primo punto in cui le due sequenze sono diverse.

```ad-example
Esempio 4: il primo punto di differenza
Dai il nome all'isoottano, $\mathrm{CH_3C(CH_3)_2CH_2CH(CH_3)CH_3}$.

La catena principale ha cinque carboni, con tre metili: due sul secondo carbonio da sinistra e uno sul quarto. Numerando da sinistra i locanti sono $2, 2, 4$; da destra sono $2, 4, 4$. Il primo numero è $2$ in tutte e due; al secondo numero si trova $2$ contro $4$, e vince la numerazione da sinistra.

I tre metili si scrivono insieme con il prefisso tri-, e ognuno ha il suo locante, anche i due sullo stesso carbonio. Il nome è 2,2,4-trimetilpentano.

```molecola
% nome: alcani-isoottano
% alt: Formula scheletrica del 2,2,4-trimetilpentano con la catena principale di cinque carboni colorata e numerata: due metili sul carbonio 2 e uno sul carbonio 4
% svg: alcani-isoottano-283ccbab.svg 201x102
smiles: CC(C)(C)CC(C)C
catena: 0 1 4 5 6
legenda: 2,2,4-trimetilpentano
```

L'isoottano ha otto carboni, come l'ottano: la formula è $\mathrm{C_8H_{18}}$ per tutti e due, anche se il nome finisce in "pentano". La radice dice quanti carboni ha la catena principale, non quanti ne ha la molecola.
```

```ad-example
Esempio 5: conta il primo numero diverso, non la somma
Dai il nome all'alcano $\mathrm{CH_3CH(CH_3)CH_2CH_2CH_2CH_2CH(CH_3)CH(CH_3)CH_2CH_3}$.

La catena principale ha dieci carboni, con tre metili. Numerando da sinistra i locanti sono $2, 7, 8$; da destra sono $3, 4, 9$. Il primo numero è già diverso, $2$ contro $3$, e vince la numerazione da sinistra. Il nome è 2,7,8-trimetildecano.

```molecola
% nome: alcani-primo-punto
% alt: Formula scheletrica del 2,7,8-trimetildecano con la catena principale di dieci carboni colorata e numerata: metili sui carboni 2, 7 e 8
% svg: alcani-primo-punto-c040593e.svg 225x157
smiles: CC(C)CCCCC(C)C(C)CC
catena: 0 1 3 4 5 6 7 9 11 12
legenda: 2,7,8-trimetildecano
```
```

```ad-warning
Sommare i locanti
Nell'esempio 5 la somma dei locanti da destra è più piccola ($3 + 4 + 9 = 16$, contro $2 + 7 + 8 = 17$), ma la somma non c'entra: si confrontano i numeri uno alla volta, e il primo diverso decide. Il nome 3,4,9-trimetildecano è sbagliato.
```

Se le due numerazioni danno esattamente gli stessi locanti, decide l'ordine alfabetico: il numero più basso va al sostituente il cui nome viene prima nell'alfabeto.

```ad-example
Esempio 6: la numerazione decisa dall'ordine alfabetico
Dai il nome all'alcano $\mathrm{CH_3CH_2CH(CH_2CH_3)CH_2CH(CH_3)CH_2CH_3}$.

La catena principale ha sette carboni, con un etile e un metile. Da sinistra l'etile sta sul carbonio 3 e il metile sul 5; da destra il metile sta sul 3 e l'etile sul 5. I locanti sono $3, 5$ in tutte e due le numerazioni, quindi decide l'ordine alfabetico: etile viene prima di metile, e il numero più basso va all'etile. Il nome è 3-etil-5-metileptano.

```molecole
% nome: alcani-numerazione-alfabetica
% alt: Il 3-etil-5-metileptano numerato in due modi: a sinistra il metile ha il numero 3 e l'etile il 5, ed è sbagliato; a destra l'etile ha il 3 e il metile il 5
% svg: alcani-numerazione-alfabetica-e5d8bc18.svg 614x128
colonne: 2
CCC(CC)CC(C)CC | sbagliato: 5-etil-3-metileptano | catena: 9 8 6 5 2 1 0
CCC(CC)CC(C)CC | giusto: 3-etil-5-metileptano | catena: 0 1 2 5 6 8 9
```
```

L'ordine alfabetico si usa solo in questo caso, quando i numeri sono proprio gli stessi. Se i locanti sono diversi vince sempre la regola del primo punto di differenza, anche se il numero più basso finisce al metile.

### Come si scrive il nome

Il nome si scrive tutto attaccato, con queste convenzioni:

- tra due numeri va una virgola: 2,2,4;
- tra un numero e una lettera va un trattino: 2-metil, 3-etil-2-metil;
- i sostituenti perdono la e finale (metil, etil, propil) e l'ultimo si attacca alla radice senza trattino: 3-metilesano, 3-etileptano;
- i sostituenti uguali si raccolgono con di-, tri-, tetra-, con tanti locanti quante sono le copie: 2,2-dimetil, 2,3,4-trimetil;
- i sostituenti diversi vanno in ordine alfabetico (etil, metil, propil), e i prefissi di-, tri-, tetra- non contano per l'ordine: dimetil va sotto la m.

```ad-example
Esempio 7: sostituenti diversi e prefissi
Dai il nome all'alcano $\mathrm{CH_3C(CH_3)_2CH_2CH_2CH(CH_2CH_3)CH_2CH_3}$.

La catena principale ha sette carboni: è un eptano. Sul secondo carbonio da sinistra ci sono due metili, sul quinto un etile. Da sinistra i locanti sono $2, 2, 5$, da destra $3, 6, 6$: vince la numerazione da sinistra.

I due metili diventano 2,2-dimetil. Per l'ordine alfabetico dimetil conta come metil, quindi etil viene prima. Il nome è 5-etil-2,2-dimetileptano.

```molecola
% nome: alcani-etil-dimetileptano
% alt: Formula scheletrica del 5-etil-2,2-dimetileptano con la catena principale di sette carboni colorata e numerata: due metili sul carbonio 2 e un etile sul carbonio 5
% svg: alcani-etil-dimetileptano-d0396dc4.svg 228x111
smiles: CC(C)(C)CCC(CC)CC
catena: 0 1 4 5 6 7 8
legenda: 5-etil-2,2-dimetileptano
```
```

```ad-warning
Mettere i sostituenti in ordine di numero
Il nome dell'esempio 7 non è "2,2-dimetil-5-etileptano": i sostituenti vanno in ordine alfabetico, non nell'ordine dei locanti. E dimetil non va sotto la d: i prefissi di-, tri-, tetra- non contano.
```

```ad-warning
Dimenticare di- e tri-
"2,2-metilbutano" e "2-dimetilbutano" sono nomi sbagliati: con due metili servono il prefisso di- e due locanti, 2,2-dimetilbutano. Il numero dei locanti e il prefisso devono sempre andare d'accordo.
```

## Esempi svolti

```ad-example
Esempio 8: dalla formula razionale
Dai il nome all'alcano $\mathrm{CH_3CH(CH_3)CH_2CH(CH_2CH_3)CH_2CH_3}$.

La catena scritta dritta ha sei carboni. Cercando catene più lunghe: dal fondo dell'etile, passando per il quarto carbonio e andando verso sinistra, i carboni sono ancora sei, non di più. Le due catene hanno le stesse ramificazioni, un metile e un etile, e danno lo stesso nome: si può prendere quella scritta dritta.

Da sinistra il metile sta sul 2 e l'etile sul 4, cioè locanti $2, 4$; da destra l'etile sta sul 3 e il metile sul 5, cioè $3, 5$. Vince la numerazione da sinistra. Etil va prima di metil, anche se ha il numero più alto. Il nome è 4-etil-2-metilesano.

```molecola
% nome: alcani-etil-metilesano
% alt: Formula scheletrica del 4-etil-2-metilesano con la catena principale di sei carboni colorata e numerata: un metile sul carbonio 2 e un etile sul carbonio 4
% svg: alcani-etil-metilesano-7c0c991e.svg 183x109
smiles: CC(C)CC(CC)CC
catena: 0 1 3 4 7 8
legenda: 4-etil-2-metilesano
```
```

```ad-example
Esempio 9: tre sostituenti diversi
Dai il nome all'alcano $\mathrm{CH_3CH_2CH(CH_3)CH(CH_2CH_3)CH(CH_2CH_2CH_3)CH_2CH_2CH_2CH_3}$.

La catena scritta dritta ha nove carboni. Le catene che entrano in un sostituente sono più corte: dal fondo del propile se ne contano al massimo $3 + 5 = 8$, dal fondo dell'etile $2 + 6 = 8$, dal metile $1 + 7 = 8$. La catena principale è un nonano.

Sulla catena ci sono un metile, un etile e un propile. Numerando da sinistra i locanti sono $3, 4, 5$, da destra $5, 6, 7$: vince la numerazione da sinistra, con il metile sul 3, l'etile sul 4 e il propile sul 5. In ordine alfabetico vengono etil, metil, propil, e il nome è 4-etil-3-metil-5-propilnonano.

```molecola
% nome: alcani-tre-sostituenti
% alt: Formula scheletrica del 4-etil-3-metil-5-propilnonano con la catena principale di nove carboni colorata e numerata: un metile sul carbonio 3, un etile sul 4 e un propile sul 5
% svg: alcani-tre-sostituenti-32899c85.svg 273x175
smiles: CCC(C)C(CC)C(CCC)CCCC
catena: 0 1 2 4 7 11 12 13 14
legenda: 4-etil-3-metil-5-propilnonano
```
```

## Dal nome alla formula

Il procedimento si può fare al contrario: dal nome si ricava la molecola. Si parte dalla fine del nome, che dice quanti carboni ha la catena principale, si numerano i carboni e si attaccano i sostituenti ai carboni indicati dai locanti.

```ad-example
Esempio 10: disegnare il 4-etil-2,3-dimetileptano
La radice ept- dice che la catena principale ha sette carboni: si disegna uno zigzag di sette carboni e si numera da un'estremità. Poi si attaccano un etile al carbonio 4 e due metili, uno al carbonio 2 e uno al 3.

```molecola
% nome: alcani-dal-nome
% alt: Formula scheletrica del 4-etil-2,3-dimetileptano con la catena principale di sette carboni colorata e numerata: metili sui carboni 2 e 3, etile sul carbonio 4
% svg: alcani-dal-nome-2d420506.svg 228x129
smiles: CC(C)C(C)C(CC)CCC
catena: 0 1 3 5 8 9 10
legenda: 4-etil-2,3-dimetileptano
```

In formula razionale: $\mathrm{CH_3CH(CH_3)CH(CH_3)CH(CH_2CH_3)CH_2CH_2CH_3}$.

Per controllare, si rifà il nome dalla molecola disegnata: la catena più lunga ha sette carboni, da destra i locanti sarebbero $4, 5, 6$ contro i $2, 3, 4$ da sinistra, e l'ordine alfabetico mette l'etil prima dei metil. Il nome torna. La formula molecolare è $\mathrm{C_{11}H_{24}}$: $7 + 2 + 1 + 1 = 11$ carboni e $2 \cdot 11 + 2 = 24$ idrogeni.
```
