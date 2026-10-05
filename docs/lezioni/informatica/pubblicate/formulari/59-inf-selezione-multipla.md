# Formulario: Selezioni annidate e a più vie

## Selezioni annidate

Due selezioni sono annidate quando una sta nel blocco dell'altra. Ogni rombo divide una strada in due: per tre strade servono due rombi, per quattro tre.

```python
if gradi > 0:
    print("sopra")
else:
    if gradi < 0:
        print("sotto")
    else:
        print("zero")
```

```cpp
if (gradi > 0) {
    cout << "sopra" << endl;
} else {
    if (gradi < 0) {
        cout << "sotto" << endl;
    } else {
        cout << "zero" << endl;
    }
}
```

- La selezione interna è scritta un livello più a destra.
- In Python un `else` appartiene all'`if` che sta sulla sua stessa colonna; in C++ decidono le graffe.
- Una selezione annidata nel ramo del sì, senza `else`, equivale a una condizione sola con `and`.

## Selezione a più vie

Quando la selezione interna sta sempre nel ramo dell'`else`, le condizioni si scrivono in fila: `elif` in Python, `else if` in C++.

```python
if voto >= 9:
    print("ottimo")
elif voto >= 7:
    print("buono")
elif voto >= 6:
    print("sufficiente")
else:
    print("insufficiente")
```

```cpp
if (voto >= 9) {
    cout << "ottimo" << endl;
} else if (voto >= 7) {
    cout << "buono" << endl;
} else if (voto >= 6) {
    cout << "sufficiente" << endl;
} else {
    cout << "insufficiente" << endl;
}
```

1. Le condizioni si controllano dall'alto in basso.
2. Alla prima vera si esegue il suo blocco e si salta tutto il resto.
3. Se nessuna è vera si esegue il blocco dell'`else` finale, che è facoltativo.
4. Viene eseguito un blocco solo.

## L'ordine delle condizioni

- Conta la prima condizione vera: con il voto $9$ sono vere `voto >= 9`, `voto >= 7` e `voto >= 6`, e vince la prima.
- Con le soglie si va in ordine: dalla più alta alla più bassa con `>=`, dalla più bassa alla più alta con `<`.

## Scegliere in base a un valore

Quando tutte le condizioni confrontano la stessa variabile con valori fissi.

```python
match scelta:
    case 1:
        print("acqua")
    case 2:
        print("succo")
    case _:
        print("scelta non valida")
```

```cpp
switch (scelta) {
    case 1:
        cout << "acqua" << endl;
        break;
    case 2:
        cout << "succo" << endl;
        break;
    default:
        cout << "scelta non valida" << endl;
}
```

| | Python: `match` | C++: `switch` |
|---|---|---|
| Caso per gli altri valori | `case _:` | `default:` |
| Fine di un caso | non serve niente | `break;` |
| Valori ammessi | anche i testi | numeri interi e singoli caratteri |
| Soglie come `voto >= 6` | con `elif` | con `else if` |

```ad-warning
Tanti if al posto di elif
Le selezioni separate vengono controllate tutte: con il voto $9$ escono "ottimo", "buono" e "sufficiente".
```

```ad-warning
L'ordine sbagliato delle soglie
Con `voto >= 6` per prima, nessun voto arriva a "buono" e a "ottimo".
```

```ad-warning
In C++ ogni caso finisce con break
Senza `break` il programma prosegue con le istruzioni dei casi successivi.
```
