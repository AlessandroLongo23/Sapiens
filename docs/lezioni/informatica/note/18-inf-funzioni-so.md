# Note: Funzioni del sistema operativo

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il sistema operativo", 3 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Struttura ed esempi

Che cos'è un sistema operativo (software di base, risorse, i due lavori di arbitro e di intermediario); le cinque
funzioni, con una tabella e un paragrafo ciascuna che rimanda alla lezione del capitolo che la tratta; il nucleo e le
chiamate di sistema; il modello a strati con la figura.

Tre esempi svolti: che cosa succede quando salvi un tema (le funzioni all'opera); il viaggio di una stampa (gli
strati); sistema operativo o applicazione (il criterio: gestire risorse o servire all'utente).

Avvisi: il sistema operativo non è hardware; non è solo quello che si vede; un'applicazione non parla con l'hardware;
già installato non vuol dire sistema operativo.

## Scelte

- Cinque funzioni (processi, memoria, file, periferiche, interfaccia), come nel brief. Utenti e protezione sono in una
  nota, non una sesta funzione.
- Modello a strati con quattro livelli (hardware, sistema operativo con il nucleo in basso, applicazioni, utente). Il
  modello "a cipolla" di molti libri (nucleo, gestore della memoria, gestore delle periferiche, file system,
  interprete dei comandi) non c'è: ordina tra loro parti che nei sistemi veri non stanno una sopra l'altra.
- "Nucleo" è il termine italiano, con "kernel" tra parentesi alla prima occorrenza.
- I nomi dei sistemi (Windows, macOS, Linux, Android, iOS) compaiono una volta, come esempi.
- Software di base e applicativo, CPU, memorie e periferiche: solo link alle lezioni 02, 14, 15, 16.

## Semplificazioni da conoscere

- "Il nucleo è l'unico software che comanda direttamente l'hardware": vero per il modello della lezione; nella realtà
  anche il firmware lo fa, e alcuni sistemi tengono dei driver fuori dal nucleo. Da decidere se attenuare.
- "L'interfaccia utente" è presentata come parte del sistema operativo: nei sistemi veri è in buona parte fatta di
  programmi distribuiti con il sistema.
- "La finestra in cui scegli il nome e la cartella fa parte dell'interfaccia utente" (esempio 1): è la finestra di
  salvataggio fornita dal sistema; alcuni programmi ne usano una propria.

## Fonti e cose da verificare

- Nessuna data e nessun numero che cambia nel tempo. I cinque nomi di sistemi sono quelli del README.
- "Molti computer che fanno da server non hanno una grafica": affermazione generica, senza numeri; da verificare se si
  vuole una fonte.

## Figura

`strati-sistema-operativo` (TikZ): i quattro strati, il nucleo dentro il riquadro del sistema operativo, frecce a due
punte tra strati vicini. Guardata in chiaro e in scuro con `scripts/figure/anteprima.mjs` (371 x 359 px).

## Per il generatore

`inf-funzioni-so`, quattro livelli a scelta multipla: compiti del sistema operativo o di un'applicazione, la funzione
da una situazione, il modello a strati, vero o falso. Specifica in `specs/exercises/inf-funzioni-so.md`.

## Domande per Andrea

- Cinque funzioni, o sei con "gestione degli utenti e sicurezza" come in alcuni libri?
- Modello a quattro strati o modello a cipolla del libro in adozione?
- "Nucleo" o "kernel" come termine principale?
