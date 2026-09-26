# Numeri interi e valore assoluto

Generatore: `numeri-interi-valore-assoluto`
(`src/lib/exercises/v2/generators/numeri-interi-valore-assoluto.ts`). Verifica indipendente:
`scripts/exercises/checkers/numeri_interi_valore_assoluto.py`. Lezione collegata: "Numeri interi e
valore assoluto" (`docs/lezioni/riscritte/20-numeri-interi-valore-assoluto.md`).

Lo studente riconosce segno e appartenenza di un intero, calcola opposti e valori assoluti, confronta
e ordina interi, conta gli interi tra due estremi. I livelli seguono l'ordine della lezione, tranne
il livello 6 (interi tra due estremi, successivo e precedente), che la lezione tratta nella retta e
nell'esempio 4 ma che qui viene per ultimo perché usa il confronto. Quasi tutte le risposte sono di
tipo `choice` con quattro opzioni; il conteggio e il successivo del livello 6 hanno una risposta
`number` e la scelta multipla si costruisce dai `params`.

## Rappresentazione

Il verificatore rilegge tutto dal testo: numeri ed espressioni dal problema, affermazioni, coppie,
ordinamenti e insiemi dal LaTeX delle opzioni. I `params` servono al `check()` del generatore:
`number` e `sign` (livello 1), `base`, `opposite`, `absolute` (livello 2), `numbers` e `order`
(livello 4), `expressions` e `values` (livello 5), `a`, `b` e gli estremi (livello 6); `case` dice
il caso.

## Regole comuni

- Convenzioni della lezione: lo zero non è né positivo né negativo; `+7` e `7` sono lo stesso
  numero; il valore assoluto si scrive `|-8|`, l'opposto `-(-8)`.
- Numeri da -30 a 30 (livello 1), da -20 a 20 negli altri livelli.
- Negli ordinamenti i valori assoluti sono tutti diversi, così l'ordine per valore assoluto (un
  errore) è ben definito e non coincide per caso con quello giusto.
- Quattro opzioni diverse sia nel valore sia nel testo; una sola giusta.

## Livello 1: segno e appartenenza

Un intero da -30 a 30: circa 4 su 10 positivi (metà scritti con il `+`), 45 su 100 negativi, 15 su
100 lo zero. "Quale affermazione sul numero è vera?": ogni opzione dice un segno (positivo,
negativo, né positivo né negativo) e un'appartenenza (a ℕ e a ℤ; a ℤ ma non a ℕ; a ℕ ma non a ℤ).

Esempi: `-3`, risposta "è negativo e appartiene a ℤ ma non a ℕ"; `+7`, risposta "è positivo e
appartiene a ℕ e a ℤ".

## Livello 2: opposto e valore assoluto

Due espressioni con la stessa base `a` da 2 a 20: un opposto (`-(-a)`, `-(+a)`, `+(-a)`) e un valore
assoluto (`|-a|`, `|+a|`, `-|-a|`, `-|a|`). Circa metà dei valori assoluti ha il meno fuori dalle
sbarre, l'errore segnalato nella lezione. Le opzioni sono le quattro coppie di `±a`.

Esempi: `-(-8)` e `|-8|` valgono `8` e `8`; `-(+5)` e `-|-5|` valgono `-5` e `-5`.

## Livello 3: confronto tra due interi

"Quale confronto è vero?" con quattro confronti `x < y` o `x > y` su coppie diverse, uno solo vero.
Il confronto vero è tra due negativi (circa 40%), discordi (30%), con lo zero (15%) o tra due
positivi (15%). Tra i falsi ci sono sempre due negativi scritti come se fossero positivi
(`-3 < -8`) e un negativo con valore assoluto maggiore di un positivo scritto maggiore (`-9 > 8`,
confronto dei valori assoluti al posto dei numeri).

Esempi: tra `-12 > 0`, `-17 > -9`, `-9 > 8`, `-13 < -7` è vero `-13 < -7`; tra `9 < -18`,
`0 < -16`, `-10 > -9`, `-2 > -20` è vero `-2 > -20`.

## Livello 4: ordinare gli interi

Da 5 a 7 interi da -20 a 20 con valori assoluti diversi, almeno due negativi e due positivi, lo zero
una volta su due. Ordine crescente o decrescente, metà e metà; le opzioni usano il simbolo della
domanda (`<` o `>`).

Esempi: `4, -7, 0, -1, 12, -15, 3` in ordine crescente diventa
`-15 < -7 < -1 < 0 < 3 < 4 < 12` (esempio 2 della lezione); `-2, 5, -11, 0, 8` in ordine
decrescente diventa `8 > 5 > 0 > -2 > -11`.

## Livello 5: ordinare con opposti e valori assoluti

4 o 5 espressioni tra `|-a|`, `|a|`, `-|-a|`, `-|a|`, `-(-a)`, `-(+a)`, basi da 1 a 15 tutte
diverse, con almeno un `-|-a|` e un `-(-a)`; almeno due valori negativi e due positivi. Si chiede
l'ordine crescente, scritto con le espressioni come nell'esempio 3 della lezione.

