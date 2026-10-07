# Il modello a scatola

Con le [regole della lezione precedente](/materiale/scuola-superiore/informatica/i-fogli-di-stile/regole-e-selettori-css) la pagina dei Fuori Tempo ha i suoi colori e il suo carattere, ma resta scomoda da leggere: il testo comincia attaccato al bordo della finestra, e la voce evidenziata ha lo sfondo che finisce dove finiscono le lettere. Mancano gli spazi. Per metterli bisogna sapere come il browser vede un elemento: come un rettangolo, con le sue misure e i suoi spazi attorno. È il **modello a scatola** (in inglese box model).

## Le quattro parti della scatola

Ogni elemento della pagina è una scatola fatta di quattro parti, una dentro l'altra. Dal centro verso l'esterno:

1. il **contenuto**: il testo o l'immagine dell'elemento;
2. il **padding**: lo spazio interno, tra il contenuto e il bordo. Prende il colore di sfondo dell'elemento;
3. il **bordo** (`border`): la cornice, con uno spessore, uno stile e un colore;
4. il **margine** (`margin`): lo spazio esterno, che tiene lontani gli altri elementi. È sempre trasparente.

Nella pagina qui sotto il riquadro del prossimo concerto è un `div`, l'elemento [senza un significato suo](/materiale/scuola-superiore/informatica/il-linguaggio-html/struttura-di-una-pagina-html) che serve a tenere insieme altri elementi: con i fogli di stile diventa una scatola a cui dare un aspetto. Nel foglio di stile porta `padding` da `16px` a `0` e premi "Esegui": il testo si attacca alla cornice. Rimettilo a posto, poi porta a `0` il margine: il riquadro si avvicina al bordo della pagina e al paragrafo sotto, che tengono i loro margini.

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
    <div class="concerto">
        Venerdì 12 dicembre, palestra della scuola.
    </div>
    <p>Dopo il concerto si smonta tutti insieme.</p>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
}

