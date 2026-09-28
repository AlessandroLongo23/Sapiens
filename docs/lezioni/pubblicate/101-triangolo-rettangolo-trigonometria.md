# Seno, coseno e tangente nel triangolo rettangolo

Con il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide) si trova un lato di un triangolo rettangolo dagli altri due, ma gli angoli restano fuori. Seno, coseno e tangente sono i numeri che legano gli angoli ai lati: con loro basta un lato e un angolo acuto per trovare tutto il resto, e si calcola l'altezza di un albero senza salirci o l'inclinazione di una rampa dalla sua pendenza. I valori si leggono sulla calcolatrice.

## Cateto opposto e cateto adiacente

In tutta la lezione il triangolo è $ABC$, rettangolo in $C$, come nella lezione sui [teoremi di Pitagora e di Euclide](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide). L'ipotenusa è $AB$, i cateti sono $BC$ e $AC$, e le misure si indicano con la lettera minuscola del vertice opposto: $a = \overline{BC}$, $b = \overline{AC}$, $c = \overline{AB}$. Gli angoli acuti sono $\alpha$ in $A$ e $\beta$ in $B$, e sono complementari: $\alpha + \beta = 90^\circ$.

Rispetto all'angolo $\alpha$, il **cateto opposto** è quello che non tocca il vertice di $\alpha$, cioè $BC$; il **cateto adiacente** è quello che forma l'angolo $\alpha$ insieme all'ipotenusa, cioè $AC$.

```tikz
% nome: triangolo-rettangolo-cateto-opposto-adiacente
% alt: Triangolo ABC rettangolo in C con l'angolo alfa in A: l'ipotenusa AB è c, il cateto BC opposto ad alfa è a, il cateto AC adiacente ad alfa è b
% svg: triangolo-rettangolo-cateto-opposto-adiacente-f01b05a0.svg 209x125
\begin{tikzpicture}[scale=0.85]
\fill[blue!8] (0.00,0.00) -- (4.20,2.40) -- (4.20,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (4.20,2.40) -- (4.20,0.00) -- cycle;
\draw (4.02,0.00) -- (4.02,0.18) -- (4.20,0.18);
\draw[black] (0.55,0.00) arc[start angle=0.00, delta angle=29.74, radius=0.55];
\node[below left] at (0.00,0.00) {$A$};
\node[above] at (4.20,2.40) {$B$};
\node[below right] at (4.20,0.00) {$C$};
\node at (0.80,0.20) {\small $\alpha$};
\node[above left] at (2.10,1.20) {\small ipotenusa $c$};
\node[right] at (4.20,1.20) {\small \shortstack{cateto\\opposto\\ad $\alpha$: $a$}};
\node[below] at (2.10,-0.30) {\small cateto adiacente ad $\alpha$: $b$};
\end{tikzpicture}
```

Per l'angolo $\beta$ i ruoli si scambiano: il cateto opposto a $\beta$ è $AC$, quello adiacente è $BC$.

## I rapporti dipendono solo dall'angolo

Due triangoli rettangoli con lo stesso angolo acuto $\alpha$ hanno un angolo retto e un angolo acuto congruenti: per il primo criterio di [similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine) sono simili, e i lati omologhi sono in proporzione. Quindi il rapporto tra il cateto opposto ad $\alpha$ e l'ipotenusa è lo stesso in tutti e due, e così gli altri rapporti tra i lati.

```tikz
% nome: triangoli-rettangoli-stesso-angolo
% alt: Due triangoli rettangoli con lo stesso angolo alfa in A: il piccolo ha i cateti 3 e 4 e l'ipotenusa 5, il grande ha i cateti 6 e 8 e l'ipotenusa 10
% svg: triangoli-rettangoli-stesso-angolo-aa2d24e2.svg 183x146
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (3.60,2.70) -- (3.60,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (3.60,2.70) -- (3.60,0.00) -- cycle;
\fill[blue!20] (0.00,0.00) -- (1.80,1.35) -- (1.80,0.00) -- cycle;
\draw[thick] (1.80,1.35) -- (1.80,0.00);
\draw (1.65,0.00) -- (1.65,0.15) -- (1.80,0.15);
\draw (3.45,0.00) -- (3.45,0.15) -- (3.60,0.15);
\draw[black] (0.60,0.00) arc[start angle=0.00, delta angle=36.87, radius=0.60];
\node at (0.95,0.25) {\small $\alpha$};
\node[left] at (1.80,0.68) {\small $3$};
\node[right] at (3.60,1.35) {\small $6$};
\node[below] at (0.90,0.00) {\small $4$};
\node[below] at (2.70,0.00) {\small $4$};
\node at (0.75,0.88) {\small $5$};
\node at (2.55,2.23) {\small $5$};
\node[below left] at (0.00,0.00) {$A$};
\node[above left] at (1.80,1.35) {$B_1$};
\node[below] at (1.80,0.00) {$C_1$};
\node[above] at (3.60,2.70) {$B_2$};
\node[below right] at (3.60,0.00) {$C_2$};
\end{tikzpicture}
```

