# Le lenti sottili

Una **lente** è un pezzo di vetro o di plastica trasparente limitato da due superfici curve, o da una curva e una piana. Gli occhiali, la lente d'ingrandimento, l'obiettivo di una macchina fotografica sono lenti, e anche dentro l'occhio c'è una lente, il cristallino. Una lente funziona per [rifrazione](/materiale/scuola-superiore/fisica/l-ottica-geometrica/la-rifrazione-e-la-riflessione-totale): i raggi che la attraversano si rifrangono due volte, entrando e uscendo, e a seconda della forma della lente si avvicinano o si allontanano tra loro. Qui si studiano le lenti sottili, quelle con lo spessore piccolo rispetto al raggio di curvatura delle loro superfici, in aria.

## Lenti convergenti e divergenti

Le lenti si dividono in due famiglie.

- Le **lenti convergenti** sono più spesse al centro che ai bordi (biconvesse, piano-convesse). Fanno convergere i raggi che le attraversano.
- Le **lenti divergenti** sono più sottili al centro che ai bordi (biconcave, piano-concave). Fanno divergere i raggi.

La retta che passa per il centro della lente ed è perpendicolare alla lente si chiama **asse ottico**; il punto in cui l'asse attraversa la lente è il **centro ottico**. Nei disegni una lente sottile si rappresenta con un segmento perpendicolare all'asse, con le punte di freccia verso l'esterno se è convergente e verso l'interno se è divergente.

## Il fuoco e la distanza focale

I raggi che arrivano su una lente convergente paralleli all'asse ottico escono tutti diretti verso uno stesso punto dell'asse, dall'altra parte della lente: il **fuoco** $F'$. Una lente ha due fuochi, uno per parte, alla stessa distanza dal centro ottico; questa distanza è la **distanza focale** $f$.

```tikz
% nome: lente-convergente-fuoco
% alt: Quattro raggi paralleli all'asse ottico arrivano da sinistra su una lente convergente e, dopo la lente, passano tutti per il fuoco F primo sull'asse a destra; il fuoco F è alla stessa distanza dall'altra parte, e la distanza focale f è segnata sotto l'asse
% svg: lente-convergente-fuoco-c2c4dd2e.svg 212x117
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thin, dash dot] (-2.5,0) -- (3,0);
\draw[raggio] (-2.3,0.8) -- (0,0.8);
\draw[raggio] (0,0.8) -- (1.5,0);
\draw[thick, orange!90!black] (1.5,0) -- (2.8,-0.693);
\draw[raggio] (-2.3,0.4) -- (0,0.4);
\draw[raggio] (0,0.4) -- (1.5,0);
\draw[thick, orange!90!black] (1.5,0) -- (2.8,-0.347);
\draw[raggio] (-2.3,-0.4) -- (0,-0.4);
\draw[raggio] (0,-0.4) -- (1.5,0);
\draw[thick, orange!90!black] (1.5,0) -- (2.8,0.347);
\draw[raggio] (-2.3,-0.8) -- (0,-0.8);
\draw[raggio] (0,-0.8) -- (1.5,0);
\draw[thick, orange!90!black] (1.5,0) -- (2.8,0.693);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (0,-1.1) -- (0,1.1);
\fill (1.5,0) circle (1.5pt) node[below] {$F'$};
\fill (-1.5,0) circle (1.5pt) node[below] {$F$};
\draw[{Stealth}-{Stealth}, thin] (0,-1.35) -- (1.5,-1.35) node[midway, below] {$f$};
\end{tikzpicture}
```

Una lente divergente fa il contrario: i raggi paralleli all'asse escono allargandosi, come se venissero tutti da un punto dell'asse che sta dalla parte da cui arriva la luce. Quel punto è il fuoco della lente divergente, e i raggi non ci passano davvero: ci passano i loro prolungamenti all'indietro, tratteggiati nella figura. Per questo si dice che il fuoco di una lente divergente è virtuale.

