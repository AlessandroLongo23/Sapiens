# Operazioni in ℚ

Con le frazioni si fanno le stesse quattro operazioni dei numeri interi, ma con due regole diverse: addizione e sottrazione passano dal denominatore comune, moltiplicazione e divisione si fanno direttamente su numeratori e denominatori. In ℚ, poi, la divisione si può fare sempre, purché il divisore non sia zero. Le regole dei segni sono quelle di [Operazioni in ℤ](/materiale/scuola-superiore/matematica/numeri-interi/operazioni-in-z); come si riduce una frazione ai minimi termini è spiegato in [Frazioni e numeri razionali](/materiale/scuola-superiore/matematica/numeri-razionali/frazioni-e-numeri-razionali). Come nel resto del capitolo, i denominatori sono positivi: $\dfrac{3}{-4}$ si scrive $-\dfrac{3}{4}$.

## Addizione e sottrazione con lo stesso denominatore

Se due frazioni hanno lo stesso denominatore, si sommano (o si sottraggono) i numeratori e il denominatore resta quello:

$$\dfrac{a}{c} + \dfrac{b}{c} = \dfrac{a + b}{c} \qquad \dfrac{a}{c} - \dfrac{b}{c} = \dfrac{a - b}{c} \qquad (c \neq 0)$$

Il denominatore dice in quante parti è diviso l'intero e il numeratore quante di quelle parti prendi: due settimi più tre settimi fanno cinque settimi.

```ad-example
Esempio: stesso denominatore
$\dfrac{2}{7} + \dfrac{3}{7} = \dfrac{5}{7}$

$\dfrac{5}{9} - \dfrac{8}{9} = \dfrac{5 - 8}{9} = -\dfrac{3}{9} = -\dfrac{1}{3}$, dove alla fine il risultato si riduce ai minimi termini.
```

```ad-warning
Sommare anche i denominatori
$\dfrac{2}{7} + \dfrac{3}{7}$ non è $\dfrac{5}{14}$: $\dfrac{5}{14}$ è minore di $\dfrac{3}{7} = \dfrac{6}{14}$, e sommando due numeri positivi non si può ottenere meno di uno dei due. Il denominatore dice la grandezza delle parti, e sommando le parti la loro grandezza non cambia.
```

## Addizione e sottrazione con denominatori diversi

Mezzo e un terzo non si possono sommare così come sono, perché contano parti di grandezza diversa. Scritti in sesti diventano $\dfrac{3}{6}$ e $\dfrac{2}{6}$, e a quel punto si sommano come prima: $\dfrac{1}{2} + \dfrac{1}{3} = \dfrac{5}{6}$.

```tikz
% nome: somma-di-frazioni-un-mezzo-piu-un-terzo
% alt: Segmento da 0 a 1 diviso in sesti: un primo arco va da 0 a tre sesti, cioè un mezzo, un secondo arco prosegue per due sesti, cioè un terzo, e arriva a cinque sesti
% svg: somma-di-frazioni-un-mezzo-piu-un-terzo-3cab6e68.svg 310x91
\begin{tikzpicture}
\draw[->] (-0.4,0) -- (7.7,0);
\draw (1.2,-0.08) -- (1.2,0.08);
\draw (2.4,-0.08) -- (2.4,0.08);
\draw (3.6,-0.08) -- (3.6,0.08);
\draw (4.8,-0.08) -- (4.8,0.08);
\draw (6.0,-0.08) -- (6.0,0.08);
\draw (0,-0.18) -- (0,0.18);
\draw (7.2,-0.18) -- (7.2,0.18);
\node[below] at (0,-0.2) {$0$};
\node[below] at (7.2,-0.2) {$1$};
\draw[->, thick] (0,0.2) to[bend left=35] (3.6,0.2);
\node[above] at (1.8,0.8) {$\frac{1}{2} = \frac{3}{6}$};
\draw[->, thick] (3.6,0.2) to[bend left=35] (6.0,0.2);
\node[above] at (4.8,0.6) {$\frac{1}{3} = \frac{2}{6}$};
\fill (6.0,0) circle (0.07);
\node[below] at (6.0,-0.2) {$\frac{5}{6}$};
\end{tikzpicture}
```

