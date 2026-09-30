---
stato: decisa
aggiornato: 2026-09-29
tag: [decisione, laboratori, scuole, multigiocatore]
---
# Il laboratorio condiviso si costruisce insieme al motore

## Decisione
Il [[Laboratorio condiviso]] (una stanza fino a 32 persone, docente compreso, con gruppi e banchi, avatar che si urtano o fantasmi, permessi tra gruppi) fa parte del primo traguardo dei laboratori: si progetta e si costruisce insieme al motore, non dopo.

## Perché
Alessandro, 29 settembre 2026. Claude aveva consigliato di aspettare che il laboratorio in singolo funzionasse, perché la stanza condivisa è un'infrastruttura nuova (un server in tempo reale) per una persona sola che sviluppa. Alessandro ha scelto di farli insieme. Alternativa scartata: dopo il motore.

## Conseguenze
- Il primo traguardo diventa il motore più la stanza condivisa ([[2026-09-29 Il primo traguardo dei laboratori è il motore, in un laboratorio libero senza esperimenti]]).
- Da scegliere l'infrastruttura. Proposta di Claude: una stanza per Cloudflare Durable Object con WebSocket; alternativa Supabase Realtime, da verificare sui limiti di messaggi. Stima: 32 persone a 15 aggiornamenti al secondo fanno circa 480 messaggi in arrivo e 15.000 consegne al secondo per stanza.
- Unità di sincronizzazione proposta: il banco, con una simulazione e un'autorità per banco; gli avatar su un canale leggero a parte.
- Restano da decidere: chi crea una stanza, come si entra (codice della stanza, account), cosa si salva della sessione. Dati degli studenti nella stanza: [[GDPR e minori]].

## Collegamenti
- [[2026-09-29 Laboratori]], [[2026-09-29 Il motore dei laboratori è stato serializzabile cambiato solo da azioni]], [[2026-09-29 Nel laboratorio condiviso niente chat, solo segnali]]
