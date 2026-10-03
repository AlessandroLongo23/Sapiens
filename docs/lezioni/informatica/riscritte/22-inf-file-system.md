# Il file system: file, cartelle e percorsi

Sul telefono hai migliaia di foto, centinaia di brani, i documenti della scuola, le app. Nella memoria di massa tutto questo è una lunghissima fila di bit, e senza un ordine nessuno saprebbe dove finisce una foto e dove comincia la successiva. A mettere ordine è il **file system**, la parte del [sistema operativo](/materiale/scuola-superiore/informatica/il-sistema-operativo/funzioni-del-sistema-operativo) che organizza i dati in file e cartelle e ricorda dove si trova ciascuno.

## I file

Un **file** è una sequenza di byte registrata nella memoria di massa sotto un nome. Una foto, un tema, un brano, un programma: ognuno è un file. Per ogni file il file system conserva, oltre al contenuto, alcune informazioni: il nome, la dimensione, la data dell'ultima modifica, la cartella in cui si trova.

### Nome ed estensione

Il nome di un file ha di solito due parti separate da un punto, come in `tema.odt`. La seconda parte è l'**estensione**: indica il formato del file, cioè come vanno letti i suoi byte, e il sistema operativo la usa per decidere con quale programma aprirlo. Se nel nome ci sono più punti, l'estensione è quello che viene dopo l'ultimo: in `foto.mare.png` è `.png`.

| Estensione | Tipo di file |
|---|---|
| `.txt`, `.odt`, `.docx`, `.pdf` | documento di testo |
| `.ods`, `.xlsx` | foglio di calcolo |
| `.odp`, `.pptx` | presentazione |
| `.jpg`, `.png`, `.gif` | immagine |
| `.mp3`, `.wav` | audio |
| `.mp4`, `.avi` | video |
| `.html` | pagina web |
| `.zip` | archivio compresso |
| `.exe` | programma eseguibile |

```ad-warning
Cambiare l'estensione non cambia il formato
Se rinomini `gita.jpg` in `gita.mp3` il contenuto resta quello di un'immagine: il sistema proverà ad aprirlo con il lettore di musica, che non saprà che farsene. Per passare da un formato a un altro serve un programma che converta i dati. E il tipo si legge dall'estensione, non dal nome: `musica.txt` è un documento di testo.
```

Spesso l'interfaccia grafica nasconde le estensioni e mostra solo un'icona diversa per ogni tipo; nelle impostazioni si può chiedere di vederle.

## Le cartelle e l'albero

Una **cartella** (in inglese directory, o folder) è un contenitore di file e di altre cartelle. Poiché una cartella può contenerne altre, che a loro volta ne contengono altre, l'insieme ha la forma di un albero rovesciato. La cartella da cui parte tutto, e che non sta dentro nessun'altra, è la **radice**.

```tikz
% nome: albero-delle-cartelle
% alt: Albero delle cartelle: dalla radice, indicata con una barra, si scende alla cartella home, che contiene le cartelle anna e luca. La cartella anna contiene temi e foto; temi contiene la cartella arte, con il file mappa.png, e il file tema.odt; foto contiene il file gita.jpg. La cartella luca contiene rock, con il file brano.mp3. Le cartelle hanno gli angoli arrotondati, i file gli angoli vivi
\begin{tikzpicture}
\tikzset{
  cart/.style={draw, thick, rounded corners=4pt, fill=blue!10, minimum height=0.55cm, inner xsep=5pt, font=\small\ttfamily},
  file/.style={draw, thick, fill=orange!25, minimum height=0.55cm, inner xsep=4pt, font=\small\ttfamily}}
\node[cart] (r) at (0,0) {/};
\node[cart] (h) at (0,-1.1) {home};
\node[cart] (an) at (-1.6,-2.2) {anna};
\node[cart] (lu) at (2.0,-2.2) {luca};
\node[cart] (te) at (-2.7,-3.3) {temi};
\node[cart] (fo) at (0,-3.3) {foto};
\node[cart] (ro) at (2.0,-3.3) {rock};
\node[cart] (ar) at (-3.5,-4.4) {arte};
\node[file] (t1) at (-1.9,-4.4) {tema.odt};
\node[file] (g1) at (0,-4.4) {gita.jpg};
\node[file] (b1) at (2.0,-4.4) {brano.mp3};
\node[file] (m1) at (-3.5,-5.5) {mappa.png};
\draw[thick] (r) -- (h);
\draw[thick] (h) -- (an);
\draw[thick] (h) -- (lu);
\draw[thick] (an) -- (te);
\draw[thick] (an) -- (fo);
\draw[thick] (lu) -- (ro);
\draw[thick] (te) -- (ar);
\draw[thick] (te) -- (t1);
\draw[thick] (fo) -- (g1);
\draw[thick] (ro) -- (b1);
\draw[thick] (ar) -- (m1);
\end{tikzpicture}
```

Nella figura le cartelle hanno gli angoli arrotondati e i file gli angoli vivi. Dentro una stessa cartella non possono esserci due file con lo stesso nome; in due cartelle diverse sì, e sono due file distinti.

## I percorsi

Il **percorso** (in inglese path) di un file è l'elenco delle cartelle da attraversare per raggiungerlo, seguito dal nome del file.

Un **percorso assoluto** parte dalla radice, e quindi indica il file senza ambiguità da qualunque punto. Si scrive in due modi, a seconda del sistema:

- in Linux, macOS e Android la radice è `/` e i nomi si separano con la barra: `/home/anna/foto/gita.jpg`;
- in Windows ogni memoria di massa ha la sua radice, una lettera seguita dai due punti, e i nomi si separano con la barra rovesciata: `C:\Utenti\anna\foto\gita.jpg`.

Un **percorso relativo** parte dalla cartella in cui ti trovi in quel momento, detta cartella corrente, e non comincia con la radice. Due nomi speciali servono a muoversi: `..` indica la cartella che contiene quella corrente (si sale di un livello) e `.` indica la cartella corrente stessa.

Per ottenere il percorso assoluto da uno relativo:

1. Scrivi il percorso assoluto della cartella corrente.
2. Leggi il percorso relativo un pezzo alla volta, da sinistra: per ogni nome, aggiungilo in fondo; per ogni `..`, togli l'ultima cartella; per `.` non fare niente.
3. Quello che ottieni alla fine è il percorso assoluto.

```ad-example
Esempio 1: scendere
Nell'albero della figura la cartella corrente è `/home/anna/temi`. Qual è il percorso assoluto di `arte/mappa.png`?

Si parte da `/home/anna/temi`. Il primo pezzo è `arte`: si aggiunge e si ottiene `/home/anna/temi/arte`. Il secondo è `mappa.png`: il percorso assoluto è `/home/anna/temi/arte/mappa.png`.
```

```ad-example
Esempio 2: salire di un livello
La cartella corrente è ancora `/home/anna/temi`. Qual è il percorso assoluto di `../foto/gita.jpg`?

Si parte da `/home/anna/temi`. Il primo pezzo è `..`: si toglie `temi` e resta `/home/anna`. Poi si aggiungono `foto` e `gita.jpg`: il percorso assoluto è `/home/anna/foto/gita.jpg`.
```

```ad-example
Esempio 3: salire di tre livelli, con la barra rovesciata
Lo stesso albero si trova su un computer che usa la barra rovesciata, sotto `C:\Utenti`. La cartella corrente è `C:\Utenti\anna\temi\arte`. Qual è il percorso assoluto di `..\..\..\luca\rock\brano.mp3`?

Si parte da `C:\Utenti\anna\temi\arte`. I tre `..` tolgono, uno dopo l'altro, `arte`, `temi` e `anna`: resta `C:\Utenti`. Poi si aggiungono `luca`, `rock` e `brano.mp3`: il percorso assoluto è `C:\Utenti\luca\rock\brano.mp3`.
```

```ad-warning
La barra iniziale cambia tutto
`/home/anna` è un percorso assoluto, che parte dalla radice. `home/anna`, senza la barra, è relativo: cerca una cartella `home` dentro la cartella corrente, e se ti trovi in `/home/anna/temi` non la trova. L'altro errore frequente è ignorare i `..` e attaccare il percorso relativo così com'è in fondo a quello della cartella corrente.
```

```ad-note
Maiuscole e minuscole
In alcuni sistemi `Tema.odt` e `tema.odt` sono due file diversi, in altri sono lo stesso nome. Per non sbagliare, scrivi i nomi sempre nello stesso modo.
```

## Le operazioni sui file

Le operazioni che il file system offre sono le stesse per i file e per le cartelle.

| Operazione | Che cosa succede |
|---|---|
| creare | nasce un file nuovo, con un nome, in una cartella |
| copiare | nella cartella di arrivo nasce un secondo file uguale; l'originale resta dov'è |
| spostare | il file cambia cartella: il nome resta, il percorso cambia, e nella cartella di partenza non c'è più |
| rinominare | cambia il nome, e quindi l'ultima parte del percorso; la cartella resta la stessa |
| eliminare | il file viene tolto dalla cartella; di solito finisce nel cestino, da cui si può recuperare finché il cestino non viene svuotato |

```ad-example
Esempio 4: copiare, spostare, rinominare
Il file `/home/anna/temi/tema.odt` viene copiato in `/home/anna/foto`; poi l'originale viene rinominato `bozza.odt`. Quali file ci sono alla fine?

Dopo la copia i file sono due: `/home/anna/temi/tema.odt` e `/home/anna/foto/tema.odt`. La rinomina tocca solo l'originale, che resta nella sua cartella con il nome nuovo: alla fine ci sono `/home/anna/temi/bozza.odt` e `/home/anna/foto/tema.odt`. Se al posto della copia ci fosse stato uno spostamento, il file sarebbe stato sempre uno solo.
```

## La dimensione di un file

La dimensione di un file è il numero dei suoi byte, e si esprime con i multipli del byte della lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura): $1\,\text{kB} = 1000\,\text{B}$, $1\,\text{MB} = 1000\,\text{kB}$, $1\,\text{GB} = 1000\,\text{MB}$. La dimensione di una cartella è la somma delle dimensioni di tutto ciò che contiene.

```ad-example
Esempio 5: quanto occupa una cartella
Una cartella contiene $40$ documenti da $250\,\text{kB}$ ciascuno. Quanti megabyte occupa? E quante foto da $4\,\text{MB}$ stanno in $30\,\text{MB}$ liberi?

La cartella occupa $40 \cdot 250 = 10\,000\,\text{kB}$, cioè $10\,000 : 1000 = 10\,\text{MB}$.

Per le foto si divide lo spazio libero per la dimensione di una foto: $30 : 4 = 7{,}5$. Mezza foto non si può salvare, quindi ce ne stanno $7$: qui si arrotonda per difetto.
```
