# Proporzionalità diretta e inversa

Se un chilo di mele costa $2{,}40$ €, due chili costano il doppio e tre chili il triplo. Se invece devi percorrere $120$ km, andando al doppio della velocità ci metti metà del tempo. Nel primo caso le due grandezze sono direttamente proporzionali, nel secondo inversamente proporzionali: sono due funzioni con una formula semplice, $y = kx$ e $y = \dfrac{k}{x}$, e riconoscerle ti permette di risolvere un problema senza sbagliare verso. La lezione usa le parole di [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione) e i rapporti di [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).

## Grandezze direttamente proporzionali

Due grandezze variabili $x$ e $y$ sono **direttamente proporzionali** se il loro rapporto è costante, cioè se per ogni coppia di valori corrispondenti, con $x \neq 0$,

$$\dfrac{y}{x} = k$$

dove $k$ è un numero diverso da zero che si chiama **costante di proporzionalità**. Moltiplicando per $x$ i due membri si ottiene la formula della funzione:

$$y = kx$$

Quando $x$ raddoppia, anche $y$ raddoppia; quando $x$ si divide per tre, anche $y$ si divide per tre. In generale, se $x$ viene moltiplicato per un numero, $y$ viene moltiplicato per lo stesso numero.

```ad-example
Esempio: il prezzo delle mele
Le mele costano $2{,}40$ € al chilo. Il prezzo $y$, in euro, dipende dal peso $x$, in chili:

| $x$ (kg) | $1$ | $2$ | $3$ | $5$ |
|---|---|---|---|---|
| $y$ (€) | $2{,}40$ | $4{,}80$ | $7{,}20$ | $12$ |

Il rapporto $\dfrac{y}{x}$ vale sempre $2{,}40$: per esempio $\dfrac{7{,}20}{3} = 2{,}40$ e $\dfrac{12}{5} = 2{,}40$. Le due grandezze sono direttamente proporzionali, con $k = 2{,}40$, e la funzione è $y = 2{,}4x$. La costante ha un significato concreto: è il prezzo di un chilo.
```

### Il grafico: una retta per l'origine

Per disegnare il grafico di una funzione si mettono nel piano cartesiano i punti $(x, y)$ della tabella, come in [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione). Con i punti delle mele, e con tutti gli altri pesi possibili tra un valore e l'altro, si ottiene una semiretta che parte dall'origine: a $0$ kg corrisponde un prezzo di $0$ €.

```tikz
% nome: proporzionalita-diretta-prezzo-mele
% alt: Grafico del prezzo delle mele in funzione del peso: i punti (1; 2,40), (2; 4,80), (3; 7,20) e (5; 12) stanno su una semiretta che parte dall'origine
% svg: proporzionalita-diretta-prezzo-mele-f7ad9c54.svg 304x251
\begin{tikzpicture}
\draw[->] (0,0) -- (5.8,0) node[right] {$x$ (kg)};
\draw[->] (0,0) -- (0,5.4) node[above] {$y$ (euro)};
\foreach \x in {1,2,3,4,5} \draw (\x,0.08) -- (\x,-0.08) node[below] {$\x$};
\foreach \y/\t in {0.96/2{,}40, 1.92/4{,}80, 2.88/7{,}20, 4.8/12} \draw (0.08,\y) -- (-0.08,\y) node[left] {$\t$};
\draw[dashed, gray] (3,0) -- (3,2.88) -- (0,2.88);
\draw[thick, blue!70!black] (0,0) -- (5.5,5.28);
\foreach \x/\y in {1/0.96, 2/1.92, 3/2.88, 5/4.8} \fill (\x,\y) circle (0.07);
\end{tikzpicture}
```

Vale per ogni proporzionalità diretta: il grafico di $y = kx$ è una **retta che passa per l'origine**. La costante $k$ dice quanto è ripida: se $x$ aumenta di $1$, $y$ aumenta di $k$. Con $k$ positivo la retta sale da sinistra a destra, con $k$ negativo scende; nelle grandezze concrete (pesi, prezzi, tempi) $k$ è positivo e si disegna solo la parte con $x \geq 0$.