.concerto {
    width: 200px;
    padding: 16px;
    border: 4px solid darkorange;
    margin: 20px;
    background-color: ivory;
}
```

## Scrivere padding, bordo e margine

Un solo valore, come in `padding: 16px`, vale per tutti e quattro i lati. Con due valori il primo vale sopra e sotto, il secondo a sinistra e a destra: `padding: 8px 24px` dà 8 px in verticale e 24 px in orizzontale. Per un lato solo c'è la proprietà con il nome del lato: `padding-top` (sopra), `padding-right` (a destra), `padding-bottom` (sotto), `padding-left` (a sinistra). Per il margine vale tutto allo stesso modo, con `margin` al posto di `padding`.

Il bordo vuole tre valori: lo spessore, lo stile della linea (`solid` continua, `dashed` tratteggiata, `dotted` a puntini) e il colore. Anche lui ha le proprietà per un lato solo, come `border-bottom: 2px solid navy`, che traccia una riga sotto l'elemento.

```ad-warning
Il bordo senza stile non si vede
`border: 4px darkorange` non disegna niente. Finché non lo scrivi tu, lo stile della linea è "nessuna", e un bordo senza linea ha spessore zero. Le tre parole servono tutte: `border: 4px solid darkorange`.
```

## Quanto spazio occupa una scatola

Nel foglio qui sopra c'è scritto `width: 200px`, eppure sulla pagina il riquadro arancione è più largo di 200 px. Prima di muovere i cursori della figura, che parte dagli stessi numeri, prova a dire quanto. Poi porta `padding` e `border` a zero e guarda il numero al centro dei tre.

```interattivo
% nome: inf-css-scatola-strati
% alt: Una scatola CSS disegnata in scala con le sue quattro parti una dentro l'altra: il contenuto largo 200 pixel, il padding colorato, il bordo arancione e il margine tratteggiato. Quattro cursori cambiano width, padding, border e margin; sotto si leggono la larghezza del contenuto, la larghezza fino al bordo e lo spazio occupato con i margini, con la somma che li dà. Con width 200, padding 16, bordo 4 e margine 20 sono 200, 240 e 280 pixel
```

`width` è la larghezza del solo contenuto. Padding e bordo si aggiungono, una volta a sinistra e una volta a destra:

$$\begin{aligned}& \text{larghezza fino al bordo} \\ & \quad = \text{width} + 2 \cdot \text{padding} + 2 \cdot \text{border}\end{aligned}$$

Per il riquadro del concerto fanno $200 + 2 \cdot 16 + 2 \cdot 4 = 240$ pixel. Per sapere quanto posto occupa nella pagina si aggiungono i due margini: $240 + 2 \cdot 20 = 280$ pixel. In altezza il conto è lo stesso, con `height` al posto di `width`.

```ad-warning
Nel conto padding e bordo valgono doppio
L'errore più frequente è sommare una volta sola: $200 + 16 + 4 = 220$. Padding e bordo stanno su tutti e due i lati, quindi nella larghezza entrano due volte ciascuno.
```

Di solito `height` non si scrive: senza, la scatola è alta quanto serve al suo contenuto, e cresce quando il testo va a capo. Con un'altezza fissata il testo che non ci sta esce dal fondo della scatola e finisce sopra quello che c'è sotto.

## Far contare tutto nella larghezza: box-sizing

Sommare a mano è scomodo quando un riquadro deve stare in uno spazio preciso. Nella figura due riquadri hanno la stessa regola, `width: 200px` con lo stesso padding e lo stesso bordo, e cambia solo la proprietà `box-sizing`. Quale dei due è largo davvero 200 px? Muovi i due cursori e guarda quale riquadro si allarga e quale no.

```interattivo
% nome: inf-css-box-sizing-confronto
% alt: Due riquadri CSS uno sotto l'altro, tutti e due con width di 200 pixel, lo stesso padding e lo stesso bordo, regolati da due cursori. Il primo, con box-sizing content-box, supera la linea dei 200 pixel: con padding 20 e bordo 4 è largo 248 pixel. Il secondo, con box-sizing border-box, resta largo 200 pixel e il suo contenuto si restringe a 152 pixel
```

Con `box-sizing: content-box`, che è il valore di partenza di ogni elemento, `width` misura il contenuto e il resto si aggiunge: è il conto della sezione precedente. Con `box-sizing: border-box` la stessa `width` misura la scatola fino al bordo: padding e bordo ci stanno dentro, ed è il contenuto a restringersi.

$$\begin{aligned}& \text{larghezza del contenuto} \\ & \quad = \text{width} - 2 \cdot \text{padding} - 2 \cdot \text{border}\end{aligned}$$

Con padding di 20 px e bordo di 4 px, al contenuto restano $200 - 40 - 8 = 152$ pixel. Il margine resta fuori in tutti e due i casi.

Qui sotto la fascia grigia è `main`, larga 240 px, e il riquadro al suo interno ha anche lui `width: 240px`: dovrebbe riempirla giusta, e invece sporge. Aggiungi `box-sizing: border-box;` alla regola di `.concerto` ed esegui.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Concerti</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <div class="concerto">12 dicembre, palestra della scuola</div>
    </main>
</body>
</html>
```

```codice css
main {
    width: 240px;
    padding-top: 12px;
    padding-bottom: 12px;
    background-color: lightgray;
}

.concerto {
    width: 240px;
    padding: 16px;
    border: 4px solid darkorange;
    background-color: ivory;
}
```

## Elementi di blocco e in linea

Non tutte le scatole si dispongono allo stesso modo. Un elemento **di blocco** comincia su una riga nuova e, se non gli dai una larghezza, occupa tutta quella disponibile: titoli, paragrafi, elenchi e le loro voci, `div`, `header`, `nav`, `main`, `footer`. Un elemento **in linea** sta dentro la riga di testo, largo quanto il suo contenuto, e va a capo insieme alle parole: `a`, `em`, `strong`, e `span`, che è l'elemento in linea senza significato, come `div` lo è tra i blocchi.

Su un elemento in linea il modello a scatola funziona a metà: `width` e `height` non hanno effetto (le immagini fanno eccezione), i margini sopra e sotto nemmeno, e il padding in verticale viene disegnato ma non allontana le righe vicine.

Nella pagina qui sotto i tre link del menu hanno una larghezza di 120 px che il browser ignora. Aggiungi alla regola `display: block;` ed esegui: ogni link diventa un blocco, largo quanto hai chiesto, su una riga sua. La proprietà `display` decide infatti come si comporta la scatola, qualunque sia l'elemento. Poi prova `display: inline-block;`, che tiene i link sulla stessa riga ma lascia funzionare larghezza e margini.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="#concerti">Concerti</a>
        <a href="#gruppo">Il gruppo</a>
    </nav>
    <p id="concerti">Il prossimo concerto è <strong>venerdì 12 dicembre</strong>.</p>
    <p id="gruppo">Siamo quattro della 3B.</p>
