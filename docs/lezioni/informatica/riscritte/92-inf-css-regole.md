# Regole e selettori CSS

Una pagina scritta solo in HTML dice che cosa è ogni suo pezzo: questo è un titolo, questo un paragrafo, questo un elenco. Non dice che aspetto deve avere, e infatti tutte le pagine senza stile si somigliano: testo nero su fondo bianco, titoli grossi, link blu e sottolineati. L'aspetto si decide in un secondo file, il **foglio di stile**, scritto in un linguaggio che si chiama CSS (Cascading Style Sheets, fogli di stile a cascata). Tenerlo separato conviene: tutte le pagine di un sito possono usare lo stesso foglio, e cambiando una riga di quel file cambia l'aspetto del sito intero.

## Collegare il foglio di stile alla pagina

Il foglio di stile è un file di testo con estensione `.css`. La pagina lo chiede con un elemento `link` dentro `head`, la parte della pagina che [contiene le informazioni per il browser](/materiale/scuola-superiore/informatica/il-linguaggio-html/struttura-di-una-pagina-html): `rel="stylesheet"` dice che il file collegato è un foglio di stile, `href` dice dove si trova.

Qui sotto c'è la home del sito dei Fuori Tempo, il gruppo musicale della scuola, con il suo foglio di stile nella seconda linguetta. Nel foglio cambia `crimson` in `teal` e premi "Esegui": il titolo cambia colore, e il file HTML non l'hai toccato. Poi cancella dalla pagina la riga con `<link>` ed esegui di nuovo.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Siamo quattro della 3B e suoniamo insieme dalla prima.</p>
    <h2>Prossimo concerto</h2>
    <p>Venerdì 12 dicembre, nella palestra della scuola.</p>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
    background-color: ivory;
}

h1 {
    color: crimson;
}
```

Senza la riga con `<link>` la pagina torna quella di partenza, anche se il foglio di stile è ancora lì, completo e corretto: il browser applica solo i fogli che la pagina gli chiede.

```ad-warning
Il foglio c'è, ma la pagina non lo chiede
Se la pagina resta senza stile, prima di cercare l'errore nel CSS guarda `href`: il nome del file deve essere scritto esatto, comprese le maiuscole e la cartella, se il foglio sta in una cartella.
```

## Com'è fatta una regola

Un foglio di stile è un elenco di regole. Una **regola** dice a quali elementi della pagina si applica e che cosa cambia in quegli elementi.

```tikz
% nome: parti-di-una-regola-css
% alt: La regola CSS h1 { color: crimson; } scritta su una riga, con tre caselle colorate. Sotto la casella h1 c'è scritto selettore; sotto la casella color c'è scritto proprietà; sotto la casella crimson c'è scritto valore. Una parentesi sopra color: crimson; porta la scritta dichiarazione
\begin{tikzpicture}
\tikzset{
  parte/.style={draw, thick, minimum height=0.7cm, inner xsep=5pt, font=\small\ttfamily},
  segno/.style={font=\small\ttfamily},
  et/.style={font=\footnotesize, align=center}}
