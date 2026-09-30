# La rifrazione e la riflessione totale

Un cucchiaino in un bicchiere d'acqua sembra spezzato proprio dove entra nell'acqua, e il fondo di una piscina sembra più vicino di quanto è. La causa è la stessa: quando passa da un mezzo trasparente a un altro, per esempio dall'aria all'acqua, la luce cambia direzione. Questo fenomeno si chiama **rifrazione**. Nella lezione [I raggi di luce e la propagazione rettilinea](/materiale/scuola-superiore/fisica/l-ottica-geometrica/i-raggi-di-luce-e-la-propagazione-rettilinea) la luce viaggia in linea retta in un mezzo solo; qui si vede che cosa succede sulla superficie che separa due mezzi.

## L'indice di rifrazione

Nel vuoto la luce viaggia a $c = 3{,}00 \cdot 10^8\,\text{m/s}$. In un mezzo trasparente va più piano, e la sua velocità $v$ dipende dal mezzo. Il rapporto tra le due velocità si chiama **indice di rifrazione** assoluto del mezzo:

$$n = \frac{c}{v}$$

È un numero puro, perché è il rapporto tra due velocità, e non è mai minore di $1$, perché nessun mezzo è più veloce del vuoto. Più grande è $n$, più lenta è la luce in quel mezzo: si dice che il mezzo è più **rifrangente**. Alcuni valori, per la luce gialla:

| Mezzo | $n$ |
|---|---|
| vuoto | $1$ (esatto) |
| aria | $1{,}0003$, cioè $1{,}00$ con tre cifre |
| acqua | $1{,}33$ |
| ghiaccio | $1{,}31$ |
| alcol etilico | $1{,}36$ |
| vetro comune | da $1{,}5$ a $1{,}6$, negli esempi $1{,}50$ |
| diamante | $2{,}42$ |

Negli esercizi l'aria si tratta come il vuoto, con $n = 1{,}00$.

```ad-example
Esempio 1: la velocità della luce nell'acqua
Quanto vale la velocità della luce nell'acqua, che ha $n = 1{,}33$?

Da $n = c/v$ si ricava $v = c/n$:

$$v = \frac{3{,}00 \cdot 10^8\,\text{m/s}}{1{,}33} = 2{,}255\ldots \cdot 10^8\,\text{m/s} \approx 2{,}26 \cdot 10^8\,\text{m/s}$$

Nell'acqua la luce va a circa tre quarti della velocità che ha nel vuoto. Al contrario, nel diamante la luce va a $1{,}24 \cdot 10^8\,\text{m/s}$, e l'indice è $n = 3{,}00/1{,}24 = 2{,}419\ldots \approx 2{,}42$.
```

```ad-warning
Un indice minore di 1
Se trovi $n < 1$ hai diviso al contrario, $v/c$ invece di $c/v$: la luce non è mai più veloce che nel vuoto, quindi l'indice di un mezzo è sempre almeno $1$.
```

## Le leggi della rifrazione

Un raggio di luce arriva sulla superficie di separazione tra due mezzi nel **punto di incidenza**. Da quel punto si traccia la normale, la retta perpendicolare alla superficie, come nella [riflessione](/materiale/scuola-superiore/fisica/l-ottica-geometrica/la-riflessione-e-gli-specchi-piani). Gli angoli si misurano sempre dalla normale: l'**angolo di incidenza** $\theta_1$ è quello tra il raggio incidente e la normale, l'**angolo di rifrazione** $\theta_2$ quello tra il raggio rifratto e la normale.

```tikz
% nome: rifrazione-aria-acqua
% alt: Un raggio di luce scende dall'aria e colpisce la superficie dell'acqua con un angolo theta 1 di 45 gradi dalla normale tratteggiata; nell'acqua prosegue più vicino alla normale, con un angolo theta 2 di 32 gradi
% svg: rifrazione-aria-acqua-e1fad95a.svg 170x150
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\fill[cyan!20] (-2.2,-1.9) rectangle (2.2,0);
\draw[thin] (-2.2,0) -- (2.2,0);
\draw[thin, dashed] (0,1.9) -- (0,-1.9);
\node[right] at (0,1.75) {\small normale};
\draw[raggio] (-1.273,1.273) -- (0,0);
\draw[raggio] (0,0) -- (0.957,-1.525);
\draw (0,0.6) arc[start angle=90, end angle=135, radius=0.6];
\node at (-0.33,0.82) {$\theta_1$};
\draw (0,-0.7) arc[start angle=270, end angle=302.12, radius=0.7];
\node at (0.3,-1.0) {$\theta_2$};
\node[right] at (0.6,0.65) {\small aria};
\node[right] at (0.6,0.3) {\small $n_1 = 1{,}00$};
\node[right] at (-2.1,-1.25) {\small acqua};
\node[right] at (-2.1,-1.6) {\small $n_2 = 1{,}33$};
\end{tikzpicture}
```

