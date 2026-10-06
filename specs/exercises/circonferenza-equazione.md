# Equazione della circonferenza

Generatore: `circonferenza-equazione` (`src/lib/exercises/v2/generators/circonferenza-equazione.ts`, con il modulo
comune `src/lib/exercises/v2/circonferenza-parabola.ts`). Verifica indipendente:
`scripts/exercises/checkers/circonferenza_equazione.py` (aiuti comuni in `_circonferenza_parabola.py`). Lezione
collegata: `docs/lezioni/riscritte/114-circonferenza-equazione.md`.

Sette livelli nell'ordine della lezione: centro e raggio letti da $(x - \alpha)^2 + (y - \beta)^2 = r^2$; punto
interno, esterno o sulla circonferenza; dal centro e dal raggio alla forma generale; centro e raggio dalla forma
generale; circonferenza, punto o nessun punto; coefficienti da dividere; equazione da condizioni. Ogni livello
aggiunge una difficoltà al precedente.

## Forma della risposta

- Un raggio (livelli 4 e 6, caso `raggio`): `number`, `value` come `"5/2"`. A questi livelli il raggio è sempre
  razionale.
- Tutto il resto è a scelta multipla (`answer.kind = "choice"`): un centro è una coppia, un'equazione di
  circonferenza non è nella forma $y = f(x)$, la posizione di un punto è una parola.
- Sempre la variante a scelta multipla: la risposta giusta e tre distrattori distinti (due al livello 2, dove le
  risposte possibili sono tre), presi in ordine dagli errori della lezione. `params.options` li elenca con la
  risposta giusta per prima; `toChoice` li rimescola.

Notazione della lezione: centro $C(\alpha, \beta)$, forma generale $x^2 + y^2 + ax + by + c = 0$, coordinate con
la virgola, dati separati da `\quad`.

## Rappresentazione (`params`)

- `case`: il caso del livello, dove ce n'è più d'uno.
- `centre`, `r2` o `r`: centro e raggio scelti; `P`, `A`, `B`, `C`, `points`: i punti del problema.
- `options`: le opzioni, la giusta per prima.

Il verificatore non ricalcola dai `params`: rilegge equazione, punti e raggio dal LaTeX del problema e la domanda
dalla consegna, ricava centro e raggio dai coefficienti del polinomio sviluppato, la circonferenza per tre punti
con `Circle` di SymPy, e rilegge ogni opzione dal suo LaTeX.

## Livello 1: centro e raggio dall'equazione

Equazione $(x - \alpha)^2 + (y - \beta)^2 = r^2$ con centro intero tra $-6$ e $6$, non l'origine. Raggio intero da
$2$ a $7$ (70 %, caso `intero`) oppure $r^2 \in \{2, 3, 5, 6, 7, 10, 13\}$ (30 %, caso `radice`). Risposta:
`C(α, β),\ r = …`.

- $(x - 2)^2 + (y + 6)^2 = 49$: $C(2, -6),\ r = 7$ (caso `intero`)
- $(x + 6)^2 + (y + 6)^2 = 7$: $C(-6, -6),\ r = \sqrt{7}$ (caso `radice`)

Distrattori: i segni del centro cambiati (avviso "I segni del centro e il quadrato del raggio"), $r^2$ al posto
di $r$, tutti e due gli errori, le coordinate scambiate.

## Livello 2: punto interno, esterno o sulla circonferenza

Circonferenza nella stessa forma, centro tra $-4$ e $4$, $r^2 \in \{5, 10, 13, 17, 25\}$ (così esistono punti a
coordinate intere sulla circonferenza). Punto $P$ intero, diverso dal centro. I tre casi con la stessa frequenza;
tre opzioni.

- $(x - 1)^2 + (y + 4)^2 = 13$ \quad $P(7, -1)$: $\text{esterno}$ (caso `esterno`)
- $(x - 2)^2 + (y + 2)^2 = 10$ \quad $P(5, -1)$: $\text{sulla circonferenza}$ (caso `sulla circonferenza`)

## Livello 3: dal centro e dal raggio alla forma generale

Centro intero tra $-5$ e $5$, non l'origine; raggio intero da $1$ a $6$.

- $C(1, -5)$ \quad $r = 4$: $x^2 + y^2 - 2x + 10y + 10 = 0$
- $C(2, 3)$ \quad $r = 1$: $x^2 + y^2 - 4x - 6y + 12 = 0$

Distrattori: i segni di $a$ e $b$ non cambiati; $c = -r^2$ (i quadrati del centro dimenticati); $r$ non elevato
al quadrato in $c$; $a$ e $b$ non raddoppiati; $c = \alpha^2 + \beta^2 + r^2$.

## Livello 4: centro e raggio dalla forma generale

