---
stato: bozza
aggiornato: 2026-09-23
tag: [legale, privacy]
---
# GDPR e minori

## Stato attuale
- Privacy, termini e cookie scritti per un servizio per consumatori usato da minori. Banner dei cookie con analytics solo dopo il consenso.
- Sotto i 14 anni l'account lo crea il genitore e lo conferma alla registrazione (in Italia l'età del consenso digitale è 14 anni, art. 2-quinquies del Codice privacy).
- L'accettazione dei documenti legali è registrata in `user_metadata`.

## Aperto (dalla [[ROADMAP]])
- Consenso del genitore più forte: email con link di conferma prima che l'account sia utilizzabile. Necessario prima di raccogliere dallo studente più di nome ed email.
- Esportazione dei dati e cancellazione dell'account in autonomia (artt. 15, 17, 20 GDPR): una sezione "I tuoi dati" con due pulsanti.
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
- Uno studente tra 14 e 17 anni può chiedere un tutor dal suo account, o solo dall'account del genitore (consigliato nella ricerca del 6 settembre)?
