# Formulario: Il ciclo while

## Com'è fatto

- Ciclo: un blocco di istruzioni eseguito più volte di seguito. Ogni esecuzione è un giro; ripetere si dice iterare.
- Condizione: una domanda con risposta vero o falso. Corpo: le istruzioni da ripetere.
- Se la condizione è vera si esegue il corpo e si torna a controllarla; se è falsa si prosegue dopo il ciclo.

```python
i = 5
while i > 0:
    print(i)
    i = i - 1
print("Via!")
```

```cpp
int i = 5;
while (i > 0) {
    cout << i << endl;
    i = i - 1;
}
cout << "Via!" << endl;
```

| | Python | C++ |
|---|---|---|
| Condizione | seguita dai due punti | tra parentesi tonde |
| Corpo | le righe rientrate di quattro spazi | tra parentesi graffe |
| Leggere un intero | `n = int(input())` | `cin >> n;` |
| Divisione intera | `h // 2` | `h / 2` tra due `int` |

Nel diagramma di flusso la condizione è un rombo: il ramo "sì" scende nel corpo, da cui una freccia risale sopra il rombo; dal ramo "no" si esce.

## Tabella di traccia

Una riga per ogni controllo della condizione, con i valori delle variabili. Conto alla rovescia con `i` che parte da $3$:

| Controllo | `i` | `i > 0` | Scritto | `i` dopo il giro |
|---|---|---|---|---|
| primo | $3$ | vero | $3$ | $2$ |
| secondo | $2$ | vero | $2$ | $1$ |
| terzo | $1$ | vero | $1$ | $0$ |
| quarto | $0$ | falso | si esce | |

I controlli sono uno in più dei giri: $3$ giri, $4$ controlli.

## Perché finisce, e quando non parte

- Il corpo deve cambiare almeno una variabile della condizione, nella direzione che la fa diventare falsa.
- La condizione si controlla prima del primo giro: se è falsa subito, il corpo non viene eseguito nemmeno una volta.

## Quando il numero dei giri non si conosce

Il `while` serve quando i giri dipendono dai conti (dimezzare finché si resta sopra una soglia) o da quello che viene scritto (leggere finché arriva un segnale di fine).

Leggere e sommare fino allo $0$:

1. Leggi il primo numero, prima del ciclo.
2. Finché il numero è diverso da $0$: aggiungilo alla somma e leggi il successivo, in fondo al corpo.
3. Dopo il ciclo scrivi la somma.

```python
s = 0
n = int(input())
while n != 0:
    s = s + n
    n = int(input())
print(s)
```

```ad-warning
Il ciclo che non finisce mai
Senza l'istruzione che cambia la variabile della condizione (`i = i - 1`), o con la variabile che cambia nel verso sbagliato, la condizione resta vera per sempre.
```

```ad-warning
Il verso del confronto
`i < 0` al posto di `i > 0` dà un ciclo che non parte mai. Leggi la condizione con "finché".
```

```ad-warning
La lettura prima del ciclo
Senza la prima lettura la condizione usa una variabile che non ha ancora un valore: errore in Python, comportamento imprevedibile in C++.
```
