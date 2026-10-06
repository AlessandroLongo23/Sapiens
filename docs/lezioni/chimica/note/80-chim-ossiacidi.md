# Note: Gli ossiacidi

Lezione nuova (6 ottobre 2026), terzo anno, capitolo "Classificazione e nomenclatura dei composti", quinta lezione su
sette. Gruppo J del lotto del terzo anno. `check.mts` passa su lezione, formulario e flashcard senza avvisi. Non
pubblicata.

## Struttura e confini

Che cosa sono e lo schema anidride più acqua (figura TikZ); il numero di ossidazione del non metallo, con la formula
$x = 2c - a$; il nome tradizionale, con la scala dei quattro acidi del cloro (figura TikZ) e una tabella; cromo e
manganese; dal nome tradizionale alla formula, con il procedimento in quattro passi, tre esempi e la figura
interattiva; il nome IUPAC nei due sensi; meta, piro e orto, con l'acido dicromico in chiusura.

Le regole del numero di ossidazione e i suffissi sono della lezione 76 e le anidridi della 77: qui si richiamano con
un link. Gli anioni degli ossiacidi, e il nome "tetraossosolfato(VI) di diidrogeno", sono lasciati alla lezione 82,
con un riquadro `ad-note` che la annuncia. Acidi mono, di e triprotici non sono nominati: sono del quarto anno.

## Scelte e convenzioni

- Gli ossiacidi hanno due nomi e non tre: tradizionale e IUPAC. La tabella ha quindi le colonne Formula,
  Tradizionale, IUPAC, senza la colonna Stock che il brief chiede per tutte le famiglie. Il numero romano di Stock fa
  parte del nome IUPAC nella forma del Valitutti (acido tetraossosolforico(VI)), e un nome di Stock a parte ("acido
  solforico(VI)") non distinguerebbe l'acido metafosforico dall'ortofosforico. È il primo dubbio per Andrea.
- $\mathrm{HClO}$ è "acido monossoclorico(I)", con mon-, per coerenza con monossoclorato(I). Il volume "Chimica
  facile" di Zanichelli (pagina 138, scheda in rete, letta il 6 ottobre 2026) scrive "acido ossoclorico" per l'acido e
  "monossoclorato(I) di sodio" per il sale, senza il numero romano nel nome dell'acido.
- "Ossiacido" con "ossoacido" tra parentesi alla definizione, poi sempre ossiacido, come il titolo.
- Numeri di ossidazione: il cloro ha $+1$, $+3$, $+5$, $+7$ come in ogni libro. In `src/lib/tools/elementi.json` il
  cloro ha $+7$, $+5$, $+1$, $-1$: manca $+3$, quello dell'acido cloroso. Il bromo lì ha solo $+5$, $+1$, $-1$, e la
  lezione nomina per il bromo solo l'acido ipobromoso e il bromico; per lo iodio $+1$, $+5$, $+7$, e la lezione nomina
  l'acido iodico e il periodico. Il manganese in `elementi.json` non ha $+6$, che la lezione usa per l'acido manganico.
  Da sistemare nel file, se Andrea conferma.
- L'acido fosforoso $\mathrm{H_3PO_3}$ compare solo nella tabella di meta, piro e orto. In realtà è diprotico (un
  idrogeno è legato al fosforo): la lezione non lo dice, e gli esercizi sui sali non usano il fosfito.
- "Lo schema non descrive sempre una reazione che avviene davvero": detto con l'esempio della silice. Le anidridi
  ipotetiche (ipobromosa, ipoiodosa, periodica) compaiono solo negli esercizi, come passaggio del procedimento.
- Il controllo veloce "numero di ossidazione dispari, un idrogeno; pari, due" è in un riquadro `ad-tip`, con il suo
  limite (vale per una sola molecola d'acqua).

## Dubbi per Andrea

- Va bene che gli ossiacidi abbiano due nomi e non tre, senza un nome di Stock a parte? Se nei libri che usi la
  colonna Stock c'è, come la scrivi?
- Nome IUPAC degli acidi nella forma "acido tetraossosolforico(VI)": è quella che vuoi, o preferisci
  "tetraossosolfato(VI) di diidrogeno", che la lezione dà solo in una nota?
- "Acido monossoclorico(I)" o "acido ossoclorico(I)"?
- Meta, piro e orto: bastano fosforo, boro e silicio, o vuoi anche arsenico e antimonio? L'acido piroborico
  $\mathrm{H_4B_2O_5}$ è negli esercizi (livello 5) ma non nella tabella della lezione: lo tieni?
- Acido manganico e acido dicromico sono solo nominati. Li vuoi con il procedimento, o bastano così?

## Da verificare

- La forma esatta dei nomi IUPAC nel Valitutti (il brief la cita, io non ho il libro): ho controllato solo la scheda
  di "Chimica facile" di Zanichelli citata sopra.
- Che l'anidride solforica "reagisce con l'acqua e dà acido solforico" e che la silice "in acqua non reagisce
  affatto": scritto a memoria, vero per quanto ne so.

## Figure

Due TikZ, guardate in chiaro e in scuro: `ossiacidi-schema-anidride-acqua` (i tre riquadri con l'esempio dello zolfo)
e `ossiacidi-cloro-quattro-nomi` (la scala dei quattro acidi del cloro).

Una interattiva, `ossiacidi-anidride-piu-acqua` (`src/components/content/interactive/chimica/OssiacidiAnidrideAcqua.tsx`):
si sceglie il non metallo e il numero di ossidazione (per fosforo, boro e silicio le molecole d'acqua); gli atomi
dell'anidride e dell'acqua compaiono come sfere, poi raccolti nell'ordine della formula; sotto la somma, la formula
semplificata, quante molecole di acido si formano e i due nomi. Formule e nomi vengono da
`src/lib/exercises/v2/chim3-j.ts`, le stesse tabelle degli esercizi. Guardata in chiaro e in scuro a 800 px e a 390 px,
ai valori iniziali e dopo aver scelto azoto e fosforo, senza scorrimento laterale. Il fosforo nella figura ha solo
$+5$.

## Esercizio guidato

L'esempio 3 (acido nitrico): si fermerebbe sul numero di ossidazione ricavato dal suffisso ($+5$), sulla formula
dell'anidride ($\mathrm{N_2O_5}$) e sulla somma con l'acqua prima della semplificazione ($\mathrm{H_2N_2O_6}$).

## Esercizi

Generatore `chim-ossiacidi`, cinque livelli (specifica in `specs/exercises/chim-ossiacidi.md`), tutto a scelta
multipla. PASS con i seed 1, 50001 e 777001; errori piantati tutti bocciati; `review.mts` e `width.mts` con codice 0.

Prerequisiti proposti: numero-ossidazione, chim-ossidi, chim-acqua-acidi-basi
