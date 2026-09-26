# Divisione tra polinomi

Quando dividi $17$ per $5$ ottieni $3$ con il resto di $2$, e lo puoi scrivere come $17 = 5 \cdot 3 + 2$, con il resto più piccolo del divisore. Con i polinomi in una variabile succede la stessa cosa: dividere $2x^3 - 3x^2 + 4x - 5$ per $x - 2$ vuol dire trovare un quoziente e un resto, e il procedimento, la divisione in colonna, somiglia molto a quello che hai imparato alle elementari con i numeri.

La divisione di un polinomio per un monomio è nella lezione sulle [operazioni tra polinomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-polinomi). Qui il divisore è un polinomio con almeno due termini, e tutti i polinomi hanno una sola lettera, $x$, come $A(x)$ nella lezione su [polinomi e grado](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio).

## Quoziente e resto

Dati due polinomi $A(x)$ e $B(x)$, con $B(x)$ diverso dal polinomio nullo, esistono e sono unici due polinomi $Q(x)$ e $R(x)$ tali che

$$A(x) = B(x) \cdot Q(x) + R(x)$$

dove $R(x)$ è il polinomio nullo oppure ha grado minore del grado di $B(x)$. $A(x)$ è il **dividendo**, $B(x)$ il **divisore**, $Q(x)$ il **quoziente** e $R(x)$ il **resto**.

Per esempio, dividendo $x^2 + 3x + 5$ per $x + 1$ si trovano $Q(x) = x + 2$ e $R(x) = 3$, perché

$$x^2 + 3x + 5 = (x + 1)(x + 2) + 3$$

e $3$ ha grado $0$, minore del grado $1$ del divisore.

```ad-warning
Un resto con grado troppo alto
Anche $x^2 + 3x + 5 = (x + 1) \cdot x + (2x + 5)$ è un'uguaglianza vera, ma $x$ non è il quoziente e $2x + 5$ non è il resto: $2x + 5$ ha grado $1$, uguale al grado del divisore, quindi la divisione non è finita.
```

Il grado del quoziente e il grado del resto si possono prevedere prima di fare la divisione:

- se il grado di $A$ è maggiore o uguale al grado di $B$, il grado del quoziente è la differenza dei gradi: dividendo un polinomio di grado $4$ per uno di grado $2$ ottieni un quoziente di grado $2$;
- il grado del resto è al massimo il grado del divisore meno $1$: se il divisore è di primo grado, come $x - 2$, il resto è un numero;
- se il grado di $A$ è minore del grado di $B$, la divisione si ferma subito: il quoziente è $0$ e il resto è $A$ stesso. Per esempio $x + 1$ diviso $x^2 + 1$ dà quoziente $0$ e resto $x + 1$.

## La divisione in colonna

Il procedimento cerca il quoziente un termine alla volta, partendo da quello di grado più alto.

1. Ordina il dividendo e il divisore secondo le potenze decrescenti di $x$. Se nel dividendo manca qualche potenza di $x$, completalo scrivendo al suo posto un termine con coefficiente $0$.
2. Dividi il primo termine del dividendo per il primo termine del divisore: il risultato è il primo termine del quoziente.
3. Moltiplica questo termine per tutto il divisore, scrivi sotto il dividendo l'opposto del prodotto, con ogni termine sotto il termine simile, e somma in colonna: ottieni un **resto parziale**.
4. Ripeti i passi 2 e 3 usando il resto parziale al posto del dividendo.
5. Fermati quando il resto parziale ha grado minore del divisore: quello è il resto $R(x)$.

Al passo 3 scrivi l'opposto del prodotto e poi sommi, invece di scrivere il prodotto e sottrarlo: il risultato è lo stesso, ma sommare in colonna fa sbagliare meno segni. Nella somma il termine di grado più alto si cancella sempre, perché il passo 2 è fatto apposta: per questo ogni resto parziale ha grado più basso del precedente.

