# Fasci di rette

Generatore: `retta-fasci` (`src/lib/exercises/v2/generators/retta-fasci.ts`).
Verifica indipendente: `scripts/exercises/checkers/retta_fasci.py`. Lezione collegata:
`docs/lezioni/riscritte/86-retta-fasci.md` (nota in `docs/lezioni/note/86-retta-fasci.md`, sezione "Per il
generatore").

Sette livelli nell'ordine della lezione. I sei della nota, con il terzo diviso in due (il centro, poi la retta
esclusa), perché sono due domande diverse sullo stesso fascio: fascio proprio con $m$, fascio improprio, centro
di un fascio con $k$, retta esclusa, fascio improprio con $k$, retta del fascio per un punto, retta del fascio
parallela o perpendicolare.

## Forma della risposta

- Livelli 1 e 2: la retta in forma esplicita, `expression` con `value` il secondo membro in SymPy
  (`2*x - 3`, `-1/2*x - 5`) e `latex` l'equazione intera (`y = 2x - 3`), come nella lezione (esempi 1 e 2).
  Variante a scelta multipla fra quattro rette esplicite. Quando la risposta è una retta verticale
  (livello 1 con $A$ sulla verticale di $C$, livello 2 con $r$ verticale) la risposta è una `choice`.
- Livello 3: `choice` fra quattro punti, scritti `(2, 1)` o `\left(\frac{4}{3}, 0\right)`, `values` le due
  coordinate.
- Livelli 4, 6, 7: `choice` fra quattro rette in forma implicita come la lezione scrive i risultati:
  `2x - y - 3 = 0` con coefficienti interi primi fra loro e il primo positivo, le rette parallele agli assi
  come `x = 2` e `y = 1`. Fra le opzioni possono esserci `\text{nessuna retta}` e
  `\text{tutte le rette del fascio}`.
- Livello 5: `number` (il valore di $k$), con la variante fra quattro numeri.

Ogni retta viaggia in `values` come terna normalizzata `"a,b,c"` di $ax + by + c = 0$ (interi primi fra loro,
primo coefficiente non nullo fra $a$ e $b$ positivo): il controllo confronta rette, non stringhe, quindi una
retta moltiplicata per 2 è la stessa retta e non può essere un distrattore. Le opzioni speciali hanno
`values` `["nessuna"]` e `["tutte"]`.

## Rappresentazione (`params`)

- `case`: il caso del livello (vedi sotto).
- Livelli 1, 2: `C`, `A` oppure `d` (la retta $r$ data, come terna), `P`, e `m`.
- Livelli 3-7: `r` e `s`, le generatrici come terne (il fascio è $r + k s = 0$), `C` il centro; al livello 5
  `k`; al livello 6 `A` e, se esiste, `k`; al livello 7 `d`, `relation` (`parallela` o `perpendicolare`) e,
  se esiste, `k`.

## Costruzione all'indietro

- Livello 1: si sceglie il centro $C$ (interi da $-5$ a $5$), poi il coefficiente angolare fra quelli piccoli
  della lezione ($\pm 1, \pm 2, \pm 3, \pm\frac{1}{2}, \pm\frac{3}{2}, \pm\frac{1}{3}, \pm\frac{2}{3}$, e $0$
  una volta su dodici) e uno spostamento $\Delta x$ multiplo del denominatore di $m$, così $A$ è intero (fino
  a 8). Una volta su sette $A$ ha la stessa ascissa di $C$.
- Livello 2: si sceglie $m$ fra gli stessi valori e $P$ intero; $r$ ha quel coefficiente angolare ed è scritta
  in forma implicita (55 %), esplicita (30 %), oppure è verticale $x = h$ (15 %). $P$ non sta su $r$.
