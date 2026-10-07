# Formulario: Definire e chiamare una funzione

## Definizione e chiamata

Una funzione è un pezzo di programma con un nome: si scrive una volta e si esegue ogni volta che viene chiamata.

| | Python | C++ |
|---|---|---|
| Definizione | `def linea():` | `void linea() {` ... `}` |
| Corpo | le righe rientrate di quattro spazi | le istruzioni tra le graffe |
| Chiamata | `linea()` | `linea();` |
| Dove si definisce | sopra la prima chiamata | fuori da `main`, prima |

```python
def linea():
    print("------------")

print("Classifica")
linea()
```

```cpp
void linea() {
    cout << "------------" << endl;
}

int main() {
    cout << "Classifica" << endl;
    linea();
    return 0;
}
```

In C++ `void` vuol dire che la funzione non restituisce niente; `main` è la funzione da cui il programma comincia.

## Che cosa succede a una chiamata

1. Il programma si ferma alla riga della chiamata.
2. Il flusso salta alla prima istruzione del corpo.
3. Il corpo viene eseguito fino in fondo.
4. Il flusso torna all'istruzione che segue la chiamata.

Il corpo è scritto una volta e viene eseguito una volta per ogni chiamata. Una chiamata può stare in un ciclo o in una selezione, e un programma può definire più funzioni.

## Le funzioni già pronte

`print`, `input`, `int`, `range` in Python, `pow` e `sqrt` in C++ sono funzioni definite da altri: si chiamano conoscendo il nome, che cosa fanno e che cosa mettere tra le parentesi.

## Un parametro

Un parametro è una variabile dichiarata tra le parentesi della definizione, che riceve il suo valore alla chiamata.

| | Python | C++ |
|---|---|---|
| Definizione | `def linea(n):` | `void linea(int n) {` |
| Chiamata | `linea(5)` | `linea(5);` |

Con `linea(5)` il parametro `n` vale $5$ per tutta la durata della chiamata.

```ad-warning
Definita e mai chiamata
La definizione non esegue il corpo: senza una chiamata la funzione non fa niente, e nessun errore lo segnala.
```

```ad-warning
La chiamata senza parentesi
`linea` da sola non chiama la funzione: servono le parentesi, anche vuote.
```

```ad-warning
La chiamata prima della definizione
In Python dà `NameError` quando l'esecuzione arriva alla chiamata; in C++ il programma non viene compilato.
```
