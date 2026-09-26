# Rette perpendicolari e parallele

Generatore: `geometria-perpendicolari-parallele` (`src/lib/exercises/v2/generators/geometria-perpendicolari-parallele.ts`).
Verifica indipendente: `scripts/exercises/checkers/geometria_perpendicolari_parallele.py`. Lezione collegata:
`docs/lezioni/riscritte/60-geometria-perpendicolari-parallele.md` (note in `docs/lezioni/note/`, sezione
"Per il generatore", da cui vengono i sette livelli).

Sette livelli nell'ordine della lezione: i nomi delle coppie di angoli, gli otto angoli con due parallele,
parallele o no, le ampiezze con un'equazione, gli angoli del triangolo, l'angolo esterno, gli angoli dei
poligoni convessi. Il testo di ogni problema sta nel `problem` come righe `\text{…}` scritte con
`textBlock` (come il livello 7 di `equazioni-primo-grado`), con le formule in `$…$`: la pagina lo mostra
come paragrafo.

## Senza figura

Il sito oggi non disegna figure per la matematica, quindi tutto si regge sul testo. Per gli otto angoli
formati da due rette e una trasversale si usa la numerazione della lezione, e il problema la ricorda ogni
volta con la stessa frase: "Gli angoli sono numerati come nella lezione: da $\hat{1}$ a $\hat{4}$ nel
punto su $a$, da $\hat{5}$ a $\hat{8}$ nel punto su $b$, in senso antiorario a partire da quello sopra la
retta e a destra di $t$." Quindi $\hat{1}$ sta sopra $a$ a destra di $t$, $\hat{2}$ sopra a sinistra,
$\hat{3}$ sotto a sinistra, $\hat{4}$ sotto a destra, e lo stesso da $\hat{5}$ a $\hat{8}$ su $b$; la
retta $a$ sta sopra $b$, e gli interni sono $\hat{3}$, $\hat{4}$, $\hat{5}$, $\hat{6}$.

Vorrebbero una figura: i livelli 1, 2 e 3 (la figura degli otto angoli della lezione,
`trasversale-otto-angoli`, sempre la stessa, andrebbe bene per tutti) e il livello 6 (un triangolo con un
lato prolungato). Con la figura la frase sulla numerazione si può togliere. I livelli 4, 5 e 7 stanno bene
senza, come gli esempi 3, 5, 6 e 8 della lezione, che non hanno figura.

## Notazione

Come nella lezione: angoli numerati $\hat{1}, \dots, \hat{8}$, angoli del triangolo $\hat{A}$, $\hat{B}$,
$\hat{C}$, gradi con `^\circ`, $a \parallel b$ e $a \not\parallel b$ nelle soluzioni, $S = (n - 2) \cdot
180^\circ$, divisioni con i due punti ($720^\circ : 6$), prodotti con `\cdot`. Negli angoli con
l'incognita $(3x + 10)^\circ$ e $4x^\circ$ come nell'esempio 3; negli angoli in proporzione $x$, $2x$,
$3x$ senza gradi, come nell'esempio 6. Mai `1x`, `+ -`, `- -`.

## Rappresentazione

`params.case` dice il caso del livello; poi i dati così come stanno nel testo (gli angoli `i`, `j`, le
ampiezze `p`, `q`, `given`, i coefficienti `a`, `b`, `c`, `d`, i vertici `U`, `V`, `W`, il numero dei
lati `n`, gli angoli noti `known`), `unit` per le risposte numeriche (`deg`, `x`, `n`) e `mistakes`, gli
errori da cui vengono i distrattori. Il verificatore non usa le tabelle del generatore: rilegge i dati dal
testo, colloca gli otto angoli dalla descrizione della figura (retta, sopra o sotto, destra o sinistra di
$t$), ricava da lì interni ed esterni, il nome di ogni coppia (colonna "Posizione" della tabella della
lezione) e, con $a \parallel b$, quali angoli sono congruenti; triangoli e poligoni li ricalcola con SymPy
dai numeri del testo.

