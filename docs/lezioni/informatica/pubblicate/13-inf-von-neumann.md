# La macchina di von Neumann

Con lo stesso telefono fai una foto, giochi, apri il registro elettronico e usi la calcolatrice. I circuiti sono sempre gli stessi: quello che cambia è il programma che stanno eseguendo. Quasi tutti i computer, dal telefono al supercomputer, sono costruiti secondo lo stesso schema, che prende il nome dal matematico John von Neumann e che spiega come una sola macchina possa fare lavori così diversi.

## Il programma memorizzato

Un **programma** è una sequenza di **istruzioni**, cioè di ordini elementari che la macchina sa eseguire: prendi questo numero, sommalo a quest'altro, mostra il risultato. La calcolatrice del telefono è un programma, e lo sono anche il gioco e l'app del registro.

I primi calcolatori elettronici degli anni Quaranta avevano il programma "scritto nei fili": per passare da un calcolo a un altro bisognava spostare cavi e interruttori, un lavoro che poteva durare giorni. Nel 1945 von Neumann descrisse, in una relazione sul progetto del calcolatore EDVAC, una macchina in cui le istruzioni sono scritte nella memoria, in forma di numeri, accanto ai dati su cui lavorano. È l'idea del **programma memorizzato**: programmi e dati stanno nella stessa memoria, scritti nello stesso modo, cioè come sequenze di [bit](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura).

Le conseguenze sono due. La prima: per far fare alla macchina un altro lavoro non si toccano i circuiti, si carica in memoria un altro programma. Quando sul telefono chiudi il gioco e apri la calcolatrice succede proprio questo. La seconda: un programma è un dato come gli altri, e quindi si può copiare, scaricare dalla rete, aggiornare.

```ad-warning
Le istruzioni non stanno nella CPU
È facile pensare che il programma sia "dentro il processore" e che in memoria ci siano solo i dati. Nella macchina di von Neumann istruzioni e dati stanno tutti e due nella memoria centrale: la CPU va a prendere le istruzioni lì, una alla volta.
```

```ad-note
Bit che sono istruzioni, bit che sono dati
Guardando una cella di memoria non si può dire se i suoi bit sono un numero, una lettera o un'istruzione: dipende da come la macchina li usa. È la stessa cosa che succede con i [codici](/materiale/scuola-superiore/informatica/informatica-e-informazione/informazione-dati-e-codici): la stessa sequenza di bit ha significati diversi secondo il codice con cui la si legge.
```

## I quattro blocchi

La **macchina di von Neumann** è uno schema fatto di quattro blocchi, ognuno con un compito.

- L'**unità centrale di elaborazione (CPU)**, dall'inglese Central Processing Unit, esegue le istruzioni del programma: fa i calcoli, confronta i valori e decide quale istruzione viene dopo. Nel telefono e nel portatile è il processore.
- La **memoria centrale** conserva il programma in esecuzione e i dati su cui sta lavorando. Mentre giochi, lì ci sono le istruzioni del gioco e il tuo punteggio. È la memoria che sullo schermo trovi indicata come RAM.
- Le **periferiche** mettono in comunicazione la macchina con l'esterno. Quelle di ingresso portano dentro i dati (la tastiera, il microfono, lo schermo quando lo tocchi); quelle di uscita portano fuori i risultati (lo schermo quando mostra un'immagine, gli altoparlanti, la stampante).
- Il **bus** è l'insieme dei collegamenti su cui i bit viaggiano da un blocco all'altro. Non conserva niente e non calcola niente: trasporta.

