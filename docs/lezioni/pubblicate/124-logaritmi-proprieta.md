# Logaritmi e loro proprietà

L'equazione $2^x = 8$ si risolve a mente: l'esponente che porta $2$ a $8$ è $3$. Con $2^x = 5$ non funziona, perché $5$ non è una potenza di $2$ con esponente intero: $2^2 = 4$ è troppo poco e $2^3 = 8$ è troppo. L'esponente giusto esiste, sta tra $2$ e $3$, e ha un nome: è il logaritmo in base $2$ di $5$. Il logaritmo è l'operazione che, data la base e il risultato di una potenza, trova l'esponente.

Per seguire la lezione ti servono le proprietà delle potenze, fino alle [potenze con esponente razionale](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/potenze-con-esponente-razionale), e la [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale), dove trovi le potenze con esponente reale e il numero $e$.

## Che cos'è un logaritmo

Siano $a$ e $b$ due numeri reali positivi, con $a \neq 1$. Il **logaritmo in base $a$ di $b$** è l'esponente che bisogna dare ad $a$ per ottenere $b$. Si scrive $\log_a b$:

$$\log_a b = c \iff a^c = b$$

Il numero $a$ è la **base** del logaritmo e $b$ è l'**argomento**. Le due scritture dicono la stessa cosa in due modi: $2^3 = 8$ e $\log_2 8 = 3$ sono la stessa uguaglianza, letta la prima dal lato della potenza e la seconda dal lato dell'esponente.

| Potenza | Logaritmo |
|---|---|
| $2^3 = 8$ | $\log_2 8 = 3$ |
| $3^{-2} = \dfrac{1}{9}$ | $\log_3 \dfrac{1}{9} = -2$ |
| $\left(\dfrac{1}{2}\right)^{-2} = 4$ | $\log_{\frac{1}{2}} 4 = -2$ |
| $5^{\frac{1}{2}} = \sqrt{5}$ | $\log_5 \sqrt{5} = \dfrac{1}{2}$ |
| $10^{-3} = 0{,}001$ | $\log_{10} 0{,}001 = -3$ |

Che l'esponente esista sempre, e che sia uno solo, viene dalla [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale): al variare di $x$ la potenza $a^x$ assume tutti i valori positivi, ognuno una volta sola. Nel grafico di $y = 2^x$ la retta orizzontale $y = 5$ incontra la curva in un solo punto, e l'ascissa di quel punto è $\log_2 5$, che vale circa $2{,}32$.

```tikz
% nome: logaritmo-come-esponente-grafico
% alt: Il grafico di y = 2 alla x con le rette orizzontali y = 5 e y = 8: la prima incontra la curva nel punto di ascissa logaritmo in base 2 di 5, circa 2,32, la seconda nel punto di ascissa 3, che è il logaritmo in base 2 di 8
% svg: logaritmo-come-esponente-grafico-32e5890c.svg 265x240
\begin{tikzpicture}[xscale=0.95, yscale=0.48]
\draw[gray!25, very thin] (-2.5,-0.5) grid (3.5,9.5);
\draw[->] (-2.8,0) -- (4,0) node[right] {$x$};
\draw[->] (0,-0.8) -- (0,10.2) node[above] {$y$};
\foreach \x in {-2,-1,1,2} \node[below] at (\x,0) {\small $\x$};
\node[left] at (0,5) {\small $5$};
\node[left] at (0,8) {\small $8$};
\node[above left] at (0,1) {\small $1$};
\draw[thick, blue!60, domain=-2.5:3.22, samples=60, smooth] plot (\x, {pow(2,\x)});
\draw[dashed, gray] (0,8) -- (3,8) -- (3,0);
\draw[dashed, orange!80] (0,5) -- (2.322,5) -- (2.322,0);
\fill (3,8) ellipse (0.07 and 0.14);
\fill (2.322,5) ellipse (0.07 and 0.14);
\fill (0,1) ellipse (0.07 and 0.14);
\node[below] at (3.05,0) {\small $3$};
\node[below, orange!60!black] at (2.2,-0.75) {\small $\log_2 5$};
\node[blue!60!black, left] at (2.9,9.3) {$y = 2^x$};
\end{tikzpicture}
```
```grafico
% nome: logaritmo-come-esponente-cursori
% alt: Il grafico di y = a alla x e la retta orizzontale y = b, con i cursori di a e di b: il punto in cui si incontrano ha per ascissa il logaritmo in base a di b, scritto sotto il piano
curva: y=a^x
curva: y=b | tratteggiata | arancione
curva: P=\left(\frac{\ln\left(b\right)}{\ln\left(a\right)};b\right) | nero
cursore: a = 2 da 0,2 a 5 passo 0,1
cursore: b = 5 da -2 a 9 passo 0,1
finestra: x da -6 a 6, y da -2 a 10
valore: \log_a b = \frac{\ln\left(b\right)}{\ln\left(a\right)}
domanda: Con $a = 2$ porta $b$ sotto $1$, e poi sotto $0$: che cosa succede al logaritmo? Poi riporta $b$ a $5$ e porta $a$ a $1$: la curva incontra ancora la retta?
```

