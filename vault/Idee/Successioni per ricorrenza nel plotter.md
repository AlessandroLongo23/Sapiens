---
stato: fatta
aggiornato: 2026-10-02
tag: [idea, strumenti, matematica]
---
# Successioni per ricorrenza nel plotter

Fatta il 2 ottobre 2026, in forma generale: vedi lo stato in [[Grafico di funzioni]]. Restano da questa nota la tabella dei termini e i diagrammi a ragnatela.

## L'idea
Alessandro, 2 ottobre 2026, dopo l'esempio dell'insieme di Mandelbrot scritto con due righe per ogni passo: c'è una scrittura più compatta, che non chieda una coppia di funzioni nuove a ogni iterazione?

La scrittura della scuola è la ricorrenza: $a_{n+1} = a_n^2 - b_n^2 + x$, $b_{n+1} = 2a_nb_n + y$, con $a_0 = 0$ e $b_0 = 0$, e poi $a_{10}^2 + b_{10}^2 \le 4$. Cinque righe per qualunque numero di passi, e il numero di passi può essere un cursore.

## Perché potrebbe valere
Le successioni definite per ricorrenza sono nel programma del quarto anno: progressioni aritmetiche e geometriche, Fibonacci, il metodo di Newton, la bisezione, i punti fissi. Una riga "successione" avrebbe un uso suo, senza i frattali: i punti $(n; a_n)$ sul piano, la tabella dei termini, il limite a occhio. Il Mandelbrot ne esce come caso particolare.

## Cosa manca
- Il lettore non conosce le successioni: oggi $a_1$ è una lettera con il suo cursore. Servono la riga della ricorrenza ($a_{n+1} = \dots$), quella del valore iniziale ($a_0 = \dots$), e il termine usato in un'altra riga ($a_{10}$, $a_k$ con $k$ intero).
- Le ricorrenze accoppiate (due successioni che dipendono l'una dall'altra) vanno calcolate insieme, in un ciclo solo: è quello che serve al Mandelbrot.
- Il calcolo è un ciclo, senza nessun albero: il costo cresce con il numero di passi.
- Il disegno di una successione che non dipende da $x$: punti, non una curva.
- Le ricorrenze a due passi (Fibonacci) chiedono due valori iniziali.

## Dubbi e conflitti
- $a_1$ oggi è un parametro: con una successione $a$ definita diventa il suo termine. Va deciso cosa vince.
- I numeri complessi ($z_{n+1} = z_n^2 + c$) sarebbero la scrittura più corta per il Mandelbrot, ma tutto il plotter lavora con numeri reali: campionamento, disequazioni, punti. Parere di Claude: forzato per questo strumento, da non fare.
- Un operatore di iterazione ($f$ applicata dieci volte) non è una scrittura della scuola.

## Collegamenti
- [[Grafico di funzioni]]
