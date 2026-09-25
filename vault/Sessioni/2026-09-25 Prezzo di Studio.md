---
aggiornato: 2026-09-25
tag: [sessione]
---
# Prezzo di Studio

Sessione del 25 settembre 2026, seguito di [[2026-09-24 Tentativi degli esercizi]].

## Cosa si è discusso
- Provider AI (punto 2 dell'Agenda): che cosa vuol dire la richiesta a OpenAI, perché non l'API diretta di Anthropic, se usare OpenRouter. Alessandro ha chiesto di riprenderlo a mente fresca: niente di deciso, il punto resta in Agenda.
- Prezzo di Studio (punto 3): prezzi dei concorrenti, netto dopo IVA e Stripe, calendario della beta rispetto all'anno scolastico.

## Decisioni
- [[2026-09-25 Studio costa 9,99 euro al mese o 49,99 fino a giugno]]

## Informazioni nuove
- Prezzi dei concorrenti rilevati il 25 settembre 2026, in [[Concorrenti]].
- Se Studio si vende dentro l'app iOS, Apple trattiene una commissione: domanda aperta in [[Piani e prezzi]].

## Domande aperte
- Vendita di Studio dentro l'app iOS.
- Prezzi di Photomath e Quizlet in euro, dai loro siti.

## Fatto dopo la discussione
Scritti nel codice i piani Free e Studio, il piano fino a giugno come pagamento unico, la prova al contrario di 7 giorni (scelta di Alessandro: al posto della prova di Stripe, come deciso il 23 settembre) e la sessione gratuita giornaliera. Il limite di Sapiens AI è rimandato. Dettagli e prove in [[Piani e prezzi]] ed [[Esercizi]].

Fatti emersi:
- Sull'account i prezzi senza comportamento fiscale ricevono l'IVA in aggiunta (Managed Payments): i vecchi prezzi Lite, Base e Pro avrebbero addebitato €4,99 più IVA. I prezzi di Studio sono IVA inclusa; l'addebito di prova è stato €9,99.
- La pagina di pagamento di Stripe usa hCaptcha: il pagamento non si prova in automatico.
- Nel database ci sono 56 account di prova `@example.com` con il piano `lite`, lasciati da prove di altri agenti.
- Il `.env` locale ora punta a "Sapiens sandbox" (copia del vecchio file nella cartella temporanea della sessione).

## Prossimo argomento
Scrivere i piani nel codice (Studio, piano fino a giugno, sessione gratuita giornaliera per il Free, che ora si può contare dai tentativi). Come argomento di discussione, il diario (punto 4).