In generale si trasformano le frazioni in frazioni equivalenti con lo stesso denominatore, come si fa nel [confronto tra frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/confronto-tra-frazioni), e il denominatore comune più comodo è il MCM dei denominatori (se non ricordi come si calcola, c'è la lezione [MCD e MCM in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n)).

1. Riduci ai minimi termini le frazioni che non lo sono.
2. Calcola il MCM dei denominatori: è il denominatore del risultato.
3. Per ogni frazione dividi il MCM per il suo denominatore e moltiplica il quoziente per il suo numeratore.
4. Somma o sottrai i numeri ottenuti: danno il numeratore del risultato.
5. Riduci il risultato ai minimi termini.

```ad-example
Esempio: sommare 5/6 e 3/4
$\text{MCM}(6, 4) = 12$. Per la prima frazione $12 : 6 = 2$ e $2 \cdot 5 = 10$; per la seconda $12 : 4 = 3$ e $3 \cdot 3 = 9$. Di solito si scrive tutto su un'unica linea di frazione:

$$\dfrac{5}{6} + \dfrac{3}{4} = \dfrac{10 + 9}{12} = \dfrac{19}{12}$$
```

Come denominatore comune va bene anche il prodotto dei denominatori, $6 \cdot 4 = 24$: il risultato è lo stesso, $\dfrac{20 + 18}{24} = \dfrac{38}{24} = \dfrac{19}{12}$, ma con numeri più grandi da ridurre alla fine.

```ad-warning
Sommare numeratori con numeratori e denominatori con denominatori
$\dfrac{1}{2} + \dfrac{1}{3}$ non è $\dfrac{2}{5}$: $\dfrac{2}{5}$ è addirittura minore di $\dfrac{1}{2}$, mentre aggiungendo un numero positivo il risultato deve crescere. La somma giusta è $\dfrac{5}{6}$.
```

```ad-warning
Cambiare il denominatore e lasciare il numeratore
Per scrivere $\dfrac{3}{4}$ in dodicesimi il numeratore va moltiplicato per lo stesso numero del denominatore: $\dfrac{3}{4} = \dfrac{9}{12}$, non $\dfrac{3}{12}$. Se scrivi il MCM sotto e lasci i numeratori come sono, cambi il valore delle frazioni.
```

### Numeri interi e frazioni

Un numero intero è una frazione con denominatore $1$, per esempio $3 = \dfrac{3}{1}$, quindi si somma a una frazione con la stessa regola:

$$3 - \dfrac{7}{4} = \dfrac{12 - 7}{4} = \dfrac{5}{4} \qquad 2 + \dfrac{3}{5} = \dfrac{10 + 3}{5} = \dfrac{13}{5}$$

```ad-note
Numeri misti
Alle superiori il risultato si lascia come frazione, anche quando il numeratore è maggiore del denominatore: $\dfrac{13}{5}$. In qualche problema trovi però la scrittura $2\tfrac{3}{5}$, detta numero misto: vuol dire $2 + \dfrac{3}{5}$, non $2 \cdot \dfrac{3}{5}$. Prima di fare conti trasformala in frazione: $2\tfrac{3}{5} = \dfrac{2 \cdot 5 + 3}{5} = \dfrac{13}{5}$.
```

## Frazioni con segno

Il segno meno di una frazione si può scrivere davanti, al numeratore o al denominatore: $-\dfrac{3}{4} = \dfrac{-3}{4} = \dfrac{3}{-4}$. Nelle somme conviene portarlo al numeratore, così i numeratori diventano numeri interi da sommare con le regole di [Operazioni in ℤ](/materiale/scuola-superiore/matematica/numeri-interi/operazioni-in-z).

```ad-example
Esempio: somma con una frazione negativa
$\text{MCM}(3, 4) = 12$, e il meno della prima frazione passa al suo numeratore:

$$-\dfrac{2}{3} + \dfrac{1}{4} = \dfrac{-8 + 3}{12} = -\dfrac{5}{12}$$
```

```ad-warning
Estendere il meno a tutta la somma
In $-\dfrac{2}{3} + \dfrac{1}{4}$ il meno riguarda solo la prima frazione. Scrivere $-\dfrac{8 + 3}{12} = -\dfrac{11}{12}$ vuol dire sottrarre anche $\dfrac{1}{4}$, che invece si somma.
```

L'**opposto** di una frazione è la stessa frazione con il segno cambiato: l'opposto di $\dfrac{2}{5}$ è $-\dfrac{2}{5}$, e la somma di un numero e del suo opposto è $0$. Come negli interi, sottrarre una frazione vuol dire sommare la sua opposta:

$$\dfrac{a}{b} - \dfrac{c}{d} = \dfrac{a}{b} + \left(-\dfrac{c}{d}\right)$$

```ad-example
Esempio: sottrarre una frazione negativa
Togliere $-\dfrac{3}{4}$ vuol dire aggiungere $\dfrac{3}{4}$, e $\text{MCM}(6, 4) = 12$:

$$\dfrac{1}{6} - \left(-\dfrac{3}{4}\right) = \dfrac{1}{6} + \dfrac{3}{4} = \dfrac{2 + 9}{12} = \dfrac{11}{12}$$
```

## Moltiplicazione

Il prodotto di due frazioni ha per numeratore il prodotto dei numeratori e per denominatore il prodotto dei denominatori:

$$\dfrac{a}{b} \cdot \dfrac{c}{d} = \dfrac{a \cdot c}{b \cdot d} \qquad (b \neq 0,\ d \neq 0)$$

Qui il denominatore comune non serve. Moltiplicare per $\dfrac{2}{3}$ vuol dire prendere i due terzi: i due terzi di $\dfrac{4}{5}$ sono $\dfrac{2}{3} \cdot \dfrac{4}{5} = \dfrac{8}{15}$. Un numero intero si moltiplica per il numeratore, perché ha denominatore $1$: $4 \cdot \dfrac{2}{7} = \dfrac{8}{7}$.

Il segno del prodotto segue la regola dei segni degli interi: fattori concordi danno un prodotto positivo, fattori discordi un prodotto negativo. Per esempio $\left(-\dfrac{3}{5}\right) \cdot \left(-\dfrac{10}{9}\right) = +\dfrac{30}{45} = \dfrac{2}{3}$.

### Semplificazione in croce

Prima di moltiplicare conviene ridurre i numeri. Un numeratore e un denominatore qualsiasi, anche di due frazioni diverse, si possono dividere per uno stesso divisore comune: il prodotto è un'unica frazione $\dfrac{a \cdot c}{b \cdot d}$, e dividere un fattore sopra e un fattore sotto per lo stesso numero non cambia il suo valore. Quando si semplifica il numeratore di una frazione con il denominatore dell'altra si parla di **semplificazione in croce**.

```ad-example
Esempio: semplificare prima di moltiplicare
In $\dfrac{9}{10} \cdot \dfrac{25}{12}$ si dividono $9$ e $12$ per $3$, che danno $3$ e $4$, e $25$ e $10$ per $5$, che danno $5$ e $2$:

$$\dfrac{9}{10} \cdot \dfrac{25}{12} = \dfrac{3}{2} \cdot \dfrac{5}{4} = \dfrac{15}{8}$$

Senza semplificare si arriva a $\dfrac{225}{120}$, che va ridotta dividendo per $15$: il risultato è lo stesso, con più fatica.
```

```ad-warning
Semplificare in croce in una somma
In $\dfrac{3}{4} + \dfrac{2}{3}$ i due $3$ non si possono semplificare: si otterrebbe $\dfrac{1}{4} + \dfrac{2}{1} = \dfrac{9}{4}$, mentre la somma vale $\dfrac{9 + 8}{12} = \dfrac{17}{12}$. La semplificazione in croce vale solo nel prodotto.
```

## Reciproco e divisione

Due numeri sono **reciproci** quando il loro prodotto è $1$. Il reciproco di una frazione $\dfrac{a}{b}$, con $a \neq 0$, si ottiene scambiando numeratore e denominatore:

$$\dfrac{a}{b} \cdot \dfrac{b}{a} = 1 \qquad (a \neq 0,\ b \neq 0)$$

Il reciproco di $\dfrac{3}{7}$ è $\dfrac{7}{3}$, quello di $5$ è $\dfrac{1}{5}$, quello di $-\dfrac{2}{5}$ è $-\dfrac{5}{2}$: il segno resta, perché il prodotto deve essere $+1$. Lo zero non ha reciproco, perché qualunque numero moltiplicato per $0$ dà $0$ e mai $1$. In [Potenze in ℚ](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q) il reciproco si scrive anche con l'esponente $-1$: $\left(\dfrac{3}{7}\right)^{-1} = \dfrac{7}{3}$.

```ad-warning
Confondere reciproco e opposto
L'opposto di $\dfrac{2}{5}$ è $-\dfrac{2}{5}$ (la somma fa $0$), il reciproco è $\dfrac{5}{2}$ (il prodotto fa $1$). Il reciproco cambia di posto numeratore e denominatore, non il segno.
```

Per dividere per una frazione si moltiplica per il suo reciproco:

$$\dfrac{a}{b} : \dfrac{c}{d} = \dfrac{a}{b} \cdot \dfrac{d}{c} \qquad (b \neq 0,\ c \neq 0,\ d \neq 0)$$

Il quoziente $\dfrac{a}{b} : \dfrac{c}{d}$ è il numero che, moltiplicato per $\dfrac{c}{d}$, dà $\dfrac{a}{b}$, e $\dfrac{a}{b} \cdot \dfrac{d}{c}$ fa proprio questo: $\dfrac{a}{b} \cdot \dfrac{d}{c} \cdot \dfrac{c}{d} = \dfrac{a}{b} \cdot 1 = \dfrac{a}{b}$. Il segno del quoziente segue la stessa regola del prodotto.

```ad-example
Esempio: dividere per una frazione e per un intero
Il divisore $\dfrac{9}{8}$ si capovolge, poi si semplifica in croce ($3$ con $9$, $8$ con $4$):

$$\dfrac{3}{4} : \dfrac{9}{8} = \dfrac{3}{4} \cdot \dfrac{8}{9} = \dfrac{1}{1} \cdot \dfrac{2}{3} = \dfrac{2}{3}$$

Dividere per $3$ vuol dire moltiplicare per $\dfrac{1}{3}$: $\dfrac{6}{7} : 3 = \dfrac{6}{7} \cdot \dfrac{1}{3} = \dfrac{2}{7}$.
```

```ad-warning
Capovolgere la frazione sbagliata
Si capovolge il divisore, cioè la seconda frazione. Capovolgendo la prima, $\dfrac{3}{4} : \dfrac{9}{8}$ diventerebbe $\dfrac{4}{3} \cdot \dfrac{9}{8} = \dfrac{3}{2}$, che è il reciproco del risultato giusto $\dfrac{2}{3}$.
```

```ad-warning
Semplificare in croce prima di capovolgere
In $\dfrac{6}{5} : \dfrac{10}{3}$ semplificare $6$ con $3$ e $10$ con $5$ porta a $\dfrac{2}{1} : \dfrac{2}{1} = 1$, che è sbagliato. Prima si trasforma la divisione in prodotto, $\dfrac{6}{5} \cdot \dfrac{3}{10}$, poi si semplifica $6$ con $10$: $\dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$.
```

La linea di frazione è anch'essa una divisione, $\dfrac{a}{b} = a : b$. Per questo una frazione che ha frazioni al numeratore e al denominatore si calcola come un quoziente:

$$\dfrac{\;\dfrac{2}{3}\;}{\dfrac{4}{5}} = \dfrac{2}{3} : \dfrac{4}{5} = \dfrac{2}{3} \cdot \dfrac{5}{4} = \dfrac{5}{6}$$

## Proprietà delle operazioni

In ℚ valgono le proprietà dell'addizione e della moltiplicazione che conosci da [Operazioni in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n): commutativa, associativa, distributiva della moltiplicazione rispetto all'addizione e alla sottrazione; $0$ è l'elemento neutro dell'addizione e $1$ quello della moltiplicazione. In più ogni numero razionale ha l'opposto e ogni numero razionale diverso da zero ha il reciproco, e per questo in ℚ si può sempre sottrarre e si può sempre dividere, tranne che per zero.

| Operazione | Interna in ℕ | Interna in ℤ | Interna in ℚ |
|---|---|---|---|
| Addizione | sì | sì | sì |
| Sottrazione | no | sì | sì |
| Moltiplicazione | sì | sì | sì |
| Divisione (divisore $\neq 0$) | no | no | sì |

La proprietà distributiva aiuta nei conti a mente:

$$\dfrac{3}{4} \cdot \left(8 + \dfrac{4}{3}\right) = \dfrac{3}{4} \cdot 8 + \dfrac{3}{4} \cdot \dfrac{4}{3} = 6 + 1 = 7$$

Sottrazione e divisione restano non commutative: $\dfrac{1}{2} - \dfrac{1}{3} = \dfrac{1}{6}$ mentre $\dfrac{1}{3} - \dfrac{1}{2} = -\dfrac{1}{6}$, e $\dfrac{1}{2} : \dfrac{1}{3} = \dfrac{3}{2}$ mentre $\dfrac{1}{3} : \dfrac{1}{2} = \dfrac{2}{3}$. Scambiando i termini si ottiene l'opposto nella sottrazione e il reciproco nella divisione.

## Esempi svolti

Le espressioni con più operazioni e parentesi hanno una lezione propria, [Espressioni con frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/espressioni-con-frazioni); qui gli esempi hanno al massimo due operazioni.

```ad-example
Esempio 1: sottrazione con il MCM
Calcola $\dfrac{7}{12} - \dfrac{3}{8}$.

$12 = 2^2 \cdot 3$ e $8 = 2^3$, quindi $\text{MCM}(12, 8) = 2^3 \cdot 3 = 24$. Poi $24 : 12 = 2$ e $24 : 8 = 3$:

$$\dfrac{7}{12} - \dfrac{3}{8} = \dfrac{14 - 9}{24} = \dfrac{5}{24}$$
```

```ad-example
Esempio 2: una frazione da ridurre e un segno meno
Calcola $-\dfrac{10}{12} + \dfrac{4}{15}$.

Prima si riduce: $-\dfrac{10}{12} = -\dfrac{5}{6}$. Poi $\text{MCM}(6, 15) = 30$, con $30 : 6 = 5$ e $30 : 15 = 2$:

$$-\dfrac{5}{6} + \dfrac{4}{15} = \dfrac{-25 + 8}{30} = -\dfrac{17}{30}$$

Senza ridurre prima, il MCM di $12$ e $15$ sarebbe stato $60$: stesso risultato, numeri più grandi.
```

```ad-example
Esempio 3: prodotto con segni diversi
Calcola $\left(-\dfrac{14}{15}\right) \cdot \dfrac{25}{21}$.

I fattori sono discordi, quindi il prodotto è negativo. Si semplificano $14$ e $21$ per $7$ (restano $2$ e $3$) e $25$ e $15$ per $5$ (restano $5$ e $3$):

$$\left(-\dfrac{14}{15}\right) \cdot \dfrac{25}{21} = -\dfrac{2}{3} \cdot \dfrac{5}{3} = -\dfrac{10}{9}$$
```

```ad-example
Esempio 4: quoziente di due frazioni negative
Calcola $\left(-\dfrac{8}{9}\right) : \left(-\dfrac{4}{15}\right)$.

Dividendo e divisore sono concordi, quindi il quoziente è positivo. Si capovolge il divisore e poi si semplifica: $8$ con $4$, $15$ con $9$ (per $3$).

$$\left(-\dfrac{8}{9}\right) : \left(-\dfrac{4}{15}\right) = +\dfrac{8}{9} \cdot \dfrac{15}{4} = \dfrac{2}{3} \cdot \dfrac{5}{1} = \dfrac{10}{3}$$
```

```ad-example
Esempio 5: un intero, un prodotto e una sottrazione
Calcola $2 - \dfrac{3}{4} \cdot \dfrac{2}{9}$.

La moltiplicazione si fa prima della sottrazione. Semplificando $3$ con $9$ e $2$ con $4$:

$$\dfrac{3}{4} \cdot \dfrac{2}{9} = \dfrac{1}{2} \cdot \dfrac{1}{3} = \dfrac{1}{6}$$

Poi $2 = \dfrac{12}{6}$, quindi

$$2 - \dfrac{1}{6} = \dfrac{12 - 1}{6} = \dfrac{11}{6}$$
```

```ad-example
Esempio 6: differenza tra parentesi, poi quoziente
Calcola $\left(\dfrac{1}{2} - \dfrac{5}{6}\right) : \dfrac{2}{3}$.

Prima la parentesi, con $\text{MCM}(2, 6) = 6$:

$$\dfrac{1}{2} - \dfrac{5}{6} = \dfrac{3 - 5}{6} = -\dfrac{2}{6} = -\dfrac{1}{3}$$

Poi la divisione, capovolgendo il divisore:

$$-\dfrac{1}{3} : \dfrac{2}{3} = -\dfrac{1}{3} \cdot \dfrac{3}{2} = -\dfrac{1}{2}$$
```

## Problemi con le frazioni

Nei problemi una frazione è sempre la frazione di qualcosa: "i $\dfrac{2}{5}$ dello stipendio" vuol dire lo stipendio diviso in $5$ parti uguali, di cui se ne prendono $2$. Il "di" dopo una frazione si traduce con una moltiplicazione, $\dfrac{2}{5}$ di $1500$ è $\dfrac{2}{5} \cdot 1500 = 600$; quando il totale non è dato, l'intero vale $1$ e ogni parte è una frazione di quell'intero.

Prima di fare i conti chiediti di che cosa è frazione ciascun numero:

- se due frazioni sono dello stesso intero, le parti si sommano, e quello che resta è $1$ meno la somma;
- se la seconda frazione è di quello che resta ("la metà di quello che resta", "$\dfrac{1}{3}$ del resto"), calcoli prima il resto come frazione dell'intero e poi lo moltiplichi per la seconda frazione: la metà di $\dfrac{2}{3}$ è $\dfrac{1}{2} \cdot \dfrac{2}{3} = \dfrac{1}{3}$.

Se il testo dà anche il totale, conviene trovare prima la frazione che chiede la domanda e moltiplicarla per il totale solo alla fine.

```ad-example
Esempio: due parti dello stesso stipendio
Marta spende i $\dfrac{2}{5}$ dello stipendio per l'affitto e $\dfrac{1}{4}$ per la spesa. Che frazione dello stipendio le resta?

Tutte e due le frazioni sono dello stipendio, quindi si sommano, con $\text{MCM}(5, 4) = 20$:

$$\dfrac{2}{5} + \dfrac{1}{4} = \dfrac{8 + 5}{20} = \dfrac{13}{20} \qquad 1 - \dfrac{13}{20} = \dfrac{20 - 13}{20} = \dfrac{7}{20}$$

Le restano i $\dfrac{7}{20}$ dello stipendio. Se lo stipendio è di $1600$ euro, sono $1600 : 20 \cdot 7 = 560$ euro.
```

```ad-example
Esempio: la metà del resto
Luca legge $\dfrac{1}{3}$ di un libro il primo giorno e la metà di quello che resta il secondo giorno. Che frazione del libro gli resta da leggere?

Dopo il primo giorno resta $1 - \dfrac{1}{3} = \dfrac{2}{3}$ del libro. Il secondo giorno legge la metà di questi $\dfrac{2}{3}$, cioè $\dfrac{1}{2} \cdot \dfrac{2}{3} = \dfrac{1}{3}$ del libro. Gli resta

$$\dfrac{2}{3} - \dfrac{1}{3} = \dfrac{1}{3}$$

Se il libro ha $180$ pagine, il secondo giorno ne legge $180 : 3 = 60$ e gliene restano $60$.
```

```ad-warning
Prendere la frazione del resto sul totale
Nel secondo esempio $\dfrac{1}{2}$ non è la metà del libro, ma la metà di quello che restava. Il conto $1 - \left(\dfrac{1}{3} + \dfrac{1}{2}\right) = \dfrac{1}{6}$ risponde a un altro problema, quello in cui il secondo giorno Luca legge metà del libro intero. Prima di sommare due frazioni, controlla che siano frazioni dello stesso intero.
```
