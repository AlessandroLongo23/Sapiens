# Polinomi e grado di un polinomio

Generatore: `polinomi` (`src/lib/exercises/v2/generators/polinomi.ts`).
Verifica indipendente: `scripts/exercises/checkers/polinomi.py`. Lezione collegata:
`docs/lezioni/riscritte/28-polinomi.md` (nota: `docs/lezioni/note/28-polinomi.md`).

Il generatore copre quello che la lezione tratta: riduzione a forma normale, grado complessivo e
rispetto a una lettera, polinomi ordinati, completi e omogenei, valore numerico (anche con la
scrittura $P(a)$). Niente operazioni tra polinomi, che hanno il loro generatore
(`polinomi-operazioni`): qui si sommano solo i termini simili dentro un polinomio.

Si costruisce all'indietro: prima la forma normale (o le proprietà, o il valore), poi il testo,
spezzando i coefficienti in due addendi e aggiungendo gruppi di termini che hanno somma zero.

## Tipi di risposta

- Livelli 1-3: `expression` con `form: "expanded"`, il polinomio in forma normale ordinato secondo
  le potenze decrescenti della prima lettera (a parità, della seconda), come i risultati della
  lezione.
- Livelli 4, 5 e 7: `number` (un grado, un valore numerico razionale esatto).
- Livello 6: `choice` con quattro descrizioni fisse.

Ogni esercizio ha la variante a scelta multipla con quattro opzioni distinte (`choice`).

## Rappresentazione

`params.vars` sono le lettere dell'esercizio in ordine alfabetico; `params.pieces` i termini scritti
nell'ordine del testo, ognuno `{m: {c, e}}` o, al livello 3, `{m, f: [f1, f2]}` quando il termine è
scritto come prodotto `f1 \cdot f2`. Poi, per livello: `reduced` (1-3), `ask` e `degree` (4-5),
`prop`, `first`, `complete` (6), `subs`, `pnot`, `value` (7). `case` è il caso.

## Regole comuni

- Lettere da una sola famiglia, `a, b, c` oppure `x, y, z`; nei livelli in una lettera anche `y`
  o `b` da sole.
- Niente `1x`, `x^1`, `x^0`, `+ -`, `- -`, termini con coefficiente 0 nel testo.
- Esponenti fino a 7; testo del problema al massimo 170 caratteri (il più lungo di
  `monomi-espressioni` ne ha circa 160).
- Larghezza sul telefono: il problema deve stare in circa 350 px (KaTeX in display a 18 px). Il
  generatore stima la larghezza contando i caratteri visibili (una lettera o una cifra vale 1, un
  esponente 0,7, un `+` o `-` con gli spazi 2,2, una frazione la larghezza del numeratore o del
  denominatore) e oltre 30 unità scrive il problema su due righe con `\begin{aligned}`. Ai livelli
  1-5 va a capo prima di un `+` o di un `-` tra due termini scritti, nel punto che rende le due
  righe più pari, e la seconda riga comincia con `&\quad`; al livello 7 va a capo prima di
  "per x = ..." o di $P(a)$. Quelli che stanno in una riga restano su una riga. Il controllo in
  Python rimette insieme le righe e ricalcola tutto sul testo ricostruito.
- Mai il polinomio nullo come risultato.

## Livello 1: forma normale in una lettera

Esempio 1 della lezione. Da 5 a 7 termini scritti in una lettera, coefficienti interi da −9 a 9,
grado 2 o 3; almeno due gruppi di termini simili e almeno due termini simili non vicini nel testo.
Nessun gruppo si annulla.

1. `-6y - y^2 + 5 + 4 + 3y^2 + 2y` → `(-1 + 3)y^2 + (-6 + 2)y + (5 + 4) = 2y^2 - 4y + 9`.
2. `6x^2 - 9x + 3 + 6 + x` → `6x^2 - 8x + 9`.

## Livello 2: due lettere, con termini che si annullano

