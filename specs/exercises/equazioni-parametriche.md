# Equazioni parametriche

Generatore: `equazioni-parametriche` (`src/lib/exercises/v2/generators/equazioni-parametriche.ts`).
Verifica indipendente: `scripts/exercises/checkers/equazioni_parametriche.py`. Lezione collegata:
`docs/lezioni/riscritte/78-equazioni-parametriche.md` (nota in `docs/lezioni/note/78-equazioni-parametriche.md`,
sezione "Per il generatore").

Sei livelli, gli stessi sei della nota e nello stesso ordine della lezione: il caso $a = 0$ (esempio 1), il
numero delle soluzioni con il discriminante di primo grado in $k$ (esempio 2), una soluzione assegnata
(esempio 3), soluzioni opposte, reciproche o una nulla (esempi 4, 5 e 7), somma o prodotto assegnati
(esempio 6), somma dei quadrati (esempio 8). L'esempio 9 (discriminante che è un quadrato) non ha un
livello: vedi le domande in fondo.

## Forma dell'equazione

Sempre $a x^2 + b x + c = 0$ con $a$, $b$, $c$ polinomi di primo grado (o costanti) in $k$ a coefficienti
interi, ognuno fino a 12 in valore assoluto. Il parametro si chiama $k$, come nella lezione. Si scrive come
nella lezione: un coefficiente binomio tra parentesi davanti alla potenza di $x$ (`(k - 1)x^2`), con il
meno fuori se il primo termine è negativo (`-(2k - 6)x`, come `-(k + 1)x` dell'esempio 9); un monomio
senza parentesi (`-2kx`, `kx^2`); il termine noto sviluppato, senza parentesi (`+ k + 3`). Il termine
noto non è mai nullo. Mai `1x`, `1k`, `+ -`, termini nulli.

`params.a`, `params.b`, `params.c` sono le coppie `[termine costante, coefficiente di k]`; poi
`params.case` e i dati del livello (`x1`, `given`, `values`, `roots`, `h`, `excluded`).

Il testo dei livelli 3, 5 e 6 ha due righe in un `\begin{gathered}`: l'equazione e il dato
(`x_1 = -1`, `x_1 + x_2 = 4`, `x_1 \cdot x_2 = -2`, `x_1^2 + x_2^2 = 5`). La pagina mostra la prima come
formula e la seconda come dato. La consegna (testo semplice) dice cosa chiedere.

## Forma della risposta

Tutte le risposte sono `choice`, a quattro opzioni, e `toChoice()` restituisce la risposta stessa. Il
motivo, livello per livello: ai livelli 1, 2 (coincidenti) e 3 la risposta è una coppia ($k$ e una
soluzione), e nessun tipo ha due campi; al livello 2 (distinte) è una condizione su $k$ con un valore
escluso; ai livelli 4-6 è l'insieme dei valori accettabili di $k$, che può essere vuoto ("nessun valore di
$k$"), e il tipo `number` non ha modo di dirlo.

I `values` delle opzioni, che il controllo rilegge:

- coppia: `["k=3/2", "x=3"]`, scritta `k = \frac{3}{2},\ x = 3` (livello 1),
  `k = \frac{3}{2},\ x_1 = x_2 = 3` (livello 2), `k = -\frac{1}{2},\ x_2 = \frac{5}{3}` (livello 3);
- condizione: `["<3/2", "!=1"]`, scritta `k < \frac{3}{2},\ k \neq 1`; relazioni `<`, `>`, `<=`, `>=`
  (`\leq`, `\geq`). L'esclusione $k \neq r$ si scrive solo se $r$ sta nella regione, così due opzioni non
  indicano mai lo stesso insieme con parole diverse;
- valori: `["k=1"]`, `["k=1", "k=7"]` (in ordine crescente, scritti `k = 1,\ k = 7`), `["none"]` scritto
  `\text{nessun valore di } k`.

La soluzione (`solution`) è su una riga, senza ambienti: la stessa scrittura dell'opzione giusta.

## Livello 1: il caso a = 0

Consegna: "Trova il valore di k per cui l'equazione è di primo grado e risolvila." Risposta: la coppia
$k = r$, $x = x_0$.

Costruzione: $a = a_1(k - r)$ con $a_1$ = 1 (3 casi su 4) o 2 e $r$ da -6 a 6 (lo zero dà $kx^2$, come
nell'esempio 9); si scelgono $B = b(r)$ da -6 a 6 non nullo e la soluzione $x_0$ (intera da -6 a 6 non
nulla, o con denominatore $|B|$ in un caso su quattro), da cui $C = c(r) = -Bx_0$; poi i coefficienti di
$k$ in $b$ e in $c$ (da -3 a 3, non entrambi nulli) e i termini costanti di conseguenza. Per $k = r$
l'equazione è sempre di primo grado ($b(r) \neq 0$): il caso $0x = c$ della lezione non esce.

1. $(k - 2)x^2 + (k + 4)x + 2k - 1 = 0$: $a = 0$ per $k = 2$, resta $6x + 3 = 0$, $x = -\frac{1}{2}$.
2. $(2k + 4)x^2 - (k + 7)x + 2k = 0$: $k = -2$, resta $-5x - 4 = 0$, $x = -\frac{4}{5}$.

## Livello 2: soluzioni distinte o coincidenti

Costruzione: $a = k - r$ ($r$ da -5 a 5), $b = \pm 2k + b_0$ ($b_0$ nullo in due casi su tre, come
$-2k$ dell'esempio 2, altrimenti da -6 a 6), $c = k + c_0$ ($c_0$ da -9 a 9). Con questi coefficienti i
termini in $k^2$ del discriminante si cancellano, come nella lezione: $\Delta$ è di primo grado in $k$,
con radice $h$ intera o con denominatore 2, $h \neq r$. Con $b$ pari i passaggi usano $\frac{\Delta}{4}$
(formula ridotta), altrimenti $\Delta$.

Metà dei casi, consegna "Per quali valori di k l'equazione ha due soluzioni reali distinte?": la risposta
è la regione $\Delta > 0$ senza $k = r$, e $r$ sta sempre nella regione (è la difficoltà dell'esempio 2).
L'altra metà, "Per quale valore di k l'equazione ha due soluzioni coincidenti? Trova anche la soluzione
doppia.": la coppia $k = h$, $x_1 = x_2 = -\frac{b}{2a}$, con la soluzione doppia intera o con
denominatore fino a 3.

1. $(k - 4)x^2 + (2k - 4)x + k - 1 = 0$: $\frac{\Delta}{4} = (k - 2)^2 - (k - 4)(k - 1) = k$; distinte per
   $k > 0,\ k \neq 4$.
2. $(k - 3)x^2 + 2kx + k - 6 = 0$: $\frac{\Delta}{4} = k^2 - (k^2 - 9k + 18) = 9k - 18$; coincidenti per
   $k = 2$, con $x_1 = x_2 = 2$.

## Livello 3: una soluzione assegnata

Consegna: "Trova il valore di k per cui il numero dato è una soluzione dell'equazione, e trova l'altra
soluzione." Dato: $x_1$ intero tra -3 e 3, non nullo, con -1 più frequente (l'esempio 3 e il riquadro sul
quadrato di un numero negativo). Risposta: la coppia $k$, $x_2$.

Costruzione: $a = a_1k + a_0$ ($a_1$ = 1 o 2), $b$ e $c$ con coefficienti di $k$ da -3 a 3 (non entrambi
nulli); sostituendo $x_1$ si ottiene un'equazione di primo grado in $k$, e si tengono le equazioni in cui
$k$ è intero o con denominatore fino a 3 (numeratore fino a 12), $a(k) \neq 0$ e l'altra soluzione
$x_2 = \frac{c}{a} : x_1$ ha denominatore fino a 5 e numeratore fino a 12, diversa da $x_1$. I passaggi
seguono l'esempio 3: sostituzione, $k$, controllo di $a$ (il discriminante non serve), prodotto
$\frac{c}{a}$, divisione per $x_1$.

1. $(k + 1)x^2 - (k - 3)x - 3k + 9 = 0$ con $x_1 = 3$: $k = -9$, $x_2 = -\frac{3}{2}$.
2. $(2k + 3)x^2 + (k - 3)x + k - 4 = 0$ con $x_1 = -3$: $k = -2$, $x_2 = -2$.

## Livello 4: soluzioni opposte, reciproche, una nulla

Consegne: "Trova k in modo che le soluzioni siano opposte." ($b = 0$), "... siano reciproche." ($c = a$),
"... una soluzione sia nulla." ($c = 0$). Risposta: il valore di $k$ o "nessun valore di $k$".

Costruzione: $a = a_1k + a_0$ ($a_1$ = 1 o 2, $a_0$ da -6 a 6), $b$ e $c$ con coefficiente di $k$ da -3 a
3; si risolve la relazione della tabella della lezione e si controlla il valore come nel riquadro
"Il controllo di ogni valore". Casi, con le quote verificate: opposte accettato (circa 20%), opposte
scartato perché $\Delta < 0$ (15%), reciproche accettato (20%), reciproche scartato (15%), reciproche
impossibile, $c = a$ falsa per ogni $k$ come nell'esempio 5 (10%), una nulla (20%, sempre accettato:
$a \neq 0$, e il discriminante non serve). Il valore di $k$ è intero o con denominatore fino a 3; mai
$\Delta = 0$ nel valore trovato, e mai il valore che annulla $a$.

1. $(k - 5)x^2 - (k + 8)x + k = 0$, opposte: $b = 0$ per $k = -8$, ma $\Delta = -4 \cdot (-13) \cdot (-8) < 0$:
   nessun valore.
2. $(2k - 3)x^2 - (2k + 2)x + 2k + 4 = 0$, reciproche: $2k + 4 = 2k - 3$ è falsa: nessun valore.

## Livello 5: somma o prodotto assegnati

Consegne: "Trova k in modo che la somma delle soluzioni sia quella indicata." e "... il prodotto delle
soluzioni sia quello indicato."; il dato è un intero da -6 a 6, non nullo. Risposta: il valore o "nessun
valore di $k$".

Costruzione: come al livello 4 ($a$ dipende sempre da $k$); l'equazione $-\frac{b}{a} = s$ (o
$\frac{c}{a} = p$) è fratta in $k$, con C.E. $a \neq 0$, e ha una sola soluzione, intera o con
denominatore fino a 3, diversa dal valore che annulla $a$. Poi il controllo di $\Delta$ (mai nullo).
Quote: somma accettata 30%, somma scartata 20%, prodotto accettato 30%, prodotto scartato 20%.

