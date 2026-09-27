# Risoluzione di un triangolo qualsiasi

## Che cos'è

Risolvere un triangolo vuol dire trovare i lati e gli angoli che mancano partendo da tre elementi noti, di cui almeno uno è un lato.

La notazione è quella dei libri: il lato $a$ è opposto al vertice $A$ e all'angolo $\alpha$, il lato $b$ al vertice $B$ e all'angolo $\beta$, il lato $c$ al vertice $C$ e all'angolo $\gamma$.

## Come si calcola a mano

Servono due teoremi. Il teorema dei seni dice che ogni lato diviso il seno dell'angolo opposto dà sempre lo stesso numero:

$$\frac{a}{\sin\alpha} = \frac{b}{\sin\beta} = \frac{c}{\sin\gamma}$$

Il teorema del coseno generalizza quello di Pitagora:

$$a^2 = b^2 + c^2 - 2bc\cos\alpha$$

Con tre lati, o due lati e l'angolo tra loro, si parte dal teorema del coseno. Con un lato e due angoli si trova il terzo angolo, poi si usa il teorema dei seni.

```ad-example
Esempio: b = 5, c = 8 e α = 60°
Trova il terzo lato con il teorema del coseno:

$$\begin{aligned}
a^2 &= 5^2 + 8^2 - 2 \cdot 5 \cdot 8 \cdot \cos 60^\circ \\[6pt]
&= 25 + 64 - 80 \cdot \frac{1}{2} = 49 \\[6pt]
a &= \sqrt{49} = 7
\end{aligned}$$

Poi un angolo, ancora con il teorema del coseno, e l'ultimo per differenza:

$$\begin{aligned}
\cos\beta &= \frac{49 + 64 - 25}{2 \cdot 7 \cdot 8} = \frac{11}{14} \\[6pt]
\beta &\approx 38{,}21^\circ \\[6pt]
\gamma &\approx 180^\circ - 60^\circ - 38{,}21^\circ = 81{,}79^\circ
\end{aligned}$$
```

## Il caso ambiguo

Con due lati e l'angolo opposto a uno di loro, il teorema dei seni dà il seno di un angolo, e due angoli hanno lo stesso seno: $\beta$ e $180^\circ - \beta$. Per questo i triangoli possono essere due, uno o nessuno. Il secondo va bene solo se la somma con l'angolo noto resta sotto $180^\circ$.

```ad-error
Errori frequenti
- Usare il teorema dei seni per trovare un angolo ottuso: la calcolatrice dà solo angoli acuti con $\sin^{-1}$.
- Dimenticare il segno meno nel teorema del coseno, o il 2 davanti a $bc$.
- Non controllare i dati: un lato più lungo della somma degli altri due, o due angoli che sommano più di $180^\circ$, non danno nessun triangolo.
```

## Domande frequenti

### Quando uso il teorema dei seni e quando quello del coseno?

Il teorema dei seni lega due lati e i due angoli opposti: serve quando conosci una coppia lato e angolo opposto. Il teorema del coseno lega i tre lati e un angolo: serve con tre lati, o con due lati e l'angolo compreso.

### Se l'angolo è retto?

Il coseno di $90^\circ$ vale zero, e il teorema del coseno diventa il teorema di Pitagora.
