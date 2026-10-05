# Formulario: Il primo programma: input e output

## La struttura minima

- Input: quello che entra nel programma. Output: quello che ne esce.
- Le istruzioni si eseguono una dopo l'altra, dall'alto in basso.
- In Python un'istruzione finisce dove finisce la riga; in C++ finisce con il punto e virgola.

Il programma più corto in Python:

```
print("Ciao, mondo!")
```

Lo stesso in C++, con la cornice che si ripete in ogni programma:

```
#include <iostream>
using namespace std;

int main() {
    cout << "Ciao, mondo!" << endl;
    return 0;
}
```

## Stampare

| Che cosa | Python | C++ |
|---|---|---|
| un testo | `print("Ciao")` | `cout << "Ciao" << endl;` |
| un conto | `print(3 * 8)` | `cout << 3 * 8 << endl;` |
| più cose | `print("Totale:", 24, "euro")` | `cout << "Totale: " << 24 << " euro" << endl;` |
| lo spazio tra due cose | lo mette `print` | lo scrivi tu dentro le virgolette |
| l'a capo | lo mette `print` | `endl` |

- Tra virgolette: stampato così com'è. Senza virgolette: calcolato e poi stampato (`"3 * 8"` stampa 3 * 8, `3 * 8` stampa 24).

## Commenti

| Python | C++ |
|---|---|
| `# testo del commento` | `// testo del commento` |

## Leggere

| Che cosa | Python | C++ |
|---|---|---|
| preparare la variabile | non serve | `string nome;` con `#include <string>` |
| domanda e lettura | `nome = input("Come ti chiami? ")` | `cout << "Come ti chiami? ";` e poi `cin >> nome;` |
| lettura senza domanda | `nome = input()` | `cin >> nome;` |
| quanto legge | tutta la riga | fino al primo spazio |

- Verso dei segni in C++: `cout <<` verso lo schermo, `cin >>` verso la variabile.
- Quello che arriva dalla tastiera è un testo, anche se sono cifre.

```ad-warning
Le virgolette dimenticate
`print(Ciao)` cerca qualcosa che si chiama Ciao e si ferma con un errore.
```

```ad-warning
Punto e virgola e maiuscole
In C++ ogni istruzione finisce con `;`. `Print` e `print` sono parole diverse.
```

```ad-warning
In C++ senza `endl` non si va a capo
Due `cout` di seguito scrivono sulla stessa riga, attaccati.
```
