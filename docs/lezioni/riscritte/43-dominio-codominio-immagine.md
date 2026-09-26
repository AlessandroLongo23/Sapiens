# Dominio, codominio e immagine

Pensa alla funzione che associa a ogni studente di una classe il voto dell'ultima verifica. Parte dagli studenti della classe, arriva ai voti possibili da $1$ a $10$, ma i voti presi davvero possono essere pochi: se nessuno ha preso meno di $5$, i voti da $1$ a $4$ restano inutilizzati. Dominio, codominio e immagine sono i nomi di questi tre insiemi: da dove parte la funzione, dove arriva, quali valori prende davvero.

## Dominio e codominio

Una funzione $f: A \to B$ associa a ogni elemento di $A$ uno e un solo elemento di $B$ (la definizione è nella lezione [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione)). I due insiemi hanno un nome:

- il **dominio** è l'insieme di partenza $A$, e si indica spesso con $D$;
- il **codominio** è l'insieme di arrivo $B$, quello in cui la funzione prende i suoi valori.

Una funzione è fatta di tre cose: il dominio, il codominio e la legge che dice come si calcola $f(x)$. Se cambi il dominio o il codominio, anche con la stessa legge, ottieni un'altra funzione, e le sue proprietà possono cambiare: la lezione [Funzioni iniettive, suriettive e biettive](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive) mostra che $x^2$ è suriettiva o no a seconda del codominio che scegli.

Nell'esempio dei voti il dominio è l'insieme degli studenti della classe e il codominio è $\{1,\ 2,\ \dots,\ 10\}$.

## Immagine e controimmagine di un elemento

Se $f(x) = y$, si dice che $y$ è l'**immagine** di $x$ e che $x$ è una **controimmagine** di $y$. Ogni elemento del dominio ha una e una sola immagine, perché $f$ è una funzione. Un elemento del codominio, invece, può avere nessuna controimmagine, una sola o più di una.

Prendi $A = \{-2,\ -1,\ 0,\ 1,\ 2\}$, $B = \{0,\ 1,\ 2,\ 3\}$ e la funzione $f: A \to B$ che associa a ogni numero il suo [valore assoluto](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto), $f(x) = |x|$:

$$
\begin{gathered}
-2 \mapsto 2, \qquad -1 \mapsto 1, \\
0 \mapsto 0, \\
1 \mapsto 1, \qquad 2 \mapsto 2
\end{gathered}
$$

L'immagine di $-2$ è $2$. Le controimmagini di $2$ sono due, $-2$ e $2$; quella di $0$ è una sola, $0$; il numero $3$ non ha controimmagini, perché nessun elemento di $A$ ha valore assoluto $3$.

Nel diagramma a frecce l'immagine di $x$ è l'elemento a cui arriva la freccia che parte da $x$, e le controimmagini di $y$ sono gli elementi da cui partono le frecce che arrivano a $y$.

```tikz
% nome: diagramma-frecce-valore-assoluto-immagine
% alt: Diagramma a frecce del valore assoluto da {-2, -1, 0, 1, 2} a {0, 1, 2, 3}: gli elementi 0, 1 e 2 del codominio, raggiunti dalle frecce, sono evidenziati come insieme immagine; a 3 non arriva nessuna freccia
% svg: diagramma-frecce-valore-assoluto-immagine-af018cc1.svg 209x245
\begin{tikzpicture}
\fill[blue!15, rounded corners=8pt] (2.45,-0.5) rectangle (3.55,2.35);
\draw (0,0) ellipse (0.7 and 2.9);
\draw (3,0) ellipse (0.7 and 2.9);
\node at (0,3.25) {$A$};
\node at (3,3.25) {$B$};
\node (l0) at (0,1.8) {$-2$};
\node (l1) at (0,0.9) {$-1$};
\node (l2) at (0,0) {$0$};
\node (l3) at (0,-0.9) {$1$};
\node (l4) at (0,-1.8) {$2$};
\node (r0) at (3,1.95) {$0$};
\node (r1) at (3,0.95) {$1$};
\node (r2) at (3,-0.05) {$2$};
\node (r3) at (3,-1.6) {$3$};
\node[right] at (3.75,0.95) {$f(A)$};
\draw[->, shorten >=2pt, shorten <=2pt] (l0) -- (r2);
\draw[->, shorten >=2pt, shorten <=2pt] (l1) -- (r1);
\draw[->, shorten >=2pt, shorten <=2pt] (l2) -- (r0);
\draw[->, shorten >=2pt, shorten <=2pt] (l3) -- (r1);
\draw[->, shorten >=2pt, shorten <=2pt] (l4) -- (r2);
\end{tikzpicture}
```

