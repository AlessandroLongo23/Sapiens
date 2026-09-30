# Le leve e le macchine semplici

Con un piede di porco si solleva una cassa che a mani nude non si smuove, con uno schiaccianoci si rompe un guscio che le dita non rompono, con una carrucola si tira su un secchio dal pozzo tirando la corda verso il basso. Sono **macchine semplici**: attrezzi che permettono di equilibrare o vincere una forza con un'altra forza, di intensità o di direzione diversa. La più antica e la più diffusa è la leva, e la sua regola viene dall'equilibrio dei momenti della lezione [L'equilibrio di un corpo rigido](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-di-un-corpo-rigido).

## La leva e la sua condizione di equilibrio

Una **leva** è un'asta rigida che può ruotare intorno a un punto fisso, il fulcro. Sulla leva agiscono due forze:

- la **forza resistente** $\vec{F}_r$, o resistenza, la forza da vincere: il peso della cassa, la resistenza del guscio;
- la **forza motrice** $\vec{F}_m$, o potenza, la forza che applica chi usa la leva.

Il braccio di ciascuna forza è la distanza del fulcro dalla sua retta d'azione, come per il [momento di una forza](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-momento-di-una-forza-e-di-una-coppia-di-forze): $b_r$ per la forza resistente e $b_m$ per quella motrice. Nelle leve di questa lezione le forze sono perpendicolari all'asta, e i bracci sono le distanze dal fulcro dei punti in cui sono applicate.

```tikz
% nome: leva-forze-bracci
% alt: Una leva, un'asta appoggiata su un fulcro; a sinistra, a distanza b_r dal fulcro, la forza resistente F_r verso il basso; a destra, a distanza b_m dal fulcro, la forza motrice F_m verso il basso, più corta perché il suo braccio è più lungo; le frecce sono in scala
% svg: leva-forze-bracci-a4527dab.svg 201x119
\begin{tikzpicture}
\draw[thick] (-0.5,-0.35) -- (0.5,-0.35);
\foreach \x in {-0.35,-0.2,...,0.5} \draw[thin] (\x,-0.35) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;
\draw[thick, fill=blue!10] (-1.8,0) rectangle (3.4,0.12);
\draw[-{Stealth}, thick, red] (-1.5,0.06) -- (-1.5,-1.44) node[below] {$\vec{F}_r$};
\fill (-1.5,0.06) circle (1.5pt);
\draw[-{Stealth}, thick, red] (3,0.06) -- (3,-0.69) node[below] {$\vec{F}_m$};
\fill (3,0.06) circle (1.5pt);
\draw[|-|, thin] (-1.5,0.45) -- (0,0.45);
\node[above] at (-0.75,0.45) {$b_r$};
\draw[|-|, thin] (0,0.45) -- (3,0.45);
\node[above] at (1.5,0.45) {$b_m$};
\node[below] at (0,-0.55) {\small fulcro};
\end{tikzpicture}
```

La leva è in equilibrio quando il momento della forza motrice rispetto al fulcro è uguale e opposto a quello della forza resistente, cioè quando i due momenti hanno lo stesso valore:

$$F_m \cdot b_m = F_r \cdot b_r$$

Dalla stessa uguaglianza si ricava la forza motrice che serve a equilibrare la resistenza:

$$F_m = F_r \cdot \frac{b_r}{b_m}$$

Le forze sono in proporzione inversa ai bracci: con il braccio motore tre volte più lungo di quello resistente basta una forza motrice tre volte più piccola. Per sollevare la resistenza, e non solo tenerla ferma, serve una forza motrice appena più grande di quella di equilibrio.

```ad-example
Esempio 1: il piede di porco
Con un piede di porco lungo $50\,\text{cm}$ si solleva il bordo di una cassa, che preme sull'estremità corta con una forza di $900\,\text{N}$. Il fulcro, lo spigolo su cui il piede di porco si appoggia, è a $5{,}0\,\text{cm}$ da quell'estremità, e la mano spinge all'altra estremità. Quale forza serve per tenere la cassa sollevata?

Il braccio resistente è $b_r = 5{,}0\,\text{cm}$, il braccio motore è la parte restante del piede di porco, $b_m = 50\,\text{cm} - 5{,}0\,\text{cm} = 45\,\text{cm}$. Allora

$$F_m = F_r \cdot \frac{b_r}{b_m} = 900\,\text{N} \cdot \frac{5{,}0\,\text{cm}}{45\,\text{cm}} = 100\,\text{N}$$

Il braccio motore è nove volte quello resistente, e la forza motrice nove volte più piccola della resistenza. I bracci sono in centimetri tutti e due: nel rapporto le unità si semplificano, e non serve passare ai metri.
```

## Leve vantaggiose, svantaggiose e indifferenti

Il confronto tra i bracci dice se la leva aiuta:

- se $b_m > b_r$, basta una forza motrice più piccola della resistenza: la leva è **vantaggiosa**;
- se $b_m < b_r$, serve una forza motrice più grande della resistenza: la leva è **svantaggiosa**;
- se $b_m = b_r$, la forza motrice è uguale alla resistenza: la leva è **indifferente**.

Il rapporto $F_r / F_m = b_m / b_r$ dice quante volte la leva moltiplica la forza, e alcuni libri lo chiamano guadagno della leva: è più grande di $1$ nelle leve vantaggiose, più piccolo di $1$ in quelle svantaggiose. Una leva svantaggiosa non è inutile: in cambio della forza più grande dà un movimento più ampio o più preciso all'estremità che lavora, come le pinzette o la canna da pesca.

```ad-warning
I bracci si misurano dal fulcro
Il braccio di una forza è la sua distanza dal fulcro, non dalla fine dell'asta né dall'altra forza. Nell'esempio 1 il braccio motore è $45\,\text{cm}$, non la lunghezza intera del piede di porco, $50\,\text{cm}$.
```

## I tre generi di leve

Le leve si dividono in tre generi, secondo la posizione del fulcro rispetto alle due forze.

```tikz
% nome: leve-tre-generi
% alt: Tre leve una sotto l'altra. Nella leva di primo genere il fulcro è tra la forza resistente e la forza motrice, tutte e due verso il basso. In quella di secondo genere il fulcro è a un'estremità, la forza resistente verso il basso in mezzo e la forza motrice verso l'alto all'altra estremità, più corta della resistente. In quella di terzo genere il fulcro è a un'estremità, la forza motrice verso l'alto in mezzo e la forza resistente verso il basso all'altra estremità, più corta della motrice; in ogni leva le frecce sono in scala
% svg: leve-tre-generi-5698d9c1.svg 252x223
\begin{tikzpicture}
\draw[thick, fill=gray!20] (1.4,5) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;
\draw[thick, fill=blue!10] (0,5) rectangle (3.6,5.12);
\draw[-{Stealth}, thick, red] (0.2,5.06) -- (0.2,4.06) node[right] {$\vec{F}_r$};
\draw[-{Stealth}, thick, red] (3.4,5.06) -- (3.4,4.46) node[right] {$\vec{F}_m$};
\node[right] at (4.2,4.9) {\small primo genere};
\draw[thick, fill=gray!20] (0.2,2.6) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;
\draw[thick, fill=blue!10] (0,2.6) rectangle (3.6,2.72);
\draw[-{Stealth}, thick, red] (1.8,2.66) -- (1.8,1.66) node[right] {$\vec{F}_r$};
\draw[-{Stealth}, thick, red] (3.4,2.66) -- (3.4,3.16) node[right] {$\vec{F}_m$};
\node[right] at (4.2,2.5) {\small secondo genere};
\draw[thick, fill=gray!20] (0.2,0) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;
\draw[thick, fill=blue!10] (0,0) rectangle (3.6,0.12);
\draw[-{Stealth}, thick, red] (1.2,0.06) -- (1.2,1.34) node[right] {$\vec{F}_m$};
\draw[-{Stealth}, thick, red] (3.4,0.06) -- (3.4,-0.34) node[right] {$\vec{F}_r$};
\node[right] at (4.2,-0.1) {\small terzo genere};
\end{tikzpicture}
```

- Nella **leva di primo genere** il fulcro sta tra le due forze. Può essere vantaggiosa, svantaggiosa o indifferente, secondo dove si mette il fulcro. Sono leve di primo genere l'altalena a bilico, il piede di porco, le forbici, le tenaglie, la bilancia a due piatti.
- Nella **leva di secondo genere** la forza resistente sta tra il fulcro e la forza motrice. Il braccio motore, che va dal fulcro fino oltre la resistenza, è sempre più lungo di quello resistente: la leva è sempre vantaggiosa. Sono leve di secondo genere la carriola, lo schiaccianoci, l'apribottiglie, il remo della barca (con il fulcro nella pala, appoggiata sull'acqua).
- Nella **leva di terzo genere** la forza motrice sta tra il fulcro e la forza resistente. Il braccio motore è sempre più corto di quello resistente, e la leva è sempre svantaggiosa. Sono leve di terzo genere le pinzette, la canna da pesca, la pala quando si solleva la terra, e il braccio umano.

