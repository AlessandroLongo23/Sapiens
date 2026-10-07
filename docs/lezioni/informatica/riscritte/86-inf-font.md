# Caratteri tipografici e font

I Fuori Tempo devono preparare la locandina del concerto. Il testo è deciso: il nome del gruppo, la data, "ingresso libero". Eppure la stessa frase può sembrare l'insegna di un locale, un avviso della segreteria o una riga di un programma, secondo la forma delle lettere con cui è scritta. Nel file del testo quella forma non c'è: la lezione sulla [codifica dei caratteri](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-caratteri-ascii-e-unicode) ti ha mostrato che la R è il numero $82$, e il numero $82$ non dice come si disegna una R. Il disegno sta in un altro file, il font.

## Carattere, glifo e font

Servono tre parole, che nel parlare di tutti i giorni si confondono.

- Un **carattere** è un segno della scrittura in astratto: la lettera R maiuscola, la cifra 7, il punto interrogativo. È quello che ha un codice.
- Un **glifo** è un disegno di quel carattere. La R con i trattini alle estremità e la R tutta dritta sono due glifi dello stesso carattere.
- Un **font** è un file che contiene i glifi di un insieme di caratteri, tutti disegnati con lo stesso stile, insieme alle misure che servono per metterli in fila: quanto è largo ciascuno, quanto spazio lasciare tra uno e l'altro.

Quando un programma deve mostrare un testo, per ogni codice cerca nel font il glifo corrispondente e lo disegna. Se il font non ha il glifo di un carattere, come capita con un'emoji recente o con una scrittura che il font non copre, il programma lo prende da un altro font; se non lo trova in nessuno, al suo posto mostra un rettangolino vuoto.

Di solito lo stesso disegno esiste in più varianti: normale, grassetto, corsivo, grassetto corsivo. Ognuna è un font, e tutte insieme formano una **famiglia di caratteri**: è il nome che scegli nel menu di un programma di videoscrittura.

```ad-warning
Cambiare font non cambia il testo
Se copi una frase scritta con un font elaborato e la incolli in una chat, arrivano i codici dei caratteri e non i disegni: chi la riceve la vede con il font del suo telefono. Il font appartiene a come il testo viene mostrato, non al testo.
```

## Font bitmap e font a contorni

Un glifo si può memorizzare in due modi, gli stessi della [grafica bitmap e della grafica vettoriale](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/grafica-bitmap-e-grafica-vettoriale).

In un **font bitmap** ogni glifo è una piccola griglia di pixel, accesi o spenti. La R della figura qui sotto è una griglia di $8 \times 10$ pixel: $80$ bit, cioè $10$ byte. È un disegno fatto per quella dimensione e per nessun'altra.

In un **font a contorni**, o font vettoriale, ogni glifo è descritto dal suo contorno: una serie di punti uniti da tratti dritti e da curve. Per mostrare la lettera a una certa dimensione il programma ingrandisce il contorno quanto serve e poi calcola quali pixel dello schermo cadono dentro.

Nella figura la stessa R è mostrata nei due modi. Passa da $10$ a $80$ pixel di altezza e guarda che cosa succede ai bordi della lettera di sinistra e di quella di destra; poi scegli "Il contorno" per vedere i punti da cui nasce la seconda.

```interattivo
% nome: inf-font-bitmap-contorno
% alt: La lettera R maiuscola due volte, affiancata: a sinistra come font bitmap, una griglia di 8 per 10 pixel, a destra come font a contorni. Un comando cambia l'altezza della lettera da 10 a 20, 40 e 80 pixel: a sinistra ogni pixel del disegno diventa un quadrato sempre più grande e la lettera resta a scalini, a destra i pixel vengono ricalcolati e le curve diventano lisce. Un secondo comando disegna sopra la lettera di destra il contorno, con i suoi 19 punti
```

A $10$ pixel vince il font bitmap: chi l'ha disegnato ha scelto i pixel uno per uno. Da lì in su il font bitmap non ha altro da offrire, e ogni suo pixel diventa un quadrato di $2$, $4$, $8$ pixel di lato: la lettera cresce, gli scalini crescono con lei. Il font a contorni riparte ogni volta dagli stessi $19$ punti, e più pixel ha a disposizione più la curva viene liscia.

