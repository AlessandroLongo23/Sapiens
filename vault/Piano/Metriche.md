---
stato: bozza
aggiornato: 2026-09-26
tag: [piano]
---
# Metriche

## Release Beta
Proposta del 23 settembre 2026, ipotesi da rivedere dopo il primo mese:
- **Principale:** 100 famiglie paganti entro il 30 giugno 2027. Dice se qualcuno paga, cioè se il prodotto vale.
- **Anticipatrice:** almeno il 30% degli iscritti torna alla quarta settimana. Si vede prima dei ricavi e dice se l'abitudine di studio funziona (vedi [[Pratica quotidiana]]).
- **Di contorno:** clic mensili da Google su Search Console, la base di tutto il resto (vedi [[SEO]]).

## Da misurare fin dal primo giorno
Senza interviste (vedi [[2026-09-23 Niente interviste, il prodotto nasce dall'esperienza diretta]]) la beta è l'unica verifica delle ipotesi: questa lista è un requisito del lancio, non un extra.
- Iscrizioni, attivazioni (primo esercizio fatto), ritorni settimanali.
- Conversione da prova gratuita a pagamento.
- Disdette e motivo.
- Costo dell'AI per utente pagante.
- Motivo della disdetta, chiesto al momento della disdetta.
- Commenti lasciati dentro l'app.

## Stato attuale
Dal 26 settembre 2026 la pagina `/admin/metriche` (solo admin) mostra, per settimana di iscrizione in ora di Roma: iscritti, attivati (una prova finita entro 7 giorni), passaggio al pagamento (chi ha pagato almeno una volta, su chi ha finito la settimana gratuita) e ritorno alla quarta settimana (risposte tra il 21° e il 27° giorno, su chi si è iscritto da almeno 28 giorni). Esclude gli account admin e quelli di prova `@example.com`; solo conteggi, nessun dato del singolo studente. I numeri vengono dalla funzione `beta_metrics()` (migrazione `20260926140000_beta_metrics.sql`, applicata), che può chiamare solo il server. Il webhook di Stripe segna `firstPaidAt` in `app_metadata` al primo pagamento, dal 26 settembre 2026: i pagamenti di prima non sono contati. Mancano ancora disdette e motivo, costo dell'AI, commenti dentro l'app. Funzione 7 di [[Progressi dello studente]].

## Domande aperte
- Strumento di analisi del prodotto oltre a Vercel Analytics? Con il consenso, e rispettando i minori.
