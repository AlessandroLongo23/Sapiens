# L'entropia

Una tazza di tè bollente lasciata sul tavolo si raffredda, e l'aria della stanza si scalda un po'. Il contrario non succede mai: il tè non si scalda da solo prendendo calore dalla stanza più fredda, anche se l'energia si conserverebbe ugualmente. Il [primo principio](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica) non sa distinguere i due versi. Li distingue una grandezza nuova, l'entropia, che in tutte le trasformazioni che avvengono da sole aumenta.

## Il calore diviso per la temperatura

L'idea nasce dalle macchine termiche. Per una [macchina reversibile](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/il-teorema-di-carnot-e-il-ciclo-di-carnot) che lavora tra una sorgente calda a temperatura $T_c$ e una fredda a temperatura $T_f$, i calori scambiati stanno tra loro come le temperature assolute, $Q_f / Q_c = T_f / T_c$, cioè

$$\frac{Q_c}{T_c} = \frac{Q_f}{T_f}$$

I due calori sono diversi, ma i rapporti tra calore e temperatura sono uguali. Una macchina reale, irreversibile, ha un rendimento più basso: a parità di $Q_c$ cede alla sorgente fredda un calore $Q_f$ più grande, e allora $Q_f / T_f > Q_c / T_c$.

Le due relazioni si scrivono in una sola se ai calori si dà il segno del primo principio, positivo per il calore assorbito dal sistema e negativo per quello ceduto. La macchina assorbe $Q_1 = +Q_c$ alla temperatura $T_1 = T_c$ e cede $Q_2 = -Q_f$ alla temperatura $T_2 = T_f$, quindi

$$\frac{Q_1}{T_1} + \frac{Q_2}{T_2} \le 0$$

con l'uguale per la macchina reversibile. Il risultato vale per qualsiasi ciclo, anche con molte sorgenti, ed è la **disuguaglianza di Clausius**, che enunciamo senza dimostrarla: se in una trasformazione ciclica un sistema scambia i calori $Q_1, Q_2, \ldots, Q_n$ con sorgenti alle temperature $T_1, T_2, \ldots, T_n$, allora

$$\frac{Q_1}{T_1} + \frac{Q_2}{T_2} + \ldots + \frac{Q_n}{T_n} \le 0$$

e la somma vale zero se il ciclo è reversibile.

## La definizione di entropia

Una grandezza la cui somma è zero su ogni ciclo reversibile si comporta come la variazione di una [funzione di stato](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/sistemi-termodinamici-e-principio-zero). La funzione si chiama **entropia**, si indica con $S$ e si definisce attraverso la sua variazione. Se un sistema passa dallo stato $A$ allo stato $B$ con una trasformazione reversibile, a temperatura costante $T$, scambiando il calore $Q$, la sua variazione di entropia è

$$\Delta S = S_B - S_A = \frac{Q}{T}$$

Se durante la trasformazione la temperatura cambia, si divide la trasformazione in tanti tratti, ognuno a temperatura quasi costante, e si sommano i contributi:

$$\Delta S = \left(\frac{Q_1}{T_1} + \frac{Q_2}{T_2} + \ldots + \frac{Q_n}{T_n}\right)_{rev}$$

Il pedice ricorda che la somma va calcolata lungo una trasformazione reversibile. In queste formule $Q$ ha il segno: è positivo se il sistema assorbe calore, e allora la sua entropia aumenta; è negativo se lo cede, e l'entropia diminuisce. La temperatura è quella assoluta, in kelvin, sempre positiva. L'unità di misura dell'entropia è il joule al kelvin, $\text{J/K}$.

L'entropia è una funzione di stato: $\Delta S$ dipende solo dagli stati $A$ e $B$, non dalla trasformazione che li collega. Per vederlo, prendi due trasformazioni reversibili diverse, I e II, che portano da $A$ a $B$. Andando da $A$ a $B$ lungo la I e tornando da $B$ ad $A$ lungo la II percorsa al contrario si ottiene un ciclo reversibile, per il quale la somma dei $Q/T$ è zero. Nel ritorno tutti i calori cambiano segno, quindi la somma lungo la I meno la somma lungo la II fa zero: le due somme sono uguali.