Per avere un font bitmap a dieci dimensioni servono dieci disegni di ogni glifo; a un font a contorni ne basta uno, buono per lo schermo del telefono come per un manifesto di tre metri. Per questo oggi i font sono quasi tutti a contorni, nei formati TrueType e OpenType (i file con estensione `.ttf` e `.otf`). I font bitmap resistono dove i pixel sono pochi e contati, come sui display di certi elettrodomestici.

```ad-example
Esempio 1: quanto occupa un font bitmap
Un font bitmap ha $95$ glifi, uno per ogni carattere ASCII stampabile, ciascuno di $8 \times 16$ pixel a $1$ bit per pixel. Quanti byte occupano i glifi? E quanti ne servono per avere il font in quattro dimensioni, se le altre tre hanno glifi di $16 \times 32$, $24 \times 48$ e $32 \times 64$ pixel?

Un glifo occupa $8 \cdot 16 = 128$ bit, cioè $16$ byte; i $95$ glifi occupano $95 \cdot 16 = 1520\,\text{B}$.

Le altre dimensioni hanno glifi di $512$, $1152$ e $2048$ bit, cioè $64$, $144$ e $256$ byte. In tutto ogni carattere costa $16 + 64 + 144 + 256 = 480$ byte, e il font $95 \cdot 480 = 45\,600\,\text{B}$: raddoppiare l'altezza quadruplica lo spazio.
```

## Le famiglie: con le grazie, senza, a spaziatura fissa

Le famiglie di caratteri sono migliaia, ma per scegliere bastano tre gruppi.

| Gruppo | Come si riconosce | Nome generico in una pagina web | Esempi |
|---|---|---|---|
| con le grazie | piccoli tratti alle estremità delle lettere | `serif` | Times New Roman, Georgia |
| senza grazie | estremità nette, tratti di spessore quasi uniforme | `sans-serif` | Arial, Verdana |
| a spaziatura fissa | ogni carattere occupa la stessa larghezza | `monospace` | Courier New |

Le **grazie** sono i trattini che chiudono le aste delle lettere, eredità della scrittura con il pennello e lo scalpello. In un font **a spaziatura fissa** la i e la M sono larghe uguale; negli altri, detti proporzionali, ogni lettera ha la sua larghezza. Il codice dei programmi si scrive a spaziatura fissa perché così i rientri e le colonne restano allineati: lo vedi in ogni programma di queste lezioni.

Qui sotto c'è la locandina del concerto: una pagina web con il suo foglio di stile, che è il file dove si decide l'aspetto. Come si scrive un foglio di stile lo imparerai più avanti; per ora ti basta sapere che ogni riga tra le graffe ha la forma `proprietà: valore;`, e che tu cambi solo i valori. Apri la linguetta `style.css`, sostituisci `serif` con `sans-serif` e poi con `monospace`, ed esegui ogni volta. Guarda l'ultima riga della pagina: le due parole hanno dieci lettere ciascuna.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo in concerto</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Sabato 14 marzo alle 21, nella palestra
    della scuola. Ingresso libero: porta chi vuoi.</p>
    <p>illimitati<br>MAMMAMMAMM</p>
