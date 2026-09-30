---
aggiornato: 2026-09-30
tag: [sessione, contenuti, chimica]
---
# Biennio di chimica

Sessione del 30 settembre 2026, seguito di [[2026-09-30 Terzo lotto di fisica]]. Dopo il biennio di fisica, Alessandro ha chiesto di passare al biennio di chimica invece che al terzo anno di fisica. Il biennio di chimica sono 39 lezioni in sette capitoli: misure e grandezze, la materia, dalle trasformazioni chimiche alla teoria atomica (primo anno), le leggi dei gas, la mole, le particelle dell'atomo, la chimica dell'acqua (secondo anno). Una era già scritta, "La mole e la massa molare" (26 settembre), quindi le lezioni nuove sono 38 (file 10-47). Pubblicate gratis come deciso in [[2026-09-26 La chimica si pubblica gratis accanto alla beta]].

## Cosa si è fatto
- Prima del lotto (Claude), perché la pipeline della chimica era fatta per le sole molecole di RDKit:
  - `scripts/lezioni/publish.mts --per-slug`: abbina i file alle lezioni per lo slug nel nome e non per la posizione nell'indice, così la chimica ha le figure TikZ compilate e le flashcard scritte come la fisica; le sette lezioni già pubblicate risultano invariate, e la fisica si comporta come prima;
  - `scripts/fisica/indice.mts --materia chemistry --dir docs/lezioni/chimica` scrive indirizzi e indice di qualunque materia, e `check.mts` legge anche gli indirizzi della chimica: le lezioni di chimica ora si linkano tra loro e alla fisica;
  - nel README della chimica la sezione "Il biennio": file, link, costanti comuni ($N_A$, volume molare, $R$, conversioni di pressione, carica elementare), simboli, e la regola che gli argomenti già trattati dalla fisica si scrivono per intero con lo sguardo del chimico e un link alla fisica.
- Le 38 lezioni sono state scritte da nove agenti in parallelo, ognuna con formulario, flashcard e note; in più le flashcard della lezione sulla mole, che non le aveva. In tutto ci sono:
  - 78 figure TikZ e qualche molecola di RDKit (anche in 3D per l'acqua);
  - le figure interattive nella cartella nuova `interactive/chimica/`, fra cui la lettura del menisco, le particelle nei tre stati, il miscuglio da ingrandire, la soluzione con il corpo di fondo, la distillazione, la cromatografia su carta, la fusione di una sostanza pura e di un miscuglio, la bilancia di Lavoisier, il rapporto di Proust, le proporzioni multiple, la formula da costruire, il cilindro con le particelle per le leggi dei gas, l'effusione, la formula minima, la miscela di gas di Dalton, l'esperimento di Rutherford, l'atomo da costruire, i legami a idrogeno, il sale che si scioglie, la scala del pH con gli indicatori;
  - 38 generatori in TypeScript, per 198 livelli.
- Durante l'integrazione:
  - la densità nelle lezioni 07-09 di fisica era scritta $\rho$, contro la convenzione $d$: corretta nelle lezioni, nei tre generatori e nei loro controlli, verificati di nuovo con i tre seed, e ripubblicata;
  - il numero di Avogadro nel README portato a $6{,}022 \cdot 10^{23}$ come nella lezione 01, arrotondato a $6{,}02$ nei conti.
- Verifiche:
  - ogni generatore dà PASS con i seed 1, 50001 e 777001, boccia gli errori piantati e passa `review.mts` e `width.mts`;
  - i numeri delle lezioni sono rifatti in Python, con le masse della tavola della lezione 01;
  - `check.mts` non dà errori sulle lezioni nuove (gli unici errori sono falsi positivi già presenti nella lezione 05, sui pattern SMARTS dentro i blocchi di RDKit); `tsc` ed ESLint puliti.
- Pubblicate: 78 figure TikZ, 115 colonne (teoria, formulario e flashcard delle 38 lezioni, flashcard della 01) e 7 disegni di molecole.

## Informazioni nuove
- Un incidente tra agenti: il gruppo di "materia 1" ha sovrascritto un modulo appena creato dal gruppo di "materia 2" con lo stesso nome (`chim-materia.ts`); il secondo gruppo ha rifatto i suoi aiuti in `chim-materia2.ts`. I sette generatori dei due gruppi sono stati riverificati con i tre seed dopo l'integrazione e passano.
- `checkCommon` di `fisica-equilibrio.ts` confronta le opzioni come numeri e rifiuta quelle fatte di parole o di formule chimiche: due gruppi ne hanno scritto una versione loro.
- RDKit disegna il P₄ come un rombo con una diagonale e lo S₈ piatto.
- KaTeX non ha `\prescript`: nella notazione degli isotopi A e Z sono allineati a sinistra.
- Nelle etichette SVG del kit il grado esce come l'anello rialzato di KaTeX: leggibile, come `^\circ`.
- Il tema scuro altera i colori chimici (zolfo, indicatori): i gruppi hanno scritto i testi in modo che non dipendano dai colori, o hanno disegnato i colori fuori dall'inversione.
- La scena `grafico-dati` non disegna assi negativi (il grafico V-t in gradi Celsius con la retta che taglia a −273 è solo in TikZ); `ToggleGroup` fa scorrere la pagina di lato con etichette lunghe sul telefono.

## Domande aperte
- Le domande di contenuto sono in [[Domande per Andrea]], nella sezione del biennio di chimica; quelle di ogni lezione nelle note `docs/lezioni/chimica/note/10-47`.
- La composizione percentuale è spiegata sia nella 01 sia nella 35 (la 35 la richiama e aggiunge i dati di analisi): `programma.md` chiede di toglierla da una delle due.

## Stato
In produzione dal 30 settembre 2026 con la PR #17 (master non si era mosso, nessun conflitto). Controllate su `sapiens-edu.vercel.app` a 390 px le lezioni sulla separazione dei miscugli, sulla legge di Boyle e sui modelli di Thomson e Rutherford, con le loro schede, e la lezione 09 di fisica con la densità scritta $d$: figure caricate, interattive montate, scene disegnate, nessun errore.

## Prossimo argomento
Il giro sul kit rimandato dal lotto di fisica (tacche sugli assi, auto, termometro, barre dell'energia, grafici con valori negativi, `Slider`, `ToggleGroup`, `checkCommon` per le opzioni a parole). Poi il terzo anno, di fisica, di chimica o di matematica.
