# Circonferenza e rette

Generatore: `circonferenza-rette` (`src/lib/exercises/v2/generators/circonferenza-rette.ts`, con il modulo comune
`src/lib/exercises/v2/circonferenza-parabola.ts`). Verifica indipendente:
`scripts/exercises/checkers/circonferenza_rette.py` (aiuti comuni in `_circonferenza_parabola.py`). Lezione
collegata: `docs/lezioni/riscritte/115-circonferenza-rette.md`.

Sette livelli nell'ordine della lezione: posizione di una retta con la distanza; punti di intersezione; lunghezza
della corda; tangente in un punto della circonferenza; tangenti da un punto esterno; circonferenza tangente a
una retta; posizione di due circonferenze.

## Forma della risposta

- Lunghezza della corda (livello 3): `number` se razionale, altrimenti `expression` con `form: "simplified"`,
  `value` in SymPy (`2*sqrt(7)`) e `latex` con il radicale semplificato.
- Tangente obliqua (livello 4, caso `obliqua`): `expression` con `form: "explicit"`, `value` il secondo membro di
  $y = mx + q$ in SymPy, `latex` l'equazione intera, come nel generatore `equazione-di-una-retta`. Le tangenti
  parallele agli assi restano a scelta multipla.
- Coefficienti angolari delle due tangenti (livello 5): `set` di due razionali in ordine crescente.
- Posizioni (livelli 1 e 7), punti di intersezione (livello 2), equazioni di circonferenza (livello 6): scelta
  multipla.
- Sempre la variante a scelta multipla, con quattro opzioni (tre al livello 1).

La circonferenza con il centro nell'origine è scritta $x^2 + y^2 = r^2$, le altre in forma generale; le rette di
cui serve la distanza sono in forma implicita, $r\colon 3x + 4y - 36 = 0$.

## Rappresentazione (`params`)

`case` dove il livello ha più casi; `centre`, `r` o `r2`; `line` (i coefficienti come li scrive il problema);
`P`; `points`, `slopes`, `d`; `c1`, `c2` (centro e raggio delle due circonferenze); `options`.

Il verificatore rilegge circonferenze, rette e punti dal LaTeX del problema e li trasforma in oggetti di
`sympy.geometry`: posizione e punti comuni da `Circle.intersection`, la corda dalla distanza tra i due punti, la
tangente in un punto dalla perpendicolare al raggio, le tangenti da un punto risolvendo in $m$ "distanza del
centro uguale al raggio".

## Livello 1: posizione di una retta con la distanza

Centro intero tra $-4$ e $4$, raggio intero da $2$ a $5$. Retta $ax + by + c = 0$ con $(a, b)$ da una terna
pitagorica primitiva ($3, 4$ o $5, 12$, in qualunque ordine, $b$ di segno qualunque), $c \neq 0$: la distanza è
intera. Secante, tangente, esterna con la stessa frequenza; tre opzioni.

- $x^2 + y^2 + 2x - 8y + 8 = 0$ \quad $r\colon 3x + 4y + 2 = 0$: $\text{tangente}$ (caso `tangente`)
- $x^2 + y^2 + 6x - 6y + 14 = 0$ \quad $r\colon 5x + 12y - 73 = 0$: $\text{esterna}$ (caso `esterna`)

## Livello 2: punti di intersezione

Retta $y = mx + q$ con $m$ intero non nullo, $|m| \le 3$, $q \neq 0$, che passa per due punti a coordinate intere
di una circonferenza con $r^2 \in \{5, 10, 13, 17, 25\}$.

- $x^2 + y^2 = 5$ \quad $r\colon y = 3x - 5$: $(1, -2),\ (2, 1)$
- $x^2 + y^2 + 6x + 2y = 0$ \quad $r\colon y = 2x + 10$: $(-6, -2),\ (-4, 2)$

Distrattori: le ordinate calcolate con il segno di $q$ sbagliato; le coordinate scambiate; le ordinate con il
segno opposto; le ascisse con il segno opposto; le ordinate incrociate.

## Livello 3: lunghezza della corda

Raggio intero da $2$ a $6$, retta pitagorica a distanza intera $d$ con $0 < d < r$. Risposta $2\sqrt{r^2 - d^2}$.

- $x^2 + y^2 + 2x - 8y + 1 = 0$ \quad $r\colon 4x + 3y + 2 = 0$: $\overline{AB} = 4\sqrt{3}$
- $x^2 + y^2 + 8x - 6y + 21 = 0$ \quad $r\colon 3x + 4y - 5 = 0$: $\overline{AB} = 2\sqrt{3}$

Distrattori: metà corda ($\sqrt{r^2 - d^2}$), $2\sqrt{r^2 + d^2}$, $2(r - d)$, $2(r^2 - d^2)$ senza radice.

## Livello 4: tangente in un punto della circonferenza

Punto a coordinate intere sulla circonferenza. Tangente obliqua (75 %, $r^2 \in \{5, 10, 13, 17, 25\}$, risposta
in forma esplicita) oppure parallela a un asse (25 %, raggio intero, casi `verticale` e `orizzontale`).

