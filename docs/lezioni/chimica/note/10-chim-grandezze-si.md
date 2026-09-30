# Note: Grandezze e unità del Sistema Internazionale

Lezione nuova (biennio di chimica, gruppo 21 "misure", 30 settembre 2026). La fisica ha la stessa lezione
(`fisica/riscritte/02-fis-grandezze-si.md`): questa è scritta per intero, con gli esempi del laboratorio di chimica, e
rimanda a quella per la notazione scientifica e l'ordine di grandezza. Conti rifatti in Python:
$M_{\mathrm{H_2O}} = 18{,}02\,\text{g/mol}$ con la tavola della lezione 01, molecole in $18\,\text{g}$ d'acqua $6{,}015 \cdot 10^{23}$ ("circa
$6{,}02 \cdot 10^{23}$" nel testo), massa di una molecola $2{,}99 \cdot 10^{-23}\,\text{g}$ (arrotondata a $3{,}0$),
$3{,}0 \cdot 10^{-23} \cdot 5{,}0 \cdot 10^{24} = 150$, $250\,\text{mL} = 2{,}50 \cdot 10^{-4}\,\text{m}^3$,
$1{,}2\,\text{g/L} = 0{,}0012\,\text{g/mL}$. `check.mts` passa (avvisi: il titolo "Il Sistema Internazionale", nome
proprio; i grassetti sono tutti su termini definiti).

## Struttura

Grandezze e misura (definizione operativa, proprietà che non sono grandezze, grandezze omogenee), grandezze estensive e
intensive con la figura dei due becher, il SI con la tabella delle sette grandezze e una colonna "in laboratorio", la
mole come grandezza del chimico e le definizioni del 2019, le grandezze derivate con la tabella delle unità di
laboratorio (litro, grado Celsius, atmosfera, millimetro di mercurio, caloria), come si scrivono le unità (con gli errori
tipici della chimica: gr, moli, °K, ml.), prefissi fino al pico con esempi chimici e la figura dei passi da mille della
massa, notazione scientifica (esempi 1 e 2 con numeri chimici), ordine di grandezza in un paragrafo, conversioni (esempio
3 con mmol, µL, µg), volumi (esempio 4, il matraccio), unità composte (esempio 5, la densità dell'aria).

## Scelte

- La notazione scientifica si spiega qui per intero: il programma di chimica diceva di rimandare alla lezione di
  matematica "Numeri decimali e frazioni", ma quella lezione non la tratta (la nomina solo la lezione 08 di matematica,
  "si studia con i numeri razionali"). Il link va alla lezione di fisica 02, che la spiega.
- Grandezze estensive e intensive sono qui, perché il Valitutti le mette nel capitolo 1 (da verificare sul libro: ho
  letto solo i titoli dei capitoli, `programma.md`).
- Litro con $\text{L}$ maiuscola, come la fisica; il SI ammette anche $\text{l}$, e la lezione lo dice.
- La $\text{M}$ della molarità è solo nominata in un avviso, per non confonderla con il prefisso mega.
- Definizione della mole del 2019: BIPM, "Le Système international d'unités", nona edizione, 2019 (lo stesso documento
  citato dalla lezione di fisica 65); $6{,}022\,140\,76 \cdot 10^{23}$ è il valore esatto. La distanza tra gli atomi
  della molecola di idrogeno, $74\,\text{pm}$, è il valore dei manuali (da verificare con una fonte citabile).

## Figure

Due TikZ, guardate in chiaro e in scuro: `estensive-intensive-becher` (due becher d'acqua, $100$ e $250\,\text{mL}$,
con massa, temperatura e densità) e `scala-prefissi-massa` (kg, g, mg, µg con i passi da mille, sul modello di
`scala-multipli-metro` della fisica). Nessuna interattiva: la lezione non ne ha bisogno. Nessuna molecola disegnata.

## Esercizi

Generatore `chim-grandezze-si`, sei livelli (specifica in `specs/exercises/chim-grandezze-si.md`): Unità e simboli, Un
prefisso e l'unità, Notazione scientifica, Tra due prefissi, I volumi, Densità e concentrazioni. Senza scene.

## Domande per Andrea

- Le grandezze estensive e intensive vanno in questa lezione (come qui) o nella lezione sugli stati della materia?
- La notazione scientifica va spiegata per intero anche in chimica (come qui), o basta il rimando alla fisica?
- Nei libri di chimica del biennio il litro si scrive $\text{L}$ o $\text{l}$? E il millilitro $\text{mL}$ o $\text{ml}$?
- La colonna "in laboratorio" della tabella delle grandezze fondamentali (la candela "quasi mai") è utile o distrae?
