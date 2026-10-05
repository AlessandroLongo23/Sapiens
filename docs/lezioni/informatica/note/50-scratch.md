# Note: La programmazione a blocchi

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-secondo-anno.md` (secondo anno, capitolo "Algoritmi e
diagrammi di flusso"). Non pubblicata. Lo slug è `scratch`, il titolo non nomina il prodotto.

## Struttura

Perché i blocchi (gli errori di battitura dei primi programmi); che cos'è la programmazione a blocchi e com'è fatto
un ambiente, con la figura del programma che disegna un quadrato; le forme dei blocchi e perché non si possono fare
errori di sintassi, con l'avviso sugli errori logici; le tre strutture nei blocchi e lo stesso programma come
diagramma; costruire con i blocchi dei nostri diagrammi (un'attività guidata: dal quadrato al triangolo, e un errore
di scrittura provocato apposta); dai blocchi al testo; tre esercizi.

- Righe: 137 nel file, 41 di testo. Una figura TikZ (`programma-a-blocchi-quadrato`). Nessun blocco `codice`.
- Diagrammi: 4. Uno nella lezione (`blocchi-quadrato-come-diagramma`, con il codice accanto, che lo studente esegue
  e poi modifica) e tre negli esercizi: uno da correggere (un errore logico di ordine), uno da completare (il ramo
  "sì" di un quiz), uno da costruire da un programma a blocchi descritto a parole ("ripeti fino a quando").
- Avvisi: un programma che parte non è un programma giusto.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard). `verifica.mts`: 0 esercizi.
- Figura guardata in chiaro e in scuro con `anteprima.mjs` (407 px, circa 7,5 cm). Dopo la prima compilazione ho
  aggiunto la linguetta sotto "ripeti 4 volte", che mancava; nei due temi i testi si leggono e niente si sovrappone.
- I quattro diagrammi eseguiti fino in fondo nella pagina di anteprima (Chromium con Playwright).
- L'attività guidata provata nella pagina: `i = 3` nel rombo viene rifiutato con il messaggio "Così non si legge: per
  confrontare due valori si scrive =="; con `i <= 3` e 120 gradi escono sei mosse e "fatto"; "Modifica" e "Ripristina"
  riportano il quadrato.
- Esercizi risolti nella pagina: conto alla rovescia dopo lo spostamento (3, 2, 1, "via!"); quiz (10 con 56, 0 con
  54); contapassi costruito da zero (1000, 2000, 3000 e "obiettivo raggiunto" con 3000 e con 2500; solo il messaggio
  con 0).

## Scelte

- Scratch è nominato una volta, come esempio. I nomi dei blocchi nella figura e nel testo ("quando si preme avvia",
  "ripeti 4 volte", "fai 50 passi", "ruota di 90 gradi", "dì", "ripeti fino a quando", "per sempre", "cambia punti
  di 10") seguono quelli della versione italiana di Scratch, tranne il blocco di avvio, che lì è "quando si clicca
  sulla bandiera verde": l'ho reso generico.
- Nella figura i blocchi hanno tinte chiare come le figure delle altre lezioni, non i colori di un prodotto.
- Il diagramma del quadrato scrive le mosse ("avanti di 50 passi", "gira di 90 gradi"), perché non c'è un
  personaggio da muovere. Il blocco "ripeti 4 volte" è tradotto con un contatore e `finché`, e il testo lo dice.
- La lezione dice in che cosa i nostri diagrammi modificabili assomigliano ai blocchi (un blocco può finire solo su
  una freccia, il disegno è sempre eseguibile) e in che cosa no (il contenuto del blocco si batte sulla tastiera).
- Gli eventi sono in tre righe ("più pile, ognuna con il suo blocco di avvio"). Messaggi, cloni, sensori e variabili
  dei blocchi non ci sono.
- "Errori di sintassi" ed "errori logici" sono definiti qui in una riga ciascuno, perché servono a dire che cosa i
  blocchi impediscono; la lezione 55 "Errori e debug" li tratta per esteso. Non l'ho linkata per non anticipare un
  argomento con tre lezioni in mezzo: da decidere.

## Fonti e cose da verificare

- Scratch: sviluppato dal gruppo Lifelong Kindergarten del MIT Media Lab, pubblicato nel 2007. La lezione non dà né
  la data né l'autore; dice "uno degli ambienti più usati a scuola", senza numeri. Da verificare su scratch.mit.edu.
- I nomi italiani dei blocchi di Scratch, citati a memoria: da verificare aprendo l'editor in italiano.
- Le forme: in Scratch le condizioni sono esagonali ("a punta") e i valori arrotondati; il blocco di avvio ha il
  bordo superiore arrotondato. Da verificare sull'editor.

## Domande per Andrea

- In classe usi un ambiente a blocchi? Quale, e per quante ore? Se è Scratch, vuoi una seconda lezione o degli
  esercizi da fare lì?
- La lezione non ha un ambiente a blocchi vero e usa i diagrammi modificabili: ti sembra un sostituto accettabile?
- "Errore di sintassi" ed "errore logico" introdotti qui, prima della lezione sugli errori: va bene?
