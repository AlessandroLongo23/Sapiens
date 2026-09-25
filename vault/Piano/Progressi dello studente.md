---
stato: bozza
release: beta
aggiornato: 2026-09-25
tag: [piano, studenti, tecnica]
---
# Progressi dello studente

Piano del 25 settembre 2026 per le funzioni costruite sulle prove (`exercise_sessions`) e sui tentativi (`exercise_attempts`): cosa si costruisce per la [[Release Beta]], dove sta nel sito e nell'app, come funziona, in che ordine. Le fasi dopo la beta sono indicate solo per dove si agganciano.

Decisioni alla base:
- [[2026-09-25 Gli esercizi sono un percorso di livelli]]
- [[2026-09-25 La pratica quotidiana entra nella beta]]
- [[2026-09-25 Rifare gli errori vuol dire esercizi nuovi sugli stessi livelli]]
- [[2026-09-25 Oggi è lo schermo iniziale dell'app]]
- [[2026-09-25 Una prova supera un livello solo con almeno 5 domande]]

## Da dove si parte
Il 25 settembre 2026 i tentativi si vedono solo nel percorso della lezione (lavoro dell'altra sessione, non ancora committato: livelli superati, ultime prove, migliore). Le pagine di materia e capitolo sono in cache (ISR, 10 minuti) e non mostrano niente dell'utente. Non esistono serie di giorni, statistiche, errori da rivedere, uno schermo "Oggi" né lavori pianificati (cron). Il risultato di una prova si ricalcola ogni volta dai suoi tentativi: non c'è un segno di "prova finita" né un conteggio per giorno.

## Le funzioni della beta

| # | Funzione | Dove | Dimensione |
|---|---|---|---|
| 1 | Errori alla fine della prova | Riepilogo della prova (`SummarySheet`) | S |
| 2 | Prova da riprendere | Percorso della lezione, e "Oggi" | S |
| 3 | Rifai gli errori, ed elenco degli errori | Riepilogo, "Oggi", pagina `/errori` | M |
| 4 | Progressi nel materiale | Righe delle lezioni e dei capitoli | M |
| 5 | Pratica quotidiana e serie di giorni | "Oggi" | M |
| 6 | Schermo "Oggi" | `/oggi`, schermo iniziale dell'app | M |
| 7 | Metriche della beta | `/admin/metriche` | S-M |

### 1. Errori alla fine della prova
Nel riepilogo, sotto il punteggio, "Rivedi gli errori": per ogni risposta sbagliata la domanda, la risposta data, quella giusta e i passaggi. Tutto è già nella pagina (i verdetti arrivano con le risposte): nessuna richiesta in più. Un bottone "Rifai gli errori" avvia una prova di ripasso (funzione 3).

### 2. Prova da riprendere
Oggi una prova lasciata a metà sparisce. Il percorso mostra "Riprendi (4/10)" sull'ultima prova non finita della lezione, se ha meno di 3 giorni e non ce n'è una più nuova. Si riparte dalla prima domanda senza risposta, con lo stesso esercizio già emesso: il server lo restituisce invece di crearne uno nuovo. Stessa query del percorso, nessuna in più.

### 3. Rifai gli errori
Un errore resta aperto finché lo studente non risponde giusto due volte a quel livello di quel generatore in prove successive a quella dell'errore, entro 30 giorni. Le risposte giuste più avanti nella stessa prova non contano: una prova di livello chiede dieci volte lo stesso livello, e un errore si recupera tornandoci (corretto il 25 settembre 2026 durante la costruzione, dopo averlo visto nelle prove). Due ingressi:
- dal riepilogo: 5 esercizi nuovi ai livelli sbagliati in quella prova;
- da "Oggi": 5 esercizi nuovi sugli errori aperti di tutte le lezioni, dai più recenti.

La prova di ripasso è un nuovo tipo di prova (`review`): non supera né apre livelli. La pagina `/errori` elenca gli errori passati, con la risposta data, quella giusta e i passaggi, dall'esercizio salvato. Leggerla non consuma domande gratuite.

### 4. Progressi nel materiale
Sulle righe delle lezioni, "Livello 3/6", o un segno di spunta quando tutti i livelli sono superati; sulle righe dei capitoli, "2 di 5 lezioni". Le pagine restano in cache: la riga porta il suo percorso nel database, e un componente nel browser chiede i progressi dopo il caricamento, come fa il segno delle note (`LessonNoteButton`). Una sola richiesta per pagina, `GET /api/esercizi/progressi`, con i progressi di tutte le lezioni (oggi 26), calcolati con la stessa `pathState` del percorso. Il segno occupa il posto dell'etichetta "N lezioni", così la pagina non si sposta quando arriva.

### 5. Pratica quotidiana e serie di giorni
Una prova al giorno di 5 domande, nuovo tipo `practice`, tra le lezioni già cominciate. Composizione proposta: fino a 2 domande dagli errori aperti, 1 dal livello a cui lo studente è arrivato nella lezione più recente, le altre da livelli già superati delle lezioni ripassate da più tempo, al massimo 3 lezioni. Mai un livello chiuso. Senza lezioni cominciate, "Oggi" propone la prima lezione.

Serie di giorni (proposta): un giorno conta se lo studente dà almeno 5 risposte, in qualunque prova, nel giorno di Roma. La serie in corso arriva a oggi, o a ieri: in quel caso "Oggi" dice che si può ancora tenere, senza toni colpevolizzanti. Il record non si mostra mai come perso. Niente protezioni della serie in vendita (vedi [[Principi]]).

La pratica consuma la sessione gratuita come ogni altra risposta; per un Free si accorcia a quello che resta del giorno. Basta per la serie, perché 10 risposte al giorno sono più delle 5 che servono.

### 6. Schermo "Oggi"
Pagina `/oggi`, calcolata a ogni richiesta, con le schede in quest'ordine:
1. prova da riprendere (di oggi o di ieri);
2. pratica del giorno, da fare o fatta, con la serie;
3. errori da rivedere, con il numero e il link all'elenco;
4. continua il percorso della lezione più recente;
5. domande gratuite rimaste, oppure "domani ne hai altre", con Studio accanto senza pressione.

Le prove si fanno sulla pagina stessa, con lo stesso lettore di domande della lezione. Nell'app installata "Oggi" diventa lo schermo iniziale (`APP_START`) e la prima scheda della barra in basso; la scheda Materiale punta alla pagina di Matematica, che era lo schermo iniziale. Chi non ha un account vede l'invito a crearne uno. La grafica si rifinisce con Dario.

### 7. Metriche della beta
Pagina `/admin/metriche`, già protetta: iscritti per settimana, attivazione (prima prova finita entro 7 giorni), ritorno alla quarta settimana (risposte tra il 21° e il 27° giorno), passaggio dalla prova al pagamento. Solo numeri per gruppi di iscritti, mai il singolo studente. Esclude gli account admin e quelli di prova `@example.com`. Per il passaggio al pagamento il webhook di Stripe deve segnare la data del primo pagamento, che oggi non resta (vedi [[Metriche]]).

## Come, sotto
Una migrazione prima di tutto:
- `exercise_sessions` accetta i tipi `practice` e `review`, con la lezione e il generatore di ogni domanda (`plan_lessons`, `plan_generators`, accanto a `plan` con i livelli);
- ogni prova tiene `answered`, `correct`, `finished_at` e il giorno di Roma;
- una tabella `exercise_days` con le risposte e quelle giuste per studente e per giorno;
- un trigger aggiorna i conteggi quando un tentativo riceve la risposta. La risposta allo studente non rallenta, perché il salvataggio avviene già dopo il verdetto;
- al più una pratica al giorno per studente, anche con due schede aperte;
- i dati di oggi ricalcolati una volta per i tentativi già salvati.

Nel codice:
- il ciclo delle domande esce da `ExerciseRunner` in un componente riusabile (`RunPlayer`), usato dal percorso e da "Oggi";
- la logica pura va in moduli piccoli e provabili: `levels.ts` (la lunghezza minima di 5), `review.ts` (errori aperti, piano del ripasso), `practice.ts` (piano della pratica, schede di "Oggi"), `streak.ts` (serie di giorni);
- le API restano quelle di oggi: `POST /api/esercizi` accetta anche `{kind: 'practice'}` e `{kind: 'review'}`, più `GET /api/esercizi/progressi`;
- il conteggio della sessione gratuita legge la riga del giorno in `exercise_days`, che calcola bene anche le due notti del cambio d'ora.

## Ordine di costruzione
Dipende dal lavoro sul percorso dei livelli, che va committato prima.
1. Migrazione, trigger e ricalcolo (S)
2. Server: tipi di prova, lunghezza minima di 5, conteggio gratuito dalla riga del giorno (S)
3. `RunPlayer` estratto da `ExerciseRunner` (M)
4. Errori alla fine della prova (S)
5. Prova da riprendere (S)
6. Rifai gli errori ed elenco degli errori (M)
7. Progressi nel materiale (M)
8. Serie di giorni e pratica quotidiana (M)
9. "Oggi", barra in basso e schermo iniziale (M)
10. Metriche e data del primo pagamento (S-M)

Stima: 3-4 settimane di lavoro con gli LLM, cioè entro fine ottobre 2026 se si lavora solo su questo.

## Rischi
- Se il salvataggio di una risposta fallisce, serie e conteggi perdono quella risposta. Oggi l'errore si registra nei log; più avanti un controllo notturno che ricalcola.
- I segni sulle pagine in cache devono avere il loro spazio già riservato, o la pagina salta.
- "Oggi" come schermo iniziale deve funzionare anche senza account.
- Le metriche riguardano minorenni: solo aggregati.

## Come si prova
- Il repository ha solo Playwright. Per la logica pura (livelli, ripasso, pratica, serie, schede di "Oggi") un runner leggero come `node --test`, con i casi del cambio d'ora e dei giorni saltati.
- Sul database: il trigger scatta una volta per risposta; i conteggi ricalcolati coincidono con quelli di oggi; una sola pratica al giorno.
- Nel browser, con account di prova poi cancellati:
  - gli errori compaiono nel riepilogo con la soluzione;
  - un ripasso non ripete mai un esercizio;
  - dopo una prova il segno del capitolo cambia senza ricaricare;
  - ricaricando a metà prova si riparte dalla stessa domanda;
  - la pratica ha 5 domande e mai un livello chiuso;
  - l'app installata si apre su "Oggi", con e senza account.
- Il formato del telefono si controlla con `screenshots:mobile`.

## Dopo la beta, dove si agganciano
- **[[Adesivi]] come premi:** una tabella dei premi alimentata dallo stesso trigger (livello superato, capitolo completato, soglie della serie). Gli adesivi non si comprano e non scadono.
- **[[Area genitori]], resoconto settimanale:** serve un collegamento genitore-figlio con il consenso, poi legge `exercise_days` e le prove.
- **Ripasso a intervalli (FSRS):** una tabella della memoria per studente, generatore e livello, aggiornata dal trigger; alimenta il piano della pratica. Vedi [[Ripasso pianificato prima di una verifica]].
- **Ripasso prima di una verifica:** le verifiche del [[Diario e calendario]], con lezioni e data, alimentano il piano del ripasso.
- **[[Flashcard]]:** i progressi delle carte oggi non si salvano; quando si salveranno, entrano nella serie e in "Oggi".

## Domande aperte
- Regole proposte e non ancora discusse: quando un errore è chiuso (due risposte giuste in prove successive, entro 30 giorni), composizione della pratica, soglia della serie (5 risposte al giorno).
- Onboarding su classe e indirizzo, legato a "Oggi" (vedi [[Agenda]]).
- Un percorso che attraversa le lezioni di un capitolo.
