# Espressioni con i radicali

Un'espressione con i radicali è una catena di operazioni tra numeri reali in cui compaiono radici: somme e differenze di radicali, prodotti, quozienti, potenze, frazioni con un radicale al denominatore. Le singole operazioni sono nelle lezioni [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta), [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali) e [Razionalizzazione](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/razionalizzazione): qui si mettono in fila, nell'ordine giusto, fino a un risultato scritto nella forma più semplice. Nella seconda parte le stesse regole servono per risolvere equazioni e disequazioni di primo grado con coefficienti irrazionali, come $\sqrt{3}\,x - 2 = x$.

## L'ordine delle operazioni

L'ordine è lo stesso delle [espressioni con le frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/espressioni-con-frazioni): prima le parentesi, dalle più interne; poi le potenze e le radici; poi prodotti e quozienti, da sinistra verso destra; per ultime somme e differenze.

Il segno di radice fa anche da parentesi: tutto quello che sta sotto la linea della radice è il radicando, e va calcolato prima di estrarre la radice. In $\sqrt{9 + 16}$ si fa prima la somma, $\sqrt{25} = 5$, e solo dopo la radice.

```ad-warning
La radice di una somma
$\sqrt{9 + 16} = \sqrt{25} = 5$, mentre $\sqrt{9} + \sqrt{16} = 3 + 4 = 7$. La radice di una somma non è la somma delle radici: $\sqrt{a + b}$ non si spezza in $\sqrt{a} + \sqrt{b}$. Si spezzano solo i prodotti e i quozienti, $\sqrt{4 \cdot 3} = \sqrt{4} \cdot \sqrt{3}$.
```

## Quando il risultato è finito

Il risultato di un'espressione con i radicali si considera finito quando:

- ogni radicale è semplificato, con fuori dal segno di radice tutti i fattori che si possono portare fuori ($2\sqrt{3}$, non $\sqrt{12}$);
- i radicali simili, cioè con lo stesso indice e lo stesso radicando, sono sommati in un termine solo;
- nessun denominatore contiene radicali ($\dfrac{\sqrt{3}}{3}$, non $\dfrac{1}{\sqrt{3}}$);
- i numeri razionali sono ridotti, come in $1 + 2\sqrt{3}$ invece di $\dfrac{2 + 4\sqrt{3}}{2}$.

Spesso il risultato ha la forma $a + b\sqrt{c}$, con $a$ e $b$ razionali: $5 + 2\sqrt{3}$, $2 - \sqrt{2}$, $3\sqrt{5}$. Due espressioni che danno lo stesso numero possono sembrare diverse finché non le porti entrambe a questa forma: per questo, prima di confrontare il tuo risultato con quello del libro, finisci tutti i passaggi.

```ad-warning
Semplificare solo un termine
In $\dfrac{2 + 4\sqrt{3}}{2}$ il $2$ del denominatore divide tutti e due i termini del numeratore: il risultato è $1 + 2\sqrt{3}$, non $1 + 4\sqrt{3}$. Se un termine non è divisibile per il denominatore, come in $\dfrac{3 + 4\sqrt{3}}{2}$, la frazione resta com'è.
```

## Come si organizza il calcolo

1. Semplifica subito ogni radicale, portando fuori i fattori: con numeri più piccoli si sbaglia meno, e i radicali simili si riconoscono solo dopo.
2. Svolgi i prodotti, anche con i [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli) quando li riconosci: $(\sqrt{a} + \sqrt{b})(\sqrt{a} - \sqrt{b}) = a - b$ e $(\sqrt{a} + b)^2 = a + 2b\sqrt{a} + b^2$.
3. Razionalizza i denominatori: ogni frazione con un radicale al denominatore diventa una frazione con il denominatore razionale.
4. Somma i radicali simili e i numeri razionali, e riduci il risultato.

Con radicali di indice diverso, prima di moltiplicarli o dividerli li porti allo stesso indice, come nella lezione [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali).

```ad-warning
Sommare termini che non sono simili
$2 + 3\sqrt{2}$ non fa $5\sqrt{2}$: il $2$ è un numero razionale e $3\sqrt{2}$ un radicale, e non si sommano, come non si sommano $2$ e $3x$. Anche $\sqrt{2} + \sqrt{3}$ resta com'è. Si sommano solo i radicali simili: $3\sqrt{2} + 5\sqrt{2} = 8\sqrt{2}$.
```

## Esempi svolti

```ad-example
Esempio 1: semplificare prima di sommare
$$\sqrt{50} - 3\sqrt{8} + \sqrt{18}$$

I tre radicali non sono simili, ma lo diventano dopo aver portato fuori i fattori quadrati: $50 = 25 \cdot 2$, $8 = 4 \cdot 2$, $18 = 9 \cdot 2$.

$$
\begin{aligned}
&\sqrt{50} - 3\sqrt{8} + \sqrt{18} \\
&= 5\sqrt{2} - 3 \cdot 2\sqrt{2} + 3\sqrt{2} \\
&= 5\sqrt{2} - 6\sqrt{2} + 3\sqrt{2} \\
&= 2\sqrt{2}
\end{aligned}
$$
```

