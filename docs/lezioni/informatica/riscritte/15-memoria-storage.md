# Memoria centrale e memorie di massa

Stai scrivendo un tema al computer, va via la corrente e il testo che non avevi salvato è perso; le foto delle vacanze, invece, sono ancora al loro posto. Il tema e le foto stavano in due memorie diverse. Un computer ne ha di più tipi, perché nessuna memoria è insieme veloce, capiente ed economica: ognuna fa bene una cosa sola.

## Celle e indirizzi

La memoria centrale, uno dei blocchi della [macchina di von Neumann](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-macchina-di-von-neumann), è una lunga fila di **celle**, tutte della stessa dimensione. Qui consideriamo celle da $1$ byte, cioè da $8$ bit. Ogni cella ha un **indirizzo**, un numero che la distingue dalle altre: la prima ha indirizzo $0$, la seconda $1$, e così via.

```tikz
% nome: memoria-celle-indirizzi
% alt: La memoria centrale disegnata come una fila di celle rettangolari: sopra ogni cella il suo indirizzo, 0, 1, 2, poi dei puntini e l'ultima cella con indirizzo 1023; dentro ogni cella un byte, per esempio 01000001 nella prima
\begin{tikzpicture}
\foreach \x/\ind/\val in {0/0/01000001, 1.5/1/00110111, 3.0/2/11111111} {
  \draw[thick, fill=blue!12] (\x,0) rectangle ++(1.5,0.7);
  \node[font=\scriptsize] at (\x+0.75,0.35) {\val};
  \node[font=\footnotesize] at (\x+0.75,0.95) {\ind};
}
\node at (4.85,0.35) {\dots};
\draw[thick, fill=blue!12] (5.2,0) rectangle ++(1.5,0.7);
\node[font=\scriptsize] at (5.95,0.35) {01100001};
\node[font=\footnotesize] at (5.95,0.95) {1023};
\node[font=\footnotesize, anchor=east] at (-0.1,0.95) {indirizzo};
\node[font=\footnotesize, anchor=east] at (-0.1,0.35) {contenuto};
\end{tikzpicture}
```

La CPU non cerca un dato scorrendo le celle: indica l'indirizzo e la memoria le dà subito il contenuto di quella cella. Leggere la cella $0$ o la cella $1023$ richiede lo stesso tempo.

Per i conti su celle e capacità i passi sono questi:

1. se le celle sono $N$, gli indirizzi vanno da $0$ a $N - 1$;
2. la capacità in byte è il numero di celle per i byte di una cella;
3. per scriverla con un multiplo si divide per il suo fattore: $1\,\text{KiB} = 1024\,\text{B}$, $1\,\text{MiB} = 1024\,\text{KiB}$, $1\,\text{GiB} = 1024\,\text{MiB}$ per i multipli binari, e $1\,\text{kB} = 1000\,\text{B}$, $1\,\text{MB} = 1000\,\text{kB}$, $1\,\text{GB} = 1000\,\text{MB}$ per quelli decimali.

Le due famiglie di multipli sono spiegate nella lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura).

```ad-example
Esempio 1: ultimo indirizzo e capacità
Una memoria ha $4096$ celle da $1$ byte. Qual è l'indirizzo dell'ultima cella? Qual è la capacità in KiB?

1. Gli indirizzi partono da $0$, quindi l'ultimo è $4096 - 1 = 4095$.
2. La capacità è $4096 \cdot 1\,\text{B} = 4096\,\text{B}$.
3. In KiB: $4096 : 1024 = 4$, quindi $4\,\text{KiB}$.
```

```ad-warning
L'ultimo indirizzo è uno in meno del numero di celle
Con $4096$ celle l'ultima ha indirizzo $4095$, non $4096$: il conto parte da $0$. Al contrario, se gli indirizzi vanno da $0$ a $255$ le celle sono $256$.
```

```ad-example
Esempio 2: dagli indirizzi alla capacità
Gli indirizzi di una memoria, con celle da $1$ byte, vanno da $0$ a $65\,535$. Quanti KiB sono?

1. Le celle sono $65\,535 + 1 = 65\,536$.
2. La capacità è $65\,536\,\text{B}$.
3. In KiB: $65\,536 : 1024 = 64$, quindi $64\,\text{KiB}$.
```

## RAM e ROM

