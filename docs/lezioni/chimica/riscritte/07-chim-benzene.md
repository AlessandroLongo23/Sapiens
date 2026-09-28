# Il benzene e i composti aromatici

Il benzene ha formula $\mathrm{C_6H_6}$: sei atomi di carbonio e solo sei di idrogeno, mentre l'esano, l'alcano con sei carboni, ne ha quattordici. Una molecola con così pochi idrogeni dovrebbe avere molti legami doppi e reagire come un alchene, per esempio sommando il bromo ai doppi legami. Il benzene invece non lo fa: è una molecola stabile, che reagisce poco e, quando reagisce, conserva il suo anello di sei carboni. I composti che hanno un anello come quello del benzene si chiamano aromatici, e sono dappertutto: nei solventi, nelle plastiche, nei coloranti, nei farmaci e nelle basi del DNA.

## La formula di Kekulé

Il benzene è stato isolato dal fisico inglese Michael Faraday nel 1825, dai residui oleosi del gas che allora si usava per illuminare le strade. La formula $\mathrm{C_6H_6}$ si conosceva, ma per quarant'anni nessuno riuscì a disegnare una struttura che spiegasse il suo comportamento.

Nel 1865 il chimico tedesco August Kekulé propose un anello di sei atomi di carbonio, ognuno legato a un idrogeno, con legami semplici e doppi alternati. Ogni carbonio ha così quattro legami: uno con l'idrogeno, uno semplice e uno doppio con i due carboni vicini. Questa è la **formula di Kekulé** del benzene.

```molecola
% nome: benzene-kekule
% alt: Formula di struttura del benzene secondo Kekulé: un esagono di sei atomi di carbonio, ognuno legato a un idrogeno, con tre legami doppi e tre legami semplici alternati
% svg: benzene-kekule-b849a016.svg 146x160
smiles: c1ccccc1
idrogeni: tutti
carboni: si
legenda: benzene
```

La formula di Kekulé spiega la formula bruta, ma prevede cose che non si osservano. Un anello con tre legami doppi e tre semplici dovrebbe avere tre legami corti (i doppi) e tre lunghi (i semplici), e invece le misure danno sei legami carbonio-carbonio tutti della stessa lunghezza, $139\ \mathrm{pm}$, a metà tra quella di un legame semplice, $154\ \mathrm{pm}$ nell'etano, e quella di un legame doppio, $134\ \mathrm{pm}$ nell'etene. Per lo stesso motivo dovrebbero esistere due 1,2-dibromobenzeni diversi, uno con i due bromi sui carboni uniti dal legame doppio e uno con i bromi sui carboni uniti dal legame semplice, mentre se ne conosce uno solo.

## Sei legami uguali: la risonanza

Per il benzene si possono scrivere due formule di Kekulé, che differiscono solo per la posizione dei legami doppi: dove una ha il legame doppio, l'altra ha il semplice. Nessuna delle due descrive la molecola vera. Il benzene è una via di mezzo tra le due, e le sue due formule si chiamano **formule limite** (o strutture di risonanza); la molecola vera si chiama **ibrido di risonanza**. Tra le formule limite si scrive una freccia con due punte, $\leftrightarrow$.

```molecole
% nome: benzene-formule-limite
% alt: Le due formule limite del benzene una accanto all'altra, unite da una freccia a due punte: lo stesso esagono con gli idrogeni, ma i tre legami doppi stanno nei lati dove l'altra formula ha i legami semplici
% svg: benzene-formule-limite-39b91206.svg 400x168
colonne: 2
freccia: risonanza
idrogeni: tutti
carboni: si
c1ccccc1 | formula limite 1
c1ccccc1 | formula limite 2 | ruota: 60
```

Ogni carbonio dell'anello è legato a tre atomi, l'idrogeno e i due carboni vicini, e ha la geometria triangolare planare: i sei carboni e i sei idrogeni stanno tutti nello stesso piano, con angoli di $120^\circ$. A ogni carbonio resta un elettrone in un orbitale $p$, perpendicolare al piano dell'anello. I sei orbitali $p$ si sovrappongono ciascuno con i due vicini, e i sei elettroni formano una nuvola sopra e sotto il piano dell'anello, che non appartiene a nessun legame in particolare ma a tutto l'anello: si dice che gli elettroni sono **delocalizzati**. Per questo i sei legami sono uguali. Molti libri disegnano il benzene come un esagono con un cerchio dentro, e il cerchio rappresenta proprio questi sei elettroni.

