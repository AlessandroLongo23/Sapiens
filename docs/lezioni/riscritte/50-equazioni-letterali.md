# Equazioni letterali

Nell'equazione $2x + a = 5$ c'è una lettera in più oltre all'incognita: la $a$ sta per un numero che non conosci ancora. Si risolve lo stesso, con i passaggi delle [equazioni di primo grado intere](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere), e la soluzione $x = \dfrac{5 - a}{2}$ contiene la $a$: vale per tutti i valori di $a$ insieme. Le formule della fisica e della geometria sono equazioni di questo tipo, e saperle risolvere vuol dire saper ricavare da $v = \dfrac{s}{t}$ il tempo o lo spazio senza impararli a memoria.

## Incognita e parametri

Un'**equazione letterale** è un'equazione che contiene, oltre all'incognita, altre lettere. Queste lettere si chiamano **parametri**: ognuna rappresenta un numero fissato, che però non è dato, e nei conti si tratta come un numero.

Il testo dell'esercizio dice qual è l'incognita; se non lo dice, di solito è $x$ e i parametri sono $a$, $b$, $k$, $m$. La stessa uguaglianza cambia significato se cambia l'incognita: in $ax = 6$ con incognita $x$ la soluzione è $x = \dfrac{6}{a}$, mentre con incognita $a$ è $a = \dfrac{6}{x}$.

In questa lezione le equazioni sono **intere**: l'incognita non compare in nessun denominatore. Quelle con l'incognita al denominatore hanno un cenno alla fine.

## Risolvere un'equazione letterale

Si procede come con le equazioni numeriche: si tolgono le parentesi, si portano i termini con l'incognita a primo membro e gli altri a secondo membro, si riducono i termini simili. I termini che contengono solo il parametro, come $3a$ o $a^2$, sono termini noti e vanno a secondo membro insieme ai numeri.

```ad-example
Esempio 1: il coefficiente è un numero
Risolvi $3x - a = x + 5a$, con incognita $x$.

Porta $x$ a primo membro e $-a$ a secondo membro, cambiando segno a entrambi:

$$
\begin{gathered}
3x - x = 5a + a \\
\Rightarrow 2x = 6a
\end{gathered}
$$

Il coefficiente di $x$ è $2$, che non è zero: dividi per $2$.

$$x = \frac{6a}{2} = 3a$$

La soluzione è $S = \{3a\}$, qualunque sia $a$. Per $a = 1$, per esempio, l'equazione è $3x - 1 = x + 5$, e la sua soluzione è $3$.
```

Nell'esempio 1 il coefficiente dell'incognita è un numero. Spesso invece contiene il parametro: allora, per arrivare alla forma normale, si raccoglie l'incognita. In $ax - 2x = 5$ i due termini con $x$ non sono simili, ma hanno la $x$ in comune, e il [raccoglimento totale](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale) dà $(a - 2)x = 5$.

## La discussione

Quando il coefficiente dell'incognita contiene il parametro, si arriva alla forma normale

$$ax = b$$

dove $a$ e $b$ ora sono espressioni con il parametro. Per ricavare $x$ bisogna dividere per $a$, e il secondo principio di equivalenza lo permette solo se $a$ non è zero. Il coefficiente però cambia con il parametro, e per qualche valore del parametro può diventare zero. **Discutere** l'equazione vuol dire dire cosa succede per ogni valore del parametro:

| Forma normale | L'equazione è | Soluzioni |
|---|---|---|
| $ax = b$ con $a \neq 0$ | determinata | $S = \left\{\dfrac{b}{a}\right\}$ |
| $a = 0$ e $b \neq 0$ | impossibile | $S = \emptyset$ |
| $a = 0$ e $b = 0$ | indeterminata | $S = \mathbb{R}$ |

Sono gli stessi tre casi delle [equazioni numeriche](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere): la differenza è che adesso quale dei tre si verifica dipende dal parametro.

Il procedimento:

1. Porta l'equazione alla forma normale $ax = b$, raccogliendo l'incognita se serve.
2. Scomponi in fattori il coefficiente $a$ e, se si può, anche $b$.
3. Trova i valori del parametro che annullano $a$: sono quelli per cui un fattore di $a$ vale zero.
4. Per i valori che non annullano $a$, dividi per $a$ e [semplifica](/materiale/scuola-superiore/matematica/frazioni-algebriche/semplificazione-delle-frazioni-algebriche): l'equazione è determinata.
5. Per ogni valore che annulla $a$, sostituiscilo nella forma normale: ottieni $0x = b$, e guardi se $b$ vale zero (indeterminata) o no (impossibile).
6. Scrivi la risposta caso per caso.

