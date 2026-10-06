# Successioni numeriche

I numeri pari $2, 4, 6, 8, \dots$, i giorni che mancano alle vacanze, i soldi in un salvadanaio in cui ogni settimana metti qualcosa: sono elenchi ordinati di numeri, in cui ha senso chiedere qual è il primo, qual è il decimo, quale viene dopo. Un elenco così si chiama successione. Descriverla con una formula ti serve subito per le [progressioni aritmetiche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/progressioni-aritmetiche) e le [progressioni geometriche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/progressioni-geometriche), che sono le successioni più usate.

Per seguire la lezione ti servono la [definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione) e, in un esempio, le [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado).

## Che cos'è una successione

Una **successione numerica** è una funzione che a ogni numero naturale $n \geq 1$ associa un numero reale. Il numero associato a $n$ non si scrive $f(n)$, come per le altre funzioni, ma $a_n$, che si legge "a con $n$". I numeri

$$a_1,\ a_2,\ a_3,\ \dots,\ a_n,\ \dots$$

sono i **termini** della successione: $a_1$ è il primo termine, $a_2$ il secondo, e così via. Il numero $n$ scritto in basso si chiama **indice** e dice il posto che il termine occupa nell'elenco.

Nella successione dei numeri pari il primo termine è $a_1 = 2$, il secondo è $a_2 = 4$, il terzo è $a_3 = 6$: il termine di posto $n$ è il doppio del suo indice, $a_n = 2n$. Con questa formula trovi qualunque termine senza scrivere quelli che lo precedono: il centesimo numero pari è $a_{100} = 200$.

Una successione ha infiniti termini, uno per ogni indice, e i puntini in fondo all'elenco lo ricordano. Lo stesso numero può comparire più volte: nella successione $1, 0, 1, 0, 1, 0, \dots$ i termini sono infiniti, anche se i valori sono soltanto due.

```ad-warning
Una successione non è un insieme
Nell'insieme $\{0, 1\}$ l'ordine non conta e ogni elemento si scrive una volta sola. Nella successione $1, 0, 1, 0, \dots$ l'ordine conta e le ripetizioni anche: $a_1 = 1$ e $a_2 = 0$, e scambiandoli ottieni un'altra successione.
```

```ad-note
Da quale indice si parte
In queste lezioni il primo termine è $a_1$, così l'indice coincide con il posto: $a_5$ è il quinto termine. Alcuni libri partono da $a_0$; in quel caso $a_5$ è il sesto termine. Quando leggi un esercizio, guarda sempre da quale indice parte.
```

## Come si assegna una successione

Assegnare una successione vuol dire dare una regola che permette di trovare ogni suo termine. Le regole più usate sono due: una formula che dà $a_n$ a partire da $n$, oppure una formula che dà ogni termine a partire dal precedente.

### Con il termine generale

Il **termine generale** di una successione è l'espressione di $a_n$ in funzione dell'indice $n$. Per calcolare un termine sostituisci a $n$ il suo indice, come quando calcoli il valore di una funzione.

```ad-example
Esempio 1: calcolare i termini
Scrivi i primi cinque termini e il decimo termine della successione $a_n = n^2 - 3n$.

Sostituisci a $n$ i valori $1, 2, 3, 4, 5$:

$$
\begin{gathered}
a_1 = 1 - 3 = -2 \\
a_2 = 4 - 6 = -2 \\
a_3 = 9 - 9 = 0 \\
a_4 = 16 - 12 = 4 \\
a_5 = 25 - 15 = 10
\end{gathered}
$$

La successione comincia con $-2, -2, 0, 4, 10, \dots$ Il decimo termine si calcola allo stesso modo, senza passare per quelli intermedi:

$$a_{10} = 100 - 30 = 70$$
```

Anche l'indice può essere un'espressione. Il termine $a_{n+1}$ è quello che viene subito dopo $a_n$, e si ottiene scrivendo $n + 1$ al posto di $n$ in tutta la formula. Per $a_n = n^2 - 3n$:

$$
\begin{aligned}
a_{n+1} &= (n + 1)^2 - 3(n + 1) \\
&= n^2 + 2n + 1 - 3n - 3 \\
&= n^2 - n - 2
\end{aligned}
$$

```ad-warning
Il termine successivo non è il termine più uno
$a_{n+1}$ è il termine di posto $n + 1$; $a_n + 1$ è il termine di posto $n$ aumentato di $1$. Per $a_n = n^2 - 3n$ il primo è $n^2 - n - 2$ e il secondo è $n^2 - 3n + 1$. Con $n = 4$: $a_5 = 10$, mentre $a_4 + 1 = 5$.
```

