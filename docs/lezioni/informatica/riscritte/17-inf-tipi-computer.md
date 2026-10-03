# Computer, dispositivi mobili e sistemi embedded

Un supercomputer occupa una sala intera e consuma quanto un paese; il computer che comanda una lavatrice sta su una scheda grande come un biglietto del tram e costa pochi euro. In mezzo ci sono il portatile, il telefono, i server che tengono in piedi il registro elettronico. Sembrano oggetti senza niente in comune, e invece sono tutti [macchine di von Neumann](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-macchina-di-von-neumann): cambia la taglia, non lo schema.

## Che cosa resta uguale

In ogni computer, di qualunque taglia, ritrovi le stesse quattro parti: una CPU che esegue le istruzioni, una memoria centrale che contiene programma e dati, delle periferiche per scambiare dati con l'esterno e un bus che le collega. E ogni computer lavora nello stesso modo: esegue un programma memorizzato, un'istruzione dopo l'altra, con il [ciclo di esecuzione](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-cpu-e-il-ciclo-di-esecuzione-delle-istruzioni).

Per questo, davanti a un dispositivo che non conosci, le domande da farsi sono sempre le stesse: dov'è la CPU, da dove entrano i dati, da dove escono i risultati, dove sta il programma.

## Che cosa cambia

Le differenze stanno in poche caratteristiche:

- la potenza di calcolo, cioè quante istruzioni vengono eseguite in un secondo, e la quantità di memoria;
- le dimensioni, il consumo di energia e il costo;
- le periferiche: tastiera e schermo, uno schermo tattile, oppure solo sensori e motori;
- chi lo usa: una persona alla volta, migliaia di persone attraverso la rete, oppure nessuno direttamente;
- che cosa può fare: un computer di **uso generale** esegue qualsiasi programma gli si installi; un computer **dedicato** esegue sempre lo stesso programma, per un compito solo.

## Le famiglie di computer

```tikz
% nome: famiglie-di-computer
% alt: Cinque riquadri in colonna, dal basso verso l'alto: sistema embedded, dispositivo mobile, personal computer, server, supercomputer; a destra una freccia verso l'alto con la scritta più potenza, più consumo, più costo; a sinistra una freccia verso il basso con la scritta più piccoli, più numerosi
% svg: famiglie-di-computer-f89af5a2.svg 258x173
\begin{tikzpicture}
\tikzset{f/.style={draw, thick, rounded corners=2pt, font=\small, minimum height=0.62cm, minimum width=3.4cm, fill=blue!12}}
\node[f, fill=orange!30] at (0,2.8) {supercomputer};
\node[f] at (0,2.1) {server};
\node[f] at (0,1.4) {personal computer};
\node[f] at (0,0.7) {dispositivo mobile};
\node[f, fill=green!15] at (0,0) {sistema embedded};
\draw[-{Stealth}, thick] (2.1,-0.3) -- (2.1,3.1);
\draw[-{Stealth}, thick] (-2.1,3.1) -- (-2.1,-0.3);
\node[font=\footnotesize, align=center] at (2.2,-0.95) {più potenza, più\\consumo, più costo};
\node[font=\footnotesize, align=center] at (-2.2,-0.95) {più piccoli,\\più numerosi};
\end{tikzpicture}
```

Un **supercomputer** è formato da migliaia di processori che lavorano insieme a un solo calcolo enorme, diviso in tante parti: le previsioni del tempo, la simulazione del clima, lo studio di una proteina per un nuovo farmaco. Occupa una sala, ha bisogno di un impianto di raffreddamento e lo usano, a turno, molti gruppi di ricerca. In Italia c'è Leonardo, a Bologna.

Un **server** è un computer che offre un servizio ad altri computer attraverso la rete: conserva le pagine di un sito, i voti del registro elettronico, i film di un servizio di streaming, e li manda a chi li chiede. Resta acceso giorno e notte, spesso insieme a migliaia di altri server in grandi edifici chiamati data center, e di solito non ha né tastiera né schermo: ci si collega da un altro computer.

