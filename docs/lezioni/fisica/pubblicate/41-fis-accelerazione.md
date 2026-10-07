# L'accelerazione

Un'utilitaria passa da $0$ a $100\,\text{km/h}$ in circa $12\,\text{s}$, un'auto sportiva nello stesso tempo può arrivarci in $4\,\text{s}$. Tutte e due alla fine vanno alla stessa velocità, ma la sportiva la cambia più in fretta. Quanto rapidamente cambia la velocità lo misura l'accelerazione, che dice anche se un corpo sta andando sempre più veloce o sta frenando.

## L'accelerazione media

Un corpo che si muove su una retta ha la velocità $v_1$ all'istante $t_1$ e la velocità $v_2$ all'istante $t_2$. La sua **accelerazione media** nell'intervallo è la variazione di velocità divisa l'intervallo di tempo:

$$a_m = \frac{\Delta v}{\Delta t} = \frac{v_2 - v_1}{t_2 - t_1}$$

Le velocità sono quelle istantanee della lezione [La velocità media e istantanea](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-velocita-media-e-istantanea), con il loro segno. Come la velocità, anche l'accelerazione è una grandezza vettoriale: sulla retta basta un numero con il segno.

## L'unità di misura

Nel Sistema Internazionale una velocità si misura in $\text{m/s}$ e un tempo in $\text{s}$, quindi l'accelerazione si misura in metri al secondo per secondo, cioè metri al secondo quadrato:

$$[a] = \frac{\text{m/s}}{\text{s}} = \frac{\text{m}}{\text{s}^2}$$

Un'accelerazione di $2\,\text{m/s}^2$ vuol dire che la velocità cresce di $2\,\text{m/s}$ in ogni secondo: se il corpo va a $4\,\text{m/s}$, dopo un secondo va a $6\,\text{m/s}$, dopo due a $8\,\text{m/s}$.

```ad-example
Esempio 1: uno scooter che parte dal semaforo
Uno scooter passa da $4{,}0\,\text{m/s}$ a $16\,\text{m/s}$ in $6{,}0\,\text{s}$. Qual è la sua accelerazione media?

$$a_m = \frac{v_2 - v_1}{\Delta t} = \frac{16\,\text{m/s} - 4{,}0\,\text{m/s}}{6{,}0\,\text{s}} = \frac{12\,\text{m/s}}{6{,}0\,\text{s}} = 2{,}0\,\text{m/s}^2$$

In media la velocità dello scooter cresce di $2{,}0\,\text{m/s}$ ogni secondo.
```

```ad-warning
La velocità finale non è la variazione
Il conto $16\,\text{m/s} / 6{,}0\,\text{s} \approx 2{,}7\,\text{m/s}^2$ è sbagliato: nella formula va la variazione della velocità, $v_2 - v_1$, non la velocità finale. Le due cose coincidono solo quando il corpo parte da fermo.
```

```ad-example
Esempio 2: da 0 a 100 all'ora
Un'auto passa da ferma a $100\,\text{km/h}$ in $8{,}0\,\text{s}$. Qual è la sua accelerazione media?

La velocità va prima portata in $\text{m/s}$, dividendo per $3{,}6$:

$$v_2 = \frac{100}{3{,}6}\,\text{m/s} = 27{,}77\ldots\,\text{m/s}$$

$$a_m = \frac{27{,}78\,\text{m/s} - 0\,\text{m/s}}{8{,}0\,\text{s}} = 3{,}47\ldots\,\text{m/s}^2 \approx 3{,}5\,\text{m/s}^2$$
```

```ad-warning
Chilometri all'ora divisi per secondi
Il conto $100 / 8{,}0 = 12{,}5$ non dà $12{,}5\,\text{m/s}^2$: dà $12{,}5$ chilometri all'ora in ogni secondo, un'unità che non è quella del Sistema Internazionale. Prima di dividere, la velocità si porta in $\text{m/s}$; il controllo è che $12{,}5 / 3{,}6 \approx 3{,}5$.
```

Qualche accelerazione, con i tempi per arrivare da $0$ a $100\,\text{km/h}$ calcolati come nell'esempio 2:

| Moto | Accelerazione media |
|---|---|
| utilitaria, da $0$ a $100\,\text{km/h}$ in $12\,\text{s}$ | $2{,}3\,\text{m/s}^2$ |
| auto sportiva, da $0$ a $100\,\text{km/h}$ in $4{,}0\,\text{s}$ | $6{,}9\,\text{m/s}^2$ |
| un sasso che cade, senza attrito dell'aria | $9{,}8\,\text{m/s}^2$ |

L'ultima riga è l'accelerazione di gravità $g$, che si studia nella lezione [La caduta libera e il lancio verticale](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale).

## Il segno dell'accelerazione

L'accelerazione ha il segno di $\Delta v = v_2 - v_1$: è positiva quando la velocità, con il suo segno, aumenta, ed è negativa quando diminuisce. Quando un'auto frena, andando nel verso positivo, la velocità diminuisce e l'accelerazione è negativa.

```ad-example
Esempio 3: una frenata
Un'auto che va a $20\,\text{m/s}$ frena e si ferma in $4{,}0\,\text{s}$. Qual è la sua accelerazione media?

$$a_m = \frac{0\,\text{m/s} - 20\,\text{m/s}}{4{,}0\,\text{s}} = -5{,}0\,\text{m/s}^2$$

Il segno meno dice che la velocità cala: ogni secondo l'auto perde $5{,}0\,\text{m/s}$.
```

Il segno dell'accelerazione da solo non dice se il corpo accelera o frena: bisogna confrontarlo con il segno della velocità. Un corpo va sempre più veloce quando velocità e accelerazione hanno lo stesso segno, cioè quando i due vettori hanno lo stesso verso; frena quando hanno segni opposti, cioè versi opposti. I casi sono quattro:

```tikz
% nome: segno-velocita-accelerazione-quattro-casi
% alt: Quattro righe, ognuna con le posizioni di un'auto a intervalli di un secondo e la sua velocità, una freccia blu scura, in ogni posizione; a destra l'accelerazione, una freccia verde. Prima riga: velocità verso destra sempre più lunghe, accelerazione verso destra, l'auto accelera. Seconda riga: velocità verso destra sempre più corte, accelerazione verso sinistra, l'auto frena. Terza riga: velocità verso sinistra sempre più lunghe, accelerazione verso sinistra, l'auto accelera. Quarta riga: velocità verso sinistra sempre più corte, accelerazione verso destra, l'auto frena
% svg: segno-velocita-accelerazione-quattro-casi-6764c4ee.svg 410x168
\begin{tikzpicture}
\draw[->] (-0.3,0.9) -- (5.6,0.9) node[right] {$s$};
\foreach \x/\l in {0/0.5,1.1/0.75,2.45/1.0,4.05/1.25} {\fill (\x,0) circle (1.5pt); \draw[-{Stealth}, thick, blue!60!black] (\x,0) -- ++(\l,0);}
\draw[-{Stealth}, thick, green!50!black] (6.2,0) -- (6.9,0);
\node[right] at (7.1,0) {\small $v > 0$, $a > 0$: accelera};
\foreach \x/\l in {0/1.25,1.6/1.0,2.95/0.75,4.05/0.5} {\fill (\x,-1) circle (1.5pt); \draw[-{Stealth}, thick, blue!60!black] (\x,-1) -- ++(\l,0);}
\draw[-{Stealth}, thick, green!50!black] (6.9,-1) -- (6.2,-1);
\node[right] at (7.1,-1) {\small $v > 0$, $a < 0$: frena};
\foreach \x/\l in {5.3/0.5,4.2/0.75,2.85/1.0,1.25/1.25} {\fill (\x,-2) circle (1.5pt); \draw[-{Stealth}, thick, blue!60!black] (\x,-2) -- ++(-\l,0);}
\draw[-{Stealth}, thick, green!50!black] (6.9,-2) -- (6.2,-2);
\node[right] at (7.1,-2) {\small $v < 0$, $a < 0$: accelera};
\foreach \x/\l in {5.3/1.25,3.7/1.0,2.35/0.75,1.25/0.5} {\fill (\x,-3) circle (1.5pt); \draw[-{Stealth}, thick, blue!60!black] (\x,-3) -- ++(-\l,0);}
\draw[-{Stealth}, thick, green!50!black] (6.2,-3) -- (6.9,-3);
\node[right] at (7.1,-3) {\small $v < 0$, $a > 0$: frena};
\node[above] at (6.55,0.15) {$\vec{a}$};
\end{tikzpicture}
```

