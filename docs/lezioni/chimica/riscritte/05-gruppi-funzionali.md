# I gruppi funzionali

Il vino lasciato aperto diventa aceto: alcuni batteri, con l'ossigeno dell'aria, trasformano l'etanolo del vino in acido acetico. Le due molecole hanno lo stesso scheletro di due atomi di carbonio e cambia solo il gruppo di atomi attaccato in fondo, eppure l'etanolo ha l'odore dell'alcol e bolle a 78 °C, mentre l'acido acetico è aspro, corrode e bolle a 118 °C. L'etano, lo stesso scheletro senza ossigeno, è un gas che bolle a −89 °C. Quel gruppo di atomi in fondo alla catena si chiama gruppo funzionale, e riconoscerlo ti permette di prevedere come si comporta anche una molecola che non hai mai visto.

```molecole
% nome: gruppi-etano-etanolo-acido
% alt: Etano, etanolo e acido etanoico nella formula di struttura: lo stesso scheletro di due carboni, con l'ossidrile dell'etanolo colorato in blu e il carbossile dell'acido colorato in arancione
% svg: gruppi-etano-etanolo-acido-21dbb057.svg 462x128
colonne: 3
idrogeni: tutti
carboni: si
CC | etano
CCO | etanolo | atomi: 2 8 blu
CC(=O)O | acido etanoico | atomi: 1 2 3 7 arancione
```

## Che cos'è un gruppo funzionale

Un **gruppo funzionale** è un atomo o un gruppo di atomi, legato allo scheletro di carbonio e idrogeno di una molecola, che ne decide il comportamento chimico e buona parte delle proprietà fisiche. Quasi sempre contiene atomi diversi dal carbonio e dall'idrogeno, come ossigeno, azoto o un alogeno. Lo scheletro fatto solo di legami C–C e C–H reagisce poco; i legami del gruppo funzionale (C–O, O–H, C=O, C–N) sono polari, perché l'ossigeno e l'azoto attirano gli elettroni più del carbonio, ed è lì che avvengono quasi tutte le reazioni.

Le molecole che hanno lo stesso gruppo funzionale formano una **classe** di composti: gli alcoli, le aldeidi, gli acidi carbossilici e così via. Il metanolo, l'etanolo e il propan-1-olo hanno catene diverse ma lo stesso gruppo $\mathrm{-OH}$: si sciolgono tutti in acqua e reagiscono tutti in modo simile.

