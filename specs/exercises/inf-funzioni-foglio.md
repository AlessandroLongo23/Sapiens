# Le funzioni del foglio di calcolo

Generatore: `inf-funzioni-foglio` (`src/lib/exercises/v2/generators/inf-funzioni-foglio.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_funzioni_foglio.py`. Lezione collegata: "Le funzioni del foglio di calcolo"
(`docs/lezioni/informatica/riscritte/25-inf-funzioni-foglio.md`). Macchinario comune:
`src/lib/exercises/v2/inf-foglio.ts`, `scripts/exercises/checkers/_inf_foglio.py`; la scrittura di formule e tabelle è
quella descritta in `specs/exercises/excel.md`.

Sei livelli nell'ordine della lezione. Ogni esercizio mostra un foglio di tre colonne e chiede il valore di una
formula scritta in una cella della colonna `D`: la risposta è un numero (`number`), con al più due decimali.

## Nomi dei livelli

1. SOMMA e MEDIA
2. MIN, MAX e CONTA.NUMERI
3. Celle vuote e testo
4. Più argomenti
5. ARROTONDA
6. Funzioni annidate

## Le funzioni

- `SOMMA`, `MEDIA`, `MIN`, `MAX`, `CONTA.NUMERI` lavorano sui numeri dei loro argomenti: le celle vuote e le celle
  con un testo di un intervallo vengono saltate. Gli argomenti si separano con il punto e virgola e possono essere
  intervalli, anche rettangolari, o numeri.
- `ARROTONDA(numero;cifre)` arrotonda alle cifre decimali indicate; il 5 arrotonda per eccesso.
- `SE`, `CONTA.SE` e le funzioni logiche non compaiono: sono della lezione 26.

## Livello 1: SOMMA e MEDIA

Un foglio di 4 o 5 righe di interi da 1 a 20. L'intervallo è un pezzo di colonna di almeno 3 celle oppure una riga
intera. La somma delle sole due celle agli estremi (per `MEDIA`: la somma al posto della media) deve dare un altro
numero.

Esempi:

1. `=SOMMA(A2:A5)` con 11, 20, 20, 6: 57.
2. `=MEDIA(B1:B5)` con 10, 8, 16, 3, 16: 53 : 5 = 10,6.

## Livello 2: MIN, MAX e CONTA.NUMERI

Lo stesso foglio, con interi da 1 a 30 oppure, circa una volta su tre, da −9 a 12.

Esempi:

1. `=MIN(C3:C5)` con 3, −6, 5: −6.
2. `=CONTA.NUMERI(A1:A5)`: 5.

## Livello 3: celle vuote e testo

Un pezzo di colonna di almeno 4 celle in cui una cella (due, se le celle sono 5) è vuota oppure contiene un testo
("assente", "n.d.", "rinviato"). Funzioni: `MEDIA` (due volte su cinque), `CONTA.NUMERI`, `MIN`, `SOMMA`. Fuori
dall'intervallo il foglio non ha buchi.

Esempi:

1. `=CONTA.NUMERI(B1:B4)` con una cella vuota e 15, 10, 20: 3.
2. `=MEDIA(A1:A4)` con 12, assente, 9, 6: 27 : 3 = 9 (non 27 : 4).

## Livello 4: più argomenti

Un foglio di 3 o 4 righe di interi da 1 a 15 e una funzione tra `SOMMA`, `MAX`, `MIN`, `MEDIA`, `CONTA.NUMERI` con:

- un rettangolo di due colonne (`A2:B3`);
- due intervalli uguali nelle colonne `A` e `C` (`A1:A3;C1:C3`): la colonna `B` resta fuori, e contarla deve
  cambiare il risultato;
- un intervallo e un numero (`A1:A4;14`).

Esempi:

1. `=MAX(A2:B3)` con 8, 10, 15, 11: 15.
2. `=MEDIA(A1:C1;7)` con 8, 9, 7 e il numero 7: 31 : 4 = 7,75.

## Livello 5: ARROTONDA

Un foglio di due righe: nella prima tre numeri con al più tre decimali, nella seconda tre interi da 2 a 15. Il primo
argomento è una cella della prima riga (metà dei casi), il prodotto di una cella della prima riga per una della
seconda, o il quoziente di due celle della seconda; le cifre sono 0, 1 o 2. L'arrotondamento deve cambiare il numero.

Esempi:

1. `=ARROTONDA(B1;2)` con 30,968: 30,97.
2. `=ARROTONDA(A1*B2;0)` con 23,325 e 10: 233,25 diventa 233.

## Livello 6: funzioni annidate

Un foglio di 4 righe di interi da 2 a 20 e una di queste formule:

- `=ARROTONDA(MEDIA(r);n)`, con n = 0 o 1 e a volte una cella vuota nell'intervallo;
- `=MAX(r)-MIN(r)`;
- `=SOMMA(r)/CONTA.NUMERI(r)`, con un testo nell'intervallo;
- `=MAX(SOMMA(r1);SOMMA(r2))` o `=MIN(…)`, su due colonne;
- `=SOMMA(r)-MIN(r)` o `=SOMMA(r)-MAX(r)`;
- `=ARROTONDA(SOMMA(r)/k;n)`, con k tra 3, 6, 7, 9, 11.

Ogni `ARROTONDA` cambia il numero su cui lavora.

Esempi:

1. `=MIN(SOMMA(A1:A4);SOMMA(B1:B4))` con somme 35 e 30: 30.
2. `=ARROTONDA(SOMMA(A1:A4)/6;1)` con somma 44: 7,333… diventa 7,3.

## Esercizi "brutti" da evitare

- medie e quozienti con più di due decimali (tranne dentro `ARROTONDA`);
- al livello 3 un intervallo senza buchi, o buchi fuori dall'intervallo;
- al livello 5 e al 6 un arrotondamento che non cambia niente;
- conteggi con opzioni che non sono interi positivi.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta. I distrattori sono il valore della formula che un errore tipico calcolerebbe;
se non bastano, numeri vicini.

- Livello 1: i due punti letti come "le due celle agli estremi"; tutta la colonna; `MEDIA` per `SOMMA` e viceversa;
  la media divisa per una cella in meno.
- Livello 2: `MIN` per `MAX`; il numero più vicino a zero al posto del minimo; la prima o l'ultima cella; per
  `CONTA.NUMERI` la somma, il massimo, una cella in meno.
- Livello 3: la media divisa per tutte le celle; il conteggio di tutte le celle; 0 come minimo.
- Livello 4: i due intervalli letti come un rettangolo solo; una sola colonna del rettangolo; il numero in più
  dimenticato, o moltiplicato.
- Livello 5: il numero troncato; troncato e aumentato di uno; una cifra in più o in meno.
- Livello 6: il valore della sola funzione interna; la funzione sbagliata tra `MIN` e `MAX`; la media su tutte le
  celle; il troncamento.

## Domande per la revisione

- I testi nelle celle sono "assente", "n.d." e "rinviato": vanno bene per un foglio di voti o di misure?
- Al livello 5 i numeri da arrotondare hanno fino a tre decimali (30,968): troppo, o va bene?
- `CONTA.VALORI`, `RADQ` e le funzioni di data non ci sono, come nella lezione. Servono?
