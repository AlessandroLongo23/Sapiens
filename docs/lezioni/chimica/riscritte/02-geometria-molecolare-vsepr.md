# La geometria delle molecole (teoria VSEPR)

La formula di Lewis dell'acqua dice quali atomi sono legati tra loro, ma non dice che forma ha la molecola: i due idrogeni potrebbero stare da parti opposte dell'ossigeno, in linea retta, oppure formare un angolo. La molecola vera è piegata, con un angolo di circa $104{,}5^\circ$, e da questo dipendono molte proprietà dell'acqua, a cominciare dal fatto che è polare. La teoria VSEPR permette di prevedere la forma di una molecola partendo dalla sua formula di Lewis, con un solo principio e un po' di conti sugli elettroni.

## L'idea: le coppie di elettroni si respingono

La sigla VSEPR viene dall'inglese Valence Shell Electron Pair Repulsion, cioè repulsione tra le coppie di elettroni del guscio di valenza. La teoria è stata proposta da Ronald Gillespie e Ronald Nyholm nel 1957, e si applica a un atomo alla volta: di solito all'atomo centrale, quello legato a tutti gli altri.

Intorno all'atomo centrale ci sono due tipi di coppie di elettroni: le coppie di legame, condivise con un altro atomo, e le **coppie solitarie**, che appartengono solo all'atomo centrale (i libri le chiamano anche coppie non condivise o doppietti liberi). Le coppie hanno tutte carica negativa e si respingono, quindi si sistemano intorno all'atomo il più lontano possibile l'una dall'altra.

Una regione dello spazio intorno all'atomo centrale occupata da elettroni si chiama **dominio elettronico**. Un dominio è un legame con un altro atomo, semplice, doppio o triplo, oppure una coppia solitaria. Un doppio legame ha quattro elettroni, ma sono tutti diretti verso lo stesso atomo, e per questo conta come un solo dominio.

Il **numero sterico** dell'atomo centrale è il numero dei suoi domini:

$$\text{numero sterico} = \text{atomi legati} + \text{coppie solitarie}$$

Dal numero sterico si ricava come si dispongono i domini, perché c'è un solo modo di tenerli il più lontano possibile:

| Numero sterico | Disposizione dei domini | Angolo tra i domini |
|---|---|---|
| $2$ | lungo una retta, da parti opposte | $180^\circ$ |
| $3$ | ai vertici di un triangolo equilatero, nello stesso piano | $120^\circ$ |
| $4$ | ai vertici di un tetraedro regolare | $109{,}5^\circ$ |

## Contare i domini

Per trovare la geometria di una molecola, parti dalla formula e segui questi passi:

1. Individua l'atomo centrale e conta gli atomi legati a lui.
2. Conta le coppie solitarie dell'atomo centrale: ai suoi elettroni di valenza togli quelli che mette nei legami (uno per un legame semplice, due per un doppio, tre per un triplo) e, se la specie è uno ione, la carica. Gli elettroni che restano, divisi per due, sono le coppie solitarie.
3. Somma atomi legati e coppie solitarie: è il numero sterico, che dà la disposizione dei domini.
4. Dai il nome alla geometria guardando solo gli atomi, come nelle prossime sezioni.

Il passo 2, scritto come formula:

$$\text{coppie solitarie} = \frac{\text{elettroni di valenza} - \text{carica} - \text{elettroni nei legami}}{2}$$

Gli elettroni di valenza sono quelli del guscio più esterno, e per gli elementi dei gruppi principali si leggono dal gruppo della tavola periodica: $4$ per il carbonio, $5$ per l'azoto, $6$ per l'ossigeno, $7$ per il cloro. La carica si toglie con il suo segno: uno ione positivo ha un elettrone in meno per ogni carica, uno negativo uno in più.

```ad-warning
Il disegno non mostra le coppie solitarie
Nei disegni delle molecole di questa lezione, e spesso anche negli esercizi, ci sono solo gli atomi e i legami. Le coppie solitarie non si vedono, ma ci sono e contano quanto i legami: le devi trovare tu con il passo 2.
```

## Le geometrie senza coppie solitarie

Quando l'atomo centrale non ha coppie solitarie, ogni dominio porta un atomo, e la forma della molecola è la stessa disposizione dei domini.

