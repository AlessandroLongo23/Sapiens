# Note: Ordinare, filtrare e riassumere i dati

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il foglio di calcolo", seconda metà, 3 ottobre
2026). `check.mts` passa senza errori su lezione, formulario e flashcard (20 carte).

## Struttura ed esempi

La tabella di dati (intestazione, record, campo, un dato per cella) e perché l'intestazione serve; ordinare su un
campo e su più livelli; filtrare con una e con due condizioni; i subtotali; la tabella pivot come tabella riassuntiva
che incrocia due campi, con la figura dei tre posti (righe, colonne, valori).

Una sola tabella per tutta la lezione, il mercatino delle classi prime (otto record: classe, prodotto, incasso), e
cinque esempi: ordinamento decrescente per incasso; due livelli (classe, poi incasso); un filtro, un altro filtro, i due
insieme; i subtotali per classe; la tabella pivot classi per prodotti.

Avvisi: righe vuote, celle unite e totali in mezzo ai dati; ordinare una colonna sola; un record nascosto non è
cancellato; prima si ordina e poi si chiedono i subtotali.

Link: "Le funzioni del foglio di calcolo" (per `SOMMA`) e "Condizioni e funzioni logiche" (i confronti dei filtri).

## Scelte

- "Record" e "campo" sono introdotti qui, perché tornano nelle basi di dati del quarto anno; "tabella di dati" è il
  nome scelto per quello che i libri chiamano anche elenco o database del foglio.
- I comandi sono descritti senza i nomi dei menu di un programma ("nel menu dei dati"), per la regola dei marchi.
- `SUBTOTALE(9;…)` compare in un riquadro `ad-note`, come risposta al dubbio "perché la somma non cambia dopo il
  filtro". Non è tra le funzioni elencate nel README: se è troppo, il riquadro si toglie e resta l'avviso.
- Le tabelle degli esempi 1-4 hanno lettere di colonna e numeri di riga; nell'esempio 3 i numeri di riga saltano, come
  nel foglio filtrato. La tabella pivot dell'esempio 5 è scritta senza lettere e numeri, perché è un oggetto a parte.
- Niente filtri avanzati, niente media nei subtotali, niente campi filtro o più campi nelle righe della pivot.

## Conti

Rifatti in Python (`/tmp/informatica-cap6b/conti28.py`): totale 198; ordine decrescente 42, 36, 30, 25, 20, 18, 15,
12; due livelli 1A (42, 20, 18), 1B (36, 30, 15), 1C (25, 12); filtro 1B: righe 2, 6, 9; filtro maggiore di 20: righe
2, 4, 5, 6; insieme: righe 2 e 6; subtotali 80, 81, 37; prodotti: bibite 45, panini 56, torte 97; conteggi 3, 3, 2.

## Da verificare

- `=SUBTOTALE(9;C2:C9)` somma solo le righe lasciate visibili da un filtro: è così in Excel (pagina di supporto
  Microsoft "Funzione SUBTOTALE") e in LibreOffice Calc; il nome italiano è SUBTOTALE in entrambi. Da provare.
- Il comando dei subtotali esiste in Excel (Dati, Subtotale) e in LibreOffice Calc (Dati, Subtotali); in Fogli Google
  non c'è un comando uguale. La lezione dice "nel menu dei dati": da decidere se dirlo.
- "Se i dati cambiano, va aggiornata con il suo comando": vero in Excel e in LibreOffice Calc; in Fogli Google la
  tabella pivot si aggiorna da sola. Da verificare.
- "Il foglio considera finita la tabella alla prima riga vuota": è il comportamento della selezione automatica
  dell'intervallo quando si fa clic su una cella sola; da provare nei tre programmi.
- I dati del mercatino sono inventati.

## Domande per Andrea

- "Tabella pivot" o "tabella riassuntiva (pivot)"? LibreOffice l'ha chiamata a lungo "DataPilot"; la lezione usa
  solo "tabella pivot".
- L'esempio 4 mostra i subtotali come li scrive il foglio (righe "Totale 1A"): va bene o confonde con i record?