```ad-example
Esempio 1: divisore di primo grado
Dividi $A(x) = 2x^3 - 3x^2 + 4x - 5$ per $B(x) = x - 2$. I due polinomi sono già ordinati e il dividendo è completo.

- $2x^3 : x = 2x^2$, primo termine del quoziente. $2x^2(x - 2) = 2x^3 - 4x^2$: sotto il dividendo scrivi $-2x^3 + 4x^2$ e sommi. Il resto parziale è $x^2 + 4x - 5$.
- $x^2 : x = x$. $x(x - 2) = x^2 - 2x$: scrivi $-x^2 + 2x$ e sommi. Il resto parziale è $6x - 5$.
- $6x : x = 6$. $6(x - 2) = 6x - 12$: scrivi $-6x + 12$ e sommi. Resta $7$, che ha grado $0$, minore di $1$: la divisione è finita.

```tikz
% nome: schema-divisione-in-colonna-polinomi
% alt: Schema della divisione in colonna di 2x alla terza meno 3x al quadrato più 4x meno 5 per x meno 2: a sinistra il dividendo e sotto i resti parziali, a destra il divisore e sotto il quoziente 2x al quadrato più x più 6, in fondo il resto 7
% svg: schema-divisione-in-colonna-polinomi-004191d3.svg 409x195
\begin{tikzpicture}
\node[anchor=base east] at (1.0,0) {$2x^3$};
\node[anchor=base east] at (2.3,0) {$-\,3x^2$};
\node[anchor=base east] at (3.5,0) {$+\,4x$};
\node[anchor=base east] at (4.5,0) {$-\,5$};
\node[anchor=base west] at (4.9,0) {$x - 2$};
\draw (4.8,0.45) -- (4.8,-1.0);
\draw (4.8,-0.2) -- (6.9,-0.2);
\node[anchor=base west] at (4.9,-0.75) {$2x^2 + x + 6$};
\node[anchor=base east] at (1.0,-0.75) {$-\,2x^3$};
\node[anchor=base east] at (2.3,-0.75) {$+\,4x^2$};
\draw (0.1,-0.95) -- (2.35,-0.95);
\node[anchor=base east] at (2.3,-1.5) {$x^2$};
\node[anchor=base east] at (3.5,-1.5) {$+\,4x$};
\node[anchor=base east] at (4.5,-1.5) {$-\,5$};
\node[anchor=base east] at (2.3,-2.25) {$-\,x^2$};
\node[anchor=base east] at (3.5,-2.25) {$+\,2x$};
\draw (1.4,-2.45) -- (3.55,-2.45);
\node[anchor=base east] at (3.5,-3.0) {$6x$};
\node[anchor=base east] at (4.5,-3.0) {$-\,5$};
\node[anchor=base east] at (3.5,-3.75) {$-\,6x$};
\node[anchor=base east] at (4.5,-3.75) {$+\,12$};
\draw (2.6,-3.95) -- (4.55,-3.95);
\node[anchor=base east] at (4.5,-4.5) {$7$};
\node[anchor=base west] at (7.1,0) {divisore};
\node[anchor=base west] at (7.1,-0.75) {quoziente};
\node[anchor=base east] at (-0.2,0) {dividendo};
\node[anchor=base west] at (5.3,-4.5) {resto};
\draw[->] (5.2,-4.4) -- (4.65,-4.4);
\end{tikzpicture}
```

Quindi $Q(x) = 2x^2 + x + 6$ e $R(x) = 7$. Il quoziente ha grado $3 - 1 = 2$, come previsto.
```

```ad-warning
Cambiare segno solo al primo termine
Al passo 3 va cambiato il segno di tutti i termini del prodotto. Da $2x^2(x - 2) = 2x^3 - 4x^2$ si scrive $-2x^3 + 4x^2$, non $-2x^3 - 4x^2$: con il secondo segno sbagliato il resto parziale diventa $-7x^2 + 4x - 5$ e tutto il resto della divisione è sbagliato.
```

```ad-warning
Dividere per tutto il divisore
Al passo 2 si divide il primo termine del dividendo solo per il primo termine del divisore: $2x^3 : x = 2x^2$. Il resto del divisore entra in gioco al passo 3, quando moltiplichi.
```

