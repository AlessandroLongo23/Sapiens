# La parabola nel piano cartesiano

Generatore: `parabola-equazione` (`src/lib/exercises/v2/generators/parabola-equazione.ts`, con il modulo comune
`src/lib/exercises/v2/circonferenza-parabola.ts`). Verifica indipendente:
`scripts/exercises/checkers/parabola_equazione.py` (aiuti comuni in `_circonferenza_parabola.py`). Lezione
collegata: `docs/lezioni/riscritte/116-parabola-equazione.md`.

Sei livelli nell'ordine della lezione: fuoco e direttrice di $y = ax^2$; vertice, fuoco e direttrice di
$y = ax^2 + bx + c$; gli stessi elementi per $x = ay^2 + by + c$; equazione da fuoco e direttrice orizzontale;
equazione da fuoco e direttrice verticale; equazione da vertice e un punto. La parabola per tre punti è già il
livello 7 di `funzioni-quadratiche`.

## Forma della risposta

- Equazione $y = ax^2 + bx + c$ (livelli 4 e 6): `expression` con `form: "expanded"`, `value` il secondo membro
  in SymPy e `latex` l'equazione intera, come il livello 7 di `funzioni-quadratiche`.
- Equazione $x = ay^2 + by + c$ (livello 5), punti (vertice, fuoco) ed equazione della direttrice: scelta
  multipla.
- Sempre la variante a scelta multipla, con quattro opzioni.

## Rappresentazione (`params`)

`case` ai livelli 1-3 (`vertice`, `fuoco`, `direttrice`); `axis` (`y` o `x`); `a`, `b`, `c`; `F`, `directrix`;
`V`, `A`; `options`.

Il verificatore rilegge la parabola, il fuoco, la direttrice e i punti dal LaTeX. Calcola vertice, fuoco e
direttrice con le formule con $\Delta$ e poi li mette alla prova della definizione: la differenza tra i quadrati
delle distanze di un punto dal fuoco e dalla direttrice deve essere l'equazione moltiplicata per una costante.
L'equazione da fuoco e direttrice la trova risolvendo quella stessa condizione.

## Livello 1: fuoco e direttrice di y = ax²

$|a| \in \{\frac{1}{12}, \frac{1}{8}, \frac{1}{4}, \frac{1}{2}, 1, 2, 3, 4\}$, segno qualunque. Si chiede il fuoco
(50 %) o la direttrice (50 %).

- $y = 3x^2$: $y = -\frac{1}{12}$ (caso `direttrice`)
- $y = 3x^2$: $F\left(0, \frac{1}{12}\right)$ (caso `fuoco`)

Distrattori: $\frac{a}{4}$ al posto di $\frac{1}{4a}$ (avviso "Uno su quattro a"), il segno sbagliato (fuoco e
direttrice dalla parte opposta), il fuoco sull'asse $x$ o la direttrice verticale, $4a$.

## Livello 2: vertice, fuoco e direttrice

$y = ax^2 + bx + c$ con $|a| \in \{\frac{1}{4}, \frac{1}{2}, 1, 2\}$, vertice intero con ascissa non nulla,
$b \neq 0$, $c \neq 0$ con denominatore al massimo $2$. Si chiede il vertice, il fuoco o la direttrice, con la
stessa frequenza.

- $y = x^2 - 6x + 14$: $V(3, 5)$ (caso `vertice`)
- $y = x^2 + 4x + 4$: $y = -\frac{1}{4}$ (caso `direttrice`)

Distrattori: fuoco e direttrice scambiati di parte; $\frac{a}{4}$; il fuoco di $y = ax^2$ senza spostarlo nel
vertice; il segno dell'ascissa del vertice; per il vertice, l'ordinata $c$.

## Livello 3: parabola con asse parallelo all'asse x

$x = ay^2 + by + c$, stessi vincoli con i ruoli scambiati. Stesse tre domande.

