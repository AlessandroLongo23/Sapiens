# Note: Definire e chiamare una funzione

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "Le funzioni"), prima del capitolo. Non
pubblicata.

## Struttura

Apertura con la classifica del torneo di calcetto e la riga di trattini ripetuta; la funzione come pezzo di
programma con un nome (il ritornello di una canzone); definizione, corpo e chiamata sul programma della classifica;
la funzione definita e mai chiamata; il flusso che salta e torna, con la figura passo per passo; l'ordine tra
definizione e chiamata, i prototipi del C++ in un riquadro, la chiamata senza parentesi; due funzioni e una chiamata
in un ciclo, con il secondo motivo per usare le funzioni (un nome per ogni pezzo); le funzioni già usate; un
parametro come anticipo (`linea(n)`); due esercizi.

- 323 righe; circa 1200 parole di testo.
- Programmi da eseguire: 3, ciascuno in Python e in C++. Esercizi con le prove: 2.
- Figure interattive: 1. TikZ: 0. Diagrammi: 0 (il linguaggio dei diagrammi non ha funzioni).
- Riquadri `ad-warning`: 3. Riquadri `ad-note`: 2.

## Confini

- Con la 66: qui le funzioni non hanno parametri e non restituiscono niente. L'ultima sezione introduce un solo
  parametro (`linea(n)`), con la parola "parametro" definita e senza la parola "argomento", che è della 66. `void`
  è spiegato come "non restituisce niente" con il rimando alla 66.
- Con la 67: nessuna variabile dentro le funzioni, tranne il contatore `i` del ciclo di `linea(n)`, di cui non si
  dice niente. La figura mostra i due riquadri (programma principale e funzione) senza chiamarli "pila delle
  chiamate".
- Con la 69: "un nome per ogni pezzo del programma" dice perché un programma diviso in funzioni si legge meglio, ma
  non parla di scomposizione né di progetto.

## Scelte

- In Python la parte di programma fuori dalle funzioni si chiama "programma principale", e nella figura il suo
  riquadro si chiama `programma`; in C++ è `main`. Non c'è `def main()` in Python.
- In C++ le funzioni sono definite prima di `main`; i prototipi stanno in un riquadro `ad-note`, come deciso per il
  lotto.
- Le funzioni già usate: `print`, `input`, `int`, `range` per Python, `pow` e `sqrt` per il C++. `sqrt` nel biennio
  non è mai stata usata (la 54 ha `pow`): qui è solo nominata, senza programma. `cout` non è una funzione e non è
  citato.
- Il programma della figura ha righe corte ("Classifica", "1. Tigri 12") perché nella figura il C++ deve stare in
  330 px senza scorrere di lato.
- Gli esercizi leggono un numero, anche se le funzioni non hanno parametri, perché le prove scrivano cose diverse.

## Elementi interattivi

- `inf-definire-funzione-passi` (figura del kit, più due pezzi nuovi): "in che ordine vengono eseguite le righe di
  un programma con una funzione, e da dove riprende il programma quando la funzione ha finito?". Segue il primo
  programma della lezione riga per riga, in Python o in C++ (parte nel linguaggio scelto per i programmi della
  pagina e lo segue). Il testo dopo la figura dà la risposta.
- I tre programmi da eseguire, ciascuno con una modifica chiesta e un risultato da prevedere: trattini in
  asterischi con una sola correzione; quante linee con il ciclo fino a 6; `linea(3 * 10)` e `linea(0)`.
- I tre riquadri `ad-warning` chiedono di provocare l'errore nel programma della classifica.

## Verifiche

- `check.mts`: ok su lezione, formulario e flashcard, nessun avviso.
- `verifica.mts`: 2 esercizi, 0 errori (Python e C++).
- I tre programmi senza prove eseguiti con `python3` e con `clang++ -Wall`: stessa uscita, nessun avviso.
- Provato davvero con `python3` e `clang++` del Mac: la chiamata prima della definizione dà
  `NameError: name 'linea' is not defined` dopo aver scritto la prima riga, e in C++
  `error: use of undeclared identifier 'linea'`; `linea;` senza parentesi compila con l'avviso "expression result
  unused" e non scrive i trattini; `linea` da sola in Python non fa niente.
- Pagina di anteprima aperta a 1280 e a 390 px: nessun errore in console, nessuno scorrimento laterale; i tre
  programmi eseguiti in Python, i due esercizi verificati con la soluzione.

## Da verificare

- Il messaggio del C++ per la chiamata prima della definizione è stato letto dal `clang++` del Mac; la lezione dice
  solo "un nome non dichiarato", senza citare il testo. Non ho provocato l'errore nell'editor del sito.
- `linea;` nell'editor del sito: il sito compila con `-Wall`, quindi l'avviso c'è; non ho controllato come viene
  mostrato allo studente. La lezione dice "il programma parte".

## Domande per Andrea

- In Python va bene chiamare "programma principale" le istruzioni fuori dalle funzioni, o in classe usi
  `def main():` con la chiamata in fondo?
- Il primo esempio di funzione senza parametri è una riga di separazione. Preferisci un esempio in cui il corpo ha
  più istruzioni fin dall'inizio (un'intestazione di tre righe)?
- I prototipi del C++ in un riquadro e basta, oppure li vuoi usati almeno in un esempio?
- La parola per le funzioni che non restituiscono niente: i libri le chiamano anche "procedure". La lezione non usa
  la parola; va aggiunta?

Prerequisiti proposti: inf-input-output, inf-ciclo-for, inf-errori-debug

## Revisione del lotto (7 ottobre 2026)

- "è l'argomento della lezione" è diventato "lo spiega la lezione", per non usare "argomento" nel senso di tema proprio dove sta per essere definito.
