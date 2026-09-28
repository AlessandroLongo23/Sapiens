# Trasformazioni geometriche

Generatore: `trasformazioni-geometriche` (`src/lib/exercises/v2/generators/trasformazioni-geometriche.ts`).
Verifica indipendente: `scripts/exercises/checkers/trasformazioni_geometriche.py`. Lezione collegata:
`docs/lezioni/riscritte/104-trasformazioni-geometriche.md` (nota in `docs/lezioni/note/104-trasformazioni-geometriche.md`,
sezione "Per il generatore").

Sette livelli nell'ordine della lezione, gli stessi sette proposti dalla nota: traslazione di un punto, simmetrici
nel piano cartesiano, omotetia di centro $O$, retta traslata, retta simmetrica od omotetica, trasformazione letta
dalle equazioni con i punti uniti, composizioni. Tutti gli esercizi stanno nel piano cartesiano, come i cinque
esempi della lezione: le parti sintetiche (rotazione, simmetria centrale di centro qualunque) non hanno esempi
numerati e senza figura non si prestano.

## Convenzioni

Quelle della lezione: punti $P(3, -2)$ con le frazioni tra `\left( \right)`, immagine con l'apice ($P'$, e $P''$
dopo due trasformazioni), vettore $\vec{v}(a, b)$ scritto come i punti, rette $r\colon y = 2x + 1$ e
$r'\colon y = 2x - 6$ in forma esplicita, equazioni della trasformazione $x' = x + a$, $y' = y + b$ (nel testo del
livello 6 con `cases`, come nella lezione), omotetia di centro $O$ e rapporto $k$, simmetrie $s_a$ e $s_b$ con gli
assi $a$ e $b$, composizione "prima $s_a$, poi $s_b$", cioè $P'' = s_b(s_a(P))$. Frazioni e mai decimali. I dati
del problema sono separati da `\quad`.

## Forma della risposta

- Livelli 1, 2 e 7: `choice` fra quattro punti (`(7, -2)`, `values` = `["7", "-2"]`) o quattro vettori
  (`\vec{v}(-4, -5)`, stessi `values`).
- Livello 3: il punto immagine è `choice`; il rapporto $k$ e l'area sono `number` (`"-1/2"`, `"3/8"`), con la
  variante a scelta fra quattro numeri.
- Livelli 4 e 5: `expression` con `form: "explicit"`, `value` il secondo membro per SymPy (`-2*x + 4`,
  `(-1/3)*x - 4`) e `latex` l'equazione ($y = -2x + 4$). Variante a scelta fra quattro rette in forma esplicita.
