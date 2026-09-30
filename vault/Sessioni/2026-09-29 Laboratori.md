---
aggiornato: 2026-09-29
tag: [sessione, laboratori]
---
# Laboratori

## Di cosa si è parlato
Dopo il prototipo di `/laboratorio` (i cristalli di solfato di rame in un laboratorio 3D modellato in Blender e animato con three.js, poi con i controlli in prima persona), Alessandro ha proposto i [[Laboratori]]: ambienti 3D in prima persona per chimica, fisica, ottica ed elettronica, costruiti in modo modulare. Oggetti, strumenti e sostanze hanno azioni e proprietà, le regole vere decidono cosa succede, e un esperimento è solo passi e obiettivi.

Claude era d'accordo sull'architettura e ha messo in dubbio tre cose. "Tutto è possibile" funziona solo in un mondo chiuso: per la chimica un catalogo curato, come fa ChemCollective della Carnegie Mellon, mentre per l'elettronica (leggi di Kirchhoff) il modello è davvero completo. Poi i tempi, con la beta di sola matematica a gennaio 2027 e un solo sviluppatore. Infine il computer contro il telefono, e il contrasto con [[2026-09-03 Mobile-first, poi PWA, poi Capacitor]].

## Decisioni
- [[2026-09-29 I laboratori 3D partono subito, in parallelo ai lotti]] (Claude consigliava dopo la beta), senza limite di tempo.
- [[2026-09-29 I laboratori sono da computer, per i docenti alla LIM e gli studenti al pc]]
- [[2026-09-29 Il laboratorio di chimica è un motore modulare su un catalogo ricavato dal programma]]
- [[2026-09-29 Il primo traguardo dei laboratori è il motore, in un laboratorio libero senza esperimenti]] (Claude proponeva tre esperimenti sullo stesso motore).
- [[2026-09-29 Il prototipo del laboratorio va su master, fuori dall'indice e senza link]]

## Seconda idea: il laboratorio condiviso
Alessandro ha proposto una stanza condivisa fino a 32 persone, docente compreso, con gruppi, avatar che si urtano o fantasmi e permessi tra i banchi dei gruppi ([[Laboratorio condiviso]]). Claude: è la versione che le scuole comprerebbero, ma è un secondo prodotto sopra un motore che non c'è ancora; il rischio più grande sono i minori in uno spazio condiviso (chat, voce, dati), più della tecnica. Decisioni:
- [[2026-09-29 Il motore dei laboratori è stato serializzabile cambiato solo da azioni]]
- [[2026-09-29 Il laboratorio condiviso si costruisce insieme al motore]] (Claude consigliava dopo il motore).
- [[2026-09-29 Nel laboratorio condiviso niente chat, solo segnali]]

## Infrastruttura e mani
Alessandro ha chiesto di confrontare i limiti di Supabase e Cloudflare, preferendo Supabase se la differenza era piccola: non lo è, vedi [[2026-09-29 Il laboratorio condiviso usa Cloudflare Durable Objects, non Supabase Realtime]]. Poi il corpo con due mani, per tenere due cose e usarle insieme (la bacchetta nella destra, il becher nella sinistra, e mescolare): fatto nel prototipo, vedi "Stato del prototipo" in [[Laboratori]].

## Informazioni nuove
- ChemCollective Virtual Lab (Carnegie Mellon, David Yaron): gratuito, HTML5, centinaia di reagenti in soluzione mescolati liberamente, con acido-base, termochimica, solubilità e redox calcolati. Fonte: chemcollective.org/vlabs, 29 settembre 2026.
- Labster (Copenaghen): oltre 300 simulazioni di laboratorio per scuole e università, scritte una per una; prezzi non pubblici. Fonte: labster.com/simulations, 29 settembre 2026.
- La sitemap del sito elenca le pagine una per una (`src/lib/server/sitemap.ts`): `/laboratorio` non c'è.

## Domande aperte
- Infrastruttura della stanza condivisa (Durable Objects o Supabase Realtime), chi crea le stanze, come si entra, l'elenco dei segnali.
- Il secondo laboratorio.
- L'elenco degli esperimenti di chimica del programma.
- Laboratori nel piano a pagamento o nell'offerta alle scuole.
- La pagina sul telefono.

## Prossimo argomento
Resta il primo dell'[[Agenda]]: legale e fiscale prima del marketing. Sul codice, il passo pronto è spostare il prototipo su un branch da master e pubblicarlo, quando Alessandro lo chiede.
