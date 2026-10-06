# Il legame a idrogeno

L'etanolo, l'alcol del vino, e l'etere dimetilico hanno la stessa formula, $\mathrm{C_2H_6O}$: stessi atomi, stessa massa molare, stessi $26$ elettroni, e tutte e due le molecole sono polari. Eppure l'etanolo è un liquido che bolle a $78\,^\circ\text{C}$ e l'etere dimetilico un gas che bolle a $-25\,^\circ\text{C}$. Cento gradi di differenza non si spiegano con le [forze dipolo-dipolo e di London](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/forze-dipolo-dipolo-e-forze-di-london), che nelle due sostanze sono quasi uguali. Nell'etanolo c'è una forza in più, che nell'etere manca: il legame a idrogeno.

## Che cos'è il legame a idrogeno

Hai già incontrato il legame a idrogeno tra le molecole d'acqua, nella lezione [La molecola d'acqua e il legame a idrogeno](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/la-molecola-d-acqua-e-il-legame-a-idrogeno). Ora che conosci l'elettronegatività e le coppie solitarie si può dire con precisione quando si forma, e non solo nell'acqua.

Il **legame a idrogeno** è l'attrazione tra un atomo di idrogeno legato con un legame covalente a un atomo piccolo e molto elettronegativo (fluoro, ossigeno o azoto) e una coppia solitaria di un altro atomo di fluoro, ossigeno o azoto. Si scrive con tre puntini, o si disegna con una linea tratteggiata:

$$\mathrm{X{-}H} \cdots \mathrm{Y} \qquad \text{con X e Y scelti tra F, O, N}$$

Il trattino è il legame covalente, dentro la molecola; i puntini sono il legame a idrogeno, verso un'altra molecola. Il gruppo $\mathrm{X{-}H}$ è il **donatore** del legame a idrogeno, perché mette l'idrogeno; l'atomo $\mathrm{Y}$ con la sua coppia solitaria è l'**accettore**.

```tikz
% nome: legame-idrogeno-donatore-accettore
% alt: Due molecole d'acqua affiancate. Nella molecola di sinistra un idrogeno, con carica parziale positiva, punta verso l'ossigeno della molecola di destra, che ha carica parziale negativa e due coppie solitarie disegnate come coppie di puntini. Tra l'idrogeno e l'ossigeno c'è una linea tratteggiata arancione, il legame a idrogeno, più lunga del legame covalente O-H disegnato con una linea piena. Sotto la molecola di sinistra è scritto donatore, sotto quella di destra accettore
\begin{tikzpicture}
% donatore
\draw[thick] (0,0) -- (0.8,0);
\draw[thick] (0,0) -- ++(104.5:0.8);
\draw[thick, fill=blue!10] (0.8,0) circle (0.22);
\draw[thick, fill=blue!10] (0,0) ++(104.5:0.8) circle (0.22);
\draw[thick, fill=red!20] (0,0) circle (0.36);
\node at (0,0) {O};
\node at (0.8,0) {\scriptsize H};
\node at (0.8,0.48) {\small $\delta^+$};
\node at (-0.55,-0.35) {\small $\delta^-$};
% legame a idrogeno
\draw[thick, dashed, orange!90!black] (1.06,0) -- (2.2,0);
% accettore
\begin{scope}[shift={(2.6,0)}]
\draw[thick] (0,0) -- ++(52.25:0.8);
\draw[thick] (0,0) -- ++(-52.25:0.8);
\draw[thick, fill=blue!10] (0,0) ++(52.25:0.8) circle (0.22);
\draw[thick, fill=blue!10] (0,0) ++(-52.25:0.8) circle (0.22);
\draw[thick, fill=red!20] (0,0) circle (0.36);
\node at (0,0) {O};
\fill (-0.46,0.07) circle (1.2pt); \fill (-0.46,-0.07) circle (1.2pt);
\fill (-0.2,0.47) circle (1.2pt); \fill (-0.07,0.5) circle (1.2pt);
\node at (-0.25,-0.62) {\small $\delta^-$};
\end{scope}
\draw[thin] (1.6,0.08) -- (1.6,0.75);
\node[above] at (1.6,0.75) {\small legame a idrogeno};
\draw[thin] (0.4,-0.08) -- (0.4,-0.75);
\node[below] at (0.4,-0.75) {\small legame covalente};
\node at (0,-1.75) {\small donatore};
\node at (2.9,-1.75) {\small accettore};
\end{tikzpicture}
```

