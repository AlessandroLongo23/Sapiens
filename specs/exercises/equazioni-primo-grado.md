# Equazioni di primo grado

Generatore: `equazioni-primo-grado` (`src/lib/exercises/v2/generators/equazioni-primo-grado.ts`).
Verifica indipendente: `scripts/exercises/verify.py` (livello 7:
`scripts/exercises/checkers/equazioni_primo_grado_problemi.py`). Lezione collegata: "Equazioni di primo grado
intere".

Lo studente riceve un'equazione intera di primo grado (nessuna incognita al denominatore) e deve
trovare l'insieme delle soluzioni: un numero razionale, l'insieme vuoto (equazione impossibile) o
tutti i numeri reali (equazione indeterminata). La risposta è di tipo `set`; per l'equazione
indeterminata `universal: true`. Ogni esercizio ha anche una variante a scelta multipla.

L'esercizio si costruisce all'indietro: si sceglie la soluzione, poi i coefficienti. I livelli
seguono l'ordine della lezione e ognuno aggiunge una sola difficoltà.

## Rappresentazione

`params.lhs` e `params.rhs` sono liste di termini `{k, a, b, d}`, ognuno dei quali vale
`k·(a·x + b)/d`; `k` diverso da 1 si mostra come fattore davanti a una parentesi, `d` diverso da 1
come frazione. `params.solution` è la soluzione (stringa razionale), oppure `"impossibile"` o
`"indeterminata"`; `params.case` vale `determinata`, `impossibile` o `indeterminata`.

## Regole comuni

- Coefficienti e termini noti interi; nel testo nessun coefficiente oltre 60 in valore assoluto.
- Mai `1x`, `0x`, `+ -`, `- -`, termini nulli, parentesi inutili come `1(…)`.
- Nei livelli da 1 a 5 l'equazione è determinata.
- Il livello 7 ha un'altra rappresentazione e un'altra risposta: vedi la sua sezione.

## Livello 1: un solo termine con l'incognita

`ax + b = c` con `a` intero tra −9 e 9, diverso da 0 e da 1, `b` diverso da 0, soluzione intera tra
−12 e 12. A volte il termine noto sta a sinistra: `b + ax = c`.

Esempio: `3x + 5 = 11`, soluzione 2.

## Livello 2: incognita in entrambi i membri

`ax + b = cx + d` con `a ≠ c`, soluzione intera tra −12 e 12, coefficienti tra −9 e 9.

Esempio: `5x - 3 = 2x + 9`, soluzione 4.

## Livello 3: parentesi

Almeno un termine della forma `k(ax + b)` con `k` intero diverso da 1 (spesso negativo), in uno o
in entrambi i membri; soluzione intera tra −12 e 12.

Esempio: `2(x + 3) = 5x - 9`, soluzione 5.

## Livello 4: soluzione frazionaria

Come i livelli 2 e 3, ma la soluzione è una frazione ridotta `p/q` con `q` tra 2 e 9 e `|p| ≤ 30`.

Esempio: `4x - 1 = x + 6`, soluzione 7/3.

## Livello 5: denominatori numerici

Due o tre termini della forma `(ax + b)/d` con `d` tra 2 e 6, e almeno due denominatori diversi;
si risolve moltiplicando per il MCM. Soluzione razionale, intera o frazionaria.

Esempio: `\frac{x - 1}{3} - \frac{x + 2}{4} = \frac{1}{6}`, soluzione 12.

## Livello 6: impossibili e indeterminate

Equazioni con parentesi in cui i termini con l'incognita si cancellano: circa 4 su 10
impossibili (`0x = n`, `n ≠ 0`), 4 su 10 indeterminate (`0x = 0`), 2 su 10 determinate, perché lo
studente non deve indovinare il caso dalla forma.

Esempi: `2(x + 3) = 2x + 5` impossibile; `3(x - 1) + x = 4x - 3` indeterminata.

## Livello 7: problemi

Un testo di due o tre frasi, da tradurre in un'equazione come nella sezione "Dal testo
all'equazione" della lezione (Esempi 8 e 9): si sceglie l'incognita, si scrive l'equazione, la si
risolve, si controlla la soluzione sul testo e si risponde. L'equazione è della forma `ax + b = c`,
con la `x` in entrambi i membri, o con una parentesi da togliere. La risposta (`answer` di tipo
`number`) è il numero che il testo chiede: intero, positivo, sensato nel contesto e diverso da tutti
i numeri scritti nel testo. `prompt`: "Risolvi il problema con un'equazione."; il testo è nel
`problem` come righe `\text{...}` (con `textBlock`), i passaggi scrivono l'equazione.

Nove storie, ognuna circa 1 su 9 (i nomi sono italiani, presi da due elenchi):

