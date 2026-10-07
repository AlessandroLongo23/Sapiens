# Struttura di una pagina HTML

I Fuori Tempo sono quattro compagni della 3B che suonano insieme, e per il concerto di fine anno vogliono una pagina web: il nome del gruppo, due righe su chi sono, la data. Nella lezione sui [linguaggi di markup](/materiale/scuola-superiore/informatica/il-linguaggio-html/i-linguaggi-di-markup) hai visto che una pagina si scrive marcando il testo con i tag. Qui la pagina dei Fuori Tempo prende forma un pezzo alla volta: lo scheletro che ogni file HTML ha, i titoli e i paragrafi, le parti in cui una pagina si divide.

## Lo scheletro di ogni pagina

Un file HTML comincia sempre con le stesse righe, e alcune non lasciano traccia in quello che si vede. Nella pagina qui sotto cambia il testo tra `<title>` e `</title>`: nell'anteprima non cambia niente. Cambia poi il testo tra `<h1>` e `</h1>`: il titolo in cima alla pagina cambia mentre scrivi.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Il gruppo musicale della 3B.</p>
</body>
</html>
```

Ogni riga dello scheletro ha un compito.

- `<!DOCTYPE html>` è il **doctype**: dichiara al browser che il file è scritto nell'HTML di oggi. Non è un tag, non si chiude e sta nella prima riga.
- `<html>` è l'elemento che contiene tutti gli altri, e si chiude nell'ultima riga. L'attributo `lang="it"` dice in che lingua è scritto il testo: lo usano i programmi che leggono la pagina ad alta voce, per scegliere la pronuncia, e i traduttori automatici.
- `<head>` è la **testa** del documento: raccoglie le informazioni sulla pagina, che il browser usa ma non disegna.
- `<body>` è il **corpo**: tutto quello che compare nella finestra del browser sta qui dentro.

Nella testa di questa pagina ci sono due elementi. `<meta charset="utf-8">` dichiara con quale [codifica dei caratteri](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-caratteri-ascii-e-unicode) è salvato il file: se manca, il browser deve indovinarla, e quando sbaglia le lettere accentate diventano coppie di simboli senza senso. È un elemento senza contenuto, quindi non ha un tag di chiusura. `<title>` è il titolo del documento: non compare nella pagina, ma è il nome che leggi sulla scheda del browser, tra i preferiti e nei risultati di un motore di ricerca. L'anteprima qui sopra non ha una scheda, ed è per questo che cambiarlo non mostrava nessun effetto.

```ad-warning
Il titolo del documento non è il titolo nella pagina
`<title>` sta nella testa e dà il nome alla scheda; `<h1>` sta nel corpo ed è il titolo che il lettore vede in cima alla pagina. Servono tutti e due, anche quando dicono la stessa cosa. L'errore opposto è scrivere dentro `<head>` un testo da mostrare: quello che si deve vedere va nel corpo.
```

## Titoli e paragrafi

Il testo di una pagina è fatto soprattutto di titoli e di paragrafi. Un **paragrafo** è un elemento `<p>`: un blocco di testo che il browser stacca da quello che viene prima e da quello che viene dopo. I **titoli** hanno sei livelli, da `<h1>` a `<h6>` (la h sta per heading, intestazione). `<h1>` è il titolo della pagina, `<h2>` il titolo di una sua parte, `<h3>` il titolo di una parte dentro quella parte, come i capitoli e i paragrafi nell'indice di un libro.

Nel file puoi andare a capo e rientrare le righe come vuoi, perché il browser tratta una fila di spazi e di a capo come un solo spazio. Nella pagina qui sotto il secondo paragrafo è scritto su tre righe, e nell'anteprima è un blocco unico, che va a capo solo dove finisce la larghezza. Aggiungi dieci spazi tra due parole, poi dividi il primo paragrafo in due elementi `<p>`: soltanto la seconda modifica cambia la pagina.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Siamo il gruppo musicale della 3B.</p>
    <h2>Chi siamo</h2>
    <p>Sara canta,
       Leo sta alla batteria,
       Marta e Dario suonano chitarra e basso.</p>
    <h2>Il prossimo concerto</h2>
    <p>Venerdì 5 giugno, in aula magna.</p>
</body>
</html>
```

I livelli dei titoli descrivono la struttura, non la grandezza delle scritte. Il browser disegna `<h1>` più grande di `<h2>`, ma l'aspetto si decide con i [fogli di stile](/materiale/scuola-superiore/informatica/i-fogli-di-stile/regole-e-selettori-css), e un titolo si sceglie chiedendosi di che cosa è il titolo. Due regole tengono in ordine la struttura: un solo `<h1>` per pagina, e nessun livello saltato scendendo, cioè sotto un `<h2>` viene un `<h3>` e non un `<h4>`.

