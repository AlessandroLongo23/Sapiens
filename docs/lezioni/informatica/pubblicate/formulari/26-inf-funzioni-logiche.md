# Formulario: Condizioni e funzioni logiche

## Confronti e valori logici

Una condizione è un confronto: il suo risultato è un valore logico, VERO oppure FALSO.

| Operatore | Significato | Esempio con `A1` uguale a 7 |
|---|---|---|
| `=` | uguale a | `=A1=7` dà VERO |
| `<>` | diverso da | `=A1<>7` dà FALSO |
| `<` | minore di | `=A1<7` dà FALSO |
| `<=` | minore o uguale a | `=A1<=7` dà VERO |
| `>` | maggiore di | `=A1>6` dà VERO |
| `>=` | maggiore o uguale a | `=A1>=8` dà FALSO |

## La funzione SE

`=SE(condizione;valore_se_vero;valore_se_falso)`

1. Il foglio calcola la condizione.
2. Se è VERO, il risultato è il secondo argomento.
3. Se è FALSO, il risultato è il terzo argomento.

- Con un testo, tra virgolette: `=SE(B2>=6;"sufficiente";"insufficiente")`.
- Con un conto: `=SE(B2>=50;B2*0,9;B2)`.

## SE annidati

Tre casi con due SE, il secondo al posto del terzo argomento del primo:

`=SE(B2>=8;"ottimo";SE(B2>=6;"sufficiente";"insufficiente"))`

- Il foglio si ferma alla prima condizione vera.
- Soglie in ordine: dalla più alta alla più bassa con `>=`, dalla più bassa alla più alta con `<`.
- Tante parentesi chiuse in fondo quanti sono i SE.

## E, O, NON

- `=E(B2>=6;C2>=6)`: VERO solo se tutte le condizioni sono vere.
- `=O(B2>=6;C2>=6)`: VERO se almeno una condizione è vera.
- `=NON(B2>=6)`: VERO se la condizione è falsa.
- Dentro un SE: `=SE(E(B2>=6;C2>=6);"ammesso";"respinto")`.
- Un valore tra 6 e 8: `=E(B2>=6;B2<=8)`.

| Prima | Seconda | E | O |
|---|---|---|---|
| VERO | VERO | VERO | VERO |
| VERO | FALSO | FALSO | VERO |
| FALSO | VERO | FALSO | VERO |
| FALSO | FALSO | FALSO | FALSO |

## CONTA.SE e SOMMA.SE

- `=CONTA.SE(intervallo;criterio)`: quante celle dell'intervallo rispettano il criterio.
- `=SOMMA.SE(intervallo;criterio;intervallo_somma)`: somma le celle del terzo intervallo nelle righe in cui il primo rispetta il criterio; senza il terzo argomento somma il primo intervallo.
- Criterio: un valore (`"cibo"`, `6`) oppure un confronto tra virgolette (`">=6"`, `"<10"`, `"<>0"`).
- `=CONTA.SE(B2:B7;">=9")` conta le spese di almeno $9$ euro; `=SOMMA.SE(A2:A7;"cibo";B2:B7)` somma gli euro delle righe con cibo.

```ad-warning
Il valore sulla soglia
`B2>6` esclude il $6$, `B2>=6` lo comprende.
```

```ad-warning
L'ordine delle soglie nei SE annidati
`=SE(B2>=6;"sufficiente";SE(B2>=8;"ottimo";"insufficiente"))` non scrive mai ottimo.
```

```ad-warning
Virgolette
I testi e i criteri con un confronto vanno tra virgolette: `"sufficiente"`, `">=9"`.
```
