# Monomi

Generatore: `monomi` (`src/lib/exercises/v2/generators/monomi.ts`). Verifica indipendente:
`scripts/exercises/checkers/monomi.py`. Lezione collegata: `docs/lezioni/riscritte/27-monomi.md`
(con la nota `docs/lezioni/note/27-monomi.md`, che propone i sei livelli).

Il generatore copre solo quello che tratta la lezione 27: coefficiente e parte letterale,
riconoscere un monomio, forma normale, valore numerico. Il grado ha il suo generatore
(`monomi-grado`), e così le operazioni tra monomi (`monomi-operazioni`).

Tipi di risposta: `number` per il coefficiente e il valore numerico (razionale esatto `"p/q"`),
`expression` per la parte letterale e la forma normale (un monomio), `choice` per "è un monomio?".
Ogni esercizio ha la variante a scelta multipla con quattro opzioni distinte. Gli aiuti comuni
(monomi in forma normale, LaTeX, `buildChoice`) sono in `src/lib/exercises/v2/monomi.ts`; il
verificatore legge il testo LaTeX con il parser di `checkers/monomi_common.py` e ricalcola tutto
con SymPy.

## Regole comuni

- Lettere da una sola famiglia, `a, b, c` oppure `x, y, z`, in ordine alfabetico nei monomi in forma
  normale (nel testo dei livelli 1, 5, 6 e in tutte le risposte e opzioni).
- Mai `1x`, `x^1`, `x^0`, `+ -`, `- -`, segno dentro la frazione, frazioni non ridotte.
- `params.case` dice il caso; il verificatore lo ricalcola dal testo e controlla le quote.

## Livello 1: coefficiente e parte letterale

