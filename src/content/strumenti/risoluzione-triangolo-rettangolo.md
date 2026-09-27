# Risoluzione del triangolo rettangolo

## Che cos'è

Risolvere un triangolo rettangolo vuol dire trovare tutti i suoi lati e i suoi angoli partendo da due elementi noti, di cui almeno uno è un lato.

Si usa la notazione dei libri: l'angolo retto è in $A$, l'ipotenusa è $a$, i cateti sono $b$ e $c$. L'angolo $\beta$ è opposto al cateto $b$, l'angolo $\gamma$ al cateto $c$.

## Come si calcola a mano

Servono tre regole, i teoremi sui triangoli rettangoli:

$$\begin{aligned}
b &= a \sin\beta = a \cos\gamma \\[6pt]
b &= c \operatorname{tg}\beta \\[6pt]
\beta + \gamma &= 90^\circ
\end{aligned}$$

A parole: un cateto è l'ipotenusa per il seno dell'angolo opposto, o per il coseno dell'angolo adiacente. Un cateto è l'altro cateto per la tangente dell'angolo opposto al primo. Gli angoli acuti sono complementari.

```ad-example
Esempio: ipotenusa 12 cm e β = 30°
Trova prima l'angolo che manca, poi i due cateti:

$$\begin{aligned}
\gamma &= 90^\circ - 30^\circ = 60^\circ \\[6pt]
b &= 12 \cdot \sin 30^\circ = 12 \cdot \frac{1}{2} = 6 \text{ cm} \\[6pt]
c &= 12 \cdot \cos 30^\circ = 12 \cdot \frac{\sqrt{3}}{2} = 6\sqrt{3} \text{ cm}
\end{aligned}$$
```

Quando i dati sono due lati, il terzo si trova con il teorema di Pitagora. Per l'angolo si calcola prima una funzione goniometrica, poi l'angolo con la funzione inversa della calcolatrice (i tasti $\sin^{-1}$, $\cos^{-1}$, $\tan^{-1}$).

```ad-example
Esempio: cateti di 6 e 8 cm
$$\begin{aligned}
a &= \sqrt{6^2 + 8^2} = \sqrt{100} = 10 \text{ cm} \\[6pt]
\operatorname{tg}\beta &= \frac{6}{8} = 0{,}75 \\[6pt]
\beta &= \operatorname{arctg} 0{,}75 \approx 36{,}87^\circ \\[6pt]
\gamma &\approx 90^\circ - 36{,}87^\circ = 53{,}13^\circ
\end{aligned}$$
```

```ad-error
Errori frequenti
- Confondere l'angolo opposto con quello adiacente: il seno va con l'angolo opposto al cateto, il coseno con quello adiacente.
- Lasciare la calcolatrice in radianti quando gli angoli sono in gradi.
- Scrivere un cateto più lungo dell'ipotenusa: se succede, c'è un errore nei conti o nei dati.
```

## Domande frequenti

### Perché servono due elementi?

Con un solo lato ci sono infiniti triangoli rettangoli, più o meno schiacciati. Con i soli angoli ci sono infiniti triangoli simili, più grandi o più piccoli. Un lato e un altro elemento fissano il triangolo.

### Come si scrive un angolo in gradi e primi?

La calcolatrice dà l'angolo in gradi decimali, come $36{,}87^\circ$. Per scriverlo in gradi, primi e secondi moltiplica per 60 la parte decimale: $36{,}87^\circ \approx 36^\circ\,52'\,12''$.
