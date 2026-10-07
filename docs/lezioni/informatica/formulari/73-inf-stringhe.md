# Formulario: Le stringhe

## Lunghezza e caratteri

Una stringa è una fila di caratteri con gli indici da $0$. Una stringa di lunghezza $n$ finisce all'indice $n - 1$. Lo spazio è un carattere.

| | Python | C++ (`#include <string>`) |
|---|---|---|
| Lunghezza | `n = len(s)` | `int n = s.length();` |
| Primo carattere | `s[0]` | `s[0]` |
| Ultimo carattere | `s[n - 1]` | `s[n - 1]` |
| Un carattere da solo | `"a"`, stringa lunga $1$ | `'a'`, di tipo `char` |
| Cambiare un carattere | non si può | `s[0] = 'g';` |
| Leggere una parola | `s = input()` | `cin >> s;` |
| Leggere una riga con gli spazi | `s = input()` | `getline(cin, s);` |

## Scorrere una stringa

```python
conta = 0
for i in range(len(parola)):
    if parola[i] == "a":
        conta = conta + 1
```

```cpp
int n = parola.length();
int conta = 0;
for (int i = 0; i < n; i++) {
    if (parola[i] == 'a') {
        conta = conta + 1;
    }
}
```

## Costruire una stringa

Il `+` tra due stringhe le concatena: `"regi" + "stro"` dà `"registro"`. Si parte dalla stringa vuota `""` e si attacca un pezzo a ogni giro.

| Che cosa si ottiene | Ciclo | Istruzione |
|---|---|---|
| la parola rovesciata | `i` da $n - 1$ a $0$ | `nuova = nuova + parola[i]` |
| la parola rovesciata | `i` da $0$ a $n - 1$ | `nuova = parola[i] + nuova` |
| una copia | `i` da $0$ a $n - 1$ | `nuova = nuova + parola[i]` |

Un numero va trasformato prima di concatenarlo: `str(n)` in Python, `to_string(n)` in C++.

## Confrontare

- `==`: stessi caratteri nello stesso ordine; maiuscole e minuscole sono caratteri diversi.
- `<`: ordine dei codici, un carattere alla volta; tutte le maiuscole vengono prima delle minuscole.

Parola palindroma, con due indici:

1. `i` parte da $0$, `j` da $n - 1$.
2. Finché `i < j`: se `parola[i]` e `parola[j]` sono diversi non è palindroma e ci si ferma; altrimenti `i` avanza e `j` arretra.
3. Se gli indici si incontrano, è palindroma. I confronti sono al più la metà della lunghezza.

## Operazioni già pronte

| Operazione | Python | C++ |
|---|---|---|
| posizione della prima "@" ($-1$ se manca) | `s.find("@")` | `int p = s.find("@");` |
| sottostringa dall'indice 0 al 4 | `s[0:5]` | `s.substr(0, 5)` |
| sottostringa dall'indice 6 alla fine | `s[6:]` | `s.substr(6)` |
| tutta in maiuscolo | `s.upper()` | un ciclo con `toupper(s[i])` |

```ad-warning
La lunghezza non è un indice
`s[n]` non esiste: l'ultimo carattere è `s[n - 1]`.
```

```ad-warning
Il + tra una stringa e un numero
`"3" + "4"` fa `"34"`. Per unire un numero serve `str` in Python e `to_string` in C++.
```

```ad-warning
Le lettere accentate in C++
`length()` conta i byte: una lettera accentata ne occupa due, e `"città"` risulta lunga $6$.
```
