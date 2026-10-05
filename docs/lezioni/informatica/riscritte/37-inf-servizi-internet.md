# Posta elettronica e altri servizi di Internet

[Internet](/materiale/scuola-superiore/informatica/internet-e-il-web/internet-la-rete-delle-reti) trasporta dati da un computer a un altro, senza sapere che cosa siano. Quello che usi tutti i giorni sono i servizi costruiti sopra questo trasporto: il [web](/materiale/scuola-superiore/informatica/internet-e-il-web/il-web-ipertesti-url-e-protocollo-http), la posta elettronica, le chat, le videochiamate, la musica e i film in streaming. Ogni servizio ha i suoi programmi e il suo protocollo, cioè le sue regole per scambiarsi i messaggi, e quasi tutti seguono il [modello client-server](/materiale/scuola-superiore/informatica/internet-e-il-web/il-modello-client-server).

## La posta elettronica

La **posta elettronica** (in inglese e-mail) è il servizio che recapita un messaggio scritto alla casella di un destinatario, dove resta finché lui non lo legge. È nata prima del web e continua a servire per tutto ciò che deve restare: le comunicazioni della scuola, l'iscrizione a un sito, la ricevuta di un acquisto, la candidatura per uno stage.

### L'indirizzo

Un **indirizzo di posta elettronica** è formato da due parti separate dal simbolo `@`, che si legge "chiocciola" in italiano e "at" (presso) in inglese.

```tikz
% nome: struttura-indirizzo-posta-elettronica
% alt: L'indirizzo anna.rossi@scuola.example diviso in tre riquadri: anna.rossi è il nome utente, che indica la casella; la chiocciola fa da separatore; scuola.example è il dominio, che indica il server di posta
% svg: struttura-indirizzo-posta-elettronica-0fdbc9d5.svg 262x85
\begin{tikzpicture}
\tikzset{pezzo/.style={draw, thick, minimum height=0.8cm, font=\ttfamily}}
\node[pezzo, fill=blue!12, minimum width=2.6cm] (u) at (0,0) {anna.rossi};
\node[pezzo, fill=gray!20, minimum width=0.8cm] (c) at (1.7,0) {@};
\node[pezzo, fill=orange!25, minimum width=3.4cm] (d) at (3.8,0) {scuola.example};
\draw[thick] (0,-0.4) -- (0,-0.9);
\draw[thick] (1.7,-0.4) -- (1.7,-0.9);
\draw[thick] (3.8,-0.4) -- (3.8,-0.9);
\node[font=\footnotesize, align=center] at (0,-1.35) {nome utente:\\quale casella};
\node[font=\footnotesize, align=center] at (1.7,-1.35) {``presso''};
\node[font=\footnotesize, align=center] at (3.8,-1.35) {dominio:\\quale server di posta};
\end{tikzpicture}
```

A destra della chiocciola c'è un [nome di dominio](/materiale/scuola-superiore/informatica/internet-e-il-web/indirizzi-ip-e-nomi-di-dominio), che dice a quale organizzazione appartiene la casella e quindi a quale server consegnare il messaggio. A sinistra c'è il nome utente, che distingue la casella dalle altre dello stesso dominio. Per questo due persone possono chiamarsi `anna.rossi` su due domini diversi, ma non sullo stesso. Nell'indirizzo non ci sono spazi, e maiuscole e minuscole di solito non fanno differenza.

```ad-warning
Un carattere sbagliato, un'altra casella
`anna.rossi@scuola.example` e `annarossi@scuola.example` sono due indirizzi diversi. Se sbagli una lettera, il messaggio torna indietro con un avviso di errore oppure, peggio, arriva a uno sconosciuto. Prima di inviare qualcosa di personale, rileggi l'indirizzo.
```

### Il viaggio di un messaggio

Quando spedisci un messaggio non lo consegni al computer del destinatario, che potrebbe essere spento. Lo affidi a un **server di posta**, un computer sempre acceso che gestisce le caselle di un dominio. La **casella** è lo spazio, sul server, in cui si accumulano i messaggi arrivati per un indirizzo.

