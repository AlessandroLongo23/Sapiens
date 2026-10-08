# Flashcard: Parametri e valore di ritorno

## parametro-argomento
Che differenza c'è tra parametro e argomento?
---
Il parametro è la variabile dichiarata nella definizione; l'argomento è il valore scritto nella chiamata.

## riconosci-argomento
Nella riga `t = punti(4, 2)`, quali sono gli argomenti?
---
$4$ e $2$.

## ordine
La definizione è `def punti(vinte, pareggi):`. Con la chiamata `punti(2, 5)`, quanto vale `pareggi`?
---
$5$: il secondo argomento va nel secondo parametro.

## ordine-conto
`punti(vinte, pareggi)` restituisce `3 * vinte + pareggi`. Quanto vale `punti(1, 4)`? E `punti(4, 1)`?
---
$7$ e $13$: scambiando gli argomenti cambia il risultato.

## nomi-diversi
Vero o falso: nella chiamata `punti(v, p)` le variabili devono avere gli stessi nomi dei parametri.
---
Falso. Conta il posto degli argomenti, non il nome.

## argomento-espressione
Con `v = 5`, che valori ricevono i due parametri nella chiamata `scheda(v, v - 2)`?
---
$5$ e $3$: un'espressione viene calcolata prima della chiamata.

## numero-argomenti
La funzione `scheda` ha due parametri. Che cosa succede in Python con la chiamata `scheda(4)`?
---
Il programma si ferma con un `TypeError`: manca un argomento.

## return
Quali due cose fa l'istruzione `return` seguita da un valore?
---
Restituisce il valore a chi ha chiamato e chiude la funzione.

## dopo-return
Nel corpo di una funzione c'è una stampa subito sotto `return`, nello stesso blocco. Quando viene eseguita?
---
Mai: `return` chiude la funzione.

## posto-della-chiamata
`doppio(x)` restituisce `2 * x`. Quanto vale `doppio(3) + 1`?
---
$7$: il valore restituito, $6$, prende il posto della chiamata.

## chiamata-annidata
`doppio(x)` restituisce `2 * x`. Quanto vale `doppio(doppio(3))`?
---
$12$: la chiamata interna dà $6$, che diventa l'argomento di quella esterna.

## tipo-cpp
In C++, che cosa dice `int` all'inizio di `int punti(int vinte, int pareggi)`?
---
Che la funzione restituisce un numero intero.

## stampa-o-restituisce
Una funzione scrive il risultato con una stampa e non ha `return`. Il programma può sommare quel risultato a un altro numero?
---
No: il risultato è finito sullo schermo e non è tornato a chi ha chiamato.

## none
In Python, quanto vale `t` dopo `t = saluta()`, se `saluta` non ha `return`?
---
`None`, il valore speciale che vuol dire "nessun valore".

## valore-perso
`punti(4, 2)` restituisce $14$. Che cosa compare sullo schermo se la chiamata è scritta da sola su una riga?
---
Niente: il valore viene calcolato e nessuno lo usa.

## funzione-chiama-funzione
`qualificata` chiama `punti` nel suo corpo. Mentre `punti` è in esecuzione, che cosa fa `qualificata`?
---
Aspetta, e riprende quando `punti` ha restituito il suo valore.

## vero-falso
`sufficiente(voto)` restituisce `voto >= 6`. Che cosa restituisce `sufficiente(5)`?
---
Falso.

## condizione
Come si usa in una selezione una funzione `pari(n)` che restituisce vero o falso?
---
Direttamente come condizione: `if pari(n):` in Python, `if (pari(n))` in C++.
