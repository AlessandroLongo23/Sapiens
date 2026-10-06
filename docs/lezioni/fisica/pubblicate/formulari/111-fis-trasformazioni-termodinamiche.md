# Formulario: Le trasformazioni isocora, isobara e isoterma

## Strumenti

Gas perfetto, $n$ moli, temperature in kelvin, $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$.

$$p\,V = n\,R\,T \qquad \Delta U = Q - W$$

Gas monoatomico, in qualunque trasformazione: $\Delta U = \tfrac{3}{2}\,n\,R\,\Delta T$.

## Le tre trasformazioni

| | Isocora | Isobara | Isoterma |
|---|---|---|---|
| resta costante | $V$ | $p$ | $T$ |
| legge del gas | $\dfrac{p}{T}$ costante | $\dfrac{V}{T}$ costante | $p\,V$ costante |
| nel piano $p$-$V$ | segmento verticale | segmento orizzontale | ramo di iperbole |
| lavoro $W$ | $0$ | $p\,\Delta V = n\,R\,\Delta T$ | $n\,R\,T\,\ln\dfrac{V_B}{V_A}$ |
| $\Delta U$ (monoatomico) | $\tfrac{3}{2}\,n\,R\,\Delta T$ | $\tfrac{3}{2}\,n\,R\,\Delta T$ | $0$ |
| calore $Q$ | $\Delta U$ | $\Delta U + W = \tfrac{5}{2}\,n\,R\,\Delta T$ | $W$ |

## Lavoro dell'isoterma

$$W = n\,R\,T\,\ln\frac{V_B}{V_A} = p_A V_A\,\ln\frac{V_B}{V_A} = n\,R\,T\,\ln\frac{p_A}{p_B}$$

- $\ln$ è il logaritmo naturale (tasto $\ln$ della calcolatrice).
- Espansione: $W > 0$ e il gas assorbe $Q = W$. Compressione: $W < 0$ e il gas cede calore.
- Esempio: $1{,}0\,\text{mol}$ a $300\,\text{K}$ che raddoppia il volume compie $8{,}31 \cdot 300 \cdot \ln 2\,\text{J} \approx 1{,}7 \cdot 10^3\,\text{J}$.

## Isobara di un gas monoatomico

Del calore assorbito, tre quinti diventano energia interna e due quinti lavoro.

## Trasformazioni cicliche

$$\Delta U_{ciclo} = 0 \qquad Q_{ciclo} = W_{ciclo}$$

- $W_{ciclo}$ è l'area racchiusa dal ciclo, positiva se il verso è orario.
- Il lavoro totale è il calore assorbito meno il calore ceduto.
- Tabella con una riga per tratto e le colonne $Q$, $W$, $\Delta U$: in ogni riga $\Delta U = Q - W$.

## Procedimento

1. Trova che cosa resta costante.
2. Scrivi il termine che vale zero ($W$ nell'isocora, $\Delta U$ nell'isoterma).
3. Calcola gli altri con la tabella.
4. Controlla $\Delta U = Q - W$ con i segni.

```ad-warning
Isoterma non vuol dire senza calore
A temperatura costante il gas scambia calore, quanto è il lavoro: $Q = W$. È $\Delta U$ a essere zero.
```

```ad-warning
A pressione costante il calore non è tutto energia interna
$\tfrac{3}{2}\,n\,R\,\Delta T$ è $\Delta U$; il calore è $Q = \Delta U + W$.
```

```ad-warning
Kelvin, e finale su iniziale
Nel lavoro dell'isoterma la temperatura è in kelvin e il rapporto dei volumi è $\frac{V_B}{V_A}$; con le pressioni è $\frac{p_A}{p_B}$.
```