```ad-example
Esempio 2: un dividendo incompleto
Dividi $x^3 - 7x + 6$ per $x - 2$. Nel dividendo manca il termine in $x^2$: lo scrivi come $+0x^2$, così ogni colonna contiene una sola potenza di $x$.
$$\footnotesize\def\arraystretch{1.5}\begin{array}{rrrr|l} x^3 & +0x^2 & -7x & +6 & \underline{\;x - 2\;} \\ \underline{-x^3} & \underline{+2x^2} & & & x^2 + 2x - 3 \\ & 2x^2 & -7x & +6 & \\ & \underline{-2x^2} & \underline{+4x} & & \\ & & -3x & +6 & \\ & & \underline{+3x} & \underline{-6} & \\ & & & 0 & \end{array}$$
I passi sono $x^3 : x = x^2$, poi $2x^2 : x = 2x$, poi $-3x : x = -3$. Il quoziente è $Q(x) = x^2 + 2x - 3$ e il resto è $0$.
```

```ad-warning
Non lasciare lo spazio per le potenze mancanti
Se in $x^3 - 7x + 6$ non scrivi $+0x^2$, il $+2x^2$ del primo prodotto finisce sotto il $-7x$, e sommi termini che non sono simili.
```

```ad-example
Esempio 3: divisore di secondo grado
Dividi $x^4 + 2x^3 - x + 3$ per $x^2 - x + 1$. Il dividendo si completa con $+0x^2$; ora a ogni passo il prodotto ha tre termini.
$$\scriptsize\def\arraystretch{1.5}\begin{array}{rrrrr|l} x^4 & +2x^3 & +0x^2 & -x & +3 & \underline{\;x^2 - x + 1\;} \\ \underline{-x^4} & \underline{+x^3} & \underline{-x^2} & & & x^2 + 3x + 2 \\ & 3x^3 & -x^2 & -x & +3 & \\ & \underline{-3x^3} & \underline{+3x^2} & \underline{-3x} & & \\ & & 2x^2 & -4x & +3 & \\ & & \underline{-2x^2} & \underline{+2x} & \underline{-2} & \\ & & & -2x & +1 & \end{array}$$
Il resto parziale $-2x + 1$ ha grado $1$, minore del grado $2$ del divisore, quindi la divisione è finita: $Q(x) = x^2 + 3x + 2$ e $R(x) = -2x + 1$. Il resto questa volta non è un numero.
```

```ad-warning
Fermarsi al momento sbagliato
Il criterio per fermarsi è il grado del resto parziale, non il numero di passi. Nell'esempio 3, $2x^2 - 4x + 3$ ha lo stesso grado del divisore, quindi si va avanti; $-2x + 1$ ha grado minore, quindi ci si ferma, anche se il suo primo termine sembra ancora "divisibile".
```

```ad-example
Esempio 4: dividendo in disordine e quoziente con le frazioni
Dividi $4 - x^2 + 6x^3$ per $2x - 1$. Prima ordini il dividendo e lo completi: $6x^3 - x^2 + 0x + 4$.
$$\footnotesize\def\arraystretch{1.5}\begin{array}{rrrr|l} 6x^3 & -x^2 & +0x & +4 & \underline{\;2x - 1\;} \\ \underline{-6x^3} & \underline{+3x^2} & & & 3x^2 + x + \frac{1}{2} \\ & 2x^2 & +0x & +4 & \\ & \underline{-2x^2} & \underline{+x} & & \\ & & x & +4 & \\ & & \underline{-x} & \underline{+\frac{1}{2}} & \\ & & & \frac{9}{2} & \end{array}$$
L'ultimo passo è $x : 2x = \frac{1}{2}$, e $\frac{1}{2}(2x - 1) = x - \frac{1}{2}$, di cui scrivi l'opposto $-x + \frac{1}{2}$. Alla fine $4 + \frac{1}{2} = \frac{9}{2}$. Quindi $Q(x) = 3x^2 + x + \frac{1}{2}$ e $R(x) = \frac{9}{2}$: dividendo e divisore hanno coefficienti interi, ma quoziente e resto no, perché il primo coefficiente del divisore è $2$.
```