Nelle leve di secondo e terzo genere le due forze hanno versi opposti, perché stanno dalla stessa parte del fulcro; in quelle di primo genere, per equilibrarsi, hanno lo stesso verso.

```ad-warning
Il genere non basta a dire se una leva conviene
Solo le leve di secondo genere sono sempre vantaggiose e solo quelle di terzo sempre svantaggiose. Una leva di primo genere non è vantaggiosa per forza: dipende da quale dei due bracci è più lungo, e le forbici da sarta, con le lame lunghe e i manici corti, sono svantaggiose.
```

```ad-example
Esempio 2: la carriola
In una carriola il carico, che pesa $600\,\text{N}$, ha il suo baricentro a $0{,}40\,\text{m}$ dall'asse della ruota, e le mani tengono i manici a $1{,}2\,\text{m}$ dall'asse. Di che genere è la leva? Quale forza serve per tenere la carriola sollevata?

```tikz
% nome: leva-carriola
% alt: La carriola disegnata come una leva: il fulcro è l'asse della ruota, a sinistra; il peso del carico, 600 newton verso il basso, è applicato a 0,40 metri dal fulcro, e la forza delle mani, verso l'alto, a 1,2 metri; le forze sono in scala, 1 centimetro per 300 newton
% svg: leva-carriola-f11ff4d5.svg 168x168
\begin{tikzpicture}
\draw[thick] (-0.6,-0.4) -- (0.6,-0.4);
\foreach \x in {-0.45,-0.3,...,0.6} \draw[thin] (\x,-0.4) -- ++(-0.15,-0.15);
\draw[thick, fill=gray!20] (0,0) circle (0.4);
\fill (0,0) circle (1.5pt);
\draw[thick, fill=blue!10] (0,-0.06) rectangle (3.3,0.06);
\draw[-{Stealth}, thick, red] (1,0) -- (1,-2) node[below] {$\vec{F}_r$};
\fill (1,0) circle (1.5pt);
\draw[-{Stealth}, thick, red] (3,0) -- (3,0.67) node[right] {$\vec{F}_m$};
\fill (3,0) circle (1.5pt);
\draw[|-|, thin] (0,0.55) -- (1,0.55);
\node[above] at (0.5,0.55) {\small $0{,}40$ m};
\draw[|-|, thin] (0,1.2) -- (3,1.2);
\node[above] at (1.5,1.2) {\small $1{,}2$ m};
\end{tikzpicture}
```

Il fulcro è l'asse della ruota, la resistenza è in mezzo e la forza motrice all'estremità: è una leva di secondo genere, quindi vantaggiosa. La forza delle mani è

$$F_m = F_r \cdot \frac{b_r}{b_m} = 600\,\text{N} \cdot \frac{0{,}40\,\text{m}}{1{,}2\,\text{m}} = 200\,\text{N}$$

verso l'alto: un terzo del peso del carico, perché il braccio motore è tre volte quello resistente. Un carico messo più vicino alla ruota si porta con meno fatica.
```

