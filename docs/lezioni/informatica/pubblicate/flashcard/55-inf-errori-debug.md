# Flashcard: Errori e debug

## bug-e-debug
Che cosa sono un bug e il debug?
---
Un bug è un errore in un programma; fare il debug vuol dire cercarlo e toglierlo.

## riconoscere-sintassi
Il programma non parte, e compare un messaggio che indica una riga. Che tipo di errore è?
---
Un errore di sintassi: il testo non rispetta le regole di scrittura del linguaggio.

## riconoscere-esecuzione
Il programma parte, stampa due righe e poi si ferma con `ZeroDivisionError`. Che tipo di errore è?
---
Un errore in esecuzione: un'operazione impossibile, qui una divisione per zero, incontrata mentre il programma gira.

## riconoscere-logico
Il programma arriva in fondo senza messaggi, ma il risultato è sbagliato. Che tipo di errore è?
---
Un errore logico: il computer ha fatto quello che c'è scritto, che non è quello che volevi.

## sintassi-niente-eseguito
In un programma Python di quattro righe manca una parentesi nell'ultima. Le prime tre vengono eseguite?
---
No. Con un errore di sintassi il programma non parte, in nessuno dei due linguaggi.

## riga-in-python
Un messaggio di Python comincia con `File "programma.py", line 4`. Dov'è stato trovato l'errore?
---
Alla riga 4 del programma.

## riga-in-cpp
Un messaggio del C++ comincia con `programma.cpp:6:29: error:`. Dov'è stato trovato l'errore?
---
Alla riga 6, carattere 29.

## accento-sotto-la-riga
In un messaggio di errore, che cosa indica il segno `^` sotto la riga ricopiata?
---
Il carattere dove il traduttore si è accorto del problema.

## messaggio-parentesi
Che cosa vuol dire `SyntaxError: '(' was never closed`?
---
Una parentesi tonda è stata aperta e mai chiusa.

## messaggio-punto-e-virgola
Che cosa vuol dire, in C++, `error: expected ';'`?
---
Manca il punto e virgola in fondo a un'istruzione.

## messaggio-nome
Che cosa vuol dire `use of undeclared identifier 'prezo'`?
---
Il nome `prezo` non esiste: è scritto male, oppure la variabile non è stata dichiarata.

## warning
Vero o falso: se il compilatore C++ scrive un `warning`, il programma non parte.
---
Falso. Un avviso segnala qualcosa di sospetto, ma il programma parte lo stesso.

## quanti-errori-alla-volta
Quanti errori di sintassi segnala Python alla volta? E il compilatore C++?
---
Python uno solo; il C++ li elenca tutti, e si comincia dal primo.

## riga-indicata
Il messaggio indica una riga che ti sembra giusta. Dove guardi?
---
Nelle righe che la precedono: la riga indicata è quella in cui il computer si è accorto dell'errore.

## prima-e-dopo-l-errore
Un programma stampa "Divido", poi divide per zero, poi stampa "Fine". Che cosa esce?
---
"Divido" e poi il messaggio di errore: le istruzioni prima dell'errore sono eseguite, quelle dopo no.

## testo-al-posto-del-numero
In Python, che cosa succede se a `int(input())` rispondi "quattro"?
---
Il programma si ferma con `ValueError`: quel testo non si può trasformare in un numero intero.

## stampa-di-controllo
Che cos'è una stampa di controllo?
---
Un'istruzione di stampa aggiunta per vedere quanto vale una variabile in un certo punto; trovato l'errore, si toglie.

## un-caso-giusto
Con 0 e 8, `a + b / 2` dà 4, che è la media esatta. Allora il programma è giusto?
---
No. Con 6 e 8 dà 10: un programma con un errore logico può dare il risultato giusto con certi dati.

## primo-passo
Il programma dà un risultato sbagliato. Qual è la prima cosa da fare?
---
Scegliere un dato preciso con cui sbaglia e calcolare a mano il risultato giusto, prima di toccare il programma.
