# Equazioni fratte

Generatore: `equazioni-fratte` (`src/lib/exercises/v2/generators/equazioni-fratte.ts`).
Verifica indipendente: `scripts/exercises/checkers/equazioni_fratte.py`. Lezione collegata:
`docs/lezioni/riscritte/49-equazioni-fratte.md` (nota in `docs/lezioni/note/49-equazioni-fratte.md`,
sezione "Per il generatore").

Lo studente riceve un'equazione con l'incognita al denominatore che, tolti i denominatori, diventa di
primo grado, e trova l'insieme delle soluzioni. La consegna è "Risolvi l'equazione." ai livelli 1-5 e
"Risolvi l'equazione e scegli l'insieme delle soluzioni." al livello 6. Il procedimento dei passaggi è
quello in sei passi della lezione: scomporre i denominatori, scrivere le C.E., calcolare il MCM,
moltiplicare ogni termine per il MCM (i prodotti scritti come nella lezione, $3x = 5(x - 2)$), risolvere
l'equazione intera, confrontare la soluzione con le C.E. e scrivere $S$.

## Tipo di risposta

- Livelli 1-5: `set` con un solo valore, sempre accettabile ($S = \{5\}$, $S = \left\{\frac{8}{3}\right\}$).
  La variante a scelta multipla ha quattro opzioni scritte come insiemi.
- Livello 6: `choice` fin dall'inizio. Il motivo è l'equazione indeterminata: la sua risposta è
  $S = \mathbb{R} \setminus \{-1, 2\}$, e il tipo `set` di oggi sa dire solo "questi valori" oppure
  "ogni numero reale" (`universal`, che per le intere indeterminate di `equazioni-primo-grado` vale
  $S = \mathbb{R}$). Scrivere i valori esclusi dentro `values` con `universal: true` andrebbe contro il
  commento di `types.ts` (con `universal` i valori sono vuoti) e un controllo delle risposte aperte li
  leggerebbe come soluzioni. Al livello 6 anche i casi senza $\mathbb{R}$ (soluzione non accettabile,
  impossibile, soluzione $0$) sono a scelta, perché il livello deve avere un solo tipo di risposta e perché
  la domanda è proprio quale insieme scegliere.

Valori delle opzioni: `[]` per $\emptyset$, `["R"]` per $\mathbb{R}$, `["R", "-1", "2"]` per
$\mathbb{R} \setminus \{-1, 2\}$, altrimenti i valori dell'insieme (razionali esatti `p` o `p/q`).
Il testo dell'opzione è `S = \emptyset`, `S = \mathbb{R}`, `S = \mathbb{R} \setminus \left\{ -1, 2 \right\}`
o `S = \left\{ 5 \right\}`; il controllo lo rilegge e lo confronta con i valori.

## Costruzione all'indietro

