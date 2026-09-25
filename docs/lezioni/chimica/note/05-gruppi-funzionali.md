# Note: I gruppi funzionali

## Cosa c'è

Lezione nuova, scritta il 25 settembre 2026 per la prova di RDKit. Ambito: cos'è un gruppo funzionale e perché decide le proprietà (apertura con etano, etanolo e acido acetico), la notazione R e R′, poi dieci classi: alogenuri alchilici, alcoli, fenoli, eteri, aldeidi, chetoni, acidi carbossilici, esteri (con la reazione di esterificazione), ammine, ammidi. Per ognuna formula generale, regola del nome IUPAC, esempi con nome IUPAC italiano e nome tradizionale, dove si trova e una proprietà. Seguono il procedimento in cinque passi per trovare i gruppi, la sezione sulle coppie che si confondono (figura a coppie e tabella) e otto molecole vere: acido acetilsalicilico, paracetamolo, vanillina, capsaicina, adrenalina, ibuprofene, acetato di isoamile, limonene, più la caffeina in un riquadro a parte. Tioli e nitrili non ci sono: non servivano a nessuna molecola della lezione e avrebbero chiesto altri due colori.

## Colori

`figure.py` ha sette colori, i gruppi sono otto. La scelta: il colore segue il gruppo di atomi, non la classe, come suggeriva il brief. Blu per l'ossidrile (alcoli e fenoli), rosso per il carbonile (aldeidi e chetoni), arancione per il carbossile, verde per l'estere, grigio per l'etere, viola per l'ammina, giallo per l'ammide. Gli alogeni restano senza sfondo, perché RDKit scrive già F, Cl, Br e I con un colore proprio, e la lezione lo dice. Le coppie che si confondono per colore (alcol e fenolo, aldeide e chetone) sono proprio quelle che la lezione insegna a distinguere guardando il carbonio; le altre tre coppie (acido ed estere, etere ed estere, ammina e ammide) hanno colori diversi.

Nella prima versione l'ammide era grigia: su tre atomi, nel tema chiaro, si vedeva poco, e l'ho scambiata con l'etere, che è un solo atomo.

## SMARTS

Nei blocchi figura il `;` separa le evidenziazioni, quindi i SMARTS non possono usare il `;` come AND: ho usato `&`. Dove il gruppo è un solo atomo (ossidrile, etere, ammina) l'ambiente si chiede con un SMARTS ricorsivo `$(...)`, così si colora solo quell'atomo. Sono gli stessi SMARTS del generatore (`GROUPS` in `scripts/chimica/esercizi/gruppi_funzionali.py`):