</body>
</html>
```

```codice css
body {
    font-family: serif;
}
```

Con `serif` e con `sans-serif` la parola "illimitati" è molto più corta di "MAMMAMMAMM"; con `monospace` sono lunghe uguale, lettera sopra lettera.

## Corpo, peso e interlinea

Scelta la famiglia, restano tre misure.

Il **corpo** è la dimensione del carattere. Non è l'altezza di una lettera: è l'altezza dello spazio riservato a una riga di lettere, che deve contenere sia le aste che salgono, come quella della d, sia quelle che scendono, come quella della p. Sulla carta si misura in punti tipografici ($1$ punto è $\frac{1}{72}$ di pollice, e il corpo $12$ è quello di un tema scritto al computer); in una pagina web di solito in pixel.

Il **peso** è lo spessore dei tratti. Si indica con un numero da $100$ a $900$: $400$ è il peso normale, $700$ il grassetto.

L'**interlinea** è la distanza tra la linea di base di una riga e quella della riga successiva, dove la **linea di base** è la riga immaginaria su cui poggiano le lettere. In una pagina web si scrive quasi sempre come multiplo del corpo: con corpo $16$ pixel e interlinea $1{,}5$ le linee di base distano $16 \cdot 1{,}5 = 24$ pixel.

```tikz
% nome: corpo-linea-di-base-interlinea
% alt: Due righe di testo, la prima con la parola Spiaggia e la seconda con la parola dorata. Sotto ogni riga una linea orizzontale tratteggiata, la linea di base, su cui poggiano le lettere; le aste della p e delle g scendono sotto. A sinistra una quota verticale tra le due linee di base indica l'interlinea; a destra una quota più corta, dalla cima delle lettere alte al fondo di quelle che scendono, indica il corpo
\begin{tikzpicture}
\node[anchor=base west, font=\Huge] at (1.2,1.5) {Spiaggia};
\node[anchor=base west, font=\Huge] at (1.2,0) {dorata};
\draw[dashed, orange, thick] (1.1,1.5) -- (5.3,1.5);
\draw[dashed, orange, thick] (1.1,0) -- (5.3,0);
\node[font=\footnotesize, right] at (5.3,1.5) {linea di base};
\draw[{Stealth}-{Stealth}, thick] (0.9,0) -- (0.9,1.5);
\node[font=\footnotesize, left] at (0.9,0.75) {interlinea};
\draw[thin, blue] (3.2,-0.26) -- (4.85,-0.26);
\draw[thin, blue] (3.2,0.64) -- (4.85,0.64);
\draw[{Stealth}-{Stealth}, thick, blue] (4.7,-0.26) -- (4.7,0.64);
\node[font=\footnotesize, right, blue] at (4.75,0.3) {corpo};
\end{tikzpicture}
```

Nella prossima pagina il foglio di stile ha le tre misure. Cambia `font-size` del paragrafo da `16px` a `22px` e guarda quante righe occupa adesso il testo; poi porta `line-height` da `1.5` a `1` e a `2`; infine porta `font-weight` del titolo da `700` a `400`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo in concerto</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Suoniamo insieme dalla prima: Sara alla voce,
    Leo alla batteria, Dario al basso e Marta
    alla chitarra. Sabato suoniamo per la prima volta
    davanti a un pubblico, quindi siate buoni.</p>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
}
h1 {
    font-size: 32px;
    font-weight: 700;
}
p {
    font-size: 16px;
    line-height: 1.5;
}
```

Con `line-height: 1` le righe si toccano quasi, e l'occhio a fine riga fatica a trovare l'inizio della successiva; con `2` il paragrafo si sfilaccia in righe separate. Nel foglio di stile i decimali si scrivono con il punto, all'inglese.

```ad-warning
Interlinea 1,5 non vuol dire una riga e mezza vuota
L'interlinea si misura da una linea di base all'altra, quindi comprende le lettere. Con corpo $20$ pixel e interlinea $1{,}5$ le righe distano $30$ pixel: $20$ sono del carattere e solo $10$ sono spazio in più. Un paragrafo di $4$ righe è alto $4 \cdot 30 = 120$ pixel.
```

## I font in una pagina web

Un documento da stampare può portarsi dietro i suoi font. Una pagina web, quando arriva al browser, porta solo il nome della famiglia che vorrebbe: il disegno delle lettere lo deve avere il dispositivo di chi guarda. E i dispositivi non hanno tutti gli stessi font installati.

Per questo `font-family` accetta un elenco, in ordine di preferenza. Il browser prova il primo nome; se quel font non è installato passa al secondo, e così via. L'ultimo nome è sempre uno dei nomi generici (`serif`, `sans-serif`, `monospace`), che non indicano un font preciso ma "quello che questo dispositivo usa per quel gruppo", e quindi ci sono sempre.

