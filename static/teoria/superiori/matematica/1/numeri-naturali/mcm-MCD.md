# MCM e MCD

## MCD - Massimo Comune Divisore

Il **Massimo Comune Divisore (MCD)** tra due o più numeri è il **più grande numero** che divide **tutti** quei numeri senza lasciare resto.

### Come si calcola

#### Metodo 1: Scomposizione in fattori primi

1. Scomporre ogni numero in fattori primi.
2. Prendere **solo i fattori comuni** con **l’esponente più basso**.
3. Moltiplicarli.

**Esempio:**  
Trova $\text{MCD}(18, 24)$

- $18 = 2 \cdot 3^2$  
- $24 = 2^3 \cdot 3$

Fattori comuni: $2$, $3$  
Minimi esponenti: $2^1$, $3^1$

$$\text{MCD}(18, 24) = 2 \cdot 3 = 6$$

#### Metodo 2: Algoritmo di Euclide

Ripetutamente sostituire i due numeri con il resto della loro divisione, finché il resto è zero.

**Esempio:**  
$\text{MCD}(18, 24)$

- $24 \div 18 = 1$ resto **6**
- $18 \div 6 = 3$ resto **0**

$\Rightarrow \text{MCD} = 6$

---

## MCM - Minimo Comune Multiplo

Il **Minimo Comune Multiplo (MCM)** tra due o più numeri è il **più piccolo numero** multiplo **comune a tutti** quei numeri.

### Come si calcola

#### Metodo 1: Scomposizione in fattori primi

1. Scomporre ogni numero in fattori primi.
2. Prendere **tutti i fattori presenti** con **l’esponente più alto**.
3. Moltiplicarli.

**Esempio:**  
Trova $\text{MCM}(18, 24)$

- $18 = 2 \cdot 3^2$  
- $24 = 2^3 \cdot 3$

Fattori: $2^3$, $3^2$

$$\text{MCM}(18, 24) = 2^3 \cdot 3^2 = 8 \cdot 9 = 72$$

#### Metodo 2: Formula con MCD

$$\text{MCM}(a, b) = \frac{a \cdot b}{\text{MCD}(a, b)}$$

**Esempio:**  
$$\text{MCM}(18, 24) = \frac{18 \cdot 24}{6} = \frac{432}{6} = 72$$
