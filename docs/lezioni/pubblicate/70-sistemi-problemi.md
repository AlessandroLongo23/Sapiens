# Problemi con i sistemi

Per uno spettacolo si vendono $300$ biglietti, alcuni interi e altri ridotti, e l'incasso è di $3120$ €: quanti sono gli interi e quanti i ridotti? Le grandezze incognite sono due, e il testo dà due informazioni. Invece di esprimere una grandezza per mezzo dell'altra, come nei [problemi con le equazioni](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/problemi-con-le-equazioni), puoi chiamarle $x$ e $y$ e tradurre ogni informazione in un'equazione: ottieni un sistema, che si risolve con i metodi dei [sistemi di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite).

## Il procedimento

1. Leggi il testo fino in fondo e separa i dati dalla domanda.
2. Scegli le incognite e scrivi che cosa rappresenta ciascuna, con l'unità di misura: "$x$ = numero dei biglietti interi, $y$ = numero dei biglietti ridotti".
3. Scrivi le limitazioni di ogni incognita: intera, positiva, minore di un certo numero.
4. Traduci in equazioni le informazioni del testo: servono tante equazioni quante sono le incognite, e ognuna deve dire una cosa diversa.
5. Risolvi il sistema con il metodo che conviene.
6. Controlla che la soluzione rispetti le limitazioni, verificala sui dati del testo e rispondi alla domanda con una frase.

Una soluzione del sistema è **accettabile** se tutte le incognite rispettano le loro limitazioni. Se anche una sola non le rispetta (un numero di biglietti negativo o non intero, una lunghezza nulla), il problema è impossibile, anche se il sistema ha una soluzione.

Lo stesso problema si può quasi sempre risolvere anche con un'incognita sola. Se due numeri hanno somma $50$ e differenza $12$, puoi chiamare $x$ il maggiore e scrivere il minore come $50 - x$, da cui l'equazione $x - (50 - x) = 12$; oppure chiamare $y$ il minore e scrivere il sistema qui sotto. Il risultato è lo stesso, ma con il sistema ogni frase del testo diventa un'equazione, e non devi decidere tu come esprimere una grandezza per mezzo dell'altra.

$$
\begin{cases}
x + y = 50 \\
x - y = 12
\end{cases}
$$

## Due equazioni che dicono cose diverse

Le due equazioni devono venire da due informazioni diverse del testo. Se una è la stessa informazione scritta in un altro modo, il sistema è indeterminato e il testo non basta a trovare le incognite; se le due informazioni si contraddicono, il sistema è impossibile e il problema non ha soluzione. Come si riconoscono questi casi dai coefficienti è spiegato in [Sistemi di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite).

```ad-example
Esempio: la stessa informazione due volte
Un rettangolo ha perimetro $20$ cm, e la somma della base e dell'altezza è $10$ cm. Quanto sono lunghi i lati?

Con $x$ la base e $y$ l'altezza, in centimetri, le due frasi danno

$$
\begin{cases}
2x + 2y = 20 \\
x + y = 10
\end{cases}
$$

La prima equazione è la seconda moltiplicata per $2$: il perimetro è il doppio della somma di base e altezza, quindi la seconda frase non aggiunge niente. Il sistema è indeterminato: vanno bene la base $7$ e l'altezza $3$, la base $6$ e l'altezza $4$, e infiniti altri rettangoli. Per trovare i lati serve un'altra informazione, per esempio che la base supera l'altezza di $4$ cm.
```

```ad-warning
Contare due volte la stessa informazione
Il perimetro e il semiperimetro, "il doppio di $x$ è $y$" e "$x$ è la metà di $y$", sono la stessa informazione detta in due modi. Prima di risolvere, controlla che ognuna delle due equazioni venga da una frase diversa del testo.
```

## Esempi svolti

```ad-example
Esempio 1: somma e differenza
La somma di due numeri è $50$ e la loro differenza è $12$. Quali sono i due numeri?

Chiama $x$ il maggiore e $y$ il minore. Le due frasi del testo danno il sistema

$$
\begin{cases}
x + y = 50 \\
x - y = 12
\end{cases}
$$

Nelle due equazioni $y$ ha coefficienti opposti, quindi conviene la riduzione: sommando membro a membro $y$ se ne va.

$$
\begin{gathered}
2x = 62 \\
\Rightarrow x = 31
\end{gathered}
$$

Dalla prima equazione $y = 50 - 31 = 19$. Controllo sul testo: $31 + 19 = 50$ e $31 - 19 = 12$. I due numeri sono $31$ e $19$.
```