```tikz
% nome: rette-per-origine-y-uguale-kx
% alt: Tre rette che passano per l'origine: y = 2x, più ripida, y = x/2, meno ripida, e y = -x, che scende da sinistra a destra
% svg: rette-per-origine-y-uguale-kx-72ec9d9b.svg 273x256
\begin{tikzpicture}
\draw[->] (-3,0) -- (3,0) node[right] {$x$};
\draw[->] (0,-3) -- (0,3.2) node[above] {$y$};
\foreach \x in {-2,-1} \draw (\x,-0.08) -- (\x,0.08) node[above] {$\x$};
\foreach \x in {1,2} \draw (\x,0.08) -- (\x,-0.08) node[below] {$\x$};
\foreach \y in {-2,-1} \draw (-0.08,\y) -- (0.08,\y) node[right] {$\y$};
\foreach \y in {1,2} \draw (0.08,\y) -- (-0.08,\y) node[left] {$\y$};
\draw[thick, blue!70!black] (-1.4,-2.8) -- (1.4,2.8) node[right] {$y = 2x$};
\draw[thick, teal!70!black] (-2.8,-1.4) -- (2.8,1.4) node[below right] {$y = \frac{1}{2}x$};
\draw[thick, red!60!black] (-2.6,2.6) -- (2.6,-2.6) node[right] {$y = -x$};
\end{tikzpicture}
```

```ad-warning
Crescere insieme non basta
Due grandezze che aumentano insieme non sono per forza direttamente proporzionali. Con $y = x + 3$, quando $x$ passa da $1$ a $2$, $y$ passa da $4$ a $5$: non raddoppia. Il rapporto $\dfrac{y}{x}$ vale prima $4$ e poi $2{,}5$, quindi non è costante. Il controllo è sempre il rapporto, non il fatto che le due grandezze crescano.
```

## Grandezze inversamente proporzionali

Due grandezze variabili $x$ e $y$, entrambe diverse da zero, sono **inversamente proporzionali** se il loro prodotto è costante:

$$x \cdot y = k$$

con $k$ numero diverso da zero, anche qui chiamato costante di proporzionalità. Dividendo per $x$ si ottiene la funzione:

$$y = \dfrac{k}{x}$$

Quando $x$ raddoppia, $y$ si dimezza; quando $x$ si moltiplica per tre, $y$ si divide per tre. Il valore $x = 0$ non si può usare, perché non si divide per zero.

```ad-example
Esempio: velocità e tempo su 120 km
Un viaggio è lungo $120$ km. Il tempo $t$, in ore, dipende dalla velocità media $v$, in km/h:

| $v$ (km/h) | $20$ | $30$ | $40$ | $60$ | $120$ |
|---|---|---|---|---|---|
| $t$ (h) | $6$ | $4$ | $3$ | $2$ | $1$ |

Il prodotto $v \cdot t$ vale sempre $120$: $20 \cdot 6 = 120$, $30 \cdot 4 = 120$, $40 \cdot 3 = 120$, e così via. Velocità e tempo sono inversamente proporzionali, con $k = 120$, e la funzione è $t = \dfrac{120}{v}$. Qui la costante è la lunghezza del viaggio.
```

### Il grafico: un ramo di iperbole

Con i punti della tabella e con tutte le velocità intermedie si ottiene una curva che scende: più alta è la velocità, più piccolo è il tempo. La curva si avvicina sempre di più ai due assi senza toccarli mai, perché né $v$ né $t$ possono valere zero.

