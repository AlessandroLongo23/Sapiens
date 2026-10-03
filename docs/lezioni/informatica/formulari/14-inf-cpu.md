# Formulario: La CPU e il ciclo di esecuzione delle istruzioni

## Le parti della CPU

| Parte | Che cosa fa |
|---|---|
| unità di controllo | preleva l'istruzione, la decodifica, comanda le altre parti; non fa calcoli |
| unità aritmetico-logica (ALU) | fa i calcoli e i confronti |
| contatore di programma (PC) | contiene l'indirizzo della prossima istruzione da prelevare |
| registro istruzioni (IR) | contiene l'istruzione in esecuzione |
| accumulatore (ACC) | contiene il numero su cui si lavora e il risultato dei calcoli |

I registri sono memorie interne alla CPU, di un solo valore ciascuna, le più veloci del computer.

## Il linguaggio della lezione

Un linguaggio macchina inventato; l'indirizzo è il numero di una cella della memoria centrale.

| Istruzione | Che cosa fa |
|---|---|
| `CARICA n` | copia nell'accumulatore il contenuto della cella $n$ |
| `SOMMA n` | somma all'accumulatore il contenuto della cella $n$ |
| `SOTTRAI n` | sottrae dall'accumulatore il contenuto della cella $n$ |
| `SALVA n` | copia nella cella $n$ il contenuto dell'accumulatore |
| `FERMA` | ferma il programma |

## Il ciclo di esecuzione

1. Prelievo: l'istruzione all'indirizzo scritto nel PC va nell'IR; il PC aumenta di $1$.
2. Decodifica: l'unità di controllo riconosce operazione e indirizzo.
3. Esecuzione: l'istruzione viene eseguita; se c'è un calcolo lo fa la ALU, e il risultato va nell'accumulatore.

Poi il ciclo ricomincia dal prelievo.

Per seguire un programma: una riga per ciclo, con IR, PC, accumulatore e le celle che cambiano.

- `CARICA 10`, `SOMMA 11`, `SALVA 12`, `FERMA` dalla cella $0$, con $7$ nella cella $10$ e $5$ nella cella $11$: accumulatore $7$, poi $12$; la cella $12$ diventa $12$; alla fine il PC vale $4$.
- Dopo $k$ cicli di un programma che parte dalla cella $s$, il PC contiene $s + k$.

## Clock, frequenza, core

- Clock: il segnale periodico che scandisce i passi della CPU. Frequenza: impulsi al secondo, in hertz.

$$1\,\text{kHz} = 1000\,\text{Hz} \qquad 1\,\text{MHz} = 1\,000\,000\,\text{Hz} \qquad 1\,\text{GHz} = 1\,000\,000\,000\,\text{Hz}$$

$$\text{istruzioni al secondo} = \frac{\text{frequenza del clock}}{\text{impulsi per istruzione}}$$

- Esempio: $2\,\text{MHz}$ e $4$ impulsi per istruzione danno $2\,000\,000 : 4 = 500\,000$ istruzioni al secondo.
- Tempo per eseguire un numero di istruzioni: istruzioni diviso istruzioni al secondo.
- Core: unità di controllo, ALU e registri insieme. Con $n$ core, al massimo $n$ volte le istruzioni di un core.

```ad-warning
Il contatore di programma guarda avanti
Mentre la CPU esegue l'istruzione della cella $2$, il PC contiene già $3$.
```

```ad-warning
Copiare non è spostare
`CARICA` non svuota la cella e `SALVA` non azzera l'accumulatore.
```

```ad-warning
Ogni istruzione legge la memoria com'è in quel momento
Se una cella è stata riscritta da `SALVA`, le istruzioni dopo trovano il valore nuovo.
```