```ad-example
Esempio 2: biglietti interi e ridotti
Per uno spettacolo si vendono $300$ biglietti: gli interi costano $12$ € e i ridotti $8$ €. L'incasso è di $3120$ €. Quanti biglietti di ciascun tipo sono stati venduti?

Chiama $x$ il numero dei biglietti interi e $y$ quello dei ridotti. Sono numeri di biglietti, quindi $x$ e $y$ devono essere numeri naturali. Il numero dei biglietti e l'incasso danno due equazioni:

$$
\begin{cases}
x + y = 300 \\
12x + 8y = 3120
\end{cases}
$$

Dalla prima ricavi $y = 300 - x$, e lo sostituisci nella seconda:

$$
\begin{gathered}
12x + 8(300 - x) = 3120 \\
\Rightarrow 12x + 2400 - 8x = 3120 \\
\Rightarrow 4x = 720 \\
\Rightarrow x = 180
\end{gathered}
$$

Allora $y = 300 - 180 = 120$. Sono due numeri naturali, quindi la soluzione è accettabile. Controllo: $180 \cdot 12 = 2160$ e $120 \cdot 8 = 960$, e $2160 + 960 = 3120$. Sono stati venduti $180$ biglietti interi e $120$ ridotti.

Se l'incasso fosse $3130$ €, gli stessi passaggi darebbero $4x = 730$, cioè $x = 182{,}5$: non è un numero naturale, quindi la soluzione non è accettabile e il problema è impossibile. Con biglietti da $12$ € e da $8$ € l'incasso è sempre un numero pari di euro.
```

```ad-example
Esempio 3: le età
Oggi una madre ha $26$ anni più della figlia. Tra $5$ anni la madre avrà il triplo degli anni della figlia. Quanti anni hanno oggi?

Chiama $x$ l'età della madre oggi e $y$ quella della figlia, in anni, con $x > 26$ e $y > 0$. Tra $5$ anni la madre avrà $x + 5$ anni e la figlia $y + 5$:

$$
\begin{cases}
x = y + 26 \\
x + 5 = 3(y + 5)
\end{cases}
$$

La prima equazione dà già $x$, quindi conviene la sostituzione:

$$
\begin{gathered}
y + 26 + 5 = 3(y + 5) \\
\Rightarrow y + 31 = 3y + 15 \\
\Rightarrow -2y = -16 \\
\Rightarrow y = 8
\end{gathered}
$$

Allora $x = 8 + 26 = 34$, e la soluzione rispetta le limitazioni. Controllo sul testo: $34 - 8 = 26$, e tra $5$ anni la madre avrà $39$ anni e la figlia $13$, con $39 = 3 \cdot 13$. La madre ha $34$ anni e la figlia $8$.
```

```ad-warning
Far passare il tempo per uno solo
Tra $5$ anni invecchiano tutte e due: scrivere $x + 5 = 3y$ vuol dire portare avanti la madre e lasciare la figlia all'età di oggi. Ogni età del futuro, o del passato, cambia della stessa quantità.
```