Nelle formule generali la lettera $\mathrm{R}$ indica il resto della molecola, cioè la parte fatta di carbonio e idrogeno. Quando i resti sono due, e possono essere diversi, si scrivono $\mathrm{R}$ e $\mathrm{R'}$. Per esempio $\mathrm{R{-}OH}$ è un alcol qualunque: con $\mathrm{R} = \mathrm{CH_3}$ è il metanolo, con $\mathrm{R} = \mathrm{CH_3CH_2}$ è l'etanolo.

I disegni di questa lezione sono formule scheletriche: ogni vertice e ogni estremità di una linea è un carbonio, con i suoi idrogeni sottintesi, mentre gli idrogeni legati all'ossigeno o all'azoto sono scritti. In ogni disegno i gruppi funzionali sono colorati, e ogni gruppo ha sempre lo stesso colore:

| Colore | Gruppo | Classi |
|---|---|---|
| blu | ossidrile $\mathrm{-OH}$ | alcoli, fenoli |
| grigio | ossigeno tra due carboni $\mathrm{-O-}$ | eteri |
| rosso | carbonile $\mathrm{C{=}O}$ | aldeidi, chetoni |
| arancione | carbossile $\mathrm{-COOH}$ | acidi carbossilici |
| verde | gruppo estere $\mathrm{-COO-}$ | esteri |
| viola | azoto legato solo a carboni e idrogeni | ammine |
| giallo | gruppo ammidico $\mathrm{-CON}$ | ammidi |

Gli alogeni non hanno uno sfondo colorato: il disegno scrive già F, Cl, Br e I, ognuno con il suo colore.

## Alogenuri alchilici

Un **alogenuro alchilico** ha un atomo di alogeno (fluoro, cloro, bromo o iodio) legato a un carbonio con soli legami semplici. La formula generale è $\mathrm{R{-}X}$, dove $\mathrm{X}$ sta per l'alogeno. Il nome si forma mettendo davanti al nome dell'alcano il prefisso dell'alogeno (fluoro-, cloro-, bromo-, iodo-) con il numero del carbonio che lo porta: clorometano, 2-bromopropano.

```molecole
% nome: gruppi-alogenuri
% alt: Quattro alogenuri alchilici: clorometano, diclorometano, triclorometano (cloroformio) e diclorodifluorometano, con gli atomi di cloro e di fluoro scritti nel loro colore
% svg: gruppi-alogenuri-410c130d.svg 868x118
colonne: 4
CCl | clorometano
ClCCl | diclorometano
ClC(Cl)Cl | triclorometano
FC(F)(Cl)Cl | diclorodifluorometano
```

Il diclorometano è un solvente: si usa per togliere la vernice e per estrarre la caffeina dal caffè decaffeinato. Il triclorometano, detto cloroformio, è stato uno dei primi anestetici, usato dal medico scozzese James Young Simpson nel 1847. Il diclorodifluorometano è uno dei clorofluorocarburi (CFC) che per decenni hanno riempito frigoriferi e bombolette spray, finché il Protocollo di Montreal del 1987 li ha messi al bando perché distruggono lo strato di ozono.

Il legame C–X è polare, perché l'alogeno attira gli elettroni, e si rompe con una certa facilità: per questo in laboratorio gli alogenuri alchilici sono il punto di partenza di molte reazioni.

```ad-note
Alogeno sull'anello
Un alogeno legato direttamente a un anello benzenico (come nel clorobenzene) non forma un alogenuro alchilico ma un alogenuro arilico, che reagisce in modo diverso e non è argomento di questa lezione.
```

## Alcoli

Un **alcol** ha un **ossidrile** $\mathrm{-OH}$ (detto anche gruppo idrossile) legato a un carbonio con soli legami semplici. La formula generale è $\mathrm{R{-}OH}$. Il nome IUPAC si ottiene dal nome dell'alcano cambiando la -o finale in -olo, con il numero del carbonio che porta l'ossidrile: metanolo, etanolo, propan-2-olo. Se gli ossidrili sono più di uno, si scrive quanti sono: etan-1,2-diolo, propan-1,2,3-triolo.

```molecole
% nome: gruppi-alcoli
% alt: Quattro alcoli con l'ossidrile colorato in blu: metanolo, etanolo, propan-2-olo e propan-1,2,3-triolo (glicerolo), che ha tre ossidrili
% svg: gruppi-alcoli-921227b5.svg 796x98
colonne: 4
evidenzia: [OX2H1&$(O[CX4])] blu
CO | metanolo
CCO | etanolo
CC(C)O | propan-2-olo
OCC(O)CO | propan-1,2,3-triolo
```

L'etanolo (alcol etilico) è l'alcol del vino e della birra e si usa come disinfettante. Il metanolo (alcol metilico) è molto tossico: pochi millilitri possono rendere ciechi. Il propan-2-olo (alcol isopropilico) si usa per disinfettare la pelle e per pulire i circuiti elettronici, e il propan-1,2,3-triolo, detto glicerolo o glicerina, sta nelle creme e nei saponi.

L'ossidrile cambia le proprietà di una molecola perché l'idrogeno legato all'ossigeno forma legami a idrogeno con le molecole vicine. Per separare le molecole di un alcol serve più energia, e infatti l'etanolo bolle a 78 °C mentre l'etano, che non ha l'ossidrile, bolle a −89 °C. Per lo stesso motivo gli alcoli piccoli si mescolano con l'acqua in qualunque proporzione.

## Fenoli

Un **fenolo** ha l'ossidrile $\mathrm{-OH}$ legato direttamente a un carbonio di un anello benzenico. La formula generale è $\mathrm{Ar{-}OH}$, dove $\mathrm{Ar}$ indica l'anello (aromatico). Il più semplice si chiama proprio fenolo, e gli altri prendono il nome da lui: 4-metilfenolo, 2-metilfenolo.

```molecole
% nome: gruppi-fenoli
% alt: Tre fenoli con l'ossidrile legato all'anello colorato in blu: fenolo, 4-metilfenolo e timolo
% svg: gruppi-fenoli-037ed119.svg 522x139
colonne: 3
evidenzia: [OX2H1&$(Oc)] blu
Oc1ccccc1 | fenolo
Cc1ccc(O)cc1 | 4-metilfenolo
Cc1ccc(C(C)C)c(O)c1 | timolo
```

Il fenolo è stato il primo disinfettante usato in sala operatoria, dal chirurgo inglese Joseph Lister nel 1867. Il timolo dà l'odore al timo e si trova in alcuni collutori.

Il gruppo è lo stesso ossidrile degli alcoli, e per questo ha lo stesso colore, ma l'anello cambia il suo comportamento: un fenolo è molto più acido di un alcol. Il fenolo reagisce con l'idrossido di sodio e forma un sale, l'etanolo in pratica no.

```ad-warning
Un ossidrile vicino all'anello non basta
Perché sia un fenolo, l'ossidrile deve essere attaccato a un carbonio dell'anello. Nel fenilmetanolo (alcol benzilico) tra l'anello e l'$\mathrm{-OH}$ c'è un $\mathrm{CH_2}$: il carbonio che porta l'ossidrile ha soli legami semplici, e la molecola è un alcol.

```molecole
% nome: gruppi-alcol-benzilico
% alt: A sinistra il fenilmetanolo, un alcol, con l'ossidrile legato a un CH2 fuori dall'anello; a destra il fenolo, con l'ossidrile legato all'anello; in tutti e due l'ossidrile è blu
% svg: gruppi-alcol-benzilico-80e41bb4.svg 434x104
colonne: 2
OCc1ccccc1 | fenilmetanolo (alcol) | evidenzia: [OX2H1&$(O[CX4])] blu
Oc1ccccc1 | fenolo | evidenzia: [OX2H1&$(Oc)] blu
```
```

## Eteri

Un **etere** ha un atomo di ossigeno legato a due carboni. La formula generale è $\mathrm{R{-}O{-}R'}$. Nel nome IUPAC il gruppo più corto con il suo ossigeno diventa un prefisso che finisce in -ossi (metossi-, etossi-) davanti al nome dell'alcano più lungo: metossimetano, metossietano. Il nome tradizionale elenca i due gruppi e aggiunge "etere": il metossimetano è il dimetiletere, l'etossietano è il dietiletere.

```molecole
% nome: gruppi-eteri
% alt: Tre eteri con l'ossigeno tra due carboni colorato in grigio: metossimetano (dimetiletere), etossietano (dietiletere) e 2-metossi-2-metilpropano
% svg: gruppi-eteri-4b343fe2.svg 732x98
colonne: 3
evidenzia: [OX2&$(O([#6])[#6])&!$(O[#6]=[O,S,N])] grigio
COC | metossimetano
CCOCC | etossietano
COC(C)(C)C | 2-metossi-2-metilpropano
```

Il dietiletere, spesso chiamato solo "etere", è stato il primo anestetico usato in un'operazione davanti ad altri medici, dal dentista William Morton a Boston nel 1846. Il 2-metossi-2-metilpropano (MTBE) si aggiungeva alla benzina per farla bruciare meglio.

Un etere non ha idrogeni legati all'ossigeno, quindi le sue molecole non formano legami a idrogeno tra loro. Il dietiletere e il butan-1-olo hanno la stessa formula, $\mathrm{C_4H_{10}O}$, ma l'etere bolle a 35 °C e l'alcol a 118 °C.

## Il carbonile: aldeidi e chetoni

Il **carbonile** è un atomo di carbonio legato con un doppio legame a un atomo di ossigeno, $\mathrm{C{=}O}$. Il carbonio del carbonile ha ancora due legami liberi, e quello che c'è attaccato decide la classe: con almeno un idrogeno è un'aldeide, con due carboni è un chetone. Se invece è attaccato un ossigeno o un azoto, il carbonile fa parte di un gruppo più grande (acido, estere, ammide) che si vede più avanti.

### Aldeidi

In un'**aldeide** il carbonio del carbonile è legato ad almeno un atomo di idrogeno. La formula generale è $\mathrm{R{-}CHO}$, e il gruppo $\mathrm{-CHO}$ sta sempre in fondo alla catena. Il nome IUPAC cambia la -o finale dell'alcano in -ale: metanale, etanale, propanale. Il carbonio del carbonile è sempre il numero 1, e per questo nel nome non si scrive.

```molecole
% nome: gruppi-aldeidi
% alt: Quattro aldeidi con il carbonile colorato in rosso: metanale (formaldeide), etanale (acetaldeide), benzaldeide e cinnamaldeide
% svg: gruppi-aldeidi-858455fa.svg 824x106
colonne: 4
evidenzia: [$([CX3H1][#6]),$([CX3H2])]=[OX1] rosso
C=O | metanale | idrogeni: tutti
CC=O | etanale
O=Cc1ccccc1 | benzaldeide
O=C/C=C/c1ccccc1 | cinnamaldeide
```

Il metanale, detto formaldeide, sciolto in acqua forma la formalina, che serve a conservare i campioni biologici. Molte aldeidi hanno un odore forte: la benzaldeide sa di mandorla amara, la cinnamaldeide dà l'aroma alla cannella e la vanillina, che vedrai più avanti, alla vaniglia.

```ad-warning
Scrivere l'aldeide come COH
La formula dell'etanale si scrive $\mathrm{CH_3CHO}$ e non $\mathrm{CH_3COH}$: scritto così, il gruppo sembra un ossidrile. L'idrogeno dell'aldeide è legato al carbonio, non all'ossigeno.
```

### Chetoni

In un **chetone** il carbonio del carbonile è legato a due atomi di carbonio, quindi sta in mezzo alla catena. La formula generale è $\mathrm{R{-}CO{-}R'}$. Il nome IUPAC cambia la -o finale dell'alcano in -one, con il numero del carbonio del carbonile quando serve: propanone, butan-2-one, pentan-3-one.

```molecole
% nome: gruppi-chetoni
% alt: Quattro chetoni con il carbonile colorato in rosso, in mezzo alla catena o nell'anello: propanone (acetone), butan-2-one, pentan-3-one e cicloesanone
% svg: gruppi-chetoni-424028ff.svg 544x98
colonne: 4
evidenzia: [CX3&$(C([#6])[#6])]=[OX1] rosso
CC(C)=O | propanone
CCC(C)=O | butan-2-one
CCC(=O)CC | pentan-3-one
O=C1CCCCC1 | cicloesanone
```

Il propanone, detto acetone, è il solvente dei prodotti per togliere lo smalto, e lo produce anche il corpo quando brucia molti grassi. Il cicloesanone è una delle materie prime del nylon.

Il carbonile è polare, ma non ha idrogeni legati all'ossigeno: aldeidi e chetoni bollono più in alto degli alcani e più in basso degli alcoli con la stessa catena. Il propano bolle a −42 °C, il propanone a 56 °C e il propan-2-olo a 82 °C.

## Acidi carbossilici

Un **acido carbossilico** ha il gruppo **carbossile** $\mathrm{-COOH}$: un carbonile e un ossidrile legati allo stesso carbonio. La formula generale è $\mathrm{R{-}COOH}$. Il nome IUPAC è "acido" seguito dal nome dell'alcano, con la -o finale cambiata in -oico: acido metanoico, acido etanoico, acido butanoico. Come nelle aldeidi, il carbonio del carbossile è il numero 1.

```molecole
% nome: gruppi-acidi
% alt: Quattro acidi carbossilici con il carbossile colorato in arancione: acido metanoico (formico), acido etanoico (acetico), acido butanoico (butirrico) e acido benzoico
% svg: gruppi-acidi-ef5888bb.svg 652x114
colonne: 4
evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H1] arancione
OC=O | acido metanoico
CC(=O)O | acido etanoico
CCCC(=O)O | acido butanoico
OC(=O)c1ccccc1 | acido benzoico
```

L'acido etanoico, detto acido acetico, dà all'aceto il suo sapore aspro. L'acido metanoico, detto acido formico, è quello che brucia nelle punture delle formiche e nelle foglie di ortica, e l'acido butanoico (acido butirrico) dà l'odore al burro rancido. L'acido benzoico si usa come conservante negli alimenti, con la sigla E210.

Il carbossile non è un ossidrile più un carbonile che stanno vicini per caso: insieme formano un gruppo nuovo, con proprietà sue. La più importante è quella che dà il nome alla classe: in acqua il carbossile cede lo ione $\mathrm{H^+}$, e la molecola è un acido (debole):

$$\mathrm{CH_3COOH \rightleftharpoons CH_3COO^- + H^+}$$

Un alcol, con il suo ossidrile, in acqua non cede $\mathrm{H^+}$ in modo apprezzabile.

```ad-warning
Vedere un alcol nell'acido carbossilico
L'$\mathrm{-OH}$ del carbossile non è un ossidrile alcolico, e nemmeno un fenolo: il carbonio a cui è legato ha anche il doppio legame con l'altro ossigeno. Per questo nei disegni il carbossile è tutto arancione, senza il blu dell'ossidrile.
```

## Esteri

Un **estere** si ottiene da un acido carbossilico mettendo un gruppo di carbonio al posto dell'idrogeno del carbossile. La formula generale è $\mathrm{R{-}COO{-}R'}$: il carbonio del carbonile è legato a un ossigeno, che a sua volta è legato a un altro carbonio. Il nome ha due parti. La parte che viene dall'acido cambia -oico in -oato, la parte legata all'ossigeno prende la desinenza -ile: l'etanoato di etile viene dall'acido etanoico e dall'etanolo.

```molecole
% nome: gruppi-esteri
% alt: Tre esteri con il gruppo estere colorato in verde: etanoato di etile (acetato di etile), butanoato di etile e etanoato di 3-metilbutile (acetato di isoamile)
% svg: gruppi-esteri-2ec87c1b.svg 759x106
colonne: 3
evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H0&$(O([#6])[#6])] verde
CC(=O)OCC | etanoato di etile
CCCC(=O)OCC | butanoato di etile
CC(=O)OCCC(C)C | etanoato di 3-metilbutile
```

Molti esteri hanno un odore di frutta, e l'industria alimentare li usa come aromi: l'etanoato di 3-metilbutile (acetato di isoamile) sa di banana, il butanoato di etile di ananas. L'etanoato di etile (acetato di etile) è il solvente di molti prodotti per togliere lo smalto. Sono esteri anche i grassi e gli oli, formati da glicerolo e acidi carbossilici a catena lunga, e il poliestere delle magliette sportive.

Un estere si forma facendo reagire un acido carbossilico con un alcol, con un acido forte come catalizzatore (qui scritto $\mathrm{H^+}$ sopra la freccia). La reazione si chiama esterificazione e libera una molecola d'acqua. Nel disegno qui sotto i colori hanno un altro significato: dicono da quale molecola viene ogni atomo, blu per l'etanolo e arancione per l'acido acetico.

```reazione
% nome: gruppi-esterificazione
% alt: Esterificazione: etanolo (in blu) e acido acetico (in arancione) danno etanoato di etile e acqua; l'ossigeno tra i due pezzi dell'estere è blu e viene dall'etanolo, l'ossigeno dell'acqua è arancione e viene dall'acido
% svg: gruppi-esterificazione-fa5ff48c.svg 600x140
reazione: [CH3:1][CH2:2][OH:3].[CH3:4][C:5](=[O:6])[OH:7]>[H+]>[CH3:4][C:5](=[O:6])[O:3][CH2:2][CH3:1].[OH2:7]
colora: si
```

L'ossigeno che lega i due pezzi dell'estere viene dall'alcol, e l'acqua si forma con l'$\mathrm{-OH}$ dell'acido e l'idrogeno dell'alcol. Lo hanno dimostrato nel 1938 Irving Roberts e Harold Urey, usando un alcol con atomi di ossigeno più pesanti del normale e cercando dove finivano.

```ad-warning
Confondere l'estere con l'acido
Acido ed estere hanno tutti e due $\mathrm{-COO-}$, ma nell'acido l'ultimo ossigeno porta un idrogeno ($\mathrm{-COOH}$), nell'estere porta un carbonio ($\mathrm{-COO{-}R'}$). Un estere non ha idrogeni legati all'ossigeno e non è un acido.
```

## L'azoto: ammine e ammidi

### Ammine

Le **ammine** si possono pensare come l'ammoniaca, $\mathrm{NH_3}$, con uno o più idrogeni sostituiti da gruppi di carbonio. Nel gruppo amminico l'azoto è legato solo a carboni e a idrogeni, e nessuno di quei carboni ha un $\mathrm{C{=}O}$. Un'ammina è primaria se l'azoto è legato a un solo carbonio ($\mathrm{R{-}NH_2}$), secondaria se è legato a due, terziaria se è legato a tre. Il nome IUPAC aggiunge -ammina al nome dell'alcano, con i gruppi legati all'azoto indicati da una N: metanammina, N-metilmetanammina, N,N-dimetilmetanammina. Per le ammine piccole si usano spesso i nomi tradizionali, che elencano i gruppi: metilammina, dimetilammina, trimetilammina.

```molecole
% nome: gruppi-ammine
% alt: Ammine con l'azoto colorato in viola: metanammina (primaria), N-metilmetanammina (secondaria), N,N-dimetilmetanammina (terziaria) e benzenammina (anilina)
% svg: gruppi-ammine-7c86a541.svg 904x98
colonne: 4
evidenzia: [NX3&+0&!$(N~[!#6&!#1])&!$(N[#6]=[O,S,N])] viola
CN | metanammina
CNC | N-metilmetanammina
CN(C)C | N,N-dimetilmetanammina
Nc1ccccc1 | benzenammina
```

Le ammine piccole hanno un odore sgradevole: la N,N-dimetilmetanammina (trimetilammina) è l'odore del pesce che non è più fresco. La benzenammina, detta anilina, è la materia prima di molti coloranti. Il gruppo amminico si trova in tanti farmaci e nei messaggeri chimici del corpo, come l'adrenalina e la dopamina.

Come l'ammoniaca, le ammine sono basi: l'azoto ha una coppia di elettroni libera con cui può legare uno ione $\mathrm{H^+}$.

### Ammidi

In un'**ammide** l'azoto è legato al carbonio di un carbonile. La formula generale della più semplice è $\mathrm{R{-}CONH_2}$, e gli idrogeni sull'azoto possono essere sostituiti da gruppi di carbonio ($\mathrm{R{-}CONH{-}R'}$). Il nome IUPAC cambia la -o finale dell'alcano in -ammide: metanammide, etanammide, e N-metiletanammide se sull'azoto c'è un metile.

