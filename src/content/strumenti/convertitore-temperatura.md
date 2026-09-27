# Conversione di temperatura: Celsius, Fahrenheit e Kelvin

## Che cosa sono le tre scale

Le scale di temperatura differiscono per due cose: dove mettono lo zero e quanto è grande un grado.

- La scala Celsius mette lo 0 dove l'acqua ghiaccia e il 100 dove bolle, a livello del mare.
- La scala Kelvin, quella del Sistema Internazionale, ha i gradi grandi come quelli Celsius ma parte dallo zero assoluto, la temperatura più bassa possibile: $0\ \text{K} = -273{,}15\ {}^\circ\text{C}$. Per questo in Kelvin non ci sono numeri negativi, e si scrive K senza il simbolo di grado.
- La scala Fahrenheit, usata negli Stati Uniti, mette il ghiaccio fondente a $32\ {}^\circ\text{F}$ e l'acqua che bolle a $212\ {}^\circ\text{F}$: tra i due ci sono 180 gradi Fahrenheit contro 100 Celsius, quindi un grado Celsius vale $\frac{180}{100} = \frac{9}{5}$ di grado Fahrenheit.

## Come si fa a mano

Le formule sono tre, e le altre si ricavano girandole:

$$T_K = T_C + 273{,}15 \qquad T_F = T_C \cdot \frac{9}{5} + 32 \qquad T_C = (T_F - 32) \cdot \frac{5}{9}$$

```ad-example
Esempio: da Celsius a Fahrenheit
$100\ {}^\circ\text{C}$ diventano $100 \cdot \frac{9}{5} + 32 = 180 + 32 = 212\ {}^\circ\text{F}$.
```

```ad-example
Esempio: da Fahrenheit a Kelvin
Passa per i Celsius. $212\ {}^\circ\text{F}$ sono $(212 - 32) \cdot \frac{5}{9} = 100\ {}^\circ\text{C}$, e quindi $100 + 273{,}15 = 373{,}15\ \text{K}$.
```

Una temperatura sotto lo zero assoluto non esiste: $-300\ {}^\circ\text{C}$ o $-5\ \text{K}$ sono errori, e il convertitore lo segnala.

```ad-error
Errori frequenti
- Nella formula da Fahrenheit a Celsius, moltiplicare per $\frac{5}{9}$ prima di togliere 32: la sottrazione va fatta per prima, dentro la parentesi.
- Scambiare $\frac{9}{5}$ e $\frac{5}{9}$: verso i Fahrenheit il numero cresce di più, quindi si moltiplica per $\frac{9}{5}$, che è maggiore di 1.
- Arrotondare 273,15 a 273 in un esercizio di fisica che chiede i decimali.
```

## Domande frequenti

### A quale temperatura Celsius e Fahrenheit coincidono?

A $-40$ gradi: $-40 \cdot \frac{9}{5} + 32 = -72 + 32 = -40$. È l'unico punto in cui le due scale segnano lo stesso numero.

### Perché si scrive K e non °K?

Perché il kelvin è un'unità del Sistema Internazionale come il metro o il secondo, e dal 1967 si scrive senza il simbolo di grado: $300\ \text{K}$ si legge "trecento kelvin".

### Qual è la temperatura normale del corpo in Fahrenheit?

Circa $37\ {}^\circ\text{C}$, cioè $37 \cdot \frac{9}{5} + 32 = 98{,}6\ {}^\circ\text{F}$.