Il **personal computer** è il computer di uso generale per una persona alla volta. Può essere fisso, con monitor, tastiera e mouse separati, oppure portatile, con tutto in un solo oggetto e una batteria.

I **dispositivi mobili**, cioè smartphone, tablet e smartwatch, sono computer di uso generale fatti per stare in mano o al polso: funzionano a batteria, e quindi hanno CPU progettate per consumare poco; la periferica principale è lo schermo tattile; hanno molti sensori (fotocamera, microfono, ricevitore GPS, sensore di movimento) e sono quasi sempre collegati alla rete.

Un **sistema embedded** (in italiano "incorporato") è un computer chiuso dentro un altro oggetto, dedicato a farlo funzionare: la lavatrice, il forno, il semaforo, l'ascensore, i freni dell'auto. Non lo vedi e non lo usi come un computer, ma è il tipo di computer più numeroso: in una casa ce ne sono decine, in un'automobile altrettanti.

```ad-warning
Lo smartphone è un computer
Non ha tastiera e sta in tasca, ma ha CPU, memoria centrale, memoria di massa e periferiche, ed esegue qualsiasi programma tu installi: è un computer di uso generale come un portatile. Non è un sistema embedded, anche se è piccolo.
```

```ad-warning
Server è un ruolo, non una taglia
Un server non è per forza una macchina enorme: è un computer che offre un servizio ad altri. Anche un vecchio portatile che conserva i file condivisi di una classe sta facendo il server.
```

| | Chi lo usa | Quali programmi esegue | Periferiche tipiche |
|---|---|---|---|
| supercomputer | molti gruppi di ricerca, a turno | i calcoli dei ricercatori | si usa attraverso la rete |
| server | molte persone, attraverso la rete | quelli del servizio che offre | scheda di rete, memorie di massa |
| personal computer | una persona | quelli che installi | tastiera, mouse, monitor |
| dispositivo mobile | una persona | quelli che installi | schermo tattile, sensori |
| sistema embedded | nessuno direttamente | uno solo, messo in fabbrica | sensori e attuatori |

## Dentro un sistema embedded

Il cuore di un sistema embedded è di solito un **microcontrollore**: un solo componente che contiene una CPU, una piccola memoria centrale, una memoria non volatile con il programma e le interfacce per le periferiche. È un computer completo in un chip, molto meno potente di quello di un telefono, ma piccolo, economico e capace di funzionare per anni con pochissima energia.

Le sue periferiche non sono tastiere e schermi. In ingresso ci sono i **sensori**, che misurano una grandezza (una temperatura, una velocità, un tasto premuto) e la trasformano in un dato. In uscita ci sono gli **attuatori**, che trasformano un dato in un'azione: un motore che gira, una valvola che si apre, una resistenza che scalda, una spia che si accende.

```tikz
% nome: sistema-embedded-sensori-attuatori
% alt: Schema di un sistema embedded: a sinistra i sensori, con una freccia che entra in un riquadro centrale, il microcontrollore, che contiene CPU, memoria e interfacce; dal riquadro una freccia esce verso gli attuatori, a destra
% svg: sistema-embedded-sensori-attuatori-705a4e98.svg 315x73
\begin{tikzpicture}
\node[draw, thick, rounded corners=3pt, fill=blue!12, minimum width=2.9cm, minimum height=1.7cm, align=center, font=\small] (m) at (0,0) {microcontrollore\\[2pt]{\footnotesize CPU, memoria,}\\{\footnotesize interfacce}};
\node[draw, thick, rounded corners=3pt, fill=green!15, minimum width=1.6cm, minimum height=0.8cm, font=\small] (s) at (-3.3,0) {sensori};
\node[draw, thick, rounded corners=3pt, fill=orange!25, minimum width=1.6cm, minimum height=0.8cm, font=\small] (a) at (3.3,0) {attuatori};
\draw[-{Stealth}, thick] (s.east) -- (m.west);
\draw[-{Stealth}, thick] (m.east) -- (a.west);
\node[font=\footnotesize] at (-3.3,-0.75) {ingresso};
\node[font=\footnotesize] at (3.3,-0.75) {uscita};
\end{tikzpicture}
```

