# Formulario: Variabili, assegnamento e tipi di dato

## Variabile e assegnamento

- Variabile: un posto della memoria con un nome, che tiene un valore alla volta.
- Assegnamento: `nome = valore`. Prima si calcola quello che sta a destra, poi il risultato va nella variabile di sinistra, al posto del valore di prima.
- `punti = punti + 5`: prendi il valore di `punti`, aggiungi 5, rimetti il risultato in `punti`.
- Tabella di traccia: una riga per ogni istruzione eseguita, con il valore delle variabili dopo quella istruzione.

| | Python | C++ |
|---|---|---|
| creare una variabile | `punti = 10` | `int punti = 10;` |
| cambiarla | `punti = punti + 5` | `punti = punti + 5;` |
| il tipo | è quello del valore assegnato | si dichiara una volta, davanti al nome |

## Nomi

- Lettere, cifre e `_`, senza spazi; non comincia con una cifra (`voto1` sì, `1voto` no).
- Maiuscole e minuscole contano: `punti` e `Punti` sono due variabili.
- Non può essere una parola del linguaggio (`if`, `while`, `int`).
- Abitudini: un nome che dice che cosa contiene (`prezzo`), due parole unite da `_` (`prezzo_totale`), niente accenti (`quantita`).

## Tipi di dato

| Tipo | Esempi | In Python | In C++ |
|---|---|---|---|
| numero intero | `15`, `-3`, `0` | `int` | `int` |
| numero con la virgola | `2.5`, `-0.75` | `float` | `double` |
| testo (stringa) | `"Giulia"`, `"3"` | `str` | `string` |
| booleano | vero o falso | `bool`: `True`, `False` | `bool`: `true`, `false` |

- La virgola dei decimali è un punto: `2.5`.
- `+` tra due numeri è l'addizione (`3 + 4` fa 7); tra due stringhe le attacca (`"3" + "4"` fa `"34"`).
- Divisione: in C++ `7 / 2` tra interi fa 3 e `7.0 / 2` fa 3.5; in Python `7 / 2` fa 3.5 e `7 // 2` fa 3.

## Leggere un valore e convertirlo

| Che cosa leggi | Python | C++ |
|---|---|---|
| un intero | `n = int(input())` | `int n;` e poi `cin >> n;` |
| un numero con la virgola | `x = float(input())` | `double x;` e poi `cin >> x;` |

- In Python `input()` dà sempre una stringa, e la conversione la chiedi tu; in C++ la fa `cin >>`, secondo il tipo dichiarato.

## Scambiare due variabili

1. `temp = a`
2. `a = b`
3. `b = temp`

```ad-warning
L'assegnamento va da destra a sinistra
Cambia la variabile a sinistra dell'uguale: `a = b` cambia `a`, `b = a` cambia `b`.
```

```ad-warning
In C++ la media di due interi perde i decimali
`(a + b) / 2` tra interi dà un intero: si divide per `2.0`.
```

```ad-warning
In Python un numero letto senza conversione resta un testo
Con `quantita = input()` e la risposta 3, `quantita + quantita` dà `"33"`.
```