| Velocità | Accelerazione | Il corpo |
|---|---|---|
| positiva | positiva | va sempre più veloce |
| positiva | negativa | frena |
| negativa | negativa | va sempre più veloce |
| negativa | positiva | frena |

```ad-example
Esempio 4: una frenata con l'accelerazione positiva
Un carrello si muove nel verso negativo della retta. All'istante $t_1 = 1{,}0\,\text{s}$ la sua velocità è $v_1 = -12\,\text{m/s}$, all'istante $t_2 = 3{,}0\,\text{s}$ è $v_2 = -4{,}0\,\text{m/s}$. Qual è la sua accelerazione media? Il carrello accelera o frena?

$$a_m = \frac{-4{,}0\,\text{m/s} - (-12\,\text{m/s})}{3{,}0\,\text{s} - 1{,}0\,\text{s}} = \frac{8{,}0\,\text{m/s}}{2{,}0\,\text{s}} = 4{,}0\,\text{m/s}^2$$

L'accelerazione è positiva, ma il carrello frena: va da $12\,\text{m/s}$ a $4{,}0\,\text{m/s}$, sempre nel verso negativo. Velocità e accelerazione hanno segni opposti.
```

```ad-warning
Accelerazione negativa non vuol dire frenare
Nel linguaggio di tutti i giorni "accelerare" vuol dire andare più veloce e "decelerare" andare più piano, e viene da pensare che un'accelerazione negativa sia sempre una frenata. Non è così: nell'esempio 4 il carrello frena con un'accelerazione positiva, e un corpo che va nel verso negativo sempre più veloce ha un'accelerazione negativa. Il segno dipende dal verso scelto per la retta; frenare o accelerare dipende dal confronto con il segno della velocità.
```

```ad-warning
Il meno davanti alla parentesi
Nell'esempio 4 la variazione è $-4{,}0 - (-12) = -4{,}0 + 12 = 8{,}0\,\text{m/s}$. Chi scrive $-4{,}0 - 12 = -16\,\text{m/s}$ perde un segno e trova $a_m = -8{,}0\,\text{m/s}^2$, sbagliato nel valore e nel segno.
```

## Velocità che cambia e tempo che serve

Dalla definizione si ricavano le altre due formule, come per la velocità: la variazione di velocità in un intervallo è $\Delta v = a_m\,\Delta t$, e il tempo che serve per una certa variazione è $\Delta t = \Delta v / a_m$.

```ad-example
Esempio 5: un treno che lascia la stazione
Un treno va a $5{,}0\,\text{m/s}$ e accelera con un'accelerazione media di $0{,}40\,\text{m/s}^2$. Quanto tempo gli serve per arrivare a $25\,\text{m/s}$?

$$\Delta t = \frac{\Delta v}{a_m} = \frac{25\,\text{m/s} - 5{,}0\,\text{m/s}}{0{,}40\,\text{m/s}^2} = \frac{20\,\text{m/s}}{0{,}40\,\text{m/s}^2} = 50\,\text{s}$$

L'unità torna: $\dfrac{\text{m/s}}{\text{m/s}^2} = \text{s}$.
```

Se l'accelerazione resta la stessa in ogni istante, la velocità cresce di quantità uguali in tempi uguali, e il moto si chiama uniformemente accelerato: la sua legge oraria e la formula $v = v_0 + a\,t$ sono nella lezione [Il moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato). Se l'accelerazione è zero la velocità non cambia, e il moto è il [moto rettilineo uniforme](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-rettilineo-uniforme-e-il-grafico-spazio-tempo).

## L'accelerazione istantanea

