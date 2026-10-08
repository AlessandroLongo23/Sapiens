# Formulario: Leggere e scrivere un file di testo

## Le tre mosse

Un file di testo è una sequenza di caratteri divisa in righe; ogni riga finisce con un a capo.

1. Apri il file, dicendo il nome e che cosa vuoi farne.
2. Leggi oppure scrivi.
3. Chiudi il file.

| Che cosa vuoi fare | Python | C++ (`#include <fstream>`) | Se il file c'è già | Se non c'è |
|---|---|---|---|---|
| Leggere | `open("f.txt")` | `ifstream file("f.txt");` | si legge dall'inizio | errore |
| Scrivere | `open("f.txt", "w")` | `ofstream file("f.txt");` | viene svuotato | viene creato |
| Accodare | `open("f.txt", "a")` | `ofstream file("f.txt", ios::app);` | si scrive in fondo | viene creato |

In Python `with open(...) as file:` chiude il file alla fine del blocco rientrato. In C++ si chiude con `file.close();`.

## Leggere riga per riga

Il file si legge in ordine: un segnaposto ricorda fin dove sei arrivato, e ogni lettura riparte da lì.

```python
with open("voti.txt") as file:
    for riga in file:
        voto = int(riga)
```

```cpp
ifstream file("voti.txt");
string riga;
while (getline(file, riga)) {
    int voto = stoi(riga);
}
file.close();
```

| | Python | C++ |
|---|---|---|
| Una riga per giro | `for riga in file:` | `while (getline(file, riga))` |
| Una riga sola, la prossima | `file.readline()` | `getline(file, riga);` |
| L'a capo in fondo alla riga | resta: lo toglie `riga.strip()` | lo scarta `getline` |
| Da testo a numero intero | `int(riga)` | `stoi(riga)`, oppure `file >> voto` |

## Scrivere e accodare

```python
with open("tabellina.txt", "w") as file:
    file.write(str(7 * 3) + "\n")
```

```cpp
ofstream file("tabellina.txt");
file << 7 * 3 << endl;
file.close();
```

In Python `write` vuole un testo (`str`) e non va a capo da solo (`"\n"`). In C++ si scrive con `<<` ed `endl`, come su `cout`.

## Se il file non c'è

```python
try:
    with open("voti.txt") as file:
        print(file.readline().strip())
except FileNotFoundError:
    print("Il file non esiste")
```

```cpp
ifstream file("voti.txt");
if (!file) {
    cout << "Il file non esiste" << endl;
}
```

```ad-warning
Aprire in scrittura cancella
Con `"w"` o con `ofstream` il file viene svuotato appena lo apri: per aggiungere serve l'accodamento.
```

```ad-warning
I numeri di un file sono testo
Senza `int` o `stoi` le righe non si sommano: `"8" + "10"` fa `810`.
```

```ad-warning
Chiudi prima di rileggere
Quello che scrivi arriva di sicuro nel file solo quando lo chiudi.
```
