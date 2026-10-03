# Struttura di un documento elettronico

La relazione di scienze, la ricerca di storia, il curriculum che scriverai tra qualche anno: sono tutti documenti elettronici, cioè file che contengono un testo impaginato e che si scrivono con un programma di videoscrittura (per esempio Word, LibreOffice Writer o Documenti Google). I programmi cambiano, ma sotto lavorano tutti allo stesso modo: tengono separato quello che scrivi da come appare, e organizzano il testo in caratteri, paragrafi, pagine e sezioni. Chi conosce questa struttura impagina in pochi minuti e non vede il documento sfasciarsi alla prima correzione.

## Contenuto e forma

Di un documento si possono dire due cose diverse. Il **contenuto** è quello che c'è scritto: le parole, i numeri, le immagini, le tabelle. La **formattazione** è l'aspetto con cui il contenuto si presenta: il tipo di carattere, la sua dimensione, i colori, l'allineamento, i margini.

Le due cose sono indipendenti. Se in una relazione cambi il carattere dei titoli, il contenuto resta lo stesso; se correggi una data sbagliata, cambia il contenuto e la formattazione non si muove. Per questo conviene lavorare in due tempi: prima si scrive, poi si impagina.

```ad-example
Esempio 1: contenuto o formattazione
Sara rilegge la sua ricerca sui vulcani e fa quattro modifiche: corregge "Vesuvvio", mette in corsivo il titolo di un libro, aggiunge una frase alle conclusioni, allarga i margini. Quali cambiano il contenuto?

La correzione della parola e la frase aggiunta cambiano il contenuto: dopo, il documento dice una cosa diversa. Il corsivo e i margini cambiano solo la formattazione: il documento dice le stesse cose con un altro aspetto.
```

## Caratteri, paragrafi, pagine e sezioni

La formattazione si applica a pezzi di grandezza diversa, uno dentro l'altro.

Il **carattere** è il pezzo più piccolo: una lettera, una cifra, un segno di punteggiatura, uno spazio. Di un carattere si sceglie il tipo (il font), la dimensione, lo stile (grassetto, corsivo, sottolineato) e il colore. La dimensione si misura in punti tipografici: un punto (pt) è circa $0{,}35\,\text{mm}$, e il testo di una relazione è di solito di $11$ o $12$ punti.

Il **paragrafo** è tutto il testo compreso tra un Invio e il successivo: può essere una riga sola, come un titolo, oppure venti righe. Di un paragrafo si sceglie l'allineamento (a sinistra, centrato, a destra, giustificato), l'interlinea, cioè la distanza tra le righe, i rientri e lo spazio prima e dopo. Quando scrivi, è il programma a mandare a capo le righe dentro il paragrafo: tu premi Invio solo quando il paragrafo è finito.

La **pagina** ha un formato (di solito A4, cioè $21\,\text{cm}$ per $29{,}7\,\text{cm}$), un orientamento (verticale oppure orizzontale) e quattro margini, le strisce vuote lungo i bordi.

La **sezione** è una parte del documento che ha impostazioni di pagina sue. In un documento con una sola sezione tutte le pagine sono uguali; se una tabella molto larga ha bisogno di una pagina orizzontale in mezzo a pagine verticali, quella pagina sta in una sezione a parte.

| Pezzo | Che cosa si sceglie |
|---|---|
| carattere | tipo di carattere, dimensione, grassetto, corsivo, colore |
| paragrafo | allineamento, interlinea, rientri, spazio prima e dopo |
| pagina | formato, orientamento, margini |
| sezione | impostazioni di pagina diverse dal resto del documento |

```ad-example
Esempio 2: a quale pezzo si applica
Luca vuole il titolo della relazione centrato, la parola "attenzione" in rosso e il foglio in orizzontale. A che cosa si applica ogni scelta?

L'allineamento centrato è una proprietà del paragrafo: riguarda tutto il titolo, non una sua lettera. Il colore rosso è una proprietà dei caratteri della parola. L'orientamento è una proprietà della pagina.
```

