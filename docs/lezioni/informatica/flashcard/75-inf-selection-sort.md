# Flashcard: L'ordinamento per selezione

## ordinare
Che cosa vuol dire ordinare un vettore?
---
Spostare i suoi elementi finché sono in ordine crescente.

## idea
Che cosa fa l'ordinamento per selezione a ogni giro?
---
Cerca il più piccolo tra gli elementi non ancora sistemati e lo scambia con il primo di loro.

## indice-i
Nell'ordinamento per selezione, che cosa indica `i`?
---
Il posto da riempire in questo giro: gli elementi alla sua sinistra sono già al loro posto.

## imin
`imin` contiene un valore del vettore o una posizione?
---
Una posizione: l'indice del più piccolo trovato finora. Il valore è `v[imin]`.

## imin-partenza
Da quale valore parte `imin` all'inizio di ogni giro?
---
Da `i`: per ora il più piccolo è l'elemento che occupa già il posto.

## confronto
Quale confronto fa cambiare `imin` nel ciclo interno?
---
`v[j] < v[imin]`: se è vero, `imin` diventa `j`.

## scambio-temp
Scrivi le tre assegnazioni che scambiano `v[i]` e `v[imin]`.
---
`temp = v[i]`, poi `v[i] = v[imin]`, poi `v[imin] = temp`.

## scambio-senza-temp
`v[0]` vale $15$ e `v[1]` vale $12$. Dopo `v[0] = v[1]` e poi `v[1] = v[0]`, quanto valgono?
---
Tutti e due $12$: la prima assegnazione ha cancellato il $15$.

## primo-giro
Il vettore è $15$, $12$, $19$, $13$, $17$, $14$. Com'è dopo il primo giro?
---
$12$, $15$, $19$, $13$, $17$, $14$: il $12$ si scambia con il $15$.

## secondo-giro
Il vettore è $12$, $15$, $19$, $13$, $17$, $14$ e `i` vale $1$. Quanto vale `imin` alla fine del giro?
---
$3$: il più piccolo dall'indice $1$ in poi è il $13$.

## nessuno-scambio
Quando un giro finisce senza scambio?
---
Quando `imin` è uguale a `i`: il più piccolo degli elementi rimasti è già al suo posto.

## quanti-giri
Quanti giri fa l'ordinamento per selezione su un vettore di $6$ elementi?
---
$5$: quando cinque elementi sono al loro posto, lo è anche il sesto.

## confronti-sei
Quanti confronti fa l'ordinamento per selezione su un vettore di $6$ elementi?
---
$15$: sono $5 + 4 + 3 + 2 + 1$.

## confronti-formula
Quanti confronti fa l'ordinamento per selezione su un vettore di $n$ elementi?
---
$\dfrac{n(n - 1)}{2}$, qualunque sia l'ordine di partenza.

## scambi-massimo
Quanti scambi fa al massimo l'ordinamento per selezione su un vettore di $n$ elementi?
---
$n - 1$: al massimo uno per giro.

## gia-ordinato
Vero o falso: su un vettore già in ordine l'ordinamento per selezione non fa confronti.
---
Falso. Non fa scambi, ma i confronti sono gli stessi: cerca il minimo in ogni giro anche quando è già al suo posto.

## errore-confronto
Che cosa succede se nel ciclo interno scrivi `v[j] < v[i]` al posto di `v[j] < v[imin]`?
---
`imin` finisce sull'ultimo elemento più piccolo di `v[i]`, che può non essere il più piccolo: il vettore non esce ordinato.

## decrescente
Che cosa cambi nella funzione `ordina` per avere l'ordine decrescente?
---
Il confronto: `v[j] > v[imin]`. L'indice diventa quello del più grande degli elementi rimasti.
