# Indici di variabilità

Marta e Luca hanno preso questi voti nelle ultime cinque verifiche di matematica:

$$
\begin{gathered}
\text{Marta: } 6, \ 7, \ 7, \ 7, \ 8 \\
\text{Luca: } 4, \ 6, \ 7, \ 9, \ 9
\end{gathered}
$$

Tutti e due hanno la media del $7$, e anche la mediana è $7$ per entrambi (media e mediana sono nella lezione [Media, mediana e moda](/materiale/scuola-superiore/matematica/statistica/media-mediana-e-moda)). Eppure i due andamenti sono diversi: i voti di Marta stanno tutti vicino al $7$, quelli di Luca vanno dal $4$ al $9$. Un indice di posizione come la media dice attorno a quale valore stanno i dati, ma non quanto sono sparpagliati. Per questo servono gli **indici di variabilità**, numeri che misurano quanto i dati si allontanano l'uno dall'altro o dalla media: più sono grandi, più i dati sono dispersi.

```tikz
% nome: voti-marta-luca-stessa-media
% alt: Due rette dei numeri da 4 a 10, una per Marta e una per Luca: i voti di Marta sono raccolti vicino al 7, quelli di Luca sono sparsi da 4 a 9, e una linea tratteggiata segna la media 7, uguale per entrambi
% svg: voti-marta-luca-stessa-media-c056d06e.svg 253x146
\begin{tikzpicture}[x=0.75cm, y=0.75cm]
\draw[->] (3.4,2.2) -- (10.6,2.2);
\draw[->] (3.4,0) -- (10.6,0);
\draw (4,2.1) -- (4,2.3);
\draw (5,2.1) -- (5,2.3);
\draw (6,2.1) -- (6,2.3);
\draw (7,2.1) -- (7,2.3);
\draw (8,2.1) -- (8,2.3);
\draw (9,2.1) -- (9,2.3);
\draw (10,2.1) -- (10,2.3);
\draw (4,-0.1) -- (4,0.1);
\draw (5,-0.1) -- (5,0.1);
\draw (6,-0.1) -- (6,0.1);
\draw (7,-0.1) -- (7,0.1);
\draw (8,-0.1) -- (8,0.1);
\draw (9,-0.1) -- (9,0.1);
\draw (10,-0.1) -- (10,0.1);
\node[below] at (4,-0.1) {$4$};
\node[below] at (5,-0.1) {$5$};
\node[below] at (6,-0.1) {$6$};
\node[below] at (7,-0.1) {$7$};
\node[below] at (8,-0.1) {$8$};
\node[below] at (9,-0.1) {$9$};
\node[below] at (10,-0.1) {$10$};
\node[left] at (3.4,2.2) {Marta};
\node[left] at (3.4,0) {Luca};
\draw[dashed, gray] (7,-0.1) -- (7,3.7);
\node[above] at (7,3.7) {$\bar{x} = 7$};
\filldraw[fill=blue!30, draw=blue!60] (6,2.5) circle (0.13);
\filldraw[fill=blue!30, draw=blue!60] (7,2.5) circle (0.13);
\filldraw[fill=blue!30, draw=blue!60] (7,2.85) circle (0.13);
\filldraw[fill=blue!30, draw=blue!60] (7,3.2) circle (0.13);
\filldraw[fill=blue!30, draw=blue!60] (8,2.5) circle (0.13);
\filldraw[fill=orange!35, draw=orange!70] (4,0.3) circle (0.13);
\filldraw[fill=orange!35, draw=orange!70] (6,0.3) circle (0.13);
\filldraw[fill=orange!35, draw=orange!70] (7,0.3) circle (0.13);
\filldraw[fill=orange!35, draw=orange!70] (9,0.3) circle (0.13);
\filldraw[fill=orange!35, draw=orange!70] (9,0.65) circle (0.13);
\end{tikzpicture}
```

Nella lezione i dati sono $x_1, x_2, \dots, x_n$, $n$ è il loro numero e $\bar{x}$ è la loro media aritmetica.

## Il campo di variazione

Il **campo di variazione** (in inglese *range*) è la differenza tra il valore più grande e il valore più piccolo dei dati:

$$x_{\max} - x_{\min}$$

