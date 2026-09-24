# Formulario: MCD e MCM tra monomi

## Divisori e multipli

$A$ è divisibile per $B \neq 0$ se $A : B$ è un monomio, cioè se ogni lettera di $B$ compare in $A$ con esponente maggiore o uguale. Allora $B$ è un divisore di $A$ e $A$ è un multiplo di $B$.

$$12x^3y : 4x^2 = 3xy$$

## Definizioni

- MCD: il monomio di grado più alto tra quelli che dividono tutti i monomi dati.
- MCM: il monomio di grado più basso tra quelli che sono multipli di tutti.

## La regola di calcolo

| | MCD | MCM |
|---|---|---|
| Coefficienti tutti interi | MCD dei valori assoluti | MCM dei valori assoluti |
| Almeno un coefficiente frazionario | $1$ | $1$ |
| Lettere | solo le comuni, con l'esponente minimo | tutte, con l'esponente massimo |

Il coefficiente del risultato è sempre positivo. Alcuni libri mettono sempre coefficiente $1$: in quel caso la parte letterale non cambia.

## Procedimento

1. Scrivi ogni monomio in forma normale.
2. Coefficienti tutti interi: MCD e MCM dei valori assoluti; altrimenti coefficiente $1$.
3. MCD: le lettere presenti in tutti i monomi, con l'esponente minimo.
4. MCM: tutte le lettere presenti almeno una volta, con l'esponente massimo.
5. Scrivi il risultato con coefficiente positivo.

## Esempi

$$12x^3y^2,\ 18x^2y^5 \quad\to\quad \text{MCD} = 6x^2y^2, \quad \text{MCM} = 36x^3y^5$$

$$-8a^3b,\ 12a^2c^2,\ 20ab^4c \quad\to\quad \text{MCD} = 4a, \quad \text{MCM} = 120a^3b^4c^2$$

$$\frac{3}{2}a^4b,\ -\frac{9}{4}a^2b^3,\ \frac{1}{8}ab \quad\to\quad \text{MCD} = ab, \quad \text{MCM} = a^4b^3$$

## Controllo per due monomi

Con due monomi a coefficienti interi, $\text{MCD} \cdot \text{MCM}$ è uguale al prodotto dei due monomi, a meno del segno. Con tre o più monomi non vale.

```ad-warning
Una lettera non comune nel MCD
Nel MCD entrano solo le lettere che compaiono in tutti i monomi.
```

```ad-warning
Minimo e massimo scambiati
Il MCD prende l'esponente minimo, il MCM il massimo.
```

```ad-warning
Il segno meno nel risultato
Il MCD di $-4x$ e $-6x^2$ è $2x$, il MCM è $12x^2$: sempre positivi.
```
