# Problemi con le equazioni

Tre quaderni e una penna costano $9$ €, la base di un rettangolo supera l'altezza di $7$ cm, due auto partono una verso l'altra: in molti problemi il numero che cerchi non si calcola con una sola operazione, ma si trova scrivendo un'equazione. La parte nuova è la traduzione del testo in simboli, perché l'equazione che ne esce si risolve con il metodo delle [equazioni di primo grado intere](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere).

## Il procedimento

1. Leggi il testo fino in fondo e separa i dati dalla domanda.
2. Scegli l'incognita e scrivi che cosa rappresenta, con l'unità di misura: "$x$ = età del figlio oggi, in anni".
3. Scrivi le limitazioni dell'incognita, cioè i valori che può avere nel problema: intera, positiva, minore di un certo numero.
4. Esprimi con $x$ le altre grandezze del problema, e traduci in equazione l'informazione del testo che non hai ancora usato.
5. Risolvi l'equazione.
6. Controlla che la soluzione rispetti le limitazioni, verificala sui dati del testo e rispondi alla domanda con una frase.

Di solito conviene chiamare $x$ la grandezza che il problema chiede. Quando le grandezze incognite sono più di una, conviene chiamare $x$ quella da cui le altre si ricavano più facilmente: se la base supera l'altezza di $7$ cm, $x$ è l'altezza e la base è $x + 7$. Quando le grandezze incognite sono due e il testo dà due informazioni, puoi anche chiamarle $x$ e $y$ e scrivere un sistema: lo trovi in [Problemi con i sistemi](/materiale/scuola-superiore/matematica/sistemi-lineari/problemi-con-i-sistemi).

La verifica del passo 6 si fa sul testo e non sull'equazione. Se hai tradotto male il testo, la soluzione soddisfa l'equazione sbagliata e il controllo sull'equazione non se ne accorge; rileggendo il testo con i numeri trovati, invece, l'errore salta fuori.

## Dal testo all'equazione

Alcune espressioni ritornano in quasi tutti i problemi. Con $x$ un numero qualsiasi:

| Nel testo | In simboli |
|---|---|
| il doppio, il triplo di un numero | $2x$, $3x$ |
| la metà, la terza parte di un numero | $\dfrac{x}{2}$, $\dfrac{x}{3}$ |
| un numero aumentato di $5$ | $x + 5$ |
| un numero diminuito di $5$ | $x - 5$ |
| due numeri interi consecutivi | $x$ e $x + 1$ |
| due numeri pari consecutivi | $2x$ e $2x + 2$ |
| due numeri con somma $30$ | $x$ e $30 - x$ |
| il $20\%$ di un numero | $\dfrac{20}{100}x = 0{,}2x$ |

Per i numeri consecutivi e per i numeri pari l'incognita $x$ deve essere un numero intero.

```ad-warning
L'ordine delle parole
"Il triplo della somma di un numero e $4$" è $3(x + 4)$: prima la somma, poi il triplo. "La somma del triplo di un numero e $4$" è $3x + 4$: prima il triplo, poi la somma. L'operazione nominata per prima nella frase è l'ultima che si esegue.
```

```ad-warning
Chi supera chi
"La base supera l'altezza di $7$ cm" vuol dire che la base è più lunga: $b = h + 7$, non $h = b + 7$. Prima di scrivere, chiediti quale delle due grandezze è la più grande.
```

## Le limitazioni dell'incognita

Un'equazione non sa che cosa rappresenta $x$: le sue soluzioni possono essere negative, frazionarie, grandi a piacere. Il problema invece mette dei vincoli, che dipendono dal significato dell'incognita:

- un numero di persone, di oggetti, o un numero che il testo dice intero, deve essere un intero, e di solito positivo;
- una lunghezza, un'area, un prezzo, un tempo, una velocità devono essere positivi;
- una parte di un totale non può superare il totale, e un'età di qualche anno fa non può essere negativa.

Se la soluzione dell'equazione rispetta le limitazioni si dice **accettabile**, e il problema ha quella soluzione. Se non le rispetta, il problema è impossibile anche se l'equazione ha una soluzione. E se l'equazione è impossibile, cioè si riduce a $0x = b$ con $b \neq 0$, il problema non ha soluzione comunque.

