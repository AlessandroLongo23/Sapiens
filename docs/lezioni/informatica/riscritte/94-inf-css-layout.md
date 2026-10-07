# L'impaginazione di una pagina web

La home dei Fuori Tempo ha un titolo, un menu, un testo che presenta il gruppo, un riquadro con il prossimo concerto e una riga di contatti in fondo. Il browser mette questi pezzi uno sotto l'altro, nell'ordine in cui sono scritti, perché sono [elementi di blocco](/materiale/scuola-superiore/informatica/i-fogli-di-stile/il-modello-a-scatola) e ognuno occupa tutta la larghezza. Nei siti che conosci invece il menu sta su una riga accanto al titolo, e il riquadro sta di fianco al testo. Decidere dove va ogni pezzo della pagina si chiama **impaginazione** (in inglese layout), e lo strumento del CSS che la rende semplice si chiama flexbox.

## Contenitore ed elementi

Flexbox lavora sempre su una coppia: un elemento e i suoi figli. Quando dai a un elemento la dichiarazione `display: flex`, quello diventa un **contenitore flex**, e i suoi figli diretti diventano **elementi flex**: smettono di andare a capo uno dopo l'altro e si dispongono in riga, da sinistra a destra, ognuno largo quanto il suo contenuto.

Nella pagina qui sotto l'[elenco](/materiale/scuola-superiore/informatica/il-linguaggio-html/elenchi-e-tabelle) dei quattro componenti del gruppo ha classe `gruppo`, e la sua regola contiene `display: flex`. Cancella quella riga dal foglio di stile ed esegui: le quattro voci tornano in colonna. Rimettila, e poi spostala nella regola di `body`.

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
    <ul class="gruppo">
        <li>Sara</li>
        <li>Leo</li>
        <li>Marta</li>
        <li>Dario</li>
    </ul>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
}

.gruppo {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 8px;
}