```molecola3d
% nome: benzene-3d
% alt: Modello tridimensionale del benzene: i sei carboni formano un esagono regolare piano e i sei idrogeni stanno nello stesso piano, rivolti verso l'esterno; gli angoli C-C-C e H-C-C misurati sul modello sono di 120 gradi
% svg: benzene-3d-e6183a4d.svg 146x130
% xyz: C 1.318 0.457 -0.026; C 1.055 -0.913 -0.003; C -0.263 -1.370 0.024; C -1.318 -0.457 0.026; C -1.055 0.913 0.003; C 0.263 1.370 -0.024; H 2.344 0.813 -0.047; H 1.876 -1.624 -0.004; H -0.468 -2.437 0.043; H -2.344 -0.813 0.047; H -1.876 1.624 0.004; H 0.468 2.437 -0.043
% legami: 1-2:1; 2-3:2; 3-4:1; 4-5:2; 5-6:1; 6-1:2; 1-7:1; 2-8:1; 3-9:1; 4-10:1; 5-11:1; 6-12:1
smiles: c1ccccc1
carboni: si
angoli: 0-1-2 6-0-1
```

Sul modello calcolato gli angoli C–C–C e H–C–C sono tutti di $120{,}0^\circ$, e ruotandolo si vede che la molecola è piatta. Il modello, come il disegno, mostra legami doppi e semplici alternati, perché il programma che lo disegna ha bisogno di una formula di Kekulé: i legami veri sono sei, tutti uguali.

```ad-warning
Il benzene non passa da una formula all'altra
Le due formule limite non sono due molecole che si scambiano di continuo, né la stessa molecola in due momenti diversi: il benzene ha sempre la stessa struttura, con i sei legami uguali. Le formule limite servono perché con un solo disegno a trattini non si riesce a rappresentare una molecola con gli elettroni delocalizzati. Kekulé stesso, nel 1872, pensava che i legami doppi oscillassero tra le due posizioni: è l'idea che la risonanza ha sostituito.
```

## Un anello più stabile del previsto

Gli elettroni delocalizzati rendono il benzene più stabile di come sarebbe un anello con tre legami doppi veri. Lo si misura con l'idrogenazione, la reazione che aggiunge idrogeno ai legami doppi e trasforma l'anello in cicloesano. L'idrogenazione del cicloesene, che ha un solo legame doppio, libera $120\ \mathrm{kJ}$ per mole. Un anello con tre legami doppi come quelli del cicloesene dovrebbe liberarne il triplo, $360\ \mathrm{kJ/mol}$; il benzene ne libera solo $208$. I circa $150\ \mathrm{kJ/mol}$ di differenza sono l'energia che il benzene "risparmia" grazie alla delocalizzazione, e si chiamano **energia di risonanza**.

La stabilità si vede anche nelle reazioni. Il cicloesene, a temperatura ambiente, somma subito una molecola di bromo al suo legame doppio: il bromo, rosso-bruno, si decolora, e si forma l'1,2-dibromocicloesano. È una reazione di addizione. Nei due schemi di questa sezione i colori dicono da quale molecola viene ogni atomo: blu per l'idrocarburo, arancione per il bromo.

```reazione
% nome: benzene-addizione-cicloesene
% alt: Il cicloesene, in blu, somma una molecola di bromo, in arancione, al legame doppio e diventa 1,2-dibromocicloesano, un anello senza legami doppi con un bromo arancione su ciascuno dei due carboni che erano uniti dal legame doppio
% svg: benzene-addizione-cicloesene-1aedf26e.svg 600x140
reazione: [CH2:1]1[CH:2]=[CH:3][CH2:4][CH2:5][CH2:6]1.[Br:7][Br:8]>>[Br:7][CH:2]1[CH2:1][CH2:6][CH2:5][CH2:4][CH:3]1[Br:8]
colora: si
```

Il benzene, nelle stesse condizioni, non reagisce con il bromo. Reagisce solo con un catalizzatore, il bromuro di ferro(III), $\mathrm{FeBr_3}$, e anche allora non somma il bromo: un atomo di bromo prende il posto di un idrogeno, che esce come bromuro di idrogeno, $\mathrm{HBr}$. È una reazione di sostituzione, e il prodotto, il bromobenzene, ha ancora l'anello aromatico intatto. Nello schema il catalizzatore non è disegnato: sopra la freccia andrebbe $\mathrm{FeBr_3}$. Questo tipo di reazione, la sostituzione elettrofila aromatica, ha una lezione sua.

```reazione
% nome: benzene-bromurazione
% alt: Il benzene, in blu, reagisce con il bromo, in arancione, e dà bromobenzene e bromuro di idrogeno: un bromo prende il posto di un idrogeno sull'anello, che resta aromatico, e l'altro esce con l'idrogeno come bromuro di idrogeno
% svg: benzene-bromurazione-30a3d575.svg 600x140
reazione: [cH:1]1[cH:2][cH:3][cH:4][cH:5][cH:6]1.[Br:7][Br:8]>>[Br:7][c:1]1[cH:2][cH:3][cH:4][cH:5][cH:6]1.[BrH:8]
colora: si
```

