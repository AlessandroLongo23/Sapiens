# Note: Il momento di una forza e di una coppia di forze

Lezione nuova, scritta da zero (secondo lotto di fisica, gruppo 7, 30 settembre 2026). I conti di lezione, formulario e
carte sono rifatti con SymPy in `verifica_lezioni_g7.py` (scratchpad del lotto, 61 controlli sulle quattro lezioni del
gruppo): i momenti degli esempi ($12$, $21$, $-12$, $+9$, $9{,}0$, $18$, $5{,}7\,\text{N} \cdot \text{m}$), il braccio
$0{,}40 \cdot \sin 30^\circ = 0{,}20\,\text{m}$, e le coordinate delle figure (il piede della perpendicolare in
$(2{,}25; -1{,}299)$ e in $(1{,}0; -1{,}732)$, il braccio di $2\,\text{cm}$ per $0{,}20\,\text{m}$). `check.mts` passa
senza avvisi.

## Struttura ed esempi

Il braccio (polo, perno, fulcro, retta d'azione, la distanza dalla retta), il momento $M = F b$ con l'unità
$\text{N} \cdot \text{m}$, il verso di rotazione e il segno, il momento totale, la forza obliqua con $b = d \sin\alpha$
(e la stessa cosa con la componente perpendicolare), la coppia di forze e il suo momento. Quattro esempi: la chiave
inglese ($40\,\text{N}$ a $0{,}30\,\text{m}$), due forze sulla stessa asta con i segni ($+21$ e $-12$), la forza
inclinata di $30^\circ$, il volante. Avvisi accanto alle regole: la forza che passa per il polo, il braccio in metri,
il segno che viene dalla rotazione e non dalla freccia, il braccio che non si misura lungo l'asta, il braccio della
coppia (diametro e non raggio). Una nota sul momento della coppia che non dipende dal polo, con i due casi.

## Scelte

- Simbolo del momento $M$, come l'Amaldi del biennio (da verificare); $\tau$ è del terzo anno (momento torcente) e qui
  non compare.
- Segno positivo in senso antiorario, come gli angoli del piano cartesiano. Molti libri del biennio danno il momento
  solo in modulo, con il verso a parole: qui ci sono tutti e due, perché servono per il momento totale.
- Unità scritta $\text{N} \cdot \text{m}$, mai joule; non ho detto che è la stessa unità del lavoro, per non
  confondere prima della lezione sul lavoro.
- Braccio definito come distanza del polo dalla retta d'azione; $b = d \sin\alpha$ con $\alpha$ tra la forza e l'asta.
- L'esempio 2 ha momenti interi ($21$ e $12$) perché la regola delle somme della lezione "Le cifre significative"
  (i decimali del dato che ne ha meno) non desse un risultato scritto male come $3{,}0$ accanto a $12$.
- Il momento come vettore e il prodotto vettoriale sono solo un rimando al terzo anno.

## Figure

Sei TikZ, guardate in chiaro e in scuro: `braccio-di-una-forza` (la forza a $60^\circ$ applicata a $3\,\text{cm}$ dal
perno, il braccio arancione con l'angolo retto), `momento-chiave-inglese` (manico di $3\,\text{cm}$ per $30\,\text{cm}$,
la freccia curva oraria), `momento-verso-segno` (le due aste con il verso antiorario e orario),
`momento-totale-due-forze` ($1\,\text{cm}$ per $0{,}2\,\text{m}$ e per $20\,\text{N}$: frecce di $2{,}1$ e $1{,}5\,\text{cm}$),
`momento-forza-obliqua` ($1\,\text{cm}$ per $0{,}1\,\text{m}$: $d = 4\,\text{cm}$, $b = 2\,\text{cm}$),
`momento-coppia-volante` (il volante con `even odd rule` al posto di un riempimento bianco).

Asta, fulcro e perno: il README non aveva l'asta. Le lezioni del gruppo la disegnano come
`\draw[thick, fill=blue!10] (x0,0) rectangle (x1,0.12);` (o centrata sulla retta, spessa $0{,}14$), con il fulcro del
README sotto e il perno del README sopra; da aggiungere alla tabella del README se va bene.

Interattiva `chiave-inglese-momento` (`src/components/content/interactive/fisica/ChiaveInglese.tsx`): si trascina il
punto $P$ lungo il manico e la punta della forza, un cursore cambia l'intensità e uno l'angolo; la figura disegna la
retta d'azione, il braccio con l'angolo retto, l'angolo $\alpha$ e la freccia curva del verso, e sotto $d$, $\alpha$,
$b = d \sin\alpha$ e $M$ con il segno. I pezzi comuni del gruppo (asta, fulcro, perno, freccia curva, quota) sono in
`interactive/fisica/leve.tsx`.

## Esercizi

Generatore `fis-momento-forza`, specifica in `specs/exercises/fis-momento-forza.md`: cinque livelli (il momento con il
braccio, dal momento alla forza o al braccio, la forza obliqua, il momento totale con il segno, la coppia), scena
`asta-forze`. Il livello 4 chiede il valore con il verso ("$81\,\text{N} \cdot \text{m}$ orario").

## Lasciato ad altre lezioni

- Le condizioni di equilibrio del corpo rigido: alla lezione successiva, linkata in chiusura.
- Il momento torcente vettoriale, il prodotto vettoriale: al terzo anno.

## Domande per Andrea

- Il momento si indica con $M$ o con $\tau$? Al biennio l'Amaldi usa $M$?
- Il segno: positivo antiorario, oppure momento solo in modulo con il verso a parole, come fanno alcuni libri?
- "Braccio" come distanza del polo dalla retta d'azione: la formulazione è quella del libro? Il libro usa "polo" o
  "centro di rotazione"?
- L'unità: $\text{N} \cdot \text{m}$ o $\text{N}\,\text{m}$? E va detto che non è il joule?
- La coppia di forze: serve dire che il momento non dipende dal polo (qui è una nota da saltare)?
