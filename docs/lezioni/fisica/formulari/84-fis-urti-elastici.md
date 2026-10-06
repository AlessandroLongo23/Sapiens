# Formulario: Gli urti elastici in una e in due dimensioni

## Urto elastico

Si conservano la quantità di moto totale e l'energia cinetica totale:

$$m_1\vec{v}_1 + m_2\vec{v}_2 = m_1\vec{V}_1 + m_2\vec{V}_2 \qquad \frac{1}{2} m_1 v_1^2 + \frac{1}{2} m_2 v_2^2 = \frac{1}{2} m_1 V_1^2 + \frac{1}{2} m_2 V_2^2$$

## Lungo una retta

Velocità finali (le velocità iniziali con il loro segno):

$$V_1 = \frac{(m_1 - m_2)\,v_1 + 2 m_2 v_2}{m_1 + m_2} \qquad V_2 = \frac{(m_2 - m_1)\,v_2 + 2 m_1 v_1}{m_1 + m_2}$$

La velocità relativa si inverte:

$$v_1 - v_2 = -(V_1 - V_2)$$

## Bersaglio fermo

$$V_1 = \frac{m_1 - m_2}{m_1 + m_2}\,v_1 \qquad V_2 = \frac{2 m_1}{m_1 + m_2}\,v_1$$

| Masse | Proiettile | Bersaglio |
|---|---|---|
| $m_1 = m_2$ | $V_1 = 0$ | $V_2 = v_1$ |
| $m_1$ molto più grande di $m_2$ | $V_1 \approx v_1$ | $V_2 \approx 2 v_1$ |
| $m_1$ molto più piccolo di $m_2$ | $V_1 \approx -v_1$ | $V_2 \approx 0$ |

- Proiettile più pesante: prosegue in avanti. Più leggero: torna indietro.

## Nel piano, bersaglio fermo

Asse $x$ nella direzione del proiettile; $\theta_1$ e $\theta_2$ da parti opposte dell'asse:

$$m_1 v_1 = m_1 V_1 \cos\theta_1 + m_2 V_2 \cos\theta_2 \qquad 0 = m_1 V_1 \sin\theta_1 - m_2 V_2 \sin\theta_2$$

$$\frac{1}{2} m_1 v_1^2 = \frac{1}{2} m_1 V_1^2 + \frac{1}{2} m_2 V_2^2$$

Tre equazioni, quattro incognite: un dato (di solito un angolo) viene dal problema.

## Masse uguali, bersaglio fermo

$$\theta_1 + \theta_2 = 90^\circ \qquad V_1 = v_1 \cos\theta_1 \qquad V_2 = v_1 \sin\theta_1$$

```tikz
% nome: triangolo-velocita-urto
% alt: Un triangolo rettangolo fatto con tre vettori velocità: l'ipotenusa orizzontale è v 1, lunga 4 centimetri; dal suo primo estremo parte V 1, inclinata di 30 gradi verso l'alto, e dalla punta di V 1 parte V 2, che scende fino alla punta di v 1. Tra V 1 e V 2 c'è il simbolo dell'angolo retto, e tra v 1 e V 1 l'angolo teta 1
\begin{tikzpicture}
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (4,0) node[midway, below] {$\vec{v}_1$};
\draw[-{Stealth}, thick, blue!60!black] (0,0) -- (3,1.732) node[midway, above left] {$\vec{V}_1$};
\draw[-{Stealth}, thick, blue!60!black] (3,1.732) -- (4,0) node[midway, right] {$\vec{V}_2$};
\draw[thin] (2.827,1.632) -- (2.927,1.459) -- (3.1,1.559);
\draw[thin] (0.9,0) arc[start angle=0, end angle=30, radius=0.9];
\node at (1.25,0.3) {\small $\theta_1$};
\end{tikzpicture}
```

```ad-warning
Il segno delle velocità
Una velocità opposta all'asse entra nelle formule con il segno meno; il segno del risultato dà il verso dopo l'urto.
```

```ad-warning
La regola dei 90 gradi
Vale solo con urto elastico, masse uguali e bersaglio fermo.
```

```ad-warning
Si conserva l'energia cinetica totale
Non quella di ogni corpo: il proiettile la cede tutta al bersaglio solo se le masse sono uguali.
```
