# Il percettrone

Il percettrone è il più semplice modello che impara dagli esempi: riceve dei numeri in ingresso, ne fa una somma pesata e risponde 1 oppure 0 a seconda che la somma superi una soglia. I pesi non li sceglie chi lo programma: li trova una regola che li corregge ogni volta che la risposta è sbagliata. Ogni rete neurale di oggi è fatta di unità che discendono da questa, e il motivo per cui se ne mettono molte in più strati è un problema che un percettrone da solo non risolve: lo XOR.

## Dal neurone di McCulloch e Pitts alla macchina di Rosenblatt

Nel 1943 Warren McCulloch e Walter Pitts descrissero un neurone ridotto all'osso: un'unità che riceve segnali binari e si accende quando la loro somma raggiunge una soglia. Mostrarono che reti di queste unità calcolano funzioni logiche. Nel loro modello, però, i collegamenti sono fissati da chi costruisce la rete: non c'è niente che impari.

L'apprendimento lo aggiunse Frank Rosenblatt, psicologo al Cornell Aeronautical Laboratory di Buffalo. Il suo rapporto del 1957, finanziato dall'Office of Naval Research della marina degli Stati Uniti, descrive il **percettrone**: una macchina i cui collegamenti hanno un peso che cambia con l'esperienza. La prima versione era un programma per il calcolatore IBM 704. L'8 luglio 1958 il New York Times ne diede notizia con il titolo "New Navy Device Learns by Doing": dopo una cinquantina di prove il programma distingueva le schede segnate a sinistra da quelle segnate a destra. Lo stesso articolo riferiva che la marina si aspettava da quell'embrione un calcolatore capace di camminare, parlare, vedere, scrivere, riprodursi ed essere cosciente di esistere. Lo stesso anno Rosenblatt pubblicò il modello sulla Psychological Review.

Seguì una macchina vera, il Mark I Perceptron, presentata al pubblico nel 1960: una retina di 400 fotocellule, disposte in una griglia di 20 per 20, e pesi realizzati con potenziometri.

```ad-note
Il percettrone di Rosenblatt e quello dei libri
La macchina di Rosenblatt aveva tre strati di unità: quelle sensoriali (S), quelle di associazione (A), collegate alle prime in modo casuale e fisso, e quelle di risposta (R). Si imparavano solo i pesi tra A e R. Oggi con "percettrone" si intende la singola unità a soglia con i suoi pesi, cioè l'ultimo pezzo di quella macchina: è l'oggetto di questa lezione.
```

## Che cosa calcola un percettrone

Un percettrone con $n$ ingressi $x_1, \dots, x_n$ ha un **peso** $w_i$ per ogni ingresso e un numero in più, il **bias** $b$. Calcola la somma pesata

$$
s = w_1 x_1 + w_2 x_2 + \dots + w_n x_n + b = \mathbf{w} \cdot \mathbf{x} + b
$$

e risponde con la **funzione a gradino**:

$$
y = \begin{cases} 1 & \text{se } s > 0 \\ 0 & \text{se } s \le 0 \end{cases}
$$

```tikz
% nome: percettrone-schema
% alt: Schema di un percettrone: gli ingressi x1, x2 fino a xn entrano con i pesi w1, w2 fino a wn in un'unità che li somma insieme al bias b; la somma s passa per una funzione a gradino che dà l'uscita y, uguale a 1 o a 0
% svg: percettrone-schema-b2c39a92.svg 331x150
\begin{tikzpicture}
\node[circle, draw, thick, minimum size=0.85cm] (x1) at (0,2.3) {$x_1$};
\node[circle, draw, thick, minimum size=0.85cm] (x2) at (0,1.1) {$x_2$};
\node at (0,0.25) {$\vdots$};
\node[circle, draw, thick, minimum size=0.85cm] (xn) at (0,-0.7) {$x_n$};
\node[circle, draw, thick, fill=blue!10, minimum size=1.15cm] (s) at (3.3,0.8) {$\sum$};
\node[rectangle, draw, thick, fill=orange!25, minimum width=1.4cm, minimum height=1.05cm] (g) at (5.9,0.8) {};
\draw[thick] (5.4,0.52) -- (5.9,0.52) -- (5.9,1.08) -- (6.4,1.08);
\node (y) at (8,0.8) {$y$};
\node (b) at (3.3,2.5) {$b$};
\draw[-{Stealth}] (x1) -- (s);
\draw[-{Stealth}] (x2) -- (s);
\draw[-{Stealth}] (xn) -- (s);
\draw[-{Stealth}] (b) -- (s);
\draw[-{Stealth}] (s) -- (g);
\draw[-{Stealth}] (g) -- (y);
\node at (1.55,1.95) {\small $w_1$};
\node at (1.5,1.25) {\small $w_2$};
\node at (1.5,-0.25) {\small $w_n$};
\node at (4.55,1.05) {\small $s$};
\node at (3.3,-0.15) {\small somma pesata};
\node at (5.9,-0.15) {\small gradino};
\end{tikzpicture}
```

