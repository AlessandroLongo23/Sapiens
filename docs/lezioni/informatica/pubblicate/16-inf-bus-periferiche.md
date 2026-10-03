# Bus e periferiche

Ogni volta che la CPU legge una cella di memoria deve far sapere tre cose: quale cella vuole, che la vuole leggere e non scrivere, e poi deve ricevere il contenuto. Sono tre informazioni diverse, e nel computer viaggiano su tre gruppi di collegamenti diversi. Insieme formano il bus, il blocco della [macchina di von Neumann](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-macchina-di-von-neumann) che unisce la CPU alla memoria centrale e alle periferiche.

## I tre bus

Un **bus** è un insieme di **linee**, cioè di collegamenti elettrici affiancati: ogni linea trasporta un bit alla volta. Il bus di un computer si divide in tre parti.

- Il **bus indirizzi** trasporta l'indirizzo della cella di memoria, o della periferica, con cui la CPU vuole comunicare. Gli indirizzi partono sempre dalla CPU: su questo bus i bit viaggiano in un solo verso.
- Il **bus dati** trasporta il valore da leggere o da scrivere. Qui i bit viaggiano nei due versi: verso la CPU in una lettura, dalla CPU in una scrittura.
- Il **bus di controllo** trasporta i comandi che coordinano lo scambio, per esempio il segnale che distingue una lettura da una scrittura.

```tikz
% nome: bus-indirizzi-dati-controllo
% alt: A sinistra il riquadro della CPU, a destra il riquadro di memoria centrale e periferiche; tra i due tre frecce orizzontali una sotto l'altra: il bus indirizzi, con una sola punta rivolta verso destra, il bus dati con due punte e il bus di controllo con due punte
% svg: bus-indirizzi-dati-controllo-bbddd730.svg 300x102
\begin{tikzpicture}
\tikzset{blocco/.style={draw, thick, rounded corners=3pt, minimum width=1.7cm, minimum height=2.6cm, align=center, font=\small, fill=blue!12}}
\node[blocco] (cpu) at (0,0) {CPU};
\node[blocco, minimum width=2.1cm, fill=green!15] (mem) at (5.9,0) {memoria\\centrale e\\periferiche};
\draw[-{Stealth}, very thick] (0.85,0.85) -- node[above, font=\footnotesize] {bus indirizzi} (4.85,0.85);
\draw[{Stealth}-{Stealth}, very thick] (0.85,0) -- node[above, font=\footnotesize] {bus dati} (4.85,0);
\draw[{Stealth}-{Stealth}, very thick] (0.85,-0.85) -- node[above, font=\footnotesize] {bus di controllo} (4.85,-0.85);
\end{tikzpicture}
```

Una lettura dalla memoria avviene in questi passi:

1. la CPU mette sul bus indirizzi l'indirizzo della cella;
2. la CPU manda sul bus di controllo il segnale di lettura;
3. la memoria mette sul bus dati il contenuto della cella;
4. la CPU lo preleva dal bus dati.

In una scrittura cambiano il segnale e il verso del dato: la CPU mette l'indirizzo sul bus indirizzi e il valore sul bus dati, manda il segnale di scrittura, e la memoria copia il valore nella cella.

```ad-example
Esempio 1: leggere una cella
La cella di indirizzo $2040$ contiene il numero $75$, e la CPU la legge. Che cosa viaggia, e dove?

Il numero $2040$ viaggia sul bus indirizzi, dalla CPU alla memoria. Il segnale di lettura viaggia sul bus di controllo, dalla CPU alla memoria. Il numero $75$ viaggia sul bus dati, dalla memoria alla CPU.

Se invece la CPU scrivesse $75$ nella cella $2040$, il $75$ viaggerebbe sempre sul bus dati, ma dalla CPU alla memoria.
```

```ad-warning
L'indirizzo e il contenuto sono due numeri diversi
$2040$ dice dove, $75$ dice che cosa. Viaggiano su bus diversi: se li scambi, la CPU leggerebbe la cella $75$. Quando un esercizio parla di una cella, chiediti sempre se il numero è il suo indirizzo o il suo contenuto.
```

## La larghezza del bus indirizzi

La **larghezza** di un bus è il numero delle sue linee. Ogni linea porta un bit, quindi un bus indirizzi con $n$ linee trasporta indirizzi di $n$ bit. Con $n$ bit si scrivono $2^n$ numeri diversi, da $0$ a $2^n - 1$ (lo spiega la lezione sui [sistemi di numerazione posizionali](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/i-sistemi-di-numerazione-posizionali)), e quindi:

$$\text{celle indirizzabili} = 2^n$$

La larghezza del bus indirizzi decide quanta memoria un computer può usare: una cella che non ha un indirizzo, per la CPU non esiste. Con $3$ linee, per esempio, gli indirizzi possibili sono $2^3 = 8$:

| Linee del bus | $000$ | $001$ | $010$ | $011$ | $100$ | $101$ | $110$ | $111$ |
|---|---|---|---|---|---|---|---|---|
| Indirizzo | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |

Per i conti sul bus indirizzi:

1. dalle linee alle celle: con $n$ linee le celle indirizzabili sono $2^n$, e l'indirizzo più grande è $2^n - 1$;
2. dalle celle alle linee: per $N$ celle serve il più piccolo $n$ per cui $2^n$ è maggiore o uguale a $N$;
3. dalla memoria alle unità: con celle da $1$ byte la memoria indirizzabile è $2^n\,\text{B}$, e si usa $2^{10}\,\text{B} = 1\,\text{KiB}$, $2^{20}\,\text{B} = 1\,\text{MiB}$, $2^{30}\,\text{B} = 1\,\text{GiB}$.

Le [potenze](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n) di due e le unità sono quelle della lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura).

```ad-example
Esempio 2: dalle linee alle celle
Un bus indirizzi ha $16$ linee, e le celle sono da $1$ byte. Quante celle può indirizzare? Qual è l'indirizzo più grande? Quanta memoria è?

1. Le celle sono $2^{16} = 65\,536$.
2. L'indirizzo più grande è $65\,536 - 1 = 65\,535$.
3. La memoria è $2^{16}\,\text{B} = 2^6 \cdot 2^{10}\,\text{B} = 64\,\text{KiB}$.
```

```ad-warning
Una linea in più raddoppia, non aggiunge
Passando da $16$ a $17$ linee le celle indirizzabili non aumentano di poco: raddoppiano, da $65\,536$ a $131\,072$. E con $16$ linee le celle non sono $2 \cdot 16 = 32$ né $16^2 = 256$: sono $2^{16}$.
```

```ad-example
Esempio 3: dalle celle alle linee
Una memoria ha $1000$ celle. Quante linee deve avere, come minimo, il bus indirizzi?

Si cercano le potenze di due vicine a $1000$: $2^9 = 512$ e $2^{10} = 1024$. Con $9$ linee si arriva solo a $512$ celle, che non bastano; con $10$ linee si arriva a $1024$, che bastano. Servono $10$ linee, e $24$ indirizzi restano inutilizzati.

Se le celle fossero state esattamente $1024$, la risposta sarebbe stata ancora $10$: $2^{10} = 1024$ indirizzi, da $0$ a $1023$.
```

```ad-example
Esempio 4: un bus a 32 linee
Un bus indirizzi ha $32$ linee, con celle da $1$ byte. Quanta memoria può indirizzare?

La memoria è $2^{32}\,\text{B}$. Si separa la potenza che corrisponde all'unità più grande possibile: $2^{32} = 2^2 \cdot 2^{30}$, e $2^{30}\,\text{B} = 1\,\text{GiB}$. Quindi $2^{32}\,\text{B} = 4\,\text{GiB}$.

In byte sono $4\,294\,967\,296$: con i numeri scritti per esteso il conto è molto più lungo che con le potenze.
```

Anche il bus dati ha una larghezza: è il numero di bit che viaggiano insieme in un solo trasferimento. Con un bus dati di $8$ linee passa un byte alla volta.

## Le periferiche

Le **periferiche** sono i dispositivi con cui il computer scambia dati con l'esterno. Si classificano secondo il verso in cui viaggiano i dati, visto dal computer.

| Tipo | Verso dei dati | Esempi |
|---|---|---|
| di ingresso (input) | dall'esterno al computer | tastiera, mouse, microfono, webcam, scanner, sensori |
| di uscita (output) | dal computer all'esterno | monitor, stampante, altoparlanti, cuffie, proiettore |
| di ingresso e di uscita | nei due versi | schermo tattile, memorie di massa, scheda di rete |