Nella figura il triangolo piccolo ha i cateti $3$ e $4$ e l'ipotenusa $5$, quello grande i cateti $6$ e $8$ e l'ipotenusa $10$. Il cateto opposto ad $\alpha$ diviso l'ipotenusa fa $\frac{3}{5}$ nel primo e $\frac{6}{10} = \frac{3}{5}$ nel secondo. Il rapporto non dipende da quanto è grande il triangolo, ma solo dall'angolo $\alpha$: per questo gli si può dare un nome.

## Seno, coseno e tangente

In un triangolo rettangolo, per un angolo acuto $\alpha$:

- il **seno** di $\alpha$ è il rapporto tra il cateto opposto e l'ipotenusa;
- il **coseno** di $\alpha$ è il rapporto tra il cateto adiacente e l'ipotenusa;
- la **tangente** di $\alpha$ è il rapporto tra il cateto opposto e il cateto adiacente.

$$
\begin{gathered}
\sin\alpha = \frac{a}{c} \qquad \cos\alpha = \frac{b}{c} \\
\tan\alpha = \frac{a}{b}
\end{gathered}
$$

Sono numeri puri, senza unità di misura, perché sono rapporti tra due lunghezze.

```ad-note
sen e tg
Molti libri italiani scrivono $\text{sen}\,\alpha$ per il seno e $\text{tg}\,\alpha$ per la tangente. Questa lezione usa $\sin$ e $\tan$, le scritte dei tasti della calcolatrice. Il significato è lo stesso.
```

