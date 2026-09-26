# Triangoli e criteri di congruenza

Generatore: `angoli-e-lati-dei-triangoli`
(`src/lib/exercises/v2/generators/angoli-e-lati-dei-triangoli.ts`). Verifica indipendente:
`scripts/exercises/checkers/angoli_e_lati_dei_triangoli.py`. Lezione collegata:
`docs/lezioni/riscritte/59-angoli-e-lati-dei-triangoli.md`, con la sezione "Per il generatore" della nota
`docs/lezioni/note/59-angoli-e-lati-dei-triangoli.md`.

Sette livelli nell'ordine della lezione: classificazione, triangoli congruenti e ordine dei vertici,
criteri di congruenza, dimostrazioni, disuguaglianza triangolare, somma degli angoli, triangolo isoscele.
Il sito oggi non genera figure per la matematica, quindi ogni esercizio si regge sul testo: misure,
elementi congruenti scritti con $\cong$, figure descritte a parole come negli esempi della lezione.

## Tipi di risposta

- Livelli 1-5: `choice`, quattro opzioni distinte, una giusta. La variante a scelta multipla è la
  risposta stessa.
- Livelli 6 e 7: `number`, la misura in gradi come razionale esatto (`"65"`, `"135/2"` per
  $67{,}5^\circ$), con la variante a scelta multipla da `toChoice()`.

## Notazione

Come nella lezione: $\hat{A}$ per l'angolo interno, $\widehat{ABC}$ per l'angolo con tre lettere (vertice
in mezzo), $\triangle ABC$, $\cong$ per la congruenza, $\hat{A}'$ con l'apice fuori dal cappello, lunghezze
in cm, gradi con $^\circ$, virgola decimale `{,}`. Isoscele vuol dire "almeno due lati congruenti": un
triangolo equilatero è anche isoscele.

## Livello 1: classificare un triangolo

Quattro triangoli, dati con i tre lati (metà degli esercizi) o con i tre angoli, in ordine sparso;
la domanda chiede quale è della classe indicata. Lati interi da 2 a 15 cm che formano sempre un
triangolo; angoli interi di almeno $10^\circ$ con somma $180^\circ$. Quattro terne diverse anche come
insiemi.

- Scaleno: distrattori un isoscele scritto con la base in mezzo ($7, 4, 7$: i lati uguali non sono
  vicini), un isoscele qualsiasi, un equilatero.
- Isoscele: distrattori tre scaleni. Un esercizio su tre ha come risposta un equilatero (la definizione
  con "almeno due"), e allora nessun distrattore è isoscele.
- Equilatero: distrattori tre isosceli.
- Acutangolo: la risposta ha l'angolo maggiore tra $70^\circ$ e $89^\circ$; distrattori un rettangolo,
  un ottusangolo quasi retto ($91^\circ$-$99^\circ$) e uno molto ottuso. L'errore è credere acutangolo un
  triangolo con due angoli acuti su tre.
- Rettangolo: distrattori un ottusangolo quasi retto, un acutangolo quasi retto ($80^\circ$-$89^\circ$),
  un ottusangolo.
- Ottusangolo: distrattori un rettangolo (il retto preso per ottuso), un acutangolo con un angolo da
  $84^\circ$ a $89^\circ$, un altro acutangolo.

Esempio: quale è isoscele tra $6, 6, 6$; $5, 9, 7$; $4, 11, 8$; $12, 3, 10$ (cm)? Il primo: ha tre lati
congruenti, quindi almeno due.

Esempio: quale è acutangolo tra $50^\circ, 40^\circ, 90^\circ$; $95^\circ, 19^\circ, 66^\circ$;
$32^\circ, 80^\circ, 68^\circ$; $38^\circ, 106^\circ, 36^\circ$? Il terzo: gli altri hanno un angolo retto o
ottuso.

## Livello 2: elementi corrispondenti e ordine dei vertici

Il riquadro "L'ordine dei vertici" della lezione, in due forme (metà ciascuna). Triangoli $ABC$, $PQR$ o
$LMN$ e $DEF$, $STU$ o $XYZ$.

- Trova: "Sai che $\triangle ABC \cong \triangle EFD$. Quale di queste congruenze è vera?" La seconda
  terna non è mai in ordine alfabetico. Quattro congruenze tutte di lati o tutte di angoli, una vera;
  i distrattori sono prima quelli che accoppiano le lettere nell'ordine alfabetico ($AB \cong DE$,
  $\hat{A} \cong \hat{D}$), poi altri accoppiamenti sbagliati.
