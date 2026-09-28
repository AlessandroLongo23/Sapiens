---
aggiornato: 2026-09-28
tag: [sessione, lezioni, tecnica, matematica]
---
# Figure interattive nelle lezioni

Sessione del 28 settembre 2026. Alessandro ha chiesto per la lezione Equivalenza e aree uno strumento che mostri il trapezio che diventa un triangolo: il triangolo $DMC$ si trascina intorno a $M$ come su un perno, e se lo si lascia a metà cade in posizione. Lo stile doveva restare quello delle figure TikZ, con cursori per la forma del trapezio. Poi ha chiesto di cercare altre occasioni nelle lezioni e di fare subito quelle che non richiedono il piano cartesiano.

## Cosa si è deciso
- Niente motore fisico (Matter.js, Planck.js, Rapier). Il triangolo ha un solo grado di libertà, l'angolo intorno a $M$, e un corpo rigido scritto a mano, con gravità e due appoggi, sta in poche decine di righe (Claude, approvato vedendolo).
- I cursori delle figure sono un componente del design system, `Slider` in `src/components/ui/`: cursore e campo per il valore, che accetta la virgola (Alessandro).
- Ogni figura che trasforma qualcosa ha anche un bottone che fa la trasformazione, nei due versi (Alessandro).
- Le figure che richiedono il piano cartesiano aspettano la conversazione dedicata ai grafici, come deciso prima (vedi [[Grafici e simulazioni interattive]]). Sono state lasciate fuori anche le proposte di valore basso.

## Cosa si è fatto
- Un blocco ```interattivo nel markdown di una lezione, con `% nome` e `% alt`, diventa una cornice che la pagina riempie con un componente React quando si avvicina allo schermo (`src/lib/utils/interactive.ts`). I componenti stanno in `src/components/content/interactive/`, con un kit comune (`kit.tsx`): stessa scala, spessori, tinte e lettere delle figure TikZ, punti da trascinare anche con la tastiera, animazioni che rispettano "riduci movimento", disegno invertito nel tema scuro.
- 45 figure in 38 lezioni, scritte da sette agenti in parallelo su gruppi di lezioni separati: pezzi che si spostano conservando l'area (35, 98, 99, 100), triangoli e rette (59-62), circonferenza e similitudine (96, 97, 101-104), retta dei numeri e statistica (21, 52, 53, 56, 57, 71, 77), insiemi, relazioni e dadi (2, 3, 5, 18, 41, 64, 95), frazioni e divisibilità (7, 19, 23, 24, 26), simulazioni (16, 36, 51, 54, 94). L'elenco completo con le interazioni è in [[Grafici e simulazioni interattive]].
- Controllo finale di Claude su tutte: tipi ed ESLint puliti, `check.mts` senza errori sulle 38 lezioni, ogni figura montata senza errori nella pagina, nessuno scorrimento laterale a 390 px, screenshot guardati su desktop in chiaro e su telefono in scuro. Trovato e corretto un blocco chiuso sulla stessa riga del testo nella 52.
- Corretto nella 102 un errore di notazione, $A'B' : \overline{B'C'}$, segnalato da un agente.
- Pagina temporanea `/prova-interattivo` per provare le figure in locale leggendo le lezioni da `docs/lezioni/riscritte/`, da togliere prima del commit.

## Informazioni nuove
- Gli agenti hanno scritto per conto loro pezzi che mancano al kit: numeri e frazioni dentro l'SVG (`numeri.tsx`, `retta.tsx`), pallini pieni e vuoti della retta dei numeri, un punto vincolato alla circonferenza (`CircleHandle.tsx`), diagrammi di Venn e a frecce (`insiemi.tsx`). Vanno portati nel kit quando serviranno ad altre figure.
- Le domande sui contenuti sono in [[Domande per Andrea]].

## Stato
Nel codice, non pubblicato e senza commit. Per pubblicare: prima il codice in produzione, poi le 38 lezioni con `scripts/lezioni/publish.mts`; al contrario il sito mostrerebbe i blocchi come testo.
