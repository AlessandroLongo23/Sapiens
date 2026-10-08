---
stato: decisa
aggiornato: 2026-10-07
tag: [decisione, laboratori, fisica]
---
# Il laboratorio di fisica è una copertina sola con tre stanze

## Decisione
Nel menu dei laboratori la fisica è una copertina sola, "Fisica", con dentro tre stanze: Meccanica, Camera oscura (ottica, onde e acustica) ed Elettromagnetismo. Ogni stanza si carica da sola, con un caricamento nel passaggio dall'una all'altra, e si apre libera (tutti gli apparati, quaderno bianco) o con una scheda. L'elettronica resta un laboratorio a parte.

La camera oscura ha un interruttore della luce con cui si interagisce: montaggio e passi preparatori alla luce, esperimento al buio. La stanza di meccanica è libera: gli apparati, anche grandi, stanno nelle varie parti della stanza.

## Perché
Alessandro, 7 ottobre 2026: più stanze sono meglio di una, perché con un caricamento tra l'una e l'altra non si carica mai più del necessario; e l'ottica chiede una stanza che si possa oscurare.

Alessandro ha poi chiesto se convenisse fare laboratori separati ("Ottica", "Acustica", "Elettromagnetismo"), alcuni liberi e altri guidati. Scartato, su proposta di Claude: una stanza e un laboratorio sono la stessa cosa dal punto di vista tecnico, e la differenza è solo nel menu. Lì si arriva per materia, come nell'albero delle lezioni; Chimica è una copertina sola, e sette copertine di peso diverso allungano il primo passo; l'acustica da sola ha quattro o cinque schede e non regge una stanza. "Libero" e "guidato" sono proprietà della sessione, non del laboratorio.

Scartata anche l'aula unica con il kit sul banco, proposta da Claude all'inizio: rotaia e banco ottico chiedono 1,5-2 m contro gli 1,3 m di una postazione, e il buio avrebbe chiesto una seconda lightmap in un'aula con il sole.

La regola per le stanze: una stanza esiste quando ha un'esigenza fisica che le altre non hanno. Meccanica lo spazio, camera oscura il buio, elettromagnetismo la corrente ai banchi.

## Conseguenze
- La camera oscura non ha finestre: basta una lightmap delle plafoniere moltiplicata per un'intensità che l'interruttore porta a zero, con laser e lampade come luci dal vivo. Da verificare nel codice quando si costruisce.
- Tra le stanze una porta con una dissolvenza, senza corridoio; l'esperimento scelto nel menu decide la stanza in cui si entra. Proposta di Claude, non discussa nel dettaglio.
- Si costruisce una stanza alla volta: vedi [[2026-10-07 Il laboratorio di fisica parte dalla meccanica del biennio, per ora solo sul piano]].
- Risolve la domanda aperta di [[Laboratori]] sul secondo laboratorio dopo la chimica.
- Nel menu (`src/lib/lab/catalog.ts`) Fisica ed Elettronica hanno già il timbro "Presto": resta così.

## Collegamenti
- [[Laboratorio di fisica]], [[Laboratori]]
- [[2026-10-07 Termologia e fluidi usano il guscio dell'aula di chimica]], [[2026-10-07 In fisica si misura una legge, in elettronica si costruisce un circuito]]
- Sessione: [[2026-10-07 Laboratorio di fisica, scopo e stanze]]
