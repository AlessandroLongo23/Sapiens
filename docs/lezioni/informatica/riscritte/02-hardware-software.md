# Hardware e software

Un telefono spento è un oggetto di vetro, metallo e plastica: lo puoi pesare, far cadere, smontare. Quando lo accendi compaiono le app, le foto, i messaggi, che non pesano niente e non si possono toccare. Ogni computer, dal telefono alla console al portatile, è fatto di queste due parti: l'hardware, la parte fisica, e il software, i programmi che la fanno lavorare.

## L'hardware, la parte che si tocca

L'**hardware** è l'insieme dei componenti fisici di un computer: i circuiti, i cavi, lo schermo, la batteria, la tastiera, tutto quello che ha un peso e occupa spazio. La parola inglese vuol dire ferramenta.

In un telefono sono hardware lo schermo, la batteria, la fotocamera, l'altoparlante e i circuiti che stanno sotto la scocca. Tra questi ci sono l'unità centrale di elaborazione (CPU), che esegue i calcoli, la memoria centrale (RAM), che contiene i programmi mentre sono in esecuzione, e la memoria di massa, dove restano le foto e le app anche a telefono spento. Come sono fatti e come lavorano insieme lo spiega il capitolo sull'architettura, a partire dalla lezione [La macchina di von Neumann](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-macchina-di-von-neumann); le tastiere, gli schermi e le stampanti sono nella lezione [Bus e periferiche](/materiale/scuola-superiore/informatica/l-architettura-del-computer/bus-e-periferiche).

```ad-warning
Hardware non vuol dire "quello che si vede da fuori"
La CPU e la memoria RAM stanno dentro la scocca e non si vedono, ma sono oggetti: sono hardware. Per decidere, chiediti se la cosa si può toccare, almeno dopo aver aperto il computer con un cacciavite.
```

## Il software, i programmi

Da solo l'hardware non fa niente: una CPU sa eseguire operazioni molto semplici, ma qualcuno deve dirle quali, e in che ordine. Un **programma** è una sequenza di istruzioni che dice all'hardware che cosa fare. Il **software** è l'insieme dei programmi di un computer.

