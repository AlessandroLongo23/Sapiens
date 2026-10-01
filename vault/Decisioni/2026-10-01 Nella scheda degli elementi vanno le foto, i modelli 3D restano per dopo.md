---
stato: decisa
aggiornato: 2026-10-01
tag: [decisione, strumenti, chimica]
---
# Nella scheda degli elementi vanno le foto, i modelli 3D restano per dopo

## Decisione
La scheda di un elemento nella tavola periodica mostra una foto dell'elemento. I modelli 3D che ruotano restano un progetto futuro.

## Perché
Alessandro, 1° ottobre 2026, dopo la valutazione di Claude: 118 modelli di qualità sono un progetto a sé, mentre le foto esistono già con licenza libera e dicono subito che cos'è l'elemento.

Alternativa scartata per ora: un modello 3D per elemento, o per una decina di elementi scelti insieme al catalogo dei laboratori. Resta in [[Foto e modelli 3D degli elementi]].

## Conseguenze
- Fatto lo stesso giorno: `scripts/tavola-periodica/foto.mjs` prende per ogni elemento l'immagine indicata da Wikidata (proprietà P18), un file di Wikimedia Commons, con autore e licenza dalla pagina del file. Le foto sono in `public/tavola-periodica/elementi/` (WebP, 480 px, 1,6 MB in tutto), i crediti in `src/lib/tools/elementi-foto.json`.
- 96 elementi hanno una foto. Dieci sono stati scartati a mano perché l'immagine non mostra l'elemento: polonio, astato, radon e francio (un pennello antistatico, fiale, un apparecchio, un'etichetta), mendelevio, nobelio, laurenzio, rutherfordio e dubnio (la casella di una tavola periodica), moscovio (un disegno). Gli altri dodici non hanno immagine su Wikidata.
- Sotto ogni foto c'è il credito con autore, licenza e link alla pagina del file. Le licenze sono CC BY e CC BY-SA in varie versioni, Free Art License (24 foto dello stesso autore, Alchemist-hp), GFDL e pubblico dominio (18). Le licenze "condividi allo stesso modo" valgono per la foto, non per la pagina. Controllo di un legale non fatto: è una domanda in più per le consulenze di [[Consulenze IDA]], insieme alle altre sul diritto d'autore.
- Per i gas la foto è un tubo a scarica o il gas liquefatto, non "il gas": il testo alternativo dice solo "un campione dell'elemento". Da rivedere con Andrea.

## Collegamenti
- [[Tavola periodica interattiva]], [[Foto e modelli 3D degli elementi]], [[2026-10-01 Tavola periodica]]
