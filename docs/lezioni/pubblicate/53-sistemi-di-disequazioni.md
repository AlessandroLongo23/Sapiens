# Sistemi di disequazioni

Cerchi i numeri $x$ che rendono vere due condizioni insieme: il doppio di $x$ diminuito di $1$ deve superare $3$, e $x$ aumentato di $2$ deve restare sotto $7$. Ognuna delle due condizioni è una disequazione, e le due, prese insieme, formano un sistema. Le soluzioni sono i numeri che le soddisfano entrambe: qui tutti quelli compresi tra $2$ e $5$, esclusi gli estremi.

Per risolvere un sistema devi saper risolvere una disequazione di primo grado e scriverne le soluzioni come intervallo, come nella lezione [Disequazioni di primo grado e intervalli](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli). Gli intervalli si scrivono con le parentesi quadre, rivolte verso l'esterno per gli estremi esclusi: $\mathopen{]}2, 5\mathclose{[}$ sono i numeri tra $2$ e $5$, estremi esclusi, e $[2, 5]$ quelli tra $2$ e $5$, estremi compresi.

## Che cos'è un sistema di disequazioni

Un **sistema di disequazioni** è un insieme di due o più disequazioni nella stessa incognita, che devono essere vere contemporaneamente. Si scrive con una parentesi graffa che le raccoglie:

$$
\begin{cases}
2x - 1 > 3 \\
x + 2 < 7
\end{cases}
$$

Un numero è una **soluzione del sistema** se rende vere tutte le disequazioni. Il numero $3$ è una soluzione del sistema qui sopra, perché $2 \cdot 3 - 1 = 5 > 3$ e $3 + 2 = 5 < 7$. Il numero $6$ invece non lo è: rende vera la prima disequazione ($11 > 3$) ma non la seconda ($8 < 7$ è falso).

Se $S_1$ è l'insieme delle soluzioni della prima disequazione e $S_2$ quello della seconda, le soluzioni del sistema sono i numeri che stanno in $S_1$ e in $S_2$, cioè l'intersezione dei due insiemi:

$$S = S_1 \cap S_2$$

Il simbolo $\cap$ e le sue proprietà sono nella lezione [Intersezione insiemistica](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica). Con tre o più disequazioni vale lo stesso: $S = S_1 \cap S_2 \cap S_3$.

## Il grafico del sistema

Per trovare l'intersezione di due intervalli si usa un disegno, il **grafico del sistema**. Su una retta orientata segni, in ordine, i numeri che fanno da estremi agli intervalli; sopra la retta disegni una riga per ogni disequazione, una sotto l'altra, con una linea continua dove la disequazione è vera. Il pallino pieno indica un estremo compreso, quello vuoto un estremo escluso. Le linee tratteggiate verticali passano per gli estremi e dividono il disegno in strisce: la soluzione del sistema sono le strisce in cui ci sono le linee di tutte le righe.

Per il sistema di prima la prima disequazione dà $x > 2$ e la seconda $x < 5$. Le due linee si sovrappongono solo tra $2$ e $5$:

```tikz
% nome: sistema-disequazioni-intervallo-limitato
% alt: Grafico del sistema tra x maggiore di 2 e x minore di 5: due righe una sotto l'altra, la prima con la linea a destra di 2, la seconda a sinistra di 5, pallini vuoti, e colorata la striscia tra 2 e 5 dove ci sono tutte e due le linee
% svg: sistema-disequazioni-intervallo-limitato-757161fc.svg 252x76
\begin{tikzpicture}
\fill[orange!20] (1.6,-0.1) rectangle (3.2,1.35);
\draw[gray!70, dashed] (1.6,-0.1) -- (1.6,1.35);
\draw[gray!70, dashed] (3.2,-0.1) -- (3.2,1.35);
\draw[->] (0,0) -- (5.1,0) node[right] {$x$};
\draw (1.6,-0.08) -- (1.6,0.08);
\node[below] at (1.6,-0.1) {$2$};
\draw (3.2,-0.08) -- (3.2,0.08);
\node[below] at (3.2,-0.1) {$5$};
\node[left] at (0,1.10) {\small $x > 2$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (1.6,1.10) -- (4.8,1.10);
\draw[thick] (1.6,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x < 5$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0,0.55) -- (3.2,0.55);
\draw[thick] (3.2,0.55) circle (2.2pt);
\end{tikzpicture}
```

