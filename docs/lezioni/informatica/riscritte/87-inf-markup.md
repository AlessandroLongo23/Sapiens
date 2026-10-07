# I linguaggi di markup

I Fuori Tempo vogliono una pagina sul web: il nome del gruppo, una riga per dire che musica fanno, l'elenco di chi suona. Sara scrive tutto in un file di testo, lo salva con il nome `pagina.html` e lo apre con il browser. Il risultato è una riga sola, lunga, con le parole una dietro l'altra: il nome del gruppo è grande quanto il resto, e l'elenco è sparito. In un file di solo testo ci sono i caratteri e nient'altro, e il browser non ha modo di sapere che la prima riga era un titolo.

## Marcare un testo

Quando un'insegnante corregge un tema scrive sul foglio dei segni che non fanno parte del tema: una riga ondulata sotto una frase, "a capo" a margine, un cerchio attorno a una parola. Chi legge li distingue dal testo, e sa che cosa vogliono dire.

Un **linguaggio di markup** fa la stessa cosa dentro un file. È un insieme di segni, chiamati marcatori, che si scrivono in mezzo al testo per dire che cos'è ogni sua parte, e di regole su come scriverli. Il nome viene dall'inglese to mark up, "annotare". I marcatori devono potersi distinguere dal testo: nel linguaggio delle pagine web, l'**HTML** (HyperText Markup Language), sono le scritte tra `<` e `>` che hai incontrato nella lezione sul [web](/materiale/scuola-superiore/informatica/internet-e-il-web/il-web-ipertesti-url-e-protocollo-http).

```
<h1>I Fuori Tempo</h1>
```

Qui il testo è "I Fuori Tempo", e i due marcatori attorno dicono che è un titolo.

### Che cos'è, non come appare

Di un titolo si possono dire due cose diverse. "Questa riga è il titolo della pagina" descrive la **struttura**: il ruolo di quel pezzo di testo. "Questa riga è in grassetto, corpo $32$, centrata" descrive l'aspetto. Un linguaggio di markup come l'HTML marca la struttura; l'aspetto si decide altrove, in un foglio di stile, come hai fatto nella lezione sui [font](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/caratteri-tipografici-e-font).

Tenere separate le due cose ha tre vantaggi concreti. Lo stesso testo marcato può essere mostrato su uno schermo largo, su un telefono, stampato, oppure letto ad alta voce da un programma per chi non vede, e ognuno sceglie l'aspetto adatto: una voce non ha il grassetto, ma sa che cosa fare di un titolo. Per cambiare l'aspetto di tutti i titoli di un sito si cambia una riga del foglio di stile, non ogni titolo. E un programma che cerca i titoli di una pagina, come fa un motore di ricerca, li trova perché sono marcati come titoli.

```ad-warning
"Lo metto in h1 così viene grande"
Scegliere un marcatore per l'aspetto che dà è l'errore più comune di chi comincia. Il marcatore si sceglie per quello che il testo è: se una frase non è un titolo non si marca come titolo, anche se la si vuole grande. A farla grande penserà il foglio di stile.
```

## Tag, elementi, attributi

In HTML un marcatore si chiama **tag**. I tag vanno quasi sempre a coppie: il tag di apertura è un nome tra `<` e `>`, il tag di chiusura è lo stesso nome preceduto da una barra. Quello che sta in mezzo è il contenuto, e le tre cose insieme formano un **elemento**.

Un tag di apertura può portare degli **attributi**, che aggiungono un'informazione all'elemento. Un attributo si scrive dopo il nome del tag, nella forma `nome="valore"`.

