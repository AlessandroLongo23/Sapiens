# Operazioni in ℕ

I numeri naturali sono $\mathbb{N} = \{0, 1, 2, 3, \dots\}$. Con loro si fanno le quattro operazioni che conosci dalle elementari: addizione, sottrazione, moltiplicazione e divisione. Qui le riprendiamo con i nomi corretti dei termini, le proprietà che servono per calcolare più in fretta e le regole per risolvere un'espressione senza sbagliare l'ordine dei passaggi.

## Le quattro operazioni e i nomi dei termini

Nell'**addizione** $a + b$ i numeri $a$ e $b$ si chiamano **addendi** e il risultato si chiama **somma**. In $5 + 3 = 8$ gli addendi sono $5$ e $3$, la somma è $8$.

Nella **sottrazione** $a - b$ il primo numero è il **minuendo**, il secondo il **sottraendo** e il risultato la **differenza**: la differenza è il numero che, sommato al sottraendo, dà il minuendo. In $8 - 3 = 5$ si ha infatti $5 + 3 = 8$.

Nella **moltiplicazione** $a \cdot b$ i due numeri sono i **fattori** e il risultato è il **prodotto**. Moltiplicare per un naturale $b$ vuol dire sommare $b$ addendi uguali ad $a$: $4 \cdot 3 = 4 + 4 + 4 = 12$.

Nella **divisione** $a : b$ il primo numero è il **dividendo**, il secondo il **divisore** e il risultato il **quoziente**: il quoziente è il numero che, moltiplicato per il divisore, dà il dividendo. In $12 : 3 = 4$ si ha infatti $4 \cdot 3 = 12$.

## Operazioni interne e non interne

Un'operazione è **interna** a un insieme quando, applicata a due elementi qualsiasi dell'insieme, dà sempre un risultato che appartiene ancora all'insieme.

In $\mathbb{N}$ l'addizione e la moltiplicazione sono interne: la somma e il prodotto di due numeri naturali sono sempre numeri naturali.

La sottrazione invece non è interna. La differenza $a - b$ esiste in $\mathbb{N}$ solo se $a \geq b$: $9 - 4 = 5$ si può fare, $4 - 9$ no, perché nessun naturale sommato a $9$ dà $4$. Per poter sottrarre sempre si passa ai [numeri interi](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto).

Neppure la divisione è interna. Il quoziente esatto $a : b$ esiste in $\mathbb{N}$ solo se il divisore non è $0$ e il dividendo è un multiplo del divisore: $12 : 3 = 4$ si può fare, $7 : 2$ no, perché nessun naturale moltiplicato per $2$ dà $7$. Per poter dividere sempre (tranne che per zero) si passa ai [numeri razionali](/materiale/scuola-superiore/matematica/numeri-razionali/operazioni-in-q). Quando il quoziente esatto non esiste, in $\mathbb{N}$ si fa la divisione con resto, che trovi più avanti.

## Proprietà dell'addizione e della moltiplicazione

La **proprietà commutativa** dice che, cambiando l'ordine dei termini, il risultato non cambia:

$$a + b = b + a \qquad a \cdot b = b \cdot a$$

Per esempio $7 + 2 = 2 + 7 = 9$ e $4 \cdot 6 = 6 \cdot 4 = 24$.

La **proprietà associativa** dice che, in una somma o in un prodotto di tre o più termini, si possono raggruppare due termini vicini sostituendoli con il loro risultato:

$$
\begin{gathered}
(a + b) + c = a + (b + c) \\
(a \cdot b) \cdot c = a \cdot (b \cdot c)
\end{gathered}
$$

Per esempio $(2 + 3) + 4 = 5 + 4 = 9$ e $2 + (3 + 4) = 2 + 7 = 9$; allo stesso modo $(2 \cdot 3) \cdot 4 = 6 \cdot 4 = 24$ e $2 \cdot (3 \cdot 4) = 2 \cdot 12 = 24$.

