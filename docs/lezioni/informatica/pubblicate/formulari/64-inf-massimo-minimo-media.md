# Formulario: Massimo, minimo e media di una sequenza

## Massimo e minimo

Una sequenza è una fila di dati dello stesso tipo che arrivano uno dopo l'altro. Il programma ne tiene in memoria uno alla volta.

1. Leggi il primo dato, prima del ciclo.
2. Dai a `massimo` (o a `minimo`) il valore del primo dato.
3. Per ogni altro dato: se supera `massimo`, prende il suo posto.
4. Dopo il ciclo scrivi `massimo`.

```python
gradi = int(input())
massimo = gradi
for i in range(2, n + 1):
    gradi = int(input())
    if gradi > massimo:
        massimo = gradi
```

```cpp
cin >> gradi;
int massimo = gradi;
for (int i = 2; i <= n; i++) {
    cin >> gradi;
    if (gradi > massimo) {
        massimo = gradi;
    }
}
```

| | Confronto | Con $-3$, $-7$, $-1$, $-5$ |
|---|---|---|
| Massimo | `gradi > massimo` | $-1$ |
| Minimo | `gradi < minimo` | $-7$ |

Per cercarli insieme: due variabili e due selezioni una dopo l'altra, senza `else`.

## Lunghezza nota o valore di fine

Il valore di fine è un valore che non può essere un dato e che chiude la sequenza (lo $0$ per i voti).

| | Lunghezza nota | Valore di fine |
|---|---|---|
| Come arrivano i dati | prima il numero $n$, poi $n$ dati | i dati, poi il valore di fine |
| Ciclo | `for` | `while`, con una lettura prima e una in fondo al corpo |
| Quanti sono i dati | $n$ | li conta un contatore |

## La media

Somma dei dati divisa per quanti sono: un accumulatore e un contatore nello stesso giro, la divisione dopo il ciclo e solo se c'è almeno un dato.

```python
somma = 0
quanti = 0
voto = int(input())
while voto != 0:
    somma = somma + voto
    quanti = quanti + 1
    voto = int(input())
if quanti > 0:
    print(somma / quanti)
else:
    print("Nessun voto")
```

| | Python | C++ |
|---|---|---|
| Somma $15$, dati $2$ | `15 / 2` fa `7.5` | tra due `int` fa `7`; con `double somma` fa `7.5` |
| Media intera | scrive `7.0` | scrive `7` |
| Nessun dato, senza la selezione | errore `ZeroDivisionError` | scrive `nan`; tra interi si ferma con un errore |

```ad-warning
Partire da 0
`massimo = 0` sbaglia quando i dati sono tutti negativi, `minimo = 0` quando sono tutti positivi: si parte dal primo dato.
```

```ad-warning
Il valore di fine non è un dato
Non si confronta, non si conta e non si somma: la lettura sta in fondo al corpo.
```

```ad-warning
La divisione per zero
Senza dati `quanti` vale $0$: prima di dividere controlla che sia maggiore di $0$.
```