```molecole
% nome: gruppi-ammidi
% alt: Ammidi con il gruppo ammidico colorato in giallo: metanammide (formammide), etanammide (acetammide), N-metiletanammide e urea, che ha due azoti legati allo stesso carbonile
% svg: gruppi-ammidi-bad75116.svg 724x118
colonne: 4
evidenzia: [CX3](=[OX1])[NX3] giallo
NC=O | metanammide
CC(N)=O | etanammide
CNC(C)=O | N-metiletanammide
NC(N)=O | urea
```

Il legame che tiene insieme gli amminoacidi nelle proteine, il legame peptidico, è un gruppo ammidico, e lo stesso gruppo lega le catene del nylon. L'urea, che ha due azoti legati allo stesso carbonile, si trova nell'urina ed è il concime azotato più usato.

A differenza delle ammine, le ammidi non sono basi: la coppia di elettroni dell'azoto è attratta dal carbonile vicino e non lega lo ione $\mathrm{H^+}$.

```ad-warning
Chiamare ammina un'ammide
Ammina e ammide hanno nomi quasi uguali, e la differenza tra le due molecole sta tutta in un $\mathrm{C{=}O}$. Se uno dei carboni legati all'azoto ha un doppio legame con un ossigeno, il gruppo è un'ammide. Nella N-metiletanammide l'azoto è legato anche a un metile, ma questo non basta a farne un'ammina: il carbonile accanto decide.
```

