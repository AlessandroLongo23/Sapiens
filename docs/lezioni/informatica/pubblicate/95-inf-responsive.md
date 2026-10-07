# Pagine responsive e accessibili

La home dei Fuori Tempo, con il testo e il riquadro del concerto [affiancati](/materiale/scuola-superiore/informatica/i-fogli-di-stile/l-impaginazione-di-una-pagina-web), su un computer si legge bene. Su un telefono le due colonne si dividono uno schermo largo un terzo, e il testo diventa una striscia di tre parole per riga. La stessa pagina viene aperta su schermi molto diversi, e da persone diverse: chi ingrandisce i caratteri, chi non usa il mouse, chi la pagina non la vede e se la fa leggere. Una pagina è **responsive** quando cambia impaginazione secondo la larghezza che ha a disposizione, ed è **accessibile** quando la possono usare tutti.

## La finestra e le unità relative

La parte della finestra del browser in cui viene disegnata la pagina si chiama **viewport**. Su un computer è larga quanto la finestra; su un telefono, se la pagina non dice niente, il browser finge che sia larga come quella di un computer e poi rimpicciolisce tutto per farlo stare nello schermo. Per avere la larghezza vera serve una riga dentro `head`, uguale in ogni pagina:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

```ad-warning
Senza la riga del viewport il resto non funziona
Se la dimentichi, sul telefono la pagina compare minuscola e le regole di questa lezione non si attivano, perché per il browser la finestra è larga come quella di un computer. Sul computer non te ne accorgi: va provata su un telefono.
```

Una larghezza in pixel è la stessa su ogni schermo: un riquadro di `800px` su un telefono esce dai bordi. Le **unità relative** invece dipendono da qualcos'altro, e cambiano con lui.

| Unità | Relativa a | Esempio |
|---|---|---|
| `%` | la larghezza dell'elemento che contiene | `width: 50%` è metà del contenitore |
| `rem` | la grandezza del carattere della pagina, di solito $16\,\text{px}$ | `2rem` sono $2 \cdot 16 = 32\,\text{px}$ |
| `em` | la grandezza del carattere dell'elemento stesso | con il testo a $20\,\text{px}$, `padding: 0.5em` sono $10\,\text{px}$ |
| `vw` | la larghezza del viewport: `1vw` è un centesimo | con il viewport a $400\,\text{px}$, `50vw` sono $200\,\text{px}$ |

Per il testo si usa `rem`: chi ha scelto nel browser caratteri più grandi ingrandisce così tutta la pagina, mentre un testo in `px` resta com'è. Per le larghezze si usano `%` e `max-width`, che mette un tetto: con `max-width: 30rem` un blocco si allarga con la finestra fino a $30 \cdot 16 = 480\,\text{px}$ e poi si ferma.

Le immagini hanno una larghezza loro, quella del file, e su uno schermo più stretto escono dalla pagina. Due dichiarazioni lo impediscono: `max-width: 100%` non lascia che l'immagine superi il suo contenitore, e `height: auto` fa calcolare l'altezza al browser in modo che le proporzioni restino quelle.

```ad-example
Esempio: quanto diventa grande l'immagine
Una fotografia di $800 \times 400$ pixel ha `max-width: 100%` e `height: auto`, e sta in una colonna larga $360\,\text{px}$. Che dimensioni ha sulla pagina?

La larghezza si ferma a quella della colonna, $360\,\text{px}$. L'altezza segue la proporzione, che è di 2 a 1: $360 : 2 = 180\,\text{px}$. In una colonna larga $1000\,\text{px}$ la stessa fotografia resta di $800 \times 400$, perché `max-width` è un tetto e non un ordine di allargarsi.
```

Nella pagina qui sotto queste regole ci sono tutte. Togli la regola di `img` ed esegui; poi cambia `30rem` in `15rem`, e `2rem` in `10vw`. La riga con `src` contiene il disegno stesso invece del nome di un file, perché l'editor non ha immagini: è larga 800 pixel.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>I Fuori Tempo</h1>
        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='200'><rect width='800' height='200' fill='teal'/><circle cx='700' cy='100' r='60' fill='gold'/></svg>" alt="Il manifesto del concerto">
        <p>Siamo quattro della 3B e suoniamo insieme dalla prima.</p>
    </main>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
}

