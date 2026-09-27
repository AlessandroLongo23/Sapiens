# Razionalizzazione

I numeri $\dfrac{1}{\sqrt{2}}$ e $\dfrac{\sqrt{2}}{2}$ sono uguali: moltiplicando per $\sqrt{2}$ il numeratore e il denominatore del primo si ottiene il secondo. Il secondo però ha al denominatore un numero intero, e con quella forma i conti che vengono dopo sono più facili. Trasformare una frazione così, togliendo i radicali dal denominatore, si chiama razionalizzare, ed è l'ultimo passo di molti esercizi con i radicali.

## Che cosa vuol dire razionalizzare

**Razionalizzare il denominatore** di una frazione vuol dire scriverla come una frazione equivalente che al denominatore non ha radicali. Si fa con la [proprietà invariantiva](/materiale/scuola-superiore/matematica/numeri-razionali/frazioni-e-numeri-razionali): si moltiplicano numeratore e denominatore per lo stesso numero diverso da zero, scelto in modo che il denominatore diventi razionale. Quel numero si chiama **fattore razionalizzante**.

$$
\begin{aligned}
\frac{1}{\sqrt{2}} &= \frac{1}{\sqrt{2}} \cdot \frac{\sqrt{2}}{\sqrt{2}} \\
&= \frac{\sqrt{2}}{2}
\end{aligned}
$$

Qui il fattore razionalizzante è $\sqrt{2}$, perché $\sqrt{2} \cdot \sqrt{2} = 2$. Moltiplicare per $\dfrac{\sqrt{2}}{\sqrt{2}}$ vuol dire moltiplicare per $1$: il numero non cambia, cambia solo il modo di scriverlo. Il radicale non sparisce, si sposta al numeratore, dove non dà fastidio.

Il fattore razionalizzante dipende dalla forma del denominatore. I casi che si incontrano sono tre: una radice quadrata, una radice di indice $n$ e un binomio con uno o due radicali quadratici. Nei conti servono le [operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali), cioè il prodotto, la semplificazione e il trasporto fuori dal segno di radice, e alla fine il risultato va sempre semplificato.

```ad-note
Lettere positive
Negli esempi con le lettere, le lettere indicano numeri positivi: così ogni radicale esiste e non servono valori assoluti. Le condizioni di esistenza con lettere di segno qualsiasi sono nella lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta). Quando un denominatore con le lettere si può annullare, la condizione per cui è diverso da zero è scritta accanto.
```

## Perché si razionalizza

Il primo motivo è avere una forma sola per ogni risultato. Due studenti che trovano $\dfrac{1}{\sqrt{2}}$ e $\dfrac{\sqrt{2}}{2}$ hanno lo stesso numero, ma a occhio non si vede; con il denominatore razionale i risultati si confrontano subito. Per questo nei libri e nelle verifiche il risultato si dà sempre con il denominatore razionalizzato.

Il secondo motivo è che dopo aver razionalizzato si riconoscono i [radicali simili](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali) e si sommano:

$$
\begin{aligned}
\frac{1}{\sqrt{2}} + \sqrt{2} &= \frac{\sqrt{2}}{2} + \sqrt{2} \\
&= \frac{3\sqrt{2}}{2}
\end{aligned}
$$

Il terzo motivo è storico: prima delle calcolatrici i conti si facevano a mano, e dividere $1{,}4142$ per $2$ è molto più facile che dividere $1$ per $1{,}4142$. Il risultato è lo stesso, circa $0{,}7071$.

## Denominatore con una radice quadrata

Se il denominatore è $\sqrt{a}$, il fattore razionalizzante è $\sqrt{a}$ stesso, perché $\sqrt{a} \cdot \sqrt{a} = a$:

$$\frac{b}{\sqrt{a}} = \frac{b\sqrt{a}}{a}$$

Se davanti alla radice c'è un numero, come in $2\sqrt{10}$, il fattore razionalizzante resta la sola radice: il numero davanti è già razionale.

```ad-example
Esempio 1: il caso più semplice
Razionalizza $\dfrac{6}{\sqrt{3}}$.

Moltiplica numeratore e denominatore per $\sqrt{3}$, poi semplifica il $6$ con il $3$:

$$
\begin{aligned}
\frac{6}{\sqrt{3}} &= \frac{6}{\sqrt{3}} \cdot \frac{\sqrt{3}}{\sqrt{3}} \\
&= \frac{6\sqrt{3}}{3} = 2\sqrt{3}
\end{aligned}
$$
```

