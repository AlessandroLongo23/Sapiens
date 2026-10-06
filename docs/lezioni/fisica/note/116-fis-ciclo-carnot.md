# Note: Il teorema di Carnot e il ciclo di Carnot

Lezione nuova (lotto del terzo anno di fisica, gruppo 43, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $400/0{,}50 = 800$ J, $800 - 400 = 400$ J, $1000 - 800 = 200$ J, $600 - 400 = 200$ J;
- esempio 2: $1 - 300/500 = 0{,}400$, $0{,}400 \cdot 1500 = 600$ J, $900/1500 = 0{,}600$;
- esempio 3: $823$ K e $303$ K, $303/823 = 0{,}3682$, $1 - 0{,}3682 = 0{,}6318$, $1 - 30/550 = 0{,}945$;
- esempio 4: $1 - 300/400 = 0{,}250$, $400/1000 = 0{,}400$, $200/1000 = 0{,}200$;
- esempio 5: $300/0{,}400 = 750$ K $= 477\,^\circ$C, $300/0{,}100 = 3000$ K;
- esempio 6: $0{,}500 \cdot 8{,}31 \cdot 500 \cdot \ln 2 = 1440{,}01$ J, $0{,}400 \cdot 1440 = 576$ J, $1440 - 576 = 864$ J
  (e $0{,}500 \cdot 8{,}31 \cdot 300 \cdot \ln 2 = 864{,}01$ J);
- testo sotto la figura interattiva: $1 - 250/500 = 0{,}50$, $1 - 300/550 = 0{,}4545$;
- ciclo Otto: $1 - 10^{-0{,}40} = 0{,}602$;
- figura del ciclo di Carnot: $T_c / T_f = 5/3$, $V_B / V_A = 2{,}5$, $(5/3)^{3/2} = 2{,}1517$; punti $A$ (1; 4,5), $B$ (2,5;
  1,8), $C$ (5,379; 0,502), $D$ (2,152; 1,255).

`check.mts`: 0 errori; avvisi "titolo con maiuscole all'inglese" per "Il teorema di Carnot", "Il ciclo di Carnot" e, nel
formulario, "Il ciclo Otto": le maiuscole sono dei nomi propri.

## Struttura ed esempi

Trasformazioni reversibili e irreversibili (tre condizioni, tabella delle tre cause di irreversibilità, macchina
reversibile); il teorema di Carnot, con la dimostrazione per assurdo fatta sui numeri (esempio 1 con la sua figura); il
rendimento $1 - T_f/T_c$ enunciato, con $Q_f/Q_c = T_f/T_c$ (esempi 2 e 3, avviso sui kelvin); la macchina dichiarata che
non può esistere (esempio 4, avviso); le formule inverse (esempio 5); il ciclo di Carnot in quattro tratti (figura), il
calore assorbito lungo l'isoterma (esempio 6), la figura interattiva, un riquadro con la derivazione della formula, perché
la macchina di Carnot non si costruisce; il ciclo Otto in un riquadro, con la sua figura.

## Scelte

- Confine con la 115: il teorema usa l'enunciato di Clausius, già dato. Confine con le lezioni 111 e 113: isoterma e
  adiabatica non si rispiegano; il lavoro dell'isoterma con il logaritmo e $T\,V^{\gamma - 1}$ costante si usano con il link.
  Confine con la 118: niente disuguaglianza di Clausius, niente entropia.
- Il rendimento di Carnot è enunciato, come chiede il brief. La derivazione dalle due isoterme e dalle due adiabatiche sta in
  un riquadro `ad-note` che si può saltare: usa $T\,V^{\gamma - 1} = \text{costante}$, che deve essere nella lezione 113.
- Il teorema è enunciato con $\eta \le \eta_{rev}$, "con l'uguale solo se la macchina è reversibile". La seconda parte
  (tutte le reversibili hanno lo stesso rendimento) è detta in una riga dopo l'esempio 1, senza rifare il ragionamento.
- $\eta_{rev}$ per il rendimento delle macchine reversibili; nel ciclo di Carnot e nel ciclo Otto solo $\eta$.
- Il ciclo Otto è in un riquadro, come da brief: i quattro tratti, la formula con il rapporto di compressione e un valore.
  Stati $A$, $B$, $C$, $D$ con $A$ a volume massimo.
- Il terzo principio non è nominato: la lezione dice solo che lo zero assoluto non si raggiunge, con il link alla lezione 65.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `teorema-carnot-macchina-x-reversibile-inversa` (frecce in scala, 1 cm = 1000 J),
`ciclo-carnot-piano-pv` (curve vere con `plot`: isoterme $4{,}5/V$ e $2{,}7/V$, adiabatiche con esponente $5/3$; riga
`% poi-interattivo`), `ciclo-otto-piano-pv` (adiabatiche con esponente $1{,}4$, rapporto di compressione 4 nel disegno).

Interattiva `ciclo-carnot-temperature` (`fisica/CicloCarnot.tsx`): risponde a "partendo da 500 K e 300 K, guadagni di più
alzando di 50 K la sorgente calda o abbassando di 50 K quella fredda?". Il ciclo è in scala nel piano pressione-volume
(litri e kilopascal) per $0{,}100$ mol di gas monoatomico che parte da 1 L e raddoppia il volume lungo l'isoterma calda; due
cursori per le temperature (calda da 400 a 600 K, fredda da 250 a 350 K), una barra con $Q_c$ diviso tra $W$ e $Q_f$, sotto
il rendimento e i tre valori. Usa il piano del gruppo 41 (`fisica/pianoPV.tsx`), senza modificarlo.

## Esercizio guidato

L'esempio 4 (la macchina può esistere?). Si fermerebbe in tre punti: (1) "qual è il rendimento della macchina dichiarata?";
(2) "qual è il rendimento massimo tra queste due temperature?"; (3) "che cosa concludi dal confronto?".

## Da verificare

- Sadi Carnot, 1824, ventotto anni (nato nel 1796; "Réflexions sur la puissance motrice du feu"): scritto a memoria.
- Rendimento delle centrali vere "intorno al 40%" e vapore a 550 °C: valori correnti, scritti a memoria.
- Ciclo Otto: $\gamma = 1{,}40$ per l'aria, rapporto di compressione 10, "i motori reali rendono circa la metà".
- $R = 8{,}31$ J/(mol·K) dal README.

## Domande per Andrea

- La dimostrazione del teorema fatta solo sui numeri (esempio 1), senza la versione in lettere: basta per il terzo anno?
- Il riquadro con la derivazione di $1 - T_f/T_c$ va tenuto, o la formula resta solo enunciata?
- Il ciclo Otto con la formula $1 - 1/r^{\gamma - 1}$: va bene darla, o nel riquadro basta la descrizione dei quattro tempi?
- $\eta \le \eta_{rev}$ "con l'uguale solo se la macchina è reversibile": l'Amaldi scrive così, o distingue i due casi in
  due enunciati? (da verificare)
- Il nome "rendimento di Carnot" compare solo in un avviso; il testo dice "rendimento di una macchina reversibile". Va bene?

Prerequisiti proposti: fis-macchine-termiche, fis-enunciati-kelvin-clausius, fis-trasformazione-adiabatica, fis-trasformazioni-termodinamiche