```ad-example
Esempio: una soluzione da scartare
Un rettangolo ha perimetro $20$ cm, e la base supera l'altezza di $12$ cm. Quanto sono lunghi i lati?

Chiama $x$ l'altezza, in centimetri: la limitazione è $x > 0$. La base è $x + 12$, e il perimetro è il doppio della somma di base e altezza:

$$
\begin{gathered}
2(x + x + 12) = 20 \\
\Rightarrow 4x + 24 = 20 \\
\Rightarrow 4x = -4 \\
\Rightarrow x = -1
\end{gathered}
$$

L'equazione ha la soluzione $x = -1$, ma un'altezza non può essere negativa: la soluzione non è accettabile e il problema è impossibile. Il motivo si vede anche senza conti: il semiperimetro è $10$ cm, quindi nessuno dei due lati può superare l'altro di $12$ cm.
```

## Esempi svolti

```ad-example
Esempio 1: numeri consecutivi
La somma di tre numeri naturali consecutivi è $84$. Quali sono i tre numeri?

Chiama $x$ il più piccolo dei tre: la limitazione è che $x$ sia un numero naturale. Gli altri due sono $x + 1$ e $x + 2$.

$$
\begin{gathered}
x + (x + 1) + (x + 2) = 84 \\
\Rightarrow 3x + 3 = 84 \\
\Rightarrow 3x = 81 \\
\Rightarrow x = 27
\end{gathered}
$$

$27$ è un numero naturale, quindi la soluzione è accettabile. Controllo sul testo: $27 + 28 + 29 = 84$. I tre numeri sono $27$, $28$ e $29$.

Se la somma fosse $100$, l'equazione sarebbe $3x + 3 = 100$, con soluzione $x = \dfrac{97}{3}$. Non è un numero intero, quindi non è accettabile: non esistono tre naturali consecutivi con somma $100$.
```

```ad-example
Esempio 2: un problema sulle età
Oggi una madre ha $42$ anni e suo figlio $12$. Quanti anni fa la madre aveva il quadruplo degli anni del figlio?

Chiama $x$ il numero di anni fa, con $0 < x < 12$: $12$ anni fa il figlio non era ancora nato. Allora la madre aveva $42 - x$ anni e il figlio $12 - x$:

$$
\begin{gathered}
42 - x = 4(12 - x) \\
\Rightarrow 42 - x = 48 - 4x \\
\Rightarrow -x + 4x = 48 - 42 \\
\Rightarrow 3x = 6 \\
\Rightarrow x = 2
\end{gathered}
$$

$x = 2$ rispetta le limitazioni. Controllo sul testo: $2$ anni fa la madre aveva $40$ anni e il figlio $10$, e $4 \cdot 10 = 40$. La madre aveva il quadruplo degli anni del figlio $2$ anni fa.
```

```ad-warning
Far passare il tempo per uno solo
Tra $x$ anni, o $x$ anni fa, cambiano le età di tutte le persone del problema. In questo esempio scrivere $42 - x = 4 \cdot 12$ vuol dire far tornare indietro la madre e lasciare il figlio fermo a oggi.
```

```ad-example
Esempio 3: il perimetro di un rettangolo
Un rettangolo ha perimetro $54$ cm, e la base supera l'altezza di $7$ cm. Calcola l'area del rettangolo.

Chiama $x$ l'altezza, in centimetri, con $x > 0$. La base è $x + 7$.

```tikz
% nome: rettangolo-lati-incogniti
% alt: Rettangolo con l'altezza indicata con x e la base indicata con x più 7
% svg: rettangolo-lati-incogniti-17242eb6.svg 181x117
\begin{tikzpicture}
\draw[fill=blue!15] (0,0) rectangle (4.25,2.5);
\node[left] at (0,1.25) {$x$};
\node[below] at (2.125,0) {$x + 7$};
\end{tikzpicture}
```

Il perimetro è il doppio della somma di base e altezza:

$$
\begin{gathered}
2(x + x + 7) = 54 \\
\Rightarrow 4x + 14 = 54 \\
\Rightarrow 4x = 40 \\
\Rightarrow x = 10
\end{gathered}
$$

$x = 10$ è positivo, quindi accettabile. L'altezza è $10$ cm e la base $17$ cm; controllo: $2 \cdot (17 + 10) = 54$. L'area è $17 \cdot 10 = 170$ cm².
```

```ad-warning
Fermarsi alla x
Qui l'equazione dà l'altezza, ma la domanda chiede l'area. Prima di scrivere la risposta rileggi la domanda: a volte il numero cercato è $x$, a volte si calcola da $x$.
```

