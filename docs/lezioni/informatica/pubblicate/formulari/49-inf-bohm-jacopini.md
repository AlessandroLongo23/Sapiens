# Formulario: Sequenza, selezione, iterazione e teorema di Böhm-Jacopini

## Le tre strutture di controllo

Una struttura di controllo è un modo di stabilire in che ordine vengono eseguite le istruzioni.

| Struttura | Che cosa fa | Nello pseudocodice | Nel diagramma |
|---|---|---|---|
| sequenza | esegue le istruzioni una dopo l'altra, tutte, una volta | righe allo stesso livello | blocchi in fila |
| selezione | esegue un gruppo di istruzioni oppure un altro, secondo una condizione | `se` ... `altrimenti` | rombo con due rami che si riuniscono |
| iterazione | ripete un gruppo di istruzioni finché una condizione è vera | `finché` | rombo con una freccia che risale |

Iterazione, ripetizione e ciclo sono tre nomi della stessa struttura.

## Selezione o iterazione

| | Selezione | Iterazione |
|---|---|---|
| comincia con | una condizione | una condizione |
| dopo le istruzioni | si prosegue in avanti | si torna alla condizione |
| le istruzioni si eseguono | al massimo una volta | zero, una o più volte |

## L'annidamento

- Ogni struttura ha un solo ingresso e una sola uscita: vista da fuori si comporta come una sola istruzione.
- Annidamento: una struttura messa dentro un'altra, in un ramo o in un giro.
- Nello pseudocodice si vede dal rientro: la struttura interna è tutta più a destra di quella che la contiene.

```
leggi n
i ← 1
sufficienti ← 0
finché i ≤ n
    leggi voto
    se voto ≥ 6
        sufficienti ← sufficienti + 1
    i ← i + 1
scrivi sufficienti
```

Una sequenza di cinque elementi; il quarto è un'iterazione; nel suo giro c'è una selezione.

## I salti e il teorema

- Salto: un'istruzione del tipo "vai al passo 5", che porta l'esecuzione in un punto qualunque dell'algoritmo.
- Teorema di Böhm-Jacopini (1966): qualunque algoritmo descritto da un diagramma di flusso si può riscrivere come un algoritmo equivalente che usa soltanto la sequenza, la selezione e l'iterazione.
- Equivalente: con gli stessi dati di ingresso dà gli stessi risultati.
- Programmazione strutturata: scrivere algoritmi e programmi usando solo le tre strutture, una dopo l'altra o una dentro l'altra, senza salti.

Con il salto:

1. Leggi `pin`.
2. Se `pin` è diverso da 1234, torna al passo 1.
3. Scrivi "sbloccato".

Senza il salto:

```
leggi pin
finché pin ≠ 1234
    leggi pin
scrivi "sbloccato"
```

Se il passo con il salto dice quando si esce dal giro, la condizione del `finché` è il suo contrario: "se $n$ è uguale a 0, vai al passo 7" diventa `finché n ≠ 0`.

```ad-warning
Un rombo non è sempre una selezione
Se le istruzioni devono potersi ripetere serve `finché`, non `se`.
```

```ad-warning
Tre strutture, non tre istruzioni
Il teorema parla dei modi di combinare le istruzioni, non di quante ne servono; e un algoritmo non deve usarle tutte e tre.
```

```ad-warning
La riscrittura esiste, non è detto che sia più corta
Togliendo i salti può servire ripetere un'istruzione o aggiungere una variabile.
```