La domanda inversa è capire se un numero dato è un termine della successione. Si scrive l'equazione $a_n = \text{numero}$ con incognita $n$ e si accettano solo le soluzioni che sono numeri naturali maggiori o uguali a $1$, perché $n$ è un posto nell'elenco.

```ad-example
Esempio 2: un numero è un termine della successione?
Stabilisci se $40$ e $20$ sono termini della successione $a_n = n^2 - 3n$.

Per $40$ risolvi l'equazione $n^2 - 3n = 40$:

$$
\begin{gathered}
n^2 - 3n - 40 = 0 \\
\Delta = 9 + 160 = 169 \\
n = \frac{3 \pm 13}{2}
\end{gathered}
$$

Le soluzioni sono $-5$ e $8$. Un indice negativo non ha significato, quindi resta $n = 8$: il numero $40$ è l'ottavo termine, $a_8 = 64 - 24 = 40$.

Per $20$ l'equazione è $n^2 - 3n - 20 = 0$, con $\Delta = 9 + 80 = 89$. Poiché $89$ non è un quadrato perfetto, le soluzioni sono irrazionali e nessuna è un numero naturale: $20$ non è un termine della successione. Infatti $a_6 = 18$ e $a_7 = 28$, e $20$ cade tra i due.
```

Nelle successioni in cui i segni si alternano compare spesso il fattore $(-1)^n$, che vale $1$ quando $n$ è pari e $-1$ quando $n$ è dispari, come hai visto nella lezione [Potenze in ℤ](/materiale/scuola-superiore/matematica/numeri-interi/potenze-in-z).

```ad-example
Esempio 3: una successione a segni alterni
Scrivi i primi cinque termini della successione $a_n = \dfrac{(-1)^n}{n}$.

Il numeratore vale $-1$ per $n$ dispari e $1$ per $n$ pari:

$$a_1 = -1, \quad a_2 = \frac{1}{2}, \quad a_3 = -\frac{1}{3}, \quad a_4 = \frac{1}{4}, \quad a_5 = -\frac{1}{5}$$

I termini di posto dispari sono negativi e quelli di posto pari sono positivi. Con $(-1)^{n+1}$ al numeratore i segni si scambiano, e il primo termine diventa positivo.
```

### Per ricorsione

Una successione è definita **per ricorsione** quando si danno il primo termine e una formula che permette di calcolare ogni termine a partire dal precedente. La formula che lega $a_{n+1}$ ad $a_n$ si chiama **legge di ricorrenza**.

```ad-example
Esempio 4: i termini di una successione ricorsiva
Scrivi i primi cinque termini della successione

$$
\begin{cases}
a_1 = 3 \\
a_{n+1} = 2a_n - 1
\end{cases}
$$

La legge dice che ogni termine è il doppio del precedente, diminuito di $1$. Parti da $a_1 = 3$ e applicala quattro volte:

$$
\begin{gathered}
a_2 = 2 \cdot 3 - 1 = 5 \\
a_3 = 2 \cdot 5 - 1 = 9 \\
a_4 = 2 \cdot 9 - 1 = 17 \\
a_5 = 2 \cdot 17 - 1 = 33
\end{gathered}
$$

La successione comincia con $3, 5, 9, 17, 33, \dots$
```

Con una definizione ricorsiva, per arrivare ad $a_{50}$ devi calcolare tutti i quarantanove termini che lo precedono; con il termine generale un solo conto. Per questo, quando si può, da una definizione ricorsiva si cerca di ricavare il termine generale: per le progressioni lo farai nelle prossime due lezioni.

```ad-warning
Senza il primo termine la ricorsione non parte
La legge $a_{n+1} = 2a_n - 1$ da sola non individua una successione. Con $a_1 = 3$ ottieni $3, 5, 9, 17, \dots$; con $a_1 = 1$ ottieni $1, 1, 1, 1, \dots$, perché $2 \cdot 1 - 1 = 1$; con $a_1 = 0$ ottieni $0, -1, -3, -7, \dots$ Il primo termine fa parte della definizione.
```

La legge di ricorrenza può usare anche più di un termine precedente, e allora servono altrettanti termini iniziali. L'esempio più famoso è la successione di Fibonacci, in cui i primi due termini valgono $1$ e ogni termine successivo è la somma dei due che lo precedono:

$$
\begin{cases}
a_1 = 1, \quad a_2 = 1 \\
a_{n+2} = a_{n+1} + a_n
\end{cases}
$$

I suoi primi termini sono $1, 1, 2, 3, 5, 8, 13, 21, \dots$

```ad-note
Successioni senza formula
Non tutte le successioni hanno un termine generale o una legge di ricorrenza comodi. La successione dei numeri primi, $2, 3, 5, 7, 11, 13, \dots$, è descritta bene a parole ("il termine di posto $n$ è l'$n$-esimo numero primo"), ma non si conosce una formula altrettanto corta che dia $a_n$ con un conto diretto.
```

### Dai primi termini al termine generale

Spesso un esercizio dà i primi termini e chiede una formula per $a_n$. Non c'è un procedimento che funziona sempre; conviene scrivere sotto ogni termine il suo indice e cercare che cosa li lega.

```ad-example
Esempio 5: trovare un termine generale
Trova un termine generale per ognuna delle successioni che cominciano così.

Prima successione: $3, 7, 11, 15, \dots$ Ogni termine supera il precedente di $4$, come i multipli di $4$, che sono $4, 8, 12, 16$. Ogni termine vale uno in meno del multiplo di $4$ che ha lo stesso posto: $a_n = 4n - 1$.

Seconda successione: $\dfrac{1}{2}, \dfrac{2}{3}, \dfrac{3}{4}, \dfrac{4}{5}, \dots$ Il numeratore è l'indice e il denominatore è l'indice aumentato di $1$: $a_n = \dfrac{n}{n + 1}$.

Terza successione: $2, -4, 8, -16, \dots$ Senza i segni sono le potenze di $2$, cioè $2^n$. Il segno è positivo ai posti dispari e negativo ai posti pari, quindi serve il fattore $(-1)^{n+1}$: $a_n = (-1)^{n+1} \cdot 2^n$.

Controlla sempre la formula trovata su tutti i termini dati. Per la terza: $a_1 = 1 \cdot 2 = 2$, $a_2 = -1 \cdot 4 = -4$, $a_3 = 1 \cdot 8 = 8$, $a_4 = -1 \cdot 16 = -16$.
```

```ad-note
Pochi termini non decidono la successione
I termini $1, 2, 4$ fanno pensare alle potenze di $2$, cioè ad $a_n = 2^{n-1}$, che prosegue con $8$. Ma anche $a_n = \dfrac{n^2 - n + 2}{2}$ comincia con $1, 2, 4$, e prosegue con $7$. Un numero finito di termini è compatibile con più formule: per questo negli esercizi si chiede "un" termine generale, e si sceglie il più semplice.
```

## Il grafico di una successione

Una successione è una funzione, quindi ha un grafico nel [piano cartesiano](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio): sull'asse orizzontale si mette l'indice $n$, su quello verticale il termine $a_n$, e a ogni termine corrisponde il punto $(n, a_n)$. Il dominio contiene solo i numeri naturali, perciò il grafico è fatto di punti isolati, uno sopra ogni indice.

Per la successione $a_n = \dfrac{6}{n}$ i primi sei termini sono $6$, $3$, $2$, $\dfrac{3}{2}$, $\dfrac{6}{5}$ e $1$, e i punti del grafico sono $(1, 6)$, $(2, 3)$, $(3, 2)$, $\Big(4, \dfrac{3}{2}\Big)$, $\Big(5, \dfrac{6}{5}\Big)$ e $(6, 1)$.

```tikz
% nome: successione-grafico-punti-isolati
% alt: Grafico della successione a con n uguale a 6 fratto n: sei punti isolati di coordinate (1, 6), (2, 3), (3, 2), (4, 3/2), (5, 6/5) e (6, 1), sempre più bassi e non uniti da una linea
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (0,0) grid (7,6.5);
\draw[->] (-0.4,0) -- (7.6,0) node[right] {$n$};
\draw[->] (0,-0.4) -- (0,7.1) node[above] {$a_n$};
\foreach \x in {1,2,3,4,5,6} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {1,2,3,6} \node[left] at (0,\y) {\small $\y$};
\foreach \x/\y in {1/6, 2/3, 3/2, 4/1.5, 5/1.2, 6/1} \fill[blue!60] (\x,\y) circle (0.13);
\end{tikzpicture}
```