```ad-example
Esempio 2: prodotti notevoli
$$(\sqrt{3} + 1)^2 - (\sqrt{3} - 2)(\sqrt{3} + 2)$$

Il primo termine è il quadrato di un binomio: il quadrato del primo, il doppio prodotto, il quadrato del secondo. Il secondo termine è una somma per differenza, che dà la differenza dei quadrati.

$$
\begin{aligned}
(\sqrt{3} + 1)^2 &= 3 + 2\sqrt{3} + 1 \\
&= 4 + 2\sqrt{3}
\end{aligned}
$$

$$(\sqrt{3} - 2)(\sqrt{3} + 2) = 3 - 4 = -1$$

Il meno davanti al secondo termine cambia il segno di $-1$:

$$4 + 2\sqrt{3} - (-1) = 5 + 2\sqrt{3}$$
```

```ad-warning
Il quadrato di un binomio senza il doppio prodotto
$(\sqrt{3} + 1)^2$ non è $3 + 1$: manca il doppio prodotto $2 \cdot \sqrt{3} \cdot 1 = 2\sqrt{3}$. Il risultato giusto è $4 + 2\sqrt{3}$. Controllo veloce con i decimali: $\sqrt{3} + 1 \approx 2{,}73$, e $2{,}73^2 \approx 7{,}46$, che è circa $4 + 3{,}46$, non $4$.
```

```ad-example
Esempio 3: quozienti e razionalizzazione
$$\frac{\sqrt{6} + \sqrt{2}}{\sqrt{2}} - \frac{3}{\sqrt{3}}$$

Nella prima frazione il denominatore divide ogni termine del numeratore: $\dfrac{\sqrt{6}}{\sqrt{2}} = \sqrt{3}$ e $\dfrac{\sqrt{2}}{\sqrt{2}} = 1$. Nella seconda moltiplichi numeratore e denominatore per $\sqrt{3}$:

$$\frac{3}{\sqrt{3}} = \frac{3\sqrt{3}}{3} = \sqrt{3}$$

Quindi:

$$(\sqrt{3} + 1) - \sqrt{3} = 1$$

Il risultato è un numero razionale: succede spesso, e non vuol dire che hai sbagliato.
```

```ad-example
Esempio 4: denominatori con il coniugato
$$\frac{1}{\sqrt{3} - 1} + \frac{1}{\sqrt{3} + 1}$$

I due denominatori sono uno il coniugato dell'altro, e il loro prodotto è razionale: $(\sqrt{3} - 1)(\sqrt{3} + 1) = 3 - 1 = 2$. Conviene allora fare la somma con il denominatore comune $2$:

$$
\begin{aligned}
&\frac{(\sqrt{3} + 1) + (\sqrt{3} - 1)}{(\sqrt{3} - 1)(\sqrt{3} + 1)} \\
&= \frac{2\sqrt{3}}{2} \\
&= \sqrt{3}
\end{aligned}
$$

Allo stesso risultato arrivi razionalizzando le due frazioni una per una: $\dfrac{\sqrt{3} + 1}{2} + \dfrac{\sqrt{3} - 1}{2} = \sqrt{3}$.
```

```ad-example
Esempio 5: indici diversi
$$\sqrt{2} \cdot \sqrt[3]{4} : \sqrt[6]{2}$$

Gli indici sono $2$, $3$ e $6$: il loro minimo comune multiplo è $6$. Porti ogni radicale all'indice $6$, moltiplicando indice ed esponente del radicando per lo stesso numero:

$$
\begin{gathered}
\sqrt{2} = \sqrt[6]{2^3} \\
\sqrt[3]{4} = \sqrt[3]{2^2} = \sqrt[6]{2^4}
\end{gathered}
$$

Con lo stesso indice, prodotti e quozienti si fanno sotto un'unica radice, con le proprietà delle potenze:

$$
\begin{aligned}
\sqrt[6]{2^3 \cdot 2^4 : 2} &= \sqrt[6]{2^6} \\
&= 2
\end{aligned}
$$
```