Per Marta è $8 - 6 = 2$, per Luca è $9 - 4 = 5$: i voti di Luca coprono un intervallo più largo.

Il campo di variazione si calcola in un attimo, ma guarda solo due dati, i due estremi, e non dice niente di come sono distribuiti gli altri. Per questo un solo valore anomalo lo può cambiare di molto: se Marta prende un $2$ in una sesta verifica, il suo campo di variazione passa da $2$ a $8 - 2 = 6$, anche se gli altri cinque voti restano vicini al $7$.

```ad-warning
Il campo di variazione con i numeri negativi
Con le temperature $-4$ °C, $1$ °C, $5$ °C il campo di variazione è $5 - (-4) = 9$ °C, non $5 - 4 = 1$ °C. Si sottrae il minimo con il suo segno.
```

## Gli scarti dalla media

Per tenere conto di tutti i dati si guarda quanto ognuno si allontana dalla media. Lo **scarto dalla media** di un dato $x_i$ è la differenza

$$x_i - \bar{x}$$

Lo scarto è positivo se il dato è sopra la media, negativo se è sotto, zero se è uguale alla media. Per Luca, con $\bar{x} = 7$, gli scarti sono:

$$
\begin{gathered}
4 - 7 = -3 \qquad 6 - 7 = -1 \\
7 - 7 = 0 \qquad 9 - 7 = 2 \\
9 - 7 = 2
\end{gathered}
$$

```tikz
% nome: scarti-dalla-media-voti-luca
% alt: I cinque voti di Luca, 4, 6, 7, 9 e 9, disegnati su righe diverse sopra una retta dei numeri, ognuno collegato alla media 7 da una freccia che parte dalla linea tratteggiata della media: le frecce valgono meno 3, meno 1, 0, più 2 e più 2
% svg: scarti-dalla-media-voti-luca-05f86cc8.svg 208x168
\begin{tikzpicture}[x=0.75cm, y=0.75cm]
\draw[->] (3.4,0) -- (10.6,0);
\draw (4,-0.15) -- (4,0.15);
\draw (5,-0.15) -- (5,0.15);
\draw (6,-0.15) -- (6,0.15);
\draw (7,-0.15) -- (7,0.15);
\draw (8,-0.15) -- (8,0.15);
\draw (9,-0.15) -- (9,0.15);
\draw (10,-0.15) -- (10,0.15);
\node[below] at (4,-0.15) {$4$};
\node[below] at (5,-0.15) {$5$};
\node[below] at (6,-0.15) {$6$};
\node[below] at (7,-0.15) {$7$};
\node[below] at (8,-0.15) {$8$};
\node[below] at (9,-0.15) {$9$};
\node[below] at (10,-0.15) {$10$};
\draw[dashed, gray] (7,0) -- (7,4.4);
\node[above] at (7,4.4) {$\bar{x} = 7$};
\draw[->, thick, orange!70] (7,3.75) -- (4.2,3.75);
\draw[->, thick, orange!70] (7,3) -- (6.2,3);
\draw[->, thick, orange!70] (7,1.5) -- (8.8,1.5);
\draw[->, thick, orange!70] (7,0.75) -- (8.8,0.75);
\filldraw[fill=orange!35, draw=orange!70] (4,3.75) circle (0.13);
\filldraw[fill=orange!35, draw=orange!70] (6,3) circle (0.13);
\filldraw[fill=orange!35, draw=orange!70] (7,2.25) circle (0.13);
\filldraw[fill=orange!35, draw=orange!70] (9,1.5) circle (0.13);
\filldraw[fill=orange!35, draw=orange!70] (9,0.75) circle (0.13);
\node[above] at (5.5,3.75) {$-3$};
\node[above] at (6.5,3) {$-1$};
\node[right] at (7.2,2.25) {$0$};
\node[above] at (8,1.5) {$+2$};
\node[above] at (8,0.75) {$+2$};
\end{tikzpicture}
```

