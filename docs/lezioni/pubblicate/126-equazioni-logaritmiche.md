# Equazioni logaritmiche

L'equazione $\log_2 (x + 1) = 3$ si risolve con la definizione di logaritmo: l'argomento deve essere $2^3 = 8$, quindi $x = 7$. Le equazioni logaritmiche di questa lezione si risolvono riportandole a un passaggio come questo, in cui il logaritmo sparisce e resta un'equazione di primo o di secondo grado. La parte delicata è un'altra: un logaritmo esiste solo se il suo argomento è positivo, e i passaggi possono far comparire numeri che l'equazione di partenza non accetta.

Ti servono le [proprietà dei logaritmi](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta), la [funzione logaritmica](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-logaritmica) e le [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado).

## Che cos'è un'equazione logaritmica

Un'**equazione logaritmica** è un'equazione in cui l'incognita compare nell'argomento di almeno un logaritmo. Sono logaritmiche $\log_2 (x + 1) = 3$ e $\log x + \log (x + 3) = 1$. Non lo è $x \cdot \log 2 = 3$: qui $\log 2$ è un numero, e l'equazione è di primo grado.

### Le condizioni di esistenza

Prima di risolvere si scrivono le **condizioni di esistenza** (C.E.): l'argomento di ogni logaritmo che compare nell'equazione deve essere positivo. Se i logaritmi sono più di uno, le condizioni vanno rispettate tutte insieme, e formano un [sistema di disequazioni](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/sistemi-di-disequazioni). Per $\log x + \log (x + 3) = 1$:

$$
\begin{cases}
x > 0 \\
x + 3 > 0
\end{cases}
\ \Rightarrow \ x > 0
$$

Un numero trovato alla fine dei conti è una soluzione solo se rispetta le C.E. In alternativa puoi sostituirlo nell'equazione di partenza e controllare che ogni argomento sia positivo: è lo stesso controllo, fatto su un numero alla volta, ed è comodo quando le condizioni sono lunghe da risolvere.

## Un solo logaritmo uguale a un numero

L'equazione più semplice ha la forma $\log_a f(x) = c$. Si risolve con la definizione di logaritmo:

$$\log_a f(x) = c \iff f(x) = a^c$$

Qui la condizione $f(x) > 0$ è rispettata da sola, perché $a^c$ è un numero positivo: ogni soluzione di $f(x) = a^c$ va bene.

Sul grafico, risolvere $\log_2 x = c$ vuol dire cercare il punto in cui la curva $y = \log_2 x$ incontra la retta orizzontale $y = c$. La funzione logaritmica assume ogni valore una volta sola, quindi il punto c'è sempre ed è uno: per $c = 2$ ha ascissa $2^2 = 4$, per $c = -1$ ha ascissa $2^{-1} = \dfrac{1}{2}$.

