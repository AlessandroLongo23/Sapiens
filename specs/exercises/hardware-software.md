# Hardware e software

Generatore: `hardware-software` (`src/lib/exercises/v2/generators/hardware-software.ts`).
Verifica indipendente: `scripts/exercises/checkers/hardware_software.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/02-hardware-software.md` (note in `docs/lezioni/informatica/note/02-hardware-software.md`).
Aiuti condivisi del capitolo: `src/lib/exercises/v2/inf-informazione.ts` e `scripts/exercises/checkers/_inf_informazione.py`.

Cinque livelli, tutti a scelta multipla con quattro opzioni (`answer.kind = 'choice'`). La lezione è di concetto: ogni
domanda è composta da pezzi intercambiabili, e in quattro livelli su cinque si cerca l'unico pezzo di una classe tra tre
dell'altra.

## Nomi dei livelli

1. Hardware o software
2. Software di base o applicativo
3. Sistema operativo, driver, firmware, applicazione
4. Guasto hardware o problema software
5. Vero o falso su hardware e software

## Regole comuni

- Il testo sta in righe `\text{…}` scritte con `textBlock`; le opzioni sono `\text{…}`, su più righe con
  `\begin{gathered}` a righe di al più 24 caratteri quando sono più lunghe.
- Il valore di ogni opzione è il testo del pezzo, con l'iniziale minuscola: il controllo lo cerca nelle sue tabelle.
- Niente marchi: sistema operativo, browser, programma di videoscrittura. Niente trattini lunghi e niente "piuttosto che".

## Livello 1: hardware o software

"Quale di questi è hardware?" (un componente e tre programmi) oppure "Quale di questi è software?" (un programma e tre
componenti), metà e metà.

- Hardware: lo schermo, la tastiera, il mouse, la batteria, la memoria RAM, la CPU, la stampante, la webcam, il disco
  di un videogioco, una chiavetta USB, l'altoparlante, la scheda video, il caricatore, il microfono.
- Software: il browser, il sistema operativo, un videogioco scaricato, l'app del meteo, il programma di videoscrittura,
  il foglio di calcolo, il driver della stampante, l'app della fotocamera, l'antivirus, il firmware del router, l'app
  del registro elettronico, il programma per ritoccare le foto, l'app di messaggistica, il lettore musicale.

Gli errori veri sono dentro gli elenchi: la CPU e la RAM (stanno dentro e non si vedono), il disco di un videogioco
(l'oggetto, non il gioco), il driver e il firmware (software, anche se vicini all'hardware).

## Livello 2: software di base o applicativo

"Quale di questi programmi è software di base?" oppure "è software applicativo?", metà e metà.

- Di base: il sistema operativo del telefono, del portatile, del tablet, della console, della smart TV; il driver della
  stampante, della scheda video, del mouse, dello scanner, della webcam, della scheda audio. Regola del controllo: ogni
  "sistema operativo di…" e ogni "driver di…" è software di base.
- Applicativo: il browser, il programma di videoscrittura, il foglio di calcolo, un videogioco, l'app del registro
  elettronico, il programma per ritoccare le foto, l'app di messaggistica, il lettore musicale, l'app delle mappe, il
  programma per le presentazioni, l'app del meteo, il programma per montare i video.

## Livello 3: che tipo di software

La descrizione di un lavoro, poi "Che tipo di software è?". Le opzioni sono sempre le stesse quattro: Il sistema
operativo, Un driver, Il firmware, Un programma applicativo. Un quarto dei casi ciascuno; due frasi per tipo, con
dodici nomi e un dispositivo o un compito estratto.

- Driver: "Permette al sistema operativo di usare la stampante di Luca." / "Spiega al sistema operativo quali comandi
  capisce la webcam di Sara."
- Firmware: "È registrato in modo permanente in un chip del router di Anna ed è il primo programma che parte
  all'accensione." / "Chi ha costruito il dispositivo lo ha scritto in un chip di memoria della lavatrice di Marco, e lì
  resta anche a dispositivo spento."
