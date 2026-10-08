# Note: Passaggio dei parametri per valore e per riferimento

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Le funzioni", gruppo 2 del lotto). Non pubblicata.

## Struttura

Apertura con la funzione `scambia` che non scambia; il passaggio per valore (programma e figura); lo scambio che
funziona, diverso nei due linguaggi (in C++ il riferimento con `&`, in Python due valori restituiti); il modello di
Python, nomi attaccati a valori, e la lista modificata dalla funzione (con il vettore del C++ nello stesso
programma); una tabella per scegliere; due esercizi.

- 304 righe. Programmi da eseguire: 3, ciascuno in Python e in C++. Esercizi con le prove: 2.
- Riquadri `ad-warning`: 3 (la `&` dimenticata; a un riferimento serve una variabile; assegnare il parametro non
  modifica la lista). Riquadri `ad-note`: 1 (i vettori in C++ fanno eccezione, con il link alla 70).

## Elementi interattivi

- Programmi `codice` nei due linguaggi: lo scambio fallito, lo scambio riuscito, la lista modificata.
- `inf-passaggio-parametri-pila` (`PassaggioParametriPila.tsx`): "se dentro `scambia` lo scambio avviene davvero,
  dove finisce?". Tre programmi a scelta (Tentativo, Scambio, Vettore), ognuno eseguito una riga alla volta nel
  linguaggio della pagina accanto alla `Pila` del kit. È nata da `inf-scambia-valore-riferimento`, che non mostra
  codice: qui le frasi seguono le righe dei programmi della lezione, la variabile d'appoggio si chiama `temp`, lo
  scambio riuscito in Python è quello con i due valori restituiti (un'altra traccia, di 5 passi), e c'è la variante
  con la lista modificata. `inf-scambia-valore-riferimento` resta registrata e non è usata dalla lezione.

## Scelte

- Seguono le "Scelte del lotto": due modelli, uno per linguaggio. La prima sezione vale per tutti e due (un
  assegnamento a un parametro non cambia l'argomento) e introduce il nome "passaggio per valore"; "passaggio per
  riferimento" è definito solo per il C++; per Python la lezione dice che non c'è la scelta e spiega nomi e valori.
- "Valore" e non "oggetto" per quello a cui un nome di Python è attaccato: "oggetto" ha la sua lezione al quarto
  anno. Non compaiono "mutabile" e "immutabile": si dice "si può modificare" e "non si modifica, si sostituisce".
- La 66 dice che "gli argomenti vengono copiati nei parametri", per tutti e due i linguaggi. Qui la prima sezione lo
  riprende, e la sezione su Python precisa che il nome viene attaccato allo stesso valore senza copiarlo: per numeri e
  testi le due descrizioni danno gli stessi risultati, e la differenza si vede solo con le liste.
- Lo scambio con `temp` è spiegato in una frase, perché serve; la 75 lo riprende per gli ordinamenti. In Python lo
  scambio riuscito è `return y, x` con `a, b = scambia(a, b)`; la parola "tupla" non c'è. `a, b = b, a` non è
  mostrato (è nel riquadro della 75).
- Liste e vettori non sono ancora stati introdotti (70): il terzo programma usa una lista di tre voti, la scrittura
  `voti[0]` e niente altro, con una riga che dice che cos'è una lista e il rimando alla 70. In C++ il parametro è
  `int voti[]` senza la dimensione `n`, che il brief vuole nelle lezioni sui vettori: qui la funzione tocca solo
  l'elemento 0 e la dimensione non serve.
- Non ci sono: i puntatori, `const` sui riferimenti, il riferimento come valore di ritorno, il costo della copia.
- La tabella finale consiglia `return` quando le due strade sono possibili.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard).
- `verifica.mts`: 2 esercizi, 0 errori, nei due linguaggi.
- I tre programmi senza prove eseguiti con `python3` e con `clang++ -Wall`: `3 8`, `8 3`, `6` in tutti e due.
- Provati davvero: `scambia(3, 8)` e `scambia(a, b + 1)` con i parametri per riferimento non compilano; in Python,
  con `voti = [6, 7, 8]` al posto di `voti[0] = 6`, il programma scrive 5.

## Da verificare

- Il messaggio del compilatore del sito per `scambia(3, 8)` non è stato letto nel browser; con `clang++` del Mac è
  "no matching function for call to 'scambia'".

## Domande per Andrea

- Per Python va bene il modello "un nome attaccato a un valore", senza le parole "oggetto", "mutabile" e
  "immutabile"? O preferisci dire anche per Python "per valore" e "per riferimento", come fanno molti libri?
- Lo scambio in Python: `return y, x` con due nomi a sinistra dell'assegnamento, come qui, o preferisci non mostrare
  ancora un `return` con due valori?
- La lista e il vettore compaiono qui prima della loro lezione, in un programma di sei righe. Va bene, o sposti
  l'esempio nella 70 e qui lasci solo il riquadro?
- In C++ presenti anche `const int &x` per i parametri grandi che non vanno modificati?

Prerequisiti proposti: inf-visibilita, inf-parametri-ritorno, inf-definire-funzioni

## Revisione del lotto (7 ottobre 2026)

- "gli argomenti vengono copiati nei parametri" è diventato "i parametri ricevono i valori degli argomenti": la frase valeva per tutti e due i linguaggi e contraddiceva il paragrafo su Python ("senza copiarlo").
