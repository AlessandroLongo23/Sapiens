# Potenze in ℤ

Generatore: `numeri-interi-potenze` (`src/lib/exercises/v2/generators/numeri-interi-potenze.ts`).
Verifica indipendente: `scripts/exercises/checkers/numeri_interi_potenze.py`. Lezione collegata:
"Potenze in ℤ" (`docs/lezioni/riscritte/22-numeri-interi-potenze.md`).

Lo studente calcola il valore di una potenza di un intero o di un'espressione con le potenze. La
risposta è sempre un numero intero (`number`). I livelli seguono l'ordine della lezione: il segno
della potenza, il meno fuori dalla base, le proprietà, le basi opposte, le espressioni.

## Rappresentazione

`params.expr` è un albero: `{t: "n", v}` (un intero), `{t: "pow", b, e}` (la base `b` è un numero o
una potenza, per la potenza di potenza), `{t: "neg", x}` (il meno davanti a un termine),
`{t: "op", op, l, r}` con `op` tra `+ - * :`, `{t: "g", c, k}` (la graffa del livello 6). Il testo è
scritto dall'albero; `params.case` descrive il caso; `params.wrong` sono i valori degli errori
tipici, usati per la scelta multipla. Il controllo in Python non legge l'albero per il valore: rilegge
il LaTeX con le priorità della lezione e lo calcola con interi esatti.

## Regole comuni

- Base negativa sempre tra parentesi tonde: `(-3)^2`. Senza parentesi il meno non fa parte della
  base: `-3^2` vale `-9`.
- Potenza di potenza tra tonde se la base interna è positiva, `(2^3)^2`, tra quadre se è negativa,
  `[(-2)^3]^2`; la graffa del livello 6 contiene le quadre. Parentesi nell'ordine tonde, quadre,
  graffe dall'interno.
- Esponente a una cifra senza graffe (`2^5`), a più cifre con le graffe (`(-1)^{46}`); numeri da
  10 000 in su con lo spazio sottile (`15\,625`). Positivi senza il `+` davanti.
- Nessun `+ -`, `- -` o `+ +`; nessun numero negativo fuori da una parentesi, tranne il meno
  all'inizio dell'espressione o della graffa.
- Mai base 0 (quindi mai `0^0`). Esponente 1 scritto solo al livello 1, esponente 0 solo ai livelli 1
  e 5.
- Ogni divisione è esatta in ℤ.
- I passaggi dicono qual è la base e se l'esponente è pari o dispari, come il procedimento della
  lezione.

## Livello 1: potenza con base negativa

`(-a)^n` con `a` almeno 2 ed esponente da 0 a 4: circa 4 su 10 esponente pari (2 o 4), 4 su 10
dispari (3), 1 su 10 esponente 0, 1 su 10 esponente 1. Limiti su `a`: fino a 15 con esponente 2,
fino a 10 con esponente 3 e 4, fino a 30 con esponente 0 e 1.

Esempi: `(-3)^3 = (-3) \cdot (-3) \cdot (-3) = -27`; `(-7)^0 = 1`.

## Livello 2: il meno fuori dalla base e le potenze di −1

Circa 4 su 10 `-a^n` (il meno fuori dalla base), 25 su 100 `-(-a)^n` (l'opposto di una potenza con
base negativa), 35 su 100 `(-1)^n` con `n` da 10 a 120. Nei primi due casi esponente da 2 a 5, pari
7 volte su 10.

Esempi: `-2^4 = -16`; `-(-2)^3 = 8`; `(-1)^{51} = -1`.

## Livello 3: una proprietà con base negativa

Una sola proprietà con una sola base negativa (−2, −3, −4, −5, −10), un terzo ciascuna: prodotto
`a^m \cdot a^n`, quoziente `a^m : a^n`, potenza di potenza `[a^m]^n`. Esponenti scritti da 2 in su;
l'esponente finale va da 2 al massimo per cui il valore resta entro 10 000 (−2: 10, −3: 8, −4: 6,
−5: 5, −10: 4). La soluzione dà il risultato come potenza e come numero.

Esempi: `(-3)^5 : (-3)^3 = (-3)^2 = 9`; `[(-2)^3]^2 = (-2)^6 = 64`.

## Livello 4: basi opposte o stesso esponente

Metà e metà:

- basi opposte, `2` e `-2` (anche 3 e 5), esponenti diversi, moltiplicate o divise: prima si porta
  tutto alla stessa base con `(-a)^n = a^n` (esponente pari) o `(-a)^n = -a^n` (dispari), poi la
  proprietà; esponente finale almeno 2, nessuna potenza scritta sopra 10 000;
