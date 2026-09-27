# Conversione da gradi a radianti

## Che cos'è il radiante

Un angolo misura 1 radiante quando, con il vertice nel centro di una circonferenza, stacca un arco lungo quanto il raggio.

Per esempio, l'angolo giro stacca tutta la circonferenza, lunga $2\pi r$: contiene il raggio $2\pi$ volte, quindi misura $2\pi$ radianti. L'angolo piatto ne misura la metà:

$$360^\circ = 2\pi\ \text{rad} \qquad 180^\circ = \pi\ \text{rad}$$

Il grado, invece, è la trecentosessantesima parte dell'angolo giro.

## Un esempio svolto

```ad-example
Esempio: 45° in radianti
Moltiplica i gradi per $\pi$ e dividi per 180:

$$45 \cdot \frac{\pi}{180} = \frac{45\pi}{180}$$

Semplifica la frazione: 45 sta 4 volte in 180.

$$\frac{45\pi}{180} = \frac{\pi}{4}$$

Se ti serve il numero, usa $\pi \approx 3{,}1416$:

$$\frac{\pi}{4} \approx 0{,}7854$$
```

## La regola generale

Gradi e radianti sono proporzionali, perché $180^\circ$ corrispondono a $\pi$ radianti:

$$\alpha^\circ : 180^\circ = \alpha_{\text{rad}} : \pi$$

Da gradi a radianti moltiplica per $\frac{\pi}{180}$ e semplifica la frazione. Da radianti a gradi moltiplica per $\frac{180^\circ}{\pi}$.

In goniometria gli angoli si scrivono quasi sempre in radianti, lasciando $\pi$ indicato. $\frac{\pi}{4}$ è un valore esatto, mentre $0{,}7854$ è già arrotondato.

```ad-example
Esempio: 3π/4 in gradi
Moltiplica per $\frac{180^\circ}{\pi}$. Il $\pi$ sopra e quello sotto si semplificano:

$$\frac{3\pi}{4} \cdot \frac{180^\circ}{\pi} = \frac{3 \cdot 180^\circ}{4} = 135^\circ$$
```

## Gradi, primi e secondi

Un grado si divide in 60 primi, e un primo in 60 secondi. Quindi un primo è $\frac{1}{60}$ di grado e un secondo è $\frac{1}{3600}$ di grado.

Per portare tutto in gradi, dividi i primi per 60 e i secondi per 3600:

$$22^\circ\,30' = 22 + \frac{30}{60} = 22{,}5^\circ$$

Al contrario, tieni i gradi interi e moltiplica per 60 la parte decimale: ottieni i primi. Per esempio, con $77{,}1429^\circ$:

$$0{,}1429 \cdot 60 \approx 8{,}57$$

Sono 8 primi. Moltiplica ancora per 60 la parte decimale dei primi, e ottieni circa 34 secondi:

$$77{,}1429^\circ \approx 77^\circ\,8'\,34''$$

```ad-error
Errori frequenti
- Scrivere il valore decimale quando l'esercizio chiede il risultato esatto: $\frac{\pi}{6}$, non $0{,}52$.
- Leggere $22^\circ\,30'$ come $22{,}30^\circ$: trenta primi sono mezzo grado, quindi $22{,}5^\circ$.
- Dimenticare che un radiante senza $\pi$ è un numero come gli altri: $1\ \text{rad}$ è circa $57{,}3^\circ$, non $180^\circ$.
```

## Domande frequenti

### Quali sono gli angoli da sapere a memoria?

Questi, da cui si ottengono gli altri sommando o moltiplicando:

$$30^\circ = \frac{\pi}{6} \qquad 45^\circ = \frac{\pi}{4} \qquad 60^\circ = \frac{\pi}{3}$$
$$90^\circ = \frac{\pi}{2} \qquad 180^\circ = \pi \qquad 360^\circ = 2\pi$$

### Perché la calcolatrice dà risultati strani con seno e coseno?

Probabilmente è impostata sull'unità sbagliata. Il seno di 30 vale 0,5 se la calcolatrice lavora in gradi (DEG), e circa $-0{,}988$ se lavora in radianti (RAD). Controlla la modalità prima di calcolare.
