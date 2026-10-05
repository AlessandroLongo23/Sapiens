# inf-client-server: Il modello client-server

Generatore: `src/lib/exercises/v2/generators/inf-client-server.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-web1.ts`. Verifica indipendente: `scripts/exercises/checkers/inf_client_server.py`. Lezione:
`docs/lezioni/informatica/riscritte/34-inf-client-server.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (`answer.kind = 'choice'`). I campioni sono testo
semplice (`format: 'text'`). La `solution` è sempre il testo dell'opzione giusta, e `params.case` dice il caso.

## I servizi dei livelli 1 e 2

Dieci servizi, ognuno con quello che fa la persona, l'app, di chi è il computer del server, che cosa si chiede e che
cosa torna indietro: registro elettronico, treni, meteo, posta, biblioteca, musica, negozio, mappe, cinema, mensa.
Nessun marchio. I nomi di persona vengono da un elenco di dodici.

## Livello 1: chi è il client, chi è il server

"Giulia tocca «Voti» nell'app del registro elettronico, e dopo un attimo compare l'elenco. In questo scambio, chi è il
server?" Le opzioni sono sempre i quattro attori:

- l'app sul telefono della persona (il client);
- il programma che gira su un computer del servizio (il server);
- la persona, che tocca lo schermo (l'errore dell'avviso "Il client è un programma, non una persona");
- il tecnico che controlla i computer del servizio (lo stesso avviso, per il server).

Si chiede il client o il server, metà ciascuno.

## Livello 2: richiesta e risposta

- `richiesta` e `risposta` (3 su 10 ciascuna): "Anna sceglie una canzone nell'app della musica, e la canzone parte.
  Qual è la richiesta?" Le quattro opzioni incrociano chi manda e che cosa: l'app chiede al server una canzone
  (richiesta), il server manda all'app il file della canzone (risposta), il server chiede all'app una canzone, l'app
  manda al server il file della canzone. Le ultime due sono l'errore di chi inverte il verso.
- `passo` (4 su 10): i quattro passi dello scambio, "Quale passo viene subito dopo questo: «Il server riceve la
  richiesta e la esegue»?" (o subito prima). Opzioni: i quattro passi.

## Livello 3: i compiti del client e del server

Otto compiti del server (`s1`-`s8`: conservare i dati di tutti gli utenti, controllare i permessi, tenere la
classifica, decidere chi ha vinto…) e otto del client (`c1`-`c8`: disegnare la scena, leggere i tasti, mostrare la
risposta, cominciare lo scambio…), dalla tabella e dall'esempio 2. Due domande, metà ciascuna: "Quale di questi compiti
tocca al server?" e "… al client?".

Esempio: "Quale di questi compiti tocca al client?" Risposta possibile: Mandare la richiesta quando tocchi un pulsante.

## Livello 4: un messaggio passa dal server

Due nomi diversi.

- `percorso` (4 su 10): "Anna scrive in una chat a Davide, che usa lo stesso Wi-Fi. Che strada fa il messaggio?"
  (senza precisazione, oppure nella stessa aula, nel palazzo di fronte, in un altro continente, sullo stesso Wi-Fi).
  Risposta: dal telefono di Anna al server della chat, e da lì al telefono di Davide. Distrattori: direttamente da un
  telefono all'altro (l'avviso "Due telefoni vicini non si parlano direttamente"), prima all'altro telefono e poi al
  server, dal server al mittente.
- `spento` (3 su 10): il destinatario ha il telefono spento, "Dove resta il messaggio?". Risposta: sul server della
  chat. Distrattori: sul telefono del destinatario, sul router di casa del mittente, da nessuna parte.
- `chiede` (3 su 10): il messaggio è sul server, "Come arriva al telefono di Davide?". Risposta: il client di Davide
  chiede al server se ci sono messaggi. Distrattori: il server lo manda senza che nessuno abbia chiesto, il client del
  mittente lo consegna, il client del destinatario lo chiede a quello del mittente.

## Livello 5: client-server o peer-to-peer

Otto situazioni client-server (`k1`-`k8`) e sei peer-to-peer (`p1`-`p6`), tutte in terza persona. Due domande, metà
ciascuna: "In quale di queste situazioni il modello è peer-to-peer?" e "… è client-server?".

Esempio: "… è peer-to-peer?" Opzioni: L'app del meteo chiede le previsioni a un computer centrale, che risponde a
tutti; Dieci computer si scambiano i pezzi di un file molto grande, e ognuno passa agli altri quelli che ha già; Un
browser chiede una pagina al computer che conserva il sito; L'app della posta chiede i messaggi nuovi al computer del
servizio di posta. Risposta: la seconda.

## Livello 6: vero o falso sul client-server

Dodici affermazioni vere (`t1`-`t12`) e dodici false (`f1`-`f12`), le false prese dagli avvisi e dalle note (il client
come persona, il server che parla di sua iniziativa, il server come macchina grande o come tecnico, i telefoni vicini
che si parlano direttamente). Due domande, metà ciascuna.

## Da evitare

- Situazioni in cui i ruoli non sono netti (le notifiche: la nota della lezione dice che il primo passo è del client,
  ma a uno studente sembra il contrario; restano solo tra le affermazioni, dette in chiaro).
- Opzione "sul telefono del mittente" al caso `spento`: una copia resta davvero anche lì.
- Marchi di chat, di giochi o di programmi di scambio.

## Verifica

`scripts/exercises/checkers/inf_client_server.py` riconosce il servizio dal testo e ha la sua tabella di app,
proprietario, richiesta e risposta. Al livello 1 controlla che ogni opzione sia l'attore che dice di essere; al livello
2 legge da ogni opzione chi manda e che cosa porta, e tiene per giusta solo quella che ha il verso e il contenuto del
messaggio chiesto; conosce l'ordine dei quattro passi; ha le sue tabelle dei compiti, delle situazioni e delle
affermazioni. Poi controlla le quattro opzioni, la soluzione e la quota dei casi.

## Domande per la revisione

- Livello 2, caso `passo`: tra le opzioni c'è anche il passo della domanda, che non può essere la risposta. Si
  preferisce un quarto distrattore inventato (il server che comincia lo scambio)?
- Livello 5: le situazioni peer-to-peer sono inventate senza nominare programmi. Bastano così?