1. $(k - 6)x^2 - (3k - 2)x + 3k - 9 = 0$, $x_1 + x_2 = 1$: $\frac{3k - 2}{k - 6} = 1$ dà $k = -2$, ma
   $\Delta = 64 - 480 < 0$: nessun valore (il riquadro "Fermarsi al valore di k").
2. $(k - 1)x^2 - (2k + 3)x + k + 7 = 0$, $x_1 \cdot x_2 = -3$: $\frac{k + 7}{k - 1} = -3$ dà $k = -1$,
   $\Delta = 49 > 0$: accettabile.

## Livello 6: somma dei quadrati

Consegna: "Trova k in modo che la somma dei quadrati delle soluzioni sia quella indicata." Dato:
$x_1^2 + x_2^2 = t$ con $t$ da 1 a 40. Risposta: i valori accettabili (uno, due o nessuno).

Costruzione all'indietro, come l'esempio 8: $a = 1$, $b = \pm k + b_0$, $c = c_1k + c_0$. Si scelgono
due valori interi distinti $k_1 < k_2$ (da -6 a 9, con somma pari), poi $c_1$ e $b_0$ in modo che
$s^2 - 2p - t = (k - k_1)(k - k_2)$, e $c_0$; $t$ ne segue. Poi il controllo di $\Delta$ per i due valori
(mai nullo). Quote: uno scartato 65% (il caso della lezione), due accettati 25%, nessuno 10%.