- alcol `[OX2H1&$(O[CX4])]`: l'O con H su un carbonio sp3, quindi non prende l'OH del carbossile né quello di un fenolo;
- fenolo `[OX2H1&$(Oc)]`;
- etere `[OX2&$(O([#6])[#6])&!$(O[#6]=[O,S,N])]`: niente O accanto a un carbonile, quindi non prende l'O dell'estere;
- aldeide `[$([CX3H1][#6]),$([CX3H2])]=[OX1]`;
- chetone `[CX3&$(C([#6])[#6])]=[OX1]`: carbonio del carbonile legato a due carboni;
- acido `[$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H1]`;
- estere `[$([CX3][#6]),$([CX3H1])](=[OX1])[OX2H0&$(O([#6])[#6])]`: l'O senza H, quindi non prende l'acido (nella prima prova `O[#6]` prendeva anche l'acido, perché l'O dell'OH è legato al carbonio del carbossile);
- ammina `[NX3&+0&!$(N~[!#6&!#1])&!$(N[#6]=[O,S,N])]`;
- ammide `[CX3](=[OX1])[NX3]`; solo per la caffeina `[#6X3](=[OX1])[#7]`, perché lì gli atomi sono aromatici.

Controllo fatto: per ogni figura della lezione e del formulario (tranne la caffeina e l'apertura, che usano gli indici degli atomi) gli atomi colorati da questi SMARTS coincidono con i gruppi trovati dal controllo indipendente degli esercizi, che usa regole sul grafo e nessun SMARTS. Nessuna differenza.

## Verifica dei nomi

Tutti i nomi letti da OPSIN (py2opsin, nomi inglesi) danno la molecola del SMILES, stereochimica compresa. Molecole semplici (le 65 del generatore, più diclorodifluorometano, propan-1,2,3-triolo e urea della lezione): clorometano, diclorometano, triclorometano, bromoetano, 2-bromopropano, 1-clorobutano, iodometano, clorocicloesano, diclorodifluorometano; metanolo, etanolo, propan-1-olo, propan-2-olo, butan-1-olo, cicloesanolo, 2-metilpropan-2-olo, fenilmetanolo, etan-1,2-diolo, propan-1,2,3-triolo; fenolo, 2-metilfenolo, 4-metilfenolo, 4-etilfenolo, benzene-1,4-diolo; metossimetano, metossietano, etossietano, metossibenzene, 2-metossi-2-metilpropano, 1-propossipropano; metanale, etanale, propanale, butanale, 2-metilpropanale, benzaldeide, (E)-3-fenilprop-2-enale; propanone, butan-2-one, pentan-2-one, pentan-3-one, cicloesanone, 1-feniletanone; acido metanoico, etanoico, propanoico, butanoico, 2-metilpropanoico, benzoico; metanoato di metile, etanoato di metile, etanoato di etile, propanoato di metile, butanoato di etile, benzoato di metile, etanoato di 3-metilbutile; metanammina, etanammina, propan-1-ammina, N-metilmetanammina, N,N-dimetilmetanammina, benzenammina, cicloesanammina; metanammide, etanammide, propanammide, N-metiletanammide, N,N-dimetilmetanammide, benzammide, urea; più etano, propano e butan-1-olo del testo.

Molecole vere (le 35 del generatore, più caffeina e limonene della lezione), con il nome IUPAC inglese: acido acetilsalicilico, paracetamolo, vanillina, capsaicina, adrenalina (R), dopamina, acido salicilico, salicilato di metile, benzocaina, procaina, lidocaina, acido lattico, acido citrico, glucosio e fruttosio a catena aperta (con gli stereocentri), acido piruvico, lattato di etile, zingerone, chetone del lampone, guaiacolo, alanina, serina, tirosina (S), antranilato di metile, metilparabene, salbutamolo, aspartame, eugenolo, fenacetina, ibuprofene, acetato di isoamile, mentolo (1R,2S,5R), DEET, cinnamaldeide, timolo, caffeina, limonene.

## Figure

23 figure nella lezione, 1 nel formulario (`gruppi-formulario-esempi`, nome diverso da quelli della lezione, con l'esempio più semplice di ogni classe a coppie). Guardate tutte in chiaro e in scuro. Correzioni fatte:

- nella figura di apertura, con tutti gli idrogeni, l'H dell'ossidrile e del carbossile restava fuori dal colore: ora i gruppi si colorano per indici, H compreso;
- il metanale in formula scheletrica era un trattino con una O: ora ha gli idrogeni scritti;
- il testo della caffeina diceva "il carbonile in alto", ma RDKit lo disegna a sinistra.

Da guardare sul sito:

- nel tema chiaro il grigio dell'etere è pallido (si vede, ma poco), e nel tema scuro il giallo dell'ammide e l'arancione del carbossile sono due marroni simili. Si risolve solo in `figure.py`, per esempio con un ottavo colore più deciso (che servirebbe anche agli alogeni) e con un giallo scuro meno vicino all'arancione;
- l'esterificazione usa i colori in un altro senso (la molecola di provenienza, con `colora: si`): il testo lo dice, e i colori tornano con quelli della lezione (blu l'alcol, arancione l'acido), ma è l'unica figura dove succede;
- il checker `scripts/lezioni/check.mts` segnala come LaTeX sbagliato i `$` dei SMARTS ricorsivi dentro i blocchi figura (falso positivo: non conosce i blocchi di chimica). Senza i blocchi figura la lezione passa, con l'avviso dei 15 grassetti, tutti su termini definiti; il formulario passa.

## Esercizi

Generatore `scripts/chimica/esercizi/gruppi_funzionali.py`, controllo `scripts/chimica/esercizi/verifica/gruppi_funzionali.py`. Due raccolte curate (65 molecole semplici con un solo tipo di gruppo, 35 molecole vere); i gruppi li calcola RDKit con i SMARTS, e il generatore si ferma se una molecola semplice ha più di un tipo di gruppo.

Nelle domande il gruppo da riconoscere è cerchiato con un contorno grigio uguale per tutti: con il colore della lezione la risposta sarebbe già scritta. Il disegno della soluzione ha i gruppi colorati come nella lezione. RDKit riempie i cerchi anche con `fillHighlights` spento, quindi il generatore toglie il riempimento dall'SVG e controlla di aver trovato tanti cerchi quanti atomi.

Livelli: 1) molecola semplice, un tipo di gruppo, cerchiato, distrattori non gemelli; 2) nome della classe e quattro molecole disegnate; 3) coppie che si confondono, con il gemello sempre tra i distrattori (metà domande sul gruppo cerchiato, metà su quattro disegni); 4) molecola vera con almeno due tipi di gruppo, uno cerchiato, con distrattori presi anche dagli altri gruppi della stessa molecola; 5) quanti tipi di gruppo o quali gruppi contiene una molecola vera (distrattori: il conteggio delle occorrenze al posto dei tipi, un gruppo scambiato con il gemello, uno dimenticato, uno in più). Nei livelli 1 e 3 il nome della molecola compare solo nella soluzione, perché il suffisso (-olo, -ale, -one) direbbe la risposta.

