# Note: Condizioni e funzioni logiche

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il foglio di calcolo", seconda metà, 3 ottobre
2026). `check.mts` passa senza errori su lezione, formulario e flashcard (20 carte).

## Struttura ed esempi

Confronti e valori logici (i sei operatori, VERO e FALSO); la funzione SE con i tre passi; i SE annidati per le fasce,
con la figura dell'albero delle due condizioni; E, O, NON con la tabella di verità; CONTA.SE e SOMMA.SE con il
criterio.

Cinque esempi svolti: sufficiente o insufficiente su quattro medie, con il caso del 6 esatto; lo sconto del 10% oltre
i 50 euro (risultato numerico); tre fasce di voto con due SE; scritto e orale con E e con O; le spese della settimana
con CONTA.SE e SOMMA.SE a due e a tre argomenti.

Avvisi: i simboli `<=`, `>=`, `<>`; il valore sulla soglia; le virgolette per i testi; l'ordine delle soglie nei SE
annidati; `=6<=B2<=8`; contare non è sommare; il criterio tra virgolette.

Link: le tre lezioni precedenti del capitolo (23, 24, 25, che un altro gruppo sta scrivendo) e la lezione di
matematica "Proposizioni e connettivi logici", per congiunzione, disgiunzione e negazione.

## Scelte

- Le lezioni 23-25 sono date per note: formule, riferimenti relativi (la copia della formula nell'esempio 1), intervalli
  e `SOMMA`. Se l'altro gruppo non introduce la scrittura `B2:B7` con la parola "intervallo", va allineata.
- I nomi inglesi (IF, AND, OR, NOT, COUNTIF, SUMIF, TRUE, FALSE) sono in un riquadro `ad-note` in fondo. Il README dice
  che la lezione sulle funzioni lo fa una volta per SUM, AVERAGE, IF: qui è ripetuto per le funzioni nuove, perché chi
  ha il programma in inglese altrimenti non le trova. Si può togliere.
- Nelle tabelle di esempio le medie sono scritte come nel foglio, con la virgola (7,5), senza `$`; nel testo sono
  formule ($7{,}5$).
- Non si parla di formattazione condizionale, né di SE con più di due livelli, né di CONTA.PIÙ.SE e SOMMA.PIÙ.SE.
- Negli esempi con i testi le etichette sono intere ("sufficiente", "insufficiente"); negli esercizi sono più corte
  (promosso, bocciato; ok, no) per stare nella larghezza del telefono.

## Conti

Tutti gli esempi sono stati rifatti con il valutatore del controllo Python (`/tmp/informatica-cap6b/conti26.py`): le
quattro medie con `>=6` e con `>6`; le tre fasce, anche con le soglie nell'ordine sbagliato (il 9 dà sufficiente);
$80 \cdot 0{,}9 = 72$; scritto e orale con E e con O; le spese: 3, 3, 26, 41; le medie sufficienti: 3.

## Da verificare

- `=6<=B2<=8`: la lezione dice solo che "non controlla quello che sembra". Il risultato cambia da programma a
  programma (in Excel un valore logico è maggiore di qualunque numero, quindi la formula dà sempre FALSO; in
  LibreOffice Calc VERO vale 1, quindi dà sempre VERO). Da verificare sui due programmi prima di dire di più.
- "Scrivere `=<` oppure `=>` dà un errore": vero in Excel; da verificare in LibreOffice Calc e in Fogli Google, che
  potrebbero correggere la formula da soli.
- Il testo senza virgolette "dà un errore": in Excel italiano è `#NOME?`; la lezione non scrive il codice dell'errore,
  perché cambia tra i programmi.
- Fogli Google in italiano usa gli stessi nomi (SE, E, O, NON, CONTA.SE, SOMMA.SE): da verificare.

## Domande per Andrea

- Le fasce dell'esempio 3 sono ottimo (da 8), sufficiente (da 6), insufficiente: va bene, o si preferiscono le fasce
  di un registro vero?
- Serve un cenno a SE con il terzo argomento vuoto (`""`) per lasciare la cella bianca? Ora non c'è.