```tikz
% nome: periferiche-ingresso-uscita
% alt: Al centro un riquadro con CPU e memoria centrale; a sinistra tastiera, mouse e microfono con frecce che entrano nel riquadro; a destra monitor, stampante e altoparlanti con frecce che escono; sotto, schermo tattile e memorie di massa collegati al riquadro da una freccia a due punte
% svg: periferiche-ingresso-uscita-905d0587.svg 287x148
\begin{tikzpicture}
\tikzset{p/.style={font=\footnotesize, anchor=center}}
\node[draw, thick, rounded corners=3pt, fill=blue!12, minimum width=2.2cm, minimum height=1.9cm, align=center, font=\small] (c) at (0,0) {CPU e\\memoria\\centrale};
\node[p] (t) at (-2.9,0.7) {tastiera};
\node[p] (m) at (-2.9,0) {mouse};
\node[p] (mi) at (-2.9,-0.7) {microfono};
\node[p] (mo) at (2.95,0.7) {monitor};
\node[p] (s) at (2.95,0) {stampante};
\node[p] (a) at (2.95,-0.7) {altoparlanti};
\draw[-{Stealth}, thick] (-2.1,0.7) -- (-1.15,0.7);
\draw[-{Stealth}, thick] (-2.1,0) -- (-1.15,0);
\draw[-{Stealth}, thick] (-2.1,-0.7) -- (-1.15,-0.7);
\draw[-{Stealth}, thick] (1.15,0.7) -- (2.0,0.7);
\draw[-{Stealth}, thick] (1.15,0) -- (2.0,0);
\draw[-{Stealth}, thick] (1.15,-0.7) -- (2.0,-0.7);
\draw[{Stealth}-{Stealth}, thick] (0,-1.0) -- (0,-1.75);
\node[p] at (0,-2.0) {schermo tattile, memorie di massa};
\node[p] at (-2.9,1.35) {ingresso};
\node[p] at (2.95,1.35) {uscita};
\end{tikzpicture}
```

Le memorie di massa sono periferiche di ingresso e di uscita perché il computer vi scrive i file e poi li rilegge. La scheda di rete manda e riceve dati da altri computer.

```ad-warning
Il verso si guarda dal computer, non da te
Il microfono è una periferica di ingresso anche se tu "mandi fuori" la voce: per il computer il suono entra. Le cuffie sono di uscita anche se per te il suono "entra" nelle orecchie. Lo schermo tattile è di ingresso quando lo tocchi e di uscita quando mostra un'immagine, quindi è tutte e due le cose.
```

```ad-example
Esempio 5: classificare le periferiche
Durante una videochiamata con il portatile usi la webcam, il microfono, gli altoparlanti e lo schermo, che non è tattile. Di che tipo è ciascuna periferica? E il processore?

La webcam e il microfono portano dentro l'immagine e la voce: sono di ingresso. Gli altoparlanti e lo schermo portano fuori il suono e l'immagine dell'altra persona: sono di uscita. Il processore non è una periferica: è la CPU, che insieme alla memoria centrale sta al centro dello schema.
```

## Porte e interfacce

Una periferica non si collega direttamente al bus. Tra il bus e la periferica c'è un'**interfaccia**, un circuito che traduce i segnali del bus in quelli che la periferica capisce e viceversa: una tastiera, una stampante e un monitor "parlano" in modi molto diversi, e ognuno ha bisogno del suo traduttore.

La **porta** è il punto di attacco, cioè il connettore in cui si infila il cavo della periferica. Alcune porte servono per molti tipi di periferica, come la porta USB (Universal Serial Bus), a cui si collegano tastiere, chiavette e stampanti; altre hanno uno scopo preciso, come la porta HDMI per il monitor, la presa per le cuffie o la porta di rete. Le interfacce senza fili, come Bluetooth e Wi-Fi, fanno lo stesso lavoro usando onde radio al posto del cavo, e quindi non hanno una porta.

Perché una periferica funzioni serve anche un programma che sappia comandarla: è un compito del sistema operativo, di cui parla la lezione [Funzioni del sistema operativo](/materiale/scuola-superiore/informatica/il-sistema-operativo/funzioni-del-sistema-operativo).

```ad-example
Esempio 6: porta, interfaccia, bus
Colleghi una chiavetta a una porta USB e copi una foto dal portatile alla chiavetta. Che strada fanno i dati?

I byte della foto partono dalla memoria centrale e viaggiano sul bus dati fino all'interfaccia USB. L'interfaccia li traduce nei segnali del cavo USB e li manda, attraverso la porta, alla chiavetta. In questo trasferimento la chiavetta lavora come periferica di uscita; quando rileggerai la foto lavorerà come periferica di ingresso.
```