Esempi: `-|-3|, -(-7), |-1|, -|6|` diventa `-|6| < -|-3| < |-1| < -(-7)`; `-|3|, -|-12|, |8|,
-(-6)` diventa `-|-12| < -|3| < -(-6) < |8|`.

## Livello 6: interi tra due estremi

Tre casi:

- circa 40%: "Quanti numeri interi ci sono tra i due numeri, estremi esclusi (o inclusi)?", con
  `a` da -15 a -1, `b - a` da 3 a 15, `b` al massimo 12; inclusi circa una volta su tre;
- circa 40%: l'elenco di `\{x \in \mathbb{Z} \mid a \leq x < b\}`, con ciascun estremo incluso o
  escluso, `a` negativo, `b - a` da 3 a 8;
- circa 20%: il successivo o il precedente di un negativo da -20 a -2.

Esempi: tra `-6` e `-1`, estremi esclusi, ci sono `4` interi (`-5, -4, -3, -2`);
`\{x \in \mathbb{Z} \mid -4 \leq x < 2\} = \{-4, -3, -2, -1, 0, 1\}`; il successivo di `-5` è `-4`.

## Da evitare

- Due numeri con lo stesso valore assoluto negli ordinamenti; coppie ripetute nel livello 3.
- Il livello 2 con basi diverse nelle due espressioni: le quattro coppie di `±a` non sarebbero più
  tutte le combinazioni dei segni.
- Opzioni di ordinamento assurde (un positivo prima di un negativo) quando esiste un errore vero da
  mostrare: gli scambi di due vicini si usano solo come riempitivo, e solo tra numeri dello stesso
  segno.

## Variante a scelta multipla

- Livello 1: per un positivo "appartiene a ℕ ma non a ℤ" e "a ℤ ma non a ℕ" (non sa che
  ℕ ⊂ ℤ); per un negativo "appartiene a ℕ e a ℤ" e "è positivo"; per lo zero "è positivo".
- Livello 2: le coppie con uno o due segni sbagliati.
- Livello 3: gli altri tre confronti, falsi.
- Livello 4: i negativi ordinati come se fossero positivi, tutto ordinato per valore assoluto, la
  fila al contrario con lo stesso simbolo; scambi tra vicini dello stesso segno se servono.
- Livello 5: il meno fuori dal valore assoluto ignorato (`-|-9|` letto `9`), `-(-a)` letto negativo,
  i negativi ordinati come positivi, l'ordine decrescente.
- Livello 6: nel conteggio `b - a` (un estremo contato), l'altra convenzione sugli estremi, il meno
  di `a` ignorato quando `b > 0`; nell'insieme le altre tre combinazioni di estremi; nel successivo
  il precedente (e viceversa) e i due opposti.

## Righe sul telefono

Sul telefono ogni opzione è una formula a 16 px in un pulsante largo 252 px.

- Livello 1: le quattro affermazioni vanno sempre su due righe in un `\begin{gathered}`: il segno
  (`è negativo`) sulla prima, l'appartenenza (`e appartiene a ℤ ma non a ℕ`) sulla seconda. Su una
  riga erano larghe fino a 451 px. La soluzione resta su una riga.
- Livelli 4 e 5 (ordinamenti) e livello 6 (elenco dell'insieme): se una delle quattro opzioni è
  troppo larga, vanno su due righe tutte e quattro, così le risposte hanno la stessa forma. La prima
  riga ha metà degli elementi, arrotondata per eccesso; la seconda comincia con il simbolo della
  catena (`< 3 < 8`), oppure, nell'elenco, con il numero dopo la virgola che chiude la prima riga.
  La larghezza è stimata dai caratteri (`emWidth` di numeri-interi-operazioni) e va a capo sopra
  14,8: su 4800 esercizi misurati con KaTeX nessuna opzione sotto la soglia supera 252 px.

Il controllo in Python rimette insieme le due righe, controlla la forma dell'a capo e poi rilegge
l'opzione come prima: una riga persa lascia un'affermazione incompleta o un ordinamento che non
contiene tutti i numeri, e viene bocciata.

Misura con `scripts/exercises/width.mts` (150 esercizi per livello, 26 settembre 2026), opzioni oltre
252 px: livello 1 da 450 su 600 (max 451) a 0 (max 227); livello 4 da 216 (max 300) a 0 (max 249);
livello 5 da 496 (max 352) a 0 (max 233); livello 6 da 13 (max 297) a 0 (max 240).

## Domande per la revisione

- Il livello 3 con quattro confronti su coppie diverse va bene, o si preferisce il classico
  `a \ \square \ b` con tre opzioni (`<`, `>`, `=`)?
- Il livello 6 mette insieme gli interi tra due estremi e il successivo di un negativo: meglio
  spostare il successivo nel livello 1, dove si parla già della retta?
