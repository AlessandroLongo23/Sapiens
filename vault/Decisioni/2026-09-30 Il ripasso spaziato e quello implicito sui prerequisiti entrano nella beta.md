---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, esercizi, release]
---
# Il ripasso spaziato e quello implicito sui prerequisiti entrano nella beta

## Decisione
Nella [[Release Beta]] entrano tutte e tre le parti: le tappe con la risposta aperta, la memoria con FSRS dietro la pratica quotidiana, e il ripasso implicito lungo il grafo dei prerequisiti, per cui un successo su una lezione rinfresca in parte la memoria delle lezioni che la precedono.

## Perché
Scelta di Alessandro, 30 settembre 2026. Claude aveva consigliato di rimandare il ripasso implicito sui prerequisiti a dopo la beta, per ridurre il lavoro prima di gennaio 2027.

Alternative scartate: tappe e FSRS nella beta con il ripasso implicito dopo (la raccomandazione di Claude); solo le tappe con una regola fissa, e FSRS dopo la beta.

## Conseguenze
- Il grafo dei prerequisiti deve coprire tutte le lezioni della beta: oggi `src/lib/content/prerequisiti.json` ha 67 lezioni, il primo anno; mancano le 37 del secondo anno, da scrivere nel grafo e controllare con `scripts/lezioni/prerequisiti.mts`.
- Quanto un successo rinfresca un prerequisito è una regola nuova, da proporre e provare sui dati: FSRS non la prevede.
- Il lavoro entra in [[Agenda]] come un argomento suo, dopo la risposta aperta.

## Collegamenti
- [[2026-09-30 La memoria degli esercizi è per livello, con FSRS, e la risposta aperta pesa di più]], [[2026-09-25 I prerequisiti si scrivono per lezione, con un solo tipo di arco]], [[Mappa dei prerequisiti]], [[Progressi dello studente]]
