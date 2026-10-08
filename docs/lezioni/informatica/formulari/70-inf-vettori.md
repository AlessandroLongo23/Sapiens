# Formulario: I vettori

## Vettore, elemento, indice, dimensione

Un vettore è una fila di variabili dello stesso tipo con un solo nome. Ogni variabile è un elemento, il numero che la individua è l'indice, il numero degli elementi è la dimensione. In C++ si chiama array, in Python lista.

Gli indici partono da $0$: un vettore di dimensione $n$ ha gli indici da $0$ a $n - 1$.

| | Python | C++ |
|---|---|---|
| Creare con i valori | `voti = [7, 5, 8, 6, 10]` | `int voti[N] = {7, 5, 8, 6, 10};` |
| Dimensione | `len(voti)` | la costante `N` (`const int N = 5;`) |
| Leggere un elemento | `voti[0]` | `voti[0]` |
| Scrivere un elemento | `voti[1] = 6` | `voti[1] = 6;` |
| Ultimo elemento | `voti[len(voti) - 1]` | `voti[N - 1]` |

## Scorrere con un ciclo

L'indice `i` passa da $0$ a $n - 1$ e `voti[i]` è l'elemento del giro.

```python
for i in range(len(voti)):
    somma = somma + voti[i]
```

```cpp
for (int i = 0; i < N; i++) {
    somma = somma + voti[i];
}
```

| Che cosa si calcola | Valore di partenza | Nel corpo del ciclo |
|---|---|---|
| Somma | `somma = 0` | `somma = somma + voti[i]` |
| Media | la somma | dopo il ciclo: `somma / len(voti)`, in C++ `somma / N` con `double somma` |
| Massimo | `massimo = voti[0]`, ciclo da $1$ | se `voti[i] > massimo`: `massimo = voti[i]` |
| Conteggio | `sopra = 0` | se `voti[i] > media`: `sopra = sopra + 1` |

In Python, quando l'indice non serve: `for voto in voti:`.

## Riempire con i dati letti

```python
voti = []
for i in range(5):
    voti.append(int(input()))
```

```cpp
int voti[N];
for (int i = 0; i < N; i++) {
    cin >> voti[i];
}
```

In Python `append` aggiunge un elemento in fondo alla lista. In C++ la dimensione dell'array è fissata; `vector` è il tipo della libreria che può crescere.

## Un vettore come parametro

| | Python | C++ |
|---|---|---|
| Definizione | `def somma(v):` | `int somma(int v[], int n)` |
| Chiamata | `somma(voti)` | `somma(voti, N)` |
| Dimensione dentro la funzione | `len(v)` | il parametro `n` |

La funzione lavora sul vettore di chi la chiama, non su una copia: se cambia un elemento, il cambiamento resta.

```ad-warning
L'indice fuori dal vettore
`voti[N]` non esiste: Python si ferma con `IndexError`, il C++ legge un valore qualunque senza avvisare.
```

```ad-warning
Il giro di troppo
Il ciclo è `i < N` con `i` che parte da $0$: con `i <= N` esce dal vettore, partendo da $1$ salta il primo elemento.
```

```ad-warning
Elementi senza valore
In Python su una lista vuota si usa `append`, non `voti[0] = 7`; in C++ un elemento non ancora assegnato contiene un valore qualunque.
```
