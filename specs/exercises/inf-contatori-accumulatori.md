# inf-contatori-accumulatori: Contatori e accumulatori

Lezione: `docs/lezioni/informatica/riscritte/62-inf-contatori-accumulatori.md`. Usa `inf-programmi.ts` e
`inf-iter.ts`: ogni programma è scritto una volta nel linguaggio dei diagrammi (`params.source`) e mostrato con il
`for`, come fa la lezione. I dati che un programma riceve stanno in `params.tests`.

I dati hanno un contesto, che dà la variabile, la condizione e le parole della consegna:

| Contesto | Variabile | Condizione | Dati |
|---|---|---|---|
| `voti` | `voto` | `voto >= 6` | da 3 a 10 |
| `gradi` | `gradi` | `gradi < 0` | da −8 a 12 |
| `punti` | `punti` | `punti > T`, T tra 50, 80, 100, 120 | multipli di 10 da 20 a 200 |
| `eta` | `eta` | `eta >= 18` | da 12 a 25 |
| `costo` | `costo` | `costo <= T`, T tra 5, 10, 20 | da 1 a 2T + 5 |
| `pari` | `x` | `x % 2 == 0` | da 1 a 30 |
| `multipli` | `x` | `x % k == 0`, k da 3 a 5 | da 1 a 40 |

In una sequenza alcuni dati soddisfano la condizione e altri no; metà delle volte c'è il valore sul confine (un 6
tra i voti), che distingue `>=` da `>`. Il resto `%` si usa solo con dati positivi.

Distrattori, dai riquadri della lezione: l'accumulatore che parte dal valore sbagliato (la somma da 1, il prodotto
da 0), quello azzerato dentro il ciclo, il contatore aumentato fuori dalla selezione (conta tutti i dati), il
confine della condizione spostato, la condizione opposta, il dato messo al posto della somma (`somma = voto`), il
conto al posto della somma e viceversa, il ciclo con un giro in meno, la scrittura dentro il corpo.

## Livelli

1. **Contare i dati che interessano.** Il programma che conta e da 4 a 6 dati; opzioni: quattro numeri.
   Esempio: voti 4, 7, 8, 5 con `voto >= 6` → 2 (non 4, non 3, non 0).
2. **Sommare i dati.** Casi `tutto` e `parte` (la somma dei soli dati che soddisfano la condizione), da 3 a 5 dati.
   Esempio: prezzi 15, 5, 5, 11, 7 con `costo <= 5` → 10.
3. **Il prodotto parte da 1.** Casi `fattoriale` (n da 3 a 10), `potenza` (fino a un milione), `prodotto` di 3 o 4
   dati. Esempio: base 2, esponente 4 → 16 (non 0, non 9, non 8).
4. **Un errore nel programma.** Il programma ha uno degli errori della lezione e la consegna dice che cosa dovrebbe
   fare; si chiede che cosa scrive davvero. Casi: `azzerato`, `fuori` (un programma che conta e somma, con il
   contatore fuori dalla selezione: scrive due righe), `zero` (prodotto da 0), `uno` (conto o somma da 1),
   `sovrascritto`. Il risultato che il programma dovrebbe dare è sempre tra le opzioni sbagliate; `params.intended`
   è il programma senza errore.
5. **Costruire il diagramma di un totale.** Casi `somma`, `prodotto`, `potenza`, `fattoriale`: un ciclo solo, senza
   selezione, perché le opzioni sono diagrammi. Risposta aperta: il diagramma, eseguito su due o tre prove che
   scrivono cose diverse (per la potenza una ha esponente 0, per il fattoriale una ha n da 0 a 3).
6. **Scrivere un ciclo che conta o somma.** Casi `conta` (sei volte su dieci) e `somma` dei dati che soddisfano la
   condizione. Risposta aperta: il programma, su tre prove, una delle quali senza nessun dato che soddisfa la
   condizione. A scelta multipla: quattro programmi con il `for`.

## Vincoli

Numeri interi; nessun risultato oltre il limite di `int` (2 147 483 647); quattro opzioni diverse; nel livello 4
l'errore cambia quello che il programma scrive; i programmi sbagliati scrivono altro dal giusto su almeno una prova;
opzioni che sono programmi: al più 9 righe in Python e 34 caratteri per riga.

## Da evitare

Fattoriali oltre 10 e potenze oltre un milione; `%` con dati negativi; diagrammi con ciclo e selezione come opzioni
(due rombi sono troppo larghi); sequenze in cui tutti i dati, o nessuno, soddisfano la condizione nei livelli 1 e 2.
