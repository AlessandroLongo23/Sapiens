---
aggiornato: 2026-09-23
tag: [sessione]
---
# Revisione delle lezioni

Quarta sessione del 23 settembre 2026, subito dopo [[2026-09-23 Primo generatore della pipeline]]. Alessandro ha controllato gli esercizi del nuovo generatore e li ha approvati, poi ha chiesto di rivedere le 18 lezioni di teoria già pubblicate, scritte con un altro modello.

## Cosa si è fatto
Le 18 lezioni sono state scaricate dal database (solo lettura) in `docs/lezioni/originali/`, riscritte da sei agenti in parallelo con un brief comune (`docs/lezioni/stile.md`) e rilette una per una. Ogni conto degli esempi è stato rifatto. Le versioni nuove sono in `docs/lezioni/riscritte/`, con una nota per lezione in `docs/lezioni/note/` e il riepilogo in `docs/lezioni/README.md`. Su richiesta di Alessandro sono state caricate nel database al posto degli originali con `scripts/lezioni/publish.mts`, che scrive solo se il testo nel database è ancora quello salvato; tutte e 18 rilette dal database e passate dal renderer del sito senza errori.

Un controllo automatico nuovo, `scripts/lezioni/check.mts`, verifica formule, link, formato dei riquadri e regole di stile. Ha trovato un difetto che nessuno aveva visto: nei riquadri del sito la prima riga diventa il titolo, e 20 riquadri erano scritti su una riga sola.

## Informazioni nuove
- I disegni TikZ non si vedevano da nessuna parte, per due difetti nel codice (avvio di TikZJax e CSP). Corretti e verificati con Playwright; il disegno dell'intersezione nella lezione 03 era sbagliato e ora è giusto. Serve un deploy perché la correzione arrivi in produzione.
- Tre lezioni sono troncate nel database a metà frase, e "Rappresentazione degli insiemi" è una copia di "Prime definizioni". Tutte e 18 sono state caricate il 30 novembre 2025 nello stesso minuto: i tagli vengono probabilmente da quell'importazione.
- Quasi tutte le lezioni originali hanno errori di matematica (elenco in `docs/lezioni/README.md`).
- Le riscritte sono lunghe più del doppio degli originali (169.000 caratteri contro 80.000), soprattutto per gli esempi svolti e gli errori frequenti che prima mancavano.

## Decisioni
Nessuna nuova. L'approvazione degli esercizi è registrata in [[Pipeline esercizi]].

## Domande aperte
- Le convenzioni da fissare con Andrea (nove punti) e i dubbi sulla struttura del programma, in `docs/lezioni/README.md`.
- Il brief diventa lo [[Standard di qualità]]?
- Come si caricano le lezioni nel database. Vedi [[Pipeline lezioni]].

## Prossimo argomento
Mandare ad Andrea le convenzioni da decidere, poi scrivere le lezioni nuove.
