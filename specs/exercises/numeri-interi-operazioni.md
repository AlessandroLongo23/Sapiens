# Operazioni in ℤ

Generatore: `numeri-interi-operazioni` (`src/lib/exercises/v2/generators/numeri-interi-operazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/numeri_interi_operazioni.py`. Lezione collegata:
"Operazioni in ℤ" (`docs/lezioni/riscritte/21-numeri-interi-operazioni.md`).

I livelli seguono l'ordine della lezione: addizione, sottrazione, somma algebrica, parentesi da
togliere, regola dei segni, espressioni. Ogni livello aggiunge una difficoltà. La risposta è sempre
un numero intero (`number`); la variante a scelta multipla ha quattro interi.

## Rappresentazione

`params.expr` è l'espressione in ASCII: `*` per `\cdot`, `:` per la divisione, parentesi `( [ {`,
nessuno spazio. È identica al testo LaTeX una volta tolti `\cdot`, `\{`, `\}` e gli spazi.
`params.value` è il valore, `params.case` il caso del livello.

## Convenzioni della lezione

- Un numero negativo che segue il segno di un'operazione va tra parentesi: `4 \cdot (-3)`,
  `7 - (-2)`, mai `4 \cdot -3` o `7 - -2`.
- Il segno all'inizio dell'espressione, o subito dopo una parentesi aperta, appartiene al primo
  numero: `-3 \cdot (-4)`, `(-6 + 1)`.
- Il `+` davanti ai positivi si scrive solo dove la lezione mostra le regole (livelli 1, 2 e 5):
  `(-7) + (+4)`, `(-2) \cdot (+3)`. Lì anche la soluzione e le opzioni hanno il segno: `+3`, `-3`.
  Negli altri livelli il `+` si omette.
- Divisione con `:`, moltiplicazione con `\cdot`; parentesi tonde dentro quadre dentro graffe (una
  parentesi è tonda se non ne contiene altre, quadra se contiene tonde, graffa se contiene quadre).
- Niente potenze: sono nella lezione 22 (Potenze in ℤ).

## Livello 1: addizione di due interi

Due numeri con il segno tra parentesi, valore assoluto da 1 a 25: `(a) + (b)`. Circa 4 su 10
concordi (un quarto di questi positivi, gli altri negativi), 6 su 10 discordi. Mai due opposti
(somma 0).

Esempi svolti:

1. `(-7) + (+4)`. Discordi: il segno è quello di −7, che ha il valore assoluto maggiore; valore
   assoluto 7 − 4 = 3. Risultato −3.
2. `(-12) + (-6)`. Concordi: la somma ha il loro segno, valore assoluto 12 + 6 = 18. Risultato −18.

## Livello 2: sottrazione di due interi

`(a) - (b)`, stessi numeri del livello 1; metà con il sottraendo negativo (`meno-meno`), metà
positivo (`meno-piu`). Differenza mai nulla. Il primo passo trasforma la sottrazione nell'addizione
dell'opposto, poi si applica la regola del livello 1.

Esempi svolti:

1. `(-2) - (-18)` = `(-2) + (+18)`. Discordi, segno di +18, valore assoluto 18 − 2 = 16: +16.
2. `(+19) - (+12)` = `(+19) + (-12)`. Discordi, segno di +19, valore assoluto 7: +7.

## Livello 3: somma algebrica

Da 4 a 6 termini senza parentesi, valore assoluto da 1 a 20, il primo con il suo segno
(`-4 + 9 - 12 + 3`). Almeno due termini negativi e almeno uno positivo; risultato non nullo, fino
a ±40. Circa 6 su 10 (`segni-doppi`) hanno uno o due segni doppi da ridurre, sempre almeno un
`- (-a)` e a volte un `+ (-a)` o `- (+a)`; gli altri (`semplice`) nessuno. Mai un segno doppio sul
primo termine.

Esempi svolti:

1. `-4 + 9 - 12 + 3`. Positivi 9 + 3 = 12, negativi 4 + 12 = 16: 12 − 16 = −4.
2. `-6 - 18 + 10 - (-16)` = `-6 - 18 + 10 + 16`. Positivi 26, negativi 24: 2.

## Livello 4: togliere le parentesi

Somma algebrica (solo `+` e `-`) con una o due parentesi, almeno una preceduta da `-`. Metà con le
sole tonde (`tonde`), metà con una tonda dentro una quadra (`quadre`). Numeri da 1 a 20, da 4 a 8
numeri nel testo, ogni parentesi con almeno due termini, nessuna parentesi subito dopo una
parentesi aperta; risultati intermedi fino a ±100, risultato non nullo fino a ±30. Togliere le
parentesi cambiando segno solo al primo termine deve dare un risultato diverso: l'esercizio mette
alla prova la regola. I passaggi tolgono le parentesi dalla più interna, come nel secondo metodo
dell'Esempio 4 della lezione, poi sommano positivi e negativi.

Esempi svolti:

1. `15 - [4 - (6 - 11) + 2]`. Tonde: `15 - [4 - 6 + 11 + 2]`; quadre: `15 - 4 + 6 - 11 - 2`.
   Positivi 21, negativi 17: 4.
2. `-(-20 + 4) - (-16) - 13`. Tonde: `20 - 4 - (-16) - 13`. Positivi 20 + 16 = 36, negativi
   4 + 13 = 17: 19.

## Livello 5: regola dei segni

Numeri con il segno tra parentesi, almeno uno negativo. Circa 6 su 10 (`prodotto`) sono prodotti
di 3 o 4 fattori con valore assoluto da 1 a 9 (al più un ±1), prodotto dei valori assoluti tra 12
e 300; gli altri (`quoziente`) una divisione esatta con divisore da 2 a 12 in valore assoluto e
quoziente da 2 a 15. I passaggi contano i fattori negativi, poi calcolano il valore assoluto.

Esempi svolti:

1. `(-2) \cdot (+3) \cdot (-1) \cdot (-5)`. Tre fattori negativi, dispari: negativo. 2 · 3 · 1 · 5
   = 30. Risultato −30.
2. `(+30) : (-2)`. Discordi: negativo; 30 : 2 = 15. Risultato −15.

## Livello 6: espressioni

Le quattro operazioni con le parentesi: circa 3 su 10 con le sole tonde, 4 su 10 fino alle quadre,
3 su 10 fino alle graffe. Regole:

- numeri nel testo da 1 a 20 in valore assoluto, da 5 a 11; al più 4 parentesi;
- almeno una moltiplicazione o divisione con un numero negativo scritto, e almeno una addizione
  o sottrazione;
- in ogni moltiplicazione il fattore più piccolo in valore assoluto è tra 2 e 10; ogni divisore
  tra 2 e 10 in valore assoluto; ogni divisione esatta, mai `0 : n`;
- risultati intermedi fino a ±200, risultato non nullo fino a ±50;
- ogni parentesi contiene una somma algebrica; niente parentesi subito dopo una parentesi aperta;
  un `-` davanti a una parentesi all'inizio solo all'inizio dell'espressione (`-[5 - (3 - 8)]`);
- calcolare da sinistra a destra senza priorità deve dare un risultato diverso, e così togliere le
  parentesi senza cambiare i segni.

Passaggi: prima le tonde, poi le quadre, poi le graffe, ognuna con il suo valore e l'espressione
che resta; poi moltiplicazioni e divisioni; infine la somma algebrica, con i segni doppi ridotti
come nell'Esempio 2 della lezione (`12 - (-4) + (-14) = 12 + 4 - 14 = 2`).

Esempi svolti:

1. `-20 - (13 + (-10) \cdot 3) - 15`. Tonde: 13 − 30 = −17; resta `-20 - (-17) - 15`
   = −20 + 17 − 15 = −18.
2. `-2 \cdot (-5) + (-16 + 9) \cdot (-4)`. Tonde: −7; prodotti: 10 e 28; resta 10 + 28 = 38.

## Esercizi "brutti" da evitare

- `4 \cdot -3`, `7 - -2`, `+5` scritto fuori dai livelli delle regole, un segno doppio sul primo
  termine;
- due opposti al livello 1, differenza nulla al livello 2, risultato 0 ai livelli 3, 4 e 6;
- parentesi che non contengono una somma, parentesi nell'ordine sbagliato, `[(` o `\{[`;
- `\cdot 1`, `: 1`, `\cdot 0`, `0 : n`, divisioni non esatte;
- espressioni in cui togliere male le parentesi o ignorare le priorità dà lo stesso risultato.

## Variante a scelta multipla

Quattro interi distinti, uno corretto. Distrattori, in ordine, dagli errori della lezione:

- Livello 1: il segno sbagliato (−r); tra discordi i valori assoluti sommati invece che
  sottratti, con l'uno e l'altro segno; tra concordi i valori assoluti sottratti.
- Livello 2: l'opposto non preso (`(-2) - (-18)` letto come −2 − 18 = −20); poi come al livello 1
  sull'addizione ottenuta.
- Livello 3: un termine con il segno cambiato, prima quello con il segno doppio (`- (-a)` letto
  come `- a`), poi il primo termine negativo preso positivo; il risultato con il segno sbagliato.
- Livello 4: il segno cambiato solo al primo termine della parentesi; il `-` davanti alla parentesi
  ignorato; il risultato con il segno sbagliato.
- Livello 5: il segno sbagliato; un fattore dimenticato.
- Livello 6: le parentesi tolte senza cambiare i segni; il `-` davanti alla parentesi ignorato;
  il calcolo da sinistra a destra senza priorità; il segno sbagliato. Solo valori interi fino a
  ±200; se non bastano, numeri vicini (±1, ±2, ±10).

## Righe sul telefono

Sul telefono una formula del problema sta in 350 px a 18 px. Un'espressione più larga va su più
righe in un `\begin{aligned}`, con un a capo prima di un `+`, di un `-`, di un `\cdot` o di `:`;
ogni riga nuova comincia con l'operatore, dopo `&\quad`. La larghezza è stimata dai caratteri
(`emWidth`: una cifra 0,5 em, un `+` o un `-` tra due termini 1,22, `\cdot` 0,72, `:` 0,83, una
parentesi 0,39) e una riga resta entro 17; tra i punti in cui la riga può andare a capo si sceglie
quello con meno parentesi aperte, così l'espressione si spezza al livello più esterno possibile
(dentro le parentesi solo se serve: sono parentesi semplici, senza `\left` e `\right`). Le
espressioni che stanno in una riga restano come prima. `params.expr` e la soluzione restano su una
riga; il controllo in Python rimette insieme le righe, controlla che ognuna dopo la prima cominci
con un operatore e confronta il risultato con `params.expr`.

Misura con `scripts/exercises/width.mts` (150 esercizi per livello, 26 settembre 2026): prima 1
formula oltre 350 px al livello 4 (max 365) e 82 al livello 6 (max 615); ora nessuna, con la più
larga a 321 px al livello 4 e 342 px al livello 6. Su 3000 esercizi per livello vanno su due righe
1 espressione su 100 al livello 4 e 60 su 100 al livello 6 (1 su 100 su tre righe).

## Domande per la revisione

- Il livello 6 mette insieme priorità e parentesi annidate fino alle graffe: è un salto grande dal
  livello 5. Meglio dividerlo in due (priorità con le sole tonde; poi quadre e graffe)?
- Al livello 4 i passaggi tolgono le parentesi; la lezione mostra anche il calcolo dall'interno.
  Va bene uno solo dei due metodi?
- Numeri fino a 25 ai livelli 1 e 2 e fino a 20 negli altri: sono quelli di una verifica del biennio?
