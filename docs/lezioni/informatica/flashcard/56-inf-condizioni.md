# Flashcard: Condizioni e operatori di confronto

## condizione
Che cos'è una condizione?
---
Un'espressione il cui valore è vero oppure falso, secondo i valori che le variabili hanno in quel momento.

## condizione-o-no
Quale delle due è una condizione: `voto + 1` oppure `voto >= 6`?
---
`voto >= 6`: il suo valore è vero o falso. Il valore di `voto + 1` è un numero.

## voto-sette
Con `voto` uguale a $7$, quanto valgono `voto >= 6` e `voto != 7`?
---
La prima è vera, la seconda è falsa.

## diverso
Come si scrive "diverso da" in Python e in C++?
---
`!=`, nello stesso modo nei due linguaggi.

## confine-minore
Quanto valgono `5 < 5` e `5 <= 5`?
---
`5 < 5` è falsa, `5 <= 5` è vera: i due operatori si distinguono solo sul valore di confine.

## almeno
Come si scrive la condizione "almeno $18$ anni" con la variabile `eta`?
---
`eta >= 18`. Con `eta > 18` chi ha esattamente $18$ anni resterebbe fuori.

## uguale-per-secondo
Vero o falso: "minore o uguale" si può scrivere `=<`.
---
Falso. Si scrive `<=`, nell'ordine in cui si legge; `=<` è un errore.

## rombo
In un diagramma di flusso, in quale blocco sta una condizione?
---
Nel rombo, da cui escono due frecce: una per il sì e una per il no.

## tipo-booleano
Quali valori può avere una variabile di tipo `bool`?
---
Due soli: vero e falso. Si scrivono `True` e `False` in Python, `true` e `false` in C++.

## stampa-python-cpp
Con `voto` uguale a $7$, che cosa scrivono `print(voto >= 6)` in Python e `cout << (voto >= 6)` in C++?
---
Python scrive `True`, il C++ scrive `1`.

## variabile-booleana
`eta` vale $16$. Dopo `maggiorenne = eta >= 18`, quanto vale `maggiorenne`?
---
Falso: prima si calcola il confronto, poi il suo valore va nella variabile.

## assegna-o-confronta
Che differenza c'è tra `a = b` e `a == b`?
---
`a = b` copia in `a` il valore di `b`; `a == b` chiede se i due valori sono uguali e non cambia niente.

## virgola-uguale
Quanto vale `0.1 + 0.2 == 0.3`?
---
Falso: i numeri con la virgola sono conservati in binario con piccoli errori, e la somma non è identica a `0.3`.

## virgola-soglia
Come si controlla se due numeri con la virgola `a` e `b` sono uguali?
---
Si chiede se la loro distanza è minore di una soglia: `abs(a - b) < 0.000001` in Python, `fabs(a - b) < 0.000001` in C++.

## testi-maiuscole
Quanto vale `"Anna" == "anna"`?
---
Falso: maiuscole e minuscole sono caratteri diversi.

## testi-ordine
Quanto vale `"Zebra" < "ape"`?
---
Vero: tra testi conta il codice dei caratteri, e tutte le maiuscole vengono prima delle minuscole.

## testi-cifre
Quanto valgono `"10" < "9"` e `10 < 9`?
---
La prima è vera, perché tra testi si confronta il primo carattere e la cifra 1 viene prima della cifra 9; la seconda, tra numeri, è falsa.

## input-senza-conversione
In Python, dopo `eta = input()` scrivi 18. Quanto vale `eta == 18`?
---
Falso: `eta` contiene il testo `"18"`, e un testo non è mai uguale a un numero. Serve `int(input())`.
