# Note: Soluzioni acide e basiche: una prima idea del pH

Lezione nuova (biennio di chimica, gruppo 29, 30 settembre 2026). Conti rifatti in Python: molecole d'acqua ionizzate,
$55{,}5\,\text{mol/L} / 10^{-7}\,\text{mol/L} = 5{,}55 \cdot 10^8$ ("una ogni $550$ milioni"); esempio 1, $10^2 = 100$;
esempio 2, $1000/10 = 100$, pH da $2$ a $4$. Nella figura interattiva, rapporti $10^{7-\text{pH}}$: a pH $2{,}2$
$6{,}3 \cdot 10^4$, a pH $12{,}5$ $3{,}2 \cdot 10^5$, a pH $9{,}3$ circa $200$. `check.mts` passa.

## Struttura

Gli acidi (proprietà in elenco, tabella di sei acidi con la formula), le basi (proprietà, tabella, avviso sulla
pericolosità); l'idea di Arrhenius con le due dissociazioni, l'ammoniaca, lo ione ossonio in un riquadro con il link al
quarto anno, la ionizzazione dell'acqua e la neutralità, la neutralizzazione con l'antiacido; la scala del pH con il
fattore $10$ per unità, la figura delle sostanze, la tabella, la pioggia, l'esempio "quante volte", l'avviso sul verso e il
riquadro sul logaritmo (l'unico cenno, con il link alla lezione di matematica e a quella del quarto anno); la diluizione
di un acido o di una base forte, con l'esempio e l'avviso sul $7$; gli indicatori (tabella, il pHmetro, figura
interattiva, il cavolo rosso fatto in casa, l'avviso sulla fenolftaleina).

## Scelte

- Nessun logaritmo nel testo principale: il pH si usa con "ogni unità vale un fattore $10$", e la formula
  $\text{pH} = -\log[\mathrm{H^+}]$ è nel solo riquadro che si può saltare, come chiede il programma del gruppo.
- Arrhenius con $\mathrm{H^+}(aq)$, e $\mathrm{H_3O^+}$ nominato in un riquadro. Il nome "ione ossonio" è quello IUPAC; molti
  libri scrivono "idronio" o "ossidrilione" per $\mathrm{OH^-}$ (la lezione usa "ione idrossido", come la lezione 27).
- La regola della diluizione ("dieci volte, un'unità") vale per acidi e basi forti lontano da $7$, e la lezione lo dice
  con un avviso.
- Valori di pH delle sostanze (succo gastrico $1{,}5$, limone $2{,}2$, aceto $2{,}9$, caffè $5{,}0$, pioggia $5{,}6$, latte
  $6{,}6$, sangue $7{,}4$, acqua di mare $8{,}1$, acqua saponata $10$, ammoniaca $11{,}5$, candeggina $12{,}5$): valori tipici
  da manuale, da verificare, e la lezione dice che sono indicativi. Pioggia acida sotto $5{,}6$ (da verificare).
- Colori degli indicatori: tornasole rosso sotto $4{,}5$ e blu sopra $8{,}3$; fenolftaleina incolore fino a $8{,}2$ e rosa
  acceso sopra $10$; indicatore universale per bande (rosso $0$-$2$, arancione $3$-$4$, giallo $5$-$6$, verde $7$, blu
  $8$-$10$, viola $11$-$14$), che cambiano con la marca; cavolo rosso dal rosso al giallo. Tutti da verificare; non ho
  scritto che la fenolftaleina torna incolore a pH molto alti.
- La figura statica della scala non ha colori (il tema scuro li invertirebbe): i colori sono solo nella figura
  interattiva, disegnati fuori dall'inversione.

## Figure

TikZ `acqua-scala-ph-sostanze`: la scala da $0$ a $14$ con dieci sostanze su tre altezze, le etichette spostate a destra
o a sinistra per non incrociare le linee; guardata in chiaro e in scuro. Larga 599 px: sul telefono il testo si
rimpicciolisce.

Interattiva `acqua-scala-ph-indicatori` (`chimica/ScalaPhIndicatori.tsx`): la scala colorata con l'indicatore scelto
(universale, tornasole, fenolftaleina, cavolo rosso), un segno sul pH, una provetta del colore dell'indicatore; il pH si
sceglie con il cursore o con dodici sostanze. Sotto: pH, acida, neutra o basica, e quante volte più o meno ioni
$\mathrm{H^+}$ dell'acqua pura. I colori stanno in un secondo SVG sopra il disegno e fuori dall'inversione del tema scuro,
come `PrismaDispersione.tsx`; linee e parole restano nel disegno invertito. Guardata in chiaro, in scuro, sul telefono,
con tre indicatori e diverse sostanze: nessun errore, niente scorrimento laterale.

## Esercizi

Generatore `chim-acqua-acidi-basi`, sei livelli (specifica in `specs/exercises/chim-acqua-acidi-basi.md`): che cosa dice
una prova, acidi e basi secondo Arrhenius, la scala del pH, il fattore $10$ per unità, la diluizione, gli indicatori.
Niente scene (il colore di un indicatore in una scena andrebbe disegnato fuori dall'inversione, e oggi le scene non lo
prevedono).

## Domande per Andrea

- Al primo biennio si scrive $\mathrm{H^+}$ o $\mathrm{H_3O^+}$? E il nome: ione ossonio o idronio?
- La regola della diluizione di un acido forte (pH più $1$ ogni fattore $10$) si insegna al biennio, o si lascia al quarto
  anno con i conti?
- Quali colori dell'indicatore universale usano le cartine delle scuole? Le bande della lezione sono una scelta.
- La ionizzazione dell'acqua ("una molecola ogni $550$ milioni") va bene come dato al biennio?
- Il riquadro sul logaritmo va tenuto (è l'unico cenno), o è meglio toglierlo del tutto?
