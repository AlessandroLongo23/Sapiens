# inf-file-testo: leggere e scrivere un file di testo

Esercizi della lezione 79, "Leggere e scrivere un file di testo" (`docs/lezioni/informatica/riscritte/79-inf-file-testo.md`).
Ogni programma è scritto a mano in Python e in C++ (`src/lib/exercises/v2/inf-codice.ts`), con le forme della
lezione: `with open(...)` e `for riga in file` in Python, `ifstream`, `ofstream`, `getline` e `close` in C++; la
conversione è `int(riga)` e `stoi(riga)`. I file che il programma trova accanto a sé stanno in `params.files` e si
vedono sotto il programma. I numeri sono interi.

## Livelli

1. **Leggere le righe.** Un programma intero e, sotto, un file con 3, 4 o 5 nomi diversi, uno per riga. Che cosa
   scrive il programma? Cinque casi, un quinto ciascuno: `conta` (conta le righe), `ultima` (a ogni giro una
   variabile prende la riga letta: resta l'ultima), `seconda` (due letture di una riga sola, e scrive la seconda:
   il segnaposto), `numerate` (scrive ogni riga con il suo numero, da 1), `manca` (apre il file con il controllo
   della lezione e scrive la prima riga oppure "non trovato"; due volte su tre il nome aperto è scritto male).
   Distrattori: un'altra riga del file, il numero di righe sbagliato di uno, tutte le righe, la numerazione da 0,
   "non scrive niente".
   Esempio: `seconda` su `turni.txt` con Marta, Piero, Anna → Piero.
2. **I numeri di un file.** Come il livello 1, con un file di 4 o 5 numeri interi diversi da 2 a 14, in cui il più
   grande non è né il primo né l'ultimo. Tre casi, un terzo ciascuno: `somma`, `conta` (quanti sono maggiori o
   uguali a k, con k uno dei numeri), `massimo` (parte dalla prima riga, letta prima del ciclo). Distrattori: le
   righe attaccate una all'altra, cioè quello che dà `+` senza la conversione (`81067`); il numero di righe;
   l'ultimo numero; il conteggio con `>`; la somma al posto del conteggio; il minimo; il primo numero.
   Esempio: `somma` su `voti.txt` con 8, 10, 6, 7 → 31.
3. **Che cosa resta nel file.** Un programma che apre un file e ci scrive due nomi; sotto, il file com'è prima (2 o
   3 nomi). Che cosa contiene il file alla fine? Cinque casi, un quinto ciascuno: `scrive` (aperto in scrittura:
   restano solo i due nomi nuovi), `accoda` (le righe vecchie e poi le due nuove), `attaccati` (dopo il primo nome
   manca l'a capo: i due nomi finiscono su una riga), `nuovo` (il file non esiste: viene creato), `due volte` (il
   programma è eseguito due volte di seguito). Negli ultimi tre il modo, scrittura o accodamento, è estratto. Le
   opzioni sono contenuti di file, una riga sotto l'altra. Distrattori: il contenuto con l'altro modo, le righe
   nuove prima delle vecchie, le righe scritte una volta sola o due, i nomi staccati dove sono attaccati, il file
   vuoto, il programma che si ferma con un errore (solo in `nuovo`).
4. **Quale programma.** Sotto la domanda un file di numeri come nel livello 2. Quale programma scrive quello che è
   chiesto? Tre casi, un terzo ciascuno: `conta` (quanti numeri sono maggiori di k), `somma`, `somma grandi` (la
   somma dei numeri maggiori di k). Le opzioni sono quattro programmi; del C++ si vede solo il contenuto di `main`.
   Distrattori, ognuno un errore diverso: `>=` o `<` al posto di `>`, `n + x` al posto di `n + 1` e viceversa,
   l'accumulatore che parte da 1, la condizione dimenticata, l'assegnamento `s = x` al posto della somma.
5. **Scrivere e rileggere un file.** Risposta aperta. Il programma legge n e poi n numeri interi da 1 a 9 (la
   lettura di n c'è già); deve scrivere nel file `num.txt`, uno per riga, tutti i numeri, oppure solo quelli
   maggiori o uguali a k (k da 4 a 7), oppure solo i pari; poi chiudere il file, riaprirlo in lettura e stampare la
   somma dei numeri che contiene, oppure quante righe contiene. Cinque casi, un quinto ciascuno: `tutti-somma`,
   `grandi-somma`, `grandi-quanti`, `pari-somma`, `pari-quanti`. È eseguito su tre liste di 3, 4 o 5 numeri, che
   scrivono almeno due risultati diversi e mai 0, e deve contenere un ciclo. A scelta multipla: quattro programmi,
   di cui si vede la parte che scrive il file; distrattori: l'a capo dimenticato (il file riletto ha una riga
   sola), la condizione sbagliata o dimenticata, il contatore o n scritti al posto del numero, il ciclo che parte
   da 1.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore.
- Righe di al più 34 caratteri nelle opzioni, di al più 42 nei programmi e nei file sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor.
- Il file mostrato è quello che il programma trova; la domanda ne dice il nome.
- I casi di un livello escono nelle stesse quote.

## Da evitare

- File in cui due errori danno lo stesso risultato: i numeri si estraggono di nuovo.
- Programmi che vanno in errore tra le opzioni (aprire in lettura un file che non c'è ferma Python e non il C++:
  compare solo nel caso `manca`, con il controllo scritto nei due linguaggi).
- Numeri con la virgola e medie: Python e C++ le scrivono in modo diverso.
- Uscite che dipendono dall'a capo attaccato alla riga letta (`print(riga)` senza `strip()` in Python scrive una
  riga vuota in più, il C++ no).

## Limiti

- La risposta aperta è corretta su quello che il programma stampa: una risposta che fa il conto senza passare dal
  file viene accettata. La pagina dà al programma dello studente solo le righe battute, quindi una risposta aperta
  non può leggere un file preparato.
- Il controllo Python guarda anche il contenuto dei file scritti (livelli 3 e 5); con `INF_CPP=1` lo fa anche per
  il C++ del livello 3.