```ad-warning
Scegliere il titolo per la sua grandezza
Usare `<h4>` perché `<h2>` "viene troppo grande", o `<h1>` per una frase da mettere in evidenza, rompe la struttura. Chi non vede lo schermo si sposta nella pagina saltando da un titolo all'altro, e si ritrova con un indice che non corrisponde al contenuto; lo stesso indice lo legge un motore di ricerca.
```

## Le parti della pagina

Quasi tutte le pagine hanno le stesse parti: in alto il nome del sito e il menu, al centro il contenuto, in fondo le informazioni su chi l'ha fatta. HTML ha un elemento per ognuna, e si chiamano **elementi semantici** perché il loro nome dice che cosa contengono.

| Elemento | Che cosa contiene |
|---|---|
| `<header>` | l'intestazione: il nome del sito, il titolo |
| `<nav>` | il menu, cioè i link per muoversi nel sito |
| `<main>` | il contenuto proprio di questa pagina; ce n'è uno solo |
| `<section>` | una parte del contenuto, con il suo titolo |
| `<footer>` | il piè di pagina: autori, contatti, note |

Ecco la pagina dei Fuori Tempo divisa nelle sue parti. Confrontala con quella di prima: nell'anteprima non è comparso nessun bordo e nessun colore. Cancella le righe con `<main>` e `</main>` e guarda che cosa cambia nella pagina.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <header>
        <h1>I Fuori Tempo</h1>
        <p>Il gruppo musicale della 3B.</p>
    </header>
    <nav>
        <a href="concerti.html">Concerti</a>
        <a href="contatti.html">Contatti</a>
    </nav>
    <main>
        <section>
            <h2>Chi siamo</h2>
            <p>Sara canta, Leo sta alla batteria.</p>
        </section>
        <section>
            <h2>Il prossimo concerto</h2>
            <p>Venerdì 5 giugno, in aula magna.</p>
        </section>
    </main>
    <footer>
        <p>Pagina scritta dalla 3B.</p>
    </footer>