- Livello 6: `choice` fra quattro trasformazioni (`\text{traslazione di vettore }\vec{v}(3, -1)`, `values` =
  `["T", "3", "-1"]`; `["Sx"]`, `["Sy"]`, `["SO"]`, `["Sb"]` per le simmetrie; `["H", "1/3"]` per l'omotetia) o
  fra quattro insiemi di punti uniti (`["none"]`, `["O"]`, `["x"]`, `["y"]`, `["bis"]`, `["all"]`).

## Livelli

### 1. Traslazione di un punto
Tre casi: l'immagine $P'$ dati $P$ e $\vec{v}$ (6 su 10, esempio 1), il vettore dati $P$ e $P'$ (2 su 10), il
punto di partenza $P$ dati $P'$ e $\vec{v}$ (2 su 10). Coordinate intere: $P$ non nulle tra $-8$ e $8$,
$\vec{v}$ tra $-6$ e $6$ (nell'immagine e nel punto di partenza, 15 volte su 100 una componente è zero), $P'$
entro 12.
Esempi: $P(3, 1)$, $\vec{v}(4, -3)$: $P'(7, -2)$; $P(5, -1)$, $P'(1, -6)$: $\vec{v}(-4, -5)$.
Distrattori: il vettore sottratto invece che sommato (la nota), le componenti del vettore scambiate, una sola
componente con il segno sbagliato; per il vettore $P - P'$ (il verso sbagliato), $P + P'$, le componenti
scambiate; per il punto di partenza $P' + \vec{v}$, $\vec{v} - P'$, il vettore con le componenti scambiate.

### 2. Simmetrici nel piano cartesiano
Simmetrico di $P$ rispetto all'asse $x$ (2,5 su 10), all'asse $y$ (2,5 su 10), all'origine (2 su 10), alla
bisettrice $y = x$ (3 su 10), la tabella della lezione. Coordinate non nulle con $|x| \neq |y|$ (i punti delle
bisettrici darebbero opzioni coincidenti), intere tra $-9$ e $9$; 15 volte su 100 l'ascissa ha denominatore 2.
Esempi: $P(8, -7)$ rispetto all'asse $x$: $P'(8, 7)$; $P(-2, -1)$ rispetto alla bisettrice: $P'(-1, -2)$.
Distrattori: gli altri simmetrici (la coordinata sbagliata cambiata, avviso "Quale coordinata cambia segno"; tutte
e due cambiate), le coordinate scambiate e cambiate di segno; per la bisettrice quest'ultimo (la nota) e i tre
simmetrici rispetto agli assi e all'origine.

### 3. Omotetia di centro O
Tre casi.
- Immagine di un punto (4 su 10): $k \in \{\pm 2, \pm 3, \pm\frac{1}{2}, \pm\frac{3}{2}, \pm\frac{1}{3}\}$, $P$ con
  coordinate non nulle multiple del denominatore di $k$, entro 9, immagine intera entro 18. Distrattori: $k$
  sommato invece che moltiplicato, il segno di $k$ perso, le coordinate divise per $k$, solo l'ascissa
  moltiplicata.
- Rapporto (3 su 10): dati $P$ e $P'$, trovare $k$ (anche $\frac{2}{3}$ e $4$). Distrattori: $\frac{1}{k}$
  (il rapporto capovolto), $-k$, $-\frac{1}{k}$.
- Area (3 su 10, esempio 2): triangolo rettangolo con i cateti paralleli agli assi, vertici interi entro 6,
  $k \in \{\pm 2, \pm 3, \pm\frac{1}{2}, \frac{3}{2}\}$; l'area dell'immagine è $k^2$ volte quella di $ABC$.
  Distrattori: l'area moltiplicata per $|k|$ (avviso "L'area non raddoppia", la nota), l'area non cambiata, il
  prodotto dei cateti non diviso per 2.
Esempi: $P(2, -2)$, $k = \frac{3}{2}$: $P'(3, -3)$; $A(0, -1)$, $B(-3, -1)$, $C(0, 0)$, $k = \frac{1}{2}$: area
$\frac{3}{8}$.

### 4. Retta traslata
$r\colon y = mx + q$ e $\vec{v}(a, b)$ (esempio 3). $m$ intero non nullo tra $-4$ e $4$ (7 su 10) o frazionario
fra $\pm\frac{1}{2}, \pm\frac{3}{2}, \pm\frac{1}{3}, \pm\frac{2}{3}$ (3 su 10); $q$ intero tra $-6$ e $6$; $a$ e
$b$ non nulli, $|a| \le 6$ multiplo del denominatore di $m$, $|b| \le 5$. La retta immagine non coincide con $r$
($b \neq ma$), il suo termine noto è intero entro 20. Passaggi: le equazioni, $x$ e $y$ ricavati, la
sostituzione, la forma esplicita, gli apici tolti, il controllo con un punto (i cinque passi della lezione).
Esempi: $r\colon y = -2x + 1$, $\vec{v}(3, -3)$: $r'\colon y = -2x + 4$; $r\colon y = -\frac{1}{3}x$,
$\vec{v}(-3, -3)$: $r'\colon y = -\frac{1}{3}x - 4$.
Distrattori: la sostituzione con i segni sbagliati (avviso "Sostituire con il segno sbagliato", la retta traslata
nel verso opposto), solo $b$ usato, solo $a$ usato, la retta di partenza, il coefficiente angolare cambiato di
segno.

### 5. Retta simmetrica od omotetica
$r\colon y = mx + q$ con $q$ non nullo tra $-6$ e $6$, $m$ come al livello 4 (intero 7 volte su 10). Cinque casi:
simmetria rispetto all'asse $x$ (2 su 10), all'asse $y$ (2 su 10), all'origine (1,5 su 10), alla bisettrice
(2 su 10, esempio 4, mai con $m = -1$: la retta sarebbe unita), omotetia di centro $O$ con
$k \in \{\pm 2, \pm 3, \pm\frac{1}{2}\}$ (2,5 su 10, esempio 5). Termine noto dell'immagine entro 20.
Esempi: $r\colon y = -4x + 2$ rispetto all'asse $y$: $y = 4x + 2$; $r\colon y = -\frac{2}{3}x - 4$ rispetto
alla bisettrice: $y = -\frac{3}{2}x - 6$.
Distrattori: la retta di partenza, la retta con solo il coefficiente angolare cambiato di segno (la nota), le
immagini nelle altre simmetrie; per la bisettrice il termine noto non diviso per $m$ o con il segno sbagliato e il
coefficiente $-\frac{1}{m}$; per l'omotetia la sostituzione al contrario ($\frac{q}{k}$) e anche $m$ moltiplicato
per $k$.

### 6. Dalle equazioni alla trasformazione
Il testo dà il sistema delle equazioni. Trasformazioni: traslazione (2 su 8, vettore con componenti non nulle
entro 6), simmetrie rispetto agli assi, all'origine e alla bisettrice (1 su 8 ciascuna), omotetia di centro $O$
(2 su 8, $k \in \{\pm 2, \pm 3, \pm\frac{1}{2}, \frac{3}{2}, \frac{1}{3}\}$). Due casi:
- Riconoscere (6 su 10). Distrattori: l'altro asse (avviso "Quale coordinata cambia segno"), l'origine, la
  bisettrice; per la traslazione il vettore con i segni cambiati, con le componenti scambiate o con un segno
  cambiato, l'omotetia di rapporto $a$; per l'omotetia $\frac{1}{k}$, $-k$, la traslazione di vettore $(k, k)$
  (con $k$ intero), la simmetria rispetto all'origine. L'omotetia di rapporto $-1$ non è mai un distrattore: è la
  simmetria rispetto all'origine.
- Punti uniti (4 su 10), dalla tabella delle isometrie: nessuno per la traslazione, i punti dell'asse per le
  simmetrie assiali, solo $O$ per la simmetria centrale e l'omotetia. Distrattori fissi per ogni risposta (per
  l'asse $x$: l'asse $y$, solo $O$, nessuno, tutti).
Esempi: $x' = \frac{1}{3}x$, $y' = \frac{1}{3}y$: omotetia di centro $O$ e $k = \frac{1}{3}$; $x' = x + 1$,
$y' = y - 6$: nessun punto unito.

### 7. Composizioni
Tre casi.
- Assi paralleli (4 su 10): $a\colon x = h_1$ e $b\colon x = h_2$ (6 su 10) o $a\colon y = h_1$ e
  $b\colon y = h_2$, interi diversi tra $-5$ e $5$; $P$ intero non nullo entro 6, fuori dagli assi. Si chiede
  $P'' = s_b(s_a(P))$, che è $P$ traslato di $2(h_2 - h_1)$. Distrattori: l'ordine scambiato ($-2d$, avviso
  "L'ordine conta"), lo spostamento $d$ non raddoppiato, una sola delle due simmetrie ($s_a(P)$ o $s_b(P)$).