Tipo di risposta: `choice` ai livelli 1 e 3 e nel caso "non esiste" del livello 5, `number` altrove (un
angolo in gradi, il valore di $x$, un numero di lati), con la variante a scelta multipla. Sempre quattro
opzioni distinte, e il verificatore giudica ciascuna da sola: una sola giusta, quella segnata, e il LaTeX
di ogni opzione deve dire il suo valore.

## Livello 1: i nomi delle coppie

Tre casi, circa un terzo ciascuno.

- `nome`: "Come si chiama la coppia di angoli $\hat{6}$ e $\hat{4}$?" Risposta: alterni interni.
  Distrattori: il nome gemello (alterni interni ↔ esterni, coniugati interni ↔ esterni), quello dell'altra
  famiglia (alterni ↔ coniugati), poi gli altri.
- `posizione`: le rette senza numeri, gli angoli descritti a parole. "Nel punto su $a$ prendi l'angolo
  sotto $a$ a sinistra di $t$; nel punto su $b$ prendi l'angolo sopra $b$ a destra di $t$. Come si chiama
  la coppia?" Risposta: alterni interni. Stessi distrattori.
- `trova`: "Quale angolo forma con $\hat{1}$ una coppia di angoli alterni esterni?" Risposta: $\hat{7}$.
  Le quattro opzioni sono i quattro angoli dell'altro punto: uno è giusto, due formano con l'angolo dato
  coppie di altro nome e il quarto una coppia senza nome.

Solo le 12 coppie con un nome della tabella della lezione. Le quattro coppie senza nome (come $\hat{1}$ e
$\hat{6}$) non escono mai come domanda.

## Livello 2: gli otto angoli con due parallele

"Le rette parallele $a$ e $b$ sono tagliate dalla trasversale $t$. … Si sa che $\hat{7}$ misura
$63^\circ$. Quanto misura $\hat{2}$?" Risposta $117^\circ$ (coniugati esterni, supplementari).

- L'angolo acuto $\alpha$ tra $15^\circ$ e $85^\circ$. Come nella figura della lezione (esempio 1, con
  $\hat{1} = 65^\circ$), gli angoli dispari sono acuti e misurano $\alpha$, i pari sono ottusi e misurano
  $180^\circ - \alpha$: il verificatore controlla che il dato non contraddica la figura.
- Qualunque coppia di angoli diversi: nello stesso punto (circa 3 su 7: opposti al vertice o adiacenti) o
  nell'altro punto (circa 4 su 7). Se la coppia nell'altro punto non ha nome, i passaggi passano per
  l'angolo corrispondente.
