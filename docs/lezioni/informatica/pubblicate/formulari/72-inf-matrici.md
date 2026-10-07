# Formulario: Le matrici

## Una tabella con due indici

Una matrice è una tabella di elementi dello stesso tipo. `m[i][j]` è l'elemento della riga `i` e della colonna `j`: prima la riga, poi la colonna, e i due indici partono da $0$.

| | Python | C++ |
|---|---|---|
| Creare la matrice | `m = [[7, 8, 6], [5, 6, 7]]` | `int m[R][C] = {{7, 8, 6}, {5, 6, 7}};` |
| Numero delle righe | `R = len(m)` | costante `const int R = 2;` |
| Numero delle colonne | `C = len(m[0])` | costante `const int C = 3;` |
| Leggere un elemento | `m[1][2]` | `m[1][2]` |
| Scrivere un elemento | `m[1][0] = 6` | `m[1][0] = 6;` |

Con $R$ righe e $C$ colonne gli elementi sono $R \cdot C$; gli indici di riga vanno da $0$ a $R - 1$, quelli di colonna da $0$ a $C - 1$.

## Sommare per righe e per colonne

Il ciclo esterno sceglie la riga (o la colonna), quello interno la percorre. L'azzeramento e la stampa stanno nel ciclo esterno, fuori da quello interno.

```python
for i in range(R):
    somma = 0
    for j in range(C):
        somma = somma + m[i][j]
    print(somma)
```

```cpp
for (int i = 0; i < R; i++) {
    int somma = 0;
    for (int j = 0; j < C; j++) {
        somma = somma + m[i][j];
    }
    cout << somma << endl;
}
```

| | Ciclo esterno | Ciclo interno | Elemento |
|---|---|---|---|
| Per righe | `i` da $0$ a $R - 1$ | `j` da $0$ a $C - 1$ | `m[i][j]` |
| Per colonne | `j` da $0$ a $C - 1$ | `i` da $0$ a $R - 1$ | `m[i][j]` |

## Le diagonali di una matrice quadrata

Una matrice quadrata ha $N$ righe e $N$ colonne. Per una diagonale serve un ciclo solo, con `i` da $0$ a $N - 1$.

| Diagonale | Da dove parte | Elemento |
|---|---|---|
| principale | angolo in alto a sinistra | `m[i][i]` |
| secondaria | angolo in alto a destra | `m[i][N - 1 - i]` |

## Riempire una matrice leggendo i valori

```python
m = []
for i in range(R):
    riga = []
    for j in range(C):
        riga.append(int(input()))
    m.append(riga)
```

```cpp
int m[R][C];
for (int i = 0; i < R; i++) {
    for (int j = 0; j < C; j++) {
        cin >> m[i][j];
    }
}
```

```ad-warning
Gli indici scambiati
`m[j][i]` al posto di `m[i][j]` prende un altro elemento, e in una matrice non quadrata esce dalla tabella.
```

```ad-warning
La somma azzerata nel posto sbagliato
Sopra il ciclo esterno le somme si accumulano da una riga all'altra; dentro il ciclo interno resta solo l'ultimo elemento.
```

```ad-warning
L'indice che esce dalla matrice
L'ultimo elemento è `m[R - 1][C - 1]`. Python si ferma con `IndexError`; il C++ non controlla e usa un valore che non c'entra.
```
