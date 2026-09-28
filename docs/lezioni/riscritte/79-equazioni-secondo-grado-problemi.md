# Problemi di secondo grado

Due numeri consecutivi con prodotto $156$, un rettangolo di area $96$ cm², un ciclista che andando più veloce arriva un'ora prima: in questi problemi l'incognita finisce moltiplicata per se stessa, e l'equazione che traduce il testo è di secondo grado. Il metodo è quello dei [problemi con le equazioni](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/problemi-con-le-equazioni) di primo grado, e l'equazione si risolve come nella lezione [Equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado). La parte nuova è la scelta delle soluzioni: l'equazione ne ha spesso due, e molte volte una delle due non va bene per il problema.

## Il procedimento

1. Leggi il testo fino in fondo e separa i dati dalla domanda.
2. Scegli l'incognita e scrivi che cosa rappresenta, con l'unità di misura.
3. Scrivi le limitazioni dell'incognita: intera, positiva, minore di una certa lunghezza.
4. Esprimi con $x$ le altre grandezze e traduci il testo in un'equazione.
5. Porta l'equazione in forma normale e risolvila.
6. Confronta ciascuna delle due soluzioni con le limitazioni, tieni quelle accettabili, verifica sul testo e rispondi con una frase.

Il passo 6 è quello che cambia rispetto al primo grado. Le due soluzioni $x_1$ e $x_2$ vanno controllate una per una: può darsi che vadano bene tutte e due, che ne vada bene una sola o che non ne vada bene nessuna.

```ad-warning
Rispondere con tutte e due le soluzioni
Se l'altezza di un rettangolo risolve $x^2 + 4x - 96 = 0$, le soluzioni dell'equazione sono $-12$ e $8$, ma l'altezza è soltanto $8$ cm. Scrivere "l'altezza è $8$ oppure $-12$" è sbagliato: $-12$ non rispetta la limitazione $x > 0$ e si scarta.
```

## Quali soluzioni si accettano

Una soluzione dell'equazione è **accettabile** quando rispetta le limitazioni dell'incognita, esattamente come al primo grado. Con due soluzioni i casi possibili sono quattro:

| L'equazione | Il problema |
|---|---|
| due soluzioni accettabili | due risposte, a volte uguali |
| una sola accettabile | una risposta |
| nessuna accettabile | impossibile |
| $\Delta < 0$ | impossibile |

Quando tutte e due le soluzioni sono accettabili, controlla se danno davvero due risposte diverse. Nei problemi di somma e prodotto (esempio 2) le due soluzioni sono i due numeri cercati, e danno la stessa coppia; in altri problemi, come quello del sasso qui sotto, danno due risposte diverse, ed entrambe vanno scritte.

Anche il tipo di numero conta. Una lunghezza può essere irrazionale, come $\sqrt{13} - 1$ cm, e la soluzione resta accettabile (esempio 4); un numero di persone o di oggetti invece deve essere un numero naturale, e una soluzione irrazionale o frazionaria lo rende impossibile.

```ad-example
Esempio: due soluzioni accettabili
Un sasso lanciato verso l'alto, dopo $t$ secondi, si trova a un'altezza di $20t - 5t^2$ metri. Dopo quanti secondi il sasso si trova a $15$ m di altezza?

L'incognita è il tempo $t$, in secondi, con $t > 0$.

$$
\begin{gathered}
20t - 5t^2 = 15 \\
\Rightarrow 5t^2 - 20t + 15 = 0 \\
\Rightarrow t^2 - 4t + 3 = 0
\end{gathered}
$$

$\dfrac{\Delta}{4} = 4 - 3 = 1$, quindi $t_{1,2} = 2 \pm 1$: $t_1 = 1$ e $t_2 = 3$. Sono positive tutte e due, e hanno tutte e due un significato: dopo $1$ secondo il sasso passa a $15$ m mentre sale, dopo $3$ secondi ci ripassa mentre scende. Controllo: $20 \cdot 1 - 5 \cdot 1 = 15$ e $20 \cdot 3 - 5 \cdot 9 = 15$. Il sasso è a $15$ m di altezza dopo $1$ secondo e dopo $3$ secondi.
```

