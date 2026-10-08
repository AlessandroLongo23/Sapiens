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
- Eliminati `CoverFigures.tsx`, `LevelSheet.tsx`, `SheetCycle.tsx`. Il 7 ottobre, su richiesta di Alessandro, tolto anche il resto: la pagina di prova `/prova-schede`, la disposizione a riga della scheda, il CSS di `level-sheet` e le formule scritte a mano dei fogli dei livelli (`hero-ink.ts` passa da 82 a 25 KB, ed è caricato dalla home).
- Ricerca sui corsi da aggiungere: [[Corsi universitari da aggiungere]].

## Cosa ha bocciato Alessandro, e perché
- La fascia colorata con la figura a tratto, in ogni variante: "stai iterando su un design sbagliato".
- I fogli che uscivano a ventaglio da dietro la scheda: una copia di Brilliant, che Alessandro aveva mostrato come livello di qualità e non come stile.
- La figura a tratto che seguiva il puntatore, e poi l'oggetto che seguiva il puntatore.

## Rimasto da fare
- Provare i filmati su Safari (HEVC con alfa) e su Firefox.
- Commit e pubblicazione, quando Alessandro dà il via: i file di `public/materie/` pesano circa 12 MB.
- La riga degli argomenti per i sei corsi di intelligenza artificiale.
- Decidere con Dario se questi oggetti diventano il linguaggio delle illustrazioni del sito.
- Decidere quali corsi universitari aggiungere, le aree nuove e i loro colori.

## 7 ottobre: in produzione, e la cartella di lavoro riallineata
- Le schede sono su master con la PR #47 e in produzione dal 7 ottobre (controllato su `sapiens-edu.vercel.app`). I sei branch del terzo anno erano già su master (PR dalla #41 alla #46); cancellati quelli e i due di questo lavoro, in locale e su GitHub, con le due cartelle di lavoro separate che li tenevano aperti.
- La cartella principale era ferma al master del 5 ottobre, con circa 1.450 file non committati. Prima di toccarla è stata fatta una copia verificata file per file in `../Sapiens-backup-2026-10-07` (archivio, elenco, impronte SHA-256, patch). Poi master è stato portato all'ultima versione senza toccare i file, e le differenze sono state trattate per tipo: 1.147 file erano identici a master; 174 file di master qui mancavano e sono arrivati; 77 erano copie vecchie di file corretti dopo su master, e sono state sostituite; i 7 con modifiche da entrambe le parti sono stati uniti (in sei la copia locale conteneva già tutto master; in `scenes/index.tsx` cambiava solo l'ordine delle righe); in `Agenda.md` due voci erano finite sulla stessa riga e sono state separate.
- Controllo finale sulla copia: dei 1.450 file salvati, 1.374 sono invariati nella cartella, 74 erano versioni già presenti nella storia di master, 2 sono i file uniti a mano. Niente è andato perso.
- Resta nella cartella il lavoro in corso vero, circa 230 file: laboratorio, sandbox di fisica, agenda tutor, intelligenza artificiale all'università, strumenti nelle lezioni del biennio, note del vault. Da decidere con Alessandro come committarlo.

## 8 ottobre: gli oggetti nelle testate di quattro sezioni
- Ripetizioni, Zaino, Strumenti e Laboratori hanno un oggetto nella testata, come livelli e materie (`object` di `PageHeader`). I file sono in `public/materie/`, con nome `section-*`. Nel codice locale, non committato.
- Zaino e Ripetizioni usano gli stessi oggetti dell'onboarding, lo zaino dello studente e la lampadina del tutor: in `icons.py` sono la stessa funzione sotto due nomi, quindi un ritocco vale per tutti e due i punti (l'onboarding va però riesportato). Alessandro ha scartato due alternative alla lampadina: un salvagente, che legge come una cosa negativa, e un compito corretto a penna rossa.
- Strumenti: calcolatrice, squadra e goniometro, tre oggetti semplici come le matite delle medie. Scartati le due sedie al banco per le ripetizioni (troppo complesso rispetto agli altri) e il display della calcolatrice che disegna una curva.
- Laboratori: un becher di solfato di rame sul bruciatore, con un termometro. Il filmato dura 4 secondi: la fiamma sale, la colonnina del termometro sale, l'acqua bolle e scuote il termometro, poi tutto si calma. Sostituisce nella testata la foto dell'aula, che resta nelle copertine del menu.
- Le testate con un oggetto hanno un'altezza minima, perché nelle pagine con poco testo l'oggetto scendeva sul contenuto. Nello Zaino gli adesivi iniziali della copertina stanno accanto all'oggetto, come nelle pagine delle materie.
- Da fare: guardare i quattro filmati in movimento (finora controllati su pose ferme), Safari, il tema scuro, e decidere con Dario se gli oggetti sono il linguaggio delle illustrazioni del sito.