```tikz
% nome: parti-di-un-elemento-html
% alt: L'elemento a con il suo attributo, diviso in caselle su una riga: il tag di apertura, che contiene il nome a e l'attributo href con valore concerti.html; il contenuto, cioè le parole I concerti; il tag di chiusura, con la barra prima del nome a. Una graffa sotto tutte le caselle indica che insieme formano l'elemento
\begin{tikzpicture}
\tikzset{
  cod/.style={font=\footnotesize\ttfamily, anchor=base west, inner sep=0pt},
  et/.style={font=\footnotesize, align=center}}
% the angle brackets are drawn: a < or a > written as text breaks the SVG
\newcommand{\minore}[1]{\draw[thick] (#1+0.13,0.2) -- (#1,0.09) -- (#1+0.13,-0.02);}
\newcommand{\maggiore}[1]{\draw[thick] (#1,0.2) -- (#1+0.13,0.09) -- (#1,-0.02);}
\draw[thick, fill=orange!25] (0,-0.25) rectangle (4.05,0.45);
\draw[thick, fill=green!15] (4.05,-0.25) rectangle (6.0,0.45);
\draw[thick, fill=orange!25] (6.0,-0.25) rectangle (7.0,0.45);
\minore{0.15}
\node[cod] at (0.36,0) {a href="concerti.html"};
\maggiore{3.75}
\node[cod] at (4.2,0) {I concerti};
\minore{6.15}
\node[cod] at (6.36,0) {/a};
\maggiore{6.72}
\node[et] at (2.0,0.75) {tag di apertura};
\node[et] at (5.0,0.75) {contenuto};
\node[et] at (6.5,1.2) {tag di chiusura};
\draw[thin] (6.5,1.02) -- (6.5,0.5);
\draw[thick, blue] (0.68,-0.42) -- (3.68,-0.42);
\node[et, blue] at (2.18,-0.72) {attributo: nome e valore};
\draw[thick] (0,-1.1) -- (0,-1.25) -- (7.0,-1.25) -- (7.0,-1.1);
\node[et] at (3.5,-1.55) {elemento};
\end{tikzpicture}
```

Nella figura l'elemento si chiama `a` ed è un link: il contenuto, "I concerti", è il testo su cui si fa clic; l'attributo `href` dice a quale pagina porta. Il valore dell'attributo non compare nella pagina: serve al browser.

```ad-example
Esempio 1: leggere un elemento
In `<p lang="en">Rock around the clock</p>` quali sono il nome dell'elemento, il contenuto, il nome e il valore dell'attributo?

L'elemento si chiama `p`, come dicono i due tag. Il contenuto è il testo tra i tag, "Rock around the clock". L'attributo si chiama `lang` e vale `en`: dice in che lingua è scritto il paragrafo.
```

```ad-note
Elementi senza contenuto
Qualche elemento non ha niente da racchiudere, e allora non ha nemmeno il tag di chiusura. Il più semplice è `<br>`, che manda a capo. Li incontrerai uno alla volta nelle prossime lezioni.
```

## Un elemento dentro l'altro

