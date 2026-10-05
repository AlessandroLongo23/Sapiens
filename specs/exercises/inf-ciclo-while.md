# inf-ciclo-while: Il ciclo while

Lezione: `docs/lezioni/informatica/riscritte/60-inf-ciclo-while.md`. Generatore di riferimento per gli esercizi che
mostrano o chiedono un diagramma di flusso o un programma (`src/lib/exercises/v2/inf-programmi.ts`).

Ogni esercizio parte da un ciclo scritto una volta sola, nel linguaggio dei blocchi `diagramma`. Tre famiglie, con i
numeri estratti ogni volta:

- `rovescia`: `i` parte da un valore tra 9 e 17 e scende di 1, 2 o 3 finché è maggiore di zero; a ogni giro si
  scrive `i`, alla fine "via";
- `salita`: `i` parte da un valore tra 1 e 5 e sale di 2, 3 o 4 fino a un limite compreso; a ogni giro si scrive `i`;
- `somma`: la somma dei numeri da 1 a n, con n tra 4 e 7, scritta alla fine.

Vincoli di ogni livello: il corpo gira da 2 a 7 volte; solo numeri interi non negativi, senza `/`; le tre famiglie
escono ciascuna in circa un terzo dei casi; quattro opzioni che scrivono cose diverse.

Distrattori, presi dagli errori veri: la condizione spostata di uno (`>` e `>=`, `<` e `<=`); il passo prima
dell'istruzione del giro; il valore di partenza sbagliato; il limite sbagliato; il passo sbagliato; la somma che
parte da 1; l'accumulatore sovrascritto (`somma = i`).

## Livelli

1. **Che cosa scrive un ciclo.** Il programma, nei due linguaggi; opzioni: quattro uscite.
   Esempio: `i = 9`, `while i > 0`, scrive `i`, `i = i - 3`, poi "via" → 9, 6, 3, via.
2. **Quanti giri fa un ciclo.** Il programma; opzioni: quattro numeri di giri (quello giusto, uno in più, uno in meno).
   Esempio: lo stesso ciclo → 3 volte.
3. **Dal diagramma al programma.** Il diagramma; opzioni: quattro programmi, di cui uno solo fa quello che fa il
   diagramma.
4. **Dal programma al diagramma.** Il programma; opzioni: quattro diagrammi.
5. **Costruire il diagramma di un ciclo.** La consegna a parole ("somma i numeri da 1 a 6 e scrive il risultato").
   Risposta aperta: lo studente costruisce il diagramma, che viene eseguito e deve scrivere quello che scrive la
   soluzione. A scelta multipla: come il livello 4, con la consegna al posto del programma.
6. **Scrivere un ciclo.** La stessa consegna. Risposta aperta: lo studente scrive il programma, in Python o in C++,
   che viene eseguito e deve stampare quello che stampa la soluzione. A scelta multipla: come il livello 3.

## Da evitare

Cicli che non finiscono tra le opzioni giuste; più di 7 giri (la traccia a mano diventa lunga); numeri negativi con
`//` e `%`, e la divisione `/`, che nei due linguaggi danno risultati diversi.
