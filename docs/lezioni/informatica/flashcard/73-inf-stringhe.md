# Flashcard: Le stringhe

## stringa-definizione
Che cos'è una stringa?
---
Una fila di caratteri, ognuno con il suo indice a partire da $0$.

## lunghezza
Qual è la lunghezza di `"Anna Maria"`?
---
$10$: anche lo spazio è un carattere.

## carattere-indice
Con `nome = "Giulia"`, quanto vale `nome[2]`?
---
`u`: gli indici partono da $0$, quindi è il terzo carattere.

## ultimo-carattere
Una stringa `s` ha lunghezza `n`. Come si scrive il suo ultimo carattere?
---
`s[n - 1]`.

## indice-fuori
Con `nome = "Giulia"`, che cosa succede in Python con `nome[6]`?
---
Il programma si ferma con `IndexError`: gli indici vanno da $0$ a $5$.

## char-cpp
In C++ che differenza c'è tra `'a'` e `"a"`?
---
`'a'` è un carattere, di tipo `char`; `"a"` è una stringa lunga $1$.

## modificare-carattere
In Python si può scrivere `nome[0] = "g"`?
---
No, dà un errore: in Python una stringa non si modifica, se ne costruisce una nuova. In C++ si può.

## cin-spazio
In C++ che cosa legge `cin >> parola` se scrivi "Anna Maria"?
---
Solo "Anna": si ferma al primo spazio. Per tutta la riga serve `getline(cin, parola)`.

## vocali-maiuscole
Un programma conta le vocali confrontando ogni carattere con a, e, i, o, u minuscole. Quante ne trova in "Aiuola"?
---
$4$: la A maiuscola è un altro carattere.

## concatenazione
Che cosa dà `"regi" + "stro"`?
---
`"registro"`: tra due stringhe il `+` le unisce.

## tre-piu-quattro
Che cosa dà `"3" + "4"`?
---
`"34"`: sono due stringhe, e il `+` le attacca.

## numero-in-stringa
Come si unisce il numero `eta` al testo `"Hai "`?
---
Trasformandolo prima in stringa: `"Hai " + str(eta)` in Python, `"Hai " + to_string(eta)` in C++.

## rovesciare
`nuova` parte da `""` e il ciclo fa `nuova = parola[i] + nuova` con `i` da $0$ in avanti. Che cosa contiene `nuova` alla fine, se `parola` è "roma"?
---
"amor": ogni carattere viene messo davanti a quelli già presi.

## copia
Stesso ciclo, ma con `nuova = nuova + parola[i]`. Che cosa contiene `nuova` alla fine, se `parola` è "roma"?
---
"roma": i caratteri vengono attaccati in fondo, nello stesso ordine.

## uguali-maiuscola
`"Anna" == "anna"` è vera o falsa?
---
Falsa: la A maiuscola e la a minuscola sono caratteri diversi.

## palindroma-definizione
Quando una parola è palindroma?
---
Quando si legge uguale nei due versi, come "radar".

## palindroma-confronti
Quanti confronti servono per verificare che "ossesso" è palindroma con i due indici?
---
$3$: le coppie sono tre, e il carattere di mezzo resta da solo.

## palindroma-fermarsi
Con i due indici, quanti confronti fa il programma su "casa"?
---
Uno solo: c e a sono diversi, e la risposta c'è già.

## find
Che cosa dà `"rossi@scuola.example".find("@")`?
---
$5$, l'indice della chiocciola. Se il carattere non c'è, dà $-1$.

## sottostringa
Con `s = "registro"`, che cosa danno `s[0:4]` in Python e `s.substr(0, 4)` in C++?
---
`"regi"` tutti e due: i quattro caratteri dall'indice $0$ al $3$.
