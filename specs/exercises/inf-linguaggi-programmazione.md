# inf-linguaggi-programmazione: Linguaggi, compilatori e interpreti

Lezione: `docs/lezioni/informatica/riscritte/51-inf-linguaggi-programmazione.md`. Lezione di concetto: tutti i livelli
sono a scelta multipla con opzioni di testo, composte da pezzi intercambiabili (`src/lib/exercises/v2/inf-primi.ts`).
Il controllo ricostruisce la risposta da tabelle sue (`scripts/exercises/checkers/inf_linguaggi_programmazione.py`).

Distrattori, dagli errori della lezione: la CPU che esegue il sorgente da sola; l'eseguibile che si aggiorna da solo
dopo una correzione; l'interprete che produce un file; il compilatore che si ferma solo alla riga sbagliata.

## Livelli

1. **Linguaggio macchina e alto livello.** Una frase sul linguaggio macchina tra tre su un linguaggio ad alto
   livello, o il contrario (metà e metà). 8 frasi per parte.
   Esempio: "Quale di queste frasi descrive il linguaggio macchina?" → "Ogni istruzione è una sequenza di bit".
2. **Le parole della traduzione.** Una situazione con un nome di persona e un programma ("il suo gioco", "la sua
   rubrica"): la parola tra codice sorgente, compilatore, interprete, programma eseguibile, linguaggio macchina,
   sintassi. 16 situazioni, 8 programmi, 12 nomi.
   Esempio: "Sara compila il suo quiz e sul disco compare un file nuovo, fatto solo di istruzioni per la CPU. Che
   cos'è quel file?" → "Il programma eseguibile".
3. **Compilatore o interprete.** Un fatto sul traduttore: è un compilatore (4 su 10), un interprete (4 su 10), oppure
   vale per tutti e due (2 su 10). La quarta opzione, sempre sbagliata, è "Nessun traduttore: la CPU esegue il
   sorgente da sola". 17 fatti.
   Esempio: "Luca lavora al testo del suo cronometro. La traduzione si rifà a ogni esecuzione. Quale traduttore sta
   usando?" → "Un interprete".
4. **Un nome scritto male.** Il conto della lezione: un programma di n istruzioni (da 4 a 9) che stampano una riga
   ciascuna, con il nome del comando scritto male nell'istruzione k (da 2 a n). Con un interprete (Python, "un
   linguaggio interpretato") escono k − 1 righe, con un compilatore (C++, "un linguaggio compilato") nessuna.
   Distrattori: l'altro traduttore, k, n, n − 1.
   Esempio: Python, 6 istruzioni, errore nella 4 → 3 righe.
5. **Vero o falso sui traduttori.** L'affermazione vera tra tre false, o la falsa tra tre vere (metà e metà). 12
   vere e 12 false.

## Da evitare

Domande di memoria su nomi di linguaggi o date; affermazioni vere solo per uno dei due modelli puri e presentate
come generali (la nota "Molti linguaggi stanno a metà" entra solo come affermazione vera).