```tikz
% nome: proporzionalita-inversa-velocita-tempo
% alt: Grafico del tempo in funzione della velocità per un viaggio di 120 km: i punti (20; 6), (30; 4), (40; 3), (60; 2) e (120; 1) stanno su una curva che scende e si avvicina agli assi senza toccarli
% svg: proporzionalita-inversa-velocita-tempo-4948d904.svg 346x219
\begin{tikzpicture}[xscale=0.05, yscale=0.6]
\draw[->] (0,0) -- (138,0) node[right] {$v$ (km/h)};
\draw[->] (0,0) -- (0,7.6) node[above] {$t$ (h)};
\foreach \x in {20,40,60,80,100,120} \draw (\x,0.12) -- (\x,-0.12) node[below] {$\x$};
\foreach \y in {1,2,3,4,5,6} \draw (1.6,\y) -- (-1.6,\y) node[left] {$\y$};
\draw[thick, blue!70!black, domain=16.5:132, samples=80, smooth] plot (\x, {120/\x});
\foreach \x/\y in {20/6, 30/4, 40/3, 60/2, 120/1} \fill (\x,\y) ellipse (1.4 and 0.117);
\end{tikzpicture}
```

Il grafico di $y = \dfrac{k}{x}$, con $k$ positivo e $x > 0$, ha sempre questa forma e si chiama **ramo di iperbole**. Nei problemi concreti ti serve solo questo ramo.

```ad-note
L'altro ramo
Come funzione numerica, $y = \dfrac{k}{x}$ è definita per ogni $x \neq 0$, anche per $x$ negativo. Con $k$ positivo, per $x < 0$ anche $y$ è negativo, e il grafico ha un secondo ramo, simmetrico al primo rispetto all'origine. Le due parti insieme formano un'iperbole equilatera, che si studia nella lezione [Iperbole equilatera e funzione omografica](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole-equilatera-e-funzione-omografica).
```

```ad-warning
Diminuire non basta
Due grandezze in cui una cresce e l'altra cala non sono per forza inversamente proporzionali. Con $y = 10 - x$, quando $x$ passa da $2$ a $4$, $y$ passa da $8$ a $6$: non si dimezza. Il prodotto $x \cdot y$ vale prima $16$ e poi $24$. Il controllo è sempre il prodotto.
```

## La proporzionalità quadratica

Una grandezza $y$ è **direttamente proporzionale al quadrato** di $x$ se il rapporto tra $y$ e $x^2$ è costante:

$$\dfrac{y}{x^2} = k \qquad y = kx^2$$

Qui, quando $x$ raddoppia, $y$ diventa quattro volte più grande, perché $2^2 = 4$; quando $x$ triplica, $y$ diventa nove volte più grande. L'area di un quadrato è proporzionale al quadrato del lato, $A = l^2$: un quadrato con il lato doppio ha l'area quattro volte più grande.

```ad-example
Esempio: il prezzo di una pizza
Una pizzeria fa pagare le pizze in proporzione alla loro superficie, che è direttamente proporzionale al quadrato del diametro. Una pizza di $30$ cm di diametro costa $8$ €: quanto costa una pizza di $45$ cm?

Il diametro viene moltiplicato per $\dfrac{45}{30} = 1{,}5$, quindi il prezzo viene moltiplicato per $1{,}5^2 = 2{,}25$:

$$8 \cdot 2{,}25 = 18$$

La pizza grande costa $18$ €, non $12$ €: $12$ € è il prezzo che si ottiene se si tratta il diametro come una grandezza direttamente proporzionale al prezzo.
```

Il grafico di $y = kx^2$ non è una retta: per $x \geq 0$ è metà di una parabola con il vertice nell'origine, la curva che trovi nella lezione [La parabola nel piano cartesiano](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/la-parabola-nel-piano-cartesiano).

## La funzione lineare

Molte situazioni sono quasi una proporzionalità diretta, ma con un valore di partenza. Un taxi chiede $3$ € alla partenza e $1{,}20$ € per ogni chilometro: il prezzo di una corsa di $x$ km è

$$y = 1{,}2x + 3$$

La funzione $y = mx + q$, con $m$ e $q$ numeri fissati, si chiama **funzione lineare**. Quando $q = 0$ torna la proporzionalità diretta $y = mx$; quando $q \neq 0$ le due grandezze non sono proporzionali. Nel taxi, $5$ km costano $9$ € e $10$ km costano $15$ €, non $18$ €: raddoppiando i chilometri il prezzo non raddoppia, perché i $3$ € della partenza si pagano una volta sola.