### Tetraedrica: il metano

Nel metano, $\mathrm{CH_4}$, il carbonio ha $4$ elettroni di valenza e li mette tutti nei quattro legami con gli idrogeni: non resta nessuna coppia solitaria, e il numero sterico è $4 + 0 = 4$. I quattro idrogeni stanno ai vertici di un tetraedro regolare con il carbonio al centro, e ogni angolo H–C–H vale $109{,}5^\circ$. La geometria si chiama **tetraedrica**.

```molecola3d
% nome: vsepr-metano
% alt: Modello tridimensionale del metano: il carbonio al centro e i quattro idrogeni ai vertici di un tetraedro, con angoli H-C-H di 109,5 gradi
% svg: vsepr-metano-e2b6292a.svg 77x79
% xyz: C -0.000 0.000 -0.000; H -0.684 -0.802 -0.286; H -0.394 0.957 -0.349; H 0.100 0.023 1.087; H 0.978 -0.177 -0.452
carboni: si
smiles: C
angoli: 1-0-2 3-0-4
```

Gli angoli scritti in questa lezione accanto ai modelli li ha misurati il computer sul modello tridimensionale, dopo averne cercato la forma più stabile con un campo di forza (MMFF94), un modello che tratta i legami come molle. Per il metano il calcolo dà $109{,}5^\circ$ per tutti e sei gli angoli, che è anche l'angolo esatto del tetraedro regolare.

```ad-warning
Il disegno piatto inganna
Sul foglio il metano si disegna con i quattro idrogeni a croce, e sembra che gli angoli siano di $90^\circ$ e che la molecola sia quadrata e piatta. Non è così: nello spazio i quattro idrogeni si allontanano di più, fino a $109{,}5^\circ$. Per la VSEPR una molecola quadrata planare ha sei domini, quattro atomi e due coppie solitarie, come il tetrafluoruro di xeno $\mathrm{XeF_4}$, che in questa lezione non incontri.

```molecola
% nome: vsepr-metano-piatto
% alt: Formula di struttura del metano disegnata sul piano: il carbonio al centro e i quattro idrogeni a croce, a 90 gradi l'uno dall'altro
% svg: vsepr-metano-piatto-a7a65ab4.svg 77x79
smiles: C
idrogeni: tutti
carboni: si
```
```

Hanno la stessa geometria tutte le molecole con quattro atomi legati all'atomo centrale e nessuna coppia solitaria: il tetraclorometano $\mathrm{CCl_4}$, il silano $\mathrm{SiH_4}$, lo ione ammonio $\mathrm{NH_4^+}$. Quando gli atomi intorno al centro non sono tutti uguali, come nel diclorometano $\mathrm{CH_2Cl_2}$, la geometria resta tetraedrica, ma gli angoli si allontanano di qualche grado da $109{,}5^\circ$.

### Triangolare planare: il trifluoruro di boro

Il boro ha $3$ elettroni di valenza. Nel trifluoruro di boro, $\mathrm{BF_3}$, li mette tutti nei tre legami con il fluoro: nessuna coppia solitaria, numero sterico $3$. I tre fluori stanno nello stesso piano del boro, ai vertici di un triangolo equilatero, con angoli F–B–F di $120^\circ$. La geometria si chiama **triangolare planare**.

```molecola3d
% nome: vsepr-trifluoruro-di-boro
% alt: Modello tridimensionale del trifluoruro di boro: il boro al centro e i tre fluori nello stesso piano, ai vertici di un triangolo, con angoli F-B-F di 120 gradi
% svg: vsepr-trifluoruro-di-boro-6153094b.svg 66x62
% xyz: F 1.323 -0.579 0.010; B 0.000 0.000 0.003; F -1.163 -0.856 0.025; F -0.160 1.435 -0.038
smiles: FB(F)F
angoli: 0-1-2 0-1-3 2-1-3
```

Il boro, nel $\mathrm{BF_3}$, ha intorno solo sei elettroni e non l'ottetto: per la VSEPR non cambia niente, perché contano i domini e non gli elettroni. Il modello calcolato ha angoli di $120{,}0^\circ$ esatti; per il boro il campo di forza MMFF94 non ha i parametri, e il computer ha usato un campo di forza più generale (UFF).

