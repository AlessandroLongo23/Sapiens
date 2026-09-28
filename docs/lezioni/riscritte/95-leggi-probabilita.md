# Probabilità della somma e dell'evento contrario

Per trovare la probabilità che lanciando due dadi esca almeno un $6$ si possono contare le coppie con almeno un $6$, ma è più veloce contare quelle senza nessun $6$ e togliere la loro probabilità da $1$: è la regola dell'evento contrario. La probabilità di pescare una carta di coppe o una figura, invece, non è la somma delle due probabilità, perché le figure di coppe verrebbero contate due volte: la regola dell'unione dice come correggere il conto.

Le definizioni di esperimento aleatorio, spazio campionario $\Omega$, evento, evento contrario, eventi incompatibili e probabilità classica sono in [Eventi e probabilità](/materiale/scuola-superiore/matematica/probabilita/eventi-e-probabilita). Negli esempi le monete e i dadi non sono truccati, e le carte sono quelle del mazzo di $40$ carte napoletane descritto in quella lezione: quattro semi (coppe, denari, bastoni, spade) di dieci carte ciascuno, con $4$ assi e $12$ figure.

## La probabilità dell'evento contrario

L'evento contrario $\overline{E}$ si verifica quando $E$ non si verifica. I suoi esiti sono quelli di $\Omega$ che non stanno in $E$: se $\Omega$ ha $n$ esiti equiprobabili ed $E$ ne ha $k$, $\overline{E}$ ne ha $n - k$, e

$$p(\overline{E}) = \dfrac{n - k}{n} = 1 - \dfrac{k}{n}$$

Quindi la probabilità dell'evento contrario è

$$p(\overline{E}) = 1 - p(E)$$

e allo stesso modo $p(E) = 1 - p(\overline{E})$. La somma delle probabilità di un evento e del suo contrario è sempre $1$.

```ad-example
Esempio 1: una carta che non è una figura
Si pesca una carta dal mazzo di $40$. L'evento $F$ = "esce una figura" ha $12$ casi favorevoli, quindi $p(F) = \dfrac{12}{40} = \dfrac{3}{10}$. L'evento "non esce una figura" è $\overline{F}$:
$$p(\overline{F}) = 1 - \dfrac{3}{10} = \dfrac{7}{10}$$
Controllo contando: le carte che non sono figure sono $40 - 12 = 28$, e $\dfrac{28}{40} = \dfrac{7}{10}$.
```

### Almeno uno

La regola dell'evento contrario serve soprattutto con gli eventi descritti da "almeno uno". Il contrario di "almeno uno" è "nessuno", e spesso gli esiti con "nessuno" si contano più in fretta.

