# Formulario: Passaggio dei parametri per valore e per riferimento

## Passaggio per valore

Alla funzione arriva il valore dell'argomento, non la variabile di chi chiama. Il parametro è una variabile locale: un assegnamento al parametro non cambia l'argomento.

```python
def scambia(x, y):
    temp = x
    x = y
    y = temp

a = 3
b = 8
scambia(a, b)
print(a, b)
```

```cpp
void scambia(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}
```

Con `a = 3` e `b = 8` il programma scrive `3 8` nei due linguaggi: lo scambio avviene tra `x` e `y`, che spariscono al ritorno.

## Cambiare le variabili di chi chiama

| | C++ | Python |
|---|---|---|
| Come | passaggio per riferimento: `&` davanti al nome del parametro | la funzione restituisce i valori nuovi |
| Definizione | `void scambia(int &x, int &y)` | `def scambia(x, y):` con `return y, x` |
| Chiamata | `scambia(a, b);` | `a, b = scambia(a, b)` |
| Che cosa sono `x` e `y` | altri nomi di `a` e `b` | variabili locali |

Un riferimento è un altro nome della variabile passata come argomento: ogni assegnamento a `x` scrive in `a`.

```cpp
void scambia(int &x, int &y) {
    int temp = x;
    x = y;
    y = temp;
}
```

## Python: nomi e valori

- Alla chiamata il nome del parametro viene attaccato allo stesso valore dell'argomento, senza copiarlo.
- Un assegnamento al parametro (`x = y`, `voti = [6, 7, 8]`) attacca il nome a un altro valore: chi chiama non vede niente.
- Numeri e testi non si modificano, si sostituiscono. Una lista si modifica un elemento alla volta, e resta la stessa lista: `voti[0] = 6` cambia la lista di chi chiama.

## Vettori

Una funzione che cambia un elemento del vettore ricevuto cambia il vettore di chi chiama, in Python (lista) e in C++ (anche senza `&`).

```python
def recupera(voti):
    voti[0] = 6
```

```cpp
void recupera(int voti[]) {
    voti[0] = 6;
}
```

## Quale strada scegliere

| Che cosa vuoi dalla funzione | In C++ | In Python |
|---|---|---|
| Usa un valore e lascia intatta la tua variabile | parametro per valore | un numero o un testo come argomento |
| Calcola un risultato | `return` | `return` |
| Cambia una tua variabile | parametro con `&` | restituisce il valore nuovo, e tu lo riassegni |
| Consegna due risultati | due parametri con `&` | `return` con due valori |
| Modifica gli elementi di un vettore | il vettore come argomento | la lista come argomento |

```ad-warning
La & dimenticata
Senza `&` la funzione compila, viene eseguita e non modifica niente: nessun messaggio lo segnala.
```

```ad-warning
A un riferimento serve una variabile
`scambia(3, 8)` e `scambia(a, b + 1)` non compilano: l'argomento deve essere un posto in cui scrivere.
```

```ad-warning
Assegnare il parametro non modifica la lista
In Python `voti[0] = 6` modifica la lista ricevuta, `voti = [6, 7, 8]` no.
```