La rifrazione segue due leggi.

1. Il raggio incidente, il raggio rifratto e la normale stanno nello stesso piano.
2. **Legge di Snell**: il prodotto dell'indice di rifrazione per il seno dell'angolo è lo stesso nei due mezzi,

$$n_1 \sin\theta_1 = n_2 \sin\theta_2$$

dove $n_1$ è l'indice del mezzo da cui la luce arriva e $n_2$ quello in cui entra. Il seno si legge sulla calcolatrice in gradi, come nella lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore); per tornare dal seno all'angolo si usa il tasto $\sin^{-1}$.

Dalla legge di Snell si legge da che parte va il raggio:

- se la luce entra in un mezzo più rifrangente ($n_2 > n_1$, per esempio dall'aria all'acqua), $\sin\theta_2$ è più piccolo di $\sin\theta_1$ e il raggio rifratto si avvicina alla normale;
- se entra in un mezzo meno rifrangente ($n_2 < n_1$, dall'acqua all'aria), il raggio si allontana dalla normale;
- un raggio che arriva lungo la normale ($\theta_1 = 0^\circ$) passa senza deviare, qualunque siano i mezzi.

Oltre al raggio rifratto c'è sempre anche un raggio riflesso, più debole, che segue la legge della riflessione: per questo su una vetrina si vede sia quello che c'è dietro sia la propria immagine.

```ad-warning
Gli angoli dalla superficie
Gli angoli della legge di Snell si misurano dalla normale, non dalla superficie. Se un problema dice che il raggio forma $30^\circ$ con la superficie dell'acqua, l'angolo di incidenza è $90^\circ - 30^\circ = 60^\circ$.
```

```ad-example
Esempio 2: dall'aria all'acqua
Un raggio passa dall'aria ($n_1 = 1{,}00$) all'acqua ($n_2 = 1{,}33$) con un angolo di incidenza di $45^\circ$. Trova l'angolo di rifrazione.

Si ricava il seno dell'angolo di rifrazione, poi l'angolo:

$$
\begin{gathered}
\sin\theta_2 = \frac{n_1 \sin\theta_1}{n_2} = \frac{1{,}00 \cdot \sin 45^\circ}{1{,}33} = 0{,}5316\ldots \\
\theta_2 = \sin^{-1} 0{,}5316 = 32{,}1\ldots^\circ \approx 32^\circ
\end{gathered}
$$

L'angolo è più piccolo di $45^\circ$: il raggio si è avvicinato alla normale, come deve fare entrando in un mezzo più rifrangente. È la figura qui sopra.
```

```ad-warning
L'angolo al posto del seno
La legge di Snell lega i seni, non gli angoli. Dividere l'angolo per l'indice, $45^\circ / 1{,}33 = 33{,}8^\circ$, dà un risultato vicino ma sbagliato: $\theta_2 = 32{,}1^\circ$. Prima si calcola il seno, poi si torna all'angolo con $\sin^{-1}$.
```

```ad-example
Esempio 3: dall'aria al vetro
Un raggio entra in una lastra di vetro ($n = 1{,}50$) con un angolo di incidenza di $60^\circ$. Qual è l'angolo di rifrazione?

$$
\begin{gathered}
\sin\theta_2 = \frac{1{,}00 \cdot \sin 60^\circ}{1{,}50} = 0{,}5773\ldots \\
\theta_2 = 35{,}26\ldots^\circ \approx 35^\circ
\end{gathered}
$$
```