```ad-warning
I punti non si uniscono
Tra $n = 1$ e $n = 2$ non ci sono altri indici, quindi tra i punti $(1, 6)$ e $(2, 3)$ il grafico non ha nulla. Se li unisci con una linea disegni il grafico della funzione $y = \dfrac{6}{x}$, che è definita anche tra un numero naturale e l'altro, e non quello della successione.
```

## Successioni monotone

Guardando i termini uno dopo l'altro, la prima cosa che si nota è se salgono o scendono. Una successione è:

- **crescente** se ogni termine è maggiore del precedente, cioè se $a_{n+1} > a_n$ per ogni $n$;
- **decrescente** se ogni termine è minore del precedente, cioè se $a_{n+1} < a_n$ per ogni $n$;
- costante se tutti i termini sono uguali, cioè se $a_{n+1} = a_n$ per ogni $n$.

Se nella prima definizione si ammette anche l'uguaglianza, $a_{n+1} \geq a_n$, la successione si dice non decrescente (o crescente in senso lato); con $a_{n+1} \leq a_n$ si dice non crescente. Una successione che ha una di queste proprietà si chiama **monotona**. Sono le stesse parole della lezione [Funzioni crescenti e decrescenti](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-crescenti-e-decrescenti), applicate a una funzione che ha per dominio i numeri naturali.

La successione $a_n = 2n$ dei numeri pari è crescente; la successione $a_n = \dfrac{6}{n}$ del grafico precedente è decrescente; la successione $1, 1, 2, 2, 3, 3, \dots$ è non decrescente, ma non è crescente, perché $a_2 = a_1$. La successione $a_n = (-1)^n$, cioè $-1, 1, -1, 1, \dots$, non è monotona: sale e scende a ogni passo.

Per stabilire se una successione è monotona si studia il segno della differenza tra un termine e il precedente:

1. scrivi $a_{n+1}$, mettendo $n + 1$ al posto di $n$ nel termine generale;
2. calcola la differenza $a_{n+1} - a_n$ e semplificala;
3. studia il suo segno per $n \geq 1$: se è positiva per ogni $n$ la successione è crescente, se è negativa per ogni $n$ è decrescente, se cambia segno la successione non è monotona.

```ad-example
Esempio 6: una successione crescente
Stabilisci se la successione $a_n = \dfrac{2n - 1}{n}$ è monotona.

I primi termini sono $1$, $\dfrac{3}{2}$, $\dfrac{5}{3}$, $\dfrac{7}{4}$: sembrano crescere, ma quattro termini non sono una dimostrazione. Il termine successivo è

$$a_{n+1} = \frac{2(n + 1) - 1}{n + 1} = \frac{2n + 1}{n + 1}$$

La differenza si calcola con il denominatore comune $n(n + 1)$:

$$
\begin{aligned}
a_{n+1} - a_n &= \frac{2n + 1}{n + 1} - \frac{2n - 1}{n} \\
&= \frac{n(2n + 1) - (2n - 1)(n + 1)}{n(n + 1)} \\
&= \frac{2n^2 + n - (2n^2 + n - 1)}{n(n + 1)} \\
&= \frac{1}{n(n + 1)}
\end{aligned}
$$

Per $n \geq 1$ il denominatore è positivo, quindi la differenza è positiva per ogni $n$: la successione è crescente.
```

