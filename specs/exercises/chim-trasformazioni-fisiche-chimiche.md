# Trasformazioni fisiche e trasformazioni chimiche

Generatore: `chim-trasformazioni-fisiche-chimiche` (`src/lib/exercises/v2/generators/chim-trasformazioni-fisiche-chimiche.ts`,
con `src/lib/exercises/v2/chim-leggi-ponderali.ts`). Verifica indipendente:
`scripts/exercises/checkers/chim_trasformazioni_fisiche_chimiche.py` (con `_chim_leggi_ponderali.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/21-chim-trasformazioni-fisiche-chimiche.md`. Percorso nel database:
`high_school/chemistry/chim-trasformazioni-chimiche/chim-trasformazioni-fisiche-chimiche`.

Quattro livelli, tutti a scelta multipla con quattro opzioni a parole, su situazioni prese da tabelle scritte dalla
lezione. Le opzioni più lunghe di 26 caratteri vanno su due o tre righe (`gathered`).

## Nomi dei livelli

1. Fisica o chimica
2. Reagenti e prodotti
3. Gli indizi
4. L'indizio non basta

## Livello 1: fisica o chimica

Metà "Quale di queste trasformazioni è chimica?" (una chimica e tre fisiche), metà "... è fisica?" (una fisica e tre
chimiche), da due elenchi di 14 situazioni: ruggine, legno che brucia, uovo che cuoce, latte che inacidisce, mosto che
fermenta, caramello, mela che annerisce, fornello, aceto e bicarbonato, pane tostato, argento che annerisce, rame verde,
elettrolisi, cemento; ghiaccio che fonde, acqua che bolle, zucchero nel tè, pozzanghera, caffè macinato, filo piegato,
bicchiere rotto, vapore che condensa, cera che solidifica, naftalina, sabbia filtrata, ferro con la calamita, cioccolato,
sale sciolto. La soluzione dice il perché.

## Livello 2: reagenti e prodotti

Una di 13 reazioni raccontate a parole (metano che brucia, ruggine, calcare scaldato, magnesio, elettrolisi, aceto e
bicarbonato, ferro e zolfo, fotosintesi, zinco e acido cloridrico, sodio e cloro, ossido di mercurio, fermentazione,
idrogeno che brucia); metà chiede i reagenti, metà i prodotti. Distrattori: l'altro lato; una sostanza scambiata con una
dell'altro lato; tutte le sostanze insieme.

- "Scaldando il carbonato di calcio si ottengono ossido di calcio e diossido di carbonio. Quali sono i prodotti?"
  Risposta "Ossido di calcio e diossido di carbonio"; distrattori "Carbonato di calcio", "Carbonato di calcio e
  diossido di carbonio", tutte e tre.

## Livello 3: gli indizi

Una storia con un solo indizio; le opzioni sono sempre le quattro: "Si sviluppa un gas", "Si forma un precipitato",
"Cambia il colore", "Si liberano calore e luce". Da 3 a 4 storie per indizio, ognuno circa un quarto dei casi.

- "Si soffia con una cannuccia nell'acqua di calce, limpida: il liquido si intorbida e sul fondo si deposita un solido."
  Risposta "Si forma un precipitato".

## Livello 4: l'indizio non basta

Una di 10 situazioni con un indizio: 5 fisiche (acqua che bolle, bibita gassata, inchiostro nell'acqua, lampadina, acqua
salata che evapora) e 5 chimiche (aceto e bicarbonato, chiodo nel solfato di rame, acqua di calce, magnesio, latte
acido). "Si è formata una sostanza nuova?" Le opzioni sono risposte con il perché: la giusta, una con la stessa
conclusione e un perché falso, due con la conclusione opposta; sempre due "Sì" e due "No", perché la conclusione da sola
non basti.

- "In una pentola sul fornello l'acqua comincia a bollire e si riempie di bollicine." Risposta "No: le bollicine sono
  vapore acqueo, cioè ancora acqua"; distrattori "Sì: si sviluppa un gas, e un gas è sempre una sostanza nuova", "Sì:
  l'acqua assorbe calore, e questo è un segno di reazione", "No: le bollicine sono l'aria che stava sul fondo della
  pentola".

## Esercizi da evitare

- Situazioni dubbie (la dissoluzione con scambio di calore, la candela che fa le due cose insieme): non ci sono.
- Due indizi nella stessa storia del livello 3.

## Verifica

Il controllo ha le sue tabelle: classifica le situazioni del livello 1, riconosce la reazione del livello 2 dall'inizio
della storia e confronta gli insiemi di sostanze, trova l'indizio del livello 3 dalle parole della storia (una sola
regola deve valere), cerca la situazione del livello 4 e la sua risposta; controlla le quote dei casi.

Esito (30 settembre 2026): seed 1, 50001, 777001, 4.000 esercizi ciascuno, PASS. Errori piantati su 60 esercizi (seed da
300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta bocciati 60 su 60. `review.mts` e `width.mts`
con codice 0 (opzioni al più 213 px su 252).
