# Formulario: Media, mediana e moda

## Media aritmetica

- Media di $n$ dati numerici: la somma divisa per il numero dei dati.

$$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$

- Media ponderata, con i pesi $p_1, \dots, p_k$: si divide per la somma dei pesi.

$$\bar{x} = \frac{x_1 p_1 + x_2 p_2 + \dots + x_k p_k}{p_1 + p_2 + \dots + p_k}$$

- Da una tabella di frequenze: i pesi sono le frequenze assolute $f_i$, e la loro somma è $n$.

$$\bar{x} = \frac{x_1 f_1 + x_2 f_2 + \dots + x_k f_k}{n}$$

- Con le frequenze relative: somma dei prodotti $x_i \cdot$ (frequenza relativa), senza dividere.

## Proprietà della media

- La media sta tra il dato più piccolo e il più grande.
- Scarto dalla media: $x_i - \bar{x}$. La somma degli scarti è zero.

$$
\begin{aligned}
&(x_1 - \bar{x}) + (x_2 - \bar{x}) \\
&\quad + \dots + (x_n - \bar{x}) = 0
\end{aligned}
$$

Esempio: $3$, $5$, $10$ hanno media $6$ e scarti $-3$, $-1$, $4$.

## Mediana

1. Metti i dati in ordine crescente, ripetendo i valori uguali.
2. $n$ dispari: la mediana è il dato al posto $\dfrac{n + 1}{2}$.
3. $n$ pari: la mediana è la media dei dati ai posti $\dfrac{n}{2}$ e $\dfrac{n}{2} + 1$.
4. Da una tabella: le frequenze cumulate dicono fino a che posto arriva ogni valore.

Esempio: $7, 7, 9, 11, 12, 14, 15, 20$ ha mediana $\dfrac{11 + 12}{2} = 11{,}5$.

## Moda

- Il valore con la frequenza più alta. Si usa anche per i caratteri qualitativi.
- Due valori con la frequenza più alta: due mode (distribuzione bimodale). Tutti i valori con la stessa frequenza: nessuna moda.

## Quale indice usare

| | Media | Mediana | Moda |
|---|---|---|---|
| Carattere | quantitativo | quantitativo o qualitativo ordinabile | qualsiasi |
| Cambia molto con un valore anomalo | sì | no | no |

Con un valore anomalo si preferisce la mediana: $1200$, $1300$, $1300$, $1400$, $7800$ hanno media $2600$ e mediana $1300$.

## Dati in classi

- Valore centrale di una classe: la media dei due estremi. La media si calcola con i valori centrali ed è approssimata.
- Classe modale: la classe con la frequenza più alta.

```ad-warning
Dividere per il numero sbagliato
Nella media ponderata si divide per la somma dei pesi; in una tabella, per la somma delle frequenze, non per il numero delle righe.
```

```ad-warning
Mediana senza ordinare
Prima si mettono i dati in ordine, poi si cerca il centro. $\dfrac{n + 1}{2}$ è il posto della mediana, non il suo valore.
```

```ad-warning
Moda e frequenza
La moda è il valore che compare più volte, non il numero di volte che compare.
```