```ad-example
Esempio 7: una successione non monotona
Stabilisci se la successione $a_n = n^2 - 6n$ è monotona.

Il termine successivo è $a_{n+1} = (n + 1)^2 - 6(n + 1) = n^2 - 4n - 5$, e la differenza è

$$a_{n+1} - a_n = n^2 - 4n - 5 - (n^2 - 6n) = 2n - 5$$

Il segno di $2n - 5$ dipende da $n$: è negativo per $n = 1$ e $n = 2$, è positivo per $n \geq 3$. I termini scendono fino al terzo e poi salgono, come si vede calcolandoli: $-5, -8, -9, -8, -5, 0, 7, \dots$ La successione non è monotona. Si può dire che è crescente da $n = 3$ in poi.

```tikz
% nome: successione-non-monotona-n-quadro-meno-6n
% alt: Grafico della successione a con n uguale a n al quadrato meno 6n: sette punti isolati di ordinate -5, -8, -9, -8, -5, 0 e 7, che scendono fino al terzo, il più basso, e poi risalgono
\begin{tikzpicture}[xscale=0.5, yscale=0.2]
\draw[gray!25, very thin, ystep=3] (0,-9) grid (8,9);
\draw[->] (-0.4,0) -- (8.5,0) node[right] {$n$};
\draw[->] (0,-10) -- (0,10.5) node[above] {$a_n$};
\foreach \x in {1,2,4,5,7} \node[above] at (\x,0) {\small $\x$};
\node[above] at (3,0) {\small $3$};
\node[below] at (6,0) {\small $6$};
\foreach \y in {-9,-6,-3,3,6} \node[left] at (0,\y) {\small $\y$};
\foreach \x/\y in {1/-5, 2/-8, 3/-9, 4/-8, 5/-5, 6/0, 7/7} \fill[blue!60] (\x,\y) ellipse (0.17 and 0.42);
\end{tikzpicture}
```
```grafico
% nome: successione-n-quadro-piu-bn-cursore
% alt: I primi sette termini della successione a con n uguale a n al quadrato più b per n come punti isolati, con il cursore di b da -8 a -2: con b uguale a -6 i punti scendono fino al terzo e poi risalgono, con b uguale a -3 i primi due punti sono alla stessa altezza, con b uguale a -2 i punti salgono tutti
curva: \left(1;1+b\right) | blu
curva: \left(2;4+2b\right) | blu
curva: \left(3;9+3b\right) | blu
curva: \left(4;16+4b\right) | blu
curva: \left(5;25+5b\right) | blu
curva: \left(6;36+6b\right) | blu
curva: \left(7;49+7b\right) | blu
cursore: b = -6 da -8 a -2 passo 1
finestra: x da -1 a 9,5, y da -18 a 40
forma: 3:2
assi: n, aₙ
valore: a_2 - a_1 = 3+b
domanda: Qui $a_n = n^2 + bn$. Per quale $b$ i primi due termini sono uguali? E per quale $b$ i punti salgono tutti?
```
```

Nel piano dell'esempio la successione è $a_n = n^2 + bn$, e la differenza tra un termine e il precedente è $2n + 1 + b$. Con $b = -3$ la differenza vale $0$ per $n = 1$: i primi due termini sono uguali, $a_1 = a_2 = -2$, e poi i termini salgono, quindi la successione è non decrescente ma non è crescente. Con $b = -2$ la differenza è positiva per ogni $n \geq 1$ e la successione è crescente. Con $b \leq -4$ i primi termini scendono e gli altri salgono: la successione non è monotona.

```ad-warning
I primi termini non bastano
Della successione $a_n = n^2 - 6n$ i primi tre termini sono $-5, -8, -9$: chi si ferma lì conclude che è decrescente, e sbaglia. La monotonia riguarda tutti gli indici, e si dimostra con il segno di $a_{n+1} - a_n$ per un $n$ qualunque, non con qualche termine calcolato.
```

## Successioni limitate

La seconda cosa che si guarda è se i termini restano dentro una fascia o se ne escono. Una successione è:

- **limitata superiormente** se esiste un numero $M$ che nessun termine supera, cioè tale che $a_n \leq M$ per ogni $n$;
- **limitata inferiormente** se esiste un numero $m$ sotto il quale nessun termine scende, cioè tale che $a_n \geq m$ per ogni $n$;
- **limitata** se è limitata sia superiormente sia inferiormente, cioè se esistono $m$ e $M$ tali che $m \leq a_n \leq M$ per ogni $n$.

Nel grafico, una successione limitata ha tutti i punti compresi tra le due rette orizzontali $y = m$ e $y = M$. I numeri $m$ e $M$ non sono unici: se nessun termine supera $2$, nessun termine supera nemmeno $3$ o $10$.

La successione $a_n = n^2$, cioè $1, 4, 9, 16, \dots$, è limitata inferiormente, perché tutti i termini sono maggiori o uguali a $1$, ma non superiormente: qualunque numero $M$ tu scelga, prima o poi un quadrato lo supera. La successione $a_n = (-1)^n$ è limitata, perché i suoi termini valgono soltanto $-1$ e $1$. La successione $a_n = (-1)^n \cdot n$, cioè $-1, 2, -3, 4, -5, \dots$, non è limitata né superiormente né inferiormente.