```ad-example
Esempio 4: l'indice dagli angoli
In laboratorio un raggio arriva dall'aria su un blocco di plastica trasparente con un angolo di incidenza di $40^\circ$, e dentro la plastica forma $25^\circ$ con la normale. Quanto vale l'indice di rifrazione della plastica?

Con $n_1 = 1{,}00$ la legge di Snell dà

$$n_2 = \frac{\sin\theta_1}{\sin\theta_2} = \frac{\sin 40^\circ}{\sin 25^\circ} = \frac{0{,}6428}{0{,}4226} = 1{,}521\ldots \approx 1{,}52$$
```

```ad-example
Esempio 5: dall'acqua all'aria
Una lampada sul fondo di una piscina manda un raggio verso la superficie con un angolo di incidenza di $30^\circ$. Con che angolo esce nell'aria?

Ora la luce arriva dall'acqua, quindi $n_1 = 1{,}33$ e $n_2 = 1{,}00$:

$$
\begin{gathered}
\sin\theta_2 = \frac{1{,}33 \cdot \sin 30^\circ}{1{,}00} = 0{,}665 \\
\theta_2 = 41{,}68\ldots^\circ \approx 42^\circ
\end{gathered}
$$

Il raggio esce più lontano dalla normale di come arrivava: passa in un mezzo meno rifrangente.
```

Sposta il raggio incidente e scegli i due mezzi: guarda da che parte va il raggio rifratto, e che cosa succede quando la luce esce dal vetro verso l'aria con un angolo grande.

```interattivo
% nome: rifrazione-due-mezzi
% alt: Due mezzi uno sopra l'altro, separati da una superficie orizzontale con la normale tratteggiata; il raggio incidente arriva dall'alto nel punto di incidenza, e l'angolo di incidenza si cambia trascinando l'inizio del raggio o con un cursore; i due mezzi si scelgono tra aria, acqua, vetro e diamante; il raggio rifratto segue la legge di Snell, e sotto sono scritti i due angoli, i prodotti n per seno e, quando c'è, l'angolo limite; oltre l'angolo limite il raggio rifratto sparisce e resta solo quello riflesso
```

## La lamina a facce parallele

Una lastra di vetro con le due facce parallele, come il vetro di una finestra, è una **lamina a facce parallele**. Un raggio che la attraversa si rifrange due volte: entrando si avvicina alla normale, uscendo se ne allontana dello stesso angolo, perché la seconda rifrazione è quella della prima percorsa al contrario. Il raggio che esce è quindi parallelo a quello che entra, ma spostato di lato. Per questo attraverso una finestra le cose si vedono al loro posto, senza deformazioni; con un vetro spesso e guardando di sbieco lo spostamento si nota.

```tikz
% nome: lamina-facce-parallele
% alt: Un raggio attraversa una lastra di vetro dalle facce parallele: entrando a 50 gradi dalla normale si avvicina alla normale, uscendo se ne allontana di nuovo; il raggio che esce è parallelo a quello che entra, spostato di lato rispetto al suo prolungamento tratteggiato
% svg: lamina-facce-parallele-328c79e9.svg 199x110
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\fill[blue!10] (-1.8,-1) rectangle (2.4,0);
\draw[thin] (-1.8,0) -- (2.4,0);
\draw[thin] (-1.8,-1) -- (2.4,-1);
\draw[thin, dashed] (0,0.9) -- (0,-0.6);
\draw[thin, dashed] (0.594,-0.4) -- (0.594,-1.9);
\draw[thin, dashed, orange!90!black] (0,0) -- (1.455,-1.221);
\draw[raggio] (-1.072,0.9) -- (0,0);
\draw[raggio] (0,0) -- (0.594,-1);
\draw[raggio] (0.594,-1) -- (1.666,-1.9);
\node[right] at (2.4,-0.5) {\small vetro};
\node[right] at (2.4,0.35) {\small aria};
\end{tikzpicture}
```

## La profondità apparente

Una moneta sul fondo di una bacinella sembra più in alto di dove si trova. I raggi che partono dalla moneta escono dall'acqua allontanandosi dalla normale; l'occhio li riceve e li prolunga all'indietro in linea retta, e i prolungamenti si incontrano in un punto più alto della moneta: lì l'occhio vede la moneta.

