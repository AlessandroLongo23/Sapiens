# Formulario: Il momento d'inerzia

## Massa puntiforme e sistemi di masse

Una massa $m$ a distanza $r$ dall'asse:

$$I = m\,r^2$$

Più masse puntiformi:

$$I = m_1 r_1^2 + m_2 r_2^2 + m_3 r_3^2 + \ldots$$

- Unità di misura: $\text{kg} \cdot \text{m}^2$.
- Le distanze si misurano dall'asse di rotazione; una massa sull'asse non contribuisce.
- Lo stesso corpo ha momenti d'inerzia diversi rispetto ad assi diversi.
- Per una massa sola $M = (m\,r^2)\,\alpha$: a parità di momento, più grande è $I$, più piccola è $\alpha$.

## Corpi estesi omogenei

```tikz
% nome: momenti-inerzia-corpi-estesi
% alt: Sei corpi omogenei, ognuno con il suo asse di rotazione disegnato a tratto e punto e la formula del momento d'inerzia. In alto: un anello sottile con l'asse per il centro perpendicolare al suo piano, M R al quadrato; un disco pieno con lo stesso asse, un mezzo di M R al quadrato; una sfera piena con l'asse per il centro, due quinti di M R al quadrato. In basso: un'asta sottile con l'asse perpendicolare per il centro, un dodicesimo di M L al quadrato; un'asta sottile con l'asse perpendicolare per un estremo, un terzo di M L al quadrato; una lamina rettangolare, come una porta, con l'asse lungo un lato, un terzo di M a al quadrato, dove a è il lato perpendicolare all'asse
% svg: momenti-inerzia-corpi-estesi-175ec5e0.svg 318x261
\begin{tikzpicture}
\draw[very thick] (0,0) ellipse (0.9 and 0.3);
\draw[thin, dash dot] (0,-0.8) -- (0,1.0);
\node at (0,-1.2) {$M R^2$};
\node at (0,-1.75) {\small anello};
\draw[thick, fill=gray!20] (3,0) ellipse (0.9 and 0.3);
\draw[thin, dash dot] (3,-0.8) -- (3,1.0);
\node at (3,-1.2) {$\frac{1}{2} M R^2$};
\node at (3,-1.75) {\small disco};
\draw[thick, fill=gray!20] (6,0.1) circle (0.75);
\draw[thin, dashed] (6,0.1) ellipse (0.75 and 0.2);
\draw[thin, dash dot] (6,-0.8) -- (6,1.1);
\node at (6,-1.2) {$\frac{2}{5} M R^2$};
\node at (6,-1.75) {\small sfera};
\draw[thick, fill=blue!10] (-1,-3.76) rectangle (1,-3.64);
\draw[thin, dash dot] (0,-4.5) -- (0,-2.8);
\node at (0,-4.9) {$\frac{1}{12} M L^2$};
\node at (0,-5.45) {\small asta, per il centro};
\draw[thick, fill=blue!10] (2.4,-3.76) rectangle (4.4,-3.64);
\draw[thin, dash dot] (2.4,-4.5) -- (2.4,-2.8);
\node at (3.4,-4.9) {$\frac{1}{3} M L^2$};
\node at (3.4,-5.45) {\small asta, per un estremo};
\draw[thick, fill=blue!10] (5.8,-4.2) rectangle (6.9,-3.1);
\draw[thin, dash dot] (5.8,-4.55) -- (5.8,-2.4);
\draw[|-|, thin] (5.8,-2.85) -- (6.9,-2.85);
\node[above] at (6.35,-2.85) {\small $a$};
\node at (6.35,-4.9) {$\frac{1}{3} M a^2$};
\node at (6.35,-5.45) {\small lamina};
\end{tikzpicture}
```

| Corpo | Asse | $I$ |
|---|---|---|
| Anello sottile, cilindro cavo sottile | per il centro, perpendicolare al piano | $M R^2$ |
| Disco, cilindro pieno | per il centro, perpendicolare al disco | $\frac{1}{2} M R^2$ |
| Sfera piena | per il centro | $\frac{2}{5} M R^2$ |
| Sfera cava sottile | per il centro | $\frac{2}{3} M R^2$ |
| Asta sottile lunga $L$ | perpendicolare, per il centro | $\frac{1}{12} M L^2$ |
| Asta sottile lunga $L$ | perpendicolare, per un estremo | $\frac{1}{3} M L^2$ |
| Lamina rettangolare (porta) | lungo un lato; $a$ è l'altro lato | $\frac{1}{3} M a^2$ |

## Teorema di Huygens-Steiner

$$I = I_{cm} + M\,d^2$$

- $I_{cm}$: momento d'inerzia rispetto all'asse parallelo che passa per il centro di massa.
- $d$: distanza tra i due assi.
- Disco rispetto a un asse sul bordo, perpendicolare al disco: $I = \frac{1}{2} M R^2 + M R^2 = \frac{3}{2} M R^2$.

## Corpi composti

Il momento d'inerzia di un corpo fatto di più parti è la somma dei momenti d'inerzia delle parti, tutti rispetto allo stesso asse. Disco con una massa $m$ a distanza $r$ dal centro: $I = \frac{1}{2} M R^2 + m\,r^2$.

```ad-warning
Distanza in metri e al quadrato
In $m\,r^2$ si eleva al quadrato solo la distanza, scritta in metri.
```

```ad-warning
Ogni formula ha il suo asse
Prima di scegliere la formula della tabella si guarda dove passa l'asse di rotazione.
```

```ad-warning
Huygens-Steiner parte dal centro di massa
Il primo termine è sempre $I_{cm}$, e i due assi devono essere paralleli.
```
