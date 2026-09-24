---
stato: in sviluppo
release: beta
aggiornato: 2026-09-23
tag: [prodotto, studenti, ai]
---
# Sapiens AI

Il tutor AI di Sapiens, legato alla lezione che lo studente sta studiando.

## Stato attuale
- `src/app/api/chat/route.ts`: chat in streaming su OpenAI `gpt-4o-mini`, prompt di sistema fisso, risposte fino a 2000 token.
- Solo piani Base e Pro. Pannello laterale nella pagina lezione.
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
