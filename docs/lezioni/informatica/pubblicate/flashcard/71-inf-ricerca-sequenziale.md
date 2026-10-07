# Flashcard: La ricerca sequenziale

## ricerca-definizione
Come lavora la ricerca sequenziale?
---
Confronta gli elementi con il valore cercato uno dopo l'altro, dal primo, finché lo trova o finché il vettore finisce.

## serve-ordine
Vero o falso: la ricerca sequenziale funziona solo se il vettore è ordinato.
---
Falso. Guarda tutti gli elementi uno alla volta, quindi l'ordine non conta.

## trovato-partenza
Da quale valore parte la variabile `trovato`, e perché?
---
Da falso: prima del ciclo nessun elemento è stato ancora confrontato.

## else-nel-ciclo
Dentro il ciclo, alla selezione `arrivi[i] == x` viene aggiunto un `else` che mette `trovato` a falso. Da che cosa dipende la risposta del programma?
---
Solo dall'ultimo elemento: ogni elemento diverso cancella quello che era stato trovato prima.

## posizione-partenza
Perché `posizione` parte da $-1$?
---
Perché $-1$ non può essere un indice: se dopo il ciclo vale ancora $-1$, il valore non c'è.

## posto-in-classifica
La ricerca trova il pettorale all'indice $4$ del vettore degli arrivi. A che posto è arrivato?
---
Al quinto: gli indici partono da $0$, quindi il posto è `posizione + 1`.

## prima-o-ultima
`v` contiene $4$, $9$, $2$, $9$ e cerchi il $9$ con un ciclo `for` che non si ferma. Quanto vale `posizione` alla fine?
---
$3$, l'indice dell'ultimo $9$: il ciclo va avanti e sovrascrive l'indice $1$.

## condizione-while
Qual è la condizione del ciclo `while` che si ferma appena trova il valore?
---
`i < len(arrivi) and posizione == -1`, in C++ `i < N && posizione == -1`: ci sono ancora elementi e il valore non è stato trovato.

## senza-limite
Il ciclo va avanti con la sola condizione `arrivi[i] != x`. Che cosa succede se `x` non c'è?
---
`i` supera l'ultimo indice e il programma esce dal vettore: Python dà `IndexError`, il C++ legge la memoria che segue.

## funzione-risultato
`cerca(v, x)` restituisce l'indice di `x` oppure $-1$. `v` contiene $12$, $7$, $25$, $3$: quanto valgono `cerca(v, 25)` e `cerca(v, 8)`?
---
$2$ e $-1$.

## return-nel-ciclo
Nella funzione `cerca`, che cosa succede quando viene eseguito `return i` dentro il ciclo?
---
La funzione finisce subito e restituisce l'indice: gli elementi che restano non vengono guardati.

## return-meno-uno
Dove va scritto `return -1` nella funzione `cerca`?
---
Dopo il ciclo. In un `else` dentro il ciclo la funzione risponderebbe "non c'è" dopo aver guardato solo il primo elemento.

## contare-occorrenze
Per contare quante volte un valore compare nel vettore ci si può fermare al primo trovato?
---
No: vanno guardati tutti gli elementi, con un contatore che aumenta a ogni elemento uguale.

## confronti-indice
Il valore cercato è all'indice $6$. Quanti confronti fa la ricerca che si ferma appena lo trova?
---
$7$: i sei elementi che lo precedono e poi lui.

## caso-migliore
Qual è il caso migliore della ricerca sequenziale, e quanti confronti richiede?
---
Il valore è il primo elemento: un confronto, qualunque sia la dimensione del vettore.

## caso-peggiore
Un vettore ha $50$ elementi. Quanti confronti servono nel caso peggiore, e quando capita?
---
$50$: quando il valore è l'ultimo elemento, oppure non c'è.

## caso-medio
Un vettore ha $9$ elementi e il valore cercato c'è. Quanti confronti servono in media?
---
$5$, cioè $\dfrac{9 + 1}{2}$.

## assente-confronti
Vero o falso: se il valore non c'è, la ricerca sequenziale se ne accorge prima di arrivare in fondo.
---
Falso. Per dire che non c'è deve confrontare tutti gli elementi: è il caso peggiore.
