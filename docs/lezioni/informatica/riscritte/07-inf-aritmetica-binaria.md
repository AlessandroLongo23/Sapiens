# Addizione e moltiplicazione in binario

Quando un videogioco aggiunge dieci punti al tuo punteggio, il processore fa un'addizione tra due numeri binari. La fa in colonna, con il riporto, come l'hai imparata alle elementari: cambia solo che le cifre sono due, $0$ e $1$, e quindi le tabelline da ricordare sono cortissime. In questa lezione i numeri sono interi senza segno, scritti in base due come nella lezione [Conversioni tra binario e decimale](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/conversioni-tra-binario-e-decimale).

## La tabella dell'addizione

Sommando due bit i casi sono quattro:

| $0 + 0$ | $0 + 1$ | $1 + 0$ | $1 + 1$ |
|---|---|---|---|
| $0$ | $1$ | $1$ | $10_2$ |

Il solo caso nuovo è $1 + 1$: fa due, che in binario si scrive $10_2$. Due non è una cifra, quindi nella colonna si scrive $0$ e l'$1$ passa alla colonna di sinistra. Questo $1$ è il **riporto**, lo stesso che in base dieci nasce quando una colonna arriva a dieci.

Quando in una colonna arriva un riporto, i bit da sommare diventano tre. Se sono tutti $1$, la somma è tre, cioè $11_2$: si scrive $1$ e si riporta $1$.

## L'addizione in colonna

1. Scrivi i due numeri uno sotto l'altro, allineati a destra.
2. Parti dalla colonna di destra e somma i bit, compreso il riporto arrivato dalla colonna precedente.
3. Se la somma della colonna è $0$ o $1$, scrivila. Se è $2$ scrivi $0$ e riporta $1$; se è $3$ scrivi $1$ e riporta $1$.
4. Passa alla colonna a sinistra. Se dopo l'ultima colonna resta un riporto, scrivilo davanti al risultato.

```ad-example
Esempio 1: nessun riporto
Calcola $101_2 + 10_2$.

In nessuna colonna ci sono due $1$, quindi ogni colonna si somma da sola: $1 + 0 = 1$, $0 + 1 = 1$, $1 + 0 = 1$.

$$
101_2 + 10_2 = 111_2
$$

Controllo in base dieci: $5 + 2 = 7$.
```

```ad-example
Esempio 2: riporti in catena
Calcola $1011_2 + 110_2$.

Da destra: $1 + 0 = 1$. Poi $1 + 1 = 10_2$: scrivi $0$, riporti $1$. Nella terza colonna $0 + 1$ più il riporto fa di nuovo $10_2$: scrivi $0$, riporti $1$. Nella quarta $1 + 0$ più il riporto fa $10_2$: scrivi $0$ e riporti $1$, che va davanti a tutto.

$$
1011_2 + 110_2 = 1\,0001_2
$$

Controllo in base dieci: $11 + 6 = 17$.
```

```tikz
% nome: addizione-binaria-in-colonna
% alt: L'addizione in colonna di 1011 più 0110 in binario. Sopra le colonne, in piccolo e colorati, i tre riporti che passano dalla seconda alla terza colonna, dalla terza alla quarta e dalla quarta alla quinta. Sotto la riga il risultato 10001
\begin{tikzpicture}[font=\large]
\foreach \d [count=\i from 1] in {1,0,1,1} \node at (0.6*\i,0) {$\d$};
\foreach \d [count=\i from 1] in {0,1,1,0} \node at (0.6*\i,-0.65) {$\d$};
\node at (-0.2,-0.65) {$+$};
\draw[thick] (-0.5,-1.05) -- (2.8,-1.05);
\foreach \d [count=\i from 0] in {1,0,0,0,1} \node at (0.6*\i,-1.45) {$\d$};
\foreach \i in {0,1,2} \node[draw, circle, thick, fill=orange!30, inner sep=1.2pt, font=\footnotesize] at (0.6*\i,0.65) {$1$};
\node[right, font=\small] at (3.1,0.65) {riporti};
\node[right, font=\small] at (3.1,0) {$11$};
\node[right, font=\small] at (3.1,-0.65) {$6$};
\node[right, font=\small] at (3.1,-1.45) {$17$};
\end{tikzpicture}
```