```ad-example
Esempio 4: l'area di un quadrato
Se allunghi di $3$ cm il lato di un quadrato, la sua area aumenta di $45$ cm². Quanto è lungo il lato?

Chiama $x$ il lato, in centimetri, con $x > 0$. L'area del quadrato è $x^2$, quella del quadrato allungato è $(x + 3)^2$, e la seconda supera la prima di $45$:

$$(x + 3)^2 = x^2 + 45$$

Sviluppa il quadrato del binomio, come nei [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli):

$$
\begin{gathered}
x^2 + 6x + 9 = x^2 + 45 \\
\Rightarrow 6x = 45 - 9 \\
\Rightarrow 6x = 36 \\
\Rightarrow x = 6
\end{gathered}
$$

Il termine $x^2$ compare in entrambi i membri e si cancella, quindi l'equazione è di primo grado. $x = 6$ è accettabile. Controllo: il quadrato di lato $6$ cm ha area $36$ cm², quello di lato $9$ cm ha area $81$ cm², e $81 - 36 = 45$. Il lato è lungo $6$ cm.
```

```ad-example
Esempio 5: percentuali una dopo l'altra
Luca spende il $25\%$ dei suoi risparmi per un libro e poi il $40\%$ di quello che gli resta per un gioco. Alla fine ha ancora $36$ €. Quanto aveva all'inizio?

Chiama $x$ i risparmi iniziali, in euro, con $x > 0$. Le percentuali si trasformano in numeri decimali come in [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).

Dopo il libro restano $x - 0{,}25x = 0{,}75x$. Il gioco costa il $40\%$ di questo resto, cioè $0{,}4 \cdot 0{,}75x = 0{,}3x$. Quello che rimane alla fine è:

$$
\begin{gathered}
0{,}75x - 0{,}3x = 36 \\
\Rightarrow 0{,}45x = 36 \\
\Rightarrow x = \frac{36}{0{,}45} = 80
\end{gathered}
$$

Controllo sul testo: il libro costa $20$ €, restano $60$ €; il gioco costa il $40\%$ di $60$, cioè $24$ €, e restano $36$ €. Luca aveva $80$ €.
```

```ad-warning
Sommare le percentuali
Il $40\%$ è calcolato su quello che resta dopo il libro, non sui risparmi iniziali. Sommare $25\% + 40\% = 65\%$ e scrivere $0{,}35x = 36$ dà $x \approx 102{,}86$, che non supera la verifica sul testo.
```

```ad-example
Esempio 6: due veicoli che si vengono incontro
Due città $A$ e $B$ distano $210$ km. Alle $9$ un'auto parte da $A$ verso $B$ a $80$ km/h, e nello stesso momento un camion parte da $B$ verso $A$ a $60$ km/h. A che ora si incontrano, e a che distanza da $A$?

Per un veicolo che va a velocità costante, lo spazio percorso è la velocità per il tempo: $s = v \cdot t$. Chiama $t$ il tempo che passa dalla partenza all'incontro, in ore, con $t > 0$. In quel tempo l'auto percorre $80t$ km e il camion $60t$ km, e insieme coprono tutta la distanza tra le città.

```tikz
% nome: moto-incontro-due-veicoli
% alt: Segmento da A a B lungo 210 km; l'auto parte da A e il camion da B, e si incontrano nel punto P dopo aver percorso 80t e 60t chilometri
% svg: moto-incontro-due-veicoli-42c5620f.svg 250x88
\begin{tikzpicture}
\draw[thick] (0,0) -- (6,0);
\fill (0,0) circle (2pt) node[below=3pt] {$A$};
\fill (6,0) circle (2pt) node[below=3pt] {$B$};
\fill (3.43,0) circle (2pt) node[below=3pt] {$P$};
\draw[->, thick, blue!50] (0,0.35) -- (3.25,0.35);
\node[above, font=\small] at (1.6,0.35) {auto, $80t$};
\draw[->, thick, orange!70] (6,0.35) -- (3.6,0.35);
\node[above, font=\small] at (4.8,0.35) {camion, $60t$};
\draw[<->] (0,-0.9) -- (6,-0.9);
\node[below] at (3,-0.9) {$210$ km};
\end{tikzpicture}
```

Fai partire i due veicoli, o sposta il tempo $t$: guarda come crescono $80t$ e $60t$, e quanto fa la loro somma quando si incontrano.

```interattivo
% nome: moto-incontro-tempo
% alt: Segmento AB lungo 210 km con un'auto che parte da A e un camion che parte da B; un cursore sposta il tempo t in ore, e un bottone avvia il moto. Le frecce 80t e 60t si allungano con il tempo e sotto compaiono i chilometri percorsi e l'ora; per t uguale a 3 mezzi, alle 10:30, i due veicoli si incontrano nel punto P, a 120 km da A, e 120 più 90 fa 210.
```

$$
\begin{gathered}
80t + 60t = 210 \\
\Rightarrow 140t = 210 \\
\Rightarrow t = \frac{210}{140} = \frac{3}{2}
\end{gathered}
$$

$t = \dfrac{3}{2}$ è positivo, quindi accettabile: i due veicoli si incontrano dopo un'ora e mezza, cioè alle $10{:}30$. In quel tempo l'auto ha percorso $80 \cdot \dfrac{3}{2} = 120$ km e il camion $60 \cdot \dfrac{3}{2} = 90$ km, e $120 + 90 = 210$. Si incontrano a $120$ km da $A$.
```

