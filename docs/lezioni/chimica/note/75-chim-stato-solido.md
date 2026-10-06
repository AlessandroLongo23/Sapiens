# Note: I solidi: ionici, molecolari, covalenti e metallici

Lezione nuova (6 ottobre 2026), gruppo H del lotto del terzo anno. `check.mts` passa su lezione, formulario e
flashcard; resta l'avviso sui 15 grassetti, che sono tutti termini nel punto in cui sono definiti (solido
cristallino, solido amorfo, reticolo cristallino, nodi, cella elementare, le tre celle cubiche, forme allotropiche,
allotropia, diamante, grafite, fullereni, grafene, nanotubo).

## Scelte

- Solidi cristallini e amorfi: la lezione 14 li ha in un riquadro. Qui hanno una sezione, con la differenza alla
  fusione e con quarzo e vetro di silice come stessa sostanza nelle due forme.
- La cella elementare è "in breve" come chiede il brief: le tre celle cubiche, la regola delle frazioni (vertice,
  spigolo, faccia, interno) e il conto delle particelle per cella. Niente numero di coordinazione, niente
  impacchettamento compatto, niente densità dal lato della cella.
- I quattro tipi sono presentati con lo stesso schema: particelle nei nodi, che cosa le unisce, proprietà come
  conseguenza. Il legame ionico e il legame metallico sono delle lezioni 65 e 66 (gruppo F): qui c'è una frase e il
  link, compreso il perché della fragilità dei cristalli ionici e della malleabilità dei metalli, che quelle lezioni
  sviluppano.
- "Solidi covalenti", con "reticolari" come secondo nome.
- Due procedimenti per riconoscere il tipo: dalla formula e dalle proprietà. Il primo ha un elenco di casi covalenti
  "da ricordare", perché dalla formula non si distinguono ($\mathrm{CO_2}$ e $\mathrm{SiO_2}$).
- La grafite è presentata anche come limite della classificazione.
- Carbonio: diamante e grafite per esteso, fullerene, grafene e nanotubi in un paragrafo. Niente link
  all'ibridazione (lezione 71): la lezione dice "quattro legami verso i vertici di un tetraedro" e "tre legami in un
  piano" senza $sp^3$ e $sp^2$, per non dipendere da un'altra lezione dello stesso lotto. Si può aggiungere.
- Il ghiaccio fuso "non conduce": è detto per l'acqua pura. La lezione 47 parla della ionizzazione dell'acqua in modo
  qualitativo.

## Dubbi per Andrea

- "Solidi covalenti" o "solidi reticolari"? I libri usano tutti e due.
- La regola delle frazioni per contare le particelle nella cella: è nel programma del terzo anno del liceo, o è
  materia da quarto? Negli esercizi è un livello intero (il quarto).
- I gas nobili solidi sono messi tra i solidi molecolari ("o atomi singoli"). Alcuni libri fanno un quinto tipo, i
  solidi atomici. Va bene così?
- Temperatura di fusione dei solidi metallici: "varia, spesso alta". Preferisci una frase diversa nella tabella?
- Lo zucchero "fonde a $186\,^\circ\text{C}$": in realtà fondendo si decompone (caramella). Lo teniamo come esempio
  di solido molecolare o lo sostituiamo con la naftalina ($80\,^\circ\text{C}$)?
- Diamante "oltre $3500\,^\circ\text{C}$": a pressione ordinaria non fonde, sopra quella temperatura si trasforma.
  La lezione dice "oltre 3500" senza dire "fonde a". Va bene così?
- Vuoi il link all'ibridazione ($sp^3$ nel diamante, $sp^2$ nella grafite)?

## Da verificare

- Temperature di fusione (°C), a memoria: NaCl $801$, MgO $2852$, KCl $770$, iodio $114$, saccarosio $186$,
  naftalina $80$, quarzo circa $1700$, carburo di silicio "sopra i $2500$" (sublima), mercurio $-39$, sodio $98$,
  rame $1085$, ferro $1538$, tungsteno $3422$. `elementi.json` ha le temperature di fusione degli elementi in kelvin:
  sodio $370{,}95\,\text{K}$, iodio $386{,}85\,\text{K}$, coerenti.
- Ghiaccio secco: sublima a $-78\,^\circ\text{C}$.
- Strutture: ferro a temperatura ambiente e sodio cubici a corpo centrato; rame, alluminio, argento e oro cubici a
  facce centrate.
- Grafite: $142\,\text{pm}$ tra gli atomi di uno strato, $335\,\text{pm}$ tra gli strati; densità $2{,}26\,\text{g/cm}^3$,
  diamante $3{,}51\,\text{g/cm}^3$.
- Fullerene $\mathrm{C_{60}}$ scoperto nel 1985, $12$ pentagoni e $20$ esagoni; grafene isolato nel 2004. Date a
  memoria. I nomi degli scopritori non sono nel testo.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `solidi-cristallino-amorfo`, `solidi-celle-cubiche`,
`solidi-quattro-tipi-reticoli`, `solidi-carbonio-diamante-grafite`. Diamante e grafite sono schemi: il diamante un
atomo con i quattro vicini, la grafite tre strati di esagoni in prospettiva. Per una struttura da ruotare servirebbe
un visualizzatore di cristalli, che non c'è (`molecola3d` disegna molecole).

Una interattiva: `solidi-tipo-particelle-conduce` (`SolidiTipoConduce.tsx`). Si sceglie un solido (cloruro di sodio,
ghiaccio, iodio, quarzo, rame) e lo stato, solido o fuso: un riquadro mostra le particelle, in ordine da solide e in
disordine da fuse, e un circuito con pila e lampadina, chiuso attraverso il campione, dice se conduce. Sotto: tipo di
solido, particelle nei nodi, che cosa le unisce, temperatura di fusione, e il perché della lampadina. Il caso che la
figura vuole far vedere è il cloruro di sodio, spento da solido e acceso da fuso. Niente blocchi `grafico`.

Nella figura il quarzo è disegnato come una rete quadrata di atomi di silicio con un ossigeno a metà di ogni legame:
è uno schema piano, non la struttura vera.

## Esercizi

Generatore `chim-stato-solido` (specifica in `specs/exercises/chim-stato-solido.md`, controllo in
`scripts/exercises/checkers/chim_stato_solido.py`, moduli comuni `chim3-h.ts` e `_chim3_h.py`), sei livelli: cristallini e amorfi, reticolo e cella; dalla formula al tipo; dalle proprietà al tipo; quante particelle nella cella (anche aperta); ordinare le temperature di fusione; le forme del carbonio. Nel livello 5 l'ossido di magnesio compare solo con il diamante, e il ghiaccio secco non compare, perché sublima.
PASS su 1000 esercizi per livello con i seed 1, 50001 e 777001; errori piantati bocciati 1140 su 1140; `review.mts` e
`width.mts` escono con 0. Non è collegato al sito.

## Esercizio guidato

L'esempio 3 (il solido bianco che fonde a 770 °C). Tre fermate: che cosa dice il fatto che non conduce da solido; che
cosa dice il fatto che conduce da fuso; il controllo con la temperatura di fusione.

Prerequisiti proposti: legame-ionico, chim-legame-metallico, legame-covalente, chim-forze-dipolo-london
