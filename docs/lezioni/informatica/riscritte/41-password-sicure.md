# Password e autenticazione

Il registro elettronico, la posta, il profilo di un videogioco, la chat della classe: ognuno di questi servizi, prima di aprirsi, vuole sapere chi sei. Dietro ogni account ci sono messaggi, foto, voti, a volte denaro, e tra chiunque e tutto questo c'è spesso una sola parola. Scegliere bene quella parola, e non affidarsi a lei soltanto, è un problema che si può ragionare con un conto.

## Dire chi sei e dimostrarlo

Quando entri in un servizio fai due cose diverse. Con l'**identificazione** dichiari chi sei, scrivendo il nome utente o l'indirizzo di posta. Con l'**autenticazione** lo dimostri, fornendo qualcosa che solo tu dovresti avere. Il nome utente non è un segreto, lo conoscono i tuoi compagni e spesso compare sul profilo; la prova, invece, deve restare tua. Nome utente e password insieme si chiamano **credenziali**.

## I tre fattori di autenticazione

Le prove che un servizio può chiederti sono di tre tipi, detti **fattori di autenticazione**.

```tikz
% nome: fattori-di-autenticazione
% alt: Tre riquadri affiancati con i tre fattori di autenticazione. Qualcosa che sai: password, PIN. Qualcosa che hai: il telefono, una chiavetta di sicurezza. Qualcosa che sei: l'impronta digitale, il volto
% svg: fattori-di-autenticazione-dfa30864.svg 324x69
\begin{tikzpicture}
\tikzset{f/.style={draw, thick, rounded corners=3pt, minimum width=2.6cm, minimum height=0.8cm, font=\small},
e/.style={font=\footnotesize, align=center}}
\node[f, fill=blue!12] at (0,0) {qualcosa che sai};
\node[f, fill=orange!25] at (2.9,0) {qualcosa che hai};
\node[f, fill=green!15] at (5.8,0) {qualcosa che sei};
\node[e] at (0,-0.95) {una password,\\un PIN};
\node[e] at (2.9,-0.95) {il telefono, una\\chiavetta di sicurezza};
\node[e] at (5.8,-0.95) {l'impronta digitale,\\il volto};
\end{tikzpicture}
```

Ognuno ha un punto debole diverso. Quello che sai può essere indovinato o carpito con un inganno; quello che hai può essere perso o rubato; quello che sei non si può cambiare, se qualcuno riesce a copiarlo. Per questo i fattori si combinano, come vedrai più avanti.

## Come una password finisce in mani sbagliate

Le strade sono quattro, e ognuna chiede una difesa diversa.

| Come succede | Che cosa la ferma |
|---|---|
| qualcuno prova le password più comuni e quelle che si ricavano da ciò che sa di te (nome, squadra, anno di nascita) | una password che non si può prevedere |
| un programma prova tutte le combinazioni, una dopo l'altra: è l'attacco a **forza bruta** | una password lunga |
| un sito subisce un furto di dati, e le credenziali rubate vengono provate su altri siti | una password diversa per ogni account |
| la consegni tu, su una pagina falsa, o la legge un malware | l'attenzione e un secondo fattore |

Le ultime due righe rimandano alle lezioni su [phishing](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/phishing-e-truffe-in-rete) e [malware](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/virus-e-malware). Qui ragioniamo sulle prime tre.

## Quante sono le password possibili

Chi prova tutte le combinazioni deve, nel caso peggiore, provarle tutte. Quante sono dipende da due numeri: quanti caratteri diversi puoi usare in ogni posizione, che chiamiamo $k$, e quanti caratteri ha la password, cioè la lunghezza $n$. La prima posizione si può riempire in $k$ modi, la seconda in $k$ modi per ognuno dei primi, e così via: le combinazioni sono $k$ moltiplicato per se stesso $n$ volte, cioè una [potenza](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n).

$$N = k^n$$

```ad-example
Esempio 1: un PIN di quattro cifre
Quanti sono i PIN di $4$ cifre?

Ogni posizione ha $k = 10$ possibilità, le cifre da $0$ a $9$, e le posizioni sono $n = 4$: i PIN sono $10^4 = 10\,000$. Sono pochi, e un programma li proverebbe tutti in un istante. Un PIN regge solo perché il telefono o la carta si bloccano dopo pochi tentativi sbagliati: dove questo blocco non c'è, quattro cifre non proteggono niente.
```