```tikz
% nome: equazione-logaritmica-retta-orizzontale
% alt: Il grafico di y = logaritmo in base 2 di x con le rette orizzontali y = 2 e y = -1: la prima incontra la curva nel punto di ascissa 4, la seconda nel punto di ascissa un mezzo
% svg: equazione-logaritmica-retta-orizzontale-9167cd00.svg 228x198
\begin{tikzpicture}[scale=0.68]
\draw[gray!25, very thin] (-0.5,-2.5) grid (6.5,3.5);
\draw[->] (-0.8,0) -- (7.1,0) node[right] {$x$};
\draw[->] (0,-2.8) -- (0,4.1) node[above] {$y$};
\foreach \x in {1,2,4,6} \node[below] at (\x,-0.05) {\small $\x$};
\node[above left] at (0,2) {\small $2$};
\node[below left] at (0,-1) {\small $-1$};
\draw[thick, blue!60, domain=0.18:6.5, samples=120, smooth] plot (\x, {ln(\x)/ln(2)});
\draw[orange!80, thick] (-0.5,2) -- (6.5,2);
\draw[orange!80, thick] (-0.5,-1) -- (6.5,-1);
\draw[dashed, gray] (4,2) -- (4,0);
\draw[dashed, gray] (0.5,-1) -- (0.5,0);
\fill (4,2) circle (0.09);
\fill (0.5,-1) circle (0.09);
\node[above] at (0.5,0) {\small $\frac{1}{2}$};
\node[blue!60!black, below right] at (4.6,2.0) {$y = \log_2 x$};
\end{tikzpicture}
```
```grafico
% nome: equazione-logaritmica-cursori
% alt: Il grafico di y = logaritmo in base a di x e la retta orizzontale y = c, con i cursori di a e di c: il punto P in cui si incontrano ha per ascissa a alla c, la soluzione dell'equazione; le coordinate di P sono scritte sotto il piano
curva: y=\log_a\left(x\right)
curva: y=c | arancione
curva: P=\left(a^c;\log_a\left(a^c\right)\right) | nero | nome
cursore: a = 2 da 0,2 a 4 passo 0,1
cursore: c = 2 da -3 a 3 passo 0,1
finestra: x da -2 a 10, y da -6 a 6
valore: P = \left(a^c;\log_a\left(a^c\right)\right)
domanda: Porta $c$ sotto zero: la soluzione diventa negativa? Esiste un valore di $c$ per cui l'equazione è impossibile?
```

La soluzione $x = a^c$ è positiva per ogni $c$: con $c$ sotto zero il punto di incontro scende sotto l'asse $x$, ma resta a destra dell'asse $y$. E l'equazione non è mai impossibile, perché la curva incontra ogni retta orizzontale. Solo per $a = 1$ non c'è niente da risolvere: la base $1$ non è ammessa, e la curva sparisce insieme al punto $P$.

```ad-example
Esempio 1: argomento di primo grado
Risolvi $\log (3x + 1) = -1$.

Il logaritmo è in base $10$. Per la definizione:

$$
\begin{gathered}
3x + 1 = 10^{-1} \\
\Rightarrow 3x = \frac{1}{10} - 1 = -\frac{9}{10} \\
\Rightarrow x = -\frac{3}{10}
\end{gathered}
$$

Verifica: per $x = -\dfrac{3}{10}$ l'argomento vale $-\dfrac{9}{10} + 1 = \dfrac{1}{10}$, positivo, e $\log \dfrac{1}{10} = -1$. Quindi $S = \left\{-\dfrac{3}{10}\right\}$.
```

```ad-warning
A dover essere positivo è l'argomento, non la x
Nell'esempio 1 la soluzione è un numero negativo, e va benissimo: per $x = -\dfrac{3}{10}$ l'argomento $3x + 1$ è positivo. Scartare una soluzione "perché è negativa" senza guardare l'argomento è uno degli errori più comuni. La regola $x > 0$ vale solo quando l'argomento è proprio $x$.
```

```ad-example
Esempio 2: argomento di secondo grado
Risolvi $\log_3 \left(x^2 - 2x\right) = 1$.

Per la definizione, $x^2 - 2x = 3^1$:

$$x^2 - 2x - 3 = 0$$

Il discriminante è $\Delta = 4 + 12 = 16$ e le soluzioni sono $x_1 = -1$ e $x_2 = 3$. Per tutte e due l'argomento vale $3$: $(-1)^2 - 2 \cdot (-1) = 3$ e $3^2 - 2 \cdot 3 = 3$. Quindi $S = \{-1, 3\}$.
```

## Due logaritmi con la stessa base

La funzione logaritmica è iniettiva: due logaritmi con la stessa base sono uguali solo se hanno lo stesso argomento. Per questo

$$\log_a f(x) = \log_a g(x) \iff f(x) = g(x), \ \text{ con } f(x) > 0 \text{ e } g(x) > 0$$

Questa volta le C.E. non sono rispettate da sole: l'equazione $f(x) = g(x)$ può avere soluzioni per cui i due argomenti sono uguali ma negativi.