- Distrattori: il supplementare della risposta (il riquadro "Coniugati congruenti invece che
  supplementari"), la differenza da $90^\circ$ (complementare invece di supplementare), poi valori vicini a
  passi di $5^\circ$ e $10^\circ$.

Secondo esempio: $\hat{1} = 83^\circ$, quanto misura $\hat{4}$? Adiacenti: $97^\circ$.

## Livello 3: parallele o no

"… Si sa che $\hat{8}$ misura $132^\circ$ e $\hat{1}$ misura $48^\circ$. Le rette $a$ e $b$ sono
parallele?" I due angoli formano una delle 12 coppie con nome. Risposta a scelta multipla, il verdetto con
la proprietà su cui si regge: "Sì: sono congruenti", "Sì: sono supplementari", "No: non sono congruenti",
"No: non sono supplementari", "Non si può stabilire".

- `parallele` (metà): alterni o corrispondenti congruenti, coniugati supplementari. Esempio sopra: coniugati
  esterni, $132^\circ + 48^\circ = 180^\circ$, "Sì: sono supplementari".
- `trappola` (un quarto): alterni o corrispondenti supplementari, oppure coniugati congruenti. Esempio:
  $\hat{7} = \hat{2} = 44^\circ$, coniugati esterni, "No: non sono supplementari"; il distrattore
  "Sì: sono congruenti" è l'errore del riquadro della lezione.
- `vicine` (un quarto): la relazione giusta sbagliata di 2-12 gradi, come l'esempio 2(b) della lezione
  ($108^\circ$ e $74^\circ$). Esempio: $\hat{6} = 100^\circ$, $\hat{2} = 88^\circ$, corrispondenti, "No: non
  sono congruenti".

Le quattro opzioni sono sempre le due "Sì" e le due "No", tranne un caso: un "No" che si regge su un fatto
vero ma fuori luogo (alterni non congruenti e nemmeno supplementari: "No: non sono supplementari" sarebbe
vero) sarebbe difendibile, e allora il suo posto lo prende "Non si può stabilire". Il verificatore
controlla che nessuna opzione sbagliata abbia il verdetto giusto e un'affermazione vera. Niente angoli
retti, che sono insieme congruenti e supplementari. Qui le ampiezze non seguono la figura della lezione
(le rette possono non essere parallele), come nell'esempio 2 della lezione.

## Livello 4: le ampiezze con un'equazione

"Le rette $a$ e $b$ sono parallele e sono tagliate da una trasversale. Due angoli corrispondenti misurano
$(x + 31)^\circ$ e $(5x - 41)^\circ$. Trova $x$." Risposta $x = 18$ ($x + 31 = 5x - 41$, $-4x = -72$).
Secondo esempio, coniugati esterni $(5x - 32)^\circ$ e $(2x - 19)^\circ$: $5x - 32 + 2x - 19 = 180$,
$7x = 231$, $x = 33$.

- Tutte e cinque le coppie con nome: con alterni e corrispondenti si uguagliano le espressioni, con i
  coniugati la somma fa $180$ (circa 3 su 5 e 2 su 5).
- $x$ intero da 5 a 40, coefficienti da 1 a 7 (diversi se gli angoli sono congruenti), termini noti fino a
  100 in valore assoluto, ampiezze da $25^\circ$ a $155^\circ$, mai $90^\circ$.
- I passaggi scrivono l'equazione nell'ordine del testo, la forma $ax = b$ come nella lezione ($-2x =
  -40$), la soluzione e le due ampiezze.
- Distrattori: la $x$ della relazione sbagliata (somma $180$ per angoli congruenti, uguaglianza per i
  coniugati), la $x$ con un termine noto spostato senza cambiare segno, l'ampiezza del primo angolo al posto
  di $x$, poi $x \pm 1$. Solo interi positivi.

## Livello 5: gli angoli del triangolo

Sei casi (quote: terzo angolo e proporzione circa 1 su 5, gli altri circa 3 su 20).

- `terzo`: "In un triangolo $ABC$ l'angolo $\hat{C}$ misura $66^\circ$ e l'angolo $\hat{B}$ misura
  $78^\circ$. Quanto misura $\hat{A}$?" Risposta $36^\circ$, almeno $10^\circ$. Distrattori: "Il triangolo
  non esiste", $360^\circ$ meno i due angoli, la loro somma, $180^\circ$ meno uno solo.
- `non-esiste`: stessa domanda con due angoli che fanno almeno $180^\circ$ (riquadro "Triangoli che non
  esistono"): $145^\circ$ e $40^\circ$. Risposta "Il triangolo non esiste"; distrattori i numeri che esce
  a chi fa il conto senza guardare: $5^\circ$ (il segno perso), $175^\circ$, $35^\circ$ e $140^\circ$. Se la
  somma è esattamente $180^\circ$, tra i distrattori c'è $0^\circ$.
- `base`: isoscele, dall'angolo al vertice (pari, da $20^\circ$ a $160^\circ$) agli angoli alla base (80
  gradi: $50^\circ$). Distrattori: $180^\circ$ meno il vertice senza dividere, metà del vertice.
- `vertice`: isoscele, dall'angolo alla base (da $15^\circ$ a $85^\circ$) al vertice ($50^\circ$:
  $80^\circ$). Distrattori: $180^\circ$ meno un solo angolo alla base, la sua metà, $90^\circ$ meno la base.