## Le leve del corpo umano

Le ossa sono aste rigide, le articolazioni fanno da fulcro e i muscoli applicano la forza motrice: il corpo è pieno di leve. La testa è una leva di primo genere, con il fulcro nell'articolazione tra il cranio e la prima vertebra, il peso della faccia davanti e i muscoli del collo dietro. Il piede, quando ci si alza sulle punte, è una leva di secondo genere: il fulcro è nelle dita, il peso del corpo scende sulla caviglia e il polpaccio tira il tallone verso l'alto. L'avambraccio è una leva di terzo genere.

```ad-example
Esempio 3: l'avambraccio
Con l'avambraccio orizzontale tieni in mano un peso di $50\,\text{N}$, a $32\,\text{cm}$ dal gomito. Il bicipite si attacca all'avambraccio a $4{,}0\,\text{cm}$ dal gomito e tira verso l'alto. Con quale forza tira il bicipite? Trascura il peso dell'avambraccio.

```tikz
% nome: leva-avambraccio
% alt: L'avambraccio disegnato come una leva di terzo genere: il fulcro è il gomito, a sinistra; a 4,0 centimetri dal gomito il bicipite tira verso l'alto con la forza motrice F_m, lunga, e a 32 centimetri il peso nella mano, 50 newton, tira verso il basso con la forza resistente F_r, corta; le forze sono in scala, 1 centimetro per 150 newton
% svg: leva-avambraccio-a16db1b0.svg 186x166
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,-0.08) rectangle (3.4,0.08);
\draw[-{Stealth}, thick, red] (0.4,0) -- (0.4,2.67) node[above] {$\vec{F}_m$};
\fill (0.4,0) circle (1.5pt);
\draw[-{Stealth}, thick, red] (3.2,0) -- (3.2,-0.33) node[below] {$\vec{F}_r$};
\fill (3.2,0) circle (1.5pt);
\draw[thick, fill=white] (0,0) circle (2pt);
\node[left] at (-0.1,0) {\small gomito};
\draw[|-|, thin] (0,-0.45) -- (0.4,-0.45);
\node[below] at (0.3,-0.5) {\small $4{,}0$ cm};
\draw[|-|, thin] (0,0.45) -- (3.2,0.45);
\node[above] at (1.8,0.45) {\small $32$ cm};
\end{tikzpicture}
```

Il fulcro è il gomito, la forza motrice del bicipite è tra il gomito e il peso: leva di terzo genere. Dall'equilibrio dei momenti

$$F_m = F_r \cdot \frac{b_r}{b_m} = 50\,\text{N} \cdot \frac{32\,\text{cm}}{4{,}0\,\text{cm}} = 400\,\text{N}$$

Il bicipite tira con una forza otto volte più grande del peso che tieni in mano. In cambio, un piccolo accorciamento del muscolo sposta la mano di un tratto otto volte più grande.
```