Esempio 3 della lezione. Nuova difficoltà: due lettere e un gruppo di termini simili con somma 0
che sparisce: una coppia di opposti (circa 3 su 4) o tre termini a somma zero. Coefficienti interi.

1. `-2xy^3 - 4x^2y - 9y^3 + 2xy^3 + 2y^3` → `-4x^2y - 7y^3`.
2. `-6ab^2 - 12b + 10 - 5a^2b - 6a^2b + 6ab^2` → `-11a^2b - 12b + 10`.

## Livello 3: frazioni e un monomio da ridurre

Esempio 2 della lezione. Nuova difficoltà: almeno un coefficiente frazionario (denominatori 2, 3,
4, 6) e un termine scritto come prodotto di due monomi che hanno una lettera in comune
(`-3a \cdot ab`), da ridurre prima; il suo risultato è simile a un altro termine. Da 4 a 6 termini
scritti, coefficienti del risultato con denominatore fino a 12.

1. `\frac{5}{4}xy^2 - 5xy - 3y \cdot xy + 7xy` → `-3y \cdot xy = -3xy^2`, poi
   `-\frac{7}{4}xy^2 + 2xy`.
2. `-4y^2 \cdot y - \frac{7}{2}x^3y + 4x^3y + \frac{3}{2}y^3 + 5xy^3` →
   `\frac{1}{2}x^3y + 5xy^3 - \frac{5}{2}y^3`.

## Livello 4: grado di un polinomio