- `rettangolo`: dall'angolo acuto (da $10^\circ$ a $80^\circ$) all'altro. Distrattori: il supplementare,
  $90^\circ$ più l'angolo, l'angolo stesso.
- `proporzione`: "Gli angoli di un triangolo misurano $2x$, $3x$ e $4x$. Quanto misura il maggiore dei
  tre angoli?" ($80^\circ$). Coefficienti da 1 a 9 in ordine crescente, con somma che divide 180 e non tutti
  uguali; si chiede il maggiore o il minore. Distrattori: $x$, l'altro estremo, $180^\circ$ meno la
  risposta.

## Livello 6: l'angolo esterno

Quattro casi, un quarto ciascuno; il vertice dell'angolo esterno e i nomi degli altri due cambiano. Angoli
interni di almeno $15^\circ$; la risposta non è mai uno dei dati.

- `da-interni`: i due interni non adiacenti, si chiede l'esterno (secondo teorema). "$\hat{B} = 82^\circ$
  e $\hat{A} = 65^\circ$. Quanto misura l'angolo esterno in $C$?" $147^\circ$. Distrattori: l'interno in
  $C$, $180^\circ$ meno uno dei dati.
- `adiacente`: l'interno adiacente e uno non adiacente, si chiede l'esterno. "$\hat{C} = 46^\circ$ e
  $\hat{B} = 105^\circ$. Quanto misura l'angolo esterno in $C$?" $134^\circ$. Distrattore principale la
  somma dei due dati, cioè il riquadro "Sommare l'angolo sbagliato".
- `altro`: l'esterno e un interno non adiacente, si chiede l'altro non adiacente (esempio 7). "L'angolo
  esterno in $C$ misura $114^\circ$ e $\hat{B} = 41^\circ$. Quanto misura $\hat{A}$?" $73^\circ$.
- `interno`: l'esterno e un interno non adiacente, si chiede l'interno adiacente, supplementare
  dell'esterno ($59^\circ$ e $22^\circ$: $\hat{B} = 121^\circ$). Distrattore principale la differenza dei
  dati, che è l'altro angolo.

## Livello 7: gli angoli dei poligoni convessi

Cinque casi, un quinto ciascuno.

- `somma`: dal numero dei lati (da 4 a 20) alla somma. 5 lati: $540^\circ$. Distrattori $n \cdot
  180^\circ$ (il riquadro "Moltiplicare per $n$ invece che per $n - 2$"), $(n - 1) \cdot 180^\circ$,
  $(n - 3) \cdot 180^\circ$; tutti multipli di $180^\circ$.
- `lati`: dalla somma al numero dei lati (da 5 a 20). $720^\circ$: 6 lati. Distrattori $n - 2$ (il
  quoziente senza aggiungere 2), $n \pm 1$.
- `regolare`: l'angolo del poligono regolare con $n$ lati, per gli $n$ con angolo intero (3, 4, 5, 6, 8,
  9, 10, 12, 15, 18, 20, 24, 30, 36). Distrattori: l'angolo esterno $360^\circ : n$, $180^\circ$.
- `lati-regolare`: dall'angolo del poligono regolare al numero dei lati, con gli angoli esterni come fa la
  lezione nell'esempio 8(b). $108^\circ$: 5 lati. Distrattori: l'angolo esterno scambiato per il numero dei
  lati, $n : 2$, $n \pm 2$.
- `ultimo`: un quadrilatero, un pentagono o un esagono convesso con tutti gli angoli tranne uno; si chiede
  l'ultimo. Angoli da $40^\circ$ a $170^\circ$. Distrattori: $n \cdot 180^\circ$ meno la somma, $360^\circ$
  meno la somma.

## Da evitare

