---
stato: decisa
aggiornato: 2026-09-29
tag: [decisione, laboratori, chimica, tecnica]
---
# Il laboratorio di chimica è un motore modulare su un catalogo ricavato dal programma

## Decisione
Il laboratorio di chimica non si scrive un esperimento alla volta. Oggetti, strumenti e sostanze hanno le loro azioni e proprietà, e regole chimiche e fisiche decidono cosa succede. Un esperimento è un inventario di partenza, uno o più obiettivi scritti come stato da raggiungere (per esempio "nella capsula ci sono almeno 3 g di cristalli di CuSO₄·5H₂O"), suggerimenti e una valutazione della procedura. Le regole di sicurezza valgono sempre, in ogni esperimento.

Il mondo chimico è chiuso: un catalogo curato di sostanze e di tipi di reazione, ricavato dagli esperimenti classici del programma delle superiori (acido-base, precipitazione, redox da tabella, gas, dissoluzione, riscaldamento e cambi di stato, indicatori, saggi alla fiamma). Dentro il catalogo lo studente fa quello che vuole; fuori, il laboratorio risponde onestamente che non succede niente di visibile.

## Perché
L'architettura modulare è la proposta di Alessandro, 29 settembre 2026: gli esperimenti scritti uno per uno non scalano, sono difficili da mantenere, frustrano lo studente che può fare solo le azioni previste e sembrano vecchi. Il catalogo chiuso è la raccomandazione di Claude, accettata: prevedere i prodotti di una reazione qualsiasi è un problema aperto anche nella ricerca, mentre in un mondo chiuso funziona, come mostra ChemCollective della Carnegie Mellon (reagenti in soluzione mescolati liberamente, con acido-base, termochimica, solubilità e redox calcolati; chemcollective.org/vlabs, consultato il 29 settembre 2026). Alternativa scartata: un motore chimico generale.

## Conseguenze
- Il prototipo va rifatto su questa base: oggi i passi sono scritti a mano in `src/components/lab/engine/experiment.ts`, anche se la simulazione sotto (calore, moli, dissoluzione, travasi) e le regole di sicurezza sono già generali.
- Serve l'elenco degli esperimenti classici del programma di chimica (quanti sono, 30-50, è una stima da verificare), da cui ricavare sostanze e reazioni.
- I dati del catalogo sono contenuto di riferimento: valgono i [[Principi]] sulla verifica da parte di una persona.
- Il secondo laboratorio non è deciso: si sceglie dopo aver visto come va la chimica.

## Collegamenti
- [[2026-09-29 Laboratori]]
- [[2026-09-29 I laboratori 3D partono subito, in parallelo ai lotti]]