$x^2 + y^2 + ax + by + c = 0$ con $a$, $b$ pari, $c \neq 0$, raggio intero da $1$ a $7$. Si chiede il raggio
(60 %, risposta aperta) o il centro (40 %).

- $x^2 + y^2 - 4x + 12y + 24 = 0$: $C(2, -6)$ (caso `centro`)
- $x^2 + y^2 - 6x + 4y + 9 = 0$: $r = 2$ (caso `raggio`)

Distrattori del raggio: $\sqrt{-c}$ o $\sqrt{c}$ (avviso "Il raggio non è la radice di c"), $r^2$, la radice con
$+c$, la radice con $a$ e $b$ non dimezzati. Distrattori del centro: i segni non cambiati, i coefficienti non
dimezzati, le coordinate scambiate.

## Livello 5: circonferenza, punto o nessun punto

Stessa forma, $a$ e $b$ pari, $c \neq 0$. Circonferenza con raggio intero da $1$ a $6$ (40 %), un solo punto
(30 %), nessun punto (30 %). Opzioni: `una circonferenza, r = …`, `il solo punto (…)`, `nessun punto`.

- $x^2 + y^2 + 10x + 25 = 0$: $\text{il solo punto } (-5, 0)$ (caso `punto`)
- $x^2 + y^2 + 4x + 4y + 13 = 0$: $\text{nessun punto}$ (caso `nessuno`)

Distrattori: gli altri due casi e una circonferenza con il raggio sbagliato ($\sqrt{|c|}$, il valore assoluto di
$\alpha^2 + \beta^2 - c$ quando è negativo).

## Livello 6: coefficienti da dividere

$kx^2 + ky^2 + \dots = 0$ con $k \in \{2, 3, 4\}$, coefficienti interi; dopo la divisione il centro ha almeno una
coordinata frazionaria (mezzi) e il raggio è razionale. Si chiede il raggio (60 %) o il centro (40 %).

- $4x^2 + 4y^2 + 12x - 8y - 23 = 0$: $r = 3$ (caso `raggio`)
- $2x^2 + 2y^2 - 6x - 20 = 0$: $C\left(\frac{3}{2}, 0\right)$ (caso `centro`)

Distrattori: centro e raggio calcolati senza dividere (avviso "Leggere a, b e c senza dividere"), poi quelli del
livello 4.

## Livello 7: equazione da condizioni

Centro e un punto (35 %), estremi di un diametro (35 %, con il punto medio intero), tre punti (30 %, punti a
coordinate intere di una circonferenza con centro intero e $r^2 \in \{5, 10, 13, 17, 25\}$). Risposta in forma
generale.

- $A(-8, -4)$ \quad $B(0, 4)$: $x^2 + y^2 + 8x - 16 = 0$ (caso `diametro`)
- $A(1, 1)$ \quad $B(2, -4)$ \quad $D(-4, -4)$: $x^2 + y^2 + 2x + 4y - 8 = 0$ (caso `tre punti`)

Distrattori: i segni di $a$ e $b$; il centro messo nel punto $A$; $c = -r^2$; per il diametro, $\overline{AB}^2$
al posto di $r^2$; per i tre punti, gli errori di segno nel sistema ($a$ e $b$ opposti, $c$ opposto, $a$ e $b$
scambiati).

## Esercizi da evitare

- Centro nell'origine ai livelli 1-6 (l'errore dei segni non si vedrebbe) e $c = 0$ ai livelli 4-6.
- Al livello 2, il punto coincidente con il centro.
- Opzioni che coincidono: con $r = 1$ è $r^2 = r$; il generatore passa al distrattore successivo.
- Coordinate oltre $12$ in valore assoluto.

## Verifiche fatte

Il 5 ottobre 2026: `sample.mts <id> 1000 all <seed> | verify.py` dà PASS con i seed 1, 50001 e 777001, senza
violazioni del `check()` del generatore; errori piantati in 25 campioni per livello (risposta cambiata, indice
della scelta spostato, opzione giusta sostituita con una sbagliata) tutti bocciati; un numero cambiato nel testo
del problema è bocciato tranne dove la risposta resta la stessa; `review.mts` e `width.mts` escono con 0; eslint
pulito. I livelli a risposta aperta sono stati provati con `gradeOpen` (riferimento promosso, distrattori
bocciati) senza toccare `open-answers.ts`.

## Domande per la revisione

- Al livello 1 la risposta è "centro e raggio" insieme: va bene, o meglio due domande separate?
- Al livello 5 l'opzione "una circonferenza, r = …" con il raggio sbagliato è un distrattore credibile?
- Al livello 7 i tre punti hanno sempre coordinate intere e il centro è intero: serve un caso con il centro
  frazionario?
- Le equazioni di circonferenza restano a scelta multipla: va bene, o serve la risposta aperta?
