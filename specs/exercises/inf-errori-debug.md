# inf-errori-debug: Errori e debug

Lezione: `docs/lezioni/informatica/riscritte/55-inf-errori-debug.md`. Segue il generatore di riferimento
`inf-ciclo-while`, con gli aiuti di `inf-primi.ts`.

Nei livelli da 3 a 6 è mostrato un programma (o un diagramma) che dovrebbe fare una cosa detta a parole e non la fa:
la domanda dice che cosa scrive con la prima prova e che cosa dovrebbe scrivere. Le opzioni sono lo stesso programma
corretto in modi diversi, di cui uno solo giusto su tutte le prove; nessuna opzione fa quello che fa il programma
sbagliato. Sette famiglie, un settimo ciascuna, ognuna con due o tre errori possibili:

- `sconto`: prezzo scontato di una percentuale (si sottrae la percentuale; la divisione per 100 fatta per prima);
- `scatole`: scatole piene e avanzo (`//` e `%` scambiati; l'avanzo come sottrazione);
- `perimetro`: parentesi mancanti;
- `resto`: pagato − prezzo · k (parentesi di troppo; somma al posto del prodotto);
- `scambio`: senza variabile di appoggio, o con l'appoggio usato male;
- `somma`: il ciclo della lezione, somma da 1 a n (`<` al posto di `<=`; l'accumulatore sovrascritto; il passo
  prima della somma);
- `soglia`: una selezione, "almeno k" (`>` al posto di `>=`; rami scambiati; confronto girato). Le prove
  comprendono k e k − 1.

Vincoli: solo interi non negativi, `//` e `%`, niente `/`; al più una selezione o un ciclo; l'errore si vede sulla
prima prova; righe di Python di al più 34 caratteri e al più 9 righe.

## Livelli

1. **Che tipo di errore è.** Testo. Una situazione con un nome: errore di sintassi (3 su 10), in esecuzione (25 su
   100), logico (3 su 10), nessun errore (15 su 100: il risultato è giusto, o è solo un avviso). 17 situazioni, con
   numeri estratti. Esempio: "Il programma di Irene deve sommare i numeri da 1 a 7. Parte, arriva in fondo senza
   messaggi e scrive 21, non 28." → Un errore logico.
2. **Leggere un messaggio di errore.** Testo. Un messaggio della lezione, in Python o in C++: che cosa è successo
   (6 su 10) o quale riga indica (dopo `line` in Python; il primo numero dopo il nome del file in C++, con la
   colonna come distrattore). Esempio: «programma.cpp:6:29: error: expected ';' at end of declaration» → riga 6.
3. **Trovare l'errore in un programma.** Il programma sbagliato; opzioni: quattro programmi.
4. **Trovare l'errore in un diagramma.** Il diagramma sbagliato; opzioni: quattro diagrammi.
5. **Correggere un diagramma.** Risposta aperta: il costruttore si apre con il diagramma sbagliato (`start`). A
   scelta multipla: come il livello 4.
6. **Correggere un programma.** Risposta aperta: l'editor si apre con il programma sbagliato e un commento
   (`fixAnswer` in `inf-primi.ts`). A scelta multipla: come il livello 3.

## Da evitare

La media con `/` della lezione (i due linguaggi la stampano in modo diverso: qui l'errore di parentesi è sul
perimetro); "nome non definito" come esempio di tipo di errore nel livello 1 (in Python si scopre in esecuzione, in
C++ prima di partire); correzioni che danno il risultato giusto per un'altra strada tra le opzioni sbagliate.
