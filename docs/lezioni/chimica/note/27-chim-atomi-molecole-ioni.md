# Note: Atomi, molecole e ioni

Lezione nuova (biennio di chimica, gruppo 25, 30 settembre 2026). Pochi conti: il solfuro di alluminio,
$2 \cdot (+3) + 3 \cdot (-2) = 0$; il punto di fusione del cloruro di sodio, $801\,^\circ\text{C}$ (valore noto, da
verificare sul libro di Andrea). `check.mts` passa.

## Struttura

L'atomo (gas nobili isolati, metalli impacchettati); la molecola, con le molecole di elementi (figura RDKit di sei
molecole), l'atomicità, ossigeno e ozono, l'avviso sulle molecole biatomiche, e le molecole di composti (figura RDKit
di acqua, anidride carbonica, ammoniaca, metano); lo ione, con gli elettroni introdotti in una frase e il link alla
lezione del secondo anno, cationi e anioni, l'avviso sul segno, la tabella degli ioni di un atomo e quella degli ioni
poliatomici; i composti ionici con la figura del reticolo, la neutralità, l'unità formula e l'esempio 1; la tabella
finale delle particelle e l'esempio 2.

## Scelte

- Gli elettroni arrivano prima della lezione sulle particelle dell'atomo (secondo anno): la lezione dice solo che
  l'atomo ha un nucleo positivo ed elettroni negativi, quanto basta per spiegare la carica degli ioni.
- Nomi degli ioni con la nomenclatura tradizionale (ione solfuro, ione ferro(II)); "ione idrogenocarbonato" e non
  "bicarbonato" (il nome comune è da decidere).
- Perché ogni elemento dia quegli ioni (gruppi della tavola periodica, ottetto) è rimandato al terzo anno: la lezione
  dà solo la regola metalli-cationi, non metalli-anioni.
- La classificazione delle sostanze (atomi, molecole, ioni) è una prima guida con l'eccezione del cloruro di ammonio;
  non nomina i solidi covalenti (diamante, quarzo), che sono al terzo anno.

## Figure

RDKit: `atomi-molecole-elementi` ($\mathrm{H_2}$, $\mathrm{O_2}$, $\mathrm{N_2}$, $\mathrm{Cl_2}$, $\mathrm{P_4}$,
$\mathrm{S_8}$) e `atomi-molecole-composti` (acqua, anidride carbonica, ammoniaca, metano, con tutti gli atomi),
guardate in chiaro e in scuro. Il $\mathrm{P_4}$ esce come un rombo con una diagonale (RDKit non disegna il tetraedro
in prospettiva): leggibile, ma da migliorare con una `molecola3d` se serve. Lo $\mathrm{S_8}$ è disegnato piano.

TikZ `atomi-reticolo-cloruro-sodio` (uno strato del reticolo, $\mathrm{Na^+}$ piccoli viola, $\mathrm{Cl^-}$ grandi
verdi), guardata in chiaro e in scuro. Nessuna interattiva.

## Esercizi

Generatore `chim-atomi-molecole-ioni`, cinque livelli (specifica in `specs/exercises/chim-atomi-molecole-ioni.md`).
Pochi esercizi diversi ai livelli 2 e 3 (circa 300 su 1.000): la lezione ha pochi ioni di un atomo.

## Domande per Andrea

- Al primo anno si parla già di elettroni per spiegare gli ioni, o gli ioni si introducono solo come "atomi con
  carica" e gli elettroni arrivano al secondo anno?
- Quali ioni poliatomici si chiedono di sapere a memoria al primo anno? La lezione ne elenca sette.
- $\mathrm{HCO_3^-}$: "idrogenocarbonato" o "bicarbonato"?
- Il livello 4 degli esercizi usa come distrattori anche nomi sbagliati costruiti con le regole ("ione soduro",
  "ione cloro"): vanno bene, o si preferiscono solo nomi veri?