Il bias sposta la soglia: scrivere $s > 0$ è come scrivere $\mathbf{w} \cdot \mathbf{x} > -b$. Un peso positivo spinge verso la risposta 1 quando il suo ingresso è acceso, uno negativo verso lo 0, e il valore assoluto dice quanto conta quell'ingresso.

```ad-warning
Sulla soglia la risposta è 0
Con questa definizione, quando $s = 0$ il percettrone risponde 0. Altri testi mettono $s \ge 0$, o usano le uscite $+1$ e $-1$: i risultati della lezione non cambiano, ma i conti degli esempi sì. Prima di confrontare due testi, guarda quale convenzione usano.
```

## La retta di decisione

Con due ingressi i punti in cui la somma si annulla, $w_1 x_1 + w_2 x_2 + b = 0$, formano una retta, la **retta di decisione**. Da una parte la somma è positiva e il percettrone risponde 1; dall'altra risponde 0. Il vettore dei pesi $\mathbf{w} = (w_1, w_2)$ è perpendicolare alla retta e punta verso la parte dell'1, e la retta dista dall'origine $\dfrac{|b|}{\lVert \mathbf{w} \rVert}$.

```tikz
% nome: percettrone-retta-di-decisione
% alt: Piano degli ingressi x1 e x2 con la retta di decisione x1 + 2 x2 - 2 = 0: sopra la retta, nella zona colorata, la somma s è positiva e l'uscita è 1; sotto la somma è negativa e l'uscita è 0; il vettore dei pesi w = (1, 2) è perpendicolare alla retta e punta verso la zona dell'1
% svg: percettrone-retta-di-decisione-3d8064a1.svg 215x189
\begin{tikzpicture}[scale=1.25]
\fill[blue!10] (-0.5,1.25) -- (3,-0.5) -- (3,2.5) -- (-0.5,2.5) -- cycle;
\draw[->] (-0.7,0) -- (3.3,0) node[right] {$x_1$};
\draw[->] (0,-0.7) -- (0,2.8) node[above] {$x_2$};
\foreach \x in {1,2} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {1,2} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue] (-0.5,1.25) -- (3,-0.5);
\draw[-{Stealth}, thick, orange!90!black] (1,0.5) -- (1.5,1.5);
\node at (1.72,1.62) {$\mathbf{w}$};
\node at (2.15,2.05) {\small $s > 0$, $y = 1$};
\node at (1.45,-0.58) {\small $s < 0$, $y = 0$};
\end{tikzpicture}
```

In $n$ dimensioni la retta diventa un iperpiano, $\mathbf{w} \cdot \mathbf{x} + b = 0$, ma il quadro è lo stesso: un percettrone divide lo spazio degli ingressi in due semispazi. Un insieme di esempi che un iperpiano riesce a dividere, con tutti gli 1 da una parte e tutti gli 0 dall'altra, si dice **linearmente separabile**.

Le funzioni logiche di due ingressi sono il banco di prova più piccolo: gli ingressi possibili sono i quattro vertici del quadrato $(0,0)$, $(0,1)$, $(1,0)$, $(1,1)$, e una funzione dice quali devono dare 1.

```ad-example
Esempio 1: AND e OR con i pesi scelti a mano
L'AND dà 1 solo per $(1, 1)$. Con $w_1 = w_2 = 1$ e $b = -1{,}5$ la somma è $s = x_1 + x_2 - 1{,}5$, che vale $0{,}5$ in $(1,1)$, $-0{,}5$ in $(0,1)$ e in $(1,0)$, $-1{,}5$ in $(0,0)$: positiva solo dove serve.

L'OR dà 0 solo per $(0, 0)$. Bastano gli stessi pesi e una soglia più bassa: con $b = -0{,}5$ la somma vale $-0{,}5$ in $(0,0)$, $0{,}5$ in $(0,1)$ e in $(1,0)$, $1{,}5$ in $(1,1)$.
```

