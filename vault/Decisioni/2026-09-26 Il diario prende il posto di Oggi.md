---
stato: decisa
aggiornato: 2026-09-26
tag: [decisione, studenti, prodotto, app]
---
# Il diario prende il posto di Oggi

## Decisione
Lo schermo "Oggi" diventa il Diario: una sola scheda che unisce il diario scolastico, il consiglio di Sapiens su cosa fare e la storia di quello che lo studente ha fatto. L'app si apre sulla pagina di oggi del diario, e la scheda "Oggi" della barra in basso si chiama Diario. Resta valido il resto di [[2026-09-25 Oggi è lo schermo iniziale dell'app]]: schermo iniziale, scheda della barra, pagina anche sul sito.

La pagina del giorno ha, dall'alto:
1. la scuola: compiti, verifiche e interrogazioni in arrivo, con il conto dei giorni;
2. Sapiens: pratica del giorno, ripasso per la verifica più vicina, errori da rivedere, prova da riprendere; le verifiche segnate decidono l'ordine;
3. la serie di giorni;
4. il foglio personale a quadretti, con testo e [[Adesivi]].

I blocchi vuoti non si mostrano. I giorni passati si riempiono da soli con quello che lo studente ha fatto (esercizi, livelli superati, serie), accanto a quello che ha scritto lui; i giorni futuri mostrano le voci segnate e il ripasso previsto.

## Perché
Il diario di carta fa due lavori: agenda della scuola e oggetto personale. Il registro elettronico ha preso il primo (i compiti assegnati) senza toccare il secondo, e gli studenti comprano ancora il diario. Nella v4 i compiti arriveranno dal docente, ma la parte personale resta dello studente, quindi il diario non perde senso con la [[Release v4 Scuole]].

"Oggi" e il diario avevano per natura la stessa pagina, quella di oggi: tenerli separati voleva dire due schede che si contendono lo stesso contenuto. "Diario" è una parola che ogni studente conosce; "Oggi" ad Alessandro non piaceva come nome. Il consiglio di Sapiens diventa più utile quando conosce le verifiche segnate, ed è il motivo per segnarle in Sapiens oltre che nel registro.

Alternative scartate: "Oggi" separato dal diario, con in cima le voci di oggi e domani; diario solo automatico, riempito dal docente nella v4.

## Conseguenze
- Il nome e la pagina `/oggi` cambiano. Nessun reindirizzamento da preparare: `/oggi` era nel codice ma non ancora pubblicato. Fatto il 26 settembre 2026: `/diario`, `APP_START`, `start_url` del manifest, barra in basso, intestazione e menu. Vedi [[App mobile]] e [[Diario e calendario]].
- Il rischio è la pagina affollata sul telefono: blocchi vuoti nascosti, foglio personale in fondo.
- Il diario deve funzionare anche per chi non segna niente (pratica, errori, serie).
- Calendario e navigazione decisi in [[2026-09-26 Navigazione del diario, calendario dentro e niente vista log]]. Restano da decidere la privacy delle pagine personali nella v4 e la provenienza delle voci, che il codice tratta già come proposto. Vedi [[Diario e calendario]].

## Collegamenti
- [[Diario e calendario]], [[Progressi dello studente]], [[App mobile]], [[Pratica quotidiana]], [[Ripasso pianificato prima di una verifica]]
