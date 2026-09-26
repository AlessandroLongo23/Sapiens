# Parallelogrammi e trapezi

Generatore: `geometria-quadrilateri` (`src/lib/exercises/v2/generators/geometria-quadrilateri.ts`).
Verifica indipendente: `scripts/exercises/checkers/geometria_quadrilateri.py`. Lezione collegata:
`docs/lezioni/riscritte/62-geometria-quadrilateri.md` (note in `docs/lezioni/note/62-geometria-quadrilateri.md`,
sezione "Per il generatore").

Sette livelli nell'ordine della lezione. Tutti si reggono sul testo, senza figura: il sito oggi non sa
disegnare una figura per gli esercizi di matematica (vedi "Livelli che vorrebbero una figura").

## Tipi di risposta

- Livelli 1-4: `number`, un angolo in gradi o una lunghezza in centimetri, sempre intera. La variante a
  scelta multipla (`toChoice`) ha quattro opzioni scritte `110^\circ` o `26\ \text{cm}`.
- Livelli 5-7: nascono come `choice` con quattro opzioni, e `choice` è la risposta stessa.

## Regole comuni

- Definizioni e convenzioni della lezione: trapezio con due soli lati opposti paralleli (un
  parallelogramma non è un trapezio), basi $AB$ (la maggiore) e $DC$, angoli $\hat{A}$ e $\widehat{BAC}$,
  congruenza con $\cong$, misure scritte $AB = 8$ cm, punto di incontro delle diagonali $M$, tutti i
  quadrilateri convessi.
- Il testo sta in righe `\text{…}` scritte con `textBlock`, con le formule tra `$…$`; la pagina le mostra
  come paragrafo. Al livello 5 i dati sono una riga di formule separate da `\quad`; al livello 7 il passo
  da giustificare è una formula su una riga sua.
- Numeri costruiti dalla risposta: si sceglie prima l'angolo o il lato, poi i dati.
- Passaggi in italiano, con le proprietà dette come nella lezione ("Gli angoli consecutivi di un
  parallelogramma sono supplementari", "Le diagonali del rombo sono bisettrici degli angoli").
- Niente trattini lunghi e niente "piuttosto che" nei testi (il `check()` lo controlla).

## Livello 1: angoli del quadrilatero e del parallelogramma

Tre casi, circa 1 su 3 ciascuno:

- quadrilatero qualsiasi: tre angoli dati, multipli di $5^\circ$ tra $45^\circ$ e $150^\circ$, il quarto
  anche lui tra $45^\circ$ e $150^\circ$; risposta $360^\circ$ meno la somma;
- parallelogramma, angolo opposto a quello dato (congruente);
- parallelogramma, angolo consecutivo (supplementare). L'angolo dato è intero tra $25^\circ$ e $155^\circ$,
  mai retto; il vertice dato e quello chiesto variano.

Esempi:

- "Nel parallelogramma $ABCD$ l'angolo $\hat{B}$ misura $67^\circ$. Quanto misura l'angolo $\hat{A}$?"
  Risposta $113^\circ$. Opzioni $67^\circ$, $113^\circ$, $293^\circ$, $23^\circ$.
- "Nel quadrilatero $ABCD$ gli angoli $\hat{A}$, $\hat{B}$ e $\hat{C}$ misurano $80^\circ$, $95^\circ$ e
  $110^\circ$. Quanto misura l'angolo $\hat{D}$?" Risposta $75^\circ$.

Distrattori: l'angolo consecutivo preso congruente (o l'opposto preso supplementare), il complementare al
posto del supplementare, $360^\circ$ meno l'angolo; per il quadrilatero la somma di un triangolo
($180^\circ$) al posto di $360^\circ$ e uno sbaglio di $10^\circ$.

## Livello 2: lati e diagonali

Due casi, circa metà ciascuno:

- lati: perimetro del parallelogramma da due lati consecutivi; un lato dal perimetro e dal lato
  consecutivo; lato del rombo dal perimetro e perimetro dal lato;