```ad-example
Esempio 4: il perimetro di un rettangolo
Un rettangolo ha perimetro $56$ cm. Se si allunga la base di $2$ cm e si raddoppia l'altezza, il perimetro diventa $76$ cm. Calcola l'area del rettangolo.

Chiama $x$ la base e $y$ l'altezza, in centimetri, con $x > 0$ e $y > 0$.

```tikz
% nome: rettangolo-base-altezza-incognite
% alt: Rettangolo con la base indicata con x e l'altezza indicata con y
% svg: rettangolo-base-altezza-incognite-85c8ea79.svg 190x86
\begin{tikzpicture}
\draw[fill=blue!15] (0,0) rectangle (4.5,1.8);
\node[below] at (2.25,0) {$x$};
\node[left] at (0,0.9) {$y$};
\end{tikzpicture}
```

Il perimetro è il doppio della somma di base e altezza. Il rettangolo nuovo ha base $x + 2$ e altezza $2y$:

$$
\begin{cases}
2(x + y) = 56 \\
2(x + 2 + 2y) = 76
\end{cases}
$$

Dividi le due equazioni per $2$ e porta i numeri a destra:

$$
\begin{cases}
x + y = 28 \\
x + 2y = 36
\end{cases}
$$

Sottraendo la prima equazione dalla seconda, membro a membro, $x$ se ne va e resta $y = 8$. Dalla prima, $x = 28 - 8 = 20$. Controllo: $2 \cdot (20 + 8) = 56$, e il rettangolo nuovo ha lati $22$ cm e $16$ cm, con perimetro $2 \cdot (22 + 16) = 76$. La base è $20$ cm, l'altezza $8$ cm, e l'area è $20 \cdot 8 = 160$ cm².
```

```ad-example
Esempio 5: gli angoli di un triangolo isoscele
In un triangolo isoscele l'angolo al vertice supera di $30^\circ$ ciascuno degli angoli alla base. Quanto misurano gli angoli?

Chiama $x$ l'angolo al vertice e $y$ ciascun angolo alla base, in gradi. Gli angoli alla base di un triangolo isoscele sono congruenti, come si dimostra in [Triangoli e criteri di congruenza](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/triangoli-e-criteri-di-congruenza), quindi una sola incognita vale per tutti e due.

```tikz
% nome: triangolo-isoscele-angoli-incogniti
% alt: Triangolo isoscele con l'angolo al vertice indicato con x e i due angoli alla base indicati entrambi con y
% svg: triangolo-isoscele-angoli-incogniti-15b0b9b3.svg 174x105
\begin{tikzpicture}[scale=1.5]
\fill[blue!15] (0,0) -- ++(0:0.55) arc (0:50:0.55) -- cycle;
\draw (0.55,0) arc (0:50:0.55);
\fill[blue!15] (3,0) -- ++(130:0.55) arc (130:180:0.55) -- cycle;
\draw (2.646,0.421) arc (130:180:0.55);
\fill[orange!30] (1.5,1.788) -- ++(230:0.45) arc (230:310:0.45) -- cycle;
\draw (1.211,1.443) arc (230:310:0.45);
\draw (0,0) -- (3,0) -- (1.5,1.788) -- cycle;
\node at (0.8,0.3) {$y$};
\node at (2.2,0.3) {$y$};
\node at (1.5,1.1) {$x$};
\end{tikzpicture}
```

La somma degli angoli interni di un triangolo è $180^\circ$, come in [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele):

$$
\begin{cases}
x + 2y = 180 \\
x = y + 30
\end{cases}
$$

Sostituisci $x$ nella prima equazione:

$$
\begin{gathered}
y + 30 + 2y = 180 \\
\Rightarrow 3y = 150 \\
\Rightarrow y = 50
\end{gathered}
$$

Allora $x = 50 + 30 = 80$. Controllo: $80 + 50 + 50 = 180$, e $80 - 50 = 30$. L'angolo al vertice misura $80^\circ$, ciascun angolo alla base $50^\circ$.
```

```ad-warning
Gli angoli alla base sono due
Scrivere $x + y = 180$ vuol dire dimenticare uno dei due angoli alla base. Nella somma degli angoli del triangolo ci sono tre angoli: $x$, $y$ e ancora $y$.
```

```ad-example
Esempio 6: le cifre di un numero
Un numero di due cifre ha la somma delle cifre uguale a $11$. Se si scambiano le due cifre, si ottiene un numero che supera di $27$ quello di partenza. Qual è il numero?

Chiama $x$ la cifra delle decine e $y$ quella delle unità. Sono cifre, quindi numeri naturali da $0$ a $9$, e $x$ non può essere $0$ perché il numero ha due cifre. Il numero vale $10x + y$: $x$ decine e $y$ unità. Scambiando le cifre si ottiene $10y + x$.

$$
\begin{cases}
x + y = 11 \\
10y + x = 10x + y + 27
\end{cases}
$$

La seconda equazione, portando le incognite a sinistra, diventa $9y - 9x = 27$, e dividendo per $9$ diventa $y - x = 3$. Sommala alla prima membro a membro:

$$
\begin{gathered}
2y = 14 \\
\Rightarrow y = 7
\end{gathered}
$$

Allora $x = 11 - 7 = 4$: due cifre, con $x \neq 0$. Il numero è $47$. Controllo: $4 + 7 = 11$, e $74 - 47 = 27$.
```