```ad-example
Esempio 3: una soluzione da scartare
Risolvi $\log_2 \left(x^2 - 5\right) = \log_2 (4x)$.

C.E.: $x^2 - 5 > 0$ e $4x > 0$. Uguaglia gli argomenti:

$$
\begin{gathered}
x^2 - 5 = 4x \\
\Rightarrow x^2 - 4x - 5 = 0
\end{gathered}
$$

Si ha $\Delta = 16 + 20 = 36$ e le soluzioni sono $x_1 = -1$ e $x_2 = 5$. Controlla le condizioni sostituendo. Per $x = 5$ gli argomenti valgono $25 - 5 = 20$ e $4 \cdot 5 = 20$: positivi, la soluzione è accettabile. Per $x = -1$ valgono $1 - 5 = -4$ e $4 \cdot (-1) = -4$: sono uguali, ma negativi, e $\log_2 (-4)$ non esiste. Quindi $S = \{5\}$.
```

```ad-example
Esempio 4: condizioni che non possono valere insieme
Risolvi $\log_3 (x - 4) = \log_3 (1 - 2x)$.

C.E.:

$$
\begin{cases}
x - 4 > 0 \\
1 - 2x > 0
\end{cases}
\ \Rightarrow \
\begin{cases}
x > 4 \\
x < \dfrac{1}{2}
\end{cases}
$$

Nessun numero è insieme maggiore di $4$ e minore di $\dfrac{1}{2}$: i due logaritmi non esistono mai contemporaneamente, e l'equazione è impossibile senza altri conti, $S = \emptyset$. Se uguagli gli argomenti trovi $x = \dfrac{5}{3}$, che infatti non rispetta nessuna delle due condizioni.
```

## Equazioni in cui servono le proprietà

Quando i logaritmi sono più di due, o c'è anche un numero, si usano le proprietà per arrivare a una delle due forme precedenti.

1. Scrivi le C.E. sull'equazione di partenza: ogni argomento positivo.
2. Con le proprietà dei logaritmi riduci ogni membro a un solo logaritmo, o a un numero. Tutti i logaritmi devono avere la stessa base.
3. Passa agli argomenti: $f(x) = a^c$ se resta $\log_a f(x) = c$, oppure $f(x) = g(x)$ se resta $\log_a f(x) = \log_a g(x)$.
4. Risolvi l'equazione ottenuta.
5. Confronta le soluzioni con le C.E. e scarta quelle che non le rispettano.

```ad-example
Esempio 5: somma di logaritmi
Risolvi $\log_2 x + \log_2 (x - 2) = 3$.

C.E.: $x > 0$ e $x - 2 > 0$, cioè $x > 2$. La somma di due logaritmi è il logaritmo del prodotto:

$$
\begin{gathered}
\log_2 \left[x(x - 2)\right] = 3 \\
\Rightarrow x(x - 2) = 2^3 \\
\Rightarrow x^2 - 2x - 8 = 0
\end{gathered}
$$

Si ha $\Delta = 4 + 32 = 36$ e le soluzioni sono $x_1 = -2$ e $x_2 = 4$. La prima non rispetta la condizione $x > 2$ e si scarta: $S = \{4\}$. Verifica: $\log_2 4 + \log_2 2 = 2 + 1 = 3$.
```

Il $-2$ dell'esempio viene dal passaggio in cui i due logaritmi diventano uno. L'espressione $\log_2 x + \log_2 (x - 2)$ esiste solo per $x > 2$, mentre $\log_2 \left[x(x - 2)\right]$ esiste anche per $x < 0$, dove il prodotto di due fattori negativi è positivo. Le due espressioni coincidono per $x > 2$, ma la seconda ha un ramo in più, e la retta $y = 3$ lo incontra proprio in $x = -2$.