### Lineare

Con numero sterico $2$ e nessuna coppia solitaria, i due atomi legati stanno da parti opposte dell'atomo centrale, sulla stessa retta: la geometria è **lineare** e l'angolo è di $180^\circ$. L'esempio più noto è il diossido di carbonio, $\mathrm{CO_2}$, che però ha due doppi legami: lo trovi più avanti, nella sezione sui legami doppi e tripli.

## Con le coppie solitarie: la geometria della molecola

Quando l'atomo centrale ha coppie solitarie, bisogna distinguere due cose. I domini, coppie solitarie comprese, si dispongono come dice il numero sterico; la geometria della molecola, invece, si descrive guardando solo le posizioni degli atomi, perché le coppie solitarie non si vedono negli esperimenti che misurano la forma delle molecole.

### Piramidale triangolare: l'ammoniaca

Nell'ammoniaca, $\mathrm{NH_3}$, l'azoto ha $5$ elettroni di valenza e ne mette $3$ nei legami con gli idrogeni. Restano $2$ elettroni, cioè una coppia solitaria, e il numero sterico è $3 + 1 = 4$. I quattro domini stanno ai vertici di un tetraedro, ma uno dei vertici è occupato dalla coppia solitaria: gli atomi formano una piramide con l'azoto in cima e i tre idrogeni alla base. La geometria si chiama **piramidale triangolare** (o piramidale a base triangolare).

```molecola3d
% nome: vsepr-ammoniaca
% alt: Modello tridimensionale dell'ammoniaca: l'azoto in cima a una piramide con i tre idrogeni alla base; gli angoli H-N-H misurati sul modello sono di 106 gradi; la coppia solitaria dell'azoto non è disegnata
% svg: vsepr-ammoniaca-9ea8d879.svg 67x62
% xyz: N -0.000 -0.005 0.296; H 0.915 -0.213 -0.102; H -0.643 -0.683 -0.110; H -0.272 0.901 -0.084
smiles: N
angoli: 1-0-2 1-0-3 2-0-3
```

### Piegata: l'acqua

Nell'acqua, $\mathrm{H_2O}$, l'ossigeno ha $6$ elettroni di valenza e ne mette $2$ nei legami. Restano $4$ elettroni, cioè due coppie solitarie, e il numero sterico è $2 + 2 = 4$. I domini sono ancora ai vertici di un tetraedro, ma due vertici sono coppie solitarie, e i tre atomi formano una V. La geometria si chiama **piegata** (o angolata, o a V).

```molecola3d
% nome: vsepr-acqua
% alt: Modello tridimensionale dell'acqua: l'ossigeno al vertice di una V con i due idrogeni, e un angolo H-O-H di 104 gradi misurato sul modello; le due coppie solitarie dell'ossigeno non sono disegnate
% svg: vsepr-acqua-394f2897.svg 67x27
% xyz: O -0.001 0.398 0.000; H -0.763 -0.200 0.000; H 0.764 -0.198 0.000
smiles: O
angoli: 1-0-2
```

```ad-warning
Chiamare "tetraedrica" l'ammoniaca
L'ammoniaca e l'acqua hanno quattro domini disposti a tetraedro, ma non sono molecole tetraedriche: il nome della geometria si dà guardando solo gli atomi. L'ammoniaca è piramidale triangolare, l'acqua è piegata. Dire "tetraedrica" per l'ammoniaca è confondere la disposizione dei domini con la forma della molecola.
```

```ad-warning
Dimenticare le coppie solitarie
Chi guarda solo gli atomi legati vede tre idrogeni intorno all'azoto e risponde "triangolare planare", oppure due idrogeni intorno all'ossigeno e risponde "lineare". Sono i due errori più frequenti di tutta la VSEPR, e si evitano facendo sempre il conto degli elettroni del passo 2.
```

La tabella riassume le geometrie che nascono da numero sterico $3$ e $4$ con coppie solitarie. La riga con numero sterico $3$ e una coppia solitaria compare con un doppio legame, per esempio nel diossido di zolfo, $\mathrm{SO_2}$, che è piegato con un angolo di poco meno di $120^\circ$.

