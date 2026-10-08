# Flashcard: Scomporre un problema: la progettazione top-down

## top-down-definizione
Che cos'è la progettazione top-down?
---
Partire dal problema intero e dividerlo in pochi sottoproblemi più piccoli, dividendo ancora quelli troppo grandi.

## sottoproblema
Quante cose deve fare un sottoproblema ben scelto?
---
Una sola.

## quando-fermarsi
Quando si smette di scomporre?
---
Quando ogni pezzo si scrive in poche righe con quello che sai già: una lettura, un ciclo con un contatore, una selezione.

## albero
Che cosa mostra l'albero della scomposizione?
---
In cima il problema, e sotto ogni problema i sottoproblemi in cui è stato diviso.

## due-cose
Un sottoproblema è descritto così: "legge i voti e decide l'esito". Che cosa non va?
---
Fa due cose: la "e" lo segnala. Va diviso in due sottoproblemi, e in due funzioni.

## funzione-per-sottoproblema
Che cosa diventa ogni sottoproblema nel programma?
---
Una funzione, con un nome che dice che cosa fa.

## prima-del-corpo
Che cosa si decide di una funzione prima di scriverne il corpo?
---
Che cosa riceve e che cosa restituisce: è quello che le altre funzioni devono sapere di lei.

## riceve-restituisce
La funzione `esito(quante)` decide l'esito di uno studente. Che cosa riceve e che cosa restituisce?
---
Riceve il numero di insufficienze e restituisce il testo dell'esito.

## ramo-chiamata
Nell'albero "leggere un voto valido" sta sotto "contare le insufficienze". Che cosa vuol dire per le due funzioni?
---
Che `insufficienze` chiama `leggi_voto`: un ramo dell'albero diventa una chiamata.

## ordine-scrittura
Da quale parte del programma si comincia a scrivere?
---
Dal programma principale, scritto come se le funzioni che chiama ci fossero già.

## funzione-vuota
Che cos'è una funzione ancora vuota?
---
Una funzione con il nome e i parametri giusti e un corpo provvisorio, che restituisce un valore fisso.

## vuota-a-che-serve
A che cosa serve eseguire il programma quando le funzioni sono ancora vuote?
---
A controllare il programma principale: i giri del ciclo, gli argomenti delle chiamate, i contatori. I risultati sono finti.

## vuote-uscita
`insufficienze` è ancora vuota e restituisce sempre $0$; il programma principale conta come ammesso chi ha $0$ insufficienze. Con $2$ studenti, quanti ammessi scrive?
---
$2$: per il programma tutti hanno $0$ insufficienze.

## pass
In Python, che cosa si scrive nel corpo di una funzione che non ha ancora niente da fare?
---
`pass`, l'istruzione che non fa nulla: il corpo non può mancare.

## vuota-cpp
In C++ una funzione dichiarata `int` è ancora vuota. Che cosa deve contenere comunque?
---
Un `return` del tipo dichiarato, per esempio `return 0;`.

## una-alla-volta
Dopo il programma principale, come si procede con le funzioni?
---
Se ne riempie una, si esegue il programma, e solo quando funziona si passa alla successiva.

## dove-errore
Hai appena riempito una funzione e il programma, che prima funzionava, dà un risultato sbagliato. Dove cerchi l'errore?
---
Nella funzione appena scritta: è l'unica cosa cambiata.

## regola-cambia
La regola dell'esito cambia: giudizio sospeso fino a due insufficienze. Quali funzioni vanno modificate?
---
Solo `esito`: le altre funzioni e il programma principale non la conoscono.

## partire-dai-dettagli
Perché non conviene cominciare dalla funzione più facile, in fondo all'albero?
---
Perché non sai ancora chi la chiamerà e con quali argomenti: rischi che alla fine non si incastri con il resto.
