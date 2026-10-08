---
stato: decisa
aggiornato: 2026-10-07
tag: [decisione, prodotto, onboarding]
---
# L'onboarding chiede le materie e un argomento per materia

## Decisione
Dopo l'anno lo studente sceglie le materie che studia con Sapiens, a scelta multipla tra matematica, fisica, chimica e informatica. Poi, una schermata per ogni materia scelta, dice l'argomento che sta facendo in classe; ogni schermata si può saltare. Se ha compilato più di una materia sceglie lui da quale partire, toccando un quaderno. Le materie che per il suo anno non hanno ancora lezioni restano visibili, segnate "in arrivo": si possono scegliere come interesse, senza argomento.

## Perché
Alessandro, il 7 ottobre 2026, vedendo che il percorso chiedeva solo l'argomento di matematica: "dovrebbe prima chiedere quali materie mi interessano, e poi chiedere l'argomento corrente solo di quelle". Ha chiesto di ragionare sul flusso prima di disegnare le schermate.

- La domanda sulla sola matematica l'aveva ristretta Claude partendo da [[2026-09-23 Beta a pagamento a gennaio 2027 con la sola matematica]], che però dice cosa si vende, non cosa c'è. Le lezioni con esercizi, contate il 7 ottobre 2026 su `src/lib/exercises/config.ts`: matematica 129, fisica 119, chimica 78, informatica 64, quasi tutte tra la prima e la terza.
- Il traguardo è una prova sull'argomento che lo studente sta facendo a scuola ([[2026-10-07 L'onboarding porta lo studente a finire una prova nella prima sessione]]): la materia fa parte della domanda. Chi ha la verifica di fisica non va portato a un argomento di matematica.
- L'anno viene prima delle materie perché decide quali materie hanno qualcosa da offrire.
- Un argomento per ogni materia serve dal giorno dopo: il Diario e la pratica quotidiana possono proporre qualcosa per ciascuna.

Scelte di Alessandro tra le alternative proposte da Claude: una schermata per ogni materia (Claude consigliava una schermata sola con tutte le materie, per tenere corto il percorso); la partenza scelta dallo studente; le materie senza lezioni visibili come "in arrivo". Scartati: l'argomento solo per la materia da cui si comincia; partire dalla prima materia compilata; nascondere le materie senza lezioni.

## Conseguenze
- Supera in parte [[2026-10-07 L'onboarding chiede anno e argomento in classe]]: l'anno resta, l'argomento diventa uno per materia.
- Sul profilo: `profiles.subjects` (le materie scelte) e `profiles.topics` (un argomento per materia); `profiles.topic` resta la lezione da cui si è partiti. Migrazione `supabase/migrations/20261007180000_onboarding_subjects.sql`, applicata.
- Il percorso si allunga: con quattro materie sono quattro schermate di elenchi prima dell'account. Da misurare dove si abbandona ([[Metriche]]).
- Da fare: il Diario e la pratica quotidiana che usano materie e argomenti; materie e argomenti modificabili dall'account.
- Aggiornate [[Onboarding]], [[Account e impostazioni]].

## Collegamenti
- [[Onboarding]], [[Diario e calendario]], [[Pratica quotidiana]], [[2026-10-07 Onboarding]]
