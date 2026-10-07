# inf-xml-json: dati strutturati, XML e JSON

Esercizi della lezione 81, "Dati strutturati: XML e JSON" (`docs/lezioni/informatica/riscritte/81-inf-xml-json.md`).
Tutti i livelli sono a scelta multipla su frammenti a larghezza fissa (`listing`): non c'è nessun programma da
eseguire. Le parole sono quelle della lezione: radice, figli, elemento, attributo, ben formato; oggetto, coppia,
array, valore. Il controllo legge i frammenti con i lettori di XML e di JSON di Python.

## Livelli

1. **Leggere l'albero di un XML.** Sotto la domanda un documento di al più 17 righe: una radice con un attributo
   (`classe` con `sezione`, `squadra` con `sport`, `playlist` con `genere`) e due o tre elementi, ciascuno con un
   nome e uno, due o tre numeri (in quantità diverse). Quattro casi, un quarto ciascuno: `radice` (qual è l'elemento
   radice), `attributo` (il valore dell'attributo), `quanti` (quanti elementi con un certo nome ci sono in tutto),
   `figli` (quanti figli ha la radice, oppure l'elemento che contiene un certo nome). Distrattori: il nome
   dell'attributo o di un altro elemento al posto della radice; il nome al posto del valore; i discendenti contati
   come figli; i soli numeri senza il nome; gli elementi di un solo ramo.
2. **XML ben formato.** Quattro frammenti, uno solo ben formato: una radice con un attributo e due o tre figli con
   un testo (`gita`, `spesa`, `orario`, un terzo ciascuno). Ogni frammento sbagliato rompe una regola sola, estratta
   tra sette: il tag di chiusura senza la barra, il nome con la maiuscola diversa in apertura e in chiusura, il
   valore dell'attributo senza virgolette, nessuna radice unica, un elemento mai chiuso, due elementi accavallati,
   un elemento chiuso con il nome di un altro. I passaggi dicono l'errore di ciascuno.
3. **Leggere un JSON.** Sotto la domanda un oggetto di quattro o cinque coppie: `nome`, l'array `voti` (3 o 4
   numeri) e due o tre tra `eta` (numero), `classe` (testo), `anno` (una cifra tra virgolette), `sport` (array di
   testi), `iscritto` (`true` o `false`), `casa` (un oggetto con `citta` e `piano`). Quattro casi, un quarto
   ciascuno: `valore` (quanto vale `dati["voti"][1]`, o `dati["casa"]["citta"]`, dopo `json.load`), `quanti`
   (quanti elementi ha l'array `voti`), `coppie` (quante coppie ha l'oggetto più esterno), `tipo` (di che tipo è il
   valore di una coppia: un testo, un numero, un array, un oggetto, vero o falso). Distrattori: l'elemento accanto
   (chi conta da 1), l'indice, la lunghezza; le coppie contate insieme agli elementi degli array; il numero al
   posto del testo per `"3"`.
4. **JSON valido.** Quattro frammenti, uno solo valido: un oggetto con un testo, un numero e un array (`studente`,
   `brano`, `gita`, un terzo ciascuno). Ogni frammento sbagliato ha un errore solo, estratto tra nove: la virgola
   dopo l'ultima coppia o dopo l'ultimo elemento dell'array, gli apici singoli, il nome senza virgolette, il testo
   senza virgolette, `=` al posto dei due punti, la virgola che manca tra due coppie, le parentesi tonde per
   l'array, la virgola decimale.
5. **Da un formato all'altro.** Un dato con due testi e una lista di tre numeri (`studente`, `playlist`,
   `squadra`), scritto in XML oppure in JSON (metà e metà); quale frammento dell'altro formato contiene gli stessi
   dati? I quattro frammenti sono tutti scritti senza errori, e la domanda lo dice. Distrattori: la lista senza
   l'ultimo elemento, con i primi due scambiati, con l'ultimo ripetuto; i due testi scambiati; in JSON la coppia
   ripetuta tre volte al posto dell'array (chi legge ne tiene una sola), in XML i numeri attaccati in un solo testo.

## Vincoli

- Quattro opzioni diverse. Nei livelli 2 e 4 il frammento giusto è l'unico che il lettore di Python accetta; nel
  livello 5 tutti e quattro sono accettati e solo il giusto contiene i dati mostrati.
- Frammenti di al più 34 caratteri per riga e 10 righe come opzioni, di al più 42 caratteri e 18 righe sotto la
  domanda.
- La risposta si legge dal frammento: niente domande su chi ha definito i formati o su quando.
- I casi di un livello escono nelle stesse quote.

## Da evitare

- Il numero tra virgolette contro il numero senza (`"16"` e `16`) come differenza tra due opzioni del livello 5:
  in XML non c'è modo di dirlo, e tutti e due sarebbero difendibili.
- Gli apici singoli negli attributi XML, che sono ammessi: non compaiono tra gli errori del livello 2.
- Frammenti JSON con un errore che il lettore di Python accetta (`NaN`, i nomi ripetuti): i nomi ripetuti
  compaiono solo nel livello 5, come frammento valido che dice un'altra cosa.

## Limiti

- Il livello 3 scrive il percorso con la notazione di Python (`dati["voti"][1]`), la sola che la lezione mostra.
- Non c'è un livello sulla scelta del formato (CSV, XML o JSON per una certa situazione): le risposte sarebbero
  opinioni.
