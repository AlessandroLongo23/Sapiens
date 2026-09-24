---
stato: in sviluppo
release: beta
aggiornato: 2026-09-24
tag: [prodotto, studenti, ai]
---
# Sapiens AI

Il tutor AI di Sapiens, legato alla lezione che lo studente sta studiando.

## Stato attuale
- `src/app/api/chat/route.ts`: chat in streaming su OpenAI `gpt-4o-mini`, prompt di sistema fisso, risposte fino a 2000 token.
- Solo piani Base e Pro. Pannello laterale nella pagina lezione. Da desktop, dal 24 settembre 2026, non è più una scheda con ombra e quadretti: sta sulla carta come l'indice, con i suggerimenti (Semplifica, Esempio, Approfondisci) in elenco in alto e il campo in basso. Sul telefono il foglio non è cambiato.
- Domande pronte sulla sezione (24 settembre 2026): da desktop, a chat vuota, sotto i suggerimenti c'è il blocco "In questa sezione" con il numero e il titolo della sezione che lo studente sta leggendo e tre domande ("Riassumila in tre punti", "Fammi un altro esempio", "Qual è l'errore più comune?"). Cambiano con lo scroll, seguendo l'indice (`sections` in `src/lib/state/lesson-layout.ts`). Sono composte dal titolo della sezione, senza chiamate al modello; al clic la domanda parte con il titolo della sezione e della lezione come contesto. L'invio vero non è ancora stato provato.
- Il modello non ha il contesto dei progressi dello studente.

## Obiettivo
- Guida lo studente verso la soluzione, non la consegna (vedi [[Principi]]).
- Conosce la lezione aperta, l'esercizio su cui lo studente è bloccato e i suoi punti deboli.
- A pagamento fin dalla [[Release Beta]], anche per coprire i costi.

## Dettagli
- Costo per utente e scelta del provider in [[Provider AI]]. Con dati di studenti delle scuole servono server nell'UE (vedi [[GDPR e minori]]).
- Idea dal vecchio [[TODO]]: una mascotte con personalità diversa per materia (vedi [[Mascotte per materia]]).

## Domande aperte
- Limite di messaggi al giorno per piano?
- Come si misura se l'AI aiuta davvero o fa i compiti al posto dello studente?
