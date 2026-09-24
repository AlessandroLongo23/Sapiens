# Potenze in ℕ

La potenza è il modo breve di scrivere un prodotto di fattori tutti uguali: invece di $2 \cdot 2 \cdot 2 \cdot 2 \cdot 2$ si scrive $2^5$. Con le proprietà delle potenze molti calcoli si riducono a somme e sottrazioni tra esponenti.

## Definizione

Dati due numeri naturali $a$ e $n$, con $n \geq 2$, la **potenza** $a^n$ è il prodotto di $n$ fattori uguali ad $a$:

$$a^n = \underbrace{a \cdot a \cdot \ldots \cdot a}_{n \text{ fattori}}$$

Il numero $a$ si chiama **base**, il numero $n$ si chiama **esponente**, e $a^n$ si legge "$a$ elevato alla $n$". Per esempio $2^3 = 2 \cdot 2 \cdot 2 = 8$ e $3^4 = 3 \cdot 3 \cdot 3 \cdot 3 = 81$.

L'esponente conta i fattori, non le moltiplicazioni: in $2^3$ ci sono tre fattori $2$ e due segni di moltiplicazione.

```ad-warning
Moltiplicare base ed esponente
$2^3$ non è $2 \cdot 3 = 6$, ma $2 \cdot 2 \cdot 2 = 8$.
```

Alcuni casi si ricordano subito:

- $1^n = 1$ per ogni $n$, perché il prodotto di fattori tutti uguali a $1$ fa $1$;
- $0^n = 0$ per ogni $n \geq 1$, perché un solo fattore $0$ rende nullo il prodotto;
- $10^n$ si scrive con $1$ seguito da $n$ zeri: $10^4 = 10\,000$.

La potenza di esponente $2$ si chiama anche **quadrato** e quella di esponente $3$ **cubo**: $5^2 = 25$ si legge "cinque al quadrato", $2^3 = 8$ "due al cubo".

## Esponente 1 ed esponente 0

La definizione parla di almeno due fattori, quindi $a^1$ e $a^0$ vanno definiti a parte:

$$a^1 = a \qquad a^0 = 1 \quad (a \neq 0)$$

Per esempio $7^1 = 7$ e $7^0 = 1$. Sono scelte, ma non arbitrarie: sono le uniche che fanno funzionare le proprietà della sezione seguente anche con questi esponenti. Per esempio $7^3 : 7^3 = 1$, e con la regola del quoziente di potenze con la stessa base deve venire $7^{3 - 3} = 7^0$; quindi $7^0$ deve valere $1$.

```ad-warning
Sbagliare l'esponente zero
$5^0$ non fa $0$ e non fa $5$. Ogni numero diverso da zero elevato a $0$ fa $1$; è $5^1$ che fa $5$.
```

La scrittura $0^0$ invece non ha significato: non le si assegna nessun valore. Lo stesso ragionamento, applicato alla base $0$, porterebbe a $0^0 = 0^3 : 0^3 = 0 : 0$, e $0 : 0$ è una divisione indeterminata, come spiega la lezione sulle [operazioni in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n).

## Proprietà delle potenze

Nelle proprietà che seguono $a$, $b$, $m$, $n$ sono numeri naturali. Dove compare un esponente $0$, la base deve essere diversa da $0$, per non ottenere $0^0$.

| Proprietà | Formula | Condizioni |
|---|---|---|
| Prodotto di potenze con la stessa base | $a^m \cdot a^n = a^{m+n}$ | |
| Quoziente di potenze con la stessa base | $a^m : a^n = a^{m-n}$ | $a \neq 0$, $m \geq n$ |
| Potenza di una potenza | $(a^m)^n = a^{m \cdot n}$ | |
| Prodotto di potenze con lo stesso esponente | $a^n \cdot b^n = (a \cdot b)^n$ | |
| Quoziente di potenze con lo stesso esponente | $a^n : b^n = (a : b)^n$ | $b \neq 0$, $a$ divisibile per $b$ |

Le condizioni del quoziente vengono dalla divisione in $\mathbb{N}$: non si divide per zero, e il risultato deve essere un numero naturale. Per esempio $3^2 : 3^5$ non si può calcolare in $\mathbb{N}$, perché $9 : 243$ non è un naturale; diventa possibile nei [numeri razionali](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q).