## Come riconoscere i gruppi in una molecola

Una molecola vera ha spesso più gruppi funzionali. Per trovarli tutti senza scambiarne uno per un altro, segui quest'ordine:

1. Cerca gli atomi diversi da C e H: O, N, F, Cl, Br, I. Ogni gruppo di questa lezione ne contiene almeno uno.
2. Per ogni $\mathrm{C{=}O}$, guarda cosa c'è attaccato al carbonio: un $\mathrm{-OH}$ fa un acido carbossilico; un ossigeno legato a un altro carbonio fa un estere; un azoto fa un'ammide; un idrogeno fa un'aldeide; due carboni fanno un chetone.
3. Per ogni ossigeno con due legami semplici che non è già in un gruppo del passo 2: con un idrogeno è un alcol, se il carbonio ha soli legami semplici, o un fenolo, se il carbonio è dell'anello; tra due carboni è un etere.
4. Ogni azoto che non è già in un'ammide è un'ammina.
5. Ogni alogeno legato a un carbonio con soli legami semplici è un alogenuro alchilico.

L'ordine conta: un ossigeno o un azoto accanto a un $\mathrm{C{=}O}$ appartiene al gruppo del carbonile, e non va contato una seconda volta come alcol, etere o ammina.

## Gruppi che si confondono

