# Formulario: Il teorema di Torricelli e l'effetto Venturi

Tutte le formule vengono dall'equazione di Bernoulli, $p + \tfrac{1}{2}\,d\,v^2 + d\,g\,h = \text{costante}$, per un fluido ideale.

## Teorema di Torricelli

Velocità di uscita da un piccolo foro a profondità $h$ sotto la superficie libera di un serbatoio aperto:

$$v = \sqrt{2\,g\,h}$$

- Non dipende dalla densità del liquido.
- Vale se il foro è piccolo rispetto al serbatoio e superficie e getto sono alla stessa pressione.
- Portata del foro di sezione $S$: $q = S \cdot v$.

Getto orizzontale da un foro ad altezza $y$ dal suolo:

$$t = \sqrt{\frac{2\,y}{g}} \qquad\qquad x = v \cdot t = 2\sqrt{h \cdot y}$$

- La gittata è massima con il foro a metà altezza del liquido.

## Effetto Venturi e tubo di Venturi

In una strozzatura di un tubo orizzontale la velocità cresce e la pressione scende:

$$v_2 = v_1 \cdot \frac{S_1}{S_2} \qquad\qquad p_1 - p_2 = \frac{1}{2}\,d\,(v_2^2 - v_1^2)$$

Velocità nel tratto largo dalla differenza di pressione:

$$v_1 = \sqrt{\frac{2\,(p_1 - p_2)}{d \left[\left(\dfrac{S_1}{S_2}\right)^2 - 1\right]}}$$

- Con due tubicini verticali: $p_1 - p_2 = d\,g\,\Delta h$.

## Tubo di Pitot

Nel punto di ristagno (sulla punta) il fluido è fermo, sul fianco ha velocità $v$:

$$p_2 - p_1 = \frac{1}{2}\,d\,v^2 \qquad\qquad v = \sqrt{\frac{2\,(p_2 - p_1)}{d}}$$

- $d$ è la densità del fluido in moto (aria: $1{,}2\,\text{kg/m}^3$).

## Portanza

Aria più veloce sopra l'ala ($v_s$) che sotto ($v_i$), ala di superficie $S$:

$$p_i - p_s = \frac{1}{2}\,d\,(v_s^2 - v_i^2) \qquad\qquad F = (p_i - p_s) \cdot S$$

- Volo orizzontale: $F = m\,g$.

```ad-warning
Profondità del foro
$h$ si misura dalla superficie libera al foro, non dal fondo.
```

```ad-warning
Diametri nel tubo di Venturi
$(S_1/S_2)^2 = (D_1/D_2)^4$: con il diametro dimezzato il termine tra parentesi è $15$, non $3$.
```

```ad-warning
Densità nel tubo di Pitot
Va la densità del fluido che scorre, non quella del liquido del manometro.
```
