# MCM e MCD tra monomi

## Definizioni

Sia dato un insieme di monomi (con esponenti interi non negativi):

- Il **Massimo Comun Divisore (MCD)** è il monomio di grado massimo che divide tutti i monomi dati.
- Il **Minimo Comune Multiplo (MCM)** è il monomio di grado minimo che è multiplo di tutti i monomi dati.

Per calcolarli si opera separatamente su **coefficiente** e **parte letterale**.

---

## Regole di calcolo

Siano $m_1, m_2, \dots$ monomi. Scriviamo ogni monomio in forma canonica: coefficiente $\alpha$ (in valore assoluto) e lettere con i rispettivi esponenti.

### 1) Parte numerica (coefficienti)

- Per il **MCD** si prende il $\text{MCD}$ tra i valori assoluti dei coefficienti.
- Per il **MCM** si prende il $\text{MCM}$ tra i valori assoluti dei coefficienti.

Il segno è di solito assunto positivo sia per MCD sia per MCM.

### 2) Parte letterale

Per ciascuna lettera che compare in almeno un monomio:

- Per il **MCD** si prende l’**esponente minimo** con cui la lettera compare.
- Per il **MCM** si prende l’**esponente massimo** con cui la lettera compare.

Lettere assenti in un monomio si considerano con esponente $0$.

---

## Esempi

### Esempio 1

Trova $\text{MCD}$ e $\text{MCM}$ tra $m_1=12x^3y^2$ e $m_2=18x^2y^5$.

- Coefficienti: $\text{MCD}(12,18)=6$, $\text{MCM}(12,18)=36$.
- Lettere:
  - Per $x$: min$(3,2)=2$, max$(3,2)=3$
  - Per $y$: min$(2,5)=2$, max$(2,5)=5$

Quindi:

$$ \text{MCD}(m_1,m_2)=6x^2y^2 \qquad \text{MCM}(m_1,m_2)=36x^3y^5 $$

---

### Esempio 2

Trova $\text{MCD}$ e $\text{MCM}$ tra $m_1=\dfrac{3}{2}a^4b$, $\; m_2=\dfrac{9}{4}a^2b^3$, $\; m_3=\dfrac{1}{8}ab$.

- Coefficienti (in valore assoluto): $\text{MCD}\left(\dfrac{3}{2},\dfrac{9}{4},\dfrac{1}{8}\right)=\dfrac{1}{8}$, $\; \text{MCM}\left(\dfrac{3}{2},\dfrac{9}{4},\dfrac{1}{8}\right)=\dfrac{9}{1}=9$.
- Lettere:
  - $a$: min$(4,2,1)=1$, max$(4,2,1)=4$
  - $b$: min$(1,3,1)=1$, max$(1,3,1)=3$

Quindi:

$$ \text{MCD}=\dfrac{1}{8}ab \qquad \text{MCM}=9a^4b^3 $$

---

## Applicazioni tipiche

- **Semplificazione di frazioni algebriche**: si divide numeratore e denominatore per il MCD dei monomi.
- **Riduzione al denominatore comune**: in somme di frazioni algebriche, il denominatore comune è l’MCM dei denominatori (monomi).

Esempio: $\dfrac{5x^2y}{6xy^3} = \dfrac{5}{6}\cdot \dfrac{x^{2-1}}{y^{3-1}} = \dfrac{5}{6}\cdot \dfrac{x}{y^2}$ dopo aver tolto il **MCD** $= x y$.

---

## Riepilogo rapido

- $\textbf{MCD}$: minimi esponenti, MCD dei coefficienti
- $\textbf{MCM}$: massimi esponenti, MCM dei coefficienti
- Il segno si assume positivo; scrivere sempre i risultati in forma canonica


