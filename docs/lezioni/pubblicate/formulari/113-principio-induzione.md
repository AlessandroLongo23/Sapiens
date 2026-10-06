# Formulario: Principio di induzione

## Il principio

$P(n)$ è un enunciato aperto in cui $n$ è un numero naturale. Se

1. $P(1)$ è vera (base dell'induzione);
2. per ogni $k \geq 1$, $P(k) \Rightarrow P(k + 1)$ (passo induttivo);

allora $P(n)$ è vera per ogni $n \geq 1$.

- Ipotesi induttiva: $P(k)$, l'ipotesi del passo induttivo.
- Base diversa da $1$: se $P(n_0)$ è vera e il passo induttivo vale per ogni $k \geq n_0$, allora $P(n)$ è vera per ogni $n \geq n_0$.
- Qualche verifica riuscita non è una dimostrazione: $n^2 + n + 41$ è primo per $n$ da $1$ a $39$, ma per $n = 40$ vale $41^2$.

## Come si scrive la dimostrazione

1. Enunciato $P(n)$ e primo valore di $n$.
2. Base: verifica con un conto per il primo valore.
3. Ipotesi induttiva: $P(k)$, supposta vera.
4. Tesi: $P(k + 1)$, con $k + 1$ al posto di $n$.
5. Passo induttivo: da un membro della tesi all'altro, usando l'ipotesi induttiva.
6. Conclusione: per il principio di induzione $P(n)$ vale per ogni $n$ dal primo valore in poi.

## Che cosa si usa nel passo induttivo

| Tipo di enunciato | Mossa |
|---|---|
| somma | i primi $k$ termini sono la somma dell'ipotesi induttiva, più il termine di posto $k + 1$ |
| divisibilità | espressione con $k + 1$ = espressione con $k$ + un multiplo evidente del divisore |
| successione ricorsiva | la legge di ricorrenza, con $a_k$ dato dall'ipotesi induttiva |
| disuguaglianza | l'ipotesi induttiva dà una prima disuguaglianza, una seconda porta alla tesi |

## Formule dimostrate nella lezione

$$1 + 2 + 3 + \dots + n = \frac{n(n + 1)}{2}$$

$$1 + 3 + 5 + \dots + (2n - 1) = n^2$$

$$1^2 + 2^2 + 3^2 + \dots + n^2 = \frac{n(n + 1)(2n + 1)}{6}$$

- $n^3 + 2n$ è divisibile per $3$, per ogni $n \geq 1$.
- $2^n > 2n + 1$, per ogni $n \geq 3$.
- Disuguaglianza di Bernoulli: $(1 + x)^n \geq 1 + nx$, per $x > -1$ e per ogni $n \geq 1$.

```ad-warning
Il passo induttivo senza la base
Per "$n^2 + n$ è dispari" il passo induttivo riesce, ma l'enunciato è falso: per $n = 1$ vale $2$.
```

```ad-warning
Come si scrive P(k + 1) per una somma
A sinistra si aggiunge il termine di posto $k + 1$; a destra $k + 1$ sostituisce $n$ dappertutto.
```

```ad-warning
Non partire dalla tesi
Trasformare $P(k + 1)$ fino a un'identità usa quello che si deve dimostrare: parti da un membro e arriva all'altro.
```