- Due traslazioni (2,5 su 10): il vettore della composizione di $\vec{v}_1$ e $\vec{v}_2$ (componenti non nulle
  entro 6, somma con componenti non nulle). Distrattori: le due differenze, la somma con le componenti scambiate,
  la somma incrociata.
- Assi perpendicolari (3,5 su 10, `ad-note` "Assi che si incontrano"): $a\colon x = h$, $b\colon y = k$ con $h$ e
  $k$ tra $-4$ e $4$, non tutti e due nulli; la composizione è la simmetria centrale di centro $C(h, k)$.
  Distrattori: il simmetrico rispetto all'origine, una sola simmetria, $P$ traslato di $(2h, 2k)$.
Esempi: $a\colon y = 1$, $b\colon y = -1$, $P(4, -3)$: $P''(4, -7)$; $a\colon x = 2$, $b\colon y = 0$,
$P(-1, -3)$: $P''(5, 3)$.

## Costruzione all'indietro

- Livello 1: si scelgono $P$ e $\vec{v}$, e $P'$ si calcola; il testo mostra due dei tre.
- Livello 3: si sceglie $k$, poi $P$ con coordinate multiple del denominatore di $k$.
- Livelli 4 e 5: si scelgono $m$, $q$ e la trasformazione; la retta immagine si calcola con i coefficienti, il
  punto del controllo ha ascissa multipla del denominatore di $m$.
- Livello 7: si scelgono gli assi e $P$, e $P''$ si calcola riflettendo due volte.

Il caso di ogni livello si estrae una volta sola; se i numeri non vanno bene si estraggono di nuovo solo i numeri,
così le quote dei casi restano quelle della specifica.

## Controllo indipendente

