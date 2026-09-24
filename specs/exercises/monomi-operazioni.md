# Operazioni tra monomi

Generatore: `monomi-operazioni` (`src/lib/exercises/v2/generators/monomi-operazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/monomi_operazioni.py`. Lezione collegata:
`docs/lezioni/riscritte/13-monomi-operazioni.md`.

Lo studente calcola una somma algebrica, un prodotto, un quoziente o una potenza di monomi. La
risposta è un'espressione (`answer.kind = "expression"`): `value` in forma SymPy (`-8*x**4*y**3`),
`latex` in forma normale (`-8x^4y^3`); al livello 3 è un polinomio di due termini. Il verificatore
legge il testo LaTeX, lo calcola con SymPy e confronta il risultato sia con `value` sia con il
LaTeX della risposta; controlla anche ogni passaggio che sia una catena di uguaglianze.

## Rappresentazione

Livelli 1-3: `params.terms`, lista di `{op, m}` dove `op` (1 o -1) è il segno scritto davanti e
`m` il monomio (`{c: "p/q", e: {x: 2}}`); `op = -1` con `m` negativo si scrive `- (-2x)`.
Livelli 4-6: `params.factors` (i fattori, dividendo e divisore, la base) e `params.n` (esponente).
`params.result` è il risultato, `params.case` il caso.

## Regole comuni

- Lettere di una sola famiglia (`a, b, c` o `x, y, z`), in ordine alfabetico, esponenti da 1 a 4
  nel testo; monomi del testo con coefficiente fino a 100 in valore assoluto e denominatore fino a 12.
- Nella somma i monomi si scrivono con il segno ripiegato (`3x - 5x`, mai `3x + -5x`); nel prodotto
  e nel quoziente ogni fattore sta tra parentesi, come nella lezione: `(2x^3y)\cdot(-4xy^2)`.
- Risultato in forma normale, coefficiente fino a 1000 e denominatore fino a 125 (potenze come
  `\left(\frac{2}{5}\right)^3`), esponenti fino a 16.

## Livello 1: somma algebrica di monomi simili

2 o 3 monomi simili a coefficienti interi. Circa 2 su 10 contengono un monomio negativo sottratto,
`3x - (-2x)` (caso `meno davanti a un negativo`); circa 1 su 10 sono due monomi opposti, con
risultato 0 (caso `opposti`, esempio 2 della lezione).

1. `5y - (-y)`: `5y + y = (5 + 1)\,y = 6y`.
2. `-12c^4 + 10c^4 - 6c^4 = (-12 + 10 - 6)\,c^4 = -8c^4`.

## Livello 2: coefficienti frazionari

2 o 3 monomi simili, almeno un coefficiente frazionario (denominatori da 2 a 6). Si riduce allo
stesso denominatore, come nell'esempio 1 della lezione. Il risultato non è nullo.

1. `-\frac{1}{2}y - \frac{1}{5}y = \left(-\frac{5}{10} - \frac{2}{10}\right)y = -\frac{7}{10}y`.
2. `-2z^3 + \frac{9}{2}z^3 = \left(-\frac{4}{2} + \frac{9}{2}\right)z^3 = \frac{5}{2}z^3`.

## Livello 3: somma con monomi non simili

3 o 4 monomi a coefficienti interi con due parti letterali diverse ma vicine (esponenti scambiati,
una lettera in più o in meno, un esponente diverso). Si riducono solo i monomi simili: il risultato
è un polinomio di due termini, nell'ordine in cui compaiono (esempio 3 della lezione).

1. `-x^3y + 3x^3y + 3y = 2x^3y + 3y`.
2. `4x + 5xy^3 + x + 7xy^3 = (4 + 1)\,x + (5 + 7)\,xy^3 = 5x + 12xy^3`.

## Livello 4: prodotto

2 fattori (circa 6 su 10) o 3; circa 3 coefficienti su 10 frazionari. Si moltiplicano i
coefficienti con la regola dei segni e si sommano gli esponenti.

1. `(2a)\cdot(-9a^2) = (2 \cdot (-9))\,a^{1+2} = -18a^3`.
2. `\left(-\frac{7}{2}x^4y^2z^3\right)\cdot(-5x^2yz^2)\cdot(-4z) = -70x^6y^3z^6` (tre segni meno).

## Livello 5: quoziente

Il dividendo si costruisce come divisore per quoziente, quindi la divisione dà sempre un monomio;
il divisore ha coefficiente diverso da ±1 e il quoziente ha almeno una lettera. Circa 4 su 10 hanno
una lettera che sparisce (`a^{3-3} = a^0 = 1`), circa 1 su 3 coefficienti frazionari (si moltiplica
per il reciproco).

1. `(9ab^2c^3) : (-3ab^2) = (9 : (-3))\,a^{1-1}b^{2-2}c^3 = -3c^3`.
2. `\left(\frac{4}{3}x^6y^3z^5\right) : \left(-\frac{2}{3}x^4yz^3\right) = \left(\frac{4}{3}\cdot\left(-\frac{3}{2}\right)\right)x^{6-4}y^{3-1}z^{5-3} = -2x^2y^2z^2`.

## Livello 6: potenza

Esponente 2 o 3 (anche 4 con coefficiente ±1, ±2, ±1/2), coefficienti negativi e frazionari
(circa 3 su 10).

1. `(-2x^2y)^3 = (-2)^3 x^{2\cdot 3}y^{1\cdot 3} = -8x^6y^3`.
2. `\left(\frac{1}{2}x^2z\right)^2 = \frac{1}{4}x^4z^2`.

## Esercizi "brutti" da evitare

- `1x`, `-1x`, `x^1`, `x^0`, `+ -`, `- -` fuori dalla forma `- (-2x)` voluta, frazioni con il segno
  dentro (`\frac{-3}{4}`);
- somme di monomi non simili ai livelli 1 e 2, somme nulle al livello 2;
- quozienti che non sono monomi, divisori con coefficiente 1;
- monomi senza lettere nel testo.

## Variante a scelta multipla

Quattro opzioni distinte come espressioni, una corretta. Distrattori, dagli errori frequenti della
lezione: somma: esponenti sommati come nel prodotto (`x^2 + x^2 = x^4`), segno di un termine
sbagliato, meno davanti a un negativo non cambiato, risultato con il segno cambiato, con le
frazioni numeratori e denominatori sommati; monomi non simili: tutto ridotto a un monomio (`5x^2`),
parti letterali unite (`3x + 2y = 5xy`), un termine con il segno cambiato; prodotto: esponenti
moltiplicati, coefficienti sommati, lettere di un solo fattore perse; quoziente: `0` al posto di 1
per la lettera che sparisce, lettera che resta con esponente 1, esponenti sommati o divisi,
coefficienti moltiplicati (reciproco dimenticato); potenza: coefficiente non elevato, esponenti
sommati, coefficiente moltiplicato per l'esponente, segno sbagliato. Se non bastano, coefficiente
±1 o un esponente +1.

## Domande per la revisione

- Al livello 3 il risultato va scritto nell'ordine di comparsa dei monomi o per grado decrescente?
- Serve un livello con il quoziente che non è un monomio (esempio 8 della lezione), con risposta
  "non è un monomio"?
- Al livello 1 il caso `- (-2x)` va tenuto, o è materia della lezione sui numeri relativi?