</body>
</html>
```

```codice css
nav a {
    width: 120px;
    padding: 8px;
    margin: 4px;
    background-color: gold;
}
```

Come si mettono i blocchi uno accanto all'altro, per esempio un menu di fianco al testo, è l'argomento della lezione sull'[impaginazione](/materiale/scuola-superiore/informatica/i-fogli-di-stile/l-impaginazione-di-una-pagina-web).

```ad-tip
Centrare un blocco
Un blocco con una larghezza si mette al centro dello spazio che lo contiene dando `auto` ai margini di sinistra e di destra: `margin: 0 auto`. Il browser divide in parti uguali lo spazio che avanza. Provalo sul riquadro della prima pagina.
```

```ad-note
I margini verticali si fondono
Tra due blocchi uno sotto l'altro il margine inferiore del primo e quello superiore del secondo non si sommano: il browser tiene solo il più grande dei due. Se un titolo ha `margin-bottom: 30px` e il paragrafo sotto ha `margin-top: 20px`, tra i due ci sono 30 px, non 50. Succede solo ai margini, e solo in verticale: quelli di sinistra e di destra si sommano sempre, e padding e bordi non si fondono mai.
```

## Prova tu

Nel primo esercizio il riquadro del concerto ha solo lo sfondo. Dagli 12 px di padding su tutti i lati, un bordo continuo spesso 2 px di colore `teal` e un margine inferiore di 24 px.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Concerti</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="concerto">12 dicembre, palestra</div>
    <p>Ingresso libero.</p>
</body>
</html>
%% controllo Il padding è di 12 px su tutti i lati
.concerto | stile padding-top = 12px
.concerto | stile padding-right = 12px
.concerto | stile padding-bottom = 12px
.concerto | stile padding-left = 12px
%% controllo Il bordo è continuo, spesso 2 px e di colore teal, su tutti i lati
.concerto | stile border-top-style = solid
.concerto | stile border-left-style = solid
.concerto | stile border-top-width = 2px
.concerto | stile border-left-width = 2px
.concerto | stile border-top-color = teal
.concerto | stile border-left-color = teal
%% controllo Il margine inferiore è di 24 px
.concerto | stile margin-bottom = 24px
```

```codice css
.concerto {
    background-color: ivory;
}
%% soluzione
.concerto {
    background-color: ivory;
    padding: 12px;
    border: 2px solid teal;
    margin-bottom: 24px;
}
```

Nel secondo fai il conto all'indietro. Il riquadro deve essere largo in tutto 300 px, dal bordo sinistro al bordo destro, con 20 px di padding e un bordo di 5 px. Non usare `box-sizing`: calcola tu il valore di `width` e correggilo.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Concerti</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="concerto">12 dicembre, palestra</div>
</body>
</html>
%% controllo Il padding è ancora di 20 px
.concerto | stile padding-left = 20px
.concerto | stile padding-right = 20px
%% controllo La larghezza si conta ancora sul contenuto
.concerto | stile box-sizing = content-box
%% controllo Con padding e bordo il riquadro è largo 300 px
.concerto | stile width = 250px
```

```codice css
.concerto {
    width: 300px;
    padding: 20px;
    border: 5px solid teal;
}
%% soluzione
.concerto {
    width: 250px;
    padding: 20px;
    border: 5px solid teal;
}
```

Nel terzo i link del menu devono diventare tre bottoni uno sotto l'altro, ciascuno largo 120 px in tutto, padding compreso. Alla regola mancano due dichiarazioni: aggiungile senza cambiare quelle che ci sono.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="#concerti">Concerti</a>
        <a href="#gruppo">Il gruppo</a>
    </nav>
    <p id="concerti">Prossimo concerto: 12 dicembre.</p>
    <p id="gruppo">Siamo quattro della 3B.</p>
</body>
</html>
%% controllo Ogni link del menu è un blocco
nav a | stile display = block
%% controllo La larghezza di 120 px comprende il padding
nav a | stile box-sizing = border-box
nav a | stile width = 120px
nav a | stile padding-left = 8px
```

```codice css
nav a {
    width: 120px;
    padding: 8px;
    background-color: gold;
}
%% soluzione
nav a {
    display: block;
    box-sizing: border-box;
    width: 120px;
    padding: 8px;
    background-color: gold;
}
```
