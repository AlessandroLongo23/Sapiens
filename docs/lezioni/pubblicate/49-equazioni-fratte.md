# Equazioni fratte

Un'**equazione fratta**, o frazionaria, è un'equazione in cui l'incognita compare in almeno un denominatore. Se dividi $12$ euro tra $x$ amici e ognuno paga $3$ euro, il numero di amici risolve l'equazione $\dfrac{12}{x} = 3$, che è fratta; la soluzione è $x = 4$, perché $12 : 4 = 3$.

Un'equazione in cui l'incognita non sta mai al denominatore si dice **intera**, anche se ha denominatori numerici: $\dfrac{x}{3} + 1 = \dfrac{x}{2}$ è intera. Le equazioni fratte si risolvono trasformandole in equazioni intere, con i metodi della lezione sulle [equazioni di primo grado intere](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere), e con i conti sulle frazioni algebriche che trovi nelle lezioni su [semplificazione](/materiale/scuola-superiore/matematica/frazioni-algebriche/semplificazione-delle-frazioni-algebriche) e [operazioni](/materiale/scuola-superiore/matematica/frazioni-algebriche/operazioni-con-le-frazioni-algebriche). In questa lezione ci sono solo equazioni che, tolti i denominatori, diventano di primo grado.

## Le condizioni di esistenza

Una frazione con denominatore zero non ha significato. Per questo un'equazione fratta ha senso solo per i valori dell'incognita che non annullano nessun denominatore: sono le **condizioni di esistenza** (C.E.), e si scrivono prima di fare qualunque altro passaggio.

Per trovarle scomponi ogni denominatore in fattori e poni ciascun fattore diverso da zero, come nella lezione [Frazioni algebriche e condizioni di esistenza](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza). Nell'equazione

$$\frac{3}{x^2 - 4} = \frac{1}{x}$$

il primo denominatore è $x^2 - 4 = (x - 2)(x + 2)$ e si annulla per $x = 2$ e per $x = -2$; il secondo si annulla per $x = 0$. Quindi C.E.: $x \neq -2$, $x \neq 0$, $x \neq 2$.

Un denominatore come $x^2 + 1$ non si annulla mai, perché $x^2 + 1 \geq 1$ per ogni $x$, e non dà nessuna condizione.

## Perché le condizioni di esistenza servono

Per togliere i denominatori si moltiplicano entrambi i membri per un'espressione che contiene l'incognita. Il [secondo principio di equivalenza](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere) permette di moltiplicare solo per un numero diverso da zero, e un'espressione come $x - 2$ è diversa da zero solo per $x \neq 2$. Così l'equazione intera che ottieni è equivalente a quella fratta soltanto per i valori che rispettano le C.E.: può avere una soluzione in più, che la fratta non ha.

Prendi l'equazione

$$\frac{x}{x - 2} = \frac{2}{x - 2}$$

con C.E.: $x \neq 2$. I due membri hanno lo stesso denominatore: moltiplicando per $x - 2$ si arriva a $x = 2$. Ma $2$ è proprio il valore escluso, e sostituito nell'equazione di partenza dà $\dfrac{2}{0} = \dfrac{2}{0}$, che non ha significato. L'equazione non ha soluzioni.

Per questo la soluzione dell'equazione intera va sempre confrontata con le C.E.: se le rispetta è una **soluzione accettabile**, se è uno dei valori esclusi è **non accettabile** e si scarta.

```ad-warning
Semplificare prima di scrivere le C.E.
In $\dfrac{x^2 - 4}{x - 2} = 4$ si può semplificare: $\dfrac{(x - 2)(x + 2)}{x - 2} = x + 2$, e resta $x + 2 = 4$, cioè $x = 2$. Chi semplifica senza aver scritto le C.E. dà $S = \{2\}$, che è sbagliato: il denominatore di partenza si annulla per $x = 2$, quindi C.E.: $x \neq 2$, e la soluzione non è accettabile. $S = \emptyset$. Le C.E. si leggono sui denominatori dell'equazione di partenza, prima di ogni semplificazione.
```

## Come si risolve

1. Scomponi in fattori tutti i denominatori.
2. Scrivi le C.E.: ogni fattore con l'incognita diverso da zero.
3. Calcola il MCM dei denominatori (come nella lezione [MCD e MCM di polinomi](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/mcd-e-mcm-di-polinomi)) e riduci i due membri a frazioni con il MCM come denominatore.
4. Elimina il denominatore, moltiplicando entrambi i membri per il MCM: per le C.E. è diverso da zero, quindi il secondo principio si può usare. Restano i numeratori.
5. Risolvi l'equazione intera che ottieni.
6. Confronta la soluzione con le C.E.: se è accettabile la tieni, altrimenti la scarti. Scrivi l'insieme delle soluzioni $S$.

