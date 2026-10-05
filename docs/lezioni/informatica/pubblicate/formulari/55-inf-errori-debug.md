# Formulario: Errori e debug

## I tre tipi di errore

- Bug: un errore in un programma. Debug: cercarlo e toglierlo.

| Tipo di errore | Quando si scopre | Chi te lo dice | Esempio |
|---|---|---|---|
| di sintassi | prima che il programma parta | il compilatore o l'interprete | una parentesi non chiusa |
| in esecuzione | mentre il programma gira, con certi dati | il programma si ferma con un messaggio | una divisione per zero |
| logico | quando il risultato non è quello giusto | nessuno | `a + b / 2` al posto di `(a + b) / 2` |

## Leggere un messaggio di errore

1. Dove: la riga. In Python dopo `line`; in C++ `riga:colonna` dopo il nome del file (`6:29`).
2. Il punto esatto: l'accento `^` sotto la riga ricopiata.
3. Che cosa: in Python l'ultima riga (`SyntaxError: ...`); in C++ dopo la parola `error`.

| Messaggio | Linguaggio | Che cosa è successo |
|---|---|---|
| `'(' was never closed` | Python | parentesi aperta e non chiusa |
| `unterminated string literal` | Python | virgolette non chiuse |
| `unexpected indent` | Python | spazi all'inizio di una riga che non dovrebbe averne |
| `name 'x' is not defined` | Python | nome scritto male, o variabile senza valore |
| `ZeroDivisionError: division by zero` | Python | divisione per zero |
| `ValueError: invalid literal for int()` | Python | un testo che non si può convertire in intero |
| `expected ';'` | C++ | manca il punto e virgola |
| `use of undeclared identifier 'x'` | C++ | nome scritto male, o variabile non dichiarata |
| `expected '}'` | C++ | graffa aperta e non chiusa |
| `Errore durante l'esecuzione: divisione intera per zero.` | C++ nell'editor | divisione per zero |

- Python segnala un errore di sintassi alla volta; il compilatore C++ li elenca tutti, e si parte dal primo.
- In C++ `warning` è un avviso: il programma parte lo stesso, ma va letto.

## Cercare un errore logico

- Stampa di controllo: una stampa aggiunta per vedere quanto vale una variabile in un punto; alla fine si toglie.
- Tabella di traccia: esegui il programma a mano, e accanto a ogni valore scrivi quello giusto.

1. Scegli un dato con cui il programma sbaglia e calcola a mano il risultato giusto.
2. Segui i valori delle variabili fino alla prima riga in cui uno non è quello atteso.
3. Correggi quella riga, e solo quella.
4. Riprova con il dato di prima e con altri, compresi i casi scomodi (zero, negativi).

```ad-warning
La riga indicata è quella in cui il computer se ne accorge
Lo sbaglio può stare in una riga sopra.
```

```ad-warning
Un caso giusto non dimostra che il programma è giusto
`a + b / 2` con 0 e 8 dà 4, la media esatta.
```

```ad-warning
Cambiare a caso finché funziona
Prima si trova la riga, poi si corregge.
```
