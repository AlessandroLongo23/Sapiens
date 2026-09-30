# Note: Il volume molare

Lezione nuova (biennio di chimica, secondo anno, gruppo 27, 30 settembre 2026). Conti rifatti in Python con la tavola
della lezione 01: esempio 1, $5{,}60/22{,}4 = 0{,}250$, $0{,}250 \cdot 16{,}05 = 4{,}0125$; esempio 2,
$88{,}0/44{,}01 = 1{,}99955$, $\cdot 22{,}4 = 44{,}79$; esempio 3, $1/22{,}4 = 0{,}044643$, $\cdot 6{,}02 \cdot 10^{23} =
2{,}6875 \cdot 10^{22}$ (con $6{,}022$ si ha $2{,}6884 \cdot 10^{22}$, stesso arrotondamento); tabella delle densità
$2{,}02/22{,}4 = 0{,}09018$, $16{,}05/22{,}4 = 0{,}7165$, $28{,}02/22{,}4 = 1{,}2509$, $32{,}00/22{,}4 = 1{,}4286$,
$44{,}01/22{,}4 = 1{,}9647$, $70{,}90/22{,}4 = 3{,}1652$; aria $28{,}96/22{,}4 = 1{,}293$; esempio 5,
$1{,}25 \cdot 22{,}4 = 28{,}0$, $28{,}0/14{,}03 = 1{,}9957$; avviso, $22{,}4/44{,}01 = 0{,}509$; volumi molari delle
altre condizioni con $R = 8{,}314$: $22{,}41$ ($0\,^\circ\text{C}$, $1\,\text{atm}$), $22{,}71$ ($0\,^\circ\text{C}$,
$1\,\text{bar}$), $24{,}47$ ($25\,^\circ\text{C}$, $1\,\text{atm}$). `check.mts` passa.

## Struttura

Il principio di Avogadro letto al contrario (link alla lezione 34 del gruppo 26) e il perché con il modello cinetico
(link alla lezione 29); definizione di volume molare e condizioni normali, la figura dei tre recipienti; solo per i gas
(una mole d'acqua liquida è $18\,\text{mL}$); le altre condizioni di riferimento in un riquadro; $n = V/V_m$ con la
mappa delle conversioni e gli esempi 1-3, due avvisi; la densità di un gas con la tabella di sei gas, l'aria, gli
esempi 4 e 5 (il secondo lega la lezione 35) e l'avviso sulla formula rovesciata.

## Scelte

- Numero di Avogadro $6{,}02 \cdot 10^{23}$, come dice il README di chimica per il biennio. La lezione 01 usa
  $6{,}022 \cdot 10^{23}$: nell'esempio 3 i due valori danno lo stesso risultato a tre cifre, ma la differenza tra le
  due lezioni vicine va decisa (vedi domande).
- Il valore $22{,}4\,\text{L/mol}$ è quello del README ($0\,^\circ\text{C}$, $1\,\text{atm}$). Le condizioni standard
  IUPAC ($0\,^\circ\text{C}$ e $1\,\text{bar}$ dal 1982; IUPAC Gold Book, voce "standard conditions for gases", da
  verificare la data esatta) e i $24{,}5\,\text{L/mol}$ a $25\,^\circ\text{C}$ sono in un riquadro.
- Densità dell'aria $1{,}29\,\text{g/L}$ in condizioni normali: dalla massa molare media dell'aria secca,
  $28{,}96\,\text{g/mol}$ (valore di letteratura, da verificare la fonte), non dalla tavola della lezione 01, che non ha
  l'argon.
- Nessuna figura interattiva: la lezione è fatta di conversioni, e le due figure statiche bastano.

## Figure

TikZ `volume-molare-tre-gas` (tre recipienti uguali con idrogeno, ossigeno e anidride carbonica, stesse molecole,
masse diverse) e `volume-molare-mappa-conversioni` (massa, moli, volume, particelle con le operazioni sulle frecce).
Guardate in chiaro e in scuro.

## Esercizi

Generatore `chim-volume-molare`, cinque livelli (specifica in `specs/exercises/chim-volume-molare.md`), senza scene.

## Domande per Andrea

- Condizioni normali a $0\,^\circ\text{C}$ e $1\,\text{atm}$ con $22{,}4\,\text{L/mol}$, oppure le condizioni standard
  a $25\,^\circ\text{C}$ con $24{,}5\,\text{L/mol}$ come alcuni libri? (È la stessa domanda del README di chimica.)
- Numero di Avogadro: $6{,}02 \cdot 10^{23}$ (README del biennio) o $6{,}022 \cdot 10^{23}$ (lezione 01, già
  pubblicata)? Oggi le due lezioni vicine usano valori diversi.
- La mappa delle conversioni (massa, moli, volume, particelle) è utile così, o i libri la disegnano in un altro modo
  (per esempio a triangolo)?
- Serve dire che il volume molare vale solo per i gas che si comportano da gas ideali, o si rimanda alla lezione 37?