```tikz
% nome: and-or-linearmente-separabili
% alt: Due piani degli ingressi con i quattro punti (0,0), (0,1), (1,0), (1,1). A sinistra l'AND: solo (1,1) è pieno, e la retta x1 + x2 = 1,5 lo separa dagli altri tre. A destra l'OR: solo (0,0) è vuoto, e la retta x1 + x2 = 0,5 lo separa dagli altri tre
% svg: and-or-linearmente-separabili-3657696b.svg 361x180
\begin{tikzpicture}[scale=1.9]
\fill[blue!10] (0.2,1.3) -- (1.3,0.2) -- (1.3,1.3) -- cycle;
\draw[->] (-0.35,0) -- (1.5,0) node[right] {$x_1$};
\draw[->] (0,-0.35) -- (0,1.5) node[above] {$x_2$};
\node[below] at (1,-0.08) {\small $1$};
\node[left] at (-0.08,1) {\small $1$};
\draw[thick, blue] (0.2,1.3) -- (1.3,0.2);
\draw[thick, fill=white] (0,0) circle (2.2pt);
\draw[thick, fill=white] (0,1) circle (2.2pt);
\draw[thick, fill=white] (1,0) circle (2.2pt);
\fill (1,1) circle (2.4pt);
\node at (0.6,-0.6) {AND};
\fill[blue!10] (2.5,0.8) -- (3.6,-0.3) -- (4.1,-0.3) -- (4.1,1.3) -- (2.5,1.3) -- cycle;
\draw[->] (2.45,0) -- (4.3,0) node[right] {$x_1$};
\draw[->] (2.8,-0.35) -- (2.8,1.5) node[above] {$x_2$};
\node[below] at (3.8,-0.08) {\small $1$};
\node[left] at (2.72,1) {\small $1$};
\draw[thick, blue] (2.5,0.8) -- (3.6,-0.3);
\draw[thick, fill=white] (2.8,0) circle (2.2pt);
\fill (2.8,1) circle (2.4pt);
\fill (3.8,0) circle (2.4pt);
\fill (3.8,1) circle (2.4pt);
\node at (3.4,-0.6) {OR};
\end{tikzpicture}
```

Nelle figure di questa lezione un punto pieno è un ingresso che deve dare 1, un punto vuoto uno che deve dare 0. Prova a mettere tu la retta: trascina i due punti blu e guarda quanti dei quattro ingressi finiscono dalla parte giusta. Con AND e OR ci si riesce in molti modi. Poi passa a XOR.

```interattivo
% nome: percettrone-separa-a-mano
% alt: Piano degli ingressi con i quattro punti (0,0), (0,1), (1,0), (1,1), pieni o vuoti secondo la funzione scelta tra AND, OR e XOR. Una retta blu, che si sposta trascinando due suoi punti, divide il piano: la zona colorata è quella dove il percettrone risponde 1. Sotto compaiono i pesi w1, w2 e il bias b della retta e quanti dei quattro ingressi sono classificati giusti; un bottone scambia i due lati. Con AND e OR si arriva a 4 su 4, con XOR mai oltre 3 su 4
```

## La regola di apprendimento

Trovare i pesi a mano funziona con due ingressi e quattro esempi. La regola di Rosenblatt li trova da sola, a partire dagli esempi e dalla risposta $t$ che ciascuno deve avere (il **bersaglio**). Si presenta un esempio alla volta e si guarda la risposta $y$:

$$
\mathbf{w} \leftarrow \mathbf{w} + \eta \, (t - y) \, \mathbf{x}, \qquad b \leftarrow b + \eta \, (t - y)
$$

Il numero $\eta > 0$ è il **tasso di apprendimento**. La differenza $t - y$ può valere solo tre cose, e da lì si legge tutta la regola:

- $t - y = 0$: la risposta è giusta, e non cambia niente;
- $t - y = 1$: doveva dare 1 e ha dato 0, cioè la somma era troppo bassa. Ai pesi si aggiunge $\eta \, \mathbf{x}$, e la somma su quello stesso esempio cresce di $\eta \, (\lVert \mathbf{x} \rVert^2 + 1)$;
- $t - y = -1$: doveva dare 0 e ha dato 1. Ai pesi si toglie $\eta \, \mathbf{x}$, e la somma su quell'esempio cala della stessa quantità.

La regola corregge solo dopo un errore, e sposta la retta verso la parte giusta per l'esempio appena sbagliato. Niente garantisce che dopo una correzione quell'esempio sia a posto, né che gli altri non si guastino: per questo gli esempi si ripresentano più volte. Un passaggio completo su tutti gli esempi si chiama **epoca**, e ci si ferma alla prima epoca senza errori.

