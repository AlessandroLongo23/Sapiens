# Note: Avvio del computer e interfacce utente

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il sistema operativo", 3 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Struttura ed esempi

Perché serve una procedura di avvio (RAM volatile, sistema operativo nella memoria di massa, firmware); le cinque fasi
con la figura; l'interfaccia utente; la riga di comando (prompt, comando e argomenti, interprete), con una tabella di
quattro comandi; l'interfaccia grafica (finestre, icone, menu, puntatore); una tabella di confronto.

Tre esempi svolti: che cosa si vede e che cosa succede; capire dove si è fermato l'avvio (tre guasti); lo stesso
lavoro nei due modi (una cartella da creare, 300 foto da copiare).

Avvisi: il firmware non è il sistema operativo; la riga di comando non è un altro sistema operativo; l'interfaccia non
è tutto il sistema. Una nota su riavvio e sospensione.

## Scelte

- Cinque fasi: accensione e firmware, autodiagnosi, ricerca del dispositivo di avvio, caricamento del nucleo, avvio di
  servizi e interfaccia. Alcuni libri ne danno tre (POST, bootstrap, caricamento del sistema).
- "Avvio" come termine, con "boot" e "bootstrap" tra parentesi; "firmware" e "bootloader" restano in inglese;
  "interprete dei comandi" con "shell" tra parentesi.
- I comandi veri (`dir`, `ls`, `cd`, `mkdir`, `copy`, `cp`) compaiono in una tabella, come esempi, con i nomi dei
  sistemi una volta sola nell'intestazione. Negli esercizi non si chiedono.
- L'interfaccia a tocco è presentata come interfaccia grafica usata con le dita, non come un terzo tipo. Le interfacce
  vocali non sono trattate.
- La RAM volatile e la memoria di massa: solo il link alla lezione 15.

## Fonti e cose da verificare

- BIOS nei computer più vecchi e UEFI nei più recenti: senza date nel testo. Le sigle sono sciolte come "Basic
  Input/Output System" e "Unified Extensible Firmware Interface". Da verificare la grafia ufficiale di UEFI (UEFI
  Forum).
- POST, "Power-On Self-Test": sigla nota, da verificare sul libro in adozione.
- "Bootstrap" dall'espressione inglese sul sollevarsi tirandosi per i lacci degli stivali: etimologia riportata a
  memoria, da verificare (per esempio sull'Oxford English Dictionary).
- Il firmware cerca il dispositivo "in un ordine fissato nelle sue impostazioni" e il bootloader sta "all'inizio di
  quella memoria di massa": è la descrizione dell'avvio con il BIOS; con UEFI il bootloader è un file in una
  partizione apposita. La lezione non entra nel dettaglio: da decidere se va bene.
- I segnali acustici dell'autodiagnosi: tipici dei computer fissi, molti portatili recenti usano lampeggi. Il testo
  dice "con un messaggio o con una serie di segnali acustici".
- `cp *.jpg Documenti/Storia`: comando controllato a mano (copia nella cartella i file che finiscono con .jpg).
- La sospensione tiene alimentata la RAM: corretto per la sospensione; l'ibernazione, che scrive la RAM su disco, non
  è nominata.

## Figura

`fasi-avvio-computer` (TikZ): le cinque fasi in colonna con chi lavora in ciascuna (firmware, bootloader, nucleo).
Guardata in chiaro e in scuro (399 x 281 px).

## Per il generatore

`inf-avvio-interfacce`, cinque livelli a scelta multipla: la fase da una frase, l'ordine delle fasi, vero o falso
sull'avvio, gli elementi delle interfacce, riga di comando o grafica. Specifica in
`specs/exercises/inf-avvio-interfacce.md`.

## Domande per Andrea

- Cinque fasi o lo schema del libro?
- La tabella dei comandi con i nomi dei sistemi nell'intestazione rispetta la regola "nomi come esempi, una volta"?
- Serve una figura per le due interfacce (una riga di comando disegnata accanto a una finestra)?
