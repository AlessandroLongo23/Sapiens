# Sistemi di due equazioni in due incognite

Un quaderno e una penna costano insieme $5$ €; due quaderni e tre penne costano $12$ €. Se chiami $x$ il prezzo di un quaderno e $y$ quello di una penna, le due frasi diventano due equazioni, $x + y = 5$ e $2x + 3y = 12$, che devono essere vere insieme. Nessuna delle due, da sola, permette di trovare i prezzi; insieme formano un sistema, e la sua soluzione è $x = 3$, $y = 2$: il quaderno costa $3$ € e la penna $2$ €. Per seguire la lezione devi saper risolvere un'equazione di primo grado, come nella lezione [Equazioni di primo grado intere](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere).

## Equazioni lineari in due incognite

Un'equazione in due incognite $x$ e $y$ si dice **lineare**, o di primo grado, quando si può scrivere nella forma

$$ax + by = c$$

dove $a$, $b$ e $c$ sono numeri e $a$ e $b$ non sono tutti e due zero. Per esempio $x + y = 5$ e $2x - 3y = 1$ sono lineari; $xy = 6$ e $x^2 + y = 4$ no, perché contengono un termine di secondo grado.

Una soluzione di un'equazione in due incognite non è un numero ma una coppia di numeri, uno per $x$ e uno per $y$, che messi al posto delle incognite rendono vera l'uguaglianza. Si scrive come **coppia ordinata** $(x, y)$, con il valore di $x$ al primo posto, come nella lezione [Prodotto cartesiano](/materiale/scuola-superiore/matematica/insiemi-e-logica/prodotto-cartesiano).

Le soluzioni di $x + y = 5$ sono $(0, 5)$, $(1, 4)$, $(2, 3)$, $(3, 2)$, ma anche $(-1, 6)$ e $\left(\dfrac{1}{2}, \dfrac{9}{2}\right)$: puoi scegliere $x$ come vuoi e ricavare $y = 5 - x$. Un'equazione lineare in due incognite ha quindi infinite soluzioni. La coppia $(1, 3)$ invece non è una soluzione, perché $1 + 3 = 4$ e non $5$.

Ricavando $y$ si ottiene $y = -x + 5$, che è una [funzione lineare](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa) $y = mx + q$ con $m = -1$ e $q = 5$. Se disegni nel piano cartesiano i punti che hanno per coordinate le soluzioni, trovi tutti i punti di una retta.

```tikz
% nome: equazione-lineare-due-incognite-retta
% alt: La retta di equazione x + y = 5 nel piano cartesiano, con evidenziati i punti (0, 5), (1, 4), (2, 3), (3, 2), (4, 1) e (5, 0), che sono alcune delle sue infinite soluzioni
% svg: equazione-lineare-due-incognite-retta-c725f409.svg 164x165
\begin{tikzpicture}[scale=0.5]
\draw[->] (-1,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-1) -- (0,6.6) node[above] {$y$};
\foreach \x in {1,2,3,4,5} \draw (\x,0.12) -- (\x,-0.12) node[below] {$\x$};
\foreach \y in {1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y) node[left] {$\y$};
\draw[thick, blue!60] (-0.8,5.8) -- (5.8,-0.8);
\foreach \x in {0,1,2,3,4,5} \fill (\x,5-\x) circle (0.12);
\node[right] at (3.2,2.4) {$x + y = 5$};
\end{tikzpicture}
```

Vale per ogni equazione lineare: le sue soluzioni, disegnate nel piano, formano una retta. Da qui viene il nome "lineare".

## Il sistema e la sua soluzione

Un **sistema** di due equazioni in due incognite è una coppia di equazioni che devono essere vere nello stesso momento. Si scrive con una parentesi graffa:

$$
\begin{cases}
x + y = 5 \\
2x + 3y = 12
\end{cases}
$$

