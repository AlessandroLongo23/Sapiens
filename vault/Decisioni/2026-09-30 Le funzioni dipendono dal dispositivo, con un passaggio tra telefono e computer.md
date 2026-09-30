---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, design, prodotto]
---
# Le funzioni dipendono dal dispositivo, con un passaggio tra telefono e computer

## Decisione
Sapiens non offre le stesse funzioni su ogni dispositivo. Una funzione si mostra dove si usa bene, e si decide da quello che il dispositivo sa fare, non dalla larghezza dello schermo: con mouse e tastiera (puntatore preciso e hover) i [[Laboratori]] e l'editor avanzato; con fotocamera e telefono in mano le funzioni con la foto (digitalizzare il quaderno nello [[Zaino]], fotografare un esercizio per risolverlo). Dove una funzione non c'è, la pagina resta raggiungibile ma diventa un passaggio verso l'altro dispositivo: dal telefono "apri sul computer" (condividi, email, copia il link), dal computer "continua sul telefono" (codice QR).

## Perché
Alessandro, 30 settembre 2026, guardando il menu dei laboratori sul telefono: un'esperienza che non funziona su un dispositivo frustra più della sua assenza, e le funzioni di telefono e computer sono diverse, non versioni ridotte l'una dell'altra. Claude ha proposto di non togliere del tutto le pagine: i link arrivano sul telefono comunque (messaggi del docente, gruppi della classe, social), e una pagina vuota o un errore è la versione peggiore.

## Conseguenze
- Due varianti CSS in `src/app/globals.css`: `desk` (hover e puntatore preciso) e `handheld` (il resto).
- `/laboratorio` sul telefono mostra solo il passaggio al computer (`src/components/lab/menu/Handoff.tsx`); il menu vero è per `desk`.
- Da fare quando arriveranno: le funzioni con la foto su computer diventano "carica una foto" o un codice QR verso il telefono.
- La navigazione non mostra su un dispositivo le funzioni che lì non ci sono (oggi il menu del sito non ha ancora un collegamento ai laboratori).

## Collegamenti
- [[Laboratori]], [[2026-09-29 I laboratori sono da computer, per i docenti alla LIM e gli studenti al pc]]