Esempi 4 e 5 della lezione. Polinomio già in forma normale, da 3 a 4 termini, due lettere (tre
circa 1 volta su 5), non ordinato, a volte con un termine noto e coefficienti frazionari. Metà degli
esercizi chiede il grado complessivo (il primo termine scritto non è quello di grado massimo),
metà il grado rispetto a una lettera (il termine di grado massimo non è quello con la lettera
all'esponente più alto: "i tre gradi si cercano ognuno per conto suo"). Il verificatore accetta per
ciascun caso dal 38% al 62%.

1. `-7x^5y + 5 - 9x^3 - \frac{5}{4}xy^2`, rispetto a `y`: esponenti 1, 0, 0, 2 → 2.
2. `5 - \frac{5}{2}x^2y^2 + 3xy^4 + 7x^4y^2`, complessivo: gradi 0, 4, 5, 6 → 6.

## Livello 5: grado di un polinomio da ridurre

Riquadro "Il grado non è la somma dei gradi" ($x^3 + 2x - x^3$ ha grado 1). Nuova difficoltà: il
polinomio non è ridotto e i termini di grado più alto (o con l'esponente più alto della lettera
chiesta) sono una coppia di opposti che si annulla. Una lettera (circa 4 su 10, sempre grado
complessivo) o due; complessivo circa 7 su 10 (verificatore: dal 58% all'82%).

1. `9x^5 - 3y^2 - 9x^5 - 6y^3 - 6x^2y + 3x^2y` → `-3x^2y - 6y^3 - 3y^2`, grado 3 (non 5).
2. `-4x^2y^2 + 8x^2y^3 - 7xy + 3x^2y^2 - 8x^2y^3 - 2x`, rispetto a `y` → 2 (non 3).

## Livello 6: ordinato, completo, omogeneo

Sezioni "Polinomi ordinati", "Polinomi completi", "Polinomi omogenei". Metà degli esercizi:

- una lettera, grado 3 o 4, "È ordinato secondo le potenze decrescenti di x? È completo rispetto
  a x?". Quando non è completo manca una potenza intermedia o (metà delle volte) il termine noto,
  come nel riquadro "Anche il termine noto conta". Quando non è ordinato, non è ordinato neanche
  per potenze crescenti, così la risposta non dipende dal verso;
- due lettere, scritto per potenze decrescenti della prima, "È omogeneo? È completo rispetto a x?".

Le quattro opzioni sono le quattro combinazioni ("ordinato e completo", "ordinato ma non completo",
"completo ma non ordinato", "né ordinato né completo", e le stesse con "omogeneo"), ognuna in circa
un ottavo degli esercizi (verificatore: dall'8% al 17% per ognuna delle otto).

1. `-7a^4 + 5a^2 - 6 - a^3 + 6a`: esponenti 4, 2, 0, 3, 1 → completo ma non ordinato.
2. `-2x^4 + 6xy^3 - 2y^4`: gradi 4, 4, 4; esponenti di `x` 4, 1, 0 (mancano $x^3$ e $x^2$) →
   omogeneo ma non completo.

## Livello 7: valore numerico

Esempi 7, 8 e 9 della lezione. Tre casi in parti uguali (verificatore: dal 25% al 42% ciascuno):

- una lettera, un intero negativo da −4 a −1, con una potenza pari (dove le parentesi contano);
- una lettera, una frazione tra ±1/2, ±1/3, ±2/3, ±3/2;
- due lettere (tre termini, uno è il termine noto), una negativa e l'altra intera o ±1/2.

Nei due casi in una lettera, metà delle volte il polinomio è scritto $P(x) = \dots$ e si chiede
$P(a)$. Il valore ha denominatore fino a 12 e numeratore fino a 200 in valore assoluto.

1. `3a^2 - 2a^2b - 6` per `a = -2, b = 2` → `3(-2)^2 - 2(-2)^2 \cdot 2 - 6 = 12 - 16 - 6 = -10`.
2. `P(x) = -3x^2 + 3x + 6`, `P\left(\frac{2}{3}\right)` → `-\frac{4}{3} + 2 + 6 = \frac{20}{3}`.

## Esercizi "brutti" da evitare

- termini simili già vicini (la riduzione è fatta a metà nel testo);
- un gruppo che si annulla al livello 1, dove la difficoltà non è ancora introdotta;
- al livello 4 il primo termine di grado massimo (si leggerebbe il grado senza cercarlo);
- al livello 5 una coppia che si annulla ma non cambia il grado;
- al livello 6 un polinomio ordinato per potenze crescenti presentato come "non ordinato";
- al livello 7 valori con denominatori grandi, o un intero negativo senza potenze pari.

## Distrattori della scelta multipla

- Livelli 1-3, in quest'ordine: il segno che non viaggia con il termine (un termine negativo di un
  gruppo preso positivo; al livello 2 per primo il gruppo che si annulla, così $4xy - 4xy$ diventa
  $8xy$); il prodotto del livello 3 ridotto senza sommare gli esponenti ($-3a \cdot ab = -3ab$);
  frazioni sommate numeratore con numeratore e denominatore con denominatore; gli esponenti sommati
  mentre si sommano termini simili ($3x^2 - x^2 = 2x^4$), solo se il termine ottenuto non è simile
  a un altro; un termine dimenticato. Se non bastano, un coefficiente del risultato ±1, ±2.
- Livelli 4-5: il grado prima di ridurre (livello 5, sempre presente); la somma dei gradi dei
  termini; l'esponente più alto di una lettera; il grado del primo termine; il numero di termini;
  per il grado rispetto a una lettera, il grado complessivo, l'esponente della lettera nel termine
  di grado massimo, la somma degli esponenti della lettera, il grado rispetto all'altra lettera.
- Livello 6: le altre tre combinazioni.
- Livello 7: la potenza calcolata senza parentesi ($-3^2 = -9$ al posto di $(-3)^2 = 9$,
  $\frac{1}{2}^2$ letto come $\frac{1}{2}$; sempre presente quando dà un numero diverso); le due
  lettere scambiate; il valore assoluto al posto del numero negativo; il termine noto dimenticato.
  Se non bastano, il valore ±1 (o ± un'unità del denominatore).

## Verifica

Il controllo in Python rilegge il testo LaTeX con il parser di `monomi_common.py`, lo spezza nei
termini scritti e ricalcola tutto da lì: la forma normale con SymPy, l'ordine per potenze
decrescenti della risposta e di ogni opzione, il grado (anche con `Poly`), le proprietà del
livello 6 dall'ordine dei termini nel testo, il valore del livello 7 sostituendo i numeri letti
dal testo. Controlla anche i passaggi che sono uguaglianze pure e le quote dei casi.

- `sample.mts polinomi 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000.
- `sample.mts polinomi 1000 all 7001 | verify.py`: PASS, 7.000 esercizi su 7.000.
- `review.mts polinomi`: esce con 0, tutto il LaTeX passa da KaTeX.
- Larghezza misurata con KaTeX a 18 px su 150 esercizi per livello (26 settembre 2026, dopo la
  divisione in righe): nessun problema oltre i 350 px; massimo per livello 313, 325, 324, 299, 310,
  241 e 323 px. Prima erano oltre i 350 px 33 esercizi su 150 al livello 2 (massimo 448 px), 17 al
  livello 3, 5 al livello 5 e 1 al livello 7. Su 1.000 esercizi per livello (seed da 1) sono su due
  righe 491 al livello 2, 228 al livello 3, 36 al livello 5 e 210 al livello 7: la stima tiene un
  margine di circa 25 px, quindi divide anche problemi che starebbero appena in una riga.
- `npx tsc --noEmit -p .`: nessun errore in `polinomi.ts`.

Esercizi diversi (consegna più testo) su 1.000 per livello:

| Livello | Seed da 1 | Seed da 7001 |
|---|---|---|
| 1 | 1.000 | 1.000 |
| 2 | 1.000 | 1.000 |
| 3 | 1.000 | 1.000 |
| 4 | 1.000 | 1.000 |
| 5 | 1.000 | 1.000 |
| 6 | 999 | 1.000 |
| 7 | 999 | 1.000 |

Errori piantati a mano in campioni veri, tutti bocciati dal controllo: risposta cambiata (valore
del polinomio, grado +1, valore numerico uguale a un distrattore); risposta non ordinata per
potenze decrescenti; risposta con termini simili non ridotti (`+ 3 - 3`); opzione giusta che punta
a un'altra opzione (livelli 2 e 6); due opzioni uguali; etichetta di un'opzione del livello 6
cambiata; LaTeX di un'opzione diverso dal suo valore; vincoli violati (testo già in forma normale
al livello 1, prodotto del livello 3 scritto già ridotto, livello 5 senza la coppia che si
annulla); consegna sconosciuta; `- -` nel testo; un passaggio con il risultato sbagliato;
un problema su due righe con la seconda riga persa (livelli 2, 3, 5 e 7) o senza `\quad` all'inizio.

Un difetto trovato durante la verifica: sommando i simili con una lista, un gruppo che si annulla
diventava il monomio nullo, che in `monomi.ts` perde le lettere, e un termine noto scritto dopo si
sommava a lui invece che all'altro termine noto (39 esercizi su 1.000 al livello 2). Il generatore
ora somma per parte letterale. `collect()` di `monomi.ts` ha lo stesso comportamento: da
controllare in chi lo usa con gruppi che si annullano.

## Domande per la revisione

- Al livello 6 le quattro opzioni sono sempre nello stesso ordine (ordinato e completo, ordinato
  ma non completo, completo ma non ordinato, né l'uno né l'altro). La risposta giusta è distribuita
  in parti uguali, ma va bene così o si preferisce mescolarle?
- Al livello 6 un polinomio ordinato per potenze crescenti non esce mai, perché la consegna chiede
  "decrescenti" e uno studente potrebbe dire, con ragione, che è ordinato. Serve una domanda
  apposta sul verso dell'ordinamento?
- Il riconoscimento di che cosa non è un polinomio ($\frac{2}{x} + 1$, $x^{-1} + 3$) e il nome
  (binomio, trinomio, quadrinomio) non hanno un livello: la nota della lezione proponeva un primo
  livello su termini e termine noto. Va aggiunto come livello a scelta multipla?
- Al livello 7 il termine noto dimenticato e il valore assoluto al posto del numero negativo sono
  errori plausibili ma non nominati dalla lezione: tenerli come distrattori?