```ad-example
Esempio 3: due numeri di otto bit
Calcola $1011\,0111_2 + 0101\,1101_2$.

$$
\begin{array}{r}
1011\,0111 \\
+\ 0101\,1101 \\
\hline
1\,0001\,0100
\end{array}
$$

Nella prima colonna a destra $1 + 1$ dà $0$ con riporto. Nella terza colonna, $1 + 1$ più il riporto arrivato dalla seconda fa $11_2$: si scrive $1$ e si riporta $1$. Lo stesso succede nella quinta. Controllo in base dieci: $183 + 93 = 276$, e $1\,0001\,0100_2 = 256 + 16 + 4 = 276$.
```

```ad-warning
In binario 1 + 1 non fa 2
La cifra $2$ in base due non esiste: $1 + 1$ si scrive $10_2$, cioè $0$ con riporto di $1$. L'altro errore frequente è dimenticare un riporto in una catena: se nella colonna ci sono già due $1$ e arriva un riporto, la somma è $11_2$ e il riporto riparte.
```

## Il traboccamento

Sulla carta un risultato può avere tutte le cifre che vuole. In un computer no: ogni numero occupa un numero fisso di bit, per esempio $8$, e con $8$ bit senza segno il valore più grande è $1111\,1111_2 = 255$. Se la somma supera questo valore, il riporto dell'ultima colonna non ha un posto dove andare e si perde. Questo si chiama **traboccamento** (in inglese overflow): il risultato non sta nei bit disponibili, e quello che resta memorizzato è un numero sbagliato.

```ad-example
Esempio 4: 200 + 100 su 8 bit
Un byte contiene $200 = 1100\,1000_2$ e gli si somma $100 = 0110\,0100_2$. Che cosa contiene alla fine?

$$
\begin{array}{r}
1100\,1000 \\
+\ 0110\,0100 \\
\hline
1\,0010\,1100
\end{array}
$$

La somma, $300$, ha nove bit. Nel byte restano gli otto di destra, $0010\,1100_2 = 44$: l'$1$ perso pesava $2^8 = 256$, e infatti $300 - 256 = 44$.
```

```tikz
% nome: traboccamento-otto-bit
% alt: Il risultato a nove bit della somma 200 più 100, cioè 1 0010 1100. Gli otto bit di destra stanno nelle otto caselle di un registro di 8 bit; il nono bit, un 1 a sinistra, è in una casella tratteggiata fuori dal registro con la scritta riporto perso
\begin{tikzpicture}[font=\small]
\foreach \b [count=\i from 1] in {0,0,1,0,1,1,0,0} \node[draw, thick, fill=blue!10, minimum width=0.7cm, minimum height=0.7cm, font=\large] at (0.7*\i,0) {$\b$};
\node[draw, thick, dashed, fill=orange!30, minimum width=0.7cm, minimum height=0.7cm, font=\large] at (-0.35,0) {$1$};
\node at (-0.35,0.75) {riporto perso};
\draw[thick] (0.35,-0.55) -- (0.35,-0.7) -- (5.95,-0.7) -- (5.95,-0.55);
\node at (3.15,-1.05) {registro di $8$ bit: resta $0010\,1100_2 = 44$};
\end{tikzpicture}
```

Per sapere se un'addizione senza segno trabocca si guarda l'ultima colonna a sinistra: c'è traboccamento quando da quella colonna esce un riporto. Con $4$ bit il valore più grande è $15$, quindi $1011_2 + 0110_2$, cioè $11 + 6$, trabocca: nei quattro bit resta $0001_2$.

```ad-warning
Un riporto non è un traboccamento
I riporti tra una colonna e l'altra sono normali. Il traboccamento c'è solo quando il riporto esce dall'ultima colonna, cioè quando il risultato vero ha un bit in più di quelli disponibili: $0101_2 + 0011_2 = 1000_2$ ha tre riporti e sta comodamente in $4$ bit.
```

Succede anche ai contatori di tutti i giorni: un contachilometri a sei cifre, arrivato a $999\,999$, al chilometro successivo torna a $000\,000$.

## La moltiplicazione