La somma degli scarti è $-3 - 1 + 0 + 2 + 2 = 0$. Non è un caso: la somma degli scarti dalla media è sempre zero, come trovi nella lezione [Media, mediana e moda](/materiale/scuola-superiore/matematica/statistica/media-mediana-e-moda), perché gli scarti positivi compensano esattamente quelli negativi. Quindi anche la media degli scarti è sempre zero, per Marta come per Luca, e non misura niente. Per ottenere un indice utile bisogna togliere il segno agli scarti: con il valore assoluto si ottiene lo scarto semplice medio, con il quadrato la varianza.

```ad-tip
La somma degli scarti come controllo
Dopo aver calcolato gli scarti, sommali: se non viene zero, c'è un errore nella media o in uno scarto.
```

## Lo scarto semplice medio

Lo **scarto semplice medio** $S$ è la media aritmetica dei valori assoluti degli scarti:

$$S = \frac{|x_1 - \bar{x}| + \dots + |x_n - \bar{x}|}{n}$$

Il [valore assoluto](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto) di uno scarto è la distanza del dato dalla media, senza segno. Lo scarto semplice medio è allora la distanza media dei dati dalla media. Per Luca:

$$
\begin{aligned}
S &= \frac{3 + 1 + 0 + 2 + 2}{5} \\
&= \frac{8}{5} = 1{,}6
\end{aligned}
$$

Per Marta gli scarti sono $-1$, $0$, $0$, $0$, $1$, quindi $S = \dfrac{1 + 0 + 0 + 0 + 1}{5} = \dfrac{2}{5} = 0{,}4$. In media un voto di Luca si allontana dal $7$ di $1{,}6$ punti, uno di Marta di $0{,}4$ punti.

```ad-warning
Dimenticare il valore assoluto
Chi fa la media degli scarti con il loro segno trova sempre $0$, qualunque siano i dati. Nello scarto semplice medio tutti gli addendi del numeratore sono positivi o zero.
```

## La varianza

Il secondo modo di togliere il segno è elevare al quadrato: il quadrato di un numero negativo è positivo, come nelle [potenze in ℤ](/materiale/scuola-superiore/matematica/numeri-interi/potenze-in-z). La **varianza** $\sigma^2$ è la media aritmetica dei quadrati degli scarti:

$$\sigma^2 = \frac{(x_1 - \bar{x})^2 + \dots + (x_n - \bar{x})^2}{n}$$

Il simbolo $\sigma$ è la lettera greca sigma minuscola, e $\sigma^2$ si legge "sigma quadro". Per Luca i quadrati degli scarti sono $(-3)^2 = 9$, $(-1)^2 = 1$, $0^2 = 0$, $2^2 = 4$, $2^2 = 4$:

$$
\begin{aligned}
\sigma^2 &= \frac{9 + 1 + 0 + 4 + 4}{5} \\
&= \frac{18}{5} = 3{,}6
\end{aligned}
$$

Per Marta i quadrati sono $1$, $0$, $0$, $0$, $1$ e $\sigma^2 = \dfrac{2}{5} = 0{,}4$.

Il quadrato pesa di più gli scarti grandi: uno scarto di $3$ conta $9$, uno scarto di $1$ conta $1$. La varianza però ha un difetto: si misura nel quadrato dell'unità dei dati. Se i dati sono in centimetri la varianza è in centimetri quadrati, e per i voti di Luca $3{,}6$ non si confronta a colpo d'occhio con i voti stessi. Per tornare all'unità dei dati si fa l'operazione inversa del quadrato, la radice quadrata.

```ad-warning
Il quadrato di uno scarto negativo
$(-3)^2 = 9$, non $-9$. Sulla calcolatrice scrivi le parentesi: se digiti $-3^2$ la calcolatrice eleva al quadrato solo il $3$ e dà $-9$.
```

## La radice quadrata

La **radice quadrata** di un numero $a$ positivo o nullo, che si scrive $\sqrt{a}$, è il numero positivo o nullo che elevato al quadrato dà $a$:

$$\sqrt{a} = b \quad \text{se} \quad b^2 = a, \ b \geq 0$$

Per esempio $\sqrt{49} = 7$ perché $7^2 = 49$, $\sqrt{0{,}36} = 0{,}6$ perché $0{,}6^2 = 0{,}36$, e $\sqrt{0} = 0$. Anche $(-7)^2 = 49$, ma la radice quadrata è per definizione il numero positivo, quindi $\sqrt{49} = 7$ e non $-7$.

