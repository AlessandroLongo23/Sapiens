# Funzioni del sistema operativo

Tocchi l'icona di un gioco sul telefono: il gioco parte, riempie lo schermo, risponde alle dita, salva i progressi, e intanto la musica che stavi ascoltando continua a suonare. Il gioco, da solo, non saprebbe fare quasi nulla di tutto questo, perché non conosce lo schermo del tuo modello, non sa quale parte della memoria è libera e ignora che esiste anche un programma che riproduce la musica. Se ne occupa il sistema operativo, il programma che gestisce il computer per conto di tutti gli altri.

## Che cos'è un sistema operativo

Il **sistema operativo** è il software che gestisce le risorse del computer e le mette a disposizione dei programmi e di chi li usa. Fa parte del software di base, mentre i programmi con cui scrivi, giochi o navighi sono software applicativo, come spiega la lezione [Hardware e software](/materiale/scuola-superiore/informatica/informatica-e-informazione/hardware-e-software).

Le **risorse** sono le cose che i programmi devono dividersi: il tempo della [CPU](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-cpu-e-il-ciclo-di-esecuzione-delle-istruzioni), lo spazio nella memoria centrale (RAM), lo spazio nelle [memorie di massa](/materiale/scuola-superiore/informatica/l-architettura-del-computer/memoria-centrale-e-memorie-di-massa), le periferiche. Sono sempre meno dei programmi che le vogliono: i programmi aperti sono decine, lo schermo è uno solo.

Un sistema operativo fa quindi due lavori. Fa da arbitro, perché decide quale programma usa quale risorsa e per quanto tempo, e impedisce che un programma rovini i dati di un altro. Fa anche da intermediario, perché nasconde ai programmi i dettagli dell'hardware: chi scrive un gioco chiede al sistema "disegna questa immagine sullo schermo", senza sapere quale schermo avrà ciascun telefono.

Sono sistemi operativi, per esempio, Windows, macOS e Linux sui computer, Android e iOS sui telefoni e sui tablet. Ne hanno uno anche le console, gli orologi che si collegano al telefono e i televisori che vanno in rete.

```ad-warning
Il sistema operativo non è un pezzo del computer
È software: non si tocca, si installa, si aggiorna e si può sostituire. Sullo stesso computer si può installare un sistema operativo diverso da quello con cui è stato venduto, e l'hardware resta lo stesso.
```

## Le cinque funzioni

Ogni funzione del sistema operativo si occupa di una risorsa.

| Funzione | Che cosa gestisce | Un esempio |
|---|---|---|
| gestione dei processi | il tempo della CPU | la musica continua mentre scrivi un messaggio |
| gestione della memoria | lo spazio nella RAM | ogni programma aperto riceve la sua parte di memoria |
| gestione dei file | i dati nelle memorie di massa | la foto che scatti diventa un file in una cartella |
| gestione delle periferiche | tastiera, schermo, stampante, rete | una stampante nuova funziona con tutti i programmi |
| interfaccia utente | il dialogo con la persona | icone, finestre, tocchi, comandi scritti |

La **gestione dei processi** decide quale programma usa la CPU in ogni momento. Un programma in esecuzione si chiama processo, e di solito i processi sono molti di più delle CPU disponibili: il sistema operativo li fa avanzare a turno, così in fretta che sembrano andare tutti insieme. Come ci riesce lo trovi in [Processi, thread e multitasking](/materiale/scuola-superiore/informatica/il-sistema-operativo/processi-thread-e-multitasking).

La **gestione della memoria** assegna a ogni processo una parte della RAM e se la riprende quando il processo termina. Controlla anche che nessun processo legga o modifichi la memoria di un altro. Ne parla la lezione [La gestione della memoria](/materiale/scuola-superiore/informatica/il-sistema-operativo/la-gestione-della-memoria).

La **gestione dei file** organizza i dati delle memorie di massa in file e cartelle, ricorda in quale punto del disco si trova ogni file e controlla chi può aprirlo. La parte del sistema che se ne occupa si chiama file system: la trovi in [Il file system: file, cartelle e percorsi](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi).

La **gestione delle periferiche** fa dialogare i programmi con tastiera, schermo, stampante, scheda di rete e tutte le altre [periferiche](/materiale/scuola-superiore/informatica/l-architettura-del-computer/bus-e-periferiche). Per ogni periferica il sistema usa un **driver**, un piccolo programma scritto apposta per quel modello, che traduce una richiesta generica ("stampa questa pagina") nei comandi che quel dispositivo capisce.

L'**interfaccia utente** è il modo in cui dai ordini al sistema e ne ricevi le risposte: può essere grafica, con icone e finestre, oppure a riga di comando, con comandi scritti. La trovi in [Avvio del computer e interfacce utente](/materiale/scuola-superiore/informatica/il-sistema-operativo/avvio-del-computer-e-interfacce-utente).

```ad-note
Utenti e protezione
Molti libri aggiungono una sesta funzione: riconoscere gli utenti, con nome e password, e stabilire che cosa ciascuno può fare. Qui la trovi dentro le altre, perché è la gestione dei file a controllare chi può aprire un file, ed è la gestione della memoria a tenere separati i processi.
```

```ad-example
Esempio 1: che cosa succede quando salvi un tema
Stai scrivendo un tema con un programma di videoscrittura, con la musica in sottofondo, e premi "Salva". Quali funzioni del sistema operativo lavorano?

- Il clic arriva al programma attraverso il driver del mouse: gestione delle periferiche.
- La finestra in cui scegli il nome e la cartella fa parte dell'interfaccia utente.
- Il testo stava nella RAM assegnata al programma (gestione della memoria) e viene scritto nella memoria di massa come file `tema.odt`: gestione dei file.
- Mentre il disco scrive, la CPU passa agli altri programmi e la musica non si interrompe: gestione dei processi.

Il programma di videoscrittura ha chiesto una cosa sola, cioè di salvare quei dati con quel nome. Tutto il resto lo ha fatto il sistema operativo.
```

