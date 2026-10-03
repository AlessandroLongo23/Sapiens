# Flashcard: Le funzioni del foglio di calcolo

## funzione-definizione
Che cos'è una funzione del foglio di calcolo?
---
Un calcolo predefinito che ha un nome, come `SOMMA`: si scrive il nome e, tra parentesi, i dati su cui lavorare.

## argomenti-definizione
Come si chiamano i dati scritti tra le parentesi di una funzione?
---
Argomenti. Quando sono più di uno si separano con il punto e virgola.

## funzione-senza-uguale
Che cosa manca in `SOMMA(B2:B6)` perché il foglio la calcoli?
---
Il segno `=` davanti: una funzione sta dentro una formula.

## somma-conto
`A1`, `A2` e `A3` contengono 4, 6 e 10. Quanto vale `=SOMMA(A1:A3)`?
---
20, cioè $4 + 6 + 10$.

## media-conto
`A1`, `A2` e `A3` contengono 4, 6 e 11. Quanto vale `=MEDIA(A1:A3)`?
---
7. La somma è 21 e i numeri sono 3: $21 : 3 = 7$.

## min-max
`A1`, `A2` e `A3` contengono 5, 2 e 9. Quanto valgono `=MIN(A1:A3)` e `=MAX(A1:A3)`?
---
2 e 9: il numero più piccolo e il più grande.

## conta-numeri
Che cosa calcola `CONTA.NUMERI`?
---
Quante celle dell'intervallo contengono un numero.

## due-punti-o-punto-e-virgola
Che differenza c'è tra `=SOMMA(B2:B6)` e `=SOMMA(B2;B6)`?
---
La prima addiziona le cinque celle da `B2` a `B6`; la seconda ha due argomenti e addiziona solo `B2` e `B6`.

## testo-saltato
`A1`, `A2` e `A3` contengono 8, la parola assente e 6. Quanto vale `=MEDIA(A1:A3)`?
---
7. Il testo viene saltato: restano due numeri, e $14 : 2 = 7$.

## vuota-o-zero
Vero o falso: per `MEDIA` una cella vuota e una cella che contiene 0 sono la stessa cosa.
---
Falso. La cella vuota viene saltata; lo 0 è un numero, entra nel conto e abbassa la media.

## conta-con-vuote
`A1:A4` contiene 3, una cella vuota, 5 e la parola rinviato. Quanto vale `=CONTA.NUMERI(A1:A4)`?
---
2. Contano solo le celle con un numero.

## rettangolo-celle
Quante celle addiziona `=SOMMA(B2:C4)`?
---
6: l'intervallo prende 2 colonne e 3 righe.

## due-intervalli
Che cosa calcola `=SOMMA(B2:B4;D2:D4)`?
---
La somma dei numeri di tutti e due gli intervalli; la colonna `C` resta fuori.

## arrotonda-argomenti
Che cosa indicano i due argomenti di `=ARROTONDA(B7;2)`?
---
Il primo è il numero da arrotondare, il secondo quante cifre decimali tenere.

## arrotonda-su
Quanto vale `=ARROTONDA(7,68;1)`?
---
7,7. La prima cifra tolta è 8, quindi il 6 aumenta di uno.

## arrotonda-giu
Quanto vale `=ARROTONDA(3,142;2)`?
---
3,14. La prima cifra tolta è 2, quindi il 4 resta com'è.

## formato-o-arrotonda
Vero o falso: mostrare una cella con meno cifre decimali cambia il numero che contiene.
---
Falso. Cambia solo quello che si vede; per cambiare il valore serve `ARROTONDA`.

## annidate-ordine
In `=ARROTONDA(MEDIA(B2:B6);2)`, quale funzione viene calcolata per prima?
---
`MEDIA`, la più interna. `ARROTONDA` lavora poi sul suo risultato.

## nome-sbagliato
Che cosa mostra `=SOMA(B2:B6)`?
---
L'errore `#NOME?`: il foglio non riconosce il nome della funzione.
