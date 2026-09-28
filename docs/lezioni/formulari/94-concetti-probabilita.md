# Formulario: Eventi e probabilità

## Spazio campionario ed eventi

- Spazio campionario $\Omega$: l'insieme di tutti gli esiti. Dado: $\Omega = \{1, 2, 3, 4, 5, 6\}$; due monete: $\Omega = \{TT, TC, CT, CC\}$; due dadi: $36$ coppie $(a, b)$.

Tabella dei due dadi, con la somma in ogni casella:

```tikz
% nome: due-dadi-tabella-somme
% alt: Tabella sei per sei dei lanci di due dadi: in ogni casella la somma dei due numeri; sono colorate le sei caselle con somma 7, sulla diagonale che va dal basso a sinistra all'alto a destra
% svg: due-dadi-tabella-somme-1b8d1ae2.svg 166x165
\begin{tikzpicture}
\fill[blue!20] (2.75,-0.55) rectangle (3.30,0.00);
\fill[blue!20] (2.20,-1.10) rectangle (2.75,-0.55);
\fill[blue!20] (1.65,-1.65) rectangle (2.20,-1.10);
\fill[blue!20] (1.10,-2.20) rectangle (1.65,-1.65);
\fill[blue!20] (0.55,-2.75) rectangle (1.10,-2.20);
\fill[blue!20] (0.00,-3.30) rectangle (0.55,-2.75);
\draw[black!60] (0.00,0) -- (0.00,-3.30);
\draw[black!60] (0,0.00) -- (3.30,0.00);
\draw[black!60] (0.55,0) -- (0.55,-3.30);
\draw[black!60] (0,-0.55) -- (3.30,-0.55);
\draw[black!60] (1.10,0) -- (1.10,-3.30);
\draw[black!60] (0,-1.10) -- (3.30,-1.10);
\draw[black!60] (1.65,0) -- (1.65,-3.30);
\draw[black!60] (0,-1.65) -- (3.30,-1.65);
\draw[black!60] (2.20,0) -- (2.20,-3.30);
\draw[black!60] (0,-2.20) -- (3.30,-2.20);
\draw[black!60] (2.75,0) -- (2.75,-3.30);
\draw[black!60] (0,-2.75) -- (3.30,-2.75);
\draw[black!60] (3.30,0) -- (3.30,-3.30);
\draw[black!60] (0,-3.30) -- (3.30,-3.30);
\node at (0.275,0.275) {\small $1$};
\node at (-0.275,-0.275) {\small $1$};
\node at (0.825,0.275) {\small $2$};
\node at (-0.275,-0.825) {\small $2$};
\node at (1.375,0.275) {\small $3$};
\node at (-0.275,-1.375) {\small $3$};
\node at (1.925,0.275) {\small $4$};
\node at (-0.275,-1.925) {\small $4$};
\node at (2.475,0.275) {\small $5$};
\node at (-0.275,-2.475) {\small $5$};
\node at (3.025,0.275) {\small $6$};
\node at (-0.275,-3.025) {\small $6$};
\node at (0.275,-0.275) {\footnotesize $2$};
\node at (0.825,-0.275) {\footnotesize $3$};
\node at (1.375,-0.275) {\footnotesize $4$};
\node at (1.925,-0.275) {\footnotesize $5$};
\node at (2.475,-0.275) {\footnotesize $6$};
\node at (3.025,-0.275) {\footnotesize $7$};
\node at (0.275,-0.825) {\footnotesize $3$};
\node at (0.825,-0.825) {\footnotesize $4$};
\node at (1.375,-0.825) {\footnotesize $5$};
\node at (1.925,-0.825) {\footnotesize $6$};
\node at (2.475,-0.825) {\footnotesize $7$};
\node at (3.025,-0.825) {\footnotesize $8$};
\node at (0.275,-1.375) {\footnotesize $4$};
\node at (0.825,-1.375) {\footnotesize $5$};
\node at (1.375,-1.375) {\footnotesize $6$};
\node at (1.925,-1.375) {\footnotesize $7$};
\node at (2.475,-1.375) {\footnotesize $8$};
\node at (3.025,-1.375) {\footnotesize $9$};
\node at (0.275,-1.925) {\footnotesize $5$};
\node at (0.825,-1.925) {\footnotesize $6$};
\node at (1.375,-1.925) {\footnotesize $7$};
\node at (1.925,-1.925) {\footnotesize $8$};
\node at (2.475,-1.925) {\footnotesize $9$};
\node at (3.025,-1.925) {\footnotesize $10$};
\node at (0.275,-2.475) {\footnotesize $6$};
\node at (0.825,-2.475) {\footnotesize $7$};
\node at (1.375,-2.475) {\footnotesize $8$};
\node at (1.925,-2.475) {\footnotesize $9$};
\node at (2.475,-2.475) {\footnotesize $10$};
\node at (3.025,-2.475) {\footnotesize $11$};
\node at (0.275,-3.025) {\footnotesize $7$};
\node at (0.825,-3.025) {\footnotesize $8$};
\node at (1.375,-3.025) {\footnotesize $9$};
\node at (1.925,-3.025) {\footnotesize $10$};
\node at (2.475,-3.025) {\footnotesize $11$};
\node at (3.025,-3.025) {\footnotesize $12$};
\node at (1.650,0.743) {\small secondo dado};
\node[rotate=90] at (-0.743,-1.650) {\small primo dado};
\end{tikzpicture}
```

