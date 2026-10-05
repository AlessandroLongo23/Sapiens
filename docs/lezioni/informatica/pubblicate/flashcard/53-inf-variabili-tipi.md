# Flashcard: Variabili, assegnamento e tipi di dato

## variabile
Che cos'è una variabile?
---
Un posto della memoria a cui il programma dà un nome e in cui tiene un valore, uno solo alla volta.

## assegnamento-due-tempi
In che ordine il computer esegue l'assegnamento `punti = punti + 5`?
---
Prima calcola quello che sta a destra dell'uguale, poi mette il risultato nella variabile di sinistra.

## traccia-punti
Dopo `punti = 10`, `punti = punti + 5` e `punti = punti * 2`, quanto vale `punti`?
---
30: prima $10 + 5 = 15$, poi $15 \cdot 2 = 30$.

## ordine-delle-istruzioni
Dopo `punti = 10`, `punti = punti * 2` e `punti = punti + 5`, quanto vale `punti`?
---
25: prima $10 \cdot 2 = 20$, poi $20 + 5 = 25$. L'ordine delle istruzioni conta.

## verso-dell-assegnamento
Con 3 in `a` e 8 in `b`, quale variabile cambia con `a = b`? E quanto valgono dopo?
---
Cambia `a`, quella a sinistra: dopo valgono tutte e due 8.

## numero-a-sinistra
`10 = punti` è un assegnamento valido?
---
No. A sinistra dell'uguale ci va una variabile: 10 non è un posto in cui mettere qualcosa.

## nome-valido
Quale di questi nomi di variabile è valido: `voto1`, `1voto`, `prezzo totale`?
---
Solo `voto1`. Un nome non comincia con una cifra e non contiene spazi.

## maiuscole-nei-nomi
`punti` e `Punti` sono la stessa variabile?
---
No. Maiuscole e minuscole sono lettere diverse.

## tipo-di-un-testo-di-cifre
Di che tipo è il valore `"3"`, con le virgolette?
---
È una stringa, cioè un testo di un carattere, non il numero tre.

## nomi-dei-tipi
Come si chiama il tipo dei numeri con la virgola in Python? E in C++?
---
`float` in Python, `double` in C++.

## somma-di-stringhe
Che cosa dà `"3" + "4"`?
---
`"34"`: tra due stringhe il `+` le attacca una dopo l'altra.

## punto-decimale
In un programma, come si scrive il numero due e mezzo?
---
`2.5`, con il punto al posto della virgola.

## divisione-in-cpp
In C++, quanto fa `7 / 2`? E `7.0 / 2`?
---
3 e 3.5. Tra due interi la divisione butta via la parte dopo la virgola.

## divisione-in-python
In Python, quanto fa `7 / 2`? E `7 // 2`?
---
3.5 e 3. `/` dà sempre il risultato con la virgola, `//` è la divisione intera.

## media-in-cpp
In C++, con `int a = 7, b = 2;`, che cosa finisce in `double media = (a + b) / 2;`?
---
4, non 4.5: il conto a destra è tra interi. Si corregge dividendo per `2.0`.

## dichiarazione
In C++ una variabile va dichiarata prima di usarla. Che cosa si scrive nella dichiarazione?
---
Il tipo davanti al nome, come in `int punti;`. In Python la dichiarazione non c'è.

## lettura-senza-conversione
In Python, dopo `quantita = input()` con la risposta 3, quanto vale `quantita + quantita`?
---
`"33"`: senza conversione il valore letto è una stringa.

## leggere-un-intero
Come si legge un numero intero in Python?
---
Con `int(input())`: `input()` dà una stringa e `int(...)` la trasforma in un intero.

## scambio-sbagliato
Con 3 in `a` e 8 in `b`, quanto valgono dopo `a = b` e poi `b = a`?
---
8 e 8: la prima istruzione cancella il 3, e lo scambio non riesce.

## scambio-con-temp
Quali tre istruzioni scambiano i valori di `a` e `b`?
---
`temp = a`, poi `a = b`, poi `b = temp`: la variabile `temp` mette da parte il valore di `a`.