1. $x^2 - (k + 4)x + 3k + 5 = 0$, $x_1^2 + x_2^2 = 30$: $k^2 + 2k - 24 = 0$, $k = -6$ ($\Delta = 56$) o
   $k = 4$ ($\Delta = -4$, si scarta): $k = -6$.
2. $x^2 - (k - 6)x - 2k + 6 = 0$, $x_1^2 + x_2^2 = 9$: $k = 3$ e $k = 5$, entrambi accettabili.

## Da evitare

- Un discriminante di secondo grado in $k$ al livello 2: la disequazione di secondo grado non è ancora
  stata studiata (la lezione lo dice). Il controllo chiede $\Delta$ di primo grado.
- Al livello 2 distinte, un valore che annulla $a$ fuori dalla regione: non ci sarebbe niente da togliere.
- $\Delta = 0$ nei valori da controllare dei livelli 4-6: la lezione accetta $\Delta \geq 0$, ma con
  $\Delta = 0$ "soluzioni opposte" e "reciproche" diventano casi limite ($b = c = 0$, radice doppia $\pm 1$)
  che la lezione non discute.
- Il caso "una soluzione nulla" con il valore che annulla anche $a$: la lezione dice di scartarlo, ma
  l'equazione di primo grado che resta ha comunque la soluzione 0. Non esce.
