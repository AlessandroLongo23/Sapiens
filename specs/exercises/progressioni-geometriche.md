# Progressioni geometriche

Generatore: `progressioni-geometriche` (`src/lib/exercises/v2/generators/progressioni-geometriche.ts`), con i
pezzi comuni in `src/lib/exercises/v2/successioni.ts`. Verifica indipendente:
`scripts/exercises/checkers/progressioni_geometriche.py`. Lezione collegata:
`docs/lezioni/riscritte/112-progressioni-geometriche.md`.

Sette livelli nell'ordine della lezione: la ragione dai primi termini; un termine da $a_1$ e $q$; crescente,
decrescente o a segni alterni; la ragione da due termini; il posto di un termine; la somma dei primi $n$
termini; la crescita a percentuale costante. Notazione della lezione: $a_1$, $q$, $a_n = a_1 \cdot q^{n-1}$,
$S_n = a_1 \cdot \frac{q^n - 1}{q - 1}$. Niente serie.

## Tipi di risposta

| Livello | Risposta | Scelta multipla |
|---|---|---|
| 1, 2, 5, 6, 7 | `number` | costruita con l'esercizio |
| 3 | `choice` (quattro etichette fisse) | la risposta stessa |
| 4 | `set` (una ragione, oppure due opposte) | costruita con l'esercizio |

## Livello 1: la ragione dai primi termini

Quattro termini interi seguiti dai puntini. `intera` (60%): $q \in \{2, 3, -2, -3, 4, 5, -4, 10\}$, $a_1$ intero
non nullo tra $-6$ e 6. `frazionaria` (40%): $q \in \{\frac{1}{2}, \frac{1}{3}, -\frac{1}{2}, \frac{3}{2},
\frac{2}{3}, -\frac{1}{3}\}$, con $a_1$ multiplo del cubo del denominatore. `params`: `case`, `terms`.
Distrattori: $\frac{1}{q}$ (avviso "La ragione è il termine dopo diviso il termine prima"), la differenza
$a_2 - a_1$, $-q$.

1. $3, -12, 48, -192, \dots$: $q = \frac{-12}{3} = -4$.
2. $54, 36, 24, 16, \dots$: $q = \frac{36}{54} = \frac{2}{3}$.

## Livello 2: un termine da a_1 e q

Dati `a_1 = ... \qquad q = ...`, poi `a_{n} = \ ?`. $q \in \{2, 3, -2, -3\}$ con $a_1$ intero non nullo tra $-6$
e 6 ($n$ da 5 a 10 con $|q| = 2$, da 4 a 7 con $|q| = 3$); in un quarto dei casi $q = \pm\frac{1}{2}$ con $a_1$
multiplo di una potenza di 2 e $n$ da 4 a 7. `params`: `a1`, `q`, `n`. Distrattori: $a_1 q^n$ (un passo di
troppo), $a_1 q^{n-2}$, il segno opposto, $a_1 + (n - 1)q$ (la formula delle aritmetiche).

1. $a_1 = 3$, $q = -2$: $a_5 = 3 \cdot (-2)^4 = 48$.
2. $a_1 = -80$, $q = \frac{1}{2}$: $a_6 = -80 \cdot \frac{1}{32} = -\frac{5}{2}$.

## Livello 3: crescente, decrescente o a segni alterni

Dati `a_1 = ... \qquad q = ...`, senza domanda nel problema. Quote: `crescente` 30%, `decrescente` 30%,
`alterni` 30%, `costante` 10%. $a_1$ intero non nullo tra $-9$ e 9; $q > 1$ tra $2, 3, 4, \frac{3}{2},
\frac{5}{2}$; $0 < q < 1$ tra $\frac{1}{2}, \frac{1}{3}, \frac{2}{3}, \frac{1}{4}, \frac{3}{4}$; $q < 0$ tra $-2,
-3, -\frac{1}{2}, -\frac{1}{3}, -1$; $q = 1$ per `costante`. Metà dei casi monotoni ha $a_1$ negativo, dove la
tabella della lezione si rovescia. Opzioni fisse: `\text{crescente}`, `\text{decrescente}`, `\text{costante}`,
`\text{a segni alterni}`.

1. $a_1 = -3$, $q = \frac{5}{2}$: $-3, -\frac{15}{2}, -\frac{75}{4}, \dots$ decrescente.
2. $a_1 = -1$, $q = -\frac{1}{2}$: a segni alterni.

## Livello 4: la ragione da due termini