Quando la funzione è data con una formula, l'immagine di un numero si trova sostituendolo nella formula, la controimmagine si trova risolvendo un'equazione. Con $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 5 - 2x$, l'immagine di $3$ è $f(3) = 5 - 6 = -1$. Per la controimmagine di $9$ cerchi gli $x$ per cui $f(x) = 9$:

$$
\begin{aligned}
5 - 2x &= 9 \\
-2x &= 4 \\
x &= -2
\end{aligned}
$$

La controimmagine di $9$ è $-2$ (le equazioni di questo tipo sono nella lezione [Equazioni di primo grado intere](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere)).

```ad-warning
Scambiare immagine e controimmagine
"L'immagine di $4$" è $f(4)$: si sostituisce $4$ al posto di $x$. "La controimmagine di $4$" è il numero $x$ per cui $f(x) = 4$: si risolve un'equazione. Con $f(x) = 5 - 2x$, l'immagine di $4$ è $-3$, la controimmagine di $4$ è $\dfrac{1}{2}$ (se il dominio la contiene).
```

```ad-note
La scrittura f⁻¹(y)
Alcuni libri indicano l'insieme delle controimmagini di $y$ con $f^{-1}(y)$. È solo un modo di scrivere: non vuol dire che $f$ abbia una funzione inversa, che esiste solo per le funzioni biettive (lezione [Composizione e funzione inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/composizione-e-funzione-inversa)).
```

## Insieme immagine

L'**insieme immagine** di $f: A \to B$ è l'insieme di tutte le immagini degli elementi del dominio, cioè dei valori che la funzione assume davvero. Si scrive $f(A)$, oppure $\mathrm{Im}(f)$:

$$f(A) = \{f(x) \mid x \in A\}$$

Le immagini stanno tutte nel codominio, quindi l'insieme immagine è sempre contenuto nel codominio:

$$f(A) \subseteq B$$

Può coincidere con il codominio o essere più piccolo. Nel diagramma a frecce è la parte di $B$ a cui arriva almeno una freccia, la zona colorata nella figura sopra: per $f(x) = |x|$ l'insieme immagine è $f(A) = \{0,\ 1,\ 2\}$, mentre il codominio è $\{0,\ 1,\ 2,\ 3\}$. Un elemento del codominio sta nell'insieme immagine esattamente quando ha almeno una controimmagine. Quando $f(A) = B$ la funzione si dice suriettiva, come spiega la lezione [Funzioni iniettive, suriettive e biettive](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive).

```ad-warning
Confondere codominio e insieme immagine
Il codominio lo scegli quando scrivi $f: A \to B$: è l'insieme in cui cerchi i valori. L'insieme immagine lo calcoli: sono i valori che escono davvero. Per il voto della verifica il codominio è $\{1,\ 2,\ \dots,\ 10\}$ anche se nessuno ha preso $2$.
```

Per trovare l'insieme immagine quando il dominio ha pochi elementi, calcoli l'immagine di ognuno e raccogli i risultati, scrivendo una volta sola quelli ripetuti. Quando il dominio ha infiniti elementi, ti chiedi quali $y$ del codominio hanno almeno una controimmagine.

## Dominio e immagine nel grafico

