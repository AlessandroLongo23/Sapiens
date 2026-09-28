---
stato: in sviluppo
release: beta
aggiornato: 2026-09-28
tag: [prodotto, studenti]
---
# Diario e calendario

Il diario scolastico digitale: compiti per casa, verifiche, interrogazioni, scadenze.

## Stato attuale
Scritto il 26 settembre 2026, provato nel browser, non ancora committato né pubblicato.

- Pagina `/diario` (`src/app/(site)/diario/page.tsx`), al posto di `/oggi`: schermo iniziale dell'app, scheda "Diario" nella barra in basso, nell'intestazione e nel menu. Un giorno si apre con `?giorno=AAAA-MM-GG`; senza, oggi. Chi non ha un account vede il diario chiuso, con l'elastico, e l'invito a iscriversi.
- Il diario è un oggetto: copertina rigida in tela rossa, pagine a quadretti con i fogli sovrapposti sui bordi e la curva verso la costola, nastrino nella costola (sul telefono ne esce solo la coda), segnalibri colorati per materia per le verifiche in arrivo, linguette dei mesi sul bordo destro da computer. Stili in `src/components/diary/diary.css`.
- Pagina del giorno (`DayPage.tsx`): data grande con il giorno della settimana a penna e un timbro (la serie di oggi, o "giorno di studio" sui giorni passati in cui la serie è contata). Poi "Per la scuola": le voci a penna blu, con la casella spuntata a mano, la materia colorata, le verifiche evidenziate e il conto dei giorni. Oggi, i post-it di Sapiens: prova a metà, ripasso per ogni verifica dei prossimi 7 giorni con le lezioni del capitolo e i livelli superati, pratica del giorno, errori da ripassare, percorso da continuare, domande gratuite rimaste; pratica e ripasso partono sulla pagina stessa. Sui giorni futuri, il ripasso previsto nei 3 giorni prima di una verifica. Sui giorni passati (e oggi, se ha già risposto), un foglietto "Com'è andata" con risposte giuste, prove fatte e livelli superati. In fondo a oggi, la serie di giorni a tacche.
- Inserimento in una riga (`src/lib/diary/entries.ts`): legge tipo (compito, verifica, interrogazione, promemoria), materia (21 materie con le abbreviazioni, "mate", "ita", "ed fisica"), giorno ("domani", "giovedì", "tra 3 giorni", "il 12", "12/10", "12 ottobre"; "es 3-7" non è una data) e, per matematica, il capitolo o la lezione (`topics.ts`). Mostra sotto la riga quello che ha letto, il tipo si cambia con un tocco e l'argomento si toglie. Una voce si apre per cambiarla o cancellarla. Test in `tests/unit/diary.test.mjs` (`npm run test:unit`).
- Pagina personale (`OwnPage.tsx`), con scritto "solo tua": testo a penna e adesivi col gesto delle note, salvati da soli dopo un momento.
- Navigazione come in [[2026-09-26 Navigazione del diario, calendario dentro e niente vista log]]: swipe, frecce, striscia della settimana con i puntini delle voci e la spunta dei giorni studiati, pulsante "Oggi", calendario del mese (`CalendarSheet.tsx`), segnalibri e linguette.
- Dati: tabelle `diary_entries` e `diary_pages`, vedi [[Schema dati]]. API in `src/app/api/diario/`: `GET ?da&a` (un mese), `POST voci`, `PATCH`/`DELETE voci/[id]`, `PUT pagina`. Il registro dei giorni viene da `exercise_days` e `exercise_sessions` (`dayLog` in `src/lib/server/exercises.ts`).
- Il font a mano (Caveat) ora è caricato dal layout: prima `pencil` ripiegava sul corsivo di sistema.
- Le pagine hanno un'altezza fissa, su richiesta di Alessandro: il libro è alto quanto lo schermo permette (computer tra 34 e 52 rem, telefono lo spazio fra la settimana e la barra in basso) e ciò che non entra scorre dentro la pagina, con una sfumatura in fondo. Sul telefono la pagina personale è il retro del foglio: l'angolo piegato in basso a destra lo gira in 3D.
- Due giri di revisione con un agente critico e Playwright (computer da 1280 a 1920 px, Pixel 7, iPhone SE, tema scuro): allineamenti, bersagli da 44 px, caselle alla riga della penna, intestazione del giorno di altezza costante, "Oggi" come icona. Le frecce scritte come caratteri sono diventate icone lucide anche fuori dal diario: suggerimenti della ricerca, scorciatoie delle note, guida della materia.
- Dal 28 settembre 2026 (committato su master, non ancora pubblicato) una voce spuntata viene barrata a penna dopo che la spunta è disegnata: la riga percorre il testo da sinistra a destra, riga dopo riga se la voce va a capo, e torna indietro togliendo la spunta. È la penna blu del diario, come la voce. La casella si abbassa un poco quando si preme (`.diary-strike` in `diary.css`, `Entries.tsx`).
- Provato con un account di prova poi cancellato, su computer a 1440 px, su un Pixel 7 simulato e nel tema scuro: voce scritta, spuntata e ritrovata dopo il ricaricamento, voce su un altro giorno con il link per andarci, frecce, swipe, calendario, linguetta di un mese, adesivo e testo salvati.

## Obiettivo
Dal 26 settembre 2026 il diario prende il posto dello schermo "Oggi": è la prima scheda dell'app e unisce diario scolastico, consiglio di Sapiens su cosa fare e storia di quello che lo studente ha fatto. Struttura della pagina del giorno in [[2026-09-26 Il diario prende il posto di Oggi]].

Deciso il 23 settembre 2026 che entra nella [[Release Beta]]. Lo studente segna compiti e verifiche per materia e data; Sapiens gli propone cosa ripassare prima di una verifica, collegando la data agli argomenti, alle [[Lezioni]] e agli [[Esercizi]].

## Domande aperte
- Privacy nella v4: proposta di Claude, la pagina personale non la vedono mai docenti e genitori; l'agenda il genitore solo se lo studente la condivide. Il codice la tratta già così (la pagina dice "solo tua"), ma non è stata decisa.
- Provenienza delle voci: il codice ha già la colonna `source` (studente o docente) e le regole per cui una voce del docente si può solo spuntare o nascondere. Da confermare come decisione.
- La grafica è da rivedere con Dario: colore della copertina (per ora il rosso del marchio, forse a scelta dello studente), post-it, timbro.
- Il collegamento automatico all'argomento vale solo per matematica, l'unica materia con esercizi.
- Orario settimanale delle lezioni inserito dallo studente, per sapere quali materie ha domani?
- Promemoria (email, push) prima delle verifiche?
- Con la [[Release v4 Scuole]] il diario si riempie da solo dal [[Registro elettronico]]. Fino ad allora è tutto manuale: vale la pena di importare da ClasseViva o Argo?
- Condivisione con il [[Genitore]] nell'[[Area genitori]]?
