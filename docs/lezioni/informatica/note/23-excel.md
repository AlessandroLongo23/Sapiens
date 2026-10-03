# Note: Celle, valori e formule

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il foglio di calcolo", prima metà, 3 ottobre
2026). Lo slug `excel` è storico: nel testo i tre programmi sono nominati una volta sola, nell'apertura. `check.mts`
passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Struttura ed esempi

Righe, colonne, celle, indirizzi e intervalli, con la figura della griglia (cella `B3`, intervallo `C2:D4`) e il
conto delle celle di un intervallo; i quattro tipi di contenuto (testo, numero, data, formula), con la virgola
decimale e le date come numero di giorni; la formula con il segno `=`, il riferimento, contenuto e valore mostrato;
i cinque operatori; l'ordine delle operazioni in cinque passi; il ricalcolo automatico; gli errori `#DIV/0!`,
`#VALORE!`, `#NOME?` e il riferimento circolare.

Cinque esempi svolti: un prodotto; una somma di prodotti; la media con e senza parentesi; una densità con la potenza
(cubetto di alluminio, per l'aggancio con fisica); il ricalcolo dopo il cambio di una quantità.

Avvisi: le righe di un intervallo si contano tutte; senza `=` non è una formula; asterisco e barra; un risultato
senza errori può essere sbagliato lo stesso.

Non trattati, con il link: la copia delle formule (lezione 24), le funzioni (25), gli operatori di confronto (26).

## Conti

Rifatti con il valutatore del controllo Python (`scripts/exercises/checkers/_inf_foglio.py`): $2{,}5 \cdot 4 = 10$;
$10 + 12 + 35 = 57$; $(7 + 8 + 6) : 3 = 7$ e $7 + 8 + 6 : 3 = 17$; $21{,}6 : 2^3 = 2{,}7$; dopo il cambio $15$ e
$62$. Dal 3 ottobre al 25 dicembre 2026 passano 83 giorni (`datetime`).

## Scelte

- Nelle tabelle di esempio le lettere di colonna e i numeri di riga sono testo semplice, come nella lezione 26
  dell'altro gruppo; formule, indirizzi ed errori sono in codice in linea.
- Il riferimento circolare è descritto a parole ("il programma lo segnala con un avviso"): i programmi lo mostrano in
  modi diversi, e nessun codice è scritto nella lezione.
- Il meno davanti a una potenza (`=-2^2`) non compare: i fogli di calcolo danno 4 dove la matematica dà −4, e
  spiegarlo qui porterebbe fuori strada. Nemmeno gli esercizi lo usano.
- Niente operatore `&` per unire i testi, niente `%` come operatore, niente fila di cancelletti per la colonna
  stretta: si possono aggiungere se Andrea li vuole.
- La densità dell'alluminio ($2{,}7\,\text{g/cm}^3$) è quella dei libri di fisica.

## Da verificare

- Nomi degli errori nei programmi in italiano: `#DIV/0!`, `#VALORE!`, `#NOME?` sono quelli di Excel e di LibreOffice
  Calc in italiano (ricordati, non controllati su un programma installato). Fogli Google, a quanto ricordo, lascia i
  nomi in inglese (`#VALUE!`, `#NAME?`) anche con l'interfaccia in italiano: da verificare, e nel caso da dire nella
  lezione con una riga.
- Riferimento circolare: Excel mostra un avviso e 0 nella cella, LibreOffice l'errore `Err:522`, Fogli Google `#REF!`
  (ricordati, da verificare). Per questo il testo dice solo "un avviso".
- Un numero scritto con il punto in un programma in italiano "può essere letto come un testo o come una data":
  comportamento ricordato per Excel e LibreOffice (3.5 diventa il 3 maggio), da verificare.
- Allineamento predefinito: testo a sinistra, numeri a destra (vale nei tre programmi, da verificare).
- Le date come numero di giorni da un giorno di partenza: il giorno di partenza cambia da programma a programma
  (Excel 1900, LibreOffice 30 dicembre 1899), per questo non è scritto.

## Domande per Andrea

- La lezione va bene senza una schermata vera del programma (solo la griglia in TikZ)?
- Gli errori da presentare sono i quattro del brief: aggiungere `#RIF!` e la fila di cancelletti?
- Nell'esempio di fisica la formula è `=B1/B2^3`: va bene usare qui la densità, o è meglio un esempio senza unità?
