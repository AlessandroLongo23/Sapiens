# Note: Processi, thread e multitasking

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il sistema operativo", 3 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Struttura ed esempi

Programma e processo (la ricetta e il cucinare); il multitasking e il quanto di tempo; i tre stati con il diagramma;
lo scheduler e il round robin in cinque passi, con il cambio di contesto; i thread, come cenno.

Quattro esempi svolti: gli stati di un lettore di musica (sei eventi); round robin con tempi multipli del quanto, con
la linea del tempo; un processo che finisce prima del quanto; lo stesso caso con un quanto troppo lungo.

Avvisi: programma e processo non sono sinonimi; da in attesa non si passa a in esecuzione; il turno non dura sempre un
quanto intero.

## Conti

Rifatti con Python (`/tmp/informatica-cap5/conti.txt`, simulazione indipendente da quella del generatore):

- esempio 2, quanto 4, tempi 8, 4, 12: turni P1 0-4, P2 4-8, P3 8-12, P1 12-16, P3 16-20, P3 20-24; fine 16, 8, 24;
  in coda 8, 4, 12;
- esempio 3, quanto 3, tempi 7, 2, 5: turni P1 0-3, P2 3-5, P3 5-8, P1 8-11, P3 11-13, P1 13-14; fine 14, 5, 13; in
  coda 7, 3, 8;
- esempio 4, quanto 10: P1 0-7, P2 7-9, P3 9-14.

## Scelte

- Tre stati (pronto, in esecuzione, in attesa), come nelle Indicazioni e nel brief; creazione e fine sono frecce del
  diagramma, non stati. Negli esercizi "Terminato" è la quarta opzione.
- "In attesa" e non "bloccato"; "ingresso o uscita" e non "I/O".
- "Tempo in coda" per il tempo passato da pronto: i libri dicono "tempo di attesa", che si confonderebbe con lo stato
  in attesa. La formula (fine meno tempo di CPU) vale solo con tutti i processi in coda dall'istante 0 e senza
  operazioni di ingresso o uscita: il testo lo dice.
- Round robin: quando resta un solo processo, riceve un quanto dopo l'altro, e i turni si contano separati.
- Il cambio di contesto è definito e poi trascurato nei conti.
- I core: una frase nel multitasking e una nei thread. Il resto è della lezione 14.

## Fonti e cose da verificare

- "Un quanto dura pochi millesimi di secondo": ordine di grandezza corretto per i sistemi di oggi (da qualche
  millisecondo a qualche decina), ma dipende dal sistema. Da verificare, o da lasciare così generico.
- Il round robin "molto usato": gli scheduler veri sono più complessi (priorità). Semplificazione accettabile per il
  primo anno?

## Figure

- `stati-di-un-processo` (TikZ, 453 x 275 px): tre stati, creazione, fine, quattro frecce con la causa.
- `round-robin-turni` (TikZ, 419 x 80 px): la linea del tempo dell'esempio 2.

Guardate in chiaro e in scuro.

## Per il generatore

`processi-thread`, sei livelli: lo stato da una situazione, uno stato e un evento, una sequenza di eventi, i turni del
round robin, l'istante di fine, il tempo in coda. Gli ultimi due hanno risposta numerica. Specifica in
`specs/exercises/processi-thread.md`.

## Domande per Andrea

- Tre stati, o cinque con "nuovo" e "terminato" come in molti libri?
- "Tempo in coda" va bene, o si usa "tempo di attesa" spiegando la differenza dallo stato?
- I thread come cenno bastano, o serve un esempio in più?
