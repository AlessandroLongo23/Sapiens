# Il modello client-server

Quando apri il registro elettronico per guardare il voto della verifica, quel voto non è nel tuo telefono. Sta in un computer della società che gestisce il registro, magari a centinaia di chilometri da te, e il telefono glielo chiede ogni volta. Quasi tutto quello che fai in rete funziona allo stesso modo: un programma chiede, un altro risponde.

## Chi chiede e chi risponde

Nel **modello client-server** i programmi che comunicano attraverso una rete hanno due ruoli diversi:

- il **server** è il programma che offre un servizio: resta in attesa, e quando gli arriva una richiesta la esegue e manda indietro il risultato;
- il **client** è il programma che usa il servizio: manda la richiesta e aspetta la risposta.

Sul tuo telefono i client sono tanti: l'app del registro, il browser, l'app della posta, quella dei messaggi, il videogioco in rete. Ognuno parla con il suo server. Le due parole si usano anche per le macchine: si chiama server il computer su cui gira il programma server, come hai visto nella lezione sui [tipi di computer](/materiale/scuola-superiore/informatica/l-architettura-del-computer/computer-dispositivi-mobili-e-sistemi-embedded), e client il dispositivo da cui parte la richiesta.

Il messaggio che il client manda al server è la **richiesta**; quello che il server manda indietro è la **risposta**.

```tikz
% nome: client-server-richiesta-risposta
% alt: Schema del modello client-server. A sinistra il client, l'app del registro sul telefono; a destra il server del registro. Una freccia in alto va dal client al server con la scritta richiesta: i voti di matematica; una freccia in basso torna dal server al client con la scritta risposta: 7, 8, 6 e mezzo
% svg: client-server-richiesta-risposta-7d8ced17.svg 341x69
\begin{tikzpicture}
\tikzset{
  nodo/.style={draw, thick, rounded corners=4pt, minimum width=2.1cm, minimum height=1.5cm, align=center, font=\small}}
\node[nodo, fill=blue!10] (c) at (1.05,0) {client\\{\footnotesize app del registro}};
\node[nodo, fill=green!15] (s) at (7.75,0) {server\\{\footnotesize del registro}};
\draw[-{Stealth}, thick] (2.25,0.35) -- (6.55,0.35);
\draw[-{Stealth}, thick] (6.55,-0.35) -- (2.25,-0.35);
\node[font=\footnotesize] at (4.4,0.65) {1. richiesta: i voti di matematica};
\node[font=\footnotesize] at (4.4,-0.65) {2. risposta: 7, 8, 6 e mezzo};
\end{tikzpicture}
```

Uno scambio si svolge sempre in quattro passi:

1. Il client manda la richiesta al server.
2. Il server la riceve e la esegue: cerca i dati, fa i conti, controlla che chi chiede abbia il permesso.
3. Il server manda la risposta.
4. Il client la riceve e la mostra sullo schermo.

A cominciare è sempre il client. Il server non manda niente di sua iniziativa: aspetta, e parla solo per rispondere.

```ad-example
Esempio 1: i ruoli nel registro elettronico
Tocchi "Voti" nell'app del registro e dopo un attimo compare l'elenco. Chi è il client, chi è il server, qual è la richiesta e qual è la risposta?

Il client è l'app sul tuo telefono. Il server è il programma che gira sul computer della società del registro, dove sono conservati i voti di tutti. La richiesta è "i voti di questo studente", accompagnata dalla prova che sei tu a chiederli. La risposta è l'elenco dei voti, che l'app poi dispone sullo schermo.
```

```ad-warning
Il client è un programma, non una persona
In inglese client vuol dire cliente, e viene da pensare che il client sia tu. Tu sei l'utente. Il client è il programma che manda le richieste al posto tuo: l'app, il browser. Allo stesso modo il server non è il tecnico che lo gestisce, e non è per forza una macchina grande: è un ruolo.
```

## Perché i compiti sono divisi così

Client e server non fanno lo stesso lavoro, e le due macchine sono diverse per questo motivo.

| | Client | Server |
|---|---|---|
| Quanti sono | moltissimi, uno per ogni utente collegato | pochi, a volte uno solo |
| Quando è acceso | quando l'utente lo usa | sempre, giorno e notte |
| Che cosa fa | manda richieste, mostra le risposte, raccoglie quello che l'utente scrive | conserva i dati, esegue le richieste, controlla i permessi |
| Chi comincia | lui | mai: aspetta |

