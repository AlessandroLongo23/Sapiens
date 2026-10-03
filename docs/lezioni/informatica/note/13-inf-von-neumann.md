# Note: La macchina di von Neumann

Lezione nuova (3 ottobre 2026), prima del capitolo "L'architettura del computer". Non esisteva un originale.

## Struttura ed esempi

Il programma memorizzato (programma, istruzione, le due conseguenze: si cambia lavoro caricando un altro programma, un
programma è un dato); i quattro blocchi con la figura; il viaggio di un dato in sei passi; una tabella che rimanda alle
altre lezioni del capitolo.

Quattro esempi svolti: i blocchi in un telefono mentre si scrive un messaggio; la calcolatrice che fa 7 + 5, passo per
passo; il salto in un videogioco, con i quattro passaggi sul bus; la lavatrice, cioè lo stesso schema senza tastiera e
senza schermo (anticipa la lezione 17).

Avvisi: le istruzioni non stanno nella CPU; il disco non è la memoria centrale; il bus non elabora e non conserva.

## Scelte

- Quattro blocchi: CPU, memoria centrale, periferiche, bus. È lo schema dei libri italiani del biennio. La relazione di
  von Neumann elenca invece cinque parti (aritmetica, controllo, memoria, ingresso, uscita) più un supporto esterno di
  registrazione, e non parla di bus: nella lezione non lo dico, per non mettere due schemi diversi davanti a chi
  comincia.
- Le memorie di massa stanno tra le periferiche, come fanno molti libri. L'avviso "Il disco non è la memoria centrale"
  lo dice in modo esplicito, e il generatore lo chiede al livello 1.
- "Il viaggio di un dato" in sei passi è una semplificazione: in una macchina vera il trasferimento da una periferica
  alla memoria è comandato dalla CPU, e un dato può passare da un registro prima di arrivare in memoria. Lo schema
  serve a fissare chi fa che cosa; il ciclo vero è nella lezione 14.
- Lo schermo tattile è usato come esempio di periferica che è di ingresso e di uscita.
- RAM compare come "il nome che trovi sullo schermo"; la differenza con la ROM è della lezione 15.
- La frase finale dice "processori che contengono più unità di calcolo" senza la parola core, che è definita nella
  lezione 14.

## Fonti

- John von Neumann, "First Draft of a Report on the EDVAC", Moore School of Electrical Engineering, University of
  Pennsylvania, datato 30 giugno 1945. È la "relazione sul progetto del calcolatore EDVAC" del testo. Titolo e anno
  sono sicuri; il giorno è da verificare.
- "Per passare da un calcolo a un altro bisognava spostare cavi e interruttori, un lavoro che poteva durare giorni": è
  quello che si racconta dell'ENIAC (University of Pennsylvania, presentato nel febbraio 1946). Nel testo non nomino
  l'ENIAC e dico "i primi calcolatori elettronici degli anni Quaranta". La durata "giorni" è da verificare su una
  storia dell'ENIAC (per esempio Haigh, Priestley, Rope, "ENIAC in Action", MIT Press, 2016).
- L'idea del programma memorizzato era discussa nel gruppo dell'ENIAC e dell'EDVAC (J. Presper Eckert, John Mauchly)
  prima della relazione, che porta solo il nome di von Neumann: per questo gli storici discutono a chi attribuirla. Il
  testo dice "descrisse", non "inventò". Da verificare se si vuole una riga in più.
- Il primo programma memorizzato eseguito da una macchina elettronica: Manchester "Baby", 21 giugno 1948. Non è nel
  testo; da verificare prima di aggiungerlo.

## Figura

- `macchina-von-neumann-blocchi` (TikZ): CPU, memoria centrale, periferiche in riga, il bus sotto come barra, frecce a
  due punte; due frecce "ingresso" e "uscita" sopra le periferiche. Guardata in chiaro e in scuro.

## Per il generatore

`inf-von-neumann`, cinque livelli a scelta multipla (specifica in `specs/exercises/inf-von-neumann.md`): a quale blocco
appartiene, il compito di ogni blocco, il viaggio di un dato, il programma memorizzato, l'ordine dei passi.

## Domande per Andrea

- Quattro blocchi con le memorie di massa tra le periferiche: è lo schema del vostro libro, o le memorie di massa hanno
  un blocco a parte?
- Il viaggio di un dato in sei passi, con il dato che dalla periferica va in memoria centrale: va bene come modello per
  la prima, o si preferisce far passare tutto dalla CPU?
- Serve un cenno all'architettura Harvard (programmi e dati in memorie separate), che alcuni libri mettono a confronto?
  Qui non c'è; nel generatore "programmi e dati stanno in due memorie separate" è un'affermazione falsa per la macchina
  di von Neumann.