- `consecutivi`: la somma di due o tre numeri naturali consecutivi; si chiede il più piccolo o il
  più grande. Il più piccolo tra 8 e 99 (tra 12 e 99 con due numeri).
- `eta`: oggi un genitore e un figlio o una figlia; tra quanti anni il genitore avrà il doppio, il
  triplo o il quadruplo degli anni del figlio. Differenza di età tra 20 e 45 anni, genitore al
  massimo 65 anni, risposta tra 1 e 12. Equazione `p + x = k(c + x)`.
- `divisione`: figurine, punti di basket o un premio in euro divisi tra due persone (la seconda ha
  `d` più della prima) o tre (la terza ha il doppio della prima); si chiede la parte di una delle
  persone. Nel basket al massimo 35 punti a testa e giocatori dello stesso genere.
- `rettangolo`: orto (m), cornice (cm) o campo da calcetto (m); dato il perimetro, il lato lungo
  supera il corto di `d` oppure ne è il doppio o il triplo; si chiede un lato.
- `biglietti`: gita al museo (interi e ridotti) o spettacolo della scuola (adulti e ragazzi):
  numero totale, due prezzi interi e spesa totale; si chiede quanti di un tipo, almeno 2 per tipo.
  Equazione `p_1 x + p_2(N - x) = T`.
- `monete`: salvadanaio con monete di due valori (1 e 2 euro, 20 e 50 centesimi, 10 e 50
  centesimi, 50 centesimi e 1 euro, 50 centesimi e 2 euro) e il totale; con i centesimi si conta in
  centesimi. Almeno 2 monete per tipo.
- `spesa`: `n` oggetti uguali (magliette, biglietti del cinema, libri, pizze) più un oggetto con un
  prezzo al centesimo (mai intero), totale al centesimo; si chiede il prezzo di un oggetto, in euro
  interi. Come l'Esempio 8 della lezione.
- `risparmi`: due persone con una somma di partenza; la prima aggiunge ogni settimana, la seconda
  aggiunge meno o spende (e non resta mai sotto i 10 euro). Si chiede tra quante settimane avranno
  la stessa somma, oppure quale sarà quella somma.
- `tariffe`: due abbonamenti in palestra (iscrizione e quota al mese) o due noleggi di bici (quota
  fissa e costo all'ora); dopo quanti mesi o ore costano uguale.

`params`: `story`, i dati della storia così come stanno nel testo (importi in centesimi dove
servono), `equation` (l'equazione in LaTeX, la stessa dei passaggi), `x` e `normal` (`{a, b}`, la
forma normale `ax = b`), `mistakes` (i distrattori). Il verificatore
(`scripts/exercises/checkers/equazioni_primo_grado_problemi.py`, chiamato da `check_linear`)
ritrova la risposta cercando il numero che rende vero il testo, senza leggere la risposta né `x`;
controlla che l'equazione, letta dal LaTeX, abbia proprio quella soluzione e sia equivalente alla
forma normale, che il testo riporti i dati dei `params`, i vincoli di plausibilità e la quota di
ogni storia.

Esempi: "Oggi Alice ha 33 anni e suo figlio Paolo ne ha 5. Tra quanti anni Alice avrà il triplo
degli anni di Paolo?" `33 + x = 3(5 + x)`, risposta 9. "Per la gita al museo una classe compra 25
biglietti, alcuni interi da 7 euro e gli altri ridotti da 4 euro, e spende in tutto 109 euro.
Quanti biglietti ridotti ha comprato?" `7x + 4(25 - x) = 109`, `x = 3`, risposta 22.

Distrattori, dagli errori veri: la risposta a un'altra domanda dello stesso problema (l'altro
numero consecutivo, l'altro tipo di biglietto, l'età del figlio invece degli anni che passano, la
somma raggiunta invece delle settimane); un dato usato due volte o dimenticato (il genitore che
non invecchia, il perimetro preso come somma di due soli lati, `2x` contato una volta, `p_1 x +
p_2 x = T`); l'operazione sbagliata (il trasporto senza cambio di segno, la divisione per `p_1`
invece che per `p_1 - p_2`, il prodotto `ax` dato come risposta senza dividere). Poi ±1, ±2, mai 0.

## Variante a scelta multipla

Quattro opzioni distinte, una corretta. Distrattori, in ordine di preferenza: la soluzione con il
segno cambiato; il trasporto senza cambio di segno; la divisione al contrario (`a/b` invece di
`b/a`); il segno sbagliato davanti alla parentesi; il termine noto non moltiplicato per il MCM;
"nessuna soluzione" e "ogni numero reale" scambiati. Se non bastano, si spostano di ±1, ±2.
