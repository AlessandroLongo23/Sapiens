---
stato: decisa
aggiornato: 2026-10-01
tag: [decisione, strumenti, tecnica, matematica]
---
# Il piano cartesiano lo disegniamo noi sul kit, senza librerie di grafici

## Decisione
Il piano cartesiano e le curve si disegnano in SVG con il kit delle figure interattive (`src/components/content/interactive/kit.tsx`), con l'identità visiva del TikZ. Non si usa una libreria di grafici: né Desmos o GeoGebra incorporati, né Mafs, function-plot o JSXGraph. Le librerie restano per leggere la formula: MathLive per scriverla e il Compute Engine per trasformarla in MathJSON, che ci sono già.

## Perché
Alessandro, il 1° ottobre 2026, aveva proposto una libreria esterna per il lavoro pesante. Claude ha obiettato, e Alessandro ha scelto il piano nostro.

- Desmos e GeoGebra non si possono incorporare gratis in un prodotto commerciale. Desmos chiede un piano a pagamento per ogni applicazione in produzione (Desmos API Terms of Service, aggiornati l'11 luglio 2025, letti il 1° ottobre 2026). GeoGebra chiede un accordo di licenza per ogni uso commerciale (pagina License di geogebra.org, letta il 1° ottobre 2026).
- Le librerie libere (dati npm letti il 1° ottobre 2026): Mafs 0.21.0, MIT, ultima pubblicazione a marzo 2025; function-plot 1.25.4, MIT, aprile 2026, disegna con d3 e ha un suo parser di testo; JSXGraph 1.13.3, MIT o LGPL, settembre 2026, è un sistema di geometria intero con il suo aspetto.
- Il 29 settembre si è deciso che il piano cartesiano deve avere la stessa identità visiva del TikZ e montarsi sopra l'SVG statico ([[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]]). Lo stesso piano serve alle lezioni, alla fisica e agli esercizi: una libreria scelta per lo strumento diventerebbe il piano di tutto il sito, oppure ce ne sarebbero due.
- Del lavoro pesante di un plotter, leggere la formula è già fatto dalle librerie che abbiamo. Restano il campionamento delle curve (asintoti, buchi nel dominio), che è un algoritmo di qualche centinaio di righe secondo la stima di Claude, e assi, tacche, zoom e trascinamento.

Alternative scartate:
- Una prova di un'ora con Mafs e function-plot prima di decidere.
- Una libreria esterna rivestita con lo stile del quaderno.

## Conseguenze
- Il campionamento delle curve, il disegno delle equazioni implicite e delle regioni, lo zoom e il trascinamento sono codice nostro, con i suoi test.
- Il kit oggi ha un riquadro a finestra fissa (`frame`): il piano del plotter ha una finestra che cambia.
- Va corretta la nota [[Calcolatori e convertitori]], che consigliava di incorporare Desmos o GeoGebra.
- Da verificare prima di scrivere: quanto pesa nel browser la parte del Compute Engine che legge il LaTeX. Oggi gira solo sul server (`src/lib/exercises/v2/grade/grade.ts`).

## Collegamenti
- [[Grafico di funzioni]], [[Grafici e simulazioni interattive]], [[Calcolatori e convertitori]]
- [[2026-10-01 Il plotter delle funzioni è il primo uso del piano cartesiano del sito]]
- [[2026-09-30 La risposta aperta si scrive con MathLive, con la tastiera di Sapiens o quella del dispositivo]]