```ad-example
Esempio 2: la regola impara l'AND
Si parte da $\mathbf{w} = (0, 0)$ e $b = 0$, con $\eta = 1$, e si presentano gli ingressi nell'ordine $(0,0)$, $(0,1)$, $(1,0)$, $(1,1)$, con bersagli $0, 0, 0, 1$.

Nella prima epoca i primi tre esempi danno $s = 0$, quindi $y = 0$: giusti. Il quarto, $(1,1)$, dà anche lui $s = 0$ e $y = 0$, ma doveva dare 1: si aggiunge l'ingresso ai pesi e 1 al bias, e si arriva a $\mathbf{w} = (1, 1)$, $b = 1$.

Nella seconda epoca $(0,0)$ dà $s = 1$ e quindi $y = 1$, sbagliato per eccesso: il bias torna a $0$, mentre i pesi restano uguali perché l'ingresso è nullo. Poi $(0,1)$ dà $s = 1$, ancora troppo: $\mathbf{w} = (1, 0)$, $b = -1$. E così via:

| Epoca | Errori | Pesi alla fine | Bias alla fine |
|---|---|---|---|
| 1 | 1 | $(1, 1)$ | $1$ |
| 2 | 3 | $(2, 1)$ | $0$ |
| 3 | 3 | $(2, 1)$ | $-1$ |
| 4 | 2 | $(2, 2)$ | $-1$ |
| 5 | 1 | $(2, 1)$ | $-2$ |
| 6 | 0 | $(2, 1)$ | $-2$ |

Dopo 10 correzioni la regola si ferma su $s = 2x_1 + x_2 - 2$, che vale $-2$, $-1$, $0$, $1$ sui quattro ingressi: positiva solo in $(1,1)$. È un AND diverso da quello dell'esempio 1, e va bene lo stesso: di rette che separano ce ne sono infinite, e la regola si ferma alla prima che trova.
```

Nella figura qui sotto la regola addestra un percettrone davanti a te. I pesi di partenza sono estratti a caso, e a ogni epoca gli esempi arrivano in un ordine diverso: la retta che vedi è quella dei pesi di quel momento, e nessuna corsa è uguale a un'altra. Avvia l'addestramento con AND o con OR e guarda la retta assestarsi; con «Nuovi pesi» riparti da un'altra retta e arrivi a un'altra soluzione. Il tasso di apprendimento decide quanto si sposta la retta a ogni correzione. Poi scegli XOR e lasciala correre.

```interattivo
% nome: percettrone-regola-apprendimento
% alt: Piano degli ingressi con i quattro punti della funzione scelta tra AND, OR e XOR e la retta di decisione di un percettrone che viene addestrato sul momento, a partire da pesi estratti a caso e con gli esempi in ordine casuale. I bottoni avviano e fermano l'addestramento, presentano un solo esempio ed estraggono nuovi pesi; un cursore regola il tasso di apprendimento. Sotto la figura ci sono i pesi, il numero di epoche e di correzioni, quanti ingressi sono giusti e una barra per ogni epoca con i suoi errori. Con AND e OR l'addestramento si ferma da solo alla prima epoca senza errori, ogni volta su una retta diversa; con XOR non si ferma mai
```

Con lo XOR la retta continua a girare e le barre degli errori non toccano mai lo zero, per quanto la si lasci correre. Il caso dell'esempio 2, con pesi nulli, $\eta = 1$ e gli esempi sempre nello stesso ordine, si può seguire a mano: la regola fa 2 errori nella prima epoca, 3 nella seconda e 4 nella terza, alla fine della quale i pesi sono $\mathbf{w} = (-1, 0)$ e $b = 1$, gli stessi della fine della seconda. Da lì ogni epoca ripete le stesse quattro correzioni e torna al punto di partenza, senza fine. Per capire se è un difetto della regola o del problema servono due risultati: uno dice quando la regola si ferma, l'altro che per lo XOR non c'è niente da trovare.

Scrivere la regola in un programma chiede poche righe. Qui sotto manca solo la correzione: completala, poi verifica.

