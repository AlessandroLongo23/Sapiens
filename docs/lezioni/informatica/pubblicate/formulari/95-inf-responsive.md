# Formulario: Pagine responsive e accessibili

## Il viewport

Dentro `head`, in ogni pagina:

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Senza questa riga un telefono disegna la pagina come su un computer e la rimpicciolisce.

## Unità relative

| Unità | Relativa a | Esempio |
|---|---|---|
| `%` | la larghezza dell'elemento che contiene | `width: 50%` in $600\,\text{px}$ sono $300\,\text{px}$ |
| `rem` | il carattere della pagina, di solito $16\,\text{px}$ | `2rem` sono $32\,\text{px}$ |
| `em` | il carattere dell'elemento stesso | a $20\,\text{px}$, `0.5em` sono $10\,\text{px}$ |
| `vw` | un centesimo della larghezza del viewport | a $400\,\text{px}$, `50vw` sono $200\,\text{px}$ |

- Testo in `rem`, larghezze in `%` con un tetto: `max-width: 30rem` sono al più $480\,\text{px}$.

## Immagini che si adattano

```
img {
    max-width: 100%;
    height: auto;
}
```

Un'immagine di $800 \times 400$ in una colonna di $360\,\text{px}$ diventa $360 \times 180$; in una colonna più larga di $800\,\text{px}$ resta $800 \times 400$.

## Media query

```
@media (min-width: 600px) {
    .contenuto {
        flex-direction: row;
    }
}
```

| Condizione | Vale quando il viewport è largo |
|---|---|
| `(min-width: 600px)` | almeno $600\,\text{px}$, compreso 600 |
| `(max-width: 600px)` | al più $600\,\text{px}$, compreso 600 |

Prima il telefono:

1. Fuori dalle media query, le regole per lo schermo più stretto (tutto in colonna).
2. Sotto, con `min-width`, quello che cambia quando c'è più spazio.
3. A parità di selettore vince la regola scritta più in basso: le media query vanno dopo le regole di base.

## Accessibilità

| Che cosa | Come |
|---|---|
| Contrasto del testo normale | rapporto di almeno $4{,}5 : 1$ con lo sfondo |
| Contrasto del testo grande (da $24\,\text{px}$, o da circa $19\,\text{px}$ in grassetto) | almeno $3 : 1$ |
| Immagini | testo alternativo in `alt` |
| Titoli | un solo `h1`, poi `h2`, poi `h3`, senza saltare livelli |
| Tastiera | `a`, `button` e campi veri; il contorno del fuoco non si toglie |
| Moduli | `<label for="email">` collegata a `<input id="email">` |

Il rapporto di contrasto va da $1 : 1$ (colori uguali) a $21 : 1$ (nero su bianco).

```ad-warning
Errori da evitare
La riga del viewport dimenticata. La regola di base scritta dopo la media query, che così non cambia più niente. `min-width` e `max-width` scambiati. Un titolo scelto per la grandezza e non per il livello.
```