.gruppo li {
    padding: 8px;
    border: 2px solid teal;
}
```

Con `display: flex` nella regola di `body` si affiancano il titolo e l'elenco, che sono i due figli di `body`, mentre le quattro voci tornano una sotto l'altra: sono figlie di `ul`, e `ul` non è più un contenitore flex.

```ad-warning
Flexbox arriva solo ai figli diretti
`display: flex` va scritto nella regola dell'elemento che contiene i pezzi da disporre, non nella regola dei pezzi e nemmeno in quella di un antenato più lontano. Se il menu è un elenco dentro `nav`, il contenitore delle voci è `ul`: con `nav { display: flex; }` le voci `li` restano in colonna, perché l'unico figlio di `nav` è l'elenco.
```

## Direzione, distribuzione e allineamento

Un contenitore flex ha una direzione, scelta con `flex-direction`: `row` (in riga, il valore di partenza) oppure `column` (in colonna). La direzione fissa l'**asse principale**, cioè la linea lungo cui gli elementi si mettono in fila; l'altra direzione è l'asse trasversale. Tutte le altre proprietà del contenitore si riferiscono a questi due assi, e non a "orizzontale" e "verticale".

| Proprietà | Che cosa decide | Valori |
|---|---|---|
| `flex-direction` | la direzione della fila | `row`, `column` |
| `justify-content` | come si distribuiscono gli elementi lungo l'asse principale | `flex-start`, `center`, `flex-end`, `space-between`, `space-around` |
| `align-items` | come si allineano sull'asse trasversale | `stretch`, `flex-start`, `center`, `flex-end` |
| `gap` | lo spazio tra un elemento e il successivo | una lunghezza, come `16px` |
| `flex-wrap` | se gli elementi che non ci stanno vanno a capo | `nowrap`, `wrap` |

Nella figura un contenitore ha quattro elementi di grandezza diversa, e accanto c'è la regola che stai componendo. Prova i cinque valori di `justify-content` e i quattro di `align-items`. Poi rispondi prima di provare: con `flex-direction: column`, il valore `justify-content: center` sposta gli elementi verso il centro in orizzontale o in verticale?

```interattivo
% nome: inf-css-flexbox
% alt: Un contenitore flex tratteggiato con quattro elementi numerati di grandezza diversa. Sotto ci sono le scelte per flex-direction, justify-content, align-items, flex-wrap, il gap e il numero di elementi: a ogni scelta gli elementi scivolano nella nuova posizione. Due frecce sui bordi del contenitore dicono lungo quale lato lavora justify-content e lungo quale align-items, e si scambiano quando la direzione passa da riga a colonna. Accanto è scritta la regola CSS composta, con la riga appena cambiata in evidenza
```

In verticale. `justify-content` segue sempre l'asse principale: in riga sposta gli elementi a sinistra e a destra, in colonna li sposta in alto e in basso, e `align-items` fa il contrario. Con `space-between` il primo e l'ultimo elemento toccano i bordi e lo spazio che avanza finisce tutto tra gli elementi; con `space-around` ogni elemento ha lo stesso spazio ai due lati, quindi ai bordi ne resta la metà di quello che c'è tra due elementi. Il valore `stretch`, quello di partenza di `align-items`, allunga gli elementi fino a riempire il contenitore: è il motivo per cui due colonne affiancate vengono alte uguali senza fare niente.

```ad-warning
In colonna le due proprietà sembrano scambiate
Per centrare in orizzontale gli elementi di una riga si usa `justify-content: center`. Se il contenitore è in colonna, la stessa dichiarazione li centra in verticale, e per centrarli in orizzontale serve `align-items: center`. Prima di scegliere la proprietà chiediti qual è l'asse principale.
```

## Lo spazio che avanza e l'andare a capo

Quanto spazio c'è da distribuire lo decide un conto. Un contenitore largo $600\,\text{px}$ ha tre elementi larghi $100\,\text{px}$ e un `gap` di $20\,\text{px}$: gli elementi occupano $3 \cdot 100 = 300\,\text{px}$, i due spazi tra loro $2 \cdot 20 = 40\,\text{px}$, e avanzano $600 - 300 - 40 = 260\,\text{px}$. È questo avanzo che `justify-content` sposta a destra, a sinistra o in mezzo.

L'avanzo si può anche dare a un elemento. La dichiarazione `flex: 1`, scritta nella regola di un elemento flex e non del contenitore, gli dice di allargarsi fino a prendere tutto lo spazio che resta sull'asse principale: nell'esempio, il terzo elemento con `flex: 1` diventa largo $600 - 200 - 40 = 360\,\text{px}$. Se `flex: 1` ce l'hanno tutti gli elementi, lo spazio si divide in parti uguali.

Quando invece lo spazio manca, il contenitore si comporta in due modi. Con `flex-wrap: nowrap`, il valore di partenza, gli elementi restano su una sola riga e si stringono; con `flex-wrap: wrap` quelli che non ci stanno vanno a capo e formano una seconda riga. Torna alla figura, porta gli elementi a cinque e passa da `nowrap` a `wrap`.

```ad-example
Esempio: quanti elementi per riga
Un contenitore largo $500\,\text{px}$ ha `flex-wrap: wrap` e `gap: 20px`, e contiene cinque schede larghe $150\,\text{px}$. Quante schede stanno sulla prima riga?