```ad-example
Esempio 2: lunghezza contro varietà
Confronta tre password scelte a caso: una di $8$ lettere minuscole; una di $8$ caratteri tra minuscole, maiuscole e cifre; una di $12$ lettere minuscole. Supponi che un programma riesca a fare un miliardo di tentativi al secondo, cioè $10^9$.

Le lettere minuscole sono $26$; con le maiuscole e le cifre i caratteri diventano $26 + 26 + 10 = 62$.

| Password | $k$ | $n$ | Combinazioni $k^n$ | Tempo per provarle tutte |
|---|---|---|---|---|
| 8 minuscole | $26$ | $8$ | circa $2{,}1 \cdot 10^{11}$ | circa $3$ minuti e mezzo |
| 8 tra minuscole, maiuscole e cifre | $62$ | $8$ | circa $2{,}2 \cdot 10^{14}$ | circa $2$ giorni e mezzo |
| 12 minuscole | $26$ | $12$ | circa $9{,}5 \cdot 10^{16}$ | circa $3$ anni |

Il tempo si ottiene dividendo le combinazioni per $10^9$: per la prima riga $2{,}1 \cdot 10^{11} : 10^9 = 210$ secondi. La password più lunga, fatta di sole minuscole, resiste circa $400$ volte più di quella corta con tutti i tipi di carattere.
```

Il motivo sta nella formula: la varietà dei caratteri è la base della potenza, la lunghezza è l'esponente. Ogni carattere in più moltiplica le combinazioni per $k$, e quattro lettere minuscole in più le moltiplicano per $26^4 = 456\,976$.

```tikz
% nome: combinazioni-password-a-confronto
% alt: Quattro barre orizzontali su una scala in potenze di dieci, da 1 a dieci alla diciotto. Il PIN di 4 cifre arriva a dieci alla quarta; 8 lettere minuscole a circa dieci alla undicesima; 8 caratteri tra minuscole, maiuscole e cifre a circa dieci alla quattordicesima; 12 lettere minuscole a circa dieci alla diciassettesima
% svg: combinazioni-password-a-confronto-8c2a7c71.svg 327x187
\begin{tikzpicture}[x=0.36cm]
\tikzset{et/.style={font=\footnotesize, anchor=west}}
\draw[thick, fill=orange!35] (0,3.3) rectangle (4,3.65);
\node[et] at (4,3.47) {PIN di 4 cifre};
\draw[thick, fill=blue!12] (0,2.4) rectangle (11.32,2.75);
\node[et] at (11.32,2.57) {8 minuscole};
\draw[thick, fill=blue!12] (0,1.5) rectangle (14.34,1.85);
\node[et] at (14.34,1.67) {8 con maiuscole e cifre};
\draw[thick, fill=green!20] (0,0.6) rectangle (16.98,0.95);
\node[et] at (16.98,0.77) {12 minuscole};
\draw[-{Stealth}, thick] (0,0) -- (22.5,0);
\draw[thick] (0,0.08) -- (0,-0.08);
\draw[thick] (6,0.08) -- (6,-0.08);
\draw[thick] (12,0.08) -- (12,-0.08);
\draw[thick] (18,0.08) -- (18,-0.08);
\node[font=\footnotesize] at (0,-0.38) {$1$};
\node[font=\footnotesize] at (6,-0.38) {$10^{6}$};
\node[font=\footnotesize] at (12,-0.38) {$10^{12}$};
\node[font=\footnotesize] at (18,-0.38) {$10^{18}$};
\node[font=\footnotesize] at (11,-0.95) {numero di combinazioni};
\end{tikzpicture}
```

Nella figura ogni passo verso destra moltiplica per dieci: una barra un po' più lunga corrisponde a un numero enormemente più grande.

```ad-warning
Il conto vale solo per le password scelte a caso
`P@ssw0rd!` ha maiuscole, minuscole, cifre e simboli, eppure è tra le prime che vengono provate, perché chi attacca conosce le sostituzioni che fanno tutti: `a` con `@`, `o` con `0`, un punto esclamativo in fondo. Lo stesso vale per il tuo nome seguito dall'anno di nascita. La formula conta le combinazioni possibili; una password prevedibile non costringe nessuno a provarle tutte.
```

### Una frase di parole a caso

Dodici lettere a caso sono robuste ma difficili da ricordare. Un'alternativa è la **frase d'accesso** (in inglese passphrase): alcune parole comuni scelte a caso e scritte di seguito, come `tavolo-nuvola-mirtillo-treno-sette`. Il conto è lo stesso, con le parole al posto dei caratteri: pescando $5$ parole da un elenco di $2000$, le frasi possibili sono $2000^5 = 3{,}2 \cdot 10^{16}$, un numero dello stesso ordine di grandezza di quello delle password di $12$ minuscole, e una frase si ricorda molto meglio. Anche qui conta il caso: il verso di una canzone o un proverbio non sono parole a caso.

Il conto si può rifare con qualunque coppia di numeri. Il programma qui sotto, in Python, calcola le combinazioni e il tempo che serve per provarle tutte a un miliardo di tentativi al secondo, in secondi, in giorni e in anni: `**` è l'elevamento a potenza, e $86\,400$ sono i secondi di un giorno. Non serve saper programmare: premi "Esegui", poi cambia i numeri delle prime due righe ed esegui di nuovo. Prova $k = 62$ con $n = 8$ e $k = 26$ con $n = 12$, le altre due righe della tabella, poi $k = 2000$ con $n = 5$ per la frase di cinque parole.