```ad-example
Esempio 5: anche il divisore è incompleto
Dividi $3x^4 - 2x^3 + x - 4$ per $x^2 + 2$. Il divisore non ha il termine in $x$, quindi i prodotti hanno due termini soli, e ognuno va scritto nella colonna della sua potenza.
$$\scriptsize\def\arraystretch{1.5}\begin{array}{rrrrr|l} 3x^4 & -2x^3 & +0x^2 & +x & -4 & \underline{\;x^2 + 2\;} \\ \underline{-3x^4} & \underline{\hphantom{-2x^3}} & \underline{-6x^2} & & & 3x^2 - 2x - 6 \\ & -2x^3 & -6x^2 & +x & -4 & \\ & \underline{+2x^3} & \underline{\hphantom{-6x^2}} & \underline{+4x} & & \\ & & -6x^2 & +5x & -4 & \\ & & \underline{+6x^2} & \underline{\hphantom{+5x}} & \underline{+12} & \\ & & & 5x & +8 & \end{array}$$
Per esempio $3x^2(x^2 + 2) = 3x^4 + 6x^2$: il $-6x^2$ va sotto la colonna di $x^2$, saltando quella di $x^3$. Il quoziente è $Q(x) = 3x^2 - 2x - 6$ e il resto è $R(x) = 5x + 8$.
```

```ad-note
Polinomi in più lettere
Lo stesso procedimento funziona con polinomi in più lettere: scegli una lettera, ordini secondo le sue potenze e tratti le altre lettere come coefficienti. Per esempio $x^2 - y^2$ diviso $x - y$, rispetto alla lettera $x$, dà quoziente $x + y$ e resto $0$.
```

## Verifica del risultato

La definizione stessa dà il controllo: moltiplica il divisore per il quoziente, aggiungi il resto e devi ritrovare il dividendo. Per l'esempio 1:

$$
\begin{aligned}
&(x - 2)(2x^2 + x + 6) + 7 \\
&= 2x^3 + x^2 + 6x - 4x^2 - 2x - 12 + 7 \\
&= 2x^3 - 3x^2 + 4x - 5
\end{aligned}
$$

che è proprio $A(x)$. Controlla anche che il resto abbia grado minore del divisore: se no, la divisione non è finita, anche quando l'uguaglianza torna.

```ad-tip
Un controllo veloce con un numero
Invece di fare tutta la moltiplicazione, puoi dare a $x$ un valore comodo, per esempio $x = 1$, e controllare l'uguaglianza tra numeri. Nell'esempio 1, $A(1) = 2 - 3 + 4 - 5 = -2$, mentre $B(1) \cdot Q(1) + R(1) = (-1) \cdot 9 + 7 = -2$. Se i due numeri sono diversi c'è sicuramente un errore; se sono uguali il risultato è probabilmente giusto, ma per esserne certi serve la moltiplicazione.
```

## Polinomi divisibili

Il polinomio $A(x)$ è **divisibile** per $B(x)$ quando il resto della divisione è il polinomio nullo. In questo caso l'uguaglianza della divisione diventa

$$A(x) = B(x) \cdot Q(x)$$

e $A(x)$ è scritto come prodotto di due polinomi. Nell'esempio 2 il resto è $0$, quindi $x^3 - 7x + 6$ è divisibile per $x - 2$ e

$$x^3 - 7x + 6 = (x - 2)(x^2 + 2x - 3)$$

Scrivere un polinomio come prodotto di polinomi di grado più basso si chiama [scomposizione in fattori](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale), e la divisione è uno degli strumenti per farla. Negli esempi 1, 3, 4 e 5 invece il resto non è nullo, quindi quei dividendi non sono divisibili per i loro divisori.

Quando il divisore è del tipo $x - a$, come negli esempi 1 e 2, la divisione si fa più in fretta con la [regola di Ruffini](/materiale/scuola-superiore/matematica/monomi-e-polinomi/regola-di-ruffini-e-teorema-del-resto), che usa solo i coefficienti, e il teorema del resto permette di trovare il resto senza fare la divisione.
