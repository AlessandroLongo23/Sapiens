# Il piano cartesiano: distanza e punto medio

Generatore: `il-piano-cartesiano` (`src/lib/exercises/v2/generators/il-piano-cartesiano.ts`).
Verifica indipendente: `scripts/exercises/checkers/il_piano_cartesiano.py`. Lezione collegata:
`docs/lezioni/riscritte/80-il-piano-cartesiano.md` (nota in `docs/lezioni/note/80-il-piano-cartesiano.md`,
sezione "Per il generatore").

Sette livelli nell'ordine della lezione, gli stessi sette proposti dalla nota: dove sta un punto, segmenti
orizzontali e verticali, distanza tra due punti, punti di un asse a distanza data, punto medio ed estremo,
simmetrici e baricentro, triangoli e parallelogrammi. Il livello 7 mette insieme gli strumenti dei
precedenti, come gli esempi 7, 8 e 9 della lezione.

## Convenzioni

Quelle della lezione: punti scritti $A(3, -2)$ con la virgola tra le coordinate, coordinate non intere con
le frazioni e con `\left( … \right)` (esempio 5), distanza $\overline{AB}$, quadrato $\overline{AB}^{\,2}$,
coordinate $x_A$, $y_A$, punto medio $M$, simmetrico con l'apice ($A'$, $P'$), baricentro $G$. Le
differenze si scrivono con le parentesi sui negativi, $4 - (-3)$, come chiede l'avviso "Perdere il segno
meno". I punti dati nel problema sono separati da `\quad`, così la pagina li manda a capo.

## Forma della risposta

- Livello 1: `choice` fra quattro posizioni (`\text{primo quadrante}` … `\text{asse }x`), `values` =
  `["I"]`, `["II"]`, `["III"]`, `["IV"]`, `["x"]`, `["y"]`.
- Livello 2: `number` (la distanza, intera), con la variante a scelta fra quattro numeri.
- Livello 3: `expression` con `form: "simplified"`: `value` in SymPy (`6*sqrt(2)`, `sqrt(97)/6`, `10`),
  `latex` il numero ($6\sqrt{2}$, $\frac{\sqrt{97}}{6}$). Il denominatore è sempre razionale, perché
  $\sqrt{\frac{p}{q}}$ si scrive $\frac{\sqrt{pq}}{q}$ e poi si riduce. Variante a scelta fra quattro
  numeri, tutti ridotti.
- Livello 4: `choice` fra quattro insiemi di punti: `P_1(-2, 0),\ P_2(4, 0)` (in ordine crescente),
  `P(1, 0)`, `\text{nessun punto}`. `values`: `["-2,0", "4,0"]`, `["1,0"]`, `["none"]`.
- Livelli 5 e 6: `choice` fra quattro punti scritti come coppie, `(-4, 7)` o
  `\left(\frac{3}{2}, \frac{1}{2}\right)`, con `values` = `["-4", "7"]`.
- Livello 7: tipo di triangolo e quarto vertice sono `choice` (quattro etichette fisse, quattro punti);
  l'area è un `number` con la variante a scelta.

## Livelli

