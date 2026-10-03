# La macchina di von Neumann

Generatore: `inf-von-neumann` (`src/lib/exercises/v2/generators/inf-von-neumann.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_von_neumann.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/13-inf-von-neumann.md`. Macchinario comune del capitolo:
`src/lib/exercises/v2/inf-architettura.ts` e `scripts/exercises/checkers/_inf_architettura.py`.

Cinque livelli, tutti a scelta multipla con quattro opzioni (`answer.kind = 'choice'`). La lezione è di concetto: le
domande sono composte da pezzi intercambiabili (componenti, dispositivi, situazioni, compiti, affermazioni) e chiedono
di applicare lo schema a un caso nuovo.

## Nomi dei livelli

1. A quale blocco appartiene
2. Il compito di ogni blocco
3. Il viaggio di un dato
4. Il programma memorizzato
5. L'ordine dei passi

## Regole comuni

- I blocchi sono quattro, scritti così nelle opzioni: CPU, Memoria centrale, Periferiche, Bus.
- Il testo è in seconda persona ("Giochi a un videogioco su una console"), in righe `\text{…}` di circa 46 caratteri;
  le opzioni più lunghe di 24 caratteri vanno su più righe con `\begin{gathered}`.
- Niente trattini lunghi e niente "piuttosto che" (lo controlla `check()`).
- I livelli 2, 3 e 5 usano tredici situazioni: videogioco su console, calcolatrice del telefono, registro elettronico,
  canzone sul telefono, tema in videoscrittura, foto, messaggio vocale, navigatore, foglio di calcolo, programma di
  grafica, traduttore, sveglia, contapassi. Ognuna ha: il programma (`del videogioco`), un dato in memoria (`il
  punteggio della partita`), un calcolo della CPU (`somma i punti appena fatti al punteggio`), il dato che entra e la
  periferica da cui entra (`il tasto premuto`, `il controller`), il risultato che esce e la periferica da cui esce
  (`l'immagine della partita`, `lo schermo`).

## Livello 1: a quale blocco appartiene

"A quale blocco della macchina di von Neumann appartiene {componente} di {dispositivo}?" Il blocco è scelto per primo,
un quarto dei casi ciascuno, poi il componente e il dispositivo (telefono, tablet, portatile, computer fisso, console
per videogiochi, smartwatch).

- CPU: il processore, il microprocessore, il chip che esegue le istruzioni dei programmi.
- Memoria centrale: la RAM, la memoria RAM, la memoria in cui stanno i programmi aperti in questo momento.
- Bus: le piste di metallo che collegano il processore alla RAM, i collegamenti su cui i dati viaggiano tra il
  processore e la RAM, i collegamenti che portano i dati dalla RAM allo schermo o dal microfono alla RAM.
- Periferiche: tastiera, mouse, schermo, microfono, altoparlante, fotocamera, webcam, stampante, controller, cuffie,
  sensore di impronte, touchpad, scanner, proiettore, ricevitore GPS, tavoletta grafica, monitor; e le memorie di
  massa (il disco, la chiavetta USB, la memoria interna in cui restano le foto), che nello schema della lezione stanno
  tra le periferiche.

Esempi:

- "A quale blocco appartiene la tastiera di un computer fisso?" Risposta: Periferiche.
- "A quale blocco appartiene il disco di un portatile?" Risposta: Periferiche. Distrattore tipico: Memoria centrale
  (l'avviso "Il disco non è la memoria centrale").

## Livello 2: il compito di ogni blocco

"{Situazione}. Quale blocco della macchina di von Neumann {compito}?" Undici compiti, il blocco scelto per primo:

- CPU: esegue le istruzioni del programma; fa il calcolo della situazione; decide quale istruzione va eseguita dopo;
- Memoria centrale: conserva le istruzioni mentre il programma è in esecuzione; conserva il dato mentre il programma
  lavora; tiene il dato a disposizione della CPU;
- Periferiche: riceve dall'esterno il dato che entra; porta all'esterno il risultato;
- Bus: trasporta il dato dalla memoria centrale alla CPU; trasporta il risultato dalla memoria centrale alla
  periferica di uscita; trasporta il dato che entra dalla periferica di ingresso alla memoria centrale.

Esempi:

- "Usi la calcolatrice del telefono. Quale blocco moltiplica i due numeri digitati?" Risposta: CPU.
- "Giochi a un videogioco su una console. Quale blocco trasporta il punteggio della partita dalla memoria centrale alla
  CPU?" Risposta: Bus. Distrattori tipici: CPU, Memoria centrale (l'avviso "Il bus non elabora e non conserva").

## Livello 3: il viaggio di un dato

Le opzioni sono sempre i quattro viaggi: da una periferica alla memoria centrale; dalla memoria centrale alla CPU;
dalla CPU alla memoria centrale; dalla memoria centrale a una periferica. Otto domande, due per viaggio:

1. "{La periferica} ha appena ricevuto {il dato}. Qual è il primo viaggio di questo dato sul bus?"; "Dopo che {la
   periferica} ha ricevuto {il dato}, da dove a dove viaggia per prima cosa questo dato?"
2. "La CPU sta per eseguire un'istruzione che usa {il dato}. Da dove a dove viaggia questo dato prima del calcolo?";
   "La CPU deve {calcolo}. Da dove a dove viaggiano, prima del calcolo, i dati che le servono?"
3. "La CPU ha appena finito di {calcolo}. Da dove a dove viaggia il risultato subito dopo il calcolo?"; "La CPU ha
   eseguito un'istruzione che cambia {il dato}. Da dove a dove viaggia il valore nuovo subito dopo?"
4. "Ora {il risultato} deve uscire dal computer. Qual è il suo ultimo viaggio sul bus?"; "Tra un istante {la
   periferica} porterà all'esterno {il risultato}. Qual è l'ultimo viaggio sul bus prima che succeda?"