- $x = y^2 - 6y + 14$: $V(5, 3)$ (caso `vertice`)
- $x = y^2 + 4y + 4$: $x = -\frac{1}{4}$ (caso `direttrice`)

Distrattori: per primo le coordinate scambiate (avviso "In x = ay² + by + c le formule si scambiano") o la
direttrice orizzontale; poi quelli del livello 2.

## Livello 4: equazione da fuoco e direttrice orizzontale

Fuoco intero, direttrice $y = k$ con $k$ intero; distanza tra fuoco e direttrice $1$, $2$ o $4$ (quindi
$|a| = \frac{1}{2}, \frac{1}{4}, \frac{1}{8}$). Risposta $y = ax^2 + bx + c$ con $c$ di denominatore al massimo $2$.

- $F(0, 6)$ \quad $d\colon y = 4$: $y = \frac{1}{4}x^2 + 5$
- $F(-4, 0)$ \quad $d\colon y = 2$: $y = -\frac{1}{4}x^2 - 2x - 3$

Distrattori: la concavità sbagliata ($-a$ con lo stesso vertice); il vertice messo nel fuoco; $2a$; il vertice
messo sulla direttrice.

## Livello 5: equazione da fuoco e direttrice verticale

Come il livello 4 con la direttrice $x = k$: risposta $x = ay^2 + by + c$, a scelta multipla.

- $F(6, 0)$ \quad $d\colon x = 4$: $x = \frac{1}{4}y^2 + 5$
- $F(0, -4)$ \quad $d\colon x = 2$: $x = -\frac{1}{4}y^2 - 2y - 3$

Distrattori: quelli del livello 4, più l'equazione con $x$ e $y$ scambiate ($y = ax^2 + \dots$).

## Livello 6: equazione da vertice e un punto

Vertice e punto interi, non allineati in verticale né in orizzontale;
$|a| \in \{\frac{1}{4}, \frac{1}{2}, 1, 2, 3\}$. Risposta $y = ax^2 + bx + c$ sviluppata.

- $V(2, -1)$ \quad $A(6, -9)$: $y = -\frac{1}{2}x^2 + 2x - 3$
- $V(-4, 2)$ \quad $A(-5, 0)$: $y = -2x^2 - 16x - 30$

Distrattori: $a$ calcolato senza elevare al quadrato la differenza delle ascisse; il segno del vertice dentro la
parentesi; la concavità sbagliata; il segno dell'ordinata del vertice.

## Esercizi da evitare

- Vertice nell'origine ai livelli 2-6 (sarebbe il livello 1).
- Coefficienti con denominatore oltre $4$ nell'equazione sviluppata.
- Al livello 6 il punto $A$ alla stessa altezza del vertice ($a = 0$).

## Verifiche fatte

Il 5 ottobre 2026: `sample.mts <id> 1000 all <seed> | verify.py` dà PASS con i seed 1, 50001 e 777001, senza
violazioni del `check()` del generatore; errori piantati in 25 campioni per livello (risposta cambiata, indice
della scelta spostato, opzione giusta sostituita con una sbagliata) tutti bocciati; un numero cambiato nel testo
del problema è bocciato tranne dove la risposta resta la stessa; `review.mts` e `width.mts` escono con 0; eslint
pulito. I livelli a risposta aperta sono stati provati con `gradeOpen` (riferimento promosso, distrattori
bocciati) senza toccare `open-answers.ts`.

## Domande per la revisione

- Ai livelli 2 e 3 il fuoco ha spesso coordinate frazionarie (quarti, ottavi): va bene?
- Al livello 5 l'equazione $x = ay^2 + by + c$ resta a scelta multipla: serve la risposta aperta?
- Manca un livello sull'asse e sulle intersezioni con gli assi di $x = ay^2 + by + c$: lo volete?
- La parabola per tre punti resta al livello 7 di `funzioni-quadratiche`: va ripetuta qui?
