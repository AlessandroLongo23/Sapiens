# Note: Hardware e software

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Informatica e informazione", 3 ottobre 2026).
`check.mts` passa senza errori e senza avvisi sulla lezione, sul formulario e sulle flashcard (20 carte).

## Struttura ed esempi

L'hardware; il software e il programma; software di base e applicativo, con la figura degli strati; driver e firmware;
guasti dell'hardware e problemi del software, con la tabella di confronto; le licenze, in breve.

Quattro esempi svolti: hardware o software in un portatile; il disco e il gioco; che cosa succede quando si scatta
una foto (gli strati); la stampante nuova che non stampa (il driver).

Avvisi: hardware non vuol dire "quello che si vede da fuori"; software di base non vuol dire "programmi semplici";
firmware e driver sono software; il software non si consuma; gratis non vuol dire libero. Una nota: i documenti non
sono programmi.

## Figure

Una figura TikZ, `strati-hardware-software`, guardata in chiaro e in scuro: utente, software applicativo, software di
base, hardware, con frecce a due punte.

## Scelte

- Software è "l'insieme dei programmi"; documenti, foto e musica sono dati e non software. Alcuni libri mettono i dati
  dentro il software: vedi la domanda per Andrea.
- I componenti (CPU, RAM, memoria di massa, periferiche) sono nominati in una frase, con i link al capitolo
  sull'architettura; il sistema operativo ha due frasi e il link alla lezione 18.
- Il firmware è presentato come software, con l'avviso; BIOS e UEFI non sono nominati (li tratta la lezione
  sull'avvio).
- I programmi di utilità (antivirus, compressione, backup) non sono classificati: i libri li mettono ora nel software
  di base ora nell'applicativo.
- Licenze: tre voci (proprietario, libero o open source, freeware) e un avviso. La lezione "Diritto d'autore e
  licenze" è del secondo anno e non si può ancora linkare. Shareware, versioni di prova e copyleft sono rimasti fuori.
- I nomi dei prodotti compaiono una volta: cinque sistemi operativi, tre programmi liberi.

## Lasciato ad altre lezioni

La macchina di von Neumann, CPU, memorie, bus e periferiche (lezioni 13-17); le funzioni del sistema operativo, l'avvio,
i processi, il file system (lezioni 18-22). Linguaggi, codice sorgente e compilatori sono del secondo anno: per questo
la lezione dice "le istruzioni scritte dai programmatori" e non "codice sorgente".

## Fonti da verificare

- "Hardware" in inglese vuol dire ferramenta: uso comune, da verificare su un dizionario.
- Linux, LibreOffice e Firefox come software libero: le licenze sono GPL, MPL e MPL; da verificare prima della
  pubblicazione.
- Software libero e open source sono dati come sinonimi. Free Software Foundation e Open Source Initiative danno
  definizioni diverse, che in pratica coprono quasi gli stessi programmi: per una prima lezione li ho uniti.
- "Se un vecchio computer sembra più lento, di solito è perché i programmi nuovi chiedono più memoria": è una
  semplificazione, da rivedere.

## Per il generatore

`hardware-software`, cinque livelli, tutti a scelta multipla (specifica in `specs/exercises/hardware-software.md`).

## Domande per Andrea

- I dati (documenti, foto) sono software o no? La lezione dice di no. Che cosa dice il libro che usate?
- Software libero e open source come sinonimi: va bene al primo anno?
- Il firmware va nel software di base, o resta una categoria a parte come nella lezione?
- Le licenze in questa lezione sono poche righe: bastano, o vanno tolte e lasciate al secondo anno?
- Antivirus e programmi di utilità: software di base o applicativo?
