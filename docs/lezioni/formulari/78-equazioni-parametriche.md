# Formulario: Equazioni parametriche

## Equazione con un parametro

- Equazione parametrica: i coefficienti $a$, $b$, $c$ dipendono dal parametro $k$.
- Esempio: $(k - 1)x^2 - 2kx + k + 3 = 0$ ha $a = k - 1$, $b = -2k$, $c = k + 3$.
- Caso $a = 0$: l'equazione è di primo grado e si risolve a parte, sostituendo il valore di $k$. Per l'esempio, $k = 1$ dà $-2x + 4 = 0$, cioè $x = 2$.

## Numero delle soluzioni (con $a \neq 0$)

| Soluzioni | Condizione |
|---|---|
| reali | $\Delta \geq 0$ |
| reali e distinte | $\Delta > 0$ |
| reali e coincidenti | $\Delta = 0$ |
| nessuna reale | $\Delta < 0$ |

Con $b$ pari si usa la formula ridotta:

$$\frac{\Delta}{4} = \left(\frac{b}{2}\right)^2 - ac$$

Per l'esempio $\dfrac{\Delta}{4} = 3 - 2k$: reali per $k \leq \dfrac{3}{2}$, coincidenti per $k = \dfrac{3}{2}$ (con $x = 3$).

## Condizioni sulle soluzioni

| Le soluzioni sono | Relazione |
|---|---|
| opposte | $b = 0$ |
| reciproche | $c = a$ |
| una nulla | $c = 0$ |
| una uguale a $x_0$ | $x_0$ sostituito nell'equazione |
| con somma $s$ | $-\dfrac{b}{a} = s$ |
| con prodotto $p$ | $\dfrac{c}{a} = p$ |

Somma dei quadrati, con $s = x_1 + x_2$ e $p = x_1 \cdot x_2$:

$$x_1^2 + x_2^2 = s^2 - 2p$$

## Procedimento

1. Forma normale; $a$, $b$, $c$ in funzione di $k$.
2. Valori di $k$ con $a = 0$: studiali a parte.
3. Traduci la condizione in un'equazione in $k$ e risolvila.
4. Per ogni valore trovato controlla $a \neq 0$ e $\Delta \geq 0$; scarta gli altri.
5. Con una soluzione nulla o assegnata il controllo di $\Delta$ non serve.

```ad-warning
Dimenticare il caso a = 0
Discriminante, somma e prodotto valgono solo se l'equazione è di secondo grado.
```

```ad-warning
Non controllare il discriminante
Per $(k - 1)x^2 - 2kx + k + 3 = 0$ la somma $4$ dà $k = 2$, ma $\dfrac{\Delta}{4} = -1$: nessun valore va bene.
```

```ad-warning
Somma dei quadrati
$x_1^2 + x_2^2$ è $s^2 - 2p$, non $s^2$.
```
