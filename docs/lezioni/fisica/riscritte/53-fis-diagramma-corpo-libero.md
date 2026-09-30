# Il diagramma delle forze

Per usare il [secondo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica) serve la forza totale su un corpo, e per trovarla bisogna sapere quali forze agiscono su quel corpo, tutte e solo quelle. Il diagramma delle forze, o diagramma di corpo libero, è il disegno che le mette in fila: è il primo passo di quasi ogni problema di dinamica, e la maggior parte degli errori nasce da una forza dimenticata o da una forza che non c'è.

## Come si disegna

Il **diagramma delle forze** di un corpo è un disegno in cui il corpo è isolato da tutto il resto, ridotto a un punto o a un blocco, e da esso partono le frecce di tutte le forze che agiscono su di lui. Si costruisce così:

1. Si sceglie il corpo e lo si disegna da solo, senza il pavimento, le funi e gli altri corpi intorno.
2. Si disegna il peso $\vec P$, verticale verso il basso: è la forza a distanza che c'è sempre.
3. Si cercano le forze di contatto, guardando una per una le cose che toccano il corpo. Un piano d'appoggio dà la [reazione vincolare](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari) $\vec F_v$, perpendicolare al piano, e l'[attrito](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito), parallelo al piano; una fune tesa dà la tensione $\vec T$, lungo la fune e verso di essa; una mano che spinge o una molla danno la loro forza.
4. Si disegnano tutte le frecce dal centro del corpo, con le lunghezze in scala quando si conoscono i moduli, e si dà un nome a ciascuna.

Una cosa che non tocca il corpo, a parte la Terra con il peso, non gli fa nessuna forza.

```tikz
% nome: diagramma-forze-fune-inclinata
% alt: A sinistra una cassa su un pavimento, tirata da una fune inclinata di 30 gradi verso destra. A destra il suo diagramma delle forze: la cassa è un punto, da cui partono il peso P verso il basso, la reazione del pavimento Fv verso l'alto, più corta del peso, la forza F della fune inclinata di 30 gradi e l'attrito dinamico Fd verso sinistra, corto; scala di 1 centimetro per 40 newton
% svg: diagramma-forze-fune-inclinata-92dfc7cf.svg 303x225
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (3.3,0);
\foreach \x in {-0.15,0,...,3.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0.3,0) rectangle (1.5,0.8);
\draw (1.5,0.4) -- (2.9,1.208);
\draw (2.1,0.4) arc[start angle=0, end angle=30, radius=0.6];
\draw[dashed, thin] (1.5,0.4) -- (2.3,0.4);
\node at (2.35,0.58) {\small $30^\circ$};
\draw[-{Stealth}, thick, red] (6,0.4) -- (6,-2.54) node[right] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (6,0.4) -- (6,2.715) node[right] {$\vec{F}_v$};
\draw[-{Stealth}, thick, red] (6,0.4) -- (7.083,1.025) node[right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (6,0.4) -- (5.537,0.4) node[left] {$\vec{F}_d$};
\fill (6,0.4) circle (1.5pt);
\end{tikzpicture}
```

```ad-warning
Forze che non ci sono
Nel diagramma non va la "forza del moto": un corpo che si muove non ha una forza che lo porta avanti, se nessun corpo lo spinge (lo dice il [primo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali)). Non va il prodotto $m\,\vec a$, che è il risultato delle forze e non una forza in più. E non vanno le forze che il corpo esercita sugli altri, come la spinta della cassa sul pavimento: agiscono su un altro corpo, e sono le reazioni del [terzo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica).
```

Nella figura qui sotto costruisci tu il diagramma: trascini sul corpo le forze che agiscono su di lui, e la figura ti dice se ne manca qualcuna o se ce n'è una di troppo.