```ad-example
Esempio: discriminante negativo
Un rettangolo ha perimetro $20$ cm e area $30$ cm². Quanto sono lunghi i lati?

Il semiperimetro è $10$ cm: se la base è $x$, l'altezza è $10 - x$, con $0 < x < 10$. L'area è base per altezza:

$$
\begin{gathered}
x(10 - x) = 30 \\
\Rightarrow x^2 - 10x + 30 = 0
\end{gathered}
$$

$\dfrac{\Delta}{4} = 25 - 30 = -5$. L'equazione non ha soluzioni reali, quindi il problema è impossibile: nessun rettangolo ha perimetro $20$ cm e area $30$ cm².
```

```ad-note
Perché nessun rettangolo ci arriva
Con perimetro $20$ cm l'area è $x(10 - x) = 25 - (x - 5)^2$, e siccome $(x - 5)^2 \geq 0$ l'area non supera mai $25$ cm². Il valore $25$ si raggiunge per $x = 5$, cioè con il quadrato di lato $5$ cm.
```

## Esempi svolti

### Problemi sui numeri

```ad-example
Esempio 1: numeri consecutivi
Il prodotto di due numeri naturali consecutivi è $156$. Quali sono i due numeri?

Chiama $x$ il più piccolo, con $x$ naturale: il successivo è $x + 1$.

$$
\begin{gathered}
x(x + 1) = 156 \\
\Rightarrow x^2 + x - 156 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 1 + 624 = 625 \\
x_{1,2} = \frac{-1 \pm 25}{2}
\end{gathered}
$$

Quindi $x_1 = -13$ e $x_2 = 12$. $-13$ non è un numero naturale e si scarta; $12$ è accettabile. Controllo: $12 \cdot 13 = 156$. I due numeri sono $12$ e $13$.

Se il testo dicesse "due numeri interi consecutivi", anche $x_1 = -13$ sarebbe accettabile, e il problema avrebbe due risposte: $12$ e $13$, oppure $-13$ e $-12$, perché anche $(-13) \cdot (-12) = 156$. Le limitazioni si leggono nel testo, parola per parola.
```

```ad-example
Esempio 2: somma e prodotto
Trova due numeri che hanno somma $17$ e prodotto $72$.

Se uno dei due numeri è $x$, l'altro è $17 - x$. Il testo non mette limitazioni: i numeri possono essere qualsiasi.

$$
\begin{gathered}
x(17 - x) = 72 \\
\Rightarrow 17x - x^2 = 72 \\
\Rightarrow x^2 - 17x + 72 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 289 - 288 = 1 \\
x_{1,2} = \frac{17 \pm 1}{2}
\end{gathered}
$$

$x_1 = 8$ e $x_2 = 9$. Se $x = 8$, l'altro numero è $17 - 8 = 9$; se $x = 9$, l'altro è $8$. Le due soluzioni danno la stessa coppia: i numeri cercati sono $8$ e $9$. Controllo: $8 + 9 = 17$ e $8 \cdot 9 = 72$.

Questo tipo di problema ha una scorciatoia, che usa la somma e il prodotto delle soluzioni: la trovi in [Relazioni tra soluzioni e coefficienti](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/relazioni-tra-soluzioni-e-coefficienti).
```

```ad-warning
Due soluzioni, due coppie
In un problema di somma e prodotto le soluzioni $8$ e $9$ non danno due coppie diverse, $(8, 9)$ e $(9, 8)$: danno i due numeri della stessa coppia. La risposta è una sola, "i numeri sono $8$ e $9$".
```

### Problemi di geometria

```ad-example
Esempio 3: l'area di un rettangolo
In un rettangolo la base supera l'altezza di $4$ cm, e l'area è $96$ cm². Calcola il perimetro.

Chiama $x$ l'altezza, in centimetri, con $x > 0$. La base è $x + 4$.

```tikz
% nome: rettangolo-area-altezza-x
% alt: Rettangolo con l'altezza indicata con x e la base indicata con x più 4
% svg: rettangolo-area-altezza-x-8c47ffac.svg 156x113
\begin{tikzpicture}
\draw[fill=blue!15] (0,0) rectangle (3.6,2.4);
\node[left] at (0,1.2) {$x$};
\node[below] at (1.8,0) {$x + 4$};
\node at (1.8,1.2) {$96$ cm$^2$};
\end{tikzpicture}
```

$$
\begin{gathered}
x(x + 4) = 96 \\
\Rightarrow x^2 + 4x - 96 = 0
\end{gathered}
$$

$b$ è pari, quindi conviene la formula ridotta: $\dfrac{\Delta}{4} = 4 + 96 = 100$ e

$$x_{1,2} = -2 \pm 10$$

$x_1 = -12$ si scarta, perché un'altezza non può essere negativa; $x_2 = 8$ è accettabile. L'altezza è $8$ cm e la base $12$ cm; controllo: $8 \cdot 12 = 96$. Il perimetro è $2 \cdot (12 + 8) = 40$ cm.
```

