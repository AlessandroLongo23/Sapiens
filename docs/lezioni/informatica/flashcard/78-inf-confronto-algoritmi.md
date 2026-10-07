# Flashcard: Confrontare gli algoritmi contando le operazioni

## perche-contare
Perché per confrontare due algoritmi si contano le operazioni e non si cronometra?
---
Perché il tempo dipende dal computer e da che cos'altro sta facendo; il numero di confronti e di scambi dipende solo dall'algoritmo e dai dati.

## dove-il-contatore
Dove va scritta l'istruzione `confronti = confronti + 1`?
---
Prima della selezione che confronta i due elementi, non dentro.

## contatore-dentro-if
Che cosa conta un contatore aumentato dentro l'`if`, accanto allo scambio?
---
Gli scambi, non i confronti: aumenta solo quando il confronto finisce con uno scambio.

## caso-migliore-peggiore
Che cosa sono il caso migliore e il caso peggiore di un algoritmo?
---
L'ingresso su cui fa meno operazioni e quello su cui ne fa di più, a parità di numero di elementi.

## bolle-in-ordine
Quanti confronti fa l'ordinamento a bolle con la bandierina su $12$ elementi già in ordine?
---
$11$: un solo giro, senza scambi.

## selezione-in-ordine
Quanti confronti fa l'ordinamento per selezione su $12$ elementi già in ordine?
---
$66$, cioè $\frac{12 \cdot 11}{2}$: fa sempre gli stessi confronti, qualunque sia l'ordine.

## selezione-scambi
Vero o falso: l'ordinamento per selezione su $n$ elementi fa al massimo $n - 1$ scambi.
---
Vero: al più uno per ogni posto da riempire.

## rovesciato-tutti
Su un vettore rovesciato di $12$ elementi, quale dei tre ordinamenti fa meno confronti?
---
Nessuno: ne fanno $66$ tutti e tre. La selezione però fa solo $6$ scambi.

## bolle-inserimento-mosse
Sullo stesso vettore, sono di più gli scambi delle bolle o gli spostamenti dell'inserimento?
---
Sono uguali: ognuno rimette a posto una coppia di elementi che era nell'ordine sbagliato.

## sequenziale-peggiore
Quanti confronti fa la ricerca sequenziale per scoprire che un valore non è tra $12$ elementi?
---
$12$, uno per elemento.

## binaria-peggiore
Quanti confronti fa al massimo la ricerca binaria su $12$ elementi in ordine?
---
$4$: a ogni confronto scarta metà di quello che resta.

## raddoppio-sequenziale
La ricerca sequenziale fa $400$ confronti nel caso peggiore su $400$ elementi. Quanti su $800$?
---
$800$: cresce come $n$, quindi raddoppia.

## raddoppio-binaria
La ricerca binaria fa al massimo $9$ confronti su $400$ elementi. Quanti su $800$?
---
$10$: cresce come $\log_2 n$, e a ogni raddoppio aumenta di $1$.

## raddoppio-ordinamento
Un ordinamento fa $4950$ confronti su $100$ elementi rovesciati. Circa quanti su $200$?
---
Circa $20\,000$ (sono $19\,900$): cresce come $n^2$, quindi diventa il quadruplo.

## cresce-come-quadrato
Vero o falso: "cresce come $n^2$" vuol dire che i confronti sono esattamente $n^2$.
---
Falso. Sono $\frac{n(n - 1)}{2}$; vuol dire che quando $n$ raddoppia diventano circa il quadruplo.

## log-due
Che cos'è $\log_2 n$, detto con i dimezzamenti?
---
Il numero di volte che bisogna dimezzare $n$ per arrivare a $1$. Per esempio $\log_2 8 = 3$.

## non-regge
Che cosa vuol dire che un algoritmo non regge quando i dati crescono?
---
Che il lavoro cresce molto più in fretta dei dati: con una crescita come $n^2$, dieci volte i dati sono cento volte il lavoro.

## milione
Con un milione di elementi in ordine, quanti confronti fa al massimo la ricerca binaria?
---
$20$, perché $2^{20}$ supera di poco il milione.
