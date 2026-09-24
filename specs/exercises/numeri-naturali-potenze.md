# Potenze in ℕ

Generatore: `numeri-naturali-potenze` (`src/lib/exercises/v2/generators/numeri-naturali-potenze.ts`).
Verifica indipendente: `scripts/exercises/checkers/numeri_naturali_potenze.py`. Lezione collegata:
"Potenze in ℕ" (`docs/lezioni/riscritte/08-numeri-naturali-potenze.md`). Macchinario comune:
`src/lib/exercises/v2/naturali.ts`.

I livelli seguono l'ordine della lezione: definizione con gli esponenti 0 e 1, proprietà con la
stessa base, con lo stesso esponente, basi da riportare alla stessa base, potenze nelle
espressioni. La risposta è un numero (`number`), tranne la domanda su `0^0`, che è a scelta.

## Rappresentazione

- Livello 1: `params.base`, `params.exponent`, `params.value`, `params.case`.
- Livelli 2-5: `params.expr` è l'espressione in ASCII (`2^5*2^8:(2^4)^2`, esponenti di più cifre
  come `^(12)`), identica al testo LaTeX tolti `\cdot` e gli spazi; `params.value` il valore.

## Regole comuni

- Nessun quoziente di potenze ha l'esponente del divisore più grande di quello del dividendo: ogni
  passaggio resta in ℕ (la lezione: `3^2 : 3^5` non si calcola in ℕ).
- `0^0` compare solo nella domanda che chiede quale potenza non ha significato.
- Esponenti a una cifra scritti `2^5`, a due cifre `2^{13}`; numeri da 10 000 in su con lo spazio
  sottile (`10\,000`).

## Livello 1: il valore di una potenza

- circa 60%: `a^n` con `n` da 2 e valore fino a 1024 (basi da 2 a 9, 11, 12, 13, 15, 20);
- circa 27%, un quinto ciascuno: `a^0`, `a^1` (`a` da 2 a 30), `0^n`, `1^n` (`n` da 2 a 9), `10^n`
  (`n` da 2 a 6);
- circa 13%: "Quale di queste potenze non ha significato?", con `0^0` e tre potenze con significato
  tra `0^k`, `k^0`, `1^0`, `1^k`, `0^1`.

Esempi svolti:

1. `2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32`.
2. `7^0 = 1`: ogni numero diverso da zero elevato a 0 fa 1.

## Livello 2: proprietà con la stessa base

Catene di due o tre potenze con la stessa base (2, 3, 5, 7, 10), da sinistra a destra: prodotto e
quoziente (`a^m \cdot a^n : a^p`, `a^m : a^n \cdot a^p`, `a^m : a^n : a^p`), potenza di potenza
(`(a^m)^n : a^p`, `a^m \cdot a^n : (a^p)^q`), esponente 0 (`(a^m)^n : a^p \cdot a^0`). Nessun
esponente intermedio oltre 15; risultato `a^k` fino a 1024 (fino a `10^4` per la base 10). Circa
6 su 10 dei risultati `a^0` e `a^1` vengono scartati, così la maggior parte chiede una potenza vera.

Esempi svolti:

1. `2^5 \cdot 2^3 : 2^6 = 2^{5+3} : 2^6 = 2^8 : 2^6 = 2^2 = 4`.
2. `(3^4)^2 : 3^5 \cdot 3^0 = 3^8 : 3^5 \cdot 3^0 = 3^3 = 27`.

## Livello 3: proprietà con lo stesso esponente

`a^n \cdot b^n = (a \cdot b)^n`, `a^n : b^n = (a : b)^n` con `b` divisore di `a`, e
`a^n \cdot b^n : c^n`. Esponente da 2 a 4, basi diverse, ogni potenza e il risultato fino a 10 000.

Esempi svolti:

1. `6^4 : 3^4 = (6 : 3)^4 = 2^4 = 16`.
2. `2^3 \cdot 5^3 = (2 \cdot 5)^3 = 10^3 = 1000`.

