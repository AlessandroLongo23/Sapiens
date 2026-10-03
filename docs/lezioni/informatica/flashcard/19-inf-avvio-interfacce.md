# Flashcard: Avvio del computer e interfacce utente

## perche-avvio
Perché a ogni accensione il sistema operativo va copiato nella RAM?
---
Perché la RAM è volatile: quando manca la corrente si svuota.

## firmware
Che cos'è il firmware?
---
Il programma registrato in un chip non volatile della scheda madre, che la CPU esegue per primo all'accensione.

## bios-uefi
Come si chiama il firmware dei computer?
---
BIOS nei modelli più vecchi, UEFI in quelli più recenti.

## avvio-definizione
Che cos'è l'avvio (boot)?
---
La sequenza di operazioni che porta il computer da spento a pronto per l'uso.

## fasi-ordine
Quali sono, in ordine, le cinque fasi dell'avvio?
---
Accensione con il firmware, autodiagnosi, ricerca del dispositivo di avvio, caricamento del nucleo, avvio di servizi e interfaccia.

## post
Che cosa fa il firmware durante l'autodiagnosi (POST)?
---
Controlla che CPU, RAM, scheda video e tastiera rispondano.

## bootloader
Che cosa fa il bootloader?
---
Copia il nucleo del sistema operativo nella RAM e gli passa il controllo.

## nessun-dispositivo
Compare il messaggio "nessun dispositivo di avvio trovato". In quale fase si è fermato l'avvio?
---
Nella ricerca del dispositivo di avvio: nessuna memoria di massa contiene un sistema operativo.

## firmware-sistema
Vero o falso: installando un altro sistema operativo cambia anche il firmware.
---
Falso. Il firmware sta sulla scheda madre e resta quello di prima.

## sospensione
Perché il risveglio dalla sospensione è molto più rapido di un avvio?
---
Perché la RAM resta alimentata e conserva il sistema operativo e i programmi aperti.

## interfaccia-utente
Che cos'è l'interfaccia utente?
---
La parte del sistema operativo con cui una persona dà i comandi e riceve le risposte.

## cli
Come si danno i comandi nell'interfaccia a riga di comando?
---
Si scrivono con la tastiera, uno per riga; il sistema risponde con del testo.

## prompt
Che cos'è il prompt?
---
La scritta con cui il sistema segnala che è pronto a ricevere un comando.

## comando-argomento
Nella riga `mkdir Storia`, qual è il nome del comando e qual è l'argomento?
---
Il nome del comando è `mkdir`, l'argomento è `Storia`.

## shell
Come si chiama il programma che legge la riga scritta e la esegue?
---
Interprete dei comandi, in inglese shell.

## gui-elementi
Quali sono i quattro elementi dell'interfaccia grafica?
---
Finestre, icone, menu e puntatore.

## ripetizioni
Quale interfaccia conviene per copiare 300 file con il nome che finisce allo stesso modo?
---
La riga di comando: una sola riga agisce su tutti i file.

## due-sistemi
Vero o falso: la riga di comando e le finestre sono due sistemi operativi diversi.
---
Falso. Sono due interfacce dello stesso sistema e agiscono sugli stessi file.
