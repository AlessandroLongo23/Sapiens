# Parabola e rette

Generatore: `parabola-rette` (`src/lib/exercises/v2/generators/parabola-rette.ts`, con il modulo comune
`src/lib/exercises/v2/circonferenza-parabola.ts`). Verifica indipendente:
`scripts/exercises/checkers/parabola_rette.py` (aiuti comuni in `_circonferenza_parabola.py`). Lezione collegata:
`docs/lezioni/riscritte/117-parabola-rette.md`.

Sette livelli nell'ordine della lezione: posizione di una retta con il discriminante; il valore di $q$ per cui
$y = mx + q$ è tangente; coefficiente angolare della tangente in un punto; equazione della tangente in un punto;
tangente parallela a una retta data; tangenti da un punto esterno; area del segmento parabolico. Il sistema
retta-parabola con i punti comuni è già il livello 3 di `sistemi-secondo-grado`.

## Forma della risposta

- Numeri (livelli 2, 3 e 7): `number`, razionale esatto.
- Equazione di una tangente (livelli 4 e 5): `expression` con `form: "explicit"`, `value` il secondo membro di
  $y = mx + q$ in SymPy, `latex` l'equazione intera.
- Coefficienti angolari delle due tangenti (livello 6): `set` di due interi in ordine crescente.
- Posizione (livello 1): scelta multipla con tre opzioni.
- Sempre la variante a scelta multipla.

## Rappresentazione (`params`)

`case` ai livelli 1 e 7; `parabola` ($a$, $b$, $c$); `line` ($m$, $q$); `m`; `x0`; `P`; `options`.

Il verificatore rilegge parabola, retta e punto dal LaTeX. La posizione viene dal numero di soluzioni reali del
sistema; la tangente in un punto dalla derivata, che la lezione non usa; il valore di $q$ e i coefficienti
angolari delle tangenti da un punto dal discriminante della risolvente; l'area da un integrale.

## Livello 1: posizione di una retta con il discriminante

Parabola $y = ax^2 + bx + c$ con $|a| \in \{\frac{1}{2}, 1, 2\}$, $b$ e $c$ interi non nulli. Retta $y = mx + q$
con $m$ intero non nullo. Quando ci sono, i punti comuni hanno ascissa intera. I tre casi con la stessa
frequenza; tre opzioni.

- $y = -\frac{1}{2}x^2 + 8x - 10$ \quad $r\colon y = 4x - 2$: $\text{tangente}$ (caso `tangente`)
- $y = x^2 + x + 1$ \quad $r\colon y = 3x - 2$: $\text{esterna}$ (caso `esterna`)

## Livello 2: il valore di q per cui la retta è tangente

Parabola con $|a| \in \{\frac{1}{4}, \frac{1}{2}, 1, 2\}$, $b$ e $c$ interi; retta $y = mx + q$ con $m$ intero non
nullo, diverso da $b$ (la risolvente conserva il termine in $x$), e $q$ da trovare, razionale con denominatore
al massimo $4$.

- $y = x^2 + 5$ \quad $r\colon y = 8x + q$: $q = -11$
- $y = -x^2 - 4x + 2$ \quad $r\colon y = -2x + q$: $q = 3$

Distrattori: il segno sbagliato davanti a $\frac{(b - m)^2}{4a}$; $(b + m)^2$ al posto di $(b - m)^2$; l'opposto;
$2a$ al posto di $4a$; l'ordinata del punto di contatto.

## Livello 3: coefficiente angolare della tangente in un punto

Punto di ascissa $x_0$ intera non nulla e ordinata intera. Risposta $m = 2ax_0 + b$.

- $y = -\frac{1}{2}x^2 + 2x - 1$ \quad $x_0 = 4$: $m = -2$
- $y = -x^2 - 4x + 2$ \quad $x_0 = -1$: $m = -2$

Distrattori: $ax_0 + b$ (il $2$ dimenticato); $2ax_0$ ($b$ dimenticato); l'ordinata $y_0$; $2ax_0 - b$; l'opposto.

## Livello 4: equazione della tangente in un punto

Stessi dati, tangente non orizzontale. Risposta in forma esplicita.

