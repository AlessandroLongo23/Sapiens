# Formulario: Il bilancio dell'energia con le forze non conservative

## Il bilancio dell'energia meccanica

Lavoro delle forze non conservative uguale alla variazione dell'energia meccanica:

$$W_{nc} = \Delta E = \Delta K + \Delta U$$

Tra lo stato iniziale e quello finale:

$$K_i + U_i + W_{nc} = K_f + U_f$$

- $U$ è la somma di $m g h$ e di $\tfrac{1}{2} k x^2$, se c'è una molla.
- Con $W_{nc} = 0$ l'energia meccanica si conserva.

## Il segno di $W_{nc}$

| forza non conservativa | lavoro | energia meccanica |
|---|---|---|
| attrito, resistenza dell'aria o dell'acqua | $-F_d \cdot l$, negativo | diminuisce |
| fune, motore, spinta nel verso del moto | $F \cdot s$, positivo | aumenta |
| reazione del piano, tensione del filo di un pendolo | zero | non cambia |

Attrito in piano: $F_d = \mu_d\, m g$. Attrito su un piano inclinato: $F_d = \mu_d\, m g \cos\alpha$.

## Procedimento

1. Scegli lo stato iniziale e lo stato finale.
2. Scegli il livello di riferimento per le altezze.
3. Scrivi $K_i + U_i$ e $K_f + U_f$.
4. Calcola il lavoro di ogni forza non conservativa, tratto per tratto, con il suo segno.
5. Scrivi il bilancio e ricava l'incognita.

Con più tratti il bilancio si scrive una volta sola, dalla partenza all'arrivo.

## Casi tipici

| Situazione | Bilancio | Risultato |
|---|---|---|
| discesa liscia da $h$, poi piano con attrito fino a fermarsi | $m g h - \mu_d\, m g\, d = 0$ | $d = \dfrac{h}{\mu_d}$ |
| molla compressa di $x$ che lancia un blocco su un piano con attrito | $\tfrac{1}{2} k x^2 - \mu_d\, m g\, d = 0$ | $d = \dfrac{k x^2}{2 \mu_d\, m g}$ |
| rampa con attrito lunga $l$, poi molla | $m g h - \mu_d\, m g \cos\alpha \cdot l = \tfrac{1}{2} k x^2$ | $x$ dalla radice |
| corpo tirato in salita da fermo con una forza $F$ | $F\,l - \mu_d\, m g \cos\alpha \cdot l = \tfrac{1}{2} m v^2 + m g h$ | $v$ dalla radice |
| caduta da $h$ e arresto in un tratto $d$ | $m g (h + d) - F \cdot d = 0$ | $F = \dfrac{m g (h + d)}{d}$ |

```ad-warning
Peso e molla non entrano in $W_{nc}$
Il loro lavoro è già in $\Delta U$: in $W_{nc}$ solo le forze senza energia potenziale.
```

```ad-warning
L'attrito solo dove c'è
Lunghezza e forza premente sono quelle del tratto ruvido: $m g$ in piano, $m g \cos\alpha$ in salita o in discesa.
```

```ad-warning
L'altezza arriva fino allo stato finale
Un corpo che cade e poi affonda perde energia potenziale fino al punto in cui si ferma.
```
