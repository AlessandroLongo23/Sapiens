# inf-file-csv: file di dati in formato CSV

Esercizi della lezione 80, "File di dati in formato CSV" (`docs/lezioni/informatica/riscritte/80-inf-file-csv.md`).
Le parole sono quelle della lezione: campo, separatore, riga di intestazione; i campi si contano da 0. I programmi
sono scritti a mano nei due linguaggi (`src/lib/exercises/v2/inf-codice.ts`): in Python `file.readline()` per
saltare l'intestazione e `split(",")`, in C++ `getline` fino alla virgola, una variabile per campo. Il file CSV che
un programma legge sta in `params.files` e si vede sotto la domanda. I numeri sono interi.

Le tabelle dei livelli 2, 3 e 4 hanno tre colonne (un nome, un'etichetta di al più sei lettere, un numero intero) e
4 o 5 righe di dati, con nomi e numeri tutti diversi: `voti.csv` (nome, materia, voto), `gare.csv` (nome, sport,
punti), `soci.csv` (nome, citta, eta), `gite.csv` (nome, meta, euro). Un'etichetta sta su almeno due righe e non su
tutte.

## Livelli

1. **I campi di una riga.** Sotto la domanda una riga sola. Tre casi, un terzo ciascuno. `quanti`: la riga ha 3, 4
   o 5 campi separati dalla virgola o dal punto e virgola; quanti campi ottiene il programma che taglia a quel
   separatore? Distrattori: il numero dei separatori, uno in più, 1. `quale`: qual è il campo k, contando da 0, con
   k almeno 1? Distrattori: il campo prima (chi conta da 1), quello dopo, il primo, l'ultimo, la riga intera.
   `separatore`: la riga è scritta con un separatore e il programma taglia all'altro; resta un campo solo, oppure 2
   quando la riga usa il punto e virgola e ha un numero con la virgola decimale (`Sara;judo;7,5` tagliata alle
   virgole). Distrattori: 3, 2, 1, 4.
2. **Leggere la tabella.** Sotto la domanda un file CSV. Tre casi, un terzo ciascuno: `valore` (che cosa c'è nella
   colonna X sulla riga di un nome), `righe` (quante righe di dati, senza contare l'intestazione), `campo` (in
   quale campo, contando da 0, un programma trova la colonna X). Distrattori: un altro valore della stessa riga o
   della stessa colonna, il nome della colonna; le righe contate con l'intestazione; il campo contato da 1.
3. **Calcolare su una colonna.** Un programma intero e, sotto, il file che legge. Che cosa scrive? Quattro casi, un
   quarto ciascuno: `somma` (la somma della colonna dei numeri), `conta` (quante righe hanno una certa etichetta
   nel campo 1), `somma filtrata` (la somma dei numeri di quelle righe), `intestazione` (il programma non salta
   l'intestazione e conta le righe: una in più dei dati). Distrattori: quello che scrive lo stesso programma con
   un errore (il conteggio al posto della somma, la condizione al contrario o dimenticata, il numero tenuto e non
   sommato, l'accumulatore da 1), il numero delle righe di dati e quello delle righe del file.
4. **Quale programma.** Sotto la domanda il file. Quale programma scrive la somma di una colonna, quante righe
   hanno un'etichetta, o la somma dei numeri di quelle righe (`somma`, `conta`, `somma filtrata`, un terzo
   ciascuno)? Quattro programmi; del C++ si vede solo il contenuto di `main`. In Python, per stare nella larghezza
   di un'opzione, il taglio è su due righe (`riga = riga.strip()` e `campi = riga.split(",")`). Distrattori, ognuno
   un errore diverso: `!=` al posto di `==`, il confronto sul campo 0, `s + 1` al posto della somma e viceversa,
   `s` che parte da 1, la condizione dimenticata, l'assegnamento al posto della somma, l'intestazione non saltata
   (dove non manda in errore il programma).
5. **Scrivere un file CSV.** Un programma scrive un file da due vettori di tre elementi (tre nomi di tre lettere e
   tre numeri). Che cosa contiene il file alla fine? Quattro casi, un quarto ciascuno: `giusto` (intestazione e tre
   righe), `senza intestazione`, `attaccate` (manca l'a capo dopo il numero: le tre coppie su una riga), `senza
   separatore` (manca la virgola: `Ada8`). Le opzioni sono contenuti di file. Distrattori: i contenuti degli altri
   casi, e i nomi e i numeri uno per riga.
6. **Leggere righe con i campi.** Risposta aperta. Il programma legge n e poi n righe battute nella forma
   `nome,punti` (oppure `nome,sport,punti`), con un esempio nella consegna; la lettura di n c'è già. Tre casi, un
   terzo ciascuno: `somma` (la somma dei punti), `conta` (quante righe hanno almeno k punti, k da 4 a 7), `filtro`
   (la somma dei punti delle righe di uno sport). È eseguito su tre liste di 3 o 4 righe, che scrivono almeno due
   risultati diversi e mai 0, e deve contenere un ciclo. A scelta multipla: quattro programmi, di cui si vede il
   ciclo; distrattori come nel livello 4, più il ciclo che fa un giro in meno.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore.
- Righe di al più 34 caratteri nelle opzioni, di al più 42 sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor.
- La domanda nomina il file, il separatore e, dove serve, l'etichetta o il numero con cui si confronta.
- I casi di un livello escono nelle stesse quote.

## Da evitare

- Programmi che convertono in numero l'intestazione o un nome: Python si ferma, il C++ anche, ma in un altro modo.
  Un errore così non può essere un'opzione.
- Tabelle in cui due errori danno lo stesso numero: si estrae di nuovo.
- Campi tra virgolette e separatori dentro un campo: la lezione li nomina soltanto.
- Medie: Python e C++ scrivono i decimali in modo diverso.

## Limiti

- La risposta aperta legge le righe dalla tastiera e non da un file: la pagina dà al programma dello studente solo
  le righe battute. Il taglio dei campi è lo stesso; l'apertura del file e il salto dell'intestazione restano ai
  livelli 3 e 4.
- Nel livello 5 il C++ dichiara i vettori senza la dimensione (`string nomi[] = {...}`), perché con `[3]` la riga
  supera i 42 caratteri.
