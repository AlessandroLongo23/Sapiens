# Proposizioni e connettivi logici

Generatore: `logica-proposizioni` (`src/lib/exercises/v2/generators/logica-proposizioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/logica_proposizioni.py`. Lezione collegata:
"Proposizioni e connettivi logici" (`docs/lezioni/riscritte/65-logica-proposizioni.md`), livelli
presi dalla sezione "Per il generatore" di `docs/lezioni/note/65-logica-proposizioni.md`.

Convenzioni della lezione: lettere minuscole $p$, $q$, $r$; valori V e F; $\neg$, $\wedge$,
$\vee$ e $p \,\dot\vee\, q$ per la disgiunzione esclusiva; righe delle tavole nell'ordine VV, VF,
FV, FF (con tre lettere VVV, VVF, VFV, VFF, FVV, FVF, FFV, FFF); la negazione si applica per
prima e solo alla lettera o alla parentesi che la segue ($\neg p \wedge q$ è $(\neg p) \wedge q$);
quando in una formula ci sono due connettivi binari, quello interno è sempre tra parentesi, come
chiede la lezione. "O" è sempre inclusivo. L'equivalenza si scrive $\Leftrightarrow$ (solo nei
passaggi).

Tutte le risposte sono a scelta multipla con quattro opzioni, tranne "in quante righe è vera"
dei livelli 4 e 5, che è un conteggio (`number`, con la variante a scelta multipla).

## Rappresentazione

- Formule in notazione prefissa, nei `params` e nei `values` delle opzioni: `p`, `not(p)`,
  `and(p,q)`, `or(p,q)`, `xor(p,q)`. Il verificatore le analizza, le riscrive in LaTeX con le
  regole sopra e confronta il testo con quello dell'opzione; calcola le tavole con
  `itertools.product`.
- Frasi del livello 1: `values` sono i pezzi. `atom` più il tipo e i numeri (`pari`, `dispari`,
  `multiplo`, `primo`, `divisore`, `cmp` per $a > b$, `somma` per $a + b = c$, `prodotto` per
  $a \cdot b = c$); `fatto` più l'indice nella lista dei fatti; `domanda`, `ordine`, `opinione`,
  `aperta` (frase con la $x$). Il verificatore ha le sue liste e i suoi valori di verità, e ricava
  vero o falso dai numeri, non dal testo.
- Livello 2: `params.variant` (`lettere`, `confronto`); per `lettere` gli atomi `p` e `q` e
  `ask` (`vera`, `falsa`); per `confronto` `a`, `rel`, `b`, e ogni opzione ha `values = [rel]`.
- Livello 3: `params.env` (i valori di $p$, $q$ ed eventualmente $r$) e `params.ask`.
- Livelli 4 e 5: `params.variant` (`colonna`, `quante`), `params.formula`; le opzioni di
  `colonna` hanno `values = ["VFFV"]`, la colonna dall'alto in basso.
- Livello 6: `params.variant` (`tautologia`, `contraddizione`, `equivalente`), con `X` e
  `shape` per l'equivalenza.
- Livello 7: `params.variant` (`formula` con `X`, `frase` con `orig`, `numeri` con `orig`). Una
  frase è `[chi, i1, neg1, connettivo, i2, neg2]` (`chi` è `meteo` o un nome; `neg` `0` o `1`);
  un confronto doppio è `[a, rel1, b, connettivo, rel2, c]` e si legge
  "$a$ rel1 $b$ connettivo $a$ rel2 $c$".

Le opzioni di testo più lunghe di 26 caratteri vanno su due righe con `\begin{gathered}`; il
verificatore le ricompone in una riga prima di confrontarle.

## Livello 1: riconoscere le proposizioni

Quattro frasi e una domanda, in quattro varianti: quale è una proposizione (circa 30%; la
proposizione è falsa metà delle volte, per l'errore "una frase falsa non è una proposizione";
le altre tre sono una domanda, un ordine, un'opinione o una frase con la $x$, di tre tipi
diversi), quale non è una proposizione (circa 25%, le altre tre sono proposizioni, di solito
almeno una falsa), quale è una proposizione vera (circa 25%) e quale è una proposizione falsa
(circa 20%). Nelle ultime due c'è la trappola della domanda con il contenuto vero ("20 è pari?"
quando si chiede la vera, "21 è un numero primo?" quando si chiede la falsa), che resta una
domanda.