### Perché proprio fluoro, ossigeno e azoto

Fluoro, ossigeno e azoto sono tra gli elementi più elettronegativi della tavola periodica: sulla scala di Pauling valgono $3{,}98$, $3{,}44$ e $3{,}04$, contro $2{,}20$ dell'idrogeno (i valori sono quelli della [tavola periodica](/strumenti/tavola-periodica)). Il legame $\mathrm{X{-}H}$ è quindi molto polare, e l'idrogeno ha una carica parziale $\delta^+$ grande.

C'è poi una ragione che riguarda solo l'idrogeno. Il suo atomo ha un solo elettrone, e quando quell'elettrone è tirato verso l'altro atomo il nucleo resta quasi scoperto. Un idrogeno così è una carica positiva piccolissima e concentrata, che può avvicinarsi molto alla coppia solitaria di un'altra molecola.

Anche la dimensione dell'atomo $\mathrm{Y}$ conta. Il cloro ha un'elettronegatività di $3{,}16$, più alta di quella dell'azoto, ma è un atomo più grande: la sua carica parziale negativa è distribuita su una nube più ampia, e l'attrazione per l'idrogeno è troppo debole perché si parli di legame a idrogeno. Per questo la regola pratica si ferma a tre elementi.

```ad-warning
Il legame a idrogeno non è il legame covalente con l'idrogeno
Il legame $\mathrm{O{-}H}$ dentro una molecola d'acqua è covalente. Il legame a idrogeno è quello, tratteggiato, tra l'idrogeno di una molecola e l'ossigeno di un'altra: è una forza intermolecolare. Quando l'acqua bolle si rompono i legami a idrogeno, e le molecole $\mathrm{H_2O}$ restano intere.
```

## Le due condizioni

Perché tra due molecole si formi un legame a idrogeno servono due cose, una per molecola:

1. la prima molecola deve avere un idrogeno legato a un atomo di $\mathrm{F}$, $\mathrm{O}$ o $\mathrm{N}$;
2. la seconda deve avere un atomo di $\mathrm{F}$, $\mathrm{O}$ o $\mathrm{N}$ con almeno una coppia solitaria.

Una sostanza pura forma legami a idrogeno tra le sue molecole solo se la sua molecola soddisfa tutte e due le condizioni. Le coppie solitarie si contano con i [simboli di Lewis](/materiale/scuola-superiore/chimica/il-sistema-periodico/elettroni-di-valenza-e-simboli-di-lewis): nelle molecole neutre l'azoto ne ha una, l'ossigeno due, il fluoro tre.

| Molecola | Idrogeni legati a F, O, N | Coppie solitarie su F, O, N | Legami a idrogeno tra le sue molecole |
|---|---|---|---|
| acqua, $\mathrm{H_2O}$ | $2$ | $2$ | sì |
| ammoniaca, $\mathrm{NH_3}$ | $3$ | $1$ | sì |
| fluoruro di idrogeno, $\mathrm{HF}$ | $1$ | $3$ | sì |
| metanolo, $\mathrm{CH_3OH}$ | $1$ | $2$ | sì |
| metano, $\mathrm{CH_4}$ | $0$ | $0$ | no |
| solfuro di idrogeno, $\mathrm{H_2S}$ | $0$ | $0$ | no |
| etere dimetilico, $\mathrm{CH_3OCH_3}$ | $0$ | $2$ | no |