Il grafico di una funzione numerica è l'insieme dei punti $(x,\ f(x))$ del piano cartesiano. Il dominio si legge sull'asse $x$: sono le ascisse dei punti del grafico. L'insieme immagine si legge sull'asse $y$: sono le ordinate. Ecco il grafico di $f(x) = |x|$ con $A = \{-2,\ -1,\ 0,\ 1,\ 2\}$: il dominio è segnato in blu sull'asse $x$, l'insieme immagine $\{0,\ 1,\ 2\}$ in arancione sull'asse $y$.

```tikz
% nome: grafico-dominio-immagine-valore-assoluto
% alt: Grafico per punti di f(x) uguale al valore assoluto di x con dominio {-2, -1, 0, 1, 2}: i cinque punti del grafico, il dominio segnato sull'asse x e l'insieme immagine {0, 1, 2} segnato sull'asse y
% svg: grafico-dominio-immagine-valore-assoluto-e13d1b2e.svg 232x150
\begin{tikzpicture}
\draw[->] (-2.8,0) -- (2.8,0) node[right] {$x$};
\draw[->] (0,-0.6) -- (0,2.8) node[above] {$y$};
\foreach \x in {-2,-1,1,2} \node[below] at (\x,-0.12) {$\x$};
\foreach \y in {1,2} \node[right] at (0.12,\y) {$\y$};
\node[below left] at (0,-0.05) {$0$};
\draw[dashed, gray] (-2,0) -- (-2,2) -- (0,2);
\draw[dashed, gray] (-1,0) -- (-1,1) -- (0,1);
\draw[dashed, gray] (1,0) -- (1,1);
\draw[dashed, gray] (2,0) -- (2,2);
\foreach \x in {-2,-1,0,1,2} \fill[blue!45] (\x,0) circle (0.1);
\foreach \y in {0,1,2} \fill[orange!60] (0,\y) circle (0.1);
\fill (-2,2) circle (0.07);
\fill (-1,1) circle (0.07);
\fill (0,0) circle (0.05);
\fill (1,1) circle (0.07);
\fill (2,2) circle (0.07);
\end{tikzpicture}
```

## Esempi con insiemi finiti

```ad-example
Esempio 1: il resto della divisione per 3
$A = \{1,\ 2,\ 3,\ 4,\ 5,\ 6\}$, $f: A \to \mathbb{N}$, dove $f(x)$ è il resto della divisione di $x$ per $3$. Trova l'insieme immagine e le controimmagini di $2$ e di $3$.

Le immagini, una per ogni elemento del dominio:

| $x$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ |
|---|---|---|---|---|---|---|
| $f(x)$ | $1$ | $2$ | $0$ | $1$ | $2$ | $0$ |

L'insieme immagine è $f(A) = \{0,\ 1,\ 2\}$: il codominio $\mathbb{N}$ è infinito, ma la funzione prende solo tre valori. Le controimmagini di $2$ sono $2$ e $5$. Il numero $3$ non ha controimmagini, perché il resto della divisione per $3$ è sempre minore di $3$.
```

```ad-example
Esempio 2: i giorni dei mesi
La funzione $f$ associa a ogni mese di un anno non bisestile il numero dei suoi giorni, con codominio $\mathbb{N}$. Trova l'insieme immagine e le controimmagini di $30$ e di $29$.

Il dominio ha dodici elementi, da gennaio a dicembre. I mesi hanno $31$, $30$ o $28$ giorni, quindi l'insieme immagine è $\{28,\ 30,\ 31\}$.

Le controimmagini di $30$ sono aprile, giugno, settembre e novembre. Il numero $29$ sta nel codominio ma non ha controimmagini: in un anno non bisestile nessun mese ha $29$ giorni.
```

## Esempi con infiniti elementi