\node[parte, fill=orange!25] at (0.6,0) {h1};
\node[segno] at (1.35,0) {\char123};
\node[parte, fill=green!15] at (2.4,0) {color};
\node[segno] at (3.2,0) {:};
\node[parte, fill=blue!10] at (4.4,0) {crimson};
\node[segno] at (5.45,0) {;};
\node[segno] at (6.0,0) {\char125};
\node[et] at (0.6,-0.75) {selettore};
\node[et] at (2.4,-0.75) {propriet\`a};
\node[et] at (4.4,-0.75) {valore};
\draw[thick] (1.75,0.55) -- (1.75,0.7) -- (5.6,0.7) -- (5.6,0.55);
\node[et] at (3.7,1.0) {dichiarazione};
\end{tikzpicture}
```

Il **selettore** sceglie gli elementi: `h1` vuol dire "tutti gli elementi `h1` della pagina". Tra le parentesi graffe stanno le **dichiarazioni**, ognuna fatta di una **proprietà** (che cosa cambiare), dei due punti, di un **valore** (come deve diventare) e di un punto e virgola che la chiude. Una regola può avere quante dichiarazioni vuoi, e di solito si scrivono una per riga, come nella regola di `body` qui sopra.

```ad-warning
Il CSS sbagliato non dà errori
Se dimentichi i due punti o il punto e virgola, o scrivi male il nome di una proprietà (`colour`, `font-colour`), il browser non ti avvisa: salta la dichiarazione che non capisce, e a volte anche quella dopo. Quando una regola sembra non fare niente, rileggila un segno alla volta.
```

## Colori e testo

Le proprietà sono centinaia. Con queste sei si cambia già l'aspetto di tutto il testo di una pagina:

| Proprietà | Che cosa cambia | Esempi di valore |
|---|---|---|
| `color` | il colore del testo | `crimson`, `#DC143C` |
| `background-color` | il colore dello sfondo | `ivory`, `#FFFFF0` |
| `font-family` | il carattere | `sans-serif`, `serif`, `monospace` |
| `font-size` | la grandezza del testo | `20px` |
| `font-weight` | lo spessore delle lettere | `normal`, `bold` |
| `text-align` | l'allineamento delle righe | `left`, `center`, `right` |

Un colore si scrive con uno dei nomi che il browser conosce (`red`, `navy`, `teal`, `gold` e più di cento altri) oppure con le sue tre componenti [rossa, verde e blu](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-delle-immagini-pixel-e-colori) in esadecimale: `#FF8000` è un arancione, con il rosso al massimo, il verde a metà e il blu spento. Le grandezze portano sempre l'unità, attaccata al numero: `20px` sono venti pixel, mentre `20` da solo e `20 px` con lo spazio non valgono niente.

Torna alla pagina qui sopra e aggiungi alla regola di `h1` la dichiarazione `text-align: center;`, poi dai a `body` un colore di sfondo scritto in esadecimale.

## I selettori

Con il selettore `p` tutti i paragrafi diventano uguali. Per dare un aspetto a un elemento solo, o a un gruppo di elementi scelti da te, servono altri selettori, e due attributi da scrivere nell'HTML: `class`, che mette un elemento in un gruppo a cui dai tu il nome, e `id`, che dà un nome a un solo elemento della pagina e che hai già usato come [punto di arrivo di un link](/materiale/scuola-superiore/informatica/il-linguaggio-html/testo-link-e-immagini).

| Selettore | Si scrive | Prende |
|---|---|---|
| di elemento | `li` | tutti gli elementi `li` |
| di classe | `.prossimo` | gli elementi con `class="prossimo"`, di qualunque tipo |
| di id | `#date` | l'elemento con `id="date"`, uno solo nella pagina |
| discendente | `nav a` | gli elementi `a` che stanno dentro un `nav`, a qualunque profondità |

Nella figura c'è la pagina dei concerti del gruppo, disegnata con i suoi elementi uno dentro l'altro. I link sono tre. Prima di provare, decidi quanti ne prende `nav a` e quanti `main a`; poi scrivi i due selettori nel campo, e dopo di loro `a`, `#date li` e `prossimo`, senza il punto.

```interattivo
% nome: inf-css-selettori
% alt: La pagina dei concerti dei Fuori Tempo disegnata come riquadri uno dentro l'altro: body contiene header e main; header contiene h1 e nav con due link; main contiene h2, un paragrafo con classe avviso, un elenco con id date e tre voci, la prima con classe prossimo, e un paragrafo con un link. Sopra c'è un campo in cui scrivere un selettore: gli elementi che il selettore prende si colorano di arancione, e una frase sotto dice quanti sono e perché
```

Il selettore `a` prende tutti e tre i link; `nav a` solo i due del menu, perché il terzo sta dentro `main`; `main a` solo quello. Lo spazio tra i due nomi vuol dire "dentro", e non importa quanti elementi ci siano in mezzo: `#date li` prende le tre voci dell'elenco, e le prenderebbe anche `main li` e `body li`. Invece `prossimo` non prende niente: senza il punto è il nome di un elemento, e nella pagina un elemento `<prossimo>` non c'è.

```ad-warning
Il selettore che non prende niente
Una regola con un selettore sbagliato è una regola corretta che non si applica a nessun elemento, e il browser non lo segnala. Gli sbagli più frequenti: il punto dimenticato davanti a una classe, il cancelletto usato per una classe (o il punto per un id), una lettera diversa tra l'HTML e il CSS. Contano anche le maiuscole: `.Prossimo` non prende `class="prossimo"`.
```

Qui sotto la stessa pagina ha un foglio di stile con tutti e quattro i tipi di selettore. Aggiungi `class="prossimo"` alla seconda voce dell'elenco: prende lo sfondo dorato anche lei, senza toccare il CSS. Poi togli il punto davanti a `.avviso`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Concerti</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>I Fuori Tempo</h1>
        <nav>
            <a href="index.html">Home</a>
            <a href="#date">Concerti</a>
        </nav>
    </header>
    <main>
        <h2>Prossimi concerti</h2>
        <p class="avviso">Ingresso libero</p>
        <ul id="date">
            <li class="prossimo">12 dicembre</li>
            <li>20 gennaio</li>
            <li>7 marzo</li>
        </ul>
        <p><a href="#date">Torna alle date</a></p>
    </main>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
}

