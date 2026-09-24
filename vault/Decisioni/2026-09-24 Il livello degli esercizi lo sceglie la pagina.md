---
stato: decisa
aggiornato: 2026-09-24
tag: [decisione, studenti, prodotto]
---
# Il livello degli esercizi lo sceglie la pagina

## Decisione
La pagina degli esercizi parte dal primo livello che lo studente non padroneggia ancora, calcolato dai tentativi salvati, e sale dopo due risposte giuste di fila. Lo studente può comunque saltare a un livello a mano. Dopo una risposta sbagliata la pagina mostra la soluzione con i passaggi, poi un esercizio nuovo dello stesso livello.

## Perché
Lo studente non deve sapere quale livello gli serve: lo dice il suo storico, che con [[2026-09-24 Ogni tentativo salva l'esercizio intero]] esiste. La scelta a mano resta per chi vuole ripassare o mettersi alla prova. Ripetere lo stesso esercizio dopo l'errore insegna a ricordare la risposta, non il procedimento.

Alternative scartate: livelli scelti solo dallo studente; la scala fissa di oggi, un esercizio per livello uguale per tutti; un secondo tentativo sullo stesso esercizio prima della soluzione.

## Conseguenze
- Risolve la domanda aperta su come si sceglie il livello in [[Esercizi]].
- Una riga di `exercise_attempts` per ogni esercizio, anche dopo un errore (vedi [[Schema dati]]).
- La soglia di due giuste di fila è un punto di partenza, da rivedere con i dati della beta (vedi [[Metriche]]).

## Collegamenti
- [[Esercizi]], [[Pratica quotidiana]], [[2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro]]