- $y = -\frac{1}{2}x^2 + 2x - 1$ \quad $x_0 = 4$: $y = -2x + 7$
- $y = -x^2 - 4x + 2$ \quad $x_0 = -1$: $y = -2x + 3$

Distrattori: la retta per il punto con $ax_0 + b$ o con $2ax_0$; $y = mx + y_0$ (il termine $-mx_0$ dimenticato);
il segno di $mx_0$ sbagliato; il coefficiente angolare opposto.

## Livello 5: tangente parallela a una retta data

Retta data $y = mx + q$ con $m$ intero non nullo; il punto di contatto ha ascissa intera. La retta data non è già
la tangente.

- $y = x^2 + 5$ \quad $r\colon y = 8x - 3$: $y = 8x - 11$
- $y = x^2 - 4x + 4$ \quad $r\colon y = -12x - 2$: $y = -12x - 12$

Distrattori: il punto di contatto trovato con $(m + b)$ al posto di $(m - b)$, o dividendo per $a$ invece che per
$2a$; $y = mx + y_0$; $y = mx + c$.

## Livello 6: tangenti da un punto esterno

Si chiedono i due coefficienti angolari. $|a| \in \{\frac{1}{4}, \frac{1}{2}, 1\}$; punto $P$ intero, esterno;
i punti di contatto hanno ascissa intera e i coefficienti angolari sono interi.

- $y = \frac{1}{2}x^2 + 5$ \quad $P(3, 9)$: $m_1 = 2, \quad m_2 = 4$
- $y = -\frac{1}{2}x^2 - 4x + 2$ \quad $P(-1, 10)$: $m_1 = -6, \quad m_2 = 0$

Distrattori: i due valori con il segno opposto; i valori senza $b$; $at + b$ al posto di $2at + b$; un solo
segno sbagliato.

## Livello 7: area del segmento parabolico

$|a| \in \{\frac{1}{4}, \frac{1}{2}, 1, 2, 3\}$. Corda perpendicolare all'asse (50 %, retta $y = k$, caso
`orizzontale`) oppure obliqua (50 %, $m$ intero non nullo). Gli estremi della corda hanno ascissa intera, a
distanza da $2$ a $6$; area con denominatore al massimo $3$.

- $y = \frac{1}{2}x^2 + 3x + 3$ \quad $r\colon y = x + 3$: $\text{Area} = \frac{16}{3}$ (caso `obliqua`)
- $y = -\frac{1}{4}x^2 + x - 1$ \quad $r\colon y = -1$: $\text{Area} = \frac{8}{3}$ (caso `orizzontale`)

Distrattori: l'area del rettangolo (i due terzi dimenticati); l'area del triangolo $ABV$ (avviso "Due terzi del
rettangolo, non del triangolo"); il doppio; $|x_2 - x_1|^2$ al posto del cubo.

## Esercizi da evitare

- Rette verticali o parallele all'asse della parabola: un punto comune senza tangenza (è un avviso della
  lezione, non un esercizio di conto).
- Al livello 1, punti comuni con ascissa non intera.
- Al livello 4, la tangente nel vertice ($m = 0$).
- Al livello 6, punti interni o sulla parabola.

## Verifiche fatte

Il 5 ottobre 2026: `sample.mts <id> 1000 all <seed> | verify.py` dà PASS con i seed 1, 50001 e 777001, senza
violazioni del `check()` del generatore; errori piantati in 25 campioni per livello (risposta cambiata, indice
della scelta spostato, opzione giusta sostituita con una sbagliata) tutti bocciati; un numero cambiato nel testo
del problema è bocciato tranne dove la risposta resta la stessa; `review.mts` e `width.mts` escono con 0; eslint
pulito. I livelli a risposta aperta sono stati provati con `gradeOpen` (riferimento promosso, distrattori
bocciati) senza toccare `open-answers.ts`.

## Domande per la revisione

- Al livello 6 si chiedono i coefficienti angolari, non le equazioni delle tangenti: basta?
- Al livello 7 la formula $\frac{|a| \cdot |x_2 - x_1|^3}{6}$ è usata per le corde oblique: è ammessa?
- Mancano le tangenti alle parabole con asse orizzontale e la parabola tangente a una retta con due soluzioni
  (esempi 5 e 6 della lezione): li volete?
- Al livello 2 la lettera $q$ nella retta è chiara, o meglio $k$?