Nella figura qui sotto puoi spostare il fulcro, la forza motrice e la resistenza lungo l'asta: la figura dice di che genere è la leva, disegna in scala la forza motrice che la tiene in equilibrio e dice se la leva è vantaggiosa.

```interattivo
% nome: leva-tre-generi
% alt: Una leva con il fulcro, la forza resistente di 60 newton e la forza motrice, che si possono trascinare lungo l'asta; tre bottoni mettono la leva di primo, secondo o terzo genere; la figura disegna in scala la forza motrice che equilibra la resistenza, e sotto si leggono i due bracci, la forza motrice, il genere della leva e se è vantaggiosa, svantaggiosa o indifferente
```

## Le carrucole

Una carrucola è una ruota con una gola in cui scorre una fune, e che gira intorno a un asse. Le carrucole di questa lezione hanno peso e attrito trascurabili.

La **carrucola fissa** ha l'asse fermo, appeso a un soffitto o a una trave. È una leva di primo genere con i bracci uguali, lunghi quanto il raggio: il fulcro è l'asse, la resistenza e la forza motrice sono le due parti della fune, ai due lati della ruota. È quindi una leva indifferente, $F_m = F_r$: non riduce la forza, ma ne cambia la direzione, e permette di sollevare un peso tirando la fune verso il basso, anche con il proprio peso.

La **carrucola mobile** è appesa alla fune, e il carico è appeso al suo asse. Un capo della fune è fissato in alto, l'altro lo tira chi solleva. La carrucola è una leva di secondo genere: il fulcro è il punto in cui la fune fissa lascia la ruota, la resistenza è nell'asse, a un raggio dal fulcro, e la forza motrice sull'altro lato, a un diametro dal fulcro. Il braccio motore è il doppio di quello resistente, quindi

$$F_m = \frac{F_r}{2}$$