main {
    max-width: 30rem;
    margin: 0 auto;
}

h1 {
    font-size: 2rem;
}

img {
    max-width: 100%;
    height: auto;
}
```

## Le media query

Le unità relative stringono e allargano i pezzi, ma non cambiano la loro disposizione: due colonne restano due colonne. Per cambiare impaginazione serve una **media query**, cioè una condizione sulla finestra scritta nel foglio di stile. Le regole tra le sue parentesi graffe valgono solo quando la condizione è vera.

```css
@media (min-width: 600px) {
    .contenuto {
        flex-direction: row;
    }
}
```

`min-width: 600px` si legge "quando il viewport è largo almeno $600\,\text{px}$"; `max-width: 600px` vuol dire "al più $600\,\text{px}$". Nella figura la pagina del gruppo è disegnata con i suoi blocchi dentro una finestra di cui scegli la larghezza, e sotto c'è il suo foglio di stile. Allarga la finestra piano e rispondi: a quale larghezza `main` e `aside` si affiancano, e che cosa succede esattamente a $600\,\text{px}$?

```interattivo
% nome: inf-media-query-larghezza
% alt: La pagina dei Fuori Tempo disegnata a blocchi (header, nav, main, aside, tre article, footer) dentro una finestra di cui un cursore cambia la larghezza da 320 a 1000 pixel. Due linee tratteggiate segnano 600 e 900 pixel. Sotto, il foglio di stile ha una regola di base e due media query, ciascuna con la scritta attiva o non attiva: sotto i 600 pixel tutti i blocchi sono in colonna, da 600 main e aside si affiancano, da 900 anche i tre article si mettono in riga
```

Fino a $590\,\text{px}$ vale solo la regola di base e tutto è in colonna. A $600\,\text{px}$ la prima media query è già attiva, perché "almeno 600" comprende 600, e la sua regola batte quella di base: `main` e `aside` si affiancano. I tre concerti aspettano i $900\,\text{px}$ della seconda. Una media query non sostituisce il foglio di stile: aggiunge regole, che entrano nella [cascata](/materiale/scuola-superiore/informatica/i-fogli-di-stile/regole-e-selettori-css) insieme alle altre.

## Prima il telefono

Il foglio della figura è scritto nell'ordine che conviene: prima le regole per lo schermo più stretto, fuori da ogni media query, poi con `min-width` quello che cambia quando c'è più spazio. Si chiama "prima il telefono" (in inglese mobile first). La pagina in colonna funziona su qualunque schermo, quindi è una buona base; le colonne affiancate sono un'aggiunta per chi ha posto.

La pagina qui sotto è fatta così. L'anteprima è larga quanto la colonna della lezione: su un computer supera i $600\,\text{px}$ e vedi le due colonne, su un telefono no e ne vedi una. Al computer, sopra il codice, ci sono tre tasti che cambiano la larghezza dell'anteprima: il primo la porta ai $375\,\text{px}$ di un telefono, il secondo ai $768\,\text{px}$ di un tablet, il terzo le ridà tutto lo spazio. Premi il primo e guarda `main` e `aside` tornare uno sotto l'altro. Su un telefono i tasti non ci sono, perché lo schermo è già stretto: per vedere le due colonne abbassa la soglia nel foglio di stile, scrivendo `300px` al posto di `600px`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <div class="contenuto">
        <main>Siamo quattro della 3B e suoniamo insieme dalla prima.</main>
        <aside>Prossimo concerto: venerdì 12 dicembre.</aside>
    </div>
</body>
</html>
```

```codice css
body {
    font-family: sans-serif;
}

.contenuto {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

aside {
    padding: 1rem;
    background-color: ivory;
}

@media (min-width: 600px) {
    .contenuto {
        flex-direction: row;
    }

    main {
        flex: 1;
    }
}
```

```ad-warning
La regola di base scritta dopo la media query
A parità di selettore vince la regola scritta più in basso, anche se quella sopra sta dentro una media query attiva. Se sposti la regola di `.contenuto` con `flex-direction: column` in fondo al foglio, la pagina resta in colonna a qualunque larghezza. Le media query vanno dopo le regole di base che devono correggere.
```