Nella pagina qui sotto il titolo chiede per primo un font che non esiste. Eseguila: il titolo compare lo stesso. Poi togli dall'elenco `Georgia` e la virgola che lo segue, ed esegui di nuovo; infine sostituisci `serif` con `monospace`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo in concerto</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Sabato 14 marzo alle 21, nella palestra della scuola.</p>
</body>
</html>
```

```codice css
h1 {
    font-family: "Carattere Inventato", Georgia, serif;
}
```

Il browser ha saltato il font inventato senza segnalare niente, e ha usato il primo dell'elenco che ha trovato. Se sul tuo dispositivo Georgia c'è, togliendolo il titolo è cambiato di poco, perché è passato a un altro font con le grazie; se non c'è, non è cambiato affatto. È quello che succede a ogni pagina: lo stesso foglio di stile può dare lettere diverse su due dispositivi, e chi scrive la pagina decide solo fino a dove.

Chi vuole proprio un certo font ha una seconda strada: mettere il file del font sul server, accanto alla pagina, e dire al browser di scaricarlo come fa con le immagini. Si chiamano font web. Costano una richiesta in più e qualche istante di attesa, durante il quale il testo si vede con un font di riserva.

```ad-warning
Un nome di font con uno spazio va tra virgolette
`font-family: Courier New, monospace` funziona, ma è facile sbagliare; la forma sicura è `font-family: "Courier New", monospace`. I nomi generici invece non vogliono mai le virgolette: `"serif"` tra virgolette è il nome di un font che si chiama serif, e quasi certamente non esiste.
```

## Un testo che si legge bene

La scelta del font decide anche quanta fatica fa chi legge. Per un testo lungo valgono poche regole, e le hai già provate tutte nelle pagine di questa lezione.

- Il corpo del testo corrente non scende sotto i $16$ pixel su uno schermo.
- L'interlinea sta tra $1{,}4$ e $1{,}6$ volte il corpo; i titoli, che hanno poche righe, ne vogliono meno.
- Una o due famiglie in tutta la pagina, per esempio una per i titoli e una per il testo. Le differenze si fanno con il corpo e con il peso.
- I font decorativi, quelli che imitano la scrittura a mano o i fumetti, vanno bene per un titolo di tre parole e stancano in un paragrafo.
- Un testo tutto in maiuscole si legge più lentamente, perché le parole perdono la loro sagoma.
- Il codice e i dati in colonna vogliono un font a spaziatura fissa.

## Prova tu

Nella prima pagina il titolo ha un aspetto qualunque. Scrivi i valori che mancano nel foglio di stile perché il titolo sia in un font senza grazie, con corpo di $40$ pixel e peso normale, cioè non in grassetto.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo in concerto</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Sabato 14 marzo alle 21, nella palestra della scuola.</p>
</body>
</html>
%% controllo Il titolo è in un font senza grazie
h1 | stile font-family = sans-serif
%% controllo Il titolo ha corpo 40 pixel
h1 | stile font-size = 40px
%% controllo Il titolo ha il peso normale
h1 | stile font-weight = 400
```

```codice css
h1 {
    font-family: serif;
    font-size: 20px;
    font-weight: 700;
}
%% soluzione
h1 {
    font-family: sans-serif;
    font-size: 40px;
    font-weight: 400;
}
```

La seconda pagina è il testo di una canzone, e si legge male: è piccolo, fitto, e in un font in cui le righe non restano allineate. Correggi il foglio di stile: il paragrafo deve avere corpo $18$ pixel, le linee di base devono distare $27$ pixel (trova tu il valore di `line-height`), e la famiglia deve essere un elenco che prova prima `"Courier New"` e finisce con il nome generico dei font a spaziatura fissa.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Fuori tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Fuori tempo</h1>
    <p>Conto fino a quattro e parto al tre,<br>
    il metronomo ce l'ha con me.<br>
    Ma se sbagliamo tutti insieme<br>
    nessuno saprà mai chi è.</p>
</body>
</html>
%% controllo Il testo ha corpo 18 pixel
p | stile font-size = 18px
%% controllo Le linee di base distano 27 pixel
p | stile line-height = 27px
%% controllo La famiglia è Courier New, poi monospace
p | stile font-family = "Courier New", monospace
```

```codice css
p {
    font-family: serif;
    font-size: 11px;
    line-height: 1;
}
%% soluzione
p {
    font-family: "Courier New", monospace;
    font-size: 18px;
    line-height: 1.5;
}
```
