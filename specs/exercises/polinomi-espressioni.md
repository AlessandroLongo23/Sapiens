# Espressioni con polinomi

Generatore: `polinomi-espressioni` (`src/lib/exercises/v2/generators/polinomi-espressioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/polinomi_espressioni.py`. Lezione collegata:
`docs/lezioni/riscritte/31-polinomi-espressioni.md` (livelli proposti nella sua nota,
`docs/lezioni/note/31-polinomi-espressioni.md`).

Lo studente riduce un'espressione con polinomi a un solo polinomio, sviluppato e ordinato secondo
le potenze decrescenti della prima lettera in ordine alfabetico (poi della seconda), come nella
lezione: `-9x^2 + y^2`, `2x^2y - \frac{7}{2}x^2 + 3xy - 2x`, `-4xy + 7x - 6y + 4`. Consegna:
"Semplifica l'espressione e ordina il risultato." Risposta `expression` con `form: "expanded"`;
variante a scelta multipla con quattro opzioni, sempre presente.

## Lettura del testo

Il verificatore legge il LaTeX con il parser di `monomi_common.py`, scritto dalle convenzioni del
libro e non dal generatore: un monomio o un numero scritto davanti a una parentesi la moltiplica
(`3x(x - 2)`, `2(x - 1)^2`), il prodotto per giustapposizione viene prima di `\cdot` e `:`, che
vanno da sinistra a destra, e l'esponente si applica alla parentesi che lo precede. Il risultato è
sviluppato con SymPy e confrontato con la risposta. La struttura del livello (quali prodotti
notevoli ci sono e in che forma) si rilegge dal testo: termini di primo livello, fattori di ogni
termine, termini scritti dentro ogni parentesi, nell'ordine in cui sono scritti.

## Scrittura

- Il segno di un termine sta fuori: `- 2(x - 1)^2`, `- (x + 2)(x - 2)`; il numero o il monomio
  davanti a una parentesi è sempre positivo.
- Parentesi con `\left( \right)` quando contengono frazioni; tonde, quadre e graffe con
  `\left \right` al livello 7.
- Il divisore sta tra parentesi: `: (2xy)`. Il monomio finale del livello 7 sta tra parentesi se è
  negativo o frazionario (`\cdot \left(-\frac{1}{2}x\right)`), senza se è un intero positivo
  (`\cdot 2a`).
- Nei passaggi i prodotti notevoli si sviluppano in una riga; ai livelli 3 e 4 il quadrato del
  binomio mostra anche `(2x^2)^2 - 2 \cdot 2x^2 \cdot y + y^2`, perché lì sta l'errore del riquadro
  "Il quadrato di un monomio dentro il binomio". L'ultimo passaggio toglie le parentesi e somma i
  termini simili, come negli esempi svolti. Al livello 7 i passaggi vanno dalla parentesi più
  interna: prima la quadra, poi la graffa, poi il prodotto per il monomio.

## Rappresentazione

`params.tree` è l'albero dell'espressione: `br` (parentesi con i termini nell'ordine scritto),
`pow` (potenza di una parentesi), `prod` (monomio davanti e fattori), `div` (parentesi divisa per un
monomio), `m` (monomio), `sum` (termini con il flag `neg`), `grp` (parentesi con dentro
un'espressione), `dot` (graffa per un monomio). Al livello 6 il nodo del prodotto da riconoscere
porta `trap` con il caso e i termini `a` e `b` della somma per differenza. `params.result` è il
risultato, `params.case` il caso.

## Regole comuni

- Nel testo numeri interi fino a 12 (fino a 36 nel dividendo della divisione del livello 7),
  frazioni con denominatore fino a 4.
- Una parentesi con coefficienti interi non ha fattori numerici comuni: `(2x + 6)` e `(3y - 3)` non
  compaiono (il dividendo della divisione per un monomio è l'eccezione, per costruzione).
- Risultato con almeno due termini, coefficienti con numeratore fino a 60 e denominatore fino
  a 36; ogni risultato intermedio con numeratori fino a 100.
- Lunghezza per il telefono. La larghezza di una formula si conta in caratteri visibili: non
  contano spazi, `\left` e `\right`; una frazione conta come la sua riga più lunga; `\cdot` e ogni
  parentesi contano uno. Limiti dell'espressione intera per livello: 32, 40, 44, 36, 36, 32, 56.
  Risposta fino a 22 (26 al livello 7), ogni opzione della scelta multipla fino a 30.

## Righe per il telefono

Sul sito il problema è una formula KaTeX a 18 px in una colonna di circa 350 px. La larghezza si
stima senza misurarla: caratteri visibili più 0,6 per ogni frazione (un carattere vale circa 12 px).
Un problema che supera 26 si scrive su più righe:
`\begin{aligned}&\text{riga 1}\\&\quad \text{riga 2}\end{aligned}`, al massimo tre righe. Si va a
capo prima di un `+` o di un `-` tra due termini, riempiendo ogni riga finché sta in 26 (24 dalla
seconda riga, per il `\quad`); una coppia `\left( \right)` non si spezza mai. Al livello 7 si va a
capo anche dentro la quadra e la graffa, che su più righe si scrivono senza `\left \right`
(`\{`, `[`). Un problema che sta in 26 resta su una riga.

Misura con KaTeX a 18 px su 150 esercizi per livello (`pwidth.mts`, 26 settembre 2026): nessun
problema oltre i 350 px; massimi 282, 316, 310, 312, 316, 306, 314 px. Su 1.000 esercizi (seed 7001)
vanno su più righe 0, 441, 674, 421, 116, 0 e 1.000 problemi per livello.

Le opzioni della scelta multipla stanno in un pulsante di circa 252 px a 16 px (un'unità della
stima vale circa 10,5 px). Un'opzione che supera 20 va su due o tre righe,
`\begin{gathered}\text{riga 1} \\ \text{riga 2}\end{gathered}`, a capo prima di un `+` o di un `-`
tra due termini, ogni riga entro 20; le opzioni corte restano su una riga. Il limite di 30 per
l'opzione intera resta, e un distrattore che andrebbe su più di due righe viene scartato. Su 4.000
opzioni per livello (seed 7001) vanno su due righe 0, 0, 245, 0, 26, 3 e 2.391. Misura a 16 px su
600 opzioni per livello (`owidth.mts`): nessuna oltre 252 px; massimi 134, 155, 222, 149, 228, 240,
228 px.

Il verificatore ricompone le righe in un'espressione sola e la legge come le altre; controlla che
ogni riga dopo la prima cominci con `+` o `-`, che nessuna riga separi `\left` da `\right`, che ogni
riga stia nel limite e che il problema vada a capo solo se su una riga non ci sta.

## Livello 1: prodotti e somma, senza prodotti notevoli

Un monomio (o un numero) per un binomio e un prodotto di due binomi che non è un prodotto notevole,
in una lettera, coefficienti interi; circa un esercizio su tre ha anche un monomio da sommare
(caso `due prodotti e un monomio`). Il secondo termine ha un meno davanti circa 7 volte su 10.
Come l'esempio 1 della lezione.

1. `y(y + 4) - (y + 3)(y + 2)`: `y^2 + 4y - (y^2 + 5y + 6) = -y - 6`.
2. `5x(x - 5) - (x + 6)(x + 5) - 3x^2 = x^2 - 36x - 30`.

## Livello 2: prodotti notevoli con un meno o un numero davanti

Quadrati di binomi e somme per differenza nella forma del formulario (il termine comune per primo
e positivo, il binomio del quadrato ordinato), due o tre termini, almeno un meno davanti a un
prodotto notevole. Circa metà delle volte un numero davanti a un prodotto notevole (caso
`numero davanti`). Come l'esempio 2 della lezione.

1. `(x + 1)^2 - (3x - 4)(3x + 4) - 2(x + 4)^2 = -10x^2 - 14x - 15`.
2. `(3y - 4)(3y + 4) + (y + 2)(y - 2) - (y + 2)^2 = 9y^2 - 4y - 24`.

## Livello 3: due lettere o monomi di grado più alto

Il quadrato di un binomio con monomi come `2x^2`, `3y`, `y^2`, poi la somma per differenza degli
stessi termini e un monomio per un binomio (uno dei due può mancare). Circa 3 su 4 con due lettere,
gli altri in una lettera con `x^2` o `x^3` nel binomio (caso `grado più alto`). Come l'esempio 3.

1. `(x^2 + y^2)^2 - (x^2 + y^2)(x^2 - y^2) + 2x^2y(x + 2y) = 2x^3y + 6x^2y^2 + 2y^4`.
2. `(a^3 - 3a)^2 + 4a^2(2a - 1) - (a^3 + 3a)(a^3 - 3a) = -6a^4 + 8a^3 + 14a^2`.

## Livello 4: coefficienti frazionari

Un quadrato e una somma per differenza con almeno una frazione ciascuno (denominatori 2, 3, 4),
spesso un terzo termine: un monomio frazionario o una frazione per un binomio. Una lettera. Come
l'esempio 4.

1. `\left(\frac{1}{2}y + \frac{3}{2}\right)^2 - \left(y - \frac{3}{2}\right)\left(y + \frac{3}{2}\right) + \frac{3}{2}y = -\frac{3}{4}y^2 + 3y + \frac{9}{2}`.
2. `\left(\frac{3}{4}y - 1\right)\left(\frac{3}{4}y + 1\right) - \left(\frac{3}{2}y + \frac{3}{2}\right)^2 - \frac{3}{4}(y + 6) = -\frac{27}{16}y^2 - \frac{21}{4}y - \frac{31}{4}`.

## Livello 5: cubo di un binomio e potenza dentro un prodotto

Un cubo di binomio (`(x \pm p)^3` con p fino a 3, oppure `(2x \pm 1)^3`) e un monomio o un numero
per il quadrato di un binomio, `x(x - 3)^2`, `2(x + 1)^2`; spesso un terzo termine, una somma per
differenza con un numero davanti o un monomio. Casi `monomio davanti alla potenza` (circa 2 su 3) e
`numero davanti alla potenza`. Come l'esempio 5.

1. `(y + 2)^3 - 2(y - 3)^2 + 3(y + 3)(y - 3) = y^3 + 7y^2 + 24y - 37`.
2. `(x - 1)^3 - x(x + 4)^2 = -11x^2 - 13x - 1`.

## Livello 6: prodotti notevoli da riconoscere

Un solo prodotto notevole scritto in un modo diverso dal formulario, circa un quinto per caso, e
spesso (7 volte su 10) un secondo termine semplice: un quadrato ordinato, un monomio per un binomio
o un monomio. I cinque casi sono le sezioni della lezione:

- `somma per differenza in disordine`: `(3x + y)(y - 3x)`, `(-x - y)(x - y)`;
- `quadrato con i segni negativi`: `(-x - 3)^2`, `(3 - x)^2`, `(-x + 3)^2`;
- `fattori opposti`: `(2x - 1)(1 - 2x)`;
- `tre fattori`: `(x - 2)(x + 3)(x + 2)`, `(x - 1)(x + 1)(x^2 + 1)` in ordini diversi;
- `binomio al posto di un termine`: `(x + y - 3)(x + y + 3)`, `(x + y - 1)(x - y + 1)`.

1. `(-a + 2b)(a + 2b) - (a + b)^2`: il termine con lo stesso segno è `2b`, quindi
   `4b^2 - a^2 - (a^2 + 2ab + b^2) = -2a^2 - 2ab + 3b^2`.
2. `(x + y + 5)(x - y - 5) - 2x(y + 2)`: `x^2 - (y + 5)^2 - 2xy - 4x = x^2 - 2xy - 4x - y^2 - 10y - 25`.

## Livello 7: tonde, quadre e graffe

La struttura dell'esempio 7:
`\left\{(T)^2 - \left[(x \pm y)^2 \pm (P) : (m)\right]\right\} \cdot (M)`, con `T` un trinomio
(una lettera, l'altra, un numero, almeno un segno meno), `P` un binomio divisibile per il monomio
`m`, `M` un monomio con coefficiente tra ±1/2, ±1, ±2, ±3. Varianti: la quadra prima del quadrato
del trinomio, la divisione prima del quadrato nella quadra, il più al posto del meno.

1. `\left\{\left[(a + b)^2 - (-2a^2 + 4ab) : (2a)\right] - (a + b - 3)^2\right\} \cdot 2a = 14a^2 + 8ab - 18a`.
2. `\left\{\left[(x + 2y)^2 - (3xy + 9y^2) : (3y)\right] - (x - y + 1)^2\right\} \cdot 2x = 12x^2y - 6x^2 + 6xy^2 - 2xy - 2x`.

## Esercizi "brutti" da evitare

- un prodotto notevole al livello 1, o scritto fuori dalla forma del formulario al livello 2;
- una parentesi con un fattore numerico comune, come `(2x + 6)`;
- un risultato con un solo termine, o con coefficienti oltre i limiti delle regole comuni;
- testo, risposta od opzioni più larghi dei limiti per il telefono;
- `1x`, `x^1`, `+ -`, termini nulli, frazioni con il segno dentro.

## Variante a scelta multipla

Quattro polinomi distinti e ordinati, uno corretto. I distrattori si ottengono rifacendo il calcolo
con un errore dei riquadri della lezione, scelti per livello:

- meno davanti a un prodotto che cambia solo il primo termine, `-(x^2 - 4) = -x^2 - 4` (tutti i
  livelli);
- prodotto notevole che non c'è, `(x + 2)(x - 3) = x^2 - 6` (livelli 1 e 6);
- numero o monomio portato dentro prima della potenza, `2(x + 3)^2 = (2x + 6)^2` e
  `x(x - 3)^2 = (x^2 - 3x)^2` (livelli 2 e 5);
- coefficiente del monomio non elevato, `(2x^2)^2 = 2x^4` (livelli 2, 3, 4);
- quadrato del binomio senza doppio prodotto, o cubo come `a^3 + b^3` (livelli 2-7);
- doppio prodotto senza il fattore 2 (livelli 2-5);
- somma per differenza con `a` e `b` scambiati, fattori opposti o quadrato di segni negativi con il
  segno sbagliato (livello 6);
- divisione del solo primo termine, `(6x^2y - 4xy^2) : (2xy) = 3x - 4xy^2`, e doppi prodotti del
  trinomio tutti positivi (livello 7).

Poi il risultato con i segni cambiati e, se non bastano, un termine con il segno cambiato, il
termine noto spostato di 1 o un coefficiente spostato di 1. Un'opzione più larga di 30 caratteri
viene scartata.

## Verifica (26 settembre 2026)

- `sample.mts polinomi-espressioni 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000.
- Stesso comando con seed di partenza 7001: PASS, 7.000 su 7.000. Quote dei casi dentro gli
  intervalli di `CASE_RANGES` (livello 6: da 162 a 224 esercizi per caso su 1.000).
- Esercizi diversi su 1.000 per livello (seed 7001): 1.000, 988, 960, 997, 958, 934, 1.000.
- Rifatta dopo le righe per il telefono e per i pulsanti delle risposte, con gli stessi esiti. `review.mts` esce con 0; `npx tsc --noEmit -p .` senza errori nei tre file.
- Errori piantati a mano, tutti bocciati: risposta cambiata (livelli 1-7), `correct` che punta a
  un'altra opzione, due opzioni uguali, risposta non ordinata (termini spostati), testo cambiato con
  la risposta vecchia, risposta tra parentesi (non sviluppata), passaggio con un membro sbagliato,
  testo allungato oltre il limite del telefono, caso del livello 6 sbagliato, binomio con un fattore
  comune (`(2y + 8)`), quadrato scritto in disordine al livello 2 (`(-2 + x)^2`), somma per
  differenza al livello 1. Per le righe: una riga persa (livelli 2, 3, 7), una coppia
  `\left( \right)` spezzata tra due righe, un a capo in un problema che sta su una riga, un
  problema largo rimesso su una riga, un'opzione con una riga persa (livelli 3 e 7), un'opzione
  corta spezzata su due righe.

## Domande per la revisione

- Il risultato ordinato per potenze decrescenti della prima lettera dà scritture come
  `-2a^2 - 2ab + 3b^2` e `x^2 - 2xy - 4x - y^2 - 10y - 25`: va bene come forma unica della
  risposta, o una risposta aperta futura deve accettare anche l'ordine per grado complessivo?
- Al livello 6 il secondo termine, quando c'è, è semplice di proposito, così la difficoltà resta il
  riconoscimento. Gli esercizi con il solo prodotto da riconoscere (`(-a - 1)^2`, 3 su 10) sono
  troppo brevi per un livello 6?
- Al livello 7 il risultato arriva a cinque termini (limite di larghezza 26): è accettabile, o
  meglio imporre al massimo quattro termini come nell'esempio 7 della lezione?
