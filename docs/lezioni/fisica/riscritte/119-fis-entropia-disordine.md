# Entropia e disordine

Una goccia d'inchiostro lasciata cadere in un bicchiere d'acqua si sparge fino a colorare tutta l'acqua, e non torna mai a raccogliersi in una goccia. Un gas chiuso in metà di un recipiente, tolta la parete, lo riempie tutto e non rientra nella metà di partenza. Eppure le molecole si urtano seguendo le leggi della meccanica, che funzionano allo stesso modo in avanti e all'indietro. La lezione sull'[entropia](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/l-entropia) ha detto che in queste trasformazioni l'entropia dell'universo aumenta; questa lezione dice perché, contando in quanti modi le molecole si possono disporre.

## Macrostati e microstati

Prendi una scatola divisa idealmente in due metà uguali, sinistra e destra, con dentro quattro molecole di gas, che numeriamo da 1 a 4 per distinguerle. Lo stato della scatola si può descrivere in due modi.

- Il **microstato** dice dove si trova ogni singola molecola: per esempio "la 1 e la 3 a sinistra, la 2 e la 4 a destra".
- Il **macrostato** dice solo quante molecole ci sono in ciascuna metà, senza dire quali: per esempio "due a sinistra e due a destra".

Il macrostato è quello che si può misurare: la pressione e la densità del gas in una metà dipendono da quante molecole contiene, non da quali. Lo stesso macrostato si realizza con più microstati diversi, e il loro numero è la **molteplicità** del macrostato, che indichiamo con $\Omega$ (la lettera greca omega maiuscola).

Ogni molecola ha due possibilità, sinistra o destra, indipendenti da quelle delle altre: i microstati in tutto sono $2 \cdot 2 \cdot 2 \cdot 2 = 2^4 = 16$. La figura li mostra tutti, raggruppati per macrostato; $N_s$ è il numero di molecole a sinistra.

