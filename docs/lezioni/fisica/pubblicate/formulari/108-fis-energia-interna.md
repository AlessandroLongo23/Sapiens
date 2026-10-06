# Formulario: L'energia interna

## Che cos'è

L'energia interna $U$ di un sistema è la somma delle energie cinetiche delle sue molecole (moto disordinato) e delle energie potenziali delle forze tra le molecole. Si misura in joule.

- Non comprende l'energia cinetica del sistema che si muove tutto insieme, né la sua energia potenziale gravitazionale.

## Gas perfetto monoatomico

Niente forze tra le molecole: l'energia interna è solo cinetica.

$$U = \frac{3}{2}\,N\,k_B\,T = \frac{3}{2}\,n\,R\,T = \frac{3}{2}\,p\,V$$

$R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$, $T$ in kelvin, $p$ in pascal, $V$ in metri cubi.

- $U$ dipende solo dalla temperatura (e dalla quantità di gas), non dal volume o dalla pressione.

Variazione:

$$\Delta U = \frac{3}{2}\,n\,R\,\Delta T \qquad\qquad \Delta U = \frac{3}{2}\,(p_B\,V_B - p_A\,V_A)$$

$\Delta T$ ha lo stesso valore in kelvin e in gradi Celsius; $\Delta U$ è negativa se il gas si raffredda.

## Funzione di stato

- $U$ dipende solo dallo stato, non da come il sistema ci è arrivato.
- Tra due stati $A$ e $B$, $\Delta U = U_B - U_A$ è la stessa per ogni trasformazione.
- In una trasformazione ciclica $\Delta U = 0$.
- Calore e lavoro non sono funzioni di stato: dipendono dal cammino.

## Espansione libera (esperienza di Joule)

Un gas che si espande nel vuoto in un recipiente isolato non scambia calore e non compie lavoro.

| Grandezza | Dopo l'espansione libera |
|---|---|
| volume | aumenta |
| pressione | diminuisce ($p_f = p_i\,V_i / V_f$) |
| temperatura | non cambia |
| energia interna | non cambia |

Conclusione: l'energia interna di un gas perfetto dipende solo dalla temperatura.

## Sistema isolato

L'energia interna totale si conserva. Due gas monoatomici a temperature diverse che si scambiano calore in un recipiente isolato:

$$T_f = \frac{n_1\,T_1 + n_2\,T_2}{n_1 + n_2}$$

```ad-warning
Kelvin per U, non per le differenze
In $U = \frac{3}{2}\,n\,R\,T$ la temperatura è in kelvin; in $\Delta U$ entra $\Delta T$, a cui il $273$ non si aggiunge.
```

```ad-warning
Il volume in metri cubi
In $U = \frac{3}{2}\,p\,V$ il volume va in metri cubi: $1\,\text{L} = 10^{-3}\,\text{m}^3$.
```

```ad-warning
Solo temperatura, solo nel gas perfetto
Ghiaccio e acqua a $0\,^\circ\text{C}$ hanno la stessa temperatura ma energie interne diverse: nei solidi, nei liquidi e nei gas reali conta anche l'energia potenziale tra le molecole.
```
