# Note: Dati strutturati: XML e JSON

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "I file", gruppo 7). Non pubblicata.

Prerequisiti proposti: inf-file-csv, inf-file-system, http-html, inf-vettori

## Struttura

Apertura con la scheda di una studentessa, che ha una lista di voti e non sta in una tabella; i dati ad albero
(nodo, radice, figli, foglia) con una figura TikZ; XML (elemento, attributo, le quattro regole del ben formato, la
severità di chi legge); JSON (oggetto, coppia, array, valori); lo stesso dato come albero, XML e JSON (figura
interattiva e tabella delle corrispondenze); un programma in Python che legge un file JSON; il confronto tra CSV,
XML e JSON con il conto dei caratteri; due esercizi.

- 200 righe, il limite delle lezioni di concetto.
- Programmi da eseguire: 1, solo in Python (`json.load`), con `studente.json` accanto. La lezione dice perché è
  solo in Python.
- Esercizi: 2, tutti e due progetti in cui lo studente corregge o completa il file di dati e il programma è già
  scritto: `gita.xml` con tre errori di forma, `playlist.json` da completare traducendo un dato scritto in XML.
- Figure TikZ: 1 (`albero-dato-studente`). Figure interattive: 1 (`inf-albero-xml-json`).
- Riquadri `ad-warning`: 2.

## Confini con le altre lezioni

- La 80 ha le tabelle; qui si parte da quello che una tabella non sa dire.
- La 87 (linguaggi di markup) riprende tag, elementi e attributi dal lato dei documenti. Qui HTML è nominato una
  volta, con il link alla lezione 36, per dire che i tag non sono una novità e che in XML i nomi si scelgono.
- Dizionari di Python, classi e oggetti (quarto anno) non sono spiegati: il dizionario è detto in una riga, come
  "un contenitore in cui un valore si prende con il suo nome".

## Scelte

- Lo stesso dato (studente, nome, classe, voti) attraversa tutta la lezione: testo, figura TikZ, blocchi XML e
  JSON, figura interattiva, programma.
- Le regole del ben formato sono quattro: una radice, ogni tag chiuso con lo stesso nome, chiusura in ordine
  inverso, attributi tra virgolette. L'elemento vuoto (`<a/>`), la dichiarazione `<?xml ... ?>`, le entità (`&lt;`),
  i commenti, gli spazi dei nomi, la validità rispetto a uno schema (DTD, XSD) non ci sono.
- In XML la lista è un elemento `voti` che contiene gli elementi `voto`; l'attributo compare una volta nel testo
  (`classe="3B"`) e negli esercizi (`meta`, `titolo`, `durata`).
- In JSON: oggetto, array, testo, numero, `true`, `false`, `null`. I numeri con l'esponente e le sequenze con la
  barra rovesciata nei testi non ci sono.
- Gli esercizi si correggono sul file di dati: il programma è dato, e lo studente tocca solo `gita.xml` e
  `playlist.json`. Il primo usa `xml.etree.ElementTree`, che la lezione non spiega: serve a dire riga e colonna
  dell'errore. È il modo che ho trovato per far scrivere XML e JSON allo studente con una correzione automatica.
- Il conto dei caratteri (13, 44, 112) è fatto sulle tre scritture senza spazi e senza a capo.
- "Dove lo incontri": esempi generici (fogli di calcolo, documenti, immagini vettoriali, fatture elettroniche,
  dati tra un'app e il suo server, file di impostazioni), senza prodotti e senza date.

## Verifiche

- `check.mts`: nessun errore. Un avviso nella lezione: 13 grassetti. Sono tutti termini nel punto in cui sono
  definiti (albero, nodo, radice, figli, foglia, dati strutturati, XML, elemento, attributo, ben formato, JSON,
  oggetto, array).
- `verifica.mts`: 2 esercizi, 0 errori. Il file di partenza di ciascuno non supera la prova (`gita.xml` si ferma
  con "not well-formed (invalid token): line 1, column 11", `playlist.json` con `KeyError: 'brani'`), quello
  della soluzione sì.
- Il programma di esempio eseguito con il Pyodide del sito e nel browser a 1280 e a 390 px.
- I tre numeri di caratteri ricontati con Python.
- Le figure guardate in chiaro e in scuro, a 800 e a 390 px.

## Elementi interattivi

- `inf-albero-xml-json` (figura da toccare): "che cosa corrisponde, in XML e in JSON, a ogni nodo dell'albero?".
  Albero, XML e JSON dello stesso dato; toccando un nodo o un pezzo di testo si accende la parte corrispondente nei
  tre, con quello che contiene, e una frase dice come la scrivono i due formati. Ogni nodo è un bottone, quindi si
  usa anche da tastiera; i pezzi dei due testi rispondono solo al puntatore.
- Programma Python con `studente.json`: lo studente aggiunge un voto nel file, poi toglie una virgola e legge
  l'errore con riga e colonna.
- I due esercizi, in cui si scrive nel file di dati.

## Da verificare

- XML: raccomandazione del W3C, "Extensible Markup Language (XML) 1.0", prima edizione del 10 febbraio 1998. Le
  regole del ben formato e l'obbligo di fermarsi a un errore di forma vengono da lì (sezioni 2.1 e 1.2). Nomi e
  date non sono nella lezione.
- JSON: descritto da Douglas Crockford nei primi anni 2000; ECMA-404 (ottobre 2013) e RFC 8259 (dicembre 2017).
  Nella lezione c'è solo il nome sciolto, JavaScript Object Notation.
- In XML il valore di un attributo può stare anche tra apici singoli: la lezione dice "tra virgolette" senza
  precisare, e gli esercizi non contano gli apici singoli come errore.
- "Fatture elettroniche": la fattura elettronica italiana è un file XML (formato FatturaPA dell'Agenzia delle
  Entrate). Da controllare se si vuole tenere l'esempio.
- "In C++ servirebbe una libreria da installare a parte": la libreria standard del C++ non legge JSON né XML;
  vero al 7 ottobre 2026.

## Domande per Andrea

- La lezione mostra un solo programma, in Python con `json`. Va bene, o in classe leggi anche XML con un
  programma?
- Il dizionario di Python è detto in una riga, senza una lezione sua: basta, o va tolto il programma e lasciato
  solo il formato?
- Per XML bastano le regole del ben formato, o vuoi che si nomini anche lo schema che dice quali elementi sono
  ammessi?
- Gli esercizi fanno correggere un file XML e completare un file JSON con un programma già scritto che lo studente
  non legge fino in fondo: ti sembra adatto?
- Tra gli usi di XML metteresti un esempio italiano preciso (la fattura elettronica), o resti sul generico?