```tikz
% nome: microstati-quattro-molecole
% alt: I sedici microstati di quattro molecole numerate in una scatola divisa in due metà, raggruppati in cinque righe secondo il numero di molecole a sinistra. Con quattro a sinistra c'è un solo microstato; con tre a sinistra ce ne sono quattro; con due a sinistra sei; con una a sinistra quattro; con nessuna a sinistra uno solo
% svg: microstati-quattro-molecole-46864478.svg 280x205
\begin{tikzpicture}
\node[left] at (-0.1,0.35) {\small $N_s = 4$};
\node[right] at (4.90,0.35) {\small $\Omega = 1$};
\draw[thick] (0.00,0.00) rectangle (1.10,0.70);
\draw[dashed, thin] (0.55,0.00) -- (0.55,0.70);
\node at (0.14,0.52) {\scriptsize $1$};
\node at (0.41,0.52) {\scriptsize $2$};
\node at (0.14,0.18) {\scriptsize $3$};
\node at (0.41,0.18) {\scriptsize $4$};
\node[left] at (-0.1,-0.57) {\small $N_s = 3$};
\node[right] at (4.90,-0.57) {\small $\Omega = 4$};
\draw[thick] (0.00,-0.92) rectangle (1.10,-0.22);
\draw[dashed, thin] (0.55,-0.92) -- (0.55,-0.22);
\node at (0.14,-0.40) {\scriptsize $1$};
\node at (0.41,-0.40) {\scriptsize $2$};
\node at (0.14,-0.74) {\scriptsize $3$};
\node at (0.96,-0.74) {\scriptsize $4$};
\draw[thick] (1.25,-0.92) rectangle (2.35,-0.22);
\draw[dashed, thin] (1.80,-0.92) -- (1.80,-0.22);
\node at (1.39,-0.40) {\scriptsize $1$};
\node at (1.66,-0.40) {\scriptsize $2$};
\node at (1.94,-0.74) {\scriptsize $3$};
\node at (1.66,-0.74) {\scriptsize $4$};
\draw[thick] (2.50,-0.92) rectangle (3.60,-0.22);
\draw[dashed, thin] (3.05,-0.92) -- (3.05,-0.22);
\node at (2.64,-0.40) {\scriptsize $1$};
\node at (3.46,-0.40) {\scriptsize $2$};
\node at (2.64,-0.74) {\scriptsize $3$};
\node at (2.91,-0.74) {\scriptsize $4$};
\draw[thick] (3.75,-0.92) rectangle (4.85,-0.22);
\draw[dashed, thin] (4.30,-0.92) -- (4.30,-0.22);
\node at (4.44,-0.40) {\scriptsize $1$};
\node at (4.16,-0.40) {\scriptsize $2$};
\node at (3.89,-0.74) {\scriptsize $3$};
\node at (4.16,-0.74) {\scriptsize $4$};
\node[left] at (-0.1,-1.49) {\small $N_s = 2$};
\node[right] at (4.90,-1.49) {\small $\Omega = 6$};
\draw[thick] (0.00,-1.84) rectangle (1.10,-1.14);
\draw[dashed, thin] (0.55,-1.84) -- (0.55,-1.14);
\node at (0.14,-1.32) {\scriptsize $1$};
\node at (0.41,-1.32) {\scriptsize $2$};
\node at (0.69,-1.66) {\scriptsize $3$};
\node at (0.96,-1.66) {\scriptsize $4$};
\draw[thick] (1.25,-1.84) rectangle (2.35,-1.14);
\draw[dashed, thin] (1.80,-1.84) -- (1.80,-1.14);
\node at (1.39,-1.32) {\scriptsize $1$};
\node at (2.21,-1.32) {\scriptsize $2$};
\node at (1.39,-1.66) {\scriptsize $3$};
\node at (2.21,-1.66) {\scriptsize $4$};
\draw[thick] (2.50,-1.84) rectangle (3.60,-1.14);
\draw[dashed, thin] (3.05,-1.84) -- (3.05,-1.14);
\node at (2.64,-1.32) {\scriptsize $1$};
\node at (3.46,-1.32) {\scriptsize $2$};
\node at (3.19,-1.66) {\scriptsize $3$};
\node at (2.91,-1.66) {\scriptsize $4$};
\draw[thick] (3.75,-1.84) rectangle (4.85,-1.14);
\draw[dashed, thin] (4.30,-1.84) -- (4.30,-1.14);
\node at (4.44,-1.32) {\scriptsize $1$};
\node at (4.16,-1.32) {\scriptsize $2$};
\node at (3.89,-1.66) {\scriptsize $3$};
\node at (4.71,-1.66) {\scriptsize $4$};
\draw[thick] (0.00,-2.76) rectangle (1.10,-2.06);
\draw[dashed, thin] (0.55,-2.76) -- (0.55,-2.06);
\node at (0.69,-2.24) {\scriptsize $1$};
\node at (0.41,-2.24) {\scriptsize $2$};
\node at (0.69,-2.58) {\scriptsize $3$};
\node at (0.41,-2.58) {\scriptsize $4$};
\draw[thick] (1.25,-2.76) rectangle (2.35,-2.06);
\draw[dashed, thin] (1.80,-2.76) -- (1.80,-2.06);
\node at (1.94,-2.24) {\scriptsize $1$};
\node at (2.21,-2.24) {\scriptsize $2$};
\node at (1.39,-2.58) {\scriptsize $3$};
\node at (1.66,-2.58) {\scriptsize $4$};
\node[left] at (-0.1,-3.33) {\small $N_s = 1$};
\node[right] at (4.90,-3.33) {\small $\Omega = 4$};
\draw[thick] (0.00,-3.68) rectangle (1.10,-2.98);
\draw[dashed, thin] (0.55,-3.68) -- (0.55,-2.98);
\node at (0.14,-3.16) {\scriptsize $1$};
\node at (0.96,-3.16) {\scriptsize $2$};
\node at (0.69,-3.50) {\scriptsize $3$};
\node at (0.96,-3.50) {\scriptsize $4$};
\draw[thick] (1.25,-3.68) rectangle (2.35,-2.98);
\draw[dashed, thin] (1.80,-3.68) -- (1.80,-2.98);
\node at (1.94,-3.16) {\scriptsize $1$};
\node at (1.66,-3.16) {\scriptsize $2$};
\node at (1.94,-3.50) {\scriptsize $3$};
\node at (2.21,-3.50) {\scriptsize $4$};
\draw[thick] (2.50,-3.68) rectangle (3.60,-2.98);
\draw[dashed, thin] (3.05,-3.68) -- (3.05,-2.98);
\node at (3.19,-3.16) {\scriptsize $1$};
\node at (3.46,-3.16) {\scriptsize $2$};
\node at (2.64,-3.50) {\scriptsize $3$};
\node at (3.46,-3.50) {\scriptsize $4$};
\draw[thick] (3.75,-3.68) rectangle (4.85,-2.98);
\draw[dashed, thin] (4.30,-3.68) -- (4.30,-2.98);
\node at (4.44,-3.16) {\scriptsize $1$};
\node at (4.71,-3.16) {\scriptsize $2$};
\node at (4.44,-3.50) {\scriptsize $3$};
\node at (4.16,-3.50) {\scriptsize $4$};
\node[left] at (-0.1,-4.25) {\small $N_s = 0$};
\node[right] at (4.90,-4.25) {\small $\Omega = 1$};
\draw[thick] (0.00,-4.60) rectangle (1.10,-3.90);
\draw[dashed, thin] (0.55,-4.60) -- (0.55,-3.90);
\node at (0.69,-4.08) {\scriptsize $1$};
\node at (0.96,-4.08) {\scriptsize $2$};
\node at (0.69,-4.42) {\scriptsize $3$};
\node at (0.96,-4.42) {\scriptsize $4$};
\end{tikzpicture}
```