Ogni proprietà viene dalla definizione. Nel prodotto con la stessa base, per esempio, si contano i fattori:

$$2^3 \cdot 2^2 = (2 \cdot 2 \cdot 2) \cdot (2 \cdot 2) = 2^5$$

Nella potenza di una potenza si moltiplicano gli esponenti perché si ripete più volte lo stesso blocco di fattori:

$$(2^3)^2 = 2^3 \cdot 2^3 = 2^{3 + 3} = 2^6 = 64$$

Con lo stesso esponente si raggruppano i fattori a coppie:

$$2^3 \cdot 5^3 = (2 \cdot 2 \cdot 2) \cdot (5 \cdot 5 \cdot 5) = (2 \cdot 5) \cdot (2 \cdot 5) \cdot (2 \cdot 5) = 10^3 = 1000$$

```ad-example
Esempio 1: stessa base
$$2^5 \cdot 2^3 : 2^6 = 2^{5 + 3} : 2^6 = 2^8 : 2^6 = 2^{8 - 6} = 2^2 = 4$$
Le operazioni si fanno da sinistra a destra, come in ogni espressione: prima il prodotto, poi il quoziente.
```

```ad-warning
Sommare gli esponenti in una somma
$2^2 + 2^3 = 4 + 8 = 12$, mentre $2^{2+3} = 32$. La regola $a^m \cdot a^n = a^{m+n}$ vale per il prodotto.
```

```ad-example
Esempio 2: potenza di potenza ed esponente zero
$$[(3^4)^2 : 3^5] \cdot 3^0 = [3^8 : 3^5] \cdot 1 = 3^3 = 27$$
```

```ad-warning
Potenza di potenza ed esponente potenza
$(2^3)^2 = 2^{3 \cdot 2} = 2^6 = 64$, mentre $2^{3^2}$ vuol dire $2^9 = 512$, perché prima si calcola l'esponente $3^2 = 9$.
```

```ad-example
Esempio 3: stesso esponente
$$6^4 : 3^4 = (6 : 3)^4 = 2^4 = 16$$
Controllo: $6^4 = 1296$, $3^4 = 81$ e $1296 : 81 = 16$.
```

```ad-warning
Elevare una somma termine per termine
$(2 + 3)^2 = 5^2 = 25$, mentre $2^2 + 3^2 = 4 + 9 = 13$. In generale $(a + b)^2 \neq a^2 + b^2$: la potenza si distribuisce sul prodotto, non sulla somma.
```

```ad-example
Esempio 4: riportare le basi alla stessa base
$$4^3 \cdot 2^5 : 8^2$$
Le basi sono diverse, ma sono tutte potenze di $2$: $4 = 2^2$ e $8 = 2^3$. Quindi $4^3 = (2^2)^3 = 2^6$ e $8^2 = (2^3)^2 = 2^6$, e l'espressione diventa
$$2^6 \cdot 2^5 : 2^6 = 2^{11} : 2^6 = 2^5 = 32$$
```

```ad-warning
Basi diverse ed esponenti diversi
$2^3 \cdot 3^2$ non si semplifica in una sola potenza, si calcola come $8 \cdot 9 = 72$.
```

## Le potenze nelle espressioni

Nell'ordine delle operazioni le potenze vengono prima di moltiplicazioni e divisioni, e l'esponente si riferisce solo al numero (o alla parentesi) su cui è scritto. Così $3 \cdot 2^2 = 3 \cdot 4 = 12$, mentre $(3 \cdot 2)^2 = 6^2 = 36$. Le altre regole per le espressioni sono nella lezione sulle [operazioni in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n).

## Potenze di 10

Le potenze di $10$ servono a scrivere in forma compatta i numeri grandi e a leggere la scrittura decimale:

$$4352 = 4 \cdot 10^3 + 3 \cdot 10^2 + 5 \cdot 10^1 + 2 \cdot 10^0$$

Un numero che finisce con molti zeri si scrive come prodotto per una potenza di $10$: $3\,000\,000 = 3 \cdot 10^6$, e $250\,000 = 25 \cdot 10^4$. La notazione scientifica, che usa anche numeri decimali davanti alla potenza di $10$, si studia con i numeri razionali.
