# Note: Il legame a idrogeno

Lezione nuova (6 ottobre 2026), gruppo H del lotto del terzo anno. `check.mts` passa su lezione, formulario e
flashcard, senza avvisi.

## Scelte

- Le lezioni 44 e 45 hanno già il legame a idrogeno per l'acqua (definizione, cinque molecole, il grafico dei gruppi
  14 e 16, il ghiaccio, le proprietà). Qui non si rispiega: si parte da etanolo ed etere dimetilico, che hanno la
  stessa formula e cento gradi di differenza, e si dà la regola generale con le due condizioni.
- Parole "donatore" e "accettore": servono per dire in una riga perché l'etere dimetilico non forma legami a idrogeno
  con se stesso ma li forma con l'acqua. Sono usate anche negli esercizi.
- Il perché dei tre elementi è detto con tre argomenti: elettronegatività, l'idrogeno che ha un solo elettrone, la
  dimensione dell'atomo (il cloro, più elettronegativo dell'azoto ma più grande). È la spiegazione dei libri di
  scuola; il confine tra "legame a idrogeno" e "dipolo-dipolo forte" è una convenzione, e la lezione dice "regola
  pratica".
- Tra le molecole che accettano senza donare ho messo l'etere dimetilico e l'acetone, non il fluorometano: il fluoro
  legato al carbonio secondo la regola dei libri accetterebbe, ma in realtà è un accettore pessimo, e la frase sarebbe
  stata vera solo in parte.
- Il grafico delle temperature di ebollizione ha tutti e quattro i gruppi (la 44 ne ha due), con la tabella dei
  valori sotto.
- "Perché l'acqua bolle più in alto di HF": conto di idrogeni e coppie solitarie (due e due nell'acqua, uno e tre in
  HF, tre e una in $\mathrm{NH_3}$), con "in media due legami" per HF e ammoniaca.
- Il ghiaccio ha un disegno nuovo, un anello di sei molecole, e un paragrafo solo: il resto è nella 45, con il link.
- Molecole biologiche: DNA (due e tre legami tra le basi), proteine (elica e foglietto, l'albume che cuoce),
  cellulosa. Niente link, perché le lezioni del quinto anno sono vuote; nessuna formula delle basi.
- Dati: elettronegatività da `elementi.json`; temperature di ebollizione dei gruppi 14 e 16 uguali a quelle della
  lezione 44.

## Dubbi per Andrea

- "Donatore" e "accettore" del legame a idrogeno vanno bene al terzo anno, o è meglio dire tutto con "l'idrogeno
  legato a F, O, N" e "la coppia solitaria"?
- Solo F, O, N, come regola senza eccezioni: confermi? Alcuni libri aggiungono il cloro tra parentesi.
- L'energia: "da 10 a 40 kJ/mol", e "circa 20 kJ/mol" per l'acqua, coerente con il "venti volte più piccola" della
  lezione 44. Che intervallo dà il libro che seguiamo?
- "Ogni molecola di HF e di ammoniaca forma in media due legami a idrogeno": è la spiegazione più comune del perché
  l'acqua bolle più in alto. Ti convince o è meglio fermarsi a "l'acqua ne forma di più"?
- Le proteine e la cellulosa sono nominate in tre frasi. Troppo, per una lezione che viene prima della chimica
  organica, o giusto come aggancio alla biologia?
- La frase sull'albume ("il calore rompe i legami a idrogeno e le proteine perdono la forma") semplifica: nella
  denaturazione si rompono anche altre interazioni deboli.

## Da verificare

- Temperature di ebollizione (°C), a memoria: $\mathrm{NH_3}$ $-33$, $\mathrm{PH_3}$ $-88$, $\mathrm{AsH_3}$ $-62$,
  $\mathrm{SbH_3}$ $-17$; HF $20$, HCl $-85$, HBr $-67$, HI $-35$; etanolo $78$, etere dimetilico $-25$, propano
  $-42$, acetone $56$, iodio $184$.
- Energia del legame covalente O-H, $463\,\text{kJ/mol}$.
- Densità del ghiaccio $0{,}917\,\text{g/mL}$ (come nella 45).
- "L'acetone si mescola con l'acqua in ogni proporzione".

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `legame-idrogeno-donatore-accettore`, `legame-idrogeno-etanolo-etere`,
`legame-idrogeno-ebollizione-quattro-gruppi`, `legame-idrogeno-ghiaccio-anello`, `legame-idrogeno-dna-coppie-basi`.
Etanolo ed etere sono scritti in TikZ come formule condensate ($\mathrm{CH_3{-}CH_2{-}O{-}H}$), non con RDKit, per
poter tratteggiare il legame a idrogeno tra due molecole.

Una interattiva: `legame-idrogeno-chi-con-chi` (`LegameIdrogenoCoppie.tsx`). Si scelgono due molecole tra acqua,
ammoniaca, HF, metanolo, etere dimetilico, metano e solfuro di idrogeno: quella di sinistra deve donare l'idrogeno,
quella di destra accettarlo. Se le due condizioni sono soddisfatte le molecole si girano e compare il legame
tratteggiato; altrimenti la figura dice quale condizione manca, e se nel verso opposto funzionerebbe. Un bottone
scambia le due molecole. Le molecole sono disegni piani, con angoli solo indicativi. Niente blocchi `grafico`.

## Esercizi

Generatore `chim-legame-idrogeno` (specifica in `specs/exercises/chim-legame-idrogeno.md`, controllo in
`scripts/exercises/checkers/chim_legame_idrogeno.py`, moduli comuni `chim3-h.ts` e `_chim3_h.py`), cinque livelli: quale sostanza forma legami a idrogeno; idrogeni che contano e coppie solitarie (anche aperta); tra due molecole diverse; chi bolle più in alto e perché; i legami a idrogeno nel DNA (anche aperta).
PASS su 1000 esercizi per livello con i seed 1, 50001 e 777001; errori piantati bocciati 1020 su 1020; `review.mts` e
`width.mts` escono con 0. Non è collegato al sito.

## Esercizio guidato

L'esempio 2 (propano, etere dimetilico, etanolo). Tre fermate: contare gli elettroni delle tre molecole; dire per
ciascuna quali forze ci sono; mettere in ordine le temperature di ebollizione.

Prerequisiti proposti: chim-forze-dipolo-london, chim-acqua-molecola, chim-affinita-elettronegativita, chim-simboli-lewis