| Molecole a sinistra $N_s$ | Molecole a destra $N_d$ | Microstati $\Omega$ | Probabilità |
|---|---|---|---|
| 4 | 0 | 1 | $1/16 = 6{,}25\,\%$ |
| 3 | 1 | 4 | $4/16 = 25\,\%$ |
| 2 | 2 | 6 | $6/16 = 37{,}5\,\%$ |
| 1 | 3 | 4 | $4/16 = 25\,\%$ |
| 0 | 4 | 1 | $1/16 = 6{,}25\,\%$ |

L'ultima colonna viene dall'ipotesi su cui si regge tutto il ragionamento: le molecole si muovono a caso, e a lungo andare **tutti i microstati sono ugualmente probabili**. Non c'è motivo per cui la disposizione "1 e 3 a sinistra" debba presentarsi più spesso di "tutte a sinistra". Allora la [probabilità](/materiale/scuola-superiore/matematica/probabilita/eventi-e-probabilita) di un macrostato è il numero dei suoi microstati diviso per il numero totale:

$$P = \frac{\Omega}{2^N}$$

dove $N$ è il numero di molecole. Il macrostato "due e due" è il più probabile non perché le molecole lo preferiscano, ma perché si può realizzare in più modi.

```ad-warning
Ugualmente probabili sono i microstati, non i macrostati
Il microstato "tutte a sinistra" ha la stessa probabilità di qualunque altro microstato, $1/16$. È il macrostato "due e due" a essere sei volte più probabile del macrostato "tutte a sinistra", perché raccoglie sei microstati.
```

## Contare i microstati

Con molte molecole i microstati non si possono elencare, ma si possono contare. Il numero di modi di scegliere quali $N_s$ molecole, tra le $N$, stanno a sinistra è

$$\Omega = \frac{N!}{N_s!\;N_d!} \qquad \text{con } N_d = N - N_s$$

Il punto esclamativo indica il **fattoriale**: $N!$ è il prodotto di tutti i numeri interi da 1 a $N$, per esempio $4! = 4 \cdot 3 \cdot 2 \cdot 1 = 24$, e per convenzione $0! = 1$. La formula si dimostra nel calcolo combinatorio, che in matematica si studia più avanti; qui la usiamo, e la figura con i sedici microstati permette di controllarla.

```ad-example
Esempio 1: quattro molecole
Verifica con la formula che per quattro molecole il macrostato con due molecole a sinistra ha 6 microstati e quello con tre molecole a sinistra ne ha 4.

Con $N = 4$ e $N_s = 2$ si ha $N_d = 2$:

$$\Omega = \frac{4!}{2!\;2!} = \frac{24}{2 \cdot 2} = 6$$

Con $N_s = 3$ si ha $N_d = 1$:

$$\Omega = \frac{4!}{3!\;1!} = \frac{24}{6 \cdot 1} = 4$$

Sono i numeri che si contano nella figura.
```

