# Note: Condizioni e operatori di confronto

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-secondo-anno.md` (secondo anno, capitolo "La
selezione"), insieme alla 58 e alla 59. Non pubblicata.

## Struttura

La condizione come espressione che vale vero o falso, calcolata e stampata; i sei operatori in tabella, con le parole
che decidono il confine ("almeno", "più di", "al massimo"); il rombo del diagramma, con il link in avanti alla 57; il
tipo booleano e la variabile che conserva una condizione; `=` contro `==`; i numeri con la virgola e la soglia; i
testi (uguaglianza, ordine del dizionario, maiuscole, cifre); due esercizi.

- Programmi da eseguire: 4 (tre condizioni su un voto; `maggiorenne`; `0.1 + 0.2`; la parola d'ordine), ciascuno in
  Python e in C++.
- Esercizi con le prove: 2 (`nuovo_record`, con il pareggio come valore di confine; lo scontrino, con la soglia sui
  numeri con la virgola).
- Diagrammi: 2 (`diagramma-flusso-condizione-maggiorenne`, con il rombo e `% codice: no`;
  `diagramma-flusso-variabile-booleana`, in sequenza, che corrisponde al secondo programma).
- Riquadri `ad-warning`: 3 (`=<` e `<>`; `=` dove serve `==`; numero e testo). `ad-note`: 3.
- Righe: 326. Testo da leggere (paragrafi, righe di tabella e riquadri, senza i blocchi `codice` e `diagramma`):
  41 righe, circa 1570 parole. Con lo stesso conto la 57 pubblicata ha 29 righe e circa 1290 parole.

## Verifiche

- `check.mts`: ok su lezione, formulario e flashcard (18 carte).
- `verifica.mts`: le due soluzioni superano le prove in Python e in C++; nessun programma di partenza le supera già.
- I quattro programmi senza prove sono stati eseguiti con le stesse macchine del sito (Pyodide e `@yowasp/clang`,
  con gli argomenti di `clang-args.ts`) e, in C++, compilati anche con `clang++ -Wall` della macchina: nessun
  avviso, uscite uguali a parte `True`/`1`.
- Provato davvero, con le macchine del sito: `0.1 + 0.2 == 0.3` è falso nei due linguaggi; Python scrive
  `0.30000000000000004` e il C++ `0.3`; `"Zebra" < "ape"` e `"10" < "9"` sono veri; `cout << voto >= 6` non compila;
  `=<`, `=>` e `<>` sono errori nei due linguaggi; `print(a = b)` dà `TypeError`; `cout << (a = b)` compila e scrive
  il valore di `b`; con `eta = input()` e 18 scritto, `eta == 18` è `False`; `eta == "18"` con `int eta` non
  compila; `"ape" < "zebra"` tra due letterali compila con due avvisi ("result of comparison against a string literal
  is unspecified").

## Scelte che il README non fissava

- La 57, già pubblicata, apre con un paragrafo sulla condizione e sui sei operatori e ha già il riquadro su `=` e
  `==` dentro un `if`. Qui gli stessi argomenti sono trattati per esteso e senza `if`; il riquadro su `=` riguarda
  `print` e `cout`. Restano due passaggi in parte ripetuti tra le due lezioni: da decidere se accorciare il
  paragrafo della 57.
- La selezione non è ancora stata spiegata: il primo diagramma ha un rombo con due rami, e il testo chiede solo di
  guardare la frase accanto al rombo. Ha `% codice: no`, perché il codice accanto mostrerebbe un `if ... else` che la
  lezione non spiega. È un uso di `% codice: no` fuori dagli esercizi.
- Il C++ scrive `1` e `0`: i programmi non usano `boolalpha`, che è nominato una volta nel riquadro.
- Negli esercizi la stampa deve essere uguale nei due linguaggi, e senza `if` un valore booleano si può solo
  scrivere: l'ultima riga, già scritta e da non toccare, è `print(int(...))` in Python e `cout << ...` in C++, e le
  prove aspettano `1` o `0`. Il testo dice in una riga che cosa fa `int(...)`.
- Valore assoluto: `abs` in Python e `fabs` con `#include <cmath>` in C++. In C++ `abs` senza `<cmath>` può prendere
  la versione per interi: per questo `fabs`.
- Soglia scritta per esteso (`0.000001`, `0.001`), senza la notazione `1e-6`.
- Nomi: `nuovo_record` con il trattino basso, come dice la 53.
- "Booleano" come nella 53; George Boole non è nominato.
- Il consiglio di contare i soldi in centesimi interi non c'è: nell'esercizio dello scontrino i prezzi sono numeri
  con la virgola proprio per far usare la soglia.
- Niente età del consenso digitale nell'esempio di apertura: la soglia usata è 18 anni per un concerto, inventata.

## Da verificare

- "In C++ tra due testi tra virgolette il risultato non vuol dire niente": lo standard confronta due puntatori e
  lascia il risultato non specificato. Clang lo compila con un avviso; con `-std=gnu++20` avvisa anche che il
  confronto tra array è deprecato. Da ricontrollare se cambia la versione del compilatore del sito.
- "`cout` arrotonda a sei cifre": è la precisione predefinita di `cout`; provato solo con `0.1 + 0.2`.

## Domande per Andrea

- La 56 e la 57 spiegano tutte e due la condizione e i sei operatori: va bene che la 57 li richiami in un paragrafo,
  o preferisci che rimandi soltanto alla 56?
- In C++ fai scrivere `1` e `0` o insegni subito `boolalpha`?
- Negli esercizi senza `if` la risposta è `1` o `0` con `print(int(...))`: ti va bene, o preferisci esercizi in cui
  si scrive solo la condizione dentro un `if` già pronto, anche se la selezione è nella lezione dopo?
- Il confronto tra numeri con la virgola con la soglia è materia del secondo anno, o basta dire "non usare `==`"?
- Il confronto tra testi con `<` (ordine dei codici, maiuscole prima delle minuscole) sta qui o nella lezione sulle
  stringhe del terzo anno?

Le domande non sono state copiate in `vault/Contenuti/Domande per Andrea.md`, perché il brief vieta di modificare
file esistenti: vanno riportate lì da chi raccoglie il lotto.