Come per l'[energia potenziale](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/forze-conservative-ed-energia-potenziale), la definizione fissa solo le differenze. Nei problemi si calcola sempre $\Delta S$.

```ad-warning
In kelvin, e con il segno del calore
Al denominatore va la temperatura assoluta: il ghiaccio fonde a $273\,\text{K}$, e con $0\,^\circ\text{C}$ la divisione non avrebbe senso. Al numeratore il calore ha il segno: un corpo che cede calore ha $Q < 0$ e la sua entropia diminuisce.
```

## I passaggi di stato

Durante un [passaggio di stato](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/i-passaggi-di-stato-e-il-calore-latente) la temperatura resta costante, quindi la definizione si applica direttamente. Una massa $m$ che fonde alla temperatura $T$ assorbe il calore $Q = L_f\,m$, e

$$\Delta S = \frac{L_f\,m}{T}$$

Per la vaporizzazione al posto di $L_f$ c'è $L_v$. Nei passaggi inversi, solidificazione e condensazione, la sostanza cede lo stesso calore e la variazione di entropia è la stessa con il segno meno.

```ad-example
Esempio 1: un blocco di ghiaccio che fonde
Un blocco di ghiaccio di $0{,}250\,\text{kg}$, a $0\,^\circ\text{C}$, fonde completamente. Di quanto varia la sua entropia? Il calore latente di fusione del ghiaccio è $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$.

La temperatura di fusione è $T = 273\,\text{K}$. Il ghiaccio assorbe il calore

$$Q = L_f\,m = 3{,}34 \cdot 10^5\,\text{J/kg} \cdot 0{,}250\,\text{kg} = 8{,}35 \cdot 10^4\,\text{J}$$

che è positivo, e la variazione di entropia è

$$\Delta S = \frac{Q}{T} = \frac{8{,}35 \cdot 10^4\,\text{J}}{273\,\text{K}} = 305{,}8\ldots\,\text{J/K} \approx 306\,\text{J/K}$$

Se la stessa acqua tornasse ghiaccio a $0\,^\circ\text{C}$, cederebbe $8{,}35 \cdot 10^4\,\text{J}$ e la sua entropia varierebbe di $-306\,\text{J/K}$.
```

## L'espansione isoterma di un gas perfetto

Un gas perfetto che si espande a temperatura costante dal volume $V_A$ al volume $V_B$ non cambia la sua [energia interna](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/l-energia-interna), che dipende solo dalla temperatura. Tutto il calore che assorbe diventa lavoro, e per l'[isoterma](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma) reversibile

$$Q = W = n\,R\,T \ln\frac{V_B}{V_A}$$

Dividendo per $T$ la temperatura si semplifica:

$$\Delta S = n\,R \ln\frac{V_B}{V_A}$$

Il simbolo $\ln$ è il [logaritmo](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta) naturale, un tasto della calcolatrice. Se il gas si espande, $V_B > V_A$, il logaritmo è positivo e l'entropia aumenta; se viene compresso il logaritmo è negativo e l'entropia diminuisce.

```ad-example
Esempio 2: un gas che triplica il volume
$2{,}00\,\text{mol}$ di gas perfetto si espandono a temperatura costante, $T = 300\,\text{K}$, da $10{,}0\,\text{L}$ a $30{,}0\,\text{L}$, restando a contatto con una sorgente a $300\,\text{K}$. Quanto calore assorbe il gas? Di quanto varia la sua entropia?

Il rapporto tra i volumi è $V_B / V_A = 30{,}0 / 10{,}0 = 3{,}00$, e non serve convertire i litri perché le unità si semplificano. Con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$:

$$Q = n\,R\,T \ln\frac{V_B}{V_A} = 2{,}00\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 300\,\text{K} \cdot \ln 3{,}00 = 5477\ldots\,\text{J} \approx 5{,}48 \cdot 10^3\,\text{J}$$

$$\Delta S = n\,R \ln\frac{V_B}{V_A} = 2{,}00\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot \ln 3{,}00 = 18{,}25\ldots\,\text{J/K} \approx 18{,}3\,\text{J/K}$$

Lo stesso risultato si trova dividendo: $5477\,\text{J} / 300\,\text{K} \approx 18{,}3\,\text{J/K}$.

Nel piano pressione-volume la trasformazione è il tratto di isoterma da $A$ a $B$; l'area colorata è il lavoro, uguale al calore assorbito.
```

