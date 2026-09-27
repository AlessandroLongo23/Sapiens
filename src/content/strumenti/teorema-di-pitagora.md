# Teorema di Pitagora

## Che cos'è

In un triangolo rettangolo i due lati che formano l'angolo retto sono i cateti, e il lato opposto è l'ipotenusa, sempre il più lungo dei tre. Il teorema di Pitagora dice che il quadrato costruito sull'ipotenusa ha la stessa area della somma dei quadrati costruiti sui cateti:

$$i^2 = c_1^2 + c_2^2$$

Vale solo per i triangoli rettangoli, ed è il modo per trovare un lato quando si conoscono gli altri due. Per questo compare dentro quasi tutti i problemi di geometria piana: la diagonale del rettangolo, il lato del rombo, il lato obliquo del trapezio.

## Come si calcola a mano

```ad-example
L'ipotenusa dai cateti
Cateti di 5 e 5 cm: $i^2 = 25 + 25 = 50$, quindi $i = \sqrt{50}$. Porta fuori dalla radice il fattore quadrato: $\sqrt{50} = \sqrt{5^2 \cdot 2} = 5\sqrt{2} \approx 7{,}07$ cm.
```

```ad-example
Un cateto dall'ipotenusa e dall'altro cateto
Ipotenusa di 13 cm e un cateto di 5 cm: $c_2^2 = 13^2 - 5^2 = 169 - 25 = 144$, quindi $c_2 = 12$ cm.
```

Quando tre numeri interi soddisfano il teorema formano una terna pitagorica: 3, 4, 5 e 5, 12, 13 sono le più usate. Moltiplicando una terna per lo stesso numero se ne ottiene un'altra, come 6, 8, 10. Riconoscerle risparmia i conti.

```ad-error
Errori frequenti
- Sommare i quadrati anche quando si cerca un cateto: in quel caso si sottrae il quadrato del cateto noto da quello dell'ipotenusa.
- Estrarre la radice di ogni termine: $\sqrt{9 + 16}$ fa 5, non $3 + 4 = 7$.
- Scambiare ipotenusa e cateto: se il lato cercato viene più lungo dell'ipotenusa c'è un errore.
```

## Domande frequenti

### Come capisco se un triangolo è rettangolo?

Vale anche il contrario del teorema: se il quadrato del lato più lungo è uguale alla somma dei quadrati degli altri due, il triangolo è rettangolo. Con 7, 24 e 25 cm: $49 + 576 = 625 = 25^2$, quindi sì.

### Perché il risultato ha una radice?

Perché spesso la somma dei quadrati non è un quadrato perfetto. Il risultato esatto resta con la radice, semplificata quando si può, e accanto si scrive il decimale.