```tikz
% nome: profondita-apparente-moneta
% alt: Una moneta sul fondo dell'acqua manda due raggi verso la superficie; uscendo nell'aria i raggi si allontanano dalla normale, e i loro prolungamenti tratteggiati all'indietro si incontrano più in alto della moneta, dove l'occhio la vede
% svg: profondita-apparente-moneta-dbfdd428.svg 222x131
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\fill[cyan!20] (-1.9,-2) rectangle (2.4,0);
\draw[thin] (-1.9,0) -- (2.4,0);
\draw[thick] (-1.9,-2) -- (2.4,-2);
\fill (-0.25,-2) rectangle (0.25,-1.93);
\draw[raggio] (0,-2) -- (0.7,0);
\draw[raggio] (0.7,0) -- (1.359,1.347);
\draw[raggio] (0,-2) -- (1,0);
\draw[raggio] (1,0) -- (1.892,1.206);
\draw[thin, dashed, orange!90!black] (0.7,0) -- (0.115,-1.196);
\draw[thin, dashed, orange!90!black] (1,0) -- (0.115,-1.196);
\draw[thin, dashed] (-0.135,-1.196) rectangle (0.365,-1.126);
\draw[thin] (-0.3,-1.97) -- (-0.7,-1.7) node[left] {\small moneta};
\draw[thin] (-0.16,-1.16) -- (-0.7,-0.9) node[left] {\small immagine};
\node[right] at (2.4,0.35) {\small aria};
\node[right] at (2.4,-1) {\small acqua};
\end{tikzpicture}
```

Guardando dall'alto, quasi lungo la verticale, la profondità apparente $h'$ è la profondità vera $h$ divisa per l'indice dell'acqua:

$$h' = \frac{h}{n}$$

Una piscina profonda $2{,}0\,\text{m}$ vista dall'alto sembra profonda $2{,}0/1{,}33 = 1{,}50\ldots \approx 1{,}5\,\text{m}$. Guardando di sbieco sembra ancora meno profonda, e la formula non vale più. Per la stessa ragione il cucchiaino nel bicchiere sembra spezzato: la parte immersa appare più in alto di dove è.

## L'angolo limite e la riflessione totale

Quando la luce passa da un mezzo più rifrangente a uno meno rifrangente, per esempio dal vetro all'aria, il raggio rifratto si allontana dalla normale, e l'angolo di rifrazione è sempre più grande di quello di incidenza. Se l'angolo di incidenza cresce, a un certo punto l'angolo di rifrazione arriva a $90^\circ$: il raggio rifratto esce radente alla superficie. Quell'angolo di incidenza si chiama **angolo limite** $\theta_L$. Mettendo $\theta_2 = 90^\circ$, e quindi $\sin\theta_2 = 1$, nella legge di Snell:

$$\sin\theta_L = \frac{n_2}{n_1} \qquad (n_1 > n_2)$$

Se l'angolo di incidenza supera l'angolo limite il raggio rifratto non c'è più, e tutta la luce torna indietro nel primo mezzo, riflessa come da uno specchio perfetto: è la **riflessione totale**.

```tikz
% nome: angolo-limite-tre-raggi
% alt: Una lampada sott'acqua manda tre raggi verso la superficie: il primo, a 30 gradi dalla normale, esce nell'aria allontanandosi dalla normale; il secondo arriva con l'angolo limite theta L ed esce radente alla superficie; il terzo, a 65 gradi, supera l'angolo limite e viene riflesso tutto nell'acqua
% svg: angolo-limite-tre-raggi-57f55bf2.svg 219x122
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\fill[cyan!20] (-0.8,-1.9) rectangle (4.9,0);
\draw[thin] (-0.8,0) -- (4.9,0);
\draw[thin, dashed] (0.866,0.8) -- (0.866,-0.8);
\draw[thin, dashed] (1.710,0.8) -- (1.710,-0.8);
\draw[thin, dashed] (3.217,0.8) -- (3.217,-0.8);
\draw[raggio] (0,-1.5) -- (0.866,0);
\draw[raggio] (0.866,0) -- (1.863,1.120);
\draw[raggio] (0,-1.5) -- (1.710,0);
\draw[raggio] (1.710,0) -- (2.95,0);
\draw[raggio] (0,-1.5) -- (3.217,0);
\draw[raggio] (3.217,0) -- (4.486,-0.592);
\draw (1.710,-0.5) arc[start angle=270, end angle=221.26, radius=0.5];
\node at (1.34,-0.8) {\small $\theta_L$};
\fill (0,-1.5) circle (1.5pt);
\node[below] at (0,-1.5) {\small lampada};
\node[right] at (3.3,0.4) {\small aria};
\node[right] at (3.3,-1.5) {\small acqua};
\end{tikzpicture}
```