Proposizioni: fatti sui numeri da 2 a 40 (pari, dispari, multiplo di un numero da 3 a 9, primo,
divisore), confronti tra numeri da 1 a 20, somme e prodotti piccoli, e dodici fatti fissi con
valore certo (Roma capitale d'Italia, un'ora ha 60 minuti, un quadrato ha cinque lati, ...).
Opinioni: sette frasi fisse ("Il calcio è lo sport più bello", "Il 7 è un bel numero", ...).
Frasi con la $x$: $x + a = b$, $kx = b$ con $k$ da 2 a 5, $x > a$, "$x$ è multiplo di $k$".

Esempi: "Quale di queste frasi è una proposizione falsa?" tra "Scrivi il doppio di 10",
$11 < 3$, "8 è un numero primo?", "Una settimana ha 7 giorni": $11 < 3$. "Quale di queste frasi
non è una proposizione?" tra "Un triangolo ha tre lati", "Il calcio è lo sport più bello",
"Un quadrato ha cinque lati", $8 \cdot 4 = 32$: l'opinione.

## Livello 2: un connettivo

Due varianti.

- Lettere (circa 67%): $p$ e $q$ sono fatti sui numeri, scritti nel problema come
  "$p$: 12 è pari". Metà delle volte parlano dello stesso numero (come "12 è pari e multiplo di
  5"), mai pari e dispari insieme. Le opzioni sono quattro tra $\neg p$, $\neg q$, $p \wedge q$,
  $p \vee q$, $p \,\dot\vee\, q$, con una sola vera (o una sola falsa: la domanda si sceglie tra
  quelle che hanno una risposta sola). Con $p$ e $q$ vere tutte e due, $p \vee q$ è la trappola
  di chi legge "o" come esclusivo.
- Confronto (circa 33%): la negazione di $a > b$, $a < b$, $a \geq b$ o $a \leq b$, con $a \neq
  b$ da 1 a 20. Distrattori: il verso opposto stretto (negare "maggiore" con "minore", l'errore
  del riquadro della lezione), l'uguale o il diverso, e il simbolo con l'uguale nel verso
  sbagliato. Il verificatore controlla la negazione come relazione, su tutte le coppie di interi
  da $-4$ a $4$: una sola opzione è vera esattamente dove l'originale è falsa.

Esempi: "$p$: 36 è pari", "$q$: 35 è dispari", quale è vera tra $p \vee q$, $\neg p$, $\neg q$,
$p \,\dot\vee\, q$: $p \vee q$. La negazione di $8 > 10$ tra $8 \leq 10$, $8 = 10$, $8 < 10$,
$8 \geq 10$: $8 \leq 10$.

## Livello 3: una riga della tavola

Sono dati i valori di $p$ e $q$ (e di $r$, circa 35% delle volte); quattro formule con 2 o 3
connettivi, una sola vera o una sola falsa (metà e metà). Sette volte su dieci, se in quella
riga differiscono, tra le opzioni c'è la coppia $\neg(x \circ y)$ e $\neg x \circ y$ (la
trappola della precedenza della lezione), e una delle due è la risposta. Con tre lettere, $r$
compare in almeno due opzioni. Formule senza $\neg\neg$, senza due lati uguali, senza una lettera
accanto alla propria negazione, senza catene come $p \wedge (q \wedge r)$, con al massimo una
lettera ripetuta. $\dot\vee$ in circa una formula su dieci.

Esempi: $p$ vera e $q$ vera, quale è falsa tra $\neg(p \vee q)$, $(p \wedge q) \vee p$,
$(p \vee q) \wedge p$, $q \vee (p \wedge q)$: la prima. $p$ falsa e $q$ vera, quale è falsa tra
$(q \vee p) \wedge q$, $\neg(q \,\dot\vee\, p) \wedge q$, $\neg(p \wedge q) \vee p$,
$\neg(p \wedge q) \wedge q$: la seconda.

I passaggi mostrano ogni opzione calcolata un livello alla volta:
$\neg p \vee q\text{: } \neg \text{V} \vee \text{V} = \text{F} \vee \text{V} = \text{V}$.

## Livello 4: tavola con due lettere

Una formula con 2 o 3 connettivi che usa $p$ e $q$, né tautologia né contraddizione, quasi
sempre con una negazione. Il problema mostra la tavola con le colonne di $p$ e $q$ e i punti di
domanda nell'ultima.

