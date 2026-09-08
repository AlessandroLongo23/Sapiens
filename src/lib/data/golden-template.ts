/** The reference lesson every generated draft must follow, section by section. */
export const GOLDEN_TEMPLATE = `
# Equazioni di Secondo Grado

## 1. Definizione
Un’**equazione di secondo grado** è un’uguaglianza che contiene una variabile (ad esempio $x$) elevata **al massimo alla seconda potenza**.  
La forma generale è:

$$
ax^2 + bx + c = 0
$$

dove:
- $a$, $b$, $c$ sono **numeri reali** (con $a \neq 0$),
- $x$ è l’**incognita**.

---

## 2. Obiettivo
Trovare i valori di $x$ che rendono vera l’equazione, cioè le **soluzioni** (o radici).

---

## 3. Formula Risolutiva (Formula del Delta)

Per risolvere si usa la **formula quadratica**, che dipende dal **discriminante** (o **Delta**), indicato con la lettera greca $\Delta$:

$$
\Delta = b^2 - 4ac
$$

Le soluzioni si trovano con:

$$
x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}
$$

dove:
- $x_1$ si ottiene con il **segno +**,
- $x_2$ si ottiene con il **segno −**.

---

## 4. Numero di Soluzioni in base a $\Delta$

Il valore di $\Delta$ determina quante soluzioni reali ha l’equazione:

| Valore di $\Delta$ | Tipo di Soluzioni | Descrizione |
|--------------------|------------------|-------------|
| $\Delta > 0$ | **Due soluzioni reali e distinte** | Due numeri diversi |
| $\Delta = 0$ | **Una soluzione reale doppia** | Le due radici coincidono |
| $\Delta < 0$ | **Nessuna soluzione reale** | Le soluzioni sono numeri complessi |

---

## 5. Esempi Svolti

### Esempio 1: due soluzioni ($\Delta > 0$)
$$
x^2 - 5x + 6 = 0
$$

1. Identifica $a=1$, $b=-5$, $c=6$.
2. Calcola $\Delta$:
   $$
   \Delta = (-5)^2 - 4 \cdot 1 \cdot 6 = 25 - 24 = 1
   $$
   ($\Delta > 0$ → due soluzioni).
3. Applica la formula:
   $$
   x_{1,2} = \frac{-(-5) \pm \sqrt{1}}{2 \cdot 1}
   $$
   $$
   x_{1,2} = \frac{5 \pm 1}{2}
   $$
4. Calcola:
   $$
   x_1 = \frac{5 + 1}{2} = 3, \quad x_2 = \frac{5 - 1}{2} = 2
   $$

**Soluzioni**: $x_1 = 3$, $x_2 = 2$

---

### Esempio 2: una soluzione doppia ($\Delta = 0$)
$$
x^2 + 4x + 4 = 0
$$

1. $a=1$, $b=4$, $c=4$
2. $\Delta = 4^2 - 4 \cdot 1 \cdot 4 = 16 - 16 = 0$
3. Formula:
   $$
   x = \frac{-4}{2 \cdot 1} = -2
   $$

**Soluzione doppia**: $x = -2$

---

### Esempio 3: nessuna soluzione reale ($\Delta < 0$)
$$
x^2 + x + 1 = 0
$$

1. $a=1$, $b=1$, $c=1$
2. $\Delta = 1^2 - 4 \cdot 1 \cdot 1 = 1 - 4 = -3$
3. Poiché $\Delta < 0$, non esistono soluzioni reali.

**Nessuna soluzione reale** (le soluzioni sono complesse).

---

## 6. Caso Particolare: Equazioni Pure e Spuria
A volte mancano alcuni termini:

- **Equazione pura**: manca $b$  
  Esempio: $x^2 - 9 = 0$  
  Risolvi come $x^2 = 9$ → $x = \pm 3$.

- **Equazione spuria**: manca $c$  
  Esempio: $x^2 - 4x = 0$  
  Metti in evidenza $x$: $x(x - 4) = 0$ → $x = 0$ oppure $x = 4$.

---

## 7. Consigli Utili
- Controlla sempre le soluzioni sostituendole nell’equazione originale.
- Se $\Delta$ è un quadrato perfetto (es. 1, 4, 9...), le soluzioni sono **numeri interi o razionali**.
- Se $\Delta$ non è un quadrato perfetto ma positivo, le soluzioni saranno **numeri decimali o frazioni**.

---

## Riassunto
1. Scrivi l’equazione nella forma $ax^2 + bx + c = 0$.  
2. Calcola il **discriminante** $\Delta = b^2 - 4ac$.  
3. Se:
   - $\Delta > 0$ → due soluzioni: $x_{1,2} = \dfrac{-b \pm \sqrt{\Delta}}{2a}$
   - $\Delta = 0$ → una soluzione doppia: $x = \dfrac{-b}{2a}$
   - $\Delta < 0$ → nessuna soluzione reale.

`;