La **proprietà dissociativa** è la stessa cosa letta al contrario: un addendo si può scomporre in due addendi che hanno per somma quel numero, e un fattore si può scomporre in due fattori che hanno per prodotto quel numero. Per esempio $27 + 8 = 27 + 3 + 5 = 30 + 5 = 35$ e $15 \cdot 12 = 15 \cdot 2 \cdot 6 = 30 \cdot 6 = 180$.

La **proprietà distributiva** della moltiplicazione rispetto all'addizione e alla sottrazione dice che moltiplicare un numero per una somma (o una differenza) dà lo stesso risultato che moltiplicarlo per ciascun termine e poi sommare (o sottrarre) i prodotti:

$$
\begin{gathered}
a \cdot (b + c) = a \cdot b + a \cdot c \\
a \cdot (b - c) = a \cdot b - a \cdot c \quad (b \geq c)
\end{gathered}
$$

Per esempio $3 \cdot (4 + 5) = 3 \cdot 9 = 27$ e $3 \cdot 4 + 3 \cdot 5 = 12 + 15 = 27$.

Un numero è **elemento neutro** di un'operazione quando, combinato con qualunque altro numero, lo lascia invariato. Per l'addizione è $0$, per la moltiplicazione è $1$:

$$a + 0 = 0 + a = a \qquad a \cdot 1 = 1 \cdot a = a$$

Lo zero ha un ruolo speciale anche nella moltiplicazione: è l'**elemento assorbente**, perché qualunque numero moltiplicato per $0$ dà $0$, cioè $a \cdot 0 = 0 \cdot a = 0$. Vale anche il contrario, che si chiama **legge di annullamento del prodotto**: se un prodotto è $0$, almeno uno dei fattori è $0$.

## Proprietà della sottrazione e della divisione

La sottrazione e la divisione non sono né commutative né associative. Lo mostra un controesempio per ciascuna: $10 - (5 - 2) = 10 - 3 = 7$, mentre $(10 - 5) - 2 = 5 - 2 = 3$; e $12 : (6 : 2) = 12 : 3 = 4$, mentre $(12 : 6) : 2 = 2 : 2 = 1$. Per questo, in una sottrazione o in una divisione, le parentesi e l'ordine dei termini non si possono spostare.

Hanno però la **proprietà invariantiva**. Nella sottrazione la differenza non cambia se si aggiunge o si toglie lo stesso numero sia al minuendo sia al sottraendo (quando si toglie, il numero non deve superare il sottraendo):

$$
\begin{aligned}
a - b &= (a + n) - (b + n) \\
&= (a - n) - (b - n)
\end{aligned}
$$

Nella divisione il quoziente non cambia se si moltiplicano o si dividono dividendo e divisore per lo stesso numero diverso da $0$ (quando si divide, il numero deve dividere esattamente entrambi):

$$
\begin{aligned}
a : b &= (a \cdot n) : (b \cdot n) \\
&= (a : n) : (b : n)
\end{aligned}
$$

Per esempio $1000 - 297 = 1003 - 300 = 703$, dove si è aggiunto $3$ a entrambi i termini, e $350 : 50 = 35 : 5 = 7$, dove si sono divisi entrambi per $10$.

La divisione ha anche la **proprietà distributiva** rispetto all'addizione e alla sottrazione, ma solo quando la somma (o la differenza) è il dividendo:

$$(a + b) : c = a : c + b : c$$

purché $c$ divida esattamente sia $a$ sia $b$. Per esempio $(40 + 24) : 8 = 5 + 3 = 8$, e infatti $64 : 8 = 8$. Se la somma è il divisore la proprietà non vale: $24 : (4 + 2) = 24 : 6 = 4$, mentre $24 : 4 + 24 : 2 = 6 + 12 = 18$.

```ad-warning
Distribuire la divisione sul divisore
$24 : (4 + 2)$ non è $24 : 4 + 24 : 2$. La divisione si distribuisce solo sulla somma che sta al dividendo.
```

Per la sottrazione e la divisione non esiste un elemento neutro nel senso visto sopra: $a - 0 = a$ e $a : 1 = a$, ma $0 - a$ e $1 : a$ in generale non danno $a$.

