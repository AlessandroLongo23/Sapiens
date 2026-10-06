# Formulario: Entropia e disordine

## Macrostati e microstati

- Microstato: dove si trova ogni singola molecola.
- Macrostato: quante molecole ci sono in ciascuna metà ($N_s$ a sinistra, $N_d$ a destra).
- Molteplicità $\Omega$: numero di microstati che realizzano un macrostato.

Microstati in tutto, per $N$ molecole in due metà: $2^N$.

## Contare i microstati

$$\Omega = \frac{N!}{N_s!\;N_d!} \qquad N_d = N - N_s$$

- Fattoriale: $N! = N \cdot (N-1) \cdot \ldots \cdot 2 \cdot 1$, con $0! = 1$.
- Esempio: $N = 4$, $N_s = 2$: $\Omega = \dfrac{4!}{2!\;2!} = 6$.

## Probabilità di un macrostato

Tutti i microstati sono ugualmente probabili:

$$P = \frac{\Omega}{2^N}$$

| $N = 4$: $N_s$ | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|
| $\Omega$ | 1 | 4 | 6 | 4 | 1 |
| $P$ | $6{,}25\,\%$ | $25\,\%$ | $37{,}5\,\%$ | $25\,\%$ | $6{,}25\,\%$ |

- Tutte le molecole in una metà: $\Omega = 1$, $P = 1/2^N$.
- Lo stato di equilibrio è il macrostato con più microstati.

## Equazione di Boltzmann

$$S = k_B \ln \Omega \qquad\qquad \Delta S = k_B \ln\frac{\Omega_B}{\Omega_A}$$

con $k_B = 1{,}38 \cdot 10^{-23}\,\text{J/K}$. Molti libri scrivono $W$ al posto di $\Omega$.

## Espansione libera

Il volume passa da $V_A$ a $V_B$:

$$\frac{\Omega_B}{\Omega_A} = \left(\frac{V_B}{V_A}\right)^N \qquad\qquad \Delta S = N\,k_B \ln\frac{V_B}{V_A} = n\,R \ln\frac{V_B}{V_A}$$

Se il volume raddoppia: $\Delta S = N\,k_B \ln 2$.

## Freccia del tempo e terzo principio

- Un sistema di molte particelle evolve verso i macrostati con più microstati: l'entropia dell'universo aumenta, e questo distingue il passato dal futuro.
- Terzo principio: l'entropia di un cristallo perfetto tende a zero allo zero assoluto ($\Omega = 1$), che non si raggiunge con un numero finito di trasformazioni.

```ad-warning
Microstati, non macrostati
Ugualmente probabili sono i microstati. Un macrostato è più probabile di un altro se ne raccoglie di più.
```

```ad-warning
Improbabile, non vietato
Il ritorno di tutte le molecole in una metà non viola la meccanica: ha probabilità $1/2^N$, che con molte molecole è zero in pratica.
```