```ad-example
Esempio 2: dieci molecole
In una scatola ci sono 10 molecole. Qual è la probabilità di trovarne 5 per parte? E quella di trovarle tutte a sinistra? Quante volte la prima è più grande della seconda?

I microstati in tutto sono $2^{10} = 1024$. Per il macrostato con $N_s = 5$ conviene semplificare i fattoriali prima di moltiplicare:

$$\Omega = \frac{10!}{5!\;5!} = \frac{10 \cdot 9 \cdot 8 \cdot 7 \cdot 6}{5 \cdot 4 \cdot 3 \cdot 2 \cdot 1} = \frac{30\,240}{120} = 252$$

$$P = \frac{\Omega}{2^N} = \frac{252}{1024} = 0{,}246\ldots \approx 24{,}6\,\%$$

Il macrostato "tutte a sinistra" ha un solo microstato: $P = 1/1024 \approx 0{,}098\,\%$, meno di una volta su mille. Il rapporto tra le due probabilità è il rapporto tra le molteplicità, $252$.
```

La figura mostra le molteplicità di tutti i macrostati di dieci molecole. I macrostati vicini alla divisione a metà raccolgono quasi tutti i microstati: quelli con 4, 5 o 6 molecole a sinistra ne hanno insieme $210 + 252 + 210 = 672$ su 1024, il $65{,}6\,\%$.

```tikz
% nome: molteplicita-dieci-molecole
% alt: Grafico a barre della molteplicità dei macrostati di dieci molecole in funzione del numero di molecole a sinistra, da 0 a 10. Le altezze sono 1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1: il grafico è simmetrico, con il massimo, evidenziato, a cinque molecole per parte
% svg: molteplicita-dieci-molecole-5950fa35.svg 262x191
\begin{tikzpicture}
\draw[->] (-0.2,0) -- (6.0,0) node[right] {\small $N_s$};
\draw[->] (0,-0.2) -- (0,4.3) node[right] {\small $\Omega$};
\draw[thick, fill=blue!10] (0.25,0) rectangle (0.65,0.014);
\node[below] at (0.45,0) {\small $0$};
\node[above] at (0.45,0.014) {\scriptsize $1$};
\draw[thick, fill=blue!10] (0.75,0) rectangle (1.15,0.139);
\node[below] at (0.95,0) {\small $1$};
\node[above] at (0.95,0.139) {\scriptsize $10$};
\draw[thick, fill=blue!10] (1.25,0) rectangle (1.65,0.625);
\node[below] at (1.45,0) {\small $2$};
\node[above] at (1.45,0.625) {\scriptsize $45$};
\draw[thick, fill=blue!10] (1.75,0) rectangle (2.15,1.667);
\node[below] at (1.95,0) {\small $3$};
\node[above] at (1.95,1.667) {\scriptsize $120$};
\draw[thick, fill=blue!10] (2.25,0) rectangle (2.65,2.917);
\node[below] at (2.45,0) {\small $4$};
\node[above] at (2.45,2.917) {\scriptsize $210$};
\draw[thick, fill=orange!25] (2.75,0) rectangle (3.15,3.500);
\node[below] at (2.95,0) {\small $5$};
\node[above] at (2.95,3.500) {\scriptsize $252$};
\draw[thick, fill=blue!10] (3.25,0) rectangle (3.65,2.917);
\node[below] at (3.45,0) {\small $6$};
\node[above] at (3.45,2.917) {\scriptsize $210$};
\draw[thick, fill=blue!10] (3.75,0) rectangle (4.15,1.667);
\node[below] at (3.95,0) {\small $7$};
\node[above] at (3.95,1.667) {\scriptsize $120$};
\draw[thick, fill=blue!10] (4.25,0) rectangle (4.65,0.625);
\node[below] at (4.45,0) {\small $8$};
\node[above] at (4.45,0.625) {\scriptsize $45$};
\draw[thick, fill=blue!10] (4.75,0) rectangle (5.15,0.139);
\node[below] at (4.95,0) {\small $9$};
\node[above] at (4.95,0.139) {\scriptsize $10$};
\draw[thick, fill=blue!10] (5.25,0) rectangle (5.65,0.014);
\node[below] at (5.45,0) {\small $10$};
\node[above] at (5.45,0.014) {\scriptsize $1$};
\end{tikzpicture}
```

