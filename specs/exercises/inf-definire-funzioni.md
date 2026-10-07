# inf-definire-funzioni: definire e chiamare una funzione

Esercizi della lezione 65 di informatica (`docs/lezioni/informatica/riscritte/65-inf-definire-funzioni.md`). Ogni
programma è scritto a mano in Python e in C++ con `src/lib/exercises/v2/inf-codice.ts`; in C++ la funzione è
definita prima di `main` e comincia con `void`. I programmi scrivono solo testi, senza numeri calcolati, e non
leggono niente, tranne quelli del livello 5 che leggono un numero intero n.

Le funzioni sono senza parametri (tranne il livello 4) e scrivono una o due righe. Sei temi, con il nome della
funzione, le sue due righe e le parole che il programma principale scrive intorno: `linea`, `saluta`, `applauso`,
`ritornello`, `stelle`, `avviso`.

## Livelli

1. **Seguire una chiamata.** Il programma intero: la funzione, poi tre o quattro stampe con una chiamata (`una`) o
   due (`due`) in mezzo, mai come prima istruzione. Domanda: che cosa scrive, una riga sotto l'altra. Opzioni:
   quattro uscite. Distrattori: il corpo eseguito dove è definito e non alle chiamate; la funzione mai eseguita; il
   corpo eseguito alla definizione e a ogni chiamata; solo la prima chiamata; il corpo una riga più tardi; il
   corpo in fondo.
   Esempio: `saluta` scrive `Ciao!`; il programma scrive `Inizio`, chiama `saluta()`, scrive `Anna` e `Fine` →
   Inizio, Ciao!, Anna, Fine.
2. **Contare le chiamate.** Il programma ha un ciclo `for` di 2-5 giri con la chiamata nel corpo. Tre casi, un
   terzo ciascuno: `solo-ciclo` (una chiamata per giro), `anche-fuori` (in più una chiamata prima o dopo il ciclo),
   `due-nel-ciclo` (due chiamate per giro). Domanda: quante volte viene eseguito il corpo della funzione. Opzioni:
   quattro numeri. Distrattori: quante volte la chiamata è scritta; il numero di giri; 1; uno in più (la
   definizione contata come esecuzione).
   Esempio: ciclo di 4 giri con una chiamata, più una chiamata dopo il ciclo → 5.
3. **Quale programma scrive questo.** Sotto la domanda le righe da ottenere; le opzioni sono quattro programmi,
   mostrati per intero in Python e dalla funzione in giù in C++. Casi `una` e `due` (chiamate). Distrattori, dagli
   errori della lezione: la funzione definita e mai chiamata (chiamate tolte, oppure scritte senza parentesi); la
   chiamata una riga dopo; la chiamata prima della riga che deve seguire; una chiamata in più o in meno; la
   chiamata come prima istruzione. Uno dei distrattori è sempre la funzione mai eseguita.
4. **Una funzione con un parametro.** La funzione ha il parametro `n` e scrive n volte un carattere sulla stessa
   riga (`-`, `*`, `#`, `=`), poi va a capo. Due o tre chiamate. Tre casi: `numeri` (argomenti scritti come numeri),
   `variabile` (una variabile e la variabile più un numero), `espressione` (un prodotto o una somma). Argomenti da 1
   a 10. Opzioni: quattro uscite. Distrattori: l'espressione non calcolata; un carattere in più o in meno; tutto su
   una riga; le righe in ordine inverso; solo la prima chiamata; un carattere per chiamata.
   Esempio: `stelle(2)`, `stelle(2 * 3)` → `**`, `******`.
5. **Scrivere una funzione.** Risposta aperta. Il programma legge n (la lettura c'è già); lo studente definisce una
   funzione senza parametri che scrive una o due righe date, e la chiama. Tre compiti: `ripeti` (n chiamate),
   `cornice` (una chiamata, n volte una riga, un'altra chiamata), `alterna` (per n volte una riga e la chiamata). Il
   programma è eseguito su tre valori diversi di n tra 1 e 4 e deve contenere una funzione definita e chiamata
   dallo studente (`funzione`). A scelta multipla: quattro programmi; distrattori: un giro in più o in meno, la
   chiamata fuori dal ciclo o una sola volta, la funzione mai chiamata, le righe del corpo scambiate.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore: la chiamata senza parentesi è un programma valido nei due linguaggi (in C++ dà un avviso).
- Righe di al più 34 caratteri nelle opzioni e di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor.
- I casi di un livello escono nelle stesse quote.

## Da evitare

La chiamata come prima istruzione nel livello 1 (il corpo "alla definizione" darebbe la stessa uscita della
risposta giusta); programmi che vanno in errore tra le opzioni (la chiamata prima della definizione dà errore solo
in Python a metà esecuzione e non compila in C++: è nella lezione, non negli esercizi); righe con spazi in fondo.
