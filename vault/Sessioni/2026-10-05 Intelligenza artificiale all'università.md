---
aggiornato: 2026-10-05
tag: [sessione, contenuti, intelligenza-artificiale, università]
---
# Intelligenza artificiale all'università

5 ottobre 2026. Alessandro ha trovato il corso "AI Engineering from Scratch" di Rohit Ghumare e ha chiesto che cosa copre. Da lì la sessione è arrivata a un programma universitario di intelligenza artificiale, al suo confronto con tredici atenei e alla prima lezione.

## Che cosa si è deciso
- [[2026-10-05 Il corso di intelligenza artificiale ha quattro blocchi ordinati da un grafo dei prerequisiti]]: IA classica, machine learning classico, deep learning, modelli linguistici e agenti; l'ordine lo dà il grafo, gli assi sono etichette.
- [[2026-10-05 Ogni blocco dell'intelligenza artificiale è un corso a sé]]: i prerequisiti matematici sono corsi indipendenti; l'area è un obiettivo di lungo periodo, da compilare in parallelo.
- [[2026-10-05 I corsi universitari non hanno una misura fissa]].
- [[2026-10-05 Le lezioni universitarie di intelligenza artificiale le rilegge Alessandro]].
- [[2026-10-05 Il primo capitolo di intelligenza artificiale sono le reti neurali]].

## Che cosa si è fatto
- [[Programma di intelligenza artificiale]]: 57 capitoli in sei blocchi, ciascuno con i suoi prerequisiti, e il sottoinsieme per la quinta (11 lezioni già nell'albero di informatica, 13 argomenti trattabili in più).
- [[Confronto del programma di intelligenza artificiale con i syllabus universitari]]: tredici atenei, le correzioni applicate e nove proposte di struttura. I rapporti completi sono in `docs/lezioni/universita/intelligenza-artificiale/syllabus/`.
- La prima lezione, "Il percettrone": `docs/lezioni/universita/intelligenza-artificiale/riscritte/01-dl-percettrone.md`, con cinque figure TikZ, tre figure interattive (`src/components/content/interactive/ia/`, registrate in `src/lib/utils/interactive.ts`), un esercizio di codice e le note di revisione in `note/01-dl-percettrone.md`. I numeri del testo sono calcolati dallo stesso file che muove le figure, e le figure sono state provate nel browser. Su richiesta di Alessandro la figura della regola di apprendimento è un addestramento vero: pesi iniziali casuali, esempi in ordine casuale, avvio, arresto e nuovi pesi, con la retta disegnata dai pesi del momento.
- `rete.tsx`: il primo pezzo del componente che disegna una rete neurale, con il peso letto dallo spessore e dal grigio della linea. Per ora con pesi fissi.

## 6 ottobre 2026: corsi e lezione online
Su richiesta di Alessandro i sei corsi sono nella pagina dell'università del sito, sotto il livello `university` di `content_nodes`: Intelligenza artificiale classica (9 capitoli, 59 lezioni), Machine learning (11, 63), Deep learning (13, 88), Modelli linguistici (7, 34), Agenti e sistemi multi-agente (3, 16), IA responsabile e in produzione (7, 26). In tutto 50 capitoli e 286 lezioni, vuote tranne una. Gli alberi sono in `docs/lezioni/universita/intelligenza-artificiale/alberi/`, applicati con `scripts/lezioni/tree.mts`. I capitoli sono quelli del programma; i titoli delle lezioni sono una prima divisione degli argomenti, scritta da Claude e non discussa. Il capitolo dei prerequisiti (blocco 0) e quello dei progetti (5.8) non sono nel sito.

La lezione "Il percettrone" è pubblicata nel corso di Deep learning, capitolo "Dal neurone alla rete", a `/materiale/universita/deep-learning/dal-neurone-alla-rete/il-percettrone`, con le cinque figure TikZ e l'esercizio di codice. Le tre figure interattive in produzione non compaiono: il loro codice non è committato né pubblicato, e al loro posto la pagina ha uno spazio vuoto. La pagina è indicizzabile. La lezione è andata online prima della rilettura di Alessandro e con le fonti storiche non ancora lette alla fonte.

## Che cosa resta
- Commit e deploy del codice delle figure interattive (`src/components/content/interactive/ia/` e tre righe in `src/lib/utils/interactive.ts`): finché non c'è, la lezione online ha tre figure mancanti.
- I sei corsi non hanno la nota di studio in fondo alla pagina (`src/lib/content/subject-copy.ts`), né un ordine tra loro nella pagina dell'università diverso da quello di inserimento.
- Alessandro non ha ancora riletto la lezione. In sviluppo si guarda anche a `/prova-grafico/lezione?file=universita/intelligenza-artificiale/riscritte/01-dl-percettrone.md`.
- Le fonti storiche vengono da fonti secondarie: gli articoli originali (Rosenblatt 1958, Minsky e Papert, Novikoff 1962) vanno letti prima di pubblicare. L'elenco è nelle note della lezione.
- Da decidere: le nove proposte di struttura del confronto; dove stanno i corsi universitari nell'albero del sito; se una lezione va online prima della rilettura; convenzioni e notazioni del corso (elenco nelle note della lezione).
- Le prossime lezioni del capitolo: reti a più strati e funzioni di attivazione, poi la retropropagazione. Il componente della rete dovrà seguire un addestramento.
- Mancano formulario e flashcard della lezione, e una prova su un telefono vero.

## Collegamenti
- [[Intelligenza artificiale in quinta e all'università]], [[Programma di intelligenza artificiale]], [[Confronto del programma di intelligenza artificiale con i syllabus universitari]]
