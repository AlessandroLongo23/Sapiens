# Prodotto cartesiano

Generatore: `insiemi-prodotto-cartesiano` (`src/lib/exercises/v2/generators/insiemi-prodotto-cartesiano.ts`).
Verifica indipendente: `scripts/exercises/checkers/insiemi_prodotto_cartesiano.py`. Lezione collegata:
"Prodotto cartesiano" (`docs/lezioni/riscritte/39-insiemi-prodotto-cartesiano.md`), con i livelli
proposti nella sezione "Per il generatore" della sua nota. Il livello 4 di `insiemi-operazioni` fa già
elencare $P \times Q$ e contare le coppie; qui si va più a fondo, con tutti gli argomenti della lezione.

Convenzioni della lezione: coppie ordinate tra parentesi tonde, $(a, b)$; "primo elemento" e "secondo
elemento"; $A \times B$, $A^2$ per $A \times A$; $|A|$ per la cardinalità; $\mathbb{N}$ contiene lo 0;
insiemi scritti $\{1, 2, 3\}$ e $\emptyset$ per l'insieme vuoto; nella tabella a doppia entrata il primo
insieme sta sulle righe e il secondo sulle colonne.

Il tipo `set` accetta solo numeri reali, e le risposte qui sono coppie: tutti i livelli rispondono a
scelta multipla (`choice`), tranne il livello 3 che risponde con un `number` e ha la variante a scelta
multipla con `numberChoice`. Quattro opzioni distinte in ogni esercizio.

## Rappresentazione

Ogni esercizio ha `params.variant`. Nelle opzioni, `values` dice che cosa è scritto:

- una coppia è `"1:a"`, una coppia scritta per errore con le graffe `"~1:a"`, un elemento sciolto (un
  insieme di numeri invece di un insieme di coppie) `"=1"`; l'insieme vuoto ha `values` vuoto;
- al livello 1 i valori di $x$ e $y$ sono `"x=3"`, `"y=2"`;
- al livello 4 i due insiemi sono `"A=2,5,7"`, `"B=p,q"`.

Le coppie di un'opzione sono in ordine (numeri crescenti, poi lettere) e il verificatore controlla che il
LaTeX di ogni opzione sia quello che si ricava dai valori.

- Livello 1: `variant` `uguaglianza` con `layout` (`incrociata` o `sinistra`), `x`, `y` e i coefficienti
  `a`, `b` (prima componente $ax + b$), `ya`, `yb` (seconda componente $ya \cdot y + yb$); oppure
  `appartenenza` con `case` (`lettere`, `numeri`), `A`, `B`.
- Livello 2: `variant` (`lettere`, `numeri`, `quadrato`), `A`, `B`, `asked` (`AxB`, `BxA`, e per il
  quadrato `AxA` o `A2`).
- Livello 3: `variant` e i numeri del testo (`m`, `n`, `story`, `total`, `k`, `square`), più `mistakes`.
- Livello 4: `casella` con `rows`, `cols`, `cell` (riga e colonna del punto interrogativo, da 0) e
  `asked`; oppure `insiemi` con `A`, `B`.
- Livello 5: `variant` (`appartenenza`, `elenco`, `vuoto`) e le due proprietà `A`, `B` nel formato di
  `propJSON` di `insiemi.ts`; il verificatore trova gli elementi con la sua `prop_elements`.
- Livello 6: `variant` (`somma`, `minore`, `comuni`), `A`, `B` e per la somma `s`.

## Livello 1: coppie ordinate

Metà degli esercizi, come l'esempio 1: trovare $x$ e $y$ perché due coppie siano uguali. La prima
componente è $ax + b$ con $a$ da 1 a 4, la seconda $ky$ con $k$ da 2 a 5 oppure $y + k$. Nel caso
`incrociata` (60%) l'incognita $x$ sta a sinistra e $y$ a destra, come nella lezione; nel caso
`sinistra` stanno tutte e due a sinistra. $x$ e $y$ sono interi non nulli tra $-3$ e $9$. Il
verificatore legge le quattro componenti dal problema e risolve il sistema con SymPy.

L'altra metà, come l'esempio 4 senza la proprietà: quale di quattro coppie appartiene ad $A \times B$.
$A$ di numeri e $B$ di lettere (40%) oppure due insiemi di numeri con un elemento in comune (60%), dove
l'ordine sbagliato non si vede dal tipo di elemento.

