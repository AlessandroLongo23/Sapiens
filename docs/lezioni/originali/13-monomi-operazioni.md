# Operazioni tra monomi

## Richiamo: forma canonica e termini simili

Un monomio è in **forma canonica** quando è scritto come prodotto tra un coefficiente numerico e le lettere con esponenti interi non negativi, con lettere ordinate (ad es. in ordine alfabetico).

Due monomi sono **simili** se hanno la stessa parte letterale (stesse lettere con gli stessi esponenti). Esempi:

- $3x^2y$ e $-\dfrac{1}{2}x^2y$ sono simili
- $5ab^2$ e $5a^2b$ non sono simili (gli esponenti non coincidono)

---

## Somma e sottrazione (solo tra termini simili)

Si sommano/sottraggono i **coefficienti**, lasciando invariata la parte letterale.

Esempi:

- $3x^2y - 5x^2y = (3-5)x^2y = -2x^2y$
- $\dfrac{1}{4}ab^3 + \dfrac{3}{4}ab^3 = ab^3$

Se i monomi non sono simili, la somma resta una somma (non si può ridurre a un unico monomio):

- $2x^2 + 3x \neq 5x^2$ (non simili)

---

## Prodotto di monomi

Si moltiplicano i coefficienti e si **sommano gli esponenti** delle lettere uguali.

Regola generale:

$$ (\alpha x^{a}y^{b}\cdots)\cdot(\beta x^{c}y^{d}\cdots) = (\alpha\beta)\,x^{a+c}y^{b+d}\cdots $$

Esempi:

- $(2x^3y)\cdot(-4xy^2) = -8x^{3+1}y^{1+2} = -8x^4y^3$
- $\left(-\dfrac{3}{5}ab^2\right)\cdot\left(\dfrac{10}{3}a^2b\right) = -2a^{1+2}b^{2+1} = -2a^3b^3$

---

## Quoziente di monomi (divisione esatta)

È possibile quando, per ogni lettera, l’esponente al numeratore è maggiore o uguale dell’esponente al denominatore. Si dividono i coefficienti e si **sottraggono** gli esponenti delle stesse lettere.

Regola generale:

$$ \dfrac{\alpha x^{a}y^{b}\cdots}{\beta x^{c}y^{d}\cdots} = \left(\dfrac{\alpha}{\beta}\right) x^{a-c}y^{b-d}\cdots $$

Esempi:

- $\dfrac{6x^5y^2}{-3x^2y} = -2x^{5-2}y^{2-1} = -2x^3y$
- $\dfrac{-12a^4b}{3ab^2} = -4a^{4-1}b^{1-2} = -4a^3b^{-1}$ → non è un monomio (esponente negativo). La divisione non è ammessa nel contesto dei monomi.

---

## Potenza di un monomio

Si eleva il coefficiente a potenza e si **moltiplicano** gli esponenti delle lettere per l’esponente esterno.

Regola generale:

$$ (\alpha x^{a}y^{b}\cdots)^n = \alpha^{\,n}x^{an}y^{bn}\cdots \quad (n\in\mathbb{N}) $$

Esempi:

- $( -3x^2y )^3 = -27x^{6}y^{3}$
- $\left(\dfrac{1}{2}ab^3\right)^2 = \dfrac{1}{4}a^2b^6$

---

## Segno e semplificazioni

- Il segno del prodotto/quotiente dipende dalla regola dei segni sui coefficienti.
- È buona pratica scrivere il risultato in forma canonica: coefficiente davanti, lettere ordinate, frazioni semplificate.

Esempio: $\dfrac{-18x^2y}{12xy^3} = -\dfrac{3}{2}\,x^{2-1}y^{1-3} = -\dfrac{3}{2}\,xy^{-2}$ → non monomio. Se invece $\dfrac{-18x^2y^3}{12xy^3} = -\dfrac{3}{2}\,x$ (forma canonica).

---

## Riepilogo rapido

- **Somma**: solo tra simili, si sommano i coefficienti
- **Prodotto**: si sommano gli esponenti delle stesse lettere
- **Quoziente**: si sottraggono gli esponenti; ammesso solo se restano non negativi
- **Potenza**: si moltiplicano gli esponenti; si eleva il coefficiente


