# inf-parametri-ritorno: parametri e valore di ritorno

Esercizi della lezione 66 di informatica (`docs/lezioni/informatica/riscritte/66-inf-parametri-ritorno.md`). Ogni
programma è scritto a mano in Python e in C++ con `src/lib/exercises/v2/inf-codice.ts`. Solo numeri interi, senza
divisioni; nessun valore vero o falso viene stampato (in Python sarebbe `True`, in C++ `1`): una funzione che
restituisce vero o falso è sempre la condizione di una selezione.

Le funzioni dei livelli 1-3 hanno due parametri e un risultato che cambia scambiandoli:

| Funzione | Restituisce | Argomenti |
|---|---|---|
| `punti(vinte, pareggi)` | `k * vinte + pareggi`, k = 2 o 3 | vinte 1-6, pareggi 0-5 |
| `durata(ore, minuti)` | `60 * ore + minuti` | ore 1-3, minuti 10-55 a passi di 5 |
| `voto(giuste, errori)` | `k * giuste - errori`, k = 2 o 3 | giuste 4-9, errori 1-3 |
| `netto(prezzo, sconto)` | `prezzo - sconto` | prezzo 10-40, sconto 1-9 |

## Livelli

1. **Argomenti e parametri.** Il programma intero con una chiamata, e il risultato scritto. Tre casi, un terzo
   ciascuno: `numeri` (`punti(4, 2)`); `variabili` (due variabili con nomi che non sono quelli dei parametri,
   passate due volte su tre nell'ordine inverso a quello in cui sono state assegnate); `espressione` (il primo
   argomento è una variabile più un numero). Opzioni: quattro numeri. Distrattori: il risultato con gli argomenti
   scambiati, l'espressione non calcolata, la somma dei due argomenti, un solo argomento.
   Esempio: `x = 4`, `y = 2`, `print(punti(y, x))` con k = 3 → 10.
2. **Il risultato in un conto.** Tre casi: `somma` (`t = f(a, b) + f(c, d)`, poi si scrive t), `variabile`
   (`t = f(a, b)`, poi si scrive `t * 2 + e` oppure `t - e`), `annidata` (`t = diff(diff(a, b), c)` con
   `diff(a, b)` che restituisce `a - b`). Opzioni: quattro uscite. Distrattori: i due valori scritti uno per riga,
   come se ogni chiamata stampasse; una sola chiamata; gli argomenti scambiati; nella chiamata annidata, quella
   esterna eseguita per prima (`a - (b - c)`).
   Esempio: `diff(diff(12, 5), 3)` → 4.
3. **Stampare o restituire.** Quattro casi, un quarto ciascuno: `perso` (la funzione restituisce, la chiamata è da
   sola su una riga e poi il programma scrive `Fine`: esce solo `Fine`); `stampa-dentro` (funzione `void` che
   stampa il risultato, chiamata due volte: escono i due numeri); `entrambe` (la funzione scrive `Calcolo` e poi
   restituisce; il programma somma due chiamate e scrive la somma: `Calcolo`, `Calcolo`, somma); `dopo-return`
   (una stampa di `Fatto` sotto `return`: esce solo il numero). Opzioni: quattro uscite su più righe, tra cui "non
   scrive niente". Le due chiamate danno numeri diversi.
4. **Una funzione ne chiama un'altra.** Due funzioni: la prima calcola (`punti` con 3 punti a vittoria, `totale`
   = scritto + orale, `durata`), la seconda restituisce il confronto del risultato con una soglia
   (`qualificata`: `>=` 8-11; `promosso`: `>=` 11-13; `lungo`: `>` 90-120). Il programma principale ha due
   selezioni che scrivono una parola o l'altra. Le opzioni sono le quattro coppie di parole; i quattro casi
   (`vero-vero`, `vero-falso`, `falso-vero`, `falso-falso`) escono un quarto ciascuno. Metà delle volte la prima
   coppia di argomenti dà esattamente la soglia, dove `>=` e `>` rispondono in modo diverso.
5. **Quale funzione restituisce questo.** La consegna a parole. Opzioni: quattro funzioni mostrate da sole, con
   parametri di una lettera. Famiglie, un quarto ciascuna: `punti` (k per vittoria, k = 2-5), `durata`, `voto`
   (k = 2-4), `resto` (`s - k * n`, k = 2-6). Il programma intero di ogni opzione chiama la funzione su due coppie
   e scrive i risultati. Distrattori: i parametri scambiati nella formula, la parentesi di troppo, un parametro
   dimenticato, l'operazione sbagliata.
6. **Scrivere una funzione con return.** Risposta aperta. Il programma legge due interi (la lettura c'è già); lo
   studente scrive la funzione con il nome e i parametri dati, la chiama e scrive il risultato. Famiglie: `punti`,
   `durata`, `voto`, e `maggiore` (il più grande, o il più piccolo, di due numeri, con una selezione e due
   `return`). Tre prove con tre risultati diversi; per `maggiore`, almeno una con il primo più grande e una con il
   secondo. La risposta deve contenere una funzione definita e chiamata dallo studente (`funzione`). A scelta
   multipla: quattro funzioni, come nel livello 5.

## Vincoli

- Quattro opzioni diverse; i distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore.
- Nel livello 1 il risultato con gli argomenti scambiati è sempre diverso da quello giusto.
- Righe di al più 34 caratteri nelle opzioni e di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor.
- I casi di un livello escono nelle stesse quote.

## Da evitare

Funzioni simmetriche nei livelli 1-3 (un prodotto, una somma); valori vero o falso stampati; una funzione che
stampa al posto di restituire usata dentro un'espressione (in Python scrive `None`, in C++ non compila: è nella
lezione, non negli esercizi); `return` dimenticato in una funzione C++ con un tipo (comportamento non definito).