```tikz
% nome: equazione-logaritmica-soluzione-estranea
% alt: A destra di x = 2 il grafico di y = logaritmo in base 2 di x più logaritmo in base 2 di (x - 2), che incontra la retta y = 3 nel punto di ascissa 4; a sinistra dell'asse y, tratteggiato, il ramo in più di y = logaritmo in base 2 di x(x - 2), che incontra la stessa retta nel punto di ascissa -2, la soluzione da scartare
% svg: equazione-logaritmica-soluzione-estranea-bf683fd3.svg 297x223
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-4.5,-3.5) grid (6.5,4.5);
\draw[->] (-4.8,0) -- (7.1,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,5.1) node[above] {$y$};
\foreach \x in {-2,2,4} \node[below] at (\x,-0.05) {\small $\x$};
\node[above right] at (0,3) {\small $3$};
\draw[gray, thick] (-4.5,3) -- (6.5,3);
\draw[thick, dashed, orange!80, domain=-3.9:-0.045, samples=120, smooth] plot (\x, {ln(\x*(\x-2))/ln(2)});
\draw[thick, blue!60, domain=2.045:5.85, samples=120, smooth] plot (\x, {ln(\x*(\x-2))/ln(2)});
\draw[gray, densely dotted] (2,-3.5) -- (2,4.5);
\fill (4,3) circle (0.11);
\draw[thick] (-2,3) circle (0.11);
\draw[dashed, gray] (4,3) -- (4,0);
\draw[dashed, gray] (-2,3) -- (-2,0);
\node[blue!60!black, right] at (3.1,-2.0) {\small $\log_2 x + \log_2 (x - 2)$};
\node[orange!60!black] at (-2.6,-2.0) {\small ramo in più};
\end{tikzpicture}
```
```grafico
% nome: equazione-logaritmica-soluzione-estranea-cursore
% alt: Il grafico di y = logaritmo in base 2 di x più logaritmo in base 2 di (x - 2), il ramo in più di y = logaritmo in base 2 di x(x - 2) tratteggiato e la retta y = c con il cursore di c: sotto il piano le due radici dell'equazione senza logaritmi, una sempre negativa e una sempre maggiore di 2
curva: y=\log_2\left(x\left(x-2\right)\right) | tratteggiata | arancione
curva: y=\log_2\left(x\right)+\log_2\left(x-2\right) | blu
curva: y=c | grigio
cursore: c = 3 da -4 a 5 passo 0,5
finestra: x da -6 a 8, y da -7 a 7
valore: x_1 = 1-\sqrt{1+2^c}
valore: x_2 = 1+\sqrt{1+2^c}
domanda: Muovi $c$: c'è un valore per cui la retta non incontra il ramo tratteggiato? E la soluzione $x_2$ può scendere sotto $2$?
```

No, in tutti e due i casi. Per ogni $c$ l'equazione $x(x - 2) = 2^c$ ha le radici $1 - \sqrt{1 + 2^c}$ e $1 + \sqrt{1 + 2^c}$: la prima è sempre negativa e sta sul ramo in più, la seconda è sempre maggiore di $2$. In un'equazione fatta così la radice da scartare c'è per qualunque secondo membro.

```ad-warning
Le C.E. si scrivono prima di usare le proprietà
Se nell'esempio 5 scrivi le condizioni dopo aver unito i logaritmi, trovi $x(x - 2) > 0$, cioè $x < 0$ oppure $x > 2$, e accetti anche $x = -2$. Ma nell'equazione di partenza $\log_2 (-2)$ non esiste. Le proprietà possono allargare l'insieme in cui l'espressione ha senso: le condizioni vanno scritte sull'equazione com'è data, un argomento alla volta.
```

```ad-example
Esempio 6: differenza di logaritmi
Risolvi $\log_3 (x + 5) - \log_3 (x - 1) = 1$.

C.E.: $x + 5 > 0$ e $x - 1 > 0$, cioè $x > 1$. La differenza è il logaritmo del quoziente:

$$
\begin{gathered}
\log_3 \frac{x + 5}{x - 1} = 1 \\
\Rightarrow \frac{x + 5}{x - 1} = 3 \\
\Rightarrow x + 5 = 3(x - 1) \\
\Rightarrow x = 4
\end{gathered}
$$

Il valore $4$ rispetta la condizione $x > 1$: $S = \{4\}$. Verifica: $\log_3 9 - \log_3 3 = 2 - 1 = 1$.
```