```ad-example
Esempio 1: il triangolo 3, 4, 5
Nel triangolo $ABC$ rettangolo in $C$ i cateti misurano $a = 3$ e $b = 4$, l'ipotenusa $c = 5$. Trova seno, coseno e tangente di $\alpha$ e di $\beta$.

```tikz
% nome: seno-coseno-tangente-triangolo-3-4-5
% alt: Triangolo ABC rettangolo in C con BC di 3, AC di 4 e l'ipotenusa AB di 5; alfa è l'angolo in A, beta l'angolo in B
% svg: seno-coseno-tangente-triangolo-3-4-5-91094452.svg 133x107
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (2.40,1.80) -- (2.40,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (2.40,1.80) -- (2.40,0.00) -- cycle;
\draw (2.22,0.00) -- (2.22,0.18) -- (2.40,0.18);
\draw[black] (0.40,0.00) arc[start angle=0.00, delta angle=36.87, radius=0.40];
\draw[black] (2.12,1.59) arc[start angle=-143.13, delta angle=53.13, radius=0.35];
\draw[black] (2.06,1.55) arc[start angle=-143.13, delta angle=53.13, radius=0.42];
\node[below left] at (0.00,0.00) {$A$};
\node[above] at (2.40,1.80) {$B$};
\node[below right] at (2.40,0.00) {$C$};
\node at (0.70,0.18) {\small $\alpha$};
\node at (2.22,1.18) {\small $\beta$};
\node[right] at (2.40,0.90) {\small $3$};
\node[below] at (1.20,0.00) {\small $4$};
\node at (1.05,1.10) {\small $5$};
\end{tikzpicture}
```

Per $\alpha$ il cateto opposto è $a = 3$ e quello adiacente è $b = 4$:

$$
\begin{gathered}
\sin\alpha = \frac{3}{5} \qquad \cos\alpha = \frac{4}{5} \\
\tan\alpha = \frac{3}{4}
\end{gathered}
$$

Per $\beta$ i cateti si scambiano: il cateto opposto è $b = 4$ e quello adiacente è $a = 3$, quindi $\sin\beta = \frac{4}{5}$, $\cos\beta = \frac{3}{5}$ e $\tan\beta = \frac{4}{3}$.
```

L'esempio mostra una regola generale: il cateto opposto ad $\alpha$ è adiacente a $\beta$, quindi il seno di un angolo è il coseno del suo complementare, $\sin\beta = \cos\alpha$ e $\cos\beta = \sin\alpha$, con $\beta = 90^\circ - \alpha$. Le tangenti invece sono una l'inversa dell'altra: $\tan\beta = \dfrac{1}{\tan\alpha}$.

Un cateto è sempre più corto dell'ipotenusa, quindi per un angolo acuto il seno e il coseno sono numeri tra $0$ e $1$. La tangente invece può essere un numero positivo qualsiasi: è minore di $1$ quando il cateto opposto è il più corto dei due, maggiore di $1$ quando è il più lungo.

```ad-warning
Opposto e adiacente dipendono dall'angolo
"Cateto opposto" non è il nome fisso di un lato: nell'esempio 1 il cateto $BC$ è opposto ad $\alpha$ e adiacente a $\beta$. Prima di scrivere un rapporto, guarda di quale angolo stai parlando e da quale vertice parte.
```

## I valori per 30°, 45° e 60°

Per tre angoli seno, coseno e tangente si calcolano esatti, con i triangoli della lezione sui [teoremi di Pitagora e di Euclide](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide): metà quadrato e metà triangolo equilatero.

```tikz
% nome: triangoli-45-e-30-60-seno-coseno
% alt: A sinistra metà quadrato: triangolo rettangolo isoscele con i cateti l, l'ipotenusa l per radice di 2 e gli angoli acuti di 45 gradi; a destra metà triangolo equilatero: ipotenusa l, cateto opposto all'angolo di 30 gradi lungo l mezzi, cateto opposto all'angolo di 60 gradi lungo l per radice di 3 mezzi
% svg: triangoli-45-e-30-60-seno-coseno-a6e034e1.svg 222x105
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (2.00,0.00) -- (2.00,2.00) -- cycle;
\draw[thick] (0.00,0.00) -- (2.00,0.00) -- (2.00,2.00) -- cycle;
\fill[blue!8] (2.90,0.00) -- (5.32,0.00) -- (5.32,1.40) -- cycle;
\draw[thick] (2.90,0.00) -- (5.32,0.00) -- (5.32,1.40) -- cycle;
\draw (1.82,0.00) -- (1.82,0.18) -- (2.00,0.18);
\draw (5.14,0.00) -- (5.14,0.18) -- (5.32,0.18);
\draw[black] (0.45,0.00) arc[start angle=0.00, delta angle=45.00, radius=0.45];
\draw[black] (1.72,1.72) arc[start angle=-135.00, delta angle=45.00, radius=0.40];
\node at (0.72,0.28) {\scriptsize $45^\circ$};
\node at (1.75,1.25) {\scriptsize $45^\circ$};
\node[below] at (1.00,0.00) {\small $\ell$};
\node[right] at (2.00,1.00) {\small $\ell$};
\node at (0.75,1.25) {\small $\ell\sqrt{2}$};
\draw[black] (3.45,0.00) arc[start angle=0.00, delta angle=30.00, radius=0.55];
\draw[black] (5.07,1.25) arc[start angle=-150.00, delta angle=60.00, radius=0.30];
\draw[black] (5.00,1.21) arc[start angle=-150.00, delta angle=60.00, radius=0.37];
\node at (3.75,0.16) {\scriptsize $30^\circ$};
\node at (5.12,0.85) {\scriptsize $60^\circ$};
\node[below] at (4.11,0.00) {\small $\frac{\ell\sqrt{3}}{2}$};
\node[right] at (5.32,0.70) {\small $\frac{\ell}{2}$};
\node at (4.00,0.89) {\small $\ell$};
\end{tikzpicture}
```

Metà quadrato di lato $\ell$ ha i cateti $\ell$, l'ipotenusa $\ell\sqrt{2}$ e gli angoli acuti di $45^\circ$. Quindi

$$
\begin{aligned}
\sin 45^\circ &= \frac{\ell}{\ell\sqrt{2}} \\
&= \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}
\end{aligned}
$$

con il denominatore razionalizzato come nella lezione sulla [razionalizzazione](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/razionalizzazione). I due cateti sono uguali, quindi anche $\cos 45^\circ = \frac{\sqrt{2}}{2}$, e $\tan 45^\circ = \frac{\ell}{\ell} = 1$.

Metà triangolo equilatero di lato $\ell$ ha l'ipotenusa $\ell$, il cateto $\frac{\ell}{2}$ opposto all'angolo di $30^\circ$ e il cateto $\frac{\ell\sqrt{3}}{2}$ opposto all'angolo di $60^\circ$. Per l'angolo di $30^\circ$

