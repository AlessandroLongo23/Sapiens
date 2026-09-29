---
stato: decisa
aggiornato: 2026-09-29
tag: [decisione, contenuti, fisica, tecnica]
---
# Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit

## Decisione
Per la fisica non si aggiunge nessun pacchetto nuovo. Le figure statiche delle lezioni sono in TikZ, come per la matematica. Le figure interattive usano il kit delle lezioni (`src/components/content/interactive/kit.tsx`), che si allarga con un modulo di fisica. Non si usa un motore fisico. Negli esercizi la figura è una scena descritta nei dati dell'esercizio e disegnata dagli stessi componenti del kit, senza interazione. I grafici delle lezioni di fisica per ora sono statici, in TikZ come quelli delle lezioni di matematica, e diventano interattivi quando ci sarà il piano cartesiano del kit.

## Perché
Alessandro, il 29 settembre 2026, prima del primo lotto di fisica: la fisica ha bisogno di più figure della matematica, e soprattutto di figure interattive (vettori, piano inclinato, moti, forze, campi), e gli esercizi hanno quasi sempre un sistema disegnato. Ha chiesto se TikZ basta o se serve un altro pacchetto.

Claude ha verificato che il motore con cui compiliamo le figure (node-tikzjax, in `scripts/figure/`) contiene già `circuitikz`, `pgfplots`, `arrows.meta`, `decorations.markings` e `patterns`: circuiti, grafici, molle, linee di campo e vincoli tratteggiati si fanno senza cambiare strumento, e le figure restano SVG indicizzabili. Correzione dello stesso giorno, provando: i riempimenti `pattern=` non arrivano nell'SVG, quindi il tratteggio di suolo e pareti si disegna con trattini obliqui, in TikZ e nel kit (`docs/lezioni/fisica/README.md`).

Contro un motore fisico (Matter.js, Planck.js), lo stesso argomento della figura del trapezio del 28 settembre ([[2026-09-28 Figure interattive nelle lezioni]]), con un motivo in più: la simulazione deve dare esattamente i numeri scritti nella lezione. Questi motori usano unità proprie, correggono le posizioni a ogni passo e approssimano urti e attrito. I modelli della scuola hanno quasi sempre una soluzione in forma chiusa. Dove non ce l'hanno (pendolo ad ampiezza grande, smorzamento, orbite, linee di campo) basta un integratore scritto a mano. Per il 3D (campo magnetico, forza di Lorentz) c'è già `three`, usato per le molecole.

Per gli esercizi Alessandro ha scelto la scena disegnata dal kit, su proposta di Claude. Alternative scartate: un TikZ precompilato per ogni esercizio, come le molecole della chimica, perché node-tikzjax usa un solo motore TeX alla volta, il bucket si riempie e cambiare una figura vuol dire rigenerare tutto; una figura fissa per livello, perché non corrisponderebbe ai numeri dell'esercizio. Con la scena, la lezione e l'esercizio hanno lo stesso disegno e il correttore può controllare i dati della scena come controlla i numeri.

Sui grafici la proposta è di Alessandro: il piano cartesiano interattivo deve avere la stessa identità visiva del TikZ, altrimenti le figure in cui compaiono tutti e due non sono coerenti. Per questo i grafici si fanno ora statici e si sostituiscono quando esisterà il componente. Alternative scartate: tenere fuori dal primo lotto il capitolo sui grafici, oppure costruire prima il piano cartesiano, rimandando la fisica.

Sulla quantità di figure non c'è una regola: si decide lezione per lezione (Alessandro). Claude aveva proposto una figura statica in ogni lezione e una interattiva quando la lezione spiega come una grandezza cambia al variare di un'altra.

## Conseguenze
- Il primo lotto di fisica costruisce il modulo di fisica del kit, perché il capitolo "I vettori e le forze" usa proprio quei pezzi: vettori con le componenti, forze applicate a un punto, blocchi, superfici tratteggiate, molle, carrucole, fili. Cariche e linee di campo arriveranno con l'elettrostatica.
- Gli esercizi hanno bisogno di un campo nuovo in `src/lib/exercises/v2/types.ts`, accanto a `FigureRef`: una scena con un tipo e i suoi dati, disegnata dalla pagina degli esercizi. Serve anche alla matematica: le specifiche del quinto e dell'ottavo lotto indicano già i livelli che vorrebbero una figura (vedi [[Pipeline esercizi]]).
- Ogni grafico che dovrà diventare interattivo ha nel sorgente la riga `% poi-interattivo:` con quello che si potrà fare, così si ritrova. I grafici non usano pgfplots, che pure c'è, perché le lezioni di matematica disegnano i grafici con gli assi e `plot` di TikZ: così hanno lo stesso aspetto (Claude, 29 settembre 2026, scrivendo le convenzioni). Quando arriva il componente, l'SVG statico resta nella cornice della figura per Google e per chi non ha JavaScript, e il componente si monta sopra. Oggi un blocco `interattivo` viene pubblicato come una cornice vuota (`src/lib/utils/interactive.ts`), quindi questo va cambiato.
- Serve una convenzione di colori per grandezza (forze, velocità, accelerazione, campi), uguale nel TikZ e nel kit: domanda in [[Domande per Andrea]].
- Aggiornate [[Grafici e simulazioni interattive]], [[Pipeline lezioni]], [[Pipeline esercizi]], [[Agenda]] e `Home.md`.

## Collegamenti
- [[2026-09-28 Figure interattive nelle lezioni]]
- [[2026-09-24 Linguaggio visivo del quaderno a quadretti]]
- [[2026-09-29 La fisica si pubblica gratis accanto alla beta]]
- [[2026-09-29 Figure di fisica]]