```ad-example
Esempio 7: un numero da trasformare in logaritmo
Risolvi $\log_2 (x + 1) = 2 + \log_2 (x - 2)$.

C.E.: $x + 1 > 0$ e $x - 2 > 0$, cioè $x > 2$. Un numero si scrive come logaritmo con l'uguaglianza $c = \log_a a^c$: qui $2 = \log_2 2^2 = \log_2 4$. Quindi

$$
\begin{gathered}
\log_2 (x + 1) = \log_2 4 + \log_2 (x - 2) \\
\Rightarrow \log_2 (x + 1) = \log_2 \left[4(x - 2)\right] \\
\Rightarrow x + 1 = 4x - 8 \\
\Rightarrow x = 3
\end{gathered}
$$

Il valore $3$ rispetta la condizione $x > 2$: $S = \{3\}$. Verifica: $\log_2 4 = 2$ e $2 + \log_2 1 = 2$.
```

```ad-example
Esempio 8: un coefficiente davanti al logaritmo
Risolvi $2\log_5 x = \log_5 (x + 6)$.

C.E.: $x > 0$ e $x + 6 > 0$, cioè $x > 0$. Il coefficiente $2$ diventa l'esponente dell'argomento:

$$
\begin{gathered}
\log_5 x^2 = \log_5 (x + 6) \\
\Rightarrow x^2 - x - 6 = 0
\end{gathered}
$$

Si ha $\Delta = 1 + 24 = 25$ e le soluzioni sono $x_1 = -2$ e $x_2 = 3$. La prima non rispetta $x > 0$: $S = \{3\}$. Verifica: $2\log_5 3 = \log_5 9$ e $\log_5 (3 + 6) = \log_5 9$.
```

```ad-warning
Portare giù un esponente pari fa perdere soluzioni
L'equazione $\log_2 x^2 = 4$ ha la condizione $x^2 > 0$, cioè $x \neq 0$, e si risolve con la definizione: $x^2 = 16$, quindi $S = \{-4, 4\}$. Se invece scrivi $2\log_2 x = 4$, il logaritmo esiste solo per $x > 0$ e trovi soltanto $x = 4$: la soluzione $-4$ è andata persa. Un esponente pari si porta davanti solo se sai già che la base della potenza è positiva; altrimenti $\log_a x^2 = 2\log_a |x|$.
```

## Equazioni che si risolvono con una sostituzione

Se lo stesso logaritmo compare più volte, anche al quadrato, si pone $t$ uguale a quel logaritmo e si risolve prima l'equazione in $t$. La scrittura $\log_a^2 x$ indica il quadrato del logaritmo, $\left(\log_a x\right)^2$, che è diverso da $\log_a x^2$.

```ad-example
Esempio 9: un'equazione di secondo grado nel logaritmo
Risolvi $\log^2 x - \log x - 2 = 0$.

C.E.: $x > 0$. Poni $t = \log x$:

$$t^2 - t - 2 = 0$$

Si ha $\Delta = 1 + 8 = 9$ e le soluzioni sono $t_1 = -1$ e $t_2 = 2$. Torna alla $x$ con la definizione di logaritmo:

$$\log x = -1 \ \Rightarrow \ x = 10^{-1} = \frac{1}{10} \qquad \log x = 2 \ \Rightarrow \ x = 10^2 = 100$$

Tutti e due i valori sono positivi: $S = \left\{\dfrac{1}{10}, 100\right\}$.
```

Nell'esempio il valore negativo $t = -1$ è accettabile, perché un logaritmo può valere qualunque numero reale. È il contrario di quello che succede nelle [equazioni esponenziali](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-esponenziali) con la sostituzione $t = a^x$, dove i valori negativi di $t$ si scartano.

### Logaritmi con basi diverse

Se le basi sono diverse, prima si portano tutti i logaritmi alla stessa base con la formula del cambiamento di base.

