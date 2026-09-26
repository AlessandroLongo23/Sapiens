# Formulario: MCD e MCM di polinomi

## Divisori e multipli

$A$ è divisibile per $B$ non nullo se esiste un polinomio $Q$ con $A = B \cdot Q$ (resto zero nella divisione). Allora $B$ è un divisore di $A$ e $A$ è un multiplo di $B$.

$$x^2 - 9 = (x - 3)(x + 3)$$

## Definizioni

- MCD: il polinomio di grado più alto tra quelli che dividono tutti i polinomi dati.
- MCM: il polinomio di grado più basso tra quelli che sono multipli di tutti.
- Primi tra loro: polinomi senza fattori comuni, a parte i numeri. Il MCD è solo il fattore numerico, per esempio $1$.

## La regola di calcolo

| | MCD | MCM |
|---|---|---|
| Fattori numerici tutti interi | MCD dei valori assoluti | MCM dei valori assoluti |
| Almeno un fattore numerico frazionario | $1$ | $1$ |
| Fattori irriducibili | solo i comuni, con l'esponente minore | tutti, con l'esponente maggiore |

Il fattore numerico del risultato è sempre positivo.

## Procedimento

1. Scomponi ogni polinomio in fattori irriducibili.
2. Scrivi i fattori opposti nello stesso modo, portando fuori $-1$.
3. Fattore numerico: MCD e MCM dei valori assoluti se sono interi, $1$ se c'è una frazione.
4. MCD: i fattori comuni a tutti, con l'esponente minore.
5. MCM: tutti i fattori, con l'esponente maggiore.
6. Lascia il risultato scomposto.

## Fattori opposti

$$
\begin{gathered}
3 - x = -(x - 3) \\
(3 - x)^2 = (x - 3)^2 \\
(3 - x)^3 = -(x - 3)^3
\end{gathered}
$$

Si sceglie la forma con il primo termine positivo: $x - 3$, $x - y$. $3 + x$ e $x + 3$ sono lo stesso fattore.

## Esempi

$$
\begin{gathered}
6x^2 + 6x,\ 4x^2 - 4 \qquad \to \\
\text{MCD} = 2(x + 1), \\
\text{MCM} = 12x(x - 1)(x + 1)
\end{gathered}
$$

$$
\begin{gathered}
2x - 6,\ 9 - x^2,\ x^2 - 6x + 9 \\
\to \qquad \text{MCD} = x - 3, \\
\text{MCM} = 2(x - 3)^2(x + 3)
\end{gathered}
$$

$$
\begin{gathered}
x^3y - xy^3,\ x^2y + 2xy^2 + y^3 \\
\to \qquad \text{MCD} = y(x + y), \\
\text{MCM} = xy(x - y)(x + y)^2
\end{gathered}
$$

## Controllo per due polinomi

Con due polinomi e fattori numerici interi, $\text{MCD} \cdot \text{MCM}$ è uguale al prodotto dei due polinomi, a meno del segno. Con tre o più polinomi non vale.

```ad-warning
Polinomi non scomposti del tutto
$x^3 - 4x = x(x - 2)(x + 2)$: fermarsi a $x(x^2 - 4)$ fa perdere il fattore comune $x + 2$ con $x^2 + 2x$.
```

```ad-warning
Un fattore non comune nel MCD
Nel MCD entrano solo i fattori che compaiono in tutti i polinomi.
```

```ad-warning
Fattori opposti non riconosciuti
$x - 3$ e $3 - x$ differiscono solo per il segno: vanno scritti nello stesso modo prima del confronto.
```