Un numero negativo non ha radice quadrata, perché nessun numero elevato al quadrato dà un risultato negativo. La varianza è una somma di quadrati divisa per $n$, quindi non è mai negativa e la sua radice esiste sempre.

Quasi sempre la radice quadrata non è un numero intero né un decimale finito: in quel caso si calcola con il tasto $\sqrt{\phantom{x}}$ della calcolatrice e si arrotonda. Per esempio la calcolatrice dà $\sqrt{2} = 1{,}41421\dots$, che al centesimo diventa $\sqrt{2} \approx 1{,}41$. Per controllare, eleva al quadrato il risultato: $1{,}41^2 = 1{,}9881$, molto vicino a $2$. I numeri come $\sqrt{2}$ e le regole di calcolo con le radici si studiano al secondo anno, nella lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta); in questa lezione la radice serve solo per passare dalla varianza allo scarto quadratico medio.

## Lo scarto quadratico medio

Lo **scarto quadratico medio** $\sigma$, detto anche **deviazione standard**, è la radice quadrata della varianza:

$$\sigma = \sqrt{\sigma^2}$$

Si misura nella stessa unità dei dati, ed è l'indice di variabilità più usato. Per Luca e per Marta, con la calcolatrice e arrotondando al centesimo:

$$
\begin{gathered}
\sigma_{\text{Luca}} = \sqrt{3{,}6} \approx 1{,}90 \\
\sigma_{\text{Marta}} = \sqrt{0{,}4} \approx 0{,}63
\end{gathered}
$$

I voti delle due serie hanno la stessa media, ma quelli di Luca sono molto più dispersi: il suo scarto quadratico medio è tre volte quello di Marta.

Lo scarto quadratico medio è zero solo quando tutti i dati sono uguali, e quindi tutti gli scarti sono zero; in ogni altro caso è positivo. Più è grande, più i dati sono lontani dalla media.

```ad-warning
Fermarsi alla varianza
La varianza dei voti di Luca è $3{,}6$, lo scarto quadratico medio è $\sqrt{3{,}6} \approx 1{,}90$. Se il problema chiede lo scarto quadratico medio, o la deviazione standard, dopo la varianza serve ancora la radice.
```

```ad-tip
Un controllo veloce
Lo scarto quadratico medio non è mai più piccolo dello scarto semplice medio: per Luca $1{,}90 \geq 1{,}6$, per Marta $0{,}63 \geq 0{,}4$. Se ti viene $\sigma < S$, c'è un errore.
```

```ad-note
Due tasti sulla calcolatrice
Le calcolatrici scientifiche in modalità statistica calcolano lo scarto quadratico medio da sole, ma spesso con due tasti diversi: $\sigma_x$ (a volte $\sigma_n$) divide per $n$, come in questa lezione; $s_x$ (a volte $\sigma_{n-1}$) divide per $n - 1$ e dà un numero un po' più grande, che si usa quando i dati sono un campione. Per gli esercizi di questa lezione usa $\sigma_x$.
```

## Come si calcola con una tabella

Con più di tre o quattro dati conviene mettere i conti in una tabella, una riga per dato:

1. Calcola la media $\bar{x}$.
2. In una colonna scrivi gli scarti $x_i - \bar{x}$ e controlla che la loro somma sia zero.
3. In un'altra colonna scrivi i valori assoluti degli scarti, per lo scarto semplice medio, oppure i loro quadrati, per la varianza.
4. Somma la colonna e dividi per $n$: ottieni $S$ oppure $\sigma^2$.
5. Per lo scarto quadratico medio calcola $\sigma = \sqrt{\sigma^2}$.

Quando i dati sono raccolti in una tabella di frequenze (come nella lezione [Dati, frequenze e grafici](/materiale/scuola-superiore/matematica/statistica/dati-frequenze-e-grafici)), il valore $x_i$ compare $f_i$ volte, e il suo scarto al quadrato va contato $f_i$ volte: nella tabella si aggiunge una colonna con il prodotto $(x_i - \bar{x})^2 \cdot f_i$. Con $k$ valori diversi $x_1, \dots, x_k$ e frequenze assolute $f_1, \dots, f_k$:

$$\sigma^2 = \frac{(x_1 - \bar{x})^2 f_1 + \dots + (x_k - \bar{x})^2 f_k}{n}$$

dove $n = f_1 + \dots + f_k$ è il numero totale dei dati. Lo stesso vale per lo scarto semplice medio, con $|x_i - \bar{x}| \cdot f_i$. La media si calcola come media ponderata, con le frequenze come pesi.

## Esempi svolti

```ad-example
Esempio 1: tutti gli indici di una serie di dati
Le ore di sport in una settimana di otto amici sono $2$, $4$, $4$, $4$, $5$, $5$, $7$, $9$. Calcola il campo di variazione, lo scarto semplice medio e lo scarto quadratico medio.

Il campo di variazione è $9 - 2 = 7$ ore. La media è

$$\bar{x} = \frac{40}{8} = 5$$

| $x_i$ | $x_i - \bar{x}$ | $\lvert x_i - \bar{x} \rvert$ | $(x_i - \bar{x})^2$ |
|---|---|---|---|
| $2$ | $-3$ | $3$ | $9$ |
| $4$ | $-1$ | $1$ | $1$ |
| $4$ | $-1$ | $1$ | $1$ |
| $4$ | $-1$ | $1$ | $1$ |
| $5$ | $0$ | $0$ | $0$ |
| $5$ | $0$ | $0$ | $0$ |
| $7$ | $2$ | $2$ | $4$ |
| $9$ | $4$ | $4$ | $16$ |
| somma | $0$ | $12$ | $32$ |

La somma degli scarti è zero: la media è giusta. Dividi le altre due somme per $8$:

$$
\begin{gathered}
S = \frac{12}{8} = 1{,}5 \\
\sigma^2 = \frac{32}{8} = 4 \\
\sigma = \sqrt{4} = 2
\end{gathered}
$$

Lo scarto semplice medio è $1{,}5$ ore, lo scarto quadratico medio $2$ ore.
```

```ad-example
Esempio 2: dati in una tabella di frequenze
In $20$ partite una squadra ha segnato questi gol. Calcola lo scarto quadratico medio.

| gol $x_i$ | $0$ | $1$ | $2$ | $3$ | $4$ |
|---|---|---|---|---|---|
| partite $f_i$ | $2$ | $5$ | $6$ | $5$ | $2$ |

La media ponderata è

$$
\begin{aligned}
\bar{x} &= \frac{0 + 5 + 12 + 15 + 8}{20} \\
&= \frac{40}{20} = 2
\end{aligned}
$$

| $x_i$ | $f_i$ | $(x_i - \bar{x})^2$ | $(x_i - \bar{x})^2 f_i$ |
|---|---|---|---|
| $0$ | $2$ | $4$ | $8$ |
| $1$ | $5$ | $1$ | $5$ |
| $2$ | $6$ | $0$ | $0$ |
| $3$ | $5$ | $1$ | $5$ |
| $4$ | $2$ | $4$ | $8$ |
| somma | $20$ | | $26$ |

$$
\begin{gathered}
\sigma^2 = \frac{26}{20} = 1{,}3 \\
\sigma = \sqrt{1{,}3} \approx 1{,}14
\end{gathered}
$$

Lo scarto quadratico medio è circa $1{,}14$ gol.
```

```ad-warning
Dividere per il numero delle righe
Nell'esempio 2 i dati sono $20$, uno per partita, anche se la tabella ha solo $5$ righe. Si divide per $n = 20$, la somma delle frequenze: dividendo per $5$ si otterrebbe $\sigma^2 = 5{,}2$, un numero senza significato.
```

