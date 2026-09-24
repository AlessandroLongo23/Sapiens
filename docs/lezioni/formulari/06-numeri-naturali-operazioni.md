# Formulario: Operazioni in ℕ

## Nomi dei termini

| Operazione | Termini | Risultato |
|---|---|---|
| Addizione $a + b$ | addendi | somma |
| Sottrazione $a - b$ | minuendo, sottraendo | differenza |
| Moltiplicazione $a \cdot b$ | fattori | prodotto |
| Divisione $a : b$ | dividendo, divisore | quoziente |

Un'operazione è interna a un insieme quando dà sempre un risultato che appartiene all'insieme. In $\mathbb{N}$ la sottrazione $a - b$ si fa solo se $a \geq b$; la divisione esatta $a : b$ solo se $b \neq 0$ e $a$ è multiplo di $b$.

## Proprietà di addizione e moltiplicazione

Commutativa:

$$a + b = b + a \qquad a \cdot b = b \cdot a$$

Associativa:

$$(a + b) + c = a + (b + c) \qquad (a \cdot b) \cdot c = a \cdot (b \cdot c)$$

Dissociativa, cioè scomporre un addendo o un fattore: $27 + 8 = 27 + 3 + 5$ e $15 \cdot 12 = 15 \cdot 2 \cdot 6$.

Distributiva della moltiplicazione:

$$a \cdot (b + c) = a \cdot b + a \cdot c \qquad a \cdot (b - c) = a \cdot b - a \cdot c \quad (b \geq c)$$

Elemento neutro, $0$ per l'addizione e $1$ per la moltiplicazione:

$$a + 0 = 0 + a = a \qquad a \cdot 1 = 1 \cdot a = a$$

Elemento assorbente: $a \cdot 0 = 0 \cdot a = 0$. Legge di annullamento del prodotto: se un prodotto è $0$, almeno uno dei fattori è $0$.

## Proprietà di sottrazione e divisione

Invariantiva della sottrazione (quando si toglie, $n$ non supera il sottraendo):

$$a - b = (a + n) - (b + n) = (a - n) - (b - n)$$

Invariantiva della divisione ($n \neq 0$; quando si divide, $n$ divide esattamente entrambi):

$$a : b = (a \cdot n) : (b \cdot n) = (a : n) : (b : n)$$

Per esempio $1000 - 297 = 1003 - 300 = 703$ e $350 : 50 = 35 : 5 = 7$.

Distributiva della divisione, solo con la somma al dividendo ($c$ divide esattamente $a$ e $b$):

$$(a + b) : c = a : c + b : c$$

| Proprietà | Addizione | Sottrazione | Moltiplicazione | Divisione |
|---|---|---|---|---|
| Interna in $\mathbb{N}$ | sì | no | sì | no |
| Commutativa | sì | no | sì | no |
| Associativa e dissociativa | sì | no | sì | no |
| Invariantiva | no | sì | no | sì |
| Distributiva | no | no | rispetto a $+$ e $-$ | solo a destra, rispetto a $+$ e $-$ |
| Elemento neutro | $0$ | nessuno | $1$ | nessuno |

## Lo zero nella divisione

- $0 : n = 0$ per ogni $n \neq 0$.
- $n : 0$ con $n \neq 0$ è impossibile.
- $0 : 0$ è indeterminata.

## Divisione con resto

Con $b \neq 0$, quoziente $q$ e resto $r$ sono gli unici naturali tali che

$$a = b \cdot q + r \qquad \text{con } 0 \leq r < b$$

Per esempio $47 = 5 \cdot 9 + 2$. Se $r = 0$ la divisione è esatta e $b$ è un divisore di $a$.

## Ordine delle operazioni

1. Parentesi dalle più interne: prima le tonde, poi le quadre, infine le graffe.
2. Prima le potenze, poi moltiplicazioni e divisioni, infine addizioni e sottrazioni.
3. A pari priorità, da sinistra a destra.
4. Una parentesi con un solo numero si toglie.

```ad-warning
Stessa priorità, da sinistra a destra
$24 : 4 \cdot 2 = 6 \cdot 2 = 12$, non $24 : 8 = 3$.
```

```ad-warning
Distribuire la divisione sul divisore
$24 : (4 + 2) = 4$, mentre $24 : 4 + 24 : 2 = 18$.
```

```ad-warning
Dividere per zero
$5 : 0$ è impossibile; è $0 : 5$ che fa $0$.
```
