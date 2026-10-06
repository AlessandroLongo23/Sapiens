# Progressioni aritmetiche

Generatore: `progressioni-aritmetiche` (`src/lib/exercises/v2/generators/progressioni-aritmetiche.ts`), con i
pezzi comuni in `src/lib/exercises/v2/successioni.ts`. Verifica indipendente:
`scripts/exercises/checkers/progressioni_aritmetiche.py`. Lezione collegata:
`docs/lezioni/riscritte/111-progressioni-aritmetiche.md`.

Sette livelli nell'ordine della lezione: la ragione dai primi termini; un termine da $a_1$ e $d$; il posto di un
termine; il primo termine da due termini; i medi aritmetici; la somma dei primi $n$ termini; una somma di cui
bisogna contare i termini. Notazione della lezione: $a_1$, $d$, $a_n = a_1 + (n - 1)d$,
$S_n = \frac{n(a_1 + a_n)}{2}$.

## Si costruisce dalla risposta

Si scelgono $a_1$, $d$ e $n$, e da quelli i dati del problema. Tutte le risposte sono numeri esatti (`number`),
con la scelta multipla costruita insieme all'esercizio: prima gli errori elencati, poi i numeri vicini.

## Livello 1: la ragione dai primi termini

Quattro termini seguiti dai puntini: `3,\ 7,\ 11,\ 15,\ \dots`. Primo termine intero tra $-12$ e 12. `intera`
(75%): $d$ intero non nullo tra $-9$ e 9. `frazionaria` (25%): $d$ tra $\frac{1}{2}, \frac{3}{2}, -\frac{1}{2},
\frac{5}{2}, \frac{1}{3}, \frac{2}{3}, -\frac{3}{2}, \frac{3}{4}, -\frac{1}{4}$. `params`: `case`, `terms`.
Distrattori: $-d$ (avviso "La ragione è il termine dopo meno il termine prima"), la somma dei primi due
termini, il primo termine, il rapporto $a_2 : a_1$.

1. $1, -8, -17, -26, \dots$: $d = -8 - 1 = -9$.
2. $12, \frac{25}{2}, 13, \frac{27}{2}, \dots$: $d = \frac{1}{2}$.

## Livello 2: un termine da a_1 e d

Riga dei dati `a_1 = ... \qquad d = ...`, poi `a_{n} = \ ?`. $a_1$ tra $-15$ e 20, $d$ intero non nullo tra
$-9$ e 9, $n$ tra 8 e 40. `params`: `a1`, `d`, `n`. Distrattori: $a_1 + nd$ (avviso "I passi sono n − 1, non
n"), $a_1 + (n - 2)d$, $nd$.

1. $a_1 = 7$, $d = -9$: $a_{25} = 7 + 24 \cdot (-9) = -209$.
2. $a_1 = -2$, $d = 6$: $a_{16} = -2 + 90 = 88$.

## Livello 3: il posto di un termine

Dati `a_1`, `d`, `a_n`, poi `n = \ ?`. $2 \le |d| \le 9$, posto tra 8 e 40. `params`: `a1`, `d`, `value`.
Distrattori: $n - 1$ (i passi al posto dei termini), $n + 1$.

1. $a_1 = 7$, $d = 6$, $a_n = 241$: $(n - 1) \cdot 6 = 234$, $n = 40$.
2. $a_1 = 9$, $d = -7$, $a_n = -47$: $n = 9$.

## Livello 4: il primo termine da due termini

Dati `a_{k}` e `a_{m}` con $k$ tra 2 e 6 e $m - k$ tra 2 e 8, poi `a_1 = \ ?`. Ragione intera non nulla tra
$-6$ e 6. `params`: `k`, `m`, `ak`, `am`. Distrattori: $a_k - kd$ (un passo di troppo), $a_k + (k - 1)d$ (verso
sbagliato), la ragione calcolata dividendo per $m - k + 1$, $a_k - d$.

1. $a_4 = -14$, $a_{12} = -62$: $d = \frac{-48}{8} = -6$, $a_1 = -14 - 3 \cdot (-6) = 4$.
2. $a_5 = 21$, $a_7 = 29$: $d = 4$, $a_1 = 5$.

## Livello 5: medi aritmetici

Frase `\text{Inserisci $k$ medi aritmetici tra $a$ e $b$.}` e `d = \ ?`. Da 2 a 6 medi, estremi interi, ragione
intera non nulla tra $-6$ e 6 oppure, a volte e solo con un numero dispari di medi, con denominatore 2.
`params`: `means`, `a`, `b`. Distrattori: $\frac{b - a}{k}$ (avviso "I passi sono uno più dei medi"),
$\frac{b - a}{k + 2}$, $b - a$, $-d$.

1. Cinque medi tra $-9$ e $9$: $d = \frac{18}{6} = 3$.
2. Cinque medi tra $20$ e $17$: $d = \frac{-3}{6} = -\frac{1}{2}$.

## Livello 6: la somma dei primi n termini

Dati `a_1`, `d`, poi `S_{n} = \ ?`. $a_1$ tra $-10$ e 20, $d$ intero non nullo tra $-6$ e 8, $n$ tra 8 e 40.
I passaggi calcolano $a_n$ e poi $S_n$. `params`: `a1`, `d`, `n`. Distrattori: $n(a_1 + a_n)$ senza dividere
per 2, $\frac{(n - 1)(a_1 + a_n)}{2}$, la somma con $a_{n+1}$ al posto di $a_n$, il solo $a_n$.

1. $a_1 = 9$, $d = -6$: $a_{25} = -135$, $S_{25} = \frac{25 \cdot (-126)}{2} = -1575$.
2. $a_1 = 2$, $d = 5$: $S_{16} = 632$.

## Livello 7: una somma di cui contare i termini

`S = x_1 + x_2 + x_3 + \dots + x_n`: i primi tre termini e l'ultimo, tutti interi positivi, passo tra 2 e 12,
da 8 a 40 termini; tre su dieci decrescenti. `params`: `first`, `d`, `last`. Distrattori: la somma con $n - 1$
termini (avviso "Il più uno nel numero dei termini"), $n(a_1 + a_n)$, la somma con $n + 1$ termini.

1. $S = 64 + 72 + 80 + \dots + 120$: $d = 8$, $n = 7 + 1 = 8$, $S = \frac{8 \cdot 184}{2} = 736$.
2. $S = 396 + 387 + 378 + \dots + 90$: $d = -9$, $n = 35$, $S = 8505$.

## Da evitare

Ragione nulla; termini negativi nella somma del livello 7 (si scriverebbe `+ -`); estremi frazionari al
livello 5; posti o numeri di termini sotto 8, che si contano a mano senza la formula.

## Domande per la revisione

- Livello 4: si chiede solo $a_1$. Meglio chiedere la ragione, o il termine generale come espressione?
- Livello 5: si chiede la ragione e non l'elenco dei medi. Va bene, o volete i medi come insieme di numeri?
- Livello 7: i termini sono sempre positivi. Servono anche somme con termini negativi, scritte con le parentesi?
- Mancano i problemi a parole (il teatro dell'esempio 7) e la domanda inversa "quanti termini servono per
  arrivare a una somma data" (esempio 9): li volete come ottavo livello, o al posto di uno di questi?