- Valori di $k$ o soluzioni con denominatori grandi; coefficienti oltre 12.

## Distrattori

Dai riquadri `ad-warning` e `ad-tip` della lezione.

- Livello 1: il valore di $k$ con il segno sbagliato (da $k - r = 0$ si scrive $k = -r$, con la soluzione
  che ne segue); la soluzione con il segno sbagliato ($x = \frac{c}{b}$); la frazione capovolta
  ($x = -\frac{b}{c}$); il termine noto preso senza la parte in $k$ (la lezione: "il termine noto è tutto
  quello che non contiene la $x$"); poi soluzioni vicine.
- Livello 2 distinte: senza togliere $k = r$ (il caso $a = 0$ dimenticato); con $\leq$ (soluzioni reali,
  non distinte); la regione opposta; il discriminante sviluppato con il meno solo sul primo termine del
  prodotto (riquadro "Il meno davanti al prodotto"). Coincidenti: soluzione doppia con il segno sbagliato,
  $-\frac{b}{a}$ senza il 2, lo stesso errore del meno, $k$ con il segno sbagliato.
- Livello 3: $(-1)^2$ preso come $-1$ e il meno di $-2kx$ perso nella sostituzione (riquadro "Il quadrato
  di un numero negativo"; solo quando $x_1 < 0$), con l'altra soluzione che ne segue; $x_2$ con il segno
  sbagliato; $x_2$ dalla somma con $-\frac{b}{a}$ scritto $\frac{b}{a}$; il prodotto $\frac{c}{a}$ senza
  dividere per $x_1$.
- Livello 4: il valore trovato senza il controllo di $\Delta$ (riquadro "Opposte non vuol dire soltanto
  b = 0"); "nessun valore" quando il valore è buono; la relazione di un'altra riga della tabella
  ($c = 0$ o $c = a$ per le opposte; $c = -a$, $c = 0$, $b = 0$ per le reciproche; $b = 0$, $c = a$ o
  $a = 0$ per la soluzione nulla); il valore con il segno sbagliato.
- Livello 5: il valore senza controllo (riquadro "Fermarsi al valore di k"); "nessun valore";
  $-\frac{b}{a}$ scritto $\frac{b}{a}$; il denominatore dimenticato ($-b = s$, $c = p$); la formula
  dell'altra relazione ($\frac{c}{a} = s$, $-\frac{b}{a} = p$, $-\frac{c}{a} = p$).
- Livello 6: i due valori senza controllo; il valore scartato da solo; il quadrato della somma al posto
  della somma dei quadrati, $s^2 = t$ (riquadro "La somma dei quadrati non è il quadrato della somma"),
  quando $t$ è un quadrato; $s^2 + 2p = t$, quando dà valori razionali; "nessun valore".

Ogni opzione diversa dalla risposta è sbagliata per costruzione (il controllo lo verifica: esattamente
un'opzione coincide con la verità calcolata da SymPy, e nessuna coppia di opzioni indica lo stesso
insieme).

## Verifica

Il controllo Python ricostruisce l'equazione dai `params` e dal testo (che rilegge da LaTeX) e ricalcola
tutto dalle definizioni, senza il procedimento del generatore: livello 1 con `solve` su $a = 0$ e
sull'equazione di primo grado che resta; livello 2 con `solveset(Δ > 0)` meno lo zero di $a$, oppure
`solveset(Δ = 0)` e le radici dell'equazione (una doppia); livello 3 sostituendo $x_1$ e risolvendo in
$k$, poi le radici dell'equazione; livelli 4-6 risolvendo in $k$ la relazione (con `together` per le
fratte), togliendo gli zeri di $a$ e i valori con $\Delta < 0$, e controllando che le radici vere
dell'equazione (con `roots`) abbiano davvero la proprietà chiesta (somma zero, prodotto 1, una radice
nulla, somma, prodotto, somma dei quadrati). Poi rilegge ogni opzione dal suo LaTeX e la confronta con i
`values`, controlla consegna, dato, quote dei casi, limiti dei coefficienti e forme vietate.

Esito, 1.000 esercizi per livello: PASS con il seed di partenza 1 e con 7001.

Esercizi diversi (testi diversi) su 1.000: livello 1: 998; livello 2: 260 (seed 7001: 273); livello 3:
998; livello 4: 998; livello 5: 1.000; livello 6: 872. Il livello 2 è il più stretto perché la condizione
"i termini in $k^2$ si cancellano" fissa $a$ e $c$ a coefficiente 1 in $k$ e $b$ a $\pm 2k + b_0$, come
nella lezione.

Errori piantati a mano (`g78-plant.py` nello scratchpad), tutti bocciati: opzione giusta spostata su
un'altra (un campione per ogni livello e ogni caso, 17 in tutto); risposta del livello 1 cambiata in
values e LaTeX insieme; esclusione $k \neq r$ tolta dall'opzione giusta del livello 2; LaTeX di
un'opzione diverso dai suoi values; opzione doppia; testo diverso dai `params`; dato del livello 5
cambiato nel testo; `1x^2` nel testo; caso sbagliato in `params.case`; coefficiente 15; al livello 6 i due
valori non controllati segnati come giusti; $x_1$ dei `params` diverso da quello del testo; un ambiente
nella soluzione; consegna di un'altra condizione; risposta non `choice`.

Larghezza (`width.mts`): nessuna formula oltre i limiti. Massimi: problema 320 px (livello 1), 277, 299,
299, 299, 219 px su 350; opzioni 130, 190, 152, 140, 140, 140 px su 252.

## Figure

Nessun livello ne ha bisogno: tutto si regge sul testo.

## Domande per la revisione

- Tutte le risposte sono a scelta multipla. Per una risposta aperta servirebbero tipi nuovi: una coppia
  ($k$ e una soluzione), una condizione su $k$ con un valore escluso, un insieme di valori che può essere
  vuoto.
- Livello 2: la domanda "per quali k le soluzioni sono reali" non c'è, perché con $k = r$ l'equazione di
  primo grado ha una soluzione e la nota lascia aperto se contarla (dubbio da verificare con il libro in
  uso). Esce solo "distinte" (con $k \neq r$) o "coincidenti".
- Livelli 4-5: i valori di $k$ possono avere denominatore 2 o 3, e allora il controllo di $\Delta$ passa per
  frazioni ($\Delta = \frac{196}{3}$). La lezione ha un esempio così ($k = -\frac{1}{3}$); se Andrea
  preferisce, si possono tenere solo valori interi.
- L'esempio 9 (discriminante che è il quadrato di un binomio, soluzioni reali per ogni $k$) e il caso
  $0x = c$ del livello 1 non hanno esercizi: si possono aggiungere come livello 7 o come casi del livello 1.
- Livello 4: la condizione "una soluzione nulla" non ha mai la risposta "nessun valore" (vedi "Da
  evitare"). Va bene così, o si vuole il caso in cui $c = 0$ annulla anche $a$?