La memoria centrale è fatta quasi tutta di **RAM** (Random Access Memory, memoria ad accesso casuale): "accesso casuale" vuol dire che si può raggiungere direttamente una cella qualsiasi. Nella RAM la CPU legge e scrive di continuo: lì stanno i programmi aperti e i dati su cui lavorano.

La RAM è una memoria **volatile**: conserva il contenuto solo finché riceve corrente. Quando spegni il computer, o la batteria si scarica, tutto quello che c'era nella RAM sparisce. Il tema non salvato dell'inizio era lì.

Ma se a computer spento la RAM è vuota, all'accensione la CPU non troverebbe nessuna istruzione da eseguire. Per questo una piccola parte della memoria centrale è una **ROM** (Read Only Memory, memoria di sola lettura): è una memoria **non volatile**, che conserva il contenuto anche senza corrente, e contiene il programma che fa partire il computer. Durante l'uso normale la ROM viene solo letta. Che cosa fa quel programma lo racconta la lezione [Avvio del computer e interfacce utente](/materiale/scuola-superiore/informatica/il-sistema-operativo/avvio-del-computer-e-interfacce-utente).

| | RAM | ROM |
|---|---|---|
| Senza corrente | perde il contenuto (volatile) | lo conserva (non volatile) |
| Nell'uso normale | si legge e si scrive | si legge soltanto |
| Che cosa contiene | programmi aperti e i loro dati | il programma di avvio |
| Quanto è grande | la maggior parte della memoria centrale | una piccola parte |

```ad-note
Una ROM che si può aggiornare
Le ROM di oggi si possono riscrivere, con una procedura apposta e non durante il normale funzionamento: è quello che succede quando si aggiorna il programma di avvio di un computer o di un telefono. Il nome "sola lettura" è rimasto.
```

## Le memorie di massa

Le **memorie di massa** conservano i dati per lungo tempo: sono non volatili, molto più capienti della RAM e molto più lente. Lì stanno i file, i programmi installati e il sistema operativo. Quando apri un programma, le sue istruzioni vengono copiate dalla memoria di massa alla RAM; quando salvi un documento, i dati fanno il viaggio opposto.

Le più diffuse sono di due tipi.

- Il **disco magnetico**, o disco rigido (in inglese hard disk), registra i bit magnetizzando la superficie di dischi che ruotano, letti da una testina che si sposta. Ha parti in movimento: per questo è il più lento, fa rumore e teme gli urti. In compenso costa poco per ogni byte.
- La **memoria a stato solido** registra i bit come cariche elettriche in circuiti senza parti in movimento. È il tipo di memoria degli SSD (Solid State Drive) dei portatili, della memoria interna dei telefoni, delle chiavette USB e delle schede di memoria. È molto più veloce del disco magnetico, silenziosa e resistente agli urti, ma costa di più per ogni byte.

```ad-warning
La "memoria" del telefono non è la RAM
Quando di un telefono si dice che ha una memoria da $128\,\text{GB}$ si parla della memoria di massa, dove restano foto e app. La RAM è un'altra cosa, molto più piccola. Finire lo spazio per le foto e avere poca RAM sono due problemi diversi: il primo si risolve cancellando file, il secondo chiudendo programmi.
```

```ad-example
Esempio 3: quanti file ci stanno
Una chiavetta USB ha una capacità di $32\,\text{GB}$. Quanti video da $250\,\text{MB}$ può contenere? Usa $1\,\text{GB} = 1000\,\text{MB}$.

1. Si porta la capacità nella stessa unità dei file: $32\,\text{GB} = 32 \cdot 1000\,\text{MB} = 32\,000\,\text{MB}$.
2. Si divide per la dimensione di un file: $32\,000 : 250 = 128$.

La chiavetta contiene al massimo $128$ video.
```

```ad-example
Esempio 4: che cosa si perde quando va via la corrente
Su un computer fisso sono aperti un tema appena scritto e non salvato e un foglio di calcolo salvato un minuto fa. Va via la corrente. Che cosa trovi quando riaccendi?

Il tema esisteva solo nella RAM, che è volatile: è perso. Il foglio di calcolo era stato copiato sulla memoria di massa, che è non volatile: c'è ancora, nello stato in cui era al momento del salvataggio. Anche il sistema operativo e i programmi installati sono sulla memoria di massa, e il programma di avvio è nella ROM: il computer riparte.
```

## La cache