La tabellina del binario ha una sola riga utile: $0 \cdot 0 = 0$, $0 \cdot 1 = 0$, $1 \cdot 0 = 0$, $1 \cdot 1 = 1$. Moltiplicare per un bit vuol dire quindi copiare il numero, se il bit è $1$, oppure ottenere zero, se il bit è $0$.

In base dieci moltiplicare per $10$ aggiunge uno zero a destra. In base due succede lo stesso con $10_2$, che è due: tutte le cifre si spostano di un posto a sinistra e a destra entra uno $0$. Questo spostamento si chiama **scorrimento** a sinistra. Moltiplicare per $100_2 = 4$ sposta di due posti, per $1000_2 = 8$ di tre: per $2^k$ si aggiungono $k$ zeri.

```ad-example
Esempio 5: moltiplicare per una potenza di due
Calcola $1011_2 \cdot 100_2$.

$100_2$ è $2^2$: le cifre di $1011_2$ scorrono di due posti a sinistra.

$$
1011_2 \cdot 100_2 = 10\,1100_2
$$

Controllo in base dieci: $11 \cdot 4 = 44$.
```

Un moltiplicatore qualunque è una somma di potenze di due, una per ogni suo bit a $1$. Il prodotto è allora una somma di copie del moltiplicando, ognuna spostata di tanti posti quanti ne indica la posizione del bit.

1. Scrivi il moltiplicando sopra e il moltiplicatore sotto.
2. Guarda i bit del moltiplicatore da destra. Per ogni bit $1$ scrivi una copia del moltiplicando, spostata a sinistra di tanti posti quanto vale la posizione del bit; per ogni bit $0$ non scrivere niente.
3. Somma in colonna tutte le copie.

```ad-example
Esempio 6: due copie
Calcola $1011_2 \cdot 101_2$.

Il moltiplicatore ha i bit a $1$ nelle posizioni $0$ e $2$: servono una copia non spostata e una spostata di due posti.

$$
\begin{array}{r}
1011 \\
\cdot\ 101 \\
\hline
1011 \\
10\,1100 \\
\hline
11\,0111
\end{array}
$$

Controllo in base dieci: $11 \cdot 5 = 55$, e $11\,0111_2 = 32 + 16 + 4 + 2 + 1 = 55$.
```

```ad-example
Esempio 7: tre copie e molti riporti
Calcola $1101_2 \cdot 1011_2$.

I bit a $1$ del moltiplicatore sono nelle posizioni $0$, $1$ e $3$; la posizione $2$ vale $0$ e non dà nessuna copia.

$$
\begin{array}{r}
1101 \\
\cdot\ 1011 \\
\hline
1101 \\
1\,1010 \\
110\,1000 \\
\hline
1000\,1111
\end{array}
$$

Conviene sommare le copie due alla volta: $1101_2 + 1\,1010_2 = 10\,0111_2$, poi $10\,0111_2 + 110\,1000_2 = 1000\,1111_2$. Controllo in base dieci: $13 \cdot 11 = 143$.
```

```ad-warning
Ogni copia va spostata
Scrivere le copie tutte allineate a destra e sommarle dà il moltiplicando preso tante volte quanti sono gli $1$ del moltiplicatore: per $1011_2 \cdot 101_2$ si otterrebbe $1011_2 + 1011_2 = 1\,0110_2$, cioè $22$ invece di $55$.
```

Il prodotto di un numero di $n$ bit per uno di $m$ bit può avere fino a $n + m$ bit: due numeri di quattro bit possono dare un prodotto di otto. Anche la moltiplicazione, quindi, può traboccare.

## La sottrazione, in breve

La sottrazione in colonna segue la stessa idea, con il prestito al posto del riporto: $0 - 0 = 0$, $1 - 0 = 1$, $1 - 1 = 0$, e per $0 - 1$ si chiede in prestito un $1$ alla colonna di sinistra, che nella colonna in cui arriva vale due, e si calcola $10_2 - 1 = 1$. Così $1101_2 - 110_2 = 111_2$, cioè $13 - 6 = 7$. I computer però non sottraggono in questo modo: trasformano la sottrazione in un'addizione, con la rappresentazione spiegata nella lezione [Numeri interi con segno e complemento a due](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/numeri-interi-con-segno-e-complemento-a-due).