```tikz
% nome: isoterma-espansione-entropia
% alt: Piano pressione-volume con il volume in litri in ascissa e la pressione in unità di 10 alla quinta pascal in ordinata. Un tratto di isoterma a 300 kelvin scende dallo stato A, a 10 litri e circa 5 per 10 alla quinta pascal, allo stato B, a 30 litri e circa 1,7 per 10 alla quinta pascal. L'area sotto la curva tra A e B è colorata e rappresenta il lavoro, uguale al calore assorbito
% svg: isoterma-espansione-entropia-d9564c52.svg 271x213
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=1.5, ystep=0.8] (5.25,4.4);
\fill[orange!25] (1.5,0) -- plot[domain=1.5:4.5, samples=40] (\x,{5.983/\x}) -- (4.5,0) -- cycle;
\draw[->] (-0.2,0) -- (5.6,0) node[right] {\small $V$ (L)};
\draw[->] (0,-0.2) -- (0,4.8) node[right] {\small $p$ ($10^5$ Pa)};
\foreach \x/\l in {1.5/10,3/20,4.5/30} \node[below] at (\x,0) {\small $\l$};
\foreach \y/\l in {0.8/1,1.6/2,2.4/3,3.2/4,4/5} \node[left] at (0,\y) {\small $\l$};
\draw[thick, blue, domain=1.5:4.5, samples=40] plot (\x,{5.983/\x});
\draw[dashed, thin] (1.5,0) -- (1.5,3.989);
\draw[dashed, thin] (4.5,0) -- (4.5,1.330);
\fill (1.5,3.989) circle (1.5pt) node[above right] {$A$};
\fill (4.5,1.330) circle (1.5pt) node[above right] {$B$};
\node at (3,0.7) {\small $W = Q$};
\end{tikzpicture}
```

## Stessi stati, stessa variazione di entropia

Supponi ora che lo stesso gas passi da $10{,}0\,\text{L}$ a $30{,}0\,\text{L}$ in un altro modo. Il gas è chiuso in una parte di un recipiente isolato, separata dal resto, che è vuoto, da una parete; la parete viene tolta e il gas invade tutto il recipiente. È un'**espansione libera**: il gas non spinge niente, quindi $W = 0$; il recipiente è isolato, quindi $Q = 0$; l'energia interna non cambia e per un gas perfetto non cambia neanche la temperatura. Lo stato finale è lo stesso dell'esempio 2.

