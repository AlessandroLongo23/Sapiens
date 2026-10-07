# Note: La compressione dei dati, con e senza perdita

Lezione nuova (terzo anno, capitolo "Immagini, suoni e video digitali", gruppo 8, 7 ottobre 2026). `check.mts` passa
senza errori e senza avvisi su lezione, formulario e flashcard; `verifica.mts`: 2 esercizi, 0 errori.

## Confini

- Con la 11 e la 12: la lezione parte dai loro numeri (36 MB per 12 megapixel) e non rifà i conti.
- Con la 82: quali formati usano quale compressione sta là; qui i nomi JPEG, PNG e ZIP compaiono solo dove dicono
  quale idea usano.
- Con la 85: la compressione tra i fotogrammi di un video e il bitrate sono della 85. L'orecchio è nominato in due
  righe (il suono debole coperto da uno forte), senza i formati audio.
- Huffman: c'è l'idea dei codici di lunghezza diversa, con una tabella già fatta e il conto dei bit; l'algoritmo che
  costruisce i codici è solo nominato.

## Scelte

- Rapporto di compressione = dimensione originale diviso dimensione compressa, scritto anche $12 : 1$. Lo spazio
  risparmiato in percentuale è in un esempio.
- RLE con il numero prima del valore (`6B4N4R2B`). Modello per i byte: un byte per pixel, due byte per sequenza.
  Nel programma la codifica è un testo, e finché le sequenze sono più corte di 10 i caratteri sono quanti i byte del
  modello.
- Il nome inglese RLE resta, sciolto una volta; "sequenza" per run.
- L'argomento del perché nessuna compressione senza perdita accorcia tutto è in tre righe dentro un riquadro.
- Lo scioglilingua per il dizionario: 60 caratteri, 28 dopo la sostituzione, 17 la voce (contati con Python).
- La compressione con perdita è spiegata con le parole "variazioni lente" e "variazioni fitte" al posto di
  frequenze e trasformata; i blocchi di 8 per 8 e l'arrotondamento sono detti.
- La lezione è lunga 348 righe, più delle 200 del brief: 196 sono nei blocchi `codice` (il programma RLE e i due
  esercizi, nei due linguaggi); il testo da leggere è di circa 150 righe.

## Elementi interattivi

- `inf-rle-riga` (figura nuova): "quando RLE accorcia una riga di pixel, e quando la allunga?". Sedici pixel da
  dipingere con quattro colori, le sequenze sotto i pixel, i byte e il rapporto; tre esempi (bandiera, tinta unita,
  scacchiera). Guardata in chiaro e in scuro, a 800 e a 390 px, con i tre esempi e dipingendo da tastiera.
- Programma `codice` RLE in Python e C++: "che cosa succede comprimendo due volte?". Eseguito nei due linguaggi.
- `inf-compressione-perdita` (figura nuova): "quanto si può buttare prima che si veda?". È una compressione vera a
  blocchi di 8 per 8 (trasformata del coseno e tabella di quantizzazione di JPEG, scalata con la qualità), su
  un'immagine di 64 per 64 disegnata dalla figura; i tre colori sono trattati allo stesso modo e non c'è la codifica
  finale, e la lezione lo dice in un riquadro. Guardata in chiaro a 800 px a qualità 50 e 10, in scuro a 390 px a 95.
- Due esercizi in "Prova tu", con le soluzioni verificate nei due linguaggi.

## Da verificare

- "Togliendo la ridondanza una foto si dimezza, più o meno": ordine di grandezza per la compressione senza perdita
  di fotografie; dipende dalla foto.
- "Sul telefono la stessa foto ne occupa circa 3" MB: esempio, la 11 dice solo "molto meno".
- "Su questa idea si basano gli archivi ZIP e il formato PNG": l'algoritmo Deflate unisce un dizionario (LZ77) e i
  codici di Huffman (RFC 1951, 1996). Da verificare la data.
- Codice Morse: la E è un punto; "da quasi due secoli" (anni 1830-1840). Huffman: 1952. Non c'è la data nel testo.
- La tabella di quantizzazione nella figura è quella della norma JPEG (ITU-T T.81, allegato K), scritta a memoria e
  da confrontare con la norma; la scala con la qualità è quella della libreria di riferimento.
- I numeri della figura citati nel testo (un numero su otto a qualità 50, uno su venti a 10) sono quelli che la
  figura mostra: 1473 e 668 su 12288.

## Domande per Andrea

- Il rapporto di compressione come originale diviso compresso va bene, o i libri in uso lo definiscono al
  contrario?
- RLE con il numero prima (`6B`) o dopo (`B6`)?
- Dizionario e codici di lunghezza diversa: basta l'idea con un esempio, o si vuole Huffman per intero?
- La figura sulla perdita mostra una compressione a blocchi vera ma semplificata: va bene dirlo in un riquadro?

Prerequisiti proposti: inf-codifica-immagini, formati-multimediali, inf-stringhe

## Revisione del lotto (7 ottobre 2026)

- Aggiunto `return 0;` ai `main` in C++.
- Le formule in evidenza con i nomi scritti per esteso uscivano dalla colonna a 390 px e andavano scorse di lato: ora vanno a capo dopo l'uguale, nella lezione e nel formulario.
