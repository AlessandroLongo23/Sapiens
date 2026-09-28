# Formulario: Lunghezza della circonferenza e area del cerchio

## Pi greco

Rapporto tra circonferenza e diametro, lo stesso per ogni circonferenza; è irrazionale.

$$\pi = 3{,}14159\ldots \approx 3{,}14$$

Risultato esatto con $\pi$ ($12\pi$ cm); approssimato con $\pi \approx 3{,}14$ solo se richiesto, e nell'ultimo passaggio.

## Circonferenza e cerchio

$$C = 2\pi r = \pi d$$

$$A = \pi r^2$$

- $r = 5$ cm: $C = 10\pi$ cm, $A = 25\pi\ \text{cm}^2$.
- Dalla circonferenza al raggio: $2\pi r = 18\pi$ dà $r = 9$. Dall'area al raggio: $\pi r^2 = 49\pi$ dà $r = 7$.
- Raggio doppio: circonferenza doppia, area quadrupla.

## Arco e settore

Proporzione con l'angolo al centro $\alpha$ in gradi:

$$\ell = \frac{2\pi r \cdot \alpha}{360^\circ}$$

$$A_{\text{settore}} = \frac{\pi r^2 \cdot \alpha}{360^\circ} = \frac{\ell \cdot r}{2}$$

```tikz
% nome: settore-circolare-angolo
% alt: Cerchio di centro O e raggio r con il settore circolare AOB colorato, di angolo al centro alfa
% svg: settore-circolare-angolo-6db498b7.svg 133x135
\begin{tikzpicture}
\fill[blue!15] (0.00,0.00) -- (1.41,0.51) arc[start angle=20, end angle=80, radius=1.50] -- cycle;
\draw[thick] (0.00,0.00) circle (1.50);
\draw (1.41,0.51) -- (0.00,0.00) -- (0.26,1.48);
\draw[thin] (0.33,0.12) arc[start angle=20.00, delta angle=60.00, radius=0.35];
\node[font=\small] at (0.35,0.42) {$\alpha$};
\fill (0.00,0.00) circle (0.06);
\node at (-0.17,-0.20) {$O$};
\fill (1.41,0.51) circle (0.06);
\node at (1.67,0.61) {$A$};
\fill (0.26,1.48) circle (0.06);
\node at (0.31,1.75) {$B$};
\node[font=\small] at (0.77,0.07) {$r$};
\end{tikzpicture}
```

Esempio: $r = 6$, $\alpha = 60^\circ$: $\ell = 2\pi$, $A_{\text{settore}} = 6\pi$.

## Corona circolare

Tra due circonferenze concentriche di raggi $R > r$:

$$A_{\text{corona}} = \pi (R^2 - r^2)$$

## Segmento circolare

$$A_{\text{segmento}} = A_{\text{settore}} - A_{\text{triangolo}}$$

- $\alpha = 90^\circ$: il triangolo è rettangolo con cateti $r$; con $r = 6$, $9\pi - 18$.
- $\alpha = 60^\circ$: il triangolo è equilatero di lato $r$; con $r = 6$, $6\pi - 9\sqrt{3}$.

```ad-warning
Diametro al posto del raggio
Con $d = 10$ l'area è $\pi \cdot 5^2 = 25\pi$, non $\pi \cdot 10^2 = 100\pi$.
```

```ad-warning
Quadrato del raggio
$\pi r^2$ con $r = 4$ è $16\pi$; $2\pi r = 8\pi$ è la circonferenza.
```

```ad-warning
Corona con i quadrati
$\pi (R^2 - r^2)$, non $\pi (R - r)^2$: con $R = 5$ e $r = 3$ è $16\pi$, non $4\pi$.
```