```tikz
% nome: espansione-libera-e-isoterma
% alt: Due modi di portare un gas dallo stesso stato iniziale allo stesso stato finale. In alto l'espansione isoterma reversibile: un cilindro con un pistone, il gas occupa un terzo del cilindro e poi tutto, mentre assorbe il calore Q da una sorgente. In basso l'espansione libera: un recipiente isolato diviso da una parete, il gas occupa un terzo e il resto è vuoto; tolta la parete il gas occupa tutto il recipiente, senza scambiare calore
% svg: espansione-libera-e-isoterma-c7525d85.svg 289x171
\begin{tikzpicture}
\draw[thick] (0,2.2) rectangle (2.7,3.3);
\fill[blue!10] (0.02,2.22) rectangle (0.9,3.28);
\draw[thick, fill=gray!20] (0.9,2.2) rectangle (1.02,3.3);
\draw[thick] (1.02,2.75) -- (2.95,2.75);
\foreach \p in {(0.2,2.5),(0.45,3.05),(0.7,2.6),(0.3,2.85),(0.65,3.0),(0.5,2.4)} \fill[blue!60!black] \p circle (1.2pt);
\draw[-{Stealth}, thick] (3.2,2.75) -- (3.9,2.75);
\draw[thick] (4.2,2.2) rectangle (6.9,3.3);
\fill[blue!10] (4.22,2.22) rectangle (6.7,3.28);
\draw[thick, fill=gray!20] (6.7,2.2) rectangle (6.82,3.3);
\draw[thick] (6.82,2.75) -- (7.4,2.75);
\foreach \p in {(4.5,2.5),(5.3,3.05),(6.1,2.6),(4.9,2.85),(6.4,3.0),(5.7,2.4)} \fill[blue!60!black] \p circle (1.2pt);
\draw[-{Stealth}, thick, orange!90!black] (5.55,1.55) -- (5.55,2.2) node[midway, right] {$Q$};
\node at (1.35,3.6) {\small isoterma reversibile};
\draw[thick] (0,0) rectangle (2.7,1.1);
\fill[blue!10] (0.02,0.02) rectangle (0.9,1.08);
\draw[thick] (0.9,0) -- (0.9,1.1);
\foreach \p in {(0.2,0.3),(0.45,0.85),(0.7,0.4),(0.3,0.65),(0.65,0.8),(0.5,0.2)} \fill[blue!60!black] \p circle (1.2pt);
\node at (1.8,0.55) {\small vuoto};
\draw[-{Stealth}, thick] (3.2,0.55) -- (3.9,0.55);
\draw[thick] (4.2,0) rectangle (6.9,1.1);
\fill[blue!10] (4.22,0.02) rectangle (6.88,1.08);
\foreach \p in {(4.5,0.3),(5.3,0.85),(6.1,0.4),(4.9,0.65),(6.5,0.8),(5.7,0.2)} \fill[blue!60!black] \p circle (1.2pt);
\node at (1.35,-0.35) {\small espansione libera};
\end{tikzpicture}
```

Siccome l'entropia è una funzione di stato, la variazione di entropia del gas è la stessa nei due casi: $\Delta S = n\,R \ln(V_B / V_A) = 18{,}3\,\text{J/K}$, anche se nell'espansione libera il gas non ha scambiato calore.

```ad-warning
Con una trasformazione irreversibile non si divide il calore scambiato
Nell'espansione libera $Q = 0$, ma la variazione di entropia non è zero. La formula $\Delta S = Q/T$ vale lungo una trasformazione reversibile. Per una trasformazione irreversibile si cerca una trasformazione reversibile che colleghi gli stessi due stati (qui l'isoterma) e si fa il conto su quella.
```

Due casi si incontrano spesso. In una [trasformazione adiabatica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/la-trasformazione-adiabatica) reversibile il sistema non scambia calore, quindi $\Delta S = 0$: l'entropia resta costante. In un ciclo il sistema torna allo stato iniziale, quindi la variazione di entropia del sistema è zero, qualunque sia il ciclo.

## Un corpo che si scalda

Quando un corpo si scalda la temperatura cambia mentre il calore entra, e non si può dividere tutto il calore per una sola temperatura. La somma dei tanti contributi $Q_i / T_i$ si calcola con strumenti di matematica del quinto anno; il risultato, che qui enunciamo, per un corpo di massa $m$ e [calore specifico](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico) $c$ che passa dalla temperatura $T_A$ alla temperatura $T_B$ è

$$\Delta S = m\,c \ln\frac{T_B}{T_A}$$

con le temperature in kelvin. Se il corpo si scalda il rapporto è maggiore di 1 e l'entropia aumenta, se si raffredda diminuisce.

