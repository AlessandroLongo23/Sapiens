# Note: La ricerca binaria

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "Ricerca e ordinamento", gruppo 5 del lotto).
Non pubblicata.

## Struttura

Apertura con gli armadietti della palestra e il dizionario aperto a metà; l'idea (guardare al centro e scartare
metà, con `sinistra`, `destra`, `centro`) e la figura passo per passo; il programma con la funzione `cerca`, la
tabella di traccia per il 21 e due errori; perché il vettore deve essere ordinato, con gli stessi numeri in
disordine; quanti confronti, dimezzando da 1000, con il programma che li conta, la tabella con la ricerca
sequenziale e la figura con le due ricerche fianco a fianco; due esercizi.

- 396 righe; 35 righe di testo fuori dai blocchi, circa 1200 parole.
- Programmi da eseguire: 2 (la funzione `cerca` che legge il numero dell'armadietto; la funzione `confronti` su un
  vettore di `n` numeri pari), ciascuno in Python e in C++.
- Esercizi con le prove: 2 (scrivere il ciclo della ricerca; scrivere tutta la funzione per un vettore decrescente).
- Figure interattive: 2. Tabelle: 2. Riquadri `ad-warning`: 3. Riquadri `ad-note`: 1. Nessuna figura TikZ.

## Elementi interattivi

| Elemento | Domanda a cui risponde | Dove sta la risposta nel testo |
|---|---|---|
| Figura `inf-ricerca-binaria-armadietti` | Quanti elementi guarda la ricerca binaria per trovare il 21 tra otto numeri, e quanti per sapere che il 30 non c'è? | Il paragrafo subito dopo: tre in tutti e due i casi, con gli elementi guardati. |
| Programma `cerca` | Che cosa fanno `sinistra`, `destra` e `centro` giro per giro? | La tabella di traccia per il 21. |
| Programma `confronti` | Quanti confronti servono con 1000 elementi, e che cosa cambia raddoppiando? | Il paragrafo dopo il programma (10, 11, 12) e la tabella. |
| Figura `inf-ricerca-binaria-sequenziale` | Sullo stesso vettore, quanti confronti fa la ricerca sequenziale e quanti la binaria, valore per valore? | Il paragrafo dopo la figura: 11 contro 3 per il 59, 1 contro 3 per il 3, 12 contro 3 per il 30. |

La prima figura è la traccia `ricercaBinaria` del kit dentro `VettorePassi`, con i dati della lezione (file
`RicercaBinariaArmadietti.tsx`): la figura già registrata `inf-ricerca-binaria-passi` parte dal 26, che si trova in
due confronti e non usa tutti e due i rami. La seconda è nuova (`RicercaBinariaSequenziale.tsx`, traccia
`confrontoRicerche` in `src/lib/informatica/tracce-ricerca-selezione.ts`, con i test).

## Verifiche

- `check.mts`: ok su lezione, formulario e flashcard, nessun avviso.
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I due programmi senza prove sono stati eseguiti con `python3` e con `clang++ -Wall`: stesse uscite. Provati
  davvero anche i numeri del testo: 10, 11 e 12 confronti con 1000, 2000 e 4000 elementi, 4, 7 e 20 con 8, 100 e
  1 000 000; il ciclo che non finisce con `sinistra = centro` cercando il 30 (resta a `sinistra` = `destra` = 5);
  il -1 con `sinistra < destra` cercando il 21; il -1 per il 21 nel vettore in disordine.
- Nel browser, a 1280 e a 390 px: i quattro blocchi eseguiti (Python a 1280, C++ a 390), "Verifica" premuto in ogni
  esercizio prima con il programma di partenza (una prova superata, quella del valore assente) e poi con la
  soluzione (tutte superate); nessun errore in console, nessuna immagine mancante, nessuno scorrimento laterale
  della pagina. A 390 px la tabella di traccia, che ha sei colonne, scorre dentro il suo riquadro.
- Le due figure guardate in chiaro, in scuro e da telefono, al primo passo, a metà e alla fine, con il valore che
  non c'è, con il primo elemento, con due e con dodici valori, dopo "Nuovi valori", con un testo che non è un
  numero nel campo, e percorse da tastiera: l'altezza non cambia da un passo all'altro.