```ad-warning
Moltiplicare solo il denominatore
$\dfrac{6}{\sqrt{3}} = \dfrac{6}{3}$ è sbagliato: moltiplicando il denominatore per $\sqrt{3}$ e lasciando il numeratore com'era, la frazione cambia valore. Il fattore razionalizzante va messo sopra e sotto, sempre.
```

```ad-example
Esempio 2: un numero davanti alla radice
Razionalizza $\dfrac{5}{2\sqrt{10}}$.

Il $2$ è già razionale, quindi basta moltiplicare per $\sqrt{10}$. Al denominatore $2\sqrt{10} \cdot \sqrt{10} = 2 \cdot 10 = 20$.

$$
\begin{aligned}
\frac{5}{2\sqrt{10}} &= \frac{5\sqrt{10}}{2 \cdot 10} \\
&= \frac{5\sqrt{10}}{20} = \frac{\sqrt{10}}{4}
\end{aligned}
$$

Moltiplicare per $2\sqrt{10}$ non sarebbe sbagliato, ma darebbe $\dfrac{10\sqrt{10}}{40}$, con numeri più grandi da semplificare.
```

```ad-example
Esempio 3: prima semplifica il radicale
Razionalizza $\dfrac{3}{\sqrt{12}}$.

$12 = 4 \cdot 3$, quindi $\sqrt{12} = 2\sqrt{3}$. Con il radicale semplificato il fattore razionalizzante è $\sqrt{3}$:

$$
\begin{aligned}
\frac{3}{\sqrt{12}} &= \frac{3}{2\sqrt{3}} \\
&= \frac{3\sqrt{3}}{2 \cdot 3} = \frac{\sqrt{3}}{2}
\end{aligned}
$$

Moltiplicando subito per $\sqrt{12}$ arrivi allo stesso risultato, passando per $\dfrac{3\sqrt{12}}{12} = \dfrac{\sqrt{12}}{4}$ e poi semplificando $\sqrt{12}$.
```

```ad-warning
Semplificare un numero dentro la radice con uno fuori
$\dfrac{\sqrt{6}}{3} = \sqrt{2}$ è sbagliato: il $3$ fuori dalla radice non si semplifica con il $6$ sotto la radice. Con la calcolatrice $\dfrac{\sqrt{6}}{3} \approx 0{,}816$, mentre $\sqrt{2} \approx 1{,}414$. Si semplificano tra loro solo numeri che stanno entrambi fuori dalla radice, come il $6$ e il $3$ dell'esempio 1.
```

```ad-example
Esempio 4: con le lettere
Razionalizza $\dfrac{x}{\sqrt{xy}}$, con $x > 0$ e $y > 0$.

Il fattore razionalizzante è $\sqrt{xy}$, e $\sqrt{xy} \cdot \sqrt{xy} = xy$. Poi semplifica la $x$:

$$
\begin{aligned}
\frac{x}{\sqrt{xy}} &= \frac{x\sqrt{xy}}{xy} \\
&= \frac{\sqrt{xy}}{y}
\end{aligned}
$$
```

```ad-tip
Quando il numeratore contiene la radice del denominatore
Un numero positivo è il prodotto della sua radice quadrata per se stessa: $3 = \sqrt{3} \cdot \sqrt{3}$. Per questo $\dfrac{3}{\sqrt{3}} = \sqrt{3}$ e $\dfrac{a}{\sqrt{a}} = \sqrt{a}$, senza passare dal fattore razionalizzante.
```

## Denominatore con una radice di indice n

Se il denominatore è $\sqrt[n]{a^m}$, con $m$ minore di $n$, moltiplicare per lo stesso radicale non basta: $\sqrt[3]{2} \cdot \sqrt[3]{2} = \sqrt[3]{4}$ è ancora irrazionale. Serve un radicale che completi l'esponente fino a $n$, cioè $\sqrt[n]{a^{n - m}}$, perché

$$\sqrt[n]{a^m} \cdot \sqrt[n]{a^{n - m}} = \sqrt[n]{a^n} = a$$

Quindi, con $a > 0$ e $0 < m < n$:

$$\frac{b}{\sqrt[n]{a^m}} = \frac{b\sqrt[n]{a^{n - m}}}{a}$$

