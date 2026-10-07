# Flashcard: Variabili locali e globali

## locale-definizione
Che cos'è una variabile locale?
---
Una variabile creata dentro una funzione: si può usare solo lì, dal punto in cui nasce fino alla fine della funzione.

## parametri-locali
I parametri di una funzione sono variabili locali o globali?
---
Locali: ricevono il valore dagli argomenti della chiamata e spariscono al ritorno.

## visibilita
Che cosa si intende per visibilità di una variabile?
---
La parte del programma in cui il suo nome si può usare.

## locale-da-fuori
La funzione `punti` calcola il risultato nella variabile locale `totale`. Il programma principale chiama `punti(4, 1)` e poi scrive `totale`. Che cosa succede?
---
Un errore: fuori da `punti` il nome `totale` non esiste. Dalla funzione esce solo il valore di `return`.

## errore-due-linguaggi
Un programma usa una variabile locale fuori dalla sua funzione. Che differenza c'è tra Python e C++?
---
Python esegue fino a quella riga e poi si ferma con `NameError`; in C++ il compilatore segnala l'errore e il programma non parte.

## tempo-di-vita
Quando nasce e quando sparisce una variabile locale?
---
Nasce quando la funzione viene chiamata e sparisce quando la funzione ritorna.

## pila-chiamate
Che cosa contiene la pila delle chiamate?
---
Un riquadro per ogni funzione chiamata e non ancora finita, con i suoi parametri e le sue variabili locali; in fondo c'è il programma principale.

## stesso-nome
Il programma principale ha `totale = 0` e chiama `punti(4, 1)`, che al suo interno fa `totale = 3 * vinte + pareggi`. Quanto vale il `totale` del programma principale mentre `punti` è in esecuzione?
---
$0$: quello di `punti` è un'altra variabile, che vale $13$ e sta in un altro riquadro.

## seconda-chiamata
Vero o falso: alla seconda chiamata di una funzione le sue variabili locali hanno ancora i valori della prima.
---
Falso. A ogni chiamata nascono variabili nuove, che della chiamata precedente non ricordano niente.

## contatore-locale
Una funzione comincia con `quanti = 0` e poi fa `quanti = quanti + 1`. Dopo cinque chiamate, quanto vale `quanti` al momento del quinto `return`?
---
$1$: il contatore è locale e riparte da $0$ a ogni chiamata.

## globale-definizione
Che cos'è una variabile globale?
---
Una variabile creata fuori da ogni funzione: vive fino alla fine del programma e si può usare in tutte le funzioni che la seguono.

## globale-letta
`per_vittoria` è globale e vale $3$; `punti(vinte, pareggi)` restituisce `per_vittoria * vinte + pareggi`. Il programma scrive `punti(4, 1)`, poi mette $2$ in `per_vittoria` e scrive di nuovo `punti(4, 1)`. Che cosa scrive?
---
$13$ e poi $9$: la stessa chiamata dà due risultati, perché la funzione dipende da una variabile che non è tra i suoi parametri.

## main-cpp
In C++ le variabili dichiarate dentro `main` sono globali?
---
No, sono locali di `main`: le altre funzioni non le vedono. È globale una variabile dichiarata fuori da tutte le funzioni.

## principale-python
In Python le variabili create nel programma principale, fuori dalle funzioni, sono locali o globali?
---
Globali: una funzione le può leggere anche senza riceverle come parametri.

## global-python
In Python, che cosa deve scrivere una funzione per assegnare un valore alla globale `per_vittoria`?
---
La riga `global per_vittoria` prima dell'assegnamento. Senza, l'assegnamento crea una variabile locale.

## locale-nasconde
Una funzione crea una variabile con lo stesso nome di una globale. Quale delle due cambia quando la funzione le assegna un valore?
---
La locale. La globale è nascosta dentro la funzione e resta com'era.

## perche-evitare
Perché una funzione che legge una variabile globale è più difficile da capire?
---
Perché il suo risultato dipende da chi ha cambiato la globale e quando, cioè da righe che stanno fuori dalla funzione.

## regola-parametri
Qual è la regola per fare a meno delle variabili globali?
---
Passare alla funzione quello che le serve come parametro e farsi restituire il risultato con `return`.

## costante-globale
Quale tipo di valore globale non dà problemi, e come si scrive il suo nome?
---
Una costante, cioè un valore che non cambia mai: il nome va in maiuscolo, come `PER_VITTORIA`, e in C++ si dichiara con `const`.