Tra la CPU e la RAM c'è una differenza di velocità: la CPU esegue un'istruzione in molto meno tempo di quanto la RAM impieghi a consegnarle un dato. Per non farla aspettare, accanto alla CPU c'è la **cache**, una memoria piccola e molto veloce che tiene una copia dei dati e delle istruzioni usati più di recente. Funziona perché i programmi tornano spesso sugli stessi dati: se il dato richiesto è nella cache, la CPU lo ha subito; se non c'è, lo va a prendere nella RAM e ne lascia una copia nella cache per la prossima volta.

È quello che fai quando studi: i libri che stai usando li tieni sul banco, gli altri nello zaino. Sul banco ce ne stanno pochi, ma li hai subito.

## La gerarchia delle memorie

Mettendo in fila le memorie del computer dalla più veloce alla più lenta si ottiene la **gerarchia delle memorie**. In cima ci sono i registri, che stanno [dentro la CPU](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-cpu-e-il-ciclo-di-esecuzione-delle-istruzioni); poi la cache, la RAM e le memorie di massa.

```tikz
% nome: gerarchia-delle-memorie
% alt: La gerarchia delle memorie disegnata come cinque fasce orizzontali sovrapposte, sempre più larghe dall'alto in basso: registri, cache, RAM, SSD, disco magnetico; a sinistra una freccia verso l'alto con la scritta più veloce e più costosa per byte, a destra una freccia verso il basso con la scritta più capiente
\begin{tikzpicture}
\tikzset{f/.style={draw, thick, font=\small, minimum height=0.62cm}}
\node[f, fill=orange!35, minimum width=1.5cm] at (0,2.6) {registri};
\node[f, fill=orange!22, minimum width=2.3cm] at (0,1.95) {cache};
\node[f, fill=blue!12, minimum width=3.1cm] at (0,1.3) {RAM};
\node[f, fill=green!15, minimum width=3.9cm] at (0,0.65) {SSD};
\node[f, fill=green!15, minimum width=4.7cm] at (0,0) {disco magnetico};
\draw[-{Stealth}, thick] (-2.75,-0.3) -- (-2.75,2.9);
\draw[-{Stealth}, thick] (2.75,2.9) -- (2.75,-0.3);
\node[font=\footnotesize, align=center] at (-2.3,-0.9) {più veloce, più\\costosa per byte};
\node[font=\footnotesize] at (2.5,-0.7) {più capiente};
\end{tikzpicture}
```

Scendendo nella gerarchia cambiano insieme tre cose: la velocità diminuisce, la capacità aumenta, il costo di ogni byte diminuisce.

| Memoria | Volatile | Che cosa contiene |
|---|---|---|
| registri | sì | i valori dell'istruzione in esecuzione |
| cache | sì | copie dei dati e delle istruzioni usati più di recente |
| RAM | sì | i programmi aperti e i loro dati |
| SSD | no | file, programmi installati, sistema operativo |
| disco magnetico | no | file, programmi installati, sistema operativo |

La gerarchia è un compromesso. Una memoria veloce come i registri e capiente come un disco costerebbe troppo; una memoria tutta di dischi magnetici sarebbe economica ma lentissima. Così si tiene poco spazio molto veloce vicino alla CPU e molto spazio lento lontano, e si spostano i dati dove servono.

```ad-example
Esempio 5: tre memorie in ordine
Metti in ordine dalla più veloce alla più lenta: RAM, disco magnetico, cache. Poi dalla più capiente alla meno capiente.

Nella gerarchia la cache sta sopra la RAM e la RAM sopra il disco magnetico. Dalla più veloce alla più lenta: cache, RAM, disco magnetico. Per la capacità l'ordine è quello opposto: disco magnetico, RAM, cache.
```

```ad-example
Esempio 6: quante celle ha una RAM
Una RAM ha una capacità di $8\,\text{GiB}$ e celle da $1$ byte. Quante celle ha?

1. Si scrive la capacità in byte, un fattore alla volta: $8\,\text{GiB} = 8 \cdot 1024\,\text{MiB} = 8192\,\text{MiB}$; poi $8192 \cdot 1024 = 8\,388\,608\,\text{KiB}$; poi $8\,388\,608 \cdot 1024 = 8\,589\,934\,592\,\text{B}$.
2. Con celle da $1$ byte, le celle sono tante quanti i byte: $8\,589\,934\,592$.

Con le potenze di due il conto è più corto: $8 = 2^3$ e $1\,\text{GiB} = 2^{30}\,\text{B}$, quindi le celle sono $2^3 \cdot 2^{30} = 2^{33}$. L'ultimo indirizzo è $2^{33} - 1$.
```
