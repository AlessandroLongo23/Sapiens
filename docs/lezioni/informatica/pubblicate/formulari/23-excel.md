# Formulario: Celle, valori e formule

## Celle e intervalli

- Colonne: lettere (`A`, `B`, ..., `Z`, `AA`, `AB`, ...). Righe: numeri.
- Indirizzo di una cella: lettera della colonna, poi numero della riga. `B3` è colonna `B`, riga 3.
- Intervallo: cella in alto a sinistra, due punti, cella in basso a destra. `C2:D4` ha 2 colonne e 3 righe.
- Celle di un intervallo: numero delle colonne per numero delle righe. Da riga 2 a riga 6 le righe sono $6 - 2 + 1 = 5$.

## Che cosa contiene una cella

| Contenuto | Esempio | Nota |
|---|---|---|
| testo | Quaderno | di solito allineato a sinistra |
| numero | 2,5 | virgola decimale; di solito allineato a destra |
| data | 03/10/2026 | conservata come numero di giorni: `=B1-A1` dà i giorni tra due date |
| formula | `=B2*C2` | la cella mostra il risultato |

## Formule

- Una formula comincia sempre con `=`.
- Riferimento: l'indirizzo di una cella scritto dentro una formula.
- Una cella vuota, in un calcolo, vale 0.

| Operazione | Operatore | Esempio |
|---|---|---|
| addizione | `+` | `=A1+B1` |
| sottrazione | `-` | `=A1-B1` |
| moltiplicazione | `*` | `=A1*B1` |
| divisione | `/` | `=A1/B1` |
| potenza | `^` | `=A1^2` |

## Ordine delle operazioni

1. Sostituisci a ogni riferimento il valore della cella.
2. Parentesi, dalle più interne (solo tonde).
3. Potenze.
4. Moltiplicazioni e divisioni, da sinistra a destra.
5. Addizioni e sottrazioni, da sinistra a destra.

Con `B1`, `B2`, `B3` uguali a 7, 8, 6: `=(B1+B2+B3)/3` dà 7, mentre `=B1+B2+B3/3` dà 17.

## Ricalcolo

- Quando cambia una cella, il foglio ricalcola tutte le formule che la usano, a catena.
- Nelle formule conviene scrivere i riferimenti, non i numeri.

## Errori

| Errore | Causa |
|---|---|
| `#DIV/0!` | divisione per zero o per una cella vuota |
| `#VALORE!` | calcolo con una cella che contiene un testo |
| `#NOME?` | una parola che il foglio non riconosce |
| riferimento circolare | la formula usa la cella in cui è scritta |

```ad-warning
Manca il segno =
`B2*C2` senza l'uguale davanti è un testo: il foglio non calcola niente.
```

```ad-warning
Parentesi dimenticate
`=B1+B2+B3/3` divide per 3 solo `B3`. Per la media servono le parentesi: `=(B1+B2+B3)/3`.
```

```ad-warning
Punto al posto della virgola
I decimali si scrivono con la virgola: 2,5. Con il punto il numero può diventare un testo o una data.
```
