# Note: L'ordinamento per selezione

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "Ricerca e ordinamento", gruppo 5 del lotto).
Non pubblicata.

## Struttura

Quella fissata nel brief per le lezioni 75, 76 e 77, nell'ordine: l'idea con le carte ("Il più piccolo al primo
posto"), la figura passo per passo, il programma ("Scambiare due elementi", poi "Il programma"), la traccia ("La
traccia sui sei tempi"), il conteggio ("Quanti confronti e quanti scambi"), "Prova tu". La 75 introduce lo scambio,
che ha la sua sezione prima del programma.

- 386 righe; 30 righe di testo fuori dai blocchi, circa 1000 parole.
- Programmi da eseguire: 2 (lo scambio dei primi due tempi; la funzione `ordina` con `stampa`), ciascuno in Python
  e in C++.
- Esercizi con le prove: 2 (il primo giro: trovare `imin` e scambiare; tutta la funzione `ordina` in ordine
  decrescente).
- Figure interattive: 1. Tabelle: 1. Riquadri `ad-warning`: 2. Riquadri `ad-note`: 2. Nessuna figura TikZ.

## Elementi interattivi

| Elemento | Domanda a cui risponde | Dove sta la risposta nel testo |
|---|---|---|
| Figura `inf-selection-sort-imin` | Quanti confronti e quanti scambi servono per ordinare i sei tempi? E con un vettore già in ordine, o al contrario? | Subito dopo la figura (15 e 3, e in quali giri non si scambia) e nella sezione sul conteggio (15 e 0, 15 e 3). |
| Programma dello scambio | Che cosa succede ai due valori con `temp`, e senza? | Il riquadro "Lo scambio senza la terza variabile": `12 12`. |
| Programma `ordina` | Come si ritrova la tabella di traccia nel programma? | La sezione della traccia: una chiamata a `stampa` in fondo al ciclo esterno dà le cinque righe. |

La figura è un file nuovo (`SelectionSortImin.tsx`, traccia `ordinamentoPerSelezioneImin` in
`src/lib/informatica/tracce-ricerca-selezione.ts`, con i test): quella del kit, `inf-selection-sort-passi`, chiama
`min` l'indice e ha frasi che non seguono il programma. Nella mia i nomi sono `i`, `j` e `imin`, c'è un passo per
ogni riga del programma che fa qualcosa (`imin = i`, ogni confronto, lo scambio o la sua assenza), e le frasi
dicono i valori delle variabili. `i` e `j` stanno sopra le celle e `imin` sotto, così i tre nomi non si
ammucchiano sotto la stessa cella. I conteggi sono quelli della traccia del kit (lo dice un test su 200 vettori).

## Verifiche

- `check.mts`: ok su lezione, formulario e flashcard, nessun avviso.
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I due programmi senza prove sono stati eseguiti con `python3` e con `clang++ -Wall`: stesse uscite. Rifatti con
  un programma a parte: la tabella di traccia, i 15 confronti e 3 scambi, 15 e 0 sul vettore ordinato, 15 e 3 su
  quello al contrario, `12 12` con lo scambio senza `temp`, `14 12 15 13 17 19` con il confronto `v[j] < v[i]`.
- Nel browser, a 1280 e a 390 px: i quattro blocchi eseguiti (Python a 1280, C++ a 390), "Verifica" premuto in ogni
  esercizio con il programma di partenza e poi con la soluzione (tutte le prove superate); nessun errore in
  console, nessuna immagine mancante, nessuno scorrimento laterale della pagina. A 390 px la tabella di traccia
  scorre dentro il suo riquadro.
- La figura guardata in chiaro, in scuro e da telefono, al primo passo, a metà (un confronto, uno scambio) e alla
  fine, con due e con dodici valori, con il vettore già ordinato, dopo "Mescola", con un testo che non è un numero
  nel campo, e percorsa da tastiera: l'altezza non cambia da un passo all'altro.

## Scelte che il brief non fissava

- Lo scambio si fa solo quando `imin != i`. Così il programma conta gli scambi come la traccia del kit e come farà
  la lezione 78 (0 scambi su un vettore ordinato), e la tabella di traccia può dire "nessuno". Molti libri
  scambiano sempre, anche un elemento con se stesso.
- I dati sono gli stessi della 76, i sei tempi 15, 12, 19, 13, 17, 14 della corsa campestre, con le stesse funzioni
  `ordina` e `stampa` e lo stesso nome `tempi`: le tre lezioni si leggono una dopo l'altra e la 78 confronta i tre
  ordinamenti. La selezione li ordina con 15 confronti e 3 scambi, le bolle con 15 e 7.
- La costante `N` sta in cima al programma, fuori da `main`, come nella lezione 70. Negli esercizi che leggono il
  numero degli elementi la costante è `MAX`, uguale a 100, come nella 76.
- La formula $\frac{n(n-1)}{2}$ è scritta, preceduta dal conto con sei elementi; "cresce come $n^2$" è lasciato alla
  78. La somma $(n - 1) + (n - 2) + \dots + 1$ è detta a parole: scritta in una formula in evidenza usciva dallo
  schermo del telefono.
- Per l'ordine decrescente l'indice si chiama `imax` (secondo esercizio).
- La versione che scambia `v[i]` e `v[j]` a ogni confronto non c'è, e nemmeno la stabilità dell'ordinamento.

## Confini con le lezioni vicine

- Con la 64 e la 70: la ricerca del minimo è richiamata con un link e non rispiegata; qui cambia solo che si
  ricorda l'indice.
- Con la 76 e la 77: lo scambio con `temp` è introdotto qui, e la 76 lo richiama. Il confronto tra i tre
  ordinamenti è una riga che rimanda alla 78.

## Da verificare

- Nella 76 l'ordine delle parti è idea, figura, tabella di traccia, programma, conteggio: la tabella viene prima
  del programma. Qui è dopo, come dice il brief (la mia tabella ha le colonne `i` e `imin`, che hanno senso dopo il
  programma). Chi coordina decida quale ordine tenere nelle tre lezioni.
- Nella 76 i tempi della corsa campestre sono "in secondi"; qui sono "in minuti", perché 15 secondi non sono un
  tempo da corsa campestre. Va scelta una delle due e scritta uguale.
- Nella 76 `const int N = 6;` sta dentro `main`, qui e nella 70 sta in cima al programma.
- La formula in evidenza $(n - 1) + (n - 2) + \dots + 1 = \frac{n(n-1)}{2}$, che la 76 ha uguale alla mia prima
  versione, a 390 px esce dal bordo a destra.

## Domande per Andrea

- Lo scambio va fatto solo quando `imin != i`, come qui, o sempre, come in molti libri? Cambia il numero degli
  scambi che si contano (3 contro 5 sui sei tempi).
- Il nome `imin` per l'indice del minimo va bene, o in classe usi `pos`, `posmin`, `indice_min`?
- Nell'ordine decrescente preferisci cambiare il nome in `imax`, come qui, o tenere `imin` e cambiare solo il
  segno?
- La formula $\frac{n(n-1)}{2}$ sta bene già in questa lezione, o la lasceresti tutta alla 78?
- Lo scambio di Python in una riga è in un riquadro, e gli esercizi usano `temp`: accetteresti l'altra forma nelle
  risposte degli studenti? (Il correttore la accetta, perché guarda quello che il programma scrive.)

Prerequisiti proposti: inf-vettori, inf-cicli-annidati, inf-massimo-minimo-media, inf-parametri-ritorno

## Revisione del lotto (7 ottobre 2026)

- Una frase richiama lo scambio della lezione 68 con il link; la consegna del primo esercizio spiega `MAX`, il vettore dichiarato più grande del necessario, che nessuna lezione precedente usa.
- La differenza con la 76 sui "secondi" non c'è più: il gruppo 6 l'aveva già corretta.
