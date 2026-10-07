# Formulario: I linguaggi di markup

## Marcare un testo

- Linguaggio di markup: un insieme di marcatori, scritti in mezzo al testo per dire che cos'è ogni sua parte, e di regole su come scriverli.
- Struttura: che cos'è un pezzo di testo (un titolo, un paragrafo, una voce di un elenco). Aspetto: come viene mostrato (grande, in grassetto, centrato).
- L'HTML marca la struttura; l'aspetto si decide nel foglio di stile.
- Il marcatore si sceglie per quello che il testo è, non per l'aspetto che dà.

## Tag, elementi, attributi

`<a href="concerti.html">I concerti</a>`

| Parte | Nell'esempio |
|---|---|
| tag di apertura | `<a href="concerti.html">` |
| contenuto | `I concerti` |
| tag di chiusura | `</a>` |
| elemento | le tre cose insieme |
| attributo | `href="concerti.html"`: nome `href`, valore `concerti.html` |

- Il tag di chiusura ha lo stesso nome di quello di apertura, preceduto dalla barra.
- Gli attributi stanno solo nel tag di apertura, nella forma `nome="valore"`.
- Qualche elemento non ha contenuto né tag di chiusura, come `<br>`.

## Annidamento

- Un elemento può contenere altri elementi: quello che contiene è il genitore, quello contenuto è il figlio. Il testo marcato è un albero.
- Un elemento aperto dentro un altro si chiude prima di quello che lo contiene: i tag si chiudono nell'ordine inverso a quello in cui sono aperti.

| | |
|---|---|
| giusto | `<p>Suoniamo <em>rock</em> dal 2024.</p>` |
| sbagliato | `<p>Suoniamo <em>rock dal 2024.</p></em>` |

- Spazi a inizio riga e a capo nel file non contano: nella pagina si va a capo dove lo dicono gli elementi.

## Elementi della prima pagina

| Elemento | Che cosa marca |
|---|---|
| `h1` | il titolo |
| `p` | un paragrafo |
| `em` | un testo messo in evidenza |
| `strong` | un testo importante |
| `ul` | un elenco |
| `li` | una voce dell'elenco, dentro `ul` |

## Markup e programmazione

Un linguaggio di markup descrive che cosa c'è; un linguaggio di programmazione dice che cosa fare. L'HTML non ha variabili, calcoli, condizioni né cicli: il browser lo legge e lo disegna, non lo esegue.

## Altri linguaggi di markup

- XML: stessa scrittura a tag, ma i nomi dei tag li sceglie chi lo usa; un tag non chiuso fa rifiutare tutto il file.
- Markdown: marcatori corti, che un programma converte in HTML.

| Markdown | HTML |
|---|---|
| `# Titolo` | `<h1>Titolo</h1>` |
| `*parola*` | `<em>parola</em>` |
| `**parola**` | `<strong>parola</strong>` |
| `- voce` | `<li>voce</li>`, dentro `<ul>` |

```ad-warning
Un tag non chiuso si prende tutto quello che segue
Il browser non avvisa: quando metà della pagina ha l'aspetto sbagliato, cerca un tag di chiusura mancante o senza barra.
```

```ad-warning
I tag non si accavallano
Chi è stato aperto per ultimo si chiude per primo, come le parentesi.
```

```ad-warning
Il marcatore non si sceglie per l'aspetto
Un testo che non è un titolo non si marca come titolo per farlo grande.
```
