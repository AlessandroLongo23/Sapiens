---
stato: decisa
aggiornato: 2026-09-27
tag: [decisione, esercizi, seo]
---
# La scheda degli esercizi è giornaliera

## Decisione
Ogni lezione con esercizi ha una scheda nuova ogni giorno, al posto delle 20 schede numerate aperte da "Un'altra scheda". Il seed è la lezione più la data italiana (fuso di Roma, la scheda cambia a mezzanotte), quindi in un dato giorno la scheda è la stessa per tutti. `…/esercizi/scheda` è la scheda di oggi ed è l'unica indicizzata; i giorni passati restano raggiungibili a `…/esercizi/scheda?giorno=AAAA-MM-GG`, dal 1° settembre 2026 a ieri. Oggi, un giorno futuro o una data non valida riportano all'indirizzo semplice.

Supera in parte [[2026-09-26 Una scheda di esercizi gratuita e indicizzata per ogni lezione]]: restano la scheda gratuita e indicizzata, la pagina sua accanto al percorso e il risultato gratis sotto ogni esercizio; cambiano il seed e la fine di `?numero=n`.

## Perché
Alessandro, 27 settembre 2026: il bottone "Un'altra scheda" non gli piace; una scheda che si rinnova da sola ogni giorno, con il giorno come seed, dà esercizi nuovi senza chiederli e permette di tornare a quelli dei giorni passati. Ha chiesto di verificare come la valuterebbe la SEO.

La parte SEO è una proposta di Claude, da confermare:
- Una pagina indicizzata il cui contenuto cambia ogni giorno è un caso normale per Google, come la home di un giornale. Nello stesso giorno Googlebot e i visitatori vedono la stessa scheda, quindi non è cloaking. Il rischio è minimo: lo snippet in Google può riportare una scheda di un giorno diverso, ma cita titolo e descrizione, che non nominano la data e restano veri.
- L'archivio non si indicizza: sarebbero 73 pagine nuove al giorno, quasi uguali, cioè il caso che Google chiama "scaled content abuse" (regole anti spam di Google Search, 2024). I giorni passati sono `noindex, follow`, fuori dalla sitemap, e i link tra i giorni sono `nofollow` per non far camminare il crawler su una catena che cresce ogni giorno.
- Il limite al 1° settembre 2026 evita indirizzi validi per qualunque data.

Scartata: tenere "Un'altra scheda" con un numero limitato di schede (la soluzione del 26 settembre), che Alessandro non vuole.

## Conseguenze
- Nel codice il 27 settembre 2026, non committato né pubblicato: `src/lib/exercises/sheet-day.ts` (giorni), `src/lib/server/worksheet.ts` (seed dal giorno), la pagina `…/esercizi/scheda/page.tsx` (parametro `giorno`, redirect, `noindex` dell'archivio), `src/components/content/exercises/Worksheet.tsx` e `WorksheetControls.tsx` (la pagina rifatta, vedi [[Esercizi]]).
- Nella stessa sessione la scheda è stata rifatta: pagina larga, indice dei livelli, adesivi sul risultato, stampa e PDF. Dettagli in [[Esercizi]].
- Aggiornate [[Esercizi]] e [[SEO]].

## Collegamenti
- [[Esercizi]], [[SEO]], [[Flashcard]]
- [[2026-09-26 Una scheda di esercizi gratuita e indicizzata per ogni lezione]]