```ad-example
Esempio 6: un'espressione con le lettere
Come nelle lezioni Operazioni con i radicali e Razionalizzazione, qui la lettera $a$ indica un numero positivo, così tutti i radicali esistono e i fattori escono senza valori assoluti. Il caso generale, con le condizioni di esistenza, è nella lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta).

$$\sqrt{9a^3} - a\sqrt{4a} + \frac{a^2}{\sqrt{a}}$$

Porta fuori i fattori dai primi due radicali, $9a^3 = 3^2 a^2 \cdot a$ e $4a = 2^2 \cdot a$, e razionalizza la frazione:

$$
\begin{gathered}
\sqrt{9a^3} = 3a\sqrt{a} \\
a\sqrt{4a} = 2a\sqrt{a} \\
\frac{a^2}{\sqrt{a}} = \frac{a^2\sqrt{a}}{a} = a\sqrt{a}
\end{gathered}
$$

I tre termini sono radicali simili:

$$3a\sqrt{a} - 2a\sqrt{a} + a\sqrt{a} = 2a\sqrt{a}$$
```

```ad-tip
Il controllo con i decimali
Con la calcolatrice, quando è permessa, calcola l'espressione di partenza e il risultato con i decimali: devono venire uguali, a meno degli arrotondamenti. Nell'esempio 2, $(\sqrt{3} + 1)^2 - (\sqrt{3} - 2)(\sqrt{3} + 2) \approx 7{,}46 + 1 = 8{,}46$, e $5 + 2\sqrt{3} \approx 5 + 3{,}46 = 8{,}46$. Con le lettere, prova con un numero, per esempio $a = 4$ nell'esempio 6: $\sqrt{576} - 4\sqrt{16} + \dfrac{16}{2} = 24 - 16 + 8 = 16$, e $2 \cdot 4 \cdot \sqrt{4} = 16$.
```

## Equazioni e disequazioni con coefficienti irrazionali

Un'equazione di primo grado può avere coefficienti irrazionali, come $\sqrt{3}\,x - 2 = x$. Si risolve con i principi di equivalenza delle [equazioni di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere): porti i termini con $x$ a primo membro, raccogli $x$ e dividi per il coefficiente. Il coefficiente però è un'espressione con i radicali, e la soluzione va scritta come il risultato di un'espressione: semplificata e con il denominatore razionalizzato.

Per esempio da $\sqrt{8}\,x - \sqrt{2}\,x = 4$ ottieni $2\sqrt{2}\,x - \sqrt{2}\,x = 4$, cioè $\sqrt{2}\,x = 4$, e dividendo per $\sqrt{2}$:

$$x = \frac{4}{\sqrt{2}} = \frac{4\sqrt{2}}{2} = 2\sqrt{2}$$

Nelle disequazioni c'è una cosa in più: come nelle [disequazioni di primo grado](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli), se dividi per un numero negativo il verso cambia. Un coefficiente come $\sqrt{3} - 2$ è negativo anche se non ha il segno meno davanti, e prima di dividere devi sapere il suo segno.

### Il segno di un coefficiente irrazionale

Per capire se $a - \sqrt{b}$ è positivo o negativo, con $a$ e $b$ positivi, confronta $a$ con $\sqrt{b}$ attraverso i quadrati: tra due numeri positivi, è maggiore quello che ha il quadrato maggiore.

- $\sqrt{3} - 2$: $2^2 = 4$ e $(\sqrt{3})^2 = 3$, quindi $2 > \sqrt{3}$ e il coefficiente è negativo.
- $\sqrt{5} - 2$: $(\sqrt{5})^2 = 5$ e $2^2 = 4$, quindi $\sqrt{5} > 2$ e il coefficiente è positivo.
- $1 - \sqrt{2}$: $1^2 = 1$ e $(\sqrt{2})^2 = 2$, quindi il coefficiente è negativo.

Puoi usare anche il valore approssimato: $\sqrt{3} \approx 1{,}73$, quindi $\sqrt{3} - 2 \approx -0{,}27$. Il confronto tra irrazionali è nella lezione [Numeri irrazionali e numeri reali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/numeri-irrazionali-e-numeri-reali).

```ad-example
Esempio 7: un'equazione
$$\sqrt{3}\,x - 2 = x$$

Porta $x$ a primo membro e $-2$ a secondo membro, poi raccogli $x$:

$$
\begin{gathered}
\sqrt{3}\,x - x = 2 \\
(\sqrt{3} - 1)\,x = 2
\end{gathered}
$$

Il coefficiente $\sqrt{3} - 1$ non è zero, quindi puoi dividere. Poi razionalizzi con il coniugato $\sqrt{3} + 1$:

$$
\begin{aligned}
x &= \frac{2}{\sqrt{3} - 1} \\
&= \frac{2(\sqrt{3} + 1)}{3 - 1} \\
&= \sqrt{3} + 1
\end{aligned}
$$

Verifica: $\sqrt{3}(\sqrt{3} + 1) - 2 = 3 + \sqrt{3} - 2 = \sqrt{3} + 1$, che è proprio $x$.
```

