# Prodotti notevoli

Generatore: `polinomi-prodotti-notevoli` (`src/lib/exercises/v2/generators/polinomi-prodotti-notevoli.ts`).
Verifica indipendente: `scripts/exercises/checkers/polinomi_prodotti_notevoli.py`. Lezione collegata:
`docs/lezioni/riscritte/30-polinomi-prodotti-notevoli.md` (nota in `docs/lezioni/note/`).

Lo studente sviluppa un prodotto notevole: somma per differenza, quadrato di un binomio, quadrato di
un trinomio, cubo di un binomio, potenza di un binomio con il triangolo di Tartaglia. La consegna è
sempre "Sviluppa il prodotto notevole." La risposta è un polinomio (`answer.kind = "expression"`,
`form: "expanded"`): `value` in forma SymPy, `latex` ridotto e ordinato. Il verso contrario, la
scomposizione, è di un altro generatore (lezioni 34-37).

## Costruzione

Si scelgono prima i termini (il termine uguale e quello che cambia segno, oppure i termini del
binomio o del trinomio), poi si scrive il testo e si sviluppa con aritmetica esatta. Nessun numero
si cerca per tentativi: i coefficienti sono piccoli per costruzione, come negli esempi della lezione.

`params`: `kind` (`sd`, `sq`, `tri`, `cube`, `pow`), `n` (esponente), `case`, `terms` (i termini
della base) oppure `factors`, `same`, `change` per la somma per differenza, `result`. Monomi come
`{c: "p/q", e: {x: 2}}`.

## Regole comuni

- Lettere di una sola famiglia (`a, b, c` o `x, y, z`). Termini del testo con coefficiente fino a
  12, denominatore fino a 4, esponenti fino a 3; i termini di una base non sono mai simili.
- Il testo si scrive come nella lezione: `(x + 3)(x - 3)`, `(3x - 2y)^2`,
  `\left(\frac{1}{2}a^2 + 4b\right)^2`. Niente `1x`, `+ -`, `x^1`, segno dentro la frazione.
- Il risultato è ridotto (niente termini simili) e ordinato secondo le potenze decrescenti della
  prima lettera in ordine alfabetico; a parità, della lettera successiva. È l'ordine degli esempi
  10, 12 e 15 della lezione: `4a^2 - 4ab - 2a + b^2 + b + \frac{1}{4}`. Per questo
  `(2 + 5x^3)(2 - 5x^3)` dà `-25x^6 + 4`, come l'esempio 4 (`-x^2 + 16`).
- Coefficienti del risultato fino a 250, denominatori fino a 81, esponenti fino a 12.
- Passaggi come nella lezione: per la somma per differenza il termine uguale e quello che cambia
  segno, poi `(A)^2 - (B)^2`; per il quadrato i due termini con la regola dei segni del doppio
  prodotto, poi `A^2 + 2 \cdot A \cdot B + B^2`; per il trinomio i tre quadrati, i tre doppi prodotti,
  la somma e la riduzione; per cubo e potenza la riga del triangolo e lo sviluppo termine per termine
  con le potenze scritte, `(2x)^3 + 3 \cdot (2x)^2 \cdot (-1) + \dots`

## Livello 1: somma per differenza con un numero

`(kx + n)(kx - n)` o con i fattori scambiati, `k` da 1 a 5 (circa 2 volte su 3 `k = 1`), `n` da 1
a 12. Il termine uguale è il primo in tutti e due i fattori (esempio 1).

1. `(x - 12)(x + 12) = x^2 - 144`.
2. `(2x + 7)(2x - 7) = (2x)^2 - 7^2 = 4x^2 - 49`.

## Livello 2: somma per differenza con monomi

Coefficienti, esponenti fino a 3, due lettere; circa 3 su 10 con una frazione; il termine uguale è
un numero circa 1 volta su 5 (esempi 2-4). Tre casi: termine uguale al primo posto e positivo (circa
45%), termine uguale negativo (circa 25%, esempio 3), termine uguale al secondo posto, con il
termine che cambia segno davanti (circa 30%, esempio 4).

1. `(-5z + 4x)(5z + 4x) = 16x^2 - 25z^2` (termine uguale al secondo posto).
2. `(3xy^2 - y)(3xy^2 + y) = 9x^2y^4 - y^2`.

## Livello 3: quadrato di un binomio con un numero