- Livelli 3-7 (fascio proprio): si sceglie il centro $C$ (interi da $-4$ a $4$, non l'origine), poi le
  direzioni delle due generatrici $(a, b)$ con coefficienti da $-3$ a $3$ primi fra loro, non parallele; il
  termine noto si calcola perché passino per $C$ (al più 9 in valore assoluto). Una volta su quattro (livelli 3
  e 4) una generatrice o tutte e due sono parallele a un asse, come nell'esempio 4. $s$ ha il primo coefficiente
  positivo, $r$ tre volte su quattro. Il fascio si scrive svolgendo $r + k s$ e raccogliendo i coefficienti di
  $x$ e di $y$: `(1 + k)x + (1 - k)y - 3 - k = 0`, `-(2 + k)y`, `kx`, come nell'esempio 3.
- Livello 5: si sceglie una direzione $(a, b)$; le generatrici sono $t(a, b)$ e $(a, b)$ con $t \in \{1, 2, 3\}$
  (in un ordine o nell'altro), una volta su quattro $r$ cambiata di segno, termini noti da $-6$ a $6$ purché
  le rette siano distinte. Il valore cercato è $k = -t$ oppure $k = -\frac{1}{t}$ (o gli opposti, con $r$
  cambiata di segno).
- Livello 6: tre volte su quattro $A$ è un punto intero (fino a 7) che non sta su $r$ (sarebbe $k = 0$) né su
  $s$, e $k$ ha denominatore fino a 6; una volta su quattro $A$ sta sulla retta esclusa ($A = C + t(-b', a')$).
- Livello 7: il caso si sceglie prima: parallela (35 %), perpendicolare (35 %), retta esclusa (15 %), retta
  verticale (15 %). Per le prime due si sceglie il coefficiente angolare della risposta (o quello di $d$) fra i
  valori della lezione; per la retta esclusa $d$ ha il coefficiente angolare di $s$ (parallela) o il suo
  antireciproco (perpendicolare); per la verticale $d$ è orizzontale (perpendicolare) o verticale (parallela).
  $d$ non passa per il centro ed è scritta in forma implicita (60 %) o esplicita; $k$ non è zero e ha
  denominatore fino a 9.

## Livello 1: fascio proprio, la retta per un punto

"Scrivi il fascio proprio di centro C e trova la retta del fascio che passa per A." Problema:
`C(2, 1) \quad A(4, 5)`. Casi: `obliqua` (85 %), `verticale` (15 %).

- $C(2, 3)$, $A(3, 5)$: $5 - 3 = m(3 - 2)$, $m = 2$, $y = 2x - 1$.
- $C(-5, 5)$, $A(-5, 8)$: $3 = m \cdot 0$, impossibile; la risposta è $x = -5$.

## Livello 2: fascio improprio, la parallela per un punto

"Trova la retta parallela a r che passa per P." Problema: `r: x - 2y + 4 = 0 \quad P(-2, 3)`. Casi:
`implicita`, `esplicita`, `verticale`.

- $r: 3x - y + 1 = 0$, $P(0, -5)$: $y = 3x + 1$, il fascio è $y = 3x + q$, $q = -5$, $y = 3x - 5$.
- $r: x = 3$, $P(-5, 5)$: la parallela è $x = -5$.

## Livello 3: il centro di un fascio con k

"Trova il centro del fascio." Casi: `assi` (una generatrice parallela a un asse, 25 %), `obliqui`.

- $3x + (k - 1)y - 4 - 2k = 0$: $3x - y - 4 + k(y - 2) = 0$, centro $(2, 2)$.
- $(2 + k)x + y + 6 + k = 0$: $2x + y + 6 + k(x + 1) = 0$, centro $(-1, -4)$.

## Livello 4: la retta esclusa

"Trova la retta esclusa dal fascio." Stessi fasci del livello 3.

- $3x + (k - 1)y - 4 - 2k = 0$: la retta esclusa è $y = 2$.
- $(1 + k)x + (1 - k)y - 3 - k = 0$: la retta esclusa è $x - y - 1 = 0$.

## Livello 5: fascio improprio con k

"Il fascio è improprio. Trova il valore di k per cui l'equazione non rappresenta una retta."

- $(k - 1)x + (2k - 2)y - 5 - 4k = 0$: generatrici $-x - 2y - 5 = 0$ e $x + 2y - 4 = 0$, $k = 1$ ($-9 = 0$).
- $(2 + 2k)x + (1 + k)y + k - 3 = 0$ (esempio 5): $k = -1$.

## Livello 6: la retta del fascio per un punto

"Trova la retta del fascio che passa per A." Problema su due righe (`gathered`): il fascio, poi `A(4, 5)`.
Casi: `punto` (75 %), `esclusa` (25 %).

- $(1 + 2k)x + (2 + k)y - 4 + 4k = 0$, $A(-3, 2)$: $-3 + 0 \cdot k = 0$, impossibile; $A$ sta sulla retta
  esclusa, che è la risposta: $2x + y + 4 = 0$.
- Esempio 6 della lezione: $A(4, 5)$, $6 - 2k = 0$, $k = 3$, $2x - y - 3 = 0$.

## Livello 7: parallela o perpendicolare nel fascio

"Trova la retta del fascio parallela (perpendicolare) alla retta d." Problema su due righe: il fascio, poi
`d: 3x + y - 1 = 0`. Il metodo è quello della lezione: $m = -\frac{a}{b}$ in funzione di $k$, con il valore che
annulla $b$ escluso.

- $(2k - 3)x + (1 + 3k)y + 9 + 5k = 0$, $d: y = \frac{1}{3}x + 2$, perpendicolare: $m = -3$, $k = -\frac{6}{7}$,
  $3x + y - 3 = 0$.
- $(k - 3)x - (1 + 2k)y - 8 - 2k = 0$, $d: 2x + y + 1 = 0$, perpendicolare: l'equazione in $k$ è impossibile;
  la retta esclusa $x - 2y - 2 = 0$ ha $m = \frac{1}{2}$ ed è la risposta.
- $(3 + k)x + (2 - 2k)y - 4 - 4k = 0$, $d: x = 3$, parallela: si annulla il coefficiente di $y$, $k = 1$,
  $x = 2$.

## Da evitare

- Coefficienti con `1x`, `0x`, `+ -`, `- -`, termini nulli.
- $A$ sul centro, o su $r$ al livello 6 (la risposta sarebbe $r$ con $k = 0$); $P$ su $r$ al livello 2; $d$
  per il centro al livello 7 (la parallela sarebbe $d$ stessa).
- Generatrici coincidenti al livello 5 (l'equazione sarebbe $0 = 0$ per quel $k$).
- Ambienti (`aligned`, `gathered`) nella soluzione e nei passaggi: il sistema del livello 3 è un `cases` senza
  testo dentro.

## Distrattori

- Livello 1: $m = \frac{\Delta x}{\Delta y}$ (il rapporto capovolto); il segno sbagliato svolgendo
  $y - y_0 = m(x - x_0)$ ($q = y_0 + m x_0$); $-m$; $y = mx$ ($q$ dimenticato). Nel caso verticale:
  "nessuna retta" (il riquadro "Dimenticare la retta verticale"), $y = y_0$, $y = y_A$.
- Livello 2: la perpendicolare ($-\frac{1}{m}$); $m = \frac{a}{b}$ (il segno perso leggendo la forma
  implicita); $m = -\frac{b}{a}$ ($a$ e $b$ scambiati); $q = y_P + m x_P$; $r$ stessa ($P$ non usato). Nel caso
  verticale: $y = y_P$, $r$ stessa, $x = y_P$ (coordinate scambiate).
- Livello 3: le coordinate scambiate; il centro calcolato con $s$ senza termine noto (il riquadro "Il termine
  noto nel raccoglimento"); le coordinate cambiate di segno; il centro con il termine noto di $s$ col segno
  sbagliato.
- Livello 4: $r$ (la generatrice che si ottiene con $k = 0$); $s$ senza termine noto; la verticale per $C$ (la
  retta esclusa del fascio $y - y_0 = m(x - x_0)$, confusa con quella di questo fascio); $s$ con il termine
  noto cambiato di segno; l'orizzontale per $C$.
- Livello 5: $-k$; il valore che annulla il termine noto; $0$; $\frac{1}{k}$.
- Livello 6: la retta con $k$ cambiato di segno; la retta trovata con $x$ e $y$ di $A$ scambiati; $r$; $s$. Nel
  caso della retta esclusa: "nessuna retta" (il riquadro "Equazione in k impossibile, retta che esiste"), $r$,
  "tutte le rette del fascio" (il caso del centro).
- Livello 7: parallela e perpendicolare scambiate; la perpendicolare con $-m$ invece di $-\frac{1}{m}$ o con
  $\frac{1}{m}$; la parallela con $-m$; $r$; $s$. Nei casi della retta esclusa e della verticale: "nessuna
  retta" (i riquadri "Equazione in k impossibile" e "Dividere per un'espressione che si annulla").

Tutti i distrattori che sono rette si confrontano come rette normalizzate, e ognuno deve essere diverso dalla
risposta: un distrattore che coincide con la risposta viene scartato e sostituito dal successivo (poi da rette
per $C$ o per $P$ con coefficiente angolare vicino).

## Verifica

`scripts/exercises/checkers/retta_fasci.py` rilegge tutto dal LaTeX con un piccolo parser: il fascio si
divide in generatrici con SymPy ($r$ = l'espressione con $k = 0$, $s$ = il coefficiente di $k$), il centro
viene da `linsolve` e si controlla che annulli il fascio per ogni $k$; le rette vengono da `Line` e `Point`
(la retta $CA$, `parallel_line`, `is_parallel`, `is_perpendicular`); i valori di $k$ da `solve`. Al livello 5
si risolve il sistema "coefficiente di $x$ = 0, coefficiente di $y$ = 0" e si controlla che l'equazione
diventi falsa. Al livello 6 un'equazione in $k$ senza soluzioni deve avere $A$ sulla retta esclusa; al
livello 7 un'equazione impossibile deve avere la retta esclusa con la proprietà chiesta, e la relazione si
legge dal testo della consegna. Ogni opzione si rilegge dal LaTeX, deve dire i suoi `values`, e una sola è
giusta. La forma: risposte esplicite `y = mx + q` con frazioni ridotte, opzioni implicite con coefficienti
interi primi fra loro e il primo positivo, rette parallele agli assi scritte `x = h` e `y = h`.

Esiti:

- `sample.mts retta-fasci 1000 all 1 | verify.py`: PASS. Casi: livello 1 obliqua 850, verticale 150; livello 2
  implicita 546, esplicita 304, verticale 150; livelli 3 e 4 assi 276, obliqui 724; livello 6 punto 746,
  esclusa 254; livello 7 parallela 359, perpendicolare 337, esclusa 147, verticale 157.
- Con seed di partenza 7001: PASS.
- Esercizi diversi su 1.000 per livello (testo del problema): 965, 986, 978, 978, 962, 1000, 1000. I livelli 3
  e 4 usano gli stessi fasci con lo stesso seed, ma chiedono cose diverse.
- Errori piantati a mano, tutti bocciati: per ogni caso di ogni livello l'indice della risposta spostato, il
  testo dell'opzione giusta sostituito con un altro, un distrattore uguale alla risposta; la risposta
  esplicita cambiata ($y = 3x + 1$) e il `value` cambiato; il numero del livello 5 cambiato; l'opzione giusta
  scritta moltiplicata per 2 ($8x + 10y + 4 = 0$), con il segno meno davanti, in forma esplicita; un
  distrattore uguale alla risposta moltiplicata per 2; una frazione non ridotta ($\frac{4}{2}$); `0x` nella
  risposta; `+ -` nel problema; la relazione del livello 7 cambiata; il punto $A$ o $P$ spostato; il fascio
  cambiato (centro non intero, generatrici non più parallele al livello 5); un ambiente nei passaggi.
- `width.mts retta-fasci`: 0 oltre il limite. Il problema più largo è il fascio, 291 px su 350; l'opzione più
  larga 172 px su 252 (livello 6).
- `review.mts`: esce con 0.

## Figure

Nessun livello ha una figura, e tutti si reggono sul testo. Ne vorrebbero una: il livello 1 (il fascio che
ruota attorno a $C$, con la verticale tratteggiata, come la prima figura della lezione) e il 2 (le parallele),
soprattutto nei passaggi; i livelli 6 e 7 nella soluzione, per far vedere che la risposta del caso "retta
esclusa" esiste davvero (la figura "fascio-retta-per-un-punto" della lezione). I livelli 3, 4 e 5 non ne hanno
bisogno.

## Domande per la revisione

- Il livello 5 chiede solo il valore di $k$ che non dà una retta, in un fascio già dichiarato improprio. La
  nota proponeva anche di riconoscere se il fascio è proprio o improprio: come domanda a scelta avrebbe solo due
  risposte, e l'ho lasciata nei passaggi. Si può aggiungere un livello "proprio o improprio?" con quattro
  opzioni del tipo "proprio, di centro (2, 1)" / "improprio, rette con m = -2".
- Il livello 7 scrive $m = -\frac{a}{b}$ con $b$ come esce dal fascio, anche quando è negativo
  ($-\frac{k - 3}{-1 - 2k}$), senza semplificare i segni: è fedele al metodo della lezione ma si legge peggio.
- I risultati dei livelli 4, 6 e 7 sono in forma implicita (come nelle risposte degli esempi 3, 6 e 7), quelli
  dei livelli 1 e 2 in forma esplicita (come negli esempi 1 e 2). Andrea potrebbe preferire una forma sola.
- $k$ al livello 6 può essere una frazione con denominatore fino a 6 (per esempio $k = -\frac{8}{3}$), e la
  retta del fascio con quel $k$ ha coefficienti frazionari prima di moltiplicare: è un conto in più rispetto
  all'esempio 6, dove $k = 3$. Se è troppo, si possono tenere solo i $k$ interi.