- Sistema operativo: "Parte all'accensione del telefono di Elena e resta in esecuzione: assegna la CPU e la memoria agli
  altri programmi." / "Organizza i file e le cartelle del portatile di Pietro e mostra finestre e icone."
- Applicativo: "Chiara lo usa per scrivere un tema." / "Davide lo apre quando deve montare un video."

Il controllo riconosce il tipo da queste parole: "al sistema operativo" con "di usare" o "quali comandi capisce"
(driver); "in un chip" (firmware); "assegna la CPU e la memoria agli altri programmi" o "Organizza i file e le
cartelle" (sistema operativo); "lo usa per" o "lo apre quando deve" (applicativo). Una frase deve averne uno solo.

## Livello 4: guasto dell'hardware o problema del software

"Quale di questi problemi è un guasto dell'hardware, che nessun aggiornamento ripara?" oppure "Quale di questi problemi
è del software, e si risolve senza riparare o sostituire pezzi?", metà e metà.

- Hardware: lo schermo ha una crepa; la batteria non tiene più la carica; un tasto della tastiera si è rotto; la
  ventola fa rumore perché è consumata; la porta USB è piegata; il cavo del caricatore è spezzato; l'altoparlante
  gracchia dopo una caduta; il vetro della fotocamera è graffiato.
- Software: un'app si chiude da sola dopo l'aggiornamento; manca il driver della stampante nuova; un gioco si blocca
  sempre al terzo livello; il browser non apre un sito finché non lo aggiorni; il programma non apre i file del nuovo
  formato; il sistema operativo va aggiornato per sicurezza; l'app del registro mostra la media sbagliata; un programma
  ha un errore nei calcoli.

## Livello 5: vero o falso

"Quale di queste affermazioni è vera?" (una vera e tre false) oppure "è falsa?" (una falsa e tre vere), metà e metà.

- Vere: un programma è una sequenza di istruzioni; il firmware è software; senza software l'hardware non fa niente; la
  memoria RAM è hardware; il sistema operativo è software di base; un driver è un programma; il software si può copiare
  senza perderlo; il browser è software applicativo; il freeware è gratis ma non si può modificare; il software libero
  si può studiare e modificare; una foto è un dato, non un programma.
- False (gli avvisi della lezione): la CPU è software perché non si vede; il firmware è un pezzo di hardware; un driver
  è un componente della stampante; il software si consuma con gli anni; il sistema operativo è software applicativo;
  ogni programma gratuito è software libero; un videogioco è software di base; le app comandano l'hardware senza il
  sistema operativo; uno schermo crepato si ripara con un aggiornamento; il software di base è fatto di programmi
  semplici; il disco di un videogioco è software; una foto salvata nel telefono è un programma.

I passaggi dicono perché ogni affermazione falsa è falsa, con le parole della lezione.

## Esercizi da evitare

- Un pezzo che starebbe in tutte e due le classi (per questo "un videogioco scaricato" e "il disco di un videogioco"
  sono due pezzi distinti, e l'antivirus non compare al livello 2).
- Domande di memoria su marchi, date o nomi di prodotti.
- Due opzioni giuste: ogni domanda ha un solo pezzo della classe chiesta.

## Verifica

Il controllo ha le sue tabelle, riscritte da questa specifica: classifica ogni opzione, controlla che una sola sia
della classe chiesta dalla domanda e le altre tre dell'altra, che `correct` la indichi e che `params.case` dica lo
stesso; al livello 3 riconosce il tipo dalle parole della descrizione. Poi le quote dei casi.

## Domande per la revisione

- L'antivirus è tra i software al livello 1 ma non al livello 2, perché i libri non sono d'accordo se sia software di
  base (programma di utilità) o applicativo. Va bene lasciarlo fuori?
- Al livello 4 "il sistema operativo va aggiornato per sicurezza" è un problema del software: è chiaro per uno
  studente, o sembra una cosa normale e non un problema?
