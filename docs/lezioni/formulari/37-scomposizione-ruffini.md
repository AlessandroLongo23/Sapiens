# Formulario: Scomposizione con la regola di Ruffini

## Da uno zero a un fattore

Zero di $P(x)$: un numero $a$ con $P(a) = 0$.

Teorema di Ruffini: se $P(a) = 0$, allora $x - a$ divide $P(x)$ e

$$P(x) = (x - a) \cdot Q(x),$$

con $Q(x)$ il quoziente della divisione con la regola di Ruffini, di un grado più basso di $P(x)$.

Zero $-2$: fattore $x + 2$. Zero $\dfrac{p}{q}$: fattore $qx - p$.

## Candidati zeri (coefficienti interi)

- Zeri interi: divisori del termine noto, con i due segni. Per $x^3 - 2x^2 - 5x + 6$: $\pm 1, \pm 2, \pm 3, \pm 6$.
- Zeri frazionari, se il coefficiente direttore non è $\pm 1$: $\dfrac{p}{q}$ ridotta ai minimi termini, con $p$ divisore del termine noto e $q$ divisore del coefficiente direttore.
- Coefficiente direttore: il coefficiente del termine di grado più alto.
- $P(1)$ è la somma dei coefficienti; $P(-1)$ è la somma dopo aver cambiato segno ai coefficienti dei termini di grado dispari.
- Termine noto $0$: raccogli la $x$.

## Procedimento

1. Ordina il polinomio e raccogli quello che si può.
2. Scrivi i candidati.
3. Trova un candidato $a$ con $P(a) = 0$.
4. Dividi per $x - a$ con Ruffini: $P(x) = (x - a) \cdot Q(x)$.
5. Scomponi $Q(x)$ (trinomio, prodotto notevole o di nuovo Ruffini) finché nessun fattore si scompone più.
6. Controlla moltiplicando o con il valore in un punto.

Esempio, zero $1$:

$$\begin{array}{r|rrr|r} & 1 & -2 & -5 & 6 \\ 1 & & 1 & -1 & -6 \\ \hline & 1 & -1 & -6 & 0 \end{array}$$

$$
\begin{aligned}
&x^3 - 2x^2 - 5x + 6 \\
&= (x - 1)(x^2 - x - 6) \\
&= (x - 1)(x + 2)(x - 3)
\end{aligned}
$$

Uno zero frazionario: $2x^3 + x^2 + x - 1 = \left(x - \dfrac{1}{2}\right)(2x^2 + 2x + 2) = (2x - 1)(x^2 + x + 1)$.

Uno zero può ripetersi: $x^4 - x^3 - 3x^2 + 5x - 2 = (x - 1)^3(x + 2)$.

## Quando nessun candidato funziona

- Secondo o terzo grado: il polinomio non si scompone. Esempio: $x^3 + x + 1$.
- Dal quarto grado: può scomporsi in fattori di grado più alto. Esempio: $x^4 + 5x^2 + 6 = (x^2 + 2)(x^2 + 3)$.

## Ordine dei metodi

1. Raccoglimento totale.
2. Secondo il numero di termini (tabella).
3. Ruffini, per i polinomi in una lettera.
4. Ogni fattore si riprova dall'inizio.

| Termini | Metodi da provare |
|---|---|
| $2$ | differenza di quadrati, somma o differenza di cubi |
| $3$ | quadrato di un binomio, trinomio di secondo grado |
| $4$ | raccoglimento parziale, cubo di un binomio |
| $6$ | quadrato di un trinomio, raccoglimento parziale |

```ad-warning
Segno del fattore
Se $P(-1) = 0$ il fattore è $x + 1$, non $x - 1$.
```

```ad-warning
Potenze mancanti
Nella tabella ogni potenza mancante ha il suo $0$: per $x^3 - 13x - 12$ la prima riga è $1, 0, -13, -12$.
```

```ad-warning
Coefficiente perso
$\left(x - \dfrac{1}{2}\right)(2x^2 + 2x + 2)$ diventa $(2x - 1)(x^2 + x + 1)$, non $\left(x - \dfrac{1}{2}\right)(x^2 + x + 1)$.
```