Monomio in forma normale con 1-3 lettere ed esponenti da 1 a 5. La consegna chiede il coefficiente
oppure la parte letterale (esempio 1 della lezione). Casi: parte letterale (35%), coefficiente intero
(20%), coefficiente 1 o -1 sottinteso (20%, riquadro "La lettera senza numero davanti"),
coefficiente frazionario (25%). Metà dei coefficienti frazionari è scritta con le lettere al
numeratore, come `-\frac{3x^2y}{5}`: il coefficiente è `-\frac{3}{5}` (paragrafo dopo l'esempio 1).

1. `-x^4y^3`, coefficiente: davanti alle lettere non c'è un numero, `-x^4y^3 = -1 \cdot x^4y^3`,
   coefficiente `-1`.
2. `-\frac{3}{2}x^4y^3z`, parte letterale: `x^4y^3z`.

Distrattori del coefficiente: `0` per il coefficiente sottinteso, il valore senza segno, l'opposto,
il reciproco, il denominatore o il numeratore letti come coefficiente (scrittura a frazione),
l'esponente più alto. Della parte letterale: il monomio intero, la parte letterale con il segno
meno, le lettere senza esponenti, la sola prima lettera.

## Livello 2: monomio o no

Nuova difficoltà: il riconoscimento (sezione "Espressioni che non sono monomi" ed esempio 5). Si
mostra un'espressione e quattro verdetti; la risposta è `choice`, con i verdetti in ordine fisso.

| verdetto | testo dell'opzione |
|---|---|
| `monomio` | È un monomio |
| `somma` | No: una somma di termini non simili |
| `denominatore` | No: una lettera al denominatore |
| `esponente` | No: un esponente non naturale |
| `numero` | No: un numero al denominatore (sempre falso) |
| `ordine` | No: le lettere non sono in ordine (sempre falso) |

Casi: monomio (40%), diviso tra frazione con un numero al denominatore (`-\frac{x^2}{5}`), prodotto
non ridotto (`4 \cdot a \cdot b \cdot a`) e costante (`\frac{2}{3}`, `-7`); somma di due termini con
parti letterali diverse (15%, `x^2 - y`); lettera al denominatore (15%, `\frac{3}{x}`,
`\frac{2a^2}{b}`); esponente negativo (15%, `3a^2b^{-1}`); esponente frazionario o letterale (15%,
`x^{\frac{1}{2}}y`, `5 \cdot 2^x`).

Sul telefono un pulsante di risposta è largo 252 px: i verdetti "No: …" vanno su due righe,
`\begin{gathered}\text{No: una somma}\\ \text{di termini non simili}\end{gathered}`, tutti nella
stessa forma; "È un monomio" resta su una riga. Il verificatore ricompone le righe e confronta la
frase intera con la tabella.

Ogni espressione non monomio ha un solo difetto. "È un monomio" è sempre tra le opzioni.
"Numero al denominatore" compare solo quando al denominatore c'è davvero un numero (il riquadro "Il
numero al denominatore non esclude il monomio"). Con un esponente negativo non si mostra "lettera
al denominatore", perché `b^{-1} = \frac{1}{b}` renderebbe giuste due risposte: la risposta è
"esponente non naturale" e la quarta opzione è "le lettere non sono in ordine", che compare anche
con i prodotti non ridotti (la lezione dice che l'ordine alfabetico è un'abitudine, non una regola).

1. `-\frac{x^2}{5}`: è un monomio, `-\frac{1}{5}x^2`. Opzioni: monomio, somma, lettera al
   denominatore, numero al denominatore.
2. `7x^2z^{-3}`: non è un monomio, `z^{-3} = \frac{1}{z^3}`; esponente non naturale.

## Livello 3: forma normale, coefficienti interi

Nuova difficoltà: ridurre un prodotto (esempio 2). Da 2 a 4 fattori scritti come nella lezione,
`3x \cdot y \cdot (-x)`: il primo con il segno davanti, gli altri negativi tra parentesi. Almeno una
lettera in due fattori, almeno un segno meno, coefficienti interi, nessuna potenza di numero.
Risultato con coefficiente al massimo 60 in valore assoluto ed esponenti al massimo 9. Casi per il
segno del risultato (negativo circa 6 su 10).

1. `-3c^3 \cdot (-c^2) \cdot 4c`: coefficiente `-3 \cdot (-1) \cdot 4 = 12`, lettere
   `c^{3+2+1} = c^6`, risultato `12c^6`.
2. `2y \cdot (-y^2) = -2y^3`.

Distrattori (riquadro "Gli esponenti dei numeri e quelli delle lettere"): segno sbagliato, lettera
ripetuta letta una volta sola (`6x` per `3x \cdot 2x`), coefficienti sommati (`5x^2`), esponenti
moltiplicati; poi coefficiente ±1 o un esponente +1.

## Livello 4: forma normale con frazioni e potenze

Nuova difficoltà: il coefficiente con le frazioni (esempio 3) o con una potenza di un numero
(esempio 4). Casi: frazioni (circa 4 su 10), almeno due coefficienti frazionari che si semplificano
in croce, risultato con numeratore al massimo 12 e denominatore al massimo 9; potenza di un numero
(circa 6 su 10), `2^3`, `(-2)^3`, `(-3)^2`, `\left(-\frac{1}{2}\right)^2` come coefficiente del
primo fattore, risultato con numeratore al massimo 30.

1. `-\frac{6}{7}x^2y^2 \cdot \left(-\frac{1}{4}yz\right) \cdot 6xz^3 = \frac{9}{7}x^3y^3z^4`.
2. `2^2ab \cdot (-a^2b^3) \cdot \frac{5}{3}ab = -\frac{20}{3}a^4b^5`.

Distrattori: segno sbagliato, lettera ripetuta letta una volta, l'esponente del numero sommato a
quelli delle lettere (errore del riquadro), `2^3` calcolato come `2 \cdot 3`, il reciproco del
coefficiente.

## Livello 5: valore numerico con gli interi

Nuova difficoltà: sostituire (esempi 6, 7, 8). Monomio in forma normale di grado al massimo 5,
coefficiente intero da -5 a 5 (circa 2 su 10 uguale a 1 o -1, così compare `-x^2` dell'esempio 8).
Valori interi da -4 a 5, mai 1. Casi: valori positivi (circa 25%), almeno un valore negativo (circa
60%), una lettera che vale 0 (circa 13%, esempio 10: il valore è 0 senza conti). Valore al massimo
300 in valore assoluto.

Il testo è `-2a^3b^2 \quad \text{per } a = -1,\; b = 3`; i passaggi sostituiscono con le parentesi,
come la lezione: `-2 \cdot (-1)^3 \cdot (3)^2 = -2 \cdot (-1) \cdot 9 = 18`.

1. `-2ab^2c` per `a = -1`, `b = -3`, `c = 2`: `36`.
2. `4b^3` per `b = -3`: `-108`.

Distrattori: il negativo sostituito senza parentesi (`-3^2 = -9`, riquadro "Sostituire un numero
negativo senza parentesi"), il segno meno del coefficiente portato dentro la potenza (`-x^2` letto
`(-x)^2`, esempio 8), l'opposto, la potenza calcolata come prodotto (`3^2 = 6`), il coefficiente
dimenticato. Con una lettera che vale 0: il valore calcolato ignorando quella lettera, il
coefficiente, `1`.

## Livello 6: valore numerico con le frazioni

Nuova difficoltà: basi frazionarie (esempio 9). Monomio di grado al massimo 4 con 1 o 2 lettere;
almeno un valore frazionario (denominatore 2, 3 o 4) e almeno uno negativo, nessuno zero. Si sceglie
prima il risultato (intero da -12 a 12 in circa 6 casi su 10, altrimenti una frazione con
denominatore al massimo 4) e poi il coefficiente, che deve avere numeratore e denominatore al
massimo 9.

1. `-\frac{4}{3}c^2` per `c = -\frac{1}{2}`: `-\frac{4}{3} \cdot \frac{1}{4} = -\frac{1}{3}`.
2. `\frac{8}{3}bc^2` per `b = -\frac{3}{2}`, `c = \frac{1}{2}`: `-1`.

Distrattori: quelli del livello 5 e la potenza del solo numeratore (`\left(\frac{2}{3}\right)^2`
letto `\frac{4}{3}`).

## Esercizi "brutti" da evitare

- coefficiente 1 scritto, esponente 1 o 0 scritto, frazioni non ridotte;
- al livello 2, espressioni con due difetti o somme che si riducono a un monomio (`3x + 2x`, che la
  lezione rimanda alle operazioni);
- al livello 2, due verdetti entrambi veri (esponente negativo con "lettera al denominatore");
- ai livelli 3 e 4, prodotti senza lettere ripetute (sarebbero già quasi in forma normale);
- al livello 4, frazioni che non si semplificano;
- al livello 5, la lettera che vale 1 (il fattore sparisce e l'esercizio si svuota).

## Verifica (26 settembre 2026)

- `sample.mts monomi 1000 all 1 | verify.py`: PASS, 6.000 su 6.000, quote dei casi nei limiti.
- Stessa cosa con seed di partenza 7001: PASS.
- `review.mts monomi`: esce con 0, tutto il LaTeX passa da KaTeX.
- `npx tsc --noEmit -p .`: nessun errore in `generators/monomi.ts`.

Esercizi diversi su 1.000 per livello (coppia consegna e testo), seed 1 e seed 7001:

| livello | seed 1 | seed 7001 |
|---|---|---|
| 1 | 946 | 943 |
| 2 | 912 | 927 |
| 3 | 993 | 998 |
| 4 | 1.000 | 1.000 |
| 5 | 974 | 960 |
| 6 | 972 | 971 |

Errori piantati a mano, tutti bocciati dal verificatore: coefficiente col segno cambiato; opzione
giusta spostata; parte letterale con il coefficiente nel LaTeX; caso sbagliato in `params` (livelli
1 e 5); esponente negativo con l'opzione ambigua "lettera al denominatore"; verdetto sbagliato;
somma di termini simili al livello 2; testo di un verdetto cambiato; segno perso nella risposta;
lettere fuori ordine nella risposta (`-2y^3x^6`); livello 3 senza segni meno (con risposta
coerente); due opzioni uguali; passaggio con membri diversi; valore numerico col segno cambiato;
valore di una lettera cambiato nel testo; livello 6 con valori tutti interi; campione senza scelta
multipla; al livello 2, un verdetto su due righe con una riga persa e uno con la seconda riga
cambiata.

Larghezze misurate a 16 px (script `owidth.mts` e `pwidth.mts`, 26 settembre 2026): nessuna opzione
oltre i 252 px (massimi per livello 81, 159, 81, 87, 40, 35 px) e nessun testo oltre i 350 px
(massimi 92, 138, 244, 276, 328, 256 px).

## Domande per la revisione

- Livello 2: con un esponente negativo la risposta giusta è "esponente non naturale" e l'opzione
  "lettera al denominatore" non compare, perché l'esempio 5 spiega `3a^2b^{-1}` proprio con la `b`
  al denominatore. Va bene così, o è meglio togliere l'esponente negativo dal livello?
- Livello 2: i verdetti sempre falsi "numero al denominatore" e "le lettere non sono in ordine"
  vengono dai riquadri della lezione: vanno bene come distrattori?
- Livelli 3 e 4 si sovrappongono in parte al livello "Prodotto" di `monomi-operazioni`; qui i
  fattori sono scritti come un solo monomio non ridotto (`3x \cdot y \cdot (-x)`), là come monomi tra
  parentesi. Tenere tutti e due?