```ad-warning
Contare i legami doppi del benzene come quelli di un alchene
Nella formula di Kekulé si vedono tre legami doppi, e viene spontaneo aspettarsi che il benzene faccia le reazioni degli alcheni. Non le fa: i sei elettroni sono delocalizzati su tutto l'anello, e un'addizione romperebbe la delocalizzazione e farebbe perdere l'energia di risonanza. Per questo il benzene preferisce le sostituzioni, che la conservano.
```

## Quando un composto è aromatico

Il nome "aromatico" è nato nell'Ottocento perché molti dei primi composti di questo tipo avevano un odore forte, come la benzaldeide delle mandorle amare o la vanillina. Oggi il nome non ha più niente a che fare con l'odore: indica una struttura. Un composto è **aromatico** quando ha un anello che rispetta quattro condizioni:

1. l'anello è ciclico e piano;
2. ogni atomo dell'anello ha un orbitale $p$ perpendicolare al piano, così che gli orbitali $p$ formano un giro completo;
3. gli elettroni in questi orbitali $p$, detti elettroni $\pi$, sono delocalizzati su tutto l'anello;
4. il numero degli elettroni $\pi$ è uguale a $4n + 2$, con $n$ numero naturale: $2$, $6$, $10$, $14$ e così via.

L'ultima condizione è la **regola di Hückel**, dal chimico tedesco Erich Hückel che la ricavò nel 1931. Il benzene ha $6$ elettroni $\pi$, uno per carbonio: $4n + 2 = 6$ con $n = 1$, ed è aromatico.

Per contare gli elettroni $\pi$ di un anello fatto solo di carboni si contano i legami doppi dell'anello nella formula di Kekulé e si moltiplica per due: ogni legame doppio ne porta due.

Il cicloottatetraene, $\mathrm{C_8H_8}$, sembra un benzene più grande: un anello di otto carboni con quattro legami doppi alternati. Ma ha $8$ elettroni $\pi$, e $8$ non è della forma $4n + 2$. La molecola non è aromatica, e infatti non è nemmeno piana: si piega a forma di vasca, e i suoi legami doppi restano legami doppi separati, che reagiscono come quelli di un alchene.

```molecola3d
% nome: benzene-cicloottatetraene-3d
% alt: Modello tridimensionale del cicloottatetraene: un anello di otto carboni con quattro legami doppi alternati, piegato a forma di vasca e non piano; gli angoli C-C-C misurati sul modello sono di 127 gradi
% svg: benzene-cicloottatetraene-3d-ff0f711a.svg 168x170
% xyz: C -1.350 -0.982 0.434; C -1.670 0.314 0.297; C -1.008 1.293 -0.535; C 0.294 1.615 -0.528; C 1.328 1.055 0.312; C 1.647 -0.240 0.450; C 1.030 -1.367 -0.212; C -0.272 -1.689 -0.218; H -1.991 -1.606 1.054; H -2.556 0.681 0.811; H -1.673 1.856 -1.187; H 0.626 2.425 -1.175; H 1.935 1.792 0.835; H 2.500 -0.495 1.077; H 1.729 -2.043 -0.701; H -0.570 -2.611 -0.713
% legami: 1-2:2; 2-3:1; 3-4:2; 4-5:1; 5-6:2; 6-7:1; 7-8:2; 8-1:1; 1-9:1; 2-10:1; 3-11:1; 4-12:1; 5-13:1; 6-14:1; 7-15:1; 8-16:1
smiles: C1=CC=CC=CC=C1
carboni: si
angoli: 0-1-2 1-2-3
```

In un ottagono regolare piano ogni angolo interno misura $135^\circ$. Sul modello calcolato gli angoli C–C–C del cicloottatetraene sono tutti di $127{,}2^\circ$: la somma degli otto angoli è minore dei $1080^\circ$ di un ottagono piano, e questo succede solo se l'anello non sta in un piano. Ruotando il modello si vede la vasca.

```ad-warning
Un anello con legami doppi non è per forza aromatico
Il cicloesene ha un anello e un legame doppio, ma non è aromatico: quattro dei suoi carboni hanno quattro legami semplici e nessun orbitale $p$ libero, e il giro degli orbitali $p$ non si chiude. Il cicloottatetraene ha il giro completo, ma $8$ elettroni $\pi$. Per dire "aromatico" devono valere tutte e quattro le condizioni.
```

## I nomi dei derivati del benzene

### Un sostituente

Quando un atomo o un gruppo prende il posto di un idrogeno del benzene, il nome si forma mettendo il nome del sostituente davanti a "benzene", tutto attaccato: clorobenzene, bromobenzene, nitrobenzene. Non serve nessun numero, perché i sei carboni sono tutti equivalenti.

Per alcuni derivati la IUPAC accetta i nomi tradizionali, che sono quelli che si usano davvero: il metilbenzene si chiama toluene, l'idrossibenzene fenolo, la benzenammina anilina.