```tikz
% nome: viaggio-messaggio-posta-elettronica
% alt: Il viaggio di un messaggio di posta in tre passi: dal dispositivo di Anna al server di posta di scuola.example con il protocollo SMTP; da questo al server di posta di esempio.it, dove sta la casella di Luca, ancora con SMTP; infine dal server al dispositivo di Luca, che legge il messaggio con il protocollo IMAP
% svg: viaggio-messaggio-posta-elettronica-da5a3c7b.svg 315x144
\begin{tikzpicture}
\tikzset{
  disp/.style={draw, thick, rounded corners=3pt, fill=green!15, minimum width=2.5cm, minimum height=1.1cm, align=center, font=\small},
  serv/.style={draw, thick, fill=blue!12, minimum width=3.1cm, minimum height=1.1cm, align=center, font=\small}}
\node[disp] (a) at (0,0) {dispositivo\\di Anna};
\node[serv] (s1) at (5.4,0) {server di posta di\\{\ttfamily scuola.example}};
\node[serv] (s2) at (5.4,-2.6) {server di posta di\\{\ttfamily esempio.it}};
\node[disp] (l) at (0,-2.6) {dispositivo\\di Luca};
\draw[-{Stealth}, thick] (1.25,0) -- node[above, font=\footnotesize] {1. invio (SMTP)} (3.85,0);
\draw[-{Stealth}, thick] (5.4,-0.55) -- node[left, font=\footnotesize, align=right] {2. consegna\\(SMTP)} (5.4,-2.05);
\draw[-{Stealth}, thick] (3.85,-2.6) -- node[above, font=\footnotesize] {3. lettura (IMAP)} (1.25,-2.6);
\end{tikzpicture}
```

Anna, che ha l'indirizzo `anna.rossi@scuola.example`, scrive a `luca.bianchi@esempio.it`. Il messaggio fa tre passi.

1. Il programma di Anna consegna il messaggio al server di posta del suo dominio.
2. Il server di Anna legge il dominio del destinatario, `esempio.it`, trova il server di posta di quel dominio e gli passa il messaggio, che viene messo nella casella di Luca.
3. Quando Luca apre la posta, il suo programma si collega al proprio server e gli chiede i messaggi della casella.

I primi due passi usano il protocollo SMTP (Simple Mail Transfer Protocol), che serve a spedire. Il terzo usa un protocollo diverso, fatto per leggere: di solito IMAP (Internet Message Access Protocol), che lascia i messaggi sul server e li mostra uguali su tutti i dispositivi, così quello che leggi dal telefono risulta letto anche dal computer. Il più vecchio POP3 (Post Office Protocol, versione 3) scarica invece i messaggi su un dispositivo e di norma li toglie dal server.

Il messaggio aspetta nella casella: è per questo che puoi scrivere a mezzanotte a qualcuno che leggerà la mattina dopo.

### Leggere la posta: dal browser o con un programma

Alla casella si arriva in due modi. Con la **webmail** apri nel browser il sito del servizio di posta e leggi i messaggi come pagine web: non c'è niente da installare e funziona da qualunque computer. Con un **client di posta**, cioè un programma o un'app dedicata come quella che trovi sul telefono, i messaggi arrivano con una notifica e più caselle si leggono nello stesso posto. In entrambi i casi la casella è la stessa e sta sul server.

### Com'è fatto un messaggio

Un messaggio ha un'intestazione, con i campi che servono a recapitarlo, e un corpo, che è il testo.

| Campo | Che cosa contiene |
|---|---|
| Da | l'indirizzo del mittente |
| A | i destinatari a cui il messaggio è rivolto |
| Cc (copia conoscenza) | chi deve essere informato, senza dover rispondere |
| Ccn (copia conoscenza nascosta) | destinatari che gli altri non vedono |
| Oggetto | l'argomento del messaggio, in una riga |

Al messaggio si può unire un **allegato**, cioè un file che viaggia insieme al testo: una foto, un documento, una presentazione.

```ad-example
Esempio 1: A, Cc o Ccn
Giulia manda alla professoressa la relazione di laboratorio del suo gruppo, e vuole che i due compagni sappiano che l'ha consegnata. Poi deve invitare trenta persone di classi diverse a un torneo. Quali campi usa?

Nel primo messaggio la professoressa va in A, perché è lei che deve leggere e rispondere, e i compagni in Cc. Nel secondo i trenta indirizzi vanno in Ccn: ognuno riceve l'invito senza vedere gli indirizzi degli altri, che Giulia non ha il diritto di distribuire.
```

```ad-warning
Rispondi a tutti
"Rispondi" scrive solo al mittente; "Rispondi a tutti" scrive anche a chi era in A e in Cc. Rispondere a tutti per dire "grazie" riempie la casella di persone a cui il messaggio non serve; rispondere solo al mittente quando il gruppo aspettava una decisione lascia gli altri senza notizie. "Inoltra" manda invece il messaggio a qualcuno che non lo aveva ricevuto, allegati compresi.
```

### Scrivere un messaggio che viene letto

Una mail a un insegnante, a una segreteria o a un'azienda non è una chat: chi la riceve ne ha molte altre e spesso non ti conosce.

1. Scrivi un oggetto che dica di che cosa si tratta: "Giustificazione assenza del 12 marzo, classe 2B", non "Domanda" e mai vuoto.
2. Apri con un saluto e di' subito chi sei, se chi legge potrebbe non saperlo.
3. Metti la richiesta nelle prime righe, una sola per messaggio.
4. Chiudi con un saluto, il nome, il cognome e la classe.
5. Se c'è un allegato, nominalo nel testo e controlla di averlo unito prima di inviare.