```ad-warning
Il numero con le cifre x e y
Il numero di due cifre che ha $x$ come cifra delle decine e $y$ come cifra delle unità non è $x \cdot y$ né $x + y$: è $10x + y$. Per esempio $47 = 10 \cdot 4 + 7$.
```

```ad-example
Esempio 7: due sconti diversi
Un paio di scarpe e una giacca costano insieme $200$ €. Durante i saldi le scarpe sono scontate del $20\%$ e la giacca del $30\%$, e insieme costano $148$ €. Quanto costava ciascun articolo prima dei saldi?

Chiama $x$ il prezzo delle scarpe e $y$ quello della giacca, in euro, con $x > 0$ e $y > 0$. Con uno sconto del $20\%$ si paga l'$80\%$ del prezzo, cioè $0{,}8x$; con uno sconto del $30\%$ si paga $0{,}7y$. Le percentuali si trasformano in numeri decimali come in [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).

$$
\begin{cases}
x + y = 200 \\
0{,}8x + 0{,}7y = 148
\end{cases}
$$

Moltiplica la seconda equazione per $10$, per togliere i decimali: $8x + 7y = 1480$. Dalla prima ricavi $y = 200 - x$, e lo sostituisci:

$$
\begin{gathered}
8x + 7(200 - x) = 1480 \\
\Rightarrow 8x + 1400 - 7x = 1480 \\
\Rightarrow x = 80
\end{gathered}
$$

Allora $y = 200 - 80 = 120$. Controllo: lo sconto sulle scarpe è $16$ €, quindi costano $64$ €; lo sconto sulla giacca è $36$ €, quindi costa $84$ €; e $64 + 84 = 148$. Le scarpe costavano $80$ € e la giacca $120$ €.
```

```ad-warning
Togliere la percentuale come se fosse in euro
Uno sconto del $20\%$ sulle scarpe non vuol dire pagarle $x - 20$: vuol dire togliere il $20\%$ di $x$, e pagare $x - 0{,}2x = 0{,}8x$.
```

```ad-example
Esempio 8: una miscela di due soluzioni
Un laboratorio ha una soluzione di alcol al $20\%$ e una al $50\%$. Quanti litri di ciascuna servono per ottenere $10$ litri di soluzione al $29\%$?

Chiama $x$ i litri della soluzione al $20\%$ e $y$ i litri di quella al $50\%$, con $0 \leq x \leq 10$ e $0 \leq y \leq 10$. Il volume totale è $10$ litri, e l'alcol contenuto nella miscela è la somma dell'alcol delle due soluzioni: $0{,}2x$ litri nella prima, $0{,}5y$ nella seconda, e $0{,}29 \cdot 10 = 2{,}9$ litri nella miscela.

$$
\begin{cases}
x + y = 10 \\
0{,}2x + 0{,}5y = 2{,}9
\end{cases}
$$

Moltiplica la seconda equazione per $10$, e la prima per $2$:

$$
\begin{cases}
2x + 2y = 20 \\
2x + 5y = 29
\end{cases}
$$

Sottraendo la prima dalla seconda resta $3y = 9$, cioè $y = 3$, e allora $x = 10 - 3 = 7$. Controllo: $0{,}2 \cdot 7 = 1{,}4$ e $0{,}5 \cdot 3 = 1{,}5$, e $1{,}4 + 1{,}5 = 2{,}9$ litri di alcol in $10$ litri, cioè il $29\%$. Servono $7$ litri della soluzione al $20\%$ e $3$ litri di quella al $50\%$.

Se il laboratorio volesse una soluzione al $60\%$, il sistema darebbe $y = \dfrac{40}{3}$ e $x = -\dfrac{10}{3}$: $x$ è negativo, quindi la soluzione non è accettabile. Mescolando due soluzioni non si ottiene una concentrazione più alta della più alta delle due.
```