## Le molecole si distribuiscono

Nella figura qui sotto scegli il numero di molecole, che partono tutte nella metà sinistra, e togli la parete. Le molecole si muovono a caso; sotto la scatola le barre mostrano la molteplicità di ogni macrostato, con evidenziato quello in cui la scatola si trova in ogni istante. La domanda è: dopo che la parete è stata tolta, le molecole tornano mai tutte a sinistra? Prova con 4 molecole e poi con 40.

```interattivo
% nome: molecole-due-meta-microstati
% alt: Una scatola divisa in due metà da una linea tratteggiata, con un numero di molecole scelto con un cursore, da 4 a 60, che partono tutte nella metà sinistra dietro una parete. Un bottone toglie la parete e le molecole si muovono a caso in tutta la scatola. Sotto, un grafico a barre mostra la molteplicità di ogni macrostato, con evidenziato quello attuale. Sono scritti il numero di molecole a sinistra e a destra, il numero di microstati del macrostato attuale, la sua probabilità e la frazione del tempo passata con tutte le molecole a sinistra
```

Con 4 molecole le ritrovi tutte a sinistra abbastanza spesso, circa il $6\,\%$ del tempo, come dice la tabella. Con 40 molecole il macrostato attuale resta sempre vicino al centro delle barre, e "tutte a sinistra" non si ripresenta: la sua probabilità è $1/2^{40}$, circa una su mille miliardi. Nessuna legge vieta alle molecole di tornare indietro. È che i microstati in cui sono divise più o meno a metà sono enormemente più numerosi.

## Con tante molecole l'improbabile diventa mai

Al crescere del numero di molecole i microstati si concentrano sempre di più attorno alla divisione a metà. Il grafico mostra la molteplicità, divisa per il suo valore massimo, in funzione della frazione di molecole che sta a sinistra, per $N = 10$, $N = 100$ e $N = 1000$.