$$
\begin{gathered}
\sin 30^\circ = \frac{\ell/2}{\ell} = \frac{1}{2} \\
\cos 30^\circ = \frac{\ell\sqrt{3}/2}{\ell} = \frac{\sqrt{3}}{2} \\
\tan 30^\circ = \frac{\ell/2}{\ell\sqrt{3}/2} = \frac{1}{\sqrt{3}} \\
= \frac{\sqrt{3}}{3}
\end{gathered}
$$

e per l'angolo di $60^\circ$ i cateti si scambiano: $\sin 60^\circ = \frac{\sqrt{3}}{2}$, $\cos 60^\circ = \frac{1}{2}$, $\tan 60^\circ = \sqrt{3}$.

| $\alpha$ | $\sin\alpha$ | $\cos\alpha$ | $\tan\alpha$ |
|---|---|---|---|
| $30^\circ$ | $\frac{1}{2}$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{3}}{3}$ |
| $45^\circ$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{2}}{2}$ | $1$ |
| $60^\circ$ | $\frac{\sqrt{3}}{2}$ | $\frac{1}{2}$ | $\sqrt{3}$ |

Non serve impararla a memoria: basta ridisegnare i due triangoli. Nella tabella si vede anche la regola dei complementari: il seno di $30^\circ$ è il coseno di $60^\circ$.

## Due relazioni tra seno, coseno e tangente

Per il teorema di Pitagora $a^2 + b^2 = c^2$. Dividendo per $c^2$:

$$\frac{a^2}{c^2} + \frac{b^2}{c^2} = 1$$

cioè, per ogni angolo acuto $\alpha$,

$$\sin^2\alpha + \cos^2\alpha = 1$$

dove $\sin^2\alpha$ vuol dire $(\sin\alpha)^2$. Controllo con l'esempio 1: $\left(\frac{3}{5}\right)^2 + \left(\frac{4}{5}\right)^2 = \frac{9}{25} + \frac{16}{25} = 1$.

La seconda relazione viene dividendo il seno per il coseno, perché l'ipotenusa si semplifica:

$$\tan\alpha = \frac{\sin\alpha}{\cos\alpha}$$

Infatti $\dfrac{a/c}{b/c} = \dfrac{a}{b}$. Con queste due relazioni, da uno dei tre numeri si trovano gli altri due.

