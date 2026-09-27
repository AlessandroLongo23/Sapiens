# Sistemi di due equazioni in due incognite

Generatore: `sistemi-di-equazioni` (`src/lib/exercises/v2/generators/sistemi-di-equazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/sistemi_di_equazioni.py`. Lezione collegata:
`docs/lezioni/riscritte/68-sistemi-di-equazioni.md` (nota in `docs/lezioni/note/68-sistemi-di-equazioni.md`,
sezione "Per il generatore", da cui vengono i sette livelli).

Lo studente riceve un sistema lineare di due equazioni in $x$ e $y$, scritto con la graffa
(`\begin{cases}`), e sceglie la soluzione tra quattro. Le convenzioni sono quelle della lezione: la
coppia $(x, y)$ con il valore di $x$ al primo posto, $S = \{(3, 2)\}$, $S = \emptyset$ per un sistema
impossibile, $S = \{(x, y) \mid x - 2y = 3\}$ per uno indeterminato, frazioni e mai decimali, forma
normale $ax + by = c$. I passaggi seguono gli esempi svolti: ricavare, sostituire tra parentesi,
uguagliare, moltiplicare e sommare o sottrarre membro a membro, i rapporti $\frac{a}{a'}$, le C.E.

## Tipo di risposta

Sempre `choice`, a tutti i livelli. La soluzione è una coppia e nessun tipo di risposta di oggi ha due
campi; ai livelli 6 e 7 la risposta può essere anche $\emptyset$ o l'insieme delle coppie di una retta.

Valori delle opzioni: `["3", "2"]` per $S = \{(3, 2)\}$ (al livello 1 la coppia da sola, $(3, 2)$),
`[]` per $S = \emptyset$, `["R"]` per $S = \mathbb{R}$ (un errore che la lezione nomina, solo come
distrattore), `["line", "1", "-2", "3"]` per $S = \{(x, y) \mid x - 2y = 3\}$. Una coppia con una frazione
si scrive con `\left( \right)` e `\left\{ \right\}`. Il controllo rilegge il testo di ogni opzione e lo
confronta con i valori.

## Costruzione all'indietro

Si sceglie prima la coppia soluzione (interi tra $-6$ e $6$, al livello 3 anche frazioni), poi i
coefficienti, e i termini noti si calcolano dalla soluzione. I sistemi impossibili e indeterminati del
livello 6 sono multipli di una stessa equazione $ax + by = c$ con MCD 1 (per l'impossibile si cambia il
termine noto della seconda). I sistemi fratti del livello 7 partono dalla coppia e dai valori esclusi:
per la soluzione non accettabile la coppia scelta è proprio quella esclusa.

La scelta del caso (livelli 4, 6 e 7) si fa una volta per esercizio, prima dei tentativi, così gli
scarti non cambiano le quote.

`params` contiene il sistema intero in forma normale (`sys`, tre numeri per equazione), il caso
(`kind`), la soluzione del sistema intero, le C.E. (`ce`) e al livello 7 la forma della prima equazione
(`shape`). Il controllo Python non usa la soluzione dei params: rilegge le due equazioni dal LaTeX del
testo, le risolve con `linsolve` (al livello 7 dopo aver tolto i denominatori, poi scarta la coppia che
annulla un denominatore) e verifica che `sys` dica le stesse equazioni.

## Regole comuni

- Coefficienti piccoli, come negli esempi: fino a 5 ai livelli 1 e 2, fino a 7 al livello 4, fino a 15
  nella forma normale del livello 5.
- Ai livelli 1, 2, 7 (seconda equazione) le equazioni date hanno coefficienti primi tra loro e non tutti e
  due negativi; al livello 4 nessuna equazione si semplifica.
- Niente $1x$, $0y$, $+ -$, $- -$, termini nulli, $\frac{0}{\dots}$ nel testo.
- Ai livelli 1-5 e 7 il sistema intero è determinato.
- Il problema sta sul telefono: la graffa si misura come una formula sola, la più larga (livello 5) è
  250 px a 18 px su 350 px.

## Livello 1: riconoscere la soluzione

Due equazioni in forma normale con coefficienti da $-5$ a $5$ non nulli, soluzione intera. La consegna
chiede quale coppia è la soluzione; le opzioni sono coppie. Distrattori: la coppia scambiata (avviso
"Scambiare l'ordine nella coppia"), una coppia che risolve solo la prima equazione, una che risolve solo
la seconda (come $(1, 4)$ nella lezione). I passaggi fanno la verifica della coppia giusta nelle due
equazioni e dicono perché ogni distrattore non va.

1. $x + 4y = 4$, $-5x + y = 1$: $(0, 1)$; distrattori $(1, 0)$, $(-4, 2)$, $(-1, -4)$.
2. $5x - 4y = -34$, $-5x + 2y = 32$: $(-6, 1)$; distrattori $(1, -6)$, $(-2, 6)$, $(-2, 11)$.

## Livello 2: metodo di sostituzione

Un coefficiente $1$ o $-1$ (tre volte su quattro nella prima equazione), tutti i coefficienti non nulli,
soluzione intera tra $-6$ e $6$ (esempio 1). Si ricava l'incognita con coefficiente $\pm 1$ ($y$ nella
prima prima di tutto), la si sostituisce tra parentesi nell'altra, si svolge, si trova il valore e lo si
mette nell'espressione ricavata.

1. $x - 5y = -5$, $x - y = -1$: $x = 5y - 5$, $5y - 5 - y = -1$, $y = 1$, $x = 0$. $S = \{(0, 1)\}$.
2. $2x + 3y = -12$, $3x + y = 3$: $y = 3 - 3x$, $2x + 3(3 - 3x) = -12$, $x = 3$, $y = -6$.

## Livello 3: metodo del confronto

$y = m_1 x + q_1$ e $y = m_2 x + q_2$ (una volta su quattro con $x$ ricavata), $m$ da $-4$ a $4$ non
nulli e diversi, $q$ da $-6$ a $6$ non tutti e due nulli (esempio 2). Soluzione anche frazionaria, con
denominatore fino a 6. L'espressione con il termine noto positivo e la pendenza negativa si scrive come
nella lezione, $4 - x$. Il valore della seconda incognita si calcola nell'equazione con meno conti.

1. $y = x$, $y = 3x - 5$: $x = 3x - 5$, $x = \frac{5}{2}$, $S = \left\{\left(\frac{5}{2}, \frac{5}{2}\right)\right\}$.
2. $y = x - 5$, $y = 4x - 6$: $x = \frac{1}{3}$, $y = -\frac{14}{3}$.

## Livello 4: metodo di riduzione

Coefficienti da 2 a 7 in valore assoluto (nessun $\pm 1$), soluzione intera con almeno una coordinata
negativa. Tre volte su dieci un'incognita ha già coefficienti uguali od opposti (esempio 3), le altre
volte bisogna moltiplicare una o tutte e due le equazioni per portarli al MCM (esempio 4). Si elimina
l'incognita con il MCM più piccolo, a parità quella con i segni opposti; con segni opposti si somma, con
segni uguali si sottrae e il passaggio mostra la sottrazione come nell'avviso ($8y - (-15y)$).

1. $5x - 4y = 20$, $-7x + 6y = -30$ (da moltiplicare): $S = \{(0, -5)\}$.
2. $-7x + 2y = 44$, $-7x + 5y = 47$ (già uguali, si sottrae): $S = \{(-6, 1)\}$.

## Livello 5: denominatori e parentesi

Due equazioni da portare in forma normale, almeno una con denominatori numerici (esempio 5). Tre forme:

- frazioni: $\frac{n_1 x}{d_1} \pm \frac{n_2 y}{d_2} = k$, frazioni ridotte, $d$ da 2 a 6;
- binomi: $\frac{x + h}{d_1} \pm \frac{y + j}{d_2} = k$ (con il meno davanti tre volte su cinque);
- parentesi: $m(x + h) + ny = sx + t$ (o con la parentesi sulla $y$), che si svolge e si porta in forma
  normale come nell'esempio della lezione $2(x - 1) + y = 3x - 4$.

MCM fino a 12, termine noto $k$ con denominatore fino a 6. Coppie di forme: frazioni e binomi, binomi e
frazioni, frazioni e parentesi, binomi e parentesi, parentesi e binomi. Poi si risolve con la
sostituzione se c'è un coefficiente $\pm 1$, con la riduzione altrimenti. Soluzione intera.

1. $\frac{x}{3} + \frac{2y}{3} = -2$, $\frac{x + 1}{4} + \frac{y + 1}{6} = \frac{1}{4}$: $x + 2y = -6$,
   $3x + 2y = -2$, $S = \{(2, -4)\}$.
2. $2(x + 4) - y = -2x + 4$, $\frac{x - 4}{2} - \frac{y - 1}{3} = -3$: $4x - y = -4$, $3x - 2y = -8$,
   $S = \{(0, 4)\}$.

## Livello 6: determinato, impossibile o indeterminato

Due equazioni in forma normale con coefficienti e termini noti non nulli, così i tre rapporti della
tabella si scrivono sempre. Quote: determinato 2 su 10, impossibile 4 su 10, indeterminato 4 su 10. Il
determinato ha $a' = ha$ e $b' \neq hb$, quindi assomiglia agli altri due. I passaggi confrontano
$\frac{a}{a'}$, $\frac{b}{b'}$ e (se i primi due sono uguali) $\frac{c}{c'}$, come nell'esempio 8; il
determinato poi si risolve.

La risposta dell'indeterminato è $S = \{(x, y) \mid ax + by = c\}$ con l'equazione ridotta ai numeri più
piccoli e $a > 0$ (il controllo lo pretende).

1. $x + y = 8$, $-4x - 4y = -29$: $\frac{1}{-4} = \frac{1}{-4} \neq \frac{8}{-29}$, impossibile.
2. $2x - 3y = -8$, $-8x + 12y = 32$: tre rapporti uguali, $S = \{(x, y) \mid 2x - 3y = -8\}$.

## Livello 7: sistemi fratti

La prima equazione ha un'incognita al denominatore, la seconda è lineare. Due forme:

- $\frac{k_1}{x - p} = \frac{k_2}{y - r}$ (esempio 9, circa metà), C.E. su $x$ e su $y$;
- $\frac{x + h}{y - r} = k$ oppure $\frac{y + h}{x - p} = k$ (esempio 10), C.E. su una incognita.

Soluzione accettabile 6 volte su 10, non accettabile 4 su 10 ($S = \emptyset$). I passaggi scrivono le
C.E., moltiplicano per i denominatori, portano la prima equazione in forma normale, risolvono il sistema
intero e confrontano la coppia con le C.E.

1. $\frac{x - 6}{y - 1} = 1$, $-3x + y = -15$: C.E. $y \neq 1$, $x - y = 5$, $S = \{(5, 0)\}$.
2. $\frac{y - 5}{x + 3} = 1$, $x + 2y = 7$: C.E. $x \neq -3$, il sistema intero dà $(-3, 5)$, esclusa,
   $S = \emptyset$.

## Esercizi "brutti" da evitare

- coefficienti grandi o equazioni che si semplificano (tutti i coefficienti pari) tra i dati;
- ai livelli 1-5 un sistema non determinato; al livello 7 un sistema intero non determinato;
- al livello 3 due rette per l'origine (la risposta è sempre $(0, 0)$);
- al livello 4 un coefficiente $\pm 1$, che chiama la sostituzione;
- al livello 6 un coefficiente nullo, che toglie un rapporto;
- al livello 7 un distrattore che cade su un valore escluso (tranne la coppia esclusa voluta).

## Variante a scelta multipla

Quattro opzioni distinte, una giusta. Distrattori, in quest'ordine:

- livello 1: la coppia scambiata, una coppia che risolve solo la prima, una che risolve solo la seconda;
- livello 2: la parentesi moltiplicata solo nel primo termine ($3(5 - x)$ scritto $15 - x$), un numero
  portato dall'altra parte senza cambiare segno;
- livello 3: i numeri portati senza cambiare segno ($2x + x = 4 - 1$), la divisione capovolta;
- livello 4: il segno nella sottrazione ($8y - 15y$ invece di $8y + 15y$, avviso "Il segno nella
  sottrazione"), l'equazione moltiplicata solo nel primo membro (avviso "Moltiplicare solo il primo
  membro");
- livello 5: il meno davanti a una frazione applicato solo al primo termine del numeratore (avviso),
  il termine noto non moltiplicato per il MCM, il numero portato senza cambiare segno nella forma con le
  parentesi;
- livello 6: per l'impossibile $S = \mathbb{R}$, l'insieme della retta, una coppia che risolve la prima;
  per l'indeterminato $S = \mathbb{R}$ (avviso "Indeterminato non vuol dire tutte le coppie", il controllo
  lo pretende), $S = \emptyset$, una sola coppia della retta; per il determinato $S = \emptyset$, la retta
  della prima equazione, $S = \mathbb{R}$;
- livello 7: con la soluzione non accettabile c'è sempre la coppia esclusa (avviso "Dimenticare le C.E.",
  il controllo lo pretende), poi il prodotto in croce al contrario ($k_1(x - p) = k_2(y - r)$) o la
  parentesi moltiplicata solo nel primo termine; con la soluzione accettabile $S = \emptyset$ e gli stessi
  errori;
- se non bastano: la coppia scambiata, i segni cambiati, una coordinata spostata di 1.

Un distrattore che viene da un errore ha denominatore fino a 12 e numeratore fino a 30, altrimenti si
scarta. Gli errori "Sostituire nella stessa equazione" ($0x = 0$) e "Fermarsi alla prima incognita" non
danno una coppia e restano fuori dalle opzioni.

## Figure

Il sito non genera figure per gli esercizi. Vorrebbero una figura il livello 6 (le due rette parallele o
coincidenti, come nella lezione) e il livello 3 (le due rette $y = mx + q$ e il punto d'incontro). Oggi
si reggono sul testo.

## Verifica

- `sample.mts sistemi-di-equazioni 1000 all 1` e `... 7001`, passati a `verify.py`: PASS con tutti e due
  i seed (7.000 esercizi ciascuno). Quote con il seed 1: livello 4 pronti 316, da moltiplicare 684;
  livello 6 determinato 198, impossibile 400, indeterminato 402; livello 7 accettabile 598, non
  accettabile 402. Con il seed 7001: 297 e 703; 192, 412, 396; 604 e 396.
- Esercizi diversi su 1.000 (seed 1): livello 1 998, livello 2 995, livello 3 971, livello 4 999,
  livello 5 1.000, livello 6 997, livello 7 997.
- `width.mts sistemi-di-equazioni`: esce con 0. Problema più largo 250 px (livello 5), opzione più larga
  214 px (livello 6, $S = \{(x, y) \mid \dots\}$).
- Errori piantati a mano, 17, tutti bocciati dal controllo, ognuno dalla sua regola: indice
  dell'opzione giusta spostato (livello 2); valori della risposta cambiati (livello 4); testo di
  un'opzione diverso dai valori (livello 1); caso sbagliato nei params (livello 6); retta
  dell'indeterminato scritta con i coefficienti doppi (livello 6); coppia esclusa tolta dalle opzioni
  (livello 7); C.E. sbagliate nei passaggi (livello 7); coppia esclusa data per giusta, cioè le C.E.
  dimenticate (livello 7); ultimo passaggio sbagliato (livello 3); `params.sys` diverso dal testo
  (livello 5); coppia scambiata tolta (livello 1); opzioni doppie (livello 2); $1x$ nel testo
  (livello 2); frazione non ridotta $\frac{6x}{8}$ (livello 5); testo non leggibile (livello 2); un
  esercizio del livello 4 marcato livello 2; $S = \mathbb{R}$ tolto da un impossibile (livello 6). Il
  file con i 17 campioni passato a `verify.py` dà FAIL.
- `review.mts sistemi-di-equazioni` esce con 0; `steps-scan.mts` non trova passaggi che KaTeX non
  disegna; `tsc` ed `eslint` senza errori nel generatore.

## Domande per la revisione

- Tutti i livelli sono a scelta multipla. Per una risposta aperta futura servirà un tipo "coppia"
  (due campi) e, per il livello 6, un modo di scrivere "le coppie di una retta": va bene aspettare?
- Al livello 6 le opzioni sono insiemi ($\emptyset$, la retta, $\mathbb{R}$, una coppia) e non le tre
  parole "determinato, impossibile, indeterminato", perché le parole sono solo tre e la regola ne chiede
  quattro. Il riconoscimento è nei passaggi (i rapporti). Va bene, o si preferisce una domanda con le
  parole e le rette ("impossibile, rette parallele") e un quarto distrattore misto?
- Alcuni distrattori che vengono da errori veri hanno frazioni poco probabili come
  $\left(-\frac{25}{2}, -\frac{3}{2}\right)$ accanto a una soluzione intera, e si riconoscono come
  sbagliati a occhio. Li tengo (sono l'errore vero) o li sostituisco con coppie intere vicine?
- Al livello 5 le forme con i binomi e le parentesi escono più spesso di quelle con $\frac{n x}{d}$
  (circa 3 contro 1), perché le frazioni del primo tipo si scartano più spesso: serve riequilibrare?
- La nota della lezione mette nel livello 1 anche "portare un'equazione in forma normale": qui la forma
  normale è nel livello 5 (parentesi e denominatori), per non avere due difficoltà nello stesso livello.
