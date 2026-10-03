# Prova dei programmi nelle lezioni

Questa pagina prova i blocchi `codice`: un esempio da eseguire, lo stesso programma in tre linguaggi, un esercizio con le prove.

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