| Numero sterico | Coppie solitarie | Geometria della molecola | Esempio |
|---|---|---|---|
| $3$ | $1$ | piegata | $\mathrm{SO_2}$ |
| $4$ | $1$ | piramidale triangolare | $\mathrm{NH_3}$ |
| $4$ | $2$ | piegata | $\mathrm{H_2O}$ |

```ad-example
Esempio 1: lo ione ossonio
Qual è la geometria dello ione ossonio, $\mathrm{H_3O^+}$?

L'atomo centrale è l'ossigeno, legato a tre idrogeni. Ha $6$ elettroni di valenza, ma la carica $+1$ gliene toglie uno: ne restano $5$. Tre vanno nei legami, e ne restano $2$, cioè una coppia solitaria:
$$\text{coppie solitarie} = \frac{6 - 1 - 3}{2} = 1$$
Il numero sterico è $3 + 1 = 4$: i domini sono a tetraedro, e con una coppia solitaria la geometria è piramidale triangolare, come nell'ammoniaca.
```

```ad-example
Esempio 2: il tricloruro di fosforo
Qual è la geometria del tricloruro di fosforo, $\mathrm{PCl_3}$?

Il fosforo è nello stesso gruppo dell'azoto e ha $5$ elettroni di valenza. Ne mette $3$ nei legami con i tre cloro, e ne restano $2$: una coppia solitaria. Numero sterico $3 + 1 = 4$, geometria piramidale triangolare.

Anche i cloro hanno coppie solitarie, tre ciascuno, ma non contano: la VSEPR guarda solo le coppie solitarie dell'atomo centrale.
```

## Perché le coppie solitarie stringono gli angoli

Metano, ammoniaca e acqua hanno tutti numero sterico $4$, eppure i loro angoli di legame non sono uguali: la tabella li mette a confronto.

| Molecola | Coppie solitarie | Angolo calcolato sul modello (MMFF94) | Angolo sperimentale |
|---|---|---|---|
| $\mathrm{CH_4}$ | $0$ | $109{,}5^\circ$ | $109{,}5^\circ$ |
| $\mathrm{NH_3}$ | $1$ | $106{,}0^\circ$ | $106{,}7^\circ$ |
| $\mathrm{H_2O}$ | $2$ | $104{,}0^\circ$ | $104{,}5^\circ$ |

Gli angoli sperimentali sono quelli misurati sulle molecole allo stato gassoso, riportati nelle tabelle di riferimento come il Computational Chemistry Comparison and Benchmark Database del NIST; i libri di scuola arrotondano quello dell'ammoniaca a $107^\circ$. Il campo di forza sbaglia di meno di un grado, e soprattutto ritrova lo stesso andamento: più coppie solitarie, angolo più stretto.

Il motivo è che una coppia solitaria occupa più spazio di una coppia di legame. Gli elettroni di un legame sono attirati da due nuclei e stanno in una regione allungata tra i due atomi; quelli di una coppia solitaria sono attirati da un nucleo solo, gli stanno più vicini e si allargano di più intorno a lui. Per questo le repulsioni non sono tutte uguali:

$$\text{solitaria–solitaria} > \text{solitaria–legame} > \text{legame–legame}$$

Nell'ammoniaca la coppia solitaria spinge i tre legami N–H e li avvicina tra loro, e l'angolo scende da $109{,}5^\circ$ a circa $107^\circ$. Nell'acqua le coppie solitarie sono due e spingono ancora di più: l'angolo scende a circa $104{,}5^\circ$.

```ad-warning
Dare $109{,}5^\circ$ a tutte le molecole con quattro domini
L'angolo di $109{,}5^\circ$ è quello del tetraedro regolare, e vale solo quando i quattro domini sono uguali, come nel metano. Con coppie solitarie gli angoli tra gli atomi sono più piccoli: circa $107^\circ$ nell'ammoniaca, circa $104{,}5^\circ$ nell'acqua.
```

```ad-note
Dove la VSEPR si ferma
La VSEPR prevede in che verso cambiano gli angoli, non di quanto. Nel solfuro di idrogeno, $\mathrm{H_2S}$, lo zolfo ha due coppie solitarie come l'ossigeno dell'acqua, ma l'angolo H–S–H è di circa $92^\circ$, molto più stretto di $104{,}5^\circ$. Le molecole con l'atomo centrale del terzo periodo si comportano spesso così, e per spiegarlo servono teorie del legame che vedrai più avanti.
```

