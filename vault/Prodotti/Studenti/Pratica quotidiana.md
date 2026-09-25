---
stato: in sviluppo
release: beta
aggiornato: 2026-09-25
tag: [prodotto, studenti]
---
# Pratica quotidiana

Un'abitudine di studio in stile Duolingo costruita sopra gli [[Esercizi]]. Dalla [[ROADMAP]] del 3 settembre 2026.

## Stato attuale
Dal 25 settembre 2026 (sera), sulla pagina `/oggi`:
- Pratica di oggi: 5 domande dalle lezioni cominciate, una sola al giorno (indice unico nel database, anche con due schede aperte). Composizione in `src/lib/exercises/practice.ts`: fino a 2 dagli errori ancora da rifare, 1 dal livello a cui lo studente è arrivato nella lezione fatta per ultima, le altre da livelli già superati delle lezioni fatte da più tempo, al massimo 3 lezioni, mai un livello chiuso. È la stessa per tutto il giorno (seme da studente e data). Si riprende a metà dallo stesso esercizio; non supera né apre livelli; usa le domande gratuite del giorno.
- Serie di giorni (`src/lib/exercises/streak.ts`): un giorno conta con almeno 5 risposte in qualunque prova, nel giorno di Roma, da `exercise_days`. La serie arriva a oggi, o a ieri finché oggi non conta: allora la pagina dice quante domande mancano per tenerla. Gli ultimi sette giorni come caselle, il record solo quando supera la serie in corso.
- Senza lezioni cominciate la scheda rimanda al materiale. Chi non ha un account vede l'invito a crearne uno.
- Mancano: promemoria, notifiche, premi (vedi [[Adesivi]]). Lo schermo "Oggi" completo è descritto in [[App mobile]].

## Obiettivo
- Dal 25 settembre 2026 il piano per la beta è in [[Progressi dello studente]]: una prova di 5 domande al giorno dalle lezioni cominciate, fatta dallo schermo "Oggi" ([[2026-09-25 Oggi è lo schermo iniziale dell'app]]); la serie conta i giorni con almeno 5 risposte (proposta).
- Sessione giornaliera: cinque domande dai capitoli che lo studente ha aperto, due minuti, un tocco per iniziare.
- Serie di giorni consecutivi e punti, calcolati sul server perché non si possano falsificare.
- Promemoria con notifiche push (serve il service worker della PWA, vedi [[App mobile]]). Il permesso si chiede solo dopo la prima sessione completata, con un motivo chiaro.
- Ripasso a intervalli crescenti quando esisteranno le [[Flashcard]].
- Serie di giorni e padronanza fanno guadagnare gli [[Adesivi]], dopo la beta (vedi [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]]). La serie si progetta già pensando a dove si agganciano.
- Niente classifiche finte (vedi [[Principi]]). Leghe solo quando gli utenti attivi bastano a riempirne una.

## Domande aperte
- Entra nella [[Release Beta]]: deciso il 25 settembre 2026, vedi [[2026-09-25 La pratica quotidiana entra nella beta]]. Piano in [[Progressi dello studente]].
