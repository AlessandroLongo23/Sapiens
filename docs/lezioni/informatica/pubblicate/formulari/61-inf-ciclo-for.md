# Formulario: Il ciclo for

## Un ciclo che conta

- Contatore: la variabile che parte da un valore, cambia della stessa quantità a ogni giro e fa finire il ciclo quando supera l'arrivo.
- Il `for` scrive in una riga partenza, arrivo e passo del contatore. Si usa quando il numero dei giri è noto nel momento in cui il ciclo comincia.

```python
for i in range(1, 6):
    print(i)
```

```cpp
for (int i = 1; i <= 5; i++) {
    cout << i << endl;
}
```

| | Python | C++ |
|---|---|---|
| Partenza | primo numero di `range` | `int i = 1` |
| Arrivo | secondo numero di `range`, escluso | la condizione per fare un altro giro: `i <= 5` |
| Passo | terzo numero di `range` | `i++`, cioè `i = i + 1` |
| Separatori | virgole, e due punti in fondo alla riga | punto e virgola tra le tre parti |

Lo stesso ciclo con il `while` ha le tre parti in tre righe: `i = 1` prima del ciclo, `i <= 5` nella condizione, `i = i + 1` in fondo al corpo. Il diagramma di flusso è lo stesso. Nel `for` il passo si esegue dopo l'ultima istruzione del corpo e prima del nuovo controllo.

## I valori del contatore

| Python | C++ | Valori di `i` | Giri |
|---|---|---|---|
| `range(5)` | `for (int i = 0; i < 5; i++)` | $0, 1, 2, 3, 4$ | $5$ |
| `range(1, 6)` | `for (int i = 1; i < 6; i++)` | $1, 2, 3, 4, 5$ | $5$ |
| `range(0, 11, 2)` | `for (int i = 0; i < 11; i += 2)` | $0, 2, 4, 6, 8, 10$ | $6$ |
| `range(5, 0, -1)` | `for (int i = 5; i > 0; i--)` | $5, 4, 3, 2, 1$ | $5$ |

- `range(n)`: da $0$ a $n - 1$, cioè $n$ giri. È il modo di dire "ripeti $n$ volte".
- Da $1$ a $n$ compreso: `range(1, n + 1)` in Python, `i <= n` in C++.
- `i += 2` vuol dire `i = i + 2`; `i--` vuol dire `i = i - 1`.
- Contando all'indietro cambia il verso della condizione: `i > 0`.

## Sommare i numeri da 1 a n

```python
s = 0
for i in range(1, n + 1):
    s = s + i
```

```cpp
int s = 0;
for (int i = 1; i <= n; i++) {
    s = s + i;
}
```

Con $n = 4$: `s` vale $1$, $3$, $6$, $10$. Con $n = 0$ il ciclo non fa giri e `s` resta $0$.

## Quando for e quando while

| | `for` | `while` |
|---|---|---|
| Numero dei giri | noto quando il ciclo comincia | dipende da quello che succede nel corpo |
| Che cosa scrivi | partenza, arrivo e passo del contatore | la condizione per continuare |
| La frase | "per ogni valore da qui a lì" | "finché succede questo" |

```ad-warning
Un giro in più o in meno
`range(1, 5)` si ferma a $4$. Controlla il primo e l'ultimo valore del contatore e conta i giri su un caso piccolo: da $1$ a $3$ devono essere tre.
```

```ad-warning
I segni del for
In Python i due punti in fondo alla riga e il corpo rientrato. In C++ il punto e virgola tra le tre parti, e nessun punto e virgola dopo la parentesi chiusa.
```

```ad-warning
Il passo nel verso sbagliato
Con `range(5, 0, 1)` Python non fa nessun giro; in C++ `for (int i = 5; i > 0; i++)` non si ferma.
```