```molecole
% nome: benzene-monosostituiti
% alt: Sei derivati del benzene con un sostituente: clorobenzene, toluene (metilbenzene), fenolo, anilina (benzenammina), benzaldeide e acido benzoico
% svg: benzene-monosostituiti-dca3683c.svg 462x216
colonne: 3
Clc1ccccc1 | clorobenzene
Cc1ccccc1 | toluene
Oc1ccccc1 | fenolo
Nc1ccccc1 | anilina
O=Cc1ccccc1 | benzaldeide
OC(=O)c1ccccc1 | acido benzoico
```

Il toluene è un solvente, per esempio di vernici e colle, e in questo uso ha preso il posto del benzene, che è cancerogeno. Nel suo modello si vede che non tutti gli atomi di un composto aromatico stanno nel piano dell'anello: i sei carboni dell'anello e il carbonio del metile sono complanari, ma il carbonio del metile ha quattro legami semplici, è tetraedrico, e i suoi tre idrogeni escono dal piano.

```molecola3d
% nome: benzene-toluene-3d
% alt: Modello tridimensionale del toluene: l'anello di sei carboni è piano, con il carbonio del metile nello stesso piano; i tre idrogeni del metile escono dal piano, disposti a tetraedro; sul modello gli angoli dell'anello sono di 120 gradi e l'angolo H-C-H del metile di 109 gradi
% svg: benzene-toluene-3d-b1de3c66.svg 181x130
% xyz: C -2.211 0.183 0.103; C -0.720 0.059 0.009; C -0.111 -1.202 0.002; C 1.279 -1.317 -0.053; C 2.072 -0.172 -0.093; C 1.477 1.088 -0.072; C 0.087 1.204 -0.017; H -2.705 -0.664 -0.384; H -2.518 0.217 1.153; H -2.560 1.093 -0.398; H -0.718 -2.104 0.040; H 1.742 -2.299 -0.063; H 3.155 -0.261 -0.136; H 2.095 1.982 -0.097; H -0.363 2.193 0.006
% legami: 1-2:1; 2-3:2; 3-4:1; 4-5:2; 5-6:1; 6-7:2; 7-2:1; 1-8:1; 1-9:1; 1-10:1; 3-11:1; 4-12:1; 5-13:1; 6-14:1; 7-15:1
smiles: Cc1ccccc1
carboni: si
angoli: 1-2-3 0-1-2 7-0-8
```

Sul modello gli angoli dell'anello sono di $120{,}4^\circ$, come l'angolo tra il legame del metile e l'anello, mentre l'angolo H–C–H del metile è di $108{,}9^\circ$, vicino ai $109{,}5^\circ$ del tetraedro.

Quando l'anello è il sostituente di una catena, e non il pezzo principale della molecola, si chiama **fenile**, $\mathrm{C_6H_5{-}}$: il fenilmetanolo è il metanolo con un fenile al posto di un idrogeno. Nelle formule generali un anello aromatico qualunque si indica con $\mathrm{Ar}$, come $\mathrm{R}$ indica una catena.

```ad-warning
Fenile e fenolo
Il fenile è il gruppo $\mathrm{C_6H_5{-}}$, cioè il benzene senza un idrogeno, e non contiene ossigeno. Il fenolo è una molecola intera, $\mathrm{C_6H_5OH}$. Il fenilmetanolo è un alcol e non un fenolo, perché l'ossidrile non è legato all'anello.
```

### Due sostituenti: orto, meta, para

Con due sostituenti non basta più il nome: bisogna dire dove stanno. I carboni dell'anello si numerano da $1$ a $6$, partendo da un carbonio con un sostituente e girando nel verso che dà il numero più basso all'altro. Le tre posizioni possibili si chiamano anche con un prefisso, scritto in corsivo e abbreviato con la sola iniziale:

| Posizioni | Prefisso | Esempio |
|---|---|---|
| $1,2$ (carboni vicini) | orto, *o*- | 1,2-dimetilbenzene, *o*-xilene |
| $1,3$ (un carbonio in mezzo) | meta, *m*- | 1,3-dimetilbenzene, *m*-xilene |
| $1,4$ (carboni opposti) | para, *p*- | 1,4-dimetilbenzene, *p*-xilene |

Nel disegno i carboni dell'anello sono numerati come nel nome. I tre dimetilbenzeni si chiamano anche xileni, e sono solventi.

```molecole
% nome: benzene-orto-meta-para
% alt: I tre dimetilbenzeni con i carboni dell'anello colorati e numerati da 1 a 6: nell'1,2-dimetilbenzene (orto) i due metili sono sui carboni 1 e 2, nell'1,3 (meta) sui carboni 1 e 3, nell'1,4 (para) sui carboni 1 e 4
% svg: benzene-orto-meta-para-9b0a8e76.svg 759x126
colonne: 3
Cc1ccccc1C | 1,2-dimetilbenzene (orto) | catena: 1 6 5 4 3 2
Cc1cccc(C)c1 | 1,3-dimetilbenzene (meta) | catena: 1 7 5 4 3 2
Cc1ccc(C)cc1 | 1,4-dimetilbenzene (para) | catena: 1 2 3 4 6 7
```

