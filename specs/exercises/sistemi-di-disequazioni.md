# Sistemi di disequazioni

Generatore: `sistemi-di-disequazioni` (`src/lib/exercises/v2/generators/sistemi-di-disequazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/sistemi_di_disequazioni.py`. Lezione collegata:
`docs/lezioni/riscritte/53-sistemi-di-disequazioni.md` (nota in `docs/lezioni/note/53-sistemi-di-disequazioni.md`,
sezione "Per il generatore").

Lo studente riceve un sistema di disequazioni di primo grado (o una doppia disequazione), lo risolve e
sceglie l'insieme delle soluzioni tra quattro. La consegna è "Risolvi il sistema e scegli l'insieme delle
soluzioni." ai livelli 1-5 e "Risolvi la doppia disequazione e scegli l'insieme delle soluzioni." ai
livelli 6 e 7. I passaggi seguono i cinque passi della lezione: ogni disequazione risolta per conto suo
fino a $x > a$ o $x \le b$, poi le strisce comuni, gli estremi compresi solo se compresi in tutte le
righe, $S$ scritto come intervallo.

## Tipo di risposta

`choice` a tutti i livelli, fin dall'inizio. La risposta è un intervallo, un punto o l'insieme vuoto, e
nessun tipo di risposta di `types.ts` rappresenta un intervallo (`set` dice solo valori isolati o "ogni
numero reale"). `toChoice` restituisce la risposta stessa.

Testo delle opzioni come nella lezione, con la notazione del lotto 5 per le parentesi rovesciate:
`S = \mathopen{]}2, 5]`, `S = [-3, 4]`, `S = \mathopen{]}-\infty, 4\mathclose{[}`, `S = \{2\}`,
`S = \emptyset`, `S = \mathbb{R}`, e per un'unione `S = \mathopen{]}-\infty, 1] \cup \mathopen{]}2, +\infty\mathclose{[}`.
`\mathopen{]}` e `\mathclose{[}` servono perché KaTeX tratta una `]` nuda come parentesi chiusa: la
attaccherebbe all'uguale e spazierebbe il meno che segue come una sottrazione (lo fa la lezione 52, e la 53
è stata convertita allo stesso modo). All'infinito la parentesi è sempre aperta; un solo numero si scrive
$\{2\}$ e mai $[2, 2]$.

Valori delle opzioni: un intervallo per stringa, `"]2,5]"`, `"[-3,4]"`, `"]-oo,4["`, `"{2}"`; $\mathbb{R}$ è
`"]-oo,+oo["`, $\emptyset$ è la lista vuota. Il controllo rilegge il testo di ogni opzione e lo confronta con
i valori.

## Costruzione all'indietro

Si sceglie prima la soluzione di ogni riga: un raggio ($x > e$, $x \le e$, con $e$ intero tra $-9$ e $9$) o,
al livello 5, "sempre vera" o "mai vera". Poi si scrive la riga: si sceglie il coefficiente della $x$ nella
forma normale $Ax \mathrel{op} B$ (negativo quando serve un cambio di verso), si distribuisce la $x$ fra i
due membri e la costante dell'altro membro si calcola perché la riga dia proprio quel raggio. Il verso
scritto è quello della soluzione, rovesciato se $A < 0$. Le righe con i denominatori si costruiscono per
tentativi: si scartano quelle in cui il numero del secondo membro non viene intero o supera 9.

Ogni riga sta nei `params` come lista di termini $k \cdot (ax + b) / d$ per membro (monomio con $k = 1$,
$d = 1$; parentesi $k(ax + b)$ con $|k| \ge 2$; frazione con $k = \pm 1$, $d > 1$) e verso. Il controllo
Python non usa i `params` per risolvere: rilegge il sistema dal LaTeX del testo, verifica che i `params`
dicano le stesse righe, risolve ogni riga con `solve_univariate_inequality` e interseca.

## Regole comuni

- Sistema scritto con `\begin{cases} … \\ … \end{cases}`; dopo una riga con frazioni il separatore è
  `\\[2mm]`, come nella lezione, altrimenti `\\`. La pagina lo mostra come una formula sola
  (`present.ts` non spezza `cases`) e `width.mts` lo misura intero.
- Doppia disequazione su una riga, con i versi $<$ o $\le$ (crescente, come nella lezione).
- Estremo di ogni riga intero, $|e| \le 9$; numeri scritti fino a 30.
- Nessun $1x$, $0x$, "$+ -$", "$- -$", termine nullo o $1(\dots)$ nel testo; frazioni ridotte, con il primo
  coefficiente del numeratore positivo (il segno va davanti alla frazione).
- Ai livelli 1, 2, 3 e 7 la soluzione è un intervallo con estremi diversi (limitato o no): i casi limite
  sono tutti al livello 4 e 5.
- Passaggi: una riga per disequazione, "Prima disequazione: $-3x \le 21 \Rightarrow x \ge -7$ (dividi per
  $-3$ e cambia il verso)", con la moltiplicazione per il MCM su una riga a parte al livello 3; poi le strisce
  comuni, la nota sull'estremo compreso in una sola riga, $S$. Al livello 6 il metodo dei tre membri
  dell'esempio 7. Niente ambienti con `\text{}` dentro (controllato con `steps-scan.mts`).

