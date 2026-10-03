# Note: Il file system: file, cartelle e percorsi

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il sistema operativo", 3 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Struttura ed esempi

I file; nome ed estensione, con la tabella delle estensioni; le cartelle e l'albero con la figura; i percorsi assoluti
(nelle due scritture) e relativi, con `..` e `.`; il procedimento da relativo ad assoluto in tre passi; le operazioni
sui file; la dimensione.

Cinque esempi svolti: tre sul procedimento (scendere, salire di un livello, salire di tre livelli con la barra
rovesciata), uno sulle operazioni (copia e rinomina), uno sulle dimensioni (una cartella in megabyte e quante foto
stanno in uno spazio).

Avvisi: cambiare l'estensione non cambia il formato; la barra iniziale cambia tutto. Una nota su maiuscole e minuscole.

## Conti

Rifatti con Python: i tre percorsi degli esempi (con la funzione del controllo, indipendente dal generatore);
40 · 250 = 10 000 kB = 10 MB; 30 : 4 = 7,5, quindi 7.

## Scelte

- "Cartella" come termine, con "directory" e "folder" tra parentesi; "percorso" con "path"; "radice".
- Le due scritture: `/home/anna/...` e `C:\Utenti\anna\...`. I nomi dei sistemi compaiono una volta, dove si
  presentano le due scritture.
- I nomi di file e cartelle sono in codice in linea, come vuole il README per i percorsi.
- Le dimensioni usano i multipli decimali (kB, MB, GB) con il fattore scritto; per i multipli binari c'è il link alla
  lezione 03.
- Formati dei file, compressione, permessi, collegamenti, file nascosti, formattazione e tipi di file system (FAT,
  NTFS, ext4) non ci sono: i formati sono di un capitolo del terzo anno.

## Fonti e cose da verificare

- `C:\Utenti`: nelle versioni italiane di Windows la cartella si vede con questo nome, ma il nome vero sul disco è
  `C:\Users`. Da decidere quale scrivere.
- La tabella delle estensioni: `.odt`, `.ods`, `.odp` sono i formati OpenDocument; `.docx`, `.xlsx`, `.pptx` quelli
  di Microsoft Office; `.exe` è l'eseguibile di Windows (nella tabella è "programma eseguibile", senza il nome del
  sistema). `.pdf` è classificato come documento di testo: semplificazione.
- "Spesso l'interfaccia grafica nasconde le estensioni": è l'impostazione predefinita di Windows e macOS, da
  verificare per le versioni di oggi.
- Maiuscole e minuscole: distinte in Linux, non distinte in Windows e, con le impostazioni predefinite, in macOS. Il
  testo dice "in alcuni sistemi", senza nomi.
- "Di solito finisce nel cestino": vale per l'interfaccia grafica; dalla riga di comando l'eliminazione è di solito
  definitiva. Il testo non lo dice.
- La radice `/` per Android: il sistema ha un file system di tipo Linux, ma l'utente di solito non vede la radice. Da
  decidere se togliere Android dall'elenco.

## Figura

`albero-delle-cartelle` (TikZ, 420 x 350 px): radice, home, due utenti, tre cartelle, una sottocartella, quattro file.
Cartelle con gli angoli arrotondati, file con gli angoli vivi, così la distinzione non dipende dal colore. Guardata in
chiaro e in scuro.

## Per il generatore

`inf-file-system`, sei livelli: nomi ed estensioni, dall'albero al percorso, da relativo ad assoluto, con i due punti,
dopo una copia, uno spostamento o una rinomina, dimensioni. L'ultimo ha risposta numerica. Negli esercizi i nomi sono
corti (cartelle di quattro lettere, file di otto caratteri) perché un percorso deve stare nel bottone della risposta
sul telefono: 28 caratteri. Specifica in `specs/exercises/inf-file-system.md`.

## Domande per Andrea

- `C:\Utenti` o `C:\Users`?
- La lezione è la più lunga del capitolo (149 righe): le dimensioni dei file restano qui o bastano nella lezione 03?
- `.pdf` tra i documenti di testo va bene?
