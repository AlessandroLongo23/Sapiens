# Flashcard: Riferimenti relativi e assoluti

## relativo-definizione
Che cos'è un riferimento relativo?
---
Un riferimento senza dollari, come `A2`: indica una posizione rispetto alla cella della formula e si adatta quando la formula viene copiata.

## copia-in-basso
`C2` contiene `=A2*B2`. Che formula compare se la copi in `C3`?
---
`=A3*B3`. La formula scende di una riga e i numeri di riga aumentano di 1.

## copia-a-destra
`B5` contiene `=B2+B3`. Che formula compare se la copi in `D5`?
---
`=D2+D3`. La formula va 2 colonne a destra: le lettere avanzano di due posti, i numeri restano.

## copia-in-alto
`D6` contiene `=B6-C6`. Che formula compare se la copi in `D4`?
---
`=B4-C4`. La formula sale di 2 righe e i numeri di riga diminuiscono di 2.

## copia-diagonale
`C2` contiene `=A1`. Che formula compare se la copi in `D5`?
---
`=B4`. Una colonna a destra e tre righe in basso: `A` diventa `B`, 1 diventa 4.

## copia-numeri
Vero o falso: copiando `=A2*2` da `B2` a `B5`, il 2 dopo l'asterisco diventa 5.
---
Falso. Cambiano solo i riferimenti: compare `=A5*2`.

## assoluto-definizione
Che cos'è un riferimento assoluto?
---
Un riferimento con il dollaro davanti alla lettera e davanti al numero, come `$D$1`: indica sempre la stessa cella, dovunque venga copiata la formula.

## assoluto-copia
`B2` contiene `=A2*$D$1`. Che formula compare se la copi in `B4`?
---
`=A4*$D$1`. `A2` è relativo e scende di 2 righe; `$D$1` è assoluto e resta com'è.

## zeri-dopo-la-copia
`B2` contiene `=A2*D1` e funziona. Copiata in `B3` dà 0. Perché?
---
Perché è diventata `=A3*D2`, e `D2` è vuota. Il riferimento a `D1` doveva essere assoluto: `$D$1`.

## dollaro-significato
Che cosa fa il dollaro in un riferimento?
---
Blocca la parte che ha subito dopo: davanti alla lettera blocca la colonna, davanti al numero blocca la riga.

## misto-colonna
In `$A2`, che cosa è bloccato?
---
La colonna `A`. La riga è libera e cambia quando la formula si sposta in un'altra riga.

## misto-riga
In `A$2`, che cosa è bloccato?
---
La riga 2. La colonna è libera e cambia quando la formula si sposta in un'altra colonna.

## misto-copia
`B2` contiene `=$A2*B$1`. Che formula compare se la copi in `C3`?
---
`=$A3*C$1`. In `$A2` si sposta solo la riga, in `B$1` solo la colonna.

## misto-copia-colonna
`C3` contiene `=$B3`. Che formula compare se la copi in `E3`?
---
`=$B3`. La copia cambia solo colonna, e la colonna è bloccata: non cambia niente.

## quale-riferimento-costante
I prezzi sono nella colonna `A` e il cambio è in `E1`. Che formula scrivi in `B2`, da copiare verso il basso?
---
`=A2*$E$1`. Il prezzo segue la riga, il cambio resta fermo.

## tavola-pitagorica
Quale formula, scritta in `B2` e copiata in tutta la tabella, costruisce la tavola pitagorica con i numeri nella colonna `A` e nella riga 1?
---
`=$A2*B$1`. Il primo fattore resta nella colonna `A`, il secondo nella riga 1.

## spostare-non-copiare
Vero o falso: se tagli una cella e la incolli altrove, i riferimenti della formula si adattano.
---
Falso. La formula si sposta senza cambiare: i riferimenti si adattano solo nella copia.
