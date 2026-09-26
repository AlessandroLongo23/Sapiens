# Formulario: Relazioni di equivalenza e d'ordine

## Proprietà di una relazione in un insieme

$a \mathrel{\mathcal{R}} b$ vuol dire $(a, b) \in \mathcal{R}$. Nel diagramma un cappio su $a$ vuol dire $a \mathrel{\mathcal{R}} a$.

| Proprietà | Definizione | Nel diagramma |
|---|---|---|
| Riflessiva | $a \mathrel{\mathcal{R}} a$ per ogni $a \in A$ | un cappio su ogni elemento |
| Antiriflessiva | $a \mathrel{\mathcal{R}} a$ per nessun $a \in A$ | nessun cappio |
| Simmetrica | $a \mathrel{\mathcal{R}} b \implies b \mathrel{\mathcal{R}} a$ | ogni freccia ha quella di ritorno |
| Antisimmetrica | $a \mathrel{\mathcal{R}} b$ e $b \mathrel{\mathcal{R}} a \implies a = b$ | tra elementi diversi al massimo una freccia |
| Transitiva | $a \mathrel{\mathcal{R}} b$ e $b \mathrel{\mathcal{R}} c \implies a \mathrel{\mathcal{R}} c$ | ogni percorso di due frecce ha la scorciatoia |

Per dire che una proprietà vale si ragiona su tutti gli elementi; per dire che non vale basta un controesempio.

## Relazioni di equivalenza

Equivalenza: riflessiva, simmetrica e transitiva.

Classe di equivalenza di $a$:

$$[a] = \{x \in A \mid x \mathrel{\mathcal{R}} a\}$$

- $a \in [a]$, quindi nessuna classe è vuota.
- Se $a \mathrel{\mathcal{R}} b$, allora $[a] = [b]$; altrimenti $[a]$ e $[b]$ non hanno elementi in comune.
- Ogni elemento di $A$ sta in una e una sola classe.

Insieme quoziente: $A/\mathcal{R}$, l'insieme delle classi.

Stesso resto nella divisione per $3$ in $\mathbb{N}$:

$$
\begin{gathered}
[0] = \{0, 3, 6, \ldots\} \\
[1] = \{1, 4, 7, \ldots\} \\
[2] = \{2, 5, 8, \ldots\}
\end{gathered}
$$

## Relazioni d'ordine

- Ordine largo: riflessiva, antisimmetrica, transitiva ($\leq$, $\subseteq$).
- Ordine stretto: antiriflessiva, antisimmetrica, transitiva ($<$, $\subset$).
- Totale: due elementi diversi sono sempre confrontabili ($a \mathrel{\mathcal{R}} b$ oppure $b \mathrel{\mathcal{R}} a$).
- Parziale: almeno due elementi diversi non sono confrontabili.

| Relazione | Insieme | Tipo |
|---|---|---|
| stesso resto per $3$ | $\mathbb{N}$ | equivalenza |
| parallelismo | rette | equivalenza |
| $\leq$ | $\mathbb{N}$ | ordine largo totale |
| $<$ | $\mathbb{N}$ | ordine stretto totale |
| divisore di | naturali $\neq 0$ | ordine largo parziale |
| $\subseteq$ | sottoinsiemi | ordine largo parziale |

```ad-warning
Antisimmetrica non è "non simmetrica"
L'uguaglianza è simmetrica e antisimmetrica; $\{(1, 2),\ (2, 1),\ (2, 3)\}$ non è né l'una né l'altra.
```

```ad-warning
Andata e ritorno nella transitiva
Se $a \mathrel{\mathcal{R}} b$ e $b \mathrel{\mathcal{R}} a$, la transitiva chiede anche $a \mathrel{\mathcal{R}} a$.
```

```ad-warning
Un elemento basta
$a \cdot b > 0$ in $\mathbb{Z}$ non è riflessiva: $0 \cdot 0 = 0$.
```
