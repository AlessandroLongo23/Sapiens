# Formulario: L'attrito viscoso e la velocità limite

## Viscosità

Forza per far scorrere a velocità $v$ una lastra di area $S$ su uno strato di fluido spesso $L$:

$$F = \eta\,\frac{S \cdot v}{L} \qquad [\eta] = \text{Pa} \cdot \text{s}$$

| Fluido | $\eta$ ($\text{Pa} \cdot \text{s}$) |
|---|---|
| aria | $1{,}8 \cdot 10^{-5}$ |
| acqua | $1{,}0 \cdot 10^{-3}$ |
| olio d'oliva | $8{,}4 \cdot 10^{-2}$ |
| glicerina | $1{,}5$ |

- Moto laminare: strati che scorrono senza mescolarsi. Moto turbolento: vortici, velocità che cambia di continuo.
- La turbolenza è favorita da velocità, densità e dimensioni grandi, ostacolata dalla viscosità.

## Legge di Stokes

Forza di attrito viscoso su una sfera di raggio $r$ a velocità $v$, in moto laminare:

$$F_v = 6\pi\,\eta\,r\,v$$

- Opposta alla velocità, direttamente proporzionale a $\eta$, $r$ e $v$.
- Vale per sfere piccole e lente.

## Velocità limite

Velocità costante che il corpo raggiunge quando la forza totale è zero.

Senza spinta di Archimede (sfera molto più densa del fluido):

$$v_l = \frac{m\,g}{6\pi\,\eta\,r} = \frac{2\,r^2\,g\,d_s}{9\,\eta}$$

Con la spinta di Archimede ($d_s$ densità della sfera, $d_{fl}$ del fluido):

$$v_l = \frac{2\,r^2\,g\,(d_s - d_{fl})}{9\,\eta}$$

Massa di una sfera: $m = d_s \cdot \tfrac{4}{3}\pi\,r^3$.

Avvicinamento alla velocità limite, partendo da fermo:

$$v(t) = v_l \left(1 - e^{-t/\tau}\right) \qquad \tau = \frac{m}{6\pi\,\eta\,r}$$

Viscosità dalla velocità limite misurata:

$$\eta = \frac{2\,r^2\,g\,(d_s - d_{fl})}{9\,v_l}$$

```ad-warning
Raggio in metri, e al quadrato
$1\,\text{mm} = 10^{-3}\,\text{m}$, $1\,\mu\text{m} = 10^{-6}\,\text{m}$. Raggio doppio, velocità limite quadrupla.
```

```ad-warning
Alla velocità limite
La forza totale è zero, non l'attrito; il corpo non si ferma, scende a velocità costante.
```

```ad-warning
Viscoso non vuol dire denso
L'olio è meno denso dell'acqua e molto più viscoso.
```
