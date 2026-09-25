---
stato: decisa
aggiornato: 2026-09-26
tag: [decisione, studenti, gamificazione, contenuti]
---
# Gli adesivi sono SVG scritti da Claude, senza aspettare Dario

## Decisione
Gli [[Adesivi]] li produce Claude, a lotti, come disegni vettoriali SVG nello stile degli 8 di oggi (simboli, formule, diagrammi, scritte, con i font e i colori del quaderno). Non si aspetta lo stile di Dario.

Come si organizza, proposta di Claude accettata:
- Ogni adesivo è un file `.svg` nella repo, con un indice che dice nome, pacchetto, materia, capitolo e dimensioni. Il catalogo resta nella repo, versionato; nel database resta solo quello che è dello studente (dove li ha attaccati, e più avanti quali possiede).
- Uno script controlla ogni file (dimensioni, niente script dentro l'SVG, testo convertito in tracciati, perché un SVG servito come immagine non vede i font del sito) e produce un foglio di prova con tutti gli adesivi, che Alessandro guarda.
- Prima dei lotti Claude scrive una guida di stile (palette, tratto, font, sagome) e genera ogni adesivo da quella: se lo stile cambia, si cambia la guida e si rigenera.

## Perché
Scelta di Alessandro, 26 settembre 2026. Il motivo per non aspettare Dario non è stato detto: da chiarire.

Gli SVG scritti a mano sono nitidi a ogni zoom, pesano pochi KB e sono coerenti con il quaderno; non funzionano per illustrazioni vere (ritratti, oggetti con volume). È lo stesso metodo della [[Pipeline esercizi]]: produce Claude, controlla una macchina, guarda un umano.

Alternative scartate:
- Stile fissato prima da Dario, poi produzione di Claude (era la proposta di Claude): dipende dal tempo di Dario.
- Immagini da un modello di immagini: illustrazioni più ricche, ma lo stile scivola e ogni immagine va ricontrollata. Resta possibile come eccezione per adesivi illustrati.
- Disegnati da Dario: massima qualità, tutto sul suo tempo.

## Conseguenze
- Rischio: se Dario ridisegna lo stile dopo, gli adesivi vanno rifatti; la guida di stile serve a rendere il rifacimento una rigenerazione.
- Supera il punto "stile e prima collezione con Dario" di [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]] e dell'[[Agenda]].
- Da cambiare nel codice: il catalogo esce da `src/lib/zaino/stickers.ts` e diventa file SVG con indice; la tavola degli adesivi (`src/lib/zaino/sticker-board.ts`) e le pagine statiche li mostrano come immagini.

## Collegamenti
- [[Adesivi]], [[Pipeline esercizi]], [[2026-09-24 Linguaggio visivo del quaderno a quadretti]]
