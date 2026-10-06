# Note: Il legame metallico

Lezione nuova (6 ottobre 2026), gruppo F del terzo anno: capitolo "I legami chimici", quinta lezione su sei. Non
pubblicata. `check.mts` passa senza avvisi su lezione, formulario e flashcard.

## Struttura e confini

Perché né il legame ionico né quello covalente spiegano un metallo; il modello del mare di elettroni e la definizione
di legame metallico; la forza del legame (elettroni messi in comune e dimensioni del catione) con i punti di fusione;
le quattro proprietà spiegate dal modello (conduzione elettrica, conduzione del calore, lucentezza, malleabilità e
duttilità); le leghe di sostituzione e interstiziali; una tabella di confronto tra i tre legami.

- Con la 61 (metalli, non metalli e semimetalli, gruppo D): lì le proprietà dei metalli sono elencate e messe nella
  tavola; qui sono spiegate dal modello. La lezione non ripete le famiglie.
- Con la 65: la fragilità dei cristalli ionici è nella 65; qui c'è il confronto, nella seconda figura interattiva.
- Con la 75 (solidi, gruppo H): reticoli compatti e cella elementare non compaiono. La tabella finale rimanda alla 75.
- Le leghe stanno qui per il brief. Sono presentate come soluzioni solide, con il link alla lezione sui miscugli.

## Scelte

- Il modello è presentato come modello, con il suo limite in un riquadro: funziona per i gruppi principali, non
  prevede i punti di fusione dei metalli di transizione. La teoria delle bande è nominata in una riga sola.
- "Elettroni messi in comune" è l'espressione usata sempre per gli elettroni di valenza ceduti al mare.
- "Nel solido ogni atomo di sodio ha otto atomi vicini": il sodio è cubico a corpo centrato. Il tipo di reticolo non
  è nominato.
- La resistenza che cresce con la temperatura è spiegata con le vibrazioni dei cationi, come fa il modello classico.
- La lucentezza: "assorbono luce di quasi tutti i colori e la riemettono subito". È la spiegazione dei libri di
  scuola. Oro e rame sono dati come eccezione senza il perché.
- Carati: definiti come parti in massa su 24.
- Nella tabella "Tre legami a confronto" la riga sul legame covalente dice "dipende dalla sostanza" per il
  comportamento sotto un colpo e "no (con poche eccezioni)" per la conduzione: la grafite è nella 75.

## Dati

- Punti di fusione da `elementi.json` (in kelvin, convertiti e arrotondati all'unità): Li 181, Na 98, K 63, Mg 650,
  Al 660, Ca 842, Fe 1538, Cu 1085, Hg −39, W 3422.
- Energie di ionizzazione di sodio e cloro da `elementi.json`.
- Massa atomica dell'alluminio dalla tavola della lezione 01 (26,98).

## Da verificare

- La paternità del modello (Paul Drude, 1900, poi Lorentz) non è scritta nella lezione, per non mettere una data a
  memoria. Se Andrea la vuole, va controllata.
- "L'argento e il rame conducono meglio la corrente e il calore": corretto, a memoria.
- Acciaio: carbonio "di solito meno del 2% in massa" (il limite convenzionale tra acciaio e ghisa è circa 2,1%).
- Composizione dell'acciaio inossidabile (cromo e nichel) e usi delle leghe nella tabella: a memoria.
- "L'oro e il rame assorbono una parte della luce blu".

## Figure

TikZ, guardate in chiaro e in scuro:

- `metallico-mare-elettroni-sodio`: reticolo di cationi con gli elettroni sparsi, uno per catione.
- `metallico-strati-scorrono`: il metallo prima e dopo lo scorrimento di due strati.
- `metallico-leghe-sostituzione-interstiziale`: i due tipi di lega.

Interattive:

- `metallico-mare-elettroni-pila` (`MetallicoMareElettroni.tsx`): cationi che vibrano ed elettroni che si muovono a
  caso; si collega una pila con il polo positivo a destra o a sinistra e si alza la temperatura. Un contatore dice
  quanti elettroni attraversano la linea al centro, nei due versi e al netto.
- `metallico-colpo-martello-ionico` (`MetallicoColpoMartello.tsx`): un metallo e un cristallo ionico affiancati; un
  cursore, o il bottone "Colpisci", fa scorrere i due strati superiori di una posizione. Il metallo si deforma, il
  cristallo ionico si stacca con le frecce di repulsione.

Nessun blocco `grafico`.

La prima figura è una simulazione con numeri scelti per la resa visiva (velocità, vibrazione, calo dello spostamento
con la temperatura): mostra il verso degli effetti, non valori misurati. Gli elettroni che escono da un lato
rientrano dall'altro, come in un circuito chiuso.

## Esercizi

Generatore `chim-legame-metallico`, sei livelli (specifica in `specs/exercises/chim-legame-metallico.md`): il modello;
elettroni messi in comune da un atomo (numero intero, proposto a risposta aperta); elettroni del mare in una massa;
quale metallo fonde più in alto e perché; le proprietà; le leghe e i carati. Controllo indipendente
`scripts/exercises/checkers/chim_legame_metallico.py`: PASS su 1000 esercizi per livello con i seed 1, 50001 e 777001.
Non collegato al sito.

## Esercizio guidato

L'esempio 1 (gli elettroni del mare in una lamina di alluminio). Si fermerebbe in tre punti: dopo la quantità di
sostanza; dopo il numero di atomi; prima di moltiplicare per gli elettroni messi in comune da ogni atomo.

## Dubbi per Andrea

- La lezione dice che la carica del catione e le sue dimensioni decidono la forza del legame, e usa i punti di
  fusione come prova. Magnesio (650 °C) e alluminio (660 °C) sono quasi uguali pur con due e tre elettroni: lo
  lasciamo come dato della tabella o lo commentiamo?
- La teoria delle bande va almeno nominata, come ora, o tolta del tutto?
- Le leghe stanno bene qui o le vuoi nella 75 (i solidi) o nella 61 (i metalli)?
- I carati come esempio numerico: va bene, o preferisci un conto con la percentuale in massa di un ottone?
- Va detto chi ha proposto il modello?

Prerequisiti proposti: chim-metalli-non-metalli, proprieta-periodiche, legame-ionico, chim-simboli-lewis
