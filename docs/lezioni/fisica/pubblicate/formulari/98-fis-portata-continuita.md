# Formulario: La portata e l'equazione di continuità

## Fluido ideale e corrente stazionaria

- Fluido ideale: incomprimibile (densità $d$ uguale dappertutto) e non viscoso (niente attrito interno).
- Corrente stazionaria: in ogni punto la velocità non cambia nel tempo.
- Linee di flusso: le strade delle particelle; dove sono più vicine il fluido è più veloce.

## Portata

Volume di fluido che attraversa una sezione nell'unità di tempo:

$$q = \frac{\Delta V}{\Delta t} \qquad [q] = \frac{\text{m}^3}{\text{s}}$$

Con la sezione $S$ e la velocità $v$ del fluido:

$$q = S \cdot v$$

Tubo circolare di raggio $r$ e diametro $D$: $S = \pi\,r^2 = \dfrac{\pi\,D^2}{4}$.

| Conversione | Valore |
|---|---|
| $1\,\text{L}$ | $10^{-3}\,\text{m}^3$ |
| $1\,\text{L/s}$ | $10^{-3}\,\text{m}^3/\text{s}$ |
| $1\,\text{L/min}$ | $1{,}67 \cdot 10^{-5}\,\text{m}^3/\text{s}$ |
| $1\,\text{cm}^2$ | $10^{-4}\,\text{m}^2$ |

- Volume passato in un tempo: $\Delta V = q \cdot \Delta t$. Tempo per un volume: $\Delta t = \Delta V / q$.

## Equazione di continuità

In un condotto senza perdite la portata è la stessa in ogni sezione:

$$S_1 \cdot v_1 = S_2 \cdot v_2$$

$$v_2 = v_1 \cdot \frac{S_1}{S_2} \qquad\qquad v_2 = v_1 \cdot \left(\frac{D_1}{D_2}\right)^2 \ \text{(tubo circolare)}$$

- Sezione e velocità sono inversamente proporzionali: dove il tubo si stringe il fluido accelera.
- Vale per un fluido incomprimibile.

## Condotto che si divide

$$q = q_1 + q_2 \qquad\qquad S \cdot v = S_1 \cdot v_1 + S_2 \cdot v_2$$

- Con tanti rami uguali conta la sezione totale: se è più grande di quella di partenza, nei rami il fluido rallenta.

```ad-warning
Diametro al quadrato
Se il diametro si dimezza la velocità diventa $4$ volte più grande, non $2$.
```

```ad-warning
Raggio, non diametro
In $S = \pi r^2$ va il raggio, in metri: con il diametro l'area viene $4$ volte più grande.
```

```ad-warning
Litri al minuto
$1\,\text{L/min}$ non è $10^{-3}\,\text{m}^3/\text{s}$: prima si divide per $60$.
```
