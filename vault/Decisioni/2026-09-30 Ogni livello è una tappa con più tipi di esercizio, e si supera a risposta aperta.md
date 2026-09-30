---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, esercizi]
---
# Ogni livello è una tappa con più tipi di esercizio, e si supera a risposta aperta

## Decisione
Ogni livello del percorso è una tappa con più tipi di esercizio sullo stesso livello, come Duolingo ha esercizi di riordino, di scrittura, di ascolto e di abbinamento sulla stessa lezione. I primi due tipi sono la scelta multipla e la risposta aperta, e si alternano con una rampa: la scelta multipla fa da appoggio nelle prime ripetizioni e si toglie un po' alla volta.

La tappa ha due fasi.
- Apprendimento: 4 ripetizioni da 8 domande, che si possono fare anche di seguito, con scelta multipla e risposta aperta nella proporzione 8/0, 6/2, 4/4, 2/6. Dopo la 4ª il livello è superato e si apre quello dopo.
- Ripasso: domande tutte aperte, che tornano quando la memoria stimata le mette in scadenza, a intervalli crescenti. Il livello è padroneggiato quando la memoria regge a lungo, non dopo un numero di prove: vedi [[2026-09-30 La memoria degli esercizi è per livello, con FSRS, e la risposta aperta pesa di più]].

Una ripetizione conta con almeno 7 risposte giuste su 8; altrimenti si rifà con la stessa miscela.

Un livello senza risposta aperta (238 livelli di matematica su 687 offerti, vedi `src/lib/exercises/v2/open-answers.ts`) ha un passo in meno: 3 ripetizioni a scelta multipla, superato dopo la 3ª, poi la fase di ripasso, sempre a scelta multipla.

Numero di ripetizioni, domande per ripetizione, soglia e proporzioni sono impostazioni, come vuole [[2026-09-23 Vincoli dell'algoritmo configurabili dall'interfaccia]]. Con 8 domande le proporzioni danno numeri interi.

## Perché
Alessandro, 30 settembre 2026: la risposta aperta è più difficile della multipla, perché nella multipla si può andare per esclusione. Ogni livello ha il suo corrispettivo a risposta aperta, quindi i due modi sono tipi di esercizio dello stesso livello, non livelli diversi. Il modello a rampa è suo: cinque ripetizioni da 100% di scelta multipla a 100% di risposta aperta, con superato alla quarta e padroneggiato alla quinta.

Nella stessa sessione il modello è cambiato due volte:
- Claude aveva proposto un allenamento a scelta multipla facoltativo e una sola prova aperta per superare il livello. Alessandro non voleva la scelta multipla facoltativa: deve essere il primo gradino.
- Nella rampa di Alessandro la quinta ripetizione dava padroneggiato. Claude ha notato che, fatta subito dopo la quarta, non misura la memoria; Alessandro ha aggiunto che nemmeno una sola prova dopo due giorni basta, perché dopo una settimana si può aver dimenticato tutto, e serve la curva dell'oblio vera, su giorni e settimane. Per questo padroneggiato è diventato uno stato della memoria, e la quinta ripetizione una fase di ripasso.

Alternative scartate:
- La risposta aperta come livello a parte: raddoppia i nodi del percorso per la stessa abilità.
- Superare con la sola scelta multipla: il percorso direbbe "superato" a chi non sa scrivere la soluzione.
- Ripetizioni da 10 domande: superato dopo 40 domande, circa 35 minuti per livello (stima di Claude, da misurare), e il Free, con 10 risposte al giorno, farebbe una ripetizione al giorno. Con 8 sono circa 25 minuti.
- Ripetizioni da 5 domande (proposta di Claude): le proporzioni non danno numeri interi.

## Conseguenze
- Sostituisce in parte [[2026-09-25 Gli esercizi sono un percorso di livelli]]: la prova di salto resta; al posto di una prova da 10 domande con 8 giuste ci sono 4 ripetizioni da 8 domande.
- Il piano della prova (`exercise_sessions.plan`) deve dire anche il tipo di ogni domanda.
- Ogni livello dichiara cosa si valuta nella risposta aperta: vedi [[2026-09-30 Nella risposta aperta la forma conta solo dove è l'esercizio]].
- Altri tipi di esercizio sui passaggi delle soluzioni, dopo: [[Tipi di esercizio sui passaggi]].
- Soglia e livelli senza risposta aperta decisi da Alessandro lo stesso giorno: 7 su 8 (Claude aveva proposto 6 su 8), e 4 passi invece di 5 (Claude aveva proposto 3 ripetizioni con superato alla 2ª). Con 7 su 8 si sbaglia al massimo una domanda: più severo dell'8 su 10 di prima.
- Da decidere: il tipo della prova di salto (oggi 5 domande, 4 giuste); quante domande ha un ripasso dentro la pratica quotidiana (proposta di Claude: 2 domande aperte per livello).

## Collegamenti
- [[Esercizi]], [[Pipeline esercizi]], [[2026-09-30 La risposta aperta si scrive con MathLive, con la tastiera di Sapiens o quella del dispositivo]]
