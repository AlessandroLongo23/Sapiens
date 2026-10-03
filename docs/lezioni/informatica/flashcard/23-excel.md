# Flashcard: Celle, valori e formule

## cella-indirizzo
Come si scrive l'indirizzo della cella che sta nella colonna `D`, riga 7?
---
`D7`. Prima la lettera della colonna, poi il numero della riga.

## colonna-dopo-z
Che nome ha la colonna che viene subito dopo la `Z`?
---
`AA`. Finite le lettere singole si passa a due lettere: `AA`, `AB`, `AC`.

## intervallo-definizione
Che cos'è un intervallo?
---
Un rettangolo di celle vicine, indicato dalla cella in alto a sinistra e da quella in basso a destra separate dai due punti, come `C2:D4`.

## intervallo-quante-celle
Quante celle contiene l'intervallo `B2:C5`?
---
8. Le colonne sono 2 (`B` e `C`) e le righe sono 4 (da 2 a 5): $2 \cdot 4 = 8$.

## intervallo-righe
Quante celle contiene l'intervallo `A3:A9`?
---
7. Da 3 a 9 le righe sono $9 - 3 + 1 = 7$: si contano anche la prima e l'ultima.

## formula-inizio
Con quale carattere comincia sempre una formula?
---
Con il segno `=`.

## formula-senza-uguale
Che cosa mostra una cella in cui scrivi `5+3`, senza altro?
---
Il testo 5+3. Senza il segno `=` davanti il foglio non calcola niente.

## riferimento-definizione
Che cos'è un riferimento?
---
L'indirizzo di una cella scritto dentro una formula, al posto del numero che la cella contiene.

## contenuto-e-valore
Vero o falso: una cella che mostra 10 contiene per forza il numero 10.
---
Falso. Può contenere una formula, come `=B2*C2`, di cui 10 è il risultato.

## operatori-per-diviso
Con quali simboli si scrivono la moltiplicazione e la divisione in una formula?
---
Con l'asterisco `*` e con la barra `/`.

## operatore-potenza
Che cosa calcola `=A1^2`?
---
Il quadrato del valore di `A1`: il simbolo `^` è la potenza.

## precedenza-mista
`A1` vale 2, `B1` vale 3, `C1` vale 4. Quanto vale `=A1+B1*C1`?
---
14. Prima la moltiplicazione: $3 \cdot 4 = 12$, poi $2 + 12 = 14$.

## precedenza-parentesi
`A1` vale 2, `B1` vale 3, `C1` vale 4. Quanto vale `=(A1+B1)*C1`?
---
20. Prima la parentesi: $2 + 3 = 5$, poi $5 \cdot 4 = 20$.

## media-senza-parentesi
Perché `=B1+B2+B3/3` non calcola la media di tre voti?
---
Perché divide per 3 solo `B3`. Servono le parentesi: `=(B1+B2+B3)/3`.

## cella-vuota-valore
Quanto vale, in un calcolo, una cella vuota?
---
0.

## ricalcolo
Che cosa succede alle formule quando cambi il numero di una cella?
---
Il foglio ricalcola da solo tutte le formule che usano quella cella, e a catena quelle che usano i loro risultati.

## errore-div0
Quale errore compare se una formula divide per una cella vuota?
---
`#DIV/0!`. Una cella vuota vale 0, e la divisione per zero non si può fare.

## errore-valore
`A2` contiene la parola Quaderno. Che cosa mostra `=A2+1`?
---
`#VALORE!`. Con un testo non si possono fare calcoli.

## errore-nome
Che cosa vuol dire l'errore `#NOME?` in una cella?
---
Che nella formula c'è una parola che il foglio non riconosce, come un nome scritto male o un riferimento senza il numero di riga.

## riferimento-circolare
Nella cella `D2` scrivi `=B2+D2`. Che problema c'è?
---
È un riferimento circolare: la formula usa la cella in cui è scritta, e il calcolo non può finire.
