# Note: Lo pseudocodice

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-secondo-anno.md` (secondo anno, capitolo "Algoritmi e
diagrammi di flusso"). Non pubblicata.

## La forma dello pseudocodice

Una sola forma, usata qui, nella lezione 49 e nei formulari:

- una riga per ogni blocco del diagramma, con dentro lo stesso testo che la pagina scrive nel blocco;
- `inizio` e `fine` come prima e ultima riga, al margine, senza rientrare quello che c'è in mezzo;
- `leggi n`, `scrivi n`, `scrivi "testo"`;
- assegnamento con la freccia: `a ← b · h`;
- `se condizione`, `altrimenti` allineato al suo `se`, `finché condizione`, senza "allora", "esegui" e senza righe di
  chiusura; il corpo è rientrato di quattro spazi;
- segni: `+`, `−`, `·`, `/`, `div`, `mod`; confronti `=`, `≠`, `<`, `>`, `≤`, `≥`; `e`, `o`, `non`;
- parole in minuscolo.

È il linguaggio dei blocchi `diagramma` come viene disegnato (`labelOf` e `SHOWN` in `src/lib/diagramma/`), con la
differenza che nel sorgente del blocco e sulla tastiera si batte `=`, `==`, `<=`, `!=`, `*`, `//`, `%`. La lezione lo
dice nell'esercizio in cui lo studente costruisce un diagramma da uno pseudocodice. Lo pseudocodice sta in blocchi di
codice semplici, senza linguaggio.

## Struttura

Che cos'è e a che cosa serve, tra il diagramma e il programma; il prezzo in saldo come sequenza; la tabella blocco,
riga, significato e i segni; la selezione e il rientro (voto sufficiente); la ripetizione (i primi cinque multipli),
con la tabella di traccia per $n = 3$ e il codice accanto al diagramma; una nota sulle altre scritture; quattro
esercizi.

- Righe: 237 nel file, 50 di testo. Nessuna figura TikZ, nessun blocco `codice`.
- Diagrammi: 7. Tre nella lezione e quattro negli esercizi: uno da seguire a mano e poi eseguire (dimezzamenti), uno
  da correggere perché non corrisponde allo pseudocodice (un blocco dentro il giro), uno da costruire da uno
  pseudocodice (divisibilità), uno da cui scrivere lo pseudocodice su carta (monopattino).
- Tabella di traccia: 1. Avvisi: la freccia e l'uguale; il rientro.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard). `verifica.mts`: 0 esercizi.
- I sette diagrammi eseguiti fino in fondo nella pagina di anteprima (Chromium con Playwright). Uscite: 60;
  "sufficiente" e "voto registrato"; 3, 6, 9, 12, 15, "fatto"; 4; 1, "fatto", 2, "fatto", 3, "fatto" (quello da
  correggere); 7.
- Il testo di ogni blocco confrontato con la riga dello pseudocodice: coincidono, tranne che il rombo mostra la sola
  condizione con il punto di domanda e lo pseudocodice ha davanti `se` o `finché`.
- Valori citati: voto 6 dà "sufficiente"; multipli con 7; dimezzamenti con 64 (6) e con 1 (0); monopattino con 40
  minuti (7 euro), con 30 (7) e con 10 (3).
- Esercizi risolti nella pagina: blocco spostato fuori dal giro (1, 2, 3, "fatto"); divisibilità costruita da zero
  ("divisibile" con 12 e 4, "non divisibile" con 14 e 4).

## Scelte

- Niente righe di chiusura (`fine se`, `fine finché`): il rientro fa lo stesso lavoro, come nel sorgente dei
  diagrammi e come in Python. La nota in fondo mostra la scrittura con `SE ... ALLORA ... FINE SE` dei libri.
- `=` è il confronto e `←` l'assegnamento, come nei blocchi disegnati. Nei programmi sarà il contrario (`=` assegna,
  `==` confronta): la lezione 47 lo dice già per la freccia, la 57 per il doppio uguale.
- L'esercizio "Dal diagramma allo pseudocodice" non ha una correzione automatica: il testo dà il numero di righe e di
  rientri per controllare. La soluzione è:

  ```
  inizio
  leggi minuti
  costo ← 1 + minuti · 0,2
  se minuti > 30
      costo ← costo − 2
  scrivi costo
  fine
  ```

- La tabella "nel diagramma, in Python, in C++" non è ripetuta: è nella lezione 47.

## Fonti e cose da verificare

- "Pseudo" reso con "finto": dal greco, vale "falso". Nessun altro fatto da controllare.

## Domande per Andrea

- La forma dello pseudocodice qui sopra va bene, o in classe e nelle verifiche vuoi `SE ... ALLORA ... ALTRIMENTI ...
  FINE SE` e `MENTRE ... ESEGUI ... FINE MENTRE`? È la scelta che pesa di più su queste lezioni e sui formulari.
- `inizio` e `fine`: li vuoi, e il resto va rientrato sotto `inizio`?
- `div` e `mod` per quoziente e resto: sono le parole che usi?
- Parole in minuscolo o in maiuscolo?