Le coppie qui sotto sono quelle che si scambiano più spesso. Nel disegno ogni riga mette le due classi una accanto all'altra.

```molecole
% nome: gruppi-coppie
% alt: Cinque coppie di molecole da non confondere, una per riga: etanale e propanone, acido etanoico e etanoato di metile, etossietano e etanoato di etile, etanammina e etanammide, cicloesanolo e fenolo, ognuna con il suo gruppo colorato
% svg: gruppi-coppie-165575c0.svg 524x555
colonne: 2
CC=O | etanale: aldeide | evidenzia: [$([CX3H1][#6]),$([CX3H2])]=[OX1] rosso
CC(C)=O | propanone: chetone | evidenzia: [CX3&$(C([#6])[#6])]=[OX1] rosso
CC(=O)O | acido etanoico: acido | evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H1] arancione
CC(=O)OC | etanoato di metile: estere | evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H0&$(O([#6])[#6])] verde
CCOCC | etossietano: etere | evidenzia: [OX2&$(O([#6])[#6])&!$(O[#6]=[O,S,N])] grigio
CCOC(C)=O | etanoato di etile: estere | evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H0&$(O([#6])[#6])] verde
CCN | etanammina: ammina | evidenzia: [NX3&+0&!$(N~[!#6&!#1])&!$(N[#6]=[O,S,N])] viola
CC(N)=O | etanammide: ammide | evidenzia: [CX3](=[OX1])[NX3] giallo
OC1CCCCC1 | cicloesanolo: alcol | evidenzia: [OX2H1&$(O[CX4])] blu
Oc1ccccc1 | fenolo: fenolo | evidenzia: [OX2H1&$(Oc)] blu
```

