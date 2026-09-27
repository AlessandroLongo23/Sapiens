# Leggi dei gas

## Che cos'è

Le leggi dei gas legano pressione, volume, temperatura e quantità di un gas ideale, cioè di un gas le cui particelle non si attraggono e occupano un volume trascurabile.

L'equazione di stato le riunisce tutte: $pV = nRT$, con $n$ le moli e $R$ la costante dei gas. Le altre leggi descrivono un gas che passa da uno stato 1 a uno stato 2 tenendo costante una grandezza.

## Come si calcola a mano

Prima di tutto, la temperatura va in kelvin: $T = t + 273{,}15$.

```ad-example
Il volume di 2 mol a 25 °C e 1 atm
Porta la temperatura in kelvin, poi ricava $V$ dall'equazione di stato. Con la pressione in atmosfere usa $R = 0{,}0821\ \text{L·atm/(mol·K)}$ e il volume esce in litri.

$$\begin{aligned}
T &= (25 + 273{,}15)\ \text{K} = 298{,}15\ \text{K} \\[6pt]
V &= \frac{nRT}{p} = \frac{2 \cdot 0{,}0821 \cdot 298{,}15}{1}\ \text{L} \\[6pt]
&\approx 48{,}96\ \text{L}
\end{aligned}$$
```

Con la pressione in pascal e il volume in metri cubi si usa invece $R = 8{,}314\ \text{J/(mol·K)}$.

Per le trasformazioni:

- a temperatura costante (isoterma, legge di Boyle): $p_1 V_1 = p_2 V_2$;
- a pressione costante (isobara, legge di Charles o prima legge di Gay-Lussac): $V_1 / T_1 = V_2 / T_2$;
- a volume costante (isocora, legge di Gay-Lussac): $p_1 / T_1 = p_2 / T_2$.

```ad-example
Un gas scaldato a pressione costante
2 L di gas passano da 20 °C a 80 °C:

$$\begin{aligned}
V_2 &= V_1 \cdot \frac{T_2}{T_1} = 2\ \text{L} \cdot \frac{353{,}15\ \text{K}}{293{,}15\ \text{K}} \\[6pt]
&\approx 2{,}409\ \text{L}
\end{aligned}$$
```

```ad-error
Errori frequenti
- Usare la temperatura in gradi Celsius: da 20 °C a 80 °C il volume non quadruplica.
- Usare $R = 8{,}314$ con i litri e le atmosfere, o $R = 0{,}0821$ con i pascal.
- Nelle trasformazioni, scrivere $p_1$ e $p_2$ in unità diverse.
```

## Domande frequenti

### 273 o 273,15?

Lo zero assoluto è a $-273{,}15\ ^\circ\text{C}$. Molti libri di chimica arrotondano a 273: il risultato cambia di poco. Lo strumento usa 273,15.

### Nelle leggi di Boyle, Charles e Gay-Lussac devo convertire pressione e volume?

No, basta che le due pressioni, o i due volumi, siano nella stessa unità: il rapporto non cambia. La temperatura invece va sempre in kelvin.
