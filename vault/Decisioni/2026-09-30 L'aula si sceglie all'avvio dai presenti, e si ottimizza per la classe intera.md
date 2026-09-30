---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, laboratori, prestazioni]
---
# L'aula si sceglie all'avvio dai presenti, e si ottimizza per la classe intera

## Decisione
Le aule del laboratorio sono poche misure già pronte (per esempio 12, 16 e 24 postazioni). Il docente crea la stanza e sceglie solo quanti studenti per postazione; gli studenti entrano in una sala d'attesa; quando il docente avvia, il sistema calcola le postazioni che servono per i presenti e carica l'aula più piccola che li tiene. Chi arriva dopo prende una postazione libera o si aggiunge a un gruppo. L'obiettivo è una sola aula per tutta la classe, ottimizzando finché il computer della scuola la regge; se non basta, si ripiega su più aule da 12 al massimo.

## Perché
Alessandro, 30 settembre 2026. Un'aula costruita al volo nel browser per il numero esatto di persone perderebbe la luce calcolata in Blender (una cottura richiede da dieci minuti a ore), e con lei gran parte dell'aspetto e delle prestazioni. Le misure pronte costano una cottura ciascuna, una volta sola, perché la pianta è fatta di numeri (`build_aula.py`). Scegliere all'avvio, e non alla creazione, misura l'aula su chi è venuto davvero.

## Conseguenze
- Mentre la sala d'attesa si riempie la pagina può già scaricare l'aula che il numero di presenti suggerisce, così l'avvio è immediato.
- L'aula non cambia durante la sessione.
- Il costo che cresce con la classe sono gli avatar: prima di un'aula da 32 servono i livelli di dettaglio per le persone lontane, un profilo "computer di scuola" nel banco di prova (`bench.mjs`) e una misura su un PC vero con grafica integrata.

## Collegamenti
- [[Laboratorio condiviso]], [[Laboratori]]
- [[2026-09-30 Nel laboratorio condiviso la postazione è l'unità, per gruppi da 1 a 3]]
