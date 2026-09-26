# Media, mediana e moda

Dopo aver raccolto i dati in una tabella, spesso serve un numero solo che li riassuma: il voto medio di una classe, lo stipendio tipico in un'azienda, il mezzo di trasporto più usato per venire a scuola. Media, mediana e moda sono i tre modi più usati per scegliere questo numero, e si chiamano **indici di posizione** (o valori medi) perché dicono dove stanno i dati, più in alto o più in basso. Le tabelle di frequenza da cui si parte sono quelle di [Dati, frequenze e grafici](/materiale/scuola-superiore/matematica/statistica/dati-frequenze-e-grafici).

## Media aritmetica

La **media aritmetica** di $n$ dati numerici $x_1, x_2, \dots, x_n$ è la loro somma divisa per il numero dei dati. Si indica con $\bar{x}$, che si legge "x segnato":

$$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$

Si calcola solo per i caratteri quantitativi, cioè quando i dati sono numeri: non ha senso fare la media di "bici" e "autobus". La media è il valore che avrebbe ogni dato se il totale fosse diviso in parti uguali: se cinque amici spendono in tutto $60$ euro, la media è $12$ euro, quello che pagherebbe ciascuno dividendo il conto.

```ad-example
Esempio 1: temperature sotto zero
Le temperature minime di una settimana, in gradi, sono $-3$, $1$, $0$, $-2$, $4$, $5$, $2$. Calcola la media.

La somma tiene conto dei segni: i numeri negativi si sottraggono.

$$
\begin{aligned}
\bar{x} &= \frac{-3 + 1 + 0 - 2 + 4 + 5 + 2}{7} \\
&= \frac{7}{7} = 1
\end{aligned}
$$

La temperatura minima media è $1$ grado. Lo $0$ è un dato come gli altri: conta nel numeratore, dove non cambia la somma, e conta nel denominatore, perché i giorni sono $7$.
```

La media non è per forza uno dei dati, e non è per forza un numero intero: se in quattro famiglie ci sono $1$, $2$, $2$ e $4$ figli, la media è $9 : 4 = 2{,}25$ figli per famiglia, anche se nessuna famiglia ne ha $2{,}25$.

### Media ponderata

A volte i dati non contano tutti allo stesso modo. Nella **media aritmetica ponderata** ogni dato $x_i$ ha un **peso** $p_i$, un numero positivo che dice quanto conta: si moltiplica ogni dato per il suo peso, si sommano i prodotti e si divide per la somma dei pesi.

$$\bar{x} = \frac{x_1 p_1 + x_2 p_2 + \dots + x_k p_k}{p_1 + p_2 + \dots + p_k}$$

Se tutti i pesi sono uguali, la media ponderata è uguale alla media semplice.

```ad-example
Esempio 2: voti con pesi diversi
Nel primo periodo Giulia ha preso $6$ e $8$ nelle due verifiche scritte, che valgono il doppio, e $5$ in un'interrogazione, che vale una volta. Calcola la media ponderata.

I pesi sono $2$, $2$ e $1$, e la loro somma è $5$.

$$
\begin{aligned}
\bar{x} &= \frac{6 \cdot 2 + 8 \cdot 2 + 5 \cdot 1}{2 + 2 + 1} \\
&= \frac{12 + 16 + 5}{5} = \frac{33}{5} = 6{,}6
\end{aligned}
$$

La media semplice dei tre voti sarebbe $19 : 3 \approx 6{,}33$: il $5$ pesa meno, perché conta una volta sola, e la media ponderata è più alta.
```

```ad-warning
Dividere per il numero dei dati
Nella media ponderata si divide per la somma dei pesi, non per il numero dei dati. Nell'esempio 2, $33 : 3 = 11$ è un voto impossibile: la media deve stare tra il voto più basso e il più alto.
```

### Media da una tabella di frequenze