Lo stesso risultato si vede con le forze: il carico è retto da due tratti di fune, e la tensione di ciascuno è metà del peso.

```tikz
% nome: carrucola-fissa-mobile
% alt: A sinistra una carrucola fissa appesa al soffitto: la fune passa sulla ruota, da una parte regge un blocco di peso P e dall'altra è tirata verso il basso con una forza F uguale al peso. A destra una carrucola mobile: la fune è fissata al soffitto, scende sotto la ruota, che regge il blocco appeso al suo asse, e risale fino alla mano, che tira verso l'alto con una forza F uguale a metà del peso; le forze sono in scala
% svg: carrucola-fissa-mobile-a326f434.svg 190x185
\begin{tikzpicture}
\draw[thick] (-0.9,3.2) -- (4,3.2);
\foreach \x in {-0.75,-0.6,...,4} \draw[thin] (\x,3.2) -- ++(-0.15,0.15);
\draw (0,3.2) -- (0,2.4);
\draw (-0.3,2.4) -- (-0.3,1.3);
\draw (0.3,2.4) -- (0.3,1.5);
\draw[thick, fill=gray!20] (0,2.4) circle (0.3);
\fill (0,2.4) circle (1pt);
\draw[thick, fill=blue!10] (-0.65,0.8) rectangle (0.05,1.3);
\draw[-{Stealth}, thick, red] (-0.3,1.05) -- (-0.3,-0.15) node[below] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (0.3,1.5) -- (0.3,0.3) node[below] {$\vec{F}$};
\node[below] at (0,-0.6) {\small fissa};
\draw (2.4,3.2) -- (2.4,1.6);
\draw (3.0,1.6) -- (3.0,2.3);
\draw (2.7,1.6) -- (2.7,0.95);
\draw[thick, fill=gray!20] (2.7,1.6) circle (0.3);
\fill (2.7,1.6) circle (1pt);
\draw[thick, fill=blue!10] (2.35,0.45) rectangle (3.05,0.95);
\draw[-{Stealth}, thick, red] (2.7,0.7) -- (2.7,-0.5) node[below] {$\vec{P}$};
\draw[-{Stealth}, thick, red] (3.0,2.3) -- (3.0,2.9) node[right] {$\vec{F}$};
\node[below] at (2.7,-1.0) {\small mobile};
\end{tikzpicture}
```

```ad-example
Esempio 4: la carrucola mobile
Con una carrucola mobile si solleva un secchio di calce che pesa $360\,\text{N}$. Con quale forza bisogna tirare la fune? Di quanto bisogna tirarla per alzare il secchio di $1{,}5\,\text{m}$?

La carrucola mobile dimezza la forza:

$$F_m = \frac{F_r}{2} = \frac{360\,\text{N}}{2} = 180\,\text{N}$$

Per alzare il secchio di $1{,}5\,\text{m}$ si devono accorciare di $1{,}5\,\text{m}$ tutti e due i tratti di fune che lo reggono: bisogna tirare $2 \cdot 1{,}5\,\text{m} = 3{,}0\,\text{m}$ di fune. Spesso alla carrucola mobile se ne aggiunge una fissa, che non cambia la forza ma permette di tirare la fune verso il basso.
```

```ad-note
Quello che si guadagna in forza si perde in spostamento
Nessuna macchina semplice regala qualcosa: con la carrucola mobile la forza è metà, ma la fune da tirare è il doppio; con una leva vantaggiosa l'estremità su cui si spinge percorre un arco più lungo di quella che solleva, nello stesso rapporto dei bracci. Il prodotto della forza per lo spostamento resta lo stesso: è il lavoro, la grandezza della lezione [Il lavoro di una forza](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza).
```

## Il piano inclinato

Anche il piano inclinato è una macchina semplice. Per tenere fermo un corpo su un piano inclinato senza attrito basta una forza parallela al piano più piccola del peso del corpo, tanto più piccola quanto più il piano è lungo rispetto alla sua altezza: per sollevare un carico si fa meno fatica spingendolo su una rampa lunga, e in cambio lo si spinge per un tratto più lungo. I conti sono nella lezione [L'equilibrio sul piano inclinato](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-sul-piano-inclinato).