```ad-example
Esempio 3: mezzo litro d'acqua sul fornello
$0{,}500\,\text{kg}$ di acqua vengono scaldati da $20\,^\circ\text{C}$ a $90\,^\circ\text{C}$. Di quanto varia l'entropia dell'acqua? Il calore specifico dell'acqua è $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$.

Le temperature assolute sono $T_A = 293\,\text{K}$ e $T_B = 363\,\text{K}$. Un grado Celsius e un kelvin sono intervalli uguali, quindi $c = 4186\,\text{J/(kg}\cdot\text{K)}$.

$$\Delta S = m\,c \ln\frac{T_B}{T_A} = 0{,}500\,\text{kg} \cdot 4186\,\text{J/(kg}\cdot\text{K)} \cdot \ln\frac{363}{293} = 2093\,\text{J/K} \cdot 0{,}2142\ldots \approx 448\,\text{J/K}$$

Un controllo: l'acqua assorbe $Q = c\,m\,\Delta t = 1{,}465 \cdot 10^5\,\text{J}$. Dividendo per la temperatura a metà strada, $328\,\text{K}$, si trova $447\,\text{J/K}$, quasi lo stesso valore. Il conto con una temperatura sola è un'approssimazione, buona quando le due temperature sono vicine.
```

## L'entropia dell'universo

Finora abbiamo guardato un sistema alla volta. In una trasformazione però il sistema scambia calore con l'ambiente, e anche l'entropia dell'ambiente cambia. La somma delle due variazioni è la variazione di entropia dell'**universo**, parola che in termodinamica indica il sistema insieme a tutto l'ambiente con cui interagisce:

$$\Delta S_{univ} = \Delta S_{sistema} + \Delta S_{ambiente}$$

Il caso più semplice è il passaggio spontaneo di calore. Due sorgenti, una calda a temperatura $T_c$ e una fredda a temperatura $T_f$, vengono collegate da una sbarra di metallo, e una quantità di calore $Q$ passa dalla calda alla fredda. Una sorgente è un corpo così grande che la sua temperatura non cambia: la sua variazione di entropia è il calore scambiato diviso per la sua temperatura. La sorgente calda cede calore, la fredda lo assorbe:

$$\Delta S_c = -\frac{Q}{T_c} \qquad\qquad \Delta S_f = +\frac{Q}{T_f}$$

```tikz
% nome: calore-due-sorgenti-entropia
% alt: Due sorgenti affiancate collegate da una sbarra: a sinistra la sorgente calda a temperatura Tc, a destra la sorgente fredda a temperatura Tf. Una freccia indica il calore Q che passa dalla calda alla fredda. Sotto la sorgente calda è scritta la sua variazione di entropia, meno Q diviso Tc; sotto la fredda, più Q diviso Tf
% svg: calore-due-sorgenti-entropia-ed446a42.svg 249x116
\begin{tikzpicture}
\draw[thick, fill=red!15] (0,0) rectangle (2,1.4);
\draw[thick, fill=blue!10] (4.4,0) rectangle (6.4,1.4);
\draw[thick, fill=gray!20] (2,0.55) rectangle (4.4,0.85);
\node at (1,0.7) {$T_c$};
\node at (5.4,0.7) {$T_f$};
\draw[-{Stealth}, thick, orange!90!black] (2.5,1.2) -- (3.9,1.2) node[midway, above] {$Q$};
\node at (1,-0.7) {$\displaystyle \Delta S_c = -\frac{Q}{T_c}$};
\node at (5.4,-0.7) {$\displaystyle \Delta S_f = +\frac{Q}{T_f}$};
\end{tikzpicture}
```

La sbarra alla fine è nello stato in cui era all'inizio, e la sua entropia non è cambiata. Per l'universo

$$\Delta S_{univ} = \frac{Q}{T_f} - \frac{Q}{T_c}$$

Lo stesso calore è diviso per una temperatura più piccola nel termine positivo, quindi la somma è positiva: la sorgente fredda guadagna più entropia di quanta ne perde la calda.

