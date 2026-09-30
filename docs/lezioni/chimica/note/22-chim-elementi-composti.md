# Note: Elementi, composti e simboli chimici

Lezione nuova (biennio di chimica, gruppo 24, 30 settembre 2026). Conti rifatti in Python: percentuali dell'acqua con la
tavola della lezione 01, $2{,}02/18{,}02 = 11{,}2\%$ di idrogeno e $88{,}8\%$ di ossigeno. `check.mts` passa.

## Struttura

Apertura storica (i quattro elementi, l'acqua scomposta e ricomposta); elemento e composto (anche "sostanza semplice" e
"sostanza composta", i nomi del DM 211/2010) con lo schema ad albero della materia; la decomposizione con il calore
(ossido di mercurio di Priestley, calcare), la corrente (elettrolisi dell'acqua, esempio 1 con la figura) e la luce;
la definizione di Lavoisier in un riquadro; le proprietà nuove del composto, la composizione fissa (rimando a Proust) e
la tabella miscuglio-composto; l'esempio 2 che classifica; i simboli di Berzelius con la tabella di 22 elementi e il
nome latino dove il simbolo non somiglia all'italiano; l'avviso su $\mathrm{Co}$ e $\mathrm{CO}$; le formule solo per
contare gli elementi, con il rimando alla lezione 28.

## Fonti e dati da verificare

- 118 elementi, gli ultimi quattro nomi approvati dalla IUPAC nel novembre 2016; "poco più di novanta" in natura (le fonti
  dicono 92 o 94 secondo come si contano le tracce di nettunio e plutonio): da verificare quale numero preferisce Andrea.
- Berzelius e i simboli: 1813 (articolo negli Annals of Philosophy, 1813-1814), da verificare.
- Lavoisier, Traité élémentaire de chimie, 1789: 33 sostanze semplici, con luce, calorico, calce e magnesia; Priestley
  e l'ossido di mercurio, 1774. Da verificare sul testo.
- Nell'elettrolisi il solfato di sodio come elettrolita: è la scelta più comune a scuola, da verificare.

## Figure

Due TikZ guardate in chiaro e in scuro: `elementi-composti-classificazione` (albero materia, miscugli, sostanze pure,
elementi, composti, con le frecce "metodi fisici" e "trasformazioni chimiche") ed `elementi-elettrolisi-acqua` (due
provette capovolte, idrogeno doppio dell'ossigeno, pila con i poli). Nessuna molecola, nessuna interattiva.

## Esercizi

Generatore `chim-elementi-composti`, quattro livelli (specifica in `specs/exercises/chim-elementi-composti.md`).

## Domande per Andrea

- Nel primo anno si dice "elemento" e "composto", o "sostanza semplice" e "sostanza composta" come il DM? La lezione dà
  tutti e due i nomi e poi usa i primi.
- Va distinto già qui l'elemento dalla sostanza elementare (ossigeno e ozono, grafite e diamante), o si lascia al terzo
  anno?
- La tabella dei simboli ha gli elementi giusti per il primo anno? Mancano stagno, nichel, bromo, argon.
- Negli esercizi del livello 4 le formule compaiono prima della lezione sulla formula chimica: si chiede solo di contare
  gli elementi dalle maiuscole. Va bene, o anche questo si sposta alla lezione 28?
