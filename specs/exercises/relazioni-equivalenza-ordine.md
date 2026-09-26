# Relazioni di equivalenza e d'ordine

Generatore: `relazioni-equivalenza-ordine` (`src/lib/exercises/v2/generators/relazioni-equivalenza-ordine.ts`).
Verifica indipendente: `scripts/exercises/checkers/relazioni_equivalenza_ordine.py`. Lezione collegata:
"Relazioni di equivalenza e d'ordine" (`docs/lezioni/riscritte/41-relazioni-equivalenza-ordine.md`), con la
nota `docs/lezioni/note/41-relazioni-equivalenza-ordine.md` (sezione "Per il generatore").

Convenzioni della lezione: la relazione si chiama $\mathcal{R}$ e si scrive $a \mathrel{\mathcal{R}} b$ (come
nella lezione 40); la classe di $a$ è $[a]$, l'insieme quoziente $A/\mathcal{R}$; le coppie di una relazione
finita si elencano con i cappi per primi, poi in ordine, tre per riga con `aligned` come nell'esempio 1;
la definizione di ordine largo e di ordine stretto è quella della lezione (largo: riflessiva, antisimmetrica,
transitiva; stretto: antiriflessiva, antisimmetrica, transitiva); totale vuol dire che due elementi diversi
sono sempre confrontabili. Il divisore è quello della lezione 19, diverso da zero: per questo la divisibilità
si usa "tra i naturali diversi da zero" o "tra gli interi diversi da zero".

Tutti i livelli nascono a scelta multipla, con quattro opzioni e una sola giusta: le domande della lezione
sono di riconoscimento (vale o no, quale classe, quale tipo), e la risposta aperta non avrebbe una forma
controllabile. Il generatore sceglie prima la risposta (la proprietà vale o no, il profilo, la categoria, le
coppie da aggiungere) e poi costruisce o cerca una relazione che la abbia.

## Rappresentazione

- Elementi come stringhe: `"1"`, `"-2"`, `"a"`, e `"{1,2}"` per un sottoinsieme (`"{}"` è $\emptyset$). Una
  coppia è `"a:b"`. `params.A` è l'insieme, `params.R` l'elenco delle coppie nell'ordine in cui si scrivono.
- Livelli 1 e 3: `params.prop` (`rifl`, `sim`, `anti`, `trans`); al livello 3 `params.rel` (il codice della
  relazione a parole) e `params.dom` (`N`, `Z`, `N0`, `Z0`). Le opzioni hanno in `values` `["si"]` oppure
  un controesempio: `["rifl", x, y]` dice $(x, y) \notin \mathcal{R}$ ed è un controesempio solo se $x = y$;
  `["sim", a, b]` dice $(a, b) \in \mathcal{R}$ e $(b, a) \notin \mathcal{R}$; `["anti", a, b]` dice che ci
  sono $(a, b)$ e $(b, a)$ con $a \neq b$; `["trans", a, b, c]` dice che ci sono $(a, b)$ e $(b, c)$ e manca
  $(a, c)$; `["cappio", a]` indica il cappio $(a, a)$, che non è mai un controesempio all'antisimmetrica.
- Livello 2: `params.profile`, le lettere delle proprietà che valgono (`R`, `S`, `A`, `T`); le opzioni hanno
  le stesse lettere, `["nessuna"]` per nessuna delle quattro.
- Livello 4: `params.ask` (`quoziente` o `classe`), `params.k`, `params.classes`. Opzioni: `["Q", "1,3",
  "2", …]` per un insieme quoziente, `["C", …]` per una classe, `["E", …]` per l'errore "gli elementi di $A$
  al posto delle classi".
- Livello 5: `params.variant`, `params.n`, `params.m`, `params.k` (per il rappresentante, `k` è il resto
  della classe). Opzioni `["C", …]`, `["r", "2"]` (la classe $[2]$), `["n", "3"]`, `["inf"]`, `["x", "36"]`.
- Livello 6: `params.rule` (`le`, `lt`, `ge`, `gt`, `div`, `divs`, `sube`, `sub`, `absle`, oppure `null`
  quando la relazione è data con le coppie), `params.case` (`LT`, `LP`, `ST`, `SP`, `NO`).