La soluzione è $S = \, \mathopen{]}2, 5\mathclose{[}$. I libri disegnano il grafico in modi un po' diversi (alcuni tratteggiano le parti in cui la disequazione è falsa, altri mettono la retta con i numeri in alto), ma si legge sempre allo stesso modo.

## Come si risolve

1. Risolvi ogni disequazione per conto suo, fino a una forma come $x > 2$ o $x \le 5$.
2. Segna sulla retta tutti gli estremi che hai trovato, in ordine crescente.
3. Disegna una riga per ogni disequazione, con la linea dove è vera e il pallino pieno o vuoto sugli estremi.
4. Cerca le strisce in cui ci sono le linee di tutte le righe: sono le soluzioni del sistema.
5. Scrivi $S$ come intervallo. Un estremo della soluzione è compreso solo se è compreso in tutte le disequazioni in cui compare.

Il passo 5 è quello in cui si sbaglia di più. Se in una riga il pallino su un estremo è vuoto, quell'estremo non è soluzione di quella disequazione, e quindi non può essere soluzione del sistema.

## Esempi svolti

```ad-example
Esempio 1: un intervallo limitato
$$
\begin{cases}
2x - 1 > 3 \\
x + 2 < 7
\end{cases}
$$

Prima disequazione: $2x > 4$, quindi $x > 2$. Seconda disequazione: $x < 5$.

Nel grafico del paragrafo precedente le due linee si sovrappongono tra $2$ e $5$, e tutti e due gli estremi hanno il pallino vuoto:

$$S = \, \mathopen{]}2, 5\mathclose{[}$$

Controllo con un numero della soluzione, per esempio $x = 4$: $2 \cdot 4 - 1 = 7 > 3$ e $4 + 2 = 6 < 7$.
```

```ad-example
Esempio 2: un cambio di verso e due disequazioni con lo stesso verso
$$
\begin{cases}
5 - 2x \le 1 \\
3x - 4 > x
\end{cases}
$$

Prima disequazione: $-2x \le -4$. Dividi per $-2$, che è negativo, e cambia il verso: $x \ge 2$.

Seconda disequazione: $3x - x > 4$, cioè $2x > 4$, quindi $x > 2$.

Tutte e due le soluzioni partono da $2$ e vanno verso destra, ma il $2$ è compreso nella prima ed escluso nella seconda:

```tikz
% nome: sistema-disequazioni-stesso-verso
% alt: Grafico del sistema tra x maggiore o uguale a 2 e x maggiore di 2: tutte e due le linee partono da 2 verso destra, la prima con il pallino pieno e la seconda con il pallino vuoto; è colorata la zona a destra di 2
% svg: sistema-disequazioni-stesso-verso-464a1147.svg 191x76
\begin{tikzpicture}
\fill[orange!20] (1.6,-0.1) rectangle (3.2,1.35);
\draw[gray!70, dashed] (1.6,-0.1) -- (1.6,1.35);
\draw[->] (0,0) -- (3.5,0) node[right] {$x$};
\draw (1.6,-0.08) -- (1.6,0.08);
\node[below] at (1.6,-0.1) {$2$};
\node[left] at (0,1.10) {\small $x \ge 2$};
\draw[blue!50, line width=1.8pt] (1.6,1.10) -- (3.2,1.10);
\fill (1.6,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x > 2$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (1.6,0.55) -- (3.2,0.55);
\draw[thick] (1.6,0.55) circle (2.2pt);
\end{tikzpicture}
```

Il $2$ non rende vera la seconda disequazione ($3 \cdot 2 - 4 = 2$, e $2 > 2$ è falso), quindi non è soluzione del sistema:

$$S = \, \mathopen{]}2, +\infty\mathclose{[}$$
```

```ad-warning
L'estremo compreso in una sola disequazione
Nell'esempio 2 chi guarda solo la prima riga scrive $S = [2, +\infty\mathclose{[}$. Un estremo è soluzione del sistema solo se ha il pallino pieno in tutte le righe in cui compare, e un solo pallino vuoto lo esclude.
```

```ad-example
Esempio 3: tre disequazioni, una con i denominatori
$$
\begin{cases}
\dfrac{x - 1}{2} - \dfrac{x}{3} < 1 \\[2mm]
2(x + 1) \ge x - 1 \\
4 - x \ge 0
\end{cases}
$$

Prima disequazione: il MCM dei denominatori è $6$. Moltiplica tutti i termini per $6$, che è positivo, e il verso resta lo stesso:

$$
\begin{gathered}
3(x - 1) - 2x < 6 \\
\Rightarrow 3x - 3 - 2x < 6 \\
\Rightarrow x < 9
\end{gathered}
$$

Seconda disequazione: $2x + 2 \ge x - 1$, quindi $x \ge -3$.

Terza disequazione: $-x \ge -4$, e cambiando il verso $x \le 4$.

Gli estremi da segnare sono $-3$, $4$ e $9$. Le tre linee si sovrappongono tra $-3$ e $4$, con il pallino pieno su tutti e due:

```tikz
% nome: sistema-tre-disequazioni
% alt: Grafico di un sistema di tre disequazioni: x minore di 9, x maggiore o uguale a meno 3, x minore o uguale a 4; le tre linee si sovrappongono tra meno 3 e 4, estremi inclusi, e quella striscia è colorata
% svg: sistema-tre-disequazioni-fa2a2bdf.svg 269x98
\begin{tikzpicture}
\fill[orange!20] (1.25,-0.1) rectangle (2.5,1.90);
\draw[gray!70, dashed] (1.25,-0.1) -- (1.25,1.90);
\draw[gray!70, dashed] (2.5,-0.1) -- (2.5,1.90);
\draw[gray!70, dashed] (3.75,-0.1) -- (3.75,1.90);
\draw[->] (0,0) -- (5.3,0) node[right] {$x$};
\draw (1.25,-0.08) -- (1.25,0.08);
\node[below] at (1.25,-0.1) {$-3$};
\draw (2.5,-0.08) -- (2.5,0.08);
\node[below] at (2.5,-0.1) {$4$};
\draw (3.75,-0.08) -- (3.75,0.08);
\node[below] at (3.75,-0.1) {$9$};
\node[left] at (0,1.65) {\small $x < 9$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0,1.65) -- (3.75,1.65);
\draw[thick] (3.75,1.65) circle (2.2pt);
\node[left] at (0,1.10) {\small $x \ge -3$};
\draw[blue!50, line width=1.8pt] (1.25,1.10) -- (5.0,1.10);
\fill (1.25,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x \le 4$};
\draw[blue!50, line width=1.8pt] (0,0.55) -- (2.5,0.55);
\fill (2.5,0.55) circle (2.2pt);
\end{tikzpicture}
```

$$S = [-3, 4]$$

La prima disequazione non restringe la soluzione: ogni numero tra $-3$ e $4$ è già minore di $9$. Va risolta lo stesso, perché prima di disegnare il grafico non lo puoi sapere.
```

```ad-warning
Disegnare le disequazioni prima di risolverle
Il grafico si disegna con le soluzioni, non con le disequazioni di partenza. In $5 - 2x \le 1$ il numero $2$ non si vede, e il verso cambia quando dividi per $-2$: chi disegna la riga senza aver risolto la disequazione mette la linea dalla parte sbagliata.
```

## Sistemi impossibili e sistemi con un solo punto

Se non c'è nessuna striscia in cui ci sono tutte le linee, il sistema non ha soluzioni: è **impossibile**, e $S = \emptyset$. Le soluzioni delle singole disequazioni possono esserci, ma non hanno numeri in comune.

```ad-example
Esempio 4: un sistema impossibile
$$
\begin{cases}
3x - 2 > 4 \\
2x + 1 \le 3
\end{cases}
$$

Prima disequazione: $3x > 6$, quindi $x > 2$. Seconda disequazione: $2x \le 2$, quindi $x \le 1$.

La prima linea sta a destra di $2$, la seconda a sinistra di $1$: non c'è nessuna striscia con tutte e due.

```tikz
% nome: sistema-disequazioni-impossibile
% alt: Grafico di un sistema impossibile: la linea di x maggiore di 2 sta a destra di 2, quella di x minore o uguale a 1 sta a sinistra di 1, e non c'è nessuna zona in cui si trovino tutte e due
% svg: sistema-disequazioni-impossibile-e7770c38.svg 252x76
\begin{tikzpicture}
\draw[gray!70, dashed] (1.6,-0.1) -- (1.6,1.35);
\draw[gray!70, dashed] (3.2,-0.1) -- (3.2,1.35);
\draw[->] (0,0) -- (5.1,0) node[right] {$x$};
\draw (1.6,-0.08) -- (1.6,0.08);
\node[below] at (1.6,-0.1) {$1$};
\draw (3.2,-0.08) -- (3.2,0.08);
\node[below] at (3.2,-0.1) {$2$};
\node[left] at (0,1.10) {\small $x > 2$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (3.2,1.10) -- (4.8,1.10);
\draw[thick] (3.2,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x \le 1$};
\draw[blue!50, line width=1.8pt] (0,0.55) -- (1.6,0.55);
\fill (1.6,0.55) circle (2.2pt);
\end{tikzpicture}
```

Nessun numero è insieme maggiore di $2$ e minore o uguale a $1$:

$$S = \emptyset$$
```

Può anche succedere che le due linee si tocchino in un punto solo. Allora la soluzione è quel numero, purché abbia il pallino pieno in tutte e due le righe.

```ad-example
Esempio 5: una sola soluzione
$$
\begin{cases}
2x - 3 \ge 1 \\
5 - x \ge 3
\end{cases}
$$

Prima disequazione: $2x \ge 4$, quindi $x \ge 2$. Seconda disequazione: $-x \ge -2$, e cambiando il verso $x \le 2$.

La prima linea parte da $2$ verso destra, la seconda arriva a $2$ da sinistra, e in $2$ il pallino è pieno in tutte e due le righe:

```tikz
% nome: sistema-disequazioni-un-solo-punto
% alt: Grafico di un sistema con una sola soluzione: la linea di x maggiore o uguale a 2 va a destra di 2, quella di x minore o uguale a 2 va a sinistra, tutte e due con il pallino pieno in 2, e la soluzione è il solo punto 2
% svg: sistema-disequazioni-un-solo-punto-ccc9caa8.svg 191x77
\begin{tikzpicture}
\draw[orange!45, line width=3pt] (1.6,-0.1) -- (1.6,1.35);
\draw[gray!70, dashed] (1.6,-0.1) -- (1.6,1.35);
\draw[->] (0,0) -- (3.5,0) node[right] {$x$};
\draw (1.6,-0.08) -- (1.6,0.08);
\node[below] at (1.6,-0.1) {$2$};
\node[left] at (0,1.10) {\small $x \ge 2$};
\draw[blue!50, line width=1.8pt] (1.6,1.10) -- (3.2,1.10);
\fill (1.6,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x \le 2$};
\draw[blue!50, line width=1.8pt] (0,0.55) -- (1.6,0.55);
\fill (1.6,0.55) circle (2.2pt);
\end{tikzpicture}
```

L'unico numero che è insieme maggiore o uguale a $2$ e minore o uguale a $2$ è il $2$:

$$S = \{2\}$$

Se la seconda disequazione fosse $5 - x > 3$, cioè $x < 2$, il pallino in $2$ sarebbe vuoto nella seconda riga, e il sistema sarebbe impossibile.
```

```ad-warning
Scrivere la soluzione come intervallo
Un solo numero si scrive tra parentesi graffe, $S = \{2\}$, non $[2, 2]$ e non $x = 2$ da solo. Un sistema impossibile ha $S = \emptyset$: scrivere $S = \{0\}$ o "$S = 0$" vuol dire che lo $0$ è una soluzione.
```

## Disequazioni sempre vere o mai vere

Nella forma normale una disequazione del sistema può diventare $0x > b$ o $0x < b$, con il coefficiente di $x$ uguale a zero: allora è vera per ogni numero oppure per nessuno, come nella lezione [Disequazioni di primo grado e intervalli](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli).

Una disequazione sempre vera ha come soluzioni tutti i numeri reali, $\mathbb{R}$, e nel grafico la sua riga è una linea che copre tutta la retta: non toglie niente, e la soluzione del sistema è quella delle altre disequazioni. Una disequazione mai vera, invece, rende impossibile tutto il sistema, perché nessun numero la soddisfa: $S = \emptyset$, qualunque siano le altre.

```ad-example
Esempio 6: una disequazione sempre vera
$$
\begin{cases}
2(x + 1) > 2x \\
x - 1 < 3
\end{cases}
$$

Prima disequazione: $2x + 2 > 2x$, cioè $2x - 2x > -2$, quindi $0x > -2$. Qualunque sia $x$, il primo membro vale $0$, e $0 > -2$ è vero: la disequazione è vera per ogni numero reale.

Seconda disequazione: $x < 4$.

```tikz
% nome: sistema-disequazione-sempre-vera
% alt: Grafico di un sistema in cui la prima disequazione è sempre vera: la prima linea copre tutta la retta, la seconda sta a sinistra di 4 con il pallino vuoto, e la soluzione è la zona a sinistra di 4
% svg: sistema-disequazione-sempre-vera-9122c5d0.svg 207x76
\begin{tikzpicture}
\fill[orange!20] (0,-0.1) rectangle (1.6,1.35);
\draw[gray!70, dashed] (1.6,-0.1) -- (1.6,1.35);
\draw[->] (0,0) -- (3.5,0) node[right] {$x$};
\draw (1.6,-0.08) -- (1.6,0.08);
\node[below] at (1.6,-0.1) {$4$};
\node[left] at (0,1.10) {\small $0x > -2$};
\draw[blue!50, line width=1.8pt] (0,1.10) -- (3.2,1.10);
\node[left] at (0,0.55) {\small $x < 4$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0,0.55) -- (1.6,0.55);
\draw[thick] (1.6,0.55) circle (2.2pt);
\end{tikzpicture}
```

La prima riga copre tutta la retta, quindi la soluzione è quella della seconda:

$$S = \, \mathopen{]}-\infty, 4\mathclose{[}$$

Se al posto della prima ci fosse $x + 3 > x + 5$, cioè $0x > 2$, che non è vera per nessun numero, il sistema sarebbe impossibile.
```

## Doppie disequazioni

Una scrittura come

$$-1 < 2x + 3 \le 7$$

si chiama **doppia disequazione**, e vuol dire che $2x + 3$ è maggiore di $-1$ e insieme minore o uguale a $7$. È quindi un sistema di due disequazioni:

$$
\begin{cases}
2x + 3 > -1 \\
2x + 3 \le 7
\end{cases}
$$

Prima disequazione: $2x > -4$, quindi $x > -2$. Seconda disequazione: $2x \le 4$, quindi $x \le 2$.

```tikz
% nome: doppia-disequazione-sistema
% alt: Grafico della doppia disequazione scritta come sistema: x maggiore di meno 2 con il pallino vuoto e x minore o uguale a 2 con il pallino pieno; è colorata la striscia tra meno 2 e 2
% svg: doppia-disequazione-sistema-cf7e015d.svg 261x77
\begin{tikzpicture}
\fill[orange!20] (1.6,-0.1) rectangle (3.2,1.35);
\draw[gray!70, dashed] (1.6,-0.1) -- (1.6,1.35);
\draw[gray!70, dashed] (3.2,-0.1) -- (3.2,1.35);
\draw[->] (0,0) -- (5.1,0) node[right] {$x$};
\draw (1.6,-0.08) -- (1.6,0.08);
\node[below] at (1.6,-0.1) {$-2$};
\draw (3.2,-0.08) -- (3.2,0.08);
\node[below] at (3.2,-0.1) {$2$};
\node[left] at (0,1.10) {\small $x > -2$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (1.6,1.10) -- (4.8,1.10);
\draw[thick] (1.6,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x \le 2$};
\draw[blue!50, line width=1.8pt] (0,0.55) -- (3.2,0.55);
\fill (3.2,0.55) circle (2.2pt);
\end{tikzpicture}
```

La soluzione è $S = \, \mathopen{]}-2, 2]$, che si può scrivere anche come doppia disequazione, $-2 < x \le 2$.

Quando la $x$ compare solo nel membro centrale, puoi anche lavorare sui tre membri insieme, con gli stessi principi di equivalenza: sottrai lo stesso numero da tutti e tre, dividi tutti e tre per lo stesso numero. Per la doppia disequazione di prima:

$$
\begin{gathered}
-1 < 2x + 3 \le 7 \\
\Rightarrow -1 - 3 < 2x \le 7 - 3 \\
\Rightarrow -4 < 2x \le 4 \\
\Rightarrow -2 < x \le 2
\end{gathered}
$$

Il risultato è lo stesso del sistema.

```ad-example
Esempio 7: una doppia disequazione con il coefficiente negativo
$$1 \le 3 - 2x < 7$$

La $x$ è solo nel membro centrale. Sottrai $3$ da tutti e tre i membri:

$$-2 \le -2x < 4$$

Dividi tutti e tre per $-2$. Il numero è negativo, quindi cambiano tutti e due i versi:

$$1 \ge x > -2$$

Letta da destra a sinistra, è $-2 < x \le 1$:

$$S = \, \mathopen{]}-2, 1]$$

Controllo sugli estremi: per $x = 1$ il membro centrale vale $3 - 2 = 1$, e $1 \le 1$ è vero, quindi $1$ è compreso; per $x = -2$ vale $3 + 4 = 7$, e $7 < 7$ è falso, quindi $-2$ è escluso.
```

```ad-warning
Cambiare il verso di un solo segno
Quando dividi i tre membri per un numero negativo, cambiano tutti e due i segni di disuguaglianza. Da $-2 \le -2x < 4$ chi cambia solo il primo scrive $1 \ge x < -2$, che non ha senso: devono diventare $1 \ge x > -2$.
```

Se la $x$ compare in più di un membro, lavorando sui tre membri insieme non riesci a lasciarla sola al centro: la doppia disequazione va risolta come sistema.

```ad-example
Esempio 8: la x in due membri
$$x - 1 < 2x + 3 < 5$$

Scrivi il sistema, con il membro centrale in tutte e due le disequazioni:

$$
\begin{cases}
x - 1 < 2x + 3 \\
2x + 3 < 5
\end{cases}
$$

Prima disequazione: $x - 2x < 3 + 1$, cioè $-x < 4$, e cambiando il verso $x > -4$. Seconda disequazione: $2x < 2$, quindi $x < 1$.

Le due linee si sovrappongono tra $-4$ e $1$, estremi esclusi:

$$S = \, \mathopen{]}-4, 1\mathclose{[}$$
```

```ad-warning
Le condizioni unite da "o"
Un sistema raccoglie condizioni unite da "e". Se un problema chiede i numeri minori di $-1$ o maggiori di $3$, le soluzioni sono l'[unione](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica) dei due intervalli, $\mathopen{]}-\infty, -1\mathclose{[} \, \cup \, \mathopen{]}3, +\infty\mathclose{[}$, e non l'intersezione, che è vuota. Per la stessa ragione non si scrive $3 < x < -1$: una doppia disequazione vuol dire "e", e nessun numero è insieme maggiore di $3$ e minore di $-1$.
```

## Errori frequenti

```ad-warning
Confondere il grafico del sistema con lo studio del segno
Nelle [disequazioni fratte](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte) si disegna una tabella che somiglia al grafico del sistema, ma si legge in un altro modo: lì si guarda il segno del prodotto in ogni striscia, qui si cercano le strisce in cui tutte le disequazioni sono vere. Un sistema non si risolve con la regola dei segni.
```

```ad-warning
Fermarsi alle soluzioni delle singole disequazioni
Trovare $x > 2$ e $x < 5$ non è ancora la soluzione del sistema. La risposta è una sola, $S = \, \mathopen{]}2, 5\mathclose{[}$, e si trova con l'intersezione.
```
