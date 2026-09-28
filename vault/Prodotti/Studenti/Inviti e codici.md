---
stato: in sviluppo
release: beta
aggiornato: 2026-09-28
tag: [prodotto, marketing, piani]
---
# Inviti e codici

Un utente maggiorenne invita gli amici con un link, un creator porta iscritti con il suo codice: chi arriva con un codice ha una prova più lunga. Chi ha invitato ha giorni di Studio gratis; il creator è pagato a parte, per i contenuti che pubblica.

## Stato attuale
Scritto il 28 settembre 2026, non committato né pubblicato. La migrazione è applicata al database di produzione. In giornata le regole sono cambiate dopo una ricerca: vedi [[2026-09-28 Porta un amico solo per i maggiorenni]], [[2026-09-28 I creator si pagano a contenuto, non a provvigione]], [[2026-09-28 L'invito si salva solo dopo Usa l'invito]].

- Database, `supabase/migrations/20260928120000_referrals.sql`: tabelle `referral_codes` (codici `amico` e `creator`; un codice `amico` richiede `declared_adult_at`, vincolo `referral_codes_adult`), `referrals` (il codice con cui è arrivato un account, uno solo, e quando si è attivato), `referral_rewards` (giorni o credito dati a chi ha invitato). Funzione `creator_code_stats()` per i conteggi dei creator. Tutto con row level security e nessuna policy: legge e scrive solo il server.
- Link: aprire `?invito=CODICE` non salva niente. `src/components/shell/InviteOffer.tsx` chiede al server se il codice esiste e mostra "Hai un invito"; con "Usa l'invito" il codice va in un cookie `sapiens_invito` di 3 ore e si apre l'iscrizione, che manda il codice con l'account (`src/components/shell/AuthModal.tsx`). Solo a chi non ha già un account.
- Iscrizione: un trigger su `auth.users` controlla il codice, scrive `app_metadata.trialDays = 14` e salva la riga in `referrals`; un codice inesistente o disattivato non ha effetto e nessun errore blocca l'iscrizione. Il trigger `referral_keep_meta` rimette `trialDays` e `bonus` quando GoTrue riscrive `app_metadata` dalla sua copia (trovato provando).
- Attivazione: quando un account finisce la prima prova (trigger su `exercise_sessions.finished_at`), `referral_activate` lo segna attivato e, se il codice era di un amico, dà a chi l'ha condiviso 30 giorni di Studio in `app_metadata.bonus.until`, dalla fine dello Studio che ha già, oppure €9,99 di credito se è abbonato. Massimo 3 l'anno scolastico. Un errore qui non blocca il salvataggio della risposta.
- Piani: `planOf` ha la fonte `bonus` (dopo abbonamento e piano fino a giugno, prima della prova) e legge `trialDays`. La pagina Abbonamento mostra "Studio con gli inviti".
- `/account/inviti`: chi non ha un codice dichiara di avere almeno 18 anni e lo crea (`/api/inviti`); poi vede il link da copiare o condividere e i conteggi. Nei primi 7 giorni dell'account c'è anche il campo per un codice ricevuto (`/api/inviti/codice`); se arriva dopo la prima prova, i giorni all'amico partono subito. Nei testi niente "premio" né "regalo" (FAQ MIMIT n. 66).
- `/admin/inviti`: crea e disattiva i codici dei creator e mostra per ciascuno iscritti, attivati e paganti; i codici degli amici solo come totali. Nessuna commissione: i creator si pagano a contenuto, a mano.
- Webhook di Stripe: `invoice.created` mette i crediti in attesa sul saldo cliente, così vengono tolti dalla fattura che sta per partire. L'evento è attivo sull'endpoint del sandbox dal 28 settembre.
- Testi: termini ("Inviti"), informativa ("Inviti"), cookie policy (`sapiens_invito`, 3 ore, solo dopo il clic), versioni al 2026-09-28. `beta_metrics()` conta la fine della prova per account.
- Provato sul database di produzione con account `@example.com`, poi cancellati: prova di 14 giorni, codice inesistente ignorato, 30 giorni dalla fine della prova, niente doppio per lo stesso amico, credito per un abbonato, niente oltre il terzo, codice a mano, codice personale rifiutato senza la dichiarazione. Nel browser, su telefono e computer: nessun cookie all'apertura del link, riquadro solo per un codice esistente, cookie di 3 ore dopo "Usa l'invito", dichiarazione e creazione del link. Non provati: una vera iscrizione dal sito (Supabase chiede la conferma dell'email) e un vero credito su una fattura di Stripe.

## Obiettivo
Deciso in [[2026-09-28 Porta un amico premia l'attivazione con 30 giorni di Studio]], [[2026-09-28 Porta un amico solo per i maggiorenni]], [[2026-09-28 Il codice di un creator dà 14 giorni di prova e al creator il 30 per cento per 3 mesi]], [[2026-09-28 I creator si pagano a contenuto, non a provvigione]], [[2026-09-28 L'invito si salva solo dopo Usa l'invito]].

## Domande aperte
- Per un legale danese: la guida del Forbrugerombudsmanden (§3.12) vale per il marketing verso l'Italia? Basta una dichiarazione di maggiore età? L'art. 26 lett. e) del Codice del consumo tocca anche l'invito a una prova gratuita?
- Per un commercialista italiano: come scrivere il contratto con i creator per restare fuori dall'agenzia e dall'Enasarco; da quante collaborazioni una prestazione occasionale diventa abituale.
- Con Stripe in modalità live l'endpoint del webhook deve ricevere anche `invoice.created`.
- Il link usa `PUBLIC_SITE_URL`: con il dominio nuovo cambia da solo.

## Collegamenti
- Attori: [[Studente]], [[Genitore]]
- Release: [[Release Beta]]
- Decisioni: [[2026-09-28 Porta un amico solo per i maggiorenni]], [[2026-09-28 I creator si pagano a contenuto, non a provvigione]], [[2026-09-28 L'invito si salva solo dopo Usa l'invito]]
- [[Piano di acquisizione]], [[Passaparola in classe]], [[Piani e prezzi]], [[Metriche]], [[Società e IVA]]