- $x^2 + y^2 + 6x - 16 = 0$ \quad $P(1, 3)$: $y = -\frac{4}{3}x + \frac{13}{3}$ (caso `obliqua`)
- $x^2 + y^2 + 6x - 6y - 7 = 0$ \quad $P(-3, 8)$: $y = 8$ (caso `orizzontale`)

Distrattori: la retta per $P$ con il coefficiente angolare del raggio; l'opposto senza il reciproco; il
reciproco senza l'opposto; la retta giusta fatta passare per il centro. Per i casi paralleli agli assi: l'altra
direzione, la retta per il centro.

## Livello 5: tangenti da un punto esterno

Si chiedono i due coefficienti angolari. La circonferenza ha il centro nell'origine (60 %) o un centro intero
tra $-2$ e $2$; $r^2 \in \{5, 10, 13, 17, 25\}$. Il punto $P$ è l'incontro delle tangenti in due punti a
coordinate intere, ha coordinate intere entro $12$, e nessuna delle due tangenti è verticale; coefficienti
angolari razionali con denominatore al massimo $4$.

- $x^2 + y^2 + 4x - 21 = 0$ \quad $P(-3, -7)$: $m_1 = -\frac{4}{3}, \quad m_2 = \frac{3}{4}$
- $x^2 + y^2 = 10$ \quad $P(-4, 2)$: $m_1 = -3, \quad m_2 = \frac{1}{3}$

Distrattori: i due valori con il segno opposto; gli antireciproci (i coefficienti angolari dei raggi); i
reciproci; un solo segno sbagliato.

## Livello 6: circonferenza tangente a una retta

Centro intero con coordinate non nulle tra $-5$ e $5$. Tangente a una retta pitagorica a distanza intera da $1$
a $5$ (70 %, caso `retta`) o a un asse (30 %, caso `asse`, con $|\alpha| \neq |\beta|$). Risposta in forma
generale.

- $C(5, -4)$ \quad $r\colon 3x + 4y + 16 = 0$: $x^2 + y^2 - 10x + 8y + 32 = 0$ (caso `retta`)
- $C(-1, -3)$: $x^2 + y^2 + 2x + 6y + 9 = 0$ (caso `asse`)

Distrattori: $r$ non elevato al quadrato; i segni di $a$ e $b$; il numeratore della distanza senza $c$;
$c = -r^2$; per gli assi, il raggio preso dall'altra coordinata.

## Livello 7: posizione di due circonferenze

Centri interi, raggi interi diversi da $1$ a $8$, distanza tra i centri intera. I cinque casi (esterne, tangenti
esternamente, secanti, tangenti internamente, una interna all'altra) con la stessa frequenza; quattro opzioni,
la giusta e le tre posizioni più vicine.

- $x^2 + y^2 + 6x - 16 = 0$ \quad $x^2 + y^2 + 8x - 20 = 0$: $\text{tangenti internamente}$ (caso `tangenti internamente`)
- $x^2 + y^2 + 2x + 4y + 4 = 0$ \quad $x^2 + y^2 - 4x + 12y - 24 = 0$: $\text{una interna all'altra}$ (caso `una interna all'altra`)

## Esercizi da evitare

- Rette con $c = 0$ ai livelli 1, 3 e 6, e termini noti oltre $99$.
- Al livello 3, la retta per il centro ($d = 0$): la corda sarebbe il diametro, senza Pitagora.
- Al livello 5, una tangente verticale (l'equazione in $m$ sarebbe di primo grado: è l'avviso della lezione, ma
  la risposta non sarebbe un insieme di due numeri).
- Al livello 7, raggi uguali (la differenza dei raggi sarebbe zero) e circonferenze concentriche.

## Verifiche fatte

Il 5 ottobre 2026: `sample.mts <id> 1000 all <seed> | verify.py` dà PASS con i seed 1, 50001 e 777001, senza
violazioni del `check()` del generatore; errori piantati in 25 campioni per livello (risposta cambiata, indice
della scelta spostato, opzione giusta sostituita con una sbagliata) tutti bocciati; un numero cambiato nel testo
del problema è bocciato tranne dove la risposta resta la stessa; `review.mts` e `width.mts` escono con 0; eslint
pulito. I livelli a risposta aperta sono stati provati con `gradeOpen` (riferimento promosso, distrattori
bocciati) senza toccare `open-answers.ts`.

## Domande per la revisione

- Al livello 5 si chiedono i coefficienti angolari, non le equazioni delle tangenti: basta?
- Al livello 4 la tangente è chiesta in forma esplicita, mentre la lezione la scrive in forma implicita: quale
  forma volete nella risposta aperta?
- Serve un livello sull'asse radicale e sui punti comuni a due circonferenze?
- Il caso della tangente verticale da un punto esterno (esempio 5 della lezione) manca: lo volete a scelta
  multipla?
