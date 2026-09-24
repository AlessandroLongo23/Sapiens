---
name: vault
description: >-
  Aggiorna il vault di Sapiens (vault/, Obsidian, in italiano), la memoria del progetto. Da usare
  quando Alessandro dice di segnarsi o annotare un'idea, registrare o prendere una decisione,
  aggiornare la memoria o il vault, o quando un lavoro sul codice cambia lo stato di una feature.
  Tre modalità: idea, decisione, aggiorna.
argument-hint: "idea | decisione | aggiorna  <testo>"
---

# Vault di Sapiens

Il vault è in `vault/`. Prima di scrivere leggi `vault/Home.md` e le note che l'argomento tocca.
Scrivi in italiano e segui le regole di scrittura globali: niente trattini lunghi, niente "piuttosto
che" usato come contrasto, grassetto raro, prosa prima degli elenchi. La data è quella di oggi, in
formato AAAA-MM-GG.

Scegli la modalità dal primo argomento. Se manca, deducila dalla richiesta. Se non si capisce,
chiedi.

## idea

Serve a registrare un'idea di Alessandro, ad alto o basso livello, senza giudicarla nel momento.

1. Cerca con grep in `vault/` le note che l'idea tocca. Se un'idea simile esiste già in `Idee/` o in
   una nota di prodotto, aggiorna quella invece di crearne una nuova.
2. Crea `vault/Idee/<titolo breve>.md` partendo da `vault/Template/Idea.md`. Sostituisci i segnaposto
   `{{title}}` e `{{date:...}}` a mano. Scrivi "L'idea" con le parole di Alessandro, riordinate ma
   non gonfiate.
3. In "Dubbi e conflitti" elenca le decisioni in `Decisioni/` e i principi in `Visione/Principi.md`
   con cui l'idea si scontra, con un link a ciascuno. Se non ce ne sono, scrivilo.
4. Aggiungi un link alla nuova nota nelle note di prodotto toccate, sotto "Domande aperte" o
   "Collegamenti", e nella sezione "Idee" di `Home.md`.
5. Rispondi con il percorso della nota, i conflitti trovati e al massimo una domanda che aiuti a
   valutarla.

## decisione

Serve a registrare una decisione presa e a portarla in tutte le note che ne dipendono.

1. Crea `vault/Decisioni/AAAA-MM-GG <titolo>.md` da `vault/Template/Decisione.md`. Il titolo dice
   la decisione, non l'argomento ("Il piano Pro non include ore di ripetizione", non "Piano Pro").
2. Scrivi "Perché" con le alternative scartate. Se il motivo non è stato detto, chiedilo e non
   inventarlo.
3. Aggiorna ogni nota toccata: sezione "Obiettivo" o "Dettagli", `stato` e `aggiornato`, e un link
   alla decisione. Se la decisione sostituisce una decisione precedente, nella vecchia nota imposta
   `stato: superata` e aggiungi un link alla nuova.
4. Aggiungi la decisione in cima all'elenco "Decisioni" di `Home.md`. Togli da "Decisioni aperte più
   importanti" ciò che ha risolto.
5. Se la decisione cambia qualcosa che il codice già fa (prezzi, piani, testi), elenca i file da
   cambiare. Non modificarli senza che Alessandro lo chieda.
6. Rispondi con l'elenco delle note create e aggiornate.

## aggiorna

Serve ad allineare il vault al codice dopo un lavoro.

1. Guarda cosa è cambiato: `git diff --stat`, `git log` dall'ultima data `aggiornato` delle note
   coinvolte, oppure i file indicati da Alessandro.
2. Per ogni feature toccata aggiorna "Stato attuale" con quello che il codice fa adesso, con i
   percorsi. Aggiorna `stato` (bozza, in sviluppo, rilasciata) e `aggiornato`.
3. Se il codice fa qualcosa di diverso da quanto scritto in "Obiettivo" o in una decisione,
   segnalalo senza correggere nessuno dei due.
4. Aggiorna "Dove siamo" in `Home.md` solo se è cambiato qualcosa che conta a livello di progetto.

## Controlli prima di finire

- Ogni `[[link]]` scritto porta a una nota esistente. Controlla i nomi con
  `find vault -name "*.md"`. I nomi delle note sono unici in tutto il vault.
- Nessun testo inventato: quello che non è stato detto va in "Domande aperte".
- Nessun "—" e nessun "piuttosto che" nelle note toccate.