</body>
</html>
```

Senza `<main>` la pagina è identica. Gli elementi semantici non sono fatti per cambiare l'aspetto: servono a chi legge il file al posto tuo. Un programma che legge la pagina ad alta voce offre di saltare il menu e andare al contenuto di `<main>`, un motore di ricerca distingue il testo della pagina dall'intestazione, e i fogli di stile useranno questi nomi per [disporre le parti sullo schermo](/materiale/scuola-superiore/informatica/i-fogli-di-stile/l-impaginazione-di-una-pagina-web). Nel menu ci sono due link, scritti con `<a>`: se ci fai clic, l'anteprima avvisa che non può aprirli, perché quelle pagine non esistono ancora. Dei link si occupa la [prossima lezione](/materiale/scuola-superiore/informatica/il-linguaggio-html/testo-link-e-immagini).

```ad-warning
head e header sono due elementi diversi
`<head>` è la testa del documento, con il titolo della scheda e la codifica, e non si vede. `<header>` è l'intestazione che il lettore vede in cima alla pagina, e sta dentro `<body>`. Scrivere il titolo `<h1>` dentro `<head>` è uno degli errori più comuni delle prime pagine.
```

```ad-note
Un contenitore che non dice niente
Quando nessuno di questi nomi descrive una parte, e ti serve solo tenere insieme alcuni elementi, c'è `<div>`, che non dice niente sul suo contenuto. Lo userai con i fogli di stile; finché un elemento semantico va bene, si sceglie quello.
```

## L'albero del documento

Ogni elemento della pagina sta dentro un altro, tranne `<html>`, che li contiene tutti. Una struttura così è un albero, come quello delle [cartelle](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi): `<html>` è la radice, e da ogni elemento scendono quelli scritti al suo interno. Le parole sono quelle di una famiglia. Un elemento è **figlio** di quello che lo contiene direttamente, che è il suo **genitore**; due elementi con lo stesso genitore sono **fratelli**. Nella prima pagina di questa lezione `<html>` ha due figli, `<head>` e `<body>`, e `<title>` è figlio di `<head>` e fratello di `<meta>`.

```tikz
% nome: albero-documento-html-scheletro
% alt: Albero del documento della prima pagina. In cima il nodo html, da cui scendono due rami verso head e body. Da head scendono meta e title; da body scendono h1 e p
% svg: albero-documento-html-scheletro-283c4329.svg 270x118
\begin{tikzpicture}
\tikzset{el/.style={draw, thick, rounded corners=3pt, fill=orange!20, minimum height=0.6cm, minimum width=1.0cm, inner xsep=5pt, font=\small\ttfamily}}
\node[el] (html) at (0,0) {html};
\node[el] (head) at (-2.0,-1.2) {head};
\node[el] (body) at (2.0,-1.2) {body};
\node[el] (meta) at (-3.0,-2.4) {meta};
\node[el] (title) at (-1.0,-2.4) {title};
\node[el] (h1) at (1.0,-2.4) {h1};
\node[el] (p) at (3.0,-2.4) {p};
\draw[thick] (html) -- (head);
\draw[thick] (html) -- (body);
\draw[thick] (head) -- (meta);
\draw[thick] (head) -- (title);
\draw[thick] (body) -- (h1);
\draw[thick] (body) -- (p);
\end{tikzpicture}
```

Il browser costruisce quest'albero mentre legge il file dall'alto, e la regola è una sola: un tag di apertura aggiunge un figlio all'ultimo elemento rimasto aperto, un tag di chiusura fa tornare al genitore. La figura lo mostra su una pagina dei Fuori Tempo ridotta all'osso. Tocca `main` nel file, nell'albero o nella pagina e guarda che cosa si accende negli altri due riquadri; poi tocca `head` e cercalo nella pagina. Premi "Esegui" per veder nascere l'albero una riga alla volta. Infine scegli "Senza `</h2>`" ed esegui di nuovo: che fine fa il paragrafo?

```interattivo
% nome: inf-html-albero-documento
% alt: Tre riquadri: il file HTML di una piccola pagina, l'albero dei suoi elementi con html in cima, head e body sotto, e la pagina disegnata come rettangoli uno dentro l'altro. Toccando un elemento in uno dei tre si accendono le sue righe nel file, il suo nodo nell'albero e il suo rettangolo nella pagina. Con i comandi dei passi il file viene letto una riga alla volta e l'albero cresce: ogni tag di apertura aggiunge un figlio all'ultimo elemento ancora aperto. Una scelta in alto toglie il tag di chiusura di h2, e il paragrafo che segue diventa figlio di h2
```

Ogni elemento del corpo occupa un rettangolo nella pagina, e il suo rettangolo contiene quelli dei figli: il rientro delle righe nel file, i rami dell'albero e i rettangoli uno dentro l'altro sono tre disegni della stessa cosa. `<head>` e `<title>` nell'albero ci sono, ma nella finestra non occupano nessun rettangolo. Senza `</h2>` il titolo resta aperto quando arriva il paragrafo, che quindi diventa suo figlio e viene scritto come un titolo. Il browser tiene quest'albero in memoria per tutto il tempo in cui la pagina è aperta: si chiama DOM, e lo ritroverai quando [uno script](/materiale/scuola-superiore/informatica/pagine-web-interattive/il-dom-e-gli-eventi) ne cambierà i rami.

## I commenti

Un **commento** è un pezzo del file che il browser salta: comincia con `<!--` e finisce con `-->`, anche molte righe dopo. Serve a lasciare una nota a chi leggerà il file, te compreso tra un mese, o a togliere per un momento un pezzo di pagina senza cancellarlo.

```html
<!-- Da aggiornare dopo il concerto di giugno -->
<p>Venerdì 5 giugno, in aula magna.</p>
<!-- <p>Ingresso con offerta libera.</p> -->
```

Di queste tre righe il browser mostra solo la seconda.

```ad-warning
Un commento non è un segreto
Il browser non disegna i commenti, ma li riceve con il resto del file, e chiunque li legge guardando il sorgente della pagina: niente password, niente nomi, niente giudizi. E un commento aperto con `<!--` e mai chiuso fa sparire tutto quello che lo segue, fino alla fine del file.
```

## Quando il file ha un errore

Un programma con un [errore di sintassi](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/errori-e-debug) non parte, e dice a quale riga si è fermato. Un browser davanti a un errore dell'HTML non si ferma e non avvisa: decide da solo che cosa volevi scrivere e disegna comunque una pagina. È una scelta comoda per chi visita un sito e scomoda per chi lo scrive, perché una pagina sbagliata può sembrare giusta, o mostrare il difetto lontano dal punto dell'errore.

Prova sulla pagina qui sotto, rimettendo a posto il file dopo ogni prova. Cancella `</h2>` dopo "Chi siamo": i paragrafi che seguono vengono scritti come un titolo, come nella figura. Scrivi `<titolo>` e `</titolo>` al posto di `<h2>` e `</h2>`: un tag che non esiste non ha nessun aspetto, e il testo resta testo normale. Cancella `</p>` alla fine del primo paragrafo: non cambia niente, perché il browser chiude un paragrafo da sé quando ne comincia un altro. Cancella infine `-->`: l'ultima riga della pagina sparisce.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <h2>Chi siamo</h2>
    <p>Quattro compagni della 3B.</p>
    <p>Suoniamo insieme dal 2024.</p>
    <!-- la scaletta è ancora da decidere -->
    <p>Venerdì 5 giugno, in aula magna.</p>
</body>
</html>
```

