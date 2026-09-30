# Note: Le soluzioni e la concentrazione percentuale

Lezione nuova (biennio di chimica, gruppo 22, 30 settembre 2026). Conti rifatti in Python: esempio 1, $12/200 \cdot 100 =
6{,}0\%$ e, con l'errore, $12/188 \cdot 100 = 6{,}38\%$; esempio 2, $0{,}9 \cdot 500/100 = 4{,}5\,\text{g}$; avviso,
$2{,}5/50 \cdot 100 = 5{,}0\%$ e $2{,}5/0{,}050 \cdot 100 = 5000\%$; esempio 3, $12 \cdot 750/100 = 90\,\text{mL}$;
esempio 4, $4{,}0 \cdot 250/100 = 10\,\text{g}$, acqua $240\,\text{g}$; avviso, $4/104 = 3{,}85\%$; soluzione satura di
sale, $36/136 = 26{,}5\%$; esempio 5, $50{,}0 - 31{,}6 = 18{,}4\,\text{g}$, $31{,}6/131{,}6 = 24{,}01\%$,
$50{,}0/150{,}0 = 33{,}3\%$. `check.mts` passa (avviso sui 17 grassetti riletto: tutti termini definiti).

## Struttura

Soluto e solvente (soluzioni acquose, gassose, solide; la dissoluzione vista dalle particelle, con figura); la
solubilità (satura, insatura, corpo di fondo, dipendenza dalla temperatura con il grafico di cloruro di sodio e nitrato
di potassio, gas meno solubili a caldo, miscibili e immiscibili in un riquadro); la concentrazione, diluita e
concentrata, link alla molarità del quarto anno; percentuale in massa (esempio, avviso sul solvente), massa su volume
(soluzione fisiologica, avviso sui litri), in volume (vino, riquadro sui volumi che non si sommano); preparare una
soluzione (esempio, avviso "4 g in 100 g d'acqua"); la soluzione satura (la solubilità non è una percentuale,
esempio con il nitrato di potassio); figura interattiva.

## Scelte

- Simboli $\%\,(m/m)$, $\%\,(m/V)$, $\%\,(V/V)$ come nel README del biennio (che nomina solo i due estremi), con
  $m_{\text{soluto}}$, $m_{\text{soluzione}}$ e il pedice in tondo.
- La $\%\,(m/V)$ in grammi su $100\,\text{mL}$, come le etichette dei farmaci.
- La solubilità in grammi per $100\,\text{g}$ d'acqua; il nome "corpo di fondo" come nei libri italiani.
- Percentuali degli esercizi con due cifre significative (vedi la specifica).

## Dati da verificare

- Solubilità in g per $100\,\text{g}$ d'acqua (tabelle dei libri, da verificare su un manuale): cloruro di sodio
  $35{,}7$, $35{,}8$, $35{,}9$, $36{,}1$, $36{,}4$, $36{,}7$, $37{,}1$ a $0, 10, \ldots, 60\,^\circ\text{C}$; nitrato di
  potassio $13{,}3$, $20{,}9$, $31{,}6$, $45{,}8$, $63{,}9$, $85{,}5$, $110$ (le fonti variano di qualche grammo a caldo);
  zucchero circa $200\,\text{g}$ a $20\,^\circ\text{C}$ (letteratura: $204$). Il cloruro di ammonio, $37{,}2$ a
  $20\,^\circ\text{C}$, è confermato da Wikipedia, "Solubility table" (letta il 30 settembre 2026, dove però l'unità è
  indicata come g/100 mL). Il solfato di rame degli esercizi, $20{,}7$, è il sale anidro; la stessa pagina dà $32$ per
  il pentaidrato: da decidere quale usare. Cloruro di potassio $34{,}0$ da verificare.
- Mescolando $50\,\text{mL}$ di etanolo e $50\,\text{mL}$ d'acqua, "circa $97\,\text{mL}$" (vedi le note della lezione 15).
- Soluzione fisiologica $0{,}9\%$ e acqua ossigenata $3\%$ sono i valori delle etichette; per l'acqua ossigenata il
  $3\%$ è di solito in massa (o in volume di ossigeno sviluppato, "10 volumi"): nella lezione compare solo nella prima
  frase, senza dire che tipo di percentuale sia.

## Figure

Due TikZ, guardate in chiaro e in scuro: `soluzioni-dissoluzione-particelle` (cristallo di soluto tra le particelle
d'acqua, poi le stesse particelle sparse) e `soluzioni-curve-solubilita` (solubilità di cloruro di sodio e nitrato di
potassio da $0$ a $60\,^\circ\text{C}$, con la riga `% poi-interattivo`).

Interattiva `soluzione-aggiungi-soluto` (`chimica/SoluzioneAggiungiSoluto.tsx`): un becher d'acqua ($50$-$200\,\text{g}$,
$0$-$60\,^\circ\text{C}$), cloruro di sodio o nitrato di potassio aggiunti con un cursore o un cucchiaino da
$5\,\text{g}$; si scioglie al più $S \cdot m_{acqua}/100$ (solubilità interpolata dalla tabella sopra), il resto è un
mucchietto di cristalli sul fondo; i puntini del soluto sciolto sono tanti quanti chiede la percentuale in massa, e a
destra un indicatore della percentuale con quella della soluzione satura tratteggiata. Guardata in chiaro, in scuro, sul
telefono, con $75\,\text{g}$ di sale (satura, corpo di fondo) e dopo un cucchiaino; nessun errore in console.

## Esercizi

Generatore `chim-soluzioni-percentuale`, sei livelli (specifica in `specs/exercises/chim-soluzioni-percentuale.md`),
senza scene.

## Domande per Andrea

- Al primo anno si fanno tutte e tre le percentuali, o la $\%\,(m/V)$ si lascia al quarto anno con la molarità?
- La solubilità si dà in grammi per $100\,\text{g}$ d'acqua o per $100\,\text{mL}$? La lezione usa i grammi.
- Negli esercizi le percentuali hanno due cifre significative anche quando i dati ne hanno tre ($17{,}7\,\text{g}$ in
  $300\,\text{g}$ dà $5{,}9\%$): va bene, o si scrive $5{,}90\%$?
- Il solfato di rame negli esercizi: anidro ($20{,}7\,\text{g}$) o pentaidrato ($32\,\text{g}$ a $20\,^\circ\text{C}$)?
  Nel dubbio si può togliere.
