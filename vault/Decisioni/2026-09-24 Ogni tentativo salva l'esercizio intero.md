---
stato: decisa
aggiornato: 2026-09-24
tag: [decisione, tecnica, studenti]
---
# Ogni tentativo salva l'esercizio intero

## Decisione
Ogni tentativo salva nel database l'esercizio come lo ha visto lo studente: consegna, testo, risposta, opzioni, soluzione e passaggi. Il seed e il generatore restano nella riga come provenienza, ma lo storico non si ricostruisce dal seed. La riga si scrive quando il server mostra l'esercizio, senza mandare la risposta alla pagina; quando lo studente risponde, il server corregge confrontando con la risposta salvata nella riga.

## Perché
Il seed ricostruisce l'esercizio solo finché il generatore non cambia: una correzione o un livello nuovo cambierebbero in silenzio gli esercizi dello storico. Salvare l'esercizio rende lo storico indipendente dal codice, senza regole da ricordare.

Misura del 24 settembre 2026 sui 26 generatori nuovi (7.700 esercizi): un esercizio intero pesa in media 1,0 KB in JSON, 0,5 KB senza i passaggi. Con 500 studenti, 20 esercizi al giorno per 120 giorni sono 1,2 milioni di righe, circa 1,5 GB con gli indici (stima; piano di Supabase da verificare). Se lo spazio diventa un problema si possono togliere i passaggi dalle righe vecchie: le statistiche leggono solo gli esiti.

Alternative scartate:
- Solo seed e versione del generatore: ogni modifica diventa una versione da tenere nel codice per sempre, e una versione dimenticata falsa lo storico senza che nessuno se ne accorga.
- Esercizio senza passaggi, ricostruiti dal seed se il testo coincide: metà dello spazio, ma una logica in più e passaggi a volte assenti.
- Riga scritta solo alla risposta: il browser dovrebbe rimandare l'esercizio (non affidabile) o il server rigenerarlo (sbagliato se nel frattempo è uscito un deploy).

## Conseguenze
- Precisa [[2026-09-23 Progressi salvati per ogni tentativo]]: si salva anche l'esercizio, non solo il seed.
- L'esito giusto non arriva più nella pagina: oggi `src/lib/server/exercises.ts` manda `isCorrect` per ogni opzione.
- Si vedono anche gli esercizi mostrati e non risposti.
- Schema proposto in [[Schema dati]]; aggiornata [[Esercizi]].

## Collegamenti
- [[Esercizi]], [[Schema dati]], [[Pratica quotidiana]]