```ad-example
Esempio 4: il calore passa da una sorgente all'altra
$1200\,\text{J}$ di calore passano da una sorgente a $400\,\text{K}$ a una sorgente a $300\,\text{K}$. Di quanto varia l'entropia di ciascuna sorgente, e quella dell'universo?

I dati sono $Q = 1200\,\text{J}$, $T_c = 400\,\text{K}$ e $T_f = 300\,\text{K}$.

$$\Delta S_c = -\frac{Q}{T_c} = -\frac{1200\,\text{J}}{400\,\text{K}} = -3{,}00\,\text{J/K} \qquad \Delta S_f = +\frac{Q}{T_f} = +\frac{1200\,\text{J}}{300\,\text{K}} = +4{,}00\,\text{J/K}$$

$$\Delta S_{univ} = \Delta S_c + \Delta S_f = -3{,}00\,\text{J/K} + 4{,}00\,\text{J/K} = +1{,}00\,\text{J/K}$$

Se il calore andasse nel verso opposto, dalla fredda alla calda, i due segni si scambierebbero e l'entropia dell'universo diminuirebbe di $1{,}00\,\text{J/K}$.
```

```tikz
% nome: barre-entropia-due-sorgenti
% alt: Tre barre verticali su una linea dello zero. La prima, verso il basso, è la variazione di entropia della sorgente calda, meno 3,00 joule al kelvin; la seconda, verso l'alto, quella della sorgente fredda, più 4,00; la terza, verso l'alto e più corta, quella dell'universo, più 1,00
% svg: barre-entropia-due-sorgenti-1289c1d5.svg 209x178
\begin{tikzpicture}
\draw[thick, fill=red!15] (0.5,0) rectangle (1.3,-1.5);
\draw[thick, fill=blue!10] (2.3,0) rectangle (3.1,2);
\draw[thick, fill=orange!25] (4.1,0) rectangle (4.9,0.5);
\draw[thick] (0,0) -- (5.4,0);
\node[above] at (0.9,0) {\small $\Delta S_c$};
\node[below] at (0.9,-1.5) {\small $-3{,}00$ J/K};
\node[below] at (2.7,0) {\small $\Delta S_f$};
\node[above] at (2.7,2) {\small $+4{,}00$ J/K};
\node[below] at (4.5,0) {\small $\Delta S_{univ}$};
\node[above] at (4.5,0.5) {\small $+1{,}00$ J/K};
\end{tikzpicture}
```

Nella figura qui sotto scegli le temperature di due sorgenti che si scambiano $1200\,\text{J}$ di calore, e guardi le tre barre. La domanda è: che cosa succede all'entropia dell'universo quando le due temperature si avvicinano? E se il calore andasse dal freddo al caldo?

```interattivo
% nome: entropia-universo-due-sorgenti
% alt: Due sorgenti collegate da una sbarra, con due cursori per le loro temperature in kelvin e una freccia che mostra il verso dei 1200 joule di calore che passano. Un selettore sceglie se il calore va dalla sorgente calda alla fredda o al contrario. Accanto, tre barre con il segno: la variazione di entropia della sorgente 1, quella della sorgente 2 e quella dell'universo. Sotto sono scritti i tre valori in joule al kelvin
```

Quando le temperature si avvicinano le due barre delle sorgenti diventano quasi uguali e opposte, e la barra dell'universo si accorcia: con $350\,\text{K}$ e $340\,\text{K}$ gli stessi $1200\,\text{J}$ danno appena $+0{,}10\,\text{J/K}$. Con temperature uguali la barra sparirebbe, ma allora il calore non passerebbe più da solo. Se il verso si inverte la barra dell'universo va sotto lo zero, ed è il caso che non si osserva mai.

## Il secondo principio con l'entropia

Quello che vale per le due sorgenti vale in generale, e si dimostra a partire dalla disuguaglianza di Clausius. In ogni trasformazione l'entropia dell'universo aumenta oppure, al limite, resta costante:

$$\Delta S_{univ} \ge 0$$

- nelle trasformazioni **irreversibili**, cioè in tutte quelle reali, $\Delta S_{univ} > 0$;
- nelle trasformazioni **reversibili**, che sono un caso limite ideale, $\Delta S_{univ} = 0$;
- una trasformazione con $\Delta S_{univ} < 0$ non può avvenire.

