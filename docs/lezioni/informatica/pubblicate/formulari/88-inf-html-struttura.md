# Formulario: Struttura di una pagina HTML

## Lo scheletro

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <title>Titolo della scheda</title>
</head>
<body>
    <h1>Titolo della pagina</h1>
    <p>Un paragrafo.</p>
</body>
</html>
```

| Riga | Che cosa fa |
|---|---|
| `<!DOCTYPE html>` | il doctype: dichiara l'HTML di oggi; prima riga, non si chiude |
| `<html lang="it">` | contiene tutto; `lang` dice la lingua del testo |
| `<head>` | la testa: informazioni sulla pagina, che non vengono disegnate |
| `<meta charset="utf-8">` | la codifica dei caratteri del file; non ha tag di chiusura |
| `<title>` | il titolo del documento: scheda del browser, preferiti, motori di ricerca |
| `<body>` | il corpo: tutto quello che si vede nella finestra |

## Titoli e paragrafi

- `<p>`: un paragrafo. Spazi e a capo scritti nel file contano come uno spazio solo.
- Da `<h1>` a `<h6>`: i titoli, dal più generale al più interno.
- Un solo `<h1>` per pagina; scendendo non si salta un livello (`<h2>`, poi `<h3>`).
- Il livello dice la struttura, non la grandezza: l'aspetto si decide con i fogli di stile.

## Le parti della pagina

| Elemento | Che cosa contiene |
|---|---|
| `<header>` | l'intestazione: nome del sito, titolo |
| `<nav>` | il menu con i link |
| `<main>` | il contenuto della pagina, uno solo |
| `<section>` | una parte del contenuto, con il suo titolo |
| `<footer>` | il piè di pagina |
| `<div>` | un contenitore senza significato |

Gli elementi semantici non cambiano l'aspetto: dicono che cosa è ogni parte a lettori di schermo, motori di ricerca e fogli di stile.

## L'albero del documento

- Radice: `<html>`. I suoi figli: `<head>` e `<body>`.
- Figlio: un elemento scritto direttamente dentro un altro, che è il suo genitore. Fratelli: elementi con lo stesso genitore.
- Il browser legge il file dall'alto: un tag di apertura aggiunge un figlio all'ultimo elemento ancora aperto, un tag di chiusura fa tornare al genitore.
- Ogni elemento del corpo è un rettangolo nella pagina, che contiene i rettangoli dei figli.

## Commenti

```html
<!-- Il browser salta questo testo -->
```

## Che cosa fa il browser con un errore

| Nel file | Il browser |
|---|---|
| un tag di chiusura dimenticato | lascia l'elemento aperto: quello che segue ci finisce dentro |
| un tag che non esiste | lo tiene, senza aspetto e senza significato |
| un tag di chiusura di un elemento non aperto | lo salta |
| un testo da mostrare dentro `<head>` | lo sposta nel corpo |

Il browser non si ferma e non avvisa: gli errori si cercano con un validatore.

```ad-warning
Errori da non fare
`<title>` (scheda) non è `<h1>` (pagina), e `<head>` (testa, non si vede) non è `<header>` (intestazione, nel corpo). Un titolo si sceglie per il livello, non per la grandezza. Un commento si legge nel sorgente: non è un segreto.
```
