# Operazioni tra polinomi

Generatore: `polinomi-operazioni` (`src/lib/exercises/v2/generators/polinomi-operazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/polinomi_operazioni.py`. Lezione collegata:
`docs/lezioni/riscritte/29-polinomi-operazioni.md` (note in `docs/lezioni/note/29-polinomi-operazioni.md`).

Lo studente calcola una somma algebrica di due polinomi, il prodotto di un monomio per un polinomio,
il prodotto di due polinomi o il quoziente di un polinomio per un monomio. La risposta è un polinomio
(`answer.kind = "expression"`, `form: "expanded"`): `value` in forma SymPy, `latex` ridotto e
ordinato secondo le potenze decrescenti di una lettera, come nella lezione. Niente prodotti notevoli
(lezione 30) e niente divisione tra polinomi (lezione 32): hanno i loro generatori.

## Lettura del testo

Il verificatore legge il LaTeX con il parser di `scripts/exercises/checkers/monomi_common.py`
(un monomio scritto senza operatori è un unico fattore, `:` e `\cdot` da sinistra a destra, le
parentesi raggruppano), sviluppa con SymPy e confronta con `value` e con il LaTeX della risposta.
Dal testo legge anche l'operazione, il numero di termini di ogni polinomio, le lettere, i
coefficienti e il caso del livello; `params` serve solo al `check()` del generatore.

## Scrittura

- Somma e differenza: `(3x^2 - 5x + 2) + (x^2 + 4x - 7)`, `(A) - (B)`; con le frazioni
  `\left( \right)`.
- Monomio per polinomio: `-3x^2y\,(2x^2 - xy + 4y^2)`, `\frac{2}{3}ab^2\left(\dots\right)`, come negli
  esempi 4 e 5.
- Prodotto di due polinomi: `(2x - 3)(x^2 - 4x + 5)`.
- Divisione: `(12x^4y^2 - 8x^3y^3 + 4x^2y) : (4x^2y)`, il divisore sempre tra parentesi.
- Larghezza: il problema sta in una colonna di 350 px (formula KaTeX in display a 18 px). Il
  generatore stima la larghezza dai caratteri (`estimateWidth`, soglia 270 px per avere margine) e,
  se non ci sta, scrive una somma, una differenza o una divisione su due righe, andando a capo prima
  dell'operatore tra le due parentesi: `\begin{aligned} &(A) \\ &\quad - (B) \end{aligned}`, e allo
  stesso modo `&\quad + (B)` e `&\quad : (M)`. Le parentesi non si spezzano mai. Nei passaggi e nella
  soluzione il problema resta su una riga. Il verificatore accetta solo questa forma a due righe,
  la rimette su una riga e ricalcola da lì.
- Ogni polinomio, nel testo e nella risposta, è ridotto e ordinato: potenze decrescenti della prima
  lettera in ordine alfabetico, a parità di esponente quelle della seconda (`2x^3 - 5x^2y + 8xy^2 - 3y^3`,
  `3x^2y - 2xy^2 + 1`). È l'ordine di tutti gli esempi della lezione. Nelle opzioni della scelta
  multipla vale lo stesso ordine, così l'ordine non tradisce la risposta giusta.

## Rappresentazione

`params.op` è l'operazione (`sum`, `diff`, `monoPoly`, `polyPoly`, `div`); `params.left` e
`params.right` sono i due operandi come liste di monomi `{c: "p/q", e: {x: 2}}` (il monomio del
prodotto sta in `left`, il divisore in `right`); `params.result` è il risultato, `params.case` il
caso.

## Regole comuni

- Lettere `x` oppure `a` con una lettera, `x, y` oppure `a, b` con due.
- Coefficienti del testo fino a 60 in valore assoluto con denominatore fino a 12; coefficienti del
  risultato fino a 100 con denominatore fino a 12; esponenti fino a 8.
- Il risultato ha almeno due termini: una somma che si annulla del tutto o un prodotto con un solo
  termine non sono esercizi di questa lezione.

## Livello 1: somma di due polinomi

Due polinomi in una lettera, coefficienti interi fino a 9, grado 2 o 3, il secondo con 2 o 3 termini;
almeno due coppie di termini simili. Il `+` davanti alla parentesi non cambia niente (esempio 1).

1. `(6x^2 - x - 7) + (2x^2 - 7x)`: `6x^2 + 2x^2 = 8x^2`, `-x - 7x = -8x`, risultato `8x^2 - 8x - 7`.
2. `(5x^2 - 6x - 1) + (-4x^2 - 7x + 3) = x^2 - 13x + 2`.

## Livello 2: differenza di due polinomi

Come il livello 1, ma con il `-` davanti alla seconda parentesi, che cambia il segno a tutti i suoi
termini. Circa 6 su 10 in una lettera, gli altri in due lettere con termini di grado da 1 a 3
(esempio 2). Metà degli esercizi (caso `un termine si annulla`) ha due termini opposti che si
annullano, come `-3xy + 3xy` nell'esempio 2; l'altra metà (`nessun termine si annulla`) no.

1. `(2x^3 - 7x^2 - 8x - 2) - (2x^2 - 6x - 9) = 2x^3 - 9x^2 - 2x + 7`.
2. `(3a^2 + 6a + 2) - (5a^2 - 3a + 9) = -2a^2 + 9a - 7`.

## Livello 3: somma algebrica con coefficienti frazionari

Somma (circa 4 su 10) o differenza (circa 6 su 10) di due polinomi con 2 o 3 termini, in una lettera
(`x^2, x, 1`) o in due lettere di secondo grado (`a^2, ab, b^2`, esempio 3). Denominatori 2, 3, 4, 6,
numeratori fino a 5, qualche intero fino a 4. Almeno due coppie di termini simili e una di esse con
due frazioni di denominatore diverso, che si riducono allo stesso denominatore.

1. `\left(\frac{5}{3}x + \frac{5}{4}\right) - \left(-\frac{1}{6}x^2 + \frac{4}{3}x - \frac{1}{2}\right) = \frac{1}{6}x^2 + \frac{1}{3}x + \frac{7}{4}`.
2. `\left(\frac{4}{3}x^2 - \frac{1}{4}xy - \frac{1}{3}y^2\right) - \left(-\frac{3}{4}x^2 + 3xy - \frac{5}{4}y^2\right) = \frac{25}{12}x^2 - \frac{13}{4}xy + \frac{11}{12}y^2`
   (`\frac{4}{3} + \frac{3}{4} = \frac{16}{12} + \frac{9}{12}`).

## Livello 4: monomio per polinomio

Un monomio con coefficiente diverso da ±1 e almeno una lettera per un polinomio di 2 o 3 termini, in
una o due lettere. Tre casi: `monomio positivo` (circa 35%), `monomio negativo` (circa 35%, esempio 4),
`coefficienti frazionari` (circa 30%, esempio 5). Nel caso frazionario si scelgono prima i prodotti
(interi o frazioni semplici) e poi si dividono per il coefficiente del monomio, così i conti vengono
puliti come nell'esempio 5.

1. `-6a\,(5a^2 - 2a - 9) = -30a^3 + 12a^2 + 54a`.
2. `-\frac{1}{2}a^2\left(-\frac{1}{3}a^2 - 2ab^2\right) = \frac{1}{6}a^4 + a^3b^2`.

## Livello 5: binomio per binomio

Due binomi in una lettera `(ax + b)(cx + d)`, con `a, c` tra 1 e 3 e `b, d` interi non nulli fino a 9.
Esclusi i prodotti notevoli (stesso binomio o somma per differenza, a meno dei segni) e i prodotti in
cui i due termini di primo grado si annullano: il risultato ha sempre tre termini. I passaggi scrivono
ogni prodotto, con i fattori negativi tra parentesi, come nell'esempio 6 e nel riquadro sui segni.
Il caso registra il segno dei termini noti (`due termini noti positivi`, `due termini noti negativi`,
`termini noti discordi`), senza quote fissate.

1. `(x - 8)(x + 5) = x\cdot x + x\cdot 5 + (-8)\cdot x + (-8)\cdot 5 = x^2 - 3x - 40`.
2. `(2a - 1)(2a + 9) = 4a^2 + 16a - 9`.

## Livello 6: polinomio per polinomio

Tre casi, ognuno con una complicazione della lezione:

- `binomio per trinomio` (circa 40%, esempio 7): `(ax + b)(cx^2 + dx + e)`, coefficienti piccoli; a
  volte il trinomio viene prima (esempio 8). Il risultato ha almeno tre termini, così somme e
  differenze di cubi restano fuori.
- `due lettere` (circa 30%, esempio 8): `(px + qy)(rx + sy)` oppure `(px + qy)(rx^2 + sxy + ty^2)`,
  ordinato secondo le potenze decrescenti di `x`.
- `coefficienti frazionari` (circa 30%, esempio 9): due binomi in una lettera con almeno due
  coefficienti frazionari (denominatori 2, 3, 4) e primi coefficienti positivi.

I prodotti notevoli sono esclusi come al livello 5. I passaggi contano i prodotti (`2 \cdot 3 = 6`),
li scrivono tutti, riducono i termini simili (con il denominatore comune se servono le frazioni).

1. `(a - 2)(3a^2 + a + 5) = 3a^3 + a^2 + 5a - 6a^2 - 2a - 10 = 3a^3 - 5a^2 + 3a - 10`.
2. `\left(4x + \frac{3}{2}\right)\left(\frac{5}{2}x + \frac{1}{4}\right) = 10x^2 + \frac{19}{4}x + \frac{3}{8}`.

## Livello 7: polinomio diviso per un monomio

Si sceglie prima il quoziente (2 o 3 termini, esponenti da 0 a 2, coefficienti interi fino a 5) e il
divisore (coefficiente diverso da ±1, almeno una lettera), poi si moltiplica: il polinomio è sempre
divisibile. Circa 7 su 10 in due lettere. Tre casi: `divisore frazionario` (circa 30%, spesso
negativo, esempio 12), `un termine diventa 1` (circa 35%: un termine del polinomio è uguale al
divisore, o al suo opposto, e il quoziente ha il termine noto ±1, esempio 11), `divisore intero`
(circa 35%, a volte negativo). L'ultimo passaggio confronta i gradi: grado del polinomio meno grado
del monomio.

1. `(-4a^2b^2 + 16a^2b + 4ab) : (4ab) = -ab + 4a + 1`.
2. `\left(5a^3b^3 + \frac{20}{3}a^2b^3 + \frac{10}{3}a^2b^2\right) : \left(\frac{5}{3}ab^2\right) = 3a^2b + 4ab + 2a`.

## Esercizi "brutti" da evitare

- `1x`, `-1x`, `x^1`, `x^0`, `+ -`, `- -`, `\frac{-3}{4}`, termini nulli, `1(` davanti a una parentesi;
- polinomi del testo non ridotti o non ordinati;
- risultato con un solo termine o nullo; prodotti notevoli travestiti (`(x - 3)(x + 3)`,
  `(x - y)(-x + y)`); monomio o divisore con coefficiente ±1;
- divisioni in cui un termine non è divisibile (il quoziente non sarebbe un polinomio).

## Variante a scelta multipla

Quattro opzioni distinte come polinomi, ridotte e ordinate, una corretta. Distrattori, dagli errori
dei riquadri della lezione e da quelli già usati per i monomi:

- differenza: segno cambiato solo al primo termine della seconda parentesi (riquadro "Cambiare segno
  solo al primo termine"), l'ultimo termine dimenticato, nessun segno cambiato;
- somma: una coppia di termini simili sommata con il segno sbagliato (`-5x + 4x = -9x`), esponenti
  sommati come nel prodotto (`3x^2 + x^2 = 4x^4`), un termine senza simili dimenticato;
- frazioni: numeratori e denominatori sommati;
- monomio per polinomio: solo il primo termine moltiplicato (riquadro "Moltiplicare solo il primo
  termine"), esponenti moltiplicati, il meno applicato solo al primo prodotto, il termine noto
  moltiplicato solo per il coefficiente, tutti i segni cambiati;
- binomio per binomio: solo il primo e l'ultimo prodotto (riquadro "Moltiplicare solo i primi e gli
  ultimi termini", `x^2 + 10`), segno dell'ultimo prodotto sbagliato (riquadro "Sbagliare il segno di un
  prodotto"), un prodotto in croce dimenticato, prodotti in croce con il segno sbagliato;
- polinomio per polinomio: il prodotto di due termini negativi preso negativo, un prodotto
  dimenticato, un segno sbagliato;
- divisione: il termine uguale al divisore perso (riquadro "Perdere il termine uguale al divisore"),
  il reciproco dimenticato con il divisore frazionario, i segni non cambiati con il divisore negativo,
  solo il primo termine diviso, esponenti sommati.

Se non bastano, un coefficiente del risultato cambiato di ±1, ±2.

## Verifica

- `sample.mts polinomi-operazioni 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Con il seed di
  partenza 7001: PASS.
- `review.mts`: esce con 0, tutto il LaTeX passa da KaTeX.
- Esercizi diversi su 1.000 per livello (seed da 1): 1.000, 1.000, 1.000, 1.000, 861, 991, 997. Il
  livello 5 ha meno ripetizioni possibili (due binomi piccoli in una lettera), ma resta sopra 800.
- Quote dei casi (seed da 1): livello 2 504 / 496; livello 3 598 differenze; livello 4 316
  frazionari, 340 negativi, 344 positivi; livello 6 408 binomio per trinomio, 288 due lettere, 304
  frazionari; livello 7 316 divisore frazionario, 340 un termine diventa 1, 344 divisore intero.
- Errori piantati a mano, tutti bocciati dal verificatore: risposta cambiata (un coefficiente +1),
  risposta giusta ma non ordinata, risposta con due termini simili non ridotti, `choice.correct`
  spostato su un distrattore, due opzioni uguali, un'opzione giusta ma in disordine, un termine della
  divisione non divisibile, un binomio per binomio che è un prodotto notevole, `params.case`
  sbagliato, un passaggio con un conto sbagliato, consegna del livello sbagliata.
- Larghezza misurata con `pwidth.mts` (KaTeX a 18 px, 150 esercizi per livello): nessun problema
  oltre 350 px; massimi 287, 293, 291, 245, 138, 246, 305 px dal livello 1 al 7. Su 1.000 esercizi
  vanno su due righe 97 al livello 1, 485 al 2, 535 al 3, 200 al 7, nessuno negli altri.
- Errori piantati sulle due righe, tutti bocciati: seconda riga persa, terza riga aggiunta,
  operatore cambiato all'inizio della seconda riga.
- Il verificatore ha trovato un errore vero alla prima esecuzione: `collect` di `monomi.ts`, quando
  due termini si annullano, lascia un monomio nullo senza lettere e ci somma poi i termini noti
  (`(3a^2 - a - 3) + (a + 2)` dava `3a^2 + 2 - 3`). Il generatore riduce con una sua funzione; `collect` è stato poi corretto in `monomi.ts`.

## Domande per la revisione

- Manca un livello per l'esempio 13 (quoziente che non è un polinomio): servirebbe una domanda a
  scelta con l'opzione "non è un polinomio". La nota della lezione lo mette nel livello 6; qui i
  livelli sono già sette e l'ho lasciato fuori. Va aggiunto come livello a sé?
- L'ordine con due lettere è lessicografico (potenze decrescenti della prima lettera, a parità quelle
  della seconda). Negli esempi della lezione coincide sempre; va bene come regola generale, o a parità
  di esponente della prima lettera si preferisce il grado complessivo?
- Il prodotto di tre fattori (esempio 10) non c'è: va aggiunto al livello 6, o lo lasciamo alle
  espressioni con i polinomi (lezione 31)?
