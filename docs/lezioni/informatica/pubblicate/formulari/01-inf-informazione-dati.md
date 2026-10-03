# Formulario: Informazione, dati e codici

## Dati e informazioni

- Dato: un valore o un simbolo preso da solo, senza sapere a che cosa si riferisce («38,5», «7», «MI»).
- Informazione: un dato a cui è stato dato un significato («la temperatura di Luca alle 8 è 38,5 gradi»).
- Elaborazione: una serie di operazioni che dai dati in ingresso ricava nuove informazioni (dai voti, la media).

## Codici

- Codice: una regola che associa a ogni significato una sequenza di simboli presi da un alfabeto fissato.
- Codifica: dal significato alla sequenza di simboli. Decodifica: dalla sequenza di simboli al significato.
- A significati diversi devono corrispondere parole del codice diverse.
- Per decodificare un codice con parole tutte della stessa lunghezza: si divide la sequenza in gruppi di quella lunghezza, da sinistra, e si legge la tabella al contrario.

## Codice binario

- Codice binario: un codice con un alfabeto di due simboli, 0 e 1.
- Bit: un simbolo di un codice binario; vale 0 oppure 1.
- Sequenze diverse che si scrivono con $n$ bit:

$$2^n$$

| Bit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| Sequenze | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 1024 |

## Quanti bit servono per N cose

1. Conta le cose: $N$.
2. Scorri le potenze di due finché ne trovi una maggiore o uguale a $N$.
3. L'esponente è il numero di bit: il più piccolo $n$ con $2^n \ge N$.

Esempi: 7 giorni, $2^3 = 8 \ge 7$, 3 bit; 26 lettere, $2^5 = 32 \ge 26$, 5 bit; 64 livelli, $2^6 = 64$, 6 bit; 65 livelli, 7 bit.

## Analogico e digitale

| | Analogico | Digitale |
|---|---|---|
| Valori | tutti quelli di un intervallo, con continuità | un numero finito di valori distinti, scritti con cifre |
| Esempi | termometro a mercurio, orologio a lancette, disco in vinile | termometro con il display, orologio con i numeri, file musicale |
| Copia | ogni copia è un po' peggiore | ogni copia è identica all'originale |

```ad-warning
2 alla n, non 2 per n
Con 5 bit le sequenze sono $2^5 = 32$, non $2 \cdot 5 = 10$.
```

```ad-warning
Non un bit per ogni cosa
Per 8 cose bastano 3 bit, perché $2^3 = 8$; se $N$ è una potenza di due non serve un bit in più.
```

```ad-warning
Digitale non vuol dire elettronico
Conta che i valori possibili siano in numero finito: un interruttore è digitale, un televisore a tubo catodico tratta un segnale analogico.
```
