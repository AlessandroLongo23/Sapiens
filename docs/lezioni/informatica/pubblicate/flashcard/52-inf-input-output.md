# Flashcard: Il primo programma: input e output

## input-e-output
Che cosa sono l'input e l'output di un programma?
---
L'input è quello che entra nel programma, per esempio dalla tastiera; l'output è quello che ne esce, per esempio sullo schermo.

## ordine-delle-istruzioni
Un programma ha due istruzioni: la prima stampa "A", la seconda stampa "B". In che ordine escono?
---
Prima A, poi B: le istruzioni si eseguono una dopo l'altra, dall'alto in basso.

## stampa-con-virgolette
Che cosa stampa `print("3 * 8")`?
---
3 * 8. Un testo tra virgolette viene stampato così com'è.

## stampa-senza-virgolette
Che cosa stampa `print(3 * 8)`?
---
24. Senza virgolette il conto viene calcolato e poi stampato.

## print-mette-gli-spazi
Che cosa stampa `print("Totale:", 24, "euro")`?
---
Totale: 24 euro. Tra una cosa e l'altra `print` mette da solo uno spazio.

## cout-non-mette-gli-spazi
In C++, che cosa stampa `cout << "Totale:" << 24 << endl;`?
---
Totale:24, tutto attaccato. `cout` non aggiunge spazi: vanno scritti dentro le virgolette.

## senza-endl
In C++, che cosa stampano di seguito `cout << "Uno";` e `cout << "Due";`?
---
UnoDue, sulla stessa riga. Per andare a capo serve `endl`.

## inizio-del-programma-cpp
In un programma C++, da dove parte l'esecuzione?
---
Dalla prima istruzione dopo `int main() {`, e prosegue fino alla graffa chiusa.

## include-iostream
In C++, a che cosa serve la riga `#include <iostream>`?
---
Porta nel programma gli strumenti per scrivere e per leggere, `cout` e `cin`.

## fine-di-una-istruzione
Come finisce un'istruzione in Python? E in C++?
---
In Python dove finisce la riga; in C++ al punto e virgola.

## virgolette-dimenticate
Che cosa succede eseguendo `print(Ciao)`, senza virgolette?
---
Un errore: il computer cerca qualcosa che si chiama Ciao e non lo trova (`name 'Ciao' is not defined`).

## maiuscola-nel-comando
`Print("Ciao")` funziona?
---
No. `Print` e `print` sono parole diverse, e solo quella in minuscolo esiste.

## commento
Con quale segno comincia un commento in Python? E in C++?
---
In Python con `#`, in C++ con `//`. Il computer salta tutto fino alla fine della riga.

## input-con-domanda
In Python, che cosa fa `nome = input("Come ti chiami? ")`?
---
Stampa la domanda, aspetta che tu scriva e prema Invio, e mette la risposta nella variabile `nome`.

## verso-di-cin
In C++, per leggere un valore nella variabile `nome` si scrive `cin >> nome` o `cin << nome`?
---
`cin >> nome`. Le frecce indicano dove vanno i dati: dalla tastiera verso la variabile.

## due-parole-cpp
In C++, a `cin >> nome;` rispondi Anna Maria. Che cosa c'è in `nome`?
---
Solo Anna: `cin >>` si ferma al primo spazio.

## due-parole-python
In Python, a `nome = input()` rispondi Anna Maria. Che cosa c'è in `nome`?
---
Anna Maria: `input()` legge tutta la riga, spazi compresi.

## cifre-lette
Vero o falso: se alla tastiera scrivi 15, il programma riceve un numero.
---
Falso. Dalla tastiera arriva sempre un testo, anche quando è fatto di cifre.