- stesso esponente (da 2 a 4), almeno una base negativa, basi con valori assoluti diversi: prodotto
  `a^n \cdot b^n = (a \cdot b)^n` o quoziente `a^n : b^n = (a : b)^n` con `a` divisibile per `b`.

Risultato fino a 10 000.

Esempi: `(-2)^4 \cdot 2^3 = 2^4 \cdot 2^3 = 2^7 = 128`; `(-2)^3 \cdot 5^3 = (-10)^3 = -1000`.

## Livello 5: espressioni con le potenze

Somma algebrica di 3 termini (6 su 10) o 4, senza parentesi oltre a quelle delle basi negative. Ogni
termine è una potenza o il prodotto o quoziente di due potenze; il primo termine può avere il meno
davanti. Potenze con base da ±2 a ±6 o ±10 ed esponente 0, 2, 3, 4 (valore fino a 125), oppure base
−1 con esponente da 2 a 20. Sempre almeno un `-a^n` con base positiva ed esponente pari (spesso
all'inizio, come nell'esempio 2 della lezione) e almeno una base negativa con esponente dispari; al
massimo un esponente 0. Risultato fino a 300 in valore assoluto.

Esempi: `-2^4 + (-2)^3 \cdot (-1)^{10} - (-5)^0 = -25`; `-3^4 + (-1)^{14} - (-4)^3 = -16`.

## Livello 6: espressioni con le parentesi

`\{A \pm B\} \cdot M`, oppure `M \cdot \{A \pm B\}`, oppure `\{A \pm B\} : (-1)^n`, come l'esempio 4
della lezione:

- un blocco è `[(-a)^m]^n : d^k` (a = 2 o 3, `d` uguale a ±a o ±a²), calcolato con i numeri;
- l'altro blocco è un quoziente con lo stesso esponente, un quoziente con basi opposte o un quoziente
  con la stessa base negativa;
- `M` è `(-1)^n` (6 su 10, n da 3 a 15) o una tra `(-2)^2`, `(-2)^3`, `(-3)^2`.

Graffa tra −100 e 100 e diversa da 0; risultato fino a 1000.

Esempi: `\{[(-2)^3]^2 : (-4)^2 - (-6)^2 : 2^2\} \cdot (-1)^7 = 5`;
`(-1)^{13} \cdot \{[(-2)^3]^2 : (-4)^2 - 8^3 : (-2)^3\} = -68`.

## Da evitare

- `-3^2` letto come `(-3)^2`: il testo non lo scrive mai in modo ambiguo, perché la base negativa
  ha sempre le parentesi; `-3^2` compare di proposito ai livelli 2 e 5.
- Numeri enormi: potenze scritte fino a 10 000 (20 000 al livello 4 con lo stesso esponente).
- Scelta multipla riempita con numeri a caso: l'esercizio si scarta se gli errori tipici non danno
  almeno tre valori diversi dalla risposta.
- Divisioni non esatte, esponente 1 scritto nel testo dopo il livello 1.

## Variante a scelta multipla

Quattro opzioni intere distinte, una corretta, dagli errori della lezione:

- livello 1: il segno sbagliato, base per esponente (`(-3)^2 \to -6`), un fattore in meno o in più;
  per l'esponente 0: 0, la base, −1; per l'esponente 1: l'opposto, 1, −1;
- livello 2: `-a^n` letto come `(-a)^n`, base per esponente con l'uno o l'altro segno; per `(-1)^n`:
  il segno sbagliato, `-n`, `n`, 0;
- livello 3: il segno sbagliato, esponenti moltiplicati invece che sommati (o sommati invece che
  sottratti, o divisi), per la potenza di potenza esponenti sommati; un fattore in meno o in più;
- livello 4: le basi opposte trattate come la stessa base (`(-2)^3 \cdot 2^4 \to (-2)^7`), il segno
  sbagliato, esponenti moltiplicati; con lo stesso esponente, esponenti sommati e base per
  esponente;
- livelli 5 e 6: l'espressione ricalcolata con un errore alla volta: `-a^n` letto come `(-a)^n`, base
  negativa con esponente dispari presa positiva, esponente 0 preso come 0, operazioni da sinistra a
  destra senza priorità, potenza calcolata come base per esponente, potenza di potenza con gli
  esponenti sommati (livello 6), il segno di `M` dimenticato (livello 6), il risultato cambiato di
  segno.

## Domande per la revisione

- Il livello 2 mette insieme il meno fuori dalla base e le potenze di −1: è una difficoltà sola o
  conviene separarle?
- Al livello 4 con lo stesso esponente escono prodotti come `(-4)^3 \cdot (-5)^3 = 8000`: troppo
  pesanti a mano?
- Al livello 6 la divisione per `(-1)^n` (3 casi su 10 con `(-1)^n`) non è nella lezione: tenerla?