```codice python
k = 26
n = 8
combinazioni = k ** n
secondi = combinazioni / 10 ** 9
print("Combinazioni:", combinazioni)
print("Secondi:", secondi)
print("Giorni:", secondi / 86400)
print("Anni:", secondi / 86400 / 365)
```

## Una password diversa per ogni account

Se usi la stessa password per il gioco, la posta e un social, la sicurezza di tutti e tre è quella del sito più trascurato dei tre. Quando a quel sito vengono rubati i dati, chi li ha in mano prova le stesse credenziali altrove, e le trova valide.

Ricordare a memoria decine di password lunghe e diverse non è realistico, ed è per questo che esiste il **gestore di password**: un programma che le genera a caso, le conserva cifrate e le inserisce al posto tuo, protetto da una sola password principale. I browser e i telefoni di oggi ne hanno uno incluso. A memoria restano così poche password, che puoi permetterti di scegliere lunghe: quella del gestore, quella della posta e il codice di sblocco del telefono.

```ad-note
Come un sito serio conserva la tua password
Un sito ben fatto non tiene in archivio le password, ma una specie di impronta calcolata a partire da ognuna, dalla quale non si riesce a tornare indietro alla password. Quando entri, il sito calcola l'impronta di ciò che hai scritto e la confronta con quella conservata. Per questo un servizio serio, se dimentichi la password, te ne fa scegliere una nuova e non ti rispedisce quella vecchia: non la conosce. Come si calcolano queste impronte si studia al quinto anno.
```

## L'autenticazione a due fattori

Con l'**autenticazione a due fattori** (2FA, dall'inglese two-factor authentication) il servizio chiede due prove di tipo diverso, di solito la password e qualcosa che hai. Il secondo fattore più comune è un codice di poche cifre che vale una volta sola e scade in fretta (OTP, one-time password), generato da un'app sul telefono o ricevuto con un messaggio; in altri casi è una notifica da approvare o una chiavetta di sicurezza da collegare.

Il vantaggio è che una password rubata, da sola, non apre più l'account: a chi l'ha presa manca il tuo telefono. Conviene attivarla almeno sulla posta e sugli account a cui tieni di più.

```ad-warning
Due password non sono due fattori, e il codice non si detta a nessuno
Una password seguita da una domanda segreta sono due cose che sai: chi riesce a carpire la prima può carpire la seconda nello stesso modo. I fattori devono essere di tipo diverso. E il codice che ricevi sul telefono serve a te, sul sito su cui stai entrando in quel momento: nessun servizio te lo chiede al telefono o in chat. Chi lo chiede, anche se si presenta come l'assistenza o come un amico, sta cercando di entrare nel tuo account.
```

L'impronta digitale e il riconoscimento del volto sono comodi per sbloccare il telefono, ma un'impronta copiata non si può sostituire come una password: per questo accompagnano il codice di sblocco e non lo eliminano.

## Le abitudini che contano

1. Proteggi la posta per prima, con la password più lunga e i due fattori. Il link "password dimenticata" di quasi tutti gli altri servizi arriva lì: chi entra nella tua posta può entrare nel resto.
2. Blocca lo schermo del telefono con un codice. Il telefono è il tuo secondo fattore e tiene aperte le sessioni di tutte le app.
3. Sui computer della scuola o di altri, esci dall'account quando hai finito e non far salvare la password al browser: chi si siede dopo di te la troverebbe pronta.
4. Non condividere le password, nemmeno con un amico o con chi ti sta a cuore. Non puoi sapere dove la scriverà né a chi la dirà, e le amicizie possono finire mentre la password resta.
5. Cambia una password quando c'è un motivo: il servizio avvisa di un furto di dati, l'hai digitata su una pagina sospetta, vedi un accesso che non riconosci. Cambiarla a scadenze fisse senza motivo porta a scegliere varianti prevedibili della precedente.
6. Tratta le domande di recupero come password. Il nome del tuo cane o la città in cui sei nato si leggono sul tuo profilo: dai una risposta che non c'entra, e conservala nel gestore.

```ad-example
Esempio 3: dopo un furto di dati
Un sito di videogiochi avvisa che il suo archivio degli utenti è stato rubato. Chiara usava la stessa password per quel sito, per la posta e per un social. Che cosa deve fare, e in quale ordine?

Per prima cosa cambia la password della posta, perché da lì si possono reimpostare tutte le altre, e vi attiva l'autenticazione a due fattori. Poi cambia quelle del sito di giochi e del social, scegliendone tre diverse tra loro. Infine controlla, nelle impostazioni di ogni account, se ci sono accessi da dispositivi che non riconosce. Nei giorni seguenti deve aspettarsi messaggi falsi che fingono di venire dal sito: il suo indirizzo ora è in un elenco che circola.
```