Con $a = 2$ e $b$ tra $0$ e $1$ il punto di incontro passa a sinistra dell'asse $y$: il logaritmo è negativo. Con $b$ negativo o nullo la retta sta sotto la curva e non la incontra più: il logaritmo non esiste. Con $a = 1$ la curva diventa la retta orizzontale $y = 1$, che non incontra la retta $y = 5$: nessun esponente porta $1$ a $5$. Sono le tre condizioni della definizione, una per volta.

### Perché servono queste condizioni

Senza le condizioni $a > 0$, $a \neq 1$ e $b > 0$ l'esponente cercato non esiste, oppure non è uno solo.

- L'argomento deve essere positivo, perché una potenza con la base positiva è sempre positiva: nessun esponente dà $2^c = -4$ o $2^c = 0$, quindi $\log_2 (-4)$ e $\log_2 0$ non esistono.
- La base deve essere diversa da $1$, perché $1^c = 1$ per ogni $c$: $\log_1 5$ non esiste (nessun esponente porta $1$ a $5$) e $\log_1 1$ potrebbe essere qualunque numero.
- La base deve essere positiva, perché le potenze con esponente reale sono definite solo per le basi positive.

```ad-warning
Il logaritmo può essere negativo, l'argomento no
$\log_3 \dfrac{1}{9} = -2$ è un logaritmo negativo e non ha niente di strano: è un esponente, e gli esponenti possono essere negativi. Quello che non può essere negativo, né nullo, è l'argomento: $\log_3 (-9)$ non esiste.
```

### Calcolare un logaritmo con la definizione

Quando base e argomento sono potenze dello stesso numero, il logaritmo si calcola così:

1. chiama $x$ il logaritmo e riscrivi l'uguaglianza come potenza: $\log_a b = x$ diventa $a^x = b$;
2. scrivi $a$ e $b$ come potenze di uno stesso numero;
3. uguaglia gli esponenti e ricava $x$.

Il terzo passo è lecito perché due potenze con la stessa base, positiva e diversa da $1$, sono uguali solo se hanno lo stesso esponente: è il principio con cui si risolvono le [equazioni esponenziali](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-esponenziali).

```ad-example
Esempio 1: base e argomento potenze di 2
Calcola $\log_4 8$.

Poni $\log_4 8 = x$, cioè $4^x = 8$. Sia $4$ sia $8$ sono potenze di $2$:

$$
\begin{gathered}
\left(2^2\right)^x = 2^3 \\
\Rightarrow 2^{2x} = 2^3 \\
\Rightarrow 2x = 3
\end{gathered}
$$

Quindi $\log_4 8 = \dfrac{3}{2}$. Verifica: $4^{\frac{3}{2}} = \left(\sqrt{4}\right)^3 = 2^3 = 8$.
```

```ad-example
Esempio 2: base minore di 1 e base con la radice
Calcola $\log_{\frac{1}{3}} 27$ e $\log_{\sqrt{2}} 8$.

Per il primo, $\left(\dfrac{1}{3}\right)^x = 27$. Poiché $\dfrac{1}{3} = 3^{-1}$ e $27 = 3^3$:

$$3^{-x} = 3^3 \ \Rightarrow \ x = -3$$

Quindi $\log_{\frac{1}{3}} 27 = -3$. Per il secondo, $\left(\sqrt{2}\right)^x = 8$ con $\sqrt{2} = 2^{\frac{1}{2}}$:

$$2^{\frac{x}{2}} = 2^3 \ \Rightarrow \ \frac{x}{2} = 3 \ \Rightarrow \ x = 6$$

Quindi $\log_{\sqrt{2}} 8 = 6$. Verifica: $\left(\sqrt{2}\right)^6 = 2^3 = 8$.
```

