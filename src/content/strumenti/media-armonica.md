# Media armonica

## Che cos'è

La media armonica di $n$ numeri positivi è $n$ diviso la somma dei loro reciproci. Si scrive $H$. Il reciproco di un numero $x$ è $\dfrac{1}{x}$.

Si usa quando si fa la media di rapporti con lo stesso numeratore: la velocità media su tratti di uguale lunghezza, il prezzo medio comprando con la stessa somma di denaro ogni volta.

## Come si calcola a mano

```ad-example
Andata e ritorno
Un'auto va da una città all'altra a $60$ km/h e torna sulla stessa strada a $40$ km/h. Somma i reciproci delle due velocità:

$$\begin{aligned}
\frac{1}{60} + \frac{1}{40} &= \frac{2 + 3}{120} \\[6pt]
&= \frac{5}{120} = \frac{1}{24}
\end{aligned}$$

Dividi $2$, il numero dei valori, per la somma:

$$\begin{aligned}
H &= 2 : \frac{1}{24} \\[6pt]
&= 2 \cdot 24 = 48
\end{aligned}$$

La velocità media del viaggio è $48$ km/h, non $50$: al ritorno l'auto viaggia più a lungo, e quel tratto pesa di più.
```

La regola:

$$H = \frac{n}{\dfrac{1}{x_1} + \dfrac{1}{x_2} + \dots + \dfrac{1}{x_n}}$$

Per sommare i reciproci conviene il minimo comune denominatore, come in ogni somma di frazioni.

```ad-error
Errori frequenti
- Fare la media aritmetica delle velocità: vale solo se i tempi, e non le distanze, sono uguali.
- Dimenticare l'ultimo passaggio: la somma dei reciproci non è ancora la media, bisogna dividere $n$ per quella somma.
- Scrivere $\dfrac{1}{60} + \dfrac{1}{40} = \dfrac{1}{100}$: le frazioni si sommano con il denominatore comune.
```

## Domande frequenti

### Quando si usa la media armonica e quando quella aritmetica?

Per le velocità: se i tratti hanno la stessa lunghezza serve l'armonica; se durano lo stesso tempo serve l'aritmetica. In generale l'armonica va bene per i rapporti quando è fisso il numeratore (i chilometri), l'aritmetica quando è fisso il denominatore (le ore).

### È più piccola della media aritmetica?

Sì, a meno che i numeri siano tutti uguali. Vale sempre $H \le G \le \bar{x}$: armonica, geometrica e aritmetica in quest'ordine.

### Si può calcolare con lo zero?

No: il reciproco di $0$ non esiste. Anche i numeri negativi si escludono, perché la media perderebbe significato.
