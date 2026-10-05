# Formulario: Linguaggi, compilatori e interpreti

## Dal linguaggio macchina ai linguaggi ad alto livello

- Linguaggio macchina: l'insieme delle istruzioni che una CPU sa eseguire; ogni istruzione è una sequenza di bit, e ogni famiglia di CPU ha il suo.
- Linguaggio di basso livello: ricalca quello che la macchina sa fare.
- Linguaggio ad alto livello: pensato per chi scrive, con parole dell'inglese, segni della matematica e nomi scelti da te; non dipende dalla CPU.
- Codice sorgente: il testo di un programma scritto in un linguaggio ad alto livello.
- Sintassi: le regole di scrittura di un linguaggio.

## I due traduttori

- Compilatore: traduce tutto il sorgente in linguaggio macchina, una volta, e produce un programma eseguibile.
- Programma eseguibile: il file tradotto, che la CPU esegue senza sorgente e senza compilatore.
- Interprete: legge il sorgente un'istruzione alla volta, la traduce e la fa eseguire subito; non produce nessun file.

| | Con il compilatore | Con l'interprete |
|---|---|---|
| Quando avviene la traduzione | prima dell'esecuzione, una volta sola | durante l'esecuzione, ogni volta |
| Che cosa resta | un programma eseguibile | solo il sorgente |
| Che cosa serve per eseguire | l'eseguibile per quel tipo di computer | il sorgente e un interprete |
| Un nome scritto male | segnalato prima di partire: il programma non parte | scoperto quando l'esecuzione arriva a quella riga |
| Velocità di esecuzione | di solito maggiore | di solito minore |

## I due linguaggi delle lezioni

| | Python | C++ |
|---|---|---|
| Traduttore | interprete | compilatore |
| Come si scrive | poche righe e pochi simboli | più righe, e ogni cosa va dichiarata prima di usarla |
| Un nome sbagliato nell'ultima istruzione | le istruzioni prima vengono eseguite, poi arriva l'errore | non viene eseguito niente |

```ad-warning
Dopo una correzione si compila di nuovo
L'eseguibile è la traduzione del sorgente di prima: non cambia da solo.
```

```ad-warning
La CPU non capisce il sorgente
Senza interprete un file di Python resta un testo; senza compilatore un sorgente C++ non si esegue.
```