```tikz
% nome: molteplicita-si-stringe
% alt: Grafico della molteplicità divisa per il suo valore massimo in funzione della frazione di molecole a sinistra, da 0 a 1, per tre numeri di molecole. Tutte e tre le curve hanno il massimo a 0,5. Quella per 10 molecole è una campana larga; quella per 100 molecole è più stretta e scende quasi a zero fuori dall'intervallo tra 0,35 e 0,65; quella per 1000 molecole è un picco sottile attorno a 0,5
% svg: molteplicita-si-stringe-d298165f.svg 237x191
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=1, ystep=1] (5,3);
\draw[->] (-0.2,0) -- (5.5,0);
\node at (2.5,-0.85) {\small frazione di molecole a sinistra};
\draw[->] (0,-0.2) -- (0,3.6) node[right] {\small $\Omega / \Omega_{max}$};
\node[below] at (0,0) {\small $0$};
\node[below] at (1.25,0) {\small $0{,}25$};
\node[below] at (2.5,0) {\small $0{,}5$};
\node[below] at (3.75,0) {\small $0{,}75$};
\node[below] at (5,0) {\small $1$};
\node[left] at (0,1.5) {\small $0{,}5$};
\node[left] at (0,3) {\small $1$};
\draw[thick, blue] (0.000,0.012) -- (0.500,0.119) -- (1.000,0.536) -- (1.500,1.429) -- (2.000,2.500) -- (2.500,3.000) -- (3.000,2.500) -- (3.500,1.429) -- (4.000,0.536) -- (4.500,0.119) -- (5.000,0.012);
\draw[thick, orange!90!black] (1.250,0.000) -- (1.300,0.000) -- (1.350,0.000) -- (1.400,0.000) -- (1.450,0.000) -- (1.500,0.001) -- (1.550,0.002) -- (1.600,0.004) -- (1.650,0.009) -- (1.700,0.017) -- (1.750,0.033) -- (1.800,0.059) -- (1.850,0.102) -- (1.900,0.169) -- (1.950,0.268) -- (2.000,0.409) -- (2.050,0.598) -- (2.100,0.840) -- (2.150,1.133) -- (2.200,1.468) -- (2.250,1.827) -- (2.300,2.185) -- (2.350,2.510) -- (2.400,2.771) -- (2.450,2.941) -- (2.500,3.000) -- (2.550,2.941) -- (2.600,2.771) -- (2.650,2.510) -- (2.700,2.185) -- (2.750,1.827) -- (2.800,1.468) -- (2.850,1.133) -- (2.900,0.840) -- (2.950,0.598) -- (3.000,0.409) -- (3.050,0.268) -- (3.100,0.169) -- (3.150,0.102) -- (3.200,0.059) -- (3.250,0.033) -- (3.300,0.017) -- (3.350,0.009) -- (3.400,0.004) -- (3.450,0.002) -- (3.500,0.001) -- (3.550,0.000) -- (3.600,0.000) -- (3.650,0.000) -- (3.700,0.000) -- (3.750,0.000);
\draw[thick, green!50!black] (2.150,0.000) -- (2.170,0.000) -- (2.190,0.001) -- (2.210,0.004) -- (2.230,0.009) -- (2.250,0.020) -- (2.270,0.043) -- (2.290,0.088) -- (2.310,0.167) -- (2.330,0.297) -- (2.350,0.496) -- (2.370,0.777) -- (2.390,1.140) -- (2.410,1.570) -- (2.430,2.028) -- (2.450,2.457) -- (2.470,2.792) -- (2.490,2.976) -- (2.510,2.976) -- (2.530,2.792) -- (2.550,2.457) -- (2.570,2.028) -- (2.590,1.570) -- (2.610,1.140) -- (2.630,0.777) -- (2.650,0.496) -- (2.670,0.297) -- (2.690,0.167) -- (2.710,0.088) -- (2.730,0.043) -- (2.750,0.020) -- (2.770,0.009) -- (2.790,0.004) -- (2.810,0.001) -- (2.830,0.000) -- (2.850,0.000);
\node[blue] at (0.75,1.2) {\small $N = 10$};
\node[orange!90!black] at (1.1,2.65) {\small $N = 100$};
\node[green!50!black] at (3.7,2.9) {\small $N = 1000$};
\end{tikzpicture}
```

Con 100 molecole il $96{,}5\,\%$ dei microstati ha tra 40 e 60 molecole a sinistra, e la probabilità di trovarle tutte a sinistra è

$$P = \frac{1}{2^{100}} \approx 7{,}9 \cdot 10^{-31}$$

meno di una su mille miliardi di miliardi di miliardi. In un bicchiere d'aria le molecole non sono cento ma circa $10^{22}$: il picco diventa così stretto che la differenza tra le due metà non si riesce a misurare, e il ritorno spontaneo di tutto il gas in una metà ha una probabilità che nessuno ha mai scritto per esteso. Lo **stato di equilibrio** di un sistema è il macrostato con più microstati; un sistema lasciato a sé stesso ci va, e ci resta, perché quasi tutti i microstati stanno lì.

## L'equazione di Boltzmann

Il macrostato verso cui il gas evolve è quello con la molteplicità più grande, ed è anche quello con l'entropia più grande. Il legame tra le due grandezze lo trovò il fisico austriaco Ludwig Boltzmann nella seconda metà dell'Ottocento:

$$S = k_B \ln \Omega$$

L'entropia di un macrostato è la [costante di Boltzmann](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto) $k_B = 1{,}38 \cdot 10^{-23}\,\text{J/K}$ moltiplicata per il [logaritmo](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta) naturale del numero dei suoi microstati. Il logaritmo è un numero puro, e l'unità $\text{J/K}$ viene dalla costante.

Il logaritmo serve a far tornare i conti quando si mettono insieme due sistemi. Se un sistema ha $\Omega_1$ microstati e un altro, indipendente, ne ha $\Omega_2$, per ogni microstato del primo ci sono tutti quelli del secondo: i due insieme hanno $\Omega_1 \cdot \Omega_2$ microstati. Le entropie invece si sommano, come le energie. Il logaritmo trasforma i prodotti in somme, $\ln(\Omega_1 \cdot \Omega_2) = \ln \Omega_1 + \ln \Omega_2$, e mette d'accordo le due cose.

