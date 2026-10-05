---
stato: idea
aggiornato: 2026-10-04
tag: [idea, tutor, scuole, ai, privacy]
---
# Aula virtuale

## L'idea
Alessandro, 4 ottobre 2026. Una videochiamata dentro Sapiens, come Google Meet o Discord. Non è un laboratorio e non è un'esperienza virtuale: è una stanza dove ci si vede e ci si parla.

La usano i tutor con i ragazzi per le lezioni online, i docenti con i genitori per i ricevimenti ([[Ricevimenti con i docenti]]) e gli studenti tra loro ([[Peer tutoring nelle scuole]]). Nessuno è obbligato: serve a chi abita lontano o ha venti minuti liberi tra un impegno e l'altro.

Sopra la videochiamata si aggiungono:
- la registrazione dello schermo;
- un riassunto automatico alla fine, che segna dove il ragazzo ha avuto difficoltà;
- per il tutor, un suggerimento sugli esercizi da assegnare, ricavato dalle carenze che il riassunto ha rilevato;
- per il tutor, e senza che lo studente li veda, consigli su come è andata la lezione: un altro modo di spiegare un concetto, o come porsi meglio se a un certo punto ha perso la pazienza;
- una lavagna condivisa dove scrivono tutti e due, per esempio il tutor da un iPad.

Sapiens così sa quante lezioni si fanno davvero. Non serve a farle pagare: il modello resta il [[Pay-per-lead]], e una commissione a lezione spingerebbe tutor e ragazzi a vedersi su Meet o Discord.

## Perché potrebbe valere
- Risponde alla domanda aperta di [[Agenda tutor]]: videochiamata integrata o link esterno.
- Il numero di lezioni fatte alimenta il [[Punteggio di attività dei tutor]] e le ore accumulate del peer tutoring.
- Il riassunto collega la lezione con il tutor agli [[Esercizi]] della biblioteca, cosa che Meet non può fare.

## Dubbi e conflitti
- [[2026-09-06 I tutor pagano il contatto, non le lezioni]] e [[Pay-per-lead]]: registrare ore o prezzi delle lezioni porterebbe Sapiens dentro gli obblighi DAC7. Contare le lezioni senza prezzo e senza incasso è un caso diverso, ma va verificato prima di costruirlo.
- [[GDPR e minori]]: registrare audio e video di un minorenne e farli analizzare da un'AI chiede consenso del genitore, tempi di conservazione e un provider adatto ([[Provider AI]]).
- [[AI Act]]: dedurre che il tutor "ha perso la pazienza" si avvicina al riconoscimento delle emozioni, che il regolamento vieta nei luoghi di lavoro e negli istituti di istruzione. Se una lezione privata con un tutor ci rientra è da verificare. Un consiglio basato su cosa è stato spiegato e su dove lo studente ha sbagliato non ha questo problema.
- [[2026-09-29 Nel laboratorio condiviso niente chat, solo segnali]]: lì si è tolta la chat tra minorenni per il rischio di moderazione. Voce e video tra studenti nel peer tutoring riaprono lo stesso rischio.
- Costo: la trascrizione e il riassunto di un'ora di lezione sono inferenza a ogni uso, contro il principio per cui quello che si può generare una volta non si genera a ogni richiesta ([[Principi]]). Va messo in [[Margini per cliente]].
- Nota tecnica di Claude, 4 ottobre 2026 (da verificare): la videochiamata nel browser si fa con WebRTC; per registrare e per più di due persone serve un servizio che smista i flussi (LiveKit, Cloudflare Realtime, Daily), a pagamento per minuto. La lavagna condivisa può stare sui Durable Objects già scelti per il laboratorio ([[2026-09-29 Il laboratorio condiviso usa Cloudflare Durable Objects, non Supabase Realtime]]).

## Domande aperte
- Chi può aprire una stanza: solo tutor e docenti, o anche gli studenti?
- La registrazione resta a chi, e per quanto tempo?
- La lavagna è la stessa cosa delle note dello [[Zaino]] o un oggetto nuovo?

## Collegamenti
- [[Agenda tutor]], [[Marketplace]], [[Laboratorio condiviso]], [[Registrazione e riassunto delle lezioni in classe]], [[Dettatura e scrittura a mano]]