Ogni termine è $\pm N(x) / (c \cdot \prod (x - r))$: numeratore intero di grado al massimo 1, denominatore
scelto già scomposto (i valori esclusi $r$ e un fattore numerico $c$). Si scelgono prima i denominatori e
la soluzione, poi una costante di un numeratore (il "buco") si calcola perché l'equazione valga nella
soluzione: l'equazione moltiplicata per il MCM è lineare nella costante, quindi bastano due valutazioni.
Il buco deve venire intero e piccolo, altrimenti l'estrazione si scarta. Al livello 6 la soluzione scelta
è un valore escluso (soluzione non accettabile) oppure $0$; le impossibili e le indeterminate si
costruiscono facendo annullare il coefficiente della $x$ (e, per le indeterminate, scrivendo il terzo
numeratore uguale alla somma degli altri due moltiplicati per i fattori mancanti, come nell'esempio 8).

`params` contiene i termini dei due membri (`sign`, `num` per grado, `den` con `c`, `roots`, `asc`),
le C.E., il caso e la soluzione. Il controllo Python non usa la soluzione dei params: rilegge l'equazione
dal LaTeX del testo, verifica che i params dicano gli stessi termini e risolve da capo.

## Regole comuni

- Denominatori: prodotti di fattori $x - r$ distinti, al massimo due, con $|r| \leq 6$, per un fattore
  numerico da 1 a 12; il denominatore opposto si scrive $a - x$ con $a > 0$. Un termine senza
  denominatore è un solo monomio ($2$, $-4$).
- Numeratori di grado al massimo 1, coefficienti fino a 30, primo coefficiente positivo (un numeratore
  numerico negativo diventa un meno davanti alla frazione, come nell'esempio 1 della lezione).
- Nessuna frazione si semplifica: il numeratore non si annulla in un valore escluso del suo denominatore,
  le frazioni numeriche sono ridotte. L'avviso della lezione su $\frac{x^2 - 4}{x - 2} = 4$ resta fuori.
- Moltiplicata per il MCM, l'equazione è di primo grado (al livello 5 e in qualche caso del livello 6
  compare $x^2$ nei due membri e si cancella).
- C.E. scritte come nella lezione: "C.E.: $x \neq -2$, $x \neq 2$", in ordine crescente.
- Ai livelli 1-5 la soluzione è accettabile: il controllo verifica che non coincida con un valore escluso.
- Il problema sta su una riga: il più largo (livello 6, tre frazioni e un trinomio al denominatore) misura
  circa 265 px con KaTeX a 18 px, sotto i 350 px del telefono. Il controllo boccia un problema su due righe.

## Livello 1: una frazione per membro

$\frac{k}{x - a} = \frac{h}{x - b}$ con numeratori numerici (esempio 1), $a \neq b$ tra $-6$ e $6$ (con
$a = 0$ il denominatore è $x$). Soluzione intera tra $-9$ e $9$. Si sceglie la soluzione $s$, poi
$k = t(s - a)/g$ e $h = t(s - b)/g$ con $g$ il MCD di $s - a$ e $s - b$.

1. $\frac{3}{x - 4} = \frac{6}{x - 2}$: C.E. $x \neq 2$, $x \neq 4$; $3(x - 2) = 6(x - 4)$, $x = 6$. $S = \{6\}$.
2. $\frac{12}{x + 6} = \frac{3}{x}$: $12x = 3(x + 6)$, $x = 2$. $S = \{2\}$.

## Livello 2: denominatori monomi

Termini $\frac{n}{cx}$ con $c \in \{1, 2, 3, 4, 6\}$ e una frazione numerica, MCM monomio (esempio 2).
Due forme: $\frac{n_1}{c_1 x} \pm \frac{n_2}{c_2 x} = \frac{p}{q}$ (a volte con i membri scambiati) e
$\frac{n_1}{c_1 x} \pm \frac{p}{q} = \frac{n_3}{c_3 x}$. Almeno due denominatori con la $x$ diversi.
Soluzione tra $\pm 1, \dots, \pm 6$ e $\pm\frac{1}{2}, \pm\frac{3}{2}, \pm\frac{5}{2}, \pm\frac{1}{3}, \pm\frac{2}{3}, \pm\frac{4}{3}$;
la frazione numerica ha denominatore fino a 12 e numeratore fino a 20.

1. $\frac{1}{3x} + \frac{5}{3} = \frac{7}{6x}$: MCM $6x$, $2 + 10x = 7$, $x = \frac{1}{2}$.
2. $\frac{7}{3x} - \frac{5}{6x} = -1$: MCM $6x$, $14 - 5 = -6x$, $x = -\frac{3}{2}$.

## Livello 3: un denominatore da scomporre

$\frac{n_1}{x - r_1} \pm \frac{n_2}{x - r_2} = \frac{N_3}{(x - r_1)(x - r_2)}$ (esempio 3), con il terzo
denominatore scritto sviluppato: differenza di quadrati $x^2 - a^2$ o raccoglimento $x^2 - ax$ (allora uno
dei due è $\frac{n}{x}$). $N_3$ numerico o $x + d$, $2x + d$. In 3 casi su 10 i membri sono scambiati.
Soluzione intera tra $-9$ e $9$ o frazione con denominatore da 2 a 5 (metà e metà).

1. $\frac{5}{x - 1} + \frac{8}{x + 1} = \frac{x}{x^2 - 1}$: $5(x + 1) + 8(x - 1) = x$, $x = \frac{1}{4}$.
2. $\frac{x + 17}{x^2 + 6x} = \frac{5}{x} + \frac{9}{x + 6}$: $x + 17 = 5(x + 6) + 9x$, $x = -1$.

## Livello 4: denominatori opposti e un termine senza denominatore

$\frac{ex + h}{x - a} \pm \frac{n}{a - x} = k$ oppure $\frac{ex + h}{x - a} \pm k = \frac{n}{a - x}$, con
$a$ da 1 a 6 e $e \in \{0, 1, 2\}$ (esempio 4 e, per il termine senza denominatore, esempio 6). Nei
passaggi prima si scrive $a - x = -(x - a)$ e si porta il meno davanti alla frazione. Soluzione intera o
con denominatore 2 o 3.

1. $\frac{x - 7}{x - 1} - 2 = \frac{9}{1 - x}$: $x - 7 - 2(x - 1) = -9$, $x = 4$.
2. $\frac{x + 3}{x - 2} + 1 = \frac{5}{2 - x}$: $x + 3 + x - 2 = -5$, $x = -3$.

## Livello 5: il termine $x^2$ si cancella

$\frac{mx + a}{x + b} = \frac{mx + c}{x + d}$ con $m = 1$ (3 volte su 4) o $m = 2$, $b \neq d$ (esempio 5).
Si sceglie la soluzione e si calcola $c$, fino a 9 in valore assoluto. Soluzione intera o con denominatore
da 2 a 5.

1. $\frac{x + 5}{x - 1} = \frac{x - 5}{x + 4}$: $x^2 + 9x + 20 = x^2 - 6x + 5$, $x = -1$.
2. $\frac{x}{x - 3} = \frac{x - 4}{x - 5}$: $x^2 - 5x = x^2 - 7x + 12$, $x = 6$.

## Livello 6: soluzioni escluse, impossibili e indeterminate

I casi della tabella della lezione, mescolati, con le quote che il controllo verifica:

- soluzione non accettabile, circa 3 su 10: forma del livello 4 (con denominatori uguali o opposti, con o
  senza termine senza denominatore, come $\frac{x}{x - 2} = \frac{2}{x - 2}$) o del livello 3 (anche con
  un trinomio al denominatore), con la soluzione dell'equazione intera uguale a un valore escluso.
  $S = \emptyset$;
- equazione intera impossibile, circa 2 su 10: forma del livello 5 con $a + d = b + c$ (esempio 7) o del
  livello 3 con il coefficiente della $x$ che si annulla. $S = \emptyset$;
- indeterminata, circa 1 su 4: forma del livello 3 con $N_3$ uguale a $n_1(x - r_2) \pm n_2(x - r_1)$
  (esempio 8, anche con il trinomio) o del livello 4 con il termine senza denominatore che cancella la $x$.
  $S = \mathbb{R} \setminus \{\text{valori esclusi}\}$;
- soluzione $0$ accettabile, circa 1 su 4 (avviso "Scartare lo zero per abitudine"). $S = \{0\}$.

1. $\frac{x + 1}{x - 4} = \frac{5}{x - 4}$: $x + 1 = 5$, $x = 4$, escluso dalle C.E. $S = \emptyset$.
2. $\frac{5}{x} - \frac{1}{x + 4} = \frac{4x + 20}{x^2 + 4x}$: $5(x + 4) - x = 4x + 20$, $0x = 0$.
   $S = \mathbb{R} \setminus \{-4, 0\}$.

## Esercizi "brutti" da evitare

- frazioni che si semplificano, o numeratori che si annullano in un valore escluso;
- equazioni che, moltiplicate per il MCM, restano di secondo grado (sono della lezione sulle equazioni di
  secondo grado);
- coefficienti grandi: la lezione lavora con $\frac{3}{x - 2}$, $\frac{x - 1}{x + 1}$, $x^2 - 4$;
- ai livelli 1-5, una soluzione che coincide per caso con un valore escluso;
- numeratori con il primo coefficiente negativo, $1x$, $+ -$, termini nulli.

## Variante a scelta multipla

Quattro opzioni distinte, una giusta. Distrattori dagli errori della lezione, in quest'ordine:

- prodotto in croce al contrario, quando c'è una frazione per membro ($k(x - a) = h(x - b)$);
- denominatori opposti presi come uguali, senza cambiare segno (avviso "Mettere nel MCM tutti e due i
  fattori opposti");
- termine senza denominatore non moltiplicato per il MCM (avviso "Dimenticare i termini senza
  denominatore": $x + 1 - 2 = 4$);
- il meno davanti a una frazione applicato solo al primo termine del numeratore ($-(x + 1)$ scritto
  $-x + 1$, avviso "Il meno davanti a una frazione");
- al livello 2, i numeratori moltiplicati solo per la $x$ che manca e non per il numero;
- un numero portato dall'altra parte senza cambiare segno; la soluzione con il segno cambiato;
- un valore escluso preso come soluzione; se non bastano, valori vicini alla soluzione.

Un distrattore che coincide con un valore escluso si scarta. Al livello 6, per caso:

- soluzione non accettabile: c'è sempre $S = \{\text{valore escluso}\}$ (fermarsi all'equazione intera,
  il controllo lo pretende), poi gli errori sopra e $S = \mathbb{R} \setminus \{\dots\}$;
- impossibile: $S = \mathbb{R} \setminus \{\dots\}$, $S = \mathbb{R}$, l'insieme dei valori esclusi;
- indeterminata: c'è sempre $S = \mathbb{R}$ (C.E. dimenticate, il controllo lo pretende), poi
  $S = \emptyset$ e l'insieme dei valori esclusi;
- soluzione $0$: c'è sempre $S = \emptyset$ (lo zero scartato per abitudine, il controllo lo pretende).

## Verifica

- `sample.mts equazioni-fratte 1000 all 1` e `... 7001`, passati a `verify.py`: PASS con tutti e due i seed
  (6.000 esercizi ciascuno). Quote del livello 6 con il seed 1: non accettabile 331, impossibile 180,
  indeterminata 260, zero 229; con il seed 7001: 326, 186, 248, 240.
- Esercizi diversi su 1.000 (seed 1): livello 1 912, livello 2 975, livello 3 997, livello 4 993,
  livello 5 957, livello 6 962.
- `width.mts equazioni-fratte`: esce con 0; problema più largo 264 px (livello 6), opzione più larga
  136 px (livello 6, $S = \mathbb{R} \setminus \{\dots\}$).
- Errori piantati a mano, tutti bocciati dal controllo: risposta cambiata (livello 1); indice
  dell'opzione giusta spostato (livello 3, e al livello 6 dentro un file passato a `verify.py`, che dà
  FAIL); caso sbagliato nei params (livello 6); numeratore dei params diverso dal testo (livello 2); la
  soluzione esclusa tolta dalle opzioni (livello 6, non accettabile); l'opzione giusta di un'indeterminata
  cambiata in $S = \mathbb{R}$; C.E. incomplete nei passaggi; un esercizio del livello 3 marcato come
  livello 1; testo di un'opzione diverso dai suoi valori; problema spezzato su due righe; frazione
  semplificabile ($\frac{x + 3}{x + 3}$).
- `review.mts equazioni-fratte` esce con 0; `tsc` ed `eslint` senza errori nel generatore.

## Domande per la revisione

- Al livello 6 la risposta è solo a scelta multipla. Per una risposta aperta futura servirà un tipo di
  risposta "ℝ tranne questi valori" (per esempio `universal` con un campo `except`), da aggiungere a
  `types.ts`: va bene così?
- Nelle opzioni scrivo sempre l'insieme ($S = \{5\}$) e mai "$x = 5$", come fa la lezione. Il generatore
  delle intere scrive "$x = 5$" e "Nessuna soluzione": conviene uniformare?
- Il livello 5 a volte ha lo stesso numeratore nei due membri ($\frac{x + 3}{x - 2} = \frac{x + 3}{x + 4}$,
  $x = -3$), che si risolve anche a occhio. Lo tengo o lo escludo?
- Tra i distrattori dei livelli 1-5 c'è spesso un valore escluso ($S = \{0\}$ quando le C.E. dicono
  $x \neq 0$): è un errore vero (confondere C.E. e soluzioni) o un distrattore troppo facile?
- La frazione numerica del livello 2 arriva a denominatore 12 ($\frac{7}{10}$, $\frac{13}{8}$), mentre
  la lezione usa $\frac{5}{4}$: va ristretta a denominatori fino a 6?