```ad-example
Esempio 10: basi 2 e 4
Risolvi $\log_2 x + \log_4 x = 3$.

C.E.: $x > 0$. Porta il secondo logaritmo in base $2$:

$$\log_4 x = \frac{\log_2 x}{\log_2 4} = \frac{\log_2 x}{2}$$

L'equazione diventa

$$
\begin{gathered}
\log_2 x + \frac{1}{2}\log_2 x = 3 \\
\Rightarrow \frac{3}{2}\log_2 x = 3 \\
\Rightarrow \log_2 x = 2
\end{gathered}
$$

da cui $x = 4$, che rispetta la condizione: $S = \{4\}$. Verifica: $\log_2 4 + \log_4 4 = 2 + 1 = 3$.
```

## Equazioni esponenziali che si risolvono con i logaritmi

Nelle [equazioni esponenziali](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-esponenziali) i due membri si scrivono come potenze della stessa base e si uguagliano gli esponenti. Con $2^x = 5$ questa strada è chiusa, perché $5$ non è una potenza di $2$ con un esponente che si riconosce a occhio. La soluzione è la definizione stessa di logaritmo:

$$a^{f(x)} = b \iff f(x) = \log_a b \qquad (b > 0)$$

Se $b$ è negativo o nullo l'equazione è impossibile, perché una potenza con la base positiva è sempre positiva: $3^x = -2$ ha $S = \emptyset$.

```ad-example
Esempio 11: l'esponente è un logaritmo
Risolvi $2^x = 5$ e $3^{2x - 1} = 7$.

Per la prima, $x = \log_2 5$. È questa la soluzione esatta, e si lascia scritta così; se serve un valore approssimato, con il cambiamento di base $\log_2 5 = \dfrac{\log 5}{\log 2} \approx 2{,}32$.

Per la seconda, l'esponente deve essere $\log_3 7$:

$$
\begin{gathered}
2x - 1 = \log_3 7 \\
\Rightarrow x = \frac{1 + \log_3 7}{2}
\end{gathered}
$$

Con la calcolatrice $\log_3 7 = \dfrac{\log 7}{\log 3} \approx 1{,}77$, quindi $x \approx 1{,}39$.
```

Quando l'incognita sta all'esponente in tutti e due i membri, con basi diverse, si calcola il logaritmo dei due membri, tutti e due con la stessa base. Il passaggio è lecito perché i due membri sono positivi, e due numeri positivi sono uguali se e solo se hanno lo stesso logaritmo. Poi la proprietà della potenza porta gli esponenti davanti, e l'incognita non è più all'esponente.

```ad-example
Esempio 12: basi diverse nei due membri
Risolvi $2^{x + 1} = 3^x$.

Calcola il logaritmo decimale dei due membri e porta gli esponenti davanti:

$$
\begin{gathered}
\log 2^{x + 1} = \log 3^x \\
\Rightarrow (x + 1)\log 2 = x\log 3
\end{gathered}
$$

È un'equazione di primo grado in $x$, in cui $\log 2$ e $\log 3$ sono numeri. Raccogli la $x$:

$$
\begin{gathered}
x\log 2 + \log 2 = x\log 3 \\
\Rightarrow x(\log 3 - \log 2) = \log 2 \\
\Rightarrow x = \frac{\log 2}{\log 3 - \log 2}
\end{gathered}
$$

Con la calcolatrice $x \approx \dfrac{0{,}301}{0{,}176} \approx 1{,}71$. Con il logaritmo naturale al posto di quello decimale il risultato è lo stesso.
```

```ad-example
Esempio 13: dopo una sostituzione
Risolvi $4^x - 5 \cdot 2^x + 6 = 0$.

Poiché $4^x = \left(2^x\right)^2$, poni $t = 2^x$, con $t > 0$:

$$t^2 - 5t + 6 = 0$$

Si ha $\Delta = 25 - 24 = 1$ e le soluzioni sono $t_1 = 2$ e $t_2 = 3$, tutte e due positive. Da $2^x = 2$ ottieni $x = 1$. Da $2^x = 3$ gli esponenti non si possono uguagliare, e serve il logaritmo: $x = \log_2 3$. Quindi $S = \{1, \log_2 3\}$, con $\log_2 3 \approx 1{,}58$.
```