```tikz
% nome: lente-divergente-fuoco
% alt: Quattro raggi paralleli all'asse ottico arrivano da sinistra su una lente divergente e, dopo la lente, si allargano; i loro prolungamenti tratteggiati all'indietro si incontrano nel fuoco F, a sinistra della lente
% svg: lente-divergente-fuoco-54c3ce44.svg 182x137
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thin, dash dot] (-2.5,0) -- (2.2,0);
\draw[raggio] (-2.3,0.8) -- (0,0.8);
\draw[raggio] (0,0.8) -- (1.8,1.76);
\draw[raggio] (-2.3,0.4) -- (0,0.4);
\draw[raggio] (0,0.4) -- (1.8,0.88);
\draw[raggio] (-2.3,-0.4) -- (0,-0.4);
\draw[raggio] (0,-0.4) -- (1.8,-0.88);
\draw[raggio] (-2.3,-0.8) -- (0,-0.8);
\draw[raggio] (0,-0.8) -- (1.8,-1.76);
\draw[thin, dashed, orange!90!black] (0,0.8) -- (-1.5,0);
\draw[thin, dashed, orange!90!black] (0,0.4) -- (-1.5,0);
\draw[thin, dashed, orange!90!black] (0,-0.4) -- (-1.5,0);
\draw[thin, dashed, orange!90!black] (0,-0.8) -- (-1.5,0);
\draw[{Stealth[reversed]}-{Stealth[reversed]}, thick, blue!60!black] (0,-1.1) -- (0,1.1);
\fill (-1.5,0) circle (1.5pt) node[below] {$F$};
\fill (1.5,0) circle (1.5pt) node[below] {$F'$};
\end{tikzpicture}
```

Per distinguere le due lenti con le formule, la distanza focale ha un segno: positiva per le lenti convergenti, negativa per quelle divergenti. È la stessa convenzione degli specchi, dove $f$ è positiva per lo specchio concavo, come nella lezione [Gli specchi sferici](/materiale/scuola-superiore/fisica/l-ottica-geometrica/gli-specchi-sferici).

## Il potere diottrico

Una lente con la distanza focale corta piega molto i raggi: è una lente "forte". Per misurare quanto una lente fa convergere la luce si usa il **potere diottrico** $P$, l'inverso della distanza focale:

$$P = \frac{1}{f}$$

Con $f$ in metri, il potere si misura in **diottrie**, di simbolo $\text{D}$: $1\,\text{D} = 1\,\text{m}^{-1}$. Il potere ha lo stesso segno di $f$, positivo per le lenti convergenti e negativo per le divergenti. Sulle ricette degli occhiali c'è proprio il potere delle lenti, in diottrie.

```ad-example
Esempio 1: dalla distanza focale al potere, e ritorno
Una lente convergente ha la distanza focale di $25\,\text{cm}$. Quanto vale il suo potere? E che distanza focale ha una lente di $-2{,}5\,\text{D}$?

Prima si porta $f$ in metri, $25\,\text{cm} = 0{,}25\,\text{m}$:

$$P = \frac{1}{0{,}25\,\text{m}} = 4{,}0\,\text{D}$$

Per la seconda lente $f = \dfrac{1}{P} = \dfrac{1}{-2{,}5\,\text{D}} = -0{,}40\,\text{m} = -40\,\text{cm}$: il segno meno dice che è divergente.
```

```ad-warning
La distanza focale in centimetri
Le diottrie sono metri alla meno uno: la distanza focale va in metri. Con $f = 25\,\text{cm}$ scritto come $25$ si trova $P = 0{,}04$, cento volte troppo poco. Controllo veloce: le lenti degli occhiali hanno di solito qualche diottria, non qualche centesimo.
```

```ad-warning
Il segno della lente divergente
Una lente divergente ha $f$ e $P$ negativi. Se dimentichi il segno meno, nelle formule della prossima sezione la lente diventa convergente, e i risultati cambiano del tutto.
```

## La costruzione dell'immagine

Un oggetto davanti a una lente manda raggi in tutte le direzioni. Per trovare dove la lente forma l'immagine della punta dell'oggetto bastano due raggi di cui si sa dove vanno, i **raggi notevoli** di una lente convergente:

1. il raggio parallelo all'asse ottico esce passando per il fuoco $F'$, dall'altra parte della lente;
2. il raggio che passa per il centro ottico prosegue senza deviare;
3. il raggio che passa per il fuoco $F$, dalla parte dell'oggetto, esce parallelo all'asse.

Il terzo raggio serve da controllo: dove si incontrano i raggi, lì c'è l'immagine della punta, e l'immagine intera è una freccia che va dall'asse a quel punto.

```tikz
% nome: lente-costruzione-immagine-reale
% alt: Un oggetto a sinistra di una lente convergente, oltre il doppio della distanza focale; tre raggi notevoli partono dalla sua punta: quello parallelo all'asse passa poi per il fuoco F primo, quello per il centro ottico non devia, quello per il fuoco F esce parallelo; si incontrano a destra della lente, dove si forma l'immagine reale, capovolta e più piccola
% svg: lente-costruzione-immagine-reale-ef244a51.svg 320x102
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}, raggiob/.style={thick, blue!70!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thin, dash dot] (-4,0) -- (2.7,0);
\draw[raggio] (-3.6,1) -- (0,1);
\draw[raggio] (0,1) -- (2.4,-1);
\draw[raggiob] (-3.6,1) -- (0,0);
\draw[raggiob] (0,0) -- (2.4,-0.667);
\draw[raggio] (-3.6,1) -- (0,-0.5);
\draw[raggio] (0,-0.5) -- (2.4,-0.5);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (0,-1.3) -- (0,1.3);
\draw[-{Stealth}, very thick] (-3.6,0) -- (-3.6,1);
\draw[-{Stealth}, very thick, blue!70!black] (1.8,0) -- (1.8,-0.5);
\fill (-1.2,0) circle (1.5pt) node[below] {$F$};
\fill (1.2,0) circle (1.5pt) node[above] {$F'$};
\node[left] at (-3.6,0.5) {\small oggetto};
\node[right] at (1.85,-0.25) {\small immagine};
\end{tikzpicture}
```

Un'immagine come questa si chiama reale: i raggi luminosi ci passano davvero, e su uno schermo messo in quel punto si vede l'immagine. Se invece i raggi, dopo la lente, si allontanano l'uno dall'altro, non si incontrano mai; si incontrano i loro prolungamenti all'indietro, e l'occhio che riceve quei raggi vede un'immagine virtuale, che non si può raccogliere su uno schermo. Succede con una lente convergente quando l'oggetto sta tra il fuoco e la lente: è la lente d'ingrandimento.

```tikz
% nome: lente-immagine-virtuale
% alt: Un piccolo oggetto tra il fuoco F e una lente convergente; il raggio parallelo all'asse esce passando per il fuoco F primo e quello per il centro ottico non devia; dopo la lente i due raggi si allontanano, e i loro prolungamenti tratteggiati all'indietro si incontrano a sinistra, dove si forma l'immagine virtuale, diritta e più grande, tratteggiata
% svg: lente-immagine-virtuale-6f909887.svg 222x106
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}, raggiob/.style={thick, blue!70!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thin, dash dot] (-2.2,0) -- (2.6,0);
\draw[raggio] (-0.75,0.6) -- (0,0.6);
\draw[raggio] (0,0.6) -- (2.4,-0.36);
\draw[thin, dashed, orange!90!black] (0,0.6) -- (-1.5,1.2);
\draw[raggiob] (-0.75,0.6) -- (0,0);
\draw[raggiob] (0,0) -- (1.2,-0.96);
\draw[thin, dashed, blue!70!black] (-0.75,0.6) -- (-1.5,1.2);
\draw[{Stealth}-{Stealth}, thick, blue!60!black] (0,-1.3) -- (0,1.4);
\draw[-{Stealth}, very thick] (-0.75,0) -- (-0.75,0.6);
\draw[-{Stealth}, very thick, blue!70!black, dashed] (-1.5,0) -- (-1.5,1.2);
\fill (-1.5,0) circle (1.5pt) node[below] {$F$};
\fill (1.5,0) circle (1.5pt) node[below] {$F'$};
\node[left] at (-1.55,0.6) {\small immagine};
\end{tikzpicture}
```