## Livello 4: basi da riportare alla stessa base

Due o tre potenze le cui basi sono 2, 4, 8, 16, 32 (potenze di 2), 3, 9, 27 o 5, 25; almeno una
base da riscrivere e almeno due basi diverse. Nella base comune nessun esponente oltre 15;
risultato fino a 1024.

Esempi svolti:

1. `4^3 \cdot 2^5 : 8^2`: `4^3 = (2^2)^3 = 2^6`, `8^2 = (2^3)^2 = 2^6`; resta
   `2^6 \cdot 2^5 : 2^6 = 2^5 = 32`.
2. `5^3 \cdot 25^4 : 5^9`: `25^4 = 5^8`; resta `5^{11} : 5^9 = 5^2 = 25`.

## Livello 5: espressioni con le potenze

Espressioni costruite all'indietro come quelle di "Operazioni in ℕ", con potenze: almeno una
potenza (base da 2, esponente da 2 a 5, valore fino a 125), a volte con una parentesi come base
(`(31 - 10 - 18)^3`); tonde e al massimo quadre; da 4 a 9 numeri fino a 50; risultati intermedi
fino a 300; fattore più piccolo e divisori da 2 a 12. Togliere le parentesi e calcolare `2^3` come
`2 \cdot 3` devono cambiare il risultato.

Esempi svolti:

1. `(2^2 \cdot 18 : 12 + 14) : 4 \cdot 3^2`. Tonde: 4 · 18 : 12 + 14 = 6 + 14 = 20; resta
   20 : 4 · 9 = 45.
2. `37 - (3 \cdot 2 - 2^5 : 2^3 + 30)`. Tonde: 6 − 32 : 8 + 30 = 6 − 4 + 30 = 32; resta 37 − 32 = 5.

## Esercizi "brutti" da evitare

- quozienti di potenze con l'esponente del divisore più grande (`3^2 : 3^5`);
- risultati enormi (oltre 1024 ai livelli 1, 2 e 4, oltre 10 000 al livello 3);
- `0^0` in un calcolo;
- al livello 3 basi il cui quoziente non è naturale;
- al livello 4 potenze già tutte nella stessa base;
- al livello 5 espressioni senza potenze, o in cui `2^3 = 6` dà lo stesso risultato.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta.

- Livello 1: `a \cdot n` (l'errore `2^3 = 6`), base ed esponente scambiati (`n^a`), un fattore in
  meno o in più; per `a^0`: 0, `a`, "non ha significato"; per `0^n`: 1, `n`, "non ha significato";
  per `10^n`: `10 \cdot n` e gli zeri sbagliati di uno.
- Livello 2: la potenza di potenza con gli esponenti sommati; il prodotto con gli esponenti
  moltiplicati; tutti gli esponenti sommati anche nei quozienti; `a^0 = 0`; `a^k` come `a \cdot k`;
  l'esponente finale sbagliato di 1.
- Livello 3: `q \cdot n`; con il prodotto gli esponenti sommati; con il quoziente gli esponenti
  sottratti (risultato 1); la sola base senza esponente.
- Livello 4: la base riscritta sommando gli esponenti (`(2^2)^3 = 2^5`); le basi non riscritte
  (`4^3` letto come `2^3`); `a^k` come `a \cdot k`.
- Livello 5: `2^3 = 6`; il calcolo da sinistra a destra; `(a + b)^2 = a^2 + b^2`; le parentesi
  ignorate; la moltiplicazione prima della divisione.
- Se non bastano, numeri vicini.

## Domande per la revisione

- La domanda su `0^0` ha il campo `problem` vuoto (la domanda è tutta nel testo): va bene così, o
  meglio mostrare le quattro potenze anche nel problema?
- Al livello 2 la risposta deve essere il valore (4) o la potenza (`2^2`)? Ora è il valore, e la
  potenza sta nei passaggi.
- Manca un livello sulla scrittura con le potenze di 10 (`4352 = 4 \cdot 10^3 + \dots`): serve?