```ad-example
Esempio 2: un caso impossibile
Risolvi e discuti $a(x - 1) = 3 - a$.

Togli la parentesi e porta i termini noti a secondo membro:

$$
\begin{gathered}
ax - a = 3 - a \\
\Rightarrow ax = 3 - a + a \\
\Rightarrow ax = 3
\end{gathered}
$$

Il coefficiente $a$ si annulla per $a = 0$.

Se $a \neq 0$, dividi per $a$: $x = \dfrac{3}{a}$.

Se $a = 0$, la forma normale diventa $0x = 3$, che nessun numero soddisfa.

La risposta: se $a \neq 0$, $S = \left\{\dfrac{3}{a}\right\}$; se $a = 0$, l'equazione è impossibile, $S = \emptyset$.
```

```ad-warning
Dividere per il parametro senza pensarci
Da $ax = 3$ non si scrive $x = \dfrac{3}{a}$ senza aggiungere altro. Per $a = 0$ quella divisione non si può fare, e l'equazione ha un comportamento diverso (qui è impossibile). Ogni volta che dividi per un'espressione con il parametro, devi dire per quali valori la divisione è permessa e trattare a parte gli altri.
```

La discussione dell'esempio 2 si vede nel piano cartesiano. I due membri di $ax = 3$ sono due funzioni di $x$: $y = ax$, una [retta per l'origine](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa), e $y = 3$, una retta orizzontale. La soluzione è l'ascissa del punto $P$ in cui si incontrano.

```grafico
% nome: equazione-letterale-due-rette
% alt: La retta y = ax, che ruota intorno all'origine con il cursore di a, la retta orizzontale y = 3 e il punto P in cui si incontrano: sotto il piano è scritta l'ascissa di P, 3/a, la soluzione dell'equazione ax = 3; quando a si avvicina a 0 il punto P si allontana, e con a uguale a 0 le due rette sono parallele e P non esiste
curva: y=ax
curva: y=3 | grigio
curva: P=\left(\frac{3}{a};3\right) | nero
cursore: a = 1 da -3 a 3 passo 0,25
finestra: x da -8 a 8, y da -4 a 6
valore: x = \frac{3}{a}
domanda: Porta $a$ verso $0$: dove va il punto $P$? E con $a = 0$ le due rette si incontrano?
```

```ad-example
Esempio 3: un caso indeterminato
Risolvi e discuti $a(x - 2) = 2(x - a) + a^2 - 4$.

Togli le parentesi:

$$
\begin{aligned}
&ax - 2a \\
&= 2x - 2a + a^2 - 4
\end{aligned}
$$

Il termine $-2a$ compare in entrambi i membri e si cancella. Porta $2x$ a primo membro e raccogli la $x$:

$$
\begin{gathered}
ax - 2x = a^2 - 4 \\
\Rightarrow (a - 2)x = a^2 - 4
\end{gathered}
$$

Scomponi il secondo membro con la [differenza di quadrati](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli):

$$(a - 2)x = (a - 2)(a + 2)$$

Il coefficiente $a - 2$ si annulla per $a = 2$.

Se $a \neq 2$, dividi per $a - 2$ e semplifica:

$$x = \frac{(a - 2)(a + 2)}{a - 2} = a + 2$$

Se $a = 2$, sostituisci nella forma normale: $(2 - 2)x = 2^2 - 4$, cioè $0x = 0$, vera per ogni $x$.

La risposta: se $a \neq 2$, $S = \{a + 2\}$; se $a = 2$, l'equazione è indeterminata, $S = \mathbb{R}$.
```

```ad-tip
Controllare con un numero
Scegli un valore del parametro che non sia un caso particolare e rifai l'esercizio con quel numero. Nell'esempio 3, con $a = 3$ l'equazione diventa $3(x - 2) = 2(x - 3) + 5$, cioè $3x - 6 = 2x - 1$, che ha soluzione $x = 5$; la formula trovata dà $a + 2 = 5$.
```

