# Formulario: Ordinare, filtrare e riassumere i dati

## La tabella di dati

- Intestazione: la prima riga, con il nome di ogni colonna.
- Record: una riga, che descrive una cosa sola (una vendita, uno studente).
- Campo: una colonna, con lo stesso tipo di dato per tutti i record.
- Un solo dato per cella; niente righe vuote, celle unite o totali in mezzo ai dati.

## Ordinare

- Crescente: dal più piccolo al più grande, dalla A alla Z. Decrescente: il contrario.
- Ogni record si sposta intero.

1. Fai clic su una cella della tabella.
2. Apri il comando per ordinare, nel menu dei dati.
3. Scegli il campo e il verso.

Su più livelli: il primo raggruppa (Classe, dalla A alla Z), il secondo ordina dentro ogni gruppo (Incasso, decrescente).

## Filtrare

- Un filtro mostra solo i record che rispettano una condizione e nasconde gli altri.
- Due filtri insieme: restano i record che rispettano tutte e due le condizioni.
- `=SOMMA(C2:C9)` somma anche le righe nascoste; `=SUBTOTALE(9;C2:C9)` somma solo quelle visibili.

## Subtotali

1. Ordina la tabella secondo il campo dei gruppi.
2. Apri il comando dei subtotali.
3. Scegli il campo dei gruppi, la funzione (somma, conteggio, media) e il campo su cui calcolarla.

Il foglio inserisce un totale a ogni cambiamento del campo e, in fondo, il totale complessivo: $80 + 81 + 37 = 198$.

## Tabella pivot

| Dove | Che cosa ci va | Nel mercatino |
|---|---|---|
| righe | un campo: i suoi valori diventano le righe | Classe |
| colonne | un campo: i suoi valori diventano le colonne | Prodotto |
| valori | il campo da riassumere e la funzione | somma di Incasso |

- Ogni cella è il riassunto dei record che hanno quel valore di riga e quel valore di colonna.
- L'ultima colonna e l'ultima riga portano i totali; in basso a destra c'è il totale complessivo.
- I dati di partenza non cambiano; se cambiano loro, la tabella pivot va aggiornata.

```ad-warning
Ordinare una colonna sola
Se si ordina solo la colonna selezionata, i dati di ogni riga non stanno più insieme.
```

```ad-warning
Nascosto non vuol dire cancellato
Un filtro nasconde le righe: tolto il filtro, tornano tutte.
```

```ad-warning
Subtotali senza ordinare
Prima si ordina per il campo dei gruppi, poi si chiedono i subtotali.
```