- Colonna (circa 70%): quale è l'ultima colonna, dall'alto in basso. Distrattori, in
  quest'ordine: la colonna della formula con la negazione spostata ($\neg(p \wedge q)$ letta
  $\neg p \wedge q$ o il contrario), con il connettivo principale cambiato ($\wedge$ e $\vee$,
  $\vee$ e $\dot\vee$), la colonna di una sola delle due parti (chi si ferma prima), la colonna
  giusta con una riga sbagliata, la colonna rovesciata.
- Quante (circa 30%): in quante righe la proposizione è vera, da 1 a 3; distrattori le righe
  false e i conteggi delle formule sbagliate, mai più di 4.

Esempi: $p \wedge \neg(p \wedge q)$: F, V, F, F. $(q \,\dot\vee\, p) \vee \neg p$: F, V, V, V.

## Livello 5: tavola con tre lettere

Come il livello 4, con $p$, $q$, $r$ tutte presenti e otto righe. Il problema mostra solo la
formula (una tavola di otto righe è troppo alta); l'ordine delle righe è nella consegna.
Conteggi da 1 a 7, opzioni mai oltre 8.

Esempi: $\neg(r \wedge q) \wedge p$: F, V, V, V, F, F, F, F. $(\neg r \vee q) \wedge p$: V, V,
F, V, F, F, F, F.

## Livello 6: tautologie ed equivalenze

- Tautologia (circa 30%) o contraddizione (circa 25%): quale delle quattro formule (con 2 o 3
  connettivi su $p$ e $q$) lo è. Tra i distrattori, sette volte su dieci, una formula del tipo
  opposto (la contraddizione quando si chiede la tautologia), e poi formule vere (o false) in tre
  righe su quattro. Qui una lettera accanto alla propria negazione è permessa.
- Equivalente (circa 45%): quale delle quattro formule è equivalente a quella data. Tre forme:
  $\neg(A \circ B)$ con risposta la legge di De Morgan (circa 45%), la stessa letta al
  contrario (circa 30%), e l'esempio della lezione $(A \vee B) \wedge \neg A \Leftrightarrow
  \neg A \wedge B$ (circa 25%); $A$ e $B$ sono $p$, $\neg p$, $q$ o $\neg q$, su lettere diverse.
  Distrattori: De Morgan senza cambiare il connettivo, una sola parte negata, il connettivo
  cambiato senza negare, la negazione solo sulla prima lettera; per l'esempio della lezione,
  $B$ da sola, $\neg A$ da sola, $\neg A \vee B$, $A \wedge B$. Nella risposta i due lati sono a
  volte scambiati ($p \wedge q \Leftrightarrow q \wedge p$). La formula data non è mai tra le
  opzioni.

Esempi: contraddizione tra $(\neg q \wedge p) \wedge q$, $\neg(p \vee (q \vee p))$,
$\neg q \vee q$, $(\neg q \wedge p) \wedge p$: la prima. Equivalente a $\neg(q \vee \neg p)$ tra
$\neg q \vee p$, $\neg q \vee \neg p$, $p \wedge \neg q$, $\neg q \wedge \neg p$: la terza.

## Livello 7: negare con De Morgan

- Formula (circa 35%): la negazione di $A \wedge B$ o $A \vee B$, con $A$ e $B$ tra $p$,
  $\neg p$, $q$, $\neg q$. Distrattori: "e" lasciato "e" con le parti negate, il connettivo
  cambiato senza negare le parti, una sola parte negata, la negazione solo sulla prima lettera.
  La doppia negazione si semplifica ($\neg(p \wedge \neg q) \Leftrightarrow \neg p \vee q$).
