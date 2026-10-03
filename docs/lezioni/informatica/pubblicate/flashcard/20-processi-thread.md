# Flashcard: Processi, thread e multitasking

## programma
Che cos'è un programma?
---
Un elenco di istruzioni conservato in un file, nella memoria di massa.

## processo
Che cos'è un processo?
---
Un programma in esecuzione: le istruzioni nella RAM, i suoi dati e il punto a cui è arrivato.

## due-volte
Apri due volte lo stesso programma. Quanti processi ci sono?
---
Due, ciascuno con i suoi dati.

## multitasking
Che cos'è il multitasking?
---
La capacità del sistema operativo di tenere in esecuzione più processi nello stesso periodo.

## quanto
Che cos'è il quanto di tempo?
---
Il breve intervallo per cui un processo riceve la CPU prima che passi a un altro.

## stati-elenco
Quali sono i tre stati di un processo?
---
Pronto, in esecuzione, in attesa.

## pronto
Che cosa manca a un processo pronto per proseguire?
---
Solo la CPU, che in quel momento è occupata.

## in-attesa
Quando un processo è in attesa?
---
Quando non può proseguire finché non succede qualcosa: arriva un dato, il disco risponde, l'utente preme un tasto.

## quanto-scaduto
Un processo è in esecuzione e il suo quanto scade. In quale stato passa?
---
Pronto: torna in fondo alla coda.

## attesa-pronto
Un processo in attesa riceve il dato che aspettava. In quale stato passa?
---
Pronto, non in esecuzione: si rimette in coda per la CPU.

## richiesta
Un processo in esecuzione chiede di leggere un file dal disco. In quale stato passa?
---
In attesa, finché la lettura non è completata.

## scheduler
Che cosa fa lo scheduler?
---
Decide a quale dei processi pronti assegnare la CPU.

## round-robin
Nel round robin, che cosa succede a un processo che non ha finito quando il quanto scade?
---
Viene interrotto e torna in fondo alla coda dei pronti.

## finisce-prima
Quanto di $4\,\text{ms}$; a un processo servono ancora $2\,\text{ms}$. Quanto dura il suo turno?
---
$2\,\text{ms}$: quando finisce lascia subito la CPU.

## tempo-in-coda
Un processo chiede $5\,\text{ms}$ di CPU e finisce all'istante $13\,\text{ms}$. Quanto tempo ha passato in coda?
---
$13 - 5 = 8\,\text{ms}$.

## cambio-contesto
Che cos'è il cambio di contesto?
---
Salvare il punto a cui è arrivato il processo che esce e ripristinare quello del processo che entra.

## quanto-lungo
Che cosa succede se il quanto è troppo lungo?
---
Il round robin diventa una fila ordinaria: un processo breve aspetta che quelli davanti abbiano finito.

## thread
Che cos'è un thread?
---
Una sequenza di istruzioni che avanza per conto suo all'interno di un processo.

## thread-memoria
Vero o falso: i thread di uno stesso processo hanno ciascuno una memoria separata.
---
Falso. Condividono la memoria del processo; sono i processi diversi ad avere memorie separate.
