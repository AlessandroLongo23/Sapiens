# Avvio del computer e interfacce utente

Tra il momento in cui premi il tasto di accensione e quello in cui compare la schermata di accesso passano alcuni secondi, a volte un minuto. In quel tempo il computer risolve un problema che sembra senza uscita: i programmi vengono caricati in memoria dal sistema operativo, ma all'accensione il sistema operativo in memoria non c'è ancora. Questa lezione racconta come ne esce, e poi in quali modi, a sistema avviato, puoi dargli ordini.

## Perché serve una procedura di avvio

La CPU esegue solo le istruzioni che trova nella memoria centrale (RAM), e la RAM è volatile: quando togli la corrente si svuota, come spiega la lezione [Memoria centrale e memorie di massa](/materiale/scuola-superiore/informatica/l-architettura-del-computer/memoria-centrale-e-memorie-di-massa). Il sistema operativo sta quindi nella memoria di massa, che conserva i dati anche a computer spento, e a ogni accensione va copiato di nuovo nella RAM.

Per copiarlo serve un programma, e quel programma non può stare nella RAM vuota. Sta in un chip di memoria non volatile saldato sulla scheda madre, sempre pronto: è il **firmware**. Nei computer si chiama BIOS (Basic Input/Output System) nei modelli più vecchi e UEFI (Unified Extensible Firmware Interface) in quelli più recenti.

## Le fasi dell'avvio

L'**avvio** (in inglese boot, o bootstrap) è la sequenza di operazioni che porta il computer da spento a pronto per l'uso. Le fasi sono cinque.

1. Accensione: appena arriva la corrente, la CPU comincia a eseguire il firmware.
2. Autodiagnosi: il firmware controlla che i componenti indispensabili rispondano, cioè CPU, RAM, scheda video, tastiera. Questo controllo si chiama POST (Power-On Self-Test). Se trova un guasto si ferma e lo segnala, con un messaggio o con una serie di segnali acustici.
3. Ricerca del dispositivo di avvio: il firmware esamina le memorie di massa, in un ordine fissato nelle sue impostazioni, finché ne trova una che contiene un sistema operativo.
4. Caricamento del nucleo: il firmware esegue il **bootloader**, un piccolo programma che si trova all'inizio di quella memoria di massa. Il bootloader copia nella RAM il nucleo del sistema operativo e gli passa il controllo.
5. Avvio dei servizi e dell'interfaccia: il nucleo carica i driver, fa partire i programmi di servizio e infine mostra l'interfaccia, di solito la schermata in cui scegli l'utente e scrivi la password.

```tikz
% nome: fasi-avvio-computer
% alt: Le cinque fasi dell'avvio in colonna, collegate da frecce: accensione con la partenza del firmware, autodiagnosi, ricerca del dispositivo di avvio, caricamento del nucleo nella RAM da parte del bootloader, avvio di driver, servizi e interfaccia; a destra è indicato chi lavora in ogni fase: il firmware nelle prime tre, il bootloader nella quarta, il nucleo nella quinta
% svg: fasi-avvio-computer-babf5b0d.svg 266x187
\begin{tikzpicture}
\tikzset{fase/.style={draw, thick, rounded corners=3pt, minimum width=4.8cm, minimum height=0.62cm, font=\small}}
\node[fase, fill=blue!10] (a) at (0,0) {accensione: parte il firmware};
\node[fase, fill=blue!10] (b) at (0,-1.05) {autodiagnosi (POST)};
\node[fase, fill=blue!10] (c) at (0,-2.1) {ricerca del dispositivo di avvio};
\node[fase, fill=orange!25] (d) at (0,-3.15) {caricamento del nucleo nella RAM};
\node[fase, fill=green!15] (e) at (0,-4.2) {driver, servizi, interfaccia};
\draw[-{Stealth}, thick] (a) -- (b);
\draw[-{Stealth}, thick] (b) -- (c);
\draw[-{Stealth}, thick] (c) -- (d);
\draw[-{Stealth}, thick] (d) -- (e);
\draw[thick] (2.65,0.31) -- (2.8,0.31) -- (2.8,-2.41) -- (2.65,-2.41);
\node[right, font=\small] at (2.85,-1.05) {firmware};
\node[right, font=\small] at (2.6,-3.15) {bootloader};
\node[right, font=\small] at (2.6,-4.2) {nucleo};
\end{tikzpicture}
```

Un telefono fa lo stesso percorso: firmware, bootloader, nucleo, e alla fine la schermata di sblocco. Il nome bootstrap viene dall'espressione inglese "sollevarsi tirandosi per i lacci degli stivali": il computer si avvia da solo, partendo da un programma minuscolo che ne carica uno più grande.

```ad-example
Esempio 1: che cosa vedi e che cosa succede
Accendi un portatile. Per un paio di secondi compare il marchio del produttore, poi il logo del sistema operativo con un'animazione, infine la schermata di accesso. A quali fasi corrisponde ciò che vedi?

Finché c'è il marchio del produttore lavora il firmware: fa l'autodiagnosi e cerca il dispositivo di avvio (fasi 1, 2 e 3). Quando compare il logo del sistema operativo il bootloader ha già caricato il nucleo, che sta avviando driver e servizi (fasi 4 e 5). La schermata di accesso segna la fine dell'avvio.
```

