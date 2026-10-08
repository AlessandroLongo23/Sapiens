# Flashcard: L'ordinamento per inserimento

## idea-inserimento
Come ordina un vettore l'ordinamento per inserimento?
---
Prende gli elementi uno alla volta e inserisce ciascuno al posto giusto tra quelli alla sua sinistra, già in ordine tra loro.

## primo-elemento
Perché il ciclo esterno parte dall'elemento di indice $1$ e non da quello di indice $0$?
---
Perché un elemento da solo è già in ordine: il primo non ha niente alla sua sinistra con cui confrontarsi.

## spostamento
Che cos'è uno spostamento?
---
Un elemento più grande di quello da inserire passa nella cella alla sua destra: `v[j + 1] = v[j]`.

## quando-si-ferma
Quando si ferma la ricerca del posto per l'elemento da inserire?
---
Quando trova un elemento che non è più grande, oppure quando arriva all'inizio del vettore.

## inserire-a-mano
I primi tre elementi sono $2$, $6$, $9$ e il quarto è $4$. Com'è il vettore dopo il suo inserimento?
---
$2$, $4$, $6$, $9$: il $9$ e il $6$ si spostano di un posto a destra, il $2$ ferma la ricerca.

## conta-inserimento
Per inserire il $4$ dopo $2$, $6$, $9$, quanti confronti e quanti spostamenti servono?
---
$3$ confronti (con $9$, $6$ e $2$) e $2$ spostamenti.

## in-ordine-tra-loro
Dopo l'inserimento dell'elemento di indice $i$, i primi $i + 1$ elementi sono al posto definitivo?
---
No: sono in ordine tra loro, ma un elemento più piccolo può arrivare dopo e spostarli.

## variabile-x
A che cosa serve la variabile `x`?
---
A tenere da parte l'elemento da inserire, perché il primo spostamento scrive sopra `v[i]`.

## senza-x
Che cosa succede ai valori $8$, $5$ se non copi l'elemento in `x`?
---
Diventano $8$, $8$: il $5$ viene coperto dal primo spostamento e l'$8$ compare due volte.

## posto-libero
Alla fine del `while`, in quale cella va messo `x`?
---
In `v[j + 1]`, il posto rimasto libero.

## condizione-while
Quali sono le due condizioni del `while`, e in che ordine?
---
`j >= 0` e poi `v[j] > x`: prima si controlla che l'indice sia nel vettore, poi si guarda l'elemento.

## condizioni-scambiate
Che cosa succede se scrivi `v[j] > x` prima di `j >= 0`?
---
Quando `j` vale $-1$ il programma guarda `v[-1]`: in C++ è fuori dal vettore, in Python è l'ultimo elemento e l'errore resta nascosto.

## caso-ordinato
Quanti confronti e quanti spostamenti su un vettore di $n$ elementi già in ordine?
---
$n - 1$ confronti e nessuno spostamento.

## caso-rovesciato
Quanti confronti su un vettore rovesciato di $6$ elementi?
---
$15$, cioè $1 + 2 + 3 + 4 + 5$, e altrettanti spostamenti.

## confronti-e-spostamenti
Vero o falso: per ogni elemento inserito i confronti sono sempre uno in più degli spostamenti.
---
Falso. Sono uno in più solo se la ricerca si ferma prima dell'inizio del vettore; altrimenti sono uguali.

## spostamento-o-scambio
Costa di più uno spostamento o uno scambio con `temp`?
---
Lo scambio: sono tre assegnamenti, lo spostamento è uno solo.

## decrescente
Che cosa cambi per ordinare dal più grande al più piccolo?
---
La seconda condizione del `while`: `v[j] < x` al posto di `v[j] > x`.