## I legami doppi e tripli contano come un dominio

Un doppio o un triplo legame lega l'atomo centrale a un solo atomo, e tutti i suoi elettroni stanno nella regione tra i due atomi. Per la VSEPR è quindi un solo dominio, come un legame semplice. Nel passo 2, invece, gli elettroni del doppio legame si contano tutti: l'atomo centrale ne mette due in un doppio legame e tre in un triplo.

### Il diossido di carbonio

Nel diossido di carbonio (anidride carbonica), $\mathrm{CO_2}$, il carbonio forma due doppi legami, uno con ciascun ossigeno. Mette nei legami $2 + 2 = 4$ elettroni, tutti i suoi: nessuna coppia solitaria. I domini sono due, i due doppi legami, e il numero sterico è $2$: la molecola è lineare, con un angolo O–C–O di $180^\circ$.

```molecola3d
% nome: vsepr-diossido-di-carbonio
% alt: Modello tridimensionale del diossido di carbonio: i due ossigeni legati al carbonio con due doppi legami, sulla stessa retta, con un angolo O-C-O di 180 gradi
% svg: vsepr-diossido-di-carbonio-40b2c467.svg 78x10
% xyz: O -1.405 -0.003 0.000; C -0.000 0.000 0.000; O 1.405 0.003 0.000
smiles: O=C=O
angoli: 0-1-2
```

```ad-warning
Contare un doppio legame come due domini
Se conti le coppie di elettroni invece dei domini, nel $\mathrm{CO_2}$ trovi quattro coppie di legame intorno al carbonio e concludi che è tetraedrico, oppure lo immagini piegato come l'acqua perché ha due atomi di ossigeno. È lineare: i domini sono due, uno per ogni atomo legato.
```

Il cianuro di idrogeno, $\mathrm{HCN}$, ha un legame semplice C–H e un triplo legame C≡N: il carbonio mette $1 + 3 = 4$ elettroni nei legami, non ha coppie solitarie e ha due domini. Anche questa molecola è lineare.

### La formaldeide

Nel metanale (formaldeide), $\mathrm{CH_2O}$, il carbonio è legato a due idrogeni con due legami semplici e all'ossigeno con un doppio legame. Mette nei legami $1 + 1 + 2 = 4$ elettroni, e non ha coppie solitarie. I domini sono tre: numero sterico $3$, geometria triangolare planare.

```molecola3d
% nome: vsepr-metanale
% alt: Modello tridimensionale della formaldeide: il carbonio al centro, l'ossigeno e i due idrogeni nello stesso piano; sul modello l'angolo H-C-H è di 115,5 gradi e gli angoli H-C-O di 122,2 gradi
% svg: vsepr-metanale-a08bb15e.svg 68x62
% xyz: C -0.012 0.002 -0.000; O 1.201 -0.167 0.003; H -0.723 -0.840 -0.004; H -0.466 1.006 0.000
carboni: si
smiles: C=O
angoli: 2-0-3 2-0-1 3-0-1
```

Sul modello gli angoli non sono tutti di $120^\circ$: l'angolo H–C–H è di $115{,}5^\circ$, i due angoli H–C–O di $122{,}2^\circ$, e la somma fa $360^\circ$, perché gli atomi sono tutti nello stesso piano. Il doppio legame ha quattro elettroni e occupa più spazio di un legame semplice: spinge i due legami C–H e li avvicina tra loro, come fa una coppia solitaria. La VSEPR dice che l'angolo H–C–H è un po' minore di $120^\circ$; il valore esatto lo dà il calcolo o la misura.

### L'etene

Nell'etene (etilene), $\mathrm{C_2H_4}$, i due carboni sono uniti da un doppio legame, e nessuno dei due è l'atomo centrale di tutta la molecola. La VSEPR si applica allora a un carbonio alla volta: ciascuno è legato a due idrogeni e all'altro carbonio, mette $1 + 1 + 2 = 4$ elettroni nei legami e ha tre domini. Intorno a ogni carbonio la geometria è triangolare planare, e i due triangoli stanno nello stesso piano: tutti e sei gli atomi dell'etene sono complanari.