```ad-warning
Centrare con gli spazi
Un titolo spinto al centro a forza di spazi sembra centrato finché non cambi la dimensione del carattere o i margini: poi finisce da un'altra parte. Il titolo centrato è un paragrafo con l'allineamento centrato, e resta al centro qualunque cosa cambi intorno.
```

## La pagina: margini, intestazione e piè di pagina

Dentro i margini c'è l'area del testo, dove scorre il corpo del documento. Nel margine superiore si trova l'**intestazione** e in quello inferiore il **piè di pagina**: due zone il cui contenuto si scrive una volta e si ripete su tutte le pagine della sezione. Ci stanno il titolo del documento, il nome dell'autore, la data, il numero di pagina.

```tikz
% nome: struttura-pagina-margini
% alt: Una pagina in formato A4, larga 21 centimetri e alta 29,7. Un rettangolo tratteggiato interno segna l'area del testo, con le righe del corpo del documento. Nella striscia in alto, fuori dall'area del testo, c'è l'intestazione; nella striscia in basso il piè di pagina con il numero di pagina. Le strisce vuote tra il bordo del foglio e l'area del testo sono i margini
% svg: struttura-pagina-margini-fa5d5974.svg 342x257
\begin{tikzpicture}
\draw[thick, fill=gray!8] (0,0) rectangle (4.2,5.94);
\draw[thick, dashed, blue!70!black] (0.5,0.6) rectangle (3.7,5.34);
\foreach \y in {5.0,4.7,4.4,4.1,3.8,3.2,2.9,2.6,2.3,2.0,1.4,1.1} {\draw[line width=1.2pt, gray!70] (0.65,\y) -- (3.55,\y);}
\draw[line width=1.2pt, gray!70] (0.65,3.5) -- (2.3,3.5);
\draw[line width=1.2pt, gray!70] (0.65,1.7) -- (1.9,1.7);
\draw[line width=1.2pt, gray!70] (0.65,0.8) -- (2.6,0.8);
\draw[fill=orange!30] (0.5,5.5) rectangle (3.7,5.78);
\draw[fill=orange!30] (0.5,0.16) rectangle (3.7,0.44);
\node[font=\scriptsize] at (2.1,0.3) {3};
\draw[-{Stealth}] (5.0,5.64) -- (3.75,5.64);
\node[anchor=west, font=\small] at (5.0,5.64) {intestazione};
\draw[-{Stealth}] (5.0,3.0) -- (3.6,3.0);
\node[anchor=west, font=\small] at (5.0,3.0) {area del testo};
\draw[-{Stealth}] (5.0,0.3) -- (3.75,0.3);
\node[anchor=west, font=\small] at (5.0,0.3) {piè di pagina};
\draw[-{Stealth}] (5.0,1.6) -- (3.95,1.6);
\node[anchor=west, font=\small] at (5.0,1.6) {margine};
\draw[{Stealth}-{Stealth}] (0,6.25) -- (4.2,6.25);
\node[font=\small, above] at (2.1,6.25) {$21$ cm};
\draw[{Stealth}-{Stealth}] (-0.35,0) -- (-0.35,5.94);
\node[font=\small, anchor=east] at (-0.45,2.97) {$29{,}7$ cm};
\end{tikzpicture}
```

Il numero di pagina non si scrive a mano. Nel piè di pagina si inserisce un **campo**, cioè un segnaposto che il programma riempie da solo: sulla terza pagina mostra 3, sulla quarta 4, e se aggiungi una pagina all'inizio tutti i numeri si aggiornano. Sono campi anche il numero totale delle pagine e la data di oggi.

Le dimensioni dell'area del testo si calcolano dal formato e dai margini:

1. prendi la larghezza del foglio, nell'orientamento in cui lo usi;
2. togli il margine sinistro e il margine destro: ottieni la larghezza dell'area del testo;
3. per l'altezza fai lo stesso con l'altezza del foglio e con i margini superiore e inferiore.

```ad-example
Esempio 3: l'area del testo con margini uguali
Un foglio A4 verticale, largo $21\,\text{cm}$ e alto $29{,}7\,\text{cm}$, ha tutti i margini di $2\,\text{cm}$. Quanto è grande l'area del testo?

Larghezza: $21 - 2 - 2 = 17\,\text{cm}$. Altezza: $29{,}7 - 2 - 2 = 25{,}7\,\text{cm}$.
```

