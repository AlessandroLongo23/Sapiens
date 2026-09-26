# Formulario: Definizione di funzione

## Funzione

- Funzione da $A$ a $B$: relazione che associa a ogni elemento di $A$ uno e un solo elemento di $B$, la sua immagine.
- Nessun elemento di $A$ resta senza immagine, nessuno ne ha due. Sugli elementi di $B$ non si chiede niente.

## Come si riconosce

| Data come | È una funzione se |
|---|---|
| diagramma a frecce | da ogni elemento di $A$ parte una e una sola freccia |
| elenco di coppie | ogni elemento di $A$ è primo elemento di una e una sola coppia |
| grafico | ogni retta verticale lo incontra al più una volta |

Esempio: da $\{1,\ 2,\ 3\}$ a $\{a,\ b\}$,

$$
\begin{gathered}
\{(1, a),\ (2, a),\ (3, b)\} \text{ sì} \\
\{(1, a),\ (3, b)\} \text{ no}
\end{gathered}
$$

## Notazione

$$f: A \to B \qquad x \mapsto f(x)$$

- $f: A \to B$ si legge "$f$ da $A$ a $B$": $A$ è il dominio, $B$ il codominio.
- $f(x)$ si legge "$f$ di $x$" ed è l'immagine di $x$.
- Con insiemi di numeri, $y = f(x)$: $x$ variabile indipendente, $y$ variabile dipendente.

## Funzioni date con una formula

- Legge: la formula che dice come calcolare $f(x)$, per esempio $f(x) = 3x - 5$.
- Valore in un punto: al posto di $x$ si sostituisce il numero, tra parentesi.

$$
\begin{aligned}
f(x) &= 2x^2 - 3x + 1 \\
f(-2) &= 2 \cdot (-2)^2 - 3 \cdot (-2) + 1 \\
&= 15
\end{aligned}
$$

$$
\begin{aligned}
f(x) &= 2x + 3 \\
f(a + 1) &= 2(a + 1) + 3 \\
&= 2a + 5
\end{aligned}
$$

## Grafico per punti

Grafico di $f$: i punti $(x, f(x))$ del piano cartesiano, con $x$ nel dominio. Nel punto $(x, y)$, $x$ è l'ascissa e $y$ l'ordinata.

1. Scegli alcuni valori di $x$, positivi, negativi e lo $0$.
2. Calcola $f(x)$ e scrivi la tabella di valori.
3. Disegna i punti $(x, f(x))$.
4. Dominio $\mathbb{R}$: unisci i punti. Dominio finito: solo i punti.

```ad-warning
Frecce che arrivano
Se a un elemento di $B$ arrivano due frecce, o nessuna, la relazione può essere lo stesso una funzione.
```

```ad-warning
Parentesi
$f(x) = x^2 - 3x$: $f(-2) = (-2)^2 - 3 \cdot (-2) = 10$, non $-2^2 + 6 = 2$.
```

```ad-warning
Rette verticali, non orizzontali
Le rette verticali dicono se un grafico è di una funzione; quelle orizzontali servono per iniettiva e suriettiva.
```