Una **soluzione del sistema** è una coppia $(x, y)$ che è soluzione di tutte e due le equazioni. La coppia $(3, 2)$ lo è: $3 + 2 = 5$ e $2 \cdot 3 + 3 \cdot 2 = 12$. La coppia $(1, 4)$ invece risolve la prima equazione ($1 + 4 = 5$) ma non la seconda ($2 + 12 = 14$), quindi non è una soluzione del sistema. Risolvere un sistema vuol dire trovare tutte le sue soluzioni; l'insieme delle soluzioni si indica con $S$, e qui $S = \{(3, 2)\}$.

```ad-warning
Scambiare l'ordine nella coppia
La soluzione $x = 3$, $y = 2$ si scrive $(3, 2)$, non $(2, 3)$: la coppia $(2, 3)$ vuol dire $x = 2$ e $y = 3$, e non risolve il sistema, perché $2 \cdot 2 + 3 \cdot 3 = 13$. Non si scrive nemmeno $S = \{3, 2\}$, che è un insieme di due numeri: la soluzione è una sola coppia.
```

## Forma normale e grado

Un sistema lineare è in **forma normale** quando ogni equazione ha i termini con le incognite a primo membro, prima $x$ e poi $y$, e il termine noto a secondo membro:

$$
\begin{cases}
ax + by = c \\
a'x + b'y = c'
\end{cases}
$$

I numeri $a$, $b$, $a'$, $b'$ sono i coefficienti delle incognite, $c$ e $c'$ i termini noti. Per portare un'equazione in forma normale si usano i principi di equivalenza, come nelle equazioni di primo grado. Per esempio $2(x - 1) + y = 3x - 4$ diventa $2x - 2 + y = 3x - 4$, poi $-x + y = -2$ e, cambiando segno a tutti i termini, $x - y = 2$.

Il **grado del sistema** è il prodotto dei gradi delle sue equazioni, lette in forma normale. Un sistema di due equazioni di primo grado ha grado $1 \cdot 1 = 1$ e si chiama **sistema lineare**; il sistema formato da $x + y = 5$ e $xy = 6$ ha grado $1 \cdot 2 = 2$ e si risolve con le equazioni di secondo grado, nella lezione sui sistemi di secondo grado. In questa lezione tutti i sistemi sono lineari.

## Metodo di sostituzione

1. Scegli un'equazione e ricava una delle incognite, per esempio $y$ in funzione di $x$.
2. Sostituisci l'espressione trovata al posto di quell'incognita nell'altra equazione: ottieni un'equazione in una sola incognita.
3. Risolvi questa equazione.
4. Metti il valore trovato nell'espressione del passo 1 e ricava l'altra incognita.
5. Scrivi la soluzione come coppia ed eventualmente fai la verifica.

Conviene ricavare un'incognita che ha coefficiente $1$ o $-1$, così non compaiono frazioni.

```ad-example
Esempio 1: il sistema dei quaderni
$$
\begin{cases}
x + y = 5 \\
2x + 3y = 12
\end{cases}
$$

Nella prima equazione $y$ ha coefficiente $1$: ricavala, $y = 5 - x$. Sostituisci $5 - x$ al posto di $y$ nella seconda, tra parentesi:

$$
\begin{gathered}
2x + 3(5 - x) = 12 \\
\Rightarrow 2x + 15 - 3x = 12 \\
\Rightarrow -x = -3 \\
\Rightarrow x = 3
\end{gathered}
$$

Metti $x = 3$ nell'espressione di $y$:

$$y = 5 - 3 = 2$$

La soluzione è $S = \{(3, 2)\}$. Verifica: $3 + 2 = 5$ e $2 \cdot 3 + 3 \cdot 2 = 6 + 6 = 12$.
```

```ad-warning
Sostituire nella stessa equazione
Se nell'esempio 1 metti $y = 5 - x$ nella prima equazione, da cui l'hai ricavata, ottieni $x + 5 - x = 5$, cioè $0x = 0$: un'uguaglianza sempre vera, che non ti dice niente. L'espressione ricavata da un'equazione va sostituita nell'altra.
```

