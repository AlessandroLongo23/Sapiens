# Note: Composizione percentuale, formula minima e formula molecolare

Lezione nuova (biennio di chimica, secondo anno, gruppo 27, 30 settembre 2026). Conti rifatti in Python con la tavola
della lezione 01: esempio 1, $0{,}761/2{,}50 = 30{,}44\%$ e $1{,}739/2{,}50 = 69{,}56\%$; esempio 2, moli $2{,}1699$ e
$4{,}3500$, rapporto $2{,}0047$; esempio 3, $3{,}3306$, $6{,}6337$, $3{,}3312$, rapporto dell'idrogeno $1{,}9918$;
esempio 4, $1{,}2516$ e $1{,}8813$, rapporto $1{,}5031$; magnetite $1{,}2963$ e $1{,}725$, rapporto $1{,}3307$; avviso
sull'arrotondamento precoce, $1{,}9/1{,}3 = 1{,}46$; esempio 5, $0{,}07039$ e $0{,}17625$, rapporto $2{,}504$; esempio 6,
$M(\mathrm{NO_2}) = 46{,}01$, $92{,}0/46{,}01 = 1{,}9996$; esempio 7, $7{,}685$ e $7{,}624$, $78{,}1/13{,}02 = 5{,}998$;
$\mathrm{P_2O_5}$ $141{,}94$, $\mathrm{P_4O_{10}}$ $283{,}88$; glucosio $40{,}0/6{,}7/53{,}3\%$, atomi $25/50/25\%$.
`check.mts` passa.

## Struttura

Composizione percentuale in due modi (dalla formula, con un rimando alla lezione 01 che la spiega per intero, e dai dati
di un'analisi, con la legge di Proust), l'esempio dell'ossido di azoto che torna fino alla formula molecolare, la
figura delle due barre del glucosio (massa e atomi) e l'avviso "contare gli atomi al posto della massa"; formula minima
e formula molecolare con una tabella di sei sostanze, i composti ionici, tre sostanze con la stessa formula minima
$\mathrm{CH_2O}$ disegnate con RDKit; il procedimento in cinque passi con gli esempi 2-5 (quozienti interi, tre
elementi, moltiplicare per 2 e per 3, dati in grammi) e tre avvisi; la figura interattiva; la formula molecolare con
$n = M/M_{\text{min}}$, gli esempi 6 e 7 (con etino e benzene disegnati) e l'avviso sul dividere per la massa di un atomo.

## Scelte

- La composizione percentuale dalla formula è già nella lezione 01 (esempi 10-12): qui è richiamata in poche righe con
  il link, e la parte nuova è quella dai dati di analisi. `programma.md` segnala la sovrapposizione ("da togliere
  dall'una o dall'altra"): ho lasciato la lezione 01 com'è e qui ho tenuto solo il minimo.
- "Formula molecolare" è la "formula bruta" della lezione 01, che la chiama "formula bruta (o formula molecolare)"; qui
  si usa "formula molecolare", perché è il termine del titolo.
- Tolleranza sui quozienti: "qualche centesimo" nel testo; il generatore usa $0{,}1$.
- L'anidride fosforica è scritta $\mathrm{P_4O_{10}}$ come molecola, e la lezione dice che $\mathrm{P_2O_5}$ viene dalla
  formula minima.
- Composti ionici: la lezione dice che la loro formula "è sempre una formula minima". È vero per i sali della lezione;
  il perossido di sodio $\mathrm{Na_2O_2}$ è un'eccezione (lo ione $\mathrm{O_2^{2-}}$), per questo non è negli
  esercizi. Da valutare se dirlo.

## Figure

- TikZ `formula-minima-glucosio-barre`: due barre, massa e atomi del glucosio. Guardata in chiaro e in scuro.
- RDKit `formula-minima-ch2o-tre-molecole` (metanale e acido acetico in formula di struttura, glucosio in scheletrica)
  e `formula-minima-ch-etino-benzene` (etino e benzene con tutti gli atomi), guardate con `anteprima.mjs` in chiaro e
  in scuro. Le masse nelle legende non ci sono; le formule sì (senza pedici, come nella lezione 01).
- Interattiva `composizione-formula-minima` (`interactive/chimica/ComposizioneFormulaMinima.tsx`): sette composti
  (glucosio, etanolo, acqua ossigenata, benzene, ossido di ferro(III), magnetite, anidride fosforica), la barra delle
  masse con le percentuali e quella degli atomi con una tacca per atomo; «Passo successivo» riempie una tabella sotto il
  disegno (grammi in 100 g, moli di atomi, divisione per la più piccola, moltiplicazione) fino alla formula minima e a
  $n = M/M_{\text{min}}$. Guardata in chiaro, in scuro, sul telefono e dopo i passi, senza errori in console.

## Esercizi

Generatore `chim-formula-minima`, cinque livelli (specifica in `specs/exercises/chim-formula-minima.md`), senza scene.

## Domande per Andrea

- La composizione percentuale dalla formula sta sia nella lezione 01 sia qui: si toglie da una delle due? Se sì, da
  quale? (Oggi qui c'è solo un richiamo.)
- "Formula minima" o "formula empirica": quale nome usano di più i libri del secondo anno? La lezione li dà tutti e due.
- La regola "se il quoziente finisce in 0,5 moltiplica per 2, in 0,33 per 3, in 0,25 per 4" è quella che si insegna, o
  si insegna a provare i moltiplicatori uno alla volta?
- Nei libri i dati dell'analisi sono sempre percentuali, o capita spesso che siano le masse di un campione, come
  nell'esempio 5?
- Il perossido di sodio (formula $\mathrm{Na_2O_2}$, non ridotta) va citato come eccezione alla frase sui composti
  ionici, o è troppo per il secondo anno?