Il programma di un sistema embedded viene scritto nella memoria non volatile in fabbrica e resta sempre quello: ripete all'infinito "leggi i sensori, decidi, comanda gli attuatori".

```ad-example
Esempio 1: i blocchi di un termostato
Il termostato di casa accende la caldaia quando la temperatura della stanza scende sotto quella che hai scelto. Dove sono i blocchi della macchina di von Neumann?

Le periferiche di ingresso sono il sensore di temperatura e i tasti con cui scegli i gradi. Le periferiche di uscita sono l'interruttore che accende la caldaia e il piccolo schermo. La CPU e la memoria sono dentro il microcontrollore: la CPU confronta la temperatura misurata con quella scelta, e la memoria contiene il programma e i due valori.

Il viaggio del dato è quello di sempre: la temperatura entra dal sensore, la CPU la confronta con quella scelta, il comando esce verso la caldaia.
```

```ad-example
Esempio 2: quale computer per quale lavoro
Che tipo di computer serve per ciascuno di questi compiti?

- Calcolare le previsioni del tempo per tutta l'Europa: i calcoli sono enormi e vanno finiti in poche ore, quindi serve un supercomputer.
- Far consultare i voti a tutti gli studenti di una scuola: serve un computer sempre acceso che risponda alle richieste che arrivano dalla rete, cioè un server.
- Scrivere e impaginare la tesina: tastiera, schermo grande e programmi da installare, quindi un personal computer.
- Trovare la strada a piedi in una città che non conosci: serve un computer che stia in tasca, con il ricevitore GPS, cioè un dispositivo mobile.
- Tenere il forno a $180\,^\circ\text{C}$: un compito solo, sempre lo stesso, dentro un altro oggetto. È un sistema embedded.
```

```ad-example
Esempio 3: uso generale o dedicato
Un tablet, la centralina di un semaforo, un portatile, la scheda di un forno a microonde: quali sono sistemi embedded?

Il criterio è che cosa possono eseguire. Sul tablet e sul portatile installi i programmi che vuoi: sono computer di uso generale. La centralina del semaforo e la scheda del forno eseguono un solo programma, messo in fabbrica, per far funzionare l'oggetto in cui si trovano: sono sistemi embedded.
```

```ad-example
Esempio 4: sensori e attuatori di una lavatrice
In una lavatrice, classifica: il sensore di temperatura dell'acqua, il motore del cestello, la manopola dei programmi, la resistenza che scalda l'acqua.

Il sensore di temperatura e la manopola portano un dato dentro il microcontrollore: sono periferiche di ingresso. Il motore e la resistenza ricevono un comando e lo trasformano in un'azione: sono attuatori, cioè periferiche di uscita.
```

```ad-warning
Senza tastiera e senza schermo le periferiche ci sono lo stesso
Un sistema embedded può non avere niente di ciò che di solito chiami periferica. Le sue periferiche sono i sensori e gli attuatori: senza di loro il microcontrollore non saprebbe che cosa succede fuori e non potrebbe fare niente.
```

## I confini non sono netti

Queste famiglie servono a orientarsi, non sono cassetti separati. Una console per videogiochi e un televisore con le app stanno a metà tra il sistema dedicato e il computer di uso generale; un portatile può fare da server; e il telefono che hai in tasca è più potente dei supercomputer di qualche decennio fa. Quello che non cambia è lo schema: CPU, memoria, periferiche, bus, e un programma memorizzato da eseguire.
