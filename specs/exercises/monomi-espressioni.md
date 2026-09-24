# Espressioni con monomi

Generatore: `monomi-espressioni` (`src/lib/exercises/v2/generators/monomi-espressioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/monomi_espressioni.py`. Lezione collegata:
`docs/lezioni/riscritte/15-monomi-espressioni.md`.

Lo studente semplifica un'espressione con monomi, rispettando l'ordine delle operazioni della
lezione: parentesi dalla più interna (tonde, quadre, graffe), poi potenze, poi prodotti e quozienti
da sinistra a destra, infine somme di monomi simili. Ogni risultato intermedio è un monomio non
nullo, e anche la risposta (`answer.kind = "expression"`).

## Lettura del testo

Il verificatore legge il LaTeX con le convenzioni del libro, scritte in
`scripts/exercises/checkers/monomi_common.py` senza guardare il generatore: un monomio scritto senza
parentesi è un unico fattore (`12x^5 : 3x^2 \cdot 2x = 4x^3 \cdot 2x`); `\cdot` e `:` hanno la
stessa precedenza e si eseguono da sinistra a destra; l'esponente si applica a ciò che lo precede.
In modalità stretta segnala ogni parentesi, quoziente o risultato che non è un monomio non nullo.
Controlla anche l'ordine delle parentesi: ogni parentesi è di un livello sopra la più alta che
contiene (tonde dentro quadre dentro graffe), contando anche le tonde attorno a un solo monomio,
come nell'esempio 3 della lezione.

## Scrittura

- Il divisore sta sempre tra parentesi: `: (4x^3y^2)`; un fattore negativo o frazionario pure:
  `\cdot (-2ab)`, `\cdot \left(\frac{2}{3}ab\right)`; un fattore positivo intero no: `\cdot 9ab`.
- Un termine che comincia con un monomio negativo porta il segno fuori: `2y^3z^4 - 3z^2 \cdot 5y^3z^2`.
- Una potenza ha sempre la base tra parentesi: `(-3xy)^2`, `(2x^3)^2`.

## Rappresentazione

`params.tree` è l'albero dell'espressione: nodi `m` (monomio `{c, e}`), `pow` (base e esponente),
`chain` (operandi e operazioni `mul`/`div`), `sum` (termini con il flag `neg` per un meno davanti a
una potenza o a una parentesi), `group` (una parentesi con una somma). `params.result` è il
risultato, `params.case` il caso.

## Regole comuni

- Coefficienti nel testo fino a 60, denominatori fino a 9; risultati intermedi fino a 300 con
  denominatore fino a 12; risultato fino a 100 con denominatore fino a 9 ed esponenti fino a 12.
- Ogni monomio del testo ha almeno una lettera; di solito una o due lettere per esercizio.

## Livello 1: prima il prodotto o il quoziente, poi la somma

Un prodotto (circa 55%) o un quoziente di due monomi e un monomio simile al risultato, coefficienti
interi (esempio 1 della lezione).

1. `-3c \cdot (-4c^3) - 3c^4`: `12c^4 - 3c^4 = 9c^4`.
2. `-16b^3c^3 : (8c^3) + 6b^3`: `-2b^3 + 6b^3 = 4b^3`.

## Livello 2: prodotti e quozienti da sinistra a destra

Tre monomi legati da `:` e `\cdot`: circa 7 su 10 nella forma `a : b \cdot c`, dove l'errore di fare
prima il prodotto cambia il risultato (riquadro "errori frequenti" della lezione); metà delle volte
segue un monomio simile da sommare.

1. `-15y^5 : (-3y^2) \cdot (-y^2) = 5y^3 \cdot (-y^2) = -5y^5`.
2. `-6b^4c^2 : (2b^3) \cdot b^2c^2 - 7b^3c^4`: `-3bc^2 \cdot b^2c^2 = -3b^3c^4`, poi `-3b^3c^4 - 7b^3c^4 = -10b^3c^4`.

## Livello 3: con le potenze

Una potenza di un monomio (esponente 2 o 3), poi un prodotto o un quoziente, poi una somma
(esempio 2 della lezione); coefficienti frazionari possibili. Circa 2 su 10 hanno un meno fuori
dalla potenza, `- (2a)^2 \cdot \dots` (caso `meno fuori dalla potenza`).

1. `(2ac^3)^3 : (2a^2c^9) + 9a`: `8a^3c^9 : (2a^2c^9) = 4a`, `4a + 9a = 13a`.
2. `5z \cdot \left(\frac{1}{2}z^2\right)^2 - \frac{2}{3}z^5`: `\frac{5}{4}z^5 - \frac{2}{3}z^5 = \frac{7}{12}z^5`.

## Livello 4: una parentesi con una somma

Una sola parentesi che contiene una somma di monomi simili: quadra quando dentro ci sono tonde
(`\left[5x^3y^2 \cdot (-2x^2y^2)^2 - 6x^7y^6\right] : \left(\frac{2}{3}y^6\right)`, come
nell'esempio 3), tonda quando elevata a potenza (`\left(-\frac{5}{3}b^2c + \frac{2}{3}b^2c\right)^2 \cdot 2b^3c^3`).

1. `\left[5x^3y^2 \cdot (-2x^2y^2)^2 - 6x^7y^6\right] : \left(\frac{2}{3}y^6\right)`: nella quadra
   `20x^7y^6 - 6x^7y^6 = 14x^7y^6`, poi `14x^7y^6 : \left(\frac{2}{3}y^6\right) = 21x^7`.
2. `\left(-\frac{5}{3}b^2c + \frac{2}{3}b^2c\right)^2 \cdot 2b^3c^3`: la tonda vale `-b^2c`, il
   quadrato `b^4c^2`, il prodotto `2b^7c^5`.

## Livello 5: tonde, quadre e graffe

Tre livelli di parentesi con la struttura dell'esempio 4 della lezione:
`\left\{\left[\left(S_1 + S_2\right)^2 : (D_1) + R\right] \cdot (M) + T\right\} : (D_2)`, con le
varianti prodotto al posto del quoziente nella quadra, termini in ordine scambiato, `T` prodotto di
una potenza e di un monomio, a volte con un meno davanti.

1. `\left\{\left[-3ac + \left(-4ac + 2ac\right)^2 : (2ac)\right] \cdot (-4ac^2) - \left(\frac{2}{3}c\right)^2 \cdot (-7a^2c)\right\} : (4a^2) = \frac{16}{9}c^3`.
2. `\left\{2y^8z^4 \cdot 3z^2 + \left[\left(4y^2z^2 - 5y^2z^2\right)^2 \cdot (-2y^2) + 4y^6z^4\right] \cdot (-y^2z^2)\right\} : (2y^2z^4) = 2y^6z^2`.

## Esercizi "brutti" da evitare

- un quoziente intermedio che non è un monomio, una parentesi che vale 0, un risultato senza
  lettere;
- parentesi fuori ordine (quadre dentro tonde) o tonde attorno a un monomio positivo intero usato
  come fattore;
- numeri che crescono oltre i limiti delle regole comuni;
- `1x`, `x^1`, `+ -`, frazioni con il segno dentro.

## Variante a scelta multipla

Quattro monomi distinti, uno corretto. I distrattori si ottengono rifacendo il calcolo con un errore
della lezione: prodotto fatto prima del quoziente che lo precede; coefficiente della potenza non
elevato; esponenti sommati nella potenza; segno della potenza sbagliato, o meno fuori dalla potenza
portato dentro (`-(2a)^2` letto `(-2a)^2`); divisione per una frazione senza il reciproco; nella
somma, esponenti sommati; infine il risultato con il segno cambiato. Se non bastano, coefficiente
±1 o un esponente +1.

## Domande per la revisione

- Al livello 5 i passaggi ("Nella parentesi quadra, potenza: ...") sono chiari, o serve una riga
  che riscrive l'espressione intera dopo ogni parentesi?
- Le espressioni con risultato polinomio (monomi non simili alla fine) vanno qui o nella lezione
  sulle espressioni con polinomi, come dice la lezione 15?
- I risultati frazionari come `\frac{16}{9}c^3` sono accettabili al livello 5, o conviene imporre un
  coefficiente intero?
