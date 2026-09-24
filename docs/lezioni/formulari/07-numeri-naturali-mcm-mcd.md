# Formulario: MCD e MCM in ℕ

## MCD e MCM con la scomposizione

Il MCD è il più grande numero che divide tutti i numeri dati; il MCM è il più piccolo numero diverso da zero che è multiplo di tutti.

| | MCD | MCM |
|---|---|---|
| Fattori | solo i comuni | comuni e non comuni |
| Esponente | il più piccolo | il più grande |
| $84 = 2^2 \cdot 3 \cdot 7$, $120 = 2^3 \cdot 3 \cdot 5$ | $2^2 \cdot 3 = 12$ | $2^3 \cdot 3 \cdot 5 \cdot 7 = 840$ |

Se non ci sono fattori comuni, il MCD è $1$.

## Algoritmo di Euclide

Se $a = b \cdot q + r$ è la divisione con resto, allora

$$\text{MCD}(a, b) = \text{MCD}(b, r)$$

1. Dividi $a$ per $b$ (con $a \geq b > 0$) e trova il resto $r$.
2. Se $r = 0$, il MCD è $b$.
3. Se $r \neq 0$, passa alla coppia $(b, r)$ e torna al passo 1.

## Legame tra MCD e MCM

Per due numeri $a$ e $b$ diversi da zero:

$$\text{MCD}(a, b) \cdot \text{MCM}(a, b) = a \cdot b \qquad \text{MCM}(a, b) = \frac{a \cdot b}{\text{MCD}(a, b)}$$

Due numeri sono primi tra loro quando il loro MCD è $1$; in quel caso il MCM è il prodotto: $\text{MCM}(8, 15) = 120$.

## MCD o MCM nei problemi

Serve il MCD per la misura più grande che sta un numero intero di volte in due quantità (dividere, tagliare in parti uguali); serve il MCM per il primo momento in cui due fenomeni ripetuti si ritrovano insieme.

```ad-warning
Scambiare le regole
Il MCD non supera il più piccolo dei numeri, il MCM non è più piccolo del più grande.
```

```ad-warning
Scomporre con fattori non primi
$36 = 4 \cdot 9$ non è una scomposizione in fattori primi: serve $36 = 2^2 \cdot 3^2$.
```

```ad-warning
Usare la formula con tre numeri
$\text{MCD} \cdot \text{MCM} = a \cdot b$ vale solo per due numeri.
```