```ad-example
Esempio 7: una miscela
Un negoziante mescola un caffè da $12$ €/kg con un caffè da $18$ €/kg, e vuole ottenere $30$ kg di miscela da vendere a $14$ €/kg. Quanti chili deve usare di ciascun caffè?

Chiama $x$ i chili del caffè da $12$ €/kg: allora quelli del caffè da $18$ €/kg sono $30 - x$, e la limitazione è $0 \leq x \leq 30$. Il valore della miscela è la somma dei valori dei due caffè:

$$12x + 18(30 - x) = 14 \cdot 30$$

$$
\begin{gathered}
12x + 540 - 18x = 420 \\
\Rightarrow -6x = -120 \\
\Rightarrow x = 20
\end{gathered}
$$

$x = 20$ sta tra $0$ e $30$. Controllo: $20$ kg a $12$ €/kg valgono $240$ €, $10$ kg a $18$ €/kg valgono $180$ €, e $240 + 180 = 420 = 14 \cdot 30$. Servono $20$ kg del primo caffè e $10$ kg del secondo.

Se il negoziante volesse una miscela da $20$ €/kg, l'equazione darebbe $-6x = 60$, cioè $x = -10$, che non è accettabile: una miscela non può costare più del più caro dei due caffè.
```

```ad-example
Esempio 8: due rubinetti
Un rubinetto riempie una vasca in $4$ ore, un altro in $6$ ore. Aperti insieme, in quanto tempo la riempiono?

Chiama $x$ il tempo in ore, con $x > 0$. In un'ora il primo rubinetto riempie $\dfrac{1}{4}$ della vasca e il secondo $\dfrac{1}{6}$, quindi in $x$ ore riempiono $\dfrac{x}{4}$ e $\dfrac{x}{6}$ della vasca. Insieme devono riempirla tutta, cioè $1$ vasca:

$$\frac{x}{4} + \frac{x}{6} = 1$$

Moltiplica per il MCM dei denominatori, $12$:

$$
\begin{gathered}
3x + 2x = 12 \\
\Rightarrow 5x = 12 \\
\Rightarrow x = \frac{12}{5}
\end{gathered}
$$

$x = \dfrac{12}{5} = 2{,}4$ è positivo, quindi accettabile. In ore e minuti: $0{,}4$ ore sono $0{,}4 \cdot 60 = 24$ minuti. Controllo: in $2{,}4$ ore il primo rubinetto riempie $\dfrac{2{,}4}{4} = 0{,}6$ della vasca e il secondo $\dfrac{2{,}4}{6} = 0{,}4$, e $0{,}6 + 0{,}4 = 1$. Insieme riempiono la vasca in $2$ ore e $24$ minuti.
```

```ad-warning
Sommare i tempi
Due rubinetti insieme fanno prima di ciascuno dei due da solo, quindi il tempo cercato è minore di $4$ ore. Rispondere $4 + 6 = 10$ ore, o fare la media dei due tempi, dà un numero più grande. Nei problemi di lavoro si sommano le parti di lavoro fatte in un'ora, non i tempi.
```

```ad-warning
Leggere 2,4 ore come 2 ore e 40 minuti
Un'ora ha $60$ minuti, non $100$: la parte decimale di un tempo in ore si moltiplica per $60$. $2{,}4$ ore sono $2$ ore e $24$ minuti.
```
