# La velocità media e istantanea

Due ciclisti percorrono la stessa strada di $12\,\text{km}$: il primo impiega $30$ minuti, il secondo $40$. Il primo è più veloce perché copre la stessa distanza in meno tempo. La velocità misura proprio questo, quanta strada si fa in ogni unità di tempo; e siccome un moto ha anche un verso, la velocità dice pure da che parte si va. Le posizioni, gli spostamenti e gli intervalli di tempo sono quelli della lezione [Punto materiale, traiettoria e sistema di riferimento](/materiale/scuola-superiore/fisica/il-moto-rettilineo/punto-materiale-traiettoria-e-sistema-di-riferimento).

## La velocità media

Un corpo che si muove su una retta passa dalla posizione $s_1$ all'istante $t_1$ alla posizione $s_2$ all'istante $t_2$. La sua **velocità media** in quell'intervallo è lo spostamento diviso l'intervallo di tempo:

$$v_m = \frac{\Delta s}{\Delta t} = \frac{s_2 - s_1}{t_2 - t_1}$$

Nel Sistema Internazionale la velocità si misura in metri al secondo, $\text{m/s}$, come nella lezione [Grandezze derivate: area, volume e densità](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-derivate-area-volume-e-densita). L'intervallo $\Delta t$ è sempre positivo, quindi la velocità media ha il segno dello spostamento: positiva se il corpo si è spostato nel verso della retta, negativa se si è spostato nel verso opposto. Il valore assoluto dice quanto è veloce, il segno dice il verso.

```ad-example
Esempio 1: una velocità media positiva
Un velocista passa dalla posizione $s_1 = 20\,\text{m}$ all'istante $t_1 = 4{,}0\,\text{s}$ e dalla posizione $s_2 = 92\,\text{m}$ all'istante $t_2 = 12{,}0\,\text{s}$. Qual è la sua velocità media in questo intervallo?

$$v_m = \frac{s_2 - s_1}{t_2 - t_1} = \frac{92\,\text{m} - 20\,\text{m}}{12{,}0\,\text{s} - 4{,}0\,\text{s}} = \frac{72\,\text{m}}{8{,}0\,\text{s}} = 9{,}0\,\text{m/s}$$

In media il velocista ha percorso $9{,}0$ metri in ogni secondo, nel verso positivo della retta.
```

```ad-warning
Posizione diviso tempo non è la velocità
Dividere la posizione finale per l'istante finale, $92\,\text{m} / 12{,}0\,\text{s} \approx 7{,}7\,\text{m/s}$, dà un numero che non è la velocità media: conterebbe anche i $20\,\text{m}$ in cui il velocista si trovava già all'inizio e i $4{,}0\,\text{s}$ passati prima. Nella formula vanno lo spostamento e l'intervallo di tempo, cioè due differenze. Il conto $s/t$ è giusto solo quando il corpo parte dall'origine all'istante zero.
```

```ad-example
Esempio 2: una velocità media negativa
Un'auto in retromarcia lungo un viale dritto passa in $s_1 = 35\,\text{m}$ all'istante $t_1 = 2{,}0\,\text{s}$ e in $s_2 = 5\,\text{m}$ all'istante $t_2 = 8{,}0\,\text{s}$. Qual è la sua velocità media?

$$v_m = \frac{5\,\text{m} - 35\,\text{m}}{8{,}0\,\text{s} - 2{,}0\,\text{s}} = \frac{-30\,\text{m}}{6{,}0\,\text{s}} = -5{,}0\,\text{m/s}$$

Il segno meno dice che l'auto va nel verso opposto a quello della retta, a $5{,}0$ metri al secondo.
```

## Metri al secondo e chilometri all'ora

Per le auto e i treni si usano i chilometri all'ora, $\text{km/h}$. Un'ora ha $3600\,\text{s}$ e un chilometro ha $1000\,\text{m}$, quindi

$$1\,\text{km/h} = \frac{1000\,\text{m}}{3600\,\text{s}} = \frac{1}{3{,}6}\,\text{m/s} \qquad 1\,\text{m/s} = 3{,}6\,\text{km/h}$$

Da $\text{km/h}$ a $\text{m/s}$ si divide per $3{,}6$, da $\text{m/s}$ a $\text{km/h}$ si moltiplica per $3{,}6$, come nell'esempio 4 della lezione [Grandezze fisiche e unità del Sistema Internazionale](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale): $72\,\text{km/h} = 20\,\text{m/s}$.

```ad-tip
Il controllo della conversione
La stessa velocità ha un numero più grande in $\text{km/h}$ che in $\text{m/s}$. Se convertendo $20\,\text{m/s}$ ottieni $5{,}6\,\text{km/h}$, hai diviso invece di moltiplicare: $5{,}6\,\text{km/h}$ è il passo di una persona che cammina, non la velocità di un'auto.
```

