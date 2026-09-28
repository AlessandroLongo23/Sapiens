# Disequazioni di primo grado e intervalli

Hai $20$ euro e vuoi comprare dei quaderni da $3$ euro l'uno: se $x$ è il numero di quaderni, la spesa $3x$ non deve superare $20$, cioè $3x \le 20$. Non cerchi un valore esatto di $x$, ma tutti i valori che rispettano un limite. Scritture come questa sono disequazioni, e la loro soluzione non è un numero solo ma un insieme di numeri, di solito un intervallo della retta.

Le disequazioni di primo grado si risolvono quasi come le [equazioni di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere), con una regola in più sul verso della disuguaglianza.

## Disuguaglianze e disequazioni

Una **disuguaglianza** è un confronto tra due numeri con uno dei segni $<$ (minore), $>$ (maggiore), $\le$ (minore o uguale), $\ge$ (maggiore o uguale). Una disuguaglianza tra numeri è vera o falsa: $3 < 7$ è vera, $5 \le 5$ è vera (perché $5 = 5$), $5 < 5$ è falsa.

Una **disequazione** è una disuguaglianza tra due espressioni che contengono un'incognita, per esempio

$$2x + 1 > 7$$

Come nelle equazioni, l'espressione a sinistra è il primo membro e quella a destra il secondo membro. Un numero è una **soluzione** della disequazione se, messo al posto dell'incognita, la rende vera. Il $4$ è una soluzione, perché $2 \cdot 4 + 1 = 9$ e $9 > 7$; il $3$ non lo è, perché $2 \cdot 3 + 1 = 7$ e $7 > 7$ è falsa. Le soluzioni di questa disequazione sono tutti i numeri maggiori di $3$: sono infiniti, e il loro insieme, che si indica con $S$, si scrive con un intervallo.

## Gli intervalli

Un **intervallo** è l'insieme dei numeri reali compresi tra due estremi, oppure maggiori o minori di un numero. Si scrive con due parentesi quadre: la parentesi rivolta verso il numero dice che l'estremo è incluso, quella rivolta verso l'esterno dice che è escluso. Sulla retta dei numeri l'intervallo è un tratto colorato, e ogni estremo ha un pallino: **pallino pieno** se l'estremo è incluso, **pallino vuoto** se è escluso.