```ad-example
Esempio 2: almeno un 6 con due dadi
Si lanciano due dadi: gli esiti equiprobabili sono le $36$ coppie della tabella. Sia $E$ l'evento "esce almeno un $6$". Il contrario $\overline{E}$ è "non esce nessun $6$": i due dadi danno tutti e due un numero da $1$ a $5$, e nella tabella queste coppie formano il quadrato di caselle bianche, $5$ righe per $5$ colonne, cioè $25$ caselle.

```tikz
% nome: due-dadi-almeno-un-sei
% alt: Tabella sei per sei dei lanci di due dadi: sono colorate le 11 caselle dell'ultima riga e dell'ultima colonna, in cui esce almeno un 6; le 25 caselle bianche, senza nessun 6, formano un quadrato cinque per cinque
% svg: due-dadi-almeno-un-sei-f220cf6a.svg 166x165
\begin{tikzpicture}
\fill[blue!20] (2.75,-0.55) rectangle (3.30,0.00);
\fill[blue!20] (2.75,-1.10) rectangle (3.30,-0.55);
\fill[blue!20] (2.75,-1.65) rectangle (3.30,-1.10);
\fill[blue!20] (2.75,-2.20) rectangle (3.30,-1.65);
\fill[blue!20] (2.75,-2.75) rectangle (3.30,-2.20);
\fill[blue!20] (0.00,-3.30) rectangle (0.55,-2.75);
\fill[blue!20] (0.55,-3.30) rectangle (1.10,-2.75);
\fill[blue!20] (1.10,-3.30) rectangle (1.65,-2.75);
\fill[blue!20] (1.65,-3.30) rectangle (2.20,-2.75);
\fill[blue!20] (2.20,-3.30) rectangle (2.75,-2.75);
\fill[blue!20] (2.75,-3.30) rectangle (3.30,-2.75);
\draw[black!60] (0.00,0) -- (0.00,-3.30);
\draw[black!60] (0,0.00) -- (3.30,0.00);
\draw[black!60] (0.55,0) -- (0.55,-3.30);
\draw[black!60] (0,-0.55) -- (3.30,-0.55);
\draw[black!60] (1.10,0) -- (1.10,-3.30);
\draw[black!60] (0,-1.10) -- (3.30,-1.10);
\draw[black!60] (1.65,0) -- (1.65,-3.30);
\draw[black!60] (0,-1.65) -- (3.30,-1.65);
\draw[black!60] (2.20,0) -- (2.20,-3.30);
\draw[black!60] (0,-2.20) -- (3.30,-2.20);
\draw[black!60] (2.75,0) -- (2.75,-3.30);
\draw[black!60] (0,-2.75) -- (3.30,-2.75);
\draw[black!60] (3.30,0) -- (3.30,-3.30);
\draw[black!60] (0,-3.30) -- (3.30,-3.30);
\node at (0.275,0.275) {\small $1$};
\node at (-0.275,-0.275) {\small $1$};
\node at (0.825,0.275) {\small $2$};
\node at (-0.275,-0.825) {\small $2$};
\node at (1.375,0.275) {\small $3$};
\node at (-0.275,-1.375) {\small $3$};
\node at (1.925,0.275) {\small $4$};
\node at (-0.275,-1.925) {\small $4$};
\node at (2.475,0.275) {\small $5$};
\node at (-0.275,-2.475) {\small $5$};
\node at (3.025,0.275) {\small $6$};
\node at (-0.275,-3.025) {\small $6$};
\node at (0.275,-0.275) {\footnotesize $2$};
\node at (0.825,-0.275) {\footnotesize $3$};
\node at (1.375,-0.275) {\footnotesize $4$};
\node at (1.925,-0.275) {\footnotesize $5$};
\node at (2.475,-0.275) {\footnotesize $6$};
\node at (3.025,-0.275) {\footnotesize $7$};
\node at (0.275,-0.825) {\footnotesize $3$};
\node at (0.825,-0.825) {\footnotesize $4$};
\node at (1.375,-0.825) {\footnotesize $5$};
\node at (1.925,-0.825) {\footnotesize $6$};
\node at (2.475,-0.825) {\footnotesize $7$};
\node at (3.025,-0.825) {\footnotesize $8$};
\node at (0.275,-1.375) {\footnotesize $4$};
\node at (0.825,-1.375) {\footnotesize $5$};
\node at (1.375,-1.375) {\footnotesize $6$};
\node at (1.925,-1.375) {\footnotesize $7$};
\node at (2.475,-1.375) {\footnotesize $8$};
\node at (3.025,-1.375) {\footnotesize $9$};
\node at (0.275,-1.925) {\footnotesize $5$};
\node at (0.825,-1.925) {\footnotesize $6$};
\node at (1.375,-1.925) {\footnotesize $7$};
\node at (1.925,-1.925) {\footnotesize $8$};
\node at (2.475,-1.925) {\footnotesize $9$};
\node at (3.025,-1.925) {\footnotesize $10$};
\node at (0.275,-2.475) {\footnotesize $6$};
\node at (0.825,-2.475) {\footnotesize $7$};
\node at (1.375,-2.475) {\footnotesize $8$};
\node at (1.925,-2.475) {\footnotesize $9$};
\node at (2.475,-2.475) {\footnotesize $10$};
\node at (3.025,-2.475) {\footnotesize $11$};
\node at (0.275,-3.025) {\footnotesize $7$};
\node at (0.825,-3.025) {\footnotesize $8$};
\node at (1.375,-3.025) {\footnotesize $9$};
\node at (1.925,-3.025) {\footnotesize $10$};
\node at (2.475,-3.025) {\footnotesize $11$};
\node at (3.025,-3.025) {\footnotesize $12$};
\node at (1.650,0.743) {\small secondo dado};
\node[rotate=90] at (-0.743,-1.650) {\small primo dado};
\end{tikzpicture}
```

$$
\begin{gathered}
p(\overline{E}) = \dfrac{25}{36} \\
p(E) = 1 - \dfrac{25}{36} = \dfrac{11}{36}
\end{gathered}
$$
Controllo contando le caselle colorate: $6$ nell'ultima riga, $6$ nell'ultima colonna, ma la casella $(6, 6)$ sta in tutte e due, quindi $6 + 6 - 1 = 11$.
```