```ad-warning
Il firmware non è il sistema operativo
Il firmware sta in un chip della scheda madre, il sistema operativo nella memoria di massa. Se installi un altro sistema operativo, il firmware resta quello di prima; e se togli il disco, il firmware parte lo stesso, ma si ferma alla fase 3 perché non trova niente da caricare.
```

```ad-example
Esempio 2: capire dove si è fermato l'avvio
Tre computer non si avviano. Il primo emette una serie di segnali acustici e lo schermo resta nero. Il secondo mostra il messaggio "nessun dispositivo di avvio trovato". Il terzo mostra il logo del sistema operativo e poi si blocca. In quale fase si è fermato ciascuno?

Il primo si è fermato all'autodiagnosi (fase 2): il firmware ha trovato un componente che non risponde, spesso la RAM o la scheda video, e non potendo usare lo schermo lo segnala con i suoni. Il secondo si è fermato alla ricerca del dispositivo di avvio (fase 3): nessuna memoria di massa collegata contiene un sistema operativo. Nel terzo il nucleo è stato caricato, quindi le fasi da 1 a 4 sono andate bene: il blocco è nella fase 5, per esempio per un driver difettoso.
```

```ad-note
Spegnere, riavviare, sospendere
Con il riavvio il sistema si chiude e la procedura di avvio riparte dalla fase 1. Con la sospensione, invece, la RAM resta alimentata e conserva il sistema operativo e i programmi aperti: per questo il risveglio dura un attimo, e non è un avvio.
```

## L'interfaccia utente

L'**interfaccia utente** è la parte del sistema operativo attraverso cui una persona dà i comandi e riceve le risposte. È una delle [funzioni del sistema operativo](/materiale/scuola-superiore/informatica/il-sistema-operativo/funzioni-del-sistema-operativo), e ne esistono due tipi principali.

### L'interfaccia a riga di comando

Nell'**interfaccia a riga di comando** (CLI, Command Line Interface) scrivi i comandi con la tastiera, uno per riga, e il sistema risponde con del testo. Il **prompt** è la scritta che il sistema mostra per dire che è pronto a ricevere un comando. Un comando è fatto dal suo nome e, spesso, da uno o più argomenti che dicono su che cosa deve agire. A leggere la riga e a eseguirla è un programma chiamato **interprete dei comandi** (in inglese shell).

| Che cosa vuoi fare | In Windows | In Linux e macOS |
|---|---|---|
| vedere il contenuto della cartella | `dir` | `ls` |
| entrare nella cartella Documenti | `cd Documenti` | `cd Documenti` |
| creare la cartella Storia | `mkdir Storia` | `mkdir Storia` |
| copiare un file | `copy tema.odt copia.odt` | `cp tema.odt copia.odt` |

In `cd Documenti` il nome del comando è `cd` e l'argomento è `Documenti`. I nomi dei comandi cambiano da un sistema all'altro, ma il modo di lavorare è lo stesso.

### L'interfaccia grafica

Nell'**interfaccia grafica** (GUI, Graphical User Interface) i comandi si danno agendo su oggetti disegnati sullo schermo. Gli elementi sono quattro: le finestre, cioè i riquadri in cui lavora ogni programma; le icone, piccoli disegni che rappresentano file, cartelle e programmi; i menu, elenchi di comandi tra cui scegliere; il puntatore, la freccia che sposti con il mouse. Sui telefoni e sui tablet al posto del puntatore ci sono le dita: tocchi, trascini, allarghi.

### Confronto tra le due interfacce

| | Riga di comando | Grafica |
|---|---|---|
| Come dai un comando | lo scrivi | scegli un oggetto sullo schermo |
| Che cosa devi sapere | i nomi dei comandi | quasi niente: i comandi sono in vista |
| Operazioni ripetute | veloci: una riga agisce su molti file | lente: un gesto per ogni file |
| Risorse usate | poche | di più, per disegnare la grafica |
| Errori tipici | un carattere sbagliato e il comando non parte | un clic sull'oggetto sbagliato |

```ad-example
Esempio 3: lo stesso lavoro nei due modi
Devi creare la cartella Storia dentro Documenti. Poi devi copiare in Storia le 300 foto di una gita, i soli file che finiscono con `.jpg` tra i tanti della cartella in cui ti trovi. Quale interfaccia conviene?

Per creare una cartella le due interfacce si equivalgono: con quella grafica apri Documenti, scegli "Nuova cartella" dal menu e scrivi il nome; con la riga di comando scrivi `cd Documenti` e poi `mkdir Storia`.

Per le 300 foto no. Con l'interfaccia grafica devi selezionarle tra gli altri file e trascinarle. Con la riga di comando scrivi una riga sola, perché `*.jpg` vuol dire "tutti i file il cui nome finisce con .jpg": in Linux e macOS, per esempio, `cp *.jpg Documenti/Storia`.
```

```ad-warning
La riga di comando non è un altro sistema operativo
Finestra con i comandi scritti e finestre con le icone sono due interfacce dello stesso sistema: agiscono sugli stessi file e sugli stessi programmi. Una cartella creata con `mkdir` compare anche tra le icone, e non è nemmeno vero che la riga di comando sia roba del passato: chi amministra i server la usa ogni giorno.
```

```ad-warning
L'interfaccia non è tutto il sistema operativo
Quando due sistemi "sembrano uguali" o "sembrano diversi" stai guardando la loro interfaccia. Sotto ci sono il nucleo e le altre funzioni, che non si vedono.
```
