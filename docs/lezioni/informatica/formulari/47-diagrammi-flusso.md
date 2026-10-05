# Formulario: I diagrammi di flusso

## I blocchi e le frecce

| Blocco | Forma | Che cosa c'è dentro | Frecce in uscita |
|---|---|---|---|
| inizio e fine | ovale | "inizio" oppure "fine" | una da "inizio", nessuna da "fine" |
| ingresso e uscita | parallelogramma | "leggi $n$" oppure "scrivi $n$" | una |
| istruzione | rettangolo | un calcolo, come $a \leftarrow b \cdot h$ | una |
| condizione | rombo | una domanda, come "$n > 0$?" | due, con "sì" e "no" |

- Variabile: un nome a cui corrisponde un valore, come una scatola con un'etichetta.
- "Leggi $n$": chi usa il programma scrive un valore, che finisce in $n$. "Scrivi $n$": mostra il valore di $n$.
- $a \leftarrow b \cdot h$: calcola $b \cdot h$ e metti il risultato in $a$.
- Un diagramma ha un solo inizio, e le frecce si percorrono in un verso solo.

## Come si legge

1. Parti dall'ovale "inizio" e segui la freccia.
2. Esegui il blocco a cui arrivi, uno alla volta, segnando su un foglio le variabili che cambiano.
3. Su un rombo rispondi alla domanda con i valori del foglio e prendi la freccia della risposta.
4. Continua finché arrivi all'ovale "fine".

## Le tre strutture

| Struttura | Come si riconosce | Quante volte si eseguono i blocchi |
|---|---|---|
| sequenza | blocchi uno sotto l'altro | tutti, una volta |
| selezione | un rombo con due rami che si riuniscono | quelli di un ramo solo; un ramo può essere vuoto |
| ripetizione (ciclo) | una freccia che torna a un rombo già attraversato | quelli del giro, finché la risposta è sì |

La tabella per seguire un ciclo a mano ha una riga per ogni blocco eseguito. Il conto alla rovescia (leggi $n$; finché $n > 0$: scrivi $n$, $n \leftarrow n - 1$; scrivi "via!") con $n = 2$:

| Passo | Blocco | Valore di $n$ | Sullo schermo |
|---|---|---|---|
| 1 | leggi $n$ | $2$ | |
| 2 | $n > 0$? sì | $2$ | |
| 3 | scrivi $n$ | $2$ | 2 |
| 4 | $n \leftarrow n - 1$ | $1$ | |
| 5 | $n > 0$? sì | $1$ | |
| 6 | scrivi $n$ | $1$ | 1 |
| 7 | $n \leftarrow n - 1$ | $0$ | |
| 8 | $n > 0$? no | $0$ | |
| 9 | scrivi "via!" | $0$ | via! |

## Dal diagramma al programma

| Nel diagramma | In Python | In C++ |
|---|---|---|
| leggi $n$ | `n = int(input())` | `cin >> n;` |
| scrivi $n$ | `print(n)` | `cout << n << endl;` |
| $a \leftarrow b \cdot h$ | `a = b * h` | `a = b * h;` |
| rombo con due rami che si riuniscono | `if` ed `else` | `if` ed `else` |
| rombo con una freccia che torna indietro | `while` | `while` |

Le righe che stanno dentro un ramo o dentro un giro: in Python sono rientrate, in C++ stanno tra parentesi graffe.

```ad-warning
Ogni rombo ha due uscite
Due frecce, con "sì" e "no": con una sola, chi legge non sa dove andare nell'altro caso.
```

```ad-warning
La freccia non è un uguale
$n \leftarrow n - 1$ vuol dire "calcola $n - 1$ e mettilo in $n$"; nei programmi si scrive `n = n - 1`.
```

```ad-warning
Il ciclo che non finisce
Nel giro deve esserci un blocco che cambia la variabile della condizione, altrimenti la risposta resta sì per sempre.
```