- Evento: un sottoinsieme di $\Omega$. "Esce un numero pari" è $\{2, 4, 6\}$.
- Evento elementare: un solo esito. Evento certo: $\Omega$. Evento impossibile: $\emptyset$.
- Mazzo di $40$ carte napoletane: $4$ semi (coppe, denari, bastoni, spade) di $10$ carte, cioè asso, dal $2$ al $7$, fante, cavallo, re; $4$ assi, $12$ figure.

## Operazioni tra eventi

| Parola | Evento | Operazione |
|---|---|---|
| $A$ o $B$ | $A \cup B$ | unione, somma logica |
| $A$ e $B$ | $A \cap B$ | intersezione, prodotto logico |
| non $A$ | $\overline{A}$ | evento contrario |

- Eventi incompatibili: $A \cap B = \emptyset$, non si verificano mai insieme.
- Evento e contrario: $A \cap \overline{A} = \emptyset$ e $A \cup \overline{A} = \Omega$.

## Definizione classica

Solo con esiti equiprobabili:

$$p(E) = \dfrac{\text{casi favorevoli}}{\text{casi possibili}}$$

$$
\begin{gathered}
0 \leq p(E) \leq 1 \\
p(\emptyset) = 0, \quad p(\Omega) = 1
\end{gathered}
$$

- Dado, numero pari: $\dfrac{3}{6} = \dfrac{1}{2}$. Due dadi, somma $7$: $\dfrac{6}{36} = \dfrac{1}{6}$. Una figura dal mazzo: $\dfrac{12}{40} = \dfrac{3}{10}$.

## Definizione frequentista e soggettiva

- Frequenza relativa su $N$ prove: $f_r = \dfrac{f_a}{N}$. La probabilità frequentista è la frequenza relativa su un numero grande di prove nelle stesse condizioni.
- Legge empirica del caso: con molte prove la frequenza relativa si avvicina alla probabilità.
- Probabilità soggettiva: il prezzo giusto, secondo chi valuta, per ricevere $1$ euro se l'evento si verifica.

```ad-warning
Esiti non equiprobabili
Con due monete "una testa e una croce" ha probabilità $\dfrac{2}{4} = \dfrac{1}{2}$, non $\dfrac{1}{3}$: si ottiene con $TC$ e con $CT$.
```

```ad-warning
Contare i colori invece delle palline
Con $3$ palline rosse, $5$ blu e $2$ verdi, $p(\text{rossa}) = \dfrac{3}{10}$, non $\dfrac{1}{3}$.
```

```ad-warning
La moneta non ha memoria
Dopo cinque croci di fila, testa ha ancora probabilità $\dfrac{1}{2}$.
```
