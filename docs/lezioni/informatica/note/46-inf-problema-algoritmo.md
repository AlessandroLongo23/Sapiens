# Note: Dal problema all'algoritmo

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-secondo-anno.md` (secondo anno, capitolo "Algoritmi e
diagrammi di flusso"). Non pubblicata.

## Struttura

Le cinque fasi (analisi, strategia, algoritmo, prova, programma); l'analisi con dati di ingresso, dati di uscita e
vincoli, e la tabella dell'analisi per la quota della gita; la strategia trovata su un caso risolto a mano; l'algoritmo
a parole e come diagramma; i casi di prova (normale, sul confine, scomodo) con il risultato atteso calcolato prima; un
secondo problema che chiede una ripetizione (le settimane di risparmio), con i suoi tre casi; tre esercizi.

- Righe: 165 nel file, 60 di testo. Nessuna figura TikZ, nessun blocco `codice`.
- Diagrammi: 5. Due nella lezione (`problema-gita-quota-a-testa`, `problema-settimane-di-risparmio`) e tre negli
  esercizi: uno da completare (il ramo "sì" del controllo sul vincolo), uno da correggere con i casi di prova
  (`>` al posto di `>=`), uno da costruire dopo aver fatto le prime quattro fasi su carta.
- Avvisi: un dato di uscita non si legge; il risultato atteso si calcola prima; il vincolo dimenticato.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard). `verifica.mts`: 0 esercizi.
- I cinque diagrammi eseguiti fino in fondo nella pagina di anteprima (Chromium con Playwright). Uscite: 34; 8.
- Casi di prova delle due tabelle rifatti con il motore dei diagrammi: gita 34, 30, 509, e con zero studenti l'errore
  "non si può dividere per zero"; settimane 8, 6, 1.
- Esercizi risolti nella pagina: gita con il controllo (34 con 600, 9, 24; "nessuno studente" con 0); spedizione
  (prima della correzione 30 dà 35; dopo, 25, 45, 30); abbonamento costruito da zero (3 e 5 danno "ingressi singoli",
  6 e 8 danno "abbonamento").

## Scelte

- Cinque fasi con questi nomi. I libri ne contano da quattro a sei e le chiamano in modi diversi ("analisi",
  "progettazione", "codifica", "collaudo"); "codifica" e "collaudo" non compaiono, ho scritto "programma" e "prova".
- "Vincolo" per la condizione sui dati; "valore intermedio" per quello che l'algoritmo calcola e non scrive.
- Nella tabella dell'analisi la colonna "Tipo" dice ingresso o uscita, non il tipo di dato (intero, decimale): i tipi
  sono della lezione 53.
- La scomposizione in sottoproblemi (top-down) non c'è: ha la sua lezione al terzo anno.
- Il codice accanto al diagramma c'è solo per le settimane di risparmio, come esempio della quinta fase.
- Il diagramma della gita con zero studenti si ferma con un errore: è voluto, e il testo lo dice.
- Nomi interi per i dati dei problemi (`pullman`, `biglietto`, `quota`, `prezzo`, `paghetta`, `risparmi`,
  `settimane`, `spesa`, `totale`, `costo`), $n$ per i numeri di studenti e di ingressi.

## Fonti e cose da verificare

- Nessun fatto storico e nessun numero che invecchia. I prezzi sono inventati.

## Domande per Andrea

- Le fasi: cinque con questi nomi, o in classe usi "analisi, progettazione, codifica, collaudo"?
- La tabella dell'analisi (dato, nome, ingresso o uscita, vincolo) assomiglia a quella che fai compilare tu?
- Tre casi di prova (normale, sul confine, scomodo): è il modo in cui lo chiedi nelle verifiche?