```ad-example
Esempio 4: margini diversi
Un foglio A4 verticale ha il margine sinistro di $3\,\text{cm}$, perché il fascicolo verrà rilegato, e il destro di $2\,\text{cm}$. Quanto è larga l'area del testo?

$21 - 3 - 2 = 16\,\text{cm}$. I margini si tolgono tutti e due, ciascuno con la sua misura.
```

```ad-example
Esempio 5: il foglio in orizzontale
Per una tabella larga, Giulia gira il foglio A4 in orizzontale, con i margini sinistro e destro di $2{,}5\,\text{cm}$. Quanto è larga l'area del testo?

In orizzontale i due lati si scambiano: il foglio è largo $29{,}7\,\text{cm}$ e alto $21\,\text{cm}$. La larghezza dell'area del testo è $29{,}7 - 2{,}5 - 2{,}5 = 24{,}7\,\text{cm}$.
```

## I caratteri non stampabili

Quando premi Invio, la barra spaziatrice o il tasto Tab, nel documento entra un carattere vero, che occupa un posto nel testo anche se sulla carta non si vede. Sono i **caratteri non stampabili**, e ogni programma di videoscrittura ha un comando per mostrarli sullo schermo con dei segni convenzionali.

| Segno | Nome | Che cosa fa |
|---|---|---|
| ¶ | fine paragrafo (tasto Invio) | chiude il paragrafo e ne comincia uno nuovo |
| ↵ | interruzione di riga | manda a capo restando nello stesso paragrafo |
| → | tabulazione (tasto Tab) | sposta il testo fino a una posizione fissa della riga |
| · | spazio | separa due parole |
| linea tratteggiata | interruzione di pagina | fa cominciare su una pagina nuova quello che segue |

```tikz
% nome: caratteri-non-stampabili
% alt: Cinque righe di un documento con i caratteri non stampabili visibili in blu: un puntino al posto di ogni spazio, una freccia verso destra dove c'è una tabulazione che allinea i nomi dopo Autore e Classe, una freccia piegata dove c'è un'interruzione di riga dentro un indirizzo, il segno di fine paragrafo alla fine di ogni paragrafo e in fondo una linea tratteggiata con la scritta interruzione di pagina
% svg: caratteri-non-stampabili-cd2951c4.svg 219x131
\begin{tikzpicture}
\tikzset{r/.style={anchor=west, font=\small, inner sep=0pt}}
\def\spz{\textcolor{blue!70!black}{$\cdot$}}
\def\fpar{\textcolor{blue!70!black}{$\,\P$}}
\def\tbz{\textcolor{blue!70!black}{$\rightarrow$}}
\def\rgz{\textcolor{blue!70!black}{$\,\hookleftarrow$}}
\node[r] at (0,0) {Relazione\spz di\spz scienze\fpar};
\node[r] at (0,-0.6) {Autore:};
\node[r] at (1.25,-0.6) {\tbz};
\node[r] at (2.2,-0.6) {Sara\spz Conti\fpar};
\node[r] at (0,-1.2) {Classe:};
\node[r] at (1.25,-1.2) {\tbz};
\node[r] at (2.2,-1.2) {1B\fpar};
\node[r] at (0,-1.8) {Liceo\spz Galilei\rgz};
\node[r] at (0,-2.4) {via\spz Roma\spz 12,\spz Torino\fpar};
\draw[dashed, blue!70!black] (0,-3.0) -- (1.3,-3.0);
\draw[dashed, blue!70!black] (4.4,-3.0) -- (5.7,-3.0);
\node[font=\footnotesize, text=blue!70!black] at (2.85,-3.0) {interruzione di pagina};
\end{tikzpicture}
```

Nella figura l'indirizzo sta su due righe ma è un paragrafo solo, perché tra le due c'è un'interruzione di riga e non un Invio: se centri l'indirizzo, si centrano tutte e due le righe insieme. I nomi dopo "Autore:" e "Classe:" cominciano nello stesso punto perché prima di ciascuno c'è una tabulazione.