```tikz
% nome: macchina-von-neumann-blocchi
% alt: Schema a blocchi della macchina di von Neumann: in alto tre riquadri affiancati, CPU, memoria centrale e periferiche; in basso una barra orizzontale, il bus, collegata a ciascun riquadro da una freccia a due punte; a destra delle periferiche due frecce indicano i dati che entrano dall'esterno e i risultati che escono
% svg: macchina-von-neumann-blocchi-80ec88ff.svg 290x135
\begin{tikzpicture}
\tikzset{blocco/.style={draw, thick, rounded corners=3pt, minimum width=2.1cm, minimum height=1.1cm, align=center, font=\small}}
\node[blocco, fill=blue!12] (cpu) at (0,0) {CPU};
\node[blocco, fill=blue!12] (mem) at (2.5,0) {memoria\\centrale};
\node[blocco, fill=green!15] (per) at (5,0) {periferiche};
\draw[thick, fill=orange!25, rounded corners=2pt] (-1.05,-2.0) rectangle (6.05,-1.45);
\node[font=\small] at (2.5,-1.725) {bus};
\draw[{Stealth}-{Stealth}, thick] (cpu.south) -- (0,-1.45);
\draw[{Stealth}-{Stealth}, thick] (mem.south) -- (2.5,-1.45);
\draw[{Stealth}-{Stealth}, thick] (per.south) -- (5,-1.45);
\draw[-{Stealth}, thick] (4.6,1.45) -- (4.6,0.55);
\draw[-{Stealth}, thick] (5.4,0.55) -- (5.4,1.45);
\node[font=\footnotesize, anchor=east] at (4.5,1.1) {ingresso};
\node[font=\footnotesize, anchor=west] at (5.5,1.1) {uscita};
\end{tikzpicture}
```

Nello schema la CPU e la memoria centrale non parlano mai direttamente con l'esterno: tutto quello che entra e che esce passa dalle periferiche, e tutto quello che si sposta da un blocco all'altro passa dal bus.

```ad-example
Esempio 1: i blocchi in un telefono
Stai scrivendo un messaggio. A quale blocco appartiene ogni parte in gioco?

Lo schermo, quando lo tocchi per scrivere, è una periferica di ingresso; quando mostra le lettere è una periferica di uscita. Il processore, che esegue le istruzioni dell'app dei messaggi, è la CPU. L'app aperta e il testo che stai scrivendo si trovano nella memoria centrale. I collegamenti tra questi componenti, piste sottilissime di metallo sulla scheda del telefono, sono il bus.
```

```ad-warning
Il disco non è la memoria centrale
Nello schema la parola "memoria" indica solo la memoria centrale, quella in cui lavora il programma in esecuzione. Il disco del portatile, la memoria interna del telefono, una chiavetta USB sono memorie di massa: conservano i file anche a computer spento e nello schema stanno tra le periferiche, perché la CPU ci scrive e ci legge come fa con l'esterno. La differenza tra le due memorie è l'argomento della lezione [Memoria centrale e memorie di massa](/materiale/scuola-superiore/informatica/l-architettura-del-computer/memoria-centrale-e-memorie-di-massa).
```

## Il viaggio di un dato

I quattro blocchi lavorano insieme sempre nello stesso modo. Quando un dato entra, viene elaborato e il risultato esce, i passi sono questi:

1. una periferica di ingresso riceve il dato dall'esterno;
2. il dato viaggia sul bus e viene scritto nella memoria centrale;
3. la CPU preleva dalla memoria centrale l'istruzione da eseguire e i dati che le servono;
4. la CPU esegue l'istruzione;
5. il risultato viaggia sul bus e viene scritto nella memoria centrale;
6. il risultato passa dalla memoria centrale a una periferica di uscita, che lo porta all'esterno.

I passi 3, 4 e 5 si ripetono per ogni istruzione del programma, milioni di volte al secondo: come la CPU li compie è spiegato nella lezione [La CPU e il ciclo di esecuzione delle istruzioni](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-cpu-e-il-ciclo-di-esecuzione-delle-istruzioni).

