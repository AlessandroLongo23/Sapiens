---
stato: decisa
aggiornato: 2026-10-07
tag: [decisione, prodotto, onboarding, privacy]
---
# La conferma dell'email non blocca l'ingresso

## Decisione
Chi si iscrive entra subito. L'email si conferma dopo, con un codice di 6 cifre scritto nel sito, e la conferma è richiesta solo per quello che dipende dall'identità: pagare, far contare un invito per chi ha invitato, creare un proprio codice di invito, scrivere a un tutor. Un account mai confermato si cancella dopo 30 giorni.

## Perché
Alessandro ha chiesto il 7 ottobre 2026 cosa succede se lo studente non conferma mai, e se la conferma diventa un cancello per altre funzioni. Proposta di Claude, accettata.
- Oggi la conferma è un muro all'ingresso: lo studente esce dal sito per aprire la posta prima di aver visto qualcosa.
- Senza nessuna conferma i rischi sono quattro: indirizzo sbagliato (password non recuperabile, ricevute a un altro), iscrizione con l'email di un'altra persona, prove di 7 giorni ripetute con indirizzi inventati, account finti per guadagnare giorni con gli inviti (il tetto di 3 l'anno limita il danno).
- Nessuno di questi rischi riguarda lo studio, quindi lezioni, prove, Diario, Zaino e i 7 giorni di Studio restano aperti.
- Il codice al posto del link funziona anche quando la posta è sul telefono e il sito sul computer.

Scartati: il cancello anche alla fine della prova (più abbandoni proprio quando scade Studio) e il codice di 6 cifre prima di entrare (resta un muro, anche se più basso).

## Conseguenze
- A un indirizzo non confermato arrivano solo l'email con il codice e un promemoria.
- Da verificare sulla documentazione di Supabase prima di scrivere codice: con "Confirm email" spento ogni utente risulta confermato, quindi lo stato va tenuto in `app_metadata`, scritto dal server, e l'email la manda Sapiens.
- `referral_activate` deve contare l'invito solo se l'account che ha finito la prova ha l'email confermata.
- Un job cancella gli account non confermati dopo 30 giorni; termini e informativa lo devono dire.
- Aggiornate [[Onboarding]], [[Account e impostazioni]], [[Inviti e codici]], [[GDPR e minori]].

## Collegamenti
- [[Onboarding]], [[Inviti e codici]], [[GDPR e minori]], [[2026-10-07 Onboarding]]