- Scrivi: "I triangoli $ABC$ e $DEF$ hanno $AB \cong EF$, $BC \cong FD$, $CA \cong DE$. Sono congruenti per
  il terzo criterio. Quale scrittura è giusta?" I dati sono i tre lati (60%) o due lati e l'angolo
  compreso (40%), in ordine sparso, con le lettere del secondo lato in ordine casuale. Opzioni:
  $\triangle ABC \cong \triangle \dots$ con quattro ordini dei vertici, tra cui sempre quello alfabetico
  quando è sbagliato.

Esempio: $\triangle LMN \cong \triangle EFD$; vera $\hat{M} \cong \hat{F}$, false $\hat{L} \cong \hat{D}$,
$\hat{N} \cong \hat{F}$, $\hat{M} \cong \hat{D}$.

Esempio: $PQ \cong EF$, $RP \cong DF$, $\hat{P} \cong \hat{F}$: $P$ va con $F$, allora $Q$ con $E$ e $R$
con $D$, $\triangle PQR \cong \triangle FED$.

## Livello 3: quale criterio

Tre coppie di elementi ordinatamente congruenti di $ABC$ e $A'B'C'$ (oppure $DEF$ con $A \leftrightarrow D$,
$B \leftrightarrow E$, $C \leftrightarrow F$), in ordine sparso. Le quattro opzioni sono sempre le stesse,
in quest'ordine: primo criterio, secondo criterio, terzo criterio, nessun criterio. Si sceglie prima la
risposta, un quarto ciascuna; "nessuno" è per due terzi due lati e un angolo non compreso, per un terzo
tre angoli (i due riquadri `ad-warning` della lezione). Non escono un lato e due angoli non entrambi
adiacenti: il secondo criterio generalizzato è nella lezione 60.

Esempio: $QP \cong Q'P'$, $QR \cong Q'R'$, $PR \cong P'R'$: terzo criterio.

Esempio: $CA \cong C'A'$, $CB \cong C'B'$, $\hat{B} \cong \hat{B}'$: i due lati hanno in comune $C$, l'angolo
dato è in $B$, nessun criterio.

## Livello 4: il passo mancante di una dimostrazione

Sei dimostrazioni della lezione: l'esempio 1 (punto medio comune, primo criterio), l'esempio 2 (secondo
criterio), l'esempio 3 (aquilone, terzo criterio), il teorema del triangolo isoscele con la bisettrice,
l'esempio 4 (triangoli sovrapposti) e l'esempio 5 (prolungamenti della base, angoli supplementari). Il
testo le descrive a parole, poi dà ipotesi, tesi, i due triangoli, i tre passi numerati e la conclusione
("Per il primo criterio $\triangle AOC \cong \triangle BOD$, quindi $AC \cong BD$"). Quattro volte su dieci
le lettere sono quelle della lezione, le altre sono prese a caso tra 18 lettere.

