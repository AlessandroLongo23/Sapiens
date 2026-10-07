# Note: Audio e video digitali

Lezione nuova (lotto del terzo anno, capitolo "Immagini, suoni e video digitali", 7 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard; `verifica.mts`: 2 esercizi, 0 errori. 258 righe: circa 140 di testo, il resto sono i due esercizi nei due linguaggi. È sopra le 200 righe indicate per le lezioni di concetto, per via degli esercizi.

## Scelte

- Confine con la 12: campionamento, quantizzazione e il conto dei byte di un suono non compresso sono lì. Qui il centro è il bitrate: quello non compresso è ripreso in una formula, poi il bitrate come scelta di chi salva un file compresso, e la dimensione come bitrate per secondi diviso 8.
- Confine con la 82 (formati) e la 84 (compressione): i formati audio stanno in una tabella di tre righe con il link alla 82; codec e contenitore sono ripresi solo per il video, in due paragrafi, perché il confine della 85 li nomina. Se la 82 li tratta già per esteso, qui si può tagliare a una frase con il link.
- La compressione tra fotogrammi è spiegata con le sole differenze pixel per pixel. La compensazione del movimento è una frase; i tipi di fotogramma (I, P, B) non sono nominati: c'è solo "fotogramma chiave".
- Multipli decimali ovunque, con il fattore scritto (1 kbit/s = 1000 bit/s, 1 MB = 1 000 000 B).
- Il filo del gruppo musicale "I Fuori Tempo" apre anche questa lezione (la registrazione delle prove), anche se il brief lo chiede solo per i capitoli sul web.
- "Prova tu": due programmi in Python e C++ con numeri interi e divisione intera, perché i due linguaggi scrivano lo stesso. Il secondo ha una selezione.

## Elementi interattivi

- `inf-audio-video-dimensione` (figura): quanto occupa un brano o un video senza compressione, e quanto con il bitrate di un file compresso? Due barre in scala e il conto scritto sotto.
- `inf-video-fotogrammi-differenza` (figura a passi): quanti pixel cambiano davvero da un fotogramma al successivo? Dieci fotogrammi di 16 × 9, con un cambio di scena al settimo.
- Due programmi da completare (`codice` Python e C++), con tre prove ciascuno.

## Da verificare

Scritti a memoria, non ricontrollati in rete.

- CD audio: 44,1 kHz, 16 bit, stereo, quindi 1411,2 kbit/s (standard Red Book, 1980).
- "A 320 kbit/s quasi nessuno distingue il file dall'originale": affermazione corrente, da verificare o da attenuare.
- "FLAC: circa la metà": il rapporto dipende dal brano, di solito tra il 40% e il 70%.
- Bitrate tipici dell'audio con perdita, da 96 a 320 kbit/s; "per la voce bastano poche decine di kbit/s".
- 24 fotogrammi al secondo al cinema, 25 nella televisione europea, 30 o 60 su molti telefoni.
- "Una fotografia compressa bene diventa dieci o venti volte più piccola": ordine di grandezza per JPEG, da verificare.
- H.264 come codec video "molto diffuso"; MP4, MKV e WebM come contenitori.
- "Un fotogramma chiave ogni pochi secondi": dipende dal codificatore.
- I 5 Mbit/s usati come bitrate di un video Full HD compresso sono un valore plausibile, non una norma.

## Domande per Andrea

- Codec e contenitore stanno bene qui, o vanno lasciati per intero alla 82?
- "Bitrate" oppure "flusso di bit", che è la parola usata in una riga della lezione 12?
- Serve nominare i fotogrammi I, P e B, come fanno alcuni libri?
- La lezione non ha audio da ascoltare: lo vuoi, per sentire lo stesso brano a bitrate diversi?

Prerequisiti proposti: inf-codifica-suoni, inf-codifica-immagini, inf-compressione, inf-bit-byte

## Revisione del lotto (7 ottobre 2026)

- Codec e contenitore usano ora le parole della 82, richiamata con un link: la codifica è il modo (MP3, AAC, H.264), il codec è il programma. Prima la 85 chiamava "codec" il metodo. Adeguati formulario e due flashcard.
- Tolto il grassetto a "risoluzione" (è della lezione 11); "nessuna connessione di casa" è diventato "quasi nessuna"; la velocità della connessione "non deve essere minore" del bitrate (l'esercizio accetta l'uguale); tolta la frase che annunciava ("In questa lezione fai questi conti"); "la batterista" è diventato "il batterista" (alla batteria c'è Leo).
- Aggiunto `return 0;` ai `main` in C++.
- Le formule in evidenza con i nomi scritti per esteso uscivano dalla colonna a 390 px e andavano scorse di lato: ora vanno a capo dopo l'uguale, nella lezione e nel formulario.