```ad-example
Esempio 4: tre casi
Risolvi e discuti $a^2x + 1 = x + a + 2$.

Porta $x$ a primo membro e $1$ a secondo membro, poi raccogli la $x$:

$$
\begin{gathered}
a^2x - x = a + 2 - 1 \\
\Rightarrow (a^2 - 1)x = a + 1
\end{gathered}
$$

Scomponi il coefficiente:

$$(a - 1)(a + 1)x = a + 1$$

Il coefficiente si annulla quando uno dei due fattori vale zero: per $a = 1$ e per $a = -1$.

Se $a \neq 1$ e $a \neq -1$, dividi per $(a - 1)(a + 1)$ e semplifica il fattore $a + 1$:

$$x = \frac{a + 1}{(a - 1)(a + 1)} = \frac{1}{a - 1}$$

Se $a = 1$: $(1 - 1)(1 + 1)x = 1 + 1$, cioè $0x = 2$, impossibile.

Se $a = -1$: $(-1 - 1)(-1 + 1)x = -1 + 1$, cioè $0x = 0$, indeterminata.

La risposta: se $a \neq \pm 1$, $S = \left\{\dfrac{1}{a - 1}\right\}$; se $a = 1$, $S = \emptyset$; se $a = -1$, $S = \mathbb{R}$.
```

```ad-warning
Sostituire nella soluzione invece che nella forma normale
Per capire cosa succede con $a = -1$ non si sostituisce in $x = \dfrac{1}{a - 1}$: quella formula vale solo per $a \neq \pm 1$, perché è stata ottenuta dividendo per $(a - 1)(a + 1)$. Con $a = -1$ darebbe $x = -\dfrac{1}{2}$, mentre l'equazione è indeterminata. I valori che annullano il coefficiente si sostituiscono sempre nella forma normale $ax = b$.
```

```ad-example
Esempio 5: denominatori numerici e coefficiente con il meno
Risolvi e discuti $\dfrac{x}{2} - \dfrac{a}{3} = \dfrac{ax}{6}$.

Il MCM dei denominatori è $6$. Moltiplica per $6$ tutti i termini:

$$3x - 2a = ax$$

Porta $ax$ a primo membro e $-2a$ a secondo membro, poi raccogli la $x$:

$$
\begin{gathered}
3x - ax = 2a \\
\Rightarrow (3 - a)x = 2a
\end{gathered}
$$

Il coefficiente $3 - a$ si annulla per $a = 3$.

Se $a \neq 3$: $x = \dfrac{2a}{3 - a}$. Anche $a = 0$ rientra qui: il coefficiente vale $3$, e la soluzione è $x = 0$.

Se $a = 3$: $(3 - 3)x = 2 \cdot 3$, cioè $0x = 6$, impossibile.

La risposta: se $a \neq 3$, $S = \left\{\dfrac{2a}{3 - a}\right\}$; se $a = 3$, $S = \emptyset$.
```

```ad-warning
Cercare i casi particolari nel termine noto
I casi da discutere vengono dal coefficiente dell'incognita, non dal termine noto. Nell'esempio 5 il termine noto $2a$ vale zero per $a = 0$, ma il coefficiente no: l'equazione è determinata e ha soluzione $x = 0$, che è una soluzione come le altre.
```

```ad-note
Il parametro al denominatore
Se il parametro compare in un denominatore, come in $\dfrac{x}{a} = 3$, l'equazione ha senso solo quando quel denominatore non vale zero: qui $a \neq 0$. Questa condizione sul parametro si scrive prima di cominciare e vale per tutta la risoluzione. Con $a \neq 0$ si moltiplica per $a$ e si ottiene $x = 3a$.
```

Le equazioni con un parametro tornano con il secondo grado, nelle [equazioni parametriche](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-parametriche), dove si cerca il valore del parametro per cui le soluzioni hanno una proprietà data.

## Formule inverse

Una formula della fisica o della geometria è un'equazione letterale con molte lettere. Ricavare una lettera, cioè scrivere la **formula inversa**, vuol dire risolvere l'equazione prendendo come incognita quella lettera e trattando le altre come parametri. I passaggi sono gli stessi di sempre: trasporto, moltiplicazione e divisione di entrambi i membri per la stessa espressione.

Nelle formule le lettere sono di solito misure di lunghezze, tempi, aree, cioè numeri positivi: per questo si divide per una lettera senza discutere il caso in cui vale zero. Il caso zero va considerato solo se la lettera per cui dividi può davvero valere zero.

```ad-example
Esempio 6: velocità, spazio e tempo
La velocità media è $v = \dfrac{s}{t}$, dove $s$ è lo spazio percorso e $t$ il tempo impiegato. Ricava $s$ e $t$.

Per ricavare $s$ moltiplica entrambi i membri per $t$:

$$
\begin{gathered}
v \cdot t = \frac{s}{t} \cdot t \\
\Rightarrow s = vt
\end{gathered}
$$

Per ricavare $t$ parti da $s = vt$ e dividi entrambi i membri per $v$:

$$t = \frac{s}{v}$$

Con $s = 150$ km e $v = 60$ km/h, per esempio, $t = \dfrac{150}{60} = 2{,}5$ ore.
```

