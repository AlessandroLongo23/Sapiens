# Formulario: Parametri e valore di ritorno

## Parametri e argomenti

Il parametro è la variabile dichiarata nella definizione; l'argomento è il valore scritto nella chiamata.

| | Python | C++ |
|---|---|---|
| Definizione con due parametri | `def scheda(vinte, pareggi):` | `void scheda(int vinte, int pareggi) {` |
| Chiamata con due argomenti | `scheda(4, 2)` | `scheda(4, 2);` |

- Gli argomenti vanno nei parametri secondo il posto: il primo nel primo, il secondo nel secondo.
- Gli argomenti sono tanti quanti i parametri.
- Un argomento può essere un numero, una variabile o un'espressione: `scheda(v, v - 2)`.

## Il valore di ritorno

`return` seguito da un valore lo restituisce a chi ha chiamato e chiude la funzione.

```python
def punti(vinte, pareggi):
    return 3 * vinte + pareggi

t = punti(4, 2)
```

```cpp
int punti(int vinte, int pareggi) {
    return 3 * vinte + pareggi;
}

int t = punti(4, 2);
```

Il valore restituito prende il posto della chiamata: `t = punti(4, 2)` vale come `t = 14`.

| In C++ la definizione comincia con | Quando |
|---|---|
| `void` | la funzione non restituisce niente |
| `int`, `double` | restituisce un numero intero, o con la virgola |
| `bool` | restituisce vero o falso |

In Python non si dichiara il tipo; una funzione senza `return` restituisce `None`.

## Usare il risultato

| Dove | Esempio |
|---|---|
| In un assegnamento | `tigri = punti(4, 2)` |
| In una stampa | `print(punti(3, 3))` |
| In un conto | `tigri + punti(3, 3)` |
| In una condizione | `if tigri > punti(3, 3):` |
| Come argomento | `maggiore(maggiore(a, b), c)` |

## Stampare o restituire

| | Stampa | Restituisce |
|---|---|---|
| Il risultato | va sullo schermo | torna a chi ha chiamato |
| La chiamata | da sola su una riga | dentro un'espressione |
| Dopo la chiamata | al programma non resta niente | resta un valore da usare |

## Funzioni che chiamano funzioni, vero o falso

```python
def qualificata(vinte, pareggi):
    return punti(vinte, pareggi) >= 10

if qualificata(v, p):
    print("Qualificata")
```

Una funzione che restituisce il risultato di un confronto si usa come condizione di una selezione o di un ciclo.

```ad-warning
Argomenti nell'ordine sbagliato
`punti(2, 4)` al posto di `punti(4, 2)` non dà errori: dà $10$ al posto di $14$.
```

```ad-warning
print al posto di return
Il numero compare sullo schermo ma non torna a chi ha chiamato: in Python la chiamata vale `None`.
```

```ad-warning
Il valore lasciato cadere
`punti(4, 2)` da sola su una riga calcola $14$ e non lo usa: sullo schermo non compare niente.
```