```ad-example
Esempio 3: almeno una testa con tre monete
Si lanciano tre monete. Gli esiti equiprobabili sono $8$:
$$
\begin{gathered}
TTT, \ TTC, \ TCT, \ TCC \\
CTT, \ CTC, \ CCT, \ CCC
\end{gathered}
$$
Il contrario di "esce almeno una testa" è "non esce nessuna testa", che ha il solo esito $CCC$. Quindi
$$
\begin{aligned}
p(\text{almeno una testa}) &= 1 - \dfrac{1}{8} \\
&= \dfrac{7}{8}
\end{aligned}
$$
```

```ad-warning
Il contrario sbagliato
Il contrario di "esce almeno un $6$" è "non esce nessun $6$", non "esce esattamente un $6$" e nemmeno "escono due $6$": l'evento contrario deve contenere tutti gli esiti che non stanno nell'evento. Allo stesso modo, il contrario di "escono due $6$" è "almeno un dado non dà $6$", non "nessun $6$".
```

## La probabilità dell'unione

L'unione $A \cup B$, o somma logica, è l'evento "$A$ o $B$": si verifica quando si verifica almeno uno dei due, e anche quando si verificano tutti e due. La sua probabilità si calcola in modo diverso secondo che i due eventi siano incompatibili o compatibili.

### Eventi incompatibili

Se $A$ e $B$ sono incompatibili, cioè $A \cap B = \emptyset$, non hanno esiti in comune, e i casi favorevoli di $A \cup B$ sono quelli di $A$ più quelli di $B$. Quindi

$$p(A \cup B) = p(A) + p(B)$$

Nel lancio di un dado, gli eventi $A$ = "esce un numero minore di $3$" e $B$ = "esce un numero maggiore di $4$" sono incompatibili:

```tikz
% nome: eventi-incompatibili-dado-venn
% alt: Diagramma di Eulero-Venn del lancio di un dado con due eventi incompatibili: il cerchio A contiene 1 e 2, il cerchio B contiene 5 e 6, i cerchi sono separati e colorati tutti e due; 3 e 4 stanno fuori
% svg: eventi-incompatibili-dado-venn-803ad058.svg 231x155
\begin{tikzpicture}
\fill[blue!20] (-1.5,0) circle (1.1);
\fill[blue!20] (1.5,0) circle (1.1);
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$\Omega$};
\draw (-1.5,0) circle (1.1);
\draw (1.5,0) circle (1.1);
\node at (-1.5,0.5) {$A$};
\node at (1.5,0.5) {$B$};
\node at (-1.8,-0.25) {$1$};
\node at (-1.2,-0.25) {$2$};
\node at (1.2,-0.25) {$5$};
\node at (1.8,-0.25) {$6$};
\node at (-0.3,-1.6) {$3$};
\node at (0.3,-1.6) {$4$};
\end{tikzpicture}
```