La stessa definizione serve quando l'incognita è l'argomento o la base.

```ad-example
Esempio 3: trovare l'argomento o la base
Trova $x$ in $\log_3 x = 4$, in $\log_x 16 = 2$ e in $\log_x \dfrac{1}{8} = -3$.

Nella prima l'incognita è l'argomento: $x = 3^4 = 81$.

Nella seconda l'incognita è la base: $x^2 = 16$. Le soluzioni dell'equazione sono $4$ e $-4$, ma una base è positiva, quindi $x = 4$.

Nella terza $x^{-3} = \dfrac{1}{8}$, cioè $\dfrac{1}{x^3} = \dfrac{1}{8}$, da cui $x^3 = 8$ e $x = 2$.
```

### Quattro uguaglianze da ricordare

Dalla definizione vengono subito, per ogni base $a$ positiva e diversa da $1$:

| Uguaglianza | Perché |
|---|---|
| $\log_a 1 = 0$ | $a^0 = 1$ |
| $\log_a a = 1$ | $a^1 = a$ |
| $\log_a a^c = c$ | l'esponente da dare ad $a$ per ottenere $a^c$ è $c$ |
| $a^{\log_a b} = b$ | $\log_a b$ è proprio l'esponente che porta $a$ a $b$ |

Le ultime due dicono che logaritmo e potenza con la stessa base si annullano a vicenda: $\log_2 2^5 = 5$ e $3^{\log_3 7} = 7$, senza fare conti. La terza vale per ogni $c$ reale, la quarta per ogni $b$ positivo.

### Logaritmi decimali e logaritmi naturali

Due basi si usano più di tutte le altre, e hanno una scrittura propria.

- Il **logaritmo decimale** ha base $10$ e si scrive $\log x$, senza la base: $\log 1000 = 3$ e $\log 0{,}01 = -2$.
- Il **logaritmo naturale** ha per base il numero $e \approx 2{,}718$, che hai incontrato nella lezione sulla [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale), e si scrive $\ln x$: $\ln e = 1$, $\ln 1 = 0$ e $\ln \dfrac{1}{e} = -1$.

Sono i due tasti `log` e `ln` della calcolatrice.

```ad-note
Altre scritture
Alcuni libri scrivono $\text{Log}\, x$ per il logaritmo decimale e $\log x$ per quello naturale, e nei testi universitari $\log x$ senza base è quasi sempre il logaritmo naturale. Prima di usare un libro o un formulario controlla quale convenzione segue. In queste lezioni $\log x$ è sempre in base $10$ e $\ln x$ in base $e$.
```

## Le proprietà dei logaritmi

Un logaritmo è un esponente, e le proprietà dei logaritmi sono le proprietà delle potenze lette dal lato degli esponenti. In tutta la sezione $a$ è positivo e diverso da $1$, e gli argomenti $b$ e $c$ sono positivi.

### Logaritmo di un prodotto

Il logaritmo di un prodotto è la somma dei logaritmi dei fattori:

$$\log_a (b \cdot c) = \log_a b + \log_a c$$

Dimostrazione. Poni $x = \log_a b$ e $y = \log_a c$. Per la definizione $a^x = b$ e $a^y = c$, quindi

$$b \cdot c = a^x \cdot a^y = a^{x + y}$$

L'esponente da dare ad $a$ per ottenere $b \cdot c$ è $x + y$, cioè $\log_a (b \cdot c) = x + y = \log_a b + \log_a c$.

Per esempio $\log_2 (8 \cdot 4) = \log_2 8 + \log_2 4 = 3 + 2 = 5$, e infatti $2^5 = 32$. Letta da destra a sinistra, la proprietà unisce due logaritmi con la stessa base: $\log_6 4 + \log_6 9 = \log_6 36 = 2$.

Sul grafico la proprietà diventa uno spostamento. Poiché $\log_2 (4x) = \log_2 4 + \log_2 x = 2 + \log_2 x$, moltiplicare l'argomento per $4$ alza ogni punto della curva $y = \log_2 x$ di $2$.