| Proprietà | Addizione | Sottrazione | Moltiplicazione | Divisione |
|---|---|---|---|---|
| Interna in $\mathbb{N}$ | sì | no | sì | no |
| Commutativa | sì | no | sì | no |
| Associativa e dissociativa | sì | no | sì | no |
| Invariantiva | no | sì | no | sì |
| Distributiva | no | no | rispetto a $+$ e $-$ | solo a destra, rispetto a $+$ e $-$ |
| Elemento neutro | $0$ | nessuno | $1$ | nessuno |

## Lo zero nella divisione

Con lo zero la divisione ha tre casi, e conviene ricordarli ragionando sulla definizione (il quoziente moltiplicato per il divisore deve dare il dividendo).

- $0 : n = 0$ per ogni $n \neq 0$, perché $0 \cdot n = 0$.
- $n : 0$ con $n \neq 0$ è **impossibile**: nessun numero moltiplicato per $0$ dà $n$, perché ogni prodotto per $0$ fa $0$.
- $0 : 0$ è **indeterminata**: qualunque numero moltiplicato per $0$ dà $0$, quindi non c'è un solo quoziente possibile.

In pratica: non si divide mai per zero.

```ad-warning
Dividere per zero
$5 : 0$ non fa $0$ e non fa $5$: la divisione per zero è impossibile; è $0 : 5$ che fa $0$.
```

## Divisione con resto

Quando il dividendo non è multiplo del divisore, in $\mathbb{N}$ si fa la **divisione con resto**. Dati $a$ e $b$ con $b \neq 0$, esistono e sono unici due naturali $q$ (il quoziente) e $r$ (il resto) tali che

$$a = b \cdot q + r \qquad \text{con } 0 \leq r < b$$

La condizione $r < b$ è quella che rende unico il risultato: il resto deve essere più piccolo del divisore, altrimenti nel dividendo ci starebbe ancora una volta il divisore. Quando $r = 0$ la divisione è esatta e si dice che $b$ è un divisore di $a$ (ne parla la lezione [Divisibilità e numeri primi](/materiale/scuola-superiore/matematica/numeri-naturali/divisibilita-e-numeri-primi)).

```ad-example
Esempio 1: 47 diviso 5
Il più grande multiplo di $5$ che non supera $47$ è $45 = 5 \cdot 9$, quindi il quoziente è $9$ e il resto è $47 - 45 = 2$.

Controllo: $5 \cdot 9 + 2 = 45 + 2 = 47$, e $2 < 5$.
```

```ad-example
Esempio 2: dividendo più piccolo del divisore
In $3 : 8$ il divisore ci sta zero volte nel dividendo: quoziente $0$, resto $3$. Infatti $3 = 8 \cdot 0 + 3$, con $3 < 8$.
```

## Ordine delle operazioni nelle espressioni

Un'espressione si calcola con queste regole.

