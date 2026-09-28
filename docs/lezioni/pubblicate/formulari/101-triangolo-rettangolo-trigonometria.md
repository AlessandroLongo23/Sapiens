# Formulario: Seno, coseno e tangente nel triangolo rettangolo

## Definizioni

Triangolo $ABC$ rettangolo in $C$: ipotenusa $c = \overline{AB}$, cateti $a = \overline{BC}$ (opposto ad $\alpha$) e $b = \overline{AC}$ (adiacente ad $\alpha$), $\alpha + \beta = 90^\circ$.

```tikz
% nome: triangolo-rettangolo-cateto-opposto-adiacente
% alt: Triangolo ABC rettangolo in C con l'angolo alfa in A: l'ipotenusa AB è c, il cateto BC opposto ad alfa è a, il cateto AC adiacente ad alfa è b
% svg: triangolo-rettangolo-cateto-opposto-adiacente-f01b05a0.svg 209x125
\begin{tikzpicture}[scale=0.85]
\fill[blue!8] (0.00,0.00) -- (4.20,2.40) -- (4.20,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (4.20,2.40) -- (4.20,0.00) -- cycle;
\draw (4.02,0.00) -- (4.02,0.18) -- (4.20,0.18);
\draw[black] (0.55,0.00) arc[start angle=0.00, delta angle=29.74, radius=0.55];
\node[below left] at (0.00,0.00) {$A$};
\node[above] at (4.20,2.40) {$B$};
\node[below right] at (4.20,0.00) {$C$};
\node at (0.80,0.20) {\small $\alpha$};
\node[above left] at (2.10,1.20) {\small ipotenusa $c$};
\node[right] at (4.20,1.20) {\small \shortstack{cateto\\opposto\\ad $\alpha$: $a$}};
\node[below] at (2.10,-0.30) {\small cateto adiacente ad $\alpha$: $b$};
\end{tikzpicture}
```

Seno: cateto opposto diviso ipotenusa. Coseno: cateto adiacente diviso ipotenusa. Tangente: cateto opposto diviso cateto adiacente.

$$
\begin{gathered}
\sin\alpha = \frac{a}{c} \qquad \cos\alpha = \frac{b}{c} \\
\tan\alpha = \frac{a}{b}
\end{gathered}
$$

- Dipendono solo dall'angolo: i triangoli rettangoli con lo stesso angolo acuto sono simili.
- Per un angolo acuto $0 < \sin\alpha < 1$ e $0 < \cos\alpha < 1$; $\tan\alpha$ è un numero positivo qualsiasi.
- Complementari: $\sin\beta = \cos\alpha$, $\cos\beta = \sin\alpha$, $\tan\beta = \dfrac{1}{\tan\alpha}$.

## Valori per 30°, 45° e 60°

| $\alpha$ | $\sin\alpha$ | $\cos\alpha$ | $\tan\alpha$ |
|---|---|---|---|
| $30^\circ$ | $\frac{1}{2}$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{3}}{3}$ |
| $45^\circ$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{2}}{2}$ | $1$ |
| $60^\circ$ | $\frac{\sqrt{3}}{2}$ | $\frac{1}{2}$ | $\sqrt{3}$ |

## Relazioni

$$
\begin{gathered}
\sin^2\alpha + \cos^2\alpha = 1 \\
\tan\alpha = \frac{\sin\alpha}{\cos\alpha}
\end{gathered}
$$

Con $\sin\alpha = \frac{1}{3}$: $\cos\alpha = \frac{2\sqrt{2}}{3}$, $\tan\alpha = \frac{\sqrt{2}}{4}$.

## Calcolatrice

- Modalità gradi: $D$ o $\text{DEG}$ sul display.
- Dall'angolo al valore: $\sin 35^\circ \approx 0{,}5736$.
- Dal valore all'angolo: $\sin^{-1}(0{,}4) \approx 23{,}58^\circ$; allo stesso modo $\cos^{-1}$ e $\tan^{-1}$.

## Risolvere un triangolo rettangolo

Servono due elementi, di cui almeno un lato.

- $a = c \cdot \sin\alpha$, $b = c \cdot \sin\beta$ (ipotenusa per il seno dell'angolo opposto).
- $b = c \cdot \cos\alpha$, $a = c \cdot \cos\beta$ (ipotenusa per il coseno dell'angolo adiacente).
- $a = b \cdot \tan\alpha$, $b = a \cdot \tan\beta$ (altro cateto per la tangente dell'angolo opposto).
- Un angolo da due lati: $\alpha = \sin^{-1}\left(\frac{a}{c}\right)$, $\alpha = \tan^{-1}\left(\frac{a}{b}\right)$.

Con $c = 8$ e $\alpha = 60^\circ$: $a = 4\sqrt{3}$, $b = 4$, $\beta = 30^\circ$.

## Problemi

- Angolo di elevazione: tra l'orizzontale e lo sguardo verso l'alto. Altezza $= \text{distanza} \cdot \tan(\text{elevazione})$, più l'altezza degli occhi.
- Pendenza $= \dfrac{\text{dislivello}}{\text{spostamento orizzontale}} = \tan\alpha$: $8\%$ vuol dire $\tan\alpha = 0{,}08$, $\alpha \approx 4{,}57^\circ$.

```ad-warning
Opposto e adiacente cambiano con l'angolo
Il cateto opposto ad $\alpha$ è adiacente a $\beta$.
```

```ad-warning
Calcolatrice in gradi
In radianti $\sin 30$ dà $-0{,}988$ invece di $0{,}5$.
```

```ad-warning
L'inversa non è 1 diviso il seno
$\sin^{-1}(0{,}5) = 30^\circ$, mentre $\dfrac{1}{\sin 30^\circ} = 2$.
```
