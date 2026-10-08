# Formulario: L'impaginazione di una pagina web

## Contenitore ed elementi

```
.contenitore {
    display: flex;
}
```

- L'elemento con `display: flex` è il contenitore flex; i suoi figli diretti sono gli elementi flex.
- Gli elementi flex si mettono in riga, ognuno largo quanto il suo contenuto.
- I nipoti non sono toccati: per le voci di un menu fatto con un elenco il contenitore è `ul`, non `nav`.

## Le proprietà del contenitore

| Proprietà | Che cosa decide | Valori |
|---|---|---|
| `flex-direction` | la direzione della fila, cioè l'asse principale | `row`, `column` |
| `justify-content` | la distribuzione lungo l'asse principale | `flex-start`, `center`, `flex-end`, `space-between`, `space-around` |
| `align-items` | l'allineamento sull'asse trasversale | `stretch`, `flex-start`, `center`, `flex-end` |
| `gap` | lo spazio tra un elemento e il successivo | `16px` |
| `flex-wrap` | se chi non ci sta va a capo | `nowrap`, `wrap` |

| Direzione | `justify-content` sposta | `align-items` sposta |
|---|---|---|
| `row` | a sinistra e a destra | in alto e in basso |
| `column` | in alto e in basso | a sinistra e a destra |

- `space-between`: primo e ultimo ai bordi, lo spazio che avanza tra gli elementi.
- `space-around`: lo stesso spazio ai due lati di ogni elemento; ai bordi ne resta la metà.
- `stretch`: gli elementi riempiono il contenitore sull'asse trasversale.

## Lo spazio che avanza

$$\text{avanzo} = \text{contenitore} - \text{somma degli elementi} - (n - 1) \cdot \text{gap}$$

Con $600\,\text{px}$ di contenitore, tre elementi da $100\,\text{px}$ e `gap: 20px`: $600 - 300 - 40 = 260\,\text{px}$.

- `flex: 1` nella regola di un elemento: l'elemento prende tutto lo spazio che avanza.
- `flex: 1` su tutti gli elementi: lo spazio si divide in parti uguali.
- `flex-wrap: nowrap`: gli elementi restano su una riga e si stringono.
- `flex-wrap: wrap`: su una riga stanno $k$ elementi larghi $l$ se $k \cdot l + (k - 1) \cdot \text{gap}$ non supera il contenitore.

## La pagina classica

```
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.contenuto {
    display: flex;
    gap: 16px;
}

main {
    flex: 1;
}

aside {
    width: 140px;
}
```

- L'ordine degli elementi nella riga è quello dell'HTML.
- Oltre flexbox: `display: grid` per righe e colonne insieme, `position` per mettere un elemento in un punto preciso.

```ad-warning
Errori da evitare
`display: flex` scritto nella regola degli elementi e non del loro contenitore. `justify-content` usato per centrare in orizzontale un contenitore in colonna: lì serve `align-items`. Una tabella usata per affiancare i pezzi della pagina.
```
