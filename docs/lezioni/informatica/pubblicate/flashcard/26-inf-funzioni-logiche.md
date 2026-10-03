# Flashcard: Condizioni e funzioni logiche

## condizione-definizione
Che cos'è una condizione in un foglio di calcolo?
---
Un confronto tra due valori, che può essere vero oppure falso.

## valori-logici
Quali sono i valori logici?
---
VERO e FALSO. Sono il risultato di un confronto.

## operatore-diverso
Come si scrive "diverso da" in una formula?
---
`<>`, con i due caratteri in quest'ordine.

## confronto-uguale
La cella `A1` contiene 7. Che cosa compare nella cella con la formula `=A1=7`?
---
VERO. Il primo `=` apre la formula, il secondo confronta `A1` con 7.

## maggiore-uguale-soglia
La cella `B2` contiene 6. Quanto valgono `=B2>6` e `=B2>=6`?
---
FALSO e VERO. Solo `>=` accetta anche l'uguale.

## se-argomenti
Quanti argomenti ha la funzione SE, e quali sono?
---
Tre: la condizione, il valore se è vera, il valore se è falsa.

## se-voto
La cella `B2` contiene 5. Che cosa dà `=SE(B2>=6;"sufficiente";"insufficiente")`?
---
insufficiente. La condizione è falsa, quindi il risultato è il terzo argomento.

## se-numero
La cella `B2` contiene 80. Che cosa dà `=SE(B2>=50;B2*0,9;B2)`?
---
72. La condizione è vera, quindi il risultato è $80 \cdot 0{,}9$.

## se-virgolette
Vero o falso: `=SE(B2>=6;sufficiente;insufficiente)` funziona.
---
Falso. I testi dentro una formula vanno tra virgolette.

## se-annidati-definizione
Che cosa sono due SE annidati?
---
Due SE uno dentro l'altro: il secondo sta al posto del terzo argomento del primo, e così i casi diventano tre.

## se-annidati-valore
La cella `B2` contiene 9. Che cosa dà `=SE(B2>=8;"ottimo";SE(B2>=6;"sufficiente";"insufficiente"))`?
---
ottimo. La prima condizione è vera e il foglio si ferma lì.

## se-annidati-ordine
La cella `B2` contiene 9. Che cosa dà `=SE(B2>=6;"sufficiente";SE(B2>=8;"ottimo";"insufficiente"))`?
---
sufficiente. La prima condizione, `B2>=6`, è già vera: con le soglie in quest'ordine ottimo non compare mai.

## funzione-e
Quando la funzione E dà VERO?
---
Solo quando tutte le sue condizioni sono vere.

## funzione-o
Quando la funzione O dà FALSO?
---
Solo quando tutte le sue condizioni sono false.

## funzione-non
La cella `B2` contiene 4. Quanto vale `=NON(B2>=6)`?
---
VERO. La condizione `B2>=6` è falsa, e NON la rovescia.

## e-scritto-orale
Scritto 7 in `B2`, orale 5 in `C2`. Quanto valgono `=E(B2>=6;C2>=6)` e `=O(B2>=6;C2>=6)`?
---
FALSO e VERO. Una sola delle due condizioni è vera.

## intervallo-valori
Come si scrive la condizione "il valore di `B2` è compreso tra 6 e 8"?
---
`=E(B2>=6;B2<=8)`. La scrittura `=6<=B2<=8` non funziona.

## conta-se
Che cosa fa `=CONTA.SE(B2:B7;">=9")`?
---
Conta quante celle da `B2` a `B7` contengono un numero maggiore o uguale a 9.

## somma-se
Che cosa fa `=SOMMA.SE(A2:A7;"cibo";B2:B7)`?
---
Cerca cibo nelle celle da `A2` ad `A7` e somma i numeri della colonna `B` nelle stesse righe.

## conta-somma-differenza
Tre spese per il cibo: 12, 5 e 9 euro. Che cosa danno CONTA.SE e SOMMA.SE con il criterio `"cibo"`?
---
3 e 26. CONTA.SE dice quante sono, SOMMA.SE quanto fanno in tutto.