Nei passi 3 e 4, invece di scrivere le frazioni con il denominatore comune, puoi moltiplicare subito ogni termine per il MCM e semplificare, come si fa con i denominatori numerici: il risultato è lo stesso. Negli esempi il denominatore comune è scritto per intero, perché così si vede da dove viene ogni fattore.

## Esempi svolti

```ad-example
Esempio 1: una frazione per membro
$$\frac{3}{x - 2} = \frac{5}{x}$$

I denominatori sono già scomposti. C.E.: $x \neq 0$, $x \neq 2$.

Il MCM è $x(x - 2)$. Ogni numeratore si moltiplica per il fattore che manca al suo denominatore:

$$\frac{3x}{x(x - 2)} = \frac{5(x - 2)}{x(x - 2)}$$

Elimina il denominatore e risolvi:

$$
\begin{gathered}
3x = 5(x - 2) \\
\Rightarrow 3x = 5x - 10 \\
\Rightarrow -2x = -10 \\
\Rightarrow x = 5
\end{gathered}
$$

Il $5$ è diverso da $0$ e da $2$: è accettabile. Verifica: $\dfrac{3}{5 - 2} = 1$ e $\dfrac{5}{5} = 1$. La soluzione è $S = \{5\}$.
```

```ad-example
Esempio 2: denominatori monomi
$$\frac{2}{x} + \frac{1}{2x} = \frac{5}{4}$$

C.E.: $x \neq 0$. Il MCM tra $x$, $2x$ e $4$ è $4x$:

$$\frac{8 + 2}{4x} = \frac{5x}{4x}$$

Elimina il denominatore:

$$
\begin{gathered}
10 = 5x \\
\Rightarrow x = 2
\end{gathered}
$$

Il $2$ è diverso da $0$: è accettabile. La soluzione è $S = \{2\}$.
```

```ad-warning
Il MCM non è il prodotto dei denominatori
Tra $x$, $2x$ e $4$ il MCM è $4x$, non il prodotto $x \cdot 2x \cdot 4 = 8x^2$. Moltiplicando per $8x^2$ ottieni $16x + 4x = 10x^2$, un'equazione di secondo grado con una soluzione in più, $x = 0$, che poi le C.E. scartano: il conto si allunga senza motivo.
```

```ad-example
Esempio 3: un denominatore da scomporre
$$\frac{1}{x - 2} + \frac{2}{x + 2} = \frac{6}{x^2 - 4}$$

Scomponi il terzo denominatore, una differenza di quadrati: $x^2 - 4 = (x - 2)(x + 2)$. C.E.: $x \neq -2$, $x \neq 2$.

Il MCM è $(x - 2)(x + 2)$:

$$
\begin{aligned}
&\frac{(x + 2) + 2(x - 2)}{(x - 2)(x + 2)} \\
&= \frac{6}{(x - 2)(x + 2)}
\end{aligned}
$$

Elimina il denominatore e risolvi:

$$
\begin{gathered}
x + 2 + 2x - 4 = 6 \\
\Rightarrow 3x - 2 = 6 \\
\Rightarrow 3x = 8 \\
\Rightarrow x = \frac{8}{3}
\end{gathered}
$$

$\dfrac{8}{3}$ è diverso da $-2$ e da $2$: è accettabile. La soluzione è $S = \left\{\dfrac{8}{3}\right\}$.
```

```ad-example
Esempio 4: denominatori opposti
$$\frac{x}{x - 1} + \frac{2}{1 - x} = 3$$

I denominatori $x - 1$ e $1 - x$ sono opposti: $1 - x = -(x - 1)$. Il segno meno si porta davanti alla frazione, e l'equazione diventa

$$\frac{x}{x - 1} - \frac{2}{x - 1} = 3$$

C.E.: $x \neq 1$ (vale per tutti e due i denominatori). Il MCM è $x - 1$, e anche il $3$ va moltiplicato per $x - 1$:

$$\frac{x - 2}{x - 1} = \frac{3(x - 1)}{x - 1}$$

$$
\begin{gathered}
x - 2 = 3x - 3 \\
\Rightarrow -2x = -1 \\
\Rightarrow x = \frac{1}{2}
\end{gathered}
$$

$\dfrac{1}{2}$ è diverso da $1$: è accettabile. La soluzione è $S = \left\{\dfrac{1}{2}\right\}$.
```

