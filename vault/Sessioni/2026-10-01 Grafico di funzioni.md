---
aggiornato: 2026-10-01
tag: [sessione, strumenti, matematica]
---
# 2026-10-01 Grafico di funzioni

Sessione di sparring del 1° ottobre 2026, dopo la tavola periodica e gli orbitali. Alessandro ha chiesto il plotter delle funzioni come strumento, con due proposte: una libreria esterna per il lavoro pesante, e per l'input la stessa infrastruttura delle risposte aperte.

## Cosa si è discusso
Sull'input Claude era d'accordo a metà. Il campo di MathLive si riusa, il correttore no: conosce solo le operazioni dell'algebra ed è fatto per il confronto esatto.

Sulla libreria Claude ha obiettato. Desmos e GeoGebra chiedono una licenza per l'uso commerciale (Desmos API Terms dell'11 luglio 2025; pagina License di GeoGebra; lette il 1° ottobre 2026). Le librerie libere (Mafs, function-plot, JSXGraph) portano il loro aspetto, mentre il 29 settembre si era deciso che il piano cartesiano ha l'identità del TikZ e serve anche a lezioni, fisica ed esercizi: il plotter è il punto 13 dell'Agenda sotto un altro nome. Alessandro ha scelto il piano nostro.

Sul valore: nessuno lascia Desmos per un plotter peggiore. Quello che la scuola italiana chiede e Desmos non dà è lo studio di funzione con i passaggi, che però vuole calcolo simbolico. Si è scelta una via di mezzo, i punti notevoli trovati con i numeri.

## Decisioni
- [[2026-10-01 Il piano cartesiano lo disegniamo noi sul kit, senza librerie di grafici]]
- [[2026-10-01 Il plotter delle funzioni è il primo uso del piano cartesiano del sito]]
- [[2026-10-01 Il plotter trova i punti notevoli, senza lo studio di funzione]]
- [[2026-10-01 Nel plotter si scrivono funzioni, equazioni implicite, disequazioni e curve parametriche]] (più ampio del consiglio di Claude)
- [[2026-10-01 Il plotter esce a passi e si progetta per telefono e computer insieme]]

## Informazioni nuove
- Nelle lezioni il plotter si usa quasi sempre con le funzioni già inserite, a sostegno di esempi ed esercizi svolti; in poche occasioni con una scelta tra opzioni (controllo a segmenti, una stringa LaTeX per opzione) o con un campo libero (Alessandro).
- Il Compute Engine ha un ingresso che legge solo il LaTeX: 414 kB, 112 kB compressi. Riconosce da solo funzioni, equazioni, disequazioni e coppie parametriche.
- Nella ricerca "grafico di funzione online" (dagli Stati Uniti, ordine su google.it da verificare) il primo risultato è YouMath con "studio e grafico di funzioni"; poi Aranzulla, mathe-fa.de e le guide che rimandano a Desmos e GeoGebra.

## Cosa si è fatto
Il prototipo del primo passo, sul branch `grafico-funzioni`, alla rotta di prova `/prova-grafico`: lettore delle formule, campionamento, punti notevoli, piano in SVG, elenco delle formule con MathLive, cursori dei parametri. Dopo la prima prova di Alessandro, che ha trovato due formule non lette, si sono aggiunte le somme su un indice, le funzioni con un nome e le loro derivate. 27 test nuovi, tutti verdi. Dettaglio in [[Grafico di funzioni]]. Non committato e non pubblicato.

## Seguito del 2 ottobre 2026
Dopo la prova di Alessandro: il primo lotto di impostazioni e comodità (elenco dal confronto con Desmos e GeoGebra in [[Grafico di funzioni]]), quattro correzioni (schermo intero, gradi sulla stessa scala dei radianti, animazioni di apertura, tastiera a schermo da computer), poi le curve implicite, parametriche e polari con la griglia polare ([[2026-10-02 Il plotter ha le curve implicite, parametriche e polari prima di uscire]]). Poi il secondo lotto con le disequazioni (funzioni a tratti, punti, tangente, area, tabella, inquadra, riordino, nomi degli assi): 59 test del plotter, 548 in tutto. Tutto committato sul branch `grafico-funzioni`, senza push. Alessandro ha detto che dopo vuole gli strumenti di geometria analitica come su GeoGebra.

## Rimasto aperto
- La pagina vera sotto `/strumenti`: indirizzo, categoria, articolo, carta nell'indice.
- Le espressioni nell'indirizzo e l'immagine da scaricare.
- La prova su un telefono vero e su Safari; lo zoom con due dita; la risposta aperta degli esercizi da riprovare dopo lo spostamento del modulo di MathLive.
- Come si scrive un piano nel markdown di una lezione.
- Lo studio di funzione come strumento a parte.
- Le altre domande aperte sono in [[Grafico di funzioni]].

## Prossimo argomento
Per il plotter: provarlo, poi la pagina vera e la pubblicazione del primo passo. Nella coda generale resta primo il legale e fiscale ([[Agenda]], punto 1).
