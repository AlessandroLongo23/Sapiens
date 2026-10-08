# Formulario: Elenchi e tabelle

## Elenchi

| Elemento | Che cos'è | Che cosa mostra il browser |
|---|---|---|
| `<ul>` | elenco puntato: l'ordine delle voci non conta | un pallino davanti a ogni voce |
| `<ol>` | elenco numerato: l'ordine conta | un numero davanti a ogni voce, contato dal browser |
| `<li>` | una voce, dentro `<ul>` o `<ol>` | la voce, a capo |

Per scegliere: se scambiando due voci cambia il significato, serve `<ol>`.

```html
<ol>
    <li>Controtempo</li>
    <li>Ultima campanella</li>
</ol>
```

## Elenco annidato

L'elenco interno si scrive dentro la voce a cui appartiene, dopo il suo testo e prima del suo `</li>`. Ogni `<ol>` numera le sue voci da 1.

```html
<ol>
    <li>Primo tempo
        <ol>
            <li>Controtempo</li>
            <li>Ora buca</li>
        </ol>
    </li>
    <li>Secondo tempo</li>
</ol>
```

## Tabelle

| Elemento | Che cos'è |
|---|---|
| `<table>` | tutta la tabella |
| `<caption>` | la didascalia: subito dopo `<table>`, prima della prima riga |
| `<tr>` | una riga |
| `<th>` | una cella di intestazione: il titolo di una colonna o di una riga |
| `<td>` | una cella con un dato |

- Si scrive una riga alla volta, e in ogni riga una cella alla volta, da sinistra a destra.
- Le colonne non hanno un elemento: sono le celle che occupano lo stesso posto nelle righe. Ogni riga ha lo stesso numero di posti.
- Le linee tra le celle le disegna il foglio di stile, non l'HTML.
- Una tabella è per dati con righe e colonne, non per impaginare.

```html
<table>
    <caption>Concerti di primavera</caption>
    <tr>
        <th>Data</th>
        <th>Luogo</th>
    </tr>
    <tr>
        <td>3 maggio</td>
        <td>Aula magna</td>
    </tr>
</table>
```

## Celle unite

| Attributo | Che cosa fa | Quale cella non si scrive più |
|---|---|---|
| `colspan="2"` | la cella occupa due colonne | quella alla sua destra, nella stessa riga |
| `rowspan="2"` | la cella occupa due righe | quella sotto di lei, nella riga successiva |

Il conto dei posti, riga per riga: i `colspan` delle celle scritte (1 per quelle senza attributo), più i posti presi dalle celle che scendono da sopra, danno il numero di colonne.

```html
<tr>
    <td>lunedì</td>
    <td rowspan="2">Aula 12</td>
</tr>
<tr>
    <td>mercoledì</td>
</tr>
```

```ad-warning
I numeri non si scrivono a mano
In un `<ol>` li mette il browser: scritti nella voce compaiono due volte.
```

```ad-warning
L'elenco interno dopo la chiusura della voce
Tra una voce e l'altra possono stare solo dei `<li>`: la voce si chiude dopo l'elenco che contiene.
```

```ad-warning
Unire senza cancellare
Una cella con `colspan` o `rowspan` prende il posto di un'altra, che va tolta dal codice.
```