Se sotto la radice c'è un numero, scomponilo in fattori primi e completa l'esponente di ognuno fino all'indice. Se un esponente è già maggiore o uguale all'indice, prima [porta fuori](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali) il fattore dalla radice.

```ad-example
Esempio 5: radice quinta
Razionalizza $\dfrac{10}{\sqrt[5]{8}}$.

$8 = 2^3$: l'indice è $5$, quindi mancano $5 - 3 = 2$ fattori $2$, e il fattore razionalizzante è $\sqrt[5]{2^2} = \sqrt[5]{4}$. Al denominatore $\sqrt[5]{2^3 \cdot 2^2} = \sqrt[5]{2^5} = 2$.

$$
\begin{aligned}
\frac{10}{\sqrt[5]{8}} &= \frac{10\sqrt[5]{4}}{\sqrt[5]{32}} \\
&= \frac{10\sqrt[5]{4}}{2} = 5\sqrt[5]{4}
\end{aligned}
$$
```

```ad-warning
Moltiplicare per lo stesso radicale
Con la radice quadrata funziona, con le altre no. $\dfrac{1}{\sqrt[3]{2}} \cdot \dfrac{\sqrt[3]{2}}{\sqrt[3]{2}}$ dà al denominatore $\sqrt[3]{4}$, ancora irrazionale. Il fattore giusto è $\sqrt[3]{2^2} = \sqrt[3]{4}$, perché $\sqrt[3]{2} \cdot \sqrt[3]{4} = \sqrt[3]{8} = 2$.
```

```ad-example
Esempio 6: due fattori primi diversi
Razionalizza $\dfrac{6}{\sqrt[3]{12}}$.

$12 = 2^2 \cdot 3$. Per arrivare all'esponente $3$ serve un altro $2$ e servono altri due $3$: il fattore razionalizzante è $\sqrt[3]{2 \cdot 3^2} = \sqrt[3]{18}$. Al denominatore $\sqrt[3]{2^3 \cdot 3^3} = 2 \cdot 3 = 6$.

$$
\begin{aligned}
\frac{6}{\sqrt[3]{12}} &= \frac{6\sqrt[3]{18}}{\sqrt[3]{216}} \\
&= \frac{6\sqrt[3]{18}}{6} = \sqrt[3]{18}
\end{aligned}
$$
```

```ad-example
Esempio 7: con le lettere
Razionalizza $\dfrac{a}{\sqrt[4]{a^3b}}$, con $a > 0$ e $b > 0$.

L'indice è $4$: alla $a$ manca un fattore, alla $b$ ne mancano tre. Il fattore razionalizzante è $\sqrt[4]{ab^3}$, e al denominatore $\sqrt[4]{a^4b^4} = ab$.

$$
\begin{aligned}
\frac{a}{\sqrt[4]{a^3b}} &= \frac{a\sqrt[4]{ab^3}}{ab} \\
&= \frac{\sqrt[4]{ab^3}}{b}
\end{aligned}
$$
```

## Denominatore con un binomio: il coniugato

Se il denominatore è una somma o una differenza con radicali quadratici, come $\sqrt{5} - 1$ o $\sqrt{7} + \sqrt{5}$, moltiplicare per un solo radicale non basta. Si usa la [somma per differenza](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli), $(A + B)(A - B) = A^2 - B^2$: elevando al quadrato ogni termine, le radici quadrate spariscono.

Il **coniugato** di un binomio è il binomio con gli stessi termini e il segno del secondo cambiato: il coniugato di $\sqrt{a} + \sqrt{b}$ è $\sqrt{a} - \sqrt{b}$, e viceversa; il coniugato di $a - \sqrt{b}$ è $a + \sqrt{b}$. Il prodotto di un binomio per il suo coniugato non ha più radici quadrate:

$$
\begin{gathered}
(\sqrt{a} + \sqrt{b})(\sqrt{a} - \sqrt{b}) = a - b \\
(a + \sqrt{b})(a - \sqrt{b}) = a^2 - b
\end{gathered}
$$

Il fattore razionalizzante è il coniugato del denominatore. Con $a \neq b$ nel primo caso e $a^2 \neq b$ nel secondo, perché il denominatore non sia zero:

$$
\begin{gathered}
\frac{c}{\sqrt{a} \pm \sqrt{b}} = \frac{c(\sqrt{a} \mp \sqrt{b})}{a - b} \\[1ex]
\frac{c}{a \pm \sqrt{b}} = \frac{c(a \mp \sqrt{b})}{a^2 - b}
\end{gathered}
$$

