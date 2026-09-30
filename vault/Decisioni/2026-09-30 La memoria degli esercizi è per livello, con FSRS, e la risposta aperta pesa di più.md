---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, esercizi, tecnica]
---
# La memoria degli esercizi è per livello, con FSRS, e la risposta aperta pesa di più

## Decisione
Sapiens stima quanto lo studente ricorda ogni livello che ha superato, con FSRS (vedi [[Ripasso pianificato prima di una verifica]]), e lo ripropone quando sta per dimenticarlo, a intervalli sempre più lunghi. L'unità della memoria è il livello (generatore e livello), non il tipo di esercizio. I tipi pesano diversamente come prova di ricordo:
- risposta aperta giusta: ricordato;
- scelta multipla giusta: ricordato con fatica, perché si può indovinare o escludere;
- errore: dimenticato.

Padroneggiato non corrisponde a un numero fisso di ripassi: è un valore dinamico, la stabilità di FSRS (i giorni dopo cui la probabilità di ricordare scende al 90%), che si ricalcola a ogni risposta su tutto quello che lo studente ha fatto. Il livello è padroneggiato finché la stabilità resta sopra una soglia, per esempio 30 giorni. Chi risponde sempre giusto ci arriva prima, chi sbaglia dopo, e nessuno ci arriva in una sera; un ripasso sbagliato fa scendere la stabilità, e il livello torna "da ripassare".

La stabilità di un livello tiene conto anche degli esercizi fatti altrove:
- i livelli di una lezione sono cumulativi: un successo a un livello alto rinfresca in parte quelli sotto;
- un successo su una lezione che usa il livello, lungo il grafo dei prerequisiti, lo rinfresca in parte (vedi [[2026-09-30 Il ripasso spaziato e quello implicito sui prerequisiti entrano nella beta]]);
- un errore su una lezione che usa il livello non lo abbassa da solo, perché può venire dalla lezione nuova: fa partire il ripasso suggerito dopo una prova andata male (vedi [[2026-09-25 I prerequisiti si scrivono per lezione, con un solo tipo di arco]]), e solo un errore lì abbassa la stabilità del prerequisito (proposta di Claude, da confermare).

## Perché
L'idea è di Alessandro, 30 settembre 2026: le curve dell'oblio calcolate dallo storico degli esercizi, e lo studente invitato a ripetere con periodicità sempre meno frequente fino alla padronanza. La sua proposta era una curva per ogni tipo di esercizio.

Alessandro, nella stessa sessione: padroneggiato è un valore dinamico che cambia secondo l'algoritmo e secondo gli esercizi fatti, prerequisiti compresi, non un numero fisso di ripassi.

Claude ha proposto la memoria per livello, e Alessandro l'ha accettata. Quello che si dimentica è il procedimento, non il formato, e una curva per tipo divide i dati. Conta anche il carico: uno studente con 60 livelli superati, con ritenzione al 90% e intervalli medi di circa 20 giorni, ha circa 3 livelli da ripassare al giorno, che entrano nelle 5 domande della pratica; con una curva per tipo sarebbero 6-9 (stima di Claude, da verificare con i dati).

Riferimenti: Khan Academy, gradi di padronanza per abilità che salgono con prove distanziate; Math Academy, ripetizione spaziata lungo un grafo di prerequisiti (da verificare nei dettagli).

## Conseguenze
- Una tabella della memoria per studente e livello, aggiornata a ogni risposta. Libreria candidata `ts-fsrs` (open source, TypeScript). I parametri predefiniti vengono dalle flashcard: si partono da quelli e si ricalcolano con i dati della beta.
- La [[Pratica quotidiana]] sceglie i livelli da ripassare con la memoria, al posto della regola fissa "livelli già superati delle lezioni fatte da più tempo".
- I ripassi consumano le 10 risposte gratuite del giorno del Free, come tutte le risposte.
- Le 4 ripetizioni della fase di apprendimento (vedi [[2026-09-30 Ogni livello è una tappa con più tipi di esercizio, e si supera a risposta aperta]]) sono i primi passi della memoria; dopo, i ripassi sono domande aperte.
- Da decidere: la soglia di padronanza (proposta: 30 giorni di stabilità), quanto rinfresca un successo su un livello più alto o su una lezione successiva, se un errore sulla lezione successiva abbassa il prerequisito solo dopo il ripasso suggerito, la ritenzione desiderata, come entra la velocità di risposta.

## Collegamenti
- [[Esercizi]], [[Progressi dello studente]], [[2026-09-30 Superato non si perde, padroneggiato torna da ripassare come invito]]
