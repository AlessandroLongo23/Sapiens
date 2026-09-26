# Raccoglimento totale e parziale

Moltiplicare vuol dire trasformare un prodotto in una somma: $x(x + 3) = x^2 + 3x$. Scomporre in fattori è il cammino inverso, cioè partire dalla somma $x^2 + 3x$ e tornare al prodotto $x(x + 3)$. Ti servirà per semplificare le frazioni con le lettere e per risolvere equazioni di grado più alto del primo, e il raccoglimento è il primo metodo da provare, sempre.

## Scomporre un polinomio in fattori

**Scomporre in fattori** un polinomio vuol dire scriverlo come prodotto di due o più polinomi. Per esempio

$$
\begin{aligned}
x^2 + 3x &= x(x + 3) \qquad\qquad 6x - 9 \\
&= 3(2x - 3)
\end{aligned}
$$

Il risultato è una scomposizione solo se l'ultima operazione è una moltiplicazione: $x(x + 3)$ è un prodotto, mentre una scrittura come $x(x + 3) + 1$ è ancora una somma.

Qualche polinomio non si può scomporre. Un polinomio è **irriducibile** se non si può scrivere come prodotto di due polinomi che abbiano entrambi grado almeno $1$. Tutti i polinomi di primo grado sono irriducibili, come $x + 3$ e $2x - 5$: il prodotto di due polinomi di grado almeno $1$ ha grado almeno $2$. Un numero davanti non conta come fattore che rende il polinomio riducibile, ma si raccoglie lo stesso: $6x - 9 = 3(2x - 3)$ si scrive così, con il $3$ fuori.

Una scomposizione è completa quando ogni fattore è irriducibile. Per arrivarci spesso serve più di un metodo, uno dopo l'altro: questa lezione tratta il raccoglimento, le prossime i [prodotti notevoli](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli), il [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado) e la [regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini).

```ad-note
Coefficienti interi
Qui si scompone con coefficienti interi, come nei libri del biennio: i fattori hanno coefficienti interi e si cerca di non introdurre frazioni. L'unica eccezione è il riquadro sui coefficienti frazionari più avanti.
```

## Raccoglimento totale

Il **raccoglimento totale** (o raccoglimento a fattor comune) è la proprietà distributiva letta da destra a sinistra. Se tutti i termini di un polinomio hanno un fattore in comune, quel fattore si porta fuori da una parentesi:

$$ab + ac = a(b + c)$$

Moltiplicando $a(b + c)$ si torna a $ab + ac$, come nel [prodotto di un monomio per un polinomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-polinomi). Il fattore da raccogliere è il MCD dei termini, calcolato come nella lezione su [MCD e MCM tra monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/mcd-e-mcm-tra-monomi): il MCD dei coefficienti e le lettere comuni a tutti i termini, ognuna con l'esponente più piccolo.

La figura mostra il perché con le aree: un quadrato di lato $x$ e un rettangolo di lati $x$ e $3$, messi uno accanto all'altro, formano un rettangolo di lati $x$ e $x + 3$. L'area è la stessa, scritta in due modi: $x^2 + 3x = x(x + 3)$.

```tikz
% nome: raccoglimento-totale-aree
% alt: Un quadrato di lato x e un rettangolo di lati x e 3 affiancati formano un rettangolo di altezza x e base x più 3, quindi x al quadrato più 3x è uguale a x per x più 3
% svg: raccoglimento-totale-aree-566466d3.svg 209x128
\begin{tikzpicture}
\fill[blue!20] (0,0) rectangle (2,2);
\fill[orange!30] (2,0) rectangle (5,2);
\draw (0,0) rectangle (5,2);
\draw (2,0) -- (2,2);
\node at (1,1) {$x^2$};
\node at (3.5,1) {$3x$};
\node[left] at (0,1) {$x$};
\node[above] at (1,2) {$x$};
\node[above] at (3.5,2) {$3$};
\draw[<->] (0,-0.3) -- (5,-0.3);
\node[below] at (2.5,-0.35) {$x + 3$};
\end{tikzpicture}
```

### Procedimento