```ad-example
Esempio 3: un treno regionale
Un treno percorre $45\,\text{km}$ in $20$ minuti. Qual è la sua velocità media, in $\text{km/h}$ e in $\text{m/s}$? Il binario è dritto e il treno va sempre nello stesso verso.

$20$ minuti sono un terzo d'ora, $\Delta t = \tfrac{1}{3}\,\text{h}$:

$$v_m = \frac{45\,\text{km}}{\tfrac{1}{3}\,\text{h}} = 135\,\text{km/h}$$

In metri al secondo, con $\Delta t = 20 \cdot 60\,\text{s} = 1200\,\text{s}$:

$$v_m = \frac{45\,000\,\text{m}}{1200\,\text{s}} = 37{,}5\,\text{m/s}$$

Controllo: $37{,}5 \cdot 3{,}6 = 135$.
```

```ad-warning
Minuti al posto delle ore
Il conto $45\,\text{km} / 20\,\text{min} = 2{,}25$ è giusto, ma sono chilometri al minuto, non chilometri all'ora. Prima di dividere, il tempo va espresso nell'unità che compare nella velocità che vuoi: ore per i $\text{km/h}$, secondi per i $\text{m/s}$.
```

## La velocità scalare media

Nel linguaggio di tutti i giorni "velocità media" vuol dire la strada fatta divisa il tempo impiegato. Questa grandezza si chiama **velocità scalare media**, e usa la distanza percorsa $d$ al posto dello spostamento:

$$v_s = \frac{d}{\Delta t}$$

La velocità scalare media è sempre positiva. Se il corpo va sempre nello stesso verso, è il valore assoluto della velocità media; se torna indietro, è più grande.

```ad-example
Esempio 4: un giro di pista
Un'atleta corre un giro di pista di $400\,\text{m}$ in $80\,\text{s}$ e si ferma sulla linea di partenza. Quanto valgono la sua velocità scalare media e la sua velocità media?

$$v_s = \frac{d}{\Delta t} = \frac{400\,\text{m}}{80\,\text{s}} = 5{,}0\,\text{m/s}$$

Lo spostamento è zero, perché l'atleta torna al punto di partenza, e quindi anche la velocità media è zero: $v_m = 0\,\text{m/s}$.
```

```ad-example
Esempio 5: andata e ritorno
L'auto dell'esempio 2 della lezione sul punto materiale va da $s = 0$ a $s = 120\,\text{m}$ e poi torna indietro fino a $s = 50\,\text{m}$, in tutto in $22\,\text{s}$. Quanto valgono la velocità media e la velocità scalare media?

Lo spostamento è $\Delta s = 50\,\text{m}$, la distanza percorsa è $d = 120\,\text{m} + 70\,\text{m} = 190\,\text{m}$:

$$v_m = \frac{50\,\text{m}}{22\,\text{s}} = 2{,}27\ldots\,\text{m/s} \approx 2{,}3\,\text{m/s} \qquad v_s = \frac{190\,\text{m}}{22\,\text{s}} = 8{,}63\ldots\,\text{m/s} \approx 8{,}6\,\text{m/s}$$

La velocità media è molto più piccola, perché il ritorno annulla una parte dell'andata.
```

## La velocità media non è la media delle velocità

Un'auto percorre $60\,\text{km}$ a $60\,\text{km/h}$ e poi altri $60\,\text{km}$ a $40\,\text{km/h}$, sempre nello stesso verso. Viene spontaneo dire che la velocità media è $50\,\text{km/h}$, la media tra $60$ e $40$, ma è sbagliato. La velocità media è la distanza totale divisa il tempo totale, e il tempo si calcola tratto per tratto, con $\Delta t = \Delta s / v$:

$$\Delta t_1 = \frac{60\,\text{km}}{60\,\text{km/h}} = 1{,}0\,\text{h} \qquad \Delta t_2 = \frac{60\,\text{km}}{40\,\text{km/h}} = 1{,}5\,\text{h}$$

$$v_m = \frac{60\,\text{km} + 60\,\text{km}}{1{,}0\,\text{h} + 1{,}5\,\text{h}} = \frac{120\,\text{km}}{2{,}5\,\text{h}} = 48\,\text{km/h}$$

Il risultato è meno di $50\,\text{km/h}$ perché il tratto lento dura di più: l'auto passa più tempo a $40\,\text{km/h}$ che a $60\,\text{km/h}$, e la velocità lenta pesa di più.

```ad-warning
Non si fa la media delle velocità
La velocità media di un viaggio in più tratti si calcola sempre con lo spostamento totale e il tempo totale. La media delle velocità dei tratti è giusta solo se i tratti durano lo stesso tempo: un'ora a $60\,\text{km/h}$ e un'ora a $40\,\text{km/h}$ danno $100\,\text{km}$ in $2\,\text{h}$, cioè $50\,\text{km/h}$.
```

