---
aggiornato: 2026-09-28
tag: [sessione, contenuti, matematica]
---
# Decimo lotto: geometria del secondo anno

Sessione del 28 settembre 2026, seguito di [[2026-09-28 Nono lotto, grado superiore e probabilità]]. Alessandro ha chiesto il lotto successivo "così chiudiamo il biennio": è il capitolo Geometria del piano: circonferenza, aree e similitudine, 9 lezioni. Le lezioni complete di matematica passano da 95 a 104, e con loro il biennio è completo: 67 lezioni del primo anno e 37 del secondo, ognuna con teoria, esercizi, formulario e flashcard. È il minimo per il lancio fissato in [[Pipeline lezioni]].

## Cosa si è deciso
- Seno, coseno e tangente nel triangolo rettangolo passa dopo Talete e similitudine: ha bisogno della similitudine per dire che i rapporti dipendono solo dall'angolo. Cambiato in `docs/lezioni/albero.md` e nelle posizioni del database (Claude, su proposta dell'agente). Lo script dell'albero (`scripts/lezioni/tree.mts`) oggi non parte con jiti, perché non risolve l'alias `@/`: le posizioni sono state cambiate con una query.
- Convenzioni della geometria del secondo anno, prese dalle lezioni 59 e 80: congruenza $AB \cong CD$, misure con il soprassegno ($\overline{AB} = 8$ cm), triangolo rettangolo in $C$ con altezza $CH$, dimostrazioni con ipotesi, tesi e passaggi numerati, $\sin$ e $\tan$ come sulla calcolatrice (con un riquadro su $\text{sen}$ e $\text{tg}$). Le 58, 61 e 62 scrivono le misure senza soprassegno: il capitolo del primo anno e quello del secondo non sono allineati, ed è una domanda per Andrea.
- "Apotema" al maschile, come nel dizionario; l'unico femminile (nella 99) è corretto.
- Prerequisiti, con le correzioni degli agenti: la circonferenza dai punti notevoli (usa asse e bisettrice come luoghi), Talete dai quadrilateri, similitudine da Talete e Pitagora, la trigonometria dalla similitudine e dalla razionalizzazione, le trasformazioni dall'equazione della retta, dalle funzioni biettive e dalla similitudine. 104 lezioni, 162 archi, nessun ciclo.

## Cosa si è fatto
- Nove lezioni nuove (file 96-104 in `docs/lezioni/`): Circonferenza e cerchio; Poligoni inscritti e circoscritti; Equivalenza e aree; Lunghezza della circonferenza e area del cerchio; Teoremi di Pitagora e di Euclide; Teorema di Talete; Similitudine; Seno, coseno e tangente nel triangolo rettangolo; Trasformazioni geometriche. 71 esempi svolti, 135 figure (143 con quelle copiate nei formulari), 166 flashcard, una ventina di dimostrazioni. Ogni conto rifatto con SymPy, e ogni figura controllata con le coordinate: punti sulla circonferenza, angoli retti, segmenti congruenti, figure simili davvero in proporzione.
- Pubblicate. In produzione, su un Pixel 7: nessuna pagina scorre di lato, nessuna formula esce dalla colonna, nessun errore di KaTeX, tutte le figure caricate. La 96 è la lezione più lunga del sito (37.000 caratteri, 18 figure, 52 minuti di lettura dichiarati).
- Link dalle lezioni già scritte verso le nuove: 58, 60, 61, 71, 79, 80, 85, 100.
- Nove generatori di esercizi (65 livelli), verificati su 1.000 esercizi per livello con i seed 1, 50001 e 777001, errori piantati tutti bocciati, `width.mts` a 0, ESLint pulito. Tutto sul testo, senza figure: i controlli Python ricostruiscono ogni figura con le coordinate e verificano che i dati la determinino. Collegati al sito con i nomi dei livelli.
- Nel browser la scheda giornaliera della 99 aveva 26 errori di KaTeX che `review.mts` non vedeva: `presentStep` (`src/lib/exercises/present.ts`) trattava come prosa anche i `\text{…}` dentro un pedice, come $A_{\text{settore}}$, e spezzava la formula. Corretto: ora estrae solo quelli fuori dalle graffe. Nessun generatore già pubblicato usava quella forma.

## Informazioni nuove
- Quasi ogni livello di geometria vorrebbe una figura, e le specifiche dicono quali. Con la geometria del secondo anno la mancanza di figure negli esercizi è il limite principale della pipeline, come già per la retta (lotto 8).
- `review.mts` controlla le formule una per una, ma non come le mostra la pagina dopo `presentStep`: un controllo nel browser delle schede resta necessario a ogni lotto.

## Domande aperte
Le principali sono in [[Domande per Andrea]], le altre nelle note (`docs/lezioni/note/96-104`) e nelle specifiche. Le più pesanti: soprassegno sulle misure in tutto il capitolo, $\text{sen}$ e $\text{tg}$ o $\sin$ e $\tan$, triangolo rettangolo in $C$ o in $A$, unità delle misure composte ($9\pi - 18$ cm² o $(9\pi - 18)$ cm²).

## Prossimo argomento
Deploy dei generatori del nono e del decimo lotto (le lezioni sono già online). Con il biennio completo, il prossimo lotto apre il terzo anno oppure le altre materie: la decisione del 27 settembre ([[2026-09-27 Dopo la matematica delle superiori le altre materie, poi le medie]]) dice prima tutta la matematica delle superiori.
