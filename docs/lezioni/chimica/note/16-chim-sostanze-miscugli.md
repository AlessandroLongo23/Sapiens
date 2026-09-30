# Note: Sostanze pure, miscugli omogenei ed eterogenei

Lezione nuova (biennio di chimica, gruppo 22, 30 settembre 2026). Nessun conto; l'esempio 3 ($52$-$61\,^\circ\text{C}$ e
$80\,^\circ\text{C}$) è inventato, con temperature plausibili. `check.mts` passa.

## Struttura

Sostanze pure (definizione con le particelle, proprietà caratteristiche, elementi e composti in un paragrafo con link,
avviso sul "puro" delle etichette); miscugli (componenti, composizione variabile, link ai metodi di separazione),
omogenei e eterogenei, figura delle particelle; fasi e componenti (definizione di fase, due regole per contare,
esempio, acqua e ghiaccio come sistema eterogeneo di una sostanza pura, avviso); tipi di miscugli eterogenei (tabella,
colloidi, effetto Tyndall in un riquadro); classificare (schema ad albero, due domande, esempio con quattro materiali,
avviso "trasparente vuol dire puro"), figura interattiva; come si riconosce una sostanza pura (fusione ed ebollizione a
temperatura costante, link alle curve di riscaldamento della lezione 20, esempio delle due polveri).

## Scelte

- Latte, maionese e nebbia sono colloidi e si classificano come miscugli eterogenei, "perché al microscopio le parti si
  distinguono": è la scelta della maggior parte dei libri del biennio che conosco (da verificare sul Valitutti). Alcuni
  testi mettono i colloidi in una classe a parte, tra omogenei ed eterogenei.
- "Sistema eterogeneo" e "miscuglio" tenuti distinti (acqua e ghiaccio).
- L'olio è trattato come un componente nell'esempio 1 (come fanno i libri), ma è tolto dalle domande sui componenti
  degli esercizi, perché è a sua volta un miscuglio.
- Nessun elenco di materiali discussi (sangue, acqua del rubinetto, acciaio) negli esercizi.
- Le dimensioni dei colloidi, "tra un milionesimo e un millesimo di millimetro" (da 1 nm a 1 µm), come la definizione
  IUPAC che ricordo (da verificare).

## Figure

Due TikZ, guardate in chiaro e in scuro: `miscugli-particelle` (tre riquadri: un colore, due colori mescolati, due
colori in strati) e `miscugli-schema-classificazione` (l'albero materia, sostanze pure e miscugli). Nessuna molecola.

Interattiva `miscuglio-ingrandisci` (`chimica/MiscuglioIngrandisci.tsx`): otto materiali (acqua e olio, acqua salata,
rame, latte, aria, acqua distillata, granito, ottone), tre ingrandimenti (occhio nudo, microscopio, particelle) con uno
zoom che entra nel cerchio tratteggiato, tre bottoni per rispondere e la spiegazione nella didascalia; conta le
risposte giuste. Guardata in chiaro e in scuro, sul telefono, durante lo zoom, dopo una risposta, e materiale per
materiale a tutti e tre gli ingrandimenti; nessun errore in console.

## Esercizi

Generatore `chim-sostanze-miscugli`, cinque livelli (specifica in `specs/exercises/chim-sostanze-miscugli.md`); il
livello 3 usa la scena nuova `particelle-riquadri` (`exercises/scenes/ParticelleRiquadri.tsx`), quattro riquadri di
particelle disegnati dai dati, guardata in chiaro e in scuro sul telefono. Il terzo colore delle particelle è un viola
medio: il verde chiaro, invertito nel tema scuro, non si distingueva dal ciano.

## Domande per Andrea

- Latte e maionese: miscugli eterogenei (colloidi) come nella lezione, o una classe a parte?
- Serve distinguere "sistema" da "miscuglio" al primo anno (acqua e ghiaccio: sistema eterogeneo di una sostanza pura)?
- Nella tabella dei miscugli eterogenei i nomi "nebbia" e "fumo" per liquido in gas e solido in gas vanno bene, o si
  usa "aerosol"?
- Negli esercizi sulle fasi, più pezzi dello stesso solido sono una fase sola: è la convenzione che usate?
