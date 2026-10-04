---
stato: decisa
aggiornato: 2026-10-04
tag: [decisione, informatica, lezioni, strumenti]
---
# L'editor di codice ha i progetti a più file, accanto allo snippet

## Decisione
Alessandro, 4 ottobre 2026. L'[[Editor di codice]] ha due forme:
1. lo **snippet**, un file a sinistra e la sua uscita a destra, com'era: basta per spiegare un ciclo `for`, ed è quello che una lezione usa di solito;
2. il **progetto**, più file che si possono creare e rinominare, per le cose che lo chiedono: pagine HTML che si linkano, più fogli di stile e script, moduli Python importati da altri file Python.

Nelle lezioni il blocco dice quale delle due è, come il blocco del plotter dichiara cosa è permesso. Un blocco a più file può non lasciar creare file nuovi: sono esempi già svolti.

Il progetto nello strumento è disposto come un editor di programmi: l'elenco dei file a sinistra, il codice accanto con più spazio, e sotto il codice una fascia con l'uscita, che non è un terminale. Due maniglie: una tra l'elenco e il resto, una tra il codice e l'uscita.

## Perché
Parole di Alessandro: una lezione di sviluppo web chiede "diverse pagine HTML, si linkano l'una all'altra, sono diversi file CSS o JavaScript", e con un solo file per tipo non si fa. Deve restare flessibile, non solo per il web, e sicuro.

## Scelte proposte da Claude, su cui Alessandro ha detto di procedere
- Le immagini stanno dentro il progetto, rimpicciolite nel browser, con un tetto al peso del progetto. Niente bucket: aprirebbe il tema di cosa caricano dei minorenni e di quanto spazio costa, non discusso.
- I PDF restano fuori: l'anteprima isolata non li apre e non c'è un caso d'uso.
- I nomi dei file possono avere cartelle, scritte con la barra; non ci sono cartelle vuote.
- La vecchia "Pagina web" a tre linguette diventa un progetto di tre file.

## Scelte di Claude non discusse
- "Esegui" vale per l'ultimo programma o l'ultima pagina aperti, non per il file che si sta guardando.
- Nelle lezioni un progetto ha una linguetta per file; l'elenco a sinistra compare solo se il blocco lascia creare file.
- L'estensione `.h` (e `.hpp`) è tra quelle accettate, perché il C a più file ne ha bisogno; `.csv` anche.
- Nei progetti web l'anteprima sta nella fascia sotto il codice, come l'uscita di un programma.

## Sicurezza
Il confine è quello di [[2026-10-04 I programmi dell'editor girano in un iframe senza l'origine del sito]]: i file passano ai due iframe isolati come dati, le immagini come data URL. Niente di ciò che lo studente carica viene servito dal sito.

## Conseguenze
- Aggiornate [[Editor di codice]], `docs/lezioni/README.md` e l'articolo dello strumento.
- Constraint della tabella `programs` allargati in produzione (linguaggio `project`, peso fino a 2 milioni di caratteri).

## Collegamenti
- [[Editor di codice]], [[2026-10-04 L'editor di codice ha anche JavaScript e le pagine web]], [[2026-10-04 I programmi dell'editor si salvano con nome, come i grafici]]
