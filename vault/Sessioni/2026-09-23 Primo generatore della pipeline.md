---
aggiornato: 2026-09-23
tag: [sessione]
---
# Primo generatore della pipeline

Terza sessione del 23 settembre 2026. Si è ripartiti dal primo punto dell'[[Agenda]]: il prototipo della [[Pipeline esercizi]], scritto nella sessione precedente e mai eseguito.

## Cosa si è fatto
La prima esecuzione ha trovato due difetti: il livello 3 andava in errore su ogni seed, e il verificatore dava PASS lo stesso, perché contava solo i campioni arrivati. Corretti entrambi; il verificatore ora boccia anche un generatore che va in errore, e boccia tutti gli errori piantati apposta per provarlo.

Guardando i campioni con l'occhio di chi insegna, la specifica aveva tre lacune: mancavano le equazioni incomplete, mancavano le radici irrazionali (il caso più frequente nelle verifiche), e il livello 3 alzava due difficoltà insieme. Da qui le decisioni sotto. Il generatore è stato riscritto su sei livelli, con risposte esatte anche irrazionali, e passa la verifica su 6.000 esercizi. È collegato al sito al posto di quello rotto, a scelta multipla, con un esercizio per livello. La pagina di revisione per Andrea è pubblicata come artifact privato: https://claude.ai/artifact/XP1hopEvTp9fResygGbjjn.

## Decisioni
- [[2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro]]
- [[2026-09-23 Radici irrazionali nella beta]]
- [[2026-09-23 I nuovi generatori vanno sul sito subito, a scelta multipla]]
- [[2026-09-23 Ogni generatore passa dalla revisione cronometrata di Andrea]]

## Informazioni nuove
- Esercizi diversi per livello su 1.000 estratti: il livello con a = 1 e radici intere ne ha solo 143, quasi tutti quelli possibili. Per la pratica quotidiana basta; per le simulazioni di verifica andrà allargato.
- La verifica con SymPy di 6.000 esercizi richiede circa 25 secondi.
- Chiusa la domanda della sessione precedente sulle equazioni incomplete: sono il livello 1.

## Domande aperte
- Quanto tempo serve ad Andrea per una revisione. Da quel numero dipende se la pipeline regge i tipi di esercizio della beta.
- Come si sceglie il livello sulla pagina degli esercizi: oggi escono in ordine casuale. Va deciso insieme alla risposta aperta e alla tabella dei tentativi.
- Le domande per Andrea nella specifica: proporzioni dei casi, radici da razionalizzare al livello 4, prodotti da sviluppare al livello 5.

## Stato di git
Niente è committato. Nuovi o modificati in questa sessione: `src/lib/exercises/v2/` (nuovo `surd.ts` e `legacy.ts`, generatore riscritto), `src/lib/exercises/equazioni-secondo-grado-v2.ts`, `src/lib/exercises/index.ts`, `src/lib/exercises/config.ts`, `scripts/exercises/`, `specs/exercises/equazioni-secondo-grado.md`, il vault. Il lavoro di Alessandro sullo Zaino e sulla pagina degli esercizi non è stato toccato.

## Prossimo argomento
Mandare ad Andrea la pagina di revisione, poi la richiesta a OpenAI per la conservazione zero dei dati. Nel frattempo, provare la pagina delle equazioni sul telefono.