```ad-warning
Fermarsi alla prima incognita
Trovato $x = 3$, il sistema non è ancora risolto: la soluzione è una coppia, e manca $y$. Si ricava dall'espressione del passo 1, che è la più comoda perché ha già $y$ da sola.
```

## Metodo del confronto

1. Ricava la stessa incognita da tutte e due le equazioni.
2. Uguaglia le due espressioni: se $y$ è uguale a tutte e due, le due espressioni sono uguali tra loro.
3. Risolvi l'equazione in una sola incognita che ottieni.
4. Metti il valore trovato in una delle due espressioni e ricava l'altra incognita.

Il confronto conviene quando le due equazioni hanno già un'incognita da sola, come nelle funzioni lineari $y = mx + q$.

```ad-example
Esempio 2: soluzione con le frazioni
$$
\begin{cases}
y = 2x - 1 \\
y = 4 - x
\end{cases}
$$

Tutte e due le equazioni danno $y$. Uguaglia le due espressioni:

$$
\begin{gathered}
2x - 1 = 4 - x \\
\Rightarrow 2x + x = 4 + 1 \\
\Rightarrow 3x = 5 \\
\Rightarrow x = \frac{5}{3}
\end{gathered}
$$

Metti $x = \dfrac{5}{3}$ nella seconda equazione, che ha meno conti:

$$y = 4 - \frac{5}{3} = \frac{12 - 5}{3} = \frac{7}{3}$$

La soluzione è $S = \left\{\left(\dfrac{5}{3}, \dfrac{7}{3}\right)\right\}$. Con la prima equazione si trova lo stesso valore: $2 \cdot \dfrac{5}{3} - 1 = \dfrac{10 - 3}{3} = \dfrac{7}{3}$. Le frazioni sono soluzioni come le altre, e non vanno scritte come numeri decimali approssimati.
```

## Metodo di riduzione

Il metodo di riduzione, detto anche di addizione e sottrazione, si basa su una proprietà: se sommi membro a membro le due equazioni del sistema (il primo membro con il primo, il secondo con il secondo) e sostituisci con la somma una delle due, ottieni un sistema equivalente, cioè con le stesse soluzioni. Lo stesso vale se le sottrai. L'idea è sommarle o sottrarle in modo che una delle incognite sparisca.

1. Metti il sistema in forma normale.
2. Se serve, moltiplica una o tutte e due le equazioni per un numero diverso da zero, in modo che una incognita abbia coefficienti opposti (oppure uguali) nelle due equazioni.
3. Somma le due equazioni se i coefficienti sono opposti, sottraile se sono uguali: quell'incognita sparisce.
4. Risolvi l'equazione in una sola incognita.
5. Trova l'altra incognita, sostituendo in una delle equazioni di partenza oppure ripetendo la riduzione sull'altra incognita.

```ad-example
Esempio 3: coefficienti già opposti
$$
\begin{cases}
3x + 2y = 7 \\
5x - 2y = 1
\end{cases}
$$

I coefficienti di $y$ sono $+2$ e $-2$, opposti. Somma le due equazioni membro a membro:

$$
\begin{gathered}
(3x + 5x) + (2y - 2y) = 7 + 1 \\
\Rightarrow 8x = 8 \\
\Rightarrow x = 1
\end{gathered}
$$

Metti $x = 1$ nella prima equazione:

$$
\begin{gathered}
3 + 2y = 7 \\
\Rightarrow 2y = 4 \\
\Rightarrow y = 2
\end{gathered}
$$

La soluzione è $S = \{(1, 2)\}$. Verifica nella seconda: $5 \cdot 1 - 2 \cdot 2 = 1$.
```

