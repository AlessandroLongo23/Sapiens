---
stato: decisa
aggiornato: 2026-10-03
tag: [decisione, laboratori, sito]
---
# Il laboratorio ha il suo link nella navbar

## Decisione
`/laboratorio` ha un link "Laboratorio" nella barra di navigazione da computer, accanto a "Strumenti", visibile a tutti e senza il contrassegno di prototipo. Deciso da Alessandro il 3 ottobre 2026.

## Perché
Alessandro: senza link la rotta non si raggiunge dal sito, e oggi non ci sono utenti, quindi non serve tenerla nascosta né segnarla come prototipo.

Alternative discusse: il link con un contrassegno "prototipo" (proposto da Claude, scartato da Alessandro); il link solo in sviluppo o solo per il suo account.

## Conseguenze
- `src/components/shell/Header.tsx`: il link nella barra da computer. Nel codice locale, non committato.
- Il menu da telefono non ha il link: i laboratori sono da computer ([[2026-09-29 I laboratori sono da computer, per i docenti alla LIM e gli studenti al pc]]).
- La pagina resta `noindex, nofollow` e fuori dalla sitemap: Alessandro non si è espresso su Google.
- Tra 1024 e 1279 px la barra delle sezioni è già nascosta per fare posto al menu dei livelli, e il link sparisce con le altre voci.

Supera [[2026-09-29 Il prototipo del laboratorio va su master, fuori dall'indice e senza link]] per la parte "senza link".

Domande aperte:
- Togliere il `noindex` e mettere la pagina nella sitemap.
- Il link nel piè di pagina e nel menu da telefono.

## Collegamenti
- [[Laboratori]], [[SEO]]