```codice python
ESEMPI = [(0, 0), (0, 1), (1, 0), (1, 1)]
BERSAGLI = {"AND": [0, 0, 0, 1], "OR": [0, 1, 1, 1], "XOR": [0, 1, 1, 0]}

nome = input()
w1, w2, b = 0, 0, 0
for epoca in range(1, 9):
    errori = 0
    for (x1, x2), t in zip(ESEMPI, BERSAGLI[nome]):
        y = 1 if w1 * x1 + w2 * x2 + b > 0 else 0
        if y != t:
            errori += 1
            # correggi w1, w2 e b con la regola del percettrone

    print("epoca", epoca, "errori", errori)
    if errori == 0:
        break
print("pesi", w1, w2, b)
%% soluzione
ESEMPI = [(0, 0), (0, 1), (1, 0), (1, 1)]
BERSAGLI = {"AND": [0, 0, 0, 1], "OR": [0, 1, 1, 1], "XOR": [0, 1, 1, 0]}

nome = input()
w1, w2, b = 0, 0, 0
for epoca in range(1, 9):
    errori = 0
    for (x1, x2), t in zip(ESEMPI, BERSAGLI[nome]):
        y = 1 if w1 * x1 + w2 * x2 + b > 0 else 0
        if y != t:
            errori += 1
            w1 += (t - y) * x1
            w2 += (t - y) * x2
            b += t - y

    print("epoca", epoca, "errori", errori)
    if errori == 0:
        break
print("pesi", w1, w2, b)
%% prova
AND
%% stampa
epoca 1 errori 1
epoca 2 errori 3
epoca 3 errori 3
epoca 4 errori 2
epoca 5 errori 1
epoca 6 errori 0
pesi 2 1 -2
%% prova
OR
%% stampa
epoca 1 errori 1
epoca 2 errori 2
epoca 3 errori 1
epoca 4 errori 0
pesi 1 1 0
%% prova
XOR
%% stampa
epoca 1 errori 2
epoca 2 errori 3
epoca 3 errori 4
epoca 4 errori 4
epoca 5 errori 4
epoca 6 errori 4
epoca 7 errori 4
epoca 8 errori 4
pesi -1 0 1
```

## Il teorema di convergenza

Se gli esempi sono linearmente separabili, la regola si ferma dopo un numero finito di correzioni, qualunque sia l'ordine in cui gli esempi vengono presentati. È il **teorema di convergenza del percettrone**, dimostrato da Rosenblatt e, nella forma che dà anche un limite al numero di correzioni, da Albert Novikoff nel 1962.

Per enunciarlo conviene alleggerire la notazione. Il bias diventa un peso in più, attaccando un 1 a ogni ingresso: $\tilde{\mathbf{x}} = (\mathbf{x}, 1)$ e $\tilde{\mathbf{w}} = (\mathbf{w}, b)$, così che $s = \tilde{\mathbf{w}} \cdot \tilde{\mathbf{x}}$. E le due classi si indicano con $z = 2t - 1$, cioè $+1$ e $-1$. Un esempio è sbagliato quando $z \, (\tilde{\mathbf{w}} \cdot \tilde{\mathbf{x}}) \le 0$, e in quel caso $t - y = z$: la regola diventa $\tilde{\mathbf{w}} \leftarrow \tilde{\mathbf{w}} + \eta \, z \, \tilde{\mathbf{x}}$.

**Teorema.** Siano $(\tilde{\mathbf{x}}_i, z_i)$ gli esempi, con $\lVert \tilde{\mathbf{x}}_i \rVert \le R$ per ogni $i$. Supponi che esistano un vettore $\mathbf{w}^*$ di norma 1 e un numero $\gamma > 0$, il **margine**, tali che $z_i \, (\mathbf{w}^* \cdot \tilde{\mathbf{x}}_i) \ge \gamma$ per ogni $i$. Allora la regola, partendo da pesi nulli, fa al massimo

$$
\left( \frac{R}{\gamma} \right)^2
$$

correzioni.

La dimostrazione segue due quantità lungo le correzioni. Sia $\tilde{\mathbf{w}}_k$ il vettore dei pesi dopo $k$ correzioni, con $\tilde{\mathbf{w}}_0 = \mathbf{0}$, e sia $(\tilde{\mathbf{x}}, z)$ l'esempio sbagliato alla correzione $k+1$.

La prima quantità è il prodotto scalare con $\mathbf{w}^*$, che a ogni correzione cresce almeno di $\eta \gamma$:

$$
\tilde{\mathbf{w}}_{k+1} \cdot \mathbf{w}^* = \tilde{\mathbf{w}}_k \cdot \mathbf{w}^* + \eta \, z \, (\tilde{\mathbf{x}} \cdot \mathbf{w}^*) \ge \tilde{\mathbf{w}}_k \cdot \mathbf{w}^* + \eta \gamma
$$

quindi $\tilde{\mathbf{w}}_k \cdot \mathbf{w}^* \ge k \, \eta \, \gamma$.

La seconda è la norma, che cresce poco proprio perché si corregge solo dopo un errore, cioè quando $z \, (\tilde{\mathbf{w}}_k \cdot \tilde{\mathbf{x}}) \le 0$:

$$
\lVert \tilde{\mathbf{w}}_{k+1} \rVert^2 = \lVert \tilde{\mathbf{w}}_k \rVert^2 + 2 \eta \, z \, (\tilde{\mathbf{w}}_k \cdot \tilde{\mathbf{x}}) + \eta^2 \lVert \tilde{\mathbf{x}} \rVert^2 \le \lVert \tilde{\mathbf{w}}_k \rVert^2 + \eta^2 R^2
$$

