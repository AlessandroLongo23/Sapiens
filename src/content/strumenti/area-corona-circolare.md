# Area della corona circolare

## Che cos'è

La corona circolare è la parte di piano compresa tra due circonferenze con lo stesso centro.

Ha la forma di un anello, o di una rondella. Il raggio della circonferenza esterna si indica con $R$, quello della circonferenza interna con $r$, e $R$ è sempre più lungo di $r$.

## Come si calcola a mano

```ad-example
Raggi di 10 cm e 6 cm
L'area della corona è l'area del cerchio grande meno quella del cerchio piccolo. Raccogli $\pi$ e sostituisci:

$$\begin{aligned}
A &= \pi R^2 - \pi r^2 = \pi\left(R^2 - r^2\right) \\[6pt]
&= \pi\left(10^2 - 6^2\right) = \pi\,(100 - 36) \\[6pt]
&= 64\pi \text{ cm}^2 \approx 201{,}06 \text{ cm}^2
\end{aligned}$$
```

Raccogliere $\pi$ fa risparmiare conti: si sottraggono i quadrati dei raggi e si moltiplica per $\pi$ una volta sola. Il risultato esatto resta con $\pi$, e il decimale si scrive accanto.

Se il problema dà i diametri, dividili per $2$ prima di cominciare: con diametri di $26$ cm e $10$ cm i raggi sono $13$ cm e $5$ cm, e l'area è $\pi\,(169 - 25) = 144\pi$ cm².

Il perimetro della corona è la somma delle due circonferenze, $2\pi R + 2\pi r = 2\pi(R + r)$. Nel primo esempio viene $32\pi \approx 100{,}53$ cm.

```ad-error
Errori frequenti
- Sottrarre i raggi prima di elevarli al quadrato: $\pi\,(10 - 6)^2 = 16\pi$ non è l'area della corona.
- Usare i diametri nella formula dei raggi: l'area viene quattro volte più grande.
- Scambiare i due raggi: $R^2 - r^2$ deve essere positivo.
```

## Domande frequenti

### Esiste un modo per calcolarla senza i raggi?

Sì. Se conosci la corda della circonferenza esterna che tocca quella interna, metà di quella corda è un cateto di un triangolo rettangolo con ipotenusa $R$ e altro cateto $r$. Per il teorema di Pitagora $R^2 - r^2$ è il quadrato di metà corda, e l'area è $\pi$ per quel quadrato.

### Che cosa succede se i raggi sono uguali?

Le due circonferenze coincidono e la corona non ha spessore: la sua area è zero.
