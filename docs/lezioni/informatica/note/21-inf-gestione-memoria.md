# Note: La gestione della memoria

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il sistema operativo", 3 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Struttura ed esempi

A ogni processo la sua memoria (assegnazione e protezione); la memoria virtuale come idea; la paginazione (pagine,
frame, tabella delle pagine) con la figura; il conto delle pagine in tre passi; lo swap e il page fault; che cosa
succede quando la RAM finisce.

Quattro esempi svolti: divisione esatta; divisione con il resto, con la memoria assegnata e lo spazio inutilizzato;
unità diverse (da mebibyte a kibibyte); quante pagine finiscono nello swap.

Avvisi: le pagine si arrotondano per eccesso; la memoria virtuale non aggiunge RAM; "memoria piena" indica quasi
sempre la memoria di massa.

## Conti

Rifatti con Python: 48 : 4 = 12; 50 : 4 = 12,5 quindi 13 pagine, 52 KiB assegnati, 2 inutilizzati; 3 MiB = 3072 KiB,
3072 : 4 = 768; 6 + 7 + 5 = 18, 18 - 16 = 2, 20 - 18 = 2; 4 KiB = 4096 B.

## Scelte

- Memoria virtuale e paginazione "come idea": niente indirizzi, niente traduzione pagina-spiazzamento, niente
  algoritmi di sostituzione delle pagine. Del criterio di scelta si dice solo "una pagina che non viene usata da un
  po'".
- "Frame" in inglese; "area di swap"; "page fault" in inglese; "tabella delle pagine" in italiano.
- Le unità sono KiB e MiB, con il fattore 1024 scritto, come vuole il README. I libri scrivono spesso KB con il
  significato di 1024.
- Lo spazio inutilizzato nell'ultima pagina è nell'esempio 2 senza il nome "frammentazione interna".
- La segmentazione non c'è.

## Fonti e cose da verificare

- "Un valore molto diffuso è 4 KiB": è la dimensione standard delle pagine sui processori x86; alcuni sistemi su
  processori ARM usano 16 KiB. Da verificare e, se serve, attenuare.
- "La memoria di massa è molto più lenta della RAM": senza numeri. Il rimando alla lezione 15 presuppone che quella
  lezione confronti le velocità: da verificare quando sarà scritta.
- I telefoni che chiudono le app quando la RAM non basta: comportamento noto di Android e iOS, descritto senza nomi.
  "Se il sistema non ne usa una [area di swap]": da verificare per i sistemi dei telefoni di oggi.
- La parola "thrashing" per il rallentamento da troppi page fault non è usata.

## Figura

`paginazione-pagine-frame` (TikZ, 423 x 312 px): quattro pagine di un processo, sei frame della RAM, una pagina
nell'area di swap. Guardata in chiaro e in scuro.

## Per il generatore

`inf-gestione-memoria`, sei livelli: quante pagine con divisione esatta, con arrotondamento, dai mebibyte; memoria
assegnata e inutilizzata; pagine nello swap o frame liberi; vero o falso. I primi cinque hanno risposta numerica.
Specifica in `specs/exercises/inf-gestione-memoria.md`.

## Domande per Andrea

- Paginazione sì e segmentazione no: va bene per il primo anno?
- "Frame" o un termine italiano ("blocco", "pagina fisica")?
- Il conto delle pagine è il solo procedimento della lezione: è quello che si chiede in verifica, o i docenti restano
  sui concetti?
