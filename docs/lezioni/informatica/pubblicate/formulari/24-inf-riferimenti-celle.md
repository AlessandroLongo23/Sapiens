# Formulario: Riferimenti relativi e assoluti

## Che formula compare dopo una copia

1. Conta di quante righe e di quante colonne si sposta la formula.
2. Nei riferimenti relativi aggiungi quelle righe al numero di riga (toglile se la copia va in alto).
3. Sposta la lettera di colonna di altrettante colonne (avanti a destra, indietro a sinistra).
4. Quello che ha il dollaro davanti non cambia; numeri, operatori e parentesi nemmeno.

`=A2*B2` copiata da `C2` a `C4` diventa `=A4*B4`. `=B2+B3+B4` copiata da `B5` a `C5` diventa `=C2+C3+C4`.

## I quattro tipi di riferimento

| Riferimento | Tipo | Che cosa è bloccato | Copiato da `C2` a `D5` diventa |
|---|---|---|---|
| `A1` | relativo | niente | `B4` |
| `$A$1` | assoluto | colonna e riga | `$A$1` |
| `$A1` | misto | la colonna `A` | `$A4` |
| `A$1` | misto | la riga 1 | `B$1` |

Ogni dollaro blocca quello che ha subito dopo.

## Formule da ricordare

- Un valore fisso in una cella (aliquota, cambio, costante): `=A2*$D$1`, da copiare verso il basso.
- Tabella a doppia entrata (tavola pitagorica): `=$A2*B$1`, da copiare in tutta la tabella.

## Scegliere il riferimento

1. Copia verso il basso: cambiano i numeri di riga. Copia verso destra: cambiano le lettere.
2. Il riferimento deve seguire la formula: relativo.
3. Deve indicare sempre la stessa cella: assoluto, con due dollari.
4. Deve restare nella stessa colonna o nella stessa riga: misto, con il dollaro davanti alla parte ferma.
5. Dopo la copia, leggi la formula dell'ultima cella.

Tagliare e incollare una cella sposta la formula senza cambiarla: i riferimenti si adattano solo nella copia.

```ad-warning
Zeri dopo la copia
`=A2*D1` copiata in basso diventa `=A3*D2`: se `D2` è vuota il risultato è 0. Serve `=A2*$D$1`.
```

```ad-warning
Il dollaro dalla parte sbagliata
`$A1` blocca la colonna, `A$1` blocca la riga: il dollaro sta davanti a quello che resta fermo.
```