- Passo: un passo è sostituito da "?". Opzioni: il passo giusto con la sua giustificazione; la tesi
  "per ipotesi" (l'avviso "Usare la tesi come se fosse vera"); due passi sbagliati scritti per quel passo,
  cioè un elemento che non corrisponde o che non è del triangolo ($AO \cong OD$, $CD$ in comune,
  $BD \cong DC$ "per la bisettrice"), oppure il passo giusto con una giustificazione falsa ("si vede dal
  disegno", "per ipotesi" per angoli opposti al vertice).
- Perché: si chiede la giustificazione di un passo che non viene dall'ipotesi (opposti al vertice,
  bisettrice, supplementari di angoli congruenti); le dimostrazioni degli esempi 3 e 4 non ne hanno, e
  lì esce solo "Passo". Opzioni: la giustificazione giusta, "per ipotesi", "si vede dal disegno" o "è la
  tesi", e un'altra giustificazione geometrica.

Esempio: esempio 4 con $B, D, H, L, P$; manca il passo 1; giusto $BD \cong BH$ per ipotesi; sbagliati
$BD \cong BH$ "si vede dal disegno", $BD \cong BP$ per ipotesi, $DP \cong HL$ per ipotesi (la tesi).

Esempio: esempio 5, perché vale $\widehat{ABD} \cong \widehat{ACE}$? Supplementari di angoli congruenti.

## Livello 5: disuguaglianza triangolare

- Esiste (35%): "Quale di queste terne può essere quella dei lati di un triangolo?" Una terna valida
  (quattro volte su dieci al limite: il lato più lungo è la somma degli altri meno 1), una degenere (il
  lato più lungo uguale alla somma, l'esempio 6 della lezione) e altre due non valide.
- Non esiste (30%): la stessa domanda al contrario, una terna non valida e tre valide, una al limite.
- Intervallo (35%): due lati $a < b$ (da 2 a 15 cm, dati in ordine casuale); opzioni $b - a < x < a + b$,
  $b - a \leq x \leq a + b$ (estremi inclusi), $0 < x < a + b$ (dimenticata la differenza),
  $a < x < b$ (il terzo lato preso tra i due dati).

Lati fino a 20 cm, scritti in ordine sparso: il lato più lungo non è sempre l'ultimo.

Esempio: $12, 7, 19$ non può essere, perché $7 + 12 = 19$.

Esempio: lati di $8$ e $5$ cm: $3 < x < 13$.

## Livello 6: il terzo angolo

- Somma (70%): due angoli interi da $15^\circ$ a $130^\circ$, il terzo di almeno $12^\circ$; l'angolo che
  manca è $\hat{A}$, $\hat{B}$ o $\hat{C}$. Distrattori: $360^\circ$ meno i due dati, $180^\circ$ meno uno solo
  (il maggiore), la risposta $\pm 10^\circ$ (errore nel prestito), la somma dei due dati.
- Rettangolo (30%): "rettangolo in $A$" e un angolo acuto da $10^\circ$ a $80^\circ$; si usa che gli
  angoli acuti sono complementari. Distrattori: $180^\circ - b$ (dimenticato l'angolo retto), $b$,
  $90^\circ + b$.

Esempio: $\hat{A} = 47^\circ$, $\hat{B} = 68^\circ$, $\hat{C} = 65^\circ$ (esempio 8 della lezione).

Esempio: rettangolo in $A$, $\hat{B} = 34^\circ$, $\hat{C} = 56^\circ$.

## Livello 7: gli angoli del triangolo isoscele

- Vertice (40%): $\hat{A}$ al vertice da $20^\circ$ a $160^\circ$ (mai $60^\circ$), si chiede $\hat{B}$;
  con $\hat{A}$ dispari il risultato ha mezzo grado, come $(180^\circ - 45^\circ) : 2 = 67{,}5^\circ$.
  Distrattori: $\hat{A}$ stesso, $180^\circ - \hat{A}$ (non diviso per 2), $180^\circ - 2\hat{A}$ (l'angolo
  preso per un angolo alla base).
- Base (40%): $\hat{B}$ alla base da $10^\circ$ a $85^\circ$ (mai $60^\circ$), si chiede $\hat{A}$.
  Distrattori: $(180^\circ - \hat{B}) : 2$ (preso per l'angolo al vertice), $180^\circ - \hat{B}$ (tolto un
  solo angolo alla base), $\hat{B}$, $90^\circ - \hat{B}$.
- Ottuso (20%): "un angolo misura $v$" con $v$ da $90^\circ$ a $160^\circ$, senza dire quale: è per forza
  l'angolo al vertice, perché due angoli alla base di $v$ farebbero almeno $180^\circ$. Distrattori
  $180^\circ - v$, $v : 2$, la risposta più $10^\circ$.

Dove due distrattori coincidono o escono da $(0^\circ, 180^\circ)$, si completano con la risposta
$\pm 10^\circ$, $\pm 5^\circ$, $\pm 20^\circ$, $\pm 1^\circ$.

Esempio: $\hat{A} = 40^\circ$ al vertice, $\hat{B} = 70^\circ$; alla base $35^\circ$, vertice $110^\circ$
(esempio 9).

Esempio: un angolo di $94^\circ$: gli altri due misurano $43^\circ$.

## Esercizi da evitare

- Terne di lati che non formano un triangolo al livello 1, angoli che non sommano a $180^\circ$.
- Due opzioni giuste: per questo al livello 1 un equilatero non è mai distrattore della domanda
  "isoscele".
- Al livello 2, la seconda terna in ordine alfabetico nella forma "Trova" (la trappola sparisce); dati
  che lasciano due ordini possibili nella forma "Scrivi"; tre angoli come dati (non danno la congruenza).
- Al livello 3, un lato e due angoli non entrambi adiacenti (secondo criterio generalizzato, lezione 60).
- Al livello 4, la domanda "perché?" su un passo che viene dall'ipotesi: la risposta è scritta due righe
  sopra.
- Al livello 7, un angolo acuto "qualsiasi" senza dire se è al vertice o alla base: la domanda avrebbe
  due risposte.

## Figure

Tutti i livelli si reggono sul testo. Vorrebbero una figura il livello 4 (le lezioni risolvono le
dimostrazioni sul disegno, e qui lo studente deve farselo da solo, come dice il passo 1 del metodo
della lezione) e, meno, il livello 3 (i triangoli con i trattini e gli archetti al posto dell'elenco delle
congruenze).

## Larghezza sul telefono

`width.mts`: esce con 0. Il problema più largo è a 348 px su 350 (livello 4, un passo con
due angoli a tre lettere e "opposti al vertice"); l'opzione più larga a 231 px su 252. Il passo "supplementari di angoli
congruenti" sarebbe largo 452 px: nel problema va su due righe (`array` annidato), nelle opzioni su due o
tre righe con `gathered`.

## Verifica

- `sample.mts … 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Con il seed 7001: PASS.
- Il controllo in Python rilegge tutto dal testo che vede lo studente: le terne dalle opzioni, la
  corrispondenza dei vertici dal problema (provando tutte le permutazioni), il criterio dagli elementi.
  Per il livello 4 costruisce ogni figura con coordinate casuali che rispettano l'ipotesi e misura i
  passi e la tesi; classifica i tre passi con lo stesso criterio del livello 3; per ogni opzione
  sbagliata deve trovare un motivo (giustificazione "disegno" o "tesi", "per ipotesi" su un fatto che
  non è nell'ipotesi, affermazione falsa nella figura, nessun criterio con gli altri due passi,
  giustificazione diversa per il passo giusto), altrimenti boccia l'esercizio.
- Errori piantati, tutti bocciati: indice della risposta spostato (livelli 1-5); una terna che non è un
  triangolo; angoli con somma $181^\circ$; un equilatero tra i distrattori di "isoscele" (due risposte
  giuste); il secondo triangolo rinominato al livello 2; il criterio sbagliato nel testo (livelli 2 e 4);
  un angolo compreso sostituito da uno non compreso al livello 3; un'opzione con il passo giusto e la
  giustificazione sbagliata segnata come giusta; la giustificazione sbagliata segnata al livello 4;
  "perché?" chiesto su un passo per ipotesi; "rispetto ad $M$"; l'intervallo con gli estremi inclusi
  segnato giusto; una terna degenere resa valida (due giuste); risposta $+1^\circ$ al livello 6; mezzo
  grado troncato al livello 7; opzione doppia; un angolo acuto non specificato al livello 7; un'opzione
  con LaTeX diverso dal valore. Un campione non toccato, nello stesso file, passa.
- `review.mts`: esce con 0. `steps-scan.mts`: niente prima di "fatto". `tsc` e `eslint` puliti sul file.

Esercizi diversi su 1.000 (problema più insieme delle opzioni): livello 1: 1.000; livello 2: 955;
livello 3: 722; livello 4: 664; livello 5: 795; livello 6: 899; livello 7: 272.

## Domande per la revisione

- Al livello 1 la domanda "quale è isoscele?" ha a volte come risposta un equilatero, per la definizione
  "almeno due lati" della lezione. Se il libro in uso dice "due lati", questi esercizi vanno tolti.
- Al livello 4 la giustificazione sbagliata "si vede dal disegno" compare anche se l'esercizio non ha un
  disegno: si riferisce alla figura che lo studente fa da solo. Va bene o meglio "sembra dal disegno"?
- Al livello 4 alcuni distrattori sono affermazioni vere ma giustificate male ($DB \cong EC$ "per
  ipotesi" nell'esempio 4, $\hat{D} \cong \hat{E}$ "supplementari di angoli congruenti" nell'esempio 5).
  Sono sbagliati come passi, ma uno studente attento potrebbe protestare che sono veri.
- Il livello 2 nella forma "Scrivi" usa anche due lati e l'angolo compreso: va bene introdurre qui il
  primo criterio, che nella lezione arriva subito dopo l'ordine dei vertici?