```interattivo
% nome: diagramma-forze-costruisci
% alt: Tre situazioni da scegliere: un libro fermo su un tavolo, una cassa trascinata sul pavimento con una fune orizzontale, una lampada appesa al soffitto con un filo. Sotto il disegno c'è una fila di forze, alcune giuste e alcune sbagliate, come la forza del moto o la forza del libro sul tavolo; lo studente le trascina sul corpo, dove diventano frecce che partono dal centro, e la figura dice se il diagramma è completo, se manca una forza o se ce n'è una che non agisce sul corpo
```

## La scelta degli assi

Per sommare le forze conviene scomporle lungo due assi perpendicolari, come nella lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore). Gli assi si scelgono in modo che uno dei due abbia la direzione dell'accelerazione, se si conosce, o del moto: per un corpo che si muove su un pavimento l'asse $x$ è orizzontale, nel verso del moto, e l'asse $y$ verticale; per un ascensore l'asse $y$ è verticale, verso l'alto. Con questa scelta l'accelerazione ha una componente sola, e lungo l'altro asse le forze si bilanciano.

## Il secondo principio per componenti

L'uguaglianza tra vettori $\vec F_{tot} = m\,\vec a$ equivale a due uguaglianze tra numeri, una per asse:

$$F_{tot,x} = m\,a_x \qquad\qquad F_{tot,y} = m\,a_y$$

$F_{tot,x}$ è la somma delle componenti $x$ di tutte le forze, ognuna con il suo segno: positivo se la componente ha il verso dell'asse, negativo se ha il verso opposto. Lo stesso per $y$. Se il corpo non si muove lungo un asse, lungo quell'asse l'accelerazione è zero e la somma delle componenti è zero, come nell'[equilibrio per componenti](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari).

Il procedimento completo:

1. Si disegna il diagramma delle forze del corpo.
2. Si scelgono gli assi, uno nella direzione dell'accelerazione.
3. Si scompongono le forze che non sono lungo gli assi.
4. Si scrive il secondo principio lungo ciascun asse, con i segni.
5. Si risolve: di solito l'asse senza accelerazione dà la reazione vincolare, e l'altro l'accelerazione.