```ad-example
Esempio 8: una disequazione con il coefficiente negativo
$$\sqrt{3}\,x - 2 \le 2x$$

Porta i termini con $x$ a primo membro e raccogli:

$$
\begin{gathered}
\sqrt{3}\,x - 2x \le 2 \\
(\sqrt{3} - 2)\,x \le 2
\end{gathered}
$$

Il coefficiente $\sqrt{3} - 2$ è negativo, perché $\sqrt{3} < 2$: dividendo, $\le$ diventa $\ge$. Poi razionalizzi con il coniugato $\sqrt{3} + 2$, e al denominatore ottieni $3 - 4 = -1$:

$$
\begin{aligned}
x &\ge \frac{2}{\sqrt{3} - 2} \\
x &\ge \frac{2(\sqrt{3} + 2)}{3 - 4} \\
x &\ge -4 - 2\sqrt{3}
\end{aligned}
$$

Quindi $S = [-4 - 2\sqrt{3}, +\infty\mathclose{[}$. L'estremo vale circa $-4 - 3{,}46 = -7{,}46$.

```tikz
% nome: soluzioni-disequazione-coefficiente-irrazionale
% alt: Retta dei numeri colorata a destra di meno 4 meno 2 radice di 3, circa meno 7,46, con un pallino pieno nell'estremo: le soluzioni della disequazione
% svg: soluzioni-disequazione-coefficiente-irrazionale-6a903e1b.svg 260x39
\begin{tikzpicture}[x=0.55cm]
\draw[black!70, ->] (-9.5,0) -- (2,0);
\draw[blue!45, line width=2pt] (-7.464,0) -- (1.6,0);
\draw (0,-0.1) -- (0,0.1);
\filldraw[thick] (-7.464,0) circle (2.5pt);
\node[below] at (-7.464,-0.15) {$-4-2\sqrt{3}$};
\node[below] at (0,-0.15) {$0$};
\node[right] at (2,0) {$x$};
\end{tikzpicture}
```
```

```ad-example
Esempio 9: una disequazione con il coefficiente positivo
$$(\sqrt{5} - 2)\,x < \sqrt{5} + 2$$

Il coefficiente $\sqrt{5} - 2$ è positivo, perché $\sqrt{5} > 2$: dividendo, il verso resta. Il prodotto $(\sqrt{5} - 2)(\sqrt{5} + 2) = 5 - 4 = 1$, e quindi, moltiplicando per $\sqrt{5} + 2$ sopra e sotto:

$$
\begin{aligned}
x &< \frac{\sqrt{5} + 2}{\sqrt{5} - 2} \\
x &< \frac{(\sqrt{5} + 2)^2}{5 - 4} \\
x &< 5 + 4\sqrt{5} + 4 \\
x &< 9 + 4\sqrt{5}
\end{aligned}
$$

Quindi $S = \mathopen{]}-\infty, 9 + 4\sqrt{5}\mathclose{[}$.
```

```ad-warning
Il meno che non si vede
In $(1 - \sqrt{2})\,x > 3$ il coefficiente non ha il segno meno davanti, ma è negativo, perché $\sqrt{2} > 1$. Dividendo, il verso cambia: $x < \dfrac{3}{1 - \sqrt{2}}$, cioè $x < -3 - 3\sqrt{2}$. Scrivere $x > \dfrac{3}{1 - \sqrt{2}}$ dà proprio le soluzioni sbagliate. Prima di dividere, controlla sempre il segno del coefficiente con i quadrati o con i decimali.
```

```ad-note
I radicali doppi
Alcuni libri trattano anche i **radicali doppi**, cioè le radici quadrate di un'espressione che contiene a sua volta una radice quadrata, come $\sqrt{3 + 2\sqrt{2}}$. Con $a > 0$, $b > 0$ e $a^2 - b \ge 0$ vale la formula

$$
\sqrt{a \pm \sqrt{b}} = \sqrt{\frac{a + c}{2}} \pm \sqrt{\frac{a - c}{2}}
$$

dove $c = \sqrt{a^2 - b}$. La formula serve quando $a^2 - b$ è un quadrato perfetto: allora $c$ è razionale e il radicale doppio diventa una somma o una differenza di radicali semplici. In $\sqrt{3 + 2\sqrt{2}} = \sqrt{3 + \sqrt{8}}$ hai $a = 3$, $b = 8$, $a^2 - b = 1$, $c = 1$:

$$
\begin{aligned}
\sqrt{3 + \sqrt{8}} &= \sqrt{2} + \sqrt{1} \\
&= \sqrt{2} + 1
\end{aligned}
$$

Controllo: $(\sqrt{2} + 1)^2 = 2 + 2\sqrt{2} + 1 = 3 + 2\sqrt{2}$. Allo stesso modo $\sqrt{7 - \sqrt{40}} = \sqrt{5} - \sqrt{2}$, perché $49 - 40 = 9$ e $c = 3$. Se $a^2 - b$ non è un quadrato perfetto, la formula non semplifica niente e il radicale doppio resta com'è.
```
