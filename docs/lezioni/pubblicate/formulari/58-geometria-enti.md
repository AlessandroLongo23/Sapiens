# Formulario: Enti geometrici, segmenti e angoli

## Enti primitivi e postulati

- Enti primitivi, che non si definiscono: punto ($A$, $B$), retta ($r$, $s$), piano ($\alpha$, $\beta$).
- Postulati: proprietà accettate senza dimostrazione. Teoremi: proprietà dimostrate.
- Appartenenza: per due punti distinti passa una e una sola retta; quindi due rette distinte hanno al massimo un punto in comune (incidenti).
- Ordine: la retta è ordinata, illimitata nei due versi e densa (tra due punti ce n'è sempre un altro).
- Allineati: punti che stanno su una stessa retta.

## Semirette e segmenti

- Semiretta di origine $O$: una delle due parti in cui $O$ divide la retta, con $O$. Due semirette opposte stanno sulla stessa retta e hanno la stessa origine.
- Segmento $AB$: $A$, $B$ e i punti della retta $AB$ compresi tra loro.
- Consecutivi: hanno in comune solo un estremo. Adiacenti: consecutivi e sulla stessa retta.
- Punto medio $M$ di $AB$: $AM \cong MB$, e $AM = \dfrac{AB}{2}$.
- Somma: $AB + CD = AE$, con $BE \cong CD$ sul prolungamento di $AB$.

## Figure e congruenza

- Figura convessa: il segmento tra due suoi punti qualsiasi sta tutto nella figura; altrimenti concava.
- Congruenti ($\cong$): si sovrappongono con un movimento rigido. Hanno la stessa misura.

## Angoli

- Angolo $\widehat{AOB}$: il vertice $O$ sta in mezzo, $A$ e $B$ sono punti dei due lati. Se non si dice altro, è il convesso.
- Consecutivi: stesso vertice, un lato in comune, nessun altro punto comune. Adiacenti: consecutivi, con i lati non comuni opposti.
- Bisettrice: semiretta dal vertice che divide l'angolo in due angoli congruenti.

| Angolo | Misura |
|---|---|
| nullo | $0^\circ$ |
| acuto | tra $0^\circ$ e $90^\circ$ |
| retto | $90^\circ$ |
| ottuso | tra $90^\circ$ e $180^\circ$ |
| piatto | $180^\circ$ |
| concavo | tra $180^\circ$ e $360^\circ$ |
| giro | $360^\circ$ |

$$
\begin{gathered}
1^\circ = 60' \qquad 1' = 60''
\end{gathered}
$$

$$
\begin{aligned}
&90^\circ - 37^\circ 25' \\
&= 89^\circ 60' - 37^\circ 25' \\
&= 52^\circ 35'
\end{aligned}
$$

## Complementari, supplementari, opposti al vertice

- Complementari: somma $90^\circ$; il complementare di $\alpha$ è $90^\circ - \alpha$.
- Supplementari: somma $180^\circ$; il supplementare di $\alpha$ è $180^\circ - \alpha$. Due angoli adiacenti sono supplementari.
- Esplementari: somma $360^\circ$.
- Opposti al vertice: i lati dell'uno sono i prolungamenti dei lati dell'altro. Sono congruenti: $\alpha \cong \beta$, perché entrambi sono supplementari di $\gamma$.
- Le bisettrici di due angoli adiacenti formano un angolo retto.

```tikz
% nome: angoli-opposti-al-vertice
% alt: Due rette che si incontrano nel punto O formano quattro angoli; alfa, a destra, e beta, a sinistra, sono opposti al vertice e segnati con archetti uguali; gamma, in alto, è adiacente a entrambi
% svg: angoli-opposti-al-vertice-3131c302.svg 162x95
\begin{tikzpicture}
\draw[thick] (205:2.3) -- (25:2.3);
\draw[thick] (150:2.3) -- (330:2.3);
\fill (0,0) circle (0.06);
\node[below] at (0,-0.12) {$O$};
\draw[blue!60!black] (330:0.55) arc (-30:25:0.55);
\draw[blue!60!black] (150:0.55) arc (150:205:0.55);
\draw[orange!80!black] (25:0.75) arc (25:150:0.75);
\node at (357.5:0.9) {$\alpha$};
\node at (177.5:0.9) {$\beta$};
\node at (87.5:1.05) {$\gamma$};
\end{tikzpicture}
```

```ad-warning
Consecutivi non vuol dire adiacenti
Gli adiacenti sono consecutivi e in più stanno sulla stessa retta (segmenti) o hanno i lati non comuni opposti (angoli).
```

```ad-warning
I primi non sono decimali
$37^\circ 30' = 37{,}5^\circ$, non $37{,}30^\circ$: un primo è $\frac{1}{60}$ di grado.
```

```ad-warning
Il vertice va in mezzo
In $\widehat{AOB}$ il vertice è $O$; $\widehat{OAB}$ è un altro angolo, con il vertice in $A$.
```