```ad-example
Esempio 4: moltiplicare tutte e due le equazioni
$$
\begin{cases}
3x + 4y = 2 \\
2x - 5y = 9
\end{cases}
$$

Nessun coefficiente è $1$ e nessuna coppia di coefficienti è opposta. Per eliminare $x$, porta i suoi coefficienti al loro minimo comune multiplo, $6$: moltiplica la prima equazione per $2$ e la seconda per $3$, tutti i termini, compresi i termini noti.

$$
\begin{cases}
6x + 8y = 4 \\
6x - 15y = 27
\end{cases}
$$

I coefficienti di $x$ sono uguali: sottrai la seconda equazione dalla prima. Il meno cambia il segno di tutti i termini della seconda:

$$
\begin{gathered}
8y - (-15y) = 4 - 27 \\
\Rightarrow 23y = -23 \\
\Rightarrow y = -1
\end{gathered}
$$

Metti $y = -1$ nella prima equazione di partenza:

$$
\begin{gathered}
3x + 4 \cdot (-1) = 2 \\
\Rightarrow 3x = 6 \\
\Rightarrow x = 2
\end{gathered}
$$

La soluzione è $S = \{(2, -1)\}$. Verifica nella seconda: $2 \cdot 2 - 5 \cdot (-1) = 4 + 5 = 9$.
```

```ad-warning
Il segno nella sottrazione
Nell'esempio 4, sottraendo $6x - 15y = 27$ da $6x + 8y = 4$, il termine in $y$ diventa $8y + 15y = 23y$, non $8y - 15y = -7y$. Chi sbaglia il segno trova $y = \dfrac{23}{7}$ e una soluzione che non verifica il sistema. Se hai paura di sbagliare, moltiplica una delle due equazioni per un numero negativo, in modo da avere coefficienti opposti, e poi somma.
```

```ad-warning
Moltiplicare solo il primo membro
Quando moltiplichi un'equazione per un numero, lo moltiplichi per tutti i termini, anche quello a secondo membro. Da $3x + 4y = 2$, moltiplicata per $2$, si ottiene $6x + 8y = 4$, non $6x + 8y = 2$.
```

## Quale metodo scegliere

I tre metodi danno sempre la stessa soluzione: cambia solo la quantità di conti. Qualche indicazione:

- la sostituzione conviene quando un'incognita ha coefficiente $1$ o $-1$, come nell'esempio 1;
- il confronto conviene quando le due equazioni sono già scritte nella forma $y = \dots$ (o $x = \dots$), come nell'esempio 2;
- la riduzione conviene quando un'incognita ha coefficienti uguali od opposti, come nell'esempio 3, e quando nessun coefficiente è $1$, come nell'esempio 4, perché evita le frazioni.

C'è un quarto metodo, che usa i determinanti e dà la soluzione con una formula: è la regola di Cramer, nella lezione [Determinanti e regola di Cramer](/materiale/scuola-superiore/matematica/sistemi-lineari/determinanti-e-regola-di-cramer).

## Sistemi con le frazioni

Se nelle equazioni ci sono denominatori numerici, porta prima ogni equazione in forma normale, ciascuna con il suo MCM, come nelle [equazioni di primo grado intere](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere). Poi scegli il metodo.

```ad-example
Esempio 5: denominatori nelle due equazioni
$$
\begin{cases}
\dfrac{x}{2} + \dfrac{y}{3} = 2 \\[2ex]
\dfrac{x + 1}{3} - \dfrac{y - 1}{4} = \dfrac{1}{2}
\end{cases}
$$

Nella prima il MCM è $6$: moltiplicando ogni termine per $6$ ottieni $3x + 2y = 12$.

Nella seconda il MCM è $12$. Tieni i numeratori tra parentesi:

$$
\begin{gathered}
4(x + 1) - 3(y - 1) = 6 \\
\Rightarrow 4x + 4 - 3y + 3 = 6 \\
\Rightarrow 4x - 3y = -1
\end{gathered}
$$

Il sistema in forma normale è

$$
\begin{cases}
3x + 2y = 12 \\
4x - 3y = -1
\end{cases}
$$

Nessun coefficiente è $1$: usa la riduzione. Per eliminare $y$ moltiplica la prima per $3$ e la seconda per $2$, così i coefficienti di $y$ diventano $+6$ e $-6$:

$$
\begin{gathered}
9x + 6y = 36 \\
8x - 6y = -2
\end{gathered}
$$

Sommando: $17x = 34$, quindi $x = 2$. Dalla prima equazione in forma normale, $6 + 2y = 12$, cioè $y = 3$.

La soluzione è $S = \{(2, 3)\}$. Verifica nella seconda equazione di partenza: $\dfrac{2 + 1}{3} - \dfrac{3 - 1}{4} = 1 - \dfrac{1}{2} = \dfrac{1}{2}$.
```