quindi $\lVert \tilde{\mathbf{w}}_k \rVert^2 \le k \, \eta^2 R^2$.

Per la disuguaglianza di Cauchy-Schwarz, e perché $\mathbf{w}^*$ ha norma 1, il prodotto scalare non supera la norma:

$$
k \, \eta \, \gamma \le \tilde{\mathbf{w}}_k \cdot \mathbf{w}^* \le \lVert \tilde{\mathbf{w}}_k \rVert \le \sqrt{k} \, \eta \, R
$$

Dividendo per $\eta \, \gamma \, \sqrt{k}$ resta $\sqrt{k} \le \dfrac{R}{\gamma}$, cioè $k \le \left( \dfrac{R}{\gamma} \right)^2$.

Il limite non dipende né da $\eta$ né dal numero di esempi: dipende da quanto gli esempi sono grandi ($R$) e da quanto spazio c'è tra le due classi ($\gamma$). Più il margine è stretto, più correzioni possono servire.

```ad-example
Esempio 3: il limite per l'AND
Con il bias dentro i vettori, gli ingressi dell'AND sono $(0,0,1)$, $(0,1,1)$, $(1,0,1)$, $(1,1,1)$: il più lungo ha norma $\sqrt{3}$, quindi $R^2 = 3$. Il vettore $\mathbf{w}^* = \dfrac{(2, 2, -3)}{\sqrt{17}}$ ha norma 1 e separa: $z \, (\mathbf{w}^* \cdot \tilde{\mathbf{x}})$ vale $\dfrac{3}{\sqrt{17}}$ in $(0,0)$ e $\dfrac{1}{\sqrt{17}}$ negli altri tre ingressi. Il margine è $\gamma = \dfrac{1}{\sqrt{17}}$, e il teorema garantisce al massimo $3 \cdot 17 = 51$ correzioni. Nell'esempio 2 ne sono bastate 10: il teorema dà un tetto, non una previsione.
```

```ad-warning
Il teorema non dice niente sui dati non separabili
L'ipotesi è che un vettore $\mathbf{w}^*$ esista. Se non esiste, la regola non si ferma mai, e dal fatto che dopo mille epoche stia ancora correggendo non si può concludere che i dati non siano separabili: potrebbe mancare poco.
```

## Lo XOR non è separabile

Lo XOR ("o l'uno o l'altro, ma non tutti e due") dà 1 per $(0,1)$ e $(1,0)$, e 0 per $(0,0)$ e $(1,1)$. Nessun percettrone lo calcola. Se esistessero $w_1$, $w_2$, $b$ adatti, dovrebbero valere insieme queste quattro condizioni:

$$
\begin{aligned}
(0,0) \text{ dà } 0 &: \quad b \le 0 \\
(0,1) \text{ dà } 1 &: \quad w_2 + b > 0 \\
(1,0) \text{ dà } 1 &: \quad w_1 + b > 0 \\
(1,1) \text{ dà } 0 &: \quad w_1 + w_2 + b \le 0
\end{aligned}
$$

Sommando la seconda e la terza si ottiene $w_1 + w_2 + 2b > 0$, cioè $w_1 + w_2 + b > -b$. Per la prima, $-b \ge 0$: quindi $w_1 + w_2 + b > 0$, contro la quarta. Le quattro condizioni non possono valere insieme.

La geometria dice la stessa cosa in un colpo d'occhio. Un semipiano è convesso: se contiene due punti, contiene tutto il segmento che li unisce. I due punti che devono dare 1 sono gli estremi di una diagonale del quadrato, quelli che devono dare 0 gli estremi dell'altra, e le due diagonali si incontrano nel centro $M = (0{,}5;\ 0{,}5)$. Una retta che separasse le due coppie dovrebbe lasciare $M$ da tutte e due le parti.

```tikz
% nome: xor-non-linearmente-separabile
% alt: Piano degli ingressi con i quattro punti dello XOR: (0,1) e (1,0) pieni, (0,0) e (1,1) vuoti. Il segmento tra i due punti pieni e il segmento tra i due punti vuoti sono le due diagonali del quadrato e si incontrano nel centro M, di coordinate (0,5; 0,5): nessuna retta può lasciare le due coppie da parti opposte
% svg: xor-non-linearmente-separabile-25c5e42b.svg 194x188
\begin{tikzpicture}[scale=2.4]
\draw[->] (-0.35,0) -- (1.5,0) node[right] {$x_1$};
\draw[->] (0,-0.35) -- (0,1.5) node[above] {$x_2$};
\node[below] at (1,-0.05) {\small $1$};
\node[left] at (-0.05,1) {\small $1$};
\draw[thick, dashed] (0,1) -- (1,0);
\draw[thick, dashed, gray] (0,0) -- (1,1);
\draw[thick, fill=white] (0,0) circle (1.8pt);
\draw[thick, fill=white] (1,1) circle (1.8pt);
\fill (0,1) circle (2pt);
\fill (1,0) circle (2pt);
\fill[orange!90!black] (0.5,0.5) circle (1.6pt);
\node at (0.68,0.5) {$M$};
\end{tikzpicture}
```