```ad-warning
min-width e max-width scambiati
`@media (max-width: 600px)` vale sugli schermi stretti, fino a 600 pixel; `@media (min-width: 600px)` su quelli larghi, da 600 in su. Se le colonne compaiono sul telefono e spariscono sul computer, hai scritto l'una al posto dell'altra.
```

## Una pagina che tutti possono usare

Chi non vede la pagina la ascolta con un lettore di schermo, un programma che legge ad alta voce il testo e dice che cos'è ogni elemento. Chi non può usare il mouse si sposta con la tastiera. Chi vede poco ha bisogno di caratteri grandi e di colori che si distinguono. Molto di quello che serve a queste persone l'hai già scritto, se hai usato l'HTML per quello che è.

Il primo controllo riguarda i colori. Tra il colore del testo e quello dello sfondo si calcola un **rapporto di contrasto**, che va da $1 : 1$ (due colori uguali) a $21 : 1$ (nero su bianco). Le linee guida internazionali per l'accessibilità chiedono almeno $4{,}5 : 1$ per il testo normale e almeno $3 : 1$ per il testo grande, cioè da $24\,\text{px}$ in su, oppure da circa $19\,\text{px}$ in su se è in grassetto. Nella figura scegli i due colori e leggi il rapporto. Prima di provare: il grigio chiaro `#999999` su bianco, che in tanti siti si usa per le date, è sufficiente? E il bianco sull'arancione?

```interattivo
% nome: inf-contrasto-colori
% alt: Un riquadro con il titolo I Fuori Tempo e una riga di testo, scritti nel colore del testo sopra il colore dello sfondo. Sotto, il rapporto di contrasto calcolato tra i due colori, una barra da 1 a 21 con le soglie 3 e 4,5, e due esiti: testo normale e testo grande, ciascuno con scritto se il rapporto basta. In basso i due campi per scegliere il colore del testo e dello sfondo, un bottone che li scambia e quattro coppie già pronte
```

Nessuna delle due coppie passa: il grigio chiaro su bianco arriva a $2{,}84 : 1$ e il bianco sull'arancione a $2{,}45 : 1$, meno di quanto serve anche a un titolo. Il grigio scuro `#595959` arriva a $7 : 1$. Non conta quanto è vivace un colore, conta la differenza di luminosità tra i due: il nero sul giallo supera $12 : 1$.

Gli altri controlli si fanno rileggendo l'HTML.

- Ogni immagine che dice qualcosa ha il suo [testo alternativo](/materiale/scuola-superiore/informatica/il-linguaggio-html/testo-link-e-immagini) in `alt`: è quello che il lettore di schermo legge al posto dell'immagine.
- I titoli seguono l'ordine: un solo `h1`, sotto di lui gli `h2`, sotto un `h2` gli `h3`, senza saltare livelli. Chi ascolta la pagina salta da un titolo all'altro come tu scorri con gli occhi. Un titolo si sceglie per il suo livello, e la grandezza si cambia nel CSS.
- Tutto quello che si fa con il mouse si deve poter fare con la tastiera. Il tasto Tab passa da un link, un bottone o un campo al successivo, nell'ordine dell'HTML, e un contorno mostra dove sei. Funziona da solo con `a`, `button` e i campi dei moduli; non funziona con un `div` su cui hai messo un clic. Il contorno non si toglie con `outline: none`.
- Ogni campo di un [modulo](/materiale/scuola-superiore/informatica/il-linguaggio-html/i-moduli) ha la sua etichetta `label`, collegata con `for` all'`id` del campo: senza, chi ascolta sente "campo di testo" e non sa che cosa scriverci.

```ad-warning
Il titolo scelto per la grandezza
Usare `h4` perché "`h2` è troppo grosso" lascia un buco nella struttura: chi salta da un titolo all'altro crede che manchi un pezzo di pagina. Lo stesso vale al contrario, per un testo in grassetto e grande che fa da titolo senza essere un elemento `h2`: si vede come un titolo, ma per il lettore di schermo è un paragrafo.
```

## Prova tu