Il metanolo ha quattro idrogeni, ma tre sono legati al carbonio: conta solo quello del gruppo $\mathrm{OH}$. L'etere dimetilico ha un ossigeno con due coppie solitarie, ma tutti i suoi sei idrogeni sono legati al carbonio: gli manca il donatore. È la risposta alla domanda dell'inizio.

```tikz
% nome: legame-idrogeno-etanolo-etere
% alt: In alto due molecole di etanolo scritte con la formula di struttura CH3-CH2-O-H: l'idrogeno del gruppo OH della prima è unito all'ossigeno della seconda da una linea tratteggiata arancione, un legame a idrogeno. In basso due molecole di etere dimetilico, CH3-O-CH3: tra loro non c'è nessuna linea tratteggiata, perché nessun idrogeno è legato all'ossigeno
\begin{tikzpicture}
% etanolo 1
\node (a1) at (0,0) {$\mathrm{CH_3}$};
\node (a2) at (1.1,0) {$\mathrm{CH_2}$};
\node (a3) at (2.0,0) {O};
\node (a4) at (2.7,0) {H};
\draw[thick] (a1) -- (a2); \draw[thick] (a2) -- (a3); \draw[thick] (a3) -- (a4);
% etanolo 2
\node (b3) at (3.9,0) {O};
\node (b4) at (3.9,0.8) {H};
\node (b2) at (4.85,0) {$\mathrm{CH_2}$};
\node (b1) at (5.95,0) {$\mathrm{CH_3}$};
\draw[thick] (b3) -- (b4); \draw[thick] (b3) -- (b2); \draw[thick] (b2) -- (b1);
\draw[thick, dashed, orange!90!black] (a4) -- (b3);
\node at (3.0,-0.6) {\small etanolo: bolle a $78\,^\circ$C};
% etere
\begin{scope}[shift={(0,-1.9)}]
\node (c1) at (0,0) {$\mathrm{CH_3}$};
\node (c2) at (1.0,0) {O};
\node (c3) at (2.0,0) {$\mathrm{CH_3}$};
\draw[thick] (c1) -- (c2); \draw[thick] (c2) -- (c3);
\node (d1) at (3.95,0) {$\mathrm{CH_3}$};
\node (d2) at (4.95,0) {O};
\node (d3) at (5.95,0) {$\mathrm{CH_3}$};
\draw[thick] (d1) -- (d2); \draw[thick] (d2) -- (d3);
\node at (3.0,-0.6) {\small etere dimetilico: bolle a $-25\,^\circ$C};
\end{scope}
\end{tikzpicture}
```

```ad-warning
"C'è idrogeno e c'è ossigeno, quindi ci sono legami a idrogeno"
Non conta che nella formula compaiano $\mathrm{H}$ e $\mathrm{O}$: conta a quale atomo è legato ogni idrogeno. Nell'etere dimetilico e nel metano gli idrogeni sono legati al carbonio, che ha quasi la stessa elettronegatività dell'idrogeno ($2{,}55$ contro $2{,}20$): il legame $\mathrm{C{-}H}$ è praticamente apolare, e quell'idrogeno non forma legami a idrogeno.
```

### Tra molecole diverse

