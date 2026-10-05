# Internet, la rete delle reti

Un messaggio che parte dal tuo telefono e arriva a un'amica in vacanza dall'altra parte del mondo ci mette meno di un secondo, e per strada attraversa la rete di casa tua, quella della compagnia telefonica, un cavo posato sul fondo dell'oceano e altre reti ancora, di proprietari diversi. Nessuna di queste reti arriva dappertutto. Internet è quello che si ottiene collegandole tutte tra loro, con regole uguali per tutti.

## Che cos'è una rete

Una **rete di computer** è un insieme di dispositivi collegati tra loro per scambiarsi dati. A casa tua ce n'è una: il telefono, il portatile, il televisore e la console sono collegati alla stessa scatola, e per questo dal telefono puoi mandare un video al televisore o una foto alla stampante.

I collegamenti sono di due tipi. Quelli con il filo usano cavi di rame, in cui i bit viaggiano come segnali elettrici, oppure cavi in fibra ottica, in cui viaggiano come impulsi di luce. Quelli senza filo usano le onde radio: il Wi-Fi nel raggio di una casa o di una scuola, la rete mobile del telefono quando sei per strada.

Le reti si distinguono anche per quanto sono estese:

- una **rete locale** (LAN, Local Area Network) copre una casa, un ufficio, una scuola, e appartiene a chi la usa;
- una **rete geografica** (WAN, Wide Area Network) copre una regione, uno Stato o più Stati, e collega tra loro reti lontane. Quelle delle compagnie telefoniche sono reti geografiche.

## Una rete fatta di reti

**Internet** è la rete che si ottiene collegando tra loro le reti di tutto il mondo. Il nome viene dall'inglese internetwork, cioè "rete tra le reti".

A unire due reti è un **router**, un dispositivo che appartiene a più reti nello stesso momento e passa i dati dall'una all'altra. La scatola con le lucine che hai a casa è un router: da una parte ha la tua rete locale, dall'altra la rete del **fornitore di accesso** (in inglese provider, o ISP, Internet Service Provider), cioè l'azienda a cui paghi l'abbonamento perché la sua rete colleghi la tua al resto di Internet. Le reti dei fornitori sono collegate a loro volta tra loro, e a quelle degli altri continenti con cavi in fibra ottica posati sul fondo dei mari.

```tikz
% nome: internet-rete-di-reti
% alt: Schema di Internet come rete di reti. In basso due reti locali: la rete di casa, con telefono, portatile e console, e la rete della scuola, con computer, tablet e stampante. Ognuna ha un router, indicato con la lettera R, che la collega alla rete di un fornitore di accesso. Le reti dei due fornitori sono collegate tra loro e, più in alto, alle altre reti del mondo
% svg: internet-rete-di-reti-6737a006.svg 338x216
\begin{tikzpicture}
\tikzset{
  rete/.style={draw, thick, rounded corners=6pt, fill=blue!8},
  disp/.style={draw, thick, fill=orange!25, minimum height=0.5cm, inner xsep=2pt, text height=1.5ex, text depth=0.25ex, font=\footnotesize},
  forn/.style={draw, thick, rounded corners=6pt, fill=green!15, minimum width=3.6cm, minimum height=0.8cm, font=\small},
  router/.style={draw, thick, circle, fill=yellow!40, inner sep=1.5pt, font=\footnotesize}}
\draw[rete] (0.1,-1.0) rectangle (4.3,1.2);
\draw[rete] (4.7,-1.0) rectangle (8.9,1.2);
\node[font=\small] at (2.2,-0.65) {rete di casa};
\node[font=\small] at (6.8,-0.65) {rete della scuola};
\node[disp] (a1) at (0.8,0) {telefono};
\node[disp] (a2) at (2.2,0) {portatile};
\node[disp] (a3) at (3.6,0) {console};
\node[disp] (b1) at (5.45,0) {computer};
\node[disp] (b2) at (6.75,0) {tablet};
\node[disp] (b3) at (8.05,0) {stampante};
\node[router] (ra) at (2.2,1.2) {R};
\node[router] (rb) at (6.8,1.2) {R};
\node[forn] (fa) at (2.2,2.6) {rete del fornitore A};
\node[forn] (fb) at (6.8,2.6) {rete del fornitore B};
\node[forn, fill=gray!20, minimum width=4.4cm] (mondo) at (4.5,4.2) {altre reti, in tutto il mondo};
\draw[thick] (a1.north) -- (ra);
\draw[thick] (a2.north) -- (ra);
\draw[thick] (a3.north) -- (ra);
\draw[thick] (b1.north) -- (rb);
\draw[thick] (b2.north) -- (rb);
\draw[thick] (b3.north) -- (rb);
\draw[very thick] (ra) -- (fa);
\draw[very thick] (rb) -- (fb);
\draw[very thick] (fa) -- (fb);
\draw[very thick] (fa.north) -- (3.6,3.8);
\draw[very thick] (fb.north) -- (5.4,3.8);
\end{tikzpicture}
```

