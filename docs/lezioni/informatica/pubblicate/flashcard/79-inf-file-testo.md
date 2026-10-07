# Flashcard: Leggere e scrivere un file di testo

## perche-file
Perché un programma scrive i dati in un file, se li ha già nelle variabili?
---
Perché le variabili stanno nella memoria centrale, che si svuota quando il programma finisce; un file resta sulla memoria di massa.

## file-di-testo
Che cos'è un file di testo?
---
Una sequenza di caratteri divisa in righe, ognuna chiusa da un a capo che non si vede.

## tre-mosse
In quale ordine si fanno le tre mosse con un file?
---
Aprire, leggere oppure scrivere, chiudere.

## lettura-ordine
Hai letto due righe di un file. Quale riga dà la prossima lettura?
---
La terza: il file si legge in ordine, e un segnaposto ricorda fin dove sei arrivato.

## fine-ciclo
Quando finisce il ciclo `for riga in file:` (in C++ `while (getline(file, riga))`)?
---
Quando le righe sono finite: il segnaposto è in fondo al file e non c'è più niente da leggere.

## strip
In Python, senza `.strip()`, `print(riga)` lascia una riga vuota tra una riga e l'altra. Perché?
---
Perché la riga letta porta con sé il suo a capo, e `print` ne aggiunge un altro.

## numeri-testo
Il file contiene la riga `10`. Che cosa ha letto il programma: un numero o un testo?
---
Un testo, fatto dei caratteri `1` e `0`. Diventa un numero con `int(riga)` in Python e `stoi(riga)` in C++.

## somma-senza-conversione
Le righe del file sono `8`, `10` e `6`. Che cosa si ottiene attaccandole con `+` senza convertirle?
---
Il testo `8106`, e non la somma 24.

## quanti-dati
Per sommare i numeri di un file serve sapere prima quanti sono?
---
No: il ciclo legge finché ci sono righe, e la sequenza finisce dove finisce il file.

## modo-scrittura
Apri in scrittura (`"w"`, `ofstream`) un file che contiene già dieci righe. Che cosa contiene subito dopo l'apertura?
---
Niente: aprire in scrittura svuota il file.

## scrittura-nuovo
Apri in scrittura un file che non esiste. È un errore?
---
No: il file viene creato, vuoto.

## write-a-capo
In Python, `file.write("7")` seguito da `file.write("14")` che cosa lascia nel file?
---
`714` su una riga sola: `write` non va a capo, serve `"\n"`.

## accodare
Come si apre un file per aggiungere righe in fondo senza perdere quelle che ci sono?
---
In accodamento: `open("f.txt", "a")` in Python, `ofstream file("f.txt", ios::app);` in C++.

## accodare-due-volte
Un programma accoda una riga a un file di tre righe. Lo esegui due volte: quante righe ha il file?
---
Cinque: la seconda esecuzione parte dal file come lo ha lasciato la prima.

## chiudere
Hai scritto in un file e vuoi rileggerlo nello stesso programma. Che cosa devi fare prima di riaprirlo?
---
Chiuderlo: solo allora quello che hai scritto è di sicuro nel file.

## with
In Python, chi chiude un file aperto con `with open(...) as file:`?
---
Lo chiude `with`, da solo, quando finisce il blocco rientrato.

## file-mancante-python
In Python, che cosa succede aprendo in lettura un file che non esiste?
---
Il programma si ferma con l'errore `FileNotFoundError`, a meno che l'apertura stia sotto `try` con un `except FileNotFoundError`.

## file-mancante-cpp
In C++, che cosa succede aprendo con `ifstream` un file che non esiste?
---
Nessun errore: il programma prosegue e non legge niente. Per accorgersene si chiede `if (!file)`.