Quando i dati sono in una tabella di frequenze, ogni valore $x_i$ compare tante volte quanto dice la sua frequenza assoluta $f_i$. Sommare $x_i$ per $f_i$ volte vuol dire moltiplicare $x_i \cdot f_i$: la media è una media ponderata in cui i pesi sono le frequenze, e la somma delle frequenze è il numero $n$ dei dati.

$$\bar{x} = \frac{x_1 f_1 + x_2 f_2 + \dots + x_k f_k}{n}$$

In pratica si aggiunge alla tabella una colonna con i prodotti $x_i \cdot f_i$.

```ad-example
Esempio 3: i voti di una classe
I voti di una verifica in una classe di $25$ studenti sono nella tabella. Calcola la media.

| Voto $x_i$ | Frequenza $f_i$ | $x_i \cdot f_i$ |
|---|---|---|
| $4$ | $2$ | $8$ |
| $5$ | $3$ | $15$ |
| $6$ | $8$ | $48$ |
| $7$ | $6$ | $42$ |
| $8$ | $4$ | $32$ |
| $9$ | $2$ | $18$ |
| Totale | $25$ | $163$ |

$$\bar{x} = \frac{163}{25} = 6{,}52$$

Il totale della colonna delle frequenze, $25$, è il numero degli studenti: è il controllo che non manca nessuno.
```

```ad-warning
Dividere per il numero delle righe
Nell'esempio 3 i voti diversi sono $6$, ma i dati sono $25$. Dividere $163$ per $6$ dà circa $27$, che non è nemmeno un voto: si divide per la somma delle frequenze.
```

```ad-tip
Con le frequenze relative
Se nella tabella ci sono le frequenze relative, la divisione per $n$ è già fatta: la media è la somma dei prodotti $x_i \cdot$ (frequenza relativa). Nell'esempio 3 le frequenze relative sono $0{,}08$, $0{,}12$, $0{,}32$, $0{,}24$, $0{,}16$, $0{,}08$, e $4 \cdot 0{,}08 + 5 \cdot 0{,}12 + \dots + 9 \cdot 0{,}08 = 6{,}52$.
```

## Proprietà della media

La media sta sempre tra il dato più piccolo e il più grande (si dice che è un valore interno): se è fuori, c'è un errore nel conto.

La differenza tra un dato e la media, $x_i - \bar{x}$, si chiama **scarto** dalla media. Gli scarti dei dati più piccoli della media sono negativi, quelli dei dati più grandi sono positivi, e la loro somma è sempre zero:

$$
\begin{aligned}
&(x_1 - \bar{x}) + (x_2 - \bar{x}) \\
&\quad + \dots + (x_n - \bar{x}) = 0
\end{aligned}
$$

Il perché si vede riordinando la somma. Si sommano i dati e si sottrae $n$ volte la media, e $n \cdot \bar{x}$ è proprio la somma dei dati, perché $\bar{x}$ è la somma divisa per $n$:

$$
\begin{aligned}
&(x_1 + x_2 + \dots + x_n) - n \cdot \bar{x} \\
&= (x_1 + x_2 + \dots + x_n) \\
&\quad - (x_1 + x_2 + \dots + x_n) = 0
\end{aligned}
$$

Con i dati $3$, $5$, $10$ la media è $18 : 3 = 6$ e gli scarti sono $-3$, $-1$ e $4$: $-3 - 1 + 4 = 0$. La media è il punto di equilibrio dei dati. Se li immagini come pesi uguali appoggiati su un'asta, l'asta sta in equilibrio su un sostegno messo nella media: i dati a sinistra sono più vicini ma sono due, quello a destra è più lontano ma è uno solo.

