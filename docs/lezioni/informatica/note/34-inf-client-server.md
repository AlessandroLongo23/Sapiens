# Note: Il modello client-server

Lezione nuova, scritta da zero (lotto del secondo anno, capitolo "Internet e il web", 5 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard. 166 righe, 3 figure, 3 esempi.

## Struttura

I due ruoli, richiesta e risposta, i quattro passi di uno scambio; perché i compiti sono divisi così (tabella, vantaggi e prezzo dei dati sul server); un server e molti client, con il sovraccarico; il messaggio di una chat che passa dal server; il peer-to-peer come confronto.

Avvisi: il client è un programma, non una persona; due telefoni vicini non si parlano direttamente. Due note: lo stesso computer può avere i due ruoli; le notifiche.

## Scelte

- Client e server sono definiti come programmi, e solo dopo come macchine. La lezione 17 definisce il server come computer: qui c'è il link e si aggiunge il ruolo del programma.
- L'esempio che torna in tutta la lezione è il registro elettronico; il secondo è la chat, il terzo il videogioco in rete.
- "A cominciare è sempre il client" è detto come regola. Le notifiche e le chat moderne usano collegamenti tenuti aperti, su cui il server manda dati quando vuole: la nota "E le notifiche?" dice che il collegamento lo apre comunque il client. Nello schema della chat il passo 2 ("il client di Luca chiede se ci sono messaggi") è una semplificazione dello stesso meccanismo.
- L'elaborazione "lato client" e "lato server" non è nominata con questi termini: c'è nell'esempio 2 (chi fa che cosa in un gioco). Il web dinamico è una lezione del quinto anno.
- Peer-to-peer in una sezione breve, senza nomi di programmi né di protocolli. Il testo dice "alcuni programmi per scambiarsi file di grandi dimensioni".
- Niente architetture a più livelli, niente porte, niente socket.

## Fonti e cose da verificare

- "Può trovarsi in un altro continente", detto del server della chat: vero per molti servizi, non per tutti. Il testo dice "può".
- I servizi molto usati "dividono il lavoro tra molti server": vero in generale (bilanciamento del carico), senza numeri.
- La nota sulle notifiche descrive il funzionamento dei servizi di notifica dei sistemi mobili (collegamento persistente aperto dal dispositivo): da verificare sulla documentazione di Android e iOS.

## Figure

- `client-server-richiesta-risposta`: client e server con le due frecce numerate.
- `chat-attraverso-il-server`: i due client e il server, tre frecce numerate che corrispondono ai tre passi sotto la figura.
- `client-server-e-peer-to-peer`: una stella con il server al centro accanto a quattro computer tutti collegati tra loro.

Guardate in chiaro e in scuro. Corretto dopo la prima anteprima: le prime due superavano di poco i 9 cm.

## Domande per Andrea

- Il peer-to-peer resta in questa lezione o è troppo per il secondo anno?
- La regola "comincia sempre il client", con la nota sulle notifiche, è accettabile come semplificazione?
