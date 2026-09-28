---
stato: decisa
aggiornato: 2026-09-28
tag: [decisione, legale, privacy]
---
# L'invito si salva solo dopo "Usa l'invito"

## Decisione
Aprire un link di invito non salva niente nel browser. Se il codice esiste, compare un riquadro "Hai un invito" con "Usa l'invito" e "No, grazie". Solo dopo "Usa l'invito" il codice si salva in un cookie di 3 ore, e si apre il modulo di iscrizione. Chi torna giorni dopo senza il link perde l'invito, e può inserire il codice a mano nei primi 7 giorni dall'iscrizione.

## Perché
Ricerca del 28 settembre 2026, proposta di Claude accettata da Alessandro.
- La direttiva ePrivacy non ha sportello unico (parere EDPB 5/2019): valgono sia la legge danese (cookiebekendtgørelsen, vigilanza di Digitaliseringsstyrelsen) sia, per il pubblico italiano, le linee guida del Garante del 10 giugno 2021.
- WP29, parere 04/2012 (WP194): sono esenti dal consenso i cookie scritti dopo un'azione dell'utente e che durano poco; i cookie di affiliazione non lo sono. Un cookie di 30 giorni scritto all'apertura del link, che serve anche ad accreditare chi ha invitato, non era con sicurezza un cookie tecnico.
- Le linee guida EDPB 2/2023 (versione 2, 7 ottobre 2024) mettono sotto la stessa regola localStorage, sessionStorage e i link con un identificatore: cambiare contenitore non basta, conta l'azione dell'utente.

Scartata: il cookie di 30 giorni sotto consenso nel banner.

## Conseguenze
- Nel codice: `src/components/shell/InviteOffer.tsx`; il proxy non scrive più cookie. Cookie policy aggiornata. Vedi [[Inviti e codici]].

## Collegamenti
- [[Inviti e codici]], [[GDPR e minori]]
