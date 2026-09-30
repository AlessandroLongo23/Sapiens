# Note: Il principio di Avogadro

Lezione nuova (biennio di chimica, gruppo 26 "gas", 30 settembre 2026).

## Cosa c'è

La legge dei volumi di combinazione di Gay-Lussac (1808) con tre esempi e il problema che poneva alla teoria di Dalton;
l'ipotesi di Avogadro (1811) in due parti, le molecole biatomiche e il principio, con la figura di idrogeno più cloro che
danno acido cloridrico; le altre reazioni con i volumi come coefficienti; Cannizzaro e il congresso di Karlsruhe; la
spiegazione con la teoria cinetica e la figura di tre gas con le stesse particelle; $V/N$ costante, la figura
interattiva, l'esempio 1 (quante molecole) e l'avviso sulla stessa temperatura e pressione; i volumi nelle reazioni, con
l'esempio 2 (ammoniaca), l'esempio 3 (la formula di $\mathrm{NO_2}$ dai volumi) e l'avviso sui volumi che non si
sommano; le masse delle molecole dalle densità, con l'esempio 4 (quale gas è). Chiude con il rimando al volume molare,
che conta le particelle con la mole (gruppo 27).

Conti rifatti in Python: $5{,}0 \cdot 10^{22} \cdot 3{,}0/2{,}0 = 7{,}5 \cdot 10^{22}$; $12/3 = 4{,}0$,
$\tfrac23 \cdot 12 = 8{,}0$; $32{,}00 \cdot 1{,}96/1{,}43 = 43{,}86$; $M(\mathrm{CO_2}) = 44{,}01$, $M(\mathrm{N_2}) =
28{,}02$, $M(\mathrm{CH_4}) = 16{,}05$ con la tavola della lezione 01. Le masse $1{,}43\,\text{g}$ e $1{,}96\,\text{g}$ per
litro sono le densità dell'ossigeno e dell'anidride carbonica in condizioni normali ($32{,}00/22{,}414$ e
$44{,}01/22{,}414$). `check.mts` passa.

## Scelte

- L'albero mette il capitolo dei gas prima di quello della mole: la lezione parla di "numero di particelle" e di "massa
  molecolare relativa", e lascia la mole e il volume molare alla lezione del gruppo 27, con un link. Il numero di
  Avogadro non compare.
- $2\,\mathrm{H_2} + \mathrm{O_2} \longrightarrow 2\,\mathrm{H_2O}$ con l'acqua come vapore: detto nel testo ("vapore
  acqueo").
- Date: Gay-Lussac 1808, Avogadro 1811, Cannizzaro 1858 ("Sunto di un corso di filosofia chimica") e Karlsruhe 1860 (da
  verificare sul libro).

## Figure

Due TikZ, guardate in chiaro e in scuro: `avogadro-idrogeno-cloro-volumi` (un volume di $\mathrm{H_2}$ più uno di
$\mathrm{Cl_2}$ danno due volumi di $\mathrm{HCl}$, quattro molecole per volume) e
`avogadro-stesso-volume-stesse-particelle` (sei particelle di $\mathrm{He}$, $\mathrm{N_2}$ e $\mathrm{CO_2}$ in tre
recipienti uguali). Nel tema scuro i colori degli atomi si invertono come le altre tinte: l'idrogeno grigio chiaro
diventa grigio scuro, ma resta leggibile per il contorno. Interattiva `gas-cilindro-avogadro`
(`chimica/GasCilindroAvogadro.tsx`: il cilindro della lezione 31 aperto con la pressione costante; il cursore delle
particelle fa salire il pistone in proporzione). Nessuna molecola RDKit: le molecole sono schemi di palline, non
strutture.

## Esercizi

Generatore `chim-principio-avogadro`, cinque livelli (specifica in `specs/exercises/chim-principio-avogadro.md`): i
volumi nelle reazioni; stesso volume, stesse particelle; la massa delle molecole; quale gas è; la formula dai volumi.
Nessuna scena.

## Domande per Andrea

- La legge dei volumi di combinazione va in questa lezione (come qui) o nel capitolo delle leggi ponderali del primo
  anno?
- Le masse delle molecole dalle densità dei gas (esempio 4 e livelli 3-4 degli esercizi) prima di aver fatto la mole:
  va bene, o si spostano dopo il volume molare?
- La formula dai volumi (esempio 3 e livello 5): gli esercizi usano anche $2\,\mathrm{N_2} + \mathrm{O_2} \longrightarrow
  2\,\mathrm{N_2O}$ e $\mathrm{H_2} + \mathrm{F_2}$, che non sono reazioni da laboratorio scolastico; tenerli?