```ad-example
Esempio 4: base e altezza irrazionali
In un triangolo la base supera l'altezza di $2$ cm, e l'area è $6$ cm². Quanto sono lunghe la base e l'altezza?

Chiama $x$ l'altezza, in centimetri, con $x > 0$. La base è $x + 2$, e l'area di un triangolo è base per altezza diviso $2$.

```tikz
% nome: triangolo-area-altezza-x
% alt: Triangolo con la base indicata con x più 2 e l'altezza tratteggiata indicata con x
% svg: triangolo-area-altezza-x-66f249ff.svg 144x101
\begin{tikzpicture}
\draw[fill=blue!15] (0,0) -- (3.7,0) -- (1.2,2.1) -- cycle;
\draw[dashed] (1.2,2.1) -- (1.2,0);
\draw (1.2,0.2) -- (1.4,0.2) -- (1.4,0);
\node[left] at (1.2,0.9) {$x$};
\node[below] at (1.85,0) {$x + 2$};
\end{tikzpicture}
```

$$
\begin{gathered}
\frac{x(x + 2)}{2} = 6 \\
\Rightarrow x^2 + 2x - 12 = 0
\end{gathered}
$$

Con la formula ridotta, $\dfrac{\Delta}{4} = 1 + 12 = 13$, che non è un quadrato perfetto:

$$x_{1,2} = -1 \pm \sqrt{13}$$

$x_1 = -1 - \sqrt{13}$ è negativa e si scarta. $x_2 = \sqrt{13} - 1$ è positiva, perché $\sqrt{13}$ è maggiore di $\sqrt{9} = 3$: è accettabile, anche se è irrazionale. L'altezza è $\sqrt{13} - 1$ cm, circa $2{,}61$ cm, e la base è $\sqrt{13} + 1$ cm, circa $4{,}61$ cm. Controllo, con il prodotto di una somma per una differenza:

$$
\begin{aligned}
\frac{(\sqrt{13} + 1)(\sqrt{13} - 1)}{2} &= \frac{13 - 1}{2} \\
&= 6
\end{aligned}
$$
```

```ad-example
Esempio 5: una cornice
Una foto di $20$ cm per $30$ cm è circondata da una cornice di larghezza costante. L'area della cornice è uguale all'area della foto. Quanto è larga la cornice?

Chiama $x$ la larghezza della cornice, in centimetri, con $x > 0$. La cornice aggiunge $x$ da ogni lato, quindi il rettangolo esterno misura $20 + 2x$ per $30 + 2x$.

```tikz
% nome: cornice-larghezza-x
% alt: Foto rettangolare di 20 per 30 centimetri circondata da una cornice colorata di larghezza x su tutti i lati
% svg: cornice-larghezza-x-3ede0aa7.svg 155x136
\begin{tikzpicture}
\fill[blue!15, even odd rule] (0,0) rectangle (4,3) (0.5,0.5) rectangle (3.5,2.5);
\draw (0,0) rectangle (4,3);
\draw (0.5,0.5) rectangle (3.5,2.5);
\node[below] at (2,2.5) {$30$};
\node[right] at (0.5,1.5) {$20$};
\draw[<->] (3.5,1.5) -- (4,1.5);
\node[above, font=\small] at (3.75,1.5) {$x$};
\node[below] at (2,0) {$30 + 2x$};
\end{tikzpicture}
```

L'area della foto è $20 \cdot 30 = 600$ cm². Se la cornice ha la stessa area, il rettangolo esterno ha area $600 + 600 = 1200$ cm²:

$$
\begin{gathered}
(20 + 2x)(30 + 2x) = 1200 \\
\Rightarrow 4x^2 + 100x - 600 = 0 \\
\Rightarrow x^2 + 25x - 150 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 625 + 600 = 1225 \\
x_{1,2} = \frac{-25 \pm 35}{2}
\end{gathered}
$$

$x_1 = -30$ si scarta, $x_2 = 5$ è accettabile. Controllo: il rettangolo esterno misura $30$ cm per $40$ cm, con area $1200$ cm², e la cornice ha area $1200 - 600 = 600$ cm². La cornice è larga $5$ cm.
```