```ad-example
Esempio 3: dati negativi
Le temperature minime di una settimana sono state $-2$, $-1$, $0$, $1$, $3$, $4$, $2$ gradi. Calcola il campo di variazione e lo scarto quadratico medio.

Il campo di variazione è $4 - (-2) = 6$ °C. La media è

$$
\begin{aligned}
\bar{x} &= \frac{-2 - 1 + 0 + 1 + 3 + 4 + 2}{7} \\
&= \frac{7}{7} = 1
\end{aligned}
$$

Gli scarti si calcolano con i segni: $-2 - 1 = -3$, $-1 - 1 = -2$, e così via.

| $x_i$ | $x_i - \bar{x}$ | $(x_i - \bar{x})^2$ |
|---|---|---|
| $-2$ | $-3$ | $9$ |
| $-1$ | $-2$ | $4$ |
| $0$ | $-1$ | $1$ |
| $1$ | $0$ | $0$ |
| $3$ | $2$ | $4$ |
| $4$ | $3$ | $9$ |
| $2$ | $1$ | $1$ |
| somma | $0$ | $28$ |

$$
\begin{gathered}
\sigma^2 = \frac{28}{7} = 4 \\
\sigma = \sqrt{4} = 2
\end{gathered}
$$

Lo scarto quadratico medio è $2$ °C.
```

```ad-example
Esempio 4: media con la virgola
In quattro giorni un autobus è arrivato con $3$, $5$, $6$ e $8$ minuti di ritardo. Calcola lo scarto quadratico medio.

$$\bar{x} = \frac{3 + 5 + 6 + 8}{4} = \frac{22}{4} = 5{,}5$$

| $x_i$ | $x_i - \bar{x}$ | $(x_i - \bar{x})^2$ |
|---|---|---|
| $3$ | $-2{,}5$ | $6{,}25$ |
| $5$ | $-0{,}5$ | $0{,}25$ |
| $6$ | $0{,}5$ | $0{,}25$ |
| $8$ | $2{,}5$ | $6{,}25$ |
| somma | $0$ | $13$ |

$$
\begin{gathered}
\sigma^2 = \frac{13}{4} = 3{,}25 \\
\sigma = \sqrt{3{,}25} \approx 1{,}80
\end{gathered}
$$

Lo scarto quadratico medio è circa $1{,}80$ minuti.
```

```ad-note
Un altro modo di calcolare la varianza
La varianza è anche uguale alla media dei quadrati dei dati meno il quadrato della media. Con i dati dell'esempio 4:

$$
\begin{aligned}
\sigma^2 &= \frac{9 + 25 + 36 + 64}{4} - 5{,}5^2 \\
&= 33{,}5 - 30{,}25 = 3{,}25
\end{aligned}
$$

Il risultato è lo stesso, e non servono gli scarti: è comodo quando la media ha molte cifre dopo la virgola.
```

```ad-example
Esempio 5: stessa media, stesso campo di variazione
In cinque partite di basket Anna ha segnato $1$, $5$, $5$, $5$, $9$ punti, Bea $1$, $1$, $5$, $9$, $9$ punti. Quale delle due è più regolare?

Entrambe hanno media $\bar{x} = \dfrac{25}{5} = 5$ e campo di variazione $9 - 1 = 8$: questi due indici non le distinguono.

Gli scarti di Anna sono $-4$, $0$, $0$, $0$, $4$; quelli di Bea $-4$, $-4$, $0$, $4$, $4$.

$$
\begin{gathered}
\sigma^2_{\text{Anna}} = \frac{16 + 16}{5} = 6{,}4 \\
\sigma^2_{\text{Bea}} = \frac{16 \cdot 4}{5} = 12{,}8
\end{gathered}
$$

Quindi $\sigma_{\text{Anna}} = \sqrt{6{,}4} \approx 2{,}53$ punti e $\sigma_{\text{Bea}} = \sqrt{12{,}8} \approx 3{,}58$ punti. Anna è più regolare: tre partite su cinque le ha chiuse proprio sulla media, mentre Bea in quattro partite su cinque si è allontanata di $4$ punti dalla media.
```

## Quale indice usare

Il campo di variazione è il più veloce da calcolare e va bene per un primo sguardo, ma dipende solo dai due dati estremi e un valore anomalo lo cambia molto. Lo scarto semplice medio e lo scarto quadratico medio usano tutti i dati: il primo ha il significato più intuitivo, la distanza media dalla media, il secondo è quello che usano le calcolatrici, i fogli di calcolo e quasi tutta la statistica che studierai dopo. Per confrontare due serie di dati misurate nella stessa unità, come nell'esempio 5, si confrontano gli scarti quadratici medi: ha dati più dispersi quella con $\sigma$ più grande.
