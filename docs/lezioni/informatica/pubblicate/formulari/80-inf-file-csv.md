# Formulario: File di dati in formato CSV

## Com'è fatto un file CSV

Un file CSV è un file di testo che contiene una tabella: una riga del file per ogni riga della tabella.

| Parola | Che cos'è | Nell'esempio |
|---|---|---|
| Campo | il valore di una cella | `Anna`, `matematica`, `8` |
| Separatore | il carattere tra un campo e l'altro | la virgola |
| Riga di intestazione | la prima riga, con i nomi delle colonne | `nome,materia,voto` |

```
nome,materia,voto
Anna,matematica,8
Luca,fisica,6
```

Nel file ci sono solo i valori: niente formule, colori o grafici del foglio di calcolo.

## Leggere: saltare l'intestazione e tagliare

1. Apri il file in lettura.
2. Leggi la prima riga, l'intestazione, senza usarla.
3. Per ogni altra riga: taglia ai separatori.
4. Usa i campi per posizione, contando da 0: qui il campo 0 è il nome, il campo 2 il voto.
5. Per fare i conti converti il campo in un numero.

```python
with open("voti.csv") as file:
    file.readline()
    for riga in file:
        campi = riga.strip().split(",")
        voto = int(campi[2])
```

```cpp
ifstream file("voti.csv");
string riga, nome, materia, voto;
getline(file, riga);
while (getline(file, nome, ',')) {
    getline(file, materia, ',');
    getline(file, voto);
    int numero = stoi(voto);
}
file.close();
```

| | Python | C++ |
|---|---|---|
| Tagliare una riga | `riga.strip().split(",")` dà la lista dei campi | `getline(file, nome, ',')` legge fino alla virgola |
| L'ultimo campo | l'ultimo elemento della lista | `getline(file, voto)` legge fino all'a capo |
| Un campo | `campi[0]`, `campi[1]`, `campi[2]` | una variabile per campo |

## Calcolare su una colonna

Somma o conta il campo che sta sempre nella stessa posizione; per guardare solo certe righe, una selezione su un altro campo: `if campi[0] == "Anna":` in Python, `if (nome == "Anna")` in C++.

## Scrivere un file CSV

Prima l'intestazione, poi una riga per volta: i campi con il separatore in mezzo e l'a capo in fondo.

```python
uscita.write("squadra,punti\n")
uscita.write(campi[0] + "," + str(punti) + "\n")
```

```cpp
uscita << "squadra,punti" << endl;
uscita << squadra << "," << punti << endl;
```

```ad-warning
L'intestazione non è un dato
Se non la salti viene contata come le altre righe, e alla prima conversione in numero il programma si ferma.
```

```ad-warning
Il separatore sbagliato
Tagliando alla virgola un file scritto con il punto e virgola, ogni riga resta in un campo solo: prima di leggere un file, guarda quale separatore usa.
```

```ad-warning
La virgola dentro un dato
`7,5` tagliato alle virgole diventa due campi: per questo con i numeri all'italiana il separatore è spesso il punto e virgola.
```