$$p(A \cup B) = \dfrac{2}{6} + \dfrac{2}{6} = \dfrac{4}{6} = \dfrac{2}{3}$$

La regola vale anche per più di due eventi, purché siano incompatibili a due a due: la probabilità che si verifichi uno di essi è la somma delle loro probabilità. Per esempio, la probabilità che un dado dia $1$, $2$ o $3$ è $\dfrac{1}{6} + \dfrac{1}{6} + \dfrac{1}{6} = \dfrac{1}{2}$.

```ad-example
Esempio 4: un asso o un re
Si pesca una carta dal mazzo di $40$. Gli eventi "esce un asso" ed "esce un re" sono incompatibili, perché nessuna carta è insieme un asso e un re:
$$
\begin{aligned}
p(\text{asso o re}) &= \dfrac{4}{40} + \dfrac{4}{40} \\
&= \dfrac{8}{40} = \dfrac{1}{5}
\end{aligned}
$$
```

```ad-example
Esempio 5: una pallina rossa o verde
Un'urna contiene $3$ palline rosse, $5$ blu e $2$ verdi. Si estrae una pallina: "rossa" e "verde" sono eventi incompatibili, quindi
$$
\begin{aligned}
p(\text{rossa o verde}) &= \dfrac{3}{10} + \dfrac{2}{10} \\
&= \dfrac{1}{2}
\end{aligned}
$$
Si arriva allo stesso numero con l'evento contrario: estrarre una pallina rossa o verde vuol dire non estrarre una pallina blu, e $1 - \dfrac{5}{10} = \dfrac{1}{2}$.
```

### Eventi compatibili

Se $A$ e $B$ sono compatibili, sommando i casi favorevoli di $A$ e quelli di $B$ gli esiti comuni, cioè quelli di $A \cap B$, vengono contati due volte. Per contarli una volta sola si tolgono una volta, come nella formula per il numero di elementi dell'[unione di due insiemi](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica):

$$
\begin{aligned}
p(A \cup B) = {} & p(A) + p(B) \\
& - p(A \cap B)
\end{aligned}
$$

Questa formula vale per due eventi qualsiasi. Se sono incompatibili, $A \cap B = \emptyset$ e $p(A \cap B) = 0$, e si ritrova la formula precedente.

La probabilità dell'intersezione $A \cap B$ (il prodotto logico, "$A$ e $B$") in questa lezione si calcola contando gli esiti che stanno in tutti e due gli eventi. Esiste anche una formula per calcolarla, la probabilità composta, ma usa idee che vedrai più avanti.

```ad-example
Esempio 6: una carta di coppe o una figura
Si pesca una carta dal mazzo di $40$. Siano $C$ = "esce una carta di coppe" e $F$ = "esce una figura". Sono compatibili: le tre figure di coppe (fante, cavallo e re di coppe) stanno in tutti e due gli eventi.

```tikz
% nome: coppe-o-figura-diagramma-venn
% alt: Diagramma di Eulero-Venn delle 40 carte: il cerchio C delle carte di coppe e il cerchio F delle figure si sovrappongono; la zona comune colorata contiene 3 carte, le figure di coppe; 7 carte sono solo di coppe, 9 sono solo figure, 21 stanno fuori dai due cerchi
% svg: coppe-o-figura-diagramma-venn-430a171a.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$\Omega$};
\fill[blue!20] (0,-0.98) arc[start angle=-44.42, end angle=44.42, radius=1.4] arc[start angle=135.58, end angle=224.42, radius=1.4] -- cycle;
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$C$};
\node at (2.1,1.35) {$F$};
\node at (-1.5,0) {$7$};
\node at (0,0) {$3$};
\node at (1.5,0) {$9$};
\node at (2.5,-1.6) {$21$};
\end{tikzpicture}
```

Le probabilità sono
$$
\begin{gathered}
p(C) = \dfrac{10}{40}, \quad p(F) = \dfrac{12}{40} \\
p(C \cap F) = \dfrac{3}{40}
\end{gathered}
$$
e quindi
$$
\begin{aligned}
p(C \cup F) &= \dfrac{10}{40} + \dfrac{12}{40} - \dfrac{3}{40} \\
&= \dfrac{19}{40}
\end{aligned}
$$
Controllo contando nel diagramma: $7 + 3 + 9 = 19$ carte su $40$.
```