a {
    color: teal;
}

nav a {
    font-weight: bold;
}

.avviso {
    color: crimson;
}

.prossimo {
    background-color: gold;
}

#date {
    color: navy;
}
```

```ad-note
La stessa regola per più selettori
Una virgola mette insieme più selettori: `h1, h2 { color: navy; }` vale per i titoli `h1` e per i titoli `h2`. Attenzione a non confonderla con lo spazio: `h1 h2` cerca un `h2` dentro un `h1`.
```

## L'ereditarietà

Nel foglio qui sopra la regola `#date` dà il colore `navy` all'elenco `ul`, e sono blu le tre voci `li`, per le quali nessuna regola parla di colore. Allo stesso modo il carattere scelto per `body` arriva fino all'ultimo paragrafo. È l'**ereditarietà**: le proprietà del testo (`color`, `font-family`, `font-size`, `font-weight`, `text-align`) passano da un elemento a tutti quelli che contiene, finché una regola non dice altro. Per questo il carattere di tutta la pagina si sceglie una volta sola, nella regola di `body`.

Lo sfondo non si eredita, e nemmeno i bordi e i margini della [prossima lezione](/materiale/scuola-superiore/informatica/i-fogli-di-stile/il-modello-a-scatola): se ogni voce ereditasse il bordo del suo elenco, la pagina si riempirebbe di cornici.

## La cascata: quale regola vince

Capita spesso che due regole diano alla stessa proprietà dello stesso elemento due valori diversi. Nella figura il paragrafo `<p id="avviso" class="nota">` sta dentro `main`, e cinque regole parlano del suo colore. Prima di toccarla, decidi di che colore è. Poi togli la spunta alla regola `#avviso`, poi a `.nota`; scambia di posto le due regole `p` con le frecce, e alla fine spegni anche quelle.

```interattivo
% nome: inf-css-cascata
% alt: Un paragrafo con id avviso e classe nota, dentro main, e sotto le cinque regole di un foglio di stile che gli danno un colore: main grigio, p blu scuro, .nota verde acqua, #avviso rosso, p viola. Ogni regola si può spegnere e spostare in su o in giù; accanto a ciascuna c'è scritto se vince, se è battuta o se non prende il paragrafo, con il numero di id, classi e nomi di elemento del suo selettore. Il paragrafo ha il colore della regola che vince
```

Il browser decide così, e l'insieme di questi passi si chiama **cascata**:

1. Tra le regole che prendono l'elemento vince quella con il selettore più preciso. Si contano gli id del selettore: chi ne ha di più vince. A parità di id si contano le classi, e a parità di classi i nomi di elemento. Questo peso si chiama **specificità**: `#avviso` batte `.nota`, che batte `p`, e `main p` (due nomi) batte `p` (uno).
2. Se due selettori pesano uguale, vince la regola scritta più in basso nel foglio.
3. Un valore ereditato perde contro qualunque regola che prende l'elemento: il grigio di `main` arriva al paragrafo solo quando tutte le altre regole sono spente.

Anche il browser ha un suo foglio di stile, ed è quello che fa i titoli grossi e i link blu. Le tue regole lo battono sempre, qualunque sia il loro peso. È anche il motivo per cui un link non prende il colore che dai a `body`: il foglio del browser ha una regola per `a`, e una regola sull'elemento batte il colore ereditato.

```ad-warning
Ho cambiato la regola e non succede niente
Se il valore è scritto bene e il selettore prende l'elemento, quasi sempre c'è un'altra regola che vince: una più in basso con lo stesso peso, oppure una con un id o una classe in più. Non serve riscrivere il valore: va cercata l'altra regola.
```

## Prova tu

Nel primo esercizio scrivi una regola intera. Nel foglio di stile aggiungi una regola per `h1` che scriva il titolo in colore `darkorange` e lo metta al centro della riga.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <p>Il gruppo musicale della 3B.</p>
</body>
</html>
%% controllo Il titolo è di colore darkorange
h1 | stile color = darkorange
%% controllo Il titolo è al centro
h1 | stile text-align = center
%% controllo Il paragrafo resta nero
p | stile color = black
```

```codice css
body {
    font-family: sans-serif;
}

/* scrivi qui la regola per h1 */
%% soluzione
body {
    font-family: sans-serif;
}

h1 {
    color: darkorange;
    text-align: center;
}
```

Nel secondo scegli tu i selettori, senza toccare l'HTML. La voce del prossimo concerto deve avere lo sfondo `gold`, lei sola; i link del menu devono essere in grassetto, ma non il link in fondo alla pagina.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Concerti</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="#date">Concerti</a>
    </nav>
    <main>
        <ul id="date">
            <li class="prossimo">12 dicembre</li>
            <li>20 gennaio</li>
            <li>7 marzo</li>
        </ul>
        <p><a href="#date">Torna alle date</a></p>
    </main>
</body>
</html>
%% controllo La voce con classe prossimo ha lo sfondo gold
.prossimo | stile background-color = gold
%% controllo Le altre voci non hanno sfondo
li:not(.prossimo) | stile background-color = transparent
%% controllo I link del menu sono in grassetto
nav a | stile font-weight = bold
%% controllo Il link in fondo non è in grassetto
main a | stile font-weight = normal
```

```codice css
li {
    background-color: gold;
}

a {
    font-weight: bold;
}
%% soluzione
.prossimo {
    background-color: gold;
}

nav a {
    font-weight: bold;
}
```

Nel terzo c'è una regola che perde. Le date sono scritte in `navy`, e la seconda regola dovrebbe scrivere in `crimson` il prossimo concerto, ma non ci riesce. Correggi il selettore della seconda regola, senza cancellare la prima e senza toccare l'HTML.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Concerti</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Prossimi concerti</h1>
    <ul id="date">
        <li class="prossimo">12 dicembre</li>
        <li>20 gennaio</li>
        <li>7 marzo</li>
    </ul>
</body>
</html>
%% controllo Il prossimo concerto è scritto in crimson
.prossimo | stile color = crimson
%% controllo Le altre date restano in navy
li:not(.prossimo) | stile color = navy
```

```codice css
#date li {
    color: navy;
}

.prossimo {
    color: crimson;
}
%% soluzione
#date li {
    color: navy;
}

#date .prossimo {
    color: crimson;
}
```