```tikz
% nome: media-punto-di-equilibrio
% alt: Tre pesi uguali su un'asta nei punti 3, 5 e 10, con il sostegno nel punto 6, la media; gli scarti dalla media sono meno 3, meno 1 e più 4
% svg: media-punto-di-equilibrio-6d139040.svg 264x106
\begin{tikzpicture}[x=0.7cm]
\draw[thick] (1.6,0) -- (11.4,0);
\foreach \t in {2,...,11} \draw (\t,-0.08) -- (\t,0.08);
\foreach \t in {3,5,10} \fill[blue!45] (\t,0.2) circle (5pt);
\fill[orange!40] (6,0) -- (5.72,-0.5) -- (6.28,-0.5) -- cycle;
\draw (6,0) -- (5.72,-0.5) -- (6.28,-0.5) -- cycle;
\node[below] at (3,-0.1) {$3$};
\node[below] at (5,-0.1) {$5$};
\node[below] at (10,-0.1) {$10$};
\node[below] at (6,-0.5) {$\bar{x} = 6$};
\draw[dashed] (6,0.1) -- (6,1.5);
\draw[->] (6,0.7) -- (5,0.7);
\draw[->] (6,0.7) -- (10,0.7);
\draw[->] (6,1.25) -- (3,1.25);
\node[above] at (5.5,0.7) {$-1$};
\node[above] at (8,0.7) {$+4$};
\node[above] at (4.5,1.25) {$-3$};
\end{tikzpicture}
```

```ad-tip
Il controllo con gli scarti
Dopo aver calcolato una media, puoi sommare gli scarti: se non viene zero, la media è sbagliata. Nell'esempio 1 gli scarti dalla media $1$ sono $-4$, $0$, $-1$, $-3$, $3$, $4$, $1$, e la somma è $0$.
```

## Mediana

La **mediana** è il valore che sta al centro dei dati messi in ordine crescente: metà dei dati è minore o uguale alla mediana, metà è maggiore o uguale. Per trovarla:

1. Metti i dati in ordine crescente, ripetendo i valori che compaiono più volte.
2. Se il numero $n$ dei dati è dispari, la mediana è il dato al centro, quello al posto $\dfrac{n + 1}{2}$.
3. Se $n$ è pari, al centro ci sono due dati, ai posti $\dfrac{n}{2}$ e $\dfrac{n}{2} + 1$: la mediana è la loro media.

```ad-example
Esempio 4: numero dispari di dati
I punti segnati da una giocatrice di pallavolo in cinque partite sono $12$, $5$, $9$, $3$, $7$. Trova la mediana.

In ordine crescente: $3$, $5$, $7$, $9$, $12$. I dati sono $5$, dispari: la mediana è il dato al posto $\dfrac{5 + 1}{2} = 3$, cioè $7$.

Due dati sono minori di $7$ e due sono maggiori.
```

```ad-warning
Prendere il dato al centro senza ordinare
Nella lista $12$, $5$, $9$, $3$, $7$ il dato scritto al centro è $9$, ma la mediana è $7$. Prima si ordina, poi si cerca il centro.
```

```ad-example
Esempio 5: numero pari di dati
I minuti che otto studenti hanno impiegato per finire un test sono $12$, $7$, $15$, $9$, $7$, $20$, $11$, $14$. Trova la mediana.

In ordine crescente, con il $7$ scritto due volte:

$$7, \ 7, \ 9, \ 11, \ 12, \ 14, \ 15, \ 20$$

I dati sono $8$, pari: i due centrali sono al posto $4$ e al posto $5$, cioè $11$ e $12$.

$$\text{Me} = \frac{11 + 12}{2} = 11{,}5$$

La mediana non è uno dei dati, e va bene così: quattro dati stanno sotto $11{,}5$ e quattro sopra.
```

```ad-warning
Confondere il posto con il valore
$\dfrac{n + 1}{2}$ dice in che posto sta la mediana, non quanto vale. Nell'esempio 4 la mediana non è $3$, ma il terzo dato in ordine, $7$.
```

### Mediana da una tabella di frequenze

In una tabella i valori sono già in ordine, ma ognuno compare più volte. Per sapere quale valore occupa i posti centrali si usano le frequenze cumulate: la frequenza cumulata di un valore dice quanti dati sono minori o uguali a quel valore, cioè fino a che posto arriva quel valore nella lista ordinata.