```ad-warning
Mettere nel MCM tutti e due i fattori opposti
Con i denominatori $x - 1$ e $1 - x$ il MCM non è $(x - 1)(1 - x)$: i due fattori differiscono solo per il segno, e prima si scrivono nello stesso modo, come nella lezione [MCD e MCM di polinomi](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/mcd-e-mcm-di-polinomi). Il MCM è $x - 1$.
```

```ad-example
Esempio 5: un'equazione che sembra di secondo grado
$$\frac{x - 1}{x + 1} = \frac{x + 2}{x + 3}$$

C.E.: $x \neq -3$, $x \neq -1$. Il MCM è $(x + 1)(x + 3)$:

$$\frac{(x - 1)(x + 3)}{(x + 1)(x + 3)} = \frac{(x + 2)(x + 1)}{(x + 1)(x + 3)}$$

Elimina il denominatore e svolgi i prodotti:

$$x^2 + 2x - 3 = x^2 + 3x + 2$$

Il termine $x^2$ compare in tutti e due i membri e si cancella: l'equazione è di primo grado.

$$
\begin{gathered}
2x - 3x = 2 + 3 \\
\Rightarrow -x = 5 \\
\Rightarrow x = -5
\end{gathered}
$$

$-5$ è diverso da $-3$ e da $-1$: è accettabile. Verifica: $\dfrac{-6}{-4} = \dfrac{3}{2}$ e $\dfrac{-3}{-2} = \dfrac{3}{2}$. La soluzione è $S = \{-5\}$.
```

```ad-tip
Controllare con la verifica
Il confronto con le C.E. è obbligatorio; la verifica, cioè sostituire la soluzione nell'equazione di partenza, è facoltativa ma trova gli errori di conto. Se sostituendo compare un denominatore zero, la soluzione non è accettabile.
```

## Soluzioni non accettabili, equazioni impossibili e indeterminate

L'equazione intera può essere determinata, impossibile o indeterminata, come nella lezione sulle [equazioni intere](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere). Per l'equazione fratta contano anche le C.E.:

| Equazione intera | Confronto con le C.E. | Equazione fratta |
|---|---|---|
| una soluzione | la rispetta | determinata, $S = \{\text{soluzione}\}$ |
| una soluzione | è un valore escluso | impossibile, $S = \emptyset$ |
| impossibile | non serve | impossibile, $S = \emptyset$ |
| indeterminata | non serve | indeterminata, $S$ = tutti i numeri tranne i valori esclusi |

Un'equazione fratta indeterminata non ha come soluzioni tutti i numeri: i valori esclusi dalle C.E. restano esclusi. Se le C.E. sono $x \neq 2$, si scrive $S = \mathbb{R} \setminus \{2\}$, cioè tutti i numeri reali tranne $2$ (è la [differenza](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare) tra $\mathbb{R}$ e $\{2\}$).

```ad-example
Esempio 6: una soluzione non accettabile
$$\frac{x + 1}{x - 3} - 2 = \frac{4}{x - 3}$$

C.E.: $x \neq 3$. Il MCM è $x - 3$, e il $2$, che non ha denominatore, va moltiplicato per $x - 3$:

$$\frac{x + 1 - 2(x - 3)}{x - 3} = \frac{4}{x - 3}$$

$$
\begin{gathered}
x + 1 - 2x + 6 = 4 \\
\Rightarrow -x + 7 = 4 \\
\Rightarrow -x = -3 \\
\Rightarrow x = 3
\end{gathered}
$$

Il $3$ è il valore escluso dalle C.E.: la soluzione non è accettabile. Sostituito nell'equazione di partenza darebbe denominatori nulli. L'equazione è impossibile: $S = \emptyset$.
```

```ad-warning
Dimenticare i termini senza denominatore
Nell'esempio 6 il $2$ va moltiplicato per il MCM come gli altri termini. Chi scrive $x + 1 - 2 = 4$ trova $x = 5$, che rispetta le C.E. ma non risolve l'equazione: $\dfrac{6}{2} - 2 = 1$, mentre $\dfrac{4}{2} = 2$.
```

```ad-warning
Scartare lo zero per abitudine
Una soluzione uguale a $0$ è non accettabile solo se le C.E. escludono lo $0$. In $\dfrac{3}{x - 1} = \dfrac{x + 3}{x - 1}$, con C.E.: $x \neq 1$, si arriva a $3 = x + 3$, cioè $x = 0$, che è accettabile: $S = \{0\}$.
```