1. Se ci sono parentesi, si parte dalle più interne: prima le tonde $(\ )$, poi le quadre $[\ ]$, infine le graffe $\{\ \}$.
2. Dentro ogni parentesi (o nell'espressione, se non ce ne sono) si calcolano prima le [potenze](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n), poi moltiplicazioni e divisioni, infine addizioni e sottrazioni.
3. Moltiplicazioni e divisioni hanno la stessa priorità, e si eseguono nell'ordine in cui compaiono, da sinistra a destra. Lo stesso vale per addizioni e sottrazioni.
4. Quando una parentesi contiene un solo numero, la parentesi si toglie.

```ad-example
Esempio 3: senza parentesi
$$20 - 3 \cdot 4 + 12 : 6$$
Prima la moltiplicazione e la divisione: $3 \cdot 4 = 12$ e $12 : 6 = 2$. Resta $20 - 12 + 2$, che da sinistra a destra fa $8 + 2 = 10$.
```

```ad-warning
Ignorare le priorità
$20 - 3 \cdot 4$ fa $20 - 12 = 8$, non $17 \cdot 4 = 68$. La moltiplicazione viene prima della sottrazione.
```

```ad-warning
Dare la precedenza alla moltiplicazione
Moltiplicazione e divisione hanno la stessa priorità, come addizione e sottrazione: $24 : 4 \cdot 2$ fa $6 \cdot 2 = 12$, non $24 : 8 = 3$; e $20 - 5 - 3$ fa $15 - 3 = 12$, non $20 - 2 = 18$. Con la stessa priorità si va da sinistra a destra.
```

```ad-example
Esempio 4: con tonde, quadre e graffe
$$\{[(18 - 6) : 4 + 2 \cdot 3] \cdot 2 - 5\} : 13$$
Tonde: $18 - 6 = 12$, e l'espressione diventa $\{[12 : 4 + 2 \cdot 3] \cdot 2 - 5\} : 13$.

Quadre: $12 : 4 + 2 \cdot 3 = 3 + 6 = 9$, e resta $\{9 \cdot 2 - 5\} : 13$.

Graffe: $9 \cdot 2 - 5 = 18 - 5 = 13$, e resta $13 : 13 = 1$.
```

```ad-example
Esempio 5: calcolo a mente con le proprietà
$25 \cdot 7 \cdot 4 = 25 \cdot 4 \cdot 7 = 100 \cdot 7 = 700$, con la commutativa e l'associativa.

$99 \cdot 13 = (100 - 1) \cdot 13 = 1300 - 13 = 1287$, con la distributiva.

$1000 - 297 = 1003 - 300 = 703$, con l'invariantiva della sottrazione.
```

## Problemi con le quattro operazioni

Un problema racconta una situazione e chiede di trovare un numero. Prima di fare qualunque conto leggi tutto il testo, poi individua i dati, cioè i numeri con quello che contano (euro, studenti, posti), e la domanda, cioè la quantità che devi trovare. Per ogni passaggio scegli l'operazione dal significato: l'addizione mette insieme due quantità, la sottrazione toglie o dice quanto manca, la moltiplicazione ripete più volte la stessa quantità, la divisione ripartisce in parti uguali o dice quante volte una quantità ne contiene un'altra.

Poi scrivi tutti i passaggi in un'unica espressione, con le parentesi attorno a ogni conto che va fatto prima degli altri, e calcolala con le regole della sezione precedente. Alla fine rileggi la domanda e controlla che il numero trovato risponda proprio a quella, con la sua unità di misura.

```ad-example
Esempio 6: una spesa con il resto
Marta compra $3$ quaderni da $4$ euro ciascuno e paga con una banconota da $20$ euro. Quanti euro riceve di resto?

Dati: $3$ quaderni, $4$ euro l'uno, $20$ euro pagati. Domanda: il resto. La spesa ripete $3$ volte lo stesso prezzo, quindi è $3 \cdot 4$; il resto è quello che manca alla banconota, e si trova con una sottrazione:
$$20 - 3 \cdot 4 = 20 - 12 = 8$$
Non servono parentesi, perché la moltiplicazione si fa già prima della sottrazione. Marta riceve $8$ euro di resto.
```

```ad-example
Esempio 7: posti divisi tra le classi
L'aula magna della scuola ha $10$ file da $15$ posti. I docenti occupano $6$ posti e gli altri sono divisi in parti uguali tra $6$ classi. Quanti posti spettano a ogni classe?

I posti in tutto sono $10 \cdot 15$; tolti quelli dei docenti restano $10 \cdot 15 - 6$, e questo numero va diviso per $6$. La sottrazione deve venire prima della divisione, quindi va tra parentesi:
$$
\begin{aligned}
&(10 \cdot 15 - 6) : 6 \\
&= (150 - 6) : 6 \\
&= 144 : 6 \\
&= 24
\end{aligned}
$$
A ogni classe spettano $24$ posti.
```

```ad-warning
Dimenticare le parentesi
Nell'esempio 7, senza parentesi $10 \cdot 15 - 6 : 6$ fa $150 - 1 = 149$: si dividerebbero tra le classi solo i posti dei docenti. Se un risultato va calcolato prima di un'altra operazione, scrivilo tra parentesi.
```
