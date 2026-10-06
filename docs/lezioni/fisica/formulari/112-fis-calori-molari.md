# Formulario: I calori molari dei gas

## Calore molare

Calore per scaldare di un kelvin una mole, in $\text{J/(mol}\cdot\text{K)}$:

$$C = \frac{Q}{n\,\Delta T} \qquad Q = n\,C\,\Delta T$$

- Legame con il calore specifico: $C = c\,M$, con $M$ la massa molare in kg/mol.
- Dalla massa alle moli: $n = m / M$.
- $\Delta T$ è lo stesso in kelvin e in gradi Celsius.

## A volume costante e a pressione costante

| | A volume costante | A pressione costante |
|---|---|---|
| calore | $Q = n\,C_V\,\Delta T$ | $Q = n\,C_p\,\Delta T$ |
| lavoro | $W = 0$ | $W = p\,\Delta V = nR\,\Delta T$ |
| energia interna | $\Delta U = n\,C_V\,\Delta T$ | $\Delta U = n\,C_V\,\Delta T$ |

Per ogni trasformazione di un gas perfetto:

$$\Delta U = n\,C_V\,\Delta T$$

## Legame tra i due calori molari

Relazione di Mayer:

$$C_p = C_V + R \qquad R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$$

## Gradi di libertà

Equipartizione: a ogni grado di libertà $\tfrac{1}{2} k_B T$ per molecola, $\tfrac{1}{2} RT$ per mole. Con $\ell$ gradi di libertà:

$$U = \frac{\ell}{2}\,nRT \qquad C_V = \frac{\ell}{2}\,R \qquad C_p = \frac{\ell + 2}{2}\,R \qquad \gamma = \frac{C_p}{C_V} = \frac{\ell + 2}{\ell}$$

| Gas perfetto | $\ell$ | $C_V$ | $C_p$ | $\gamma$ |
|---|---|---|---|---|
| monoatomico (He, Ne, Ar) | $3$ | $\tfrac{3}{2} R = 12{,}5$ | $\tfrac{5}{2} R = 20{,}8$ | $\tfrac{5}{3} \approx 1{,}67$ |
| biatomico ($\text{H}_2$, $\text{N}_2$, $\text{O}_2$, aria) | $5$ | $\tfrac{5}{2} R = 20{,}8$ | $\tfrac{7}{2} R = 29{,}1$ | $\tfrac{7}{5} = 1{,}40$ |

Calori molari in $\text{J/(mol}\cdot\text{K)}$.

## Come si divide il calore a pressione costante

$$\frac{\Delta U}{Q} = \frac{C_V}{C_p} \qquad \frac{W}{Q} = \frac{R}{C_p}$$

- Monoatomico: $\tfrac{3}{5}$ in energia interna, $\tfrac{2}{5}$ in lavoro.
- Biatomico: $\tfrac{5}{7}$ in energia interna, $\tfrac{2}{7}$ in lavoro.

## Procedimento

1. Il gas è monoatomico o biatomico?
2. Che cosa resta costante, il volume o la pressione?
3. Se è data la massa, trova le moli con $n = m / M$.
4. Calore con $C_V$ o $C_p$; energia interna sempre con $C_V$.

```ad-warning
$C_V$ per l'energia interna, sempre
$\Delta U = n\,C_V\,\Delta T$ vale anche a pressione costante; è $Q = n\,C_V\,\Delta T$ che vale solo a volume costante.
```

```ad-warning
Non si aggiunge 273 a una differenza
Da $20\,^\circ\text{C}$ a $80\,^\circ\text{C}$ ci sono $60\,\text{K}$, non $333\,\text{K}$.
```

```ad-warning
Lo stesso numero, due significati
$20{,}8\,\text{J/(mol}\cdot\text{K)}$ è il $C_p$ di un gas monoatomico e il $C_V$ di un gas biatomico.
```
