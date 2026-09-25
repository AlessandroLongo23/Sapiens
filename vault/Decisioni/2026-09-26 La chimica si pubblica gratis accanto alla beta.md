---
stato: decisa
aggiornato: 2026-09-26
tag: [decisione, contenuti, chimica]
---
# La chimica si pubblica gratis accanto alla beta

## Decisione
Le lezioni di chimica entrano nel catalogo del sito, visibili e indicizzate, con formulari ed esercizi, come contenuto gratuito. Il prodotto a pagamento della beta resta di sola matematica, come in [[2026-09-23 Beta a pagamento a gennaio 2027 con la sola matematica]], che questa decisione precisa senza sostituirla.

## Perché
Alessandro, il 26 settembre 2026, dopo la prova di [[2026-09-25 Chimica con RDKit]], ha chiesto di generare lezioni per il catalogo vero. Claude ha fatto notare il contrasto con la beta di sola matematica e che sul sito non c'è uno stato di bozza: una lezione scritta nel database è subito pubblica. Alessandro ha scelto di pubblicare, sulla proposta di Claude di trattarla come contenuto gratuito utile anche per la [[SEO]]. Alternativa scartata: preparare lezioni e albero nei file e scrivere nel database più avanti.

## Conseguenze
- Prima si rifà l'albero di chimica delle superiori, come per la matematica: programma e albero con gli anni in `docs/lezioni/chimica/programma.md` e `docs/lezioni/chimica/albero.md`, applicati al database con uno script. Poi si mettono le lezioni. Alessandro ha scelto questa strada invece di usare i nodi di oggi, che sono pochi, larghi e con un doppione.
- Le figure sono di RDKit, compilate in SVG e caricate nel bucket `figure` come i TikZ.
- Gli esercizi di chimica sono pregenerati in Python con le molecole disegnate come risposte; la pagina degli esercizi va estesa per mostrare immagini nella domanda, nelle risposte e nella soluzione. Alessandro ha scelto di farlo subito, non in un secondo passo.
- La lezione sulla geometria delle molecole (VSEPR) ha bisogno di un visualizzatore 3D sul sito.
- La rilettura di Andrea vale anche per la chimica (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]); le note di revisione di ogni lezione sono in `docs/lezioni/chimica/note/`.
- Fatto lo stesso giorno: albero applicato (29 capitoli, 157 lezioni), sei lezioni pubblicate con figure ed esercizi; vedi [[2026-09-26 Chimica nel catalogo]]. Manca il deploy del codice.
- Da fare: aggiornare [[Lezioni]] e `Home.md`, che al momento della decisione erano in modifica in un'altra sessione.

## Collegamenti
- [[2026-09-23 Beta a pagamento a gennaio 2027 con la sola matematica]]
- [[2026-09-23 La v1.0 è lo STEM del liceo scientifico]]
- [[2026-09-25 Chimica con RDKit]]
- [[Programma ministeriale]], [[Pipeline lezioni]], [[Pipeline esercizi]]