## Il nucleo

Il **nucleo** (in inglese kernel) è la parte centrale del sistema operativo: viene caricato in memoria all'avvio e ci resta finché il computer è acceso. È l'unico software che comanda direttamente l'hardware. Gestisce i processi e la memoria e, attraverso i driver, parla con le periferiche.

Le applicazioni non usano l'hardware per conto loro. Quando a un programma serve una risorsa, per esempio leggere un file, mostrare qualcosa sullo schermo o mandare dati in rete, la chiede al nucleo con una **chiamata di sistema**. Il nucleo controlla che la richiesta sia permessa, la esegue e restituisce il risultato. Per questo un gioco che si blocca non blocca tutto il telefono: il nucleo gli toglie la CPU e la memoria, e gli altri programmi proseguono.

```ad-warning
Il sistema operativo non è solo quello che vedi
Lo sfondo, le icone e le finestre sono l'interfaccia, cioè la parte visibile. Il nucleo lavora senza mostrare niente, eppure è lui a far funzionare tutto: un sistema operativo può cambiare aspetto e restare lo stesso sotto, oppure non avere affatto una grafica, come accade su molti computer che fanno da server.
```

## Il modello a strati

Per descrivere chi parla con chi si usa il **modello a strati**: il computer è visto come una pila di livelli, in cui ogni livello usa i servizi di quello che ha sotto e ne offre a quello che ha sopra.

```tikz
% nome: strati-sistema-operativo
% alt: Il modello a strati di un computer, dall'alto in basso: utente, applicazioni, sistema operativo con il nucleo nella sua parte più bassa, hardware; frecce a due punte collegano ogni strato solo a quello vicino
\begin{tikzpicture}
\tikzset{strato/.style={draw, thick, rounded corners=3pt, minimum width=6.4cm, minimum height=0.8cm, font=\small}}
\node[font=\small] (u) at (0,5.6) {utente};
\node[strato, fill=green!12] (a) at (0,4.2) {applicazioni};
\draw[thick, rounded corners=3pt, fill=blue!8] (-3.2,1.1) rectangle (3.2,3.1);
\node[font=\small] at (0,2.7) {sistema operativo: interfaccia, file system};
\node[draw, thick, rounded corners=3pt, fill=blue!25, minimum width=5.6cm, minimum height=0.8cm, font=\small] (k) at (0,1.8) {nucleo: processi, memoria, driver};
\node[strato, fill=orange!25] (h) at (0,0) {hardware: CPU, memorie, periferiche};
\draw[{Stealth}-{Stealth}, thick] (0,5.35) -- (0,4.6);
\draw[{Stealth}-{Stealth}, thick] (0,3.8) -- (0,3.1);
\draw[{Stealth}-{Stealth}, thick] (0,1.1) -- (0,0.4);
\end{tikzpicture}
```

In basso c'è l'hardware. Sopra l'hardware sta il sistema operativo, con il nucleo nella sua parte più bassa, a contatto con l'hardware. Sopra il sistema operativo stanno le applicazioni, e in cima l'utente, che usa le applicazioni e l'interfaccia. La regola è che ogni strato comunica solo con gli strati vicini: l'utente non comanda la CPU, e un'applicazione non comanda la stampante.

Il vantaggio è che ogni strato può ignorare come sono fatti gli altri. Chi scrive un'applicazione non deve conoscere tutte le stampanti del mondo, e quando cambi stampante cambia solo il driver: le applicazioni restano quelle di prima.

```ad-example
Esempio 2: il viaggio di una stampa
Nel programma di videoscrittura scegli "Stampa". Quali strati attraversa la richiesta?

1. Tu, l'utente, dai l'ordine all'applicazione.
2. L'applicazione chiede al sistema operativo di stampare il documento, con una chiamata di sistema.
3. Il nucleo passa i dati al driver della stampante, che li traduce nei comandi di quel modello.
4. L'hardware, cioè la stampante, stampa.

La risposta torna indietro per la stessa strada: la stampante segnala al driver che la carta è finita, il nucleo lo comunica all'applicazione, e l'applicazione ti mostra il messaggio.
```

```ad-warning
Un'applicazione non parla direttamente con l'hardware
È sbagliato pensare che sia il programma di videoscrittura a comandare la stampante, o il gioco ad accendere i punti dello schermo. L'applicazione fa una richiesta al sistema operativo, ed è il nucleo, con il driver giusto, a comandare il dispositivo.
```

```ad-example
Esempio 3: sistema operativo o applicazione?
Su un computer nuovo trovi già installati il programma che assegna la CPU ai processi, il driver della scheda video, un browser e una calcolatrice. Quali fanno parte del sistema operativo?

Il criterio è il lavoro che fanno. Il programma che assegna la CPU e il driver gestiscono risorse per conto di tutti gli altri programmi: fanno parte del sistema operativo. Il browser e la calcolatrice servono a te per fare qualcosa, cioè navigare e fare un conto: sono applicazioni, anche se le hai trovate già installate.
```

```ad-warning
Già installato non vuol dire sistema operativo
Insieme al sistema operativo vengono distribuite molte applicazioni: browser, calcolatrice, lettore di musica. Restano applicazioni, perché non gestiscono risorse e si possono togliere o sostituire senza che il computer smetta di funzionare.
```
