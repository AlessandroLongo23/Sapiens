# Note: Confrontare gli algoritmi contando le operazioni

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Ricerca e ordinamento", gruppo 6). Non pubblicata.

## Struttura

Apertura con venti squadre contro un milione di prodotti; contare al posto di cronometrare, con le bolle che restituiscono i confronti su tre vettori (caso migliore, peggiore, qualunque); la gara dei tre ordinamenti sullo stesso vettore, con la tabella per 12 elementi; la gara delle due ricerche; l'esperimento con n che raddoppia (programma, tabella, grafico) e le tre crescite; il conto su un milione di elementi e che cosa vuol dire "non regge"; quando conviene ordinare per poi cercare; due esercizi.

- 373 righe; circa 1400 parole fuori dai riquadri e dai programmi, in una quarantina di paragrafi e righe di tabella.
- Programmi da eseguire: 2 (le bolle con il contatore su tre vettori; la tabella con n da 100 a 1600), ciascuno in Python e in C++.
- Esercizi con le prove: 2 (contare i confronti della selezione con i soli due cicli; confronti di k ricerche sequenziali e binarie nel caso peggiore, con una funzione che conta i dimezzamenti).
- Figure interattive: 2 (`inf-gara-ordinamenti`, `inf-gara-ricerche`). Blocchi `grafico`: 1. Tabelle: 2. Riquadri `ad-warning`: 1.

## Scelte

- Niente notazione O grande, come da brief. Le tre crescite sono dette "cresce come $n$", "cresce come $\log_2 n$", "cresce come $n^2$" e definite da quello che succede quando $n$ raddoppia (raddoppia, aumenta di 1, diventa circa il quadruplo).
- L'operazione contata è il confronto tra elementi; scambi e spostamenti si leggono nella gara e nella tabella. Sul caso peggiore si ragiona solo con i confronti.
- Nella gara l'orologio è il confronto: a ogni passo ogni algoritmo mostra il vettore com'è dopo un confronto in più. Chi fa meno confronti finisce prima; gli scambi non allungano la corsa, e la lezione li commenta a parte. Le bolle corrono con la bandierina, e il testo lo dice.
- I conti della ricerca binaria nel caso peggiore sono "quante volte n si dimezza, con la divisione intera, prima di arrivare a 0" (100 → 7, 1000 → 10, un milione → 20): è il valore che la traccia del kit dà quando il valore è più grande di tutti, e coincide con il conto della 74.
- Il programma della tabella ordina davvero un vettore rovesciato e conta; per la ricerca binaria conta i dimezzamenti senza costruire il vettore. La colonna della ricerca sequenziale è solo nella tabella della lezione.
- Per stare in 400 righe gli esercizi non leggono vettori: leggono n (e k) e contano. Un esercizio "aggiungi il contatore alla selezione con il vettore letto" e uno sui confronti della ricerca binaria vera sono stati scritti e tolti per la lunghezza: restano adatti al generatore di esercizi.
- Il conto del tempo usa "cento milioni di confronti al secondo" come ipotesi dichiarata, non come dato su un computer vero.
- Il merge sort è nominato senza nome e senza link ("ne incontrerai uno al quarto anno").
- La 74 ha già una figura con le due ricerche fianco a fianco su dodici elementi: `inf-gara-ricerche` qui fa la stessa cosa con le corsie della gara e con la scelta di 6 o 12 elementi. Chi coordina può decidere di tenerne una sola.

## Verifiche

- `check.mts`: 0 errori, 0 avvisi su lezione, formulario e flashcard (il blocco `grafico` si legge).
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I due programmi senza prove eseguiti con `python3` e con `clang++ -Wall`: stessa uscita (5, 15, 14; la tabella da 100 a 1600). Nel browser il programma della tabella in Python finisce in circa 0,3 secondi.
- I numeri della tabella a 12 elementi vengono dalle tracce del kit, con il vettore "a caso" che la figura propone all'apertura (seme 4).
- Conti rifatti: $2^{20} = 1\,048\,576$; $10^6 \cdot (10^6 - 1) / 2 \approx 5 \cdot 10^{11}$; a $10^8$ confronti al secondo sono 5000 secondi, 83 minuti; $\sqrt{10} \approx 3{,}16$; con 1000 elementi l'ordinamento costa 499 500 confronti e si ripaga dopo circa 500 ricerche nel caso peggiore.

## Da verificare

- La riga "a caso" della tabella a 12 elementi dipende dal seme con cui la figura si apre: se si cambia il seme in `GaraOrdinamenti.tsx` va rifatta.
- "Vanno bene fino a qualche migliaio di elementi" è un ordine di grandezza ragionevole, non una misura.
- Nel grafico il bottone "Reset" del piano copre l'angolo in basso a sinistra, vicino all'origine: le curve si leggono lo stesso, ma l'angolo non è pulito.

## Domande per Andrea

- "Cresce come $n^2$" e "cresce come $\log_2 n$" vanno bene come parole, o al terzo anno preferisci "quadratico" e "logaritmico"?
- Il logaritmo qui è spiegato solo con i dimezzamenti, con il link alla lezione di matematica: al terzo anno gli studenti lo hanno già visto?
- Contare solo i confronti nel caso peggiore, e lasciare scambi e spostamenti alla tabella, è la scelta giusta, o vuoi anche il conto degli assegnamenti (tre per scambio)?
- Il caso medio degli ordinamenti non c'è: lo vuoi, almeno come riga della tabella?
- La gara conta un confronto per passo. Preferisci che un passo sia un'operazione qualunque (confronto o scambio)?

## Elementi interattivi

- `inf-gara-ordinamenti` (figura, `GaraOrdinamenti.tsx` con `gara.tsx`): sullo stesso vettore, quale dei tre ordinamenti fa meno confronti e quale sposta meno elementi? Risposta nel testo: la tabella per 12 elementi e il paragrafo che la legge.
- `inf-gara-ricerche` (figura, `GaraRicerche.tsx`): su 12 elementi in ordine, quanti confronti per trovare l'ultimo e per scoprire che un valore non c'è? Risposta: 12 contro 4, e 6 contro 3 con sei elementi.
- Programma con il contatore (codice, due linguaggi): lo stesso algoritmo fa lo stesso lavoro su tre ordini diversi degli stessi valori? Risposta: 5, 15 e 14.
- Programma della tabella (codice, due linguaggi): come cresce il conto quando n raddoppia? Risposta: la tabella e le tre crescite.
- Grafico `crescita-confronti-quadrato-lineare-logaritmo` (piano con un cursore): portando n da 8 a 16 a 32, quale valore raddoppia, quale quadruplica e quale aumenta di 1? Risposta nel paragrafo sotto il grafico.

Prerequisiti proposti: inf-bubble-sort, inf-insertion-sort, inf-selection-sort, inf-ricerca-binaria

## Revisione del lotto (7 ottobre 2026)

- Il primo programma in C++ usa `const int N = 6;` al posto del 6 scritto tre volte nelle dichiarazioni e nelle chiamate.
- "Caso migliore" e "caso peggiore" non sono più in grassetto: li definisce la 71, richiamata lì.
- La sezione sui tre ordinamenti non si apre più con una domanda; nella tabella a 12 elementi le coppie ("11 e 0") non vanno più a capo sul telefono.
- La tabella a 12 elementi e i conti delle due ricerche sono stati riletti sulla figura (seme 4): tornano tutti.
