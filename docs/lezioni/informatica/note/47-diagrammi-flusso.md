# Note: I diagrammi di flusso

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-programmazione.md` (secondo anno, capitolo "Algoritmi
e diagrammi di flusso"). Non pubblicata.

## Struttura

Che cos'è un diagramma di flusso e a cosa serve; i quattro blocchi e le frecce (tabella, figura con le quattro forme,
regole sulle uscite); come si legge, in quattro passi; la sequenza (area del rettangolo); la selezione (biglietto
ridotto sotto i 14 anni); la ripetizione (conto alla rovescia, con la tabella di traccia per $n = 3$); dal diagramma
al programma (tabella blocco, Python, C++; rientro e graffe); "Prova tu" con due esercizi.

- Diagrammi di flusso: cinque (sequenza, selezione a due rami, ripetizione, selezione a un ramo, ripetizione con
  somma), più la figura delle quattro forme. Sei blocchi `tikz` in tutto.
- Programmi da eseguire: tre, ognuno in Python e in C++, ognuno con il suo diagramma (stessi nomi, stesso ordine).
- Esercizi con le prove: due, ognuno con il suo diagramma. "Lo sconto": mancano l'`if` e l'istruzione del ramo sì
  (quattro prove: 80, 20, 50, 51). "La somma dei numeri da 1 a n": manca tutto il ciclo (quattro prove: 4, 1, 100, 0).
- Avvisi: il rombo con una sola uscita; la freccia $\leftarrow$ che non è un uguale; il ciclo che non finisce; la
  riga rientrata per sbaglio.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso.
- `verifica.mts`: 2 esercizi controllati, 0 errori (soluzioni in Python e in C++).
- I tre programmi di esempio provati a mano: Python con `python3`, C++ compilato con `clang++ -Wall` senza avvisi.
  Uscite controllate: area 3 per 4 = 12; biglietto con 10, 14, 30; conto alla rovescia con 3 e con 0.
- Figure guardate in chiaro e in scuro con `anteprima.mjs`: nessuna freccia attraversa un blocco o un testo, "sì" e
  "no" leggibili e dalla parte giusta nei due temi. La più larga è la selezione del biglietto, 8,5 cm. Non c'è stato
  niente da correggere dopo la prima compilazione.
- La pagina su `localhost:3001` non l'ho vista: dalla mia sessione la porta non rispondeva. L'editor con le linguette
  e il tasto "Verifica" vanno guardati nel browser.

## Lunghezza

La lezione è lunga 480 righe, contro le 120-200 del brief. Il testo da leggere sono circa 60 righe; il resto sono
sei figure TikZ (circa 150 righe, perché ogni figura ripete gli stili e le due macro) e dieci blocchi `codice`
(circa 190 righe, con le soluzioni e le prove). Con cinque diagrammi, tre programmi in due linguaggi e due esercizi
il limite non si può rispettare contando le righe del file. Da decidere se il limite vale per il solo testo.

## Scelte che il README non fissava

- Nei rami della selezione "scrivi" sta in un parallelogramma, non in un rettangolo come nel modello del README
  (che lì usa lo stile `azione` per "scrivi positivo"). Il README stesso dice parallelogramma per leggere e scrivere,
  e la lezione che presenta i blocchi non può contraddirsi. I rami sono a 2,6 cm dal centro invece di 2,8 per stare
  negli 8,5 cm.
- Variabili di una lettera ($b$, $h$, $a$, $e$, $n$, $p$, $s$, $i$), uguali nel diagramma e nel programma. Nomi
  lunghi (`base`, `altezza`) sarebbero più leggibili nel codice ma non stanno nei blocchi.
- La variabile è presentata in due righe come "scatola con un'etichetta", perché la lezione sulle variabili viene
  dopo. Lo stesso per `if`, `else`, `while`: solo nominati e tradotti ("se", "altrimenti", "finché").
- Il ramo sì del ciclo scende dal vertice basso del rombo, il ramo no esce a destra e gira attorno al corpo; la
  freccia di ritorno sale a sinistra e rientra sopra il rombo.
- Il ciclo è solo quello con la condizione in testa (`while`). Il ciclo con la condizione in coda e il `for` non
  compaiono.
- Negli esercizi manca più di una riga (l'`if` con la sua istruzione, il ciclo intero): lo studente le scrive
  copiando la forma dai programmi della lezione. Un pezzo più piccolo (la sola istruzione dentro l'`if`) avrebbe
  chiesto un segnaposto come `pass` in Python, che confonde.
- Non invito a togliere `n = n - 1` per vedere il ciclo infinito: non so come si comporta l'editor con un programma
  che non termina. L'avviso lo descrive a parole.
- Nessun link: le lezioni vicine (Il concetto di algoritmo, Lo pseudocodice, Sequenza, selezione, iterazione) non
  sono scritte, e nessuna lezione del primo anno serve qui.
- Blocchi dei libri che non ci sono: il connettore (cerchietto), il sottoprogramma (rettangolo con le doppie barre),
  l'esagono del ciclo `for`.

## Domande per Andrea

- La terza struttura: "ripetizione", "iterazione" o "ciclo"? La lezione dice "ripetizione, che si chiama anche
  ciclo"; il titolo della lezione 49 nell'albero dice "iterazione".
- Assegnamento nel diagramma con la freccia ($a \leftarrow b \cdot h$), come nel README, oppure con `=` come in
  molti libri del biennio?
- I rami: "sì" e "no", oppure "vero" e "falso"?
- Nomi dei blocchi: "inizio e fine", "ingresso e uscita", "istruzione", "condizione". In classe usi altri nomi
  ("terminale", "elaborazione", "decisione", "test")?
- Il parallelogramma: va bene uno solo per leggere e scrivere, o usi una I e una O accanto al blocco?
- Serve già qui il ciclo con la condizione in coda (ripeti... finché), che molti libri disegnano insieme all'altro?
- Variabili di una lettera nei programmi di questa lezione: accettabili, o preferisci nomi interi anche a costo di
  blocchi più larghi?