Quando i due sostituenti sono diversi, si scrivono in ordine alfabetico, e il numero $1$ va al primo in ordine alfabetico. Se uno dei due dà alla molecola un nome tradizionale, come il metile nel toluene o l'ossidrile nel fenolo, si può partire da quel nome: il carbonio del sostituente del nome tradizionale è il numero $1$ e non si scrive.

```ad-example
Esempio 1: un cloro e un metile in para
Come si chiama questa molecola?

```molecola
% nome: benzene-esempio-clorotoluene
% alt: Un anello benzenico con un atomo di cloro e un gruppo metile su due carboni opposti
% svg: benzene-esempio-clorotoluene-3262cb89.svg 145x60
smiles: Clc1ccc(C)cc1
```

I sostituenti sono un cloro e un metile, su carboni opposti dell'anello: posizioni $1$ e $4$, para. In ordine alfabetico viene prima "cloro", che prende il numero $1$: il nome IUPAC è 1-cloro-4-metilbenzene. Partendo dal toluene, il metile è sul carbonio $1$ e il cloro sul $4$: 4-clorotoluene, o *p*-clorotoluene.
```

```ad-example
Esempio 2: dal nome alla formula
Disegna l'acido 2-idrossibenzoico, che si chiama anche acido salicilico.

Il nome del composto viene dall'acido benzoico, quindi il carbossile $\mathrm{-COOH}$ è sul carbonio $1$. L'ossidrile $\mathrm{-OH}$ è sul carbonio $2$, quello vicino: i due gruppi sono in orto.

```molecola
% nome: benzene-esempio-acido-salicilico
% alt: Acido 2-idrossibenzoico (acido salicilico): un anello benzenico con il carbossile su un carbonio e l'ossidrile sul carbonio vicino, in posizione orto
% svg: benzene-esempio-acido-salicilico-cf27a231.svg 219x133
smiles: OC(=O)c1ccccc1O
legenda: acido 2-idrossibenzoico
```

L'acido salicilico si ricava dalla corteccia del salice ed è il punto di partenza per preparare l'aspirina, che trovi più avanti.
```

```ad-warning
Scambiare meta e para
Due gruppi in meta, come quelli dell'1,3-dimetilbenzene nel disegno, sembrano già lontani, e si scambiano facilmente per due gruppi in para. La distanza sul disegno dipende da come è girato l'anello; per non sbagliare, conta i carboni lungo l'anello, dal primo sostituente al secondo per la via più corta. Uno scatto è orto, due scatti meta, tre scatti para.
```

### Tre o più sostituenti

Con tre o più sostituenti si usano solo i numeri, scelti in modo che l'insieme dei numeri sia il più basso possibile; i nomi orto, meta e para non servono più. I sostituenti si scrivono in ordine alfabetico. Il tritolo, l'esplosivo, è il 2,4,6-trinitrotoluene: un toluene con tre gruppi nitro, $\mathrm{-NO_2}$, sui carboni $2$, $4$ e $6$.

```ad-example
Esempio 3: tre bromi su un fenolo
Come si chiama un fenolo con tre atomi di bromo, due in orto e uno in para rispetto all'ossidrile?

```molecola
% nome: benzene-esempio-tribromofenolo
% alt: Un fenolo con tre atomi di bromo sull'anello: due sui carboni vicini a quello dell'ossidrile e uno sul carbonio opposto
% svg: benzene-esempio-tribromofenolo-c1d4c7e7.svg 162x130
smiles: Oc1c(Br)cc(Br)cc1Br
```

Il nome parte da fenolo, quindi il carbonio dell'ossidrile è il numero $1$. I carboni in orto sono il $2$ e il $6$, quello in para il $4$. I bromi sono tre, e si scrive "tri": 2,4,6-tribromofenolo.
```

## Idrocarburi aromatici con più anelli

Due o più anelli benzenici possono condividere un lato, cioè due carboni. Le molecole che si formano si chiamano idrocarburi aromatici policiclici. Il più semplice è il naftalene, $\mathrm{C_{10}H_8}$, fatto di due anelli: è la sostanza delle vecchie palline antitarme, che per questo si chiamano naftalina.

```molecola3d
% nome: benzene-naftalene-3d
% alt: Modello tridimensionale del naftalene: due anelli di sei carboni che condividono un lato, tutti e dieci i carboni e gli otto idrogeni nello stesso piano
% svg: benzene-naftalene-3d-ff06d7d9.svg 188x149
% xyz: C -2.404 -0.782 -0.127; C -2.459 0.602 0.010; C -1.279 1.340 0.107; C -0.028 0.703 0.069; C 1.169 1.431 0.166; C 2.404 0.782 0.127; C 2.459 -0.602 -0.010; C 1.279 -1.340 -0.107; C 0.028 -0.703 -0.069; C -1.169 -1.431 -0.166; H -3.323 -1.358 -0.202; H -3.420 1.108 0.041; H -1.342 2.421 0.213; H 1.147 2.513 0.273; H 3.323 1.358 0.202; H 3.420 -1.108 -0.041; H 1.342 -2.421 -0.213; H -1.147 -2.513 -0.273
% legami: 1-2:2; 2-3:1; 3-4:2; 4-5:1; 5-6:2; 6-7:1; 7-8:2; 8-9:1; 9-10:2; 10-1:1; 9-4:1; 1-11:1; 2-12:1; 3-13:1; 5-14:1; 6-15:1; 7-16:1; 8-17:1; 10-18:1
smiles: c1ccc2ccccc2c1
carboni: si
```

