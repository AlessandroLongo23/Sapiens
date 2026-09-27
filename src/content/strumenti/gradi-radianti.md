# Conversione da gradi a radianti

## Che cos'è il radiante

Il grado è la trecentosessantesima parte dell'angolo giro. Il radiante misura invece un angolo con la circonferenza: un angolo di 1 radiante, con il vertice nel centro, stacca un arco lungo quanto il raggio. L'angolo giro stacca tutta la circonferenza, lunga $2\pi r$, quindi misura $2\pi$ radianti; l'angolo piatto ne misura $\pi$.

Da qui viene la proporzione che lega le due misure:

$$\alpha^\circ : 180^\circ = \alpha_{\text{rad}} : \pi$$

In goniometria gli angoli si scrivono quasi sempre in radianti, lasciando $\pi$ indicato: $\frac{\pi}{4}$ è un valore esatto, mentre $0{,}7854$ è già arrotondato.

## Come si fa a mano

Da gradi a radianti moltiplica per $\frac{\pi}{180}$ e semplifica la frazione; da radianti a gradi moltiplica per $\frac{180^\circ}{\pi}$.

```ad-example
Esempio: 45° in radianti
$45 \cdot \frac{\pi}{180} = \frac{45\pi}{180} = \frac{\pi}{4}$, perché $45$ sta $4$ volte in $180$. Con $\pi \approx 3{,}1416$ sono circa $0{,}7854$ radianti.
```

```ad-example
Esempio: 3π/4 in gradi
$\frac{3\pi}{4} \cdot \frac{180^\circ}{\pi} = \frac{3 \cdot 180^\circ}{4} = 135^\circ$: il $\pi$ si semplifica.
```

Se l'angolo è scritto in gradi, primi e secondi, porta prima tutto in gradi: un primo è $\frac{1}{60}$ di grado e un secondo $\frac{1}{3600}$, quindi $22^\circ\,30' = 22{,}5^\circ$. Al contrario, da $77{,}1429^\circ$ si ottengono i primi moltiplicando la parte decimale per 60: $0{,}1429 \cdot 60 \approx 8{,}57$, cioè $8'$ e circa $34''$.

```ad-error
Errori frequenti
- Scrivere il valore decimale quando l'esercizio chiede il risultato esatto: $\frac{\pi}{6}$, non $0{,}52$.
- Leggere $22^\circ\,30'$ come $22{,}30^\circ$: trenta primi sono mezzo grado, quindi $22{,}5^\circ$.
- Dimenticare che un radiante senza $\pi$ è un numero come gli altri: $1\ \text{rad}$ è circa $57{,}3^\circ$, non $180^\circ$.
```

## Domande frequenti

### Quali sono gli angoli da sapere a memoria?

$30^\circ = \frac{\pi}{6}$, $45^\circ = \frac{\pi}{4}$, $60^\circ = \frac{\pi}{3}$, $90^\circ = \frac{\pi}{2}$, $180^\circ = \pi$ e $360^\circ = 2\pi$. Gli altri si ottengono sommando o moltiplicando questi.

### Perché la calcolatrice dà risultati strani con seno e coseno?

Probabilmente è impostata sull'unità sbagliata: $\sin 30$ vale $0{,}5$ in gradi (DEG) e circa $-0{,}988$ in radianti (RAD). Controlla la modalità prima di calcolare.
