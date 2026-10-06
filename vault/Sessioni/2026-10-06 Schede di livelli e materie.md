---
aggiornato: 2026-10-06
tag: [sessione, design, lezioni, università]
---
# Schede di livelli e materie

Sessione del 6 ottobre 2026. Alessandro non era più contento delle copertine a libro di testo delle materie e ha chiesto di rifarle. Dopo cinque versioni bocciate o corrette, le schede hanno oggetti in tre dimensioni che si muovono, i livelli usano la stessa scheda e l'università ha i filtri per area. Il dettaglio di ogni passata è in [[2026-09-24 Linguaggio visivo del quaderno a quadretti]].

## Cosa è cambiato
- Le materie e i livelli sono schede con un oggetto reso in Blender (`scripts/materie/icons.py`, `scripts/materie/export.py`, file in `public/materie/`): 18 materie e 3 livelli, ciascuno con un'immagine ferma e un filmato che gira al passaggio del mouse.
- Una sola scheda (`ObjectCard` in `LibraryCovers.tsx`) con tre disposizioni; i livelli in colonna, le materie affiancate quando sono due o quattro.
- L'università dice corsi e filtra per area (`CourseAreas.tsx`).
- Eliminati `CoverFigures.tsx`, `LevelSheet.tsx`, `SheetCycle.tsx`. Resta nel CSS il blocco `level-sheet`, da togliere.
- Ricerca sui corsi da aggiungere: [[Corsi universitari da aggiungere]].

## Cosa ha bocciato Alessandro, e perché
- La fascia colorata con la figura a tratto, in ogni variante: "stai iterando su un design sbagliato".
- I fogli che uscivano a ventaglio da dietro la scheda: una copia di Brilliant, che Alessandro aveva mostrato come livello di qualità e non come stile.
- La figura a tratto che seguiva il puntatore, e poi l'oggetto che seguiva il puntatore.

## Rimasto da fare
- Provare i filmati su Safari (HEVC con alfa) e su Firefox.
- Commit e pubblicazione, quando Alessandro dà il via: i file di `public/materie/` pesano circa 12 MB.
- Togliere la pagina di prova `/prova-schede` quando non serve più, e il CSS di `level-sheet`.
- La riga degli argomenti per i sei corsi di intelligenza artificiale.
- Decidere con Dario se questi oggetti diventano il linguaggio delle illustrazioni del sito.
- Decidere quali corsi universitari aggiungere, le aree nuove e i loro colori.