Il segno $\mp$ vuol dire che al numeratore c'è il segno opposto a quello del denominatore.

```ad-warning
Spezzare il denominatore
$\dfrac{1}{\sqrt{2} + \sqrt{3}} = \dfrac{1}{\sqrt{2}} + \dfrac{1}{\sqrt{3}}$ è falso: una frazione si spezza in una somma quando la somma è al numeratore, non al denominatore. Con la calcolatrice il primo numero è circa $0{,}318$, il secondo circa $1{,}284$.
```

```ad-example
Esempio 8: un numero e un radicale
Razionalizza $\dfrac{4}{\sqrt{5} - 1}$.

Il coniugato di $\sqrt{5} - 1$ è $\sqrt{5} + 1$. Al denominatore $(\sqrt{5})^2 - 1^2 = 5 - 1 = 4$.

$$
\begin{aligned}
\frac{4}{\sqrt{5} - 1} &= \frac{4(\sqrt{5} + 1)}{5 - 1} \\
&= \frac{4(\sqrt{5} + 1)}{4} \\
&= \sqrt{5} + 1
\end{aligned}
$$
```

```ad-warning
Il coniugato sbagliato
Il coniugato di $\sqrt{5} - 1$ è $\sqrt{5} + 1$: cambia segno solo il secondo termine. Moltiplicando per $\sqrt{5} - 1$ stesso si ottiene $(\sqrt{5} - 1)^2 = 6 - 2\sqrt{5}$, che ha ancora la radice; moltiplicando per $-\sqrt{5} + 1$, che è l'opposto, succede lo stesso con il segno meno davanti.
```

```ad-example
Esempio 9: due radicali
Razionalizza $\dfrac{2}{\sqrt{7} + \sqrt{5}}$.

Il coniugato è $\sqrt{7} - \sqrt{5}$, e al denominatore $7 - 5 = 2$.

$$
\begin{aligned}
\frac{2}{\sqrt{7} + \sqrt{5}} &= \frac{2(\sqrt{7} - \sqrt{5})}{7 - 5} \\
&= \sqrt{7} - \sqrt{5}
\end{aligned}
$$
```

```ad-example
Esempio 10: un numero davanti al radicale
Razionalizza $\dfrac{1}{3 - 2\sqrt{2}}$.

Il coniugato è $3 + 2\sqrt{2}$. Al denominatore il quadrato del secondo termine è $(2\sqrt{2})^2 = 4 \cdot 2 = 8$, quindi $9 - 8 = 1$.

$$
\begin{aligned}
\frac{1}{3 - 2\sqrt{2}} &= \frac{3 + 2\sqrt{2}}{9 - 8} \\
&= 3 + 2\sqrt{2}
\end{aligned}
$$
```

```ad-warning
Il quadrato di un termine con il numero davanti
$(2\sqrt{2})^2$ vale $8$, non $4$ e non $2$: si elevano al quadrato sia il $2$ sia $\sqrt{2}$, e $4 \cdot 2 = 8$. Con $(2\sqrt{2})^2 = 4$ l'esempio 10 darebbe al denominatore $9 - 4 = 5$.
```

```ad-example
Esempio 11: il denominatore diventa negativo
Razionalizza $\dfrac{3}{2 - \sqrt{7}}$.

Il coniugato è $2 + \sqrt{7}$. Al denominatore $2^2 - 7 = 4 - 7 = -3$: è negativo, perché $\sqrt{7}$ è maggiore di $2$ e quindi anche $2 - \sqrt{7}$ era negativo.

$$
\begin{aligned}
\frac{3}{2 - \sqrt{7}} &= \frac{3(2 + \sqrt{7})}{4 - 7} \\
&= \frac{3(2 + \sqrt{7})}{-3} \\
&= -2 - \sqrt{7}
\end{aligned}
$$

Dividendo per $-3$ cambiano segno tutti e due i termini della parentesi.
```

```ad-warning
Il segno meno solo sul primo termine
Nell'esempio 11 il risultato è $-(2 + \sqrt{7}) = -2 - \sqrt{7}$. Scrivere $-2 + \sqrt{7}$ è sbagliato: il segno meno davanti alla parentesi cambia il segno di ogni termine.
```

