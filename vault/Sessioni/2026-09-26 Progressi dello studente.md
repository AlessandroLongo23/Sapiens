---
aggiornato: 2026-09-26
tag: [sessione]
---
# Progressi dello studente

Sessione del 25-26 settembre 2026: costruzione delle sette funzioni del piano [[Progressi dello studente]], una alla volta, ognuna provata nel browser prima di passare alla successiva.

## Cosa si è fatto
- Prima di cominciare, committato il lavoro dell'altra sessione sul percorso dei livelli, che era finito ma non committato (scelta di Alessandro).
- Fondo comune: conteggi delle prove e delle risposte per giorno tenuti da un trigger nel database; una prova sotto le 5 domande non supera il livello.
- Le sette funzioni, un commit ciascuna: errori nel riepilogo della prova; prova da riprendere; rifai gli errori e la pagina `/errori`; progressi sulle righe del materiale; pratica quotidiana e serie di giorni; schermo "Oggi" come apertura dell'app e nella navigazione; metriche della beta per gli admin, con la data del primo pagamento.
- Corretto un difetto dell'intestazione introdotto con "Oggi" (a 768-1280 px la ricerca copriva le voci; a 768 px succedeva già prima).

## Informazioni nuove
- La regola proposta per chiudere un errore non funzionava: in una prova di livello le risposte giuste successive, allo stesso livello, lo chiudevano subito. Ora contano solo le risposte giuste in prove successive.
- Il foglio di stile di KaTeX si caricava solo nel materiale e nello Zaino: le formule fuori da lì comparivano doppie. Ora lo caricano i componenti delle prove.
- La pagina di pagamento di Stripe usa hCaptcha e non si prova in automatico; le prove si fanno con eventi firmati e pagamenti di prova via API.
- Tutte le prove usano account di prova cancellati alla fine.

## Domande aperte
- Regole ancora da discutere: composizione della pratica, soglia della serie (5 risposte), due risposte giuste per chiudere un errore.
- La grafica di "Oggi" con Dario.
- Riportare le migrazioni del 26 settembre in [[Schema dati]] (la nota era in modifica in un'altra sessione).

## Prossimo argomento
Deploy di tutto il lavoro non pubblicato (piani, percorso, progressi), con la prova a mano del pagamento. Poi il diario.
