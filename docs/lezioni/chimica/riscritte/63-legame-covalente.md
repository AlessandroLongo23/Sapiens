# Il legame covalente

Il cloro che disinfetta l'acqua delle piscine è fatto di molecole $\mathrm{Cl_2}$, due atomi uguali legati tra loro. A ciascuno dei due manca un elettrone per completare l'ottetto, e nessuno dei due può strapparlo all'altro, perché lo attirano con la stessa forza. La soluzione è metterne in comune uno a testa. È il legame covalente, quello che tiene insieme le molecole: l'idrogeno, l'ossigeno e l'azoto dell'aria, l'acqua, il metano, e tutte le sostanze di cui sono fatti gli esseri viventi.

## Una coppia di elettroni in comune

L'atomo di idrogeno ha un solo elettrone, e gliene serve un secondo per avere il primo livello completo come l'elio (lo dice la lezione [Energia di legame e regola dell'ottetto](/materiale/scuola-superiore/chimica/i-legami-chimici/energia-di-legame-e-regola-dell-ottetto)). Quando due atomi di idrogeno si avvicinano, i due elettroni si dispongono nella zona tra i due nuclei, dove sono attratti da entrambi. Non appartengono più a un atomo solo: sono di tutti e due.

Un **legame covalente** è una coppia di elettroni messa in comune da due atomi. La coppia, attratta da tutti e due i nuclei, li tiene uniti, e conta nel livello esterno di ciascuno dei due.

```tikz
% nome: covalente-idrogeno-coppia-condivisa
% alt: Due atomi di idrogeno, ciascuno scritto come una H con un puntino accanto, si uniscono. Una freccia porta alla molecola scritta in due modi: prima con i due puntini in mezzo alle due H, disegnati in rosso, poi con un trattino tra le due H al posto dei due puntini
\begin{tikzpicture}
\node at (0,0) {H};
\fill (0.3,0) circle (1.3pt);
\node at (0.75,0) {$+$};
\fill (1.2,0) circle (1.3pt);
\node at (1.5,0) {H};
\draw[-{Stealth}] (2.0,0) -- (2.8,0);
\node at (3.3,0) {H};
\fill[red] (3.61,0) circle (1.3pt);
\fill[red] (3.79,0) circle (1.3pt);
\node at (4.1,0) {H};
\node at (5.0,0) {\small oppure};
\node at (6.0,0) {H};
\draw[thick] (6.25,0) -- (6.75,0);
\node at (7.0,0) {H};
\end{tikzpicture}
```

Contando la coppia condivisa, ogni idrogeno ha intorno due elettroni. La scrittura con i puntini è la **formula di Lewis** della molecola: i simboli degli atomi, con tutti gli elettroni di valenza disegnati come puntini. Una coppia in comune si può sostituire con un trattino, e la formula diventa $\mathrm{H{-}H}$.

Il legame covalente si forma di solito tra atomi di non metalli, uguali o diversi: atomi a cui mancano elettroni per l'ottetto e che non li cedono facilmente. Quando i due atomi sono uguali, come in $\mathrm{H_2}$ o in $\mathrm{Cl_2}$, attirano la coppia con la stessa forza e la coppia sta esattamente a metà: il legame si chiama **covalente puro**, o covalente apolare. Che cosa cambia quando gli atomi sono diversi lo dice la lezione [Legame covalente polare e legame dativo](/materiale/scuola-superiore/chimica/i-legami-chimici/legame-covalente-polare-e-legame-dativo).

## Coppie di legame e coppie solitarie

Il cloro è nel gruppo 17 e ha sette elettroni di valenza. Nel suo [simbolo di Lewis](/materiale/scuola-superiore/chimica/il-sistema-periodico/elettroni-di-valenza-e-simboli-di-lewis) sei sono a coppie e uno è da solo: è un **elettrone spaiato**. Due atomi di cloro mettono in comune i loro due elettroni spaiati.

```tikz
% nome: covalente-cloro-ottetti
% alt: La formula di Lewis della molecola di cloro. I due simboli Cl hanno in mezzo una coppia di puntini rossi, la coppia di legame, e ciascuno ha altre tre coppie di puntini neri, sopra, sotto e sul lato esterno: le coppie solitarie. Due cerchi tratteggiati, uno per atomo, racchiudono ciascuno otto puntini e si sovrappongono sulla coppia di legame, che sta dentro tutti e due
\begin{tikzpicture}
\node at (-0.42,0) {Cl};
\node at (0.42,0) {Cl};
\fill[red] (0,0.09) circle (1.3pt);
\fill[red] (0,-0.09) circle (1.3pt);
\foreach \p in {(-0.51,0.32),(-0.33,0.32),(-0.51,-0.32),(-0.33,-0.32),(-0.8,0.09),(-0.8,-0.09)} \fill \p circle (1.3pt);
\foreach \p in {(0.51,0.32),(0.33,0.32),(0.51,-0.32),(0.33,-0.32),(0.8,0.09),(0.8,-0.09)} \fill \p circle (1.3pt);
\draw[thin, dashed, blue] (-0.42,0) circle (0.58);
\draw[thin, dashed, blue] (0.42,0) circle (0.58);
\draw[thin] (0,0.3) -- (0,1.0);
\node[above] at (0,1.0) {\small coppia di legame};
\draw[thin] (0.95,-0.15) -- (1.5,-0.6);
\node[right] at (1.5,-0.65) {\small coppia solitaria};
\end{tikzpicture}
```

Nella molecola gli elettroni di valenza sono di due tipi. La **coppia di legame** è quella in comune, tra i due atomi. Le **coppie solitarie** appartengono a un atomo solo e non fanno legami: ogni cloro ne ha tre.

Per controllare l'ottetto di un atomo si contano le sue coppie solitarie e tutte le coppie di legame a cui partecipa, queste ultime per intero. Ogni cloro ha $6$ elettroni nelle coppie solitarie e $2$ nella coppia di legame: $6 + 2 = 8$.

```ad-warning
La coppia di legame conta per tutti e due gli atomi
Se la dividi a metà, un elettrone a testa, ogni cloro ne ha sette come prima e sembra che il legame non sia servito. Nel conto dell'ottetto la coppia in comune vale due elettroni per l'uno e due per l'altro. Gli elettroni della molecola, però, restano $14$: sette per atomo, nessuno in più.
```

```ad-example
Esempio 1: la molecola di fluoro
Scrivi la formula di Lewis di $\mathrm{F_2}$ e conta le coppie di legame e le coppie solitarie.

Il fluoro è nel gruppo 17: $7$ elettroni di valenza, uno dei quali spaiato. In tutto la molecola ha $2 \cdot 7 = 14$ elettroni di valenza.

I due elettroni spaiati formano una coppia di legame. Restano $14 - 2 = 12$ elettroni, cioè $6$ coppie solitarie, tre per atomo.

Controllo: ogni fluoro ha $3 \cdot 2 + 2 = 8$ elettroni. La formula è come quella del cloro, $\mathrm{F{-}F}$ con tre coppie solitarie su ogni atomo.
```

## Quanti legami forma un atomo

Un atomo forma di solito tanti legami covalenti quanti sono gli elettroni che gli mancano per l'ottetto, perché ogni legame gliene porta uno in più. Sono anche i suoi elettroni spaiati.

$$\text{numero di legami} = 8 - \text{elettroni di valenza}$$

| Elemento | Gruppo | Elettroni di valenza | Legami | Coppie solitarie |
|---|---|---|---|---|
| carbonio | 14 | $4$ | $4$ | $0$ |
| azoto | 15 | $5$ | $3$ | $1$ |
| ossigeno | 16 | $6$ | $2$ | $2$ |
| fluoro, cloro | 17 | $7$ | $1$ | $3$ |

L'idrogeno sta a parte: gli manca un solo elettrone per arrivare a due, forma un legame e non ha coppie solitarie.

```ad-example
Esempio 2: quanti legami per lo zolfo e per il fosforo
Lo zolfo è nel gruppo 16, il fosforo nel gruppo 15. Quanti legami covalenti formano di solito?

Lo zolfo ha $6$ elettroni di valenza: $8 - 6 = 2$ legami, come l'ossigeno che gli sta sopra. Infatti con l'idrogeno forma $\mathrm{H_2S}$.

Il fosforo ne ha $5$: $8 - 5 = 3$ legami, come l'azoto. Con l'idrogeno forma $\mathrm{PH_3}$.
```

La regola vale per i casi più comuni. Le eccezioni, come gli atomi del terzo periodo che superano l'ottetto, sono nella lezione [Le formule di Lewis delle molecole](/materiale/scuola-superiore/chimica/i-legami-chimici/le-formule-di-lewis-delle-molecole).

## Legami doppi e tripli

All'ossigeno mancano due elettroni. Se due atomi di ossigeno mettessero in comune una sola coppia, ciascuno arriverebbe a sette. Ne mettono in comune due: è un **legame doppio**, che si scrive con due trattini, $\mathrm{O{=}O}$. All'azoto ne mancano tre, e nella molecola $\mathrm{N_2}$ le coppie in comune sono tre: un **legame triplo**, $\mathrm{N{\equiv}N}$. Il legame con una sola coppia si chiama legame singolo, o semplice.

```tikz
% nome: covalente-ossigeno-azoto-lewis
% alt: Le formule di Lewis dell'ossigeno e dell'azoto, ciascuna scritta due volte, con i puntini e con i trattini. Nell'ossigeno i due atomi hanno in mezzo due coppie di puntini rossi, cioè un legame doppio, e ogni atomo ha due coppie solitarie. Nell'azoto i due atomi hanno in mezzo tre coppie di puntini rossi, cioè un legame triplo, e ogni atomo ha una coppia solitaria sul lato esterno
\begin{tikzpicture}
% ossigeno con i puntini
\node at (0,0) {O};
\node at (1,0) {O};
\foreach \p in {(0.41,0.09),(0.41,-0.09),(0.59,0.09),(0.59,-0.09)} \fill[red] \p circle (1.3pt);
\foreach \p in {(-0.09,0.3),(0.09,0.3),(-0.09,-0.3),(0.09,-0.3),(0.91,0.3),(1.09,0.3),(0.91,-0.3),(1.09,-0.3)} \fill \p circle (1.3pt);
% ossigeno con i trattini
\node at (2.6,0) {O};
\node at (3.6,0) {O};
\draw[thick] (2.85,0.05) -- (3.35,0.05);
\draw[thick] (2.85,-0.05) -- (3.35,-0.05);
\foreach \p in {(2.51,0.3),(2.69,0.3),(2.51,-0.3),(2.69,-0.3),(3.51,0.3),(3.69,0.3),(3.51,-0.3),(3.69,-0.3)} \fill \p circle (1.3pt);
\node at (5.6,0) {\small legame doppio};
% azoto con i puntini
\begin{scope}[shift={(0,-1.5)}]
\node at (0,0) {N};
\node at (1,0) {N};
\foreach \p in {(0.41,0.17),(0.41,0),(0.41,-0.17),(0.59,0.17),(0.59,0),(0.59,-0.17)} \fill[red] \p circle (1.3pt);
\foreach \p in {(-0.3,0.09),(-0.3,-0.09),(1.3,0.09),(1.3,-0.09)} \fill \p circle (1.3pt);
\node at (2.6,0) {N};
\node at (3.6,0) {N};
\draw[thick] (2.85,0.09) -- (3.35,0.09);
\draw[thick] (2.85,0) -- (3.35,0);
\draw[thick] (2.85,-0.09) -- (3.35,-0.09);
\foreach \p in {(2.3,0.09),(2.3,-0.09),(3.9,0.09),(3.9,-0.09)} \fill \p circle (1.3pt);
\node at (5.6,0) {\small legame triplo};
\end{scope}
\end{tikzpicture}
```

Il conto dell'ottetto è lo stesso di prima. Nell'ossigeno ogni atomo ha due coppie solitarie e due coppie di legame, $4 + 4 = 8$ elettroni. Nell'azoto ogni atomo ha una coppia solitaria e tre coppie di legame, $2 + 6 = 8$.

Nella figura qui sotto scegli due atomi e decidi tu quante coppie mettono in comune: sotto ogni atomo leggi quanti elettroni ha intorno, e se sono quelli giusti.

```interattivo
% nome: legame-covalente-condividi-coppie
% alt: Due atomi a scelta tra cinque coppie, idrogeno e idrogeno, cloro e cloro, ossigeno e ossigeno, azoto e azoto, idrogeno e cloro, disegnati con i simboli di Lewis. Due bottoni aggiungono o tolgono una coppia di elettroni in comune, da zero a tre: le coppie in comune compaiono in rosso tra i due simboli, e gli elettroni che restano a ciascun atomo sono i puntini neri intorno. Sotto ogni atomo si legge quanti elettroni ha intorno e se ha raggiunto l'ottetto, o i due elettroni nel caso dell'idrogeno. Quando tutti e due gli atomi sono a posto si leggono il tipo di legame, la sua lunghezza e la sua energia
```

Con una coppia in meno del necessario agli atomi mancano elettroni; con una in più ne hanno troppi. Il numero giusto è uno solo, ed è quello degli elettroni che mancavano a ciascun atomo: una coppia per il cloro, due per l'ossigeno, tre per l'azoto.

```ad-example
Esempio 3: perché l'azoto non si ferma a un legame singolo
Nella molecola $\mathrm{N_2}$, quanti elettroni avrebbe intorno ogni atomo con un legame singolo? E con uno doppio?

L'azoto ha $5$ elettroni di valenza. Con un legame singolo ogni atomo mette in comune un elettrone e ne tiene $4$ per sé: intorno ha $4 + 2 = 6$ elettroni.

Con un legame doppio ne tiene $3$ e ne ha $4$ in comune: $3 + 4 = 7$.

Con un legame triplo ne tiene $2$, una coppia solitaria, e ne ha $6$ in comune: $2 + 6 = 8$. Solo il legame triplo dà l'ottetto a tutti e due gli atomi.
```

```ad-note
Un limite della formula di Lewis dell'ossigeno
Nella formula di Lewis di $\mathrm{O_2}$ tutti gli elettroni sono a coppie. L'ossigeno liquido, però, è attratto da una calamita, e questo succede solo alle sostanze con elettroni spaiati. La formula di Lewis è un modello: prevede bene quanti legami ci sono e quanto sono forti, ma non tutto. Per spiegare il comportamento dell'ossigeno serve una teoria del legame più avanzata, che non fa parte di questo corso.
```

## Ordine, lunghezza ed energia di legame

Il numero di coppie di elettroni che due atomi mettono in comune si chiama **ordine di legame**: $1$ per un legame singolo, $2$ per un doppio, $3$ per un triplo.

Più coppie in comune vuol dire più carica negativa tra i due nuclei, che li attira con più forza e li tiene più vicini. Tra gli stessi due atomi, al crescere dell'ordine il legame diventa più corto e più forte.

| Legame | Ordine | Lunghezza (pm) | Energia (kJ/mol) |
|---|---|---|---|
| $\mathrm{C{-}C}$ | $1$ | $154$ | $348$ |
| $\mathrm{C{=}C}$ | $2$ | $134$ | $614$ |
| $\mathrm{C{\equiv}C}$ | $3$ | $120$ | $839$ |
| $\mathrm{N{-}N}$ | $1$ | $145$ | $163$ |
| $\mathrm{N{=}N}$ | $2$ | $125$ | $418$ |
| $\mathrm{N{\equiv}N}$ | $3$ | $110$ | $945$ |

```tikz
% nome: covalente-ordine-lunghezza-carbonio
% alt: Tre coppie di atomi di carbonio, una sotto l'altra, disegnate in scala. Nella prima i due atomi sono uniti da un trattino e distano 154 picometri; nella seconda da due trattini e distano 134 picometri; nella terza da tre trattini e distano 120 picometri. Accanto a ciascuna è scritta l'energia di legame: 348, 614 e 839 chilojoule per mole. Più trattini ci sono, più i due atomi sono vicini
\begin{tikzpicture}
% singolo: 154 pm = 3.08 cm
\draw[thin, dashed] (3.08,-0.3) -- (3.08,-2.65);
\draw[thick] (0,0) -- (3.08,0);
\draw[thick, fill=gray!20] (0,0) circle (0.3);
\draw[thick, fill=gray!20] (3.08,0) circle (0.3);
\node at (0,0) {C};
\node at (3.08,0) {C};
\node[right] at (3.9,0) {\small $154$ pm, $348$ kJ/mol};
% doppio: 134 pm = 2.68 cm
\begin{scope}[shift={(0,-1.1)}]
\draw[thick] (0,0.06) -- (2.68,0.06);
\draw[thick] (0,-0.06) -- (2.68,-0.06);
\draw[thick, fill=gray!20] (0,0) circle (0.3);
\draw[thick, fill=gray!20] (2.68,0) circle (0.3);
\node at (0,0) {C};
\node at (2.68,0) {C};
\node[right] at (3.9,0) {\small $134$ pm, $614$ kJ/mol};
\end{scope}
% triplo: 120 pm = 2.40 cm
\begin{scope}[shift={(0,-2.2)}]
\draw[thick] (0,0.1) -- (2.4,0.1);
\draw[thick] (0,0) -- (2.4,0);
\draw[thick] (0,-0.1) -- (2.4,-0.1);
\draw[thick, fill=gray!20] (0,0) circle (0.3);
\draw[thick, fill=gray!20] (2.4,0) circle (0.3);
\node at (0,0) {C};
\node at (2.4,0) {C};
\node[right] at (3.9,0) {\small $120$ pm, $839$ kJ/mol};
\end{scope}
\end{tikzpicture}
```

Con i suoi $945\,\text{kJ/mol}$ il legame triplo di $\mathrm{N_2}$ è uno dei più forti che esistano: per questo l'azoto dell'aria reagisce così poco.

```ad-warning
Un legame doppio non è forte il doppio
Il legame $\mathrm{C{=}C}$ ha un'energia di $614\,\text{kJ/mol}$, meno di $2 \cdot 348 = 696\,\text{kJ/mol}$. La seconda coppia di elettroni lega meno della prima. Il motivo è nella lezione [Teoria del legame di valenza: legami sigma e pi greco](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/teoria-del-legame-di-valenza-legami-sigma-e-pi-greco). Lo stesso vale per la lunghezza: il doppio legame è più corto del singolo, non la metà.
```

```ad-example
Esempio 4: riconoscere il legame dai dati
Due legami tra carbonio e ossigeno hanno lunghezza $143\,\text{pm}$ e $123\,\text{pm}$. Quale dei due è il legame doppio? Quale ha l'energia di legame maggiore?

Tra gli stessi due atomi il legame di ordine maggiore è più corto: il legame doppio $\mathrm{C{=}O}$ è quello di $123\,\text{pm}$, il singolo $\mathrm{C{-}O}$ quello di $143\,\text{pm}$.

Il legame più corto è anche il più forte: l'energia maggiore è quella del legame doppio.
```

## Dalle molecole biatomiche alle altre

Con le stesse regole si scrivono le formule di Lewis delle molecole più semplici con più di due atomi: ogni atomo forma i legami che gli servono per l'ottetto (l'idrogeno uno solo), e gli elettroni che non stanno nei legami restano come coppie solitarie.

```tikz
% nome: covalente-lewis-molecole-semplici
% alt: Le formule di Lewis di cinque molecole, con i legami disegnati come trattini e le coppie solitarie come coppie di puntini. Acqua: l'ossigeno legato a due idrogeni, con due coppie solitarie. Ammoniaca: l'azoto legato a tre idrogeni, con una coppia solitaria. Metano: il carbonio legato a quattro idrogeni, senza coppie solitarie. Diossido di carbonio: il carbonio al centro con due legami doppi, uno per ciascun ossigeno, e due coppie solitarie su ogni ossigeno. Cloruro di idrogeno: l'idrogeno legato al cloro, che ha tre coppie solitarie
\begin{tikzpicture}
% acqua
\node at (0,0) {O};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\foreach \p in {(-0.09,0.3),(0.09,0.3),(-0.09,-0.3),(0.09,-0.3)} \fill \p circle (1.3pt);
\node at (0,-1.2) {\small acqua};
% ammoniaca
\begin{scope}[shift={(3.2,0)}]
\node at (0,0) {N};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\node at (0,-0.75) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\draw[thick] (0,-0.22) -- (0,-0.53);
\foreach \p in {(-0.09,0.3),(0.09,0.3)} \fill \p circle (1.3pt);
\node at (0,-1.2) {\small ammoniaca};
\end{scope}
% metano
\begin{scope}[shift={(6.4,0)}]
\node at (0,0) {C};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\node at (0,-0.75) {H};
\node at (0,0.75) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\draw[thick] (0,-0.22) -- (0,-0.53);
\draw[thick] (0,0.22) -- (0,0.53);
\node at (0,-1.2) {\small metano};
\end{scope}
% diossido di carbonio
\begin{scope}[shift={(1.2,-2.5)}]
\node at (0,0) {C};
\node at (-0.9,0) {O};
\node at (0.9,0) {O};
\draw[thick] (-0.66,0.05) -- (-0.22,0.05);
\draw[thick] (-0.66,-0.05) -- (-0.22,-0.05);
\draw[thick] (0.22,0.05) -- (0.66,0.05);
\draw[thick] (0.22,-0.05) -- (0.66,-0.05);
\foreach \p in {(-0.99,0.3),(-0.81,0.3),(-0.99,-0.3),(-0.81,-0.3),(0.99,0.3),(0.81,0.3),(0.99,-0.3),(0.81,-0.3)} \fill \p circle (1.3pt);
\node at (0,-0.85) {\small diossido di carbonio};
\end{scope}
% cloruro di idrogeno
\begin{scope}[shift={(5.3,-2.5)}]
\node at (-0.4,0) {H};
\node at (0.45,0) {Cl};
\draw[thick] (-0.18,0) -- (0.16,0);
\foreach \p in {(0.36,0.32),(0.54,0.32),(0.36,-0.32),(0.54,-0.32),(0.82,0.09),(0.82,-0.09)} \fill \p circle (1.3pt);
\node at (0.1,-0.85) {\small cloruro di idrogeno};
\end{scope}
\end{tikzpicture}
```

```ad-example
Esempio 5: gli elettroni dell'acqua
Nella molecola $\mathrm{H_2O}$ quante sono le coppie di legame e quante le coppie solitarie? Ogni atomo è a posto?

Gli elettroni di valenza sono $6$ dell'ossigeno e $1$ per ogni idrogeno: $6 + 2 \cdot 1 = 8$, cioè $4$ coppie.

L'ossigeno forma due legami, uno per idrogeno: $2$ coppie di legame. Le altre $2$ coppie restano sull'ossigeno come coppie solitarie.

L'ossigeno ha intorno $2 \cdot 2 + 2 \cdot 2 = 8$ elettroni; ogni idrogeno ha i $2$ della sua coppia di legame.
```

```ad-example
Esempio 6: il diossido di carbonio
Nel $\mathrm{CO_2}$ il carbonio sta al centro, legato ai due ossigeni. Che legami servono perché tutti abbiano l'ottetto?

Il carbonio ha $4$ elettroni di valenza e deve formare $4$ legami; ogni ossigeno ne ha $6$ e deve formarne $2$.

Con due legami doppi, uno per ossigeno, i conti tornano: il carbonio ha $4$ coppie di legame, cioè $8$ elettroni; ogni ossigeno ha $2$ coppie di legame e $2$ coppie solitarie, $4 + 4 = 8$.

Controllo sul totale: gli elettroni di valenza sono $4 + 2 \cdot 6 = 16$, cioè $8$ coppie: $4$ di legame e $4$ solitarie.
```

In queste molecole gli atomi legati sono diversi, e la coppia in comune non sta a metà: il legame è ancora covalente, ma non più puro. È l'argomento della [prossima lezione](/materiale/scuola-superiore/chimica/i-legami-chimici/legame-covalente-polare-e-legame-dativo).

La formula di Lewis dice quali atomi sono legati e con quante coppie, non che forma ha la molecola: nel disegno l'acqua è in fila e il metano è una croce, ma la prima è piegata e il secondo è un tetraedro. La forma si ricava con la teoria VSEPR, nella lezione [La geometria delle molecole](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/la-geometria-delle-molecole).
