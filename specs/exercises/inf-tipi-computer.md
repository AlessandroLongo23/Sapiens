# Computer, dispositivi mobili e sistemi embedded

Generatore: `inf-tipi-computer` (`src/lib/exercises/v2/generators/inf-tipi-computer.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_tipi_computer.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/17-inf-tipi-computer.md`. Macchinario comune del capitolo:
`src/lib/exercises/v2/inf-architettura.ts` e `scripts/exercises/checkers/_inf_architettura.py`.

Quattro livelli, tutti a scelta multipla con quattro opzioni (`answer.kind = 'choice'`), composti da pezzi
intercambiabili (lavori, oggetti, affermazioni, sensori e attuatori). La lezione è di concetto e non ha conti.

## Nomi dei livelli

1. Quale computer per quale lavoro
2. Embedded o no
3. Che cosa cambia e che cosa resta
4. I blocchi in un sistema embedded

## Regole comuni

- Le famiglie sono cinque, scritte così nelle opzioni: Supercomputer, Server, Personal computer, Dispositivo mobile,
  Sistema embedded.
- Testo in righe `\text{…}` di circa 46 caratteri; opzioni più lunghe di 24 caratteri su più righe con
  `\begin{gathered}`. Niente trattini lunghi e niente "piuttosto che".
- Niente numeri che invecchiano: nessuna potenza, capacità o prezzo.

## Livello 1: quale computer per quale lavoro

"Quale tipo di computer è il più adatto per {lavoro}?" oppure "Serve un computer per {lavoro}. Di quale tipo sarà?"
La famiglia è scelta per prima, un quinto dei casi ciascuna; le opzioni sono la famiglia giusta e tre delle altre
quattro. Dieci lavori per famiglia, dodici per i sistemi embedded:

- Supercomputer: calcoli enormi da dividere tra migliaia di processori (previsioni del tempo di tutta l'Europa, clima
  dei prossimi cento anni, nascita di una galassia, proteine per un farmaco, aria attorno a un aereo, terremoto su una
  città, dati di un esperimento di fisica, correnti dell'Atlantico, una diga, il traffico di una regione).
- Server: un servizio a molti attraverso la rete (registro elettronico, posta di una scuola, sito web, partite in rete,
  streaming, file condivisi di un ufficio, prenotazioni dei treni, enciclopedia in rete, messaggistica, copie di
  sicurezza delle foto).
- Personal computer: un lavoro lungo di una persona con tastiera e schermo grande (relazione, montaggio video,
  presentazione, foglio di calcolo, primi programmi, giornalino, ritocco con mouse, disegno tecnico, musica con
  tastiera e casse, tesina da stampare).
- Dispositivo mobile: qualcosa che si fa in giro (foto in autobus, strada a piedi, pagare alla cassa, messaggi
  all'intervallo, passi in corsa, libro in treno su schermo da toccare, videochiamata dal parco, musica camminando,
  biglietto al controllore, orari alla fermata).
- Sistema embedded: un compito solo dentro un oggetto (lavatrice, semaforo, airbag, forno, caldaia, ascensore,
  distributore, drone, getti di una stampante, sbarra di un parcheggio, ruote in frenata, ferro da stiro).

Esempio: "Serve un computer per mostrare il biglietto al controllore sul treno. Di quale tipo sarà?" Risposta:
Dispositivo mobile.

## Livello 2: embedded o no

Metà dei casi "Quale di questi è un sistema embedded?" (uno lo è e tre no), metà "Quale di questi non è un sistema
embedded?" (uno non lo è e tre sì).

Sistemi embedded (14): il computer di bordo di una lavatrice, la centralina dei freni di un'auto, il termostato di
casa, la scheda di un forno a microonde, il controllo di un ascensore, la centralina di un semaforo, il telecomando del
televisore, la scheda di un distributore automatico, il controllo di volo di un drone, la scheda di una stampante, la
scheda di una lavastoviglie, il computer di una bilancia elettronica, la scheda di un cancello automatico, il controllo
di un condizionatore.

Non embedded (6): un portatile, un computer fisso, uno smartphone, un tablet, un server, un supercomputer.

Distrattore tipico: lo smartphone e il tablet presi per sistemi embedded perché piccoli (l'avviso "Lo smartphone è un
computer").

## Livello 3: che cosa cambia e che cosa resta

Metà dei casi "Quale di queste affermazioni sui tipi di computer è vera?" (una vera e tre false), metà "è falsa?".
Dieci affermazioni vere e dodici false, dalla lezione.

Vere: un microcontrollore ha CPU, memoria e interfacce in un solo chip; anche un sistema embedded esegue un programma
memorizzato; un supercomputer e un telefono hanno gli stessi quattro blocchi; in un sistema embedded le periferiche sono
sensori e attuatori; un server offre un servizio ad altri computer attraverso la rete; su un computer di uso generale
si installano programmi nuovi; un supercomputer fa lavorare insieme migliaia di processori; uno smartphone è un
computer di uso generale; un sistema embedded è dedicato a un compito solo; la CPU di un dispositivo mobile è
progettata per consumare poco.

False: un sistema embedded non ha una CPU; un supercomputer non ha memoria centrale; un microcontrollore non ha
memoria; uno smartphone non è un computer; un sistema embedded non ha periferiche; un server è una periferica di
ingresso; su una lavatrice si installano i programmi che si vogliono; solo i computer con tastiera e schermo hanno
periferiche; un server deve avere per forza tastiera e schermo; un microcontrollore è più potente di un supercomputer;
uno smartphone è un sistema embedded perché è piccolo; un sistema embedded non esegue nessun programma.

## Livello 4: i blocchi in un sistema embedded

"Nel sistema embedded di {oggetto}, a quale parte dello schema di von Neumann corrisponde {parte}?" Opzioni fisse:
Periferica di ingresso, Periferica di uscita, CPU, Memoria. Circa il 35% dei casi un sensore o un comando (ingresso),
il 35% un attuatore o un segnale (uscita), il 15% "la parte del microcontrollore che esegue le istruzioni" (CPU), il
15% "la parte del microcontrollore che conserva il programma" (Memoria).

Diciassette oggetti, ognuno con i suoi sensori e i suoi attuatori: lavatrice, semaforo, termostato, impianto dei freni
di un'auto, forno a microonde, ascensore, distributore di merendine, drone, cancello automatico, lavastoviglie,
stampante, condizionatore, frigorifero, bilancia elettronica, robot aspirapolvere, serra automatica, sveglia digitale.

Esempi:

- "Nel sistema embedded di un frigorifero, a quale parte corrisponde il compressore?" Risposta: Periferica di uscita.
- "Nel sistema embedded di una lavatrice, a quale parte corrisponde la manopola dei programmi?" Risposta: Periferica di
  ingresso.

## Esercizi da evitare

- Lavori che vanno bene per due famiglie (guardare un film: telefono o portatile).
- Oggetti di confine tra dedicato e generale (console, televisore con le app, smartwatch) al livello 2.
- Al livello 4 parti che sono insieme sensore e attuatore (uno schermo tattile su un elettrodomestico).

## Verifica

`scripts/exercises/checkers/inf_tipi_computer.py` rilegge il testo e ricostruisce la risposta dalle tabelle di questa
specifica, riscritte in Python: al livello 1 cerca il lavoro nella tabella delle famiglie; ai livelli 2 e 3 classifica
ogni opzione e controlla che una sola sia quella chiesta; al livello 4 riconosce l'oggetto e cerca la parte tra i suoi
sensori, i suoi attuatori e le due parti del microcontrollore. Poi controlla le quattro opzioni (diverse, una sola
giusta, quella indicata da `correct`) e le quote dei casi.

## Domande per la revisione

- Al livello 1 i lavori del personal computer e del dispositivo mobile sono abbastanza distinti?
- Al livello 2 server e supercomputer compaiono tra i "non embedded": va bene, o confondono?
- Al livello 4 display, spie e segnali acustici sono contati come uscite insieme agli attuatori veri: va bene?