- Frase (circa 35%): una frase del linguaggio comune con "e" o "o", sul tempo ("Piove e fa
  freddo") o su una persona ("Luca studia e legge"), a volte con la seconda parte già negata.
  Stessi distrattori, in parole: "Non piove e non fa freddo", "Piove o fa freddo", "Non piove o
  fa freddo". Il verificatore ricostruisce ogni opzione dai pezzi e controlla sulle quattro righe
  dei due atomi che solo una sia la negazione.
- Numeri (circa 30%): la negazione di "$a > b$ o $a < c$" (fuori da un intervallo) o di
  "$a > b$ e $a < c$" (dentro), con $\geq$ e $\leq$ metà delle volte, come "8 è maggiore di 5 o
  minore di 2" della lezione. Distrattori: il connettivo lasciato, "maggiore" negato con
  "minore", il connettivo cambiato senza negare. Il verificatore controlla la negazione per ogni
  intero $a$ da $-5$ a $39$.

Esempi: "Nevica e piove" ha negazione "Non nevica o non piove" (tra "Non nevica e non piove",
"Nevica o piove", "Non nevica o piove"). $17 \geq 11 \text{ e } 17 \leq 14$ ha negazione
$17 < 11 \text{ o } 17 > 14$ (tra $17 < 11 \text{ e } 17 > 14$, $17 \geq 11 \text{ o } 17 \leq
14$, $17 \leq 11 \text{ o } 17 \geq 14$).

## Esercizi da evitare

- Frasi con un valore di verità incerto o che dipende dal momento (niente "domani pioverà", su
  cui i libri non sono d'accordo): i fatti sono in una lista fissa, ognuno controllato.
- "Primo" su 0 e 1, divisori uguali al numero, multipli di sé stesso, $x$ con coefficiente 1.
- Formule con $\neg\neg$ nel testo, con due lati uguali ($p \wedge p$), con $p \wedge \neg p$
  fuori dal livello 6, catene $p \wedge (q \wedge r)$ nei livelli 3, 4 e 5, tautologie e
  contraddizioni nelle tavole dei livelli 4 e 5.
- Opzioni di testo più larghe del bottone: vanno su due righe.

## Figure

Nessuna. I circuiti con gli interruttori in serie e in parallelo della lezione vorrebbero un
livello "quando si accende la lampadina", che resta fuori finché il sito non genera figure per
gli esercizi. Le tavole sono testo (un `array` di KaTeX nel livello 4, largo al massimo 220 px).

## Verifica (26 settembre 2026)

- `sample.mts logica-proposizioni 1000 all 1 | verify.py`: PASS, 7.000 su 7.000. Con il seed
  di partenza 7001: PASS, 7.000 su 7.000. Le quote delle varianti stanno negli intervalli di
  `CASE_RANGES`.
- Esercizi diversi su 1.000 (consegna, problema e insieme delle opzioni): livello 1: 1.000;
  livello 2: 957; livello 3: 998; livello 4: 552; livello 5: 831; livello 6: 796; livello 7: 593.
  Al livello 6 le tautologie diverse sono 36 e le contraddizioni 36, tutte con 2 o 3 connettivi.
- Errori piantati, tutti bocciati (`scratchpad/g65-plant.py`): indice della risposta spostato;
  colonna giusta con una riga sbagliata; conteggio cambiato; un fatto vero al posto di quello
  falso (con il testo coerente e senza); il valore di $p$ cambiato nei params; la domanda
  capovolta da vera a falsa; la negazione di $>$ scritta con $<$; il LaTeX di un'opzione diverso
  dalla sua formula; una formula con quattro connettivi; una tautologia al posto della formula
  del livello 4; al livello 6 la tautologia sostituita da $p \vee q$, la formula data cambiata e
  l'opzione equivalente negata; al livello 7 la negazione di "e" fatta con "e", $<$ al posto di
  $\leq$, due opzioni uguali; tre opzioni invece di quattro; la tavola senza la riga FF.
- `review.mts`: codice 0. `width.mts`: codice 0; problema al massimo 229 px (livello 2), opzioni
  al massimo 213 px (livello 7). `steps-scan`: nessun errore.

## Domande per la revisione

- Livello 1: le frasi con la $x$ sono "non proposizioni" come dice la lezione; alcuni libri le
  chiamano già "enunciati aperti" e le trattano a parte. Va bene tenerle tra i distrattori?
- Livello 2: la negazione di $a \geq b$ ha come distrattore $a \neq b$, e quella di $a > b$ ha
  $a \geq b$: sono errori che si vedono davvero, o conviene sostituirli con la negazione scritta
  a parole ("$a$ non è maggiore di $b$")?
- Livello 3: alcune opzioni sono ridondanti, come $(p \wedge q) \vee p$ (che vale quanto $p$).
  Sono utili per l'esercizio di calcolo, ma a uno studente possono sembrare strane.
- Livelli 4 e 5: le colonne si scrivono in orizzontale ("V, F, F, V"); sul telefono una colonna
  verticale occuperebbe troppo. Va detto più chiaramente che si leggono dall'alto in basso?
- Livello 7: le frasi usano "o" inclusivo come la lezione; "Luca studia o legge" nel linguaggio
  comune suona a molti esclusivo. Serve una riga nel testo che lo ricordi?
