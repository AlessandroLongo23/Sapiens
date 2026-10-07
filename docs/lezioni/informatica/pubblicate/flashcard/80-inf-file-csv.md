# Flashcard: File di dati in formato CSV

## csv-cos-e
Che cosa contiene un file CSV?
---
Una tabella scritta come testo: una riga del file per ogni riga della tabella, con i valori divisi da un separatore.

## campo
In un file CSV, che cos'è un campo?
---
Il valore di una cella: uno dei pezzi in cui il separatore divide la riga.

## intestazione
Che cosa contiene la riga di intestazione di un file CSV?
---
I nomi delle colonne. È la prima riga, e non è un dato.

## quanti-campi
Quanti campi ha la riga `Anna,3B,nuoto,12`, tagliata alle virgole?
---
Quattro: i campi sono uno in più delle virgole.

## campo-zero
La riga è `Anna,matematica,8`. Qual è il campo 1, contando da 0?
---
`matematica`: il campo 0 è `Anna`.

## righe-dati
Un file CSV ha 6 righe, la prima di intestazione. Quante righe di dati contiene?
---
Cinque.

## split
In Python, che cosa restituisce `"Luca,fisica,6".split(",")`?
---
La lista `["Luca", "fisica", "6"]`: tre testi.

## strip-prima
Perché in Python si scrive `riga.strip().split(",")` e non solo `riga.split(",")`?
---
Perché senza `strip()` l'a capo in fondo alla riga resta attaccato all'ultimo campo.

## getline-separatore
In C++, che cosa fa `getline(file, nome, ',')`?
---
Legge i caratteri fino alla prossima virgola, li mette in `nome` e scarta la virgola.

## campo-testo
Dopo il taglio, il campo del voto è `8`. Si può sommare così com'è?
---
No: è un testo. Va convertito con `int(campi[2])` in Python o `stoi(voto)` in C++.

## intestazione-non-saltata
Un programma somma la colonna dei voti senza saltare l'intestazione. Che cosa succede?
---
Si ferma alla prima riga, quando prova a convertire in numero il testo `voto`.

## intestazione-contata
Un programma conta le righe di un file CSV con 4 righe di dati, senza saltare l'intestazione. Che cosa scrive?
---
5: ha contato anche l'intestazione.

## separatore-sbagliato
Il file usa il punto e virgola e il programma taglia alle virgole. Quanti campi ha la riga `Anna;fisica;8`?
---
Uno solo, con dentro tutta la riga: non c'è nessuna virgola a cui tagliare.

## virgola-decimale
Quanti campi ha la riga `Sara,storia,7,5`, tagliata alle virgole?
---
Quattro: la virgola di 7,5 viene presa per un separatore.

## filtrare
Come fa un programma a sommare solo i voti di Anna, se il nome è il campo 0?
---
Con una selezione sul campo 0: somma solo quando `campi[0] == "Anna"` (in C++ `nome == "Anna"`).

## scrivere-riga
Quali due cose non devi dimenticare scrivendo una riga di un file CSV?
---
Il separatore tra un campo e l'altro e l'a capo in fondo alla riga.

## senza-a-capo
Un programma scrive tre righe di un file CSV senza l'a capo. Com'è il file?
---
Tutti i campi sono su una riga sola, e non si capisce più dove finisce un voto e comincia il successivo.

## csv-foglio
Salvi una tabella del foglio di calcolo in formato CSV. Che cosa resta nel file delle formule e dei colori?
---
Niente: nel file ci sono solo i valori che si vedono nelle celle.
