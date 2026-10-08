# Note: Variabili locali e globali

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Le funzioni", gruppo 2 del lotto). Non pubblicata.

## Struttura

Apertura con due funzioni che usano lo stesso nome; la variabile locale e la visibilità (programma dei punti di una
squadra, con l'invito a scrivere `totale` da fuori e vedere l'errore); il tempo di vita e la pila delle chiamate
(programma della stagione, con due `totale`, e figura); la variabile globale (`per_vittoria` cambiata tra due
chiamate uguali); perché le globali si evitano, con l'eccezione delle costanti; due esercizi.

- 329 righe. Programmi da eseguire: 3, ciascuno in Python e in C++. Esercizi con le prove: 2.
- Riquadri `ad-warning`: 3 (il risultato non esce da solo; la locale non ricorda; la locale nasconde la globale).
  Riquadri `ad-note`: 2 (l'errore nei due linguaggi; dove stanno le globali e `global`).

## Elementi interattivi

- Programmi `codice` nei due linguaggi. Il primo risponde a "che cosa succede se uso `totale` fuori da `punti`?"; il
  terzo a "perché la stessa chiamata dà due risultati diversi?".
- `inf-visibilita-pila` (`VisibilitaPila.tsx`): "mentre `punti` calcola i punti dell'andata, quante variabili
  `totale` ci sono, e quanto valgono?". È il programma della stagione eseguito una riga alla volta, nel linguaggio
  scelto per i programmi della pagina, accanto alla `Pila` del kit: 10 passi, il riquadro di `punti` nasce due volte.

## Scelte

- Confine con la 66: parametri, argomenti e `return` sono dati per fatti. La funzione degli esempi è la stessa
  `punti(vinte, pareggi)` della 66, con gli stessi nomi dei parametri.
- Confine con la 68: qui si dice solo che i parametri sono variabili locali. Che cosa succede agli argomenti quando la
  funzione cambia un parametro è della 68.
- "Programma principale" è il nome delle istruzioni fuori dalle funzioni, come nella 65: in C++ è `main`. Nella figura
  il riquadro in fondo alla pila si chiama `main` in C++ e "programma principale" in Python.
- La differenza tra i due linguaggi è detta apertamente: in Python le variabili del programma principale sono
  globali, in C++ quelle di `main` sono locali di `main`. Per questo il programma della stagione, in Python, ha una
  `totale` globale e una locale: il riquadro `ad-note` lo spiega, insieme a `global`.
- `global` sta in un riquadro, come chiede il brief, e non c'è un programma che lo usa. `nonlocal` non c'è.
- Le costanti globali (`PER_VITTORIA`, `const int` in C++) sono presentate in un paragrafo come l'eccezione alla
  regola. `const` compare qui per la prima volta nelle lezioni; la 70 lo usa per la dimensione dei vettori.
- Non ci sono: le variabili dichiarate in un blocco in C++ (la `i` di un `for`, che è locale del ciclo), le
  variabili `static`, lo spazio dei nomi. "Scope" non è nominato: si dice "visibilità".
- La pila delle chiamate è presentata come il modo in cui il computer tiene il conto delle chiamate in corso, senza
  indirizzi di ritorno e senza la parola "stack". La pila come struttura dati è del quarto anno.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard).
- `verifica.mts`: 2 esercizi, 0 errori, nei due linguaggi.
- I tre programmi senza prove eseguiti con `python3` e con `clang++ -Wall`: stesse uscite (13; 22; 13 e 9).
- Provati davvero: `print(totale)` in fondo al primo programma dà `NameError: name 'totale' is not defined` dopo
  aver scritto `Punti: 13`; in C++ `use of undeclared identifier 'totale'`; l'assegnamento `x = x + 1` a una globale
  senza `global` dà `UnboundLocalError`.

## Da verificare

- Il testo esatto degli errori dipende dalla versione: `NameError` e `UnboundLocalError` sono stati letti con il
  Python 3.9 della macchina; nell'editor del sito (Python nel browser) il messaggio di `UnboundLocalError` può essere
  scritto in un altro modo. La lezione cita solo il nome dell'errore.
- Il messaggio del compilatore del sito per il nome non dichiarato non è stato letto nel browser.

## Domande per Andrea

- In Python le variabili del programma principale sono globali, e i programmi delle lezioni non hanno una funzione
  `main`. Va bene dirlo in un riquadro, come qui, o preferisci che dal terzo anno i programmi Python abbiano
  `def main():`, così i due linguaggi si comportano allo stesso modo?
- `global`: basta il riquadro, o vuoi un esempio da eseguire (un contatore di chiamate)?
- Le costanti globali in maiuscolo e `const` in C++: le introduci qui o più avanti?
- In classe chiami "visibilità" o "ambito" (scope) la zona in cui un nome si può usare?

Prerequisiti proposti: inf-parametri-ritorno, inf-definire-funzioni, inf-variabili-tipi

## Revisione del lotto (7 ottobre 2026)

- "quando la funzione ritorna" è diventato "quando la funzione finisce".
