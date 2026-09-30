---
stato: decisa
aggiornato: 2026-09-29
tag: [decisione, laboratori, sito]
---
# Il prototipo del laboratorio va su master, fuori dall'indice e senza link

## Decisione
Il prototipo di `/laboratorio` (i cristalli di solfato di rame, in prima persona) va su master e quindi in produzione, ma resta fuori dall'indice di Google e non ha link da nessuna pagina del sito. Chi ha l'indirizzo lo apre; gli utenti non lo trovano da soli.

## Perché
Alessandro, 29 settembre 2026: vuole poterlo condividere per mostrarlo, senza che sia scopribile dagli utenti. Alternative scartate: su un branch con un'anteprima di Vercel, solo in locale.

## Conseguenze
- Da fare quando Alessandro lo chiede: spostare i file del laboratorio dal branch `fisica-primo-lotto` (dove non sono committati, accanto al lavoro di fisica) a un branch da master, e fare il merge. I file: `scripts/lab/build_lab.py`, `public/lab/laboratorio.glb`, `src/app/laboratorio/page.tsx`, `src/components/lab/`.
- La pagina ha già `robots: noindex, nofollow` e non compare nella sitemap; va ricontrollato dopo il deploy.
- `window.__lab`, che serve agli script di prova, esiste solo in sviluppo.
- Sul telefono la pagina deve dire che serve un computer ([[2026-09-29 I laboratori sono da computer, per i docenti alla LIM e gli studenti al pc]]).

## Collegamenti
- [[Laboratori]], [[2026-09-29 Laboratori]], [[SEO]]
