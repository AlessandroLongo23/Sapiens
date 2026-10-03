# Formulario: Le funzioni del foglio di calcolo

## Come si scrive una funzione

- Segno `=`, nome della funzione, argomenti tra parentesi tonde: `=SOMMA(B2:B6)`.
- Più argomenti si separano con il punto e virgola: `=SOMMA(B2:B6;10)`.
- Un argomento può essere un numero, un riferimento, un intervallo o un'altra formula.
- In inglese: SUM, AVERAGE, ROUND, con la virgola tra gli argomenti.

## Le funzioni

| Funzione | Che cosa calcola | Con 1,42, 1,38, 1,45, 1,40, 1,41 in `B2:B6` |
|---|---|---|
| `=SOMMA(B2:B6)` | la somma | 7,06 |
| `=MEDIA(B2:B6)` | la somma divisa per quanti sono | 1,412 |
| `=MIN(B2:B6)` | il più piccolo | 1,38 |
| `=MAX(B2:B6)` | il più grande | 1,45 |
| `=CONTA.NUMERI(B2:B6)` | quante celle contengono un numero | 5 |
| `=ARROTONDA(B2;1)` | il numero arrotondato a 1 cifra decimale | 1,4 |

## Valore di una funzione su un intervallo

1. Trova le celle dell'intervallo, dalla prima all'ultima.
2. Tieni solo quelle che contengono un numero: celle vuote e testi vengono saltati.
3. Applica il calcolo della funzione.

Con i voti 7, 8, assente, 6,5 e 9: `CONTA.NUMERI` dà 4 e `MEDIA` dà $30{,}5 : 4 = 7{,}625$.

## Intervalli e argomenti

- `B2:C4` è un rettangolo: 2 colonne e 3 righe, 6 celle.
- `=SOMMA(B2:B4;C2:C4)` addiziona due intervalli, anche lontani tra loro.

## Arrotondare

`=ARROTONDA(numero;cifre)`: si guarda la prima cifra tolta; se è 5 o più, l'ultima cifra tenuta aumenta di uno.

| Formula | Risultato |
|---|---|
| `=ARROTONDA(7,625;1)` | 7,6 |
| `=ARROTONDA(7,625;2)` | 7,63 |
| `=ARROTONDA(7,625;0)` | 8 |

Cambiare il formato di una cella mostra meno cifre ma non cambia il numero; `ARROTONDA` cambia il valore.

## Funzioni annidate

- Una funzione può essere l'argomento di un'altra: si calcola dall'interno verso l'esterno.
- `=ARROTONDA(MEDIA(B2:B6);2)`: prima la media, 1,412, poi l'arrotondamento, 1,41.
- `=SOMMA(B2:B6)/CONTA.NUMERI(B2:B6)` dà lo stesso valore di `=MEDIA(B2:B6)`.

```ad-warning
Due punti o punto e virgola
`=SOMMA(B2:B6)` addiziona cinque celle; `=SOMMA(B2;B6)` solo le due agli estremi.
```

```ad-warning
Cella vuota e zero
Una cella vuota non entra nella media; uno 0 scritto sì, e la abbassa.
```

```ad-warning
Nome scritto male
`=SOMA(B2:B6)` dà `#NOME?`: il foglio non riconosce la funzione.
```