È il secondo principio della termodinamica scritto con l'entropia, equivalente agli [enunciati di Kelvin e di Clausius](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/gli-enunciati-di-kelvin-e-di-clausius). L'esempio 4 mostra il legame con il secondo: il passaggio di calore dal freddo al caldo, come unico risultato, farebbe diminuire l'entropia dell'universo. Un sistema isolato non scambia niente con l'ambiente, quindi è l'universo di sé stesso: la sua entropia non può diminuire.

```ad-warning
L'entropia di un sistema può diminuire
A non diminuire mai è l'entropia dell'universo, non quella di ogni sua parte. L'acqua che gela nel congelatore perde entropia (nell'esempio 1, $-306\,\text{J/K}$), ma il calore che cede fa aumentare di più l'entropia di ciò che la circonda: se l'interno del congelatore è a $255\,\text{K}$ guadagna $8{,}35 \cdot 10^4\,\text{J} / 255\,\text{K} \approx 327\,\text{J/K}$, e per l'universo il bilancio è circa $+22\,\text{J/K}$.
```

Lo stesso bilancio si fa per una macchina termica. In un ciclo il fluido della macchina torna allo stato iniziale e la sua entropia non cambia; cambiano quelle delle sorgenti. La calda cede $Q_c$, la fredda assorbe $Q_f$:

$$\Delta S_{univ} = \frac{Q_f}{T_f} - \frac{Q_c}{T_c}$$

Per una macchina reversibile i due termini sono uguali e $\Delta S_{univ} = 0$. Per una macchina reale la differenza è positiva.

```ad-example
Esempio 5: l'entropia prodotta da una macchina reale
Una macchina termica lavora tra una sorgente a $500\,\text{K}$ e una a $300\,\text{K}$. In ogni ciclo assorbe $2000\,\text{J}$ dalla sorgente calda e compie un lavoro di $600\,\text{J}$. Di quanto aumenta l'entropia dell'universo in un ciclo? Quanto lavoro in più avrebbe prodotto una macchina reversibile con lo stesso calore?

Il calore ceduto alla sorgente fredda è $Q_f = Q_c - W = 2000\,\text{J} - 600\,\text{J} = 1400\,\text{J}$.

$$\Delta S_{univ} = \frac{Q_f}{T_f} - \frac{Q_c}{T_c} = \frac{1400\,\text{J}}{300\,\text{K}} - \frac{2000\,\text{J}}{500\,\text{K}} = 4{,}667\,\text{J/K} - 4{,}000\,\text{J/K} = 0{,}667\,\text{J/K} \approx 0{,}67\,\text{J/K}$$

Una macchina reversibile tra le stesse sorgenti ha rendimento $\eta = 1 - T_f/T_c = 1 - 300/500 = 0{,}400$ e con $2000\,\text{J}$ produce $W_{rev} = 0{,}400 \cdot 2000\,\text{J} = 800\,\text{J}$: la macchina reale ne produce $200\,\text{J}$ in meno.
```

I $200\,\text{J}$ mancanti dell'esempio 5 sono legati all'entropia prodotta. La macchina reversibile produce $W_{rev} = Q_c\,(1 - T_f/T_c)$, quella reale $W = Q_c - Q_f$, e la differenza è

$$W_{rev} - W = Q_f - Q_c\,\frac{T_f}{T_c} = T_f \left(\frac{Q_f}{T_f} - \frac{Q_c}{T_c}\right) = T_f\,\Delta S_{univ}$$

Nell'esempio, con una cifra in più nel passaggio, $300\,\text{K} \cdot 0{,}667\,\text{J/K} = 200\,\text{J}$. L'energia non è sparita, perché è finita come calore nella sorgente fredda, ma non si può più trasformare in lavoro. Per questo si dice che l'aumento di entropia misura il degrado dell'energia: ogni trasformazione irreversibile lascia la stessa quantità di energia, in una forma meno utilizzabile.

Che cosa sia l'entropia a livello delle molecole, e perché aumenti, è l'argomento della lezione [Entropia e disordine](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/entropia-e-disordine).