`(kx ± n)^2`, `k` da 1 a 4 (metà delle volte 1), `n` da 1 a 9. Casi: somma (35%), differenza (35%),
numero al primo posto `(n - x)^2` (15%, "per lo stesso motivo" dopo l'esempio 9), due termini
negativi `(-kx - n)^2` (15%, esempio 9).

1. `(-2x - 9)^2 = (-2x)^2 + 2 \cdot (-2x) \cdot (-9) + (-9)^2 = 4x^2 + 36x + 81`.
2. `(1 - x)^2 = x^2 - 2x + 1`.

## Livello 4: quadrato di un binomio con due monomi

Due lettere con coefficienti interi ed esponenti fino a 3 (60%, esempio 6), oppure con una frazione
(40%): un coefficiente frazionario (esempio 7) o una lettera e un numero frazionario (esempio 8).
Il secondo termine è negativo circa metà delle volte, il primo circa 1 volta su 7. Esclusi
`(x ± y)^2` e `(x ± n)^2`, che sono del livello 3.

1. `(-5x^2 + 3y)^2 = 25x^4 - 30x^2y + 9y^2`.
2. `\left(-\frac{1}{3}x^3 - 3z\right)^2 = \frac{1}{9}x^6 + 2x^3z + 9z^2`.

## Livello 5: quadrato di un trinomio

Tre casi: tre termini con parti letterali diverse, due lettere e un numero (40%, esempio 10);
`(x^2 ± kx ± n)^2` con termini simili da ridurre (35%, esempio 11); come il primo con una frazione
(25%, esempio 12).

1. `(3y + 2z + 3)^2 = 9y^2 + 12yz + 18y + 4z^2 + 12z + 9`.
2. `(a^2 - 3a - 5)^2 = a^4 - 6a^3 - a^2 + 30a + 25` (i termini in `a^2` sono `9a^2` e `-10a^2`).

## Livello 6: cubo di un binomio

Casi: `(kx ± n)^3` con numeri piccoli (40%, esempio 13); due lettere con coefficienti fino a 3
(25%, esempio 14); segni: numero al primo posto `(n - x)^3` o due termini negativi `(-x - n)^3`
(20%, esempio 16 e secondo riquadro di errore); una frazione (15%, esempio 15).

1. `(2a - 3c)^3 = 8a^3 - 36a^2c + 54ac^2 - 27c^3`.
2. `\left(\frac{2}{3}a - c^2\right)^3 = \frac{8}{27}a^3 - \frac{4}{3}a^2c^2 + 2ac^4 - c^6`.

## Livello 7: potenza di un binomio con il triangolo di Tartaglia

Esponente 4 (metà), 5 o 6. Casi: una lettera e un numero piccolo, quasi sempre con il segno meno
(55%, esempio 17): `n` fino a 3 con esponente 4, fino a 2 con esponente 5, solo 1 con esponente 6;
con esponente 4 anche `(2x ± 1)^4` e `(x^2 ± n)^4`; due lettere (30%), con un coefficiente 2 solo
all'esponente 4; numero al primo posto, `(3 - b)^4` (15%). Niente frazioni.

1. `(y - 1)^5 = y^5 - 5y^4 + 10y^3 - 10y^2 + 5y - 1`.
2. `(3 - b)^4 = b^4 - 12b^3 + 54b^2 - 108b + 81`.

## Esercizi "brutti" da evitare

- Basi con termini simili (`(x + 2x)^2`), fattori che non sono una somma per differenza.
- Livello 4 identico al livello 3 (`(x + 5)^2`) o banale (`(x + y)^2`).
- Coefficienti grandi: al cubo niente `(3x + 3y)^3`; alla potenza sesta solo `± 1` o una lettera.
- Risultato non ordinato o con termini simili non ridotti.

## Variante a scelta multipla

Quattro opzioni distinte, ognuna ridotta e ordinata come la risposta. Distrattori dagli errori della
lezione, nell'ordine:

- somma per differenza: termini scambiati (`x^2 - 16` al posto di `-x^2 + 16`, riquadro "Scambiare
  i due termini"), `A^2 + B^2`, coefficiente non elevato (`2x^4` al posto di `4x^4`, esempio 2),
  confusione con il quadrato `A^2 - 2AB + B^2`;
- quadrato di un binomio: `A^2 + B^2` (manca il doppio prodotto), coefficiente non elevato
  (`(3x)^2 = 3x^2`), segno del doppio prodotto sbagliato, `x^2 - 9` per `(x - 3)^2`, prodotto non
  raddoppiato;
- trinomio: un doppio prodotto dimenticato (il terzo o il secondo), la sola somma dei quadrati, il
  segno di un doppio prodotto, coefficiente non elevato, prodotti non raddoppiati;
- cubo: somma dei cubi `A^3 + B^3`, l'opposto (`(a - b)^3` preso per `(b - a)^3`, quando c'è un
  segno meno), il segno di `B` su tutti i termini (`x^3 - 6x^2 - 12x - 8`), coefficiente non elevato,
  coefficienti 1, 1, 1, 1;
- potenza: segni non alternati, `A^n + B^n`, potenze del secondo termine dimenticate
  (`x^4 - 8x^3 - 12x^2 - 8x - 2`), coefficiente non elevato, coefficienti tutti 1.

Il pulsante della risposta ha 252 px utili e KaTeX disegna a 16 px. Un'opzione più larga di circa
14 em (stima sui caratteri nel generatore: cifre, lettere, esponenti, frazioni, segni) va su due
righe, o tre al massimo, con `\begin{gathered} … \\ … \end{gathered}`, a capo prima di un `+` o di un
`-` della somma e con le righe il più possibile pari:
`\begin{gathered}y^5 - 5y^4 + 10y^3 \\ - 10y^2 + 5y - 1\end{gathered}`. Le opzioni corte restano su
una riga. Succede al livello 7 (circa 4 opzioni su 10) e a qualche trinomio del livello 5 (circa 1 su
20). Il controllo Python toglie le righe, ricompone il polinomio e lo controlla come gli altri; boccia
un `gathered` malformato, righe vuote, più di tre righe, una riga che non comincia con `+` o `-`.

Se due errori danno lo stesso polinomio o la risposta giusta, si scende nella lista; solo quando la
lista finisce si cambia di uno un coefficiente della risposta. Il controllo Python ricalcola gli
errori dai termini letti nel testo e chiede che almeno due distrattori su tre ne vengano.

## Verifica

- `sample.mts polinomi-prodotti-notevoli 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000;
  con seed di partenza 7001: PASS. Le quote dei casi stanno negli intervalli di `CASE_RANGES`.
- Esercizi diversi su 1.000 (seed 1): livello 1: 403, livello 2: 991, livello 3: 528, livello 4:
  890, livello 5: 857, livello 6: 370, livello 7: 164. Il livello 7 è il più stretto perché i numeri
  della potenza devono restare piccoli (con esponente 6 solo `± 1` o una lettera).
- Errori piantati a mano, tutti bocciati: valore della risposta cambiato; segno cambiato nel LaTeX
  della risposta; `correct` spostato su un'altra opzione; risposta non ordinata (ultimo termine
  spostato in testa); `n = 13` al livello 1; livello 1 con il termine uguale al secondo posto;
  `params.case` diverso dal caso letto nel testo; due opzioni uguali; tre distrattori inventati (la
  risposta con il termine noto cambiato), che non vengono da nessun errore della lezione; opzione
  con LaTeX diverso dal valore; risposta lasciata non sviluppata; un cubo dichiarato livello 5;
  un'opzione su due righe con una riga persa; le due righe scambiate; `gathered` non chiuso.
- Larghezza misurata nel browser (KaTeX a 16 px, 150 esercizi per livello, quattro opzioni ciascuno):
  nessuna opzione oltre 252 px; massimo per livello 96, 124, 124, 165, 240, 243, 238 px. Problemi
  entro 350 px: massimo 160, 259, 90, 124, 134, 104, 87 px.
- `review.mts` esce con 0: tutto il LaTeX passa da KaTeX.
- `npx tsc --noEmit -p .`: nessun errore nei file del generatore.

## Domande per la revisione

- Ordine del risultato: seguo la lezione (potenze decrescenti della prima lettera, poi della
  seconda), quindi `-25x^6 + 4` e non `4 - 25x^6`, e al trinomio `x^2 + 3xz - 10x + \frac{9}{4}z^2`
  e non l'ordine "quadrati poi doppi prodotti". Con la risposta aperta andrà accettato ogni ordine.
- Distrattore "coefficiente non elevato" con un termine negativo: `(-x)^2` diventa `-x^2`. È un
  errore vero, ma nel cubo dà opzioni poco naturali (`-x^3 + 6x^2 + 6x - 2`). Lo tengo?
- Il livello 2 mette insieme monomi con coefficiente, frazioni e il termine uguale al secondo posto
  (esempi 2-4). Se è troppo per un livello, il caso "termine uguale al secondo posto" può diventare
  un livello a sé.