## La velocità media nel grafico spazio-tempo

La legge oraria di un moto si può disegnare come grafico, con il tempo $t$ sull'asse orizzontale e la posizione $s$ sull'asse verticale: è il **grafico spazio-tempo**. Due istanti $t_1$ e $t_2$ corrispondono a due punti del grafico, e la retta che li unisce, la secante, sale di $\Delta s$ mentre avanza di $\Delta t$. La sua [pendenza](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare) è $\Delta s / \Delta t$, cioè la velocità media nell'intervallo.

```tikz
% nome: velocita-media-secante-grafico
% alt: Grafico spazio-tempo di un carrello che parte da fermo: una curva che sale sempre più ripida, da s uguale a 0 all'istante 0 a s uguale a 18 metri all'istante 6 secondi. La secante arancione unisce i punti a 2 secondi e 2 metri e a 6 secondi e 18 metri; il triangolo tratteggiato mostra Delta t uguale a 4 secondi e Delta s uguale a 16 metri
% svg: velocita-media-secante-grafico-a8a5d0b3.svg 320x232
% poi-interattivo: trascinare i due punti lungo la curva e leggere la pendenza della secante, cioè la velocità media nell'intervallo
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=1, ystep=0.5] (0,0) grid (6.4,4.6);
\draw[->] (0,0) -- (6.8,0) node[right] {$t$ (s)};
\draw[->] (0,0) -- (0,5) node[above] {$s$ (m)};
\foreach \x in {1,2,...,6} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {1/4,2/8,3/12,4/16} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] plot[domain=0:6.3, samples=40] (\x,{0.125*\x*\x});
\draw[thick, orange!90!black] (1.5,0) -- (6.3,4.8);
\draw[dashed, orange!90!black] (2,0.5) -- (6,0.5) -- (6,4.5);
\fill[orange!90!black] (2,0.5) circle (2pt);
\fill[orange!90!black] (6,4.5) circle (2pt);
\node[below, orange!90!black] at (4,0.5) {\small $\Delta t = 4$ s};
\node[right, orange!90!black] at (6,2.5) {\small $\Delta s = 16$ m};
\end{tikzpicture}
```

Nella figura il carrello è in $s = 2\,\text{m}$ a $t = 2\,\text{s}$ e in $s = 18\,\text{m}$ a $t = 6\,\text{s}$: la secante ha pendenza $16\,\text{m} / 4\,\text{s} = 4\,\text{m/s}$, la velocità media tra $2\,\text{s}$ e $6\,\text{s}$. Una secante che sale verso destra dà una velocità media positiva, una che scende dà una velocità media negativa, una orizzontale dà zero.

## La velocità istantanea

Il tachimetro di un'auto non segna la velocità media di tutto il viaggio: segna quanto va veloce l'auto in quel momento. Questa è la **velocità istantanea** $v$, la velocità in un istante preciso. Si ottiene come velocità media su un intervallo di tempo così piccolo che, dentro l'intervallo, la velocità non fa in tempo a cambiare.

Per il carrello della figura, la velocità media calcolata a partire da $t = 2\,\text{s}$ su intervalli sempre più corti dà:

| $\Delta t$ (s) | $4$ | $2$ | $1$ | $0{,}1$ | $0{,}01$ |
|---|---|---|---|---|---|
| $v_m$ (m/s) | $4$ | $3$ | $2{,}5$ | $2{,}05$ | $2{,}005$ |

Più l'intervallo si accorcia, più la velocità media si avvicina a $2\,\text{m/s}$, e smette di cambiare in modo apprezzabile: la velocità istantanea a $t = 2\,\text{s}$ è $v = 2\,\text{m/s}$. Le posizioni del carrello vengono dalla legge oraria del moto uniformemente accelerato, $s = 0{,}5\,\text{m/s}^2 \cdot t^2$, che si studia nella lezione [Il moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato); qui servono solo i numeri della tabella.

Nel grafico spazio-tempo, quando $t_2$ si avvicina a $t_1$ la secante ruota intorno al punto $P$ e diventa la **retta tangente** al grafico in $P$, quella che tocca la curva in $P$ senza attraversarla. La velocità istantanea è la pendenza della tangente.