Sono proporzionali, invece, gli aumenti: ogni chilometro in più costa sempre $1{,}20$ € in più. In una funzione lineare, se $x$ aumenta di $1$, $y$ aumenta sempre di $m$. Il grafico è una retta, parallela a quella di $y = mx$ e spostata in su di $q$: incontra l'asse $y$ nel punto $(0, q)$.

```tikz
% nome: funzione-lineare-taxi
% alt: Due rette parallele: y = 1,2x passa per l'origine, y = 1,2x + 3 è la stessa retta spostata in su di 3 e incontra l'asse y nel punto (0; 3)
% svg: funzione-lineare-taxi-c50dd151.svg 312x239
\begin{tikzpicture}[xscale=0.5, yscale=0.3]
\draw[->] (0,0) -- (11,0) node[right] {$x$ (km)};
\draw[->] (0,0) -- (0,17) node[above] {$y$ (euro)};
\foreach \x in {2,4,6,8,10} \draw (\x,0.25) -- (\x,-0.25) node[below] {$\x$};
\foreach \y in {3,6,9,12,15} \draw (0.15,\y) -- (-0.15,\y) node[left] {$\y$};
\draw[thick, gray] (0,0) -- (10.5,12.6) node[right] {$y = 1{,}2x$};
\draw[thick, blue!70!black] (0,3) -- (10.5,15.6) node[right] {$y = 1{,}2x + 3$};
\fill (0,3) ellipse (0.14 and 0.23);
\fill (5,9) ellipse (0.14 and 0.23);
\fill (10,15) ellipse (0.14 and 0.23);
\end{tikzpicture}
```

La retta e i numeri $m$ e $q$ hanno una lezione tutta loro al secondo anno, [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari): in questa lezione serve solo riconoscere la funzione lineare e distinguerla dalla proporzionalità diretta. Due rette di questo tipo si incontrano, in generale, in un punto: trovarlo vuol dire risolvere un [sistema di due equazioni](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite).

## Riconoscere il tipo da una tabella

Data una tabella di valori, con $x$ sempre diverso da zero, il tipo di legame si riconosce facendo i conti su tutte le coppie.

1. Calcola $\dfrac{y}{x}$ per ogni coppia: se è sempre lo stesso numero $k$, è una proporzionalità diretta, $y = kx$.
2. Altrimenti calcola $x \cdot y$: se è sempre lo stesso numero $k$, è una proporzionalità inversa, $y = \dfrac{k}{x}$.
3. Altrimenti calcola $\dfrac{y}{x^2}$: se è costante, è una proporzionalità quadratica, $y = kx^2$.
4. Altrimenti guarda gli aumenti: se il rapporto tra l'aumento di $y$ e l'aumento di $x$ è sempre lo stesso numero $m$, è una funzione lineare $y = mx + q$, e $q = y - mx$ si ricava da una coppia qualsiasi.
5. Se nessun controllo funziona, la tabella non è di nessuno di questi tipi.

```ad-example
Esempio 1: proporzionalità diretta con i decimali
| $x$ | $2$ | $5$ | $8$ |
|---|---|---|---|
| $y$ | $3$ | $7{,}5$ | $12$ |

$$
\begin{gathered}
\dfrac{3}{2} = 1{,}5 \qquad \dfrac{7{,}5}{5} = 1{,}5 \\
\dfrac{12}{8} = 1{,}5
\end{gathered}
$$

Il rapporto è costante: $y = 1{,}5x$.
```

```ad-example
Esempio 2: proporzionalità inversa
| $x$ | $2$ | $3$ | $4$ | $6$ |
|---|---|---|---|---|
| $y$ | $18$ | $12$ | $9$ | $6$ |

I rapporti $\dfrac{18}{2} = 9$ e $\dfrac{12}{3} = 4$ sono diversi, quindi non è una proporzionalità diretta. I prodotti invece sono uguali:

$$
\begin{gathered}
2 \cdot 18 = 36 \qquad 3 \cdot 12 = 36 \\
4 \cdot 9 = 36 \qquad 6 \cdot 6 = 36
\end{gathered}
$$

È una proporzionalità inversa: $y = \dfrac{36}{x}$.
```

