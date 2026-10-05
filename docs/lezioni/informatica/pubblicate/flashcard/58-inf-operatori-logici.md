# Flashcard: Gli operatori logici

## operatori-logici
Su che tipo di valori lavorano gli operatori logici?
---
Sui valori booleani, cioè sulle condizioni, e danno a loro volta vero o falso.

## scrittura-cpp
Come si scrivono in C++ gli operatori `and`, `or` e `not` di Python?
---
`&&`, `||` e `!`.

## and-quando
Quando è vera la condizione `A and B`?
---
Solo quando A e B sono vere tutte e due.

## or-quando
Quando è falsa la condizione `A or B`?
---
Solo quando A e B sono false tutte e due.

## giostra
La giostra chiede `altezza >= 120 and eta >= 8`. Sale chi è alto $130$ centimetri e ha $7$ anni?
---
No: il primo confronto è vero ma il secondo è falso, e con `and` devono essere veri tutti e due.

## cinema-confini
Il ridotto spetta se `eta < 14 or eta >= 65`. Chi lo paga tra chi ha $14$ anni e chi ne ha $65$?
---
Solo chi ne ha $65$: `14 < 14` è falsa, `65 >= 65` è vera.

## or-tutte-e-due
Vero o falso: `A or B` è falsa quando A e B sono vere tutte e due.
---
Falso. `or` è vero quando è vera almeno una delle due, quindi anche con tutte e due.

## lato-incompleto
Che cosa non va in `giorno == 6 or 7`?
---
A destra dell'`or` c'è solo il numero $7$, che vale come vero: la condizione è sempre vera. Si scrive `giorno == 6 or giorno == 7`.

## not
Se `promosso` è falso, quanto vale `not promosso`?
---
Vero: `not` rovescia il valore.

## contrario-minore
Qual è il contrario di `eta < 18`?
---
`eta >= 18`. Non `eta > 18`, che lascerebbe fuori chi ha esattamente $18$ anni.

## tabella-and
Nella tabella di verità di `and`, quante delle quattro righe danno vero?
---
Una sola: quella con A vera e B vera.

## precedenza
In `a or b and c`, quale operatore si calcola per primo?
---
`and`: la condizione si legge `a or (b and c)`.

## precedenza-valori
Quanto vale `True or False and False`? E `(True or False) and False`?
---
La prima è vera, perché si calcola prima l'`and`; la seconda, con le parentesi, è falsa.

## not-cpp
In C++, perché `!eta >= 18` non è il contrario di `eta >= 18`?
---
Perché `!` viene prima dei confronti e nega solo `eta`. Si scrive `!(eta >= 18)`.

## intervallo
Come si scrive "il voto è tra $1$ e $10$" con un operatore logico?
---
`1 <= voto and voto <= 10` in Python, `1 <= voto && voto <= 10` in C++.

## intervallo-cpp
In C++, perché `1 <= voto <= 10` non controlla l'intervallo?
---
Perché calcola prima `1 <= voto`, che vale $1$ o $0$, e poi confronta quel numero con $10$: sarebbe vera per qualunque voto.

## de-morgan-and
Qual è il contrario di "A e B", secondo le leggi di De Morgan?
---
"Non A, oppure non B": si nega ogni pezzo e la "e" diventa "o".

## de-morgan-intervallo
Qual è la negazione di `1 <= voto and voto <= 10`?
---
`voto < 1 or voto > 10`.

## negazione-sbagliata
Per quali voti è vera `voto < 1 and voto > 10`?
---
Per nessuno: un numero non può essere insieme minore di $1$ e maggiore di $10$.
