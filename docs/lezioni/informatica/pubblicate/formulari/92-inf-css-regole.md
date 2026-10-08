# Formulario: Regole e selettori CSS

## Collegare il foglio di stile

Dentro `head`, nella pagina HTML:

```
<link rel="stylesheet" href="style.css">
```

Senza questa riga il foglio non viene applicato, anche se esiste ed è corretto.

## La regola

```
selettore {
    proprietà: valore;
    proprietà: valore;
}
```

- Selettore: a quali elementi si applica la regola.
- Dichiarazione: una proprietà, i due punti, un valore, il punto e virgola.
- Una dichiarazione che il browser non capisce viene saltata, senza messaggi di errore.

## Colori e testo

| Proprietà | Che cosa cambia | Esempi di valore |
|---|---|---|
| `color` | il colore del testo | `crimson`, `#DC143C` |
| `background-color` | il colore dello sfondo | `ivory`, `#FFFFF0` |
| `font-family` | il carattere | `sans-serif`, `serif`, `monospace` |
| `font-size` | la grandezza del testo | `20px` |
| `font-weight` | lo spessore delle lettere | `normal`, `bold` |
| `text-align` | l'allineamento delle righe | `left`, `center`, `right` |

- Un colore: un nome (`navy`, `teal`, `gold`) oppure `#RRGGBB` in esadecimale.
- Una grandezza porta l'unità attaccata al numero: `20px`.

## I selettori

| Selettore | Si scrive | Nell'HTML | Prende |
|---|---|---|---|
| di elemento | `li` | `<li>` | tutti gli elementi `li` |
| di classe | `.prossimo` | `class="prossimo"` | gli elementi con quella classe |
| di id | `#date` | `id="date"` | l'elemento con quell'id, uno solo |
| discendente | `nav a` | un `a` dentro un `nav` | gli `a` contenuti in un `nav`, a qualunque profondità |
| elenco | `h1, h2` | | gli `h1` e gli `h2` |

## Ereditarietà

- Si ereditano le proprietà del testo: `color`, `font-family`, `font-size`, `font-weight`, `text-align`.
- Non si eredita `background-color`.
- Il carattere di tutta la pagina si sceglie nella regola di `body`.

## La cascata: quale regola vince

1. Vince il selettore con la specificità più alta: si contano gli id, a parità le classi, a parità i nomi di elemento.
2. A parità di specificità vince la regola scritta più in basso.
3. Un valore ereditato perde contro qualunque regola che prende l'elemento.

| Selettore | Id | Classi | Elementi |
|---|---|---|---|
| `p` | 0 | 0 | 1 |
| `main p` | 0 | 0 | 2 |
| `.nota` | 0 | 1 | 0 |
| `#avviso` | 1 | 0 | 0 |

Le regole del tuo foglio battono sempre quelle del foglio del browser.

```ad-warning
Il selettore che non prende niente
`prossimo` senza punto cerca un elemento `<prossimo>`: una classe vuole il punto, un id il cancelletto, e contano le maiuscole.
```

```ad-warning
Una regola che non fa niente
Se selettore e valore sono giusti, c'è un'altra regola che vince: più in basso con lo stesso peso, o con un id o una classe in più.
```

```ad-warning
Spazio e virgola
`h1 h2` è un `h2` dentro un `h1`; `h1, h2` sono gli `h1` e gli `h2`.
```