```ad-example
Esempio 2: lo stesso messaggio, scritto bene
Oggetto: Relazione di fisica sul piano inclinato, gruppo 3, classe 2B

Buongiorno professoressa,
le invio in allegato la relazione del gruppo 3 (Bianchi, Conti, Rossi). La tabella delle misure è a pagina 2.
Cordiali saluti,
Anna Rossi, 2B

Dall'oggetto la professoressa sa già che cosa contiene il messaggio e lo ritroverà quando dovrà mettere i voti. La versione "ecco la relazione", senza oggetto e senza firma, la costringe ad aprire l'allegato per capire di chi è.
```

Gli allegati hanno un limite di dimensione, che dipende dal servizio: un video di qualche minuto di solito non passa. Per i file grandi si carica il file nel [cloud](/materiale/scuola-superiore/informatica/internet-e-il-web/il-cloud-archiviare-condividere-e-lavorare-insieme) e nel messaggio si scrive il link.

### La posta che non hai chiesto

Lo **spam** è la posta indesiderata spedita in massa a migliaia di indirizzi, quasi sempre pubblicità. I servizi di posta la riconoscono in buona parte da soli e la spostano in una cartella apposita, dove ogni tanto finisce per errore anche un messaggio vero: se aspetti una risposta che non arriva, guarda lì. Alcuni messaggi indesiderati imitano una banca, un corriere o la scuola per farsi dare una password, e altri portano allegati dannosi: come riconoscerli è l'argomento delle lezioni su [phishing e truffe in rete](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/phishing-e-truffe-in-rete) e su [virus e malware](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/virus-e-malware).

```ad-note
La posta elettronica certificata
In Italia esiste anche la posta elettronica certificata (PEC), in cui il gestore rilascia al mittente una ricevuta di invio e una di consegna con data e ora. Serve per le comunicazioni che devono avere valore legale, come quelle con gli uffici pubblici.
```

## Comunicare nello stesso momento o in momenti diversi

I servizi per comunicare si dividono in due famiglie. La comunicazione è **asincrona** quando chi scrive e chi legge non devono essere collegati nello stesso momento: il messaggio aspetta. La posta elettronica è così, come i messaggi che lasci nella chat della classe e che gli altri leggono quando possono. È **sincrona** quando le persone sono collegate insieme e si rispondono in tempo reale, come in una telefonata o in una videochiamata.

La differenza decide quale servizio scegliere. Per fissare l'ora di un allenamento con dieci persone serve una risposta rapida, e la chat va bene; per chiedere un documento alla segreteria serve un messaggio che resti e si possa ritrovare tra un mese, e si scrive una mail.

## Gli altri servizi della rete

| Servizio | A che cosa serve | Dove lo incontri |
|---|---|---|
| messaggistica istantanea | scambiare messaggi brevi, consegnati in pochi istanti, tra due persone o in un gruppo | la chat della classe |
| chiamate e videochiamate | trasmettere voce e video in tempo reale | una lezione a distanza, una chiamata dall'app di messaggistica |
| streaming | ascoltare o guardare un contenuto mentre arriva | la musica e le serie sulle piattaforme, una partita in diretta |
| trasferimento di file | copiare file da un computer a un server e viceversa | chi pubblica un sito carica le pagine sul server |

La messaggistica istantanea funziona come la posta, con un server in mezzo che riceve il messaggio e lo consegna appena il destinatario è collegato; cambia che il recapito è immediato e che di solito i due devono usare la stessa app, mentre una mail si può scrivere a qualunque indirizzo, di qualunque servizio.

Le chiamate che passano per Internet usano la tecnica chiamata VoIP (Voice over Internet Protocol): la voce viene [campionata e trasformata in numeri](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-suoni), spedita a pezzetti e ricostruita dall'altra parte. Qui conta arrivare in tempo più che arrivare interi: un pezzetto perso è un istante di voce che salta, mentre aspettarlo vorrebbe dire parlare con un ritardo.

Lo **streaming** è la riproduzione di un audio o di un video mentre i dati arrivano, senza attendere di avere tutto il file. Il programma tiene da parte qualche secondo di contenuto già arrivato, così una breve incertezza della connessione non ferma la riproduzione; se la connessione rallenta a lungo, la scorta finisce e il video si blocca o perde qualità. Scaricare (download) è l'operazione opposta: aspetti che il file arrivi tutto, e poi lo hai sul dispositivo anche senza connessione.

Per il trasferimento di file esiste un protocollo apposito, FTP (File Transfer Protocol), che oggi incontra soprattutto chi gestisce un sito; per scambiare file tra persone si usano gli allegati e il cloud.

```ad-warning
Internet non è il web, e nemmeno la posta
Il web, la posta, le chat e lo streaming sono servizi diversi che usano la stessa rete. Per questo può capitare che una pagina non si apra mentre i messaggi arrivano: la connessione funziona, è un server di quel servizio ad avere un problema.
```
