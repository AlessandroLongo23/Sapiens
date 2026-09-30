---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, laboratori, grafica, account]
---
# Gli avatar sono un kit di forme semplici, opachi nel laboratorio e adesivi nel sito

## Decisione
Gli avatar delle persone sono fatti da un kit di pezzi semplici e arrotondati (testa, orecchie, naso, occhi, sopracciglia, bocca, capelli, copricapi, barbe, occhiali), nello stile cartoon dei riferimenti scelti da Alessandro (volti come quelli di Toy Faces). Un avatar è un record di scelte, uno per pezzo, con i colori. Nel laboratorio il kit è in 3D con una finitura opaca, da argilla, che sta nella luce pittorica; nel sito lo stesso record diventa un adesivo fustellato disegnato come gli [[Adesivi]], a inchiostro e colori piatti.

## Perché
Alessandro, 30 settembre 2026, non amava l'avatar di prima e ha proposto uno stile per i volti, la personalizzazione e un solo sistema per 2D e 3D. Claude ha fatto notare che il lucido di plastica dei riferimenti stona sia con il quaderno a quadretti del sito sia con il laboratorio pittorico: si tengono le forme, si cambia la finitura, e ogni mezzo ha il suo materiale. Le forme semplici costano poco (pochi triangoli, un solo disegno per testa) e si personalizzano bene: ogni opzione è un pezzo che si aggancia alla stessa testa. Un kit chiuso, senza foto né disegno libero, non ha niente da moderare, e serve per dei minorenni. Scartato: un avatar 2D convertito in 3D (un problema di ricerca) e il render lucido del busto come immagine del profilo.

## Conseguenze
- Il kit è `scripts/lab/avatar_kit.py` (`public/lab/avatar-kit.glb`); la pagina compone la testa da un record in `src/components/lab/engine/avatar-kit.ts`, in una sola mesh per testa.
- Da fare: le tre forme del viso (oggi c'è solo la tonda), l'adesivo 2D dallo stesso record, l'editor nell'account, la prova con qualche studente vero sulle proporzioni (i riferimenti sono infantili per 14-19 anni).
- La regola "niente facce" della guida degli adesivi (`stickers/STILE.md`) avrà un'eccezione per l'avatar, da decidere con Dario insieme alle [[Mascotte per materia]].
- Il kit non copia i personaggi di Toy Faces, libreria commerciale (da verificare la licenza): vedi [[2026-09-30 Il prototipo dei laboratori usa solo asset con licenza libera]].

## Collegamenti
- [[Laboratori]], [[Laboratorio condiviso]], [[Adesivi]], [[Account e impostazioni]]
- [[2026-09-30 I laboratori devono sembrare un videogioco, in uno stile pittorico e morbido]]
