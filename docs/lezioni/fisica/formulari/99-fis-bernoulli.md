# Formulario: L'equazione di Bernoulli

## L'equazione

Fluido ideale, corrente stazionaria, punti sulla stessa linea di flusso:

$$p + \frac{1}{2}\,d\,v^2 + d\,g\,h = \text{costante}$$

Tra due sezioni:

$$p_1 + \frac{1}{2}\,d\,v_1^2 + d\,g\,h_1 = p_2 + \frac{1}{2}\,d\,v_2^2 + d\,g\,h_2$$

- $p$ pressione (Pa), $d$ densità ($\text{kg/m}^3$), $v$ velocità (m/s), $h$ quota (m) sopra un livello di riferimento, $g = 9{,}8\,\text{m/s}^2$.
- I tre termini sono pressioni: $\text{Pa} = \text{N/m}^2 = \text{J/m}^3$. È la conservazione dell'energia per un metro cubo di fluido.
- Acqua: $d = 1000\,\text{kg/m}^3$. Aria: $d \approx 1{,}2\,\text{kg/m}^3$.

## Casi particolari

| Situazione | Che cosa resta |
|---|---|
| fluido fermo ($v_1 = v_2 = 0$) | $p_1 - p_2 = d\,g\,(h_2 - h_1)$, la legge di Stevino |
| tubo orizzontale ($h_1 = h_2$) | $p_1 + \tfrac{1}{2} d\,v_1^2 = p_2 + \tfrac{1}{2} d\,v_2^2$ |
| sezione costante ($v_1 = v_2$) | $p_1 + d\,g\,h_1 = p_2 + d\,g\,h_2$ |

- Tubo orizzontale: dove il fluido è più veloce la pressione è più bassa.

## Procedimento

1. Scegli le due sezioni: una dove conosci tutto, l'altra con l'incognita.
2. Metti il livello di riferimento alla sezione più bassa.
3. Se manca una velocità: $S_1 v_1 = S_2 v_2$, cioè $v_2 = v_1 (D_1/D_2)^2$.
4. Scrivi l'equazione e togli i termini uguali.
5. Ricava l'incognita, in unità del Sistema Internazionale.

Pressione nella seconda sezione:

$$p_2 = p_1 - \frac{1}{2}\,d\,(v_2^2 - v_1^2) - d\,g\,(h_2 - h_1)$$

Forza su una superficie $S$ con pressioni diverse sulle due facce: $F = (p_1 - p_2) \cdot S$.

```ad-warning
Più veloce, meno pressione
Nella strozzatura la pressione scende, non sale.
```

```ad-warning
Quota, non profondità
$h$ si misura verso l'alto: più in alto, pressione più bassa.
```

```ad-warning
Differenza dei quadrati
$v_2^2 - v_1^2$ non è $(v_2 - v_1)^2$.
```
