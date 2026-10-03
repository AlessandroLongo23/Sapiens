# Note: Conversioni tra binario e decimale

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "I sistemi di numerazione", 3 ottobre 2026).
`check.mts` passa sui tre file senza errori e senza avvisi.

## Struttura ed esempi

Le potenze di due da $2^0$ a $2^{10}$, MSB e LSB, i gruppi di quattro bit; da binario a decimale sommando i pesi dei
bit a 1; da decimale a binario con le divisioni successive (e perché funziona: il resto è l'ultimo bit); da decimale a
binario sottraendo le potenze di due; quanti bit servono e gli zeri a sinistra. In chiusura i link alle lezioni 08
(numeri con segno) e 09 (virgola mobile): qui solo interi senza segno, fino a 10 bit.

Sette esempi svolti: $1011_2$ (11), $1100\,1010_2$ (202), $10\,0000\,0001_2$ (513); 46 con le divisioni; 200 con le
divisioni (numero pari, tre zeri in fondo); 46 con le potenze; 1000 con le potenze (dieci bit). Avvisi: i pesi partono
da 1 e da destra; i resti letti dall'alto e l'ultima divisione dimenticata; gli zeri delle potenze saltate; una
potenza di due chiede un bit in più.

I conti sono stati rifatti in Python (`/tmp/informatica-cap2/conti.py`).

## Scelte

- L'esempio delle divisioni è 46 e non 45: $45 = 10\,1101_2$ è palindromo, e con un numero palindromo leggere i resti
  dall'alto o dal basso dà lo stesso risultato. Con 46 l'errore si vede ($01\,1101_2 = 29$).
- Due metodi da decimale a binario, tutti e due con i passi numerati, come nei libri. Negli esercizi i numeri fino a
  127 hanno la soluzione con le divisioni, quelli fino a 1023 con le potenze.
- MSB e LSB sono introdotti qui, sciolti in inglese la prima volta, come dice il README.
- La lezione è lunga 186 righe: le tabelle delle divisioni e i sette esempi occupano molte righe.

## Figure

- `binario-decimale-pesi` (TikZ, 413 x 119 px): gli otto bit di $1100\,1010_2$ con i pesi, i bit a 1 colorati, la somma.
- `divisioni-successive-46` (TikZ, 326 x 255 px): le sei divisioni con i resti in colonna e la freccia "si legge dal
  basso".

Guardate in chiaro e in scuro: niente sovrapposizioni.

## Per il generatore

`inf-binario-decimale`, cinque livelli (specifica in `specs/exercises/inf-binario-decimale.md`): da binario a decimale
fino a 7 e fino a 10 bit, da decimale a binario fino a 127 e fino a 1023, quanti bit servono.

## Domande per Andrea

- Quale dei due metodi da decimale a binario insegni per primo, e li vuoi tutti e due negli esercizi?
- I bit a gruppi di quattro anche nei numeri corti ($10\,1110_2$): aiuta o confonde chi è all'inizio?
- Fino a quanti bit devono arrivare gli esercizi del primo anno: 8, 10 o 16?
- "Quanti bit servono" sta in questa lezione o in quella su bit e byte (03)? Qui c'è la versione con i conti.