Tre schede con i due spazi tra loro occupano $3 \cdot 150 + 2 \cdot 20 = 490\,\text{px}$, e ci stanno. Quattro ne chiederebbero $4 \cdot 150 + 3 \cdot 20 = 660$, più di $500$. Sulla prima riga stanno tre schede, e le altre due vanno a capo.
```

## La pagina classica

Moltissime pagine hanno la stessa impaginazione: in alto un'intestazione con il titolo e il menu, sotto il contenuto con una colonna laterale, in fondo il piè di pagina. Con gli [elementi semantici](/materiale/scuola-superiore/informatica/il-linguaggio-html/struttura-di-una-pagina-html) che conosci, più `aside` per la colonna laterale, si costruisce con due contenitori flex, uno dentro la pagina e uno nell'intestazione.

```tikz
% nome: pagina-classica-flexbox
% alt: Lo schema di una pagina web a blocchi. In alto il blocco header contiene a sinistra h1 e a destra nav, e accanto è scritto display flex con space-between. Sotto, il blocco con classe contenuto contiene a sinistra main, più largo, con la scritta flex 1, e a destra aside, più stretto; accanto è scritto display flex. In fondo il blocco footer occupa tutta la larghezza
\begin{tikzpicture}
\tikzset{
  blocco/.style={draw, thick, rounded corners=2pt},
  nome/.style={font=\small\ttfamily},
  nota/.style={font=\footnotesize, align=left, anchor=west}}
\draw[blocco, fill=orange!25] (0,3.5) rectangle (6,4.5);
\draw[blocco, fill=yellow!20] (0.15,3.65) rectangle (2.0,4.35);
\node[nome] at (1.075,4.0) {h1};
\draw[blocco, fill=yellow!20] (3.4,3.65) rectangle (5.85,4.35);
\node[nome] at (4.625,4.0) {nav};
\draw[blocco, dashed] (0,1.1) rectangle (6,3.3);
\draw[blocco, fill=blue!10] (0.15,1.25) rectangle (4.0,3.15);
\node[nome] at (2.075,2.4) {main};
\node[font=\footnotesize\ttfamily] at (2.075,1.9) {flex: 1};
\draw[blocco, fill=green!15] (4.2,1.25) rectangle (5.85,3.15);
\node[nome] at (5.025,2.2) {aside};
\draw[blocco, fill=orange!25] (0,0) rectangle (6,0.9);
\node[nome] at (3,0.45) {footer};
\node[nota] at (6.2,4.0) {\texttt{header}: \texttt{display: flex},\\\texttt{space-between}};
\node[nota] at (6.2,2.2) {\texttt{.contenuto}:\\\texttt{display: flex}};
\end{tikzpicture}
```

Nella pagina qui sotto `header` tiene il titolo a sinistra e il menu a destra con `space-between`, e li centra in altezza con `align-items`. Il blocco `.contenuto` affianca `main` e `aside`: la colonna laterale ha una larghezza fissa, e `main` prende con `flex: 1` tutto quello che resta. Prova tre cambiamenti, uno alla volta: togli `flex: 1` e guarda quanto diventa largo `main`; scrivi `aside` prima di `main` nell'HTML; aggiungi `flex-direction: column` alla regola di `.contenuto`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>I Fuori Tempo</h1>
        <nav>
            <a href="#">Home</a>
            <a href="#">Concerti</a>
            <a href="#">Contatti</a>
        </nav>
    </header>
    <div class="contenuto">
        <main>
            <h2>Chi siamo</h2>
            <p>Siamo quattro della 3B e suoniamo insieme dalla prima.</p>
        </main>
        <aside>
            <h2>Prossimo concerto</h2>
            <p>Venerdì 12 dicembre, in palestra.</p>
        </aside>
    </div>
    <footer>Scrivici: fuoritempo@scuola.example</footer>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
    margin: 0;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background-color: gold;
}

nav {
    display: flex;
    gap: 12px;
}

.contenuto {
    display: flex;
    gap: 16px;
    padding: 16px;
}

main {
    flex: 1;
}

aside {
    width: 140px;
    padding: 0 12px;
    background-color: ivory;
}

footer {
    padding: 12px 16px;
    background-color: navy;
    color: white;
}
```

Senza `flex: 1` l'elemento `main` torna largo quanto il suo testo, e la colonna laterale gli si attacca. L'ordine degli elementi nella riga è quello dell'HTML, quindi con `aside` scritto per primo la colonna passa a sinistra. Con `flex-direction: column` i due blocchi tornano uno sotto l'altro: su uno schermo stretto è proprio quello che serve, e la [prossima lezione](/materiale/scuola-superiore/informatica/i-fogli-di-stile/pagine-responsive-e-accessibili) mostra come farlo fare alla pagina da sola.

