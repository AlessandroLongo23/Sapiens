# Seno, coseno e tangente di un angolo

## Che cos'è

Il seno e il coseno di un angolo sono le coordinate del punto $P$ in cui il suo lato taglia la circonferenza goniometrica, cioè la circonferenza di raggio 1 con il centro nell'origine.

Il coseno è l'ascissa di $P$, il seno è l'ordinata. La tangente è il seno diviso il coseno, la cotangente il coseno diviso il seno:

$$\operatorname{tg}\alpha = \frac{\sin\alpha}{\cos\alpha} \qquad \operatorname{cotg}\alpha = \frac{\cos\alpha}{\sin\alpha}$$

## Come si calcola a mano

Per gli angoli notevoli ($30^\circ$, $45^\circ$, $60^\circ$ e i multipli di $90^\circ$) i valori si sanno a memoria. Per un angolo che sta in un altro quadrante si cerca l'angolo associato nel primo quadrante, e il segno si legge dal quadrante.

```ad-example
Esempio: 150°
L'angolo è nel secondo quadrante, dove il seno è positivo e il coseno negativo. Scrivilo come $180^\circ$ meno un angolo acuto, e usa le formule degli archi associati:

$$\begin{aligned}
150^\circ &= 180^\circ - 30^\circ \\[6pt]
\sin 150^\circ &= \sin 30^\circ = \frac{1}{2} \\[6pt]
\cos 150^\circ &= -\cos 30^\circ = -\frac{\sqrt{3}}{2}
\end{aligned}$$

Poi dividi, e togli la radice dal denominatore:

$$\begin{aligned}
\operatorname{tg} 150^\circ &= \frac{1}{2} : \left(-\frac{\sqrt{3}}{2}\right) \\[6pt]
&= -\frac{1}{\sqrt{3}} = -\frac{\sqrt{3}}{3}
\end{aligned}$$
```

I segni nei quattro quadranti:

| Quadrante | Seno | Coseno | Tangente |
| --- | --- | --- | --- |
| primo | + | + | + |
| secondo | + | − | − |
| terzo | − | − | + |
| quarto | − | + | − |

Un angolo maggiore di $360^\circ$ o negativo si riporta tra $0^\circ$ e $360^\circ$ togliendo o aggiungendo giri interi: $750^\circ$ ha gli stessi valori di $30^\circ$.

Per gli altri angoli serve la calcolatrice, e il risultato è un decimale arrotondato.

```ad-error
Errori frequenti
- Usare la calcolatrice nella modalità sbagliata: in gradi (DEG) $\sin 30 = 0{,}5$, in radianti (RAD) circa $-0{,}988$.
- Dimenticare il segno del quadrante: $\cos 150^\circ$ è negativo, anche se $\cos 30^\circ$ è positivo.
- Scrivere un valore per $\operatorname{tg} 90^\circ$: il coseno vale zero, quindi la tangente non esiste.
```

## Domande frequenti

### Perché si scrive tg e non tan?

Sono la stessa funzione. Nei libri italiani si usa tg, sulle calcolatrici e nei libri inglesi tan. Allo stesso modo cotg si trova scritto anche cot.

### Qual è la relazione tra seno e coseno?

Il punto $P$ sta su una circonferenza di raggio 1, quindi per il teorema di Pitagora vale sempre $\sin^2\alpha + \cos^2\alpha = 1$. Serve per trovare il coseno quando si conosce il seno.
