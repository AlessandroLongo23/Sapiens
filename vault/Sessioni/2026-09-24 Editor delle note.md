---
aggiornato: 2026-09-24
tag: [sessione]
---
# Editor delle note

Lavoro del 24 settembre 2026, sera, su richiesta di Alessandro: rivedere da capo la pagina della nota nello [[Zaino]], che sembrava un MVP, prendendo come riferimento le app di appunti più mature.

## Cosa si è fatto
Una ricerca su Notability, GoodNotes 6, Notion, Obsidian, Apple Notes, OneNote, Craft, Bear e Noteshelf: barre, pagine, carta, zoom. Le fonti sono le pagine di aiuto dei produttori e le recensioni di Paperless X; il modo in cui Notability aggancia la barra non è documentato, e il riferimento usato è la barra di Apple Notes e di Noteshelf 3.

Poi l'editor è stato rifatto: una sola barra in alto, la barra di formattazione mobile e agganciabile in basso, a sinistra o a destra, le pagine con le miniature, la carta per ogni nota, lo zoom, la stampa. Il dettaglio è in [[Zaino]] ("Stato attuale"). La colonna `notes.paper` è applicata al database, vedi [[Schema dati]].

Il lavoro è stato giudicato da un revisore separato, che guardava sia il codice sia gli screenshot, per tre giri al massimo, come chiesto: 6 su 10, poi 7, poi 7,5. Dopo il terzo giro sono state fatte le quattro correzioni che il revisore indicava per arrivare a 8, verificate nel browser ma senza un quarto voto.

Dopo il terzo giro Alessandro ha chiesto l'indice dei titoli a sinistra, con le pagine spostate a destra, e una modalità Lettura per ripassare senza distrazioni, più altri due giri di revisione. Voti: 7 (la Lettura perdeva il punto in cui si era e sul telefono non si ingrandiva), poi 8 su 10. Dopo l'ultimo giro sono state fatte tre piccole correzioni indicate dal revisore, verificate nel browser.

## Informazioni nuove
- Aprire una nota con formule la riscriveva nel database (la conversione delle formule contava come modifica). Corretto.
- Il revisore ha proposto una pagina che si riimpagina sul telefono. Non è stata fatta perché va contro [[2026-09-24 Le note sono fogli a larghezza fissa]]; resta tra le domande aperte di [[Zaino]].

## Da fare
- Rileggere l'editor con Dario.
- Decidere lo zoom automatico sul telefono e la carta predefinita per le nuove note (domande aperte in [[Zaino]]).
- Il lavoro è committato; va pubblicato con un deploy.
