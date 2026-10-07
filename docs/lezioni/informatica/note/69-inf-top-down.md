# Note: Scomporre un problema: la progettazione top-down

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Le funzioni", gruppo 2 del lotto). Non pubblicata.

## Struttura

Un problema solo, svolto per intero: gli esiti di fine anno di una classe (ammesso, giudizio sospeso, non ammesso)
dal numero di insufficienze. La scomposizione in sottoproblemi e l'albero (figura); una funzione per sottoproblema,
con la tabella di che cosa riceve e che cosa restituisce; il programma principale scritto per primo, con le funzioni
ancora vuote (primo programma); le funzioni riempite una alla volta (programma completo); che cosa si guadagna quando
la regola cambia; due esercizi.

- 393 righe, vicino al limite di 400: il programma completo in C++ è di 57 righe.
- Programmi da eseguire: 2, ciascuno in Python e in C++. Esercizi con le prove: 2 (riempire una funzione vuota;
  scomporre da soli un problema piccolo).
- Riquadri `ad-warning`: 3 (un sottoproblema che fa due cose; partire dai dettagli; scrivere tutto e provare alla
  fine). Riquadri `ad-note`: 1 (la funzione vuota nei due linguaggi, con `pass`). Tabelle: 1.

## Elementi interattivi

- Programmi `codice` nei due linguaggi: il programma principale con le funzioni vuote ("che cosa si può già
  controllare con i risultati finti?") e il programma completo ("quante funzioni tocchi se la regola cambia?").
- `inf-top-down-albero` (`TopDownAlbero.tsx`): "fin dove conviene scendere, e in che ordine si scrivono le
  funzioni?". L'albero si apre un livello alla volta (passi 1-4), ogni riquadro prende il nome della sua funzione
  (passo 5), poi i riquadri cambiano stato nell'ordine di scrittura (passi 6-10): scritta, vuota, da scrivere. La
  lezione ci torna tre volte, in tre sezioni.
- Non c'è una figura TikZ dell'albero: quella interattiva lo mostra per intero all'ultimo passo.

## Scelte

- Il problema è la pagella di una classe, tra i due proposti dal brief, senza medie: contando le insufficienze si
  resta sui numeri interi, e Python e C++ scrivono le stesse cose. Niente vettori: i voti si leggono uno alla volta.
- La regola dell'esito (nessuna insufficienza, da una a tre, più di tre) è inventata per l'esempio, e il testo dice
  "nella scuola dell'esempio". Nelle scuole vere decide il consiglio di classe.
- Albero su due livelli, quattro funzioni più il programma principale. Il conto degli ammessi resta al programma
  principale, e il testo lo dice: non tutto diventa una funzione.
- "Funzione vuota" per quello che i libri chiamano stub; la parola inglese non c'è. `pass` è nel riquadro.
- La scrittura va dall'alto verso il basso (programma principale, poi le funzioni del primo livello, poi le loro).
  L'ordine opposto (bottom-up) è solo nel riquadro "Partire dai dettagli", senza il nome.
- `leggi_voto` controlla il voto con un `while`: è il solo punto in cui la lezione usa il controllo dei dati letti.
- I nomi delle funzioni hanno il trattino basso (`leggi_voto`, `stampa_riga`) nei due linguaggi.
- Non ci sono: i diagrammi di struttura con le frecce dei dati, la documentazione delle funzioni con i commenti, i
  moduli su più file.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard).
- `verifica.mts`: 2 esercizi, 0 errori, nei due linguaggi.
- I due programmi senza prove eseguiti con `python3` e con `clang++ -Wall`, con 2 studenti e 3 materie: quello con
  le funzioni vuote scrive `Studente 1`, `Studente 2`, `Ammessi: 2 su 2`; quello completo, con i voti 7, 6, 8 e 5,
  11, 4, 7, rifiuta l'11 e scrive `Studente 1 ammesso`, `Studente 2 giudizio sospeso`, `Ammessi: 1 su 2`, uguale nei
  due linguaggi. Con `-Wextra` il C++ delle funzioni vuote avvisa dei parametri non usati, come è giusto.

## Domande per Andrea

- Il problema svolto: la pagella con le insufficienze va bene, o preferisci un gioco a turni?
- "Funzione vuota" o "stub"? E in Python la fai scrivere con `pass` o con un `return` provvisorio, come qui?
- Presenti anche il bottom-up, con il suo nome, o basta il top-down?
- In classe l'albero della scomposizione lo disegni con i riquadri, come nella figura, o in un altro modo?

Prerequisiti proposti: inf-parametri-ritorno, inf-definire-funzioni, inf-visibilita, inf-ciclo-for

## Revisione del lotto (7 ottobre 2026)

- Aggiunti tre link, perché la lezione non ne aveva nessuno: alla 65 ("funzione"), alla 66 ("parametri e valore di ritorno") e alla 67 (il contatore che resta al programma principale, con mezza frase sul perché).