Nella figura un compito mandato dal portatile di casa al computer della scuola sale al router di casa, attraversa la rete del fornitore A, passa a quella del fornitore B e scende dal router della scuola.

Ogni rete ha il suo proprietario: la tua famiglia, la scuola, un'azienda, un'università. Internet nel suo insieme invece non è di nessuno, e non ha un centro da cui qualcuno la comanda. Funziona perché tutte le reti che ne fanno parte hanno accettato le stesse regole per scambiarsi i dati.

```ad-warning
Il Wi-Fi non è Internet
Il Wi-Fi è il collegamento senza fili tra il tuo dispositivo e il router della rete locale. Se si interrompe il collegamento tra il router e il fornitore, il telefono continua a mostrare il Wi-Fi al massimo e le pagine non si aprono: la rete locale funziona, è l'uscita verso le altre reti che manca.
```

## I dati viaggiano a pacchetti

Una foto non attraversa Internet tutta intera. Il dispositivo che la spedisce la divide in blocchi piccoli, i **pacchetti**, e ogni pacchetto porta con sé, oltre a un pezzo della foto, l'indirizzo del destinatario, quello del mittente e un numero che dice quale pezzo è.

Ogni pacchetto viaggia per conto suo. Il router che lo riceve legge l'indirizzo del destinatario e lo passa a un altro router più vicino alla meta, e così di router in router fino all'arrivo. Due pacchetti della stessa foto possono fare strade diverse e arrivare in un ordine diverso da quello di partenza: il dispositivo che li riceve li rimette in fila con i loro numeri, e se ne manca uno chiede di rimandarlo.

```tikz
% nome: pacchetti-strade-diverse
% alt: Il telefono di Anna, a sinistra, manda una foto al telefono di Luca, a destra, divisa in tre pacchetti numerati. Tra i due ci sono quattro router collegati a rombo. Il pacchetto 1 passa dal router in alto ed è quasi arrivato, il pacchetto 2 passa dal router in basso, il pacchetto 3 è appena partito
% svg: pacchetti-strade-diverse-df5240bf.svg 338x119
\begin{tikzpicture}
\tikzset{
  disp/.style={draw, thick, rounded corners=3pt, fill=blue!10, minimum width=1.1cm, minimum height=0.8cm, font=\small},
  router/.style={draw, thick, circle, fill=yellow!40, inner sep=1.5pt, font=\footnotesize},
  pacc/.style={draw, thick, fill=orange!45, minimum size=0.42cm, inner sep=0pt, font=\footnotesize}}
\node[disp] (anna) at (0.6,0) {Anna};
\node[disp] (luca) at (8.3,0) {Luca};
\node[router] (r1) at (2.7,0) {R};
\node[router] (r2) at (4.5,1.3) {R};
\node[router] (r3) at (4.5,-1.3) {R};
\node[router] (r4) at (6.3,0) {R};
\draw[thick] (anna) -- (r1);
\draw[thick] (r1) -- (r2);
\draw[thick] (r1) -- (r3);
\draw[thick] (r2) -- (r3);
\draw[thick] (r2) -- (r4);
\draw[thick] (r3) -- (r4);
\draw[thick] (r4) -- (luca);
\node[pacc] at (5.4,0.65) {1};
\node[pacc] at (3.6,-0.65) {2};
\node[pacc] at (1.75,0) {3};
\draw[-{Stealth}, thick] (5.55,1.2) -- (6.25,0.7);
\draw[-{Stealth}, thick] (3.0,-0.85) -- (3.7,-1.35);
\draw[-{Stealth}, thick] (1.4,0.45) -- (2.1,0.45);
\end{tikzpicture}
```

Dividere i dati in pacchetti ha tre vantaggi, che spiegano perché Internet è fatta così:

- lo stesso cavo serve molte persone insieme, perché i pacchetti dell'una si alternano a quelli delle altre e nessuno tiene la linea occupata per sé;
- se un collegamento si guasta i pacchetti passano da un'altra strada, e la comunicazione continua;
- se un pacchetto si perde si rimanda solo quello, non tutta la foto.