Lo XOR non è un caso isolato, ma con due ingressi è quasi l'unico: delle 16 funzioni logiche di due variabili, 14 sono linearmente separabili, e le due escluse sono lo XOR e la sua negazione. Con più ingressi le funzioni separabili diventano rare: 104 su 256 con tre variabili, 1882 su 65 536 con quattro.

## Che cosa dimostrarono Minsky e Papert

Nel 1969 Marvin Minsky e Seymour Papert pubblicarono "Perceptrons: An Introduction to Computational Geometry", uno studio matematico di ciò che queste macchine possono e non possono calcolare. I loro esempi principali sono più generali dello XOR: la **parità** (decidere se il numero di ingressi accesi è pari o dispari, di cui lo XOR è il caso con due ingressi) e la **connessione** di una figura. Per entrambe dimostrarono che un percettrone ha bisogno di unità che guardano una parte dell'immagine tanto più grande quanto più grande è l'immagine: non si risolvono mettendo insieme osservazioni locali.

Il libro riguarda i percettroni a un solo strato di pesi da imparare. Sulle reti a più strati gli autori non dimostrarono niente: scrissero che non vedevano ragioni per aspettarsi che le virtù del percettrone si estendessero a quel caso, e che consideravano un problema di ricerca importante chiarire, o smentire, il loro "giudizio intuitivo" che quell'estensione fosse "sterile" (capitolo 13).

Al libro si attribuisce spesso il calo dei finanziamenti e dell'interesse per le reti neurali negli anni Settanta. Quanto abbia pesato è discusso, e gli stessi autori nel 1988 sostennero che la ricerca si era fermata per difficoltà sue. Di certo mancava una cosa: una regola per imparare i pesi di una rete a più strati.

## Uno strato nascosto risolve lo XOR

Che più unità insieme calcolino lo XOR si vede senza nessuna regola di apprendimento, costruendo la rete a mano. Lo XOR è "OR ma non AND", e sia l'OR sia l'AND sono alla portata di un percettrone. Si mettono allora due unità $h_1$ e $h_2$ tra gli ingressi e l'uscita, in quello che si chiama **strato nascosto**:

$$
h_1 = \text{gradino}(x_1 + x_2 - 0{,}5), \qquad h_2 = \text{gradino}(x_1 + x_2 - 1{,}5), \qquad y = \text{gradino}(h_1 - 2h_2 - 0{,}5)
$$

La prima è l'OR degli ingressi, la seconda l'AND. L'uscita si accende quando $h_1$ è accesa e $h_2$ spenta:

| $x_1$ | $x_2$ | $h_1$ | $h_2$ | $h_1 - 2h_2 - 0{,}5$ | $y$ |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | $-0{,}5$ | 0 |
| 0 | 1 | 1 | 0 | $0{,}5$ | 1 |
| 1 | 0 | 1 | 0 | $0{,}5$ | 1 |
| 1 | 1 | 1 | 1 | $-1{,}5$ | 0 |

```tikz
% nome: rete-xor-due-unita-nascoste
% alt: Rete con due ingressi x1 e x2, due unità nascoste h1 e h2 e un'uscita y. Ogni ingresso è collegato a ogni unità nascosta con peso 1; h1 ha bias -0,5 e h2 ha bias -1,5. L'uscita riceve h1 con peso 1 e h2 con peso -2, disegnato più spesso e tratteggiato, e ha bias -0,5
% svg: rete-xor-due-unita-nascoste-613537fe.svg 291x170
\begin{tikzpicture}
\node[circle, draw, thick, minimum size=0.9cm] (x1) at (0,2.4) {$x_1$};
\node[circle, draw, thick, minimum size=0.9cm] (x2) at (0,0) {$x_2$};
\node[circle, draw, thick, fill=blue!10, minimum size=0.9cm] (h1) at (3.2,2.4) {$h_1$};
\node[circle, draw, thick, fill=blue!10, minimum size=0.9cm] (h2) at (3.2,0) {$h_2$};
\node[circle, draw, thick, fill=orange!25, minimum size=0.9cm] (y) at (6.4,1.2) {$y$};
\draw[thick] (x1) -- (h1);
\draw[thick] (x1) -- (h2);
\draw[thick] (x2) -- (h1);
\draw[thick] (x2) -- (h2);
\draw[thick] (h1) -- (y);
\draw[very thick, dashed] (h2) -- (y);
\node at (1.6,2.65) {\small $1$};
\node at (1.6,-0.25) {\small $1$};
\node at (0.85,1.95) {\small $1$};
\node at (0.85,0.45) {\small $1$};
\node at (4.9,2.05) {\small $1$};
\node at (4.9,0.3) {\small $-2$};
\node at (3.2,3.15) {\small $b = -0{,}5$};
\node at (3.2,-0.75) {\small $b = -1{,}5$};
\node at (6.4,0.45) {\small $b = -0{,}5$};
\end{tikzpicture}
```

