# Formulario: Cicli annidati

## Un ciclo dentro un altro

- Due cicli sono annidati quando uno (il ciclo interno) sta nel corpo dell'altro (il ciclo esterno).
- A ogni giro del ciclo esterno, il ciclo interno viene eseguito tutto, dal primo all'ultimo giro.
- Il contatore interno è quello che cambia più in fretta, e riparte dal suo primo valore a ogni giro esterno.
- I due contatori hanno nomi diversi: di solito `i` quello esterno, `j` quello interno.

```python
for i in range(1, 3):
    for j in range(1, 4):
        print(i, j)
```

```cpp
for (int i = 1; i <= 2; i++) {
    for (int j = 1; j <= 3; j++) {
        cout << i << " " << j << endl;
    }
}
```

Tabella di traccia: una colonna per contatore, una riga per ogni giro del corpo interno.

| `i` | `j` | Scritto |
|---|---|---|
| $1$ | $1$ | `1 1` |
| $1$ | $2$ | `1 2` |
| $1$ | $3$ | `1 3` |
| $2$ | $1$ | `2 1` |
| $2$ | $2$ | `2 2` |
| $2$ | $3$ | `2 3` |

## Quante volte gira il corpo interno

| Ciclo interno | Giri del corpo interno | Esempio |
|---|---|---|
| fa sempre $n$ giri, per $m$ giri esterni | $m \cdot n$ | rettangolo di $3$ righe e $8$ colonne: $24$ asterischi |
| arriva al contatore esterno `i`, da $1$ a $n$ | $1 + 2 + \ldots + n$ | triangolo alto $4$: $1 + 2 + 3 + 4 = 10$ asterischi |

## Righe e colonne

Il ciclo esterno conta le righe, quello interno i caratteri di ogni riga; l'a capo si scrive dopo il ciclo interno, dentro quello esterno.

| | Python | C++ |
|---|---|---|
| Scrivere e restare sulla riga | `print("*", end="")` | `cout << "*";` |
| Scrivere seguito da uno spazio | `print(i * j, end=" ")` | `cout << i * j << " ";` |
| Andare a capo | `print()` | `cout << endl;` |

Tavola pitagorica: nella riga `i` e nella colonna `j` c'è $i \cdot j$.

```python
for i in range(1, 11):
    for j in range(1, 11):
        print(i * j, end=" ")
    print()
```

| Disegno | Ciclo interno in Python | Ciclo interno in C++ |
|---|---|---|
| rettangolo | `for j in range(1, colonne + 1):` | `for (int j = 1; j <= colonne; j++)` |
| triangolo | `for j in range(1, i + 1):` | `for (int j = 1; j <= i; j++)` |

```ad-warning
L'a capo nel ciclo sbagliato
Dentro il corpo interno ogni carattere va su una riga sua; senza a capo tutto sta su una riga sola.
```

```ad-warning
Il contatore interno che non riparte
Con il `while`, `j = 1` va dentro il ciclo esterno, prima di quello interno: in cima al programma il ciclo interno gira solo al primo giro esterno.
```

```ad-warning
Lo stesso nome per i due contatori
Nel corpo interno il nome indica il contatore interno, e quello esterno non si può più usare.
```