```ad-example
Esempio 3: proporzionalità quadratica
| $x$ | $1$ | $2$ | $3$ | $4$ |
|---|---|---|---|---|
| $y$ | $3$ | $12$ | $27$ | $48$ |

I rapporti $\dfrac{y}{x}$ valgono $3$, $6$, $9$, $12$ e i prodotti $3$, $24$, $81$, $192$: nessuno dei due è costante. Il rapporto con il quadrato sì:

$$
\begin{gathered}
\dfrac{3}{1} = 3 \qquad \dfrac{12}{4} = 3 \\
\dfrac{27}{9} = 3 \qquad \dfrac{48}{16} = 3
\end{gathered}
$$

È una proporzionalità quadratica: $y = 3x^2$. Infatti, quando $x$ passa da $1$ a $2$, $y$ diventa quattro volte più grande.
```

```ad-example
Esempio 4: funzione lineare
| $x$ | $1$ | $2$ | $3$ | $4$ |
|---|---|---|---|---|
| $y$ | $5$ | $7$ | $9$ | $11$ |

I rapporti $\dfrac{y}{x}$ valgono $5$, $3{,}5$, $3$, $2{,}75$; i prodotti $5$, $14$, $27$, $44$; i rapporti $\dfrac{y}{x^2}$ valgono $5$, $1{,}75$, $1$, $0{,}6875$. Nessuno è costante. Gli aumenti sì: ogni volta che $x$ aumenta di $1$, $y$ aumenta di $2$, quindi $m = 2$. Dalla prima coppia:

$$q = 5 - 2 \cdot 1 = 3$$

La funzione è $y = 2x + 3$. Controllo sull'ultima coppia: $2 \cdot 4 + 3 = 11$.
```

```ad-example
Esempio 5: funzione lineare con passi diversi
| $x$ | $1$ | $3$ | $4$ | $6$ |
|---|---|---|---|---|
| $y$ | $4$ | $10$ | $13$ | $19$ |

I valori di $x$ non vanno avanti di $1$ alla volta, quindi non basta guardare gli aumenti di $y$: vanno divisi per gli aumenti di $x$.

$$
\begin{gathered}
\dfrac{10 - 4}{3 - 1} = \dfrac{6}{2} = 3 \\
\dfrac{13 - 10}{4 - 3} = \dfrac{3}{1} = 3 \\
\dfrac{19 - 13}{6 - 4} = \dfrac{6}{2} = 3
\end{gathered}
$$

Quindi $m = 3$, e dalla prima coppia $q = 4 - 3 \cdot 1 = 1$: la funzione è $y = 3x + 1$. Gli aumenti di $y$ da soli, $6$, $3$, $6$, non sono uguali, e avrebbero fatto pensare che la funzione non fosse lineare.
```

```ad-example
Esempio 6: nessuno dei quattro tipi
| $x$ | $1$ | $2$ | $3$ | $4$ |
|---|---|---|---|---|
| $y$ | $2$ | $5$ | $10$ | $17$ |

Rapporti $\dfrac{y}{x}$: $2$, $2{,}5$, $\dfrac{10}{3}$, $4{,}25$. Prodotti: $2$, $10$, $30$, $68$. Rapporti $\dfrac{y}{x^2}$: $2$, $1{,}25$, $\dfrac{10}{9}$, $1{,}0625$. Aumenti di $y$, con $x$ che aumenta di $1$: $3$, $5$, $7$. Nessun controllo dà un numero costante, quindi la tabella non è di nessuno dei quattro tipi. I valori seguono la formula $y = x^2 + 1$.
```

```ad-warning
Controllare solo due coppie
Due coppie non bastano per decidere. Nella tabella $x = 1, 2, 4$ e $y = 4, 8, 20$ le prime due coppie hanno rapporto $4$, ma la terza ha rapporto $\dfrac{20}{4} = 5$: le grandezze non sono direttamente proporzionali. Il controllo va fatto su tutte le coppie.
```