| Che cosa c'è nel file | Che cosa fa il browser |
|---|---|
| un tag di chiusura dimenticato | lascia l'elemento aperto, e quello che segue ci finisce dentro |
| un tag che non esiste | lo tiene come elemento senza aspetto e senza significato |
| un tag di chiusura di un elemento che non è aperto | lo salta |
| un testo da mostrare scritto in `<head>` | chiude la testa e lo sposta nel corpo |

```ad-warning
Una pagina che si vede bene può essere scritta male
Il browser ripara in silenzio, ma l'albero che costruisce può non essere quello che avevi in mente, e te ne accorgi più avanti, quando una regola di stile o uno script non trovano l'elemento che cercavano. Per questo conviene rientrare le righe come sono annidati gli elementi, chiudere i tag nell'ordine inverso a quello in cui li hai aperti, e passare la pagina a un validatore, cioè un programma che legge l'HTML e ne elenca gli errori.
```

## Prova tu

In ogni esercizio "Verifica" guarda l'albero della tua pagina, non il testo che hai scritto: contano gli elementi e dove stanno.

Il primo file ha lo scheletro incompleto. Dichiara che la pagina è in italiano, dai al documento il titolo "I Fuori Tempo", e nel corpo fai diventare la prima riga il titolo della pagina e la seconda un paragrafo.

```codice index.html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    I Fuori Tempo
    Suoniamo venerdì in aula magna.
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Suoniamo venerdì in aula magna.</p>
</body>
</html>
%% controllo L'elemento html dichiara la lingua italiana
html | attributo lang = it
%% controllo Nella testa c'è il titolo del documento, "I Fuori Tempo"
head > title | testo = I Fuori Tempo
%% controllo Nel corpo c'è un solo titolo h1, "I Fuori Tempo"
body > h1 | testo = I Fuori Tempo
h1 | quanti = 1
%% controllo La seconda riga è un paragrafo
body > p | testo = Suoniamo venerdì in aula magna.
```

Nel secondo file gli elementi sono tutti figli di `<body>`. Dividi la pagina nelle sue parti: il titolo nell'intestazione, i due link nel menu, il titolo `<h2>` con il suo paragrafo nel contenuto, l'ultimo paragrafo nel piè di pagina.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <a href="concerti.html">Concerti</a>
    <a href="contatti.html">Contatti</a>
    <h2>Il prossimo concerto</h2>
    <p>Venerdì 5 giugno, in aula magna.</p>
    <p>Pagina scritta dalla 3B.</p>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <header>
        <h1>I Fuori Tempo</h1>
    </header>
    <nav>
        <a href="concerti.html">Concerti</a>
        <a href="contatti.html">Contatti</a>
    </nav>
    <main>
        <h2>Il prossimo concerto</h2>
        <p>Venerdì 5 giugno, in aula magna.</p>
    </main>
    <footer>
        <p>Pagina scritta dalla 3B.</p>
    </footer>
</body>
</html>
%% controllo Il titolo h1 è figlio di header
body > header > h1
%% controllo I due link sono figli di nav
body > nav > a | quanti = 2
%% controllo Il titolo h2 e il suo paragrafo sono figli di main
body > main > h2
body > main > p | testo contiene 5 giugno
main | quanti = 1
%% controllo L'ultimo paragrafo è figlio di footer
body > footer > p | testo contiene 3B
%% controllo Nessun titolo, link o paragrafo è rimasto figlio di body
body > h1 | non esiste
body > h2 | non esiste
body > a | non esiste
body > p | non esiste
```

Il terzo file ha tre errori, e il browser li ha riparati a modo suo: guarda l'anteprima prima di correggere. Un titolo non è chiuso, un titolo ha il livello sbagliato e un commento non finisce. A pagina corretta i titoli `<h2>` sono due e i paragrafi tre.

```codice index.html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <h2>Chi siamo
    <p>Quattro compagni della 3B.</p>
    <h4>Il prossimo concerto</h4>
    <p>Venerdì 5 giugno, in aula magna.</p>
    <!-- la scaletta è ancora da decidere
    <p>Ingresso libero.</p>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <h2>Chi siamo</h2>
    <p>Quattro compagni della 3B.</p>
    <h2>Il prossimo concerto</h2>
    <p>Venerdì 5 giugno, in aula magna.</p>
    <!-- la scaletta è ancora da decidere -->
    <p>Ingresso libero.</p>
</body>
</html>
%% controllo Il titolo "Chi siamo" è chiuso: non contiene il paragrafo
body > h2 | testo = Chi siamo
h2 p | non esiste
%% controllo I titoli sotto h1 sono due, tutti e due h2
h2 | quanti = 2
h4 | non esiste
%% controllo Il commento è chiuso: i paragrafi figli di body sono tre
body > p | quanti = 3
```