Il punto è che cosa vede l'unità di uscita. Lei non guarda più $(x_1, x_2)$ ma $(h_1, h_2)$, e in quel piano i quattro ingressi cadono su tre punti soli: $(0,0)$ va in $(0,0)$, i due ingressi che devono dare 1 vanno entrambi in $(1,0)$, e $(1,1)$ va in $(1,1)$. Questi tre punti una retta li separa. Lo strato nascosto ha cambiato la rappresentazione degli ingressi, e nella nuova rappresentazione il problema è diventato lineare.

Nella figura cambia i due ingressi e segui il segnale: a sinistra la rete, dove un peso più grande è una linea più spessa e più scura e un peso negativo è tratteggiato; a destra il piano di $h_1$ e $h_2$, con il punto in cui cade l'ingresso scelto.

```interattivo
% nome: rete-xor-strato-nascosto
% alt: A sinistra una rete con gli ingressi x1 e x2, le unità nascoste h1 e h2 e l'uscita y: le linee dei pesi sono più spesse e scure dove il peso è più grande e tratteggiate dove è negativo, e ogni unità mostra il suo valore, 0 o 1. A destra il piano delle unità nascoste con i tre punti (0,0), (1,0) e (1,1) e la retta h1 - 2 h2 = 0,5 che separa (1,0) dagli altri due. Due bottoni cambiano x1 e x2: sotto la figura compaiono i conti di h1, h2 e y per l'ingresso scelto
```

Qui i pesi li abbiamo scelti noi, sapendo già la risposta. La regola del percettrone non li sa trovare: corregge i pesi di un'unità guardando l'errore della sua uscita, e per un'unità nascosta nessuno dice quale uscita avrebbe dovuto dare. Rosenblatt questo problema non lo risolse, e la funzione a gradino lo rende intrattabile, perché una piccola variazione di un peso quasi sempre non cambia niente. La risposta, con unità che rispondono in modo graduale e l'errore propagato all'indietro di strato in strato, si affermò con il lavoro di Rumelhart, Hinton e Williams del 1986: è l'argomento delle prossime lezioni.

## Fonti

- W. S. McCulloch, W. Pitts, ["A logical calculus of the ideas immanent in nervous activity"](https://doi.org/10.1007/BF02478259), Bulletin of Mathematical Biophysics, 5 (1943), pp. 115-133.
- F. Rosenblatt, "The Perceptron: a perceiving and recognizing automaton", Report 85-460-1, Cornell Aeronautical Laboratory, 1957.
- F. Rosenblatt, ["The perceptron: a probabilistic model for information storage and organization in the brain"](https://doi.org/10.1037/h0042519), Psychological Review, 65 (1958), pp. 386-408.
- ["New Navy Device Learns by Doing"](https://www.nytimes.com/1958/07/08/archives/new-navy-device-learns-by-doing-psychologist-shows-embryo-of.html), The New York Times, 8 luglio 1958.
- A. B. J. Novikoff, "On convergence proofs on perceptrons", Proceedings of the Symposium on the Mathematical Theory of Automata, 12 (1962), pp. 615-622. Lo stesso lavoro come rapporto dello Stanford Research Institute, gennaio 1963, si legge per intero: ["On convergence proofs for perceptrons"](https://archive.org/details/DTIC_AD0298258).
- M. Minsky, S. Papert, ["Perceptrons: An Introduction to Computational Geometry"](https://mitpress.mit.edu/9780262630221/perceptrons/), MIT Press, 1969; edizione ampliata 1988.
- D. E. Rumelhart, G. E. Hinton, R. J. Williams, ["Learning representations by back-propagating errors"](https://doi.org/10.1038/323533a0), Nature, 323 (1986), pp. 533-536.
