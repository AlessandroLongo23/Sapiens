---
stato: decisa
aggiornato: 2026-10-07
tag: [decisione, legale, privacy, onboarding]
---
# Sotto i 14 anni conferma un genitore con un link, senza account

## Decisione
L'iscrizione chiede l'età con due opzioni, "meno di 14 anni" e "14 anni o più", prima di dire cosa comporta la risposta. Chi ha 14 anni o più entra senza altri passaggi. Chi ne ha meno scrive l'email di un genitore, che conferma aprendo un link: non crea un account e non sceglie una password. Fino alla conferma lo studente legge le lezioni pubbliche e l'account non parte.

## Perché
Alessandro ha proposto il 7 ottobre 2026 la scelta a due opzioni, chiedendo il minimo attrito che la legge consente: una casella sola, se basta. Risposta di Claude, accettata.
- L'art. 8 del GDPR chiede di "adoperarsi in ogni modo ragionevole per verificare" che il consenso venga da chi ha la responsabilità genitoriale. Le Linee guida 5/2020 dell'EDPB sul consenso (4 maggio 2020) indicano l'email al genitore come verifica sufficiente nei casi a basso rischio. Una casella spuntata dallo studente sta sotto quell'esempio.
- Il link senza account è il passaggio più corto che resta sopra quell'esempio.
- A gennaio, al lancio della beta, sotto i 14 anni ci sono solo gli anticipatari di prima. A settembre circa un terzo delle prime ha ancora 13 anni (stima di Claude dal calendario delle nascite, da verificare).
- L'art. 8 riguarda i trattamenti basati sul consenso. Anno e argomento servono a dare il servizio, quindi la base è il contratto: lettura di Claude, da confermare con un legale.

Scartati: la sola casella "sono il genitore" (quella di oggi) e l'account del genitore come condizione.

## Conseguenze
- Sostituisce la casella sull'età di `src/components/shell/AuthModal.tsx`.
- Da chiedere a un legale, in [[Consulenze IDA]]: quale età vale per un'impresa danese con pubblico italiano (14 in Italia, 15 in Danimarca dal 2024, da verificare); se un minorenne accetta da solo i termini del piano gratuito; se l'email al genitore basta per il Garante.
- Aggiornate [[Onboarding]], [[GDPR e minori]].

## Collegamenti
- [[Onboarding]], [[GDPR e minori]], [[2026-10-07 La conferma dell'email non blocca l'ingresso]], [[2026-10-07 Onboarding]]