### 1. Quadranti e assi
In quale quadrante o su quale asse sta $P$ (esempio 1). Sette volte su dieci il punto sta in un
quadrante, tre volte su dieci su un asse (metà asse $x$, metà asse $y$). Ogni coordinata non nulla è un
intero da 1 a 9 (5 su 10), una frazione ridotta con denominatore da 2 a 5 e numeratore fino a tre volte il
denominatore (3 su 10) o un radicale $k\sqrt{n}$ con $n \in \{2, 3, 5, 6, 7\}$ e $k \le 3$ (2 su 10), con
il segno.
Esempi: $P\left(-7, \frac{1}{3}\right)$, secondo quadrante; $P\left(0, 2\sqrt{7}\right)$, asse $y$.
Distrattori: il quadrante con le coordinate scambiate (avviso "Scambiare ascissa e ordinata"), i quadranti
con il segno di una coordinata sbagliato; per un punto dell'asse, l'altro asse (avviso "Il punto $(0, 3)$
non sta sull'asse $x$") e i due quadranti dalla parte della coordinata non nulla.

### 2. Segmenti orizzontali e verticali
$\overline{AB} = |x_B - x_A|$ con la stessa ordinata, o $|y_B - y_A|$ con la stessa ascissa. Coordinate
intere tra $-9$ e $9$, metà orizzontali e metà verticali; sei volte su dieci le coordinate che cambiano
hanno segni opposti (i due punti stanno da parti opposte di un asse), quattro volte su dieci lo stesso
segno. Nessuna delle due è zero.
Esempi: $A(-8, 3)$, $B(4, 3)$, $\overline{AB} = 12$; $A(-1, 0)$, $B(-9, 0)$, $\overline{AB} = 8$.
Distrattori: la distanza con il segno ($-12$, il valore assoluto dimenticato); con i segni opposti
$4 - 8 = 4$ (avviso "Perdere il segno meno"), con lo stesso segno la somma dei due tratti $1 + 9 = 10$;
poi numeri vicini.

### 3. Distanza tra due punti
La formula $\overline{AB} = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$, segmento sempre obliquo. Tre casi:
distanza intera da una terna pitagorica (3 su 10: $3, 4, 5$; $6, 8, 10$; $5, 12, 13$), un radicale con
coordinate intere (5 su 10, differenze da 1 a 8, a volte da ridurre: $\sqrt{72} = 6\sqrt{2}$), coordinate
frazionarie (2 su 10: $A$ con denominatori 2, 3 o 4, $B$ intero, come l'esempio 3). Coordinate intere tra
$-9$ e $9$; il risultato ha denominatore al più 12 e radicando al più 300.
Esempi: $A(4, -5)$, $B(0, 2)$, $\overline{AB} = \sqrt{65}$;
$A\left(-\frac{5}{2}, \frac{3}{2}\right)$, $B(3, -1)$, $\overline{AB} = \frac{\sqrt{146}}{2}$.
Distrattori, tutti ridotti e diversi dalla risposta in valore: la somma dei cateti $|\Delta x| + |\Delta y|$
(avviso "La radice di una somma"), la somma dei quadrati senza radice, il quadrato portato fuori al posto
della radice ($36\sqrt{2}$ per $\sqrt{72}$), $\sqrt{\Delta x^2 - \Delta y^2}$ quando la differenza negativa
è elevata senza parentesi (avviso "Il quadrato di una differenza negativa"), la distanza con il segno meno
di una coordinata negativa perso; poi il coefficiente del radicale cambiato di uno.

### 4. Punti di un asse a distanza data
"Trova i punti dell'asse $x$ (o $y$) che distano $d$ da $A$" (esempio 4). $A$ ha coordinate intere, la
coordinata lungo l'asse tra $-6$ e $6$, l'altra non nulla fino a 8 in valore assoluto. Asse $x$ sei volte su
dieci. Tre casi: due punti (7 su 10; metà con $d$ intero da una terna pitagorica, metà con
$d = \sqrt{t^2 + b^2}$ ridotto, per esempio $2\sqrt{13}$), un punto solo ($d$ uguale alla distanza di $A$
dall'asse, 1,5 su 10), nessun punto ($d$ minore di quella distanza, 1,5 su 10). I punti trovati hanno
sempre coordinate intere.
Esempi: asse $x$, $d = 10$, $A(4, 8)$: $P_1(-2, 0)$, $P_2(10, 0)$; asse $x$, $d = \sqrt{38}$, $A(6, 7)$:
nessun punto.
Distrattori: gli stessi punti sull'altro asse, $(x - a)^2 = d^2$ con l'altra coordinata di $A$ dimenticata
(solo con $d$ intero), il centro con il segno sbagliato ($x = -1 \pm 3$ per $(x - 1)^2 = 9$), una sola
delle due soluzioni, "nessun punto"; nel caso senza punti anche $(x - a)^2 = b^2 - d^2$ e il solo punto
$(a, 0)$.

### 5. Punto medio ed estremo
Metà punto medio di $AB$ (esempio 5), metà estremo $B$ dati $A$ e il punto medio $M$ (esempio 6).
$A$ e $B$ interi tra $-9$ e $9$, con ascisse diverse, ordinate diverse e almeno una coordinata negativa;
per l'estremo si dà $M$, che può avere coordinate frazionarie ($M\left(-\frac{1}{2}, 8\right)$).
Esempi: $A(0, 6)$, $B(-2, 4)$, $M(-1, 5)$; $A(-8, 9)$, $M\left(-\frac{1}{2}, 8\right)$, $B(7, 7)$.
Distrattori del punto medio: la semidifferenza, la somma non divisa per 2, le coordinate scambiate.
Dell'estremo: il punto medio di $AM$ (avviso "La media tra un estremo e il punto medio"), $2A - M$ (i ruoli
scambiati), $2M + A$ (il segno), $B$ con le coordinate scambiate.

### 6. Simmetrici e baricentro
Cinque casi: simmetrico rispetto all'asse $x$ (2 su 10), all'asse $y$ (2 su 10), all'origine (1,5 su 10), a
un punto $C$ (2,5 su 10), baricentro di un triangolo (2 su 10, riquadro della lezione). Per gli assi e
l'origine $P$ ha coordinate non nulle con $|x| \neq |y|$, due volte su dieci l'ascissa è una frazione con
denominatore 2. Per il punto, $A$ e $C$ con ascisse e ordinate diverse e $A'$ entro 12. Per il baricentro
sei volte su dieci $G$ ha coordinate intere, le altre la media può dare terzi.
Esempi: $P(6, -2)$ rispetto all'asse $y$: $P'(-6, -2)$; $A(4, -3)$, $C(6, -1)$: $A'(8, 1)$;
$A(-5, 6)$, $B(5, 5)$, $C(3, 6)$: $G\left(1, \frac{17}{3}\right)$.
Distrattori: rispetto a un asse, la coordinata sbagliata cambiata (avviso "Quale coordinata cambia"),
tutte e due cambiate, le coordinate scambiate; rispetto al punto, il punto medio di $AC$, $2A - C$,
$2C + A$, il simmetrico rispetto all'origine; per il baricentro, la somma divisa per 2, la somma non
divisa, il punto medio di due vertici, le coordinate scambiate.

### 7. Triangoli e parallelogrammi
Vertici interi tra $-8$ e $8$. Tre casi.
- Che triangolo è (4 su 10, esempi 7 e 8): quattro etichette fisse, "isoscele, non rettangolo",
  "rettangolo, non isoscele", "rettangolo e isoscele", "scaleno, non rettangolo". I triangoli si
  costruiscono dal tipo: isoscele con il vertice sull'asse della base (mai rettangolo), rettangolo con due
  cateti perpendicolari di lunghezza diversa, rettangolo isoscele, scaleno a caso; i vertici sono poi
  mescolati. I passaggi confrontano i quadrati dei lati, con il più lungo da una parte (avviso "Confrontare
  i lati sbagliati").
- Quarto vertice $D$ del parallelogramma $ABCD$ (3 su 10, esempio 9): $D$ è il simmetrico di $B$ rispetto
  al punto medio di $AC$. Distrattori: $A + B - C$ (la diagonale $AB$, avviso "L'ordine dei vertici"),
  $B + C - A$, il punto medio $M$ stesso, $D$ con le coordinate scambiate.
- Area (3 su 10): metà triangolo rettangolo con cateti obliqui, di cui trovare l'angolo retto (esempio 8),
  metà triangolo isoscele sulla base $AB$ orizzontale o verticale (esempio 7). Distrattori: il prodotto
  non diviso per 2, il prodotto dei quadrati dei cateti diviso per 2 (radice dimenticata) o la metà della
  somma dei quadrati; per l'isoscele la metà dell'area e base più altezza.
Esempi: $A(4, 5)$, $B(2, -1)$, $C(5, -2)$: rettangolo in $B$, non isoscele ($10 + 40 = 50$);
$A(-3, 1)$, $B(-2, -2)$, $C(-6, 1)$: $D(-7, 4)$.

## Costruzione all'indietro

- Livello 2: si scelgono i segni e le due coordinate che cambiano, poi la coordinata comune.
- Livello 3: si sceglie lo spostamento $(\Delta x, \Delta y)$ (una terna, o due interi con somma dei
  quadrati non quadrata), poi $A$ in modo che $B$ resti tra $-9$ e $9$.
- Livello 4: si sceglie il caso, la distanza di $A$ dall'asse e la semicorda $t$; $d^2 = t^2 + b^2$, e i
  punti $a \pm t$ sono interi per costruzione.
- Livello 5: si scelgono $A$ e $B$, e $M$ si calcola; per l'estremo si danno $A$ e $M$.
- Livello 6: per il baricentro si sceglie $G$ e si calcola $C = 3G - A - B$.
- Livello 7: il triangolo si costruisce dal tipo (vettori perpendicolari $(p, q)$ e $s(-q, p)/\mathrm{MCD}$)
  e si controlla con i quadrati dei lati che il tipo sia quello voluto e che i punti non siano allineati.

Il caso di ogni livello si estrae una volta sola; se i numeri non vanno bene si estraggono di nuovo solo i
numeri, così le quote dei casi restano quelle della specifica.

## Controllo indipendente

Il controllo legge i punti dal LaTeX del problema (e al livello 4 l'asse e $d$ dalla frase), ricalcola con
SymPy (`Point.distance`, `Point.midpoint`, `Point.reflect`, `Triangle.centroid`, `Triangle.is_right`,
`Triangle.area`, `solve` per i punti dell'asse), rilegge ogni opzione dal suo LaTeX e la confronta con i
suoi `values` e con la verità. Pretende: quattro opzioni distinte, una sola giusta e l'indice giusto; le
coppie con `\left(` esattamente quando una coordinata non è intera; ogni numero ridotto (frazioni ai minimi
termini, radicando senza fattori quadrati, coefficiente e denominatore primi tra loro, niente radice al
denominatore), anche nei distrattori, così un distrattore "giusto ma non ridotto" viene bocciato; i vincoli
di ogni livello (intervalli delle coordinate, segmento orizzontale o verticale al 2, obliquo al 3, soluzioni
intere al 4, triangolo non degenere, isoscele sulla base orizzontale o verticale quando il testo lo dice).
Il caso di ogni campione si ricalcola dai numeri e le quote sono in `CASE_RANGES`.

## Verifiche fatte (27 settembre 2026)

- `sample.mts il-piano-cartesiano 1000 all 1 | verify.py`: PASS, 7.000 su 7.000. Con i seed da 7001 e da
  424242: PASS.
- Errori piantati a mano, tutti bocciati (19): opzione giusta spostata (livelli 1, 3, 7), `\left(` tolto
  da una coppia con frazioni, risposta cambiata (distanza al 2, area al 7), coordinata fuori intervallo,
  radicale non ridotto nella risposta ($\sqrt{72}$ nel LaTeX, `sqrt(72)` nel valore), distrattore uguale alla
  risposta ma non ridotto ($\sqrt{72}$ e $\frac{12\sqrt{2}}{2}$ con risposta $6\sqrt{2}$), distanza cambiata
  nel testo del livello 4, LaTeX dell'opzione giusta diverso dai suoi valori (livello 4), valori della
  giusta scambiati (livello 5), asse cambiato nella consegna (livello 6), vertice spostato in un triangolo
  rettangolo e in uno isoscele (il tipo cambia), etichetta dell'opzione giusta cambiata (livello 7).
- `review.mts` esce con 0; `width.mts` esce con 0 (massimi: problema 136 px, opzioni 183 px, il livello 4
  ha il problema tutto in prosa); nessun errore di `tsc` e di `eslint` nel generatore; `steps-scan` pulito.
- Esercizi diversi su 1.000 per livello (consegna e problema): 757, 951, 990, 750, 998, 888, 999. Il
  livello 4 ha il testo più vincolato (punti interi per costruzione) e resta sopra 100.

## Cosa evitare

- Segmenti orizzontali o verticali al livello 3 e obliqui al livello 2.
- Distanze scritte non ridotte ($\sqrt{72}$) o con la radice al denominatore, anche fra i distrattori.
- Coordinate decimali: la virgola decimale si confonde con quella fra le coordinate (esempio 5).
- Punti degli assi o delle bisettrici nei simmetrici rispetto agli assi (le opzioni coinciderebbero).
- Triangoli degeneri, e al livello 4 soluzioni non intere.

## Figure

Il sito non disegna figure negli esercizi: ogni esercizio si regge sulle coordinate. Una figura servirebbe
soprattutto al livello 1 (leggere le coordinate di un punto disegnato, il verso inverso di oggi), al
livello 4 (i due punti sull'asse, come la figura dell'esempio 4) e al livello 7 (il triangolo e il
parallelogramma, per vedere l'angolo retto e l'ordine dei vertici). Anche il 2 e il 6 ne guadagnerebbero
(contare i quadretti, vedere il simmetrico), mentre 3 e 5 sono calcoli che stanno bene senza.

## Domande per la revisione

- Livello 1: i punti degli assi hanno come risposta "asse $x$" o "asse $y$" e mai "nessun quadrante",
  come dice la lezione. Va bene non chiedere anche "sotto l'origine" o "a destra"?
- Livello 3: nel caso frazionario il passaggio scrive $\sqrt{\frac{146}{4}} = \frac{\sqrt{146}}{2}$, con
  il denominatore comune già quadrato, come l'esempio 3. Un radicando come 146 è accettabile o conviene
  limitarlo (per esempio sotto 100)?
- Livello 4: la distanza a volte è un radicale ($2\sqrt{13}$), che la lezione non mostra in questo tipo di
  esercizio. Si tiene, o solo distanze intere?
- Livello 6: il baricentro sta nel livello dei simmetrici perché nella lezione è un riquadro che si può
  saltare. Se il riquadro esce dalla lezione, il caso va tolto.
- Livello 7: le quattro etichette ("isoscele, non rettangolo" e così via) sono comode per la scelta
  multipla ma più rigide del "che triangolo è?" della lezione. Va bene così?