## Livello 1: disequazioni già risolte o quasi

Due righe da un passaggio: $x \mathrel{op} e$, $x + c \mathrel{op} d$, $kx \mathrel{op} d$ con $k$ da 2 a 6,
senza cambio di verso. Metà con lo stesso verso (soluzione un raggio), metà con versi opposti e intervallo
limitato. Due righe tutte e due già risolte ($x > -6$, $x < 5$) sono rare.

1. $\begin{cases} x - 3 \ge -6 \\ 2x \le 8 \end{cases}$: $x \ge -3$, $x \le 4$. $S = [-3, 4]$.
2. $\begin{cases} x + 4 \le 6 \\ x + 9 < 0 \end{cases}$: $x \le 2$, $x < -9$. $S = \mathopen{]}-\infty, -9\mathclose{[}$.

## Livello 2: un cambio di verso

Due disequazioni di primo grado $ax + b \mathrel{op} cx + d$ (o con il numero prima, $3 - 3x$, o con i membri
scambiati), almeno una con il coefficiente della forma normale negativo. Circa 4 su 10 hanno lo stesso
estremo, compreso in una riga ed escluso nell'altra, come l'esempio 2 e il suo avviso.

1. $\begin{cases} -2x + 3 \ge x - 9 \\ -3x - 2 > -14 \end{cases}$: $x \le 4$, $x < 4$. $S = \mathopen{]}-\infty, 4\mathclose{[}$.
2. $\begin{cases} 3 - 3x > 15 \\ -2x - 1 \le -3x - 4 \end{cases}$: $x < -4$, $x \le -3$. $S = \mathopen{]}-\infty, -4\mathclose{[}$.

## Livello 3: tre disequazioni, una con i denominatori

Una riga con denominatori numerici (da 2 a 6: $\frac{x + 4}{2} + \frac{x}{6} \le 6$,
$\frac{3x + 5}{2} > \frac{x - 5}{4}$, $-3x + \frac{3x + 1}{2} > 8$), una con le parentesi
($2(x - 2) \ge 3x - 3$, anche con $k$ negativo) e una del livello 2, in ordine casuale; tre estremi diversi.
Come nell'esempio 3, spesso una riga non restringe la soluzione.

1. $\begin{cases} 2(x - 2) \ge 3x - 3 \\ 5x + 4 < 9 \\ \dfrac{x + 4}{2} + \dfrac{x}{6} \le 6 \end{cases}$: $x \le -1$, $x < 1$, $x \le 6$. $S = \mathopen{]}-\infty, -1]$.
2. $\begin{cases} -2(x + 6) \le 2x + 16 \\ \dfrac{3x + 5}{2} > \dfrac{x - 5}{4} \\[2mm] -x - 3 < -4 \end{cases}$: $x \ge -7$, $x > -3$, $x > 1$. $S = \mathopen{]}1, +\infty\mathclose{[}$.

## Livello 4: impossibile, un punto, punto escluso

Due righe del livello 2, un quarto ciascuno (il controllo verifica le quote):

- impossibile: $x \le e$ (o $<$) e $x \ge e + g$ con $g$ da 1 a 4. $S = \emptyset$ (esempio 4);
- un punto: $x \ge e$ e $x \le e$. $S = \{e\}$ (esempio 5);
- punto escluso: le due righe si toccano in $e$, con almeno un pallino vuoto. $S = \emptyset$ (la variante
  dell'esempio 5);
- intervallo stretto: $x \ge e$ e $x \le e + g$, largo da 1 a 4, perché la risposta non sia sempre un caso
  limite.

1. $\begin{cases} -3x - 2 \ge 19 \\ 4x - 1 > 2x - 15 \end{cases}$: $x \le -7$, $x > -7$. $S = \emptyset$.
2. $\begin{cases} 3 - 4x \le -13 \\ -x + 8 \le -2x + 12 \end{cases}$: $x \ge 4$, $x \le 4$. $S = \{4\}$.

## Livello 5: una disequazione sempre vera o mai vera

Una riga diventa $0x \mathrel{op} B$: $k(x + m) \mathrel{op} kx + n$ o $x + m \mathrel{op} x + n$ (esempio 6),
l'altra è del livello 2. Metà sempre vera (la soluzione è quella dell'altra riga), metà mai vera
($S = \emptyset$). Anche $B = 0$ è ammesso: $0x > 0$ non è mai vera.

1. $\begin{cases} 2(x - 4) > 2x - 8 \\ -5x - 6 > -2x + 9 \end{cases}$: $0x > 0$ mai vera. $S = \emptyset$.
2. $\begin{cases} x - 1 \ge x - 8 \\ x + 4 < -2 \end{cases}$: $0x \ge -7$ sempre vera, $x < -6$. $S = \mathopen{]}-\infty, -6\mathclose{[}$.

## Livello 6: doppia disequazione con la $x$ solo al centro

$c_1 \mathrel{op_1} ax + b \mathrel{op_2} c_2$, con $|a|$ da 1 a 5, metà con $a < 0$ (il controllo verifica la
quota); con $a < 0$ il membro centrale è spesso scritto con il numero prima ($8 - 2x$), come nell'esempio 7.
Soluzione un intervallo limitato con estremi tra $-6$ e $7$, $|c_1|, |c_2| \le 30$. Passaggi con il metodo
dei tre membri; con $a < 0$ cambiano tutti e due i versi e la doppia disequazione si rilegge da destra.

1. $0 < 4x + 4 < 24$: $-4 < 4x < 20$, $-1 < x < 5$. $S = \mathopen{]}-1, 5\mathclose{[}$.
2. $-16 < -2x - 4 \le -4$: $-12 < -2x \le 0$, $6 > x \ge 0$. $S = [0, 6\mathclose{[}$.

## Livello 7: doppia disequazione con la $x$ in due membri

$px + q \mathrel{op_1} ax + b \mathrel{op_2} c$ (7 volte su 10) o $c \mathrel{op_1} ax + b \mathrel{op_2} px + q$,
da risolvere come sistema (esempio 8). Soluzione un intervallo, limitato o no.

1. $-3x - 13 \le 3x - 7 < 8$: $x \ge -1$, $x < 5$. $S = [-1, 5\mathclose{[}$.
2. $-5 < -2x + 1 < 3x + 1$: $x < 3$, $x > 0$. $S = \mathopen{]}0, 3\mathclose{[}$.

## Esercizi "brutti" da evitare

- estremi frazionari (la lezione lavora solo con estremi interi);
- due righe con lo stesso estremo e lo stesso pallino (una delle due è inutile) ai livelli 1 e 2;
- un intervallo ridotto a un punto scritto $[2, 2]$, o una parentesi chiusa all'infinito;
- $1x$, $0x$ nel testo, frazioni semplificabili, numeri oltre 30;
- ai livelli 1, 2, 3 e 7 sistemi impossibili o con un punto solo: sono il tema del livello 4.

## Variante a scelta multipla

Quattro opzioni distinte come insiemi, una giusta. Distrattori in quest'ordine, presi dagli avvisi della
lezione:

- l'unione delle soluzioni al posto dell'intersezione (avviso "Le condizioni unite da o"): spesso
  $\mathbb{R}$, o due raggi separati nei sistemi impossibili. Il controllo pretende che ci sia, quando è
  diversa dalla soluzione;
- il verso non cambiato dopo la divisione per un numero negativo (avviso "Disegnare le disequazioni prima
  di risolverle"); ai livelli 2 e 4 il controllo lo pretende;
- al livello 6 con $a < 0$: cambiato solo il primo verso (avviso "Cambiare il verso di un solo segno",
  $1 \ge x < -2$ letto come $x < -2$) e le parentesi lasciate dove stavano ($[-2, 1\mathclose{[}$ invece di
  $\mathopen{]}-2, 1]$). Il controllo pretende il secondo quando le due parentesi sono diverse;
- tutti gli estremi presi come compresi: nel punto escluso del livello 4 dà $\{e\}$, che il controllo
  pretende; per un punto, il sistema preso per impossibile ($\emptyset$, anche questo preteso);
- un estremo della soluzione con la parentesi sbagliata (avviso "L'estremo compreso in una sola
  disequazione");
- al livello 5 la riga sempre vera letta come mai vera ($\emptyset$) e viceversa ($\mathbb{R}$ o la sola
  altra riga);
- la soluzione di una riga sola (avviso "Fermarsi alle soluzioni delle singole disequazioni");
- per un sistema impossibile, $S = \{0\}$ (avviso "Scrivere la soluzione come intervallo");
- se non bastano: tutte e due le parentesi cambiate, un estremo spostato di 1 o 2, $\mathbb{R}$, $\emptyset$.

Un'opzione non è mai un'unione di più di due pezzi.

## Figure

Il livello 4 vorrebbe il grafico del sistema (le righe con i pallini pieni e vuoti), che è lo strumento
della lezione per decidere gli estremi. Oggi non c'è modo di generarlo nel sito; gli esercizi si reggono
sul testo e i passaggi descrivono a parole le strisce comuni.

## Verifica

- `sample.mts sistemi-di-disequazioni 1000 all 1` e `... 7001`, passati a `verify.py`: PASS con tutti e due i
  seed (7.000 esercizi ciascuno). Quote con il seed 1: livello 1 stesso verso 499, versi opposti 501;
  livello 2 stesso estremo 422; livello 4 impossibile 249, un punto 267, punto escluso 249, intervallo 235;
  livello 5 sempre vera 528, mai vera 472; livello 6 coefficiente negativo 502.
- Esercizi diversi su 1.000 (seed 1): livello 1 998, livello 2 1.000, livello 3 1.000, livello 4 1.000,
  livello 5 1.000, livello 6 987, livello 7 999. Con il seed 7001: 999, 1.000, 1.000, 1.000, 1.000, 986, 1.000.
- `width.mts sistemi-di-disequazioni`: esce con 0; problema più largo 214 px (livello 7; il `cases` a tre
  righe con le frazioni del livello 3 misura 205 px), opzione più larga 184 px (livello 4, un'unione di due
  raggi).
- `steps-scan.mts`: nessun errore. `review.mts` esce con 0; `tsc` ed `eslint` senza errori nel generatore.
- Errori piantati a mano, tutti bocciati dal controllo: indice dell'opzione giusta spostato (anche in un
  file passato a `verify.py`, che dà FAIL); testo dell'opzione giusta con una parentesi diversa dai valori;
  una costante del testo cambiata (i `params` non corrispondono più e la soluzione cambia); l'unione tolta
  dalle opzioni; il punto $\{e\}$ tolto dalle opzioni di un punto escluso; una parentesi chiusa
  all'infinito; un punto scritto $[4, 4]$; il caso sbagliato nei `params` al livello 5; il distrattore delle
  parentesi lasciate al loro posto tolto al livello 6; il separatore `\\[2mm]` tolto dopo una riga con
  frazioni; un esercizio del livello 3 marcato livello 1; una doppia disequazione del livello 6 marcata
  livello 7; l'ultimo passaggio cambiato in $S = \emptyset$; due opzioni uguali.

## Domande per la revisione

- Al livello 4 la risposta è spesso $\emptyset$ (metà dei casi: impossibile e punto escluso). Va bene così,
  o il punto escluso va tolto e lasciato come distrattore del caso "un punto"?
- La forma normale dei passaggi mette sempre la $x$ a primo membro: da $-14 < x - 8$ si passa a $-x < 6$ e
  poi a $x > -6$, come fa l'esempio 8 con $-x < 4$. Uno studente scriverebbe subito $x > -6$: va bene lo
  stesso, o in questi casi conviene portare la $x$ dal lato in cui resta positiva?
- L'unione come distrattore è quasi sempre $S = \mathbb{R}$ (due raggi opposti che si sovrappongono), un po'
  facile da scartare. La tengo perché è l'errore dell'avviso sulle condizioni unite da "o", o è meglio
  lasciarla solo quando non è $\mathbb{R}$?
- Nessun problema a parole: la nota della lezione ne propone uno ("un numero intero tale che…") come nono
  esempio, che la lezione oggi non ha. Se l'esempio arriva, diventa un livello 8.