```ad-warning
Il meno davanti a una frazione
Nell'esempio 5 il meno davanti a $\dfrac{y - 1}{4}$ riguarda tutto il numeratore: moltiplicando per $12$ si ottiene $-3(y - 1) = -3y + 3$, non $-3y - 3$.
```

## Sistemi determinati, impossibili e indeterminati

Non tutti i sistemi hanno una soluzione sola. Risolvendo, può capitare che tutte e due le incognite spariscano e resti un'uguaglianza tra numeri, come nelle equazioni che diventano $0x = b$. Un sistema è:

- **determinato** se ha una sola soluzione;
- **impossibile** se non ha soluzioni, e allora $S = \emptyset$;
- **indeterminato** se ha infinite soluzioni.

```ad-example
Esempio 6: un sistema impossibile
$$
\begin{cases}
2x + 3y = 6 \\
4x + 6y = 5
\end{cases}
$$

Moltiplica la prima equazione per $2$: diventa $4x + 6y = 12$. Sottraendo la seconda,

$$
\begin{gathered}
(4x - 4x) + (6y - 6y) = 12 - 5 \\
\Rightarrow 0 = 7
\end{gathered}
$$

L'uguaglianza è falsa, qualunque siano $x$ e $y$. Il motivo si vede anche senza conti: la seconda equazione chiede che $4x + 6y$ valga $5$, la prima, moltiplicata per $2$, che valga $12$. Nessuna coppia può fare le due cose insieme. Il sistema è impossibile: $S = \emptyset$.
```

```ad-example
Esempio 7: un sistema indeterminato
$$
\begin{cases}
x - 2y = 3 \\
-2x + 4y = -6
\end{cases}
$$

Moltiplica la prima equazione per $2$: $2x - 4y = 6$. Sommando la seconda,

$$
\begin{gathered}
(2x - 2x) + (-4y + 4y) = 6 - 6 \\
\Rightarrow 0 = 0
\end{gathered}
$$

L'uguaglianza è vera per ogni coppia. La seconda equazione è la prima moltiplicata per $-2$: in realtà c'è una sola condizione, e le soluzioni del sistema sono tutte le soluzioni di $x - 2y = 3$. Sono infinite: per ogni valore di $y$ si trova $x = 2y + 3$, e si ottengono per esempio $(3, 0)$, $(5, 1)$ e $(1, -1)$. Si scrive

$$S = \{(x, y) \mid x - 2y = 3\}$$

oppure, con il valore di $y$ chiamato $t$, $S = \{(2t + 3, t) \mid t \in \mathbb{R}\}$.
```

```ad-warning
Indeterminato non vuol dire "tutte le coppie"
Nell'esempio 7 la coppia $(0, 0)$ non è una soluzione: $0 - 0 = 0$, non $3$. Le soluzioni sono infinite, ma sono solo le coppie che risolvono $x - 2y = 3$. Scrivere $S = \mathbb{R}$, come per un'equazione indeterminata in una incognita, è sbagliato due volte: le soluzioni sono coppie, e non sono tutte.
```

### Riconoscere il tipo dai coefficienti