1. Calcola il MCD di tutti i termini del polinomio.
2. Scrivi il MCD fuori da una parentesi.
3. Dentro la parentesi scrivi il quoziente di ogni termine diviso per il MCD, con il suo segno (la [divisione tra monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-monomi)).
4. Controlla che dentro la parentesi ci siano tanti termini quanti erano nel polinomio e che non abbiano più fattori in comune.

```ad-example
Esempio 1: tre termini con due lettere
Scomponi $6x^3y - 9x^2y^2 + 3x^2y$.

Coefficienti: $\text{MCD}(6, 9, 3) = 3$. La $x$ compare in tutti i termini, con esponente minimo $2$; anche la $y$, con esponente minimo $1$. Il MCD è $3x^2y$.

Quozienti: $6x^3y : 3x^2y = 2x$, poi $-9x^2y^2 : 3x^2y = -3y$, poi $3x^2y : 3x^2y = 1$.

$$
\begin{aligned}
&6x^3y - 9x^2y^2 + 3x^2y \\
&= 3x^2y(2x - 3y + 1)
\end{aligned}
$$

Controllo: $3x^2y \cdot 2x = 6x^3y$, $3x^2y \cdot (-3y) = -9x^2y^2$, $3x^2y \cdot 1 = 3x^2y$.
```

```ad-warning
Dimenticare l'1
Quando un termine è uguale al MCD, il suo quoziente è $1$, non $0$, e va scritto. $3x^2y(2x - 3y)$ è sbagliato: moltiplicando dà solo due termini, e il terzo si è perso.
```

```ad-warning
Raccogliere un fattore troppo piccolo
$6x^3 + 4x^2 = 2x(3x^2 + 2x)$ è vero, ma nella parentesi resta una $x$ comune: la scomposizione non è finita. Il MCD è $2x^2$, e $6x^3 + 4x^2 = 2x^2(3x + 2)$.
```

### Raccogliere un segno meno

Si può raccogliere anche l'opposto del MCD. Conviene quando il primo termine è negativo, perché così nella parentesi il primo coefficiente è positivo. Raccogliendo un segno meno, ogni termine dentro la parentesi cambia segno:

$$-a + b = -(a - b)$$

```ad-example
Esempio 2: primo termine negativo
Scomponi $-4x^3 + 8x^2 - 2x$.

Il MCD è $2x$; il primo termine è negativo, quindi raccogli $-2x$. Quozienti: $-4x^3 : (-2x) = 2x^2$, poi $8x^2 : (-2x) = -4x$, poi $-2x : (-2x) = 1$.

$$
\begin{aligned}
&-4x^3 + 8x^2 - 2x \\
&= -2x(2x^2 - 4x + 1)
\end{aligned}
$$

Raccogliere $2x$ andava bene lo stesso: $2x(-2x^2 + 4x - 1)$ è la stessa scomposizione, scritta con il meno dentro la parentesi.
```

```ad-warning
Cambiare segno solo al primo termine
Raccogliendo $-1$ cambiano segno tutti i termini: $-x^2 + 5x - 6 = -(x^2 - 5x + 6)$. Scrivere $-(x^2 + 5x - 6)$ è sbagliato, perché moltiplicando si ottiene $-x^2 - 5x + 6$.
```

```ad-note
Coefficienti frazionari
Se i coefficienti sono frazioni, si può raccogliere una frazione scelta in modo che dentro la parentesi i coefficienti siano interi. In $\frac{1}{2}x^2 - \frac{3}{4}x$ il denominatore comune è $4$: raccogliendo $\frac{1}{4}x$ si ottiene $\frac{1}{4}x(2x - 3)$. Controllo: $\frac{1}{4}x \cdot 2x = \frac{1}{2}x^2$ e $\frac{1}{4}x \cdot (-3) = -\frac{3}{4}x$.
```

### Raccogliere un polinomio

Il fattore comune può essere un polinomio tra parentesi. Il procedimento non cambia: in $3x(a + b) - 2y(a + b)$ i due termini hanno in comune $(a + b)$, che va fuori, e dentro resta quello che moltiplicava $(a + b)$ in ciascun termine:

$$
\begin{aligned}
&3x(a + b) - 2y(a + b) \\
&= (a + b)(3x - 2y)
\end{aligned}
$$