```ad-example
Esempio 3: la stessa legge in due domini
$f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 2x + 1$. Trova le controimmagini di $7$ e di $4$ e l'insieme immagine.

Controimmagine di $7$: da $2x + 1 = 7$ ottieni $2x = 6$, $x = 3$, che è un intero.

Controimmagine di $4$: da $2x + 1 = 4$ ottieni $2x = 3$, $x = \dfrac{3}{2}$, che non è un intero. Nel dominio $\mathbb{Z}$ il numero $4$ non ha controimmagini.

Insieme immagine: $2x$ è sempre pari, quindi $2x + 1$ è sempre dispari; e ogni dispari $y$ si ottiene, da $x = \dfrac{y - 1}{2}$, che è intero perché $y - 1$ è pari. L'insieme immagine è l'insieme dei numeri dispari.

Con la stessa legge da $\mathbb{Q}$ a $\mathbb{Q}$ il risultato cambia: $\dfrac{3}{2}$ è un razionale, quindi $4$ ha la controimmagine $\dfrac{3}{2}$, e l'insieme immagine è tutto $\mathbb{Q}$.
```

```ad-example
Esempio 4: un quadrato non è mai negativo
$f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = x^2$. Trova le controimmagini di $9$, di $-4$ e di $5$.

Controimmagini di $9$: i numeri interi che elevati al quadrato danno $9$ sono due, $-3$ e $3$.

Controimmagini di $-4$: nessuna, perché il quadrato di un numero non è mai negativo.

Controimmagini di $5$: nessuna, perché $2^2 = 4$ e $3^2 = 9$, e nessun intero ha quadrato $5$.

L'insieme immagine è formato dai quadrati degli interi, $\{0,\ 1,\ 4,\ 9,\ 16,\ \dots\}$: non contiene nessun numero negativo, e dei positivi solo i quadrati perfetti.
```

## Il dominio naturale di una funzione numerica

Spesso una funzione numerica è data solo con la formula, per esempio $y = \dfrac{1}{x - 2}$, senza dire quali sono il dominio e il codominio. In questo caso si intende che il codominio è l'insieme dei numeri reali $\mathbb{R}$ (i razionali più numeri come $\sqrt{2}$, spiegati in [Numeri irrazionali e numeri reali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/numeri-irrazionali-e-numeri-reali)), e che il dominio è il più grande sottoinsieme di $\mathbb{R}$ in cui la formula ha senso. Questo insieme si chiama **dominio naturale**, o **campo di esistenza**. Trovare il dominio di una funzione vuol dire trovare il suo dominio naturale.

Con le formule che conosci al primo anno ci sono due casi.

Se la formula è un polinomio, come $3x^2 - 5x + 1$, puoi sostituire a $x$ qualsiasi numero reale e fare i conti: somme, sottrazioni e moltiplicazioni danno sempre un risultato. Il dominio è tutto $\mathbb{R}$.

Se la formula contiene una frazione con la $x$ al denominatore, la frazione ha senso solo quando il denominatore è diverso da zero, perché la divisione per zero non ha risultato. Il dominio è $\mathbb{R}$ senza i numeri che annullano il denominatore. Per $y = \dfrac{1}{x - 2}$ il denominatore si annulla per $x = 2$, e

$$D = \mathbb{R} \setminus \{2\}$$

che si scrive anche $D = \{x \in \mathbb{R} \mid x \neq 2\}$. La condizione $x \neq 2$ è la stessa che, per le frazioni algebriche, si chiama condizione di esistenza e si scrive "C.E.: $x \neq 2$": la lezione [Frazioni algebriche e condizioni di esistenza](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza) spiega come si trovano quando il denominatore è più complicato.

### Procedimento

1. Se la formula è un polinomio, il dominio è $\mathbb{R}$.
2. Se ci sono frazioni, prendi ogni denominatore che contiene la $x$.
3. Trova i valori di $x$ che lo annullano: se è di primo grado, risolvi l'equazione denominatore $= 0$; se è di grado più alto, scomponilo e poni ogni fattore diverso da zero.
4. Il dominio è $\mathbb{R}$ senza tutti i valori trovati.