```ad-example
Esempio 8: una successione crescente e limitata
Mostra che la successione $a_n = \dfrac{2n - 1}{n}$ è limitata.

Dividi il numeratore per $n$, termine per termine:

$$a_n = \frac{2n}{n} - \frac{1}{n} = 2 - \frac{1}{n}$$

Poiché $\dfrac{1}{n}$ è positivo per ogni $n \geq 1$, ogni termine è minore di $2$: la successione è limitata superiormente, con $M = 2$. Nell'esempio 6 hai visto che è crescente, quindi nessun termine è minore del primo, $a_1 = 1$: è limitata inferiormente, con $m = 1$. In tutto

$$1 \leq a_n < 2 \quad \text{per ogni } n$$

```tikz
% nome: successione-limitata-tra-1-e-2
% alt: Grafico della successione a con n uguale a 2 meno 1 fratto n: otto punti isolati che salgono da 1 avvicinandosi alla retta tratteggiata y = 2 senza raggiungerla; tutti i punti stanno tra le rette orizzontali tratteggiate y = 1 e y = 2
\begin{tikzpicture}[xscale=0.48, yscale=1.5]
\draw[->] (-0.4,0) -- (9.3,0) node[right] {$n$};
\draw[->] (0,-0.15) -- (0,2.6) node[above] {$a_n$};
\foreach \x in {1,2,3,4,5,6,7,8} \node[below] at (\x,0) {\small $\x$};
\draw[dashed, gray] (0,1) -- (8.8,1);
\draw[dashed, gray] (0,2) -- (8.8,2);
\node[left] at (0,1) {\small $1$};
\node[left] at (0,2) {\small $2$};
\foreach \x/\y in {1/1, 2/1.5, 3/1.6667, 4/1.75, 5/1.8, 6/1.8333, 7/1.8571, 8/1.875} \fill[blue!60] (\x,\y) ellipse (0.17 and 0.055);
\end{tikzpicture}
```
```grafico
% nome: successione-due-meno-c-su-n-cursore
% alt: I primi otto termini della successione a con n uguale a 2 meno c fratto n come punti isolati, con la retta tratteggiata y = 2 e il cursore di c da -2 a 2: con c positivo i punti salgono verso la retta da sotto, con c negativo scendono verso la retta da sopra, con c uguale a zero stanno tutti sulla retta
curva: y=2 | tratteggiata | grigio
curva: \left(1;2-c\right) | blu
curva: \left(2;2-\frac{c}{2}\right) | blu
curva: \left(3;2-\frac{c}{3}\right) | blu
curva: \left(4;2-\frac{c}{4}\right) | blu
curva: \left(5;2-\frac{c}{5}\right) | blu
curva: \left(6;2-\frac{c}{6}\right) | blu
curva: \left(7;2-\frac{c}{7}\right) | blu
curva: \left(8;2-\frac{c}{8}\right) | blu
cursore: c = 1 da -2 a 2 passo 0,5
finestra: x da -1 a 10, y da -1,5 a 4,5
assi: n, aₙ
valore: a_1 = 2-c
domanda: Qui $a_n = 2 - \dfrac{c}{n}$. Porta $c$ sotto zero: la successione è ancora limitata? È ancora crescente? E con $c = 0$?
```
```

Nel piano dell'esempio la successione è $a_n = 2 - \dfrac{c}{n}$. Con $c$ negativo i termini partono da $a_1 = 2 - c$, sopra $2$, e scendono verso $2$ senza raggiungerlo: la successione è decrescente, ed è ancora limitata, tra $2$ e $2 - c$. Con $c = 0$ tutti i termini valgono $2$ e la successione è costante. Il segno di $c$ cambia la monotonia, non la limitatezza.

L'esempio mostra un fatto generale: una successione crescente è sempre limitata inferiormente dal suo primo termine, perché tutti gli altri sono più grandi; allo stesso modo una successione decrescente è limitata superiormente dal suo primo termine.

```ad-warning
Limitata e monotona sono due proprietà diverse
Una successione può avere una delle due proprietà senza l'altra. La successione $a_n = (-1)^n$ è limitata ma non monotona; la successione $a_n = n^2$ è monotona ma non limitata; la successione $a_n = 2 - \dfrac{1}{n}$ è tutte e due le cose.
```

```ad-note
Che cosa succede quando n diventa grande
I termini di $a_n = 2 - \dfrac{1}{n}$ si avvicinano sempre di più a $2$ senza raggiungerlo: $a_{10} = 1{,}9$, $a_{100} = 1{,}99$, $a_{1000} = 1{,}999$. Dire con precisione che cosa significa "avvicinarsi sempre di più" è un argomento del quinto anno.
```

Le successioni in cui la differenza tra un termine e il precedente è sempre la stessa sono le [progressioni aritmetiche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/progressioni-aritmetiche); quelle in cui è sempre lo stesso il rapporto sono le [progressioni geometriche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/progressioni-geometriche).