Anche il naftalene è piano, e i suoi $10$ elettroni $\pi$ sono delocalizzati su tutti e due gli anelli. Con tre anelli si hanno l'antracene e il fenantrene, che hanno la stessa formula, $\mathrm{C_{14}H_{10}}$, e sono quindi isomeri: gli anelli sono in fila nell'antracene, piegati nel fenantrene.

```molecole
% nome: benzene-policiclici
% alt: Tre idrocarburi aromatici policiclici: naftalene, con due anelli; antracene, con tre anelli in fila; fenantrene, con tre anelli di cui il terzo piegato rispetto agli altri due
% svg: benzene-policiclici-9c36094c.svg 588x128
colonne: 3
c1ccc2ccccc2c1 | naftalene
c1ccc2cc3ccccc3cc2c1 | antracene
c1ccc2c(c1)ccc1ccccc12 | fenantrene
```

Gli idrocarburi aromatici policiclici si formano quando il legno, il carbone, il tabacco o la carne bruciano senza abbastanza ossigeno, e diversi di loro sono cancerogeni: per questo si trovano nel fumo di sigaretta e nei cibi carbonizzati.

```ad-note
La regola di Hückel con più anelli
La regola di Hückel è stata ricavata per un anello solo. Il naftalene, con $10$ elettroni $\pi$, e l'antracene e il fenantrene, con $14$, la rispettano, ma per le molecole con molti anelli fusi la regola non vale più in modo automatico: alcune sono aromatiche anche con un numero di elettroni che non è $4n + 2$. Per i composti di questa lezione la regola funziona.
```

## Anelli aromatici con altri atomi: gli eterocicli

Un anello che contiene almeno un atomo diverso dal carbonio si chiama **eterociclo**. Gli atomi diversi più frequenti sono l'azoto, l'ossigeno e lo zolfo, e molti eterocicli sono aromatici.

### La piridina

La piridina, $\mathrm{C_5H_5N}$, è un benzene in cui un gruppo $\mathrm{CH}$ è sostituito da un atomo di azoto. L'azoto è legato ai due carboni vicini e, come ogni carbonio dell'anello, mette un elettrone nel suo orbitale $p$: gli elettroni $\pi$ sono $6$, come nel benzene, e la piridina è aromatica. All'azoto resta una coppia di elettroni, che sta nel piano dell'anello, rivolta verso l'esterno, e non fa parte della nuvola $\pi$. Con quella coppia l'azoto può legare uno ione $\mathrm{H^+}$, e per questo la piridina è una base, come l'ammoniaca.

```molecola3d
% nome: benzene-piridina-3d
% alt: Modello tridimensionale della piridina: un anello piano di cinque carboni e un azoto, con cinque idrogeni nel piano; l'azoto non ha idrogeno; sul modello l'angolo C-N-C è di 117 gradi e l'angolo C-C-C più vicino di 118 gradi
% svg: benzene-piridina-3d-3ce0d656.svg 128x114
% xyz: C -0.106 1.179 -0.026; C -1.239 0.371 -0.026; C -1.063 -1.003 0.005; N 0.145 -1.606 0.036; C 1.226 -0.796 0.035; C 1.152 0.587 0.005; H -0.204 2.260 -0.051; H -2.233 0.801 -0.050; H -1.916 -1.676 0.006; H 2.185 -1.305 0.060; H 2.054 1.189 0.006
% legami: 1-2:2; 2-3:1; 3-4:2; 4-5:1; 5-6:2; 6-1:1; 1-7:1; 2-8:1; 3-9:1; 5-10:1; 6-11:1
smiles: c1ccncc1
carboni: si
angoli: 2-3-4 0-1-2
```

L'anello della piridina è piano come quello del benzene, ma non è un esagono perfetto: sul modello l'angolo C–N–C è di $116{,}6^\circ$ e gli angoli dei carboni non sono tutti di $120^\circ$. L'anello della piridina si trova nella nicotina e nella vitamina B3.

### Anelli a cinque atomi

