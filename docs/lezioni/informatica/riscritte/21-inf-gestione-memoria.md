# La gestione della memoria

Venti schede aperte nel browser, un gioco in pausa, la musica, una chat: ogni programma aperto ha istruzioni e dati che devono stare nella memoria centrale (RAM), perché la CPU lavora solo su quello che trova lì. La RAM però ha una capacità fissata, e i programmi ne chiedono sempre di più. A decidere chi riceve quale parte, e che cosa fare quando lo spazio finisce, è il sistema operativo.

## A ogni processo la sua memoria

Quando avvii un programma, il sistema operativo crea un [processo](/materiale/scuola-superiore/informatica/il-sistema-operativo/processi-thread-e-multitasking) e gli assegna una zona della RAM per le istruzioni e per i dati. Se il processo ha bisogno di altro spazio, per esempio perché apri una foto molto grande, lo chiede al sistema, che gliene assegna dell'altro. Quando il processo termina, tutta la sua memoria torna libera.

Il sistema operativo fa anche da guardiano: un processo può leggere e scrivere solo nella memoria che gli è stata assegnata. Questa **protezione della memoria** è il motivo per cui un gioco che va in errore non rovina il tema che stai scrivendo in un altro programma. Se un processo prova a uscire dalla sua zona, il sistema lo ferma.

## La memoria virtuale

Assegnare a ogni processo un pezzo unico di RAM funziona male: i processi nascono, crescono e terminano di continuo, e lo spazio libero si spezzetta in tanti buchi, nessuno abbastanza grande per un programma nuovo. Inoltre la somma delle richieste può superare la RAM installata.

La soluzione è la **memoria virtuale**. Ogni processo vede una memoria tutta sua, numerata da zero, come se il computer fosse a sua disposizione. In quali punti della RAM stiano davvero i suoi dati lo sa solo il sistema operativo, che insieme alla CPU traduce ogni posizione vista dal processo nella posizione reale. Al processo non importa dove sono i dati, e nemmeno se in quel momento sono tutti nella RAM.

## La paginazione

Per realizzare la memoria virtuale si usa la **paginazione**. La memoria di ogni processo è divisa in blocchi di dimensione fissa, le **pagine**. La RAM è divisa in blocchi della stessa dimensione, i **frame**. Una pagina può essere messa in un frame qualsiasi che sia libero: le pagine di uno stesso processo possono stare in punti lontani della RAM, e i buchi non sono più un problema, perché ogni frame libero va bene per qualunque pagina.

Per ogni processo il sistema tiene una **tabella delle pagine**, che dice dove si trova ciascuna pagina: in quale frame, oppure fuori dalla RAM.

```tikz
% nome: paginazione-pagine-frame
% alt: A sinistra le quattro pagine di un processo, numerate da 0 a 3; a destra la RAM divisa in sei frame. Tre frecce portano la pagina 0 al frame 2, la pagina 1 al frame 5 e la pagina 2 al frame 0; gli altri frame sono di altri processi. Una quarta freccia porta la pagina 3 fuori dalla RAM, nell'area di swap sulla memoria di massa
\begin{tikzpicture}
\tikzset{blocco/.style={draw, thick, minimum width=1.9cm, minimum height=0.55cm, font=\small}}
\node[font=\small] at (0,0.75) {processo};
\foreach \i in {0,1,2,3} \node[blocco, fill=blue!12] (p\i) at (0,{-0.55*\i}) {pagina \i};
\node[font=\small] at (4.6,1.3) {RAM};
\foreach \j/\t/\c in {0/pagina 2/blue!12, 1/altro processo/gray!20, 2/pagina 0/blue!12, 3/altro processo/gray!20, 4/libero/green!10, 5/pagina 1/blue!12} {
  \node[blocco, minimum width=2.6cm, fill=\c] (f\j) at (4.6,{0.55-0.55*\j}) {\t};
  \node[font=\small] at (6.2,{0.55-0.55*\j}) {\j};
}
\node[blocco, minimum width=2.6cm, fill=orange!25] (s) at (4.6,-3.6) {pagina 3};
\node[font=\small] at (4.6,-3.05) {area di swap};
\draw[-{Stealth}, thick] (p0.east) -- (f2.west);
\draw[-{Stealth}, thick] (p1.east) -- (f5.west);
\draw[-{Stealth}, thick] (p2.east) -- (f0.west);
\draw[-{Stealth}, thick] (p3.east) -- (s.west);
\end{tikzpicture}
```

La dimensione di una pagina è fissata dal sistema; un valore molto diffuso è $4\,\text{KiB}$, cioè $4096\,\text{B}$. Le unità sono quelle della lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura): $1\,\text{KiB} = 1024\,\text{B}$ e $1\,\text{MiB} = 1024\,\text{KiB}$.

Per sapere quante pagine servono a un processo:

1. Scrivi la memoria richiesta dal processo e la dimensione di una pagina nella stessa unità.
2. Dividi la memoria richiesta per la dimensione di una pagina.
3. Se la divisione non è esatta, arrotonda per eccesso: anche un solo byte in più richiede una pagina intera.

```ad-example
Esempio 1: divisione esatta
Un processo chiede $48\,\text{KiB}$ di memoria e le pagine sono di $4\,\text{KiB}$. Quante pagine gli servono?

$$48 : 4 = 12$$

Servono $12$ pagine, tutte piene.
```

```ad-example
Esempio 2: divisione con il resto
Un processo chiede $50\,\text{KiB}$ di memoria e le pagine sono di $4\,\text{KiB}$. Quante pagine gli servono, e quanta memoria riceve?

$$50 : 4 = 12{,}5$$

Dodici pagine contengono $48\,\text{KiB}$ e ne lasciano fuori $2$: servono $13$ pagine. Il processo riceve $13 \cdot 4 = 52\,\text{KiB}$, e nell'ultima pagina $52 - 50 = 2\,\text{KiB}$ restano inutilizzati.
```

```ad-warning
Le pagine si arrotondano sempre per eccesso
Con $12{,}5$ la risposta è $13$, e sarebbe $13$ anche con $12{,}1$: non esistono mezze pagine, e arrotondando per difetto una parte del programma resterebbe senza memoria. Lo spazio che avanza nell'ultima pagina è assegnato al processo e non può usarlo nessun altro.
```

```ad-example
Esempio 3: unità diverse
Un processo chiede $3\,\text{MiB}$ di memoria e le pagine sono di $4\,\text{KiB}$. Quante pagine gli servono?

Prima si portano i dati alla stessa unità: $3\,\text{MiB} = 3 \cdot 1024 = 3072\,\text{KiB}$. Poi si divide:

$$3072 : 4 = 768$$

Servono $768$ pagine. Dividere $3$ per $4$ senza convertire è l'errore da evitare: darebbe meno di una pagina per un programma di tre mebibyte.
```

## Lo swap

Con la paginazione le pagine di un processo non devono stare tutte nella RAM nello stesso momento. Un programma usa in ogni istante solo una piccola parte di sé: di un gioco con cento livelli serve quello in cui stai giocando.

Il sistema operativo riserva sulla memoria di massa una zona chiamata **area di swap**. Quando la RAM è piena e serve un frame, il sistema sceglie una pagina che non viene usata da un po', la copia nell'area di swap e libera il suo frame. Se più tardi il processo ha bisogno proprio di quella pagina, avviene un **page fault**: il sistema sospende il processo, ricopia la pagina dall'area di swap in un frame libero, aggiorna la tabella delle pagine e fa ripartire il processo, che non si accorge di niente, se non del ritardo.

```ad-example
Esempio 4: quante pagine finiscono nello swap
La RAM ha $16$ frame liberi. Tre processi chiedono $6$, $7$ e $5$ pagine. Ci stanno tutte?

Le pagine richieste sono $6 + 7 + 5 = 18$, i frame liberi $16$. Restano fuori $18 - 16 = 2$ pagine, che il sistema tiene nell'area di swap. Se i frame liberi fossero stati $20$, ne sarebbero rimasti liberi $20 - 18 = 2$ e lo swap non sarebbe servito.
```

## Quando la RAM finisce

Lo swap permette di tenere aperti più programmi di quanti la RAM ne contenga, ma ha un prezzo: la memoria di massa è molto più lenta della RAM, come spiega la lezione [Memoria centrale e memorie di massa](/materiale/scuola-superiore/informatica/l-architettura-del-computer/memoria-centrale-e-memorie-di-massa). Finché i page fault sono rari, non te ne accorgi. Quando la RAM è molto più piccola di quello che i programmi stanno usando, il sistema passa il tempo a spostare pagine avanti e indietro: il computer rallenta, le finestre rispondono a scatti, passare da un programma all'altro richiede secondi.

Se anche l'area di swap si riempie, o se il sistema non ne usa una, non resta che liberare memoria chiudendo qualcosa. È quello che fanno i telefoni: quando la RAM non basta, il sistema chiude le app che non usi da più tempo, e quando ci torni le vedi ripartire da capo.

```ad-warning
La memoria virtuale non aggiunge RAM
Lo swap sta sulla memoria di massa: fa sembrare la memoria più grande, ma una pagina nello swap va ricopiata nella RAM prima di poterla usare. Per questo un computer con poca RAM e molti programmi aperti resta lento anche con un disco capiente.
```

```ad-warning
Memoria piena: quale memoria?
"Memoria piena" sul telefono indica quasi sempre la memoria di massa, cioè troppe foto, video e app installate: si risolve cancellando file. La RAM piena è un'altra cosa: dipende dai programmi aperti in quel momento, e si svuota chiudendoli.
```