| Coppia | Dove guardare | Come si distinguono |
|---|---|---|
| aldeide e chetone | il carbonio del $\mathrm{C{=}O}$ | aldeide: ha un idrogeno, sta in fondo; chetone: è tra due carboni |
| acido ed estere | l'ossigeno dopo il $\mathrm{C{=}O}$ | acido: porta un idrogeno; estere: porta un carbonio |
| etere ed estere | i carboni legati all'ossigeno | etere: nessuno ha un $\mathrm{C{=}O}$; estere: uno sì |
| ammina e ammide | i carboni legati all'azoto | ammina: nessuno ha un $\mathrm{C{=}O}$; ammide: uno sì |
| alcol e fenolo | il carbonio che porta l'$\mathrm{-OH}$ | alcol: ha soli legami semplici; fenolo: è dell'anello |

```ad-tip
Il carbonio del C=O decide
Quattro coppie su cinque si risolvono guardando un solo atomo: il carbonio del carbonile, o il carbonio accanto all'ossigeno o all'azoto. Prima di dare un nome al gruppo, conta cosa c'è legato a quel carbonio.
```

## Gruppi funzionali nelle molecole vere

Farmaci, aromi e ormoni sono molecole con più gruppi funzionali, e ognuno contribuisce alle proprietà dell'insieme. Con le regole di prima li puoi trovare tutti.

