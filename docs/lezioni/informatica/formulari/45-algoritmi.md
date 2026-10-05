# Formulario: Il concetto di algoritmo

## Le parole

- Algoritmo: elenco finito di passi precisi che, eseguiti nell'ordine, risolvono un problema.
- Esecutore: chi esegue i passi, una persona o una macchina; deve saper fare ogni passo, non capire perché funziona.
- Dati di ingresso (input): i valori da cui l'algoritmo parte. Dati di uscita (output): i valori che produce.
- Programma: un algoritmo scritto in un linguaggio di programmazione, che il computer sa eseguire.

## Le cinque proprietà

| Proprietà | Che cosa vuol dire | Che cosa non va bene |
|---|---|---|
| finito | i passi sono in numero finito, e l'esecuzione termina | "continua a contare" |
| non ambiguo | ogni passo si capisce in un modo solo | "aggiungi un po' di sale" |
| eseguibile | l'esecutore sa fare ogni passo | "indovina il numero che ho pensato" |
| deterministico | stessi dati di ingresso, stessi risultati | "scegli a caso una delle due strade" |
| generale | risolve tutti i problemi dello stesso tipo | "la media di 7 e 8 è 7,5" |

## Come si scrive a parole

1. Un passo per riga, numerato.
2. Prima i passi che leggono i dati di ingresso, dando un nome a ognuno.
3. Poi i calcoli, con un nome per ogni risultato.
4. Alla fine i passi che scrivono i dati di uscita.

La media di due voti: leggi $a$; leggi $b$; calcola $(a + b) : 2$ e chiamalo `media`; scrivi `media`.

## Scegliere e ripetere

- Scelta: "se ... altrimenti ...". Si esegue una sola delle due strade.
- Ripetizione: "finché ... ripeti ...". I passi scritti sono pochi, quelli eseguiti dipendono dai dati.

L'algoritmo di Euclide con le sottrazioni, per il MCD di due interi positivi:

1. Leggi $a$ e $b$.
2. Finché $a$ e $b$ sono diversi: se $a$ è maggiore di $b$ togli $b$ da $a$, altrimenti togli $a$ da $b$.
3. Scrivi $a$.

Con $48$ e $18$: $(48, 18) \to (30, 18) \to (12, 18) \to (12, 6) \to (6, 6)$, quindi il MCD è $6$.

## Algoritmo e programma

| | Algoritmo | Programma |
|---|---|---|
| che cos'è | l'idea: i passi che risolvono il problema | una scrittura dell'algoritmo |
| come è scritto | a parole, con un diagramma, in pseudocodice | in un linguaggio di programmazione |
| chi lo esegue | una persona o una macchina | il computer |

Lo stesso algoritmo dà programmi diversi in linguaggi diversi.

```ad-warning
L'ordine dei passi conta
Scrivere il totale prima di avere aggiunto l'ultima cifra dà un risultato sbagliato, anche se i passi ci sono tutti.
```

```ad-warning
I dati per cui l'algoritmo vale
L'algoritmo di Euclide con le sottrazioni vuole interi positivi: con $b = 0$ non termina.
```

```ad-warning
Algoritmo e programma non sono sinonimi
Prima si trova l'algoritmo, con carta e penna; poi lo si traduce in un programma.
```