```tikz
% nome: logaritmo-prodotto-curva-alzata
% alt: I grafici di y = logaritmo in base 2 di x, tratteggiato, e di y = logaritmo in base 2 di 4x: il secondo è il primo alzato di 2, come mostrano due frecce verticali lunghe 2 nei punti di ascissa 1 e 4
% svg: logaritmo-prodotto-curva-alzata-947a809d.svg 206x230
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-0.5,-2.5) grid (6.5,5.5);
\draw[->] (-0.8,0) -- (7.1,0) node[right] {$x$};
\draw[->] (0,-2.8) -- (0,6.1) node[above] {$y$};
\foreach \x in {1,2,4,6} \node[below] at (\x,-0.05) {\small $\x$};
\foreach \y in {2,4} \node[left] at (0,\y) {\small $\y$};
\draw[thick, dashed, gray, domain=0.18:6.5, samples=100, smooth] plot (\x, {ln(\x)/ln(2)});
\draw[thick, blue!60, domain=0.045:6.5, samples=140, smooth] plot (\x, {ln(4*\x)/ln(2)});
\draw[->, orange!80, thick] (1,0.12) -- (1,1.85);
\draw[->, orange!80, thick] (4,2.12) -- (4,3.85);
\foreach \x/\y in {1/0, 1/2, 4/2, 4/4} \fill (\x,\y) circle (0.09);
\node[orange!60!black, right] at (1,1) {\small $+2$};
\node[orange!60!black, right] at (4,3) {\small $+2$};
\node[blue!60!black, above left] at (6.4,4.75) {$y = \log_2 (4x)$};
\node[gray, below right] at (4.6,2.1) {$y = \log_2 x$};
\end{tikzpicture}
```
```grafico
% nome: logaritmo-prodotto-cursore
% alt: Il grafico di y = logaritmo in base 2 di kx con il cursore di k e il grafico di y = logaritmo in base 2 di x tratteggiato: la curva è quella tratteggiata spostata in verticale del logaritmo in base 2 di k, scritto sotto il piano
curva: y=\log_2\left(kx\right)
curva: y=\log_2\left(x\right) | tratteggiata | grigio
cursore: k = 4 da 0,1 a 8 passo 0,1
finestra: x da -2 a 10, y da -6 a 6
valore: \log_2 k = \log_2\left(k\right)
domanda: Di quanto si alza la curva con $k = 8$? Per quale $k$ si abbassa di $1$? E per quale $k$ le due curve coincidono?
```

Con $k = 8$ la curva si alza di $\log_2 8 = 3$; si abbassa di $1$ con $k = \dfrac{1}{2}$, perché $\log_2 \dfrac{1}{2} = -1$; e coincide con quella di partenza per $k = 1$, perché $\log_2 1 = 0$.

### Logaritmo di un quoziente

Il logaritmo di un quoziente è la differenza tra il logaritmo del numeratore e quello del denominatore:

$$\log_a \frac{b}{c} = \log_a b - \log_a c$$

Dimostrazione. Con le stesse posizioni, $\dfrac{b}{c} = \dfrac{a^x}{a^y} = a^{x - y}$, quindi $\log_a \dfrac{b}{c} = x - y$.

Per esempio $\log_3 54 - \log_3 2 = \log_3 \dfrac{54}{2} = \log_3 27 = 3$. Con $b = 1$ ottieni il logaritmo di un reciproco: $\log_a \dfrac{1}{c} = \log_a 1 - \log_a c = -\log_a c$.

### Logaritmo di una potenza

Il logaritmo di una potenza è l'esponente moltiplicato per il logaritmo della base della potenza:

$$\log_a b^n = n \cdot \log_a b$$

Vale per ogni esponente $n$ reale. Dimostrazione. Poni $x = \log_a b$, cioè $a^x = b$. Allora

$$b^n = \left(a^x\right)^n = a^{n x}$$

e quindi $\log_a b^n = n x = n \cdot \log_a b$.

Per esempio $\log_2 8^5 = 5 \cdot \log_2 8 = 5 \cdot 3 = 15$. Una radice è una potenza con esponente frazionario, quindi la proprietà copre anche i radicali:

$$\log_a \sqrt[n]{b} = \log_a b^{\frac{1}{n}} = \frac{1}{n} \cdot \log_a b$$

