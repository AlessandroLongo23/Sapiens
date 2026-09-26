# Formulario: Rappresentazione degli insiemi

## Per elencazione

Detta anche estensiva o tabulare: tutti gli elementi tra graffe, ognuno una volta, in qualunque ordine.

$$
\begin{gathered}
A = \{a, e, i, o, u\} \\
\{2, 4, 6, 8\} = \{8, 2, 6, 4\}
\end{gathered}
$$

I puntini solo quando la regola è evidente:

$$\{1, 2, 3, \dots, 100\} \qquad \{0, 2, 4, 6, \dots\}$$

## Per proprietà caratteristica

Detta anche intensiva: prima della barra l'insieme da cui si prendono gli elementi, dopo la barra la condizione. La barra $\mid$ si legge "tale che" (alcuni libri usano i due punti).

$$B = \{x \in \mathbb{N} \mid x \text{ è pari e } 1 \le x \le 9\}$$

Stessa condizione, insieme di partenza diverso, insieme diverso:

$$
\begin{gathered}
\{x \in \mathbb{N} \mid x^2 = 4\} = \{2\} \\
\{x \in \mathbb{Z} \mid x^2 = 4\} = \{-2, 2\}
\end{gathered}
$$

## Diagramma di Eulero-Venn

Ogni insieme è una linea chiusa, con gli elementi come punti dentro; il rettangolo è l'universo $U$. Gli elementi comuni a due insiemi vanno nella zona in cui le linee si sovrappongono.

## Dalla proprietà all'elencazione

1. Guarda da quale insieme si prendono gli elementi ($\mathbb{N}$, $\mathbb{Z}$, ...).
2. Prova i candidati uno per uno, dai più piccoli, e tieni quelli che soddisfano la condizione.
3. Controlla gli estremi: con $<$ l'estremo è escluso, con $\le$ è incluso.
4. Scrivi gli elementi trovati tra graffe, ognuno una volta.

Per esempio $\{x \in \mathbb{Z} \mid -3 < x \le 2\} = \{-2, -1, 0, 1, 2\}$.

## Dall'elencazione alla proprietà

Trova cosa hanno in comune gli elementi, poi controlla che la proprietà non faccia entrare altri numeri:

$$
\begin{gathered}
\{3, 6, 9, 12, 15\} = \{x \in \mathbb{N} \mid \\
x \text{ è multiplo di } 3 \text{ e } 1 \le x \le 15\}
\end{gathered}
$$

Senza $1 \le x$ entrerebbe anche lo $0$. Per lo stesso insieme vanno bene più proprietà, purché diano esattamente quegli elementi.

```ad-warning
Dimenticare l'insieme di partenza
$\{x \mid x < 3\}$ è ambiguo: in $\mathbb{N}$, in $\mathbb{Z}$ o in $\mathbb{R}$ dà tre insiemi diversi.
```

```ad-warning
Sbagliare gli estremi
$\{x \in \mathbb{N} \mid 2 < x < 6\} = \{3, 4, 5\}$: con $<$ gli estremi restano fuori.
```

```ad-warning
Dimenticare lo 0 in $\mathbb{N}$
$\{x \in \mathbb{N} \mid x \text{ è pari e } x \le 8\} = \{0, 2, 4, 6, 8\}$, con lo 0.
```
