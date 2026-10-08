# Note: I formati dei file multimediali

Lezione nuova (terzo anno, capitolo "Immagini, suoni e video digitali", gruppo 8, 7 ottobre 2026). `check.mts` passa
senza errori e senza avvisi su lezione, formulario e flashcard; `verifica.mts`: 2 esercizi, 0 errori.

## Confini

- Con la 11 e la 12: pixel, profondità di colore, campionamento e i conti delle dimensioni non compresse non sono
  rispiegati; la lezione li richiama con un link e usa solo il risultato ("un minuto di musica occupa una decina di
  megabyte").
- Con la 22: l'estensione è già lì, con l'avviso "cambiare l'estensione non cambia il formato". Qui la stessa cosa è
  vista dal lato del contenuto: la firma nei primi byte, e un programma che la legge.
- Con la 83: SVG compare nella tabella come "vettoriale" e nella figura, ma che cosa vuol dire è della 83.
- Con la 84: "con perdita" e "senza perdita" sono definite in due frasi, perché servono a leggere le tabelle; come
  funzionano, il rapporto di compressione e il ricomprimere sono della 84.
- Con la 85: contenitore e codec sono introdotti qui, con una figura; i codec per nome, il bitrate e lo streaming
  sono della 85. Nella figura compaiono H.264 e AAC come esempi di codifica, una volta.

## Scelte

- "Firma" per i primi byte del file (in inglese magic number o file signature). I libri del liceo di solito non ne
  parlano: è la cosa che rende vera la frase "l'estensione non è il contenuto", e dà un programma da eseguire.
- Il programma confronta solo i primi due byte, che bastano a distinguere i quattro formati della tabella: con
  quattro confronti le righe non stavano nell'editor sul telefono.
- Le firme si scrivono in esadecimale con `0x`, spiegato in una riga. Nel secondo esercizio i byte si leggono in base
  dieci, con le conversioni scritte nella consegna.
- JPEG si chiama JPEG, e l'estensione è `.jpg`; nel programma il formato è la stringa `"jpg"`.
- HEIC, AVIF, TIFF, RAW, OGG, MOV non ci sono. WebP c'è perché lo studente lo incontra salvando immagini dal web.
- "Documento di testo" per TXT, ODT, DOCX e PDF, come nella 22.
- La lezione è lunga 434 righe, più delle 200 del brief: 271 sono nei blocchi `codice` (il programma delle firme e
  i due esercizi, nei due linguaggi); il testo da leggere, con tabelle, riquadri e figura, è di circa 160 righe.

## Elementi interattivi

- Programma `codice` (Python e C++): "il file si chiama gita.png: che cosa c'è dentro davvero?". Eseguito nei due
  linguaggi nel browser.
- `inf-scegli-formato` (figura): "quale formato conviene per questa immagine, e perché gli altri no?". Cinque scopi,
  cinque formati, un giudizio (adatto, si può, no) con il motivo. Guardata in chiaro e in scuro, a 800 e a 390 px,
  con ognuno dei cinque scopi.
- Figura TikZ `contenitore-e-tracce`: guardata nella lezione, in chiaro.
- Due esercizi in "Prova tu", con le soluzioni verificate nei due linguaggi.

## Da verificare

- Le firme: PNG `89 50 4E 47 0D 0A 1A 0A` (specifica PNG, W3C, seconda edizione 2003); JPEG `FF D8 FF`; GIF
  `47 49 46 38` ("GIF8", seguito da `37 61` o `39 61`); PDF `25 50 44 46` ("%PDF"); ZIP `50 4B 03 04`. Scritte a
  memoria dalle specifiche: da ricontrollare su una fonte.
- "Un formato senza perdita lo porta a poco più della metà, uno con perdita a circa un decimo" (audio): ordini di
  grandezza, la 12 dice già "circa un decimo".
- "WebM è nato per le pagine web", "MKV accetta quasi ogni codifica": da verificare.
- GIF "sì, senza sfumature" per la trasparenza: un colore della tavolozza è trasparente, senza gradi intermedi.
- PNG "animazione: no": esiste APNG, che i browser leggono; la tabella lo ignora.
- Formati aperti: PDF è una norma ISO dal 2008 (ISO 32000-1); ODT è una norma ISO (ISO/IEC 26300, 2006); PNG e SVG
  sono raccomandazioni W3C; FLAC e WebM hanno specifiche pubbliche. Date scritte a memoria: da verificare.
- DOCX non è nell'elenco degli aperti né in quello dei proprietari: è una norma pubblica (ECMA-376, ISO/IEC 29500)
  nata da un'azienda. MP3 e JPEG non sono citati come aperti per la storia dei brevetti. La lezione tace.
- WebP "di solito con file più piccoli" di JPEG (nella figura): da verificare, e dipende dall'immagine.

## Domande per Andrea

- La firma dei file è fuori dai programmi del liceo: resta, o è troppo?
- Contenitore e codec stanno qui o solo nella 85?
- DOCX: lo mettiamo tra i formati aperti, tra i proprietari, o lo lasciamo fuori come ora?
- Va bene presentare GIF come "senza perdita, ma con 256 colori"?

Prerequisiti proposti: inf-file-system, inf-codifica-immagini, inf-codifica-suoni, inf-esadecimale

## Revisione del lotto (7 ottobre 2026)

- "I video sono sempre compressi con perdita" è diventato "quasi sempre"; "pochi secondi" di video non compresso è diventato "pochi minuti" (la 85 calcola 28 GB per tre minuti).
- Aggiunto `return 0;` ai `main` in C++, come nelle lezioni 60-80.