```ad-warning
Invio alla fine di ogni riga
Chi preme Invio ogni volta che arriva al bordo destro spezza il discorso in tanti paragrafi di una riga. Se poi cambia i margini o la dimensione del carattere, le righe si rompono a metà. Dentro un paragrafo le righe le manda a capo il programma.
```

```ad-warning
Allineare con gli spazi
Una colonna di prezzi allineata a colpi di barra spaziatrice sullo schermo sembra dritta, stampata risulta storta, perché le lettere non hanno tutte la stessa larghezza. Una tabulazione porta il testo sempre nello stesso punto della riga.
```

### Pagina nuova con l'interruzione di pagina

Per far cominciare un capitolo in cima a una pagina nuova c'è l'interruzione di pagina. Molti studenti premono invece Invio finché il titolo non scende sulla pagina seguente. All'inizio il risultato sembra lo stesso, ma quelle righe vuote restano nel testo e si spostano insieme a tutto il resto.

```ad-example
Esempio 6: il titolo che scivola
Ogni pagina contiene $40$ righe. Il capitolo 1 occupa $26$ righe, e per portare il titolo del capitolo 2 in cima alla seconda pagina Marco preme Invio $14$ volte, perché $26 + 14 = 40$. Poi aggiunge $5$ righe al capitolo 1. Dove finisce il titolo del capitolo 2?

Prima del titolo ora ci sono $26 + 5 = 31$ righe di testo e $14$ righe vuote: $31 + 14 = 45$ righe in tutto. Le prime $40$ riempiono la prima pagina; le altre $5$, tutte vuote, stanno in cima alla seconda. Il titolo è sulla riga $6$ della seconda pagina, sotto cinque righe bianche.

Con un'interruzione di pagina al posto dei $14$ Invii il titolo sarebbe rimasto sulla riga $1$ della seconda pagina, qualunque cosa si aggiunga prima.
```

## I formati dei file

Un documento si salva in un file, e il formato del file dice che cosa si potrà farne. Il formato si riconosce dall'estensione, la parte del nome dopo il punto, di cui parla la lezione [Il file system: file, cartelle e percorsi](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi).

I **formati modificabili** conservano il contenuto insieme a tutta la struttura: paragrafi, formattazione, intestazioni, campi. Sono `.docx`, il formato di Word, e `.odt`, il formato aperto OpenDocument usato da LibreOffice Writer; i programmi più diffusi li aprono entrambi. Si usano finché il documento è in lavorazione.

Il formato PDF (Portable Document Format, estensione `.pdf`) fissa le pagine così come sono: stessi caratteri, stessi a capo, stessa impaginazione su qualunque dispositivo e su qualunque stampante. Non è fatto per essere modificato. Si usa quando il documento è finito e va consegnato, stampato o pubblicato.

Il **testo semplice** (estensione `.txt`) contiene solo i caratteri, codificati come spiega la lezione [La codifica dei caratteri: ASCII e Unicode](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-caratteri-ascii-e-unicode): niente grassetti, niente margini, niente immagini. È il contenuto senza la formattazione.

| Formato | Estensione | Si modifica | Quando si usa |
|---|---|---|---|
| modificabile | `.docx`, `.odt` | sì, con tutta la formattazione | per continuare a lavorarci, da soli o con altri |
| PDF | `.pdf` | no | per consegnare, stampare, pubblicare |
| testo semplice | `.txt` | sì, ma solo i caratteri | per appunti senza formattazione |

```ad-example
Esempio 7: quale formato
Anna e Pietro scrivono insieme una ricerca: Anna la comincia e la passa a Pietro, che la completa; poi la consegnano alla professoressa. In che formato viaggia il file?

Da Anna a Pietro in un formato modificabile, `.odt` oppure `.docx`: Pietro deve poter scrivere. Alla professoressa in `.pdf`: lei deve vedere le pagine come le hanno impaginate loro, anche se sul suo computer mancano i caratteri che hanno scelto. Il file modificabile però si conserva, perché è da quello che si riparte per una correzione.
```

```ad-warning
Consegnare la foto dello schermo
Un'immagine della pagina (una foto, uno screenshot) non è un documento: il testo non si può selezionare, cercare né correggere, e ingrandito si sgrana. Per consegnare si esporta in PDF.
```