```ad-warning
Sommare le probabilità di eventi compatibili
Nel lancio di un dado, "esce un numero pari" ed "esce un numero maggiore di $3$" hanno probabilità $\dfrac{1}{2}$ ciascuno. Sommandole si trova $1$, come se l'evento "pari o maggiore di $3$" fosse certo; ma con $1$ o con $3$ non si verifica. I due eventi hanno in comune $4$ e $6$, contati due volte: gli esiti favorevoli sono $2$, $4$, $5$, $6$, e la probabilità è $\dfrac{4}{6} = \dfrac{2}{3}$. Prima di sommare, controlla sempre se gli eventi hanno esiti in comune.
```

```ad-example
Esempio 7: un doppio o somma 8
Si lanciano due dadi. Siano $A$ = "esce un doppio", cioè due numeri uguali, e $B$ = "la somma è $8$". Nella tabella, i doppi sono le $6$ caselle della diagonale (in blu) e le coppie con somma $8$ sono $5$ (in rosso): $(2, 6)$, $(3, 5)$, $(4, 4)$, $(5, 3)$, $(6, 2)$. La casella $(4, 4)$ sta in tutti e due gli eventi.

```tikz
% nome: due-dadi-doppio-o-somma-otto
% alt: Tabella sei per sei dei lanci di due dadi con le somme: in blu le sei caselle della diagonale, i doppi; in rosso le cinque caselle con somma 8; la casella del doppio 4, che ha somma 8, è metà blu e metà rossa
% svg: due-dadi-doppio-o-somma-otto-821928c3.svg 166x165
\begin{tikzpicture}
\fill[blue!20] (0.00,-0.55) rectangle (0.55,0.00);
\fill[blue!20] (0.55,-1.10) rectangle (1.10,-0.55);
\fill[red!20] (2.75,-1.10) rectangle (3.30,-0.55);
\fill[blue!20] (1.10,-1.65) rectangle (1.65,-1.10);
\fill[red!20] (2.20,-1.65) rectangle (2.75,-1.10);
\fill[red!20] (1.10,-2.75) rectangle (1.65,-2.20);
\fill[blue!20] (2.20,-2.75) rectangle (2.75,-2.20);
\fill[red!20] (0.55,-3.30) rectangle (1.10,-2.75);
\fill[blue!20] (2.75,-3.30) rectangle (3.30,-2.75);
\fill[blue!20] (1.65,-2.20) -- (2.20,-2.20) -- (1.65,-1.65) -- cycle;
\fill[red!20] (2.20,-1.65) -- (1.65,-1.65) -- (2.20,-2.20) -- cycle;
\draw[black!60] (0.00,0) -- (0.00,-3.30);
\draw[black!60] (0,0.00) -- (3.30,0.00);
\draw[black!60] (0.55,0) -- (0.55,-3.30);
\draw[black!60] (0,-0.55) -- (3.30,-0.55);
\draw[black!60] (1.10,0) -- (1.10,-3.30);
\draw[black!60] (0,-1.10) -- (3.30,-1.10);
\draw[black!60] (1.65,0) -- (1.65,-3.30);
\draw[black!60] (0,-1.65) -- (3.30,-1.65);
\draw[black!60] (2.20,0) -- (2.20,-3.30);
\draw[black!60] (0,-2.20) -- (3.30,-2.20);
\draw[black!60] (2.75,0) -- (2.75,-3.30);
\draw[black!60] (0,-2.75) -- (3.30,-2.75);
\draw[black!60] (3.30,0) -- (3.30,-3.30);
\draw[black!60] (0,-3.30) -- (3.30,-3.30);
\node at (0.275,0.275) {\small $1$};
\node at (-0.275,-0.275) {\small $1$};
\node at (0.825,0.275) {\small $2$};
\node at (-0.275,-0.825) {\small $2$};
\node at (1.375,0.275) {\small $3$};
\node at (-0.275,-1.375) {\small $3$};
\node at (1.925,0.275) {\small $4$};
\node at (-0.275,-1.925) {\small $4$};
\node at (2.475,0.275) {\small $5$};
\node at (-0.275,-2.475) {\small $5$};
\node at (3.025,0.275) {\small $6$};
\node at (-0.275,-3.025) {\small $6$};
\node at (0.275,-0.275) {\footnotesize $2$};
\node at (0.825,-0.275) {\footnotesize $3$};
\node at (1.375,-0.275) {\footnotesize $4$};
\node at (1.925,-0.275) {\footnotesize $5$};
\node at (2.475,-0.275) {\footnotesize $6$};
\node at (3.025,-0.275) {\footnotesize $7$};
\node at (0.275,-0.825) {\footnotesize $3$};
\node at (0.825,-0.825) {\footnotesize $4$};
\node at (1.375,-0.825) {\footnotesize $5$};
\node at (1.925,-0.825) {\footnotesize $6$};
\node at (2.475,-0.825) {\footnotesize $7$};
\node at (3.025,-0.825) {\footnotesize $8$};
\node at (0.275,-1.375) {\footnotesize $4$};
\node at (0.825,-1.375) {\footnotesize $5$};
\node at (1.375,-1.375) {\footnotesize $6$};
\node at (1.925,-1.375) {\footnotesize $7$};
\node at (2.475,-1.375) {\footnotesize $8$};
\node at (3.025,-1.375) {\footnotesize $9$};
\node at (0.275,-1.925) {\footnotesize $5$};
\node at (0.825,-1.925) {\footnotesize $6$};
\node at (1.375,-1.925) {\footnotesize $7$};
\node at (1.925,-1.925) {\footnotesize $8$};
\node at (2.475,-1.925) {\footnotesize $9$};
\node at (3.025,-1.925) {\footnotesize $10$};
\node at (0.275,-2.475) {\footnotesize $6$};
\node at (0.825,-2.475) {\footnotesize $7$};
\node at (1.375,-2.475) {\footnotesize $8$};
\node at (1.925,-2.475) {\footnotesize $9$};
\node at (2.475,-2.475) {\footnotesize $10$};
\node at (3.025,-2.475) {\footnotesize $11$};
\node at (0.275,-3.025) {\footnotesize $7$};
\node at (0.825,-3.025) {\footnotesize $8$};
\node at (1.375,-3.025) {\footnotesize $9$};
\node at (1.925,-3.025) {\footnotesize $10$};
\node at (2.475,-3.025) {\footnotesize $11$};
\node at (3.025,-3.025) {\footnotesize $12$};
\node at (1.650,0.743) {\small secondo dado};
\node[rotate=90] at (-0.743,-1.650) {\small primo dado};
\end{tikzpicture}
```

$$
\begin{aligned}
p(A \cup B) &= \dfrac{6}{36} + \dfrac{5}{36} - \dfrac{1}{36} \\
&= \dfrac{10}{36} = \dfrac{5}{18}
\end{aligned}
$$
```