```molecola3d
% nome: vsepr-etene
% alt: Modello tridimensionale dell'etene: i due carboni uniti dal doppio legame e i quattro idrogeni, tutti nello stesso piano; sul modello l'angolo H-C-H è di 117,9 gradi e gli angoli H-C-C di 121,1 gradi
% svg: vsepr-etene-8acc4d52.svg 77x70
% xyz: C 0.580 -0.263 -0.203; C -0.580 0.263 0.203; H 1.296 0.327 -0.764; H 0.834 -1.295 0.020; H -1.296 -0.327 0.764; H -0.834 1.295 -0.020
carboni: si
smiles: C=C
angoli: 2-0-3 2-0-1 3-0-1
```

Anche qui il doppio legame allarga gli angoli H–C–C ($121{,}1^\circ$ sul modello) e stringe l'angolo H–C–H ($117{,}9^\circ$).

```ad-example
Esempio 3: l'etino
Qual è la geometria intorno a ciascun carbonio dell'etino (acetilene), $\mathrm{C_2H_2}$, che ha un triplo legame tra i due carboni?

Ogni carbonio è legato a un idrogeno con un legame semplice e all'altro carbonio con un triplo legame. Mette nei legami $1 + 3 = 4$ elettroni e non ha coppie solitarie. I domini sono due, e la geometria intorno a ogni carbonio è lineare: i quattro atomi H–C≡C–H stanno sulla stessa retta, con angoli di $180^\circ$.
```

## Oltre quattro domini

```ad-note
Bipiramidale triangolare e ottaedrica
Gli atomi del terzo periodo e dei successivi possono avere più di quattro domini. Nel pentacloruro di fosforo, $\mathrm{PCl_5}$, il fosforo ha cinque domini: tre cloro stanno in un piano, ai vertici di un triangolo, con angoli di $120^\circ$, e gli altri due sopra e sotto quel piano, a $90^\circ$ da esso. La geometria si chiama bipiramidale triangolare. Nell'esafluoruro di zolfo, $\mathrm{SF_6}$, i domini sono sei e i fluori stanno ai vertici di un ottaedro, con angoli di $90^\circ$: la geometria è ottaedrica.
```

## Riepilogo delle geometrie

| Numero sterico | Coppie solitarie | Geometria della molecola | Angolo | Esempi |
|---|---|---|---|---|
| $2$ | $0$ | lineare | $180^\circ$ | $\mathrm{CO_2}$, $\mathrm{HCN}$ |
| $3$ | $0$ | triangolare planare | $120^\circ$ | $\mathrm{BF_3}$, $\mathrm{CH_2O}$ |
| $3$ | $1$ | piegata | poco meno di $120^\circ$ | $\mathrm{SO_2}$ |
| $4$ | $0$ | tetraedrica | $109{,}5^\circ$ | $\mathrm{CH_4}$, $\mathrm{NH_4^+}$ |
| $4$ | $1$ | piramidale triangolare | circa $107^\circ$ | $\mathrm{NH_3}$, $\mathrm{H_3O^+}$ |
| $4$ | $2$ | piegata | circa $104{,}5^\circ$ | $\mathrm{H_2O}$ |

Gli angoli della tabella sono quelli degli esempi tipici: con atomi diversi intorno al centro, o con legami doppi, si spostano di qualche grado.

## Dalla geometria alla polarità

Un legame tra due atomi con elettronegatività diversa è polare: gli elettroni di legame stanno più vicini all'atomo più elettronegativo, che prende una parziale carica negativa, $\delta^-$, mentre l'altro prende una parziale carica positiva, $\delta^+$. In questa lezione, come in molti libri di scuola, un legame covalente si considera polare quando la differenza di elettronegatività tra i due atomi è almeno $0{,}4$; sotto questo valore si considera apolare. Il legame C–H, con una differenza di $0{,}35$ (carbonio $2{,}55$, idrogeno $2{,}20$ nella scala di Pauling), è apolare.