```ad-example
Esempio 6: i posti centrali in due valori diversi
In una classe di $20$ studenti si è contato il numero di fratelli e sorelle di ciascuno. Trova la mediana.

| Fratelli $x_i$ | Frequenza $f_i$ | Cumulata |
|---|---|---|
| $0$ | $4$ | $4$ |
| $1$ | $6$ | $10$ |
| $2$ | $7$ | $17$ |
| $3$ | $3$ | $20$ |

I dati sono $20$, pari: i posti centrali sono il $10$ e l'$11$. Il valore $0$ occupa i posti da $1$ a $4$, il valore $1$ i posti da $5$ a $10$, il valore $2$ i posti da $11$ a $17$. Il decimo dato è $1$, l'undicesimo è $2$:

$$\text{Me} = \frac{1 + 2}{2} = 1{,}5$$
```

## Moda

La **moda** è il valore con la frequenza più alta, quello che compare più volte. Si trova leggendo la tabella di frequenze, senza conti. È l'unico dei tre indici che si usa anche per i caratteri qualitativi non ordinabili, come il colore preferito o il mezzo di trasporto.

```ad-example
Esempio 7: un carattere qualitativo
In una classe si è chiesto come si viene a scuola.

| Mezzo | Frequenza |
|---|---|
| Autobus | $9$ |
| Auto | $8$ |
| A piedi | $5$ |
| Bici | $3$ |

La moda è "autobus", il valore con la frequenza più alta. Media e mediana non si possono calcolare: i dati non sono numeri, e non hanno un ordine.
```

```ad-warning
Scrivere la frequenza al posto del valore
Nell'esempio 7 la moda è "autobus", non $9$: $9$ è quante volte compare. Allo stesso modo, nell'esempio 6 la moda è $2$ fratelli, il valore con frequenza $7$.
```

Una distribuzione può avere più di una moda. Nei dati $2$, $3$, $3$, $5$, $7$, $7$, $8$ i valori $3$ e $7$ compaiono due volte ciascuno, più di tutti gli altri: la distribuzione ha due mode, $3$ e $7$, e si dice **bimodale**. Se invece tutti i valori hanno la stessa frequenza, come in $4$, $6$, $9$, nessun valore compare più degli altri e la distribuzione non ha moda.

## Quale indice usare

I tre indici rispondono a domande diverse e non si usano sempre tutti e tre. La prima cosa da guardare è il tipo di carattere.

| | Media | Mediana | Moda |
|---|---|---|---|
| Carattere | quantitativo | quantitativo o qualitativo ordinabile | qualsiasi |
| Usa il valore di tutti i dati | sì | no | no |
| Cambia molto con un valore anomalo | sì | no | no |

Un carattere qualitativo si dice ordinabile quando le sue modalità hanno un ordine naturale, come i giudizi "insufficiente", "sufficiente", "buono", "ottimo": in quel caso ha senso parlare del giudizio che sta al centro.

La media usa il valore di ogni dato, e per questo un solo dato molto lontano dagli altri, un **valore anomalo**, può spostarla molto. La mediana guarda solo il posto dei dati in ordine, e un dato enorme resta l'ultimo della fila, qualunque sia il suo valore.

