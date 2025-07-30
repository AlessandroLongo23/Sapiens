# Potenze con esponente negativo

## Definizione

Una **potenza con esponente negativo** è l'inverso della potenza con esponente positivo corrispondente.

Per qualsiasi numero $a \neq 0$ e per qualsiasi numero naturale $n$:

$$a^{-n} = \dfrac{1}{a^n}$$

In altre parole, una potenza con esponente negativo diventa una **frazione** dove:
- Il **numeratore** è 1
- Il **denominatore** è la potenza con esponente positivo

---

## Come si calcola

### Metodo diretto

$$a^{-n} = \dfrac{1}{a^n} = \dfrac{1}{\underbrace{a \cdot a \cdot a \cdot \dots \cdot a}_{n \text{ volte}}}$$

### Esempi di base

**Esempio 1:**  
$2^{-3} = \dfrac{1}{2^3} = \dfrac{1}{8}$

**Esempio 2:**  
$5^{-2} = \dfrac{1}{5^2} = \dfrac{1}{25}$

**Esempio 3:**  
$3^{-1} = \dfrac{1}{3^1} = \dfrac{1}{3}$

**Esempio 4:**  
$10^{-4} = \dfrac{1}{10^4} = \dfrac{1}{10000} = 0,0001$

---

## Potenze di frazioni con esponente negativo

Quando la base è una frazione, l'esponente negativo **capovolge** la frazione:

$$\left(\dfrac{a}{b}\right)^{-n} = \left(\dfrac{b}{a}\right)^n = \dfrac{b^n}{a^n}$$

### Esempi

**Esempio 1:**  
$\left(\dfrac{2}{3}\right)^{-2} = \left(\dfrac{3}{2}\right)^2 = \dfrac{3^2}{2^2} = \dfrac{9}{4}$

**Esempio 2:**  
$\left(\dfrac{4}{5}\right)^{-1} = \left(\dfrac{5}{4}\right)^1 = \dfrac{5}{4}$

**Esempio 3:**  
$\left(\dfrac{1}{7}\right)^{-3} = \left(\dfrac{7}{1}\right)^3 = 7^3 = 343$

---

## Proprietà delle potenze con esponenti negativi

Le **stesse proprietà** delle potenze con esponenti positivi valgono anche per gli esponenti negativi.

### 1. Moltiplicazione di potenze con la stessa base

$$a^{-m} \cdot a^{-n} = a^{-m + (-n)} = a^{-(m+n)}$$

**Esempio:**  
$2^{-3} \cdot 2^{-2} = 2^{-3-2} = 2^{-5} = \dfrac{1}{2^5} = \dfrac{1}{32}$

---

### 2. Divisione di potenze con la stessa base

$$\dfrac{a^{-m}}{a^{-n}} = a^{-m - (-n)} = a^{-m+n} = a^{n-m}$$

**Esempio:**  
$\dfrac{3^{-4}}{3^{-2}} = 3^{-4-(-2)} = 3^{-4+2} = 3^{-2} = \dfrac{1}{9}$

---

### 3. Potenza di una potenza

$$(a^{-m})^n = a^{(-m) \cdot n} = a^{-mn}$$

**Esempio:**  
$(2^{-3})^2 = 2^{(-3) \cdot 2} = 2^{-6} = \dfrac{1}{64}$

---

### 4. Moltiplicazione e divisione con esponenti misti

$$a^m \cdot a^{-n} = a^{m + (-n)} = a^{m-n}$$

**Esempio:**  
$5^4 \cdot 5^{-2} = 5^{4-2} = 5^2 = 25$

$$\dfrac{a^m}{a^{-n}} = a^{m - (-n)} = a^{m+n}$$

**Esempio:**  
$\dfrac{7^3}{7^{-2}} = 7^{3-(-2)} = 7^{3+2} = 7^5 = 16807$

---

## Casi particolari

### Esponente -1

Qualsiasi numero diverso da zero elevato a -1 diventa il suo **reciproco**:

$$a^{-1} = \dfrac{1}{a}$$

**Esempi:**
- $8^{-1} = \dfrac{1}{8}$
- $\left(\dfrac{3}{4}\right)^{-1} = \dfrac{4}{3}$

### Base 10

Le potenze di 10 con esponente negativo sono molto utili per i numeri decimali:

- $10^{-1} = 0,1$
- $10^{-2} = 0,01$  
- $10^{-3} = 0,001$
- $10^{-n} = 0,\underbrace{00\dots0}_{n-1 \text{ zeri}}1$

---

## Esempi di calcolo complesso

**Esempio 1:**  
Calcola $\dfrac{2^{-3} \cdot 2^5}{2^{-1}}$

$$\dfrac{2^{-3} \cdot 2^5}{2^{-1}} = \dfrac{2^{-3+5}}{2^{-1}} = \dfrac{2^2}{2^{-1}} = 2^{2-(-1)} = 2^{2+1} = 2^3 = 8$$

**Esempio 2:**  
Calcola $\left(\dfrac{3^{-2}}{3^{-4}}\right)^{-1}$

$$\left(\dfrac{3^{-2}}{3^{-4}}\right)^{-1} = \left(3^{-2-(-4)}\right)^{-1} = \left(3^{-2+4}\right)^{-1} = \left(3^2\right)^{-1} = 3^{2 \cdot (-1)} = 3^{-2} = \dfrac{1}{9}$$

**Esempio 3:**  
Semplifica $\left(\dfrac{2}{5}\right)^{-3} \cdot \left(\dfrac{5}{2}\right)^2$

$$\left(\dfrac{2}{5}\right)^{-3} \cdot \left(\dfrac{5}{2}\right)^2 = \left(\dfrac{5}{2}\right)^3 \cdot \left(\dfrac{5}{2}\right)^2 = \left(\dfrac{5}{2}\right)^{3+2} = \left(\dfrac{5}{2}\right)^5 = \dfrac{5^5}{2^5} = \dfrac{3125}{32}$$
