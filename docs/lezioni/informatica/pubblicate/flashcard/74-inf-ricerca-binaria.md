# Flashcard: La ricerca binaria

## idea
Che cosa fa la ricerca binaria a ogni giro?
---
Confronta il valore cercato con l'elemento centrale della parte ancora da esaminare e, se non è lui, continua solo nella metà in cui può trovarsi.

## vettore-ordinato
Quale condizione deve rispettare il vettore perché la ricerca binaria funzioni?
---
Deve essere ordinato: solo così si sa che tutto quello che sta a sinistra di un elemento è più piccolo e tutto quello che sta a destra è più grande.

## sinistra-destra
Che cosa indicano `sinistra` e `destra`?
---
Gli indici del primo e dell'ultimo elemento della parte di vettore ancora da esaminare.

## centro-calcolo
`sinistra` vale $4$ e `destra` vale $7$. Quanto vale `centro`?
---
$5$: la somma è $11$, e la divisione intera per $2$ dà $5$.

## va-a-destra
`v[centro]` vale $17$ e cerchi $21$ in un vettore crescente. Quale indice cambia, e come?
---
`sinistra` diventa `centro + 1`: il $21$ può stare solo a destra del $17$.

## va-a-sinistra
`v[centro]` vale $26$ e cerchi $21$ in un vettore crescente. Quale indice cambia, e come?
---
`destra` diventa `centro - 1`: il $21$ può stare solo a sinistra del $26$.

## condizione-ciclo
Qual è la condizione del ciclo `while` della ricerca binaria?
---
`sinistra <= destra`: si continua finché resta almeno un elemento da esaminare.

## valore-assente
Come si accorge la ricerca binaria che il valore non c'è?
---
`sinistra` supera `destra`: tra i due indici non resta nessun elemento, e la funzione restituisce $-1$.

## perche-meno-uno
Perché la funzione `cerca` restituisce $-1$ quando il valore non c'è?
---
Perché un indice non è mai negativo: $-1$ non si confonde con una posizione.

## traccia-21
Nel vettore $3$, $8$, $12$, $17$, $21$, $26$, $34$, $40$ cerchi $21$. Quali elementi guarda la ricerca binaria?
---
$17$, poi $26$, poi $21$: tre confronti.

## errore-senza-uguale
Che cosa succede con `while sinistra < destra`, senza l'uguale?
---
Quando resta un solo elemento il ciclo si ferma senza guardarlo: se è quello cercato, la funzione restituisce $-1$.

## errore-centro
Che cosa rischi scrivendo `sinistra = centro` al posto di `sinistra = centro + 1`?
---
Un ciclo che non finisce: quando `centro` è uguale a `sinistra`, niente cambia più.

## vettore-disordinato
Vero o falso: su un vettore non ordinato la funzione `cerca` si ferma con un errore.
---
Falso. Non dà errori: restituisce una risposta sbagliata, per esempio $-1$ per un valore che c'è.

## mille-elementi
Quanti confronti servono al massimo alla ricerca binaria in un vettore ordinato di $1000$ elementi?
---
$10$: dimezzando si passa da $1000$ a $500$, $250$, $125$, $62$, $31$, $15$, $7$, $3$, $1$.

## raddoppio
Un vettore ordinato passa da $1000$ a $2000$ elementi. Di quanto aumentano i confronti della ricerca binaria, al massimo?
---
Di uno solo, da $10$ a $11$: il primo confronto riporta a un vettore di $1000$ elementi.

## confronto-sequenziale
In un vettore ordinato di $1000$ elementi, quanti confronti servono al massimo alla ricerca sequenziale e quanti alla binaria?
---
$1000$ alla sequenziale e $10$ alla binaria.

## quando-vince-sequenziale
In quale caso la ricerca sequenziale fa meno confronti della binaria?
---
Quando il valore è tra i primi elementi del vettore: il primo lo trova con un solo confronto.

## decrescente
Il vettore è in ordine decrescente. Come cambia il secondo confronto della funzione `cerca`?
---
Diventa `v[centro] > x`: se l'elemento centrale è più grande del valore cercato, il valore può stare solo a destra.