```ad-example
Esempio 12: un radicale anche al numeratore
Razionalizza $\dfrac{\sqrt{3} + 1}{\sqrt{3} - 1}$.

Moltiplica per il coniugato $\sqrt{3} + 1$. Al numeratore c'è il [quadrato di un binomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli), $(\sqrt{3} + 1)^2 = 3 + 2\sqrt{3} + 1 = 4 + 2\sqrt{3}$; al denominatore $3 - 1 = 2$.

$$
\begin{aligned}
\frac{\sqrt{3} + 1}{\sqrt{3} - 1} &= \frac{(\sqrt{3} + 1)^2}{3 - 1} \\
&= \frac{4 + 2\sqrt{3}}{2} \\
&= 2 + \sqrt{3}
\end{aligned}
$$

Per semplificare hai diviso per $2$ tutti e due i termini del numeratore: $\dfrac{4 + 2\sqrt{3}}{2}$ è $2 + \sqrt{3}$, non $2 + 2\sqrt{3}$.
```

```ad-example
Esempio 13: con le lettere
Razionalizza $\dfrac{x}{\sqrt{x + 1} - 1}$, con $x > 0$.

Con $x > 0$ si ha $\sqrt{x + 1} > 1$, quindi il denominatore non è zero. Il coniugato è $\sqrt{x + 1} + 1$, e al denominatore $(x + 1) - 1 = x$.

$$
\begin{aligned}
\frac{x}{\sqrt{x + 1} - 1} &= \frac{x(\sqrt{x + 1} + 1)}{x} \\
&= \sqrt{x + 1} + 1
\end{aligned}
$$
```

```ad-tip
A volte si semplifica senza razionalizzare
Con $a > 0$, $b > 0$ e $a \neq b$, il numeratore $a - b$ si scompone come una differenza di quadrati: $a - b = (\sqrt{a} - \sqrt{b})(\sqrt{a} + \sqrt{b})$. Quindi $\dfrac{a - b}{\sqrt{a} - \sqrt{b}} = \sqrt{a} + \sqrt{b}$, semplificando il fattore comune. Lo stesso vale con il segno più: nell'esempio 9 il numeratore è $2 = 7 - 5 = (\sqrt{7} + \sqrt{5})(\sqrt{7} - \sqrt{5})$, e per questo il risultato è $\sqrt{7} - \sqrt{5}$.
```

```ad-note
Denominatori con tre termini
Alcuni libri razionalizzano anche denominatori come $1 + \sqrt{2} + \sqrt{3}$. Si raggruppano due termini, $(1 + \sqrt{2}) + \sqrt{3}$, e si moltiplica per $(1 + \sqrt{2}) - \sqrt{3}$: al denominatore resta $(1 + \sqrt{2})^2 - 3 = 2\sqrt{2}$, che si razionalizza con $\sqrt{2}$. Il risultato è $\dfrac{1}{1 + \sqrt{2} + \sqrt{3}} = \dfrac{2 + \sqrt{2} - \sqrt{6}}{4}$.
```

```ad-note
Radici cubiche in un binomio
Con le radici cubiche il coniugato non basta, perché $(\sqrt[3]{2} - 1)(\sqrt[3]{2} + 1) = \sqrt[3]{4} - 1$. Si usa la [differenza di cubi](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli), $(A - B)(A^2 + AB + B^2) = A^3 - B^3$. Con $A = \sqrt[3]{2}$ e $B = 1$ il fattore razionalizzante è $\sqrt[3]{4} + \sqrt[3]{2} + 1$, e $\dfrac{1}{\sqrt[3]{2} - 1} = \sqrt[3]{4} + \sqrt[3]{2} + 1$.
```

## Controllare il risultato

Razionalizzare non cambia il valore della frazione, quindi il controllo più veloce è con la calcolatrice: la frazione di partenza e il risultato devono dare lo stesso numero. Nell'esempio 8, $\dfrac{4}{\sqrt{5} - 1} \approx \dfrac{4}{1{,}236} \approx 3{,}236$ e $\sqrt{5} + 1 \approx 3{,}236$.

Il controllo dice se il conto è giusto, non se è finito. Alla fine guarda tre cose: al denominatore non ci sono radicali; i radicali sono semplificati, come $2\sqrt{3}$ invece di $\sqrt{12}$; la frazione è ridotta, cioè numeratore e denominatore non hanno più fattori numerici comuni che si possano dividere.
