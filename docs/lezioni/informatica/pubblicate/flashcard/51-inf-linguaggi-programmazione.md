# Flashcard: Linguaggi, compilatori e interpreti

## linguaggio-macchina
Che cos'è il linguaggio macchina di una CPU?
---
L'insieme delle istruzioni che quella CPU sa eseguire: in memoria ognuna è una sequenza di bit.

## linguaggio-macchina-uguale-per-tutti
Vero o falso: il linguaggio macchina di un portatile è lo stesso di un telefono.
---
Falso. Ogni famiglia di CPU ha il suo linguaggio macchina.

## alto-livello
Che cosa rende "ad alto livello" un linguaggio di programmazione?
---
È pensato per chi scrive: usa parole dell'inglese, segni della matematica e nomi scelti da te, e non chiede di sapere com'è fatta la CPU.

## codice-sorgente
Come si chiama il testo di un programma scritto in un linguaggio ad alto livello?
---
Codice sorgente, o sorgente: un file di testo che si può leggere e correggere.

## sintassi
Che cos'è la sintassi di un linguaggio?
---
L'insieme delle sue regole di scrittura. Sono rigide: una parentesi fuori posto e il programma non viene capito.

## compilatore
Che cosa fa un compilatore?
---
Legge tutto il codice sorgente e lo traduce in linguaggio macchina, una volta per tutte.

## programma-eseguibile
Che cosa produce un compilatore?
---
Un programma eseguibile: un file che la CPU esegue direttamente, senza sorgente e senza compilatore.

## interprete
Che cosa fa un interprete?
---
Legge il sorgente un'istruzione alla volta: la traduce, la fa eseguire subito e passa alla successiva.

## traduzione-ogni-volta
Con quale dei due traduttori la traduzione si rifà a ogni esecuzione?
---
Con l'interprete, che non produce nessun file da conservare.

## app-del-telefono
L'app che scarichi sul telefono è codice sorgente o un programma eseguibile?
---
Un programma eseguibile, compilato per quel tipo di telefono: per questo non parte su un telefono di un altro tipo.

## che-cosa-serve-per-eseguire
Per eseguire un programma interpretato, che cosa deve esserci sul computer?
---
Il sorgente e un interprete di quel linguaggio.

## nome-sbagliato-python
Un programma in Python ha tre stampe, e nella terza `print` è scritto `prin`. Che cosa esce quando lo esegui?
---
Le prime due righe, e poi un messaggio di errore: l'interprete esegue un'istruzione alla volta e si ferma alla terza.

## nome-sbagliato-cpp
Un programma in C++ ha tre stampe, e nella terza `cout` è scritto `cot`. Che cosa esce quando lo esegui?
---
Solo il messaggio di errore: il compilatore legge tutto il sorgente prima di cominciare e non produce l'eseguibile.

## velocita
Di solito è più veloce un programma compilato o uno interpretato? Perché?
---
Quello compilato, perché la traduzione è già stata fatta; con l'interprete si traduce mentre si esegue.

## python-e-cpp
Quale dei due linguaggi delle lezioni è interpretato e quale è compilato?
---
Python è interpretato, C++ è compilato.

## ricompilare
Hai corretto il sorgente di un programma compilato, ma non hai compilato di nuovo. Quale versione parte?
---
Quella vecchia: l'eseguibile è la traduzione del sorgente di prima e non cambia da solo.

## cpu-e-sorgente
Vero o falso: la CPU può eseguire direttamente un file di Python.
---
Falso. La CPU esegue solo il suo linguaggio macchina: senza un interprete il file resta un testo.