Esempi: $(2x - 1, 12) = (17, 2y)$: $x = 9$, $y = 6$. $A = \{2, 3, 4\}$, $B = \{1, 2, 5\}$: tra
$(1, 2)$, $(2, 5)$, $(5, 3)$, $(4, 3)$ appartiene solo $(2, 5)$.

## Livello 2: elencare il prodotto

Si sceglie l'elenco giusto di $A \times B$ o di $B \times A$ (metà e metà), con insiemi di 2 o 3
elementi e al massimo 6 coppie: numeri e lettere (circa 36%), due insiemi di numeri con un elemento in
comune (circa 33%), dove $A \times B$ e $B \times A$ hanno una coppia in comune e si confondono di più.
Nel resto (circa 31%) si chiede $A \times A$, scritto anche $A^2$, con $A$ di 2 elementi (4 coppie).

Esempi: $A = \{1, 5\}$, $B = \{3, 5, 7\}$: $B \times A = \{(3, 1), (3, 5), (5, 1), (5, 5), (7, 1),
(7, 5)\}$. $A = \{4, 6\}$: $A \times A = \{(4, 4), (4, 6), (6, 4), (6, 6)\}$.

## Livello 3: contare

Risposta `number`. Cinque varianti:

- `diretto` (circa 22%): $|A|$ e $|B|$ da 2 a 9, si chiede $|A \times B|$;
- `problema` (circa 24%): cinque storie di abbinamenti (menù come l'esempio 3, magliette e pantaloni,
  gusti e coni, codici lettera e cifra, battaglia navale), numeri diversi da 2 a 8;
- `inverso` (circa 20%): $|A \times B|$ e $|A|$, si chiede $|B|$, con $|B| \ne |A|$;
- `quadrato` (circa 16%): $|A|$ da 3 a 12, si chiede $|A \times A|$;
- `radice` (circa 18%): $|A \times A|$ quadrato perfetto da 9 a 144, si chiede $|A|$ (esempio 8).

La risposta non è mai un numero già scritto nel problema.

Esempi: "Una mensa offre ogni giorno 2 primi e 6 secondi. [...] Quanti menù diversi si possono
comporre?" 12. $|A \times B| = 12$, $|A| = 2$: $|B| = 6$.

## Livello 4: cambiare rappresentazione

Metà degli esercizi: una tabella a doppia entrata vuota, con i nomi degli elementi sulle righe e sulle
colonne (da 2 a 4 ciascuna) e un punto interrogativo in una casella; si sceglie la coppia che ci va.
Righe di numeri e colonne di lettere, o tutte e due di numeri (con al massimo un elemento in comune);
circa 15 volte su 100 la tabella è di $B \times A$, con le lettere sulle righe. La coppia della casella
non ha mai i due elementi uguali, perché la coppia scambiata sia diversa.

L'altra metà, come l'esempio 6: $A \times B$ elencato (4 o 6 coppie, in ordine, due per riga), si
trovano $A$ e $B$. Numeri e lettere, oppure numeri con un elemento in comune. Il verificatore rilegge
le coppie dal problema e controlla che siano un prodotto intero.

Esempi: tabella di $A \times B$ con righe $1, 6, 7, 9$ e colonne $a, c, e, h$, punto interrogativo
nella riga di $1$ e nella colonna di $h$: $(1, h)$. $A \times B = \{(1, p), (1, r), (1, s), (5, p),
(5, r), (5, s)\}$: $A = \{1, 5\}$, $B = \{p, r, s\}$.

## Livello 5: insiemi descritti con una proprietà

Come l'esempio 4: $A$ e $B$ date con una proprietà in $\mathbb{N}$ o in $\mathbb{Z}$ (intervalli con
$<$ e $\le$, $2x + 1 < 7$, $x^2 < 5$, $x^2 = 4$, divisori di 4 o di 9), ognuna con 2 o 3 elementi, da
elencare prima di fare il prodotto. Tre varianti: quale coppia appartiene ad $A \times B$ (circa 47%),
l'elenco di $A \times B$ con al massimo 6 coppie (circa 22%), e il caso in cui una delle due proprietà
non ha elementi, $\{x \in \mathbb{N} \mid x < 0\}$, $\{x \in \mathbb{Z} \mid 2x = 5\}$,
$\{x \in \mathbb{Z} \mid x^2 < 0\}$ e simili (circa 30%): allora $A \times B = \emptyset$.

