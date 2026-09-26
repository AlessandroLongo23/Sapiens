# Formulario: Divisione tra polinomi

## Quoziente e resto

Per $B(x)$ diverso dal polinomio nullo esistono e sono unici il quoziente $Q(x)$ e il resto $R(x)$ tali che

$$A(x) = B(x) \cdot Q(x) + R(x)$$

con $R(x)$ nullo oppure di grado minore del grado di $B(x)$. $A$ è il dividendo, $B$ il divisore.

$$x^2 + 3x + 5 = (x + 1)(x + 2) + 3$$

## Gradi

- Grado del quoziente: grado di $A$ meno grado di $B$ (se il grado di $A$ è maggiore o uguale a quello di $B$).
- Grado del resto: al massimo il grado di $B$ meno $1$. Divisore di primo grado: il resto è un numero.
- Grado di $A$ minore del grado di $B$: quoziente $0$, resto $A$.

## Divisione in colonna

1. Ordina dividendo e divisore secondo le potenze decrescenti di $x$ e completa il dividendo con i termini $0x^n$ mancanti.
2. Dividi il primo termine del dividendo per il primo termine del divisore: è un termine del quoziente.
3. Moltiplicalo per tutto il divisore, scrivi l'opposto del prodotto sotto i termini simili e somma: è il resto parziale.
4. Ripeti i passi 2 e 3 sul resto parziale.
5. Fermati quando il resto parziale ha grado minore del divisore: è il resto.

$$\small\def\arraystretch{1.5}\begin{array}{rrrr|l} x^3 & +0x^2 & -7x & +6 & \underline{\;x - 2\;} \\ \underline{-x^3} & \underline{+2x^2} & & & x^2 + 2x - 3 \\ & 2x^2 & -7x & +6 & \\ & \underline{-2x^2} & \underline{+4x} & & \\ & & -3x & +6 & \\ & & \underline{+3x} & \underline{-6} & \\ & & & 0 & \end{array}$$

## Verifica

Calcola $B(x) \cdot Q(x) + R(x)$ e confrontalo con $A(x)$; controlla che il grado di $R$ sia minore del grado di $B$.

$$
\begin{aligned}
&(x - 2)(2x^2 + x + 6) + 7 \\
&= 2x^3 - 3x^2 + 4x - 5
\end{aligned}
$$

Controllo veloce: stesso valore dei due membri per un numero, per esempio $x = 1$.

## Divisibilità

$A(x)$ è divisibile per $B(x)$ se il resto è nullo. Allora

$$
\begin{gathered}
A(x) = B(x) \cdot Q(x) \\
x^3 - 7x + 6 = (x - 2)(x^2 + 2x - 3)
\end{gathered}
$$

Per un divisore $x - a$ c'è la regola di Ruffini.

```ad-warning
Potenze mancanti
Senza $+0x^2$ in $x^3 - 7x + 6$ i termini finiscono nelle colonne sbagliate.
```

```ad-warning
Segni del prodotto
Si cambia il segno di tutti i termini del prodotto: da $2x^3 - 4x^2$ si scrive $-2x^3 + 4x^2$.
```

```ad-warning
Quando fermarsi
Ci si ferma quando il grado del resto parziale è minore del grado del divisore, non prima.
```