```ad-example
Esempio 9: una barca sul fiume
Una barca percorre $36$ km risalendo un fiume, cioè contro la corrente, in $3$ ore, e ridiscende gli stessi $36$ km in $2$ ore. Quali sono la velocità della barca in acqua ferma e la velocità della corrente, supponendo che siano costanti?

Chiama $x$ la velocità della barca in acqua ferma e $y$ quella della corrente, in km/h, con $x > y > 0$: se la corrente fosse più veloce della barca, la barca non risalirebbe il fiume. Contro la corrente la barca va a $x - y$ km/h, con la corrente a $x + y$ km/h. Lo spazio è la velocità per il tempo:

$$
\begin{cases}
3(x - y) = 36 \\
2(x + y) = 36
\end{cases}
$$

Dividi la prima equazione per $3$ e la seconda per $2$, e poi sommale membro a membro:

$$
\begin{cases}
x - y = 12 \\
x + y = 18
\end{cases}
\Rightarrow 2x = 30
$$

Allora $x = 15$ e $y = 18 - 15 = 3$, e $15 > 3 > 0$. Controllo: contro la corrente la barca va a $12$ km/h, e in $3$ ore percorre $36$ km; con la corrente va a $18$ km/h, e in $2$ ore percorre $36$ km. La barca va a $15$ km/h in acqua ferma, la corrente a $3$ km/h.
```

```ad-warning
La velocità media non è la velocità della barca
In tutto la barca percorre $72$ km in $5$ ore, cioè $14{,}4$ km/h di media, ma questa non è $x$: la barca passa $3$ ore contro la corrente e solo $2$ con la corrente, quindi la media pende verso $x - y$. Ogni tratto dà la sua equazione, con la sua velocità e il suo tempo.
```

## Un problema con tre incognite

Quando le grandezze incognite sono tre servono tre equazioni, ognuna da un'informazione diversa del testo. Il sistema si risolve con la sostituzione, come in [Determinanti e regola di Cramer](/materiale/scuola-superiore/matematica/sistemi-lineari/determinanti-e-regola-di-cramer), che per i sistemi di tre equazioni presenta anche la regola di Cramer.

```ad-example
Esempio 10: le monete di un salvadanaio
In un salvadanaio ci sono $30$ monete, da $10$, da $20$ e da $50$ centesimi, per un totale di $6{,}50$ €. Le monete da $10$ centesimi sono il doppio di quelle da $50$. Quante monete ci sono di ciascun tipo?

Chiama $x$, $y$ e $z$ il numero delle monete da $10$, da $20$ e da $50$ centesimi: sono numeri naturali. Conviene contare il valore in centesimi, così $6{,}50$ € diventano $650$ centesimi. Il numero delle monete, il valore e il confronto tra le monete da $10$ e da $50$ danno tre equazioni:

$$
\begin{cases}
x + y + z = 30 \\
10x + 20y + 50z = 650 \\
x = 2z
\end{cases}
$$

Dividi la seconda equazione per $10$, sostituisci $x = 2z$ nelle prime due e somma i termini simili:

$$
\begin{cases}
3z + y = 30 \\
7z + 2y = 65
\end{cases}
$$

È un sistema di due equazioni in $y$ e $z$. Dalla prima $y = 30 - 3z$, che sostituito nella seconda dà:

$$
\begin{gathered}
7z + 2(30 - 3z) = 65 \\
\Rightarrow 7z + 60 - 6z = 65 \\
\Rightarrow z = 5
\end{gathered}
$$

Allora $y = 30 - 15 = 15$ e $x = 2 \cdot 5 = 10$: tre numeri naturali. Controllo: $10 + 15 + 5 = 30$ monete, e $10 \cdot 10 + 15 \cdot 20 + 5 \cdot 50 = 100 + 300 + 250 = 650$ centesimi. Ci sono $10$ monete da $10$ centesimi, $15$ da $20$ e $5$ da $50$.
```

```ad-warning
Mescolare euro e centesimi
Nella stessa equazione tutte le grandezze devono avere la stessa unità di misura. Scrivere $10x + 20y + 50z = 6{,}5$ mette i centesimi a sinistra e gli euro a destra: prima di scrivere, scegli un'unità (qui i centesimi) e converti tutti i dati.
```