Nella tabella qui sotto scegli tu i due eventi. Con «quante volte è contata» ogni casella colorata mostra quante volte entra nella somma dei casi di $A$ e di $B$: le caselle con il $2$ sono proprio quelle di $A \cap B$. Con "il primo dado dà $6$" e "il secondo dado dà $6$" ritrovi il conto $6 + 6 - 1 = 11$ dell'Esempio 2.

```interattivo
% nome: due-dadi-unione-eventi
% alt: Tabella sei per sei dei lanci di due dadi, con la somma in ogni casella. Si scelgono due eventi, come esce un doppio, la somma è 8, esce almeno un 6, il primo dado dà 6: le caselle di A sono blu, quelle di B rosse e quelle comuni metà blu e metà rosse. Si può scrivere in ogni casella colorata quante volte è contata sommando i casi di A e di B, e sotto la formula p(A ∪ B) = p(A) + p(B) − p(A ∩ B) si compila con i conteggi, per esempio 6/36 + 5/36 − 1/36 = 10/36 = 5/18 per un doppio o somma 8
```

```ad-example
Esempio 8: una tabella a doppia entrata
In una classe di $25$ studenti ci sono $12$ ragazze e $13$ ragazzi; portano gli occhiali $10$ studenti, di cui $4$ ragazze. Si sceglie a caso uno studente. Qual è la probabilità che sia una ragazza o porti gli occhiali? E che non sia né una ragazza né porti gli occhiali?

Conviene completare la tabella: i ragazzi con gli occhiali sono $10 - 4 = 6$, le ragazze senza occhiali $12 - 4 = 8$, i ragazzi senza occhiali $13 - 6 = 7$.

|  | Occhiali | Senza occhiali | Totale |
|---|---|---|---|
| Ragazze | $4$ | $8$ | $12$ |
| Ragazzi | $6$ | $7$ | $13$ |
| Totale | $10$ | $15$ | $25$ |

Siano $R$ = "è una ragazza" e $O$ = "porta gli occhiali". Sono compatibili, e $R \cap O$ sono le $4$ ragazze con gli occhiali:
$$
\begin{aligned}
p(R \cup O) &= \dfrac{12}{25} + \dfrac{10}{25} - \dfrac{4}{25} \\
&= \dfrac{18}{25}
\end{aligned}
$$
"Né una ragazza né con gli occhiali" è il contrario di "una ragazza o con gli occhiali":
$$p = 1 - \dfrac{18}{25} = \dfrac{7}{25}$$
Controllo nella tabella: i ragazzi senza occhiali sono $7$.
```