```tikz
% nome: velocita-istantanea-tangente
% alt: Lo stesso grafico spazio-tempo del carrello. Dal punto P, a 2 secondi e 2 metri, partono tre secanti grigie verso i punti a 6, 4 e 3 secondi, sempre meno ripide, con pendenze 4, 3 e 2,5 metri al secondo; la retta tangente in P, arancione, ha pendenza 2 metri al secondo
% svg: velocita-istantanea-tangente-99e36846.svg 316x232
% poi-interattivo: avvicinare il secondo punto a P con un cursore e guardare la secante che diventa la tangente, con la sua pendenza scritta accanto
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=1, ystep=0.5] (0,0) grid (6.4,4.6);
\draw[->] (0,0) -- (6.8,0) node[right] {$t$ (s)};
\draw[->] (0,0) -- (0,5) node[above] {$s$ (m)};
\foreach \x in {1,2,...,6} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {1/4,2/8,3/12,4/16} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] plot[domain=0:6.3, samples=40] (\x,{0.125*\x*\x});
\draw[gray] (2,0.5) -- (6,4.5);
\draw[gray] (2,0.5) -- (4,2);
\draw[gray] (2,0.5) -- (3,1.125);
\fill[gray] (6,4.5) circle (1.5pt);
\fill[gray] (4,2) circle (1.5pt);
\fill[gray] (3,1.125) circle (1.5pt);
\node[left, gray] at (5.6,4.2) {\small $4$ m/s};
\node[right, gray] at (4.05,1.75) {\small $3$ m/s};
\draw[thick, orange!90!black] (1,0) -- (6.3,2.65) node[right] {\small $2$ m/s};
\fill (2,0.5) circle (2pt) node[above left] {$P$};
\end{tikzpicture}
```

```ad-note
Il limite e la derivata
L'idea di far diventare l'intervallo "piccolo quanto si vuole" e di guardare a quale numero si avvicina la velocità media si chiama limite. In matematica, al quinto anno, la pendenza della tangente diventa la [derivata](/materiale/scuola-superiore/matematica/derivate/definizione-di-derivata): la velocità istantanea è la derivata della posizione rispetto al tempo. Qui basta l'idea, con le tabelle e i grafici.
```

La velocità istantanea ha un segno, come la velocità media, e il grafico spazio-tempo lo mostra a colpo d'occhio: dove il grafico sale la velocità è positiva, dove scende è negativa, dove è orizzontale, per un istante o per un tratto, la velocità è zero. Nella figura qui sotto un carrello, spinto su per una rotaia in salita, rallenta, si ferma per un istante nel punto più alto e torna indietro; la posizione $s$ si misura lungo la rotaia, dalla base.

```tikz
% nome: segno-velocita-tangenti
% alt: Grafico spazio-tempo di un carrello spinto su per una rotaia in salita: la curva sale da 0 a 16 metri tra 0 e 4 secondi e riscende a 0 a 8 secondi. Tre tangenti arancioni: a 2 secondi sale, velocità positiva; a 4 secondi è orizzontale, velocità zero; a 6 secondi scende, velocità negativa
% svg: segno-velocita-tangenti-ebe30b0b.svg 309x220
% poi-interattivo: far scorrere un punto lungo la curva con la sua tangente e leggere il segno e il valore della velocità
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.75, ystep=0.5] (0,0) grid (6.2,4.3);
\draw[->] (0,0) -- (6.6,0) node[right] {$t$ (s)};
\draw[->] (0,0) -- (0,4.7) node[above] {$s$ (m)};
\foreach \x/\t in {1.5/2,3/4,4.5/6,6/8} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/4,2/8,3/12,4/16} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] plot[domain=0:6, samples=40] (\x,{4-0.4444*(\x-3)*(\x-3)});
\draw[thick, orange!90!black] (0.9,2.2) -- (2.1,3.8);
\draw[thick, orange!90!black] (2.3,4) -- (3.7,4);
\draw[thick, orange!90!black] (3.9,3.8) -- (5.1,2.2);
\fill (1.5,3) circle (1.5pt);
\fill (3,4) circle (1.5pt);
\fill (4.5,3) circle (1.5pt);
\node[left] at (1.1,3.2) {\small $v > 0$};
\node[above] at (3,4.05) {\small $v = 0$};
\node[right] at (4.9,3.2) {\small $v < 0$};
\end{tikzpicture}
```

Tra $t = 2\,\text{s}$ e $t = 6\,\text{s}$ il carrello parte e arriva nella stessa posizione, $s = 12\,\text{m}$: la velocità media in quell'intervallo è zero, anche se il carrello è fermo solo in un istante, in cima. La velocità media e la velocità istantanea sono due grandezze diverse; coincidono solo quando la velocità non cambia mai, cioè nel [moto rettilineo uniforme](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-rettilineo-uniforme-e-il-grafico-spazio-tempo).

```ad-warning
Il tachimetro non dà il segno
Il tachimetro segna il valore assoluto della velocità istantanea: un'auto in retromarcia a $5\,\text{km/h}$ e una in avanti a $5\,\text{km/h}$ hanno lo stesso numero sul cruscotto, ma velocità con segno opposto. Il segno viene dal sistema di riferimento, non dallo strumento.
```