```ad-example
Esempio 3: una parentesi al quadrato
Scomponi $(x + 1)^2 - 3(x + 1)$.

$(x + 1)^2$ vuol dire $(x + 1)(x + 1)$, quindi il fattore $(x + 1)$ è comune ai due termini. Dal primo termine resta $(x + 1)$, dal secondo $-3$.

$$
\begin{aligned}
&(x + 1)^2 - 3(x + 1) \\
&= (x + 1)\big[(x + 1) - 3\big] \\
&= (x + 1)(x - 2)
\end{aligned}
$$

Dopo aver raccolto, riduci quello che resta nella parentesi quadra.
```

```ad-example
Esempio 4: fattori opposti
Scomponi $x(a - b) + y(b - a)$.

$(a - b)$ e $(b - a)$ non sono uguali ma opposti: $b - a = -(a - b)$. Riscrivi il secondo termine con il segno meno davanti, e il fattore diventa comune.

$$
\begin{aligned}
&x(a - b) + y(b - a) \\
&= x(a - b) - y(a - b) \\
&= (a - b)(x - y)
\end{aligned}
$$
```

```ad-warning
Raccogliere due parentesi opposte come se fossero uguali
In $x(a - b) + y(b - a)$ scrivere subito $(a - b)(x + y)$ è sbagliato: moltiplicando si ottiene $ya - yb$, mentre nel polinomio c'era $y(b - a) = yb - ya$. Prima si trasforma $(b - a)$ in $-(a - b)$, e il segno meno passa davanti a $y$.
```

## Raccoglimento parziale

A volte i termini non hanno un fattore comune a tutti, ma si possono dividere in gruppi che ne hanno uno. Il **raccoglimento parziale** (o raccoglimento a gruppi) raccoglie dentro ogni gruppo e, se in tutti i gruppi resta lo stesso polinomio tra parentesi, raccoglie quel polinomio.

$$
\begin{aligned}
&ax + ay + bx + by \\
&= a(x + y) + b(x + y) \\
&= (x + y)(a + b)
\end{aligned}
$$

Il passaggio in mezzo, $a(x + y) + b(x + y)$, non è ancora una scomposizione: è una somma di due termini. Diventa un prodotto solo con l'ultimo raccoglimento totale.

### Procedimento

1. Se c'è un fattore comune a tutti i termini, raccoglilo prima.
2. Dividi i termini in gruppi con lo stesso numero di termini, in modo che ogni gruppo abbia un fattore comune.
3. Raccogli il fattore comune dentro ogni gruppo, scegliendo il segno in modo che le parentesi vengano uguali.
4. Raccogli la parentesi comune.
5. Se le parentesi non vengono uguali né opposte, prova un altro raggruppamento.

Il raccoglimento parziale funziona solo se, dopo il passo 3, tutti i gruppi hanno la stessa parentesi. Se nessun raggruppamento ci riesce, il metodo non si applica; non vuol dire che il polinomio sia irriducibile, perché altri metodi possono funzionare.

```ad-example
Esempio 5: quattro termini in una lettera
Scomponi $x^3 - 2x^2 - 3x + 6$.

Nessun fattore comune a tutti. Raggruppa i primi due termini e gli ultimi due: nel primo gruppo raccogli $x^2$, nel secondo $-3$.

$$
\begin{aligned}
&x^3 - 2x^2 - 3x + 6 \\
&= x^2(x - 2) - 3(x - 2) \\
&= (x - 2)(x^2 - 3)
\end{aligned}
$$

Nel secondo gruppo si raccoglie $-3$ e non $3$: con $3$ la parentesi sarebbe $(-x + 2)$, opposta alla prima. $x^2 - 3$ non ha fattori comuni e non si scompone con coefficienti interi, quindi la scomposizione è completa.
```

```ad-example
Esempio 6: il segno che fa tornare la parentesi
Scomponi $2ax - 6a - bx + 3b$.

Primo gruppo: $2ax - 6a = 2a(x - 3)$. Secondo gruppo: $-bx + 3b$; raccogliendo $b$ resterebbe $(-x + 3)$, raccogliendo $-b$ resta $(x - 3)$, uguale alla prima parentesi.

$$
\begin{aligned}
&2ax - 6a - bx + 3b \\
&= 2a(x - 3) - b(x - 3) \\
&= (x - 3)(2a - b)
\end{aligned}
$$
```