Per esempio $\log_3 \sqrt{27} = \dfrac{1}{2} \cdot \log_3 27 = \dfrac{3}{2}$.

| Potenze | Logaritmi |
|---|---|
| $a^x \cdot a^y = a^{x + y}$ | $\log_a (b \cdot c) = \log_a b + \log_a c$ |
| $a^x : a^y = a^{x - y}$ | $\log_a \dfrac{b}{c} = \log_a b - \log_a c$ |
| $\left(a^x\right)^n = a^{n x}$ | $\log_a b^n = n \cdot \log_a b$ |

```ad-warning
Non esiste una regola per il logaritmo di una somma
$\log_a (b + c)$ non è $\log_a b + \log_a c$. Con i numeri: $\log_2 (4 + 4) = \log_2 8 = 3$, mentre $\log_2 4 + \log_2 4 = 2 + 2 = 4$. La somma di due logaritmi è il logaritmo del prodotto, non della somma. Lo stesso vale per la differenza: $\log_a (b - c)$ non si spezza.
```

```ad-warning
L'esponente del logaritmo e l'esponente dell'argomento
$\log_2 8^2$ e $\left(\log_2 8\right)^2$ sono due numeri diversi. Nel primo l'esponente sta sull'argomento e si porta davanti: $\log_2 8^2 = 2 \cdot 3 = 6$. Nel secondo è elevato al quadrato il logaritmo intero, e la proprietà non si applica: $\left(\log_2 8\right)^2 = 3^2 = 9$.
```

### Sviluppare e raccogliere

Le tre proprietà si usano nei due versi. Da sinistra a destra spezzano il logaritmo di un'espressione nella somma di logaritmi più semplici; da destra a sinistra riuniscono più logaritmi con la stessa base in uno solo, che è quello che serve nelle [equazioni logaritmiche](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-logaritmiche).

```ad-example
Esempio 4: sviluppare un logaritmo
Sviluppa $\log_2 \dfrac{8x^3}{\sqrt{y}}$, con $x > 0$ e $y > 0$.

Prima il quoziente, poi il prodotto, poi le potenze:

$$
\begin{aligned}
\log_2 \frac{8x^3}{\sqrt{y}} &= \log_2 \left(8x^3\right) - \log_2 \sqrt{y} \\
&= \log_2 8 + \log_2 x^3 - \log_2 y^{\frac{1}{2}} \\
&= 3 + 3\log_2 x - \frac{1}{2}\log_2 y
\end{aligned}
$$
```

```ad-example
Esempio 5: scrivere come un solo logaritmo
Scrivi come un solo logaritmo $2\log_3 x + \log_3 5 - \dfrac{1}{2}\log_3 y$, con $x > 0$ e $y > 0$.

Prima porta i coefficienti all'esponente, poi unisci:

$$
\begin{aligned}
2\log_3 x + \log_3 5 - \frac{1}{2}\log_3 y &= \log_3 x^2 + \log_3 5 - \log_3 \sqrt{y} \\
&= \log_3 \frac{5x^2}{\sqrt{y}}
\end{aligned}
$$

I termini con il segno più vanno al numeratore, quelli con il segno meno al denominatore.
```

```ad-example
Esempio 6: calcolare senza calcolatrice
Calcola $\log 25 + 2\log 2$ e $\log_2 48 - \log_2 3$.

Nessuno dei logaritmi è un numero intero, ma insieme lo diventano:

$$\log 25 + 2\log 2 = \log 25 + \log 4 = \log 100 = 2$$

$$\log_2 48 - \log_2 3 = \log_2 \frac{48}{3} = \log_2 16 = 4$$
```

```ad-example
Esempio 7: da due logaritmi noti agli altri
Sapendo che $\log 2 \approx 0{,}301$ e $\log 3 \approx 0{,}477$, calcola $\log 6$, $\log 5$ e $\log 72$.

Scrivi ogni argomento con i fattori $2$, $3$ e $10$:

$$\log 6 = \log 2 + \log 3 \approx 0{,}301 + 0{,}477 = 0{,}778$$

$$\log 5 = \log \frac{10}{2} = 1 - \log 2 \approx 0{,}699$$

$$
\begin{aligned}
\log 72 &= \log \left(2^3 \cdot 3^2\right) \\
&= 3\log 2 + 2\log 3 \\
&\approx 0{,}903 + 0{,}954 = 1{,}857
\end{aligned}
$$
```

