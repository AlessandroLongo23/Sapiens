---
stato: decisa
aggiornato: 2026-09-24
tag: [decisione, studenti, gamificazione]
---
# Adesivi nella beta, a partire dalle note

## Decisione
Gli [[Adesivi]] entrano nella [[Release Beta]]. Si parte da un MVP sulla pagina delle note dello [[Zaino]]: tutti gli adesivi sono disponibili a tutti, si attaccano ovunque sul foglio e si salvano nel database, nota per nota. Premi, album per materia e collezioni restano per dopo.

Sostituisce la parte sui tempi di [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]]; le regole su premi, vendita e scadenze di quella decisione restano valide.

## Perché
Scelta di Alessandro, 24 settembre 2026, dopo il prototipo del gesto. Il motivo non è stato discusso: da chiarire.

Alternativa scartata: costruire l'MVP dietro un interruttore spento in produzione, lasciando valida la decisione precedente.

## Conseguenze
- Serve il foglio a larghezza fissa: [[2026-09-24 Le note sono fogli a larghezza fissa]].
- Nuova tabella `note_stickers`, un record per nota con gli adesivi in JSON (posizione del centro sul foglio e rotazione).
- Il lavoro si aggiunge a quello della beta, già stretto dai contenuti (26 lezioni complete su 183 al 24 settembre 2026).

## Collegamenti
- [[Adesivi]], [[Zaino]], [[Release Beta]]
