# Formulario: La trasformazione adiabatica

## Che cos'è

Trasformazione senza scambi di calore (pareti isolanti, oppure trasformazione rapida):

$$Q = 0 \qquad \Delta U = -W$$

- Espansione: $W > 0$, l'energia interna diminuisce, il gas si raffredda.
- Compressione: $W < 0$, l'energia interna aumenta, il gas si scalda.

## La legge dell'adiabatica

Legge di Poisson, per un'adiabatica quasistatica di un gas perfetto, con $\gamma = C_p / C_V$:

$$p\,V^\gamma = \text{costante} \qquad T\,V^{\gamma - 1} = \text{costante} \qquad T^{\gamma}\,p^{\,1 - \gamma} = \text{costante}$$

Tra lo stato $A$ e lo stato $B$:

$$p_B = p_A \left( \frac{V_A}{V_B} \right)^{\gamma} \qquad T_B = T_A \left( \frac{V_A}{V_B} \right)^{\gamma - 1}$$

| Gas perfetto | $C_V$ | $\gamma$ | $\gamma - 1$ |
|---|---|---|---|
| monoatomico | $\tfrac{3}{2} R$ | $\tfrac{5}{3} \approx 1{,}67$ | $\tfrac{2}{3}$ |
| biatomico (aria) | $\tfrac{5}{2} R$ | $\tfrac{7}{5} = 1{,}40$ | $0{,}40$ |

- Le temperature sono in kelvin.
- Le potenze si calcolano con il tasto $x^y$ della calcolatrice.

## Lavoro

$$W = n\,C_V\,(T_A - T_B) = \frac{p_A V_A - p_B V_B}{\gamma - 1}$$

Con le pressioni in pascal e i volumi in metri cubi il lavoro è in joule ($1\,\text{L} = 10^{-3}\,\text{m}^3$).

## Confronto con l'isoterma

```tikz
% nome: adiabatica-isoterma-piano-pv
% alt: Piano pressione-volume. Dallo stato A partono due curve che scendono verso destra: l'isoterma, un ramo di iperbole che arriva al punto B, e l'adiabatica, più ripida, che arriva al punto C, più in basso di B allo stesso volume. Una seconda isoterma, tratteggiata e più vicina agli assi, passa per C: è quella della temperatura finale dell'adiabatica, più bassa. A sinistra di A, verso i volumi piccoli, l'adiabatica sta sopra l'isoterma
% svg: adiabatica-isoterma-piano-pv-83ca9da7.svg 265x245
% poi-interattivo: trascinare il punto lungo le due curve e leggere pressione e temperatura
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (5,5);
\draw[->] (0,0) -- (5.4,0);
\node[below] at (5.3,-0.05) {$V$};
\draw[->] (0,0) -- (0,5.4) node[above] {$p$};
\draw[thin, dashed, blue!60, domain=0.6:5, samples=60, smooth] plot (\x, {2.268/\x});
\draw[thick, blue!60, domain=0.72:5, samples=60, smooth] plot (\x, {3.6/\x});
\draw[thick, red!80!black, domain=0.8:5, samples=60, smooth] plot (\x, {3.6/exp(1.6667*ln(\x))});
\draw[dashed, thin] (1,0) -- (1,3.6);
\draw[dashed, thin] (2,0) -- (2,1.8);
\fill (1,3.6) circle (0.06) node[above right] {$A$};
\fill (2,1.8) circle (0.06) node[above right] {$B$};
\fill (2,1.134) circle (0.06) node[below left] {$C$};
\node[below] at (1,0) {\small $V_A$};
\node[below] at (2,0) {\small $2V_A$};
\node[right, blue!60] at (5,0.85) {\small isoterma};
\node[right, red!80!black] at (5,0.2) {\small adiabatica};
\end{tikzpicture}
```

- In ogni punto l'adiabatica è più ripida dell'isoterma che passa di lì.
- In un'espansione dallo stesso stato l'adiabatica arriva a una pressione più bassa e compie meno lavoro.
- In una compressione l'adiabatica arriva a una pressione più alta.

## Le quattro trasformazioni

| Trasformazione | Resta costante | $Q$ | $W$ | $\Delta U$ |
|---|---|---|---|---|
| isocora | $V$ | $n\,C_V\,\Delta T$ | $0$ | $n\,C_V\,\Delta T$ |
| isobara | $p$ | $n\,C_p\,\Delta T$ | $p\,\Delta V$ | $n\,C_V\,\Delta T$ |
| isoterma | $T$ | $W$ | $nRT \ln \dfrac{V_B}{V_A}$ | $0$ |
| adiabatica | $p\,V^\gamma$ | $0$ | $-n\,C_V\,\Delta T$ | $n\,C_V\,\Delta T$ |

```ad-warning
Adiabatica non vuol dire a temperatura costante
È il calore a essere zero: la temperatura cambia, e $p_A V_A = p_B V_B$ non vale.
```

```ad-warning
Le temperature vanno in kelvin
In $T\,V^{\gamma - 1} = \text{costante}$ i gradi Celsius si convertono prima del conto.
```

```ad-warning
Il segno del lavoro
$W = n\,C_V\,(T_A - T_B)$: positivo se il gas si raffredda (espansione), negativo se si scalda (compressione).
```