- Coppie senza nome come domanda del livello 1; angoli retti ai livelli 3 e 4 (congruenti e supplementari
  insieme); triangoli equilateri nella proporzione (non c'è niente da trovare); una risposta uguale a un
  dato; poligoni non convessi; opzioni come $243^\circ$ per un angolo tra due rette.
- Un distrattore del livello 3 che si possa difendere (vedi sopra).

## Verifica

- `sample.mts geometria-perpendicolari-parallele 1000 all 1 | verify.py`: PASS, 7.000 su 7.000; di nuovo con
  seed di partenza 7001: PASS. Le quote dei casi stanno negli intervalli di `CASE_RANGES`.
- Esercizi diversi su 1.000 per livello (testi del problema distinti): 72, 879, 949, 998, 637, 997, 262. Il
  livello 1 ne ha pochi per natura: 12 coppie con nome, in due ordini, per due modi di chiederle, più 8 angoli
  per 5 nomi fanno 88 domande in tutto. Non si allarga: le coppie sono quelle.
- Errori piantati a mano, tutti bocciati: risposta cambiata (livello 2); indice dell'opzione giusta
  spostato (livello 3); parametri diversi dal testo (livelli 1 e 4); distrattore difendibile al posto di
  "Non si può stabilire" (livello 3); un triangolo che esiste marcato come "non esiste" (livello 5);
  un'opzione di una somma non multipla di $180^\circ$ (livello 7); un'opzione che non dice il suo valore
  (livello 6); un angolo ottuso in $\hat{1}$, contro la figura della lezione (livello 2); un poligono con un
  angolo di $185^\circ$ (livello 7); due opzioni uguali (livello 4); tre opzioni sole (livello 1).
- Il verificatore ha trovato un difetto alla prima esecuzione: i distrattori delle somme del livello 7
  venivano scartati come angoli oltre $360^\circ$, e restavano solo $\pm 5^\circ$ e $\pm 10^\circ$ attorno a
  $2160^\circ$. Corretto: le somme hanno distrattori multipli di $180^\circ$.
- `width.mts`: esce con 0. Il problema è tutto prosa; l'opzione più larga è al livello 3 ("No: non sono
  supplementari", 219 px su 252). Con "No, perché non sono supplementari" era 275 px, troppo.
- `review.mts` esce con 0; `steps-scan.mts` non segnala niente; `tsc` ed `eslint` puliti sul generatore.

## Domande per la revisione

- La frase sulla numerazione è lunga e si ripete in tutti gli esercizi dei livelli 1-3. Finché non c'è la
  figura, basta? Uno studente che non ha la lezione aperta ricostruisce il disegno da "in senso antiorario a
  partire da quello sopra la retta e a destra di $t$"?
- Livello 3: le risposte "Sì: sono supplementari" e "No: non sono congruenti" mettono insieme il verdetto e
  il motivo. Va bene così, o è meglio chiedere solo sì o no e mettere il motivo nei passaggi? Con due sole
  risposte non si arriva a quattro opzioni.
- Livello 2: gli angoli dispari sono sempre acuti, come nella figura della lezione. Al livello 3 invece
  no (come nell'esempio 2 della lezione, dove $\hat{6}$ misura $74^\circ$). È coerente abbastanza?
- Livello 5: il distrattore "Il triangolo non esiste" compare in tutti gli esercizi sul terzo angolo, così
  la sua presenza non suggerisce niente. Serve anche negli isosceli e nei rettangoli?
- Livello 1, caso `trova`: una delle quattro opzioni forma con l'angolo dato una coppia senza nome (per
  esempio $\hat{1}$ e $\hat{6}$). La lezione non dice che quelle coppie non hanno nome: è un distrattore
  corretto o confonde?
- La lezione dice che la distanza di un punto da una retta si misura sulla perpendicolare e parla
  dell'asse, ma senza numeri: non ci sono esercizi su distanza, proiezione e asse. Servono domande a scelta
  multipla di riconoscimento?