- Livello 7: `params.target` (`rifl`, `sim`, `trans`, `equiv`), `params.add` (le coppie da aggiungere).
  Opzioni `["P", "1:1", "2:1", …]`.

## Livello 1: una proprietà di una relazione data con le coppie

$A$ di 3-4 elementi (numeri da 1 a 4, oppure lettere circa 30 volte su 100), $\mathcal{R}$ di 3-8 coppie con almeno
una freccia tra elementi diversi. Si chiede una proprietà (riflessiva, simmetrica, antisimmetrica,
transitiva), ognuna circa 25 volte su 100, e la risposta è sì o no metà e metà. Le opzioni sono "Sì" e tre
"No" con la coppia mancante, come chiede la nota: "No: manca $(3, 3)$", "No: c'è $(1, 2)$, manca $(2, 1)$",
"No: ci sono $(1, 2)$ e $(2, 1)$", "No: ci sono $(1, 2)$ e $(2, 3)$, manca $(1, 3)$". Quando la transitiva
non vale, metà delle volte (se c'è) il controesempio giusto è il percorso che torna indietro, con il cappio
mancante (riquadro "Il percorso che torna indietro"). Vincoli: per "transitiva sì" c'è almeno un percorso di
due frecce; per "riflessiva no" di solito c'è almeno un cappio, così vale "Un cappio mancante basta".

Esempi: $A = \{1, 2, 3\}$, $\mathcal{R} = \{(1, 1), (2, 2), (3, 3), (2, 3), (3, 2)\}$, riflessiva? Sì.
$A = \{1, 2, 3, 4\}$, $\mathcal{R} = \{(1, 1), (2, 2), (4, 4), (1, 3), (3, 2), (4, 1)\}$, transitiva? No: ci
sono $(4, 1)$ e $(1, 3)$, manca $(4, 3)$.

## Livello 2: le quattro proprietà insieme

Come l'esempio 1 della lezione: si sceglie l'elenco completo delle proprietà che valgono. $A$ di 3-4 elementi,
3-9 coppie. Profili possibili, con la stessa frequenza: RST, RAT, RT, RS, RA, R, ST, S, AT, A, T, nessuna;
con frequenza metà, SAT e RSAT, le relazioni fatte di soli cappi (riquadro "Antisimmetrica non vuol dire non
simmetrica": una relazione può essere simmetrica e antisimmetrica insieme). I passaggi controllano le quattro
proprietà una per una, con il controesempio quando una non vale.

Esempi: $A = \{1, 2, 3\}$, $\mathcal{R} = \{(2, 2), (3, 3), (2, 1), (2, 3)\}$: antisimmetrica, transitiva.
$A = \{1, 2, 3\}$, $\mathcal{R} = \{(2, 2), (3, 3), (1, 3), (3, 2)\}$: solo antisimmetrica (manca $(1, 1)$,
manca $(3, 1)$, manca la scorciatoia $(1, 2)$).

## Livello 3: relazioni in ℕ e ℤ date a parole

Una proprietà alla volta, come al livello 1, su 29 relazioni: $a \cdot b > 0$, $a \cdot b \geq 0$,
$a \cdot b < 0$ in $\mathbb{Z}$ (esempio 2); $a + b$ pari (esempio 3), $a + b$ dispari, $a \cdot b$ pari,
$a < b$, $a \leq b$, $a > b$, $a \geq b$, $a \neq b$, stessa ultima cifra, $b = 2a$, $b = 3a$, "differiscono
al massimo di $k$" con $k$ da 1 a 3, $a + b = t$ con $t$ tra 6, 8, 10, 12, stesso resto nella divisione per
$n$ da 2 a 5, in $\mathbb{N}$; $|a| = |b|$ in $\mathbb{Z}$; "$a$ è un divisore di $b$" tra i naturali e tra
gli interi diversi da zero (esempio 8); "$a$ è un multiplo di $b$" tra i naturali diversi da zero. Il "no" si
risponde con un controesempio scritto con $\in$ e $\notin$, con numeri piccoli (tra 0 e 12 in $\mathbb{N}$,
tra $-6$ e $6$ in $\mathbb{Z}$). Il "sì" ha nei passaggi la ragione della lezione (per esempio "$a + a = 2a$ è
sempre pari"); il "no" la verifica di ogni coppia del controesempio.

Esempi: in $\mathbb{Z}$, $a \mathrel{\mathcal{R}} b$ se $a \cdot b < 0$: transitiva? No: $(2, -2) \in
\mathcal{R}$, $(-2, 2) \in \mathcal{R}$, $(2, 2) \notin \mathcal{R}$. Tra gli interi diversi da zero,
$a \mathrel{\mathcal{R}} b$ se $a$ è un divisore di $b$: riflessiva? Sì, perché $a = a \cdot 1$.

## Livello 4: classi di equivalenza e insieme quoziente

Una relazione di equivalenza su 3-5 elementi, data con le coppie (al massimo 11), costruita da una partizione
con classi di 1-3 elementi. Circa 65 volte su 100 si chiede l'insieme quoziente $A/\mathcal{R}$, le altre la
classe $[k]$ di un elemento, di solito in una classe con almeno due elementi.

Esempi: $A = \{1, 2, 3, 4, 5\}$ con i cappi e $(1, 5)$, $(5, 1)$: $A/\mathcal{R} = \{\{1, 5\}, \{2\},
\{3\}, \{4\}\}$. $A = \{a, b, c, d, e\}$ con i cappi e $(a, b)$, $(b, a)$: $[b] = \{a, b\}$.

## Livello 5: stesso resto nella divisione per n

La relazione dell'esempio 4, con $n$ da 2 a 5, in quattro varianti: la classe $[k]$ in $A = \{0, 1, \ldots,
m\}$ con $m$ da 10 a 15 e di solito $k \geq n$ (circa 40 volte su 100); a quale classe appartiene un numero
$k$ tra 20 e 79, con $n$ 4 o 5 perché le quattro opzioni siano quattro classi diverse (circa 20); quante
classi ha $\mathbb{N}/\mathcal{R}$ (circa 15); quale numero è un rappresentante di $[r]$ (circa 25).

Esempi: in $A = \{0, 1, \ldots, 12\}$, divisione per 2, $[4] = \{0, 2, 4, 6, 8, 10, 12\}$. Divisione per 4:
$25 = 4 \cdot 6 + 1$, quindi $25 \in [1]$.

## Livello 6: relazioni d'ordine

Cinque risposte con la stessa frequenza: ordine largo totale, largo parziale, stretto totale, stretto
parziale, non è d'ordine. Metà delle relazioni sono regole della lezione su un insieme piccolo: $\leq$,
$\geq$, $<$, $>$ su 3-5 numeri; "è un divisore di" (con o senza $a \neq b$) su una catena come
$\{1, 2, 4, 8\}$ (totale) o sui divisori di un numero come $\{1, 2, 3, 6\}$ (parziale, esempio 7); $\subseteq$
e $\subset$ su una catena di sottoinsiemi o su $\{\emptyset, \{1\}, \{2\}, \{1, 2\}\}$; per il "non è d'ordine",
"è un divisore di" e $|a| \leq |b|$ su insiemi con numeri opposti come $\{-2, -1, 1, 2\}$ (esempio 8, e la
trappola dell'esempio 9: somiglia a $\leq$ ma non è antisimmetrica). L'altra metà sono elenchi di coppie: un
ordine casuale, oppure un ordine guastato in un punto (una freccia di ritorno, una scorciatoia tolta, un
cappio tolto o aggiunto, così la relazione non è né riflessiva né antiriflessiva). Al massimo 10 coppie.
Le opzioni sono tre delle altre quattro categorie nell'ordine fisso della lista: si toglie quella con tutte e
due le scelte sbagliate (per largo totale si toglie stretto parziale), a caso per "non è d'ordine".

Esempi: $A = \{2, 4, 6, 12\}$, $a \mathrel{\mathcal{R}} b$ se $a$ è un divisore di $b$ e $a \neq b$: ordine
stretto parziale ($4$ e $6$ non sono confrontabili). $A = \{1, 2, 3\}$, $\mathcal{R} = \{(1, 1), (2, 2), (2,
1), (2, 3), (3, 1)\}$: non è d'ordine (c'è $(1, 1)$ ma manca $(3, 3)$).

## Livello 7: le coppie da aggiungere

Il caso scomodo della nota: il minor numero di coppie da aggiungere perché la relazione diventi riflessiva
(circa 15 volte su 100), simmetrica (25), transitiva (30) o di equivalenza (30). $A$ di 3-4 elementi, 2-6
coppie, da 1 a 5 coppie da aggiungere. La risposta è unica: la chiusura riflessiva, simmetrica, transitiva o di
equivalenza meno la relazione. Per la transitiva i passaggi aggiungono le scorciatoie a giri, finché i
percorsi nuovi non ne chiedono altre.

Esempi: $A = \{1, 2, 3\}$, $\mathcal{R} = \{(1, 3), (2, 3), (3, 1)\}$, transitiva: si aggiungono $(1, 1)$,
$(3, 3)$, $(2, 1)$. $A = \{1, 2, 3\}$, $\mathcal{R} = \{(2, 2), (3, 3), (1, 3), (3, 2)\}$, di equivalenza: si
aggiungono $(1, 1)$, $(1, 2)$, $(2, 1)$, $(2, 3)$, $(3, 1)$.

## Distrattori

- Livelli 1 e 3: quando la proprietà vale, tre "No" sbagliati; quando non vale, "Sì" e due "No" sbagliati.
  Ogni "No" sbagliato ha una parte vera: per la riflessiva un cappio che c'è oppure una coppia mancante che
  non è un cappio (la riflessiva guarda solo i cappi); per la simmetrica una coppia che ha già il ritorno o
  una scritta al contrario; per l'antisimmetrica una coppia senza ritorno, oppure un cappio (i cappi sono
  ammessi); per la transitiva un percorso con la scorciatoia presente, o due fatti veri su tre.
- Livello 2: il profilo con una proprietà cambiata, dando la precedenza agli errori dei riquadri: transitiva
  quando il controesempio è andata e ritorno senza cappi, riflessiva quando manca un solo cappio,
  simmetrica e antisimmetrica scambiate, una delle due tolta quando valgono insieme.
- Livello 4: $A$ stesso al posto dell'insieme quoziente (gli elementi invece delle classi); due classi unite;
  un elemento staccato dalla sua classe o spostato in un'altra; tutti gli elementi separati. Per la classe:
  $\{k\}$ da solo, la classe senza $k$, la classe unita a un'altra, un'altra classe, $A$.
- Livello 5: la classe scritta da $k$ in poi, senza gli elementi minori (errore frequente); la classe di
  $k + 1$; i multipli di $k$; i multipli di $n$; la classe senza $k$. Per l'appartenenza, la classe del
  quoziente al posto del resto ($25 = 4 \cdot 6 + 1$: $[6]$ invece di $[1]$). Per il conteggio, "infinite"
  (riquadro "Contare i nomi invece delle classi"), $n - 1$, $n + 1$. Per il rappresentante, numeri con un
  altro resto.
- Livello 7: per la transitiva, le scorciatoie del primo giro soltanto, la risposta senza i cappi del
  percorso che torna indietro, i ritorni della simmetrica; per la simmetrica, i ritorni più i cappi mancanti,
  un ritorno dimenticato, le coppie dell'equivalenza; per la riflessiva, un cappio dimenticato, i ritorni;
  per l'equivalenza, riflessiva e simmetrica senza la transitiva, la risposta senza i cappi, le sole
  scorciatoie. Se non bastano, la risposta con una coppia in meno o in più. Le opzioni hanno al massimo 6
  coppie.

## Righe sul telefono

La relazione nel problema va su righe di tre coppie con `aligned`, come nell'esempio 1 della lezione, dopo
$A$ nella stessa riga di dati. Le relazioni a parole (livelli 3, 5 e le regole del livello 6) sono testo, che la
pagina manda a capo. Nelle opzioni il controesempio della transitiva e quelli del livello 3 con due coppie
vanno su due righe con `gathered`; le proprietà del livello 2, da tre in su, su due righe; gli insiemi di
coppie del livello 7 oltre le tre coppie su righe di tre, con le graffe grandi; le classi del livello 5 oltre
i sei elementi su due righe. Il verificatore ricompone le righe di $\mathcal{R}$ e delle opzioni e boccia una
riga persa o una virgola mancante tra due righe.

Misura (`scripts/exercises/width.mts`, 26 settembre 2026): problema al massimo 257 px su 350 (livello 6),
opzioni al massimo 242 px su 252 (livello 3). Prima delle righe di tre coppie, il livello 7 arrivava a 345 px.

## Verifica

Il controllo Python rilegge dal problema $A$ e le coppie, le confronta con `params` e decide ogni proprietà
guardando tutti gli elementi, le coppie e le terne; per le relazioni a parole su una finestra di $\mathbb{N}$
(da 0 a 30) o di $\mathbb{Z}$ (da $-15$ a $15$), che contiene tutti i numeri dei controesempi. Poi giudica
ogni opzione da sola (per un controesempio controlla ogni fatto che dice) e vuole una sola opzione giusta,
quella indicata. Le classi sono ricalcolate dalle coppie o dai resti, le coppie da aggiungere con la chiusura
di Warshall; per ogni opzione sbagliata del livello 7 controlla che non sia una risposta più piccola valida.

- `sample.mts relazioni-equivalenza-ordine 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000.
- Stesso comando con seed di partenza 7001: PASS, 7.000 su 7.000.
- Quote dei casi per livello controllate con `CASE_RANGES`.
- Errori piantati a mano, tutti bocciati (23 su 23, con tutti e due i seed): indice della risposta giusta
  spostato (un caso per livello); una coppia tolta dai `params` ma non dal problema; una riga di
  $\mathcal{R}$ persa nel problema; come risposta giusta una coppia mancante che non è un cappio; testo di
  un'opzione diverso dai suoi valori; profilo giusto con la transitiva tolta; relazione scambiata ($\leq$ al
  posto di $<$); controesempio della simmetrica rovesciato; quoziente con un elemento spostato; relazione
  del livello 4 che non è più di equivalenza; classe senza $k$; quoziente al posto del resto; categoria
  sbagliata; coppie diverse dalla regola; risposta della transitiva senza il cappio del ritorno;
  `params.add` cambiato; opzioni doppie.
- `review.mts` esce con 0, `width.mts` esce con 0, `tsc` senza errori nel file, `eslint --max-warnings=0`
  pulito.

Esercizi diversi su 1.000 per livello (seed 1; testo e problema, poi testo, problema e opzioni):

| Livello | Problema | Con le opzioni |
|---|---|---|
| 1 | 886 | 988 |
| 2 | 629 | 798 |
| 3 | 113 | 970 |
| 4 | 279 | 696 |
| 5 | 291 | 535 |
| 6 | 450 | 468 |
| 7 | 892 | 960 |

Il livello 3 ha al massimo 116 problemi possibili (29 relazioni per 4 proprietà): lo studente rivede la stessa
relazione, ma con controesempi e distrattori diversi (970 su 1.000).

## Esercizi da evitare

- Relazioni di soli cappi fuori dai profili SAT e RSAT del livello 2.
- "Transitiva sì" senza nessun percorso di due frecce (vale a vuoto, non insegna niente).
- Controesempi con numeri grandi; la divisibilità con lo zero (la lezione 19 non lo ammette come divisore).
- Due opzioni che nominano la stessa classe ($[6]$ e $[2]$ con $n = 4$).
- Più di 6 coppie in un'opzione, più di 11 coppie nel problema.

## Domande per la revisione

- Livello 1 e 3: la scelta del controesempio tra quattro opzioni è giusta per la scuola, o conviene chiedere
  solo sì o no (due opzioni, contro la regola delle quattro)?
- Livello 3: "$a$ e $b$ differiscono al massimo di $k$" e "$a + b = t$" non sono nella lezione; sono state
  aggiunte per avere più di 100 problemi diversi. Vanno bene o si tolgono?
- Livello 6: la definizione di relazione d'ordine della lezione vuole la riflessiva o l'antiriflessiva; una
  relazione antisimmetrica e transitiva con alcuni cappi è "non d'ordine". Alcuni libri la chiamerebbero
  comunque d'ordine: va bene tenere il caso?
- Livello 7: "il minor numero di coppie" è chiaro per lo studente, o serve un esempio svolto nella lezione
  (oggi la nota lo propone, la lezione non lo tratta)?