```ad-example
Esempio 6: l'angolo limite del vetro e dell'acqua
Trova l'angolo limite per la luce che passa dal vetro ($n = 1{,}50$) all'aria, e dall'acqua all'aria.

$$
\begin{gathered}
\sin\theta_L = \frac{1{,}00}{1{,}50} = 0{,}6666\ldots \qquad \theta_L = 41{,}8\ldots^\circ \approx 42^\circ \\
\sin\theta_L = \frac{1{,}00}{1{,}33} = 0{,}7518\ldots \qquad \theta_L = 48{,}7\ldots^\circ \approx 49^\circ
\end{gathered}
$$

Il vetro, più rifrangente, ha l'angolo limite più piccolo; il diamante, con $n = 2{,}42$, arriva a $24^\circ$, e per questo la luce che vi entra rimbalza molte volte al suo interno prima di uscire, e il diamante tagliato brilla.
```

```ad-warning
La riflessione totale verso il mezzo più rifrangente
La riflessione totale può succedere solo quando la luce va verso un mezzo meno rifrangente, cioè con $n_1 > n_2$. Dall'aria all'acqua non succede mai: $\sin\theta_L = n_2/n_1$ sarebbe maggiore di $1$, e nessun angolo ha un seno maggiore di $1$. Entrando in un mezzo più rifrangente un raggio rifratto c'è sempre.
```

```ad-example
Esempio 7: il prisma che fa da specchio
Un raggio entra perpendicolarmente in un prisma di vetro ($n = 1{,}50$) che ha per base un triangolo rettangolo isoscele, e arriva sulla faccia lunga con un angolo di incidenza di $45^\circ$. Esce dal vetro?

L'angolo limite del vetro è $41{,}8^\circ$, e $45^\circ$ è più grande: il raggio non esce, si riflette tutto e gira di $90^\circ$. Se si prova lo stesso con la legge di Snell si trova $\sin\theta_2 = 1{,}50 \cdot \sin 45^\circ = 1{,}06$, un seno maggiore di $1$: il segno che il raggio rifratto non esiste. I prismi dei binocoli e dei periscopi lavorano così, e riflettono meglio di uno specchio, che assorbe sempre una parte della luce.
```

## Le fibre ottiche

Una **fibra ottica** è un filo di vetro o di plastica trasparente, sottile come un capello, rivestito da un mantello di materiale meno rifrangente. La luce che entra da un'estremità colpisce le pareti con un angolo di incidenza più grande dell'angolo limite, e si riflette totalmente a ogni rimbalzo: così resta dentro la fibra anche quando la fibra si piega, e arriva dall'altra parte quasi senza perdite.

```tikz
% nome: fibra-ottica-rimbalzi
% alt: Un raggio entra da sinistra nell'estremità di una fibra ottica, si rifrange avvicinandosi all'asse della fibra e poi rimbalza sulle pareti con riflessioni totali, avanzando a zig zag
% svg: fibra-ottica-rimbalzi-be2b992b.svg 265x39
\begin{tikzpicture}[raggio/.style={thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\fill[blue!10] (0,-0.4) rectangle (6,0.4);
\draw[thick] (0,0.4) -- (6,0.4);
\draw[thick] (0,-0.4) -- (6,-0.4);
\draw[thin] (0,-0.4) -- (0,0.4);
\draw[raggio] (-0.9,-0.538) -- (0,0);
\draw[raggio] (0,0) -- (1.099,0.4);
\draw[raggio] (1.099,0.4) -- (3.297,-0.4);
\draw[raggio] (3.297,-0.4) -- (5.495,0.4);
\draw[thick, orange!90!black] (5.495,0.4) -- (6,0.216);
\end{tikzpicture}
```

Con le fibre ottiche viaggiano i segnali di internet, codificati in impulsi di luce, e con lo stesso principio l'endoscopio porta la luce dentro il corpo e ne riporta l'immagine.