L'acido acetilsalicilico, il principio attivo dell'aspirina, ha un estere e un acido carbossilico attaccati allo stesso anello. Nel corpo l'estere si rompe, reagendo con l'acqua, e resta l'acido salicilico, che ha un fenolo al posto dell'estere.

```molecola
% nome: gruppi-aspirina
% alt: Acido acetilsalicilico (aspirina): il gruppo estere è colorato in verde e il carbossile in arancione, tutti e due legati all'anello benzenico
% svg: gruppi-aspirina-3e129907.svg 210x163
smiles: CC(=O)Oc1ccccc1C(=O)O
evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H0&$(O([#6])[#6])] verde; [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H1] arancione
legenda: acido acetilsalicilico
```

Il paracetamolo, un antidolorifico e antifebbrile, ha un fenolo e un'ammide sui due lati opposti dell'anello.

```molecola
% nome: gruppi-paracetamolo
% alt: Paracetamolo: l'ossidrile del fenolo è colorato in blu, il gruppo ammidico in giallo, sui due lati opposti dell'anello
% svg: gruppi-paracetamolo-fb1eb26c.svg 210x116
smiles: CC(=O)Nc1ccc(O)cc1
evidenzia: [OX2H1&$(Oc)] blu; [CX3](=[OX1])[NX3] giallo
legenda: paracetamolo
```

La vanillina, che dà l'aroma alla vaniglia, ha tre gruppi diversi in una molecola di otto carboni: un'aldeide, un fenolo e un etere.

```molecola
% nome: gruppi-vanillina
% alt: Vanillina: il carbonile dell'aldeide è colorato in rosso, l'ossidrile del fenolo in blu e l'ossigeno dell'etere in grigio
% svg: gruppi-vanillina-c65b0847.svg 174x142
smiles: COc1cc(C=O)ccc1O
evidenzia: [$([CX3H1][#6]),$([CX3H2])]=[OX1] rosso; [OX2H1&$(Oc)] blu; [OX2&$(O([#6])[#6])&!$(O[#6]=[O,S,N])] grigio
legenda: vanillina
```

La capsaicina, la molecola che rende piccante il peperoncino, ha lo stesso anello della vanillina, con il fenolo e l'etere, e un'ammide che lo collega a una lunga catena di carbonio. Il doppio legame C=C nella catena è il gruppo funzionale degli alcheni, che in questa lezione non si colora.

