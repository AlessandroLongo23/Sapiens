# L'equilibrio di un corpo rigido

Una trave appoggiata su due pilastri, un'altalena con due bambini fermi in aria, una mensola che regge dei libri: sono corpi fermi su cui agiscono più forze, applicate in punti diversi. Per un punto materiale basta che le forze si annullino, come spiega la lezione [L'equilibrio di un punto materiale e le reazioni vincolari](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-punto-materiale-e-le-reazioni-vincolari); un corpo esteso invece può anche ruotare, e per tenerlo fermo serve una condizione in più, sui momenti delle forze.

## Il corpo rigido

Un **corpo rigido** è un corpo che non si deforma: le distanze tra i suoi punti restano sempre le stesse, qualunque forza agisca su di lui. È un modello, come il punto materiale: una trave d'acciaio si flette un poco sotto un carico, ma finché la flessione è piccola la si può trascurare.

A differenza di un punto materiale, un corpo rigido ha dimensioni, e le forze che agiscono su di lui sono applicate in punti diversi. Può muoversi in due modi: può **traslare**, cioè spostarsi tutto insieme senza girare, e può **ruotare**. Le forze fanno traslare il corpo quando la loro risultante non è nulla, e lo fanno ruotare quando il loro momento totale non è nullo. Una [coppia di forze](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-momento-di-una-forza-e-di-una-coppia-di-forze), per esempio, ha la risultante nulla ma fa girare il volante: la risultante nulla non basta.

## Le due condizioni di equilibrio

Un corpo rigido fermo resta fermo, cioè è in **equilibrio**, quando valgono insieme due condizioni:

1. la risultante di tutte le forze che agiscono sul corpo è nulla, e il corpo non trasla:
$$\vec{R} = \vec{0}$$
2. il momento totale di tutte le forze rispetto a un punto è nullo, e il corpo non ruota:
$$M = 0$$

