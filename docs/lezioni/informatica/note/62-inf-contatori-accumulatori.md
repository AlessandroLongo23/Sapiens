# Note: Contatori e accumulatori

Lezione nuova, scritta da zero il 5 ottobre 2026 (secondo anno, capitolo "L'iterazione"), insieme alla 63 e alla 64 e
ai formulari e alle flashcard delle lezioni 60-64. Non pubblicata.

## Struttura

Apertura con il tornello e la cassa; il contatore nel senso largo (conta quante volte succede una cosa), con i voti
sufficienti (diagramma, tabella di traccia, programma); l'accumulatore, con i punti di una serie di partite; il
prodotto con il fattoriale e i numeri grandi; il valore di partenza giusto, con la tabella dei tre casi; tre
esercizi.

- 337 righe; circa 1140 parole di testo, come la 60 e la 61.
- Programmi da eseguire: 3 (voti sufficienti, punti in tutto, fattoriale), ciascuno in Python e in C++.
- Esercizi con le prove: 2 (contare i numeri pari; la potenza con le moltiplicazioni ripetute).
- Diagrammi: 2 (`diagramma-flusso-contare-voti-sufficienti`, con ingresso 4, 7, 5, 8, 4; uno da costruire,
  `diagramma-flusso-da-costruire-contare-negativi`, con `% modifica: sì`).
- Tabelle di traccia: 1. Riquadri `ad-warning`: 3. Riquadri `ad-note`: 1.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso.
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I tre programmi senza prove sono stati eseguiti con `python3` e compilati con `clang++ -Wall` (nessun avviso): le
  uscite coincidono, tranne dove la lezione dice che devono differire (il fattoriale da 13 in su).
- Il fattoriale in C++ è stato provato davvero, con `clang++` sulla macchina e con il Clang del sito (attraverso
  `verifica.mts` su un file di prova in `/tmp`): con `int`, $12!$ = 479001600 è giusto, $13!$ dà 1932053504, $17!$ dà
  -288522240; con `long long` è giusto fino a $20!$ e $21!$ dà un numero negativo.
- Il diagramma è stato eseguito con la libreria del sito (`runAll` sui valori di `% ingresso:`): scrive 2 in 24
  passi, e il codice generato ha gli stessi nomi del programma della lezione, con il `while` al posto del `for`.
- La pagina di anteprima risponde (HTTP 200) e contiene i disegni; non è stata aperta in un browser, quindi i
  diagrammi non sono stati eseguiti a mano con "Passo", e il diagramma da costruire non è stato provato.

## Scelte che il README non fissava

- "Contatore" ha qui il senso largo che la nota della 61 lasciava a questa lezione; la prima frase della sezione
  collega le due definizioni.
- Gli esempi della 60 e della 61 (somma da 1 a n, somma fino allo zero) sono richiamati con un link e non ripetuti:
  la somma è quella di n dati letti.
- Nei programmi il ciclo è un `for` da 1 a n (`range(1, n + 1)`, `i <= n`), e il diagramma è quello del `while`
  equivalente, come nella 61. Il testo lo dice in una riga.
- `+=` è nominato una volta, come scrittura equivalente; i programmi usano la forma lunga, come nella 60 e nella 61.
- "Inizializzare" è definito qui ("dare il primo valore a una variabile"). Se la 53 lo definisce già, qui basta un
  richiamo.
- Il valore di partenza è spiegato come "quello che non cambia il risultato", senza la parola "elemento neutro".
- Il fattoriale è definito nella lezione, in una riga: nell'elenco di matematica non c'è una lezione da linkare.
- Nel secondo esercizio il programma di partenza non dà un valore a `potenza`: in Python si ferma con un errore, in
  C++ non si compila finché lo studente non la dichiara. È voluto (la consegna chiede di scegliere il valore di
  partenza), ma è diverso dagli esercizi della 60 e della 61, dove il programma di partenza gira.
- Le prove dell'esercizio sui pari hanno numeri negativi: la condizione `x % 2 == 0` vale nei due linguaggi, mentre
  `x % 2 == 1` per i dispari no (in C++ il resto di un negativo è negativo). La lezione non lo dice, perché non
  chiede i dispari.

## Da verificare

- Il riquadro sui numeri grandi dice che un `int` occupa 32 bit: è vero per il Clang del sito e per i compilatori che
  gli studenti usano, ma lo standard del C++ chiede solo almeno 16 bit. Inoltre il risultato dopo il superamento non
  è garantito dallo standard (comportamento non definito): i numeri citati sono quelli usciti nelle prove.
- Il numero $2\,147\,483\,647$ è nella tabella della lezione 8, a cui il riquadro rimanda.

## Domande per Andrea

- Il valore massimo di un `int` e il risultato sbagliato di $13!$ vanno bene in un riquadro `ad-note`, o al biennio
  preferisci non parlarne finché non capita?
- `long long` si nomina al secondo anno?
- "Accumulatore" anche per il prodotto, o in classe lo chiami in un altro modo ("produttoria", "moltiplicatore")?
- `totale += punti`: lo usi dal secondo anno o resti sulla forma lunga?
