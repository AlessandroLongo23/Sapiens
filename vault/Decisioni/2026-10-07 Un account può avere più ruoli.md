---
stato: decisa
aggiornato: 2026-10-07
tag: [decisione, tecnica, onboarding]
---
# Un account può avere più ruoli

## Decisione
Lo stesso account, con una sola email, può essere insieme studente, tutor, genitore e docente, e passa da un'area all'altra con un interruttore. I ruoli stanno in una tabella dei profili scritta dal server.

## Perché
Proposta di Claude, scelta da Alessandro il 7 ottobre 2026.
- I casi sono comuni: uno studente universitario che fa il tutor, un docente che è anche genitore.
- È già così di fatto per i tutor, che hanno una riga in `tutors` accanto all'account.
- Il ruolo non può stare in `user_metadata`, che l'utente riscrive dal browser.
- Cambiare dopo da un ruolo a più ruoli costa una migrazione su tutti gli account.

Scartato: un ruolo per account, con due email per chi ha due ruoli.

## Conseguenze
- Una migrazione nuova per profili e ruoli; nella stessa tabella va l'anno di corso ([[2026-10-07 L'onboarding chiede anno e argomento in classe]]). Da scrivere in [[Schema dati]] quando si progetta.
- Risponde in parte alla domanda aperta di [[Account e impostazioni]] su dove salvare le preferenze.
- Aggiornate [[Onboarding]], [[Account e impostazioni]].

## Collegamenti
- [[Onboarding]], [[Schema dati]], [[2026-10-07 L'onboarding comincia da Chi sei, con una porta per ruolo]], [[2026-10-07 Onboarding]]