In un anello a cinque atomi ci sono al massimo due legami doppi, cioè $4$ elettroni $\pi$. Il quinto atomo può portare gli altri due, se ha una coppia di elettroni in un orbitale $p$. Nel pirrolo, $\mathrm{C_4H_5N}$, l'azoto è legato a due carboni e a un idrogeno, e la sua coppia di elettroni entra nella nuvola $\pi$: $4 + 2 = 6$ elettroni, e il pirrolo è aromatico. Proprio perché la sua coppia è impegnata nell'anello, l'azoto del pirrolo non la cede a uno ione $\mathrm{H^+}$, e il pirrolo, a differenza della piridina, in pratica non è una base.

```molecole
% nome: benzene-eterocicli
% alt: Quattro eterocicli aromatici: piridina e pirimidina, anelli a sei atomi con uno e due azoti; pirrolo e imidazolo, anelli a cinque atomi con uno e due azoti, in cui un azoto porta un idrogeno
% svg: benzene-eterocicli-68c379ee.svg 472x108
colonne: 4
c1ccncc1 | piridina
c1cncnc1 | pirimidina
c1cc[nH]c1 | pirrolo
c1c[nH]cn1 | imidazolo
```

La pirimidina ha due azoti nell'anello a sei, tutti e due come quello della piridina. L'imidazolo ha due azoti nell'anello a cinque: uno con l'idrogeno, come nel pirrolo, che mette due elettroni nella nuvola $\pi$, e uno senza, come nella piridina, che ne mette uno. Pirimidina e imidazolo uniti per un lato formano la purina, lo scheletro dell'adenina e della guanina, due delle basi del DNA.

```ad-example
Esempio 4: il furano è aromatico?
Il furano, $\mathrm{C_4H_4O}$, è un anello piano di quattro carboni e un ossigeno, con due legami doppi tra i carboni.

```molecola
% nome: benzene-esempio-furano
% alt: Il furano: un anello a cinque atomi con quattro carboni e un ossigeno, e due legami doppi tra i carboni
% svg: benzene-esempio-furano-a950f3c9.svg 130x121
smiles: c1ccoc1
idrogeni: tutti
legenda: furano
```

I due legami doppi portano $4$ elettroni $\pi$. L'ossigeno è legato a due carboni e ha due coppie di elettroni: una può stare in un orbitale $p$ perpendicolare all'anello ed entrare nella nuvola $\pi$, l'altra resta nel piano. Gli elettroni $\pi$ sono $4 + 2 = 6$, cioè $4n + 2$ con $n = 1$; l'anello è piano e il giro degli orbitali $p$ è completo. Il furano è aromatico.
```

```ad-warning
Contare tutte le coppie dell'eteroatomo
Nel furano l'ossigeno ha due coppie di elettroni, ma nella nuvola $\pi$ ne entra una sola: contarle tutte e due darebbe $8$ elettroni e la conclusione sbagliata che il furano non è aromatico. Un atomo dell'anello mette nella nuvola $\pi$ al massimo una coppia, quella nell'orbitale $p$. E nella piridina l'azoto ne mette zero: la sua coppia sta nel piano, e l'elettrone $\pi$ viene dal legame doppio.
```

## Anelli aromatici nelle molecole vere

Tanti farmaci hanno un anello aromatico, spesso con più gruppi funzionali attaccati. Nei modelli di questa sezione si vede una regola generale: gli atomi dell'anello aromatico, e gli atomi legati direttamente all'anello, stanno nello stesso piano; i gruppi più lontani possono ruotare intorno ai legami semplici e uscire dal piano.

Il paracetamolo, $\mathrm{C_8H_9NO_2}$, è un antidolorifico e antifebbrile. Il suo anello porta due gruppi in para: un ossidrile, che ne fa un fenolo, e l'azoto di un'ammide. Il suo nome IUPAC è N-(4-idrossifenil)etanammide.

```molecola3d
% nome: benzene-paracetamolo-3d
% alt: Modello tridimensionale del paracetamolo: l'anello benzenico piano con l'ossidrile da una parte e dalla parte opposta, in para, l'azoto del gruppo ammidico legato a un carbonile e a un metile
% svg: benzene-paracetamolo-3d-27e6d97a.svg 258x144
% xyz: C 3.624 -0.557 -0.572; C 2.218 -0.109 -0.887; O 1.960 0.438 -1.954; N 1.342 -0.368 0.151; C -0.038 -0.082 0.203; C -0.751 0.519 -0.837; C -2.123 0.769 -0.709; C -2.779 0.416 0.464; O -4.112 0.642 0.630; C -2.087 -0.182 1.508; C -0.719 -0.431 1.378; H 4.128 0.218 0.010; H 3.619 -1.496 -0.010; H 4.170 -0.724 -1.505; H 1.732 -0.806 0.976; H -0.270 0.806 -1.766; H -2.651 1.238 -1.533; H -4.456 1.063 -0.176; H -2.611 -0.454 2.420; H -0.199 -0.900 2.208
% legami: 1-2:1; 2-3:2; 2-4:1; 4-5:1; 5-6:1; 6-7:2; 7-8:1; 8-9:1; 8-10:2; 10-11:1; 11-5:2; 1-12:1; 1-13:1; 1-14:1; 4-15:1; 6-16:1; 7-17:1; 9-18:1; 10-19:1; 11-20:1
smiles: CC(=O)Nc1ccc(O)cc1
```