Esempi: $A = \{x \in \mathbb{Z} \mid -1 < x \le 2\}$, $B = \{x \in \mathbb{N} \mid x + 3 \le 5\}$:
tra $(1, -1)$, $(2, 0)$, $(3, 2)$, $(-1, -1)$ appartiene solo $(2, 0)$. $A = \{x \in \mathbb{Z} \mid
2x = 5\}$, $B = \{x \in \mathbb{Z} \mid -1 < x \le 2\}$: $A \times B = \emptyset$.

## Livello 6: coppie con una condizione

Tre varianti con numeri da 1 a 7:

- `somma` (circa 32%), come l'esempio 5: $\{(a, b) \in A \times B \mid a + b = s\}$ con $A$ e $B$ di
  3 o 4 elementi, da una a tre coppie, e sempre almeno una coppia con somma $s$ fatta di elementi dei
  due insiemi ma fuori da $A \times B$ (la trappola $(4, 1)$ dell'esempio);
- `minore` (circa 30%): $\{(a, b) \in A \times B \mid a < b\}$, con almeno un elemento comune, così
  c'è una coppia con $a = b$ da scartare; da una a cinque coppie;
- `comuni` (circa 38%), come l'esempio 7: $(A \times B) \cap (B \times A)$ con uno (60%) o due
  elementi in comune, e nessuno dei due insiemi contenuto nell'altro. La risposta è
  $(A \cap B) \times (A \cap B)$.

Esempi: $A = \{1, 2, 5, 7\}$, $B = \{3, 4, 6, 7\}$, somma $6$: $\{(2, 4)\}$. $A = \{1, 6\}$,
$B = \{2, 5, 6\}$: $(A \times B) \cap (B \times A) = \{(6, 6)\}$.

## Variante a scelta multipla

I distrattori vengono dai riquadri `ad-warning` della lezione.

- Livello 1, uguaglianza: il primo elemento di una coppia uguagliato al secondo dell'altra (solo nel
  caso incrociato, se dà interi), $x$ e $y$ scambiati, il termine noto spostato senza cambiare segno,
  il coefficiente di $x$ non diviso, $y$ ottenuto sottraendo invece di dividere; poi $\pm 1$.
