# Formulario: La selezione a due vie

## Condizione

- Selezione: la struttura con cui il programma sceglie quali istruzioni eseguire guardando i dati.
- Condizione: un'espressione che, con i valori di quel momento, è vera oppure falsa.
- Operatori di confronto, uguali in Python e in C++: `==`, `!=`, `<`, `>`, `<=`, `>=`.

## Selezione a una via: `if`

Se la condizione è vera il programma esegue il blocco; se è falsa lo salta e prosegue.

```python
if spesa >= 50:
    print("Sconto di 10 euro")
    spesa = spesa - 10

print("Paghi", spesa, "euro")
```

```cpp
if (spesa >= 50) {
    cout << "Sconto di 10 euro" << endl;
    spesa = spesa - 10;
}

cout << "Paghi " << spesa << " euro" << endl;
```

Nel diagramma di flusso la condizione è un rombo; il ramo del no non contiene niente e si riunisce all'altro dopo il blocco.

## Il blocco

Il blocco è fatto dalle istruzioni che dipendono dalla condizione.

| | Python | C++ |
|---|---|---|
| Condizione | seguita dai due punti | tra parentesi tonde, senza punto e virgola dopo |
| Blocco | le righe rientrate di quattro spazi | tra parentesi graffe |
| Fine del blocco | la prima riga che torna a sinistra | la graffa chiusa |

## Selezione a due vie: `if ... else`

I blocchi sono due: il primo se la condizione è vera, quello dopo `else` se è falsa. Il programma ne esegue sempre uno, mai tutti e due e mai nessuno.

```python
if voto >= 6:
    print("promosso")
else:
    print("bocciato")
```

```cpp
if (voto >= 6) {
    cout << "promosso" << endl;
} else {
    cout << "bocciato" << endl;
}
```

- Dopo `else` non si scrive una condizione: ci arrivano tutti i casi in cui quella dell'`if` è falsa.
- In Python `else:` è allineato all'`if`; in C++ sta tra la graffa che chiude il primo blocco e quella che apre il secondo.

## Pari o dispari

Il resto della divisione si calcola con `%`: `7 % 2` vale $1$, `10 % 2` vale $0$.

| Condizione | Vera quando |
|---|---|
| `n % 2 == 0` | `n` è pari |
| `n % 3 == 0` | `n` è un multiplo di $3$ |

```ad-warning
Un solo = non confronta
Il confronto è `==`. `if voto = 10:` in Python è un errore; `if (voto = 10)` in C++ mette $10$ in `voto` e risulta sempre vera.
```

```ad-warning
Python: il rientro dimenticato
Una riga del blocco che torna a sinistra esce dal blocco e viene eseguita sempre, senza nessun errore.
```

```ad-warning
C++: il punto e virgola e le graffe
`if (spesa >= 50);` chiude la selezione su quella riga; senza le graffe dalla condizione dipende solo la prima istruzione.
```