Tenere i dati in un posto solo, sul server, ha conseguenze che conosci bene anche senza averle mai chiamate così. Quando la professoressa inserisce un voto dal computer della scuola, tu lo vedi dal telefono un minuto dopo, perché tutti e due i client leggono dallo stesso server. Se cambi telefono ritrovi tutto, perché sul telefono vecchio non c'era niente da perdere. Ed è il server a decidere chi può vedere che cosa: tu i tuoi voti, i tuoi genitori anche, un tuo compagno no.

La divisione ha anche un prezzo. Se il server si ferma, il servizio si ferma per tutti nello stesso momento; senza rete il client non riceve risposte, e l'app resta vuota o mostra soltanto l'ultima cosa che aveva scaricato. I tuoi dati poi stanno sul computer di qualcun altro, che ne deve rispondere: è uno degli argomenti della lezione sulla [privacy](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/privacy-e-dati-personali).

```ad-example
Esempio 2: chi fa che cosa in un gioco in rete
In un videogioco in rete, quali di questi compiti toccano al client e quali al server: disegnare la scena sullo schermo, leggere i tasti che premi, tenere la classifica di tutti i giocatori, decidere chi ha vinto la partita?

Disegnare la scena e leggere i tasti sono compiti del client, perché riguardano lo schermo e i comandi di un solo giocatore. La classifica riguarda tutti e deve essere uguale per tutti: la tiene il server. Anche il vincitore lo decide il server. Se lo decidesse ogni client per conto suo, due giocatori potrebbero vedere due risultati diversi, e chi modifica il proprio client potrebbe darsi la vittoria da solo.
```

## Un server, molti client

Un server non serve un client alla volta. Riceve richieste da migliaia di client insieme e le porta avanti in parallelo, come un sistema operativo fa con i [processi](/materiale/scuola-superiore/informatica/il-sistema-operativo/processi-thread-e-multitasking).

Anche così, la sua capacità ha un limite. Quando le richieste arrivano tutte insieme, per esempio la mattina in cui escono i quadri di fine anno o nel minuto in cui si aprono le vendite dei biglietti di un concerto, il server risponde lentamente o non risponde affatto: è sovraccarico. Per questo i servizi molto usati dividono il lavoro tra molti server, che per chi sta dall'altra parte sembrano uno solo.

```ad-note
Lo stesso computer può avere i due ruoli
Client e server sono ruoli dei programmi, e una macchina può farli entrambi. Il server del registro, quando deve mandarti un avviso per posta elettronica, lo consegna a un server di posta: in quello scambio è lui il client.
```

## Un messaggio passa dal server

Quando Anna scrive a Luca in una chat, il messaggio non va dal telefono di Anna a quello di Luca. I due telefoni sono entrambi client, e un client non aspetta richieste: nessuno dei due saprebbe ricevere dall'altro. In mezzo c'è il server della chat.

```tikz
% nome: chat-attraverso-il-server
% alt: Tre riquadri in fila: il client di Anna a sinistra, il server della chat al centro, il client di Luca a destra. La freccia 1 va dal client di Anna al server. La freccia 2 va dal client di Luca al server. La freccia 3 torna dal server al client di Luca. Nessuna freccia collega direttamente i due client
% svg: chat-attraverso-il-server-ea42d00c.svg 341x75
\begin{tikzpicture}
\tikzset{
  nodo/.style={draw, thick, rounded corners=4pt, minimum width=1.9cm, minimum height=1.5cm, align=center, font=\small},
  num/.style={draw, thick, circle, fill=yellow!40, inner sep=1.5pt, font=\footnotesize}}
\node[nodo, fill=blue!10] (a) at (0.95,0) {client\\{\footnotesize di Anna}};
\node[nodo, fill=green!15] (s) at (4.45,0) {server\\{\footnotesize della chat}};
\node[nodo, fill=blue!10] (l) at (7.95,0) {client\\{\footnotesize di Luca}};
\draw[-{Stealth}, thick] (2.0,0) -- (3.4,0);
\draw[-{Stealth}, thick] (6.9,0.35) -- (5.5,0.35);
\draw[-{Stealth}, thick] (5.5,-0.35) -- (6.9,-0.35);
\node[num] at (2.7,0.4) {1};
\node[num] at (6.2,0.75) {2};
\node[num] at (6.2,-0.75) {3};
\end{tikzpicture}
```