```ad-warning
La cornice su un lato solo
Una cornice di larghezza $x$ allunga ogni lato della foto di $2x$, non di $x$: c'è un pezzo di cornice a destra e uno a sinistra, uno sopra e uno sotto. Scrivere $(20 + x)(30 + x)$ vuol dire mettere la cornice solo su due lati.
```

```ad-example
Esempio 6: con il teorema di Pitagora
In un triangolo rettangolo un cateto supera l'altro di $7$ cm e l'ipotenusa è lunga $13$ cm. Calcola l'area del triangolo.

Chiama $x$ il cateto minore, in centimetri. L'altro cateto è $x + 7$, e un cateto è sempre più corto dell'ipotenusa: $x + 7 < 13$. Le limitazioni sono quindi $0 < x < 6$.

```tikz
% nome: triangolo-rettangolo-cateti-x
% alt: Triangolo rettangolo con i cateti indicati con x e x più 7 e l'ipotenusa lunga 13
% svg: triangolo-rettangolo-cateti-x-a639738f.svg 156x79
\begin{tikzpicture}
\draw[fill=blue!15] (0,0) -- (3.6,0) -- (0,1.5) -- cycle;
\draw (0,0.25) -- (0.25,0.25) -- (0.25,0);
\node[left] at (0,0.75) {$x$};
\node[below] at (1.8,0) {$x + 7$};
\node[above right] at (1.8,0.75) {$13$};
\end{tikzpicture}
```

Per il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide) la somma dei quadrati dei cateti è il quadrato dell'ipotenusa:

$$
\begin{gathered}
x^2 + (x + 7)^2 = 169 \\
\Rightarrow 2x^2 + 14x - 120 = 0 \\
\Rightarrow x^2 + 7x - 60 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 49 + 240 = 289 \\
x_{1,2} = \frac{-7 \pm 17}{2}
\end{gathered}
$$

$x_1 = -12$ si scarta; $x_2 = 5$ sta tra $0$ e $6$, quindi è accettabile. I cateti sono $5$ cm e $12$ cm; controllo: $25 + 144 = 169$. L'area è $\dfrac{5 \cdot 12}{2} = 30$ cm².
```

```ad-warning
Il quadrato del binomio
$(x + 7)^2$ è $x^2 + 14x + 49$, non $x^2 + 49$: manca il doppio prodotto. Con $x^2 + x^2 + 49 = 169$ si trova $x^2 = 60$, e il problema sembra avere un cateto irrazionale che non esiste. Il quadrato di un binomio si sviluppa come in [Prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli).
```

### Moto, lavoro e percentuali

Nei problemi di moto e di lavoro l'incognita finisce spesso al denominatore: l'equazione è fratta, e prima di togliere i denominatori si scrivono le condizioni di esistenza, come nelle [equazioni fratte](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-fratte). Tolti i denominatori resta un'equazione di secondo grado.

```ad-example
Esempio 7: un problema di moto
Un ciclista percorre $60$ km a velocità costante. Se andasse $5$ km/h più veloce, ci metterebbe un'ora di meno. A che velocità va?

Chiama $v$ la velocità, in km/h, con $v > 0$. Il tempo è lo spazio diviso la velocità: alla velocità $v$ il ciclista impiega $\dfrac{60}{v}$ ore, alla velocità $v + 5$ ne impiega $\dfrac{60}{v + 5}$. Il primo tempo supera il secondo di un'ora:

$$\frac{60}{v} - \frac{60}{v + 5} = 1$$

C.E.: $v \neq 0$ e $v \neq -5$, già escluse dalla limitazione $v > 0$. Moltiplica i due membri per $v(v + 5)$:

$$
\begin{gathered}
60(v + 5) - 60v = v(v + 5) \\
\Rightarrow 300 = v^2 + 5v \\
\Rightarrow v^2 + 5v - 300 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 25 + 1200 = 1225 \\
v_{1,2} = \frac{-5 \pm 35}{2}
\end{gathered}
$$

$v_1 = -20$ si scarta, $v_2 = 15$ è accettabile. Controllo: a $15$ km/h ci vogliono $\dfrac{60}{15} = 4$ ore, a $20$ km/h ne servono $\dfrac{60}{20} = 3$, un'ora di meno. Il ciclista va a $15$ km/h.
```

