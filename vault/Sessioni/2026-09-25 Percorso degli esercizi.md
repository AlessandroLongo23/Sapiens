---
aggiornato: 2026-09-25
tag: [sessione]
---
# Percorso degli esercizi

Sessione del 25 settembre 2026, seguito di [[2026-09-25 Prezzo di Studio]].

## Cosa si è discusso
Alessandro ha portato tre cose sugli esercizi: il ritardo tra il clic su una risposta e il verdetto, animazioni sulla soluzione che compare dopo un errore, e il sistema dei livelli. Non gli piaceva che lo studente potesse cambiare livello durante la sessione; ha proposto di scegliere il livello prima di una serie, con lo storico per livello, sul modello dei percorsi di Duolingo e Brilliant.

Claude ha fatto notare che la proposta cambia [[2026-09-24 Il livello degli esercizi lo sceglie la pagina]] e ha chiesto tre cose: se i livelli difficili sono aperti, quando un livello è superato, se i nodi hanno un nome. Alessandro ha scelto la prova di salto (Claude raccomandava tutti i livelli aperti), 8 su 10 e i nomi scritti dalle specifiche.

## Decisioni
- [[2026-09-25 Gli esercizi sono un percorso di livelli]]

## Informazioni nuove
- Il ritardo veniva dal server: a ogni clic 7 chiamate in fila a Supabase (controllo del token, lettura, scrittura, sessione gratuita due volte, storico, esercizio dopo), ognuna di 60-160 ms misurati da qui il 25 settembre 2026.
- Dopo la prima correzione Alessandro sentiva ancora ritardo: restavano la verifica della sessione (il progetto firma i token con una chiave condivisa, quindi anche la verifica locale chiama Supabase Auth), rifatta dal proxy, e lettura più scrittura. Ora il verdetto viaggia sigillato con l'esercizio e la scrittura avviene dopo la risposta: 30-50 ms dal clic.
- In produzione le funzioni Vercel giravano a Washington (`iad1`) e il database sta a Francoforte: `vercel.json` chiede ora `fra1`.
- Il connettore Supabase di claude.ai non ha il permesso di applicare migrazioni su questo progetto; funziona l'API di gestione con `SUPABASE_ACCESS_TOKEN` del `.env`.

## Fatto
Scritti e provati il percorso, la prova di salto, la risposta senza attesa e le animazioni della soluzione. Tabella `exercise_sessions` applicata al database. Dettagli e prove in [[Esercizi]] e [[Schema dati]]. Non ancora committato né pubblicato.

## Domande aperte
- Rilettura dei nomi dei 154 livelli con Andrea (`src/lib/exercises/level-names.ts`).
- Un percorso che attraversa le lezioni di un capitolo, oltre a quello di ogni lezione.
- Le prove lasciate a metà: mostrarle o riprenderle.

## Prossimo argomento
Deploy di questo lavoro insieme ai piani (punto 3 dell'Agenda), poi il diario (punto 4).