Tra le forze vanno messe tutte quelle che agiscono sul corpo, anche il suo peso e le reazioni vincolari, cioè le forze con cui lo sostengono gli appoggi, i perni, i fili, che la lezione sull'equilibrio del punto materiale indica con $\vec{F}_v$. Il peso di un corpo omogeneo e simmetrico, come un'asta o una trave uguale in tutta la sua lunghezza, è applicato nel suo centro, il baricentro della lezione [Il baricentro e la stabilità dell'equilibrio](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-baricentro-e-la-stabilita-dell-equilibrio).

La seconda condizione si può scrivere rispetto al punto che si preferisce: quando la risultante è nulla, il momento totale è lo stesso rispetto a qualunque polo. Conviene quindi scegliere come polo un punto per cui passa una forza che non si conosce: il suo braccio è zero, e nell'equazione dei momenti quella forza sparisce.

```ad-note
Perché il polo si può scegliere
Con forze tutte verticali, come quelle di questa lezione, si vede in una riga. Metti le forze $F_1, F_2, \ldots$ nei punti di ascissa $x_1, x_2, \ldots$ lungo l'asta, con il segno più se sono verso l'alto e meno se sono verso il basso. Rispetto al polo di ascissa $p$ il momento totale è $F_1 (x_1 - p) + F_2 (x_2 - p) + \ldots$, cioè $(F_1 x_1 + F_2 x_2 + \ldots) - p\,(F_1 + F_2 + \ldots)$. Se la risultante $F_1 + F_2 + \ldots$ è zero, il secondo termine sparisce e il momento totale non dipende da $p$.
```

## Come si risolve un problema di equilibrio

1. Disegna il corpo e tutte le forze che agiscono su di lui: i carichi, il peso del corpo nel suo baricentro, le reazioni degli appoggi.
2. Scegli il polo in un punto per cui passa una forza che non conosci, di solito un appoggio.
3. Scrivi che il momento totale rispetto al polo è zero, con i momenti antiorari positivi e quelli orari negativi, e ricava l'incognita.
4. Scrivi che la risultante è zero, per le forze verticali e, se ci sono, per quelle orizzontali, e ricava le altre incognite.
5. Controlla il risultato con un altro polo: anche rispetto a quello il momento totale deve venire zero.

## L'asta appoggiata su un fulcro

L'altalena a bilico è un'asta appoggiata su un fulcro nel suo centro. Su di lei agiscono il peso dei due bambini, verso il basso, e la reazione del fulcro, verso l'alto. Scegliendo il fulcro come polo, la reazione ha braccio nullo, e l'equilibrio delle rotazioni dice che il momento orario di un peso è uguale al momento antiorario dell'altro.

```ad-example
Esempio 1: l'altalena
Sull'altalena, un'asse di peso trascurabile appoggiata nel suo centro, Luca, che pesa $300\,\text{N}$, siede a $1{,}5\,\text{m}$ dal fulcro. Dall'altra parte siede Marco, che pesa $450\,\text{N}$. A che distanza dal fulcro deve sedersi Marco perché l'altalena stia in equilibrio in orizzontale? Quanto vale la forza con cui il fulcro sostiene l'asse?

```tikz
% nome: equilibrio-altalena
% alt: Un'asse orizzontale appoggiata su un fulcro; a sinistra, a 1,5 metri dal fulcro, il peso di Luca, 300 newton verso il basso; a destra, a una distanza b da trovare, il peso di Marco, 450 newton verso il basso; dal fulcro la reazione Fv, 750 newton verso l'alto; forze in scala, 1 centimetro per 300 newton, e distanze in scala, 2 centimetri per metro
% svg: equilibrio-altalena-9ffa5aa8.svg 224x205
\begin{tikzpicture}
\draw[thick] (-0.5,-0.35) -- (0.5,-0.35);
\foreach \x in {-0.35,-0.2,...,0.5} \draw[thin] (\x,-0.35) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;
\draw[thick, fill=blue!10] (-3.4,0) rectangle (2.4,0.12);
\draw[-{Stealth}, thick, red] (-3,0.06) -- (-3,-0.94) node[below] {$\vec{P}_1$};
\fill (-3,0.06) circle (1.5pt);
\draw[-{Stealth}, thick, red] (2,0.06) -- (2,-1.44) node[below] {$\vec{P}_2$};
\fill (2,0.06) circle (1.5pt);
\draw[-{Stealth}, thick, red] (0,0.12) -- (0,2.62) node[above] {$\vec{F}_v$};
\draw[|-|, thin] (-3,0.45) -- (0,0.45);
\node[above] at (-1.5,0.45) {\small $1{,}5$ m};
\draw[|-|, thin] (0,0.45) -- (2,0.45);
\node[above] at (1,0.45) {\small $b$};
\end{tikzpicture}
```

Il polo è il fulcro, per cui passa la reazione $\vec{F}_v$ che non si conosce. Il peso di Luca, a sinistra, fa ruotare l'asse in senso antiorario; quello di Marco, a destra, in senso orario. Il momento totale è zero:

$$300\,\text{N} \cdot 1{,}5\,\text{m} - 450\,\text{N} \cdot b = 0$$

$$b = \frac{300\,\text{N} \cdot 1{,}5\,\text{m}}{450\,\text{N}} = 1{,}0\,\text{m}$$

Marco, che pesa una volta e mezza Luca, siede a una distanza una volta e mezza più piccola. Le forze sono tutte verticali, e la risultante è zero se la reazione verso l'alto è uguale alla somma dei pesi:

$$F_v = 300\,\text{N} + 450\,\text{N} = 750\,\text{N}$$
```

In equilibrio i momenti dei due pesi sono uguali e opposti, e le distanze sono in proporzione inversa ai pesi: chi pesa il doppio siede a metà distanza. Nella figura qui sotto puoi mettere i due bambini dove vuoi e cambiare il loro peso: quando i momenti non sono uguali, l'altalena scende dalla parte del momento più grande.

```interattivo
% nome: altalena-momenti
% alt: Un'altalena a bilico con due bambini, uno per parte, che si possono trascinare lungo l'asse; due cursori cambiano il loro peso; sotto si leggono i due momenti rispetto al fulcro, uno antiorario e uno orario, e il momento totale; quando il momento totale è zero l'asse resta orizzontale, altrimenti si inclina e tocca terra dalla parte del momento più grande
```

```ad-warning
Il peso più grande non vince sempre
Non scende la parte del bambino più pesante, ma quella con il momento più grande. Un bambino di $300\,\text{N}$ a $2{,}0\,\text{m}$ dal fulcro ($600\,\text{N} \cdot \text{m}$) solleva un adulto di $500\,\text{N}$ seduto a $1{,}0\,\text{m}$ ($500\,\text{N} \cdot \text{m}$).
```

## La trave su due appoggi

Una trave appoggiata alle estremità su due pilastri, un ponte, un'asse tra due sedie: gli appoggi spingono la trave verso l'alto con due reazioni, $\vec{F}_A$ e $\vec{F}_B$, e insieme reggono il peso della trave e i carichi. Le reazioni sono due incognite, e servono tutte e due le condizioni di equilibrio: con il polo in un appoggio si trova la reazione dell'altro, e la risultante nulla dà la seconda.

```ad-example
Esempio 2: la trave con un carico
Una trave omogenea lunga $4{,}0\,\text{m}$, che pesa $600\,\text{N}$, è appoggiata alle estremità $A$ e $B$. Sulla trave, a $1{,}0\,\text{m}$ da $A$, c'è un carico di $800\,\text{N}$. Quanto valgono le reazioni dei due appoggi?

```tikz
% nome: equilibrio-trave-due-appoggi
% alt: Una trave orizzontale lunga 4,0 metri appoggiata alle estremità A e B su due appoggi triangolari; a 1,0 metri da A un carico F di 800 newton verso il basso, nel centro della trave il peso P di 600 newton verso il basso; dagli appoggi le reazioni F_A di 900 newton e F_B di 500 newton verso l'alto; forze in scala, 1 centimetro per 500 newton
% svg: equilibrio-trave-due-appoggi-879c9722.svg 281x181
\begin{tikzpicture}
\draw[thick] (-0.5,-0.35) -- (0.5,-0.35);
\foreach \x in {-0.35,-0.2,...,0.5} \draw[thin] (\x,-0.35) -- ++(-0.15,-0.15);
\draw[thick] (5.5,-0.35) -- (6.5,-0.35);
\foreach \x in {5.65,5.8,...,6.5} \draw[thin] (\x,-0.35) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;
\draw[thick, fill=gray!20] (6,0) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;
\draw[thick, fill=blue!10] (-0.1,0) rectangle (6.1,0.14);
\draw[-{Stealth}, thick, red] (1.5,0.07) -- (1.5,-1.53) node[below] {$\vec{F}$};
\fill (1.5,0.07) circle (1.5pt);
\draw[-{Stealth}, thick, red] (3,0.07) -- (3,-1.13) node[below] {$\vec{P}$};
\fill (3,0.07) circle (1.5pt);
\draw[-{Stealth}, thick, red] (0,0.14) -- (0,1.94) node[above] {$\vec{F}_A$};
\draw[-{Stealth}, thick, red] (6,0.14) -- (6,1.14) node[above] {$\vec{F}_B$};
\node[below left] at (-0.15,-0.4) {$A$};
\node[below right] at (6.15,-0.4) {$B$};
\draw[|-|, thin] (0,0.5) -- (1.5,0.5);
\node[above] at (0.75,0.5) {\small $1{,}0$ m};
\draw[|-|, thin] (1.5,0.5) -- (3,0.5);
\node[above] at (2.25,0.5) {\small $1{,}0$ m};
\draw[|-|, thin] (3,0.5) -- (6,0.5);
\node[above] at (4.5,0.5) {\small $2{,}0$ m};
\end{tikzpicture}
```

Il peso della trave è applicato nel suo centro, a $2{,}0\,\text{m}$ da $A$. Come polo si sceglie $A$, per cui passa $\vec{F}_A$. Rispetto ad $A$ il carico e il peso fanno ruotare la trave in senso orario, la reazione $\vec{F}_B$ in senso antiorario:

$$F_B \cdot 4{,}0\,\text{m} - 800\,\text{N} \cdot 1{,}0\,\text{m} - 600\,\text{N} \cdot 2{,}0\,\text{m} = 0$$

$$F_B = \frac{800\,\text{N} \cdot \text{m} + 1200\,\text{N} \cdot \text{m}}{4{,}0\,\text{m}} = \frac{2000\,\text{N} \cdot \text{m}}{4{,}0\,\text{m}} = 500\,\text{N}$$

Le reazioni insieme reggono il carico e il peso, quindi

$$F_A = 800\,\text{N} + 600\,\text{N} - 500\,\text{N} = 900\,\text{N}$$

Il controllo con il polo in $B$: $900 \cdot 4{,}0 - 800 \cdot 3{,}0 - 600 \cdot 2{,}0 = 3600 - 2400 - 1200 = 0$. L'appoggio più vicino al carico regge di più.
```

```ad-warning
Il peso della trave non si dimentica
Se il problema dà il peso della trave o dell'asta, quel peso è una forza come le altre, applicata nel centro: senza, nell'esempio 2 si troverebbe $F_B = 200\,\text{N}$ e $F_A = 600\,\text{N}$, e le reazioni non reggerebbero la trave. Il peso si trascura solo quando il testo lo dice ("un'asta di peso trascurabile").
```

## L'asta con il suo peso

Quando il fulcro non è nel centro di un'asta pesante, il peso dell'asta ha un braccio e un momento, e va contato nell'equilibrio delle rotazioni come un carico qualunque.

```ad-example
Esempio 3: un'asta pesante appoggiata fuori dal centro
Un'asta omogenea lunga $3{,}0\,\text{m}$, che pesa $60\,\text{N}$, è appoggiata su un fulcro a $1{,}0\,\text{m}$ dall'estremità sinistra. Quale peso bisogna appendere all'estremità sinistra perché l'asta stia in equilibrio in orizzontale? Quanto vale la reazione del fulcro?

```tikz
% nome: equilibrio-asta-pesante
% alt: Un'asta orizzontale lunga 3,0 metri appoggiata su un fulcro a 1,0 metri dall'estremità sinistra; il peso dell'asta, 60 newton, è applicato nel centro, a 0,50 metri a destra del fulcro; all'estremità sinistra è appeso un peso F da trovare; dal fulcro la reazione Fv verso l'alto; forze in scala, 1 centimetro per 40 newton
% svg: equilibrio-asta-pesante-ff2bdb90.svg 184x194
\begin{tikzpicture}
\draw[thick] (1,-0.35) -- (2,-0.35);
\foreach \x in {1.15,1.3,...,2} \draw[thin] (\x,-0.35) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (1.5,0) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;
\draw[thick, fill=blue!10] (0,0) rectangle (4.5,0.12);
\draw[-{Stealth}, thick, red] (0,0.06) -- (0,-0.69) node[below] {$\vec{F}$};
\fill (0,0.06) circle (1.5pt);
\draw[-{Stealth}, thick, red] (2.25,0.06) -- (2.25,-1.44) node[below] {$\vec{P}$};
\fill (2.25,0.06) circle (1.5pt);
\draw[-{Stealth}, thick, red] (1.5,0.12) -- (1.5,2.37) node[above] {$\vec{F}_v$};
\draw[|-|, thin] (0,0.45) -- (1.5,0.45);
\node[above] at (0.75,0.45) {\small $1{,}0$ m};
\draw[|-|, thin] (1.5,0.45) -- (2.25,0.45);
\node[above right] at (1.75,0.45) {\small $0{,}50$ m};
\end{tikzpicture}
```

Il peso dell'asta è applicato nel suo centro, a $1{,}5\,\text{m}$ dall'estremità sinistra, cioè a $1{,}5 - 1{,}0 = 0{,}50\,\text{m}$ a destra del fulcro, e fa ruotare in senso orario. Il peso $F$ appeso a sinistra fa ruotare in senso antiorario. Con il polo nel fulcro:

$$F \cdot 1{,}0\,\text{m} - 60\,\text{N} \cdot 0{,}50\,\text{m} = 0 \quad\Rightarrow\quad F = \frac{30\,\text{N} \cdot \text{m}}{1{,}0\,\text{m}} = 30\,\text{N}$$

La reazione del fulcro regge il peso dell'asta e quello appeso:

$$F_v = 60\,\text{N} + 30\,\text{N} = 90\,\text{N}$$
```

```ad-warning
Il braccio del peso si misura dal fulcro
Il braccio del peso dell'asta è la distanza tra il fulcro e il centro dell'asta, $0{,}50\,\text{m}$ nell'esempio 3, non la distanza tra il centro e un'estremità ($1{,}5\,\text{m}$): con quella si troverebbe $F = 90\,\text{N}$.
```

Le leve sono aste di questo tipo, e le condizioni di equilibrio di questa lezione sono la loro regola di funzionamento: le spiega la lezione [Le leve e le macchine semplici](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/le-leve-e-le-macchine-semplici).
