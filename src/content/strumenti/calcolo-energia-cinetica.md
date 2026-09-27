# Calcolo dell'energia cinetica

## Che cos'è

L'energia cinetica è l'energia che un corpo possiede perché è in movimento: dipende dalla sua massa e dalla sua velocità.

Un pallone fermo non ha energia cinetica. Calciato a 20 m/s, ne ha abbastanza da spostare un portiere. Nei libri si indica con $K$; alcuni testi scrivono $E_c$.

## Come si calcola a mano

Con $m$ la massa in chilogrammi e $v$ la velocità in metri al secondo:

$$K = \dfrac{1}{2}\, m v^2$$

Il risultato è in joule ($\text{J}$). Un joule è un $\text{kg} \cdot \text{m}^2/\text{s}^2$.

```ad-example
Un'auto a 90 km/h
Un'auto di 1200 kg viaggia a 90 km/h. Porta la velocità in m/s: $90 : 3{,}6 = 25\ \text{m/s}$. Poi eleva al quadrato e moltiplica:

$$\begin{aligned}
K &= \dfrac{1}{2} \cdot 1200\ \text{kg} \cdot (25\ \text{m/s})^2 \\[6pt]
&= \dfrac{1}{2} \cdot 1200 \cdot 625\ \text{J} \\[6pt]
&= 375\,000\ \text{J} = 375\ \text{kJ}
\end{aligned}$$
```

La velocità è al quadrato: se raddoppia, l'energia cinetica diventa quattro volte più grande. Per questo le frenate ad alta velocità sono così lunghe.

## Trovare la massa o la velocità

Dalla formula si ricavano le formule inverse:

$$m = \dfrac{2K}{v^2} \qquad v = \sqrt{\dfrac{2K}{m}}$$

```ad-example
La velocità dall'energia
Un corpo di 2 kg ha un'energia cinetica di 100 J:

$$v = \sqrt{\dfrac{2 \cdot 100\ \text{J}}{2\ \text{kg}}} = \sqrt{100\ \text{m}^2/\text{s}^2} = 10\ \text{m/s}$$
```

```ad-error
Errori frequenti
- Dimenticare di elevare al quadrato la velocità, o elevare al quadrato anche la massa.
- Usare la velocità in km/h: il risultato non è in joule.
- Scrivere la massa in grammi: nella formula va in chilogrammi.
```

## Domande frequenti

### L'energia cinetica può essere negativa?

No. La massa è positiva e il quadrato della velocità non è mai negativo, quindi $K$ è sempre positiva o zero.

### Che cosa dice il teorema dell'energia cinetica?

Il lavoro fatto da tutte le forze su un corpo è uguale alla variazione della sua energia cinetica: $L = K_f - K_i$. Serve, per esempio, a calcolare lo spazio di frenata dalla forza d'attrito.
