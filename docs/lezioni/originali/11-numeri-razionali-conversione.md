# Conversione da numeri decimali a frazioni

## Introduzione

Ogni **numero decimale** può essere convertito in una **frazione**. I decimali e le frazioni sono due modi diversi di rappresentare lo stesso valore numerico.

Esistono tre tipi principali di numeri decimali:
- **Decimali finiti** (terminanti): hanno un numero limitato di cifre dopo la virgola
- **Decimali periodici semplici**: hanno solo la parte periodica
- **Decimali periodici misti**: hanno antiperiodo e periodo

---

## Caso 1: Decimali finiti (terminanti)

I **decimali finiti** sono numeri che hanno un numero limitato di cifre dopo la virgola.

**Esempi:** $0,75$, $0,625$, $2,35$, $0,108$

### Metodo di conversione

**Passo 1:** Il numeratore corrisponde al decimale senza la virgola

**Passo 2:** Il denominatore è un $1$ con tanti $0$ quante sono le cifre dopo la virgola

**Passo 3:** Semplifica la frazione

### Esempi

**Esempio 1:** Converti $0,75$ in frazione

Il numeratore è $75$, mentre al denominatore abbiamo $1$ seguito da due $0$:
$$\dfrac{75}{100}$$

Semplifico dividendo per $\text{MCD}(75, 100) = 25$
$$\dfrac{75}{100} = \dfrac{75 \div 25}{100 \div 25} = \dfrac{3}{4}$$

**Risultato:** $0,75 = \dfrac{3}{4}$

---

**Esempio 2:** Converti $1,625$ in frazione

Il numeratore è $1625$, mentre al denominatore abbiamo $1$ seguito da tre $0$:
$$\dfrac{1625}{1000}$$

Semplifico dividendo per $\text{MCD}(625, 1000) = 125$
$$\dfrac{1625}{1000} = \dfrac{1625 \div 125}{1000 \div 125} = \dfrac{13}{8}$$

**Risultato:** $1,625 = \dfrac{13}{8}$

---

**Esempio 3:** Converti $2,35$ in frazione

Il numeratore è $235$, mentre al denominatore abbiamo $1$ seguito da due $0$:
$$\dfrac{235}{100}$$

Semplifico dividendo per $\text{MCD}(235, 100) = 5$
$$\dfrac{235}{100} = \dfrac{235 / 5}{100 / 5} = \dfrac{27}{20}$$

**Risultato:** $2,35 = \dfrac{27}{20}$

---

## Caso 2: Decimali periodici semplici

I **decimali periodici semplici** hanno solo la parte periodica, senza antiperiodo.

**Esempi:** $0,\overline{3} = 0,333...$, $0,\overline{6} = 0,666...$, $0,\overline{45} = 0,454545...$

### Metodo di conversione

**Passo 1:** Il numeratore corrisponde al decimale, scritto senza virgole

**Passo 2:** Il denominatore si compone di tanti $9$ quante sono le cifre che compongono il periodo

**Passo 3:** Semplifica la frazione

### Esempi

**Esempio 1:** Converti $0,\overline{3}$ in frazione

$$0,\overline{3} = \dfrac{3}{9}$$

---

**Esempio 2:** Converti $1,\overline{45}$ in frazione

$$1,\overline{45} = \dfrac{145}{99}$$

---

## Caso 3: Decimali periodici misti

I **decimali periodici misti** hanno sia antiperiodo che periodo.

**Esempi:** $0,1\overline{6} = 0,1666...$, $0,25\overline{3} = 0,25333...$

L'**antiperiodo** è la parte non ripetitiva dopo la virgola.
Il **periodo** è la parte che si ripete.

### Metodo di conversione

Per convertirlo, si seguono gli stessi passi dei periodici semplici, con delle piccole modifiche (in grassetto):

**Passo 1:** Il numeratore corrisponde al decimale, scritto senza virgole, **meno la parte non periodica**

**Passo 2:** Il denominatore si compone di tanti $9$ quante sono le cifre che compongono il periodo **e tanti $0$ quante sono le cifre dell'antiperiodo**

**Passo 3:** Semplifica la frazione

### Esempi

**Esempio 1:** Converti $0,1\overline{6}$ in frazione

$$0.1\overline{6} = \dfrac{16 - 1}{90} = \dfrac{15}{90} = \dfrac{1}{6}$$

---

**Esempio 2:** Converti $0,25\overline{3}$ in frazione

$$0.25\overline{3} = \dfrac{253 - 25}{900} = \dfrac{228}{900} = \dfrac{19}{75}$$

**Risultato:** $0,25\overline{3} = \dfrac{19}{75}$

---

## Verifica della conversione

Per verificare se la conversione è corretta, **dividi il numeratore per il denominatore** e controlla se ottieni il decimale originale.

**Esempio:** Verifica che $\dfrac{3}{4} = 0,75$
$$3 \div 4 = 0,75 \quad \checkmark$$