```ad-example
Esempio 7: il primo raggruppamento non funziona
Scomponi $x^2 + 3y - xy - 3x$.

Raggruppando i termini come sono scritti, $x^2 + 3y$ non ha fattori comuni. Riordina il polinomio, mettendo vicini i termini che hanno qualcosa in comune:

$$
\begin{aligned}
&x^2 - xy - 3x + 3y \\
&= x(x - y) - 3(x - y) \\
&= (x - y)(x - 3)
\end{aligned}
$$

Anche il raggruppamento $(x^2 - 3x) + (-xy + 3y)$ funziona: dà $x(x - 3) - y(x - 3) = (x - 3)(x - y)$, lo stesso prodotto con i fattori scambiati.
```

```ad-example
Esempio 8: sei termini
Scomponi $ax^2 + bx^2 + ax + bx + 3a + 3b$.

Sei termini si possono dividere in tre gruppi da due. In ogni coppia raccogli la potenza di $x$ o il numero:

$$
\begin{aligned}
&ax^2 + bx^2 + ax + bx + 3a + 3b \\
&= x^2(a + b) + x(a + b) + 3(a + b) \\
&= (a + b)(x^2 + x + 3)
\end{aligned}
$$

Con due gruppi da tre si arriva allo stesso risultato: $a(x^2 + x + 3) + b(x^2 + x + 3)$.
```

```ad-example
Esempio 9: prima il raccoglimento totale
Scomponi $2x^3 - 4x^2 + 6x - 12$.

Tutti i coefficienti sono pari: prima raccogli $2$, poi fai il raccoglimento parziale dentro la parentesi.

$$
\begin{aligned}
&2x^3 - 4x^2 + 6x - 12 \\
&= 2(x^3 - 2x^2 + 3x - 6) \\
&= 2\big[x^2(x - 2) + 3(x - 2)\big] \\
&= 2(x - 2)(x^2 + 3)
\end{aligned}
$$

Senza il primo passo si arriva a $(x - 2)(2x^2 + 6)$, dove il $2$ è rimasto dentro l'ultimo fattore: bisogna raccoglierlo ancora.
```

```ad-example
Esempio 10: quando non funziona
Prova a scomporre $x^3 + x^2 + x + 2$.

Primi due e ultimi due: $x^2(x + 1) + (x + 2)$, parentesi diverse. Primo e terzo, secondo e quarto: $x(x^2 + 1) + (x^2 + 2)$, parentesi diverse. Primo e quarto, secondo e terzo: $(x^3 + 2) + x(x + 1)$, e il primo gruppo non ha fattori comuni.

Nessun raggruppamento funziona: il raccoglimento parziale non si applica. In questo caso il polinomio è davvero irriducibile, ma per saperlo serve la [regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini).
```

```ad-warning
Fermarsi a metà
$x^2(x - 2) - 3(x - 2)$ non è una scomposizione: è una somma di due termini. Il polinomio è scomposto solo dopo aver raccolto la parentesi comune, $(x - 2)(x^2 - 3)$.
```

## Controllare il risultato

Ogni scomposizione si controlla moltiplicando i fattori: si deve tornare al polinomio di partenza. Nell'esempio 5:

$$
\begin{aligned}
&(x - 2)(x^2 - 3) \\
&= x^3 - 3x - 2x^2 + 6 \\
&= x^3 - 2x^2 - 3x + 6
\end{aligned}
$$

```ad-tip
Il controllo con un numero
Un controllo più veloce è sostituire un numero alla lettera nei due lati. Con $x = 3$ nell'esempio 5: $27 - 18 - 9 + 6 = 6$ e $(3 - 2)(9 - 3) = 6$. Se i due valori sono diversi c'è un errore; se sono uguali la scomposizione è quasi certamente giusta. Evita $x = 0$ e $x = 1$, che nascondono gli errori sugli esponenti.
```

Il controllo moltiplicando dice se la scomposizione è giusta, non se è finita. Per sapere se è completa guarda ogni fattore: se ha ancora un fattore comune, o se è un polinomio che si scompone con uno degli altri metodi, bisogna andare avanti.