L'acido acetilsalicilico, $\mathrm{C_9H_8O_4}$, il principio attivo dell'aspirina, è l'acido salicilico dell'esempio 2 con l'ossidrile trasformato in un estere. Il carbossile e l'estere sono in orto, su due carboni vicini dell'anello, e troppo vicini per stare tutti e due nel piano: nel modello calcolato il gruppo estere è ruotato fuori dal piano dell'anello.

```molecola3d
% nome: benzene-aspirina-3d
% alt: Modello tridimensionale dell'acido acetilsalicilico: l'anello benzenico piano con due gruppi su carboni vicini, il carbossile e il gruppo estere, che è ruotato fuori dal piano dell'anello
% svg: benzene-aspirina-3d-9d747854.svg 221x202
% xyz: C 3.352 0.563 -0.583; C 2.093 0.064 0.059; O 1.963 -0.146 1.258; O 1.134 -0.137 -0.928; C -0.105 -0.518 -0.403; C -0.414 -1.881 -0.444; C -1.645 -2.324 0.037; C -2.565 -1.407 0.543; C -2.261 -0.042 0.565; C -1.026 0.421 0.084; C -0.707 1.873 0.077; O 0.286 2.405 -0.383; O -1.671 2.616 0.655; H 3.149 1.485 -1.133; H 3.756 -0.203 -1.250; H 4.092 0.780 0.192; H 0.304 -2.595 -0.840; H -1.886 -3.384 0.019; H -3.525 -1.754 0.921; H -2.999 0.652 0.958; H -1.326 3.532 0.596
% legami: 1-2:1; 2-3:2; 2-4:1; 4-5:1; 5-6:2; 6-7:1; 7-8:2; 8-9:1; 9-10:2; 10-11:1; 11-12:2; 11-13:1; 10-5:1; 1-14:1; 1-15:1; 1-16:1; 6-17:1; 7-18:1; 8-19:1; 9-20:1; 13-21:1
smiles: CC(=O)Oc1ccccc1C(=O)O
```

La caffeina, $\mathrm{C_8H_{10}N_4O_2}$, ha lo scheletro della purina: un anello a sei atomi e uno a cinque, uniti per un lato, con quattro azoti in tutto. L'anello a cinque atomi è un imidazolo, aromatico come quello della sezione precedente. Tutti gli atomi dei due anelli sono legati a tre atomi, sono triangolari planari, e l'intero scheletro è piano; solo gli idrogeni dei tre metili legati agli azoti escono dal piano.

```molecola3d
% nome: benzene-caffeina-3d
% alt: Modello tridimensionale della caffeina: due anelli uniti per un lato, uno a sei e uno a cinque atomi, con quattro azoti, due ossigeni legati con doppi legami all'anello a sei e tre gruppi metile sugli azoti; lo scheletro dei due anelli è piano
% svg: benzene-caffeina-3d-a8040ae0.svg 196x190
% xyz: C 3.137 -1.011 -0.495; N 2.136 0.011 -0.320; C 2.352 1.363 -0.320; N 1.232 2.034 -0.135; C 0.276 1.071 -0.015; C 0.798 -0.181 -0.124; C 0.014 -1.363 -0.035; O 0.495 -2.488 -0.135; N -1.342 -1.097 0.175; C -2.250 -2.223 0.283; C -1.921 0.184 0.293; O -3.135 0.317 0.478; N -1.066 1.282 0.191; C -1.582 2.634 0.301; H 4.115 -0.543 -0.631; H 3.151 -1.641 0.397; H 2.884 -1.598 -1.381; H 3.332 1.803 -0.456; H -3.012 -2.142 -0.498; H -2.749 -2.184 1.258; H -1.742 -3.185 0.184; H -1.096 3.134 1.145; H -2.663 2.646 0.464; H -1.362 3.177 -0.623
% legami: 1-2:1; 2-3:1; 3-4:2; 4-5:1; 5-6:2; 6-7:1; 7-8:2; 7-9:1; 9-10:1; 9-11:1; 11-12:2; 11-13:1; 13-14:1; 6-2:1; 13-5:1; 1-15:1; 1-16:1; 1-17:1; 3-18:1; 10-19:1; 10-20:1; 10-21:1; 14-22:1; 14-23:1; 14-24:1
smiles: Cn1cnc2c1c(=O)n(C)c(=O)n2C
```

```ad-warning
Aromatico non vuol dire profumato
Il nome viene dall'odore di alcuni dei primi composti studiati, ma oggi "aromatico" vuol dire solo che la molecola ha un anello come quello del benzene. Il naftalene ha un odore forte, la caffeina e il paracetamolo nessuno; molti profumi, come il limonene degli agrumi, non sono aromatici.
```