Per la variazione di entropia tra uno stato iniziale $A$ e uno finale $B$, la differenza dei logaritmi è il logaritmo del rapporto:

$$\Delta S = k_B \ln \Omega_B - k_B \ln \Omega_A = k_B \ln \frac{\Omega_B}{\Omega_A}$$

Se i microstati aumentano, l'entropia aumenta.

```ad-note
La lettera per il numero di microstati
Molti libri scrivono la formula come $S = k_B \ln W$, con la lettera che usava Boltzmann. In queste lezioni $W$ è il lavoro, quindi per il numero di microstati usiamo $\Omega$, che è l'altra notazione diffusa.
```

```ad-example
Esempio 3: l'entropia di cento molecole
Per 100 molecole il macrostato con 50 molecole per parte ha $\Omega = 1{,}01 \cdot 10^{29}$ microstati. Quanto vale la sua entropia? E quella del macrostato con tutte le molecole a sinistra?

$$S = k_B \ln \Omega = 1{,}38 \cdot 10^{-23}\,\text{J/K} \cdot \ln(1{,}01 \cdot 10^{29}) = 1{,}38 \cdot 10^{-23}\,\text{J/K} \cdot 66{,}78\ldots \approx 9{,}22 \cdot 10^{-22}\,\text{J/K}$$

Il macrostato "tutte a sinistra" ha $\Omega = 1$, e $\ln 1 = 0$: la sua entropia è zero. Passando dal secondo al primo l'entropia aumenta di $9{,}22 \cdot 10^{-22}\,\text{J/K}$, un valore piccolissimo perché le molecole sono poche. Nota che un numero di microstati enorme, con 29 zeri, dà un logaritmo modesto, circa 67.
```

## L'espansione libera, contando i microstati

Con l'equazione di Boltzmann si ritrova un risultato della lezione sull'entropia. Un gas con $N$ molecole occupa la metà sinistra di un recipiente isolato; tolta la parete, si espande in tutto il recipiente e il suo volume raddoppia. Ogni molecola ora ha a disposizione il doppio dello spazio, quindi il doppio delle posizioni possibili, e questo vale per ciascuna delle $N$ molecole in modo indipendente: il numero dei microstati viene moltiplicato per $2$ una volta per ogni molecola,

$$\frac{\Omega_B}{\Omega_A} = 2^N$$

e la variazione di entropia è

$$\Delta S = k_B \ln 2^N = N\,k_B \ln 2$$

Se il volume passa da $V_A$ a $V_B$ con un rapporto qualsiasi, lo stesso ragionamento dà $\Omega_B / \Omega_A = (V_B / V_A)^N$ e

$$\Delta S = N\,k_B \ln\frac{V_B}{V_A}$$

Siccome $N\,k_B = n\,R$, dove $n$ è il numero di moli, questa è la formula $\Delta S = n\,R \ln(V_B / V_A)$ che la termodinamica ricava dal calore scambiato lungo un'isoterma reversibile. I due modi di calcolare l'entropia, quello con il calore e quello con i microstati, danno lo stesso numero.

```ad-example
Esempio 4: una mole di gas raddoppia il volume
Una mole di gas perfetto, chiusa in metà di un recipiente isolato, si espande liberamente in tutto il recipiente. Di quanto varia la sua entropia? Di quale fattore aumenta il numero dei microstati?

Le molecole sono $N = 6{,}02 \cdot 10^{23}$ e il volume raddoppia:

$$\Delta S = N\,k_B \ln 2 = 6{,}02 \cdot 10^{23} \cdot 1{,}38 \cdot 10^{-23}\,\text{J/K} \cdot \ln 2 = 8{,}3076\,\text{J/K} \cdot 0{,}6931\ldots \approx 5{,}76\,\text{J/K}$$

Il numero dei microstati viene moltiplicato per $2^N = 2^{6{,}02 \cdot 10^{23}}$, un numero con più di $10^{23}$ cifre. La probabilità di ritrovare per caso tutto il gas nella metà di partenza è l'inverso di questo numero: per tutti gli scopi pratici è zero.
```

## Che cosa vuol dire disordine