```ad-warning
Escludere i numeri sbagliati
Si escludono solo i valori che annullano un denominatore. Il numeratore può valere zero senza problemi: in $\dfrac{x - 3}{x + 1}$ il valore $x = 3$ dà $\dfrac{0}{4} = 0$, che è un numero. E un numero al denominatore non esclude niente: $\dfrac{x - 3}{4}$ è un polinomio, con dominio $\mathbb{R}$.
```

## Esempi sul dominio naturale

```ad-example
Esempio 5: un polinomio
Trova il dominio di $f(x) = x^3 - 2x + 5$ e calcola $f(-2)$.

È un polinomio, quindi il dominio è $\mathbb{R}$.

$$
\begin{aligned}
f(-2) &= (-2)^3 - 2 \cdot (-2) + 5 \\
&= -8 + 4 + 5 \\
&= 1
\end{aligned}
$$
```

```ad-example
Esempio 6: un denominatore di primo grado
Trova il dominio di $f(x) = \dfrac{x + 4}{2x + 5}$.

Il denominatore si annulla quando $2x + 5 = 0$, cioè $2x = -5$, $x = -\dfrac{5}{2}$.

$$D = \mathbb{R} \setminus \left\{-\frac{5}{2}\right\}$$

Il numeratore si annulla per $x = -4$, che resta nel dominio: $f(-4) = \dfrac{0}{-3} = 0$.
```

```ad-example
Esempio 7: un denominatore da scomporre
Trova il dominio di $f(x) = \dfrac{x + 1}{x^2 - 3x}$.

Il denominatore è di secondo grado: lo scomponi con un [raccoglimento totale](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale), $x^2 - 3x = x(x - 3)$. Un prodotto vale zero quando vale zero almeno uno dei fattori (la legge di annullamento del prodotto, nella lezione sulle [condizioni di esistenza](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza)), quindi il denominatore si annulla per $x = 0$ e per $x = 3$.

$$D = \mathbb{R} \setminus \{0,\ 3\}$$
```

```ad-example
Esempio 8: un denominatore che non si annulla mai
Trova il dominio di $f(x) = \dfrac{x - 1}{x^2 + 4}$.

Il quadrato $x^2$ non è mai negativo, quindi $x^2 + 4$ vale almeno $4$ e non è mai zero. Non c'è niente da escludere: il dominio è $\mathbb{R}$, anche se la formula è una frazione.
```

```ad-example
Esempio 9: due frazioni
Trova il dominio di $f(x) = \dfrac{1}{x} + \dfrac{2}{x + 1}$.

Ogni denominatore va controllato: il primo si annulla per $x = 0$, il secondo per $x = -1$. La formula ha senso solo se tutte e due le frazioni hanno senso, quindi escludi entrambi i valori.

$$D = \mathbb{R} \setminus \{-1,\ 0\}$$
```

```ad-example
Esempio 10: il dominio si trova prima di semplificare
Trova il dominio di $f(x) = \dfrac{x^2 - 1}{x - 1}$.

Il denominatore si annulla per $x = 1$, quindi $D = \mathbb{R} \setminus \{1\}$.

Il numeratore si scompone, $x^2 - 1 = (x - 1)(x + 1)$, e per $x \neq 1$ la frazione è uguale a $x + 1$. Ma le due funzioni non sono la stessa: $x + 1$ in $x = 1$ vale $2$, mentre $f(1)$ darebbe $\dfrac{0}{0}$, che non esiste. Il dominio si legge sulla formula di partenza, prima di semplificare (la semplificazione è nella lezione [Semplificazione delle frazioni algebriche](/materiale/scuola-superiore/matematica/frazioni-algebriche/semplificazione-delle-frazioni-algebriche)).
```

```ad-note
Il dominio nei problemi
Quando una funzione descrive una situazione concreta, il dominio può essere più piccolo di quello naturale. L'area di un quadrato di lato $x$ è $A(x) = x^2$: la formula ha senso per ogni numero reale, ma un lato è una lunghezza, quindi nel problema il dominio è formato solo dai numeri positivi.
```
