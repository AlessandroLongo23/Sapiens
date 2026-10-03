# Ordinare, filtrare e riassumere i dati

Generatore: `inf-analisi-dati` (`src/lib/exercises/v2/generators/inf-analisi-dati.ts`).
Verifica indipendente: `scripts/exercises/checkers/inf_analisi_dati.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/28-inf-analisi-dati.md`. Aiuti comuni: `src/lib/exercises/v2/inf-foglio-dati.ts` e
`scripts/exercises/checkers/_inf_foglio_dati.py`.

Sei livelli, nell'ordine della lezione, tutti su una tabellina generata con l'intestazione nella riga 1. Il controllo
rilegge la tabella e l'operazione dal testo, la esegue sulle righe e confronta il risultato.

## Nomi dei livelli

1. Ordinare su una colonna
2. Ordinare su due livelli
3. Filtrare
4. Due filtri insieme
5. I subtotali
6. La tabella pivot

## Regole comuni

- Il foglio è un `array` con la riga delle lettere di colonna e la colonna dei numeri di riga; i dati cominciano dalla
  riga 2. Colonna `A`: un'etichetta diversa per ogni riga (nome, prodotto); colonna `B`: un gruppo tra tre, ognuno
  presente almeno una volta; colonna `C`: un numero intero, diverso per ogni riga. Quattro temi: punti di un torneo tra
  classi, pezzi venduti in tre negozi, gol di tre squadre, acquisti in tre città.
- Etichette e gruppi sono senza accenti e con la sola iniziale maiuscola (o una cifra e una lettera, come 1B), così
  l'ordine alfabetico è quello dei caratteri.
- Testo in righe `\text{…}`, riferimenti in `$\texttt{A4}$`. Niente trattini lunghi e niente "piuttosto che".
- Le risposte sono numeri (una riga, un conteggio, una somma), con la scelta multipla costruita sugli errori tipici, o
  un'etichetta della colonna `A` tra quattro.

## Livello 1: ordinare su una colonna

Cinque righe. "Si ordina la tabella secondo la colonna `C` (Punti), in ordine crescente / decrescente", oppure secondo
la colonna `A`, in ordine alfabetico dalla A alla Z o dalla Z alla A (circa un caso su tre). Due domande:

- cella (circa 55%): "Dopo l'ordinamento, che cosa c'è nella cella `A4`?" Risposta: un'etichetta. Distrattori: quella
  che ci sarebbe con il verso opposto, quella che c'è ora, le altre.
- riga (circa 45%): "Dopo l'ordinamento, in quale riga del foglio si trova Marta?" Risposta: un numero da 2 a 6.
  Distrattori: il posto senza contare l'intestazione, la riga con il verso opposto, la riga attuale.

La risposta deve essere diversa da quella che si ha senza ordinare.

- Euro 50, 10, 80, 65, 20, decrescente: nella cella `A2` c'è il cliente degli 80 euro.
- Gol 1, 0, 9, 3, 13, crescente: chi ha 9 gol è al quarto posto, nella riga 5.

## Livello 2: ordinare su due livelli

Sei righe. "Si ordina la tabella su due livelli: prima secondo la colonna `B` (Classe), in ordine alfabetico dalla A
alla Z; poi secondo la colonna `C` (Punti), in ordine decrescente." Il primo livello è sempre il gruppo (dalla Z alla A
in un caso su cinque); il secondo i numeri (tre casi su quattro) o le etichette della colonna `A`. Stesse due domande
del livello 1. La risposta deve cambiare se si dimentica il primo livello.

- Squadre Rossi, Verdi, Blu, Verdi, Verdi, Rossi con gol 9, 1, 15, 12, 3, 10; squadra dalla A alla Z, gol
  decrescenti: l'ordine è Blu 15; Rossi 10, 9; Verdi 12, 3, 1. Chi ha 9 gol è nella riga 4.
- Distrattore tipico: la riga 5, quella che si ottiene ordinando solo per gol.

## Livello 3: filtrare

Sei righe. "Si applica un filtro che mostra solo le righe in cui Punti è maggiore di 12", oppure minore di, maggiore o
uguale a, minore o uguale a (la soglia è uno dei numeri della tabella, non il più piccolo né il più grande, così il
valore di confine conta), oppure "Classe è uguale a 1B", "è diverso da 1B". Due domande:

- quante: "Quante righe di dati restano visibili, senza contare l'intestazione?" Distrattori: il conto con il confine
  preso al contrario, le righe nascoste, tutte le righe.
- quale: "Quale di queste righe resta visibile?" Quattro etichette, una sola di una riga visibile (solo quando le righe
  nascoste sono almeno tre).

Esempi: gol 5, 8, 11, 6, 15, 12 con "Gol è maggiore o uguale a 11": restano 3 righe. Squadra uguale a Verdi con Verdi
nelle righe 4 e 6: restano 2 righe.

## Livello 4: due filtri insieme

Sette righe. "Si applicano due filtri insieme: Classe è uguale a 1B e Punti è maggiore di 16." Si chiede quante righe
restano. I due filtri devono contare tutti e due: il risultato è minore di quello di ciascun filtro da solo. Il
risultato zero è ammesso, in pochi casi (circa uno su sette). Distrattori: le righe che rispettano almeno una
condizione, solo la prima, solo la seconda.

- Negozio Porto nelle righe 2 e 7, Pezzi maggiore o uguale a 46 nelle righe 2 e 5: resta 1 riga.
- Classe 1C solo nella riga 7 con 27 punti, Punti minore o uguale a 22: restano 0 righe.

## Livello 5: i subtotali

Sette righe. "Si ordina la tabella secondo la colonna `B` (Classe) e si inseriscono i subtotali, che a ogni cambio di
Classe calcolano la somma della colonna `C` (Punti)", oppure "il conteggio delle righe". Tre casi:

- somma (circa 55%): "Quanto vale il subtotale del gruppo 1B?";
- conteggio (circa 25%): la stessa domanda con il conteggio;
- totale (circa 20%): "Quanto vale il totale complessivo, in fondo alla tabella?"

Distrattori: i subtotali degli altri gruppi, il totale, il conteggio al posto della somma.

- Blu 5, 11, 6; Rossi 15, 12; Verdi 8, 13: subtotale di Rossi 27; totale complessivo 70.
- Con il conteggio: subtotale del gruppo Blu 3.

## Livello 6: la tabella pivot

Otto righe, senza etichette: colonna `A` con due valori (due negozi, due classi, due squadre, due sedi), colonna `B`
con tre (mesi, prodotti, gare, giorni), colonna `C` un multiplo di 10 da 10 a 90. Tutte e sei le combinazioni compaiono
una volta, due di esse due volte. "Dal foglio si costruisce una tabella pivot con Negozio nelle righe, Mese nelle
colonne e la somma di Incasso nei valori." Tre domande:

- incrocio (circa metà): "Quale numero c'è all'incrocio tra la riga Centro e la colonna feb?", più spesso su un
  incrocio con due righe da sommare;
- totale di riga, totale di colonna (circa un quarto ciascuno).

Distrattori: il totale della riga, quello della colonna, una sola delle righe dell'incrocio, il totale complessivo.

- Centro feb 60 e 60: all'incrocio c'è 120.
- Centro: 50, 60, 60, 60: il totale della riga Centro è 230.

## Esercizi da evitare

- Numeri ripetuti nella colonna `C` (l'ordinamento non sarebbe determinato) ed etichette ripetute nella colonna `A`.
- Una soglia di filtro che non è un valore della tabella, o che è il minimo o il massimo.
- Due filtri di cui uno non cambia il risultato.
- Una tabella pivot con una combinazione mancante (la cella sarebbe vuota).

## Verifica

Il controllo rilegge la tabella, riconosce l'operazione dal testo (colonne e versi dell'ordinamento, condizioni dei
filtri, funzione dei subtotali, campi della pivot), la esegue con un ordinamento stabile, un filtro o una somma per
gruppi, e confronta: l'etichetta della cella chiesta, il numero della riga, il conteggio, la somma. Controlla anche i
vincoli (righe, etichette e numeri diversi, tre gruppi, soglia presa dalla tabella, risposta che cambia senza il primo
livello) e le quote dei casi.

## Domande per la revisione

- I subtotali con la media non ci sono, perché darebbero numeri con la virgola: si vogliono?
- La tabella pivot è solo letta, a partire dai dati: va bene per il primo anno?
