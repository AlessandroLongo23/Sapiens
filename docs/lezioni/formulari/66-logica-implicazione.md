# Formulario: Implicazione, condizioni necessarie e sufficienti

## Implicazione materiale

"Se $p$, allora $q$": $p$ è la premessa, $q$ la conseguenza. È falsa solo con premessa vera e conseguenza falsa.

| $p$ | $q$ | $p \to q$ |
|---|---|---|
| V | V | V |
| V | F | F |
| F | V | V |
| F | F | V |

Con la premessa falsa l'implicazione è sempre vera: "se $3 > 5$, allora $3 > 8$" è vera.

## Inversa, contraria e contronominale

| Nome | Forma |
|---|---|
| Implicazione | $p \to q$ |
| Inversa | $q \to p$ |
| Contraria | $\neg p \to \neg q$ |
| Contronominale | $\neg q \to \neg p$ |

La contronominale è equivalente all'implicazione; l'inversa e la contraria no (sono equivalenti tra loro).

## Doppia implicazione

"$p$ se e solo se $q$": $p \leftrightarrow q$ è vera quando $p$ e $q$ hanno lo stesso valore di verità.

| $p$ | $q$ | $p \leftrightarrow q$ |
|---|---|---|
| V | V | V |
| V | F | F |
| F | V | F |
| F | F | V |

## Implicazione logica ed equivalenza logica

$p \Rightarrow q$: $p \to q$ è una tautologia. $p \Leftrightarrow q$: $p \leftrightarrow q$ è una tautologia, le due proposizioni hanno la stessa colonna.

$$
\begin{gathered}
(p \to q) \Leftrightarrow (\neg q \to \neg p) \\
(p \to q) \Leftrightarrow (\neg p \vee q)
\end{gathered}
$$

Ragionamento corretto: da $p \to q$ e $p$ segue $q$. Da $p \to q$ e $q$ non segue $p$.

## Condizioni necessarie e sufficienti

| Frase | In simboli |
|---|---|
| se $p$, allora $q$ | $p \Rightarrow q$ |
| $q$ se $p$ | $p \Rightarrow q$ |
| $p$ solo se $q$ | $p \Rightarrow q$ |
| $p$ è sufficiente per $q$ | $p \Rightarrow q$ |
| $q$ è necessaria per $p$ | $p \Rightarrow q$ |
| $p$ se e solo se $q$ | $p \Leftrightarrow q$ |
| $p$ è necessaria e sufficiente per $q$ | $p \Leftrightarrow q$ |

Per esempio "$n$ divisibile per $4$" $\Rightarrow$ "$n$ pari": la prima è sufficiente, la seconda necessaria. Controesempio all'inversa: $6$.

## Implicazione e inclusione

Insieme di verità: $V_p = \{x \in U \mid p(x)\}$.

$$
\begin{gathered}
p(x) \Rightarrow q(x) \\
\text{se e solo se} \\
V_p \subseteq V_q
\end{gathered}
$$

$p(x) \Leftrightarrow q(x)$ se e solo se $V_p = V_q$.

## Negazione e dimostrazioni

$$\neg(p \to q) \Leftrightarrow p \wedge \neg q$$

"Se piove, prendo l'ombrello" si nega con "piove e non prendo l'ombrello".

- Per contronominale: si dimostra $\neg q \Rightarrow \neg p$.
- Per assurdo: si suppone vera $p \wedge \neg q$ e si arriva a una contraddizione.

```ad-warning
Premessa falsa
Un'implicazione con la premessa falsa è vera, qualunque sia la conseguenza.
```

```ad-warning
Scambiare con l'inversa
"Quadrato $\Rightarrow$ rettangolo" è vera, "rettangolo $\Rightarrow$ quadrato" è falsa.
```

```ad-warning
Negare con un'implicazione
La negazione di $p \to q$ è $p \wedge \neg q$, non $p \to \neg q$.
```