```ad-example
Esempio 2: dal seno al coseno e alla tangente
Di un angolo acuto $\alpha$ si sa che $\sin\alpha = \frac{1}{3}$. Trova $\cos\alpha$ e $\tan\alpha$.

```tikz
% nome: seno-un-terzo-triangolo
% alt: Triangolo ABC rettangolo in C con il cateto BC di 1 opposto all'angolo alfa, l'ipotenusa AB di 3 e il cateto AC incognito
% svg: seno-un-terzo-triangolo-6c705083.svg 138x73
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (2.55,0.90) -- (2.55,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (2.55,0.90) -- (2.55,0.00) -- cycle;
\draw (2.37,0.00) -- (2.37,0.18) -- (2.55,0.18);
\draw[black] (0.70,0.00) arc[start angle=0.00, delta angle=19.47, radius=0.70];
\node[below left] at (0.00,0.00) {$A$};
\node[above] at (2.55,0.90) {$B$};
\node[below right] at (2.55,0.00) {$C$};
\node at (1.00,0.16) {\small $\alpha$};
\node[right] at (2.55,0.45) {\small $1$};
\node at (1.19,0.69) {\small $3$};
\node[below] at (1.27,0.00) {\small $b$};
\end{tikzpicture}
```

Un triangolo con il cateto opposto $1$ e l'ipotenusa $3$ ha proprio questo seno. Con la prima relazione, e il coseno positivo perché è un rapporto tra lunghezze:

$$
\begin{gathered}
\cos^2\alpha = 1 - \frac{1}{9} = \frac{8}{9} \\
\cos\alpha = \frac{\sqrt{8}}{3} = \frac{2\sqrt{2}}{3}
\end{gathered}
$$

Poi la tangente:

$$
\begin{aligned}
\tan\alpha &= \frac{1/3}{2\sqrt{2}/3} \\
&= \frac{1}{2\sqrt{2}} = \frac{\sqrt{2}}{4}
\end{aligned}
$$

Nel triangolo della figura il cateto $b$ misura $3 \cdot \cos\alpha = 2\sqrt{2}$, come dà anche Pitagora: $\sqrt{9 - 1} = \sqrt{8}$.
```

```ad-warning
Il quadrato del seno
$\sin^2\alpha$ è il quadrato del numero $\sin\alpha$, non il seno di $\alpha^2$. E $\sin\alpha + \cos\alpha$ non vale $1$: con $\alpha = 45^\circ$ fa $\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2} = \sqrt{2} \approx 1{,}41$. È la somma dei quadrati a valere $1$.
```

## La calcolatrice

Per gli altri angoli seno, coseno e tangente si leggono sulla calcolatrice scientifica, con i tasti $\sin$, $\cos$ e $\tan$. Prima controlla che sia impostata in gradi: sul display compare $D$ o $\text{DEG}$. Allora $\sin 35^\circ \approx 0{,}5736$, $\cos 35^\circ \approx 0{,}8192$, $\tan 35^\circ \approx 0{,}7002$.

Per fare il contrario, cioè trovare l'angolo di cui si conosce il seno, servono le funzioni inverse, che sulla calcolatrice si chiamano $\sin^{-1}$, $\cos^{-1}$ e $\tan^{-1}$ (di solito con il tasto SHIFT o 2nd seguito da $\sin$, $\cos$, $\tan$). Se $\sin\alpha = 0{,}4$, allora

$$\alpha = \sin^{-1}(0{,}4) \approx 23{,}58^\circ$$

In questa lezione le lunghezze e gli angoli approssimati sono arrotondati al centesimo.

```ad-note
Gradi, primi e secondi
Alcuni libri scrivono gli angoli in gradi, primi e secondi: un grado ha $60$ primi, un primo ha $60$ secondi. Così $23{,}578^\circ \approx 23^\circ\, 34'\, 41''$, perché $0{,}578 \cdot 60 \approx 34{,}69$ primi e $0{,}69 \cdot 60 \approx 41$ secondi. Molte calcolatrici fanno la conversione con un tasto apposito.
```

```ad-warning
La calcolatrice in radianti
Se la calcolatrice è impostata in radianti ($R$ o $\text{RAD}$ sul display), $\sin 30$ dà $-0{,}988$ e non $0{,}5$. I radianti sono un'altra unità di misura degli angoli, che si studia negli anni successivi. Un controllo veloce: $\sin 30$ deve dare $0{,}5$.
```

```ad-warning
L'inversa non è 1 diviso il seno
$\sin^{-1}(0{,}5)$ è l'angolo che ha seno $0{,}5$, cioè $30^\circ$. Non è $\dfrac{1}{\sin 0{,}5}$, e non è $\dfrac{1}{\sin 30^\circ} = 2$: l'esponente $-1$ qui indica la funzione inversa, non la potenza.
```

## Risolvere un triangolo rettangolo

Risolvere un triangolo rettangolo vuol dire trovare tutti i lati e tutti gli angoli conoscendone due elementi, di cui almeno un lato. Dalle definizioni di seno, coseno e tangente vengono tre regole:

- un cateto è uguale all'ipotenusa per il seno dell'angolo opposto: $a = c \cdot \sin\alpha$, $b = c \cdot \sin\beta$;
- un cateto è uguale all'ipotenusa per il coseno dell'angolo adiacente: $b = c \cdot \cos\alpha$, $a = c \cdot \cos\beta$;
- un cateto è uguale all'altro cateto per la tangente dell'angolo opposto al primo: $a = b \cdot \tan\alpha$, $b = a \cdot \tan\beta$.

Insieme ad $\alpha + \beta = 90^\circ$ e al teorema di Pitagora bastano per ogni caso. I casi sono quattro, secondo i dati: ipotenusa e un angolo, un cateto e un angolo, i due cateti, l'ipotenusa e un cateto.

```ad-example
Esempio 3: ipotenusa e angolo
Nel triangolo $ABC$ rettangolo in $C$ l'ipotenusa misura $c = 8$ cm e l'angolo $\alpha$ misura $60^\circ$. Risolvi il triangolo.

```tikz
% nome: risoluzione-ipotenusa-e-angolo
% alt: Triangolo ABC rettangolo in C con l'ipotenusa AB di 8 e l'angolo in A di 60 gradi; i cateti a e b sono incogniti
% svg: risoluzione-ipotenusa-e-angolo-39c4be7d.svg 92x126
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (1.32,2.29) -- (1.32,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (1.32,2.29) -- (1.32,0.00) -- cycle;
\draw (1.14,0.00) -- (1.14,0.18) -- (1.32,0.18);
\draw[black] (0.40,0.00) arc[start angle=0.00, delta angle=60.00, radius=0.40];
\node[below left] at (0.00,0.00) {$A$};
\node[above] at (1.32,2.29) {$B$};
\node[below right] at (1.32,0.00) {$C$};
\node at (0.68,0.36) {\scriptsize $60^\circ$};
\node at (0.44,1.27) {\small $8$};
\node[right] at (1.32,1.14) {\small $a$};
\node[below] at (0.66,0.00) {\small $b$};
\end{tikzpicture}
```

L'altro angolo acuto è $\beta = 90^\circ - 60^\circ = 30^\circ$. I cateti:

$$
\begin{gathered}
a = c \cdot \sin\alpha = 8 \cdot \frac{\sqrt{3}}{2} \\
a = 4\sqrt{3} \approx 6{,}93 \\
b = c \cdot \cos\alpha = 8 \cdot \frac{1}{2} = 4
\end{gathered}
$$

I cateti misurano $4\sqrt{3} \approx 6{,}93$ cm e $4$ cm. Controllo con Pitagora: $48 + 16 = 64 = 8^2$.
```

```ad-example
Esempio 4: un cateto e un angolo
Nel triangolo $ABC$ rettangolo in $C$ il cateto $b$ misura $12$ cm e l'angolo $\alpha$ misura $35^\circ$. Risolvi il triangolo.

```tikz
% nome: risoluzione-cateto-e-angolo
% alt: Triangolo ABC rettangolo in C con il cateto AC di 12 e l'angolo in A di 35 gradi; il cateto a e l'ipotenusa c sono incogniti
% svg: risoluzione-cateto-e-angolo-a1006be5.svg 178x135
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (3.60,2.52) -- (3.60,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (3.60,2.52) -- (3.60,0.00) -- cycle;
\draw (3.42,0.00) -- (3.42,0.18) -- (3.60,0.18);
\draw[black] (0.60,0.00) arc[start angle=0.00, delta angle=35.00, radius=0.60];
\node[below left] at (0.00,0.00) {$A$};
\node[above] at (3.60,2.52) {$B$};
\node[below right] at (3.60,0.00) {$C$};
\node[right] at (0.62,0.20) {\scriptsize $35^\circ$};
\node[below] at (1.80,0.00) {\small $12$};
\node[right] at (3.60,1.26) {\small $a$};
\node at (1.66,1.47) {\small $c$};
\end{tikzpicture}
```

$\beta = 90^\circ - 35^\circ = 55^\circ$. Il cateto $b$ è adiacente ad $\alpha$: il cateto opposto viene dalla tangente, l'ipotenusa dal coseno.

$$
\begin{gathered}
a = b \cdot \tan\alpha = 12 \cdot \tan 35^\circ \\
a \approx 8{,}40 \\
c = \frac{b}{\cos\alpha} = \frac{12}{\cos 35^\circ} \approx 14{,}65
\end{gathered}
$$

Il cateto $a$ misura circa $8{,}40$ cm e l'ipotenusa circa $14{,}65$ cm. L'ipotenusa si trova da $b = c \cdot \cos\alpha$, dividendo per $\cos\alpha$.
```

```ad-example
Esempio 5: i due cateti
Nel triangolo $ABC$ rettangolo in $C$ i cateti misurano $a = 5$ cm e $b = 12$ cm. Risolvi il triangolo.

```tikz
% nome: risoluzione-due-cateti
% alt: Triangolo ABC rettangolo in C con i cateti AC di 12 e BC di 5; l'ipotenusa c e gli angoli alfa e beta sono incogniti
% svg: risoluzione-due-cateti-7be4411f.svg 178x96
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (3.60,1.50) -- (3.60,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (3.60,1.50) -- (3.60,0.00) -- cycle;
\draw (3.42,0.00) -- (3.42,0.18) -- (3.60,0.18);
\draw[black] (0.60,0.00) arc[start angle=0.00, delta angle=22.62, radius=0.60];
\draw[black] (3.28,1.37) arc[start angle=-157.38, delta angle=67.38, radius=0.35];
\draw[black] (3.21,1.34) arc[start angle=-157.38, delta angle=67.38, radius=0.42];
\node[below left] at (0.00,0.00) {$A$};
\node[above] at (3.60,1.50) {$B$};
\node[below right] at (3.60,0.00) {$C$};
\node at (0.85,0.16) {\small $\alpha$};
\node[below] at (1.80,0.00) {\small $12$};
\node[right] at (3.60,0.75) {\small $5$};
\node at (1.70,0.98) {\small $c$};
\end{tikzpicture}
```

L'ipotenusa viene da Pitagora: $c = \sqrt{25 + 144} = \sqrt{169} = 13$ cm. L'angolo $\alpha$ viene dalla tangente, che usa i due cateti:

$$
\begin{gathered}
\tan\alpha = \frac{5}{12} \\
\alpha = \tan^{-1}\left(\frac{5}{12}\right) \approx 22{,}62^\circ
\end{gathered}
$$

e $\beta = 90^\circ - \alpha \approx 67{,}38^\circ$.
```

```ad-example
Esempio 6: l'ipotenusa e un cateto
Nel triangolo $ABC$ rettangolo in $C$ l'ipotenusa misura $c = 7$ cm e il cateto $a = 3$ cm. Risolvi il triangolo.

```tikz
% nome: risoluzione-ipotenusa-e-cateto
% alt: Triangolo ABC rettangolo in C con l'ipotenusa AB di 7 e il cateto BC di 3; il cateto b e gli angoli sono incogniti
% svg: risoluzione-ipotenusa-e-cateto-5c945622.svg 150x90
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (2.85,1.35) -- (2.85,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (2.85,1.35) -- (2.85,0.00) -- cycle;
\draw (2.67,0.00) -- (2.67,0.18) -- (2.85,0.18);
\draw[black] (0.70,0.00) arc[start angle=0.00, delta angle=25.38, radius=0.70];
\draw[black] (2.53,1.20) arc[start angle=-154.62, delta angle=64.62, radius=0.35];
\draw[black] (2.47,1.17) arc[start angle=-154.62, delta angle=64.62, radius=0.42];
\node[below left] at (0.00,0.00) {$A$};
\node[above] at (2.85,1.35) {$B$};
\node[below right] at (2.85,0.00) {$C$};
\node at (1.00,0.18) {\small $\alpha$};
\node at (1.32,0.90) {\small $7$};
\node[right] at (2.85,0.68) {\small $3$};
\node[below] at (1.42,0.00) {\small $b$};
\end{tikzpicture}
```

Il cateto $a$ è opposto ad $\alpha$, quindi si usa il seno:

$$
\begin{gathered}
\sin\alpha = \frac{3}{7} \\
\alpha = \sin^{-1}\left(\frac{3}{7}\right) \approx 25{,}38^\circ
\end{gathered}
$$

Poi $\beta = 90^\circ - \alpha \approx 64{,}62^\circ$, e il cateto $b = \sqrt{49 - 9} = \sqrt{40} = 2\sqrt{10} \approx 6{,}32$ cm.
```

```ad-warning
Con due angoli non si risolve
Sapere $\alpha = 30^\circ$ e $\beta = 60^\circ$ non basta: tutti i triangoli rettangoli con questi angoli sono simili tra loro, ma possono essere grandi o piccoli. Tra i due dati ci deve essere almeno un lato.
```

## Problemi

L'**angolo di elevazione** è l'angolo che la linea dello sguardo, rivolta verso un punto più in alto, forma con l'orizzontale. Misurarlo con un goniometro o con un'app del telefono, insieme a una distanza, basta per trovare un'altezza.

```ad-example
Esempio 7: l'altezza di un albero
Da $15$ m di distanza dal piede di un albero vedi la cima con un angolo di elevazione di $32^\circ$. I tuoi occhi sono a $1{,}6$ m da terra. Quanto è alto l'albero?

```tikz
% nome: angolo-di-elevazione-albero
% alt: Una persona con gli occhi a 1,6 metri da terra guarda la cima di un albero distante 15 metri; la linea dello sguardo forma un angolo di 32 gradi con l'orizzontale tratteggiata, e x è l'altezza dell'albero sopra gli occhi
% svg: angolo-di-elevazione-albero-6a51eecd.svg 219x130
\begin{tikzpicture}
\draw[thin] (-0.30,0.00) -- (5.10,0.00);
\draw[line width=1.2pt] (0.00,0.00) -- (0.00,0.48);
\draw[line width=2pt, green!40!black] (4.50,0.00) -- (4.50,3.29);
\draw[densely dashed] (0.00,0.48) -- (4.50,0.48);
\draw[thick, blue!70!black] (0.00,0.48) -- (4.50,3.29);
\draw (4.35,0.48) -- (4.35,0.63) -- (4.50,0.63);
\draw[black] (0.80,0.48) arc[start angle=0.00, delta angle=32.00, radius=0.80];
\node at (1.12,0.74) {\scriptsize $32^\circ$};
\node[left] at (0.00,0.24) {\scriptsize $1{,}6$};
\node[below] at (2.25,0.48) {\small $15$};
\node[right] at (4.50,1.89) {\small $x$};
\fill (0.00,0.48) circle (0.05);
\node[above left] at (0.00,0.48) {$O$};
\end{tikzpicture}
```

Il triangolo rettangolo ha il cateto orizzontale di $15$ m, adiacente all'angolo di $32^\circ$, e il cateto verticale $x$, opposto. Quindi

$$x = 15 \cdot \tan 32^\circ \approx 9{,}37$$

Il cateto $x$ parte dall'altezza degli occhi: l'albero è alto circa $9{,}37 + 1{,}6 = 10{,}97$ m.
```

La **pendenza** di una strada o di una rampa è il rapporto tra il dislivello e lo spostamento orizzontale, cioè la tangente dell'angolo che la rampa forma con l'orizzontale. Una pendenza dell'$8\%$ vuol dire che per ogni $100$ m in orizzontale si sale di $8$ m: $\tan\alpha = 0{,}08$.

```ad-example
Esempio 8: una rampa
Una rampa deve superare un dislivello di $0{,}5$ m con una pendenza dell'$8\%$. Quanto è lunga in orizzontale, che angolo forma con il terreno e quanto è lunga la rampa?

```tikz
% nome: rampa-pendenza-otto-per-cento
% alt: Una rampa vista di lato: un triangolo rettangolo molto basso con il dislivello di 0,5 metri, la lunghezza orizzontale incognita e l'angolo alfa con il terreno
% svg: rampa-pendenza-otto-per-cento-5c1b39ce.svg 206x40
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (4.69,0.38) -- (4.69,0.00) -- cycle;
\draw[thick] (0.00,0.00) -- (4.69,0.38) -- (4.69,0.00) -- cycle;
\draw (4.57,0.00) -- (4.57,0.12) -- (4.69,0.12);
\draw[black] (1.60,0.00) arc[start angle=0.00, delta angle=4.57, radius=1.60];
\node[right] at (1.62,0.07) {\scriptsize $\alpha$};
\node[right] at (4.69,0.19) {\small $0{,}5$};
\node[below] at (2.34,0.00) {\scriptsize orizzontale};
\node[above] at (2.34,0.19) {\scriptsize rampa};
\end{tikzpicture}
```

La pendenza è $\tan\alpha = 0{,}08$, e il dislivello è il cateto opposto ad $\alpha$. Lo spostamento orizzontale è il cateto adiacente:

$$
\begin{gathered}
\text{orizzontale} = \frac{0{,}5}{0{,}08} = 6{,}25 \\
\alpha = \tan^{-1}(0{,}08) \approx 4{,}57^\circ
\end{gathered}
$$

La rampa è l'ipotenusa: $\sqrt{6{,}25^2 + 0{,}5^2} = \sqrt{39{,}3125} \approx 6{,}27$ m. Una pendenza dell'$8\%$ è un angolo piccolo, meno di $5^\circ$.
```

```ad-warning
La pendenza non è l'angolo
Una pendenza dell'$8\%$ non è un angolo di $8^\circ$, e una pendenza del $100\%$ non è una parete verticale: vuol dire $\tan\alpha = 1$, cioè $\alpha = 45^\circ$.
```

```ad-example
Esempio 9: una scala appoggiata al muro
Una scala lunga $5$ m è appoggiata a un muro verticale e forma con il pavimento un angolo di $70^\circ$. A che altezza arriva sul muro, e a che distanza dal muro sta il piede?

```tikz
% nome: scala-appoggiata-al-muro
% alt: Una scala lunga 5 metri appoggiata a un muro verticale forma un angolo di 70 gradi con il pavimento; h è l'altezza a cui arriva sul muro, d la distanza del piede dal muro
% svg: scala-appoggiata-al-muro-85943e41.svg 67x122
\begin{tikzpicture}
\draw[thin] (-0.40,0.00) -- (1.16,0.00);
\draw[line width=1.5pt, black!60] (0.86,0.00) -- (0.86,2.65);
\draw[line width=1.5pt, brown!70!black] (0.00,0.00) -- (0.86,2.35);
\draw (0.71,0.00) -- (0.71,0.15) -- (0.86,0.15);
\draw[black] (0.35,0.00) arc[start angle=0.00, delta angle=70.00, radius=0.35];
\node at (0.50,0.22) {\scriptsize $70^\circ$};
\node at (0.19,1.26) {\small $5$};
\node[right] at (0.86,1.17) {\small $h$};
\node[below] at (0.43,0.00) {\small $d$};
\end{tikzpicture}
```

La scala è l'ipotenusa. L'altezza $h$ è il cateto opposto all'angolo di $70^\circ$, la distanza $d$ quello adiacente:

$$
\begin{gathered}
h = 5 \cdot \sin 70^\circ \approx 4{,}70 \\
d = 5 \cdot \cos 70^\circ \approx 1{,}71
\end{gathered}
$$

La scala arriva a circa $4{,}70$ m di altezza, con il piede a circa $1{,}71$ m dal muro.
```