Si dice spesso che l'entropia misura il **disordine** di un sistema. La parola va presa nel senso preciso di questa lezione: uno stato è tanto più disordinato quanti più microstati lo realizzano, cioè quanto meno si sa su dove sono e che cosa fanno le singole molecole quando si conosce solo il macrostato. Il gas raccolto in una metà è più ordinato del gas sparso ovunque, perché "tutte a sinistra" lascia alle molecole meno possibilità. Un cristallo, con le molecole ferme ai loro posti, è più ordinato del liquido, e il liquido del vapore: per questo l'entropia aumenta nella fusione e nella vaporizzazione, come si calcola anche con $\Delta S = Q/T$.

Scaldare un corpo aumenta la sua entropia per la stessa ragione. Le molecole hanno più energia da spartirsi, e i modi di distribuirla tra loro aumentano. In questa lezione abbiamo contato solo le posizioni; in un conto completo i microstati tengono conto anche delle velocità.

```ad-warning
L'ordine può aumentare in una parte dell'universo
L'acqua che gela nel congelatore diventa più ordinata e la sua entropia diminuisce. Non c'è contraddizione con il secondo principio: il calore che l'acqua cede aumenta di più il numero di microstati dell'ambiente. Il conteggio va fatto sull'universo, cioè sul sistema insieme a tutto ciò con cui scambia energia.
```

## La freccia del tempo

Guarda il filmato di due palle da biliardo che si urtano: proiettato al contrario mostra un altro urto possibile, e non sapresti dire qual è il verso giusto. Guarda invece il filmato di un bicchiere che cade e va in pezzi: al contrario, con i cocci che si ricompongono e il bicchiere che salta sul tavolo, lo riconosci subito come impossibile. Il verso in cui scorre il tempo, quella che si chiama la **freccia del tempo**, non sta nelle leggi del moto delle singole particelle, che valgono in tutti e due i versi. Sta nel numero.

Ogni urto tra molecole, preso da solo, potrebbe avvenire al contrario. Ma un sistema fatto di moltissime particelle passa dai macrostati con pochi microstati a quelli con molti, e non viceversa, perché i secondi sono enormemente più probabili. Il secondo principio della termodinamica, visto così, è una legge statistica: l'entropia dell'universo aumenta perché l'universo evolve verso gli stati più probabili. La diminuzione non è vietata dalla meccanica, è così improbabile che non si osserva mai. Il passato e il futuro si distinguono da questo: il futuro è la direzione in cui l'entropia cresce.

```ad-example
Esempio 5: quale filmato è al contrario
Di ognuno dei tre filmati, di' se proiettato al contrario mostrerebbe qualcosa che si può osservare: (a) un pianeta che percorre la sua orbita attorno a una stella; (b) un cubetto di ghiaccio che fonde in un bicchiere d'acqua tiepida; (c) un pendolo che oscilla per pochi secondi, quasi senza attrito.

Nei filmati (a) e (c) non ci sono, o quasi, trasformazioni irreversibili: l'entropia dell'universo resta costante, e il filmato al contrario mostra un moto altrettanto possibile, con il pianeta e il pendolo che vanno nell'altro verso. Nel filmato (b) il calore passa dall'acqua tiepida al ghiaccio e l'entropia dell'universo aumenta: al contrario mostrerebbe un cubetto di ghiaccio che si forma da solo nell'acqua tiepida mentre il resto dell'acqua si scalda, con l'entropia dell'universo che diminuisce. Solo il filmato (b) dice in che verso scorre il tempo.
```

```ad-note
Il terzo principio della termodinamica
L'equazione di Boltzmann dà all'entropia uno zero naturale: un sistema con un solo microstato possibile ha $S = k_B \ln 1 = 0$. È quello che succede a un cristallo perfetto allo [zero assoluto](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche), dove ogni atomo sta fermo al suo posto nel reticolo. Il **terzo principio della termodinamica**, enunciato dal chimico tedesco Walther Nernst all'inizio del Novecento, dice che l'entropia di un cristallo perfetto tende a zero quando la temperatura tende allo zero assoluto, e che lo zero assoluto non si può raggiungere con un numero finito di trasformazioni: ci si può avvicinare quanto si vuole, senza arrivarci.
```