```ad-example
Esempio 1: una cassa tirata con una fune inclinata
Una cassa di $12\,\text{kg}$ è tirata sul pavimento con una fune inclinata di $30^\circ$ sull'orizzontale, con una forza di $50\,\text{N}$. Il coefficiente di attrito dinamico è $\mu_d = 0{,}20$. Quanto vale l'accelerazione della cassa?

Il diagramma è quello della figura sopra: il peso $\vec P$, la reazione del pavimento $\vec F_v$, la forza della fune $\vec F$ e l'attrito dinamico $\vec F_d$. L'asse $x$ è orizzontale nel verso del moto, l'asse $y$ verticale verso l'alto. Il peso è $P = 12\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 117{,}6\,\text{N}$, e la forza della fune ha le componenti

$$F_x = 50\,\text{N} \cdot \cos 30^\circ = 43{,}30\ldots\,\text{N} \qquad F_y = 50\,\text{N} \cdot \sin 30^\circ = 25\,\text{N}$$

```tikz
% nome: fune-inclinata-componenti
% alt: Il diagramma delle forze della cassa con gli assi x e y. Dal punto partono il peso P verso il basso, la reazione Fv verso l'alto, l'attrito Fd verso sinistra e la forza F della fune a 30 gradi, con le proiezioni tratteggiate sugli assi che segnano le sue componenti Fx e Fy; scala di 1 centimetro per 40 newton
% svg: fune-inclinata-componenti-4a715cba.svg 141x256
\begin{tikzpicture}
\draw[->] (-1.2,0) -- (2,0) node[right] {$x$};
\draw[->] (0,-3.2) -- (0,3) node[above] {$y$};
\draw[dashed, thin] (1.083,0.625) -- (1.083,0);
\draw[dashed, thin] (1.083,0.625) -- (0,0.625);
\node[below] at (1.083,0) {$F_x$};
\node[left] at (0,0.625) {$F_y$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,-2.94) node[right] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,2.315) node[right] {$\vec{F}_v$};
\draw[-{Stealth}, thick, red] (0,0) -- (1.083,0.625) node[above right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (0,0) -- (-0.463,0) node[above left] {$\vec{F}_d$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

Lungo $y$ la cassa non si muove, quindi $a_y = 0$:

$$F_v + F_y - P = 0 \quad\Rightarrow\quad F_v = P - F_y = 117{,}6\,\text{N} - 25\,\text{N} = 92{,}6\,\text{N}$$

La fune solleva un po' la cassa, e il pavimento la spinge meno del peso. La forza premente è $F_\perp = F_v$, e l'attrito dinamico

$$F_d = \mu_d\,F_v = 0{,}20 \cdot 92{,}6\,\text{N} = 18{,}52\,\text{N}$$

Lungo $x$:

$$F_x - F_d = m\,a_x \quad\Rightarrow\quad a_x = \frac{43{,}30\,\text{N} - 18{,}52\,\text{N}}{12\,\text{kg}} = 2{,}06\ldots\,\text{m/s}^2 \approx 2{,}1\,\text{m/s}^2$$
```

```ad-warning
La reazione del pavimento non è sempre il peso
Con una fune inclinata verso l'alto la reazione del pavimento è $P - F\sin\alpha$, più piccola del peso; con una spinta inclinata verso il basso è $P + F\sin\alpha$. Chi scrive $F_v = P$ senza guardare il diagramma sbaglia l'attrito: nell'esempio 1 troverebbe $F_d = 23{,}5\,\text{N}$ invece di $18{,}5\,\text{N}$.
```

## L'ascensore e il peso apparente

Una persona di $60\,\text{kg}$ sta su una bilancia pesapersone dentro un ascensore. Sulla persona agiscono due forze: il peso $\vec P$, verso il basso, e la reazione $\vec F_v$ della bilancia, verso l'alto. La bilancia misura la forza con cui la persona la preme, che per il terzo principio ha lo stesso modulo di $F_v$; la sua scala è graduata in chilogrammi, e segna $F_v / g$. Questa forza si chiama **peso apparente**: è uguale al peso solo se l'ascensore non accelera.

Con l'asse $y$ verticale verso l'alto, il secondo principio per la persona è

$$F_v - P = m\,a \quad\Rightarrow\quad F_v = m\,(g + a)$$

dove $a$ è la componente verticale dell'accelerazione: positiva se l'accelerazione è verso l'alto, negativa se è verso il basso.

```tikz
% nome: ascensore-peso-apparente
% alt: Tre ascensori con una persona sopra una bilancia, e accanto a ciascuno il diagramma delle forze sulla persona, il peso P verso il basso e la reazione della bilancia Fv verso l'alto; scala di 1 centimetro per 400 newton. Nel primo l'accelerazione è verso l'alto e Fv è più lunga del peso; nel secondo l'ascensore va a velocità costante e le due frecce sono uguali; nel terzo l'accelerazione è verso il basso e Fv è più corta del peso
% svg: ascensore-peso-apparente-e0174202.svg 375x159
\begin{tikzpicture}
\foreach \X/\Fv in {0/1.695, 3.2/1.47, 6.4/1.245} {
  \draw[thick] (\X,0) rectangle (\X+1.2,2.4);
  \draw (\X+0.6,2.4) -- (\X+0.6,2.9);
  \draw[thick, fill=gray!20] (\X+0.2,0) rectangle (\X+1,0.15);
  \draw[thick, fill=blue!10] (\X+0.35,0.15) rectangle (\X+0.85,1.15);
  \draw[-{Stealth}, thick, red] (\X+2.05,1.2) -- (\X+2.05,1.2+\Fv) node[right] {$\vec{F}_v$};
  \draw[-{Stealth}, thick, red] (\X+2.05,1.2) -- (\X+2.05,-0.27) node[right] {$\vec{P}$};
  \fill (\X+2.05,1.2) circle (1.5pt);
}
\draw[-{Stealth}, thick, green!50!black] (-0.3,0.8) -- (-0.3,1.8) node[left] {$\vec{a}$};
\draw[-{Stealth}, thick, green!50!black] (6.1,1.8) -- (6.1,0.8) node[left] {$\vec{a}$};
\node[below] at (0.9,-0.4) {\small accelera in su};
\node[below] at (4.1,-0.4) {\small velocità costante};
\node[below] at (7.3,-0.4) {\small accelera in giù};
\end{tikzpicture}
```

```ad-example
Esempio 2: la bilancia nell'ascensore
La persona di $60\,\text{kg}$ è nell'ascensore, che accelera con $1{,}5\,\text{m/s}^2$. Quanto segna la bilancia quando l'accelerazione è verso l'alto? E quando è verso il basso?

Con l'accelerazione verso l'alto, $a = +1{,}5\,\text{m/s}^2$:

$$F_v = m\,(g + a) = 60\,\text{kg} \cdot (9{,}8 + 1{,}5)\,\text{m/s}^2 = 678\,\text{N} \approx 6{,}8 \cdot 10^2\,\text{N}$$

e la bilancia segna $678 / 9{,}8 = 69{,}1\ldots \approx 69\,\text{kg}$. Con l'accelerazione verso il basso, $a = -1{,}5\,\text{m/s}^2$:

$$F_v = 60\,\text{kg} \cdot (9{,}8 - 1{,}5)\,\text{m/s}^2 = 498\,\text{N} \approx 5{,}0 \cdot 10^2\,\text{N}$$

e la bilancia segna $498 / 9{,}8 = 50{,}8\ldots \approx 51\,\text{kg}$. A velocità costante, in salita o in discesa, segna $60\,\text{kg}$.
```

Conta il verso dell'accelerazione, non quello del moto. L'accelerazione è verso l'alto quando l'ascensore parte in salita, e anche quando frena mentre scende; è verso il basso quando parte in discesa, e quando frena mentre sale. Se il cavo si spezzasse, l'ascensore e la persona cadrebbero insieme con accelerazione $g$, e con $a = -g$ la bilancia segnerebbe zero.

```ad-example
Esempio 3: dalla bilancia all'accelerazione
Nell'ascensore la bilancia della stessa persona di $60\,\text{kg}$ segna $54\,\text{kg}$. Quanto vale l'accelerazione dell'ascensore?

La reazione della bilancia è $F_v = 54\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 529{,}2\,\text{N}$, il peso $P = 60 \cdot 9{,}8\,\text{N} = 588\,\text{N}$:

$$a = \frac{F_v - P}{m} = \frac{529{,}2\,\text{N} - 588\,\text{N}}{60\,\text{kg}} = -0{,}98\,\text{m/s}^2$$

L'accelerazione è verso il basso, di $0{,}98\,\text{m/s}^2$: l'ascensore sta partendo in discesa, oppure sta frenando mentre sale. Dalla bilancia non si può sapere quale dei due.
```

```ad-warning
Il peso non cambia
Nell'ascensore che accelera cambia la reazione della bilancia, non il peso: la Terra attira la persona sempre con $m\,g$. "Mi sento più pesante" vuol dire che il pavimento mi spinge di più.
```

Nella figura qui sotto fai viaggiare l'ascensore e guardi la bilancia: segna di più mentre l'accelerazione è verso l'alto, di meno mentre è verso il basso, il peso vero mentre la velocità è costante.

```interattivo
% nome: ascensore-bilancia
% alt: Un ascensore con una persona di 60 chilogrammi su una bilancia pesapersone. Un bottone fa partire il viaggio, in salita o in discesa: l'ascensore accelera, va a velocità costante e poi frena. Accanto alla cabina il diagramma delle forze sulla persona, con il peso e la reazione della bilancia, e l'accelerazione in verde; sotto la figura sono scritte la fase del viaggio, l'accelerazione, la velocità e quanto segna la bilancia, di più quando l'accelerazione è verso l'alto e di meno quando è verso il basso
```
