# Note: Lo stato liquido e la tensione di vapore

Lezione nuova (6 ottobre 2026), gruppo H del lotto del terzo anno. `check.mts` passa su lezione, formulario e
flashcard, senza avvisi.

## Scelte

- Il filo è uno solo: ogni proprietà del liquido misura quanto sono intense le forze intermolecolari. La tabella
  finale lo riassume.
- Tensione superficiale e capillarità sono già nella lezione 45 per l'acqua, con tre figure. Qui si generalizzano a
  tutti i liquidi in due sezioni brevi, con il link, e con una sola figura nuova (la goccia che bagna e quella che non
  bagna). La figura delle forze sulla molecola in superficie non è ripetuta.
- Evaporazione ed ebollizione come passaggi di stato sono nella 19, che dice già "la temperatura di ebollizione
  dipende dalla pressione", Monte Bianco e pentola a pressione compresi. Qui c'è la spiegazione con le molecole
  (distribuzione delle energie cinetiche) e la tensione di vapore, che nella 19 non c'è.
- Pressioni in mmHg, con $1\,\text{atm} = 760\,\text{mmHg}$, perché la lezione 38 dà la tensione di vapore dell'acqua
  in mmHg ($23{,}8\,\text{mmHg}$ a $25\,^\circ\text{C}$, valore ripreso nella tabella).
- "Tensione di vapore" come nome principale, "pressione di vapore" una volta tra parentesi.
- Simboli: viscosità $\eta$ in $\text{Pa}\cdot\text{s}$, come il README di fisica; tensione superficiale $\gamma$ in
  $\text{N/m}$, definita come energia per unità di superficie.
- La distribuzione delle energie cinetiche è disegnata senza numeri sugli assi e senza il nome di Maxwell e
  Boltzmann.
- L'equilibrio liquido-vapore è chiamato "equilibrio dinamico" e descritto con le due velocità uguali; l'equilibrio
  chimico è del quarto anno e non è linkabile.
- Liquidi usati: acqua, etanolo, acetone, etere dietilico, glicerolo, mercurio. Di acetone ed etere dietilico si dice
  solo che sono polari e non formano legami a idrogeno tra le loro molecole.
- Niente equazione di Clausius-Clapeyron e niente diagramma di stato: mi sono sembrati fuori dal titolo. Il diagramma
  di stato dell'acqua non è in nessuna lezione dell'albero.

## Dubbi per Andrea

- Tensione di vapore in mmHg o in kPa? Ho scelto mmHg per coerenza con la 38 e perché l'ebollizione normale cade a
  $760$, un numero che gli studenti conoscono.
- Il diagramma di stato (punto triplo, punto critico) va in questa lezione, in una sua, o resta fuori dal terzo anno?
- Viscosità e tensione superficiale hanno i valori numerici in tabella. Servono, o al terzo anno si resta al
  confronto qualitativo?
- La definizione di $\gamma$ come energia per unità di superficie: la preferisci alla forza per unità di lunghezza?
- L'esempio 3 conclude "poco più di $120\,^\circ\text{C}$" leggendo la tabella a $1489\,\text{mmHg}$ contro i $1520$
  richiesti: va bene un risultato detto così, o serve un dato della tabella che cada esatto?
- L'umidità relativa non c'è. È un'applicazione naturale della tensione di vapore: la aggiungiamo?

## Da verificare

- Tensione di vapore dell'acqua (mmHg): $4{,}6$ a $0$, $17{,}5$ a $20$, $23{,}8$ a $25$, $55{,}3$ a $40$, $149$ a
  $60$, $355$ a $80$, $526$ a $90$, $760$ a $100$, $1489$ a $120\,^\circ\text{C}$. Sono i valori delle tabelle che
  ricordo; l'equazione di Antoine usata dalla figura interattiva li ridà entro l'1% ($1495$ a $120\,^\circ\text{C}$).
- Tensioni di vapore a $20\,^\circ\text{C}$ di etanolo ($44$), acetone ($185$), etere dietilico ($440$), e $351\,\text{mmHg}$
  per l'etanolo a $60\,^\circ\text{C}$: calcolate con l'equazione di Antoine, con costanti scritte a memoria. Le
  costanti danno $760\,\text{mmHg}$ a $78{,}3$, $56{,}1$ e $34{,}6\,^\circ\text{C}$, che sono le temperature di
  ebollizione note: è l'unico controllo che ho potuto fare.
- Viscosità a $20\,^\circ\text{C}$ ($\text{mPa}\cdot\text{s}$): etere $0{,}23$, acetone $0{,}32$, acqua $1{,}00$,
  etanolo $1{,}20$, mercurio $1{,}55$, glicerolo circa $1400$.
- Tensione superficiale a $20\,^\circ\text{C}$ ($\text{mN/m}$): etere $17$, etanolo $22$, acqua $73$, mercurio $485$.
- Pressione atmosferica a $3000\,\text{m}$: $0{,}692\,\text{atm}$ (atmosfera standard).
- Pentola a pressione a circa $2\,\text{atm}$ (come nella lezione 19).
- "Il mercurio è tredici volte più denso dell'acqua".

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `liquido-viscosita-sfere-cilindri`, `liquido-goccia-bagna-non-bagna`,
`liquido-evaporazione-energie`, `liquido-equilibrio-vapore-recipiente`, `liquido-tensione-vapore-curve`. Le curve
sono fatte di punti calcolati con l'equazione di Antoine.

Una interattiva: `liquido-tensione-vapore-ebollizione` (`LiquidoTensioneVapore.tsx`). Si sceglie il liquido (acqua,
etanolo, acetone, etere dietilico) e si muovono temperatura (da $0$ a $120\,^\circ\text{C}$) e pressione esterna (da
$200$ a $1520\,\text{mmHg}$). A sinistra un recipiente aperto, con il vapore che si infittisce e le bolle che compaiono
quando la tensione di vapore raggiunge la pressione esterna; a destra la curva del liquido, la linea della pressione
esterna e il punto del liquido. Sotto: tensione di vapore, pressione in mmHg e in atm, temperatura di ebollizione a
quella pressione. Niente blocchi `grafico`: la curva con i due cursori è già nella figura interattiva.

## Esercizi

Generatore `chim-stato-liquido` (specifica in `specs/exercises/chim-stato-liquido.md`, controllo in
`scripts/exercises/checkers/chim_stato_liquido.py`, moduli comuni `chim3-h.ts` e `_chim3_h.py`), sei livelli, tutti a scelta multipla: viscosità, tensione superficiale e capillarità; evaporazione e tensione di vapore; il più volatile; leggere la tabella dell'acqua; con le atmosfere; bolle o non bolle.
PASS su 1000 esercizi per livello con i seed 1, 50001 e 777001; errori piantati bocciati 1080 su 1080; `review.mts` e
`width.mts` escono con 0. Non è collegato al sito.

## Esercizio guidato

L'esempio 2 (l'acqua nel rifugio a 3000 metri). Tre fermate: dire la condizione di ebollizione; convertire la
pressione da atm a mmHg; leggere la temperatura sulla tabella.

Prerequisiti proposti: chim-forze-dipolo-london, chim-legame-idrogeno, chim-passaggi-stato, chim-pressione-gas
