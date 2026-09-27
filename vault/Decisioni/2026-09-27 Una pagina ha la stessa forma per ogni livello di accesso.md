---
stato: decisa
aggiornato: 2026-09-27
tag: [decisione, prodotto, piani]
---
# Una pagina ha la stessa forma per ogni livello di accesso

## Decisione
Il layout di una pagina non cambia con il livello di accesso dell'utente (visitatore, Free, Studio). Quello che il piano non include si blocca nel punto in cui starebbe, con l'invito al piano al posto dei bottoni; il resto della pagina resta com'è, leggibile e navigabile.

## Perché
Alessandro, 27 settembre 2026, guardando la prova veloce da non registrato: la pagina era diversa (percorso sfocato dietro un riquadro al centro, selettore tra prova veloce e scheda spostato fuori dalla card). Casi diversi a seconda dell'accesso non li vuole: la forma della pagina è una, si bloccano le funzioni.

Scartata: il paywall a tutta pagina con un'anteprima sfocata dietro, com'era fino a oggi.

## Conseguenze
- Prova veloce (27 settembre 2026, non committato): senza accesso il percorso è lo stesso, con i livelli e il selettore nella card; nel pannello del livello, al posto di "Inizia il livello" o della prova di salto, c'è l'invito al piano (`Paywall` con la variante `embedded`). File: `…/esercizi/page.tsx`, `ExercisePath.tsx` (prop `locked`), `Paywall.tsx`.
- Seguono ancora il vecchio schema, da portare alla regola: le flashcard (`…/flashcards/page.tsx`, anteprima sfocata), l'assistente (`AISidebar.tsx`) e lo Zaino (`NotebookShelf.tsx`, `NoteList.tsx`). Da verificare caso per caso.
- Aggiunta ai [[Principi]].

## Collegamenti
- [[Principi]], [[Esercizi]], [[Piani e prezzi]]