## Problemi con la proporzionalità

In un problema, prima di fare qualsiasi conto, chiediti che cosa succede a una grandezza se l'altra raddoppia: se raddoppia anche lei, la proporzionalità è diretta; se si dimezza, è inversa. Poi calcola la costante $k$ con i dati e usala per trovare il valore che manca.

```ad-example
Esempio 1: prezzo e quantità
$6$ quaderni costano $9$ €. Quanto costano $14$ quaderni?

Il doppio dei quaderni costa il doppio: la proporzionalità è diretta. La costante è il prezzo di un quaderno:

$$
\begin{gathered}
k = \dfrac{9}{6} = 1{,}5 \\
y = 1{,}5 \cdot 14 = 21
\end{gathered}
$$

$14$ quaderni costano $21$ €. Con la proporzione di [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali) il conto è lo stesso: $6 : 14 = 9 : x$ dà $6x = 126$ e $x = 21$.
```

```ad-example
Esempio 2: velocità e tempo
A $80$ km/h un viaggio dura $3$ ore. Quanto dura a $120$ km/h? E a che velocità bisogna andare per metterci $2$ ore e mezza?

Al doppio della velocità si impiega metà del tempo: la proporzionalità è inversa. La costante è il prodotto, cioè la lunghezza del viaggio:

$$
\begin{gathered}
k = 80 \cdot 3 = 240 \\
t = \dfrac{240}{120} = 2
\end{gathered}
$$

A $120$ km/h il viaggio dura $2$ ore. Per la seconda domanda il tempo va scritto in ore: $2$ ore e mezza sono $2{,}5$ ore, non $2{,}30$.

$$v = \dfrac{240}{2{,}5} = 96$$

Bisogna andare a $96$ km/h.
```

```ad-example
Esempio 3: operai e giorni
$6$ operai finiscono un lavoro in $10$ giorni. Quanti giorni servono a $4$ operai? E a $8$?

Con il doppio degli operai il lavoro dura la metà dei giorni: la proporzionalità è inversa. La costante è il prodotto $6 \cdot 10 = 60$, cioè il lavoro misurato in giorni di lavoro di un operaio.

$$
\begin{gathered}
\text{4 operai: } \dfrac{60}{4} = 15 \\
\text{8 operai: } \dfrac{60}{8} = 7{,}5
\end{gathered}
$$

Servono $15$ giorni a $4$ operai e $7{,}5$ giorni, cioè sette giorni e mezzo, a $8$ operai.
```

```ad-warning
La proporzione diretta nei problemi inversi
Scrivere $6 : 4 = 10 : x$ per gli operai dà $x = \dfrac{20}{3}$, circa $6{,}7$ giorni: meno operai finirebbero prima, il che è assurdo. Con grandezze inversamente proporzionali, se vuoi una proporzione, i valori della seconda grandezza vanno scritti in ordine inverso: $6 : 4 = x : 10$, che dà $x = 15$. Il modo più sicuro resta calcolare il prodotto costante.
```

```ad-example
Esempio 4: operai che cambiano a metà lavoro
$12$ operai devono finire un lavoro in $15$ giorni. Dopo $5$ giorni, $4$ operai vengono spostati su un altro cantiere. Quanti giorni dura in tutto il lavoro?

Il lavoro intero vale $12 \cdot 15 = 180$ giorni di lavoro di un operaio. Nei primi $5$ giorni ne sono stati fatti $12 \cdot 5 = 60$, quindi ne restano $120$, e ora gli operai sono $12 - 4 = 8$:

$$\dfrac{120}{8} = 15$$

Servono altri $15$ giorni, e il lavoro dura in tutto $5 + 15 = 20$ giorni. Non si può usare la proporzionalità inversa sul lavoro intero ($\dfrac{180}{8} = 22{,}5$ giorni), perché per $5$ giorni gli operai erano $12$.
```

Quando il problema porta a un'equazione con l'incognita in un posto meno comodo, il metodo per impostarla è nella lezione [Problemi con le equazioni](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/problemi-con-le-equazioni).
