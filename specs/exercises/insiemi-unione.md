# Unione insiemistica

Generatore: `insiemi-unione` (`src/lib/exercises/v2/generators/insiemi-unione.ts`).
Verifica indipendente: `scripts/exercises/checkers/insiemi_unione.py`. Lezione collegata:
"Unione insiemistica" (`docs/lezioni/riscritte/05-insiemi-unione.md`).

Convenzioni della lezione: "oppure" inclusivo, gli elementi comuni si scrivono una volta sola;
$|A|$ è la cardinalità; $|A \cup B| = |A| + |B| - |A \cap B|$. Livelli 1-4 con risposta `set`
(solo numeri, perché i valori sono razionali esatti), livelli 5-6 con risposta `number`; tutti
hanno una variante a scelta multipla con quattro opzioni.

## Rappresentazione

- Livelli 1 e 3: `params.A`, `params.B` (e `params.C`) elencati; al livello 1 `params.case`.
- Livello 2: `params.A` e `params.B` sono descrizioni `{kind, k, n}`: `pari`, `dispari`, `mult`
  (multipli di `k`) da 1 a `n`, oppure `div` (divisori di `k`). Il verificatore le elenca da solo
  e controlla che il testo dica esattamente quella descrizione.
- Livello 4: `params.variant` (`incluso`, `universo`, `vuoto`) con gli insiemi.
- Livello 5: `params.variant` (`unione`, `intersezione`, `B`) con i dati.
- Livello 6: `params.variant`, `params.context` (indice del contesto), `total`, `a`, `b`, `both`,
  `none`: il verificatore controlla che le quattro zone del diagramma (solo A, solo B, tutti e
  due, nessuno) diano il totale e che il testo riporti proprio quei numeri.
- `params.wrong` (insiemi) e `params.mistakes` (numeri) sono i distrattori.

## Livello 1: unione di due insiemi elencati

Numeri da 1 a 12. Tre casi: elementi in comune (1 o 2, circa 60%), insiemi disgiunti (circa 20%),
uno incluso nell'altro (circa 20%). I passaggi seguono la lezione: si scrive il primo insieme, poi
si aggiungono gli elementi del secondo che mancano.

Esempi: $A = \{1, 2, 3, 7, 10, 12\}$, $B = \{2, 5, 10, 11\}$, $A \cup B = \{1, 2, 3, 5, 7, 10, 11, 12\}$.
$A = \{6, 8, 10, 11\}$, $B = \{8, 10, 11\}$, $A \cup B = A$.

## Livello 2: insiemi descritti a parole

Come l'esempio 2 della lezione: "Siano $A$ l'insieme dei numeri pari da 1 a 10 e $B$ l'insieme
dei multipli di 5 da 1 a 10". Descrizioni: pari, dispari, multipli di 3, 4 o 5 da 1 a $n$ ($n$ da
10 a 20), divisori di 6, 8, 10, 12, 18 o 20. Vincoli: almeno un elemento comune, nessuno dei due
incluso nell'altro, unione con al massimo 12 elementi; mai pari insieme a dispari.

Esempi: multipli di 3 e multipli di 4 da 1 a 16: $\{3, 4, 6, 8, 9, 12, 15, 16\}$. Pari e multipli di
5 da 1 a 10: $\{2, 4, 5, 6, 8, 10\}$.

## Livello 3: unione di tre insiemi

$A \cup B \cup C$ con tre insiemi elencati di 2-4 numeri; almeno due coppie con elementi comuni,
ogni insieme aggiunge almeno un elemento, al massimo 10 elementi. Si uniscono uno alla volta
(proprietà associativa).

Esempi: $\{1, 7, 10\} \cup \{1, 6\} \cup \{1, 3, 5, 8\} = \{1, 3, 5, 6, 7, 8, 10\}$;
$\{2, 10\} \cup \{1, 5, 7, 11\} \cup \{1, 8, 9, 10\} = \{1, 2, 5, 7, 8, 9, 10, 11\}$.

## Livello 4: proprietà dell'unione

Tre varianti: $A \subset B$ e si chiede $A \cup B$, che è $B$ (circa 45%); $A \cup U$ con $A$
contenuto in $U = \{1, \dots, n\}$, che è $U$ (circa 30%); $A \cup \emptyset$, che è $A$ (circa
25%).

Esempi: $A = \{2, 10, 12\}$, $B = \{2, 3, 9, 10, 12\}$: $A \cup B = B$. $A = \{2, 5, 6, 7\}$:
$A \cup \emptyset = \{2, 5, 6, 7\}$.

## Livello 5: quanti elementi ha l'unione

Con $|A|$ e $|B|$ da 6 a 30 e $1 \le |A \cap B| < \min(|A|, |B|)$. Tre varianti: trovare
$|A \cup B|$ (circa 50%), trovare $|A \cap B|$ da $|A|$, $|B|$, $|A \cup B|$ (circa 30%), trovare
$|B|$ da $|A \cup B|$, $|A|$, $|A \cap B|$ (circa 20%).

Esempi: $|A| = 6$, $|B| = 6$, $|A \cap B| = 3$: $|A \cup B| = 9$. $|A| = 21$, $|B| = 11$,
$|A \cup B| = 26$: $|A \cap B| = 32 - 26 = 6$.

## Livello 6: problemi

Come gli esempi 7 e 8 della lezione, in cinque contesti (calcio e pallavolo, inglese e spagnolo,
nuoto e tennis, cane e gatto, chitarra e pianoforte), con al massimo 60 persone e almeno 2 nei due
gruppi insieme. Quattro domande: quanti fanno almeno una delle due cose (circa 30%, con almeno una
persona che non ne fa nessuna, altrimenti la risposta sarebbe il totale scritto nel testo); quanti
nessuna (circa 30%); quanti tutte e due quando ognuno ne fa almeno una (circa 20%); quanti tutte e
due sapendo quanti non ne fanno nessuna (circa 20%). L'ultimo passaggio è il controllo con le
quattro zone del diagramma.

Esempi: "In una classe di 25 studenti, 10 studiano inglese, 12 studiano spagnolo e 2 studiano tutte
e due le lingue. Quanti studenti studiano almeno una delle due lingue?" 20. "In un gruppo di 19
ragazzi ognuno ha almeno uno dei due animali: 12 hanno un cane e 10 hanno un gatto. Quanti ragazzi
hanno sia un cane sia un gatto?" 3.

## Variante a scelta multipla

Insiemi (livelli 1-4): l'intersezione al posto dell'unione; gli elementi che stanno in uno solo dei
due insiemi ("oppure" letto come esclusivo); uno dei due insiemi da solo; per tre insiemi, $C$
dimenticato o gli elementi comuni a due insiemi; per le proprietà, $A$ al posto di $B$, $B \setminus A$,
$\emptyset$ e $A \cup \{0\}$ (l'insieme vuoto confuso con $\{0\}$). Solo come ultima risorsa,
l'unione senza un elemento.

Numeri (livelli 5-6): la somma senza togliere l'intersezione, l'intersezione tolta due volte, la
risposta a un'altra domanda dello stesso problema (per esempio "nessuno" al posto di "almeno uno");
poi ±1, ±2.

## Esercizi da evitare

- Elementi ripetuti negli elenchi del problema.
- Problemi in cui la risposta è un numero scritto nel testo.
- Pari e dispari insieme al livello 2 (disgiunti e complementari: l'unione è tutto l'intervallo).

## Domande per la revisione

- I contesti del livello 6 vanno bene per il biennio? Ne servono altri?
- Al livello 4 la variante con l'universo usa U = {1, ..., n}: basta, o serve un universo descritto a
  parole?