Il controllo legge dal LaTeX del problema i punti, i vettori, la retta $r$, gli assi e il sistema delle equazioni,
e dalla consegna il tipo di trasformazione. Ricalcola con SymPy: `Point.translate`, `Point.reflect` su una `Line`
(assi, bisettrice, rette $x = h$ e $y = k$), `Point.scale` attorno all'origine, `Triangle.area`; l'immagine di una
retta come la retta per le immagini di due suoi punti (non con la sostituzione dei passaggi); i punti uniti con
`linsolve`. Rilegge ogni opzione dal suo LaTeX e dai suoi `values` e le confronta come oggetti matematici: stessi
punti, stessa retta, stessa trasformazione del piano come coppia di espressioni in $x$ e $y$ (così un'omotetia di
rapporto $-1$ e la simmetria rispetto all'origine sono la stessa opzione). Pretende quattro opzioni distinte, una
sola giusta e l'indice giusto; rette in forma esplicita ridotta (mai $1x$, $+ 0$, frazioni non ridotte), anche fra
i distrattori; `\left(` esattamente quando una coordinata non è intera; i vincoli di ogni livello (intervalli, $P$
fuori da assi e bisettrici, $k \neq \pm 1$, immagine diversa da $r$, assi paralleli o perpendicolari). Il caso di
ogni campione si ricalcola dai dati e le quote sono in `CASE_RANGES`.

## Verifiche fatte (28 settembre 2026)

- `sample.mts trasformazioni-geometriche 1000 all 1 | verify.py`: PASS, 7.000 su 7.000. Con i seed da 50001: PASS.
- Errori piantati, tutti bocciati (17): opzione giusta spostata (livelli 1, 5), vettore fuori intervallo, punto
  sulla bisettrice, asse cambiato nella consegna (livelli 2 e 5), rapporto con il segno cambiato, `values` della
  giusta diversi dal LaTeX, segno di $k$ cambiato nel testo, risposta non ridotta ($+ 0$), distrattore uguale alla
  risposta ma non ridotto ($-\frac{8}{2}x$), valore SymPy della risposta sbagliato, omotetia di rapporto $-1$ come
  distrattore della simmetria rispetto all'origine, equazioni cambiate al livello 6, asse $b$ spostato, LaTeX
  della giusta cambiato, asse perpendicolare reso parallelo.
- `review.mts` e `width.mts` escono con 0 (massimi: problema 131 px, opzioni 239 px al livello 6); nessun errore
  di `tsc` e di `eslint` nel generatore.
- Esercizi diversi su 1.000 per livello (consegna e problema): 994, 726, 879, 958, 654, 194, 981. Il livello 6 ha
  poche trasformazioni possibili (quattro simmetrie fisse, otto rapporti) e resta sopra 100.

## Cosa evitare

- Punti sugli assi o sulle bisettrici al livello 2, e sugli assi di simmetria al livello 7.
- Rette unite: una traslazione con $b = ma$, la bisettrice con $m = -1$.
- Omotetie di rapporto $\pm 1$, anche fra i distrattori.
- Rette scritte non ridotte ($1x$, $+ 0$, $\frac{4}{2}$), anche fra i distrattori.
- Coordinate decimali.

## Figure

Il sito non disegna figure negli esercizi: ogni esercizio si regge sulle coordinate. La nota chiede una figura per
i livelli 4, 5 e 7: la retta e la sua immagine (con il punto del controllo) ai livelli 4 e 5, i due assi con $P$,
$P'$ e $P''$ al livello 7, come le figure `traslazione-retta`, `simmetria-bisettrice-retta`, `omotetia-retta` e
`composizione-simmetrie-assi-paralleli` della lezione. Anche il livello 3 (area) ne guadagnerebbe, come l'esempio 2.

## Domande per la revisione

- Tutti gli esercizi sono nel piano cartesiano. Servono anche esercizi sintetici (il centro di una simmetria
  centrale o l'asse di una simmetria assiale da un punto e dalla sua immagine, le isometrie dirette e inverse)?
  La nota li mette tra le domande per Andrea.
- Livello 5, bisettrice: la risposta è in forma esplicita, $y = \frac{1}{2}x - \frac{1}{2}$, mentre l'esempio 4
  scrive $y = \frac{x - 1}{2}$. Va bene la forma esplicita per tutte le rette?
- Livello 6: le etichette "simmetria rispetto a $y = x$" e "omotetia di centro $O$ e $k = \frac{1}{3}$" sono più
  corte delle frasi della lezione, per stare nei pulsanti del telefono. Vanno bene?
- Livello 7: la composizione è scritta nella consegna a parole ("prima la simmetria di asse $a$, poi quella di asse
  $b$") e nei passaggi come $P'' = s_b(s_a(P))$, non con il simbolo $s_b \circ s_a$ della lezione. Si preferisce il
  simbolo anche nel testo?
- Livello 3, area: l'area dell'immagine può essere una frazione ($\frac{3}{8}$ con $k = \frac{1}{2}$). Si tiene,
  o solo $k$ intero per l'area?
- La rotazione nel piano cartesiano e la simmetria rispetto a $y = -x$ non ci sono, come nella lezione. Se Andrea
  le aggiunge alla lezione, entrano nei livelli 2 e 6.