```ad-warning
La potenza pari e il segno dell'argomento
L'uguaglianza $\log_a x^2 = 2\log_a x$ vale solo per $x > 0$. Per $x = -3$ il primo membro esiste, perché $(-3)^2 = 9$ è positivo, mentre il secondo no. Se $x$ può essere negativo, la scrittura giusta è $\log_a x^2 = 2\log_a |x|$. Nelle equazioni è una differenza che fa perdere soluzioni.
```

## Cambiamento di base

La calcolatrice ha solo i logaritmi in base $10$ e in base $e$. Per calcolare $\log_2 5$, o per mettere insieme logaritmi con basi diverse, serve la **formula del cambiamento di base**: per ogni nuova base $c$ positiva e diversa da $1$,

$$\log_a b = \frac{\log_c b}{\log_c a}$$

Dimostrazione. Poni $x = \log_a b$, cioè $a^x = b$. Due numeri positivi uguali hanno lo stesso logaritmo in base $c$:

$$\log_c a^x = \log_c b$$

Per la proprietà della potenza il primo membro è $x \cdot \log_c a$. Poiché $a \neq 1$, il numero $\log_c a$ è diverso da zero e si può dividere:

$$x = \frac{\log_c b}{\log_c a}$$

Con la calcolatrice si sceglie $c = 10$ oppure $c = e$, e il risultato è lo stesso:

$$\log_2 5 = \frac{\log 5}{\log 2} \approx \frac{0{,}699}{0{,}301} \approx 2{,}32 \qquad \log_2 5 = \frac{\ln 5}{\ln 2} \approx \frac{1{,}609}{0{,}693} \approx 2{,}32$$

È il numero della figura all'inizio della lezione, l'esponente per cui $2^x = 5$.

Dalla formula vengono due casi particolari che fanno risparmiare conti.

- Scambiare base e argomento dà il reciproco: scegliendo $c = b$ (con $b \neq 1$) si ottiene $\log_a b = \dfrac{1}{\log_b a}$. Per esempio $\log_8 2 = \dfrac{1}{\log_2 8} = \dfrac{1}{3}$.
- Se la base è una potenza, l'esponente va al denominatore: $\log_{a^n} b = \dfrac{\log_a b}{\log_a a^n} = \dfrac{1}{n} \cdot \log_a b$, con $n \neq 0$. Per esempio $\log_4 32 = \dfrac{1}{2} \cdot \log_2 32 = \dfrac{5}{2}$. Con $n = -1$: $\log_{\frac{1}{a}} b = -\log_a b$.

```ad-example
Esempio 8: un prodotto di logaritmi con basi diverse
Calcola $\log_3 5 \cdot \log_5 9$.

Porta il secondo logaritmo in base $3$:

$$\log_5 9 = \frac{\log_3 9}{\log_3 5} = \frac{2}{\log_3 5}$$

Nel prodotto $\log_3 5$ si semplifica:

$$\log_3 5 \cdot \frac{2}{\log_3 5} = 2$$
```

```ad-example
Esempio 9: una somma con basi diverse
Calcola $\log_9 27 + \log_{\frac{1}{3}} 9$.

Tutte le basi e gli argomenti sono potenze di $3$. Con la regola della base che è una potenza:

$$\log_9 27 = \frac{1}{2} \cdot \log_3 27 = \frac{3}{2} \qquad \log_{\frac{1}{3}} 9 = -\log_3 9 = -2$$

La somma è $\dfrac{3}{2} - 2 = -\dfrac{1}{2}$.
```

```ad-warning
Quoziente di logaritmi e logaritmo di un quoziente
$\dfrac{\log 5}{\log 2}$ è $\log_2 5 \approx 2{,}32$, per il cambiamento di base. Non è $\log \dfrac{5}{2}$, che vale $\log 5 - \log 2 \approx 0{,}398$, e non si semplifica in $\dfrac{5}{2}$ cancellando la scritta $\log$: il logaritmo non è un fattore.
```

Con le proprietà e il cambiamento di base hai gli strumenti di calcolo. Il passo successivo è guardare $\log_a x$ come una funzione di $x$, con il suo grafico, nella lezione sulla [funzione logaritmica](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-logaritmica).
