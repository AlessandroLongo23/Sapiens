# Flashcard: La selezione a due vie

## selezione
Che cos'è la selezione?
---
La struttura con cui il programma sceglie quali istruzioni eseguire guardando i dati che ha davanti.

## una-via
Che cosa fa una selezione a una via quando la condizione è falsa?
---
Salta il blocco e prosegue con le istruzioni che vengono dopo.

## sconto-ottanta
Il programma toglie $10$ a `spesa` solo se `spesa >= 50`, poi scrive `spesa`. Che cosa scrive con $80$? E con $30$?
---
$70$ con $80$, $30$ con $30$: nel secondo caso la condizione è falsa e il blocco viene saltato.

## sconto-confine
Il programma toglie $10$ a `spesa` solo se `spesa >= 50`. Che cosa cambia con $50$ se scrivi `>` al posto di `>=`?
---
Con `>=` lo sconto c'è e si paga $40$; con `>` la condizione è falsa e si paga $50$.

## blocco
Che cos'è il blocco di una selezione?
---
L'insieme delle istruzioni che il programma esegue solo quando la condizione è vera.

## blocco-python-cpp
Come si segna il confine del blocco in Python e in C++?
---
In Python con il rientro di quattro spazi delle righe sotto l'`if`; in C++ con le parentesi graffe.

## due-punti
Che cosa va in fondo alla riga dell'`if` in Python?
---
I due punti. Senza, il programma non parte.

## rientro-dimenticato
In Python, sotto `if spesa >= 50:` la riga `spesa = spesa - 10` è scritta senza rientro. Che cosa succede con `spesa` uguale a $30$?
---
I $10$ euro vengono tolti lo stesso: la riga è fuori dal blocco e viene eseguita sempre.

## punto-e-virgola
In C++, che cosa succede scrivendo `if (spesa >= 50);` con il punto e virgola?
---
La selezione si chiude su quella riga, e il blocco che segue viene eseguito sempre. Il compilatore non si ferma.

## senza-graffe
In C++, sotto un `if` senza graffe ci sono due istruzioni. Quali dipendono dalla condizione?
---
Solo la prima. La seconda viene eseguita sempre.

## due-vie
Quanti blocchi esegue una selezione a due vie?
---
Sempre uno solo: il primo se la condizione è vera, quello dell'`else` se è falsa.

## promosso-sei
`if voto >= 6` scrive "promosso", `else` scrive "bocciato". Che cosa esce con il voto $6$?
---
"promosso": $6 \geq 6$ è vera.

## else-condizione
Vero o falso: dopo `else` si scrive la condizione contraria a quella dell'`if`.
---
Falso. Dopo `else` non si scrive niente: ci arrivano già tutti i casi in cui la condizione dell'`if` è falsa.

## uguale-doppio
Perché `if (voto = 10)` in C++ è un errore anche se il programma parte?
---
Perché `=` assegna: mette $10$ in `voto` e la condizione risulta sempre vera. Il confronto è `==`.

## pari
Quale condizione dice che il numero intero `n` è pari?
---
`n % 2 == 0`: il resto della divisione per $2$ è zero.

## resto
Quanto valgono `7 % 2` e `10 % 2`?
---
$1$ e $0$: sono i resti delle divisioni per $2$.

## rombo-una-via
Nel diagramma di una selezione a una via, che cosa c'è sul ramo del no?
---
Niente: la freccia scende dritta fino al punto in cui i due rami si riuniscono.
