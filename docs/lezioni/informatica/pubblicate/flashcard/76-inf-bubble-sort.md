# Flashcard: L'ordinamento a bolle

## idea-bolle
Qual è la sola mossa che l'ordinamento a bolle ripete?
---
Confrontare due elementi vicini e scambiarli se sono nell'ordine sbagliato.

## giro
Che cos'è un giro nell'ordinamento a bolle?
---
Una passata sul vettore da sinistra, coppia per coppia, in cui ogni coppia di vicini viene confrontata e, se serve, scambiata.

## fine-primo-giro
Dove si trova l'elemento più grande alla fine del primo giro?
---
All'ultimo posto: da quando entra in un confronto viene scambiato ogni volta, fino in fondo.

## un-giro-a-mano
Il vettore è $4$, $9$, $2$, $6$. Com'è dopo il primo giro?
---
$4$, $2$, $6$, $9$: il $9$ viene scambiato prima con il $2$ e poi con il $6$.

## quanti-giri
Quanti giri servono al massimo per ordinare $n$ elementi?
---
$n - 1$: quando $n - 1$ elementi sono al loro posto, lo è anche l'ultimo rimasto.

## giro-piu-corto
Perché ogni giro può fermarsi un posto prima del precedente?
---
Perché gli elementi portati in fondo dai giri precedenti sono già al loro posto.

## indici-confronto
Nel ciclo interno, quali due elementi confronta il programma?
---
`v[j]` e `v[j + 1]`, cioè un elemento e il suo vicino di destra.

## limite-ciclo-interno
Nel giro `i`, qual è l'ultimo valore di `j`?
---
$n - 2 - i$: in Python `range(n - 1 - i)`, in C++ `j < n - 1 - i`.

## errore-indice
Che cosa succede se il ciclo interno arriva fino a `j` uguale a $n - 1$?
---
Il programma guarda `v[n]`, che non esiste: Python dà `IndexError`, il C++ legge un valore qualunque dalla memoria senza avvisare.

## confronti-sei
Quanti confronti fa l'ordinamento a bolle senza bandierina su $6$ elementi?
---
$15$, cioè $5 + 4 + 3 + 2 + 1$, qualunque sia l'ordine di partenza.

## formula-confronti
Quanti confronti fa l'ordinamento a bolle senza bandierina su $n$ elementi?
---
$\frac{n(n - 1)}{2}$.

## scambi-ordinato
Quanti scambi fa l'ordinamento a bolle su un vettore già in ordine?
---
Nessuno: ogni coppia di vicini è già nell'ordine giusto.

## scambi-rovesciato
Vero o falso: su un vettore rovesciato l'ordinamento a bolle fa uno scambio a ogni confronto.
---
Vero. Con $6$ elementi sono $15$ confronti e $15$ scambi.

## bandierina
Che cos'è una bandierina in un programma?
---
Una variabile booleana che ricorda se una cosa è successa. Qui `scambiato` ricorda se nel giro c'è stato uno scambio.

## giro-senza-scambi
Che cosa vuol dire un giro senza scambi?
---
Che ogni elemento è minore o uguale al suo vicino di destra: il vettore è in ordine e ci si può fermare.

## bandierina-ordinato
Con la bandierina, quanti confronti servono per un vettore di $6$ elementi già in ordine?
---
$5$: il primo giro non scambia niente e il programma si ferma.

## bandierina-dimenticata
Se dimentichi `scambiato = False` all'inizio del giro, il vettore esce ordinato?
---
Sì, ma il programma fa sempre tutti i giri: la bandierina resta alzata e non fa risparmiare niente.

## decrescente
Che cosa cambi nel programma per ordinare dal più grande al più piccolo?
---
Il confronto: `v[j] < v[j + 1]` al posto di `v[j] > v[j + 1]`.
