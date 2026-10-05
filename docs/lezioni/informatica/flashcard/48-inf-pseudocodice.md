# Flashcard: Lo pseudocodice

## pseudocodice-definizione
Che cos'è lo pseudocodice?
---
Un modo di scrivere un algoritmo con una riga per ogni passo, in italiano, usando poche parole sempre uguali.

## pseudocodice-computer
Vero o falso: un computer può eseguire lo pseudocodice così com'è.
---
Falso. Lo pseudocodice è scritto per una persona; per il computer va tradotto in un linguaggio di programmazione.

## riga-blocco
Quale blocco del diagramma di flusso corrisponde alla riga `leggi n`?
---
Un parallelogramma.

## rombo-parola
Con quale parola dello pseudocodice si scrive un rombo con la freccia che risale?
---
`finché`.

## freccia-o-uguale
Qual è la differenza tra `n ← 5` e `n = 5`?
---
La prima mette 5 in $n$ (assegnamento); la seconda chiede se $n$ vale 5 (confronto), e sta dopo `se` o `finché`.

## div-mod
Quanto valgono `17 div 5` e `17 mod 5`?
---
3 e 2: il quoziente e il resto della divisione tra interi.

## mod-divisibile
Quale condizione dice che $a$ è divisibile per $b$?
---
`a mod b = 0`: il resto della divisione è zero.

## sequenza-saldo
`risparmio ← prezzo · sconto / 100`, poi `finale ← prezzo − risparmio`. Con prezzo 80 e sconto 25, quanto vale `finale`?
---
60: il risparmio è 20.

## rientro-a-cosa-serve
Nello pseudocodice, che cosa dice il rientro di una riga?
---
Che la riga sta dentro il ramo o dentro il giro aperto dalla riga `se`, `altrimenti` o `finché` che ha sopra.

## altrimenti-dove
A che livello si scrive `altrimenti`?
---
Allo stesso livello del suo `se`, non rientrato.

## selezione-voto
`se voto ≥ 6` scrivi "sufficiente", `altrimenti` scrivi "insufficiente"; poi, al margine, scrivi "voto registrato". Che cosa esce con 6?
---
"sufficiente" e poi "voto registrato".

## riga-al-margine
Dopo una selezione c'è una riga `scrivi` al margine. Quando viene eseguita?
---
Sempre, qualunque ramo sia stato scelto: è fuori dalla selezione.

## riga-rientrata-per-sbaglio
Che cosa succede se la riga `scrivi "voto registrato"` viene rientrata sotto `altrimenti`?
---
Entra nel ramo "no": viene scritta solo con un voto insufficiente.

## multipli-uscita
`i ← 1`; `finché i ≤ 5`: `scrivi n · i`, `i ← i + 1`. Che cosa scrive con $n = 3$?
---
3, 6, 9, 12, 15.

## multipli-controlli
Nello stesso pseudocodice, quante volte viene controllata la condizione `i ≤ 5`?
---
Sei: cinque volte è vera e una, con $i = 6$, è falsa.

## fine-del-giro
Arrivato in fondo alle righe rientrate sotto `finché`, dove va l'esecutore?
---
Torna alla riga `finché` e controlla di nuovo la condizione.

## dimezzamenti
`c ← 0`; `finché n > 1`: `n ← n div 2`, `c ← c + 1`; `scrivi c`. Che cosa scrive con $n = 20$?
---
4: $n$ diventa 10, 5, 2, 1.

## altre-scritture
In un altro libro trovi `SE ... ALLORA ... ALTRIMENTI ... FINE SE`. È un altro algoritmo?
---
No, è un'altra scrittura della stessa selezione: lo pseudocodice non ha regole ufficiali.