L'accelerazione media di un'auto su tutto un viaggio dice poco di quello che succede quando parte o quando frena. Come per la velocità, l'**accelerazione istantanea** $a$ è l'accelerazione media su un intervallo di tempo così piccolo che, dentro l'intervallo, l'accelerazione non fa in tempo a cambiare.

Anche la lettura sui grafici è la stessa della velocità, spostata di un gradino. Nel grafico velocità-tempo, con $t$ in orizzontale e $v$ in verticale, l'accelerazione media tra due istanti è la pendenza della secante, e l'accelerazione istantanea è la pendenza della tangente. Per lo scooter dell'esempio 1, se l'accelerazione è costante, il grafico è una retta con pendenza $2{,}0\,\text{m/s}^2$.

```tikz
% nome: accelerazione-pendenza-velocita-tempo
% alt: Grafico velocità-tempo dello scooter tra 0 e 6 secondi: una retta che sale da 4 metri al secondo a 16 metri al secondo. Un triangolo tratteggiato arancione mostra Delta t uguale a 6 secondi e Delta v uguale a 12 metri al secondo; la pendenza è l'accelerazione, 2 metri al secondo quadrato
% svg: accelerazione-pendenza-velocita-tempo-bd20474a.svg 292x220
% poi-interattivo: cambiare l'accelerazione con un cursore e vedere la retta velocità-tempo ruotare, con la pendenza scritta accanto
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.8, ystep=0.5] (0,0) grid (5.2,4.3);
\draw[->] (0,0) -- (5.6,0) node[right] {$t$ (s)};
\draw[->] (0,0) -- (0,4.7) node[above] {$v$ (m/s)};
\foreach \x/\t in {0.8/1,1.6/2,2.4/3,3.2/4,4/5,4.8/6} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/4,2/8,3/12,4/16} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,1) -- (4.8,4);
\draw[dashed, orange!90!black, thick] (0,1) -- (4.8,1) -- (4.8,4);
\fill[orange!90!black] (0,1) circle (2pt);
\fill[orange!90!black] (4.8,4) circle (2pt);
\node[below, orange!90!black] at (2.4,1) {\small $\Delta t = 6{,}0$ s};
\node[right, orange!90!black] at (4.8,2.5) {\small $\Delta v = 12$ m/s};
\end{tikzpicture}
```
```grafico
% nome: retta-velocita-tempo-segni-cursori
% alt: Il grafico velocità-tempo di un moto con accelerazione costante, una retta che parte dalla velocità iniziale v0 e ha per pendenza l'accelerazione a, con due cursori: v0 da -16 a 16 metri al secondo e a da -5 a 5 metri al secondo quadrato. Con a positiva la retta sale, con a negativa scende; quando si avvicina all'asse dei tempi il corpo frena, quando se ne allontana va sempre più veloce
curva: \begin{cases}v_0+ax & x\ge0\end{cases}
cursore: v_0 = 4 da -16 a 16 passo 1
cursore: a = 2 da -5 a 5 passo 0,5
finestra: x da -0,6 a 6,5, y da -20 a 20
forma: 3:2
assi: t (s), v (m/s)
domanda: All'inizio la retta è quella dello scooter. Metti $v_0 = -16$ m/s e $a = 4$ m/s²: è il carrello dell'esempio 4, che a $1$ s va a $-12$ m/s e a $3$ s a $-4$ m/s. La retta sale, eppure il carrello frena finché la retta si avvicina all'asse dei tempi: in quale istante si ferma, e che cosa fa dopo? Poi prova $v_0 = -4$ e $a = -2$.
```

Il grafico velocità-tempo, con le sue pendenze e le sue aree, è l'argomento della lezione [Il grafico velocità-tempo](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-grafico-velocita-tempo).

```ad-warning
Velocità grande non vuol dire accelerazione grande
Un aereo in volo di crociera va a $250\,\text{m/s}$ con accelerazione zero, perché la sua velocità non cambia; uno scooter fermo al semaforo che parte ha velocità zero e accelerazione diversa da zero. L'accelerazione non dice quanto va veloce un corpo, ma quanto rapidamente cambia la sua velocità.
```