Il controllo indipendente riconosce i gruppi con regole sul grafo (vicini, ordine dei legami, idrogeni), rilegge ogni nome con OPSIN, confronta i gruppi con quelli del generatore, e controlla che gli atomi cerchiati formino un gruppo della risposta e non tocchino nessun gruppo dei distrattori.

`campioni.py gruppi-funzionali --n 200`: PASS, 200 su 200 a ogni livello. Il controllo ha trovato un bug vero alla prima esecuzione: il generatore salvava nei parametri il SMILES canonico, ma gli indici degli atomi cerchiati erano quelli del SMILES originale (4 esercizi su 200 al livello 4, sul fruttosio). Corretto.

Errori piantati, tutti bocciati: opzione giusta cambiata (150 su 150), distrattore uguale alla risposta (150 su 150), cerchiato un altro gruppo della molecola (60 su 60), nome inglese che non corrisponde al disegno (60 su 60), al livello 5 le occorrenze contate al posto dei tipi (44 su 44), SMARTS ingenui nel generatore (`C(=O)O` per l'estere, `[OX2H]` per l'alcol, `[#6][CX3](=O)` per il chetone): 155 su 158, e i 3 che passano sono molecole in cui i SMARTS ingenui danno lo stesso risultato.

## Dubbi da decidere

- Alcheni e alchini: molti libri contano il doppio e il triplo legame tra i gruppi funzionali. Qui sono nominati (capsaicina, limonene) ma non colorati né chiesti; il livello 5 esclude le molecole con C=C fuori dall'anello.
- Nomi: ho usato la forma IUPAC con il locante prima del suffisso (propan-2-olo, butan-2-one, etan-1,2-diolo) come la lezione 03. Molti libri italiani scrivono ancora 2-propanolo e 2-butanone. Per le ammine ho usato metanammina e N-metilmetanammina, con il nome tradizionale tra parentesi; per gli eteri dimetiletere e dietiletere come nella lezione 04.
- Caffeina: la lezione chiama ammidici i due carbonili legati ad azoti, e dice che quello tra due azoti è come l'urea. È una semplificazione (a rigore sono un'immide e un'urea ciclica dentro un anello aromatico); la caffeina è fuori dagli esercizi.
- Glucosio e fruttosio negli esercizi sono nella forma aperta, come nella formula di Fischer; in soluzione sono quasi tutti in forma ciclica, che ha un gruppo (emiacetale) che la lezione non tratta. La domanda lo dice ("forma aperta").
- Anilina e benzocaina: l'azoto legato all'anello è contato come ammina, come fanno i libri; la lezione non distingue ammine alifatiche e aromatiche.
- Da verificare su una fonte: le date e i nomi storici (Simpson e il cloroformio 1847, Morton e l'etere 1846, Lister e il fenolo 1867, Roberts e Urey 1938, Protocollo di Montreal 1987), le temperature di ebollizione (etano −89 °C, etanolo 78 °C, acido acetico 118 °C, dietiletere 35 °C, butan-1-olo 118 °C, propano −42 °C, propanone 56 °C, propan-2-olo 82 °C) e le frasi su dove si trovano le molecole. Sono scritti a memoria, non controllati.
- Il formulario ha una tabella a cinque colonne: sul telefono andrà a capo. Se è troppo larga si può togliere la colonna "Esempio", che la figura sotto ripete.
