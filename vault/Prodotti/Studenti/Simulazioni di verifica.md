---
stato: idea
release: dopo la beta
aggiornato: 2026-10-08
tag: [prodotto, studenti, esercizi]
---
# Simulazioni di verifica

Una verifica di prova a tempo, sugli argomenti che lo studente ha in programma, con un voto in decimi e la correzione.

## Stato attuale
Niente. Esistono i pezzi da cui parte: i generatori con i livelli per lezione (687 livelli di matematica, 449 con la risposta aperta corretta dal server, vedi [[Esercizi]]), la pagina della scheda che mostra molti esercizi insieme, il tempo attivo salvato per ogni risposta, e il diario che legge una voce "verifica" con la materia, il giorno e, per matematica, il capitolo o la lezione ([[Diario e calendario]]).

## Obiettivo
Decisioni dell'8 ottobre 2026:
- Si costruisce subito come prototipo, non pubblicato né promesso, su un capitolo pilota con esercizi lunghi. Vedi [[2026-10-08 Le simulazioni di verifica si costruiscono subito come prototipo, su un capitolo pilota con esercizi lunghi]].
- Lo studente sceglie le lezioni che la verifica copre, partendo da una proposta di Sapiens.
- Alla fine riceve un voto in decimi.
- C'è un conto alla rovescia. Vedi [[2026-10-08 Nella prova veloce non c'è un timer, il tempo sta nel riepilogo e nelle simulazioni]].
- Tre modi di consegnare: sul quaderno con una foto; sul tablet, da Sapiens o caricando un'immagine da un'altra app; a scelta multipla senza altro. Da un'immagine i passaggi entrano nel voto, con credito parziale. Vedi [[2026-10-08 Una simulazione si consegna dalla pagina o da un'immagine, e i passaggi entrano nel voto]].
- Chi scrive a mano dentro Sapiens ha un editor a penna vero. Vedi [[2026-10-08 Chi scrive a mano su Sapiens ha un editor a penna vero]].
- Nei piani resta una funzione di Plus, dopo la beta ([[2026-09-23 Piani che crescono con le funzioni]]).

## Dettagli
Proposte di Claude dell'8 ottobre 2026, discusse ma non decise:
- Ingressi: la voce "verifica" del diario ("Verifica di mate tra 4 giorni: fai una simulazione") e la pagina del capitolo. Non la pagina della lezione, che ha già il suo percorso.
- Composizione: dagli stessi generatori, senza AI. Un esercizio per coppia lezione e livello, senza doppioni, in ordine dal facile al difficile; seme fisso, così la simulazione si rivede; non adattiva.
- Taglie: 30 minuti con 8 esercizi e 55 minuti con 12. Miscela dei livelli verso l'alto: circa 20% bassi, 50% medi, 30% alti. Numeri da verificare con Andrea.
- Formato a schermo: tutto il foglio visibile, ordine libero, nessun verdetto fino alla consegna; poi voto, correzione esercizio per esercizio e livelli deboli che vanno nel ripasso degli errori.
- Lettura delle immagini: il modello non risolve, confronta lo svolgimento con risultato e passaggi che Sapiens conosce già. Per un voto stabile, una griglia di punti per passaggio ricavata dal generatore e la correzione salvata con la consegna.

## Domande aperte
- Quale capitolo pilota. Proposta: le equazioni di secondo grado.
- Quanti esercizi, quanto tempo e quanto vale ogni esercizio in una verifica vera di matematica al biennio: da chiedere ad Andrea ([[Domande per Andrea]]).
- Quanto si allunga il tempo per chi ha un PDP, e chi lo imposta.
- Quanto è precisa la lettura della scrittura a mano di uno studente, e quanto costa un'immagine: non misurato.
- Come si rende stabile un voto con credito parziale dato da un modello.
- L'editor a penna: lo stesso componente dello [[Zaino]]? Cosa fa nella prima versione? In che ordine rispetto al foglio e alle immagini?
- Dati: foto di quaderni di minori mandate al provider AI. Vedi [[GDPR e minori]] e [[Provider AI]].
- Perché costruirla adesso e non dopo la memoria FSRS, e perché credito parziale ed editor vero dalla prima versione: Alessandro ha scelto senza dire il motivo.
- Il legame con [[Ripasso pianificato prima di una verifica]]: la simulazione è l'ultimo passo di quel ripasso?

## Collegamenti
- Attori: [[Studente]]
- Release: dopo la beta, piano Plus
- Decisioni: [[2026-10-08 Nella prova veloce non c'è un timer, il tempo sta nel riepilogo e nelle simulazioni]], [[2026-10-08 Le simulazioni di verifica si costruiscono subito come prototipo, su un capitolo pilota con esercizi lunghi]], [[2026-10-08 Una simulazione si consegna dalla pagina o da un'immagine, e i passaggi entrano nel voto]], [[2026-10-08 Chi scrive a mano su Sapiens ha un editor a penna vero]]
- Note: [[Esercizi]], [[Pipeline esercizi]], [[Diario e calendario]], [[Foto e soluzione]], [[Dettatura e scrittura a mano]]
- Sessione: [[2026-10-08 Pagina della prova e simulazioni di verifica]]