```ad-example
Esempio 2: la calcolatrice fa 7 + 5
Sulla calcolatrice del telefono tocchi 7, poi +, poi 5, poi =. Che cosa fanno i blocchi?

1. Lo schermo, periferica di ingresso, riceve i tocchi: i numeri $7$ e $5$ e l'operazione.
2. I due numeri viaggiano sul bus e vengono scritti nella memoria centrale, dove c'è già il programma della calcolatrice.
3. La CPU preleva dalla memoria l'istruzione di somma e i due numeri.
4. La CPU esegue la somma: $7 + 5 = 12$.
5. Il risultato $12$ viene scritto nella memoria centrale.
6. Il $12$ passa allo schermo, questa volta periferica di uscita, che lo mostra.
```

```ad-example
Esempio 3: un salto in un videogioco
Giochi con una console: premi il tasto del salto e il personaggio salta. Da dove a dove viaggiano i dati?

Il tasto premuto entra dal controller, periferica di ingresso, e viene scritto nella memoria centrale (passi 1 e 2). La CPU preleva dalla memoria le istruzioni del gioco e la posizione del personaggio, e calcola la posizione nuova (passi 3 e 4). La posizione nuova torna in memoria (passo 5), e l'immagine con il personaggio in aria va allo schermo, periferica di uscita (passo 6).

Tra il passo 1 e il passo 6 i dati sono passati dal bus quattro volte: dal controller alla memoria, dalla memoria alla CPU, dalla CPU alla memoria, dalla memoria allo schermo.
```

```ad-warning
Il bus non elabora e non conserva
Il bus è una strada, non un deposito e non un'officina. Se ti chiedono chi ha calcolato la somma la risposta è la CPU; se ti chiedono dove si trova il risultato dopo il calcolo la risposta è la memoria centrale. Il bus è la risposta solo quando la domanda è "per dove è passato".
```

```ad-example
Esempio 4: lo stesso schema, senza tastiera e senza schermo
Una lavatrice ha dentro un piccolo computer. Dove sono i quattro blocchi?

Le periferiche di ingresso sono i pulsanti del programma di lavaggio e il sensore che misura la temperatura dell'acqua; quelle di uscita sono il motore del cestello, la resistenza che scalda l'acqua e le spie luminose. La CPU e la memoria centrale, con il programma che decide quando scaldare e quando far girare il cestello, stanno su una scheda dietro il pannello, collegate dal bus.

Lo schema è lo stesso del telefono: cambiano le periferiche, le dimensioni e la potenza. Lo ritrovi nella lezione [Computer, dispositivi mobili e sistemi embedded](/materiale/scuola-superiore/informatica/l-architettura-del-computer/computer-dispositivi-mobili-e-sistemi-embedded).
```

## Dallo schema al computer vero

Lo schema di von Neumann dice quali sono le parti e come sono collegate, non come sono fatte. È un modello dell'[hardware](/materiale/scuola-superiore/informatica/informatica-e-informazione/hardware-e-software): in un computer vero ogni blocco è formato da molti componenti, e le prossime lezioni del capitolo li aprono uno alla volta.

| Blocco | Che cosa fa | Lezione |
|---|---|---|
| CPU | esegue le istruzioni | [La CPU e il ciclo di esecuzione delle istruzioni](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-cpu-e-il-ciclo-di-esecuzione-delle-istruzioni) |
| memoria centrale | conserva programma e dati in uso | [Memoria centrale e memorie di massa](/materiale/scuola-superiore/informatica/l-architettura-del-computer/memoria-centrale-e-memorie-di-massa) |
| periferiche | scambiano dati con l'esterno | [Bus e periferiche](/materiale/scuola-superiore/informatica/l-architettura-del-computer/bus-e-periferiche) |
| bus | trasporta i bit tra i blocchi | [Bus e periferiche](/materiale/scuola-superiore/informatica/l-architettura-del-computer/bus-e-periferiche) |

I computer di oggi hanno processori che contengono più unità di calcolo e memorie di tipi diversi, ma sono fatti ancora di questi quattro blocchi ed eseguono ancora programmi memorizzati.