## Incompatibili non vuol dire contrari

Un evento e il suo contrario sono sempre incompatibili, ma due eventi incompatibili non sono per forza uno il contrario dell'altro. Nel lancio di un dado, "esce $1$" ed "esce $2$" sono incompatibili, ma non contrari: può uscire $3$, e allora non si verifica nessuno dei due. Infatti le loro probabilità, $\dfrac{1}{6}$ e $\dfrac{1}{6}$, non danno $1$. Due eventi sono contrari quando sono incompatibili e la loro unione è $\Omega$.

```ad-warning
Incompatibili non vuol dire indipendenti
Due eventi incompatibili non possono verificarsi insieme. Essere indipendenti è un'altra cosa, che riguarda il modo in cui un evento cambia la probabilità dell'altro: la studierai più avanti, con la probabilità composta. Non usare le due parole come sinonimi.
```

## Come si risolve un problema

1. Scrivi lo spazio campionario e controlla che gli esiti siano equiprobabili.
2. Traduci la frase in eventi: "o" è l'unione, "e" è l'intersezione, "non" e "nessuno" portano all'evento contrario.
3. Se la frase dice "almeno uno", valuta se è più facile contare il contrario, "nessuno".
4. Per un'unione, controlla se gli eventi hanno esiti in comune: se non ne hanno sommi le probabilità, se ne hanno togli la probabilità dell'intersezione.
5. Controlla che il risultato stia tra $0$ e $1$.

| Nella frase | Evento | Probabilità |
|---|---|---|
| non $E$ | $\overline{E}$ | $1 - p(E)$ |
| $A$ o $B$, incompatibili | $A \cup B$ | $p(A) + p(B)$ |
| $A$ o $B$, compatibili | $A \cup B$ | $p(A) + p(B) - p(A \cap B)$ |
| $A$ e $B$ | $A \cap B$ | si contano gli esiti comuni |