```ad-example
Esempio 8: uno stipendio molto alto
In una piccola azienda gli stipendi mensili dei cinque dipendenti, in euro, sono $1200$, $1300$, $1300$, $1400$ e $7800$ (quello del titolare). Calcola media, mediana e moda.

La somma degli stipendi è

$$
\begin{aligned}
&1200 + 1300 + 1300 \\
&\quad + 1400 + 7800 = 13\,000
\end{aligned}
$$

e la media è

$$\bar{x} = \frac{13\,000}{5} = 2600$$

I dati sono già in ordine e sono $5$: la mediana è il terzo, $1300$. Anche la moda è $1300$, che compare due volte.

```tikz
% nome: valore-anomalo-media-mediana
% alt: Cinque stipendi su una retta da 1000 a 8000 euro, quattro vicini a 1300 e uno a 7800; la mediana è 1300, vicino al gruppo, mentre la media è 2600, spostata verso il valore anomalo
% svg: valore-anomalo-media-mediana-397ec2b1.svg 270x98
\begin{tikzpicture}[x=0.88cm]
\draw[thick, ->] (0.8,0) -- (8.3,0);
\foreach \t in {1,...,8} \draw (\t,-0.08) -- (\t,0.08);
\node[below] at (1,-0.1) {\small $1000$};
\node[below] at (2,-0.1) {\small $2000$};
\node[below] at (4,-0.1) {\small $4000$};
\node[below] at (6,-0.1) {\small $6000$};
\node[below] at (8,-0.1) {\small $8000$};
\foreach \t in {1.2,1.3,1.4,7.8} \fill[blue!45] (\t,0.2) circle (2.5pt);
\fill[blue!45] (1.3,0.4) circle (2.5pt);
\draw[orange!80!black, thick] (2.6,-0.3) -- (2.6,1);
\node[above] at (2.6,1) {\small media};
\draw[green!50!black, thick, dashed] (1.3,0.55) -- (1.3,1.5);
\node[above] at (1.3,1.5) {\small mediana};
\end{tikzpicture}
```

Quattro dipendenti su cinque guadagnano meno della metà della media. Qui la mediana, $1300$ euro, descrive lo stipendio tipico molto meglio della media, che è tirata in alto dal solo stipendio del titolare.
```

Quando nei dati c'è un valore anomalo, o i dati sono molto sbilanciati da una parte (gli stipendi, i prezzi delle case), si preferisce la mediana. Quando i dati sono numeri distribuiti senza valori anomali, si usa la media, che tiene conto di tutti. La moda si usa per i caratteri qualitativi, o quando interessa il valore più frequente, per esempio la taglia di scarpe da ordinare in più copie.

```ad-note
Due distribuzioni con la stessa media
La media da sola non dice quanto i dati sono sparsi: $5$, $6$, $7$ e $0$, $6$, $12$ hanno la stessa media $6$, ma i secondi sono molto più lontani tra loro. Per misurare quanto i dati si allontanano dalla media servono gli [indici di variabilità](/materiale/scuola-superiore/matematica/statistica/indici-di-variabilita).
```

## Media di dati raggruppati in classi

Quando i dati sono raggruppati in classi, come si fa per i caratteri continui, i singoli valori non si conoscono più: la tabella dice solo quanti dati cadono in ogni classe. Per calcolare la media si sostituisce ogni classe con il suo **valore centrale**, la media dei due estremi della classe, come se tutti i dati della classe valessero quello. Il risultato è un valore approssimato della media vera.

Per la stessa ragione, al posto della moda si indica la **classe modale**, quella con la frequenza più alta.

```ad-example
Esempio 9: il tempo per arrivare a scuola
Venti studenti hanno indicato quanti minuti impiegano per arrivare a scuola. Calcola la media approssimata.

La classe $[0, 10[$ contiene i tempi da $0$ minuti compresi a $10$ esclusi, e così le altre. Il valore centrale di $[0, 10[$ è $\dfrac{0 + 10}{2} = 5$.

| Minuti | Centrale $x_i$ | $f_i$ | $x_i \cdot f_i$ |
|---|---|---|---|
| $[0, 10[$ | $5$ | $6$ | $30$ |
| $[10, 20[$ | $15$ | $10$ | $150$ |
| $[20, 30[$ | $25$ | $3$ | $75$ |
| $[30, 40[$ | $35$ | $1$ | $35$ |
| Totale | | $20$ | $290$ |

$$\bar{x} \approx \frac{290}{20} = 14{,}5$$

Il tempo medio è di circa $14{,}5$ minuti. La classe modale è $[10, 20[$, con $10$ studenti.
```
