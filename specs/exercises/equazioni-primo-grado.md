# Equazioni di primo grado

Generatore: `equazioni-primo-grado` (`src/lib/exercises/v2/generators/equazioni-primo-grado.ts`).
Verifica indipendente: `scripts/exercises/verify.py`. Lezione collegata: "Equazioni di primo grado
intere".

Lo studente riceve un'equazione intera di primo grado (nessuna incognita al denominatore) e deve
trovare l'insieme delle soluzioni: un numero razionale, l'insieme vuoto (equazione impossibile) o
tutti i numeri reali (equazione indeterminata). La risposta è di tipo `set`; per l'equazione
indeterminata `universal: true`. Ogni esercizio ha anche una variante a scelta multipla.

L'esercizio si costruisce all'indietro: si sceglie la soluzione, poi i coefficienti. I livelli
seguono l'ordine della lezione e ognuno aggiunge una sola difficoltà.

## Rappresentazione

`params.lhs` e `params.rhs` sono liste di termini `{k, a, b, d}`, ognuno dei quali vale
`k·(a·x + b)/d`; `k` diverso da 1 si mostra come fattore davanti a una parentesi, `d` diverso da 1
come frazione. `params.solution` è la soluzione (stringa razionale), oppure `"impossibile"` o
`"indeterminata"`; `params.case` vale `determinata`, `impossibile` o `indeterminata`.

## Regole comuni

- Coefficienti e termini noti interi; nel testo nessun coefficiente oltre 60 in valore assoluto.
- Mai `1x`, `0x`, `+ -`, `- -`, termini nulli, parentesi inutili come `1(…)`.
- Nei livelli da 1 a 5 l'equazione è determinata.

## Livello 1: un solo termine con l'incognita

`ax + b = c` con `a` intero tra −9 e 9, diverso da 0 e da 1, `b` diverso da 0, soluzione intera tra
−12 e 12. A volte il termine noto sta a sinistra: `b + ax = c`.

Esempio: `3x + 5 = 11`, soluzione 2.

## Livello 2: incognita in entrambi i membri

`ax + b = cx + d` con `a ≠ c`, soluzione intera tra −12 e 12, coefficienti tra −9 e 9.

Esempio: `5x - 3 = 2x + 9`, soluzione 4.

## Livello 3: parentesi

Almeno un termine della forma `k(ax + b)` con `k` intero diverso da 1 (spesso negativo), in uno o
in entrambi i membri; soluzione intera tra −12 e 12.

Esempio: `2(x + 3) = 5x - 9`, soluzione 5.

## Livello 4: soluzione frazionaria

Come i livelli 2 e 3, ma la soluzione è una frazione ridotta `p/q` con `q` tra 2 e 9 e `|p| ≤ 30`.

Esempio: `4x - 1 = x + 6`, soluzione 7/3.

## Livello 5: denominatori numerici

Due o tre termini della forma `(ax + b)/d` con `d` tra 2 e 6, e almeno due denominatori diversi;
si risolve moltiplicando per il MCM. Soluzione razionale, intera o frazionaria.

Esempio: `\frac{x - 1}{3} - \frac{x + 2}{4} = \frac{1}{6}`, soluzione 12.

## Livello 6: impossibili e indeterminate

Equazioni con parentesi in cui i termini con l'incognita si cancellano: circa 4 su 10
impossibili (`0x = n`, `n ≠ 0`), 4 su 10 indeterminate (`0x = 0`), 2 su 10 determinate, perché lo
studente non deve indovinare il caso dalla forma.

Esempi: `2(x + 3) = 2x + 5` impossibile; `3(x - 1) + x = 4x - 3` indeterminata.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta. Distrattori, in ordine di preferenza: la soluzione con il
segno cambiato; il trasporto senza cambio di segno; la divisione al contrario (`a/b` invece di
`b/a`); il segno sbagliato davanti alla parentesi; il termine noto non moltiplicato per il MCM;
"nessuna soluzione" e "ogni numero reale" scambiati. Se non bastano, si spostano di ±1, ±2.
