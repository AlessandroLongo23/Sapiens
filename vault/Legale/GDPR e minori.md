---
stato: bozza
aggiornato: 2026-10-07
tag: [legale, privacy]
---
# GDPR e minori

## Stato attuale
- Privacy, termini e cookie scritti per un servizio per consumatori usato da minori. Banner dei cookie con analytics solo dopo il consenso.
- Sotto i 14 anni l'account lo crea il genitore e lo conferma alla registrazione (in Italia l'età del consenso digitale è 14 anni, art. 2-quinquies del Codice privacy).
- L'accettazione dei documenti legali è registrata in `user_metadata`.
- Dal 28 settembre 2026 lo Zaino ha un cestino di 30 giorni ([[2026-09-28 Le note eliminate restano 30 giorni nel cestino]]). Quello che è nel cestino viene cancellato per sempre dopo 30 giorni da un job notturno, e subito quando si cancella l'account, perché note e quaderni sono legati all'utente con `on delete cascade`. L'esportazione dei dati include anche quello che è nel cestino.
- Dal 28 settembre 2026 (nel codice, non ancora pubblicato) lo studente scarica i suoi dati in JSON e cancella l'account da solo, in "Privacy e dati" della pagina account (artt. 15, 17, 20 GDPR). Vedi [[Account e impostazioni]].

## Aperto (dalla [[ROADMAP]])
- Consenso del genitore più forte: email con link di conferma prima che l'account sia utilizzabile. Necessario prima di raccogliere dallo studente più di nome ed email.
- Tabella `legal_acceptances` (utente, documento, versione, data, IP) scritta sul server, e nuova accettazione quando cambiano i termini.

## Marketplace
Dalla [[MARKETPLACE]]: il tutor diventa titolare autonomo del contatto che riceve, con vincoli di uso (solo lezioni, niente marketing, cancellazione se non segue nessuna lezione). Dati minimi. Per i minori ogni richiesta parte dall'account del genitore. Serve una valutazione d'impatto (DPIA) e il registro di ogni contatto rivelato.

## Scuole: tutto cambia
Con la [[Release v4 Scuole]] la scuola è titolare del trattamento e Sapiens responsabile (art. 28 GDPR): serve un contratto di trattamento dati (DPA) con ogni scuola e una DPIA. Vedi [[Contratti con le scuole]].

## Dati sulla salute
Una certificazione DSA, un PDP o un PEI sono dati sulla salute (art. 9 GDPR), la categoria più protetta. Nel prodotto per studenti Sapiens non li raccoglie: gli strumenti DSA sono aperti a tutti e le verifiche escono sempre anche in versione DSA (vedi [[2026-09-23 Strumenti DSA aperti a tutti, senza certificazione]]).

Resta un punto: con il [[Registro elettronico]] questi dati entrano comunque, perché la scuola li gestisce già oggi (PDP, PEI, sostegno). Cifrare i dati è necessario ma non basta: servono anche base giuridica, DPIA, accessi limitati e registrati, contratto con la scuola.

## Dati fuori dall'UE
Oggi la chat usa OpenAI, con server negli Stati Uniti. Per i clienti B2C servono base giuridica, informativa e garanzie sul trasferimento; per le scuole serve quasi certamente un fornitore con server nell'UE. Vedi [[Provider AI]].

## Domande aperte
- In quale regione è il progetto Supabase?
- Dal 7 ottobre 2026 l'[[Onboarding]] chiede anno di corso e argomento in classe, che sono più di nome ed email: si possono chiedere a chi dichiara almeno 14 anni prima del consenso forte del genitore? Da chiedere a un legale.
- Deciso il 7 ottobre 2026: sotto i 14 anni lo studente indica l'email di un genitore, che conferma da un link senza creare un account ([[2026-10-07 Sotto i 14 anni conferma un genitore con un link, senza account]]). Nel codice, non pubblicato. Sostituisce la casella "sono il genitore". Per il legale: quale età vale per un'impresa danese con pubblico italiano, se un minorenne accetta da solo i termini del piano gratuito, se l'email al genitore basta per il Garante.
- Con [[2026-10-07 La conferma dell'email non blocca l'ingresso]] un account può esistere 30 giorni con un indirizzo non verificato, che può essere di un'altra persona: a quell'indirizzo vanno solo il codice e un promemoria. Da scrivere nell'informativa.
- La pagina "chiedi a un genitore" mostra a chi ha il link l'attività di un minorenne ([[2026-10-07 Chiedi a un genitore è un link per pagare senza account]]): quali dati, per quanto tempo.
- Google come fornitore di accesso va aggiunto all'informativa ([[2026-10-07 L'iscrizione ha anche l'accesso con Google]]).
- Uno studente tra 14 e 17 anni può chiedere un tutor dal suo account, o solo dall'account del genitore (consigliato nella ricerca del 6 settembre)?
