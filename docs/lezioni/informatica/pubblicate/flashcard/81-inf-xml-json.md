# Flashcard: Dati strutturati: XML e JSON

## perche-non-csv
Perché una scheda con una lista di voti che si allunga non sta bene in un file CSV?
---
Perché in una tabella ogni riga ha gli stessi campi e ogni campo contiene un valore solo: una lista non ha un posto suo.

## albero-radice
In un dato ad albero, che cos'è la radice?
---
Il nodo da cui parte tutto: contiene tutti gli altri e non sta dentro nessuno.

## foglia
In un dato ad albero, che cos'è una foglia?
---
Un nodo senza figli: nei dati è un valore, come un nome o un numero.

## elemento
Di che cosa è fatto un elemento XML?
---
Di un tag di apertura, di un contenuto (un testo o altri elementi) e di un tag di chiusura con lo stesso nome preceduto dalla barra.

## attributo
In `<studente classe="3B">`, che cos'è `classe` e qual è il suo valore?
---
È un attributo dell'elemento `studente`; il suo valore è `3B`.

## radice-xml
Qual è l'elemento radice di `<gita><iscritto>Anna</iscritto></gita>`?
---
`gita`: è l'elemento che contiene tutti gli altri.

## figli-xml
In `<voti><voto>8</voto><voto>6</voto></voti>`, quanti figli ha l'elemento `voti`?
---
Due: i due elementi `voto`.

## maiuscole
`<Voto>8</voto>` è ben formato?
---
No: in XML le maiuscole contano, quindi `Voto` e `voto` sono due nomi diversi e il tag aperto non è chiuso.

## incrociati
`<voti><voto>8</voti></voto>` è ben formato?
---
No: i due elementi si accavallano. Si chiude per primo l'ultimo tag aperto.

## due-radici
`<nome>Anna</nome><nome>Luca</nome>`, da solo in un file, è un documento XML ben formato?
---
No: ha due elementi radice, e ce ne deve essere uno solo.

## xml-errore
Che cosa fa un programma che legge un file XML con un errore?
---
Si ferma al primo errore e non restituisce niente; un browser con una pagina HTML, invece, mostra quello che riesce.

## oggetto-array
In JSON, che cosa sta tra parentesi graffe e che cosa tra parentesi quadre?
---
Tra graffe un oggetto, cioè un elenco di coppie nome e valore; tra quadre un array, cioè una lista ordinata di valori.

## coppia
Come si scrive in JSON la coppia con nome `classe` e valore il testo 3B?
---
`"classe": "3B"`: nome e testo tra virgolette doppie, con i due punti in mezzo.

## numero-o-testo
In JSON, che differenza c'è tra `8` e `"8"`?
---
`8` è un numero, `"8"` è un testo: lo dicono le virgolette.

## virgola-finale
`[8, 6, 7,]` è JSON valido?
---
No: dopo l'ultimo elemento non ci va la virgola.

## apici
`{ 'nome': 'Anna' }` è JSON valido?
---
No: JSON vuole le virgolette doppie, per i nomi e per i testi.

## lista-nei-due
Come si scrive una lista di tre voti in XML e in JSON?
---
In XML con tre elementi dallo stesso nome, uno dopo l'altro; in JSON con un array di tre valori.

## json-load
Dopo `dati = json.load(file)` sul file `{ "voti": [8, 6, 7] }`, quanto vale `dati["voti"][1]`?
---
6: `dati["voti"]` è la lista dei voti, e gli indici partono da 0.

## nomi-ripetuti
Tra CSV, XML e JSON, quale scrive il nome di un campo una volta sola per tutto il file?
---
Il CSV, nell'intestazione. JSON lo scrive accanto a ogni valore, XML due volte per ogni elemento.

## quale-formato
I dati sono una tabella con le stesse colonne per ogni riga. Quale dei tre formati è il più leggero?
---
Il CSV: non ripete i nomi dei campi a ogni riga.