Spostando l'oggetto lungo l'asse, l'immagine di una lente convergente cambia così:

| Oggetto | Immagine |
|---|---|
| oltre il doppio della distanza focale ($p > 2f$) | reale, capovolta, più piccola, tra $F'$ e $2f$ |
| a $2f$ | reale, capovolta, grande come l'oggetto, a $2f$ |
| tra $2f$ e $F$ | reale, capovolta, più grande, oltre $2f$ |
| nel fuoco | nessuna immagine: i raggi escono paralleli |
| tra il fuoco e la lente | virtuale, diritta, più grande, dalla parte dell'oggetto |

Per una lente divergente i raggi notevoli sono gli stessi, con i fuochi scambiati: il raggio parallelo all'asse esce come se venisse dal fuoco $F$ dalla parte dell'oggetto, il raggio diretto verso il fuoco $F'$ esce parallelo, il raggio per il centro non devia. L'immagine di un oggetto reale è sempre virtuale, diritta e più piccola, tra il fuoco e la lente.

```tikz
% nome: lente-divergente-immagine
% alt: Un oggetto a sinistra di una lente divergente; il raggio parallelo all'asse esce allontanandosi dall'asse, e il suo prolungamento tratteggiato all'indietro passa per il fuoco F; il raggio per il centro ottico non devia; l'immagine è dove il prolungamento incontra il raggio per il centro, tra il fuoco e la lente: virtuale, diritta e più piccola, tratteggiata
% svg: lente-divergente-immagine-ea3a79b4.svg 159x115
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}, raggiob/.style={thick, blue!70!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thin, dash dot] (-2.3,0) -- (1.8,0);
\draw[raggio] (-1.8,1) -- (0,1);
\draw[raggio] (0,1) -- (1.0,1.833);
\draw[thin, dashed, orange!90!black] (0,1) -- (-1.2,0);
\draw[raggiob] (-1.8,1) -- (0,0);
\draw[raggiob] (0,0) -- (1.5,-0.833);
\draw[{Stealth[reversed]}-{Stealth[reversed]}, thick, blue!60!black] (0,-1.1) -- (0,1.4);
\draw[-{Stealth}, very thick] (-1.8,0) -- (-1.8,1);
\draw[-{Stealth}, very thick, blue!70!black, dashed] (-0.72,0) -- (-0.72,0.4);
\fill (-1.2,0) circle (1.5pt) node[below] {$F$};
\fill (1.2,0) circle (1.5pt) node[below] {$F'$};
\end{tikzpicture}
```

## L'equazione delle lenti sottili

La posizione e la grandezza dell'immagine si possono anche calcolare. Si chiamano $p$ la distanza dell'oggetto dalla lente e $q$ la distanza dell'immagine dalla lente. Vale l'**equazione delle lenti sottili**, la stessa degli specchi sferici:

$$\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$$

con questa convenzione dei segni:

- $p$ è positiva per un oggetto reale, davanti alla lente;
- $q$ è positiva se l'immagine è reale, dall'altra parte della lente, e negativa se è virtuale, dalla parte dell'oggetto;
- $f$ è positiva per la lente convergente e negativa per la divergente.

L'**ingrandimento** $G$ è il rapporto tra l'altezza $h'$ dell'immagine e l'altezza $h$ dell'oggetto, e si calcola dalle distanze:

$$G = \frac{h'}{h} = -\frac{q}{p}$$

Se $G$ è positivo l'immagine è diritta, se è negativo è capovolta; se $|G| > 1$ è più grande dell'oggetto, se $|G| < 1$ è più piccola.

```ad-example
Esempio 2: un'immagine reale
Un oggetto alto $2{,}0\,\text{cm}$ sta a $30\,\text{cm}$ da una lente convergente con $f = 10\,\text{cm}$. Dove si forma l'immagine, e com'è?

Dall'equazione delle lenti:

$$\frac{1}{q} = \frac{1}{f} - \frac{1}{p} = \frac{1}{10} - \frac{1}{30} = \frac{3 - 1}{30} = \frac{1}{15} \qquad q = 15\,\text{cm}$$

Poi l'ingrandimento e l'altezza dell'immagine:

$$G = -\frac{15}{30} = -0{,}50 \qquad h' = G \cdot h = -0{,}50 \cdot 2{,}0\,\text{cm} = -1{,}0\,\text{cm}$$

$q$ è positiva: l'immagine è reale, a $15\,\text{cm}$ dietro la lente. $G$ è negativo e vale la metà: l'immagine è capovolta e alta la metà dell'oggetto. È la costruzione della figura qui sopra, disegnata in scala.
```

```ad-example
Esempio 3: l'oggetto tra F e 2F
Lo stesso oggetto viene avvicinato a $15\,\text{cm}$ dalla lente. Dove va l'immagine?

$$\frac{1}{q} = \frac{1}{10} - \frac{1}{15} = \frac{3 - 2}{30} = \frac{1}{30} \qquad q = 30\,\text{cm} \qquad G = -\frac{30}{15} = -2{,}0$$

L'immagine si è allontanata, a $30\,\text{cm}$, ed è diventata capovolta e grande il doppio dell'oggetto.
```

```ad-example
Esempio 4: un'immagine virtuale
L'oggetto viene portato a $5{,}0\,\text{cm}$ dalla lente, più vicino del fuoco. Dove si forma l'immagine?

$$\frac{1}{q} = \frac{1}{10} - \frac{1}{5{,}0} = \frac{1 - 2}{10} = -\frac{1}{10} \qquad q = -10\,\text{cm} \qquad G = -\frac{-10}{5{,}0} = 2{,}0$$

$q$ è negativa: l'immagine è virtuale, dalla stessa parte dell'oggetto, a $10\,\text{cm}$ dalla lente. $G = 2{,}0$ è positivo: diritta e grande il doppio. È la lente d'ingrandimento della figura qui sopra.
```

```ad-warning
L'inverso dimenticato
L'equazione dà $\frac{1}{q}$, non $q$. Nell'esempio 2, $\frac{1}{10} - \frac{1}{30} = \frac{1}{15}$, quindi $q = 15\,\text{cm}$; chi si ferma prima scrive $q = 0{,}067\,\text{cm}$. E non si può scrivere $q = f - p$: le distanze non si sommano, si sommano i loro inversi.
```

```ad-example
Esempio 5: una lente divergente
Un oggetto sta a $15\,\text{cm}$ da una lente divergente con la distanza focale di $10\,\text{cm}$. Trova l'immagine.

La lente è divergente, quindi $f = -10\,\text{cm}$:

$$\frac{1}{q} = \frac{1}{-10} - \frac{1}{15} = \frac{-3 - 2}{30} = -\frac{1}{6} \qquad q = -6{,}0\,\text{cm} \qquad G = -\frac{-6{,}0}{15} = 0{,}40$$

L'immagine è virtuale, a $6{,}0\,\text{cm}$ dalla lente dalla parte dell'oggetto, diritta e alta $0{,}40$ volte l'oggetto. Con $f = +10\,\text{cm}$, cioè dimenticando il segno, si troverebbe $q = 30\,\text{cm}$: un'immagine reale che una lente divergente non può dare.
```

Trascina l'oggetto lungo l'asse e guarda come cambia l'immagine: capovolta e reale finché l'oggetto è oltre il fuoco, diritta e virtuale quando entra tra il fuoco e la lente. Puoi anche cambiare la lente con una divergente.

```interattivo
% nome: lente-oggetto-immagine
% alt: Una lente sottile con i suoi due fuochi sull'asse ottico e un oggetto a forma di freccia che si trascina lungo l'asse; dalla punta dell'oggetto partono i raggi notevoli, e dove si incontrano, o si incontrano i loro prolungamenti tratteggiati, si forma l'immagine, reale e capovolta oppure virtuale e diritta; sotto sono scritti la distanza dell'oggetto p, la distanza dell'immagine q e l'ingrandimento G, e un interruttore cambia la lente da convergente a divergente
```