```ad-warning
L'ordine della sottrazione
Chi va più piano ci mette di più: il tempo alla velocità $v$ è quello più lungo, e da quello si toglie il tempo alla velocità $v + 5$. Scrivere $\dfrac{60}{v + 5} - \dfrac{60}{v} = 1$ porta a $v^2 + 5v + 300 = 0$, che ha $\Delta < 0$: il problema sembra impossibile, ma l'errore è nella traduzione.
```

```ad-example
Esempio 8: due rubinetti
Due rubinetti, aperti insieme, riempiono una vasca in $6$ ore. Da solo, il secondo ci mette $5$ ore più del primo. Quanto ci mette ciascuno da solo?

Chiama $x$ il tempo del primo rubinetto da solo, in ore, con $x > 0$; il secondo ci mette $x + 5$ ore. In un'ora il primo riempie $\dfrac{1}{x}$ della vasca, il secondo $\dfrac{1}{x + 5}$, e insieme $\dfrac{1}{6}$:

$$\frac{1}{x} + \frac{1}{x + 5} = \frac{1}{6}$$

C.E.: $x \neq 0$ e $x \neq -5$. Moltiplica per $6x(x + 5)$:

$$
\begin{gathered}
6(x + 5) + 6x = x(x + 5) \\
\Rightarrow 12x + 30 = x^2 + 5x \\
\Rightarrow x^2 - 7x - 30 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 49 + 120 = 169 \\
x_{1,2} = \frac{7 \pm 13}{2}
\end{gathered}
$$

$x_1 = -3$ si scarta, $x_2 = 10$ è accettabile. Controllo: $\dfrac{1}{10} + \dfrac{1}{15} = \dfrac{3}{30} + \dfrac{2}{30} = \dfrac{1}{6}$. Il primo rubinetto riempie la vasca in $10$ ore, il secondo in $15$ ore.
```

```ad-warning
Sommare i tempi
L'equazione non è $x + (x + 5) = 6$: i tempi non si sommano. Si sommano le parti di vasca riempite in un'ora, $\dfrac{1}{x}$ e $\dfrac{1}{x + 5}$, e il totale è la parte che i due rubinetti riempiono insieme in un'ora, $\dfrac{1}{6}$.
```

```ad-example
Esempio 9: due aumenti uguali
Il prezzo di una bici era $200$ €. È aumentato due volte della stessa percentuale, e ora è $242$ €. Di che percentuale è aumentato ogni volta?

Chiama $x$ la percentuale di aumento, con $x > 0$. Un aumento dell'$x\%$ moltiplica il prezzo per $1 + \dfrac{x}{100}$, e il secondo aumento si calcola sul prezzo già aumentato:

$$200\left(1 + \frac{x}{100}\right)^2 = 242$$

L'equazione ha la forma di una pura, e non serve la formula:

$$
\begin{gathered}
\left(1 + \frac{x}{100}\right)^2 = \frac{242}{200} = 1{,}21 \\
\Rightarrow 1 + \frac{x}{100} = \pm 1{,}1
\end{gathered}
$$

Con il più, $\dfrac{x}{100} = 0{,}1$ e $x = 10$; con il meno, $\dfrac{x}{100} = -2{,}1$ e $x = -210$. La seconda si scarta, perché $x$ è un aumento. Controllo: $200$ € aumentati del $10\%$ diventano $220$ €, e $220$ € aumentati del $10\%$ diventano $242$ €. Il prezzo è aumentato del $10\%$ ogni volta.
```

```ad-warning
Due aumenti del 10% non fanno il 20%
Il secondo aumento si calcola sul prezzo già aumentato. Da $200$ € a $242$ € l'aumento totale è del $21\%$, non del $20\%$: dividere $21\%$ per due e rispondere $10{,}5\%$ è sbagliato, come la verifica sul testo mostra subito.
```