## Scelte che il brief non fissava

- La funzione si chiama `cerca(v, x)` e restituisce l'indice oppure -1. Il confronto di uguaglianza viene per
  primo, poi le due metà.
- In C++ `centro` è dichiarata prima del ciclo (`int centro;`) e non dentro: con la dichiarazione dentro il ciclo
  la riga `int centro = (sinistra + destra) / 2;` ha 45 caratteri con il rientro, tre più di quanti ne stanno in un
  esercizio sul telefono. Lezione ed esercizi usano la stessa forma.
- La costante `N` sta in cima al programma, fuori da `main`, come nella lezione 70.
- Si conta un confronto per ogni elemento guardato (un giro del ciclo), come nelle figure del kit, anche se il
  programma fa due confronti per giro (`==` e `<`).
- Il logaritmo è nominato una volta, a parole, con il link alla lezione di matematica "Logaritmi e loro
  proprietà": niente formula, niente $\log_2$ scritto.
- Il numero massimo di confronti è spiegato dimezzando senza resto (1000, 500, 250, 125, 62, 31, 15, 7, 3, 1): dieci
  numeri, dieci confronti. La tabella ha 8, 100, 1000 e 1 000 000 elementi.
- Il calcolo di `centro` come `sinistra + (destra - sinistra) / 2`, che evita l'overflow con indici enormi, non
  c'è.
- Il secondo esercizio lavora su un vettore decrescente (la classifica di un torneo) e chiede solo l'indice: la
  versione con "posto 3" e "assente" portava la lezione oltre le 400 righe.
- Le stringhe sono nominate in una riga (i cognomi di una rubrica), con il link alla 73, senza un esempio.

## Confini con le lezioni vicine

- Con la 71: la ricerca sequenziale non è rispiegata; compare solo come termine di confronto, con "al massimo $n$
  confronti" e nella seconda figura, dove è quella della 71 (guarda tutti gli elementi se il valore non c'è, anche
  se il vettore è ordinato).
- Con la 75: la 74 dice solo che ordinare costa e rimanda. La 75 apre ricordando che un vettore ordinato si può
  esplorare con la ricerca binaria.
- Con la 78: il confronto generale tra algoritmi è lasciato lì. Il gruppo 6 ha registrato per la 78 la figura
  `inf-gara-ricerche`: se fa la stessa cosa di `inf-ricerca-binaria-sequenziale`, una delle due lezioni può usare
  quella dell'altra.

## Da verificare

- La 71 è arrivata dopo che avevo scritto questa. L'ho riletta alla fine: la sua funzione si chiama anche lei
  `cerca(v, x)`, restituisce -1 e conta un confronto per elemento guardato, e parla di "caso peggiore" come qui. Ho
  aggiunto nella 74 il richiamo ("Come quella della ricerca sequenziale"). Le lezioni 77 e 78 non le ho rilette.
- Con `N` uguale a 1 000 000 il programma C++ dei confronti funziona sul Mac (20 confronti), ma un array così
  grande dentro `main` non è stato provato nel Clang del sito: il testo propone solo 2000 e 4000.

## Domande per Andrea

- La funzione di ricerca restituisce -1 quando il valore non c'è: in classe usi questa convenzione o una
  variabile `trovato` accanto alla posizione?
- In C++ va bene `int centro;` dichiarata prima del ciclo, o preferisci la dichiarazione dentro il ciclo anche se
  la riga è più lunga?
- Si conta un confronto per elemento guardato: va bene, o vuoi contare i due confronti (`==` e `<`) di ogni giro?
- Il logaritmo è solo nominato, con il link a matematica. Al terzo anno i ragazzi non lo hanno ancora fatto: lo
  lasceresti, o toglieresti anche il nome?
- La versione che cerca nei nomi (stringhe in ordine alfabetico) merita un esempio qui, o resta alla 73?

Prerequisiti proposti: inf-vettori, inf-ricerca-sequenziale, inf-parametri-ritorno, inf-ciclo-while

## Revisione del lotto (7 ottobre 2026)

- "un indice non è mai negativo" è diventato "gli indici partono da 0", per lo stesso motivo della 71.
