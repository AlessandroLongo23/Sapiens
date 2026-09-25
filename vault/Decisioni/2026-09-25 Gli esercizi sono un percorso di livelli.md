---
stato: decisa
aggiornato: 2026-09-25
tag: [decisione, studenti, prodotto]
---
# Gli esercizi sono un percorso di livelli

## Decisione
Gli esercizi di una lezione sono un percorso: un nodo per livello, dal più facile, ognuno con un nome che dice cosa aggiunge quel livello. Lo studente sceglie il livello prima di cominciare e fa una prova di 10 domande tutte di quel livello. Con almeno 8 risposte giuste su 10 il livello è superato e si apre quello dopo. Un livello chiuso si apre anche con la prova di salto: 5 domande sui livelli che salta, e con 4 giuste quei livelli contano come superati. Sotto ogni livello si vedono le ultime prove, con il punteggio e la data.

## Perché
Alessandro, il 25 settembre 2026, non voleva che lo studente cambiasse livello mentre fa gli esercizi: ha più senso scegliere il livello quando si comincia una serie, e fare tutta la serie a quel livello. Il riferimento sono i percorsi di Duolingo e Brilliant, dove si va avanti con serie sempre più difficili e si possono rifare quelle facili. La pagina con una sola scheda al centro era troppo semplice; il percorso dà spazio anche all'interfaccia.

Alternative scartate:
- Tutti i livelli aperti, con il primo non superato solo suggerito (era la raccomandazione di Claude): con la prova di salto chi sa già le basi va avanti lo stesso, e il percorso resta ordinato.
- Livelli che si aprono solo in ordine, senza salto: blocca chi prepara una verifica su un argomento che conosce in parte.
- Superare un livello con 10 su 10, o con due prove sopra 8: il primo frustra ai livelli alti, il secondo chiede il doppio degli esercizi.
- Nodi chiamati solo "Livello 3": i nomi dicono allo studente dove sta andando.

Sostituisce [[2026-09-24 Il livello degli esercizi lo sceglie la pagina]], che faceva salire il livello da solo durante la sessione dopo due risposte giuste di fila e lasciava i tasti per saltare.

## Conseguenze
- I nomi dei livelli (154 per 26 generatori) sono scritti da Claude a partire da `specs/exercises/` e vanno riletti da Andrea, come gli altri contenuti ([[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]).
- Nuova tabella `exercise_sessions`, una riga per prova, e i tentativi sanno a quale prova appartengono (vedi [[Schema dati]]).
- Resta il resto della decisione del 24 settembre: dopo un errore la soluzione con i passaggi, poi un esercizio nuovo; ogni esercizio salvato intero ([[2026-09-24 Ogni tentativo salva l'esercizio intero]]).
- La sessione gratuita giornaliera resta di 10 risposte: una prova del Free prende quello che ne rimane, e la prova di salto chiede che ne restino almeno 5.
- Le soglie (8 su 10, 4 su 5) sono un punto di partenza, da rivedere con i dati della beta (vedi [[Metriche]]).

## Collegamenti
- [[Esercizi]], [[Pratica quotidiana]], [[2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro]]
