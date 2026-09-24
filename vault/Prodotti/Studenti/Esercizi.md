---
stato: in sviluppo
release: beta
aggiornato: 2026-09-24
tag: [prodotto, studenti, contenuti]
---
# Esercizi

Esercizi con correzione immediata, collegati alle lezioni, con i progressi salvati.

## Stato attuale
- 15 generatori in `src/lib/exercises/` (insiemi, numeri naturali e razionali, monomi, equazioni di primo e secondo grado): a ogni richiesta il server costruisce un esercizio nuovo da un template.
- Dal 24 settembre 2026 ogni tentativo è salvato in `exercise_attempts` con l'esercizio intero (vedi [[2026-09-24 Ogni tentativo salva l'esercizio intero]]). Il server scrive la riga quando manda l'esercizio (`POST /api/esercizi`) e corregge la risposta confrontandola con la riga (`POST /api/esercizi/[id]`), che restituisce anche l'esercizio dopo. L'esito giusto non arriva più nella pagina. Codice in `src/lib/server/exercises.ts`.
- Sessione di 10 domande (`SESSION_LENGTH` in `src/lib/exercises/config.ts`), solo a scelta multipla. La pagina parte dal primo livello non padroneggiato e sale dopo due risposte giuste di fila a quel livello (`src/lib/exercises/levels.ts`); una fila di tasti "Livello" permette di saltare. Una risposta giusta passa alla domanda dopo da sola; dopo un errore restano sullo schermo la risposta giusta, i passaggi e la soluzione, fino a "Continua". Vedi [[2026-09-24 Il livello degli esercizi lo sceglie la pagina]].
- Tempo attivo misurato nel browser, senza il tempo con la scheda nascosta. Colonna `build` dal commit del deploy (`VERCEL_GIT_COMMIT_SHA`; che Vercel la esponga in esecuzione è da verificare).
- Provato il 24 settembre 2026 con un utente di prova, poi cancellato: riga scritta alla consegna, verdetto, salita di livello, salto di livello, nessuna risposta giusta nella pagina o nelle risposte dell'API, lo studente non può scrivere le righe. Tutti i 138.035 passaggi dei 26 generatori passano da KaTeX.
- Riservati ai piani a pagamento (Lite e superiori), controllo sul server anche nelle due API.
- Punti deboli, ripasso e report non esistono ancora: i dati ci sono, le schermate no.
- Analisi del 23 settembre 2026, con ogni generatore eseguito 200 volte: 6 moduli su 15 falliscono sempre, comprese le equazioni di primo e secondo grado. Un solo generatore rotto fa mostrare "in arrivo" a tutta la lezione. Il generatore delle equazioni di secondo grado ha anche la risposta sbagliata segnata come giusta.
- Dal 24 settembre 2026 la sessione va dal livello più facile al più difficile: le domande si mescolano solo dentro lo stesso livello (`generateExercises` in `src/lib/server/exercises.ts`). Il livello non è mostrato allo studente. Quante domande per livello lo decide `count` in `config.ts`, oggi 1.
- Dal 24 settembre 2026 anche le 8 lezioni del secondo lotto hanno i loro generatori: 26 lezioni con esercizi. Tutte le 18 lezioni del primo lotto hanno esercizi dai generatori nuovi della [[Pipeline esercizi]]. Dal 24 settembre 2026 la pagina legge i campioni dei generatori direttamente: l'adattatore `legacy.ts` e i file `*-v2.ts` sono stati tolti. `config.ts` dice per ogni lezione il generatore e i livelli offerti, `index.ts` carica i generatori; i vecchi generatori restano nella cartella ma non sono più collegati. Corretta anche una chiave sbagliata (la lezione sulla conversione non trovava i suoi esercizi).
- Dal 23 settembre 2026 le equazioni di secondo grado usano il nuovo generatore della [[Pipeline esercizi]] (sei livelli, radici razionali e irrazionali esatte, verificato su 6.000 esercizi), tramite un adattatore che lo presenta nel formato a scelta multipla di oggi: `src/lib/exercises/equazioni-secondo-grado-v2.ts`, `src/lib/exercises/v2/legacy.ts`. Il vecchio `equazioni-secondo-grado.js` resta nella repo come riferimento, non è più collegato. Dal 24 settembre 2026 anche le equazioni di primo grado usano il generatore nuovo (`src/lib/exercises/equazioni-primo-grado-v2.ts`). Restano rotti 4 generatori.
- Registrazione in due tabelle (`index.ts`, `config.ts`), classi che generano nel costruttore, `Math.random` senza seed, nessun livello, risposte salvate come stringhe LaTeX. File JavaScript e TypeScript mescolati.

## Obiettivo
- Esercizi per tutti gli argomenti della [[Release Beta]], prodotti dalla [[Pipeline esercizi]].
- Risposta aperta oltre alla multipla: un numero o un'espressione, con controllo di equivalenza nel browser.
- Progressi salvati per utente: esercizi fatti, errori, argomenti deboli. È la base della [[Pratica quotidiana]] e il messaggio principale contro ChatGPT (vedi [[2026-09-23 Pratica con progressi come messaggio principale]]).
- Livelli di difficoltà per ogni tipo di esercizio, nell'ordine del libro, ognuno con una sola difficoltà in più (vedi [[2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro]]).
- La pagina parte dal primo livello non ancora padroneggiato e sale dopo due risposte giuste di fila; lo studente può saltare a un livello a mano. Dopo un errore mostra la soluzione e poi un esercizio nuovo dello stesso livello. Vedi [[2026-09-24 Il livello degli esercizi lo sceglie la pagina]].
- Risposte esatte anche irrazionali, come (3 ± √5)/2 (vedi [[2026-09-23 Radici irrazionali nella beta]]).

## Dettagli
- Due fonti: generatori (esercizi infiniti, costo zero a ogni uso) e banca statica per i problemi non parametrizzabili. Mai generazione con l'AI al momento della richiesta.
- Progressi: si salva ogni tentativo (utente, generatore, livello, seed, risposta, esito, tempo). Vedi [[2026-09-23 Progressi salvati per ogni tentativo]]. Ogni tentativo salva anche l'esercizio intero, scritto quando il server lo mostra e corretto sul server alla risposta: vedi [[2026-09-24 Ogni tentativo salva l'esercizio intero]]. Sostituisce la `practice_sessions` della [[ROADMAP]].

## Domande aperte
- Svolgimento passo passo: si mostra la soluzione completa, un suggerimento alla volta, o si passa a [[Sapiens AI]]?
- Esercizi a fine capitolo e simulazioni di verifica: nella beta o dopo?
- Esercizi gratuiti di assaggio nel piano Free per convertire?

## Collegamenti
- [[Pipeline esercizi]], [[Pratica quotidiana]], [[Schema dati]]
- [[2026-09-23 Esercizi da generatori scritti dall'AI]]
