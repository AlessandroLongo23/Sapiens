# I solidi: ionici, molecolari, covalenti e metallici

Generatore: `chim-stato-solido` (`src/lib/exercises/v2/generators/chim-stato-solido.ts`, con
`src/lib/exercises/v2/chim3-h.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_stato_solido.py` (con
`scripts/exercises/checkers/_chim3_h.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/75-chim-stato-solido.md`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. I livelli 1 e 6 sono a domande fisse, perché
quelle parti della lezione sono descrittive; gli altri applicano una regola della lezione a dati scelti a caso. Tutti a
scelta multipla con quattro opzioni; il livello 4 anche a risposta aperta (un numero intero).

## Nomi dei livelli

1. Cristallini e amorfi, reticolo e cella
2. Dalla formula al tipo di solido
3. Dalle proprietà al tipo di solido
4. Quante particelle nella cella
5. Ordinare le temperature di fusione
6. Le forme del carbonio

## Livello 1: cristallini e amorfi, reticolo e cella

Ventiquattro domande delle prime due sezioni della lezione, ognuna con la risposta e tre distrattori: come sono
disposte le particelle in un solido cristallino e in uno amorfo, come si comportano quando si scaldano, esempi
dell'uno e dell'altro, che cosa vuol dire "cristallino" in chimica, il vetro "cristallo" dei bicchieri e il pezzo di
ferro, quarzo e vetro di silice, come si rompe un cristallo, reticolo, nodi, cella elementare, le tre celle cubiche,
la cella di rame, ferro e sodio, il vertice in comune a otto cubi. Caso: `fatto`.

- "Come si comporta un solido amorfo quando viene scaldato?" Risposta: rammollisce un po' alla volta. Distrattori:
  fonde a una temperatura precisa; si spacca lungo piani precisi; resta duro finché non bolle.
- "Che cella elementare ha il rame?" Risposta: cubica a facce centrate. Distrattori: cubica a corpo centrato; cubica
  semplice; nessuna: è amorfo.

I distrattori sono gli errori del riquadro "Il cristallo dei bicchieri non è un cristallo" (trasparenza e lucentezza
scambiate per ordine) e lo scambio tra le definizioni vicine (cristallino e amorfo, nodo e cella, le tre celle).

## Livello 2: dalla formula al tipo di solido

"Che tipo di solido è il bromuro di potassio, $\mathrm{KBr}$?" Le opzioni sono sempre le quattro: ionico, molecolare,
covalente, metallico. Si estrae prima il tipo (un quarto ciascuno), poi la sostanza. La risposta segue le regole
"Dalla formula" della lezione:

1. un metallo, o una lega di metalli: metallico (ferro $\mathrm{Fe}$, rame $\mathrm{Cu}$, argento $\mathrm{Ag}$, oro
   $\mathrm{Au}$, alluminio $\mathrm{Al}$, sodio $\mathrm{Na}$, ottone);
2. un composto tra un metallo e un non metallo: ionico ($\mathrm{NaCl}$, $\mathrm{KBr}$, $\mathrm{KCl}$,
   $\mathrm{MgO}$, $\mathrm{CaF_2}$, $\mathrm{CaO}$, $\mathrm{LiF}$, $\mathrm{NaBr}$, $\mathrm{MgCl_2}$);
3. i casi di rete covalente da ricordare: covalente (diamante, quarzo $\mathrm{SiO_2}$, silicio $\mathrm{Si}$, carburo
   di silicio $\mathrm{SiC}$);
4. le altre sostanze fatte di non metalli: molecolare (ghiaccio $\mathrm{H_2O}$, ghiaccio secco $\mathrm{CO_2}$, iodio
   $\mathrm{I_2}$, ammoniaca solida $\mathrm{NH_3}$, zolfo $\mathrm{S_8}$, metano solido $\mathrm{CH_4}$, argon solido
   $\mathrm{Ar}$, zucchero, naftalina).

Diamante, zucchero, naftalina e ottone sono scritti senza formula, come nella lezione. Nei passaggi c'è la regola
usata. Caso: il tipo.

- "Che tipo di solido è il quarzo, $\mathrm{SiO_2}$?" Risposta: covalente (è uno dei casi da ricordare).
- "Che tipo di solido è il ghiaccio secco, $\mathrm{CO_2}$?" Risposta: molecolare (un composto tra non metalli, fatto
  di molecole).

## Livello 3: dalle proprietà al tipo di solido

"Un solido sconosciuto fonde a $T\,^\circ\text{C}$." Poi due frasi in ordine casuale, una sulla conduzione e una sulla
durezza, e la domanda "Che tipo di solido è?". Le opzioni sono le quattro del livello 2. Si estrae prima il tipo (un
quarto ciascuno). La risposta segue il procedimento "Dalle proprietà" della lezione, e i dati di ogni tipo stanno in
intervalli che non si toccano:

| Tipo | Conduzione | Durezza | $T$ in $^\circ\text{C}$ |
|---|---|---|---|
| metallico | conduce da solido (o da solido e da fuso) | si lascia ridurre in lamine, si piega senza rompersi, è malleabile | da $60$ a $1600$ |
| ionico | non conduce da solido, conduce da fuso o sciolto in acqua | duro ma fragile, si spacca lungo un piano | da $600$ a $1000$ |
| molecolare | non conduce in nessun caso | tenero, si scalfisce con un'unghia, si sbriciola | da $40$ a $190$ |
| covalente | non conduce in nessun caso | durissimo, riga il vetro | da $1450$ a $3500$ |

La temperatura è un numero intero qualunque dell'intervallo: è un dato, non un risultato. Caso: il tipo.

- "Un solido sconosciuto fonde a $755\,^\circ\text{C}$. Allo stato solido non conduce la corrente; sciolto in acqua la
  conduce. Sotto un colpo si spacca lungo un piano. Che tipo di solido è?" Risposta: ionico.
- "Un solido sconosciuto fonde a $82\,^\circ\text{C}$. Si scalfisce con un'unghia. Non conduce la corrente né da solido
  né da fuso. Che tipo di solido è?" Risposta: molecolare.

## Livello 4: quante particelle nella cella

"In una cella cubica ci sono $8$ particelle sui vertici, $6$ sulle facce e $2$ all'interno. Quante particelle contiene
la cella?" Sui vertici $0$ oppure $8$, sugli spigoli $0$ oppure $12$, sulle facce $0$, $2$ oppure $6$, all'interno $0$,
$1$, $2$ oppure $4$; almeno una posizione tra vertici, spigoli e facce è occupata ($44$ celle). Una volta su quattro la
cella è una delle tre della lezione (semplice, a corpo centrato, a facce centrate). La risposta si calcola con la
regola della lezione: vertice $\frac{1}{8}$, spigolo $\frac{1}{4}$, faccia $\frac{1}{2}$, interno $1$; è sempre un
intero. Anche a risposta aperta. Caso: `cella`.

Nei passaggi la regola, il conto scritto come nell'esempio 1 della lezione e la conclusione.

- $8$ sui vertici e $6$ sulle facce: $8 \cdot \frac{1}{8} + 6 \cdot \frac{1}{2} = 1 + 3 = 4$. Distrattori $14$, $5$,
  $7$.
- $12$ sugli spigoli, $2$ sulle facce e $2$ all'interno: $12 \cdot \frac{1}{4} + 2 \cdot \frac{1}{2} + 2 = 3 + 1 + 2 =
  6$.

Distrattori, nell'ordine in cui si provano (si tengono i primi tre diversi tra loro e dalla risposta): tutte le
particelle contate per intero (il riquadro "Contare i pallini del disegno"); i vertici contati per un quarto; le facce
contate per intero; i vertici contati per un mezzo; gli spigoli contati per un mezzo; le particelle interne
dimenticate; la risposta più $1$, più $2$, meno $1$.

## Livello 5: ordinare le temperature di fusione

"Metti in ordine di temperatura di fusione crescente: cloruro di sodio $\mathrm{NaCl}$, diamante, iodio
$\mathrm{I_2}$." Un solido molecolare, uno ionico e uno covalente, elencati in ordine casuale. La risposta è sempre
molecolare, ionico, covalente. Le quattro opzioni sono ordinamenti dei tre solidi, scritti in breve (la formula dove
c'è, il nome negli altri casi): quello giusto, quello rovesciato e due degli altri quattro. Caso: `ordine`.

| Tipo | Solidi, con la temperatura che dà la lezione |
|---|---|
| molecolare | iodio $\mathrm{I_2}$ ($114$), ghiaccio ($0$), naftalina ($80$), zucchero ($186$) |
| ionico | cloruro di sodio $\mathrm{NaCl}$ ($801$), cloruro di potassio $\mathrm{KCl}$ ($770$), ossido di magnesio $\mathrm{MgO}$ ($2852$) |
| covalente | diamante (oltre $3500$), quarzo $\mathrm{SiO_2}$ (circa $1700$), carburo di silicio $\mathrm{SiC}$ (sopra i $2500$) |

I metalli non compaiono: la lezione dice che le loro temperature di fusione sono molto varie. Nei passaggi il tipo di
ciascuno, che cosa si deve vincere per fonderlo e le temperature della lezione.

- iodio, cloruro di sodio, diamante: "$\mathrm{I_2}$, $\mathrm{NaCl}$, diamante".
- ghiaccio, cloruro di potassio, carburo di silicio: "ghiaccio, $\mathrm{KCl}$, $\mathrm{SiC}$".

## Livello 6: le forme del carbonio

Venti domande della sezione sulle forme allotropiche: che cosa sono, quanti legami fa ogni atomo nel diamante e nella
grafite, il tetraedro, gli strati di esagoni, perché la grafite conduce e il diamante no, che cosa unisce gli atomi di
uno strato e gli strati tra loro, perché la grafite è tenera, la mina delle matite, l'aspetto, la densità, il fullerene
(tipo di solido, $60$ atomi, pentagoni ed esagoni), il grafene, il nanotubo, l'ozono. Caso: `fatto`.

- "Che cosa tiene uniti tra loro gli strati della grafite?" Risposta: forze di London. Distrattori: legami covalenti,
  legami ionici, legami a idrogeno.
- "Che tipo di solido è il fullerene?" Risposta: molecolare. Distrattori: covalente, ionico, metallico.

## Esercizi da evitare

- La grafite nei livelli 2 e 3: la lezione dice che sta a metà tra i tipi (covalente negli strati, molecolare tra gli
  strati, conduce come un metallo). Compare solo nel livello 6.
- Nel livello 5, l'ossido di magnesio con il quarzo o con il carburo di silicio: $\mathrm{MgO}$ fonde a
  $2852\,^\circ\text{C}$, più in alto del quarzo (circa $1700\,^\circ\text{C}$) e vicino al carburo di silicio (sopra i
  $2500\,^\circ\text{C}$), e l'ordine "ionico prima di covalente" sarebbe falso o dubbio. L'ossido di magnesio compare
  solo con il diamante.
- Nel livello 5, un metallo: può fondere a $-39\,^\circ\text{C}$ o a $3422\,^\circ\text{C}$.
- Nel livello 3, un solido che non conduce mai e fonde tra $200$ e $1400\,^\circ\text{C}$, o uno ionico fuori
  dall'intervallo tra $600$ e $1000\,^\circ\text{C}$: i dati non direbbero più un tipo solo.
- Nel livello 4, una cella con particelle solo all'interno (non c'è niente da dividere), e numeri di particelle che
  un cubo non ha (per esempio $4$ vertici).
- Nei livelli 1 e 6, domande che chiedono un numero da ricordare a memoria senza un'idea dietro (le distanze in
  picometri, i valori delle densità, gli anni).

## Verifica

`chim_stato_solido.py` rilegge il testo del problema e non usa `params`. Livelli 1 e 6: una chiave delle risposte
scritta dalla lezione. Livello 2: una tabella sua dei nomi con le formule; il tipo si ricava dalla formula con le
regole della lezione (i metalli dalla famiglia in `elementi.json`, le reti covalenti da un elenco, il resto
molecolare). Livello 3: legge temperatura, frase sulla conduzione e frase sulla durezza, applica il procedimento "Dalle
proprietà" e boccia i dati che non concordano con il tipo. Livello 4: legge le particelle di ogni posizione, controlla
che siano tra quelle ammesse, somma con frazioni esatte, controlla la risposta aperta, le opzioni e il conto scritto
nei passaggi. Livello 5: una tabella sua dei solidi con tipo e temperatura; l'ordine dei tipi deve coincidere con
l'ordine delle temperature, e ogni opzione deve essere un ordinamento dei tre solidi. `CASE_RANGES` fissa tra il 18% e
il 32% la quota di ogni tipo nei livelli 2 e 3.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 201 px su 252). Esercizi diversi su 1.000 per
livello: 24, 29, 976, 43, 206, 20.

### Errori piantati

Su 360 esercizi (60 per livello, seed da 300), uno per esercizio: indice dell'opzione giusta spostato, testo
dell'opzione giusta scambiato con quello di un distrattore, un distrattore reso uguale alla risposta e, nel livello 4,
il valore della risposta aperta cambiato. Bocciati 360 su 360.