Dati `a_{k}` e `a_{m}`, poi `q = \ ?`. `una` (50%): $m - k$ dispari (1 o 3), una sola ragione. `due` (50%):
$m - k$ pari (2 o 4), due ragioni opposte. Ragioni tra $\pm 2$, $\pm 3$, $\pm\frac{1}{2}$; $k$ da 1 a 3;
$|a_m| \le 5000$. Risposta `set` con i valori in ordine crescente e `latex` nella forma `\left\{ -2,\ 2
\right\}`. Opzioni scritte `q = 3` oppure `q = \pm 2`. `params`: `case`, `k`, `m`, `ak`, `am`. Distrattori: una
sola delle due ragioni (avviso "Con l'esponente pari le ragioni sono due"), tutte e due quando ne vale una
sola, il rapporto diviso per $m - k$ al posto della radice, il rapporto stesso, il reciproco.

1. $a_3 = 8$, $a_6 = 1$: $q^3 = \frac{1}{8}$, $q = \frac{1}{2}$.
2. $a_1 = -5$, $a_5 = -80$: $q^4 = 16$, $q = \pm 2$.

## Livello 5: il posto di un termine

Dati `a_1`, `q`, `a_n`, poi `n = \ ?`. $q \in \{2, 3, 4, 5, 10\}$, $a_1$ intero non nullo tra $-6$ e 6, posto
tra 4 e 11: il termine è $a_1$ per una potenza esatta della ragione, come nell'esempio 5 della lezione (senza
logaritmi). `params`: `a1`, `q`, `value`. Distrattori: l'esponente $n - 1$ dato come posto, $n + 1$.

1. $a_1 = 4$, $q = 3$, $a_n = 324$: $3^{n-1} = 81 = 3^4$, $n = 5$.
2. $a_1 = -6$, $q = 4$, $a_n = -1536$: $4^{n-1} = 256 = 4^4$, $n = 5$.

## Livello 6: la somma dei primi n termini

Dati `a_1`, `q`, poi `S_{n} = \ ?`, con gli stessi numeri del livello 2. `params`: `a1`, `q`, `n`. Distrattori:
la somma di $n - 1$ termini, $a_1(q^n - 1)$ senza il denominatore, il solo $a_n$, la somma di $n + 1$ termini,
il segno opposto.

1. $a_1 = 3$, $q = -2$: $S_5 = 3 \cdot \frac{-32 - 1}{-3} = 33$.
2. $a_1 = -80$, $q = \frac{1}{2}$: $S_6 = -80 \cdot \frac{63}{32} = -\frac{315}{2}$.

## Livello 7: crescita a percentuale costante

Due righe di testo. Tre storie, un terzo ciascuna (`params.case`):

- `capitale`: "Un capitale di $C$ euro cresce del $p\%$ all'anno, con interesse composto." / "Quanti euro vale
  dopo $n$ anni?", $p \in \{5, 10, 20\}$, $C$ tra 500 e 9000;
- `auto`: "Un'auto che vale $C$ euro perde ogni anno il $p\%$ del suo valore." / stessa domanda,
  $p \in \{10, 20, 30\}$, $C$ tra 8000 e 32000;
- `paese`: "Un paese di $C$ abitanti cresce del $p\%$ all'anno." / "Quanti abitanti ha dopo $n$ anni?",
  $p \in \{5, 10, 20\}$, $C$ tra 1000 e 9000.

$n$ vale 2 o 3 e il risultato è intero. `params`: `case`, `c0`, `p` (negativo per l'auto), `n`. I passaggi
scrivono la ragione con la virgola ($1{,}1$). Distrattori: la percentuale sommata, $C(1 + n \cdot \frac{p}{100})$
(avviso "Le percentuali non si sommano"), un periodo in meno, un periodo in più.

1. $8000$ euro al $10\%$ per 3 anni: $8000 \cdot 1{,}1^3 = 8000 \cdot 1{,}331 = 10648$.
2. Un'auto da $17000$ euro che perde il $20\%$ per 2 anni: $17000 \cdot 0{,}8^2 = 10880$.

## Da evitare

$q = 0$, $q = 1$ fuori dal livello 3, termini non interi al livello 1, termini oltre qualche migliaio,
risultati non interi nelle storie, ragioni negative al livello 5 (il segno deciderebbe la parità del posto).

## Domande per la revisione

- Livello 4: la risposta aperta è un insieme di una o due ragioni. Come la scrive lo studente, "q = ±2"?
- Livello 3: i casi con $a_1 < 0$ sono metà dei monotoni. Troppi?
- Livello 7: le storie sono tre e i numeri sono rotondi. Servono tassi come il $3\%$, con risultati con la
  virgola da arrotondare ai centesimi, come nell'esempio 9 della lezione?
- Mancano i medi geometrici come livello a sé: sono coperti in parte dal livello 4. Basta?
