---
aggiornato: 2026-09-24
tag: [sessione]
---
# Tentativi degli esercizi

Sessione del 24 settembre 2026 sul punto 5 dell'Agenda, la tabella dei tentativi.

## Cosa si è discusso
Alessandro ha aperto con una notizia: Andrea ha accettato di rileggere i contenuti. Poi il problema dello storico: salvare solo il seed basta a ricostruire l'esercizio finché il generatore non cambia, ma una correzione al generatore cambierebbe in silenzio gli esercizi già fatti. Misurato il peso di un esercizio sui 26 generatori nuovi: 1,0 KB in media, 0,5 KB senza passaggi. Alla fine si è deciso come la pagina sceglie il livello e cosa succede dopo un errore, perché dipendono dalla stessa tabella.

## Decisioni
- [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]
- [[2026-09-24 Ogni tentativo salva l'esercizio intero]]
- [[2026-09-24 Il livello degli esercizi lo sceglie la pagina]]

## Informazioni nuove
- master è in produzione dalla sera del 24 settembre (deploy Vercel `sapiens-mddqk6sjb`); `beta-lotto-1` è già dentro master. La `STRIPE_SECRET_KEY` di produzione ha 302 giorni, quindi è ancora quella del vecchio account, mentre i prezzi puntano al sandbox: il pagamento in produzione non funziona.
- Oggi la pagina degli esercizi riceve `isCorrect` per ogni opzione (`src/lib/server/exercises.ts`), e l'adattatore `src/lib/exercises/v2/legacy.ts` usa un seed casuale che non esce dal server.
- Andrea rilegge con i suoi tempi e manda il parere ad Alessandro. La revisione non si propone come argomento: se ne parla solo se la porta Alessandro. Aggiornata la skill `/sparring`.

## Domande aperte
- Colonne, indici e RLS di `exercise_attempts` sono una proposta in [[Schema dati]]: si confermano quando si scrive la migrazione.
- Risposta aperta: come si salva il testo scritto dallo studente, e il controllo di equivalenza va sul server o nel browser? Oggi le risposte sono solo a scelta multipla.
- Soglia di padronanza: due giuste di fila è un punto di partenza.

## Fatto dopo la discussione
Scritti i tentativi: tabella applicata al database, due API, pagina che chiede un esercizio alla volta e sceglie il livello, soluzione con i passaggi dopo un errore, adattatore vecchio tolto. Provato con un utente di prova sul server di sviluppo, nel formato del telefono. Dettagli in [[Esercizi]] e [[Schema dati]]. Non ancora committato né pubblicato.

## Prossimo argomento
Commit e deploy dei tentativi. Come argomento di discussione, la richiesta a OpenAI: costa poco e ha tempi di risposta che non dipendono da noi.