Una molecola è **polare** quando le sue cariche parziali non si compensano: da una parte della molecola c'è più carica negativa, dall'altra più carica positiva. Qui la geometria decide tutto. Ogni legame polare tira gli elettroni verso uno dei suoi atomi, come una forza con una direzione; se i legami sono uguali e disposti in modo simmetrico intorno all'atomo centrale, le loro spinte si annullano, come due persone che tirano una corda con la stessa forza in versi opposti, e la molecola è apolare.

Per decidere se una molecola è polare:

1. Guarda se ha legami polari. Se non ne ha, la molecola è apolare.
2. Trova la geometria con la VSEPR.
3. Se i legami polari sono uguali e disposti in modo simmetrico (lineare con due atomi uguali, triangolare planare con tre atomi uguali, tetraedrica con quattro atomi uguali), i loro effetti si annullano e la molecola è apolare; altrimenti è polare.

```molecole
% nome: vsepr-polarita
% alt: Sei molecole a confronto, in coppie: il diossido di carbonio è apolare e l'acqua polare; il trifluoruro di boro è apolare e l'ammoniaca polare; il tetraclorometano è apolare e il triclorometano polare
% svg: vsepr-polarita-f3a1db64.svg 578x354
colonne: 2
idrogeni: tutti
carboni: si
O=C=O | diossido di carbonio: apolare
O | acqua: polare
FB(F)F | trifluoruro di boro: apolare
N | ammoniaca: polare
ClC(Cl)(Cl)Cl | tetraclorometano: apolare
ClC(Cl)Cl | triclorometano: polare
```

```ad-example
Esempio 4: diossido di carbonio e acqua
Il $\mathrm{CO_2}$ e l'$\mathrm{H_2O}$ hanno tutti e due legami polari: C=O (differenza di elettronegatività $3{,}44 - 2{,}55 = 0{,}89$) e O–H ($3{,}44 - 2{,}20 = 1{,}24$).

Il $\mathrm{CO_2}$ è lineare: i due legami C=O sono uguali e tirano in versi opposti, e i loro effetti si annullano. La molecola è apolare.

L'acqua è piegata: i due legami O–H tirano tutti e due verso l'ossigeno, ma non in versi opposti, e i loro effetti si sommano. L'ossigeno ha una parziale carica negativa, il lato degli idrogeni una parziale carica positiva: la molecola è polare.
```

```ad-example
Esempio 5: trifluoruro di boro e ammoniaca
Il $\mathrm{BF_3}$ è triangolare planare, con tre legami B–F uguali a $120^\circ$ l'uno dall'altro: le tre spinte si annullano, come tre forze uguali dirette verso i vertici di un triangolo equilatero, e la molecola è apolare.

Anche l'$\mathrm{NH_3}$ ha tre legami uguali, ma è piramidale: i tre legami N–H tirano tutti gli elettroni verso l'azoto, che sta in cima alla piramide, e i loro effetti si sommano. L'ammoniaca è polare.
```

```ad-example
Esempio 6: tetraclorometano e triclorometano
Il tetraclorometano, $\mathrm{CCl_4}$, è tetraedrico con quattro legami C–Cl uguali (differenza di elettronegatività $3{,}16 - 2{,}55 = 0{,}61$): i quattro effetti si annullano e la molecola è apolare.

Il triclorometano (cloroformio), $\mathrm{CHCl_3}$, è ancora tetraedrico, ma al posto di un cloro c'è un idrogeno. I tre legami C–Cl sono polari e il legame C–H è apolare, quindi le spinte non sono più uguali e non si annullano: il triclorometano è polare. Un solo atomo diverso rompe la simmetria.
```

```ad-warning
"Ha legami polari, quindi è polare"
Una molecola con legami polari può essere apolare, se la geometria è simmetrica: il $\mathrm{CO_2}$, il $\mathrm{BF_3}$ e il $\mathrm{CCl_4}$ hanno tutti legami polari e sono tutti apolari. Per decidere servono i legami e la geometria insieme.
```

```ad-warning
Contare le coppie solitarie degli atomi esterni
Solo le coppie solitarie dell'atomo centrale decidono la geometria. Nel $\mathrm{CCl_4}$ ogni cloro ha tre coppie solitarie, ma il carbonio non ne ha nessuna, e la molecola è tetraedrica.
```