Il tipo di sistema si può riconoscere prima di risolverlo, confrontando i coefficienti della forma normale. Con $a'$, $b'$ e $c'$ diversi da zero:

| Rapporti | Sistema |
|---|---|
| $\dfrac{a}{a'} \neq \dfrac{b}{b'}$ | determinato |
| $\dfrac{a}{a'} = \dfrac{b}{b'} \neq \dfrac{c}{c'}$ | impossibile |
| $\dfrac{a}{a'} = \dfrac{b}{b'} = \dfrac{c}{c'}$ | indeterminato |

Quando i primi due rapporti sono uguali, i primi membri sono uno multiplo dell'altro: se lo sono anche i termini noti, le due equazioni dicono la stessa cosa (indeterminato), altrimenti chiedono due cose incompatibili (impossibile).

```ad-example
Esempio 8: tre sistemi riconosciuti dai rapporti
Nel sistema dei quaderni, $x + y = 5$ e $2x + 3y = 12$:

$$\frac{a}{a'} = \frac{1}{2} \qquad \frac{b}{b'} = \frac{1}{3}$$

I due rapporti sono diversi: il sistema è determinato.

Nell'esempio 6, $2x + 3y = 6$ e $4x + 6y = 5$:

$$
\begin{gathered}
\frac{2}{4} = \frac{1}{2} \qquad \frac{3}{6} = \frac{1}{2} \\
\frac{c}{c'} = \frac{6}{5}
\end{gathered}
$$

I primi due sono uguali e il terzo è diverso: impossibile.

Nell'esempio 7, $x - 2y = 3$ e $-2x + 4y = -6$:

$$
\frac{1}{-2} = \frac{-2}{4} = \frac{3}{-6} = -\frac{1}{2}
$$

Tutti e tre uguali: indeterminato.
```

```ad-warning
Rapporti su un sistema non in forma normale
I rapporti si leggono solo sulla forma normale, con le incognite a primo membro nello stesso ordine e i termini noti a secondo membro. Nel sistema formato da $y = 2x - 1$ e $y = 4 - x$ i coefficienti non si leggono così come sono scritti: prima si porta tutto nella forma $-2x + y = -1$ e $x + y = 4$.
```

```ad-note
Quando un coefficiente è zero
Se uno tra $a'$, $b'$ e $c'$ è zero il rapporto non si può scrivere. Si confrontano allora i prodotti in croce: il sistema è determinato se $ab' \neq a'b$. Per esempio in $2x + 3y = 7$ e $5y = 10$ si ha $a' = 0$, e $2 \cdot 5 \neq 0 \cdot 3$: determinato. Se invece $ab' = a'b$, il sistema è impossibile o indeterminato, e per sapere quale conviene risolverlo. Il numero $ab' - a'b$ è il determinante del sistema, che trovi nella lezione [Determinanti e regola di Cramer](/materiale/scuola-superiore/matematica/sistemi-lineari/determinanti-e-regola-di-cramer).
```

## Interpretazione grafica

Ogni equazione del sistema è una retta nel piano cartesiano, e una soluzione del sistema è un punto che sta su tutte e due le rette. Per disegnare una retta $ax + by = c$ con $b \neq 0$ ricavi $y$ e ottieni una funzione lineare $y = mx + q$, come nella lezione [Proporzionalità diretta e inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa); se $b = 0$, l'equazione diventa $x = \dfrac{c}{a}$, che è una retta verticale. Per tracciare una retta ti servono due suoi punti: due soluzioni qualsiasi dell'equazione.

Due rette nel piano possono stare in tre modi, e ognuno corrisponde a un tipo di sistema.

Le rette del sistema dei quaderni, $x + y = 5$ e $2x + 3y = 12$, si incontrano in un solo punto, $(3, 2)$: le rette sono incidenti e il sistema è determinato. Le coordinate del punto di incontro sono la soluzione.

```tikz
% nome: sistema-determinato-rette-incidenti
% alt: Le rette x + y = 5 e 2x + 3y = 12 si incontrano nel punto (3, 2), che è la soluzione del sistema determinato
% svg: sistema-determinato-rette-incidenti-c6777e03.svg 187x162
\begin{tikzpicture}[scale=0.5]
\draw[->] (-0.6,0) -- (7,0) node[right] {$x$};
\draw[->] (0,-0.6) -- (0,6.4) node[above] {$y$};
\foreach \x in {1,2,3,4,5,6} \draw (\x,0.12) -- (\x,-0.12) node[below] {$\x$};
\foreach \y in {1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y) node[left] {$\y$};
\draw[thick, blue!60] (-0.4,5.4) -- (5.6,-0.6);
\draw[thick, red!50] (-0.6,4.4) -- (6.6,-0.4);
\draw[dashed, gray] (3,0) -- (3,2) -- (0,2);
\fill (3,2) circle (0.14);
\node[above right] at (3,2) {$(3, 2)$};
\node[blue!70!black, right] at (0.3,5.1) {$x + y = 5$};
\node[red!60!black, right] at (4.3,1.6) {$2x + 3y = 12$};
\end{tikzpicture}
```

Le rette dell'esempio 6, $2x + 3y = 6$ e $4x + 6y = 5$, diventano $y = -\dfrac{2}{3}x + 2$ e $y = -\dfrac{2}{3}x + \dfrac{5}{6}$: hanno la stessa pendenza e $q$ diversi, quindi sono parallele e distinte. Non hanno punti in comune, e il sistema è impossibile.

```tikz
% nome: sistema-impossibile-rette-parallele
% alt: Le rette 2x + 3y = 6 e 4x + 6y = 5 sono parallele e distinte: non si incontrano, e il sistema è impossibile
% svg: sistema-impossibile-rette-parallele-bb1a5b12.svg 225x116
\begin{tikzpicture}[scale=0.6]
\draw[->] (-1.2,0) -- (4.6,0) node[right] {$x$};
\draw[->] (0,-1) -- (0,3.2) node[above] {$y$};
\foreach \x in {1,2,3} \draw (\x,0.1) -- (\x,-0.1) node[below] {$\x$};
\foreach \y in {1,2} \draw (0.1,\y) -- (-0.1,\y) node[left] {$\y$};
\draw[thick, blue!60] (-1,2.667) -- (4.2,-0.8);
\draw[thick, red!50] (-1,1.5) -- (2.6,-0.9);
\node[blue!70!black, right] at (1.6,1.7) {$2x + 3y = 6$};
\node[red!60!black, left] at (-1,1.5) {$4x + 6y = 5$};
\end{tikzpicture}
```

Le due equazioni dell'esempio 7 diventano tutte e due $y = \dfrac{1}{2}x - \dfrac{3}{2}$: sono la stessa retta, e le rette si dicono coincidenti. Tutti i punti della retta sono in comune, e il sistema è indeterminato.

```tikz
% nome: sistema-indeterminato-rette-coincidenti
% alt: Le equazioni x - 2y = 3 e -2x + 4y = -6 rappresentano la stessa retta: le rette coincidono, e il sistema è indeterminato
% svg: sistema-indeterminato-rette-coincidenti-2acca0cc.svg 184x116
\begin{tikzpicture}[scale=0.6]
\draw[->] (-1.2,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-2.4) -- (0,1.8) node[above] {$y$};
\foreach \x in {1,3,5} \draw (\x,0.1) -- (\x,-0.1) node[below] {$\x$};
\foreach \x in {2,4} \draw (\x,0.1) -- (\x,-0.1);
\foreach \y in {-2,-1,1} \draw (0.1,\y) -- (-0.1,\y) node[left] {$\y$};
\draw[line width=3pt, blue!35] (-0.8,-1.9) -- (5.2,1.1);
\draw[thick, dashed, red!60] (-0.8,-1.9) -- (5.2,1.1);
\fill (3,0) circle (0.1);
\fill (5,1) circle (0.1);
\fill (1,-1) circle (0.1);
\node[above left] at (4.5,1) {$x - 2y = 3$};
\node[below right] at (2.4,-0.6) {$-2x + 4y = -6$};
\end{tikzpicture}
```

| Sistema | Soluzioni | Rette |
|---|---|---|
| determinato | una coppia | incidenti |
| impossibile | nessuna | parallele distinte |
| indeterminato | infinite coppie | coincidenti |

Il grafico aiuta a capire e a controllare, ma non sostituisce il conto: se il punto d'incontro ha coordinate come $\left(\dfrac{5}{3}, \dfrac{7}{3}\right)$, dal disegno non si leggono con precisione. Come si usa il sistema per trovare il punto d'incontro di due rette, e per i problemi con i triangoli, è nella lezione [Intersezione tra due rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/intersezione-tra-due-rette).

## Sistemi fratti

Un sistema è **fratto** quando almeno una incognita compare in un denominatore. Come nelle [equazioni fratte](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-fratte), prima di tutto si scrivono le condizioni di esistenza (C.E.), che ora possono riguardare tutte e due le incognite. Poi si tolgono i denominatori, si risolve il sistema intero che si ottiene e si confronta la soluzione con le C.E.: se non le rispetta, non è accettabile.

```ad-example
Esempio 9: una soluzione accettabile
$$
\begin{cases}
\dfrac{2}{x - 1} = \dfrac{3}{y + 1} \\[2ex]
x + y = 5
\end{cases}
$$

C.E.: $x \neq 1$, $y \neq -1$. Nella prima equazione c'è una frazione per membro: moltiplica per $(x - 1)(y + 1)$, che per le C.E. è diverso da zero.

$$
\begin{gathered}
2(y + 1) = 3(x - 1) \\
\Rightarrow 2y + 2 = 3x - 3 \\
\Rightarrow 3x - 2y = 5
\end{gathered}
$$

Il sistema intero è formato da $3x - 2y = 5$ e $x + y = 5$. Ricava $y = 5 - x$ dalla seconda e sostituisci:

$$
\begin{gathered}
3x - 2(5 - x) = 5 \\
\Rightarrow 5x = 15 \\
\Rightarrow x = 3
\end{gathered}
$$

e quindi $y = 5 - 3 = 2$. La coppia $(3, 2)$ rispetta le C.E., perché $3 \neq 1$ e $2 \neq -1$: è accettabile. Verifica: $\dfrac{2}{2} = 1$ e $\dfrac{3}{3} = 1$. La soluzione è $S = \{(3, 2)\}$.
```

```ad-example
Esempio 10: una soluzione non accettabile
$$
\begin{cases}
\dfrac{x}{y - 1} = 2 \\[2ex]
x + 2y = 2
\end{cases}
$$

C.E.: $y \neq 1$. Moltiplica la prima equazione per $y - 1$:

$$x = 2(y - 1) \quad\Rightarrow\quad x = 2y - 2$$

Sostituisci nella seconda:

$$
\begin{gathered}
2y - 2 + 2y = 2 \\
\Rightarrow 4y = 4 \\
\Rightarrow y = 1
\end{gathered}
$$

e quindi $x = 2 \cdot 1 - 2 = 0$. Il sistema intero ha la soluzione $(0, 1)$, ma $y = 1$ è escluso dalle C.E.: nella prima equazione il denominatore diventerebbe $0$. La soluzione non è accettabile, e il sistema fratto è impossibile: $S = \emptyset$.
```

```ad-warning
Dimenticare le C.E.
Chi nell'esempio 10 non scrive le C.E. dà come risposta $S = \{(0, 1)\}$, che è sbagliata: con $y = 1$ la prima equazione diventa $\dfrac{0}{0} = 2$, che non ha significato. Le C.E. si scrivono all'inizio, sulle equazioni di partenza, e alla fine si controlla la soluzione.
```