Nel primo esercizio la pagina è fatta di misure fisse, e su un telefono esce dallo schermo. Cambia tre cose nel foglio di stile: `main` deve avere una larghezza massima di `30rem` al posto della larghezza fissa, il titolo deve essere grande `2rem`, e l'immagine non deve mai superare il suo contenitore.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Concerto</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>Concerto di Natale</h1>
        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='200'><rect width='800' height='200' fill='crimson'/></svg>" alt="Il manifesto del concerto">
    </main>
</body>
</html>
%% controllo main ha una larghezza massima di 30rem
main | stile max-width = 30rem
%% controllo Il titolo è grande 2rem
h1 | stile font-size = 2rem
%% controllo L'immagine non supera il suo contenitore
img | stile max-width = 100%
```

```codice css
main {
    width: 700px;
}

h1 {
    font-size: 48px;
}

img {
    width: 800px;
}
%% soluzione
main {
    max-width: 30rem;
}

h1 {
    font-size: 2rem;
}

img {
    max-width: 100%;
    height: auto;
}
```

Nel secondo prepari la pagina dei concerti partendo dal telefono. Aggiungi in `head` la riga del viewport. Nel foglio di stile fai di `.concerti` un contenitore flex in colonna, con `1rem` di spazio tra le schede; poi aggiungi una media query che da $700\,\text{px}$ in su le mette in riga. La correzione prova la pagina a due larghezze: a $400\,\text{px}$ le schede devono stare in colonna, a $900\,\text{px}$ in riga.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Concerti</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="concerti">
        <article>12 dicembre, palestra</article>
        <article>20 gennaio, aula magna</article>
        <article>7 marzo, cortile</article>
    </div>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Concerti</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="concerti">
        <article>12 dicembre, palestra</article>
        <article>20 gennaio, aula magna</article>
        <article>7 marzo, cortile</article>
    </div>
</body>
</html>
%% controllo La pagina ha la riga del viewport
meta[name="viewport"] | attributo content = width=device-width, initial-scale=1
%% controllo Tra le schede c'è 1rem di spazio
.concerti | stile display = flex
.concerti | stile gap = 1rem
%% controllo A 400 pixel di larghezza le schede sono in colonna
> larghezza 400
.concerti | stile display = flex
.concerti | stile flex-direction = column
%% controllo A 900 pixel di larghezza le schede sono in riga
> larghezza 900
.concerti | stile display = flex
.concerti | stile flex-direction = row
```

```codice css
article {
    padding: 1rem;
    background-color: ivory;
}

/* scrivi qui */
%% soluzione
article {
    padding: 1rem;
    background-color: ivory;
}

.concerti {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 700px) {
    .concerti {
        flex-direction: row;
    }
}
```

Nel terzo la pagina si vede bene, ma ha quattro ostacoli per chi la usa in un altro modo. Toglili: dai all'immagine il testo alternativo `Il gruppo sul palco`; fai diventare `h2` il titolo che salta un livello; collega l'etichetta al campo, che deve avere `id="email"`; nel foglio di stile porta il colore del paragrafo a `#595959`.

```codice html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='80'><rect width='200' height='80' fill='navy'/></svg>">
    <h4>Resta aggiornato</h4>
    <p>Ti scriviamo solo prima di un concerto.</p>
    <form>
        <label>La tua email</label>
        <input type="email" name="email">
        <button>Iscriviti</button>
    </form>
</body>
</html>
%% soluzione
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>I Fuori Tempo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>I Fuori Tempo</h1>
    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='80'><rect width='200' height='80' fill='navy'/></svg>" alt="Il gruppo sul palco">
    <h2>Resta aggiornato</h2>
    <p>Ti scriviamo solo prima di un concerto.</p>
    <form>
        <label for="email">La tua email</label>
        <input type="email" name="email" id="email">
        <button>Iscriviti</button>
    </form>
</body>
</html>
%% controllo L'immagine ha il testo alternativo
img | attributo alt = Il gruppo sul palco
%% controllo Dopo h1 viene un h2, e non c'è più h4
h2 | testo = Resta aggiornato
h4 | non esiste
%% controllo L'etichetta è collegata al campo
label | attributo for = email
input#email
%% controllo Il paragrafo ha un colore con abbastanza contrasto
p | stile color = #595959
```

```codice css
body {
    font-family: sans-serif;
}

p {
    color: #aaaaaa;
}
%% soluzione
body {
    font-family: sans-serif;
}

p {
    color: #595959;
}
```