Esempio: "Registri un messaggio vocale con il telefono. Il microfono ha appena ricevuto la tua voce. Qual è il primo
viaggio di questo dato sul bus?" Risposta: da una periferica alla memoria centrale.

## Livello 4: il programma memorizzato

Metà dei casi "Quale di queste affermazioni sulla macchina di von Neumann è vera?" (una vera e tre false), metà "è
falsa?" (una falsa e tre vere). Otto affermazioni vere e dieci false, tutte dalla lezione.

Vere: programmi e dati stanno nella stessa memoria; le istruzioni sono scritte in memoria come sequenze di bit; per
cambiare lavoro si carica in memoria un altro programma; la CPU prende le istruzioni dalla memoria centrale; lo stesso
computer può eseguire programmi diversi; un programma si può copiare come qualsiasi altro dato; un programma va in
memoria centrale prima di essere eseguito; i bit di una cella possono essere un dato o un'istruzione.

False (gli errori dell'avviso "Le istruzioni non stanno nella CPU" e simili): per cambiare programma si spostano i cavi
dei circuiti; le istruzioni stanno nella CPU, i dati nella memoria; programmi e dati stanno in due memorie separate; un
computer esegue solo il programma con cui è costruito; le istruzioni sono scritte con lettere, i dati con bit; il bus
conserva il programma mentre la CPU lo esegue; le periferiche eseguono le istruzioni del programma; la CPU esegue un
programma anche se non è in memoria; la memoria centrale contiene solo dati, mai istruzioni; un programma non si può
copiare, perché non è un dato.

## Livello 5: l'ordine dei passi

I sei passi del viaggio di un dato, come nella lezione. "{Situazione}. A un certo punto {passo, con i pezzi della
situazione}. Che cosa succede subito dopo?" (passi da 1 a 5) oppure "Che cosa è successo subito prima?" (passi da 2 a
6), metà ciascuna. Le opzioni sono i passi scritti in generale:

1. Una periferica di ingresso riceve il dato
2. Il dato viene scritto nella memoria centrale
3. La CPU preleva istruzione e dati dalla memoria
4. La CPU esegue l'istruzione
5. Il risultato viene scritto nella memoria centrale
6. Una periferica di uscita porta fuori il risultato

La risposta è il passo vicino; le altre tre opzioni sono passi diversi da quello descritto e dalla risposta.

Esempio: "Registri un messaggio vocale con il telefono. A un certo punto la CPU comprime il suono registrato. Che cosa
succede subito dopo?" Risposta: il risultato viene scritto nella memoria centrale.

## Esercizi da evitare

- Al livello 5, dopo il passo 5 non si offre il passo 3 (la CPU potrebbe davvero prelevare l'istruzione successiva), e
  prima del passo 3 non si offre il passo 5 (potrebbe essere il risultato dell'istruzione precedente).
- Al livello 5, quando la risposta è il passo 2 o il passo 5, l'altro dei due non compare: "il dato viene scritto" e
  "il risultato viene scritto" sono troppo vicini.
- Due opzioni uguali; un componente con un dispositivo che non lo ha (la tastiera di un telefono).

## Verifica

`scripts/exercises/checkers/inf_von_neumann.py` rilegge ogni problema dal testo e ricostruisce la risposta dai pezzi,
con le tabelle di questa specifica riscritte in Python: al livello 1 cerca il componente nella tabella dei blocchi; al
livello 2 riconosce la situazione e il compito; al livello 3 la domanda tra le otto; al livello 4 classifica ogni
opzione come vera o falsa e controlla che una sola sia quella chiesta; al livello 5 trova il passo descritto tra i sei
della situazione e calcola il vicino, e controlla le esclusioni qui sopra. Poi controlla le quattro opzioni (diverse,
una sola giusta, quella indicata da `correct`) e le quote dei casi.

## Domande per la revisione

- Le memorie di massa contate tra le periferiche al livello 1: è lo schema che usate in classe?
- Al livello 4 le affermazioni sono frasi brevi prese dalla lezione: sono abbastanza diverse dal testo da non essere
  solo memoria?
- Il livello 5 chiede il passo vicino in un elenco di sei: è utile, o è troppo vicino a imparare l'elenco a memoria?
