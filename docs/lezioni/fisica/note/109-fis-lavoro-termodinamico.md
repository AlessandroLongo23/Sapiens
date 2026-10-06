# Note: Il lavoro in una trasformazione termodinamica

Lezione nuova (lotto del terzo anno, gruppo 41, 6 ottobre 2026). Conti rifatti in Python:

- pistone: $1{,}5 \cdot 10^5 \cdot 4{,}0 \cdot 10^{-3} = 600$ N, $600 \cdot 0{,}10 = 60$ J, $1{,}5 \cdot 10^5 \cdot 4{,}0 \cdot 10^{-4} = 60$ J;
  $1{,}01 \cdot 10^5 \cdot 10^{-3} = 101$ J;
- esempio 1: $1{,}01 \cdot 10^5 \cdot 3{,}0 \cdot 10^{-3} = 303$ J; esempio 2: $2{,}0 \cdot 10^5 \cdot (-5{,}0 \cdot 10^{-4}) = -100$ J;
- esempio 3: $\frac{3{,}0 + 1{,}0}{2} \cdot 10^5 \cdot 4{,}0 \cdot 10^{-3} = 800$ J; esempio 4: $1200$ J e $400$ J; esempio 5: $1200 - 400 = 800$ J;
- curva dei quadretti: è l'iperbole $p\,V = 400$ kPa·L, area esatta $400 \ln 4 = 554{,}5$ J, cioè $22{,}2$ quadretti da $25$ J.

`check.mts`: 0 errori, 0 avvisi.

## Struttura ed esempi

Il lavoro a pressione costante ricavato da $F = p\,S$ e $W = F\,h$ (figura del cilindro, conto del pistone, unità, avviso su
litri e atmosfere, trucco dei kilopascal per litri); il segno (espansione, compressione, volume costante; esempi 1 e 2;
avviso su $\Delta V$); il piano pressione-volume e l'isobara come rettangolo; il lavoro come area (strisce sottili, i tre
casi con la geometria, esempio 3 con il trapezio, i quadretti per le curve); la dipendenza dal cammino (esempio 4, figura,
interattiva, lavoro che non è funzione di stato, nota sul confronto con le forze conservative); la trasformazione ciclica
(area racchiusa e verso, esempio 5, avviso); il procedimento sul grafico.

## Scelte

- Confini con le lezioni vicine. La 107 (gruppo 40) definisce stato, trasformazione quasistatica e piano: qui il piano
  pressione-volume si richiama in tre righe con il link e si usa. La 108 ha l'energia interna: qui solo nominata come
  esempio di funzione di stato. Il lavoro dell'isoterma (con il logaritmo) sta nella 111: qui la curva si stima con i
  quadretti, e la 111 riprende lo stesso esempio per controllare la formula.
- Il lavoro di un ciclo come area racchiusa sta qui, perché è una proprietà del lavoro; il bilancio $Q = W$ del ciclo sta
  nella 110 (enunciato) e nella 111 (ciclo con tre trasformazioni, tabella).
- $W$ è il lavoro compiuto dal gas (README, come l'Amaldi); il lavoro dell'ambiente è $-W$, detto una volta.
- Grafici in kilopascal e litri, perché il prodotto è il joule e i quadretti si contano bene; nei conti degli esempi i
  dati sono in pascal e metri cubi, in notazione scientifica.
- Gli stati $A$ ($2{,}0$ L, $300$ kPa) e $B$ ($6{,}0$ L, $100$ kPa) tornano negli esempi 3, 4 e 5, nell'interattiva e
  nell'esempio 3 della lezione 110 (dove serve che abbiano lo stesso $p\,V$).

## Figure

Sei TikZ, guardate in chiaro e in scuro: `pistone-lavoro-espansione`, `isobara-lavoro-area-rettangolo`,
`lavoro-area-trapezio`, `lavoro-curva-quadretti`, `lavoro-due-cammini`, `ciclo-rettangolare-area-racchiusa`. Scala dei
piani: $0{,}8$ cm per litro, $0{,}9$ cm per $100$ kPa; la curva dei quadretti è $y = 2{,}88/x$ (cioè $p\,V = 400$ kPa·L).

Interattiva (registrata sotto il commento del gruppo 41 in `src/lib/utils/interactive.ts`):

- `pistone-lavoro-cammini` (`fisica/PistoneLavoroCammini.tsx`). Domanda: quanto lavoro compie il gas lungo ciascuno dei
  tre cammini da $A$ a $B$? Il cilindro è disegnato sopra il piano con la stessa scala orizzontale; un bottone fa
  percorrere il cammino scelto e l'area si colora. Risposta nel testo: $1200$, $800$, $400$ J.

I pezzi comuni delle tre lezioni sono in un file mio, `fisica/pianoPV.tsx`: assi del piano con le tacche numerate, linea
di una trasformazione (retta, isoterma, adiabatica), area sotto la linea, freccia del verso, cilindro orizzontale con il
pistone, barre con il segno.

## Esercizi

Generatore `fis-lavoro-termodinamico`, sei livelli (specifica in `specs/exercises/fis-lavoro-termodinamico.md`). Scena
nuova `piano-pv` (`scenes/PianoPV.tsx`) ai livelli 4, 5 e 6.

## Esercizio guidato

L'esempio 4 (due cammini tra gli stessi stati). Si fermerebbe in tre punti: (1) "quanto vale il lavoro nei tratti
verticali?" (zero, il volume non cambia); (2) "a che pressione avviene l'espansione nel cammino che passa da $C$?" (quella
di $A$); (3) dopo i due risultati, "il lavoro lungo il segmento diretto sta tra i due: perché?" (l'area del trapezio è a
metà tra i due rettangoli).

## Domande per Andrea

- Kilopascal e litri sui grafici e pascal e metri cubi nei conti: va bene il doppio registro, o meglio assi in
  $10^5$ Pa e $10^{-3}\,\text{m}^3$ come l'Amaldi?
- Il segno del lavoro con "più verso destra, meno verso sinistra" e il ciclo con "orario positivo": è la formulazione che
  usi in classe?
- La stima con i quadretti (esempio della curva) è al livello del terzo anno, o è meglio dare subito la formula
  dell'isoterma rimandando alla 111?
- Il lavoro "subito" dal gas: lo uso come sinonimo di lavoro compiuto dall'ambiente sul gas. Va bene?

## Da verificare

- $1\,\text{atm} = 1{,}01 \cdot 10^5$ Pa (README).
- Che l'Amaldi usi $W$ per il lavoro compiuto dal sistema (README, da verificare).

Prerequisiti proposti: lavoro, fis-pressione, fis-gas-perfetto, fis-sistemi-termodinamici
