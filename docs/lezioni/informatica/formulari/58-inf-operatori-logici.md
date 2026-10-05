# Formulario: Gli operatori logici

## I tre operatori

Gli operatori logici prendono valori booleani, cioè condizioni, e danno un valore booleano.

| Operatore | Python | C++ | Nei diagrammi | Vero quando |
|---|---|---|---|---|
| e | `and` | `&&` | E | sono vere tutte e due le condizioni |
| o | `or` | `\|\|` | O | è vera almeno una delle due |
| non | `not` | `!` | NON | la condizione è falsa |

| A parole | Python | C++ |
|---|---|---|
| almeno $120$ centimetri e almeno $8$ anni | `altezza >= 120 and eta >= 8` | `altezza >= 120 && eta >= 8` |
| meno di $14$ anni oppure almeno $65$ | `eta < 14 or eta >= 65` | `eta < 14 \|\| eta >= 65` |
| non maggiorenne | `not (eta >= 18)` | `!(eta >= 18)` |

`or` è vero anche quando le due condizioni sono vere insieme.

## Il contrario di un confronto

| Confronto | Il suo contrario |
|---|---|
| `a == b` | `a != b` |
| `a < b` | `a >= b` |
| `a > b` | `a <= b` |

## Tabelle di verità

| A | B | A `and` B | A `or` B | `not` A |
|---|---|---|---|---|
| vero | vero | vero | vero | falso |
| vero | falso | falso | vero | falso |
| falso | vero | falso | vero | vero |
| falso | falso | falso | falso | vero |

## Precedenza

1. I confronti si calcolano prima di `and` e di `or`.
2. Tra gli operatori logici: prima `not`, poi `and`, per ultimo `or`.
3. `a or b and c` si legge `a or (b and c)`; per l'altro gruppo servono le parentesi, `(a or b) and c`.
4. Dopo `not` e `!`, il confronto va tra parentesi: in C++ `!eta >= 18` nega solo `eta`.

Con `and` e `or` nella stessa condizione conviene mettere sempre le parentesi.

## Intervalli

| A parole | Python | C++ |
|---|---|---|
| voto tra $1$ e $10$ | `1 <= voto and voto <= 10` | `1 <= voto && voto <= 10` |
| voto fuori dall'intervallo | `voto < 1 or voto > 10` | `voto < 1 \|\| voto > 10` |

Python accetta anche `1 <= voto <= 10`; in C++ quella scrittura non è un intervallo.

## Negare una condizione composta

Le leggi di De Morgan:

- Il contrario di "A e B" è "non A, oppure non B".
- Il contrario di "A o B" è "non A, e non B".

Per negare una condizione composta si nega ogni pezzo e si scambia `and` con `or`: il contrario di `1 <= voto and voto <= 10` è `voto < 1 or voto > 10`.

```ad-warning
Ogni lato deve essere una condizione completa
`giorno == 6 or 7` è sempre vera, senza errori. Si scrive `giorno == 6 or giorno == 7`.
```

```ad-warning
In C++ la scrittura 1 <= voto <= 10 non è un intervallo
Confronta con $10$ il vero o falso di `1 <= voto`. Si scrive `1 <= voto && voto <= 10`.
```

```ad-warning
Negare senza cambiare l'operatore
`voto < 1 and voto > 10` non è mai vera. Negando, `and` diventa `or`.
```
