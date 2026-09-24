# Grado di un monomio

Generatore: `monomi-grado` (`src/lib/exercises/v2/generators/monomi-grado.ts`).
Verifica indipendente: `scripts/exercises/checkers/monomi_grado.py`. Lezione collegata:
`docs/lezioni/riscritte/12-monomi-grado.md`.

Lo studente riceve un monomio (o un'operazione tra monomi al livello 6) e deve dire il grado
complessivo oppure il grado rispetto a una lettera, come chiede la consegna. La risposta è un numero
naturale (`answer.kind = "number"`). Ogni esercizio ha una variante a scelta multipla con quattro
numeri distinti.

La parte comune a tutti i generatori dei monomi (forma normale, LaTeX, operazioni esatte) sta in
`src/lib/exercises/v2/monomi.ts`; il verificatore legge il testo LaTeX con il parser di
`scripts/exercises/checkers/monomi_common.py` e ricalcola il grado con SymPy.

## Rappresentazione

`params.ask` vale `"totale"` o la lettera chiesta; `params.factors` è la lista dei monomi
(`{c: "p/q", e: {x: 2}}`): uno solo ai livelli 1-4, i fattori del prodotto al livello 5, i due
operandi al livello 6. `params.coefPow` (livello 4) è la potenza scritta nel coefficiente,
`params.op` e `params.n` (livello 6) l'operazione e l'esponente. `params.degree` è la risposta,
`params.case` il caso.

## Regole comuni

- Lettere prese da una sola famiglia, `a, b, c` oppure `x, y, z`, in ordine alfabetico.
- Monomi in forma normale nel testo ai livelli 1-4: niente `1x`, `x^1`, `x^0`, `+ -`.
- Esponenti fino a 7 nel testo, fino a 16 nel risultato; mai il monomio nullo, che non ha grado.

## Livello 1: grado rispetto a una lettera

Monomio in forma normale con 2 o 3 lettere, coefficiente intero o (circa 1 su 4) frazionario; la
lettera chiesta compare. Circa un terzo delle volte ha l'esponente 1 sottinteso (caso
`esponente sottinteso`, il verificatore accetta dal 22% al 48%).

1. `\frac{3}{5}x^2y^4`, rispetto a `y`: la `y` ha esponente 4, grado 4.
2. `-9xy^7`, rispetto a `x`: la `x` è scritta senza esponente, quindi ha esponente 1, grado 1.

## Livello 2: grado complessivo

Monomio in forma normale con 2 o 3 lettere; circa 6 su 10 hanno una lettera senza esponente.
Il coefficiente, intero o frazionario, non entra nel grado.

1. `-10xy^6`: `1 + 6 = 7`.
2. `-\frac{1}{3}ab^4c^2`: `1 + 4 + 2 = 7`.

## Livello 3: lettere assenti e costanti

Nuova difficoltà: il grado 0. Circa 4 su 10 chiedono il grado rispetto a una lettera che non
compare (`lettera assente`), circa 2,5 su 10 il grado di una costante diversa da zero
(`costante`), gli altri sono esercizi ordinari (`controllo`), perché la risposta non sia sempre 0.

1. `-10xy^3`, rispetto a `z`: la `z` non compare, `z^0 = 1`, grado 0.
2. `5`: un numero diverso da zero è un monomio senza lettere, grado 0.

## Livello 4: esponente nel coefficiente

Il coefficiente è scritto come potenza: `2^3`, `(-3)^2`, `\left(\frac{1}{2}\right)^3`.
L'esponente del coefficiente non entra nel grado (esempio 3 della lezione). Circa 3 su 4 chiedono il
grado complessivo.

1. `3^2y^5`: il monomio è `9y^5`, grado 5.
2. `3^3a^2`: il monomio è `27a^2`, grado 2 (non 5).

## Livello 5: monomio non in forma normale

Prodotto di 2 o 3 fattori scritto con `\cdot`, con almeno una lettera ripetuta: prima si riduce a
forma normale, poi si legge il grado (esempio 4 della lezione). Circa 6 su 10 chiedono il grado
complessivo, gli altri il grado rispetto a una lettera ripetuta.

1. `-8b^2 \cdot b`: `-8b^3`, grado 3.
2. `-5x^2 \cdot xy^2`, rispetto a `x`: `-5x^3y^2`, grado rispetto a `x` uguale a 3.

## Livello 6: grado del risultato di un'operazione

Prodotto `(A)\cdot(B)` (circa 3 su 10), quoziente `(A) : (B)` con `B` che divide `A` (3,5 su 10),
potenza `(A)^n` con `n` da 2 a 4 (3,5 su 10). Si applica la tabella della lezione: nel prodotto i
gradi si sommano, nel quoziente si sottraggono, nella potenza il grado si moltiplica per
l'esponente. Il quoziente ha grado almeno 1.

1. `(-8y^3z^3)\cdot(-6y^4)`: `6 + 4 = 10`.
2. `(-6b^3c^5) : (3b)`: `8 - 1 = 7`.

## Esercizi "brutti" da evitare

- coefficiente 1 o esponente 1 scritti (`1x`, `x^1`), esponente 0 nel testo;
- lettere ripetute o fuori ordine in un monomio che dovrebbe essere in forma normale;
- il monomio nullo, di cui non si chiede il grado;
- al livello 3, sempre 0 come risposta: per questo ci sono i casi di controllo.

## Variante a scelta multipla

Quattro numeri distinti, uno corretto. Distrattori, in ordine di preferenza: la lettera senza
esponente contata 0; il grado complessivo al posto di quello rispetto a una lettera (e viceversa
l'esponente di un'altra lettera); l'esponente massimo; il numero di lettere; al livello 4 il grado
più l'esponente del coefficiente; al livello 5 il primo esponente della lettera ripetuta o il
massimo; al livello 6 il prodotto dei gradi nel prodotto, la somma nel quoziente, il grado più
l'esponente nella potenza. Se non bastano, il grado giusto ±1, ±2.

## Domande per la revisione

- Al livello 3 le costanti vanno bene anche frazionarie, come `-\frac{5}{2}`?
- Al livello 6 serve anche il caso del quoziente di grado 0 (`(6x^2y) : (3x^2y) = 2`)?
- La consegna "rispetto alla lettera x" sulla pagina di oggi mostra la lettera in tondo, dentro
  `\text{}`: va bene così?