```molecola
% nome: gruppi-capsaicina
% alt: Capsaicina: a sinistra l'anello con l'ossidrile del fenolo in blu e l'ossigeno dell'etere in grigio, al centro il gruppo ammidico in giallo, a destra una lunga catena di carbonio con un doppio legame
% svg: gruppi-capsaicina-a54aecf2.svg 441x145
smiles: COc1cc(CNC(=O)CCCC/C=C/C(C)C)ccc1O
evidenzia: [OX2H1&$(Oc)] blu; [OX2&$(O([#6])[#6])&!$(O[#6]=[O,S,N])] grigio; [CX3](=[OX1])[NX3] giallo
legenda: capsaicina
```

L'adrenalina, l'ormone che il corpo libera nei momenti di pericolo, ha tre ossidrili: due legati all'anello, che sono fenoli, e uno sulla catena, che è un alcol. Tutti e tre sono blu, perché il gruppo è lo stesso; è il carbonio a cui sono attaccati a decidere la classe. In fondo alla catena c'è un'ammina secondaria.

```molecola
% nome: gruppi-adrenalina
% alt: Adrenalina: tre ossidrili colorati in blu, due sull'anello (fenoli) e uno sulla catena (alcol), e l'azoto dell'ammina colorato in viola in fondo alla catena
% svg: gruppi-adrenalina-619c6201.svg 234x127
smiles: CNC[C@H](O)c1ccc(O)c(O)c1
evidenzia: [OX2H1&$(O[CX4])] blu; [OX2H1&$(Oc)] blu; [NX3&+0&!$(N~[!#6&!#1])&!$(N[#6]=[O,S,N])] viola
legenda: adrenalina
```

L'ibuprofene, un antinfiammatorio, ha un solo gruppo funzionale, il carbossile: tutto il resto è carbonio e idrogeno.

```molecola
% nome: gruppi-ibuprofene
% alt: Ibuprofene: l'unico gruppo funzionale è il carbossile, colorato in arancione; il resto della molecola è un anello benzenico con catene di carbonio
% svg: gruppi-ibuprofene-0d89b73c.svg 260x133
smiles: CC(C)Cc1ccc(cc1)C(C)C(=O)O
evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H1] arancione
legenda: ibuprofene
```

L'acetato di isoamile, il cui nome IUPAC è etanoato di 3-metilbutile, dà l'odore alle banane ed è l'aroma di banana delle caramelle. Ha un solo gruppo, un estere.

```molecola
% nome: gruppi-acetato-isoamile
% alt: Acetato di isoamile (etanoato di 3-metilbutile): il gruppo estere è colorato in verde tra la parte che viene dall'acido acetico e la catena ramificata di cinque carboni
% svg: gruppi-acetato-isoamile-e1c7b94a.svg 183x98
smiles: CC(=O)OCCC(C)C
evidenzia: [$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H0&$(O([#6])[#6])] verde
legenda: acetato di isoamile
```

Il limonene, che dà l'odore alla buccia dei limoni e delle arance, non ha nessuno dei gruppi di questa lezione: è un idrocarburo, fatto solo di carbonio e idrogeno, con due doppi legami C=C. Un odore forte non vuol dire per forza un gruppo con l'ossigeno.

```molecola
% nome: gruppi-limonene
% alt: Limonene: un anello di sei carboni con un doppio legame e una catena laterale con un altro doppio legame, senza ossigeno né azoto e senza nessun gruppo colorato
% svg: gruppi-limonene-0cd1ce5b.svg 159x91
smiles: CC1=CCC(CC1)C(=C)C
legenda: limonene
```

```ad-note
Un caso più difficile: la caffeina
La caffeina ha quattro atomi di azoto, due dei quali sono legati a un carbonio che ha un $\mathrm{C{=}O}$: formano gruppi ammidici, chiusi dentro l'anello a sei atomi. Il carbonile a sinistra nel disegno è tra due azoti, come nell'urea. Gli altri due azoti stanno nell'anello a cinque atomi, che è aromatico come il benzene: non sono né ammine né ammidi nel senso di questa lezione, e per questo non sono colorati. Azoti di questo tipo si trovano anche nelle basi del DNA.

```molecola
% nome: gruppi-caffeina
% alt: Caffeina: i due carbonili dell'anello a sei atomi, con gli azoti legati a loro, sono colorati in giallo come gruppi ammidici; i due azoti dell'anello a cinque atomi non sono colorati
% svg: gruppi-caffeina-236dcccb.svg 167x168
smiles: Cn1cnc2c1c(=O)n(C)c(=O)n2C
evidenzia: [#6X3](=[OX1])[#7] giallo
legenda: caffeina
```
```
