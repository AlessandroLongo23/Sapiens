# Prova dei programmi nelle lezioni

Questa pagina prova i blocchi `codice`: un esempio da eseguire, lo stesso programma in tre linguaggi, un esercizio con le prove, un esercizio in JavaScript, una pagina web con i suoi controlli e due progetti a più file.

## Un programma da eseguire

Un ciclo `for` ripete le istruzioni rientrate una volta per ogni valore dell'intervallo. Esegui il programma, poi cambia `range(1, 6)` e guarda che cosa succede.

```codice python
for i in range(1, 6):
    print(i, "al quadrato fa", i * i)
```

## Lo stesso programma in tre linguaggi

Il programma legge due numeri interi e scrive il più grande. La linguetta sceglie il linguaggio, e la scelta vale per tutti i programmi della pagina.

```codice python
a = int(input("Primo numero: "))
b = int(input("Secondo numero: "))

if a > b:
    print("Il più grande è", a)
else:
    print("Il più grande è", b)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cout << "Primo numero: ";
    cin >> a;
    cout << "Secondo numero: ";
    cin >> b;

    if (a > b) {
        cout << "Il più grande è " << a << endl;
    } else {
        cout << "Il più grande è " << b << endl;
    }
    return 0;
}
```

```codice c
#include <stdio.h>

int main(void) {
    int a, b;
    printf("Primo numero: ");
    scanf("%d", &a);
    printf("Secondo numero: ");
    scanf("%d", &b);

    if (a > b) {
        printf("Il più grande è %d\n", a);
    } else {
        printf("Il più grande è %d\n", b);
    }
    return 0;
}
```

## Un esercizio

Scrivi un programma che legge un numero intero $n$ e stampa la somma dei numeri da $1$ a $n$. Il programma di partenza legge $n$ e stampa sempre $0$: completalo. "Verifica" lo prova su quattro valori di $n$.

```codice python
n = int(input())
somma = 0
# scrivi qui il ciclo

print(somma)
%% soluzione
n = int(input())
somma = 0
for i in range(1, n + 1):
    somma += i

print(somma)
%% prova
1
%% stampa
1
%% prova
4
%% stampa
10
%% prova
100
%% stampa
5050
%% prova
0
%% stampa
0
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n, somma = 0;
    cin >> n;
    // scrivi qui il ciclo

    cout << somma << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n, somma = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        somma += i;
    }

    cout << somma << endl;
    return 0;
}
```

```codice c
#include <stdio.h>

int main(void) {
    int n, somma = 0;
    scanf("%d", &n);
    /* scrivi qui il ciclo */

    printf("%d\n", somma);
    return 0;
}
%% soluzione
#include <stdio.h>

int main(void) {
    int n, somma = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        somma += i;
    }

    printf("%d\n", somma);
    return 0;
}
```

## Un esercizio in JavaScript

Il programma legge un numero con `prompt()` e scrive con `console.log()` se è pari o dispari.

```codice javascript
const n = Number(prompt("Numero?"));
// scrivi qui
%% soluzione
const n = Number(prompt("Numero?"));
if (n % 2 === 0) {
    console.log("pari");
} else {
    console.log("dispari");
}
%% prova
4
%% stampa
pari
%% prova
7
%% stampa
dispari
```

## Una pagina web

La pagina ha un titolo e un elenco. Scrivi "Le mie materie" nel titolo, aggiungi una terza voce all'elenco e fai diventare il titolo blu nel foglio di stile.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Materie</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1></h1>
    <ul>
        <li>Matematica</li>
        <li>Informatica</li>
    </ul>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Materie</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Le mie materie</h1>
    <ul>
        <li>Matematica</li>
        <li>Informatica</li>
        <li>Fisica</li>
    </ul>
</body>
</html>
%% controllo Il titolo dice "Le mie materie"
h1 | testo = Le mie materie
%% controllo L'elenco ha tre voci
ul > li | quanti = 3
%% controllo Il titolo è blu
h1 | stile color = blue
```

```codice css
h1 {
    color: black;
}
%% soluzione
h1 {
    color: blue;
}
```

## Un sito di due pagine

Più blocchi con il nome di un file sono un progetto: ogni file ha la sua linguetta, e il primo è quello aperto. Le due pagine si richiamano con un link e usano lo stesso foglio di stile.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Home</title>
    <link rel="stylesheet" href="stile.css">
</head>
<body>
    <h1>Home</h1>
    <a href="contatti.html">Contatti</a>
</body>
</html>
```

```codice contatti.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Contatti</title>
    <link rel="stylesheet" href="stile.css">
</head>
<body>
    <h1>Contatti</h1>
    <a href="index.html">Torna alla home</a>
</body>
</html>
```

```codice stile.css
h1 {
    color: teal;
}
```

## Un programma con un modulo

Il programma usa una funzione scritta in un altro file. Completa `doppio` nel modulo `conti.py`.

```codice main.py
import conti

n = int(input())
print(conti.doppio(n))
%% prova
4
%% stampa
8
```

```codice conti.py
def doppio(n):
    # scrivi qui
    return n
%% soluzione
def doppio(n):
    return n * 2
```

