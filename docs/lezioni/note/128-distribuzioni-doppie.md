# Note: Distribuzioni doppie

Lezione nuova, scritta da zero (lotto del terzo anno, gruppo G). Tutti i numeri di lezione, formulario e carte sono stati ricalcolati con Python (frazioni esatte, script `verifica.py` nella cartella temporanea del gruppo): totali, frequenze relative congiunte e condizionate, medie condizionate, frequenze teoriche, contingenze e loro somme per riga e per colonna, la tabella completata dell'esempio 6. Le tre figure sono generate dallo stesso script dei dati (`gen.py`) e sono state guardate in chiaro e in scuro.

## Scelte

- Confine con la 129: qui le tabelle a doppia entrata, le distribuzioni marginali e condizionate, le medie condizionate (esempio 3, che prepara la 129) e l'indipendenza con frequenze teoriche e contingenze. Il diagramma a dispersione, la covarianza, la retta e $r$ sono tutti nella 129.
- Un esempio guida per tutta la teoria: 50 studenti, dove abitano (centro, periferia) e come vengono a scuola (a piedi, autobus, motorino). Torna nell'esempio 5 per frequenze teoriche e contingenze. Le modalità sono scelte senza lettere accentate, perché compaiono nelle figure TikZ.
- Totale delle unità indicato con $n$, come nelle lezioni 56 e 57. La 55 usa $N$ (e $f_a$, $f_r$ per le frequenze): le tre lezioni del primo anno non sono coerenti tra loro, e ho seguito le due più vicine all'argomento.
- Simboli usati solo nella sezione sull'indipendenza: $f_{ij}$ per la frequenza congiunta, $r_i$ e $c_j$ per i totali di riga e di colonna. Sono scelti per essere leggibili; i libri scrivono di solito $n_{ij}$, $n_{i \cdot}$, $n_{\cdot j}$ (o $n_{i0}$, $n_{0j}$).
- La distribuzione condizionata si scrive $Y \mid X = \text{periferia}$.
- L'equivalenza tra "distribuzioni condizionate uguali" e $f_{ij} = r_i c_j / n$ è dimostrata nei due versi, a parole e con i tre simboli, senza sommatorie.
- Le coppie di modalità si scrivono con la virgola, (periferia, autobus), come le coordinate dei punti dopo la correzione al brief.
- Nessun blocco `grafico`, confermato nella fase 3: la lezione lavora su tabelle e barre, non c'è una curva o una retta da muovere. Il "cosa succede se" che avrebbe senso (cambiare una casella e vedere frequenze teoriche e contingenze che si aggiornano) chiede una tabella con i numeri che cambiano, che il blocco non fa.
- Niente collegamento con la probabilità condizionata: la sua lezione è del quarto anno e non si può linkare.

## Domande per Andrea

1. Il chi quadrato va in questa lezione? L'ho solo nominato in un riquadro `ad-note` in fondo ("questa lezione non lo tratta"). Diversi libri del terzo anno lo calcolano subito dopo le contingenze, insieme all'indice normalizzato. Aggiungerlo costa una sezione e un esempio.
2. Notazione: vanno bene $f_{ij}$, $r_i$, $c_j$, oppure si preferisce quella dei libri ($n_{ij}$, $n_{i \cdot}$, $n_{\cdot j}$)? E "caratteri dipendenti, o connessi": si tiene la parola "connessione"?
3. I nomi "tabella di contingenza" (due caratteri qualitativi) e "tabella di correlazione" (due quantitativi) sono dati in un riquadro `ad-note` come "i nomi che trovi sui libri". Alcuni testi usano "tabella di contingenza" per ogni tabella a doppia entrata e aggiungono la "tabella mista": da verificare con il libro in uso.
4. Le medie condizionate stanno bene qui, come sottosezione con un solo esempio, oppure vanno nella 129 come introduzione alla regressione?
5. Serve un esempio con un carattere quantitativo raggruppato in classi (per esempio altezze in classi per sesso)? Non l'ho messo.

## Da verificare

- La 55 e la 56-57 usano simboli diversi per il totale e per la frequenza assoluta ($N$, $f_a$ contro $n$, $f_i$): andrebbe deciso una volta per tutte.
- Nell'esempio 2 (esercizi fatti e sufficienza) e nell'avviso "dipendenti non vuol dire che uno causa l'altro" i dati sono inventati, come tutti quelli della lezione.
- Nella figura delle barre il tratto del $5\%$ è troppo stretto per l'etichetta, che è stata omessa; il valore è nel testo, nella tabella sopra e nel testo alternativo.

Prerequisiti proposti: statistica-dati, statistica-medie