```ad-warning
Le tabelle non servono a impaginare
Una tabella mette le cose in righe e colonne, e per anni è stata usata per affiancare i pezzi di una pagina. È un errore: `table` dice al browser, e a chi ascolta la pagina con un lettore di schermo, che lì ci sono dati da leggere per righe e per colonne. I pezzi di una pagina si affiancano con il CSS.
```

```ad-note
Che cosa c'è oltre flexbox
Flexbox dispone gli elementi lungo una fila. Per una disposizione a righe e colonne insieme, come una galleria di fotografie, il CSS ha la griglia, `display: grid`. La proprietà `position` invece toglie un elemento dalla fila e lo mette in un punto preciso, per esempio per tenere il menu fermo in alto mentre la pagina scorre.
```

## Prova tu

Nel primo esercizio il menu è un elenco, e le sue voci stanno in colonna con il pallino davanti. Nel foglio di stile completa la regola di `nav ul`: le voci devono stare in riga, senza pallino (lo toglie la dichiarazione `list-style: none`), con $20\,\text{px}$ di spazio tra l'una e l'altra.

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
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Concerti</a></li>
            <li><a href="#">Contatti</a></li>
        </ul>
    </nav>
</body>
</html>
%% controllo Le voci del menu sono in riga
nav ul | stile display = flex
%% controllo Le voci non hanno il pallino
nav ul | stile list-style-type = none
%% controllo Tra una voce e l'altra ci sono 20px
nav ul | stile gap = 20px
```

```codice css
nav ul {
    padding: 0;
    /* scrivi qui */
}
%% soluzione
nav ul {
    padding: 0;
    list-style: none;
    display: flex;
    gap: 20px;
}
```

Nel secondo l'intestazione ha il titolo e il menu uno sotto l'altro. Scrivi la regola di `header`: il titolo deve stare a sinistra e il menu a destra, sulla stessa riga, centrati in altezza.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>I Fuori Tempo</h1>
        <nav>
            <a href="#">Home</a>
            <a href="#">Concerti</a>
        </nav>
    </header>
</body>
</html>
%% controllo L'intestazione è un contenitore flex
header | stile display = flex
%% controllo Titolo e menu sono ai due estremi
header | stile justify-content = space-between
%% controllo Titolo e menu sono centrati in altezza
header | stile align-items = center
```

```codice css
header {
    padding: 0 16px;
    background-color: gold;
    /* scrivi qui */
}
%% soluzione
header {
    padding: 0 16px;
    background-color: gold;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

Nel terzo le regole ci sono, ma sono nel posto sbagliato, e il riquadro del concerto resta sotto il testo. Sistemale senza toccare l'HTML: `main` e `aside` devono stare affiancati con $24\,\text{px}$ di spazio, e `main` deve prendere tutta la larghezza che avanza.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="contenuto">
        <main>
            <h2>Chi siamo</h2>
            <p>Siamo quattro della 3B.</p>
        </main>
        <aside>Prossimo concerto: 12 dicembre.</aside>
    </div>
</body>
</html>
%% controllo Il blocco con classe contenuto è un contenitore flex
.contenuto | stile display = flex
%% controllo Tra main e aside ci sono 24px
.contenuto | stile gap = 24px
%% controllo main prende lo spazio che avanza
main | stile flex-grow = 1
```

```codice css
.contenuto {
    flex: 1;
}

main {
    display: flex;
    gap: 24px;
}

aside {
    width: 140px;
    background-color: ivory;
}
%% soluzione
.contenuto {
    display: flex;
    gap: 24px;
}

main {
    flex: 1;
}

aside {
    width: 140px;
    background-color: ivory;
}
```