- Livello 1 e livello 5, appartenenza: la coppia giusta scambiata ("Scambiare l'ordine dentro le
  coppie"), coppie con il primo elemento preso da $B$ (come $(-1, 1)$ dell'esempio 4), un elemento
  appena fuori dall'intervallo (estremo preso o perso).
- Livello 2: il prodotto nell'ordine opposto ("Scambiare $A \times B$ con $B \times A$"), le coppie
  scritte con le graffe ("Scrivere le coppie con le graffe", solo se nessuna coppia ha i due elementi
  uguali, per non scrivere $\{3, 3\}$), le coppie "in fila" $(1, a), (2, b)$, solo le coppie del
  primo elemento, gli elementi dei due insiemi messi insieme ("Confondere il prodotto con l'unione").
  Per $A \times A$: solo le coppie con $a \le b$ (come se l'ordine non contasse), solo quelle con
  $a \ne b$, solo la diagonale, $A$ stesso.
- Livello 3: la somma $|A| + |B|$ ("Sommare invece di moltiplicare"), $2|A|$ al posto di $|A|^2$,
  $|A \times B| - |A|$ e $|A \times B| \cdot |A|$ nel conto inverso, $|A \times A| : 2$ nella radice;
  poi $\pm 1$, $\pm 2$.
- Livello 4, tabella: la coppia scambiata (colonna prima della riga), la stessa coppia con le graffe,
  le caselle vicine. Insiemi: $A$ e $B$ scambiati, tutti gli elementi in tutti e due gli insiemi, solo
  il primo elemento di $A$, un elemento di $B$ perso, un elemento di $A$ finito in $B$.
- Livello 5, elenco: il prodotto $B \times A$, un estremo preso per errore (un elemento in più), lo 0
  dimenticato in $\mathbb{N}$, le graffe, gli elementi messi insieme. Vuoto: l'altro insieme
  ("Pensare che $A \times \emptyset$ sia $A$"), e il prodotto con $\{0\}$ nei due ordini, come se
  l'insieme vuoto fosse $\{0\}$.
- Livello 6: somma con le coppie fuori dal prodotto aggiunte, le coppie scambiate, una coppia persa,
  la somma $s \pm 1$; minore con $a \le b$, $a > b$, $a \ge b$, le coppie scambiate; comuni con
  $A \cap B$ come insieme di numeri, $\emptyset$ ("nessuna coppia è uguale"), le coppie di $A \times B$
  che contengono un elemento comune, solo la diagonale o solo le coppie fuori dalla diagonale.

## Righe sul telefono

Il problema sta in 350 px a 18 px e ogni opzione in 252 px a 16 px. Un'opzione con più di 4 coppie, o
con più di 3 se c'è un numero negativo, va su due righe con `\begin{gathered}` e le graffe `\Big`, come
in `insiemi-operazioni`; il verificatore ricostruisce le righe e boccia un'opzione scritta diversamente.
Al livello 4 le opzioni con $A$ e $B$ sono sempre su due righe, una per insieme; le coppie di
$A \times B$ nel problema stanno due per riga. La tabella è racchiusa in un `gathered`, così
`present.ts` non la spezza in righe.

Misura (`scripts/exercises/width.mts`, 26 settembre 2026), larghezza massima in px:

| Livello | Problema | Opzioni |
|---|---|---|
| 1 | 213 | 125 |
| 2 | 111 | 228 |
| 3 | 117 | 29 |
| 4 | 203 | 133 |
| 5 | 294 | 206 |
| 6 | 280 | 204 |

## Verifica

- `sample.mts insiemi-prodotto-cartesiano 1000 all 1 | verify.py`: PASS, 6.000 su 6.000; con seed di
  partenza 7001: PASS, 6.000 su 6.000. Le quote dei casi stanno negli intervalli di `CASE_RANGES`.
- Esercizi diversi su 1.000 per livello (seed da 1, testo della consegna e problema): 974, 743, 288,
  958, 605, 915. Il livello 3 è sotto i 1.000 per costruzione: le varianti `quadrato` e `radice` hanno
  10 casi ciascuna ($|A|$ da 3 a 12), `diretto` 64; resta sopra i 100.
- Errori piantati a mano, tutti bocciati (19 su 19): indice della risposta giusta spostato; $x$ nei
  params diverso dalla soluzione; coefficiente cambiato nel problema (soluzione non intera); coppia
  giusta scambiata; una coppia tolta dalla risposta giusta; sei coppie su una riga sola (troppo
  larghe); le coppie con le graffe come risposta giusta; risposta numerica $+1$; conto inverso con
  $|B| = |A|$; storia del problema diversa dai params; casella spostata; $A$ e $B$ scambiati nei params
  del livello 4; prodotto incompleto nel problema del livello 4; variante `vuoto` con due insiemi non
  vuoti; elenco del livello 5 con una coppia in meno; somma cambiata nei params; opzione ripetuta; la
  coppia con $a = b$ dentro la risposta di `minore`; dominio della proprietà cambiato nel problema.
- `review.mts` esce con 0; `width.mts` esce con 0; `tsc` ed `eslint` senza errori nel generatore.

## Esercizi da evitare

- Più di 6 coppie da scrivere nelle opzioni.
- Un'uguaglianza di coppie con soluzione non intera o nulla.
- Una casella della tabella con i due elementi uguali (la coppia scambiata sarebbe la stessa).
- Un problema di conteggio con la risposta già scritta nel testo.
- Al livello 5 due proprietà identiche, o un insieme con un solo elemento.

## Domande per la revisione

- La lezione ha quattro rappresentazioni, ma il reticolo di punti e il diagramma a frecce non entrano:
  servirebbero figure nel problema. Il livello 4 usa la tabella a doppia entrata (vuota, con un punto
  interrogativo) e l'elenco. Vale la pena disegnare il reticolo con una figura TikZ precompilata, come
  fa la chimica con le molecole?
- Al livello 5 il distrattore "come se l'insieme vuoto fosse $\{0\}$" è plausibile per
  $\{x \in \mathbb{N} \mid x < 0\}$, meno per $\{x \in \mathbb{Z} \mid 2x = 5\}$. Va tenuto per tutte
  le proprietà vuote?
- Il livello 6 scrive la condizione come $\{(a, b) \in A \times B \mid a + b = 6\}$, una notazione che
  la lezione usa solo nella definizione del prodotto; l'esempio 5 la dice a parole. È chiara per uno
  studente del primo anno, o meglio una frase?