- diagonali: metà di una diagonale del parallelogramma (o la diagonale dalla sua metà); nel rettangolo
  l'altra diagonale, oppure una metà dell'altra diagonale (o la diagonale da una metà dell'altra).

Nel parallelogramma non si chiede mai una metà dell'altra diagonale: i dati non la decidono, e il
controllo lo segnala come errore. Misure intere in cm (lati da 3 a 25, diagonali pari da 8 a 32).

Esempi:

- "Nel parallelogramma $ABCD$ il lato $DA$ misura $15$ cm e il lato $AB$ misura $11$ cm. Quanto misura il
  perimetro?" Risposta $52$ cm; distrattori $26$ cm (due lati soli), $41$ cm, $37$ cm (tre lati).
- "Nel rettangolo $ABCD$ le diagonali si incontrano nel punto $M$ e la diagonale $AC$ misura $10$ cm.
  Quanto misura il segmento $BM$?" Risposta $5$ cm.

Distrattori: due o tre lati al posto del perimetro, il semiperimetro al posto del lato, il perimetro diviso
per 2 nel rombo, la diagonale intera al posto della metà, il doppio al posto della metà.

## Livello 3: angoli con le diagonali

Come gli esempi 3 e 4 della lezione. Due casi, circa metà ciascuno:

- rombo: dato $\hat{A}$ o $\hat{B}$ (pari, tra $30^\circ$ e $150^\circ$, mai retto), trovare
  $\widehat{BAM}$ o $\widehat{ABM}$ (bisettrici e angolo retto in $M$); oppure il contrario, da
  $\widehat{BAM}$ o $\widehat{ABM}$ (mai $45^\circ$) trovare un angolo del rombo;
- rettangolo: dato $\widehat{AMB}$ (pari, mai retto), trovare $\widehat{MAB}$, $\widehat{MAD}$ o
  $\widehat{AMD}$; oppure da $\widehat{MAB}$ trovare $\widehat{AMB}$ o $\widehat{MAD}$.

L'angolo retto in $M$ non si chiede mai (la risposta sarebbe sempre $90^\circ$).

Esempi:

- "Nel rettangolo $ABCD$ le diagonali si incontrano nel punto $M$ e l'angolo $\widehat{AMB}$ misura
  $94^\circ$. Quanto misura l'angolo $\widehat{MAB}$?" Risposta $43^\circ$; distrattori $86^\circ$ (non
  diviso per 2), $47^\circ$ (l'altro angolo in $A$), $94^\circ$.
- "Nel rombo $ABCD$ le diagonali si incontrano nel punto $M$ e l'angolo $\hat{B}$ misura $114^\circ$.
  Quanto misura l'angolo $\widehat{ABM}$?" Risposta $57^\circ$.

## Livello 4: angoli dei trapezi

Trapezio isoscele (basi $AB$ e $DC$) o trapezio rettangolo (angoli retti in $A$ e in $D$). Due casi:

- dato un angolo, circa 1 su 3: angolo acuto tra $35^\circ$ e $85^\circ$; si chiede un altro angolo
  (congruente o supplementare), mai un angolo retto;
- con un'equazione, circa 2 su 3, come l'esempio 5: due angoli scritti $px + q$ ($p$ da 1 a 5, $q$
  multiplo di 5 fino a 60 in valore assoluto), adiacenti a un lato obliquo (supplementari) o, nel
  trapezio isoscele, adiacenti alla stessa base (congruenti, con coefficienti diversi). $x$ intero da 8 a
  60, i due angoli tra $30^\circ$ e $150^\circ$, la risposta diversa da $x$. Si chiede uno dei quattro
  angoli, anche uno che non compare nel testo.

Esempi:

- "Nel trapezio isoscele $ABCD$, con le basi $AB$ e $DC$, l'angolo $\hat{C}$ misura $2x + 25^\circ$ e
  l'angolo $\hat{B}$ misura $4x - 55^\circ$. Quanto misura l'angolo $\hat{C}$?" $6x = 210^\circ$,
  $x = 35^\circ$, risposta $95^\circ$; distrattori $35^\circ$ ($x$), $85^\circ$ (il supplementare),
  $70^\circ$ ($2x$ senza la costante).
- "Nel trapezio isoscele $ABCD$, con le basi $AB$ e $DC$, l'angolo $\hat{C}$ misura $96^\circ$. Quanto
  misura l'angolo $\hat{B}$?" Risposta $84^\circ$.

Passaggi dell'equazione come nella lezione: perché i due angoli sono supplementari o congruenti,
l'equazione, $kx = r$, $x$, i due angoli, l'angolo chiesto se è un altro, il controllo sui $360^\circ$.

## Livello 5: riconoscere il quadrilatero

"Del quadrilatero $ABCD$ si sa soltanto che:" (o "Le diagonali del quadrilatero $ABCD$ si incontrano nel
punto $M$. Si sa soltanto che:"), una riga di formule, e la domanda "Qual è il nome più preciso che gli si
può dare con certezza?". Ventotto insiemi di condizioni presi dalle condizioni della lezione: diagonali che
si tagliano a metà ($AM \cong MC$, $BM \cong MD$), congruenti, perpendicolari; lati opposti congruenti;
quattro lati congruenti; quattro angoli retti; angoli opposti congruenti; due lati opposti paralleli e
congruenti; due coppie di lati paralleli; una sola coppia ($AB \parallel DC$, $AD \nparallel BC$); lati
obliqui congruenti; $\hat{A} = 90^\circ$; $AB \cong BC$. Le lettere dei vertici sono $ABCD$, $PQRS$, $EFGH$
o $KLMN$, e l'ordine delle condizioni cambia.

Opzioni: Parallelogramma, Rettangolo, Rombo, Quadrato, Trapezio, Trapezio isoscele, Trapezio rettangolo,
Solo quadrilatero. I distrattori vengono dagli avvisi: diagonali perpendicolari senza che si taglino a metà
(non è un rombo, può essere un aquilone), diagonali congruenti (le ha anche il trapezio isoscele), il
quadrato proposto per un rettangolo o un rombo, la famiglia più larga (parallelogramma per un rettangolo).

Esempi:

- $\hat{P} = 90^\circ$, $PQ \parallel SR$, $PS \parallel QR$: Rettangolo (distrattori Parallelogramma,
  Trapezio rettangolo, Quadrato).
- $KM \perp LN$ da solo: Solo quadrilatero (distrattori Rombo, Quadrato, Parallelogramma).

## Livello 6: vero o falso sulle famiglie

"Quale di queste affermazioni è vera?" (tre false e una vera) oppure "è falsa?" (tre vere e una falsa),
circa metà ciascuna. Quattro opzioni perché il sito mostra solo la scelta multipla, e una domanda Vero/Falso
ne avrebbe due. Le affermazioni hanno quattro forme: "Ogni X è un Y", "Nessun X è un Y", "In ogni X
[proprietà]", "Se un X ha [condizione], è un Y". 27 vere (le inclusioni, le proprietà, le condizioni per
riconoscere) e 26 false, quasi tutte dagli avvisi della lezione: le diagonali del parallelogramma
congruenti, le diagonali del trapezio isoscele che si tagliano a metà, "un quadrilatero con le diagonali
perpendicolari è un rombo", "con due lati opposti paralleli è un parallelogramma", "nessun quadrato è un
rettangolo", "ogni parallelogramma è un trapezio" (falsa con la definizione della lezione). Ogni
affermazione ha nei passaggi la sua spiegazione.

Esempi:

- Vera tra: "Nessun quadrato è un rettangolo", "In ogni trapezio isoscele gli angoli opposti sono
  supplementari" (giusta), "Nessun rettangolo è un parallelogramma", "Ogni parallelogramma è un trapezio".
- Falsa tra: "Se un rettangolo ha due lati consecutivi congruenti, è un quadrato", "Se un rombo ha un
  angolo retto, è un quadrato", "In ogni rombo le diagonali sono bisettrici degli angoli", "Ogni
  parallelogramma è un trapezio" (giusta).

## Livello 7: il passo di una dimostrazione

Un passo di una delle otto dimostrazioni della lezione: le proprietà 1-3 del parallelogramma, le diagonali
che si tagliano a metà, la condizione "diagonali che si tagliano a metà", l'esempio 2 ($AMCN$), le
diagonali del rettangolo, le diagonali del rombo, gli angoli alla base del trapezio isoscele, le diagonali
del trapezio isoscele. Il testo dà l'ipotesi (e la tesi, dove la lezione la scrive), quello che si sa già
quando il passo lo usa, poi il passo come formula e "Perché vale questo passo?". 28 passi in tutto, con le
lettere $ABCD$, $PQRS$, $EFGH$ o $KLMN$ ($M$, $N$ ed $E$ cambiano con loro).

Opzioni prese da un vocabolario di 24 giustificazioni. Per una coppia di angoli le quattro coppie
(alterni interni, corrispondenti, coniugati interni, opposti al vertice); per due triangoli congruenti i
tre criteri più una giustificazione vicina; per gli altri passi le confusioni probabili ("Lati opposti di
un parallelogramma" contro "Per ipotesi", "Angoli alla base di un triangolo isoscele" contro "Angoli alla
base del trapezio isoscele", la condizione 4 contro la condizione 1).

Esempi:

- "$EFGH$ è un rombo e le diagonali si incontrano nel punto $O$. Si confrontano i triangoli $EOF$ e
  $EOH$." Passo $EF \cong EH$: "I lati del rombo sono congruenti" (distrattori "Lati opposti di un
  parallelogramma", "Le diagonali si tagliano a metà", "Per ipotesi").
- "$PQRS$ è un parallelogramma e le diagonali $PR$ e $QS$ si incontrano nel punto $O$ […] Si sa già che
  $PQ \cong SR$, $\widehat{OPQ} \cong \widehat{ORS}$ e $\widehat{OQP} \cong \widehat{OSR}$." Passo
  $PQO \cong RSO$: "Secondo criterio di congruenza".

## Esercizi da evitare

- Un angolo retto come risposta di un angolo di trapezio, l'angolo retto in $M$ del rombo, un rombo che è
  un quadrato ($\hat{A} = 90^\circ$ o $\widehat{BAM} = 45^\circ$), un rettangolo con $\widehat{AMB} = 90^\circ$.
- Una domanda che i dati non decidono (una metà dell'altra diagonale di un parallelogramma).
- "Due lati opposti paralleli" da soli al livello 5: con la definizione della lezione il nome più preciso
  sarebbe "Solo quadrilatero", che confonde; l'avviso "Due lati paralleli non bastano" è al livello 6.
- Al livello 4 la risposta uguale a $x$ (il distrattore principale).
- Distrattori negativi, nulli o di un angolo di $360^\circ$ o più.

## Verifica

`scripts/exercises/checkers/geometria_quadrilateri.py` rilegge il problema dal testo e lo risolve da solo:

- livelli 1, 3, 4: costruisce la figura con le coordinate (parallelogramma, rombo, rettangolo, trapezio
  isoscele, trapezio rettangolo) per ogni valore del suo parametro di forma su una griglia di mezzi gradi,
  tiene le figure che rispettano i dati del testo e misura l'angolo chiesto, che deve essere uno solo; per
  le equazioni ricava $x$ dalla prima espressione e controlla la seconda. Il primo caso del livello 1 usa
  la somma di $360^\circ$;
- livello 2: le regole della lezione, e segnala le domande che i dati non decidono;
- livelli 5 e 6: una raccolta di circa 5.300 quadrilateri convessi a coordinate intere (due diagonali che si
  incrociano, più i trapezi rettangoli), con le famiglie calcolate dalle definizioni e i confronti di
  lunghezze e angoli esatti. Al livello 5 le formule dei dati sono lette una per una e valutate su tutti gli
  otto modi di nominare ogni quadrilatero: la risposta è la famiglia più precisa comune a quelli che le
  rispettano. Al livello 6 ogni affermazione è letta dal testo dell'opzione e decisa sulla raccolta;
- livello 7: il passo si cerca in una tabella scritta dalla lezione; su una figura concreta si controllano
  il passo, il tipo della coppia di angoli (dalle coordinate) e il criterio di congruenza, dedotto dagli
  elementi che il testo dice già noti.

Controlla anche le quattro opzioni diverse, l'opzione giusta, il testo di ogni opzione, i vincoli di
questa specifica e la quota di ogni caso (`CASE_RANGES` sui livelli 1, 2, 3, 4, 6).

Esito: `sample.mts geometria-quadrilateri 1000 all 1` e `… 1000 all 7001`, 7.000 esercizi ciascuno, PASS.

### Errori piantati

Tutti bocciati:

- risposta cambiata di 10 (livelli 1-4);
- opzione giusta spostata su un'altra (livelli 1-7);
- due opzioni uguali (livelli 1-7);
- un dato del testo cambiato con la risposta lasciata com'era (livelli 1-4, tre esercizi per livello), la
  costante di un'espressione in $x$ cambiata (livello 4);
- il vertice chiesto spostato da opposto a consecutivo (livello 1);
- rombo scambiato con rettangolo nel testo (livello 3);
- rettangolo cambiato in parallelogramma quando si chiede la metà dell'altra diagonale (livello 2: "non
  determinato");
- una condizione tolta dai dati (livello 5: la risposta non è più quella);
- due affermazioni giuste, e l'affermazione giusta resa falsa (livello 6);
- un criterio di congruenza sbagliato indicato come giusto, e il passo cambiato ($\cong$ in $\perp$)
  (livello 7).

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 7001): livello 1 851 (870), livello 2 561 (578), livello 3 572 (566),
livello 4 875 (886), livello 5 192 (190), livello 6 995 (998, contando l'insieme delle quattro
affermazioni), livello 7 112 (112). Il livello 7 esaurisce tutte le combinazioni: 28 passi per 4 serie di
lettere; per allargarlo servirebbero altre dimostrazioni, che la lezione non ha.

## Livelli che vorrebbero una figura

Tutti si reggono sul testo, ma i livelli 3 e 7 sarebbero più leggibili con la figura: al livello 3 lo
studente deve immaginare dove stanno $M$ e gli angoli $\widehat{MAB}$, $\widehat{AMD}$; al livello 7 le
dimostrazioni della lezione hanno tutte la loro figura, e senza è difficile capire quali angoli sono
alterni. Anche il livello 4 guadagnerebbe dalla figura del trapezio con le basi segnate. I livelli 1, 2, 5
e 6 non ne hanno bisogno.

## Domande per la revisione

- Livello 5: l'opzione "Solo quadrilatero" per le diagonali solo perpendicolari o solo congruenti è chiara
  per uno studente? In alternativa "Non si può dire".
- Livello 5: un parallelogramma con un angolo retto è un rettangolo, un rettangolo con due lati consecutivi
  congruenti è un quadrato, un rombo con un angolo retto è un quadrato. La lezione non li enuncia, ma
  seguono in un passo dagli angoli consecutivi supplementari e dai lati opposti congruenti, e i passaggi
  lo spiegano. Vanno bene o sono fuori lezione?
- Livello 4 mette insieme "dato un angolo" (circa 1 su 3) e "con un'equazione" (2 su 3), come proponeva la
  nota: sono due difficoltà in un livello, per stare nei sette livelli. Meglio due livelli e togliere il
  caso "quadrilatero qualsiasi" dal livello 1?
- Livello 6: "Ogni parallelogramma è un trapezio" e "Nessun parallelogramma è un trapezio" dipendono dalla
  definizione di trapezio (la lezione usa quella con due soli lati paralleli, da verificare sul libro in
  uso). Se si cambia definizione vanno tolte.
- Livello 7: i nomi dei criteri ("primo, secondo, terzo criterio") vanno allineati con la lezione 59, come
  dice la nota.
- Livello 3: gli angoli dati sono qualsiasi numero pari (anche $94^\circ$); la lezione usa numeri tondi
  come $120^\circ$ e $50^\circ$. Preferite multipli di $10^\circ$?
