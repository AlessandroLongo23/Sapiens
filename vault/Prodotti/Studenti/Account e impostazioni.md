---
stato: in sviluppo
release: beta
aggiornato: 2026-09-28
tag: [prodotto, studenti, privacy]
---
# Account e impostazioni

La pagina dove lo studente vede i suoi dati, sceglie come si presenta Sapiens, gestisce l'abbonamento e può scaricare o cancellare tutto.

## Stato attuale
Dal 28 settembre 2026, su richiesta di Alessandro. Nel codice, non ancora pubblicato.

- Nell'intestazione del sito, al posto dei pulsanti "Dashboard" (o "Account") ed "Esci", c'è l'avatar dello studente: la foto di Google se un giorno ci sarà l'accesso con Google, altrimenti le iniziali. Apre un menu con nome ed email, "Il tuo account", "Abbonamento", "Richieste ai tutor" ed "Esci"; "Dashboard" compare solo per lo staff (`app_metadata.role = 'admin'`). File `src/components/shell/AccountMenu.tsx`.
- `/account` ha le sezioni a sinistra (sul telefono una riga che scorre di lato) e la sezione scelta a destra, sotto un'intestazione con avatar, nome ed email (`src/app/(site)/(account)/account/`, componenti in `src/components/account/`):
  - Profilo (`/account`): nome e cognome modificabili (`user_metadata`), email, data di iscrizione e ultimo accesso.
  - Accesso e sicurezza (`/account/accesso`): cambio email (Supabase manda un link a entrambi gli indirizzi, perché il cambio sicuro è attivo nel progetto), cambio password con la password attuale, "Esci ovunque" (chiude tutte le sessioni).
  - Preferenze (`/account/preferenze`): tema Chiaro, Scuro o Automatico (segue il dispositivo, prima non si poteva tornare a questa scelta); nello Zaino il modo di scrivere (Semplice o Avanzata) e la vista delle note (griglia o elenco). Valgono per il dispositivo, perché sono in `localStorage`.
  - Abbonamento (`/account/abbonamento`): il pannello che prima era `/subscription` (piano, portale Stripe, piani) e l'uso dello Zaino rispetto ai limiti del piano Free. `/subscription` rimanda qui, e il portale Stripe torna qui.
  - Privacy e dati (`/account/dati`): documenti accettati con versione e data (da `user_metadata.legal`), età dichiarata, scelta dei cookie, "Scarica" (un file JSON con account e righe di tutte le tabelle dello studente, `GET /api/account/export`), "Elimina l'account" (`POST /api/account/delete`, con l'email riscritta per conferma).
- L'eliminazione chiude subito l'eventuale abbonamento Stripe, senza rimborso; se Stripe non risponde, l'account non viene cancellato. Poi cancella l'utente: tutte le tabelle vanno in cascata, tranne il profilo tutor, che resta senza proprietario (`src/lib/server/account.ts`).
- Provato il 28 settembre con un utente creato apposta e poi cancellato dalla pagina stessa: cambio nome, password sbagliata e giusta, tema, esportazione, eliminazione.

## Obiettivo
Da discutere. Vedi le domande aperte.

## Dettagli
- Tema e preferenze dello Zaino restano per dispositivo, come prima: chi usa il telefono e il computer può avere scelte diverse.
- L'export non contiene gli identificativi di pagamento: le ricevute sono di Stripe e arrivano per email.

## Domande aperte
- Le preferenze vanno salvate sull'account (in `user_metadata` o in una tabella) per ritrovarle su ogni dispositivo?
- Quali altre impostazioni servono? Idee non discusse: anno e indirizzo di studio (per proporre il materiale giusto), carta predefinita delle note nuove, promemoria e notifiche del Diario, font e spaziatura per la dislessia (previsti in [[Strumenti DSA]] "dal profilo", per la v1.0), preferenze di Sapiens AI.
- Il profilo tutor di chi cancella l'account va cancellato anche lui, o nascosto?
- Serve un periodo di ripensamento prima della cancellazione definitiva (per esempio 30 giorni)?
- Sotto i 14 anni l'account lo crea il genitore: la cancellazione e l'export li fa lo studente o il genitore? Vedi [[GDPR e minori]].

## Collegamenti
- Attori: [[Studente]]
- Release: [[Release Beta]]
- Decisioni: nessuna ancora
