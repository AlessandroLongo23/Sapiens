---
stato: in sviluppo
release: beta
aggiornato: 2026-09-23
tag: [prodotto, studenti, contenuti]
---
# Esercizi

Esercizi con correzione immediata, collegati alle lezioni, con i progressi salvati.

## Stato attuale
- 15 generatori in `src/lib/exercises/` (insiemi, numeri naturali e razionali, monomi, equazioni di primo e secondo grado): a ogni richiesta il server costruisce un esercizio nuovo da un template.
- Solo risposta multipla, correzione immediata, barra di avanzamento della sessione.
- Niente viene salvato: nessuno storico, nessun punto debole.
- Riservati ai piani a pagamento (Lite e superiori), controllo sul server. L'esito giusto però arriva nella pagina, perché la correzione avviene nel browser.
- Analisi del 23 settembre 2026, con ogni generatore eseguito 200 volte: 6 moduli su 15 falliscono sempre, comprese le equazioni di primo e secondo grado. Un solo generatore rotto fa mostrare "in arrivo" a tutta la lezione. Il generatore delle equazioni di secondo grado ha anche la risposta sbagliata segnata come giusta.
- Dal 24 settembre 2026 la sessione va dal livello più facile al più difficile: le domande si mescolano solo dentro lo stesso livello (`generateExercises` in `src/lib/server/exercises.ts`). Il livello non è mostrato allo studente. Quante domande per livello lo decide `count` in `config.ts`, oggi 1.
- Dal 24 settembre 2026 anche le 8 lezioni del secondo lotto hanno i loro generatori: 26 lezioni con esercizi. Tutte le 18 lezioni del primo lotto hanno esercizi dai generatori nuovi della [[Pipeline esercizi]], un esercizio per livello, a scelta multipla attraverso l'adattatore `src/lib/exercises/v2/legacy.ts`. Configurazione in `src/lib/exercises/config.ts` e `index.ts`, rigenerate per le 18 lezioni; i vecchi generatori restano nella cartella ma non sono più collegati. Corretta anche una chiave sbagliata (la lezione sulla conversione non trovava i suoi esercizi).
- Dal 23 settembre 2026 le equazioni di secondo grado usano il nuovo generatore della [[Pipeline esercizi]] (sei livelli, radici razionali e irrazionali esatte, verificato su 6.000 esercizi), tramite un adattatore che lo presenta nel formato a scelta multipla di oggi: `src/lib/exercises/equazioni-secondo-grado-v2.ts`, `src/lib/exercises/v2/legacy.ts`. Il vecchio `equazioni-secondo-grado.js` resta nella repo come riferimento, non è più collegato. Dal 24 settembre 2026 anche le equazioni di primo grado usano il generatore nuovo (`src/lib/exercises/equazioni-primo-grado-v2.ts`). Restano rotti 4 generatori.
- Registrazione in due tabelle (`index.ts`, `config.ts`), classi che generano nel costruttore, `Math.random` senza seed, nessun livello, risposte salvate come stringhe LaTeX. File JavaScript e TypeScript mescolati.

## Obiettivo
- Esercizi per tutti gli argomenti della [[Release Beta]], prodotti dalla [[Pipeline esercizi]].
- Risposta aperta oltre alla multipla: un numero o un'espressione, con controllo di equivalenza nel browser.
- Progressi salvati per utente: esercizi fatti, errori, argomenti deboli. È la base della [[Pratica quotidiana]] e il messaggio principale contro ChatGPT (vedi [[2026-09-23 Pratica con progressi come messaggio principale]]).
- Livelli di difficoltà per ogni tipo di esercizio, nell'ordine del libro, ognuno con una sola difficoltà in più (vedi [[2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro]]).
- Risposte esatte anche irrazionali, come (3 ± √5)/2 (vedi [[2026-09-23 Radici irrazionali nella beta]]).

## Dettagli
- Due fonti: generatori (esercizi infiniti, costo zero a ogni uso) e banca statica per i problemi non parametrizzabili. Mai generazione con l'AI al momento della richiesta.
- Progressi: si salva ogni tentativo (utente, generatore, livello, seed, risposta, esito, tempo). Vedi [[2026-09-23 Progressi salvati per ogni tentativo]]. Sostituisce la `practice_sessions` della [[ROADMAP]].

## Domande aperte
- Svolgimento passo passo: si mostra la soluzione completa, un suggerimento alla volta, o si passa a [[Sapiens AI]]?
- Esercizi a fine capitolo e simulazioni di verifica: nella beta o dopo?
- Esercizi gratuiti di assaggio nel piano Free per convertire?
- Come si sceglie il livello sulla pagina? Oggi c'è un esercizio per livello, in ordine casuale.

## Collegamenti
- [[Pipeline esercizi]], [[Pratica quotidiana]], [[Schema dati]]
- [[2026-09-23 Esercizi da generatori scritti dall'AI]]