Le due condizioni possono essere soddisfatte da due molecole diverse. L'etere dimetilico non forma legami a idrogeno con un'altra molecola di etere, ma il suo ossigeno può fare da accettore per l'idrogeno di una molecola d'acqua. Acqua e ammoniaca, acqua ed etanolo, acqua e metanolo formano legami a idrogeno in tutti e due i versi, ed è una delle ragioni per cui queste sostanze si sciolgono così bene in acqua, come spiega la lezione [L'acqua come solvente](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/l-acqua-come-solvente). Il metano non soddisfa né la prima né la seconda condizione, e con l'acqua non ne forma.

Nella figura qui sotto scegli due molecole. La figura dice, per ciascuna, se può donare un idrogeno e se può accettarlo, e disegna il legame a idrogeno quando si forma.

```interattivo
% nome: legame-idrogeno-chi-con-chi
% alt: Due molecole scelte tra acqua, ammoniaca, fluoruro di idrogeno, metanolo, etere dimetilico, metano e solfuro di idrogeno, disegnate con gli atomi come cerchi con il simbolo. Quando la molecola di sinistra ha un idrogeno legato a fluoro, ossigeno o azoto e quella di destra ha uno di questi atomi con una coppia solitaria, le due molecole si dispongono con l'idrogeno rivolto verso la coppia solitaria e tra loro compare una linea tratteggiata arancione, il legame a idrogeno; altrimenti restano separate. Sotto la figura si legge, per ogni molecola, se può fare da donatore e da accettore, e si può scambiare il ruolo delle due
```

Provando le coppie si vede che il verso conta: tra acqua ed etere dimetilico il legame si forma se è l'acqua a donare l'idrogeno, e non nel verso opposto. Metano e solfuro di idrogeno non si legano con nessuno, né come donatori né come accettori.

## Quanto è forte

Un legame a idrogeno ha un'energia compresa, a seconda delle molecole, tra circa $10$ e $40\,\text{kJ/mol}$. Per l'acqua vale circa $20\,\text{kJ/mol}$, contro i $463\,\text{kJ/mol}$ del legame covalente $\mathrm{O{-}H}$: più di venti volte meno. È però la più intensa delle forze tra molecole neutre, ben più forte delle forze dipolo-dipolo e delle forze di London che agiscono tra molecole piccole.

Il legame a idrogeno ha anche una direzione. È più forte quando i tre atomi $\mathrm{X{-}H} \cdots \mathrm{Y}$ sono allineati, con l'idrogeno che punta dritto verso la coppia solitaria. Le forze di London attraggono in tutte le direzioni; il legame a idrogeno tiene le molecole in posizioni precise, e per questo costruisce strutture ordinate come il ghiaccio.

## I punti di ebollizione anomali

La prova più chiara dell'esistenza dei legami a idrogeno viene dalle temperature di ebollizione dei composti dell'idrogeno con gli elementi dei gruppi 14, 15, 16 e 17 (IVA, VA, VIA e VIIA nella numerazione tradizionale).

```tikz
% nome: legame-idrogeno-ebollizione-quattro-gruppi
% alt: Grafico della temperatura di ebollizione, da meno 180 a più 120 gradi Celsius, dei composti dell'idrogeno con gli elementi dei periodi 2, 3, 4 e 5, per quattro gruppi. Gruppo 14: metano meno 162, poi silano, germano e stannano in salita regolare fino a meno 52. Gruppo 15: ammoniaca a meno 33, poi fosfina a meno 88, arsina a meno 62 e stibina a meno 17. Gruppo 16: acqua a 100, poi solfuro, seleniuro e tellururo di idrogeno a meno 60, meno 41 e meno 2. Gruppo 17: fluoruro di idrogeno a 20, poi cloruro, bromuro e ioduro a meno 85, meno 67 e meno 35. In tre gruppi il primo composto sta molto più in alto degli altri; nel gruppo 14 no
\begin{tikzpicture}[x=1.35cm, y=0.0165cm]
\foreach \x in {2,3,4,5} \draw[gray!25, very thin] (\x,-180) -- (\x,120);
\foreach \y in {-160,-120,-80,-40,0,40,80,120} \draw[gray!25, very thin] (1.05,\y) -- (5.2,\y);
\foreach \t in {-160,-120,-80,-40,0,40,80,120} \draw (1.05,\t) -- (0.99,\t) node[left] {\small $\t$};
\draw[->] (1.05,-180) -- (1.05,138) node[above] {\small $t_{eb}$ ($^\circ$C)};
\draw[->] (1.05,-180) -- (5.4,-180) node[right] {\small periodo};
\foreach \p in {2,3,4,5} \draw (\p,-180) -- (\p,-186) node[below] {\small $\p$};
\draw[thick, gray] (2,-162) -- (3,-112) -- (4,-88) -- (5,-52);
\foreach \x/\y in {2/-162, 3/-112, 4/-88, 5/-52} \fill[gray] (\x,\y) circle (2pt);
\draw[thick, green!50!black] (2,-33) -- (3,-88) -- (4,-62) -- (5,-17);
\foreach \x/\y in {2/-33, 3/-88, 4/-62, 5/-17} \fill[green!50!black] (\x,\y) circle (2pt);
\draw[thick, blue] (2,100) -- (3,-60) -- (4,-41) -- (5,-2);
\foreach \x/\y in {2/100, 3/-60, 4/-41, 5/-2} \fill[blue] (\x,\y) circle (2pt);
\draw[thick, red] (2,20) -- (3,-85) -- (4,-67) -- (5,-35);
\foreach \x/\y in {2/20, 3/-85, 4/-67, 5/-35} \fill[red] (\x,\y) circle (2pt);
\node[left] at (1.97,100) {\small $\mathrm{H_2O}$};
\node[left] at (1.97,24) {\small HF};
\node[left] at (1.97,-33) {\small $\mathrm{NH_3}$};
\node[left] at (1.97,-158) {\small $\mathrm{CH_4}$};
\node[right] at (5.05,8) {\scriptsize gruppo 16};
\node[right] at (5.05,-13) {\scriptsize gruppo 15};
\node[right] at (5.05,-35) {\scriptsize gruppo 17};
\node[right] at (5.05,-57) {\scriptsize gruppo 14};
\end{tikzpicture}
```

Nel gruppo 14 tutto va come previsto dalle forze di London: dal metano allo stannano, $\mathrm{SnH_4}$, gli elettroni aumentano e la temperatura di ebollizione sale con regolarità. Negli altri tre gruppi la tendenza è la stessa dal terzo periodo in giù, ma il primo composto fa eccezione: l'ammoniaca, l'acqua e il fluoruro di idrogeno, che hanno le molecole più piccole e dovrebbero bollire alle temperature più basse, bollono molto più in alto dei loro vicini.

| Gruppo | Periodo 2 | Periodo 3 | Periodo 4 | Periodo 5 |
|---|---|---|---|---|
| 14 | $\mathrm{CH_4}$: $-162$ | $\mathrm{SiH_4}$: $-112$ | $\mathrm{GeH_4}$: $-88$ | $\mathrm{SnH_4}$: $-52$ |
| 15 | $\mathrm{NH_3}$: $-33$ | $\mathrm{PH_3}$: $-88$ | $\mathrm{AsH_3}$: $-62$ | $\mathrm{SbH_3}$: $-17$ |
| 16 | $\mathrm{H_2O}$: $100$ | $\mathrm{H_2S}$: $-60$ | $\mathrm{H_2Se}$: $-41$ | $\mathrm{H_2Te}$: $-2$ |
| 17 | $\mathrm{HF}$: $20$ | $\mathrm{HCl}$: $-85$ | $\mathrm{HBr}$: $-67$ | $\mathrm{HI}$: $-35$ |

Le temperature sono in gradi Celsius. Le tre eccezioni sono proprio i composti dell'idrogeno con $\mathrm{N}$, $\mathrm{O}$ e $\mathrm{F}$: per farli bollire bisogna rompere i legami a idrogeno, e serve una temperatura più alta. Il metano non ne forma, perché il carbonio non è abbastanza elettronegativo e non ha coppie solitarie, e resta in linea con il suo gruppo.

### Perché l'acqua bolle più in alto del fluoruro di idrogeno

Il fluoro è più elettronegativo dell'ossigeno, e un singolo legame a idrogeno $\mathrm{F{-}H} \cdots \mathrm{F}$ è più forte di un legame $\mathrm{O{-}H} \cdots \mathrm{O}$. Eppure l'acqua bolle $80$ gradi più in alto. La ragione è nel numero di legami. Ogni legame a idrogeno usa un idrogeno e una coppia solitaria. La molecola d'acqua ha due idrogeni e due coppie solitarie: i conti tornano, e ogni molecola può legarsi a quattro vicine, due con i suoi idrogeni e due con le sue coppie solitarie, formando una rete in tutte le direzioni. Il fluoruro di idrogeno ha tre coppie solitarie ma un solo idrogeno, e l'ammoniaca tre idrogeni ma una sola coppia solitaria: nell'uno mancano gli idrogeni, nell'altra le coppie, e ogni molecola forma in media due legami soltanto.

## Il ghiaccio

Nel ghiaccio tutte le molecole d'acqua formano i loro quattro legami a idrogeno. Poiché il legame a idrogeno ha una direzione, le quattro vicine stanno in posizioni precise attorno a ogni molecola, e l'insieme è una rete di anelli a sei molecole con molto spazio vuoto all'interno.

```tikz
% nome: legame-idrogeno-ghiaccio-anello
% alt: Sei molecole d'acqua disposte ai vertici di un esagono, come in uno strato di ghiaccio. Ogni molecola ha un idrogeno rivolto verso l'ossigeno della molecola successiva dell'anello, a cui è unito da una linea tratteggiata arancione, un legame a idrogeno, e l'altro idrogeno rivolto verso l'esterno dell'anello, verso le molecole degli anelli vicini. Al centro dell'esagono lo spazio è vuoto
\begin{tikzpicture}
\foreach \a in {0,60,...,300} {
\draw[thick] (\a:1.5) -- ++(\a+120:0.52);
\draw[thick] (\a:1.5) -- ++(\a:0.52);
\draw[thick, dashed, orange!90!black] (\a:1.5) ++(\a+120:0.68) -- ++(\a+120:0.56);
\draw[thick, fill=blue!10] (\a:1.5) ++(\a+120:0.52) circle (0.16);
\draw[thick, fill=blue!10] (\a:1.5) ++(\a:0.52) circle (0.16);
\draw[thick, fill=red!20] (\a:1.5) circle (0.26);
}
\node at (0,0) {\small spazio vuoto};
\end{tikzpicture}
```

Questa struttura aperta occupa più volume dell'acqua liquida, in cui una parte dei legami è rotta e le molecole stanno più vicine. Il ghiaccio ha quindi una densità minore, $0{,}917\,\text{g/mL}$ contro quasi $1{,}000\,\text{g/mL}$, e galleggia. La forma a sei punte dei fiocchi di neve viene dagli stessi anelli. Le altre conseguenze per l'acqua (il massimo di densità a $4\,^\circ\text{C}$, il calore specifico alto, la tensione superficiale) sono nella lezione [Le proprietà fisiche dell'acqua](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/le-proprieta-fisiche-dell-acqua).

## Nelle molecole della vita

I legami a idrogeno non si formano solo tra molecole piccole. Nelle molecole molto grandi degli organismi viventi tengono insieme catene diverse, o parti lontane della stessa catena, e ne fissano la forma.

Il caso più noto è il DNA. La sua molecola è fatta di due filamenti avvolti a doppia elica, e su ogni filamento sporgono le basi azotate, di quattro tipi: adenina (A), timina (T), guanina (G) e citosina (C). Le basi di un filamento sono unite a quelle dell'altro da legami a idrogeno del tipo $\mathrm{N{-}H} \cdots \mathrm{O}$ e $\mathrm{N{-}H} \cdots \mathrm{N}$, e si appaiano sempre allo stesso modo: l'adenina con la timina, con due legami a idrogeno, e la guanina con la citosina, con tre.

```tikz
% nome: legame-idrogeno-dna-coppie-basi
% alt: Schema di un tratto di DNA con quattro coppie di basi. I due filamenti sono due linee verticali spesse, a sinistra e a destra. Da ogni filamento sporge una base, un rettangolo con la lettera: dall'alto, A di fronte a T, G di fronte a C, T di fronte ad A, C di fronte a G. Tra le due basi di ogni coppia ci sono linee tratteggiate arancioni, i legami a idrogeno: due tra adenina e timina, tre tra guanina e citosina
\begin{tikzpicture}
\draw[very thick] (0,0.5) -- (0,-3.5);
\draw[very thick] (5,0.5) -- (5,-3.5);
\foreach \y/\l/\r/\n in {0/A/T/2, -1/G/C/3, -2/T/A/2, -3/C/G/3} {
\draw[thick, fill=blue!10] (0,\y-0.3) rectangle (1.9,\y+0.3);
\draw[thick, fill=red!20] (3.1,\y-0.3) rectangle (5,\y+0.3);
\node at (0.95,\y) {\l};
\node at (4.05,\y) {\r};
\node[right] at (5.2,\y) {\small $\n$ legami};
}
\foreach \y in {0,-2} {
\draw[thick, dashed, orange!90!black] (1.9,\y+0.12) -- (3.1,\y+0.12);
\draw[thick, dashed, orange!90!black] (1.9,\y-0.12) -- (3.1,\y-0.12);
}
\foreach \y in {-1,-3} {
\draw[thick, dashed, orange!90!black] (1.9,\y+0.18) -- (3.1,\y+0.18);
\draw[thick, dashed, orange!90!black] (1.9,\y) -- (3.1,\y);
\draw[thick, dashed, orange!90!black] (1.9,\y-0.18) -- (3.1,\y-0.18);
}
\node[above] at (0,0.5) {\small filamento};
\node[above] at (5,0.5) {\small filamento};
\end{tikzpicture}
```

Qui la debolezza del legame a idrogeno è un vantaggio. Un legame solo si rompe con poca energia, ma milioni di legami in fila tengono i due filamenti saldamente uniti; e quando la cellula deve copiare il DNA li può aprire un tratto alla volta, come una cerniera, senza rompere nessun legame covalente.

Anche le proteine devono la loro forma ai legami a idrogeno, che si formano tra i gruppi $\mathrm{N{-}H}$ e gli atomi di ossigeno di punti diversi della catena e la ripiegano a elica o a foglietto. Il calore li rompe: l'albume dell'uovo che cuocendo diventa bianco e solido è fatto di proteine che hanno perso la loro forma. E nella cellulosa, la sostanza del legno e del cotone, i legami a idrogeno tra catene affiancate danno alle fibre la loro resistenza.

## Esempi svolti

```ad-example
Esempio 1: quali sostanze formano legami a idrogeno
Tra le molecole di quali di queste sostanze si formano legami a idrogeno: $\mathrm{HF}$, $\mathrm{H_2S}$, $\mathrm{NH_3}$, $\mathrm{CH_4}$, $\mathrm{CH_3OH}$?

Per ogni molecola si controllano le due condizioni.

- $\mathrm{HF}$: l'idrogeno è legato al fluoro, e il fluoro ha tre coppie solitarie. Sì.
- $\mathrm{H_2S}$: gli idrogeni sono legati allo zolfo, che non è tra i tre elementi. No.
- $\mathrm{NH_3}$: tre idrogeni legati all'azoto, che ha una coppia solitaria. Sì.
- $\mathrm{CH_4}$: gli idrogeni sono legati al carbonio, e non ci sono coppie solitarie. No.
- $\mathrm{CH_3OH}$: un idrogeno è legato all'ossigeno, che ha due coppie solitarie. Sì.

Formano legami a idrogeno $\mathrm{HF}$, $\mathrm{NH_3}$ e $\mathrm{CH_3OH}$.
```

```ad-example
Esempio 2: tre sostanze con gli stessi elettroni
Metti in ordine di temperatura di ebollizione crescente propano $\mathrm{C_3H_8}$, etere dimetilico $\mathrm{CH_3OCH_3}$ ed etanolo $\mathrm{CH_3CH_2OH}$.

Si contano gli elettroni, sommando i numeri atomici: il propano ne ha $3 \cdot 6 + 8 \cdot 1 = 26$; l'etere dimetilico e l'etanolo, che hanno la stessa formula $\mathrm{C_2H_6O}$, ne hanno $2 \cdot 6 + 6 \cdot 1 + 8 = 26$. Le forze di London sono simili nelle tre sostanze, e decide il resto.

- Il propano è apolare: solo forze di London.
- L'etere dimetilico è polare, ma non ha idrogeni legati all'ossigeno: forze di London e dipolo-dipolo.
- L'etanolo ha il gruppo $\mathrm{OH}$: forze di London, dipolo-dipolo e legami a idrogeno.

L'ordine è propano, etere dimetilico, etanolo. I valori misurati sono $-42$, $-25$ e $78\,^\circ\text{C}$: tra il primo e il secondo ci sono $17$ gradi, tra il secondo e il terzo più di $100$.
```

```ad-example
Esempio 3: i legami a idrogeno in un tratto di DNA
Un tratto di DNA è lungo $10$ coppie di basi: $6$ sono coppie adenina-timina e $4$ guanina-citosina. Quanti legami a idrogeno tengono uniti i due filamenti in quel tratto?

Ogni coppia A-T ha $2$ legami a idrogeno, ogni coppia G-C ne ha $3$:

$$6 \cdot 2 + 4 \cdot 3 = 12 + 12 = 24$$

I legami a idrogeno sono $24$. Un tratto della stessa lunghezza con più coppie G-C ne avrebbe di più, e per separare i suoi filamenti servirebbe una temperatura più alta.
```

```ad-example
Esempio 4: donatore, accettore o tutti e due
L'acetone ha formula $\mathrm{CH_3COCH_3}$: un atomo di ossigeno legato con un doppio legame al carbonio centrale, e sei idrogeni tutti legati a carboni. Forma legami a idrogeno tra le sue molecole? E con l'acqua?

Nessun idrogeno dell'acetone è legato a $\mathrm{F}$, $\mathrm{O}$ o $\mathrm{N}$: la molecola non può fare da donatore, e tra due molecole di acetone non si formano legami a idrogeno. Il suo ossigeno ha però due coppie solitarie, e può fare da accettore: una molecola d'acqua gli dona un idrogeno, $\mathrm{O{-}H} \cdots \mathrm{O}$.

Tra le sue molecole no; con l'acqua sì. Per questo l'acetone bolle a una temperatura bassa, $56\,^\circ\text{C}$, e allo stesso tempo si mescola con l'acqua in ogni proporzione.
```

## Le forze tra le molecole, in ordine

| Forza | Quando c'è | Intensità |
|---|---|---|
| London | sempre | cresce con il numero di elettroni; è la sola tra particelle apolari |
| Dipolo-dipolo | tra molecole polari | si somma alle forze di London |
| Legame a idrogeno | $\mathrm{H}$ legato a $\mathrm{F}$, $\mathrm{O}$, $\mathrm{N}$ e una coppia solitaria su $\mathrm{F}$, $\mathrm{O}$, $\mathrm{N}$ | la più intensa tra molecole neutre, da $10$ a $40\,\text{kJ/mol}$ |

Quando confronti due sostanze con molecole di dimensioni simili, quella che forma legami a idrogeno ha la temperatura di ebollizione più alta, poi viene quella polare, poi quella apolare. Tra molecole di dimensioni molto diverse il confronto va fatto con prudenza, perché le forze di London di una molecola grande possono superare i legami a idrogeno di una piccola: lo iodio, $\mathrm{I_2}$, è apolare e bolle a $184\,^\circ\text{C}$, più in alto dell'acqua.
