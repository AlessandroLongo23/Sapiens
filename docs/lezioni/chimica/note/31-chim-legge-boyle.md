# Note: La legge di Boyle

Lezione nuova (biennio di chimica, gruppo 26 "gas", 30 settembre 2026).

## Cosa c'è

La legge dalla tabella di misure ($p \cdot V = 3{,}0\,\text{atm} \cdot \text{L}$), con il nome di trasformazione isoterma e
di legge di Boyle-Mariotte; la forma $p_1 V_1 = p_2 V_2$ e le due formule inverse; gli esempi 1 (compressione) e 2 (pallone
che sale) e l'avviso sulla formula rovesciata; le unità (esempio 3, mL e L) con l'avviso; la spiegazione con le
particelle e la figura del pistone; la figura interattiva; il grafico $p$-$V$ (ramo di iperbole), le isoterme e il grafico
di $p$ in funzione di $1/V$; il sub e il respiro (esempio 4, con l'avviso sulla pressione sott'acqua); un riquadro sui
gas reali a pressione alta.

Conti rifatti in Python: $1{,}0 \cdot 2{,}0/0{,}50 = 4{,}0$; $760 \cdot 3{,}0/600 = 3{,}8$; $1{,}20 \cdot 0{,}250/1{,}50 =
0{,}200$, $0{,}200 \cdot 760 = 152$; con i millilitri non convertiti $200\,\text{atm}$; $3{,}0 \cdot 1{,}5 = 4{,}5$, con
$2{,}0\,\text{atm}$ si avrebbe $3{,}0$; formula rovesciata nell'esempio 1, $0{,}25\,\text{atm}$. Tabella: $3/V$ per $V$ da
$1$ a $5$. `check.mts` passa (un avviso sul titolo "Il sub e il respiro", che prima era "La legge di Boyle nella vita di
tutti i giorni": falso positivo per il nome proprio, titolo cambiato comunque).

## Scelte

- La lezione è scritta per intero con lo sguardo del chimico (la costante dipende dalla quantità di gas, le unità non
  del Sistema Internazionale); la proporzionalità inversa rimanda a matematica e alla lezione 12 di fisica, dove c'è la
  siringa interattiva `siringa-pressione-volume`, che qui non uso: la figura del cilindro fa la stessa cosa con le
  particelle e il grafico.
- "$1\,\text{atm}$ ogni $10\,\text{m}$ d'acqua" è un'approssimazione (con acqua dolce e $g = 9{,}8$ viene
  $10{,}3\,\text{m}$): nel testo è scritto "circa".
- Data della legge: Boyle 1662, Mariotte 1676 (da verificare sul libro).

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `boyle-pistone-compressione` (due cilindri con le stesse otto particelle,
volume dimezzato e pressione doppia), `boyle-grafico-pressione-volume` (i cinque punti e l'iperbole, con la riga
`% poi-interattivo`), `boyle-isoterme` (tre isoterme a temperature crescenti, `% poi-interattivo`),
`boyle-pressione-inverso-volume` (la retta di $p$ in funzione di $1/V$, `% poi-interattivo`).

Interattiva `gas-cilindro-boyle` (`chimica/GasCilindroBoyle.tsx`, che apre `chimica/GasCilindro.tsx` con la temperatura
costante): cilindro verticale con pistone, particelle che rimbalzano (moto scritto a mano, velocità di Maxwell con media
proporzionale a $\sqrt{T}$), ogni urto sulle pareti segnato da un trattino rosso che svanisce, manometro in atmosfere, e
accanto un grafico che cambia con la grandezza tenuta costante ($p$-$V$ con l'isoterma, $p$-$T$ o $V$-$T$ con la retta per
l'origine, tratteggiata sotto $150\,\text{K}$). Cursori del volume ($0{,}5$-$5\,\text{L}$), della temperatura
($150$-$600\,\text{K}$) e del numero di particelle ($10$-$60$); il pistone si trascina anche con la maniglia. Pressione e
volume vengono dalla formula $p V = N k T$ con $k$ scelto perché $30$ particelle a $300\,\text{K}$ in $2{,}0\,\text{L}$
abbiano $1{,}00\,\text{atm}$; le particelle non si urtano tra loro. Guardata in chiaro, in scuro, sul telefono, e dopo
il cambio della grandezza costante.

## Esercizi

Generatore `chim-legge-boyle`, sei livelli (specifica in `specs/exercises/chim-legge-boyle.md`): la pressione finale; il
volume finale; unità diverse; dal grafico pressione-volume (scena `grafico-dati` con la curva `inversa`); la bolla del
sub; di quanto per cento.

## Domande per Andrea

- Legge di Boyle o di Boyle-Mariotte: quale nome usate? La lezione dà il primo e cita il secondo.
- Il grafico di $p$ in funzione di $1/V$ serve al secondo anno di chimica, o basta l'iperbole?
- La regola "$1\,\text{atm}$ ogni $10\,\text{m}$ d'acqua" va bene per gli esercizi del sub?
- Il livello 6 degli esercizi (di quanto per cento cambia la pressione) è utile o si toglie?