```ad-example
Esempio 7: l'equazione intera è impossibile
$$\frac{x + 2}{x} = \frac{x - 1}{x - 3}$$

C.E.: $x \neq 0$, $x \neq 3$. Il MCM è $x(x - 3)$:

$$\frac{(x + 2)(x - 3)}{x(x - 3)} = \frac{x(x - 1)}{x(x - 3)}$$

Elimina il denominatore e svolgi i prodotti:

$$
\begin{gathered}
x^2 - x - 6 = x^2 - x \\
\Rightarrow x^2 - x - x^2 + x = 6 \\
\Rightarrow 0x = 6
\end{gathered}
$$

Nessun numero moltiplicato per $0$ dà $6$: l'equazione intera è impossibile, e quindi anche quella fratta. $S = \emptyset$.
```

```ad-example
Esempio 8: un'equazione indeterminata
$$\frac{2}{x + 1} - \frac{1}{x - 2} = \frac{x - 5}{x^2 - x - 2}$$

Scomponi il terzo denominatore con il [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado): i due numeri con somma $-1$ e prodotto $-2$ sono $-2$ e $1$, quindi $x^2 - x - 2 = (x - 2)(x + 1)$. C.E.: $x \neq -1$, $x \neq 2$.

Il MCM è $(x - 2)(x + 1)$:

$$
\begin{aligned}
&\frac{2(x - 2) - (x + 1)}{(x - 2)(x + 1)} \\
&= \frac{x - 5}{(x - 2)(x + 1)}
\end{aligned}
$$

Elimina il denominatore. Il meno davanti alla seconda frazione cambia il segno di tutti e due i termini di $x + 1$:

$$
\begin{gathered}
2x - 4 - x - 1 = x - 5 \\
\Rightarrow x - 5 = x - 5 \\
\Rightarrow 0x = 0
\end{gathered}
$$

L'equazione intera è vera per ogni $x$, ma quella fratta non ha significato per $x = -1$ e per $x = 2$. È indeterminata, e le soluzioni sono tutti i numeri reali tranne i due valori esclusi:

$$S = \mathbb{R} \setminus \{-1, 2\}$$

Sulla retta dei numeri le soluzioni sono tutta la retta, con due buchi in corrispondenza dei valori esclusi.

```tikz
% nome: soluzioni-equazione-fratta-indeterminata
% alt: Retta dei numeri colorata tutta tranne due punti vuoti in meno 1 e in 2, i valori esclusi dalle condizioni di esistenza: sono le soluzioni di un'equazione fratta indeterminata
% svg: soluzioni-equazione-fratta-indeterminata-680609b5.svg 245x35
\begin{tikzpicture}[x=0.8cm]
\draw[blue!45, line width=2pt] (-3.6,0) -- (-1.14,0);
\draw[blue!45, line width=2pt] (-0.86,0) -- (1.86,0);
\draw[blue!45, line width=2pt, ->] (2.14,0) -- (3.8,0);
\draw[thick] (-1,0) circle (0.1);
\draw[thick] (2,0) circle (0.1);
\draw (0,-0.12) -- (0,0.12);
\node[below] at (-1,-0.15) {$-1$};
\node[below] at (0,-0.15) {$0$};
\node[below] at (2,-0.15) {$2$};
\node[right] at (3.8,0) {$x$};
\end{tikzpicture}
```

Verifica con un valore qualunque tra quelli accettabili, per esempio $x = 0$: il primo membro vale $2 + \dfrac{1}{2} = \dfrac{5}{2}$ e il secondo $\dfrac{-5}{-2} = \dfrac{5}{2}$.
```

```ad-warning
Il meno davanti a una frazione
In $-\dfrac{1}{x - 2}$, portata al denominatore comune, il meno riguarda tutto il numeratore $x + 1$: si scrive $-(x + 1) = -x - 1$, non $-x + 1$. Tieni i numeratori tra parentesi finché non hai tolto il denominatore.
```

```ad-note
Dove si usano
Le condizioni di esistenza e il confronto con le soluzioni tornano nelle [equazioni letterali](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-letterali) con l'incognita al denominatore, nelle [disequazioni fratte](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte) e, al secondo anno, nelle equazioni fratte che diventano di [secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado), dove una delle due soluzioni può essere accettabile e l'altra no.
```

## Errori frequenti

```ad-warning
Moltiplicare "in croce" una somma
Il prodotto in croce vale solo quando ogni membro è una frazione sola, come nell'esempio 1: da $\dfrac{3}{x - 2} = \dfrac{5}{x}$ si passa a $3x = 5(x - 2)$. Con più termini, come in $\dfrac{1}{x} + 1 = \dfrac{2}{x}$, non si incrocia niente: si calcola il MCM e si moltiplicano tutti i termini, e si ottiene $1 + x = 2$.
```

```ad-warning
Fermarsi all'equazione intera
La soluzione dell'equazione intera non è ancora la risposta. Finché non l'hai confrontata con le C.E., non sai se l'equazione fratta ha quella soluzione o nessuna.
```