```ad-example
Esempio 1: quanti pacchetti per una foto
Una foto occupa $3\,\text{MB}$, cioè $3\,000\,000\,\text{B}$. Supponi che ogni pacchetto possa portare $1500\,\text{B}$ della foto. Quanti pacchetti servono?

Si divide la dimensione della foto per quello che sta in un pacchetto: $3\,000\,000 : 1500 = 2000$ pacchetti. Se il numero 1207 va perso, il mittente rimanda quei $1500\,\text{B}$ e non gli altri 1999 pacchetti.
```

```ad-example
Esempio 2: un collegamento si guasta
Nella figura si interrompe il collegamento tra il router di sinistra e quello in alto. La foto di Anna arriva lo stesso a Luca?

Sì. Il router di sinistra ha ancora il collegamento con il router in basso, e da lì i pacchetti raggiungono il router di destra, direttamente oppure passando da quello in alto. La foto non arriverebbe solo se si interrompesse un collegamento per cui passano tutte le strade, come quello tra Anna e il primo router.
```

## I protocolli

Perché due dispositivi si capiscano non basta che siano collegati: devono essere d'accordo su come sono fatti i messaggi, su chi parla per primo e su che cosa fare quando qualcosa va storto. Un **protocollo** è un insieme di regole di questo tipo, che due dispositivi seguono per comunicare.

Ne usi uno anche tu quando telefoni: chi risponde dice "pronto", poi si parla uno alla volta, se non hai capito chiedi di ripetere, e prima di chiudere ci si saluta. Nessuno te l'ha insegnato come una regola scritta, ma se l'altro non la rispettasse la telefonata non funzionerebbe.

I protocolli di Internet formano una famiglia che prende il nome dai due più importanti, TCP/IP:

- IP (Internet Protocol) stabilisce come è fatto un pacchetto e come si scrive l'[indirizzo](/materiale/scuola-superiore/informatica/internet-e-il-web/indirizzi-ip-e-nomi-di-dominio) a cui consegnarlo;
- TCP (Transmission Control Protocol) divide i dati in pacchetti alla partenza, li rimette in ordine all'arrivo e fa rimandare quelli persi.

Questi protocolli sono pubblici, e chiunque può costruire un dispositivo o scrivere un programma che li rispetta. Per questo un telefono, un computer con un altro [sistema operativo](/materiale/scuola-superiore/informatica/il-sistema-operativo/funzioni-del-sistema-operativo) e un televisore di marche diverse si scambiano dati senza difficoltà: non devono essere uguali, devono seguire le stesse regole.

```ad-example
Esempio 3: che cosa stabilisce un protocollo
Quali di queste cose sono decise da un protocollo: in che ordine stanno le informazioni dentro un pacchetto, di che marca è il router, che cosa fa chi riceve quando manca un pacchetto, di che colore è il cavo?

L'ordine delle informazioni nel pacchetto e il comportamento quando ne manca uno sono regole di comunicazione: le decide il protocollo. La marca del router e il colore del cavo non cambiano il modo in cui i dispositivi si parlano, e il protocollo non se ne occupa.
```

## Internet non è il web

Internet è l'insieme delle reti, dei cavi e dei router: trasporta pacchetti, qualunque cosa contengano. Sopra questo trasporto funzionano molti **servizi**, ognuno con i suoi protocolli: il [web](/materiale/scuola-superiore/informatica/internet-e-il-web/il-web-ipertesti-url-e-protocollo-http), la [posta elettronica](/materiale/scuola-superiore/informatica/internet-e-il-web/posta-elettronica-e-altri-servizi-di-internet), i messaggi, le videochiamate, i film e la musica in streaming, i videogiochi in rete.

Il rapporto è quello tra le strade e ciò che ci passa sopra. Le strade sono una sola rete; gli autobus, i camion della posta e le ambulanze sono servizi diversi che le usano tutti.

```ad-warning
"Internet" e "web" non sono sinonimi
Il web è uno dei servizi di Internet, quello delle pagine che apri con il browser. Quando mandi un messaggio vocale, giochi in rete o fai una videochiamata usi Internet e non il web. Internet inoltre è più vecchia: esisteva da una ventina d'anni quando il web è nato.
```

## Da quattro computer a tutto il mondo

L'antenata di Internet si chiamava ARPANET: nel 1969 collegava quattro centri di ricerca degli Stati Uniti, e fu una delle prime reti a far viaggiare i dati a pacchetti. Negli anni successivi nacquero altre reti, e per unirle furono scritti i protocolli TCP/IP, che ARPANET adottò nel 1983. All'inizio degli anni Novanta arrivò il web, che rese la rete facile da usare anche per chi non era un informatico, e da allora Internet è entrata nelle case.

Quanto in fretta viaggiano i dati su un collegamento si misura in bit al secondo, come hai visto nella lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura): è il numero che trovi nelle offerte dei fornitori di accesso, scritto in $\text{Mbit/s}$.