```ad-example
Esempio 14: il tempo di raddoppio
Un capitale depositato al $3\%$ annuo si moltiplica per $1{,}03$ ogni anno. Dopo quanti anni è raddoppiato?

Dopo $t$ anni il capitale è moltiplicato per $1{,}03^t$. Deve essere

$$1{,}03^t = 2$$

quindi $t = \log_{1{,}03} 2 = \dfrac{\log 2}{\log 1{,}03} \approx 23{,}4$. Il capitale raddoppia nel corso del ventiquattresimo anno, qualunque sia la somma di partenza.
```

```ad-warning
Il logaritmo di una somma non si spezza
Per risolvere $2^x + 3^x = 5$ non puoi calcolare il logaritmo dei due membri e scrivere $x\log 2 + x\log 3 = \log 5$: il logaritmo di una somma non è la somma dei logaritmi. Il passaggio ai logaritmi funziona quando in ogni membro c'è un solo termine, fatto di prodotti e potenze.
```

## Quando i conti non bastano

Un'equazione come $\log_2 x = 3 - x$, in cui l'incognita sta sia dentro un logaritmo sia fuori, non si risolve con i passaggi di questa lezione. Si può però leggere sul grafico: le soluzioni sono le ascisse dei punti in cui la curva $y = \log_2 x$ incontra la retta $y = 3 - x$.

```tikz
% nome: equazione-logaritmica-metodo-grafico
% alt: Il grafico di y = logaritmo in base 2 di x, crescente, e la retta y = 3 - x, decrescente: si incontrano in un solo punto, (2, 1)
% svg: equazione-logaritmica-metodo-grafico-4fd848da.svg 198x198
\begin{tikzpicture}[scale=0.68]
\draw[gray!25, very thin] (-0.5,-2.5) grid (5.5,3.5);
\draw[->] (-0.8,0) -- (6.1,0) node[right] {$x$};
\draw[->] (0,-2.8) -- (0,4.1) node[above] {$y$};
\foreach \x in {1,2,3,4} \node[below] at (\x,-0.05) {\small $\x$};
\node[left] at (0,1) {\small $1$};
\node[left] at (0,3) {\small $3$};
\draw[thick, blue!60, domain=0.18:5.5, samples=120, smooth] plot (\x, {ln(\x)/ln(2)});
\draw[thick, orange!80] (-0.4,3.4) -- (5.4,-2.4);
\draw[dashed, gray] (2,0) -- (2,1) -- (0,1);
\fill (2,1) circle (0.09);
\node[blue!60!black, above] at (4.7,2.25) {$y = \log_2 x$};
\node[orange!60!black, left] at (4.6,-2.05) {$y = 3 - x$};
\end{tikzpicture}
```
```grafico
% nome: equazione-logaritmica-metodo-grafico-cursore
% alt: Il grafico di y = logaritmo in base 2 di x e la retta y = k - x con il cursore di k: per ogni valore di k la retta incontra la curva in un solo punto
curva: y=\log_2\left(x\right)
curva: y=k-x | arancione
cursore: k = 3 da -4 a 8 passo 0,5
finestra: x da -2 a 10, y da -6 a 6
domanda: Muovi $k$: la retta $y = k - x$ può incontrare la curva in due punti, o in nessuno?
```

La curva sale e la retta scende, quindi si incontrano in un punto solo, e questo vale per ogni $k$: l'equazione $\log_2 x = k - x$ ha sempre una e una sola soluzione. Nel disegno il punto è $(2, 1)$, e la verifica lo conferma: $\log_2 2 = 1$ e $3 - 2 = 1$. L'equazione ha la sola soluzione $x = 2$. Quando il punto di incontro non ha coordinate così comode, dal grafico si ricava soltanto un valore approssimato.

Lo stesso confronto tra argomenti, con il segno di disuguaglianza al posto dell'uguale, risolve le [disequazioni logaritmiche](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/disequazioni-logaritmiche).