| Disuguaglianza | Intervallo | Estremi |
|---|---|---|
| $a \le x \le b$ | $[a, b]$ | chiuso |
| $a < x < b$ | $\mathopen{]}a, b\mathclose{[}$ | aperto |
| $a \le x < b$ | $[a, b\mathclose{[}$ | $a$ incluso, $b$ escluso |
| $a < x \le b$ | $\mathopen{]}a, b]$ | $a$ escluso, $b$ incluso |

Qui $a < b$, e la scrittura $a \le x \le b$ si legge "$x$ compreso tra $a$ e $b$, estremi inclusi": vuol dire $x \ge a$ e insieme $x \le b$. Per esempio $-1 \le x < 3$ è l'intervallo $[-1, 3\mathclose{[}$: contiene $-1$, $0$, $2{,}5$, ma non $3$.

```tikz
% nome: intervallo-limitato-retta
% alt: Retta dei numeri con il tratto colorato da meno 1 a 3, pallino pieno in meno 1 e pallino vuoto in 3: l'intervallo da meno 1 incluso a 3 escluso
% svg: intervallo-limitato-retta-6ab5fd42.svg 244x35
\begin{tikzpicture}[x=0.8cm]
\draw[black!70] (-2.5,0) -- (2.87,0);
\draw[black!70, ->] (3.13,0) -- (4.9,0);
\draw[blue!45, line width=2pt] (-1,0) -- (2.87,0);
\draw (0,-0.1) -- (0,0.1);
\filldraw[thick] (-1,0) circle (2.5pt);
\draw[thick] (3,0) circle (2.5pt);
\node[below] at (-1,-0.15) {$-1$};
\node[below] at (0,-0.15) {$0$};
\node[below] at (3,-0.15) {$3$};
\node[right] at (4.9,0) {$x$};
\end{tikzpicture}
```

Gli intervalli di questa tabella hanno due estremi e si dicono **limitati**. I numeri maggiori di un numero, o minori, formano invece un **intervallo illimitato**, che si scrive con il simbolo $+\infty$ (più infinito) o $-\infty$ (meno infinito):

| Disuguaglianza | Intervallo |
|---|---|
| $x \ge a$ | $[a, +\infty\mathclose{[}$ |
| $x > a$ | $\mathopen{]}a, +\infty\mathclose{[}$ |
| $x \le a$ | $\mathopen{]}-\infty, a]$ |
| $x < a$ | $\mathopen{]}-\infty, a\mathclose{[}$ |

Per esempio $x > 2$ è l'intervallo $\mathopen{]}2, +\infty\mathclose{[}$: sulla retta è la semiretta a destra di $2$, con il pallino vuoto in $2$.

```tikz
% nome: intervallo-illimitato-retta
% alt: Retta dei numeri colorata a destra di 2, con un pallino vuoto in 2: l'intervallo dei numeri maggiori di 2
% svg: intervallo-illimitato-retta-2e91fdc2.svg 244x33
\begin{tikzpicture}[x=0.8cm]
\draw[black!70] (-1.5,0) -- (1.87,0);
\draw[black!70, ->] (2.13,0) -- (5.9,0);
\draw[blue!45, line width=2pt] (2.13,0) -- (5.5,0);
\draw (0,-0.1) -- (0,0.1);
\draw[thick] (2,0) circle (2.5pt);
\node[below] at (0,-0.15) {$0$};
\node[below] at (2,-0.15) {$2$};
\node[right] at (5.9,0) {$x$};
\end{tikzpicture}
```

Il simbolo $\infty$ non è un numero: dice solo che l'intervallo prosegue senza fine. Per questo dalla parte di $+\infty$ e di $-\infty$ la parentesi è sempre rivolta verso l'esterno. Tutta la retta, cioè l'insieme $\mathbb{R}$ dei numeri reali, si può scrivere anche $\mathopen{]}-\infty, +\infty\mathclose{[}$.

Torna alla disequazione $2x + 1 > 7$ dell'inizio. Sposta $x$ sulla retta e prova diversi numeri: ogni numero provato lascia un segno, e i segni disegnano l'insieme delle soluzioni.

```interattivo
% nome: disequazione-prova-valori
% alt: Retta dei numeri da meno 1 a 6 con un punto x da trascinare; per ogni posizione si legge 2x più 1 confrontato con 7, e sopra la retta resta un pallino verde per ogni soluzione provata e una crocetta rossa per ogni numero che non lo è; un bottone mostra l'insieme delle soluzioni, la semiretta a destra di 3 con il pallino vuoto in 3
```

```ad-note
Altre notazioni
Molti libri scrivono l'estremo escluso con la parentesi tonda: $(2, 5]$ è lo stesso intervallo di $\mathopen{]}2, 5]$, e $(2, +\infty)$ è lo stesso di $\mathopen{]}2, +\infty\mathclose{[}$. Si trova anche la scrittura con le parentesi graffe, $S = \{x \in \mathbb{R} \mid x > 2\}$, che si legge "l'insieme degli $x$ reali tali che $x > 2$". Il significato è sempre lo stesso.
```

```ad-warning
La parentesi dalla parte sbagliata
Per $x \le 4$ si scrive $\mathopen{]}-\infty, 4]$: il $4$ è incluso, quindi la sua parentesi è rivolta verso il $4$. Scrivere $\mathopen{]}-\infty, 4\mathclose{[}$ toglie il $4$ dalle soluzioni. E dalla parte di $-\infty$ la parentesi non è mai $[-\infty$.
```

## I principi di equivalenza

Due disequazioni sono **equivalenti** se hanno le stesse soluzioni. Per risolvere una disequazione la si trasforma in disequazioni equivalenti sempre più semplici, fino a una del tipo $x > \text{numero}$ (o con un altro segno), da cui le soluzioni si leggono subito. Le trasformazioni permesse sono date da due principi.

### Primo principio

Il **primo principio di equivalenza** dice che, se aggiungi o sottrai lo stesso numero (o la stessa espressione con l'incognita) a entrambi i membri, ottieni una disequazione equivalente. È lo stesso principio delle equazioni, e ne vengono le stesse regole: la regola del trasporto (un termine passa all'altro membro cambiando segno) e la regola di cancellazione. Da $2x + 1 > 7$, portando il $+1$ a secondo membro, si ottiene $2x > 7 - 1$, cioè $2x > 6$.

### Secondo principio

Per il secondo principio conta il segno del numero per cui moltiplichi. Guarda la disuguaglianza vera $2 < 5$:

- moltiplicando per $3$ ottieni $6$ e $15$, e $6 < 15$ è ancora vera;
- moltiplicando per $-1$ ottieni $-2$ e $-5$, e $-2 < -5$ è falsa: vale il contrario, $-2 > -5$.

Cambiare segno scambia l'ordine: sulla retta, $-5$ sta a sinistra di $-2$, mentre $5$ sta a destra di $2$.

Nella figura i punti sono $2k$ e $5k$, cioè $2$ e $5$ moltiplicati per lo stesso numero $k$. Muovi $k$ e guarda che cosa succede all'ordine dei due punti quando $k$ passa per lo zero.

```interattivo
% nome: secondo-principio-retta
% alt: Retta dei numeri da meno 16 a 16 con i punti 2k e 5k e un cursore per k tra meno 3 e 3: finché k è positivo 2k sta a sinistra di 5k e vale 2k minore di 5k, con k uguale a 0 i due punti coincidono in 0, e con k negativo si scambiano di posto e vale 2k maggiore di 5k
```

Per questo il **secondo principio di equivalenza** ha due parti:

- se moltiplichi o dividi entrambi i membri per lo stesso numero positivo, ottieni una disequazione equivalente, con lo stesso verso;
- se moltiplichi o dividi entrambi i membri per lo stesso numero negativo, ottieni una disequazione equivalente solo se cambi il verso della disuguaglianza: $<$ diventa $>$, $\le$ diventa $\ge$, e viceversa.

Da $2x > 6$, dividendo per $2$, ottieni $x > 3$. Da $-2x > 6$, dividendo per $-2$, ottieni $x < -3$.

```ad-warning
Dimenticare di cambiare il verso
Da $-3x < 12$ non si passa a $x < -4$. Dividi per $-3$, che è negativo, quindi il verso cambia: $x > -4$. Controllo veloce: $x = 0$ rende vera $-3x < 12$ (perché $0 < 12$), ed è davvero maggiore di $-4$.
```

```ad-warning
Cambiare il verso quando non serve
Il verso cambia se è negativo il numero per cui dividi, non il risultato. Da $3x > -6$, dividendo per $3$, ottieni $x > -2$: il $3$ è positivo, il verso resta quello.
```

Moltiplicare per $0$, come nelle equazioni, non è permesso: qualunque disequazione diventerebbe un confronto tra $0$ e $0$.

## Forma normale e soluzioni

Una disequazione è di **primo grado** quando, svolti i calcoli, si può scrivere in una delle forme

$$
\begin{gathered}
ax > b \qquad ax \ge b \\
ax < b \qquad ax \le b
\end{gathered}
$$

dove $a$ e $b$ sono numeri. È la **forma normale** della disequazione. Le soluzioni dipendono dal segno di $a$. Per $ax > b$:

- se $a > 0$, dividi per $a$ e il verso resta: $x > \dfrac{b}{a}$;
- se $a < 0$, dividi per $a$ e il verso cambia: $x < \dfrac{b}{a}$;
- se $a = 0$, la disequazione diventa $0x > b$, cioè $0 > b$, che non dipende da $x$: se è vera, è vera per ogni $x$ e $S = \mathbb{R}$; se è falsa, non è vera per nessun $x$ e $S = \emptyset$.

Con gli altri segni si ragiona allo stesso modo. Il caso $a = 0$ ha una sezione più avanti.

## Come si risolve

1. Se ci sono denominatori numerici, moltiplica tutti i termini dei due membri per il loro MCM, scrivendo i numeratori tra parentesi. Il MCM è positivo, quindi il verso non cambia.
2. Svolgi i prodotti e togli le parentesi.
3. Con la regola del trasporto porta i termini con l'incognita a primo membro e i numeri a secondo membro.
4. Riduci i termini simili: arrivi alla forma normale.
5. Dividi entrambi i membri per il coefficiente di $x$, e cambia il verso se il coefficiente è negativo.
6. Scrivi l'insieme delle soluzioni come intervallo e disegnalo sulla retta.

I passi sono quelli delle [equazioni di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere); cambia solo il passo 5.

## Esempi svolti

```ad-example
Esempio 1: coefficiente positivo
$$3x - 5 > 7$$

Porta $-5$ a secondo membro, cambiandogli il segno, e dividi per $3$, che è positivo, quindi il verso resta:

$$
\begin{gathered}
3x > 7 + 5 \\
\Rightarrow 3x > 12 \\
\Rightarrow x > 4
\end{gathered}
$$

Le soluzioni sono i numeri maggiori di $4$, escluso il $4$: $S = \mathopen{]}4, +\infty\mathclose{[}$.

```tikz
% nome: soluzioni-x-maggiore-4
% alt: Retta dei numeri colorata a destra di 4, con un pallino vuoto in 4: le soluzioni di x maggiore di 4
% svg: soluzioni-x-maggiore-4-68822c93.svg 253x33
\begin{tikzpicture}[x=0.8cm]
\draw[black!70] (-0.8,0) -- (3.87,0);
\draw[black!70, ->] (4.13,0) -- (6.9,0);
\draw[blue!45, line width=2pt] (4.13,0) -- (6.5,0);
\draw (0,-0.1) -- (0,0.1);
\draw[thick] (4,0) circle (2.5pt);
\node[below] at (0,-0.15) {$0$};
\node[below] at (4,-0.15) {$4$};
\node[right] at (6.9,0) {$x$};
\end{tikzpicture}
```
```

```ad-example
Esempio 2: coefficiente negativo
$$2 - 5x \ge 17$$

Porta il $2$ a secondo membro:

$$-5x \ge 17 - 2 \quad\Rightarrow\quad -5x \ge 15$$

Dividi per $-5$: il coefficiente è negativo, quindi $\ge$ diventa $\le$.

$$x \le \frac{15}{-5} \quad\Rightarrow\quad x \le -3$$

In alternativa, moltiplica prima per $-1$, cambiando il verso: $5x \le -15$, e quindi $x \le -3$. Il $-3$ è incluso: $S = \mathopen{]}-\infty, -3]$.

```tikz
% nome: soluzioni-x-minore-uguale-meno-3
% alt: Retta dei numeri colorata a sinistra di meno 3, con un pallino pieno in meno 3: le soluzioni di x minore o uguale a meno 3
% svg: soluzioni-x-minore-uguale-meno-3-530e659c.svg 245x35
\begin{tikzpicture}[x=0.8cm]
\draw[black!70, ->] (-5.5,0) -- (1.9,0);
\draw[blue!45, line width=2pt] (-5.5,0) -- (-3,0);
\draw (0,-0.1) -- (0,0.1);
\filldraw[thick] (-3,0) circle (2.5pt);
\node[below] at (-3,-0.15) {$-3$};
\node[below] at (0,-0.15) {$0$};
\node[right] at (1.9,0) {$x$};
\end{tikzpicture}
```
```

```ad-example
Esempio 3: parentesi e incognita in entrambi i membri
$$4(x + 1) - 3 \le 6x - (x - 2)$$

Togli le parentesi. Il meno davanti a $(x - 2)$ cambia il segno di tutti e due i termini:

$$
\begin{gathered}
4x + 4 - 3 \le 6x - x + 2 \\
\Rightarrow 4x + 1 \le 5x + 2
\end{gathered}
$$

Trasporta e riduci:

$$
\begin{gathered}
4x - 5x \le 2 - 1 \\
\Rightarrow -x \le 1
\end{gathered}
$$

Moltiplica per $-1$ e cambia il verso: $x \ge -1$. Quindi $S = [-1, +\infty\mathclose{[}$.

```tikz
% nome: soluzioni-x-maggiore-uguale-meno-1
% alt: Retta dei numeri colorata a destra di meno 1, con un pallino pieno in meno 1: le soluzioni di x maggiore o uguale a meno 1
% svg: soluzioni-x-maggiore-uguale-meno-1-ee9b6cab.svg 244x35
\begin{tikzpicture}[x=0.8cm]
\draw[black!70, ->] (-3.5,0) -- (3.9,0);
\draw[blue!45, line width=2pt] (-1,0) -- (3.5,0);
\draw (0,-0.1) -- (0,0.1);
\filldraw[thick] (-1,0) circle (2.5pt);
\node[below] at (-1,-0.15) {$-1$};
\node[below] at (0,-0.15) {$0$};
\node[right] at (3.9,0) {$x$};
\end{tikzpicture}
```
```

```ad-example
Esempio 4: denominatori numerici e soluzione frazionaria
$$\frac{x - 2}{3} - \frac{x + 1}{2} \le \frac{x}{4}$$

Il MCM tra $3$, $2$ e $4$ è $12$, positivo: moltiplica ogni termine per $12$ senza cambiare il verso, tenendo i numeratori tra parentesi.

$$4(x - 2) - 6(x + 1) \le 3x$$

Il $-6$ cambia il segno di tutti e due i termini di $x + 1$:

$$
\begin{gathered}
4x - 8 - 6x - 6 \le 3x \\
\Rightarrow -2x - 14 \le 3x \\
\Rightarrow -2x - 3x \le 14 \\
\Rightarrow -5x \le 14
\end{gathered}
$$

Dividi per $-5$ e cambia il verso:

$$x \ge -\frac{14}{5}$$

Quindi $S = \left[-\dfrac{14}{5}, +\infty\right[$. La frazione resta frazione: $-\dfrac{14}{5} = -2{,}8$, e sulla retta sta tra $-3$ e $-2$.

```tikz
% nome: soluzioni-x-maggiore-uguale-meno-14-quinti
% alt: Retta dei numeri colorata a destra di meno 14 quinti, con un pallino pieno in meno 14 quinti: le soluzioni di x maggiore o uguale a meno 14 quinti
% svg: soluzioni-x-maggiore-uguale-meno-14-quinti-0c06def3.svg 259x41
\begin{tikzpicture}[x=0.8cm]
\draw[black!70, ->] (-4.5,0) -- (3.4,0);
\draw[blue!45, line width=2pt] (-2.8,0) -- (3,0);
\draw (0,-0.1) -- (0,0.1);
\filldraw[thick] (-2.8,0) circle (2.5pt);
\node[below] at (-2.8,-0.15) {$-\frac{14}{5}$};
\node[below] at (0,-0.15) {$0$};
\node[right] at (3.4,0) {$x$};
\end{tikzpicture}
```
```

```ad-warning
Il meno davanti a una frazione
In $-\dfrac{x + 1}{2}$ il meno riguarda tutto il numeratore. Moltiplicando per $12$ ottieni $-6(x + 1) = -6x - 6$, non $-6x + 6$. Il MCM moltiplica anche i termini senza denominatore: in $\dfrac{x}{2} + 1 > x$, per $2$, si ottiene $x + 2 > 2x$.
```

```ad-tip
Controllare la soluzione
Prendi un numero dentro l'intervallo e uno fuori, e sostituiscili nella disequazione di partenza: il primo deve renderla vera, il secondo falsa. Nell'esempio 2, con $x = -4$ ottieni $2 + 20 = 22 \ge 17$, vera; con $x = 0$ ottieni $2 \ge 17$, falsa. Se sostituisci l'estremo, i due membri vengono uguali: con $x = -3$, $2 + 15 = 17$.
```

## Disequazioni sempre vere e mai vere

Se, riducendo i termini simili, il coefficiente di $x$ diventa $0$, a primo membro resta $0x$, che vale $0$ per ogni $x$. La disequazione diventa un confronto tra due numeri, vero o falso qualunque sia $x$:

| Forma normale | È vera se | Esempio |
|---|---|---|
| $0x > b$ | $b < 0$ | $0x > -1$: $S = \mathbb{R}$ |
| $0x \ge b$ | $b \le 0$ | $0x \ge 0$: $S = \mathbb{R}$ |
| $0x < b$ | $b > 0$ | $0x < 0$: $S = \emptyset$ |
| $0x \le b$ | $b \ge 0$ | $0x \le -2$: $S = \emptyset$ |

Quando il confronto è vero la disequazione è **sempre verificata**: ogni numero è soluzione, $S = \mathbb{R}$. Quando è falso la disequazione è **impossibile**: nessun numero è soluzione, $S = \emptyset$.

```ad-example
Esempio 5: una disequazione sempre verificata
$$2(x + 3) > 2x + 5$$

$$
\begin{gathered}
2x + 6 > 2x + 5 \\
\Rightarrow 2x - 2x > 5 - 6 \\
\Rightarrow 0x > -1
\end{gathered}
$$

Il primo membro vale $0$ per ogni $x$, e $0 > -1$ è vera. La disequazione è sempre verificata: $S = \mathbb{R}$.
```

```ad-example
Esempio 6: una disequazione impossibile
$$3(x - 1) + x < 4x - 3$$

$$
\begin{gathered}
3x - 3 + x < 4x - 3 \\
\Rightarrow 4x - 4x < -3 + 3 \\
\Rightarrow 0x < 0
\end{gathered}
$$

Il primo membro vale $0$, e $0 < 0$ è falsa. La disequazione è impossibile: $S = \emptyset$.

Con il segno $\le$, cioè $3(x - 1) + x \le 4x - 3$, si arriva a $0x \le 0$, e $0 \le 0$ è vera: $S = \mathbb{R}$.
```

```ad-warning
Confondere $>$ e $\ge$ quando $a = 0$
$0x > 0$ è impossibile, perché $0 > 0$ è falsa; $0x \ge 0$ è sempre verificata, perché $0 \ge 0$ è vera. E da $0x > b$ non si divide per $0$: si confronta $0$ con $b$.
```

## Problemi con le disequazioni

Un problema porta a una disequazione quando il testo chiede "almeno", "al massimo", "più di", "meno di", "non supera", "conviene". Il procedimento è quello dei [problemi con le equazioni](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/problemi-con-le-equazioni): scegli l'incognita, traduci il testo, risolvi e controlla quali soluzioni hanno senso nel problema.

| Nel testo | Disuguaglianza |
|---|---|
| almeno $a$, non meno di $a$ | $x \ge a$ |
| al massimo $a$, non supera $a$ | $x \le a$ |
| più di $a$ | $x > a$ |
| meno di $a$ | $x < a$ |

```ad-example
Esempio 7: il voto che serve
Nei primi due compiti di matematica hai preso $5$ e $6$. Che voto devi prendere nel terzo per avere la media almeno $6$?

Chiama $x$ il voto del terzo compito. La media dei tre voti deve essere almeno $6$:

$$\frac{5 + 6 + x}{3} \ge 6$$

Moltiplica per $3$, che è positivo:

$$
\begin{gathered}
11 + x \ge 18 \\
\Rightarrow x \ge 7
\end{gathered}
$$

Serve almeno $7$. Un voto però non supera $10$: le soluzioni del problema sono i voti $7 \le x \le 10$, cioè l'intervallo $[7, 10]$.

```tikz
% nome: problema-voto-intervallo
% alt: Retta dei numeri da 0 a 10 colorata tra 7 e 10, con due pallini pieni in 7 e in 10: i voti che danno la media almeno 6
% svg: problema-voto-intervallo-ec0150a7.svg 244x33
\begin{tikzpicture}[x=0.55cm]
\draw[black!70, ->] (0,0) -- (10.4,0);
\draw[blue!45, line width=2pt] (7,0) -- (10,0);
\draw (0,-0.1) -- (0,0.1);
\filldraw[thick] (7,0) circle (2.5pt);
\filldraw[thick] (10,0) circle (2.5pt);
\node[below] at (0,-0.15) {$0$};
\node[below] at (7,-0.15) {$7$};
\node[below] at (10,-0.15) {$10$};
\node[right] at (10.4,0) {$x$};
\end{tikzpicture}
```
```

```ad-example
Esempio 8: quale tariffa conviene
Una piscina offre due tariffe mensili: la tariffa A costa $40$ euro con ingressi liberi, la tariffa B costa $16$ euro più $3$ euro per ogni ingresso. Per quanti ingressi al mese la tariffa B costa meno della A?

Chiama $x$ il numero di ingressi in un mese. Con la tariffa B spendi $16 + 3x$ euro, e deve essere meno di $40$:

$$
\begin{gathered}
16 + 3x < 40 \\
\Rightarrow 3x < 24 \\
\Rightarrow x < 8
\end{gathered}
$$

Gli ingressi sono numeri naturali, quindi le soluzioni del problema non sono tutto l'intervallo $\mathopen{]}-\infty, 8\mathclose{[}$, ma solo i numeri $0, 1, 2, \ldots, 7$. La tariffa B conviene fino a $7$ ingressi al mese; con $8$ ingressi le due tariffe costano uguale ($16 + 24 = 40$).

```tikz
% nome: problema-tariffe-numeri-naturali
% alt: Retta dei numeri con otto pallini pieni sui numeri naturali da 0 a 7: le soluzioni naturali di x minore di 8
% svg: problema-tariffe-numeri-naturali-641d3878.svg 243x33
\begin{tikzpicture}[x=0.6cm]
\draw[black!70, ->] (-0.8,0) -- (9,0);
\foreach \k in {0,...,7} \filldraw[thick] (\k,0) circle (2.5pt);
\draw (8,-0.1) -- (8,0.1);
\foreach \k in {0,...,8} \node[below] at (\k,-0.15) {$\k$};
\node[right] at (9,0) {$x$};
\end{tikzpicture}
```
```

```ad-note
Dove si usano
Le disequazioni di primo grado sono il punto di partenza dei [sistemi di disequazioni](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/sistemi-di-disequazioni), dove si cercano i numeri che risolvono più disequazioni insieme (e dove si risolvono le doppie disequazioni come $1 < 2x + 3 < 7$), e dello [studio del segno](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte), che serve per le disequazioni con prodotti e frazioni.
```
