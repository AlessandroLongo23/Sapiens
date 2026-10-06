# Formulario: L'equazione di stato del gas perfetto

## Da uno stato all'altro

Per una quantità fissa di gas, con la temperatura in kelvin:

$$\frac{p_1\,V_1}{T_1} = \frac{p_2\,V_2}{T_2}$$

## Moli e molecole

$$n = \frac{m}{M} \qquad\qquad N = n\,N_A \qquad\qquad N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$$

- $M$ è la massa molare: $4{,}0\,\text{g/mol}$ per l'elio, $28{,}0\,\text{g/mol}$ per l'azoto, $32{,}0\,\text{g/mol}$ per l'ossigeno.

## Equazione di stato

$$p\,V = n\,R\,T \qquad\qquad R = 8{,}31\,\frac{\text{J}}{\text{mol} \cdot \text{K}}$$

Con il numero di molecole:

$$p\,V = N\,k_B\,T \qquad\qquad k_B = \frac{R}{N_A} = 1{,}38 \cdot 10^{-23}\,\frac{\text{J}}{\text{K}}$$

Unità: $p$ in pascal, $V$ in metri cubi, $T$ in kelvin.

| Grandezza | Conversione |
|---|---|
| temperatura | $T = t + 273$ |
| volume | $1\,\text{L} = 10^{-3}\,\text{m}^3$, $1\,\text{cm}^3 = 10^{-6}\,\text{m}^3$ |
| pressione | $1\,\text{atm} = 1{,}01 \cdot 10^5\,\text{Pa}$ |

## Procedimento

1. Porta la temperatura in kelvin, il volume in metri cubi, la pressione in pascal.
2. Se è data la massa, trova le moli: $n = m/M$.
3. Ricava l'incognita: $p = \dfrac{n R T}{V}$, $V = \dfrac{n R T}{p}$, $n = \dfrac{p V}{R T}$, $T = \dfrac{p V}{n R}$.
4. Sostituisci con le unità e controlla che il risultato sia ragionevole.

## Che cosa contiene

- $T$ costante: $p\,V = n\,R\,T$ costante (Boyle). L'isoterma è $p = \dfrac{n\,R\,T}{V}$.
- $p$ costante: $V/T$ costante (prima legge di Gay-Lussac).
- $V$ costante: $p/T$ costante (seconda legge di Gay-Lussac).
- $V$ e $T$ costanti, gas che esce: $n_1 - n_2 = \dfrac{(p_1 - p_2)\,V}{R\,T}$.
- Una mole a $0\,^\circ\text{C}$ e $1\,\text{atm}$ occupa $22{,}4\,\text{L}$.

Il gas perfetto è un modello: molecole puntiformi, senza forze tra loro se non negli urti. Un gas vero gli assomiglia a bassa pressione e lontano dalla temperatura a cui diventa liquido.

```ad-warning
Unità del Sistema Internazionale
Con $R = 8{,}31$ i litri danno un risultato sbagliato di mille volte, e i gradi Celsius un risultato senza senso.
```

```ad-warning
Se il gas esce, $n$ cambia
$p_1 V_1 / T_1 = p_2 V_2 / T_2$ vale solo in un recipiente chiuso: altrimenti si scrive $p\,V = n\,R\,T$ per ogni stato.
```