Un programma non si tocca. È registrato in una memoria come una lunga sequenza di bit (la lezione [Informazione, dati e codici](/materiale/scuola-superiore/informatica/informatica-e-informazione/informazione-dati-e-codici) spiega che cos'è un bit), e la stessa sequenza si può copiare su un altro computer senza che il primo la perda. Hardware e software hanno bisogno l'uno dell'altro: senza software l'hardware resta fermo, senza hardware il software non ha chi lo esegue.

```ad-example
Esempio 1: hardware o software
In un portatile, che cosa è hardware e che cosa è software tra schermo, browser, tastiera, app del meteo, batteria e programma di videoscrittura?

Lo schermo, la tastiera e la batteria sono oggetti: hardware. Il browser, l'app del meteo e il programma di videoscrittura sono programmi: software. Se togli la batteria ti resta in mano un pezzo; se disinstalli il browser non ti resta in mano niente.
```

```ad-example
Esempio 2: il disco e il gioco
Un videogioco comprato su disco è hardware o software?

Tutti e due, perché sono due cose diverse. Il disco è un oggetto di plastica: hardware. Il gioco registrato sopra è un programma: software. Lo stesso gioco scaricato da un negozio online non ha nessun disco, ed è lo stesso programma. Vale anche per una chiavetta USB: la chiavetta è hardware, quello che ci copi sopra no.
```

```ad-note
I documenti non sono programmi
Una foto, un tema, una canzone non contengono istruzioni da eseguire: sono dati, che i programmi leggono e modificano. Non si toccano, come il software, ma non sono software: sono quello su cui il software lavora.
```

## Software di base e software applicativo

I programmi non fanno tutti lo stesso mestiere. Alcuni servono a far funzionare il computer, altri servono a chi lo usa.

Il **software di base**, detto anche software di sistema, è l'insieme dei programmi che gestiscono l'hardware e lo rendono utilizzabile dagli altri programmi. Il più importante è il **sistema operativo**, che parte all'accensione e resta in esecuzione finché il computer è acceso: assegna la CPU e la memoria ai programmi, organizza i file, mostra le finestre e le icone. Windows, macOS, Linux, Android e iOS sono sistemi operativi. Che cosa fa di preciso lo spiega la lezione [Funzioni del sistema operativo](/materiale/scuola-superiore/informatica/il-sistema-operativo/funzioni-del-sistema-operativo).

Il **software applicativo** è l'insieme dei programmi con cui l'utente fa il suo lavoro: il programma di videoscrittura per scrivere un tema, il foglio di calcolo per fare i conti, il browser per navigare, l'app del registro elettronico per vedere i voti, un videogioco per giocare. Sul telefono si chiamano app, che è l'abbreviazione di applicazione.

I programmi applicativi non comandano l'hardware direttamente: chiedono al sistema operativo, che lo fa per loro. Si può pensare a degli strati, uno sopra l'altro, in cui ognuno parla solo con quello vicino.

```tikz
% nome: strati-hardware-software
% alt: Quattro strati impilati, dall'alto in basso: l'utente, il software applicativo con browser, videoscrittura e giochi, il software di base con sistema operativo e driver, e in fondo l'hardware con CPU, memorie e periferiche. Frecce a due punte collegano ogni strato a quello sotto
% svg: strati-hardware-software-af52518a.svg 247x191
\begin{tikzpicture}
\tikzset{strato/.style={draw, thick, rounded corners=3pt, minimum width=6.4cm, minimum height=0.95cm, align=center, font=\small}}
\node[font=\small] (u) at (0,1.25) {utente};
\node[strato, fill=blue!10] (a) at (0,0) {software applicativo\\{\footnotesize browser, videoscrittura, giochi}};
\node[strato, fill=orange!25] (b) at (0,-1.5) {software di base\\{\footnotesize sistema operativo, driver}};
\node[strato, fill=gray!25] (h) at (0,-3.0) {hardware\\{\footnotesize CPU, memorie, periferiche}};
\draw[{Stealth}-{Stealth}, thick] (u) -- (a);
\draw[{Stealth}-{Stealth}, thick] (a) -- (b);
\draw[{Stealth}-{Stealth}, thick] (b) -- (h);
\end{tikzpicture}
```

```ad-example
Esempio 3: che cosa succede quando scatti una foto
Marta apre l'app della fotocamera e tocca il pulsante di scatto. Chi fa che cosa?

L'app della fotocamera è software applicativo: mostra il pulsante e decide che è il momento di scattare, ma non sa come è fatto il sensore di quel telefono. Chiede la foto al sistema operativo, che è software di base e che passa la richiesta al sensore, cioè all'hardware. L'immagine fa la strada al contrario: dal sensore al sistema operativo, dal sistema operativo all'app, che la mostra a Marta. Per questo la stessa app funziona su telefoni con fotocamere diverse.
```

```ad-warning
Software di base non vuol dire "programmi semplici"
"Di base" indica lo strato che sta alla base, sotto gli altri programmi, non la difficoltà. Un sistema operativo è tra i programmi più complicati che esistano. E il browser, anche se lo trovi già installato insieme al sistema operativo, resta software applicativo: conta a che cosa serve, non quando è stato installato.
```

## Driver e firmware

Due tipi di software stanno così vicini all'hardware che si confondono spesso con lui.

Un **driver** è un programma che permette al sistema operativo di usare una periferica precisa: una stampante, una scheda video, una webcam. Il sistema operativo sa che cosa vuol dire stampare una pagina; il driver sa quali comandi capisce quel modello di stampante. Fa parte del software di base.

Il **firmware** è il software registrato in modo permanente in un chip di memoria del dispositivo, da chi lo ha costruito. È il primo programma che parte quando si preme il tasto di accensione: nel computer controlla i componenti e poi avvia il sistema operativo, come racconta la lezione [Avvio del computer e interfacce utente](/materiale/scuola-superiore/informatica/il-sistema-operativo/avvio-del-computer-e-interfacce-utente). Hanno un firmware anche gli oggetti che non sembrano computer: una lavatrice, un telecomando, un router, la centralina di un'auto.

```ad-example
Esempio 4: la stampante nuova che non stampa
Luca collega al computer una stampante appena comprata. La stampante si accende, il cavo è a posto, ma il computer dice che non la riconosce. Il problema è nell'hardware o nel software?

Nel software: manca il driver, cioè il programma che spiega al sistema operativo come parlare con quel modello. Non c'è niente da riparare o da sostituire; si installa il driver e la stampante funziona.
```

```ad-warning
Il firmware e i driver sono software
Il firmware sta dentro un chip, e il chip è hardware; ma il firmware è il programma scritto nel chip, e si può aggiornare senza cambiare il chip. Allo stesso modo il driver della stampante non è un pezzo della stampante: è un programma installato sul computer.
```

## Guasti dell'hardware e problemi del software

La differenza tra le due parti si vede bene quando qualcosa non va, perché i rimedi sono diversi.

| | Hardware | Software |
|---|---|---|
| Che cos'è | oggetti: circuiti, schermo, batteria | programmi: sequenze di istruzioni |
| Come si procura | si compra e si monta | si installa o si scarica |
| Che cosa gli succede con il tempo | si consuma e si rompe | non si consuma, ma può contenere errori |
| Come si rimedia | si ripara o si sostituisce il pezzo | si aggiorna o si reinstalla il programma |
| Si può copiare? | no: per averne due bisogna costruirne due | sì: la copia è identica all'originale |

Uno schermo crepato, una batteria che non tiene più la carica, un tasto rotto sono guasti dell'hardware: nessun aggiornamento li ripara. Un'app che si chiude da sola dopo l'ultima versione, un gioco che si blocca sempre allo stesso livello sono errori del software: cambiare lo schermo o la batteria non serve.

```ad-warning
Il software non si consuma
Un programma di dieci anni fa esegue le stesse istruzioni del primo giorno. Se un vecchio computer sembra più lento, di solito è perché i programmi nuovi chiedono più memoria e più calcoli di quelli per cui era stato costruito, oppure perché l'hardware si è usurato.
```

## Le licenze del software

Chi scrive un programma decide che cosa gli altri possono farne, e lo scrive in una **licenza**: il contratto che accetti quando installi il programma. I casi che si incontrano più spesso sono tre.

- Il software proprietario si può usare, a pagamento oppure no, ma non si può studiare né modificare: le istruzioni scritte dai programmatori restano segrete.
- Il software libero, detto anche open source, si può usare, studiare, modificare e ridistribuire, perché le istruzioni scritte dai programmatori sono pubbliche. Linux, LibreOffice e Firefox sono software libero.
- Il freeware è software proprietario che si usa gratis.

```ad-warning
Gratis non vuol dire libero
Un'app gratuita di cui nessuno può leggere o modificare le istruzioni è freeware, non software libero. La libertà di cui parla il nome riguarda quello che puoi fare con il programma, non il prezzo.
```
