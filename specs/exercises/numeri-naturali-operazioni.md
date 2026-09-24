# Operazioni in ℕ

Generatore: `numeri-naturali-operazioni` (`src/lib/exercises/v2/generators/numeri-naturali-operazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/numeri_naturali_operazioni.py`. Lezione collegata:
"Operazioni in ℕ" (`docs/lezioni/riscritte/06-numeri-naturali-operazioni.md`). Macchinario comune ai
tre generatori dei naturali (alberi delle espressioni, passaggi, costruzione all'indietro):
`src/lib/exercises/v2/naturali.ts`.

I livelli seguono l'ordine della lezione: proprietà, zero nella divisione e divisione con resto,
espressioni. Dal livello 3 al 6 ogni livello aggiunge un tipo di parentesi. Le risposte sono un
numero (`number`) per le espressioni e una scelta (`choice`) per le proprietà e le divisioni, dove
la risposta è un nome ("proprietà associativa", "impossibile") o una coppia quoziente e resto.

## Rappresentazione

- Livello 1: `params.lhs` e `params.rhs` sono i due membri in ASCII (`*` per `\cdot`, `:` per la
  divisione, parentesi `( [ {`), `params.property` la proprietà.
- Livello 2: `params.a`, `params.b` (dividendo e divisore), `params.case` (`zero-diviso`,
  `diviso-zero`, `zero-zero`, `resto`), e per il resto `params.q`, `params.r`.
- Livelli 3-6: `params.expr` è l'espressione in ASCII, identica al testo LaTeX una volta tolti
  `\cdot`, `\{`, `\}` e gli spazi; `params.value` il valore.

## Regole comuni alle espressioni

- Convenzioni della lezione: `\cdot` per la moltiplicazione, `:` per la divisione, parentesi tonde
  dentro le quadre dentro le graffe (una parentesi è tonda se non ne contiene altre, quadra se
  contiene tonde, graffa se contiene quadre).
- L'espressione si costruisce all'indietro: si sceglie il valore, poi lo si divide in termini e
  fattori. Così ogni risultato intermedio, calcolato con le regole della lezione, è un numero
  naturale e ogni divisione è esatta.
- Numeri nel testo tra 1 e 60; risultati intermedi fino a 150 (livello 3), 200 (livelli 4 e 5),
  250 (livello 6); risultato finale almeno 1.
- In ogni moltiplicazione il fattore più piccolo è tra 2 e 10; ogni divisore è tra 2 e 10. Niente
  `\cdot 1`, `: 1`, `+ 0`, niente fattori o divisori nulli.
- Ogni parentesi contiene una somma o una differenza: nessuna parentesi inutile.
- Mai `a \cdot b : a` o `a : b \cdot b`, che si annullano da soli.

## Livello 1: proprietà delle operazioni

Un'uguaglianza vera tra numeri che mostra una sola proprietà; lo studente sceglie quale tra
quattro. Proprietà e forme, con le quote:

- commutativa (circa 17%): `7 + 12 = 12 + 7`, `25 \cdot 7 \cdot 4 = 25 \cdot 4 \cdot 7`;
- associativa (17%): `17 + 38 + 2 = 17 + 40`, `(9 \cdot 2) \cdot 50 = 9 \cdot (2 \cdot 50)`;
- dissociativa (15%): `27 + 8 = 27 + 3 + 5`, `15 \cdot 12 = 15 \cdot 2 \cdot 6`;
- distributiva (17%): `3 \cdot (4 + 5) = 3 \cdot 4 + 3 \cdot 5`, con la differenza, e
  `(40 + 24) : 8 = 40 : 8 + 24 : 8`;
- invariantiva (16%): `1000 - 297 = 1003 - 300`, `350 : 50 = 35 : 5`;
- elemento neutro (9%): `19 \cdot 1 = 19`, `0 + 37 = 37`;
- elemento assorbente (9%): `23 \cdot 0 = 0`.

Esempi svolti:

1. `27 + 8 = 27 + 3 + 5`. L'addendo 8 è stato scomposto in 3 + 5: proprietà dissociativa.
2. `350 : 50 = 35 : 5`. Dividendo e divisore divisi entrambi per 10: proprietà invariantiva.

## Livello 2: lo zero e la divisione con resto

Circa 3 esercizi su 10 sono divisioni con lo zero, uno per tipo: `0 : n = 0`, `n : 0` impossibile,
`0 : 0` indeterminata, con `n` tra 2 e 30. Le opzioni sono sempre il numero giusto o sbagliato, 0,
"impossibile" e "indeterminata".

Gli altri sono divisioni con resto `a = b \cdot q + r`, `0 \le r < b`: divisore da 3 a 12,
quoziente da 2 a 15; circa 1 su 10 con dividendo minore del divisore (`q = 0`) e 1 su 10 esatta
(`r = 0`). Le opzioni sono coppie `q = 9,\ r = 2`.

Esempi svolti:

1. `47 : 5`. Il più grande multiplo di 5 che non supera 47 è 45 = 5 · 9: q = 9, r = 2. Controllo:
   5 · 9 + 2 = 47 e 2 < 5.
2. `7 : 0`. Nessun numero moltiplicato per 0 dà 7: impossibile.

## Livello 3: espressioni senza parentesi

Da 3 a 6 numeri, con almeno un `\cdot` o `:` e almeno un `+` o `-`. Calcolare da sinistra a destra
senza priorità deve dare un risultato diverso (o uscire da ℕ): l'esercizio mette alla prova le
priorità.

Esempi svolti:

1. `20 - 3 \cdot 4 + 12 : 6`. Moltiplicazioni e divisioni: 20 − 12 + 2; poi da sinistra a destra: 10.
2. `50 - 5 \cdot 7`. 50 − 35 = 15 (da sinistra a destra verrebbe 45 · 7 = 315).

## Livello 4: con le parentesi tonde

Da 4 a 7 numeri, almeno una tonda, nessuna quadra. Togliere le parentesi deve cambiare il risultato.

Esempi svolti:

1. `33 : (1 + 20 : 10) \cdot 4`. Tonde: 1 + 2 = 3; resta 33 : 3 · 4 = 11 · 4 = 44.
2. `2 \cdot (6 \cdot 6 - 2 \cdot 7)`. Tonde: 36 − 14 = 22; resta 2 · 22 = 44.

## Livello 5: con tonde e quadre

Da 5 a 9 numeri, almeno una quadra che contiene una tonda, nessuna graffa.

Esempi svolti:

1. `2 \cdot [6 \cdot (44 : 4 - 5) - 14]`. Tonde: 11 − 5 = 6; quadre: 36 − 14 = 22; resta 2 · 22 = 44.
2. `(25 - 11 \cdot 2) \cdot [33 - (29 - 23) \cdot 5]`. Tonde: 3 e 6; quadre: 33 − 30 = 3; resta 3 · 3 = 9.

## Livello 6: con tonde, quadre e graffe

Da 6 a 11 numeri, almeno una graffa che contiene una quadra che contiene una tonda.

Esempi svolti:

1. `\{[19 \cdot 2 - (2 \cdot 11 + 3)] \cdot 3 + 14 - 26\} : 3`. Tonde: 25; quadre: 38 − 25 = 13;
   graffe: 39 + 14 − 26 = 27; resta 27 : 3 = 9.
2. `24 - \{2 \cdot [23 - (26 - 10 : 2)] + 15 : 5 \cdot 5\}`. Tonde: 21; quadre: 2; graffe:
   4 + 15 = 19; resta 24 − 19 = 5.

## Passaggi

Come nella lezione: prima le tonde, poi le quadre, poi le graffe; dentro ogni parentesi prima le
potenze, poi moltiplicazioni e divisioni da sinistra a destra, poi addizioni e sottrazioni. Ogni
passo dice cosa si calcola e mostra l'espressione che resta.

## Esercizi "brutti" da evitare

- parentesi che non contengono una somma o una differenza, o parentesi nell'ordine sbagliato;
- sottrazioni con risultato negativo e divisioni non esatte in qualunque passaggio;
- `\cdot 1`, `: 1`, `+ 0`, prodotti con due fattori grandi (il più piccolo oltre 10);
- `a \cdot b : a`, espressioni in cui le priorità (livello 3) o le parentesi (livelli 4-6) non
  cambiano niente;
- al livello 1, uguaglianze in cui si riconoscono due proprietà insieme.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta.

- Livello 1: la proprietà giusta e tre proprietà che si confondono con quella (associativa con
  dissociativa e commutativa, invariantiva con distributiva, elemento neutro con assorbente).
- Livello 2: per lo zero, 0, il numero, "impossibile", "indeterminata"; per il resto, il resto non
  minore del divisore (q − 1, r + b), il multiplo successivo (q + 1, b − r), il resto sbagliato di 1.
- Livelli 3-6, in ordine: il calcolo da sinistra a destra senza priorità; le parentesi ignorate;
  la moltiplicazione fatta prima della divisione; l'addizione fatta prima della sottrazione. Solo i
  valori che restano in ℕ; se non bastano, numeri vicini (±1, ±2, ±10, il doppio).

## Domande per la revisione

- Le quote del livello 1 vanno bene, o l'elemento neutro e l'assorbente sono troppo facili per
  starci?
- Al livello 2 meglio chiedere solo il resto, con risposta numerica aperta, invece della coppia
  quoziente e resto a scelta?
- Le dimensioni (numeri fino a 60, risultati fino a 250) sono quelle di una verifica del biennio?