1. Il client di Anna manda al server una richiesta: "consegna questo messaggio a Luca".
2. Il client di Luca chiede al server se ci sono messaggi per lui.
3. Il server risponde al client di Luca con il messaggio di Anna.

Tra il passo 1 e il passo 2 il messaggio resta sul server. Per questo puoi scrivere a qualcuno che ha il telefono spento: il messaggio lo aspetta, e parte appena il suo client torna a chiedere.

```ad-warning
Due telefoni vicini non si parlano direttamente
Anche se scrivi al compagno seduto accanto a te, il messaggio esce dalla scuola, raggiunge il server della chat, che può trovarsi in un altro continente, e torna indietro. La distanza tra i due client non conta: conta che tutti e due raggiungano il server.
```

```ad-note
E le notifiche?
Una notifica sembra un messaggio che il server manda di sua iniziativa. In realtà è il telefono che apre un collegamento con un server e lo tiene aperto, in attesa: il primo passo l'ha fatto ancora il client.
```

## Senza un server al centro: il peer-to-peer

Nel modello **peer-to-peer** (P2P, "da pari a pari") non c'è un server centrale: ogni computer collegato fa sia da client sia da server, cioè chiede dati agli altri e ne offre a sua volta.

```tikz
% nome: client-server-e-peer-to-peer
% alt: Due schemi affiancati. A sinistra il modello client-server: un server al centro e quattro client attorno, ognuno collegato solo al server. A destra il modello peer-to-peer: quattro computer alla pari, ognuno collegato a tutti gli altri, senza un centro
% svg: client-server-e-peer-to-peer-28a8be64.svg 315x141
\begin{tikzpicture}
\tikzset{
  cl/.style={draw, thick, circle, fill=blue!10, minimum size=0.6cm, inner sep=0pt, font=\footnotesize},
  sv/.style={draw, thick, rounded corners=3pt, fill=green!15, minimum size=0.75cm, inner sep=0pt, font=\footnotesize}}
\node[sv] (s) at (2,0) {S};
\node[cl] (c1) at (0.7,1.1) {C};
\node[cl] (c2) at (3.3,1.1) {C};
\node[cl] (c3) at (0.7,-1.1) {C};
\node[cl] (c4) at (3.3,-1.1) {C};
\draw[thick] (s) -- (c1);
\draw[thick] (s) -- (c2);
\draw[thick] (s) -- (c3);
\draw[thick] (s) -- (c4);
\node[font=\small] at (2,-2.0) {client-server};
\node[cl] (p1) at (5.7,1.1) {P};
\node[cl] (p2) at (8.3,1.1) {P};
\node[cl] (p3) at (5.7,-1.1) {P};
\node[cl] (p4) at (8.3,-1.1) {P};
\draw[thick] (p1) -- (p2);
\draw[thick] (p1) -- (p3);
\draw[thick] (p1) -- (p4);
\draw[thick] (p2) -- (p3);
\draw[thick] (p2) -- (p4);
\draw[thick] (p3) -- (p4);
\node[font=\small] at (7,-2.0) {peer-to-peer};
\end{tikzpicture}
```

Una rete di questo tipo non si ferma quando uno dei computer si spegne, perché nessuno è indispensabile, e non ha bisogno di un server costoso. In cambio nessuno garantisce che un dato sia sempre disponibile, né controlla che cosa viene scambiato. È il modello di alcuni programmi per scambiarsi file di grandi dimensioni; la maggior parte dei servizi che usi ogni giorno è client-server.

```ad-example
Esempio 3: riconoscere il modello
Quale modello usano queste due situazioni? Nella prima consulti l'orario dei treni dall'app delle ferrovie. Nella seconda dieci computer si scambiano i pezzi di un file molto grande, e ognuno passa agli altri i pezzi che ha già ricevuto.

La prima è client-server: l'orario sta in un posto solo, e l'app lo chiede. La seconda è peer-to-peer: ogni computer riceve pezzi dagli altri e nello stesso tempo ne offre, quindi ha entrambi i ruoli.
```