Il contenuto di un elemento può essere testo, ma anche altri elementi, che a loro volta ne contengono altri. Si dice che gli elementi sono **annidati**. Un elemento che ne contiene un altro è il suo genitore, quello contenuto è il figlio: un testo marcato, visto così, è un albero, come [l'albero delle cartelle](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi) di un disco.

Nella figura c'è il testo della pagina dei Fuori Tempo tre volte: come lo scrive chi fa la pagina, come albero, e come lo disegna il browser. Fai clic su `p` nell'albero e guarda che cosa si accende nel testo marcato e nella pagina; poi su `em`, su `ul` e su uno dei due `li`. Per ogni elemento cerca dove comincia e dove finisce nel testo.

```interattivo
% nome: inf-markup-testo-albero-pagina
% alt: Lo stesso testo in tre forme. Il testo marcato in HTML: un titolo h1 con le parole I Fuori Tempo, un paragrafo p con la frase Suoniamo rock dal 2024 in cui la parola rock è dentro un elemento em, e un elenco ul con due voci li, Sara voce e Leo batteria. L'albero: la radice body con tre figli, h1, p e ul; p contiene un testo, em e un altro testo; ul contiene due li. La pagina come la disegna il browser. Scegliendo un elemento in una delle tre forme, la sua parte si colora nelle altre due. Un comando in alto riscrive il testo marcato in Markdown, e l'albero e la pagina restano uguali
```

Ogni elemento occupa nel testo un tratto continuo, dal suo tag di apertura al suo tag di chiusura, e tutto quello che sta in quel tratto è suo: `em` comincia e finisce dentro `p`, i due `li` dentro `ul`. Da qui viene la regola dell'annidamento: un elemento aperto dentro un altro va chiuso prima che si chiuda quello che lo contiene. I tag si chiudono nell'ordine inverso a quello in cui sono stati aperti, come le parentesi di un'espressione.

```ad-example
Esempio 2: annidamento giusto e sbagliato
Quale delle due righe è annidata correttamente?

`<p>Suoniamo <em>rock</em> dal 2024.</p>`

`<p>Suoniamo <em>rock dal 2024.</p></em>`

La prima. Nella seconda `em` è aperto dentro `p` ma viene chiuso dopo `</p>`: i due elementi si accavallano, e nessuno dei due sta per intero dentro l'altro. Con le parentesi sarebbe come scrivere `( [ ) ]`.
```

## La prima pagina

Qui sotto c'è la pagina dei Fuori Tempo, completa. Le prime righe, fino a `<body>`, e le ultime due servono al browser per sapere che documento ha davanti: le spiega la prossima lezione, e per ora non toccarle. Il tuo testo sta tra `<body>` e `</body>`.

Esegui la pagina. Poi cambia le parole del titolo ed esegui di nuovo. Aggiungi sotto il paragrafo un secondo paragrafo, con i suoi due tag, che dica dove prova il gruppo. Infine metti la parola "voce" tra `<strong>` e `</strong>`, che marca un testo come importante.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Suoniamo <em>rock</em> dal 2024.</p>
    <ul>
        <li>Sara, voce</li>
        <li>Leo, batteria</li>
    </ul>
</body>
</html>
```

Gli spazi a inizio riga e gli a capo che vedi nel file servono solo a chi legge il file: per il browser una fila di spazi e di a capo vale quanto uno spazio solo, e a decidere dove si va a capo nella pagina sono gli elementi. Per convincertene scrivi tutto l'elenco su una riga sola: la pagina non cambia.

Ora fai un errore apposta: cancella `</h1>` ed esegui.

```ad-warning
Un tag non chiuso si prende tutto quello che segue
Senza `</h1>` il titolo non finisce più, e il paragrafo e l'elenco vengono disegnati grandi come lui. Il browser non si ferma e non avvisa: prova a indovinare dove l'elemento doveva chiudersi, e spesso indovina male. Quando metà della pagina ha l'aspetto sbagliato, la prima cosa da cercare è un tag di chiusura mancante, oppure scritto senza la barra.
```

## Un linguaggio di markup non è un linguaggio di programmazione

Con Python e con il C++ hai scritto [programmi](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/linguaggi-compilatori-e-interpreti): sequenze di istruzioni che il computer esegue, con variabili che cambiano valore, condizioni e cicli. L'HTML non ha niente di tutto questo. Non ha variabili, non sa fare $2 + 2$, non può ripetere una riga dieci volte né scegliere tra due strade. Non dice che cosa fare: dice che cosa c'è.

| | Un programma in Python | Una pagina in HTML |
|---|---|---|
| Di che cosa è fatto | istruzioni | testo e marcatori |
| Che cosa ne fa il computer | lo esegue, un'istruzione dopo l'altra | lo legge e lo disegna |
| Lo stesso file, due volte | può dare risultati diversi, secondo i dati letti | dà sempre la stessa pagina |
| Un errore | ferma il programma, o dà un risultato sbagliato | la pagina compare lo stesso, magari storta |

Per questo si dice "scrivere una pagina in HTML" e non "programmare in HTML". Quando in una pagina serve qualcosa che cambia, come un contatore o un controllo su quello che scrivi in un modulo, alla pagina si aggiunge un programma vero, in un altro linguaggio.

## Altri linguaggi di markup

L'HTML ha un insieme fisso di tag, pensati per le pagine web, e il loro significato è stabilito una volta per tutti. Altri linguaggi fanno scelte diverse.

L'**XML** (Extensible Markup Language) ha la stessa scrittura a tag ma nessun tag suo: i nomi li sceglie chi lo usa, secondo quello che deve descrivere. Oggi si usa per i dati più che per i documenti, e lo trovi nella lezione sui [dati strutturati](/materiale/scuola-superiore/informatica/i-file/dati-strutturati-xml-e-json). In cambio della libertà chiede più disciplina: un file XML con un tag non chiuso viene rifiutato per intero.

```
<concerto>
    <data>14 marzo</data>
    <luogo>palestra</luogo>
</concerto>
```

Il **Markdown** va nella direzione opposta: marcatori cortissimi, fatti dei segni che si usavano già per scrivere in fretta, così che il testo si legga bene anche prima di essere trasformato. Un programma lo converte poi in HTML. Lo usano molte chat, i programmi per gli appunti e i siti in cui si scrive documentazione.

| Markdown | HTML corrispondente | Che cos'è |
|---|---|---|
| `# Titolo` | `<h1>Titolo</h1>` | un titolo |
| `*parola*` | `<em>parola</em>` | un testo messo in evidenza |
| `**parola**` | `<strong>parola</strong>` | un testo importante |
| `- voce` | `<li>voce</li>`, dentro `<ul>` | una voce di un elenco |

Torna alla figura dell'albero e scegli "Markdown" in alto: il testo marcato cambia, l'albero e la pagina no. La struttura è la stessa, scritta con altri segni; ed è la struttura, non la scrittura dei marcatori, quello che un linguaggio di markup descrive.

## Prova tu

Nella prima pagina c'è solo il testo, senza marcatori. Marca "Prossimo concerto" come titolo con `h1` e la frase sotto come paragrafo con `p`; dentro il paragrafo, metti in evidenza con `em` la parola "gratis".

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Prossimo concerto</title>
</head>
<body>
    Prossimo concerto
    Sabato in palestra, ed è gratis.
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Prossimo concerto</title>
</head>
<body>
    <h1>Prossimo concerto</h1>
    <p>Sabato in palestra, ed è <em>gratis</em>.</p>
</body>
</html>
%% controllo Il titolo è un elemento h1
h1 | testo = Prossimo concerto
%% controllo La frase è un paragrafo
p | testo = Sabato in palestra, ed è gratis.
%% controllo "gratis" è in evidenza, dentro il paragrafo
p > em | testo = gratis
```

Nella seconda pagina qualcuno ha scritto in fretta, e ci sono tre errori nei tag: uno non è chiuso, uno è chiuso senza la barra, due si accavallano. Correggili senza cambiare le parole. Alla fine la pagina deve avere un titolo, due paragrafi e un elenco di tre voci.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>La scaletta</title>
</head>
<body>
    <h1>La scaletta
    <p>Sabato suoniamo <strong>tre</strong> canzoni.<p>
    <ul>
        <li>Fuori tempo</li>
        <li>Lunedì alle otto</li>
        <li>L'ultima campanella</li>
    </ul>
    <p>Poi <em>forse un bis.</p></em>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>La scaletta</title>
</head>
<body>
    <h1>La scaletta</h1>
    <p>Sabato suoniamo <strong>tre</strong> canzoni.</p>
    <ul>
        <li>Fuori tempo</li>
        <li>Lunedì alle otto</li>
        <li>L'ultima campanella</li>
    </ul>
    <p>Poi <em>forse un bis.</em></p>
</body>
</html>
%% controllo Il titolo contiene solo "La scaletta"
h1 | testo = La scaletta
%% controllo I paragrafi sono due, e stanno fuori dal titolo
body > p | quanti = 2
%% controllo L'elenco ha tre voci e sta fuori dal titolo
body > ul > li | quanti = 3
%% controllo "forse un bis." è in evidenza dentro il secondo paragrafo
body > p > em | testo = forse un bis.
```

Nell'ultima pagina devi tradurre. Questo è un appunto in Markdown:

```
# Cerchiamo un tastierista

Proviamo il **giovedì** in aula musica.

- sa leggere uno spartito
- ha una tastiera
```

Scrivi tra `<body>` e `</body>` l'HTML corrispondente, con la tabella della lezione davanti.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Cerchiamo un tastierista</title>
</head>
<body>

</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Cerchiamo un tastierista</title>
</head>
<body>
    <h1>Cerchiamo un tastierista</h1>
    <p>Proviamo il <strong>giovedì</strong> in aula musica.</p>
    <ul>
        <li>sa leggere uno spartito</li>
        <li>ha una tastiera</li>
    </ul>
</body>
</html>
%% controllo Il titolo
h1 | testo = Cerchiamo un tastierista
%% controllo Il paragrafo, con "giovedì" marcato come importante
p | testo = Proviamo il giovedì in aula musica.
p > strong | testo = giovedì
%% controllo L'elenco con le due voci
ul > li | quanti = 2
ul > li | testo = sa leggere uno spartito
```
