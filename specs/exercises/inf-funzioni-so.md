# Funzioni del sistema operativo

Generatore: `inf-funzioni-so` (`src/lib/exercises/v2/generators/inf-funzioni-so.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-so.ts`). Verifica indipendente: `scripts/exercises/checkers/inf_funzioni_so.py`. Lezione
collegata: `docs/lezioni/informatica/riscritte/18-inf-funzioni-so.md`.

Quattro livelli, tutti a scelta multipla con quattro opzioni (`answer.kind = 'choice'`). La lezione è di concetto: le
domande si compongono da pezzi intercambiabili, e ogni pezzo ha un identificatore nelle `values` dell'opzione.

## Nomi dei livelli

1. I compiti del sistema operativo
2. Le cinque funzioni
3. Il modello a strati
4. Vero o falso sul sistema operativo

## Regole comuni

- Il testo sta in righe `\text{…}` scritte con `textBlock`; le opzioni di testo sono `\text{…}`, su più righe con
  `\begin{gathered}` quando superano i 28 caratteri (il bottone della risposta sul telefono è largo 252 px).
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).
- I nomi di persona vengono da un elenco di dodici; nessun marchio nel testo.

## Livello 1: i compiti del sistema operativo

Dodici compiti del sistema operativo (`o1`-`o12`: decidere quale programma usa la CPU, assegnare la RAM, ricordare in
quale punto del disco sta ogni file…) e dodici attività delle applicazioni (`a1`-`a12`: correggere l'ortografia di un
tema, calcolare la media dei voti, ritoccare una foto…). Due domande, metà ciascuna:

- "Quale di queste attività è un compito del sistema operativo?": un compito e tre attività di applicazioni;
- "Quale di queste attività non è un compito del sistema operativo?": un'attività di applicazione e tre compiti.

Esempi:

- "Quale di queste attività è un compito del sistema operativo?" Opzioni: Ritoccare i colori di una foto; Assegnare la
  RAM ai programmi aperti; Mostrare una pagina web; Montare un video delle vacanze. Risposta: Assegnare la RAM ai
  programmi aperti.
- "Quale di queste attività non è un compito del sistema operativo?" Opzioni: Organizzare i file in cartelle; Far
  avanzare a turno i programmi aperti; Disegnare il grafico di una funzione; Controllare chi può aprire un file.
  Risposta: Disegnare il grafico di una funzione.

Il criterio è quello dell'esempio 3 della lezione: gestire una risorsa per conto di tutti i programmi, oppure servire
a chi usa il computer per fare un lavoro.

## Livello 2: le cinque funzioni

Venti situazioni, quattro per funzione, con un nome di persona e a volte un numero di programmi. Si chiede "Quale
funzione del sistema operativo descrive la situazione?". Opzioni: la funzione giusta e tre delle altre quattro, tra
Gestione dei processi, Gestione della memoria, Gestione dei file, Gestione delle periferiche, Interfaccia utente.

Ogni situazione nomina la risorsa della sua funzione, e solo quella: la CPU per i processi, la RAM per la memoria, il
disco per i file, un dispositivo o il suo driver (driver, stampante, cuffie) per le periferiche, gli oggetti
dell'interfaccia (icone, menu, un comando scritto) per l'interfaccia utente.

Esempi:

- "Sara chiude il browser: lo spazio che occupava nella RAM torna disponibile per gli altri programmi." Risposta:
  Gestione della memoria.
- "Luca collega una stampante nuova, e il sistema installa il driver adatto a quel modello." Risposta: Gestione delle
  periferiche. Distrattore tipico: Interfaccia utente.

## Livello 3: il modello a strati

Gli strati, dal basso: hardware, sistema operativo, applicazioni, utente. Tre domande:

- percorso (circa 6 su 10): "Anna usa un programma di videoscrittura per stampare una relazione. Nel modello a strati,
  per quali strati passa la richiesta, nell'ordine?" Dieci coppie programma-azione. Risposta: Applicazione, sistema
  operativo, hardware. Distrattori, tre tra: Applicazione, hardware, sistema operativo; Sistema operativo,
  applicazione, hardware; Hardware, sistema operativo, applicazione; Applicazione e subito hardware (l'errore
  dell'avviso "Un'applicazione non parla direttamente con l'hardware").
- vicino (circa 15 su 100): "Nel modello a strati, quale strato sta subito sopra l'hardware?" (o sotto). Opzioni: i
  quattro strati.
- ruolo (circa 1 su 4): "Nel modello a strati, quale strato riceve le chiamate di sistema?" Tre ruoli per strato.
  Opzioni: i quattro strati.

## Livello 4: vero o falso sul sistema operativo

Dodici affermazioni vere (`t1`-`t12`) e dodici false (`f1`-`f12`), le false prese dagli avvisi della lezione (il
sistema operativo come hardware, il nucleo come parte visibile, l'applicazione che comanda la stampante, il programma
preinstallato come parte del sistema). Due domande, metà ciascuna: "Quale di queste affermazioni sul sistema operativo
è vera?" (una vera e tre false) e "… è falsa?" (una falsa e tre vere).

Esempi:

- "… è vera?" Opzioni: Il browser fa parte del nucleo; Un driver è scritto per un modello preciso di periferica; I
  telefoni non hanno un sistema operativo; Per cambiare sistema operativo bisogna cambiare la CPU. Risposta: la seconda.
- "… è falsa?" Risposta possibile: Il nucleo è la parte del sistema operativo che si vede sullo schermo.

## Esercizi da evitare

- Una situazione del livello 2 che nomina due risorse (per esempio "trascina un file nel cestino": interfaccia e file).
- Attività ambigue al livello 1 ("riprodurre un brano", che tocca sia l'applicazione sia le periferiche).
- Due opzioni uguali.

## Verifica

`scripts/exercises/checkers/inf_funzioni_so.py` ricostruisce la risposta dai pezzi: al livello 1 ha la sua tabella dei
compiti (sistema operativo o applicazione) con le parole che ogni opzione deve contenere; al livello 2 classifica la
situazione dalla risorsa che nomina e boccia quelle che ne nominano zero o due; al livello 3 conosce l'ordine degli
strati e i ruoli; al livello 4 ha la sua tabella di affermazioni vere e false. Poi controlla le quattro opzioni
(diverse, una sola giusta, quella indicata da `correct`) e la quota dei casi.

## Domande per la revisione

- Livello 1: il confine tra sistema operativo e applicazioni è quello della lezione (gestire risorse o servire
  all'utente). Va bene anche per i programmi di utilità, che qui non compaiono?
- Livello 3: gli strati sono quattro. Si preferisce il modello "a cipolla" dei libri, con nucleo, gestore della
  memoria, gestore delle periferiche, file system e interprete dei comandi come strati separati?