```ad-example
Esempio 7: l'area del trapezio
L'area del trapezio è $A = \dfrac{(B + b)h}{2}$, dove $B$ e $b$ sono le basi e $h$ l'altezza. Ricava $h$ e poi $B$.

```tikz
% nome: trapezio-basi-altezza
% alt: Un trapezio con la base maggiore B in basso, la base minore b in alto e l'altezza h tratteggiata tra le due basi
% svg: trapezio-basi-altezza-608d66b7.svg 155x100
\begin{tikzpicture}
\fill[blue!15] (0,0) -- (4,0) -- (3,1.6) -- (1,1.6) -- cycle;
\draw (0,0) -- (4,0) -- (3,1.6) -- (1,1.6) -- cycle;
\draw[dashed] (1,1.6) -- (1,0);
\draw (1,0) rectangle (1.15,0.15);
\node[below] at (2,0) {$B$};
\node[above] at (2,1.6) {$b$};
\node[right] at (1,0.8) {$h$};
\end{tikzpicture}
```

Per ricavare $h$ moltiplica entrambi i membri per $2$, poi dividi per $B + b$:

$$
\begin{gathered}
2A = (B + b)h \\
\Rightarrow h = \frac{2A}{B + b}
\end{gathered}
$$

Per ricavare $B$ parti da $2A = (B + b)h$ e dividi per $h$; poi porta $b$ a primo membro:

$$
\begin{gathered}
\frac{2A}{h} = B + b \\
\Rightarrow B = \frac{2A}{h} - b
\end{gathered}
$$

Con $A = 24$ cm², $h = 4$ cm e $b = 5$ cm si trova $B = \dfrac{48}{4} - 5 = 7$ cm. Controllo: $\dfrac{(7 + 5) \cdot 4}{2} = 24$.
```

```ad-warning
Dividere solo un pezzo
Da $2A = (B + b)h$ non si passa a $h = \dfrac{2A}{B} + b$. Il fattore che moltiplica $h$ è tutta la somma $B + b$, e per toglierlo si divide entrambi i membri per la somma intera: $h = \dfrac{2A}{B + b}$. La parentesi è lì per ricordarlo.
```

```ad-example
Esempio 8: il moto con posizione iniziale
Un'auto parte dalla posizione $s_0$ e va a velocità costante $v$: dopo un tempo $t$ si trova nella posizione $s = s_0 + vt$. Ricava $t$.

Porta $s_0$ a primo membro, cambiandogli il segno, poi dividi per $v$:

$$
\begin{gathered}
s - s_0 = vt \\
\Rightarrow t = \frac{s - s_0}{v}
\end{gathered}
$$

Qui la velocità di un'auto in moto non è zero, quindi la divisione per $v$ è permessa. Con $s_0 = 20$ km, $s = 200$ km e $v = 90$ km/h viene $t = \dfrac{180}{90} = 2$ ore.
```

## Un cenno alle equazioni letterali fratte

Se l'incognita compare in un denominatore, l'equazione letterale è **fratta**, e si risolve con il procedimento delle [equazioni fratte](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-fratte): condizioni di esistenza, denominatore comune, equazione intera, confronto della soluzione con le condizioni. La novità è che la soluzione contiene il parametro, e il confronto con le condizioni di esistenza dà a sua volta una condizione sul parametro.

```ad-example
Esempio 9: una soluzione non sempre accettabile
Risolvi e discuti $\dfrac{a}{x - 1} = 2$.

C.E.: $x \neq 1$. Moltiplica entrambi i membri per $x - 1$ e ricava $x$:

$$
\begin{gathered}
a = 2x - 2 \\
\Rightarrow x = \frac{a + 2}{2}
\end{gathered}
$$

La soluzione è accettabile se rispetta la C.E., cioè se $\dfrac{a + 2}{2} \neq 1$: questo vuol dire $a + 2 \neq 2$, cioè $a \neq 0$.

La risposta: se $a \neq 0$, $S = \left\{\dfrac{a + 2}{2}\right\}$; se $a = 0$, l'unica soluzione trovata è $x = 1$, esclusa dalla C.E., e l'equazione è impossibile. Infatti con $a = 0$ il primo membro vale $0$ per ogni $x \neq 1$, e non può valere $2$.
```
