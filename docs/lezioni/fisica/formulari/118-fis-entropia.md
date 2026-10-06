# Formulario: L'entropia

## Disuguaglianza di Clausius

In un ciclo, con i calori $Q_i$ presi con il segno (positivi se assorbiti) e le temperature $T_i$ delle sorgenti in kelvin:

$$\frac{Q_1}{T_1} + \frac{Q_2}{T_2} + \ldots + \frac{Q_n}{T_n} \le 0$$

L'uguale vale per i cicli reversibili.

## Variazione di entropia

Trasformazione reversibile a temperatura costante $T$:

$$\Delta S = S_B - S_A = \frac{Q}{T}$$

- Unità: $\text{J/K}$. $Q > 0$ se il sistema assorbe calore (l'entropia aumenta), $Q < 0$ se lo cede.
- L'entropia è una funzione di stato: $\Delta S$ dipende solo dagli stati $A$ e $B$.
- Trasformazione irreversibile: il conto si fa su una trasformazione reversibile tra gli stessi stati.

## Casi da ricordare

| Trasformazione | Variazione di entropia del sistema |
|---|---|
| fusione o vaporizzazione a temperatura $T$ | $\Delta S = \dfrac{L\,m}{T}$ |
| solidificazione o condensazione | $\Delta S = -\dfrac{L\,m}{T}$ |
| gas perfetto a temperatura costante (anche espansione libera) | $\Delta S = n\,R \ln\dfrac{V_B}{V_A}$ |
| corpo che passa da $T_A$ a $T_B$ | $\Delta S = m\,c \ln\dfrac{T_B}{T_A}$ |
| adiabatica reversibile | $\Delta S = 0$ |
| ciclo | $\Delta S = 0$ |
| sorgente a temperatura $T$ che scambia $Q$ | $\Delta S = \pm\dfrac{Q}{T}$ |

$R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$; acqua: $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$, $c = 4186\,\text{J/(kg}\cdot\text{K)}$.

## Entropia dell'universo

$$\Delta S_{univ} = \Delta S_{sistema} + \Delta S_{ambiente} \ge 0$$

- Irreversibile (reale): $\Delta S_{univ} > 0$. Reversibile (ideale): $\Delta S_{univ} = 0$. Mai $\Delta S_{univ} < 0$.

Calore $Q$ che passa da una sorgente a $T_c$ a una a $T_f$:

$$\Delta S_{univ} = \frac{Q}{T_f} - \frac{Q}{T_c}$$

Macchina termica, per ciclo:

$$\Delta S_{univ} = \frac{Q_f}{T_f} - \frac{Q_c}{T_c}$$

Lavoro perduto rispetto alla macchina reversibile:

$$W_{rev} - W = T_f\,\Delta S_{univ}$$

```ad-warning
Kelvin e segno
La temperatura è assoluta ($T = t + 273$) e il calore ha il segno: chi cede calore perde entropia.
```

```ad-warning
Irreversibile non vuol dire $Q/T$
Nell'espansione libera $Q = 0$ ma $\Delta S = n\,R \ln(V_B/V_A)$, diverso da zero.
```

```ad-warning
Non diminuisce l'entropia dell'universo
Quella di un singolo sistema può diminuire (l'acqua che gela), se l'ambiente ne guadagna di più.
```
