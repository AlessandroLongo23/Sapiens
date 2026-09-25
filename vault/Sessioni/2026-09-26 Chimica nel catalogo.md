---
aggiornato: 2026-09-26
tag: [sessione, contenuti, chimica]
---
# Chimica nel catalogo

Sessione del 26 settembre 2026, seguito di [[2026-09-25 Chimica con RDKit]]. Alessandro ha chiesto di portare le lezioni di chimica nel catalogo vero del sito.

## Cosa si è deciso
- Claude ha fatto notare il contrasto con la beta di sola matematica e che sul sito non esiste una bozza. Alessandro ha scelto di pubblicare: [[2026-09-26 La chimica si pubblica gratis accanto alla beta]].
- Prima l'albero, poi le lezioni; gli esercizi con le immagini subito, non in un secondo passo.
- Albero di chimica approvato così come proposto: 29 capitoli e 157 lezioni, con gli anni dal Valitutti (Zanichelli). Proposta e fonti in `docs/lezioni/chimica/programma.md`, albero in `docs/lezioni/chimica/albero.md`; le scelte aperte elencate lì restano come proposto.
- Niente redirect per i capitoli che cambiano indirizzo: non ci sono utenti e il sito non è indicizzato, gli indirizzi non usati si possono cancellare (Alessandro).

## Cosa si è fatto
- Albero applicato al database con `scripts/lezioni/tree.mts`, reso generale: materia e file come argomenti, anno dei capitoli dalle righe `# Primo anno`, capitoli e lezioni confrontati separatamente, capitoli assorbiti. Sulla matematica lo script non cambia niente.
- Le sei lezioni con formulario sono nel database, con 2.235 disegni nel bucket `figure` (quelli delle lezioni e quelli degli esercizi).
- Il sito mostra i blocchi di chimica come immagini, e la lezione sulla geometria delle molecole ha i modelli 3D da ruotare (pacchetto `3dmol`).
- Gli esercizi accettano disegni nella domanda, nelle risposte e nella soluzione, e testo semplice al posto delle formule; nell'archivio dei tentativi resta il riferimento al disegno, non il disegno. Ogni lezione ha 400 esercizi pregenerati in Python e verificati.
- Provato nel browser in locale con un account di prova, poi cancellato: lezioni in chiaro e in scuro, modello 3D, esercizi con risposte disegnate, soluzione con la catena numerata, telefono.

## Informazioni nuove
- Il sito in produzione non ha ancora il codice nuovo: finché non si fa un deploy, le lezioni di chimica mostrano i blocchi delle figure come codice.
- `scripts/lezioni/tree.mts` va lanciato con `JITI_ALIAS`, perché `src/lib/seo/slug.ts` importa con `@/`.

## Domande aperte
- Il deploy, da fare quando il lavoro non committato delle altre sessioni è sistemato.
- Il testo della pagina della materia (`src/lib/content/subject-copy.ts`) cita ancora chimica ambientale e industriale; il file era in modifica in un'altra sessione.
- Le lezioni di chimica non hanno flashcard.
- `scripts/lezioni/check.mts` non conosce i blocchi di chimica e segnala come formule sbagliate i `$` dei SMARTS.
- Da aggiornare quando sono liberi: `Home.md`, [[Agenda]] e [[Lezioni]], in modifica in un'altra sessione.

## Prossimo argomento
Le altre 151 lezioni di chimica, a lotti come la matematica, quando si decide da quale anno partire (domanda 1 in `programma.md`).
