# Flashcard: Selezioni annidate e a più vie

## annidate
Quando due selezioni si dicono annidate?
---
Quando una sta nel blocco dell'altra.

## quanti-rombi
Quanti rombi servono in un diagramma di flusso che sceglie tra quattro strade?
---
Tre: ogni rombo divide una strada in due.

## termometro-cinque
`if gradi > 0` scrive "sopra"; nel suo `else` c'è `if gradi < 0` che scrive "sotto", con un `else` che scrive "zero". Quante condizioni vengono controllate con `gradi` uguale a $5$?
---
Una sola: la prima è vera, e la selezione interna sta su un ramo che non viene percorso.

## else-python
In Python, a quale `if` appartiene un `else`?
---
A quello che sta sulla sua stessa colonna.

## else-senza-graffe
In C++, senza graffe, a quale `if` si attacca un `else`?
---
All'`if` più vicino sopra di lui, comunque siano rientrate le righe.

## annidata-and
Un `if` dentro il blocco di un altro `if`, senza nessun `else`: con quale operatore logico si scrive in una condizione sola?
---
Con `and`: il blocco interno viene eseguito solo se sono vere tutte e due le condizioni.

## elif-cpp
Come si scrive in C++ l'`elif` di Python?
---
`else if`, in due parole, con la condizione tra parentesi.

## piu-vie-blocchi
In una selezione a più vie con l'`else` finale, quanti blocchi vengono eseguiti?
---
Uno solo: quello della prima condizione vera, oppure quello dell'`else` se nessuna lo è.

## giudizio-sette
Le condizioni sono, in ordine, `voto >= 9` (ottimo), `voto >= 7` (buono), `voto >= 6` (sufficiente), poi `else` (insufficiente). Che cosa esce con $7$?
---
"buono": la prima condizione è falsa, la seconda è vera e il resto viene saltato.

## giudizio-nove
Con le stesse condizioni, il voto $9$ rende vera anche `voto >= 6`. Perché non esce "sufficiente"?
---
Perché conta la prima condizione vera, `voto >= 9`: le altre non vengono nemmeno controllate.

## ordine-sbagliato
In una selezione a più vie la prima condizione è `voto >= 6` (sufficiente), la seconda `voto >= 9` (ottimo). Che cosa esce con $10$?
---
"sufficiente": la prima condizione prende tutti i voti dal $6$ in su.

## tanti-if
Tre `if` separati controllano `voto >= 9`, `voto >= 7` e `voto >= 6`, e ognuno scrive il suo giudizio. Quante scritte escono con $9$?
---
Tre: le selezioni separate vengono controllate tutte.

## else-finale
Vero o falso: una selezione a più vie deve finire con un `else`.
---
Falso. L'`else` finale è facoltativo: senza, se nessuna condizione è vera non viene eseguito nessun blocco.

## switch-quando
Quando conviene usare `switch` in C++ o `match` in Python?
---
Quando tutte le condizioni confrontano la stessa variabile con dei valori fissi.

## default
Come si scrive il caso "tutti gli altri valori" in C++ e in Python?
---
`default:` nello `switch` del C++, `case _:` nel `match` di Python.

## break-dimenticato
In uno `switch` il caso $1$ scrive "acqua" senza `break`, il caso $2$ scrive "succo" e poi ha `break`. Che cosa esce con $1$?
---
"acqua" e poi "succo": senza `break` il programma prosegue con le istruzioni del caso successivo.

## switch-soglie
Vero o falso: in uno `switch` del C++ si può scrivere `case voto >= 6:`.
---
Falso. Lo `switch` controlla solo se il valore è uguale a quello di un caso; per le soglie serve `else if`.
